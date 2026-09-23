// EBC-R1.3-WS12-010: QA Defect Resolution — Defect D1b.
// POST /api/workspace/journey-planning/[recordId]/tasks/[taskId]/status —
// mark a task complete/open/cancelled.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  setJourneyPlanningTaskStatus,
} from "@/lib/workspace/journey-planning/service";
import type { WorkspaceTaskStatus } from "@/lib/workspace/shared/tasks-follow-ups/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string; taskId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId, taskId } = await params;

  let body: { status?: WorkspaceTaskStatus };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.status || !["open", "completed", "cancelled"].includes(body.status)) {
    return jsonResponse({ ok: false, message: "A valid status is required." }, 400);
  }

  try {
    await setJourneyPlanningTaskStatus(auth.supabase, auth.user, recordId, taskId, body.status);
    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot update this task." }, 403);
    }
    console.error("Journey Planning task status update failed.", { operation: "journey_planning_task_status" });
    return jsonResponse({ ok: false, message: "Could not update the task." }, 500);
  }
}
