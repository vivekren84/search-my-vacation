// EBC-R1.3-WS13-005 Phase 0 (WP-0.13; WS13-004 §10.2):
// npm run verify:journey-workspace-transitions
// Asserts the TypeScript lifecycle tables and rule helpers against
// WS13-001 Revision 3 §10.2 (Journey) and §11.1 (Vendor Booking). The SQL
// twins (Phase 1/2 RPCs) are verified against the database separately.

import {
  JOURNEY_STAGES,
  JOURNEY_STAGE_TRANSITIONS,
  VENDOR_BOOKING_TRANSITIONS,
  type JourneyStage,
  type VendorBookingStatus,
} from "../types";
import {
  bookingTransitionRequirements,
  canCancelJourney,
  canPlaceJourneyOnHold,
  canTransitionJourneyStage,
  isAllowedBookingTransition,
  isAllowedStageTransition,
  isJourneyEditable,
  isJourneyTerminal,
  type JourneyStateForRules,
} from "../validation";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace transition verification failed: ${message}`);
}

// WS13-001 §10.2, written out independently of the table under test.
const EXPECTED_ALLOWED: Array<[JourneyStage, JourneyStage]> = [
  ["confirmed", "in_preparation"],
  ["in_preparation", "ready_to_travel"],
  ["ready_to_travel", "travelling"],
  ["ready_to_travel", "in_preparation"],
  ["travelling", "travel_complete"],
  ["travel_complete", "post_travel"],
  ["post_travel", "journey_closed"],
];

for (const from of JOURNEY_STAGES) {
  for (const to of JOURNEY_STAGES) {
    const expected = EXPECTED_ALLOWED.some(([a, b]) => a === from && b === to);
    assert(isAllowedStageTransition(from, to) === expected, `stage ${from} -> ${to} should be ${expected ? "allowed" : "invalid"}`);
  }
}
assert(JOURNEY_STAGE_TRANSITIONS.journey_closed.length === 0, "Journey Closed is terminal (never reopened)");

const base: JourneyStateForRules = {
  stage: "confirmed",
  outcome: null,
  onHold: false,
  archivedAt: null,
  adoptionStatus: "adopted",
};

// Terminal and editability (AD-WS13-001; POD-08 archived = read-only; BR-036 legacy cannot progress).
assert(!isJourneyTerminal(base), "confirmed is not terminal");
assert(isJourneyTerminal({ stage: "journey_closed", outcome: null }), "journey_closed is terminal");
assert(isJourneyTerminal({ stage: "in_preparation", outcome: "cancelled" }), "cancelled is terminal");
assert(isJourneyTerminal({ stage: "confirmed", outcome: "superseded" }), "superseded is terminal");
assert(isJourneyEditable(base), "adopted confirmed Journey is editable");
assert(!isJourneyEditable({ ...base, archivedAt: "2026-10-01T00:00:00Z" }), "archived Journey is read-only");
assert(!isJourneyEditable({ ...base, adoptionStatus: "legacy_pending" }), "legacy Journey cannot progress");
assert(!isJourneyEditable({ ...base, outcome: "cancelled" }), "cancelled Journey is read-only");

// Stage change blocked while On Hold (resume first).
assert(canTransitionJourneyStage(base, "in_preparation"), "confirmed -> in_preparation");
assert(!canTransitionJourneyStage({ ...base, onHold: true }, "in_preparation"), "no stage change while on hold");
assert(!canTransitionJourneyStage({ ...base, archivedAt: "x" }, "in_preparation"), "no stage change when archived");

// BR-029 On Hold only from Confirmed, In Preparation, Ready to Travel.
for (const stage of JOURNEY_STAGES) {
  const expected = stage === "confirmed" || stage === "in_preparation" || stage === "ready_to_travel";
  assert(canPlaceJourneyOnHold({ ...base, stage }) === expected, `on hold from ${stage}`);
}
assert(!canPlaceJourneyOnHold({ ...base, onHold: true }), "already on hold");

// BR-030 Cancel from Confirmed through Travelling (incl. while On Hold).
for (const stage of JOURNEY_STAGES) {
  const expected = ["confirmed", "in_preparation", "ready_to_travel", "travelling"].includes(stage);
  assert(canCancelJourney({ ...base, stage }) === expected, `cancel from ${stage}`);
}
assert(canCancelJourney({ ...base, stage: "in_preparation", onHold: true }), "cancel while on hold");

// WS13-001 §11.1 Vendor Booking lifecycle.
const BOOKING_STATUSES: VendorBookingStatus[] = ["draft", "requested", "pending_information", "confirmed", "booked", "cancelled"];
const EXPECTED_BOOKING: Array<[VendorBookingStatus, VendorBookingStatus]> = [
  ["draft", "requested"],
  ["draft", "cancelled"],
  ["requested", "pending_information"],
  ["requested", "confirmed"],
  ["requested", "cancelled"],
  ["pending_information", "requested"],
  ["pending_information", "confirmed"],
  ["pending_information", "cancelled"],
  ["confirmed", "booked"],
  ["confirmed", "requested"],
  ["confirmed", "cancelled"],
  ["booked", "requested"],
  ["booked", "cancelled"],
];
for (const from of BOOKING_STATUSES) {
  for (const to of BOOKING_STATUSES) {
    const expected = EXPECTED_BOOKING.some(([a, b]) => a === from && b === to);
    assert(isAllowedBookingTransition(from, to) === expected, `booking ${from} -> ${to} should be ${expected ? "allowed" : "invalid"}`);
  }
}
assert(VENDOR_BOOKING_TRANSITIONS.cancelled.length === 0, "Cancelled booking is terminal");
assert(bookingTransitionRequirements("booked").bookingReference, "Booked requires a booking reference");
assert(bookingTransitionRequirements("pending_information").reason, "Pending Information requires a reason");
assert(bookingTransitionRequirements("cancelled").reason, "Cancelled requires a reason");
assert(!bookingTransitionRequirements("confirmed").reason, "Confirmed needs no reason");

console.log(`Journey Workspace transition verification passed (${checks} checks).`);
