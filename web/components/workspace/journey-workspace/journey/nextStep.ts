// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): the Overview "Next step"
// card (UX Rev 4a §8.2 next-step mapping and §9.4 terminal outcome copy,
// with Sophie's Phase 1 confirmations EBC-R1.3-WS13-020B C-09 and §3).
// Pure: Journey detail in, one sentence and at most one action out. The
// action is offered only when it is the viewer's available primary action
// (owner or Administrator, UXD-JW-06); a disabled primary keeps its reason
// in the header, so the card then shows the sentence only (UX-03).

import type { JourneyActionKind, JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { formatDate, formatDayMonth, travellingDay } from "../journeyWorkspaceLabels";

export interface NextStep {
  sentence: string;
  action: JourneyActionKind | null;
}

export function describeNextStep(detail: JourneyDetail, cancelledOn: string | null): NextStep {
  const { journey, summary, availableActions, today } = detail;
  const primary = availableActions.primary;
  const primaryAvailable = primary !== null && availableActions.actions[primary]?.state === "available";
  const offer = (kind: JourneyActionKind): JourneyActionKind | null => (primaryAvailable && primary === kind ? kind : null);

  if (journey.outcome === "superseded") {
    return { sentence: `Replaced by ${detail.supersededBy?.journeyReference ?? "a replacement Journey"} after a material change.`, action: null };
  }
  if (journey.outcome === "cancelled") {
    const when = cancelledOn ?? journey.closedAt;
    return {
      sentence: `Cancelled${when ? ` on ${formatDate(when)}` : ""}${journey.outcomeReason ? ` · ${journey.outcomeReason}` : ""}.`,
      action: null,
    };
  }
  if (journey.stage === "journey_closed") {
    return { sentence: journey.closedAt ? `Completed on ${formatDate(journey.closedAt)}.` : "Completed.", action: null };
  }
  if (journey.archivedAt) return { sentence: "Archived Journeys are read-only.", action: null };

  if (journey.adoptionStatus === "legacy_pending") {
    return primary === "adopt"
      ? { sentence: "Legacy Journey needs adoption.", action: "adopt" }
      : { sentence: "Awaiting adoption by an Administrator.", action: null };
  }

  if (journey.onHold) {
    const since = journey.onHoldSince ? formatDayMonth(journey.onHoldSince) : null;
    return {
      sentence: `On hold${since ? ` since ${since}` : ""}${journey.onHoldReason ? `: ${journey.onHoldReason}` : ""}.`,
      action: offer("resume"),
    };
  }

  switch (journey.stage) {
    case "confirmed":
      return { sentence: "Confirm the readiness template to start preparing this Journey.", action: offer("start_preparation") };
    case "in_preparation": {
      if (summary.readinessMandatoryUnresolved > 0) {
        const n = summary.readinessMandatoryUnresolved;
        return { sentence: `${n} readiness item${n === 1 ? " is" : "s are"} still outstanding.`, action: null };
      }
      if (journey.readinessTemplateId !== null && summary.readinessMandatoryTotal === 0) {
        // EBC-R1.3-WS13-020B §3 (PO Decision 4): no template items yet.
        return {
          sentence: "No readiness items to check yet. Mark this Journey ready to travel when preparation is done.",
          action: offer("mark_ready_to_travel"),
        };
      }
      return { sentence: "Everything is in place. Mark this Journey ready to travel.", action: offer("mark_ready_to_travel") };
    }
    case "ready_to_travel":
      if (journey.confirmedStartDate && journey.confirmedStartDate > today) {
        return { sentence: `Departure on ${formatDayMonth(journey.confirmedStartDate)}. Nothing else is needed before then.`, action: null };
      }
      return { sentence: "Departure day has arrived.", action: offer("mark_travelling") };
    case "travelling":
      if (journey.confirmedEndDate && journey.confirmedEndDate <= today) {
        return { sentence: "The trip has ended. Mark travel complete.", action: offer("mark_travel_complete") };
      }
      if (journey.confirmedStartDate && journey.confirmedEndDate) {
        // 020B C-09: sentence only; "Log activity" arrives with Activity (Phase 2).
        const { day, of } = travellingDay(journey.confirmedStartDate, journey.confirmedEndDate, today);
        return { sentence: `Travelling · day ${day} of ${of}.`, action: null };
      }
      return { sentence: "Travelling.", action: null };
    case "travel_complete":
      return { sentence: "Welcome them back and begin post-travel follow-up.", action: offer("begin_post_travel") };
    case "post_travel":
      return { sentence: "When follow-up is done, mark the Journey as completed.", action: offer("mark_completed") };
    default:
      return { sentence: "", action: null };
  }
}
