/**
 * Fixture `fetch` implementation standing in for live Supabase REST calls,
 * injected into `createBootstrapGeoRepository`'s `fetcher` parameter (the
 * same dependency-injection seam `../../lib/geo-validation/repository.ts`
 * already uses for its own tests). Handles exactly the request shapes
 * `bootstrapRepository.ts` issues: `GET /rest/v1/geo_places` (by `id`,
 * `name` ilike-exact, `country_code`, `admin1_code`, `admin2_code`,
 * `place_type` in-list) and `POST /rest/v1/rpc/search_geo_places`.
 */

import { FIXTURE_GEO_PLACES, type FixtureGeoPlace } from "./fixtureGeoPlaces.js";

function toRestRow(place: FixtureGeoPlace) {
  return {
    id: place.id,
    name: place.name,
    place_type: place.place_type,
    country_code: place.country_code,
    admin1_name: place.admin1_name,
    admin1_code: place.admin1_code,
    admin2_name: place.admin2_name,
    admin2_code: place.admin2_code,
    latitude: place.latitude,
    longitude: place.longitude,
    population: place.population,
  };
}

function stripOperator(value: string, operator: string): string {
  return value.startsWith(`${operator}.`) ? value.slice(operator.length + 1) : value;
}

function parseInList(value: string): string[] {
  const match = value.match(/^in\.\(([^)]*)\)$/);
  return match ? match[1].split(",").filter(Boolean) : [];
}

export function createFixtureFetcher(): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(typeof input === "string" ? input : input.toString());
    const params = url.searchParams;

    if (url.pathname === "/rest/v1/rpc/search_geo_places") {
      // Fuzzy fallback. Not exercised by any of this fixture's covered
      // rules below (every one of them resolves via an exact ilike match
      // or a pure country_code scope) — implemented defensively with a
      // simple substring-overlap score so an UNCOVERED lookup fails safe
      // (score 0 -> filtered below MATCH_SCORE_THRESHOLD -> "no-match",
      // the correct, expected outcome for a name absent from the fixture)
      // rather than throwing.
      const body: { search_query?: unknown } = init?.body ? JSON.parse(String(init.body)) : {};
      const query = String(body.search_query ?? "").toLowerCase().trim();
      const results = FIXTURE_GEO_PLACES.map((place) => {
        const nameLower = place.name.toLowerCase();
        const score = nameLower === query ? 1 : nameLower.includes(query) || query.includes(nameLower) ? 0.5 : 0;
        return { ...toRestRow(place), geo_place_id: place.id, canonical_name: place.name, match_score: score };
      })
        .filter((row) => row.match_score > 0)
        .sort((a, b) => b.match_score - a.match_score);
      return new Response(JSON.stringify(results), { status: 200 });
    }

    if (url.pathname === "/rest/v1/geo_places") {
      let rows = [...FIXTURE_GEO_PLACES];
      const idParam = params.get("id");
      if (idParam) rows = rows.filter((place) => place.id === stripOperator(idParam, "eq"));
      const nameParam = params.get("name");
      if (nameParam) {
        const name = stripOperator(nameParam, "ilike").toLowerCase();
        rows = rows.filter((place) => place.name.toLowerCase() === name);
      }
      const countryParam = params.get("country_code");
      if (countryParam) rows = rows.filter((place) => place.country_code === stripOperator(countryParam, "eq"));
      const admin1Param = params.get("admin1_code");
      if (admin1Param) rows = rows.filter((place) => place.admin1_code === stripOperator(admin1Param, "eq"));
      const admin2Param = params.get("admin2_code");
      if (admin2Param) rows = rows.filter((place) => place.admin2_code === stripOperator(admin2Param, "eq"));
      const placeTypeParam = params.get("place_type");
      if (placeTypeParam) {
        const types = parseInList(placeTypeParam);
        if (types.length > 0) rows = rows.filter((place) => types.includes(place.place_type));
      }
      return new Response(JSON.stringify(rows.map(toRestRow)), { status: 200 });
    }

    return new Response(JSON.stringify({ error: `Fixture fetcher: unhandled path ${url.pathname}` }), { status: 404 });
  }) as typeof fetch;
}
