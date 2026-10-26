# Release 1.3 — Phase / Release Deployment Runbook

| Document Information | |
|---|---|
| Document | Phase / Release Deployment Runbook (Governance Backlog §2.10) |
| Version | **1.2 — APPROVED** (2026-10-25): Part B reconciled with `1b1fd4d` and `c9d6ec1` (Option A, selected in principle by the Product Owner, 17-Oct-2026). **v1.2 supersedes v1.1 when committed in `<G-CP4>`.** v1.1: **APPROVED for Phase 1 / M11** (Checkpoint 3 passed 8-Oct-2026, `DEC-R1.3-032`; v1.1 adds the Product Owner's Checkpoint 4 operational controls, `DEC-R1.3-033` — no technical step changed). History: v0.1 working baseline 7-Oct; v0.2 PO decisions 7-Oct; v0.3 Milestone B deltas 8-Oct; v0.4 Tiger's evidence; v0.5 specialist conditions; v1.0 specialist notes N-1 to N-6 and ARCH-CP3-14 to -18, approval record; v1.1 Checkpoint 4 operational controls (B.1A); v1.2 Part B reconciliation (review draft 17-Oct; review drafts r2–r4 22–23-Oct; approved 2026-10-25) |
| Revision | **v1.2 — committed text.** Its operative text (Part A; Part B including B.1, B.1A, B.2 and B.3) is identical to review draft **r4** (23-Oct-2026, SHA-256 `c0c6845b71c935e2636483756ce396f107b8c205dc5894e32886d2eb0fedd198`). Rad confirmed r4 (engineering, 23-Oct-2026) and Archie confirmed r4 (architecture only, 24-Oct-2026). Under the Product Owner's ARCH-CP4-01 decision (24-Oct-2026, Option A), both confirmations carry forward: this text differs from r4 only in the Version, Revision, Status and Date rows, the banner, the Approval table and the approval-status line below it. Archie ruled that line change in scope (S-1, 25-Oct-2026) and Rad ruled that her confirmation carries forward (25-Oct-2026). Review drafts retained outside the repository: original (17-Oct-2026, `cc420a35…`), r2 (`b0f42ffd…`), r3 (`bb1a36be…`), r4 (`c0c6845b…`). Records: `READINESS-CONFIRMATION-RECORD-2026-10.md` (RA-2b, RA-2c, RA-3, RA-3a, RA-3b, RB-8, ARCH-CP4-01, CF-1). |
| Status | **v1.2: Approved** by the Product Owner, 2026-10-25, on the basis of: Rad's engineering confirmation of r4 (CONFIRMED, 23-Oct-2026; RA-2b — Rad's report text is not held in the record), carried forward (RA-2c, 25-Oct-2026); Archie's architecture confirmation of r4 (CONFIRMED — architecture only, 24-Oct-2026; RA-3; follow-up RA-3a as reported by the Product Owner), with the approval-status line ruled in scope (RA-3b, 25-Oct-2026); carry-forward rule ARCH-CP4-01 (evidence CF-1); Preview access: Product Owner confirmations of 24-Oct-2026 (RB-8); **step-12 verification pending**. **v1.1:** approved at Checkpoint 3 (Rad: SIGNED — conditions addressed; Archie: CONFIRMED — SR-01 and SR-02 fully addressed; Product Owner: decision D-3, `DEC-R1.3-032`; review record `EBC-R1.3-WS13-030` Rev 1); superseded by v1.2 when committed. **Approval of this runbook does not authorise a deployment:** M11 is applied only under Checkpoint 4 (Product Owner migration authorisation). |
| Owner | Tiger (document); Vivek (approval and operator) |
| Applies to | Release 1.3 migrations on the shared Supabase project (Preview and Production share one database, `DEC-R1.3-020`) |
| Migration mechanism | **Supabase CLI is the standard; the SQL Editor is an operational fallback only** (`DEC-R1.3-029`, 7-Oct-2026) |
| Sources | Phase 0 sequence `EBC-R1.3-WS13-005-P0` §5 and `DEC-R1.3-021`; Archie `EBC-R1.3-WS13-023A` §7 (SR-01, SR-02); Rad `EBC-R1.3-WS13-023` §4.4, §10, §11; `DEC-R1.3-028` GF-3; Rad `EBC-R1.3-WS13-026` Rev 1 §10, §14; Tiger `EBC-R1.3-WS13-027` §8 |
| Date | 7 October 2026 (v0.1); 7 October 2026 (v0.2: Product Owner operational decisions recorded in A.5 and B.1); 8 October 2026 (v0.3: Milestone B deltas in Part B — commits to push, step 4, smoke checks S-6/S-7, rollback note; branch item B-D6 added after `DEC-R1.3-031`; B-D1…B-D3 unchanged); 8 October 2026 (v0.4: evidence-based proposed answers for B-D4, B-D5, the step 5 expectation and S-5, each still for Rad to confirm; B-D6 fast-forward moved into step 4; CLI version recorded at step 4; S-5/S-7 use the Phase 0 QA Journeys); 8 October 2026 (v0.5: specialist conditions incorporated — CLI version must be exactly the verified 2.120.0 (step 4); A.4 failed-push states; password-prompt wording; step 11 push checks; SQL Editor and corrective-migration rollback with history parity; smoke-test expectations corrected; read-only ownership pre-check; aligned LIKE patterns; step 9 self-check; backup hardening); 8 October 2026 (v1.0: approved; Fallback literal script, version check on the rollback route, push-after-rollback rule, restart rule in A.4, editorial corrections); 8 October 2026 (v1.1: Checkpoint 4 operational controls C4-OC-1 and C4-OC-2, `DEC-R1.3-033`; A.2 automation check result); 17 October 2026 (v1.2 review draft: Part B 'Commits to push' names `1b1fd4d` and `c9d6ec1` and the Checkpoint 4 governance commit; exact step 4 and step 11 commit checks and ahead count; S-1 and sign-in expectations after WP-1.9; banner; B-D1 Preview-access note); 22–23 October 2026 (v1.2 review drafts r2–r4: step 12 sign-in note, S-1, lookup and S-5 after Rad's findings F-1 to F-3 and RC-1 to RC-5; approval-history rows); 2026-10-25 (v1.2 approved; operative text identical to r4) |

> **Approved runbook v1.2** (supersedes v1.1 when committed). Nothing in this document authorises a deployment by itself. M11 is applied only after Checkpoint 4 (Product Owner migration authorisation). The operator runs the **committed, approved** version from the repository (Archie ARCH-CP3-13); for Checkpoint 4 that is this v1.2, committed in `<G-CP4>`. *(v1.2: the v1.0 banner still named v1.0 after v1.1 was issued, and v1.1 was never committed — the repository holds v1.0.)*

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
- Supabase CLI **2.120.0** (the version whose source proves B-D4; step 4 checks it), and the project linked (`supabase link`, as used in Phase 0). Run every `supabase` command **from the repository root**, so the CLI uses `supabase/` (its link record is `supabase/.temp/`; an older duplicate link record exists under `supabase/supabase/.temp/` from a run inside that folder — same project, not used from the root).
- If the CLI asks for the database password, the operator types it. The CLI may instead use a password saved by `supabase link` or a temporary login role. Either is acceptable, and no prompt is **not** a stop condition. The password is never stored in the repository or given to Team Satvi. *(Rad C-2)*
- **Docker running** whenever a logical backup is taken (`supabase db dump` needs it; `DEC-R1.3-021` (5)).
- Access to the Supabase dashboard SQL Editor (for read-only checks and the rollback fallback in A.6/B.3).
- No automation applies migrations. Repository: no `.github` workflows, no `supabase/config.toml`, no `vercel.json`; the Vercel build is `next build` only (Tiger, 8-Oct-2026). Supabase dashboard: **verified 8-Oct-2026 — no GitHub repository connected and branching not set up** (see C4-OC-2).
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
- **`db push` reports an error or stops part-way → do not re-run blindly.** Record the exact output. The CLI applies each migration file and its history row in one transaction (B-D4), so after a failure there are only two valid states. Check which one you are in with step 5's first query and `npx supabase migration list --linked`: (a) **0 rows and the baseline remote count** (for M11: 34), with the phase's version local only → nothing was applied. Fix the cause with Rad and restart at step 6; if the fix changes the migration file itself, stop for Archie's re-review and a new Checkpoint 4, then restart at step 4 (Rad N-4). (b) **All expected objects present and local = remote** (for M11: 12 rows and 35 = 35) → the apply committed and only the reply was lost. Continue at step 8. Any other combination → **stop**, and decide with Rad and Archie. **Do not apply a migration through the SQL Editor.** This runbook has no SQL Editor apply path; one would need an amended, reviewed runbook. *(Archie C-2)*
- **Post-checks fail → do not push the branch.** The deployed code is unaffected while the branch is unpushed. Decide between a fix and a rollback.
- **Preview build fails → redeploy the previous Preview** from the Vercel dashboard, then diagnose. The database change stays in place if it is backward compatible (it must be for every Release 1.3 migration).

### A.5 Backup handling

```bash
TS=$(date +%Y%m%d-%H%M)
BACKUP_DIR=~/SMV-backups/<phase>-$TS
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"        # backup folder readable by the operator only (Rad RAD-CP3-08, N-2)
npx supabase db dump --linked -f "$BACKUP_DIR/schema.sql"
npx supabase db dump --linked --data-only -f "$BACKUP_DIR/data.sql"
npx supabase db dump --linked --role-only -f "$BACKUP_DIR/roles.sql"
ls -la "$BACKUP_DIR"
```

- **Verify** that all three files exist and are non-empty before step 6. Record the sizes.
- The dumps do not include the `supabase_migrations` history; step 4 saves the `migration list` output into the same folder (Rad RAD-CP3-08).
- Restoring this backup is **never** the rollback for a functions-only migration such as M11 (Archie ARCH-CP3-10); it is the data-recovery last resort in A.6 only.
- The backup stays **outside the repository** and is **never committed** (it holds traveller and lead personal data).
- **Retention and deletion (Product Owner decision, 7-Oct-2026):** keep each Release 1.3 deployment backup **until Release 1.3 Product Acceptance plus 30 days**; after that it may be removed. Store it only on the operator's machine, outside the repository (RISK-R1.3-004).

### A.6 Rollback

| Situation | Rollback | Who decides |
|---|---|---|
| Migration applied, post-checks fail, branch not pushed | Forward-fix: a **numbered corrective migration** applied with the CLI (keeps history parity). When the prepared rollback is turned into a numbered corrective migration, remove its `begin;` and `commit;` lines: the CLI already applies the file and its history row in one transaction (B-D4). Keep `begin`/`commit` only for the SQL Editor fallback. For the M11 corrective migration: dry run lists exactly that one file; after apply, reload the schema, run the step 9 query and expect **0 rows**, and check parity 36 = 36. *(Archie C-4; Rad C-4)* | Rad proposes, Archie reviews, Vivek approves |
| Urgent, and the CLI is unavailable | SQL Editor fallback (`DEC-R1.3-029`): in one execution, as `postgres`: `begin;` + the prepared rollback statements + `delete from supabase_migrations.schema_migrations where version = '<version being rolled back>';` + `commit;` Then `notify pgrst, 'reload schema';`. This is the same history change as `supabase migration repair --status reverted <version>`, made in the same transaction, so parity holds at once. Confirm with `npx supabase migration list --linked` when the CLI is available. *(Archie C-3)* | Vivek |
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
| Commits to push afterwards | **Exactly eight commits, oldest first:** `3101590` (Milestone A), `4171107`, `1034056`, `1f73a4b` (governance and runbook), `7291f46` (Milestone B screens + `EBC-026` Rev 1, preserved on `ws13-milestone-b`, `DEC-R1.3-031` (1)), `1b1fd4d` (Checkpoint 3 governance, `DEC-R1.3-032` D-2), `c9d6ec1` (WP-1.9 carry-forward + `EBC-029` Rev 1, `DEC-R1.3-034`), and **`<G-CP4>`** — the single governance commit authorised before Checkpoint 4, which carries this runbook's approved v1.2; its hash is recorded in the Checkpoint 4 authorisation. **Not pushed before step 11.** This push deploys the Phase 1 screens and WP-1.9 to the **branch Preview only**; `main` and Production are not touched. *(v1.2: Option A, Product Owner, 17-Oct-2026. v1.1 listed only the first five, "plus any later local governance commits", and said WP-1.9 would follow in a later push.)* |
| Gates | Checkpoint 2 ✅ (SR-01, SR-02 below) · Checkpoint 3 (this runbook approved) · **Checkpoint 4 (Product Owner migration authorisation)** |
| Expected counts | Baseline: 34 remote + 1 local-only (`20261004100000`) · after apply: **35 = 35** |

### B.1 Decisions for this phase

| # | Item | Proposed | Status |
|---|---|---|---|
| B-D1 | Freeze | **None.** No deployed code calls the M11 functions (Archie `023A` §7.1). *Note (Rad RAD-CP3-07):* true until step 11. After the push, the branch Preview offers lifecycle actions that write to the shared database. Until Phase 1 QA, only the Product Owner and the QA lead use the Preview, and only on `QA-WS13-P1-*` records (PO Decision 7). *Preview access (v1.2):* write-path use of the branch Preview is governed by C4-OC-1 (B.1A). Reaching the Preview: Vercel project `search-my-vacation` has **Vercel Authentication enabled for all deployments except custom domains** (password protection off; read-only check by Tiger, 17-Oct-2026), so a branch Preview URL opens only for signed-in members of the Vercel team or through a share link. **[Product Owner to confirm before Checkpoint 4: that the Vercel team membership is acceptable as the read access, and that no share link is issued — this would close the v1.1 note "who can reach the branch Preview".]** | ✅ Approved by Vivek, 7-Oct-2026 |
| B-D2 | Announcement | **None.** No user communication is required for this deployment. | ✅ Approved by Vivek, 7-Oct-2026 |
| B-D3 | Backup | **Take a full backup** (schema, data, roles; A.5) before applying M11, although M11 writes no data. Retention: until Release 1.3 Product Acceptance plus 30 days. | ✅ Approved by Vivek, 7-Oct-2026 |
| B-D4 | Atomicity (SR-01) | M11 has no `begin`/`commit` of its own. **Confirmed by Rad (CP3), verified independently by Archie (CP3):** in Supabase CLI **2.120.0**, `db push` runs `ApplyMigrations` → `MigrationFile.ExecBatch` (`pkg/migration/apply.go`, `file.go`). All statements of the file **and** the `INSERT INTO supabase_migrations.schema_migrations` history row go into one `pgconn` batch, sent with a single Sync, which PostgreSQL runs as one implicit transaction: everything commits, or nothing does. A statement is taken out of the batch only if it is `CREATE [UNIQUE] INDEX CONCURRENTLY`, `DROP INDEX CONCURRENTLY`, `REINDEX … CONCURRENTLY`, `VACUUM`, `ALTER SYSTEM` or `CLUSTER` (`file.go` lines 32–37; an ordinary `CREATE INDEX` or `DROP INDEX` stays in the batch); an explicit `begin`/`commit` in a file would end the CLI's transaction early. M11 has none: 45 statements (12 `create or replace function`, 12 `comment on`, 12 `revoke`, 9 `grant`). The `RESET ALL` the CLI runs before each file resets session settings only. **This evidence holds for CLI 2.120.0 only.** `supabase/.temp/cli-latest` is not evidence of the installed version. Step 4 records the actual version: if it is not 2.120.0, stop before step 6 and ask Rad to re-verify that version's source, or run every CLI command in steps 4–10 as `npx supabase@2.120.0 …`. Because the history row commits with the file, `migration list` shows reliably whether M11 is applied, including after an interrupted push. Re-applying after a fix stays safe (`create or replace` is idempotent; Archie `023A` §7.1). *(Rad C-1; Archie C-1)* | ✅ Confirmed (Rad, Archie), subject to the step 4 version check |
| B-D5 | Applying role and CLI execution details | **Confirmed by Rad (CP3): the applying role is `postgres`.** The link record `supabase/.temp/pooler-url` connects as user `postgres.<project-ref>` on `aws-1-ap-northeast-2.pooler.supabase.com` (the Supavisor form of `postgres`; no password stored). Execution: one terminal session; `cd` to the repository root (step 4) and run every `supabase` command from there; `--linked` on every command; dry run (step 6) before apply (step 7). Copy the CLI's connection lines from steps 6 and 7 (for example 'Connecting to remote database…' or 'Initialising login role…') into the deployment record. **The definitive proof is step 9: all 12 functions show `owner = postgres`.** Any other owner → stop, do not push, and decide a corrective migration with Rad and Archie. *(Rad C-2)* | ✅ Confirmed (Rad) |
| B-D6 | Branch to push — **Product Owner decision D-1, 8-Oct-2026** | `DEC-R1.3-031` (1) places the Milestone B commit (and WP-1.9, `EBC-R1.3-WS13-028`) on the Mac branch `ws13-milestone-b`, created from `1f73a4b`. Vercel builds the Phase 1 Preview and QA baseline from `feature/r1.3-ws13-journey-workspace` (`DEC-R1.3-018`, `DEC-R1.3-022` (3)). **Decided:** at the start of step 4, fast-forward the release branch to it — `git switch feature/r1.3-ws13-journey-workspace && git merge --ff-only ws13-milestone-b` (local only; no merge commit, no history rewrite; stop if it is not a fast-forward). Step 4's checks and step 11's `git push` then apply to the release branch as written. Nothing is pushed until step 11. *(v1.2: the local release branch is at `1f73a4b`, so the fast-forward adds `7291f46`, `1b1fd4d`, `c9d6ec1` and `<G-CP4>`; ancestry verified read-only by Tiger, 17-Oct-2026.)* | ✅ Approved by Vivek, 8-Oct-2026 (local fast-forward only; no merge commit; no push before step 11) |


### B.1A Checkpoint 4 operational controls (Product Owner, 8-Oct-2026, `DEC-R1.3-033`)

These are conditions of executing Part B. They do not change any technical step that Rad signed or Archie confirmed.

| # | Control | Applies | Status |
|---|---|---|---|
| **C4-OC-1** | **Preview write-path restriction.** Once the branch is pushed and the Preview is available, write-path validation (any lifecycle action, assignment, contact edit, adoption or Service Category change) is restricted to **Vivek and the designated QA lead**, using **only approved `QA-WS13-P1-*` records**. No real or customer Journey is modified. No general team testing against the shared Production database. The smoke test in step 12 stays read-only. | From step 11 until Release 1.3 Production release (or a separate QA database, Governance Backlog §2.9) | ✅ Approved; in force from step 11 |
| **C4-OC-2** | **No independent migration automation.** Before M11, confirm that no GitHub integration or other automation could apply database migrations on its own. **Result, 8-Oct-2026 (Tiger, read-only, Supabase dashboard via the Product Owner's signed-in browser):** Project Settings → Integrations → GitHub: *no repository connected* ("Choose GitHub repository"); Vercel integration: *not installed*; Branching: *GitHub connection — Not connected*, no preview or persistent branches. Repository: no automation (A.2). **Conclusion: nothing other than the operator's `db push` can apply M11.** Re-check at step 4 that the dashboard still shows no GitHub connection. | Before step 6; re-checked at step 4 | ✅ Verified 8-Oct-2026 |

### B.2 Sequence

**Step 3 — Backup** (A.5, `<phase>` = `ws13-p1-m11`). Docker running.

**Step 4 — Baseline**

```bash
cd /Users/viveksophu/Documents/Projects/SearchMyVacation
git switch ws13-milestone-b
git status            # expect clean, with no untracked files; if not, stop (pending governance files are committed beforehand, separately authorised; backup copies are kept outside the repository)
git switch feature/r1.3-ws13-journey-workspace
git merge --ff-only ws13-milestone-b   # B-D6 (Product Owner decision at Checkpoint 3); stop if not a fast-forward
git status            # expect clean
git log --oneline origin/feature/r1.3-ws13-journey-workspace..HEAD
                      # expect exactly eight lines, newest first: <G-CP4>, c9d6ec1, 1b1fd4d, 7291f46,
                      # 1f73a4b, 1034056, 4171107, 3101590 (Part B 'Commits to push') — anything else: stop
git status -sb        # expect 'ahead 8'; any other count: stop
shasum -a 256 supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql
                      # expect prefix 1b0a9b12afe7c106 (M11 as reviewed by Archie, 023A) — stop if different
# C4-OC-2: confirm in the Supabase dashboard (Project Settings → Integrations) that no GitHub repository is connected
npx supabase --version   # record it; must be exactly 2.120.0 (B-D4) — any other version: stop before step 6 and ask Rad
                         # (or run every CLI command in steps 4–10 as: npx supabase@2.120.0 …)
npx supabase migration list --linked | tee "$BACKUP_DIR/migration-list-before.txt"
                         # same terminal as step 3; expect 34 remote; 20261004100000 local only
```

**Step 5 — Pre-checks** (SQL Editor, read-only; Rad `023` §10 with Archie's SR-02 correction):

```sql
-- No existing function with the M11 prefix (expect 0 rows)
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname like 'workspace_journey%' order by 1;
-- Objects M11 reads and writes are owned by postgres (expect 0 rows; Archie 023A §7.6; Rad RAD-CP3-06)
select c.relname, c.relkind, pg_get_userbyid(c.relowner) as owner
from pg_class c
where c.relnamespace = 'public'::regnamespace and c.relkind in ('r','v','p')
  and c.relname like 'workspace\_%' and pg_get_userbyid(c.relowner) <> 'postgres'
order by 1;
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

**Expected results: the first query 0 rows; the ownership query 0 rows.** Evidence (Rad and Archie, CP3): of the 35 migration files, only M11 creates functions matching `workspace_journey%` (the 12 M11 functions). A row in the first query would mean an object created outside the migration history (plan assumption A2); a row in the ownership query means a `workspace_` table or view not owned by `postgres` → **stop**; Rad and Archie decide.

**Step 6 — Dry run:** `npx supabase db push --linked --dry-run`. Expect **exactly one file**, `20261004100000_workspace_journey_lifecycle_rpcs.sql`: 'Would push these migrations:' followed by that one file only, and no seed or roles file. This also proves the governance commit carries no migration (Archie ARCH-CP3-12).

**Step 7 — Apply:** `npx supabase db push --linked`. At the confirmation prompt, answer `y` only if it lists exactly that file. Expect exactly one 'Applying migration 20261004100000_…' line and a successful finish. Do not use `--include-all`, `--include-seed`, `--include-roles` or `migration repair` without Rad. If the command is interrupted or reports an error, follow the A.4 rule (two valid states). *(Rad RAD-CP3-10)*

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

The SQL Editor may display `config` in a JSON style, for example `["search_path=public"]`; that is the same value. Confirm with this one-row self-check (Archie ARCH-CP3-06). Expect `12 | 12 | 9 | 0`:

```sql
select count(*) as functions,
       count(*) filter (where p.prosecdef and p.proconfig = array['search_path=public']
                          and pg_get_userbyid(p.proowner) = 'postgres'
                          and not has_function_privilege('anon', p.oid, 'execute')) as hygiene_ok,
       count(*) filter (where has_function_privilege('authenticated', p.oid, 'execute')
                          and p.proname not in ('workspace_journey_lock_for_change',
                                                'workspace_journey_derive_template_items',
                                                'workspace_journey_notify')) as public_executable,
       count(*) filter (where has_function_privilege('authenticated', p.oid, 'execute')
                          and p.proname in ('workspace_journey_lock_for_change',
                                            'workspace_journey_derive_template_items',
                                            'workspace_journey_notify')) as helpers_executable
from pg_proc p
where p.pronamespace = 'public'::regnamespace and p.proname like 'workspace_journey%';
```

**Step 10 — Parity:** `npx supabase migration list --linked`. Expect **35 = 35**.

**Step 11 — Push** (only if steps 7–10 passed). First record in the deployment record the id of the branch's current Ready Preview deployment (Vercel → Deployments, branch `feature/r1.3-ws13-journey-workspace`; Phase 0 code). B.3 redeploys this one if needed.

```bash
git branch --show-current   # expect feature/r1.3-ws13-journey-workspace
git status                  # expect clean
git log --oneline origin/feature/r1.3-ws13-journey-workspace..HEAD
# expect exactly the eight commits in Part B 'Commits to push' (3101590, 4171107, 1034056, 1f73a4b, 7291f46, 1b1fd4d, c9d6ec1, <G-CP4>); anything else → stop
git push origin feature/r1.3-ws13-journey-workspace
```

Never use `--force`, and never push `ws13-milestone-b`. If the push is rejected, stop: do not pull, merge or force. *(Rad C-3)*

**Step 12 — Preview build READY, then smoke test.** This is the first cloud build of Milestone A, **Milestone B and WP-1.9** code; the local build used mocked fonts and placeholder settings (GF-3). In the Vercel dashboard, wait for the branch Preview to be **Ready**. Then, signed in as Administrator (Vivek signs in):

*Sign-in (v1.2 r4; F-2 — step 2 wording by Rad, RC-2):* WP-1.9 (`c9d6ec1`) changed the sign-in page and the session's role and display-name lookup, so Administrator sign-in is the first check, before the lookup and S-1. Vivek signs in.

1. **Vercel Authentication.** Open the branch Preview URL. If Vercel shows its own sign-in or access page, sign in to Vercel as a member of the team (B-D1). This is Vercel's protection, not the Workspace. If access is still refused, stop and record it as an access issue. It is not a Workspace or deployment fault: do not redeploy.
2. **Workspace sign-in.** Sign in at `/workspace/sign-in` with the Administrator account. Expect to land on `/workspace` (or on the page named in the sign-in URL's `redirectTo`, if sign-in was reached from a redirect). The header shows the account's display name with the role **Administrator**; on `/workspace` the welcome section shows the same name. The name is `workspace_users.display_name` if set; otherwise, as before WP-1.9, the full name in the account's profile, then the part of its e-mail before "@", then "Workspace User". Record the name and role shown.
3. **Refusal or expiry.** If you are returned to the sign-in page with the access-refused message, or "Your session has expired. Please sign in again.", or anything else unexpected happens, stop before S-1 (A.4). Do not retry with another account.
4. **Evidence.** Record in the deployment record (A.7): the exact message, the URL, the time (IST), the Preview deployment id and a screenshot.
5. **Decision.** Rad assesses the cause. **Vivek decides** whether to redeploy the Preview recorded at step 11 (A.6). M11 stays in place after a redeploy. Rolling M11 back is a separate decision under B.3 and A.6 (Rad proposes, Archie reviews, Vivek approves).

| # | Check | Expect |
|---|---|---|
| S-1 | Journey Planning queue; then the planning record of the Journey found by the lookup below (run the lookup **before S-1**; for S-1 use the JRN-1005 row if returned, otherwise JRN-1006), opened by entering the URL `/workspace/journey-planning/<journey_planning_record_id>` | Queue unchanged from Phase 0. The record page renders. **Wait until the page has finished loading, including the History panel** (it no longer shows "Loading history…"). Then read the stage pill (shown in capitals) and record exactly **one** C-12 result: **(a) Observed** — the pill shows "Closed · Confirmed" and, under it, "Converted to Journey JRN-#### →" with the same reference as the lookup row. **(b) Unexpected — stop.** The pill shows "Closed · Confirmed" but the line is missing or shows a different reference, or the History panel still shows "Loading history…" 30 seconds after the rest of the page has rendered: not a pass. **Stop the smoke test (A.4)**; do not continue to S-2. Record the page URL, the pill text, what is shown, the time (IST) and a screenshot, and refer to Rad. **(c) Not observable — record state.** The pill shows any other stage or outcome: record the pill text; C-12 is neither passed nor failed. **(d) Not observable — no qualifying record.** The lookup returns no Journey row: do not open any other record. Open, by entering the URL, `/workspace/journey-planning/00000000-0000-4000-8000-000000000000` and expect "Could not load this record" with "Journey Planning record not found."; record what is shown. C-12 is neither passed nor failed. For (c) and (d), C-12 is verified at E7 Validation (plan `020`, WP-1.10) / Phase 1 QA on `QA-WS13-P1-*` records. The header "Owner:" line may still show "You" or a raw user id (known item WS13-P1-P, OBS-WP19-01) — not a failure. **View only — no action clicked, no link on the page followed (including the C-12 link), and the Confirm dialog is not opened.** *(v1.2 r4; F-1, wording by Rad — RC-1. v1.1 expected "Unchanged from Phase 0", which no longer holds: `c9d6ec1` changes the record page and the Confirm dialog.)* |
| S-2 | `GET /api/workspace/journey-workspace` | `ok: true`, list and counts |
| S-3 | `GET /api/workspace/journey-workspace/summary-counts` | `ok: true` |
| S-4 | `GET /api/workspace/users/directory` | `ok: true`; each entry has `userId`, `displayName`, `role`, `isActive`; no e-mail field *(Rad C-5)* |
| S-5 | `GET /api/workspace/journey-workspace/<id>` for the same Journey as S-1 and S-7 (the JRN-1005 row if the lookup returns it, otherwise JRN-1006; Phase 0 QA Journeys, `DEC-R1.3-022` (5)); id from the read-only lookup below | `ok: true`, detail with available actions. **Read only — no action called.** *(v1.2 r4; S-5 behaviour authorised by the Product Owner, 23-Oct-2026 — RC-5)* |
| S-6 | Open `/workspace/journey-workspace` (Milestone B) | List page renders; no "Coming Soon"; summary counts shown; no console errors. **View only — no action clicked.** |
| S-7 | Open the JRN-1005 Journey page (or JRN-1006); if neither exists, use the id below | Header, people cards and the Overview / Itinerary / History tabs render; or the not-found state with a way back. **View only.** |

The smoke test is **read-only** (S-6 and S-7 open pages but click no action). Lifecycle mutations are exercised afterwards in integration verification (plan `020` §14.4), on `QA-WS13-P1-*` records only (`021` C-4; PO Decision 7). Lookup for S-1, S-5 and S-7 (SQL Editor, read-only; **run it after sign-in and before S-1**) *(v1.2 r2; F-3 — RC-3)*:

```sql
select id, journey_reference, stage, adoption_status, journey_planning_record_id from public.workspace_journeys
where journey_reference in ('JRN-1005', 'JRN-1006');
```

Use the actual query result. Do not assume either Journey exists: both are Phase 0 QA data (`DEC-R1.3-022` (5)), scheduled for removal before release. If the lookup returns no row, S-1 is outcome (d).

If neither row exists, S-5 becomes `GET /api/workspace/journey-workspace/00000000-0000-4000-8000-000000000000` (a well-formed id that does not exist; non-UUID ids are refused before any lookup): expect `ok: false` with code `not_found`. S-7 becomes opening `/workspace/journey-workspace/00000000-0000-4000-8000-000000000000`: expect the not-found state with a way back. *(Rad C-5)*

S-2 to S-5 are sent from the signed-in Workspace session, as in the 4-Oct Preview baseline (`023` §8.1). A 401 means the request was not authenticated; it is not a deployment failure. The smoke test proves the deployment and read paths only. M11 calls through the API are proven in integration verification (plan `020` §14.4) on `QA-WS13-P1-*` records. *(Rad RAD-CP3-11)*

**Step 13 — Close:** file the deployment record (A.7) with the Phase 1 closure documents.

### B.3 Rollback for M11

Prepared in `EBC-R1.3-WS13-023` §4.4 and verified by Archie (`023A` §6): it drops the nine functions and three helpers; no table or data is affected. Restoring the backup is not a rollback for M11 (A.5).

**First, on either route:** if the branch was already pushed, **redeploy the Preview recorded at step 11** before rolling back M11. The pushed branch contains the Phase 1 screens, whose mutation routes call M11 and would return 500 `operation_failed` without it (`026` §10). This removes the callers before the functions they call. *(Archie C-3)*

- **Standard:** raise the `023` §4.4 rollback as a new numbered migration in `supabase/migrations/`, **with its `begin;` and `commit;` lines removed**: the CLI already applies the file and its history row in one transaction (B-D4). Archie reviews it. Then: `npx supabase --version` (must be 2.120.0, B-D4; or run as `npx supabase@2.120.0`); dry run (expect only the corrective file); `npx supabase db push --linked`; `notify pgrst, 'reload schema';`; the step 9 query (expect **0 rows**); parity **36 = 36**. Commit the corrective file to the release branch (no push without authorisation). Re-applying the functions after this route needs a new numbered migration (Rad prepares, Archie reviews); `db push` will not re-run `20261004100000`. *(Rad C-4; Archie C-4, ARCH-CP3-15, -16)*
- **Fallback (CLI unavailable, `DEC-R1.3-029`):** in the SQL Editor as `postgres`, paste and run exactly this, in one execution. Do not paste the `023` §4.4 script itself: its own `begin;`/`commit;` would split the transaction. *(Archie C-3; Rad N-1)*

  ```sql
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
  delete from supabase_migrations.schema_migrations where version = '20261004100000';
  commit;
  notify pgrst, 'reload schema';
  ```

  Then run the step 9 query and expect **0 rows**. When the CLI is available, `migration list` must show 34 remote with `20261004100000` local only. Record "M11 reverted" in the deployment record. Do not run `db push` again until M11 is re-authorised, because it would re-apply M11. *(Rad N-6)*

**After either route:** do not push the release branch while M11 is absent. Any push rebuilds the branch Preview from HEAD, which contains the screens that call M11. Push again only after the functions are re-applied, under a new authorisation. *(Archie ARCH-CP3-14)*
---

## Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Engineering (technical steps) | Rad | **SIGNED — conditions C-1 to C-5 addressed** (v0.5; v1.0 changes limited to N-1 to N-6, Archie's notes and PO records, within the scope of her signature) | 8-Oct-2026 |
| Architecture (SR-01, SR-02) — Archie reviews the final runbook at Checkpoint 3 and confirms her deployment conditions are fully addressed | Archie | **CONFIRMED — SR-01 and SR-02 fully addressed** (v0.5; ARCH-CP3-14 to -18 taken into v1.0 without further review, as she stated) | 8-Oct-2026 |
| Product Owner (Checkpoint 3) | Vivek | **APPROVED** — decision D-3 (conditional approval: approve v1.0 once Rad signs and Archie confirms), conditions met; recorded as `DEC-R1.3-032` | 8-Oct-2026 |
| v1.2 original draft (17-Oct-2026, `cc420a35…`) — Engineering (Part B commit list, step 4/11 checks, step 12 expectations, B.3 with WP-1.9; brief R-a to R-d) | Rad | **WITHHELD — as reported in the Product Owner's 22-Oct-2026 direction concerning Rad's engineering review of the original draft.** The review identified F-1 (S-1), F-2 (sign-in note) and F-3 (lookup) as blocking findings. Rad's original report and review date are not available in this record; the outcome and findings have not been independently re-verified against that report. | **Unverified** — not yet supported by Rad's report or another reliable record |
| v1.2 original draft (`cc420a35…`) — Product Owner | Vivek | **CONDITIONAL APPROVAL** — approved as the intended runbook, subject to Rad's and Archie's confirmations and the Preview-access control (B-D1). If those require changes, the changed file needs re-confirmation and the Product Owner's approval of the changed text. **Not approval of r2, r3 or r4.** | 21-Oct-2026 (20:27 IST) |
| v1.2 correction approach for F-1 to F-3 — Product Owner | Vivek | **ACCEPTED IN PRINCIPLE** — the basis for revisions r2, r3 and r4. **Not approval of r2, r3 or r4.** | 22-Oct-2026 |
| v1.2 r3 (`bb1a36be…`) — Engineering (as above, plus RC-1 to RC-4 and the S-5 question RC-5) | Rad | **Outcome reported: CONFIRMED WITH CHANGES** — RC-3 confirmed; RC-1, RC-2 and RC-4 with changes; S-5 recommendation (A). Changes applied in r4. Reported to the Product Owner; to be recorded by Tiger. | 23-Oct-2026 |
| v1.2 r4 and the S-5 behaviour — Product Owner | Vivek | **AUTHORISED** — Rad's r3 recommendations accepted; the S-5 behaviour and this documentation revision authorised. **Not approval of v1.2, r4 or any earlier revision.** | 23-Oct-2026 |
| v1.2 r4 (`c0c6845b…`) — Engineering | Rad | **CONFIRMED** — against repository baseline `c9d6ec1`; acknowledged by the Product Owner on 24-Oct-2026; readiness record RA-2b. Rad's report text is not held. Carries forward to this committed text (ARCH-CP4-01; Rad's ruling RA-2c, 25-Oct-2026). | 23-Oct-2026 |
| v1.2 r4 (`c0c6845b…`) — Architecture (SR-01, SR-02, B.3 caller-before-function rule, step 6 expectation; A-a to A-d) | Archie | **CONFIRMED — architecture only** — readiness record RA-3; four non-blocking notes ARCH-CP4-01 to ARCH-CP4-04; follow-up RA-3a as reported by the Product Owner. Carries forward to this committed text (ARCH-CP4-01; approval-status line ruled in scope, RA-3b, 25-Oct-2026). | 24-Oct-2026 |
| ARCH-CP4-01 — carry-forward rule — Product Owner | Vivek | **DECIDED — Option A.** Rad's and Archie's confirmations of r4 carry forward only if the diff against r4 touches only the Version, Revision, Status and Date rows, the banner and the Approval table (and, as ruled on 25-Oct-2026, the approval-status line below the table); any change to Part A, B.1, B.1A, B.2 or B.3 requires re-confirmation. Evidence: CF-1 (readiness record). | 24-Oct-2026 |
| Preview access (B-D1, RB-8) — Product Owner | Vivek | **Product Owner confirmations given:** no share link will be issued for the branch Preview; Vercel team membership is acceptable as read access. **Step-12 verification: PENDING.** | 24-Oct-2026 |
| v1.2 — Product Owner final approval | Vivek | **APPROVED** — this committed text. Does not authorise Checkpoint 4. | 2026-10-25 |

**v1.2 is the approved runbook; it supersedes v1.1 when committed in `<G-CP4>`.** Approval does not authorise Checkpoint 4. No decision ID has been assigned to v1.2.

*Prepared by Tiger, Delivery Manager, on behalf of Team Satvi, 7–8 October 2026. Specialist reviews: `EBC-R1.3-WS13-030A` (Rad) and `EBC-R1.3-WS13-030B` (Archie). v1.2 review draft prepared by Tiger, 17 October 2026, from Tiger's read-only Part B reconciliation of the same date.*
