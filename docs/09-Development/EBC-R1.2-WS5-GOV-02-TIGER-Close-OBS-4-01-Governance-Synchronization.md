# EBC-R1.2-WS5-GOV-02-TIGER — WS5 Engineering Review Governance Update: Close OBS-4-01

```text
Document Type : Project Governance & Documentation Synchronization (documentation only — no
                application code, configuration, or implementation file was modified)
EBC ID        : EBC-R1.2-WS5-GOV-02-TIGER
Persona       : Tiger — Delivery Manager
Reviewer      : Vivek — Product Owner
Release       : 1.2
Workstream    : WS5 — OTP Verification & Production Enablement
Repository    : search-my-vacation
Branch        : feature/ebc-r1.2-ws5-03-otp-verification (current Release 1.2 working branch)
Mode          : Documentation Update Only. No code, configuration, or implementation changes
                performed by this activity. No branches created or switched. No commits or
                pushes made.
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
| Working tree | Now includes `web/app/api/journey-passport/leads/route.ts` as modified — this is the real, already-applied `EBC-R1.2-WS5-IMP-01-RAD` fix, confirmed present and independently re-read for this review (see §2 below); not touched by this documentation task |
| Files modified by this task | `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5 section + Decision Log only), `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (§9 only), and this document |

## 0.1 Documents Reviewed

- `EBC-R1.2-WS5-REV1-04-RAD` — Engineering Flow Validation, Task 4 (Validate Mobile Number Processing) — source of `OBS-4-01`, `OBS-4-02`, `OBS-4-03`
- `EBC-R1.2-WS5-IMP-01-RAD` — Implementation: Resolve OBS-4-01 — the fix itself and its verification evidence
- `EBC-R1.2-WS5-GOV-01-TIGER-Engineering-Review-Governance-Synchronization` — the prior governance record (Tasks 1–3); **not amended by this document** — per Project Instructions §32 ("do not rewrite history"), it remains the accurate record of the Tasks 1–3 synchronisation moment, before `OBS-4-01`/`OBS-4-02`/`OBS-4-03` existed. This document is additive, not a replacement.
- `docs/10-Backlog/RELEASE-1.2.md` and `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (current versions, prior to this task's edits)

---

## 1. Purpose

This document synchronises project governance with the resolution of `OBS-4-01`, the production blocker identified during WS5 Review 1 Task 4, following its implementation and independent review. It confirms the engineering review, governance documents, and Release 1.3 backlog remain fully synchronised, and clears the way for Review 1 to continue with Task 5. No implementation or configuration change is made or authorised by this document — the fix itself was already completed and verified under the separate `EBC-R1.2-WS5-IMP-01-RAD`.

---

## 2. Independent Review of EBC-R1.2-WS5-IMP-01-RAD

Before closing `OBS-4-01`, Tiger independently re-confirmed the implementation report's claims against the repository, rather than accepting the report at face value:

| Claim | Independently confirmed |
|---|---|
| `web/app/api/journey-passport/leads/route.ts` is the only file modified | Confirmed — `git status` shows exactly this file newly modified since the Tasks 1–3 baseline, alongside the same pre-existing, unrelated Workstream 6 working-tree entries carried across every prior check in this thread |
| The fix changes `consumeVerificationToken`'s first argument from `parsed.value.mobileNumber` to `parsed.value.mobileE164` | Consistent with the diff reproduced in `EBC-R1.2-WS5-IMP-01-RAD` §3 and the file's current modified status |
| The OTP challenge table is keyed exclusively on E.164 | Consistent with `EBC-R1.2-WS5-REV1-04-RAD`'s independently-traced evidence (the `journey_passport_otp_challenges.mobile_number` CHECK constraint, `^\+[1-9][0-9]{7,18}$`, and both `otp/send`/`otp/verify`'s E.164-only derivation) — the fix targets exactly the mismatch Task 4 identified, no more and no less |
| `tsc`/`eslint`/`verify:journey-leads` all passed | Reported as exit-code-0/explicit pass in `EBC-R1.2-WS5-IMP-01-RAD` §5; not independently re-run by this documentation-only activity (re-running engineering checks is Rad's/Keerthi's domain, not Tiger's, per Project Instructions §7/§8) — accepted on the report's own explicit, checkable claims (named commands, named exit behaviour), consistent with how prior engineering completion reports in this workstream have been governed |
| Only one call site of `consumeVerificationToken` exists | A repository-wide-grep claim in the report; not independently re-run here for the same reason as above, but consistent with the narrow, single-line diff and unsurprising given this route is the only OTP-token-consuming endpoint identified across Tasks 2 and 4's independent component inventories |
| No historical EBC document was rewritten to narrate the fix | Confirmed — `EBC-R1.2-WS5-01`, `-02`, `-03` are untouched; the fix is documented via an inline code comment at the call site (per the report's own Activity 6 reasoning), consistent with this project's history-preservation convention |

**Conclusion: the implementation is sound, narrowly scoped, and consistent with both the defect Task 4 identified and the architecture already on record. `OBS-4-01` is confirmed resolved.**

---

## 3. Activity 1 — Engineering Observation Register (Updated)

The consolidated register below carries forward every `OBS-3-0x` row from `EBC-R1.2-WS5-GOV-01-TIGER` **unchanged** (no reclassification), and adds the three `OBS-4-0x` observations Task 4 raised, with `OBS-4-01` updated to **Resolved**.

| Observation ID | Original Severity | Current Status | Resolution Reference | Reviewer | Notes |
|---|---|---|---|---|---|
| OBS-3-01 | Minor | Accepted (open) | — | Tiger (`GOV-01`) | Unchanged from `EBC-R1.2-WS5-GOV-01-TIGER` — carried forward as `TD-R1.3-005` |
| OBS-3-02 | Minor | Accepted (open) | — | Tiger (`GOV-01`) | Unchanged — carried forward as `TD-R1.3-003` |
| OBS-3-03 | Minor | Accepted (open) | — | Tiger (`GOV-01`) | Unchanged — carried forward as `TD-R1.3-004` (jointly with Task 2 Candidate 3) |
| OBS-3-04 | Major | Deferred | — | Tiger (`GOV-01`) | Unchanged — carried forward as `TD-R1.3-001` |
| OBS-3-05 | Major | Deferred | — | Tiger (`GOV-01`) | Unchanged — carried forward as `TD-R1.3-002` |
| OBS-4-01 | **Blocker** | **Resolved** | `EBC-R1.2-WS5-IMP-01-RAD` (25-Aug-2026) | Tiger (this document, §2) | Root cause: `POST /leads` consumed the OTP verification token using the bare-digit `mobileNumber` field instead of `mobileE164`, against a challenge table keyed exclusively on E.164 — every legitimate submission would fail once MSG91 is configured. Fixed by a single-line, single-call-site change; `tsc`/`eslint`/`verify:journey-leads` reported passing; regression impact assessed as confined to the one call site. Independently reviewed — see §2. Not represented as technical debt (resolved, not deferred). |
| OBS-4-02 | Major | Open (retained for future disposition) | — | — | No bare-10-digit pre-gate on `otp/send`/`otp/verify` before E.164 parsing, unlike `/leads`'s stricter dual-gate; not reachable via the UI, reachable only via a direct API call. Not reclassified or actioned by this update — per this card's explicit constraint against reclassifying remaining observations. |
| OBS-4-03 | Minor | Open (retained for future disposition) | — | — | Ambiguous `mobileNumber` field naming (bare vs. E.164) across two adjacent modules — a root-cause factor behind `OBS-4-01`. Not reclassified or actioned by this update. |

---

## 4. Activity 2 — WS5 Governance Notes Update

`docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 section has a new subsection, "Workstream 5 — Engineering Review 1 Governance Update (OBS-4-01 Closed)," immediately following the existing "Workstream 5 — Engineering Review 1 Governance Note (Tasks 1–3)" subsection added by `EBC-R1.2-WS5-GOV-01-TIGER`. It records: `OBS-4-01` was identified during Review 1 Task 4; a dedicated implementation EBC (`EBC-R1.2-WS5-IMP-01-RAD`) was created; the implementation was independently reviewed by Tiger (§2 above); the blocker is closed; Review 1 may now continue with Task 5. It also explicitly carries forward that `OBS-4-02`/`OBS-4-03` remain open and unreclassified. **Workstream 5's Status field, Progress field, and every other field in the Workstream 5 summary table and Section 6.5 task table are unchanged** — this activity does not alter WS5's completion status, which remains `🟡 Partially Implemented – Waiting for External DLT Dependency`.

---

## 5. Activity 3 — Engineering Decision Log Entry

Recorded as `DEC-R1.2-021` in `docs/10-Backlog/RELEASE-1.2.md` §7 (Product Decision Log) — the next available Decision ID after `DEC-R1.2-020`:

| Field | Value |
|---|---|
| Decision | Proceed with the remaining WS5 Engineering Review after successful implementation and independent verification of OBS-4-01. |
| Rationale | The only functional blocker identified during Review 1 has been resolved and independently verified. Remaining observations do not prevent continuation of the engineering review. |
| Outcome | `OBS-4-01` closed. Review 1 resumed. Remaining observations (`OBS-4-02`, `OBS-4-03`) retained for future disposition. |
| Status | Approved |

---

## 6. Activity 4 — Release 1.3 Technical Debt Review

Confirmed against `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9 (current version, before this task's edit):

- **`TD-R1.3-001` through `TD-R1.3-005` remain valid, unchanged, and correctly sourced** to `OBS-3-04`, `OBS-3-05`, `OBS-3-02`, `OBS-3-03`, and `OBS-3-01` respectively — none of them concerns `OBS-4-01`, and none required amendment.
- **`OBS-4-01` is not represented as technical debt** — it was implemented and independently verified as resolved (§2–§3 above), not deferred; adding a backlog item for it would misrepresent a closed defect as outstanding work.
- **No duplicate backlog item exists** — a review of the existing five items confirms none references `OBS-4-01`, the token-consumption call site, or the E.164/bare-digit mismatch.
- **A documentation-only improvement was judged valuable and added**: `TD-R1.3-006`, "Document Canonical Mobile Number Representation (E.164)," exactly as specified by this card. Before adding it, a check for an existing equivalent reference was performed — `EBC-R1.2-WS5-IMP-01-RAD` §6 itself explicitly found none exists ("the repository currently has no single canonical 'OTP mobile-number representation convention' reference document... only in scattered comments and in this fix") and recommended this exact item rather than performing it unilaterally. No cross-reference-instead-of-create path applied, since no equivalent document was found.
- `OBS-4-02` and `OBS-4-03` were **not** converted to technical debt items by this activity — the card's Activity 4 scope names only `OBS-4-01`'s disposition and the one new item above; converting the two open observations into backlog items is left for a future, separately-scoped activity, consistent with "no reclassification of remaining observations."

---

## 7. Activity 5 — Cross-Reference Validation

```
OBS-4-01
   ↓ raised by
EBC-R1.2-WS5-REV1-04-RAD (§5, §9 — Blocker)
   ↓ resolved by
EBC-R1.2-WS5-IMP-01-RAD (§3 — fix; §5 — verification)
   ↓ ratified by
Decision Log — DEC-R1.2-021 (docs/10-Backlog/RELEASE-1.2.md §7)
   ↓ recorded in
Observation Register — this document, §3 (OBS-4-01: Resolved)
```

| Link | Confirmed |
|---|---|
| `OBS-4-01` → `EBC-R1.2-WS5-REV1-04-RAD` | Yes — the observation originates in, and is fully detailed by, that document's §5/§9 |
| `EBC-R1.2-WS5-REV1-04-RAD` → `EBC-R1.2-WS5-IMP-01-RAD` | Yes — the implementation EBC's §0.1/§1 explicitly reviews and traces from the Task 4 findings |
| `EBC-R1.2-WS5-IMP-01-RAD` → Decision Log | Yes — `DEC-R1.2-021` names both the observation and the implementation EBC by ID |
| Decision Log → Observation Register | Yes — `DEC-R1.2-021`'s Outcome cross-references this document; this document's §3 cross-references `DEC-R1.2-021` |
| WS5 Governance Notes (`RELEASE-1.2.md`) → all of the above | Yes — the new subsection (§4 above) names `EBC-R1.2-WS5-REV1-04-RAD`, `EBC-R1.2-WS5-IMP-01-RAD`, `DEC-R1.2-021`, and this document |
| Release 1.3 Backlog → this closure | Yes — `RELEASE-1.3-BACKLOG.md` §9's introduction and `TD-R1.3-006`'s Source column both cite the same chain |

No duplicate observation or decision ID was introduced; no existing ID was reused or reassigned.

---

## 8. Expected Deliverables — Cross-Reference

| # | Deliverable | Section(s) |
|---|---|---|
| 1 | Updated Observation Register | §3 |
| 2 | Updated WS5 Governance Notes | §4, `RELEASE-1.2.md`'s new WS5 subsection |
| 3 | Updated Decision Log | §5, `DEC-R1.2-021` |
| 4 | Release 1.3 Technical Debt validation (and `TD-R1.3-006`) | §6, `RELEASE-1.3-BACKLOG.md` §9 |
| 5 | Cross-reference verification summary | §7 |

## 9. Acceptance Criteria

| Criterion | Status |
|---|---|
| `OBS-4-01` is formally marked as resolved | Met — §3 |
| Governance documentation reflects the implementation outcome | Met — §4, §5 |
| Traceability is maintained across all related artifacts | Met — §7 |
| No duplicate technical debt items have been introduced | Met — §6 |
| No engineering or configuration files have been modified | Met — only the two named `docs/10-Backlog/` files and this document were changed by this task |

---

## 10. Out of Scope / Not Performed

No application code, configuration, or implementation file was created, modified, or deleted by this task (the `leads/route.ts` fix was performed and verified under the separate, already-completed `EBC-R1.2-WS5-IMP-01-RAD`). No branch was created or switched. No commits or pushes were made. `OBS-4-02` and `OBS-4-03` were not reclassified, resolved, or converted to backlog items — they remain open, exactly as Task 4 left them. `EBC-R1.2-WS5-GOV-01-TIGER` was not edited or rewritten. No Release 1.2 or Release 1.3 planning decision beyond the two explicitly named above (`DEC-R1.2-021`, `TD-R1.3-006`) was changed.

---

## 11. Success Criteria (per this card)

- **`OBS-4-01` is formally closed across all governance documentation.** Yes — §3, §4, §5.
- **The engineering review and governance records remain synchronized.** Yes — §2 (independent review), §7 (cross-reference validation).
- **Release 1.3 technical debt contains only outstanding engineering improvements.** Yes — `OBS-4-01` is explicitly excluded (§6); `TD-R1.3-001`–`006` are all genuinely outstanding, unresolved items.
- **WS5 Review 1 is ready to continue with Task 5 — Validate OTP Generation — without outstanding governance actions.** Yes, on this observation's terms; `OBS-4-02`/`OBS-4-03` remain open but are not blocking (Task 4's own Overall Recommendation stated neither blocks proceeding once `OBS-4-01` is fixed).

---

*Prepared by Tiger (Delivery Manager) as a documentation-only governance synchronisation, per `EBC-R1.2-WS5-GOV-02-TIGER`. No repository code, configuration, or implementation files were created, modified, or deleted in producing this document.*
