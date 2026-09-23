// EBC-R1.3-WS12-013: Journey Planning APIs.
// POST /api/workspace/journey-planning/[recordId]/trip-basics — in-place
// edit of Planning Parameters ("Trip Basics") on an existing record,
// most commonly during Discovery (Progressive Enrichment, BR-020).
// Follows the same shape as the existing reassign/claim action routes:
// a dedicated POST sub-route, not a general-purpose PATCH on the record
// itself, consistent with this module's existing convention.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  updateJourneyPlanningTripBasics,
} from "@/lib/workspace/journey-planning/service";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";
import type { UpdateJourneyPlanningTripBasicsInput } from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: UpdateJourneyPlanningTripBasicsInput;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  try {
    const record = await updateJourneyPlanningTripBasics(auth.supabase, auth.user, recordId, {
      adults: body.adults,
      children: body.children,
      infants: body.infants,
      intendedTravelMonth: body.intendedTravelMonth,
      nights: body.nights,
      preferredDepartureCity: body.preferredDepartureCity,
    });
    return jsonResponse({ ok: true, record }, 200);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot edit this record's Trip Basics." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      // EBC-R1.3-WS12-016: extended for consistency with the Create Record
      // and advance-stage routes above, as a direct consequence of
      // validateUpdateJourneyPlanningTripBasicsInput now also populating
      // `issues` (validation.ts) — not a separately-scoped PRA-01 target,
      // but the same shared validation helper, so leaving this route on
      // the old generic message would be an inconsistent regression.
      const message = error.issues.length > 0
        ? error.issues.map((issue) => issue.message).join(" ")
        : "Invalid Trip Basics values.";
      return jsonResponse({ ok: false, code: error.code, issues: error.issues, message }, 400);
    }
    console.error("Journey Planning Trip Basics update failed.", { operation: "journey_planning_trip_basics_update" });
    return jsonResponse({ ok: false, message: "Could not update Trip Basics." }, 500);
  }
}
