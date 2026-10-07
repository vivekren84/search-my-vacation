// EBC-R1.3-WS13-022 Phase 1 Milestone A (WP-1.2):
// npm run verify:journey-workspace-actions
// Action availability (getAvailableJourneyActions; plan §8.4 role matrix,
// UX Rev 4a §9.3) and the Phase 1 input rules the service applies before
// calling the M11 RPCs (reason/note limits, contact, adoption dates and
// nights, History filter and cursor). The RPCs repeat every rule; the
// database side is covered by the local M11 suite (198 checks).

import { getAvailableJourneyActions, journeyHistoryCategory, journeyHistoryEventTypes, type JourneyActionInput } from "../derivations";
import { JOURNEY_ACTION_KINDS, JOURNEY_STAGES, type AvailableJourneyActions, type JourneyActionKind, type JourneyStage } from "../types";
import {
  canViewTeamScope,
  decodeJourneyHistoryCursor,
  deriveAdoptionNights,
  encodeJourneyHistoryCursor,
  isJourneyStage,
  isUuid,
  normaliseJourneyNote,
  normaliseJourneyReason,
  parseJourneyHistoryFilter,
  validateAdoptionDates,
  validateOperationalContactInput,
} from "../validation";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Journey Workspace action verification failed: ${message}`);
}

const TODAY = "2026-10-07";
const OWNER = { id: "11111111-1111-4111-8111-111111111111", role: "privilege_user" as const };
const OTHER = { id: "22222222-2222-4222-8222-222222222222", role: "privilege_user" as const };
const ADMIN = { id: "33333333-3333-4333-8333-333333333333", role: "administrator" as const };
const TEMPLATE = "44444444-4444-4444-8444-444444444444";

function journey(overrides: Partial<JourneyActionInput> = {}): JourneyActionInput {
  return {
    stage: "confirmed",
    outcome: null,
    onHold: false,
    archivedAt: null,
    adoptionStatus: "adopted",
    ownerId: OWNER.id,
    readinessTemplateId: null,
    readinessMandatoryUnresolved: 0,
    confirmedStartDate: "2026-10-20",
    confirmedEndDate: "2026-10-25",
    ...overrides,
  };
}

function visible(result: AvailableJourneyActions): JourneyActionKind[] {
  return JOURNEY_ACTION_KINDS.filter((kind) => result.actions[kind].state !== "hidden");
}

function same(a: JourneyActionKind[], b: JourneyActionKind[]): boolean {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

// ---- Read-only cases ---------------------------------------------------

for (const viewer of [OWNER, OTHER, ADMIN]) {
  const archived = getAvailableJourneyActions(journey({ archivedAt: "2026-10-01T00:00:00Z" }), viewer, TODAY);
  assert(archived.readOnlyReason === "archived" && visible(archived).length === 0 && archived.primary === null, "archived: nothing");
  for (const terminal of [journey({ stage: "journey_closed" }), journey({ outcome: "cancelled" }), journey({ outcome: "superseded", stage: "in_preparation" })]) {
    const result = getAvailableJourneyActions(terminal, viewer, TODAY);
    assert(result.readOnlyReason === "terminal" && visible(result).length === 0, "terminal: nothing");
  }
}

const legacy = journey({ adoptionStatus: "legacy_pending", ownerId: null, confirmedStartDate: null, confirmedEndDate: null });
const legacyAdmin = getAvailableJourneyActions(legacy, ADMIN, TODAY);
assert(legacyAdmin.primary === "adopt" && same(visible(legacyAdmin), ["adopt"]), "legacy: Administrator can only adopt");
for (const viewer of [OWNER, OTHER]) {
  const result = getAvailableJourneyActions({ ...legacy, ownerId: viewer.id }, viewer, TODAY);
  assert(result.readOnlyReason === "legacy_awaiting_adoption" && visible(result).length === 0, "legacy: users see awaiting adoption");
}

for (const stage of JOURNEY_STAGES.filter((value) => value !== "journey_closed")) {
  const result = getAvailableJourneyActions(journey({ stage }), OTHER, TODAY);
  assert(result.readOnlyReason === "not_owner" && visible(result).length === 0, `non-owner at ${stage}: hidden`);
}
const unowned = getAvailableJourneyActions(journey({ ownerId: null }), OWNER, TODAY);
assert(unowned.readOnlyReason === "not_owner", "an unowned Journey is read-only for users");
assert(getAvailableJourneyActions(journey({ ownerId: null }), ADMIN, TODAY).readOnlyReason === null, "Administrator acts on an unowned Journey");

// ---- Owner and Administrator, per stage ---------------------------------

const COMMON: JourneyActionKind[] = ["reassign", "edit_service_category", "edit_contact"];
const expected: Record<Exclude<JourneyStage, "journey_closed">, { primary: JourneyActionKind; extra: JourneyActionKind[] }> = {
  confirmed: { primary: "start_preparation", extra: ["cancel", "place_on_hold"] },
  in_preparation: { primary: "mark_ready_to_travel", extra: ["cancel", "place_on_hold"] },
  ready_to_travel: { primary: "mark_travelling", extra: ["cancel", "place_on_hold", "step_back"] },
  travelling: { primary: "mark_travel_complete", extra: ["cancel"] },
  travel_complete: { primary: "begin_post_travel", extra: [] },
  post_travel: { primary: "mark_completed", extra: [] },
};
for (const viewer of [OWNER, ADMIN]) {
  for (const [stage, spec] of Object.entries(expected) as Array<[Exclude<JourneyStage, "journey_closed">, (typeof expected)["confirmed"]]>) {
    const result = getAvailableJourneyActions(journey({ stage, readinessTemplateId: TEMPLATE }), viewer, TODAY);
    assert(result.readOnlyReason === null && result.primary === spec.primary, `${viewer.role} ${stage}: primary ${result.primary}`);
    assert(same(visible(result), [spec.primary, ...spec.extra, ...COMMON]), `${viewer.role} ${stage}: ${visible(result).join(",")}`);
  }
}

// On Hold: primary Resume; cancel, reassign and edits remain; no forward step.
for (const stage of ["confirmed", "in_preparation", "ready_to_travel"] as const) {
  const held = getAvailableJourneyActions(journey({ stage, onHold: true }), OWNER, TODAY);
  assert(held.primary === "resume" && same(visible(held), ["resume", "cancel", ...COMMON]), `on hold at ${stage}: ${visible(held).join(",")}`);
}

// ---- Disabled forward actions ------------------------------------------

const noTemplate = getAvailableJourneyActions(journey({ stage: "in_preparation" }), OWNER, TODAY).actions.mark_ready_to_travel;
assert(noTemplate.state === "disabled" && noTemplate.reason === "template_required", "In Preparation without a template");
const outstanding = getAvailableJourneyActions(
  journey({ stage: "in_preparation", readinessTemplateId: TEMPLATE, readinessMandatoryUnresolved: 3 }),
  OWNER,
  TODAY,
).actions.mark_ready_to_travel;
assert(outstanding.state === "disabled" && outstanding.reason === "readiness_outstanding" && outstanding.outstandingCount === 3, "readiness outstanding");
const emptyTemplate = getAvailableJourneyActions(journey({ stage: "in_preparation", readinessTemplateId: TEMPLATE }), OWNER, TODAY);
assert(emptyTemplate.actions.mark_ready_to_travel.state === "available", "PO Decision 4: empty template never blocks");

const early = getAvailableJourneyActions(journey({ stage: "ready_to_travel", confirmedStartDate: "2026-10-08" }), OWNER, TODAY).actions.mark_travelling;
assert(early.state === "disabled" && early.reason === "before_start_date" && early.availableFrom === "2026-10-08", "before departure");
const onDay = getAvailableJourneyActions(journey({ stage: "ready_to_travel", confirmedStartDate: TODAY }), OWNER, TODAY).actions.mark_travelling;
assert(onDay.state === "available", "available on the departure date");
const notBack = getAvailableJourneyActions(journey({ stage: "travelling", confirmedEndDate: "2026-10-08" }), OWNER, TODAY).actions.mark_travel_complete;
assert(notBack.state === "disabled" && notBack.reason === "before_end_date", "before return");
const back = getAvailableJourneyActions(journey({ stage: "travelling", confirmedEndDate: TODAY }), OWNER, TODAY).actions.mark_travel_complete;
assert(back.state === "available", "available on the return date");

// ---- Role helpers --------------------------------------------------------

assert(canViewTeamScope("administrator") && canViewTeamScope("privilege_user"), "PO Decision 3: every role sees the team list");
assert(!canViewTeamScope(null) && !canViewTeamScope(undefined), "no role, no team scope");
assert(isJourneyStage("travel_complete") && !isJourneyStage("closed") && !isJourneyStage(7), "isJourneyStage");
assert(isUuid(TEMPLATE) && !isUuid("x") && !isUuid(null), "isUuid");

// ---- Reason and note (M11 limits) ----------------------------------------

const blank = normaliseJourneyReason("   ");
assert("issue" in blank && blank.issue.code === "reason_required", "blank reason");
const longReason = normaliseJourneyReason("r".repeat(501));
assert("issue" in longReason && longReason.issue.code === "reason_too_long", "reason over 500");
const okReason = normaliseJourneyReason(`  ${"r".repeat(500)}  `);
assert("value" in okReason && okReason.value.length === 500, "reason trimmed, 500 allowed");
const nullNote = normaliseJourneyNote(undefined);
assert("value" in nullNote && nullNote.value === null, "missing note is null");
const longNote = normaliseJourneyNote("n".repeat(1001));
assert("issue" in longNote && longNote.issue.code === "note_too_long", "note over 1000");

// ---- Contact (BR-040) -----------------------------------------------------

const allMissing = validateOperationalContactInput({});
assert("issues" in allMissing && allMissing.issues.length === 3, "type, name and phone/email reported together");
const corporateNoOrg = validateOperationalContactInput({ contactType: "corporate_organisation", name: "A", email: "a@example.com" });
assert("issues" in corporateNoOrg && corporateNoOrg.issues[0].field === "organisation", "corporate needs an organisation");
const b2bNoOrg = validateOperationalContactInput({ contactType: "b2b_travel_partner", name: "A", phone: "1" });
assert("issues" in b2bNoOrg, "B2B partner needs an organisation");
const person = validateOperationalContactInput({ contactType: "individual_traveller", name: "  Asha  ", phone: " 98 ", email: "  " });
assert(
  "value" in person && person.value.name === "Asha" && person.value.phone === "98" && person.value.email === null && person.value.organisation === null,
  "trimmed values; blanks become null",
);
assert("issues" in validateOperationalContactInput({ contactType: "vendor", name: "A", phone: "1" }), "unknown contact type");
assert(allMissing.issues.every((issue) => issue.code === "contact_invalid"), "contact issues use contact_invalid");

// ---- Adoption dates and nights (PO Decision 5) ---------------------------

const derived = deriveAdoptionNights("2026-10-10", "2026-10-15", null);
assert("nights" in derived && derived.nights === 5 && derived.source === "derived_from_dates", "missing nights derived");
const stored = deriveAdoptionNights("2026-10-10", "2026-10-15", 5);
assert("nights" in stored && stored.source === "stored", "matching stored nights kept");
assert("issue" in deriveAdoptionNights("2026-10-10", "2026-10-15", 4), "mismatch refused");
assert(validateAdoptionDates({ confirmedStartDate: "2026-10-10", confirmedEndDate: null, storedNights: null })[0]?.code === "dates_required", "end date required");
assert(validateAdoptionDates({ confirmedStartDate: "10/10/2026", confirmedEndDate: "2026-10-12", storedNights: null })[0]?.field === "confirmedStartDate", "bad start date");
assert(validateAdoptionDates({ confirmedStartDate: "2026-10-12", confirmedEndDate: "2026-10-10", storedNights: null })[0]?.code === "dates_invalid", "end before start");
assert(validateAdoptionDates({ confirmedStartDate: "2026-10-10", confirmedEndDate: "2026-10-12", storedNights: 3 })[0]?.code === "dates_nights_mismatch", "nights mismatch");
assert(validateAdoptionDates({ confirmedStartDate: "2026-10-10", confirmedEndDate: "2026-10-10", storedNights: 0 }).length === 0, "same-day Journey with 0 nights");

// ---- History filter, categories and cursor --------------------------------

assert(parseJourneyHistoryFilter("ownership") === "ownership" && parseJourneyHistoryFilter("x") === "all" && parseJourneyHistoryFilter(null) === "all", "history filter");
assert(journeyHistoryCategory("journey_reassigned") === "ownership" && journeyHistoryCategory("activity_logged") === "other", "categories");
const stageTypes = journeyHistoryEventTypes("stage_status");
assert(stageTypes.includes("journey_closed") && stageTypes.includes("journey_template_assigned") && !stageTypes.includes("journey_reassigned"), "stage events");
const contactTypes = journeyHistoryEventTypes("contact_category");
assert(JSON.stringify([...contactTypes].sort()) === JSON.stringify(["journey_contact_changed", "journey_service_category_changed"]), "contact & category events");

const cursor = { createdAt: "2026-10-04T07:12:33.123456+00:00", id: TEMPLATE };
const decoded = decodeJourneyHistoryCursor(encodeJourneyHistoryCursor(cursor));
assert("value" in decoded && decoded.value?.createdAt === cursor.createdAt && decoded.value.id === cursor.id, "cursor round trip");
const empty = decodeJourneyHistoryCursor(null);
assert("value" in empty && empty.value === null, "no cursor, first page");
for (const bad of [
  "2026-10-04T07:12:33Z",
  `2026-10-04T07:12:33Z|${TEMPLATE}|x`,
  `2026-10-04T07:12:33Z|not-a-uuid`,
  `2026-10-04T07:12:33Z,and(id.gt.0)|${TEMPLATE}`,
  `"2026-10-04"|${TEMPLATE}`,
  `2026-13-45T99:99:99Z|${TEMPLATE}`,
]) {
  assert("issue" in decodeJourneyHistoryCursor(bad), `cursor rejected: ${bad}`);
}

console.log(`Journey Workspace action verification passed (${checks} checks).`);
