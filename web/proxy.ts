// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0) — Route Protection /
// Middleware entry point.
//
// Named `proxy.ts` (not `middleware.ts`) per Product Owner approval on review
// of this EBC's implementation report, Section 5: Next.js deprecated and
// renamed the `middleware` file convention to `proxy` as of v16.0.0, and this
// repository runs 16.2.10. All of the actual session-refresh / route-
// protection logic lives in lib/workspace/shared/supabase/session.ts,
// independent of this file's name — this file is only the framework's
// required entry point.
//
// Matcher: scoped to /workspace/** only. Corrected from an earlier
// site-wide matcher (Section 6 of the implementation report, "site-wide
// proxy matcher" note): a matcher covering every route would have run
// updateWorkspaceSession() — and its Supabase Auth getUser() network call —
// on every public-site page and every existing public API route, none of
// which needs a Workspace session check. Scoping the matcher to
// /workspace/** is what actually guarantees non-workspace routes are
// unaffected, verified by running proxy on both a public route and a
// Workspace route and confirming only the latter is intercepted.
import type { NextRequest } from "next/server";

import { updateWorkspaceSession } from "@/lib/workspace/shared/supabase/session";

export function proxy(request: NextRequest) {
  return updateWorkspaceSession(request);
}

export const config = {
  matcher: ["/workspace/:path*"],
};
