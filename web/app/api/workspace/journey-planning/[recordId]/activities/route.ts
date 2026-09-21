// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// GET/POST /api/workspace/journey-planning/[recordId]/activities — Planning
// Activities / discovery notes (JP-04). Added alongside the eight routes
// from WS12-006's Implementation Order once Phase 5's Discovery screen
// needed a write path this module's service layer already exposed
// (addPlanningActivity, Phase 3) — a small, in-scope implementation-detail
// addition, not a new business capability; recorded in the WS12-007
// Engineering Decision Log.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  addPlanningActivity,
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
} from "@/lib/workspace/journey-planning/service";
import { listPlanningActivities } from "@/lib/workspace/journey-planning/repository";
import type { PlanningActivityType } from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const activities = await listPlanningActivities(auth.supabase, recordId);
    return jsonResponse({ ok: true, activities }, 200);
  } catch {
    console.error("Planning activity list failed.", { operation: "journey_planning_activities_list" });
    return jsonResponse({ ok: false, message: "Could not load planning activities." }, 500);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { activityType?: PlanningActivityType; content?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.content || body.content.trim().length === 0) {
    return jsonResponse({ ok: false, message: "content is required." }, 400);
  }

  try {
    const activity = await addPlanningActivity(
      auth.supabase,
      auth.user,
      recordId,
      body.activityType ?? "discovery_note",
      body.content,
    );
    return jsonResponse({ ok: true, activity }, 201);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot edit this record." }, 403);
    }
    console.error("Planning activity creation failed.", { operation: "journey_planning_activity_create" });
    return jsonResponse({ ok: false, message: "Could not add the activity." }, 500);
  }
}
