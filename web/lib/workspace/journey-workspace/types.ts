// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace domain types.
// Mirrors supabase/migrations/20260928100600_workspace_journeys_lifecycle_extension.sql,
// 20260928100700_workspace_journey_child_tables.sql and
// 20260928100800_workspace_journey_operational_summary_view.sql.
// Keep in lockstep with those CHECK constraints.
//
// Source of truth for behaviour: WS13-001 Revision 3 (§10 lifecycle, §11.1
// Vendor Booking lifecycle), AD-WS13-001/002/004.

export type JourneyStage =
  | "confirmed"
  | "in_preparation"
  | "ready_to_travel"
  | "travelling"
  | "travel_complete"
  | "post_travel"
  | "journey_closed";

export const JOURNEY_STAGES: readonly JourneyStage[] = [
  "confirmed",
  "in_preparation",
  "ready_to_travel",
  "travelling",
  "travel_complete",
  "post_travel",
  "journey_closed",
];

// Terminal outcomes other than the successful journey_closed stage.
export type JourneyOutcome = "cancelled" | "superseded";

export type JourneyAdoptionStatus = "adopted" | "legacy_pending";

export type VendorBookingStatus =
  | "draft"
  | "requested"
  | "pending_information"
  | "confirmed"
  | "booked"
  | "cancelled";

export type ReadinessState = "not_ready" | "at_risk" | "ready";

export type ReadinessCategory =
  | "booking_confirmations"
  | "documentation"
  | "traveller_readiness"
  | "supplier_readiness";

export type JourneyDocumentStatus = "outstanding" | "received" | "verified" | "not_applicable";

// WS13-001 §10.2 forward/backward stage transitions (On Hold, Cancelled and
// Superseded are handled separately: they are overlays/outcomes, not
// stages). The SQL twin is the Phase 1 transition RPC
// (workspace_journey_transition); keep both in lockstep.
export const JOURNEY_STAGE_TRANSITIONS: Readonly<Record<JourneyStage, readonly JourneyStage[]>> = {
  confirmed: ["in_preparation"],
  in_preparation: ["ready_to_travel"],
  ready_to_travel: ["travelling", "in_preparation"],
  travelling: ["travel_complete"],
  travel_complete: ["post_travel"],
  post_travel: ["journey_closed"],
  journey_closed: [],
};

// BR-029: On Hold is allowed only from these stages.
export const JOURNEY_HOLDABLE_STAGES: readonly JourneyStage[] = ["confirmed", "in_preparation", "ready_to_travel"];

// BR-030: Cancelled is allowed from Confirmed through Travelling (and from
// On Hold, whose stage is one of the holdable stages).
export const JOURNEY_CANCELLABLE_STAGES: readonly JourneyStage[] = [
  "confirmed",
  "in_preparation",
  "ready_to_travel",
  "travelling",
];

// WS13-001 §11.1 Vendor Booking lifecycle (D-07, BR-037). No "Amended"
// status; re-entry to Requested after a change. The SQL twin is the
// Phase 2 RPC workspace_journey_set_booking_status.
export const VENDOR_BOOKING_TRANSITIONS: Readonly<Record<VendorBookingStatus, readonly VendorBookingStatus[]>> = {
  draft: ["requested", "cancelled"],
  requested: ["pending_information", "confirmed", "cancelled"],
  pending_information: ["requested", "confirmed", "cancelled"],
  confirmed: ["booked", "requested", "cancelled"],
  booked: ["requested", "cancelled"],
  cancelled: [],
};

export interface Journey {
  id: string;
  journeyReference: string;
  journeyPlanningRecordId: string;
  travellerId: string | null;
  corporateContactId: string | null;
  ownerId: string | null;
  destinationRegion: string | null;
  serviceCategory: string | null;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
  adults: number | null;
  children: number | null;
  infants: number | null;
  nights: number | null;
  departureCity: string | null;
  acceptedProposalVersionId: string | null;
  stage: JourneyStage;
  stageChangedAt: string;
  outcome: JourneyOutcome | null;
  outcomeReason: string | null;
  onHold: boolean;
  onHoldReason: string | null;
  onHoldSince: string | null;
  closedAt: string | null;
  archivedAt: string | null;
  archivedBy: string | null;
  archiveReason: string | null;
  readinessTemplateId: string | null;
  supersedesJourneyId: string | null;
  adoptionStatus: JourneyAdoptionStatus;
  createdAt: string;
  updatedAt: string;
}

// One row of public.workspace_journey_operational_summary (AD-WS13-004).
export interface JourneyOperationalSummary {
  journeyId: string;
  journeyReference: string;
  ownerId: string | null;
  stage: JourneyStage;
  outcome: JourneyOutcome | null;
  onHold: boolean;
  archivedAt: string | null;
  adoptionStatus: JourneyAdoptionStatus;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
  readinessTemplateId: string | null;
  isTerminal: boolean;
  isActive: boolean;
  daysToDeparture: number | null;
  daysOnHold: number | null;
  departingWithinWindow: boolean;
  bookingsActive: number;
  bookingsBooked: number;
  bookingsPending: number;
  documentsOutstanding: number;
  readinessMandatoryTotal: number;
  readinessMandatoryUnresolved: number;
  readinessState: ReadinessState;
  archiveEligible: boolean;
}

// Minimal Journey facts Journey Planning needs (replacement banner,
// Decision dialog defaults, post-conversion reference). WS13-004A AC-01.
export interface JourneyReferenceSummary {
  id: string;
  journeyReference: string;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
  nights: number | null;
  onHold: boolean;
  outcome: JourneyOutcome | null;
  stage: JourneyStage;
}

// ---------------------------------------------------------------------
// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): service and API types.
// Engineering baseline: EBC-R1.3-WS13-020 Rev 2 §8; UX Rev 4a §7–§9, §13,
// §16, §20, §21 with EBC-R1.3-WS13-020B.
// ---------------------------------------------------------------------

// Error codes returned by the Journey Workspace API. Each M11 RPC raises
// `workspace_journey_<code>` (supabase/migrations/20261004100000_
// workspace_journey_lifecycle_rpcs.sql); errors.ts maps them. Keep this
// list in lockstep with the SQL and with errors.ts.
export type JourneyWorkspaceErrorCode =
  | "not_authorised"
  | "not_found"
  | "archived"
  | "terminal"
  | "legacy_pending"
  | "not_legacy"
  | "stale"
  | "on_hold"
  | "already_on_hold"
  | "not_on_hold"
  | "transition_not_allowed"
  | "hold_not_allowed"
  | "cancel_not_allowed"
  | "close_not_allowed"
  | "readiness_incomplete"
  | "start_date_not_reached"
  | "end_date_not_reached"
  | "template_invalid"
  | "template_already_assigned"
  | "owner_unchanged"
  | "new_owner_invalid"
  | "service_category_invalid"
  | "service_category_required"
  | "service_category_unchanged"
  | "reason_required"
  | "reason_too_long"
  | "note_too_long"
  | "booking_invalid"
  | "replacement_open"
  | "dates_required"
  | "dates_invalid"
  | "dates_nights_mismatch"
  | "contact_invalid"
  // Application-level codes (not raised by SQL).
  | "invalid_request"
  | "operation_failed";

export interface JourneyFieldIssue {
  field: string;
  code: JourneyWorkspaceErrorCode;
  message: string;
}

// WS13-001 §11 BR-040 contact types.
export type OperationalContactType =
  | "individual_traveller"
  | "corporate_organisation"
  | "b2b_travel_partner"
  | "other_authorised_entity";

export const OPERATIONAL_CONTACT_TYPES: readonly OperationalContactType[] = [
  "individual_traveller",
  "corporate_organisation",
  "b2b_travel_partner",
  "other_authorised_entity",
];

export interface OperationalContact {
  id: string;
  contactType: OperationalContactType;
  name: string;
  organisation: string | null;
  phone: string | null;
  email: string | null;
  updatedAt: string;
}

export interface OperationalContactInput {
  contactType: OperationalContactType;
  name: string;
  organisation: string | null;
  phone: string | null;
  email: string | null;
}

// ---- Actions (UX Rev 4a §9.3; getAvailableJourneyActions in derivations.ts)

export type JourneyActionKind =
  | "start_preparation"
  | "mark_ready_to_travel"
  | "mark_travelling"
  | "mark_travel_complete"
  | "begin_post_travel"
  | "mark_completed"
  | "step_back"
  | "place_on_hold"
  | "resume"
  | "cancel"
  | "reassign"
  | "edit_service_category"
  | "edit_contact"
  | "adopt";

export const JOURNEY_ACTION_KINDS: readonly JourneyActionKind[] = [
  "start_preparation",
  "mark_ready_to_travel",
  "mark_travelling",
  "mark_travel_complete",
  "begin_post_travel",
  "mark_completed",
  "step_back",
  "place_on_hold",
  "resume",
  "cancel",
  "reassign",
  "edit_service_category",
  "edit_contact",
  "adopt",
];

export type JourneyActionDisabledReason =
  | "readiness_outstanding" // n readiness items outstanding (BR-028)
  | "template_required" // In Preparation without a template (defensive)
  | "before_start_date" // Mark travelling before the departure date
  | "before_end_date"; // Mark travel complete before the return date

export type JourneyActionAvailability =
  | { state: "available" }
  | { state: "disabled"; reason: JourneyActionDisabledReason; availableFrom?: string; outstandingCount?: number }
  | { state: "hidden" };

// Why a viewer cannot change the Journey at all (drives the single
// read-only line under the stepper, UX §9.3).
export type JourneyReadOnlyReason = "not_owner" | "archived" | "terminal" | "legacy_awaiting_adoption";

export interface AvailableJourneyActions {
  primary: JourneyActionKind | null;
  actions: Record<JourneyActionKind, JourneyActionAvailability>;
  readOnlyReason: JourneyReadOnlyReason | null;
}

// ---- List (JW-01; UX §7, §20; FR-JW-03, FR-JW-29, FR-JW-34)

export type JourneyScope = "mine" | "team";
export type JourneyListSort = "departure" | "last_activity" | "created";
export type JourneyDeparturePreset = "this_week" | "next_14_days" | "this_month" | "custom";
export type JourneySummaryChip =
  | JourneyStage
  | "at_risk"
  | "departing"
  | "on_hold";

export interface JourneyListQuery {
  scope: JourneyScope;
  ownerId: string | null; // named owner (Team scope)
  stages: JourneyStage[];
  onHold: boolean | null;
  readiness: ReadinessState | null;
  departing: boolean; // summary-strip chip: departing within the configured window
  departure: JourneyDeparturePreset | null;
  departureFrom: string | null; // custom range, YYYY-MM-DD
  departureTo: string | null;
  q: string | null;
  sort: JourneyListSort;
  groupByStage: boolean;
}

export interface JourneyListItem {
  id: string;
  journeyReference: string;
  partyKind: "traveller" | "corporate";
  partyName: string | null;
  destinationRegion: string | null;
  serviceCategory: string | null;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
  daysToDeparture: number | null;
  departingWithinWindow: boolean;
  stage: JourneyStage;
  onHold: boolean;
  adoptionStatus: JourneyAdoptionStatus;
  readinessState: ReadinessState;
  readinessMandatoryTotal: number;
  primaryContactName: string | null;
  ownerId: string | null;
  ownerName: string | null;
  ownerActive: boolean;
  nextAction: JourneyNextActionKindName;
  createdAt: string;
  lastActivityAt: string | null;
}

// Duplicated name of derivations.ts JourneyNextActionKind to keep types.ts
// free of imports from derivations.ts (derivations.ts imports types.ts).
export type JourneyNextActionKindName =
  | "start_preparation"
  | "resolve_readiness"
  | "mark_ready_to_travel"
  | "await_departure"
  | "mark_travelling"
  | "log_activity"
  | "mark_travel_complete"
  | "begin_post_travel"
  | "mark_completed"
  | "resume"
  | "complete_adoption"
  | "none";

export type JourneySummaryCounts = Record<JourneySummaryChip, number>;

export interface JourneyListResult {
  items: JourneyListItem[];
  counts: JourneySummaryCounts;
  query: JourneyListQuery;
  today: string;
}

// ---- Detail (JW-02)

export interface JourneyPersonRef {
  id: string;
  name: string;
  active: boolean;
}

export interface JourneyParty {
  kind: "traveller" | "corporate";
  travellerId: string | null;
  corporateContactId: string | null;
  name: string | null;
  companyName: string | null;
}

export interface JourneyLinkRef {
  id: string;
  journeyReference: string;
}

export interface JourneyDetail {
  journey: Journey;
  summary: JourneyOperationalSummaryRow;
  party: JourneyParty;
  contact: OperationalContact | null;
  owner: JourneyPersonRef | null;
  planningRecord: { id: string; title: string } | null;
  readinessTemplate: { id: string; code: string; name: string } | null;
  supersedes: JourneyLinkRef | null;
  supersededBy: JourneyLinkRef | null;
  availableActions: AvailableJourneyActions;
  today: string;
}

// Full summary-view row used by the detail read model (JourneyOperational-
// Summary above is the subset the list needs).
export interface JourneyOperationalSummaryRow extends JourneyOperationalSummary {
  readinessOptionalOutstanding: number;
  bookingsDraft: number;
  bookingsRequested: number;
  bookingsPendingInformation: number;
  bookingsConfirmed: number;
  bookingsCancelled: number;
  documentsReceived: number;
  documentsVerified: number;
  documentsNotApplicable: number;
  // Journey columns the view also exposes (list rows need no second query).
  serviceCategory: string | null;
  destinationRegion: string | null;
  onHoldSince: string | null;
}

// ---- History (JW-08; UX §21; EBC-R1.3-WS13-020B History labels)

export type JourneyHistoryCategory = "stage_status" | "ownership" | "contact_category" | "other";
export type JourneyHistoryFilter = "all" | Exclude<JourneyHistoryCategory, "other">;

export interface JourneyHistoryEntry {
  id: string;
  eventType: string;
  category: JourneyHistoryCategory;
  actorId: string | null;
  actorName: string | null; // null for system events ("Workspace (automatic)")
  eventData: Record<string, unknown>;
  createdAt: string;
}

// Keyset cursor for History paging: the last entry's (created_at, id).
// Sent to clients as the opaque token "<created_at>|<id>" (nextBefore).
export interface JourneyHistoryCursor {
  createdAt: string;
  id: string;
}

export interface JourneyHistoryPage {
  entries: JourneyHistoryEntry[];
  hasMore: boolean;
  nextBefore: string | null;
}

// ---- Itinerary (JW-03)

export interface JourneyItinerary {
  proposalVersionId: string;
  versionNumber: number;
  snapshot: Record<string, unknown>;
  createdAt: string;
}

// ---- Mutation inputs

export interface AdoptLegacyJourneyInput {
  ownerId: string;
  confirmedStartDate: string;
  confirmedEndDate: string;
  serviceCategory: string;
  readinessTemplateId: string;
  contact: OperationalContactInput;
}
