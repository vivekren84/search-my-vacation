"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): JW-02 Overview (UX Rev
// 4a §8.2 with EBC-R1.3-WS13-020B C-02, C-03 and §3). Main column: Next
// step card, readiness summary and the last five History events. Context
// rail: Journey facts only. Vendor Bookings, Documents and Tasks summaries
// are hidden in Phase 1 (C-02, C-03).

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import type { JourneyActionKind, JourneyDetail, JourneyHistoryEntry, JourneyHistoryPage } from "@/lib/workspace/journey-workspace/types";

import type { HistoryContext } from "../historyLabels";
import { callJourneyApi } from "../journeyApi";
import { actionLabel, formatMonthYear, pluralise } from "../journeyWorkspaceLabels";
import { BUTTON_PRIMARY, CARD, ReadinessChip, SECTION_TITLE, Skeleton } from "../primitives";
import type { NextStep } from "../journey/nextStep";
import { partyDisplayName } from "../journey/PeopleCards";
import HistoryList from "./HistoryList";

export default function OverviewTab({
  detail,
  nextStep,
  ctx,
  reloadToken,
  onAction,
  onViewHistory,
  planningRecordHref,
}: {
  detail: JourneyDetail;
  nextStep: NextStep;
  ctx: HistoryContext;
  reloadToken: number;
  onAction: (kind: JourneyActionKind) => void;
  onViewHistory: () => void;
  planningRecordHref: string | null;
}) {
  const { journey, summary } = detail;
  // Keyed by Journey and reload so a reload shows the loading state without
  // a synchronous setState in the effect (react-hooks/set-state-in-effect).
  const recentKey = `${journey.id}:${reloadToken}`;
  const [loaded, setLoaded] = useState<{ key: string; value: JourneyHistoryEntry[] | "error" } | null>(null);
  const recent = loaded?.key === recentKey ? loaded.value : null;

  useEffect(() => {
    let cancelled = false;
    void callJourneyApi<{ history: JourneyHistoryPage }>(`/api/workspace/journey-workspace/${journey.id}/history?filter=all`).then((result) => {
      if (!cancelled) setLoaded({ key: recentKey, value: result.ok ? result.data.history.entries.slice(0, 5) : "error" });
    });
    return () => {
      cancelled = true;
    };
  }, [journey.id, recentKey]);

  const hasTemplate = journey.readinessTemplateId !== null;
  const noItems = hasTemplate && summary.readinessMandatoryTotal === 0;
  const readinessCaption = !hasTemplate ? "No template yet" : noItems ? "No checklist items yet" : null;

  const facts: Array<{ label: string; value: ReactNode }> = [
    { label: "Reference", value: journey.journeyReference },
    { label: detail.party.kind === "corporate" ? "Corporate Point of Contact" : "Traveller", value: detail.party.kind === "corporate" ? (detail.party.name ?? "—") : partyDisplayName(detail) },
  ];
  if (detail.party.kind === "corporate" && detail.party.companyName) facts.push({ label: "Organisation", value: detail.party.companyName });
  if (detail.planningRecord && planningRecordHref) {
    facts.push({
      label: "Journey Planning record",
      value: (
        <Link href={planningRecordHref} className="font-semibold underline underline-offset-2">
          {detail.planningRecord.title} ↗
        </Link>
      ),
    });
    if (detail.planningRecord.intendedTravelMonth) {
      facts.push({
        label: "Intended travel month",
        value: (
          <>
            {formatMonthYear(detail.planningRecord.intendedTravelMonth)} <span className="text-[var(--color-espresso)]/55">(for reference only)</span>
          </>
        ),
      });
    }
  }
  const party = [
    journey.adults !== null ? pluralise(journey.adults, "adult") : null,
    journey.children !== null ? pluralise(journey.children, "child", "children") : null,
    journey.infants !== null ? pluralise(journey.infants, "infant") : null,
  ].filter(Boolean);
  if (party.length > 0) facts.push({ label: "Travellers", value: party.join(" · ") });
  if (journey.nights !== null) facts.push({ label: "Nights", value: String(journey.nights) });
  if (journey.departureCity) facts.push({ label: "Departure city", value: journey.departureCity });
  if (journey.acceptedProposalVersionId && planningRecordHref) {
    facts.push({
      label: "Accepted proposal",
      value: (
        <Link href={planningRecordHref} className="font-semibold underline underline-offset-2">
          View on the planning record ↗
        </Link>
      ),
    });
  }
  if (detail.supersedes) {
    facts.push({
      label: "Replaces",
      value: (
        <Link href={`/workspace/journey-workspace/${detail.supersedes.id}`} className="font-semibold underline underline-offset-2">
          {detail.supersedes.journeyReference} ↗
        </Link>
      ),
    });
  }
  if (detail.supersededBy) {
    facts.push({
      label: "Superseded by",
      value: (
        <Link href={`/workspace/journey-workspace/${detail.supersededBy.id}`} className="font-semibold underline underline-offset-2">
          {detail.supersededBy.journeyReference} ↗
        </Link>
      ),
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <section className={`${CARD} px-5 py-4`} aria-labelledby="next-step-heading">
          <h2 id="next-step-heading" className={SECTION_TITLE}>
            Next step
          </h2>
          <p className="mt-2 text-sm text-[var(--color-espresso)]">{nextStep.sentence}</p>
          {nextStep.action ? (
            <button type="button" className={`${BUTTON_PRIMARY} mt-3`} onClick={() => onAction(nextStep.action as JourneyActionKind)}>
              {actionLabel(nextStep.action, journey.stage)}
            </button>
          ) : null}
        </section>

        <section className={`${CARD} px-5 py-4`} aria-labelledby="readiness-heading">
          <h2 id="readiness-heading" className={SECTION_TITLE}>
            Readiness
          </h2>
          <div className="mt-2">
            <ReadinessChip state={summary.readinessState} caption={readinessCaption} />
          </div>
          {noItems ? (
            <p className="mt-2 text-sm text-[var(--color-espresso)]/75">
              This Journey&apos;s readiness template doesn&apos;t have any items yet. Readiness checks start when templates are filled in.
            </p>
          ) : hasTemplate && summary.readinessMandatoryTotal > 0 ? (
            <p className="mt-2 text-sm text-[var(--color-espresso)]/75">
              {summary.readinessMandatoryUnresolved === 0
                ? `All ${pluralise(summary.readinessMandatoryTotal, "mandatory item")} resolved.`
                : `${pluralise(summary.readinessMandatoryUnresolved, "mandatory item")} outstanding of ${summary.readinessMandatoryTotal}.`}
            </p>
          ) : null}
          {detail.readinessTemplate ? (
            <p className="mt-2 text-xs text-[var(--color-espresso)]/60">Template: {detail.readinessTemplate.name}</p>
          ) : null}
        </section>

        <section className={`${CARD} px-5 py-4`} aria-labelledby="recent-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="recent-heading" className={SECTION_TITLE}>
              Recent activity
            </h2>
            <button type="button" onClick={onViewHistory} className="text-xs font-semibold text-[var(--color-espresso)] underline underline-offset-2">
              View history
            </button>
          </div>
          {recent === null ? (
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : recent === "error" ? (
            <p className="mt-2 text-sm text-[var(--color-espresso)]/70">Couldn&apos;t load recent activity.</p>
          ) : recent.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-espresso)]/65">Nothing recorded yet.</p>
          ) : (
            <div className="mt-1">
              <HistoryList entries={recent} ctx={ctx} compact />
            </div>
          )}
        </section>
      </div>

      <aside className={`${CARD} h-fit px-5 py-4`} aria-labelledby="facts-heading">
        <h2 id="facts-heading" className={SECTION_TITLE}>
          Journey facts
        </h2>
        <dl className="mt-3 flex flex-col gap-3 text-sm">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs text-[var(--color-espresso)]/60">{fact.label}</dt>
              <dd className="mt-0.5 break-words text-[var(--color-espresso)]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
