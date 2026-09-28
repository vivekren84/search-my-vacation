// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — repository.
//
// Follows web/lib/workspace/shared/auth/repository.ts's established
// pattern exactly: the Supabase SDK query-builder against a
// cookie-session-bound client (createWorkspaceSupabaseServerClient()),
// relying on RLS to enforce the Workspace access boundary
// (AD-WS11-002) — NOT the hand-rolled raw-fetch/secret-key pattern used by
// web/lib/journey-leads/repository.ts and
// web/lib/journey-passport-otp/repository.ts for public-site (unauthenticated)
// writes. That pattern authenticates as the service role and bypasses RLS
// by design, which is correct for public-site writes but wrong here, for
// the same reason auth/repository.ts's own comment explains: the whole
// point of AD-WS11-002 is that RLS, evaluated against the signed-in user's
// own JWT, is what enforces the Workspace access boundary.

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateJourneyPlanningRecordInput,
  ItinerarySnapshot,
  JourneyPlanningOriginChannel,
  JourneyPlanningQueueFilters,
  JourneyPlanningRecord,
  JourneyPlanningStage,
  NewBootstrapCorporateContactInput,
  NewBootstrapTravellerInput,
  PlanningActivity,
  PlanningActivityType,
  Proposal,
  ProposalVersion,
  UpdateJourneyPlanningTripBasicsInput,
  VendorQuotation,
  VendorQuotationStatus,
} from "./types";

export class JourneyPlanningRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Journey Planning repository operation failed");
    this.name = "JourneyPlanningRepositoryError";
  }
}

function mapRecordRow(row: Record<string, unknown>): JourneyPlanningRecord {
  return {
    id: row.id as string,
    recordKind: row.record_kind as JourneyPlanningRecord["recordKind"],
    travellerId: (row.traveller_id as string | null) ?? null,
    corporateContactId: (row.corporate_contact_id as string | null) ?? null,
    title: row.title as string,
    destinationRegion: (row.destination_region as string | null) ?? null,
    originChannel: row.origin_channel as JourneyPlanningOriginChannel,
    stage: row.stage as JourneyPlanningStage,
    outcome: (row.outcome as JourneyPlanningRecord["outcome"]) ?? null,
    ownerId: (row.owner_id as string | null) ?? null,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    // EBC-R1.3-WS12-013 Planning Parameters ("Trip Basics").
    adults: (row.adults as number | null) ?? null,
    children: (row.children as number | null) ?? null,
    infants: (row.infants as number | null) ?? null,
    intendedTravelMonth: (row.intended_travel_month as string | null) ?? null,
    nights: (row.nights as number | null) ?? null,
    preferredDepartureCity: (row.preferred_departure_city as string | null) ?? null,
    // EBC-R1.3-WS13-005 Phase 0 (M10). `?? null` keeps reads working if the
    // columns are not yet present (Preview deployed before migrations).
    serviceCategory: (row.service_category as string | null) ?? null,
    replacesJourneyId: (row.replaces_journey_id as string | null) ?? null,
  };
}

// EBC-R1.3-WS13-005 Phase 0: errors raised by
// public.workspace_convert_journey_planning_record (M10) carry a stable
// code as their message. Mapped here to short codes the service turns into
// field-specific feedback (UX Rev 4a §36.3).
export class JourneyPlanningConversionError extends Error {
  constructor(readonly code: string) {
    super("Journey Planning conversion rejected");
    this.name = "JourneyPlanningConversionError";
  }
}

const CONVERSION_RPC_ERROR_CODES: Record<string, string> = {
  workspace_conversion_actor_mismatch: "not_authorised",
  workspace_conversion_not_authorised: "not_authorised",
  workspace_journey_planning_record_not_found: "not_found",
  workspace_journey_planning_record_not_in_decision_stage: "record_not_in_decision_stage",
  workspace_journey_planning_record_already_converted: "already_converted",
  workspace_conversion_owner_required: "owner_required",
  workspace_conversion_dates_required: "dates_required",
  workspace_conversion_dates_invalid: "dates_invalid",
  workspace_conversion_nights_required: "nights_required",
  workspace_conversion_dates_nights_mismatch: "dates_nights_mismatch",
  workspace_conversion_service_category_required: "service_category_required",
  workspace_conversion_service_category_invalid: "service_category_invalid",
  workspace_conversion_original_not_on_hold: "original_not_on_hold",
};

export function mapConversionRpcErrorCode(message: string | undefined): string {
  if (!message) return "conversion_failed";
  return CONVERSION_RPC_ERROR_CODES[message.trim()] ?? "conversion_failed";
}

// AD-WS12-001/AD-WS12-003 bootstrap creation, invoked from the service
// layer when journey-planning's create flow is given inline traveller/
// corporate-contact fields instead of an existing id (see types.ts's
// CreateJourneyPlanningRecordInput comment). These write to
// workspace_travellers/workspace_corporate_contacts -- tables owned by
// future workstreams (WS14) but bootstrapped here per AD-WS12-001 -- and
// live in this repository, not shared/, because Journey Planning is
// presently the sole writer.
export async function insertBootstrapTraveller(
  supabase: SupabaseClient,
  input: NewBootstrapTravellerInput,
  createdByUserId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("workspace_travellers")
    .insert({
      full_name: input.fullName,
      email: input.email ?? null,
      phone: input.phone ?? null,
      created_by_user_id: createdByUserId,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("bootstrap_traveller_insert_failed");
  }

  return data.id as string;
}

export async function insertBootstrapCorporateContact(
  supabase: SupabaseClient,
  input: NewBootstrapCorporateContactInput,
  createdByUserId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("workspace_corporate_contacts")
    .insert({
      company_name: input.companyName,
      contact_name: input.contactName,
      contact_email: input.contactEmail ?? null,
      contact_phone: input.contactPhone ?? null,
      created_by_user_id: createdByUserId,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("bootstrap_corporate_contact_insert_failed");
  }

  return data.id as string;
}

export async function insertJourneyPlanningRecord(
  supabase: SupabaseClient,
  input: CreateJourneyPlanningRecordInput,
): Promise<JourneyPlanningRecord> {
  const { data, error } = await supabase
    .from("workspace_journey_planning_records")
    .insert({
      record_kind: input.recordKind,
      traveller_id: input.travellerId ?? null,
      corporate_contact_id: input.corporateContactId ?? null,
      title: input.title,
      destination_region: input.destinationRegion ?? null,
      origin_channel: input.originChannel,
      created_by_user_id: input.createdByUserId,
      // EBC-R1.3-WS12-013 Planning Parameters ("Trip Basics"). Adults is
      // required by validation.ts before this is ever called; the other
      // five are Progressive-Enrichment-optional (BR-020) and stored as
      // NULL ("unanswered") when not supplied — never defaulted to 0,
      // per BR-023.
      adults: input.adults ?? null,
      children: input.children ?? null,
      infants: input.infants ?? null,
      intended_travel_month: input.intendedTravelMonth ?? null,
      nights: input.nights ?? null,
      preferred_departure_city: input.preferredDepartureCity ?? null,
      // EBC-R1.3-WS13-005 Phase 0 (CM-07): only sent when supplied.
      ...(input.serviceCategory !== undefined ? { service_category: input.serviceCategory } : {}),
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("journey_planning_record_insert_failed");
  }

  return mapRecordRow(data);
}

export async function fetchJourneyPlanningRecordById(
  supabase: SupabaseClient,
  recordId: string,
): Promise<JourneyPlanningRecord | null> {
  const { data, error } = await supabase
    .from("workspace_journey_planning_records")
    .select("*")
    .eq("id", recordId)
    .maybeSingle();

  if (error) {
    throw new JourneyPlanningRepositoryError("journey_planning_record_fetch_failed");
  }

  return data ? mapRecordRow(data) : null;
}

export async function listJourneyPlanningRecords(
  supabase: SupabaseClient,
  filters: JourneyPlanningQueueFilters = {},
): Promise<JourneyPlanningRecord[]> {
  let query = supabase.from("workspace_journey_planning_records").select("*");

  if (filters.stage) {
    query = query.eq("stage", filters.stage);
  }
  if (filters.unassignedOnly) {
    query = query.is("owner_id", null);
  } else if (filters.ownerId) {
    query = query.eq("owner_id", filters.ownerId);
  }
  if (filters.searchText && filters.searchText.trim().length > 0) {
    query = query.ilike("title", `%${filters.searchText.trim()}%`);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });

  if (error) {
    throw new JourneyPlanningRepositoryError("journey_planning_record_list_failed");
  }

  return (data ?? []).map(mapRecordRow);
}

export async function updateJourneyPlanningRecordStage(
  supabase: SupabaseClient,
  recordId: string,
  stage: JourneyPlanningStage,
  outcome: JourneyPlanningRecord["outcome"] = null,
): Promise<JourneyPlanningRecord> {
  const { data, error } = await supabase
    .from("workspace_journey_planning_records")
    .update({ stage, outcome })
    .eq("id", recordId)
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("journey_planning_record_stage_update_failed");
  }

  return mapRecordRow(data);
}

// EBC-R1.3-WS12-013: partial update of Trip Basics on an existing record
// (Discovery in-place editing, Progressive Enrichment/BR-020). Builds the
// update payload from only the fields actually supplied, so an omitted
// field is left untouched at the database layer rather than being
// overwritten with NULL — this is what makes "edit just one field" safe
// to call repeatedly as an Owner fills the panel in over time.
export async function updateJourneyPlanningTripBasics(
  supabase: SupabaseClient,
  recordId: string,
  patch: UpdateJourneyPlanningTripBasicsInput,
): Promise<JourneyPlanningRecord> {
  const update: Record<string, number | string | null> = {};
  if (patch.adults !== undefined) update.adults = patch.adults;
  if (patch.children !== undefined) update.children = patch.children;
  if (patch.infants !== undefined) update.infants = patch.infants;
  if (patch.intendedTravelMonth !== undefined) update.intended_travel_month = patch.intendedTravelMonth;
  if (patch.nights !== undefined) update.nights = patch.nights;
  if (patch.preferredDepartureCity !== undefined) update.preferred_departure_city = patch.preferredDepartureCity;
  // EBC-R1.3-WS13-005 Phase 0 (CM-07): null clears the optional value.
  if (patch.serviceCategory !== undefined) update.service_category = patch.serviceCategory;

  const { data, error } = await supabase
    .from("workspace_journey_planning_records")
    .update(update)
    .eq("id", recordId)
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("journey_planning_record_trip_basics_update_failed");
  }

  return mapRecordRow(data);
}

// EBC-R1.3-WS13-005 Phase 0 (M10, AD-WS13-003): conversion RPC v2 with the
// confirmed travel dates (CM-01). The RPC authorises itself and validates
// owner, dates, nights and Service Category; its rejection codes are
// mapped by mapConversionRpcErrorCode.
export async function convertJourneyPlanningRecordToJourney(
  supabase: SupabaseClient,
  recordId: string,
  actorId: string,
  confirmedStartDate: string,
  confirmedEndDate: string,
): Promise<string> {
  const { data, error } = await supabase.rpc("workspace_convert_journey_planning_record", {
    p_record_id: recordId,
    p_actor_id: actorId,
    p_confirmed_start_date: confirmedStartDate,
    p_confirmed_end_date: confirmedEndDate,
  });

  if (error) {
    throw new JourneyPlanningConversionError(mapConversionRpcErrorCode(error.message));
  }
  if (!data) {
    throw new JourneyPlanningConversionError("conversion_failed");
  }

  return data as string;
}

function mapProposalRow(row: Record<string, unknown>): Proposal {
  return {
    id: row.id as string,
    journeyPlanningRecordId: row.journey_planning_record_id as string,
    currentVersionId: (row.current_version_id as string | null) ?? null,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function insertProposal(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
  createdByUserId: string,
): Promise<Proposal> {
  const { data, error } = await supabase
    .from("workspace_proposals")
    .insert({ journey_planning_record_id: journeyPlanningRecordId, created_by_user_id: createdByUserId })
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("proposal_insert_failed");
  }

  return mapProposalRow(data);
}

export async function fetchProposalByRecordId(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from("workspace_proposals")
    .select("*")
    .eq("journey_planning_record_id", journeyPlanningRecordId)
    .maybeSingle();

  if (error) {
    throw new JourneyPlanningRepositoryError("proposal_fetch_failed");
  }

  return data ? mapProposalRow(data) : null;
}

function mapProposalVersionRow(row: Record<string, unknown>): ProposalVersion {
  return {
    id: row.id as string,
    proposalId: row.proposal_id as string,
    versionNumber: row.version_number as number,
    itinerarySnapshot: row.itinerary_snapshot as ItinerarySnapshot,
    summary: (row.summary as string | null) ?? null,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
  };
}

// DEC-R1.3-014: inserts a new, immutable Proposal Version row (never
// updates a prior one) and repoints the parent Proposal's
// current_version_id at it. These are two separate statements, not a
// database transaction, because the Supabase SDK's query-builder has no
// multi-statement transaction primitive; see the Known Limitations section
// of the WS12-007 implementation report for the accepted risk this
// carries and its mitigation.
export async function insertProposalVersion(
  supabase: SupabaseClient,
  proposalId: string,
  versionNumber: number,
  itinerarySnapshot: ItinerarySnapshot,
  summary: string | null,
  createdByUserId: string,
): Promise<ProposalVersion> {
  const { data, error } = await supabase
    .from("workspace_proposal_versions")
    .insert({
      proposal_id: proposalId,
      version_number: versionNumber,
      itinerary_snapshot: itinerarySnapshot,
      summary,
      created_by_user_id: createdByUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("proposal_version_insert_failed");
  }

  const version = mapProposalVersionRow(data);

  const { error: proposalUpdateError } = await supabase
    .from("workspace_proposals")
    .update({ current_version_id: version.id })
    .eq("id", proposalId);

  if (proposalUpdateError) {
    throw new JourneyPlanningRepositoryError("proposal_current_version_update_failed");
  }

  return version;
}

export async function listProposalVersions(
  supabase: SupabaseClient,
  proposalId: string,
): Promise<ProposalVersion[]> {
  const { data, error } = await supabase
    .from("workspace_proposal_versions")
    .select("*")
    .eq("proposal_id", proposalId)
    .order("version_number", { ascending: false });

  if (error) {
    throw new JourneyPlanningRepositoryError("proposal_version_list_failed");
  }

  return (data ?? []).map(mapProposalVersionRow);
}

function mapPlanningActivityRow(row: Record<string, unknown>): PlanningActivity {
  return {
    id: row.id as string,
    journeyPlanningRecordId: row.journey_planning_record_id as string,
    activityType: row.activity_type as PlanningActivityType,
    content: row.content as string,
    authorUserId: row.author_user_id as string,
    createdAt: row.created_at as string,
  };
}

export async function insertPlanningActivity(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
  activityType: PlanningActivityType,
  content: string,
  authorUserId: string,
): Promise<PlanningActivity> {
  const { data, error } = await supabase
    .from("workspace_planning_activities")
    .insert({
      journey_planning_record_id: journeyPlanningRecordId,
      activity_type: activityType,
      content,
      author_user_id: authorUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("planning_activity_insert_failed");
  }

  return mapPlanningActivityRow(data);
}

export async function listPlanningActivities(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<PlanningActivity[]> {
  const { data, error } = await supabase
    .from("workspace_planning_activities")
    .select("*")
    .eq("journey_planning_record_id", journeyPlanningRecordId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new JourneyPlanningRepositoryError("planning_activity_list_failed");
  }

  return (data ?? []).map(mapPlanningActivityRow);
}

function mapVendorQuotationRow(row: Record<string, unknown>): VendorQuotation {
  return {
    id: row.id as string,
    journeyPlanningRecordId: row.journey_planning_record_id as string,
    vendorId: row.vendor_id as string,
    quotationAmount: (row.quotation_amount as number | null) ?? null,
    currency: (row.currency as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    status: row.status as VendorQuotationStatus,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function insertVendorQuotation(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
  vendorId: string,
  createdByUserId: string,
  quotationAmount?: number,
  currency?: string,
  notes?: string,
): Promise<VendorQuotation> {
  const { data, error } = await supabase
    .from("workspace_vendor_quotations")
    .insert({
      journey_planning_record_id: journeyPlanningRecordId,
      vendor_id: vendorId,
      quotation_amount: quotationAmount ?? null,
      currency: currency ?? null,
      notes: notes ?? null,
      created_by_user_id: createdByUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("vendor_quotation_insert_failed");
  }

  return mapVendorQuotationRow(data);
}

export async function updateVendorQuotationStatus(
  supabase: SupabaseClient,
  quotationId: string,
  status: VendorQuotationStatus,
): Promise<VendorQuotation> {
  const { data, error } = await supabase
    .from("workspace_vendor_quotations")
    .update({ status })
    .eq("id", quotationId)
    .select("*")
    .single();

  if (error || !data) {
    throw new JourneyPlanningRepositoryError("vendor_quotation_status_update_failed");
  }

  return mapVendorQuotationRow(data);
}

export async function listVendorQuotations(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<VendorQuotation[]> {
  const { data, error } = await supabase
    .from("workspace_vendor_quotations")
    .select("*")
    .eq("journey_planning_record_id", journeyPlanningRecordId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new JourneyPlanningRepositoryError("vendor_quotation_list_failed");
  }

  return (data ?? []).map(mapVendorQuotationRow);
}
