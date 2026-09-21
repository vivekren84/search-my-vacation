// EBC-R1.3-WS12-007 Phase 4: Journey Planning APIs.
// GET /api/workspace/journey-planning/[recordId]/vendor-quotations — JP-06.
// POST — records a new vendor quotation.

import { authenticateWorkspaceApiRequest, jsonResponse } from "@/lib/workspace/shared/api/respond";
import {
  JourneyPlanningAuthorizationError,
  JourneyPlanningRepositoryNotFoundError,
  recordVendorQuotation,
} from "@/lib/workspace/journey-planning/service";
import { listVendorQuotations } from "@/lib/workspace/journey-planning/repository";
import { JourneyPlanningValidationError } from "@/lib/workspace/journey-planning/validation";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ recordId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  try {
    const quotations = await listVendorQuotations(auth.supabase, recordId);
    return jsonResponse({ ok: true, quotations }, 200);
  } catch {
    console.error("Vendor quotation list failed.", { operation: "journey_planning_vendor_quotations_list" });
    return jsonResponse({ ok: false, message: "Could not load vendor quotations." }, 500);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateWorkspaceApiRequest();
  if (!auth.ok) return auth.response;

  const { recordId } = await params;

  let body: { vendorId?: string; quotationAmount?: number; currency?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body." }, 400);
  }

  if (!body.vendorId) {
    return jsonResponse({ ok: false, message: "vendorId is required." }, 400);
  }

  try {
    const quotation = await recordVendorQuotation(
      auth.supabase,
      auth.user,
      recordId,
      body.vendorId,
      body.quotationAmount,
      body.currency,
      body.notes,
    );
    return jsonResponse({ ok: true, quotation }, 201);
  } catch (error) {
    if (error instanceof JourneyPlanningRepositoryNotFoundError) {
      return jsonResponse({ ok: false, message: "Journey Planning record not found." }, 404);
    }
    if (error instanceof JourneyPlanningAuthorizationError) {
      return jsonResponse({ ok: false, code: error.code, message: "You cannot edit this record." }, 403);
    }
    if (error instanceof JourneyPlanningValidationError) {
      return jsonResponse({ ok: false, code: error.code, message: "Invalid vendor quotation." }, 400);
    }
    console.error("Vendor quotation creation failed.", { operation: "journey_planning_vendor_quotation_create" });
    return jsonResponse({ ok: false, message: "Could not record the vendor quotation." }, 500);
  }
}
