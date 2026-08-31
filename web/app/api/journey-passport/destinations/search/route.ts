// EBC-R1.2-WS6-09 (Rad, Phase 1): destination search endpoint for the
// Journey Passport's Preferred Destinations field (Workstream 6).
//
// Runtime/timeout/rate-limit conventions follow
// web/app/api/journey-passport/leads/route.ts. This is the codebase's
// first GET API route under journey-passport/ — every existing route
// there is POST-only — but GET is the correct verb for an idempotent
// search, so this is a standard extension, not a new convention.
//
// This route already distinguishes success from failure with a dedicated
// shape — `{ ok: true, results }` (200, an empty array being a genuine,
// successfully-checked "no match") versus `{ ok: false, code, results: [] }`
// (503) for a failure — and its own outbound Supabase call is already
// bounded (repository.ts's REQUEST_TIMEOUT_MS). EBC-R1.2-WS6-09 Phase 5
// ("Search Failure Handling") built the remaining piece Sophie's
// EBC-R1.2-WS6-05 §7.1/§7.3 and Archie's EBC-R1.2-WS6-06 §2 specify on top
// of this — the bounded client-side timeout/abort and one silent retry —
// entirely in web/hooks/useDestinationSearch.ts, since this route's own
// response shape needed no change to support it.

import { createSupabaseGeoValidationRepository, GeoValidationRepositoryError } from "@/lib/geo-validation";
import { consumeGeoSearchRateLimit, geoSearchRateLimitKey } from "@/lib/geo-validation/rate-limit";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 100;
const DEFAULT_SUGGESTION_LIMIT = 8;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  if (!consumeGeoSearchRateLimit(geoSearchRateLimitKey(request))) {
    return json({ ok: false, code: "rate_limited", results: [] }, 429);
  }

  const url = new URL(request.url);
  const rawQuery = url.searchParams.get("q") ?? "";
  const query = rawQuery.slice(0, MAX_QUERY_LENGTH).trim();

  if (query.length < 2) return json({ ok: true, results: [] }, 200);

  try {
    const repository = createSupabaseGeoValidationRepository({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    });
    const results = await repository.searchDestinations(query, DEFAULT_SUGGESTION_LIMIT);
    return json({ ok: true, results }, 200);
  } catch (error) {
    const code = error instanceof GeoValidationRepositoryError ? error.code : "geo_search_unavailable";
    // TEMPORARY DIAGNOSTIC LOGGING — R1.2-WS3-IMP-08. Investigation only;
    // not a functional change. Remove once the root cause behind
    // "geo_search_failed" is confirmed. Previously this logged only
    // `{ code }`, discarding the actual error/stack entirely — the reason
    // no underlying exception was visible in the server log before now.
    console.error("Journey Passport destination search failed.", {
      code,
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      query,
    });
    return json({ ok: false, code, results: [] }, 503);
  }
}
