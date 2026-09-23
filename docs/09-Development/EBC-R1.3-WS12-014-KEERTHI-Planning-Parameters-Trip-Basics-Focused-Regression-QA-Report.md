# EBC-R1.3-WS12-014 — KEERTHI — Planning Parameters (Trip Basics) Focused Regression QA Report

**Persona:** Keerthi (Functional Validation Specialist)
**Parent EBCs:** `EBC-R1.3-WS12-012` (Sophie's UX spec), `EBC-R1.3-WS12-013` (Rad's implementation), `EBC-R1.3-WS12-011A` (Arjun's FR/BR gap analysis), `EBC-R1.3-WS12-010C` (prior closure — Journey Planning lifecycle previously accepted)
**Purpose:** Focused regression QA of the newly implemented Planning Parameters ("Trip Basics") functionality from WS12-013, together with a smoke regression of the previously-accepted Journey Planning lifecycle. Not a complete Journey Planning QA cycle (that is covered by `WS12-009`).
**Environment:** Local Next.js dev server on `localhost:3000`, Workspace Administrator session (vivek), browser verification via Claude in Chrome. Product Owner had already applied the two pending WS12-013 migrations and confirmed Local = Remote migration state before this pass began. No repository, database, or migration changes were made during this pass.
**Date:** 22 September 2026

---

## Result: PASS. No defects, no regressions.

One test record was created and driven through the full lifecycle (Lead Created → Discovery → Planning → Proposal Shared → Decision → Closed/Archived) to exercise Trip Basics alongside every existing feature area in scope. All ten test areas from the task card were validated; nothing failed.

---

## 1. Trip Basics Create Form — **Pass**

Verified on `/workspace/journey-planning/new` against Sophie's WS12-012 §4.2 spec:

| Field | Tag | Helper text | Result |
|---|---|---|---|
| Number of Adults | REQUIRED | "At least one traveller is always needed." | Present, matches spec, starts unset (em-dash), not pre-filled to 1 |
| Number of Children | NEEDED BEFORE PLANNING | "Add now if you know — you can fill this in later during Discovery." | Present, matches, starts unset with a "Set to 0" quick-action |
| Number of Infants | NEEDED BEFORE PLANNING | Same as above | Present, matches |
| Intended Travel Month | NEEDED BEFORE PLANNING | "An approximate month is fine — exact dates come later." | Present, matches, native month picker |
| Number of Nights | NEEDED BEFORE PLANNING | "Roughly how many nights, even as an estimate." | Present, matches, "Set to 0" quick-action |
| Preferred Departure City | NEEDED BEFORE PLANNING | "Where the group will be flying from." | Present, matches |

- Exact Travel Date: **not requested** anywhere on the form. Confirmed.
- Budget: **not requested** anywhere on the form. Confirmed.
- Field grouping matches spec ("Who's travelling" / "When & where from").

**UX observation (pre-disclosed by Rad, not a defect):** Preferred Departure City is a plain text input, not a typeahead as Sophie's spec called for. Confirmed present in the live UI. Carried forward as a known deviation for Sophie/Tiger to schedule, not release-blocking.

## 2. Adults Validation — **Pass**

| Case | Method | Result |
|---|---|---|
| Adults omitted | UI submit + direct API | Client-side native-required focus on Title (submission order), then server correctly rejects with `400 {"code":"adults_required"}` once other required fields are filled |
| Adults = 0 | Direct API | `400 {"code":"adults_required"}` |
| Adults = -1 | Direct API | `400 {"code":"adults_required"}` |
| Adults = "abc" (non-numeric) | Direct API | `400 {"code":"adults_required"}` |
| Adults = 2 (valid) | UI | Record created successfully (`201`) |

Zero, empty, negative, and non-numeric are all correctly rejected server-side, not just hidden client-side. FR-JP-31 is enforced.

**UX observation (not a defect):** the page-level error banner shown on rejection reads generically ("Invalid Journey Planning record.") rather than naming the specific field/reason inline near Number of Adults. The validation itself is fully correct; this is a polish item for Sophie, not a functional gap.

## 3. Explicit Zero Behaviour — **Pass**

Set Children, Infants, and Number of Nights to `0` via the "Set to 0" quick-action buttons on a live record, saved, and reloaded:

- All three saved as `0`, not left unset — confirmed by the completion indicator moving from "0 of 5" to "3 of 5 needed before Planning" immediately after the zero values were set (a value of "unanswered" would not have counted toward completion).
- Reloading the record page and re-checking the fields showed `0` still displayed (not reverted to the em-dash "unset" placeholder).
- No confusion observed anywhere between an explicit `0` and "not entered." BR-023's tri-state requirement holds for all three zero-valid fields.

## 4. Progressive Enrichment — **Pass**

Created a new Individual record with only Number of Adults = 2 populated; Children, Infants, Intended Travel Month, Number of Nights, and Preferred Departure City were all left blank. Submission succeeded (`201`), the record was created, and the completion indicator correctly read "Trip Basics — 0 of 5 needed before Planning." BR-020 holds.

## 5. Discovery → Planning Gate — **Pass**

Using the same record, moved it to Discovery (no gate applies here, as expected), then tested the gate with 3 of 5 fields set:

- "Move to Planning" was **visible but rendered disabled**.
- Completion indicator correctly read "Trip Basics — 3 of 5 needed before Planning."
- Inline guidance message displayed exactly as specified: *"Add the remaining Trip Basics to move this record into Planning."*
- Clicking the disabled button had no effect (still Discovery afterward).
- **Server-side enforcement independently confirmed** via a direct `POST .../advance-stage {"toStage":"planning"}` call while incomplete: correctly rejected with `400 {"code":"discovery_to_planning_requires_trip_basics"}`. This was Rad's own recommended focus area and it holds — the gate is not just a UI convenience.
- Completed the remaining two fields (Intended Travel Month, Preferred Departure City), saved: completion indicator updated to "5 of 5," guidance message disappeared, "Move to Planning" became enabled.
- Clicked "Move to Planning": transition succeeded, record entered Planning stage.

The single expanded 5-field gate (per Arjun's Revision 2 / the Product Owner's OQ-011A-5 decision) is implemented correctly, not the superseded two-gate design.

## 6. Planning Parameter Persistence — **Pass**

- Saved Trip Basics, then full-reloaded the record page: all values (Adults 2, Children 0, Infants 0, December 2026, Nights, Mumbai/Mumbai Airport) persisted correctly.
- Navigated away to the Journey Planning queue and back into the record: all values still correct, no loss or reset.

## 7. Toast Notification — **Pass**

Validated the shared Workspace toast (from WS12-010's D4 fix) specifically for Trip Basics saves, across two separate save actions:

- Colour: light green/mint background, dark green text — consistent with a success state, matching prior Toast usage seen in earlier QA phases (task/record actions).
- Placement: bottom-right corner, confirmed via full-viewport screenshots on both occasions.
- Width: compact, sized to its message text, not full-width.
- Auto-dismiss: dismissed on its own within a few seconds both times, without user action.
- Click-to-dismiss: clicking the toast while visible dismissed it immediately.
- Did not obscure any form content or controls (bottom-right corner, away from all fields and buttons used in this session).
- Did not overlap the Workspace header (header is fixed top, toast is fixed bottom — no shared screen region observed).
- Appearance was visually consistent between the two independent saves.

## 8. Existing Functionality Regression (Smoke) — **Pass**

Exercised on the same test record, in addition to the create/gate/persistence flows above:

| Area | Result |
|---|---|
| Discovery Notes | Added a note successfully; appeared immediately, no regression |
| Proposal Versions | Created v1 (Goa, 1 night); appended correctly to the immutable list, no regression |
| Stage progression | Lead Created → Discovery → Planning → Proposal Shared → Decision, all transitions succeeded cleanly |
| Decision outcome (Archive) | Closed correctly as `CLOSED · ARCHIVED`; Trip Basics values remained intact and correctly displayed post-closure |
| Queue refresh | Journey Planning list correctly reflected the record's current stage ("Closed") and latest-updated timestamp |
| History | All actions correctly logged in reverse-chronological order, including the **new `trip_basics_updated` event type** appearing correctly interleaved with `Stage changed`, `Proposal version created`, `Proposal sent`, and `Record closed` events — confirms the new audit event integrates cleanly with the existing History feature from WS12-010 |
| Tasks & Follow-ups | Added a task successfully ("Task added" toast, appears in list) |

No regression found in any previously-accepted feature area. "Confirm → Convert to Journey" was visible as an option at the Decision stage (not exercised this pass — Archive was used instead, consistent with prior QA practice of not repeatedly triggering the one-way conversion path; its underlying code path is unchanged by WS12-013 and was fully verified in the original WS12-009 cycle).

## 9. Data Verification — **Pass**

Trip Basics values were confirmed correct and consistent: on initial creation, after each Save, after a full page reload, after navigating away and back, and after every one of the four stage transitions (Discovery → Planning → Proposal Shared → Decision → Closed). No divergence between what was saved and what was displayed at any point.

## 10. API Behaviour — **Pass**

Reviewed the full network log for this session (86 requests to `/api/workspace/journey-planning*`) and the console log:

- No unexpected `500` responses anywhere in the session. The only non-2xx responses were the intentional, correctly-classified `400`s from Adults-validation testing (5 occurrences, all `adults_required`) and the one intentional gate-bypass attempt (`discovery_to_planning_requires_trip_basics`).
- No console errors or unhandled promise rejections were logged at any point during this pass.
- All successful creates/updates returned the expected status codes (`201` for creates, `200` for updates/transitions).

---

## Defect Log

**New defects:** None.
**Regressions:** None.
**UX observations (not release-blocking, for Sophie/Tiger to schedule):**

1. Preferred Departure City is a plain text field rather than the typeahead specified in WS12-012 §4.2 — a pre-disclosed, known deviation from WS12-013, reconfirmed present in the live UI.
2. Trip Basics save is a manual "Save Trip Basics" button rather than autosave-on-blur as WS12-012 describes — a pre-disclosed, known deviation, reconfirmed present.
3. The page-level error message shown when a Journey Planning record fails validation (e.g. missing/invalid Adults) is generic ("Invalid Journey Planning record.") rather than naming the specific field. The validation itself is correct and robust at every layer tested; this is purely a message-clarity polish item.

None of these three items affect correctness, data integrity, or the release-blocking criteria in this EBC's scope.

---

## Final QA Recommendation

**Ready for Product Owner Acceptance (WS12-015).**

Every test area in the WS12-014 card passed: the Trip Basics form matches the approved UX spec field-for-field, Adults validation and explicit-zero handling are both correctly enforced (and correctly distinguished from "unset") at the server, Progressive Enrichment allows creation with only Adults set, the Discovery → Planning gate is enforced both in the UI and independently at the API layer, Trip Basics values persist correctly across reloads and every stage transition, the shared toast behaves correctly for Trip Basics saves specifically, and a full smoke pass across every previously-accepted Journey Planning feature (Discovery Notes, Proposal Versions, stage progression, Decision outcomes, Queue, History, Tasks & Follow-ups) turned up no regressions. The network and console logs for the entire session show zero unexpected errors.

The three UX observations above are minor, pre-disclosed, non-blocking, and can be scheduled as ordinary backlog/polish items without holding up WS12-015. On this basis, WS12 Engineering — including the WS12-013 Planning Parameters enhancement — is considered fully QA validated and ready to proceed to Product Owner Acceptance as the final workstream activity before baselining WS12 into Release 1.3.

---

*Prepared by Keerthi (Functional Validation Specialist), Team Satvi. This report reflects live runtime testing in the local development environment described above; it does not constitute Sri's traveller-experience review or the Product Owner's release approval.*