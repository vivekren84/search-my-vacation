"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.8): small visual primitives
// for Journey Workspace (UX Rev 4a §9.1, §22, §25). Existing tokens only,
// no new colour, font, icon library or dependency (UX §22). Status is never
// colour alone: every badge and chip carries text and a glyph (§25).

import type { ReactNode } from "react";

import type { JourneyOutcome, JourneyStage, ReadinessState } from "@/lib/workspace/journey-workspace/types";

import { initials, JOURNEY_STAGE_LABELS, READINESS_LABELS } from "./journeyWorkspaceLabels";

// Shared button recipes (the Workspace's existing pill buttons).
export const BUTTON_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-amber)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[#e88a16] disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-[var(--color-amber)]";
export const BUTTON_DARK =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-espresso)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";
export const BUTTON_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-warm)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[rgb(245_149_28_/_8%)] disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";
export const BUTTON_LINK =
  "font-semibold text-[var(--color-espresso)] underline underline-offset-2 hover:text-[var(--color-espresso)]/70";
export const CARD = "rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white";
export const SECTION_TITLE = "text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-espresso)]/60";
export const INPUT =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border-warm)] bg-white px-3 py-2 text-sm text-[var(--color-espresso)] focus:border-[var(--color-amber)] focus:outline-none focus:ring-2 focus:ring-[var(--color-amber)]/30";

const SUCCESS_TEXT = "text-[color-mix(in_srgb,var(--color-success)_72%,black)]";

const FAMILY_STYLES: Record<JourneyStage, string> = {
  confirmed: "bg-[var(--color-amber)]/14 text-[var(--color-espresso)]",
  in_preparation: "bg-[var(--color-amber)]/14 text-[var(--color-espresso)]",
  ready_to_travel: "bg-[var(--color-amber)]/14 text-[var(--color-espresso)]",
  travelling: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  travel_complete: "bg-[var(--color-espresso)]/8 text-[var(--color-espresso)]",
  post_travel: "bg-[var(--color-espresso)]/8 text-[var(--color-espresso)]",
  journey_closed: `bg-[var(--color-success)]/12 ${SUCCESS_TEXT}`,
};

const PILL = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide";

// Stage badge with the WS12 colour-by-family rule (UX §9.1). Cancelled and
// Superseded replace the stage with an outline end state.
export function StageBadge({ stage, outcome = null }: { stage: JourneyStage; outcome?: JourneyOutcome | null }) {
  if (outcome === "cancelled") {
    return (
      <span className={`${PILL} border border-[var(--color-espresso)]/30 text-[var(--color-espresso)]/80`}>
        <span aria-hidden="true">✕</span> Cancelled
      </span>
    );
  }
  if (outcome === "superseded") {
    return (
      <span className={`${PILL} border border-[var(--color-espresso)]/30 text-[var(--color-espresso)]/80`}>
        <span aria-hidden="true">⇢</span> Superseded
      </span>
    );
  }
  return (
    <span className={`${PILL} ${FAMILY_STYLES[stage]}`} title={stage === "journey_closed" ? "Completed (Journey Closed)" : undefined}>
      {stage === "journey_closed" ? <span aria-hidden="true">✓</span> : null}
      {JOURNEY_STAGE_LABELS[stage]}
    </span>
  );
}

// Overlays sit next to the stage badge, dashed outline (UX §9.1).
export function OverlayChip({ kind }: { kind: "on_hold" | "archived" | "legacy" }) {
  const content =
    kind === "on_hold"
      ? { glyph: "⏸", label: "On Hold" }
      : kind === "archived"
        ? { glyph: "▣", label: "Archived" }
        : { glyph: "◌", label: "Incomplete legacy record" };
  return (
    <span className={`${PILL} border border-dashed border-[var(--color-espresso)]/40 text-[var(--color-espresso)]/80`}>
      <span aria-hidden="true">{content.glyph}</span> {content.label}
    </span>
  );
}

// Readiness chip (UX §12.1; Phase 1 captions per 020B §3).
export function ReadinessChip({ state, caption }: { state: ReadinessState; caption?: string | null }) {
  const style =
    state === "ready"
      ? `bg-[var(--color-success)]/12 ${SUCCESS_TEXT}`
      : state === "at_risk"
        ? "bg-[var(--color-amber)]/20 text-[var(--color-espresso)]"
        : "bg-[var(--color-espresso)]/8 text-[var(--color-espresso)]";
  const glyph = state === "ready" ? "●" : state === "at_risk" ? "▲" : "○";
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span className={`${PILL} ${style}`}>
        <span aria-hidden="true">{glyph}</span> {READINESS_LABELS[state]}
      </span>
      {caption ? <span className="text-xs text-[var(--color-espresso)]/60">{caption}</span> : null}
    </span>
  );
}

// Workspace avatar (amber gradient initials, as the user menu) + optional "SMV" tag.
export function Avatar({ name, size = "md" }: { name: string | null; size?: "sm" | "md" }) {
  const dims = size === "sm" ? "h-6 w-6 text-[0.6rem]" : "h-8 w-8 text-xs";
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-amber),var(--color-orange))] font-semibold text-white ${dims}`}
    >
      {initials(name)}
    </span>
  );
}

// Gated action button (UXD-JW-17): stays focusable with aria-disabled and
// points at its reason through aria-describedby; the reason is shown as
// plain text beneath (never a link, UX-03).
export function GatedButton({
  id,
  label,
  onClick,
  disabledReason,
  busy = false,
  variant = "primary",
  className = "",
}: {
  id: string;
  label: ReactNode;
  onClick: () => void;
  disabledReason?: string | null;
  busy?: boolean;
  variant?: "primary" | "dark" | "secondary";
  className?: string;
}) {
  const disabled = Boolean(disabledReason) || busy;
  const reasonId = `${id}-reason`;
  const recipe = variant === "primary" ? BUTTON_PRIMARY : variant === "dark" ? BUTTON_DARK : BUTTON_SECONDARY;
  return (
    <span className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <button
        id={id}
        type="button"
        aria-disabled={disabled || undefined}
        aria-describedby={disabledReason ? reasonId : undefined}
        title={disabledReason ?? undefined}
        onClick={() => {
          if (!disabled) onClick();
        }}
        className={recipe}
      >
        {busy ? <Spinner /> : null}
        {label}
      </button>
      {disabledReason ? (
        <span id={reasonId} className="text-xs text-[var(--color-espresso)]/60">
          {disabledReason}
        </span>
      ) : null}
    </span>
  );
}

export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-[var(--radius-md)] bg-[var(--color-espresso)]/8 motion-reduce:animate-none ${className}`} />;
}

export function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs font-medium text-[var(--color-error)]">
      {message}
    </p>
  );
}
