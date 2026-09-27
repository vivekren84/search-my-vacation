# EBC-R1.3-WS13-004 — Journey Workspace Engineering Planning & Implementation Strategy

**Persona:** Rad, Engineering and Implementation Specialist
**Prepared by (card):** Tiger, Programme and Delivery Lead
**Release / Workstream:** 1.3 / WS13, Journey Workspace
**Feature:** `FEAT-R1.3-013`, SMV Workspace
**Phase:** Engineering Planning. **Planning only.** No code, migration, configuration, commit, push or deployment.
**Date:** 26 September 2026
**Baselines consumed (authoritative, not modified):**

| Baseline | Version used |
|---|---|
| Product | `EBC-R1.3-WS13-001` **Revision 3** (FR-JW-01–34, BR-025–045, D-01–D-13, POD-01–POD-08, I-01–I-08), `WS13-001B`, `WS13-003A` (incl. §8 addendum), Workspace Product Specification v2.0 (§19, §20), RTM v2.1 |
| UX | `EBC-R1.3-WS13-002` **Revision 3** (Project Knowledge copy; UX-01–UX-08, WF-01–WF-07) |
| Architecture | `EBC-R1.3-WS13-003` (AD-WS13-001–007, §8 Engineering Impact), Workspace Domain Model, Data Architecture, Integration Architecture, Architectural Decisions register |
| Release | `RELEASE-1.3.md`, `RELEASE-1.3-WORKSTREAM-PLAN.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, `TECH-DEBT.md` |

**Status:** **Engineering Planning complete. Recommendation: Ready to begin implementation — Conditional** (§13). Rad does not approve his own plan; Tiger validates.

**Evidence labels:** **[F]** fact from the repository (path cited), **[B]** stated in an approved baseline, **[Rec]** engineering recommendation, **[A]** assumption, **[Q]** question for governance.

---

## 0. Workspace Readiness Check (Project Instructions §14 / §15)

| Check | Result |
|---|---|
| Task | Engineering Planning for WS13. Documentation only. |
| Active persona | Rad. Inputs from Arjun, Sophie and Archie consumed; hand-over to Tiger. |
| Local repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, connected this session (read access used) |
| Branch | `main`; last commit `20cc249` ("feat(ws12): complete Journey Planning workstream") |
| Working tree | **Not clean.** 20 modified tracked files and several untracked files, all WS13 baseline documentation (Arjun, Sophie, Archie, Tiger). None created or changed by Rad. See GO-01. |
| Repository guidance | `web/CLAUDE.md` → `web/AGENTS.md`: *"This is NOT the Next.js you know … Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."* Applies to every implementation phase. |
| Stack (actual) | `web/package.json`: Next.js **16.2.10**, React **19.2.4**, `@supabase/ssr` 0.12, `@supabase/supabase-js` 2.116, Tailwind 4, TypeScript 5. **No ORM, no validation library, no unit-test framework.** Verification is by `tsc` + Node `verify:*` scripts. **[F]** |
| Code / schema changes authorised | **No.** |
| Files created by this card | This report only (`docs/09-Development/`), plus its Project Knowledge copy. Nothing else touched. |
| Commit / push | None. |

---

## 1. Executive Summary

The approved WS13 baseline can be built **within the existing stack and conventions with no new runtime dependency**. Archie's architecture (AD-WS13-001–007) is sound and repository-accurate; I re-verified every gap he cites (GAP-01–12) against the migrations and code and found them correct.

The engineering plan has **six phases**, executed as **separate implementation EBCs with a QA gate after each**, because WS13 is the largest Workspace module to date (≈ 11 new tables/extensions, ≈ 15 RPCs, 1 view, ≈ 20 API routes, 3 new pages, ≈ 25 new components):

| Phase | Name | Size | Gate |
|---|---|---|---|
| **P-A** | Quick win: CM-03 Quick Actions removal | XS | Can ship immediately |
| **P0** | Foundation & Journey Planning entry point (schema, conversion v2, CM-01/02/05/07, read modules, WS12 regression) | **L** | Keerthi WS12 focused regression |
| **P1** | Journey core: list, header/Overview, lifecycle, History, POC, ownership, Service Category, legacy adoption | M | Keerthi P1 |
| **P2** | Operational tabs: Vendor Bookings, Readiness, Documents, Tasks, Activity & Changes, alert display | L | Keerthi P2 (+ vendor & content seeded) |
| **P3** | Dashboard live data, Closed & Archived, Archive, alert delivery + daily cron (+ bell/NOT-01/search if scoped) | M (L if EP-05) | Keerthi P3 |
| **P4** | Material change end to end (replacement → supersession) | S–M | Keerthi IF-08 + JP regression |
| **P5** | Release hardening: full regression, Sri review, docs, TD | S | Tiger → Product Owner |

Archie's single Phase 0 migration batch is kept for everything that is **deployment-coupled** (Journey schema + conversion v2); the lifecycle, booking, archive and material-change RPCs are delivered **with the phase that consumes them**, so each QA cycle tests exactly what shipped. This is sequencing only; no decision is changed.

**Eight Product Owner decisions (POD-01–08) post-date Archie's report.** Five of them create additive engineering deltas that the architecture documents do not yet show (Service Category on Journey and Journey Planning; dates–nights **block** instead of warn; no unarchive; POD-05 vendor attributes and Vendor Code; Change Category). Per Source-of-Truth precedence, the Product decisions govern and each delta fits an existing AD pattern, so **no architecture decision is changed**. They are listed in §2.4 for Archie's formal alignment (GO-03).

**The single highest engineering risk is deployment coupling** (Archie's R-07, confirmed): the Journey schema constraints and the conversion RPC v2 must be applied and deployed together, otherwise the live Journey Planning Decision → Confirmed path fails. The repository is linked to **one** Supabase project (`SearchMyVacation_WebsiteUpgrade`) **[F]**, and whether that project also serves a deployed environment is unknown (ENV-01). §6.6 gives the deployment runbook.

**Readiness:** implementation may begin with **P-A immediately** and **P0 once six conditions are met** (§13): AD ratification recorded, Archie's POD alignment note, Sophie's UX addenda for the Journey Planning Decision dialog/Service Category/archive, environment topology confirmed, a clean feature branch from a committed baseline, and the time-zone confirmation. Content (EP-02) and vendor data (EP-03) gate P2 verification, not P0 start.

---

## 2. Repository Findings

### 2.1 What exists and will be reused (verified)

| Area | Evidence **[F]** | WS13 engineering use |
|---|---|---|
| Route segment and guard | `web/app/workspace/(dashboard)/layout.tsx`; `lib/workspace/shared/rbac/guard.ts` (`requireWorkspaceUser`) | JW pages sit under `(dashboard)/journey-workspace/`; guard extended for deactivation (AD-WS13-007) |
| Placeholder page | `(dashboard)/journey-workspace/page.tsx` renders `ComingSoon` (5 lines) | Replaced by JW-01 |
| Module convention | `lib/workspace/journey-planning/{types,validation,repository,service}.ts` (245/519/524/646 lines) | New `lib/workspace/journey-workspace/` + `derivations.ts` (AD-WS13-004) |
| API conventions | `lib/workspace/shared/api/respond.ts` (`authenticateWorkspaceApiRequest`, `jsonResponse` with `no-store`); 13 JP route handlers using `params: Promise<…>` and `runtime = "nodejs"` | Same for every JW route |
| RBAC helpers | `shared/rbac/permissions.ts`: `canEditRecord`, `canAdvanceStage`, `canReassignRecord` (owner or admin), `canArchiveOutsideNormalClosure` (admin) | Reused for UI gating; RPCs re-check server-side |
| Ownership | `shared/ownership/service.ts` (`claimOwnedWorkspaceRecord`, `reassignOwnedWorkspaceRecord` — plain `.update()`) | **Not reused for Journeys**: Journeys have no UPDATE grant; reassign is an RPC (AD-WS13-002) |
| Audit | `workspace_audit_log`, index `(entity_type, entity_id, created_at desc)`; CHECK extended twice by precedent (`20260922080100`, `20260922090100`); `shared/audit/types.ts` lockstep comment | Extend CHECK once per phase; Journey entity `entity_type='journey'` |
| Notifications | `workspace_notifications` (`is_read`/`read_at` only); `shared/notifications/*` | Extended (condition key, resolution) |
| Tasks | `workspace_tasks` polymorphic (`entity_type`/`entity_id`), no category | Extended (category, kind) |
| Proposal snapshot | `workspace_proposal_versions.itinerary_snapshot` (insert-only grant) | JW-03 read-only render |
| Conversion RPC | `20260921070600_…conversion.sql`: 2 args, `SECURITY DEFINER`, actor check only, inserts `status='active'`, no owner/dates, **no authorisation** | Replaced by v2 (AD-WS13-003) |
| Journeys table | `20260921070300_…bootstrap_journeys.sql`: 7 columns, SELECT-only grant | Extended (AD-WS13-001) |
| JP trip basics | `20260922090000_…trip_basics.sql`: `adults`…`preferred_departure_city`, all nullable, **no backfill** | Carried to Journey; nullable legacy values must be handled (ENG-OBS-02) |
| Dashboard | `components/workspace/dashboard/KpiGrid.tsx` literal `0` values; `QuickActions.tsx`; `(dashboard)/page.tsx` | Live data in P3; CM-03 in P-A |
| Header placeholders | `WorkspaceHeader.tsx` "Notifications (coming soon)"; `shared/NotificationAreaPlaceholder.tsx` | EP-05 decision |
| Label-mapping pattern | `components/workspace/journey-planning/journeyPlanningLabels.ts` | `journeyWorkspaceLabels.ts` maps `journey_closed` → "Completed" (UX-04/UX-08) |
| Environment variables | `web/.env.example` names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `JOURNEY_LEAD_*`, `SMS_PROVIDER_*` (names only read) | Reuse Supabase vars; add `CRON_SECRET` (P3) |
| Supabase link | `supabase/supabase/.temp/linked-project.json`: one linked project, name `SearchMyVacation_WebsiteUpgrade`. No `supabase/config.toml`, so **no local Supabase stack**. | Migration apply and RPC testing strategy (§6.6, §10.3) |
| Verification style | `web/package.json` `verify:*` scripts: `tsc -p tsconfig.*.json` then `node` a compiled verifier | New `verify:journey-workspace` scripts follow the same style |

### 2.2 Gaps confirmed (Archie's GAP-01–12 re-verified — all correct)

All twelve reproduced from the files cited in WS13-003 §3.2. Two additional details matter for engineering:

| # | Finding **[F]** | Engineering consequence |
|---|---|---|
| RF-01 | No `vercel.json` exists anywhere in the repository; `web/next.config.ts` has redirects only | P3 must add `vercel.json` in the **Vercel project root directory** (probably `web/`) — confirm under EP-04 |
| RF-02 | No code reads `workspace_vendors`; JP Vendor Quotations require a **raw vendor UUID** (`JourneyPlanningRecordDetailView.tsx:575`) | Confirms UXO-05; `listActiveVendors()` also improves nothing in JP unless separately scoped (not in WS13) |
| RF-03 | JP queue shows raw owner UUIDs for other users (`JourneyPlanningQueueView.tsx:156`) | The user directory (AD-WS13-007) fixes this for JW. Using it in JP is a one-line improvement **outside WS13 scope** → backlog proposal BP-01 |
| RF-04 | No Supabase Storage usage anywhere (`grep storage.from` → none) | Consistent with D-10 (no upload) |
| RF-05 | The Release 1.2 OTP RPCs had PL/pgSQL ambiguous-column defects visible **only at live execution** (`RELEASE-1.2.md`, IMP-02/IMP-03) | WS13 adds ≈15 RPCs; every RPC needs a live-execution test (R-ENG-JW-04) |
| RF-06 | WS12-010V: migrations present locally but not applied remotely caused QA failures; no CLI token is available to Claude (`EBC-R1.3-WS12-010V` §20) | Migration parity must be confirmed by the Product Owner each cycle (EP-08) |
| RF-07 | The repository copy of WS13-002 is still Revision 2 (no "UX-08" text) | Governance sync (GO-04) |

### 2.3 Pre-existing security observations (not fixed by WS13 unless stated)

SEC-01 (conversion RPC has no authorisation) — **fixed in P0** by conversion v2. SEC-02 (JP `using(true)` UPDATE policies), SEC-03 (notification INSERT `with check (true)`), SEC-04 (JP `owner_id on delete set null`) — unchanged by WS13; WS13 does not repeat any of them. Recommend Tiger logs SEC-02/03 as `TD-WS12-004`/`TD-WS12-005` in `TECH-DEBT.md` (GO-09).

### 2.4 Post-architecture Product decisions — engineering deltas (for Archie's alignment)

| Delta | Source **[B]** | Engineering treatment (fits which AD) | Architecture doc still says |
|---|---|---|---|
| **D-01 Service Category on Journey Planning and Journey** | POD-02, POD-07, BR-043, FR-JW-01 AC4/5, FR-JW-06 AC8, CM-07 | `service_category text null` on `workspace_journey_planning_records`; `service_category text` on `workspace_journeys` (required when `adoption_status='adopted'`); value validated against configuration list; conversion rejects when missing; change via RPC `workspace_journey_set_service_category` with audit (AD-WS13-001/002/006 patterns) | Not modelled (O-02) |
| **D-02 Dates–nights mismatch blocks conversion** | POD-06 Policy 2, BR-027, FR-JW-06 AC7, I-05 | Conversion v2 raises `workspace_conversion_dates_nights_mismatch` when `(end − start) ≠ nights`; UI shows it pre-submit (AD-WS13-003) | Warn only (PD-ARC-02, O-01) |
| **D-03 No unarchive; Archived = read-only** | POD-08 D2, BR-038, FR-JW-31 AC5/6 | No `…_unarchive` RPC or route; `workspace_can_edit_journey()` and every Journey RPC reject `archived_at is not null` with `journey_archived` (AD-WS13-002) | `…_unarchive` listed; JW-14 "Archive / Unarchive" (O-09) |
| **D-04 Template change keeps manual items** | POD-08 D1, BR-041, FR-JW-23 AC2 | `…_change_template` deletes-by-supersession only **template-sourced** items (marks them `superseded_at`, never deletes) and re-derives from new template; manual items untouched (AD-WS13-002/006) | Default matched (PD-ARC-04) |
| **D-05 Vendor baseline** | POD-05, Spec v2.0 §20 | Additive columns on `workspace_vendors`: `vendor_code` (system-generated, unique, immutable), `service_type`, `destinations_served`, `address`, `contracted_rates_link` (https CHECK), `lifecycle_state` default `active` (AD-WS13-006 extended) | `lifecycle_state` only |
| **D-06 Change Category; Journey Document; Document Types** | POD-03, POD-04, BR-044, BR-045 | `change_category` required on Change Records; table named `workspace_journey_documents` with `document_type` code; lists in configuration (AD-WS13-006) | "Document Requirement", no Change Category; "service category" on bookings (O-03) |
| **D-07 Vendor Booking "service type"** | I-06 | Column `service_type` (not `service_category`) on bookings | "service category" (O-03) |

**Rad's position:** none of these makes implementation impossible or introduces significant risk; all are additive columns/validations inside existing ADs. I have planned them as stated. **Archie should record an alignment addendum** (a WS13-003 revision note), so the Architecture baseline and this plan agree before P0 code review (Condition C2).

---

## 3. Engineering Principles for WS13 (constraints Rad will follow)

1. **Extend, never recreate** bootstrap tables (`DEC-R1.3-013`). Additive migrations only; the only drop is the conversion RPC's 2-argument overload (Archie §5.3), flagged for explicit approval at migration review.
2. **Server is the authority.** Every lifecycle/ownership/status/archive rule is enforced in a self-authorising `SECURITY DEFINER` RPC; `validation.ts` mirrors it only for UI gating. Each transition table carries a comment naming its twin (existing `types.ts` ↔ CHECK convention).
3. **Derived, never stored:** readiness, counts, KPIs, next action, alert conditions, archive eligibility (AD-WS13-004).
4. **One derivation module** (`derivations.ts`, pure, no I/O) used by UI, Dashboard, cron and the reconciler.
5. **Configuration, not code,** for thresholds, windows, retention, time zone and every reference list (AD-WS13-006).
6. **Specific error codes** from every RPC, mapped to field-level messages (UX §9.3, §24).
7. **Business time zone** helper in SQL and TypeScript for every date gate and alert (default `Asia/Kolkata`, EP-09).
8. **No new npm dependency.** Stepper, drawers, segmented controls, chips and icons are Workspace-native inline SVG (UX §22).
9. **Sensitive references** (document external reference) masked server-side in list payloads, never written into audit `event_data` (WS13-003 §4.9).
10. **Next.js 16 rules:** read the relevant `node_modules/next/dist/docs/` guide before each new pattern (route handlers, `searchParams` as Promise, `proxy.ts` instead of middleware).

---

## 4. Implementation Phases

Each phase ends with Rad's engineering validation (lint, type-check, build, verify scripts, migration verification, diff review), then an independent Keerthi QA gate. A phase does not start until the previous phase's P1-severity defects are closed.

### P-A — Quick win: CM-03 (independent)

| Item | Detail |
|---|---|
| Objective | Remove "Create Journey" (D-09) and "My Work" (UX-01) from `WORKSPACE_QUICK_ACTIONS` in `components/workspace/dashboard/QuickActions.tsx`, leaving New Lead, Add Traveller, New Vendor in ratified order |
| Dependencies | None (Archie §5.5) |
| Outcome | FR-JW-05 AC1 satisfied on the Dashboard |
| Completion criteria | Three buttons remain; lint/build pass; no route or API touched; Keerthi spot check (desktop, tablet, mobile) |

### P0 — Foundation & Journey Planning entry point

| Item | Detail |
|---|---|
| Objectives | (1) Shared foundation extensions (users, audit, notifications, tasks). (2) Configuration store + seeded Release 1.3 defaults. (3) Vendor baseline (POD-05). (4) Journey schema extension + child tables + summary view + legacy backfill. (5) Conversion v2 with CM-01, CM-02 (linkage + supersession branch), CM-05 (owner-required, dates–nights block), CM-07 (Service Category). (6) Journey Planning UI: Decision dialog with dates + Service Category + error messages; optional Service Category capture; replacement banner. (7) Read-only modules: `settings`, `vendor-management`, user directory; deactivated users blocked. (8) `journey-workspace` types/validation/derivations skeleton + verify scripts. (9) Focused WS12 regression. |
| Dependencies | C1–C6 (§13); EP-02 **only** for the content-seed migration (M05b), not for schema |
| Outcome | A Confirmed decision in Journey Planning creates a fully-populated, owned, dated, categorised Journey with its POC and a `JRN-####` reference; SEC-01 closed; legacy rows flagged `legacy_pending` |
| Completion criteria | All P0 migrations applied to the development database with parity recorded (EP-08); every RPC exercised live (success + each error code); WS12 focused regression PASS (§11.2); no JP behaviour change other than the approved CM items; build/lint/verify green |

### P1 — Journey core

| Item | Detail |
|---|---|
| Objectives | JW-01 Active Journeys (summary strip, filters in URL, Mine/Team, sort), JW-02 sticky header + Overview (people cards, stepper, next step, summaries), JW-03 Itinerary snapshot, JW-08 History, JW-12 lifecycle dialogs (start preparation with template, advance, step back, hold, resume, cancel with vendor-cancellation tasks, Mark as Completed), JW-15 POC editor, JW-17 assign/reassign + legacy adoption panel, Service Category display/edit |
| RPCs delivered | `workspace_journey_transition`, `…_place_on_hold`, `…_resume`, `…_cancel`, `…_close`, `…_reassign`, `…_assign_template`, `…_set_service_category`, `…_adopt_legacy` |
| Dependencies | P0; Sophie addendum for Service Category placement and adoption panel fields (C3) |
| Outcome | A Journey can be operated through its whole lifecycle except bookings/documents/readiness items detail |
| Completion criteria | Action matrix (UX §9.3) verified server-side for owner, non-owner, Administrator; gates return field-specific codes; optimistic concurrency (`p_expected_stage`) rejects stale pages; audit events present for every action |

### P2 — Operational tabs

| Item | Detail |
|---|---|
| Objectives | JW-04/JW-16 Vendor Bookings (Active vendors only, service type, date-window warning, lifecycle, coordination log), JW-05 Readiness (template items, system items derived, manual items, N/A where permitted, change template), JW-07 Documents (Document Types, per traveller, status, masked reference, https link, no upload), JW-06 Tasks & Follow-ups (categories, follow-up due date, quick-add presets, owner can cancel), JW-09 Activity & Changes (communications, notes with correction, Change Records with Change Category, booking re-entry to Requested), alert **display** (banner, list indicator) from `derivations.ts` |
| RPCs delivered | `…_set_booking_status`, `…_record_change`, `…_change_template`; RLS writes via `workspace_can_edit_journey()` for single-row children |
| Dependencies | P1; **EP-02 content seeded** (template items, Document Types, Vendor Service Types); **EP-03 vendors loaded** |
| Outcome | Readiness gate (BR-028) becomes real; Ready to Travel reachable |
| Completion criteria | Booking transitions per §11.1 incl. re-entry; readiness state changes immediately on booking/document change; N/A only on permitted items; masked reference never in list payload or audit |

### P3 — Dashboard, archive and alert delivery

| Item | Detail |
|---|---|
| Objectives | Dashboard live KPIs (links to pre-filtered lists), panels (Needs Attention, Today, Upcoming Departures, Pending Vendor Bookings, Payments Due, Journey Planning, stage strip, Recent Activity) with My Work/Team; JP read functions for New Leads and JP panel; JW-11 Closed & Archived with Archive Eligible; JW-14 Archive (Administrator, no unarchive, irreversibility copy); notification reconciler + daily cron; IN-01…IN-06 delivery |
| Optional (EP-05) | Header bell, NOT-01 Notification Log, global search |
| RPCs delivered | `…_archive`, `workspace_reconcile_journey_alerts(journey_id)` (+ sweep variant) |
| Dependencies | P2; EP-04 (`CRON_SECRET`, Vercel plan, root directory); EP-05 scope decision |
| Completion criteria | KPI value = pre-filtered list size for every KPI; one active notification per condition; resolution on condition clear; cron authenticated and idempotent (running twice changes nothing) |

### P4 — Material change end to end

| Item | Detail |
|---|---|
| Objectives | JW-13 dialog ("Create Replacement Journey"), `…_start_material_change` RPC (hold + linked JP record with POD-06 Policy 3 defaults), On Hold replacement tracker (reads JP stage/outcome), supersession on conversion (already in conversion v2), IN-05 to both owners, History pins on both Journeys, E-10 handling |
| Dependencies | P1 (hold), P0 (conversion v2 branch) |
| Completion criteria | IF-08 end to end; original never Cancelled; at most one open replacement planning record per Journey; JP regression on the replacement record |

### P5 — Release hardening

Full WS13 regression, WS12 and WS11 regression packs, Sri traveller-experience review of internal flows (as scoped by Tiger), performance spot checks (§10.5), documentation updates (Engineering Decision Log, TECH-DEBT entries, architecture/UX doc revision notes as owned by Archie/Sophie), release readiness report. No new functionality.

---

## 5. Work Package Breakdown

Work packages (WP) are the unit an implementation EBC will reference. Sizes are relative (XS < S < M < L).

### P-A

| WP | Package | Main files | Size |
|---|---|---|---|
| WP-A1 | Remove two Quick Actions (CM-03) | `web/components/workspace/dashboard/QuickActions.tsx` | XS |

### P0 — Foundation & entry point

| WP | Package | Main files / objects | Size |
|---|---|---|---|
| WP-0.1 | User directory & deactivation (AD-WS13-007): `display_name`, `deactivated_at`, `workspace_user_directory()`; `requireWorkspaceUser()` and `authenticateWorkspaceApiRequest()` reject deactivated users; `displayName` prefers `display_name` | M01; `shared/auth/*`, `shared/rbac/guard.ts`, `shared/api/respond.ts`, new `shared/users/{types,repository,service}.ts` | S |
| WP-0.2 | Audit extension: WS13 event types, nullable actor for system events only (CHECK), feed index `(entity_type, created_at desc)` | M02; `shared/audit/types.ts` | S |
| WP-0.3 | Notification extension: `condition_key`, `resolved_at`, `resolution`, partial unique index; types/repository functions (`upsertActiveConditionNotification`, `resolveConditionNotifications`) | M03; `shared/notifications/*` | S |
| WP-0.4 | Task extension: `category`, `kind`, follow-up CHECK; types | M04; `shared/tasks-follow-ups/*` | S |
| WP-0.5 | Configuration store: `workspace_configuration`, readiness template tables, seeded Release 1.3 defaults that are already approved (§7); read module `lib/workspace/settings/` | M05; new `settings/{types,repository,service}.ts` | M |
| WP-0.6 | Vendor baseline (POD-05): additive columns, `vendor_code` sequence, `lifecycle_state`; read module `lib/workspace/vendor-management/` (`listActiveVendors`, `getVendorById`) | M06; new `vendor-management/*` | S |
| WP-0.7 | Journey schema extension (AD-WS13-001 + Service Category), reference sequence, `status` deprecated comment, legacy backfill | M07 | M |
| WP-0.8 | Journey child tables + `workspace_can_edit_journey()` + RLS (owner/admin, not terminal, **not archived**) | M08 | M |
| WP-0.9 | `workspace_journey_operational_summary` view (security_invoker) | M09 | M |
| WP-0.10 | Journey Planning evolution: `service_category`, `replaces_journey_id` + partial unique open-replacement index; conversion RPC v2 (drop 2-arg overload) | M10 | **L** |
| WP-0.11 | JP application changes: `service.ts` `recordJourneyPlanningDecision` passes dates; new error codes; create/edit accept optional `serviceCategory`; decision route body extended; Decision UI dialog (dates + Service Category + messages); Service Category field in JP; replacement banner | `journey-planning/*`, `app/api/workspace/journey-planning/**`, `JourneyPlanningRecordDetailView.tsx`, `NewJourneyPlanningRecordForm.tsx`, `TripBasicsPanel.tsx` | M |
| WP-0.12 | `journey-workspace` module skeleton: `types.ts`, `validation.ts` (transition tables, reason/reference rules), `derivations.ts` (pure), `repository.ts` read functions (list, detail, summary), business time-zone helper | new `lib/workspace/journey-workspace/*`, `shared/time/businessDate.ts` | M |
| WP-0.13 | Verify scripts: `verify:journey-workspace-derivations`, `verify:journey-workspace-transitions` + tsconfig | `web/package.json`, `tsconfig.journey-workspace-verification.json`, `lib/workspace/journey-workspace/validation/*` | S |
| WP-0.14 | Engineering validation of P0 + WS12 regression support | report | S |

### P1 — Journey core

| WP | Package | Size |
|---|---|---|
| WP-1.1 | Lifecycle RPCs (M11): transition (incl. step back), hold, resume, cancel (+ vendor cancellation tasks), close, reassign, assign template (derives items), set Service Category, adopt legacy | L |
| WP-1.2 | Service + API routes for P1 actions; error-code → message map | M |
| WP-1.3 | JW-01 list page: summary strip, filters/search/sort in URL, Mine/Team, row with next action, at-risk count, legacy marker | M |
| WP-1.4 | JW-02 header (people cards, stepper incl. compact variant, primary action, status banners) and Overview (next step, summaries, rail) | L |
| WP-1.5 | JW-12 dialogs; JW-17 assign/reassign + adoption panel; JW-15 POC editor; JW-03 itinerary; JW-08 History (pinned links, filters, paging 50) | M |
| WP-1.6 | Shared new primitives: stage badge, overlay chip, stepper, gated button (`aria-disabled`), status banner, side panel, dialog | M |

### P2 — Operational tabs

| WP | Package | Size |
|---|---|---|
| WP-2.1 | RPCs (M12): set booking status (transition table, reason/reference rules), record change (+ booking re-entry), change template (keep manual items) | M |
| WP-2.2 | Vendor Bookings tab + drawer (mini-stepper, Confirmed vs Booked, coordination log, add booking) | M |
| WP-2.3 | Readiness tab (categories, system/manual items, N/A, change template dialog) | M |
| WP-2.4 | Documents tab (by traveller / by document, segmented status, masked reference, link validation) | M |
| WP-2.5 | Tasks & Follow-ups tab (quick-add, presets, categories + icons, owner cancel policy) | M |
| WP-2.6 | Activity & Changes tab (communications, notes + correction, Change Record form with Change Category and material guard) | M |
| WP-2.7 | Alert display from `derivations.ts` (header banner, list indicator, deep links) | S |
| WP-2.8 | Content seed migration M05b (template items, Document Types, Vendor Service Types) and vendor seed script run (EP-02, EP-03) | S |

### P3 — Dashboard, archive, alert delivery

| WP | Package | Size |
|---|---|---|
| WP-3.1 | JP read functions for Dashboard (New Leads count, planning by stage) | S |
| WP-3.2 | Dashboard: live `KpiGrid` (links + captions), new panel component, eight panels, My Work/Team | L |
| WP-3.3 | JW-11 Closed & Archived + Archive Eligible; archive RPC (M13) + JW-14 dialog | M |
| WP-3.4 | Alert reconciler (SQL function + service call after each mutation) and informational notifications IN-01…06 | M |
| WP-3.5 | Daily cron: `vercel.json`, `app/api/workspace/cron/journey-alerts/route.ts`, `CRON_SECRET` bearer check, service-role client **server-only** | S |
| WP-3.6 *(EP-05, optional)* | Header bell + NOT-01; global search across Journeys/Travellers/JP records | L |

### P4 — Material change

| WP | Package | Size |
|---|---|---|
| WP-4.1 | `…_start_material_change` RPC (M14) | S |
| WP-4.2 | JW-13 dialog, replacement tracker, Superseded banner/pins, replacement chip | S |
| WP-4.3 | IN-05 to both owners; E-10 display | XS |

### P5 — Hardening

| WP | Package | Size |
|---|---|---|
| WP-5.1 | Full regression support, performance checks, TECH-DEBT entries, Engineering Decision Log, final engineering report | S |

---

## 6. Migration Strategy

### 6.1 Rules

- One migration per concern, named `2026MMDDHHMMSS_workspace_<module>_<change>.sql`, each with a header naming the EBC, AD and BR/FR it implements (existing convention).
- **Additive only.** `add column if not exists`, `create … if not exists`, CHECK constraints added with explicit names. The only destructive statement in WS13 is `drop function public.workspace_convert_journey_planning_record(uuid, uuid)` inside M10 — **requires explicit Product Owner approval at migration review** (Archie §5.3).
- Reference-list **schema** and **content** are separate migrations, so schema never waits for content and content is never fabricated (M05 vs M05b).
- Vendor records are **business data**, loaded by an idempotent script, never by migration (Archie §5.1 Option A).
- Supabase migrations have no "down" files. **Rollback = a reviewed forward-fix migration.** For each migration the implementation report includes a rollback note (what the forward-fix would do).
- Apply order = file order. Migrations are applied by the Product Owner (Claude has no CLI token, RF-06); parity is recorded with `npx supabase migration list --linked` before every QA cycle (EP-08).

### 6.2 Ordered migration list

| # | Phase | Migration (indicative name) | Content | Backward-compatible with current deployed code? |
|---|---|---|---|---|
| M01 | P0 | `…_workspace_users_directory_and_deactivation` | `display_name`, `deactivated_at`; `workspace_user_directory()` (SECURITY DEFINER, returns id, display name, role, is_active; no email) | ✅ yes |
| M02 | P0 | `…_workspace_audit_log_ws13_events` | Extend event-type CHECK (Journey events: `journey_created`… see §6.4); `actor_id` nullable **only** for `alert_raised`, `alert_resolved`, `legacy_backfilled` (CHECK); index `(entity_type, created_at desc)` | ✅ |
| M03 | P0 | `…_workspace_notifications_condition_keys` | `condition_key`, `resolved_at`, `resolution` CHECK; partial unique index `(condition_key, recipient_user_id) where resolved_at is null and condition_key is not null` | ✅ |
| M04 | P0 | `…_workspace_tasks_category_and_kind` | `category text null`, `kind text not null default 'task'` CHECK (`task`,`follow_up`), CHECK `kind <> 'follow_up' or due_at is not null` | ✅ (existing rows `task`, category null → shown as Operational) |
| M05 | P0 | `…_workspace_settings_configuration` | `workspace_configuration`; `workspace_readiness_templates`, `workspace_readiness_template_items` (category CHECK over 4, `requirement` `mandatory`/`optional`, `allows_not_applicable`, `item_kind` `system`/`manual`, `system_rule`, `document_type`); seed approved defaults (§7.2); Domestic + International template **headers** | ✅ |
| M05b | **P2** (content-gated) | `…_workspace_settings_reference_content` | Template items, Document Types per category, Vendor Service Types — **only Product Owner–supplied content** (EP-02) | ✅ |
| M06 | P0 | `…_workspace_vendors_baseline` | `vendor_code` (sequence-based, unique, immutable via trigger), `service_type`, `destinations_served text[]`, `address`, `contracted_rates_link` (https CHECK), `lifecycle_state` CHECK default `active` | ✅ |
| M07 | P0 | `…_workspace_journeys_lifecycle_extension` | AD-WS13-001 columns + `service_category`; `workspace_journey_reference_seq` (start 1001); integrity CHECKs; `status` comment "deprecated (TD-WS13-001)"; **legacy backfill** (§6.5) | ❌ **Coupled** — see §6.6 |
| M08 | P0 | `…_workspace_journey_child_tables` | `workspace_journey_operational_contacts` (partial unique `is_primary`), `…_vendor_bookings` (status CHECK, `status_changed_at`, `booking_reference` required when `booked`, `service_type`), `…_readiness_items` (source `template`/`manual`, `superseded_at`), `…_documents` (`document_type`, traveller text/ref, status CHECK, `external_reference`, `external_link` https CHECK), `…_change_records` (`change_category` required, `requested_by` CHECK), `…_activities` (kind `communication`/`note`/`vendor_coordination`, optional `vendor_booking_id`, `corrects_activity_id`); `workspace_can_edit_journey(uuid)`; RLS: SELECT all authenticated; INSERT/UPDATE via helper; **no DELETE grants** | ✅ (new objects) |
| M09 | P0 | `…_workspace_journey_operational_summary_view` | View per AD-WS13-004, `security_invoker = true`, business-date helper `workspace_business_today()` reading configuration | ✅ |
| M10 | P0 | `…_workspace_journey_planning_conversion_v2` | JP `service_category`, `replaces_journey_id` (+ partial unique: one **open** replacement per Journey); `drop function` 2-arg; `create function` v2 (§6.3) | ❌ **Coupled** with M07 and the JP code change |
| M11 | P1 | `…_workspace_journey_lifecycle_rpcs` | transition, hold, resume, cancel, close, reassign, assign_template, set_service_category, adopt_legacy | ✅ |
| M12 | P2 | `…_workspace_journey_operations_rpcs` | set_booking_status, record_change, change_template; additive permissive task policy `workspace_tasks_update_journey_owner` (entity_type `journey` and `workspace_can_edit_journey(entity_id)`) | ✅ |
| M13 | P3 | `…_workspace_journey_archive_and_alerts` | archive RPC (no unarchive); `workspace_reconcile_journey_alerts(uuid)` and sweep function | ✅ |
| M14 | P4 | `…_workspace_journey_material_change` | `workspace_journey_start_material_change` | ✅ |

Audit event-type CHECK: extended **once in M02** with the complete WS13 list (so later phases do not need to drop/re-add the constraint again).

### 6.3 Conversion RPC v2 — engineering specification

Signature: `workspace_convert_journey_planning_record(p_record_id uuid, p_actor_id uuid, p_confirmed_start_date date, p_confirmed_end_date date) returns uuid`, `SECURITY DEFINER`, `set search_path = public`.

Order of checks (each raises a distinct code, `errcode 'P0001'` unless noted):

1. `p_actor_id is distinct from auth.uid()` → `workspace_conversion_actor_mismatch` (28000, unchanged).
2. Lock record `for update`; not found → `…_record_not_found` (P0002, unchanged).
3. Caller is owner or Administrator (`workspace_current_user_role()`), and caller not deactivated → `workspace_conversion_not_authorised` (**fixes SEC-01**).
4. Stage = `decision` → `…_not_in_decision_stage` (unchanged).
5. Not already converted → `…_already_converted` (unchanged).
6. `owner_id is not null` → `workspace_conversion_owner_required` (BR-026, POD-06 P1).
7. Both dates present → `workspace_conversion_dates_required`; `end >= start` → `workspace_conversion_dates_invalid` (BR-027).
8. `nights is not null` and `(p_end − p_start) = nights` → otherwise `workspace_conversion_dates_nights_mismatch` (POD-06 P2, I-05). **Null nights → `workspace_conversion_nights_required`** (see ENG-OBS-02).
9. `service_category is not null` and value in the configured list → `workspace_conversion_service_category_required` / `…_invalid` (BR-043, POD-07).
10. Replacement branch: if `replaces_journey_id is not null`, the original must be `on_hold = true` and not terminal → `workspace_conversion_original_not_on_hold`.

Writes (same transaction): insert Journey (party, owner, destination, trip parameters, Service Category, `accepted_proposal_version_id = workspace_proposals.current_version_id`, dates, `journey_reference`, `stage='confirmed'`, `stage_changed_at`, `adoption_status='adopted'`, `supersedes_journey_id` when replacement); insert primary POC from party (I-04); close planning record (`closed`/`confirmed`, existing behaviour); if replacement → original `outcome='superseded'`, `outcome_reason='Material Amendment'`, `on_hold=false`; audit: existing two planning-record entries (the `record_converted` entry now includes the dates and `journey_id`) + `journey_created` on the Journey + (replacement) `journey_superseded` on the original; notifications IN-01 (owner) and IN-05 (both owners, replacement case). Returns the Journey id.

Application: `repository.convertJourneyPlanningRecordToJourney(supabase, recordId, actorId, start, end)`; `service.recordJourneyPlanningDecision` validates dates/nights/category **before** the RPC for field-level messages (several at once, PRA-01 precedent) and maps RPC codes to 400/403/409.

### 6.4 WS13 audit event types (M02)

`journey_created`, `journey_stage_changed`, `journey_stage_stepped_back`, `journey_on_hold`, `journey_resumed`, `journey_cancelled`, `journey_closed`, `journey_superseded`, `journey_reassigned`, `journey_archived`, `journey_service_category_changed`, `journey_contact_changed`, `journey_template_assigned`, `journey_template_changed`, `journey_legacy_adopted`, `readiness_item_updated`, `vendor_booking_created`, `vendor_booking_status_changed`, `vendor_booking_updated`, `document_added`, `document_status_changed`, `document_updated`, `document_reference_updated` (no values stored), `change_record_created`, `activity_logged`, `note_added`, `material_change_started`, `alert_raised`, `alert_resolved`, `legacy_backfilled`. Existing `task_created`/`task_updated` reused with `entity_type='journey'`. Exact list reviewed against UX §21 filters at P0 code review.

### 6.5 Legacy Journey backfill (inside M07; BR-036, AD-WS13-001)

- Handles **0..N** rows (count unknown per environment, A-JW-04).
- Derivable only: `owner_id` ← planning owner (may be null); destination, trip parameters ← planning record; `accepted_proposal_version_id` ← current version; `journey_reference` in creation order; POC ← party (backfilled at the end of M08, once the contact table exists).
- **Not derivable, left null:** confirmed dates, Readiness Template, **Service Category** (ENG-OBS-03).
- All pre-existing rows → `adoption_status='legacy_pending'`, `stage='confirmed'`; one `legacy_backfilled` audit entry each (system actor).
- AL-02 notifications for legacy rows are raised by the first reconciler run (P3). **Until P3, legacy Journeys are visible with the "Incomplete legacy record" marker and adoptable in P1** — acceptable because AL-02 is a reminder, not the adoption mechanism.

### 6.6 Deployment coupling and runbook (R-07)

**Fact:** after M07 the old conversion RPC would violate the new owner/dates CHECKs; after M10 the old 2-argument function no longer exists, so the currently deployed JP code (`repository.ts:261`) would fail on Confirmed.

| Step | Action | Owner |
|---|---|---|
| 1 | Confirm environment topology (ENV-01): which Vercel environments point at `SearchMyVacation_WebsiteUpgrade`, and whether production users use Journey Planning today | Product Owner |
| 2 | Merge-ready branch reviewed; migration review approves the M10 function drop | Rad → Tiger → Product Owner |
| 3 | **Freeze window:** no one records a Journey Planning *Confirmed* decision (Lost/Archived unaffected until M10 applied) | Product Owner |
| 4 | Apply M01–M10 in one `supabase db push` | Product Owner |
| 5 | Deploy the P0 application build to every environment using that database, immediately | Product Owner (Vercel) |
| 6 | Smoke: record Confirmed on a test planning record; verify Journey row, POC, audit, IN-01 | Rad |
| 7 | Record parity (`migration list`) in the P0 report | Product Owner / Rad |

If the database is **shared with a production deployment** and a freeze window is unacceptable, the alternative (engineering option, no architecture change) is a **two-release expand/contract**: ship M01–M09 + v2 **alongside** the old overload, deploy code, then drop the old overload in a follow-up migration. This contradicts Archie's "drop in the same migration" instruction, so it is **offered for Archie's decision only if ENV-01 requires it** (ENG-DEC-01).

---

## 7. Configuration Strategy

### 7.1 Where each reference list lives

| Reference data | Store | Key | Values source | Status |
|---|---|---|---|---|
| Service Categories | `workspace_configuration` `service_categories` | list of `{code,label,active,sort}` | POD-02 (7 values) **[B]** | Seed in M05 |
| Document Type categories | `workspace_configuration` `document_type_categories` | as above | POD-03 (7 values) **[B]** | Seed in M05 |
| Document Types | `workspace_configuration` `document_types` | `{code,label,category,active,sort}` | **Product Owner content (EP-02)** | M05b |
| Vendor Service Types | `workspace_configuration` `vendor_service_types` | `{code,label,active,sort}` | **Product Owner content (EP-02 / POD-05)** | M05b |
| Change Categories | `workspace_configuration` `change_categories` | as above | POD-04 (7 values) **[B]** | Seed in M05 |
| Task categories | `workspace_configuration` `task_categories` | `{code,label,kind_default,alert}` | FR-JW-24 minimum: Operational, Traveller follow-up, Payment **[B]** | Seed in M05 |
| Readiness Templates | `workspace_readiness_templates` | `code`, `name`, `active` | Domestic, International **[B]** | Headers in M05 |
| Readiness Template items | `workspace_readiness_template_items` | per template/category | **Product Owner content (EP-02)** incl. Mandatory/Optional/N-A-permitted, system rules, Document Type mapping | M05b |
| Alert thresholds & windows | `workspace_configuration` `alert_thresholds` | per AL id | WS13-001 §16 defaults **[B]** | Seed in M05 |
| Departure window, archive retention (60 d), business time zone | `workspace_configuration` | single keys | §16/§17, D-08 **[B]**, EP-09 **[A]** `Asia/Kolkata` | Seed in M05 |

**Why a coded list in configuration (not free text):** stored rows reference a stable `code`; labels can change without data migration; retiring a value sets `active=false` (never deleted), so historic Journeys still render. Validation: SQL helper `workspace_config_has_code(p_key text, p_code text, p_active_only boolean)` used inside RPCs/CHECK-free validation, mirrored by `settings/service.ts` for UI option lists.

### 7.2 Seeding and maintenance

- **Seed:** approved values in M05; content in M05b once supplied. Seeds are `insert … on conflict (key) do nothing` so re-running never overwrites an Administrator's later change.
- **Maintenance in Release 1.3:** no UI (DEP-12). An Administrator changes a value by a documented SQL snippet in the Supabase dashboard; Rad will provide a one-page runbook (`docs/…/WORKSPACE-CONFIGURATION-RUNBOOK.md`) in P5 listing each key, its shape and safe-change rules. Configuration changes take effect on next request (no cache) — config is read per request via one query per page (small table).
- **Validation of configuration shape:** `settings/validation.ts` parses each key defensively; an invalid value falls back to the seeded default and logs a server warning (never crashes a page).
- **Vendors:** `web/scripts/workspace/seedVendors.ts` (built like existing `scripts/*` generators), reads a CSV exported from the Product Owner spreadsheet, **upserts by normalised Vendor Name** for the initial load (Vendor Code is system-generated and cannot be known beforehand), runs with the service-role key locally by the Product Owner, prints a dry-run diff first. Never committed with data. Existing vendor rows default `active` (POD-05).

---

## 8. API Strategy

### 8.1 Existing endpoints that evolve (Journey Planning)

| Endpoint | Change | Phase |
|---|---|---|
| `POST /api/workspace/journey-planning/[recordId]/decision` | Body adds `confirmedStartDate`, `confirmedEndDate` (required when `outcome='confirmed'`); new 400/403/409 codes: `owner_required`, `dates_required`, `dates_invalid`, `dates_nights_mismatch`, `nights_required`, `service_category_required`, `service_category_invalid`, `not_authorised`, `original_not_on_hold`; response unchanged (`record`, `journeyId`) | P0 |
| `POST /api/workspace/journey-planning` | Optional `serviceCategory` | P0 |
| `PATCH /api/workspace/journey-planning/[recordId]/trip-basics` | Optional `serviceCategory` (location per Sophie's addendum; may instead be its own field route) | P0 |
| `GET /api/workspace/journey-planning/[recordId]` | Returns `serviceCategory`, `replacesJourneyId`, `replacesJourneyReference`, `journeyId` (if converted) | P0 |
| New JP read functions (service-level, no route) | `countNewLeads(scope)`, `countPlanningByStage(scope)` for Dashboard | P3 |

No other JP endpoint changes. Lost/Archived decision paths unchanged.

### 8.2 New Journey Workspace endpoints

All under `app/api/workspace/journey-workspace/`, `runtime = "nodejs"`, `authenticateWorkspaceApiRequest()`, JSON `{ ok, … }` / `{ ok:false, code, message, fieldErrors? }`, `Cache-Control: no-store`. Mutations call RPCs (lifecycle/multi-row) or RLS-guarded inserts (single-row children).

| Route | Methods | Purpose | Phase |
|---|---|---|---|
| `/` | GET | List (filters, search, sort, scope) from summary view | P1 |
| `/summary-counts` | GET | Summary strip / tab badges | P1 |
| `/[journeyId]` | GET | Detail (header, overview data) | P1 |
| `/[journeyId]/transition` | POST | Advance or step back (`toStage`, `expectedStage`, note) | P1 |
| `/[journeyId]/hold`, `/resume`, `/cancel`, `/close` | POST | Lifecycle | P1 |
| `/[journeyId]/reassign` | POST | Owner change | P1 |
| `/[journeyId]/service-category` | PATCH | BR-043 | P1 |
| `/[journeyId]/contact` | PATCH | POC | P1 |
| `/[journeyId]/template` | POST (assign) / PUT (change) | BR-041 | P1 / P2 |
| `/[journeyId]/adopt` | POST | Legacy adoption (Admin) | P1 |
| `/[journeyId]/history` | GET | Timeline (paged 50) | P1 |
| `/[journeyId]/itinerary` | GET | Accepted Proposal Version snapshot | P1 |
| `/[journeyId]/bookings` | GET, POST | List, create Draft (Active vendor only) | P2 |
| `/[journeyId]/bookings/[bookingId]` | PATCH | Non-status fields | P2 |
| `/[journeyId]/bookings/[bookingId]/status` | POST | Lifecycle | P2 |
| `/[journeyId]/bookings/[bookingId]/coordination` | POST | FR-JW-18 | P2 |
| `/[journeyId]/readiness-items` | GET, POST; `/[itemId]` PATCH | Manual items, status, N/A | P2 |
| `/[journeyId]/documents` | GET, POST; `/[documentId]` PATCH, GET (full reference, owner/admin only) | Document Readiness | P2 |
| `/[journeyId]/tasks` | GET, POST; `/[taskId]/status` POST | Tasks & follow-ups | P2 |
| `/[journeyId]/activities` | GET, POST | Communications, notes | P2 |
| `/[journeyId]/change-records` | GET, POST | Change Records | P2 |
| `/[journeyId]/archive` | POST | Admin | P3 |
| `/[journeyId]/material-change` | POST | Start replacement | P4 |
| `/reference-data` | GET | Configuration option lists for pickers | P0 |
| `/api/workspace/vendors/active` | GET | Active vendor picker | P2 |
| `/api/workspace/users/directory` | GET | Assign/reassign picker, owner names | P1 |
| `/api/workspace/cron/journey-alerts` | GET | Vercel cron; `Authorization: Bearer ${CRON_SECRET}`; not callable by users | P3 |
| *(EP-05)* `/api/workspace/notifications`, `/api/workspace/search` | GET/POST | Bell, NOT-01, global search | P3 optional |

**No create route for Journeys exists or may be added (FR-JW-05).** No DELETE method on any Journey route (BR-033, FR-JW-31). No unarchive route (POD-08).

### 8.3 Permissions and validation

- **Defence in depth:** route → service (`permissions.ts` for fast 403 and field messages) → RPC/RLS (authoritative). Archived Journeys rejected at every layer (`journey_archived`).
- **Team scope:** Administrator-only until OQ-001/UXO-08 decided (conservative default, UX §6.3); implemented as a single `canViewTeamScope(role)` function so the decision is a one-line change.
- Task completion: assignee, creator, Journey owner (new additive policy) or Administrator.
- Error codes are enumerated in `journey-workspace/types.ts` and mapped to copy in one client file (`journeyWorkspaceMessages.ts`).

---

## 9. UI Implementation Strategy

### 9.1 Structure

```
web/app/workspace/(dashboard)/journey-workspace/page.tsx                 JW-01 (replaces ComingSoon)
web/app/workspace/(dashboard)/journey-workspace/closed/page.tsx          JW-11
web/app/workspace/(dashboard)/journey-workspace/[journeyId]/page.tsx     JW-02…JW-09 via ?tab=
web/components/workspace/journey-workspace/
   list/        JourneyListView, SummaryStrip, JourneyFilters, JourneyRow
   journey/     JourneyHeader, PeopleCards, LifecycleStepper, StatusBanner, AlertBanner, JourneyTabs
   tabs/        OverviewTab, ItineraryTab, BookingsTab, ReadinessTab, DocumentsTab, TasksTab, ActivityTab, HistoryTab
   panels/      BookingDrawer, ContactEditor, AddBookingPanel, AddDocumentPanel
   dialogs/     LifecycleDialog (config-driven per action), MaterialChangeDialog, ArchiveDialog, AssignDialog, AdoptionPanel, TemplateDialog
   journeyWorkspaceLabels.ts, journeyWorkspaceMessages.ts
web/components/workspace/shared/   (only primitives reused by more than one module) StageBadge base, OverlayChip, GatedButton, SidePanel, Dialog, DashboardPanel
```

- **Page pattern:** server component calls `requireWorkspaceUser()` and renders a client view that loads data through the API (same as Journey Planning). Tabs load on selection; header loads once.
- **URL state:** tab, item, filters, sort and scope live in `searchParams` (UX §20); Dashboard deep links (`?tab=bookings&item=…`) come from `derivations.ts`.
- **Gating:** one function `getAvailableJourneyActions(journey, summary, user)` in `derivations.ts` drives the header primary action, More menu, disabled reasons and the non-owner line (UXD-JW-06/15/17).
- **Labels:** data values never appear in UI; `journeyWorkspaceLabels.ts` maps `journey_closed` → **Completed**, "Mark as Completed" (UX-04, UX-08).
- **Design system:** existing tokens only; inline 14 px SVG icons (UX-06); `aria-disabled` gated buttons; ARIA tabs; focus-trapped dialogs; `prefers-reduced-motion` respected.
- **Responsive:** desktop and laptop fully specified; tablet reflow; phone "must not break" (UX §23).

### 9.2 Build sequence by module

| Order | Module | Phase | Key UX refs | Depends on |
|---|---|---|---|---|
| 1 | Dashboard Quick Actions (CM-03) | P-A | §6.5 | — |
| 2 | JP Decision dialog, Service Category field, replacement banner | P0 | UXO-11, CM-07 addendum | Sophie addendum (C3) |
| 3 | **Journey Workspace** list (JW-01) + search/filters (JW-10) | P1 | §7, §20 | view (M09) |
| 4 | Journey header, stepper, Overview, Itinerary, History, POC, assign/reassign, **Service Category** edit, legacy adoption | P1 | §8, §9, §13, §16, §21 | M11 |
| 5 | **Vendor Booking enhancements** (JW-04/16) | P2 | §11 | vendors seeded, M12 |
| 6 | **Readiness** (JW-05) | P2 | §12.1 | template content (M05b) |
| 7 | **Journey Documents** (JW-07) | P2 | §12.2 | Document Types (M05b) |
| 8 | **Tasks** (JW-06) | P2 | §10 | M04, M12 policy |
| 9 | Activity & Changes (JW-09) incl. Change Category | P2 | §8.7, §14.1 | M08 |
| 10 | Alert banners and list indicators | P2 | §17 | derivations |
| 11 | **Dashboard updates** (KPIs, panels, scope) | P3 | §6 | P1–P2 data |
| 12 | **History** extras (alert events), **Archive** (JW-11, JW-14, no unarchive) | P3 | §15, §21 | M13 |
| 13 | **Notifications** delivery (+ bell/NOT-01 if EP-05) | P3 | §17 | M03, M13, cron |
| 14 | Material change (JW-13) | P4 | §14 | M14 |

### 9.3 UX items needing Sophie's addendum before build (not redesign)

| # | Item | Why | Needed by |
|---|---|---|---|
| UXA-01 | JP Decision dialog: date fields, Service Category, messages for owner-required, dates, **dates–nights mismatch block**, nights-required | CM-01, CM-05, CM-07; POD-06 P2 overrides the UX "warn" hint | P0 |
| UXA-02 | Where Service Category is captured in JP (create form / Trip Basics) and shown/edited on the Journey (header meta? Overview facts?) with History entry | POD-02/07; not in UX Rev 3 (O-02) | P0 / P1 |
| UXA-03 | Archive dialog: remove "You can unarchive it later" and the Unarchive action; add irreversibility statement | POD-08, O-09, O-10 | P3 (copy known now) |
| UXA-04 | Change Record form: UX §14.1 shows five operational options; POD-04 defines seven Change Categories. Confirm the picker shows Change Categories while the material guard sentence stays | POD-04, BR-045 | P2 |
| UXA-05 | Legacy adoption panel: add Service Category (BR-043 requires one per Journey) | ENG-OBS-03 | P1 |
| UXA-06 | Vendor Booking "service type" label and picker source | I-06 | P2 |

---

## 10. Testing Strategy

### 10.1 Engineering validation (every WP, before hand-over)

`npm run lint`; `npx tsc --noEmit` (via `npm run build`); `npm run build`; relevant `verify:*` scripts; `git diff` review for secrets, unrelated changes and generated files; migration header and naming check; results reported exactly (Project Instructions §28).

### 10.2 Unit-level verification (existing repository style, no new framework)

| Script (new) | Covers |
|---|---|
| `verify:journey-workspace-transitions` | `validation.ts` transition tables: every allowed/invalid pair of WS13-001 §10.2 and §11.1; reason/reference requirements; On Hold allowed stages; terminal detection; archived rejection |
| `verify:journey-workspace-derivations` | `derivations.ts`: readiness state (Mandatory applicable only; Optional never blocks; N/A permitted only), At Risk window, next action per stage (UX §8.2 table), alert conditions AL-02…AL-16 incl. On Hold suspension and terminal resolution, deep-link targets, KPI membership rules, archive eligibility |
| `verify:journey-workspace-dates` | Business-date helper around IST midnight (UTC 18:30), start/end-date gates, departure window, dates–nights consistency (I-05) |
| `verify:journey-workspace-config` | Configuration parsing and fallback behaviour |

Adding a unit-test framework (e.g. Vitest) is **not** proposed: it would be a new dependency needing Archie + Product Owner approval, and the `verify:*` style already covers pure logic (TD-R1.3-002 remains the place to decide that).

### 10.3 Database / RPC verification (the critical gap)

There is **no local Supabase stack** and Claude has **no CLI token** (RF-06). RPC and RLS behaviour can only be proven against a live Postgres. Options:

| Option | Description | Assessment |
|---|---|---|
| **A (recommended)** | Product Owner applies migrations to the development project; Rad runs a **scripted RPC contract checklist** through the application (API routes) with three test identities: Administrator, owner Workspace User, non-owner Workspace User. Each RPC: success path + every error code. Evidence captured in the report. | No new tooling; matches WS12-010V precedent (runtime proof). Writes test data into the dev project — test records are named `QA-WS13-…` and archived afterwards, never deleted. |
| B | Local Supabase via CLI + Docker for migration dry runs and SQL tests | Strongest isolation; needs Docker on the Mac and Product Owner approval of new local tooling (ENG-DEC-02) |
| C | Separate staging Supabase project | Cleanest long-term; cost/ops decision for the Product Owner |

Plus, for each migration: **schema introspection checklist** (columns, CHECKs, indexes, grants, policies via `information_schema`/`pg_policies` queries the Product Owner can run in the SQL editor) and **RLS negative tests** (non-owner insert/update rejected; archived Journey rejected; direct `insert into workspace_journeys` rejected for `authenticated`).

### 10.4 Integration testing (per phase)

End-to-end flows executed by Rad in the browser before QA hand-over: UF-02 (conversion → Journey), UF-03, UF-04, UF-05, UF-07, UF-09, UF-10, UF-11, UF-12, UF-14, IF-01…IF-14, on desktop and tablet widths, plus phone "must not break". Cron route invoked manually with and without the bearer secret.

### 10.5 Performance checks

Internal tool scale (AD-WS11-001/005). Checks in P3/P5: summary view `EXPLAIN` for list and KPI queries with seeded volume (≈ 200 Journeys, ≈ 2,000 child rows) — target < 300 ms per page query; indexes on every child `journey_id`, `workspace_journey_vendor_bookings (status)`, `workspace_journeys (stage, archived_at, owner_id)`, `(confirmed_start_date)`; Dashboard panels load independently; cron sweep time for all active Journeys well under the function timeout.

### 10.6 QA support for Keerthi

Per phase Rad provides: build/branch/commit id, migration parity evidence, test identities (created by the Product Owner; credentials never handled by Claude), seeded QA data list, the error-code catalogue, the action matrix (UX §9.3) and known limitations.

---

## 11. Regression Strategy

### 11.1 Approach

Risk-based: every shared object WS13 touches gets a targeted regression pack; packs run at the phase that changes the object and again in P5.

### 11.2 WS12 Journey Planning — focused regression (P0 gate, again in P4 and P5)

| # | Scenario | Expected |
|---|---|---|
| R12-01 | Decision = Confirmed, owner set, valid dates, nights consistent, Service Category set | Journey created (Confirmed, owner, dates, category, reference, POC); JP closed/confirmed; audit on both entities; IN-01 |
| R12-02 | Confirmed with no owner (Administrator acting) | Rejected: owner required; nothing written |
| R12-03 | Missing date / End < Start | Rejected with field messages |
| R12-04 | Dates inconsistent with nights; nights null | Blocked; no auto-correction |
| R12-05 | Service Category missing / inactive value | Rejected |
| R12-06 | Non-owner Workspace User calls the decision route / RPC directly | 403 (SEC-01 closed) |
| R12-07 | Decision Lost / Archived | Unchanged behaviour |
| R12-08 | Double submit Confirmed | Second call rejected `already_converted` |
| R12-09 | Create JP record with/without Service Category; edit it | Saved; optional |
| R12-10 | Trip Basics edit, Discovery gate, stage advance, claim, reassign (+ notification), proposal versions, vendor quotations, planning activities, JP tasks | Unchanged (WS12-014/017 packs re-run) |
| R12-11 | JP History and audit entries | Unchanged plus new `record_converted` payload fields |
| R12-12 | Existing JP tasks after M04 | Displayed; category null treated as Operational |

### 11.3 WS11 Foundation regression (P0, P5)

Sign-in, sign-out, password reset, unauthorised redirect, **deactivated user blocked** (new), navigation (desktop + mobile overlay), Dashboard renders, Quick Actions three items, header/user menu.

### 11.4 Public website smoke (P0, P5)

WS13 changes no public route or shared library, but shares the Supabase project and the Next build. Smoke: Homepage, Journey Passport flow to lead submission (no OTP send in QA), destination pages; `npm run build` includes all public routes.

### 11.5 WS13 cumulative regression

Each phase re-runs the previous phases' WS13 acceptance checks (lifecycle matrix, booking transitions, readiness gate, alerts). P5 runs the full set across desktop/tablet and the phone must-not-break check.

---

## 12. Dependency Matrix

### 12.1 Work-package dependencies

| WP | Depends on | Blocks |
|---|---|---|
| WP-A1 | — | — |
| WP-0.1 Users | C1 | WP-1.3/1.4/1.5 (owner names, picker), AL-16 |
| WP-0.2 Audit | C1 | every WS13 write |
| WP-0.3 Notifications | C1 | WP-0.10 (IN-01), WP-3.4 |
| WP-0.4 Tasks | C1 | WP-1.1 (cancel tasks), WP-2.5 |
| WP-0.5 Config | C1; approved defaults; EP-09 | WP-0.7/0.9/0.10 (category, time zone), all pickers |
| WP-0.6 Vendors | C1 | WP-2.2 |
| WP-0.7 Journeys ext. | WP-0.5 | WP-0.8–0.10 |
| WP-0.8 Children | WP-0.7 | WP-0.9, P1–P2 |
| WP-0.9 View | WP-0.8, WP-0.5 | P1 list, P3 Dashboard |
| WP-0.10 Conversion v2 | WP-0.7, WP-0.8, WP-0.3; migration approval of drop | WP-0.11; **deploy coupling** |
| WP-0.11 JP app | WP-0.10; UXA-01/02 | WS12 regression |
| WP-0.12/0.13 Module skeleton, verify | WP-0.5 | P1+ |
| WP-1.x | P0 gate; UXA-02, UXA-05 | P2 |
| WP-2.x | P1 gate; **EP-02 content (M05b)**; **EP-03 vendors**; UXA-04, UXA-06 | P3 |
| WP-3.x | P2 gate; EP-04; EP-05 (for 3.6); UXA-03 | P5 |
| WP-4.x | P1 (hold), P0 (conversion branch) | P5 |
| WP-5.1 | P3, P4 | Release decision |

### 12.2 External and governance dependencies

| ID | Dependency | Owner | Needed by | Blocking? |
|---|---|---|---|---|
| C1 | AD-WS13-001–007 ratification recorded (register still says **Proposed**) | Tiger / Product Owner | P0 start | **Yes** |
| C2 | Archie alignment note for §2.4 deltas (and ENG-DEC-01 if needed) | Archie | P0 code review | **Yes** |
| C3 | Sophie addenda UXA-01, UXA-02 (UXA-03…06 by their phases) | Sophie | P0 / per phase | **Yes** for P0 |
| C4 | Environment topology ENV-01; who applies migrations; Vercel project root directory | Product Owner | P0 deploy | **Yes** |
| C5 | Clean baseline: commit WS13 documentation, then create `feature/ws13-journey-workspace` (or per-phase `feature/EBC-R1.3-WS13-0xx-…`) | Product Owner | P0 start | **Yes** |
| C6 | EP-09 time zone `Asia/Kolkata` confirmed | Product Owner | P0 (M05 seed) | Yes (trivial) |
| EP-02 | Content: template items (with Mandatory/Optional/N-A flags, system items, Document Type mapping), Document Types, Vendor Service Types | Arjun → Product Owner | P2 (M05b) | P2 only |
| EP-03 | Vendor spreadsheet (dev + prod) | Product Owner | P2 verification | P2 only |
| EP-04 | `CRON_SECRET` in Vercel (Production + Preview); plan permits daily cron | Product Owner | P3 | P3 only |
| EP-05 | Scope: bell, NOT-01, global search | Tiger → Product Owner | P3 planning | P3 only |
| EP-06 | Vendor Code format (ENG-OBS-04); null-nights rule (ENG-OBS-02); Service Category on legacy adoption (ENG-OBS-03); Team scope (UXO-08) | Arjun → Product Owner | P0/P1 | No (defaults stated) |
| EP-07 | 001C record; repo WS13-002 → Rev 3 | Tiger | Before P0 review | No |
| EP-08 | Migration parity recorded each QA cycle | Product Owner | Every QA cycle | Yes per cycle |
| QA-IDs | Three test identities (Admin, owner WU, non-owner WU) in dev | Product Owner | P0 verification | Yes for P0 verification |

---

## 13. Engineering Readiness Assessment

| Area | Status | Evidence |
|---|---|---|
| Baseline understood (Product Rev 3, UX Rev 3, Architecture) | ✅ | §2, §2.4 |
| Repository reviewed; architecture gaps reproduced | ✅ | §2.1–2.2 |
| Technical approach feasible with current stack, no new dependency | ✅ | §3, §9 |
| Migration order and coupling understood | ✅ | §6 |
| Test approach defined within repository conventions | ✅ with RPC-testing caveat | §10.3 |
| Architecture baseline aligned with latest Product decisions | 🟡 Pending Archie note | §2.4, C2 |
| UX baseline aligned with latest Product decisions | 🟡 Pending Sophie addenda | §9.3, C3 |
| AD-WS13 ratification recorded | 🟡 Register says Proposed | C1 |
| Environment / deployment topology known | 🔴 Unknown | ENV-01, C4 |
| Clean branch baseline | 🔴 Uncommitted WS13 docs on `main` | GO-01, C5 |
| Content & vendor data | 🟡 Not yet supplied (P2 only) | EP-02, EP-03 |

### Recommendation

**Ready to begin — Conditional.**

- **P-A (CM-03) may begin immediately** on Tiger's issue of an implementation EBC.
- **P0 may begin once C1–C6 are met.** None of them requires re-opening Product, UX or Architecture; each is a recording, alignment or environment confirmation.
- P2 verification additionally requires EP-02 and EP-03; P3 requires EP-04/EP-05.
- Recommended EBC structure: `WS13-005` (P-A + P0 implementation), `WS13-006` (Keerthi P0/WS12 regression), then one Rad/Keerthi pair per phase, and a final Sri/Tiger/Product Owner acceptance.

---

## 14. Risk Register

| ID | Risk | Type | Likelihood / Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-ENG-JW-01 | **Deployment coupling** (M07/M10 vs deployed JP code) breaks Decision → Confirmed | Migration | Medium / **High** | Single `db push` + immediate deploy + freeze window (§6.6); expand/contract fallback (ENG-DEC-01); WS12 regression R12-01…08 | Rad / Product Owner |
| R-ENG-JW-02 | Shared dev/prod database unknown; migrations or QA data could reach live users | Environment | Unknown / High | ENV-01 before P0; QA data prefixed and archived; no production data modified outside approved migrations | Product Owner |
| R-ENG-JW-03 | No local database: RPC/RLS defects found late | Testing | Medium / Medium | Contract checklist per RPC with three identities (§10.3 A); optional local stack (ENG-DEC-02) | Rad |
| R-ENG-JW-04 | PL/pgSQL runtime defects visible only on execution (Release 1.2 precedent, RF-05) | Implementation | Medium / High | Naming convention (`v_`/`p_` prefixes, no `RETURNS TABLE` column name reuse), every RPC executed live on every error path before QA | Rad |
| R-ENG-JW-05 | Transition logic in RPCs and `validation.ts` diverges | Implementation | Medium / Medium | Lockstep comments; `verify:journey-workspace-transitions`; Keerthi tests via API, not UI only | Rad / Keerthi |
| R-ENG-JW-06 | Time-zone errors on gates/alerts (UTC runtime vs IST business day) | Implementation | Medium / Medium | One helper in SQL and TS; `verify:journey-workspace-dates` around 18:30 UTC | Rad |
| R-ENG-JW-07 | Content (EP-02) or vendor data (EP-03) late | Dependency | Medium / Medium | Schema/content split (M05/M05b); P0–P1 unaffected; P2 verification waits; **no fabricated content** | Product Owner |
| R-ENG-JW-08 | Architecture/UX not yet aligned with POD-02/05/06/07/08 → review churn | Governance | High / Low–Medium | §2.4 and §9.3 hand the exact deltas to Archie/Sophie before code (C2, C3) | Tiger |
| R-ENG-JW-09 | Legacy Journeys in dev (count unknown) with null owner/nights/dates | Migration | Medium / Low | `legacy_pending` + adoption panel; backfill handles 0..N; no fabrication | Rad |
| R-ENG-JW-10 | Sensitive document references leak into logs, payloads or audit | Security | Low / High | Server-side masking in list read models; full value only in owner/admin detail GET; never in `event_data`; no `console.*` of payloads; review checklist | Rad |
| R-ENG-JW-11 | Notification duplication/noise; reconciler race between mutation and cron | Implementation | Low / Medium | Partial unique index; upsert-on-conflict; reconciler idempotent; cron runs daily only | Rad |
| R-ENG-JW-12 | Summary view becomes slow as data grows | Performance | Low / Medium | Indexes (§10.5); `EXPLAIN` checks; materialised view only with evidence (AD-WS13-004) | Rad |
| R-ENG-JW-13 | Scope size (largest Workspace module) → long QA cycles | Delivery | High / Medium | Six phases with gates; per-phase EBCs; CM-03 early win | Tiger |
| R-ENG-JW-14 | Irreversible archive of an active Journey by mistake (no unarchive, POD-08) | Product/ops | Low / Medium | Admin-only, reason required, explicit irreversibility copy (UXA-03); restoration is a future admin operation (O-11) | Sophie / Product Owner |
| R-ENG-JW-15 | Vercel cron not available on the plan or wrong root directory | Platform | Low / Medium | Confirm in EP-04; fallback: on-mutation reconciliation still resolves most conditions; time-driven alerts would lag | Product Owner |
| R-ENG-JW-16 | Drop of the 2-arg conversion function needs explicit approval; rollback needs re-creation | Migration | Low / Medium | Approval at migration review; rollback = forward migration re-creating the prior body from `20260921070600` | Product Owner |
| R-ENG-JW-17 | Service-role key used by cron route leaks to client bundle | Security | Low / High | Service-role client only in `app/api/workspace/cron/**` + `server-only` import; build output grep for the variable name | Rad |

**Rollback considerations (summary):** P-A and P1–P4 application changes roll back by Vercel redeploy of the previous build. Additive migrations stay in place on rollback (harmless to older code) **except** M07/M10, whose rollback requires a forward migration restoring the 2-argument RPC and relaxing the Journey CHECKs — prepared as a script in the P0 report but not applied unless needed.

---

## 15. Engineering Observations Requiring Governance Attention

| ID | Observation | Evidence | Recommendation / owner |
|---|---|---|---|
| **GO-01** | WS13 baseline documents are uncommitted on `main` (20 modified, several untracked) | `git status` **[F]** | Product Owner commits the approved baseline before P0; implementation happens on a feature branch (C5) |
| **GO-02** | AD-WS13-001–007 show **Proposed** in `WORKSPACE-ARCHITECTURAL-DECISIONS.md` §8; no `DEC-R1.3` entry for WS13; WS13 tracker row still **Reserved** | Register lines 219–225; `RELEASE-1.3.md` §5 **[F]** | Tiger records ratification and WS13 status (C1) |
| **GO-03** | Architecture and UX baselines predate POD-02/05/06/07/08 (O-01, O-02, O-03, O-09 still open) | §2.4, §9.3 | Archie alignment note (C2); Sophie addenda UXA-01…06 (C3) |
| **GO-04** | Repository WS13-002 is Revision 2; Project Knowledge is Revision 3; no 001C record | grep **[F]**; Archie GOV-01/02 | Tiger (EP-07) |
| **GO-05** | Environment topology unknown: one linked Supabase project | `linked-project.json` **[F]** | Product Owner answers ENV-01 (C4) |
| **ENG-OBS-01** | Dates–nights rule is now a **block** (POD-06 P2), overriding Archie's warn default; implemented as block | WS13-001 BR-027 | Archie records (C2) |
| **ENG-OBS-02** | Legacy JP records created before WS12-013 may have **null nights**; the consistency rule cannot evaluate them | `20260922090000` (nullable, no backfill) **[F]** | Default: block with "Number of nights required", resolved by editing Trip Basics in JP. Arjun/Product Owner to confirm (EP-06) |
| **ENG-OBS-03** | BR-043 requires one Service Category per Journey, but BR-036 legacy adoption fields do not list it and legacy rows cannot derive it | WS13-001 §14.2 | Default: adoption panel requires Service Category (UXA-05). Confirm (EP-06) |
| **ENG-OBS-04** | POD-05 requires a system-generated, business-friendly Vendor Code but no format is defined | Spec v2.0 §20 | Default: `VND-0001` style sequence (mirrors `JRN-####`). Product Owner to confirm before M06 |
| **ENG-OBS-05** | Replacement planning record: POD-06 Policy 3 lists defaults but not whether Service Category and trip parameters are pre-filled | BR-039; FR-JW-12 AC2 "pre-filled" | Default: pre-fill party, destination, trip parameters and Service Category from the original Journey (reading of "pre-filled"). Confirm |
| **ENG-DEC-01** | Expand/contract alternative to dropping the old conversion overload in the same migration | §6.6 | Archie decides only if ENV-01 shows a shared production database |
| **ENG-DEC-02** | Local Supabase (Docker) for migration dry runs and SQL tests | §10.3 | Product Owner decision; not required to start |
| **BP-01** | Use the user directory to replace raw owner UUIDs in the JP queue | RF-03 | Backlog proposal (outside WS13) |
| **GO-09** | SEC-02/SEC-03 and deprecated `workspace_journeys.status` not yet in `TECH-DEBT.md` | `TECH-DEBT.md` **[F]** | Tiger logs `TD-WS12-004`, `TD-WS12-005`, `TD-WS13-001` |
| **GO-10** | WS12-014/017 QA reports still absent from the repository (existing disclosure) | `RELEASE-1.3.md` v1.17 | Unchanged; noted for regression-pack reuse |

---

## 16. Handover to Tiger

| # | Deliverable | Where |
|---|---|---|
| 1 | Engineering Planning Report | This document |
| 2 | Repository findings | §2 (incl. §2.4 post-POD deltas) |
| 3 | Engineering phase recommendations | §4 (P-A, P0–P5) |
| 4 | Work package breakdown | §5 (WP-A1 … WP-5.1) |
| 5 | Migration strategy | §6 (M01–M14, M05b; conversion v2 spec; backfill; deployment runbook) |
| 6 | API strategy | §8 |
| 7 | UI strategy | §9 |
| 8 | Configuration strategy | §7 |
| 9 | Risk assessment | §14 |
| 10 | Regression strategy | §11 |
| 11 | Testing strategy | §10 |
| 12 | Dependency matrix | §12 |
| 13 | Engineering readiness recommendation | §13: **Ready to begin — Conditional** (P-A now; P0 after C1–C6) |
| 14 | Observations for governance | §15 |

**Effort indication (relative, not a commitment):** P-A XS · P0 L · P1 M · P2 L · P3 M (L with EP-05) · P4 S–M · P5 S.

---

## Confirmations

- **Planning only.** No application code, migration, configuration, database, environment variable or deployment was created or changed. No SQL was run.
- **No Product, UX or Architecture decision was changed.** Where the latest Product decisions post-date the Architecture and UX documents, the deltas are listed for their owners (§2.4, §9.3) and planned as stated by the Product baseline. Engineering defaults for open points are labelled as defaults and routed to governance (§15).
- Only environment-variable **names** were read. No secret value was read, recorded or copied.
- One file created: `docs/09-Development/EBC-R1.3-WS13-004-RAD-Engineering-Planning-and-Implementation-Strategy.md` (and its Project Knowledge copy). No other file, folder or document modified.
- Nothing committed or pushed.

---

*Prepared by Rad, Engineering and Implementation Specialist, on behalf of Team Satvi, per EBC-R1.3-WS13-004. Engineering plan submitted to Tiger for validation; not self-approved.*
