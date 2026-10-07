// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): GET
// /api/workspace/journey-workspace/[journeyId]/itinerary — the accepted
// Proposal Version snapshot (JW-03); `itinerary: null` when the Journey has
// none (some legacy rows: empty state).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { journeyWorkspaceErrorResponse, type JourneyRouteParams } from "@/lib/workspace/journey-workspace/api";
import { getJourneyItinerary } from "@/lib/workspace/journey-workspace/service";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: JourneyRouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const { journeyId } = await params;

  try {
    const itinerary = await getJourneyItinerary(auth.supabase, journeyId);
    return jsonResponse({ ok: true, itinerary }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_itinerary");
  }
}
