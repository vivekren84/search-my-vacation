// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// GET /api/workspace/journey-planning/[recordId]/proposal-versions — full
// version history (JP-07), each entry an immutable itinerary snapshot
// (DEC-R1.3-014).
// POST — creates a new Proposal Version (never updates an existing one).

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  createProposalVersion,
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
} from "@/lib/workspace/journey-planning/service";
import { fetchProposalByRecordId, listProposalVersions } from "@/lib/workspace/journey-planning/repository";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";
import type { ItinerarySnapshot } from "@/lib/workspace/journey-planning/types";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const proposal = await fetchProposalByRecordId(auth.supabase, recordId);
    if (!proposal) {
      return jsonResponse({ ok: true, proposal: null, versions: [] }, 200);
    }
    const versions = await listProposalVersions(auth.supabase, proposal.id);
    return jsonResponse({ ok: true, proposal, versions }, 200);
  } catch {
    console.error("Proposal version list failed.", { operation: "journey_planning_proposal_versions_list" });
    return jsonResponse({ ok: false, message: "Could not load proposal versions." }, 500);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { itinerarySnapshot?: ItinerarySnapshot; summary?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.itinerarySnapshot) {
    return jsonResponse({ ok: false, message: "itinerarySnapshot is required." }, 400);
  }

  try {
    const version = await createProposalVersion(
      auth.supabase,
      auth.user,
      recordId,
      body.itinerarySnapshot,
      body.summary ?? null,
    );
    return jsonResponse({ ok: true, version }, 201);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot edit this record's proposal." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      return jsonResponse({ ok: false, code: error.code, message: "Invalid itinerary snapshot." }, 400);
    }
    console.error("Proposal version creation failed.", { operation: "journey_planning_proposal_version_create" });
    return jsonResponse({ ok: false, message: "Could not create the proposal version." }, 500);
  }
}
