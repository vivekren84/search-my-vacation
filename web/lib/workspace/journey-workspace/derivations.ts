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
import type { WorkspaceRole } from "../shared/types";
import { isJourneyTerminal } from "./validation";
import {
  JOURNEY_ACTION_KINDS,
  JOURNEY_CANCELLABLE_STAGES,
  JOURNEY_HOLDABLE_STAGES,
  type AvailableJourneyActions,
  type JourneyActionAvailability,
  type JourneyActionKind,
  type JourneyAdoptionStatus,
  type JourneyHistoryCategory,
  type JourneyOutcome,
  type JourneyStage,
  type ReadinessState,
} from "./types";

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

// ---------------------------------------------------------------------
// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): action availability.
// UX Rev 4a §9.3 (with EBC-R1.3-WS13-020B §2), mirroring the M11 checks
// (supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql).
// The RPCs stay the authority; this drives the header's primary action,
// the More menu, disabled reasons and the read-only line. Phase 1 actions
// only: material change (Phase 4) and archive (Phase 3) are not listed.
// ---------------------------------------------------------------------

export interface JourneyActionInput {
  stage: JourneyStage;
  outcome: JourneyOutcome | null;
  onHold: boolean;
  archivedAt: string | null;
  adoptionStatus: JourneyAdoptionStatus;
  ownerId: string | null;
  readinessTemplateId: string | null;
  readinessMandatoryUnresolved: number;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
}

export interface JourneyActionViewer {
  id: string;
  role: WorkspaceRole;
}

const AVAILABLE: JourneyActionAvailability = { state: "available" };
const HIDDEN: JourneyActionAvailability = { state: "hidden" };

const FORWARD_ACTION: Readonly<Partial<Record<JourneyStage, JourneyActionKind>>> = {
  confirmed: "start_preparation",
  in_preparation: "mark_ready_to_travel",
  ready_to_travel: "mark_travelling",
  travelling: "mark_travel_complete",
  travel_complete: "begin_post_travel",
  post_travel: "mark_completed",
};

function allHidden(): Record<JourneyActionKind, JourneyActionAvailability> {
  return Object.fromEntries(JOURNEY_ACTION_KINDS.map((kind) => [kind, HIDDEN])) as Record<JourneyActionKind, JourneyActionAvailability>;
}

export function getAvailableJourneyActions(
  journey: JourneyActionInput,
  viewer: JourneyActionViewer,
  today: string,
): AvailableJourneyActions {
  const actions = allHidden();
  const isAdministrator = viewer.role === "administrator";

  if (journey.archivedAt !== null) return { primary: null, actions, readOnlyReason: "archived" };
  if (isJourneyTerminal(journey)) return { primary: null, actions, readOnlyReason: "terminal" };

  // BR-036: legacy Journeys cannot progress until an Administrator adopts them.
  if (journey.adoptionStatus === "legacy_pending") {
    if (isAdministrator) {
      actions.adopt = AVAILABLE;
      return { primary: "adopt", actions, readOnlyReason: null };
    }
    return { primary: null, actions, readOnlyReason: "legacy_awaiting_adoption" };
  }

  // FR-JW-09 AC3 / BR-035: only the owner or an Administrator changes a Journey.
  const canChange = isAdministrator || (journey.ownerId !== null && journey.ownerId === viewer.id);
  if (!canChange) return { primary: null, actions, readOnlyReason: "not_owner" };

  actions.reassign = AVAILABLE;
  actions.edit_service_category = AVAILABLE;
  actions.edit_contact = AVAILABLE;
  if (JOURNEY_CANCELLABLE_STAGES.includes(journey.stage)) actions.cancel = AVAILABLE;

  if (journey.onHold) {
    actions.resume = AVAILABLE;
    return { primary: "resume", actions, readOnlyReason: null };
  }

  if (JOURNEY_HOLDABLE_STAGES.includes(journey.stage)) actions.place_on_hold = AVAILABLE;
  if (journey.stage === "ready_to_travel") actions.step_back = AVAILABLE;

  const primary = FORWARD_ACTION[journey.stage] ?? null;
  if (primary) actions[primary] = forwardAvailability(journey, today);
  return { primary, actions, readOnlyReason: null };
}

function forwardAvailability(journey: JourneyActionInput, today: string): JourneyActionAvailability {
  switch (journey.stage) {
    case "in_preparation":
      // BR-028; PO Decision 4: with no template items nothing is outstanding.
      if (journey.readinessTemplateId === null) return { state: "disabled", reason: "template_required" };
      if (journey.readinessMandatoryUnresolved > 0) {
        return { state: "disabled", reason: "readiness_outstanding", outstandingCount: journey.readinessMandatoryUnresolved };
      }
      return AVAILABLE;
    case "ready_to_travel":
      if (journey.confirmedStartDate === null || journey.confirmedStartDate > today) {
        return { state: "disabled", reason: "before_start_date", availableFrom: journey.confirmedStartDate ?? undefined };
      }
      return AVAILABLE;
    case "travelling":
      if (journey.confirmedEndDate === null || journey.confirmedEndDate > today) {
        return { state: "disabled", reason: "before_end_date", availableFrom: journey.confirmedEndDate ?? undefined };
      }
      return AVAILABLE;
    default:
      return AVAILABLE;
  }
}

// History filter chips in Phase 1 (EBC-R1.3-WS13-020B S-6): All · Stage &
// status · Ownership · Contact & category. Other events (Phases 2–3) fall
// into "other" until their chips arrive.
const HISTORY_CATEGORY: Readonly<Record<string, JourneyHistoryCategory>> = {
  journey_created: "stage_status",
  journey_stage_changed: "stage_status",
  journey_stage_stepped_back: "stage_status",
  journey_on_hold: "stage_status",
  journey_resumed: "stage_status",
  journey_cancelled: "stage_status",
  journey_closed: "stage_status",
  journey_superseded: "stage_status",
  journey_template_assigned: "stage_status",
  journey_legacy_adopted: "ownership",
  journey_reassigned: "ownership",
  legacy_backfilled: "ownership",
  journey_contact_changed: "contact_category",
  journey_service_category_changed: "contact_category",
};

export function journeyHistoryCategory(eventType: string): JourneyHistoryCategory {
  return HISTORY_CATEGORY[eventType] ?? "other";
}

export function journeyHistoryEventTypes(filter: Exclude<JourneyHistoryCategory, "other">): string[] {
  return Object.entries(HISTORY_CATEGORY)
    .filter(([, category]) => category === filter)
    .map(([eventType]) => eventType);
}
