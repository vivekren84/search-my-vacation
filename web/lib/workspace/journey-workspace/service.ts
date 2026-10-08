// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace service. Phase 0
// exposes only the reads Journey Planning needs at its entry point
// (WS13-004A AC-01; UX Rev 4a §36.3): the Journey created from a planning
// record, and the original Journey a replacement planning record replaces.
//
// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): Journey Core reads (list,
// summary counts, detail, History, Itinerary) and the lifecycle mutations.
// Every Journey write is an M11 SECURITY DEFINER RPC (AD-WS13-002); the one
// exception is the Primary Operational Contact editor, an RLS update plus an
// application audit entry (plan §8.2, non-atomic, accepted in AD-WS13-002).
// The service validates input first and reports every field problem at once
// (PRA-01 precedent); the RPC repeats every check and stays the authority.
// Each mutation returns the refreshed Journey detail.

import type { SupabaseClient } from "@supabase/supabase-js";

import { recordWorkspaceAuditEvent } from "../shared/audit/service";
import { businessDateOf } from "../shared/time/businessDate";
import type { WorkspaceRole } from "../shared/types";
import { getWorkspaceUserDirectory } from "../shared/users/service";
import type { WorkspaceDirectoryUser } from "../shared/users/types";
import { getWorkspaceSettings } from "../settings/service";
import type { WorkspaceSettings } from "../settings/types";
import { deriveNextAction, getAvailableJourneyActions, journeyHistoryCategory, journeyHistoryEventTypes } from "./derivations";
import { fieldIssue, journeyValidationError, JourneyWorkspaceError } from "./errors";
import { applyJourneyListQuery, computeJourneySummaryCounts } from "./list";
import {
  fetchActiveJourneySummaries,
  fetchCorporateContacts,
  fetchJourneyById,
  fetchJourneyHistoryRows,
  fetchJourneyLinkRef,
  fetchJourneyPartyRows,
  fetchJourneyReferenceSummaryById,
  fetchJourneyReferenceSummaryByPlanningRecordId,
  fetchJourneySummaryById,
  fetchLastActivity,
  fetchPlanningRecordRef,
  fetchPrimaryContacts,
  fetchProposalVersion,
  fetchReadinessTemplateRef,
  fetchTravellerNames,
  JOURNEY_HISTORY_PAGE_SIZE,
  rpcAdoptLegacyJourney,
  rpcAssignJourneyTemplate,
  rpcCancelJourney,
  rpcCloseJourney,
  rpcPlaceJourneyOnHold,
  rpcReassignJourney,
  rpcResumeJourney,
  rpcSetJourneyServiceCategory,
  rpcTransitionJourney,
  searchJourneyIds,
  updatePrimaryContact,
} from "./repository";
import type {
  Journey,
  JourneyActionKind,
  JourneyDetail,
  JourneyFieldIssue,
  JourneyHistoryFilter,
  JourneyHistoryPage,
  JourneyItinerary,
  JourneyListItem,
  JourneyListQuery,
  JourneyListResult,
  JourneyParty,
  JourneyReferenceSummary,
  JourneyStage,
  JourneyWorkspaceErrorCode,
  OperationalContact,
  OperationalContactInput,
} from "./types";
import {
  canViewTeamScope,
  decodeJourneyHistoryCursor,
  encodeJourneyHistoryCursor,
  isJourneyStage,
  isJourneyTerminal,
  isUuid,
  normaliseJourneyNote,
  normaliseJourneyReason,
  validateAdoptionDates,
  validateOperationalContactInput,
} from "./validation";

// ---------------------------------------------------------------------
// Phase 0 reads (unchanged)
// ---------------------------------------------------------------------

export async function getJourneyCreatedFromPlanningRecord(
  supabase: SupabaseClient,
  journeyPlanningRecordId: string,
): Promise<JourneyReferenceSummary | null> {
  return fetchJourneyReferenceSummaryByPlanningRecordId(supabase, journeyPlanningRecordId);
}

export async function getJourneyReferenceSummary(
  supabase: SupabaseClient,
  journeyId: string,
): Promise<JourneyReferenceSummary | null> {
  return fetchJourneyReferenceSummaryById(supabase, journeyId);
}

// ---------------------------------------------------------------------
// Phase 1 (WP-1.2)
// ---------------------------------------------------------------------

// The signed-in Workspace User (from authenticateWorkspaceApiRequest).
export interface JourneyWorkspaceActor {
  id: string;
  role: WorkspaceRole;
}

type Body = Record<string, unknown>;

function businessToday(settings: WorkspaceSettings): string {
  return businessDateOf(new Date(), settings.businessTimeZone);
}

function directoryMap(users: WorkspaceDirectoryUser[]): Map<string, WorkspaceDirectoryUser> {
  return new Map(users.map((user) => [user.userId, user]));
}

function requireJourneyId(journeyId: string): void {
  // A malformed id can never match a Journey; answer as "not found" rather
  // than letting PostgREST reject the uuid cast.
  if (!isUuid(journeyId)) throw new JourneyWorkspaceError("not_found");
}

function throwIfIssues(issues: JourneyFieldIssue[]): void {
  if (issues.length > 0) throw journeyValidationError(issues);
}

function expectedStageOf(body: Body, issues: JourneyFieldIssue[]): JourneyStage {
  const value = body.expectedStage;
  if (!isJourneyStage(value)) {
    issues.push(fieldIssue("expectedStage", "invalid_request"));
    return "confirmed";
  }
  return value;
}

function reasonOf(body: Body, issues: JourneyFieldIssue[]): string {
  const result = normaliseJourneyReason(body.reason);
  if ("issue" in result) {
    issues.push(result.issue);
    return "";
  }
  return result.value;
}

function noteOf(body: Body, issues: JourneyFieldIssue[]): string | null {
  const result = normaliseJourneyNote(body.note);
  if ("issue" in result) {
    issues.push(result.issue);
    return null;
  }
  return result.value;
}

// ---- List and summary counts (JW-01) ---------------------------------

// FR-JW-03 / PO Decision 3: "mine" is the caller's Journeys; "team" is
// every active Journey, optionally one named owner. Summary counts cover the
// same scope, owner and search, before the filters (FR-JW-34 AC1).
export async function listJourneys(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  requested: JourneyListQuery,
): Promise<JourneyListResult> {
  const query: JourneyListQuery =
    requested.scope === "team" && !canViewTeamScope(actor.role) ? { ...requested, scope: "mine", ownerId: null } : requested;
  const ownerId = query.scope === "mine" ? actor.id : query.ownerId;

  const [summaries, matchingIds, settings, directory] = await Promise.all([
    fetchActiveJourneySummaries(supabase, { ownerId }),
    query.q ? searchJourneyIds(supabase, query.q) : Promise.resolve(null),
    getWorkspaceSettings(supabase),
    getWorkspaceUserDirectory(supabase),
  ]);
  const today = businessToday(settings);
  const inScope = matchingIds ? summaries.filter((row) => matchingIds.has(row.journeyId)) : summaries;
  const ids = inScope.map((row) => row.journeyId);

  const [partyRows, contacts, lastActivity] = await Promise.all([
    fetchJourneyPartyRows(supabase, ids),
    fetchPrimaryContacts(supabase, ids),
    fetchLastActivity(supabase, ids),
  ]);
  const travellerIds = [...new Set(partyRows.flatMap((row) => (row.travellerId ? [row.travellerId] : [])))];
  const corporateIds = [...new Set(partyRows.flatMap((row) => (row.corporateContactId ? [row.corporateContactId] : [])))];
  const [travellers, corporates] = await Promise.all([
    fetchTravellerNames(supabase, travellerIds),
    fetchCorporateContacts(supabase, corporateIds),
  ]);

  const parties = new Map(partyRows.map((row) => [row.id, row]));
  const users = directoryMap(directory);

  const items: JourneyListItem[] = inScope.map((row) => {
    const party = parties.get(row.journeyId);
    const isCorporate = Boolean(party?.corporateContactId);
    const owner = row.ownerId ? users.get(row.ownerId) : undefined;
    return {
      id: row.journeyId,
      journeyReference: row.journeyReference,
      partyKind: isCorporate ? "corporate" : "traveller",
      partyName: isCorporate
        ? (corporates.get(party?.corporateContactId as string)?.companyName ?? null)
        : party?.travellerId
          ? (travellers.get(party.travellerId) ?? null)
          : null,
      destinationRegion: row.destinationRegion,
      serviceCategory: row.serviceCategory,
      confirmedStartDate: row.confirmedStartDate,
      confirmedEndDate: row.confirmedEndDate,
      daysToDeparture: row.daysToDeparture,
      departingWithinWindow: row.departingWithinWindow,
      stage: row.stage,
      onHold: row.onHold,
      adoptionStatus: row.adoptionStatus,
      readinessState: row.readinessState,
      readinessMandatoryTotal: row.readinessMandatoryTotal,
      primaryContactName: contacts.get(row.journeyId)?.name ?? null,
      ownerId: row.ownerId,
      ownerName: owner?.displayName ?? null,
      ownerActive: owner?.isActive ?? false,
      nextAction: deriveNextAction({ ...row, today }),
      createdAt: party?.createdAt ?? "",
      lastActivityAt: lastActivity.get(row.journeyId) ?? null,
    };
  });

  return {
    items: applyJourneyListQuery(items, query, today),
    counts: computeJourneySummaryCounts(items, today),
    query,
    today,
    departureWindowDays: settings.departureWindowDays,
  };
}

// ---- Detail (JW-02) --------------------------------------------------

async function loadJourneyDetail(supabase: SupabaseClient, actor: JourneyWorkspaceActor, journeyId: string): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const [journey, summary, contacts, settings, directory, supersededBy] = await Promise.all([
    fetchJourneyById(supabase, journeyId),
    fetchJourneySummaryById(supabase, journeyId),
    fetchPrimaryContacts(supabase, [journeyId]),
    getWorkspaceSettings(supabase),
    getWorkspaceUserDirectory(supabase),
    fetchJourneyLinkRef(supabase, "supersedes_journey_id", journeyId),
  ]);
  if (!journey) throw new JourneyWorkspaceError("not_found");
  if (!summary) throw new JourneyWorkspaceError("operation_failed");

  const [party, planningRecord, readinessTemplate, supersedes] = await Promise.all([
    loadParty(supabase, journey),
    fetchPlanningRecordRef(supabase, journey.journeyPlanningRecordId),
    journey.readinessTemplateId ? fetchReadinessTemplateRef(supabase, journey.readinessTemplateId) : Promise.resolve(null),
    journey.supersedesJourneyId ? fetchJourneyLinkRef(supabase, "id", journey.supersedesJourneyId) : Promise.resolve(null),
  ]);

  const today = businessToday(settings);
  const owner = journey.ownerId ? directoryMap(directory).get(journey.ownerId) : undefined;

  return {
    journey,
    summary,
    party,
    contact: contacts.get(journeyId) ?? null,
    owner: journey.ownerId
      ? { id: journey.ownerId, name: owner?.displayName ?? "Unknown user", active: owner?.isActive ?? false }
      : null,
    planningRecord,
    readinessTemplate,
    supersedes,
    supersededBy,
    availableActions: getAvailableJourneyActions(
      { ...journey, readinessMandatoryUnresolved: summary.readinessMandatoryUnresolved },
      actor,
      today,
    ),
    today,
  };
}

async function loadParty(supabase: SupabaseClient, journey: Journey): Promise<JourneyParty> {
  if (journey.corporateContactId) {
    const corporate = (await fetchCorporateContacts(supabase, [journey.corporateContactId])).get(journey.corporateContactId);
    return {
      kind: "corporate",
      travellerId: journey.travellerId,
      corporateContactId: journey.corporateContactId,
      name: corporate?.contactName ?? null,
      companyName: corporate?.companyName ?? null,
    };
  }
  const name = journey.travellerId ? (await fetchTravellerNames(supabase, [journey.travellerId])).get(journey.travellerId) : undefined;
  return { kind: "traveller", travellerId: journey.travellerId, corporateContactId: null, name: name ?? null, companyName: null };
}

export async function getJourneyDetail(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
): Promise<JourneyDetail> {
  return loadJourneyDetail(supabase, actor, journeyId);
}

// ---- History (JW-08) -------------------------------------------------

export async function getJourneyHistory(
  supabase: SupabaseClient,
  journeyId: string,
  options: { filter: JourneyHistoryFilter; before: string | null },
): Promise<JourneyHistoryPage> {
  requireJourneyId(journeyId);
  const cursor = decodeJourneyHistoryCursor(options.before);
  if ("issue" in cursor) throw journeyValidationError([cursor.issue]);
  const before = cursor.value;
  const [journey, rows, directory] = await Promise.all([
    fetchJourneyReferenceSummaryById(supabase, journeyId),
    fetchJourneyHistoryRows(supabase, journeyId, {
      before,
      eventTypes: options.filter === "all" ? null : journeyHistoryEventTypes(options.filter),
      limit: JOURNEY_HISTORY_PAGE_SIZE + 1,
    }),
    getWorkspaceUserDirectory(supabase),
  ]);
  if (!journey) throw new JourneyWorkspaceError("not_found");

  const users = directoryMap(directory);
  const page = rows.slice(0, JOURNEY_HISTORY_PAGE_SIZE);
  const hasMore = rows.length > JOURNEY_HISTORY_PAGE_SIZE;
  const last = page[page.length - 1];
  return {
    entries: page.map((row) => ({
      id: row.id,
      eventType: row.eventType,
      category: journeyHistoryCategory(row.eventType),
      actorId: row.actorId,
      // System events (actorId null) are shown as "Workspace (automatic)".
      actorName: row.actorId ? (users.get(row.actorId)?.displayName ?? "Unknown user") : null,
      eventData: row.eventData,
      createdAt: row.createdAt,
    })),
    hasMore,
    nextBefore: hasMore && last ? encodeJourneyHistoryCursor({ createdAt: last.createdAt, id: last.id }) : null,
  };
}

// ---- Itinerary (JW-03) -----------------------------------------------

// The accepted Proposal Version's snapshot; null (empty state) when the
// Journey has none (some legacy rows).
export async function getJourneyItinerary(supabase: SupabaseClient, journeyId: string): Promise<JourneyItinerary | null> {
  requireJourneyId(journeyId);
  const journey = await fetchJourneyById(supabase, journeyId);
  if (!journey) throw new JourneyWorkspaceError("not_found");
  return journey.acceptedProposalVersionId ? fetchProposalVersion(supabase, journey.acceptedProposalVersionId) : null;
}

// ---- Lifecycle mutations (M11 RPCs) ----------------------------------

// POST …/transition { expectedStage, toStage, note? } — advance one stage
// or step back Ready to Travel → In Preparation (FR-JW-08/09).
export async function transitionJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  if (!isJourneyStage(body.toStage)) issues.push(fieldIssue("toStage", "invalid_request"));
  const note = noteOf(body, issues);
  throwIfIssues(issues);
  await rpcTransitionJourney(supabase, journeyId, expectedStage, body.toStage as JourneyStage, note);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/start-preparation { expectedStage, templateId } (BR-041).
export async function startJourneyPreparation(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  if (!isUuid(body.templateId)) issues.push(fieldIssue("templateId", "template_invalid"));
  throwIfIssues(issues);
  await rpcAssignJourneyTemplate(supabase, journeyId, expectedStage, body.templateId as string);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/hold { expectedStage, reason } (BR-029).
export async function placeJourneyOnHold(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  const reason = reasonOf(body, issues);
  throwIfIssues(issues);
  await rpcPlaceJourneyOnHold(supabase, journeyId, expectedStage, reason);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/resume { expectedStage } (BR-029).
export async function resumeJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  throwIfIssues(issues);
  await rpcResumeJourney(supabase, journeyId, expectedStage);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/cancel { expectedStage, reason, cancellationTaskBookingIds[] } (BR-030).
export async function cancelJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  const reason = reasonOf(body, issues);
  const rawIds = body.cancellationTaskBookingIds ?? [];
  const bookingIds = Array.isArray(rawIds) && rawIds.every(isUuid) ? [...new Set(rawIds as string[])] : null;
  if (!bookingIds) issues.push(fieldIssue("cancellationTaskBookingIds", "booking_invalid"));
  throwIfIssues(issues);
  await rpcCancelJourney(supabase, journeyId, expectedStage, reason, bookingIds as string[]);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/close { expectedStage } — "Mark as Completed" (FR-JW-11).
export async function closeJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedStage = expectedStageOf(body, issues);
  throwIfIssues(issues);
  await rpcCloseJourney(supabase, journeyId, expectedStage);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/reassign { expectedOwnerId (null when unowned), newOwnerId, note? } (BR-026).
export async function reassignJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const issues: JourneyFieldIssue[] = [];
  const expectedOwnerId = body.expectedOwnerId ?? null;
  if (expectedOwnerId !== null && !isUuid(expectedOwnerId)) issues.push(fieldIssue("expectedOwnerId", "invalid_request"));
  if (!isUuid(body.newOwnerId)) issues.push(fieldIssue("newOwnerId", "new_owner_invalid"));
  const note = noteOf(body, issues);
  throwIfIssues(issues);
  await rpcReassignJourney(supabase, journeyId, expectedOwnerId as string | null, body.newOwnerId as string, note);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// PATCH …/service-category { serviceCategory } (FR-JW-01 AC5, BR-043).
export async function setJourneyServiceCategory(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const code = typeof body.serviceCategory === "string" ? body.serviceCategory.trim() : "";
  if (code === "") throw journeyValidationError([fieldIssue("serviceCategory", "service_category_required")]);
  await rpcSetJourneyServiceCategory(supabase, journeyId, code);
  return loadJourneyDetail(supabase, actor, journeyId);
}

// The RPC error code the same request would produce, for the RLS contact
// path (which has no RPC): checked in the M11 guard order (G3 archived,
// G4 terminal, G6 legacy, then ownership).
function requireAction(detail: JourneyDetail, action: JourneyActionKind): void {
  if (detail.availableActions.actions[action].state !== "hidden") return;
  const { journey } = detail;
  const code: JourneyWorkspaceErrorCode =
    journey.archivedAt !== null
      ? "archived"
      : journey.stage === "journey_closed" || journey.outcome !== null
        ? "terminal"
        : journey.adoptionStatus === "legacy_pending"
          ? "legacy_pending"
          : "not_authorised";
  throw new JourneyWorkspaceError(code);
}

function contactSummary(contact: OperationalContact | OperationalContactInput) {
  return { type: contact.contactType, name: contact.name, organisation: contact.organisation };
}

// PATCH …/contact { contactType, name, organisation?, phone?, email? }
// (JW-15, BR-040). RLS update (workspace_can_edit_journey) then the audit
// entry. AC-5: History records type, name and organisation, and whether the
// phone or email changed — never their values.
export async function updateJourneyContact(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const validated = validateOperationalContactInput(body);
  if ("issues" in validated) throw journeyValidationError(validated.issues);
  const input = validated.value;

  const before = await loadJourneyDetail(supabase, actor, journeyId);
  requireAction(before, "edit_contact");
  if (!before.contact) {
    // No primary contact row and no INSERT policy: cannot be created here.
    throw new JourneyWorkspaceError("operation_failed");
  }

  const current = before.contact;
  const unchanged =
    current.contactType === input.contactType &&
    current.name === input.name &&
    current.organisation === input.organisation &&
    current.phone === input.phone &&
    current.email === input.email;
  if (unchanged) return before; // nothing to save, nothing to audit

  const updated = await updatePrimaryContact(supabase, journeyId, input, actor.id);
  if (!updated) {
    // RLS filtered the row: the Journey changed state since the pre-check.
    throw new JourneyWorkspaceError("stale");
  }

  await recordWorkspaceAuditEvent(supabase, {
    entityType: "journey",
    entityId: journeyId,
    eventType: "journey_contact_changed",
    actorId: actor.id,
    eventData: {
      source: "editor",
      before: contactSummary(before.contact),
      after: contactSummary(updated),
      phone_changed: before.contact.phone !== updated.phone,
      email_changed: before.contact.email !== updated.email,
    },
  });
  return loadJourneyDetail(supabase, actor, journeyId);
}

// POST …/adopt (BR-036, BR-040, BR-043; PO Decision 5). Administrator
// only (enforced by the RPC); the nights rule is checked here against the
// stored nights so the panel can show it beside the dates.
export async function adoptLegacyJourney(
  supabase: SupabaseClient,
  actor: JourneyWorkspaceActor,
  journeyId: string,
  body: Body,
): Promise<JourneyDetail> {
  requireJourneyId(journeyId);
  const journey = await fetchJourneyById(supabase, journeyId);
  if (!journey) throw new JourneyWorkspaceError("not_found");
  // EBC-R1.3-WS13-025 Gate 1: state refusals come before field checks, in
  // the M11 guard order (workspace_journey_lock_for_change: archived →
  // terminal → not_legacy → Administrator). Without this, a second
  // Administrator adopting a Journey that was adopted meanwhile was told
  // the dates did not match the (newly stored) nights instead of
  // "already adopted". The RPC remains the authority.
  if (journey.archivedAt !== null) throw new JourneyWorkspaceError("archived");
  if (isJourneyTerminal(journey)) throw new JourneyWorkspaceError("terminal");
  if (journey.adoptionStatus !== "legacy_pending") throw new JourneyWorkspaceError("not_legacy");
  if (actor.role !== "administrator") throw new JourneyWorkspaceError("not_authorised");

  const issues: JourneyFieldIssue[] = [];
  if (!isUuid(body.ownerId)) issues.push(fieldIssue("ownerId", "new_owner_invalid"));
  issues.push(
    ...validateAdoptionDates({
      confirmedStartDate: body.confirmedStartDate,
      confirmedEndDate: body.confirmedEndDate,
      storedNights: journey.nights,
    }),
  );
  const serviceCategory = typeof body.serviceCategory === "string" ? body.serviceCategory.trim() : "";
  if (serviceCategory === "") issues.push(fieldIssue("serviceCategory", "service_category_required"));
  if (!isUuid(body.readinessTemplateId)) issues.push(fieldIssue("readinessTemplateId", "template_invalid"));
  const rawContact = typeof body.contact === "object" && body.contact !== null ? (body.contact as Body) : {};
  const contact = validateOperationalContactInput(rawContact);
  if ("issues" in contact) issues.push(...contact.issues.map((issue) => ({ ...issue, field: `contact.${issue.field}` })));
  throwIfIssues(issues);

  await rpcAdoptLegacyJourney(supabase, journeyId, {
    ownerId: body.ownerId as string,
    confirmedStartDate: body.confirmedStartDate as string,
    confirmedEndDate: body.confirmedEndDate as string,
    serviceCategory,
    readinessTemplateId: body.readinessTemplateId as string,
    contact: (contact as { value: OperationalContactInput }).value,
  });
  return loadJourneyDetail(supabase, actor, journeyId);
}
