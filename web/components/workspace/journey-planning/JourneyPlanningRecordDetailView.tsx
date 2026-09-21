"use client";

// EBC-R1.3-WS12-007 Phase 5/6: Journey Planning UI + Proposal Management —
// Record Detail (WS12-004 UX screens JP-02 Overview, JP-04 Discovery,
// JP-05 Proposal Workspace, JP-06 Vendor Quotations, JP-07 Version
// History, JP-13 Decision), combined into one detail view rather than
// separate routed screens for this MVP vertical slice — disclosed in the
// WS12-007 Known Limitations as a scope simplification, not a UX
// redesign: all the same actions are present, just on one page instead of
// a tabbed multi-route layout.
//
// Known limitation: the proposal-version "itinerary" form only captures a
// SINGLE destination per version (name/nights/notes) plus an optional
// price estimate, not a full multi-destination itinerary builder — Itinerary
// Studio (WS15) does not exist yet, and DEC-R1.3-014 only mandates that
// each version's snapshot be immutable and versioned, not what the
// snapshot's authoring UI looks like. The stored ItinerarySnapshot shape
// itself already supports multiple destinations (types.ts) for whenever a
// richer authoring surface is built.

import { useEffect, useState } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import type {
  JourneyPlanningOutcome,
  JourneyPlanningStage,
  PlanningActivityType,
} from "@/lib/workspace/journey-planning/types";
import { JOURNEY_PLANNING_ALLOWED_TRANSITIONS } from "@/lib/workspace/journey-planning/types";

import { OUTCOME_LABELS, STAGE_LABELS } from "./journeyPlanningLabels";

interface DetailResponse {
  ok: boolean;
  record: {
    id: string;
    title: string;
    stage: JourneyPlanningStage;
    outcome: JourneyPlanningOutcome | null;
    ownerId: string | null;
    destinationRegion: string | null;
    recordKind: "individual" | "corporate";
    updatedAt: string;
  };
  proposal: { id: string; currentVersionId: string | null } | null;
  proposalVersions: Array<{
    id: string;
    versionNumber: number;
    summary: string | null;
    createdAt: string;
    itinerarySnapshot: {
      destinations: Array<{ name: string; nights: number; notes: string | null }>;
      priceEstimate: { amount: number; currency: string } | null;
    };
  }>;
  activities: Array<{ id: string; activityType: PlanningActivityType; content: string; createdAt: string }>;
  vendorQuotations: Array<{
    id: string;
    vendorId: string;
    quotationAmount: number | null;
    currency: string | null;
    status: string;
    createdAt: string;
  }>;
}

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: DetailResponse };

export default function JourneyPlanningRecordDetailView({
  recordId,
  currentUserId,
}: {
  recordId: string;
  currentUserId: string;
}) {
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [nights, setNights] = useState("1");
  const [itineraryNotes, setItineraryNotes] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");

  async function load() {
    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}`, { cache: "no-store" });
      const body = (await response.json()) as DetailResponse & { message?: string };
      if (!response.ok || !body.ok) {
        setState({ status: "error", message: body.message ?? "Could not load this record." });
        return;
      }
      setState({ status: "ready", data: body });
    } catch {
      setState({ status: "error", message: "Could not reach the Workspace API." });
    }
  }

  useEffect(() => {
    async function run() {
      await load();
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  async function post(path: string, body: unknown) {
    setBusy(true);
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        window.alert(result.message ?? "That action could not be completed.");
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (state.status === "loading") {
    return <p className="text-sm text-[var(--color-espresso)]/60">Loading…</p>;
  }
  if (state.status === "error") {
    return <EmptyState title="Could not load this record" description={state.message} />;
  }

  const { record, proposalVersions, activities, vendorQuotations } = state.data;
  const allowedNextStages = JOURNEY_PLANNING_ALLOWED_TRANSITIONS[record.stage] ?? [];
  const isOwner = record.ownerId === currentUserId;

  async function addActivity(activityType: PlanningActivityType, content: string) {
    await post("/activities", { activityType, content });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)]">{record.title}</h1>
            <p className="mt-1 text-sm text-[var(--color-espresso)]/60">
              {record.recordKind === "individual" ? "Individual" : "Corporate"}
              {record.destinationRegion ? ` · ${record.destinationRegion}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-amber)]/14 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)]">
            {STAGE_LABELS[record.stage]}
            {record.outcome ? ` · ${OUTCOME_LABELS[record.outcome]}` : ""}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[var(--color-espresso)]/60">
            Owner: {record.ownerId ? (isOwner ? "You" : record.ownerId) : "Unassigned"}
          </span>
          {!record.ownerId ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => post("/claim", {})}
              className="rounded-full border border-[var(--color-amber)] px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[var(--color-amber)]/10 disabled:opacity-50"
            >
              Claim
            </button>
          ) : null}
        </div>

        {allowedNextStages.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {allowedNextStages.map((stage) => (
              <button
                key={stage}
                type="button"
                disabled={busy}
                onClick={() => post("/advance-stage", { toStage: stage })}
                className="rounded-full bg-[var(--color-espresso)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Move to {STAGE_LABELS[stage]}
              </button>
            ))}
          </div>
        ) : null}

        {record.stage === "decision" ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border-warm)] pt-4">
            <p className="w-full text-sm font-semibold text-[var(--color-espresso)]">Record decision:</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => post("/decision", { outcome: "confirmed" })}
              className="rounded-full bg-[var(--color-amber)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-[#e88a16] disabled:opacity-50"
            >
              Confirm → Convert to Journey
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => post("/decision", { outcome: "lost" })}
              className="rounded-full border border-[var(--color-border-warm)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-black/5 disabled:opacity-50"
            >
              Lost
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => post("/decision", { outcome: "archived" })}
              className="rounded-full border border-[var(--color-border-warm)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-black/5 disabled:opacity-50"
            >
              Archive
            </button>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">
          Discovery Notes &amp; Activity
        </h2>
        <div className="flex gap-2">
          <input
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            placeholder="Add a discovery note…"
            className="flex-1 rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy || noteContent.trim().length === 0}
            onClick={async () => {
              await addActivity("discovery_note", noteContent);
              setNoteContent("");
            }}
            className="rounded-full bg-[var(--color-espresso)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {activities.length === 0 ? (
          <p className="text-sm text-[var(--color-espresso)]/50">No activity recorded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activities.map((activity) => (
              <li key={activity.id} className="rounded-lg border border-[var(--color-border-warm)] px-3 py-2 text-sm">
                <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)]/50">
                  {activity.activityType.replace("_", " ")}
                </span>
                {activity.content}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">
          Proposal Versions (immutable history)
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={destinationName}
            onChange={(event) => setDestinationName(event.target.value)}
            placeholder="Destination"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={nights}
            onChange={(event) => setNights(event.target.value)}
            placeholder="Nights"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            value={priceAmount}
            onChange={(event) => setPriceAmount(event.target.value)}
            placeholder="Price estimate (optional)"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            value={priceCurrency}
            onChange={(event) => setPriceCurrency(event.target.value)}
            placeholder="Currency"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <textarea
            value={itineraryNotes}
            onChange={(event) => setItineraryNotes(event.target.value)}
            placeholder="Notes for this version (optional)"
            className="sm:col-span-2 rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          disabled={busy || destinationName.trim().length === 0}
          onClick={async () => {
            await post("/proposal-versions", {
              itinerarySnapshot: {
                destinations: [
                  { name: destinationName, nights: Number(nights) || 0, notes: itineraryNotes || null },
                ],
                startDate: null,
                endDate: null,
                travellerCount: null,
                priceEstimate: priceAmount ? { amount: Number(priceAmount), currency: priceCurrency } : null,
                inclusions: [],
                notes: itineraryNotes || null,
              },
              summary: `${destinationName} · ${nights} night(s)`,
            });
            setDestinationName("");
            setItineraryNotes("");
            setPriceAmount("");
          }}
          className="w-fit rounded-full bg-[var(--color-amber)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-espresso)] hover:bg-[#e88a16] disabled:opacity-50"
        >
          Save New Proposal Version
        </button>

        {proposalVersions.length === 0 ? (
          <p className="text-sm text-[var(--color-espresso)]/50">No proposal versions yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {proposalVersions.map((version) => (
              <li key={version.id} className="rounded-lg border border-[var(--color-border-warm)] px-3 py-2 text-sm">
                <p className="font-semibold text-[var(--color-espresso)]">
                  v{version.versionNumber}
                  {state.data.proposal?.currentVersionId === version.id ? " (current)" : ""}
                </p>
                <p className="text-[var(--color-espresso)]/70">{version.summary}</p>
                <p className="text-xs text-[var(--color-espresso)]/50">
                  {new Date(version.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">Vendor Quotations</h2>
        {vendorQuotations.length === 0 ? (
          <p className="text-sm text-[var(--color-espresso)]/50">
            No vendor quotations recorded yet. (Recording a quotation requires an existing Vendor id — Vendor
            Management (WS16) does not have a picker UI yet; this is disclosed as a Known Limitation.)
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {vendorQuotations.map((quotation) => (
              <li key={quotation.id} className="rounded-lg border border-[var(--color-border-warm)] px-3 py-2 text-sm">
                {quotation.quotationAmount ? `${quotation.currency ?? ""} ${quotation.quotationAmount}` : "Requested"}
                <span className="ml-2 text-xs uppercase tracking-wide text-[var(--color-espresso)]/50">
                  {quotation.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
