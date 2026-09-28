// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — validation.
// Business-rule validation lives here, not in repository.ts (data access)
// or in API route handlers, per this module's five-file convention.
//
// EBC-R1.3-WS12-013: adds Planning Parameters ("Trip Basics") validation —
// Adults required at creation (FR-JP-31), field-level range/format checks
// for all six fields, and the Discovery→Planning gate (FR-JP-34/BR-021),
// including its BR-023 explicit-zero-vs-unanswered semantics.
//
// EBC-R1.3-WS12-016 / PRA-01 / PRA-02: adds JourneyPlanningFieldIssue and
// extends JourneyPlanningValidationError to optionally carry a list of
// per-field issues, so callers that fail multiple checks at once (Create
// Record; the Discovery→Planning gate) can report every failing field in
// one response instead of stopping at the first (PRA-01: "Do not stop
// after the first validation failure"). Every PRE-EXISTING throw site that
// does not supply an explicit issues list keeps its prior single-`code`
// behaviour unchanged (issues defaults to an empty array) — this is
// additive, not a rewrite of this file's validation rules. Also adds the
// Lead Created→Discovery Ownership Gate (PRA-02), following "the same
// philosophy adopted for the Discovery→Planning Trip Basics gate."
//
// Field labels used in structured issue messages are authored here as
// plain strings, not imported from
// components/workspace/journey-planning/journeyPlanningLabels.ts's
// PLANNING_PARAMETER_LABELS — this module (lib/) must not import from
// components/ (client UI), matching this codebase's existing, strict
// components→lib dependency direction. The two label sets are
// intentionally kept in sync by hand (five short strings); recorded as a
// disclosed, minimal duplication in the WS12-016 engineering report.

import {
  JOURNEY_PLANNING_ALLOWED_TRANSITIONS,
  JOURNEY_PLANNING_GATED_PARAMETER_FIELDS,
  JOURNEY_PLANNING_ORIGIN_CHANNELS,
  type CreateJourneyPlanningRecordInput,
  type ItinerarySnapshot,
  type JourneyPlanningGatedParameterField,
  type JourneyPlanningStage,
  type NewBootstrapCorporateContactInput,
  type NewBootstrapTravellerInput,
  type UpdateJourneyPlanningTripBasicsInput,
} from "./types";
import { checkConversionDates } from "../journey-workspace/validation";
import { nightsBetween } from "../shared/time/businessDate";

// EBC-R1.3-WS12-016 / PRA-01: a single field-specific validation issue.
// `field` matches the request-body / form-field key (e.g. "adults",
// "preferredDepartureCity"), not a database column name, since the UI is
// this type's only structured consumer.
export interface JourneyPlanningFieldIssue {
  field: string;
  code: string;
  message: string;
}

export class JourneyPlanningValidationError extends Error {
  readonly issues: JourneyPlanningFieldIssue[];

  constructor(readonly code: string, issues: JourneyPlanningFieldIssue[] = []) {
    super("Journey Planning validation failed");
    this.name = "JourneyPlanningValidationError";
    this.issues = issues;
  }
}

const INTENDED_TRAVEL_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

// EBC-R1.3-WS12-016 / PRA-01: field labels for the five Discovery→Planning
// gated Planning Parameters, used only to compose structured validation
// messages here — see this file's header comment for why this is a
// deliberate, small duplication of
// journeyPlanningLabels.ts's PLANNING_PARAMETER_LABELS rather than a
// shared import.
const GATED_FIELD_LABELS: Record<JourneyPlanningGatedParameterField, string> = {
  children: "Number of Children",
  infants: "Number of Infants",
  intendedTravelMonth: "Intended Travel Month",
  nights: "Number of Nights",
  preferredDepartureCity: "Preferred Departure City",
};

// Stable per-field codes for the Discovery→Planning gate's structured
// issues. The gate's own top-level error `code` remains the unchanged,
// pre-existing "discovery_to_planning_requires_trip_basics" (Keerthi's
// WS12-014 regression script asserts this exact code) — these per-field
// codes only appear inside `issues`, which is new.
const GATED_FIELD_CODES: Record<JourneyPlanningGatedParameterField, string> = {
  children: "children_required_before_planning",
  infants: "infants_required_before_planning",
  intendedTravelMonth: "intended_travel_month_required_before_planning",
  nights: "nights_required_before_planning",
  preferredDepartureCity: "preferred_departure_city_required_before_planning",
};

// FR-JP-06/FR-JP-07 (WS12-003): every record must record one of the eight
// ratified origin channels at creation. FR-JP-11: a "Corporate enquiry"
// origin implies a Corporate Point of Contact must be identified before
// leaving Lead Created — since this module requires the Corporate Point of
// Contact at creation time already (FR-JP-09/FR-JP-10), that requirement
// is enforced here by simply tying the "corporate_enquiry" channel to the
// "corporate" record kind, rather than allowing an inconsistent
// individual-record-with-corporate-origin combination. Recorded as an
// engineering-authority interpretation in the WS12-010 Engineering
// Decision Log, not a new business rule.
//
// EBC-R1.3-WS12-016 / PRA-01: every check below now appends to a shared
// `issues` list instead of throwing on the first failure, so a Create
// Record submission that fails several checks at once reports all of them
// together, per PRA-01's explicit instruction.
export function validateCreateJourneyPlanningRecordInput(
  input: CreateJourneyPlanningRecordInput,
): void {
  const issues: JourneyPlanningFieldIssue[] = [];

  if (!input.title || input.title.trim().length === 0) {
    issues.push({ field: "title", code: "title_required", message: "Title is required." });
  }

  if (!input.originChannel || !JOURNEY_PLANNING_ORIGIN_CHANNELS.includes(input.originChannel)) {
    issues.push({
      field: "originChannel",
      code: "origin_channel_required",
      message: "Origin channel is required.",
    });
  } else if (input.originChannel === "corporate_enquiry" && input.recordKind !== "corporate") {
    issues.push({
      field: "originChannel",
      code: "corporate_enquiry_origin_requires_corporate_record",
      message: "The \"Corporate enquiry\" origin channel can only be used for Corporate records.",
    });
  }

  if (input.recordKind === "individual") {
    if (!input.travellerId && !input.newTraveller) {
      issues.push({
        field: "traveller",
        code: "traveller_required_for_individual_record",
        message: "A traveller is required for an individual record.",
      });
    } else if (input.newTraveller) {
      issues.push(...validateNewBootstrapTraveller(input.newTraveller));
    }
  }

  if (input.recordKind === "corporate") {
    if (!input.corporateContactId && !input.newCorporateContact) {
      issues.push({
        field: "corporateContact",
        code: "corporate_contact_required_for_corporate_record",
        message: "A corporate contact is required for a corporate record.",
      });
    } else if (input.newCorporateContact) {
      issues.push(...validateNewBootstrapCorporateContact(input.newCorporateContact));
    }
  }

  // EBC-R1.3-WS12-013 / FR-JP-31 / BR-020: Number of Adults is mandatory
  // from record creation — the only Planning Parameter that is. Enforced
  // here (application layer), not by a database NOT NULL — see the
  // migration's own comment for why.
  //
  // EBC-R1.3-WS12-016 / PRA-01: split into two distinct, field-specific
  // messages — "Number of Adults is required." (missing/non-numeric) vs.
  // "Number of Adults must be greater than zero." (present but zero or
  // negative) — per PRA-01's own verbatim examples. Previously both cases
  // shared one generic `adults_required` code; a present-but-invalid value
  // now reports as `adults_must_be_positive` instead. This is a deliberate,
  // disclosed behaviour change driven directly by PRA-01's examples, not
  // an incidental one.
  if (input.adults === undefined || input.adults === null || !Number.isInteger(input.adults)) {
    issues.push({ field: "adults", code: "adults_required", message: "Number of Adults is required." });
  } else if (input.adults < 1) {
    issues.push({
      field: "adults",
      code: "adults_must_be_positive",
      message: "Number of Adults must be greater than zero.",
    });
  }

  // The remaining five Planning Parameters are optional at creation
  // (FR-JP-33/34, Progressive Enrichment/BR-020) but, if supplied, must
  // still be well-formed — this is a data-quality check, not the
  // Discovery→Planning gate itself (validateDiscoveryToPlanningGate,
  // below).
  issues.push(
    ...validateTripBasicsFieldValues({
      children: input.children,
      infants: input.infants,
      intendedTravelMonth: input.intendedTravelMonth,
      nights: input.nights,
      preferredDepartureCity: input.preferredDepartureCity,
    }),
  );

  // EBC-R1.3-WS13-005 Phase 0 (CM-07): optional; format only here. Whether
  // the code is an active configured Service Category is checked by the
  // service against configuration (it needs a database read).
  if (input.serviceCategory !== undefined && !isServiceCategoryCodeFormat(input.serviceCategory)) {
    issues.push(SERVICE_CATEGORY_INVALID_ISSUE);
  }

  if (issues.length > 0) {
    throw new JourneyPlanningValidationError(issues[0].code, issues);
  }
}

// EBC-R1.3-WS13-005 Phase 0 (CM-07, POD-07): Service Category code format,
// mirroring the M10 CHECK (workspace_journey_planning_records_service_category_format_check).
const SERVICE_CATEGORY_CODE_PATTERN = /^[a-z][a-z0-9_]*$/;

export function isServiceCategoryCodeFormat(value: unknown): value is string {
  return typeof value === "string" && SERVICE_CATEGORY_CODE_PATTERN.test(value);
}

export const SERVICE_CATEGORY_INVALID_ISSUE: JourneyPlanningFieldIssue = {
  field: "serviceCategory",
  code: "service_category_invalid",
  message: "Choose a Service Category from the list.",
};

function validateNewBootstrapTraveller(input: NewBootstrapTravellerInput): JourneyPlanningFieldIssue[] {
  if (!input.fullName || input.fullName.trim().length === 0) {
    return [
      { field: "travellerFullName", code: "traveller_full_name_required", message: "Traveller full name is required." },
    ];
  }
  return [];
}

function validateNewBootstrapCorporateContact(
  input: NewBootstrapCorporateContactInput,
): JourneyPlanningFieldIssue[] {
  const issues: JourneyPlanningFieldIssue[] = [];
  if (!input.companyName || input.companyName.trim().length === 0) {
    issues.push({ field: "companyName", code: "corporate_contact_company_name_required", message: "Company name is required." });
  }
  if (!input.contactName || input.contactName.trim().length === 0) {
    issues.push({ field: "contactName", code: "corporate_contact_name_required", message: "Corporate contact name is required." });
  }
  return issues;
}

// EBC-R1.3-WS12-013: shared field-level checks for the five gated
// Planning Parameters, used both at creation (values supplied are
// optional but must be well-formed if present) and by
// updateJourneyPlanningTripBasics (Discovery in-place editing). Every
// field here is `undefined`-tolerant — callers only pass the fields they
// are actually setting.
//
// EBC-R1.3-WS12-016 / PRA-01: returns the list of issues found (possibly
// empty) instead of throwing on the first one, so both callers below can
// collect every failing field rather than stopping at the first.
function validateTripBasicsFieldValues(input: {
  children?: number;
  infants?: number;
  intendedTravelMonth?: string;
  nights?: number;
  preferredDepartureCity?: string;
}): JourneyPlanningFieldIssue[] {
  const issues: JourneyPlanningFieldIssue[] = [];
  if (input.children !== undefined) {
    if (!Number.isInteger(input.children) || input.children < 0) {
      issues.push({
        field: "children",
        code: "children_invalid",
        message: "Number of Children must be zero or a positive whole number.",
      });
    }
  }
  if (input.infants !== undefined) {
    if (!Number.isInteger(input.infants) || input.infants < 0) {
      issues.push({
        field: "infants",
        code: "infants_invalid",
        message: "Number of Infants must be zero or a positive whole number.",
      });
    }
  }
  if (input.nights !== undefined) {
    if (!Number.isInteger(input.nights) || input.nights < 0) {
      issues.push({
        field: "nights",
        code: "nights_invalid",
        message: "Number of Nights must be zero or a positive whole number.",
      });
    }
  }
  if (input.intendedTravelMonth !== undefined) {
    if (!INTENDED_TRAVEL_MONTH_PATTERN.test(input.intendedTravelMonth)) {
      issues.push({
        field: "intendedTravelMonth",
        code: "intended_travel_month_invalid",
        message: "Intended Travel Month must be a valid month (YYYY-MM).",
      });
    }
  }
  if (input.preferredDepartureCity !== undefined) {
    if (input.preferredDepartureCity.trim().length === 0) {
      issues.push({
        field: "preferredDepartureCity",
        code: "preferred_departure_city_invalid",
        message: "Preferred Departure City cannot be blank.",
      });
    }
  }
  return issues;
}

// EBC-R1.3-WS12-013: validates a partial Trip Basics update (Discovery
// in-place editing). Adults may also be edited here (e.g. corrected after
// creation) — it is not creation-only, only creation-*mandatory*; when
// supplied it must still satisfy the same >= 1 rule as at creation.
//
// EBC-R1.3-WS12-016 / PRA-01: also collects every failing field via the
// same shared `issues` pattern as Create Record, as a direct consequence
// of validateTripBasicsFieldValues's own signature change above — not a
// separately-scoped enhancement.
export function validateUpdateJourneyPlanningTripBasicsInput(
  input: UpdateJourneyPlanningTripBasicsInput,
): void {
  if (
    input.adults === undefined &&
    input.children === undefined &&
    input.infants === undefined &&
    input.intendedTravelMonth === undefined &&
    input.nights === undefined &&
    input.preferredDepartureCity === undefined &&
    input.serviceCategory === undefined
  ) {
    throw new JourneyPlanningValidationError("trip_basics_update_requires_at_least_one_field", [
      {
        field: "tripBasics",
        code: "trip_basics_update_requires_at_least_one_field",
        message: "At least one Trip Basics field must be provided.",
      },
    ]);
  }

  const issues: JourneyPlanningFieldIssue[] = [];

  if (input.adults !== undefined) {
    if (!Number.isInteger(input.adults) || input.adults < 1) {
      issues.push({
        field: "adults",
        code: "adults_invalid",
        message: "Number of Adults must be greater than zero.",
      });
    }
  }

  issues.push(...validateTripBasicsFieldValues(input));

  // EBC-R1.3-WS13-005 Phase 0 (CM-07): null clears the optional value.
  if (
    input.serviceCategory !== undefined &&
    input.serviceCategory !== null &&
    !isServiceCategoryCodeFormat(input.serviceCategory)
  ) {
    issues.push(SERVICE_CATEGORY_INVALID_ISSUE);
  }

  if (issues.length > 0) {
    throw new JourneyPlanningValidationError(issues[0].code, issues);
  }
}

// EBC-R1.3-WS13-005 Phase 0: Journey conversion prerequisites (CM-01,
// CM-05, CM-07, PD-A; BR-026, BR-027, BR-043; I-05), checked BEFORE the
// conversion RPC so the user sees every unmet prerequisite at once
// (PRA-01 precedent). The RPC re-checks each one and stays the authority.
// Codes and messages follow UX Rev 4a §36.3 exactly.
export const CONVERSION_ISSUE_MESSAGES = {
  owner_required: "Assign an owner before confirming. A Journey always has an owner.",
  dates_required: "Add the confirmed start and end dates.",
  dates_invalid: "The end date can't be before the start date.",
  nights_required: "Add the number of nights in Trip Basics before confirming.",
  service_category_required: "Choose a Service Category before confirming.",
  service_category_invalid: "Choose a Service Category before confirming.",
  original_not_on_hold:
    "The original Journey is no longer on hold, so this replacement can't be confirmed. Open the original Journey to check its status.",
} as const;

export function datesNightsMismatchMessage(dateNights: number, recordNights: number): string {
  return `These dates cover ${dateNights} nights, but Trip Basics says ${recordNights}. Change the dates or the nights so they match.`;
}

export function getConversionPrerequisiteIssues(input: {
  ownerId: string | null;
  nights: number | null;
  serviceCategory: string | null;
  confirmedStartDate?: string;
  confirmedEndDate?: string;
}): JourneyPlanningFieldIssue[] {
  const issues: JourneyPlanningFieldIssue[] = [];
  if (input.ownerId === null) {
    issues.push({ field: "ownerId", code: "owner_required", message: CONVERSION_ISSUE_MESSAGES.owner_required });
  }
  for (const code of checkConversionDates({
    confirmedStartDate: input.confirmedStartDate,
    confirmedEndDate: input.confirmedEndDate,
    nights: input.nights,
  })) {
    if (code === "dates_required") {
      issues.push({ field: "confirmedDates", code, message: CONVERSION_ISSUE_MESSAGES.dates_required });
    } else if (code === "dates_invalid") {
      issues.push({ field: "confirmedDates", code, message: CONVERSION_ISSUE_MESSAGES.dates_invalid });
    } else if (code === "nights_required") {
      issues.push({ field: "nights", code, message: CONVERSION_ISSUE_MESSAGES.nights_required });
    } else {
      issues.push({
        field: "confirmedDates",
        code,
        message: datesNightsMismatchMessage(
          nightsBetween(input.confirmedStartDate as string, input.confirmedEndDate as string),
          input.nights as number,
        ),
      });
    }
  }
  if (input.serviceCategory === null) {
    issues.push({
      field: "serviceCategory",
      code: "service_category_required",
      message: CONVERSION_ISSUE_MESSAGES.service_category_required,
    });
  }
  return issues;
}

// EBC-R1.3-WS12-013 / FR-JP-34 / BR-021 / BR-023: the Discovery→Planning
// gate. Returns the list of still-missing gated fields (empty = gate
// satisfied) rather than only a boolean, so this one function can serve
// both validateStageTransition's enforcement below AND the Detail
// screen's completion indicator ("Trip Basics — X of 5 needed before
// Planning") — a single source of truth for "what counts as missing",
// per BR-023's explicit-zero-vs-unanswered rule: `0` satisfies a field,
// `null`/`undefined` does not.
export function getMissingPlanningParameters(record: {
  children: number | null;
  infants: number | null;
  intendedTravelMonth: string | null;
  nights: number | null;
  preferredDepartureCity: string | null;
}): JourneyPlanningGatedParameterField[] {
  const missing: JourneyPlanningGatedParameterField[] = [];
  for (const field of JOURNEY_PLANNING_GATED_PARAMETER_FIELDS) {
    const value = record[field];
    if (field === "preferredDepartureCity") {
      if (value === null || value === undefined || String(value).trim().length === 0) {
        missing.push(field);
      }
    } else if (value === null || value === undefined) {
      // BR-023: an explicit 0 is a valid, satisfying value for
      // children/infants/nights/-- only null/undefined ("never answered")
      // counts as missing.
      missing.push(field);
    }
  }
  return missing;
}

// WS12-003 Section 5: stage transitions must follow the approved lifecycle.
//
// WS12-010 Defect D3/D4 fix: reaching "closed" always requires an outcome
// (confirmed/lost/archived — the workspace_journey_planning_records
// CHECK constraint requires stage='closed' AND outcome IS NOT NULL), so a
// plain advance-stage call to "closed" can never succeed without one. Prior
// to this fix, JOURNEY_PLANNING_ALLOWED_TRANSITIONS.decision including
// "closed" let the Detail screen's generic "Move to <stage>" button loop
// render a "Move to Closed" control that always failed at the database
// layer with an unhandled 500 (Keerthi, WS12-009, Defect D3). "closed" is
// therefore rejected here as a generic advance-stage target with a clean,
// descriptive validation error; reaching Closed must go through
// recordJourneyPlanningDecision (the /decision endpoint), which always
// supplies an outcome. JOURNEY_PLANNING_ALLOWED_TRANSITIONS itself is left
// unchanged, since it still correctly describes "closed" as the only
// stage that follows "decision" — this guard narrows what the *generic*
// advance-stage action is allowed to do with that fact, not the lifecycle
// definition itself.
//
// EBC-R1.3-WS12-013 / FR-JP-34 / BR-021: Discovery→Planning is now a
// second named exception, alongside the closed-stage guard above. `record`
// is optional so every OTHER call site (every transition that is not
// discovery→planning) is unaffected and does not need to thread the
// gated fields through — only advanceJourneyPlanningStage's
// discovery→planning path needs to supply it (service.ts).
//
// EBC-R1.3-WS12-016 / PRA-02: Lead Created→Discovery is now a third named
// exception — the Ownership Gate — following the same philosophy as the
// Discovery→Planning gate above: a record must be claimed (ownerId set)
// before it may leave Lead Created. `record.ownerId` is read from the
// same `record` argument advanceJourneyPlanningStage already threads
// through for the Trip Basics gate (service.ts's JourneyPlanningRecord
// already carries ownerId) — no service.ts change was required to wire
// this in.
export function validateStageTransition(
  from: JourneyPlanningStage,
  to: JourneyPlanningStage,
  record?: {
    ownerId: string | null;
    children: number | null;
    infants: number | null;
    intendedTravelMonth: string | null;
    nights: number | null;
    preferredDepartureCity: string | null;
  },
): void {
  if (to === "closed") {
    throw new JourneyPlanningValidationError("closed_stage_requires_decision_endpoint");
  }

  const allowed = JOURNEY_PLANNING_ALLOWED_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new JourneyPlanningValidationError("invalid_stage_transition");
  }

  if (from === "lead_created" && to === "discovery") {
    validateLeadCreatedToDiscoveryGate(record);
  }

  if (from === "discovery" && to === "planning") {
    validateDiscoveryToPlanningGate(record);
  }
}

// EBC-R1.3-WS12-016 / PRA-02: Ownership Gate. A Journey Planning record
// must be claimed (ownerId set) before it may move from Lead Created to
// Discovery. This is server enforcement, not merely a UI rule — the UI's
// own disabled-button treatment (JourneyPlanningRecordDetailView.tsx) is
// a convenience, not the actual control; an Administrator actor bypasses
// this module's ownership-based RBAC (canAdvanceStage) entirely, so this
// gate is the only enforcement point that reliably blocks an unowned
// record from reaching Discovery.
function validateLeadCreatedToDiscoveryGate(record?: { ownerId: string | null }): void {
  if (!record || record.ownerId === null) {
    throw new JourneyPlanningValidationError("lead_created_to_discovery_requires_owner", [
      {
        field: "ownerId",
        code: "lead_created_to_discovery_requires_owner",
        message: "This record must be claimed before it can move to Discovery.",
      },
    ]);
  }
}

function validateDiscoveryToPlanningGate(
  record?: {
    children: number | null;
    infants: number | null;
    intendedTravelMonth: string | null;
    nights: number | null;
    preferredDepartureCity: string | null;
  },
): void {
  const missing = record ? getMissingPlanningParameters(record) : JOURNEY_PLANNING_GATED_PARAMETER_FIELDS.slice();
  if (missing.length > 0) {
    // EBC-R1.3-WS12-016 / PRA-01: the gate's own top-level `code` stays
    // exactly "discovery_to_planning_requires_trip_basics" (Keerthi's
    // WS12-014 regression script asserts this exact code) — only `issues`
    // is new, one entry per still-missing field, per PRA-01's own verbatim
    // examples ("Preferred Departure City is required before moving to
    // Planning.", "Intended Travel Month is required before moving to
    // Planning.").
    const issues: JourneyPlanningFieldIssue[] = missing.map((field) => ({
      field,
      code: GATED_FIELD_CODES[field],
      message: `${GATED_FIELD_LABELS[field]} is required before moving to Planning.`,
    }));
    throw new JourneyPlanningValidationError("discovery_to_planning_requires_trip_basics", issues);
  }
}

// Only the Decision stage may produce a closure outcome, and conversion
// (outcome = "confirmed") is handled exclusively by the conversion RPC —
// this function validates the other two closure paths (lost, archived),
// which close the record directly without a Journey.
export function validateDecisionOutcome(
  stage: JourneyPlanningStage,
  outcome: "lost" | "archived",
): void {
  if (stage !== "decision") {
    throw new JourneyPlanningValidationError("decision_outcome_requires_decision_stage");
  }
  if (outcome !== "lost" && outcome !== "archived") {
    throw new JourneyPlanningValidationError("invalid_decision_outcome");
  }
}

export function validateItinerarySnapshot(snapshot: ItinerarySnapshot): void {
  if (!Array.isArray(snapshot.destinations) || snapshot.destinations.length === 0) {
    throw new JourneyPlanningValidationError("itinerary_snapshot_requires_at_least_one_destination");
  }
  for (const destination of snapshot.destinations) {
    if (!destination.name || destination.name.trim().length === 0) {
      throw new JourneyPlanningValidationError("itinerary_destination_name_required");
    }
    if (typeof destination.nights !== "number" || destination.nights < 0) {
      throw new JourneyPlanningValidationError("itinerary_destination_nights_invalid");
    }
  }
  if (snapshot.priceEstimate !== null) {
    if (typeof snapshot.priceEstimate.amount !== "number" || snapshot.priceEstimate.amount < 0) {
      throw new JourneyPlanningValidationError("itinerary_price_estimate_invalid");
    }
    if (!snapshot.priceEstimate.currency || snapshot.priceEstimate.currency.trim().length === 0) {
      throw new JourneyPlanningValidationError("itinerary_price_estimate_currency_required");
    }
  }
}

export function validateVendorQuotationAmount(amount: number | undefined): void {
  if (amount !== undefined && amount < 0) {
    throw new JourneyPlanningValidationError("vendor_quotation_amount_invalid");
  }
}
