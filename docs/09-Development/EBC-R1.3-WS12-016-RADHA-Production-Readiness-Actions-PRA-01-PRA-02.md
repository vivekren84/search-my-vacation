# EBC-R1.3-WS12-016 — RADHA — Production Readiness Actions (PRA-01 / PRA-02) — Engineering Implementation Report

**Persona:** Rad — Engineering and Implementation Specialist
**Release:** 1.3
**Workstream:** WS12 — Journey Planning
**Parent EBCs / Decisions:** `EBC-R1.3-WS12-015A` (Tiger, Product Owner Acceptance — Conditional Acceptance), `DEC-R1.3-016`, `EBC-R1.3-WS12-014` (Keerthi, Focused Regression QA — PASS), `EBC-R1.3-WS12-013` (Rad, Trip Basics / Discovery→Planning gate implementation), `EBC-R1.3-WS12-003` Revision 2, `EBC-R1.3-WS12-004` Revision 2.
**Scope:** Implementation card only. No Product, UX, Architecture, database schema, release, or QA/governance documentation decisions were revisited.
**Date:** 23 September 2026

---

## 0. Workspace Readiness Check (Project Instructions §14/§15)

- Local repository confirmed connected: `/Users/viveksophu/Documents/Projects/SearchMyVacation`.
- Branch: `main`.
- Working-tree status at start: the same pre-existing, uncommitted change set disclosed by every WS12 card since `WS12-011B` (WS12-007/010/013 engineering, four Supabase migrations, `TripBasicsPanel.tsx`, `Toast.tsx`, and the WS12-010→015A documentation chain). None of it created or altered by this card except the specific files listed in Section 3.
- Prerequisites read in full before any change: `EBC-R1.3-WS12-015A` (Product Owner Acceptance — records `DEC-R1.3-016` and both PRAs verbatim) and `EBC-R1.3-WS12-014` (Keerthi's Focused Regression QA — PASS, including the exact `discovery_to_planning_requires_trip_basics` code and `adults_required` behaviour this card had to preserve/extend without breaking).
- `DEC-R1.3-016` confirmed as recorded in `WS12-015A` Section 2 (Activity 2/3) — no separate read of `RELEASE-1.3.md` Section 7 was needed, since `WS12-015A` already quotes the decision and both PRAs verbatim.
- Current on-disk state of every file this card touches was re-read directly from the repository (not from session memory) before editing: `validation.ts`, `service.ts`, `types.ts`, `permissions.ts`, both route files, both UI components, `trip-basics/route.ts`, `journeyPlanningLabels.ts`.

---

## 1. Implementation Summary

### PRA-01 — Field-specific Validation Feedback

- `JourneyPlanningValidationError` (validation.ts) now carries an optional, ordered `issues: JourneyPlanningFieldIssue[]` list (`{field, code, message}`) alongside its existing single `code`. Every pre-existing throw site that does not supply `issues` keeps its prior single-`code` behaviour unchanged (`issues` defaults to `[]`) — this is additive, not a rewrite of the file's validation rules.
- `validateCreateJourneyPlanningRecordInput` no longer stops at the first failing check. It now collects every failing field (title, origin channel, traveller/corporate-contact requirements, Adults, and the five optional Trip Basics fields' format checks) into one `issues` list and throws once, with every message present — directly satisfying PRA-01's "Do not stop after the first validation failure."
- Adults validation is now two distinct, field-specific messages instead of one generic code, per PRA-01's own verbatim examples:
  - missing / non-integer → `adults_required` → "Number of Adults is required."
  - present but `< 1` → `adults_must_be_positive` (new code) → "Number of Adults must be greater than zero."
- The Discovery→Planning gate (`validateDiscoveryToPlanningGate`) now also returns one issue per still-missing gated field, with messages matching PRA-01's own examples exactly ("Preferred Departure City is required before moving to Planning.", "Intended Travel Month is required before moving to Planning.", and the equivalent for Children/Infants/Nights). The gate's own top-level `code` is **unchanged** — still exactly `discovery_to_planning_requires_trip_basics` — since Keerthi's `WS12-014` regression script asserts this exact code; only `issues` is new.
- `POST /api/workspace/journey-planning` (Create) and `POST /api/workspace/journey-planning/[recordId]/advance-stage` now return `issues` in their 400 response body, with `message` built by joining every issue's message — replacing the generic "Invalid Journey Planning record." / "That stage transition is not allowed." text for every case that now has field-specific issues. For validation errors with no populated `issues` (e.g. an out-of-sequence stage jump, unrelated to PRA-01/02), both routes fall back to their prior generic message unchanged — no regression for those paths.
- `POST /api/workspace/journey-planning/[recordId]/trip-basics` was extended the same way, for consistency, as a direct, low-risk consequence of `validateUpdateJourneyPlanningTripBasicsInput` now sharing the same underlying field-check helper (`validateTripBasicsFieldValues`) that Create Record uses — not a separately-scoped PRA-01 target, but leaving it on the old generic message would have been an inconsistent regression once the shared helper changed shape.
- `NewJourneyPlanningRecordForm.tsx` (Create screen): the existing error banner (`error` state) now holds a list of messages instead of one string. When there is more than one message, the **same banner element** renders a `<ul>`/`<li>` list instead of a single `<p>` — no new notification framework, no browser alert, same styling/positioning as before.
- The Detail screen's existing action-failure path (`post()` → `pushToast(result.message, "error")`, the shared Workspace `Toast.tsx`) required **no code change** to benefit from PRA-01: it already renders whatever `result.message` the API returns, so the joined field-specific message now shown there for gate failures is a direct, free consequence of the route-level change.

### PRA-02 — Ownership Gate (Lead Created → Discovery)

- `validateStageTransition` (validation.ts) gained a third named transition-specific check, `validateLeadCreatedToDiscoveryGate`, following exactly the same pattern already established for the Discovery→Planning Trip Basics gate: `from === "lead_created" && to === "discovery"` now requires `record.ownerId !== null`, or the call throws `lead_created_to_discovery_requires_owner` with one issue: `{field: "ownerId", message: "This record must be claimed before it can move to Discovery."}`. Every other transition is unaffected — the gate is scoped to exactly this one `from`/`to` pair, matching the card's "Existing Behaviour" note.
- **No `service.ts` change was required to wire this in.** `advanceJourneyPlanningStage` already threads the full fetched `JourneyPlanningRecord` (which already carries `ownerId`) into `validateStageTransition(record.stage, toStage, record)` for the Trip Basics gate — that same argument structurally satisfies the new gate's requirements. This is disclosed explicitly because it means the server-side half of PRA-02 is a validation.ts-only change, smaller than it might first appear.
- **Server enforcement is independent of RBAC**, and matters specifically for the case RBAC does not already cover: `canAdvanceStage` (`permissions.ts`, unmodified) already lets only an Administrator or the record's current owner advance a record's stage — a non-owning Workspace User is already blocked from acting on any unowned record by RBAC alone. The gate's real effect is closing the one path RBAC does not block: an **Administrator** attempting Lead Created → Discovery on a still-unowned record (Administrators bypass the ownership RBAC check by design). Before this card, that path succeeded; it is now rejected with HTTP 400, `code: "lead_created_to_discovery_requires_owner"`.
- `JourneyPlanningRecordDetailView.tsx` (Detail screen): added `discoveryGateBlocked` (`stage === "lead_created" && allowedNextStages.includes("discovery") && !record.ownerId`), mirroring `planningGateBlocked` exactly. "Move to Discovery" is now `disabled` with a `title` tooltip and an inline helper paragraph — the identical, already-established visual pattern used for the Planning gate (disabled-with-reduced-opacity button + tooltip + inline note below the button row) — reading "Claim this Journey before beginning Discovery." (the card's own suggested wording, used verbatim; no reason to adjust it). No new UI pattern was introduced.
- Audit trail: **no new audit event type was introduced**, per the card's explicit instruction. A rejected gate check never reaches `recordWorkspaceAuditEvent` (the throw happens before any audit call, exactly matching the existing Trip Basics gate's behaviour) — nothing is recorded for a blocked attempt. A successful claim already produces the existing `claimed` audit event (`claimJourneyPlanningRecord`, unmodified) and a successful Lead Created→Discovery transition (now only reachable once `ownerId` is set) already produces the existing `stage_transition` event, unmodified.

---

## 2. Files Modified

| File | Change |
|---|---|
| `web/lib/workspace/journey-planning/validation.ts` | Added `JourneyPlanningFieldIssue`; extended `JourneyPlanningValidationError` with `issues`; `validateCreateJourneyPlanningRecordInput` and `validateUpdateJourneyPlanningTripBasicsInput` collect all failing fields instead of throwing on the first; `validateTripBasicsFieldValues` and the two bootstrap-input validators return issue lists instead of throwing; `validateDiscoveryToPlanningGate` now returns per-field issues (top-level `code` unchanged); added `validateLeadCreatedToDiscoveryGate` (PRA-02) and wired it into `validateStageTransition`, whose `record` parameter type gained `ownerId: string \| null`. |
| `web/app/api/workspace/journey-planning/route.ts` | `POST` catch block: builds `message` from `error.issues` and returns `issues` in the 400 body; falls back to the prior generic message when `issues` is empty. |
| `web/app/api/workspace/journey-planning/[recordId]/advance-stage/route.ts` | Same pattern as above, covering both the Discovery→Planning and new Lead Created→Discovery gates; unrelated validation errors (e.g. `invalid_stage_transition`) keep their prior generic message. |
| `web/app/api/workspace/journey-planning/[recordId]/trip-basics/route.ts` | Same pattern, for consistency (see Section 1). |
| `web/components/workspace/journey-planning/NewJourneyPlanningRecordForm.tsx` | `error` state changed from `string \| null` to `string[] \| null`; renders a `<ul>` list inside the existing error banner when there is more than one message, a single `<p>` otherwise. |
| `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` | Added `discoveryGateBlocked`; "Move to Discovery" is now disabled-with-tooltip-and-inline-note under the same condition, mirroring the existing Planning gate's UI exactly. |

No other file was created, modified, or deleted. No database migration was required — PRA-02 needed no schema change (ownership is already the existing `ownerId` column); confirmed genuinely unnecessary, not skipped.

---

## 3. Technical Decisions

1. **Backward-compatible error shape.** `JourneyPlanningValidationError.issues` defaults to `[]` rather than being required, so every one of the ~10 other throw sites in this file (decision outcome, itinerary snapshot, vendor quotation amount, `closed_stage_requires_decision_endpoint`, `invalid_stage_transition`, etc.) needed zero changes and keeps behaving exactly as before, including for API routes this card did not touch.
2. **Adults validation code split (`adults_required` vs. new `adults_must_be_positive`).** This is a deliberate, disclosed behaviour change: Keerthi's `WS12-014` table shows Adults = 0/-1/"abc" all previously returned `adults_required`. PRA-01's own verbatim examples require two distinct messages for "missing" vs. "present but invalid," which necessitates two distinct codes. Recommended QA focus (Section 6) flags this explicitly for Keerthi's re-test.
3. **Field labels authored directly in `validation.ts`, not imported from `journeyPlanningLabels.ts`.** This codebase's `lib/` (server/shared logic) never imports from `components/` (client UI) — confirmed by inspection before writing any code. `journeyPlanningLabels.ts`'s `PLANNING_PARAMETER_LABELS` already holds the same five field labels for the UI's own use; `validation.ts` now holds a small, intentionally duplicated `GATED_FIELD_LABELS` map for composing server-side messages. This is a disclosed, minimal duplication (five short strings) rather than a cross-boundary import or a shared-labels refactor, which would have exceeded this card's scope.
4. **`discovery_to_planning_requires_trip_basics`'s top-level `code` left unchanged.** Only `issues` was added to that error. Keerthi's `WS12-014` regression script asserts this exact code via a direct API call; changing it would have broken an already-passed, documented QA assertion for no benefit.
5. **No `service.ts` change for PRA-02.** `advanceJourneyPlanningStage` already passes the full record (with `ownerId`) into `validateStageTransition`; only the validation-side type signature needed to widen. Verified by direct inspection, not assumed.
6. **`trip-basics/route.ts` extended beyond the two PRA-01-named routes.** Justified in Section 1 as a direct, mechanical consequence of the shared `validateTripBasicsFieldValues` helper's new return shape, not scope expansion — the alternative (leaving that one route on the old generic message after every other route/handler upgraded) would have been an inconsistent regression, not scope discipline.
7. **No new audit event type.** Confirmed by inspection that a thrown `JourneyPlanningValidationError` in `advanceJourneyPlanningStage` occurs before `recordWorkspaceAuditEvent` is ever called — a blocked PRA-02 attempt is silently rejected with no audit trace, exactly matching the pre-existing Trip Basics gate's behaviour, per the card's own instruction.

---

## 4. Validation Performed

| Check | Result |
|---|---|
| `npx tsc --noEmit` (from `web/`) | **Pass** — no output, no errors. |
| `npm run lint` (from `web/`) | **Pass** — 0 errors, 4 pre-existing warnings, all in files this card did not touch (`lib/geo-validation/bootstrapRepository.ts`, `scripts/bootstrap-workbook/writeWorkbook.ts`) and unrelated to Journey Planning. |
| `git diff --stat` (scoped to this card's six files) | Confirms only the six files listed in Section 2 were touched by this card's edits; no Product/UX/Architecture/database/release/QA/governance file was modified. |
| Live smoke test (Create Record, Claim, Discovery transition, remaining stage transitions) | **Not performed — disclosed, not silently skipped.** No local Next.js dev server was running at the start of this card (`ss -ltnp` confirmed nothing listening on port 3000; a stray `pgrep -af "next dev"` self-match was investigated and ruled out as a false positive from the search pattern matching the invoking command's own argument string, not an actual process). Per this card's own instruction ("If the development server is already available, perform a focused live smoke test… Otherwise clearly disclose that runtime validation was not performed"), no server was started for this pass. This mirrors the same disclosed limitation from `EBC-R1.3-WS12-013`: a `device_bash`-started `next dev` process is not reachable as `localhost` from browser tooling in this environment (confirmed in that earlier session), so starting one here would not have enabled a genuine browser-driven smoke test in any case. |

No check is claimed to have passed unless it actually ran successfully, per Project Instructions §28.

---

## 5. Regression Assessment

Assessed by direct code inspection against the card's own Regression Expectations list, since a live smoke pass was not available this round (Section 4):

| Area | Assessment |
|---|---|
| Claim Ownership | `claimJourneyPlanningRecord` (service.ts) — untouched. Unaffected. |
| Reassign | `reassignJourneyPlanningRecord` (service.ts) — untouched. Unaffected. |
| Discovery Notes | `addPlanningActivity` (service.ts) — untouched. Unaffected. |
| Trip Basics | `updateJourneyPlanningTripBasics` (service.ts) — untouched; its validation (`validateUpdateJourneyPlanningTripBasicsInput`) now collects all field issues instead of throwing on the first, and its API route now returns `issues` — this is the same class of change as PRA-01 itself (Section 1), not an incidental regression risk. Every previously-passing case (a single invalid field) still fails with the same first-error `code` as `issues[0].code`, preserving `error.code`-level compatibility for any caller that only reads `code`. |
| Stage progression | `JOURNEY_PLANNING_ALLOWED_TRANSITIONS` (types.ts) — untouched. `validateStageTransition`'s control flow was extended (one new `if` block, additive, positioned after the existing `allowed.includes(to)` check and before the existing Discovery→Planning check) — every transition other than `lead_created → discovery` is provably unreached by the new code path. |
| Proposal Versions | `createProposalVersion` / `validateItinerarySnapshot` — untouched. Unaffected. |
| Tasks | `addJourneyPlanningTask` / `setJourneyPlanningTaskStatus` — untouched. Unaffected. |
| History | `getJourneyPlanningHistory` / audit event recording — untouched; confirmed no new audit event type was introduced (Section 3, point 7). |
| Queue | `getJourneyPlanningQueue` (`GET` route) — untouched. Unaffected. |

`tsc --noEmit` passing clean across the whole `web/` project is itself a meaningful regression signal for a change of this shape (a widened exception type and a widened function parameter type would surface as a compile error at every non-conforming call site) — no other call site of `JourneyPlanningValidationError`, `validateStageTransition`, or `validateTripBasicsFieldValues` exists outside the files listed in Section 2, confirmed by the clean compile.

---

## 6. Known Limitations

- **Live smoke testing was not performed this round** (Section 4) — recommended as Keerthi's first action before sign-off, specifically covering: Create Record with 2+ simultaneous invalid fields (verify all messages appear together, not just the first); Adults = 0 (verify it now reads "Number of Adults must be greater than zero." with code `adults_must_be_positive`, not the old `adults_required`); the Discovery→Planning gate with 2+ missing fields (verify all missing-field messages appear); an unowned record's "Move to Discovery" button (verify disabled + tooltip + inline note); a direct API call attempting Lead Created→Discovery on an unowned record as an Administrator (verify HTTP 400, `code: "lead_created_to_discovery_requires_owner"`).
- **The two pre-disclosed WS12-013/014 UX deviations remain unchanged and out of this card's scope**, per its own "Out of Scope" list (no Departure City typeahead, no autosave): Preferred Departure City is still a plain text field; Trip Basics save is still a manual button.
- **`adults_required` vs. `adults_must_be_positive` is a code-level contract change** for any external consumer that pattern-matches on the old single code for both "missing" and "zero/negative" cases (Section 3, point 2) — none is known to exist in this repository (Keerthi's own `WS12-014` script only asserted the *response status* 400 for those cases, not a specific downstream consumer of the code), but this is flagged explicitly in case one exists outside this codebase.

---

## 7. Recommended QA Focus Areas (Keerthi)

1. Create Record with Title, Origin Channel, and Adults all invalid/missing at once — confirm all three messages render together in the existing error banner as a list, not just one.
2. Adults = 0 and Adults = -1 — confirm the message is now "Number of Adults must be greater than zero." (code `adults_must_be_positive`), and Adults omitted/non-numeric still reads "Number of Adults is required." (code `adults_required`).
3. Discovery→Planning gate with exactly one field missing vs. several missing — confirm the message lists only the actually-missing fields, using the exact PRA-01 wording.
4. An unowned Lead Created record: confirm "Move to Discovery" is visibly disabled with a tooltip, and the inline note "Claim this Journey before beginning Discovery." appears; confirm Claim removes both, and "Move to Discovery" becomes clickable.
5. Direct API repro of the PRA-02 server gate (bypassing the UI) as an Administrator on an unowned record — confirm HTTP 400 and `code: "lead_created_to_discovery_requires_owner"`, and that no new audit event was written for the rejected attempt.
6. Full regression smoke across Claim, Reassign, Discovery Notes, Trip Basics save, all other stage transitions, Proposal Versions, Tasks, History, and Queue — per Section 5's code-level assessment, no behavioural change is expected in any of these, but none was live-verified this round.

---

## 8. Completion Criteria — Status

| Criterion | Status |
|---|---|
| PRA-01 implemented | ✅ |
| PRA-02 implemented (UI + server enforcement) | ✅ |
| No regressions introduced (code-level assessment; live smoke not available) | ✅ assessed, ⚠️ not live-verified — see Section 4/6 |
| TypeScript passes | ✅ `npx tsc --noEmit` clean |
| ESLint passes | ✅ 0 errors (4 pre-existing, unrelated warnings) |
| Focused smoke testing completed or explicitly disclosed if unavailable | ✅ explicitly disclosed as unavailable (Section 4) |
| No Product/UX/Architecture/database/release/QA/governance changes | ✅ confirmed via `git diff --stat` scoping (Section 4) |
| No autosave, no Departure City typeahead, no additional Planning fields, no reset password, no Workspace Users, no RBAC redesign implemented | ✅ none implemented |
| **Repository left uncommitted** | ✅ no commit or push performed |
| **No production deployment** | ✅ none performed |

---

## 9. Git Status (post-edit)

Working tree remains uncommitted, per Project Instructions §26 and this card's own explicit completion constraint. This card's own six files sit alongside the pre-existing WS12-007/010/013/015A uncommitted change set (Section 0) — no commit, push, branch change, or destructive Git operation was performed.

**Suggested commit scope for the Product Owner's own future commit** (not executed by this card): the six files in Section 2, as a single `feat(WS12): PRA-01 field-specific validation feedback + PRA-02 ownership gate` commit, separate from the still-uncommitted WS12-013 Trip Basics work and the WS12-015A governance docs, so each remains independently revertible if needed.

---

*Prepared by Rad (Engineering and Implementation Specialist), Team Satvi. This report reflects static analysis (`tsc`, `eslint`) and direct code-level regression assessment; it does not constitute Keerthi's functional QA, Sri's traveller-experience review, or the Product Owner's release approval.*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01L6KYAiNwVu86RMW3fEXWsh
