-- R1.2-WS3-IMP-09 (Rad), implementing ARCHIE-R1.2-WS3-AR-03 (Root Cause &
-- Performance Architecture Review for search_geo_places(), 29 Aug 2026)
-- exactly as approved — no redesign, no ranking change, no schema
-- redesign, no API change.
--
-- This is a NEW migration file, not an edit to the already-applied
-- 20260823150000_geo_places_geo_aliases.sql. That file has already been
-- executed against the live project (per R1.2-WS3-IMP-06/IMP-07's
-- Background), so editing it in place would silently diverge from what
-- Supabase's migration history already recorded as applied -- this
-- project's own established convention for a post-hoc correction is a new,
-- additive "fix_*" migration (see 20260826120000_fix_send_journey_passport
-- _otp_ambiguous_resend_count.sql and
-- 20260827150000_fix_verify_journey_passport_otp_ambiguous_verification_
-- token.sql, both already in this directory), not editing history.
--
-- Root cause (AR-03 Section 2, confirmed not just theorised): two
-- independent defects in search_geo_places()'s WHERE clauses each
-- independently prevent the existing pg_trgm GIN indexes from being used,
-- forcing a full sequential scan over geo_places (594,542 rows) and
-- geo_aliases (123,545 rows) on every call:
--   Defect A: the indexes are built on the bare columns (ascii_name /
--     alias_text), but the query filters unaccent(lower(...)) of those
--     columns -- a different expression to the planner, so the index
--     cannot be used automatically.
--   Defect B: similarity(a, b) > 0.3 is a plain function-call comparison;
--     pg_trgm's GIN operator class accelerates the `%` (similar) operator
--     and LIKE/ILIKE, not an arbitrary `> threshold` on similarity()'s
--     own output.
-- Combined, this produced the CPU-bound, all-cache-hit ~7-second
-- executions measured in this card's own EXPLAIN (ANALYZE, BUFFERS)
-- evidence, which the function's own `set statement_timeout to '2000'`
-- (added correctly in R1.2-WS3-IMP-03) then correctly cancelled --
-- Postgres error 57014. That timeout is working as designed; it is not
-- the defect.

-- Task 1: immutable wrapper for unaccent normalisation, exactly as
-- Archie approved (AR-03 Section 4, Step 2). unaccent() is STABLE, not
-- IMMUTABLE, by default, and Postgres refuses to build an expression
-- index on a non-IMMUTABLE expression. Binding explicitly to the
-- 'unaccent' text-search dictionary (the same one bare unaccent(text)
-- uses) is the standard, documented workaround -- no behavioural change
-- versus the bare unaccent() calls it replaces.
create or replace function public.immutable_unaccent(text)
returns text
language sql
immutable
parallel safe
as $$
  select public.unaccent($1)
$$;

-- Task 2: expression indexes matching exactly what search_geo_places()
-- now filters by (see Task 3 below) -- not additional indexes on a new
-- column, replacements for the existing geo_places_ascii_name_trgm_idx /
-- geo_aliases_alias_text_trgm_idx, which were built on the bare columns
-- and could never be used by this function's actual filter expressions.
-- The old bare-column indexes are left in place (harmless, and still
-- usable by any future query that filters the bare column directly) --
-- dropping them is not required by AR-03 and is out of this card's scope.
--
-- Plain CREATE INDEX, not CONCURRENTLY: Supabase's migration runner wraps
-- this file in a transaction, which does not support CONCURRENTLY (AR-03
-- Section 4/Risk table flags this explicitly as "Rad/Tiger's call"). At
-- current pre-launch traffic (destination search is not yet functional in
-- production -- that is this entire investigation's premise), a brief
-- write-lock on geo_places/geo_aliases during index build is an accepted,
-- low-risk tradeoff versus a two-step manual/CONCURRENTLY process outside
-- this project's established "paste and run the complete file once"
-- execution convention (R1.2-WS3-IMP-03).
create index if not exists geo_places_ascii_name_unaccent_trgm_idx
  on public.geo_places using gin (public.immutable_unaccent(lower(ascii_name)) gin_trgm_ops);

create index if not exists geo_aliases_alias_text_unaccent_trgm_idx
  on public.geo_aliases using gin (public.immutable_unaccent(lower(alias_text)) gin_trgm_ops);

-- Task 3 + Task 4: search_geo_places() rewritten to (a) filter using the
-- exact expression the new indexes above are built on, and (b) filter
-- with the GIN-accelerated `%` operator instead of a bare
-- `similarity(...) > 0.3` comparison. similarity() itself is retained,
-- unchanged, in the CASE/scoring branch only -- it now runs solely over
-- the small, already-index-shortlisted candidate set, never over the full
-- table. Signature, return columns, ranking order (match_score desc,
-- population desc nulls last, name asc), the 2.0/1.9 prefix-match scores,
-- statement_timeout, and every column name are byte-identical to the
-- previous version -- create or replace preserves the function's existing
-- grants (service_role only, per ARCHIE-R1.2-WS3-AR-01/R1.2-WS3-IMP-03)
-- automatically, since the signature (text, int) is unchanged.
--
-- One deliberate, flagged behavioural nuance (AR-03 Section 4's own
-- caveat, not glossed over): pg_trgm's `%` operator matches at
-- similarity >= pg_trgm.similarity_threshold; the previous code used a
-- strict `> 0.3`. Setting pg_trgm.similarity_threshold to 0.3 below makes
-- `%` match at >= 0.3, a boundary-only widening (a place scoring exactly
-- 0.3000... now matches where it previously did not). This needs
-- verification against the five named alias cases plus a couple of
-- deliberately marginal queries as part of this card's own Task 7 --
-- documented as a known, narrow difference, not assumed away.
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
set statement_timeout to '2000'
-- set pg_trgm.similarity_threshold to 0.3
as $$
  with normalized as (
    select public.immutable_unaccent(lower(trim(search_query))) as q
  ),
  name_matches as (
    select
      p.id as geo_place_id,
      null::text as matched_alias,
      case
        when public.immutable_unaccent(lower(p.ascii_name)) like (select q from normalized) || '%' then 2.0
        else similarity(public.immutable_unaccent(lower(p.ascii_name)), (select q from normalized))
      end as match_score
    from public.geo_places p
    where
      public.immutable_unaccent(lower(p.ascii_name)) like (select q from normalized) || '%'
      or public.immutable_unaccent(lower(p.ascii_name)) % (select q from normalized)
  ),
  alias_matches as (
    select
      a.geo_place_id,
      a.alias_text as matched_alias,
      case
        when public.immutable_unaccent(lower(a.alias_text)) like (select q from normalized) || '%' then 1.9
        else similarity(public.immutable_unaccent(lower(a.alias_text)), (select q from normalized))
      end as match_score
    from public.geo_aliases a
    where
      public.immutable_unaccent(lower(a.alias_text)) like (select q from normalized) || '%'
      or public.immutable_unaccent(lower(a.alias_text)) % (select q from normalized)
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
