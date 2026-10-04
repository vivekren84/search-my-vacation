# EBC-R1.3-WS13-021 — Phase 1 Engineering Implementation Authorisation

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | Engineering Baseline Confirmation (implementation authorisation) |
| Prepared by | Tiger — Delivery Manager |
| Decision authority | Vivek — Product Owner |
| Date | 4 October 2026 |
| Decision record | `DEC-R1.3-026` (`docs/10-Backlog/RELEASE-1.3.md` §7) |
| Engineering baseline (frozen) | `EBC-R1.3-WS13-020-RAD-Phase-1-Engineering-Execution-Plan.md` **Revision 2**, with `EBC-R1.3-WS13-020A` (Archie) and `EBC-R1.3-WS13-020B` (Sophie) |
| Repository baseline | `feature/r1.3-ws13-journey-workspace` at `d533a95` before this governance commit |
| Status | ✅ **Implementation authorised — Milestone A may begin** |

---

## 1. Purpose

Formally authorise engineering implementation of Release 1.3 — WS13 — Phase 1. Confirm that the governance, planning, architecture, UX and engineering prerequisites are complete. Implementation then proceeds in accordance with the approved Engineering Execution Plan.

## 2. Background

Completed:

| Activity | Record |
|---|---|
| Phase 0 Delivery Closure | `EBC-R1.3-WS13-018`, `DEC-R1.3-024` |
| Phase 1 Kick-off and Engineering Readiness Review | `EBC-R1.3-WS13-019`, `DEC-R1.3-025` |
| Engineering Execution Plan | `EBC-R1.3-WS13-020` (Rad), Revision 1 (3-Oct) → Revision 2 (4-Oct) |
| Architecture review of M11 | `EBC-R1.3-WS13-020A` (Archie) — approved with conditions AC-1…AC-9 |
| UX review | `EBC-R1.3-WS13-020B` (Sophie) — S-1…S-6 confirmed with C-01…C-14 |
| Product Owner review and approval | 4-Oct-2026: Decisions 1–8; Revision 2 approved |

## 3. Inputs Reviewed

Phase 1 Product Baseline (`WS13-001` Rev 3) · UX Baseline Rev 4a (`WS13-002`) · Architecture Baseline (AD-WS13-001…007, `DEC-R1.3-020`) · `EBC-R1.3-WS13-019` · `EBC-R1.3-WS13-020` Rev 2 · `EBC-R1.3-WS13-020A` · `EBC-R1.3-WS13-020B` · Product Owner Decisions 1–8 · Release Tracker · Feature Register · Technical Debt Register · Governance Backlog.

## 4. Governance Confirmation

| Confirmation | Status | Evidence |
|---|---|---|
| Product Baseline remains approved | ✅ | `WS13-001` Rev 3; no change request |
| UX Baseline remains approved | ✅ | Rev 4a unchanged by `020B` ("no redesign … no Product rule changed") |
| Architecture Baseline remains approved | ✅ | `020A`: "No architecture decision changes. No new AD is needed." No schema change, dependency or environment variable |
| Engineering Execution Plan Revision 2 approved | ✅ | Product Owner, 4-Oct-2026 |
| Architecture review conditions accepted | ✅ | AC-1…AC-9 incorporated in plan Rev 2 §9, §10, §12.2 |
| UX review conditions accepted | ✅ | C-01…C-14 incorporated in plan Rev 2 §4.2, §8, §11, §14.7 |
| Product Owner decisions incorporated | ✅ | Plan Rev 2 §12.1 |
| Engineering Baseline frozen | ✅ | §5 below |

## 5. Engineering Baseline Freeze

**Engineering Execution Plan Revision 2** (with `020A` and `020B`) is the approved Engineering Baseline for Phase 1. Implementation proceeds in accordance with it. No engineering design change is introduced without governance approval.

Approval of Revision 2 also confirms the defaults listed in plan §12.3, because no change to them was made:

| ID | Default confirmed |
|---|---|
| `OD-R1.3-7` | Option A: owner kept and shown as "Account deactivated"; Administrators reassign; pickers active-only; AL-16 with the Phase 3 alerts |
| WS13-P1-H | Journey screens follow UX §9.3; Journey Planning screens unchanged; JP part to backlog (BP-P1-02) |
| WS13-P1-I | One neutral refusal message plus session sign-out |
| ND-6 | Terminal Journeys reached by direct link, notification or planning record until JW-11 (Phase 3) |
| ND-7 | IN-03/IN-04 to the owner only when the caller is not the owner |
| ND-8 | No Service Category change on a terminal Journey |
| ND-12 | Deactivation-in-RLS gap logged as TD-WS13-006, routed to the RLS hardening card before Phase 3; not in M11 |
| AR-F6 | Cancellation-task assignee falls back to the caller when the owner is deactivated; Arjun confirms before Phase 2 |

## 6. Product Owner Decisions Incorporated

| # | Decision (4-Oct-2026) |
|---|---|
| 1 | Two engineering milestones: **A** (profiling baseline, M11 with local database tests, service and API layer, engineering validation) and **B** (screens, carry-forward fixes, integration and end-to-end engineering verification) |
| 2 | User Administration (TL-06) excluded from Phase 1 |
| 3 | All authorised Workspace Users may view the team's Journey list; ownership governs every change |
| 4 | Readiness workflow exposed but not enforced in Phase 1 (templates are empty until Phase 2 content); no bypass flag |
| 5 | Legacy Journey adoption derives missing nights from the travel dates and records the source in History |
| 6 | Deferred functionality stays deferred: vendor-cancellation (Phase 2) and Replacement (Phase 4) scenarios outside Phase 1 QA; supporting code tested locally only |
| 7 | No genuine operational records modified while Preview and Production share a database; legacy adoption only on approved test records, otherwise deferred |
| 8 | Measure first, optimise second; a region change is a separate architecture decision |

## 7. Outstanding Conditions (active during implementation; none prevents implementation)

| # | Condition | Plan reference |
|---|---|---|
| C-1 | Deployment Runbook (Governance Backlog §2.10) approved before Migration M11 is applied to the shared database | G-1, IC-3 |
| C-2 | Archie reviews and approves the final M11 SQL and the local test evidence before deployment | AC-9, IC-2 |
| C-3 | QA Playbook (Governance Backlog §2.11) approved before Phase 1 QA begins | G-2, IC-4 |
| C-4 | All shared-database testing uses approved test records only (`QA-WS13-P1-*`). The Product Owner runs query B-1 (plan Annex B) before the QA handover to confirm whether any legacy Journey is a test record usable for adoption QA (IC-5). | Decision 7, IC-5 |

*These C-numbers belong to this card. They are distinct from the `DEC-R1.3-025` conditions, all of which are now closed or carried forward here.*

## 8. Technical Debt

**TD-WS13-006 — Deactivation not enforced in RLS read policies** (Security, Medium; Archie AR-F1). Target: RLS hardening card, together with TD-WS12-004/-005, before Phase 3. *Disclosure:* the card text said this item "has been formally recorded"; at the time of review it was not yet in `TECH-DEBT.md`. It is logged by this synchronisation (`TECH-DEBT.md` v1.5).

No additional Phase 1 engineering scope is introduced.

## 9. Implementation Authorisation

Governance activities are complete. Engineering planning is complete. The engineering baseline is frozen. **Engineering implementation may commence, beginning with Milestone A.**

## 10. Milestone A Authorisation

Authorised:

- baseline response-time measurement (WP-1.0);
- local implementation of Migration M11 (WP-1.1);
- local validation of every database function: success path, every error code, RLS and grant checks;
- service-layer implementation (WP-1.2);
- API implementation (WP-1.2);
- engineering testing (lint, type-check, build, `verify:*`);
- SQL review by Archie (C-2).

**No shared-database migration occurs until Checkpoint 4.** Milestone B (screens) waits for Checkpoint 1.

## 11. Engineering Checkpoints (mandatory)

| # | Checkpoint | Owner | Unblocks |
|---|---|---|---|
| 1 | Milestone A Engineering Review | Rad → Tiger | Milestone B |
| 2 | SQL Architecture Review | Archie | Checkpoint 4 |
| 3 | Deployment Runbook Approval | Tiger, Rad → Vivek | Checkpoint 4 |
| 4 | Migration Authorisation (M11 on the shared database) | Vivek | Plan E4 |
| 5 | Phase 1 QA Handover (after the QA Playbook is approved) | Tiger → Keerthi | Phase 1 QA |

Engineering does not bypass these checkpoints.

## 12. Governance Notes from Tiger's Review

| # | Note | Action |
|---|---|---|
| N-1 | `EBC-R1.3-WS13-019` §12 said Ready to Travel is "not reachable end-to-end" until Phase 2. With empty templates it is reachable in Phase 1 (OBS-P1-01) and is now governed by Decision 4. | Note added to `WS13-019` (Rev 3) |
| N-2 | The Phase 0 report recorded the ED-02 text differently from what shipped. The shipped text, confirmed by Sophie (S-2), is "Couldn't load Service Categories. Reload the page to try again." (OBS-P1-06) | Shipped text recorded in the carry-forward register (WS13-P1-C) |
| N-3 | Measured fact (plan §1): Supabase runs in Seoul (ap-northeast-2), Vercel functions in Washington DC (`iad1`), users in India. This supports the latency hypothesis; Decision 8 applies. | RISK-R1.3-006 updated |
| N-4 | `OBS-P1-04` (`workspace_audit_log` and `workspace_tasks` read policies open to any authenticated session) belongs on the same RLS hardening card | Recorded with TD-WS13-006 |
| N-5 | `OBS-P1-02` (`web/.vercel/project.json` points at a Vercel project that no longer exists) affects only the local CLI | Product Owner may run `vercel link` if the CLI is ever used |

## 13. Product Owner Confirmation

The Product Owner confirms that:

- the Engineering Baseline is accepted;
- the implementation approach remains aligned with the approved Product, UX and Architecture baselines;
- implementation may commence in accordance with the approved Engineering Execution Plan.

## 14. Delivery Outcome

| Activity | Status |
|---|---|
| Product Baseline | ✅ Complete |
| UX Baseline | ✅ Complete |
| Architecture Baseline | ✅ Complete |
| Engineering Readiness | ✅ Complete |
| Engineering Planning | ✅ Complete |
| Architecture Review | ✅ Complete |
| UX Review | ✅ Complete |
| Product Owner Approval | ✅ Complete |
| Engineering Baseline Frozen | ✅ Complete |
| Engineering Implementation | ✅ Authorised |

## 15. Governance Synchronisation (4-Oct-2026)

| Document | Change |
|---|---|
| `docs/10-Backlog/RELEASE-1.3.md` → v1.27 | `DEC-R1.3-026`; top status and WS13 row; decision count 25→26; §6 (TL-06 out of Phase 1, WS13-P1-B/H/I decided, WS13-P1-C text corrected, disposition reference to plan §11); §8 `OD-R1.3-7` resolved; §10 RISK-R1.3-006 updated; §12 Phase 1 gates and checkpoints |
| `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` → v1.15 | `FEAT-R1.3-013`: Phase 1 implementation authorised; `DEC-R1.3-026` referenced |
| `docs/10-Backlog/TECH-DEBT.md` → v1.5 | TD-WS13-006 added; header count 10→11 |
| `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` | §2.0: §2.10 and §2.11 linked to Checkpoint 3 and Checkpoint 5 |
| `docs/09-Development/EBC-R1.3-WS13-019-…` | Rev 3 note (N-1) |
| `docs/09-Development/EBC-R1.3-WS13-020-RAD-…`, `-020A-ARCHIE-…`, `-020B-SOPHIE-…` | Committed unchanged, as the frozen baseline |
| This document | New |

Committed as a single governance milestone (card §15).

## 16. Next Step

1. Rad begins Milestone A with WP-1.0 (baseline measurement), then WP-1.1 (M11 written and proven against a **local** database).
2. Tiger and Rad draft the Deployment Runbook (C-1, Checkpoint 3) in parallel with Milestone A.
3. Milestone A is presented at Checkpoint 1 before any shared-database deployment.

---

## Delivery Manager Closing Statement

Release 1.3 — Workstream 13 has completed every governance activity required to move from planning into implementation. The Engineering Baseline has been approved and frozen. Engineering, Architecture, UX and the Product Owner have validated the implementation strategy. Risks, dependencies and technical debt are identified and managed.

I formally authorise the commencement of Phase 1 Engineering Implementation. Milestone A may begin following governance synchronisation and repository update.

## Tiger's Handover to Rad

Rad,

Planning is complete. Governance is complete. The engineering baseline is approved and frozen. Responsibility for Phase 1 now passes to Engineering.

Your first objective is Milestone A:

1. Establish the current performance baseline.
2. Develop and validate Migration M11 against a local database.
3. Implement the service and API layer.
4. Complete engineering validation.
5. Present Milestone A for review (Checkpoint 1) before any shared-database deployment.

Build deliberately, validate thoroughly, and keep the engineering discipline that brought us here.

— Tiger, Delivery Manager, on behalf of Team Satvi

*Decision by Vivek, Product Owner.*
