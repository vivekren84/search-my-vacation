// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2):
// npm run verify:journey-workspace-list
// Active Journeys list rules (list.ts): URL round trip and leniency,
// departure presets, AND-combined filters (FR-JW-29 AC2), summary counts
// equal to the list each chip produces (FR-JW-34 AC1) and sorting (UX §20).

import {
  applyJourneyListQuery,
  chipQuery,
  computeJourneySummaryCounts,
  DEFAULT_JOURNEY_LIST_QUERY,
  departureRange,
  matchesJourneyListFilters,
  parseJourneyListQuery,
  serializeJourneyListQuery,
  SUMMARY_CHIPS,
} from "../list";
import type { JourneyListItem, JourneyListQuery } from "../types";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace list verification failed: ${message}`);
}

const TODAY = "2026-10-07"; // a Wednesday
const OWNER = "11111111-1111-4111-8111-111111111111";

let seq = 0;
function item(overrides: Partial<JourneyListItem>): JourneyListItem {
  seq += 1;
  return {
    id: `00000000-0000-4000-8000-${String(seq).padStart(12, "0")}`,
    journeyReference: `SMV-J-${seq}`,
    partyKind: "traveller",
    partyName: `Traveller ${seq}`,
    destinationRegion: "Kerala",
    serviceCategory: "fit",
    confirmedStartDate: null,
    confirmedEndDate: null,
    daysToDeparture: null,
    departingWithinWindow: false,
    stage: "confirmed",
    onHold: false,
    adoptionStatus: "adopted",
    readinessState: "not_ready",
    readinessMandatoryTotal: 0,
    primaryContactName: null,
    ownerId: OWNER,
    ownerName: "Owner",
    ownerActive: true,
    nextAction: "start_preparation",
    createdAt: `2026-09-${String(10 + seq).padStart(2, "0")}T10:00:00Z`,
    lastActivityAt: null,
    ...overrides,
  };
}

// ---- URL parsing and serialisation -----------------------------------

function params(query: string) {
  return new URLSearchParams(query);
}

assert(
  JSON.stringify(parseJourneyListQuery(params(""))) === JSON.stringify(DEFAULT_JOURNEY_LIST_QUERY),
  "empty URL gives the default query",
);
assert(serializeJourneyListQuery(DEFAULT_JOURNEY_LIST_QUERY) === "", "default query serialises to an empty string");

const full: JourneyListQuery = {
  scope: "team",
  ownerId: OWNER,
  stages: ["in_preparation", "ready_to_travel"],
  onHold: false,
  readiness: "at_risk",
  departing: true,
  departure: "custom",
  departureFrom: "2026-10-01",
  departureTo: "2026-10-31",
  q: "Kerala trip",
  sort: "last_activity",
  groupByStage: true,
};
const roundTrip = parseJourneyListQuery(params(serializeJourneyListQuery(full)));
assert(JSON.stringify(roundTrip) === JSON.stringify(full), `round trip differs: ${JSON.stringify(roundTrip)}`);

const lenient = parseJourneyListQuery(
  params("scope=everyone&owner=not-a-uuid&stage=bogus,journey_closed,travelling&onHold=maybe&readiness=x&sort=random&departure=later&q=%20%20"),
);
assert(lenient.scope === "mine" && lenient.ownerId === null, "unknown scope falls back to mine without owner");
assert(JSON.stringify(lenient.stages) === JSON.stringify(["travelling"]), "unknown and terminal stages are dropped");
assert(lenient.onHold === null && lenient.readiness === null && lenient.sort === "departure", "unknown values fall back");
assert(lenient.departure === null && lenient.q === null, "unknown preset and blank search are ignored");
assert(parseJourneyListQuery(params(`scope=mine&owner=${OWNER}`)).ownerId === null, "owner applies only to Team scope");
assert(parseJourneyListQuery(params("departure=custom")).departure === null, "custom range without dates is ignored");
assert(parseJourneyListQuery(params("departure=custom&from=2026-13-40")).departure === null, "invalid custom dates are ignored");
assert(parseJourneyListQuery(params(`q=${"x".repeat(150)}`)).q?.length === 100, "search text is capped at 100");
assert(
  JSON.stringify(parseJourneyListQuery(params("stage=confirmed&stage=travelling")).stages) === JSON.stringify(["confirmed", "travelling"]),
  "repeated stage parameters are accepted",
);

// ---- Departure presets (weeks Monday–Sunday) -------------------------

const week = departureRange({ departure: "this_week", departureFrom: null, departureTo: null }, TODAY);
assert(week?.from === "2026-10-05" && week?.to === "2026-10-11", `this week ${JSON.stringify(week)}`);
const sunday = departureRange({ departure: "this_week", departureFrom: null, departureTo: null }, "2026-10-11");
assert(sunday?.from === "2026-10-05" && sunday?.to === "2026-10-11", "Sunday belongs to the week that started on Monday");
const next14 = departureRange({ departure: "next_14_days", departureFrom: null, departureTo: null }, TODAY);
assert(next14?.from === TODAY && next14?.to === "2026-10-21", `next 14 days ${JSON.stringify(next14)}`);
const month = departureRange({ departure: "this_month", departureFrom: null, departureTo: null }, "2028-02-10");
assert(month?.from === "2028-02-01" && month?.to === "2028-02-29", "this month handles leap February");
assert(departureRange({ departure: null, departureFrom: null, departureTo: null }, TODAY) === null, "no preset, no range");

// ---- Fixture ----------------------------------------------------------

const items: JourneyListItem[] = [
  item({ stage: "confirmed", confirmedStartDate: "2026-10-09", lastActivityAt: "2026-10-01T09:00:00Z" }),
  item({ stage: "in_preparation", readinessState: "at_risk", confirmedStartDate: "2026-10-15", departingWithinWindow: true, lastActivityAt: "2026-10-06T09:00:00Z" }),
  item({ stage: "in_preparation", readinessState: "ready", confirmedStartDate: "2026-11-20" }),
  item({ stage: "ready_to_travel", onHold: true, readinessState: "at_risk", confirmedStartDate: "2026-10-08", departingWithinWindow: true, lastActivityAt: "2026-10-05T09:00:00Z" }),
  item({ stage: "travelling", confirmedStartDate: "2026-10-01", confirmedEndDate: "2026-10-10" }),
  item({ stage: "post_travel", confirmedStartDate: "2026-09-01" }),
  // Legacy Journey: no dates, counted under Confirmed, never in readiness filters.
  item({ stage: "confirmed", adoptionStatus: "legacy_pending", readinessState: "at_risk", nextAction: "complete_adoption" }),
];

// ---- Filters combine with AND -----------------------------------------

const atRiskInPrep = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, stages: ["in_preparation"], readiness: "at_risk" }, TODAY);
assert(atRiskInPrep.length === 1 && atRiskInPrep[0].id === items[1].id, "stage AND readiness");
const heldDeparting = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, onHold: true, departing: true }, TODAY);
assert(heldDeparting.length === 1 && heldDeparting[0].id === items[3].id, "on hold AND departing");
const notHeld = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, onHold: false }, TODAY);
assert(notHeld.length === items.length - 1, "onHold=false excludes held Journeys");
const thisWeek = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, departure: "this_week" }, TODAY);
assert(
  thisWeek.length === 2 && thisWeek.every((row) => row.confirmedStartDate === "2026-10-08" || row.confirmedStartDate === "2026-10-09"),
  "departure preset uses the start date; undated Journeys excluded",
);
const openEnded = applyJourneyListQuery(
  items,
  { ...DEFAULT_JOURNEY_LIST_QUERY, departure: "custom", departureFrom: "2026-11-01", departureTo: null },
  TODAY,
);
assert(openEnded.length === 1 && openEnded[0].id === items[2].id, "custom range with only a start date");
assert(
  !matchesJourneyListFilters(items[6], { ...DEFAULT_JOURNEY_LIST_QUERY, readiness: "at_risk" }, TODAY),
  "legacy Journeys never match a readiness filter",
);
const multiStage = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, stages: ["confirmed", "travelling"] }, TODAY);
assert(multiStage.length === 3, "several stages combine with OR inside the stage filter");

// ---- Summary counts equal each chip's list (FR-JW-34 AC1) -------------

const counts = computeJourneySummaryCounts(items, TODAY);
for (const chip of SUMMARY_CHIPS) {
  const listed = applyJourneyListQuery(items, chipQuery(chip), TODAY).length;
  assert(counts[chip] === listed, `chip ${chip}: count ${counts[chip]} != list ${listed}`);
}
assert(counts.confirmed === 2 && counts.in_preparation === 2 && counts.ready_to_travel === 1, "stage counts");
assert(counts.at_risk === 2 && counts.on_hold === 1 && counts.departing === 2, "overlay counts");
assert(!("journey_closed" in counts), "Completed is not a summary chip");
const filteredBase = chipQuery("on_hold", { ...DEFAULT_JOURNEY_LIST_QUERY, stages: ["travelling"], readiness: "ready", sort: "created" });
assert(filteredBase.stages.length === 0 && filteredBase.readiness === null && filteredBase.sort === "created", "a chip clears filters, keeps sort");

// ---- Sorting ----------------------------------------------------------

const byDeparture = applyJourneyListQuery(items, DEFAULT_JOURNEY_LIST_QUERY, TODAY);
assert(byDeparture[0].confirmedStartDate === "2026-09-01", "departure ascending");
assert(byDeparture[byDeparture.length - 1].confirmedStartDate === null, "undated Journeys sort last");
const byActivity = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, sort: "last_activity" }, TODAY);
assert(byActivity[0].id === items[1].id && byActivity[1].id === items[3].id, "last activity newest first");
assert(byActivity[byActivity.length - 1].lastActivityAt === null, "no activity sorts last");
const byCreated = applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, sort: "created" }, TODAY);
assert(byCreated[0].id === items[items.length - 1].id, "created newest first");
const ties = applyJourneyListQuery(
  [item({ journeyReference: "SMV-J-10" }), item({ journeyReference: "SMV-J-9" })],
  DEFAULT_JOURNEY_LIST_QUERY,
  TODAY,
);
assert(ties[0].journeyReference === "SMV-J-9", "ties fall back to the reference in numeric order");
const input = [...items];
applyJourneyListQuery(items, { ...DEFAULT_JOURNEY_LIST_QUERY, sort: "created" }, TODAY);
assert(items.every((row, index) => row === input[index]), "sorting does not mutate the input");

console.log(`Journey Workspace list verification passed (${checks} checks).`);
