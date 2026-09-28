// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace rule checks used
// for UI gating and early, field-specific feedback. The database RPCs
// (AD-WS13-002) remain the authority; every function here names the rule
// it mirrors. Pure: no I/O (verify:journey-workspace-transitions).

import { isIsoDate, nightsBetween } from "../shared/time/businessDate";
import {
  JOURNEY_CANCELLABLE_STAGES,
  JOURNEY_HOLDABLE_STAGES,
  JOURNEY_STAGE_TRANSITIONS,
  VENDOR_BOOKING_TRANSITIONS,
  type JourneyOutcome,
  type JourneyStage,
  type VendorBookingStatus,
} from "./types";

export interface JourneyStateForRules {
  stage: JourneyStage;
  outcome: JourneyOutcome | null;
  onHold: boolean;
  archivedAt: string | null;
  adoptionStatus: "adopted" | "legacy_pending";
}

// Terminal = Journey Closed, Cancelled or Superseded (AD-WS13-001).
export function isJourneyTerminal(journey: Pick<JourneyStateForRules, "stage" | "outcome">): boolean {
  return journey.stage === "journey_closed" || journey.outcome !== null;
}

// Editable = adopted, not terminal, not archived (POD-08: Archived is
// read-only). Mirrors public.workspace_can_edit_journey (minus the
// owner/Administrator check, done by shared/rbac/permissions.ts).
export function isJourneyEditable(journey: JourneyStateForRules): boolean {
  return journey.adoptionStatus === "adopted" && !isJourneyTerminal(journey) && journey.archivedAt === null;
}

export function isAllowedStageTransition(from: JourneyStage, to: JourneyStage): boolean {
  return (JOURNEY_STAGE_TRANSITIONS[from] ?? []).includes(to);
}

// WS13-001 §10.2 plus the overlays: no stage change while On Hold (resume
// first), none on a terminal, archived or legacy Journey.
export function canTransitionJourneyStage(journey: JourneyStateForRules, to: JourneyStage): boolean {
  return isJourneyEditable(journey) && !journey.onHold && isAllowedStageTransition(journey.stage, to);
}

// BR-029.
export function canPlaceJourneyOnHold(journey: JourneyStateForRules): boolean {
  return isJourneyEditable(journey) && !journey.onHold && JOURNEY_HOLDABLE_STAGES.includes(journey.stage);
}

// BR-030.
export function canCancelJourney(journey: JourneyStateForRules): boolean {
  return isJourneyEditable(journey) && JOURNEY_CANCELLABLE_STAGES.includes(journey.stage);
}

export function isAllowedBookingTransition(from: VendorBookingStatus, to: VendorBookingStatus): boolean {
  return (VENDOR_BOOKING_TRANSITIONS[from] ?? []).includes(to);
}

// BR-033 / §11.1 required inputs for a booking status change.
export function bookingTransitionRequirements(to: VendorBookingStatus): { reason: boolean; bookingReference: boolean } {
  return {
    reason: to === "pending_information" || to === "cancelled",
    bookingReference: to === "booked",
  };
}

export type ConversionDateIssue =
  | "dates_required"
  | "dates_invalid"
  | "nights_required"
  | "dates_nights_mismatch";

// BR-027 / POD-06 Policy 2 / PD-A / I-05: conversion date checks, in the
// same order as public.workspace_convert_journey_planning_record. Returns
// every applicable issue (PRA-01: several at once) rather than the first.
export function checkConversionDates(input: {
  confirmedStartDate: string | null | undefined;
  confirmedEndDate: string | null | undefined;
  nights: number | null | undefined;
}): ConversionDateIssue[] {
  const issues: ConversionDateIssue[] = [];
  const start = isIsoDate(input.confirmedStartDate) ? input.confirmedStartDate : null;
  const end = isIsoDate(input.confirmedEndDate) ? input.confirmedEndDate : null;
  const orderedDates = start !== null && end !== null && end >= start ? { start, end } : null;
  if (start === null || end === null) {
    issues.push("dates_required");
  } else if (orderedDates === null) {
    issues.push("dates_invalid");
  }
  if (input.nights === null || input.nights === undefined) {
    issues.push("nights_required");
  } else if (orderedDates !== null && nightsBetween(orderedDates.start, orderedDates.end) !== input.nights) {
    issues.push("dates_nights_mismatch");
  }
  return issues;
}
