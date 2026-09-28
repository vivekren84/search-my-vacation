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
