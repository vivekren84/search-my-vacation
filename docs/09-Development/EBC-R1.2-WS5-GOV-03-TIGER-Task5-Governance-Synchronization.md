# EBC-R1.2-WS5-GOV-03-TIGER — WS5 Engineering Review Governance Synchronization – Task 5 Completion

```text
Document Type : Project Governance & Documentation Synchronization (documentation only — no
                application code, configuration, or implementation file was modified)
EBC ID        : EBC-R1.2-WS5-GOV-03-TIGER
Persona       : Tiger — Delivery Manager
Reviewer      : Vivek — Product Owner
Release       : 1.2
Workstream    : WS5 — OTP Verification & Production Enablement
Repository    : search-my-vacation
Branch        : feature/ebc-r1.2-ws5-03-otp-verification (current Release 1.2 working branch)
Mode          : Documentation Update Only. No code, configuration, or implementation files
                were modified. No branches created or switched. No commits or pushes made.
Date          : 25-Aug-2026
```

---

## 0. Workspace Readiness Check

| Check | Result |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — reachable via the device bridge |
| Repository | `search-my-vacation` |
| Branch | `feature/ebc-r1.2-ws5-03-otp-verification` |
| HEAD | `77d3a91` — unchanged by this activity |
| Working tree | Same pre-existing changed/untracked entries carried across every WS5/WS6 governance check this thread (unrelated Workstream 6 destination/geo-validation work, plus the already-applied `leads/route.ts` OBS-4-01 fix); not touched here |
| Files modified by this task | `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5 section + Decision Log only), `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (§9 only), and this document |
| Drift check | Both target files were re-staged immediately before editing and confirmed byte-identical to the last-known outputs committed under `EBC-R1.2-WS5-GOV-02-TIGER-Close-OBS-4-01-Governance-Synchronization` — no untracked intervening edits |

## 0.1 Documents Reviewed

- `EBC-R1.2-WS5-REV1-05-RAD` — Engineering Flow Validation, Task 5 (Validate OTP Generation) — the source of every observation synchronised below
- `EBC-R1.2-WS5-GOV-01-TIGER-Engineering-Review-Governance-Synchronization` (not amended by this task)
- `EBC-R1.2-WS5-GOV-02-TIGER-Close-OBS-4-01-Governance-Synchronization` (not amended by this task)
- `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (current version, prior to this task's Activity 2 edit)
- `docs/10-Backlog/RELEASE-1.2.md` (current version, prior to this task's Activities 3–4 edits)

---

## 1. Purpose

This document synchronises Release governance with the outcome of WS5 Engineering Review 1 Task 5 (Validate OTP Generation), so that its accepted observations, the one deferred architectural hardening item, and the decision to continue to Task 6 are formally captured without disturbing any prior governance record. No application code, configuration, or implementation file is modified by this activity, and no historical engineering review or governance document (`GOV-01`, `GOV-02`) is rewritten.

---

## 2. Activity 1 — Engineering Observation Register (Consolidated)

All observations previously recorded in `GOV-01` (`OBS-3-01`–`OBS-3-05`) and `GOV-02` (`OBS-4-01`–`OBS-4-03`) are carried forward below **unchanged, unrenumbered**, with Task 5's four new observations appended. This table is the authoritative consolidated register as of this document; it does not edit or supersede the tables in `GOV-01`/`GOV-02` themselves.

| Observation ID | Severity | Source | Current Disposition | Cross-Reference |
|---|---|---|---|---|
| OBS-3-01 | Minor | Task 3 | Accepted | `TD-R1.3-005` |
| OBS-3-02 | Minor | Task 3 | Accepted | `TD-R1.3-003` |
| OBS-3-03 | Minor | Task 3 | Accepted | `TD-R1.3-004` |
| OBS-3-04 | Major | Task 3 | Deferred | `TD-R1.3-001` |
| OBS-3-05 | Major | Task 3 | Deferred | `TD-R1.3-002` |
| OBS-4-01 | Blocker | Task 4 | **Resolved** | `EBC-R1.2-WS5-IMP-01-RAD`; `DEC-R1.2-021`; verified in `GOV-02` |
| OBS-4-02 | Major | Task 4 | Open | Not yet a backlog item — retained for future disposition |
| OBS-4-03 | Minor | Task 4 | Open | `TD-R1.3-006` (documentation angle only; the field-naming ambiguity itself remains open) |
| **OBS-5-01** | **Major** | **Task 5** | **Deferred** | **`TD-R1.3-007`** |
| **OBS-5-02** | **Minor** | **Task 5** | **Open — Accepted** | Not yet a backlog item — MSG91 `sender`/`template_id` co-occurrence unconfirmed against live provider behaviour; cannot be resolved by static review |
| **OBS-5-03** | **Minor** | **Task 5** | **Open — Accepted** | Not yet a backlog item — `generateOtpCode()`/`hashOtpCode()` located in `repository.ts` rather than `service.ts` or a dedicated module |
| **OBS-5-04** | **Minor** | **Task 5** | **Open — Accepted** | Not yet a backlog item — unprotected concurrent-first-request race on `send_journey_passport_otp`; low likelihood/impact, no correctness break (verification is keyed by `challenge_id`) |

No previously-recorded row (`OBS-3-0x`, `OBS-4-0x`) was modified, renumbered, or reclassified in producing this table — each is reproduced exactly as it stands in `GOV-01`/`GOV-02`. Only the four `OBS-5-0x` rows are new.

`OBS-5-01` is the one finding of substance from Task 5: OTP-specific rate-limit configuration (`JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS`/`_MAX`) exists but is never wired to enforcement — confirmed by a zero-reference search across the codebase. Actual enforcement is entirely the shared `journey-leads/rate-limit.ts` limiter: in-memory, per-process, and keyed only by IP address (`x-forwarded-for`/`x-real-ip`), with no per-mobile-number dimension at all. This contradicts `EBC-R1.2-WS5-01` §6.5's explicit architecture requirement that OTP send/verify be rate-limited at the database layer, keyed by mobile number, specifically because OTP abuse carries direct SMS cost and provider-reputation risk beyond ordinary lead-submission abuse. Task 5's own assessment found this to be an architecture-hardening gap, not a defect that blocks current production readiness (MSG91 is not yet live), and recommended routing it to Archie for architecture confirmation followed by a dedicated implementation EBC — mirroring the `OBS-4-01`/`IMP-01` pattern — before MSG91 production configuration proceeds.

No Blocker-severity findings exist in Task 5 — confirmed against its own Severity Summary (0 Blocker; 1 Major; 3 Minor).

---

## 3. Activity 2 — Release 1.3 Backlog Update

`docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9 ("Engineering Technical Debt") has been updated with a new row, `TD-R1.3-007` ("Implement Persistent Mobile Number Rate Limiting for OTP"), carrying forward the exact title, priority (High), category (Engineering Technical Debt), description, source, and architecture reference this card specified. The table itself has no separate "Category" or "Architecture Reference" columns (all six prior entries use the same `ID | Title | Description | Priority | Source` shape), so both fields are carried inline within the Description text — consistent with how `TD-R1.3-006`'s supporting detail was previously incorporated. The section's introductory paragraph and its trailing open-observations sentence were both updated to reflect Task 5 (now citing seven items, the full `OBS-5-0x` range, and `DEC-R1.2-022`/this document) and to list `OBS-5-02`–`OBS-5-04` alongside the still-open `OBS-4-02`/`OBS-4-03`. `RELEASE-1.3-BACKLOG.md`'s own Document Change History (v1.3) records this update and cross-references this EBC. TD-R1.3-001 through TD-R1.3-006 were reviewed and confirmed unchanged — no wording, priority, or source was altered on any of them.

Full description text is recorded in `RELEASE-1.3-BACKLOG.md` §9 itself, not duplicated here, to avoid two documents silently drifting apart on the same text.

---

## 4. Activity 3 — WS5 Tracker Update

`docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 section has a new subsection, "Workstream 5 — Engineering Review 1 Governance Update (Task 5 Complete)," immediately following the existing "Workstream 5 — Engineering Review 1 Governance Update (OBS-4-01 Closed)" subsection. It records: Task 5 completed with a Pass with Observations result; no production blockers identified; OTP generation implementation (code generation, hash storage, challenge IDs, expiry bounds, resend handling) accepted as functionally correct; one architectural hardening recommendation (`OBS-5-01`) deferred to Release 1.3 as `TD-R1.3-007`; three Minor engineering observations (`OBS-5-02`–`OBS-5-04`) accepted; engineering review cleared to proceed to Task 6. **Workstream 5's Status field, Progress field, and every other field in the Workstream 5 summary table and Section 6.5 task table are unchanged** — this activity does not alter WS5's completion status, which remains `🟡 Partially Implemented – Waiting for External DLT Dependency`.

---

## 5. Activity 4 — Engineering Decision Log Entry

Recorded as `DEC-R1.2-022` in `docs/10-Backlog/RELEASE-1.2.md` §7 (Product Decision Log):

| Field | Value |
|---|---|
| Decision | Proceed to Task 6 following successful completion of Task 5. |
| Rationale | OTP generation has been independently reviewed and determined to be functionally correct. Remaining observations relate to architecture hardening and engineering quality rather than production readiness. |
| Outcome | Task 5 accepted. Review continues. TD-R1.3-007 created. |
| Status | Approved |

---

## 6. Activity 5 — Cross-Reference Validation

| Link | Confirmed |
|---|---|
| `OBS-5-01` → Task 5 Review | Yes — `EBC-R1.2-WS5-REV1-05-RAD` is the sole originating source cited for `OBS-5-01` in §2 above |
| Task 5 Review → `TD-R1.3-007` | Yes — `RELEASE-1.3-BACKLOG.md` §9's new row cites "WS5 Review 1 – Task 5 (`OBS-5-01`)" as its Source, and embeds the WS5 Architecture Review §6.5 reference `EBC-R1.2-WS5-REV1-05-RAD` itself relies on |
| `TD-R1.3-007` → Decision Log | Yes — `DEC-R1.2-022`'s Outcome explicitly states "TD-R1.3-007 created" |
| Decision Log → Observation Register | Yes — this document's §2 consolidated register and §5 Decision Log entry both exist within the same EBC and use consistent IDs (`OBS-5-01` ↔ `TD-R1.3-007` ↔ `DEC-R1.2-022`) |
| No duplicate technical debt items exist | Confirmed — `RELEASE-1.3-BACKLOG.md` §9 was reviewed end-to-end; `TD-R1.3-007` is the only item sourced from Task 5, and no existing item (`TD-R1.3-001`–`006`) already covers OTP rate-limiting enforcement |
| `TD-R1.3-001` through `TD-R1.3-006` remain unchanged | Confirmed — diffed against the pre-edit version of `RELEASE-1.3-BACKLOG.md`; only the §9 intro paragraph, the trailing open-observations sentence, the new `TD-R1.3-007` row, and the Document Change History table were touched |
| Previous governance decisions remain intact | Confirmed — `DEC-R1.2-020` and `DEC-R1.2-021` in `RELEASE-1.2.md` §7, and both WS5 Engineering Review governance subsections (Tasks 1–3; OBS-4-01 Closed), are unmodified by this update; only new content was appended |

---

## 7. Activity 6 — Documentation Consistency Review

A final consistency pass was performed across `GOV-01`, `GOV-02`, this document (`GOV-03`), the Release 1.2 tracker, and the Release 1.3 backlog:

| Check | Result |
|---|---|
| Observation ID continuity | `OBS-3-0x` (5 items, `GOV-01`) → `OBS-4-0x` (3 items, `GOV-02`) → `OBS-5-0x` (4 items, `GOV-03`) form a single unbroken, non-overlapping numbering sequence with no gaps or reused IDs |
| Decision Log continuity | `DEC-R1.2-020` (`GOV-01`) → `DEC-R1.2-021` (`GOV-02`) → `DEC-R1.2-022` (`GOV-03`) are sequential with no gaps; each Decision Log row's cited governance document matches the document that actually recorded it |
| Technical debt continuity | `TD-R1.3-001`–`005` (`GOV-01`) → `TD-R1.3-006` (`GOV-02`) → `TD-R1.3-007` (`GOV-03`) are sequential; each row's Source column correctly names its originating task and observation |
| WS5 governance subsection ordering | The three WS5 Engineering Review governance subsections in `RELEASE-1.2.md` now appear in chronological order — "Tasks 1–3," "OBS-4-01 Closed," "Task 5 Complete" — each immediately followed by the next, with the pre-existing `---`/`## Workstream 6` boundary preserved after the last |
| No historical document rewritten | Confirmed — `GOV-01` and `GOV-02` were read for reference only; neither file was opened for editing during this task |
| WS5 overall completion status | Confirmed unchanged across every touched document — `🟡 Partially Implemented – Waiting for External DLT Dependency` appears identically in the Workstream 5 summary table, the pre-existing Governance Note, and all three Engineering Review governance subsections |
| Open observations correctly reflected everywhere they are mentioned | Confirmed — `RELEASE-1.3-BACKLOG.md` §9's trailing sentence, this document's §2 register, and `RELEASE-1.2.md`'s new WS5 subsection all agree that `OBS-4-02`, `OBS-4-03`, `OBS-5-02`, `OBS-5-03`, `OBS-5-04` remain open and unreclassified |

---

## 8. Expected Deliverables Cross-Reference

| Deliverable (per card) | Location |
|---|---|
| Extended Engineering Observation Register (`OBS-5-01`–`OBS-5-04`) | §2 above |
| `TD-R1.3-007` in Release 1.3 Backlog | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9 |
| Updated WS5 governance section in Release 1.2 tracker | `docs/10-Backlog/RELEASE-1.2.md`, new "Task 5 Complete" subsection |
| New Decision Log entry (`DEC-R1.2-022`) | `docs/10-Backlog/RELEASE-1.2.md` §7 |
| Cross-Reference Validation | §6 above |
| Documentation Consistency Review | §7 above |
| This document | `docs/09-Development/EBC-R1.2-WS5-GOV-03-TIGER-Task5-Governance-Synchronization.md` |

---

## 9. Acceptance Criteria

| Criterion | Status |
|---|---|
| All engineering observations from Task 5 have been recorded | Met — §2 |
| Technical debt has been added to the Release 1.3 backlog | Met — §3, `RELEASE-1.3-BACKLOG.md` §9 |
| Governance documentation reflects the agreed decisions | Met — §4, §5, `DEC-R1.2-022` |
| Traceability exists between the engineering review and backlog planning | Met — §6 |
| No implementation files have been modified | Met — only the two named `docs/10-Backlog/` files and this document were changed |
| No Release 1.2 scope has changed | Met — no task wording, acceptance criteria, owner, dependency, or WS5 completion status was altered; only a new governance subsection and a new Decision Log row were added |
| Previous observations were not modified or renumbered | Met — §2 reproduces `OBS-3-0x`/`OBS-4-0x` unchanged |
| Historical review artefacts were not rewritten | Met — `GOV-01` and `GOV-02` were not edited |

---

## 10. Out of Scope / Not Performed

No application code, configuration, or implementation file was created, modified, or deleted. No branch was created or switched. No commits or pushes were made. No Product, Architecture, Engineering, or QA decision already on record was reopened or reclassified. `OBS-4-02`, `OBS-4-03`, `OBS-5-02`, `OBS-5-03`, and `OBS-5-04` were not actioned, escalated, or converted to backlog items beyond the acknowledgement already recorded — that remains a future, separately-scoped decision. No implementation planning (sequencing, estimates, scheduling within Release 1.3) was performed for `TD-R1.3-007` beyond recording it. WS5 Engineering Review Task 6 onward is unaffected and may proceed against the baseline this document establishes.

---

## 11. Success Criteria

- ✅ The Observation Register is extended, not replaced.
- ✅ Release 1.3 backlog accurately reflects `TD-R1.3-007`.
- ✅ Release 1.2 tracker records Task 5 completion without altering WS5's overall status.
- ✅ The Decision Log shows a clear, auditable trail from Task 4 through Task 5.
- ✅ No engineering implementation was performed under this task.

---

*Prepared by Tiger (Delivery Manager) as a documentation-only governance synchronisation, per `EBC-R1.2-WS5-GOV-03-TIGER-Task5-Governance-Synchronization`. No repository code, configuration, or implementation files were created, modified, or deleted in producing this document.*
