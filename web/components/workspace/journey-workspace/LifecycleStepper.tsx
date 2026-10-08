"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.8): the seven-step
// lifecycle stepper (UX Rev 4a §9.1, §9.2; UXD-JW-04). An ordered list with
// aria-current="step"; Done / Current / Future states; a lock glyph on the
// next connector while its gate is unmet; On Hold greys the current step
// with a pause glyph; Cancelled and Superseded replace the last step with
// an end-cap. Below 1024 px it collapses to "Stage n of 7 · Name" with a
// thin progress bar and the full list on tap.

import { JOURNEY_STAGES, type JourneyOutcome, type JourneyStage } from "@/lib/workspace/journey-workspace/types";

import { formatDayMonth, JOURNEY_STAGE_LABELS } from "./journeyWorkspaceLabels";

type StepState = "done" | "current" | "future";

export interface LifecycleStepperProps {
  stage: JourneyStage;
  outcome: JourneyOutcome | null;
  onHold: boolean;
  stageChangedAt: string;
  // Date each stage was reached, from History (stage_status events).
  reachedOn: Partial<Record<JourneyStage, string>>;
  gateNote: string | null;
}

export default function LifecycleStepper({ stage, outcome, onHold, stageChangedAt, reachedOn, gateNote }: LifecycleStepperProps) {
  const currentIndex = JOURNEY_STAGES.indexOf(stage);
  const completed = stage === "journey_closed";
  const endCap = outcome === "cancelled" ? { glyph: "✕", label: "Cancelled" } : outcome === "superseded" ? { glyph: "⇢", label: "Superseded" } : null;

  const steps = JOURNEY_STAGES.map((value, index) => {
    let state: StepState = index < currentIndex ? "done" : index === currentIndex ? "current" : "future";
    if (completed) state = "done";
    return { value, index, state };
  });
  // The final "Completed" step is replaced by the end-cap for Cancelled / Superseded.
  const visible = endCap ? steps.slice(0, -1) : steps;
  const position = Math.min(currentIndex + 1, 7);
  const currentLabel = endCap ? endCap.label : JOURNEY_STAGE_LABELS[stage];

  const list = (
    <ol className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-0" aria-label="Journey lifecycle">
      {visible.map((step, i) => {
        const isCurrent = step.state === "current" && !endCap;
        const held = isCurrent && onHold;
        const nextLocked = step.state === "current" && Boolean(gateNote) && !onHold && !endCap;
        const date =
          step.state === "done"
            ? (reachedOn[step.value] ?? null)
            : isCurrent
              ? stageChangedAt
              : null;
        return (
          <li key={step.value} className="flex items-start gap-3 lg:flex-1 lg:flex-col lg:items-center lg:gap-1.5 lg:text-center" aria-current={isCurrent ? "step" : undefined}>
            <div className="flex items-center lg:w-full">
              <span aria-hidden="true" className={`hidden h-px flex-1 lg:block ${i === 0 ? "invisible" : connectorClass(step.state)}`} />
              <StepDot state={step.state} held={held} frozen={Boolean(endCap) && step.index === currentIndex} />
              <span
                aria-hidden="true"
                className={`relative hidden h-px flex-1 lg:block ${i === visible.length - 1 && !endCap ? "invisible" : connectorClass(steps[step.index + 1]?.state ?? "future", held)}`}
              >
                {nextLocked ? (
                  <span title={`Needs: ${gateNote}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5 text-[var(--color-espresso)]/60">
                    <LockGlyph />
                  </span>
                ) : null}
              </span>
            </div>
            <div className="lg:px-1">
              <span className="sr-only">
                Step {step.index + 1} of 7,{" "}
              </span>
              <span
                className={`block text-xs ${
                  isCurrent ? "font-bold text-[var(--color-espresso)]" : step.state === "done" ? "font-semibold text-[var(--color-espresso)]/80" : "text-[var(--color-espresso)]/45"
                }`}
              >
                {JOURNEY_STAGE_LABELS[step.value]}
              </span>
              <span className="sr-only">{isCurrent ? (held ? ", current, on hold" : ", current") : step.state === "done" ? ", done" : ""}</span>
              {isCurrent ? (
                <span className="block text-[0.65rem] uppercase tracking-wide text-[var(--color-espresso)]/55">
                  {held ? "On hold" : "Now"}
                  {date ? ` · since ${formatDayMonth(date)}` : ""}
                </span>
              ) : date ? (
                <span className="block text-[0.65rem] text-[var(--color-espresso)]/50">{formatDayMonth(date)}</span>
              ) : null}
              {nextLocked ? <span className="sr-only">. Next step needs: {gateNote}</span> : null}
            </div>
          </li>
        );
      })}
      {endCap ? (
        <li className="flex items-start gap-3 lg:flex-1 lg:flex-col lg:items-center lg:gap-1.5 lg:text-center" aria-current="step">
          <div className="flex items-center lg:w-full">
            <span aria-hidden="true" className="hidden h-px flex-1 border-t border-dashed border-[var(--color-espresso)]/30 lg:block" />
            <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--color-espresso)]/40 bg-white text-xs text-[var(--color-espresso)]/80">
              {endCap.glyph}
            </span>
            <span aria-hidden="true" className="invisible hidden h-px flex-1 lg:block" />
          </div>
          <span className="block text-xs font-bold text-[var(--color-espresso)]">
            {endCap.label}
            <span className="sr-only">, outcome</span>
          </span>
        </li>
      ) : null}
    </ol>
  );

  return (
    <div>
      <div className="hidden lg:block">{list}</div>
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none flex-col gap-1.5 rounded-[var(--radius-md)] py-1 [&::-webkit-details-marker]:hidden">
          <span className="text-xs font-semibold text-[var(--color-espresso)]">
            {endCap ? `${endCap.label} · stopped at ${JOURNEY_STAGE_LABELS[stage]}` : `Stage ${position} of 7 · ${currentLabel}`}
            {onHold && !endCap ? " · On hold" : ""}
            <span className="ml-2 font-normal text-[var(--color-espresso)]/50 group-open:hidden">Show all stages</span>
            <span className="ml-2 hidden font-normal text-[var(--color-espresso)]/50 group-open:inline">Hide stages</span>
          </span>
          <span aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-espresso)]/10">
            <span className="block h-full rounded-full bg-[var(--color-amber)]" style={{ width: `${(completed ? 7 : position) * (100 / 7)}%` }} />
          </span>
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    </div>
  );
}

function connectorClass(nextState: StepState, held = false): string {
  if (held) return "border-t border-dashed border-[var(--color-espresso)]/25";
  return nextState === "done" || nextState === "current" ? "bg-[var(--color-amber)]" : "border-t border-dotted border-[var(--color-espresso)]/30";
}

function StepDot({ state, held, frozen }: { state: StepState; held: boolean; frozen: boolean }) {
  if (state === "done") {
    return (
      <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-amber),var(--color-orange))] text-[0.7rem] font-bold text-white">
        ✓
      </span>
    );
  }
  if (state === "current") {
    return (
      <span
        aria-hidden="true"
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 bg-white ${
          held || frozen ? "border-[var(--color-espresso)]/35" : "border-[var(--color-primary)]"
        }`}
      >
        {held ? (
          <span className="text-[0.6rem] text-[var(--color-espresso)]/60">⏸</span>
        ) : (
          <span className={`h-2.5 w-2.5 rounded-full ${frozen ? "bg-[var(--color-espresso)]/35" : "bg-[var(--color-amber)]"}`} />
        )}
      </span>
    );
  }
  return <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded-full border-2 border-[var(--color-espresso)]/20 bg-white" />;
}

// Inline-SVG convention (UX §22: no icon library).
function LockGlyph() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <rect x="1" y="5" width="8" height="6.5" rx="1.2" fill="currentColor" />
      <path d="M2.8 5V3.6a2.2 2.2 0 0 1 4.4 0V5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
