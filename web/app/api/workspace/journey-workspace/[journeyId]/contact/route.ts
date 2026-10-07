// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): PATCH /api/workspace/journey-workspace/[journeyId]/contact
// { contactType, name, organisation?, phone?, email? } — Primary Operational
// Contact editor (JW-15, BR-040). RLS update plus audit (AD-WS13-002).
// Responds with the refreshed Journey detail; errors per plan §8.2.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  invalidBodyResponse,
  journeyWorkspaceErrorResponse,
  readJsonObject,
  type JourneyRouteParams,
} from "@/lib/workspace/journey-workspace/api";
import { updateJourneyContact } from "@/lib/workspace/journey-workspace/service";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: JourneyRouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;
  const { journeyId } = await params;

  const body = await readJsonObject(request);
  if (!body) return invalidBodyResponse();

  try {
    const journey = await updateJourneyContact(auth.supabase, auth.user, journeyId, body);
    return jsonResponse({ ok: true, journey }, 200);
  } catch (error) {
    return journeyWorkspaceErrorResponse(error, "journey_contact");
  }
}
