// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace read repository.
// Session-bound client; RLS gives every Workspace User read access
// (BR-035). Journeys are never written here directly: every Journey write
// is a SECURITY DEFINER RPC (AD-WS13-002) added in the phase that uses it.

import type { SupabaseClient } from "@supabase/supabase-js";

import { JourneyWorkspaceError, mapJourneyRpcError } from "./errors";
import type {
  AdoptLegacyJourneyInput,
  Journey,
  JourneyHistoryCursor,
  JourneyItinerary,
  JourneyLinkRef,
  JourneyOperationalSummaryRow,
  JourneyReferenceSummary,
  JourneyStage,
  OperationalContact,
  OperationalContactInput,
} from "./types";

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

// ---------------------------------------------------------------------
// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): Phase 1 reads and the
// M11 lifecycle RPC calls. Reads use the session-bound client (RLS: every
// Workspace User reads every Journey, BR-035). Journey writes go only
// through the M11 SECURITY DEFINER functions (AD-WS13-002); the Primary
// Operational Contact uses its RLS update policy, as AD-WS13-002 states.
// ---------------------------------------------------------------------

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export function mapSummaryRow(row: Record<string, unknown>): JourneyOperationalSummaryRow {
  return {
    journeyId: row.journey_id as string,
    journeyReference: row.journey_reference as string,
    ownerId: (row.owner_id as string | null) ?? null,
    stage: row.stage as JourneyStage,
    outcome: (row.outcome as JourneyOperationalSummaryRow["outcome"]) ?? null,
    onHold: Boolean(row.on_hold),
    archivedAt: (row.archived_at as string | null) ?? null,
    adoptionStatus: row.adoption_status as JourneyOperationalSummaryRow["adoptionStatus"],
    confirmedStartDate: (row.confirmed_start_date as string | null) ?? null,
    confirmedEndDate: (row.confirmed_end_date as string | null) ?? null,
    readinessTemplateId: (row.readiness_template_id as string | null) ?? null,
    isTerminal: Boolean(row.is_terminal),
    isActive: Boolean(row.is_active),
    daysToDeparture: row.days_to_departure === null || row.days_to_departure === undefined ? null : asNumber(row.days_to_departure),
    daysOnHold: row.days_on_hold === null || row.days_on_hold === undefined ? null : asNumber(row.days_on_hold),
    departingWithinWindow: Boolean(row.departing_within_window),
    bookingsActive: asNumber(row.bookings_active),
    bookingsBooked: asNumber(row.bookings_booked),
    bookingsPending: asNumber(row.bookings_pending),
    documentsOutstanding: asNumber(row.documents_outstanding),
    readinessMandatoryTotal: asNumber(row.readiness_mandatory_total),
    readinessMandatoryUnresolved: asNumber(row.readiness_mandatory_unresolved),
    readinessState: row.readiness_state as JourneyOperationalSummaryRow["readinessState"],
    archiveEligible: Boolean(row.archive_eligible),
    readinessOptionalOutstanding: asNumber(row.readiness_optional_outstanding),
    bookingsDraft: asNumber(row.bookings_draft),
    bookingsRequested: asNumber(row.bookings_requested),
    bookingsPendingInformation: asNumber(row.bookings_pending_information),
    bookingsConfirmed: asNumber(row.bookings_confirmed),
    bookingsCancelled: asNumber(row.bookings_cancelled),
    documentsReceived: asNumber(row.documents_received),
    documentsVerified: asNumber(row.documents_verified),
    documentsNotApplicable: asNumber(row.documents_not_applicable),
    serviceCategory: (row.service_category as string | null) ?? null,
    destinationRegion: (row.destination_region as string | null) ?? null,
    onHoldSince: (row.on_hold_since as string | null) ?? null,
  };
}

// ---- Bulk reads: row cap and URL length --------------------------------
// PostgREST returns at most `db-max-rows` rows per request (Supabase
// default 1000) and truncates silently, so list reads page through a stable
// order until a short page arrives. READ_PAGE_SIZE must not exceed the
// project's max-rows setting. Requests that carry an id list are split into
// chunks so the query string stays well under proxy URL limits.

export const READ_PAGE_SIZE = 1000;
export const IN_LIST_CHUNK = 100;

type Row = Record<string, unknown>;
type PageRequest = (from: number, to: number) => PromiseLike<{ data: unknown; error: unknown }>;

async function readAllPages(request: PageRequest, failureCode: string): Promise<Row[]> {
  const rows: Row[] = [];
  for (let from = 0; ; from += READ_PAGE_SIZE) {
    const { data, error } = await request(from, from + READ_PAGE_SIZE - 1);
    if (error) throw new JourneyWorkspaceRepositoryError(failureCode);
    const page = (Array.isArray(data) ? data : []) as Row[];
    rows.push(...page);
    if (page.length < READ_PAGE_SIZE) return rows;
  }
}

async function readByIdChunks(ids: string[], read: (chunk: string[]) => Promise<Row[]>): Promise<Row[]> {
  const unique = [...new Set(ids)];
  const chunks: string[][] = [];
  for (let index = 0; index < unique.length; index += IN_LIST_CHUNK) chunks.push(unique.slice(index, index + IN_LIST_CHUNK));
  return (await Promise.all(chunks.map(read))).flat();
}

// Active = not terminal and not archived (FR-JW-03 AC1); optionally one owner.
export async function fetchActiveJourneySummaries(
  supabase: SupabaseClient,
  options: { ownerId?: string | null } = {},
): Promise<JourneyOperationalSummaryRow[]> {
  const rows = await readAllPages((from, to) => {
    let query = supabase.from("workspace_journey_operational_summary").select("*").eq("is_active", true);
    if (options.ownerId) query = query.eq("owner_id", options.ownerId);
    return query.order("journey_id").range(from, to);
  }, "journey_summary_list_failed");
  return rows.map(mapSummaryRow);
}

export async function fetchJourneySummaryById(
  supabase: SupabaseClient,
  journeyId: string,
): Promise<JourneyOperationalSummaryRow | null> {
  const { data, error } = await supabase
    .from("workspace_journey_operational_summary")
    .select("*")
    .eq("journey_id", journeyId)
    .maybeSingle();
  if (error) throw new JourneyWorkspaceRepositoryError("journey_summary_fetch_failed");
  return data ? mapSummaryRow(data) : null;
}

export interface JourneyPartyRow {
  id: string;
  travellerId: string | null;
  corporateContactId: string | null;
  createdAt: string;
}

export async function fetchJourneyPartyRows(supabase: SupabaseClient, journeyIds: string[]): Promise<JourneyPartyRow[]> {
  const rows = await readByIdChunks(journeyIds, (chunk) =>
    readAllPages(
      (from, to) =>
        supabase.from("workspace_journeys").select("id, traveller_id, corporate_contact_id, created_at").in("id", chunk).order("id").range(from, to),
      "journey_party_fetch_failed",
    ),
  );
  return rows.map((row) => ({
    id: row.id as string,
    travellerId: (row.traveller_id as string | null) ?? null,
    corporateContactId: (row.corporate_contact_id as string | null) ?? null,
    createdAt: row.created_at as string,
  }));
}

export async function fetchTravellerNames(supabase: SupabaseClient, ids: string[]): Promise<Map<string, string>> {
  const rows = await readByIdChunks(ids, (chunk) =>
    readAllPages(
      (from, to) => supabase.from("workspace_travellers").select("id, full_name").in("id", chunk).order("id").range(from, to),
      "traveller_fetch_failed",
    ),
  );
  return new Map(rows.map((row) => [row.id as string, row.full_name as string]));
}

export async function fetchCorporateContacts(
  supabase: SupabaseClient,
  ids: string[],
): Promise<Map<string, { companyName: string; contactName: string }>> {
  const rows = await readByIdChunks(ids, (chunk) =>
    readAllPages(
      (from, to) =>
        supabase.from("workspace_corporate_contacts").select("id, company_name, contact_name").in("id", chunk).order("id").range(from, to),
      "corporate_contact_fetch_failed",
    ),
  );
  return new Map(
    rows.map((row) => [row.id as string, { companyName: row.company_name as string, contactName: row.contact_name as string }]),
  );
}

function mapContactRow(row: Row): OperationalContact {
  return {
    id: row.id as string,
    contactType: row.contact_type as OperationalContact["contactType"],
    name: row.name as string,
    organisation: (row.organisation as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    updatedAt: row.updated_at as string,
  };
}

const CONTACT_COLUMNS = "id, journey_id, contact_type, name, organisation, phone, email, updated_at";

export async function fetchPrimaryContacts(
  supabase: SupabaseClient,
  journeyIds: string[],
): Promise<Map<string, OperationalContact>> {
  const rows = await readByIdChunks(journeyIds, (chunk) =>
    readAllPages(
      (from, to) =>
        supabase
          .from("workspace_journey_operational_contacts")
          .select(CONTACT_COLUMNS)
          .eq("is_primary", true)
          .in("journey_id", chunk)
          .order("id")
          .range(from, to),
      "journey_contact_fetch_failed",
    ),
  );
  return new Map(rows.map((row) => [row.journey_id as string, mapContactRow(row)]));
}

// Latest audit event per Journey ("Last activity" sort, UX §20). Reads
// every audit row of the given Journeys (paged); measured in the
// Milestone A profile (EBC-R1.3-WS13-023 §8).
export async function fetchLastActivity(supabase: SupabaseClient, journeyIds: string[]): Promise<Map<string, string>> {
  const rows = await readByIdChunks(journeyIds, (chunk) =>
    readAllPages(
      (from, to) =>
        supabase
          .from("workspace_audit_log")
          .select("id, entity_id, created_at")
          .eq("entity_type", "journey")
          .in("entity_id", chunk)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to),
      "journey_activity_fetch_failed",
    ),
  );
  const latest = new Map<string, string>();
  for (const row of rows) {
    const id = row.entity_id as string;
    const at = row.created_at as string;
    const current = latest.get(id);
    if (current === undefined || at > current) latest.set(id, at);
  }
  return latest;
}

// PostgREST ilike pattern with LIKE wildcards in the user's text escaped.
function containsPattern(text: string): string {
  return `%${text.replace(/[\\%_]/g, (match) => `\\${match}`)}%`;
}

function idsOf(rows: Row[], column = "id"): string[] {
  return rows.map((row) => row[column] as string);
}

// FR-JW-29 search keys: Journey reference, destination, traveller name or
// mobile, Corporate Point of Contact (company or person), Primary
// Operational Contact. One query per key (no hand-built filter strings).
export async function searchJourneyIds(supabase: SupabaseClient, text: string): Promise<Set<string>> {
  const pattern = containsPattern(text);
  const code = "journey_search_failed";
  const ilikeIds = (table: string, column: string, select = "id") =>
    readAllPages((from, to) => supabase.from(table).select(select).ilike(column, pattern).order("id").range(from, to), code);
  const [byReference, byDestination, travellersByName, travellersByPhone, corpByCompany, corpByContact, contacts] = await Promise.all([
    ilikeIds("workspace_journeys", "journey_reference"),
    ilikeIds("workspace_journeys", "destination_region"),
    ilikeIds("workspace_travellers", "full_name"),
    ilikeIds("workspace_travellers", "phone"),
    ilikeIds("workspace_corporate_contacts", "company_name"),
    ilikeIds("workspace_corporate_contacts", "contact_name"),
    readAllPages(
      (from, to) =>
        supabase
          .from("workspace_journey_operational_contacts")
          .select("id, journey_id")
          .eq("is_primary", true)
          .ilike("name", pattern)
          .order("id")
          .range(from, to),
      code,
    ),
  ]);

  const ids = new Set<string>([...idsOf(byReference), ...idsOf(byDestination), ...idsOf(contacts, "journey_id")]);
  const journeysBy = (column: "traveller_id" | "corporate_contact_id", partyIds: string[]) =>
    readByIdChunks(partyIds, (chunk) =>
      readAllPages((from, to) => supabase.from("workspace_journeys").select("id").in(column, chunk).order("id").range(from, to), code),
    );
  const [byTraveller, byCorporate] = await Promise.all([
    journeysBy("traveller_id", [...idsOf(travellersByName), ...idsOf(travellersByPhone)]),
    journeysBy("corporate_contact_id", [...idsOf(corpByCompany), ...idsOf(corpByContact)]),
  ]);
  for (const id of [...idsOf(byTraveller), ...idsOf(byCorporate)]) ids.add(id);
  return ids;
}

export async function fetchPlanningRecordRef(
  supabase: SupabaseClient,
  recordId: string,
): Promise<{ id: string; title: string } | null> {
  const { data, error } = await supabase
    .from("workspace_journey_planning_records")
    .select("id, title")
    .eq("id", recordId)
    .maybeSingle();
  if (error) throw new JourneyWorkspaceRepositoryError("planning_record_fetch_failed");
  return data ? { id: data.id as string, title: data.title as string } : null;
}

export async function fetchReadinessTemplateRef(
  supabase: SupabaseClient,
  templateId: string,
): Promise<{ id: string; code: string; name: string } | null> {
  const { data, error } = await supabase
    .from("workspace_readiness_templates")
    .select("id, code, name")
    .eq("id", templateId)
    .maybeSingle();
  if (error) throw new JourneyWorkspaceRepositoryError("readiness_template_fetch_failed");
  return data ? { id: data.id as string, code: data.code as string, name: data.name as string } : null;
}

export async function fetchJourneyLinkRef(
  supabase: SupabaseClient,
  column: "id" | "supersedes_journey_id",
  value: string,
): Promise<JourneyLinkRef | null> {
  const { data, error } = await supabase
    .from("workspace_journeys")
    .select("id, journey_reference")
    .eq(column, value)
    .maybeSingle();
  if (error) throw new JourneyWorkspaceRepositoryError("journey_link_fetch_failed");
  return data ? { id: data.id as string, journeyReference: data.journey_reference as string } : null;
}

export const JOURNEY_HISTORY_PAGE_SIZE = 50;

// UX §21: newest first, pages of 50, "Load earlier events" via `before`.
// The cursor is (created_at, id), so entries sharing a timestamp are never
// skipped at a page boundary. Cursor values are validated by the service
// (ISO timestamp, UUID) before they reach this filter.
export async function fetchJourneyHistoryRows(
  supabase: SupabaseClient,
  journeyId: string,
  options: { before?: JourneyHistoryCursor | null; eventTypes?: string[] | null; limit?: number } = {},
): Promise<Array<{ id: string; eventType: string; actorId: string | null; eventData: Record<string, unknown>; createdAt: string }>> {
  let query = supabase
    .from("workspace_audit_log")
    .select("id, event_type, actor_id, event_data, created_at")
    .eq("entity_type", "journey")
    .eq("entity_id", journeyId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(options.limit ?? JOURNEY_HISTORY_PAGE_SIZE + 1);
  if (options.before) {
    const { createdAt, id } = options.before;
    query = query.or(`created_at.lt."${createdAt}",and(created_at.eq."${createdAt}",id.lt.${id})`);
  }
  if (options.eventTypes && options.eventTypes.length > 0) query = query.in("event_type", options.eventTypes);
  const { data, error } = await query;
  if (error) throw new JourneyWorkspaceRepositoryError("journey_history_fetch_failed");
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: row.id as string,
    eventType: row.event_type as string,
    actorId: (row.actor_id as string | null) ?? null,
    eventData: (row.event_data as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  }));
}

export async function fetchProposalVersion(supabase: SupabaseClient, versionId: string): Promise<JourneyItinerary | null> {
  const { data, error } = await supabase
    .from("workspace_proposal_versions")
    .select("id, version_number, itinerary_snapshot, created_at")
    .eq("id", versionId)
    .maybeSingle();
  if (error) throw new JourneyWorkspaceRepositoryError("proposal_version_fetch_failed");
  return data
    ? {
        proposalVersionId: data.id as string,
        versionNumber: data.version_number as number,
        snapshot: (data.itinerary_snapshot as Record<string, unknown>) ?? {},
        createdAt: data.created_at as string,
      }
    : null;
}

// JW-15 POC editor: RLS update (workspace_can_edit_journey: owner or
// Administrator, adopted, not terminal, not archived). Returns the
// updated row, or null when RLS filtered it out.
export async function updatePrimaryContact(
  supabase: SupabaseClient,
  journeyId: string,
  input: OperationalContactInput,
  actorId: string,
): Promise<OperationalContact | null> {
  const { data, error } = await supabase
    .from("workspace_journey_operational_contacts")
    .update({
      contact_type: input.contactType,
      name: input.name,
      organisation: input.organisation,
      phone: input.phone,
      email: input.email,
      updated_by: actorId,
    })
    .eq("journey_id", journeyId)
    .eq("is_primary", true)
    .select(CONTACT_COLUMNS);
  if (error) throw new JourneyWorkspaceRepositoryError("journey_contact_update_failed");
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  return rows.length > 0 ? mapContactRow(rows[0]) : null;
}

// ---- M11 lifecycle RPCs (supabase/migrations/20261004100000_…) -------

async function callJourneyRpc(supabase: SupabaseClient, fn: string, args: Record<string, unknown>): Promise<string> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new JourneyWorkspaceError(mapJourneyRpcError(error.message));
  if (typeof data !== "string") throw new JourneyWorkspaceError("operation_failed");
  return data;
}

export function rpcTransitionJourney(supabase: SupabaseClient, journeyId: string, expectedStage: string, toStage: string, note: string | null) {
  return callJourneyRpc(supabase, "workspace_journey_transition", {
    p_journey_id: journeyId, p_expected_stage: expectedStage, p_to_stage: toStage, p_note: note,
  });
}

export function rpcPlaceJourneyOnHold(supabase: SupabaseClient, journeyId: string, expectedStage: string, reason: string) {
  return callJourneyRpc(supabase, "workspace_journey_place_on_hold", {
    p_journey_id: journeyId, p_expected_stage: expectedStage, p_reason: reason,
  });
}

export function rpcResumeJourney(supabase: SupabaseClient, journeyId: string, expectedStage: string) {
  return callJourneyRpc(supabase, "workspace_journey_resume", { p_journey_id: journeyId, p_expected_stage: expectedStage });
}

export function rpcCancelJourney(supabase: SupabaseClient, journeyId: string, expectedStage: string, reason: string, bookingIds: string[]) {
  return callJourneyRpc(supabase, "workspace_journey_cancel", {
    p_journey_id: journeyId, p_expected_stage: expectedStage, p_reason: reason, p_cancellation_task_booking_ids: bookingIds,
  });
}

export function rpcCloseJourney(supabase: SupabaseClient, journeyId: string, expectedStage: string) {
  return callJourneyRpc(supabase, "workspace_journey_close", { p_journey_id: journeyId, p_expected_stage: expectedStage });
}

export function rpcReassignJourney(supabase: SupabaseClient, journeyId: string, expectedOwnerId: string | null, newOwnerId: string, note: string | null) {
  return callJourneyRpc(supabase, "workspace_journey_reassign", {
    p_journey_id: journeyId, p_expected_owner_id: expectedOwnerId, p_new_owner_id: newOwnerId, p_note: note,
  });
}

export function rpcAssignJourneyTemplate(supabase: SupabaseClient, journeyId: string, expectedStage: string, templateId: string) {
  return callJourneyRpc(supabase, "workspace_journey_assign_template", {
    p_journey_id: journeyId, p_expected_stage: expectedStage, p_template_id: templateId,
  });
}

export function rpcSetJourneyServiceCategory(supabase: SupabaseClient, journeyId: string, serviceCategory: string) {
  return callJourneyRpc(supabase, "workspace_journey_set_service_category", {
    p_journey_id: journeyId, p_service_category: serviceCategory,
  });
}

export function rpcAdoptLegacyJourney(supabase: SupabaseClient, journeyId: string, input: AdoptLegacyJourneyInput) {
  return callJourneyRpc(supabase, "workspace_journey_adopt_legacy", {
    p_journey_id: journeyId,
    p_owner_id: input.ownerId,
    p_confirmed_start_date: input.confirmedStartDate,
    p_confirmed_end_date: input.confirmedEndDate,
    p_service_category: input.serviceCategory,
    p_readiness_template_id: input.readinessTemplateId,
    p_contact_type: input.contact.contactType,
    p_contact_name: input.contact.name,
    p_contact_organisation: input.contact.organisation,
    p_contact_phone: input.contact.phone,
    p_contact_email: input.contact.email,
  });
}
