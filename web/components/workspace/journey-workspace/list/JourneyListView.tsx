"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.3): JW-01 Active Journeys
// (UX Rev 4a §7, §20, §23, §24; FR-JW-03, FR-JW-29, FR-JW-34; Sophie
// EBC-R1.3-WS13-020B C-04, C-08, C-10; PO Decision 3).
//
// - Every filter, the search and the sort live in the URL (list.ts parse /
//   serialize), so Dashboard links, shared links and Back restore the view.
// - Summary strip chips are toggles; a chip applies its own filter alone, so
//   its count always equals the list it shows (FR-JW-34 AC1).
// - Owner: Mine · Team, with a named-owner select under Team (C-10).
// - Hidden in Phase 1: alert glyph, "n of m Booked", Alerts filter and the
//   "Closed & Archived" link (C-04, C-08). No create action (FR-JW-05).
// - Group by stage is remembered per browser (UX §7.2); storage can be
//   unavailable, so every read and write is guarded.

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import { ToastStack, useWorkspaceToasts } from "@/components/workspace/shared/Toast";
import {
  chipQuery,
  DEFAULT_JOURNEY_LIST_QUERY,
  parseJourneyListQuery,
  serializeJourneyListQuery,
  SUMMARY_CHIPS,
  SUMMARY_STAGE_CHIPS,
} from "@/lib/workspace/journey-workspace/list";
import { WORKSPACE_JOURNEY_PLANNING_PATH, WORKSPACE_JOURNEY_WORKSPACE_PATH } from "@/lib/workspace/shared/constants";
import {
  JOURNEY_STAGES,
  type JourneyDeparturePreset,
  type JourneyListItem,
  type JourneyListQuery,
  type JourneyListResult,
  type JourneyStage,
  type JourneySummaryChip,
  type ReadinessState,
} from "@/lib/workspace/journey-workspace/types";

import AssignDialog from "../dialogs/AssignDialog";
import { callJourneyApi, serviceCategoryLabel, useDirectory, useReferenceData } from "../journeyApi";
import {
  formatDateRange,
  JOURNEY_STAGE_LABELS,
  NEXT_ACTION_LABELS,
  READINESS_LABELS,
  relativeDeparture,
} from "../journeyWorkspaceLabels";
import { Avatar, BUTTON_SECONDARY, INPUT, OverlayChip, ReadinessChip, Skeleton, StageBadge } from "../primitives";

const GROUP_PREFERENCE_KEY = "smv.journeyWorkspace.groupByStage";
const SEARCH_DEBOUNCE_MS = 350;

const PRESET_LABELS: Record<JourneyDeparturePreset, string> = {
  this_week: "This week",
  next_14_days: "Next 14 days",
  this_month: "This month",
  custom: "Custom range",
};

type ListState = { status: "loading" } | { status: "error" } | { status: "ready"; result: JourneyListResult };

export interface ListViewer {
  id: string;
  role: "administrator" | "privilege_user";
}

function readGroupPreference(): boolean {
  try {
    return window.localStorage.getItem(GROUP_PREFERENCE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeGroupPreference(value: boolean) {
  try {
    window.localStorage.setItem(GROUP_PREFERENCE_KEY, String(value));
  } catch {
    // Storage blocked (private window, policy): the toggle still works for this visit.
  }
}

// Readiness caption under Phase 1 (020B §3): shown only when there are no items.
export function readinessCaption(item: { readinessMandatoryTotal: number; stage: JourneyStage }, hasTemplate: boolean): string | null {
  if (!hasTemplate) return "No template yet";
  return item.readinessMandatoryTotal === 0 ? "No checklist items yet" : null;
}

function activeFilterCount(query: JourneyListQuery): number {
  return (
    query.stages.length +
    (query.onHold !== null ? 1 : 0) +
    (query.readiness ? 1 : 0) +
    (query.departing ? 1 : 0) +
    (query.departure ? 1 : 0) +
    (query.scope === "team" && query.ownerId ? 1 : 0)
  );
}

export default function JourneyListView({ viewer }: { viewer: ListViewer }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseJourneyListQuery(searchParams), [searchParams]);
  const apiKey = serializeJourneyListQuery({ ...query, groupByStage: false });

  const [state, setState] = useState<ListState>({ status: "loading" });
  const [searchText, setSearchText] = useState(query.q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [assignFor, setAssignFor] = useState<JourneyListItem | null>(null);
  const reference = useReferenceData();
  const directory = useDirectory();
  const { toasts, pushToast, dismissToast } = useWorkspaceToasts();
  const lastAppliedSearch = useRef(query.q ?? "");

  const setQuery = useCallback(
    (next: JourneyListQuery) => {
      const qs = serializeJourneyListQuery(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  // Restore the remembered "Group by stage" preference when the URL is silent.
  useEffect(() => {
    if (!searchParams.has("group") && readGroupPreference()) setQuery({ ...query, groupByStage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the search box in step with Back/Forward.
  useEffect(() => {
    if ((query.q ?? "") !== lastAppliedSearch.current) {
      lastAppliedSearch.current = query.q ?? "";
      setSearchText(query.q ?? "");
    }
  }, [query.q]);

  // Debounced search: results update after a short pause (UX §20).
  useEffect(() => {
    const trimmed = searchText.trim();
    if (trimmed === (query.q ?? "")) return;
    const timer = window.setTimeout(() => {
      lastAppliedSearch.current = trimmed;
      setQuery({ ...query, q: trimmed === "" ? null : trimmed });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchText, query, setQuery]);

  useEffect(() => {
    let cancelled = false;
    void callJourneyApi<JourneyListResult>(`/api/workspace/journey-workspace${apiKey ? `?${apiKey}` : ""}`).then((result) => {
      if (cancelled) return;
      setState(result.ok ? { status: "ready", result: result.data } : { status: "error" });
    });
    return () => {
      cancelled = true;
    };
  }, [apiKey, reloadToken]);

  const result = state.status === "ready" ? state.result : null;
  const windowDays = result?.departureWindowDays ?? 14;
  const filterCount = activeFilterCount(query);
  const users = directory.status === "ready" ? directory.data : null;
  const isAdministrator = viewer.role === "administrator";

  function chipLabel(chip: JourneySummaryChip): string {
    if (chip === "at_risk") return READINESS_LABELS.at_risk;
    if (chip === "departing") return `Departing ≤ ${windowDays} days`;
    if (chip === "on_hold") return "On Hold";
    return JOURNEY_STAGE_LABELS[chip];
  }

  function chipActive(chip: JourneySummaryChip): boolean {
    if (chip === "at_risk") return query.readiness === "at_risk";
    if (chip === "departing") return query.departing;
    if (chip === "on_hold") return query.onHold === true;
    return query.stages.length === 1 && query.stages[0] === chip;
  }

  function toggleChip(chip: JourneySummaryChip) {
    if (!chipActive(chip)) {
      setQuery(chipQuery(chip, query));
      return;
    }
    if (chip === "at_risk") setQuery({ ...query, readiness: null });
    else if (chip === "departing") setQuery({ ...query, departing: false });
    else if (chip === "on_hold") setQuery({ ...query, onHold: null });
    else setQuery({ ...query, stages: [] });
  }

  const clearedQuery: JourneyListQuery = {
    ...DEFAULT_JOURNEY_LIST_QUERY,
    scope: query.scope,
    sort: query.sort,
    groupByStage: query.groupByStage,
  };
  const clearHref = (() => {
    const qs = serializeJourneyListQuery(clearedQuery);
    return qs ? `${pathname}?${qs}` : pathname;
  })();

  const activeChips: Array<{ key: string; label: string; remove: () => void }> = [];
  for (const s of query.stages) activeChips.push({ key: `stage-${s}`, label: `Stage: ${JOURNEY_STAGE_LABELS[s]}`, remove: () => setQuery({ ...query, stages: query.stages.filter((x) => x !== s) }) });
  if (query.onHold !== null) activeChips.push({ key: "hold", label: query.onHold ? "On hold" : "Not on hold", remove: () => setQuery({ ...query, onHold: null }) });
  if (query.readiness) activeChips.push({ key: "readiness", label: `Readiness: ${READINESS_LABELS[query.readiness]}`, remove: () => setQuery({ ...query, readiness: null }) });
  if (query.departing) activeChips.push({ key: "departing", label: `Departing ≤ ${windowDays} days`, remove: () => setQuery({ ...query, departing: false }) });
  if (query.departure) {
    const label =
      query.departure === "custom"
        ? `Departure: ${formatDateRange(query.departureFrom, query.departureTo) ?? "custom"}`
        : `Departure: ${PRESET_LABELS[query.departure]}`;
    activeChips.push({ key: "departure", label, remove: () => setQuery({ ...query, departure: null, departureFrom: null, departureTo: null }) });
  }
  if (query.scope === "team" && query.ownerId) {
    const name = users?.find((u) => u.userId === query.ownerId)?.displayName ?? "Selected owner";
    activeChips.push({ key: "owner", label: `Owner: ${name}`, remove: () => setQuery({ ...query, ownerId: null }) });
  }

  return (
    <div className="flex flex-col gap-5">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Summary strip (FR-JW-34) */}
      <div role="group" aria-label="Summary by stage and status" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
        {SUMMARY_CHIPS.map((chip) => {
          const active = chipActive(chip);
          const count = result ? result.counts[chip] : null;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => toggleChip(chip)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-[var(--color-amber)] bg-[linear-gradient(135deg,rgb(245_149_28_/_14%),rgb(40_3_54_/_6%))] text-[var(--color-primary)]"
                  : "border-[var(--color-border-warm)] bg-white text-[var(--color-espresso)]/75 hover:bg-[rgb(245_149_28_/_7%)]"
              }`}
            >
              <span>{chipLabel(chip)}</span>
              <span className="min-w-[1.25rem] rounded-full bg-[var(--color-espresso)]/8 px-1.5 text-center tabular-nums">{count ?? "–"}</span>
            </button>
          );
        })}
      </div>

      {/* Search, owner scope and filters (JW-10) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">Search Journeys</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by reference, traveller, mobile, contact or destination"
              className={INPUT}
              maxLength={100}
            />
          </label>
          <div role="group" aria-label="Owner" className="inline-flex rounded-full border border-[var(--color-border-warm)] bg-white p-0.5">
            {(["mine", "team"] as const).map((scope) => (
              <button
                key={scope}
                type="button"
                aria-pressed={query.scope === scope}
                onClick={() => setQuery({ ...query, scope, ownerId: null })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  query.scope === scope ? "bg-[var(--color-espresso)] text-white" : "text-[var(--color-espresso)]/70 hover:bg-[rgb(245_149_28_/_8%)]"
                }`}
              >
                {scope === "mine" ? "Mine" : "Team"}
              </button>
            ))}
          </div>
          {query.scope === "team" ? (
            <label className="flex items-center gap-2 text-sm text-[var(--color-espresso)]">
              <span className="sr-only">Owner</span>
              <select
                value={query.ownerId ?? ""}
                onChange={(event) => setQuery({ ...query, ownerId: event.target.value || null })}
                className={`${INPUT} w-auto`}
              >
                <option value="">Everyone</option>
                {(users ?? [])
                  .slice()
                  .sort((a, b) => a.displayName.localeCompare(b.displayName))
                  .map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.displayName}
                      {user.isActive ? "" : " (deactivated)"}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}
          <button type="button" className={`${BUTTON_SECONDARY} lg:hidden`} aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
            Filters{filterCount > 0 ? ` (${filterCount})` : ""}
          </button>
        </div>

        <div className={`${filtersOpen ? "flex" : "hidden"} flex-wrap items-end gap-3 lg:flex`}>
          <StageFilter selected={query.stages} onChange={(stages) => setQuery({ ...query, stages })} />
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
            On Hold
            <select
              value={query.onHold === null ? "" : String(query.onHold)}
              onChange={(event) => setQuery({ ...query, onHold: event.target.value === "" ? null : event.target.value === "true" })}
              className={`${INPUT} w-auto`}
            >
              <option value="">Any</option>
              <option value="true">On hold</option>
              <option value="false">Not on hold</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
            Readiness
            <select
              value={query.readiness ?? ""}
              onChange={(event) => setQuery({ ...query, readiness: (event.target.value || null) as ReadinessState | null })}
              className={`${INPUT} w-auto`}
            >
              <option value="">Any</option>
              {(["not_ready", "at_risk", "ready"] as const).map((r) => (
                <option key={r} value={r}>
                  {READINESS_LABELS[r]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
            Departure
            <select
              value={query.departure ?? ""}
              onChange={(event) => {
                const value = (event.target.value || null) as JourneyDeparturePreset | null;
                setQuery({ ...query, departure: value, departureFrom: value === "custom" ? query.departureFrom : null, departureTo: value === "custom" ? query.departureTo : null });
              }}
              className={`${INPUT} w-auto`}
            >
              <option value="">Any date</option>
              {(Object.keys(PRESET_LABELS) as JourneyDeparturePreset[]).map((preset) => (
                <option key={preset} value={preset}>
                  {PRESET_LABELS[preset]}
                </option>
              ))}
            </select>
          </label>
          {query.departure === "custom" ? (
            <>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
                From
                <input type="date" value={query.departureFrom ?? ""} onChange={(e) => setQuery({ ...query, departureFrom: e.target.value || null })} className={`${INPUT} w-auto`} />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
                To
                <input type="date" value={query.departureTo ?? ""} onChange={(e) => setQuery({ ...query, departureTo: e.target.value || null })} className={`${INPUT} w-auto`} />
              </label>
            </>
          ) : null}
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--color-espresso)]/70">
            Sort
            <select
              value={query.sort}
              onChange={(event) => setQuery({ ...query, sort: event.target.value as JourneyListQuery["sort"] })}
              className={`${INPUT} w-auto`}
            >
              <option value="departure">Departure date</option>
              <option value="last_activity">Last activity</option>
              <option value="created">Created</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm text-[var(--color-espresso)]">
            <input
              type="checkbox"
              checked={query.groupByStage}
              onChange={(event) => {
                writeGroupPreference(event.target.checked);
                setQuery({ ...query, groupByStage: event.target.checked });
              }}
            />
            Group by stage
          </label>
        </div>

        {activeChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-warm)] bg-white px-3 py-1 text-xs text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_8%)]"
              >
                {chip.label}
                <span aria-hidden="true">×</span>
                <span className="sr-only">(remove filter)</span>
              </button>
            ))}
            <Link href={clearHref} replace scroll={false} className="text-xs font-semibold text-[var(--color-espresso)] underline underline-offset-2">
              Clear all
            </Link>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {result ? `${result.items.length} Journey${result.items.length === 1 ? "" : "s"} shown` : ""}
      </p>

      {state.status === "loading" ? <ListSkeleton /> : null}

      {state.status === "error" ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white px-4 py-6 text-sm text-[var(--color-espresso)]">
          Couldn&apos;t load Journeys.{" "}
          <button type="button" className="font-semibold underline underline-offset-2" onClick={() => {
            setState({ status: "loading" });
            setReloadToken((n) => n + 1);
          }}>
            Try again
          </button>
        </div>
      ) : null}

      {result && result.items.length === 0 ? (
        filterCount === 0 && !query.q && SUMMARY_CHIPS.every((chip) => result.counts[chip] === 0) ? (
          <EmptyState
            title="No active Journeys right now."
            description="Journeys appear here automatically when a Journey Planning record is confirmed."
            action={{ label: "Go to Journey Planning", href: WORKSPACE_JOURNEY_PLANNING_PATH }}
          />
        ) : (
          <EmptyState
            title="Nothing matches these filters."
            description="Try widening your search or clearing a filter."
            action={{ label: "Clear filters", href: clearHref }}
          />
        )
      ) : null}

      {result && result.items.length > 0 ? (
        query.groupByStage ? (
          <div className="flex flex-col gap-6">
            {JOURNEY_STAGES.filter((s) => result.items.some((item) => item.stage === s)).map((s) => (
              <section key={s} aria-labelledby={`group-${s}`} className="flex flex-col gap-2">
                <h2 id={`group-${s}`} className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-espresso)]/60">
                  {JOURNEY_STAGE_LABELS[s]} · {result.items.filter((item) => item.stage === s).length}
                </h2>
                <JourneyRows
                  items={result.items.filter((item) => item.stage === s)}
                  today={result.today}
                  viewer={viewer}
                  reference={reference}
                  onAssign={setAssignFor}
                />
              </section>
            ))}
          </div>
        ) : (
          <JourneyRows items={result.items} today={result.today} viewer={viewer} reference={reference} onAssign={setAssignFor} />
        )
      ) : null}

      {assignFor ? (
        <AssignDialog
          journeyId={assignFor.id}
          journeyReference={assignFor.journeyReference}
          currentOwnerId={assignFor.ownerId}
          isAdministrator={isAdministrator}
          users={users}
          onClose={() => setAssignFor(null)}
          onSuccess={(_detail, name) => {
            setAssignFor(null);
            pushToast(`${assignFor.journeyReference} is now owned by ${name}.`, "success");
            setReloadToken((n) => n + 1);
          }}
          onFailure={(failure) => {
            setAssignFor(null);
            pushToast(failure.message, "error");
            setReloadToken((n) => n + 1);
          }}
        />
      ) : null}
    </div>
  );
}

function StageFilter({ selected, onChange }: { selected: JourneyStage[]; onChange: (stages: JourneyStage[]) => void }) {
  return (
    <details className="relative">
      <summary className={`${INPUT} flex w-auto cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden`}>
        <span className="text-xs font-semibold text-[var(--color-espresso)]/70">Stage</span>
        <span>{selected.length === 0 ? "All" : `${selected.length} selected`}</span>
        <span aria-hidden="true" className="text-xs text-[var(--color-espresso)]/40">▾</span>
      </summary>
      <fieldset className="absolute left-0 top-[calc(100%+0.25rem)] z-30 flex w-56 flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-3 shadow-[var(--shadow-lg)]">
        <legend className="sr-only">Stage</legend>
        {SUMMARY_STAGE_CHIPS.map((s) => (
          <label key={s} className="flex items-center gap-2 rounded px-1 py-1 text-sm text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_7%)]">
            <input
              type="checkbox"
              checked={selected.includes(s)}
              onChange={(event) => onChange(event.target.checked ? [...selected, s] : selected.filter((x) => x !== s))}
            />
            {JOURNEY_STAGE_LABELS[s]}
          </label>
        ))}
      </fieldset>
    </details>
  );
}

function JourneyRows({
  items,
  today,
  viewer,
  reference,
  onAssign,
}: {
  items: JourneyListItem[];
  today: string;
  viewer: ListViewer;
  reference: ReturnType<typeof useReferenceData>;
  onAssign: (item: JourneyListItem) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border-warm)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white">
      {items.map((item) => (
        <JourneyRow key={item.id} item={item} today={today} viewer={viewer} reference={reference} onAssign={onAssign} />
      ))}
    </ul>
  );
}

function JourneyRow({
  item,
  today,
  viewer,
  reference,
  onAssign,
}: {
  item: JourneyListItem;
  today: string;
  viewer: ListViewer;
  reference: ReturnType<typeof useReferenceData>;
  onAssign: (item: JourneyListItem) => void;
}) {
  const legacy = item.adoptionStatus === "legacy_pending";
  const dates = formatDateRange(item.confirmedStartDate, item.confirmedEndDate);
  const relative = relativeDeparture(item.confirmedStartDate, item.confirmedEndDate, today);
  const canAssign = !legacy && (viewer.role === "administrator" || item.ownerId === viewer.id);
  const category = serviceCategoryLabel(reference, item.serviceCategory);
  const hasTemplate = item.stage !== "confirmed" || item.readinessMandatoryTotal > 0;

  return (
    <li className="relative flex items-start gap-3 px-4 py-3 transition hover:bg-[rgb(245_149_28_/_4%)]">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link
            href={`${WORKSPACE_JOURNEY_WORKSPACE_PATH}/${item.id}`}
            className="text-sm font-bold text-[var(--color-espresso)] after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-[var(--radius-md)] focus-visible:after:ring-2 focus-visible:after:ring-[var(--color-amber)]"
          >
            <span className="tabular-nums">{item.journeyReference}</span>
            <span className="font-normal text-[var(--color-espresso)]/40"> · </span>
            {item.partyName ?? "Unnamed party"}
            {item.destinationRegion ? <span className="font-normal text-[var(--color-espresso)]/70"> · {item.destinationRegion}</span> : null}
          </Link>
          <span className="flex flex-wrap items-center gap-1.5">
            {legacy ? <OverlayChip kind="legacy" /> : <StageBadge stage={item.stage} />}
            {item.onHold ? <OverlayChip kind="on_hold" /> : null}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-espresso)]/70">
          <span>
            {dates ?? "Dates not set"}
            {relative ? ` · ${relative}` : ""}
          </span>
          {!legacy ? <ReadinessChip state={item.readinessState} caption={readinessCaption(item, hasTemplate)} /> : null}
          {category ? <span>{category}</span> : null}
          {item.primaryContactName ? (
            <span>
              <abbr title="Primary Operational Contact" className="no-underline">
                POC
              </abbr>
              : {item.primaryContactName}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={item.ownerName} size="sm" />
            {item.ownerName ?? "No owner"}
            {item.ownerName && !item.ownerActive ? " (deactivated)" : ""}
          </span>
          <span className="font-semibold text-[var(--color-espresso)]/85">
            Next: {legacy ? "Awaiting adoption" : NEXT_ACTION_LABELS[item.nextAction]}
          </span>
        </div>
      </div>
      {canAssign ? <RowMenu item={item} isAdministrator={viewer.role === "administrator"} onAssign={onAssign} /> : null}
    </li>
  );
}

function RowMenu({ item, isAdministrator, onAssign }: { item: JourneyListItem; isAdministrator: boolean; onAssign: (item: JourneyListItem) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative z-10 shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More actions for ${item.journeyReference}`}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full text-lg text-[var(--color-espresso)]/60 hover:bg-[rgb(245_149_28_/_10%)]"
      >
        ⋯
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-[calc(100%+0.25rem)] z-30 w-44 rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white p-1 shadow-[var(--shadow-lg)]">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onAssign(item);
            }}
            className="block w-full rounded-[var(--radius-md)] px-3 py-2 text-left text-sm text-[var(--color-espresso)] hover:bg-[rgb(245_149_28_/_8%)]"
          >
            {isAdministrator ? "Reassign…" : "Assign to…"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul aria-label="Loading Journeys" className="flex flex-col divide-y divide-[var(--color-border-warm)] rounded-[var(--radius-lg)] border border-[var(--color-border-warm)] bg-white">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex flex-col gap-2 px-4 py-4">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </li>
      ))}
    </ul>
  );
}
