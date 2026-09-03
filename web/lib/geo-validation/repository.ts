// EBC-R1.2-WS6-09 (Rad, Phase 1). Supabase access for the geo-validation
// module, following the exact REST-over-fetch convention already
// established by web/lib/journey-leads/repository.ts and
// web/lib/journey-passport-otp/repository.ts — no Supabase JS SDK, a
// hard-checked project URL, a bounded per-request timeout.
//
// This file must never import anything from web/lib/journey-director/**.

import { isGeoPlaceType, type GeoPlaceType, type GeoSearchResult } from "./types";

const EXPECTED_SUPABASE_URL = "https://jbsefolhlfkplawiuvlu.supabase.co";

// Search backs live typing, not a one-time submission, so this is
// deliberately tighter than the leads repository's 7000ms. This is the
// server-side (Supabase REST call) timeout; EBC-R1.2-WS6-09 Phase 5
// ("Search Failure Handling") added the corresponding client-side bounded
// timeout (web/hooks/useDestinationSearch.ts, ~3000ms) and single silent
// retry above this layer — a client request can therefore fail faster
// (via its own timeout) than this server-side bound, which remains as the
// backstop against a genuinely stuck Supabase call.
const REQUEST_TIMEOUT_MS = 4000;

export class GeoValidationRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Geo-validation repository operation failed");
    this.name = "GeoValidationRepositoryError";
  }
}

type SupabaseEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
};

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

function toGeoSearchResult(row: unknown): GeoSearchResult | null {
  if (!isRecord(row)) return null;
  const placeType = row.place_type;
  if (
    typeof row.geo_place_id !== "string" ||
    typeof row.canonical_name !== "string" ||
    !isGeoPlaceType(placeType)
  ) {
    return null;
  }
  return {
    geoPlaceId: row.geo_place_id,
    canonicalName: row.canonical_name,
    placeType: placeType as GeoPlaceType,
    countryCode: typeof row.country_code === "string" ? row.country_code : null,
    admin1Name: typeof row.admin1_name === "string" ? row.admin1_name : null,
    admin2Name: typeof row.admin2_name === "string" ? row.admin2_name : null,
    population: typeof row.population === "number" ? row.population : null,
    matchedAlias: typeof row.matched_alias === "string" ? row.matched_alias : null,
  };
}

export type GeoValidationRepository = {
  searchDestinations(query: string, limit?: number): Promise<GeoSearchResult[]>;
  // Re-resolves a previously-selected geoPlaceId against geo_places, for
  // server-side re-validation at submission time (defence in depth — a
  // client is never trusted to have carried the correct canonicalName/
  // placeType forward unmodified). Returns null if the id no longer
  // resolves (should not happen in normal operation, since geo_places rows
  // are never deleted by anything this module owns, but a dataset refresh
  // could in principle retire an id — treat that as "could not confirm",
  // never as "the place stopped being real").
  resolveGeoPlace(geoPlaceId: string): Promise<GeoSearchResult | null>;
};

export function createSupabaseGeoValidationRepository(
  environment: SupabaseEnvironment,
  fetcher: typeof fetch = fetch,
): GeoValidationRepository {
  const projectUrl = environment.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();
  if (projectUrl !== EXPECTED_SUPABASE_URL || !secretKey) {
    throw new GeoValidationRepositoryError("database_not_configured");
  }

  async function request(path: string, init: RequestInit, code: string) {
    let response: Response;
    try {
      response = await fetcher(`${projectUrl}${path}`, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    } catch (error) {
      // TEMPORARY DIAGNOSTIC LOGGING — R1.2-WS3-IMP-08. Investigation
      // only; not a functional change. Remove once the root cause behind
      // "geo_search_failed" is confirmed. This branch fires when fetch()
      // itself throws (network/DNS/abort) — captured for completeness,
      // even though current evidence points at the branch below instead.
      console.error("[R1.2-WS3-IMP-08 DIAGNOSTIC] geo-validation request() network-level failure", {
        path,
        errorName: error instanceof Error ? error.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        cause: error instanceof Error && "cause" in error ? (error as { cause?: unknown }).cause : undefined,
      });
      throw new GeoValidationRepositoryError("geo_search_unavailable");
    }
    if (!response.ok) {
      // TEMPORARY DIAGNOSTIC LOGGING — R1.2-WS3-IMP-08. Investigation
      // only; not a functional change. Remove once the root cause behind
      // "geo_search_failed" is confirmed. This is the exact branch that
      // produces "geo_search_failed": fetch() completed, PostgREST/
      // Supabase returned a real HTTP response, but response.ok is false.
      // Capture the full status and body (PostgREST error responses carry
      // message/details/hint/code in the JSON body) before it is discarded.
      const diagnosticBody = await response.clone().text().catch((readError) => `<failed to read body: ${readError}>`);
      console.error("[R1.2-WS3-IMP-08 DIAGNOSTIC] geo-validation request() non-ok HTTP response", {
        path,
        thrownCode: code,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        responseBody: diagnosticBody,
      });
      throw new GeoValidationRepositoryError(code);
    }
    return response;
  }

  return {
    async searchDestinations(query, limit = 8) {
      const trimmed = query.trim();
      if (trimmed.length < 2) return [];

      const response = await request(
        "/rest/v1/rpc/search_geo_places",
        {
          method: "POST",
          headers: createHeaders(secretKey),
          body: JSON.stringify({ search_query: trimmed, result_limit: limit }),
        },
        "geo_search_failed",
      );

      const body: unknown = await response.json().catch(() => null);
      if (!Array.isArray(body)) return [];
      return body.map(toGeoSearchResult).filter((row): row is GeoSearchResult => row !== null);
    },

    async resolveGeoPlace(geoPlaceId) {
      const response = await request(
        `/rest/v1/geo_places?id=eq.${encodeURIComponent(geoPlaceId)}&select=id,name,place_type,country_code,admin1_name,admin2_name,population`,
        { method: "GET", headers: createHeaders(secretKey) },
        "geo_resolve_failed",
      );

      const body: unknown = await response.json().catch(() => null);
      if (!Array.isArray(body) || body.length === 0) return null;
      const row = body[0];
      if (!isRecord(row) || typeof row.id !== "string" || typeof row.name !== "string" || !isGeoPlaceType(row.place_type)) {
        return null;
      }
      return {
        geoPlaceId: row.id,
        canonicalName: row.name,
        placeType: row.place_type as GeoPlaceType,
        countryCode: typeof row.country_code === "string" ? row.country_code : null,
        admin1Name: typeof row.admin1_name === "string" ? row.admin1_name : null,
        admin2Name: typeof row.admin2_name === "string" ? row.admin2_name : null,
        population: typeof row.population === "number" ? row.population : null,
        matchedAlias: null,
      };
    },
  };
}
