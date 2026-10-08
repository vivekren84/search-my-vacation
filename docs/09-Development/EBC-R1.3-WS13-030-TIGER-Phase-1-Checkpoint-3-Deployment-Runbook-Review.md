# EBC-R1.3-WS13-030 — Phase 1 Checkpoint 3: Deployment Runbook Review

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Persona | Tiger — Delivery Manager |
| Checkpoint | **3 — Deployment Runbook Approval** (`EBC-R1.3-WS13-021` §11; `DEC-R1.3-026` C-1; plan `020` gate G-1). Owners: Tiger and Rad → Vivek; Archie reviews SR-01/SR-02 (`DEC-R1.3-028`, 7-Oct direction). |
| Subject | `docs/50-Operations/RELEASE-1.3-DEPLOYMENT-RUNBOOK.md` **v0.4 (Checkpoint 3 candidate)** |
| Direction | Product Owner, 8-Oct-2026 (21:50 IST): "Milestone B preservation is verified and committed as `7291f46`. Proceed with the Checkpoint 3 governance package and formal Checkpoint 3 review. Do not push, deploy, apply M11, or start WP-1.9 until Checkpoint 3 is formally passed." |
| Date | 8 October 2026. **Revision 1** (8 October 2026, after 21:57 IST): Product Owner decisions D-1 to D-3, specialist reviews and Checkpoint 3 outcome recorded (§8). Sections 1–7 unchanged as the review the specialists worked from. |
| Status | **Checkpoint 3 PASSED, 8 October 2026** (`DEC-R1.3-032`). Runbook **v1.0 approved**. Rad signed (`030A`); Archie confirmed (`030B`); Product Owner D-1 and D-2 approved, D-3 conditional approval met (§8). Checkpoint 4 has not started. |

Tiger does not approve on Rad's, Archie's or the Product Owner's behalf. Tiger collected evidence for the open technical questions. **Answering them remains Rad's job.**

---

## 1. Summary

| Question | Answer |
|---|---|
| Is the precondition (Milestone B preserved) met? | **Yes.** Verified independently (§2). RISK-R1.3-007 can close. |
| Does the runbook cover every required element (SR-01, SR-02, GF-3, `DEC-R1.3-029`, B-D1 to B-D3)? | **Yes, in v0.4** (§3) |
| Are the four open technical questions answered? | **Evidence-backed proposed answers are in v0.4** (§4). Each still needs Rad's confirmation. |
| Has Archie reviewed? | **No.** Item 3-9 is open. |
| Can Checkpoint 3 pass today? | **Not by Tiger alone.** Once Rad and Archie sign off and the Product Owner decides the two items in §6, it can pass in one step. |

Nothing has been pushed, deployed or migrated, and WP-1.9 has not started.

---

## 2. Precondition — Milestone B Preservation (verified 8-Oct-2026, read-only)

| Check | Result |
|---|---|
| Branch / HEAD | `ws13-milestone-b` at **`7291f46`** ("feat(ws13): Phase 1 Milestone B Journey Workspace screens and EBC-R1.3-WS13-026"), parent `1f73a4b`. `feature/r1.3-ws13-journey-workspace` still at `1f73a4b`; `origin` at `6c78ac7` |
| Content | 31 files: the 8 modified and 22 new files listed in `026` §14, plus the `026` report. 4,968 insertions = 4,464 (new files) + 349 (report) + 155 (modified-file additions in `026` §14). This matches `026` exactly. |
| M11 | SHA-256 `1b0a9b12afe7c106…`, unchanged since Archie's review (`023A`) |
| Migrations | 35 files (34 applied + M11) |
| Working tree | Clean, except one untracked file: the recovered original `EBC-R1.3-WS13-025` (below) |
| Push / deploy | None |
| **`EBC-R1.3-WS13-025` original** | **Recovered by Rad** and filed verbatim at `docs/09-Development/EBC-R1.3-WS13-025-TIGER-Phase-1-Milestone-B-Engineering-Implementation-Authorisation.md` (untracked) and in Project Knowledge. Recovery action R-1 is complete, and Tiger's filing record is updated to "Original filed". *Note:* the verbatim copy ends with web-page drag-and-drop helper text picked up when it was copied. It is kept as is, per the instruction not to alter the original. |

---

## 3. Runbook Coverage Review

| Requirement | Source | Where in v0.4 | Tiger |
|---|---|---|---|
| SR-01: apply atomically | Archie `023A` §7.1 | B-D4 (CLI single transaction, evidence §4.1); stop rules A.4 | ✅ pending Rad confirmation and Archie |
| SR-01: history parity 35 = 35 | `023A` | Step 10 | ✅ |
| SR-01: PostgREST schema reload, also on rollback | `023A` | Step 8; B.3 | ✅ |
| SR-02: pre-checks and post-checks on all 12 functions, using the corrected sizing query | `023A` §7.4; `023` §10 | Steps 5 and 9 | ✅ pending Archie |
| Migration method: CLI standard, SQL Editor as fallback | `DEC-R1.3-029` | A.3, A.6, B.3 | ✅ |
| Order: read-only checks → apply → verify → push | `DEC-R1.3-028` GF-3 | Steps 5–11; push only if 7–10 pass | ✅ |
| Preview READY, then smoke test of the new routes | GF-3 | Step 12, S-1 to S-7, read-only | ✅ |
| Rollback | `023` §4.4 | A.6, B.3 (Preview redeploy first, because the pushed branch includes screens) | ✅ |
| Backup, verification, retention, kept outside the repository | B-D3; RISK-R1.3-004 | A.5 | ✅ |
| No freeze, no announcement | B-D1, B-D2 | B.1 | ✅ approved |
| Deployment record | Governance Backlog §2.10 | A.7 | ✅ |
| Credentials handled by the operator only | `DEC-R1.3-022` (1) | A.1, A.2 (v0.4) | ✅ |

### Findings from this review (corrected in v0.4)

| # | Finding | Correction |
|---|---|---|
| CP3-F1 | Step 4 switched to the release branch and expected the Milestone B commit there, but B-D6 placed the fast-forward "before step 11". Step 4 would have failed. | The fast-forward moves into step 4 (local only), before the checks |
| CP3-F2 | S-5 and S-7 assumed a `QA-WS13-P1-*` Journey, which does not yet exist | Use the Phase 0 QA Journeys JRN-1005 / JRN-1006 (`DEC-R1.3-022` (5)), found by a read-only query. The not-found variant is kept as a fallback. |
| CP3-F3 | The CLI version on the operator's machine was not recorded, although the atomicity evidence depends on it | Step 4 records `npx supabase --version`; stop if it is not v2.x |
| CP3-F4 | Two CLI link records exist (`supabase/.temp/` and `supabase/supabase/.temp/`); both point to the same project | A.2: run every command from the repository root |
| CP3-F5 | The repository holds runbook **v0.2** (committed in `1f73a4b`); v0.3 and v0.4 exist only in Project Knowledge. The operator must run the approved version. | The approved runbook (v1.0) is committed locally before Checkpoint 4, together with the pending governance records: `025` original, `025` filing record, `027` Rev 1, `028`, `030` and the registers. **This needs the Product Owner's authorisation** (§6, D-2). |

---

## 4. Evidence for the Open Technical Questions (for Rad to confirm)

### 4.1 B-D4 — Is the M11 file plus its history row one transaction?

- **Source:** Supabase CLI **v2.120.0**, the version recorded in the Mac's link metadata (`supabase/.temp/cli-latest`). File `apps/cli-go/pkg/migration/file.go`, function `MigrationFile.ExecBatch`, and `pkg/migration/apply.go` `ApplyMigrations`.
- **Behaviour:**
  - each statement goes into one `pgconn.Batch`;
  - `INSERT INTO supabase_migrations.schema_migrations(version, name, statements) …` is added to the same batch;
  - the batch is sent with a single Sync, which PostgreSQL runs as one implicit transaction;
  - a file splits into separate round trips only if it contains a pipeline-incompatible statement (`CREATE INDEX`, `DROP INDEX`, `REINDEX`, `VACUUM`, `ALTER SYSTEM`, `CLUSTER`).
- **M11:** 0 such statements and 0 `begin`/`commit`. It contains only `create or replace function`, `comment on`, `revoke` and `grant` (45 statement lines).
- **Proposed answer: yes, it is atomic.**

### 4.2 B-D5 — Applying role

The link record `supabase/.temp/pooler-url` connects as `postgres.<project-ref>` on `aws-1-ap-northeast-2.pooler.supabase.com`. That is the pooler form of the **`postgres`** role. Postgres version is 17.6.1.155. No password is stored in the file; only the user and host were read. Step 9 independently confirms `owner = postgres` on all 12 functions. **Proposed answer: `postgres`.**

### 4.3 Step 5 expectation

Across all 35 migration files, only M11 creates functions named `workspace_journey…` (the 12 M11 functions). **Proposed answer: 0 rows before M11; any row means stop.**

### 4.4 S-5 / S-7

Use the Phase 0 QA Journeys JRN-1005 / JRN-1006. Their ids come from the read-only lookup in runbook step 12. The smoke test stays view-only.

---

## 5. Checkpoint 3 Checklist (updated)

| # | Item | Owner | Status |
|---|---|---|---|
| 3-1 | Runbook v0.4 (Checkpoint 3 candidate) | Tiger | ✅ |
| 3-2 | B-D1 to B-D3 | Vivek | ✅ Approved 7-Oct |
| 3-3 | B-D4 atomicity | Rad | ⏳ Evidence ready (§4.1); confirm |
| 3-4 | B-D5 applying role and execution details | Rad | ⏳ Evidence ready (§4.2); confirm |
| 3-5 | Step 5 expectation | Rad | ⏳ Evidence ready (§4.3); confirm |
| 3-6 | S-5 / S-7 | Rad | ⏳ Proposal ready (§4.4); confirm |
| 3-7 | Milestone B deltas and CP3-F1 to F4 | Rad | ⏳ Review |
| 3-8 | M11 unchanged on the Mac | Tiger (verified), Rad | ✅ `1b0a9b12afe7c106` |
| 3-9 | SR-01 / SR-02 fully addressed | **Archie** | ⏳ Open |
| 3-10 | Operator prerequisites | Vivek | ✅ project linked (link record present); Docker and CLI confirmed 7-Oct; backup folder `~/SMV-backups` exists |
| 3-11 | Approvals: Rad, Archie, Vivek | All | ⏳ |
| 3-12 | B-D6 branch fast-forward | Vivek | ⏳ Decision |
| 3-13 | *(new)* Approved runbook and pending governance records committed locally before Checkpoint 4 (CP3-F5) | Vivek authorises; Tiger executes | ⏳ Decision |

---

## 6. Determination and Decisions Required

**Determination (Tiger):** the runbook is complete against every requirement in §3, and the Checkpoint 3 precondition is met. **Checkpoint 3 is not yet passed.** Items 3-3 to 3-7 (Rad) and 3-9 (Archie) are outstanding, as are the Product Owner's decisions below.

| # | Decision | Tiger recommendation |
|---|---|---|
| D-1 | B-D6: fast-forward `feature/r1.3-ws13-journey-workspace` to `ws13-milestone-b` at runbook step 4 (local; push only at step 11) | Approve |
| D-2 | Authorise one local governance commit, no push, before Checkpoint 4. It contains: the approved runbook v1.0; the `025` original and the `025` filing record; `027` Rev 1; `028`; `030`; and the tracker, Feature Register, Technical Debt Register and Governance Backlog updates since v1.30. It goes on `ws13-milestone-b`, so the step 4 fast-forward carries it. | Approve |
| D-3 | After Rad's and Archie's sign-off: approve the runbook as v1.0 and record Checkpoint 3 PASSED (`DEC-R1.3-032`) | — |

**Unchanged until Checkpoint 3 passes:** no push, no deployment, no M11, no WP-1.9.

---

## 7. Requests to Specialists

**To Rad (in the engineering session):** Read runbook v0.4 (Project Knowledge) and this review.
- Confirm or correct B-D4 (§4.1), B-D5 (§4.2), the step 5 expectation (§4.3) and S-5/S-7 (§4.4).
- Review the Milestone B deltas and CP3-F1 to CP3-F4.
- Sign the runbook's Engineering line.

No code change. No shared-database access. No WP-1.9.

**To Archie:** Review runbook v0.4 against `023A` SR-01 and SR-02, in particular B-D4 (CLI implicit transaction), step 8 (schema reload), step 9 (12-row post-check) and B.3 (rollback). Confirm that the conditions are fully addressed, or list what is missing. Sign the Architecture line.

---

---

## 8. Outcome — Revision 1 (8 October 2026)

### 8.1 Product Owner decisions (21:57 IST)

| # | Decision | Outcome |
|---|---|---|
| D-1 | B-D6 branch | **Approved.** At runbook step 4, move `feature/r1.3-ws13-journey-workspace` forward to `ws13-milestone-b` by local fast-forward only. No merge commit; no push at that stage. |
| D-2 | Governance commit | **Approved.** A separate local commit containing the approved runbook, the recovered `025` and its filing record, `027` Rev 1, `028`, `030` (with `030A`/`030B`) and the applicable register updates. Committed before Checkpoint 4/M11; unpushed until the authorised push/deployment gate. |
| D-3 | Approval | **Conditionally approved.** Once Rad signs and Archie confirms the architecture conditions are fully addressed, approve runbook v1.0 and record Checkpoint 3 PASSED as `DEC-R1.3-032`. Until then, Checkpoint 3 stays open. |

### 8.2 Specialist reviews

The reviews were run as requested, each by an independent reviewer working only from the record. Each was given the runbook, this review, `023`, `023A`, `026`, M11, all 35 migrations and the Supabase CLI v2.120.0 migration source. Neither had any database, network or credential access.

| Round | Rad (engineering) — `030A` | Archie (architecture) — `030B` |
|---|---|---|
| v0.4 | **Signed with conditions** C-1 to C-5: exact CLI version; password-prompt wording and connection record; step 11 push checks; corrective migration without `begin`/`commit`; smoke-test expectations. Notes RAD-CP3-06 to -11. Tiger's list of batch-splitting statements corrected (only the `CONCURRENTLY` forms, `VACUUM`, `ALTER SYSTEM`, `CLUSTER`). | **Confirmed with conditions** C-1 to C-4: exact CLI version; failed-push states in A.4; SQL Editor rollback keeps history parity in the same transaction and redeploys the Preview first on both routes; corrective migration without `begin`/`commit`. Notes ARCH-CP3-05 to -13. |
| v0.5 (conditions incorporated) | **SIGNED — conditions addressed.** Accepts Archie's Fallback and withdraws her own repair-based variant. Notes N-1 to N-6, within the scope of her signature. | **CONFIRMED — SR-01 and SR-02 fully addressed.** Rad's Standard route and ownership pre-check strengthen SR-01/SR-02. Notes ARCH-CP3-14 to -18 can go into v1.0 without further review. |

**Reconciled difference:** the B.3 Fallback. Rad accepted Archie's single-execution form, so there is no open disagreement.

**v1.0:** v0.5 plus Rad's N-1 to N-6 and Archie's ARCH-CP3-14 to -18. These include:
- the literal Fallback script, checked by Tiger against the 12 M11 signatures;
- the version check on the rollback route;
- no push while M11 is absent;
- the restart rule in A.4;
- editorial fixes.

Both specialists stated that changes limited to these items stay within their sign-off.

### 8.3 Determination

**Checkpoint 3 (Deployment Runbook Approval): PASSED, 8 October 2026** — `DEC-R1.3-032`. Basis:
- Rad's signature and Archie's confirmation;
- the Product Owner's conditional approval D-3, whose conditions are now met;
- runbook v1.0.

This satisfies `DEC-R1.3-026` C-1 and plan gate G-1. Checkpoint 3 approves the runbook only. **It does not authorise applying M11, a push or a deployment;** those belong to Checkpoint 4.

### 8.4 Still open before or at Checkpoint 4

| # | Item | Owner |
|---|---|---|
| 4-1 | **D-2 governance commit** on `ws13-milestone-b` (no push). Pending because the Mac link dropped while v1.0 was being finalised. | Tiger, when the Mac is linked again |
| 4-2 | Confirm who can reach the branch Preview after the push. After step 11 its lifecycle actions write to the shared database (Rad RAD-CP3-07; B-D1 note). | Vivek |
| 4-3 | Confirm that no Supabase GitHub integration is enabled in the Supabase dashboard (A.2; Archie ARCH-CP3-12). The repository has no automation. | Vivek |
| 4-4 | Checkpoint 4: Product Owner migration authorisation; then the runbook is executed (operator Vivek; Tiger coordinates; Rad advises) | Vivek |
| 4-5 | WP-1.9 (`EBC-R1.3-WS13-028`). Under the sequence in `DEC-R1.3-031` (6), it may now start: Checkpoint 3 has passed and its preservation prerequisite P-1 is met. | Rad, on the Product Owner's go-ahead |

---

*Prepared by Tiger, Delivery Manager, on behalf of Team Satvi, 8 October 2026. Revision 1 records the Product Owner's decisions and the specialist outcomes; not self-approved.*
