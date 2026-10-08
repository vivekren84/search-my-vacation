"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7/WP-1.8): one Journey —
// header, tabs and every Phase 1 action (UX Rev 4a §8, §9, §13, §16, §21,
// §24, §25 with Sophie's Phase 1 confirmations EBC-R1.3-WS13-020B).
//
// - Header: breadcrumb, title (party · destination), meta line (Service
//   Category chip with pencil, dates with no edit control, nights,
//   relative departure, template), three people cards, lifecycle stepper,
//   the single primary action (gated with its reason), the More menu
//   (C-07), status banners (C-06) and the read-only line for non-owners.
//   After 120px of scrolling a single-line bar keeps the title, stage and
//   primary action in reach.
// - Tabs: Overview · Itinerary · History only (C-01), ARIA tabs with arrow
//   keys, `?tab=` in the URL. Tabs load on selection; the header loads once.
// - Every action is checked again by the API and the M11 RPCs. Field
//   problems stay in their dialog; any other refusal shows a toast with the
//   specific reason and reloads the Journey (UX §9.3; 020B S-5 `stale`).
// - Visibility comes from availableActions (derivations.ts): non-owners
//   see no action controls (UXD-JW-06); Administrators see everything an
//   owner sees plus adoption.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import { ToastStack, useWorkspaceToasts, type ToastVariant } from "@/components/workspace/shared/Toast";
import { WORKSPACE_JOURNEY_PLANNING_PATH, WORKSPACE_JOURNEY_WORKSPACE_PATH } from "@/lib/workspace/shared/constants";
import type { WorkspaceRole } from "@/lib/workspace/shared/types";
import type {
  JourneyActionKind,
  JourneyDetail,
  JourneyHistoryEntry,
  JourneyHistoryPage,
  JourneyStage,
} from "@/lib/workspace/journey-workspace/types";

import AssignDialog from "../dialogs/AssignDialog";
import LifecycleDialog, { type LifecycleDialogKind } from "../dialogs/LifecycleDialog";
import ServiceCategoryDialog from "../dialogs/ServiceCategoryDialog";
import type { HistoryContext } from "../historyLabels";
import { callJourneyApi, serviceCategoryLabel, useDirectory, useReferenceData, type ApiFailure } from "../journeyApi";
import {
  actionLabel,
  actionSuccessMessage,
  disabledReasonText,
  formatDateRange,
  pluralise,
  relativeDeparture,
} from "../journeyWorkspaceLabels";
import LifecycleStepper from "../LifecycleStepper";
import AdoptionPanel from "../panels/AdoptionPanel";
import ContactEditor from "../panels/ContactEditor";
import { CARD, GatedButton, OverlayChip, Skeleton, StageBadge } from "../primitives";
import HistoryTab from "../tabs/HistoryTab";
import ItineraryTab from "../tabs/ItineraryTab";
import OverviewTab from "../tabs/OverviewTab";
import { describeNextStep } from "./nextStep";
import PeopleCards, { partyDisplayName } from "./PeopleCards";
import StatusBanners from "./StatusBanner";

type TabKey = "overview" | "itinerary" | "history";
const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "itinerary", label: "Itinerary" },
  { key: "history", label: "History" },
];

type Overlay =
  | { kind: "lifecycle"; action: LifecycleDialogKind }
  | { kind: "assign" }
  | { kind: "service_category" }
  | { kind: "contact" }
  | { kind: "adopt" }
  | null;

type LoadState = { status: "loading" } | { status: "ready"; detail: JourneyDetail } | { status: "error"; failure: ApiFailure };

const LIFECYCLE_KINDS: readonly JourneyActionKind[] = [
  "start_preparation",
  "mark_ready_to_travel",
  "mark_travelling",
  "mark_travel_complete",
  "begin_post_travel",
  "mark_completed",
  "step_back",
  "place_on_hold",
  "resume",
  "cancel",
];

function parseTab(value: string | null): TabKey {
  return value === "itinerary" || value === "history" ? value : "overview";
}

export interface JourneyViewer {
  id: string;
  role: WorkspaceRole;
}

// Toasts use the Workspace's existing per-screen toast stack (Toast.tsx),
// the same pattern as the Journey list and Journey Planning screens.
export default function JourneyWorkspaceView({ journeyId, viewer }: { journeyId: string; viewer: JourneyViewer }) {
  const { toasts, pushToast, dismissToast } = useWorkspaceToasts();
  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <JourneyWorkspaceContent journeyId={journeyId} viewer={viewer} pushToast={pushToast} />
    </>
  );
}

function JourneyWorkspaceContent({
  journeyId,
  viewer,
  pushToast,
}: {
  journeyId: string;
  viewer: JourneyViewer;
  pushToast: (message: string, variant?: ToastVariant) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));
  const isAdministrator = viewer.role === "administrator";

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [stageEvents, setStageEvents] = useState<JourneyHistoryEntry[]>([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [collapsed, setCollapsed] = useState(false);
  // Horizontal box of the shell's <main> column for the fixed one-line bar.
  const [barBox, setBarBox] = useState<{ left: number; width: number } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const directory = useDirectory();
  const reference = useReferenceData();

  // The header loads once per reload: the Journey detail plus its stage
  // events (stepper dates, cancellation date and actor).
  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      callJourneyApi<{ journey: JourneyDetail }>(`/api/workspace/journey-workspace/${journeyId}`),
      callJourneyApi<{ history: JourneyHistoryPage }>(`/api/workspace/journey-workspace/${journeyId}/history?filter=stage_status`),
    ]).then(([detailResult, historyResult]) => {
      if (cancelled) return;
      setState(detailResult.ok ? { status: "ready", detail: detailResult.data.journey } : { status: "error", failure: detailResult });
      setStageEvents(historyResult.ok ? historyResult.data.history.entries : []);
    });
    return () => {
      cancelled = true;
    };
  }, [journeyId, reloadToken]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    // The Workspace shell scrolls the window (WorkspaceShell is min-h-screen),
    // so the one-line bar is fixed to the top of the viewport and aligned to
    // the <main> column rather than sticky inside it.
    const column = sentinel.closest("main");
    const measure = () => {
      const rect = column?.getBoundingClientRect();
      setBarBox(rect ? { left: rect.left, width: rect.width } : null);
    };
    const observer = new IntersectionObserver(([entry]) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (passed) measure();
      setCollapsed(passed);
    });
    observer.observe(sentinel);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [state.status]);

  const userName = useCallback(
    (id: string | null | undefined) => {
      if (!id) return "—";
      if (directory.status === "ready") return directory.data.find((user) => user.userId === id)?.displayName ?? "Unknown user";
      return "…";
    },
    [directory],
  );

  const reachedOn = useMemo(() => {
    const reached: Partial<Record<JourneyStage, string>> = {};
    for (const entry of stageEvents) {
      const data = entry.eventData ?? {};
      if (entry.eventType === "journey_stage_changed" && typeof data.to === "string") {
        reached[data.to as JourneyStage] ??= entry.createdAt;
      } else if (entry.eventType === "journey_created" || entry.eventType === "journey_legacy_adopted") {
        reached.confirmed ??= entry.createdAt;
      }
    }
    return reached;
  }, [stageEvents]);

  const cancelledEvent = stageEvents.find((entry) => entry.eventType === "journey_cancelled") ?? null;

  function changeTab(next: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "overview") params.delete("tab");
    else params.set("tab", next);
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((item) => item.key === tab);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    changeTab(TABS[next].key);
    document.getElementById(`journey-tab-${TABS[next].key}`)?.focus();
  }

  function handleSuccess(detail: JourneyDetail, message: string) {
    setOverlay(null);
    setState({ status: "ready", detail });
    pushToast(message, "success");
    setReloadToken((n) => n + 1);
  }

  function handleFailure(failure: ApiFailure) {
    setOverlay(null);
    pushToast(failure.message, "error");
    setReloadToken((n) => n + 1);
  }

  function openAction(kind: JourneyActionKind) {
    if (LIFECYCLE_KINDS.includes(kind)) setOverlay({ kind: "lifecycle", action: kind as LifecycleDialogKind });
    else if (kind === "adopt") setOverlay({ kind: "adopt" });
    else if (kind === "reassign") setOverlay({ kind: "assign" });
    else if (kind === "edit_service_category") setOverlay({ kind: "service_category" });
    else if (kind === "edit_contact") setOverlay({ kind: "contact" });
  }

  if (state.status === "loading") return <JourneySkeleton />;

  if (state.status === "error") {
    if (state.failure.code === "not_found" || state.failure.status === 404) {
      return (
        <EmptyState
          title="This Journey couldn't be found."
          description="It may have been mistyped, or you may not have access to it."
          action={{ label: "Back to Journey Workspace", href: WORKSPACE_JOURNEY_WORKSPACE_PATH }}
        />
      );
    }
    return (
      <div className={`${CARD} px-5 py-6 text-sm text-[var(--color-espresso)]`}>
        {state.failure.code === "not_signed_in" ? state.failure.message : "Couldn't load this Journey."}{" "}
        <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setReloadToken((n) => n + 1)}>
          Try again
        </button>
      </div>
    );
  }

  const { detail } = state;
  const { journey, availableActions } = detail;
  const actions = availableActions.actions;
  const primary = availableActions.primary;
  const primaryAvailability = primary ? actions[primary] : null;
  const primaryReason =
    primaryAvailability?.state === "disabled"
      ? disabledReasonText(primaryAvailability.reason, {
          availableFrom: primaryAvailability.availableFrom,
          outstandingCount: primaryAvailability.outstandingCount,
        })
      : null;
  const title = `${partyDisplayName(detail)}${journey.destinationRegion ? ` · ${journey.destinationRegion}` : ""}`;
  const categoryLabel = serviceCategoryLabel(reference, journey.serviceCategory);
  const planningRecordHref = detail.planningRecord ? `${WORKSPACE_JOURNEY_PLANNING_PATH}/${detail.planningRecord.id}` : null;
  const nextStep = describeNextStep(detail, cancelledEvent?.createdAt ?? null);
  const isTerminal = journey.outcome !== null || journey.stage === "journey_closed";
  const relative = !isTerminal && journey.adoptionStatus !== "legacy_pending" ? relativeDeparture(journey.confirmedStartDate, journey.confirmedEndDate, detail.today) : null;
  const dates = formatDateRange(journey.confirmedStartDate, journey.confirmedEndDate);

  const ctx: HistoryContext = {
    userName,
    categoryLabel: (code) => serviceCategoryLabel(reference, code ?? null) ?? "—",
    planningRecord: detail.planningRecord,
    planningRecordHref: (id) => `${WORKSPACE_JOURNEY_PLANNING_PATH}/${id}`,
  };

  const moreItems: Array<{ key: string; label: string; onSelect?: () => void; href?: string }> = [];
  for (const kind of ["place_on_hold", "step_back", "cancel"] as const) {
    if (actions[kind].state === "available") moreItems.push({ key: kind, label: actionLabel(kind, journey.stage), onSelect: () => openAction(kind) });
  }
  if (actions.reassign.state === "available") {
    moreItems.push({ key: "reassign", label: isAdministrator ? "Reassign…" : "Assign…", onSelect: () => openAction("reassign") });
  }
  if (planningRecordHref) moreItems.push({ key: "planning", label: "View planning record ↗", href: planningRecordHref });
  const travellingNote = journey.stage === "travelling" && !journey.onHold && availableActions.readOnlyReason === null;

  const primaryButton = (idSuffix: string, compact = false) =>
    primary ? (
      <GatedButton
        id={`journey-primary-${idSuffix}`}
        label={actionLabel(primary, journey.stage)}
        onClick={() => openAction(primary)}
        disabledReason={compact ? null : primaryReason}
        busy={compact && Boolean(primaryReason)}
      />
    ) : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Single-line bar after 120px of scrolling (UX §8.1 "Stickiness"). */}
      {collapsed && barBox ? (
        <div className="fixed top-0 z-30" style={{ left: barBox.left, width: barBox.width }} data-testid="journey-compact-bar">
          <div className="flex items-center gap-3 border-b border-[var(--color-border-warm)] bg-white/95 px-4 py-2 shadow-[var(--shadow-sm)] backdrop-blur sm:px-6 lg:px-8">
            <p className="min-w-0 flex-1 truncate font-[var(--font-editorial)] text-base text-[var(--color-espresso)]">{title}</p>
            <StageBadge stage={journey.stage} outcome={journey.outcome} />
            {journey.onHold ? <span className="hidden sm:inline"><OverlayChip kind="on_hold" /></span> : null}
            {primary && primaryAvailability?.state !== "hidden" ? (
              primaryReason ? (
                <span className="hidden text-xs text-[var(--color-espresso)]/60 md:inline">{primaryReason}</span>
              ) : (
                primaryButton("compact", true)
              )
            ) : null}
          </div>
        </div>
      ) : null}

      <header className="relative flex flex-col gap-4">
        <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-[120px] h-px w-px" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-espresso)]/60">
            <Link href={WORKSPACE_JOURNEY_WORKSPACE_PATH} className="hover:underline">
              Journey Workspace
            </Link>{" "}
            / <span aria-current="page" className="font-semibold text-[var(--color-espresso)]/80">{journey.journeyReference}</span>
          </nav>
          {moreItems.length > 0 ? <MoreMenu items={moreItems} note={travellingNote ? "Holding isn't available while travelling." : null} /> : null}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-[var(--font-editorial)] text-2xl text-[var(--color-espresso)] sm:text-3xl">{title}</h1>
              {journey.adoptionStatus === "legacy_pending" ? <OverlayChip kind="legacy" /> : <StageBadge stage={journey.stage} outcome={journey.outcome} />}
              {journey.onHold ? <OverlayChip kind="on_hold" /> : null}
              {journey.archivedAt ? <OverlayChip kind="archived" /> : null}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-espresso)]/75">
              {journey.adoptionStatus === "legacy_pending" ? (
                <span className="text-[var(--color-espresso)]/55">Not yet classified</span>
              ) : categoryLabel ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-warm)] bg-white px-2.5 py-0.5 text-xs font-semibold text-[var(--color-espresso)]">
                  {categoryLabel}
                  {actions.edit_service_category.state === "available" ? (
                    <button
                      type="button"
                      onClick={() => openAction("edit_service_category")}
                      aria-label="Change Service Category"
                      title="Change Service Category"
                      className="-mr-1 grid h-5 w-5 place-items-center rounded-full text-[var(--color-espresso)]/60 hover:bg-[rgb(245_149_28_/_12%)] hover:text-[var(--color-espresso)]"
                    >
                      <PencilGlyph />
                    </button>
                  ) : null}
                </span>
              ) : null}
              {dates ? (
                <span title="Dates are fixed at confirmation. Changing them is a material change." className="cursor-help">
                  {dates}
                </span>
              ) : null}
              {journey.nights !== null ? <span>· {pluralise(journey.nights, "night")}</span> : null}
              {relative ? <span>· {journey.stage === "travelling" ? `Travelling · ${relative}` : relative}</span> : null}
              {detail.readinessTemplate ? <span>· {detail.readinessTemplate.name} template</span> : null}
              {detail.supersedes ? (
                <Link
                  href={`${WORKSPACE_JOURNEY_WORKSPACE_PATH}/${detail.supersedes.id}`}
                  className="rounded-full border border-[var(--color-border-warm)] px-2 py-0.5 text-xs text-[var(--color-espresso)]/80 hover:bg-[rgb(245_149_28_/_8%)]"
                >
                  Replaces {detail.supersedes.journeyReference} ↗
                </Link>
              ) : null}
            </p>
          </div>
          {primary ? <div className="shrink-0">{primaryButton("header")}</div> : null}
        </div>

        <StatusBanners
          detail={detail}
          isAdministrator={isAdministrator}
          facts={{
            cancelledOn: cancelledEvent?.createdAt ?? null,
            cancelledBy: cancelledEvent ? (cancelledEvent.actorName ?? (cancelledEvent.actorId ? userName(cancelledEvent.actorId) : null)) : null,
            archivedByName: journey.archivedBy ? userName(journey.archivedBy) : null,
          }}
        />

        <PeopleCards
          detail={detail}
          isAdministrator={isAdministrator}
          onAssign={actions.reassign.state === "available" ? () => openAction("reassign") : null}
          onEditContact={actions.edit_contact.state === "available" ? () => openAction("edit_contact") : null}
        />

        {journey.adoptionStatus !== "legacy_pending" ? (
          <div className={`${CARD} px-4 py-4`}>
            <LifecycleStepper
              stage={journey.stage}
              outcome={journey.outcome}
              onHold={journey.onHold}
              stageChangedAt={journey.stageChangedAt}
              reachedOn={reachedOn}
              gateNote={primaryReason}
            />
            {availableActions.readOnlyReason === "not_owner" ? (
              <p className="mt-3 border-t border-[var(--color-border-warm)] pt-3 text-xs text-[var(--color-espresso)]/70">
                Owned by {detail.owner?.name ?? "another Workspace User"}. Only the owner or an Administrator can change this Journey.
              </p>
            ) : null}
          </div>
        ) : null}
      </header>

      <div>
        <div
          role="tablist"
          aria-label="Journey sections"
          onKeyDown={onTabKeyDown}
          className="-mx-4 flex gap-1 overflow-x-auto border-b border-[var(--color-border-warm)] px-4 sm:mx-0 sm:px-0"
        >
          {TABS.map((item) => {
            const selected = item.key === tab;
            return (
              <button
                key={item.key}
                id={`journey-tab-${item.key}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`journey-panel-${item.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => changeTab(item.key)}
                className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                  selected
                    ? "border-[var(--color-amber)] text-[var(--color-espresso)]"
                    : "border-transparent text-[var(--color-espresso)]/60 hover:text-[var(--color-espresso)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <ReadOnlyNotice detail={detail} />
        <div role="tabpanel" id={`journey-panel-${tab}`} aria-labelledby={`journey-tab-${tab}`} tabIndex={0} className="pt-5 focus:outline-none">
          {tab === "overview" ? (
            <OverviewTab
              detail={detail}
              nextStep={nextStep}
              ctx={ctx}
              reloadToken={reloadToken}
              onAction={openAction}
              onViewHistory={() => changeTab("history")}
              planningRecordHref={planningRecordHref}
            />
          ) : tab === "itinerary" ? (
            <ItineraryTab detail={detail} planningRecordHref={planningRecordHref} />
          ) : (
            <HistoryTab detail={detail} ctx={ctx} reloadToken={reloadToken} />
          )}
        </div>
      </div>

      {overlay?.kind === "lifecycle" ? (
        <LifecycleDialog
          kind={overlay.action}
          detail={detail}
          templates={reference.status === "ready" ? reference.data.readinessTemplates : null}
          onClose={() => setOverlay(null)}
          onSuccess={(next) => handleSuccess(next, actionSuccessMessage(overlay.action, journey.stage))}
          onFailure={handleFailure}
        />
      ) : null}
      {overlay?.kind === "assign" ? (
        <AssignDialog
          journeyId={journey.id}
          journeyReference={journey.journeyReference}
          currentOwnerId={journey.ownerId}
          isAdministrator={isAdministrator}
          users={directory.status === "ready" ? directory.data : null}
          onClose={() => setOverlay(null)}
          onSuccess={(next, name) => handleSuccess(next, `${journey.journeyReference} is now owned by ${name}.`)}
          onFailure={handleFailure}
        />
      ) : null}
      {overlay?.kind === "service_category" ? (
        <ServiceCategoryDialog
          journeyId={journey.id}
          current={journey.serviceCategory}
          categories={reference.status === "ready" ? reference.data.serviceCategories : null}
          onClose={() => setOverlay(null)}
          onSuccess={(next) => handleSuccess(next, actionSuccessMessage("edit_service_category"))}
          onFailure={handleFailure}
        />
      ) : null}
      {overlay?.kind === "contact" && detail.contact ? (
        <ContactEditor
          journeyId={journey.id}
          contact={detail.contact}
          contactTypes={reference.status === "ready" ? reference.data.contactTypes : undefined}
          onClose={() => setOverlay(null)}
          onSuccess={(next) => handleSuccess(next, actionSuccessMessage("edit_contact"))}
          onFailure={handleFailure}
        />
      ) : null}
      {overlay?.kind === "adopt" ? (
        <AdoptionPanel
          detail={detail}
          users={directory.status === "ready" ? directory.data : null}
          reference={reference.status === "ready" ? reference.data : null}
          onClose={() => setOverlay(null)}
          onSuccess={(next) => handleSuccess(next, actionSuccessMessage("adopt"))}
          onFailure={handleFailure}
        />
      ) : null}
    </div>
  );
}

// Read-only notice under the tab bar for Journeys nobody can change
// (UX Rev 4a §9.2 Cancelled, §14.3 Superseded, §36.1 Archived).
function ReadOnlyNotice({ detail }: { detail: JourneyDetail }) {
  const { journey } = detail;
  const text = journey.archivedAt
    ? "Archived Journeys are read-only."
    : journey.outcome === "superseded"
      ? "Superseded Journeys are kept as a permanent record."
      : journey.outcome === "cancelled"
        ? "Cancelled Journeys are read-only."
        : null;
  if (!text) return null;
  return <p className="pt-3 text-xs text-[var(--color-espresso)]/65">{text}</p>;
}

function MoreMenu({ items, note }: { items: Array<{ key: string; label: string; onSelect?: () => void; href?: string }>; note: string | null }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    containerRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const menuItems = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const index = menuItems.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      menuItems[(index + 1) % menuItems.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      menuItems[(index - 1 + menuItems.length) % menuItems.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const itemClass = "block w-full px-4 py-2.5 text-left text-sm text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_10%)] focus:bg-[rgb(245_149_28_/_10%)] focus:outline-none";

  return (
    <div ref={containerRef} className="relative" onKeyDown={open ? onMenuKeyDown : undefined}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-warm)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_8%)]"
      >
        <span aria-hidden="true">⋯</span> More
      </button>
      {open ? (
        <div role="menu" aria-label="More actions" className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-warm)] bg-white py-1 shadow-[var(--shadow-lg)]">
          {items.map((item) =>
            item.href ? (
              <Link key={item.key} role="menuitem" href={item.href} className={itemClass} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.label}
              </button>
            ),
          )}
          {note ? <p className="border-t border-[var(--color-border-warm)] px-4 py-2 text-xs text-[var(--color-espresso)]/60">{note}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function PencilGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M8.2 1.8l2 2L4 10H2v-2l6.2-6.2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function JourneySkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading Journey">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-16" />
      <Skeleton className="h-48" />
    </div>
  );
}
