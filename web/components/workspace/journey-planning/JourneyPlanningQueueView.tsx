"use client";

// EBC-R1.3-WS12-007 Phase 5: Journey Planning UI — Queue (WS12-004 UX
// screen JP-01). Workspace-native table/markup only (DEC-R1.3-014
// Workspace Component Principle — no external grid/table library).
//
// Client component calling the Phase 4 API routes directly, matching the
// pattern already established by app/workspace/reset-password/page.tsx
// (a "use client" page calling Workspace auth functions client-side)
// rather than inventing a second data-fetching convention for this module.

import Link from "next/link";
import { useEffect, useState } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import { WORKSPACE_JOURNEY_PLANNING_PATH } from "@/lib/workspace/shared/constants";
import type { JourneyPlanningRecord, JourneyPlanningStage } from "@/lib/workspace/journey-planning/types";

import { STAGE_LABELS } from "./journeyPlanningLabels";

const STAGE_FILTER_OPTIONS: Array<{ value: JourneyPlanningStage | ""; label: string }> = [
  { value: "", label: "All stages" },
  ...(Object.keys(STAGE_LABELS) as JourneyPlanningStage[]).map((stage) => ({
    value: stage,
    label: STAGE_LABELS[stage],
  })),
];

type QueueState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; records: JourneyPlanningRecord[] };

export default function JourneyPlanningQueueView({ currentUserId }: { currentUserId: string }) {
  const [stageFilter, setStageFilter] = useState<JourneyPlanningStage | "">("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [state, setState] = useState<QueueState>({ status: "loading" });
  const [claimingId, setClaimingId] = useState<string | null>(null);

  async function loadQueue() {
    setState({ status: "loading" });
    const params = new URLSearchParams();
    if (stageFilter) params.set("stage", stageFilter);
    if (unassignedOnly) params.set("unassignedOnly", "true");

    try {
      const response = await fetch(`/api/workspace/journey-planning?${params.toString()}`, {
        cache: "no-store",
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setState({ status: "error", message: body.message ?? "Could not load the queue." });
        return;
      }
      setState({ status: "ready", records: body.records as JourneyPlanningRecord[] });
    } catch {
      setState({ status: "error", message: "Could not reach the Workspace API." });
    }
  }

  useEffect(() => {
    async function run() {
      await loadQueue();
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageFilter, unassignedOnly]);

  async function handleClaim(recordId: string) {
    setClaimingId(recordId);
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}/claim`, { method: "POST" });
      if (response.ok) {
        await loadQueue();
      }
    } finally {
      setClaimingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[var(--color-espresso)]">
            Stage
            <select
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value as JourneyPlanningStage | "")}
              className="rounded border border-[var(--color-border-warm)] px-2 py-1 text-sm"
            >
              {STAGE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--color-espresso)]">
            <input
              type="checkbox"
              checked={unassignedOnly}
              onChange={(event) => setUnassignedOnly(event.target.checked)}
            />
            Unassigned only
          </label>
        </div>
        <Link
          href={`${WORKSPACE_JOURNEY_PLANNING_PATH}/new`}
          className="rounded-full bg-[var(--color-amber)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[#e88a16]"
        >
          New Record
        </Link>
      </div>

      {state.status === "loading" ? (
        <p className="text-sm text-[var(--color-espresso)]/60">Loading…</p>
      ) : null}

      {state.status === "error" ? (
        <EmptyState title="Could not load the queue" description={state.message} />
      ) : null}

      {state.status === "ready" && state.records.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="No Journey Planning records match these filters."
        />
      ) : null}

      {state.status === "ready" && state.records.length > 0 ? (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-warm)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-cream)] text-xs uppercase tracking-wide text-[var(--color-espresso)]/60">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {state.records.map((record) => (
                <tr key={record.id} className="border-t border-[var(--color-border-warm)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`${WORKSPACE_JOURNEY_PLANNING_PATH}/${record.id}`}
                      className="font-semibold text-[var(--color-espresso)] hover:underline"
                    >
                      {record.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{STAGE_LABELS[record.stage]}</td>
                  <td className="px-4 py-3 text-[var(--color-espresso)]/70">
                    {record.ownerId ? (record.ownerId === currentUserId ? "You" : record.ownerId) : "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-espresso)]/60">
                    {new Date(record.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!record.ownerId ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(record.id)}
                        disabled={claimingId === record.id}
                        className="rounded-full border border-[var(--color-amber)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)] transition hover:bg-[var(--color-amber)]/10 disabled:opacity-50"
                      >
                        {claimingId === record.id ? "Claiming…" : "Claim"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
