// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// GET /api/workspace/journey-planning/[recordId] — record detail (JP-02):
// the record itself, its Proposal + version history, planning activities
// and vendor quotations.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { getJourneyPlanningRecordDetail } from "@/lib/workspace/journey-planning/service";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const detail = await getJourneyPlanningRecordDetail(auth.supabase, recordId);
    if (!detail) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    return jsonResponse({ ok: true, ...detail }, 200);
  } catch {
    console.error("Journey Planning record detail fetch failed.", { operation: "journey_planning_detail" });
    return jsonResponse({ ok: false, message: "Could not load the Journey Planning record." }, 500);
  }
}
