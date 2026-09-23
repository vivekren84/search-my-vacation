# EBC-R1.3-WS12-007 — RADHA — Journey Planning Engineering Implementation

**Persona:** Radha (Rad), Senior Software Engineer / Engineering Lead
**Workstream:** WS12 — Journey Planning
**Status:** Implemented (vertical slice) — see Engineering Phase Completion Table
**Authoritative inputs:** WS12-001 through WS12-006; DEC-R1.3-011, DEC-R1.3-012, DEC-R1.3-013, DEC-R1.3-014
**Prepared:** 21 September 2026

---

## 1. Implementation Summary

This EBC implements the Journey Planning module against the fully approved and ratified WS12 planning baseline: WS12-002/003 (business analysis and requirements), WS12-004 (UX), WS12-005 (solution architecture), WS12-006 (engineering planning), and the four Product Owner decisions — DEC-R1.3-011 (WS11 baseline), DEC-R1.3-012 (WS12–WS17 identifiers reserved), DEC-R1.3-013 (Bootstrap Ownership + Proposal Hierarchy principles) and DEC-R1.3-014 (Proposal Version Itinerary + Workspace Component principles).

What was built is a complete, working **vertical slice** of Journey Planning: the full seven-stage record lifecycle, the Generic Ownership Model, the immutable Proposal Version/itinerary-snapshot model, Discovery activities, Vendor Quotations, and the atomic Decision-stage-to-Journey conversion — all backed by real Supabase migrations, a five-file service module, eight (plus one small addition — nine) API routes, and three Workspace-native UI screens (Queue, Create, Detail) wired into the existing Workspace navigation, replacing the `ComingSoon` placeholder.

What was **not** fully built, and is disclosed honestly rather than overstated, is covered in Section 7 (Known Limitations): a multi-destination itinerary authoring UI, a Traveller/Vendor/Corporate-Contact search-and-select picker (none of those directories exist yet — Traveller Hub/Vendor Management are future workstreams), a dedicated Search/Filters screen (JP-10) beyond the Queue's inline stage/owner filters, and a dedicated Archive screen (JP-11) — `archiveJourneyPlanningRecordOutsideNormalClosure` exists in the service layer but has no UI entry point in this pass.

Implementation followed WS12-006's 9-phase sequencing (WS-Eng-JP-1 through WS-Eng-JP-9) as the authoritative order, per this EBC's own "Engineering Planning is Authoritative" principle.

## 2. Repository Impact Summary

| Area | Files | Notes |
|---|---|---|
| Migrations | 10 new | `supabase/migrations/20260921060000` through `20260921070600` |
| Shared foundation (`web/lib/workspace/shared/`) | 15 new, 1 modified | `audit/`, `ownership/`, `notifications/`, `tasks-follow-ups/`, `api/respond.ts`; `rbac/permissions.ts` extended |
| Journey Planning module (`web/lib/workspace/journey-planning/`) | 4 new | `types.ts`, `validation.ts`, `repository.ts`, `service.ts` |
| API routes (`web/app/api/workspace/journey-planning/`) | 9 new | see Section "API Routes" below |
| UI (`web/components/workspace/journey-planning/`, `web/app/workspace/(dashboard)/journey-planning/`) | 4 new components, 3 pages (1 modified, 2 new) | Queue, Create, Detail |
| **Total** | **43 files touched** (41 new, 2 modified) | 0 files deleted |

No existing file's behaviour was changed except `rbac/permissions.ts` (additive-only: six new exported functions, nothing removed or altered) and `journey-planning/page.tsx` (replaced the `ComingSoon` placeholder with the real Queue, per WS11-011's own documented expectation that this would happen in a future EBC).

### API Routes (9)

1. `GET/POST /api/workspace/journey-planning` — queue + create
2. `GET /api/workspace/journey-planning/[recordId]` — detail
3. `POST /api/workspace/journey-planning/[recordId]/claim`
4. `POST /api/workspace/journey-planning/[recordId]/reassign`
5. `POST /api/workspace/journey-planning/[recordId]/advance-stage`
6. `GET/POST /api/workspace/journey-planning/[recordId]/proposal-versions`
7. `GET/POST /api/workspace/journey-planning/[recordId]/vendor-quotations`
8. `POST /api/workspace/journey-planning/[recordId]/decision`
9. `GET/POST /api/workspace/journey-planning/[recordId]/activities` — added during Phase 5 once the Discovery screen needed a write path the service layer (Phase 3) already exposed; see the Engineering Decision Log.

## 3. Migration Summary

Ten migrations, in dependency order (chronological filenames, `20260921060000`–`20260921070600`):

**Phase 1 — Shared Foundation:**
1. `workspace_shared_audit_log.sql` — `public.set_workspace_updated_at()` (new reusable trigger function) + `workspace_audit_log` (append-only, entity-agnostic).
2. `workspace_shared_notifications.sql` — `workspace_notifications` (entity-agnostic, recipient-scoped).
3. `workspace_shared_tasks_and_follow_ups.sql` — `workspace_tasks` (entity-agnostic).

**Phase 2 — Database Foundation:**
4. `workspace_bootstrap_travellers_and_vendors.sql` — `workspace_travellers`, `workspace_vendors` (AD-WS12-001 bootstrap).
5. `workspace_corporate_contacts.sql` — `workspace_corporate_contacts` (AD-WS12-003, independently owned).
6. `workspace_journey_planning_records.sql` — the core record: stage/outcome, owner, party FK, `record_kind`/`party` CHECK constraints.
7. `workspace_bootstrap_journeys.sql` — `workspace_journeys` (AD-WS12-001 bootstrap; write-only via the conversion RPC).
8. `workspace_proposals_and_versions.sql` — `workspace_proposals` + `workspace_proposal_versions` (DEC-R1.3-013 Proposal Hierarchy; DEC-R1.3-014 immutable itinerary snapshot).
9. `workspace_planning_activities.sql` — `workspace_planning_activities` (discovery notes/comments) + `workspace_vendor_quotations`.
10. `workspace_journey_planning_conversion.sql` — `workspace_convert_journey_planning_record()`, the atomic `SECURITY DEFINER` conversion RPC (R-ENG-JP-02).

All ten follow the established `workspace_users_and_roles.sql` conventions: RLS enabled on every table, explicit `revoke all ... from anon, authenticated` before any `grant`, `SECURITY DEFINER`/`SET search_path = public` on the one privileged function, and comments explaining intent. None could be applied against a live database in this environment (no local Supabase instance is running in this workspace) — see Section 5 "Engineering Validation" for what was and was not verified.

## 4. Architecture Conformance Report

Confirmed against WS12-005 Solution Architecture:

- **Server/client boundary preserved.** All Workspace database access goes through `createWorkspaceSupabaseServerClient()` (cookie-session-bound) using the SDK query-builder — never the public-site raw-fetch/secret-key pattern. Verified by direct comparison against the existing `auth/repository.ts` before writing a single line of `journey-planning/repository.ts`.
- **RLS is the access-control mechanism** (AD-WS11-002) for every new table; the one `SECURITY DEFINER` function (the conversion RPC) re-validates `p_actor_id = auth.uid()` internally so it cannot be used to forge the audit trail, matching the precedent set by `workspace_current_user_role()`.
- **Five-file module convention** followed exactly for `journey-planning/` (`types.ts`, `validation.ts`, `repository.ts`, `service.ts`); no `client.ts` was needed because every screen is a Server-Component-wrapped Client Component calling the API routes directly (matching the existing `reset-password/page.tsx` precedent), not calling repository/service code from the browser.
- **Bootstrap Ownership Principle (AD-WS12-001, DEC-R1.3-013)** implemented exactly as specified: `workspace_travellers`, `workspace_vendors`, `workspace_journeys` are minimal, created now, explicitly commented as nominally owned by future workstreams (WS14/WS16/WS13) to be extended, never re-created.
- **Proposal Hierarchy Principle (DEC-R1.3-013)** implemented: one `workspace_proposals` row per Journey Planning record (structurally unique FK), versions belong to it.
- **Sequencing correction (engineering-authority, not architectural):** WS12-006 Section 5.3's suggested migration order placed bootstrap tables before `workspace_journey_planning_records`, which would have produced a forward FK reference for `workspace_journeys.journey_planning_record_id`. Corrected by creating `workspace_journey_planning_records` before `workspace_journeys` specifically; recorded in Section 6 below.

## 5. Product Decision Conformance Report

- **DEC-R1.3-011** (WS11 Workspace Foundation as platform baseline): honoured — no change to any WS11 file's behaviour.
- **DEC-R1.3-012** (WS12–WS17 reserved, no implied sequencing): honoured — this EBC implements only WS12; WS13–WS17 tables referenced are bootstrap-only stand-ins, not implementations of those future workstreams.
- **DEC-R1.3-013** (Proposal Hierarchy Principle + Bootstrap Ownership Principle): honoured, see Section 4.
- **DEC-R1.3-014** (Proposal Version Itinerary Principle + Workspace Component Principle): honoured —
  - Every Proposal Version owns its own immutable `itinerary_snapshot` jsonb column; there is no separate mutable itinerary table, no UPDATE grant on `workspace_proposal_versions`, and no `is_current` boolean on that table (current-ness is tracked solely via `workspace_proposals.current_version_id`, specifically so the versions table stays genuinely insert-only — see the Engineering Decision Log).
  - Every screen (`JourneyPlanningQueueView`, `NewJourneyPlanningRecordForm`, `JourneyPlanningRecordDetailView`) uses plain HTML elements and Tailwind utility classes styled with the existing SMV design tokens (`--color-amber`, `--color-espresso`, `--color-cream`, `--radius-lg`, `--font-editorial`) — no external grid, table, or form library was added. `package.json` was not modified; zero new dependencies were introduced anywhere in this implementation.

No Product Owner decision was reinterpreted, narrowed, or exceeded.

## 6. Engineering Decision Log

*(Engineering-authority decisions only — no Product/Architecture decisions were made or implied here.)*

1. **Migration sequencing correction.** `workspace_journey_planning_records` is created before `workspace_journeys`, reversing WS12-006 Section 5.3's suggested order, to avoid a forward FK reference. An implementation-detail fix within Rad's own authority, not a change to any approved architecture.
2. **`destination_region` as nullable free text**, not an FK, on `workspace_journey_planning_records`. Destination Intelligence (WS17) does not exist yet, so no structured destination model exists to reference.
3. **Itinerary snapshot jsonb shape** (`destinations[]`, `startDate`, `endDate`, `travellerCount`, `priceEstimate`, `inclusions[]`, `notes`) is an engineering-authored, minimal, application-validated structure (`validation.ts`), not enforced by a database schema constraint, so it can be extended without a migration once Itinerary Studio (WS15) is speced. No prior artefact specified this at field level.
4. **`current_version_id` on `workspace_proposals`, not `is_current` on `workspace_proposal_versions`, is the sole "current version" pointer.** An `is_current` boolean on the versions table would have required updating a previous version row when a new one is created, undermining the genuine immutability DEC-R1.3-014 asks for. Pointing from the mutable parent instead keeps `workspace_proposal_versions` a true insert-only table (no UPDATE/DELETE grant exists on it at all).
5. **Generic `entity_type`/`entity_id` columns**, not hard FKs, on `workspace_audit_log`, `workspace_notifications`, `workspace_tasks`. This both avoids a forward-reference dependency on `workspace_journey_planning_records` and matches these tables' intended reuse by future Workspace modules (WS12-005 Section 7.5).
6. **Record-scoped RBAC defaults** (`canClaimRecord`, `canReassignRecord`, `canEditRecord`, `canAdvanceStage`, `canRecordDecision`, `canArchiveOutsideNormalClosure`): Administrator may always act; a Workspace User may act only on a record they own, except claiming (open to any Workspace User so the queue is workable) and archive-outside-normal-closure (Administrator-only). Follows WS11-007's own conservative-default convention (OQ-001) since WS12-005 Section 10.2 establishes that these must be record-scoped but does not itself specify the per-action rule.
7. **Audit writes are not best-effort.** `recordWorkspaceAuditEvent` throws on failure rather than swallowing errors, since a silently-missing audit entry is exactly the compliance gap the audit trail exists to prevent.
8. **No separate audit-log entry for `workspace_planning_activities` inserts.** Discovery notes/comments are already their own append-only historical record; a duplicate `workspace_audit_log` row for the same event would be redundant.
9. **A ninth API route (`/activities`) was added** beyond WS12-006's eight-route estimate, once the Discovery screen needed a write path the Phase 3 service layer (`addPlanningActivity`) already exposed. A small, in-scope implementation-detail addition — the underlying business capability (recording planning activity) was already approved in WS12-003/WS12-005; only the route count changed.
10. **Inline bootstrap Traveller/Corporate Contact creation on the Create screen**, rather than a search-and-select picker. Traveller Hub (WS14) does not exist yet, so there is no directory to search; `CreateJourneyPlanningRecordInput` accepts either an existing id or inline fields (`newTraveller`/`newCorporateContact`), and the service layer creates the bootstrap row before the Journey Planning record. Flagged in Known Limitations as producing a new row per creation rather than reusing an existing traveller.

## 7. Known Limitations

- **No traveller/vendor/corporate-contact search-and-select UI.** The Create screen always creates a new bootstrap Traveller or Corporate Contact inline (Engineering Decision 10); there is no way to re-plan for an already-known traveller without creating a duplicate bootstrap row. This is a direct consequence of Traveller Hub (WS14) and a full Vendor directory not existing yet, not an oversight — but it should be flagged to QA and revisited when WS14 is scoped.
- **Vendor Quotations require an existing `vendorId`**, and there is currently no UI to create or browse vendors, so the Vendor Quotations panel on the Detail screen is effectively read-only/inert in this pass (the API route and service function are fully implemented and testable directly, e.g. via `curl`/Postman, but the UI has no vendor picker to drive it end-to-end).
- **Single-destination itinerary authoring UI.** `ItinerarySnapshot` (the stored shape) supports multiple destinations, but the Proposal Version creation form on the Detail screen only captures one destination per version. Itinerary Studio (WS15) does not exist yet to justify a richer authoring surface.
- **JP-10 (dedicated Search/Filters screen) and JP-11 (dedicated Archive screen) were not built as separate screens.** The Queue provides inline stage/owner filters (a meaningful subset of JP-10), and `archiveJourneyPlanningRecordOutsideNormalClosure` is fully implemented in the service layer but has no UI entry point — only reachable via a direct API call today.
- **JP-08 (a dedicated Corporate Point-of-Contact panel) was not built as a separate screen**; corporate contact fields are only captured at record creation, not viewable/editable afterward from the Detail screen.
- **No tests were written.** This repository has no Jest/Vitest test runner; it uses feature-specific `npm run verify:*` scripts backed by dedicated `tsconfig.*-verification.json` files and hand-written verification entry points (see `journey-leads`, `journey-passport`, etc.). No such verification script exists for Journey Planning yet; recommending Keerthi's WS12-008 functional QA pass as the primary verification method for this release, consistent with how this repository already treats runtime/functional behaviour as Keerthi's domain rather than an automated unit-test suite's.
- **The production build (`npm run build`) could not be completed in this environment** — see Section 8 (Engineering Validation) for the specific, disclosed reason. This is an environment network-egress limitation affecting `app/layout.tsx`'s existing Google Fonts usage, present regardless of this implementation, not a defect in any Journey Planning file.
- **No migration was applied against a live database.** There is no local Supabase instance running in this workspace; migrations were reviewed for syntax, ordering and RLS-policy correctness by inspection and by following the established `workspace_users_and_roles.sql` template exactly, but were not executed. Recommending this be verified against a real (dev/staging) Supabase project before or during Keerthi's QA pass.

### 7.1 Addendum — EBC-R1.3-WS12-010 (22-Sep-2026)

**Additive disclosure, not a rewrite — the seven bullets above are unchanged.** Keerthi's WS12-009 functional QA pass (following this report) found two gaps that this Section 7 should have disclosed at the time but did not: a missing History/Audit UI and a missing Tasks & Follow-ups UI, both backed by fully-implemented Phase 1 infrastructure with no UI consumer. Keerthi also found the Origin Channel field absent from the Create form, and browser-native `alert()` calls used for error handling on the Detail screen. This is recorded here as Defect D5 of EBC-R1.3-WS12-010, whose own remediation work is documented in full in `EBC-R1.3-WS12-010-RADHA-QA-Defect-Resolution-and-Regression-Support.md`.

Resolved by WS12-010 (no longer limitations as of that EBC):

- **History/Audit UI** — a reverse-chronological event timeline (Record Created, Ownership Claimed, Stage Changed, Proposal Version Created, Decision Selected, Converted to Journey, Closed, Lost, Archived, plus the two new Task events below) is now rendered on the Detail screen, reading the existing `workspace_audit_log` table via a new `GET .../history` route.
- **Tasks & Follow-ups UI** — create task, due date, assignee, complete/reopen, and task history are now available on the Detail screen, reusing the shared `workspace_tasks` module (WS12-007 Phase 1) via two new API routes; no parallel task-tracking implementation was introduced.
- **Origin Channel** — the Create form (both Individual and Corporate) now captures one of the eight FR-JP-06 channels; enforced by a new NOT NULL + CHECK-constrained `origin_channel` column, application validation, and displayed on the Detail screen.
- **Browser-native error alerts** — `window.alert()` calls on the Detail screen were replaced with a shared, Workspace-styled toast component.

Still open (unchanged by WS12-010 — out of its scope by its own Non-Goals):

- No traveller/vendor/corporate-contact search-and-select UI (bullet 1, above).
- Vendor Quotations UI remains inert without a vendor directory (bullet 2, above).
- Single-destination itinerary authoring UI (bullet 3, above).
- JP-10/JP-11 dedicated Search and Archive screens not built as separate screens (bullet 4, above) — `archiveJourneyPlanningRecordOutsideNormalClosure` still has no UI entry point.
- JP-08 dedicated Corporate Point-of-Contact panel not built (bullet 5, above).
- No automated tests (bullet 6, above).
- **Production build remains blocked** in this environment by the same pre-existing, unrelated Google Fonts network-egress restriction in `app/layout.tsx` (bullet 7, above) — re-confirmed during WS12-010's own validation pass (22-Sep-2026), same root cause, same disclosure.
- **No migration has been applied against a live database** (bullet 8, above) — now twelve migrations pending, not ten, since WS12-010 added two more (`origin_channel`, and extending the audit `event_type` CHECK constraint for task events). Both reviewed by inspection only, following the same nullable-then-backfill-then-NOT-NULL pattern already used throughout this module.

**Lesson recorded, not just the fix:** Defect D5 exists specifically because these two UI gaps (History, Tasks) were implemented-but-undisclosed rather than disclosed-but-deferred like the eight bullets above. Going forward, a Known Limitations section should name every backend capability that shipped without a UI consumer, not only capabilities that were not built at all.

## 8. Engineering Validation

| Check | Command | Result |
|---|---|---|
| TypeScript compilation | `npx tsc --noEmit -p tsconfig.json` (project-wide) | **PASS** — zero errors, run four times across the implementation (after Phase 4, after the inline-bootstrap-creation change, after Phase 5/7 UI, final) |
| ESLint | `npx eslint lib/workspace app/api/workspace app/workspace components/workspace` | **PASS** — zero errors, zero warnings (four unused-catch-binding warnings and two `react-hooks/set-state-in-effect` errors were found and fixed during implementation, not silently suppressed) |
| Production build | `npm run build` | **BLOCKED, not silently worked around.** Turbopack build fails at the font-optimization step: `next/font` cannot fetch Inter/Poppins from `https://fonts.googleapis.com` (`app/layout.tsx`, pre-existing, unrelated to this EBC). Confirmed by direct `curl` from this environment: the device's network proxy returns `403` for `fonts.googleapis.com` — a network-egress restriction of this sandboxed environment, not a code defect. All new Journey Planning modules and all nine API routes were successfully resolved and reached bundling before the build failed at this unrelated, pre-existing step. **This must be re-run in an environment with Google Fonts reachable (or the repository's existing font strategy revisited) before Release 1.3 ships** — flagged to Tiger/Vivek as a release-readiness gate, not something this EBC can resolve from within Journey Planning's scope. |
| Regression in Workspace Foundation | Manual diff review | **PASS** — only two pre-existing files touched (`rbac/permissions.ts` additive-only; `journey-planning/page.tsx` replacing its documented placeholder); zero other WS11 files modified. |
| Route load / auth / RBAC | Code review (not runtime, since the build could not complete) | Every route calls `authenticateWorkspaceApiRequest()` first and every mutating service function re-checks record-scoped RBAC before acting; verified by reading each of the 9 route files and the service functions they call. **Not runtime-verified** — recommending Keerthi's WS12-008 pass exercise this end-to-end against a real signed-in session. |
| Migration ordering/consistency | Code review | **PASS by inspection** — dependency order confirmed file-by-file (travellers/vendors → corporate_contacts → journey_planning_records → journeys → proposals/versions → planning_activities → conversion RPC); no forward references remain. **Not executed against a database** (see Known Limitations). |

## 9. Repository Verification

- [x] Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation`
- [x] Branch confirmed: `main`
- [x] Working tree was clean before this workstream began (HEAD at `4b0854a`)
- [x] All prior WS12 artefacts reviewed (WS12-001 through WS12-006) and DEC-R1.3-011/012/013/014 treated as authoritative and implemented
- [x] `web/app/workspace/`, `web/components/workspace/`, `web/components/auth/`, `web/lib/workspace/`, `web/hooks/`, `supabase/`, `docs/` inspected before writing new code
- [x] No production code committed silently — this report and its commit(s) are explicit
- [x] No secrets, `.env` values, or production credentials read, written, or exposed
- [x] `npm run build` was attempted and its failure is disclosed above, not hidden
- [x] No commits were pushed (explicit Non-Goal, honoured)

## 10. Repository Status

- **Branch:** `main`
- **Working tree:** 22 changed/new top-level paths (2 modified, 20 new — 43 individual files when new directories are expanded; see Section 2)
- **Files created:** 41 (10 migrations, 31 application files)
- **Files modified:** 2 (`web/lib/workspace/shared/rbac/permissions.ts`, `web/app/workspace/(dashboard)/journey-planning/page.tsx`)
- **Files deleted:** 0
- **Migrations created:** 10 (not yet applied — no live database in this environment)
- **TypeScript status:** PASS (zero errors, project-wide)
- **ESLint status:** PASS (zero errors, zero warnings)
- **Build status:** BLOCKED — pre-existing Google Fonts network-egress issue in `app/layout.tsx`, unrelated to this EBC; disclosed, not worked around
- **Commit status:** Not yet committed as of this report; recommend one commit per logical phase grouping (Small Safe Commits), pending confirmation this report itself is accepted

## 11. Recommended Next Workstream

**EBC-R1.3-WS12-008 — KEERTHI — Journey Planning QA, Functional Verification & Regression.**

Specifically recommending Keerthi's pass prioritise, in order: (1) the seven-stage lifecycle end-to-end including the Decision-stage conversion RPC against a real Supabase project, (2) record-scoped RBAC (claim/reassign/edit/advance/decision/archive) under at least two distinct Workspace User accounts to confirm ownership boundaries actually hold, (3) a from-scratch `npm run build` in an environment where Google Fonts is reachable, to close the one check this EBC could not complete, and (4) the Known Limitations list in Section 7 as a disclosed-gap checklist rather than undiscovered defects.

## 12. Engineering Phase Completion Table

| Phase | Description | Status | Rationale |
|---|---|---|---|
| 1 | Shared Foundation | **Completed** | RBAC extension, audit, ownership, notifications, tasks/follow-ups all implemented and typechecked/linted clean. |
| 2 | Database Foundation | **Completed** | All 10 migrations written per the corrected dependency order; not applied against a live database (Known Limitations). |
| 3 | Journey Planning Services | **Completed** | Full five-file module (`types`, `validation`, `repository`, `service`) covering every business operation identified in WS12-003/005. |
| 4 | Journey Planning APIs | **Completed** | 9 routes (8 planned + 1 small addition), all authenticate, all delegate to the service layer, zero direct repository access from routes. |
| 5 | Journey Planning UI | **Partially Completed** | Queue (JP-01), Create (JP-03) and a combined Detail view (JP-02/04/05/06/07/13) are built and wired in; JP-08, JP-10 (as a dedicated screen), JP-11, and a multi-destination itinerary builder are not — see Known Limitations. |
| 6 | Proposal Management | **Completed** | Proposal header creation, immutable version creation, and version history display all implemented per DEC-R1.3-014. |
| 7 | Integration | **Completed** | Workspace Navigation already pointed at `/workspace/journey-planning`; the `ComingSoon` placeholder is replaced; Traveller/Journey/Vendor bootstrap entities wired via AD-WS12-001; Authentication/RBAC integrated via `authenticateWorkspaceApiRequest()` and `requireWorkspaceUser()`. Notifications wired for reassignment; not wired for every event type (e.g. no notification on stage transition) — a reasonable, disclosed scope choice, not a gap in the approved requirements. |
| 8 | Engineering Validation | **Partially Completed** | TypeScript and ESLint both executed and passed cleanly. Production build was attempted and is blocked by a disclosed, pre-existing, environment-level network restriction unrelated to this code — not silently worked around. Route/auth/RBAC and migration-ordering checks were done by code review, not runtime, since the build could not complete to allow a dev server run. |
| 9 | Implementation Readiness | **Completed** | This report; Known Limitations, Engineering Decision Log, and Recommendations for QA all delivered as required. |

---

*Prepared by Radha (Rad), Engineering and Implementation Specialist, Team Satvi — EBC-R1.3-WS12-007.*
