# EBC-R1.3-WS13-005-P0 — Phase 0 Engineering Completion Report

| Field | Value |
|---|---|
| Card | EBC-R1.3-WS13-005-P0 — Phase 0 Engineering Authorisation (Tiger) |
| Persona | Rad — Engineering & Implementation Specialist |
| Release / Workstream | Release 1.3 / WS13 Journey Workspace |
| Branch | `feature/r1.3-ws13-journey-workspace` |
| Parent commit | `ba63140` (Phase A closure, DEC-R1.3-019/020) |
| Plan reference | EBC-R1.3-WS13-004 §4–§6 (WP-0.1 … WP-0.14) |
| Date | 2026-09-28 |
| Status | **Engineering complete — migrations PREPARED, NOT APPLIED.** Handed to Tiger for coordination; Vivek executes the migration sequence. |

Rad's technical completion does not equal Keerthi's functional approval, Sri's experience approval or Product Owner acceptance.

---

## 1. Engineering Summary

Phase 0 delivers the WS13 database foundation and the new Journey Planning → Journey conversion. It does not include any Journey Workspace screens (Phase 1+).

- **10 migrations (M01–M10)** extend the WS11/WS12 schema without re-creating anything (DEC-R1.3-013):
  - user directory and deactivation;
  - WS13 audit events;
  - condition-keyed notifications;
  - task category/kind;
  - database configuration and readiness templates;
  - vendor baseline (`VEN-00001`);
  - Journey lifecycle (AD-WS13-001) with `JRN-####` reference;
  - Journey child tables with RLS;
  - derived operational summary view (AD-WS13-004);
  - conversion v2 (AD-WS13-003).
- **Conversion v2** (CM-01, CM-02, CM-05, CM-07, PD-A, BR-046, WS13-004A AC-01..07). The Confirmed decision now:
  - requires confirmed travel dates, nights, a Service Category and an owner;
  - blocks when the dates and nights disagree (POD-06);
  - checks that the actor is the owner or an Administrator, which also fixes SEC-01;
  - creates an adopted Journey with a `JRN-####` reference.
  - For a replacement it also: carries the operational contact and documents (Verified→Received, N/A→Outstanding); supersedes the original Journey; raises IN-01/IN-05.
- **Supporting backend:** new modules in the established convention (`types / validation / repository / service`) for settings, users, vendor management, business date and journey-workspace, plus pure derivations and transition tables for later phases.
- **JP UI (UX Rev 4a §36.2/§36.3):**
  - Service Category field in Trip Basics and New Record, tagged "Needed to confirm";
  - new `ConfirmJourneyDialog` for the Confirmed outcome;
  - success toast with the Journey reference.
- **Legacy data:** existing Journeys become `legacy_pending` with only non-fabricated values backfilled (BR-036, PD-C). Nothing is deleted.

## 2. Implementation Coverage (WS13-004 work packages)

| WP | Scope | Delivered in | Status |
|---|---|---|---|
| WP-0.1 | User directory, display name, deactivation (AD-WS13-007) | M01; `lib/workspace/shared/users/*`; auth `fetchWorkspaceUserAccess` + deactivated → unauthorized | Done |
| WP-0.2 | Audit event types, system actor | M02; `shared/audit/types.ts`, `repository.ts`; labels | Done |
| WP-0.3 | Condition-keyed notifications (AD-WS13-005) | M03 (columns, resolution, partial unique index); types/repository | Schema done. Raise/resolve condition functions deferred to P3 (Deviation ED-05). |
| WP-0.4 | Task category / follow-up kind | M04; tasks types/repository | Done |
| WP-0.5 | Configuration + readiness templates (AD-WS13-006, POD-01..04) | M05; `lib/workspace/settings/*` | Done. `document_types` and `vendor_service_types` seeded empty (EP-02 pending). Template items pending (EP-02; seeded by M05b in Phase 2). |
| WP-0.6 | Vendor baseline (POD-05, PD-D) | M06; `lib/workspace/vendor-management/*` | Done |
| WP-0.7 | Journey lifecycle extension (AD-WS13-001/003) | M07; `journey-workspace/types.ts`, `validation.ts`, `repository.ts` | Done |
| WP-0.8 | Journey child tables + RLS | M08 | Done |
| WP-0.9 | Operational summary view (AD-WS13-004) | M09; `journey-workspace/derivations.ts` (TS mirror) | Done |
| WP-0.10 | Conversion v2 RPC | M10 | Done |
| WP-0.11 | JP service / API / validation for conversion | `journey-planning/{types,validation,repository,service}.ts`; `decision`, `trip-basics`, create routes | Done |
| WP-0.12 | JP UI: Service Category + Confirm dialog | `TripBasicsPanel`, `NewJourneyPlanningRecordForm`, `JourneyPlanningRecordDetailView`, `ConfirmJourneyDialog`, `useServiceCategoryOptions`; `/api/workspace/journey-workspace/reference-data` | Done |
| WP-0.13 | Verification scripts | `verify:journey-workspace-{transitions,derivations,dates,config}` | Done (181 checks) |
| WP-0.14 | Focused WS12 regression (engineering side) | §9 | Done. Functional regression is handed to Keerthi. |

Change markers covered:

- **CM-01:** conversion creates the operational Journey.
- **CM-02:** `JRN-####` reference.
- **CM-05:** Confirm dialog captures confirmed dates.
- **CM-07:** Service Category is optional while planning and mandatory at conversion.
- **PD-A:** nights required.
- **BR-046 / WS13-004A AC-01..07:** replacement inheritance.

## 3. Engineering Deviations

None change product rules, UX structure or architecture. Each is raised for Tiger / Sophie / Arjun visibility.

| ID | Deviation | Reason | Owner to confirm |
|---|---|---|---|
| ED-01 | The replacement banner on the JP record shows the original Journey reference as **text, not a link**. | The Journey detail route arrives in Phase 1. The link is added there. | Sophie |
| ED-02 | New helper copy when Service Categories cannot load: "Couldn't load Service Categories. You can still save; you'll need one to confirm." | UX Rev 4a has no load-failure state for this field. | Sophie |
| ED-03 | Success toast copy: "Journey JRN-xxxx created." | Not specified in §36.3. | Sophie |
| ED-04 | The Confirm dialog's owner row shows "You" (current user is owner) or the raw owner id. | The user directory (M01) is not yet wired into JP. Phase 1 wiring will show display names. | Sophie / Tiger |
| ED-05 | The condition-notification raise/resolve functions (WP-0.3) are deferred to P3 (Alerts). | Only the schema is needed now. Conversion notifications IN-01/IN-05 are inserted directly and deduplicated. | Tiger |
| ED-06 | M10 **drops** the WS12 2-argument conversion function and replaces it with a 4-argument one. | Keeping the old overload would allow conversion that bypasses CM-05/CM-07/PD-A and the SEC-01 fix. **Needs explicit approval at migration review.** | Archie / Tiger |

## 4. Phase Readiness

| Gate | State |
|---|---|
| ESLint | Pass (0 errors) |
| TypeScript (`tsc --noEmit`) | Pass |
| Production build | Pass (webpack, 33 pages), with documented environment workarounds (§6) |
| Verification scripts | 181 checks pass |
| Local database tests (PG 17.6) | 13/13 groups pass, plus a tested rollback |
| Migrations | Prepared, **not applied** |
| Commit / push | See §10 |
| Vercel Preview | Builds automatically on push. Until migrations are applied, Preview is **partially functional** (§5.5). |
| Ready for Keerthi QA | **After** Vivek applies M01–M10 and the Preview is redeployed |
| Phase 1 | Not started (per card) |

## 5. Deployment Considerations

### 5.1 Approved sequence (Tiger)

1. Announce the maintenance window.
2. Temporarily stop recording Confirmed JP decisions.
3. Take a logical backup before applying migrations.
4. Verify the migration baseline.
5. Apply all Phase 0 migrations as a single deployment unit.
6. Deploy the Phase 0 application immediately afterwards.
7. Smoke-test that recording a Confirmed JP decision succeeds.
8. Resume normal operations.

### 5.2 Step 3 — logical backup (approved procedure)

```bash
TS=$(date +%Y%m%d-%H%M)
BACKUP_DIR=~/SMV-backups/phase0-$TS
mkdir -p "$BACKUP_DIR"
npx supabase db dump --linked -f "$BACKUP_DIR/schema.sql"
npx supabase db dump --linked --data-only -f "$BACKUP_DIR/data.sql"
npx supabase db dump --linked --role-only -f "$BACKUP_DIR/roles.sql"
ls -la "$BACKUP_DIR"
```

- Capture `TS` once and reuse it.
- The backup stays **outside the repository** and is **never committed**, because it contains traveller and lead personal data.

### 5.3 Steps 4–5 — baseline and apply (run from the repository root)

```bash
cd /Users/viveksophu/Documents/Projects/SearchMyVacation
git switch feature/r1.3-ws13-journey-workspace
git pull --ff-only

# Step 4: baseline — expect 24 local = 24 remote, plus 10 local-only (20260928100000 … 20260928100900)
npx supabase migration list --linked

# Step 5: preview what will be applied (expect exactly the 10 Phase 0 files), then apply as one unit
npx supabase db push --linked --dry-run
npx supabase db push --linked

# Parity check — expect 34 local = 34 remote
npx supabase migration list --linked
```

- **Approval point (ED-06):** confirm before `db push` that dropping `workspace_convert_journey_planning_record(uuid, uuid)` in M10 is accepted.
- If `db push` stops part-way, do **not** re-run blindly. Record the output and run `migration list`. Then decide between completing and rolling back (§8).

### 5.4 Steps 6–7 — deploy and smoke test

- **Step 6:** redeploy the Vercel Preview for the feature branch (Redeploy on the latest Preview deployment) so the running app matches the schema.
- **Step 7 smoke test** (Administrator or record owner, on a test JP record in Decision stage):
  1. In Trip Basics, set nights and a Service Category. Save.
  2. Choose **Confirm → Convert to Journey**. Enter start/end dates that match the nights.
  3. Expect the toast "Journey JRN-10xx created." and the record closed as Confirmed.
  4. Negative check: dates that disagree with nights show the mismatch message, and the button stays disabled.

### 5.5 Environment impact

- **Production is unaffected at runtime.** `origin/main` contains no workspace code and only 9 migrations. The shared Supabase project (`SearchMyVacation_WebsiteUpgrade`) gains new objects only.
- **Preview before migrations:**
  - sign-in and JP pages work (auth reads `select *`, so it is tolerant of the missing M01 columns);
  - the Service Category list shows the load-failure copy;
  - **Confirm conversion fails** until M01–M10 are applied.
- **Preview after migrations:** fully functional for Phase 0 scope.

## 6. Build Verification

| Check | Where | Result |
|---|---|---|
| `npx tsc --noEmit` | Device repo (`web/`) | Pass |
| `npm run lint` | Device repo | Pass, 0 errors |
| `npm run verify:journey-workspace-transitions / -derivations / -dates / -config` | Device repo | Pass (181 checks total) |
| `next build --webpack` | Cloud snapshot of the same tree | Pass, 33 pages |

Build environment limits (not code issues):

- Google Fonts is unreachable from the build sandboxes, so fonts were mocked via `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`. Turbopack does not honour that mock, so the check used `--webpack`.
- Public Supabase env vars were set to non-secret placeholders for build only.

**The Vercel Preview build is the authoritative build check.**

## 7. Migration Inventory

Baseline verified by the PO: **24 local / 24 remote**. After Phase 0: **34**.

| # | File | Purpose | Notes |
|---|---|---|---|
| M01 | `20260928100000_workspace_users_directory_and_deactivation.sql` | `display_name`, `deactivated_at`; `workspace_user_directory()` (SECURITY DEFINER, callers with a role only) | AD-WS13-007 |
| M02 | `20260928100100_workspace_audit_log_ws13_events.sql` | WS13 event types; `actor_id` nullable only for system events; index | |
| M03 | `20260928100200_workspace_notifications_condition_keys.sql` | `condition_key`, `resolved_at`, `resolution`; unique active condition | AD-WS13-005 |
| M04 | `20260928100300_workspace_tasks_category_and_kind.sql` | `category`, `kind`; follow-up requires due date | |
| M05 | `20260928100400_workspace_settings_configuration.sql` | `workspace_configuration`, readiness templates + items, helpers, approved seeds | AD-WS13-006; Asia/Kolkata |
| M06 | `20260928100500_workspace_vendors_baseline.sql` | `VEN-#####` code (backfilled, immutable), service type, destinations, address, rates link | PD-D |
| M07 | `20260928100600_workspace_journeys_lifecycle_extension.sql` | Lifecycle columns, `JRN-####` (from 1001), legacy backfill, integrity CHECKs; `status` deprecated | AD-WS13-001/003; **coupled with M10** |
| M08 | `20260928100700_workspace_journey_child_tables.sql` | Contacts, vendor bookings, readiness items, documents, change records, activities; `workspace_can_edit_journey()`; RLS; no DELETE; legacy contact backfill | |
| M09 | `20260928100800_workspace_journey_operational_summary_view.sql` | `security_invoker` derived summary view (business time zone) | AD-WS13-004 |
| M10 | `20260928100900_workspace_journey_planning_conversion_v2.sql` | JP `service_category`, `replaces_journey_id`; **drops the 2-arg RPC**; new 4-arg RPC | ED-06 approval |

**Local test evidence (PostgreSQL 17.6, same major version as Supabase):**

- Setup: the 24 baseline migrations, then a WS12-era fixture (users incl. a deactivated one, vendors, a legacy Journey converted with the old RPC), then M01–M10.
- 13 test groups pass:
  - backfills;
  - vendor code;
  - directory;
  - stranger access;
  - old overload dropped;
  - 11 conversion rejection codes;
  - conversion success;
  - direct-write protections;
  - child-table RLS;
  - summary view;
  - audit/task constraints;
  - config helpers;
  - replacement conversion (supersession, contact carry, document status reset).

## 8. Rollback Strategy

The two controls below are **separate** and serve different purposes.

### 8.1 Engineering Rollback (corrective forward-fix migration)

- **Use when:** the schema applied but the application misbehaves, and data is sound.
- **What it does:** restores WS12 conversion compatibility. It removes the 4-argument RPC and the adopted-Journey integrity check, and re-creates the original 2-argument RPC.
- **What it keeps:** all additive columns, tables and seeds stay in place. They are harmless to WS12 code.
- **Test result:** tested locally after M01–M10. The WS12 conversion succeeds after rollback.
- **Application side:** pair it with redeploying the previous Preview build (`ba63140`).
- **How it is applied:** it is prepared, not applied. It is not placed in `supabase/migrations/`. If needed, Tiger raises it as a numbered corrective migration.

```sql
-- WS13 Phase 0 ENGINEERING ROLLBACK (forward-fix). Prepared, NOT applied.
-- Restores WS12 Journey Planning conversion compatibility after M07-M10.
begin;
drop function if exists public.workspace_convert_journey_planning_record(uuid, uuid, date, date);
alter table public.workspace_journeys drop constraint if exists workspace_journeys_adopted_required_check;
create or replace function public.workspace_convert_journey_planning_record(
  p_record_id uuid,
  p_actor_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.workspace_journey_planning_records%rowtype;
  v_journey_id uuid;
begin
  if p_actor_id is distinct from auth.uid() then
    raise exception 'workspace_conversion_actor_mismatch' using errcode = '28000';
  end if;

  select * into v_record
  from public.workspace_journey_planning_records
  where id = p_record_id
  for update;

  if not found then
    raise exception 'workspace_journey_planning_record_not_found' using errcode = 'P0002';
  end if;

  if v_record.stage <> 'decision' then
    raise exception 'workspace_journey_planning_record_not_in_decision_stage' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.workspace_journeys where journey_planning_record_id = p_record_id
  ) then
    raise exception 'workspace_journey_planning_record_already_converted' using errcode = 'P0001';
  end if;

  insert into public.workspace_journeys (journey_planning_record_id, traveller_id, corporate_contact_id, status)
  values (p_record_id, v_record.traveller_id, v_record.corporate_contact_id, 'active')
  returning id into v_journey_id;

  update public.workspace_journey_planning_records
  set stage = 'closed', outcome = 'confirmed'
  where id = p_record_id;

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_converted', p_actor_id,
    jsonb_build_object('journey_id', v_journey_id)
  );

  insert into public.workspace_audit_log (entity_type, entity_id, event_type, actor_id, event_data)
  values (
    'journey_planning_record', p_record_id, 'record_closed', p_actor_id,
    jsonb_build_object('outcome', 'confirmed')
  );

  return v_journey_id;
end;
$$;

comment on function public.workspace_convert_journey_planning_record(uuid, uuid) is
  'Atomic, one-way Decision-stage-to-Journey conversion (R-ENG-JP-02). Validates stage, validates no pre-existing Journey, inserts the bootstrap Journey, closes the Journey Planning record with outcome=confirmed, and writes both audit entries in one transaction.';

revoke all on function public.workspace_convert_journey_planning_record(uuid, uuid) from public, anon;
grant execute on function public.workspace_convert_journey_planning_record(uuid, uuid) to authenticated;

commit;
```

This is the exact script tested locally (72 lines; the WS12 function body is copied verbatim from `20260921070600`).

### 8.2 Data Recovery (logical backup restore)

- **Use when:** data is damaged or lost (e.g. a failed partial apply, or incorrect backfill), or a full return to the pre-Phase-0 state is required.
- **Source:** the §5.2 backup (`schema.sql`, `data.sql`, `roles.sql`).
- **Restore:** a PO decision, executed by Vivek with Tiger, typically into a fresh database or after an explicit reset. It is destructive to post-backup data, so any Confirmed decisions made after the backup must be re-entered. Step 2 of the sequence minimises this.

## 9. Regression Summary

**Engineering regression (done by Rad):**

- Existing WS12 verification scripts pass.
- tsc, lint and build pass.
- Service stub tests:
  - all prerequisites are reported together;
  - RPC argument names are correct;
  - RPC error codes map to field issues;
  - an invalid category is rejected.
- Confirm dialog renders in 4 states: empty, blocked, replacement pre-fill, server issues.
- Database tests (§7).

**Handed to Keerthi (focused functional regression, after migrations):**

- **WS12:**
  - create, edit and trip basics with/without Service Category;
  - stage progression;
  - Not Proceeding / Deferred outcomes unchanged;
  - Confirmed conversion (happy path, each blocking message, dates–nights mismatch);
  - non-owner consultant blocked;
  - replacement record conversion;
  - history labels for the new audit events;
  - PRA-01/PRA-02 behaviour intact.
- **WS11:**
  - sign-in and dashboard;
  - a **deactivated user is refused access**;
  - mobile navigation unchanged;
  - Phase A CM-03 (no Create Journey / My Work quick actions) still holds.
- **Dialog accessibility:** focus on open, Tab trap, Esc/Cancel return focus, `aria-disabled` reason announced.

## 10. Git Commit Details

- **Branch:** `feature/r1.3-ws13-journey-workspace`, parent `ba63140`.
- **Commit:** `feat(ws13): Phase 0 foundation and Journey Planning conversion v2 (EBC-R1.3-WS13-005-P0)`.
- **Contents:** 10 migrations, 44 web files (20 modified, 24 new) and this report. The resulting hash and push status are reported in Rad's handover message.
- **Excluded:** `_to_delete/` (local housekeeping), `.env*`, backups. No secrets in the diff.

## 11. Observations

- **OBS-P0-01 (pre-existing defect):**
  - Migration `20260921070200` produces an auto-named constraint that collides on a **fresh-database replay**. It does not affect the live database, where it applied long ago. It does break `supabase db reset` / new environments.
  - Recommend a backlog item.
  - Phase 0 migrations avoid the same pattern by using explicit constraint names.
- **OBS-P0-02 (for Arjun):**
  - The system readiness item `all_bookings_booked` resolves as true when a Journey has zero bookings (vacuous truth).
  - Confirm whether "no bookings yet" should block readiness before Phase 2 uses it.
- **OBS-P0-03:** `fetchWorkspaceUserRole` is now unused (superseded by `fetchWorkspaceUserAccess`). Candidate for TECH-DEBT cleanup; not removed, to keep the change minimal.
- **OBS-P0-04:** Keerthi needs QA identities: Administrator, owner consultant, non-owner consultant, and one deactivated user (`deactivated_at` set by Vivek).
- **OBS-P0-05:** EP-02 content (readiness template items, Document Types, Vendor Service Types) and EP-03 (vendor records) are still pending. The lists are seeded empty and the content is loaded by M05b in Phase 2 (WS13-004 §6.3). *(Corrected in Addendum A: the original wording mislabelled EP-03.)*
- **OBS-P0-06 (for PO cleanup):** `_to_delete/` in the repo holds build/transfer leftovers (`ws13-p0-*.tgz`, `ws13-005-*.tgz`, `next-stale-*`, a build log, an old git lock). Delete the folder when convenient. It is untracked.

---

## Addendum A — Review Responses (2026-09-28)

Responds to Tiger's Phase 0 engineering review. No code or migration was changed.

### A.1 ED-06 — references to the legacy conversion function

**Repository: verified — no remaining reference.** Search of the whole repository (excluding `node_modules`, `.next`, `_to_delete`) at `84c8904`:

| Place | Result |
|---|---|
| Application code / API routes | One caller: `web/lib/workspace/journey-planning/repository.ts`. It calls the **new 4-argument** signature (`p_record_id, p_actor_id, p_confirmed_start_date, p_confirmed_end_date`). The only other `.rpc(` call is `workspace_user_directory`. |
| Edge Functions | None. The repository has no `supabase/functions/` directory. |
| Database triggers, views, other SQL functions | None. Only the defining migration (`20260921070600`) and M10 name it. The `create trigger` statements in other migrations are `updated_at` triggers. |
| Scheduled jobs | None. No `pg_cron` / `pg_net` usage in any migration; no GitHub workflows; no `vercel.json` crons. |
| Production code (`origin/main`) | No reference (no workspace code on `main`). |
| Documentation | Mentions only (historical reports and plans). |

**Live database: not verifiable from here.** Objects created directly in the Supabase dashboard would not be in the repository, and PostgreSQL does not record dependencies on names used inside PL/pgSQL bodies, so the `DROP` would not fail even if something still used it. Before Step 5, run these read-only checks in the Supabase SQL editor; each should return **no rows**:

```sql
-- Other functions whose body calls the legacy function
select n.nspname, p.proname
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where p.prosrc ilike '%workspace_convert_journey_planning_record%'
  and p.proname <> 'workspace_convert_journey_planning_record';

-- Views that reference it
select schemaname, viewname from pg_views
where definition ilike '%workspace_convert_journey_planning_record%';

-- Only if pg_cron is enabled (skip if "relation cron.job does not exist")
select jobid, jobname from cron.job
where command ilike '%workspace_convert_journey_planning_record%';
```

and, from the repository root: `npx supabase functions list --linked` (expect no functions).

Transitional note: any **older** Preview deployment of this branch (before `84c8904`) calls the 2-argument function and cannot convert after M10. Step 6 (deploy immediately) covers this.

### A.2 Readiness evaluation — how it works today

1. Readiness is evaluated from the **readiness items of the Journey's assigned template**. Items are created when a template is assigned ("Start preparation", Phase 1). A Journey with no template is `not_ready`.
2. Only **Mandatory** items that are not **Not Applicable** count. Optional items never block (POD-01).
3. An item is resolved when:
   - manual item: status is Complete;
   - system item `all_bookings_booked`: number of non-cancelled bookings **equals** number of Booked bookings;
   - system item `all_required_documents_received`: number of Mandatory documents still Outstanding **is zero**.
4. State: `ready` if no mandatory item is unresolved; otherwise `at_risk` inside the readiness window (14 days); otherwise `not_ready`.

The implementation is in `…100800_workspace_journey_operational_summary_view.sql` (M09) and mirrored in `web/lib/workspace/journey-workspace/derivations.ts`.

**Confirmed: the behaviour comes purely from the comparison.** With no bookings, `0 non-cancelled = 0 booked`, so the item counts as resolved. It is a business-rule clarification, not a defect. **The same pattern applies to documents:** with no Mandatory documents recorded, `all_required_documents_received` is also resolved. Both rules should be decided together.

**Mapping to the Product states (for Arjun):** the view already holds the counts needed to derive a booking progress state without new data:

| Product state | Derivation |
|---|---|
| Not Started | 0 non-cancelled bookings |
| In Progress | ≥1 non-cancelled booking, not all Booked |
| Completed | ≥1 non-cancelled booking and all Booked |

The readiness rule would then resolve `all_bookings_booked` only when Completed. Open point for Arjun: a Journey that genuinely needs no SMV-arranged bookings would then rely on the item being marked Not Applicable (template must allow N/A).

**Timing:** readiness has no consumer until Journey screens (Phase 1) and template content (M05b, Phase 2). The rule can therefore be corrected either (a) in M09 before the migration is applied (requires re-running the local tests), or (b) through a small corrective `create or replace view` migration plus the TypeScript mirror in Phase 1/2. Rad recommends (b), so the reviewed and tested Phase 0 package is applied unchanged.

### A.3 Temporary implementations and known limitations within Release 1.3

| ID | Item | Current Phase 0 behaviour | Planned resolution |
|---|---|---|---|
| TL-01 | Journey Owner display (ED-04) | "You" or raw user id in the Confirm dialog | Phase 1: use the user directory (M01) |
| TL-02 | Replacement Journey reference (ED-01) | Plain text | Phase 1: link to Journey detail |
| TL-03 | Condition alerts (ED-05) | Schema only | Phase 3 |
| TL-04 | Reference content (EP-02 / EP-03) | Document Types, Vendor Service Types and readiness template items empty; templates exist as headers only | Phase 2: M05b + vendor load, once PO content is supplied |
| TL-05 | **Newly declared (ED-07):** header / user-menu name does not yet read `display_name` | WS13-004 WP-0.1 said the display name should prefer `display_name`; Phase 0 added the column and the directory but the header still derives the name from the sign-in profile. No visible effect today because `display_name` is empty for everyone. | Phase 1, together with TL-01 |
| TL-06 | No screen to set display names or deactivate a user | Done by an Administrator directly in Supabase (`workspace_users.display_name`, `deactivated_at`) | **Not in the current WS13 plan.** PO decision: accept database-managed for R1.3, or add a small admin item |
| TL-07 | Legacy Journeys | Marked `legacy_pending`; not visible or adoptable | Phase 1: adoption (JW-17) |
| TL-08 | Journey History labels for new events | Interim labels in `journeyPlanningLabels.ts` | Phase 1: Journey History screen |
| TL-09 | Readiness "no bookings / no documents" rule | Counts as resolved (A.2) | Arjun decision; Phase 1/2 corrective migration |

By design, not temporary: a converted Journey has no Journey screen and no readiness template until Phase 1 ("Start preparation" assigns the template).

Technical debt (not required for R1.3 closure): the deprecated `workspace_journeys.status` column (TD-WS13-001), unused `fetchWorkspaceUserRole`, and the fresh-replay constraint-name collision (OBS-P0-01, now logged as `TD-WS13-002` in `docs/10-Backlog/TECH-DEBT.md`).

