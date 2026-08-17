# Search My Vacation Website

# Release 1.2 Master Planning & Tracking Document

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.2 Master Planning & Tracking Document |
| Version | 1.8 |
| Status | Draft — Active Implementation |
| Origin EBC | R1.2-001 (see Document Change History below for every EBC that has updated this document) |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Single source of truth for Release 1.2 planning, execution, QA, decision tracking and release readiness |
| Baseline | Release 1.1 — `v1.1.0` |
| Related | `docs/10-Backlog/RELEASE-1.2-BACKLOG.md` (source roadmap ideas), `docs/09-Development/PROJECT-HISTORY.md`, `docs/10-Backlog/RELEASE-1.1-MASTER-TRACKER.md` (R1.1 precedent), `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (governing architecture for Destination Intelligence) |
| Last Updated | 17 August 2026 |

**EBC Numbering Convention:** Release 1.2 EBCs use a release-based numbering sequence rather than the legacy `EBC-0xx` numbering used through Release 1.1. **R1.2-001** created this document; **R1.2-002** added Journey Passport OTP Verification planning; **R1.2-003** added Homepage Simplification and Destination Intelligence Enhancements planning; **R1.2-004** implemented the Homepage Mood Experience refinement; **R1.2-005** completed the Mood Card Luxury Balance Pass; **R1.2-006** completed the Sri Traveller Experience Review; **R1.2-007** completed Workstream 2 Product Analysis; **R1.2-008** consolidated the tracker as Version 1.5; **R1.2-009** completed Workstream 2 UX Implementation; **R1.2-010** completed Workstream 2 Engineering Completion; **R1.2-011** completed Workstream 2 Functional QA; **R1.2-012** completed Workstream 2 Traveller Experience Validation; **R1.2-013** closed Workstream 2 and consolidated the tracker as Version 1.6; **R1.2-014** completed an independent Homepage Architecture Validation Review (Arjun — Product/IA; Sophie — UX/Visual Hierarchy) re-confirming Workstream 1 and 2 outcomes against the live implementation — **this EBC is explicitly NOT the tracker's Workstream 3** (Destination Intelligence remains Workstream 3's approved scope; see both reviewers' own Section 0.1 scope notes) and is numbered sequentially here specifically to avoid that confusion; **R1.2-015** performed this documentation-alignment pass, filed R1.2-014's findings into their proper sections below, and confirmed Workstream 3 required no change; and **R1.2-016** added a reference to the newly-created `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (authored under `ADR-R1.2-WS3-EBC-ARCHIE-001`) as the governing architecture document for Destination Intelligence — see Section 6.3. Future Release 1.2 cards continue sequentially from `R1.2-017`. This convention does not renumber or otherwise affect existing `EBC-0xx` cards from Release 1.0/1.1.

---

## Document Change History

| Version | Date | Author | EBC | Summary |
|---|---|---|---|---|
| 1.0 | 15-Aug-2026 | Rad | R1.2-001 | Initial Release 1.2 Master Planning & Tracking Document created. All 8 approved workstreams, 84 tracked tasks, initial decision log, open decisions, future candidates, risk register and dependency tracker established. |
| 1.1 | 15-Aug-2026 | Rad | R1.2-001 | Adopted the release-based EBC numbering convention (R1.2-001 onward); moved the Change Log here as Document Change History, immediately after Document Information; added a new Release Milestones section (Section 4), renumbering all subsequent sections; added task R1.2-05.17 (phone number normalization to E.164); added tasks R1.2-06.12 and R1.2-06.13 (remove an individual selected destination; preserve selection order); added decision DEC-R1.2-005 (multi-destination selection) and open decision OPEN-R1.2-005 (geographic dataset maintenance strategy); total tracked task count updated from 84 to 87. |
| 1.2 | 15-Aug-2026 | Rad | R1.2-002 | Added the Journey Passport OTP Verification scope to Workstream 5 (renamed to International Phone Number & OTP Verification), including updated Goal, Business Value and Acceptance Criteria; appended 18 new tasks R1.2-05.18–R1.2-05.35; added decision DEC-R1.2-006 (Journey Passport-only OTP policy), open decision OPEN-R1.2-006 (future OTP expansion), risk RISK-R1.2-010 (OTP delivery/outage risk) and a Future Release Candidates entry (OTP for additional lead-capture forms); added a WS5→WS4 dependency note; total tracked task count updated from 87 to 105. Documentation only — no application code, architecture or configuration changed. |
| 1.3 | 15-Aug-2026 | Rad | R1.2-003 | Added homepage simplification decisions (DEC-R1.2-007 remove Escape mood card, DEC-R1.2-008 rename Memory Maker/Family to Memory Makers and remap it to Photography, DEC-R1.2-009 retire Experiences from the homepage and primary navigation without deleting the page or its URL) and destination intelligence decisions (DEC-R1.2-010 weighted Primary/Secondary/Tertiary Journey and Memory destination preference model as the preferred Journey Director recommendation model; DEC-R1.2-011 Journey Passport traveller name field to prevent numeric characters); renamed Workstream 3 to Destination Intelligence and added 19 new tasks across Workstreams 1–4 (R1.2-01.12–01.15, R1.2-02.10–02.13, R1.2-03.07–03.15 including 3 Wildlife destination tasks, R1.2-04.10–04.11); updated Goal/Business Value/Acceptance Criteria for Workstreams 1–4; resolved and retired OPEN-R1.2-001 and OPEN-R1.2-002 (superseded by DEC-R1.2-009) and closed RISK-R1.2-002; added RISK-R1.2-011 (weighted destination preference model's impact on Journey Director recommendation output) and a Future Release Candidates entry (Destination Intelligence expansion metadata); total tracked task count updated from 105 to 124. Documentation only — no application code, architecture, configuration or Journey Director logic changed. |
| 1.4 | 16-Aug-2026 | Rad | R1.2-004 | Implemented the Workstream 1 Homepage Mood Experience refinement: completed the Trust Strip premium redesign and initial Mood Card treatment, removed Escape, renamed and remapped Memory Makers, and rebalanced the five-card homepage layout. Workstream 1 implementation moved through engineering cleanup and functional validation. |
| 1.4 | 16-Aug-2026 | Rad | R1.2-005 | Completed the Homepage Mood Cards Luxury Balance Pass, adopting the approved champagne-glass treatment to retain premium warmth while protecting readability against the Golden Hour Hero. Affected Workstream 1 only; no release scope change. |
| 1.4 | 16-Aug-2026 | Sri | R1.2-006 | Completed the independent Traveller Experience Review for Workstream 1. Accepted observations were recorded for Memory Makers recognition, desktop hover affordance and mobile first-fold visibility; no release-blocking defect was identified. |
| 1.4 | 16-Aug-2026 | Arjun | R1.2-007 | Completed Workstream 2 Product Analysis covering Experiences/Journey Mood overlap, taxonomy, navigation, SEO, redirects, Journey Passport and homepage implications. Analysis tasks were closed, implementation requirements were made ready, and the Product Owner approved the resulting temporary public-retirement decision recorded as DEC-R1.2-012 without changing release scope. |
| 1.5 | 16-Aug-2026 | Rad | R1.2-008 | Consolidated all approved Release 1.2 information through R1.2-007; reconciled dashboard, milestone, workstream, task, decision, dependency, checklist and observation status; added DEC-R1.2-012; and completed numbering and cross-reference QA. Affected Workstreams 1, 2 and 7. Documentation only. |
| 1.5 | 16-Aug-2026 | Sophie | R1.2-009 | Implemented the approved Workstream 2 UX changes: removed the "Journey Invitations" section from the Homepage and the Experiences entry from Header and Footer navigation, extracting the removed section verbatim into a new, unimported `JourneyInvitations.tsx` component to preserve it for future reuse. No page or route deletion. Handed off to Rad for the guest-facing redirect. |
| 1.5 | 16-Aug-2026 | Rad | R1.2-010 | Completed Workstream 2 engineering: added a temporary (307, non-permanent) guest redirect from `/experiences` to the Homepage via `next.config.ts`; confirmed by repository-wide search that no intentional internal link to Experiences remains anywhere in the live app; confirmed `JourneyInvitations.tsx` is preserved and unimported. ESLint, TypeScript and production build all passed. No page, route or implementation was deleted. |
| 1.5 | 16-Aug-2026 | Keerthi | R1.2-011 | Completed Workstream 2 Functional QA. 24 of 25 checks passed with 0 defects found; 1 check (a dedicated tablet-width responsive pass) was blocked by test-tooling limitations rather than a product issue, with partial incidental evidence showing no breakage. Confirmed no normal guest interaction reaches the retired Experiences feature. Recommendation: PASS. |
| 1.5 | 16-Aug-2026 | Sri | R1.2-012 | Completed Workstream 2 independent Traveller Experience Validation. Found the retirement makes the homepage read as simpler and more complete, with a seamless Hero-to-Destinations transition and no sense that anything is missing. No material improvements identified. Recommendation: Approve for Workstream 2 Closure. |
| 1.6 | 16-Aug-2026 | Rad | R1.2-013 | Closed Workstream 2 following completed Product Analysis (R1.2-007), UX Implementation (R1.2-009), Engineering Completion (R1.2-010), Functional QA (R1.2-011) and Traveller Experience Validation (R1.2-012). Reconciled dashboard, milestone, workstream, task, dependency, checklist and programme-metric status; verified the decision log and all numbering/cross-references remain consistent. Workstream 3 (Destination Intelligence) is now the next active implementation stream. Documentation only — no application code, routing or Product Decisions were changed. |
| 1.7 | 16-Aug-2026 | Arjun / Sophie | R1.2-014 | Completed an independent Homepage Architecture Validation Review of the live, implemented homepage — Arjun (Product/Business/IA) and Sophie (UX/Visual Hierarchy) each re-derived findings directly from the current repository rather than citing the WS1/WS2 chain alone. Both independently found no new evidence to reopen DEC-R1.2-009/012 (Experiences retirement) and confirmed the ten-section homepage narrative is coherent and release-ready. Both also independently flagged, in their own Section 0.1, that this review's informal "WS3" card title conflicts with the tracker's real Workstream 3 (Destination Intelligence) and recommended it be filed under its own sequential EBC number instead — adopted here as R1.2-014. New findings (Trust Points icon treatment and imagery, Header tablet-range CTA breakpoint, Contact Preview CTA routing, an unused colour-token system, an orphaned off-brand Experiences component) are recorded as new Open Product Decisions (Section 8), a new Decision Log entry (DEC-R1.2-013) and a new Technical Debt Register (Section 13). No code, design or configuration was changed; Workstream 3's own scope was left untouched. |
| 1.7 | 17-Aug-2026 | Rad | R1.2-015 | Documentation alignment pass (EBC `R1.2-WS3-EBC-RAD-001`). Confirmed this tracker already reflected the implemented homepage as of v1.6 (R1.2-013) — Workstream 1 and Workstream 2 fully documented and Complete. Identified that this EBC's own Task 1/2/6 instructions (rename Workstream 3 to "Homepage Architecture Optimisation"; rewrite R1.2-03.01–03.04) would have misapplied R1.2-014's homepage findings onto the tracker's unrelated, still-Proposed Destination Intelligence workstream; escalated to the Product Owner per Project Instructions Section 35 rather than silently resolving the conflict. Per the Product Owner's direction: Workstream 3 and its tasks (R1.2-03.01–03.15) were left entirely unchanged; R1.2-014's findings were instead filed under their own EBC number into the Decision Log (DEC-R1.2-013), Open Product Decisions (OPEN-R1.2-007–009) and a new Technical Debt Register (Section 13); a stale "Version 1.5" reference and a stale decision-log-through-DEC-012 reference in the Release Checklist (Section 12) were corrected to match the current version. Documentation only — no application code, architecture, Workstream 3 scope or Product Decisions were changed. |
| 1.8 | 17-Aug-2026 | Archie | R1.2-016 | Created `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (authored under EBC `ADR-R1.2-WS3-EBC-ARCHIE-001`), the permanent Architecture Decision Record formalising the Destination Knowledge Governance architecture reviewed across Workstream 3 (`R1.2-03.01`–`03.04`). The ADR is a faithful, non-reinterpreting restatement of the already-agreed architecture — no architectural decision, principle, or investigation finding was changed. ADR status recorded as Proposed, pending Vivek's formal ratification (see the ADR's own Decision History). This tracker's Document Information "Related" field and Workstream 3 section (6.3) now reference the ADR as the governing architecture document for Destination Intelligence; future Workstream 3 implementation EBCs (`R1.2-03.07` onward) should treat it as their primary architectural prerequisite. As with `R1.2-03.02`–`03.04` before it, this EBC's own native ID (`ADR-R1.2-WS3-EBC-ARCHIE-001`) does not follow the sequential `R1.2-0XX` convention; it is recorded here as `R1.2-016` per that convention's own stated purpose (tracking every EBC that updates this document), consistent with how `R1.2-015` recorded `R1.2-WS3-EBC-RAD-001`. Documentation only — no application code, runtime configuration, generator, workbook, or recommendation logic was changed. |

---

This document is a **living document**. It is maintained continuously throughout Release 1.2 — from idea through discussion, approval, implementation, QA, release and retrospective — so that no product decision is lost to chat history.

---

# 1. Release Overview

## Release Vision

Release 1.2 deepens the traveller experience established in Release 1.1 through premium visual refinement, clearer information architecture, smarter destination intelligence and improved data quality — without expanding into feature bloat.

## Release Goals

- Refine the Journey Mood visual system while preserving the approved illustration style and brand identity.
- Resolve overlap and ambiguity between Experiences and Journey Moods.
- Make Featured Destinations a smarter entry point into the Journey Passport.
- Close known Journey Passport entry-context defects.
- Support international travellers through proper phone number internationalisation.
- Improve destination data quality through autocomplete and validation.
- Maintain release governance and documentation discipline established in Release 1.1.

## Business Objectives

- Improve perceived premium quality of the homepage experience.
- Reduce traveller confusion between overlapping product concepts.
- Improve lead data quality (destinations, phone numbers).
- Widen accessibility to international travellers.
- Reduce defect load carried over from Release 1.1.

## Success Criteria

- All 8 approved workstreams reach Complete or an explicitly accepted deferral.
- No known functional release blocker remains open at Gate review.
- Functional QA (Keerthi) and Traveller Experience (Sri) validation both complete independently.
- Production build, TypeScript and ESLint checks pass cleanly.
- Product Owner (Vivek) grants final release approval.

## Current Status

**Implementation in Progress.** Workstream 1 is ✅ Complete, including the Trust Strip redesign, Mood Card refinement, Luxury Balance Pass, functional QA, Traveller Experience Review and Business Acceptance. Workstream 2 is now also ✅ Complete: Product Analysis (R1.2-007), UX Implementation (R1.2-009), Engineering Completion (R1.2-010), Functional QA (R1.2-011) and Traveller Experience Validation (R1.2-012) have all closed with no open defects, and the Product Owner has approved Workstream 2 for closure. An independent Homepage Architecture Validation Review (R1.2-014, Arjun and Sophie) has since re-confirmed both workstreams' outcomes against the live homepage, with no recommendation to reopen either — see Section 13. Workstream 3 (Destination Intelligence) remains unaffected by that review and is now the next active implementation stream. Remaining workstreams continue according to the Release 1.2 roadmap.

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

Each workstream and task in this document moves through this sequence independently — see Section 14 for status definitions, and Section 4 for the release-level milestone checkpoints that track overall progress through this sequence.

## Release Owner

Vivek (Product Owner / Business Owner) — final decision and release authority.

Tiger (Programme & Delivery Lead) — owns this document and consolidates delivery status.

## Last Updated

17 August 2026

## Document Version

1.7

---

# 2. Guiding Principles

Release 1.2 exists to refine, not to expand. Every workstream should be evaluated against these principles before and during implementation:

- Premium refinement over feature bloat.
- Traveller-first experience.
- Preserve Golden Hour branding and the approved explorer identity.
- Improve data quality (destinations, phone numbers) over adding new data capture.
- Improve discoverability without adding navigational complexity.
- Reduce friction in existing journeys rather than introducing new ones.
- Maintain simplicity — resist speculative functionality.
- Build future-ready foundations (e.g. E.164 phone storage, real-place validation) without over-engineering for hypothetical future needs.

These principles apply to every product, UX, architecture, engineering, content and validation decision made under this release.

---

# 3. Release Status Dashboard

| Metric | Current Value | Notes |
|---|---|---|
| Overall Progress | Implementation in Progress | 2 of 8 workstreams are ✅ Complete (Workstream 1, Workstream 2); Workstream 3 (Destination Intelligence) is now the next active implementation stream. An independent Homepage Architecture Validation Review (R1.2-014) has re-confirmed Workstreams 1 and 2 with no recommendation to reopen either; it does not change this count. |
| Number of Workstreams | 8 | All are approved release scope; individual lifecycle statuses are recorded in Section 5. |
| Number of Completed Workstreams | 2 | Workstream 1 and Workstream 2 are both Complete. |
| Number of Open Decisions | 7 | See Section 8 (2 further decisions — OPEN-R1.2-001, OPEN-R1.2-002 — retired/resolved; see Section 8's Retired sub-list). Includes 3 new decisions (OPEN-R1.2-007–009) raised by the R1.2-014 Homepage Architecture Validation Review. |
| Number of Approved Decisions | 13 | DEC-R1.2-001 through DEC-R1.2-013; see Section 7. DEC-R1.2-013 records the R1.2-014 validation review's confirmed outcome. |
| Number of EBCs | 16 | R1.2-001 through R1.2-016; see Document Change History. |
| Number of Completed EBCs | 16 | R1.2-001 through R1.2-016 are complete as of this consolidation. |
| Number of Completed Tasks | 33 of 128 | All 19 Workstream 1 tasks, all 13 Workstream 2 tasks (R1.2-02.01–02.13, analysis and implementation) and R1.2-07.05 are Complete. |
| Task Status Breakdown | 33 Complete · 0 Approved · 95 Proposed (of 128) | Reconciled against Section 6 task tables; the 4 tasks that moved from Approved to Complete this update are R1.2-02.10–02.13. |
| Number of Deferred Items | See Section 9 | Future Release Candidates carried from `RELEASE-1.2-BACKLOG.md` and R1.1 deferrals |
| Overall Release State | **Implementation** | The release has moved beyond planning. |

**Maintenance note:** Update the count fields above manually whenever a task or decision changes status. This table is intentionally small so it stays cheap to keep current — do not expand it into a full audit; Section 6 is the source of truth for task-level counts.

---

# 4. Release Milestones

This section tracks Release 1.2 against its top-level lifecycle checkpoints, independent of the task-level detail in Section 6. See Section 12 for the detailed release-readiness checklist and Section 14 for status meanings.

| Milestone | Target Date | Status | Owner | Exit Criteria |
|---|---|---|---|---|
| Planning Complete | TBD | In Progress | Tiger | All 8 workstreams reach Approved status; Section 8 open decisions are resolved or explicitly carried forward as accepted risk |
| Architecture Review | TBD | Not Started | Archie | Archie's assessment complete for Workstream 5 (phone storage format and OTP verification architecture) and Workstream 6 (dataset/validation architecture) per Project Instructions Section 5 |
| Implementation Complete | TBD | In Progress | Rad | All Workstream 1–6 tasks reach Complete or Ready for QA (Workstream 1 and Workstream 2 are now Complete; Workstreams 3–6 remain Proposed) |
| Functional QA | TBD | In Progress | Keerthi | Workstream 8 functional and regression validation complete; workstream-level Functional QA is complete for Workstream 1 and Workstream 2 (R1.2-011), recorded in Section 13 |
| Traveller Experience QA | TBD | In Progress | Sri | Independent release-wide traveller-experience validation complete; the completed Workstream 1 and Workstream 2 (R1.2-012) reviews are recorded in Section 13 |
| Release Candidate | TBD | Not Started | Tiger | Release Checklist (Section 12) Delivery and Quality items satisfied |
| Production Release | TBD | Not Started | Vivek | Business Owner approval received; production deployment verified |
| Retrospective Complete | TBD | Not Started | Tiger | Workstream 7 retrospective and Lessons Learned captured; `PROJECT-HISTORY.md` updated |

```
Planning Complete
      ↓
Architecture Review
      ↓
Implementation Complete
      ↓
Functional QA
      ↓
Traveller Experience QA
      ↓
Release Candidate
      ↓
Production Release
      ↓
Retrospective Complete
```

**Maintenance note:** Update Target Date and Status as each milestone is reached. Dates are intentionally TBD until Planning Complete is reached and a realistic schedule can be set.

---

# 5. Master Workstream Tracker

Status values used below follow Section 14 (Status Definitions). Each workstream's current lifecycle status is recorded below.

## Workstream 1 — Homepage Premium Visual Refinement

| Field | Value |
|---|---|
| Goal | Refine the Journey Mood cards' visual treatment for a more premium, hierarchical presentation while preserving the approved illustration style; simplify the mood card set by removing the Escape card and clarify the Memory Maker card's emotional intent. Refine the homepage's premium visual presentation through improved Journey Mood cards and a redesigned Trust Strip while preserving the approved Search My Vacation visual identity and homepage hierarchy. |
| Business Value | Stronger first impression on the homepage; improved perceived quality without changing product structure; simplified homepage; reduced cognitive load; better emotional mapping between mood cards and Journey Passport intent; strengthen traveller trust; improve first impressions; increase perceived premium quality; improve homepage credibility |
| Priority | P1 |
| Status | Complete |
| Dependencies | Complete; the former Workstream 2 taxonomy dependency was resolved by DEC-R1.2-009 and refined by DEC-R1.2-012. Workstream 2 is now also Complete; its homepage review (R1.2-02.13) preserved the accepted Workstream 1 visual baseline with no regression, confirmed by Rad's engineering validation (R1.2-010) and Sri's traveller experience validation (R1.2-012). |
| Owner | Sophie (design direction), Rad (implementation) |
| Risks | No open Workstream 1 defect. Accepted post-implementation observations are retained in Section 13 and do not constitute release debt or a blocker. Future visual changes must preserve the approved champagne-glass baseline and `BRAND-AUDIT.md` guardrails. |
| Acceptance Criteria | Complete: illustration style preserved; champagne-glass palette and reduced gold saturation applied; visual hierarchy improved; Hero remains dominant; hover, selected, desktop/mobile, accessibility and responsive behaviour validated; Sri Traveller Experience Review complete; Escape removed (DEC-R1.2-007); "Memory Maker / Family" renamed to "Memory Makers" and remapped from Culture & Heritage to Photography (DEC-R1.2-008); five-card homepage layout rebalanced; Trust Strip redesigned using approved premium travel imagery; existing layout and typography preserved; homepage consistency maintained across Hero, Mood Cards and Trust Strip; Business Acceptance received. |

Tasks: R1.2-01.01 through R1.2-01.19 (Section 6.1).

---

## Workstream 2 — Experiences vs Journey Mood Rationalisation

| Field | Value |
|---|---|
| Goal | Establish Journey Mood Cards and Journey Passport as the single traveller discovery model, eliminating competing public entry points while preserving the Experiences implementation, assets and code for future redesign and reuse (DEC-R1.2-012). |
| Business Value | Reduced traveller confusion; cleaner information architecture; stronger homepage narrative; simplified homepage; reduced cognitive load |
| Priority | P1 |
| Status | Complete |
| Dependencies | Complete; no longer blocks downstream work. R1.2-02.13's homepage-hierarchy review preserved the completed Workstream 1 visual baseline (confirmed by R1.2-010 and R1.2-012). Workstream 3 (Destination Intelligence) is now unblocked and is the next active implementation stream, proceeding on Journey Mood Cards and Journey Passport as the approved discovery model. |
| Owner | Arjun (taxonomy/requirements analysis), Sophie (navigation/homepage UX implementation), Rad (engineering implementation and validation), Keerthi (functional QA), Sri (traveller experience validation) |
| Risks | No open Workstream 2 defect. Keerthi's Functional QA (R1.2-011) found 0 defects across 25 checks (24 Passed, 1 Blocked by a test-tooling limitation rather than a product issue — see OBS-R1.2-006 in Section 13). Sri's Traveller Experience Validation (R1.2-012) found no traveller-facing regression and recommended approval for closure. Future re-introduction of Experiences (should a redesign occur) must continue to preserve the Journey Mood Cards / Journey Passport discovery model and the `BRAND-AUDIT.md` guardrails. |
| Acceptance Criteria | Complete: overlap, duplicate concepts, taxonomy, navigation, SEO, redirect, Journey Passport and homepage implications documented (R1.2-007); Homepage entry and Experiences section removed (R1.2-02.10); Header and Footer navigation entries removed (R1.2-02.11); Experiences page/route retained with discoverability removed via a temporary, non-permanent guest redirect to the Homepage (R1.2-02.12); homepage hierarchy reviewed after removal with no regression (R1.2-02.13); Experiences implementation, assets, code and future reusability preserved (`JourneyInvitations.tsx`, `app/experiences/page.tsx`); Journey Mood Cards and Journey Passport confirmed as the single public traveller discovery model; independent Functional QA passed (R1.2-011); independent Traveller Experience Validation passed (R1.2-012); Product Owner approved Workstream 2 for closure. |

Tasks: R1.2-02.01 through R1.2-02.13 (Section 6.2) — all Complete.

---

## Workstream 3 — Destination Intelligence

*Renamed from "Featured Destination Smart Deep Linking" under EBC R1.2-003 to reflect the workstream's significant scope expansion into a weighted destination preference model (Rad's judgment call, consistent with the Workstream 5 renaming precedent set under EBC R1.2-002).*

| Field | Value |
|---|---|
| Goal | Make Featured Destination cards deep-link directly into a relevant, pre-mapped Journey Passport flow instead of a generic entry; establish a weighted Primary/Secondary/Tertiary destination preference model (Journey and Memory) that becomes the preferred Journey Director recommendation model — the foundation of a broader Destination Intelligence Model, documented as business concepts rather than fixed numerical scores. The weighting model shall influence recommendation ranking only and shall not override Journey Director's existing destination eligibility and business guardrails. |
| Business Value | Shorter path from inspiration to a personalised recommendation; improved conversion from the homepage; improved recommendation accuracy and better destination ranking through weighted preference intelligence |
| Priority | P1 |
| Status | Proposed |
| Dependencies | Benefits from Workstream 2's taxonomy outcome (which concept the deep link should target); depends on Workstream 6 for destination-level data quality if mapping references autocomplete-validated place names; R1.2-03.11 (Journey Director recommendation-ordering review) requires Archie's architecture review before implementation |
| Owner | Arjun (destination/journey mapping), Rad (implementation), Archie (fallback/analytics architecture, weighted-model architecture review) |
| Risks | Mapping table can become stale as destinations are added/removed; fallback behaviour must be robust or broken links will damage trust; the weighted preference model changing Journey Director's recommendation output without adequate review — see RISK-R1.2-011 |
| Acceptance Criteria | Destination-to-journey mapping defined; suggested-journey mapping defined; CTA reviewed; fallback behaviour defined and tested for unmapped destinations; analytics considerations documented; regression testing complete; weighted Primary/Secondary/Tertiary Journey and Memory preference model documented and implemented; Journey Director recommendation ordering reviewed against weighted preferences; recommendation consistency validated across all supported destinations; Wildlife Experiences destination card replaced by Gir; Kaziranga added as a new Featured Destination card; rotational ordering implemented for equally-weighted Wildlife destinations |

Tasks: R1.2-03.01 through R1.2-03.15 (Section 6.3).

**Architecture note (Archie must confirm before implementation):** the weighted Primary/Secondary/Tertiary Journey and Memory preference model materially affects Journey Director's recommendation-scoring structure and therefore requires Archie's assessment and explicit approval per Project Instructions Section 5 before implementation (R1.2-03.07 through R1.2-03.12) begins. This model does not change, and must not be implemented in a way that changes, the served-destination guardrail already established under DEC-R1.2-004 (R1.1 Decision Log DEC-010) — Journey Director remains solely responsible for validating whether a destination is served by SMV.

**Governing architecture:** `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` is the approved-for-ratification governing architecture document for Destination Intelligence source-of-truth, synchronisation, controlled-vocabulary and lifecycle governance, formalising the findings of `R1.2-03.01`–`03.04`. Implementation tasks in this workstream (`R1.2-03.07` onward) should treat it as their primary architectural prerequisite alongside the Architecture note above.

**Destination Intelligence Model (Tiger's guidance):** the destination mapping spreadsheet is the starting point of a broader Destination Intelligence Model, not merely a configuration table. `Journey 1/2/3` and `Memory 1/2/3` represent Primary/Secondary/Tertiary Journey and Memory preferences respectively — business concepts that guide Journey Director recommendations. This tracker deliberately avoids prescribing fixed numerical weights; the relative priority (Primary/Secondary/Tertiary) is the documented product specification, and the underlying implementation/weighting approach may evolve across future releases without requiring a change to this specification.

---

## Workstream 4 — Journey Passport Entry Context Improvements

| Field | Value |
|---|---|
| Goal | Fix known entry-context defects in the Journey Passport and confirm consistent, correct behaviour across all entry paths |
| Business Value | Reduces traveller-facing defects carried over from Release 1.1; protects trust in the Passport experience; improved Journey Passport data quality |
| Priority | P1 |
| Status | Proposed |
| Dependencies | None blocking; should be regression-tested alongside Workstream 6 if destination entry is touched in the same cycle |
| Owner | Rad (defect fixes), Keerthi (regression) |
| Risks | Entry-context defects are easy to fix narrowly and reintroduce elsewhere; requires full-path regression, not just the four known defect areas |
| Acceptance Criteria | Known defects resolved for Romance, Companion, and Pace & Timing entry contexts; homepage-to-Passport entry-context mapping kept consistent with the current homepage mood card set (see Workstream 1); all entry paths regression tested; advisory banner correctness confirmed; state consistency confirmed; override behaviour confirmed; resume behaviour confirmed; traveller name field rejects numeric characters while allowing letters, spaces, hyphens and apostrophes (DEC-R1.2-011); Journey Passport validation regression tested |

Tasks: R1.2-04.01 through R1.2-04.11 (Section 6.4).

---

## Workstream 5 — International Phone Number & OTP Verification

| Field | Value |
|---|---|
| Goal | Support international phone numbers across every form that captures a phone number, storing numbers in E.164 format; and require successful mobile OTP verification before a Journey Passport submission can be completed, improving verified lead quality. OTP verification is scoped to Journey Passport only — it is not introduced for Callback Request, Contact Us or other lead-capture forms in this release |
| Business Value | Removes a hard barrier for international travellers; improves lead data quality and consistency; reduces fake and test Journey Passport submissions; improves verified lead quality; improves planner confidence in incoming leads; reduces manual follow-up effort spent chasing invalid submissions |
| Priority | P1 |
| Status | Proposed |
| Dependencies | Touches Journey Passport (coordinate with Workstream 4 regression), Contact, Callback Request, Plan My Experience. OTP verification specifically depends on the country-aware phone capture and E.164 normalization (R1.2-05.01–05.17) being complete, since the OTP is sent to the validated number |
| Owner | Archie (data format / storage approach, OTP provider evaluation and verification architecture), Sophie (country selector and OTP entry UX), Rad (implementation), Keerthi (regression and OTP QA strategy) |
| Risks | Existing stored phone numbers (Release 1.0/1.1 leads) are in a 10-digit India-only format — a migration or dual-read strategy must be decided before storage format changes; incomplete audit of "future forms" could leave a capture point non-compliant; introducing OTP verification adds a dependency on a third-party delivery provider — see RISK-R1.2-010 |
| Acceptance Criteria | Every phone-capture location audited; country selector (with search, flags, calling codes, India default) implemented; country-aware validation replaces hardcoded 10-digit assumption; invalid combinations handled gracefully; pasted/free-form numbers normalized into canonical E.164 format; numbers stored in E.164 format (e.g. `+919876543210`); existing flows regression tested; Journey Passport cannot be submitted without successful OTP verification; OTP verification applies only to Journey Passport; existing Callback Request flow remains unchanged; existing Contact flow remains unchanged |

Tasks: R1.2-05.01 through R1.2-05.35 (Section 6.5).

**Architecture note (Archie must confirm before implementation):** changing the stored phone number format is a data-model-adjacent change and requires Archie's assessment per Project Instructions Section 5 before Rad begins implementation, specifically regarding backward compatibility with existing Supabase lead records. OTP verification architecture — provider selection, verification-state management, secret handling and backend implications (R1.2-05.19) — likewise requires Archie's assessment and explicit approval before any OTP implementation task (R1.2-05.21 onward) begins. Selecting an OTP provider and implementing OTP verification are both explicitly out of scope for this planning update (R1.2-002); they require a separate, future implementation EBC.

**Product guardrail (Tiger):** OTP verification is a lead-quality control applied at the point of Journey Passport submission — it is not an authentication, login or account-management feature. Implementation must preserve the existing low-friction Journey Passport experience, introducing verification only immediately before final submission rather than earlier in the flow. Future EBCs must not expand OTP into a broader identity or login system without a separate, explicitly approved decision.

---

## Workstream 6 — Journey Passport Destination Autocomplete & Validation

| Field | Value |
|---|---|
| Goal | Replace the free-text destination field with a searchable, multi-select autocomplete that validates a destination is a real place — without taking over Journey Director's responsibility for served-destination validation |
| Business Value | Higher-quality destination data (fewer fictional/misspelled entries); better traveller experience when naming multiple places of interest |
| Priority | P1 (approved R1.2 workstream) |
| Status | Proposed |
| Dependencies | Dataset investigation must complete before UX/validation implementation; Workstream 4 regression should include the destination field; Workstream 3 mapping may reference validated destination names |
| Owner | Archie (dataset investigation, architecture), Sophie (autocomplete UX), Rad (implementation), Keerthi (edge-case validation) |
| Risks | Free geographic datasets (GeoNames, OSM-derived) vary in coverage and update cadence for Indian place names and aliases; fuzzy matching quality is easy to underestimate; must not accidentally start validating "does SMV serve it" — that remains Journey Director's responsibility |
| Acceptance Criteria | Existing free-text behaviour and data-quality problems documented; searchable autocomplete with multi-selection implemented, including removing an individual destination and preserving selection order; validation confirms the location is real but does **not** check SMV service coverage; free-dataset investigation complete with an explicit decision (paid APIs excluded for R1.2 unless separately approved); fuzzy matching, alternate spellings, abbreviations, landmarks, regions, cities and countries supported; edge cases (Vizag, Bangalore/Bengaluru, Madras/Chennai, Kotagiri, Coorg/Kodagu) validated; fictional locations (e.g. Wakanda, Winterfell) rejected without a jarring UX; Journey Director's unsupported-destination behaviour unchanged |

Tasks: R1.2-06.01 through R1.2-06.13 (Section 6.6).

---

## Workstream 7 — Release Documentation

| Field | Value |
|---|---|
| Goal | Keep release governance documentation current throughout R1.2 and complete it before release close |
| Business Value | Preserves institutional memory; enables a clean, evidence-based release decision |
| Priority | P1 |
| Status | In Progress |
| Dependencies | Depends on all other workstreams reaching a stable state before final versions (retrospective, release notes) can be written; can begin in parallel as a living draft |
| Owner | Tiger |
| Risks | Documentation debt tends to accumulate if deferred to the end of the release, as noted in the R1.0 and R1.1 Lessons Learned |
| Acceptance Criteria | `PROJECT-HISTORY.md` updated with a Release 1.2 entry; retrospective prepared; Lessons Learned captured; `RELEASE-1.2-BACKLOG.md` reconciled against delivered scope; EBC references consolidated; release notes prepared |

Tasks: R1.2-07.01 through R1.2-07.06 (Section 6.7).

---

## Workstream 8 — Release-wide QA & Regression

| Field | Value |
|---|---|
| Goal | Independently validate the full R1.2 scope plus adjacent-feature regression before release |
| Business Value | Protects Release 1.1's established quality bar; prevents R1.2 changes from regressing shipped functionality |
| Priority | P1 |
| Status | Proposed |
| Dependencies | Depends on Workstreams 1–6 reaching implementation-complete; runs after Workstream 7's release notes/checklist groundwork is in place |
| Owner | Keerthi (functional QA), Sri (traveller experience), Rad (technical checks: build/TypeScript/ESLint) |
| Risks | Compressing QA to the end of the release (as flagged in R1.1 Lessons Learned) creates schedule pressure; should be run incrementally per workstream, not solely as a final gate |
| Acceptance Criteria | Homepage, Journey Passport, Traveller Stories, Travel Inspiration, Featured Destinations, Header, Footer and Forms regression tested; responsive and accessibility validated; cross-browser tested; production build, TypeScript and ESLint pass; business validation and production smoke complete |

Tasks: R1.2-08.01 through R1.2-08.16 (Section 6.8).

---

# 6. Task Tracker

Each task carries a unique ID in the form `R1.2-<workstream>.<task>`. Tables are split per workstream to keep them maintainable — per Tiger's recommendation, favour readable, updatable sub-tables over one giant matrix.

Workstream-level Acceptance Criteria are captured once in Section 5 rather than repeated per row; the **Notes** column below flags any task-specific acceptance detail that isn't obvious from the task name.

Status values: Proposed / Under Discussion / Approved / In Progress / Ready for QA / Complete / Deferred / Cancelled (Section 14).

## 6.1 Workstream 1 — Premium Mood Card Visual Refinement

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-01.01 | Preserve existing illustration style — audit current mood card illustrations against approved style guide | P1 | Complete | Sophie | — | Baseline check before any change |
| R1.2-01.02 | Apply ivory/champagne palette to mood card backgrounds | P1 | Complete | Sophie / Rad | 01.01 | Must stay within `BRAND-AUDIT.md` guardrails |
| R1.2-01.03 | Reduce gold saturation across mood card treatment | P1 | Complete | Sophie / Rad | 01.02 | |
| R1.2-01.04 | Improve visual hierarchy within mood cards | P1 | Complete | Sophie / Rad | 01.02, 01.03 | |
| R1.2-01.05 | Confirm Hero remains the dominant visual element after refinement | P1 | Complete | Sophie | 01.04 | Non-negotiable brand guardrail |
| R1.2-01.06 | Illustration QA against brand and quality standards | P1 | Complete | Keerthi | 01.01–01.05 | |
| R1.2-01.07 | Hover-state review across mood cards | P2 | Complete | Keerthi | 01.06 | |
| R1.2-01.08 | Selected-state review across mood cards | P2 | Complete | Keerthi | 01.06 | |
| R1.2-01.09 | Desktop/mobile visual review of refined mood cards | P1 | Complete | Keerthi | 01.06 | |
| R1.2-01.10 | Accessibility review (contrast, reduced motion, focus states) | P1 | Complete | Keerthi | 01.06 | |
| R1.2-01.11 | Traveller validation of refined mood card experience | P1 | Complete | Sri | 01.07–01.10 | Independent of Keerthi's functional QA |
| R1.2-01.12 | Remove the Escape mood card | P1 | Complete | Sophie / Rad | 01.01–01.05 | Per DEC-R1.2-007 — no strong Journey Passport mapping exists; current Tropical Escape mapping is misleading |
| R1.2-01.13 | Rename "Memory Maker / Family" mood card to "Memory Makers" | P1 | Complete | Sophie | 01.12 | Per DEC-R1.2-008 |
| R1.2-01.14 | Update Journey Passport mapping for Memory Makers from Culture & Heritage to Photography | P1 | Complete | Arjun / Rad | 01.13 | Per DEC-R1.2-008 |
| R1.2-01.15 | Review homepage layout after removing the Escape card | P1 | Complete | Sophie | 01.12 | Maintain premium spacing and visual balance; coordinate with R1.2-02.13 |
| R1.2-01.16 | Redesign Trust Strip visual treatment using premium travel imagery | P1 | Complete | Sophie | — | |
| R1.2-01.17 | Replace medallion icons with premium photographic assets while preserving layout | P1 | Complete | Sophie | 01.16 | |
| R1.2-01.18 | Validate responsive behaviour, build performance and visual consistency | P1 | Complete | Sophie | 01.16, 01.17 | |
| R1.2-01.19 | Replace prototype imagery with production-approved/licensed assets before release | P1 | Complete | Sophie | 01.16, 01.17 | |

## 6.2 Workstream 2 — Experiences vs Journey Mood Rationalisation

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-02.01 | Overlap review between Experiences and Journey Moods | P1 | Complete | Arjun | — | |
| R1.2-02.02 | Taxonomy review of both concepts | P1 | Complete | Arjun | 02.01 | |
| R1.2-02.03 | Navigation implications assessment | P1 | Complete | Sophie | 02.02 | |
| R1.2-02.04 | Identify duplicate concepts | P1 | Complete | Arjun | 02.01 | |
| R1.2-02.05 | SEO considerations assessment | P2 | Complete | Archie | 02.02 | Only material if routes/taxonomy change |
| R1.2-02.06 | Redirect considerations assessment | P2 | Complete | Archie | 02.05 | |
| R1.2-02.07 | Journey Passport implications assessment | P1 | Complete | Arjun | 02.02 | |
| R1.2-02.08 | Homepage implications assessment | P1 | Complete | Sophie | 02.02, 02.03 | |
| R1.2-02.09 | Document and route open product decisions to Product Owner | P1 | Complete | Tiger | 02.01–02.08 | Feeds Section 8 |
| R1.2-02.10 | Remove Experiences section from the homepage | P1 | Complete | Sophie / Rad | 02.09 | Per DEC-R1.2-009; implemented under R1.2-009 |
| R1.2-02.11 | Remove Experiences from primary navigation | P1 | Complete | Sophie / Rad | 02.09 | Per DEC-R1.2-009; implemented under R1.2-009 (Header and Footer) |
| R1.2-02.12 | Retire the Experiences page — keep implementation and routing, remove discoverability, preserve for future reuse | P1 | Complete | Archie / Rad | 02.10, 02.11 | No page or URL deletion; per DEC-R1.2-009; guest redirect implemented under R1.2-010 |
| R1.2-02.13 | Review homepage visual hierarchy after removing the Experiences section | P1 | Complete | Sophie | 01.15, 02.10 | Coordinated with R1.2-01.15; no regression found (R1.2-010, R1.2-012) |

## 6.3 Workstream 3 — Destination Intelligence

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-03.01 | Define destination mapping | P1 | Proposed | Arjun | — | |
| R1.2-03.02 | Define suggested-journey mapping per destination | P1 | Proposed | Arjun | 03.01 | |
| R1.2-03.03 | CTA review | P2 | Proposed | Sophie | 03.02 | |
| R1.2-03.04 | Define fallback behaviour for unmapped destinations | P1 | Proposed | Archie | 03.01 | Must not produce a broken/dead link |
| R1.2-03.05 | Define analytics considerations | P2 | Proposed | Archie | 03.02 | |
| R1.2-03.06 | Regression testing | P1 | Proposed | Keerthi | 03.01–03.05 | |
| R1.2-03.07 | Implement weighted Journey preference ranking | P1 | Proposed | Rad | 03.01 | `Journey 1/2/3` represent Primary/Secondary/Tertiary Journey |
| R1.2-03.08 | Implement weighted Memory preference ranking | P1 | Proposed | Rad | 03.01 | `Memory 1/2/3` represent Primary/Secondary/Tertiary Memory |
| R1.2-03.09 | Review and validate all destination Journey and Memory mappings against the approved destination weighting matrix. | P1 | Proposed | Arjun | 03.07, 03.08 | Destination mapping spreadsheet becomes the canonical weighting model |
| R1.2-03.10 | Document Primary/Secondary/Tertiary weighting conventions | P1 | Proposed | Arjun / Tiger | 03.09 | Document as business concepts — avoid prescribing fixed numerical scores; see the Destination Intelligence Model note in Section 5 |
| R1.2-03.11 | Review Journey Director recommendation ordering using weighted preferences | P1 | Proposed | Archie | 03.07–03.10 | Requires Archie's architecture review; must not change the DEC-R1.2-004 served-destination guardrail |
| R1.2-03.12 | Validate recommendation consistency across all supported destinations | P1 | Proposed | Keerthi | 03.11 | Referenced by RISK-R1.2-011 |
| R1.2-03.13 | Replace Wildlife Experiences destination card with Gir | P1 | Proposed | Sophie / Rad | 03.01 | |
| R1.2-03.14 | Add Kaziranga destination card | P1 | Proposed | Sophie / Rad | 03.01 | |
| R1.2-03.15 | Introduce rotational ordering for Wildlife destinations where equal weighting exists. Applies only where destinations have identical Journey and Memory weighting. Rotation must remain deterministic within a session to avoid recommendation instability. | P2 | Proposed | Rad | 03.13, 03.14 | |

## 6.4 Workstream 4 — Journey Passport Entry Context Improvements

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-04.01 | Fix known defect — Romance entry context | P1 | Proposed | Rad | — | Carried over from R1.1 |
| R1.2-04.02 | Validate homepage mood card to Journey Passport mappings | P1 | Proposed | Rad | — | Carried over from R1.1 |
| R1.2-04.03 | Fix known defect — Companion entry context | P1 | Proposed | Rad | — | Carried over from R1.1 |
| R1.2-04.04 | Fix known defect — Pace & Timing entry context | P1 | Proposed | Rad | — | Carried over from R1.1 |
| R1.2-04.05 | Regression test all Journey Passport entry paths | P1 | Proposed | Keerthi | 04.01–04.04 | |
| R1.2-04.06 | Acceptance — advisory banner correctness | P1 | Proposed | Keerthi | 04.05 | |
| R1.2-04.07 | Acceptance — state consistency across entry contexts | P1 | Proposed | Keerthi | 04.05 | |
| R1.2-04.08 | Acceptance — override behaviour (traveller can change pre-populated answers) | P1 | Proposed | Keerthi | 04.05 | |
| R1.2-04.09 | Acceptance — resume behaviour | P1 | Proposed | Keerthi | 04.05 | |
| R1.2-04.10 | Prevent numeric characters from being entered into the traveller name field | P1 | Proposed | Rad | — | Per DEC-R1.2-011. Ignore numeric key presses; allow letters, spaces, hyphens and apostrophes |
| R1.2-04.11 | Regression test Journey Passport validation | P1 | Proposed | Keerthi | 04.10 | |

## 6.5 Workstream 5 — International Phone Number & OTP Verification

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-05.01 | Audit phone capture — Journey Passport | P1 | Proposed | Arjun | — | |
| R1.2-05.02 | Audit phone capture — Contact | P1 | Proposed | Arjun | — | |
| R1.2-05.03 | Audit phone capture — Callback Request | P1 | Proposed | Arjun | — | |
| R1.2-05.04 | Audit phone capture — Plan My Experience | P1 | Proposed | Arjun | — | |
| R1.2-05.05 | Document convention for future phone-capture forms | P2 | Proposed | Archie | 05.01–05.04 | Ensures new forms don't reintroduce the 10-digit assumption |
| R1.2-05.06 | Implement country selector component | P1 | Proposed | Sophie / Rad | 05.01–05.04 | |
| R1.2-05.07 | Implement country search within selector | P1 | Proposed | Sophie / Rad | 05.06 | |
| R1.2-05.08 | Implement flag iconography | P2 | Proposed | Sophie / Rad | 05.06 | Use repository/approved icon assets, not new generated assets |
| R1.2-05.09 | Implement calling-code display | P1 | Proposed | Rad | 05.06 | |
| R1.2-05.10 | Default country to India (+91) | P1 | Proposed | Rad | 05.06 | Preserves existing traveller default expectation |
| R1.2-05.11 | Validate mobile experience of country selector | P1 | Proposed | Keerthi | 05.06–05.10 | |
| R1.2-05.12 | Implement country-aware phone validation | P1 | Proposed | Rad | 05.06 | |
| R1.2-05.13 | Remove hardcoded 10-digit assumption | P1 | Proposed | Rad | 05.12 | |
| R1.2-05.14 | Handle invalid country/number combinations | P1 | Proposed | Rad | 05.12 | |
| R1.2-05.15 | Store phone numbers in E.164 format | P1 | Proposed | Archie / Rad | 05.12–05.14 | Requires Archie's data-model assessment; consider existing lead-record compatibility |
| R1.2-05.16 | Regression test existing phone-dependent flows | P1 | Proposed | Keerthi | 05.01–05.15 | Lead capture, callback, notification emails |
| R1.2-05.17 | Normalize pasted phone numbers into canonical E.164 format while preserving valid user input | P1 | Proposed | Rad | 05.12–05.15 | Support formats such as `+91 98765 43210`, `+91-9876543210`, `98765-43210`, `9876543210` |
| R1.2-05.18 | Evaluate OTP providers | P1 | Proposed | Archie | 05.17 | Compare provider options, delivery reliability, India coverage, international capability, expected operating cost. Evaluation only — no provider is selected under R1.2-002 |
| R1.2-05.19 | Architecture review for OTP verification | P1 | Proposed | Archie | 05.18 | Document provider selection, verification architecture, secret management, verification state, backend implications. Requires Archie approval |
| R1.2-05.20 | Define Journey Passport OTP flow | P1 | Proposed | Arjun / Sophie | 05.19 | Phone Number → Send OTP → Enter OTP → Verify → Journey Passport Submission. Flow definition only |
| R1.2-05.21 | Implement Send OTP interaction | P1 | Proposed | Rad | 05.20 | |
| R1.2-05.22 | Implement OTP entry screen | P1 | Proposed | Sophie / Rad | 05.20 | |
| R1.2-05.23 | Implement OTP verification | P1 | Proposed | Rad | 05.21, 05.22 | |
| R1.2-05.24 | OTP expiry handling | P1 | Proposed | Rad | 05.23 | |
| R1.2-05.25 | Resend OTP rules | P1 | Proposed | Rad | 05.21 | Include cooldown and resend limits |
| R1.2-05.26 | Invalid OTP handling | P1 | Proposed | Rad | 05.23 | Include retry limits, expired OTP, incorrect OTP |
| R1.2-05.27 | Mask mobile number on verification screen | P2 | Proposed | Sophie / Rad | 05.22 | |
| R1.2-05.28 | Changing phone number invalidates previous verification | P1 | Proposed | Rad | 05.23 | |
| R1.2-05.29 | Prevent Journey Passport submission until verification succeeds | P1 | Proposed | Rad | 05.23 | Core guardrail behind DEC-R1.2-006 |
| R1.2-05.30 | OTP abuse protection | P1 | Proposed | Archie / Rad | 05.19, 05.25 | Include rate limiting, spam prevention, repeated OTP protection |
| R1.2-05.31 | Development and QA strategy for OTP | P1 | Proposed | Keerthi / Rad | 05.19 | Support test numbers, sandbox verification, non-production validation |
| R1.2-05.32 | Regression testing — India phone numbers | P1 | Proposed | Keerthi | 05.21–05.30 | |
| R1.2-05.33 | Regression testing — international phone numbers | P1 | Proposed | Keerthi | 05.21–05.30 | |
| R1.2-05.34 | Journey Passport resume behaviour — verified state handling | P1 | Proposed | Keerthi | 05.23 | |
| R1.2-05.35 | Production OTP smoke test | P1 | Proposed | Keerthi | 05.31–05.34 | Post-deployment |

## 6.6 Workstream 6 — Journey Passport Destination Autocomplete & Validation

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-06.01 | Audit current free-text destination field and data-quality problems | P1 | Proposed | Arjun | — | |
| R1.2-06.02 | Investigate free geographic datasets (GeoNames, OSM-derived); explicitly exclude paid APIs for R1.2 | P1 | Proposed | Archie | 06.01 | Product Owner approval required before any paid API is considered |
| R1.2-06.03 | Build searchable autocomplete component | P1 | Proposed | Sophie / Rad | 06.02 | |
| R1.2-06.04 | Support multi-selection of destinations | P1 | Proposed | Rad | 06.03 | |
| R1.2-06.05 | Implement "is this a real place" validation only | P1 | Proposed | Rad | 06.02, 06.03 | Must NOT validate SMV service coverage |
| R1.2-06.06 | Preserve Journey Director as sole authority for served-destination handling | P1 | Proposed | Archie | 06.05 | Explicit guardrail — no behaviour change to Journey Director |
| R1.2-06.07 | Implement fuzzy matching, alternate spellings, abbreviations, common names | P1 | Proposed | Rad | 06.02, 06.03 | |
| R1.2-06.08 | Support landmark, region, city and country-level entries | P1 | Proposed | Rad | 06.07 | |
| R1.2-06.09 | Validate edge cases (Vizag, Bangalore/Bengaluru, Madras/Chennai, Kotagiri, Coorg/Kodagu) | P1 | Proposed | Keerthi | 06.07, 06.08 | |
| R1.2-06.10 | Reject fictional locations gracefully (e.g. Wakanda, Winterfell) | P1 | Proposed | Rad | 06.05 | UX must not feel punitive |
| R1.2-06.11 | Regression test destination field and Journey Director handoff | P1 | Proposed | Keerthi | 06.01–06.10 | |
| R1.2-06.12 | Allow travellers to remove an individual selected destination without clearing the complete selection | P1 | Proposed | Rad | 06.04 | |
| R1.2-06.13 | Preserve the order in which destinations were selected | P1 | Proposed | Rad | 06.04 | |

## 6.7 Workstream 7 — Release Documentation

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-07.01 | Update `PROJECT-HISTORY.md` with Release 1.2 entry | P1 | Proposed | Tiger | Near release close | |
| R1.2-07.02 | Prepare Release 1.2 retrospective | P1 | Proposed | Tiger | Near release close | |
| R1.2-07.03 | Capture Lessons Learned | P1 | Proposed | Tiger | 07.02 | |
| R1.2-07.04 | Reconcile `RELEASE-1.2-BACKLOG.md` against delivered scope | P2 | Proposed | Tiger | Near release close | |
| R1.2-07.05 | Consolidate EBC references for Release 1.2 | P2 | Complete | Rad | Ongoing | |
| R1.2-07.06 | Prepare Release 1.2 release notes | P1 | Proposed | Tiger | Near release close | |

## 6.8 Workstream 8 — Release-wide QA & Regression

| ID | Task | Priority | Status | Owner | Dependencies | Notes |
|---|---|---|---|---|---|---|
| R1.2-08.01 | Homepage regression | P1 | Proposed | Keerthi | WS1–WS3 implementation-complete | |
| R1.2-08.02 | Journey Passport regression | P1 | Proposed | Keerthi | WS4–WS6 implementation-complete | |
| R1.2-08.03 | Traveller Stories regression | P1 | Proposed | Keerthi | — | Adjacent-feature protection |
| R1.2-08.04 | Travel Inspiration regression | P1 | Proposed | Keerthi | — | Adjacent-feature protection |
| R1.2-08.05 | Featured Destinations regression | P1 | Proposed | Keerthi | WS3 | |
| R1.2-08.06 | Header regression | P2 | Proposed | Keerthi | — | |
| R1.2-08.07 | Footer regression | P2 | Proposed | Keerthi | WS5 | Contact/Callback forms live in footer/contact flows |
| R1.2-08.08 | Forms regression (Contact, Callback, Plan My Experience) | P1 | Proposed | Keerthi | WS5 | |
| R1.2-08.09 | Responsive validation (desktop/tablet/mobile) | P1 | Proposed | Keerthi | WS1–WS6 | |
| R1.2-08.10 | Accessibility validation | P1 | Proposed | Keerthi | WS1–WS6 | |
| R1.2-08.11 | Cross-browser testing (Chrome, Safari, Firefox) | P1 | Proposed | Keerthi | WS1–WS6 | |
| R1.2-08.12 | Production build validation | P1 | Proposed | Rad | WS1–WS6 | `npm run build` |
| R1.2-08.13 | TypeScript validation | P1 | Proposed | Rad | WS1–WS6 | |
| R1.2-08.14 | ESLint validation | P1 | Proposed | Rad | WS1–WS6 | |
| R1.2-08.15 | Business validation (Product Owner walkthrough) | P1 | Proposed | Vivek | 08.01–08.14 | |
| R1.2-08.16 | Production smoke test | P1 | Proposed | Keerthi | Post-deployment | |

---

# 7. Product Decision Log

Only decisions that materially influence product behaviour, architecture, UX or release management are recorded here. Superseded decisions are marked, not deleted.

| Decision ID | Date | Decision | Reason | Outcome | Status |
|---|---|---|---|---|---|
| DEC-R1.2-001 | 15-Aug-2026 | Mood illustration direction: preserve the current illustration style; shift palette toward ivory/champagne and reduce gold saturation; Hero must remain the dominant homepage element | Improve perceived premium quality without a full visual redesign | Workstream 1 scoped accordingly | Approved |
| DEC-R1.2-002 | 15-Aug-2026 | Phone number internationalisation: support international phone numbers across all capture points; store in E.164 format; default country India | Removes a hard barrier for international travellers and improves lead data quality | Workstream 5 scoped accordingly | Approved |
| DEC-R1.2-003 | 15-Aug-2026 | Destination autocomplete: replace free-text destination entry with a searchable, multi-select autocomplete validated against free geographic datasets only (paid APIs explicitly excluded for R1.2) | Improve data quality (fictional locations, misspellings) without introducing a recurring paid dependency | Workstream 6 scoped accordingly | Approved |
| DEC-R1.2-004 | 15-Aug-2026 | Journey Director remains solely responsible for validating whether a destination is served by SMV; the new autocomplete only validates that a place is real | Keeps served-destination logic centralised and protects the existing recommendation guardrail (DEC-010 in the R1.1 Decision Log) | No change to Journey Director behaviour | Approved |
| DEC-R1.2-005 | 15-Aug-2026 | Journey Passport destination entry supports multi-destination selection | Travellers often evaluate multiple destinations during trip planning, so limiting entry to a single destination understates genuine intent | Workstream 6 destination autocomplete scoped to support multi-selection, individual removal and preserved selection order | Approved |
| DEC-R1.2-006 | 15-Aug-2026 | Journey Passport submissions shall require successful mobile OTP verification before final submission. OTP verification is limited to Journey Passport; Callback Request, Contact Us and other forms remain OTP-free unless approved in a future release | Reduce fake and test Journey Passport submissions while avoiding unnecessary friction in other lead-capture journeys | Workstream 5 scoped to include Journey Passport OTP verification | Approved |
| DEC-R1.2-007 | 15-Aug-2026 | Remove the Escape mood card from the Journey Mood card set | No strong Journey Passport mapping exists for this card; the current Tropical Escape mapping is misleading | Workstream 1 scoped to remove the Escape mood card and review homepage layout accordingly | Approved |
| DEC-R1.2-008 | 15-Aug-2026 | Rename the "Memory Maker / Family" mood card to "Memory Makers" and remap it to Photography instead of Culture & Heritage | Photography best represents the emotional intent of preserving memories across all traveller types | Workstream 1 scoped to rename the card and update its Journey Passport mapping | Approved |
| DEC-R1.2-009 | 15-Aug-2026 | Retire the Experiences section from the homepage and remove it from primary website navigation; the page shall remain available internally for future redesign and reuse — no page deletion, no URL deletion | Resolves the Experiences vs Journey Mood overlap identified in Workstream 2 | Workstream 2 scoped accordingly; OPEN-R1.2-001 and OPEN-R1.2-002 resolved (see Section 8) | Approved |
| DEC-R1.2-010 | 15-Aug-2026 | Introduce weighted destination preference ordering using Primary/Secondary/Tertiary Journey and Memory mappings; this becomes the preferred Journey Director recommendation model. The implementation may choose numerical weighting internally, but this tracker deliberately avoids prescribing fixed scores | Strengthens destination intelligence and improves recommendation accuracy while keeping the business specification stable and independent of the underlying implementation | Workstream 3 (renamed Destination Intelligence) scoped accordingly; requires Archie's architecture review before implementation; does not change the served-destination guardrail (DEC-R1.2-004 / R1.1 DEC-010) | Approved |
| DEC-R1.2-011 | 15-Aug-2026 | Journey Passport traveller name field shall prevent numeric characters from being entered | Improves Journey Passport data quality | Workstream 4 scoped to add name-field validation | Approved |
| DEC-R1.2-012 | 16-Aug-2026 | **Temporary Retirement of Experiences from the Public Website.** Release 1.2 establishes Journey Mood Cards and Journey Passport as the single traveller discovery model. The Experiences feature remains preserved in the repository for future redesign but will no longer be publicly accessible. Implementation must remove the Homepage entry, Header navigation, Footer navigation and all intentional internal links; redirect guest requests to `/experiences`; and preserve the implementation, assets, code and future reusability. | Avoid competing traveller journeys while preserving future investment. | Workstream 2 analysis is complete and implementation is approved and ready. DEC-R1.2-009 remains the original retirement decision; this decision adds the approved public-access, Footer, internal-link, redirect and preservation requirements. | Approved |
| DEC-R1.2-013 | 17-Aug-2026 | **Homepage Architecture Validation confirmed; Experiences retirement remains valid.** Following the independent R1.2-014 Homepage Architecture Validation Review (Arjun — Product/IA; Sophie — UX/Visual Hierarchy), the Product Owner confirms: (1) the Experiences retirement (DEC-R1.2-009/012) remains valid, with no new evidence found to reopen it; (2) the Experiences implementation, assets and code remain intentionally retained as a reusable technical asset for possible future redesign, not as unresolved debt; (3) the current ten-section homepage architecture (Header → Hero/Mood Cards → Destinations → Trust Points → Traveller Stories → Trust Strip → Travel Inspiration → About/Promise Preview → Contact Preview → Footer) is validated as coherent and release-ready; (4) there is no recommendation to restore Experiences to the public homepage, navigation or footer. | Independent Product and UX re-confirmation of Workstream 1/2 outcomes, requested to validate the tracker before Workstream 3 proceeds. | Workstreams 1 and 2 remain Complete and unchanged. Future homepage optimisation should prioritise the Trust Points section (imagery/iconography — OPEN-R1.2-009) and the Header's tablet-range CTA breakpoint (OPEN-R1.2-007) ahead of any other homepage polish. Workstream 3 (Destination Intelligence) scope is unaffected. | Approved |

---

# 8. Open Product Decisions

These remain unresolved and must stay visible until the Product Owner formally resolves them. They are not blockers for starting other workstreams unless explicitly noted as a dependency.

| ID | Open Discussion | Raised In | Why It Matters | Status |
|---|---|---|---|---|
| OPEN-R1.2-003 | Any remaining Release 1.1 carry-over decisions not yet formally closed | R1.1 → R1.2 handover | Ensures no R1.1 discussion is silently dropped; Tiger to reconcile against `RELEASE-1.1-MASTER-TRACKER.md` Section 7 (Deferred to Release 1.2) and the R1.1 Decision Log | Under Discussion |
| OPEN-R1.2-004 | Future destination intelligence enhancements beyond R1.2 (e.g. deeper Journey Director scoring, additional compatibility tuning, beyond the R1.2-scoped Workstream 3 weighted preference model) | Workstream 3 / general roadmap | Scope boundary for what belongs in R1.2 vs a future release; prevents Workstream 3 from silently expanding beyond the approved weighted Primary/Secondary/Tertiary model | Under Discussion |
| OPEN-R1.2-005 | Long-term strategy for refreshing and maintaining the geographic dataset used for destination autocomplete | Workstream 6 | The free datasets selected in R1.2-06.02 will need a maintenance cadence (refresh frequency, source-of-truth ownership, handling new/renamed places) that is beyond a one-time investigation | Under Discussion |
| OPEN-R1.2-006 | Future expansion of OTP verification — should OTP eventually be introduced for Plan My Experience, Contact Us and Callback Request? | Workstream 5 | Determines whether OTP scope grows beyond Journey Passport in a future release; current decision (DEC-R1.2-006) limits OTP to Journey Passport only | Deferred |
| OPEN-R1.2-007 | Should the Header's persistent nav and CTA move from the `xl` (1280px) breakpoint to `lg` (1024px), so the entire tablet range (including landscape iPad) regains one-tap access to "Plan My Experience" instead of only reaching it via the hamburger menu? | R1.2-014 (Sophie) | Currently every tablet viewport loses the persistent CTA that Design Principle 05 and prior reviews describe as available "at every scroll depth" — in practice that guarantee only holds from 1280px up. Low-Medium severity, non-blocking, but named by Sophie as one of two findings worth a specific Tiger/Vivek decision. | Under Discussion |
| OPEN-R1.2-008 | Trust Points is the homepage's only section with neither photography nor a proper icon set (its four "icons" are raw Unicode glyphs, off-system per `ICONOGRAPHY.md`) — should it gain a proper icon set and/or a photographic element, or is "text only" a deliberate choice worth preserving for this specific section? | R1.2-014 (Sophie / Arjun) | It is the homepage's most trust-critical section (the company's own stated differentiators) and, per Sophie's review, currently also its visually plainest. The icon-set fix is a small, contained P2 improvement; the photography question needs Arjun/Vivek input before any change. | Under Discussion |
| OPEN-R1.2-009 | Should the Contact Preview section's CTA link to `/contact` (in addition to, or instead of, `/journey-passport`-only), given its heading ("When you are ready, we are here") and contact-channel column both read as "talk to someone" while the button alone routes to the self-serve Journey Passport flow? | R1.2-014 (Arjun) | Low-impact — the section already offers WhatsApp/Phone/Email directly — but Arjun named this the single P1 item worth a specific Product decision from this review. | Under Discussion |

### Retired / Resolved Open Decisions

Retained here (never deleted) for historical traceability, per the project's Decision Governance principle of superseding rather than deleting.

| ID | Open Discussion | Raised In | Resolution | Status |
|---|---|---|---|---|
| OPEN-R1.2-001 | Future of Experiences navigation — should "Experiences" remain a distinct top-level concept, be merged into Journey Moods, or be repositioned? | Workstream 2 | Resolved by DEC-R1.2-009 (15-Aug-2026) and refined by DEC-R1.2-012 (16-Aug-2026) — Experiences is temporarily retired from the public website while its implementation, assets and code remain preserved for future reuse | Resolved |
| OPEN-R1.2-002 | Final Experience taxonomy — the definitive naming/grouping of Experience vs Journey Mood concepts | Workstream 2 | Resolved by DEC-R1.2-009 and DEC-R1.2-012 — Journey Mood Cards and Journey Passport are the single public traveller discovery model for Release 1.2 | Resolved |

---

# 9. Future Release Candidates

Ideas intentionally excluded from Release 1.2 scope. Carried forward from `RELEASE-1.2-BACKLOG.md` (P2/P3 items not selected as one of the 8 approved workstreams) and from R1.1's deferred list where still relevant. Nothing here is lost — it is simply not in scope for this release.

| Description | Reason Deferred | Recommended Release | Priority |
|---|---|---|---|
| Hero background personalization / seasonal homepage variants | Not part of the 8 approved R1.2 workstreams | R1.3+ | P2 |
| AI-assisted homepage personalization | Speculative; no approved business case yet | Future | P3 |
| Dedicated Pace and Duration questions (beyond the R1.2 defect fix) | Broader Passport question redesign is out of scope for R1.2's defect-focused workstream | R1.3+ | P2 |
| First International reassurance preference | Deferred from R1.1; not selected for R1.2 | R1.3+ | P2 |
| Traveller profile memory / adaptive Journey Director recommendations | Requires architecture and data-model work beyond R1.2 scope | Future | P3 |
| AI itinerary generation | Large scope, no approved business case | Future | P3 |
| Traveller Story search, filtering, featured stories | Not selected for R1.2 | R1.3+ | P2 |
| Traveller submissions / video stories | Larger content-operations undertaking | Future | P3 |
| Lightweight content management interface | Deferred pending R1.2 data-quality work (autocomplete, phone) landing first | Future | P2 |
| Suggested itineraries / interactive maps on destination pages | Not selected for R1.2 | Future | P3 |
| Experience collections / dynamic experience recommendations | Taxonomy resolved (DEC-R1.2-009; refined by DEC-R1.2-012); preserved Experiences implementation, assets and code may be reused in a future redesign | R1.3+ | P2 |
| Destination Intelligence expansion — additional destination metadata: seasonal suitability, budget suitability, couple score, family score, senior traveller score, child-friendly score, festival suitability, luxury suitability, wellness suitability | Planning only — not Release 1.2 scope | R1.3+ / Future | P2 |
| Awards / recognitions / press mentions / trust dashboard | Not selected for R1.2 | Future | P3 |
| Bundle optimisation / infrastructure modernisation | Engineering housekeeping, not release-critical | Future | P2 |
| Accessibility certification readiness | Beyond the accessibility review already included in each workstream | Future | P3 |
| International SEO readiness | Broader than the SEO considerations already scoped in Workstream 2 | Future | P3 |
| Business dashboard / behaviour heatmaps / funnel analytics | Larger analytics investment | Future | P3 |
| Conversational AI planning assistant / personalized destination discovery | Speculative; no approved business case | Future | P3 |
| OTP verification for additional lead-capture forms (Plan My Experience, Contact Us, Callback Request) | Not required for Release 1.2; current decision (DEC-R1.2-006) limits OTP to Journey Passport only | R1.3+ (pending OPEN-R1.2-006) | P3 |
| Native mobile applications, traveller login/accounts, online booking/payments, vendor portal, CRM replacement, multi-language support, large-scale AI automation | Explicitly out of scope per `RELEASE-1.2-BACKLOG.md` | Not scheduled | — |

---

# 10. Risks & Mitigations

| ID | Description | Impact | Likelihood | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| RISK-R1.2-001 | Mood card palette/saturation changes drift from the approved brand system | Medium — could require rework | Low | Completed: validated against the approved brand direction through the Luxury Balance Pass, functional QA, Traveller Experience Review and Business Acceptance | Sophie | Closed |
| RISK-R1.2-002 | Workstream 2's open taxonomy decisions (OPEN-R1.2-001/002) remain unresolved and stall Workstream 1 labelling or Workstream 3 mapping | Medium — schedule slip | Medium | Resolved — DEC-R1.2-009 closed the taxonomy question and DEC-R1.2-012 confirmed Journey Mood Cards and Journey Passport as the single public traveller discovery model | Tiger | Closed |
| RISK-R1.2-003 | Featured Destination deep-link mapping goes stale as destinations are added/removed | Low-Medium — broken/irrelevant links over time | Medium | Defined fallback behaviour (R1.2-03.04); document mapping maintenance responsibility | Archie | Open |
| RISK-R1.2-004 | Changing phone storage format breaks compatibility with existing Release 1.0/1.1 lead records | High — data integrity / reporting impact | Medium | Archie's architecture assessment required before implementation (per Project Instructions Section 5); consider migration or dual-read approach | Archie | Open |
| RISK-R1.2-005 | Free geographic datasets (GeoNames/OSM) have incomplete or inconsistent coverage of Indian place-name aliases | Medium — validation gaps or false rejections | Medium | Explicit edge-case test list (R1.2-06.09); accept known gaps as documented limitations rather than blocking release | Archie / Keerthi | Open |
| RISK-R1.2-006 | Destination autocomplete validation logic drifts into duplicating Journey Director's served-destination logic | Medium — architectural duplication, inconsistent behaviour | Low | Explicit guardrail task R1.2-06.06 and DEC-R1.2-004; Archie reviews before merge | Archie | Open |
| RISK-R1.2-007 | Journey Passport entry-context defect fixes narrowly resolve the four known cases but regress adjacent entry paths | Medium — new defects introduced while fixing old ones | Medium | Full entry-path regression required (R1.2-04.05), not just the four defect areas | Keerthi | Open |
| RISK-R1.2-008 | Release documentation is deferred to the end and creates end-of-release pressure (as happened in R1.1 per Lessons Learned) | Medium — schedule pressure, rushed documentation | Medium | Workstream 7 treated as a living document updated throughout, not a final-week task | Tiger | Open |
| RISK-R1.2-009 | QA (Workstream 8) is compressed into a single end-of-release pass | Medium — reduced defect-finding capacity late in the cycle | Medium | Run relevant regression subsets incrementally per workstream rather than solely as a final gate | Keerthi | Open |
| RISK-R1.2-010 | OTP service outage or delivery failure could prevent Journey Passport submission | High — could block Journey Passport lead capture entirely if unmitigated | Low-Medium | Graceful error handling; resend capability; monitoring; provider fallback (future consideration) | Archie | Open |
| RISK-R1.2-011 | The weighted Primary/Secondary/Tertiary destination preference model changes Journey Director's recommendation output in ways not yet fully assessed | Medium-High — could alter existing recommendation behaviour travellers and the Product Owner are accustomed to | Medium | Archie's architecture review required before implementation (R1.2-03.11); recommendation-consistency validation (R1.2-03.12) required before release; served-destination guardrail (DEC-R1.2-004) explicitly preserved and not affected | Archie | Open |

---

# 11. Dependency Tracker

High-level workstream dependencies:

```
Workstream 1 (Mood Card Visual Refinement) — Complete
        ↓
Workstream 8 (Release-wide QA & Regression)
        ↓
Release
```

```
Workstream 2 (Experience/Mood Rationalisation) — Complete
        ↓
Workstream 3 (Destination Intelligence) — now the active implementation stream, targets the rationalised concept
        ↓
Workstream 8 (Release-wide QA & Regression)
        ↓
Release
```

```
Workstream 6 (Destination Autocomplete & Validation)
        ↓
Workstream 4 (Journey Passport Entry Context Improvements) — shares the Passport surface
        ↓
Workstream 8 (Release-wide QA & Regression)
        ↓
Release
```

```
Workstream 5 (International Phone Number & OTP Verification)
        ↓
Workstream 8 (Release-wide QA & Regression) — Forms, Footer, Contact
        ↓
Release
```

```
Workstream 1, 2, 3, 4, 5, 6 (all functional workstreams)
        ↓
Workstream 7 (Release Documentation) — retrospective/notes finalised last
        ↓
Workstream 8 (Release-wide QA & Regression)
        ↓
Release
```

| Dependency | Type | Notes |
|---|---|---|
| WS2 → WS1 | Satisfied | Workstream 2 analysis and DEC-R1.2-012 confirmed the discovery model; Workstream 1 is Complete and requires no further taxonomy change. |
| WS1 → WS2 | Satisfied | R1.2-02.13 preserved the accepted Workstream 1 homepage hierarchy when the Experiences entry was removed; confirmed with no regression by Rad's engineering validation (R1.2-010) and Sri's traveller experience validation (R1.2-012). |
| WS2 → WS3 | Satisfied | Workstream 2 is Complete (analysis, UX implementation, engineering, Functional QA and Traveller Experience Validation all closed). Journey Mood Cards and Journey Passport are confirmed as the approved discovery model. Workstream 3 (Destination Intelligence) is no longer blocked and is now the next active implementation stream. |
| WS6 → WS4 | Shared surface | Both touch the Journey Passport; coordinate regression |
| WS5 → WS4 | Shared surface | OTP verification gates Journey Passport final submission; entry-context fixes govern earlier steps in the same flow — coordinate regression |
| WS6 → WS3 | Soft | Destination mapping may reference autocomplete-validated names |
| WS5 → WS8 | Hard | Phone-dependent flows must be regression tested before release |
| WS1–WS6 → WS7 | Hard | Retrospective and release notes require the functional scope to be stable |
| WS1–WS7 → WS8 | Hard | Release-wide QA runs against the completed scope |

---

# 12. Release Checklist

This is a release-readiness checklist for R1.2 at the master-tracker level. A detailed operational go-live checklist (in the style of `RELEASE-1.1-GO-LIVE-CHECKLIST.md`) should be produced under Workstream 7 closer to release.

## Delivery

- [ ] All 8 workstreams are Complete or explicitly Deferred with Product Owner acceptance
- [x] All EBCs raised under Release 1.2 through R1.2-015 are completed
- [ ] No known functional release blocker remains open

## Documentation

- [x] This document (`RELEASE-1.2.md`) is current at Version 1.7
- [ ] `PROJECT-HISTORY.md` updated with the Release 1.2 entry
- [ ] Release notes prepared
- [x] Decision log (Section 7) reflects all approved material decisions through DEC-R1.2-013
- [ ] Open decisions (Section 8) are resolved or explicitly carried to a future release (now includes OPEN-R1.2-007–009 from R1.2-014)

## Quality

- [ ] Keerthi's functional QA (Workstream 8) sign-off received
- [ ] Sri's traveller experience validation complete
- [ ] Production build, TypeScript and ESLint checks pass
- [ ] Cross-browser and responsive validation complete

## Release Approval

- [ ] Business Owner (Vivek) walkthrough and approval received
- [ ] Production smoke test passed
- [ ] Release marked complete
- [ ] Retrospective complete (Workstream 7)

---

# 13. Post-Implementation Observations

## Purpose

This section records observations identified during implementation, Functional QA, Traveller Experience Review, and Business Acceptance that were consciously accepted without reopening the completed workstream.

These observations are **not defects**, **not release blockers**, and **not pending tasks**. They are retained to preserve product knowledge and may inform future design refreshes or roadmap discussions.

---

## Workstream 1 – Homepage Mood Experience

**Status:** Accepted

### OBS-R1.2-001
**Title:** Memory Makers visual identity

**Source:** Sri – Traveller Experience Review

**Observation:**

The Memory Makers card is slightly weaker than the other four mood cards. The two-line title and illustration require marginally more effort to recognise compared to Relax, Explore, Celebrate and Romance.

**Decision:**

Accepted.

No further design changes will be made as part of Release 1.2 Workstream 1.

This may be revisited during a future homepage design refresh.

---

### OBS-R1.2-002
**Title:** Desktop hover affordance

**Source:** Sri – Traveller Experience Review

**Observation:**

Hover feedback on desktop is intentionally subtle and premium, but could be made marginally more pronounced for discoverability.

**Decision:**

Accepted.

Current interaction behaviour remains aligned with the approved premium design direction.

Future refinement may be considered during a broader UX review.

---

### OBS-R1.2-003
**Title:** Mobile first-fold visibility

**Source:** Sri – Traveller Experience Review

**Observation:**

Depending on the device height and viewport size, not all five Journey Mood cards are visible within the initial mobile viewport before scrolling. A small amount of scrolling is required before the complete Journey Mood experience is visible.

**Decision:**

Accepted.

This behaviour is consistent with the approved homepage hierarchy and does not negatively impact the traveller experience.

No layout changes are planned as part of Release 1.2.

This observation may be revisited during a future homepage redesign if the Hero composition or above-the-fold content changes.

---

### OBS-R1.2-004
**Title:** Responsive automation limitation

**Source:** Keerthi – Functional QA

**Observation:**

Automated responsive validation within the cloud testing environment could not fully simulate tablet and mobile viewport behaviour.

Manual validation was completed successfully on Android using the local development environment.

**Decision:**

Accepted.

This is an environmental limitation of the validation tooling and does not represent a product defect.

---

### OBS-R1.2-005
**Title:** Luxury warmth versus readability balance

**Source:** Business Review / Traveller Experience Review

**Observation:**

Multiple visual iterations were evaluated during Workstream 1 to balance premium warmth with homepage readability. The original gold-dominant treatment created stronger visual richness but reduced text readability where the Hero's golden-hour sunlight was brightest. The final champagne-glass treatment restored warmth while preserving clear visual separation from the Hero.

**Decision:**

Accepted.

The final Luxury Balance Pass represents the approved visual direction for Release 1.2.

Future homepage redesigns should treat this implementation as the visual baseline rather than revisiting the original gold treatment.

---

## Summary

The Homepage Mood Experience (Workstream 1) successfully completed:

- Engineering Implementation
- Engineering Cleanup
- Functional QA
- Traveller Experience Review
- Business Acceptance

All observations recorded above were reviewed by the Product Owner and consciously accepted.

No Critical, High, or Medium severity defects remain open for this workstream.

Workstream 1 is therefore considered **Complete**.

The observations recorded above intentionally preserve implementation and design knowledge for future releases. They do not represent release debt, outstanding defects, or pending work, and therefore do not prevent Release 1.2 from progressing to subsequent workstreams.

---

## Workstream 2 – Experiences Retirement

**Status:** Accepted

### OBS-R1.2-006
**Title:** Tablet-width responsive validation blocked by test tooling

**Source:** Keerthi – Functional QA (R1.2-011)

**Observation:**

A dedicated controlled pass at tablet width (approximately 768–1024px) could not be completed — the browser-resize tool used in the validation session changed the viewport once and then stopped responding to further resize calls within the same tab, the same test-tooling limitation recorded against Workstream 1 (OBS-R1.2-004). As partial mitigating evidence, a separate browser tab that happened to open at approximately 1170px (tablet range) displayed a clean layout with no visible breakage.

**Decision:**

Accepted.

This is an environmental limitation of the validation tooling, not a product defect — consistent with OBS-R1.2-004's treatment of the same limitation under Workstream 1. No Critical, High or Medium severity defect is open for Workstream 2.

Recommend Tiger schedule a short follow-up tablet-width check (real device, DevTools device toolbar, or a deployed preview) ahead of final release sign-off; this does not block Workstream 2 closure or Workstream 3 from proceeding.

---

## Summary

Workstream 2 (Experiences vs Journey Mood Rationalisation) successfully completed:

- Product Analysis (R1.2-007)
- UX Implementation (R1.2-009)
- Engineering Completion (R1.2-010)
- Functional QA (R1.2-011)
- Traveller Experience Validation (R1.2-012)

The observation recorded above was reviewed and consciously accepted; it does not represent release debt, an outstanding defect, or pending work.

No Critical, High, or Medium severity defects remain open for this workstream.

Workstream 2 is therefore considered **✅ Complete**, and Workstream 3 (Destination Intelligence) is now the next active implementation stream.

---

## Homepage Architecture Validation Review (R1.2-014)

**Status:** Accepted — re-confirms Workstream 1 and Workstream 2; does not reopen either.

**Source:** Arjun (Product/Business/IA) and Sophie (UX/Visual Hierarchy), each reviewing the live, implemented homepage independently, dated 16-Aug-2026. Filed under EBC number R1.2-014 rather than a "Workstream 3" label — both reviewers independently flagged in their own reviews that a "WS3" label would conflict with the tracker's actual Workstream 3 (Destination Intelligence) and recommended sequential EBC numbering instead; Tiger/Rad adopted that recommendation when filing this review (see R1.2-015 in the Document Change History).

**Outcome:** Both reviewers independently re-derived their findings directly from the current repository (not by citing the WS1/WS2 chain alone) and found no new evidence to justify reopening DEC-R1.2-009 or DEC-R1.2-012. The live ten-section homepage — Header, Hero + Journey Mood Cards, Featured Destinations, Trust Points, Traveller Stories, Trust Strip, Travel Inspiration, About/Promise Preview, Contact Preview, Footer — was assessed as coherent, low-cognitive-load and release-ready. See DEC-R1.2-013 for the recorded decision.

**New findings raised as Open Product Decisions (Section 8):** the Header's tablet-range CTA breakpoint (OPEN-R1.2-007), Trust Points' icon treatment and imagery (OPEN-R1.2-008), and the Contact Preview CTA's routing (OPEN-R1.2-009). None are release-blocking.

### Technical Debt Register

Carried forward as intentional technical debt — not defects, not pending tasks, not release blockers:

| Item | Description | Disposition |
|---|---|---|
| Preserved Experiences implementation | `JourneyInvitations.tsx` (the on-brand, previously-live "Journey Invitations" block) remains in the repository, unimported, per DEC-R1.2-009/012 and reaffirmed by DEC-R1.2-013. | Intentional — retained for possible future reuse. Not a defect. |
| Orphaned off-brand `Experiences.tsx` / `ExperienceCard.tsx` | A second, separate "Experiences" component (`web/components/sections/Experiences/`) not imported anywhere in the codebase (the live `/experiences` route uses `EditorialCardGrid`/`EditorialCardItem` instead). Styled with generic grey Tailwind defaults and raw emoji/text icons — inconsistent with the site's espresso/cream/amber brand system. First identified by Sophie's R1.2-014 review. | Unused legacy component — confirmed. Recommend Rad schedule a future cleanup/removal task; carries a small risk that a future contributor mistakes it for the on-brand `JourneyInvitations.tsx`. Not actioned under this documentation-only EBC. |
| Unused colour-token system | `web/app/globals.css` defines nine named "Brand Colors" custom properties, but no component references them as Tailwind theme-colour utilities — every component hardcodes literal hex values instead (~193 distinct hex occurrences found across `components/` and `app/`; only espresso, amber and cream are actually in active use). First identified by Sophie's R1.2-014 review. | Subject to future engineering validation — a future design-token consolidation pass (Archie/Rad) should either wire components to the existing tokens or remove the unused ones. Not a current defect; visual consistency today is maintained by developer discipline across the hardcoded values. |

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
| Deferred | Explicitly moved out of Release 1.2 scope (see Section 9) |
| Cancelled | No longer required |

## Quick-reference symbols (optional, consistent with `RELEASE-1.1-MASTER-TRACKER.md`)

| Symbol | Meaning |
|---|---|
| ✅ | Complete |
| 🟡 | In Progress / Release Remaining |
| 🔵 | Deferred to a future release |
| ⚪ | Superseded / Cancelled |
| 🚫 | Blocked |
