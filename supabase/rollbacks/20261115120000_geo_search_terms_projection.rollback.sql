-- ROLLBACK for 20261115120000_geo_search_terms_projection.sql
-- Run manually against Pre-Prod only (verify ref pkfdunyeaqdvvklutgon first).
-- Restores search_geo_places to its 20260830013000 definition (byte-identical
-- body, md5 cbf7ddcf364b594056ed56c6af4c77ac), then removes the projection,
-- its triggers and trigger functions. geo_places / geo_aliases data and their
-- existing indexes are untouched (the migration never altered them).

begin;

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
  -- Identical normalisation to the previous version's `normalized` CTE:
  -- immutable_unaccent(lower(trim(search_query))) -- same order of
  -- operations, same functions, computed once here instead of once per
  -- row inside the dynamic query.
  normalized_query := public.immutable_unaccent(lower(trim(search_query)));
  prefix_pattern := normalized_query || '%';
  limit_value := greatest(result_limit, 0);

  -- Dynamic SQL, built fresh on every call so PostgreSQL plans this
  -- specific statement against the real search term (a literal, safely
  -- spliced via %L) rather than against an opaque function parameter --
  -- this is the entire fix (AR-09/AR-10). The query text itself is
  -- otherwise byte-identical in structure and logic to the previous
  -- LANGUAGE SQL version's CTE body.
  sql_text := format($sql$
    with name_matches as (
      select
        p.id as geo_place_id,
        null::text as matched_alias,
        case
          when public.immutable_unaccent(lower(p.ascii_name)) like %L then 2.0
          else similarity(public.immutable_unaccent(lower(p.ascii_name)), %L)
        end as match_score
      from public.geo_places p
      where
        public.immutable_unaccent(lower(p.ascii_name)) like %L
        or public.immutable_unaccent(lower(p.ascii_name)) %% %L
    ),
    alias_matches as (
      select
        a.geo_place_id,
        a.alias_text as matched_alias,
        case
          when public.immutable_unaccent(lower(a.alias_text)) like %L then 1.9
          else similarity(public.immutable_unaccent(lower(a.alias_text)), %L)
        end as match_score
      from public.geo_aliases a
      where
        public.immutable_unaccent(lower(a.alias_text)) like %L
        or public.immutable_unaccent(lower(a.alias_text)) %% %L
    ),
    combined as (
      select * from name_matches
      union all
      select * from alias_matches
    ),
    best_per_place as (
      select distinct on (geo_place_id)
        geo_place_id, matched_alias, match_score
      from combined
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
    prefix_pattern, normalized_query,
    prefix_pattern, normalized_query,
    limit_value
  );

  return query execute sql_text;
end;
$func$;

drop trigger if exists geo_search_terms_sync_places_insert on public.geo_places;
drop trigger if exists geo_search_terms_sync_places_update on public.geo_places;
drop trigger if exists geo_search_terms_sync_aliases_insert on public.geo_aliases;
drop trigger if exists geo_search_terms_sync_aliases_update on public.geo_aliases;

drop function if exists public.geo_search_terms_sync_places_insert();
drop function if exists public.geo_search_terms_sync_places_update();
drop function if exists public.geo_search_terms_sync_aliases_insert();
drop function if exists public.geo_search_terms_sync_aliases_update();

drop table if exists public.geo_search_terms;

delete from supabase_migrations.schema_migrations where version = '20261115120000';

commit;

-- Verify after rollback:
--   select md5(prosrc) from pg_proc where proname = 'search_geo_places';
--   -- expect cbf7ddcf364b594056ed56c6af4c77ac
--   select to_regclass('public.geo_search_terms');  -- expect null
