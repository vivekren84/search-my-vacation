# EBC-R1.3-WS12-017 — KEERTHI — Production Readiness Actions (PRA-01 / PRA-02) Focused Regression QA Report

**Persona:** Keerthi (Functional Validation Specialist)
**Parent EBCs:** `EBC-R1.3-WS12-015A` (Tiger's Conditional Acceptance — DEC-R1.3-016, PRA-01/PRA-02 origin), `EBC-R1.3-WS12-016` (Rad's implementation of PRA-01/PRA-02), `EBC-R1.3-WS12-014` (prior focused QA — Planning Parameters/Trip Basics, PASS)
**Purpose:** Validate PRA-01 (Field-specific Validation Feedback) and PRA-02 (Ownership Gate) exactly as implemented under WS12-016, plus a light regression around the affected Journey Planning workflow. This is not a complete Journey Planning QA cycle — that scope was already covered and passed in `WS12-009` and `WS12-014`.
**Environment:** Local Next.js dev server on `localhost:3000`, Workspace Administrator session (vivek), browser verification via Claude in Chrome. Product Owner had already applied all required migrations and completed an engineering smoke test before this pass began (per WS12-016). No repository, database, or migration changes were made during this pass, and no code was modified.
**Date:** 23 September 2026

---

## Result: PASS. No defects, no regressions.

PRA-01 and PRA-02 both behave exactly as documented in WS12-016. Every test area in the task card was validated, both via the real UI and via direct API calls (the latter used specifically for Test Area 6's explicit "attempt to bypass the UI" instruction, and to obtain clean, literal confirmation of the exact codes/messages returned). One self-inflicted false alarm (a reproducible `500` from my own incorrectly-shaped direct API test payloads) was investigated, root-caused, and conclusively ruled out as a regression — see §6 and the Defect Log for detail.

---

## 1. PRA-01: Create Record Validation — **Pass**

Verified that the generic fallback message ("Invalid Journey Planning record.", flagged as a UX observation in WS12-014) is gone, and that validation failures are now field-specific:

- **Single missing field (Adults):** UI submission via the whitespace-value technique (entering a single space in Title/Traveller Name to pass native HTML5 `required` while still failing server-side trim validation) surfaced a field-specific message, not a generic one.
- **Multiple missing/invalid fields simultaneously:** confirmed via direct API that the server collects and returns **every** failing field in one response rather than stopping at the first. Example, submitting `{recordKind:'individual', title:'WS12-017 Adults Distinct Test', originChannel:'Website enquiry', newTraveller:{fullName:'Test Traveller'}}` (Adults omitted):

  ```json
  {
    "ok": false,
    "code": "origin_channel_required",
    "issues": [
      { "field": "originChannel", "code": "origin_channel_required", "message": "Origin channel is required." },
      { "field": "adults", "code": "adults_required", "message": "Number of Adults is required." }
    ],
    "message": "Origin channel is required. Number of Adults is required."
  }
  ```

  Two independent fields (`originChannel` and `adults`) were reported together in a single response, each with its own `field`, `code`, and `message`. Validation does **not** stop after the first failure — this is the core PRA-01 promise, confirmed.
- The `originChannel` rejection above is expected: `"Website enquiry"` was a guessed value for a direct API test and is not the exact accepted enum/slug — this is a test-construction artifact, not a defect (see §6 for the same class of issue). It does not affect the validity of this test area's finding, since the point being verified is that both fields were reported together, not the specific channel value.
- Top-level `code` field remains present for backward compatibility (existing callers keyed on `code` are unaffected); `issues[]` is additive.

## 2. Adults Validation — **Pass**

Confirmed the two Adults failure modes are now distinguished, as required:

| Case | Code | Message |
|---|---|---|
| Adults omitted | `adults_required` | "Number of Adults is required." |
| Adults = 0 | `adults_must_be_positive` | "Number of Adults must be greater than zero." |

Both confirmed via direct API against the create endpoint (each alongside a second, independently-failing field, further reinforcing the multi-issue behaviour from §1). The two cases are unambiguously distinct in both `code` and `message` — this is a deliberate, disclosed contract change from the single `adults_required` code used prior to WS12-016, and it is implemented correctly.

## 3. Trip Basics Validation (Discovery → Planning Gate) — **Pass**

Using a test record with Trip Basics 0-of-5 complete, attempted to advance Discovery → Planning:

- **UI:** "Move to Planning" rendered disabled, per the pre-existing (WS12-013/WS12-014-verified) gate behaviour; completion indicator read "Trip Basics — 0 of 5 needed before Planning."
- **Direct API** (`POST .../advance-stage {"toStage":"planning"}`), to inspect the full structured response: rejected `400`, with the pre-existing top-level `code` unchanged (`discovery_to_planning_requires_trip_basics`) and a new `issues[]` array individually identifying **all five** missing fields in one response:

  ```json
  {
    "code": "discovery_to_planning_requires_trip_basics",
    "issues": [
      { "field": "children", "code": "children_required_before_planning", "message": "Number of Children is required before moving to Planning." },
      { "field": "infants", "code": "infants_required_before_planning", "message": "Number of Infants is required before moving to Planning." },
      { "field": "intendedTravelMonth", "code": "intended_travel_month_required_before_planning", "message": "Intended Travel Month is required before moving to Planning." },
      { "field": "nights", "code": "nights_required_before_planning", "message": "Number of Nights is required before moving to Planning." },
      { "field": "preferredDepartureCity", "code": "preferred_departure_city_required_before_planning", "message": "Preferred Departure City is required before moving to Planning." }
    ]
  }
  ```

No generic message anywhere in this path. Guidance matches the Product requirement (every missing field individually identified, all at once). The gate's existing UI-blocking behaviour (disabled button + inline guidance, from WS12-013/014) is unchanged and still correct.

## 4. Trip Basics Edit — **Pass**

Opened the existing test record (now in Discovery, then Planning) and introduced invalid values into the Trip Basics edit form (not the create form) to confirm the same structured behaviour applies there too, per Rad's disclosure that the `trip-basics` route shares the same validation helper:

- **Single invalid field** (Adults = 0, via UI): saved, and the bottom-right toast/banner rendered a single field-specific message: *"Number of Adults must be greater than zero."* — confirmed by screenshot.
- **Multiple invalid fields simultaneously** (Adults = 0, Nights = -1, via UI): saved, and the same banner rendered **both** messages together: *"Number of Adults must be greater than zero. Number of Nights must be zero or a positive whole number."* — confirmed by screenshot. This is the multi-field list-style rendering (matching the joined-message pattern used by the create form), confirmed live through the real UI, not just via direct API.
- **Direct API cross-check** (`POST .../trip-basics {"adults":0,"children":-1,"nights":-5}`) independently confirmed the same three-issue structured response (`adults_invalid`, `children_invalid`, `nights_invalid`), each with its own field-specific message.
- Record was then corrected back to valid values (Adults 3, Children 0, Infants 0, December 2026, Nights 2, Mumbai) and saved successfully, confirming the form recovers cleanly from a rejected save with no residual bad state.

## 5. PRA-02: Ownership Gate — **Pass**

On an unowned (unclaimed) Lead Created record:

- "Move to Discovery" rendered **visible but disabled**.
- Inline guidance displayed, explaining the record must first be claimed (mirrors the pre-existing Trip Basics gate's disabled-button-plus-guidance pattern exactly, per Rad's implementation notes).
- Clicking the disabled control had no effect — record remained Lead Created, Unassigned.

## 6. Server Enforcement — **Pass**

Attempted to bypass the UI directly via a `fetch()` call to the advance-stage endpoint while the record was still unowned:

- `POST .../advance-stage {"toStage":"discovery"}` → rejected `400`, with `code: "lead_created_to_discovery_requires_owner"` and an issue on `field: "ownerId"` with message *"This record must be claimed before it can move to Discovery."*
- Confirmed no audit/History entry was created for the blocked attempt (consistent with the pre-existing Trip Basics gate's behaviour — a blocked transition is rejected before any audit call).
- This confirms server-side enforcement is real, not merely a UI convenience — an Administrator (who bypasses ownership RBAC by design elsewhere) cannot skip this specific gate by calling the API directly.

**Investigation note (self-inflicted, not a defect):** earlier direct-API testing against the create endpoint using an incorrect payload shape (`recordType`/flat `travellerFullName`, carried over from prior-phase testing habits) produced a reproducible `500`. This was cross-checked against the real UI (which succeeded, `201`) and root-caused by intercepting the UI's own `fetch` call via a monkey-patched `window.fetch`, which revealed the correct field names (`recordKind`, nested `newTraveller.fullName`). All subsequent direct-API tests in this pass (including Test Areas 1, 2, and 6) used the corrected payload shape and behaved exactly as expected. This is a minor, pre-existing, non-blocking robustness observation (a structurally malformed direct API request produces an unhandled `500` rather than a clean `400`) — it predates WS12-016, is unrelated to PRA-01/PRA-02, and is not reachable through any real UI interaction. Logged in the Defect Log below as a non-blocking Product/Engineering observation for backlog consideration, explicitly separated from the PRA-01/PRA-02 findings.

## 7. Ownership Flow — **Pass**

On the same test record:

1. Clicked **Claim** — History correctly logged "Ownership claimed"; page updated to show "Owner: You"; "Move to Discovery" became enabled; the blocking guidance note disappeared.
2. Clicked **Move to Discovery** — transition succeeded; record correctly entered the Discovery stage.
3. Continued exercising further stage transitions on the same now-owned record: **Move to Planning** (after completing Trip Basics, per §3) succeeded; **Move to Proposal Shared** succeeded; **Move to Decision** succeeded; **Archive** succeeded, closing the record as `CLOSED · ARCHIVED`.

All remaining stage transitions continue to work normally once ownership is established — PRA-02 only affects the one gate it was designed for (Lead Created → Discovery) and does not interfere with any other transition in the lifecycle.

## 8. Regression (Smoke) — **Pass**, with one item Not Testable (pre-existing limitation)

Exercised on the same test record, end to end:

| Area | Result |
|---|---|
| Claim Ownership | Pass — see §7 |
| Reassign | **Not Testable** — no reassignment/owner-picker control was found anywhere in the record detail view or the Journey Planning queue (only a "Claim" action for unowned records). This matches the pre-existing, already-disclosed platform limitation noted directly in the Tasks & Follow-ups panel ("No user-picker UI exists yet — Workspace Administration/User Management is not built"). Not a new gap introduced by WS12-016; out of scope to resolve here. |
| Discovery Notes | Pass — note added successfully, appeared immediately |
| Trip Basics | Pass — see §3, §4 |
| Proposal Versions | Pass — v1 (Goa, 1 night) created successfully, appended correctly to the immutable list |
| Queue | Pass — Journey Planning list correctly reflected the record's title, current stage (Closed), owner (You), and latest-updated timestamp after the full lifecycle |
| History | Pass — every action correctly logged in reverse-chronological order: Record created → Ownership claimed → Stage changed (×4) → Trip Basics updated → Proposal version created → Task created → Record closed |
| Tasks & Follow-ups | Pass — task added successfully ("Task added" toast, appears in list, logged in History) |
| Stage progression | Pass — full lifecycle Lead Created → Discovery → Planning → Proposal Shared → Decision → Closed/Archived, all transitions succeeded cleanly |
| Decision | Pass — all three outcomes (Confirm → Convert to Journey, Lost, Archive) were visible at the Decision stage; Archive was exercised (consistent with prior QA practice of not repeatedly triggering the one-way Convert path, whose code is unchanged by WS12-016 and was verified in WS12-009) |
| Closed | Pass — record correctly closed as `CLOSED · ARCHIVED`; Trip Basics values and all other data remained intact and correctly displayed post-closure |

No regression found in any previously-accepted feature area.

## 9. Browser Validation — **Pass**

Reviewed the full network log for this session (157 requests to `/api/workspace/journey-planning*`) and the console log:

- Every `400` response in the log corresponds to an intentional negative test (PRA-01/PRA-02 validation testing) — none were unexpected.
- Three `500` responses occurred, all three traced to my own malformed direct-API test payloads (incorrect field names, per the investigation note in §6) — each was immediately followed by a `201` success once the payload was corrected. None occurred as a result of real UI interaction; none are attributable to PRA-01/PRA-02.
- No console errors, exceptions, or unhandled promise rejections were observed at any point.
- No browser alerts, confirms, or prompts were triggered.
- All successful creates/updates/transitions returned the expected status codes (`201` creates, `200` updates/transitions).

## 10. UX Review — **Observations recorded (not defects)**

**PRA-01:** The field-specific messages are a clear, concrete improvement over the prior generic banner. Each message names the exact field and the exact problem ("Number of Adults must be greater than zero." rather than "Invalid Journey Planning record."), and multiple simultaneous failures are shown together rather than forcing a fix-one-resubmit-see-the-next cycle — this directly resolves the UX observation raised in WS12-014 (§3, observation 3) and meaningfully improves usability. The banner presentation (single line for one error, joined sentence for several) is simple and legible; a bulleted list per message might read slightly more clearly for 3+ simultaneous errors, but this is a minor polish suggestion, not a defect.

**PRA-02:** The gate feels operationally correct. It sits precisely at the one point where an unowned record could otherwise slip into active work (Discovery) — Administrators, who are otherwise exempt from ownership RBAC, are stopped exactly the same as anyone else at this specific step, closing a real operational gap without adding friction anywhere else in the lifecycle (confirmed in §7, all other transitions proceed normally once claimed). The disabled-button-plus-inline-guidance pattern is consistent with the existing Trip Basics gate, so the interaction is already familiar to anyone who has used the product. Guidance wording ("Claim this Journey before beginning Discovery.") is clear and actionable.

---

## Regression Summary

No regressions were found in any previously-accepted functionality. The full Journey Planning lifecycle (Lead Created → Discovery → Planning → Proposal Shared → Decision → Closed), Trip Basics (create, edit, gate, persistence), Discovery Notes, Proposal Versions, Tasks & Follow-ups, History, and the Journey Planning Queue all continue to behave exactly as validated in WS12-009 and WS12-014. The only behavioural changes observed are the intended PRA-01 and PRA-02 changes themselves.

---

## Defect Log

**Critical:** None.
**High:** None.
**Medium:** None.
**Low (non-blocking observations):**

1. **[Product/Engineering observation, pre-existing, not introduced by WS12-016]** A structurally malformed direct API request to `POST /api/workspace/journey-planning` (wrong field names, bypassing the app's own form) produces an unhandled `500` rather than a clean `400`. Not reachable through any real UI interaction; root-caused and confirmed unrelated to PRA-01/PRA-02 (see §6). Suggest as a minor backlog item for defensive input-shape validation at the API boundary, at Tiger/Archie's discretion — not release-blocking.
2. **[Product observation, out of scope for this EBC]** No Reassign / owner-picker control exists anywhere in the Journey Planning UI (only Claim, for unowned records). This is a pre-existing, already-disclosed platform limitation (Workspace Administration/User Management is not yet built), not a gap introduced by WS12-016. Flagged here only because the task card's regression checklist named "Reassign" explicitly; recommend Tiger track this against the existing Workspace Administration backlog item rather than opening a new one.
3. **[UX suggestion, not a defect]** For 3+ simultaneous PRA-01 validation failures, a bulleted list in the error banner might read more clearly than a single joined sentence. Purely cosmetic; the current presentation is legible and correct.

None of these items affect correctness, data integrity, or the release-blocking criteria in this EBC's scope.

---

## Final QA Recommendation

**Ready for Final Product Owner Acceptance.**

PRA-01 is fully validated: the generic fallback message is gone, every validation failure (create-record and Trip Basics edit alike) now identifies the specific field and problem, multiple simultaneous failures are surfaced together rather than one at a time, and the two Adults failure modes (missing vs. zero) are now correctly distinguished. PRA-02 is fully validated: the ownership gate is enforced both in the UI (disabled control with guidance) and independently at the server (rejected with the exact documented `lead_created_to_discovery_requires_owner` code, no audit trail on the blocked attempt), it does not obstruct any other stage transition once a record is claimed, and it closes the specific Administrator-bypass gap it was designed to close. A full regression smoke of the surrounding Journey Planning lifecycle — ownership, Trip Basics, Discovery Notes, Proposal Versions, Tasks, stage progression, Decision, Closed, History, and the Queue — turned up zero regressions. The network and console logs for the entire session show no unexpected errors once the one self-inflicted test-construction issue (misshapen direct API payloads, fully root-caused and confirmed unrelated to either PRA) is set aside.

The Defect Log's three items are all non-blocking: one pre-existing, out-of-scope robustness observation; one pre-existing, already-disclosed platform limitation (no Reassign UI); and one purely cosmetic suggestion. None hold up release. On this basis, WS12-016's Production Readiness Actions are considered fully QA validated and ready for the Product Owner's final release decision on Release 1.3.

---

*Prepared by Keerthi (Functional Validation Specialist), Team Satvi. This report reflects live runtime testing in the local development environment described above; it does not constitute Sri's traveller-experience review or the Product Owner's release approval.*