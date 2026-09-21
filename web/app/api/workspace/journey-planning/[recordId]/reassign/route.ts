// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/reassign — record-scoped
// reassignment (canReassignRecord), notifies the new owner.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  reassignJourneyPlanningRecord,
} from "@/lib/workspace/journey-planning/service";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { newOwnerId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.newOwnerId) {
    return jsonResponse({ ok: false, message: "newOwnerId is required." }, 400);
  }

  try {
    await reassignJourneyPlanningRecord(auth.supabase, auth.user, recordId, body.newOwnerId);
    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot reassign this record." }, 403);
    }
    console.error("Journey Planning reassignment failed.", { operation: "journey_planning_reassign" });
    return jsonResponse({ ok: false, message: "Could not reassign the Journey Planning record." }, 500);
  }
}
