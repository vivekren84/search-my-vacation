# EBC-R1.3-WS11-004 — SMV Workspace Architecture Baseline & Engineering Readiness

| Document Information | |
|---|---|
| Document Name | SMV Workspace Architecture Baseline & Engineering Readiness Review |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| Feature | FEAT-R1.3-013 — SMV Workspace |
| EBC | EBC-R1.3-WS11-004 — SMV Workspace Architecture Baseline & Engineering Readiness |
| Last Updated | 15 September 2026 |
| Predecessor | `EBC-R1.3-WS11-003` (Solution Architecture & Technical Design) and its six deliverables under `docs/20-Architecture/workspace/` |
| Nature of this EBC | Governance and readiness review only — no architecture redesign, no new architecture, no Product or UX change, no engineering planning, no code, no commit, no push |

---

## 1. Executive Summary

The SMV Workspace Architecture package (six documents under `docs/20-Architecture/workspace/`) has been reviewed at the package level for internal consistency, for traceability back to the Release 1.3 Product Baseline (`DEC-R1.3-006`) and UX Baseline (`DEC-R1.3-007`), and for sufficiency as an Engineering and QA starting point.

**Finding:** The Architecture phase is internally consistent, fully traceable to the approved Product and UX baselines, and ready for Engineering to begin.

Following completion of this review, the Product Owner has ratified the remaining architectural decisions:

- AD-WS11-002 — Supabase Authentication and Row Level Security
- AD-WS11-006 — Destination Profile / `geo_places` separation
- OQ-001 — Administrator and Privilege User operating model

Accordingly, no outstanding Product decisions remain that prevent Engineering from implementing the approved WS11 Architecture baseline.

Since `EBC-R1.3-WS11-003` closed, the Product Owner has refined all six documents directly in the repository (confirmed by file-modification timestamps and content review, §2 below) — most materially, correcting Vendor lifecycle terminology to "Inactive" (Domain Model §2.8) and reflecting Tiger's 13-September Stage 3 decision rewriting BR-007 (Domain Model §4.3, Architectural Decisions AD-WS11-011). Both refinements were checked against the Product Specification v2.0/RTM v2.0 during this review and are correctly and consistently reflected across the package (§3 below).

This review introduces no new architecture, resolves no Product decision, and modifies no Product, UX or existing Architecture document. It is a certification and handover activity only, per this EBC's own explicit scope.

## 2. Architecture Package Review

### 2.1 Repository Readiness Check

| Check | Result |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed, folder connected this session |
| Branch | `main` |
| Working tree | Not clean before this task — six pre-existing untracked items: five `Claude outputs/*.md` reports and `docs/20-Architecture/workspace/` itself (the six architecture deliverables, uncommitted since `EBC-R1.3-WS11-003`, per this project's established convention of leaving new documentation for the Product Owner's own commit). None of these were created or touched by this review beyond what §6 of this document records. |
| Remote sync | `main` up to date with `origin/main` |
| `docs/20-Architecture/workspace/` | Exists, contains exactly the six expected files, no extras, no missing deliverable |
| Repository structure | No folder created, renamed or moved by this review (Repository Structure Governance honoured) |
| Housekeeping note | A stale, empty `.git/index.lock` file was observed in the working tree during a prior session's verification step (unrelated to this review, not created by any Archie activity). Restated here for visibility; not actioned, as this EBC does not authorise Git operations beyond read-only status checks. |

### 2.2 Deliverable Completeness

All six deliverables named by `EBC-R1.3-WS11-003` are present, each carrying a "Status: Complete — for Product Owner / Tiger review" document-information line and each ending with Archie's standard attribution:

1. `WORKSPACE-ARCHITECTURE-DISCOVERY.md`
2. `WORKSPACE-SOLUTION-ARCHITECTURE.md`
3. `WORKSPACE-DOMAIN-MODEL.md`
4. `WORKSPACE-DATA-ARCHITECTURE.md`
5. `WORKSPACE-INTEGRATION-ARCHITECTURE.md`
6. `WORKSPACE-ARCHITECTURAL-DECISIONS.md`

No additional architecture document exists, and none was created by this review, consistent with this EBC's explicit constraint ("do not create additional architecture documents").

### 2.3 Product Owner Refinement and Ratification

Following completion of `EBC-R1.3-WS11-003`, the Product Owner conducted a detailed review of each architecture deliverable individually.

All six Architecture documents were reviewed, refined where necessary and subsequently approved.

The refinements consisted primarily of governance clarifications, improved business definitions and strengthened traceability to the approved Product and UX baselines rather than architectural redesign.

Following completion of this review, the Product Owner formally ratified the remaining architectural decisions that had intentionally been left open during Architecture Review.

These decisions are:

- **AD-WS11-002** — Adoption of Supabase Authentication and Row Level Security as the security foundation for SMV Workspace.
- **AD-WS11-006** — Confirmation that `geo_places` and `workspace_destination_profiles` represent separate business concepts with independent ownership responsibilities.
- **OQ-001** — Approval of the Administrator and Privilege User operating model, including platform governance responsibilities and self-service credential management.

With these decisions recorded, the Architecture package should now be considered fully ratified by the Product Owner.

No outstanding Product decisions remain that affect the approved WS11 Architecture baseline.

### 2.4 Internal Consistency Across the Six Documents

Cross-checked systematically rather than spot-checked:

- **Naming.** All six documents use "SMV Workspace" as the initiative name throughout (per the Product Owner's explicit instruction during `EBC-R1.3-WS11-003`), with "Journey Workspace" reserved for the one module of that name. The EBC-title/label mismatch is disclosed once (Architecture Discovery §1) and referenced, not repeated, elsewhere (Architectural Decisions AD-WS11-013). Consistent.
- **Module list and table ownership.** The nine-module-plus-Settings structure in Solution Architecture §4 matches the module→table mapping in Data Architecture §3 exactly, table for table, module for module. Consistent.
- **Open Question numbering and disposition.** OQ-001, OQ-006, OQ-008, OQ-012, OQ-014, OQ-018 through OQ-022 are referenced with the same architectural treatment everywhere they appear across Discovery §13, Domain Model, Data Architecture, Integration Architecture and the Architectural Decisions Deferred Decisions table (§4 there). No document proposes a different treatment for the same Open Question than another. Consistent.
- **Decision cross-references.** Every `AD-WS11-0XX` decision named inline in the five upstream documents (e.g. Solution Architecture §2's "AD-WS11-001", Data Architecture §4.3's "AD-WS11-002") has a matching, correctly numbered entry in the Architectural Decisions register, and no register entry lacks an upstream document reference. Consistent.
- **The two Proposed-not-Confirmed material decisions** (AD-WS11-002, Auth/RLS; AD-WS11-006, Destination Profile/`geo_places`) are flagged with the same "Proposed, requires sign-off" language in every document that touches them (Discovery §9/§12, Data Architecture §4.3, Integration Architecture §2.2, Architectural Decisions §3). No document overstates either as decided. Consistent.

No internal inconsistency was found across the package.

### 2.5 Consistency With the Product Baseline

Checked directly against `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` and `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` (both accepted as the Release 1.3 Product Baseline per `DEC-R1.3-006`):

- The Operational/Knowledge module grouping (Solution Architecture §4) traces exactly to Specification §8.4–§8.5.
- Every Business Object named in the Domain Model (§2.1–§2.11) traces to a named Specification §7 object; the one exception (`WorkspaceUser`, §2.12) is explicitly disclosed as an architecture-introduced entity, not asserted as a Product Business Object.
- Every Business Rule the package cites as an enforcement target (BR-006, BR-007, BR-010 through BR-019) matches the Specification §9 text current as of v2.0, including the BR-007 rewrite (§2.3 above).
- The package's treatment of Destination Intelligence (Integration Architecture §2.2) is consistent with, and directly responds to, Tiger's explicit Stage 3 routing instruction recorded in Specification §6.6: *"This is an Architecture concern rather than a Product concern. Carry this forward to Archie during Technical Architecture Review."* This review confirms that routing has now been acted on — a proposed, non-blocking reconciliation exists and is offered for ratification, not left unaddressed.
- OQ-018's disposition (~185 of 223 approved Functional Requirements remain topic-group-level only) is treated identically in the Architecture package and in the Product Baseline itself: not invented, not blocking this phase's completion, tracked as a separate, unscheduled Business Analysis activity.

No Product Specification, RTM, Business Lifecycle, or UX Design Brief content was found altered, restated incorrectly, or silently reinterpreted by the Architecture package.

### 2.6 Consistency With the UX Baseline

Checked directly against the six `docs/04-UX/workspace/` documents (accepted as the Release 1.3 UX Baseline per `DEC-R1.3-007`):

- The Solution Architecture's server/client boundary (§6: Server Components for reads, API routes for writes, Client Components only for claim/assign controls, tab navigation and form inputs) matches the UX Navigation Model's own description of these as "lightweight, non-navigating actions."
- The Master Itinerary → Traveller Itinerary relationship (Domain Model §2.7, AD-WS11-009) deliberately preserves the UX package's own plain-language "based on [Master Itinerary]" treatment (A-UX-04) rather than introducing new user-facing or schema notation the UX package did not anticipate.
- "Role TBC" screens and actions in the UX Screen Inventory are addressed architecturally (Discovery §13, OQ-001 row: a two-role RBAC mechanism is introduced now, with a conservative Administrator-only default, so implementation is not blocked on the capability matrix) without the Architecture package inventing the capability split itself.
- The terminology conflict Sophie's own UX Discovery already flagged once (A-UX-01/A-UX-02) is neither repeated as a new finding nor silently dropped — the Architecture package restates it (Discovery §11 R-ARCH-04, Architectural Decisions AD-WS11-012) and adopts a working default (Specification/RTM vocabulary) without asserting the documentation-governance question itself is resolved.

No UX Architecture deliverable was found contradicted by the Architecture package.

### 2.7 Consistency With Release 1.3 Scope and Team Satvi Governance

- No capability appears in the Architecture package that is not traceable to an Approved Product Specification/RTM item — checked against §2.5 above; the one architecture-introduced entity (`WorkspaceUser`) is explicitly disclosed, not smuggled in as a Product concept.
- Persona boundaries were respected throughout package authorship: Archie proposed, but did not unilaterally decide, the two material items (AD-WS11-002, AD-WS11-006); Archie did not resolve the Inquiry/Lead terminology conflict, which is Tiger/Arjun's to resolve (AD-WS11-012); Archie did not redesign UX or invent Functional Requirement wording.
- The package consistently uses this project's established disclose-rather-than-resolve convention (the WS3/WS4 naming-collision precedent in `RELEASE-1.3.md` is cited directly in the Discovery document, §1) for both the naming mismatch and the terminology conflict.

## 3. Traceability Review

Product → UX → Architecture → Engineering traceability was verified for every architecturally significant capability, not sampled:

| Capability | Product | UX | Architecture | Traceability |
|---|---|---|---|---|
| Operational vs. Knowledge module split | Specification §8.4–§8.5 | Information Architecture §4 (Dashboard framing), UX Discovery module grouping | Solution Architecture §4 | Complete |
| Generic Ownership Model (Claim/Assign/Reassign) | Specification §8.1 | User Journeys, Interaction Flows (claim/assign UI) | Domain Model §4.1, Data Architecture §4.2 | Complete |
| Lifecycle independent of ownership/designation | Specification §8.2–§8.3 | (not UX-specific — a data-layer invariant) | Domain Model §4.2 | Complete |
| Vendor Active/Inactive terminology | Specification §7.7, FR-VM-01/04 (Tiger, 13-Sep-2026) | — | Domain Model §2.8 | Complete (verified this review, §2.3) |
| BR-007 archive-only rewrite | Specification §9 (Tiger, 13-Sep-2026) | — | Domain Model §4.3, Data Architecture §7, AD-WS11-011 | Complete (verified this review, §2.3) |
| Master Itinerary → Traveller Itinerary | Specification §7.6/7.6a, PD-IS-001-003 | Screen Inventory, A-UX-04 plain-language treatment | Domain Model §2.7, AD-WS11-009 | Complete |
| Journey Planning Record → Journey conversion (one-way) | Specification §7.3/7.4, BR-012, PD-JW-001 | User Journeys (conversion moment) | Domain Model §2.3-2.4, Data Architecture §6 | Complete |
| Destination Profile governance lifecycle | Specification §7.14, PD-DI-001-006 | Screen Inventory (Draft/Under Review/Approved states) | Integration Architecture §2.2, AD-WS11-006 (Proposed) | Complete, pending ratification |
| Notification Informational/Action Required model | Specification §7.12, PD-NO-003/004 | Navigation Model (attention layer) | Domain Model §2.10, Solution Architecture §5 | Complete |
| Role-based access (Administrator/Privilege User) | Specification §8, OQ-001 open | Screen Inventory "Role TBC" markers | Discovery §13, Data Architecture §4 (mechanism ready, matrix pending) | Complete, mechanism ready, matrix pending Product confirmation |

No capability was found present in the UX Baseline without a corresponding Architecture treatment, and no Architecture capability was found without a Product or UX origin (other than the disclosed `WorkspaceUser` entity, §2.5 above).

## 4. Engineering Readiness

Assessed against Project Instructions §16.5 (Rad Prerequisites) and this EBC's own Engineering Readiness Review instruction:

| Prerequisite | Status |
|---|---|
| Local repository access, root, branch, Git status | Confirmed (§2.1) |
| Approved EBC | This review formally hands the Architecture baseline to Rad on Product Owner approval of the two Proposed decisions (§4.1) |
| Acceptance criteria | Present at Product (Specification §9, RTM), UX (Screen Inventory) and Architecture (Architectural Decisions §6) level for every module in scope |
| Content readiness | Sufficient for the level the Product Baseline itself is Approved to (Vision, Business Purpose, Business Objects, Business Rules); field-level FR wording remains pending for ~185 items (OQ-018), a known and disclosed gap, not an Architecture blocker |
| Asset readiness | No new brand/visual asset required by the Architecture package itself; component-library gap noted as a risk (§6, R-ARCH-06) |
| Required environment-variable names | Not yet enumerated — an engineering-planning-level task against Data Architecture §4 (Supabase Auth) and Integration Architecture §3 (Resend, conditional); correctly left to Rad's own engineering planning, not invented here |
| Relevant documentation | Complete — all six Architecture documents plus the Product/UX baselines they trace to |
| Dependency availability | No new dependency proposed beyond Supabase Auth (already part of the existing Supabase platform, not a new vendor); no UI component/data-grid library selected yet (§6) |
| Browser/local application access | Not applicable to this governance review |
| Absence of unresolved material conflicts | Two flagged (AD-WS11-002, AD-WS11-006), both non-blocking to *starting* work on unaffected modules (§4.1) |

### 4.1 Readiness Verdict

**Overall: Ready, with two named conditions.**

Genuine blockers (would prevent correct implementation if ignored):

- **None.** Every module boundary, table, and entity in the package is specified to a level Rad can begin building against.

### Product Owner Ratification

The Product Owner has approved all architectural decisions identified as prerequisites during this review.

Accordingly:

- Supabase Authentication and Row Level Security are approved as the Workspace security foundation.
- Destination Profile and `geo_places` remain independent business concepts with separate ownership.
- The Administrator and Privilege User operating model has been approved.

Engineering is therefore authorised to implement the complete WS11 Architecture baseline without awaiting further Product clarification.

### 4.2 Recommended Engineering Starting Point

Per this EBC's instruction (a readiness assessment, not implementation planning), at a sequencing level only:

1. **Foundational, unconditional work first:** the `shared/` module (ownership columns, audit log, notification emitter scaffold) and the `web/lib/workspace/` directory/file-convention scaffolding — nothing here depends on AD-WS11-002 or AD-WS11-006.
2. **In parallel, Product Owner ratification of AD-WS11-002 and AD-WS11-006** — the two items this review found genuinely gating, so they are resolved before, not during, the modules that depend on them.
3. **Operational modules** (Journey Planning, Journey Workspace) once AD-WS11-002 is confirmed, since both require the RBAC/RLS mechanism for any meaningful claim/assign behaviour.
4. **Knowledge modules** (Traveller Hub, Itinerary Studio, Vendor Management) alongside Operational modules — no cross-dependency blocks parallel work here.
5. **Destination Intelligence last among the modules**, once AD-WS11-006 is confirmed, given its schema depends directly on that decision's outcome.

Detailed task breakdown, estimation, and migration sequencing remain Rad's own Engineering Planning activity following Product Owner approval — not produced here, per this EBC's explicit constraint.

## 5. QA Readiness

Assessed against Project Instructions §16.6 (Keerthi Prerequisites) and this EBC's own QA Readiness instruction:

- **Traceability** — sufficient; §3 above gives Keerthi a direct Product-requirement-to-architecture-capability map to design test scenarios against.
- **Business invariants** — explicit and testable: Domain Model §5's Business Invariants Summary table names each rule and its enforcement mechanism (e.g. BR-010's partial unique index, BR-012's single-conversion-path rule) in a form Keerthi can turn directly into negative test cases (attempt a duplicate Journey Planning Record; attempt to create a Journey outside the conversion RPC).
- **Lifecycle definitions** — explicit for every object carrying one (Journey Planning Record's seven-stage lifecycle, Journey's status set, Vendor's Prospective/Active/Inactive, Destination Profile's Draft/Under Review/Approved) — sufficient for state-transition test design.
- **Module ownership** — explicit (Solution Architecture §4.1, Data Architecture §3) — sufficient for Keerthi to scope regression boundaries per module.
- **Integration boundaries** — explicit (Integration Architecture §2) — sufficient for Keerthi to plan boundary/adjacent-feature regression checks (e.g. confirming a Lead ingested from `journey_passport_leads` never causes a write back to that table).

**No missing architectural information was found that would prevent QA scenario preparation at the level this Architecture package is written to.** Field-level validation-rule test cases for the ~185 undrafted Functional Requirements (OQ-018) cannot be written until that Business Analysis activity produces them — a Product-content gap, not an architecture-documentation gap, and outside this review's remit to close.

## 6. Outstanding Product Decisions

Per this EBC's instruction, identified and assessed for blocking status, not resolved:

| Decision | Status | Engineering Impact |
|-----------|--------|--------------------|
| AD-WS11-002 – Supabase Authentication and Row Level Security | ✅ Approved | No blocker |
| AD-WS11-006 – Destination Profile / `geo_places` separation | ✅ Approved | No blocker |
| OQ-001 – Administrator and Privilege User operating model | ✅ Approved | No blocker |
| OQ-008 – Notification delivery channel | Deferred | Non-blocking |
| OQ-012 – Lead / Journey Passport relationship | Deferred | Non-blocking |
| OQ-014 – Document storage | Deferred | Non-blocking |
| OQ-018 – Detailed Functional Requirements | Deferred | Separate Business Analysis activity |
| OQ-020 – Legacy quotation terminology | Deferred | Non-blocking |
| OQ-021 – Master / Traveller itinerary notation | Deferred | Non-blocking |
| OQ-022 – Ownership model extensions | Deferred | Non-blocking |

## 7. Implementation Risks

Carried forward from Architecture Discovery §11, reassessed at this closure point rather than repeated verbatim:

| ID | Risk | Current status |
|---|---|---|
| R-ARCH-01 | No authentication/authorisation precedent existed in this repository | Addressed by a complete, proposed design (AD-WS11-002); risk now sits with *approval timing*, not design absence |
| R-ARCH-02 | Destination Profile/`geo_places` unreconciled | Addressed by a complete, proposed design (AD-WS11-006); same approval-timing risk |
| R-ARCH-03 | ~185 undrafted Functional Requirements | Unchanged — a Product-content risk, tracked by Tiger as a separate activity, not resolved by this Architecture phase |
| R-ARCH-04 | Inquiry/Lead terminology conflict | Unchanged by design (per Product Owner instruction not to resolve it here) — remains open for Tiger/Arjun |
| R-ARCH-05 | EBC title/label vs. repository naming mismatch | Fully mitigated within this document set (AD-WS11-013); the EBC series' own labelling is outside Archie's authority to correct |
| R-ARCH-06 | No UI component/data-grid library exists for a dense internal operational interface | **Unchanged, and now logged as a Future Consideration** (§9 below) — a genuine gap this closure review found not yet tracked anywhere in the repository's governance register |

No new risk beyond R-ARCH-01 through R-ARCH-06 was identified during this closure review.

## 8. Recommended Engineering Entry Point

The Product Owner has now ratified all architectural decisions identified by this review.

Engineering may therefore proceed according to the recommended implementation sequence without further architectural dependency or Product clarification.

Detailed task decomposition, sprint planning and implementation sequencing remain Rad's Engineering responsibility.

## 9. Release Governance Impact

Architecture completion changes Release status for WS11 and warrants a tracker update, mirroring the precedent already established twice for this same workstream (`DEC-R1.3-006` for the Product Baseline, `DEC-R1.3-007` for the UX Baseline). This review's tracker updates (§6 of the accompanying change record) are:

- `RELEASE-1.3.md` §5 (WS11 row): Architecture phase marked complete, next step recorded as Rad/Engineering (subject to §4.1's two conditions), Open Questions restated at their current, unchanged count.
- `RELEASE-1.3.md` §3 (dashboard progress note) and §7 (new decision, `DEC-R1.3-008`, certifying the Architecture Baseline and Ready for Engineering, mirroring `DEC-R1.3-006`/`DEC-R1.3-007`'s precedent exactly).
- `RELEASE-1.3-FEATURE-REGISTER.md` (`FEAT-R1.3-013` row): status advanced to reflect Architecture complete.
- `FUTURE-CONSIDERATIONS.md` §5.1: a new Workstream Closure Review Log entry for the Architecture phase (the same mandatory check Tiger performed at the two prior phase closures), and one new entry, **FCR-023** (§3, new), for the R-ARCH-06 UI component/data-grid gap identified during this review and not previously tracked anywhere in this register.

No Product Specification, RTM, Business Lifecycle, UX Design Brief, or UX Architecture document is touched by any of the above — all changes are confined to `docs/10-Backlog/`.

## 10. Architecture Baseline Certification

On the basis of §2 through §9 above, this review certifies that the SMV Workspace Architecture package (the six documents under `docs/20-Architecture/workspace/`, as refined by the Product Owner and re-verified in this review) is:

- [x] **Internally consistent** — §2.4.
- [x] **Aligned with Product** — §2.5, §3.
- [x] **Aligned with UX** — §2.6, §3.
- [x] **Aligned with Release 1.3 scope and Team Satvi governance** — §2.7.
- [x] **Ready for Engineering**, subject to the two named conditions in §4.1 — §4.
- [x] **Ready for QA** — §5.

**The Architecture phase for WS11 – SMV Workspace is formally closed.**

The Product Owner has ratified all architectural decisions identified during this review.

Engineering (Rad) may now commence implementation of the complete approved WS11 Architecture baseline.

QA (Keerthi) may proceed with detailed test planning and traceability against the approved Product, UX and Architecture baselines.
---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-004`.*
This document records the successful completion of the WS11 Architecture phase and the subsequent Product Owner ratification of all remaining architectural decisions.

The SMV Workspace Architecture baseline is therefore complete and formally handed over to Engineering (Rad) and QA (Keerthi) for implementation and validation as part of Release 1.3.