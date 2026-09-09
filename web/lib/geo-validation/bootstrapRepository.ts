// EBC-R1.3-WS1-007 (Rad). Read-only Supabase access for the Bootstrap
// Generator's Travel-Region-matching needs, per the approved architecture:
// - Access pattern: direct, read-only, live Supabase query
//   (EBC-R1.3-WS1-005 Section 3, Option A) — same credential, same
//   REST-over-fetch transport, same per-request timeout convention as
//   ./repository.ts.
// - Matching mechanism: the `geoScope` resolution-recipe strategy
//   (EBC-R1.3-WS1-006 Section 3), implemented here as `resolveScopeRule()`
//   and `findCandidatesInScope()`.
//
// This file sits alongside ./repository.ts inside the existing
// geo-validation module boundary (EBC-R1.3-WS1-005 Section 4,
// "Dependency boundaries") rather than introducing a new one. It adds new,
// generator-specific query functions; it does not modify repository.ts's
// existing traveller-facing search behaviour.
//
// PROHIBITED (per EBC-R1.3-WS1-005 Section 4, restated here since this is
// the file that would violate it): no INSERT/UPDATE/DELETE against
// geo_places/geo_aliases from any function below — read-only, by
// convention and code review, exactly like repository.ts. No unscoped
// full-table scan — every query here is either a single-row/small-set
// lookup by name, or a scoped-by-country/admin1/admin2 filter. This file
// must never import from, or be imported by, web/lib/journey-director/**.

import { isGeoPlaceType, type GeoPlaceType } from "./types.js";

const EXPECTED_SUPABASE_URL = "https://jbsefolhlfkplawiuvlu.supabase.co";

// Bootstrap generation is a manually-triggered, infrequent,
// operator-run action (EBC-R1.3-WS1-005 Section 4, "Known limitations") —
// not a request-path dependency no traveller ever waits on. A longer
// timeout than repository.ts's interactive 4000ms is appropriate here;
// this is a batch job, not autocomplete.
const REQUEST_TIMEOUT_MS = 15_000;

// The match-score threshold both EBC-R1.3-WS3-001 D3 and
// EBC-R1.3-WS1-003 Section 9 (D3a, "concur, conditionally") already
// approved for Sheet 1 geoPlaceId attachment — reused here for every
// name-resolution decision this file makes, so the Bootstrap Generator
// applies exactly one confidence bar throughout, not two.
export const MATCH_SCORE_THRESHOLD = 0.8;

// The Sheet 2 candidate place_type set EBC-R1.3-WS3-001 Section 5.2's own
// mapping table specifies ("geo_places rows with place_type in (...)
// whose admin1_code falls within a matched Travel Region -> Candidate
// Sheet 2 rows"). Country/state-level rows are never candidates — they
// are Sheet 1 material, not Sheet 2.
export const CANDIDATE_PLACE_TYPES: readonly GeoPlaceType[] = [
  "district",
  "region",
  "city",
  "town",
  "landmark",
  "island",
];

export class BootstrapRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Bootstrap geo-validation repository operation failed");
    this.name = "BootstrapRepositoryError";
  }
}

type SupabaseEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
};

export type GeoAdminRow = {
  readonly geoPlaceId: string;
  readonly canonicalName: string;
  readonly placeType: GeoPlaceType;
  readonly countryCode: string | null;
  readonly admin1Name: string | null;
  readonly admin1Code: string | null;
  readonly admin2Name: string | null;
  readonly admin2Code: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly population: number | null;
};

export type GeoAdminMatch = GeoAdminRow & { readonly matchScore: number };

/** How a `GeoScopeRule` (kbRegionGeoScope.ts) resolved against live `geo_places` data on this run. */
export type ScopeResolution =
  | { readonly status: "resolved"; readonly scope: ResolvedGeoScope }
  | { readonly status: "no-match"; readonly attemptedMatchNames: readonly string[] }
  | { readonly status: "ambiguous"; readonly attemptedMatchName: string; readonly candidates: readonly GeoAdminMatch[] };

export type ResolvedGeoScope =
  | { readonly kind: "country"; readonly countryCode: string }
  | {
      readonly kind: "admin";
      readonly countryCode: string;
      readonly admin1Code: string | null;
      readonly admin2Code: string | null;
      readonly matchedGeoPlaceId: string;
      readonly matchedName: string;
      readonly matchScore: number;
    }
  | { readonly kind: "explicit-seed"; readonly countryCode: string; readonly seeds: readonly GeoAdminMatch[] };

function createHeaders(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toGeoAdminRow(row: unknown): GeoAdminRow | null {
  if (!isRecord(row)) return null;
  if (typeof row.id !== "string" || typeof row.name !== "string" || !isGeoPlaceType(row.place_type)) return null;
  return {
    geoPlaceId: row.id,
    canonicalName: row.name,
    placeType: row.place_type as GeoPlaceType,
    countryCode: typeof row.country_code === "string" ? row.country_code : null,
    admin1Name: typeof row.admin1_name === "string" ? row.admin1_name : null,
    admin1Code: typeof row.admin1_code === "string" ? row.admin1_code : null,
    admin2Name: typeof row.admin2_name === "string" ? row.admin2_name : null,
    admin2Code: typeof row.admin2_code === "string" ? row.admin2_code : null,
    latitude: typeof row.latitude === "number" ? row.latitude : null,
    longitude: typeof row.longitude === "number" ? row.longitude : null,
    population: typeof row.population === "number" ? row.population : null,
  };
}

export type BootstrapGeoRepository = {
  /**
   * Resolves a single `GeoScopeRule` (kbRegionGeoScope.ts) against live
   * `geo_places` data. Never guesses: `no-match` and `ambiguous` are both
   * distinct, reported outcomes — never silently coerced into a resolved
   * scope. Called once per rule, per generation run (Section 3.2 of
   * EBC-R1.3-WS1-006 — "the same live-query architecture already
   * approved").
   */
  resolveScopeRule(rule: import("../../scripts/journey-intelligence/kbRegionGeoScope.js").GeoScopeRule): Promise<ScopeResolution>;
  /**
   * Finds every `geo_places` row of the approved candidate place_type set
   * that falls inside a resolved scope, excluding any id already present
   * in `excludeGeoPlaceIds` (the ids already covered by
   * `KB_APPROVED_REGIONS`' structured transcription — never rediscovered
   * as a "new" candidate). Returns `[]`, not an error, for an
   * `explicit-seed` scope (its own seeds ARE the candidate set — see
   * `resolveScopeRule`'s `explicit-seed` result — there is nothing further
   * to discover beyond the named places themselves, per
   * EBC-R1.3-WS1-006 Section 3.1, "used as-is, no containment expansion").
   */
  findCandidatesInScope(
    scope: ResolvedGeoScope,
    excludeGeoPlaceIds: ReadonlySet<string>,
  ): Promise<readonly GeoAdminRow[]>;
  /** General-purpose best-match lookup, for Sheet 1 `geoPlaceId` identity attachment (EBC-R1.3-WS3-001 Section 5.2) — not scope resolution. */
  findBestMatch(name: string, options?: { readonly countryCode?: string }): Promise<GeoAdminMatch | null>;
};

export function createBootstrapGeoRepository(
  environment: SupabaseEnvironment,
  fetcher: typeof fetch = fetch,
): BootstrapGeoRepository {
  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();
  if (projectUrl !== EXPECTED_SUPABASE_URL || !secretKey) {
    throw new BootstrapRepositoryError("database_not_configured");
  }
  // secretKey is now guaranteed non-empty by the guard above, but TypeScript
  // does not retain const-narrowing across the nested `function get`/`function
  // post` declarations below (a known limitation for hoisted function
  // declarations, as opposed to arrow functions) — hence the `!` at each call site.

  async function get(path: string, code: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetcher(`${projectUrl}${path}`, {
        method: "GET",
        headers: createHeaders(secretKey!),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      throw new BootstrapRepositoryError(`${code}_unavailable`);
    }
    if (!response.ok) {
      throw new BootstrapRepositoryError(code);
    }
    return response.json().catch(() => null);
  }

  async function post(path: string, body: unknown, code: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetcher(`${projectUrl}${path}`, {
        method: "POST",
        headers: createHeaders(secretKey!),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      throw new BootstrapRepositoryError(`${code}_unavailable`);
    }
    if (!response.ok) {
      throw new BootstrapRepositoryError(code);
    }
    return response.json().catch(() => null);
  }

  /** Exact (case-insensitive) name lookup, optionally scoped by place_type/countryCode. Returns every row PostgREST finds — the caller decides what "resolved" means (single row vs. ambiguous). */
  async function exactNameLookup(
    name: string,
    options: { readonly placeTypes?: readonly GeoPlaceType[]; readonly countryCode?: string },
  ): Promise<GeoAdminRow[]> {
    const params = new URLSearchParams();
    params.set("name", `ilike.${name}`);
    params.set(
      "select",
      "id,name,place_type,country_code,admin1_name,admin1_code,admin2_name,admin2_code,latitude,longitude,population",
    );
    if (options.countryCode) params.set("country_code", `eq.${options.countryCode}`);
    if (options.placeTypes?.length) params.set("place_type", `in.(${options.placeTypes.join(",")})`);
    const body = await get(`/rest/v1/geo_places?${params.toString()}`, "geo_bootstrap_lookup_failed");
    if (!Array.isArray(body)) return [];
    return body.map(toGeoAdminRow).filter((row): row is GeoAdminRow => row !== null);
  }

  /** Falls back to the already-approved fuzzy/trigram search (search_geo_places) when an exact name lookup finds nothing — the same mechanism EBC-R1.3-WS3-001 Section 5.2 already specifies for Sheet 1 geoPlaceId attachment. */
  async function fuzzyNameLookup(
    name: string,
    options: { readonly placeTypes?: readonly GeoPlaceType[]; readonly countryCode?: string },
  ): Promise<GeoAdminMatch[]> {
    const body = await post(
      "/rest/v1/rpc/search_geo_places",
      { search_query: name, result_limit: 10 },
      "geo_bootstrap_search_failed",
    );
    if (!Array.isArray(body)) return [];
    return body
      .map((row): GeoAdminMatch | null => {
        if (!isRecord(row) || typeof row.geo_place_id !== "string" || typeof row.canonical_name !== "string") return null;
        if (!isGeoPlaceType(row.place_type)) return null;
        if (options.countryCode && row.country_code !== options.countryCode) return null;
        if (options.placeTypes?.length && !options.placeTypes.includes(row.place_type as GeoPlaceType)) return null;
        const matchScore = typeof row.match_score === "number" ? row.match_score : 0;
        return {
          geoPlaceId: row.geo_place_id,
          canonicalName: row.canonical_name,
          placeType: row.place_type as GeoPlaceType,
          countryCode: typeof row.country_code === "string" ? row.country_code : null,
          admin1Name: typeof row.admin1_name === "string" ? row.admin1_name : null,
          admin1Code: null, // search_geo_places() does not return admin1_code/admin2_code — a resolved match is re-fetched by id below for those fields when needed.
          admin2Name: typeof row.admin2_name === "string" ? row.admin2_name : null,
          admin2Code: null,
          latitude: null,
          longitude: null,
          population: typeof row.population === "number" ? row.population : null,
          matchScore,
        };
      })
      .filter((row): row is GeoAdminMatch => row !== null)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  async function resolveById(geoPlaceId: string): Promise<GeoAdminRow | null> {
    const params = new URLSearchParams();
    params.set("id", `eq.${geoPlaceId}`);
    params.set(
      "select",
      "id,name,place_type,country_code,admin1_name,admin1_code,admin2_name,admin2_code,latitude,longitude,population",
    );
    const body = await get(`/rest/v1/geo_places?${params.toString()}`, "geo_bootstrap_resolve_failed");
    if (!Array.isArray(body) || body.length === 0) return null;
    return toGeoAdminRow(body[0]);
  }

  /** Resolves one name to exactly one confident geo_places row, or reports why it couldn't. Shared by admin1/admin2/explicit-seed resolution below. */
  async function resolveOneName(
    name: string,
    options: { readonly placeTypes?: readonly GeoPlaceType[]; readonly countryCode?: string },
  ): Promise<{ status: "resolved"; row: GeoAdminRow; matchScore: number } | { status: "no-match" } | { status: "ambiguous"; candidates: readonly GeoAdminMatch[] }> {
    const exact = await exactNameLookup(name, options);
    if (exact.length === 1) return { status: "resolved", row: exact[0], matchScore: 2.0 };
    if (exact.length > 1) {
      return { status: "ambiguous", candidates: exact.map((row) => ({ ...row, matchScore: 2.0 })) };
    }
    const fuzzy = await fuzzyNameLookup(name, options);
    const confident = fuzzy.filter((match) => match.matchScore >= MATCH_SCORE_THRESHOLD);
    if (confident.length === 0) return { status: "no-match" };
    if (confident.length === 1 || confident[0].matchScore - (confident[1]?.matchScore ?? 0) >= 0.1) {
      const best = confident[0];
      const full = await resolveById(best.geoPlaceId);
      return full
        ? { status: "resolved", row: full, matchScore: best.matchScore }
        : { status: "resolved", row: best, matchScore: best.matchScore };
    }
    return { status: "ambiguous", candidates: confident };
  }

  return {
    async findBestMatch(name, options) {
      const result = await resolveOneName(name, { countryCode: options?.countryCode });
      if (result.status !== "resolved") return null;
      return { ...result.row, matchScore: result.matchScore };
    },

    async resolveScopeRule(rule) {
      if (rule.kind === "country") {
        return { status: "resolved", scope: { kind: "country", countryCode: rule.countryCode } };
      }
      if (rule.kind === "admin1") {
        const result = await resolveOneName(rule.matchName, { placeTypes: ["state", "country"], countryCode: rule.countryCode });
        if (result.status === "no-match") return { status: "no-match", attemptedMatchNames: [rule.matchName] };
        if (result.status === "ambiguous") return { status: "ambiguous", attemptedMatchName: rule.matchName, candidates: result.candidates };
        return {
          status: "resolved",
          scope: {
            kind: "admin",
            countryCode: rule.countryCode,
            admin1Code: result.row.admin1Code,
            admin2Code: null,
            matchedGeoPlaceId: result.row.geoPlaceId,
            matchedName: result.row.canonicalName,
            matchScore: result.matchScore,
          },
        };
      }
      if (rule.kind === "admin2") {
        const result = await resolveOneName(rule.matchName, { placeTypes: ["district"], countryCode: rule.countryCode });
        if (result.status === "no-match") return { status: "no-match", attemptedMatchNames: [rule.matchName] };
        if (result.status === "ambiguous") {
          // Narrow by parent admin1 name before giving up, when the rule declares one.
          const narrowed = rule.parentAdmin1MatchName
            ? result.candidates.filter((candidate) => candidate.admin1Name === rule.parentAdmin1MatchName)
            : result.candidates;
          if (narrowed.length !== 1) {
            return { status: "ambiguous", attemptedMatchName: rule.matchName, candidates: narrowed.length ? narrowed : result.candidates };
          }
          return {
            status: "resolved",
            scope: {
              kind: "admin",
              countryCode: rule.countryCode,
              admin1Code: null,
              admin2Code: narrowed[0].admin2Code,
              matchedGeoPlaceId: narrowed[0].geoPlaceId,
              matchedName: narrowed[0].canonicalName,
              matchScore: narrowed[0].matchScore,
            },
          };
        }
        return {
          status: "resolved",
          scope: {
            kind: "admin",
            countryCode: rule.countryCode,
            admin1Code: null,
            admin2Code: result.row.admin2Code,
            matchedGeoPlaceId: result.row.geoPlaceId,
            matchedName: result.row.canonicalName,
            matchScore: result.matchScore,
          },
        };
      }
      // explicit-seed
      const seeds: GeoAdminMatch[] = [];
      const unresolved: string[] = [];
      for (const seedName of rule.matchNames) {
        const result = await resolveOneName(seedName, { countryCode: rule.countryCode });
        if (result.status === "resolved") {
          seeds.push({ ...result.row, matchScore: result.matchScore });
        } else {
          unresolved.push(seedName);
        }
      }
      if (unresolved.length > 0) {
        return { status: "no-match", attemptedMatchNames: unresolved };
      }
      return { status: "resolved", scope: { kind: "explicit-seed", countryCode: rule.countryCode, seeds } };
    },

    async findCandidatesInScope(scope, excludeGeoPlaceIds) {
      if (scope.kind === "explicit-seed") return [];
      const params = new URLSearchParams();
      params.set("place_type", `in.(${CANDIDATE_PLACE_TYPES.join(",")})`);
      params.set(
        "select",
        "id,name,place_type,country_code,admin1_name,admin1_code,admin2_name,admin2_code,latitude,longitude,population",
      );
      if (scope.kind === "country") {
        params.set("country_code", `eq.${scope.countryCode}`);
      } else {
        params.set("country_code", `eq.${scope.countryCode}`);
        if (scope.admin1Code) params.set("admin1_code", `eq.${scope.admin1Code}`);
        if (scope.admin2Code) params.set("admin2_code", `eq.${scope.admin2Code}`);
      }
      const body = await get(`/rest/v1/geo_places?${params.toString()}`, "geo_bootstrap_scope_query_failed");
      if (!Array.isArray(body)) return [];
      return body
        .map(toGeoAdminRow)
        .filter((row): row is GeoAdminRow => row !== null && !excludeGeoPlaceIds.has(row.geoPlaceId));
    },
  };
}
