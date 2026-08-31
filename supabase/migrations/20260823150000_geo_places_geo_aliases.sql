-- EBC-R1.2-WS6-09 (Rad, Phase 1): geographic-truth tables for the Journey
-- Passport destination autocomplete/validation feature (Workstream 6).
--
-- This migration is additive: it does not drop, alter, or rename any
-- existing object. It creates the two tables specified in
-- EBC-R1.2-WS6-03 §6 (Archie, Destination Data Model) — geo_places and
-- geo_aliases — plus one Postgres function, search_geo_places, that
-- implements the ranked prefix/trigram search described in that
-- document's §7 (Search Architecture).
--
-- Per DEC-R1.2-004 / RISK-R1.2-006 and EBC-R1.2-WS6-03 §8 (Validation
-- Architecture): these tables carry geographic fact only. They have, and
-- must never gain, a "served"/"status"/"service_confidence" column or any
-- other business-logic field — that determination remains exclusively
-- Journey Director's (web/lib/journey-director/**), which this migration
-- does not reference, touch, or depend on in any way.
--
-- Data population (the GeoNames import) is a separate, out-of-band step —
-- see web/scripts/geo-validation/importGeoNames.ts. This migration creates
-- empty tables; it does not seed any rows.

create extension if not exists pg_trgm;
create extension if not exists unaccent;

create table if not exists public.geo_places (
  id text primary key,
  name text not null,
  ascii_name text not null,
  place_type text not null
    check (place_type in ('country', 'state', 'district', 'region', 'city', 'town', 'landmark', 'island')),
  country_code text,
  admin1_name text,
  admin1_code text,
  admin2_name text,
  admin2_code text,
  latitude double precision,
  longitude double precision,
  population integer,
  feature_class text,
  feature_code text,
  source text not null default 'geonames',
  source_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists geo_places_ascii_name_trgm_idx
  on public.geo_places using gin (ascii_name gin_trgm_ops);

create index if not exists geo_places_country_code_idx
  on public.geo_places (country_code);

create table if not exists public.geo_aliases (
  id uuid primary key default gen_random_uuid(),
  geo_place_id text not null references public.geo_places (id) on delete cascade,
  alias_text text not null,
  alias_type text not null
    check (alias_type in ('historic', 'preferred', 'short', 'abbreviation', 'local_language', 'common_misspelling')),
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists geo_aliases_alias_text_trgm_idx
  on public.geo_aliases using gin (alias_text gin_trgm_ops);

create index if not exists geo_aliases_geo_place_id_idx
  on public.geo_aliases (geo_place_id);

-- Ranked search: exact/prefix match on the canonical name or an alias
-- outranks a trigram (typo-tolerant) match, which outranks nothing;
-- population is the final tie-breaker (nulls last), per
-- EBC-R1.2-WS6-03 §7. Returns at most result_limit rows (Sophie's §4.2
-- specifies 8 as the client-facing suggestion cap; this function accepts
-- the limit as a parameter rather than hard-coding it, so the UI's own
-- constant is the single source of truth for that number).
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
language sql
stable
-- EBC-R1.2-WS6-09 (Rad, Phase 5 — "Search Failure Handling"). Archie's
-- EBC-R1.2-WS6-06 SS2 recommends a Postgres statement timeout as the
-- database-side counterpart to the client/server request-level timeouts
-- (web/hooks/useDestinationSearch.ts's ~3000ms, repository.ts's 4000ms),
-- so that a genuinely pathological query cannot keep consuming database
-- resources after the client has already given up and moved on. Set
-- tighter than both of those, so the database is always the first to give
-- up, never the slowest link. This migration is still not applied in this
-- session (standing instruction, unchanged since Phase 1) -- this is an
-- addition to its already-authored, not-yet-applied content, not a
-- separately applied change.
set statement_timeout to '2000'
as $$
  with normalized as (
    select unaccent(lower(trim(search_query))) as q
  ),
  name_matches as (
    select
      p.id as geo_place_id,
      null::text as matched_alias,
      case
        when unaccent(lower(p.ascii_name)) like (select q from normalized) || '%' then 2.0
        else similarity(unaccent(lower(p.ascii_name)), (select q from normalized))
      end as match_score
    from public.geo_places p
    where
      unaccent(lower(p.ascii_name)) like (select q from normalized) || '%'
      or similarity(unaccent(lower(p.ascii_name)), (select q from normalized)) > 0.3
  ),
  alias_matches as (
    select
      a.geo_place_id,
      a.alias_text as matched_alias,
      case
        when unaccent(lower(a.alias_text)) like (select q from normalized) || '%' then 1.9
        else similarity(unaccent(lower(a.alias_text)), (select q from normalized))
      end as match_score
    from public.geo_aliases a
    where
      unaccent(lower(a.alias_text)) like (select q from normalized) || '%'
      or similarity(unaccent(lower(a.alias_text)), (select q from normalized)) > 0.3
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
  limit greatest(result_limit, 0);
$$;

-- Security model: matches the convention established by
-- journey_passport_leads/journey_passport_events (20260802130000) and
-- journey_passport_otp_challenges (20260822090000). Public Data API
-- access is intentionally denied; the application reaches these objects
-- exclusively through SUPABASE_SECRET_KEY (web/lib/geo-validation/repository.ts).
-- Added per ARCHIE-R1.2-WS3-AR-01 (Architecture Review, 28 Aug 2026),
-- R1.2-WS3-IMP-03.
alter table public.geo_places enable row level security;
alter table public.geo_aliases enable row level security;

revoke all on table public.geo_places from anon, authenticated;
revoke all on table public.geo_aliases from anon, authenticated;

-- select: search_geo_places and resolveGeoPlace() both read.
-- insert, update: web/scripts/geo-validation/importGeoNames.ts upserts
-- (on_conflict) via the same service-role key; delete is intentionally
-- withheld -- nothing in the codebase deletes geo_places/geo_aliases rows.
grant select, insert, update on table public.geo_places to service_role;
grant select, insert, update on table public.geo_aliases to service_role;

revoke all on function public.search_geo_places(text, int) from public, anon, authenticated;
grant execute on function public.search_geo_places(text, int) to service_role;

comment on table public.geo_places is
  'Geographic reference data (GeoNames-derived). Public Data API access is intentionally denied; carries no traveller PII and no business/serviceability opinion (see EBC-R1.2-WS6-03 §8).';
comment on table public.geo_aliases is
  'Aliases for public.geo_places (historic names, short forms, misspellings). Public Data API access is intentionally denied.';
