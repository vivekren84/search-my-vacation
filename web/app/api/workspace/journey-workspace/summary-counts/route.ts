// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/journey-workspace/summary-counts — summary-strip counts
// only (FR-JW-34), for the scope, owner and search in the query (filters
// do not change the counts: FR-JW-34 AC1). Same service as the list, so a
// chip's count always equals the list that chip produces.

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
    const { counts, today } = await listJourneys(auth.supabase, auth.user, query);
    return jsonResponse({ ok: true, counts, today }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_summary_counts");
  }
}
