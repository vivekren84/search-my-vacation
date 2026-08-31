-- R1.2-WS3-IMP-13 (Rad), implementing ARCHIE-R1.2-WS3-AR-10's approved
-- architecture exactly as approved.
--
-- This is a NEW migration file, not an edit to the already-applied
-- 20260829130000_fix_search_geo_places_trgm_index_usage.sql. That file
-- has already been executed against the live project (confirmed by
-- AR-07/AR-08/AR-09's own evidence review of live query results), so
-- editing it in place would silently diverge from what Supabase's
-- migration history already recorded as applied -- this project's own
-- established convention for a post-hoc correction/evolution is a new,
-- additive migration (see every prior fix_* file in this directory),
-- not editing history. The two expression indexes and immutable_unaccent()
-- wrapper created by that file are untouched here -- this card's scope is
-- search_geo_places() only ("Index modifications" is explicitly Out of
-- Scope for this card).
--
-- ROOT CAUSE (AR-09, confirmed by direct comparative evidence in AR-10,
-- not merely theorised): search_geo_places() has been, since R1.2-WS3-
-- IMP-09, a non-inlined LANGUAGE SQL function -- non-inlining is forced
-- by its own load-bearing `set statement_timeout to '2000'` clause
-- (correct, necessary, from R1.2-WS3-IMP-03; not itself a defect).
-- Because a non-inlined SQL function's body is planned once against its
-- formal argument represented as an opaque parameter (a Postgres `Param`
-- node), not the actual literal string passed at call time, the planner's
-- selectivity estimator for the `%%`/`LIKE` predicates below has no real
-- value to estimate against and falls back to a fixed, non-data-informed
-- plan -- regardless of how selective the real search term actually is.
-- AR-10's IMP-12 evidence proved this directly: literal-embedded
-- execution of the identical query varied 180ms-2018ms across three
-- terms, tracking real selectivity, while calling the function itself
-- stayed flat at ~3.7-4.0s / ~14.3K-14.7K shared buffers regardless of
-- which of those same terms was searched -- the specific signature of
-- one fixed, generic plan being reused on every call.
--
-- THE FIX (AR-10 Section 2 Question 4, approved): rewrite as LANGUAGE
-- PLPGSQL, executing the query as dynamic SQL built fresh on every call
-- via format(...)/%L, with the normalised search term spliced in as an
-- actual literal before the query text is parsed and planned. Each call
-- therefore gets its own freshly-planned statement, informed by the real
-- search term's real selectivity -- exactly what the literal-embedded
-- diagnostic benchmarks already proved gets an efficient, index-
-- accelerated plan.
--
-- WHAT IS PRESERVED, BYTE-FOR-BYTE, PER THIS CARD'S EXPLICIT SCOPE:
--   - RPC signature: search_geo_places(search_query text, result_limit
--     int default 8) returns table (...) -- unchanged, so no client or
--     caller change is required and CREATE OR REPLACE FUNCTION preserves
--     existing grants automatically (signature unchanged).
--   - Return columns, types, and order -- byte-identical to the current
--     definition.
--   - Ranking formula: 2.0 for a name prefix match, 1.9 for an alias
--     prefix match, similarity() score otherwise -- unchanged.
--   - Result ordering: match_score desc, population desc nulls last,
--     name asc -- unchanged.
--   - Alias search (geo_aliases, matched_alias column) -- unchanged.
--   - Fuzzy matching (the pg_trgm `%%` operator) and prefix matching
--     (LIKE ... || '%%') -- unchanged predicate logic, only how the
--     comparison value reaches the planner changes.
--   - Duplicate removal (distinct on (geo_place_id), best match per
--     place) -- unchanged.
--   - LIMIT handling (greatest(result_limit, 0)) -- unchanged.
--   - Normalisation: immutable_unaccent(lower(trim(search_query))) --
--     identical expression, identical order of operations; computed once
--     in PL/pgSQL instead of once per row inside a CTE subquery, which is
--     behaviourally equivalent (same deterministic result for the same
--     input) and, if anything, marginally cheaper.
--   - SECURITY INVOKER (the default, unchanged) -- no SECURITY DEFINER
--     introduced, matching ARCHIE-R1.2-WS3-AR-01's original recommendation.
--   - statement_timeout protection -- re-declared explicitly below via
--     the same function-level SET clause syntax (PL/pgSQL functions
--     support this identically to SQL functions), per AR-10's explicit
--     instruction not to assume this carries over silently.
--
-- SQL INJECTION SAFETY (this card's Technical Requirement 3): the only
-- two dynamic values spliced into the query text are `prefix_pattern`
-- and `normalized_query`, both derived entirely from
-- immutable_unaccent(lower(trim(search_query))) and spliced via format()'s
-- %L specifier -- Postgres's own built-in safe-literal-quoting
-- (equivalent to quote_literal()), which correctly escapes embedded
-- quotes and backslashes. No raw string concatenation of user input is
-- used anywhere in this function. The LIMIT value is spliced via %s
-- (no quoting) only because it is already a typed `int` at the function
-- boundary -- not user-supplied text -- so there is no injection surface
-- there either.
--
-- TIMEOUT BEHAVIOUR -- FLAGGED, NOT RESOLVED BY THIS MIGRATION (AR-10
-- Risk Assessment, this card's Technical Requirement 5): every post-
-- R1.2-WS3-IMP-09 measurement of the current function has completed
-- successfully in ~3.7-4.0s despite its own `set statement_timeout to
-- '2000'` (2-second) clause, without being cancelled (57014) -- unlike
-- the original, pre-fix ~7-second execution, which the same clause
-- reliably cancelled. This migration preserves the identical
-- statement_timeout mechanism and value, unchanged -- it does not
-- attempt to explain or fix this discrepancy, since doing so is outside
-- this card's scope. Rad's IMP-13 report asks Vivek/Tiger to specifically
-- observe and document whether the *rewritten* function's real execution
-- time now falls under or over 2000ms, and if over, whether it is
-- cancelled -- direct evidence either way, not assumed.

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

-- Rollback: revert to the LANGUAGE SQL version from
-- 20260829130000_fix_search_geo_places_trgm_index_usage.sql (that file's
-- `create or replace function public.search_geo_places(...)` block, lines
-- 122-201 as it stands after R1.2-WS3-IMP-10/11's comment-only
-- reconciliation edits). Signature is unchanged throughout, so this is a
-- clean, safe replace in either direction. No data, schema, index, or
-- grant is affected by this migration -- it touches one function
-- definition only.
