// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/decision — Decision
// stage outcome (JP-13). outcome="confirmed" triggers the atomic
// Decision-stage-to-Journey conversion RPC (BR-012, R-ENG-JP-02);
// "lost"/"archived" close the record directly.
//
// EBC-R1.3-WS13-005 Phase 0 (CM-01, CM-05, CM-07, PD-A; WS13-004 §8.1;
// UX Rev 4a §36.3): "confirmed" now requires confirmedStartDate and
// confirmedEndDate (YYYY-MM-DD). Unmet conversion prerequisites are
// returned together as field-specific `issues` (400). The response adds
// journeyReference. Lost and Archived are unchanged.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  recordJourneyPlanningDecision,
} from "@/lib/workspace/journey-planning/service";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";
import type { RecordJourneyPlanningDecisionInput } from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

const OUTCOMES: readonly RecordJourneyPlanningDecisionInput["outcome"][] = ["confirmed", "lost", "archived"];

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: Partial<Record<keyof RecordJourneyPlanningDecisionInput, unknown>>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.outcome) {
    return jsonResponse({ ok: false, message: "outcome is required." }, 400);
  }
  if (!OUTCOMES.includes(body.outcome as RecordJourneyPlanningDecisionInput["outcome"])) {
    return jsonResponse({ ok: false, code: "invalid_decision_outcome", message: "Invalid decision outcome." }, 400);
  }

  try {
    const result = await recordJourneyPlanningDecision(
      auth.supabase,
      auth.user,
      recordId,
      body.outcome as RecordJourneyPlanningDecisionInput["outcome"],
      {
        confirmedStartDate: optionalString(body.confirmedStartDate),
        confirmedEndDate: optionalString(body.confirmedEndDate),
      },
    );
    return jsonResponse(
      { ok: true, record: result.record, journeyId: result.journeyId, journeyReference: result.journeyReference },
      200,
    );
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot record a decision on this record." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      const message = error.issues.length > 0
        ? error.issues.map((issue) => issue.message).join(" ")
        : "Invalid decision outcome.";
      return jsonResponse({ ok: false, code: error.code, issues: error.issues, message }, 400);
    }
    console.error("Journey Planning decision failed.", { operation: "journey_planning_decision" });
    return jsonResponse({ ok: false, message: "Could not record the decision." }, 500);
  }
}
