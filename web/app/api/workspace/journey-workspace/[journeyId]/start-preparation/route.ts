// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): POST /api/workspace/journey-workspace/[journeyId]/start-preparation
// { expectedStage, templateId } — assign the Readiness Template and move
// Confirmed → In Preparation (BR-041). M11 workspace_journey_assign_template.
// Responds with the refreshed Journey detail; errors per plan §8.2.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  invalidBodyResponse,
  journeyWorkspaceErrorResponse,
  readJsonObject,
  type JourneyRouteParams,
} from "@/lib/workspace/journey-workspace/api";
import { startJourneyPreparation } from "@/lib/workspace/journey-workspace/service";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: JourneyRouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const { journeyId } = await params;

  const body = await readJsonObject(request);
  if (!body) return invalidBodyResponse();

  try {
    const journey = await startJourneyPreparation(auth.supabase, auth.user, journeyId, body);
    return jsonResponse({ ok: true, journey }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_start_preparation");
  }
}
