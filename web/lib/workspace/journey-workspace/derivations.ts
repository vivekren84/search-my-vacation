// EBC-R1.3-WS13-005 Phase 0 (WP-0.12): the single pure derivation module
// (AD-WS13-004). No I/O, so the service, the UI and the Phase 3 cron route
// can all use it without importing each other, and it is verifiable by
// verify:journey-workspace-derivations.
//
// Phase 0 provides the foundation derivations the Phase 0 schema can
// already answer: readiness state (mirroring the M09 view), the next
// lifecycle action for a Journey (UX Rev 4a §8.2) and date facts. Alert
// conditions and deep links are added in Phase 2/3 with their consumers.

import { daysBetween } from "../shared/time/businessDate";
import { isJourneyTerminal } from "./validation";
import type { JourneyAdoptionStatus, JourneyOutcome, JourneyStage, ReadinessState } from "./types";

// Mirrors the readiness_state expression in
// supabase/migrations/20260928100800_workspace_journey_operational_summary_view.sql
// (POD-01, BR-028, FR-JW-22): only unresolved MANDATORY applicable items
// count; Optional items never block.
export function deriveReadinessState(input: {
  hasTemplate: boolean;
  mandatoryUnresolved: number;
  daysToDeparture: number | null;
  readinessWindowDays: number;
}): ReadinessState {
  if (!input.hasTemplate) return "not_ready";
  if (input.mandatoryUnresolved === 0) return "ready";
  if (input.daysToDeparture !== null && input.daysToDeparture <= input.readinessWindowDays) return "at_risk";
  return "not_ready";
}

export function daysToDeparture(confirmedStartDate: string | null, today: string): number | null {
  return confirmedStartDate ? daysBetween(today, confirmedStartDate) : null;
}

export type JourneyNextActionKind =
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

// UX Rev 4a §8.2 "Next step mapping". Returns what the next step IS; the
// UI owns copy and whether the viewer may act (owner/Administrator).
export function deriveNextAction(input: {
  stage: JourneyStage;
  outcome: JourneyOutcome | null;
  onHold: boolean;
  archivedAt: string | null;
  adoptionStatus: JourneyAdoptionStatus;
  readinessMandatoryUnresolved: number;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
  today: string;
}): JourneyNextActionKind {
  if (input.archivedAt !== null || isJourneyTerminal(input)) return "none";
  if (input.adoptionStatus === "legacy_pending") return "complete_adoption";
  if (input.onHold) return "resume";
  switch (input.stage) {
    case "confirmed":
      return "start_preparation";
    case "in_preparation":
      return input.readinessMandatoryUnresolved > 0 ? "resolve_readiness" : "mark_ready_to_travel";
    case "ready_to_travel":
      return input.confirmedStartDate !== null && input.confirmedStartDate <= input.today
        ? "mark_travelling"
        : "await_departure";
    case "travelling":
      return input.confirmedEndDate !== null && input.confirmedEndDate <= input.today
        ? "mark_travel_complete"
        : "log_activity";
    case "travel_complete":
      return "begin_post_travel";
    case "post_travel":
      return "mark_completed";
    default:
      return "none";
  }
}
