# EBC-R1.3-WS12-010 — RADHA — QA Defect Resolution & Regression Support

**Persona:** Radha (Rad), Senior Software Engineer / Engineering Lead
**Workstream:** WS12 — Journey Planning
**Parent EBC:** `EBC-R1.3-WS12-009` — Keerthi, Journey Planning Functional QA Validation
**Status:** Implemented — engineering validation complete; not yet committed, not yet re-validated by Keerthi
**Authoritative inputs:** `EBC-R1.3-WS12-007` (Engineering Implementation), `EBC-R1.3-WS12-009` (Functional QA Validation Report), `EBC-R1.3-WS12-003` (Business Analysis & Functional Requirements), `TECH-DEBT.md`
**Prepared:** 22 September 2026

---

## 1. Objective

This EBC is not a feature-implementation card. The Journey Planning vertical slice (`EBC-R1.3-WS12-007`) is complete; this card exists solely to resolve the defects Keerthi's functional QA pass (`EBC-R1.3-WS12-009`) confirmed, close the engineering gaps behind them, and prepare WS12 for Product Owner acceptance — without redesigning UX, changing product requirements, introducing new features, altering database architecture beyond what a defect fix requires, or touching unrelated Workspace modules.

## 2. Inputs Reviewed Before Implementation

- `EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md` — this EBC's own predecessor; read in full, including its Known Limitations (Section 7), before any code was touched.
- `EBC-R1.3-WS12-009-KEERTHI-Journey-Planning-Functional-QA-Validation-Report.md` — the authoritative source of every defect resolved below.
- `EBC-R1.3-WS12-003-ARJUN-Business-Analysis-and-Functional-Requirements-Journey-Planning.md` — consulted via `project_search` for the exact FR-JP-06/FR-JP-07/FR-JP-11 text governing Origin Channel, rather than inventing the channel list or the Corporate-enquiry rule.
- `TECH-DEBT.md` — reviewed in full; findings recorded in Section 7 below.
- Direct repository inspection of every file touched, read in full before editing (`types.ts`, `validation.ts`, `repository.ts`, `service.ts`, `shared/audit/*`, `shared/tasks-follow-ups/service.ts`, the two API route files, `JourneyPlanningRecordDetailView.tsx`), consistent with the Read-Before-Change principle (Project Instructions §18).

## 3. Defect Resolution

### D1 — Critical — Missing History/Audit UI

**Root cause:** the `workspace_audit_log` table and its insert path (`insertWorkspaceAuditLogEntry`) were fully built in WS12-007 Phase 1 and every mutating Journey Planning action already wrote to it — but no read function and no UI consumer existed. The gap was a missing read path, not a missing capability.

**Fix:**
- `web/lib/workspace/shared/audit/repository.ts` — added `listWorkspaceAuditLogEntries(supabase, entityType, entityId)`, reverse-chronological, reusing the existing table and RLS.
- `web/lib/workspace/shared/audit/service.ts` — added `getWorkspaceAuditHistory`.
- `web/lib/workspace/journey-planning/service.ts` — added `getJourneyPlanningHistory`, a thin wrapper scoping the shared function to `AUDIT_ENTITY_TYPE`.
- `web/app/api/workspace/journey-planning/[recordId]/history/route.ts` (new) — `GET`, following the existing single-record-detail route's exact auth/error pattern (auth → try/catch → `jsonResponse`), no RBAC check beyond authentication, consistent with how the existing record-detail `GET` route already treats reads as authentication-gated rather than ownership-gated (mutations remain RBAC-gated; see D2 below).
- `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` — new "History" section rendering each event via a new `AUDIT_EVENT_LABELS` map in `journeyPlanningLabels.ts`, covering every event type JP-09 requires (Record Created, Ownership Claimed, Stage Changed, Proposal Version Created, Decision Selected, Converted to Journey, Closed, plus the two new Task events from D2).

### D2 — Critical — Missing Tasks & Follow-ups UI

**Root cause:** identical shape to D1 — `web/lib/workspace/shared/tasks-follow-ups/service.ts` (`createWorkspaceTask`, `getWorkspaceTasksForEntity`, `setWorkspaceTaskStatus`) was fully implemented in WS12-007 Phase 1 with zero consumers.

**Fix — reuses the shared module exactly as instructed; no parallel task-tracking logic was written:**
- `web/lib/workspace/journey-planning/service.ts` — added `getJourneyPlanningTasks`, `addJourneyPlanningTask`, `setJourneyPlanningTaskStatus`. The two mutating functions re-check `canEditRecord` (the same record-scoped RBAC function already governing other Detail-screen edits) before acting, and each writes a corresponding audit event (`task_created` / `task_updated`) so every Task action also appears in the new History section.
- `web/app/api/workspace/journey-planning/[recordId]/tasks/route.ts` (new) — `GET`/`POST`.
- `web/app/api/workspace/journey-planning/[recordId]/tasks/[taskId]/status/route.ts` (new) — `POST`, validates `status` is one of `open`/`completed`/`cancelled` before calling the service.
- `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` — new "Tasks & Follow-ups" section: create-task form (title, description, due date, assignee) and per-task complete/reopen controls.
- `supabase/migrations/20260922080100_workspace_audit_log_task_events.sql` (new) — extends the existing `workspace_audit_log_event_type_check` CHECK constraint to add `task_created`/`task_updated`, per that constraint's own original comment ("extended, never replaced"). All ten original event types are preserved verbatim; verified by diffing against the original `20260921060000_workspace_shared_audit_log.sql` migration before writing this one.

### D3 — High — Origin Channel missing from Create form

**Root cause:** `FR-JP-06`/`FR-JP-07` (eight ratified origin channels; every record must record one at creation) were never implemented in the `journey-planning` module — no column, no field, no validation.

**Fix:**
- `supabase/migrations/20260922080000_workspace_journey_planning_origin_channel.sql` (new) — adds `origin_channel text`, backfills any pre-existing rows to `manual_workspace_initiation`, adds a CHECK constraint enumerating the eight FR-JP-06 values, then sets the column `NOT NULL` — the nullable-then-backfill-then-constrain sequence already used throughout this module for a safe column addition.
- `web/lib/workspace/journey-planning/types.ts` — new `JourneyPlanningOriginChannel` union type and `JOURNEY_PLANNING_ORIGIN_CHANNELS` const array; `originChannel` added to `JourneyPlanningRecord` and `CreateJourneyPlanningRecordInput`.
- `web/lib/workspace/journey-planning/validation.ts` — `origin_channel_required` (must be one of the eight values) and `corporate_enquiry_origin_requires_corporate_record` (the `corporate_enquiry` channel is only valid on a `corporate`-kind record). **Engineering-authority interpretation, not a new business rule:** FR-JP-11 requires a Corporate Point of Contact before a Corporate-enquiry-origin record leaves Lead Created; since this module already requires the Corporate Point of Contact at creation time for every corporate record, tying `corporate_enquiry` to `recordKind === "corporate"` enforces FR-JP-11's intent without inventing new business logic. Recorded here for Arjun/Tiger review, not silently assumed as final.
- `web/lib/workspace/journey-planning/repository.ts` — `mapRecordRow` and `insertJourneyPlanningRecord` read/write the new column.
- `web/app/api/workspace/journey-planning/route.ts` — `POST` passes `originChannel` through to the service layer.
- `web/components/workspace/journey-planning/NewJourneyPlanningRecordForm.tsx` — new Origin Channel `<select>`, its option list filtered by the selected record kind (Corporate enquiry only offered when Corporate is selected).
- `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` — origin channel now displayed in the record header via a new `ORIGIN_CHANNEL_LABELS` map.

**Not built (disclosed, not silently deferred):** edit-after-creation support for Origin Channel was not requested by the EBC's own D3 text ("Field: Add Origin Channel field... Edit Support: Ensure Origin Channel can be edited if business rules allow") — no existing edit surface for any other creation-time field (e.g. `recordKind`, `title`) exists on the Detail screen to extend, and the EBC did not confirm the business rule permits post-creation edits. This is flagged to Arjun/Tiger as an open question rather than assumed either way.

### D4 — Medium — Poor error handling (browser alerts)

**Root cause:** the Detail screen's `post()` helper called `window.alert()` directly on every non-2xx response and on network failure, surfacing raw engineering messages (e.g. "Could not advance Journey Planning record stage.", "Not signed in.") in a native browser dialog.

**Fix:**
- `web/components/workspace/shared/Toast.tsx` (new) — a shared, reusable `useWorkspaceToasts()` hook plus `<ToastStack>` component, styled with the existing Workspace brand tokens (`--color-amber`, `--color-espresso`, `--color-error`, `--radius-lg`), ephemeral and client-only (distinct from the persistent, DB-backed `workspace_notifications` table — this is UI-only feedback for the action just taken, not a durable notification).
- `JourneyPlanningRecordDetailView.tsx` — every `window.alert()` call replaced with a toast; error toasts surface the server's own message text rather than a generic string, so "Not signed in." and similar messages remain actionable rather than being replaced with something vaguer.
- The 500-error root cause behind the two specific messages quoted in the EBC (`"Could not advance Journey Planning record stage."`) was **also** fixed at the source, not just re-skinned: see D3/D4's shared root cause below.

**Shared root cause identified during D3/D4 work, fixed at both layers:** `JOURNEY_PLANNING_ALLOWED_TRANSITIONS.decision = ["closed"]` is a true lifecycle fact, but the Detail screen's generic "Move to `<stage>`" button loop used it directly, letting a user trigger a plain advance-stage call to `"closed"` — a call that can never succeed, because the `workspace_journey_planning_records` table's own CHECK constraint requires `stage='closed' AND outcome IS NOT NULL`, and only the `/decision` endpoint ever supplies an outcome. This is exactly the "Could not advance Journey Planning record stage." failure Keerthi reported. Fixed at two layers, confirmed by code review that neither breaks the legitimate `decision → closed` path (`recordJourneyPlanningDecision` calls `updateJourneyPlanningRecordStage` directly and never goes through `validateStageTransition`, so it is unaffected):
1. **Server-side** (`journey-planning/validation.ts`) — `validateStageTransition` now rejects any `to === "closed"` with a clean `closed_stage_requires_decision_endpoint` validation error (→ a clean 400, never a 500). `JOURNEY_PLANNING_ALLOWED_TRANSITIONS` itself is unchanged — it still correctly states that `"closed"` follows `"decision"`; only the generic action's use of that fact is narrowed.
2. **Client-side** (`JourneyPlanningRecordDetailView.tsx`) — `allowedNextStages` now filters out `"closed"`, so the broken button never renders.

### D5 — Documentation Gap — Known Limitations update

`EBC-R1.3-WS12-007`'s Section 7 (Known Limitations) has been updated with a new **Section 7.1 Addendum** — additive, not a rewrite; the original eight bullets are untouched, consistent with Project Instructions §32 ("do not rewrite history"). The addendum records which limitations D1–D4 resolved, which of the original eight remain open and unchanged, the two new migrations now pending against a live database, and an explicit note that History/Audit and Tasks UI should have been disclosed as undisclosed-gap limitations in the original report rather than left for QA to discover manually.

## 4. Business Clarification F1 and Environmental Observation F2

- **F1 — "Proposal Shared without Proposal Version"** — per the EBC's own routing, this is a business-rule clarification, not an engineering defect, and is forwarded to Arjun. No code change was made for F1.
- **F2 — intermittent 401 during localhost testing, correlated with Fast Refresh/HMR** — not reproduced in this pass (no live dev server is available in this environment; see Section 6). No action taken, consistent with the EBC's own instruction ("no action unless reproducible").

## 5. Technical Debt Register Review

`TECH-DEBT.md` reviewed in full. Outcome, recorded in that document's own Change History (v1.1) and as a Note on `TD-WS12-001`:

| Item | Outcome |
|---|---|
| `TD-WS12-001` (missing `id`/`name` attributes, Workspace-wide) | **Remains Open.** WS12-010 incidentally added `id`/`name` to Journey Planning's own form controls while building D1–D4, but this entry's scope is Workspace-wide, and no project-wide form audit was authorised or performed here. Annotated, not resolved. |
| `TD-WS12-002` (image dimensions) | **Remains Open**, untouched — no images added or changed by WS12-010. |
| `TD-WS12-003` (preload warnings review) | **Remains Open**, untouched — no bundling/preload changes made by WS12-010. |

No entry deleted, renumbered, or silently closed.

## 6. Regression Testing Summary

**Method: code review, not runtime verification.** As disclosed in `EBC-R1.3-WS12-007` Section 7/8 and unchanged in this environment, no local Supabase instance or running dev server is available here, so the items below were verified by reading the exact code paths each exercises, confirming no touched file altered behaviour outside its defect's scope, and confirming (via `git diff`) that every change is additive except the two narrowly-scoped guards described in D4. This is **not** a substitute for Keerthi re-running these flows against a live environment, and is recommended as the next step (Section 9).

| Area | Result | Basis |
|---|---|---|
| Creation (Individual) | No regression | `validateCreateJourneyPlanningRecordInput` diff reviewed line-by-line: the only new checks are `origin_channel_required` and the corporate-origin guard (which only fires for `recordKind === "corporate"`); the pre-existing individual-record checks are unmoved and unmodified. |
| Creation (Corporate) | No regression | Same review; the Corporate Point-of-Contact validation function (`validateNewBootstrapCorporateContact`) is untouched by this diff. |
| Ownership (Claim) | No regression | `claimJourneyPlanningRecord` not touched by this EBC (confirmed via `git diff --stat`; the file's other exported functions are unchanged). |
| Notes (Add Discovery Note) | No regression | Discovery-activity service/route files not in this EBC's changed-file list. |
| Proposal (Create Proposal Version) | No regression | Proposal-version service/route files not touched. |
| Workflow (Discovery→Planning→Proposal Shared→Decision) | No regression | `validateStageTransition`'s new guard only rejects `to === "closed"`; every other entry in `JOURNEY_PLANNING_ALLOWED_TRANSITIONS` (including `proposal_shared ↔ revision`) is reached through the same unmodified lookup and is unaffected. |
| Workflow (Decision→Closed/Lost/Archive) | No regression | `recordJourneyPlanningDecision` (the only path that legitimately reaches `closed`) calls `updateJourneyPlanningRecordStage` directly and never calls `validateStageTransition` — confirmed by grep across `service.ts`; the new guard cannot fire on this path. |
| Conversion (Decision→Journey) | No regression | `convertJourneyPlanningRecordToJourney` and its RPC call not touched by this EBC. |
| Filters (Queue/Stage/Owner) | No regression | Queue filtering logic (`JourneyPlanningQueueFilters`, the queue route/component) not touched by this EBC. |
| Audit (History records generated correctly) | Verified by review | New `listWorkspaceAuditLogEntries` is a pure additive read (`select` + `eq` + `order`) against the existing table; no write path was altered, so every event WS12-007 already recorded is unaffected, and the two new Task event types are additive to the CHECK constraint (all ten original values confirmed preserved by diffing against the original migration). |
| Tasks (Create/Update/Complete) | Verified by review | New code paths, reusing the already-implemented, already-typed `shared/tasks-follow-ups/service.ts` functions without modification; RBAC (`canEditRecord`) checked before every mutation, matching the pattern used by every other mutating Journey Planning action. |

## 7. Documentation Deliverables

- `EBC-R1.3-WS12-007-RADHA-Journey-Planning-Engineering-Implementation.md` — Section 7.1 Addendum added (Section 3 D5, above).
- `TECH-DEBT.md` — Change History v1.1 row added; `TD-WS12-001` annotated (Section 5, above).
- This report (`EBC-R1.3-WS12-010-RADHA-QA-Defect-Resolution-and-Regression-Support.md`) — new.

## 8. Engineering Validation

| Check | Command | Result |
|---|---|---|
| TypeScript compilation | `npx tsc --noEmit -p tsconfig.json` (project-wide) | **PASS** — zero errors. |
| ESLint | `npx eslint lib/workspace app/api/workspace app/workspace components/workspace` | **PASS** — zero errors, zero warnings. |
| Production build | `npm run build` | **BLOCKED**, same pre-existing cause as `EBC-R1.3-WS12-007`: Turbopack fails fetching Inter/Poppins from `fonts.googleapis.com` in `app/layout.tsx`, unrelated to this EBC's files. Re-confirmed, not newly introduced — re-run in full in this pass, same result. Still flagged as a release-readiness gate for Tiger/Vivek, not something resolvable from within this EBC's scope. |
| Regression in unrelated Workspace modules | Manual diff review (`git diff --stat`) | **PASS** — 11 files modified, all within `journey-planning/` and `shared/audit/`; zero files outside WS12's own module touched. |
| Migration correctness | Code review + diff against the original `20260921060000_workspace_shared_audit_log.sql` | **PASS by inspection** — all ten original `event_type` values preserved verbatim in the new CHECK constraint; nullable-then-backfill-then-NOT-NULL pattern followed for `origin_channel`. **Not executed against a database** — same disclosed limitation as WS12-007. |
| Route auth/RBAC | Code review | Every new route calls `authenticateWorkspaceApiRequest()` first; both new mutating Task functions re-check `canEditRecord` before acting; the two new `GET` routes (history, tasks-list) follow the existing record-detail `GET` route's own precedent of authentication-only gating for reads. **Not runtime-verified** — recommending Keerthi's re-validation pass exercise this against a real signed-in session (Section 9). |

## 9. Repository Verification

- [x] Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation`
- [x] Branch confirmed: `main`
- [x] Working tree reviewed before starting: clean, HEAD at `f29bc0d` (WS12-007, committed since my prior session by another party)
- [x] `EBC-R1.3-WS12-007` and `EBC-R1.3-WS12-009` read in full before implementation
- [x] `EBC-R1.3-WS12-003` consulted (via project search) for FR-JP-06/07/11 rather than inventing the origin-channel list or the corporate-origin rule
- [x] `TECH-DEBT.md` reviewed; outcome recorded in Section 5 above, no entry deleted
- [x] No production code committed silently — this report and the underlying diff are explicit and disclosed
- [x] No secrets, `.env` values, or production credentials read, written, or exposed
- [x] `npm run build` was attempted and its failure is disclosed above, not hidden
- [x] No commits made; no commits pushed (Project Instructions §26 — pending explicit authorisation)

## 10. Repository Status

- **Branch:** `main`
- **Working tree:** 11 files modified, 5 new files (2 migrations, 3 API route files/directories), all within `journey-planning/`, `shared/audit/`, and `shared/` (the new `Toast.tsx`)
- **Files created:** 5 application files + 2 migrations = 7
- **Files modified:** 11 (`repository.ts` ×2, `service.ts` ×2, `types.ts`, `validation.ts`, `route.ts`, `journeyPlanningLabels.ts`, `NewJourneyPlanningRecordForm.tsx`, `JourneyPlanningRecordDetailView.tsx`, `audit/types.ts`) — see `git diff --stat` in Section 6's basis notes for the exact list
- **Documentation modified:** `EBC-R1.3-WS12-007-RADHA-...md` (Section 7.1 addendum), `TECH-DEBT.md` (Change History + `TD-WS12-001` note)
- **Files deleted:** 0
- **Migrations created:** 2 (not yet applied — no live database in this environment, consistent with WS12-007's own disclosure)
- **TypeScript status:** PASS (zero errors, project-wide)
- **ESLint status:** PASS (zero errors, zero warnings)
- **Build status:** BLOCKED — same pre-existing, unrelated Google Fonts network-egress issue as WS12-007
- **Commit status:** **Not committed.** Per Project Instructions §26, awaiting explicit authorisation before any commit; recommend one commit for this defect-resolution pass (application code + migrations) and a separate documentation commit (or a single combined commit if the Product Owner prefers — Tiger/Vivek's call), on a branch such as `fix/ws12-010-qa-defect-resolution` rather than directly on `main`, departing from WS12-007's own precedent of committing straight to `main` only if the Product Owner wants the branch convention (Project Instructions §26) applied from this point forward.

## 11. Completion Criteria Mapping

| Criterion (from the EBC) | Status |
|---|---|
| All confirmed defects (D1–D4) are resolved | Met, per Sections 3 and 8 |
| Audit History UI is available | Met |
| Tasks & Follow-ups UI is available | Met |
| Origin Channel is implemented per specification | Met, with one open question flagged (post-creation edit support — Section 3, D3) |
| Browser alerts are replaced with a Workspace-standard notification pattern | Met |
| Regression testing passes | Met **by code review**, not runtime execution — disclosed limitation, Section 6 |
| Documentation is updated | Met, Section 7 |
| No new defects are introduced | No new defects identified by `tsc`/`eslint`/diff review; not confirmed by runtime testing |
| Backward compatible with existing Journey Planning functionality | Met, per the regression review in Section 6 |

## 12. Recommended Next Step

**Keerthi re-validation** against a live environment: (1) confirm the five defects (D1–D5) are actually resolved at runtime, not just by code review; (2) execute the full regression list in Section 6 live, since this pass could only verify it by inspection; (3) re-attempt `npm run build` in an environment where Google Fonts is reachable — this is now the second EBC in a row blocked by the same unrelated issue, worth escalating to Tiger/Vivek as its own release-readiness item rather than re-disclosing indefinitely; (4) apply all twelve pending migrations (ten from WS12-007, two from this EBC) against a real dev/staging Supabase project before or during that QA pass.

---

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01L6KYAiNwVu86RMW3fEXWsh
