// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7/WP-1.8): Journey Workspace
// labels and date formatting, as plain data and pure functions so every
// screen (list, header, Overview, History, dialogs) uses one source.
//
// Copy: UX Rev 4a (EBC-R1.3-WS13-002) §7–§9, §13, §16, §21, §27, §36.2 and
// Sophie's Phase 1 confirmations EBC-R1.3-WS13-020B (C-01…C-14, TL-08
// History labels, §3 readiness display). UX-04: the state Journey Closed is
// shown as "Completed".

import type {
  JourneyActionDisabledReason,
  JourneyActionKind,
  JourneyNextActionKindName,
  JourneyStage,
  OperationalContactType,
  ReadinessState,
} from "@/lib/workspace/journey-workspace/types";

export const JOURNEY_STAGE_LABELS: Record<JourneyStage, string> = {
  confirmed: "Confirmed",
  in_preparation: "In Preparation",
  ready_to_travel: "Ready to Travel",
  travelling: "Travelling",
  travel_complete: "Travel Complete",
  post_travel: "Post Travel",
  journey_closed: "Completed",
};

export const READINESS_LABELS: Record<ReadinessState, string> = {
  not_ready: "Not Ready",
  at_risk: "At Risk",
  ready: "Ready",
};

export const CONTACT_TYPE_LABELS: Record<OperationalContactType, string> = {
  individual_traveller: "Individual traveller",
  corporate_organisation: "Corporate organisation",
  b2b_travel_partner: "B2B travel partner",
  other_authorised_entity: "Other authorised entity",
};

// Header primary action and More menu labels (UX §9.3; 020B C-07).
export function actionLabel(kind: JourneyActionKind, resumeStage?: JourneyStage): string {
  switch (kind) {
    case "start_preparation":
      return "Start preparation";
    case "mark_ready_to_travel":
      return "Mark ready to travel";
    case "mark_travelling":
      return "Mark travelling";
    case "mark_travel_complete":
      return "Mark travel complete";
    case "begin_post_travel":
      return "Begin post-travel follow-up";
    case "mark_completed":
      return "Mark as Completed";
    case "step_back":
      return "Step back to In Preparation";
    case "place_on_hold":
      return "Place on hold";
    case "resume":
      return resumeStage ? `Resume to ${JOURNEY_STAGE_LABELS[resumeStage]}` : "Resume";
    case "cancel":
      return "Cancel Journey";
    case "reassign":
      return "Reassign…";
    case "edit_service_category":
      return "Change Service Category";
    case "edit_contact":
      return "Edit";
    case "adopt":
      return "Complete adoption";
  }
}

// Success toasts (UX §9.3 pattern "Journey marked Ready to Travel."; 020B S-4).
export function actionSuccessMessage(kind: JourneyActionKind, resumeStage?: JourneyStage): string {
  switch (kind) {
    case "start_preparation":
      return "Journey moved to In Preparation.";
    case "mark_ready_to_travel":
      return "Journey marked Ready to Travel.";
    case "mark_travelling":
      return "Journey marked Travelling.";
    case "mark_travel_complete":
      return "Journey marked Travel Complete.";
    case "begin_post_travel":
      return "Journey moved to Post Travel.";
    case "mark_completed":
      return "Journey marked as Completed.";
    case "step_back":
      return "Journey moved back to In Preparation.";
    case "place_on_hold":
      return "Journey placed on hold.";
    case "resume":
      return resumeStage ? `Journey resumed to ${JOURNEY_STAGE_LABELS[resumeStage]}.` : "Journey resumed.";
    case "cancel":
      return "Journey cancelled.";
    case "reassign":
      return "Owner updated.";
    case "edit_service_category":
      return "Service Category updated.";
    case "edit_contact":
      return "Primary Operational Contact updated.";
    case "adopt":
      return "Journey adopted. It is now Confirmed.";
  }
}

// List row "Next:" text (UX §7.2; 020B C-09: no "Log activity" in Phase 1).
export const NEXT_ACTION_LABELS: Record<JourneyNextActionKindName, string> = {
  start_preparation: "Start preparation",
  resolve_readiness: "Resolve readiness items",
  mark_ready_to_travel: "Mark ready to travel",
  await_departure: "Awaiting departure",
  mark_travelling: "Mark travelling",
  log_activity: "Travelling",
  mark_travel_complete: "Mark travel complete",
  begin_post_travel: "Begin post-travel follow-up",
  mark_completed: "Mark as Completed",
  resume: "Resume",
  complete_adoption: "Complete adoption",
  none: "—",
};

// ---------------------------------------------------------------------
// Dates. Business dates are YYYY-MM-DD strings and are formatted in UTC so
// the calendar day never shifts with the browser's time zone.
// ---------------------------------------------------------------------

const SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const LONG = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const STAMP = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function asUtcDate(date: string): Date {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDayMonth(date: string): string {
  return SHORT.format(asUtcDate(date));
}

export function formatDate(date: string): string {
  return LONG.format(asUtcDate(date));
}

export function formatMonthYear(month: string): string {
  return MONTH_YEAR.format(asUtcDate(`${month}-01`));
}

// "12 Oct – 18 Oct 2026" (UX §8.1 meta line).
export function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && end) {
    const sameYear = start.slice(0, 4) === end.slice(0, 4);
    return `${sameYear ? formatDayMonth(start) : formatDate(start)} – ${formatDate(end)}`;
  }
  return formatDate((start ?? end) as string);
}

export function daysBetweenDates(from: string, to: string): number {
  return Math.round((asUtcDate(to).getTime() - asUtcDate(from).getTime()) / 86_400_000);
}

// Relative departure (UX §8.1): "in 18 days", "Departs today",
// "Travelling · day 3 of 7", "Returned 5 days ago".
export function relativeDeparture(start: string | null, end: string | null, today: string): string | null {
  if (!start) return null;
  const toStart = daysBetweenDates(today, start);
  if (toStart > 1) return `in ${toStart} days`;
  if (toStart === 1) return "tomorrow";
  if (toStart === 0) return "departs today";
  if (end) {
    const toEnd = daysBetweenDates(today, end);
    if (toEnd >= 0) return `day ${1 - toStart} of ${daysBetweenDates(start, end) + 1}`;
    return toEnd === -1 ? "returned yesterday" : `returned ${-toEnd} days ago`;
  }
  return `departed ${-toStart} days ago`;
}

export function travellingDay(start: string, end: string, today: string): { day: number; of: number } {
  return { day: Math.max(1, daysBetweenDates(start, today) + 1), of: daysBetweenDates(start, end) + 1 };
}

export function formatTimestamp(iso: string): string {
  return STAMP.format(new Date(iso));
}

// "2 hours ago" with the absolute time available on hover (UX §21).
export function relativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatTimestamp(iso);
}

// Disabled-reason notes under the gated primary button (UX §9.3; 020B S-5).
export function disabledReasonText(
  reason: JourneyActionDisabledReason,
  detail: { availableFrom?: string; outstandingCount?: number },
): string {
  switch (reason) {
    case "readiness_outstanding": {
      const n = detail.outstandingCount ?? 0;
      return `${n} readiness item${n === 1 ? "" : "s"} outstanding`;
    }
    case "template_required":
      return "Choose a readiness template first";
    case "before_start_date":
      return detail.availableFrom ? `Available from ${formatDayMonth(detail.availableFrom)} (departure date)` : "Available from the departure date";
    case "before_end_date":
      return detail.availableFrom ? `Available from ${formatDayMonth(detail.availableFrom)} (return date)` : "Available from the return date";
  }
}

export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function pluralise(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}
