# Release 1.3 — Phase / Release Deployment Runbook

| Document Information | |
|---|---|
| Document | Phase / Release Deployment Runbook (Governance Backlog §2.10) |
| Version | **0.1 — DRAFT, not approved** |
| Status | In drafting for **Checkpoint 3** (`EBC-R1.3-WS13-021` §11). Tiger drafts; Rad supplies and confirms technical steps; Archie confirms SR-01/SR-02 coverage; Vivek approves. |
| Owner | Tiger (document); Vivek (approval and operator) |
| Applies to | Release 1.3 migrations on the shared Supabase project (Preview and Production share one database, `DEC-R1.3-020`) |
| Migration mechanism | **Supabase CLI is the standard; the SQL Editor is an operational fallback only** (`DEC-R1.3-029`, 7-Oct-2026) |
| Sources | Phase 0 sequence `EBC-R1.3-WS13-005-P0` §5 and `DEC-R1.3-021`; Archie `EBC-R1.3-WS13-023A` §7 (SR-01, SR-02); Rad `EBC-R1.3-WS13-023` §4.4, §10, §11; `DEC-R1.3-028` GF-3 |
| Date | 7 October 2026 |

> **Draft.** Nothing in this document authorises a deployment. M11 may be applied only after Checkpoint 3 (this runbook approved) and Checkpoint 4 (Product Owner migration authorisation). Items marked **[TO CONFIRM — owner]** are not yet verified and must be closed before approval.

---

## Part A — Standard Procedure (reusable for every phase)

### A.1 Roles

| Role | Who | Responsibility |
|---|---|---|
| Operator | Vivek (Product Owner) | Runs every command against the shared project. Team Satvi never handles credentials (`DEC-R1.3-022` (1)). |
| Coordinator | Tiger | Runs the checklist, records the deployment record, calls stop/go |
| Engineering adviser | Rad | Supplies technical steps, reads outputs, advises on stop rules |
| Architecture adviser | Archie | Confirms post-application checks for architecture-gated changes |

### A.2 Prerequisites (operator's machine)

- The repository at `/Users/viveksophu/Documents/Projects/SearchMyVacation`, on the release branch, with a clean working tree.
- Supabase CLI available (`npx supabase --version`), and the project linked (`supabase link`, as used in Phase 0).
- **Docker running** whenever a logical backup is taken (`supabase db dump` needs it; `DEC-R1.3-021` (5)).
- Access to the Supabase dashboard SQL Editor (for read-only checks and the fallback).
- Access to the Vercel dashboard (Preview deployments).

*Note:* `EBC-R1.3-WS13-023` F-08 found no Docker or Supabase CLI inside the Claude engineering workspace. That affects local testing only. The operator's machine ran the CLI and Docker successfully in Phase 0.

### A.3 Standard sequence

| # | Step | Notes |
|---|---|---|
| 1 | **Announce** the window to Workspace users, if the change is user-visible or needs a freeze | Wording: "Workspace maintenance on [date] [time–time IST]. [Effect]." |
| 2 | **Freeze** affected operations, only if the phase's section says so | Freeze always precedes the backup (`DEC-R1.3-021` (3)) |
| 3 | **Logical backup** and verification | A.5 |
| 4 | **Baseline:** `npx supabase migration list --linked` | Record local/remote counts; the only local-only files must be this phase's |
| 5 | **Pre-checks** (read-only SQL) | Phase-specific |
| 6 | **Dry run:** `npx supabase db push --linked --dry-run` | Must list exactly the phase's migration files, nothing else |
| 7 | **Apply:** `npx supabase db push --linked` | One push for the phase's set |
| 8 | **Schema cache reload:** `notify pgrst, 'reload schema';` (SQL Editor) | So the API layer sees new functions immediately (SR-01) |
| 9 | **Post-checks** (read-only SQL) | Phase-specific |
| 10 | **Parity:** `npx supabase migration list --linked` | Local = remote |
| 11 | **Push the branch**, only after steps 7–10 pass | `git push` → Vercel builds the Preview |
| 12 | **Preview build READY**, then **smoke test** | Phase-specific; test records only (`QA-WS13-P<n>-*`) |
| 13 | **Resume / close the window**; file the deployment record | A.7 |

### A.4 Stop rules

- **Any step fails or shows something unexpected → stop.** Do not continue to the next step. Record the exact output.
- **Dry run lists anything other than the expected files → stop.** Do not apply.
- **`db push` stops part-way → do not re-run blindly.** Record the output, run `migration list`, and decide with Rad between completing and rolling back (A.6).
- **Post-checks fail → do not push the branch.** The deployed code is unaffected while the branch is unpushed. Decide between a fix and a rollback.
- **Preview build fails → redeploy the previous Preview** from the Vercel dashboard, then diagnose. The database change stays in place if it is backward compatible (it must be for every Release 1.3 migration).

### A.5 Backup handling

```bash
TS=$(date +%Y%m%d-%H%M)
BACKUP_DIR=~/SMV-backups/<phase>-$TS
mkdir -p "$BACKUP_DIR"
npx supabase db dump --linked -f "$BACKUP_DIR/schema.sql"
npx supabase db dump --linked --data-only -f "$BACKUP_DIR/data.sql"
npx supabase db dump --linked --role-only -f "$BACKUP_DIR/roles.sql"
ls -la "$BACKUP_DIR"
```

- **Verify** that all three files exist and are non-empty before step 6. Record the sizes.
- The backup stays **outside the repository** and is **never committed** (it holds traveller and lead personal data).
- **Retention and deletion: [TO DECIDE — Vivek]** (RISK-R1.3-004). Proposed: keep until the phase is accepted plus 30 days, then delete; never copy to cloud storage.

### A.6 Rollback

| Situation | Rollback | Who decides |
|---|---|---|
| Migration applied, post-checks fail, branch not pushed | Forward-fix: a **numbered corrective migration** applied with the CLI (keeps history parity) | Rad proposes, Archie reviews, Vivek approves |
| Urgent, and the CLI is unavailable | SQL Editor fallback (`DEC-R1.3-029`): the prepared rollback inside `begin … commit`, then a schema reload; record the history change and reconcile parity afterwards | Vivek |
| Data damaged | Restore from the logical backup. This is a last resort, because the database is shared with Production. | Vivek, with Archie |
| Preview build broken | Redeploy the previous Preview | Vivek |

### A.7 Deployment record (template — filed with the phase's closure record)

| Field | Value |
|---|---|
| Phase / migration(s) | |
| Date, start–end (IST) | |
| Operator / coordinator | |
| Announcement sent / freeze applied | |
| Backup location (outside repo) and file sizes | |
| Baseline `migration list` (local / remote) | |
| Pre-check results | |
| Dry-run output (files listed) | |
| Apply result | |
| Schema reload done | |
| Post-check results | |
| Parity `migration list` (local / remote) | |
| Branch pushed (commit) | |
| Preview deployment id, build status | |
| Smoke-test results | |
| Issues / deviations | |
| Closed by | |

---

## Part B — WS13 Phase 1: Migration M11

| Item | Value |
|---|---|
| Migration | `supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql` (M11) — nine public functions and three internal helpers; **functions, comments and grants only** (Checkpoint 1, `EBC-R1.3-WS13-024` §2) |
| Commits to push afterwards | `3101590` (Milestone A) and `4171107` (governance), plus any later local commits on the branch. **Not pushed before step 10.** |
| Gates | Checkpoint 2 ✅ (SR-01, SR-02 below) · Checkpoint 3 (this runbook approved) · **Checkpoint 4 (Product Owner migration authorisation)** |
| Expected counts | Baseline: 34 remote + 1 local-only (`20261004100000`) · after apply: **35 = 35** |

### B.1 Decisions for this phase

| # | Item | Proposed | Status |
|---|---|---|---|
| B-D1 | Freeze | **None.** No deployed code calls the M11 functions (Archie `023A` §7.1). | Archie confirmed; Vivek to approve with the runbook |
| B-D2 | Announcement | Not required (no user-visible change until the branch is pushed; the Preview is not used by staff for live work) | Vivek to approve |
| B-D3 | Backup | **Take it** (standard procedure), although M11 writes no data | Vivek to approve |
| B-D4 | Atomicity (SR-01) | M11 has no `begin`/`commit` of its own. **[TO CONFIRM — Rad]** whether `supabase db push` applies one migration file and its history row in a single transaction on the CLI version in use. If yes, SR-01's atomicity is met by the CLI. If no, the stop rule in A.4 applies on a part-way failure: `create or replace` is idempotent, so re-applying the file after a fix is safe (Archie `023A` §7.1). | Open |
| B-D5 | Applying role | The CLI connects as `postgres`, the owner of the Phase 0 tables, as Archie requires (`023A` §7.6). **[TO CONFIRM — Rad]** against the linked connection. | Open |

### B.2 Sequence

**Step 3 — Backup** (A.5, `<phase>` = `ws13-p1-m11`). Docker running.

**Step 4 — Baseline**

```bash
cd /Users/viveksophu/Documents/Projects/SearchMyVacation
git switch feature/r1.3-ws13-journey-workspace
git status            # expect clean
git log --oneline -3  # expect 4171107 and 3101590 (plus any later local commits)
npx supabase migration list --linked   # expect 34 remote; 20261004100000 local only
```

**Step 5 — Pre-checks** (SQL Editor, read-only; Rad `023` §10 with Archie's SR-02 correction):

```sql
-- No existing function with the M11 prefix (expect 0 rows)
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname like 'workspace_journey_%' order by 1;
-- Sizing (record the values)
select count(*) filter (where is_active) as active_journeys, count(*) as all_journeys
from public.workspace_journey_operational_summary;
select count(*) as journey_audit_rows from public.workspace_audit_log where entity_type = 'journey';
select count(*) as journeys_without_primary_contact
from public.workspace_journeys j
where not exists (select 1 from public.workspace_journey_operational_contacts c
                  where c.journey_id = j.id and c.is_primary);
-- B-8: summary view cost on real data
explain (analyze, buffers) select * from public.workspace_journey_operational_summary where is_active;
```

**[TO CONFIRM — Rad]:** the expected result of the first query is 0 rows on the shared database. Before M11, no `workspace_journey_%` function should exist (Archie found none with this prefix before M11 locally, `023A` §6).

**Step 6 — Dry run:** `npx supabase db push --linked --dry-run`. Expect **exactly one file**, `20261004100000_workspace_journey_lifecycle_rpcs.sql`.

**Step 7 — Apply:** `npx supabase db push --linked`

**Step 8 — Schema reload** (SQL Editor): `notify pgrst, 'reload schema';`

**Step 9 — Post-checks (SR-02)** (SQL Editor, read-only; Archie `023A` §7.4):

```sql
select p.oid::regprocedure as fn, p.prosecdef as secdef, p.proconfig as config,
       pg_get_userbyid(p.proowner) as owner,
       has_function_privilege('anon', p.oid, 'execute') as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated
from pg_proc p
where p.pronamespace = 'public'::regnamespace and p.proname like 'workspace_journey%'
order by 1;
```

Expect **12 rows**. Every row: `secdef = true`, `config = {search_path=public}`, `owner = postgres`, `anon = false`. `authenticated = true` for the nine public functions (`transition`, `place_on_hold`, `resume`, `cancel`, `close`, `reassign`, `assign_template`, `set_service_category`, `adopt_legacy`). `authenticated = false` for the three helpers (`lock_for_change`, `derive_template_items`, `notify`).

**Step 10 — Parity:** `npx supabase migration list --linked`. Expect **35 = 35**.

**Step 11 — Push** (only if steps 7–10 passed): `git push`

**Step 12 — Preview build READY, then smoke test.** This is the first cloud build of Milestone A code; the local build used mocked fonts and placeholder settings (GF-3). In the Vercel dashboard, wait for the branch Preview to be **Ready**. Then, signed in as Administrator (Vivek signs in):

| # | Check | Expect |
|---|---|---|
| S-1 | Existing Journey Planning queue and a record page | Unchanged from Phase 0 |
| S-2 | `GET /api/workspace/journey-workspace` | `ok: true`, list and counts |
| S-3 | `GET /api/workspace/journey-workspace/summary-counts` | `ok: true` |
| S-4 | `GET /api/workspace/users/directory` | `ok: true`, active users only, no e-mail field |
| S-5 | `GET /api/workspace/journey-workspace/<a QA Journey id>` | `ok: true`, detail with available actions |

The smoke test is **read-only**. Lifecycle mutations are exercised afterwards in integration verification (plan `020` §14.4), on `QA-WS13-P1-*` records only (`021` C-4; PO Decision 7). **[TO CONFIRM — Rad]:** S-5 needs an existing QA Journey. If none exists, S-5 is replaced by a request for a non-existent id, which must return a clean "not found" error.

**Step 13 — Close:** file the deployment record (A.7) with the Phase 1 closure documents.

### B.3 Rollback for M11

Prepared in `EBC-R1.3-WS13-023` §4.4 and verified by Archie (`023A` §6): it drops the nine functions and three helpers; no table or data is affected.
- **Standard:** raise it as a numbered corrective migration and apply it with the CLI (A.6), then reload the schema. If the branch was already pushed, redeploy the previous Preview build.
- **Fallback:** the SQL Editor with `begin … commit` (`DEC-R1.3-029`), then reconcile the migration history.

---

## Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Engineering (technical steps) | Rad | | |
| Architecture (SR-01, SR-02) | Archie | | |
| Product Owner (Checkpoint 3) | Vivek | | |

*Draft prepared by Tiger, Delivery Manager, on behalf of Team Satvi, 7 October 2026.*
