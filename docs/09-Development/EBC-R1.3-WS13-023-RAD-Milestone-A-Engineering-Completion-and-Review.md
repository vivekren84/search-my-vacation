# EBC-R1.3-WS13-023 — Phase 1 Milestone A: Engineering Completion & Review

| Field | Value |
|---|---|
| Card | EBC-R1.3-WS13-022 — Phase 1 Milestone A Engineering Implementation (Tiger) |
| Submitted for | Checkpoint 1 — Tiger review; Archie SQL review (AC-9) |
| Persona | Rad — Engineering & Implementation Specialist |
| Release / Workstream | Release 1.3 / WS13 Journey Workspace — Phase 1 (Journey Core) |
| Authority | DEC-R1.3-026; EBC-R1.3-WS13-021; baseline EBC-R1.3-WS13-020 Rev 2 with 020A (Archie) and 020B (Sophie) |
| Branch | `feature/r1.3-ws13-journey-workspace` at `6c78ac7` (governance commit). **All Milestone A work is uncommitted** in the working tree. |
| Date | 4 October 2026. Revision 1, 5 October 2026: PO baseline decision recorded; Archie's SQL review (`EBC-R1.3-WS13-023A`) reflected in §4.2, §10 and §11 (checkpoint numbering aligned with `WS13-021` §11). |
| Status | **Engineering complete for Deliverables A–H.** Deliverable A (Preview baseline) was measured on 4 October 2026 after the PO's Administrator sign-in (DEC-R1.3-022 (1)). Conversion was not measured, by PO decision. |

Rad's technical completion does not equal Keerthi's functional approval, Sri's experience approval or Product Owner acceptance.

**Governance confirmations (card exit criteria).**
- **No schema change to the shared database.** M11 and every database test ran on a local PostgreSQL 17.6 only.
- **Shared-database data (Revision 1 correction).** The Preview baseline (Deliverable A, §8.1) used the shared database through the application, as the card's baseline scope requires:
  - it read Journey Planning records;
  - with the PO's explicit approval (4-Oct-2026), it wrote one QA record `QA-WS13-P1-Perf-01`, its claim, one stage change and five Trip Basics saves, plus their audit rows;
  - no conversion, Journey or traveller was created. The first issue of this report said "no shared database was read or changed", which was written before the baseline and was wrong after it.
- No Preview deployment. No commit, no push.
- No credentials were typed or read. Only environment-variable names were used.
- No operational business record was changed. Test records are named `QA-WS13-P1-*`.

---

## 1. Implementation Summary

Milestone A delivers the server half of Journey Core. There is no UI: the screens arrive in Milestone B.

- **Migration M11** (`supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql`) is **functions only**. It adds nine SECURITY DEFINER lifecycle RPCs and three internal helpers. There is no table, column, constraint, index, view, policy or data change. The file is in the repository but **not applied anywhere** except local test databases.
- **Service layer** (`web/lib/workspace/journey-workspace/`) covers:
  - list and summary counts, detail with per-caller action availability, History and Itinerary;
  - ten mutations: nine through the M11 RPCs, plus the contact editor (RLS update and audit, as AD-WS13-002 allows);
  - a single error model with S-5 copy.
- **API layer**: 16 new Route Handlers (15 under `app/api/workspace/journey-workspace/`, plus `app/api/workspace/users/directory`). `reference-data` gains two keys (additive).
- **Verification**: three new `verify:journey-workspace-*` scripts. Locally there is a 198-check SQL suite for M11 and a 112-check service/API suite through a real PostgREST with per-user JWTs, plus a volume check.

## 2. Deliverables

| # | Deliverable | Status | Where |
|---|---|---|---|
| A | Performance Baseline Report (Preview) | Done (conversion not measured, by PO decision; cold start measured after 15 minutes idle) | §8.1 |
| B | M11 | Done, prepared, not applied | §4; rollback in §4.4 |
| C | Local Engineering Validation Report | Done | §5 |
| D | Service Layer | Done | §6 |
| E | API Layer | Done | §7 |
| F | Performance Profile | Done locally (measure only, no optimisation) | §8.2–§8.4 |
| G | Engineering Findings | Done | §9 |
| H | Updated Technical Documentation | Done: this report (API, error contract, M11 reference, runbook) plus code headers. Architecture documents are left to Archie. | §4, §7, §11 |

---

## 3. Local Engineering Environment (card: Docker, local Supabase, migration history)

| Check | Result |
|---|---|
| Docker daemon | **Not running** on the device. The cloud workspace has no Docker. |
| Supabase CLI | **Not installed** on the device. |
| Substitute (Phase 0 precedent) | **PostgreSQL 17.6** (embedded build) plus a small Supabase shim: roles `anon` / `authenticated` / `service_role` / `authenticator`, `auth.users`, and `auth.uid()` defined as on Supabase. For the API suite, **PostgREST 12.2.3** runs locally with HS256 JWTs per test user, so calls cross PostgREST, grants and RLS as they do on Supabase. |
| Migration history | All 34 repository migrations replay cleanly onto an empty database, then M11. |
| TD-WS13-002 | A fresh replay of `20260921070200` still collides on a constraint name. The local harness uses a patched copy with the column CHECK named. The repository file is unchanged (deferred, plan Rev 2 §11). |
| Shim limits | Supabase's default privileges on `public` are not modelled, so grants come only from the migrations. This is stricter than Supabase, never looser. |
| Environment healthy | Yes for engineering purposes. A real local Supabase stack (Docker plus CLI) is recommended before Phase 2: see the backlog proposal in §9. |

## 4. Migration M11

### 4.1 Functions

All functions are `public.`-qualified and SECURITY DEFINER with `search_path = public`. The actor is always `auth.uid()`; there is no actor parameter. They use `p_`/`v_` naming, and execute is revoked from `public` and `anon` (AC-1). Each error is raised as `workspace_journey_<code>`.

| Function | Purpose | Codes it can raise (beyond the common guard) |
|---|---|---|
| `workspace_journey_transition(p_journey_id, p_expected_stage, p_to_stage, p_note)` | Advance one stage, or step back Ready to Travel → In Preparation | `stale`, `on_hold`, `transition_not_allowed`, `note_too_long`, `readiness_incomplete`, `start_date_not_reached`, `end_date_not_reached` |
| `workspace_journey_place_on_hold(…, p_reason)` | BR-029 | `stale`, `already_on_hold`, `hold_not_allowed`, `reason_required`, `reason_too_long` |
| `workspace_journey_resume(…)` | BR-029 | `stale`, `not_on_hold`, `replacement_open` |
| `workspace_journey_cancel(…, p_reason, p_cancellation_task_booking_ids)` | BR-030, with vendor-cancellation tasks | `stale`, `cancel_not_allowed`, reason codes, `booking_invalid`, `replacement_open` |
| `workspace_journey_close(…)` | Mark as Completed (post-travel only) | `stale`, `close_not_allowed` |
| `workspace_journey_reassign(…, p_expected_owner_id, p_new_owner_id, p_note)` | BR-026 | `stale`, `new_owner_invalid`, `owner_unchanged`, `note_too_long` |
| `workspace_journey_assign_template(…, p_template_id)` | Start preparation (BR-041) | `stale`, `transition_not_allowed`, `on_hold`, `template_invalid`, `template_already_assigned` |
| `workspace_journey_set_service_category(…, p_service_category)` | BR-043 | `service_category_invalid`, `service_category_unchanged` |
| `workspace_journey_adopt_legacy(…)` | BR-036/040/043, PO Decision 5 | `new_owner_invalid`, `dates_required`, `dates_invalid`, `dates_nights_mismatch`, `service_category_required`/`_invalid`, `template_invalid`, `contact_invalid` |

The common guard is `workspace_journey_lock_for_change`. It checks, in order:
1. the actor is active, else `not_authorised` (42501);
2. the Journey exists, and its row is locked, else `not_found` (P0002);
3. it is not `archived`;
4. it is not `terminal`;
5. legacy state: change mode refuses `legacy_pending`; adopt mode refuses `not_legacy` and allows Administrators only;
6. ownership: owner or Administrator.

Internal helpers have execute revoked from `public`, `anon` and `authenticated`:
- `workspace_journey_lock_for_change` — the common guard above.
- `workspace_journey_derive_template_items` — the single readiness-item builder (AC-2).
- `workspace_journey_notify` — AC-6: no notification to a deactivated recipient, the caller, or nobody.

### 4.2 Changes since the plan (for the AC-9 SQL review)

| # | Change | Why |
|---|---|---|
| D-1 | **Two more internal helpers** (`lock_for_change`, `notify`) besides the approved derive helper | Avoids repeating the guard nine times and the recipient rules six times. Same hygiene as AC-2: execute revoked, internal only. |
| D-2 | **Each audit row sets `created_at = clock_timestamp()`** instead of using the column default `now()` | Finding F-01: events written by one call shared a timestamp, so History showed them in random order. No column change. |
| D-3 | When adoption inserts a new contact, the audit has `before: null`, and `phone_changed` / `email_changed` are `true` only for a value actually supplied | Consistent "the value is new" semantics; no values stored (AC-5). Archie: Accepted (`023A` §4). |

### 4.3 Architecture compliance

| Condition / constraint | Evidence |
|---|---|
| AC-1 hygiene | Revoke/grant block at the end of M11; SQL suite group G (anon and unprovisioned callers refused). |
| AC-2 one derive helper | `derive_template_items`, used by `assign_template` and `adopt_legacy`; F7/F9 tests. |
| AC-3 gate reads the view | `readiness_mandatory_unresolved` from `workspace_journey_operational_summary`. F1 proves a gated test template blocks and an empty one does not (PO Decision 4). |
| AC-4 adoption audit nights | `nights_source` (`stored` / `derived_from_dates`) and `nights`. Tested in SQL F9 and API group A. |
| AC-5 contact audit without values | SQL F9; API group C asserts that no phone or email text appears in `event_data`. |
| AC-6 no notification to deactivated users | SQL F6/F9. The API suite confirms the new owner is notified and the caller is not. |
| AC-7 rollback | §4.4: tested (drop → suite still replays → re-apply → 198/198). |
| AC-8 TD-WS13-006 | Unchanged by M11. Confirmed at API level (F-04). |
| AC-9 SQL review | **Requested now** (Checkpoint 1). |
| Internal DB functions only, derived nights, audit history, notification behaviour | As above; groups E (end-to-end) and O (history order). |

### 4.4 Engineering rollback (forward-fix). Prepared, NOT applied, not in `supabase/migrations/`

```sql
-- WS13 Phase 1 M11 ENGINEERING ROLLBACK (forward-fix). Prepared, NOT applied.
-- If needed, Tiger raises it as a numbered corrective migration (AC-7).
-- Drops the nine M11 public functions and the three internal helpers.
-- No table or data is touched: rows written by M11 satisfy the M07 constraints.
begin;
drop function if exists public.workspace_journey_transition(uuid, text, text, text);
drop function if exists public.workspace_journey_place_on_hold(uuid, text, text);
drop function if exists public.workspace_journey_resume(uuid, text);
drop function if exists public.workspace_journey_cancel(uuid, text, text, uuid[]);
drop function if exists public.workspace_journey_close(uuid, text);
drop function if exists public.workspace_journey_reassign(uuid, uuid, uuid, text);
drop function if exists public.workspace_journey_assign_template(uuid, text, uuid);
drop function if exists public.workspace_journey_set_service_category(uuid, text);
drop function if exists public.workspace_journey_adopt_legacy(uuid, uuid, date, date, text, uuid, text, text, text, text, text);
drop function if exists public.workspace_journey_lock_for_change(uuid, text);
drop function if exists public.workspace_journey_derive_template_items(uuid, uuid, uuid);
drop function if exists public.workspace_journey_notify(uuid, text, uuid, text);
commit;
```

Application side: the new routes return `operation_failed` (500) if the functions are missing. No current screen calls them, so the rollback does not affect Phase 0 behaviour.

---

## 5. Local Engineering Validation Report (Deliverable C)

### 5.1 Database: M11 SQL suite (PostgreSQL 17.6; 34 migrations + M11) — **198 / 198 pass**

| Group | Checks | Covers |
|---|---|---|
| G guards | 16 | anon, unprovisioned, deactivated, non-owner, Administrator, not found, archived, terminal, legacy, row lock |
| F1 transition | 24 | every allowed and refused pair, stale, on hold, note limit, readiness gate (blocking and empty template), date gates, step-back audit |
| F2 place on hold | 19 | holdable stages, reason rules, trimming, audit, notification |
| F3 resume | 8 | not on hold, open replacement, audit with `held_since` |
| F4 cancel | 22 | cancellable stages, reasons, booking validation (unknown, cancelled, other Journey), tasks and assignee fallback, hold cleared |
| F5 close | 9 | post-travel only, `closed_at`, open-task count in audit |
| F6 reassign | 17 | stale owner, inactive owner, unchanged, notification rules |
| F7 start preparation | 17 | template checks, items derived once, stage change, audit order |
| F8 Service Category | 9 | active codes only, unchanged |
| F9 adopt legacy | 31 | Administrator only, dates, nights stored/derived/mismatch, contact insert/update, audits, notification |
| E end-to-end | 13 | conversion v2 → full lifecycle to Completed; History order |
| D direct writes and RLS | 9 | no UPDATE/INSERT on `workspace_journeys`; contact RLS for owner, non-owner, deactivated, terminal, archived, legacy |
| O history order | 4 | no shared timestamps; template → stage; tasks → cancellation; adoption → contact |

Mutation checks show the suite detects faults:
- removing the `owner_unchanged` check fails one test;
- the pre-D-2 M11 fails five tests, including the end-to-end order, which had previously passed only by chance.

**Rollback:** applying M11, then the rollback, then M11 again still gives 198/198.

### 5.2 Service and API: local PostgREST integration suite — **112 / 112 pass**

The compiled service layer calls a local PostgREST 12.2.3 through `supabase-js`, using a real JWT per user (Administrator, owner, other user, deactivated user, unprovisioned user).

| Group | Checks | Highlights |
|---|---|---|
| L list and counts | 21 | Mine/Team/named owner (PO Decision 3); terminal and archived excluded; every chip count equals its own list (FR-JW-34 AC1); filters leave counts unchanged; search by destination, company (case-insensitive), mobile and reference; `%` is literal |
| D detail | 11 | per-caller actions: owner, non-owner (`not_owner`), Administrator on legacy (`adopt`), archived; `not_found` for unknown and malformed ids |
| M mutations | 43 | 403 non-owner and deactivated; 409 stale; 400 with all field issues at once; date gates; step back with trimmed note; Start preparation; hold/resume; cancel with de-duplicated booking ids; Completed leaves the list; reassign rules and notifications; Service Category rules |
| C contact | 11 | RLS path: non-owner 403; field issues; AC-5 flags without values; a no-change save writes no audit; terminal, legacy and no-contact cases |
| A adoption | 11 | user refused; nights mismatch; several issues together; stored and derived nights; adopted → contact order; adopt twice → `not_legacy` |
| H History, Itinerary | 9 | 61 events over 2 pages with a **5-way timestamp tie at the page boundary**: none skipped or repeated; ownership filter; malformed and injection-shaped cursors rejected; Itinerary null state |
| R error responses | 5 | `{ ok:false, code, message, issues? }`; `no-store`; unexpected errors return 500 `operation_failed` with no raw database text in the body or the log |
| P call counts | 1 | input to §8.3 |

**Volume check.** 2,000 Journeys, 30,000 audit rows, PostgREST capped at 1,000 rows like Supabase. The list returns **1,715 / 1,715** active Journeys, all last-activity values are correct, and the longest URL is 4.1 KB. The same check on the pre-fix code fails: a 39 KB request URL (F-02).

### 5.3 Application checks

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.json` (device) | Pass (exit 0) |
| `eslint .` (device) | 0 errors. 4 warnings, all pre-existing in untouched files (`lib/geo-validation/bootstrapRepository.ts`, `scripts/bootstrap-workbook/writeWorkbook.ts`). |
| `verify:journey-workspace-actions` (new) | 92 checks pass |
| `verify:journey-workspace-errors` (new; reads M11 and checks each SQL code ↔ TS code ↔ status ↔ copy) | 203 checks pass (33 SQL codes) |
| `verify:journey-workspace-list` (new) | 44 checks pass |
| Existing `transitions` / `derivations` / `dates` / `config` | 118 / 24 / 22 / 17 pass |
| `next build` | **Pass**, local clean clone at `6c78ac7` plus these changes. Two local-only settings: Google Fonts mocked (the sandbox has no route to Google Fonts), and placeholder public Supabase settings so the existing `/workspace/journey-planning/new` prerender succeeds. No real values were used. All 17 new or changed routes compile, and Next's route type check passes. The device cannot run `next build` because its `node_modules` are macOS builds. |

---

## 6. Service Layer (Deliverable D)

| Module | Role |
|---|---|
| `types.ts` (appended) | Error codes, contact, actions, list query/item/result, detail, History (with keyset cursor), Itinerary, adoption input |
| `errors.ts` (new) | `JourneyWorkspaceError` (code, HTTP status, field issues), `mapJourneyRpcError` (unknown → `operation_failed`), status map (plan §8.2) |
| `messages.ts` (new) | One copy table for API and Milestone B screens (Sophie S-5) |
| `list.ts` (new, pure) | URL parse/serialise (lenient), departure presets (Monday–Sunday weeks), AND filters, chip counts, sorting |
| `validation.ts` (appended, pure) | Reason/note limits, contact rules (BR-040), adoption dates and nights (PO Decision 5), History filter and strict cursor |
| `derivations.ts` (appended, pure) | `getAvailableJourneyActions` (plan §8.4 matrix, UX §9.3), History categories |
| `repository.ts` (appended) | Reads (paged and chunked: F-02), contact RLS update, nine RPC wrappers |
| `service.ts` (extended) | `listJourneys`, `getJourneyDetail`, `getJourneyHistory`, `getJourneyItinerary`, ten mutations. Each mutation validates every field first, calls the RPC, and returns the refreshed detail. |
| `api.ts` (new) | Route support: JSON body parsing, error → response mapping, safe logging |

No logic is duplicated:
- the stage tables live only in `types.ts` and the M11 SQL (lockstep noted in both, checked by `verify:*`);
- copy lives only in `messages.ts`;
- error mapping lives only in `errors.ts`.

## 7. API Layer (Deliverable E)

All routes:
- use `runtime = "nodejs"` and `authenticateWorkspaceApiRequest()`, so 401 means not signed in, and 403 means not provisioned or deactivated;
- send `Cache-Control: no-store`;
- follow the error contract `{ ok:false, code, message, issues? }`.

There is no create route (FR-JW-05) and no DELETE anywhere (BR-033).

| Route (`/api/workspace/…`) | Method | Body / query | Success |
|---|---|---|---|
| `journey-workspace` | GET | `scope, owner, stage, onHold, readiness, departing, departure, from, to, q, sort, group` | `{ ok, items, counts, query, today }` |
| `journey-workspace/summary-counts` | GET | same query | `{ ok, counts, today }` |
| `journey-workspace/[journeyId]` | GET | — | `{ ok, journey: JourneyDetail }` |
| `…/transition` | POST | `{ expectedStage, toStage, note? }` | `{ ok, journey }` |
| `…/start-preparation` | POST | `{ expectedStage, templateId }` | `{ ok, journey }` |
| `…/hold` | POST | `{ expectedStage, reason }` | `{ ok, journey }` |
| `…/resume` | POST | `{ expectedStage }` | `{ ok, journey }` |
| `…/cancel` | POST | `{ expectedStage, reason, cancellationTaskBookingIds[] }` | `{ ok, journey }` |
| `…/close` | POST | `{ expectedStage }` | `{ ok, journey }` |
| `…/reassign` | POST | `{ expectedOwnerId \| null, newOwnerId, note? }` | `{ ok, journey }` |
| `…/service-category` | PATCH | `{ serviceCategory }` | `{ ok, journey }` |
| `…/contact` | PATCH | `{ contactType, name, organisation?, phone?, email? }` | `{ ok, journey }` |
| `…/adopt` | POST | `{ ownerId, confirmedStartDate, confirmedEndDate, serviceCategory, readinessTemplateId, contact{…} }` | `{ ok, journey }` |
| `…/history` | GET | `?filter=all\|stage_status\|ownership\|contact_category&before=<nextBefore>` | `{ ok, history: { entries, hasMore, nextBefore } }` |
| `…/itinerary` | GET | — | `{ ok, itinerary \| null }` |
| `journey-workspace/reference-data` | GET | — | existing `referenceLists`, plus `readinessTemplates` (active: id, code, name) and `contactTypes` |
| `users/directory` | GET | — | `{ ok, users: [{ userId, displayName, role, isActive }] }` (no email) |

**Role and ownership enforcement.** Every write is enforced in the database: the M11 guard, or RLS for the contact editor. The service and UI only add early, friendlier refusals. Verified at API level as follows:
- non-owner and deactivated users get 403;
- the Administrator can act on any Journey and alone can adopt;
- archived and terminal Journeys get 409.

**Security.**
- Ids are validated as UUIDs before any query.
- Search text reaches PostgREST only through `ilike()` with LIKE wildcards escaped.
- The History cursor accepts only an ISO timestamp and a UUID; injection-shaped tokens are tested.
- Raw database messages are never returned or logged.

---

## 8. Performance (Deliverables A and F — measure only, PO Decision 8)

### 8.1 Preview baseline (Deliverable A)

**Conditions.**
- Measured on 4 October 2026, 20:00–20:47 IST, from India in the PO's Chrome, signed in as Administrator.
- Preview deployment `dpl_5ATzrzMSaQRNLQeuMoi5ieaUpkoz` (branch `feature/r1.3-ws13-journey-workspace`; Phase 0 code, no M11).
- Every response came through Vercel edge `bom1` (Mumbai) to the function in `iad1` (US East); the database is in Seoul.
- Timings are browser timings (`fetch` and the Resource/Navigation Timing APIs; pages loaded in a hidden same-origin frame). Vercel's runtime logs do not expose per-request durations, so server time is not separated.
- No instrumentation code was added.

**Writes approved by the PO** (shared database, PO Decision 7):
- one planning record `QA-WS13-P1-Perf-01` (id `076515d5-…`) on the traveller of the existing QA record `QA-WS13-P0-Regression-PRA`;
- claim, one stage change (Lead Created → Discovery), and Trip Basics saves.

No conversion and no Journey were created (PO decision). The record is QA data for removal at release readiness (`DEC-R1.3-022` (5)).

| # | Action | Samples | Median | Worst |
|---|---|---|---|---|
| — | Static asset from the edge (`bom1`, cache HIT): browser ↔ Vercel floor | 6 | 40 ms | 59 ms |
| B-1 | Dashboard page (`/workspace`), document complete | 5 | 2.0 s | 2.8 s |
| B-2 | Journey Planning queue page: navigation → rows (list API done) | 5 | 4.0 s | 4.8 s |
| B-2 | Queue API `GET /api/workspace/journey-planning` (17 records) | 6 | 1.55 s | 2.19 s |
| — | Record detail page: navigation → all data (4 APIs in parallel) | 5 | 5.1 s | 6.2 s |
| — | Record API / History API / Tasks API | 5 each | 1.82 s / 0.96 s / 1.53 s | 2.39 s / 1.51 s / 1.91 s |
| B-3 | Create record (API) | 1 | 2.66 s | — |
| B-4 | Claim (API) | 1 | 3.06 s | — |
| B-5 | Advance stage (API) | 1 | 2.02 s | — |
| — | Trip Basics save (API) | 5 | 3.03 s | 3.28 s |
| — | Confirm dialog open | — | no network request (renders from data already loaded with the page) | — |
| B-6 | `reference-data` (authenticate + one query), warm | 5 | 1.35 s | 2.23 s |
| B-7 | `reference-data` first call of the session / first call after 16 min idle (20:46 IST) | 1 / 1 | 3.41 s / 3.69 s (the next three calls: 2.11–2.24 s) | — |
| — | Conversion | — | **Not measured** (PO decision). Phase 0 QA observed 6.8 s (`WS13-015` §9). | — |
| B-8 | `explain analyze` of the summary view on the shared database | — | PO action, read-only (§10) | — |

A user-visible action in Journey Planning costs the mutation (2–3 s) plus the page's parallel re-fetch of detail, history and tasks (about 1.8–3 s). That is roughly 5–6 s, consistent with Phase 0 QA (5–10 s).

**Reading against the plan's hypotheses (§13.2).**
- **H1 confirmed.** "Authenticate + one query" takes about 1.35 s warm, while the browser ↔ edge floor is 40 ms. Almost all the time is between the function in `iad1` and Supabase in Seoul.
  - That route makes three sequential database/auth calls: `auth.getUser()`, the `workspace_users` read and the configuration read.
  - Fitting the read APIs suggests roughly **0.25–0.4 s per sequential call** plus a fixed cost of a few hundred milliseconds for edge → `iad1` and the function itself. This is an inference from browser timing, not a server measurement.
- **H2 is small.** The browser ↔ edge leg is 40 ms. The `bom1` → `iad1` hop is inside the fixed cost above.
- **H3 shows.** See B-7: a cold call costs about 1.5–2.3 s more than a warm one (3.4–3.7 s against 1.35–2.2 s). Warm figures also vary by about ±0.5 s between runs.
- **H4 confirmed.** After a mutation the page waits for a second round of requests.
- **H5** needs the B-8 read-only query on the shared database. Locally the view costs 26–111 ms per Journey at 500–2,000 Journeys (§8.2).

**What this means for Phase 1 targets (estimates, not measurements).** The Phase 1 routes add two authentication calls to the sequential rounds counted in §8.3:
- detail ≈ 4 rounds;
- a lifecycle action ≈ 5 rounds, returning the refreshed detail so no second request is needed;
- the list ≈ 5 rounds.

At the measured cost per round:

| Target | Estimate | Plan target |
|---|---|---|
| T-1 lifecycle action, click → toast | ≈ 1.7–2.5 s | median ≤ 2.5 s — reachable |
| T-2 list, navigation → rows | ≈ 3.5–4.5 s (page document ~2 s, then the list API) | median ≤ 3 s — **at risk** |
| T-3 detail, navigation → header | ≈ 3–4 s | median ≤ 3 s — **at risk** |

Per the plan (§13.4), the targets stay as proposed: the distance between `iad1` and Seoul, not query cost, is the limiting factor.

**Product Owner decision, 5 October 2026.** The Milestone A baseline is accepted as the engineering performance baseline for Phase 1. No regional optimisation or architectural change is made at this stage. The latency findings (F-11) are recorded as architecture input for Archie's planned infrastructure review. No further investigation is required during Milestone A.

### 8.2 Database profile (local PG 17.6, synthetic volume)

| Measure | 500 Journeys | 2,000 Journeys |
|---|---|---|
| Summary view, active list | 104 ms | 320 ms |
| Summary view, **one** Journey (detail) | 26.5 ms | 111 ms |
| History page (51 rows, index) | 0.3 ms | 0.8 ms |
| Last-activity read (all audit rows of active Journeys) | 3.6 ms | 16 ms |
| RPC place on hold (avg of 20) | 0.67 ms | 0.74 ms |
| RPC reassign | 0.93 ms | 0.73 ms |
| RPC cancel with 4 tasks | 2.46 ms | 2.14 ms |
| RPC transition with readiness gate (reads the view) | 3.45 ms | 13.3 ms |

Each Journey in the synthetic data has 4 bookings, 8 readiness items, 3 documents and 15 audit events.

### 8.3 Database calls per API operation (local, 12-Journey fixture)

These counts exclude the existing authentication calls each route makes; the baseline measures those.

| Operation | Calls | Sequential rounds |
|---|---|---|
| List (mine / team) | 7 / 8 | 3 |
| List with search | 17 | 4 |
| Detail | 9 | 2 |
| History page | 3 | 1 |
| Any lifecycle mutation (RPC + refreshed detail) | 10 | 3 |
| Contact edit (pre-check, update, audit, refreshed detail) | 20 | 6 |
| List at 2,000 Journeys (paged, chunked) | 76 | about 5 |

### 8.4 Reading of the profile (no optimisation made)

- **The RPCs are cheap and flat.** The exception is the readiness-gate transition, which reads the view.
- **Archie AR-F2 is confirmed.** The view aggregates every Journey even for one Journey, so detail and the gate grow linearly with total volume. Internal scale today is far below 500, so this is acceptable for now.
- **On Preview, the round trip from Vercel `iad1` to Supabase Seoul dominates** (baseline §8.1: about 0.25–0.4 s per sequential call). The sequential rounds in §8.3 are where the time goes.
- **Candidate optimisations**, for after the baseline and only with evidence:
  - collapse detail reads into fewer rounds;
  - skip the second detail load after a mutation;
  - add a per-Journey readiness read for the gate (needs Archie: AR-F2 chose the view as the single source);
  - for Archie's planned infrastructure review only (A-3; **not to be acted on now**, PO decision 5-Oct-2026): co-locating the function region with the database would remove most of the per-call distance. This is a deployment decision, outside Phase 1.

---

## 9. Engineering Findings (Deliverable G)

| ID | Finding | Severity | Status |
|---|---|---|---|
| F-01 | Events written by one RPC (template → stage, task → cancellation, adoption → contact) shared one `now()` timestamp, so History order was random. The end-to-end test had passed by chance. | Medium (audit readability) | **Fixed in M11** (D-2); 4 new tests. Phase 0 conversion v2 writes only one Journey event per call, so it is unaffected. |
| F-02 | Bulk reads hit two PostgREST limits: silent truncation at `max-rows` (1,000 on Supabase) and URL length for `in.(…)` id lists. The pre-fix list **failed at 2,000 Journeys** (39 KB URL), and truncation would have mis-sorted Last activity from about 70 active Journeys upward (15+ events each). | High at volume (latent today) | **Fixed in the repository**: paged reads (`READ_PAGE_SIZE = 1000`, which must not exceed the project's max-rows) and id chunks of 100. Volume check passes. |
| F-03 | A timestamp-only History cursor would skip events that share a timestamp at a page boundary. | Medium | **Fixed**: keyset cursor `(created_at, id)`, tested with a 5-way tie. |
| F-04 | TD-WS13-006 / OBS-P1-04 is confirmed at API level: a JWT for an unprovisioned or deactivated user can read every active Journey through PostgREST (`using (true)` on `workspace_journeys`). The routes refuse both users before any read. | Medium (pre-existing) | Open. Already routed to the RLS hardening card before Phase 3; Phase 1 scope is not expanded. |
| F-05 | AR-F2 view cost is measured (§8.2): detail takes 111 ms and the gate 13 ms at 2,000 Journeys. | Low today | Open. Decide after the Preview baseline. |
| F-06 | A Journey with **no primary contact** cannot get one from the contact editor, because there is no INSERT policy. The service returns `operation_failed`. Conversion v2 and the backfill skip the contact only when the party has no name. | Low (rare) | Open. Product decision: an Annex query (§10) counts such Journeys; options are an RPC in Phase 2 or a UX message. |
| F-07 | The contact edit costs 20 calls in 6 rounds (two detail loads). | Low | Measure on Preview first. |
| F-08 | The device cannot run a local Supabase stack (no Docker daemon, no CLI). The harness substitutes PostgreSQL 17.6 + shim + PostgREST. | Process | Backlog proposal: install Docker Desktop and the Supabase CLI before Phase 2 (PO decision, local tooling only). |
| F-09 | `next build` needs network access to Google Fonts. | Info | Note only; Vercel builds have that access. |
| F-10 | Existing migrations truncate constraint names longer than 63 characters (PostgreSQL NOTICE). | Info | Harmless; noted for the hardening card. |
| F-11 | Preview baseline: about 0.25–0.4 s per sequential function → database call (`iad1` ↔ Seoul). Phase 1 targets T-2 and T-3 are at risk on that basis (§8.1). | Medium (experience) | **Recorded as architecture input** for Archie's planned infrastructure review (PO decision, 5-Oct-2026). No optimisation or architectural change in Phase 1. |
| F-12 | Pre-existing WS12 API behaviour, seen during the baseline: `POST …/trip-basics` with explicit `null` for `intendedTravelMonth`, `preferredDepartureCity` and `serviceCategory` returned **500** "Could not update Trip Basics." (5 tries, nothing saved). The same call with the UI's payload (unset fields omitted) returns 200. The UI never sends those nulls, so users are not affected. The cause was not investigated, to avoid more writes to the shared database. | Low (API robustness) | **Recorded as QA observation OBS-P1-QA-TB-01 for Keerthi** (PO decision, 5-Oct-2026). No further investigation in Milestone A. |

**Further implementation choices for Tiger and Archie to note:**
- Copy lives in `lib/…/messages.ts`, not in a component file. API and UI share it.
- The list filters in memory over one paged view read (AR-F9).
- Legacy Journeys count under the Confirmed chip.
- The contact editor pre-checks availability, so its error codes match the RPCs. If RLS filters the row between the check and the update, it returns `stale`.
- `summary-counts` reuses the list service, so counts and lists cannot drift.

## 10. Read-only checks for the Product Owner (Supabase SQL editor, before Checkpoint 4)

These are SELECT queries only and change nothing. They size F-02, F-05 and F-06 on real data.

```sql
-- Active Journeys and audit volume (F-02, F-05)
-- Active = not terminal and not archived (view definition; corrected per Archie SR-02)
select count(*) filter (where is_active) as active_journeys, count(*) as all_journeys
from public.workspace_journey_operational_summary;
select count(*) as journey_audit_rows from public.workspace_audit_log where entity_type = 'journey';
-- Journeys without a primary operational contact (F-06)
select count(*) as journeys_without_primary_contact
from public.workspace_journeys j
where not exists (select 1 from public.workspace_journey_operational_contacts c
                  where c.journey_id = j.id and c.is_primary);
-- B-8: summary view cost on real data (read-only)
explain (analyze, buffers) select * from public.workspace_journey_operational_summary where is_active;
-- No existing function names collide with M11
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname like 'workspace_journey_%' order by 1;
```

## 11. Known Issues and Deployment Readiness

**Known issues.**
- Conversion timing was not measured on Preview (PO decision); the Phase 0 QA figure (6.8 s) stands.
- B-8 (view cost on the shared database) waits for the PO's read-only query (§10).
- `next build` was verified on a local clone, not on Vercel; no Preview deployment was allowed.
- There is no UI yet (Milestone B).

**Deployment readiness: not deployed.** Checkpoints per `EBC-R1.3-WS13-021` §11:

| # | Checkpoint | Status |
|---|---|---|
| 1 | Milestone A Engineering Review (Rad → Tiger) | Submitted with this report |
| 2 | SQL Architecture Review (Archie) | **Approved with conditions** SR-01 and SR-02, both runbook items; no SQL change (`EBC-R1.3-WS13-023A`) |
| 3 | Deployment Runbook Approval (Tiger, Rad → Vivek) | To draft. Must include SR-01 and SR-02 and the steps below. |
| 4 | Migration Authorisation (M11 on the shared database, Vivek) | Not started |

**Runbook content for Checkpoint 3** (the PO executes at Checkpoint 4; shared database, PO Decision 7):
1. Run the §10 read-only checks. Confirm 34 recorded migrations and no existing `public.workspace_journey%` function.
2. In the Supabase SQL editor, as `postgres`, paste M11 between `begin;` and `commit;` (SR-01). Record the migration-history row as Phase 0 did (parity 35 = 35). Then run `notify pgrst, 'reload schema';`.
3. Run Archie's verification query (`023A` §7) and expect 12 rows:
   - every row: definer, `search_path=public`, owner `postgres`, `anon` false;
   - `authenticated` true for the nine public functions and false for the three helpers (SR-02).
4. Only then push the branch, so the Preview build carries routes whose functions exist. If the order is reversed, the new mutation routes return 500 `operation_failed`; Phase 0 behaviour is unaffected either way.
5. Rollback: §4.4 inside `begin`/`commit`, then `notify pgrst, 'reload schema';`, then redeploy the previous Preview build.
6. Then integration verification on Preview (plan §14.4) with `QA-WS13-P1-*` records, and QA (Checkpoint 5).

## 12. Files

**Created (24):**
- `supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql`
- `web/lib/workspace/journey-workspace/{api,errors,list,messages}.ts`
- `web/lib/workspace/journey-workspace/verification/{verifyActions,verifyErrors,verifyList}.ts`
- 16 route files under `web/app/api/workspace/`:
  - `journey-workspace/route.ts`
  - `journey-workspace/summary-counts/route.ts`
  - `journey-workspace/[journeyId]/route.ts`
  - `journey-workspace/[journeyId]/` + `transition`, `start-preparation`, `hold`, `resume`, `cancel`, `close`, `reassign`, `service-category`, `contact`, `adopt`, `history`, `itinerary` (each `route.ts`)
  - `users/directory/route.ts`

**Modified (8):**
- `web/lib/workspace/journey-workspace/{types,validation,derivations,repository,service}.ts` — Phase 0 code unchanged; Phase 1 appended.
- `web/app/api/workspace/journey-workspace/reference-data/route.ts` — additive keys.
- `web/package.json` — three `verify:` scripts.
- `web/tsconfig.journey-workspace-verification.json` — three includes.

**Deleted:** none.

**Git:**
- branch `feature/r1.3-ws13-journey-workspace`, HEAD `6c78ac7`;
- 8 modified and 24 untracked paths plus this report;
- nothing committed or pushed (awaiting PO authorisation).

**Local evidence (working artifacts, not repository files):** the harness and suites are delivered alongside this report as `ws13-022-local-harness.zip`:
- Supabase shim, replay script and TD-WS13-002 patched copy;
- SQL suite, API fixture, API suite, volume check, profiling SQL;
- the result logs.
