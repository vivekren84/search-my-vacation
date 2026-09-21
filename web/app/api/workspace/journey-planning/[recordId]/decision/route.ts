// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/decision — Decision
// stage outcome (JP-13). outcome="confirmed" triggers the atomic
// Decision-stage-to-Journey conversion RPC (BR-012, R-ENG-JP-02);
// "lost"/"archived" close the record directly.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  recordJourneyPlanningDecision,
} from "@/lib/workspace/journey-planning/service";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { outcome?: "confirmed" | "lost" | "archived" };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.outcome) {
    return jsonResponse({ ok: false, message: "outcome is required." }, 400);
  }

  try {
    const result = await recordJourneyPlanningDecision(auth.supabase, auth.user, recordId, body.outcome);
    return jsonResponse({ ok: true, record: result.record, journeyId: result.journeyId }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot record a decision on this record." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      return jsonResponse({ ok: false, code: error.code, message: "Invalid decision outcome." }, 400);
    }
    console.error("Journey Planning decision failed.", { operation: "journey_planning_decision" });
    return jsonResponse({ ok: false, message: "Could not record the decision." }, 500);
  }
}
