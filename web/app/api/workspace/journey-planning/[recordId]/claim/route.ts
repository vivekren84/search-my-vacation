// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/claim — Generic
// Ownership Model claim (R-ENG-JP-04 mitigation).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  claimJourneyPlanningRecord,
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
} from "@/lib/workspace/journey-planning/service";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const record = await claimJourneyPlanningRecord(auth.supabase, auth.user, recordId);
    return jsonResponse({ ok: true, record }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot claim this record." }, 409);
    }
    console.error("Journey Planning claim failed.", { operation: "journey_planning_claim" });
    return jsonResponse({ ok: false, message: "Could not claim the Journey Planning record." }, 500);
  }
}
