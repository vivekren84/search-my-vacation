# EBC-R1.3-WS13-003 — Journey Workspace Architecture Validation & Solution Alignment

**Persona:** Archie (She), Solution Architect
**Release / Workstream:** 1.3 / WS13, Journey Workspace
**Feature:** `FEAT-R1.3-013`, SMV Workspace
**Phase:** Architecture Validation and Solution Alignment. This is not a redesign.
**Date:** 26 September 2026
**Baselines validated (frozen):** Product: `EBC-R1.3-WS13-001` Revision 2 (FR-JW-01–34, BR-025–042, D-01–D-13, I-01–I-04), synchronised by `EBC-R1.3-WS13-001B`. UX: `EBC-R1.3-WS13-002` Revision 3 (UX-01–UX-08, wireframes WF-01–WF-07).
**Status:** **Architecture validation complete. Recommendation: Valid with Minor Updates.** Seven architecture decisions (`AD-WS13-001`–`007`) are Proposed and need Product Owner ratification. Archie does not approve her own work.

---

## 0. Workspace Readiness Check (Project Instructions §14 / §15)

| Check | Result |
|---|---|
| Task | Architecture validation of the frozen WS13 Product and UX baselines. Documentation only. |
| Active persona | Archie. Arjun's and Sophie's baselines are consumed as inputs. Tiger, Rad and the Product Owner receive the hand-over. |
| Local repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, connected this session |
| Branch | `main`, last commit `20cc249` ("feat(ws12): complete Journey Planning workstream") |
| Working tree at start | Pre-existing and not created by this card: Arjun's WS13-001/001B changes, Sophie's WS13-002 changes (UX documents, wireframes), and Tiger's governance edits (`RELEASE-1.3.md`, Feature Register, Workstream Plan, Backlog, Document Index). None of these files was touched. |
| Code, schema or migration changes authorised | **No.** No application code, migration, configuration or Product/UX document is changed by this card. |
| Commit / push | **None.** Left for the Product Owner. |

### 0.1 Baseline integrity observations (governance, non-blocking)

| # | Observation | Evidence | Impact |
|---|---|---|---|
| GOV-01 | **The repository copy of WS13-002 is Revision 2. Project Knowledge holds Revision 3** (UX-08: "Close Journey" renamed **Mark as Completed**). | Repo file header lists Revisions 1–2; Project Knowledge copy lists Revision 3, "ACCEPTED". | No architectural impact (UX-08 is a label). This card validates against Revision 3 as instructed. **Tiger should sync the repository file.** |
| GOV-02 | **No `EBC-R1.3-WS13-001C` record exists** in the repository or in Project Knowledge. Sophie raised this as UXO-01. | `grep` for "WS13-001C" returns only forward references. | This card treats the baselines as frozen, per its instructions. `I-01` (Payments = Payment-category follow-ups) is validated as written. |

---

## 1. Executive Summary

**The frozen Product and UX baselines can be implemented cleanly within the existing Workspace architecture.** Every WS13 capability fits the approved stack and patterns: Next.js route segment, the `web/lib/workspace/<module>/` five-file convention, Supabase Auth with RLS, `SECURITY DEFINER` RPCs for atomic operations, the shared audit log, the shared notifications and tasks tables, and the Bootstrap Ownership Principle (`DEC-R1.3-013`). No new runtime dependency, no new infrastructure, no new database technology and no redesign is needed.

The existing implementation is a thin bootstrap, so validation found a set of **additive** gaps. None requires changing the Product or UX baselines.

1. **`workspace_journeys` is minimal.** It has 7 columns and a 3-value `status` field (`active`/`completed`/`cancelled`). It must be extended, not recreated, to carry the D-01 lifecycle, owner, confirmed dates, trip parameters, the accepted Proposal Version, supersession, archive and legacy-adoption state.
2. **The WS12 conversion RPC is the WS13 entry point, and it must change (CM-01, CM-02, R-07).** Today it sets no owner, dates, destination or proposal reference. It also performs **no authorisation check of its own**, even though it is granted to every authenticated user. Once WS13's integrity constraints exist, the current RPC would fail. **CM-01 and CM-02 are therefore a hard prerequisite, not an optional follow-up.**
3. **Three shared foundations need small extensions.**
   - Notifications have no condition key and no resolution state, so condition-based alerts cannot resolve (`FR-JW-26`).
   - Tasks have no category, so Payment and Traveller follow-ups have nowhere to live (`I-01`, `FR-JW-24`).
   - `workspace_users` has no display name, no activation state and no directory readable by non-administrators. Owner names, the assign picker and AL-16 have nothing to read.
4. **No configuration store exists** for Readiness Templates, thresholds, categories or retention (G-09, DEP-12). **No scheduled job exists** for time-based alerts: `AD-WS11-005` Vercel Cron was designed but never built.
5. **`workspace_vendors` has no lifecycle column.** "Active vendors only" (`FR-JW-15`) cannot be enforced, and there is no way to create or list vendors in the application (UXO-05).

Seven Architecture Decisions (§6) close these gaps using existing patterns. One Engineering Phase 0 (§8) sequences them ahead of the UX build order.

**Overall Architecture Approval: Valid with Minor Updates** (§9). WS13 is **ready for Engineering Planning (`WS13-004`)**, subject to three conditions: Product Owner ratification of `AD-WS13-001`–`007`, Tiger scheduling CM-01/CM-02 inside WS13 engineering, and receipt of the configuration seed content (EP-02) and vendor data (EP-03) before the affected build phases.

---

## 2. Inputs Consumed and Evidence Base

| Source | Use |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-001-…-Business-Analysis.md` Revision 2 (Parts A–D; Appendix A for G-01–G-07) | Product baseline: lifecycle, objects, FRs, BRs, alerts, KPIs, CM-01–04, R-07 |
| `docs/09-Development/EBC-R1.3-WS13-001B-…-Synchronisation-Summary.md` | Decision map, I-01–I-04, items handed to Tiger |
| `EBC-R1.3-WS13-002` Revision 3 (Project Knowledge), repository Revision 2, and wireframes WF-01–07 | UX baseline, §32.1 architecture asks, UXO-01–11 |
| `docs/20-Architecture/workspace/` (Discovery, Solution, Domain Model, Data, Integration, Architectural Decisions) | Existing Workspace architecture baseline (WS11) |
| `EBC-R1.3-WS12-005` (Journey Planning Solution Architecture), `DEC-R1.3-013/014` | Bootstrap principle, conversion design, RBAC extension |
| `supabase/migrations/20260916…` to `20260922…` (15 Workspace migrations) | **Actual schema**, verified line by line |
| `web/lib/workspace/**`, `web/app/workspace/**`, `web/app/api/workspace/**`, `web/components/workspace/**` | **Actual implementation**, verified |
| `web/package.json` | Next.js 16.2.10, React 19.2.4, `@supabase/ssr` 0.12, `@supabase/supabase-js` 2.116. No ORM, no validation library. |

**Evidence labels used in this document:** **[F]** confirmed fact (repository evidence cited), **[O]** architectural observation, **[R]** risk, **[Rec]** recommendation, **[A]** assumption, **[Q]** open question.

---

## 3. Current-State Architecture (Repository Evidence)

### 3.1 What exists and is reused unchanged

| Capability | Evidence | WS13 use |
|---|---|---|
| Route segment, shell, navigation, `requireWorkspaceUser()` guard | `app/workspace/(dashboard)/layout.tsx`, `lib/workspace/shared/rbac/guard.ts` **[F]** | Replace `journey-workspace/page.tsx` (`ComingSoon`) **[F]** |
| Five-file module convention | `lib/workspace/journey-planning/{types,validation,repository,service}.ts` **[F]** | New `lib/workspace/journey-workspace/` |
| Record-scoped RBAC helpers (`canEditRecord`, `canAdvanceStage`, `canReassignRecord` for owner or admin; `canArchiveOutsideNormalClosure` for admin) | `shared/rbac/permissions.ts` **[F]** | Reused as-is. Their semantics already match WS13 §15 permissions, including "owner may assign own". |
| Generic ownership (conditional `UPDATE`) | `shared/ownership/service.ts` **[F]** | Reassign reused. Claim is not used (D-03: no unowned Journeys). |
| Append-only audit log, entity-agnostic | `workspace_audit_log`, index `(entity_type, entity_id, created_at desc)` **[F]** | Journey Timeline source (`FR-JW-02`, `30`) |
| Polymorphic tasks (`entity_type`/`entity_id`) | `workspace_tasks` **[F]** | Journey tasks with `entity_type = 'journey'` |
| Immutable Proposal Version snapshot | `workspace_proposal_versions.itinerary_snapshot`, `workspace_proposals.current_version_id` **[F]** | JW-03 Itinerary (`DEC-R1.3-014`) |
| API boundary and response helpers | `app/api/workspace/journey-planning/**`, `shared/api/respond.ts` **[F]** | New `app/api/workspace/journey-workspace/**` |
| Dashboard components (`KpiGrid`, `QuickActions`, `RecentActivityCard`, `UpcomingTasksCard`) | `components/workspace/dashboard/*`. Every value is a literal 0 or empty. **[F]** | Given live data (`FR-JW-32`–`34`) |

### 3.2 Gaps found (all additive)

| # | Gap | Evidence | Addressed by |
|---|---|---|---|
| GAP-01 | `workspace_journeys` holds only `id`, `journey_planning_record_id` (unique), `traveller_id`, `corporate_contact_id`, `status` (`active`/`completed`/`cancelled`) and timestamps. It has **no authenticated UPDATE policy** (writes happen only through the RPC). | `20260921070300_workspace_bootstrap_journeys.sql` **[F]** | AD-WS13-001, 002 |
| GAP-02 | The conversion RPC inserts only the party and `status='active'`. It sets no owner, destination, dates, trip parameters or proposal reference, writes audit entries **only against the planning record** (F-05), and **does not check that the caller may record the Decision**. It relies on the application layer, yet it is `grant execute … to authenticated`. | `20260921070600_workspace_journey_planning_conversion.sql` **[F]** | AD-WS13-003 |
| GAP-03 | `canRecordDecision` returns true for any Administrator, **even when the planning record has no owner**. A Journey could therefore be created with nothing to inherit (D-03). | `permissions.ts`, `service.ts::recordJourneyPlanningDecision` **[F]** | AD-WS13-003 (precondition) |
| GAP-04 | `workspace_notifications` has `is_read`/`read_at` only. There is **no condition key and no resolution state**. Its SELECT policy restricts rows to the recipient or an Administrator. | `20260921060100_…notifications.sql` **[F]** | AD-WS13-005 |
| GAP-05 | `workspace_tasks` has **no category and no follow-up kind** | `20260921060200_…tasks_and_follow_ups.sql` **[F]** | AD-WS13-006 |
| GAP-06 | `workspace_users` holds only `user_id`, `role` and timestamps: **no display name, no activation state**. SELECT is limited to one's own row or Administrators. The JP queue therefore displays **raw owner UUIDs** for other users. | `20260916090000_…users_and_roles.sql`; `JourneyPlanningQueueView.tsx:156` **[F]** | AD-WS13-007 |
| GAP-07 | `workspace_vendors` has **no `lifecycle_state`**, even though WS12-005 §6.4 and WS13-001 §4.2 both describe one. No application code reads or creates vendors. | `20260921070000_…travellers_and_vendors.sql`; `grep workspace_vendors web/` returns nothing **[F]** | AD-WS13-006, UXO-05 |
| GAP-08 | **No configuration store.** `workspace_configuration` (Data Architecture §3) was never migrated. | Migration list **[F]** | AD-WS13-006 |
| GAP-09 | **No scheduled job.** There is no `vercel.json`, no cron route and no `CRON_SECRET`. The WS12 "unclaimed" threshold alert has no sweep. | Repository search **[F]** | AD-WS13-005 |
| GAP-10 | `workspace_audit_log.actor_id` is `NOT NULL`, so there is **no way to record system-originated events** (alert raised or resolved, legacy backfill). | Audit migration **[F]** | AD-WS13-005 |
| GAP-11 | **The notification bell and NOT-01 Notification Log are placeholders.** Header search is disabled, and there is no global search. | `WorkspaceHeader.tsx:119` ("Notifications (coming soon)"), `NotificationAreaPlaceholder.tsx` **[F]** | Dependency PD-ARC-07 (scope, Tiger) |
| GAP-12 | The Dashboard has **no Journey Planning read functions**: "New Leads" is a literal 0 | `app/workspace/(dashboard)/page.tsx` **[F]** | Engineering item (JP read functions for the Dashboard) |

### 3.3 Pre-existing security observations (outside WS13 scope; disclosed, not fixed here)

| # | Observation | Evidence | Recommendation |
|---|---|---|---|
| SEC-01 | Every authenticated user can execute the conversion RPC for any record in the Decision stage, **bypassing `canRecordDecision`** | Conversion migration grant **[F]** | Fixed as part of the CM-01 RPC replacement (AD-WS13-003) |
| SEC-02 | Journey Planning tables use UPDATE policies of `using (true) with check (true)`. Record-scoped authorisation lives **only** in application code, contrary to the defence-in-depth intent of WS12-005 §7.4. | JP migrations **[F]** | WS13 does not repeat this (AD-WS13-002). Log `TD-WS12-004` for a later hardening. |
| SEC-03 | `workspace_notifications` INSERT is `with check (true)`: any user can write a notification to any user | Notifications migration **[F]** | System alerts written by the RPC or service role (AD-WS13-005). Log as TD. |
| SEC-04 | `workspace_journey_planning_records.owner_id` is `on delete set null`, and `workspace_users` cascades from `auth.users`. **Deleting an auth user silently un-assigns records.** | JP and users migrations **[F]** | Journeys use `on delete restrict` (AD-WS13-001). Deactivation, not deletion, is the user-exit path (AD-WS13-007). |

---

## 4. Architecture Validation by Scope Area

Legend: ✅ **Compliant**: the existing architecture supports it as-is. 🟡 **Compliant with additive update**: supported by extending existing patterns (the decision is named). 🔴 **Not supportable without a Product/UX change**: none found.

### 4.1 Domain Model

| Object | Result | Architecture treatment |
|---|---|---|
| **Journey** | 🟡 | Aggregate root, unchanged in principle. **Supersedes WS11 Domain Model §2.4** in two respects: (a) Journeys are **owned at creation** (D-03), not "created unclaimed by default"; (b) the lifecycle is a fixed, `CHECK`-constrained stage set (D-01), not the flexible `operational_stage` WS11 allowed while Phase 2 was unapproved. AD-WS13-001. |
| **Traveller** | ✅ | Referenced, not owned (`traveller_id` → bootstrap `workspace_travellers`, WS14). Companions are not modelled as Travellers in Release 1.3 (OQ-027): a document entry names them in free text. |
| **Journey Planning** | 🟡 | Remains a separate aggregate. The link from Journey to planning record is unchanged (unique FK). **Added:** `replaces_journey_id` on the planning record, for CM-02 (AD-WS13-003). |
| **Vendor Booking** | 🟡 | New child entity of Journey (`workspace_journey_vendor_bookings`). **Replaces** the WS11 Data Architecture name `workspace_vendor_confirmations` (D-07: "Vendor Confirmation" is a status, not an object). References a Vendor, which WS16 owns. |
| **Task / Follow-up** | 🟡 | Shared `workspace_tasks`, extended with `category` and `kind` (AD-WS13-006) |
| **Document Reference** (Document Requirement) | 🟡 | New Journey child entity with metadata only. **Replaces** the WS11 generic `workspace_documents`, which was never migrated. No storage (D-10; consistent with OQ-014 and "Supabase Storage not introduced"). |
| **Primary Operational Contact** | 🟡 | New Journey child entity, `workspace_journey_operational_contacts`, with `is_primary` and a partial unique index giving exactly one per Journey (BR-040). A separate table keeps D-12's "multiple contacts in future" additive. Distinct from party and owner. |
| **Journey Owner** | ✅ | The Generic Ownership column set (`owner_id`) on `workspace_journeys`, now `NOT NULL` for adopted Journeys with `on delete restrict` |
| **Readiness** | 🟡 | Template configuration plus stored manual item facts. **Overall and system-item states are derived, never stored** (AD-WS13-004). |
| **Alerts** | 🟡 | Condition-keyed, derived and reconciled into notifications (AD-WS13-005) |

**Conclusion:** the Domain Model is architecturally consistent with the frozen baseline. The WS11 Domain Model needs an **additive revision note**, not a rewrite (§7).

### 4.2 Data Model

| Item | Result | Validation |
|---|---|---|
| New entities | 🟡 | Six Journey child tables plus three configuration tables (§6, AD-WS13-001/004/006). All `workspace_`-prefixed, in `public`, with RLS. |
| New relationships | 🟡 | Journey → owner (`restrict`), accepted Proposal Version, Readiness Template, supersedes Journey. Planning record → replaced Journey. All plain FKs, per Data Architecture §8. |
| Lifecycle states | 🟡 | `stage` (7 values) plus orthogonal `outcome`, On Hold overlay and Archive overlay (AD-WS13-001) |
| Replacement Journey relationship | 🟡 | `workspace_journeys.supersedes_journey_id` (unique) is stored **once**, on the replacement. "Superseded by" is derived by reverse lookup, so there is a single source of truth and no two-sided drift. AD-WS13-003. |
| Superseded relationship | 🟡 | `outcome = 'superseded'` plus `outcome_reason = 'Material Amendment'`, set only inside the conversion transaction |
| Archive behaviour | 🟡 | Overlay columns (`archived_at`, `archived_by`, `archive_reason`), independent of stage and outcome (BR-038). Unarchive clears them. Every change is audited. There is no delete grant (AD-WS11-011). |
| Ownership | ✅ | Reuses `owner_id` and the reassign service. Reassign is blocked after a terminal outcome, in the RPC. |
| Task categorisation | 🟡 | `workspace_tasks.category` (configured values), `kind` (`task`/`follow_up`). A follow-up requires a due date. |
| Document metadata | 🟡 | Type, traveller(s), status, external reference, external link (`CHECK` on https URL), notes |
| Vendor Booking lifecycle | 🟡 | `status` CHECK over six values; `status_reason`, `status_changed_at`; `booking_reference` required when Booked (`CHECK`). Transitions are validated in an RPC. |

**OQ-025 (reclassified to Architecture): answered.** The Journey **stores its own copy** of the trip parameters (adults, children, infants, nights, departure city) and destination, snapshotted at conversion.
- The closed planning record is already immutable (FR-JW-06 AC4), so the copy cannot drift.
- Traveller count is material and immutable on the Journey (BR-031), which is snapshot semantics.
- The Journey aggregate stays self-contained for list filtering, search and indexing, without a cross-module join on every read.

### 4.3 Integration

| Integration | Result | Validation |
|---|---|---|
| **Journey Planning** | 🟡 **Prerequisite** | The conversion RPC and the JP Decision flow must change (CM-01, CM-02; AD-WS13-003). JP publishes two read functions for WS13: the accepted Proposal Version by id (JW-03), and replacement-planning status for a held Journey (UX §14.2). JP owns its dashboard counts (FR-JW-32 AC4), but the read functions do not yet exist (GAP-12). |
| **Traveller Hub** (WS14, not built) | ✅ | Reference-only through bootstrap `workspace_travellers`. Party links point there. When WS14 is built, the Journey needs no change. |
| **Vendor Management** (WS16, not built) | 🟡 | WS13 owns Journey Vendor Bookings; WS16 owns Vendors (D-07). Under the Bootstrap Ownership Principle, a minimal read-only `lib/workspace/vendor-management/` exposing `listActiveVendors()` is introduced, and a `lifecycle_state` column is added. Vendor data entry is UXO-05 (§5.1). |
| **Itinerary Studio** (WS15, not built) | ✅ | JW-03 renders the immutable accepted Proposal Version snapshot (`DEC-R1.3-014`). No Itinerary Studio call exists (UXD-JW-16). |
| **Dashboard** | 🟡 | Reads the Journey operational summary view (AD-WS13-004), tasks, notifications, the audit log (Recent Activity) and JP read functions. CM-03 is a one-line UI change. |
| **Notifications** | 🟡 | The data model needs condition keys and resolution (AD-WS13-005). **The bell and NOT-01 surfaces are not built** (GAP-11, PD-ARC-07). |
| **Authentication** | ✅ | Unchanged: Supabase Auth, `workspace_users`, `requireWorkspaceUser()`. A read-only user directory is added (AD-WS13-007). |
| **Audit Trail** | 🟡 | Reused. `event_type` CHECK extended (a precedent exists: `…task_events.sql`, `…trip_basics_event.sql`). Nullable actor for system events only (AD-WS13-005). All Journey-scoped events are written with `entity_type='journey'`, `entity_id=<journey id>`, so the Timeline is one indexed query. |

### 4.4 Journey Lifecycle

| Element | Result | Treatment |
|---|---|---|
| Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed | ✅ | `stage` CHECK: `confirmed`, `in_preparation`, `ready_to_travel`, `travelling`, `travel_complete`, `post_travel`, `journey_closed`. Transition table enforced in the RPC (§10.2 of the baseline), mirrored in `validation.ts` for UI gating. |
| **Journey Closed (product state) / Completed (UX label)** | ✅ | **One stored value, `journey_closed`.** "Completed" and "Mark as Completed" (UX-04, UX-08) are presentation labels mapped in the UI label file (as `journeyPlanningLabels.ts` does for JP). **No data value "completed" is introduced.** The legacy bootstrap `status` column's `'completed'` value is deprecated precisely to avoid this confusion (AD-WS13-001). |
| On Hold overlay | ✅ | `on_hold` boolean plus reason and since. **`stage` is not changed while on hold**, so "resume to held-from stage" is simply clearing the flag, with no stored "held-from" value to keep in sync. Allowed only from Confirmed, In Preparation or Ready to Travel. |
| Archived overlay | ✅ | Independent columns. Valid in any stage (BR-038). |
| Superseded relationship | ✅ | Terminal outcome, set only by the conversion transaction (AD-WS13-003) |
| Cancelled | ✅ | Terminal outcome. The stage is frozen at the stage reached, which the UX stepper requires ("Stepper frozen at the stage reached", §9.2). |
| Date gates (start or end date reached) | 🟡 | **Must be evaluated in the business time zone, not UTC.** Vercel functions and Postgres `now()` run in UTC; SMV operates in India. Configuration `business_timezone`, default `Asia/Kolkata` **[A]**, used by both SQL and TypeScript through one helper. |

### 4.5 Material Change Flow

```
Original Journey (Confirmed / In Preparation / Ready to Travel)
  │  RPC workspace_journey_start_material_change(journey, reason)      ── one transaction
  │    ├─ original: on_hold = true, reason "Material change: …"
  │    ├─ INSERT planning record (owner = Journey owner, party, destination, trip params,
  │    │                           replaces_journey_id = original)
  │    └─ audit: material_change_started (journey) + created (planning record)
  ▼
Replacement planning (standard WS12 lifecycle, unchanged)
  │  Decision = Confirmed → RPC workspace_convert_journey_planning_record(…, start, end)
  │    ├─ INSERT replacement Journey (stage confirmed, owner inherited, supersedes_journey_id = original)
  │    ├─ UPDATE original: outcome 'superseded', outcome_reason 'Material Amendment', on_hold = false
  │    ├─ close planning record (confirmed)
  │    └─ audit on all three entities; IN-05 to both owners
  ▼
Replacement Journey (Confirmed)  ⇄ linked ⇄  Original (Superseded, read-only)
```

| Need | Result | Treatment |
|---|---|---|
| Traceability | ✅ | Three FKs form a closed loop: planning record → `replaces_journey_id`; replacement → `journey_planning_record_id`; replacement → `supersedes_journey_id` |
| Historical linkage | ✅ | The original is never modified beyond outcome and hold. Its children remain readable. Nothing is copied or moved. |
| Reporting | ✅ | Superseded is a distinct outcome, never counted as Cancelled (FR-JW-12 AC4), and excluded from Active Journeys |
| Audit | ✅ | Every step is written in the same transaction as the state change it records |
| E-10 (replacement closed as Lost or Archived) | ✅ | No write needed. The original stays On Hold. The tracker reads the planning record's stage and outcome. A partial unique index allows at most one **open** replacement planning record per Journey, so a second attempt is possible after one closes. |
| Integrity guard | ✅ | Conversion of a replacement record requires the original to be On Hold and not terminal. Otherwise it is rejected with a specific error code. |

### 4.6 Vendor Booking

| Need | Result | Treatment |
|---|---|---|
| Lifecycle Draft → Requested → Pending Information → Confirmed → Booked; Cancelled terminal; re-entry to Requested; no "Amended" | ✅ | `status` CHECK plus an allowed-transition table in the RPC `workspace_journey_set_booking_status`. Pending Information and Cancelled require a reason; Booked requires a reference (DB `CHECK`). |
| State management | ✅ | `status_changed_at` (drives "days in status" and AL-05), `status_reason`. History comes from the audit log. No delete grant (BR-033). |
| Relationship to readiness | ✅ | **Derived.** "Supplier readiness complete" means every non-Cancelled booking is Booked, computed in the summary view. Nothing is stored. |
| Vendor ownership | ✅ | FK to `workspace_vendors` (`on delete restrict`). The Active-only check applies **on create** (FR-JW-15 AC1). Existing bookings with a now-Inactive vendor stay actionable (E-02). |

### 4.7 Readiness: derived, not stored (confirmed)

**Confirmed: readiness calculations remain derived.** Stored and derived facts are split as follows.

| Fact | Stored or derived | Reason |
|---|---|---|
| Template assignment (`readiness_template_id`) | Stored | A user decision (BR-041) |
| Manual item status (Outstanding / Complete / Not Applicable with reason) | Stored | A human fact that cannot be recomputed |
| System item status ("all bookings Booked", "all required documents Received or Verified") | **Derived** | FR-JW-23 AC3: "update automatically". Storing it would risk staleness. |
| Category counts (four categories) and overall state (Not Ready / At Risk / Ready) | **Derived** | FR-JW-22 AC2: "never set manually". At Risk depends on today and a configured window. |
| Readiness gate (BR-028) | Evaluated inside the transition RPC from the same derivation | Server-enforced; the UI gate is advisory |

The four readiness dimensions named in this EBC map to the approved categories: **Booking readiness** = Booking confirmations; **Supplier readiness** = Supplier readiness; **Traveller readiness** = Traveller readiness; **Documentation readiness** = Documentation. The mapping is 1:1 and needs no change.

### 4.8 Tasks and Follow-ups

| Need | Result | Treatment |
|---|---|---|
| Configurable categories | 🟡 | `workspace_tasks.category` validated against configuration (`task_categories`). Seeded with Operational, Traveller follow-up and Payment (FR-JW-24 minimum). |
| Reminders | ✅ | A reminder is the AL-12/13/14 alert raised on the due date. There is **no separate reminder object** (UX §10.5). |
| Payment follow-ups | ✅ | `category = 'payment'`. **No amount, currency, ledger or status field** (I-01). The Payments Due panel is a filtered task query. |
| Traveller follow-ups; operational tasks | ✅ | Categories |
| Extensibility | ✅ | A new category is a configuration row. Existing JP tasks keep `category NULL`, displayed as "Operational" by default. |
| **Journey owner cancelling a task they neither created nor are assigned** | 🟡 | The current RLS UPDATE policy allows assignee, creator or admin only. The Journey owner (FR-JW-24) is not covered. **[Rec]** Task status changes on Journey tasks go through the Journey service with an owner check, using an RPC or a policy extended with `workspace_can_edit_journey(entity_id)`. Rad chooses the mechanism. |

### 4.9 Documents

| Need | Result | Treatment |
|---|---|---|
| Metadata, status, verification, external links | ✅ | Columns listed in §4.2. Verified = owner-checked (status value). |
| No storage, no binary management | ✅ | No Storage bucket, no file column, no upload route. Consistent with AD-WS11 deferral of OQ-014. |
| **Sensitive external references** (passport or visa numbers; UX §32.1 item 8) | 🟡 | **[Rec]** (1) Masking to the last four characters is applied **server-side** in list read models, so the full value never enters list payloads; the full value is returned only by the owner or admin edit read. (2) **Audit `event_data` never stores reference values.** A reference change is logged as "external reference updated" without before and after values. This refines the UX §21 "before → after" convention for this one field (PD-ARC-09). (3) No encryption-at-rest beyond Supabase's platform default. None is required by the baseline. |

### 4.10 Dashboard

| Need | Result | Treatment |
|---|---|---|
| KPI calculations (Active Journeys, Upcoming Departures, Pending Vendor Confirmations, Tasks Due Today) | 🟡 | One SQL view, `workspace_journey_operational_summary`. **Every KPI, the summary strip, list filters and tab badges read the same view**, so counts equal list sizes (FR-JW-34 AC1; UX §32.1 item 1). |
| Operational widgets (Needs Attention, Today, Payments Due) | 🟡 | Derived alert conditions (AD-WS13-005) and task queries |
| Recent activity | ✅ | `workspace_audit_log` where `entity_type='journey'` and event type is in the FR-JW-33 list, newest first. **[Rec]** Add index `(entity_type, created_at desc)`. |
| Active journeys, pending bookings, payments due | ✅ | View and task queries, each capped at 5 rows with "View all (n)" |
| My Work / Team scope | ✅ | An `owner_id` / `assigned_to_user_id` filter in the service. Team visibility by role (UXO-08) is enforced in the application layer; RLS stays collaborative. |
| Journey Planning panels ("New Leads", JP panel) | 🟡 | Require new JP read functions (GAP-12). They are small and read-only, and their definitions are JP's own. |

---

## 5. Specific Validation Items

### 5.1 UXO-05: Vendor seeding dependency

**Facts:** `workspace_vendors` has no `lifecycle_state` column and no application read or write path. Vendors can exist today only through direct SQL **[F]**. WS16 is not scheduled **[F]**.

| Option | Assessment |
|---|---|
| **A. Data seeding (recommended).** Add `lifecycle_state` (`prospective`/`active`/`inactive`). The Product Owner supplies an initial vendor list (name, type, contact, state). Rad loads it with an **idempotent, environment-specific seed script** (`web/scripts/workspace/`, service role, upsert by name). It is **not** a migration, because vendor records are business data that differ between development and production. | No scope change, no new UI, reversible. Consistent with the Bootstrap Ownership Principle. Requires real data (no fabrication, §19). |
| B. Minimal vendor-create UI in WS13 | Pulls WS16 scope into WS13 (a D-07 boundary). Needs a Product Owner decision and UX. Not recommended for Release 1.3. |
| C. Inline vendor creation in the Add Booking panel | Contradicts D-07 (WS16 owns Vendors) and UX §11.3. Rejected. |

**Architectural approach: Option A**, plus a read-only `vendor-management` bootstrap module (`listActiveVendors`, `getVendorById`) so that `journey-workspace` never queries `workspace_vendors` directly (AD-WS11-004 dependency rule).

- **Existing vendor rows:** the column is added `NOT NULL DEFAULT 'active'`. **[A]** Existing rows are vendors SMV has already recorded quotations from. **The Product Owner should confirm this default** (EP-03).
- **Blocking:** JW-04 is usable only after seeding. This blocks Engineering Phase 2 verification, not Phase 0 or Phase 1.

### 5.2 UXO-11: Journey Planning dependency (Confirmed Travel Dates; Replacement Journey linkage)

**Implementation strategy:**

1. **Confirmed Travel Dates.** The JP Decision dialog (JP-13) captures `confirmed_start_date` and `confirmed_end_date` when the outcome is Confirmed. Both are required, End ≥ Start, and the Intended Travel Month is shown as a hint (UXO-11a). The dates pass **as RPC parameters** and are persisted **on the Journey only**. The planning record receives them in its `record_converted` audit `event_data` for traceability. **No new JP column is needed**, which keeps the WS12 schema change to one column (below).
2. **Replacement linkage.** Add `replaces_journey_id` (nullable FK) to `workspace_journey_planning_records`. It is set only by `workspace_journey_start_material_change`. The JP detail page shows the "Replacement planning for JRN-…" banner (UXO-11b) when it is set.
3. **Where the work sits.** WS12 is closed. **[Rec]** Execute CM-01, CM-02 and UXO-11 as **WS13 Engineering Phase 0**, explicitly scoped, followed by a **focused WS12 regression by Keerthi** (the Decision → Confirmed path, which QA has so far deliberately exercised sparingly per WS12-014 §108). This avoids reopening WS12. **Tiger decides** (EP-01).

### 5.3 CM-01: Journey Planning conversion update

| Change | Architecture |
|---|---|
| Signature | `workspace_convert_journey_planning_record(p_record_id, p_actor_id, p_confirmed_start_date date, p_confirmed_end_date date)` |
| **Old 2-argument overload** | **Must be dropped in the same migration.** Postgres overloads by argument list, so leaving it callable would bypass the date gate. Dropping a function is not data loss, but it is flagged for explicit approval at migration review. |
| New preconditions (in-function) | (1) Caller is the record owner or an Administrator. **This fixes SEC-01**; the RPC becomes self-authorising, like every WS13 RPC. (2) Record in `decision`. (3) Not already converted. (4) **Record has an owner.** Otherwise it raises `workspace_conversion_owner_required` (D-03, GAP-03; PD-ARC-01). (5) Dates present, End ≥ Start. |
| Carried to the Journey | Party; `owner_id` (= planning owner, D-03); `destination_region`; trip parameters (OQ-025); `accepted_proposal_version_id` (= `workspace_proposals.current_version_id`); dates; `journey_reference` (OQ-024); `stage='confirmed'`; `stage_changed_at` |
| Created with the Journey | Primary Operational Contact initialised from the party (I-04): Traveller → Individual traveller; Corporate Point of Contact → Corporate organisation. Name and contact copied. |
| Audit | Existing two planning-record entries, plus **a `created` entry on the Journey entity** (closes F-05 / G-03) |
| Notification | IN-01 "Journey confirmed" to the owner. Written in-transaction, because the RPC runs as definer. |

### 5.4 CM-02: Replacement Journey relationship

Specified in §4.5. There is one extra branch inside the same conversion RPC: `if v_record.replaces_journey_id is not null then … supersede …`. **The supersession happens in the same transaction as the creation of the replacement** (FR-JW-12 AC3: "automatically as part of the same business event").

### 5.5 CM-03: Dashboard action removal

| Item | Architecture |
|---|---|
| Change | Remove "Create Journey" (D-09) and "My Work" (UX-01) from `WORKSPACE_QUICK_ACTIONS` in `components/workspace/dashboard/QuickActions.tsx` **[F]** |
| Architectural impact | **None.** The buttons are unwired `<button>` elements with no route or API. No `/journey-workspace/new` route exists or may be created (FR-JW-05). **Structural guarantee:** Journey INSERT remains possible only inside the conversion RPC, because `workspace_journeys` has no INSERT grant for `authenticated`. |
| Sequencing | Independent. It can ship first, ahead of Phase 0. |

### 5.6 Risk R-07: Architectural impact evaluation

| Aspect | Assessment |
|---|---|
| Baseline statement | "CM-01 and CM-02 change the closed WS12 conversion; without a scheduled card WS13 cannot enforce D-02 and D-13." |
| **Architectural finding (stronger than stated)** | WS13's integrity constraints (`owner_id NOT NULL`, confirmed dates `NOT NULL` with End ≥ Start for adopted Journeys, a `stage` CHECK) would make the **current** RPC fail. The WS12 Decision → Confirmed path would then return a 500. **R-07 is therefore a deployment-coupling risk, not only a feature gap.** |
| Severity | **High** (delivery and regression) **[R]** |
| Mitigation (architecture) | (1) Ship the WS13 schema extension, the new conversion RPC and the JP Decision UI change **as one migration batch and one deployment**. (2) Apply migrations to the development database before QA. WS12-010V recorded a defect caused by unapplied migrations. (3) A focused WS12 regression covers the Decision paths (Confirmed, Lost, Archived) and the new owner-required and date errors. (4) Rollback: the migration is additive except for the old-overload drop, so rollback means re-creating the prior function body, which is kept in migration history. |
| Residual risk after mitigation | Low |

---

## 6. Architecture Decisions (ADRs), WS13

Only decisions that are **genuinely required** are recorded. Each extends an existing pattern, and none changes Product or UX behaviour. **Status of all seven: Proposed, awaiting Product Owner ratification** (Project Instructions §5, §10). The consolidated register entry is appended to `docs/20-Architecture/workspace/WORKSPACE-ARCHITECTURAL-DECISIONS.md` (§7).

### AD-WS13-001: Journey lifecycle persistence: fixed stage plus orthogonal outcome and overlays; extend the bootstrap table

- **Decision:** Extend `workspace_journeys` (never recreate it; `DEC-R1.3-013`) with:
  - `journey_reference` (unique);
  - `owner_id` (FK `workspace_users`, **on delete restrict**);
  - `destination_region`;
  - `confirmed_start_date` and `confirmed_end_date` (`CHECK end >= start`);
  - `adults`, `children`, `infants`, `nights`, `departure_city`;
  - `accepted_proposal_version_id`;
  - `stage` (CHECK, 7 values, default `confirmed`) and `stage_changed_at`;
  - `outcome` (`cancelled` | `superseded` | null) and `outcome_reason`;
  - `on_hold`, `on_hold_reason`, `on_hold_since`;
  - `closed_at` (set on entering `journey_closed`);
  - `archived_at`, `archived_by`, `archive_reason`;
  - `readiness_template_id`;
  - `supersedes_journey_id` (unique);
  - `adoption_status` (`adopted` | `legacy_pending`, default `adopted`);
  - `updated_by`.

  Integrity checks:
  - Owner and dates are required unless `adoption_status = 'legacy_pending'`.
  - `outcome` may be non-null only when `stage <> 'journey_closed'`.
  - `on_hold` may be true only in `confirmed`, `in_preparation` or `ready_to_travel`, with no outcome.

  "Terminal" is defined as `stage = 'journey_closed' OR outcome IS NOT NULL`.

  The existing `status` column is **deprecated, not dropped**. It is no longer read or written by WS13 code and is commented as deprecated. Its removal is logged as `TD-WS13-001` for a later, approved cleanup (no destructive change now).
- **Why:** D-01 fixed the lifecycle, so WS11's flexible `operational_stage` hedge (Domain Model §2.4) no longer applies. Orthogonal overlays match the UX exactly (UXD-JW-04): On Hold and Archived are overlays, while Cancelled and Superseded are end-caps on a frozen stage. Keeping `stage` unchanged while On Hold removes the need to store a "held-from" stage.
- **Alternatives rejected:** (a) a single `status` enum mixing stage, hold and archive, which conflates concepts and violates the WS11 Domain Model §4.2 principle "lifecycle independent of designation"; (b) a state-history table as the source of the current stage, which duplicates the audit log.
- **Legacy (BR-036, answering UXO-09):** a **hybrid**. The migration backfills only what is derivable without fabrication: owner (from the planning owner), destination, trip parameters, proposal version, POC from party, and a reference. Existing rows get `adoption_status='legacy_pending'`, and AL-02 is raised. Confirmed dates and the template **cannot be derived** (the planning record holds only an intended month), so an Administrator completes them in JW-17. This follows the WS12-013 "do not fabricate" precedent.

### AD-WS13-002: Journey aggregate writes go through transactional, self-authorising RPCs

- **Decision:** Every operation that **changes a lifecycle status, ownership, hold, outcome or archive state, or touches more than one row** is a `SECURITY DEFINER` function that:
  1. derives the actor from `auth.uid()`;
  2. checks owner-or-Administrator (or Administrator-only for archive, unarchive and legacy adoption) **inside the function**;
  3. validates the transition table and gates;
  4. writes the audit entry **in the same transaction**.

  The functions are:
  - `workspace_journey_transition`
  - `…_place_on_hold` / `…_resume`
  - `…_cancel` (including cancellation tasks for selected bookings)
  - `…_close`
  - `…_reassign`
  - `…_archive` / `…_unarchive`
  - `…_assign_template` / `…_change_template`
  - `…_set_booking_status`
  - `…_record_change` (a Change Record plus re-entry of affected bookings to Requested)
  - `…_start_material_change`
  - `…_adopt_legacy`

  `workspace_journeys` keeps **no direct UPDATE grant** for `authenticated`, as today. Single-row child writes (add booking draft, edit document fields, append note or activity, edit POC, manual readiness item) use RLS policies keyed on a new helper, `workspace_can_edit_journey(journey_id)` (owner or Administrator, and Journey not terminal). The service writes the audit entry.
- **Why:** WS11 Data Architecture §5 requires audit in the same transaction as the state change. WS12's service writes audit **after** a separate PostgREST update, which is not atomic. The Journey table already has no update policy, so RPC-only writes preserve the strongest existing posture. It also avoids repeating SEC-01 and SEC-02.
- **Alternatives rejected:** (a) the WS12 pattern (RLS `using(true)` plus an application check), which has no defence in depth and non-atomic audit; (b) triggers for audit, which hide business events and lose the "why".
- **Trade-off:** more SQL surface. It is mitigated by one shared transition table kept in lockstep with `validation.ts` (the same convention as the `types.ts` ↔ CHECK comment already used for notifications).

### AD-WS13-003: Conversion extension, Journey reference and supersession linkage (CM-01, CM-02; OQ-024)

- **Decision:** As specified in §5.3–§5.4.
  - The replacement link is stored once (`supersedes_journey_id` on the replacement) plus `replaces_journey_id` on the planning record. "Superseded by" is derived.
  - **OQ-024:** `journey_reference = 'JRN-' || nextval('workspace_journey_reference_seq')`, starting at 1001 (e.g. `JRN-1047`). The reference is human-readable, stable, unique and matches the UX's "JRN-····" rendering. It is assigned in the conversion RPC, and legacy rows are backfilled in creation order.
- **Alternatives rejected:** storing both link directions (two-sided drift); a date-encoded reference such as `JRN-2026-00047` (longer; the year becomes misleading once the Journey spans years). If the Product Owner prefers a different format, this is a one-line change before the first production conversion.

### AD-WS13-004: Operational state is derived through one summary view and one pure derivation module, not stored

- **Decision:** A `security_invoker` SQL view, `workspace_journey_operational_summary`, computes per Journey:
  - is_active, is_terminal;
  - days to departure (business time zone);
  - booking counts by status, and "n of m Booked";
  - document counts by status;
  - manual readiness items outstanding, and system items unmet;
  - readiness state (Not Ready / At Risk / Ready);
  - days on hold;
  - archive eligible (`closed_at` + retention < today).

  Lists, the summary strip, KPIs, tab badges and Dashboard panels all read it. A pure TypeScript module (`journey-workspace/derivations.ts`) turns a summary row into the **next action**, the **alert conditions** and **alert → deep-link target** (`/workspace/journey-workspace/[journeyId]?tab=<tab>&item=<id>`). The Dashboard, list rows, Overview, alert banners and the cron sweep all use this single function (UX §32.1 items 1, 3, 4, 7).
- **Why:** counts must equal filtered list sizes, and the same answer must appear everywhere. Stored counters and states drift, and readiness and alerts depend on today's date.
- **Alternatives rejected:** materialised columns maintained by triggers or cron (staleness, hidden writes); computing everything in TypeScript per request (divergence between SQL filters and UI counts).
- **Scale:** internal team tool (AD-WS11-001/005). A plain view is sufficient. A materialised view is a future option only if volume evidence appears.

### AD-WS13-005: Condition-keyed alerts: live derivation for display; reconciled notifications for delivery; a daily scheduled sweep; system actor in audit

- **Decision:**
  1. **Display** (Journey banner, list at-risk indicator, Needs Attention) derives conditions live through AD-WS13-004. This makes alerts visible to every viewer (collaborative visibility), which the recipient-scoped notifications RLS cannot provide.
  2. **Delivery and resolution:** extend `workspace_notifications` with `condition_key` (e.g. `journey:<id>:AL-05:booking:<id>`), `resolved_at` and `resolution` (`condition_cleared` | `journey_terminal` | `superseded`), plus a partial unique index on `(condition_key, recipient_user_id) WHERE resolved_at IS NULL`. The index enforces FR-JW-26 AC1 ("one active alert per condition") structurally. A reconciler inserts missing alerts and resolves cleared ones. **It runs synchronously after every Journey mutation** (for that Journey) **and in a daily sweep** for purely time-driven conditions. Reading or acknowledging never sets `resolved_at` (BR-017).
  3. **Scheduling:** the first implementation of AD-WS11-005. A `vercel.json` cron calls `app/api/workspace/cron/journey-alerts/route.ts`, authenticated by a `CRON_SECRET` bearer and running with the existing `SUPABASE_SECRET_KEY` server-side. Schedule: **daily at 00:30 IST (`30 19 * * *` UTC)**. Daily granularity matches every threshold, since all are expressed in days.
  4. **Audit:** allow `workspace_audit_log.actor_id` to be NULL **only** for system event types (`alert_raised`, `alert_resolved`, `legacy_backfilled`), enforced by a CHECK. The Timeline shows these as "Workspace (automatic)". This refines the UX History actor display (PD-ARC-08).
- **Why:** alert resolution must be condition-based and deduplicated (BR-017, BR-042), and no scheduling capability exists (GAP-09). A daily cron is the smallest mechanism already approved in principle.
- **Alternatives rejected:** a queue or third-party scheduler (AD-WS11-005 rejected these); cron-only derivation (stale for up to 24 hours on screen); notifications as the display source (not visible to other viewers).

### AD-WS13-006: Database-backed configuration; bootstrap `settings` and `vendor-management` read modules; task category; vendor lifecycle

- **Decision:**
  - `workspace_configuration` (`key` PK, `value` jsonb, `description`, `updated_by`, `updated_at`), seeded by migration with Release 1.3 defaults: alert thresholds and windows (§16 of the baseline), departure window, retention of 60 days, business time zone, and category lists (service categories, document types, task categories, operational change categories).
  - `workspace_readiness_templates` and `workspace_readiness_template_items` (category CHECK over the 4 values, `item_kind` `system|manual`, `system_rule` key, optional `document_type`), seeded with **Domestic** and **International**.
  - `workspace_journey_readiness_items` holds each Journey's derived-from-template and manual items.
  - A read-only `lib/workspace/settings/` module (`getWorkspaceConfiguration`, `listReadinessTemplates`) and `lib/workspace/vendor-management/` (`listActiveVendors`).
  - `workspace_tasks` gains `category` (nullable) and `kind` (`task` | `follow_up`, default `task`; follow-up requires `due_at`).
  - `workspace_vendors` gains `lifecycle_state`.
  - Editing the configuration has **no UI in Release 1.3** (DEP-12). An Administrator changes it as a data change (SQL or Supabase dashboard), with **no code change**, which satisfies FR-JW-26 AC3 and FR-JW-23 AC1.
- **Why:** D-04, D-05, D-08 and BR-018/041/042 require configuration over code. The WS11 Data Architecture already assigned `workspace_configuration` to `settings`.
- **Alternatives rejected:** TypeScript config in `web/config/*.ts`, which needs a code change and deployment to change a threshold and would violate FR-JW-26 AC3.
- **Content dependency:** default template items and category values are **product content, not architecture** (EP-02). The architecture does not invent them.

### AD-WS13-007: Workspace User directory and activation state

- **Decision:**
  - Add `workspace_users.deactivated_at` (nullable) and `display_name` (nullable). The existing `deriveWorkspaceDisplayName` fallback continues to apply when `display_name` is null.
  - Add a `SECURITY DEFINER` function, `workspace_user_directory()`, returning `user_id`, display name, role and `is_active` for **all** Workspace Users to any authenticated user. It exposes no email, and the `workspace_users` table RLS stays unchanged.
  - `requireWorkspaceUser()` rejects deactivated users.
  - AL-16 evaluates `is_active` for the Journey owner.
  - Deactivation replaces deletion as the user-exit path (SEC-04). Setting `deactivated_at` is an Administrator data operation in Release 1.3; a user-management UI remains out of scope.
- **Why:** owner names on every row (FR-JW-03 AC3), the assign and reassign picker (UX §16), Task assignment "to any Workspace User" (FR-JW-24) and AL-16/E-06 all need data that does not exist today (GAP-06). The JP queue's raw-UUID display shows the gap is already visible to users.
- **Alternatives rejected:** opening `workspace_users` SELECT to all users, which exposes more than needed and changes a foundation RLS policy; reading `auth.users` from the browser, which is impossible and unsafe.

---

## 7. Updates to Existing Architecture Documents (additive only)

Following the supersede-not-delete convention, **no existing text is rewritten**. An additive "WS13 Revision Note" section is appended to each document.

| Document | Change |
|---|---|
| `docs/20-Architecture/workspace/WORKSPACE-ARCHITECTURAL-DECISIONS.md` | New §8 "WS13 Decisions (Proposed)" registering AD-WS13-001–007, with a pointer to this report |
| `docs/20-Architecture/workspace/WORKSPACE-DOMAIN-MODEL.md` | New §7 note: §2.4 superseded on ownership (D-03) and lifecycle (D-01); Journey child entities renamed (Vendor Booking, Document Requirement, Readiness Item, Change Record, Primary Operational Contact, Journey Activity) |
| `docs/20-Architecture/workspace/WORKSPACE-DATA-ARCHITECTURE.md` | New §10 note: `journey-workspace` table list updated; `workspace_vendor_confirmations`, `workspace_operational_readiness_items` and `workspace_documents` superseded by the WS13 names; configuration tables; notification and task extensions |
| `docs/20-Architecture/workspace/WORKSPACE-INTEGRATION-ARCHITECTURE.md` | New §8 note: first Vercel Cron (daily journey-alerts sweep); `vendor-management` and `settings` bootstrap read modules; the JP ↔ WS13 conversion contract |

---

## 8. Engineering Impact Assessment

### 8.1 Target structure

```
supabase/migrations/2026MMDD…  (Phase 0 batch; exact names and order are Rad's)
  1  shared: workspace_users (+display_name, +deactivated_at), workspace_user_directory()
  2  shared: workspace_audit_log (event types +, nullable system actor CHECK, feed index)
  3  shared: workspace_notifications (+condition_key, +resolved_at, +resolution, unique partial index)
  4  shared: workspace_tasks (+category, +kind, follow-up CHECK)
  5  settings: workspace_configuration + seed; readiness templates + template items + seed
  6  vendor-management (bootstrap): workspace_vendors (+lifecycle_state)
  7  journey-workspace: workspace_journeys extension, reference sequence, legacy backfill (AD-WS13-001)
  8  journey-workspace: child tables: operational_contacts, vendor_bookings, readiness_items,
                        document_requirements, change_records, activities (+RLS via workspace_can_edit_journey)
  9  journey-workspace: workspace_journey_operational_summary view
 10  journey-planning: +replaces_journey_id; conversion RPC v2 (drop old overload)
 11  journey-workspace: lifecycle / booking / change / archive / material-change / adoption RPCs

web/lib/workspace/journey-workspace/{types,validation,repository,service,client,derivations}.ts
web/lib/workspace/settings/{types,repository,service}.ts                (read-only bootstrap)
web/lib/workspace/vendor-management/{types,repository,service}.ts       (read-only bootstrap)
web/app/workspace/(dashboard)/journey-workspace/page.tsx                 JW-01
web/app/workspace/(dashboard)/journey-workspace/closed/page.tsx          JW-11
web/app/workspace/(dashboard)/journey-workspace/[journeyId]/page.tsx     JW-02…09 (?tab=…)
web/app/api/workspace/journey-workspace/[journeyId]/{transition,hold,resume,cancel,close,
        reassign,archive,unarchive,contact,template,readiness-items,bookings,
        bookings/[bookingId]/status,documents,change-records,activities,tasks,
        material-change,adopt}/route.ts
web/app/api/workspace/cron/journey-alerts/route.ts
vercel.json  (cron entry)
web/components/workspace/journey-workspace/*   (Workspace-native; no new dependency)
```

`derivations.ts` is a sixth, **pure** file (no I/O). It is justified because the cron route and the service must share it without importing each other, and it is unit-verifiable in the repository's existing `verify:*` script style. This is disclosed as a minor extension of the five-file convention.

### 8.2 Sequencing

| Phase | Content | Depends on | Blocks |
|---|---|---|---|
| **CM-03 (independent)** | Remove "Create Journey" and "My Work" Quick Actions | Nothing | Nothing. It can ship first. |
| **Phase 0: Foundation and entry point** | Migration batch §8.1 (1–11); CM-01, CM-02 and UXO-11 in the JP Decision dialog and JP detail banner; JP service call to RPC v2; `settings`, `vendor-management` and directory read modules; notification reconciler; legacy backfill; **focused WS12 regression** | EP-01 (Tiger scheduling), EP-02 (seed content for migration 5), Sophie's WS12-004 addendum (UXO-11) | Every other phase |
| Phase 1 | JW-01 list and summary strip, JW-02 header and Overview, lifecycle dialogs (JW-12), History (JW-08), POC (JW-15), assign and reassign (JW-17), legacy adoption panel | Phase 0 | — |
| Phase 2 | Vendor Bookings (JW-04, JW-16), Readiness (JW-05), Documents (JW-07), Tasks with categories (JW-06), Activity & Changes (JW-09), alert banners | Phase 1; **EP-03 vendor seeding** (for JW-04 verification) | — |
| Phase 3 | Dashboard live KPIs and panels (including JP read functions), JW-11, archive and unarchive, cron sweep plus `CRON_SECRET`; notification bell and NOT-01 **if scoped** (EP-05) | Phase 2; EP-04 | — |
| Phase 4 | Material change end to end (JW-13 → JP → supersession), IN-05 | Phase 0 (RPC already in place), Phase 1 | Keerthi IF-08 |

Phase 0 is the only structural addition to Sophie's four-phase order (UX §32.2).

### 8.3 Engineering Prerequisites

| ID | Prerequisite | Owner | Needed before |
|---|---|---|---|
| **EP-01** | Schedule CM-01/CM-02/UXO-11 inside WS13 Engineering (recommended) or as a separate WS12 change card; Sophie's WS12-004 addendum (date fields in the Decision dialog, including the owner-required and date error messages, and the replacement banner) | Tiger, Sophie | Phase 0 |
| **EP-02** | **Seed content:** Domestic and International Readiness Template items (per category, marking which are system items); service categories; document types; operational change categories (UX §14.1 lists five; confirm); confirm the three task categories | Arjun → Product Owner | Phase 0 (migration 5) |
| **EP-03** | **Vendor data:** an initial Active vendor list for development and production; confirm the `active` default for existing vendor rows | Product Owner | Phase 2 verification |
| **EP-04** | New environment variable **`CRON_SECRET`** (Vercel Production and Preview; a generated random secret, set in Vercel Project Settings → Environment Variables). Confirm that the Vercel plan permits one daily cron. Existing variables reused: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`. | Product Owner / Rad | Phase 3 |
| **EP-05** | Scope decision: build the **notification bell and NOT-01**, and **global search**, inside WS13, or defer them. FR-JW-27 (Informational notifications "acknowledgeable") and FR-JW-29 AC1 ("always in global search") depend on them. | Tiger → Product Owner | Phase 3 planning |
| **EP-06** | Answers to PD-ARC-01–03 and to UXO-04 and UXO-07 (§10) | Arjun → Product Owner | Before the affected build item (non-blocking for Phase 0 design) |
| **EP-07** | Governance hygiene: file `WS13-001C` (including the I-01 confirmation); sync the repository WS13-002 to Revision 3 | Tiger | Before Engineering Planning sign-off |
| **EP-08** | Migration discipline: apply every Phase 0 migration to the development database before QA begins, and record `supabase migration list` parity (lesson from WS12-010V) | Rad / Product Owner | Each QA cycle |
| **EP-09** | Confirm the business time zone default `Asia/Kolkata` | Product Owner | Phase 0 |

### 8.4 Implementation notes for Rad (constraints, not design)

- **No new npm dependency.** Stepper, drawers and segmented controls are Workspace-native (`DEC-R1.3-014`). Scheduling is Vercel's native cron.
- Keep the **transition tables** in `validation.ts` and in the RPCs in lockstep. Each carries a comment naming the other, following the existing `types.ts` ↔ CHECK convention.
- Every RPC returns specific error codes (e.g. `journey_readiness_gate_unmet`, `journey_start_date_not_reached`, `journey_terminal`, `workspace_conversion_owner_required`), so the UX can show field-specific guidance (FR-JW-09 AC1; UX §9.3 "never a generic error").
- **Optimistic concurrency:** transition RPCs accept `p_expected_stage`, so a stale page is rejected with a specific code (UX §9.3 "server rejection shows the specific reason and refreshes").
- The legacy backfill must work for **0..N** existing rows. **[A]** The number of development-database Journeys created by WS12 QA is unknown. No production data is modified outside an approved migration.
- `adults` on legacy planning records may be NULL (WS12-013 nullable decision). The carried value stays NULL for legacy Journeys. **[F]**

### 8.5 Effort indication (relative, for Tiger's planning; not a commitment)

| Phase | Relative size | Main risk |
|---|---|---|
| CM-03 | XS | — |
| Phase 0 | **L** | RPC correctness and the WS12 regression (R-07) |
| Phase 1 | M | Lifecycle gating edge cases |
| Phase 2 | L | Breadth (five tabs) |
| Phase 3 | M (L if EP-05 includes bell, NOT-01 and search) | Scope decision |
| Phase 4 | S–M | Cross-module end-to-end |

---

## 9. Architecture Approval

### **Verdict: Valid with Minor Updates**

| Criterion | Result |
|---|---|
| Frozen Product baseline implementable without change | ✅ All 34 FRs and BR-025–042 are supportable. No requirement conflicts with the architecture. |
| Frozen UX baseline implementable without change | ✅ All screens JW-01–17, DASH-01/02, the flows IF-01–14 and the ten §32.1 asks are supportable. Four minor UX-facing clarifications are raised as dependencies (PD-ARC-05, 06, 08, 09), none of which changes an approved design. |
| Existing stack and patterns preserved | ✅ No new dependency, infrastructure, schema or database technology. The existing conventions are extended. |
| Architectural updates required | **Minor and additive:** seven Proposed decisions (§6), four additive document notes (§7), one migration batch. |
| Why not "Fully Valid" | The bootstrap schema, the conversion RPC and three shared foundations must be extended first (GAP-01–10), and the conversion change is deployment-coupled with WS12 (R-07). |
| Why not "Requires Product Decision" | No Product decision **blocks** Engineering Planning. PD-ARC-01–03 have safe architectural defaults (§10) and can be confirmed during Phase 0. |
| Why not "Requires UX Revision" | No approved screen, flow or state needs redesign. UXO-11 (Sophie's WS12-004 addendum) was already planned by the UX baseline itself. |

**Supporting evidence:** §3 (repository facts with file references), §4–§5 (area-by-area validation), §6 (decisions with rejected alternatives).

---

## 10. Dependencies Raised (formal hand-back; baselines not modified)

| ID | To | Item | Architectural default (applied unless told otherwise) | Blocking? |
|---|---|---|---|---|
| **PD-ARC-01** | Arjun → Product Owner | A Journey Planning record in Decision **with no owner** (possible when an Administrator records the Decision). D-03 requires an inherited owner. | Conversion is **rejected** with "Assign an owner before confirming". The Administrator assigns, then confirms. No Journey is ever created unowned. | No |
| **PD-ARC-02** | Arjun → Product Owner | **Nights vs confirmed dates.** The planning `nights` value may disagree with (end − start). | The Journey stores the planning value (carried parameter). The UI displays nights **derived from the confirmed dates** as authoritative, and the JP Decision dialog warns (does not block) on a mismatch. | No |
| **PD-ARC-03** | Arjun → Product Owner | The replacement planning record's **origin channel** (the CHECK allows 8 values), **starting stage** and title | `origin_channel = 'existing_traveller'`; stage `lead_created`; owner = Journey owner; title "Replacement for JRN-…". Traceability comes from `replaces_journey_id`. | No |
| PD-ARC-04 | Arjun | UXO-04 (template change: do manual items survive?) and UXO-07 (is an archived non-terminal Journey read-only?) | The schema supports both. Defaults: keep manual items and N/A decisions for matching items; an archived Journey is read-only with alerts suspended. | Before the template-change and archive items |
| PD-ARC-05 | Sophie (minor) | "Suggested Domestic / International" template (UX §9.3) **cannot be computed** in Release 1.3: `destination_region` is free text and no destination classification exists (WS17 is not built). | No pre-selection. The owner chooses. The suggestion appears once a classification source exists. | No |
| PD-ARC-06 | Sophie (minor) | The UX tracker shows "JP-····", but **planning records have no human-readable reference** | The tracker shows the planning record title with a link. A JP reference is a possible later WS12 enhancement. | No |
| **PD-ARC-07** | Tiger → Product Owner | **Notification bell, NOT-01 and global search do not exist** (GAP-11). FR-JW-27 and FR-JW-29 AC1 depend on them. | Architecture supports them (AD-WS13-005 data model). Scope and sequencing belong to Tiger (EP-05). | Phase 3 only |
| PD-ARC-08 | Sophie (minor) | System-originated History events (alert raised or resolved, legacy backfill) have no human actor | Shown as "Workspace (automatic)" | No |
| PD-ARC-09 | Sophie (minor) | Document external reference: server-side masking; **no before/after values in History** for this field | "External reference updated" without values | No |
| PD-ARC-10 | Tiger | AL-16 requires user deactivation. No deactivation capability exists. | `deactivated_at` set by an Administrator as a data operation (AD-WS13-007). A user-management UI is not in scope. | No |

---

## 11. Risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **R-07** (baseline) | CM-01/CM-02 are deployment-coupled with the WS13 schema (§5.6) | **High → Low** after mitigation | Phase 0 single batch, WS12 regression, EP-01 |
| R-ARC-JW-01 | The transition logic in the RPCs and in `validation.ts` diverges | Medium | Lockstep comments; Keerthi's action-matrix tests (UX §9.3) run against the server, not only the UI |
| R-ARC-JW-02 | Time-zone errors on date gates and alerts (UTC vs IST) | Medium | One business-time-zone helper in SQL and TypeScript (EP-09); targeted tests on the day boundary |
| R-ARC-JW-03 | Seed content (EP-02) or vendor data (EP-03) arrives late | Medium | Phase 0 schema can be built with placeholder **configuration keys only**, never fabricated item content. Verification waits for the real content. |
| R-ARC-JW-04 | Sensitive document references leak into logs or list payloads | Medium | §4.9 recommendations; code review checklist item |
| R-ARC-JW-05 | Notification noise or duplication | Low | Unique partial index, reconciler, BR-042 |
| R-ARC-JW-06 | Pre-existing security posture (SEC-01–04) | Medium (existing) | SEC-01 fixed in Phase 0. SEC-02/03 logged as technical debt for a later hardening card (Tiger). |
| R-08 (baseline) | I-01 changes to a real payment object | Scope | Architecture is unaffected until decided. A real payment object would need its own ADR and schema. |

---

## 12. Assumptions and Open Questions

| ID | Type | Statement |
|---|---|---|
| A-JW-01 | [A] | Release 1.3 business time zone is `Asia/Kolkata` (EP-09) |
| A-JW-02 | [A] | Existing `workspace_vendors` rows are Active (EP-03) |
| A-JW-03 | [A] | The Vercel plan permits at least one daily cron (EP-04) |
| A-JW-04 | [A] | The number of legacy Journeys in each environment is unknown; the backfill handles 0..N |
| Q-JW-01 | [Q] | Should the old `status` column be removed after WS13 stabilises? (`TD-WS13-001`, Tiger) |
| Q-JW-02 | [Q] | Should SEC-02/SEC-03 hardening be scheduled in Release 1.3 or later? (Tiger) |

---

## 13. Handover: Architecture Validation Summary for Tiger

| Item | Summary |
|---|---|
| **Overall architectural status** | **Valid with Minor Updates.** The frozen Product (Rev 2) and UX (Rev 3) baselines are implementable within the existing Workspace architecture, with no redesign, no new dependency and no Product or UX change. |
| **Required architectural updates** | Seven Proposed decisions for Product Owner ratification. AD-WS13-001: lifecycle persistence. AD-WS13-002: transactional, self-authorising RPCs. AD-WS13-003: conversion, reference `JRN-####` and supersession. AD-WS13-004: derived operational summary. AD-WS13-005: condition-keyed alerts and daily cron. AD-WS13-006: database configuration, task category, vendor lifecycle. AD-WS13-007: user directory and deactivation. Plus four additive architecture-document notes. |
| **Engineering prerequisites** | EP-01 schedule CM-01/CM-02/UXO-11 as WS13 Phase 0 (recommended). EP-02 seed content. EP-03 vendor data. EP-04 `CRON_SECRET`. EP-05 bell, NOT-01 and search scope. EP-06 PD-ARC answers. EP-07 file 001C and sync WS13-002 Rev 3. EP-08 migration parity. EP-09 time zone. |
| **Risks for Product Owner awareness** | **R-07 is a deployment coupling:** WS13 constraints would break the current WS12 conversion unless shipped together. Pre-existing: the conversion RPC performs no authorisation of its own (SEC-01, fixed in Phase 0), and permissive JP update policies (SEC-02, technical debt). Notification and search surfaces are not built (PD-ARC-07). |
| **Recommendation** | **WS13 is ready for Engineering Planning (`EBC-R1.3-WS13-004`, Rad)** once the Product Owner ratifies AD-WS13-001–007 and Tiger decides EP-01 and EP-05. EP-02 and EP-03 are needed before Phase 0 migration 5 and Phase 2 verification respectively, not before planning starts. |

---

## 14. Deliverables and Files

| Deliverable | Location |
|---|---|
| 1. Architecture Validation Report | This document: `docs/09-Development/EBC-R1.3-WS13-003-ARCHIE-Journey-Workspace-Architecture-Validation-and-Solution-Alignment.md` (§3–§5, §9–§12) |
| 2. Architecture Decision Records | §6 (full), registered additively in `docs/20-Architecture/workspace/WORKSPACE-ARCHITECTURAL-DECISIONS.md` §8 |
| 3. Engineering Impact Assessment | §8 |
| 4. Architecture Approval | §9: **Valid with Minor Updates** |
| Handover | §13 |
| Additive revision notes | `WORKSPACE-DOMAIN-MODEL.md` §7, `WORKSPACE-DATA-ARCHITECTURE.md` §10, `WORKSPACE-INTEGRATION-ARCHITECTURE.md` §8 |

## Confirmations

- Architecture validation only. **No Product requirement, business rule, lifecycle state, term, UX screen or flow was changed.** Every item that touches Product or UX is raised as a dependency in §10.
- No application code, migration, database or configuration was modified. No SQL was run.
- No folder was created, renamed, moved or reorganised. One new file was added to an existing folder, and additive sections were appended to four existing architecture documents.
- No secret value was read or recorded. Only environment-variable **names** are cited.
- Nothing committed or pushed.

---

*Prepared by Archie, Solution Architect, on behalf of Team Satvi, per EBC-R1.3-WS13-003. Architecture validated and handed to Tiger; not self-approved. AD-WS13-001–007 await Product Owner ratification.*

---

## 15. Revision Note: Alignment with POD-01–08 and PD-A–E (`EBC-R1.3-WS13-004A`, 27 September 2026)

*Additive note. The text above is retained as written for traceability. Where this note and the text above differ, **this note governs**. Full mapping: `EBC-R1.3-WS13-004A-ARCHIE-Architecture-Clarification-Note-Replacement-Journey-Mapping.md`.*

| Earlier statement in this report | Now | Source |
|---|---|---|
| PD-ARC-02: dates–nights mismatch **warns** | **Blocks** conversion. Null nights also blocks ("nights required"). No auto-correction. | POD-06 Policy 2; PD-A |
| PD-ARC-01 / PD-ARC-03 defaults | Confirmed as Product decisions | POD-06 Policies 1 and 3 |
| PD-ARC-04 (template change; archived Journey read-only) | Confirmed | POD-08 |
| AD-WS13-002 function list and §8.1 route list include `…_unarchive` / `unarchive`; Phase 3 "archive and unarchive" | **Withdrawn.** No unarchive in Release 1.3. Archived Journeys are read-only, and every Journey RPC and RLS helper rejects archived Journeys. | POD-08; PD-E |
| Journey model (AD-WS13-001) has no Service Category | Adds `service_category` (a configured code) on the Journey: required for adopted and new Journeys, **nullable while `legacy_pending`**, with no default or backfill. Optional `service_category` on the planning record; required at conversion; changed later via an audited RPC. | POD-02; POD-07; PD-A; PD-C |
| AD-WS13-006: vendors gain `lifecycle_state` only | Vendor baseline attributes are added (service type, destinations served, address, phone, email, contracted-rates link), plus **`vendor_code` `VEN-XXXXX`**, which is system-generated and immutable | POD-05; PD-D |
| "Document Requirement"; bookings' "service category"; Change Record without a category | **Journey Document** (`workspace_journey_documents`, references a Document Type); booking **`service_type`**; **`change_category`** required on Change Records (classification only) | POD-03; I-06; POD-04 |
| Replacement Journey context | The replacement mapping is defined in WS13-004A §4 (AC-01–AC-07), using existing structures only | PD-B |

No Architecture Decision is added, removed or reversed. AD-WS13-001–007 still await Product Owner ratification.
