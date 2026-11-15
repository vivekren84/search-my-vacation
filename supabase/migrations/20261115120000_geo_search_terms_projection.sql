-- 20261115120000_geo_search_terms_projection.sql
--
-- Destination search performance (R1.2 line, perf/compact-destination-search-r12).
-- Design: docs/09-Development/DESTINATION-SEARCH-PROJECTION-DESIGN.md
-- Rollback: supabase/rollbacks/20261115120000_geo_search_terms_projection.rollback.sql
--
-- Adds a narrow search projection, public.geo_search_terms, with one row per
-- canonical place name and one row per alias. Each row stores the
-- already-normalised search text (public.immutable_unaccent(lower(...))),
-- the value the current function recomputes for every trigram candidate.
-- Trigram rechecks then run on narrow rows with a stored value, and the full
-- place row is read only for the matched places.
--
-- Unchanged: search_geo_places signature, result columns, normalisation,
-- prefix and fuzzy predicates, match scores (2.0 / 1.9 / similarity),
-- DISTINCT ON and ordering, limit, statement_timeout (2000), SECURITY
-- INVOKER, and EXECUTE grants (create or replace keeps the ACL).
-- Existing geo_places / geo_aliases indexes are NOT dropped.

-- 1. Projection table ---------------------------------------------------------

create table public.geo_search_terms (
  geo_place_id text not null
    references public.geo_places (id) on update cascade on delete cascade,
  alias_id uuid
    references public.geo_aliases (id) on delete cascade,
  alias_text text,
  search_text text not null,
  constraint geo_search_terms_kind_chk check ((alias_id is null) = (alias_text is null))
);

comment on table public.geo_search_terms is
  'Derived search projection of geo_places.ascii_name and geo_aliases.alias_text (normalised with immutable_unaccent(lower(...))). Maintained only by triggers on geo_places/geo_aliases; never write directly. Used by search_geo_places.';

-- One canonical-name row per place, one row per alias.
create unique index geo_search_terms_place_name_uidx
  on public.geo_search_terms (geo_place_id) where alias_id is null;
create unique index geo_search_terms_alias_uidx
  on public.geo_search_terms (alias_id) where alias_id is not null;
-- Supports the geo_place_id foreign-key cascades for both row kinds.
create index geo_search_terms_geo_place_id_idx
  on public.geo_search_terms (geo_place_id);
-- Serves both the prefix LIKE and the % similarity predicate.
create index geo_search_terms_search_text_trgm_idx
  on public.geo_search_terms using gin (search_text gin_trgm_ops);

alter table public.geo_search_terms enable row level security;
-- Supabase default privileges grant ALL on new public tables to anon,
-- authenticated and service_role; revoke them all, then allow service_role
-- (the search function's caller) to read only. Writes happen solely through
-- the SECURITY DEFINER sync triggers below.
revoke all on table public.geo_search_terms from public, anon, authenticated, service_role;
grant select on table public.geo_search_terms to service_role;

-- 2. Synchronisation triggers (statement-level, set-based) -------------------
-- Inserts and updates are mirrored by the triggers below; deletes cascade
-- through the foreign keys above. The GeoNames importer upserts through
-- PostgREST (INSERT ... ON CONFLICT DO UPDATE), which fires the INSERT
-- trigger for new rows and the UPDATE trigger for existing rows.
-- SECURITY DEFINER keeps the projection read-only for service_role.

create function public.geo_search_terms_sync_places_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.geo_search_terms (geo_place_id, alias_id, alias_text, search_text)
  select n.id, null, null, public.immutable_unaccent(lower(n.ascii_name))
  from new_rows n
  on conflict (geo_place_id) where alias_id is null
  do update set search_text = excluded.search_text;
  return null;
end;
$$;

create function public.geo_search_terms_sync_places_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Id changes are already propagated by the ON UPDATE CASCADE foreign key.
  update public.geo_search_terms s
  set search_text = public.immutable_unaccent(lower(n.ascii_name))
  from new_rows n
  where s.alias_id is null
    and s.geo_place_id = n.id
    and s.search_text is distinct from public.immutable_unaccent(lower(n.ascii_name));
  return null;
end;
$$;

create function public.geo_search_terms_sync_aliases_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.geo_search_terms (geo_place_id, alias_id, alias_text, search_text)
  select n.geo_place_id, n.id, n.alias_text, public.immutable_unaccent(lower(n.alias_text))
  from new_rows n
  on conflict (alias_id) where alias_id is not null
  do update set geo_place_id = excluded.geo_place_id,
                alias_text = excluded.alias_text,
                search_text = excluded.search_text;
  return null;
end;
$$;

create function public.geo_search_terms_sync_aliases_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Alias id changes: drop the projection row for the old id; the insert below recreates it.
  delete from public.geo_search_terms s
  using old_rows o
  where s.alias_id = o.id
    and not exists (select 1 from new_rows n where n.id = o.id);

  insert into public.geo_search_terms (geo_place_id, alias_id, alias_text, search_text)
  select n.geo_place_id, n.id, n.alias_text, public.immutable_unaccent(lower(n.alias_text))
  from new_rows n
  on conflict (alias_id) where alias_id is not null
  do update set geo_place_id = excluded.geo_place_id,
                alias_text = excluded.alias_text,
                search_text = excluded.search_text;
  return null;
end;
$$;

revoke all on function public.geo_search_terms_sync_places_insert() from public, anon, authenticated, service_role;
revoke all on function public.geo_search_terms_sync_places_update() from public, anon, authenticated, service_role;
revoke all on function public.geo_search_terms_sync_aliases_insert() from public, anon, authenticated, service_role;
revoke all on function public.geo_search_terms_sync_aliases_update() from public, anon, authenticated, service_role;

create trigger geo_search_terms_sync_places_insert
  after insert on public.geo_places
  referencing new table as new_rows
  for each statement execute function public.geo_search_terms_sync_places_insert();

create trigger geo_search_terms_sync_places_update
  after update on public.geo_places
  referencing old table as old_rows new table as new_rows
  for each statement execute function public.geo_search_terms_sync_places_update();

create trigger geo_search_terms_sync_aliases_insert
  after insert on public.geo_aliases
  referencing new table as new_rows
  for each statement execute function public.geo_search_terms_sync_aliases_insert();

create trigger geo_search_terms_sync_aliases_update
  after update on public.geo_aliases
  referencing old table as old_rows new table as new_rows
  for each statement execute function public.geo_search_terms_sync_aliases_update();

-- 3. Backfill from the current data --------------------------------------------

insert into public.geo_search_terms (geo_place_id, alias_id, alias_text, search_text)
select p.id, null, null, public.immutable_unaccent(lower(p.ascii_name))
from public.geo_places p;

insert into public.geo_search_terms (geo_place_id, alias_id, alias_text, search_text)
select a.geo_place_id, a.id, a.alias_text, public.immutable_unaccent(lower(a.alias_text))
from public.geo_aliases a;

analyze public.geo_search_terms;

-- 4. search_geo_places: same contract, reads the projection --------------------

create or replace function public.search_geo_places(search_query text, result_limit int default 8)
returns table (
  geo_place_id text,
  canonical_name text,
  place_type text,
  country_code text,
  admin1_name text,
  admin2_name text,
  population integer,
  matched_alias text,
  match_score real
)
language plpgsql
stable
set statement_timeout to '2000'
as $func$
declare
  normalized_query text;
  prefix_pattern text;
  limit_value int;
  sql_text text;
begin
  normalized_query := public.immutable_unaccent(lower(trim(search_query)));
  prefix_pattern := normalized_query || '%';
  limit_value := greatest(result_limit, 0);

  -- Identical predicates and scores to 20260830013000: canonical-name rows
  -- (alias_id is null) score 2.0 on prefix, alias rows score 1.9 on prefix,
  -- otherwise similarity() of the same normalised text. Literals are inlined
  -- with %L, as before, so the planner sees the real search text.
  sql_text := format($sql$
    with matches as (
      select
        s.geo_place_id,
        s.alias_text as matched_alias,
        case
          when s.search_text like %L then (case when s.alias_id is null then 2.0 else 1.9 end)
          else similarity(s.search_text, %L)
        end as match_score
      from public.geo_search_terms s
      where
        s.search_text like %L
        or s.search_text %% %L
    ),
    best_per_place as (
      select distinct on (geo_place_id)
        geo_place_id, matched_alias, match_score
      from matches
      order by geo_place_id, match_score desc
    )
    select
      p.id as geo_place_id,
      p.name as canonical_name,
      p.place_type,
      p.country_code,
      p.admin1_name,
      p.admin2_name,
      p.population,
      b.matched_alias,
      b.match_score
    from best_per_place b
    join public.geo_places p on p.id = b.geo_place_id
    order by b.match_score desc, p.population desc nulls last, p.name asc
    limit %s
  $sql$,
    prefix_pattern, normalized_query,
    prefix_pattern, normalized_query,
    limit_value
  );

  return query execute sql_text;
end;
$func$;
