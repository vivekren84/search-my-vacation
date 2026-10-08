# EBC-R1.3-WS13-026 — Phase 1 Milestone B: Completion & Engineering Validation Report

| Field | Value |
|---|---|
| Card | EBC-R1.3-WS13-025 — Phase 1 Milestone B Engineering Implementation Authorisation (Tiger) |
| Submitted for | Product Owner and governance review (Tiger). This report does not accept or close Milestone B. |
| Persona | Rad — Engineering & Implementation Specialist |
| Release / Workstream | Release 1.3 / WS13 Journey Workspace — Phase 1 (Journey Core) |
| Authority | DEC-R1.3-026; DEC-R1.3-028 (Checkpoint 1 passed, Milestone B authorised); EBC-R1.3-WS13-025; frozen baseline EBC-R1.3-WS13-020 Rev 2 with 020A (Archie) and 020B (Sophie); UX Rev 4a (EBC-R1.3-WS13-002) |
| Engineering gates | Journey page checkpoint (8-Oct-2026); **Gate 1** end-to-end actions — PASSED (PO, 8-Oct-2026); **Gate 2** build, `verify:*`, API and SQL suites — PASSED (PO, 8-Oct-2026) |
| Working state | Cloud working copy, branch `ws13-milestone-b`, starting HEAD `1f73a4b`. **All Milestone B work is uncommitted.** The Mac repository is unchanged at `1f73a4b`. |
| Date | 8 October 2026. **Revision 1**, 8 October 2026: §2 lifecycle-action classification revised per the Product Owner's governance reconciliation; §16 sentence aligned. No other change. |
| Status | **Milestone B engineering implementation and validation: PASSED.** Submitted for review. Formal acceptance and closure are for the governance review. |

Rad's technical completion does not equal Keerthi's functional approval, Sri's experience approval or Product Owner acceptance.

**Governance confirmations.**
- No shared Supabase database was read or modified during Milestone B. Every test ran against local container databases.
- No Preview deployment. No Production deployment.
- No Git commit or push. Nothing was transferred to the Mac repository.
- No governance record was modified (Decision Register, Feature Register, Technical Debt Register, Governance Backlog, Release tracker).
- No credentials were typed, read or entered. No genuine operational record was used; local test records are named `QA-WS13-P1-*`.
- No carry-forward item was implemented (see §12 for the one shared component that carries TD-WS13-004).

---

## 1. Implementation Summary

Milestone B delivers the first complete Journey Workspace user experience on top of the Milestone A service and API layer:

- **JW-01 Journey list** (`/workspace/journey-workspace`) replaces the Coming Soon placeholder.
- **JW-02/03/08 Journey page** (`/workspace/journey-workspace/[journeyId]`) with the header, people cards, lifecycle stepper, status banners and the Overview, Itinerary and History tabs (020B C-01).
- **JW-12 lifecycle dialogs, JW-15 contact editor, JW-17 Assign/Reassign and legacy adoption**, and the Service Category picker (UX §36.2).
- Phase 2 and 3 surfaces are hidden, with no "Coming Soon" placeholders (020B S-1).

No schema change, no new dependency, no API-contract change, no environment variable and no infrastructure change. M11 is unchanged.

---

## 2. Scope Implemented, Mapped to EBC-R1.3-WS13-025

| 025 scope | Implemented | Where | Validated by |
|---|---|---|---|
| **A. Workspace shell, routing, loading, error handling** | List and Journey routes inside the existing Workspace shell; `?tab=` URL state; skeleton loading; not-found state with a way back; "Couldn't load this Journey. Try again"; inline retry in tabs; refusal toasts with reload | `app/workspace/(dashboard)/journey-workspace/page.tsx`, `[journeyId]/page.tsx`, `journey/JourneyWorkspaceView.tsx`, `list/JourneyListView.tsx` | Journey page suite ER-01…ER-06; Gate 1 ER-01…ER-05 |
| **B. Overview** — summary, status, metadata, Service Category, assigned consultant, traveller summary, lifecycle status, operational information | Header (title, Service Category chip, dates with no edit control, nights, relative departure, template); three people cards (Journey Owner, Primary Operational Contact, Travellers); stepper; status banners; Next step card; readiness summary (020B §3); recent activity; Journey facts rail (020B C-02, C-03) | `journey/*`, `tabs/OverviewTab.tsx`, `LifecycleStepper.tsx`, `primitives.tsx` | OW-01…OW-11, OW-22…OW-32 |
| **C. Itinerary** — read-only timeline, empty state | Read-only render of the accepted Proposal Version snapshot (stops, nights, inclusions, price at acceptance, notes); "View planning history ↗"; empty state | `tabs/ItineraryTab.tsx` | OW-13, OW-14 |
| **D. History** — timeline, ordering, Sophie's labels, timestamps | Newest first; filter chips All · Stage & status · Ownership · Contact & category; pages of 50 with "Load earlier events"; pinned planning-record and supersession links; TL-08 labels and SR-11 label; relative time with absolute time on hover | `tabs/HistoryTab.tsx`, `tabs/HistoryList.tsx`, `historyLabels.ts` | OW-15…OW-17; Gate 1 RA-05, SC-04, CT-07, AD-05, AD-07, SB-04, HR-07, LC-07, LC-09, HI-01…HI-03 |
| **E. Lifecycle actions** | See the reconciliation table below | `dialogs/LifecycleDialog.tsx`, `dialogs/AssignDialog.tsx` | Gate 1 §3 |
| **F. Legacy adoption** — Administrator only, nights calculation, audit, errors | Adoption side panel (owner, dates, C-14 nights note, template, Service Category required with no pre-selection, contact); Workspace Users see "Awaiting adoption by an Administrator." | `panels/AdoptionPanel.tsx`; D-1 fix in `lib/…/service.ts` | AD-03…AD-05 (page); Gate 1 AD-01…AD-10; API D-1 group |
| **G. Contact management** — editing, validation, errors | Side panel; type, name, organisation (required for corporate and B2B), phone and/or email; every problem shown at once; same validator as the API | `panels/ContactEditor.tsx`, `panels/ContactFields.tsx` | Gate 1 CT-01…CT-07 |
| **Security** — role visibility, Administrator override, ownership enforcement, UI restrictions, error presentation | All controls driven by the Milestone A `availableActions`; non-owners see no action controls and the read-only line; Administrators see owner actions plus adoption; deactivated users are refused; every action is re-checked by the API and M11 | `JourneyWorkspaceView.tsx`, `PeopleCards.tsx` | NO-01…NO-09, AD-01…AD-06, DO-01…DO-04, DE-01, DE-02; Gate 1 RA-07, ER-04 |
| **H. Documentation** | This report; module header comments in every new file citing the UX, 020B and baseline sections they implement | — | — |
| **I. Validation results** | §3–§8 | — | — |
| **GF-4: SR-11 and 020B C-01…C-14** | SR-11 label implemented; C-01…C-10, C-13, C-14 implemented; C-11 and C-12 belong to carry-forward WS13-P1-G (§12) | `historyLabels.ts` and as above | See §11 for SR-11 coverage |

**Lifecycle actions — governance reconciliation (Revision 1; Product Owner governance review, 8-Oct-2026).** EBC-025 enumerated six lifecycle actions in its implementation-scope wording. Five further actions were implemented because the approved Product and UX baseline specifies them as part of the Journey Workspace lifecycle. They are classified as **baseline-supported lifecycle actions omitted from EBC-025's enumerated action list**. EBC-025 did not enumerate them, and this report does not state or imply that it did.

| Action | Classification | Supporting evidence | Implemented and validated |
|---|---|---|---|
| Start preparation | Enumerated in EBC-025 | UX Rev 4a §9.3, §19 IF-01; 020B S-4 | Yes (OW-18…OW-22; AD-09, AD-10) |
| Place on hold | Enumerated in EBC-025 ("Hold") | UX Rev 4a §9.3, §19 IF-05 | Yes (HR-01…HR-05) |
| Resume | Enumerated in EBC-025 | UX Rev 4a §9.3, §19 IF-05 | Yes (HR-06, HR-07) |
| Mark as Completed | Enumerated in EBC-025 ("Complete") | UX Rev 4a §9.3, §19 IF-04, UX-08 | Yes (LC-05…LC-08) |
| Cancel Journey | Enumerated in EBC-025 | UX Rev 4a §9.3, §19 IF-06 | Yes (OW-33, OW-34; LC-09) |
| Assign / Reassign | Enumerated in EBC-025 | UX Rev 4a §16, §19 IF-14 | Yes (RA-01…RA-07) |
| Mark ready to travel | **Baseline-supported lifecycle action omitted from EBC-025's enumerated action list** | UX Rev 4a §5 (JW-12), §8.2, §9.3, §19 IF-02; Product Baseline WS13-001 FR-JW-08, FR-JW-09, BR-025, BR-028 | Yes (LC-01, LC-02); validated under Gate 1 item 7 |
| Mark travelling | **Baseline-supported lifecycle action omitted from EBC-025's enumerated action list** | UX Rev 4a §5 (JW-12), §8.2, §9.3, §19 IF-03; WS13-001 FR-JW-08, FR-JW-09, BR-025 | Yes (LC-04) |
| Mark travel complete | **Baseline-supported lifecycle action omitted from EBC-025's enumerated action list** | UX Rev 4a §5 (JW-12), §8.2, §9.3, §19 IF-03; WS13-001 FR-JW-08, FR-JW-09, BR-025 | Yes (LC-travel_complete) |
| Begin post-travel follow-up | **Baseline-supported lifecycle action omitted from EBC-025's enumerated action list** | UX Rev 4a §5 (JW-12), §8.2, §9.3, §19 IF-04; WS13-001 FR-JW-08, BR-025 | Yes (LC-post_travel) |
| Step back to In Preparation | **Baseline-supported lifecycle action omitted from EBC-025's enumerated action list** | UX Rev 4a §5 (JW-12), §9.3 (Ready to Travel secondary action and dialog), §29.3 E-04; 020B C-07; WS13-001 FR-JW-08, BR-025 | Yes (SB-01…SB-04); validated under Gate 1 item 5 |

The UX baseline (EBC-R1.3-WS13-002 Rev 4a) records that it consumed the approved Product Baseline (WS13-001) as its authoritative input; its JW-12 lifecycle dialogs and the §9.3 action matrix include all eleven actions above. The frozen Phase 1 Engineering Baseline (EBC-R1.3-WS13-020 Rev 2), the M11 transition function and the Milestone A `transition` route implement the same set.

**Governance conclusion (Product Owner, 8-Oct-2026).** The five additional lifecycle actions are baseline-supported and are not unauthorised scope expansion. The discrepancy is limited to the completeness of EBC-025's enumerated implementation-scope wording and is a governance/documentation reconciliation. No code change is required; no functionality is removed; no new lifecycle functionality is added; no Product, UX or Architecture baseline change is required.

**Supporting server-side additions (Milestone A files, additive, no contract change for existing fields):**

| File | Change | Reason |
|---|---|---|
| `lib/workspace/journey-workspace/types.ts` | `JourneyPlanningRecordRef { id, title, intendedTravelMonth }`; `JourneyListResult.departureWindowDays` | Intended Travel Month "for reference only" (C-03); "Departing ≤ n days" chip label from configuration (UX §26) |
| `lib/workspace/journey-workspace/repository.ts` | Planning-record read includes `intended_travel_month` | as above |
| `lib/workspace/journey-workspace/service.ts` | List returns `departureWindowDays`; **D-1** guard order in `adoptLegacyJourney` (§9) | as above; D-1 |
| `lib/workspace/settings/repository.ts`, `settings/service.ts` | Count of active items per readiness template | Start-preparation "no items yet" note (020B S-4) |
| `app/api/workspace/journey-workspace/reference-data/route.ts` | Templates carry `itemCount` | as above (new field added; existing fields unchanged) |
| `components/workspace/shared/Toast.tsx` | Polite live region; optional action link on a toast that then does not auto-dismiss | TD-WS13-004; C-11 groundwork (§12) |

---

## 3. Gate 1 — End-to-End Actions (PASSED, 70 / 70)

Every action was saved through the real page and Next.js server into the local container database, then checked in the UI, in the database row, in the audit log and in the History label. Run against the development server (Gate 1) and again against the production build (Gate 2).

| # | Group | Checks | Result |
|---|---|---|---|
| 1 | Reassign (RA) | 7 | 7 pass |
| 2 | Service Category (SC) | 5 | 5 pass |
| 3 | Contact editing (CT) | 7 | 7 pass |
| 4 | Legacy adoption (AD) | 10 | 10 pass (after D-1) |
| 5 | Step back (SB) | 4 | 4 pass |
| 6 | Hold / Resume (HR) | 7 | 7 pass |
| 7 | Remaining stage changes and next-step card (LC) | 11 | 11 pass |
| 8 | History "Load earlier events" (HI) | 3 | 3 pass |
| 9 | Keyboard and focus (KB): 8 in the main run + 3 adoption-panel checks | 11 | 11 pass |
| 10 | Refusal and error after save (ER) | 5 | 5 pass |
| | **Total** | **70** | **70 pass** |

*Record correction:* the Gate 1 checkpoint table showed "10/10" for groups 7 and 9; the correct counts are 11 and 11. The total of 70 was correct.

**Highlights.**
- Refusals tested for real: owner changed meanwhile (stale), Journey cancelled meanwhile (terminal), Journey on hold meanwhile, ownership moved during an open dialog (not authorised), second Administrator's stale adoption (D-1).
- Refusals simulated by intercepting the response (cannot be produced through the page): 401 session ended; 400 server field issue. Network failure was simulated by aborting the request.
- Contact audit keeps no phone or email value (Archie AC-5): confirmed.
- Not exercised: server-side `template_already_assigned` and server-side contact field refusals (both prevented before saving in Phase 1); focus position after a successful save (not specified by the UX baseline).

**Journey page suite (checkpoint, 8-Oct-2026): 67 / 67** — owner 38, non-owner Consultant 9, Administrator 6, deactivated owner 4, deactivated user 2, error and loading 6, responsive (820 px, 390 px) 2. Re-run against the production build: 67 / 67.

---

## 4. Gate 2 — Build and Verification (PASSED)

### 4.1 Production build — PASS
`next build` (Next.js 16.2.10, Turbopack): compiled successfully, TypeScript step passed, 36/36 static pages generated, **no warnings**. All Journey Workspace API routes and both new pages (`/workspace/journey-workspace`, `/workspace/journey-workspace/[journeyId]`) are in the build output. Built locally with the local Supabase stand-in URL and mocked Google Fonts (023 F-09); not built on Vercel.

The production build was then started locally and every UI suite re-run against it: Journey page 67/67, Gate 1 67/67, adoption-panel keyboard 3/3, list smoke 3 runs with no console errors.

### 4.2 `verify:*` scripts — 21 pass, 4 fail (pre-existing, outside WS13)

| Script | Result |
|---|---|
| verify:journey-workspace-transitions | PASS (118 checks) |
| verify:journey-workspace-derivations | PASS (24) |
| verify:journey-workspace-dates | PASS (22) |
| verify:journey-workspace-config | PASS (17) |
| verify:journey-workspace-actions | PASS (92) |
| verify:journey-workspace-errors | PASS (203 checks; 33 SQL codes) |
| verify:journey-workspace-list | PASS (44) |
| verify:journey-presentation | PASS |
| verify:journey-presentation-catalogue | PASS (5 entries, 0 hard failures, 3 known-deferred warnings) |
| verify:journey-catalogue | PASS |
| verify:journey-orchestration | PASS |
| verify:journey-runtime | PASS |
| verify:journey-scenarios | PASS (regenerates `docs/02-Product/EBC-007-JOURNEY-SCENARIO-AUDIT.md`; output identical, repository unchanged) |
| verify:journey-leads | PASS (109) |
| verify:geo-validation-coupling | PASS |
| verify:geo-validation-selection | PASS (17) |
| verify:getaway-description | PASS (16) |
| verify:journey-intelligence:runtime | PASS |
| verify:journey-itineraries | PASS |
| verify:destination-itineraries | PASS |
| **verify:journey-engine** | **FAIL** — "Verification failed: escape resolves to its editable mood preselection" |
| **verify:journey-intelligence** | **FAIL** — "ArtifactVerification \| Generated directory must contain exactly the eight documented artifacts" |
| **verify:journey-intelligence:determinism** | **FAIL** — "DeterminismVerification \| --workbook is required" |
| **verify:journey-intelligence:steering** | **FAIL** — "Verification failed: mountain intent keeps Goa eligible for scoring rather than hard-excluding it" |

**The four failures are pre-existing and outside WS13. They are not WS13 defects and not Milestone B blockers.**
- **Same failures on untouched HEAD `1f73a4b`.** The repository at `1f73a4b` was exported with `git archive` (no Milestone B file present) and the four scripts were run against it with the same dependencies. Each failed with the identical message.
- **Outside WS13.** They belong to Journey Director and Destination Intelligence (Release 1.2). No file under `web/lib/journey-director`, `web/lib/journey-intelligence` or `web/scripts` differs from `1f73a4b`.
- **Already documented.** `verify:journey-engine` (stale `moodValues` fixture after the Escape-card removal) in `EBC-R1.2-03.07-RAD-Phase-0-Governance-Foundations-Implementation.md`; `verify:journey-intelligence`, `:steering` and `:journey-engine` in `R1.2-WS3-IMP-01B-EBC-RAD-Workbook-Consistency-Remediation.md`. `:determinism` stops because it needs a `--workbook` argument the script does not pass.

### 4.3 API integration suite — 121 / 121 PASS

The compiled Journey Workspace service layer, recompiled from the current code (including D-1), driven through supabase-js against local PostgREST 12.2.3 and PostgreSQL 17.6 (35 migrations + M11) with a real JWT per user, so every call crosses PostgREST, RLS, grants and the M11 functions.

| Group | Checks |
|---|---|
| L list and summary counts | 21 |
| D detail and available actions | 11 |
| M lifecycle mutations | 43 |
| C Primary Operational Contact (RLS + audit) | 11 |
| A legacy adoption (PO Decision 5) | 9 |
| **D-1 concurrent adoption (new, Gate 2)** | **11** |
| H History paging and Itinerary | 9 |
| R route error responses | 5 |
| P database calls per operation (measure only) | 1 |
| **Total** | **121 pass, 0 fail** |

Milestone A reported 112. Two adoption checks moved into the new D-1 group, which adds 11 checks in total (net +9).

### 4.4 M11 SQL suite — 198 / 198 PASS
Fresh local database (35 migrations + M11). M11 is unchanged since Archie's review (`EBC-R1.3-WS13-023A`).

---

## 5. TypeScript and Lint

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.json` | PASS — 0 errors |
| `eslint .` (whole project) | 0 errors, 4 warnings |

The 4 warnings are pre-existing unused variables outside WS13: `lib/geo-validation/bootstrapRepository.ts` (2) and `scripts/bootstrap-workbook/writeWorkbook.ts` (2). Milestone B code has no warnings and no rule suppressions.

Lint findings fixed during implementation (not defects): five `react-hooks/set-state-in-effect` / unused-variable findings in new Milestone B files, resolved by keying each load to its inputs; one suppression removed.

---

## 6. Local Engineering Environment

| Component | Detail |
|---|---|
| Database | PostgreSQL 17.6 in the cloud container; repository migrations + M11 replayed per run (`m11ui`, `m11api`, `m11sql`) |
| REST | PostgREST 12.2.3 |
| Supabase stand-in | Local process: `/auth/v1/user` verifies a locally signed HS256 test token; `/rest/v1` proxies to PostgREST |
| App | Next.js dev and production servers on 127.0.0.1 |
| Browser | Playwright 1.56 with Chromium |
| Test data | Local fixture `QA-WS13-P1-*`: 14 Journeys across all stages, two legacy Journeys, users ADMIN, ADMIN2 (added for D-1), OWNER, OTHER, DEACT, STRANGER |

The harness and fixtures are working artifacts, not repository assets.

---

## 7. Engineering Findings (Milestone B)

| ID | Finding | Status |
|---|---|---|
| **D-1** | Concurrent adoption refused with the wrong reason (§9) | **Fixed and regression-tested** |
| B-01 | The Workspace shell scrolls the window (`min-h-screen`), not `<main>`, so a sticky bar inside `<main>` could never stick. The one-line collapsed header is fixed to the top of the viewport and aligned to the `<main>` column. | Fixed during implementation; OW-36, OW-36b |
| B-02 | A load failure on the Journey page first showed the save wording "That didn't save…". Now "Couldn't load this Journey." with Try again. | Fixed during implementation; ER-03 |
| B-03 | The shell header overflows by about 103 px at 390 px width on every Workspace page (also Dashboard and Journey Planning). Journey page content fits. | Parked observation (§11), pre-existing |
| — | No new dependency, schema change or API-contract change. | — |

---

## 8. TD-WS13-006 / OBS-P1-04

**Status: open, unchanged, outside Milestone B scope.** Re-confirmed by the API suite: a JWT for an unprovisioned user, and for a deactivated user, can read the active Journeys (12 in the fixture, team scope) directly through PostgREST, because `workspace_journeys` has a `using (true)` read policy. The application routes refuse both users before any read (`authenticateWorkspaceApiRequest`), and the Milestone B pages refuse a deactivated user (redirect to sign-in, API 403; DE-01, DE-02). Routed to the RLS hardening card before Phase 3 (DEC-R1.3-026 ND-12). No Milestone B change.

---

## 9. D-1 — Concurrent Adoption Refused With the Wrong Reason

| Item | Detail |
|---|---|
| **Observed behaviour** | Gate 1, AD-08. Two Administrators opened the same legacy Journey that had no stored nights. Administrator A adopted it (4 nights derived). Administrator B then submitted the panel prepared earlier (2-night dates). B received **400 `dates_nights_mismatch`** — "These dates don't match the number of nights in the original record. Change the dates so they match." — with a field issue on the end date, and the panel stayed open with a misleading message. Expected: **409 `not_legacy`** — "This Journey has already been adopted." |
| **Root cause** | `adoptLegacyJourney` (Milestone A service) validated the request fields, including the dates against the Journey's stored nights, **before** any state check. After A's adoption the stored nights were A's, so B's stale dates failed the nights rule first. The database function checks in the opposite order (`workspace_journey_lock_for_change`: active caller → exists → not archived → not terminal → still awaiting adoption → Administrator → then fields). |
| **Correction** | The service now refuses state first, in the M11 order, before any field check: archived → `archived`; terminal → `terminal`; no longer awaiting adoption → `not_legacy`; not an Administrator → `not_authorised`. Field validation follows unchanged. The RPC remains the authority. |
| **Files affected** | `web/lib/workspace/journey-workspace/service.ts` only: 11 added lines (one import, `isJourneyTerminal`; ten lines in `adoptLegacyJourney`). The file's other Milestone B line (`departureWindowDays`) is unrelated. |
| **API-contract impact** | None. No new error code, field or route. All four codes and statuses already existed. Behavioural note: a Workspace User posting to an already-adopted Journey now receives `not_legacy`/409 (the M11 order) instead of a field error; on a Journey still awaiting adoption they still receive `not_authorised`/403. |
| **Schema impact** | None. M11 unchanged. |
| **Regression test** | API suite group "D-1 concurrent adoption (Gate 2)", 11 checks, with a second Administrator added to the local fixture: both Administrators see the Journey awaiting adoption; A adopts (nights derived = 7); B's stale submission (3 nights, different owner, category and contact) → `not_legacy`/409 with no field issues; the API response is 409 with "This Journey has already been adopted." and no issues; B with dates that happen to match A's nights → `not_legacy`; the database function called directly as B refuses with `workspace_journey_not_legacy` (the database stays authoritative); Journey row, contact row and audit count are byte-identical before and after B's attempts; A's adoption stands (owner, 7 nights, Family); a Workspace User on the adopted Journey → `not_legacy`. UI: Gate 1 AD-08 passes (toast "This Journey has already been adopted.", page reloads, database unchanged). |
| **Fails before, passes after** | Against the pre-fix Milestone A build the D-1 group fails 4 of 11 checks (B receives `dates_nights_mismatch`/400 with a field issue). Against the corrected build: 11 / 11, suite 121 / 121. |
| **Disposition** | Accepted by the Product Owner as an implementation defect correction within Phase 1 scope (8-Oct-2026). Resolved for Milestone B engineering purposes. |

---

## 10. Deployment Readiness (information only)

Not deployed. Nothing in Milestone B requires a database change: the pages use the Milestone A API and M11. Deployment remains governed by the existing checkpoints (`EBC-R1.3-WS13-021` §11) and the deployment runbook: M11 must be applied to the shared database before the branch is pushed, otherwise the mutation routes return 500 `operation_failed` (023 §11). Phase 1 QA (Checkpoint 5) follows the QA playbook and uses approved test records only (PO Decision 7).

---

## 11. Parked Observations (not scope; for the governance review)

None of these is converted into scope. Each remains as the Product Owner parked it on 8-Oct-2026 unless the review decides otherwise.

| ID | Observation | Owner for decision |
|---|---|---|
| OBS-B1 | Workspace shell header overflows by about 103 px at 390 px on every Workspace page. Pre-existing shell issue; Journey page content fits. | Sophie / Tiger |
| OBS-B2 | A Cancelled Journey still shows the readiness panel (e.g. "Ready · No checklist items yet"). | Sophie |
| OBS-B3 | Administrator "Mine" view with no owned Journeys shows "No active Journeys right now." (UX §24 copy taken literally) while Team has Journeys; the summary counts are Mine-scoped. | Sophie |
| OBS-B4 | The Next step card button repeats the header's primary action. Implemented as UX §8.2's table specifies. | Sophie |
| OBS-B5 | A Journey with no Primary Operational Contact cannot get one (no INSERT policy; 023 F-06). The card shows "No Primary Operational Contact recorded." with no Edit. | Arjun / Archie / PO |
| OBS-B6 | Later-phase copy omitted from Phase 1 dialogs and screens: the archive-eligibility sentence in Mark as Completed; the reminder sentence in Place on hold; the open-bookings list in Cancel Journey; the reminder threshold on the On Hold banner; the Itinerary sentence about Activity & Changes and its two routes; the alert banner; "Log activity". | Sophie |
| OBS-B7 | New microcopy written for Phase 1, for Sophie's review: success toasts other than the two the baseline gives; dialog descriptions for Mark travelling, Mark travel complete, Begin post-travel, Mark ready to travel (with items), Place on hold; "Keep Journey" as the Cancel dialog's secondary button; Assign dialog description and note helper; Itinerary empty state, "Proposal version n", "Saved [date]", "Price estimate at acceptance", "No stops were recorded in this version."; not-found and load-failure states; "Cancelled Journeys are read-only."; legacy banner line for Administrators; "Set during adoption"; "No Primary Operational Contact recorded."; "Nothing recorded yet."; "No events of this kind yet."; "View on the planning record ↗"; adoption panel intro line and disabled reasons; contact helper "Add a phone number, an email address, or both."; "No changes yet"; "No readiness templates are available. Ask an Administrator." | Sophie |
| OBS-B8 | Implementation choices to confirm: "Also travelling" shows when the contact type is Individual traveller and the contact name equals the traveller's name; the Assign control reads "Assign…" for the owner and "Reassign…" for an Administrator; the "No checklist items yet" caption keys on zero mandatory template items. | Sophie / Arjun |
| OBS-B9 | SR-11 "Primary Operational Contact added" label is implemented but not exercised by a test: every local fixture Journey already had a contact before adoption. | Keerthi (Phase 1 QA) |
| — | 023 F-11 / OD-R1.3-8: Phase 1 performance targets remain an open Product Owner decision; latency recorded as architecture input. Unchanged. | PO / Archie |
| — | OBS-P1-QA-TB-01 (WS12 Trip Basics explicit-null 500) remains a QA observation for Keerthi. Unchanged. | Keerthi |

---

## 12. Approved Phase 1 Items Not Yet Implemented

**Carry-forward items (plan WP-1.9). Not started.**

| Item | Description | Status |
|---|---|---|
| TL-01 | Owner display name in the Journey Planning Confirm dialog (today "You" or a raw id) | Not started |
| TL-02 | Replacement banner reference becomes a link to the Journey | Not started |
| TL-05 | Header uses `workspace_users.display_name` | Not started (the header still shows the auth-derived name) |
| WS13-P1-G | C-11 conversion toast with "Open Journey" (no auto-dismiss); C-12 "Converted to Journey JRN-#### →" line on the closed planning record | Not started. The shared `Toast.tsx` already supports an action link that does not auto-dismiss (below); the conversion toast and the planning-record line are not wired. No Journey Planning file was changed. |
| WS13-P1-I + TD-WS13-005 | Neutral refusal message and sign-out on refusal; neutral API 403 message | Not started |
| TD-WS13-003 | Switch `useWorkspaceAuthUser` to `fetchWorkspaceUserAccess`, then remove `fetchWorkspaceUserRole` | Not started |
| TD-WS13-004 | Toast live region | **Implemented** in `components/workspace/shared/Toast.tsx` at the start of Milestone B, before the instruction not to start carry-forward items, because the Journey screens rely on announced toasts. Disclosed here for the governance review. |

**Later-phase items (hidden in Phase 1, 020B S-1).** Vendor Bookings, Readiness tab and checklist content, Documents, Tasks & Follow-ups, Activity & Changes (Phase 2); Dashboard panels and live KPIs, Closed & Archived list (JW-11), Archive, alerts and notifications (Phase 3); Material change and Replacement Journey (Phase 4); User Administration TL-06 (out of Phase 1, PO Decision 2); template management.

**Other.** Journey Planning screens for non-owners (WS13-P1-H) stay as they are for Phase 1 (backlog). Transfer to the Mac repository, commit, push, M11 deployment and Phase 1 QA are governance steps not yet authorised.

---

## 13. Carry-Forward Confirmation

No carry-forward implementation has started, apart from TD-WS13-004 as disclosed in §12. No file under `web/components/workspace/journey-planning`, `web/app/workspace/sign-in`, `web/hooks` or `web/lib/workspace/shared/auth` has changed.

---

## 14. Current Engineering Working State

| Item | State |
|---|---|
| Cloud working copy | Branch `ws13-milestone-b`, starting HEAD `1f73a4b` (docs(ws13): deployment runbook v0.2 …) |
| Uncommitted changes | 8 modified files, 2 new folders (22 new files), plus this report |
| Mac repository | Unchanged: `feature/r1.3-ws13-journey-workspace` at `1f73a4b`, four commits ahead of `origin`, not pushed |
| Commit / push | None |

**Modified files (8):**

| File | +/− |
|---|---|
| `web/app/api/workspace/journey-workspace/reference-data/route.ts` | +6 −3 |
| `web/app/workspace/(dashboard)/journey-workspace/page.tsx` | +22 −3 |
| `web/components/workspace/shared/Toast.tsx` | +62 −18 |
| `web/lib/workspace/journey-workspace/repository.ts` | +10 −3 |
| `web/lib/workspace/journey-workspace/service.ts` | +12 −0 |
| `web/lib/workspace/journey-workspace/types.ts` | +11 −1 |
| `web/lib/workspace/settings/repository.ts` | +19 −0 |
| `web/lib/workspace/settings/service.ts` | +13 −1 |

**New files (22; 4,464 lines):** `web/app/workspace/(dashboard)/journey-workspace/[journeyId]/page.tsx` and, under `web/components/workspace/journey-workspace/`: `Dialog.tsx`, `LifecycleStepper.tsx`, `historyLabels.ts`, `journeyApi.ts`, `journeyWorkspaceLabels.ts`, `primitives.tsx`; `dialogs/AssignDialog.tsx`, `dialogs/LifecycleDialog.tsx`, `dialogs/ServiceCategoryDialog.tsx`; `journey/JourneyWorkspaceView.tsx`, `journey/PeopleCards.tsx`, `journey/StatusBanner.tsx`, `journey/nextStep.ts`; `list/JourneyListView.tsx`; `panels/AdoptionPanel.tsx`, `panels/ContactEditor.tsx`, `panels/ContactFields.tsx`; `tabs/HistoryList.tsx`, `tabs/HistoryTab.tsx`, `tabs/ItineraryTab.tsx`, `tabs/OverviewTab.tsx`.

**This report:** `docs/09-Development/EBC-R1.3-WS13-026-RAD-Milestone-B-Completion-and-Engineering-Validation-Report.md` (cloud working copy, uncommitted) and the Project Knowledge copy.

---

## 15. Environment Confirmation

| Environment | Confirmation |
|---|---|
| Shared Supabase database | Not read and not modified during Milestone B. No migration applied. |
| Preview deployment | None |
| Production deployment | None |
| Git | No commit, no push. Read-only Git commands used `GIT_OPTIONAL_LOCKS=0`. |
| Mac repository | Unchanged at `1f73a4b`; no file transferred |
| Governance records | Not modified |

---

## 16. Engineering Conclusion

**Milestone B engineering implementation and validation: PASSED.**

The Phase 1 Journey Workspace screens are implemented against UX Rev 4a and Sophie's Phase 1 confirmations on top of the unchanged Milestone A API and M11. They compile, lint cleanly, build for production and pass every Journey Workspace check: Journey page 67/67, Gate 1 end-to-end actions 70/70, Journey Workspace `verify:*` 7/7, API integration 121/121, M11 SQL 198/198. D-1 is corrected and covered by a regression test that fails against the pre-fix implementation and passes against the corrected one. The four failing `verify:*` scripts are pre-existing Release 1.2 issues outside WS13.

Formal acceptance and closure of Milestone B, the parked observations in §11, the carry-forward items in §12 and every deployment step remain for the governance review.

---

*Prepared by Rad, Engineering & Implementation Specialist, on behalf of Team Satvi, 8 October 2026. Submitted for review; not self-approved.*
