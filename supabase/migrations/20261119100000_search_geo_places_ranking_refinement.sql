-- 20261119100000_search_geo_places_ranking_refinement.sql
--
-- SMV Release 1.3 Milestone 3 (S-01 & S-02).
-- Destination Search Ranking Refinement for Ambiguous City Hubs and Country Entities.
--
-- Functional Intent:
-- 1. S-01 (Ambiguous Hub Ranking): Fix search ranking for ambiguous city/hub queries
--    (e.g., Bengaluru, Chennai, Mumbai) by introducing exact-match scoring tiers
--    (4.0 canonical / 3.8 alias) and place-type hierarchy tiering (city > district),
--    ensuring primary holiday hubs/cities outrank sub-districts and peripheral entities.
-- 2. S-02 (Country-Level Search Behavior): Ensure exact country-name queries
--    (e.g., 'India', matching alias 'India' or canonical 'Republic of India')
--    receive top exact-match priority and place_type preference, placing the country
--    entity at #1 ahead of foreign prefix matches (Indiana, Indianapolis).
--
-- Contract & Invariants:
-- - Unchanged: function signature, return table columns, PL/pgSQL language,
--   STABLE volatility, statement_timeout (2000ms), SECURITY INVOKER, and ACL grants.
-- - Projection table public.geo_search_terms and GIN trigram indexes remain untouched.
--
-- Rollback: supabase/rollbacks/20261119100000_search_geo_places_ranking_refinement.rollback.sql

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

  -- Hierarchical scoring:
  -- 1. Exact match on canonical: 4.0
  -- 2. Exact match on alias: 3.8
  -- 3. Prefix match on canonical: 2.0
  -- 4. Prefix match on alias: 1.9
  -- 5. Trigram similarity: 0.0 - 1.0
  --
  -- Secondary ordering:
  -- - Match score desc
  -- - Place type hierarchy (country=100 > city=80 > state=60 > region=50 > island=45 > district=30 > town=20 > other=10)
  -- - Population desc nulls last
  -- - Name asc
  sql_text := format($sql$
    with matches as (
      select
        s.geo_place_id,
        s.alias_text as matched_alias,
        case
          when s.search_text = %L then (case when s.alias_id is null then 4.0 else 3.8 end)
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
    order by
      b.match_score desc,
      case
        when p.place_type = 'country' then 100
        when p.place_type = 'city' then 80
        when p.place_type = 'state' then 60
        when p.place_type = 'region' then 50
        when p.place_type = 'island' then 45
        when p.place_type = 'district' then 30
        when p.place_type = 'town' then 20
        else 10
      end desc,
      p.population desc nulls last,
      p.name asc
    limit %s
  $sql$,
    normalized_query,
    prefix_pattern,
    normalized_query,
    prefix_pattern,
    normalized_query,
    limit_value
  );

  return query execute sql_text;
end;
$func$;
