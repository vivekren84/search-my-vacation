// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/journey-workspace — Active Journeys list (JW-01; FR-JW-03,
// FR-JW-29; UX §7, §20). Query parameters as the list page URL: scope,
// owner, stage, onHold, readiness, departing, departure, from, to, q, sort,
// group (parseJourneyListQuery; unknown values fall back to defaults).
// Includes the summary-strip counts for the same scope, owner and search.
// No create route (FR-JW-05) and no DELETE (BR-033, FR-JW-31).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { journeyWorkspaceErrorResponse } from "@/lib/workspace/journey-workspace/api";
import { parseJourneyListQuery } from "@/lib/workspace/journey-workspace/list";
import { listJourneys } from "@/lib/workspace/journey-workspace/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const query = parseJourneyListQuery(new URL(request.url).searchParams);

  try {
    const result = await listJourneys(auth.supabase, auth.user, query);
    return jsonResponse({ ok: true, ...result }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_list");
  }
}
