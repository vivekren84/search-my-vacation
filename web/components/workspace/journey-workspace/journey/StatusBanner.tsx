"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): status banners in the
// Journey header (UX Rev 4a §9.2, §16, §36.1; EBC-R1.3-WS13-020B C-06).
// Rendered from data: On Hold, Cancelled, Completed, Superseded, Archived
// and Incomplete legacy record. There is no alert banner in Phase 1, and
// no reminder threshold on the On Hold banner (alerts are Phase 3).
// Superseded uses an informational tone, never the Cancelled treatment
// (UXD-JW-05). Archived sits above any other banner.

import Link from "next/link";
import type { ReactNode } from "react";

import { WORKSPACE_JOURNEY_WORKSPACE_PATH } from "@/lib/workspace/shared/constants";
import type { JourneyDetail } from "@/lib/workspace/journey-workspace/types";

import { daysBetweenDates, formatDate, formatDayMonth, pluralise } from "../journeyWorkspaceLabels";

export interface StatusBannerFacts {
  cancelledOn: string | null;
  cancelledBy: string | null;
  archivedByName: string | null;
}

const BASE = "rounded-[var(--radius-lg)] px-4 py-3 text-sm text-[var(--color-espresso)]";

export default function StatusBanners({
  detail,
  facts,
  isAdministrator,
}: {
  detail: JourneyDetail;
  facts: StatusBannerFacts;
  isAdministrator: boolean;
}) {
  const { journey, today } = detail;
  const banners: Array<{ key: string; node: ReactNode }> = [];

  if (journey.archivedAt) {
    banners.push({
      key: "archived",
      node: (
        <div className={`${BASE} border border-dashed border-[var(--color-espresso)]/35 bg-white`}>
          <span aria-hidden="true">▣ </span>
          Archived on {formatDate(journey.archivedAt)}
          {facts.archivedByName ? ` by ${facts.archivedByName}` : ""}
          {journey.archiveReason ? ` · Reason: ${journey.archiveReason}` : ""} · Stage and outcome are unchanged. Archived Journeys can&apos;t be
          restored in this release.
        </div>
      ),
    });
  }

  if (journey.adoptionStatus === "legacy_pending") {
    banners.push({
      key: "legacy",
      node: (
        <div className={`${BASE} border border-dashed border-[var(--color-espresso)]/35 bg-white`}>
          <p className="font-semibold">
            <span aria-hidden="true">◌ </span>Incomplete legacy record
          </p>
          <p className="mt-0.5 text-[var(--color-espresso)]/75">
            {isAdministrator ? "Complete adoption to move this Journey to Confirmed." : "Awaiting adoption by an Administrator."}
          </p>
        </div>
      ),
    });
  }

  if (journey.outcome === "superseded") {
    banners.push({
      key: "superseded",
      node: (
        <div className={`${BASE} border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/6`}>
          This Journey was replaced after a material change.
          {detail.supersededBy ? (
            <>
              {" "}
              Superseded by {detail.supersededBy.journeyReference}
              {journey.closedAt ? ` on ${formatDayMonth(journey.closedAt)}` : ""}
              {journey.outcomeReason ? ` · Reason: ${journey.outcomeReason}` : ""} ·{" "}
              <Link href={`${WORKSPACE_JOURNEY_WORKSPACE_PATH}/${detail.supersededBy.id}`} className="font-semibold underline underline-offset-2">
                Open replacement Journey →
              </Link>
            </>
          ) : null}
        </div>
      ),
    });
  } else if (journey.outcome === "cancelled") {
    const when = facts.cancelledOn ?? journey.closedAt;
    banners.push({
      key: "cancelled",
      node: (
        <div className={`${BASE} border border-[var(--color-espresso)]/20 bg-[var(--color-espresso)]/4`}>
          <span aria-hidden="true">✕ </span>
          Cancelled{when ? ` on ${formatDayMonth(when)}` : ""}
          {facts.cancelledBy ? ` by ${facts.cancelledBy}` : ""}
          {journey.outcomeReason ? ` · Reason: ${journey.outcomeReason}` : ""}
        </div>
      ),
    });
  } else if (journey.stage === "journey_closed") {
    banners.push({
      key: "completed",
      node: (
        <div className={`${BASE} border border-[var(--color-success)]/30 bg-[var(--color-success)]/8`}>
          <span aria-hidden="true">✓ </span>
          Completed{journey.closedAt ? ` on ${formatDayMonth(journey.closedAt)}` : ""}. Everything here is kept as a permanent record.
        </div>
      ),
    });
  } else if (journey.onHold) {
    const days = journey.onHoldSince ? daysBetweenDates(journey.onHoldSince.slice(0, 10), today) : null;
    banners.push({
      key: "on-hold",
      node: (
        <div className={`${BASE} border border-[var(--color-amber)]/60 bg-white`}>
          <span aria-hidden="true">⏸ </span>
          On hold{journey.onHoldSince ? ` since ${formatDayMonth(journey.onHoldSince)}` : ""}
          {journey.onHoldReason ? ` · Reason: ${journey.onHoldReason}` : ""}
          {days !== null && days > 0 ? ` · ${pluralise(days, "day")}` : ""}
        </div>
      ),
    });
  }

  if (banners.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" role="status">
      {banners.map((banner) => (
        <div key={banner.key}>{banner.node}</div>
      ))}
    </div>
  );
}
