# EBC-R1.2-WS5-GOV-01-TIGER — WS5 Engineering Review Governance Synchronization

```text
Document Type : Project Governance & Documentation Synchronization (documentation only — no
                application code, configuration, or implementation file was modified)
EBC ID        : EBC-R1.2-WS5-GOV-01-TIGER
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
| HEAD | `77d3a91` — "feat(ws5): complete Journey Passport OTP verification flow" — unchanged by this activity |
| Working tree | Same pre-existing ~38 changed/untracked entries carried across every WS5/WS6 governance check this thread (unrelated Workstream 6 destination/geo-validation work); not touched here |
| Files modified by this task | `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5 section + Decision Log only), `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (new §9 only), and this document |

## 0.1 Documents Reviewed

- `EBC-R1.2-WS5-REV1-01-RAD` — Engineering Flow Validation, Task 1 (Understand the Flow)
- `EBC-R1.2-WS5-REV1-02-RAD` — Engineering Flow Validation, Task 2 (Identify All Components)
- `EBC-R1.2-WS5-REV1-03-RAD` — Engineering Flow Validation, Task 3 (Validate Journey Passport Entry) — the source of every observation synchronised below
- `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (current version, prior to this task's Activity 2 edit)
- `docs/10-Backlog/RELEASE-1.2.md` (current version, prior to this task's Activity 3 edit)

---

## 1. Purpose

This document synchronises Release governance with the decisions taken during WS5 Engineering Review 1 (Tasks 1–3), so that accepted observations, deferred engineering improvements, and technical debt are formally captured and are not lost during the remaining engineering review activities (Task 4 onward). No application code, configuration, or implementation file is modified by this activity.

---

## 2. Activity 1 — Engineering Observation Register

Every engineering observation raised during Tasks 1–3 is recorded below, using the same observation IDs Task 3 itself assigned (`OBS-3-01`–`OBS-3-05`) rather than a new parallel numbering scheme — preserving traceability and avoiding the duplicate-observation risk this task's own Success Criteria warns against. Task 1 and Task 2 raised discovery-level candidates (Task 1 §8 items 1–2; Task 2 §12 items 1–10) but, per each task's own scope, did not classify or register them as findings — that classification is Task 3's role, and its register below is the complete, authoritative set arising from Review 1.

| Observation ID | Observation | Source | Status |
|---|---|---|---|
| OBS-3-01 | Journey Passport closure-screen re-entry of the traveller name uses a weaker validation check (length only) than the wizard's `hasValidName` (length + Unicode-letter presence) — a validation-consistency gap across Journey Passport screens. No invalid name can reach a stored lead (the server independently re-validates), but an invalid name can trigger a real, costly OTP send before being caught. | Task 3 | Accepted |
| OBS-3-02 | Mobile-digit-stripping/normalisation logic is independently reimplemented in three places (`useJourneyPassport.ts`, `JourneyPassport.tsx`'s field `onChange`, `requestOtp()`) instead of reusing the existing `normalizeJourneyMobile` export — duplicate mobile normalization logic. No functional issue today; a maintenance risk if the rule ever changes. | Task 3 | Accepted |
| OBS-3-03 | A specific, server-coded OTP send failure (e.g. `invalid_mobile_number`) is shown to the traveller as the same generic failure message used for network/provider errors, rather than the more actionable "please check your mobile number" copy already available client-side. Low-likelihood, low-severity. | Task 3 | Accepted |
| OBS-3-04 | `JourneyPassport.tsx` (≈400 lines) owns wizard navigation, closure-screen animation, the contact-details sub-form, and the entire OTP sub-flow (send/verify/resend/edit-number/countdown) with no dedicated OTP component/hook boundary — `EBC-R1.2-WS5-01` §9 had illustrated a possible `OtpVerification.tsx`/`useJourneyPassportOtp.ts` split that was not built. No functional defect; raises change risk/cost for future work on this flow. | Task 3 | Deferred |
| OBS-3-05 | No `verify:*` automated regression/verification script or test covers `journey-passport-otp/*`, `useJourneyPassport.ts`, `entry-context.ts`, or the `journeyMoments[].validate` functions — unlike sibling modules (`verify:journey-leads`, `verify:getaway-description`). OTP is the production-gating security control for this workstream (`DEC-R1.2-006`); regressions currently rely entirely on manual QA. | Task 3 | Deferred |

**Related context, not independently registered here:** Task 2's own Candidate Investigation List (§12, item 3) separately flagged that `processJourneyPassportOtpSend`'s catch block collapses every SMS-provider failure mode (network failure, HTTP 429, non-2xx rejection) into the same `smsStatus: "not-configured"` outcome as a genuinely unconfigured provider. Task 3 did not re-register this as its own `OBS-3-xx` entry, so it is not renumbered or duplicated here — it is instead carried into the Technical Debt Register below (Activity 2, `TD-R1.3-004`) alongside `OBS-3-03`, since both describe the same underlying gap (OTP-adjacent error classification) at two different layers (client-facing vs. service-layer).

No Blocker-severity or additional Major-severity findings exist beyond `OBS-3-04`/`OBS-3-05` — confirmed against Task 3 §11's Severity Summary (0 Blocker; 2 Major; 3 Minor).

---

## 3. Activity 2 — Release 1.3 Backlog Update

`docs/10-Backlog/RELEASE-1.3-BACKLOG.md` has been updated with a new §9, "Engineering Technical Debt" (the former §9 "Governance Notes" and §10 "Recommendations" are renumbered to §10 and §11 respectively, keeping the document's fully sequential heading convention). Five items were added, each carrying forward the exact title, description, and priority this card specified, plus a `Source` column cross-referencing the originating observation(s):

| ID | Title | Priority | Source (Observation) |
|---|---|---|---|
| TD-R1.3-001 | Refactor Journey Passport into Modular Components | High | `OBS-3-04` |
| TD-R1.3-002 | Automated Regression Suite for Journey Passport & OTP | High | `OBS-3-05` |
| TD-R1.3-003 | Centralize Mobile Number Normalization | Medium | `OBS-3-02` |
| TD-R1.3-004 | Improve OTP Provider Error Classification | Medium | `OBS-3-03` and Task 2 Candidate 3 |
| TD-R1.3-005 | Standardize Journey Passport Validation Rules | Low | `OBS-3-01` |

Full descriptions are recorded in `RELEASE-1.3-BACKLOG.md` §9 itself, not duplicated here, to avoid two documents silently drifting apart on the same text. `RELEASE-1.3-BACKLOG.md`'s own Document Change History (v1.1) records this update and cross-references this EBC.

---

## 4. Activity 3 — WS5 Tracker Update

`docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 section has a new subsection, "Workstream 5 — Engineering Review 1 Governance Note (Tasks 1–3)," immediately following the existing "Workstream 5 — Governance Note (Tiger)" subsection. It records: Tasks 1–3 completed; no blockers identified; three Minor Observations accepted; two engineering technical debt items deferred to Release 1.3; production readiness unaffected. **Workstream 5's Status field, Progress field, and every other field in the Workstream 5 summary table and Section 6.5 task table are unchanged** — this activity does not alter WS5's completion status, which remains `🟡 Partially Implemented – Waiting for External DLT Dependency`.

---

## 5. Activity 4 — Engineering Decision Log Entry

Recorded as `DEC-R1.2-020` in `docs/10-Backlog/RELEASE-1.2.md` §7 (Product Decision Log):

| Field | Value |
|---|---|
| Decision | Proceed with remaining WS5 engineering review activities without implementing the accepted technical debt items. |
| Rationale | The observations affect engineering maintainability and future quality but do not impact current production readiness or functional correctness. |
| Outcome | Technical debt deferred to Release 1.3 (`TD-R1.3-001`–`TD-R1.3-005`). |
| Status | Approved |

---

## 6. Activity 5 — Cross-Reference Validation

| Link | Confirmed |
|---|---|
| Release 1.3 backlog references WS5 Review 1 | Yes — `RELEASE-1.3-BACKLOG.md` §9's introductory paragraph cites `EBC-R1.2-WS5-REV1-01/02/03-RAD` and `DEC-R1.2-020` by name; each `TD-R1.3-0xx` row cites its source observation |
| Engineering Observation Register references Task 3 | Yes — every row in Activity 1's table above carries `Task 3` as its Source, matching the register Task 3 itself produced |
| WS5 tracker references the governance decision | Yes — the new WS5 tracker subsection (Activity 3) names `DEC-R1.2-020` and this EBC; `DEC-R1.2-020` itself (Activity 4) cross-references `RELEASE-1.3-BACKLOG.md` §9 and this EBC |
| This document references both | Yes — §2 (Observation Register), §3 (Backlog cross-reference), §5 (Decision Log entry) all point to the same five items via consistent IDs (`OBS-3-0x` ↔ `TD-R1.3-00x` ↔ `DEC-R1.2-020`) |

No duplicate observation IDs were introduced at any point in this synchronisation — Tasks 1/2's discovery-level candidates were cross-referenced, not re-registered, and Task 3's own `OBS-3-0x` numbering is used unchanged throughout.

---

## 7. Acceptance Criteria

| Criterion | Status |
|---|---|
| All engineering observations from Tasks 1–3 have been recorded | Met — §2 |
| Technical debt has been added to the Release 1.3 backlog | Met — §3, `RELEASE-1.3-BACKLOG.md` §9 |
| Governance documentation reflects the agreed decisions | Met — §4, §5, `DEC-R1.2-020` |
| Traceability exists between the engineering review and backlog planning | Met — §6 |
| No implementation files have been modified | Met — only the two named `docs/10-Backlog/` files and this document were changed |
| No Release 1.2 scope has changed | Met — no task wording, acceptance criteria, owner, dependency, or WS5 completion status was altered; only a new governance subsection and a new Decision Log row were added |

---

## 8. Out of Scope / Not Performed

No application code, configuration, or implementation file was created, modified, or deleted. No branch was created or switched. No commits or pushes were made. No Product, Architecture, Engineering, or QA decision already on record was reopened. No Release 1.3 item beyond the five technical debt entries explicitly listed above was introduced. No implementation planning (sequencing, estimates, scheduling within Release 1.3) was performed — that remains a future, separately-scoped activity once Release 1.3 is formally opened. WS5 Engineering Review Task 4 onward is unaffected and may proceed against the baseline this document establishes.

---

*Prepared by Tiger (Delivery Manager) as a documentation-only governance synchronisation, per `EBC-R1.2-WS5-GOV-01-TIGER`. No repository code, configuration, or implementation files were created, modified, or deleted in producing this document.*
