-- 20261119100000_search_geo_places_ranking_refinement.rollback.sql
--
-- Rollback for 20261119100000_search_geo_places_ranking_refinement.sql.
-- Restores search_geo_places to the definition established in
-- 20261115120000_geo_search_terms_projection.sql.

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
