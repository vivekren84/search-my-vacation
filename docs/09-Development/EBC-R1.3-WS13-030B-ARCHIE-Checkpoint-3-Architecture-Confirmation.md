# EBC-R1.3-WS13-030B — Archie Architecture Confirmation of Deployment Runbook v0.4 (Checkpoint 3)

| Field | Value |
|---|---|
| Card | `EBC-R1.3-WS13-030`, item 3-9: confirm that SR-01 and SR-02 (`EBC-R1.3-WS13-023A` §5, §7) are fully addressed |
| Persona | Archie — Technical Architect |
| Subject | `RELEASE-1.3-DEPLOYMENT-RUNBOOK.md` **v0.4 (Checkpoint 3 candidate)** |
| Date | 8 October 2026 |
| Review mode | **Review only.** Read-only on the supplied inputs. No database, Supabase, Vercel, network or Git access. No credentials. No code or runbook change. |
| Outcome | **CONFIRMED WITH CONDITIONS** (C-1 to C-4, all runbook text changes) |

Archie confirms architecture conditions only. This document does not approve the engineering steps (Rad), the runbook (Product Owner) or any deployment.

---

## 1. Verdict

**CONFIRMED WITH CONDITIONS.**

The runbook meets the substance of SR-01 and SR-02:
- The apply path is atomic. I checked this myself in the CLI v2.120.0 source and in M11.
- History parity, the schema reload after apply and the 12-row post-check are all in place.
- The step 9 query is identical to my `023A` §7.4 query. Its expectations are correct against M11's actual grants and against Supabase default privileges.
- The sizing query uses the corrected definition of an active Journey.

Four gaps remain. All four are in how failures and rollback are handled, not in the main path. Each is closed by a specific text change (§4):

| # | Condition | Finding | Elements affected |
|---|---|---|---|
| **C-1** | Gate on the exact CLI version that the atomicity evidence covers (2.120.0), and correct the B-D4 description of which statements split a batch | ARCH-CP3-01 | SR-01 atomicity |
| **C-2** | Make the "`db push` fails" stop rule check the atomic outcome, and state that M11 has no SQL Editor apply path | ARCH-CP3-02 | SR-01 atomicity, fallback |
| **C-3** | SQL Editor rollback fallback: delete the history row in the same transaction, reload the schema, and apply the "redeploy Preview first" order to this route too | ARCH-CP3-03 | SR-01 parity and reload on rollback |
| **C-4** | When the prepared rollback becomes a CLI corrective migration, remove its `begin;`/`commit;` lines | ARCH-CP3-04 | SR-01 atomicity on rollback |

**What happens next.** Once Tiger has folded C-1 to C-4 into the runbook (v1.0), I need only check those four passages. No new architecture review is needed. Nothing in the main sequence (steps 3–13) has to change apart from the step 4 version line (C-1).

### Answers to the review questions

| # | Question | Answer |
|---|---|---|
| 1 | SR-01 | **Atomic application: yes**, on CLI v2.120.0 (verified in §2). **Parity: yes** (steps 4, 6 and 10). **Reload: yes** after apply (step 8) and on the standard rollback. It is **missing on the B.3 SQL Editor fallback** (C-3). The SQL Editor fallback is **atomic**, but **parity is not specified** (C-3). The CLI corrective-migration rollback is **not atomic with its history row** if it keeps the script's `begin`/`commit` (C-4). |
| 2 | SR-02 | **Fully met.** The pre-checks and post-check match `023A`. "Expect 12 rows" is correct for both LIKE patterns across all 35 migrations. `has_function_privilege` gives the intended result for the helpers. `service_role` does not change any expectation; it remains the SR-09 hardening note. |
| 3 | Rollback | **Sound.** M11 only adds functions: nothing depends on them, the rollback removes no data, and rows written by M11 stay valid. "Redeploy the previous Preview first, then roll back M11" is the correct order: it removes the callers before the functions they call. It must apply to the fallback route too (C-3). Restoring from backup is never a rollback for M11 (ARCH-CP3-10). |
| 4 | Coupling | **Safe.** Applying M11 before the push without a freeze (B-D1) stands: no deployed code calls M11, and `main` has no Workspace code. Once committed, the functions are exposed through the shared API. They refuse every caller except active Workspace users. The B-D6 fast-forward raises no architecture concern; the step 6 dry run is the control on what migrations travel with the push. |
| 5 | Other | Notes ARCH-CP3-05 to ARCH-CP3-13. None of them blocks. |

---

## 2. SR-01 trace

SR-01 as I worded it (`023A` line 133 and §7 item 2): the operator must
- apply M11 so that any error leaves nothing applied;
- record the version in the migration history so parity reads 35 = 35;
- run `notify pgrst, 'reload schema';`;
- do the same for the rollback, followed by the same `notify`;
- not edit the migration file.

`023A` §7.6 adds: apply as `postgres`.

The CLI evidence I verified is in `supabase-cli-v2.120.0/migration/` (abbreviated `cli/` below).

| # | Element | Runbook location | Evidence (file:line) | Status |
|---|---|---|---|---|
| 1.1 | M11 and its history row are applied as one transaction | B-D4 (RB:131); step 7 (RB:178) | <ul><li>`cli/file.go:121-186` `ExecBatch`: one `pgconn.Batch` (`:122`). Every statement that is not pipeline-incompatible is queued in it (`:164-175`). The history `INSERT` is queued in the **same** batch (`:178-183`, `:233-247`; SQL at `cli/history.go:18`). It is sent once (`:186`, then `:154` `PgConn().ExecBatch`), which ends with one Sync. PostgreSQL runs everything before a Sync as one implicit transaction. An error discards the rest and rolls everything back.</li><li>`cli/apply.go:56-75`: per file, `RESET ALL` (`:67`), then `ExecBatch` (`:72`). There is no other transaction wrapper.</li><li>`cli/file_test.go`: "ordinary create index" / "ordinary drop index" give `false`, so they stay in the batch. Only pipeline-incompatible statements run outside it (test "executes pipeline incompatible statements outside batch").</li><li>**M11 (my own split, dollar-quote aware):** 45 top-level statements: 12 `create or replace function`, 12 `comment on`, 12 `revoke all`, 9 `grant execute`. **0** match the six pipeline-incompatible patterns (`cli/file.go:32-37`). **0** transaction-control statements (every `begin`/`end` is inside a `$$` body). The only dollar tag is `$$`.</li><li>SHA-256 of the supplied M11: `1b0a9b12afe7c106bae097ebcb620c7542a1ad47bc7c46e8f9842c67f5bf120e`. This matches the step 4 prefix.</li></ul> | **Met for CLI 2.120.0**, but only once **C-1** is applied (see ARCH-CP3-01). <br>Caveats: <ul><li>The `db push` → `ExecBatch` call path is shown only by the source comment at `cli/file.go:115-120`. The push command itself is not in the supplied source.</li><li>The step 4 version gate is looser than the evidence.</li></ul> |
| 1.2 | After any error, nothing is applied, and the operator verifies that | A.4 third bullet (RB:62) | A.4 says "decide with Rad between completing and rolling back". That wording assumes a partial state, which B-D4 says cannot happen. It gives no check that would prove the clean state, and it does not cover an unknown outcome (for example a connection lost after the commit). | **Partly met.** C-2 closes it. |
| 1.3 | The history row is recorded as Phase 0 did | B-D4 (RB:131); step 7 | The CLI writes `supabase_migrations.schema_migrations(version, name, statements)` in the same batch (`cli/file.go:178-183`). This is the standard CLI mechanism (`DEC-R1.3-029`). | **Met** |
| 1.4 | Parity: 34 before, 35 = 35 after | Expected counts (RB:122); step 4 (RB:153); step 6 (RB:176, exactly one file); step 10 (RB:196) | `cli/apply.go:21-54` `FindPendingMigrations` refuses out-of-order or remote-only versions. `migration list` reads `LIST_MIGRATION_VERSION` (`cli/history.go:25`). | **Met** |
| 1.5 | The migration file is not edited | Step 4 SHA check (RB:150-151) | The prefix `1b0a9b12afe7c106` matches the reviewed file (verified above). | **Met** (stronger than requested) |
| 1.6 | Schema cache reloaded after apply | A.3 step 8 (RB:51); B.2 step 8 (RB:180) | It runs after step 7 has committed and before the step 9 checks. | **Met** |
| 1.7 | Rollback by the CLI is atomic with its history row | A.6 row 1 (RB:86); B.3 Standard (RB:226) | The prepared script contains `begin;` (`023`:128) and `commit;` (`023`:141). As a CLI migration, the explicit `commit;` would end the transaction **before** the CLI's history `INSERT` (`cli/file.go:178-186`). The drops and the history row would then commit separately. | **Partly met.** C-4 closes it. |
| 1.8 | Schema reload after rollback | B.3 Standard (RB:226) ✓; A.6 row 2 (RB:87) ✓; B.3 Fallback (RB:227) ✗ | B.3 Fallback says "`begin … commit`, then reconcile the migration history" and has no `notify`. | **Partly met.** C-3 closes it. |
| 1.9 | SQL Editor rollback fallback is atomic | A.6 row 2 (RB:87); B.3 Fallback (RB:227) | The script has `begin`/`commit` (`023`:128-141). An error aborts the block, so nothing commits. | **Met** |
| 1.10 | SQL Editor rollback fallback keeps parity | A.6 row 2 ("record the history change and reconcile parity afterwards"); B.3 Fallback ("reconcile the migration history") | No mechanism is stated. Without it, `migration list` shows 35 = 35 while the 12 functions are absent: a false parity. | **Not met.** C-3 closes it. |
| 1.11 | SQL Editor apply path | None in v0.4 (step 7 uses the CLI only) | `DEC-R1.3-029` names the SQL Editor as an operational fallback. v0.4 defines it only for rollback. An unscripted SQL Editor apply would skip the history row. | **Partly met.** Covered by the last sentence of C-2. |
| 1.12 | Applied as `postgres` (§7.6) | B-D5 (RB:132); step 9 `owner = postgres` (RB:194) | The link user is `postgres.<project-ref>`, which is Supavisor's form of `postgres` (Tiger's evidence; not verifiable by me). Step 9 proves the result independently. | **Met** (ARCH-CP3-09) |

---

## 3. SR-02 trace

SR-02 as I worded it (`023A` line 134 and §7 item 4):
- **Pre-checks:** 34 recorded migrations; no `public.workspace_journey%` function.
- **Post-check:** the §7 query returns 12 rows. Every row has `secdef = true`, `config = {search_path=public}`, owner `postgres` and `anon = false`. `authenticated` is true for the nine public functions and false for the three helpers.
- **Sizing:** the corrected "active Journeys" query.

| # | Element | Runbook location | Evidence (file:line) | Status |
|---|---|---|---|---|
| 2.1 | Pre: 34 recorded migrations | Step 4 (RB:153): "expect 34 remote; `20261004100000` local only" | There are 35 files in `migrations/`. M11 is the newest version (`20261004100000`). | **Met** |
| 2.2 | Pre: no `public.workspace_journey%` function; a row means stop | Step 5 (RB:159-161) plus the expectation (RB:174) | <ul><li>I grepped every `create [or replace] function` in all 35 files. The only names starting `workspace_journey` are M11's 12.</li><li>The other `journey` functions (`workspace_can_edit_journey`, `workspace_convert_journey_planning_record`, `*_journey_passport_*`) match neither pattern.</li><li>No procedures and no quoted names.</li></ul> | **Met** (pattern differs from step 9; see ARCH-CP3-05) |
| 2.3 | Post: the query is the one in §7.4 | Step 9 (RB:184-191) | Text-identical to `023A`:191-198 | **Met** |
| 2.4 | Expect 12 rows | RB:194 | The post-check pattern is `workspace_journey%`. Across 35 migrations only M11 creates matching functions, and it creates 12 (12 `create or replace function`). Any extra overload or hand-made object would already have stopped the run at step 5. | **Met** |
| 2.5 | `secdef = true` on all 12 | RB:194 | Every M11 function declares `security definer` (for example M11:65, :123, :160, and the nine public functions) | **Met** |
| 2.6 | `config = {search_path=public}` on all 12 | RB:194 | `set search_path = public` on every function (M11:66, 124, 161, 206, 296, 356, 416, 529, 585, 644, 719, 770) | **Met** (display note: ARCH-CP3-06) |
| 2.7 | `owner = postgres` on all 12 | RB:194; B-D5 | Proves the `023A` §7.6 owner assumption that the definer function reading the `security_invoker` view relies on | **Met** |
| 2.8 | `anon = false` on all 12 | RB:194 | <ul><li>Helpers: `revoke all … from public, anon, authenticated` (M11:185-187).</li><li>Public functions: `revoke all … from public, anon` (M11:925-933).</li><li>The Supabase default ACL grant to `anon` is removed by the explicit revoke. PUBLIC is revoked, so no inherited path is left.</li></ul> | **Met** |
| 2.9 | `authenticated = true` for the nine public functions | RB:194 (lists `transition`, `place_on_hold`, `resume`, `cancel`, `close`, `reassign`, `assign_template`, `set_service_category`, `adopt_legacy`) | `grant execute … to authenticated` (M11:935-943). The names and signatures match the nine. | **Met** |
| 2.10 | `authenticated = false` for the three helpers | RB:194 (lists `lock_for_change`, `derive_template_items`, `notify`) | <ul><li>M11:185-187 revoke from PUBLIC **and** `authenticated` explicitly. `has_function_privilege` therefore returns false: there is no PUBLIC grant to inherit, the default-ACL grant is revoked, and `authenticated` is not a member of any role that holds EXECUTE.</li><li>I modelled this under Supabase-style default privileges in `023A` §7.3 (helpers: `anon f`, `authenticated f`, `service_role t`).</li></ul> | **Met** |
| 2.11 | Default-privilege subtleties that would make the expectations wrong | n/a | <ul><li>`service_role` keeps EXECUTE on all 12 (default ACL). The query does not test `service_role`, so no expectation is wrong. It stays the SR-09 hardening note.</li><li>`create or replace` keeps ACLs on re-apply (`023A` §6).</li><li>Default ACLs are per grantor, so only `postgres`'s defaults apply, which is the case I modelled.</li><li>Atomicity also means the brief "granted by default" state between `create` and `revoke` is never visible to another session.</li></ul> | **Met** (no change; ARCH-CP3-07) |
| 2.12 | Corrected "active Journeys" sizing | Step 5 (RB:163-164) uses `is_active` from the view | `is_active` is defined at `migrations/20260928100800…:111` as `j.stage <> 'journey_closed' and j.outcome is null and j.archived_at is null`. That is exactly my corrected expression (`023A`:134, second option). | **Met** |
| 2.13 | B-8 cost on real data | Step 5 (RB:171) | Read-only `explain (analyze, buffers)` | **Met** (beyond SR-02) |

---

## 4. Other findings

Severity:
- **Blocking**: architecture cannot be confirmed.
- **Should-fix**: a condition of this confirmation; a runbook text change before v1.0.
- **Note**: no change required.

### ARCH-CP3-01 — The CLI version gate is looser than the evidence (Should-fix, **C-1**)

**Finding.** The atomicity proof is specific to the code in `cli/file.go`. The same file shows the CLI is being moved to a TypeScript implementation (`:115-120`: "remaining Go-delegated paths … in favor of a fully native TypeScript container-bootstrap port"). A later 2.x release could therefore apply `db push` through a different path. B-D4 stops only on "a different **major** version".

Tiger's evidence identifies v2.120.0 from `supabase/.temp/cli-latest`. As far as I know the CLI, that file is the update-check cache: it records the latest **published** release the CLI has seen, not the installed version. The code that writes it is not in the supplied source, so I cannot prove this here. Either way, the installed version is unknown until step 4.

Separately, B-D4 and `030` §4.1 list `CREATE INDEX`, `DROP INDEX` and `REINDEX` as batch-splitting. Only the `CONCURRENTLY` forms split a batch (`cli/file.go:32-34`; `file_test.go` "ordinary create index" / "ordinary drop index" → `false`). The conclusion for M11 is unaffected, but the reusable Part A text would mislead a future phase.

**Proposed wording.**
- Step 4 (replace RB:152):
  ```bash
  npx supabase --version   # must print exactly 2.120.0 — the version whose source proves B-D4.
                           # Any other version → stop. Rad re-verifies MigrationFile.ExecBatch and the
                           # db push path for that version before continuing (or the operator runs every
                           # CLI command in steps 4–10 as `npx supabase@2.120.0 …`).
  ```
- B-D4: replace "The operator records the CLI version at step 4. If a different major version is in use, stop and ask Rad." with:
  > "The evidence holds for v2.120.0 only. `supabase/.temp/cli-latest` is not evidence of the installed version. Step 4 records the actual version; if it is not 2.120.0, stop and ask Rad."
- B-D4: replace "(`CREATE INDEX`, `DROP INDEX`, `REINDEX`, `VACUUM`, `ALTER SYSTEM`, `CLUSTER`)" with:
  > "(`CREATE [UNIQUE] INDEX CONCURRENTLY`, `DROP INDEX CONCURRENTLY`, `REINDEX … CONCURRENTLY`, `VACUUM`, `ALTER SYSTEM`, `CLUSTER` — `file.go` lines 32–37; an ordinary `CREATE INDEX` or `DROP INDEX` stays in the batch), or an explicit `begin`/`commit`, which would end the CLI's transaction early"

### ARCH-CP3-02 — The "`db push` fails" stop rule does not verify the atomic outcome (Should-fix, **C-2**)

**Finding.** SR-01 exists so that a failed apply leaves nothing behind. A.4 (RB:62) still frames a failure as a partial state to "complete or roll back". It gives the operator no check that proves the clean state. It also does not cover a reply lost after the commit, where the apply succeeded but the CLI reports an error. Nothing in v0.4 forbids an improvised SQL Editor apply, which would skip the history row.

**Proposed wording** (replace the A.4 third bullet):

> **`db push` reports an error or stops part-way → do not re-run blindly.** Record the exact output. The CLI applies each migration file and its history row in one transaction (B-D4), so after a failure there are only two valid states. Check which one you are in with step 5's first query and `npx supabase migration list --linked`:
> (a) **0 rows and 34 remote**, with the phase's version local only → nothing was applied. Fix the cause with Rad and restart at step 6.
> (b) **All expected objects present and local = remote** (for M11: 12 rows and 35 = 35) → the apply committed and only the reply was lost. Continue at step 8.
> Any other combination → **stop**, and decide with Rad and Archie.
> **Do not apply a migration through the SQL Editor.** This runbook has no SQL Editor apply path; one would need an amended, reviewed runbook.

### ARCH-CP3-03 — SQL Editor rollback fallback: no parity mechanism, no reload in B.3, call order not stated (Should-fix, **C-3**)

**Finding.**
- After the drops, `supabase_migrations.schema_migrations` still holds `20261004100000`. `migration list` would read 35 = 35 while the functions are absent: a false parity. A later `db push` would then not re-apply M11.
- "Reconcile afterwards" leaves the history and the schema inconsistent for an open-ended period.
- B.3 Fallback omits the `notify`.
- The "redeploy previous Preview first" order is stated only under Standard.

**Proposed wording.**
- A.6 row 2, replace the Rollback cell with:
  > "SQL Editor fallback (`DEC-R1.3-029`): in one execution, as `postgres`: `begin;` + the prepared rollback statements + `delete from supabase_migrations.schema_migrations where version = '<version being rolled back>';` + `commit;` Then `notify pgrst, 'reload schema';`. This is the same history change as `supabase migration repair --status reverted <version>`, made in the same transaction, so parity holds at once. Confirm with `npx supabase migration list --linked` when the CLI is available."
- B.3, replace the Fallback bullet with:
  > **Fallback (urgent, CLI unavailable):** if the branch was already pushed, redeploy the previous Preview build first (as for Standard). Then, in the SQL Editor as `postgres`, run in one execution:
  > ```sql
  > begin;
  > -- the 12 drop function statements of EBC-R1.3-WS13-023 §4.4, unchanged
  > delete from supabase_migrations.schema_migrations where version = '20261004100000';
  > commit;
  > notify pgrst, 'reload schema';
  > ```
  > Then run the step 9 query and expect **0 rows**. When the CLI is available, `migration list` must show 34 remote with `20261004100000` local only. Do not run `db push` again until M11 is re-authorised, because it would re-apply M11.
- B.3, Standard bullet: move "If the branch was already pushed, redeploy the previous Preview build first …" into a lead sentence that applies to **both** routes.

### ARCH-CP3-04 — The corrective migration must not carry `begin`/`commit` (Should-fix, **C-4**)

**Finding.** The prepared rollback (`023` §4.4) has `begin;` and `commit;` because it was written for the SQL Editor. If it becomes a numbered migration applied by the CLI, those lines become batch statements. The explicit `commit;` ends the transaction before the CLI's history `INSERT` (`cli/file.go:178-186`), which then commits on its own. If the `INSERT` fails, the functions are dropped with no history row, which is the parity break SR-01 is meant to prevent.

**Proposed wording** (append to A.6 row 1 and to B.3 Standard):

> "When the prepared rollback is turned into a numbered corrective migration, remove its `begin;` and `commit;` lines. The CLI already applies the file and its history row in one transaction (B-D4). Keep `begin`/`commit` only for the SQL Editor fallback. For the M11 corrective migration:
> - dry run: exactly that one file;
> - after apply: schema reload; step 9 query → **0 rows**; parity 36 = 36."

### ARCH-CP3-05 — The pre-check and post-check use different LIKE patterns (Note)

Step 5 uses `'workspace_journey_%'` (`_` is a single-character wildcard). Step 9 uses `'workspace_journey%'`. Across the 35 migrations both return exactly M11's set, so neither expectation is wrong. The step 5 pattern is marginally narrower: it would not show a function named exactly `workspace_journey`.

*Optional:* use `like 'workspace_journey%'` in step 5 so that 0 before and 12 after are measured over the same set.

### ARCH-CP3-06 — How the SQL Editor displays `proconfig` (Note)

The SQL Editor may show the `text[]` value in a JSON style, for example `["search_path=public"]`, instead of `{search_path=public}`. Under A.4 an operator could read that as unexpected and stop.

*Optional:* add this one-row self-check after the step 9 query. Expect `12 | 12 | 9 | 0`.

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

### ARCH-CP3-07 — `service_role` and default privileges (Note, no change)

On the hosted project all 12 functions will show `service_role` EXECUTE. This is expected (`023A` §7.3) and is not part of the pass criteria. SR-09 stays a hardening-card item: a non-exposed schema for the helpers, and repeating the revokes on any future `drop` and re-`create`. It does not change any step 9 expectation.

### ARCH-CP3-08 — API exposure when the apply commits (Note, no change)

Preview and Production share one database and one PostgREST. When step 7 commits, the nine public functions become callable at `/rest/v1/rpc/…` by any holder of an `authenticated` JWT on the project. This may happen even before step 8, because Supabase's DDL event trigger usually reloads the schema itself. Step 8 remains required as the explicit control.

The functions guard themselves:
- the caller must be an active `workspace_users` row (M11:72-75);
- the role and owner rules follow (M11:90-104);
- `anon` has no EXECUTE.

So B-D1 (no freeze) still holds.

The gate's view read runs inside the RPC, on the database. The Vercel iad1 to ap-northeast-2 latency is therefore paid once per call and does not lengthen the row-lock hold time (SR-05).

### ARCH-CP3-09 — Applying role (Note, no change)

I cannot verify the session role behind `postgres.<project-ref>`. In particular I cannot verify whether a CLI login role with `SET ROLE` is involved. Step 9's `owner = postgres` is the deciding control.

If any row shows another owner, A.4 applies (do not push). The remedy is a reviewed decision (Rad, then Archie), not an ad hoc `alter function … owner to`. The `security_invoker` view read inside the definer functions depends on the owner owning the base tables (`023A` §7.6).

### ARCH-CP3-10 — Restoring from backup is not an M11 rollback (Note)

A.6 row 3 ("Data damaged → restore") is correctly marked as a last resort. For M11 it never applies:
- the rollback removes no data;
- rows written through M11 satisfy the M07 and M08 constraints (`023A` §6);
- a restore on the shared database would also discard Production lead data written since the backup.

*Optional* B.3 line: "Restore from backup is not a rollback option for M11."

### ARCH-CP3-11 — Rollback order and soundness (Note, confirmed)

The B.3 rollback is architecturally sound:
- it drops exactly the 12 signatures M11 creates (`023A` §6);
- no table, view, policy or trigger depends on them;
- it is idempotent (`if exists`);
- M11 can be re-applied afterwards with the same ACLs.

The order "redeploy the previous Preview, then drop" is correct now that the pushed branch contains screens that call M11 (`026` §10, line 248). It removes the callers first, so the shared API never serves a build whose mutation routes fail. Reversing the order would cause only 500 `operation_failed` on Preview mutations, with no data effect. It is still the wrong order.

The "previous Preview" is the Phase 0 build of `origin/feature/r1.3-ws13-journey-workspace` (`6c78ac7`, `030` §2). It does not call M11. Production is never involved.

### ARCH-CP3-12 — Push contents and the B-D6 fast-forward (Note, no change)

The fast-forward is local, adds no merge commit and rewrites no history. The step 4 checks (SHA, `ahead 5`) then run on the release branch.

The architecture control on push contents is step 6: the dry run must list **exactly one** file. That guarantees the D-2 governance commit carries no migration under `supabase/migrations/`.

Tiger should confirm that no repository automation applies migrations when a branch is pushed (for example a Supabase GitHub integration or CI that runs `db push`). If one existed, it would find `20261004100000` already recorded and do nothing, but its existence should be known.

### ARCH-CP3-13 — The confirmed text must be the text that is run (Note)

My confirmation covers v0.4 plus C-1 to C-4. CP3-F5 records that the repository holds v0.2. The operator must run the committed v1.0 that contains these changes. I will check only the four amended passages.

### Limits of this review

**Verified by me:**
- the CLI 2.120.0 `pkg/migration` source and tests;
- M11 (statement split, grants, SHA-256);
- all 35 migrations (function names, the `is_active` definition);
- the runbook text against `023A`, `023` and `030`.

**Not verifiable here:**
- the `db push` command code that calls `ApplyMigrations` (outside `pkg/migration`; only the `file.go` comment evidences it);
- the installed CLI version;
- the pooler mode and session role;
- the hosted default ACLs and role memberships (modelled in `023A`);
- the SQL Editor display format.

Each of these is either covered by a runbook check (steps 4, 9 and 10, and C-2), or recorded above as a note.

---

## 5. Statement

Archie confirms architecture conditions only; engineering sign-off is Rad's and approval is the Product Owner's.

**Outcome:** SR-01 and SR-02 are **CONFIRMED WITH CONDITIONS C-1 to C-4** (§4: ARCH-CP3-01 to ARCH-CP3-04). Once Tiger records them in runbook v1.0 and I have checked those passages, I will sign the runbook's Architecture line as fully addressed. No change to M11 is required.

— Archie, Technical Architect, 8 October 2026

---

## 6. Addendum — check of v0.5 (8 October 2026)

| Field | Value |
|---|---|
| Subject | `/home/claude/gov/RELEASE-1.3-DEPLOYMENT-RUNBOOK.md` **v0.5**, references below as `v0.5:<line>` |
| Scope | Only the amended passages: A.2, A.4 (third bullet), A.5, A.6, B-D4, B-D5, and steps 4, 5, 6, 7, 9 and 11, plus B.3. I also checked Rad's B.3 Standard route (his C-4) and RAD-CP3-06. |
| Mode | Review only, as before. I made no edits other than this report. |

### 6.1 My conditions

| Condition | Required change (§4) | Where in v0.5 | Status |
|---|---|---|---|
| **C-1** CLI version gate and B-D4 accuracy | <ul><li>Step 4: exactly 2.120.0, else stop.</li><li>B-D4: `cli-latest` is not evidence of the installed version.</li><li>Correct the list of statements that split a batch.</li></ul> | <ul><li>Step 4, `v0.5:156-157`: "must be exactly 2.120.0 (B-D4) — any other version: stop before step 6 and ask Rad", with the `npx supabase@2.120.0` alternative.</li><li>B-D4, `v0.5:135`: "This evidence holds for CLI 2.120.0 only. `supabase/.temp/cli-latest` is not evidence of the installed version…".</li><li>The list is corrected to the `CONCURRENTLY` forms with `file.go` lines 32–37. It also states that an ordinary `CREATE/DROP INDEX` stays in the batch and that an explicit `begin`/`commit` ends the transaction early.</li><li>A.2, `v0.5:32`, names CLI **2.120.0** as the prerequisite.</li></ul> | **Addressed** |
| **C-2** A.4 two-state rule; no SQL Editor apply path | Replace the third bullet of A.4 | <ul><li>A.4, `v0.5:63`: my wording verbatim. States (a) and (b), then "any other combination → stop", then "Do not apply a migration through the SQL Editor…".</li><li>Step 7, `v0.5:190`, points to it: "follow the A.4 rule (two valid states)".</li><li>Step 5's first query now uses the same `workspace_journey%` pattern as step 9 (`v0.5:167`). The "0 rows" of state (a) and the "12 rows" of state (b) are therefore measured over the same set.</li></ul> | **Addressed** |
| **C-3** SQL Editor rollback: history row deleted in the same transaction, reload, Preview order on both routes | <ul><li>A.6 row 2.</li><li>B.3 Fallback.</li><li>"Redeploy first" applies to both routes.</li></ul> | <ul><li>A.6 row 2, `v0.5:91`: my wording verbatim.</li><li>B.3 Fallback, `v0.5:273`: my wording verbatim.</li><li>`v0.5:270`: "First, on either route: … redeploy the Preview recorded at step 11 before rolling back M11".</li><li>Step 11, `v0.5:229`, now records the deployment id to redeploy. That makes "previous Preview" unambiguous.</li></ul> | **Addressed** |
| **C-4** Corrective migration without `begin`/`commit` | Append to A.6 row 1 and B.3 Standard | <ul><li>A.6 row 1, `v0.5:90`: my wording verbatim.</li><li>B.3 Standard, `v0.5:272`: "with its `begin;` and `commit;` lines removed: the CLI already applies the file and its history row in one transaction (B-D4)", followed by dry run, reload, step 9 → 0 rows and parity 36 = 36.</li></ul> | **Addressed** |

**SR-01 and SR-02 core passages are unchanged or strengthened:**
- Step 9's query (`v0.5:197-203`) is still text-identical to `023A` §7.4. Its expectation (`v0.5:206`) is unchanged.
- The adopted self-check (`v0.5:211-224`) is a correct `text[]` comparison. `12 | 12 | 9 | 0` is the right expectation against M11's revokes (M11:185-187, 925-933) and grants (M11:935-943).
- Step 6 (`v0.5:188`) still requires exactly one file and now also excludes seed and roles files.
- Step 8 (reload) and step 10 (35 = 35) are unchanged.
- A.5 (`v0.5:81-82`) records that the dumps do not contain the migration history (step 4 saves the `migration list` output), and that a restore is never the rollback for M11. Both are correct.

### 6.2 Rad's conditions in my area

**Rad C-4: B.3 Standard route (`v0.5:272`).** It does **not** weaken SR-01 or SR-02.
- With `begin`/`commit` removed, the CLI applies the 12 `drop function if exists` statements and the history row in one transaction. These statements are not pipeline-incompatible (`file.go:32-37`).
- "Dry run: only the corrective file" is the same control as step 6.
- The reload after apply is the SR-01 rollback requirement.
- "Step 9 → 0 rows" is the right SR-02 inverse. Before M11 nothing matched `workspace_journey%` (`023A` §6), so 0 rows proves an exact return to the pre-M11 catalogue for this prefix.
- Parity 36 = 36 is correct: M11 stays recorded and the corrective migration is added on top.
- "Archie reviews it" keeps the review gate from A.6.
- Committing the corrective file locally keeps the repository and the history in agreement: a fresh replay of the migrations ends with no functions.

There are two consequences the operator should know. Neither is a defect in the route (see 6.3, ARCH-CP3-15 and -16):
- The CLI version gate also applies to this push.
- After this route, M11's version stays recorded. Re-applying the functions later needs a **new** numbered migration; a second `db push` of M11 will not do it.

**RAD-CP3-06: step 5 ownership pre-check (`v0.5:168-173`).** It does **not** weaken SR-02; it strengthens the `023A` §7.6 owner assumption.
- **Correct.** The query is read-only. With `standard_conforming_strings` on, `like 'workspace\_%'` treats `\_` as a literal underscore. Relkinds `r`, `v` and `p` cover tables, views and partitioned tables.
- **Covers what matters.** Every relation M11 reads or writes is named `public.workspace_…`: `workspace_users`, `_journeys`, `_audit_log`, `_notifications`, `_tasks`, `_vendors`, `_readiness_templates`, `_readiness_template_items`, `_journey_readiness_items`, `_journey_operational_contacts`, `_journey_planning_records`, `_journey_vendor_bookings`, and the view `_journey_operational_summary`. The view's own base tables are also `workspace_…` (`_configuration`, `_journey_vendor_bookings`, `_journey_documents`, `_journey_readiness_items`, `_journeys`). So the check covers every base table that the definer-owner and `security_invoker` view argument depends on. The two helper functions M11 calls (`workspace_business_today`, `workspace_config_has_code`) are SECURITY DEFINER themselves and fall outside `pg_class`. This is acceptable.
- **The expectation is right.** No migration contains `owner to` (grep over all 35 files), so the CLI-applied tables are owned by the applying role, `postgres`.

**B.3 Fallback.** v0.5 uses my C-3 wording. If Rad prefers a `migration repair --status reverted` variant, it would be architecturally equivalent only if the repair runs **before** any further `db push` and **in the same window**. Otherwise the history would show 35 = 35 while the functions are absent, the false parity C-3 removes. My wording needs no CLI at all, which is the premise of this route. I recommend keeping it.

### 6.3 Issues introduced or exposed by the edits

| ID | Severity | Finding | Proposed wording |
|---|---|---|---|
| ARCH-CP3-14 | Note | The B.3 rollback leaves the release branch on `origin` containing the M11-calling screens. **Any** later push of that branch, including the corrective commit Rad's route asks to commit, rebuilds the branch Preview from HEAD. That would bring the callers back while M11 is absent, undoing the "callers first" order on both routes. The only effect is 500 `operation_failed` on Preview mutations; there is no data effect. That is why this is a Note and not a condition. | Append to B.3 after the two bullets: "After either route, do not push the release branch while M11 is absent: any push rebuilds the branch Preview from HEAD, which contains the screens that call M11. Push again only after the functions are re-applied, under a new authorisation." |
| ARCH-CP3-15 | Note | The CLI 2.120.0 gate covers "steps 4–10" (`v0.5:135`, `v0.5:156-157`). The B.3 Standard push runs outside that range. The risk is low: the drops are idempotent, so a non-atomic partial failure is cured by re-running the push. | B.3 Standard: before "dry run", insert "`npx supabase --version` (must be 2.120.0, B-D4);". If the `npx supabase@2.120.0` alternative is used, the version check itself must also be run as `npx supabase@2.120.0 --version`. |
| ARCH-CP3-16 | Note | After the Standard route, `20261004100000` stays recorded. Re-applying M11 then needs a new numbered migration with M11's content (Archie review). After the Fallback route, the history row is gone, so a plain `db push` re-applies M11, as `v0.5:273` already says. The two routes leave different but each self-consistent states. | B.3 Standard, at the end: "Re-applying the functions after this route needs a new numbered migration (Rad prepares, Archie reviews); `db push` will not re-run `20261004100000`." |
| ARCH-CP3-17 | Note | A.2 (`v0.5:33`) accepts a CLI temporary login role. If that role does not switch to `postgres`, the functions would be owned by it. Step 9 detects this, and B-D5 (`v0.5:136`) stops and calls for a corrective migration. That is adequate: nothing is pushed and no deployed code calls the functions. | None. B-D5's request to copy the CLI's connection lines (for example "Initialising login role…") into the record is the right evidence. |
| ARCH-CP3-18 | Note (editorial) | A.4 state (a) says "0 rows and 34 remote" inside the reusable Part A, while state (b) already says "for M11". | Optional: "(a) **0 rows and the baseline remote count** (for M11: 34)…". |

None of ARCH-CP3-14 to -18 affects SR-01 or SR-02. None of them is a condition.

### 6.4 Final verdict

## **CONFIRMED — SR-01 and SR-02 fully addressed.**

Runbook v0.5 contains conditions C-1 to C-4 as I worded them. Rad's B.3 Standard route and RAD-CP3-06 keep or strengthen SR-01 and SR-02. No change remains that I require.

ARCH-CP3-14 to -18 are recommended notes. ARCH-CP3-14 is the one I recommend most: it adds one sentence to B.3. The Product Owner may take them into v1.0 without another Archie review.

This verdict replaces the "CONFIRMED WITH CONDITIONS" in §1 and §5 for v0.5 and for a v1.0 that keeps these passages unchanged. Archie may sign the runbook's Architecture line on that basis.

Archie confirms architecture conditions only; engineering sign-off is Rad's and approval is the Product Owner's.

— Archie, Technical Architect, 8 October 2026
