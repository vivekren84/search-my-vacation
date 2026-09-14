# Search My Vacation

# Release 1.3 Release Tracker

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.3 Release Tracker |
| Version | 1.9 |
| Status | **Active** — live execution and delivery-status tracker for Release 1.3 |
| Origin | Created per the Product Owner's decision on Decision Point D2, raised in `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.1's Workstream Delivery Status Log, following `R1.3-WS2-CLOSE-01` |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Live release execution tracker and delivery status for Release 1.3 — workstream status, implementation status, QA status, delivery status, release readiness, release history and overall progress. Mirrors the role `RELEASE-1.2.md` held for Release 1.2. |
| Baseline | Release 1.2 — closed 02-Sep-2026 (`RELEASE-1.2.md` §18) |
| Related | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` — scope and backlog catalogue; canonical source for what has been decided or carried forward. `docs/10-Backlog/RELEASE-1.3-WORKSTREAM-PLAN.md` — planning, sequencing and implementation strategy; canonical source for task-level decomposition (Activity 3) and scope-classification recommendations (Activity 5). `docs/10-Backlog/RELEASE-1.2.md` — Release 1.2 precedent; the structural template this document mirrors. `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` — Future Considerations Register; canonical source for items explicitly deferred during completed workstream governance reviews (see Section 9). `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` — standalone, audit-grade Feature Register (`EBC-R1.3-GOV-001`, 14-Sep-2026); **the canonical Feature Register going forward**, superseding Section 15 below (see Section 15's own superseding note). `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md` — the audit trail behind that register. `docs/09-Development/EBC-R1.3-GOV-002-TIGER-Release-1.3-Tracker-Synchronisation.md` — the synchronisation record behind this version's own updates. |
| Document Responsibility Split | Per the Product Owner's decision: `RELEASE-1.3-BACKLOG.md` = scope/backlog catalogue · `RELEASE-1.3-WORKSTREAM-PLAN.md` = planning, sequencing and implementation strategy · `RELEASE-1.3.md` (this document) = live release execution tracker and delivery status. This document does not duplicate the other two — see Sections 5 and 6 for how task-level detail is cross-referenced rather than repeated. |
| Last Updated | 14 September 2026 |

---

## Document Change History

| Version | Date | Author | EBC | Summary |
|---|---|---|---|---|
| 1.0 | 06-Sep-2026 | Tiger | R1.3-TRK-001 | Initial creation, per the Product Owner's decision on Decision Point D2 (raised in `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.1's Workstream Delivery Status Log, itself part of `R1.3-WS2-CLOSE-01`). Establishes `RELEASE-1.3.md` as the dedicated live execution/delivery tracker for Release 1.3, initialised using `RELEASE-1.2.md`'s proven structure. Populated with the ten-workstream baseline from `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.1 (Activity 2/3); records Workstream 2 — Traveller Stories as ✅ **Complete**, per `R1.3-WS2-CLOSE-01` (independently repository-verified); all other workstreams recorded Not Started. `RELEASE-1.3-WORKSTREAM-PLAN.md`'s own Activity 2 Delivery Status column and Workstream Delivery Status Log (added in its v1.1, interim) are left unchanged, per the Product Owner's explicit instruction — that document now returns to a planning-only role for future updates, this document becomes the live tracker going forward. Documentation only — no application code, configuration, schema, or Product/Architecture/Engineering work was performed, per the Product Owner's explicit scope for this activity. |
| 1.1 | 08-Sep-2026 | Tiger | EBC-R1.3-WS0-001 | Cross-referenced the newly-committed `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` (Future Considerations Register) in Section 9 and the Document Information "Related" field, distinguishing it from the existing Activity-5-sourced Future Release Candidates reference already in Section 9. No other content changed. Documentation only. |
| 1.2 | 08-Sep-2026 | Tiger | EBC-R1.3-WS0-001 | WS1 Governance Closure: updated Section 5 (Master Workstream Tracker) and the Section 3 dashboard note to record that Workstream 1's Governance Phase is formally complete, Engineering Readiness is GREEN, and the workstream transitions from Governance to Engineering Execution (implementation not yet started). No other workstream status changed; completed-workstream count unchanged (still 1 of 10 — WS2). Documentation only. |
| 1.3 | 08-Sep-2026 | Tiger | EBC-R1.3-WS1-011 | WS1 full closure (Governance + Engineering Implementation + QA, per `EBC-R1.3-WS1-007` through `WS1-010`, Final QA Recommendation PASS). Workstream 1 marked ✅ Complete throughout (Section 1 Current Status, Section 3 dashboard, Section 5 tracker); completed-workstream count updated 1→2 of 10. Section 6 Task Tracker extended with a Workstream 1 task-level entry. Engineering Readiness recorded GREEN, QA recorded PASS. Section 5's WS1 Notes column discloses that engineering implementation exists in the working tree on `feature/ebc-r1.3-ws1-007-bootstrap-generator` but has not yet been committed or pushed (explicitly confirmed across `WS1-007`–`WS1-010`) — flagged as a residual action for Rad, not implied as done by this documentation-only closure. Documentation only; no implementation code touched, per this EBC's own Out of Scope (§11). |
| 1.4 | 09-Sep-2026 | Tiger | EBC-R1.3-WS1-013 | Documentation Reconciliation Implementation, per `EBC-R1.3-WS1-012`'s Repository Artefact Reconciliation & Documentation Lineage Review. Added two retroactive entries to Section 7 (Product Decision Log): `DEC-R1.3-002` (approval to migrate the 37 outstanding testimonials, superseding the original Authentic Story Rule design) and `DEC-R1.3-003` (approval of the experience-category mapping approach). Both decisions were already implemented and shipped (`R1.3-WS2-IMP-03`, commit `1a74f57`) but had never been logged, per the gap identified in `EBC-R1.3-WS1-012` §4 (Gap 1). No other section changed. Documentation only; no implementation code touched, per this EBC's own Repository Areas scope (§4). |
| 1.5 | 09-Sep-2026 | Tiger | EBC-R1.3-RM-001 | Release 1.3 Feature Register Integration. Added new Section 15 (Feature Register), appended at the end of the document to avoid renumbering Sections 5-14, with a discoverability pointer added to Section 3. 14 entries (`FEAT-R1.3-001`-`014`, FEAT-R1.3-012 reserved/unassigned) covering all completed and planned workstreams (WS0-WS10) plus two release-level/no-workstream items: Team Member Portal and Customer Identity & Member Experience (both added as **Approved - Discovery Pending** new scope, per the Product Owner's explicit decision of 09-Sep-2026 — no Story Points, Business Value or ROI assigned) and Governance & Release Closure. WS8 (Search Behaviour) added as its own entry per the Product Owner's explicit confirmation, correcting its omission from the feature list originally supplied. Story Points, Estimated Hours and ROI left as "Not yet estimated" uniformly across all 14 entries (not only the two newly-approved features) — `RELEASE-1.3-WORKSTREAM-PLAN.md` records estimation as out of scope for every workstream at this stage, and applying it selectively would misrepresent backlog state. Card self-identified as `EBC-R1.3-WS3-001`, which collides with an existing, open specification already assigned that ID (`Product Bootstrap Workbook Definition & Extraction Strategy`, Decision Points D1-D4 still open) — recorded instead under `EBC-R1.3-RM-001`, interpreted from the Product Owner's reply `BC-R1.3-RM-001`, flagged transparently rather than silently assumed. No existing content removed or restructured; single source of truth preserved. Documentation only; no implementation code touched. |
| 1.6 | 09-Sep-2026 | Tiger | EBC-R1.3-RM-002 | Product Discovery Documentation Reconciliation. Added `DEC-R1.3-004` to Section 7 (Product Decision Log), recording the SMV Workspace Product Discovery capture now filed at `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`. Updated Section 15 Feature Register entries `FEAT-R1.3-007` and `FEAT-R1.3-013` with cross-references and a flagged naming discrepancy (the discovery content matches Team Member Portal, not Customer Identity & Member Experience, per the new document's Section 2). No new product decisions introduced beyond formalising the discovery workshop's own output; five content gaps explicitly flagged rather than invented. Documentation only. |
| 1.7 | 09-Sep-2026 | Tiger | (Product Owner decision) | Product Owner decision recorded as `DEC-R1.3-005`: renamed `FEAT-R1.3-013` from "Team Member Portal" to "SMV Workspace," advanced its Status to Discovery Captured / Product Specification Pending, and populated its Business Objective/Value from the discovery capture. Confirmed `FEAT-R1.3-007` remains fully separate — its own discovery still outstanding, no content shared with `FEAT-R1.3-013`. The five gaps in `SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §12 are confirmed as Arjun Product Specification refinement items, not a reason to reopen discovery. Documentation only. |
| 1.8 | 13-Sep-2026 | Tiger | EBC-R1.3-WS3-006 | Delivery Readiness Review of the Release 1.3 SMV Workspace Product Baseline (Specification/RTM v2.0, Product Owner Review Baseline, Governance Review, Impact Assessment, Change Log, Baseline Index — the `EBC-R1.3-WS3-002`–`WS3-CLOSURE` card sequence). Finding: baseline internally consistent and traceable; two governance gaps identified and resolved directly under Tiger's own authority rather than left open — (a) assigned workstream number **WS11** to `FEAT-R1.3-013` (SMV Workspace), ending its prior collision with this tracker's own, unrelated Workstream 3 (Premium Homepage Experience); (b) logged the previously-missing mandatory Future Considerations Register closure-review assessment (`FUTURE-CONSIDERATIONS.md` §5.1), outcome "None identified." Added `DEC-R1.3-006` (§7), a new WS11 row (§5), a disambiguating note on the existing WS3 row (§5), and updated Section 3 and Section 15 accordingly. No Product Specification, RTM, or other WS3 baseline document was reopened or edited. Full detail: `docs/09-Development/EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md`. Documentation only. |
| 1.9 | 14-Sep-2026 | Tiger | EBC-R1.3-GOV-002 | Release 1.3 Tracker Synchronisation. Establishes `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` (created under `EBC-R1.3-GOV-001`) as the canonical Feature Register going forward — Section 15 below is marked superseded, not deleted or rewritten, per this project's supersede-not-erase convention. No Feature added, removed, reprioritised, or renamed; no Product Decision, Product Specification, RTM, Release Backlog, or completed EBC modified; no historical evidence altered. Cross-reference updates only: Document Information "Related" field (this table), Section 3's "See also" pointer, a superseding banner at the top of Section 15, a cross-reference note on the Section 5 WS3 row confirming it is the same initiative as `FEAT-R1.3-003` in the new register, and a cross-reference annotation on the still-open `OD-R1.3-4` (Section 8) pointing to `EBC-R1.3-GOV-001` Finding SD-2's supporting evidence. Full synchronisation validation, traceability validation, cross-reference validation and executive summary: `docs/09-Development/EBC-R1.3-GOV-002-TIGER-Release-1.3-Tracker-Synchronisation.md`. Documentation only. |

---

This document is a **living document**, mirroring `RELEASE-1.2.md`'s own convention. It is maintained continuously throughout Release 1.3 — from idea through discussion, approval, implementation, QA, release and retrospective — so that no product decision is lost to chat history.

---

# 1. Release Overview

## Current Status

**Planning baseline established; execution underway.** `EBC-R1.3-001` (Tiger) reviewed the full Release 1.3 backlog and proposed a ten-workstream structure, confirmed against the evidence in `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.0. Release-level planning and governance (`EBC-R1.3-001`; the Future Considerations Register established per `EBC-R1.3-WS0-001`, `docs/10-Backlog/FUTURE-CONSIDERATIONS.md`) is complete. Two of ten workstreams are now formally closed: Workstream 2 (Traveller Stories), executed end-to-end — Product, Business Analysis, Architecture, Engineering and QA all complete (`R1.3-WS2-CLOSE-01`, independently repository-verified: see Section 5) — and Workstream 1 (Destination Intelligence Evolution), whose full lifecycle — Product Governance, Architecture Governance, Engineering Design, Engineering Implementation, Independent QA Validation, Engineering Remediation, Focused QA Re-validation — is complete with a Final QA Recommendation of PASS (`EBC-R1.3-WS1-010`; closure synchronised per `EBC-R1.3-WS1-011`; see Section 5). All other eight workstreams remain Not Started.

**Note on Release Vision / Goals / Business Objectives / Success Criteria:** unlike `RELEASE-1.2.md`, which had these formally defined at its own creation (`R1.2-001`), Release 1.3 does not yet have a Product-Owner-ratified statement of release-level vision, goals or success criteria — `RELEASE-1.3-BACKLOG.md`'s own Document Information still describes itself as a "pre-execution backlog." Rather than inventing these here (outside this activity's explicit governance-only scope), this section is left as a placeholder pending a dedicated Arjun/Tiger product-framing pass, cross-referenced at `RELEASE-1.3-WORKSTREAM-PLAN.md`'s own "Decisions Required from the Product Owner" list (items 1–3).

## Planned Release Sequence

```
Idea
 ↓
Discussion
 ↓
Approval
 ↓
Implementation
 ↓
QA
 ↓
Release
 ↓
Retrospective
```

Each workstream and task in this document moves through this sequence independently — see Section 14 for status definitions.

## Release Owner

Vivek (Product Owner / Business Owner) — final decision and release authority.

Tiger (Programme & Delivery Lead) — owns this document and consolidates delivery status.

## Last Updated

08 September 2026

## Document Version

1.3

---

# 2. Guiding Principles

Carried forward unchanged from the permanent Search My Vacation project principles (Project Instructions §1), which govern every release, not only Release 1.2:

- Every traveller is unique. Every journey should be too.
- More Than a Trip. It's an Experience.
- Build trust before selling.
- Offer honest guidance rather than pressure.
- Present personalised experiences rather than generic packages.
- Help travellers feel understood.
- Keep the experience warm, clear and reassuring.
- Recommend what suits the traveller rather than what is easiest to sell.
- Preserve continuity between inspiration, Journey Passport, Journey Director and human follow-up.

Release-1.3-specific guiding principles (scope discipline, brand preservation, architecture constraints) are recorded in `RELEASE-1.3-WORKSTREAM-PLAN.md`'s own governing constraints per workstream (Activity 3), rather than restated here, to avoid the two documents drifting apart.

---

# 3. Release Status Dashboard

| Metric | Current Value | Notes |
|---|---|---|
| Overall Progress | Execution underway | 2 of 11 workstreams are ✅ Complete: Workstream 2 — Traveller Stories (closed 06-Sep-2026 per `R1.3-WS2-CLOSE-01`) and Workstream 1 — Destination Intelligence Evolution (full lifecycle closed 08-Sep-2026, Final QA PASS per `EBC-R1.3-WS1-010`, repository synchronised per `EBC-R1.3-WS1-011`). Workstream 11 — SMV Workspace is 🟡 In Progress (Product Specification baseline complete and accepted 13-Sep-2026 per `EBC-R1.3-WS3-006`; UX Architecture next). The remaining 8 workstreams are Not Started. |
| Number of Workstreams | 11 | 10 per `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.0 Activity 2, plus Workstream 11 (SMV Workspace / `FEAT-R1.3-013`), assigned 13-Sep-2026 per `EBC-R1.3-WS3-006` once its Product Specification confirmed scope. Individual lifecycle statuses recorded in Section 5. |
| Number of Completed Workstreams | 2 | Workstream 2 — Traveller Stories; Workstream 1 — Destination Intelligence Evolution. |
| Number of Open Decisions | See `RELEASE-1.3-WORKSTREAM-PLAN.md`'s "Decisions Required from the Product Owner" (5 items, including Decision Point D1 — thin workstreams WS2/WS7 — and Decision Point D2, resolved this update) | This tracker's own Product Decision Log (Section 7) records execution-phase decisions made once implementation begins; it is currently empty. |
| Number of Approved Decisions | 0 (this tracker) | No execution-phase Release 1.3 decisions recorded yet against this document; see Section 7. |
| Number of EBCs (this tracker) | 1 | `R1.3-TRK-001` (this document's creation). WS2's own delivery-chain EBCs are recorded in the Claude Project and cross-referenced from Section 5, not renumbered into this sequence. |
| Number of Completed Tasks | 1 of 10 workstreams closed | Task-level detail (Activity 3 of `RELEASE-1.3-WORKSTREAM-PLAN.md`) is not duplicated here — see Section 6. |
| Number of Deferred Items | See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 5, "Future / Release 2.0" | Not duplicated here. |
| Overall Release State | **Execution — In Progress** | Release 1.3 is the active implementation release (Release 1.2 closed 02-Sep-2026). |

**Maintenance note:** Update the count fields above whenever a workstream's status changes. This table is intentionally small so it stays cheap to keep current — Section 5 is the source of truth for workstream-level detail, and `RELEASE-1.3-WORKSTREAM-PLAN.md` remains the source of truth for task-level detail.

**See also:** `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` — the canonical, audit-grade Feature Register (established `EBC-R1.3-GOV-001`, 14-Sep-2026) for a feature-level, evidence-based view of the same release: source backlog reference, current lifecycle stage, current status and primary owner per feature, cross-referenced to the workstreams tracked in this dashboard and in Section 5. Section 15 below is the prior, superseded version of this register, retained as a historical record, not a live one.

---

# 4. Release Milestones

This section tracks Release 1.3 against its top-level lifecycle checkpoints, independent of workstream-level detail in Section 5. See Section 14 for status meanings.

| Milestone | Target Date | Status | Owner | Exit Criteria |
|---|---|---|---|---|
| Planning Complete | TBD | In Progress | Tiger | `RELEASE-1.3-WORKSTREAM-PLAN.md`'s five "Decisions Required from the Product Owner" resolved (Decision Point D2 resolved this update; four remain) |
| First Workstream Complete | 06-Sep-2026 | ✅ Complete | Tiger | Workstream 2 — Traveller Stories closed, `R1.3-WS2-CLOSE-01` |
| Implementation Complete | TBD | Not Started | Rad | All ten workstreams reach Complete or an explicitly accepted deferral |
| Functional QA | TBD | Not Started | Keerthi | Release-wide functional and regression validation complete |
| Traveller Experience QA | TBD | Not Started | Sri | Independent release-wide traveller-experience validation complete |
| Release Candidate | TBD | Not Started | Tiger | Release Checklist (Section 12) Delivery and Quality items satisfied |
| Production Release | TBD | Not Started | Vivek | Business Owner approval received; production deployment verified |
| Retrospective Complete | TBD | Not Started | Tiger | Release-wide retrospective and Lessons Learned captured; `PROJECT-HISTORY.md` updated |

**Maintenance note:** Update Target Date and Status as each milestone is reached. Dates are intentionally TBD until the remaining Decisions Required (Section 1) are resolved and a realistic schedule can be set.

---

# 5. Master Workstream Tracker

Status values used below follow Section 14 (Status Definitions). Workstream objectives, implementation areas, and full task-level decomposition are the canonical content of `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3 — not repeated here; this table tracks live delivery status only, cross-referencing the Workstream Plan by workstream number. Feature-level lifecycle stage, status and ownership (as distinct from workstream-level status) is tracked in `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md`, not duplicated here — see that document's Section 4 for the Feature ↔ Workstream cross-reference (`EBC-R1.3-GOV-002`).

| # | Workstream | Status | Owner | Notes |
|---|---|---|---|---|
| WS1 | Destination Intelligence Evolution | ✅ **Complete** | Arjun / Rad / Archie / Keerthi | Largest and most strategic workstream; full lifecycle closed 08-Sep-2026. **Governance:** architecture decisions (`EBC-R1.3-WS1-002`, `WS1-005`), product/destination-governance review (`WS1-003`), engineering-readiness consolidation (`WS1-004`, `WS1-006`) and the Future Considerations Register (`EBC-R1.3-WS0-001`) all complete. **Engineering:** Bootstrap Generator implemented (`WS1-007`), independently QA-validated with observations (`WS1-008`), remediated (`WS1-009`), and re-verified with a Final QA Recommendation of **PASS** (`WS1-010`) — Engineering Readiness 🟢 **GREEN**, QA: **PASS**. Three items surfaced during engineering/QA and captured in the FCR rather than silently dropped: `aliases` repository-layer gap (FCR-018), `kbSectionRef` ratify-or-remove decision (FCR-019), live-Supabase-reachability gap in the engineering environment (FCR-020) — none release-blocking. **Outstanding administrative step (not implementation):** all WS1-007–WS1-010 code changes exist only in the local working tree on `feature/ebc-r1.3-ws1-007-bootstrap-generator` — explicitly confirmed uncommitted and unpushed across all four of those reports, by design (kept the branch state stable across QA cycles). Committing and pushing this branch is Rad's next action, outside this documentation-only closure's scope (`EBC-R1.3-WS1-011` §11). **Scope clarification:** this ✅ Complete status closes the `WS1-002`–`WS1-011` Destination Intelligence governance/tooling card family (Bootstrap Workbook establishment through Bootstrap Generator delivery) — it does not mark `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3's own Tasks 1.1–1.8 (region-level destination content, Journey Intelligence Engine, AI enrichment, seasonal engine) as executed; those remain in their existing NEEDS DISCOVERY/READY states, unchanged by this closure. This naming relationship is a known, already-recorded ambiguity — see `FUTURE-CONSIDERATIONS.md` FCR-017. Full governance record: Claude Project `EBC-R1.3-WS1-002` through `WS1-011`. |
| WS2 | Traveller Stories | ✅ **Complete** | Rad (implementation) / Keerthi (QA) / Tiger (closure) | Closed 06-Sep-2026, `R1.3-WS2-CLOSE-01`. QA Final Status: PASS — no defects, no open observations, no release blockers. Independently repository-verified this update: `main` up to date with `origin/main`, commits `f561882`/`1a74f57` present and pushed, 49 traveller folders, 27 `googleReviewUrl` entries matching the reported 27-CTA/25-no-CTA split. Full evidence chain: `RELEASE-1.3-WORKSTREAM-PLAN.md`'s Workstream Delivery Status Log; full governance record: Claude Project `EBC-R1.3-WS2-CLOSE-01-TIGER-...`. |
| WS3 | Premium Homepage Experience | Not Started | Sophie / Rad | See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 3.1–3.6. **Disambiguation note (added 13-Sep-2026, `EBC-R1.3-WS3-006`):** this is the only "Workstream 3" recognised by this tracker. The Claude Project's `EBC-R1.3-WS3-002`–`WS3-CLOSURE` card series and `docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md` use "Workstream 3" to label an entirely unrelated initiative (the SMV Workspace Product Baseline) — that collision is resolved going forward by tracking that initiative as **WS11** below; the historical card IDs are not renamed. **Cross-reference note (added 14-Sep-2026, `EBC-R1.3-GOV-002`):** this workstream is the same initiative as `FEAT-R1.3-003` ("Homepage Premium Experience") in `RELEASE-1.3-FEATURE-REGISTER.md` — the word-order difference between this workstream's name and that Feature's name is a pre-existing, cosmetic naming variance across the two documents' independent naming conventions (workstream names vs. feature names), not a scope or identity difference; neither name is changed by this note. |
| WS4 | Journey Passport Evolution | Not Started | Sophie / Rad / Archie | Largest single cluster of ready UX/engineering items. See Activity 3, Tasks 4.1–4.9. |
| WS5 | Journey Director Evolution | Not Started | Archie / Rad / Sophie / Arjun | See Activity 3, Tasks 5.1–5.4. |
| WS6 | Authentication & User Accounts | Not Started | Arjun | No task engineering-ready; first task is product discovery. See Activity 3, Task 6.1. |
| WS7 | Marketing & Analytics | Not Started | Archie / Rad | Contains the one named Release 1.3 Commitment (Google Ads Conversion Tag, Task 7.1). See Activity 3. |
| WS8 | Search Behaviour | Not Started | Archie / Rad | Smallest, most execution-ready workstream — Task 8.1 already has a complete architecture review pending sign-off. See Activity 3, Tasks 8.1–8.2. |
| WS9 | Engineering Technical Debt | Not Started | Rad / Tiger | Absorbs `TD-R1.3-001`–`009`, legacy cleanup, and Release-1.2-closure documentation housekeeping. See Activity 3, Tasks 9.1–9.16. |
| WS10 | Platform & Design System | Not Started | Sophie / Archie / Tiger | See Activity 3, Tasks 10.1–10.7. |
| WS11 | SMV Workspace | 🟡 In Progress | Arjun (Product Specification — complete) / Sophie (UX Architecture — next) / Archie / Rad / Keerthi | Workstream number assigned 13-Sep-2026 per `EBC-R1.3-WS3-006` (previously tracked only as `FEAT-R1.3-013`, no WS# — see the WS3 disambiguation note above for why "WS3" is not used for this initiative). **Product/Business-Analysis phase complete and accepted** as the Release 1.3 Product Baseline: Discovery (`DEC-R1.3-004`) → Product Specification/RTM v1.0 → Product Owner Review (9/9 modules) → Delivery Governance Consistency Review (3 escalations, all resolved) → Impact Assessment → Stage 4 Consolidated Update, Product Specification/RTM **v2.0** → Baseline Index (`docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md`) → Tiger's Delivery Readiness Review (`EBC-R1.3-WS3-006`, **Ready for UX Architecture**). Four Open Questions remain, each scoped to specific modules rather than release-wide: OQ-018 (detailed FR wording for ~185 of 223 approved Functional Requirements — unscheduled, recommend a dedicated future Business Analysis EBC), OQ-019 (Destination Intelligence vs. WS1 Bootstrap Generator architecture — Archie), OQ-020 (Quotation vs. Proposal Version — Archie, joint Domain Modelling), OQ-021 (Master/Traveller Itinerary relationship notation — Archie). Full governance record: Claude Project `EBC-R1.3-WS3-001` through `WS3-CLOSURE`; full readiness assessment: `docs/09-Development/EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md`. |

**Dependencies:** none of the eight Not Started workstreams are named as blocked by WS1's or WS2's closure or by each other in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation — see Section 11 below for the release-level dependency picture as it develops.

## Workstream 1 — Closure Summary

Closed 08-Sep-2026 (`EBC-R1.3-WS1-011`), governance outcomes only — see Section 6 for implementation detail:

- Travel Region established as the primary Product entity for Destination Intelligence.
- Repository-generated factual data (geo-identity, admin hierarchy) with Product-owned enrichment layered on top, never overwritten by regeneration.
- Bootstrap Workbook established as the authoritative starting point for Destination Identity and Hierarchy — the Product-editable source of truth going forward.
- Explicit `geoScope` declarations replacing inferred geographic matching, closing a class of matching ambiguity the prior approach could not resolve.
- Deterministic Bootstrap Generator implemented and validated — repeat runs produce stable, non-duplicated output; the same input always produces the same result.
- Product-owned enrichment preserved across regeneration, verified live through a full edit → regenerate → confirm cycle (Critical Acceptance Test, `WS1-009`/`WS1-010`).
- Engineering and QA completed successfully — Final QA Recommendation **PASS** (`WS1-010`), no release-blocking defects.

This closes the `WS1-002`–`WS1-011` governance/tooling initiative (see the Scope clarification in the WS1 tracker row above); it is not a claim that Workstream Plan Tasks 1.1–1.8 are executed.

---

# 6. Task Tracker

Per the document responsibility split (Document Information above), task-level decomposition is **not duplicated** in this tracker. The authoritative task list for every workstream — task ID, description, type, owner, backlog reference and readiness — is `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3. This section will hold a live status rollup once workstreams beyond WS2 begin execution; until then, per-workstream task status is tracked directly against the Workstream Plan's own task tables (Tasks 1.1–1.8, 2.1, 3.1–3.6, 4.1–4.9, 5.1–5.4, 6.1, 7.1, 8.1–8.2, 9.1–9.16, 10.1–10.7).

## Workstream 1 — Destination Intelligence Evolution (completed tasks)

| ID | Task | Status | Owner | Notes |
|---|---|---|---|---|
| N/A — foundational tooling, not a Task 1.1–1.8 line item (see Notes) | Bootstrap Workbook / Bootstrap Generator — deterministic generation of the Product-editable Destination Identity & Hierarchy workbook (Sheets 1–2), `geoScope` explicit-declaration matching, Product-owned enrichment preservation across regeneration | ✅ Complete | Rad | Delivered via `WS1-007`; QA `WS1-008` PASS WITH OBSERVATIONS; remediated `WS1-009`; final re-verification `WS1-010` PASS. Not yet committed/pushed — see Section 5 Notes. **This is the data-entry/governance tooling that Tasks 1.1–1.2 (region-level destination intelligence content) will eventually be executed through — it is not itself Task 1.1 or 1.2, and does not mark Tasks 1.1–1.8 complete.** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3's own task table (all eight tasks remain in their existing NEEDS DISCOVERY / READY state); the naming relationship between this `WS1-00x` governance/tooling card family and the Workstream Plan's Task 1.1–1.8 numbering is a known, already-recorded ambiguity — `FUTURE-CONSIDERATIONS.md` FCR-017. |

## Workstream 2 — Traveller Stories (completed tasks)

| ID | Task | Status | Owner | Notes |
|---|---|---|---|---|
| 2.1 | Traveller Stories Quality Gate — hide incomplete testimonials; never render an empty testimonial card; skip incomplete records gracefully | ✅ Complete | Rad | Delivered via `R1.3-WS2-T2`, `IMP-02`/`IMP-02A`/`IMP-02B`, `IMP-03`; QA `R1.3-WS2-QA-01` PASS. See Section 5. |

---

# 7. Product Decision Log

Only decisions that materially influence product behaviour, architecture, UX or release management, made during Release 1.3 **execution**, are recorded here — mirroring `RELEASE-1.2.md` Section 7. Decisions already captured in `RELEASE-1.3-BACKLOG.md` §1 (Decisions 1–10, made before execution began) are not duplicated here; this log begins empty and grows as Release 1.3 delivery proceeds.

| Decision ID | Date | Decision | Reason | Outcome | Status |
|---|---|---|---|---|---|
| DEC-R1.3-001 | 06-Sep-2026 | **Establish `RELEASE-1.3.md` as the live release execution tracker, distinct from `RELEASE-1.3-WORKSTREAM-PLAN.md` (planning) and `RELEASE-1.3-BACKLOG.md` (scope catalogue).** | Resolves Decision Point D2, raised when Workstream 2 closure required updating a "tracker" that did not yet formally exist for Release 1.3, mirroring the Release 1.2 precedent (`RELEASE-1.2.md`). | This document created; `RELEASE-1.3-WORKSTREAM-PLAN.md`'s interim WS2 Delivery Status update (v1.1) retained unchanged as historical record, per the Product Owner's explicit instruction; that document returns to a planning-only role going forward. | Approved |
| DEC-R1.3-002 | 06-Sep-2026 | **Approve migrating all 37 outstanding Product-approved testimonials into the site's canonical testimonial data (`travellerStories.data.ts`/`getTestimonial.ts`), superseding the original "Authentic Story Rule" EBC design that treated Journey Snapshot as the correct, permanent state for these 37.** | Resolves `EBC-R1.3-WS2-04` §11 Decision 1 (Arjun) — all 37 testimonials were already Product-approved in the frozen workbook (`PRW-R1.3-001-Traveller-Stories.xlsx`); the shortfall was a migration gap, not a content or approval gap. Rad had raised this exact question as open in `IMP-02B`. | Migration executed by Rad (`R1.3-WS2-IMP-03`), committed `1a74f57` — curated testimonial coverage moved from 15/52 to 52/52 journeys; the Journey Snapshot fallback no longer occurs for any journey. | Approved |
| DEC-R1.3-003 | 06-Sep-2026 | **Approve the experience-category mapping approach for the Traveller Stories migration: adopt Arjun's Exact/Precedent/Compatible batch mappings (21 values / 26 journeys, `EBC-R1.3-WS2-05`), ratified by Archie's architecture review (`EBC-R1.3-WS2-06` — Q1/Q2 approved; Q3/Q4 retain the 8-value `ExperienceType` union unchanged and render Ambiguous/Missing values with no category badge rather than force-mapping), plus two additional Product-reviewed mappings from the Ambiguous tier (Kerala Getaway → Weekend Getaway; Relaxing Getaway → Family Holiday, `EBC-R1.3-WS2-05-ADDENDUM-01` §6).** | Closes the 34-value metadata taxonomy against the 8-value runtime enum without widening the enum (an architecture-material change under Project Instructions §21) or force-mapping ambiguous labels, consistent with the project's principle of accurate rather than generic personalisation (§22). `Memory Makers` (3 journeys) and `International Private Tour` (1 journey) were deliberately left unmapped — a missing badge assessed as preferable to a wrong one. | Applied by Rad (`R1.3-WS2-IMP-03`), committed `1a74f57` — 20 of the 37 migrated journeys received an `experience` value; 17 (Memory Makers ×3, International Private Tour ×1, and the 5 Missing-tier values across 13 journeys) received none, by design. The `ExperienceType` union itself remains unchanged at 8 values. | Approved |
| DEC-R1.3-004 | 09-Sep-2026 | **Approve the SMV Workspace concept and its captured Product Discovery decisions (vision, user model, dashboard philosophy, operational queues, journey lifecycle, business objects, business rules, Release 1.3 MVP scope), formalised in `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`.** | Resolves `EBC-R1.3-RM-002`'s objective of ensuring Arjun's Product Specification begins from approved Product Owner decisions rather than conversational context. | New document created (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`). Five specific content gaps (User Model capabilities, Journey Lifecycle stage detail, Business Object definitions, Business Rule definitions, MVP deferred-scope list) were explicitly flagged rather than invented — see that document's Section 12. A naming discrepancy was also flagged: this discovery's content matches Feature Register `FEAT-R1.3-013` (Team Member Portal) rather than the `FEAT-R1.3-007` (Customer Identity & Member Experience) name the originating EBC used — see that document's Section 2. | Approved |

**Approval context for `DEC-R1.3-002`/`DEC-R1.3-003` (retroactively logged via `EBC-R1.3-WS1-013`):** the artefact trail (`EBC-R1.3-WS2-04`, `WS2-05`, `WS2-06`, `WS2-05-ADDENDUM-01`) documents each decision's analysis, options and recommendation in full, and `R1.3-WS2-IMP-03` explicitly states its implementation followed "the frozen decisions from WS2-04 (Arjun), WS2-05/06 (Arjun/Archie), and the Addendum-01 mapping approvals, applied mechanically" — confirming both decisions were approved before implementation began. No separately dated Product Owner approval record (e.g. a specific sign-off message or meeting note) exists in the repository or Claude Project artefact trail distinct from the implementation report itself; consistent with this EBC's instruction not to speculate where evidence is incomplete, no such record is asserted here. Both decisions are logged now, retroactively, on the strength of the implemented-and-shipped outcome (commit `1a74f57`) as the evidence of approval — this is the gap `EBC-R1.3-WS1-012` §4 (Gap 1) identified as the review's most material finding.

**Approval context for `DEC-R1.3-004`:** as with `DEC-R1.3-002`/`DEC-R1.3-003`, no separately dated Product Owner sign-off record exists apart from the discovery workshop discussion itself; the decision is logged on the strength of the Product Owner's own explicit instruction (during `EBC-R1.3-RM-002`) to treat the workshop content as the approved source material for this reconciliation.

| Decision ID | Date | Decision | Reason | Outcome | Status |
|---|---|---|---|---|---|
| DEC-R1.3-005 | 09-Sep-2026 | **Confirm `FEAT-R1.3-013` as the correct and permanent home for the SMV Workspace Product Discovery capture (`DEC-R1.3-004`); rename the feature from "Team Member Portal" to "SMV Workspace" to match the agreed product vision. Confirm `FEAT-R1.3-007` (Customer Identity & Member Experience) remains a fully separate feature requiring its own dedicated Product Discovery workshop, focused exclusively on the customer-facing experience — no content moves between the two features. Retain the five gaps identified in `SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §12 as Arjun Product Specification refinement items, not grounds to reopen Product Discovery.** | Resolves the naming-discrepancy flag raised in `EBC-R1.3-RM-002`'s report (Section 4) and the corresponding open flag left in the Feature Register — the Product Owner's direct decision replaces what had been recorded as an unresolved recommendation. | `RELEASE-1.3.md` Section 15 updated: `FEAT-R1.3-013` renamed and its Status advanced to Approved – Discovery Captured, Product Specification Pending; `FEAT-R1.3-007`'s Notes updated to record its discovery as still fully outstanding and unrelated to the SMV Workspace capture. | Approved |

**Approval context for `DEC-R1.3-005`:** received directly from the Product Owner as an explicit decision statement, addressed to this exact open question — no retroactive-logging gap applies here, unlike `DEC-R1.3-002`–`004`.

| Decision ID | Date | Decision | Reason | Outcome | Status |
|---|---|---|---|---|---|
| DEC-R1.3-006 | 13-Sep-2026 | **Accept the Release 1.3 SMV Workspace Product Specification and Requirements Traceability Matrix, both v2.0, as the Release 1.3 Product Baseline for this initiative (per `docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md`); assign this initiative workstream number WS11; record Delivery decisions on Open Questions OQ-018 through OQ-021 (all remain open, each routed to a named owner and downstream workstream — see `RELEASE-1.3-PRODUCT-BASELINE.md` §3 for the full decision text); certify the baseline Ready for UX Architecture.** | Closes out `EBC-R1.3-WS3-002` through `WS3-CLOSURE`'s Delivery Readiness Review (`EBC-R1.3-WS3-006`), resolving the workstream-number collision between this card series' self-identification as "Workstream 3" and this tracker's own, unrelated Workstream 3 (Premium Homepage Experience). | `docs/10-Backlog/RELEASE-1.3.md` Section 5 (new WS11 row, WS3 disambiguation note), Section 3 (workstream count 10→11) and Section 15 (`FEAT-R1.3-013` cross-referenced to WS11) updated; `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` §5.1 updated with the previously-missing mandatory FCR closure-review log entry for this workstream. Full detail: `docs/09-Development/EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md`. | Approved |

---

# 8. Open Product Decisions

These remain unresolved and must stay visible until the Product Owner formally resolves them. Carried forward by reference from `RELEASE-1.3-WORKSTREAM-PLAN.md`'s own "Decisions Required from the Product Owner" list, not duplicated in full here:

| ID | Open Discussion | Raised In | Status |
|---|---|---|---|
| OD-R1.3-1 | Decision Point D1 — keep WS2/WS7 as their own thin workstreams, or fold into WS3/WS5? | `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 2 | Under Discussion — WS2 is now closed regardless of this decision's outcome; relevant primarily to WS7 going forward |
| OD-R1.3-2 | Approve, adjust or reject the ten-workstream structure itself | `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 2 | Under Discussion |
| OD-R1.3-3 | Formal sequencing and release-inclusion decision (which workstreams/tasks are actually committed to Release 1.3) | `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 5/6 | Under Discussion |
| OD-R1.3-4 | Schedule WS9's Release-1.2-closure housekeeping (Tasks 9.12–9.16) inside Release 1.3 delivery, or run separately | `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 5 | Under Discussion |
| OD-R1.3-5 | Archie's explicit go-ahead for Destination Intelligence Model Phase 3/4 (WS1, Tasks 1.5–1.6) | `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 5 | Under Discussion |

**Cross-reference note on `OD-R1.3-4` (added 14-Sep-2026, `EBC-R1.3-GOV-002`):** `EBC-R1.3-GOV-001`'s Finding SD-2 independently surfaced the same tension this open decision already names — `FEAT-R1.3-010`'s Business Objective in the Feature Register folds in Tasks 9.12–9.16 without noting they are not Release 1.3 product/engineering scope in the sense the rest of the register uses the term. No new open decision is created; this note only records that supporting evidence now exists. Full detail: `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md` §5.

### Retired / Resolved Open Decisions

| ID | Open Discussion | Raised In | Resolution | Status |
|---|---|---|---|---|
| OD-R1.3-D2 | Where should live Release 1.3 delivery status be tracked? | `RELEASE-1.3-WORKSTREAM-PLAN.md` v1.1, Workstream Delivery Status Log | Resolved by `DEC-R1.3-001` above — dedicated `RELEASE-1.3.md` created | Resolved |

---

# 9. Future Release Candidates

Carried by reference from `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 5, "Future / Release 2.0" classification — not duplicated here. See that document for the full list (Workstream 1 Tasks 1.1–1.4/1.8; Workstream 3 Tasks 3.5–3.6; Workstream 5 Tasks 5.3–5.4; Workstream 6 Task 6.1's build phase; Workstream 10's contingent governance playbooks).

**Distinct, complementary register:** `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` (established `EBC-R1.3-WS0-001`) carries a different class of item — enhancements, governance recommendations, architectural-evolution ideas and implementation opportunities explicitly named and intentionally deferred *during* completed Release 1.3 workstream governance reviews (Workstream 1 — Destination Intelligence Evolution; Workstream 2 — Traveller Stories), rather than pre-execution backlog/vision items. Not duplicated here — see that document for the full, traceable list.

---

# 10. Risks & Mitigations

No Release-1.3-execution-phase risks recorded yet. This section will populate as workstreams beyond WS2 begin execution, mirroring `RELEASE-1.2.md` Section 10's format (ID / Description / Impact / Likelihood / Mitigation / Owner / Status).

---

# 11. Dependency Tracker

High-level workstream dependencies, as currently known:

```
Workstream 2 (Traveller Stories) — Complete
        ↓
(no dependent workstream named)
```

No workstream in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation is named as blocked by Workstream 2. This section will expand with real dependency chains as further workstreams begin execution, mirroring `RELEASE-1.2.md` Section 11's format.

---

# 12. Release Checklist

This is a release-readiness checklist for Release 1.3 at the master-tracker level, mirroring `RELEASE-1.2.md` Section 12. Populated as execution proceeds.

## Delivery

- [ ] All ten workstreams are Complete, Deferred with Product Owner acceptance, or explicitly accepted with named residual items at closure — 1 of 10 complete (WS2)
- [x] `R1.3-TRK-001` (this document's creation) complete
- [ ] No known functional release blocker remains open

## Documentation

- [x] This document (`RELEASE-1.3.md`) is current at Version 1.0
- [x] `RELEASE-1.3-WORKSTREAM-PLAN.md` reflects the current ten-workstream baseline (v1.1)
- [ ] `PROJECT-HISTORY.md` updated with the Release 1.3 entry
- [ ] Standalone release notes prepared
- [x] Decision log (Section 7) reflects all approved execution-phase decisions through `DEC-R1.3-003` (updated `EBC-R1.3-WS1-013`)
- [ ] Open decisions (Section 8) resolved or explicitly carried to a future release — 5 of 6 still open (see Section 8)

## Quality

- [x] Workstream 2 — Keerthi's functional QA sign-off received (`R1.3-WS2-QA-01`, PASS)
- [ ] Release-wide functional QA sign-off received
- [ ] Release-wide traveller experience validation complete
- [ ] Production build, TypeScript and ESLint checks pass at release scope

## Release Approval

- [ ] Business Owner (Vivek) walkthrough and approval received
- [ ] Production smoke test passed
- [ ] Release marked complete
- [ ] Retrospective complete

---

# 13. Post-Implementation Observations

No Release-1.3-execution-phase post-implementation observations recorded yet. This section will populate as workstreams complete, mirroring `RELEASE-1.2.md` Section 13's per-workstream format (Observation ID, finding, severity, disposition).

---

# 14. Status Definitions

## Lifecycle statuses (used for tasks, decisions and workstreams)

| Status | Meaning |
|---|---|
| Proposed | Identified but not yet discussed or scoped in detail |
| Under Discussion | Being actively analysed; may require a Product Owner decision |
| Approved | Scope and approach confirmed; ready to be scheduled for implementation |
| In Progress | Implementation actively underway |
| Ready for QA | Implementation complete; awaiting Keerthi/Sri validation |
| Complete | Implemented, validated and accepted |
| Deferred | Explicitly moved out of Release 1.3 scope |
| Cancelled | No longer required |

## Quick-reference symbols (consistent with `RELEASE-1.2.md`)

| Symbol | Meaning |
|---|---|
| ✅ | Complete |
| 🟡 | In Progress / Release Remaining |
| 🔵 | Deferred to a future release |
| ⚪ | Superseded / Cancelled |
| 🚫 | Blocked |

---

*This document is maintained by Tiger, Programme and Delivery Lead, on behalf of Team Satvi. It is the live execution and delivery-status tracker for Release 1.3, initialised from the proven `RELEASE-1.2.md` structure per the Product Owner's decision on Decision Point D2. `RELEASE-1.3-BACKLOG.md` remains the canonical scope/backlog catalogue and `RELEASE-1.3-WORKSTREAM-PLAN.md` remains the canonical planning/sequencing document; this document does not replace or duplicate either.*

---

# 15. Feature Register

> **SUPERSEDED, 14-Sep-2026 (`EBC-R1.3-GOV-002`, resolving `EBC-R1.3-GOV-001`'s own recommendation).** This section is no longer the live Feature Register. **`docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` is now the canonical Feature Register** — audit-grade, with an evidence-based Current Lifecycle Stage field this section never had, and with the scope-drift and status-accuracy findings of `EBC-R1.3-GOV-001` (e.g. `FEAT-R1.3-001`'s tooling-only completion; `FEAT-R1.3-008`'s Commitment status; `FEAT-R1.3-011`'s under-stated Governance Playbook scope) already carried into it. Everything below this banner is retained **unedited, as a historical record**, per this project's supersede-not-erase convention (Project Instructions §32) — it is not being kept current and should not be read as live status. Full detail: `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md` and `docs/09-Development/EBC-R1.3-GOV-002-TIGER-Release-1.3-Tracker-Synchronisation.md`.

*Added `09-Sep-2026` per `EBC-R1.3-RM-001` (Release 1.3 Feature Register Integration). This section is an enhancement to the existing tracker, not a separate document — it sits alongside the Master Workstream Tracker (Section 5) and Task Tracker (Section 6) as a feature-level view of the same release. It does not replace either: Section 5 remains the source of truth for live workstream status, `RELEASE-1.3-WORKSTREAM-PLAN.md` remains the source of truth for task-level decomposition, and this register exists to answer a different question — "what features make up Release 1.3, and what is each one worth to the business."*

**Note on card ID:** the card supplied for this work self-identified as `EBC-R1.3-WS3-001`. That ID is already permanently assigned in the Claude Project to an open, substantive specification (`Product Bootstrap Workbook Definition & Extraction Strategy`, Decision Points D1–D4 still open, cross-referenced by `FCR-017` and multiple WS1 cards). Per the Product Owner's instruction, this work is recorded under `EBC-R1.3-RM-001` instead — interpreted as the Product Owner's intended ID (a corrected form of the literal reply `BC-R1.3-RM-001`), consistent with the `EBC-` prefix convention used for every other card in this project. Flagged here rather than silently assumed.

## 15.1 Purpose and Scope

The Feature Register catalogues every feature-level unit of scope in Release 1.3 — completed and planned — with a consistent set of business and delivery fields per entry. It exists to give the Product Owner a single place to see business objective, business value, dependencies and status across the whole release, without duplicating the task-level detail already maintained in `RELEASE-1.3-WORKSTREAM-PLAN.md` or the live status already maintained in Section 5.

**Traceability rule:** every Feature Register entry maps to exactly one Master Workstream Tracker row (Section 5), except FEAT-R1.3-013 (SMV Workspace) and FEAT-R1.3-014 (Governance & Release Closure), which are release-level scope without an existing WS# — see their entries below for how each is tracked in the interim.

**Estimation note (applies uniformly to every entry below):** Story Points, Estimated Hours and ROI are recorded as **Not yet estimated** across all 14 entries, not only the two newly-approved features. This is a deliberate, evidence-based choice, not an oversight: `RELEASE-1.3-WORKSTREAM-PLAN.md` records estimation as explicitly out of scope for every workstream at this stage (e.g. Workstream 9's technical-debt items are documented as awaiting "sequencing and estimation (both explicitly out of this card's scope)"), and no Release 1.3 estimation activity has been performed anywhere in the approved backlog for any workstream, completed or planned. Recording estimates here — even placeholder ones — for some entries and not others would misrepresent the state of the backlog and risk being read as approved figures. When estimation is performed (Arjun/Tiger, per the standard delivery lifecycle), this section should be updated in place.

## 15.2 Feature Summary Table

| Feature ID | Feature Name | Related Workstream | Status |
|---|---|---|---|
| FEAT-R1.3-001 | Destination Intelligence Evolution | WS1 | ✅ Complete |
| FEAT-R1.3-002 | Traveller Stories | WS2 | ✅ Complete |
| FEAT-R1.3-003 | Homepage Premium Experience | WS3 | Not Started |
| FEAT-R1.3-004 | Ambient Music Experience (Evaluation Only) | WS3 | Not Started |
| FEAT-R1.3-005 | Journey Passport Experience 2.0 | WS4 | Not Started |
| FEAT-R1.3-006 | Destination Recommendation Engine | WS5 | Not Started |
| FEAT-R1.3-007 | Customer Identity & Member Experience | WS6 | Approved – Discovery Pending |
| FEAT-R1.3-008 | Analytics & Conversion Tracking | WS7 | Not Started |
| FEAT-R1.3-009 | Search Behaviour | WS8 | Not Started |
| FEAT-R1.3-010 | Technical Debt & Performance | WS9 | Not Started |
| FEAT-R1.3-011 | Design System Polish | WS10 | Not Started |
| FEAT-R1.3-012 | (reserved — see note) | — | — |
| FEAT-R1.3-013 | SMV Workspace | WS11 | Approved – Product Baseline Complete (Ready for UX Architecture) |
| FEAT-R1.3-014 | Governance & Release Closure | None (release-level, spans all WS) | Not Started |

*Note: the original ten-feature list supplied did not include a distinct "Journey Director" entry separate from the Recommendation Engine — Section 5 tracks Journey Director Evolution as WS5, whose objective statement explicitly absorbs "the Journey Director CTA/WhatsApp integration, Itinerary Builder, Journey Director recovery messaging, and the recommendation-side half of AI Vision." FEAT-R1.3-006 below is scoped to that full WS5 objective, not narrowed to scoring only, so no separate entry was needed and FEAT-R1.3-012 is left unassigned rather than invented to fill a numbering gap. If a distinct Journey Director feature is intended, flag it and this register will be amended.*

## 15.3 Feature Entries

### FEAT-R1.3-001 — Destination Intelligence Evolution

- **Feature ID:** FEAT-R1.3-001
- **Related Workstream:** WS1 — Destination Intelligence Evolution
- **Business Objective:** Establish Travel Region as the primary Product entity for destination content, with a deterministic, Product-editable Bootstrap Generator replacing inferred geographic matching with explicit `geoScope` declarations.
- **Business Value:** Removes a class of destination-matching ambiguity the prior approach could not resolve; gives Product a durable, repeatable way to establish and enrich destination content without engineering involvement on every change.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None outstanding — full lifecycle closed.
- **Team Satvi Owner(s):** Arjun / Rad / Archie / Keerthi
- **Status:** ✅ Complete (closed 08-Sep-2026, `EBC-R1.3-WS1-011`)
- **ROI:** Not yet estimated
- **Acceptance Criteria:** Final QA Recommendation **PASS** (`WS1-010`); Product-owned enrichment preserved across regeneration verified via a full edit → regenerate → confirm cycle; repeat generator runs produce stable, non-duplicated output.
- **Notes:** This ✅ Complete status closes the `WS1-002`–`WS1-011` governance/tooling card family (Bootstrap Workbook establishment through Bootstrap Generator delivery) — it does not mark `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3's Tasks 1.1–1.8 (region-level destination content, Journey Intelligence Engine, AI enrichment, seasonal engine) as executed; see the Section 5 Scope Clarification and `FUTURE-CONSIDERATIONS.md` FCR-017. Three non-blocking items captured in the FCR: `aliases` gap (FCR-018), `kbSectionRef` decision (FCR-019), Supabase reachability gap (FCR-020).

### FEAT-R1.3-002 — Traveller Stories

- **Feature ID:** FEAT-R1.3-002
- **Related Workstream:** WS2 — Traveller Stories
- **Business Objective:** Migrate all Product-approved traveller testimonials into the live content model with correct experience-category mapping and Google Review CTA alignment.
- **Business Value:** Strengthens trust and social proof across traveller-facing pages using real, approved traveller voices rather than placeholder content.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None outstanding — full lifecycle closed.
- **Team Satvi Owner(s):** Rad (implementation) / Keerthi (QA) / Tiger (closure)
- **Status:** ✅ Complete (closed 06-Sep-2026, `R1.3-WS2-CLOSE-01`)
- **ROI:** Not yet estimated
- **Acceptance Criteria:** QA Final Status PASS — no defects, no open observations, no release blockers; 49 traveller folders migrated; 27 `googleReviewUrl` entries matching the reported 27-CTA/25-no-CTA split.
- **Notes:** Underlying business decisions retroactively recorded in Section 7 as `DEC-R1.3-002` (37-testimonial migration approval) and `DEC-R1.3-003` (experience-category mapping approval) per `EBC-R1.3-WS1-013`.

### FEAT-R1.3-003 — Homepage Premium Experience

- **Feature ID:** FEAT-R1.3-003
- **Related Workstream:** WS3 — Premium Homepage Experience
- **Business Objective:** Deliver a premium first-impression homepage experience consistent with the SMV brand system and "More Than a Trip. It's an Experience." positioning.
- **Business Value:** The homepage is the primary entry point for new travellers; a stronger first impression supports trust-building before any sales interaction.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Sophie / Rad
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 3.1–3.6 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** WS3's objective text also names ambient homepage music evaluation and the Traveller Inspiration vision's first UX pass — tracked separately below as FEAT-R1.3-004 (Ambient Music, evaluation-only) so that its distinct "evaluation only" status is not lost inside a larger homepage entry.

### FEAT-R1.3-004 — Ambient Music Experience (Evaluation Only)

- **Feature ID:** FEAT-R1.3-004
- **Related Workstream:** WS3 — Premium Homepage Experience
- **Business Objective:** Evaluate optional, autoplay-policy-compliant homepage ambient background music to strengthen premium, calming travel ambience.
- **Business Value:** Potential atmospheric/brand-reinforcement value on the homepage; explicitly an evaluation, not a committed build.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** Must use original composition only (Suno or equivalent) — no third-party copyrighted music; must support browser autoplay policies; must remain fully optional for the traveller.
- **Team Satvi Owner(s):** Sophie (evaluation) / Rad (feasibility)
- **Status:** Not Started — **Evaluation Only**, per `RELEASE-1.3-BACKLOG.md`'s explicit framing.
- **ROI:** Not yet estimated
- **Acceptance Criteria:** Not yet defined — evaluation outcome will determine whether acceptance criteria are drafted at all.
- **Notes:** Listed independently in `RELEASE-1.3-BACKLOG.md` as "Not yet assigned" and separately folded into WS3's objective in `RELEASE-1.3-WORKSTREAM-PLAN.md`; this entry does not commit the release to shipping ambient music, only to evaluating it, consistent with both source documents.

### FEAT-R1.3-005 — Journey Passport Experience 2.0

- **Feature ID:** FEAT-R1.3-005
- **Related Workstream:** WS4 — Journey Passport Evolution
- **Business Objective:** Evolve the Journey Passport experience — the largest single cluster of ready UX/engineering items in Release 1.3.
- **Business Value:** Journey Passport is a core continuity point between inspiration, personalisation and human follow-up; strengthening it directly serves the "preserve continuity" guiding principle.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Sophie / Rad / Archie
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 4.1–4.9 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** None.

### FEAT-R1.3-006 — Destination Recommendation Engine

- **Feature ID:** FEAT-R1.3-006
- **Related Workstream:** WS5 — Journey Director Evolution
- **Business Objective:** Evolve the Journey Director recommendation engine, including CTA/WhatsApp integration, the Itinerary Builder, Journey Director recovery messaging, and the recommendation-side half of AI Vision.
- **Business Value:** Directly serves the core SMV proposition — presenting personalised experiences rather than generic packages — and is the primary mechanism by which the site helps travellers feel understood.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Archie / Rad / Sophie / Arjun
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 5.1–5.4 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** Recommendations must remain limited to served destinations, per Section 24 of the Project Instructions (Journey Passport and Journey Director Guardrails); any change to scoring, eligibility or contradiction handling requires explicit approval and targeted testing.

### FEAT-R1.3-007 — Customer Identity & Member Experience

- **Feature ID:** FEAT-R1.3-007
- **Related Workstream:** WS6 — Authentication & User Accounts (closest existing mapping; not a confirmed 1:1)
- **Business Objective:** Not yet defined — awaiting Arjun Product Discovery.
- **Business Value:** Not yet defined — awaiting Arjun Product Discovery.
- **Story Points:** Not assigned (per Product Owner instruction)
- **Estimated Hours:** Not assigned (per Product Owner instruction)
- **Dependencies:** Product discovery must precede architecture and engineering work — consistent with WS6's existing framing in `RELEASE-1.3-WORKSTREAM-PLAN.md` ("Confirmed, needs discovery... No task below this workstream is engineering-ready; first task is product discovery, per backlog Recommendation 4").
- **Team Satvi Owner(s):** Arjun (discovery) — Archie and Rad to follow once scoped.
- **Status:** **Approved – Discovery Pending**
- **Delivery State:** Awaiting Arjun Product Discovery
- **Architecture:** Pending
- **Engineering:** Not Started
- **ROI:** Not assigned (per Product Owner instruction)
- **Acceptance Criteria:** Not yet defined — to be established during Arjun's product discovery.
- **Notes:** Originated during Release 1.3 planning and formally accepted into the release per the Product Owner's decision of 09-Sep-2026 (this card). No standalone business-case documentation exists yet in `RELEASE-1.3-BACKLOG.md` or `RELEASE-1.3-WORKSTREAM-PLAN.md`; this entry records the approval and the discovery gap transparently rather than inferring requirements. Mapped to WS6 as the closest existing workstream because both concern authentication/account identity; this mapping remains provisional pending this feature's own discovery. **Resolved 09-Sep-2026 (Product Owner decision, following `EBC-R1.3-RM-002`):** confirmed as a fully separate feature from `FEAT-R1.3-013` (SMV Workspace). The `EBC-R1.3-RM-002` discovery capture (`DEC-R1.3-004`) belongs entirely to `FEAT-R1.3-013` — no content from it applies here. This feature requires its own dedicated Product Discovery workshop, focused exclusively on the customer-facing identity/member experience; that discovery has not yet taken place.

### FEAT-R1.3-008 — Analytics & Conversion Tracking

- **Feature ID:** FEAT-R1.3-008
- **Related Workstream:** WS7 — Marketing & Analytics
- **Business Objective:** Deliver release-committed analytics and conversion tracking, including the Google Ads Conversion Tag.
- **Business Value:** Enables accurate measurement of marketing spend effectiveness and conversion attribution.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Archie / Rad
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Task 7.1 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** Contains the one item in Release 1.3 explicitly named a Release Commitment (Google Ads Conversion Tag) rather than a discretionary enhancement.

### FEAT-R1.3-009 — Search Behaviour

- **Feature ID:** FEAT-R1.3-009
- **Related Workstream:** WS8 — Search Behaviour
- **Business Objective:** Refine destination search behaviour — the smallest, most execution-ready workstream in the release.
- **Business Value:** Search is a primary discovery path for travellers with an unknown destination intent; incremental improvements here have a direct, low-risk path to delivery.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Archie / Rad
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 8.1–8.2 (canonical task-level acceptance criteria; not duplicated here). Task 8.1 already has a complete architecture review pending sign-off.
- **Notes:** Added to the Feature Register per the Product Owner's explicit confirmation of 09-Sep-2026 — WS8 was present in the Master Workstream Tracker (Section 5) but omitted from the feature list originally supplied for this card; this entry corrects that omission.

### FEAT-R1.3-010 — Technical Debt & Performance

- **Feature ID:** FEAT-R1.3-010
- **Related Workstream:** WS9 — Engineering Technical Debt
- **Business Objective:** Address accumulated technical debt (`TD-R1.3-001`–`009`), legacy cleanup, and Release-1.2-closure documentation housekeeping.
- **Business Value:** Protects long-term maintainability and delivery velocity; reduces the risk of compounding engineering cost in later releases.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Rad / Tiger
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 9.1–9.16 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** `RELEASE-1.3-WORKSTREAM-PLAN.md` explicitly records sequencing and estimation for these items as out of scope of the planning card that defined them — consistent with the uniform "Not yet estimated" treatment applied across this whole register.

### FEAT-R1.3-011 — Design System Polish

- **Feature ID:** FEAT-R1.3-011
- **Related Workstream:** WS10 — Platform & Design System
- **Business Objective:** Polish and extend the shared design system and platform-level UI consistency.
- **Business Value:** Improves delivery speed and visual consistency across all traveller-facing surfaces by strengthening reusable components rather than one-off implementations.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** None named as blocking in `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3/Sequencing Recommendation.
- **Team Satvi Owner(s):** Sophie / Archie / Tiger
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** See `RELEASE-1.3-WORKSTREAM-PLAN.md` Activity 3, Tasks 10.1–10.7 (canonical task-level acceptance criteria; not duplicated here).
- **Notes:** None.

### FEAT-R1.3-013 — SMV Workspace

*(Renamed from "Team Member Portal" per the Product Owner's decision of 09-Sep-2026, to reflect the agreed product vision captured in `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`.)*

- **Feature ID:** FEAT-R1.3-013
- **Related Workstream:** **WS11 — SMV Workspace** (assigned 13-Sep-2026, `EBC-R1.3-WS3-006`, now Product Specification confirms scope). See Section 5.
- **Business Objective:** Establish the SMV Workspace as the single operational platform for Search My Vacation's internal team — the system through which the team plans, delivers and manages traveller journeys day to day. Per `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §4 (Workspace Vision).
- **Business Value:** A single source of truth and daily decision support for operational work (leads, journeys, vendors, bookings, tasks), replacing work spread across disconnected tools, with team collaboration and operational visibility built in. Per the same source, §4.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** Product Specification (Arjun) is complete and accepted as the Release 1.3 Product Baseline (`v2.0`, `EBC-R1.3-WS3-006`). Four scoped Open Questions (OQ-018–021) remain, each routed to a named owner (Tiger/Archie) and none release-wide — see `docs/09-Development/EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md` §7 for the full breakdown. UX Architecture (Sophie) is next.
- **Team Satvi Owner(s):** Arjun (Product Specification) — Archie and Rad to follow once scoped.
- **Status:** **Approved – Product Baseline Complete (Ready for UX Architecture)**
- **Delivery State:** Product Baseline Complete — Awaiting Sophie UX Architecture (see `EBC-R1.3-WS3-006` for the four scoped Open Questions gating specific modules only)
- **Architecture:** Pending
- **Engineering:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** Not yet defined — to be established during Arjun's Product Specification.
- **Notes:** Originated during Release 1.3 planning and formally accepted into the release per the Product Owner's decision of 09-Sep-2026. Product Discovery workshop decisions captured and filed under `DEC-R1.3-004`/`docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` — vision, user model, dashboard philosophy, operational queues, journey lifecycle, business objects, business rules and Release 1.3 MVP scope. **Resolved 09-Sep-2026 (Product Owner decision, following `EBC-R1.3-RM-002`):** this discovery capture and this feature entry are correctly and permanently associated — confirmed, not merely provisional. Feature renamed from "Team Member Portal" to "SMV Workspace" to match the agreed product vision. `FEAT-R1.3-007` (Customer Identity & Member Experience) remains a fully separate feature; no content moves between the two. The five gaps recorded in the source document's §12 (role capabilities, lifecycle stage detail, object/rule definitions, MVP deferred list) are Product Owner-designated **refinement items for Arjun's Product Specification** — explicitly not a reason to reopen Product Discovery.

### FEAT-R1.3-014 — Governance & Release Closure

- **Feature ID:** FEAT-R1.3-014
- **Related Workstream:** None — release-level scope spanning all workstreams, not a single WS#.
- **Business Objective:** Carry Release 1.3 through the standard Team Satvi delivery lifecycle to a Product Owner release decision — consolidated status, independent functional and traveller-experience validation, and release closure documentation.
- **Business Value:** Ensures the release reaches the market in a validated, low-risk state, with findings from every persona kept separate rather than merged into false consensus.
- **Story Points:** Not yet estimated
- **Estimated Hours:** Not yet estimated
- **Dependencies:** All other workstreams reaching Complete or an explicitly accepted deferral (see Section 4, "Implementation Complete" milestone).
- **Team Satvi Owner(s):** Tiger (consolidation) / Keerthi (functional QA) / Sri (traveller experience) / Vivek (release decision)
- **Status:** Not Started
- **ROI:** Not yet estimated
- **Acceptance Criteria:** Release Checklist (Section 12) Delivery and Quality items satisfied; Functional QA and Traveller Experience QA milestones (Section 4) complete; Production Release milestone reached with Business Owner approval.
- **Notes:** Precedented by `RELEASE-1.2.md`'s equivalent closure sections (§15–18) at the close of Release 1.2.

## 15.4 Traceability Confirmation

Every row in the Master Workstream Tracker (Section 5) maps to at least one Feature Register entry above:

| Workstream (Section 5) | Feature Register Entry |
|---|---|
| WS1 | FEAT-R1.3-001 |
| WS2 | FEAT-R1.3-002 |
| WS3 | FEAT-R1.3-003, FEAT-R1.3-004 |
| WS4 | FEAT-R1.3-005 |
| WS5 | FEAT-R1.3-006 |
| WS6 | FEAT-R1.3-007 (interim mapping — see FEAT-R1.3-007 Notes) |
| WS7 | FEAT-R1.3-008 |
| WS8 | FEAT-R1.3-009 |
| WS9 | FEAT-R1.3-010 |
| WS10 | FEAT-R1.3-011 |
| WS11 | FEAT-R1.3-013 (SMV Workspace) |
| *(none — release-level)* | FEAT-R1.3-014 (Governance & Release Closure) |

No duplicate planning information is introduced: every entry above cross-references Section 5 and/or `RELEASE-1.3-WORKSTREAM-PLAN.md` for detail rather than restating it, per the single-source-of-truth requirement.
