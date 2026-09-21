// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — domain types.
// Mirrors the schema created in Phase 2's migrations
// (supabase/migrations/20260921070*.sql); keep both in lockstep.

export type JourneyPlanningStage =
  | "lead_created"
  | "discovery"
  | "planning"
  | "proposal_shared"
  | "revision"
  | "decision"
  | "closed";

export type JourneyPlanningOutcome = "confirmed" | "lost" | "archived";

export type JourneyPlanningRecordKind = "individual" | "corporate";

// WS12-003 Section 5: seven-stage lifecycle, Allowed/Invalid Transitions.
// Enforced in application code (validateStageTransition, validation.ts),
// never at the database layer alone.
export const JOURNEY_PLANNING_ALLOWED_TRANSITIONS: Readonly<
  Record<JourneyPlanningStage, readonly JourneyPlanningStage[]>
> = {
  lead_created: ["discovery"],
  discovery: ["planning"],
  planning: ["proposal_shared"],
  proposal_shared: ["revision", "decision"],
  revision: ["proposal_shared"],
  decision: ["closed"],
  closed: [],
};

export interface JourneyPlanningRecord {
  id: string;
  recordKind: JourneyPlanningRecordKind;
  travellerId: string | null;
  corporateContactId: string | null;
  title: string;
  destinationRegion: string | null;
  stage: JourneyPlanningStage;
  outcome: JourneyPlanningOutcome | null;
  ownerId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewBootstrapTravellerInput {
  fullName: string;
  email?: string;
  phone?: string;
}

export interface NewBootstrapCorporateContactInput {
  companyName: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
}

// AD-WS12-001/AD-WS12-003 (Bootstrap Ownership Principle): since Traveller
// Hub (WS14) and a full corporate-contact picker do not exist yet, record
// creation accepts EITHER an existing bootstrap Traveller/Corporate
// Contact id, OR inline fields to create a minimal bootstrap row as part
// of the same request (JP-03 Create screen, WS12-004). Exactly one of the
// id/new pair for the chosen recordKind must be supplied — validated in
// validation.ts.
export interface CreateJourneyPlanningRecordInput {
  recordKind: JourneyPlanningRecordKind;
  travellerId?: string;
  newTraveller?: NewBootstrapTravellerInput;
  corporateContactId?: string;
  newCorporateContact?: NewBootstrapCorporateContactInput;
  title: string;
  destinationRegion?: string;
  createdByUserId: string;
}

export interface JourneyPlanningQueueFilters {
  stage?: JourneyPlanningStage;
  ownerId?: string | null;
  unassignedOnly?: boolean;
  searchText?: string;
}

// DEC-R1.3-014: the immutable itinerary snapshot shape owned by a Proposal
// Version. Field-level shape is an engineering implementation decision
// (see the Phase 2 proposals_and_versions migration's header comment and
// the WS12-007 Engineering Decision Log) — validated at this layer, not by
// a database schema constraint, so it can be extended without a migration.
export interface ItineraryDestinationSnapshot {
  name: string;
  nights: number;
  notes: string | null;
}

export interface ItineraryPriceEstimate {
  amount: number;
  currency: string;
}

export interface ItinerarySnapshot {
  destinations: ItineraryDestinationSnapshot[];
  startDate: string | null;
  endDate: string | null;
  travellerCount: number | null;
  priceEstimate: ItineraryPriceEstimate | null;
  inclusions: string[];
  notes: string | null;
}

export interface Proposal {
  id: string;
  journeyPlanningRecordId: string;
  currentVersionId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalVersion {
  id: string;
  proposalId: string;
  versionNumber: number;
  itinerarySnapshot: ItinerarySnapshot;
  summary: string | null;
  createdByUserId: string;
  createdAt: string;
}

export type PlanningActivityType = "discovery_note" | "internal_comment" | "vendor_contact_log";

export interface PlanningActivity {
  id: string;
  journeyPlanningRecordId: string;
  activityType: PlanningActivityType;
  content: string;
  authorUserId: string;
  createdAt: string;
}

export type VendorQuotationStatus = "requested" | "received" | "accepted" | "rejected";

export interface VendorQuotation {
  id: string;
  journeyPlanningRecordId: string;
  vendorId: string;
  quotationAmount: number | null;
  currency: string | null;
  notes: string | null;
  status: VendorQuotationStatus;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}
