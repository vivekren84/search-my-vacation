// EBC-R1.3-WS12-010: QA Defect Resolution — Defect D1b.
// GET/POST /api/workspace/journey-planning/[recordId]/tasks — Tasks &
// Follow-ups (JP-12), reusing the shared Tasks module (WS12-007 Phase 1)
// which had no consumer until now.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  addJourneyPlanningTask,
  getJourneyPlanningTasks,
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
} from "@/lib/workspace/journey-planning/service";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const tasks = await getJourneyPlanningTasks(auth.supabase, recordId);
    return jsonResponse({ ok: true, tasks }, 200);
  } catch {
    console.error("Journey Planning tasks fetch failed.", { operation: "journey_planning_tasks_list" });
    return jsonResponse({ ok: false, message: "Could not load tasks for this record." }, 500);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { title?: string; description?: string; dueAt?: string; assignedToUserId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.title || body.title.trim().length === 0) {
    return jsonResponse({ ok: false, message: "title is required." }, 400);
  }

  try {
    const task = await addJourneyPlanningTask(auth.supabase, auth.user, recordId, {
      title: body.title,
      description: body.description,
      dueAt: body.dueAt,
      assignedToUserId: body.assignedToUserId,
    });
    return jsonResponse({ ok: true, task }, 201);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot add a task to this record." }, 403);
    }
    console.error("Journey Planning task creation failed.", { operation: "journey_planning_task_create" });
    return jsonResponse({ ok: false, message: "Could not create the task." }, 500);
  }
}
