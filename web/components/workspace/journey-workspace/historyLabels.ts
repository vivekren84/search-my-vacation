// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7; TL-08): plain-language
// Journey History entries (UX Rev 4a §21; Sophie EBC-R1.3-WS13-020B S-6
// History labels; Archie EBC-R1.3-WS13-023A SR-11 "Contact added").
// Pure: event data in, title / detail lines / optional link out. Values the
// audit does not keep (POC phone and email, Archie AC-5) are never shown.

import type { JourneyHistoryCategory, JourneyHistoryEntry, JourneyStage } from "@/lib/workspace/journey-workspace/types";

import { AUDIT_EVENT_LABELS } from "../journey-planning/journeyPlanningLabels";
import { formatDateRange, JOURNEY_STAGE_LABELS } from "./journeyWorkspaceLabels";

export interface HistoryContext {
  userName: (id: string | null | undefined) => string;
  categoryLabel: (code: string | null | undefined) => string;
  planningRecord: { id: string; title: string } | null;
  planningRecordHref: (id: string) => string;
}

export interface DescribedHistoryEntry {
  glyph: string;
  title: string;
  details: string[];
  link?: { label: string; href: string };
}

const GLYPHS: Record<JourneyHistoryCategory, string> = {
  stage_status: "◆",
  ownership: "◐",
  contact_category: "✎",
  other: "•",
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function stage(value: unknown): string {
  const key = str(value) as JourneyStage | null;
  return key && key in JOURNEY_STAGE_LABELS ? JOURNEY_STAGE_LABELS[key] : (key ?? "—");
}

function contactName(value: unknown): string | null {
  return value && typeof value === "object" ? str((value as Record<string, unknown>).name) : null;
}

export function describeHistoryEntry(entry: JourneyHistoryEntry, ctx: HistoryContext): DescribedHistoryEntry {
  const d = entry.eventData ?? {};
  const glyph = GLYPHS[entry.category];
  const note = str(d.note);
  const noteLine = note ? [`Note: ${note}`] : [];

  switch (entry.eventType) {
    case "journey_created": {
      const record = ctx.planningRecord;
      return {
        glyph,
        title: record ? `Journey created from Journey Planning record ${record.title}` : "Journey created from Journey Planning",
        details: [],
        link: record ? { label: "Open planning record ↗", href: ctx.planningRecordHref(record.id) } : undefined,
      };
    }
    case "journey_stage_changed":
      return { glyph, title: `Stage: ${stage(d.from)} → ${stage(d.to)}`, details: noteLine };
    case "journey_stage_stepped_back":
      return { glyph, title: `Stepped back: ${stage(d.from)} → ${stage(d.to)}`, details: noteLine };
    case "journey_on_hold":
      return { glyph, title: `Placed on hold · Reason: ${str(d.reason) ?? "—"}`, details: [] };
    case "journey_resumed":
      return { glyph, title: `Resumed to ${stage(d.stage)}`, details: [] };
    case "journey_cancelled": {
      const tasks = typeof d.cancellation_tasks === "number" ? d.cancellation_tasks : 0;
      return {
        glyph,
        title: `Cancelled · Reason: ${str(d.reason) ?? "—"}`,
        details: tasks > 0 ? [`${tasks} vendor cancellation task${tasks === 1 ? "" : "s"} created`] : [],
      };
    }
    case "journey_closed":
      return { glyph, title: "Marked as Completed", details: [] };
    case "journey_reassigned":
      return { glyph, title: `Owner: ${ctx.userName(str(d.from))} → ${ctx.userName(str(d.to))}`, details: noteLine };
    case "journey_service_category_changed":
      return {
        glyph,
        title: str(d.from)
          ? `Service Category changed: ${ctx.categoryLabel(str(d.from))} → ${ctx.categoryLabel(str(d.to))}`
          : `Service Category set: ${ctx.categoryLabel(str(d.to))}`,
        details: [],
      };
    case "journey_contact_changed": {
      const before = contactName(d.before);
      const after = contactName(d.after);
      if (d.before === null || d.before === undefined) {
        return { glyph, title: `Primary Operational Contact added: ${after ?? "—"}`, details: [] };
      }
      if (before && after && before !== after) {
        return { glyph, title: `Primary Operational Contact: ${before} → ${after}`, details: [] };
      }
      return { glyph, title: "Primary Operational Contact details updated", details: [] };
    }
    case "journey_template_assigned":
      return { glyph, title: `Readiness template set: ${str(d.template_name) ?? str(d.template_code) ?? "—"}`, details: [] };
    case "journey_legacy_adopted": {
      const parts = [
        `Legacy Journey adopted by ${entry.actorName ?? ctx.userName(entry.actorId)}`,
        `Owner: ${ctx.userName(str(d.owner_id))}`,
      ];
      const dates = formatDateRange(str(d.confirmed_start_date), str(d.confirmed_end_date));
      if (dates) parts.push(`Dates: ${dates}`);
      if (str(d.service_category)) parts.push(`Service Category: ${ctx.categoryLabel(str(d.service_category))}`);
      if (d.nights_source === "derived_from_dates" && typeof d.nights === "number") {
        parts.push(`Nights set from the confirmed dates (${d.nights})`);
      }
      return { glyph, title: parts.join(" · "), details: [] };
    }
    case "legacy_backfilled":
      return { glyph, title: "Legacy record created by Workspace (automatic)", details: [] };
    case "task_created":
      return { glyph, title: `Task created: ${str(d.title) ?? "—"}`, details: [] };
    default: {
      const known = (AUDIT_EVENT_LABELS as Record<string, string>)[entry.eventType];
      return { glyph, title: known ?? entry.eventType.replace(/_/g, " "), details: [] };
    }
  }
}

// System events have no actor (PD-ARC-08).
export function actorLabel(entry: JourneyHistoryEntry): string {
  return entry.actorId ? (entry.actorName ?? "Unknown user") : "Workspace (automatic)";
}
