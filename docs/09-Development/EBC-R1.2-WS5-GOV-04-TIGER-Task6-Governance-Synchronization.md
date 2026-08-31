# EBC-R1.2-WS5-GOV-04-TIGER — WS5 Engineering Review Governance Synchronization – Task 6 Completion

```text
Document Type : Project Governance & Documentation Synchronization (documentation only — no
                application code, configuration, or implementation file was modified)
EBC ID        : EBC-R1.2-WS5-GOV-04-TIGER
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
| Working tree | Same pre-existing 42 changed/untracked entries carried across every WS5/WS6 governance check this thread; not touched here |
| Files modified by this task | `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5 section + Decision Log only), `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (§9 only), and this document |
| Drift check | Both target files were re-staged immediately before editing and confirmed byte-identical to the last-known outputs committed under `EBC-R1.2-WS5-GOV-03-TIGER-Task5-Governance-Synchronization` — no untracked intervening edits |

## 0.1 Documents Reviewed

- `EBC-R1.2-WS5-REV1-06-RAD` — Engineering Flow Validation, Task 6 (Validate OTP Verification) — the source of every observation synchronised below
- `EBC-R1.2-WS5-GOV-03-TIGER-Task5-Governance-Synchronization` (not amended by this task)
- `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (current version, prior to this task's Activity 2 edit)
- `docs/10-Backlog/RELEASE-1.2.md` (current version, prior to this task's Activities 3–4 edits)

---

## 1. Purpose

This document synchronises Release governance with the outcome of WS5 Engineering Review 1 Task 6 (Validate OTP Verification), so that its accepted observations, the consolidation of its one Major finding into the existing `TD-R1.3-007` technical debt item, and the decision to continue to Task 7 are formally captured without disturbing any prior governance record. No application code, configuration, or implementation file is modified by this activity, and no historical engineering review or governance document (`GOV-01`, `GOV-02`, `GOV-03`) is rewritten.

---

## 2. Activity 1 — Engineering Observation Register (Consolidated)

All observations previously recorded in `GOV-01` (`OBS-3-01`–`OBS-3-05`), `GOV-02` (`OBS-4-01`–`OBS-4-03`), and `GOV-03` (`OBS-5-01`–`OBS-5-04`) are carried forward below **unchanged, unrenumbered**, with Task 6's three new observations appended. This table is the authoritative consolidated register as of this document; it does not edit or supersede the tables in `GOV-01`/`GOV-02`/`GOV-03` themselves.

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
| OBS-5-01 | Major | Task 5 | Deferred | `TD-R1.3-007` |
| OBS-5-02 | Minor | Task 5 | Open — Accepted | Not yet a backlog item — MSG91 `sender`/`template_id` co-occurrence unconfirmed against live provider behaviour |
| OBS-5-03 | Minor | Task 5 | Open — Accepted | Not yet a backlog item — OTP crypto utilities located in `repository.ts` rather than `service.ts`/a dedicated module |
| OBS-5-04 | Minor | Task 5 | Open — Accepted | Not yet a backlog item — unprotected concurrent-first-request race on `send_journey_passport_otp`; no correctness break |
| **OBS-6-01** | **Major** | **Task 6** | **Deferred — consolidated into `TD-R1.3-007`** | **`TD-R1.3-007` (expanded); same underlying initiative as `OBS-5-01`** |
| **OBS-6-02** | **Minor** | **Task 6** | **Open — Accepted** | Not yet a backlog item — OTP hash comparison uses plain SQL text equality rather than an explicit constant-time comparison |
| **OBS-6-03** | **Minor** | **Task 6** | **Open — Accepted** | Not yet a backlog item — verification token has no independent, time-based expiry |

No previously-recorded row (`OBS-3-0x`, `OBS-4-0x`, `OBS-5-0x`) was modified, renumbered, or reclassified in producing this table — each is reproduced exactly as it stands in `GOV-01`/`GOV-02`/`GOV-03`. Only the three `OBS-6-0x` rows are new.

`OBS-6-01` is Task 6's finding of substance and extends `OBS-5-01` rather than standing alone: `send_journey_passport_otp`'s existing-challenge lookup filters on `status = 'pending'` only, so a challenge that has reached a terminal `exhausted` or `expired` state is never found by a subsequent send call — a fresh row is inserted instead, with `resend_count` and `attempt_count` both reset to zero. This silently discards the resend cap's memory exactly at the moment it matters most: `exhausted` is the state produced by five consecutive wrong guesses, the classic signature of active brute-forcing rather than ordinary usage. The consequence is a repeatable send → guess-5-times (exhaust) → send-again cycle, bounded only by the same IP-only rate limiter `OBS-5-01` already found lacking a per-mobile-number dimension. Task 6's own assessment treats this as the same underlying question `OBS-5-01` raises — how many total OTP attempts one mobile number can be subjected to, and by whom — at a different layer (the resend-cap RPC's row-selection logic, rather than the rate limiter itself), and explicitly recommends the two be grouped for a single combined architecture-and-implementation pass rather than fixed independently, since a fix to one without the other would leave the layered brute-force defense incomplete.

No Blocker-severity findings exist in Task 6 — confirmed against its own Severity Summary (0 Blocker; 1 Major; 2 Minor).

---

## 3. Activity 2 — Release 1.3 Technical Debt Register Update

`docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9 has been updated by **expanding the existing `TD-R1.3-007`** — no new technical debt item (`TD-R1.3-008`) was created, per this card's explicit constraint. The row's title was extended to "Implement Persistent Mobile Number Rate Limiting for OTP (OTP Abuse Protection Hardening)" and its Description was expanded to a five-point Scope covering: persistent mobile-number-keyed rate limiting; distributed-safe enforcement; resend-limit persistence across the full challenge lifecycle including terminal states (the `OBS-6-01` gap); OTP abuse protection hardening as a single combined initiative; and alignment with Archie's WS5 architecture recommendations. The Source column was updated from "WS5 Review 1 – Task 5 (`OBS-5-01`)" to "WS5 Review 1 – Task 5 (`OBS-5-01`) and Task 6 (`OBS-6-01`)". The §9 introductory paragraph and trailing open-observations sentence were both updated to reflect Task 6 (citing this document, `DEC-R1.2-023`, and the full `OBS-6-0x` range) and to record that `OBS-5-01`/`OBS-6-01` are now the two exceptions represented together within the expanded item, while `OBS-6-02`/`OBS-6-03` join the still-open, not-yet-backlogged list alongside `OBS-4-02`/`OBS-4-03`/`OBS-5-02`/`OBS-5-03`/`OBS-5-04`. `RELEASE-1.3-BACKLOG.md`'s own Document Change History (v1.4) records this update and cross-references this EBC. `TD-R1.3-001` through `TD-R1.3-006` were diffed against their pre-edit text and confirmed byte-for-byte unchanged — no wording, priority, or source was altered on any of them.

Full description text is recorded in `RELEASE-1.3-BACKLOG.md` §9 itself, not duplicated here, to avoid two documents silently drifting apart on the same text.

---

## 4. Activity 3 — WS5 Governance Notes Update

`docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 section has a new subsection, "Workstream 5 — Engineering Review 1 Governance Update (Task 6 Complete)," immediately following the existing "Workstream 5 — Engineering Review 1 Governance Update (Task 5 Complete)" subsection. It records: Task 6 completed successfully with a Pass with Observations result; no production blockers identified; OTP verification implementation (challenge validation, hash comparison, attempt handling, expiry enforcement, replay protection, token issuance) accepted; one architectural hardening observation (`OBS-6-01`) consolidated into the existing `TD-R1.3-007` rather than raised as a new item; two Minor observations (`OBS-6-02`, `OBS-6-03`) accepted; engineering review cleared to proceed to Task 7. **Workstream 5's Status field, Progress field, and every other field in the Workstream 5 summary table and Section 6.5 task table are unchanged** — this activity does not alter WS5's completion status, which remains `🟡 Partially Implemented – Waiting for External DLT Dependency`.

---

## 5. Activity 4 — Engineering Decision Log Entry

Recorded as `DEC-R1.2-023` in `docs/10-Backlog/RELEASE-1.2.md` §7 (Product Decision Log):

| Field | Value |
|---|---|
| Decision | Proceed to Task 7 following successful completion of Task 6. |
| Rationale | OTP verification implementation satisfies production engineering requirements. Remaining observations concern future architecture hardening and engineering quality improvements. |
| Outcome | Task 6 accepted. Review continues. TD-R1.3-007 expanded to include the complete OTP abuse protection initiative. |
| Status | Approved |

---

## 6. Activity 5 — Cross-Reference Validation

```text
OBS-5-01
        │
        ├──────────────┐
        │              │
OBS-6-01              │
        │              │
        ▼              ▼
     TD-R1.3-007 (Expanded)
              │
              ▼
        Decision Log (DEC-R1.2-023)
              │
              ▼
     Observation Register (this document, §2)
```

| Link | Confirmed |
|---|---|
| `OBS-5-01` and `OBS-6-01` both reference the same engineering initiative | Yes — `RELEASE-1.3-BACKLOG.md` §9's expanded `TD-R1.3-007` row Source column names both, and its Scope text explicitly states they "compound each other and both need to be closed together" |
| No duplicate technical debt items exist | Confirmed — `RELEASE-1.3-BACKLOG.md` §9 was reviewed end-to-end; the register remains seven items (not eight); no `TD-R1.3-008` was created, per this card's explicit constraint |
| `TD-R1.3-001` through `TD-R1.3-006` remain unchanged | Confirmed — diffed against the pre-edit version of `RELEASE-1.3-BACKLOG.md`; only the §9 intro paragraph, the trailing open-observations sentence, the `TD-R1.3-007` row, and the Document Change History table were touched |
| `TD-R1.3-007` → Decision Log | Yes — `DEC-R1.2-023`'s Outcome explicitly states "TD-R1.3-007 expanded to include the complete OTP abuse protection initiative" |
| Decision Log → Observation Register | Yes — this document's §2 consolidated register and §5 Decision Log entry both exist within the same EBC and use consistent IDs (`OBS-6-01` ↔ `TD-R1.3-007` (expanded) ↔ `DEC-R1.2-023`) |
| Previous governance decisions remain intact | Confirmed — `DEC-R1.2-020`, `DEC-R1.2-021`, and `DEC-R1.2-022` in `RELEASE-1.2.md` §7, and all three prior WS5 Engineering Review governance subsections (Tasks 1–3; OBS-4-01 Closed; Task 5 Complete), are unmodified by this update; only new content was appended |

---

## 7. Activity 6 — Documentation Consistency Review

A final consistency pass was performed across `GOV-01`, `GOV-02`, `GOV-03`, this document (`GOV-04`), the Release 1.2 tracker, and the Release 1.3 backlog:

| Check | Result |
|---|---|
| Observation ID continuity | `OBS-3-0x` (5, `GOV-01`) → `OBS-4-0x` (3, `GOV-02`) → `OBS-5-0x` (4, `GOV-03`) → `OBS-6-0x` (3, `GOV-04`) form a single unbroken, non-overlapping numbering sequence with no gaps or reused IDs |
| Decision Log continuity | `DEC-R1.2-020` (`GOV-01`) → `DEC-R1.2-021` (`GOV-02`) → `DEC-R1.2-022` (`GOV-03`) → `DEC-R1.2-023` (`GOV-04`) are sequential with no gaps; each Decision Log row's cited governance document matches the document that actually recorded it |
| Technical debt register continuity | `TD-R1.3-001`–`005` (`GOV-01`) → `TD-R1.3-006` (`GOV-02`) → `TD-R1.3-007` created (`GOV-03`) → `TD-R1.3-007` expanded, not duplicated (`GOV-04`) — the register correctly holds at seven items, no gap or unintended increment to eight |
| WS5 governance subsection ordering | The four WS5 Engineering Review governance subsections in `RELEASE-1.2.md` now appear in chronological order — "Tasks 1–3," "OBS-4-01 Closed," "Task 5 Complete," "Task 6 Complete" — each immediately followed by the next, with the pre-existing `---`/`## Workstream 6` boundary preserved after the last |
| No historical document rewritten | Confirmed — `GOV-01`, `GOV-02`, and `GOV-03` were read for reference only; none of the three files was opened for editing during this task |
| WS5 overall completion status | Confirmed unchanged across every touched document — `🟡 Partially Implemented – Waiting for External DLT Dependency` appears identically in the Workstream 5 summary table, the pre-existing Governance Note, and all four Engineering Review governance subsections |
| No duplicate backlog entries introduced | Confirmed — `TD-R1.3-007` was edited in place; no new row was added to the §9 table |
| Open observations correctly reflected everywhere they are mentioned | Confirmed — `RELEASE-1.3-BACKLOG.md` §9's trailing sentence, this document's §2 register, and `RELEASE-1.2.md`'s new WS5 subsection all agree that `OBS-4-02`, `OBS-4-03`, `OBS-5-02`, `OBS-5-03`, `OBS-5-04`, `OBS-6-02`, and `OBS-6-03` remain open and unreclassified, and that `OBS-5-01`/`OBS-6-01` alone are represented (together) as technical debt |

---

## 8. Expected Deliverables Cross-Reference

| Deliverable (per card) | Location |
|---|---|
| Updated Engineering Observation Register (`OBS-6-01`–`OBS-6-03`) | §2 above |
| Updated Release 1.3 Technical Debt Register (`TD-R1.3-007` expanded) | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9 |
| Updated WS5 Governance Notes | `docs/10-Backlog/RELEASE-1.2.md`, new "Task 6 Complete" subsection |
| Updated Decision Log (`DEC-R1.2-023`) | `docs/10-Backlog/RELEASE-1.2.md` §7 |
| Cross-Reference Verification Summary | §6 above |
| Documentation Consistency Summary | §7 above |
| This document | `docs/09-Development/EBC-R1.2-WS5-GOV-04-TIGER-Task6-Governance-Synchronization.md` |

---

## 9. Acceptance Criteria

| Criterion | Status |
|---|---|
| Task 6 observations have been recorded | Met — §2 |
| `TD-R1.3-007` has been expanded (not duplicated) | Met — §3, `RELEASE-1.3-BACKLOG.md` §9; no `TD-R1.3-008` exists |
| Governance documentation is synchronized | Met — §4, §5, `DEC-R1.2-023` |
| Traceability is preserved | Met — §6 |
| No implementation or configuration files have been modified | Met — only the two named `docs/10-Backlog/` files and this document were changed |
| WS5 Review 1 is formally cleared to proceed to Task 7 | Met — recorded in §4 and `DEC-R1.2-023` |
| Previous observations were not modified or renumbered | Met — §2 reproduces `OBS-3-0x`/`OBS-4-0x`/`OBS-5-0x` unchanged |
| Historical governance artefacts remain unchanged | Met — `GOV-01`/`GOV-02`/`GOV-03` were not edited |

---

## 10. Out of Scope / Not Performed

No application code, configuration, or implementation file was created, modified, or deleted. No branch was created or switched. No commits or pushes were made. No Product, Architecture, Engineering, or QA decision already on record was reopened or reclassified. `OBS-4-02`, `OBS-4-03`, `OBS-5-02`, `OBS-5-03`, `OBS-5-04`, `OBS-6-02`, and `OBS-6-03` were not actioned, escalated, or converted to backlog items beyond the acknowledgement already recorded — that remains a future, separately-scoped decision. No `TD-R1.3-008` was created. No implementation planning (sequencing, estimates, scheduling within Release 1.3, or the architecture-confirmation-then-implementation-EBC sequence Task 6 itself recommends for `TD-R1.3-007`) was performed beyond recording the expanded item. WS5 Engineering Review Task 7 onward is unaffected and may proceed against the baseline this document establishes.

---

## 11. Success Criteria

- ✅ Task 6 is fully reflected in project governance.
- ✅ `TD-R1.3-007` is the single source of truth for OTP abuse protection hardening, incorporating both `OBS-5-01` and `OBS-6-01`.
- ✅ The Observation Register remains the authoritative record for WS5 Review 1.
- ✅ Documentation is synchronized across `GOV-01`–`GOV-04`, the Release 1.2 tracker, and the Release 1.3 backlog.
- ✅ The project is ready to continue with WS5 Review 1 – Task 7: Validate Lead Creation.

---

*Prepared by Tiger (Delivery Manager) as a documentation-only governance synchronisation, per `EBC-R1.2-WS5-GOV-04-TIGER-Task6-Governance-Synchronization`. No repository code, configuration, or implementation files were created, modified, or deleted in producing this document.*
