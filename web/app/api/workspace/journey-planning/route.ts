// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// GET /api/workspace/journey-planning — queue (WS12-004 UX screen JP-01),
// with optional stage/owner/search filters.
// POST /api/workspace/journey-planning — create a new record (JP-03).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import { createJourneyPlanningRecord, getJourneyPlanningQueue } from "@/lib/workspace/journey-planning/service";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";
import type {
  CreateJourneyPlanningRecordInput,
  JourneyPlanningQueueFilters,
  JourneyPlanningStage,
} from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const filters: JourneyPlanningQueueFilters = {
    stage: (url.searchParams.get("stage") as JourneyPlanningStage | null) ?? undefined,
    unassignedOnly: url.searchParams.get("unassignedOnly") === "true",
    ownerId: url.searchParams.get("ownerId") ?? undefined,
    searchText: url.searchParams.get("q") ?? undefined,
  };

  try {
    const records = await getJourneyPlanningQueue(auth.supabase, filters);
    return jsonResponse({ ok: true, records }, 200);
  } catch {
    console.error("Journey Planning queue fetch failed.", { operation: "journey_planning_queue" });
    return jsonResponse({ ok: false, message: "Could not load the Journey Planning queue." }, 500);
  }
}

export async function POST(request: Request) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  let body: Partial<CreateJourneyPlanningRecordInput>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  try {
    const record = await createJourneyPlanningRecord(auth.supabase, { id: auth.user.id }, {
      recordKind: body.recordKind as CreateJourneyPlanningRecordInput["recordKind"],
      travellerId: body.travellerId,
      newTraveller: body.newTraveller,
      corporateContactId: body.corporateContactId,
      newCorporateContact: body.newCorporateContact,
      title: body.title as string,
      destinationRegion: body.destinationRegion,
      createdByUserId: auth.user.id,
    });
    return jsonResponse({ ok: true, record }, 201);
  } catch (error) {
    if (error instanceof JourneyPlanningValidationError) {
      return jsonResponse({ ok: false, code: error.code, message: "Invalid Journey Planning record." }, 400);
    }
    console.error("Journey Planning record creation failed.", { operation: "journey_planning_create" });
    return jsonResponse({ ok: false, message: "Could not create the Journey Planning record." }, 500);
  }
}
