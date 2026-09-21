// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — orchestration.
// Combines repository access, validation, record-scoped RBAC
// (shared/rbac/permissions.ts), the Generic Ownership Model
// (shared/ownership/service.ts) and the shared audit trail
// (shared/audit/service.ts). API routes (Phase 4) call only this file, not
// repository.ts directly, per this module's five-file convention.

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  canAdvanceStage,
  canArchiveOutsideNormalClosure,
  canClaimRecord,
  canEditRecord,
  canReassignRecord,
  canRecordDecision,
  type OwnedWorkspaceRecord,
} from "../shared/rbac/permissions";
import { recordWorkspaceAuditEvent } from "../shared/audit/service";
import { claimOwnedWorkspaceRecord, reassignOwnedWorkspaceRecord } from "../shared/ownership/service";
import { notifyWorkspaceUser } from "../shared/notifications/service";

import type { WorkspaceRole } from "../shared/types";

import {
  convertJourneyPlanningRecordToJourney,
  fetchJourneyPlanningRecordById,
  fetchProposalByRecordId,
  insertBootstrapCorporateContact,
  insertBootstrapTraveller,
  insertJourneyPlanningRecord,
  insertPlanningActivity,
  insertProposal,
  insertProposalVersion,
  insertVendorQuotation,
  listJourneyPlanningRecords,
  listPlanningActivities,
  listProposalVersions,
  listVendorQuotations,
  updateJourneyPlanningRecordStage,
  updateVendorQuotationStatus,
} from "./repository";
import {
  validateCreateJourneyPlanningRecordInput,
  validateDecisionOutcome,
  validateItinerarySnapshot,
  validateStageTransition,
  validateVendorQuotationAmount,
} from "./validation";
import type {
  CreateJourneyPlanningRecordInput,
  ItinerarySnapshot,
  JourneyPlanningQueueFilters,
  JourneyPlanningRecord,
  JourneyPlanningStage,
  PlanningActivity,
  PlanningActivityType,
  Proposal,
  ProposalVersion,
  VendorQuotation,
  VendorQuotationStatus,
} from "./types";

const AUDIT_ENTITY_TYPE = "journey_planning_record";

export interface JourneyPlanningActor {
  id: string;
  role: WorkspaceRole;
}

export class JourneyPlanningAuthorizationError extends Error {
  constructor(readonly code: string = "not_authorized") {
    super("Journey Planning action not authorized");
    this.name = "JourneyPlanningAuthorizationError";
  }
}

function toOwnedRecord(record: JourneyPlanningRecord): OwnedWorkspaceRecord {
  return { ownerId: record.ownerId };
}

export async function createJourneyPlanningRecord(
  supabase: SupabaseClient,
  actor: { id: string },
  input: CreateJourneyPlanningRecordInput,
): Promise<JourneyPlanningRecord> {
  validateCreateJourneyPlanningRecordInput(input);

  // AD-WS12-001/AD-WS12-003: resolve inline bootstrap creation fields to
  // ids before inserting the Journey Planning record itself, since the
  // record's FK requires the traveller/corporate-contact row to already
  // exist.
  let travellerId = input.travellerId;
  if (input.recordKind === "individual" && !travellerId && input.newTraveller) {
    travellerId = await insertBootstrapTraveller(supabase, input.newTraveller, actor.id);
  }

  let corporateContactId = input.corporateContactId;
  if (input.recordKind === "corporate" && !corporateContactId && input.newCorporateContact) {
    corporateContactId = await insertBootstrapCorporateContact(supabase, input.newCorporateContact, actor.id);
  }

  const record = await insertJourneyPlanningRecord(supabase, { ...input, travellerId, corporateContactId });

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: record.id,
    eventType: "created",
    actorId: actor.id,
    eventData: { recordKind: record.recordKind },
  });

  return record;
}

export async function getJourneyPlanningQueue(
  supabase: SupabaseClient,
  filters: JourneyPlanningQueueFilters = {},
): Promise<JourneyPlanningRecord[]> {
  return listJourneyPlanningRecords(supabase, filters);
}

export interface JourneyPlanningRecordDetail {
  record: JourneyPlanningRecord;
  proposal: Proposal | null;
  proposalVersions: ProposalVersion[];
  activities: PlanningActivity[];
  vendorQuotations: VendorQuotation[];
}

export async function getJourneyPlanningRecordDetail(
  supabase: SupabaseClient,
  recordId: string,
): Promise<JourneyPlanningRecordDetail | null> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    return null;
  }

  const proposal = await fetchProposalByRecordId(supabase, recordId);
  const [proposalVersions, activities, vendorQuotations] = await Promise.all([
    proposal ? listProposalVersions(supabase, proposal.id) : Promise.resolve([]),
    listPlanningActivities(supabase, recordId),
    listVendorQuotations(supabase, recordId),
  ]);

  return { record, proposal, proposalVersions, activities, vendorQuotations };
}

export async function claimJourneyPlanningRecord(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
): Promise<JourneyPlanningRecord> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canClaimRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_claim_record");
  }

  const result = await claimOwnedWorkspaceRecord(
    supabase,
    "workspace_journey_planning_records",
    recordId,
    actor.id,
  );

  if (!result.claimed) {
    throw new JourneyPlanningAuthorizationError("record_already_claimed");
  }

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "claimed",
    actorId: actor.id,
  });

  const updated = await fetchJourneyPlanningRecordById(supabase, recordId);
  return updated ?? record;
}

export async function reassignJourneyPlanningRecord(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  newOwnerId: string,
): Promise<void> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canReassignRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_reassign_record");
  }

  await reassignOwnedWorkspaceRecord(supabase, "workspace_journey_planning_records", recordId, newOwnerId);

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "reassigned",
    actorId: actor.id,
    eventData: { newOwnerId },
  });

  await notifyWorkspaceUser(supabase, {
    recipientUserId: newOwnerId,
    notificationType: "action_required",
    category: "journey_planning_reassignment",
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    message: `A Journey Planning record ("${record.title}") has been reassigned to you.`,
  });
}

export async function advanceJourneyPlanningStage(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  toStage: JourneyPlanningStage,
): Promise<JourneyPlanningRecord> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canAdvanceStage(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_advance_stage");
  }

  validateStageTransition(record.stage, toStage);

  const updated = await updateJourneyPlanningRecordStage(supabase, recordId, toStage);

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "stage_transition",
    actorId: actor.id,
    eventData: { fromStage: record.stage, toStage },
  });

  if (toStage === "proposal_shared") {
    await recordWorkspaceAuditEvent(supabase, {
      entityType: AUDIT_ENTITY_TYPE,
      entityId: recordId,
      eventType: "proposal_sent",
      actorId: actor.id,
    });
  }

  return updated;
}

// DEC-R1.3-014: creates a new immutable Proposal Version (never updates an
// existing one). Creates the Proposal header on first use for this record
// (DEC-R1.3-013: one Proposal per Journey Planning record).
export async function createProposalVersion(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  itinerarySnapshot: ItinerarySnapshot,
  summary: string | null,
): Promise<ProposalVersion> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canEditRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_edit_record");
  }

  validateItinerarySnapshot(itinerarySnapshot);

  let proposal = await fetchProposalByRecordId(supabase, recordId);
  if (!proposal) {
    proposal = await insertProposal(supabase, recordId, actor.id);
  }

  const existingVersions = await listProposalVersions(supabase, proposal.id);
  const nextVersionNumber = existingVersions.length > 0 ? existingVersions[0].versionNumber + 1 : 1;

  const version = await insertProposalVersion(
    supabase,
    proposal.id,
    nextVersionNumber,
    itinerarySnapshot,
    summary,
    actor.id,
  );

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "proposal_version_created",
    actorId: actor.id,
    eventData: { proposalId: proposal.id, versionNumber: version.versionNumber },
  });

  return version;
}

export async function recordVendorQuotation(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  vendorId: string,
  quotationAmount?: number,
  currency?: string,
  notes?: string,
): Promise<VendorQuotation> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canEditRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_edit_record");
  }

  validateVendorQuotationAmount(quotationAmount);

  const quotation = await insertVendorQuotation(
    supabase,
    recordId,
    vendorId,
    actor.id,
    quotationAmount,
    currency,
    notes,
  );

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "vendor_quotation_recorded",
    actorId: actor.id,
    eventData: { vendorId, quotationId: quotation.id },
  });

  return quotation;
}

export async function setVendorQuotationStatus(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  quotationId: string,
  status: VendorQuotationStatus,
): Promise<VendorQuotation> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canEditRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_edit_record");
  }

  return updateVendorQuotationStatus(supabase, quotationId, status);
}

export async function addPlanningActivity(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  activityType: PlanningActivityType,
  content: string,
): Promise<PlanningActivity> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canEditRecord(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_edit_record");
  }

  // Planning activities are their own append-only historical record
  // (workspace_planning_activities); a duplicate entry in
  // workspace_audit_log would be redundant for this specific event kind, so
  // no separate audit event is written here — an engineering decision
  // recorded in the WS12-007 Engineering Decision Log.
  return insertPlanningActivity(supabase, recordId, activityType, content, actor.id);
}

// BR-012 / WS12-005 Section 6.5: recording a Decision either converts the
// record into a Journey (outcome = "confirmed", via the atomic RPC) or
// closes it directly without a Journey (outcome = "lost" | "archived").
export async function recordJourneyPlanningDecision(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
  outcome: "confirmed" | "lost" | "archived",
): Promise<{ record: JourneyPlanningRecord; journeyId: string | null }> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canRecordDecision(actor, toOwnedRecord(record))) {
    throw new JourneyPlanningAuthorizationError("cannot_record_decision");
  }

  if (record.stage !== "decision") {
    throw new JourneyPlanningAuthorizationError("record_not_in_decision_stage");
  }

  if (outcome === "confirmed") {
    const journeyId = await convertJourneyPlanningRecordToJourney(supabase, recordId, actor.id);
    const updated = await fetchJourneyPlanningRecordById(supabase, recordId);
    return { record: updated ?? record, journeyId };
  }

  validateDecisionOutcome(record.stage, outcome);
  const updated = await updateJourneyPlanningRecordStage(supabase, recordId, "closed", outcome);

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "record_closed",
    actorId: actor.id,
    eventData: { outcome },
  });

  return { record: updated, journeyId: null };
}

// R-ENG-JP-02 adjacent: closing a record outside the normal
// Decision-stage flow (Administrator-only per
// canArchiveOutsideNormalClosure's conservative default).
export async function archiveJourneyPlanningRecordOutsideNormalClosure(
  supabase: SupabaseClient,
  actor: JourneyPlanningActor,
  recordId: string,
): Promise<JourneyPlanningRecord> {
  const record = await fetchJourneyPlanningRecordById(supabase, recordId);
  if (!record) {
    throw new JourneyPlanningRepositoryNotFoundError();
  }

  if (!canArchiveOutsideNormalClosure(actor)) {
    throw new JourneyPlanningAuthorizationError("cannot_archive_outside_normal_closure");
  }

  const updated = await updateJourneyPlanningRecordStage(supabase, recordId, "closed", "archived");

  await recordWorkspaceAuditEvent(supabase, {
    entityType: AUDIT_ENTITY_TYPE,
    entityId: recordId,
    eventType: "archived",
    actorId: actor.id,
  });

  return updated;
}

export class JourneyPlanningRepositoryNotFoundError extends Error {
  constructor() {
    super("Journey Planning record not found");
    this.name = "JourneyPlanningRepositoryNotFoundError";
  }
}
