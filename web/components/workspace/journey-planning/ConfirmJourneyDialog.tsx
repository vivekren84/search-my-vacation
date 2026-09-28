"use client";

// EBC-R1.3-WS13-005 Phase 0 (CM-01, CM-05, CM-07, PD-A; UX Rev 4a §36.3,
// UXA-01; closes UXO-11 (a)): the Confirmed-outcome dialog of the Journey
// Planning Decision (JP-13).
//
// * Editable here: only the Confirmed Travel Start and End Dates (the
//   Decision request carries only the dates, WS13-004 §8.1).
// * Number of Nights and Service Category are shown as values, each with an
//   "Edit" link to Trip Basics; no new request field.
// * Validation runs as the user types and shows one message per field,
//   all at once (PRA-01 precedent), using the same
//   getConversionPrerequisiteIssues() the server runs first. The
//   conversion RPC stays the control; server issues are shown the same way.
// * "Confirm & create Journey" stays aria-disabled (focusable, reason via
//   aria-describedby, UXD-JW-17) while any message is present.
// * Replacement records: dates pre-filled from the original Journey,
//   labelled "Pre-filled from JRN-····" (WS13-004A AC-01, UX §36.4).
//
// Accessibility: role="dialog" + aria-modal, labelled by its title, focus
// moves to the first date field on open, Escape and Cancel close it and
// return focus to the trigger (handled by the caller), Tab stays inside.

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import {
  getConversionPrerequisiteIssues,
  type JourneyPlanningFieldIssue,
} from "@/lib/workspace/journey-planning/validation";

export interface ConfirmJourneyDialogProps {
  ownerId: string | null;
  ownerLabel: string;
  nights: number | null;
  serviceCategory: string | null;
  serviceCategoryLabel: string | null;
  replacement: { journeyReference: string; confirmedStartDate: string | null; confirmedEndDate: string | null } | null;
  busy: boolean;
  serverIssues: JourneyPlanningFieldIssue[];
  onCancel: () => void;
  onConfirm: (dates: { confirmedStartDate: string; confirmedEndDate: string }) => void;
  onEditTripBasics: () => void;
}

const FIELD_ORDER = ["confirmedDates", "nights", "serviceCategory", "ownerId", "replacement"];

export default function ConfirmJourneyDialog({
  ownerId,
  ownerLabel,
  nights,
  serviceCategory,
  serviceCategoryLabel,
  replacement,
  busy,
  serverIssues,
  onCancel,
  onConfirm,
  onEditTripBasics,
}: ConfirmJourneyDialogProps) {
  const [startDate, setStartDate] = useState(replacement?.confirmedStartDate ?? "");
  const [endDate, setEndDate] = useState(replacement?.confirmedEndDate ?? "");
  const [datesEdited, setDatesEdited] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startRef.current?.focus();
  }, []);

  const clientIssues = useMemo(
    () =>
      getConversionPrerequisiteIssues({
        ownerId,
        nights,
        serviceCategory,
        confirmedStartDate: startDate || undefined,
        confirmedEndDate: endDate || undefined,
      }),
    [ownerId, nights, serviceCategory, startDate, endDate],
  );

  // Client issues reflect the current input; server issues are shown until
  // the user changes something, then the client check takes over again.
  const issues = datesEdited || serverIssues.length === 0 ? clientIssues : mergeIssues(clientIssues, serverIssues);
  const blocked = issues.length > 0;
  const issueFor = (field: string) => issues.filter((issue) => issue.field === field);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'input, button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function submit() {
    if (blocked || busy) return;
    onConfirm({ confirmedStartDate: startDate, confirmedEndDate: endDate });
  }

  const linkClass =
    "font-semibold text-[var(--color-espresso)] underline underline-offset-2 hover:text-[var(--color-espresso)]/70";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-journey-title"
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-6 shadow-[var(--shadow-sm)]"
      >
        <h2 id="confirm-journey-title" className="font-serif text-xl text-[var(--color-espresso)]">
          Confirm this Journey
        </h2>

        <div className="mt-4 flex flex-wrap gap-4">
          <label htmlFor="confirmJourney-start" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Confirmed travel start
            <input
              ref={startRef}
              id="confirmJourney-start"
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setDatesEdited(true);
              }}
              aria-describedby={issueFor("confirmedDates").length > 0 ? "confirmJourney-dates-issue" : undefined}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
          <label htmlFor="confirmJourney-end" className="flex flex-col gap-1 text-sm text-[var(--color-espresso)]">
            Confirmed travel end
            <input
              id="confirmJourney-end"
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setDatesEdited(true);
              }}
              aria-describedby={issueFor("confirmedDates").length > 0 ? "confirmJourney-dates-issue" : undefined}
              className="rounded border border-[var(--color-border-warm)] px-3 py-2"
            />
          </label>
        </div>
        {replacement && !datesEdited && (replacement.confirmedStartDate || replacement.confirmedEndDate) ? (
          <p className="mt-1 text-xs text-[var(--color-espresso)]/60">
            Pre-filled from {replacement.journeyReference} · edit if the dates have changed
          </p>
        ) : null}
        <IssueList id="confirmJourney-dates-issue" issues={issueFor("confirmedDates")} />

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-[var(--color-espresso)]">
          <dt className="text-[var(--color-espresso)]/60">Number of nights</dt>
          <dd>
            {nights ?? "Not set"}{" "}
            <span className="text-[var(--color-espresso)]/60">
              (from Trip Basics ·{" "}
              <button type="button" onClick={onEditTripBasics} className={linkClass}>
                Edit
              </button>
              )
            </span>
            <IssueList issues={issueFor("nights")} />
          </dd>

          <dt className="text-[var(--color-espresso)]/60">Service Category</dt>
          <dd>
            {serviceCategory ? (
              <>
                {serviceCategoryLabel ?? serviceCategory}{" "}
                <span className="text-[var(--color-espresso)]/60">
                  (from Trip Basics ·{" "}
                  <button type="button" onClick={onEditTripBasics} className={linkClass}>
                    Edit
                  </button>
                  )
                </span>
              </>
            ) : (
              <span className="text-[var(--color-espresso)]/60">Not set</span>
            )}
            {issueFor("serviceCategory").length > 0 ? (
              <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                {issueFor("serviceCategory")[0].message}{" "}
                <button type="button" onClick={onEditTripBasics} className={linkClass}>
                  Set in Trip Basics
                </button>
              </p>
            ) : null}
          </dd>

          <dt className="text-[var(--color-espresso)]/60">Journey Owner</dt>
          <dd>
            {ownerLabel}
            <IssueList issues={issueFor("ownerId")} />
          </dd>
        </dl>

        <IssueList issues={issueFor("replacement")} />

        <p className="mt-4 text-xs text-[var(--color-espresso)]/60">
          Creating the Journey can&apos;t be undone. Planning history stays on this record.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--color-border-warm)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            aria-disabled={blocked || busy}
            aria-describedby={blocked ? "confirmJourney-blocked-reason" : undefined}
            className="rounded-full bg-[var(--color-amber)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-[#e88a16] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            {busy ? "Creating…" : "Confirm & create Journey"}
          </button>
        </div>
        {blocked ? (
          <p id="confirmJourney-blocked-reason" className="sr-only">
            {issues.map((issue) => issue.message).join(" ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function IssueList({ issues, id }: { issues: JourneyPlanningFieldIssue[]; id?: string }) {
  if (issues.length === 0) return null;
  return (
    <ul id={id} className="mt-1 flex flex-col gap-0.5" role="alert">
      {issues.map((issue) => (
        <li key={`${issue.field}-${issue.code}`} className="text-xs text-[var(--color-error)]">
          {issue.message}
        </li>
      ))}
    </ul>
  );
}

function mergeIssues(
  client: JourneyPlanningFieldIssue[],
  server: JourneyPlanningFieldIssue[],
): JourneyPlanningFieldIssue[] {
  const merged = [...client];
  for (const issue of server) {
    if (!merged.some((existing) => existing.field === issue.field && existing.code === issue.code)) {
      merged.push(issue);
    }
  }
  return merged.sort((a, b) => FIELD_ORDER.indexOf(a.field) - FIELD_ORDER.indexOf(b.field));
}
