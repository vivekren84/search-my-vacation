# EBC-R1.3-WS13-016 — Phase 0 Governance Synchronisation & Decision Consolidation

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 0 |
| Prepared by | Vivek (Product Owner) — card · Tiger (Delivery Manager) — execution |
| Date | 1 October 2026 |
| Type | Governance synchronisation only — no engineering, product, UX, architecture or QA change |
| Branch | `feature/r1.3-ws13-journey-workspace` at `021bb55` (clean apart from the untracked QA report) |
| Status | **Complete — Phase 0 governance-complete; ready for Product Owner Acceptance** |
| Decision recorded | `DEC-R1.3-022` |

---

## A. Governance Review Summary

### Documents reviewed

| Area | Document |
|---|---|
| Engineering | `EBC-R1.3-WS13-005-P0` Phase 0 Engineering Completion Report (Rad, Rev 3) |
| QA | `EBC-R1.3-WS13-015-QA-KEERTHI-Phase-0-QA-Completion-Report.md` (PASS, 0 defects) |
| Delivery | `EBC-R1.3-WS13-006` Phase 0 Deployment Closure; Governance Backlog §2.10 (runbook); `RELEASE-1.3.md` |
| Governance | Decision Register (`RELEASE-1.3.md` §7, DEC-R1.3-001…021); `TECH-DEBT.md`; `FUTURE-CONSIDERATIONS.md`; `RELEASE-1.3-FEATURE-REGISTER.md`; `RELEASE-1.3-GOVERNANCE-BACKLOG.md` |

### Findings

1. Seven QA-phase decisions existed only in the QA report and the handover; none was in the Decision Register. → `DEC-R1.3-022`.
2. **The handover card `EBC-R1.3-WS13-015` and the D1–D3 decision texts are not in the repository or Project Knowledge.** Their content is known only through Keerthi's report (D2: Preview / localhost; D3: test data). This record uses that evidence; it does not invent D1's wording. Recommend committing the handover card.
3. **The Deployment Runbook does not exist yet.** It is Governance Backlog §2.10 (Open); `WS13-005-P0` §5 remains the procedure.
4. Phase 0 QA evidence screenshots (`QA-WS13-P0-evidence/`) are not in the repository, and Administrator-run screenshots were not retained (QA report §10).
5. Keerthi's report says AD-WS13-001…007 were "ratified DEC-R1.3-019"; the ratification is **`DEC-R1.3-020`**. A citation slip in Keerthi's document — not edited here (EP-006); Keerthi may correct it.
6. Phase 0 QA wrote test records (JRN-1005, JRN-1006, `QA-WS13-P0-*`) into the shared Production database. Removal is now a release checklist item.
7. Carry-forward item WS13-P1-D (QA identities) is satisfied.

### Recommendations

- Proceed to Product Owner Acceptance of Phase 0.
- Commit Keerthi's QA report and the `EBC-R1.3-WS13-015` handover card.
- Write the deployment runbook (§2.10) and QA playbook (§2.11) before Phase 1's first migration and first QA cycle.

---

## B. Decision Register Summary

| Topic | Action | Record | Relationship |
|---|---|---|---|
| QA authentication procedure | **New** | `DEC-R1.3-022` (1) | — |
| QA execution workflow (handover card, D-decisions, report sections) | **New** | `DEC-R1.3-022` (2) | Extends Phase A practice (Governance Backlog §2.8) |
| Preview as authoritative QA baseline | **New** | `DEC-R1.3-022` (3) | Applies `DEC-R1.3-018` deployment mapping; not an amendment |
| Localhost usage policy | **New** | `DEC-R1.3-022` (4) | — |
| QA data naming and removal (shared DB) | **New** | `DEC-R1.3-022` (5) | Consequence of `DEC-R1.3-020` (shared database); mitigates RISK-R1.3-001 |
| Replacement conversion in Phase 0 | **New** | `DEC-R1.3-022` (6) | Rad's local tests (`WS13-005-P0` §7) stand in until Phase 1 QA |
| Engineering verification vs independent QA | **New** | `DEC-R1.3-022` (7) | Consistent with Project Instructions §29 (runtime requirements need runtime evidence) |
| D1–D3 clarifications | **Consolidated** | Items (1)–(5) | D-numbers are local to the handover card; the register holds the content |
| Phase 0 QA outcome | **New** | `DEC-R1.3-022` outcome | Follows `DEC-R1.3-021` (deployment) |

**Amended:** none. **Referenced, unchanged:** `DEC-R1.3-018`, `-020`, `-021`.
**Duplicates avoided:** one decision entry rather than seven; the Preview/Production mapping is not restated as a new decision; AD ratification is not re-recorded.

---

## C. Technical Debt Summary

| Candidate | Classification | Action |
|---|---|---|
| Success toast not announced to screen readers (OBS-P0-QA-01) | **Technical debt** (Accessibility) | **Added `TD-WS13-004`** (Phase 1) |
| Session kept after authorisation refusal (OBS-P0-QA-06) | **Technical debt** (Security, Low; access is still blocked) | **Added `TD-WS13-005`** (Phase 1) |
| Display name resolution (OBS-P0-QA-05, welcome name) | Planned work — TL-01 / TL-05 | Not added; already in carry-forward |
| Toast duration / JRN reference shown nowhere | UX enhancement | Carry-forward WS13-P1-G (Sophie) |
| API wording for deactivated users (OBS-P0-QA-07) | UX / product messaging (with an account-enumeration consideration) | Carry-forward WS13-P1-I (Arjun, Sophie) |
| Non-owner sees editable controls (OBS-P0-QA-04) | Existing WS12 UX behaviour; server enforces | Carry-forward WS13-P1-H |
| Response times 5–10 s (OBS-P0-QA-02) | Engineering observation — not yet shown to be debt | Carry-forward WS13-P1-J (Rad to profile); monitoring → FCR-030 |
| Owner-required rule unreachable via UI (OBS-P0-QA-03) | Covered by engineering tests | No action (`DEC-R1.3-022` (7)) |

Register now: 10 open items, none resolved. No duplicates; numbering continues.

---

## D. Future Considerations Summary

| Candidate | Outcome | Target | Rationale |
|---|---|---|---|
| Dedicated non-production QA database | Folded into **Governance Backlog §2.9** (scope extended) | Release 1.4 planning | Same decision as Preview/Production isolation; avoids a duplicate entry |
| Preview / QA environment strategy | Folded into **§2.9** | Release 1.4 planning | As above |
| Automated credential management | **FCR-029** | Release 1.4 planning | Depends on §2.9 |
| Permanent Workspace QA users | **FCR-029** (combined) | Release 1.4 planning | One subject: QA identities |
| Response-time monitoring | **FCR-030** | Release 1.4 planning | New tooling; Phase 1 question tracked as WS13-P1-J |
| Accessibility improvements | `TD-WS13-004` (+ existing `TD-WS12-001`) | Phase 1 | Concrete gaps belong in TECH-DEBT |
| QA process improvements | **Governance Backlog §2.11** QA Execution Playbook | Before Phase 1 QA | Governance process, not a future feature |
| Release governance improvements | Release checklist item (QA data removal); §2.10 runbook unchanged | Release 1.3 readiness | Already-tracked items extended, none duplicated |

---

## E. Governance Synchronisation Summary

| Document | Version | Change |
|---|---|---|
| `docs/10-Backlog/RELEASE-1.3.md` | 1.23 | `DEC-R1.3-022`; WS13 row and top status; decision count 22; carry-forward WS13-P1-D closed, P1-F…K added; phase gates; release checklist (QA data removal); RISK-R1.3-001 mitigation |
| `docs/10-Backlog/TECH-DEBT.md` | 1.4 | `TD-WS13-004`, `TD-WS13-005`; header count |
| `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` | 1.13 | `FCR-029`, `FCR-030`; traceability; closure log |
| `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` | — | §2.0 statuses; §2.9 scope extended; new §2.11 QA Execution Playbook |
| `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` | 1.11 | WS13 status; `DEC-R1.3-022` reference |
| This document | new | — |

**Consistency check:** tracker (top block, §3, §5, §7, §12), Feature Register and this record all state: Phase 0 engineering complete, deployed, QA PASS, governance synchronised, awaiting Product Owner Acceptance. Not changed: architecture register (no architecture implication), Engineering Handbook, Rad's and Keerthi's reports (owned documents).

**Tiger confirmation:** Phase 0 governance is fully synchronised and ready for Product Owner Acceptance. Product Owner Acceptance and Phase 0 Delivery Closure are out of scope here.

No commit or push performed.

*Prepared by Tiger, Delivery Manager.*
