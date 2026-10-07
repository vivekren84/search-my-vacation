// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/journey-workspace/[journeyId] — Journey detail (JW-02): the
// Journey, its operational summary row, party, Primary Operational Contact,
// owner, links, and the actions available to the caller (plan §8.3).
// Read-only; every Workspace User may view any Journey (BR-035).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { journeyWorkspaceErrorResponse, type JourneyRouteParams } from "@/lib/workspace/journey-workspace/api";
import { getJourneyDetail } from "@/lib/workspace/journey-workspace/service";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: JourneyRouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const { journeyId } = await params;

  try {
    const journey = await getJourneyDetail(auth.supabase, auth.user, journeyId);
    return jsonResponse({ ok: true, journey }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_detail");
  }
}
