// EBC-R1.2-WS6-09 (Rad, Phase 1). A dedicated, in-memory rate limiter for
// the destination-search endpoint — deliberately separate from
// web/lib/journey-leads/rate-limit.ts rather than reusing its shared
// module-level state, since search-as-you-type has a materially different
// legitimate request volume per visitor (many small requests while typing)
// than a one-time lead submission, and the two should not share a budget.
// The implementation pattern (Map-keyed sliding window, opportunistic
// eviction) is intentionally identical to the leads rate limiter — this is
// an extension of an existing, trusted convention, not a new design.

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function consumeGeoSearchRateLimit(key: string, now = Date.now()) {
  if (attempts.size > 2000) {
    for (const [candidate, value] of attempts) if (value.resetAt <= now) attempts.delete(candidate);
  }
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export function geoSearchRateLimitKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}
