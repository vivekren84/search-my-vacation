// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/advance-stage — WS12-003
// Section 5 stage transitions, validated server-side against the approved
// lifecycle (never trusted from the client alone).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  advanceJourneyPlanningStage,
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
} from "@/lib/workspace/journey-planning/service";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";
import type { JourneyPlanningStage } from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { toStage?: JourneyPlanningStage };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.toStage) {
    return jsonResponse({ ok: false, message: "toStage is required." }, 400);
  }

  try {
    const record = await advanceJourneyPlanningStage(auth.supabase, auth.user, recordId, body.toStage);
    return jsonResponse({ ok: true, record }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot advance this record's stage." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      // EBC-R1.3-WS12-016 / PRA-01 / PRA-02: the Discovery→Planning and
      // Lead Created→Discovery gates both populate `issues` with
      // field-specific messages; every other JourneyPlanningValidationError
      // thrown for this route (e.g. an out-of-sequence stage jump) leaves
      // `issues` empty, so this falls back to the prior generic message
      // unchanged for those cases.
      const message = error.issues.length > 0
        ? error.issues.map((issue) => issue.message).join(" ")
        : "That stage transition is not allowed.";
      return jsonResponse({ ok: false, code: error.code, issues: error.issues, message }, 400);
    }
    console.error("Journey Planning stage advance failed.", { operation: "journey_planning_advance_stage" });
    return jsonResponse({ ok: false, message: "Could not advance the Journey Planning record's stage." }, 500);
  }
}
