# EBC-R1.3-WS13-006 — Phase 0 Deployment Closure and Governance Synchronisation v1.0

| Document Information | |
|---|---|
| Workstream | WS13 — Journey Workspace |
| Phase | Phase 0 — Foundation & Journey Planning conversion v2 |
| Persona | Tiger — Programme and Delivery Lead |
| Product Owner | Vivek |
| Date | 30 September 2026 |
| Status | **Complete — governance synchronised; Phase 0 Ready for QA** |
| Type | Documentation and governance only — no code, UX, product or architecture change |
| Branch | `feature/r1.3-ws13-journey-workspace` at `cfd623e` (working tree clean at start) |
| Decision recorded | `DEC-R1.3-021` |

---

## 1. Delivery Summary

| | |
|---|---|
| **Objectives achieved** | Phase 0 engineering delivered (M01–M10, conversion v2, JP Service Category and Confirm dialog); migrations applied to the shared database; Preview on conversion v2 code; smoke test successful. |
| **Deployment outcome** | **Successful** — reported by the Product Owner, 30-Sep-2026. Current Preview: `dpl_5831fDobpqs6WNSpjdcLNVM9Cr2j`, READY, built from `cfd623e` (28-Sep-2026 19:17 IST), which contains the conversion v2 code (docs-only changes after `84c8904`). |
| **Programme state** | WS13 In Progress. Phase A closed. Phase 0: Engineering **Closed**, Deployment **Closed**, **Ready for QA** (Keerthi). Phase 0 overall stays open until QA → Product Owner Acceptance → Phase 0 Delivery Closure. Phase 1 not started. |
| **Risks** | RISK-R1.3-001 shared Preview/Production database (accepted); RISK-R1.3-002 unpushed local `main`; RISK-R1.3-003 fresh replay broken (TD-WS13-002); RISK-R1.3-004 backups hold personal data. All in `RELEASE-1.3.md` §10. |
| **Deferred items** | 14 carry-forward items with owner and target (`RELEASE-1.3.md` §6, WS13 register); 2 open product decisions (`OD-R1.3-6`, `OD-R1.3-7`). |
| **Recommendation** | Start Phase 0 QA (Keerthi) once the QA identities (WS13-P1-D) exist. Publish the deployment runbook (Governance Backlog §2.10) before Phase 1's first migration. |

### QA handover sequence

```
Phase 0 Deployment ✅  →  Ready for QA ✅  →  Engineering Closed ✅  →  Deployment (delivery activity) Closed ✅
                                   ↓
         Phase 0 QA (Keerthi) → Product Owner Acceptance → Phase 0 Delivery Closure → Phase 1 authorisation
```

**Terminology note:** the card's sequence ends with "Delivery Closed". To stay consistent with the phase approval lifecycle adopted in Phase A (Governance Backlog §2.8), this record closes the **deployment activity**, not Phase 0. Phase 0 Delivery Closure remains the final gate after QA and Product Owner Acceptance.

---

## 2. Deployment Record

| Step (`WS13-005-P0` §5.1) | Evidence |
|---|---|
| 1–2 Announce; freeze Confirmed decisions | Product Owner report |
| 3 Logical backup (schema, data, roles) and verification | Product Owner report. Docker was a prerequisite for `supabase db dump` |
| 4 Baseline 24/24 | Product Owner report |
| 5 Live dependency checks (ED-06) | Product Owner report; M10 drop proceeded, so no references were found |
| 6 Dry-run and apply M01–M10 | Product Owner report |
| 7 Preview | `dpl_5831fDobpqs6WNSpjdcLNVM9Cr2j` (Vercel, verified by Tiger) |
| 8 Smoke test | Product Owner report: successful |
| 9 Parity 34/34 | Product Owner report |
| 10 Resume | Product Owner report |

**Evidence gap (disclosed):** no execution log (timestamps, backup location and sizes, dry-run and `migration list` output) is committed. The Product Owner's report is taken as the record, per Project Instructions §17. A deployment record template is added to the runbook item (§2.10) so future phases file one.

---

## 3. Decisions Captured (`DEC-R1.3-021`)

| Decision | Status |
|---|---|
| Phase 0 deployment successful; Ready for QA | Recorded |
| Migration strategy: M01–M10 as one unit, dry-run first; ED-06 drop subject to dependency checks | Recorded |
| Deployment sequence: final 10 steps | Recorded |
| Freeze-before-backup policy | Recorded |
| Backup verification before apply; backup outside repository, never committed | Recorded |
| Docker prerequisite for the backup | Recorded |
| Deployment verification process: baseline, dependency checks, dry-run, parity, smoke test | Recorded |

Earlier decisions this deployment relied on (not duplicated): shared database and migration roles (`DEC-R1.3-020`), branch and deployment mapping (`DEC-R1.3-018`).

---

## 4. Documents Updated

| Document | Change | Why |
|---|---|---|
| `docs/10-Backlog/RELEASE-1.3.md` (v1.22) | `DEC-R1.3-021`; WS13 row and top status; §6 WS13 carry-forward register; §8 `OD-R1.3-6`/`-7`; §10 first four risks; §12 WS13 phase gates; change history | Activities 1, 5, 8, 9 |
| `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` | §2.0 status summary; status lines on §2.7–§2.9; new §2.10 Phase/Release Deployment Runbook | Activities 2, 7 |
| `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` (v1.12) | `FCR-028` automated deployment verification; traceability; closure log | Activity 3 |
| `docs/10-Backlog/TECH-DEBT.md` (v1.3) | `TD-WS13-001`, `TD-WS13-003`, `TD-WS12-004` (SEC-02), `TD-WS12-005` (SEC-03); target release on `TD-WS13-002`; retrospective v1.2 row; header status | Activity 4 |
| `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` (v1.10) | `FEAT-R1.3-013`: WS13 shown as In Progress (it still said "reserved only, not started"); decision references extended | **Additional document** — the release's canonical Feature Register contradicted the tracker on WS13's status |
| This document | New | Deliverable |

**Reviewed, not changed:**

| Document | Reason |
|---|---|
| `WORKSPACE-ARCHITECTURAL-DECISIONS.md` | The deployment implemented AD-WS13-001–007 as ratified. The shared-database topology is an environment decision (`DEC-R1.3-020`) with its review in §2.9, not a new AD. |
| `PRODUCT-EVOLUTION-BACKLOG.md` | No new module-scale capability arose; TL-06 user administration is WS13 Phase 1 scope. |
| `EBC-R1.3-WS13-005-P0` (Rad's report) | Its status line ("migrations PREPARED, NOT APPLIED") is correct as at its date. It is Rad's document (EP-006); the deployment outcome is recorded in `DEC-R1.3-021`. Rad may add a Revision 4 if wanted. |
| Engineering Handbook, Governance Map, Document Index | No change in principles or document types; the runbook's future home is noted in §2.10. |

---

## 5. Technical Debt Verification

| ID | Owner | Suggested release | Note |
|---|---|---|---|
| TD-WS13-001 | Rad (Archie reviews) | Release 1.4 (proposed) | Newly logged (GO-09) |
| TD-WS13-002 | Archie / Rad | Release 1.4 (proposed), before any new environment | Existing; release added |
| TD-WS13-003 | Rad | WS13 Phase 1 or Release 1.4 | New (OBS-P0-03) |
| TD-WS12-004 (SEC-02) | Archie / Rad | Security hardening card, Release 1.3 or 1.4 — PO to decide (Q-JW-02) | Newly logged (GO-09) |
| TD-WS12-005 (SEC-03) | Archie / Rad | Same card; before Phase 3 recommended | Newly logged (GO-09) |

Identifiers checked against the register: no duplicates; numbering continues each workstream's sequence. The Docker prerequisite and backup handling are operational process, not code debt, so they sit in the runbook item (§2.10), not in TECH-DEBT.

---

## 6. Review Criteria

| Criterion | Result |
|---|---|
| No Phase 0 deployment decision undocumented | Met — `DEC-R1.3-021` (§3) |
| Every accepted deferral has an owning release or phase | Met — carry-forward register and TECH-DEBT; two TD target releases are proposals for the PO to confirm |
| No duplicate backlog or TD entries | Met — runbook items in §2.10 only; environment separation in §2.9 only |
| Delivery status consistent across documents | Met — tracker (top block, §3, §5, §12), Feature Register and this record all say Phase 0 Ready for QA. Two stale tracker counts corrected (completed workstreams 3→4; approved decisions 0→21) |
| Engineering, QA, Product and Delivery artefacts synchronised | Met, with the evidence gap in §2 disclosed |

---

## 7. Product Owner Confirmations Requested (non-blocking)

1. Target releases proposed for TD-WS13-001, TD-WS13-002, TD-WS12-004/005.
2. QA identities (WS13-P1-D) before Keerthi starts.
3. Optionally, a short deployment record (date/time, backup location, parity output) to attach to §2.

No commit or push performed.

*Prepared by Tiger, Programme and Delivery Lead.*
