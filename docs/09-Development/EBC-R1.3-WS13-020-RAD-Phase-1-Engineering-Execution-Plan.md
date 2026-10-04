# EBC-R1.3-WS13-020 — Phase 1 Engineering Execution Plan (Journey Core)

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | Engineering Execution Plan (response to `EBC-R1.3-WS13-020`) — **planning only** |
| Prepared by | Rad — Engineering and Implementation Specialist |
| Supporting personas | Arjun (Annex A: FR/BR traceability and Product decision analyses). Archie — `EBC-R1.3-WS13-020A` (M11 architecture review). Sophie — `EBC-R1.3-WS13-020B` (Phase 1 UX confirmations). Each output is separately attributed. |
| Submitted to | Tiger — Delivery Manager (validation) |
| Decision authority | Vivek — Product Owner. Approval of this plan is the Phase 1 implementation authorisation (`DEC-R1.3-025`). |
| Authorised by | `DEC-R1.3-025` (3-Oct-2026), card `EBC-R1.3-WS13-020` |
| Date | 3 October 2026 (Revision 1) · 4 October 2026 (Revision 2) |
| Revision | **2** — incorporates the Product Owner review of 4-Oct-2026, Archie's review (`020A`) and Sophie's confirmations (`020B`). See Revision History. |
| Repository baseline | `feature/r1.3-ws13-journey-workspace` at `d533a95`, working tree clean |
| Status | **Revision 2 — submitted for the Product Owner's final confirmation.** On confirmation, Revision 2 becomes the approved Phase 1 engineering baseline and implementation may commence (Product Owner review, 4-Oct-2026). Not self-approved. |
| Recommendation | **Ready for implementation on confirmation of Revision 2** (§17) |

> **Planning only.** No application code, migration, configuration, environment variable, database row or deployment was created or changed. Nothing was committed or pushed. M11 is specified in prose (§9); no SQL file exists.

**Evidence labels:** **[F]** fact verified in the repository or a live read-only check (path or source cited) · **[B]** stated in an approved baseline · **[Rec]** engineering recommendation · **[Def]** engineering default pending a named decision · **[A]** assumption · **[H]** hypothesis to be measured.

### Revision History

| Rev | Date | Change |
|---|---|---|
| 1 | 3-Oct-2026 | Initial plan submitted to Tiger and the Product Owner. |
| 2 | 4-Oct-2026 | Product Owner review: **Approved with Conditions** (Decisions 1–8). Archie's review `EBC-R1.3-WS13-020A`: approved with conditions AC-1…AC-9. Sophie's confirmations `EBC-R1.3-WS13-020B`: S-1…S-6 confirmed with C-01…C-14. Changes: §0, §1, §4.2, §4.3, §6, §7, §8.4, §9.1, §9.2, §9.4, §10, §11, §12 (rewritten as the decision record), §13.4, §14.6, new §14.7, §16, §17, §18, §19, Annex A note, Confirmations. Sections not listed are unchanged from Revision 1. |

### Revision 2 — summary of changes

| Source | Change in this plan |
|---|---|
| PO Decision 1 — two milestones | Milestone A (foundation, M11, service layer, profiling, engineering validation) and Milestone B (screens, integration, end-to-end engineering verification) kept separate (§5.1, §7) |
| PO Decision 2 — TL-06 out | User Administration not introduced (§4.3, §11) |
| PO Decision 3 — team visibility | All authorised Workspace Users may view the team's Journey list; ownership still governs every change (§8.4) |
| PO Decision 4 — readiness shown, not enforced | Gate built per BR-028 against the empty template, so it never blocks in Phase 1; honest display (Sophie `020B` §3); QA expectations (§14.7) |
| PO Decision 5 — nights at adoption | Derived from the Administrator's dates when not stored; recorded in History (§9.2 fn 9; Archie AC-4) |
| PO Decision 6 — deferred behaviour | Vendor-cancellation and Replacement scenarios outside Phase 1 QA; supporting code built and tested locally only (§9.2, §14.7) |
| PO Decision 7 — no genuine records | Dedicated test records only; legacy adoption QA only on a legacy Journey that is itself a test record, otherwise deferred (§14.7) |
| PO Decision 8 — measure first | Latency stays an investigation; targets confirmed after the baseline; region change is a separate architecture decision (§13.4) |
| Archie `020A` | AC-1…AC-9 incorporated (§9.1, §9.2, §9.4, §10); new pre-existing finding AR-F1 → TD-WS13-006 proposal (ND-12) |
| Sophie `020B` | Hidden later-phase surfaces, template selection, copy, History labels, readiness display (§4.2, §8, §14.7); ED-02 record correction (§18) |

---

## 0. Workspace Readiness Check (D1; Project Instructions §14–§15)

| Check | Result |
|---|---|
| Task | Phase 1 Engineering Execution Plan. Documentation only. |
| Active persona | Rad. Supporting: Arjun (Annex A); Archie (`020A`) and Sophie (`020B`), both completed 4-Oct-2026. |
| Project Instructions | Active (v2.1). |
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, connected this session (folder access granted 3-Oct-2026) **[F]** |
| Branch | `feature/r1.3-ws13-journey-workspace`, in step with `origin` (nothing ahead or behind) **[F]** |
| HEAD | `d533a95` docs(ws13): Phase 1 readiness and Engineering Planning authorisation (EBC-R1.3-WS13-019, DEC-R1.3-025, EBC-R1.3-WS13-020). Application code is unchanged since `84c8904` (all later commits are documentation). **[F]** |
| Working tree | Clean (`git status --porcelain` empty, before and after this session's checks). Read-only Git commands run with `GIT_OPTIONAL_LOCKS=0`. **[F]** |
| Local `main` | 12 commits ahead of `origin/main`, unpushed as intended (`DEC-R1.3-018` D-4) **[F]** |
| Lock files | `.git/next-index-15.lock` (14-Aug-2026) still present, untouched (already disclosed in `WS13-019` §17). No lock created this session. **[F]** |
| `_to_delete/` | Present, git-ignored (WS13-P1-E, Product Owner housekeeping) **[F]** |
| Repository guidance | `web/CLAUDE.md` → `web/AGENTS.md`: *"This is NOT the Next.js you know … Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."* Applies to every Phase 1 work package. **[F]** |
| Stack (actual) | Next.js **16.2.10**, React **19.2.4**, `@supabase/ssr` 0.12, `@supabase/supabase-js` 2.116, Tailwind 4, TypeScript 5. No ORM, no validation library, no unit-test framework; verification is `tsc` + Node `verify:*` scripts. Route protection is `web/proxy.ts` (matcher `/workspace/:path*`). **[F]** |
| Read-only checks run this session | `tsc --noEmit` → exit 0. `eslint .` → 0 errors, 4 warnings (pre-existing, in `lib/geo-validation/bootstrapRepository.ts` and `scripts/bootstrap-workbook/writeWorkbook.ts`, outside WS13). `verify:journey-workspace-transitions` 118 checks, `-derivations` 24, `-dates` 22, `-config` 17 → **181 pass** (matches Phase 0 report). **[F]** |
| Production build | Not run locally (device node_modules are macOS-built; Google Fonts unreachable from sandboxes, `WS13-005-P0` §6). **Vercel Preview is the authoritative build check:** `dpl_Grrz9zh6vneHF8popqG313Lh5G4c`, built from `d533a95`, **READY**, region **`iad1`** (Vercel API, 3-Oct-2026). **[F]** |
| Supabase project | Linked project `SearchMyVacation_WebsiteUpgrade`, Postgres 17.6. Pooler host `aws-1-ap-northeast-2.pooler.supabase.com` → **region ap-northeast-2 (Seoul)** (`supabase/supabase/.temp/`, host only read; no credential read) **[F]** |
| Secrets | None read. Environment-variable names only. |
| Files created | Rev 1: this plan. Rev 2: this plan updated; `EBC-R1.3-WS13-020A` and `EBC-R1.3-WS13-020B` added (repository + Project Knowledge). Nothing else. |
| Revision 2 re-check (4-Oct-2026) | HEAD still `d533a95`; the only working-tree change is this untracked plan file. No code, migration or configuration change. **[F]** |

---

## 1. Executive Summary

Phase 1 turns the Phase 0 foundation into the first working Journey screens: the Active Journeys list, the Journey header and Overview, the read-only Itinerary, History, the lifecycle dialogs, ownership and legacy adoption, the Primary Operational Contact editor and Service Category edit. It is buildable **within the approved architecture, with no new dependency and no schema change**: migration M11 adds nine `SECURITY DEFINER` functions and nothing else. Every audit event type M11 needs already exists (M02).

**Revision 2 (4-Oct-2026).** The Product Owner approved the plan with conditions (Decisions 1–8, §12.1). Archie approved the M11 design with conditions AC-1…AC-9 (`020A`), and Sophie confirmed the outstanding UX items (`020B`). All are incorporated below. What remains is the Product Owner's confirmation of this revision, including the defaults listed in §12.3.

**Recommended shape:** one implementation EBC (Rad) in two internal milestones — **Milestone A: database and service layer** (profiling baseline, M11, local database tests, service/API) and **Milestone B: screens** (primitives, list, header/Overview, dialogs, Itinerary, History, carry-forward fixes) — followed by one deployment (through the §2.10 runbook) and one Keerthi QA cycle (after the §2.11 playbook). This mirrors Phase 0 and keeps QA testing exactly what ships.

**Eight findings change or sharpen Phase 1** (details in §3):

1. **The readiness gate is vacuous in Phase 1.** Readiness templates have no items until Product Owner content arrives (TL-04, Phase 2). A Journey with a template and zero mandatory items derives `ready`, so "Mark ready to travel" is **immediately available** after Start preparation. `WS13-019` §12 says Ready to Travel is "not reachable end-to-end" until Phase 2; that is not accurate. Decision ND-1.
2. **Supabase runs in Seoul (ap-northeast-2); Vercel functions run in Washington DC (`iad1`); users are in India.** This strongly supports Archie's latency hypothesis for WS13-P1-J. One API call today makes about six sequential calls across that gap. Measure first (§13); any region change is Archie's and the Product Owner's decision.
3. **Legacy adoption on the shared database is a production data change.** Any `legacy_pending` Journey in the shared database is real data. Phase 1 QA of adoption needs a Product Owner decision (ND-2), and the legacy count is unknown to Rad (read-only query in Annex B).
4. **Adoption can deadlock on Number of Nights.** Legacy rows may have null nights (ENG-OBS-02), and nights cannot be edited on a Journey (BR-031) or on a closed planning record. A rule is needed (ND-3).
5. **No source exists for the "suggested" Domestic/International template.** Destinations carry free text only. Default: no pre-selection (ND-4, Sophie).
6. **Two Phase 1 behaviours cannot be reached through the product in Phase 1:** vendor-cancellation tasks on Cancel (no bookings exist until Phase 2) and replacement-open guards (Phase 4). Verified by local database tests; real QA in the delivering phase (ND-5).
7. **The `WS13-004` engineering default "Team scope = Administrator-only" conflicts with WS13-001 §15**, which lets every Workspace User view the list. Arjun recommends Team scope for all users on JW-01 (UXO-08, Annex A).
8. **Terminal Journeys leave the default list and their home (JW-11 Closed & Archived) is Phase 3.** In Phase 1 they are reachable by direct link and History only. Recommended: accept for Phase 1 (Preview only; Production app unchanged until release) (ND-6).

**Conditions closed by this plan:** C-3 (§11), C-4 (§12: decision record and remaining confirmations), C-5 (§13). C-6 gates are placed in the sequence (§7). Archie's review of M11 is complete (`020A`). Findings 1–8 below are kept as written in Revision 1; their outcomes are in §12.1.

---

## 2. How this plan answers the card

The card was issued in two forms: the repository card (`docs/09-Development/EBC-R1.3-WS13-020-TIGER-…`, deliverables D1–D12) and the card text sent to Rad (sections 5–15, deliverables A–H). Both are covered:

| Repository card | Card text | Where |
|---|---|---|
| D1 Workspace Readiness Check | — | §0 |
| D2 Post-Phase 0 re-baseline | §3 Inputs reviewed | §3 |
| D3 Work package breakdown | §6 Engineering Strategy; C Engineering Roadmap | §5, §6, §7 |
| D4 M11 specification | §7 Technical Design (database, Supabase functions); §8 Data Strategy | §9 |
| D5 API and UI plan | §7 Technical Design (components, routes, APIs, role-based behaviour); D Technical Design Summary | §8 |
| D6 Carry-forward and debt disposition (C-3) | §5 Scope Analysis (Deferred) | §4, §11 |
| D7 Decision schedule (C-4) | §12 assumptions/dependencies | §12, Annex A |
| D8 Performance profiling and target (C-5) | §9 Performance Strategy; F Performance Plan | §13 |
| D9 Verification and test plan | §11 Testing Strategy; G Testing Strategy | §14 |
| D10 Success-criteria traceability | §14 Success Criteria | §15, Annex A.1 |
| D11 Risks, dependencies, rollback | §12 Engineering Risks; E Risk Register | §16 |
| D12 Readiness recommendation and effort | H Engineering Readiness Statement | §17 |
| — | §5 Scope Analysis; B Scope Matrix | §4 |
| — | §10 Security Review | §10 |
| — | §13 Phase Breakdown | §7 |

---

## 3. Post-Phase 0 Re-baseline (D2)

### 3.1 What Phase 0 actually built (verified)

| Area | As built **[F]** | Phase 1 use |
|---|---|---|
| Migrations | M01–M10 (`20260928100000` … `20260928100900`), applied to the shared database; parity 34 = 34 (`DEC-R1.3-021`) | M11 is the 35th migration |
| Journey table | `workspace_journeys` extended (M07): stage, outcome, on_hold overlay (+reason, since), closed_at, archive overlay, readiness_template_id, supersedes_journey_id, adoption_status, service_category, owner, dates, trip parameters, `JRN-####`. **No UPDATE grant** for `authenticated`. Integrity CHECKs: on-hold only in the three holdable stages and only with no outcome; outcome needs a reason; `closed_at` required for `journey_closed`; adopted Journeys need owner, both dates and Service Category. | Every Journey write in Phase 1 is an M11 RPC (AD-WS13-002) |
| Child tables | Contacts, vendor bookings, readiness items, documents, change records, activities (M08), RLS via `workspace_can_edit_journey()` (owner or Administrator, active user, adopted, not terminal, not archived). No DELETE grants. POC is updated through RLS (`grant update (contact_type, name, organisation, phone, email, updated_by)`). | POC editor uses the RLS path, as AD-WS13-002 states |
| Summary view | `workspace_journey_operational_summary` (M09, `security_invoker`): is_active, is_terminal, days_to_departure, departing_within_window, booking/document counts, readiness counts and state, archive_eligible. **Does not carry** party name, POC name or owner display name. | List and Overview read it; names are joined in the service (§8.3) |
| Audit | M02 event types include every Phase 1 event: `journey_stage_changed`, `journey_stage_stepped_back`, `journey_on_hold`, `journey_resumed`, `journey_cancelled`, `journey_closed`, `journey_reassigned`, `journey_service_category_changed`, `journey_contact_changed`, `journey_template_assigned`, `journey_legacy_adopted`, `task_created`. | **M11 needs no audit CHECK change** |
| Notifications | Informational rows inserted directly (conversion v2 precedent: `journey_confirmed`, `journey_superseded`). Condition alerts: schema only (TL-03, Phase 3). | IN-02/03/04 inserted by M11 the same way |
| Configuration | `service_categories` (7), `task_categories` (`operational`, `traveller_follow_up`, `payment`), readiness templates **Domestic** and **International** as headers only; **template items empty** (EP-02 pending, TL-04). Helpers `workspace_config_has_code()`, `workspace_business_today()` (Asia/Kolkata). | Start preparation derives **zero** items in Phase 1 (finding 1) |
| User directory | `workspace_user_directory()` (id, display name, role, is_active; no email); TS `getActiveWorkspaceUsers()`. No consumer yet. | Owner names, assign/reassign picker (active users only), TL-01, TL-05 |
| Journey Workspace module | `lib/workspace/journey-workspace/`: `types.ts` (stages, transitions, holdable/cancellable stages), `validation.ts` (editable, transition, hold, cancel checks), `derivations.ts` (`deriveReadinessState`, `deriveNextAction`), `repository.ts` (`fetchJourneyById`, reference summaries only), `service.ts` (JP entry-point reads only). **`getAvailableJourneyActions` does not exist yet.** No list/summary repository functions. | Extended in WP-1.2 |
| API | One route: `GET /api/workspace/journey-workspace/reference-data` (active reference lists). JP routes unchanged pattern: `runtime = "nodejs"`, `authenticateWorkspaceApiRequest()`, `jsonResponse(…, no-store)`. | 16 new Phase 1 routes follow the same pattern (§8.2) |
| Pages | `(dashboard)/journey-workspace/page.tsx` renders `ComingSoon` | Replaced by JW-01 |
| Components | No Journey Workspace components. Shared: `Toast` (no live region, 6 s auto-dismiss), `EmptyState`, `ComingSoon`. JP: `ConfirmJourneyDialog` (owner shown as "You" or raw id). | New `components/workspace/journey-workspace/` |
| Auth | `getWorkspaceAuthState()`: `auth.getUser()` then `workspace_users` read; deactivated → `unauthorized`. Header display name comes from the auth profile, not `display_name` (TL-05). `fetchWorkspaceUserRole` unused (TD-WS13-003). | WP-1.9 |
| Itinerary data | `workspace_proposal_versions.itinerary_snapshot`: destinations with nights and notes (single destination per version in WS12) | JW-03 renders it read-only |

### 3.2 Differences from `WS13-004` that change Phase 1

| # | `WS13-004` said | Now | Effect on Phase 1 |
|---|---|---|---|
| RB-01 | P1 RPCs take an actor and an expected stage | AD-WS13-002 (ratified) says RPCs derive the actor from `auth.uid()`. Conversion v2 takes `p_actor_id` with a mismatch check; M11 follows the AD instead. | M11 signatures have no `p_actor_id` (§9.1). Confirmed by Archie (`020A` §2). |
| RB-02 | Start preparation = `…_assign_template` that "derives items" | Template items are empty until M05b (Phase 2) | Start preparation works; derives 0 items; readiness gate vacuous (ND-1) |
| RB-03 | Legacy Journeys "visible with marker and adoptable in P1" | Legacy rows are in the shared (Production) database; count unknown | Adoption QA is a production data change (ND-2) |
| RB-04 | Adoption panel fields: owner, dates, template, POC, Service Category | Nights may be null or disagree with entered dates; nights are immutable | Nights rule needed (ND-3) |
| RB-05 | Template proposal "from the destination's domestic/international classification where known" | No classification exists on Journeys or planning records (`destination_region` is free text) **[F]** | No pre-selection by default (ND-4) |
| RB-06 | `canViewTeamScope(role)` Administrator-only default | Conflicts with WS13-001 §15 (Workspace User may view the list) | Arjun recommends all users (UXO-08) |
| RB-07 | Cancel "with vendor-cancellation tasks" | No bookings can exist until Phase 2 | Built and DB-tested in P1; QA in Phase 2 regression (ND-5) |
| RB-08 | UXA-05 = adoption Service Category (`WS13-004` §9.3 numbering) | In UX Rev 4 §36, UXA-05 is *Version 1 proposal guidance*; adoption Service Category is part of §36.2 (UXA-02) and §16 | References in this plan use **UX section numbers**, not UXA numbers, to avoid confusion (also used in `WS13-019` §5) |
| RB-09 | Performance check only in P3/P5 (§10.5) | WS13-P1-J observed 5–10 s; region gap confirmed | Profiling moves to the start of Phase 1 (WP-1.0) |

---

## 4. Scope Matrix (B; card §5)

### 4.1 In scope — Phase 1

| # | Item | Product | UX | Architecture | WP |
|---|---|---|---|---|---|
| S-01 | M11 lifecycle RPCs (9) | FR-JW-08, -09, -10, -11, -31; BR-025, -026, -029, -030, -036, -041, -043 | §9.3 | AD-WS13-001, -002 | WP-1.1 |
| S-02 | JW-01 Active Journeys list: summary strip, search, filters and sort in the URL, owner scope, rows with next action, legacy marker | FR-JW-03, -29 (Active list part), -34; BR-035 | §7, §20 | AD-WS13-004 | WP-1.3 |
| S-03 | JW-02 Journey header: breadcrumb, title, meta line with Service Category chip, people cards, lifecycle stepper (+ compact form), primary action, More menu, status banners | FR-JW-01, -04, -14; BR-034, -040 | §8.1, §9.1, §9.2, §13, §36.2 | AD-WS13-001, -004 | WP-1.4 |
| S-04 | Overview (Phase 1 content): next step card, readiness state, recent activity, Journey facts rail | FR-JW-01 AC1, -32 (next action) | §8.2 (bounded, §4.2) | AD-WS13-004 | WP-1.4 |
| S-05 | JW-03 Itinerary: read-only accepted Proposal Version snapshot | FR-JW-06 | §8.3 | `DEC-R1.3-014` | WP-1.7 |
| S-06 | JW-08 History: pinned links, filter chips, before → after, paging 50, Phase 1 event labels (TL-08) | FR-JW-02, -30 | §21 | Audit log | WP-1.7 |
| S-07 | JW-12 lifecycle dialogs: Start preparation (template), Mark ready to travel, Step back, Place on hold, Resume, Mark travelling, Mark travel complete, Begin post-travel, Cancel, Mark as Completed; stale-page handling | FR-JW-08–11 | §9.3, §9.4 | AD-WS13-002 | WP-1.5 |
| S-08 | JW-15 POC editor | FR-JW-01 AC3, -06 AC5; BR-040 | §13 | AD-WS13-002 (RLS path) | WP-1.6 |
| S-09 | JW-17 assign / reassign; legacy adoption panel with required Service Category | FR-JW-03, -31; BR-026, -036, -043 | §16, §36.2 | AD-WS13-002, -007 | WP-1.6 |
| S-10 | Service Category display and edit (header pencil; read-only in rail; "Not yet classified" for legacy) | FR-JW-01 AC4/AC5; BR-043 | §36.2 | AD-WS13-006 | WP-1.6 |
| S-11 | Carry-forward items marked In (§11) | Register `RELEASE-1.3.md` §6 | — | — | WP-1.9 |
| S-12 | Performance baseline, target and re-measurement | WS13-P1-J; SC-11 | — | Archie if architectural | WP-1.0, WP-1.10 |

### 4.2 Bounded in Phase 1 (approved Phase 1 screens that reference later-phase data)

These are parts of Phase 1 screens whose data or actions belong to later phases. **Confirmed by Sophie** (`EBC-R1.3-WS13-020B` C-01…C-10; readiness display in its §3):

| Surface | Phase 1 treatment (confirmed) | Arrives |
|---|---|---|
| Tabs Vendor Bookings, Readiness, Documents, Tasks & Follow-ups, Activity & Changes | **Hidden.** Tab bar shows Overview · Itinerary · History only (`DEC-R1.3-025` Decision 2) | Phase 2 |
| Overview cards: Vendor Bookings summary, Documents summary, Tasks rail | Hidden (their links would point to absent tabs) | Phase 2 |
| Overview readiness summary | "Ready" chip with the caption "No checklist items yet" and an explanatory line; category rows hidden (Sophie `020B` §3, PO Decision 4) | Phase 2 |
| List row "n of m Booked" | Hidden | Phase 2 |
| Alert banner, list at-risk glyph, "Alerts" filter | Hidden (no alert display until WP-2.7) | Phase 2 |
| Next step "Log activity" button (Travelling) | Sentence only (activity logging is JW-09) | Phase 2 |
| More menu: Material change…, Archive | Hidden; Travelling note reads "Holding isn't available while travelling." (Sophie C-07) | Phase 4, Phase 3 |
| "Closed & Archived →" link (JW-11), outcome and Archived filters | Hidden; terminal Journeys reachable by direct link and History (ND-6) | Phase 3 |
| Status banners Superseded and Archived | Rendered if the data exists (cannot occur in Phase 1 through the product) | Phase 4 / Phase 3 data |
| Dashboard KPIs and panels | Unchanged (literal values, WS11) | Phase 3 |

### 4.3 Deferred (approved, not Phase 1)

| Item | Target | Basis |
|---|---|---|
| Vendor Bookings (JW-04, JW-16), Readiness tab (JW-05), Documents (JW-07), Tasks & Follow-ups (JW-06), Activity & Changes (JW-09) incl. Change Records, alert display | Phase 2 | `WS13-004` §4 P2; `DEC-R1.3-025` |
| RPCs `…_set_booking_status`, `…_record_change`, `…_change_template` (M12); template content M05b; vendor load | Phase 2 | TL-04, EP-02/EP-03 |
| Readiness "no bookings / no documents" rule (TL-09, WS13-P1-A, `OD-R1.3-6`) | Decision before Phase 2 | `RELEASE-1.3.md` §6 |
| Dashboard live data, JW-11 Closed & Archived, JW-14 Archive (no unarchive), alert reconciler, daily cron, IN-06 | Phase 3 | `WS13-004` §4 P3 |
| Condition alerts raise/resolve (TL-03), AL-16 deactivated-owner alert | Phase 3 | ED-05 |
| Header bell, NOT-01, global search (EP-05) | Phase 3 (optional) | `WS13-004` WP-3.6 |
| Material change and Replacement Journey (JW-13, M14) | Phase 4 | `WS13-004` §4 P4 |
| P0-REPL-01 replacement conversion QA (WS13-P1-F) | Phase 4 QA; no database-prepared data | `DEC-R1.3-025` Decision 3 |
| RLS hardening TD-WS12-004, -005 | Hardening card before Phase 3 | `TECH-DEBT.md` |
| TD-WS13-001 (deprecated `status`), TD-WS13-002 (fresh replay) | Release 1.4 (TD-WS13-002 before any new environment) | `TECH-DEBT.md` |
| TL-06 Workspace User Administration | **Out of Phase 1** — Product Owner Decision 2 (4-Oct-2026) | Not introduced during this implementation |
| JP non-owner gating (WS13-P1-H, JP part) | Recommended backlog unless Sophie specifies in time (§12) | Annex A.3 |

---

## 5. Engineering Strategy (A; card §6)

### 5.1 Approach

**Bottom-up with a measurement first:** database contract → service/API contract → shared UI primitives → screens → carry-forward fixes → validation. Each layer is verified before the next consumes it.

| Order | Step | Why this order |
|---|---|---|
| 1 | **Measure** current response times on Preview (WP-1.0) | DEC-R1.3-025 C-5; the card says measure first. A baseline taken after Phase 1 code lands cannot separate old and new cost. |
| 2 | **M11 + local database tests** (WP-1.1) | Every screen action depends on it. PL/pgSQL defects surface only at execution (R-ENG-JW-04, Release 1.2 precedent); a local PG 17 harness catches them before any shared-database change. |
| 3 | **Service and API** (WP-1.2) incl. `getAvailableJourneyActions` and the error-code map | One gating function and one message map serve every screen; API contract testable without UI. |
| 4 | **Primitives** (WP-1.8) | Stepper, badges, gated button, dialog, side panel and the Toast live region are used by three screens. |
| 5 | **Screens** (WP-1.3 → 1.4 → 1.5 → 1.6 → 1.7) | List first (entry point and navigation), then header/Overview (host for every action), then dialogs, ownership, read-only tabs. |
| 6 | **Carry-forward** (WP-1.9) | Small, touches JP and auth; done after Journey detail exists (TL-02 needs the route). |
| 7 | **Validation, deployment readiness, re-measure** (WP-1.10) | Engineering evidence for Tiger; runbook gate before M11 reaches the shared database. |

**Why not build screens against mocked RPCs in parallel?** One engineer; mocks would duplicate the transition rules a third time (SQL, `validation.ts`, mock) and hide execution-time SQL defects.

**Why one implementation EBC with two milestones, not two EBCs?** A QA cycle needs the screens (Phase 1 behaviour is verified through the product, `DEC-R1.3-022` (7)), so splitting into two EBCs adds a governance round without an extra QA cycle. Milestone A ends with an engineering checkpoint Tiger can review (M11 SQL, local test evidence, API contract) before Milestone B. **[Rec]** If Tiger prefers, Milestone A can be issued as its own EBC without changing this plan.

### 5.2 Integration points

| Point | Contract |
|---|---|
| Browser → API | JSON `{ ok: true, … }` / `{ ok: false, code, message, fieldErrors? }`, `Cache-Control: no-store`, `runtime = "nodejs"` (JP precedent) |
| API → database | Lifecycle and ownership: M11 RPCs. POC: RLS update + service audit. Reads: summary view, `workspace_journeys`, contacts, travellers/corporate contacts, proposal versions, audit log, directory RPC. |
| Journey Workspace ↔ Journey Planning | JP gains a link to the Journey (TL-02, WS13-P1-G); Journey Overview links to the planning record. No JP rule changes. |
| UI gating ↔ server rules | `getAvailableJourneyActions()` mirrors the RPC checks; the RPC remains the authority (defence in depth). Lockstep comments name each twin. |
| Shared database ↔ Production app | Production (`main`) has no Workspace code; M11 functions are inert there. |

---

## 6. Work Package Breakdown (D3)

Relative sizes XS < S < M < L. "Files" are the main ones; tests and labels follow each package.

| WP | Package | Main files / objects | Size | Depends on |
|---|---|---|---|---|
| **WP-1.0** | Performance baseline: measure create, claim, stage change, decision and page loads on the current Preview; confirm regions; record method and numbers (§13) | Report section; no code | S | Product Owner signs in (QA authentication procedure, `DEC-R1.3-022` (1)) |
| **WP-1.1** | **M11** `…_workspace_journey_lifecycle_rpcs.sql`: 9 functions + 1 internal helper (§9; Archie AC-2); local PG 17.6 test harness (Phase 0 approach, with the TD-WS13-002 workaround): success path and **every** error code per RPC, three identities plus a deactivated user | `supabase/migrations/2026MMDDHHMMSS_workspace_journey_lifecycle_rpcs.sql` | **L** | Archie `020A` (done); Archie SQL review at the Milestone A checkpoint (AC-9); runbook §2.10 before apply |
| **WP-1.2** | Service and API: `journey-workspace/{repository,service,validation,derivations,types}.ts` extended (list/detail/history/itinerary reads, RPC calls, error-code enum); `getAvailableJourneyActions()`; `canViewTeamScope()`; 16 new routes (§8.2); `journeyWorkspaceMessages.ts` | `lib/workspace/journey-workspace/*`, `app/api/workspace/journey-workspace/**`, `app/api/workspace/users/directory/route.ts` | M | WP-1.1 |
| **WP-1.3** | JW-01 list page: summary strip (toggle chips), search (debounced), filters and sort in `searchParams`, owner scope, group by stage (browser preference with safe fallback), row links, legacy marker, empty state | `app/workspace/(dashboard)/journey-workspace/page.tsx`, `components/workspace/journey-workspace/list/*` | M | WP-1.2, WP-1.8 |
| **WP-1.4** | JW-02 header (sticky; collapses after 120 px), people cards, stepper (+ compact below 1024 px), primary action, More menu, status banners; Overview (Phase 1 content, §4.2) | `app/workspace/(dashboard)/journey-workspace/[journeyId]/page.tsx`, `components/…/journey/*`, `tabs/OverviewTab.tsx` | **L** | WP-1.2, WP-1.8 |
| **WP-1.5** | JW-12 dialogs (config-driven `LifecycleDialog`), stale-page toast and header refresh, success toasts | `components/…/dialogs/*` | M | WP-1.4 |
| **WP-1.6** | JW-17 assign/reassign dialog and adoption panel; JW-15 POC editor (side panel); Service Category picker dialog | `components/…/dialogs/AssignDialog.tsx`, `AdoptionPanel.tsx`, `panels/ContactEditor.tsx`, `dialogs/ServiceCategoryDialog.tsx` | M | WP-1.4; PO Decision 5 (nights); PO Decision 7 (adoption QA) |
| **WP-1.7** | JW-03 Itinerary (read-only snapshot, empty state when no accepted version); JW-08 History (pinned links, filters, paging 50, before → after, final labels — TL-08) | `tabs/ItineraryTab.tsx`, `tabs/HistoryTab.tsx`, `journeyWorkspaceLabels.ts` | M | WP-1.2 |
| **WP-1.8** | Primitives: StageBadge, OverlayChip, LifecycleStepper, GatedButton (`aria-disabled` + reason), StatusBanner, Dialog (focus trap, Esc, return focus), SidePanel; Toast `role="status"` live region (TD-WS13-004) | `components/workspace/journey-workspace/*`, `components/workspace/shared/Toast.tsx` (+ shared only if reused) | M | — |
| **WP-1.9** | Carry-forward: TL-01 owner name in Confirm dialog; TL-02 replacement banner link; TL-05 header reads `display_name`; WS13-P1-G persistent Journey reference on the converted planning record; WS13-P1-I refusal wording; TD-WS13-003 remove unused helper; TD-WS13-005 sign out on refusal | `components/workspace/journey-planning/*`, `lib/workspace/shared/auth/*`, `app/workspace/sign-in/*` | S | WP-1.4; Sophie `020B` copy (S-2, S-3); WS13-P1-I wording on confirmation (§12.3) |
| **WP-1.10** | Engineering validation; regression; re-measure (SC-11); deployment pack for the runbook; QA handover pack | Engineering Completion Report | S | All |

**Overall relative size: M–L.** Larger than `WS13-004`'s "M" for P1 because Phase 1 now also carries the profiling work and about 14 carry-forward and debt items (§11).

---

## 7. Engineering Roadmap and Phase Breakdown (C; card §13)

| Engineering phase | Objectives | Deliverables | Dependencies | Exit criteria |
|---|---|---|---|---|
| **E0 Authorisation** | Revision 2 confirmed; implementation EBC issued | `DEC-R1.3-026` (Product Owner); implementation EBC (Tiger) | Product Owner review 4-Oct-2026 (done); Archie `020A` and Sophie `020B` (done) | Revision 2 confirmed, including the §12.3 defaults |
| **E1 Baseline** (WP-1.0) | Know today's cost before adding code | Baseline table (§13.3) with method | Product Owner sign-in on Preview | Numbers recorded for every §13.3 action; regions confirmed |
| **E2 Database** (WP-1.1) — Milestone A | M11 written and proven locally | M11 file; local test log (each RPC: success + every error code; RLS/grant checks) | Archie AC-1…AC-8; PO Decision 5 | All local tests pass; Archie code review of the SQL; **M11 not applied** |
| **E3 Service/API** (WP-1.2) — Milestone A | Stable contract for screens | Routes, service, gating function, message map; route-level contract checks | E2 | `tsc`, lint, verify scripts pass; **engineering checkpoint with Tiger** (Milestone A) |
| **— Gate G-1** | **Deployment runbook §2.10 approved** (C-6) | Runbook (Tiger draft, Rad technical steps) | — | Approved by the Product Owner **before M11 is applied** |
| **E4 M11 apply** | M11 on the shared database | Runbook execution record; parity 35 = 35 | G-1 | Dry-run shows exactly M11; parity recorded; existing Preview unaffected |
| **E5 Screens** (WP-1.8 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7) — Milestone B | Phase 1 UI | Pages and components | E3; Sophie `020B` (done) | Each screen walks its flows on the branch Preview (desktop, tablet; phone must not break) |
| **E6 Carry-forward** (WP-1.9) | Close Phase 1 register items | JP and auth touch-ups | E5; copy confirmations | WS12 and WS11 focused regression pass (engineering side) |
| **E7 Validation** (WP-1.10) | Engineering evidence | Completion report; live RPC contract checklist on Preview; re-measurement vs target; QA pack | E4–E6 | §14.1 checks pass; SC-11 measured; Rad does not self-approve |
| **— Gate G-2** | **QA playbook §2.11 approved** (C-6) | Playbook (Tiger, Keerthi) | — | Approved **before the Phase 1 QA handover** |
| **E8 QA handover** | Keerthi QA on Preview | Handover card (Tiger) | G-2 | — (QA, acceptance and closure follow the Phase 0 lifecycle) |

M11 may be applied before the Phase 1 screens are deployed: it adds functions only, and no deployed code calls them (§9.4). Applying at E4 lets Rad run the live contract checklist against the real database as soon as screens exist.

---

## 8. Technical Design Summary (D; D5; card §7)

### 8.1 Routes and pages

```
web/app/workspace/(dashboard)/journey-workspace/page.tsx                JW-01 (replaces ComingSoon)
web/app/workspace/(dashboard)/journey-workspace/[journeyId]/page.tsx    JW-02 + ?tab=overview|itinerary|history
web/components/workspace/journey-workspace/
   list/      JourneyListView, SummaryStrip, JourneyFilters, JourneyRow
   journey/   JourneyHeader, PeopleCards, LifecycleStepper, StatusBanner, JourneyTabs, MoreMenu
   tabs/      OverviewTab, ItineraryTab, HistoryTab
   dialogs/   LifecycleDialog (per action config), AssignDialog, AdoptionPanel, ServiceCategoryDialog
   panels/    ContactEditor
   journeyWorkspaceLabels.ts   (journey_closed → "Completed", UX-04/UX-08; event labels)
   journeyWorkspaceMessages.ts (error code → copy)
```

Page pattern as Journey Planning: the server component calls `requireWorkspaceUser()`; a client view loads data through the API. `searchParams` and `params` are Promises in Next.js 16 (read `node_modules/next/dist/docs/` route-handler and page guides before WP-1.3/1.4). Real links for rows (middle-click opens a new tab).

### 8.2 API routes (all under `app/api/workspace/`)

| Route | Method | Purpose | Calls |
|---|---|---|---|
| `journey-workspace` | GET | List: `scope`, `owner`, `stage[]`, `onHold`, `readiness`, `departure`, `q`, `sort`, `groupBy` | View + service joins (§8.3) |
| `journey-workspace/summary-counts` | GET | Summary strip counts for the current scope and search | View |
| `journey-workspace/[journeyId]` | GET | Detail: Journey, summary row, people (owner name, POC, party), available actions for the caller | Reads + `getAvailableJourneyActions` |
| `journey-workspace/[journeyId]/transition` | POST | `{ toStage, expectedStage, note? }` | `workspace_journey_transition` |
| `…/start-preparation` | POST | `{ templateId, expectedStage }` | `workspace_journey_assign_template` |
| `…/hold` · `…/resume` | POST | `{ expectedStage, reason }` / `{ expectedStage }` | `…_place_on_hold` / `…_resume` |
| `…/cancel` | POST | `{ expectedStage, reason, cancellationTaskBookingIds[] }` | `…_cancel` |
| `…/close` | POST | `{ expectedStage }` | `…_close` |
| `…/reassign` | POST | `{ newOwnerId, expectedOwnerId, note? }` | `…_reassign` |
| `…/service-category` | PATCH | `{ serviceCategory }` | `…_set_service_category` |
| `…/contact` | PATCH | `{ contactType, name, organisation?, phone?, email? }` | RLS update + audit (AD-WS13-002) |
| `…/adopt` | POST | Adoption panel fields | `…_adopt_legacy` |
| `…/history` | GET | `?filter=&before=` paged 50 | Audit log (`entity_type='journey'`) |
| `…/itinerary` | GET | Accepted Proposal Version snapshot | Proposal versions |
| `journey-workspace/reference-data` | GET | Exists; add readiness templates (code, name) and POC contact types | Settings |
| `users/directory` | GET | Active users for the picker; names for display | `workspace_user_directory()` |

No create route for Journeys (FR-JW-05). No DELETE anywhere (BR-033, FR-JW-31). Template choice uses `/start-preparation` rather than `/template` so the Phase 2 change-template route (`PUT …/template`) stays separate.

**Error mapping:** `400` validation (`reason_required`, `reason_too_long`, `note_too_long`, `contact_invalid`, `dates_required`, `dates_invalid`, `dates_nights_mismatch`, `service_category_required`/`_invalid`, `template_invalid`, `new_owner_invalid`, `booking_invalid`); `403` `not_authorised`; `404` `not_found`; `409` state (`stale`, `archived`, `terminal`, `legacy_pending`, `not_legacy`, `on_hold`, `already_on_hold`, `not_on_hold`, `transition_not_allowed`, `hold_not_allowed`, `cancel_not_allowed`, `close_not_allowed`, `readiness_incomplete`, `start_date_not_reached`, `end_date_not_reached`, `template_already_assigned`, `owner_unchanged`, `service_category_unchanged`, `replacement_open`). The service validates first and returns several field errors at once (PRA-01 precedent); the RPC repeats every check.

### 8.3 Read models

- **List:** `workspace_journey_operational_summary` filtered by scope/stage/hold/readiness/departure, then names joined in the service: party (travellers / corporate contacts), primary POC, owner display name (directory, one call per request). **Search** (`q`, after a short pause): matching Journey ids are collected from `journey_reference`, `destination_region`, traveller name/mobile, Corporate Point of Contact and POC name, then the view is filtered by id. No view change (M09 untouched). Suitable for internal scale (AD-WS11-001/005); revisit only with evidence (§13).
- **Detail:** one Journey row + its summary row + POC + party + directory names; `getAvailableJourneyActions(journey, summary, user, today)` returns, per action, `available | disabled(reason) | hidden`.
- **History:** audit entries for the Journey (index `(entity_type, entity_id, created_at desc)` exists), paged 50 with a `before` cursor; actor names from the directory; system actor shown as "Workspace (automatic)"; pinned: planning record link (and supersession link when present).
- **Itinerary:** `accepted_proposal_version_id` → `itinerary_snapshot`; empty state when null (some legacy rows).

### 8.4 Role-based behaviour (action matrix, Phase 1)

| Action | Owner (Workspace User) | Non-owner Workspace User | Administrator | Deactivated user | Archived / terminal Journey | Legacy (not adopted) |
|---|---|---|---|---|---|---|
| View list, Journey, Itinerary, History | ✅ | ✅ | ✅ | ❌ refused at sign-in | ✅ view | ✅ view |
| Owner scope "Team" / named owner | ✅ (PO Decision 3) | ✅ (PO Decision 3) | ✅ | — | — | — |
| Lifecycle actions (start preparation, advance, step back, hold, resume, cancel, complete) | ✅ | ❌ hidden + owner line (UX §9.3) | ✅ | ❌ | ❌ hidden | ❌ hidden ("Awaiting adoption") |
| Assign own Journey | ✅ | ❌ | ✅ (reassign any) | ❌ | ❌ | ❌ (adoption sets owner) |
| Service Category edit | ✅ | ❌ | ✅ | ❌ | ❌ **[Def]** (ND-8) | ❌ (set at adoption) |
| POC edit | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ (set at adoption) |
| Adopt legacy Journey | ❌ | ❌ | ✅ | ❌ | — | ✅ Administrator |

Every cell is enforced in the RPC or RLS; the UI only hides or disables.

---

## 9. Migration M11 Specification and Data Strategy (D4; card §7–§8)

### 9.1 Conventions (all nine functions)

- File: `supabase/migrations/2026MMDDHHMMSS_workspace_journey_lifecycle_rpcs.sql`, header naming the EBC, AD-WS13-001/002, and the BR/FR each function implements (existing convention).
- `language plpgsql security definer set search_path = public`; `revoke all … from public, anon; grant execute … to authenticated`.
- **Actor = `auth.uid()`** (AD-WS13-002 step 1). No `p_actor_id` parameter (RB-01).
- Errors: `raise exception '<code>'`; errcode `42501` for `workspace_journey_not_authorised`, `P0002` for `workspace_journey_not_found`, `P0001` otherwise. Codes are prefixed `workspace_journey_`.
- Variables `v_`, parameters `p_`; no `RETURNS TABLE` column names that shadow table columns (Release 1.2 ambiguous-column precedent, R-ENG-JW-04).
- Each function returns the Journey id; the application re-reads the detail.
- One transaction per call: state change, audit entry and notification together (AD-WS13-002 step 4).
- Lockstep comments name the TypeScript twin (`types.ts` transition tables, `validation.ts` checks).
- **Revision 2 (Archie `020A`):** every object in function bodies is `public.`-qualified (AC-1). One internal helper, `workspace_journey_derive_template_items(p_journey_id uuid, p_template_id uuid, p_actor_id uuid) returns integer`, `security definer`, with execute **revoked** from `public`, `anon` and `authenticated`, is used by functions 7 and 9 (AC-2). No informational notification is sent to a deactivated recipient (AC-6).

**Common guard order** (G1–G7, before function-specific checks):

| # | Check | Error |
|---|---|---|
| G1 | Caller is a Workspace User and `deactivated_at is null` | `workspace_journey_not_authorised` (42501) |
| G2 | Journey exists; row locked `for update` | `workspace_journey_not_found` (P0002) |
| G3 | `archived_at is null` (POD-08) | `workspace_journey_archived` |
| G4 | Not terminal (`stage <> 'journey_closed' and outcome is null`) | `workspace_journey_terminal` |
| G5 | `adoption_status = 'adopted'` (all except adopt) | `workspace_journey_legacy_pending` |
| G6 | Caller is owner or Administrator (adopt: Administrator only) | `workspace_journey_not_authorised` (42501) |
| G7 | Staleness: `p_expected_stage = stage` (lifecycle functions) or `p_expected_owner_id = owner_id` (reassign) | `workspace_journey_stale` |

### 9.2 Function specifications

| # | Function and signature | Specific checks (after G1–G7) | Writes | Audit | Notification |
|---|---|---|---|---|---|
| 1 | `workspace_journey_transition(p_journey_id uuid, p_expected_stage text, p_to_stage text, p_note text default null)` | not `on_hold` → `on_hold`; pair ∈ {in_preparation→ready_to_travel, ready_to_travel→travelling, ready_to_travel→in_preparation, travelling→travel_complete, travel_complete→post_travel} → else `transition_not_allowed` (confirmed→in_preparation is fn 7; post_travel→journey_closed is fn 5); → ready_to_travel: template assigned and view `readiness_mandatory_unresolved = 0` → `readiness_incomplete` (BR-028; read from the summary view, no duplicate expression, AC-3; **PO Decision 4: with empty templates this never blocks in Phase 1, and no bypass flag is added, so Phase 2 needs no change**); → travelling: `confirmed_start_date <= workspace_business_today()` → `start_date_not_reached`; → travel_complete: `confirmed_end_date <= today` → `end_date_not_reached` (FR-JW-09); note ≤ 1000 → `note_too_long` | `stage`, `stage_changed_at`, `updated_by` | `journey_stage_changed` {from, to, note}; for ready_to_travel→in_preparation `journey_stage_stepped_back` {from, to, note} | none (FR-JW-27 lists none) |
| 2 | `workspace_journey_place_on_hold(p_journey_id, p_expected_stage, p_reason text)` | not already on hold → `already_on_hold`; stage ∈ holdable → `hold_not_allowed` (BR-029); reason non-blank → `reason_required`, ≤ 500 → `reason_too_long` | `on_hold`, `on_hold_reason`, `on_hold_since = now()`, `updated_by` | `journey_on_hold` {stage, reason} | IN-03 `journey_on_hold` to the owner when the caller is not the owner (WS13-001 §16) |
| 3 | `workspace_journey_resume(p_journey_id, p_expected_stage)` | on hold → else `not_on_hold`; no open replacement planning record (`replaces_journey_id = id and stage <> 'closed'`) → `replacement_open` (protects the Phase 4 flow; unreachable in Phase 1; not in Phase 1 QA, PO Decision 6) | clear the three hold columns, `updated_by` | `journey_resumed` {stage, held_since, reason} | IN-03 `journey_resumed` (as fn 2) |
| 4 | `workspace_journey_cancel(p_journey_id, p_expected_stage, p_reason text, p_cancellation_task_booking_ids uuid[] default '{}')` | stage ∈ cancellable → `cancel_not_allowed` (BR-030; On Hold allowed); reason as fn 2; each id is a non-cancelled booking of this Journey → `booking_invalid`; no open replacement → `replacement_open` | `outcome = 'cancelled'`, `outcome_reason`, clear hold columns (M07 CHECK: no hold with an outcome), `updated_by`; one `workspace_tasks` row per selected booking: entity `journey`, title "Cancel vendor booking: <vendor> · <service type>", category `operational`, kind `task`, assignee = owner, or the caller when the owner is deactivated (Archie AR-F6; Arjun confirms before Phase 2), creator = caller (FR-JW-11 AC2). **Not in Phase 1 QA** (PO Decision 6) | `journey_cancelled` {stage, reason, was_on_hold, cancellation_tasks}; `task_created` per task | IN-04 `journey_cancelled` to the owner when the caller is not the owner (WS13-001 §16; FR-JW-27) |
| 5 | `workspace_journey_close(p_journey_id, p_expected_stage)` | stage = post_travel → `close_not_allowed` | `stage = 'journey_closed'`, `stage_changed_at`, `closed_at = now()` (AD-WS13-001: set on entering journey_closed only), `updated_by` | `journey_closed` {from: post_travel, open_tasks} | IN-04 `journey_closed` to the owner when the caller is not the owner (WS13-001 §16) |
| 6 | `workspace_journey_reassign(p_journey_id, p_expected_owner_id, p_new_owner_id, p_note text default null)` | new owner is an active Workspace User → `new_owner_invalid`; differs from current → `owner_unchanged`; note ≤ 1000. Allowed while On Hold (FR-JW-31: any time before terminal) | `owner_id`, `updated_by` | `journey_reassigned` {from, to, note} | IN-02 `journey_assigned` to the new owner unless the new owner is the caller |
| 7 | `workspace_journey_assign_template(p_journey_id, p_expected_stage, p_template_id uuid)` — **Start preparation** | stage = confirmed (G7); not on hold → `on_hold`; template exists and active → `template_invalid`; if a template is already assigned and differs → `template_already_assigned` (changing a template is Phase 2 `…_change_template`) | if no template yet: `readiness_template_id`, then the internal helper (AC-2) inserts one readiness item per **active** template item (`source='template'`, category, label, requirement, `allows_not_applicable`, `item_kind`, `system_rule`, `created_by` = caller) — **0 items in Phase 1** (TL-04); then `stage = 'in_preparation'`, `stage_changed_at` (BR-041 gate satisfied in the same transaction) | `journey_template_assigned` {template_code, items_created} (when newly assigned); `journey_stage_changed` {confirmed → in_preparation} | none |
| 8 | `workspace_journey_set_service_category(p_journey_id, p_service_category text)` | `workspace_config_has_code('service_categories', code, true)` → `service_category_invalid`; differs → `service_category_unchanged`. Allowed while On Hold | `service_category`, `updated_by` | `journey_service_category_changed` {from, to} (FR-JW-30) | none |
| 9 | `workspace_journey_adopt_legacy(p_journey_id, p_owner_id, p_confirmed_start_date, p_confirmed_end_date, p_service_category, p_readiness_template_id, p_contact_type, p_contact_name, p_contact_organisation, p_contact_phone, p_contact_email)` | G1–G4; `adoption_status = 'legacy_pending'` → `not_legacy`; caller Administrator → `not_authorised`; owner active → `new_owner_invalid`; dates present → `dates_required`, end ≥ start → `dates_invalid`; **nights rule (PO Decision 5):** if `nights` is set, `end − start = nights` → `dates_nights_mismatch`; if `nights` is null, set `nights = end − start` and record `nights_source = 'derived_from_dates'`; Service Category required/valid → `service_category_required`/`_invalid` (BR-036, BR-043; no pre-selection); template active → `template_invalid`; POC: type ∈ 4 values, name, organisation for corporate/B2B, phone or email → `contact_invalid` (BR-040) | owner, both dates, nights (if derived), Service Category, template + items (helper, AC-2), `adoption_status = 'adopted'`, stage stays `confirmed`, `updated_by`; POC row updated, or inserted if none exists | `journey_legacy_adopted` {owner_id, dates, service_category, template_code, nights_source, nights, items_created} (PO Decision 5; AC-4); `journey_contact_changed` when the POC changed | IN-02 to the owner unless the owner is the caller |

**POC editor (not an M11 function — AD-WS13-002 "edit POC" uses RLS):** the service validates (type, name, organisation rule, phone or email), updates the primary contact through the session client (`workspace_can_edit_journey()` policy enforces owner/Administrator, adopted, not terminal, not archived), then writes `journey_contact_changed` {before: {type, name, organisation}, after: {…}, phone_changed, email_changed}. **Phone and email values are not written to audit** (Archie AC-5; the same applies to the contact update inside adoption). The two writes are not atomic — the trade-off AD-WS13-002 accepted for single-row child writes. If the audit insert fails, the service logs a server error naming the Journey; the change itself stands.

### 9.3 Data strategy

| Question | Answer |
|---|---|
| Existing schema sufficient? | **Yes.** M07–M09 already model every Phase 1 state. |
| New tables, columns, constraints, indexes or views in M11? | **None.** M11 = 9 functions + 1 internal helper + grants. Audit event types already exist (M02). **No unnecessary schema change.** |
| Indexes | Existing: `workspace_journeys (owner_id)`, `(stage, archived_at)`, `(confirmed_start_date)`; audit `(entity_type, entity_id, created_at desc)`. None added without profiling evidence (§13). |
| Corrective view change for TL-09 | Not in Phase 1. It follows `OD-R1.3-6` (Phase 2). PO Decision 4 keeps BR-028 as written in Phase 1. |
| QA data | Created **through the product only**: QA planning records named `QA-WS13-P1-<scenario>` converted to Journeys. No database-prepared data (`DEC-R1.3-025` Decision 3 principle). Removed at release readiness (WS13-P1-K practice). |

### 9.4 Compatibility and rollback

| Aspect | Statement |
|---|---|
| Backward compatibility | Additive functions only. No existing function, table, policy or grant changes. Current Preview code (`84c8904` app code) and Production (`main`, no Workspace code) never call them. **No deployment coupling and no freeze needed for M11 itself** (unlike M07/M10). |
| Apply order | M11 applied through the approved runbook (G-1) before the Phase 1 application is deployed. Parity 35 = 35. |
| Engineering rollback | Forward-fix migration dropping the nine functions and the internal helper (AC-7) (prepared in the implementation report, not applied unless needed) + redeploy the previous Preview build. No data rollback: rows written by M11 satisfy the M07 constraints and stay valid. |
| Data correction | A defect that writes a wrong state is corrected by a reviewed, audited forward-fix data script approved by the Product Owner. Never by deleting audit history. |
| Archie review | **Done** — `EBC-R1.3-WS13-020A`, approved with conditions AC-1…AC-9, all incorporated. The M11 SQL and the local test evidence are reviewed again at the Milestone A checkpoint, before M11 is applied (AC-9). |

---

## 10. Security Review (card §10)

| Topic | Phase 1 design | Status |
|---|---|---|
| Role enforcement | Every lifecycle, ownership, classification and adoption change is a self-authorising RPC (G1, G6); POC through RLS `workspace_can_edit_journey()`. UI gating is convenience only. | ✅ by design |
| API protection | Every route calls `authenticateWorkspaceApiRequest()` (deactivated → 403); `no-store`; no service-role key anywhere in Phase 1. | ✅ |
| Ownership rules | Owner or Administrator; owner may assign own Journey, Administrator any; reassign only to active users; blocked after terminal (G4) and on archived (G3). | ✅ BR-026, FR-JW-31 |
| Administrator behaviour | Administrator may act on any Journey and alone may adopt legacy Journeys. Archive is Phase 3. | ✅ |
| Audit history | Same-transaction audit for every RPC; service-written for POC. Actor always the caller (audit insert policy `actor_id = auth.uid()`). Audit is append-only. | ✅ (POC non-atomic, accepted by AD-WS13-002) |
| Deactivated users | Refused at every page and API (Phase 0). Phase 1 adds: excluded from pickers; RPC rejects them as new owners; session signed out on refusal (TD-WS13-005). | ✅ with OD-R1.3-7 defaults |
| Personal data | POC phone/email shown to Workspace Users (UX §13); not written to audit (Archie AC-5); no personal data in logs (`console.error` messages carry operation names only, existing practice). | ✅ (Archie `020A`) |
| Optimistic concurrency | `p_expected_stage` / `p_expected_owner_id` prevent acting on a stale page. | ✅ |
| Direct table writes | `workspace_journeys` keeps no UPDATE grant; verified again by local tests (direct update rejected). | ✅ |

**Revision 2 — Archie AR-F1 (pre-existing).** `workspace_current_user_role()` ignores `deactivated_at`, so database read policies (and the permissive WS12 UPDATE policies) still admit a deactivated user who holds a valid session. The application refuses such users, and every Journey write checks deactivation in the database. Phase 1 signs the session out on refusal (TD-WS13-005). Archie recommends **TD-WS13-006** on the RLS hardening card before Phase 3, rather than changing the function in M11 (ND-12, §12.3).

**Engineering risks and pre-existing observations (not changed by Phase 1):**

- `workspace_audit_log` and `workspace_tasks` SELECT policies are `using (true)` for any authenticated session, not only provisioned staff **[F]**. Only Workspace staff hold Supabase Auth accounts today, so exposure is theoretical. Logged as observation OBS-P1-04 for the hardening card with TD-WS12-004/005.
- `workspace_notifications` INSERT `with check (true)` (TD-WS12-005) — Phase 1 RPCs insert as definer; the permissive policy is unchanged.
- Permissive JP UPDATE policies (TD-WS12-004) — untouched; hardening card before Phase 3.

---

## 11. Carry-forward and Technical Debt Disposition (D6; C-3)

| Item | Disposition | WP / target | Reason |
|---|---|---|---|
| TL-01 Owner shown as "You" or raw id in Confirm dialog | **In** | WP-1.9 | Directory exists; one-line wiring |
| TL-02 Replacement Journey reference as text | **In** | WP-1.9 | Journey detail route arrives in WP-1.4 |
| TL-03 Condition alerts raise/resolve | Deferred | Phase 3 | Alerts are Phase 3 (ED-05) |
| TL-04 Reference content (EP-02, EP-03) | Deferred | Phase 2 | Content not supplied; drives ND-1 |
| TL-05 Header does not read `display_name` | **In** | WP-1.9 | Same auth read (`select *`) already returns it |
| TL-06 User administration screen | **Out of Phase 1** | — | Product Owner Decision 2 (4-Oct-2026): not introduced during this implementation |
| TL-07 Legacy Journeys not adoptable | **In** | WP-1.1, WP-1.6 | JW-17; nights per PO Decision 5; functional QA per PO Decision 7 (§14.7) |
| TL-08 Interim History labels | **In** | WP-1.7 | Journey History screen |
| TL-09 / WS13-P1-A readiness rule | Deferred | Decision before Phase 2 | `OD-R1.3-6`; linked to ND-1 |
| WS13-P1-B Deactivated-user behaviour (`OD-R1.3-7`) | **In** (defaults) | WP-1.2, WP-1.6 | Annex A.2 |
| WS13-P1-C Copy confirmations (ED-02, ED-03) | **In** | WP-1.9 | Sophie `020B` S-2: shipped ED-02 text confirmed (the register records different text; Tiger corrects it); ED-03 toast gains "Open Journey" (C-11) |
| WS13-P1-D QA identities | Closed | — | Closed 1-Oct-2026 |
| WS13-P1-E `_to_delete/` | Product Owner | When convenient | Housekeeping |
| WS13-P1-F P0-REPL-01 | Deferred | Phase 4 QA | `DEC-R1.3-025` Decision 3 |
| WS13-P1-G Toast hides the JRN reference after 6 s | **In** | WP-1.9 (+ TD-WS13-004 in WP-1.8) | Sophie `020B` S-3: toast with an "Open Journey" action that does not auto-dismiss (C-11); permanent "Converted to Journey JRN-#### →" line on the closed planning record (C-12) |
| WS13-P1-H Non-owner sees actions | **In** for Journey screens (UX §9.3); JP part backlog (default, §12.3) | WP-1.4/1.5 | Annex A.3 |
| WS13-P1-I Refusal wording | **In** (decision) | WP-1.9 | Annex A.4 |
| WS13-P1-J Response times | **In** | WP-1.0, WP-1.10 | §13 |
| WS13-P1-K QA data removal | Release readiness | — | `DEC-R1.3-022` (5) |
| TD-WS13-001 Deprecated `status` | Deferred | Release 1.4 | Cleanup, no behaviour impact |
| TD-WS13-002 Fresh replay collision | Deferred | Before any new environment / Release 1.4 | Local tests keep the Phase 0 workaround |
| **TD-WS13-003** Unused `fetchWorkspaceUserRole` | **In** | WP-1.9 | Touching auth helpers for TL-05 |
| **TD-WS13-004** Toast not announced | **In** | WP-1.8 | Shared Toast gains `role="status"` |
| **TD-WS13-005** Session kept after refusal | **In** | WP-1.9 | With WS13-P1-I |
| TD-WS12-004 / -005 Permissive RLS | Deferred | Hardening card before Phase 3 | `TECH-DEBT.md` |

---

## 12. Decision Record and Remaining Confirmations (D7; C-4) — Revision 2

Revision 1 scheduled the open decisions with defaults. This section records their outcome. The Revision 1 schedule is superseded; its analyses remain in Annex A and in `020A`/`020B`.

### 12.1 Product Owner decisions, 4 October 2026 (to be logged by Tiger)

| # | Decision | Rev 1 item | How Revision 2 applies it |
|---|---|---|---|
| 1 | Two engineering milestones approved; keep them separate | ND-10 | **Milestone A:** profiling baseline, M11 and local database tests, service/API layer, engineering validation of that layer, Tiger checkpoint, Archie SQL review. **Milestone B:** primitives, Journey Core screens, carry-forward fixes, integration and end-to-end engineering verification on Preview (§5.1, §7). |
| 2 | User Administration screen out of Phase 1 | ND-11, TL-06 | Not introduced (§4.3, §11). |
| 3 | All authorised Workspace Users may view the team's Journey list; ownership governs editing, workflow actions and operational changes | UXO-08 | `canViewTeamScope()` true for every active Workspace User; RPC and RLS ownership checks unchanged (§8.4); Sophie C-10. |
| 4 | Readiness workflow exposed but not enforced in Phase 1; documented for QA | ND-1 | The BR-028 gate is built in function 1 and evaluates the assigned template. With no template items it never blocks, so Phase 1 does not enforce readiness. **No bypass flag is added**, so Phase 2 content switches the check on with no code change. Display: Sophie `020B` §3. QA: §14.7. *If the Product Owner intended the gate code to be withheld until Phase 2, Tiger raises it at confirmation.* |
| 5 | Missing nights derived from the Administrator's dates, recorded in History | ND-3 | Function 9 sets nights from the dates when not stored and records `nights_source` and the value (AC-4); stored nights must match the dates; Sophie C-14 and History label. |
| 6 | Vendor-cancellation (Phase 2) and Replacement (Phase 4) scenarios outside Phase 1 QA; supporting code may be prepared | ND-5 | Supporting code is built and covered by local database tests only (cancel-task parameter; `replacement_open` guards). They are listed in the QA handover as **not in Phase 1 scope**, not as "Passed (by reference)". |
| 7 | No genuine operational records modified while Preview and Production share a database; dedicated test records; otherwise defer | ND-2 | Every Phase 1 QA scenario uses `QA-WS13-P1-*` records created through the product. Legacy adoption: §14.7. |
| 8 | Measure first, optimise second; latency is an investigation; region changes are a separate architecture decision | ND-9 (strategy) | §13 unchanged. Targets T-1…T-5 stay proposed and are confirmed with the Product Owner after the E1 baseline. |

### 12.2 Review outcomes

| Review | Outcome | Incorporated |
|---|---|---|
| Archie — `EBC-R1.3-WS13-020A` | **Approved with conditions** AC-1…AC-9. No architecture decision changed; no schema change. | AC-1/2/6 §9.1; AC-3/4 §9.2; AC-5 POC (§9.2); AC-7 §9.4; AC-8 §10, §12.3; AC-9 §7, §9.4 |
| Sophie — `EBC-R1.3-WS13-020B` | **Confirmed** S-1…S-6 with C-01…C-14 and the Phase 1 readiness display | §4.2, §8, §11, §14.7; copy and History labels are implemented from `020B` directly |

### 12.3 Items for confirmation with Revision 2 (the default applies unless the Product Owner changes it)

| ID | Item | Default applied in Revision 2 | Source |
|---|---|---|---|
| `OD-R1.3-7` | Deactivated-user behaviour | Option A: owner kept; "Account deactivated" on the owner card; Administrators reassign; pickers active-only; AL-16 with Phase 3 alerts | Annex A.2; Sophie C-13 |
| WS13-P1-H | Non-owner gating on Journey Planning screens | Journey screens per UX §9.3; JP unchanged; backlog BP-P1-02 | Annex A.3 |
| WS13-P1-I | Refusal wording | One neutral message: "You don't have access to the SMV Workspace. If you think this is a mistake, please contact an Administrator." + session sign-out | Annex A.4; `020B` §4 |
| ND-6 | Terminal Journeys before JW-11 (Phase 3) | Reached by direct link, notification or planning record in Phase 1 | `020B` S-1 |
| ND-7 | IN-03/IN-04 recipients | Owner only when the caller is not the owner (WS13-001 §16 detail rows) | §9.2 |
| ND-8 | Service Category change on a terminal Journey | Not allowed (follows `workspace_can_edit_journey`) | §9.2 fn 8 |
| ND-12 | Deactivation not enforced in RLS read policies (pre-existing) | TD-WS13-006 on the RLS hardening card before Phase 3; not in M11 | Archie AR-F1 |
| AR-F6 | Cancellation-task assignee when the owner is deactivated | Caller instead of the deactivated owner; Arjun confirms before Phase 2 (not Phase 1 QA) | Archie AR-F6 |

### 12.4 Governance follow-ups for Tiger (not engineering work)

- Record the Product Owner decisions and the Revision 2 confirmation as `DEC-R1.3-026` (`RELEASE-1.3.md` §7).
- Log **TD-WS13-006** in `TECH-DEBT.md` and route it to the RLS hardening card (AC-8), subject to ND-12.
- Carry-forward register: correct the ED-02 text (Sophie S-2); TL-06 out of Phase 1; record the legacy-adoption QA condition (Decision 7).
- Note against `WS13-019` §12 that Ready to Travel is reachable in Phase 1 (OBS-P1-01; now governed by Decision 4).
- Deployment runbook §2.10 (gate G-1) and QA playbook §2.11 (gate G-2).

---

## 13. Performance Plan (F; D8; C-5; SC-11)

### 13.1 Facts already established

| Fact | Source |
|---|---|
| Vercel functions run in **`iad1`** (Washington DC, US East) | Vercel API, deployment `dpl_Grrz9zh6vneHF8popqG313Lh5G4c` **[F]** |
| Supabase project runs in **ap-northeast-2 (Seoul)** | Linked project pooler host **[F]** |
| Business users and the Product Owner are in India (business time zone Asia/Kolkata) | `DEC-R1.3-020` **[B]** |
| A Journey Planning mutation today is about **six sequential network calls** from the function to Supabase: `auth.getUser()` → `workspace_users` read → record read → update → audit insert → record re-read (plus a notification insert on reassign) | `lib/workspace/shared/auth/service.ts`, `journey-planning/service.ts` **[F]** |
| The client then re-fetches detail and history, each repeating the two auth calls | JP detail view pattern **[F]** |
| `proxy.ts` refreshes the session only for `/workspace/*` pages, not for API routes | `web/proxy.ts` matcher **[F]** |
| Vercel runtime-log queries for the last 7 days timed out within the tool's budget; no per-request durations were retrieved this session | Vercel API **[F]** |

### 13.2 Expected bottlenecks **[H]** — to be measured, not assumed

| # | Hypothesis | Why plausible | How it shows in measurement |
|---|---|---|---|
| H1 | **Distance × sequential calls.** Each function→database call crosses US East ↔ Seoul. Published round-trip times for that path are typically around 150–200 ms, so six sequential calls cost about 1 s of pure network before any query runs. | §13.1 | Server duration ≫ sum of query execution times |
| H2 | **Browser ↔ function distance.** India ↔ US East adds a further long round trip per request, several per action (mutation + re-fetches). | §13.1 | Browser "waiting" time ≫ server duration |
| H3 | **Cold starts** on Preview functions (low traffic). | Preview is rarely used | First request after idle much slower than the next |
| H4 | **Client waterfall.** Mutation, then detail, then history, sequentially. | JP view pattern | Network panel shows serial requests |
| H5 | **Query cost** (view aggregation, missing index) | Unlikely at current volume | `explain analyze` > 50 ms |

### 13.3 Baseline measurement (WP-1.0, before any Phase 1 code)

| # | Action (Preview, current build) | Measure |
|---|---|---|
| B-1 | Sign-in page → Dashboard | Browser total |
| B-2 | Open Journey Planning queue | Browser total; API waiting |
| B-3 | Create planning record (`QA-WS13-P1-Perf-01`) | Click → confirmation; API server time |
| B-4 | Claim | as B-3 |
| B-5 | Advance stage | as B-3 |
| B-6 | `GET /api/workspace/journey-workspace/reference-data` (auth + 1 query) | Isolates the fixed cost of "authenticate + one query" |
| B-7 | Same request repeated 5× immediately (warm) vs first after 15 min idle (cold) | Cold-start share (H3) |
| B-8 | `explain analyze select * from workspace_journey_operational_summary` (Product Owner, SQL editor, read-only) | Query cost (H5) |

**Method.** The Product Owner signs in (QA authentication procedure); Rad reads timings through the browser developer tools (Network: waiting/TTFB and total) and Vercel function durations where the dashboard or API exposes them. Each action is measured 5 times warm plus once cold; the median and worst are recorded. No instrumentation code is added in WP-1.0. QA records created for timing carry the `QA-WS13-P1-Perf-` prefix.

### 13.4 Proposed target (PO Decision 8: measure first; targets confirmed with the Product Owner after the E1 baseline)

| # | Target (Preview, warm, measured from India) | Proposed |
|---|---|---|
| T-1 | Phase 1 lifecycle action: click → confirmation toast | median ≤ 2.5 s |
| T-2 | Active Journeys list: navigation → rows visible | median ≤ 3 s |
| T-3 | Journey detail: navigation → header visible | median ≤ 3 s |
| T-4 | Database query time for list and detail reads | ≤ 300 ms each (`WS13-004` §10.5) |
| T-5 | Cold-start penalty | Reported separately, not targeted |

If the baseline shows that T-1 to T-3 are unreachable while the function and database sit on different continents, that is reported to Archie and the Product Owner as an architecture proposal (A-3). It is not changed inside Phase 1.

### 13.5 Optimisation approach (inside approved architecture only, applied only where measurement shows the cost)

1. **Fewer sequential calls per action** — Phase 1 RPCs already replace read–update–audit–re-read with one call; the route returns what the screen needs instead of forcing re-fetches.
2. **Parallel reads** — independent reads in a route run with `Promise.all` (directory, summary row, POC).
3. **Avoid the second `auth.getUser()` per request** only if Next.js 16 / `@supabase/ssr` guidance allows it safely (read the docs first; no security trade-off without Archie).
4. **Client:** no automatic re-fetch of History after a header action; History loads when its tab is opened.
5. **Indexes** only with `explain analyze` evidence.

**Out of Phase 1 scope (proposals only):** changing the Vercel function region (e.g. to Seoul `icn1`), moving the Supabase project, caching layers, edge runtimes. Each is an architecture and Product Owner decision.

### 13.6 Re-measurement (WP-1.10)

Repeat B-1…B-8 plus the Phase 1 actions (start preparation, hold, resume, reassign, list, detail) on the Phase 1 Preview; report against T-1…T-5 (SC-11).

---

## 14. Testing Strategy (G; D9; card §11)

### 14.1 Engineering validation (every WP, before hand-over)

`npm run lint` (0 errors); `tsc --noEmit`; `verify:journey-workspace-*`; Vercel Preview build READY (authoritative); `git diff` review for secrets, unrelated changes and generated files; migration header and naming check. Results reported exactly, never claimed without running (Project Instructions §28).

### 14.2 Unit-level verification (existing `verify:*` style; no new framework)

| Script | Phase 1 additions |
|---|---|
| `verify:journey-workspace-transitions` | Phase 1 dispatch (which pairs go through fn 1, fn 5, fn 7); hold/resume/cancel/close eligibility; template-already-assigned; adoption eligibility |
| `verify:journey-workspace-derivations` | `getAvailableJourneyActions()` for owner / non-owner / Administrator × every stage × hold × terminal × archived × legacy (UX §9.3 matrix, including disabled reasons and dates); next-step mapping incl. Phase 1 bounded copy |
| `verify:journey-workspace-dates` | Start/end-date gates around IST midnight (18:30 UTC); adoption nights derivation |
| `verify:journey-workspace-errors` (new) | Every M11 error code has an HTTP status and a message; no code unmapped |
| `verify:journey-workspace-list` (new) | URL ⇄ filter state round-trip; summary-strip count equals filtered list size (FR-JW-34 AC1) on fixtures |

A unit-test framework (e.g. Vitest) is **not** proposed: new dependency, Archie + Product Owner approval (TD-R1.3-002 remains the place to decide).

### 14.3 Database verification (local, before M11 is applied)

Local PostgreSQL 17.6 (same major as Supabase), Phase 0 approach: 34 migrations with the TD-WS13-002 workaround → fixture (Administrator, two Workspace Users, a deactivated user, adopted Journeys in every stage, a held Journey, a terminal Journey, an archived Journey, a legacy Journey with null nights, a legacy Journey with nights set, a Journey with bookings for cancel tasks) → M11 → tests:

- each function: success path and **every** error code (G1–G7 and specific), asserting the row, audit entry and notification;
- direct `update workspace_journeys` as `authenticated` rejected;
- POC RLS: owner/Administrator allowed; non-owner, terminal, archived, legacy rejected;
- concurrency: stale `p_expected_stage` rejected;
- M07 CHECKs never violated (cancel from hold clears hold; close sets `closed_at`);
- rollback script drops the nine functions cleanly.

### 14.4 Integration verification on Preview (after M11 is applied; Rad, before QA)

**Live RPC contract checklist** through the API with QA identities (Administrator, owner, non-owner; the deactivated identity for refusal): each route's success path and each error reachable through the product. Flows UF/IF for Phase 1: list → Journey → start preparation → ready → travelling (date permitting) → travel complete → post travel → completed; hold/resume; cancel from hold; step back; reassign; Service Category change; POC edit; History shows every event with before → after. Desktop and tablet widths; phone must not break; keyboard and focus checks on dialogs.

Date-gated steps (travelling, travel complete) are reachable only with QA Journeys whose confirmed dates are today or past; the QA scenario list includes conversions dated accordingly (no database preparation).

### 14.5 Regression

| Pack | Scope | Why |
|---|---|---|
| WS12 Journey Planning (focused) | Conversion (happy path and each block), Confirm dialog owner name (TL-01), replacement banner link (TL-02), converted-record reference (WS13-P1-G), Trip Basics, stage, claim, reassign, history | WP-1.9 touches JP |
| WS11 Foundation | Sign-in, header name (TL-05), deactivated refusal + sign-out (TD-WS13-005, WS13-P1-I), navigation desktop/mobile, Dashboard, Quick Actions (CM-03) | WP-1.9 touches auth and header |
| Phase 0 conversion | `JRN-####`, POC creation, audit, IN-01 | Shared tables |
| Public smoke | Build includes public routes; Homepage, Journey Passport to lead (no OTP send) | Shared build and database |

### 14.6 QA handover preparation (after G-2)

Build, branch and commit; Preview deployment id; migration parity (35 = 35); identities (Product Owner performs sign-ins); QA data list (`QA-WS13-P1-*`); error-code catalogue; action matrix (§8.4); bounded surfaces (§4.2); expected Phase 1 behaviour (§14.7); scenarios outside Phase 1 QA (PO Decision 6), listed with their local test references for information only.

---

### 14.7 Expected Phase 1 behaviour for QA (Revision 2; PO Decisions 4, 6 and 7)

These outcomes are **expected** in Phase 1 and are not defects:

| # | Area | Expected Phase 1 behaviour | Basis |
|---|---|---|---|
| Q-01 | Start preparation | Template radio list with **no pre-selection**; Confirm disabled until a template is chosen; note "This template doesn't have readiness items yet…" because templates are empty | Sophie S-4; TL-04 |
| Q-02 | Readiness | After Start preparation the chip shows **"Ready" with "No checklist items yet"**; "Mark ready to travel" is available immediately and its dialog says nothing was checked | PO Decision 4; Sophie `020B` §3 |
| Q-03 | Readiness gate | The blocking case (`readiness_incomplete`) cannot be produced in Phase 1. It is QA'd in Phase 2 once template content exists | PO Decision 4 |
| Q-04 | Cancel Journey | No booking list in the Cancel dialog (no bookings exist). Vendor-cancellation scenarios are **not in Phase 1 QA** | PO Decision 6 |
| Q-05 | Replacement Journey | No material-change action; replacement scenarios (incl. P0-REPL-01) are **not in Phase 1 QA** | PO Decision 6; `DEC-R1.3-025` |
| Q-06 | Legacy adoption | Functional QA **only** on a legacy Journey that is itself a test record (identified with Annex B query B-1 and confirmed by the Product Owner). If none exists, adoption QA is **deferred** until an isolated environment exists; engineering evidence is the local database suite. No genuine record is adopted. | PO Decision 7 |
| Q-07 | Hidden surfaces | Only Overview, Itinerary and History tabs; no bookings, documents, tasks, alerts, material change, archive or Closed & Archived link | Sophie C-01…C-10; `DEC-R1.3-025` Decision 2 |
| Q-08 | Terminal Journeys | Completed and Cancelled Journeys leave the default list and are opened by direct link, notification or planning record | ND-6 default |
| Q-09 | Date-gated steps | "Mark travelling" and "Mark travel complete" need QA Journeys converted with today's or past dates, through the product | §14.4 |
| Q-10 | Test data | Only `QA-WS13-P1-*` records created through the product; no database-prepared data; no genuine record modified | PO Decision 7; `DEC-R1.3-022` (5) |

## 15. Success-Criteria Traceability (D10; card §14)

FR/BR identifiers supplied by Arjun (Annex A.1).

| SC | Engineering outcome (objectively verifiable) | WP | Verification |
|---|---|---|---|
| SC-1 | M11 applied through the approved runbook; parity 35 = 35; every function passes success + every error code locally, and every product-reachable code live on Preview | WP-1.1, E4 | Local test log; runbook record; live checklist |
| SC-2 | `/workspace/journey-workspace` renders the list (no "Coming Soon"); summary-strip counts equal the filtered list size; every filter, search and sort survives reload and Back (URL) | WP-1.3 | `verify:…-list`; browser walkthrough; QA |
| SC-3 | Header shows three labelled people cards, seven-step stepper (compact < 1024 px), one primary action or a disabled reason, status banners, Service Category chip with pencil for owner/Administrator | WP-1.4, WP-1.6 | Walkthrough per stage/state; QA |
| SC-4 | Overview next step and readiness state come from the summary view / `derivations.ts`, never stored values | WP-1.4 | Code review; `verify:…-derivations` |
| SC-5 | List ↔ detail ↔ tabs via URL; deep links `?tab=` work; rows are real links | WP-1.3, WP-1.4 | Walkthrough; QA |
| SC-6 | Exactly three tabs (Overview, Itinerary, History); Itinerary read-only; History filters and paging 50 | WP-1.4, WP-1.7 | Walkthrough; QA |
| SC-7 | Every Phase 1 lifecycle action works from the right stage only; stale page rejected with a specific toast | WP-1.1, WP-1.5 | Local tests; live checklist; QA |
| SC-8 | Assign/reassign (active users only); adoption with required Service Category; POC editor; each audited | WP-1.1, WP-1.6 | Local tests; live checklist; QA (adoption per ND-2) |
| SC-9 | Action matrix (§8.4) enforced server-side for owner, non-owner, Administrator and deactivated user; an audit entry for every action | WP-1.1, WP-1.2 | Local tests; API calls as non-owner; QA |
| SC-10 | Data read only through the approved read models; every §11 item In is closed and every Deferred item has a target | WP-1.2, WP-1.9 | Completion report mapping |
| SC-11 | Baseline and Phase 1 measurements recorded; results against T-1…T-5 | WP-1.0, WP-1.10 | §13 tables |

---

## 16. Risk Register, Dependencies and Rollback (E; D11; card §12)

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-P1-01 | PL/pgSQL defects visible only at execution (R-ENG-JW-04) | Medium | High | Local PG 17.6 suite on every error path before apply; live checklist after apply | Rad |
| R-P1-02 | Shared Preview/Production database (RISK-R1.3-001): M11 and QA data reach the Production database | Certain (by design) | Medium | M11 additive and inert for Production; runbook (G-1); QA data prefixed and removed at release; no database-prepared data | Tiger / Vivek |
| R-P1-03 | Runbook §2.10 or playbook §2.11 late (RISK-R1.3-005) | Medium | Medium | Gates G-1 and G-2 in the sequence; Rad supplies technical steps for G-1 during E2 | Tiger / Rad / Keerthi |
| R-P1-04 | Response times stay above target because of the region gap (RISK-R1.3-006) | High | Medium | Measure first (E1); reduce sequential calls; escalate region proposal (A-3) rather than optimise blindly | Rad → Archie |
| R-P1-05 | Readiness not enforced in Phase 1 (PO Decision 4) is mistaken for a defect, or reaches release without template content | Medium | Low | Honest display (Sophie `020B` §3); QA expectations Q-02/Q-03; `OD-R1.3-6` and EP-02 content before Phase 2 | Arjun → Vivek; Tiger |
| R-P1-06 | Legacy adoption cannot be functionally QA'd without touching genuine records (PO Decision 7) | Medium | Medium | Use a legacy Journey that is itself a test record if one exists (Annex B B-1, Product Owner confirms); otherwise defer until an isolated environment; local database suite as engineering evidence | Vivek / Tiger |
| R-P1-07 | Scope growth from carry-forward and bounded surfaces (R-5) | Medium | Medium | §4.2 and §11 explicit; TL-06 deferred; anything else is a backlog proposal | Tiger |
| R-P1-08 | Transition rules diverge between SQL and `validation.ts` (R-ENG-JW-05) | Medium | Medium | Lockstep comments; `verify:…-transitions`; QA via API as well as UI | Rad / Keerthi |
| R-P1-09 | Time-zone errors on date gates (R-ENG-JW-06) | Low | Medium | `workspace_business_today()` in SQL, `businessDateOf()` in TS; date verify around 18:30 UTC | Rad |
| R-P1-10 | Decisions late (ND-*, S-*) stall a WP | Medium | Medium | Defaults stated for every decision; latest dates per WP (§12) | Tiger |
| R-P1-11 | Date-gated transitions hard to QA without suitable Journeys | Medium | Low | QA scenarios convert planning records with today/past dates through the product | Keerthi / Tiger |
| R-P1-12 | POC change saved but audit insert fails (non-atomic) | Low | Low | Accepted by AD-WS13-002; server error logged with the Journey id; History shows the gap for investigation | Rad |
| R-P1-13 | Local test harness cannot replay migrations (TD-WS13-002) | Certain without workaround | Low | Phase 0 workaround; fix before any new environment | Rad / Archie |
| R-P1-14 | Next.js 16 API differences (async `params`/`searchParams`, `proxy.ts`) | Medium | Low | Read `node_modules/next/dist/docs/` guides before each new pattern (`web/AGENTS.md`) | Rad |
| R-P1-15 | Phase 1 build breaks public routes (shared build) | Low | High | Preview build check; public smoke | Rad |
| R-P1-16 | Deactivation not enforced in RLS read policies (Archie AR-F1, pre-existing) | Low | Medium | Session sign-out on refusal in Phase 1 (TD-WS13-005); TD-WS13-006 on the RLS hardening card before Phase 3 (ND-12) | Archie / Rad |

**Dependencies:** Archie's M11 review (done, `020A`) and SQL review at Milestone A (AC-9); Product decisions per §12.1; Sophie confirmations per §12.2; runbook G-1 before E4; playbook G-2 before E8; Product Owner sign-in for E1 and E7 measurements; QA identities (exist).

**Assumptions:** **[A1]** the shared database has M01–M10 exactly as in the repository (parity 34 = 34 recorded 30-Sep-2026). **[A2]** No objects were created directly in the Supabase dashboard that conflict with M11 function names (the runbook's live dependency checks confirm). **[A3]** Preview remains the authoritative QA environment (`DEC-R1.3-022` (3)).

**Rollback summary:** application → redeploy the previous Preview build; M11 → forward-fix dropping the nine functions (no data impact); data → audited forward-fix script approved by the Product Owner; logical backup restore remains the separate data-recovery control (Phase 0 §8.2).

---

## 17. Engineering Readiness Statement and Effort (H; D12) — Revision 2

| Area | Status |
|---|---|
| Repository verified, clean apart from this plan, on the release branch | ✅ §0 |
| Baselines understood; Phase 0 as built re-baselined | ✅ §3 |
| Approach feasible within the stack, no new dependency, no schema change | ✅ §5, §9 |
| M11 specified and architecture-reviewed | ✅ §9 — Archie `020A` approved with conditions, all incorporated |
| Product Owner decisions | ✅ Decisions 1–8 incorporated (§12.1) |
| UX confirmations | ✅ Sophie `020B` |
| Carry-forward and debt dispositioned (C-3) | ✅ §11 |
| Decision record (C-4) | ✅ §12 — eight defaults await confirmation with this revision (§12.3) |
| Profiling plan (C-5) | ✅ §13 — baseline is the first implementation step |
| Gates placed (C-6) | ✅ §7 G-1, G-2 |
| QA expectations documented (Decision 4) | ✅ §14.7 |

**Recommendation: Ready for implementation on the Product Owner's confirmation of Revision 2.**

| # | Remaining condition | Owner | When |
|---|---|---|---|
| IC-1 | Product Owner confirms Revision 2, including the §12.3 defaults; Tiger records `DEC-R1.3-026` and issues the implementation EBC | Vivek / Tiger | Before implementation starts |
| IC-2 | Archie reviews the M11 SQL and local test evidence at the Milestone A checkpoint (AC-9) | Archie | Before M11 is applied |
| IC-3 | Deployment runbook §2.10 approved (G-1) | Tiger / Vivek | Before M11 is applied |
| IC-4 | QA playbook §2.11 approved (G-2) | Tiger / Keerthi / Vivek | Before the Phase 1 QA handover |
| IC-5 | Product Owner runs Annex B query B-1 and confirms whether any legacy Journey is a test record usable for QA (Q-06) | Vivek | Before the QA handover |

**Effort indication (relative, not a commitment):** WP-1.0 S · WP-1.1 L · WP-1.2 M · WP-1.3 M · WP-1.4 L · WP-1.5 M · WP-1.6 M · WP-1.7 M · WP-1.8 M · WP-1.9 S · WP-1.10 S → **Phase 1 overall M–L**, one Keerthi QA cycle. Revision 2 adds no work package; the refinements sit inside WP-1.1, WP-1.6, WP-1.8 and WP-1.9.

Engineering can begin on confirmation, starting with WP-1.0 (measurement) and WP-1.1 (M11 written and tested locally). Neither changes the shared database.

---

## 18. Observations and Backlog Proposals (outside Phase 1 scope)

| ID | Observation | Evidence | Recommendation / owner |
|---|---|---|---|
| OBS-P1-01 | `WS13-019` §12 says Ready to Travel is "not reachable end-to-end" until Phase 2; with empty templates it is reachable immediately | M09 view `readiness_state`; M05 template items empty **[F]** | Tiger notes in the synchronisation; ND-1 |
| OBS-P1-02 | `web/.vercel/project.json` names project `prj_eszCBVslQvWAChFyLUn5DlPzEkj3`, which the Vercel API reports as not found; the live project is `prj_FT0mYYyrbhGNnDQUp8qLw8PrHHm5` | Vercel API **[F]** | Local CLI link only; Product Owner may re-link (`vercel link`) if the CLI is ever used. No effect on Git-driven deployments. |
| OBS-P1-03 | Newer Previews exist than the Phase 0 QA baseline (`dpl_Grrz9…` from `d533a95`, documentation-only changes) | Vercel API **[F]** | None; the Phase 1 Preview becomes the Phase 1 QA baseline |
| OBS-P1-04 | `workspace_audit_log` and `workspace_tasks` SELECT `using (true)` for any authenticated session | Migrations `20260921060000`, `20260921060200` **[F]** | Add to the RLS hardening card with TD-WS12-004/005 (Tiger) |
| OBS-P1-05 | UXA numbering differs between `WS13-004` §9.3 and UX Rev 4 §36 | RB-08 | Cite UX sections, not UXA numbers (Tiger, Sophie) |
| OBS-P1-06 | The carry-forward register and the Phase 0 report record ED-02 as "…You can still save; you'll need one to confirm."; the shipped text is "Couldn't load Service Categories. Reload the page to try again." | `web/components/workspace/journey-planning/TripBasicsPanel.tsx` **[F]**; Sophie S-2 | Sophie confirmed the shipped text; Tiger corrects the record |
| OBS-P1-07 | Deactivation not enforced in RLS read policies (pre-existing) | Archie AR-F1 | TD-WS13-006 proposal (ND-12) |
| BP-P1-01 | Use the directory to show owner names in the JP queue (raw ids today; `WS13-004` BP-01) | `JourneyPlanningQueueView.tsx` | Backlog proposal; one-line change outside WS13 Phase 1 |
| BP-P1-02 | JP non-owner gating aligned with Journey screens (WS13-P1-H JP part) | Annex A.3 | Backlog unless specified for Phase 1 |

---

## 19. Supporting Persona Requests — Status (Revision 2)

| Persona | Request | Status |
|---|---|---|
| Arjun | FR/BR mapping for SC-1…SC-11; analyses for `OD-R1.3-7`, WS13-P1-H, WS13-P1-I, UXO-08, ND-1, ND-3 | **Provided** — Annex A. UXO-08, ND-1 and ND-3 decided by the Product Owner (Decisions 3–5); the others await confirmation (§12.3). AR-F6 open for Arjun before Phase 2. |
| Archie | M11 review; TL-06 email visibility; region view after profiling | **M11 review done** — `EBC-R1.3-WS13-020A`, approved with conditions. TL-06 question no longer needed (Decision 2). Region view after E1 (Decision 8). SQL review at Milestone A (AC-9). |
| Sophie | Phase 2 surfaces; template selection; WS13-P1-C; WS13-P1-G; remaining Phase 1 confirmations | **Done** — `EBC-R1.3-WS13-020B`, all six requests confirmed. |

---

## Annex A — Arjun: Requirements Traceability and Product Decision Analyses

> **Prepared by Arjun, Product and Business Analyst (supporting persona), for `EBC-R1.3-WS13-020`.** Recommendations only; decisions rest with the Product Owner. Sources: `WS13-001` Rev 3, UX Rev 4a, `RELEASE-1.3.md` §6–§7. Labels: confirmed requirement / inferred requirement / assumption / open question.
>
> **Product Owner outcome (4-Oct-2026):** A.5 accepted (Decision 3); A.6 accepted as "workflow exposed, not enforced" (Decision 4); A.7 Option B accepted (Decision 5). A.2, A.3 and A.4 await confirmation with Revision 2 (§12.3).

### A.1 Success criteria → FR/BR

| SC | Functional requirements | Business rules |
|---|---|---|
| SC-1 | FR-JW-08, -09, -10, -11, -31 (AC2), -01 (AC5) | BR-025, -026, -029, -030, -036, -041, -043 |
| SC-2 | FR-JW-03 (AC1–AC4), -29 (search keys; stage, owner, On Hold, readiness, departure filters; AND; default sort), -34, -32 (next action on rows) | BR-035 |
| SC-3 | FR-JW-01 (AC1, AC3, AC4), -04, -14 (AC1, AC2) | BR-034, -040, -043, -031 |
| SC-4 | FR-JW-01 (AC1), -22 (AC2, AC3 — state only in Phase 1), -32 | BR-028 (calculation never stored), BR-005 |
| SC-5 | FR-JW-29 (URL state supports shared links; UX §20) | — |
| SC-6 | FR-JW-02, -06 (accepted Proposal Version; AC3 planning link), -30 (AC1–AC3) | BR-012 |
| SC-7 | FR-JW-08 (AC1–AC3), -09 (AC1, AC3), -10, -11 (AC1–AC4; AC2 cancel tasks — see ND-5) | BR-025, -028, -029, -030, -041 |
| SC-8 | FR-JW-03, -31 (AC2), -01 (AC3–AC5), -06 (AC5), -27 (assigned/reassigned) | BR-026, -036, -040, -043 |
| SC-9 | FR-JW-09 (AC3), -31 (AC1, AC2, AC5), -30 | BR-035; WS13-001 §15 permissions |
| SC-10 | Carry-forward register items (TL-01, -02, -05, -07, -08; WS13-P1-B, -C, -G, -H, -I) | — |
| SC-11 | NFR-WS-001–007 (unchanged, WS13-001 §22); WS13-P1-J | — |

Not traced to Phase 1 (deferred): FR-JW-12, -13, -15–-21, -23–-28, -32 (Dashboard parts), -33.

### A.2 `OD-R1.3-7` / WS13-P1-B — Deactivated-user behaviour

- **Known (confirmed):** E-06: "The Journey keeps its owner (never unassigned). Administrators receive AL-16 to reassign." UX §16: owner card shows "Account deactivated"; Assign/Reassign picker lists active Workspace Users. Deactivated users are refused at sign-in and every API (Phase 0).
- **Missing:** whether Administrators may still act on a deactivated owner's Journey before reassigning (inferred yes — Administrators may act on any Journey, §15); what happens to Journey Planning records they own (WS12 records, outside Journey Workspace); when AL-16 arrives.
- **Why it matters:** an owned Journey whose owner cannot sign in has no one acting on it unless an Administrator notices.
- **Options:** **A.** Baseline only: owner kept; marker on the owner card; Administrators reassign manually; pickers active-only; RPC refuses deactivated new owners; AL-16 with Phase 3 alerts. **B.** Automatic reassignment on deactivation — contradicts E-06. **C.** Block deactivation while the user owns active Journeys — needs the TL-06 screen (deactivation is done in the database today).
- **Recommendation: A.** It applies decided rules with no new behaviour. Until AL-16 (Phase 3), Administrators find these Journeys with the owner filter. JP records owned by deactivated users stay a WS12 topic for the backlog.

### A.3 WS13-P1-H — Non-owner sees actions

- **Known:** Journey Workspace UX §9.3 hides action buttons for non-owners and shows "Owned by … Only the owner or an Administrator can change this Journey." (FR-JW-09 AC3). In Journey Planning (WS12), non-owners see decision buttons and editable Trip Basics; the server refuses on save.
- **Missing:** the intended JP behaviour.
- **Options:** **A.** Journey screens per UX §9.3; JP unchanged (server already refuses). **B.** Align JP with the Journey pattern — a WS12 UX change needing Sophie's specification and WS12 regression. **C.** Disable (not hide) with reasons in JP.
- **Recommendation: A for Phase 1, B as a backlog proposal.** It protects Phase 1 scope; no data risk exists because the server refuses. If Sophie specifies B before WP-1.9 starts, Rad estimates it as S.

### A.4 WS13-P1-I — Refusal wording

- **Known:** deactivated and never-provisioned users both read "Not provisioned as Workspace staff." The concern is account enumeration.
- **Analysis:** the message is shown only **after** a successful password sign-in, so a stranger cannot use it to discover accounts. The current wording is inaccurate for a deactivated colleague.
- **Options:** **A.** Keep as is. **B.** Distinct wording per case ("Your Workspace access has been deactivated…"). **C.** One neutral message for both, e.g. "You don't have access to the SMV Workspace. Please contact an Administrator."
- **Recommendation: C**, with the session signed out (TD-WS13-005). Accurate for both cases, discloses no account state, one message to maintain. Final copy: Sophie.

### A.5 UXO-08 — Owner scope "Team"

- **Known (confirmed):** BR-035 "Every Workspace User can view every Journey." WS13-001 §15: Workspace User may "View any Journey, the list". FR-JW-29: owner filter "Mine / named user". UX §7.2: default Mine. `WS13-004` §8.3 engineering default: Team Administrator-only.
- **Conflict:** an Administrator-only Team scope would stop a Workspace User from listing colleagues' Journeys, which §15 allows.
- **Options:** **A.** All users may choose Team or a named owner on JW-01 (default remains Mine). **B.** Administrator-only Team (contradicts §15).
- **Recommendation: A** for JW-01. The Dashboard My Work/Team toggle (Phase 3) can be decided separately if the Product Owner wants a different rule there.

### A.6 ND-1 — Readiness gate with empty templates

- **Known:** BR-028 counts Mandatory applicable items only; a template with no items has none outstanding. Template items are Product Owner content (EP-02) due with Phase 2.
- **Options:** **A.** Apply BR-028 as written: in Phase 1 "Mark ready to travel" is available right after Start preparation; documented limitation; content arrives before release. **B.** Treat a template with no mandatory items as not ready — a **new rule**, of the same family as `OD-R1.3-6` ("no bookings / no documents"). **C.** Bring EP-02 content forward into Phase 1.
- **Recommendation: A**, and decide `OD-R1.3-6` before Phase 2 so the vacuous-truth question is answered once for templates, bookings and documents. Phase 1 runs on Preview only; the Production application is unchanged until Release Approval.

### A.7 ND-3 — Number of Nights at legacy adoption

- **Known:** BR-036: dates recorded at adoption. BR-027 (nights required, dates must match, never auto-corrected) is stated for conversion. BR-031: nights immutable on a Journey. Legacy planning records are closed; some have null nights (ENG-OBS-02).
- **Gap:** with null nights, consistency cannot be checked and nights cannot be entered anywhere; with nights set, the Administrator's dates may disagree.
- **Options:** **A.** Require nights present and consistent; null nights → the Journey cannot be adopted (stays legacy until archived in Phase 3). **B.** Null nights → derived from the dates the Administrator enters, recorded in audit; nights set → dates must match. **C.** Administrator may override stored nights.
- **Recommendation: B.** It is an explicit Administrator action rather than an automatic correction, keeps nights immutable afterwards, and avoids a permanent dead end. C is not recommended (edits a material element). Product Owner to confirm that B respects the intent of BR-027.

---

## Annex B — Read-only checks for the Product Owner (Supabase SQL editor)

Run each as-is; none writes. Paste the results back.

```sql
-- B-1 Legacy Journeys awaiting adoption (ND-2)
select journey_reference, owner_id is not null as has_owner, nights, created_at
from public.workspace_journeys
where adoption_status = 'legacy_pending'
order by created_at;

-- B-2 Journeys by stage and state (QA planning)
select stage, outcome, on_hold, adoption_status, count(*)
from public.workspace_journeys
group by 1, 2, 3, 4
order by 1, 2, 3, 4;

-- B-3 Readiness template items (confirms ND-1: expect 0 rows today)
select t.code, count(i.id) as items
from public.workspace_readiness_templates t
left join public.workspace_readiness_template_items i on i.template_id = t.id and i.active
group by t.code;

-- B-4 Query cost of the summary view (performance B-8)
explain analyze select * from public.workspace_journey_operational_summary;

-- B-5 No function name collision with M11 (assumption A2; expect 0 rows)
select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'workspace_journey_%';
```

Region confirmation (optional): Supabase dashboard → Project Settings → General → Region (expected: Northeast Asia (Seoul)).

---

## Confirmations

- **Planning only.** No application code, migration, configuration, environment variable, database row or deployment was created or changed. No SQL was run against any database.
- Read-only checks only: Git (`GIT_OPTIONAL_LOCKS=0`), `tsc --noEmit`, `eslint`, the four `verify:journey-workspace-*` scripts, Vercel API reads, and the linked-project pooler **host name** (no credential read). The working tree was clean before and after.
- No Product, UX or Architecture decision was changed. Where repository evidence differs from earlier plans, the difference is stated (§3.2) and routed to its owner (§12). Engineering defaults are labelled as defaults.
- Arjun's analyses are attributed (Annex A). Archie's review and Sophie's confirmations are separate documents under their own names (`020A`, `020B`); Rad has not approved them, and they do not approve Rad's plan.
- Files: `docs/09-Development/EBC-R1.3-WS13-020-RAD-Phase-1-Engineering-Execution-Plan.md` (Revision 2), `EBC-R1.3-WS13-020A-ARCHIE-Phase-1-M11-Architecture-Review.md`, `EBC-R1.3-WS13-020B-SOPHIE-Phase-1-UX-Confirmations.md`, each with a Project Knowledge copy. Nothing committed or pushed.

---

*Prepared by Rad, Engineering and Implementation Specialist, on behalf of Team Satvi, per `EBC-R1.3-WS13-020`. Revision 2 submitted for the Product Owner's final confirmation; not self-approved. On confirmation, Revision 2 is the approved Phase 1 engineering baseline.*
