// EBC-R1.3-WS12-010: QA Defect Resolution — Defect D1a.
// GET /api/workspace/journey-planning/[recordId]/history — the
// reverse-chronological audit timeline (JP-09) Keerthi's WS12-009 QA
// cycle found entirely absent from the delivered UI, despite the shared
// audit trail (WS12-007 Phase 1) already recording every one of these
// events.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { getJourneyPlanningHistory } from "@/lib/workspace/journey-planning/service";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const events = await getJourneyPlanningHistory(auth.supabase, recordId);
    return jsonResponse({ ok: true, events }, 200);
  } catch {
    console.error("Journey Planning history fetch failed.", { operation: "journey_planning_history" });
    return jsonResponse({ ok: false, message: "Could not load this record's history." }, 500);
  }
}
