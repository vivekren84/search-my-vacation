"use client";

// EBC-R1.3-WS12-007 Phase 5/6: Journey Planning UI + Proposal Management —
// Record Detail (WS12-004 UX screens JP-02 Overview, JP-04 Discovery,
// JP-05 Proposal Workspace, JP-06 Vendor Quotations, JP-07 Version
// History, JP-09 History/Audit, JP-12 Tasks & Follow-ups, JP-13
// Decision), combined into one detail view rather than separate routed
// screens for this MVP vertical slice — disclosed in the WS12-007 Known
// Limitations as a scope simplification, not a UX redesign: all the same
// actions are present, just on one page instead of a tabbed multi-route
// layout.
//
// EBC-R1.3-WS12-010 QA Defect Resolution (Keerthi, WS12-009):
//   - D1a/D1b: adds the History/Audit and Tasks & Follow-ups sections,
//     entirely missing from the original delivery.
//   - D3/D4: the generic "Move to <stage>" button loop no longer offers
//     "Move to Closed" (reaching Closed always requires an outcome and now
//     goes exclusively through the three Decision-panel buttons below,
//     which always supply one); action failures now surface as a
//     dismissable toast instead of a blocking window.alert().
//
// EBC-R1.3-WS12-013 / WS12-012 §5: adds an editable "Trip Basics" panel
// (Planning Parameters), a persistent completion indicator ("Trip Basics —
// X of 5 needed before Planning"), and a visible-but-disabled treatment of
// the "Move to Planning" action specifically, with an inline note, while
// any of the five gated fields is still unanswered (FR-JP-34/BR-021). The
// generic "Move to <Stage>" button loop itself is otherwise unchanged —
// every other transition behaves exactly as before.
//
// EBC-R1.3-WS12-016 / PRA-02: adds the same visible-but-disabled treatment
// to "Move to Discovery" specifically, while the record is unowned
// (Owner: Unassigned) — the Ownership Gate. Mirrors the Planning gate's
// own pattern exactly (disabled button + title tooltip + inline note)
// rather than inventing a second UI convention; the server independently
// enforces this at the same point (validation.ts's
// validateLeadCreatedToDiscoveryGate), so this UI treatment is a
// convenience, not the actual control.
//
// EBC-R1.3-WS13-005 Phase 0 (CM-01, CM-02, CM-05, CM-07, PD-A; UX Rev 4a
// §36.2/§36.3): the Trip Basics panel gains the optional Service Category;
// "Confirm → Convert to Journey" now opens ConfirmJourneyDialog (confirmed
// dates, nights and Service Category shown, every unmet prerequisite shown
// at once); a record that replaces an On Hold Journey shows the
// replacement banner (UXO-11 (b)). Lost and Archived are unchanged.
// The banner shows the Journey reference as text: the Journey page it will
// link to arrives in WS13 Phase 1.
//
// Known limitation (unchanged from WS12-007): the proposal-version
// "itinerary" form only captures a SINGLE destination per version
// (name/nights/notes) plus an optional price estimate, not a full
// multi-destination itinerary builder — Itinerary Studio (WS15) does not
// exist yet. The stored ItinerarySnapshot shape itself already supports
// multiple destinations (types.ts) for whenever a richer authoring
// surface is built.

import { useEffect, useState } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import { ToastStack, useWorkspaceToasts } from "@/components/workspace/shared/Toast";
import type {
  JourneyPlanningGatedParameterField,
  JourneyPlanningOriginChannel,
  JourneyPlanningOutcome,
  JourneyPlanningStage,
  PlanningActivityType,
} from "@/lib/workspace/journey-planning/types";
import { JOURNEY_PLANNING_ALLOWED_TRANSITIONS } from "@/lib/workspace/journey-planning/types";
import type { WorkspaceAuditEventType } from "@/lib/workspace/shared/audit/types";
import type { WorkspaceTask, WorkspaceTaskStatus } from "@/lib/workspace/shared/tasks-follow-ups/types";

import { AUDIT_EVENT_LABELS, ORIGIN_CHANNEL_LABELS, OUTCOME_LABELS, STAGE_LABELS } from "./journeyPlanningLabels";
import TripBasicsPanel, { type TripBasicsValues, EMPTY_TRIP_BASICS_VALUES } from "./TripBasicsPanel";
import ConfirmJourneyDialog from "./ConfirmJourneyDialog";
import { useServiceCategoryOptions } from "./useServiceCategoryOptions";
import type { JourneyPlanningFieldIssue } from "@/lib/workspace/journey-planning/validation";

interface DetailResponse {
  ok: boolean;
  record: {
    id: string;
    title: string;
    stage: JourneyPlanningStage;
    outcome: JourneyPlanningOutcome | null;
    ownerId: string | null;
    destinationRegion: string | null;
    originChannel: JourneyPlanningOriginChannel;
    recordKind: "individual" | "corporate";
    updatedAt: string;
    // EBC-R1.3-WS12-013 Planning Parameters ("Trip Basics").
    adults: number | null;
    children: number | null;
    infants: number | null;
    intendedTravelMonth: string | null;
    nights: number | null;
    preferredDepartureCity: string | null;
    // EBC-R1.3-WS13-005 Phase 0 (CM-07, CM-02).
    serviceCategory: string | null;
    replacesJourneyId: string | null;
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
  // EBC-R1.3-WS12-013 / FR-JP-34 / BR-021: server-computed completion
  // summary (service.ts's computeTripBasicsStatus) — a single source of
  // truth shared with the Discovery→Planning gate's own enforcement, so
  // the indicator below can never drift from what the gate actually
  // checks.
  tripBasics: { completed: number; total: number; missing: JourneyPlanningGatedParameterField[] };
  // EBC-R1.3-WS13-005 Phase 0 (WS13-004A AC-01): the On Hold Journey this
  // record replaces, if any.
  replacement: {
    id: string;
    journeyReference: string;
    confirmedStartDate: string | null;
    confirmedEndDate: string | null;
  } | null;
}

interface HistoryEvent {
  id: string;
  eventType: WorkspaceAuditEventType;
  actorId: string | null;
  eventData: Record<string, unknown>;
  createdAt: string;
}

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: DetailResponse };

function toTripBasicsValues(record: DetailResponse["record"]): TripBasicsValues {
  return {
    adults: record.adults === null ? "" : String(record.adults),
    children: record.children === null ? "" : String(record.children),
    infants: record.infants === null ? "" : String(record.infants),
    intendedTravelMonth: record.intendedTravelMonth ?? "",
    nights: record.nights === null ? "" : String(record.nights),
    preferredDepartureCity: record.preferredDepartureCity ?? "",
    serviceCategory: record.serviceCategory ?? "",
  };
}

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
  const [history, setHistory] = useState<HistoryEvent[] | null>(null);
  const [tasks, setTasks] = useState<WorkspaceTask[] | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueAt, setTaskDueAt] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [tripBasicsDraft, setTripBasicsDraft] = useState<TripBasicsValues>(EMPTY_TRIP_BASICS_VALUES);
  const [savingTripBasics, setSavingTripBasics] = useState(false);
  // EBC-R1.3-WS13-005 Phase 0 (CM-01/05/07): Confirm dialog state.
  const serviceCategories = useServiceCategoryOptions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmIssues, setConfirmIssues] = useState<JourneyPlanningFieldIssue[]>([]);
  const { toasts, pushToast, dismissToast } = useWorkspaceToasts();

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
      setTripBasicsDraft(toTripBasicsValues(body.record));
    } catch {
      setState({ status: "error", message: "Could not reach the Workspace API." });
    }
  }

  async function loadHistory() {
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}/history`, { cache: "no-store" });
      const body = await response.json();
      if (response.ok && body.ok) {
        setHistory(body.events as HistoryEvent[]);
      }
    } catch {
      // History is a secondary panel; a failed fetch here should not block
      // the rest of the Detail page from rendering.
    }
  }

  async function loadTasks() {
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}/tasks`, { cache: "no-store" });
      const body = await response.json();
      if (response.ok && body.ok) {
        setTasks(body.tasks as WorkspaceTask[]);
      }
    } catch {
      // Same reasoning as loadHistory.
    }
  }

  useEffect(() => {
    async function run() {
      await Promise.all([load(), loadHistory(), loadTasks()]);
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
        pushToast(result.message ?? "That action could not be completed.", "error");
      }
      await Promise.all([load(), loadHistory(), loadTasks()]);
      return result;
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

  const { record, proposalVersions, activities, vendorQuotations, tripBasics, replacement } = state.data;
  // WS12-010 Defect D3/D4: "closed" is intentionally excluded here. Reaching
  // Closed always requires an outcome, which the Decision panel below
  // supplies explicitly — a generic "Move to Closed" button can never
  // succeed without one (see validation.ts's closed_stage_requires_decision_endpoint guard).
  const allowedNextStages = (JOURNEY_PLANNING_ALLOWED_TRANSITIONS[record.stage] ?? []).filter(
    (stage) => stage !== "closed",
  );
  const isOwner = record.ownerId === currentUserId;

  // EBC-R1.3-WS12-013 / WS12-012 §5.2: only the Discovery→Planning
  // transition is ever gated by Trip Basics completeness — every other
  // "Move to <Stage>" action is unaffected, matching the spec's "only this
  // one transition carries a gate" wireframe annotation.
  const planningGateBlocked =
    record.stage === "discovery" && allowedNextStages.includes("planning") && tripBasics.missing.length > 0;

  // EBC-R1.3-WS12-016 / PRA-02: only Lead Created→Discovery is ever gated
  // by ownership — every other "Move to <Stage>" action is unaffected,
  // matching the card's own "Existing Behaviour" note that no other
  // transition changes.
  const discoveryGateBlocked =
    record.stage === "lead_created" && allowedNextStages.includes("discovery") && !record.ownerId;

  async function addActivity(activityType: PlanningActivityType, content: string) {
    await post("/activities", { activityType, content });
  }

  async function addTask() {
    if (taskTitle.trim().length === 0) return;
    const result = await post("/tasks", {
      title: taskTitle,
      dueAt: taskDueAt || undefined,
      assignedToUserId: taskAssignee || undefined,
    });
    if (result?.ok) {
      setTaskTitle("");
      setTaskDueAt("");
      setTaskAssignee("");
      pushToast("Task added.", "success");
    }
  }

  async function setTaskStatus(taskId: string, status: WorkspaceTaskStatus) {
    await post(`/tasks/${taskId}/status`, { status });
  }

  async function saveTripBasics() {
    setSavingTripBasics(true);
    try {
      const body = {
        adults: tripBasicsDraft.adults === "" ? undefined : Number(tripBasicsDraft.adults),
        children: tripBasicsDraft.children === "" ? undefined : Number(tripBasicsDraft.children),
        infants: tripBasicsDraft.infants === "" ? undefined : Number(tripBasicsDraft.infants),
        intendedTravelMonth: tripBasicsDraft.intendedTravelMonth || undefined,
        nights: tripBasicsDraft.nights === "" ? undefined : Number(tripBasicsDraft.nights),
        preferredDepartureCity: tripBasicsDraft.preferredDepartureCity || undefined,
        // EBC-R1.3-WS13-005 Phase 0 (CM-07): "Not set" clears a previously
        // set value (null); otherwise unchanged fields are omitted.
        serviceCategory:
          tripBasicsDraft.serviceCategory !== ""
            ? tripBasicsDraft.serviceCategory
            : record.serviceCategory !== null
              ? null
              : undefined,
      };
      const response = await fetch(`/api/workspace/journey-planning/${recordId}/trip-basics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        pushToast(result.message ?? "Could not save Trip Basics.", "error");
        return;
      }
      pushToast("Trip Basics saved.", "success");
      await load();
    } catch {
      pushToast("Could not reach the Workspace API.", "error");
    } finally {
      setSavingTripBasics(false);
    }
  }

  // EBC-R1.3-WS13-005 Phase 0 (CM-01, CM-05, CM-07): record the Confirmed
  // decision with the confirmed dates. Field issues from the server are
  // shown inside the dialog; any other failure uses the existing toast.
  async function confirmJourney(dates: { confirmedStartDate: string; confirmedEndDate: string }) {
    setConfirmBusy(true);
    try {
      const response = await fetch(`/api/workspace/journey-planning/${recordId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome: "confirmed", ...dates }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        if (Array.isArray(result.issues) && result.issues.length > 0) {
          setConfirmIssues(
            (result.issues as JourneyPlanningFieldIssue[]).map((issue) =>
              issue.code === "original_not_on_hold" && replacement
                ? {
                    ...issue,
                    message: `The original Journey ${replacement.journeyReference} is no longer on hold, so this replacement can't be confirmed. Open ${replacement.journeyReference} to check its status.`,
                  }
                : issue,
            ),
          );
        } else {
          setConfirmOpen(false);
          pushToast(result.message ?? "Could not record the decision.", "error");
        }
        return;
      }
      setConfirmOpen(false);
      setConfirmIssues([]);
      pushToast(result.journeyReference ? `Journey ${result.journeyReference} created.` : "Journey created.", "success");
      await Promise.all([load(), loadHistory(), loadTasks()]);
    } catch {
      pushToast("Could not reach the Workspace API.", "error");
    } finally {
      setConfirmBusy(false);
    }
  }

  function editTripBasicsFromDialog() {
    setConfirmOpen(false);
    setConfirmIssues([]);
    document.getElementById("trip-basics")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("tripBasics-serviceCategory")?.focus({ preventScroll: true });
  }

  const serviceCategoryLabel =
    record.serviceCategory === null
      ? null
      : (serviceCategories.options?.find((option) => option.code === record.serviceCategory)?.label ?? null);

  return (
    <div className="flex flex-col gap-8">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {replacement ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-[var(--color-amber)]/10 px-4 py-3 text-sm text-[var(--color-espresso)]"
        >
          Replacement planning for {replacement.journeyReference} · The original Journey is on hold until this is
          confirmed.
        </div>
      ) : null}

      {confirmOpen ? (
        <ConfirmJourneyDialog
          ownerId={record.ownerId}
          ownerLabel={record.ownerId ? (isOwner ? "You" : record.ownerId) : "Unassigned"}
          nights={record.nights}
          serviceCategory={record.serviceCategory}
          serviceCategoryLabel={serviceCategoryLabel}
          replacement={replacement}
          busy={confirmBusy}
          serverIssues={confirmIssues}
          onCancel={() => {
            setConfirmOpen(false);
            setConfirmIssues([]);
            document.getElementById("decision-confirm-trigger")?.focus();
          }}
          onConfirm={confirmJourney}
          onEditTripBasics={editTripBasicsFromDialog}
        />
      ) : null}

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)]">{record.title}</h1>
            <p className="mt-1 text-sm text-[var(--color-espresso)]/60">
              {record.recordKind === "individual" ? "Individual" : "Corporate"}
              {record.destinationRegion ? ` · ${record.destinationRegion}` : ""}
              {` · ${ORIGIN_CHANNEL_LABELS[record.originChannel]}`}
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {allowedNextStages.map((stage) => {
              const isGatedPlanningMove = stage === "planning" && planningGateBlocked;
              const isGatedDiscoveryMove = stage === "discovery" && discoveryGateBlocked;
              const gateBlocked = isGatedPlanningMove || isGatedDiscoveryMove;
              const gateTitle = isGatedPlanningMove
                ? "Add the remaining Trip Basics to move this record into Planning."
                : isGatedDiscoveryMove
                  ? "Claim this Journey before beginning Discovery."
                  : undefined;
              return (
                <button
                  key={stage}
                  type="button"
                  disabled={busy || gateBlocked}
                  title={gateTitle}
                  onClick={() => post("/advance-stage", { toStage: stage })}
                  className="rounded-full bg-[var(--color-espresso)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Move to {STAGE_LABELS[stage]}
                </button>
              );
            })}
          </div>
        ) : null}
        {planningGateBlocked ? (
          <p className="mt-2 text-xs text-[var(--color-espresso)]/60">
            Add the remaining Trip Basics to move this record into Planning.
          </p>
        ) : null}
        {discoveryGateBlocked ? (
          <p className="mt-2 text-xs text-[var(--color-espresso)]/60">
            Claim this Journey before beginning Discovery.
          </p>
        ) : null}

        {record.stage === "decision" ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border-warm)] pt-4">
            <p className="w-full text-sm font-semibold text-[var(--color-espresso)]">Record decision:</p>
            <button
              id="decision-confirm-trigger"
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirmIssues([]);
                setConfirmOpen(true);
              }}
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

      <section id="trip-basics" className="flex scroll-mt-24 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">Trip Basics</h2>
          <span className="rounded-full bg-[var(--color-amber)]/14 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-espresso)]">
            Trip Basics — {tripBasics.completed} of {tripBasics.total} needed before Planning
          </span>
        </div>
        <TripBasicsPanel
          values={tripBasicsDraft}
          onChange={setTripBasicsDraft}
          mode="detail"
          serviceCategoryOptions={serviceCategories.options}
          serviceCategoryLoadFailed={serviceCategories.failed}
        />
        <button
          type="button"
          disabled={savingTripBasics}
          onClick={saveTripBasics}
          className="w-fit rounded-full bg-[var(--color-espresso)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-50"
        >
          {savingTripBasics ? "Saving…" : "Save Trip Basics"}
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">
          Discovery Notes &amp; Activity
        </h2>
        <div className="flex gap-2">
          <input
            id="noteContent"
            name="noteContent"
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
            id="destinationName"
            name="destinationName"
            value={destinationName}
            onChange={(event) => setDestinationName(event.target.value)}
            placeholder="Destination"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            id="nights"
            name="nights"
            type="number"
            min={0}
            value={nights}
            onChange={(event) => setNights(event.target.value)}
            placeholder="Nights"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            id="priceAmount"
            name="priceAmount"
            value={priceAmount}
            onChange={(event) => setPriceAmount(event.target.value)}
            placeholder="Price estimate (optional)"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            id="priceCurrency"
            name="priceCurrency"
            value={priceCurrency}
            onChange={(event) => setPriceCurrency(event.target.value)}
            placeholder="Currency"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <textarea
            id="itineraryNotes"
            name="itineraryNotes"
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

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">
          Tasks &amp; Follow-ups
        </h2>
        <p className="text-xs text-[var(--color-espresso)]/50">
          No user-picker UI exists yet (Workspace Administration/User Management is not built) — Assignee, when
          given, must be a raw user id. Disclosed as a Known Limitation, matching the existing Vendor Quotations
          pattern.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            id="taskTitle"
            name="taskTitle"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Task title"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm sm:col-span-1"
          />
          <input
            id="taskDueAt"
            name="taskDueAt"
            type="date"
            value={taskDueAt}
            onChange={(event) => setTaskDueAt(event.target.value)}
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
          <input
            id="taskAssignee"
            name="taskAssignee"
            value={taskAssignee}
            onChange={(event) => setTaskAssignee(event.target.value)}
            placeholder="Assignee user id (optional)"
            className="rounded border border-[var(--color-border-warm)] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          disabled={busy || taskTitle.trim().length === 0}
          onClick={addTask}
          className="w-fit rounded-full bg-[var(--color-espresso)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-50"
        >
          Add Task
        </button>

        {tasks === null ? (
          <p className="text-sm text-[var(--color-espresso)]/50">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-[var(--color-espresso)]/50">No tasks or follow-ups yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-border-warm)] px-3 py-2 text-sm"
              >
                <div>
                  <p className={task.status === "completed" ? "text-[var(--color-espresso)]/50 line-through" : "text-[var(--color-espresso)]"}>
                    {task.title}
                  </p>
                  <p className="text-xs text-[var(--color-espresso)]/50">
                    {task.dueAt ? `Due ${new Date(task.dueAt).toLocaleDateString()}` : "No due date"}
                    {task.assignedToUserId ? ` · Assigned to ${task.assignedToUserId}` : ""}
                    {` · ${task.status}`}
                  </p>
                </div>
                {task.status !== "completed" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setTaskStatus(task.id, "completed")}
                    className="rounded-full border border-[var(--color-amber)] px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[var(--color-amber)]/10 disabled:opacity-50"
                  >
                    Mark complete
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setTaskStatus(task.id, "open")}
                    className="rounded-full border border-[var(--color-border-warm)] px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-black/5 disabled:opacity-50"
                  >
                    Reopen
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-espresso)]">History</h2>
        {history === null ? (
          <p className="text-sm text-[var(--color-espresso)]/50">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-[var(--color-espresso)]/50">No history recorded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((event) => (
              <li key={event.id} className="rounded-lg border border-[var(--color-border-warm)] px-3 py-2 text-sm">
                <span className="font-semibold text-[var(--color-espresso)]">{AUDIT_EVENT_LABELS[event.eventType]}</span>
                <span className="ml-2 text-xs text-[var(--color-espresso)]/50">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
