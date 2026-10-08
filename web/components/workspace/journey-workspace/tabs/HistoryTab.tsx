"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): JW-08 Journey History
// (UX Rev 4a §21; FR-JW-02, FR-JW-30; EBC-R1.3-WS13-020B S-6 labels and
// Phase 1 filter chips; Archie EBC-R1.3-WS13-023A SR-11). Reverse-
// chronological, read-only for every role, pages of 50 with "Load earlier
// events". Pinned at the top: supersession links and the originating
// Journey Planning record.

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { WORKSPACE_JOURNEY_WORKSPACE_PATH } from "@/lib/workspace/shared/constants";
import type { JourneyDetail, JourneyHistoryEntry, JourneyHistoryFilter, JourneyHistoryPage } from "@/lib/workspace/journey-workspace/types";

import type { HistoryContext } from "../historyLabels";
import { callJourneyApi } from "../journeyApi";
import { BUTTON_SECONDARY, CARD, Skeleton, Spinner } from "../primitives";
import HistoryList from "./HistoryList";

const FILTERS: Array<{ value: JourneyHistoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "stage_status", label: "Stage & status" },
  { value: "ownership", label: "Ownership" },
  { value: "contact_category", label: "Contact & category" },
];

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; entries: JourneyHistoryEntry[]; hasMore: boolean; nextBefore: string | null; loadingMore: boolean };

export default function HistoryTab({ detail, ctx, reloadToken }: { detail: JourneyDetail; ctx: HistoryContext; reloadToken: number }) {
  const [filter, setFilter] = useState<JourneyHistoryFilter>("all");
  const [retry, setRetry] = useState(0);
  // Keyed by filter, reload and retry: a new key shows the loading state
  // without a synchronous setState in the effect (react-hooks/set-state-in-effect).
  const loadKey = `${filter}:${reloadToken}:${retry}`;
  const [loaded, setLoaded] = useState<{ key: string; state: State } | null>(null);
  const state: State = loaded?.key === loadKey ? loaded.state : { status: "loading" };
  const setState = (next: State) => setLoaded({ key: loadKey, state: next });
  const journeyId = detail.journey.id;

  const fetchPage = useCallback(
    (before: string | null) => {
      const params = new URLSearchParams({ filter });
      if (before) params.set("before", before);
      return callJourneyApi<{ history: JourneyHistoryPage }>(`/api/workspace/journey-workspace/${journeyId}/history?${params}`);
    },
    [filter, journeyId],
  );

  useEffect(() => {
    let cancelled = false;
    void fetchPage(null).then((result) => {
      if (cancelled) return;
      setLoaded({ key: loadKey, state: result.ok ? { status: "ready", ...result.data.history, loadingMore: false } : { status: "error" } });
    });
    return () => {
      cancelled = true;
    };
  }, [fetchPage, loadKey]);

  async function loadMore() {
    if (state.status !== "ready" || !state.nextBefore || state.loadingMore) return;
    setState({ ...state, loadingMore: true });
    const result = await fetchPage(state.nextBefore);
    if (!result.ok) {
      setState({ ...state, loadingMore: false });
      return;
    }
    setState({
      status: "ready",
      entries: [...state.entries, ...result.data.history.entries],
      hasMore: result.data.history.hasMore,
      nextBefore: result.data.history.nextBefore,
      loadingMore: false,
    });
  }

  const pins: Array<{ key: string; node: ReactNode }> = [];
  if (detail.supersededBy) {
    pins.push({
      key: "superseded-by",
      node: (
        <>
          Superseded by{" "}
          <Link href={`${WORKSPACE_JOURNEY_WORKSPACE_PATH}/${detail.supersededBy.id}`} className="font-semibold underline underline-offset-2">
            {detail.supersededBy.journeyReference}
          </Link>
        </>
      ),
    });
  }
  if (detail.supersedes) {
    pins.push({
      key: "supersedes",
      node: (
        <>
          Replaces{" "}
          <Link href={`${WORKSPACE_JOURNEY_WORKSPACE_PATH}/${detail.supersedes.id}`} className="font-semibold underline underline-offset-2">
            {detail.supersedes.journeyReference}
          </Link>
        </>
      ),
    });
  }
  if (detail.planningRecord) {
    pins.push({
      key: "planning",
      node: (
        <>
          Created from Journey Planning record{" "}
          <Link href={ctx.planningRecordHref(detail.planningRecord.id)} className="font-semibold underline underline-offset-2">
            {detail.planningRecord.title} ↗
          </Link>{" "}
          <span className="text-[var(--color-espresso)]/60">(planning history lives there)</span>
        </>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {pins.length > 0 ? (
        <ul className={`${CARD} flex flex-col gap-1.5 px-4 py-3 text-sm text-[var(--color-espresso)]`}>
          {pins.map((pin) => (
            <li key={pin.key} className="flex gap-2">
              <span aria-hidden="true" className="text-[var(--color-espresso)]/50">
                ⌁
              </span>
              <span>{pin.node}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div role="group" aria-label="Filter history" className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-[var(--color-amber)] bg-[linear-gradient(135deg,rgb(245_149_28_/_14%),rgb(40_3_54_/_6%))] text-[var(--color-espresso)]"
                  : "border-[var(--color-border-warm)] bg-white text-[var(--color-espresso)]/75 hover:bg-[rgb(245_149_28_/_8%)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <section className={`${CARD} px-4 py-1`} aria-label="Journey history" aria-busy={state.status === "loading" || undefined}>
        {state.status === "loading" ? (
          <div className="flex flex-col gap-3 py-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : state.status === "error" ? (
          <p className="py-4 text-sm text-[var(--color-espresso)]">
            Couldn&apos;t load History.{" "}
            <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setRetry((n) => n + 1)}>
              Try again
            </button>
          </p>
        ) : state.entries.length === 0 ? (
          <p className="py-4 text-sm text-[var(--color-espresso)]/65">No events of this kind yet.</p>
        ) : (
          <HistoryList entries={state.entries} ctx={ctx} />
        )}
      </section>

      {state.status === "ready" && state.hasMore ? (
        <div>
          <button type="button" className={BUTTON_SECONDARY} onClick={loadMore} aria-disabled={state.loadingMore || undefined}>
            {state.loadingMore ? <Spinner /> : null}
            Load earlier events
          </button>
        </div>
      ) : null}
    </div>
  );
}
