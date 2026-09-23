// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — domain types.
// Mirrors the schema created in Phase 2's migrations
// (supabase/migrations/20260921070*.sql); keep both in lockstep.
//
// EBC-R1.3-WS12-013: adds the six ratified Planning Parameters ("Trip
// Basics") fields (FR-JP-31–34/36, BR-020/021/023/024), mirroring
// supabase/migrations/20260922090000_workspace_journey_planning_trip_basics.sql.

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

// FR-JP-06 (WS12-003): the eight ratified origin channels. Kept in
// lockstep with the CHECK constraint in
// supabase/migrations/20260922080000_workspace_journey_planning_origin_channel.sql.
export type JourneyPlanningOriginChannel =
  | "website_enquiry"
  | "whatsapp"
  | "phone"
  | "walk_in"
  | "referral"
  | "existing_traveller"
  | "corporate_enquiry"
  | "manual_workspace_initiation";

export const JOURNEY_PLANNING_ORIGIN_CHANNELS: readonly JourneyPlanningOriginChannel[] = [
  "website_enquiry",
  "whatsapp",
  "phone",
  "walk_in",
  "referral",
  "existing_traveller",
  "corporate_enquiry",
  "manual_workspace_initiation",
];

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

// EBC-R1.3-WS12-013 / FR-JP-34 / BR-021: the five Planning Parameters
// gated at the Discovery→Planning transition (Adults is excluded — it is
// mandatory at creation instead, per FR-JP-31, and carries no gate of its
// own). Named here, once, so validation.ts's gate check and the UI's
// completion indicator share a single source of truth for "which five
// fields count."
export type JourneyPlanningGatedParameterField =
  | "children"
  | "infants"
  | "intendedTravelMonth"
  | "nights"
  | "preferredDepartureCity";

export const JOURNEY_PLANNING_GATED_PARAMETER_FIELDS: readonly JourneyPlanningGatedParameterField[] = [
  "children",
  "infants",
  "intendedTravelMonth",
  "nights",
  "preferredDepartureCity",
];

export interface JourneyPlanningRecord {
  id: string;
  recordKind: JourneyPlanningRecordKind;
  travellerId: string | null;
  corporateContactId: string | null;
  title: string;
  destinationRegion: string | null;
  originChannel: JourneyPlanningOriginChannel;
  stage: JourneyPlanningStage;
  outcome: JourneyPlanningOutcome | null;
  ownerId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  // EBC-R1.3-WS12-013 Planning Parameters ("Trip Basics", FR-JP-31–34/36,
  // BR-020/021/023/024). All six are nullable at the database layer (see
  // the migration's own comment for why Adults is nullable too, despite
  // being creation-mandatory going forward). NULL means "not yet
  // answered"; for children/infants/nights, 0 is a distinct, valid,
  // explicit answer (BR-023).
  adults: number | null;
  children: number | null;
  infants: number | null;
  intendedTravelMonth: string | null;
  nights: number | null;
  preferredDepartureCity: string | null;
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
  originChannel: JourneyPlanningOriginChannel;
  createdByUserId: string;
  // EBC-R1.3-WS12-013 / FR-JP-31: Adults is mandatory at creation (the
  // type marks it optional only because validation.ts, not the type
  // system, is this module's established place for enforcing that —
  // matching how `title`/`originChannel` are handled just above). The
  // other five are optional at creation (FR-JP-33/34, Progressive
  // Enrichment/BR-020) and become required only at the Discovery→Planning
  // gate.
  adults?: number;
  children?: number;
  infants?: number;
  intendedTravelMonth?: string;
  nights?: number;
  preferredDepartureCity?: string;
}

// EBC-R1.3-WS12-013: partial update of Trip Basics on an existing record
// during Discovery (Progressive Enrichment, BR-020). Every field is
// optional — only the fields the Owner actually changed are sent; omitted
// fields are left untouched (not cleared to NULL). Setting a field to an
// explicit zero is expressed by sending `0`, distinct from omitting it.
export interface UpdateJourneyPlanningTripBasicsInput {
  adults?: number;
  children?: number;
  infants?: number;
  intendedTravelMonth?: string;
  nights?: number;
  preferredDepartureCity?: string;
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
