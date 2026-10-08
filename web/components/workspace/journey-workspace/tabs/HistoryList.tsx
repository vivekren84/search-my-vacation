"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): one History entry list,
// used by the History tab and the Overview "Recent activity" panel (UX Rev
// 4a §21: glyph, plain-language title, actor, relative timestamp with the
// absolute time on hover, before → after where applicable).

import Link from "next/link";

import type { JourneyHistoryEntry } from "@/lib/workspace/journey-workspace/types";

import { actorLabel, describeHistoryEntry, type HistoryContext } from "../historyLabels";
import { formatTimestamp, relativeTime } from "../journeyWorkspaceLabels";

export default function HistoryList({ entries, ctx, compact = false }: { entries: JourneyHistoryEntry[]; ctx: HistoryContext; compact?: boolean }) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry, index) => {
        const described = describeHistoryEntry(entry, ctx);
        return (
          <li key={entry.id} className={`flex gap-3 ${index === 0 ? "" : "border-t border-[var(--color-border-warm)]/70"} ${compact ? "py-2.5" : "py-3"}`}>
            <span aria-hidden="true" className="mt-0.5 w-4 shrink-0 text-center text-sm text-[var(--color-amber)]">
              {described.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[var(--color-espresso)]">{described.title}</p>
              {described.details.map((line) => (
                <p key={line} className="text-xs text-[var(--color-espresso)]/70">
                  {line}
                </p>
              ))}
              {described.link ? (
                <Link href={described.link.href} className="text-xs font-semibold text-[var(--color-espresso)] underline underline-offset-2">
                  {described.link.label}
                </Link>
              ) : null}
              <p className="mt-0.5 text-xs text-[var(--color-espresso)]/55">
                {actorLabel(entry)} ·{" "}
                <time dateTime={entry.createdAt} title={formatTimestamp(entry.createdAt)}>
                  {relativeTime(entry.createdAt)}
                </time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
