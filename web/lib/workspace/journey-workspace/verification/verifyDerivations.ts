// EBC-R1.3-WS13-005 Phase 0 (WP-0.13; WS13-004 §10.2):
// npm run verify:journey-workspace-derivations
// Asserts derivations.ts: readiness state (POD-01, BR-028, FR-JW-22 AC4;
// same rule as the M09 view) and the next action per stage (UX Rev 4a §8.2).

import { daysToDeparture, deriveNextAction, deriveReadinessState } from "../derivations";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace derivation verification failed: ${message}`);
}

// Readiness state.
assert(deriveReadinessState({ hasTemplate: false, mandatoryUnresolved: 0, daysToDeparture: 30, readinessWindowDays: 14 }) === "not_ready", "no template -> not ready");
assert(deriveReadinessState({ hasTemplate: true, mandatoryUnresolved: 0, daysToDeparture: 2, readinessWindowDays: 14 }) === "ready", "all mandatory resolved -> ready (optional never blocks)");
assert(deriveReadinessState({ hasTemplate: true, mandatoryUnresolved: 3, daysToDeparture: 14, readinessWindowDays: 14 }) === "at_risk", "inside window boundary (14 <= 14) -> at risk");
assert(deriveReadinessState({ hasTemplate: true, mandatoryUnresolved: 3, daysToDeparture: 15, readinessWindowDays: 14 }) === "not_ready", "outside window -> not ready");
assert(deriveReadinessState({ hasTemplate: true, mandatoryUnresolved: 1, daysToDeparture: -2, readinessWindowDays: 14 }) === "at_risk", "past departure with items -> at risk");
assert(deriveReadinessState({ hasTemplate: true, mandatoryUnresolved: 1, daysToDeparture: null, readinessWindowDays: 14 }) === "not_ready", "no dates (legacy) -> not ready");

// Days to departure (business dates).
assert(daysToDeparture("2026-10-12", "2026-09-28") === 14, "days to departure");
assert(daysToDeparture("2026-09-28", "2026-09-28") === 0, "departure today");
assert(daysToDeparture(null, "2026-09-28") === null, "no start date");

// Next action (UX Rev 4a §8.2).
const base = {
  stage: "confirmed" as const,
  outcome: null,
  onHold: false,
  archivedAt: null,
  adoptionStatus: "adopted" as const,
  readinessMandatoryUnresolved: 0,
  confirmedStartDate: "2026-10-12",
  confirmedEndDate: "2026-10-18",
  today: "2026-09-28",
};
assert(deriveNextAction(base) === "start_preparation", "confirmed -> start preparation");
assert(deriveNextAction({ ...base, stage: "in_preparation", readinessMandatoryUnresolved: 2 }) === "resolve_readiness", "items outstanding");
assert(deriveNextAction({ ...base, stage: "in_preparation" }) === "mark_ready_to_travel", "all resolved");
assert(deriveNextAction({ ...base, stage: "ready_to_travel" }) === "await_departure", "before start date");
assert(deriveNextAction({ ...base, stage: "ready_to_travel", today: "2026-10-12" }) === "mark_travelling", "on start date");
assert(deriveNextAction({ ...base, stage: "travelling", today: "2026-10-15" }) === "log_activity", "during travel");
assert(deriveNextAction({ ...base, stage: "travelling", today: "2026-10-18" }) === "mark_travel_complete", "on end date");
assert(deriveNextAction({ ...base, stage: "travel_complete" }) === "begin_post_travel", "travel complete");
assert(deriveNextAction({ ...base, stage: "post_travel" }) === "mark_completed", "post travel -> Mark as Completed");
assert(deriveNextAction({ ...base, stage: "journey_closed" }) === "none", "completed");
assert(deriveNextAction({ ...base, outcome: "cancelled" }) === "none", "cancelled");
assert(deriveNextAction({ ...base, outcome: "superseded" }) === "none", "superseded");
assert(deriveNextAction({ ...base, onHold: true }) === "resume", "on hold -> resume");
assert(deriveNextAction({ ...base, archivedAt: "2026-10-01T00:00:00Z" }) === "none", "archived -> none");
assert(deriveNextAction({ ...base, adoptionStatus: "legacy_pending" }) === "complete_adoption", "legacy -> adoption");

console.log(`Journey Workspace derivation verification passed (${checks} checks).`);
