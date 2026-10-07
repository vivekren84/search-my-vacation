# EBC-R1.3-WS13-024 — Phase 1 Milestone A: Checkpoint 1 Review & Authorisation

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | Engineering Governance checkpoint (Checkpoint 1, `EBC-R1.3-WS13-021` §11). Not a code review; not QA. |
| Prepared by | Tiger — Delivery Manager |
| Decision authority | Vivek — Product Owner |
| Authority | `DEC-R1.3-025`, `DEC-R1.3-026`; `EBC-R1.3-WS13-021` §10–§11 |
| Reviewed | `EBC-R1.3-WS13-023` Rev 1 (Rad, Milestone A completion); `EBC-R1.3-WS13-023A` (Archie, M11 SQL review = Checkpoint 2); against `WS13-019`, `WS13-020` Rev 2, `WS13-020A`, `WS13-020B`, `WS13-021` |
| Date | 7 October 2026 (Revision 3) |
| **Outcome** | **Checkpoint 1 PASSED** (Product Owner, 7-Oct-2026, `DEC-R1.3-028`). **Milestone B authorised.** Checkpoint 2: Approved with conditions SR-01 and SR-02 (runbook items). |

### Revision History

| Rev | Date | Change |
|---|---|---|
| 1 | 5-Oct-2026 | Draft Checkpoint 1 review, filed as `EBC-R1.3-WS13-024-TIGER-Milestone-A-Checkpoint-1-Review.md`. Its recommended Product Owner decisions were not recorded. |
| 2 | 7-Oct-2026 | Re-issued against the card's 11-item checklist. All evidence was re-verified on 7-Oct-2026. Rev 1's findings are carried forward where they still hold. Rev 2 adds the item-by-item verdicts, a stricter reading of the repository and performance items, and the conditions CP1-1 to CP1-5. The Rev 1 file is superseded. |
| 3 | 7-Oct-2026 | Product Owner decision recorded (§15). Checkpoint 1 recorded as **PASSED**. CP1-1, CP1-2, CP1-3 and CP1-5 reclassified as governance follow-up actions GF-1 to GF-4. CP1-4 (performance targets) reclassified as open Product Owner decision `OD-R1.3-8`, due before Milestone B completion. §7, §10 and §11 to §15 updated. Evidence in §0 to §10 is unchanged. |

Tiger does not approve architecture, engineering completion, functional behaviour or release on anyone's behalf. Persona outcomes are quoted with their source.

---

## 0. Review Method and Evidence

| Evidence | Source | Independently re-checked by Tiger on 7-Oct-2026 |
|---|---|---|
| Branch, HEAD, origin parity, working tree | Device repository | ✅ `git` read-only (lock-free) |
| M11 content: functions only, no DDL | `supabase/migrations/20261004100000_workspace_journey_lifecycle_rpcs.sql` | ✅ Statement scan: only `create or replace function`, `comment on function`, `revoke` and `grant`; no table, index, view, policy, trigger or data statement |
| M11 is the file Archie reviewed | SHA-256 prefix `1b0a9b12afe7c106` (Rev 1 check) | ✅ Same prefix today |
| Route inventory and HTTP methods | `web/app/api/workspace/…` | ✅ 16 new routes plus `reference-data` (additive); see §1 |
| Modified Phase 0 files | `git diff --numstat` | ✅ 1,689 lines added, 7 removed. The removed lines are imports and one replaced return statement. |
| Type-check | `tsc --noEmit -p tsconfig.json` | ✅ exit 0 |
| Lint | `eslint .` | ✅ 0 errors; 4 pre-existing warnings in untouched files |
| Verify scripts (7) | `npm run verify:journey-workspace-*` | ✅ transitions 118, derivations 24, dates 22, config 17, actions 92, errors 203 (33 SQL codes), list 44 |
| Local database suite (198), service/API suite (112), volume, rollback | `023` §5; `023A` §6 (Archie re-ran it three times and added 64 probes) | Not re-run (harness is a working artifact); independently corroborated by Archie |
| Production build | `023` §5.3: `next build` passed on a local clean clone (Google Fonts mocked, placeholder public settings) | **Not re-run.** The device's `node_modules` are macOS builds. See CP1-3. |
| Preview build at HEAD | GitHub commit status for `6c78ac7` | ✅ Vercel "Deployment has completed" — success, 4-Oct-2026 08:33 UTC |
| Shared database untouched (schema) | `023` governance confirmations; `023A`; no Supabase CLI on the device (F-08); migration file untracked | Corroborated, not directly verifiable by Tiger (no database access) |

---

## 1. Scope Compliance — ✅ Met

| Authorised item (`021` §10) | Delivered | Evidence |
|---|---|---|
| Performance baseline | ✅ | `023` §8.1 — Preview, 4-Oct-2026, measured from India. Conversion not measured, by PO decision. |
| Local engineering environment | ✅ with a disclosed substitute | No Docker or Supabase CLI on the device (F-08). PostgreSQL 17.6 plus a Supabase shim plus PostgREST 12.2.3 with per-user JWTs, as in the Phase 0 precedent. The shim is stricter than Supabase, never looser (`023` §3). |
| Local PostgreSQL validated | ✅ | All 34 repository migrations replay, then M11 (TD-WS13-002 workaround kept; repository file unchanged) |
| M11 | ✅ | 9 public functions and 3 internal helpers; not applied anywhere but local databases |
| Service layer | ✅ | `023` §6 |
| API layer | ✅ | `023` §7; 16 routes listed below |
| Local verification | ✅ | SQL 198/198; service/API 112/112; volume; rollback |
| Completion report | ✅ | `023` Rev 1 (5-Oct-2026) |

**Route inventory (verified):** `journey-workspace` (GET), `summary-counts` (GET), `[journeyId]` (GET), `history` (GET), `itinerary` (GET), `transition`, `start-preparation`, `hold`, `resume`, `cancel`, `close`, `reassign`, `adopt` (POST), `service-category`, `contact` (PATCH), `users/directory` (GET). No create route (FR-JW-05). No DELETE anywhere (BR-033).

**No additional engineering scope.**
- No UI, page or component file changed. Screens are Milestone B.
- The only design difference is **D-1**, two extra *internal* helpers (`lock_for_change`, `notify`). It is a design variance inside the approved function set, accepted by Archie (`023A` §4), not new scope.

## 2. Architecture Compliance — ✅ Met (Checkpoint 2: Approved with conditions)

| Check | Result | Evidence |
|---|---|---|
| No schema changes | ✅ | Tiger's statement scan of M11; Archie §4 |
| Internal helpers follow the approved design | ✅ | AC-2 derive helper; D-1 helpers carry the same hygiene: execute revoked from `public`, `anon` and `authenticated` (Archie A3) |
| Rollback exists | ✅ | `023` §4.4; Archie §6 verified it: 12 → 0 functions, public function set identical to pre-M11 (51), re-apply 198/198 |
| Migration isolated | ✅ | Single file, untracked, unapplied; content unchanged since Archie's review |
| Security observations recorded | ✅ | TD-WS13-006 (`TECH-DEBT.md` v1.5), confirmed at API level by Rad (F-04); OBS-P1-04; SR-09 to the hardening card |
| AC-1 to AC-9 | ✅ | `023` §4.3; Archie `023A` |

**Checkpoint 2 (Archie, `023A`): Approved with conditions.** No SQL change is required.
- **SR-01** — Atomic application; migration-history parity 35 = 35; PostgREST schema reload. The same applies to rollback.
- **SR-02** — Pre- and post-checks on all 12 functions; corrected "active Journeys" query (already corrected in `023` §10).

Both are deployment-runbook items for Checkpoint 3. D-1, D-2 and D-3 are accepted. SR-03 to SR-11 are non-blocking (§13).

**No architectural deviation.**

## 3. Product Compliance — ✅ Met

| Exclusion | Result | Note |
|---|---|---|
| No Phase 2 functionality | ✅ | No bookings, readiness-item, document, task or activity routes under `journey-workspace` (the `journey-planning` task and activity routes are pre-existing WS12). The `cancel` RPC accepts cancellation-task inputs and `replacement_open` guards exist as **supporting code only**, tested locally (PO Decision 6). |
| No Phase 3 functionality | ✅ | No archive, alert, cron, notification-centre or search routes |
| No User Administration | ✅ | `users/directory` is a read-only GET of the AD-WS13-007 directory (active users for pickers; no email), approved in `WS13-004` §8.2. No create, update or deactivate path. |
| No Template Management | ✅ | `start-preparation` and adoption **assign** an existing configured template. Nothing creates or edits templates. |
| No Replacement Journey | ✅ | No material-change route or RPC |

## 4. UX Compliance — ✅ Met (no UI in Milestone A)

- Milestone A has no screens, so there is no UX deviation.
- User-facing copy sits in one module (`lib/workspace/journey-workspace/messages.ts`), shared by API and UI, using Sophie's S-5 copy. `verify:journey-workspace-errors` checks each SQL code → TS code → status → copy (203 checks).
- Sophie's `020B` confirmations (C-01 to C-14, readiness display) apply to Milestone B and remain in the frozen baseline.
- **SR-11** (Archie): History label "Contact added" for adoption-inserted contacts. Carried to Milestone B (CP1-5).

## 5. Engineering Quality — ✅ Met, one limitation

| Check | Result | Who |
|---|---|---|
| Local database tests | 198/198 pass, plus Archie's 64 probes | Rad; Archie ×3 |
| Service/API integration tests | 112/112 pass (real PostgREST, per-user JWT) | Rad |
| Verification scripts | 7 scripts, 520 checks pass | Rad; **Tiger re-run 7-Oct** |
| Type check | Pass | Rad; **Tiger re-run 7-Oct** |
| Lint | 0 errors (4 pre-existing warnings) | Rad; **Tiger re-run 7-Oct** |
| Build | Pass on a local clean clone **with Google Fonts mocked and placeholder public settings**; not run on the device; no Vercel build of Milestone A code yet | Rad only — **limitation; closed in the runbook (GF-3)** |
| Local database validation | Success, validation, permission, ownership, Administrator, error and audit paths; rollback | Rad; Archie |

Engineering defects found and fixed during Milestone A:
- **F-01**: identical audit timestamps (fixed with D-2).
- **F-02**: PostgREST row and URL limits at volume (fixed with paged reads).
- **F-03**: History cursor ties (fixed with a keyset).

## 6. Performance Review — ✅ Baseline established; one open decision

| Check | Result |
|---|---|
| Baseline established | ✅ `023` §8.1. Examples: Journey Planning detail page median 5.1 s; queue page 4.0 s; claim 3.06 s; warm `reference-data` 1.35 s; per sequential function → database call about 0.25–0.4 s (`iad1` ↔ Seoul). Accepted by the PO as the Phase 1 engineering baseline on 5-Oct-2026. |
| No optimisation performed | ✅ No instrumentation or optimisation code (PO Decision 8) |
| Architecture discussion deferred | ✅ PO decision 5-Oct-2026: no regional optimisation or architectural change now. F-11 is recorded as input to Archie's infrastructure review (Governance Backlog §2.9). |
| No action required for Phase 1 | ✅ **for optimisation and architecture.** ⚠ **One decision remains:** the plan's targets T-1 to T-4 (`020` §13.4) were to be "confirmed with the Product Owner after the E1 baseline". They have not been. The existing Journey Planning screens already exceed the proposed T-2 and T-3 on this baseline, and Rad rates T-2 and T-3 "at risk" (F-11). SC-11 ("within the target agreed") cannot be assessed without agreed targets → **open Product Owner decision `OD-R1.3-8`, due before Milestone B completion** (Rev 3). |

## 7. Risks — ✅ Documented, owned, no blocker

| Risk | Owner | Status | Blocker? |
|---|---|---|---|
| Latency between the Vercel function region and Supabase (F-11) | Archie (review §2.9); PO (targets) | RISK-R1.3-006 open; update with the measured figures | No |
| First cloud build of Milestone A code happens only after Checkpoint 4 (build was verified with mocks) | Rad, Tiger | New; mitigated by CP1-3 | No |
| Shared-database writes during the baseline (`QA-WS13-P1-Perf-01`, approved 4-Oct) | Tiger, Vivek | Add to the release-readiness QA data removal list (`DEC-R1.3-022` (5)) | No |
| SR-03: readiness items not back-filled when a template was empty at assignment, so the BR-028 gate stays open after Phase 2 content arrives | Arjun, PO; Archie (design) | Phase 2 dependency; the Phase 2 content card must include a reviewed back-fill decision | No (Phase 1) |
| F-06: a Journey with no primary contact cannot get one from the editor | Arjun, PO | Product decision after the `023` §10 read-only count | No |
| F-08: no Docker or Supabase CLI on the engineering device | Tiger, PO | Affects the M11 application method → Checkpoint 3 | No |
| Uncommitted Milestone A baseline (24 created and 8 modified paths, plus reports) | Tiger | GF-1, completed with this synchronisation | No |

## 8. Technical Debt — ✅ TD-WS13-006 recorded; one entry proposed

| Item | Status |
|---|---|
| TD-WS13-006 — deactivation not enforced in RLS read policies | ✅ In `TECH-DEBT.md` v1.5. Rad's F-04 confirms it at API level. Remains on the RLS hardening card before Phase 3. |
| OBS-P1-04 — audit and task SELECT `using (true)` | ✅ Recorded with TD-WS13-006 for the same card |
| **Proposed TD-WS13-007** — M11 SQL hygiene bundle: SR-04 (whitespace check weaker in SQL than in the service), SR-06 (deactivated template blocks Start preparation), SR-07 (unknown helper mode), SR-08 (contact types missing from the lockstep note) | Not yet logged. Low; bundle with the next change to these functions (Phase 2). Owners Rad and Archie. |
| SR-09 (`service_role` keeps EXECUTE on helpers under Supabase defaults) | To the RLS hardening card (note on TD-WS13-006) |
| F-10 (constraint names truncated at 63 characters) | Informational; note on the hardening card |
| F-08 (local Supabase tooling) | A tooling proposal, not code debt → Future Considerations |

## 9. Deployment Readiness — ✅ Met, with one disclosed and approved data write

| Check | Result |
|---|---|
| Nothing deployed | ✅ Nothing committed or pushed since `6c78ac7`. Preview still runs Phase 0 code. |
| No shared-database **schema** change | ✅ M11 not applied (Rad, Archie; no CLI on the device). Not directly verified by Tiger, who has no database access. Rad's `023` §10 read-only query lets the PO confirm that no `public.workspace_journey%` function exists before Checkpoint 4. |
| No shared-database **data** change | ⚠ **Disclosed, approved departure.** The Preview baseline wrote one QA record `QA-WS13-P1-Perf-01`, its claim, one stage change, five Trip Basics saves and their audit rows. The PO approved these writes before they ran on 4-Oct-2026 (PO Decision 7: test records only). No conversion, Journey or traveller was created, and no genuine operational record changed. |
| Migration remains local only | ✅ |
| Rollback available | ✅ Verified by Archie (§2) |

## 10. Repository — ⚠ Partly met

| Check | Result |
|---|---|
| Current branch correct | ✅ `feature/r1.3-ws13-journey-workspace` |
| HEAD and origin | ✅ `6c78ac7`, 0 ahead and 0 behind |
| Preview build successful | ✅ for HEAD `6c78ac7` (Vercel success, 4-Oct-2026). There is no Preview build of Milestone A code, by design: the push waits for Checkpoint 4 so that new routes never run without their functions. |
| **Repository clean** | ❌ 8 modified tracked files and 15 untracked entries: the Milestone A code, M11 and the three reports. This is intentional, pending PO commit authorisation, but it is not clean. |
| **Milestone documentation committed** | ❌ at review; `023`, `023A` and this review were uncommitted → **GF-1**, done with this synchronisation |
| Card record | ⚠ `EBC-R1.3-WS13-022` (Milestone A implementation card, cited by `023`) was neither in `docs/09-Development/` nor in Project Knowledge → **GF-2**, filed as an administrative engineering record |
| Housekeeping | `.git/next-index-15.lock` (14-Aug-2026, pre-existing) is still present. It is harmless unless Git reports a lock error. |

## 11. Gate Decision

> **Checkpoint 1 PASSED** (Product Owner decision, 7-Oct-2026, `DEC-R1.3-028`).
>
> Tiger's review recommended *Approved with Conditions*. The Product Owner accepted the evidence and findings and recorded the checkpoint as **Passed**. The items raised are governance follow-up actions; none blocks engineering progression. **Milestone B is authorised** and proceeds without further approval once the governance synchronisation is complete. Checkpoint 2 remains **Approved with conditions** SR-01 and SR-02 (Archie). Those conditions gate Checkpoint 4, not Milestone B.

## 12. Governance Follow-up Actions (not conditions)

| # | Action (Rev 2 ref.) | Owner | Status |
|---|---|---|---|
| GF-1 | Commit Milestone A locally (CP1-1): the 32 code and migration paths of `023` §12 plus `023` and `023A`, then a governance commit for this review, `022` and the registers. **No push until Checkpoint 4.** | Tiger | Done with this synchronisation |
| GF-2 | File `EBC-R1.3-WS13-022` (CP1-2) as an administrative engineering record. The original card text could not be recovered, so the record is built from `021` §10 and `023`. | Tiger | Done with this synchronisation |
| GF-3 | The deployment runbook (Checkpoint 3) includes CP1-3: SR-01; SR-02; the M11 application method (CLI with Docker on the operator's machine, or the SQL editor with an explicit transaction and a history row; F-08); the order **apply M11 → verify → push**; and **Preview build READY, then a smoke test of the new routes**. | Tiger drafts, Rad adds steps, Vivek approves | Recorded in Governance Backlog §2.10; drafting next |
| GF-4 | Milestone B includes SR-11 (History label "Contact added") and Sophie's `020B` confirmations (CP1-5) | Rad, Sophie | Milestone B |

**Open Product Owner decision (formerly CP1-4):** `OD-R1.3-8`. Confirm or revise performance targets T-1 to T-4 (`020` §13.4) against the 4-Oct baseline, so SC-11 can be assessed. **Due before Milestone B completion.** Region changes stay out of Phase 1 (PO Decision 8). Archie advises.

## 13. Engineering Observations

| ID | Observation | Disposition |
|---|---|---|
| OBS-CP1-01 | Milestone A was well-evidenced. Two independent database suites, Archie's adversarial probes and a verified rollback make M11 the best-tested migration in Release 1.3. | Note |
| OBS-CP1-02 | Rad found and fixed three latent defects that only appear at volume or under ties (F-01 to F-03). | Note; F-02 page size must not exceed the project's PostgREST `max-rows` (1,000) |
| OBS-CP1-03 | D-2 convention: any RPC writing more than one audit row for one entity uses `clock_timestamp()`; History pages by `(created_at, id)` | Governance Backlog §2.12 (proposal for the Engineering Handbook §7) |
| OBS-CP1-04 | AR-F2 / SR-05: the readiness gate reads a view that aggregates every Journey. About 13 ms at 2,000 Journeys locally. | Acceptable at current scale; B-8 on real data before Checkpoint 4 |
| OBS-CP1-05 | OBS-P1-QA-TB-01: `POST …/trip-basics` with explicit `null` fields returns 500 (pre-existing WS12; the UI is unaffected) | Keerthi, Phase 1 QA (PO, 5-Oct-2026) |
| OBS-CP1-06 | Rev 1 of this review proposed PO decisions that were never recorded; governance records lagged by two days | Closed by `DEC-R1.3-027` and `DEC-R1.3-028` |

## 14. Governance Synchronisation (7-Oct-2026)

| Register | Change |
|---|---|
| `RELEASE-1.3.md` → v1.28 | `DEC-R1.3-027` (baseline decisions and the approved baseline writes, as documented in `023`); `DEC-R1.3-028` (Checkpoint 1 Passed; Milestone B authorised); top status and WS13 row; §6 carry-forward (F-06, SR-03, OBS-P1-QA-TB-01, QA data `QA-WS13-P1-Perf-01`); §8 `OD-R1.3-8`; §10 RISK-R1.3-006 measured figures; §12 gates (Checkpoints 1 and 2) and release QA-data line |
| `RELEASE-1.3-FEATURE-REGISTER.md` → v1.16 | `FEAT-R1.3-013`: Milestone A complete, Checkpoint 1 passed, Milestone B authorised |
| `TECH-DEBT.md` → v1.6 | TD-WS13-007 (M11 SQL hygiene: SR-04, SR-06 to SR-08); TD-WS13-006 annotated (F-04, SR-09, F-10) |
| `RELEASE-1.3-GOVERNANCE-BACKLOG.md` | §2.9 scope extended (F-11 latency); §2.10 Phase 1 runbook contents (GF-3) and local tooling (F-08); new §2.12 engineering convention proposal (D-2) |
| `docs/09-Development/EBC-R1.3-WS13-022-…` | Administrative engineering record (GF-2) |
| `FUTURE-CONSIDERATIONS.md` | Not changed. F-08 (local Supabase tooling) is recorded in the Governance Backlog §2.10 with the application-method decision. |

## 15. Product Owner Decision (7-Oct-2026)

> "I accept your evidence and findings with the following governance refinements.
> 1. Checkpoint 1 is recorded as PASSED rather than Passed with Conditions. The items identified are governance follow-up actions and do not block engineering progression.
> 2. Milestone B is authorised immediately upon this checkpoint approval. Repository synchronisation and governance updates are administrative follow-up activities and shall be completed immediately afterwards.
> 3. Record the approved write operations performed during the performance baseline exactly as documented.
> 4. Create DEC-R1.3-027 for the performance-baseline decisions and DEC-R1.3-028 for Checkpoint 1 approval.
> 5. Update the Release Tracker, Feature Register, Technical Debt Register and Governance Backlog accordingly.
> 6. If EBC-R1.3-WS13-022 was not formally created, produce it now as an administrative engineering record. It is not a blocker to Phase 1.
> 7. Record the Performance Target review as an open Product Owner decision before Milestone B completion rather than a Checkpoint 1 condition.
>
> Once governance synchronisation is complete, Milestone B implementation may proceed without further approval."
> — Vivek, Product Owner

---

> **Checkpoint 1 PASSED — Milestone B Authorised.**
>
> — Tiger, Delivery Manager, on behalf of Team Satvi, 7 October 2026
