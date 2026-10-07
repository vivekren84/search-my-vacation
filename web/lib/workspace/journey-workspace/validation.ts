// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): Journey Workspace rule checks used
// for UI gating and early, field-specific feedback. The database RPCs
// (AD-WS13-002) remain the authority; every function here names the rule
// it mirrors. Pure: no I/O (verify:journey-workspace-transitions).

import { isIsoDate, nightsBetween } from "../shared/time/businessDate";
import type { WorkspaceRole } from "../shared/types";
import { fieldIssue } from "./errors";
import { CONTACT_FIELD_MESSAGES } from "./messages";
import {
  JOURNEY_CANCELLABLE_STAGES,
  JOURNEY_HOLDABLE_STAGES,
  JOURNEY_STAGE_TRANSITIONS,
  OPERATIONAL_CONTACT_TYPES,
  VENDOR_BOOKING_TRANSITIONS,
  type JourneyFieldIssue,
  type JourneyHistoryCursor,
  type JourneyHistoryFilter,
  type JourneyOutcome,
  type JourneyStage,
  type OperationalContactInput,
  type OperationalContactType,
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

// ---------------------------------------------------------------------
// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): input rules for the
// service layer. Each mirrors the M11 check named beside it, so the API
// can report several field problems at once (PRA-01 precedent) before the
// RPC repeats every check authoritatively (AD-WS13-002).
// ---------------------------------------------------------------------

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function isJourneyStage(value: unknown): value is JourneyStage {
  return typeof value === "string" && (JOURNEY_STAGE_TRANSITIONS as Record<string, unknown>)[value] !== undefined;
}

// PO Decision 3 (4-Oct-2026): every authorised Workspace User may view the
// team's Journey list; ownership still governs every change.
export function canViewTeamScope(role: WorkspaceRole | null | undefined): boolean {
  return role === "administrator" || role === "privilege_user";
}

export const JOURNEY_REASON_MAX_LENGTH = 500; // M11 reason_too_long
export const JOURNEY_NOTE_MAX_LENGTH = 1000; // M11 note_too_long

// M11 place_on_hold / cancel: reason trimmed, required, at most 500.
export function normaliseJourneyReason(raw: unknown, field = "reason"): { value: string } | { issue: JourneyFieldIssue } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value === "") return { issue: fieldIssue(field, "reason_required") };
  if (value.length > JOURNEY_REASON_MAX_LENGTH) return { issue: fieldIssue(field, "reason_too_long") };
  return { value };
}

// M11 transition / reassign: optional note, trimmed, at most 1000.
export function normaliseJourneyNote(raw: unknown, field = "note"): { value: string | null } | { issue: JourneyFieldIssue } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value === "") return { value: null };
  if (value.length > JOURNEY_NOTE_MAX_LENGTH) return { issue: fieldIssue(field, "note_too_long") };
  return { value };
}

function optionalTrimmed(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// BR-040 / UX §13 (JW-15) and M11 adopt_legacy contact_invalid: type from
// the four values; name required; organisation required for Corporate
// organisation and B2B travel partner; phone or email (at least one).
// Returns every problem at once.
export function validateOperationalContactInput(raw: Partial<Record<keyof OperationalContactInput, unknown>>):
  | { value: OperationalContactInput }
  | { issues: JourneyFieldIssue[] } {
  const issues: JourneyFieldIssue[] = [];
  const contactType = typeof raw.contactType === "string" && (OPERATIONAL_CONTACT_TYPES as readonly string[]).includes(raw.contactType)
    ? (raw.contactType as OperationalContactType)
    : null;
  const name = optionalTrimmed(raw.name);
  const organisation = optionalTrimmed(raw.organisation);
  const phone = optionalTrimmed(raw.phone);
  const email = optionalTrimmed(raw.email);

  if (!contactType) issues.push(fieldIssue("contactType", "contact_invalid", CONTACT_FIELD_MESSAGES.contactType));
  if (!name) issues.push(fieldIssue("name", "contact_invalid", CONTACT_FIELD_MESSAGES.name));
  if ((contactType === "corporate_organisation" || contactType === "b2b_travel_partner") && !organisation) {
    issues.push(fieldIssue("organisation", "contact_invalid", CONTACT_FIELD_MESSAGES.organisation));
  }
  if (!phone && !email) issues.push(fieldIssue("phone", "contact_invalid", CONTACT_FIELD_MESSAGES.phone));

  if (issues.length > 0 || !contactType || !name) return { issues };
  return { value: { contactType, name, organisation, phone, email } };
}

// PO Decision 5 / M11 adopt_legacy nights rule: stored nights must equal
// end - start; missing nights are derived from the Administrator's dates.
export function deriveAdoptionNights(
  confirmedStartDate: string,
  confirmedEndDate: string,
  storedNights: number | null,
): { nights: number; source: "stored" | "derived_from_dates" } | { issue: "dates_nights_mismatch" } {
  const span = nightsBetween(confirmedStartDate, confirmedEndDate);
  if (storedNights === null) return { nights: span, source: "derived_from_dates" };
  if (span !== storedNights) return { issue: "dates_nights_mismatch" };
  return { nights: storedNights, source: "stored" };
}

// M11 adopt_legacy field checks that do not need the database (owner,
// template and Service Category existence are checked by the RPC).
export function validateAdoptionDates(input: {
  confirmedStartDate: unknown;
  confirmedEndDate: unknown;
  storedNights: number | null;
}): JourneyFieldIssue[] {
  const start = isIsoDate(input.confirmedStartDate) ? input.confirmedStartDate : null;
  const end = isIsoDate(input.confirmedEndDate) ? input.confirmedEndDate : null;
  if (!start || !end) return [fieldIssue(!start ? "confirmedStartDate" : "confirmedEndDate", "dates_required")];
  if (end < start) return [fieldIssue("confirmedEndDate", "dates_invalid")];
  const nights = deriveAdoptionNights(start, end, input.storedNights);
  return "issue" in nights ? [fieldIssue("confirmedEndDate", "dates_nights_mismatch")] : [];
}

// ---- History query (JW-08; UX §21) -----------------------------------

const HISTORY_FILTERS: readonly JourneyHistoryFilter[] = ["all", "stage_status", "ownership", "contact_category"];

// Lenient: an unknown filter shows everything.
export function parseJourneyHistoryFilter(value: string | null): JourneyHistoryFilter {
  return HISTORY_FILTERS.includes(value as JourneyHistoryFilter) ? (value as JourneyHistoryFilter) : "all";
}

// Cursor token: "<created_at>|<id>" of the last entry on the previous page.
export function encodeJourneyHistoryCursor(cursor: JourneyHistoryCursor): string {
  return `${cursor.createdAt}|${cursor.id}`;
}

const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}(:\d{2})?)$/;

// Strict: the token reaches a PostgREST filter, so only an ISO timestamp
// and a UUID are accepted (no other characters can pass).
export function decodeJourneyHistoryCursor(
  token: string | null,
): { value: JourneyHistoryCursor | null } | { issue: JourneyFieldIssue } {
  if (token === null || token === "") return { value: null };
  const parts = token.split("|");
  const [createdAt, id] = parts;
  if (parts.length !== 2 || !isUuid(id) || !TIMESTAMP_PATTERN.test(createdAt) || Number.isNaN(Date.parse(createdAt))) {
    return { issue: fieldIssue("before", "invalid_request") };
  }
  return { value: { createdAt, id } };
}
