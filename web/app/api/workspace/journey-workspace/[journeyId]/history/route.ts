// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/journey-workspace/[journeyId]/history?filter=&before= —
// Journey History (JW-08; UX §21): newest first, pages of 50; `before` is
// the `nextBefore` cursor of the previous page. Filters (EBC-R1.3-WS13-020B
// S-6): all · stage_status · ownership · contact_category.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { journeyWorkspaceErrorResponse, type JourneyRouteParams } from "@/lib/workspace/journey-workspace/api";
import { getJourneyHistory } from "@/lib/workspace/journey-workspace/service";
import { parseJourneyHistoryFilter } from "@/lib/workspace/journey-workspace/validation";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: JourneyRouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const { journeyId } = await params;
  const url = new URL(request.url);

  try {
    const history = await getJourneyHistory(auth.supabase, journeyId, {
      filter: parseJourneyHistoryFilter(url.searchParams.get("filter")),
      before: url.searchParams.get("before"),
    });
    return jsonResponse({ ok: true, history }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_history");
  }
}
