// EBC-R1.3-WS12-007 Phase 3: Journey Planning Services — validation.
// Business-rule validation lives here, not in repository.ts (data access)
// or in API route handlers, per this module's five-file convention.

import {
  JOURNEY_PLANNING_ALLOWED_TRANSITIONS,
  type CreateJourneyPlanningRecordInput,
  type ItinerarySnapshot,
  type JourneyPlanningStage,
  type NewBootstrapCorporateContactInput,
  type NewBootstrapTravellerInput,
} from "./types";

export class JourneyPlanningValidationError extends Error {
  constructor(readonly code: string) {
    super("Journey Planning validation failed");
    this.name = "JourneyPlanningValidationError";
  }
}

export function validateCreateJourneyPlanningRecordInput(
  input: CreateJourneyPlanningRecordInput,
): void {
  if (!input.title || input.title.trim().length === 0) {
    throw new JourneyPlanningValidationError("title_required");
  }

  if (input.recordKind === "individual") {
    if (!input.travellerId && !input.newTraveller) {
      throw new JourneyPlanningValidationError("traveller_required_for_individual_record");
    }
    if (input.newTraveller) {
      validateNewBootstrapTraveller(input.newTraveller);
    }
  }

  if (input.recordKind === "corporate") {
    if (!input.corporateContactId && !input.newCorporateContact) {
      throw new JourneyPlanningValidationError("corporate_contact_required_for_corporate_record");
    }
    if (input.newCorporateContact) {
      validateNewBootstrapCorporateContact(input.newCorporateContact);
    }
  }
}

function validateNewBootstrapTraveller(input: NewBootstrapTravellerInput): void {
  if (!input.fullName || input.fullName.trim().length === 0) {
    throw new JourneyPlanningValidationError("traveller_full_name_required");
  }
}

function validateNewBootstrapCorporateContact(input: NewBootstrapCorporateContactInput): void {
  if (!input.companyName || input.companyName.trim().length === 0) {
    throw new JourneyPlanningValidationError("corporate_contact_company_name_required");
  }
  if (!input.contactName || input.contactName.trim().length === 0) {
    throw new JourneyPlanningValidationError("corporate_contact_name_required");
  }
}

// WS12-003 Section 5: stage transitions must follow the approved lifecycle.
export function validateStageTransition(
  from: JourneyPlanningStage,
  to: JourneyPlanningStage,
): void {
  const allowed = JOURNEY_PLANNING_ALLOWED_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new JourneyPlanningValidationError("invalid_stage_transition");
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
