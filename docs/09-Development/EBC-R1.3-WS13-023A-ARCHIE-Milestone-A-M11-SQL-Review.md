# EBC-R1.3-WS13-023A — Milestone A: M11 SQL Review (AC-9)

| Field | Value |
|---|---|
| Card | EBC-R1.3-WS13-023A — independent SQL review of M11 (architecture condition AC-9; `WS13-021` C-2) |
| Persona | Archie — Technical Architect |
| Reviews | `supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql`, as submitted in `EBC-R1.3-WS13-023` (Rad, Milestone A), with the rollback script `M11_rollback_forward_fix.sql` and the local test evidence |
| Baseline | `EBC-R1.3-WS13-020` Rev 2 §8.2, §8.4, §9, §10; `EBC-R1.3-WS13-020A` (AC-1 … AC-9); `EBC-R1.3-WS13-021` |
| Date | 5 October 2026 |
| Outcome | **Approved with conditions.** No change to the SQL is required. The conditions (SR-01, SR-02) apply to the deployment runbook before M11 is applied to the shared database. |

Archie did not write M11. This review does not approve engineering completion, functional behaviour, traveller experience, the deployment runbook or release. The Product Owner holds final authority.

---

## 1. Summary and outcome

**Outcome: Approved with conditions.**

M11 does what plan §9 specifies and meets AC-1 to AC-9. I found no blocking defect. Every relation in the function bodies is `public.`-qualified. The actor always comes from `auth.uid()`. The three internal helpers cannot be executed by `anon` or `authenticated`, including under Supabase-style default privileges. The row lock and the optimistic checks behave correctly under real concurrency. The 33 error codes match the plan §8.2 list exactly. The rollback drops exactly what M11 creates.

I tested the functions under a non-superuser owner without BYPASSRLS. They behave identically. This matters because the readiness gate reads a `security_invoker` view from inside a SECURITY DEFINER function.

Conditions before application (both are runbook items, not SQL changes):

- **SR-01** — apply M11 in one explicit transaction, record it in the migration history as Phase 0 did, and reload the PostgREST schema cache.
- **SR-02** — extend the pre- and post-application checks to all twelve functions, as in §7.

Two items need a decision, but not for Phase 1 (§8):

- **SR-03** — Journeys that get their Readiness Template while the template is empty (every Phase 1 adoption and Start preparation) will not receive readiness items when the Phase 2 content arrives. The BR-028 gate will then never block for those Journeys. Phase 2 must decide on a back-fill.
- The checkpoint numbering in Rad's report differs from `WS13-021` §11.

Deviations D-1, D-2 and D-3 are accepted (§4).

---

## 2. Method

**Read in full:** M11 (943 lines); `020A`; plan §8–§10 and §12; `021`; Rad's report `023`; the rollback script; migrations M01–M10 and their WS11/WS12 predecessors where M11 touches them (journeys, child tables, settings, notifications, tasks, audit log, summary view, conversion v2). I also read the service validation in `web/lib/workspace/journey-workspace/validation.ts`, but only to compare it with the SQL checks. The service layer is not under review.

**Environment:** local PostgreSQL 17.6 with Rad's Supabase shim. No remote database was used.

| Run | Database | Result |
|---|---|---|
| Rad's suite, fresh replay (35 migrations, owner = superuser) | `archie_r1` | **198 / 198 pass** |
| Rad's suite after: M11 → rollback → Supabase-style default privileges → M11 inside `begin … commit` → M11 re-applied twice | `archie_dp` | **198 / 198 pass** |
| Rad's suite with every migration applied by a **non-superuser, NOBYPASSRLS** owner (`smvowner`) | `archie_ns` | **198 / 198 pass** |
| My independent probes (`probe_m11.py`), fresh replay | `archie_p1` | 64 checks: 61 passed as written. 1 false positive (B1, a regex that matched `is distinct from` and comment text; a corrected re-scan finds no unqualified relation). **2 genuine failures (C1, C1b → SR-04).** |
| My probes, non-superuser owner | `archie_ns` | Same 64 results |
| Phase 2 content probe (`probe_phase2.py`) | `archie_p2` | Confirms SR-03 |
| Readiness-gate cost, 2,000 synthetic Journeys (Rad's seed), 20 random Journeys | `archie_perf` | View read median **10.6 ms**, max **15.3 ms**. Plan shows the materialised CTEs (`Rows Removed by Filter: 1999`). |
| Rollback verification (§6) | `archie_dp`, `archie_base` | Exact match with the pre-M11 catalogue |

**My probes covered:**
- catalogue: definer flag, `search_path`, ACLs for `PUBLIC`, `anon`, `authenticated` and `service_role`;
- a source scan: unqualified relations, dynamic SQL, the error-code set and the SQLSTATE of each code;
- whitespace-only reasons;
- notification recipients on every notifying path (Administrator acting; deactivated owner; owner acting);
- adoption: contact insert, update and no-change paths; `phone_changed`/`email_changed`; a search of the whole audit log for the phone and email values (0 rows); nights stored, derived, zero and mismatched; a non-Administrator caller; corporate without organisation;
- Start preparation after adoption: no re-derivation;
- the gate with Not Applicable and optional-only items;
- a template deactivated after adoption;
- direct `UPDATE` and `SELECT … FOR UPDATE` on `workspace_journeys` as `authenticated`;
- a helper called with a crafted actor;
- three two-session races (hold vs transition, reassign vs reassign, cancel vs hold) and a non-owner call against a held lock;
- audit-timestamp order;
- duplicate and null booking ids.

**Not verified by me:**
- how the Supabase SQL editor handles transactions (no access; see SR-01);
- the exact role attributes of `postgres` on the hosted project;
- the service-written POC audit (AC-5, service part) beyond reading `validation.ts`;
- Rad's 112-check PostgREST suite (not re-run);
- B-8 on the shared database (Product Owner action).

Scripts and outputs are in the scratchpad, `…/scratchpad/archie/`.

---

## 3. AC-1 … AC-9 compliance

| # | Condition | Evidence | Status |
|---|---|---|---|
| AC-1 | `security definer`, `set search_path = public`, `public.`-qualified objects, `revoke … from public, anon`, `grant … to authenticated`, `p_`/`v_` naming, no `RETURNS TABLE` | All 12 functions: `prosecdef = true` and `proconfig = {search_path=public}` (probe A2). The corrected scan finds no unqualified relation. The only unqualified calls are `pg_catalog` built-ins (`coalesce`, `trim`, `length`, `now`, `clock_timestamp`, `jsonb_build_object`, `array_agg`, `unnest`, `count`, `nullif`). `pg_catalog` is always searched first, so these cannot be shadowed. `auth.uid()` is schema-qualified. No dynamic SQL (no `execute`, no `format`). Grants: lines 925–943; `PUBLIC` and `anon` have no EXECUTE on any function (A3). No actor parameter. No `RETURNS TABLE`. | ✅ |
| AC-2 | One derive helper, revoked from `public`, `anon` and `authenticated`, used by functions 7 and 9 | Defined at lines 116–144; revoked at line 186; called at line 683 (fn 7) and line 848 (fn 9) only. A direct call with a crafted actor → 42501 (C5). Items are derived once: Start preparation on an adopted Journey with the same template derives nothing more (C4). | ✅ |
| AC-3 | Gate reads the summary view; no duplicate expression; view profiled | Lines 236–247 read `readiness_mandatory_unresolved` from `workspace_journey_operational_summary`. Profiled by Rad (13.3 ms per call at 2,000 Journeys) and by me (10.6 ms median for the view read). Behaviour: an outstanding mandatory item blocks; Not Applicable and optional-only items do not block; an empty template never blocks (PO Decision 4). | ✅ (see SR-03, SR-05) |
| AC-4 | Adoption audit carries `nights_source` and the value | Lines 804–812 and 890–891. Derived: `{nights: 3, nights_source: derived_from_dates}`. Stored: `stored`. Stored 0 with same-day dates is accepted. A mismatch → `dates_nights_mismatch` (C3). | ✅ |
| AC-5 | POC audit: type, name and organisation before and after, plus `phone_changed`/`email_changed`; no values | Lines 895–907. Phone and email values found anywhere in `workspace_audit_log.event_data`: **0** (C3). A wider scan for `@` or `+91` in every Journey audit row also finds 0 (37 rows after my probes; 55 rows after Rad's suite). The email-only change sets `email_changed = true` and `phone_changed = false`, with no value stored. The service-written POC audit is outside M11; I did not re-test it. | ✅ (M11 part) |
| AC-6 | No informational notification to a deactivated recipient | Helper at lines 152–180. Verified for hold, resume, cancel and close (Administrator acting on a deactivated owner's Journey → none; on an active owner's Journey → exactly one to the owner; owner acting → none), for reassign (to self → none; to a deactivated user → `new_owner_invalid`) and for adoption (Rad F9). | ✅ |
| AC-7 | Rollback drops the nine functions and the helper(s) | The script drops all 12 with exact signatures. Verified in §6. | ✅ |
| AC-8 | TD-WS13-006 logged and routed | `TECH-DEBT.md` (Project copy) holds TD-WS13-006, status Open, on the RLS hardening card before Phase 3 (`021` §8). M11 does not widen it. | ✅ |
| AC-9 | Archie reviews the SQL and the local evidence before application | This document. | ✅ with SR-01, SR-02 |

**Conformance with plan §9.2 (function by function).**
- Guard order G1–G7 matches §9.1 (lines 72–104, then the stale check in each function).
- Every specific check, write and audit payload matches the §9.2 table. M11 adds `template_id` and `template_name` to `journey_template_assigned`, and `template_id` to `journey_legacy_adopted`. Both are harmless supersets.
- The transition pairs (lines 223–228) and the holdable and cancellable stages (lines 312, 432) match `JOURNEY_STAGE_TRANSITIONS`, `JOURNEY_HOLDABLE_STAGES` and `JOURNEY_CANCELLABLE_STAGES` in `types.ts`.
- Cancel clears the hold in the same `update` as the outcome (lines 466–473), as AD-WS13-001 and the M07 `on_hold_check` require.
- `closed_at` is set only by close (line 553).
- The §8.4 role matrix is enforced in the database: Administrator-only adoption (line 94); owner-or-Administrator elsewhere (line 101); deactivated callers refused (line 73).
- `workspace_journeys` still has no UPDATE grant: a direct `UPDATE` and `SELECT … FOR UPDATE` by `authenticated` → 42501 (C5).

**Concurrency.**
- `lock_for_change` takes `FOR UPDATE` on the Journey (line 77). The lock is held to the end of the caller's transaction.
- In each race, the second session waited on the lock, re-read the committed row and failed with the correct code:
  - hold vs transition → `on_hold`;
  - reassign vs reassign with the same expected owner → `stale`;
  - cancel vs hold → `terminal`.
- Adoption locks the Journey first, then the primary contact (line 853). The POC editor updates only the contact. Conversion v2 locks the planning record, then the original Journey; M11 reads planning records without locking them. I see no lock-order cycle.

---

## 4. Deviations D-1, D-2, D-3

| # | Deviation | Decision | Reasons |
|---|---|---|---|
| D-1 | Two extra internal helpers, `workspace_journey_lock_for_change` and `workspace_journey_notify` | **Accept** | <ul><li>One copy of the security-critical guard (G1–G6) and of the recipient rules is easier to review and keep correct than nine and six copies.</li><li>The lock taken inside the helper persists in the caller's transaction (verified, C6).</li><li>Same hygiene as AC-2: revoked from `public`, `anon` and `authenticated` (A3), and still not executable by `authenticated` under Supabase default privileges (§7).</li><li>Both are in the rollback.</li><li>No architecture decision changes. Small follow-ups: SR-07, SR-09.</li></ul> |
| D-2 | Every audit insert sets `created_at = clock_timestamp()` instead of the column default `now()` | **Accept** | <ul><li>The defect it fixes is real. Several events written in one transaction shared one timestamp, so History order was arbitrary.</li><li>The value is still server time and cannot be supplied by a caller. No column, default or constraint changes.</li><li>Across transactions on the same Journey, the row lock serialises writers, so times remain monotonic per Journey.</li><li>Side effect: `stage_changed_at`, `on_hold_since` and `closed_at` keep `now()`, so they precede the matching audit row by a few milliseconds (C7: 2.6 ms). Nothing may compare them for equality.</li><li>I ask Tiger to record this as an engineering convention: any RPC that writes more than one audit row for one entity uses `clock_timestamp()`, and History pages by `(created_at, id)`, as Rad's F-03 already does.</li></ul> |
| D-3 | Adoption: when the contact is newly inserted, `before` is `null` and the flags report whether each value is new | **Accept** | <ul><li>It stores no personal data (AC-5).</li><li>Precisely, a flag is `true` only for a field that was supplied. `email_changed` stays `false` when no email is given (C3). Rad's wording "true when the contact is newly inserted" is slightly broader than the behaviour.</li><li>Milestone B must render `before: null` as "Contact added", not as a phone or email change (SR-11).</li></ul> |

---

## 5. Findings

Severity:
- **Blocking**: M11 must not be applied until fixed.
- **Should-fix before Checkpoint 2**: must be done before M11 is applied to the shared database. Rad's report calls the application step "Checkpoint 2"; it is Checkpoints 3–4 in `021`.
- **Non-blocking**: recorded; no action needed before application.

| ID | Severity | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| SR-01 | Should-fix before Checkpoint 2 (runbook) | Rad's runbook does not say how to make the application atomic, how to keep migration-history parity, or how to refresh the API schema cache. M11 has no `begin`/`commit` of its own. I could not verify how the SQL editor handles transactions. | M11 has no transaction statements. Locally it applies cleanly inside an explicit `begin … commit` and holds **0** relation locks on `public` tables or views while doing so. It takes catalogue locks only, so applying it does not block live traffic. | <ul><li>Paste M11 between `begin;` and `commit;`, so that any error leaves nothing applied.</li><li>Record the version in the migration history the same way Phase 0 did, so parity reads 35 = 35.</li><li>Then run `notify pgrst, 'reload schema';`.</li><li>Do the same for the rollback (the script already has `begin`/`commit`), followed by the same `notify`.</li><li>Do not edit the migration file itself.</li></ul> |
| SR-02 | Should-fix before Checkpoint 2 (runbook) | The checks are incomplete. Rad's post-application check (§11 step 3) tests one helper only. Rad's "active Journeys" sizing query (§10) counts cancelled and superseded Journeys as active (`closed_at is null and archived_at is null`). | `023` §10 and §11. | <ul><li>Before application: confirm 34 recorded migrations, and that no `public.workspace_journey%` function exists (locally there are none before M11).</li><li>After application: run the §7 query and expect 12 rows: all `secdef = true`, `config = {search_path=public}`, owner `postgres`, `anon = false`; `authenticated = true` for the nine public functions and `false` for the three helpers.</li><li>Correct the sizing query to `outcome is null and stage <> 'journey_closed' and archived_at is null`, or use `is_active` from the view.</li></ul> |
| SR-03 | Non-blocking for M11 (Phase 2 dependency; decision in §8) | A Journey whose template is assigned while that template is empty never receives the template's items later. In Phase 1, every template is empty. | Derivation runs only when a template is newly assigned (lines 678–689) or at adoption (line 848). Probe: adopt with an empty template → add a mandatory item to the template → Start preparation → **0** items → gate passes. The header (lines 45–47) and PO Decision 4 ("Phase 2 content switches the check on with no code change") hold only for Journeys whose template is assigned **after** the content arrives. | <ul><li>No M11 change now.</li><li>The Phase 2 content migration must include a reviewed back-fill decision for in-flight Journeys: adopted or Confirmed Journeys with a template, and Journeys already In Preparation or later.</li><li>Alternatively, Phase 2's Start preparation derives whenever the Journey has no template-sourced items.</li><li>Arjun and the Product Owner decide whether Journeys already In Preparation should be gated retroactively.</li></ul> |
| SR-04 | Non-blocking | The SQL whitespace check is weaker than the service check. `trim()` removes spaces only. A reason made only of a newline, a tab or a non-breaking space is accepted by the RPC and stored. JavaScript `.trim()` in the service rejects it, so the application path is safe. The same applies to the note, the contact name and the organisation. Length is also measured differently (characters in SQL, UTF-16 units in TypeScript). | Lines 211, 300, 420, 589, 780–783. Probes C1 (`E'\n\t'` stored as the hold reason) and C1b (NBSP cancel reason accepted). Reachable only by an authorised owner or Administrator calling the RPC directly with their own session. The M07/M08 CHECKs use the same `trim()`, so the stored rows are valid. | <ul><li>When these functions are next changed, normalise with a whitespace class (for example `regexp_replace(x, '^[[:space:] ]+\|[[:space:] ]+$', '', 'g')`) in one shared expression.</li><li>Not worth a separate migration.</li></ul> |
| SR-05 | Non-blocking | AR-F2 confirmed: the gate's view read aggregates every Journey's bookings and documents. It runs while the Journey row lock is held. | Plan shows the CTE scans with `Rows Removed by Filter: 1999`. Median 10.6 ms and max 15.3 ms at 2,000 Journeys locally; Rad measured 13.3 ms per transition. | <ul><li>Acceptable at internal scale.</li><li>Await B-8 on the shared database.</li><li>The remedy, if needed, is the reviewed view revision named in AR-F2 (`not materialized` or lateral per-Journey aggregates), not a second readiness expression.</li></ul> |
| SR-06 | Non-blocking | If the adoption template is later deactivated, Start preparation is impossible in Phase 1. With the same id the call fails `template_invalid`, because the active check (lines 665–670) runs before the keep-existing branch (lines 673–678). With another id it fails `template_already_assigned`. | Probe C4. No Phase 1 screen deactivates templates; it needs a data change. | <ul><li>Phase 2 (change-template design): decide whether keeping an already-assigned template should require it to be active.</li><li>No Phase 1 action.</li></ul> |
| SR-07 | Non-blocking | `lock_for_change` treats any `p_mode` other than `'adopt'` as `'change'`. | Lines 90 and 97. The helper is internal, and every caller passes a literal. | When next changed, raise on an unknown mode. |
| SR-08 | Non-blocking | The lockstep note covers the stage tables only. The four POC contact types are hard-coded at line 830. They also exist in the M08 CHECK and in the TypeScript `OPERATIONAL_CONTACT_TYPES`. | Lines 34–37 and 829–835. | When next changed, add the contact types to the lockstep note. |
| SR-09 | Non-blocking (convention) | Under Supabase default privileges, `service_role` keeps EXECUTE on the helpers. Two helpers (`derive`, `notify`) do not check `auth.uid()`. | Modelled with `alter default privileges … grant all on functions to anon, authenticated, service_role`. Result: helpers `anon = f`, `authenticated = f`, `service_role = t`. | <ul><li>Not an escalation: `service_role` already bypasses RLS and has every table privilege, and Phase 1 never uses it.</li><li>Convention: `create or replace` keeps ACLs, but any future `drop` and re-`create` of these functions must repeat the revokes.</li><li>A non-exposed `private` schema for internal helpers is a possible hardening-card item, not a Phase 1 change.</li></ul> |
| SR-10 | Non-blocking (information) | The guard order and lock timing are visible to a non-owner. G3–G5 run before G6, so a non-owner receives `archived`, `terminal` or `legacy_pending` instead of `not_authorised`. The row is locked before authorisation, so a refused call can wait behind a lock holder. | Probes C9 and C6. This is the plan §9.1 order. | <ul><li>No action. Journey reads are collaborative (BR-035; `workspace_journeys` SELECT is `using (true)`), so nothing is disclosed.</li><li>The wait is the length of one RPC.</li></ul> |
| SR-11 | Non-blocking (Milestone B) | D-3 History rendering. | §4. | Sophie and Rad: label `journey_contact_changed` with `before: null` as "Contact added". |

**Pre-existing items, referenced and not re-raised:**
- TD-WS13-006 (deactivation in RLS read policies; Rad F-04 confirms it at API level);
- OBS-P1-04 (audit and task SELECT `using (true)`);
- TD-WS12-004 and TD-WS12-005 (permissive Journey Planning UPDATE and notification INSERT; M11 inserts notifications as definer and does not rely on that policy);
- TD-WS13-002 (fresh-replay constraint name; the harness uses the patched copy);
- AR-F6 (cancellation-task assignee; Arjun to confirm before Phase 2).

---

## 6. Rollback verification (AC-7)

| Step | Result |
|---|---|
| Functions named `public.workspace_journey%` with M11 applied | 12 |
| After `M11_rollback_forward_fix.sql` | **0**. There are no pre-M11 functions with this prefix. |
| Pre-M11 baseline (34 migrations, M11 skipped) compared with "M11 then rollback": all `public` functions | **Identical, 51 functions** (`diff` empty) |
| Rollback run a second time | Succeeds; `drop … if exists` only gives notices |
| M11 re-applied after rollback (inside `begin … commit`, then twice more) | Succeeds; privileges unchanged; Rad's suite 198 / 198 |
| Data | No table, constraint or view depends on the functions. Rows written by M11 satisfy the M07/M08 constraints and remain valid after rollback. |

The signatures in the rollback match M11 exactly: `(uuid,text,text,text)`, `(uuid,text,text)`, `(uuid,text)`, `(uuid,text,text,uuid[])`, `(uuid,text)`, `(uuid,uuid,uuid,text)`, `(uuid,text,uuid)`, `(uuid,text)`, the 11-argument adoption, `(uuid,text)`, `(uuid,uuid,uuid)`, `(uuid,text,uuid,text)`. The rollback is complete.

After a rollback on the shared database, reload the schema cache (SR-01) and redeploy the previous Preview build, as Rad states.

---

## 7. Deployment notes for Checkpoint 2

"Checkpoint 2" here is Rad's numbering. In `021` §11 these are Checkpoint 3 (runbook) and Checkpoint 4 (migration authorisation).

1. **Safety on a live database.**
   - M11 creates functions, comments and grants only. Locally it held no relation locks on `public` tables or views.
   - `create or replace` is idempotent: re-applying gives the same ACLs.
   - PL/pgSQL bodies are checked for syntax at creation, not for object existence, so the schema must match M01–M10. Parity (34 recorded migrations before, 35 after) is the control.
   - No existing function, grant or policy changes.
   - Applying it needs no freeze: no deployed code calls these functions.
2. **Transaction and cache (SR-01):** `begin;` + M11 + `commit;`; record the migration-history row (Phase 0 precedent); `notify pgrst, 'reload schema';`.
3. **Supabase default privileges.** On the hosted project, new functions in `public` are granted to `anon`, `authenticated` and `service_role` by default. M11's explicit revokes handle this. I modelled it locally:

   | Function group | `anon` | `authenticated` | `service_role` | `PUBLIC` |
   |---|---|---|---|---|
   | 9 public functions | f | t | t | f |
   | 3 internal helpers | f | f | t | f |

4. **Post-application verification (SR-02).** Read-only. Expect 12 rows as described:

   ```sql
   select p.oid::regprocedure as fn, p.prosecdef as secdef, p.proconfig as config,
          pg_get_userbyid(p.proowner) as owner,
          has_function_privilege('anon', p.oid, 'execute') as anon,
          has_function_privilege('authenticated', p.oid, 'execute') as authenticated
   from pg_proc p
   where p.pronamespace = 'public'::regnamespace and p.proname like 'workspace_journey%'
   order by 1;
   ```

5. **Order.** Apply M11, verify, and only then push the branch, as Rad states. If the order is reversed, the new routes return 500 until M11 exists. Phase 0 behaviour is unaffected either way.
6. **Owner assumption.** The gate reads a `security_invoker` view inside a definer function. This works because the function owner owns the base tables. I proved it with a non-superuser, NOBYPASSRLS owner (198 / 198). On the hosted project, apply M11 as `postgres`, the owner of the Phase 0 tables. Do not apply it as another role.
7. **Shared-database data.** Applying M11 writes no data. The first real calls must use `QA-WS13-P1-*` records only (PO Decision 7; `021` C-4).

---

## 8. Items for Tiger / Product Owner decision

| # | Item | For | Recommendation |
|---|---|---|---|
| 1 | Accept this review: Approved with conditions SR-01 and SR-02 (runbook only) | Product Owner (via Tiger) | Accept. Fold SR-01 and SR-02 into the Deployment Runbook (Governance Backlog §2.10) before Checkpoint 4. |
| 2 | SR-03: readiness items for Journeys whose template was assigned while it was empty | Tiger → Arjun, Product Owner, before the Phase 2 content migration | Record it as a Phase 2 dependency. The Phase 2 content card must include a reviewed back-fill decision (which Journeys, which stages, whether In Preparation Journeys become gated). Phase 1 is unaffected. PO Decision 4 stands, with that precision added. |
| 3 | D-2 as a standing convention | Tiger (Engineering Governance Principles, `GOV-005`) | Record: multi-event RPCs use `clock_timestamp()` for audit rows; History pages by `(created_at, id)`. |
| 4 | Checkpoint numbering | Tiger | `023` calls the application runbook "Checkpoint 2". `021` §11 defines Checkpoint 2 as this SQL review, 3 as runbook approval and 4 as migration authorisation. Align the wording in the runbook and the tracker. |
| 5 | SR-04, SR-06 to SR-09 | Tiger (backlog) | Bundle them with the next change to these functions (Phase 2), or with the RLS hardening card for SR-09. No separate migration. |
| 6 | AR-F6 (cancellation-task assignee fallback) | Arjun, before Phase 2 | Still open, as planned. M11 implements the engineering default. |

> M11 as submitted in `EBC-R1.3-WS13-023` conforms to AD-WS13-001 to AD-WS13-007 and to conditions AC-1 to AC-9. It adds no schema change, dependency or environment variable. **Approved with conditions SR-01 and SR-02**, both deployment-runbook items. The SQL needs no change before application.
>
> — Archie, Technical Architect, 5 October 2026
