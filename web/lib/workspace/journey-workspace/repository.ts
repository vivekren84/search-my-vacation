// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace read repository.
// Session-bound client; RLS gives every Workspace User read access
// (BR-035). Journeys are never written here directly: every Journey write
// is a SECURITY DEFINER RPC (AD-WS13-002) added in the phase that uses it.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Journey, JourneyReferenceSummary } from "./types";

export class JourneyWorkspaceRepositoryError extends Error {
  constructor(readonly code: string) {
    super("Journey Workspace repository operation failed");
    this.name = "JourneyWorkspaceRepositoryError";
  }
}

export function mapJourneyRow(row: Record<string, unknown>): Journey {
  return {
    id: row.id as string,
    journeyReference: row.journey_reference as string,
    journeyPlanningRecordId: row.journey_planning_record_id as string,
    travellerId: (row.traveller_id as string | null) ?? null,
    corporateContactId: (row.corporate_contact_id as string | null) ?? null,
    ownerId: (row.owner_id as string | null) ?? null,
    destinationRegion: (row.destination_region as string | null) ?? null,
    serviceCategory: (row.service_category as string | null) ?? null,
    confirmedStartDate: (row.confirmed_start_date as string | null) ?? null,
    confirmedEndDate: (row.confirmed_end_date as string | null) ?? null,
    adults: (row.adults as number | null) ?? null,
    children: (row.children as number | null) ?? null,
    infants: (row.infants as number | null) ?? null,
    nights: (row.nights as number | null) ?? null,
    departureCity: (row.departure_city as string | null) ?? null,
    acceptedProposalVersionId: (row.accepted_proposal_version_id as string | null) ?? null,
    stage: row.stage as Journey["stage"],
    stageChangedAt: row.stage_changed_at as string,
    outcome: (row.outcome as Journey["outcome"]) ?? null,
    outcomeReason: (row.outcome_reason as string | null) ?? null,
    onHold: Boolean(row.on_hold),
    onHoldReason: (row.on_hold_reason as string | null) ?? null,
    onHoldSince: (row.on_hold_since as string | null) ?? null,
    closedAt: (row.closed_at as string | null) ?? null,
    archivedAt: (row.archived_at as string | null) ?? null,
    archivedBy: (row.archived_by as string | null) ?? null,
    archiveReason: (row.archive_reason as string | null) ?? null,
    readinessTemplateId: (row.readiness_template_id as string | null) ?? null,
    supersedesJourneyId: (row.supersedes_journey_id as string | null) ?? null,
    adoptionStatus: (row.adoption_status as Journey["adoptionStatus"]) ?? "adopted",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

const REFERENCE_SUMMARY_COLUMNS =
  "id, journey_reference, confirmed_start_date, confirmed_end_date, nights, on_hold, outcome, stage";

function mapReferenceSummaryRow(row: Record<string, unknown>): JourneyReferenceSummary {
  return {
    id: row.id as string,
    journeyReference: row.journey_reference as string,
    confirmedStartDate: (row.confirmed_start_date as string | null) ?? null,
    confirmedEndDate: (row.confirmed_end_date as string | null) ?? null,
    nights: (row.nights as number | null) ?? null,
    onHold: Boolean(row.on_hold),
    outcome: (row.outcome as JourneyReferenceSummary["outcome"]) ?? null,
    stage: row.stage as JourneyReferenceSummary["stage"],
  };
}

export async function fetchJourneyById(supabase: SupabaseClient, journeyId: string): Promise<Journey | null> {
  const { data, error } = await supabase.from("workspace_journeys").select("*").eq("id", journeyId).maybeSingle();
  if (error) {
    throw new JourneyWorkspaceRepositoryError("journey_fetch_failed");
  }
  return data ? mapJourneyRow(data) : null;
}

export async function fetchJourneyReferenceSummaryById(
  supabase: SupabaseClient,
  journeyId: string,
): Promise<JourneyReferenceSummary | null> {
  const { data, error } = await supabase
    .from("workspace_journeys")
    .select(REFERENCE_SUMMARY_COLUMNS)
    .eq("id", journeyId)
    .maybeSingle();
  if (error) {
    throw new JourneyWorkspaceRepositoryError("journey_reference_fetch_failed");
  }
  return data ? mapReferenceSummaryRow(data) : null;
}

export async function fetchJourneyReferenceSummaryByPlanningRecordId(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<JourneyReferenceSummary | null> {
  const { data, error } = await supabase
    .from("workspace_journeys")
    .select(REFERENCE_SUMMARY_COLUMNS)
    .eq("journey_planning_record_id", journeyPlanningRecordId)
    .maybeSingle();
  if (error) {
    throw new JourneyWorkspaceRepositoryError("journey_reference_fetch_failed");
  }
  return data ? mapReferenceSummaryRow(data) : null;
}
