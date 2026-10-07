// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2): Active Journeys list
// logic (JW-01; UX Rev 4a §7, §20; FR-JW-03, FR-JW-29, FR-JW-34; PO
// Decision 3). Pure: no I/O, so the same rules drive the API, the
// Milestone B list page's URL state and verify:journey-workspace-list.
//
// The service loads every active Journey visible in the chosen scope
// (owner filter and search applied), then this module applies the filters,
// computes the summary strip and sorts. At internal scale this is one view
// query (Archie 020A AR-F9); revisit only with profiling evidence.

import { isIsoDate } from "../shared/time/businessDate";
import {
  JOURNEY_STAGES,
  type JourneyDeparturePreset,
  type JourneyListItem,
  type JourneyListQuery,
  type JourneyListSort,
  type JourneyStage,
  type JourneySummaryChip,
  type JourneySummaryCounts,
  type ReadinessState,
} from "./types";

// Stages shown as summary-strip chips: the active D-01 stages; Journey
// Closed is terminal and never listed (UX §7.2).
export const SUMMARY_STAGE_CHIPS: readonly JourneyStage[] = JOURNEY_STAGES.filter((stage) => stage !== "journey_closed");
export const SUMMARY_CHIPS: readonly JourneySummaryChip[] = [...SUMMARY_STAGE_CHIPS, "at_risk", "departing", "on_hold"];

const SORTS: readonly JourneyListSort[] = ["departure", "last_activity", "created"];
const PRESETS: readonly JourneyDeparturePreset[] = ["this_week", "next_14_days", "this_month", "custom"];
const READINESS: readonly ReadinessState[] = ["not_ready", "at_risk", "ready"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const JOURNEY_SEARCH_MAX_LENGTH = 100;

export const DEFAULT_JOURNEY_LIST_QUERY: JourneyListQuery = {
  scope: "mine",
  ownerId: null,
  stages: [],
  onHold: null,
  readiness: null,
  departing: false,
  departure: null,
  departureFrom: null,
  departureTo: null,
  q: null,
  sort: "departure",
  groupByStage: false,
};

interface SearchParamsLike {
  get(name: string): string | null;
  getAll(name: string): string[];
}

// Lenient by design: shared links and Dashboard deep links must never fail
// because one parameter is stale; unknown values fall back to defaults.
export function parseJourneyListQuery(params: SearchParamsLike): JourneyListQuery {
  const scope = params.get("scope") === "team" ? "team" : "mine";
  const ownerRaw = params.get("owner");
  const stageValues = params.getAll("stage").flatMap((value) => value.split(","));
  const stages = SUMMARY_STAGE_CHIPS.filter((stage) => stageValues.includes(stage));
  const onHoldRaw = params.get("onHold");
  const readinessRaw = params.get("readiness");
  const departureRaw = params.get("departure");
  const fromRaw = params.get("from");
  const toRaw = params.get("to");
  const qRaw = (params.get("q") ?? "").trim().slice(0, JOURNEY_SEARCH_MAX_LENGTH);
  const sortRaw = params.get("sort");

  const departure = PRESETS.includes(departureRaw as JourneyDeparturePreset) ? (departureRaw as JourneyDeparturePreset) : null;
  const departureFrom = departure === "custom" && isIsoDate(fromRaw) ? fromRaw : null;
  const departureTo = departure === "custom" && isIsoDate(toRaw) ? toRaw : null;

  return {
    scope,
    ownerId: scope === "team" && ownerRaw && UUID_PATTERN.test(ownerRaw) ? ownerRaw : null,
    stages,
    onHold: onHoldRaw === "true" ? true : onHoldRaw === "false" ? false : null,
    readiness: READINESS.includes(readinessRaw as ReadinessState) ? (readinessRaw as ReadinessState) : null,
    departing: params.get("departing") === "true",
    departure: departure === "custom" && !departureFrom && !departureTo ? null : departure,
    departureFrom,
    departureTo,
    q: qRaw === "" ? null : qRaw,
    sort: SORTS.includes(sortRaw as JourneyListSort) ? (sortRaw as JourneyListSort) : "departure",
    groupByStage: params.get("group") === "stage",
  };
}

// Inverse of parseJourneyListQuery; omits defaults so URLs stay short.
export function serializeJourneyListQuery(query: JourneyListQuery): string {
  const params = new URLSearchParams();
  if (query.scope === "team") params.set("scope", "team");
  if (query.scope === "team" && query.ownerId) params.set("owner", query.ownerId);
  if (query.stages.length > 0) params.set("stage", query.stages.join(","));
  if (query.onHold !== null) params.set("onHold", String(query.onHold));
  if (query.readiness) params.set("readiness", query.readiness);
  if (query.departing) params.set("departing", "true");
  if (query.departure) params.set("departure", query.departure);
  if (query.departure === "custom" && query.departureFrom) params.set("from", query.departureFrom);
  if (query.departure === "custom" && query.departureTo) params.set("to", query.departureTo);
  if (query.q) params.set("q", query.q);
  if (query.sort !== "departure") params.set("sort", query.sort);
  if (query.groupByStage) params.set("group", "stage");
  return params.toString();
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

// Departure presets (UX §20) in business dates. Weeks run Monday–Sunday.
export function departureRange(query: Pick<JourneyListQuery, "departure" | "departureFrom" | "departureTo">, today: string):
  | { from: string | null; to: string | null }
  | null {
  switch (query.departure) {
    case "this_week": {
      const [y, m, d] = today.split("-").map(Number);
      const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // Monday = 0
      return { from: addDays(today, -weekday), to: addDays(today, 6 - weekday) };
    }
    case "next_14_days":
      return { from: today, to: addDays(today, 14) };
    case "this_month": {
      const [y, m] = today.split("-").map(Number);
      const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
      return { from: `${today.slice(0, 7)}-01`, to: `${today.slice(0, 7)}-${String(last).padStart(2, "0")}` };
    }
    case "custom":
      return { from: query.departureFrom, to: query.departureTo };
    default:
      return null;
  }
}

// FR-JW-29 AC2: filters combine with AND.
export function matchesJourneyListFilters(item: JourneyListItem, query: JourneyListQuery, today: string): boolean {
  if (query.stages.length > 0 && !query.stages.includes(item.stage)) return false;
  if (query.onHold !== null && item.onHold !== query.onHold) return false;
  if (query.readiness && (item.adoptionStatus !== "adopted" || item.readinessState !== query.readiness)) return false;
  if (query.departing && !item.departingWithinWindow) return false;
  const range = departureRange(query, today);
  if (range) {
    if (!item.confirmedStartDate) return false;
    if (range.from && item.confirmedStartDate < range.from) return false;
    if (range.to && item.confirmedStartDate > range.to) return false;
  }
  return true;
}

// The query a single summary-strip chip applies on its own.
export function chipQuery(chip: JourneySummaryChip, base: JourneyListQuery = DEFAULT_JOURNEY_LIST_QUERY): JourneyListQuery {
  const cleared: JourneyListQuery = {
    ...base,
    stages: [],
    onHold: null,
    readiness: null,
    departing: false,
    departure: null,
    departureFrom: null,
    departureTo: null,
  };
  if (chip === "at_risk") return { ...cleared, readiness: "at_risk" };
  if (chip === "departing") return { ...cleared, departing: true };
  if (chip === "on_hold") return { ...cleared, onHold: true };
  return { ...cleared, stages: [chip] };
}

// FR-JW-34 AC1: each chip's count equals the size of the list that chip
// alone produces over the same scope, owner and search.
export function computeJourneySummaryCounts(items: JourneyListItem[], today: string): JourneySummaryCounts {
  const counts = Object.fromEntries(SUMMARY_CHIPS.map((chip) => [chip, 0])) as JourneySummaryCounts;
  for (const chip of SUMMARY_CHIPS) {
    const query = chipQuery(chip);
    counts[chip] = items.filter((item) => matchesJourneyListFilters(item, query, today)).length;
  }
  return counts;
}

// Nulls (legacy Journeys without dates, Journeys without activity) sort last.
function compareNullable(a: string | null, b: string | null, direction: 1 | -1): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a < b ? -1 : 1) * direction;
}

// UX §20: Departure ascending (default), Last activity (newest first),
// Created (newest first). Ties fall back to the reference for stable order.
export function sortJourneyListItems(items: JourneyListItem[], sort: JourneyListSort): JourneyListItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const result =
      sort === "departure"
        ? compareNullable(a.confirmedStartDate, b.confirmedStartDate, 1)
        : sort === "last_activity"
          ? compareNullable(a.lastActivityAt, b.lastActivityAt, -1)
          : compareNullable(a.createdAt, b.createdAt, -1);
    return result !== 0 ? result : a.journeyReference.localeCompare(b.journeyReference, "en", { numeric: true });
  });
  return copy;
}

export function applyJourneyListQuery(items: JourneyListItem[], query: JourneyListQuery, today: string): JourneyListItem[] {
  return sortJourneyListItems(items.filter((item) => matchesJourneyListFilters(item, query, today)), query.sort);
}
