# Search My Vacation Website

# Release 1.2 Master Planning & Tracking Document

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.2 Master Planning & Tracking Document |
| Version | 1.16 |
| Status | Draft — Active Implementation |
| Origin EBC | R1.2-001 (see Document Change History below for every EBC that has updated this document) |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Single source of truth for Release 1.2 planning, execution, QA, decision tracking and release readiness |
| Baseline | Release 1.1 — `v1.1.0` |
| Related | `docs/10-Backlog/RELEASE-1.2-BACKLOG.md` (source roadmap ideas), `docs/09-Development/PROJECT-HISTORY.md`, `docs/10-Backlog/RELEASE-1.1-MASTER-TRACKER.md` (R1.1 precedent), `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (governing architecture for Destination Intelligence — Status: Accepted) |
| Last Updated | 19 August 2026 |

**EBC Numbering Convention:** Release 1.2 EBCs use a release-based numbering sequence rather than the legacy `EBC-0xx` numbering used through Release 1.1. **R1.2-001** created this document; **R1.2-002** added Journey Passport OTP Verification planning; **R1.2-003** added Homepage Simplification and Destination Intelligence Enhancements planning; **R1.2-004** implemented the Homepage Mood Experience refinement; **R1.2-005** completed the Mood Card Luxury Balance Pass; **R1.2-006** completed the Sri Traveller Experience Review; **R1.2-007** completed Workstream 2 Product Analysis; **R1.2-008** consolidated the tracker as Version 1.5; **R1.2-009** completed Workstream 2 UX Implementation; **R1.2-010** completed Workstream 2 Engineering Completion; **R1.2-011** completed Workstream 2 Functional QA; **R1.2-012** completed Workstream 2 Traveller Experience Validation; **R1.2-013** closed Workstream 2 and consolidated the tracker as Version 1.6; **R1.2-014** completed an independent Homepage Architecture Validation Review (Arjun — Product/IA; Sophie — UX/Visual Hierarchy) re-confirming Workstream 1 and 2 outcomes against the live implementation — **this EBC is explicitly NOT the tracker's Workstream 3** (Destination Intelligence remains Workstream 3's approved scope; see both reviewers' own Section 0.1 scope notes) and is numbered sequentially here specifically to avoid that confusion; **R1.2-015** performed this documentation-alignment pass, filed R1.2-014's findings into their proper sections below, and confirmed Workstream 3 required no change; **R1.2-016** added a reference to the newly-created `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (authored under `ADR-R1.2-WS3-EBC-ARCHIE-001`) as the governing architecture document for Destination Intelligence — see Section 6.3; **R1.2-017** finalised that ADR's status from Proposed to Accepted following its formal ratification by the Business Owner and Architecture Reviewer (authored under `ADR-R1.2-WS3-EBC-ARCHIE-002`), and updated this tracker's reference to it accordingly; **R1.2-018** closed the Workstream 3 planning chapter (authored under native EBC ID `R1.2-03.06-EBC-RAD`), recording completion of the WS3 governance/planning chain and readiness to begin implementation — see Section 5's Workstream 3 entry for the ID-collision note explaining why this update is recorded here rather than against the Section 6.3 task table's own, unrelated `R1.2-03.05`/`R1.2-03.06` rows; **R1.2-019** (authored under native EBC ID `R1.2-03.08A-EBC-ARCHIE`) closed `ADR-R1.2-WS3-001`'s Outstanding Decision 1, recording Rad's appointment as Destination Operational Steward and adding decision DEC-R1.2-014; and **R1.2-020** (authored under native EBC ID `R1.2-03.09-EBC-ARCHIE`) consolidated this tracker to reflect Workstream 3's actual implementation progress — Phase 0 (Governance Foundations, commit `9e38d00`), the Steward appointment (commit `749e421`), and Phase 1B (Operational Layer Alignment, commit `7022917`, Assam only) — adding a new Implementation Phase Dashboard and Deferred Items Register to Section 5, without altering the Section 6.3 task table or any architecture/business decision; and **R1.2-021** (authored under native EBC/Decision ID `DEC-R1.2-015`) formally ratified ADR §15 Decision 2 (Warn Mode First) as the approved operating model for Release 1.2 Phase 2 reconciliation and validation activities, closing a governance-documentation gap identified by Archie's compliance review, and added decision `DEC-R1.2-015`; and **R1.2-022** (authored under native EBC ID `R1.2-WS3-OBS-01-EBC-TIGER`) registered three pre-existing engineering observations — shared generated-artefact ownership, the Goa/mountain-intent steering-verification defect, and the `verify:journey-engine` `moodValues` fixture issue — that Rad identified and verified unrelated while executing WP-4 (`R1.2-WS3-IMP-01A-EBC-RAD`) and Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`), filing them into a new Workstream 3 subsection of Section 13 without authorising any implementation; **`R1.2-WS3-IMP-01A-EBC-RAD` and `R1.2-WS3-IMP-01B-EBC-RAD` themselves remain unlogged in this tracker** — their consolidation into Document Change History, the Section 5 Workstream 3 Implementation Phase Dashboard and EBC counts is a separate, not-yet-scheduled Tiger/Rad task, flagged here rather than silently resolved, consistent with the transparency practice established at R1.2-015/018/020; and **R1.2-023** (authored under native EBC ID `R1.2-023-EBC-TIGER`) performed exactly that consolidation — closing WS3 Phase 2 WP-4 by recording, in Section 5's Workstream 3 dashboards and milestones, the completion of WP-4 Implementation (`R1.2-WS3-IMP-01A-EBC-RAD`), Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`), Rad's Engineering Validation (recorded within `R1.2-WS3-IMP-01B`), and Keerthi's Functional Validation (`R1.2-WS3-IMP-01C-EBC-KEERTHI`, **Passed**), and cross-referencing `DEC-R1.2-015` and `OBS-R1.2-007`/`008`/`009` without duplicating their content. This EBC also filed Keerthi's validation report into the canonical repository location (`docs/09-Development/`), where it had not yet been placed. No code, workbook, generator, or architecture change was made — documentation and release-governance only; nothing was committed or pushed. WP-5 (Controlled Vocabulary Synchronisation) remained a separate, not-yet-authorised work package at that time; and **R1.2-024** (authored under native EBC ID `R1.2-024-EBC-TIGER`, "Workstream 3 Final Consolidation & Closure") — following independent confirmation via `git log`/`git rev-parse` that WP-5's implementation (commit `6c15cfe973a99315e962e9670577081171fe1f9f`, on top of WP-4's `a183e18`) is committed and pushed, satisfying this EBC's own Repository Assessment gate — recorded WP-5's implementation (`R1.2-WS3-IMP-02-EBC-RAD`) and Keerthi's independent functional validation (`R1.2-WS3-IMP-02A-EBC-KEERTHI`, **Passed**, all 14 acceptance criteria met) in Section 5's Workstream 3 dashboards and Implementation Milestones table, marked Phase 2 (Generation & Vocabulary Alignment) ✅ Complete and the Workstream 3 Status field Complete per this EBC's own explicit instruction (Section 5 Scope and Acceptance Criterion 4 of the source card), **while explicitly leaving Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) at "Not started" with no status change**, per the same source card's own Section 6 (Explicitly Out of Scope) and Section 9 (Deferred Items) — this pairing is a deliberate, named distinction, not an oversight, and is restated at the Workstream 3 Status field itself. `OBS-R1.2-007`/`008`/`009` and the Section 6.3 task table (`R1.2-03.01`–`03.15`, still Proposed) were likewise left entirely unchanged, cross-referenced only. This EBC also filed Keerthi's WP-5 validation report into the canonical repository location (`docs/09-Development/`), where it had not yet been placed, and produced a new standalone closure report, `docs/09-Development/R1.2-024-EBC-TIGER-Workstream-3-Closure.md`. No code, workbook, generator, or architecture change was made; nothing was committed or pushed by this EBC. Future Release 1.2 cards continue sequentially from `R1.2-025`. This convention does not renumber or otherwise affect existing `EBC-0xx` cards from Release 1.0/1.1.

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
| 1.9 | 17-Aug-2026 | Archie | R1.2-017 | Documentation finalisation pass (EBC `ADR-R1.2-WS3-EBC-ARCHIE-002`). Following completion of the Workstream 3 Architecture & Product Review and formal approval by the Business Owner (Vivek) and Architecture Reviewer (Tiger), updated `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`'s status from "Proposed — ready for Product Owner ratification" to "Accepted"; added a standard ADR metadata block and an Effective Date field; recorded the ratification as a new Decision History entry within the ADR itself. Corrected this tracker's Workstream 3 "Governing architecture" reference (Section 6.3) and the Document Information "Related" field, both of which previously described the ADR as pending ratification, to reflect its Accepted status. No architectural principle, governance decision, or investigation finding was changed — housekeeping only, consistent with this EBC's explicit constraints. |
| 1.10 | 18-Aug-2026 | Rad | R1.2-018 | Documentation alignment pass (native EBC ID `R1.2-03.06-EBC-RAD`) closing the Workstream 3 planning chapter. Recorded completion of the full WS3 governance/planning chain — Product Analysis (Arjun), Traveller Experience/UX Validation (Sophie), Knowledge Base Synchronisation Audit (Rad), Source Comparison & Runtime Trace Analysis (Rad), Governance Architecture (Archie), `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (Accepted), and Implementation Planning (Rad, `docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`) — via a new "Workstream 3 Planning Dashboard" and "WS3 Implementation Readiness" subsection under Section 5, updated the Workstream 3 narrative and Status field (Proposed → Approved — Planning Complete, Implementation Ready to Begin), and reconciled the Section 3 dashboard EBC counts and Section 12 checklist's stale EBC/version cross-references. **Flagging a literal ID collision per Project Instructions Section 35, consistent with the same category of mismatch already named in R1.2-015/016/017:** this EBC's own native ID (`R1.2-03.06-EBC-RAD`) and its instruction to mark "R1.2-03.05" Complete both collide with pre-existing, unrelated Section 6.3 task-table rows — `R1.2-03.05` ("Define analytics considerations," Owner Archie, Proposed) and `R1.2-03.06` ("Regression testing," Owner Keerthi, Proposed) — which remain part of the original, not-yet-started Destination Mapping/Deep-Linking/Weighted-Model implementation scope defined under EBC R1.2-003. Consistent with the Product Owner's prior direction on this exact pattern (R1.2-015), those task-table rows and every task status under `R1.2-03.01`–`03.15` were left entirely unchanged; this update is recorded under the tracker's own sequential EBC-numbering convention (`R1.2-018`) instead, and the completed WS3 governance/planning chain is referenced by its own document paths rather than by conflating it with the Section 6.3 task IDs. Documentation only — no application code, generators, runtime assets, datasets, workbooks, architecture documents, or implementation task status was changed. |
| 1.11 | 18-Aug-2026 | Archie | R1.2-019 | Governance update (native EBC ID `R1.2-03.08A-EBC-ARCHIE`) closing `ADR-R1.2-WS3-001`'s Outstanding Decision 1. Following escalation during `R1.2-03.08` Phase 1 implementation (Rad found WP-1.2/1.3/1.4 blocked because the ADR's Artefact Ownership Matrix assigns the Operational Layer workbook to a Destination Operational Steward role no persona held) and subsequent approval by the Business Owner (Vivek) and Architecture Reviewer (Tiger), updated the ADR to: mark Outstanding Decision 1 **Closed – Approved** (Section 15); name Rad as Destination Operational Steward in the Artefact Ownership Matrix (Section 8); add a new Governance Roles subsection (8.1) consolidating existing role responsibilities; and record the approval as a new Decision History entry. Added decision `DEC-R1.2-014` to this tracker's Product Decision Log (Section 7) recording the appointment, and reconciled the Section 3 dashboard's Approved Decisions and EBC counts. No architectural principle, layer boundary, source-of-truth assignment, or other governance decision was changed — this closes a decision the ADR itself had already flagged as outstanding (Section 15) and does not require a superseding ADR. Documentation only; no application code, generators, runtime assets, datasets, or workbooks were changed. This also unblocks Rad's escalated `R1.2-03.08` Phase 1b (WP-1.2/1.3/1.4), which remains a separate, not-yet-scheduled implementation EBC. |
| 1.12 | 18-Aug-2026 | Archie | R1.2-020 | Documentation consolidation (native EBC ID `R1.2-03.09-EBC-ARCHIE`) recording Workstream 3's actual implementation progress in the tracker. **Flagging a literal ID collision per Project Instructions Section 35, consistent with the same category of mismatch already named in R1.2-015/016/017/018:** this EBC's own native ID (`R1.2-03.09-EBC-ARCHIE`) collides exactly with the pre-existing, unrelated Section 6.3 task-table row `R1.2-03.09` ("Review and validate all destination Journey and Memory mappings against the approved destination weighting matrix," Owner Arjun, Proposed), which remains part of the original, not-yet-started weighted-preference-model implementation scope. That task-table row was left entirely unchanged; this update is recorded under the tracker's own sequential EBC-numbering convention (`R1.2-020`) instead, and this EBC's actual subject (Phase 0/Steward/Phase 1B consolidation) is referenced by its own commit hashes and document paths rather than by conflating it with task-table `R1.2-03.09`. Independently verified against repository evidence (commit history and the underlying implementation reports) rather than taken on trust: `9e38d00` (`R1.2-03.07-EBC-RAD`, Phase 0 — Governance Foundations: cross-reference/ownership comments added to `DESTINATION-KNOWLEDGE-BASE.md`, `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` and 5 generation-pipeline code files; no logic changed); `749e421` (`R1.2-019`/`R1.2-03.08A-EBC-ARCHIE`, already recorded above); `7022917` (`R1.2-03.08B-EBC-RAD`, Phase 1B — Operational Layer Alignment: resolved the Assam structural misalignment in the operational workbook — 2 rows relocated/renamed, 5 Review Register items closed — with `Journey Base Status` deliberately left unchanged on both rows, so no runtime, generated-JSON, or recommendation-eligibility impact; Amritsar, Darjeeling and Corbett explicitly left open, not resolved). Added a new "Workstream 3 Implementation Phase Dashboard" and "Workstream 3 Deferred Items Register" under Section 5, distinct from the Section 6.3 task table (`R1.2-03.01`–`03.15`, statuses unchanged, remain Proposed, consistent with the ID-collision handling established at `R1.2-015`/`018`); updated the Workstream 3 Status field and narrative to reflect Phase 2 (Generation & Vocabulary Alignment) as next; reconciled the Section 3 dashboard's EBC counts. No architecture document, Knowledge Base, workbook, runtime code, recommendation logic, business decision, or task sequencing was changed — documentation only. |
| 1.13 | 19-Aug-2026 | Tiger | R1.2-021 | Governance ratification (native Decision/EBC ID `DEC-R1.2-015`), created at `docs/09-Development/DEC-R1.2-015-Ratification-Warn-Mode-First.md`. During the Architecture & Governance Compliance Review of the Phase 2 implementation EBC, Archie identified that `ADR-R1.2-WS3-001` §15 Decision 2 (Warn Mode vs. Block Mode) remained an architectural recommendation rather than a formally ratified governance decision, even though the ADR already recommended it and Phase 2 planning already assumed it. Vivek approved `DEC-R1.2-015` on 19 August 2026, formally ratifying **Warn Mode First** as the approved operating model for all reconciliation and validation activities introduced under Release 1.2 Phase 2 (WP-4/WP-5); Block Mode is not approved for Release 1.2 Phase 2. Updated the ADR's Outstanding Product Decisions (Section 15, Decision 2 — now Closed – Approved) and Decision History (Section 17); added decision `DEC-R1.2-015` to this tracker's Product Decision Log (Section 7); reconciled the Section 3 dashboard's Approved Decisions and EBC counts. No architectural principle, runtime behaviour, generator logic, implementation scope, or controlled vocabulary was changed — documentation and governance only. |
| 1.14 | 19-Aug-2026 | Tiger | R1.2-022 | Backlog registration (native EBC ID `R1.2-WS3-OBS-01-EBC-TIGER`, "Engineering Observations & Backlog Registration"). Registered three engineering observations Rad identified and independently verified as pre-existing while executing WP-4 (`R1.2-WS3-IMP-01A-EBC-RAD`) and Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`): shared generated-artefact ownership between `generate:journey-intelligence` and `generate:journey-itineraries` (`OBS-R1.2-007`, Medium); the `verify:journey-intelligence:steering` Goa/mountain-intent scoring defect, proven unrelated via exhaustive artefact diff (`OBS-R1.2-008`, Medium); and the `verify:journey-engine` `moodValues` fixture issue (`OBS-R1.2-009`, Low). Added a new "Workstream 3 – Destination Intelligence (WP-4 / Workbook Consistency Remediation)" subsection and Technical Debt Register table to Section 13 (Post-Implementation Observations); cross-referenced this EBC from `R1.2-WS3-IMP-01B-EBC-RAD`, the report that documented all three findings. No implementation, generator, runtime, verification-script, or Product Decision was authorised or made — documentation and backlog registration only, per this EBC's explicit scope. **Flagging for Tiger follow-up, consistent with the transparency practice established at R1.2-015/018/020:** `R1.2-WS3-IMP-01A-EBC-RAD` and `R1.2-WS3-IMP-01B-EBC-RAD` themselves remain unlogged in this tracker's Document Change History, Section 5 Workstream 3 Implementation Phase Dashboard and EBC counts; that consolidation is a separate, not-yet-scheduled task, outside this EBC's observations-only scope. |
| 1.15 | 19-Aug-2026 | Tiger | R1.2-023 | Documentation consolidation and close-out (native EBC ID `R1.2-023-EBC-TIGER`, "WS3 Phase 2 WP-4 Implementation Consolidation & Close-Out"). Closed WS3 Phase 2 WP-4 by consolidating the completed delivery chain into this tracker: WP-4 Implementation (`R1.2-WS3-IMP-01A-EBC-RAD`), Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`), Rad's Engineering Validation (recorded within `R1.2-WS3-IMP-01B`), and Keerthi's independent Functional Validation (`R1.2-WS3-IMP-01C-EBC-KEERTHI`) — **Passed**, all 6 acceptance criteria met, no defects found, regression findings limited to the three already-registered pre-existing observations (`OBS-R1.2-007`/`008`/`009`). Updated Section 5's Workstream 3 Status field, Planning Dashboard, Implementation Phase Dashboard, Implementation Milestones table and Deferred Items Register (runtime regeneration item resolved, uncommitted); cross-referenced `DEC-R1.2-015` (Warn Mode First governance basis) and `OBS-R1.2-007`/`008`/`009` without duplicating their content; reconciled the Section 3 dashboard's Overall Progress narrative and EBC counts (22→23). Also filed Keerthi's validation report into its canonical repository location (`docs/09-Development/R1.2-WS3-IMP-01C-EBC-KEERTHI-WP4-Functional-Validation.md`), where it had not yet been placed — content filed verbatim, not authored or altered by Tiger. **No code, generator, workbook, or architecture change was made; nothing was rerun or re-validated; nothing was committed or pushed**, per this EBC's explicit scope. WP-5 (Controlled Vocabulary Synchronisation) remains a separate, not-yet-authorised work package — Phase 2 as a whole is not yet complete, only WP-4 within it. |
| 1.16 | 19-Aug-2026 | Tiger | R1.2-024 | Workstream 3 Final Consolidation & Closure (native EBC ID `R1.2-024-EBC-TIGER`). This EBC's own Repository Assessment gate initially found WP-5 uncommitted (`R1.2-WS3-IMP-02-EBC-RAD-WP5-Implementation.md` explicitly recorded "uncommitted; nothing pushed"); execution was paused at that gate and the Product Owner chose to wait for the commit rather than proceed. Resumed only after independently re-verifying, via `git log`, `git status` and `git rev-parse HEAD` against `git rev-parse origin/feature/ebcr1.2-003-trust-strip-visual-refresh`, that WP-5 is committed and pushed as `6c15cfe973a99315e962e9670577081171fe1f9f` ("R1.2-024: Complete WS3 Phase 2 WP-5 generator label mapping alignment"), directly on top of WP-4's `a183e18` ("R1.2-023: Complete WS3 Phase 2 WP-4 implementation and validation") — this commit-message reuse of the "R1.2-024" label is a coincidence of the repository's own commit-authoring convention, not a reference to this tracker EBC, and does not constitute an ID collision requiring separate flagging (the same pattern already occurred, and was noted as non-colliding, with `a183e18`/`R1.2-023`). Recorded WP-5's Implementation (`R1.2-WS3-IMP-02-EBC-RAD`) and Keerthi's independent Functional Validation (`R1.2-WS3-IMP-02A-EBC-KEERTHI`) — **Passed**, all 14 acceptance criteria met, no functional defects, regression findings limited to the same already-registered pre-existing observations (`OBS-R1.2-007`/`008`/`009`) plus the same environment-only device-bridge FUSE limitation already documented under WP-4 — in Section 5's Workstream 3 Planning Dashboard, narrative, Implementation Phase Dashboard, Implementation Milestones table (also correcting the three previously-`*Uncommitted*` WP-4 milestone rows to reference `a183e18`, now that it is confirmed committed and pushed) and Deferred Items Register (removed the "(uncommitted)" caveat from the Runtime Regeneration row). Marked Phase 2 (Generation & Vocabulary Alignment) ✅ Complete and the Workstream 3 Status field Complete, per this EBC's own explicit Scope and Acceptance Criteria — **while explicitly leaving Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) at "Not started," with no status change**, per the same source card's own Section 6 (Explicitly Out of Scope: "close Phase 3; close Phase 4") and Section 9 (Deferred Items: "Confirm these remain deferred: ... Phase 3; Phase 4. No status changes."). This pairing — Workstream 3 marked Complete while Phase 3/4 remain Not Started — is the source EBC's own explicit instruction and is stated plainly, not silently reconciled; it reflects that Workstream 3's Phase 0–2 native-ID implementation chain (governance through vocabulary alignment) is complete, while the weighted Primary/Secondary/Tertiary preference model (Phase 3/4, and the still-Proposed Section 6.3 task table `R1.2-03.01`–`03.15`) is separate, future, not-yet-authorised scope. `OBS-R1.2-007`/`008`/`009` were cross-referenced without modification. Reconciled the Section 3 dashboard's Overall Progress narrative and EBC counts (23→24). Filed Keerthi's WP-5 validation report into its canonical repository location (`docs/09-Development/R1.2-WS3-IMP-02A-EBC-KEERTHI-WP5-Functional-Validation.md`), where it had not yet been placed — content filed verbatim, not authored or altered by Tiger — and produced a new standalone closure report, `docs/09-Development/R1.2-024-EBC-TIGER-Workstream-3-Closure.md`. **No code, generator, workbook, or architecture change was made; no artefact was regenerated; nothing was committed or pushed by this EBC**, per its explicit Out of Scope. |

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

**Implementation in Progress.** Workstream 1 is ✅ Complete, including the Trust Strip redesign, Mood Card refinement, Luxury Balance Pass, functional QA, Traveller Experience Review and Business Acceptance. Workstream 2 is now also ✅ Complete: Product Analysis (R1.2-007), UX Implementation (R1.2-009), Engineering Completion (R1.2-010), Functional QA (R1.2-011) and Traveller Experience Validation (R1.2-012) have all closed with no open defects, and the Product Owner has approved Workstream 2 for closure. An independent Homepage Architecture Validation Review (R1.2-014, Arjun and Sophie) has since re-confirmed both workstreams' outcomes against the live homepage, with no recommendation to reopen either — see Section 13. Workstream 3 (Destination Intelligence) remains unaffected by that review; its governance/planning chain — Product Analysis, UX/Traveller Experience Validation, Knowledge Base Synchronisation Audit, Source Comparison & Runtime Trace Analysis, Governance Architecture, `ADR-R1.2-WS3-001` (Accepted) and Implementation Planning — is now ✅ Complete (R1.2-018), and Workstream 3 is Approved and ready to begin implementation against its Section 6.3 task table; see Section 5 for the WS3 Implementation Readiness checklist. Remaining workstreams continue according to the Release 1.2 roadmap.

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

18 August 2026

## Document Version

1.10

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
| Overall Progress | Implementation in Progress | 2 of 8 workstreams are ✅ Complete (Workstream 1, Workstream 2); Workstream 3 (Destination Intelligence) has now closed its Phase 0–2 native-ID implementation chain — see below. An independent Homepage Architecture Validation Review (R1.2-014) has re-confirmed Workstreams 1 and 2 with no recommendation to reopen either; it does not change this count. Workstream 3's planning/governance chain is ✅ Complete (R1.2-018), Outstanding Decision 1 is closed (R1.2-019), and its native-ID implementation track — Phase 0, the Steward appointment, Phase 1B (Assam), and now all of Phase 2 (Generation & Vocabulary Alignment: **WP-4 and WP-5 both ✅ Complete** — implemented, workbook-remediated/generated, engineering-validated and Keerthi-functional-validated, Passed, 14/14 acceptance criteria for WP-5) — is ✅ Complete (R1.2-024; see Section 5's Workstream 3 Implementation Phase Dashboard). Workstream 3's Status field is recorded as Complete for this Phase 0–2 chain specifically; **Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) remain explicitly Not Started, deferred, and outside R1.2-024's scope** — this does not change the completed-workstream count above, which continues to require the full Section 6.3 task table (`R1.2-03.01`–`03.15`, still Proposed) and Phases 3–5, consistent with the native-ID/task-table distinction established at R1.2-015/018/020/023. Separately, Workstream 3's `search_geo_places()` Destination Search Performance & Reliability investigation (`IMP-09`–`IMP-13`, `AR-03`–`AR-11`, `QA-01`) is now Closed under `EBC-R1.2-WS3-TIGER-01` — an independent database-engineering sub-thread that likewise does not change the completed-workstream count, since it is not part of the Section 6.3 task table or the Phase 0–5 native-ID chain. |
| Number of Workstreams | 8 | All are approved release scope; individual lifecycle statuses are recorded in Section 5. |
| Number of Completed Workstreams | 2 | Workstream 1 and Workstream 2 are both Complete. Workstream 3's Phase 0–2 native-ID chain is Complete (R1.2-024), but Workstream 3 as a whole is not counted here while Phase 3–5 and the Section 6.3 task table remain Proposed/Not Started. |
| Number of Open Decisions | 7 | See Section 8 (2 further decisions — OPEN-R1.2-001, OPEN-R1.2-002 — retired/resolved; see Section 8's Retired sub-list). Includes 3 new decisions (OPEN-R1.2-007–009) raised by the R1.2-014 Homepage Architecture Validation Review. Open Decision OD-4 (Traveller Type vocabulary scope, `EBC-R1.2-03.05` §12) also remains unresolved, unaffected by R1.2-024. |
| Number of Approved Decisions | 15 | DEC-R1.2-001 through DEC-R1.2-015; see Section 7. DEC-R1.2-013 records the R1.2-014 validation review's confirmed outcome; DEC-R1.2-014 records the Destination Operational Steward appointment closing ADR §15 Outstanding Decision 1; DEC-R1.2-015 records the Warn Mode First ratification closing ADR §15 Outstanding Decision 2. R1.2-024 introduced no new decision. |
| Number of EBCs | 24 | R1.2-001 through R1.2-024; see Document Change History. `R1.2-WS3-IMP-01A-EBC-RAD` (WP-4), `R1.2-WS3-IMP-01B-EBC-RAD` (Workbook Consistency Remediation), `R1.2-WS3-IMP-01C-EBC-KEERTHI` (WP-4 Functional Validation), `R1.2-WS3-IMP-02-EBC-RAD` (WP-5 Implementation) and `R1.2-WS3-IMP-02A-EBC-KEERTHI` (WP-5 Functional Validation) are native-ID reports consolidated into this tracker by `R1.2-023`/`R1.2-024` rather than each carrying their own sequential number — consistent with how commit-referenced milestones were consolidated under `R1.2-020`. |
| Number of Completed EBCs | 24 | R1.2-001 through R1.2-024 are complete as of this consolidation. |
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
| Status | **Complete — Phase 0–2 native-ID implementation chain** (Governance Foundations, Destination Operational Steward Appointment, Phase 1B Operational Layer Alignment for Assam, and Phase 2 Generation & Vocabulary Alignment — both WP-4 and WP-5 — all implemented, engineering-validated and Keerthi-functional-validated, Passed; closed under R1.2-024). **Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) remain Not Started** — explicitly deferred, not part of this closure, per R1.2-024's own Out of Scope and Deferred Items sections. The Section 6.3 task table (`R1.2-03.01`–`03.15`, the weighted Primary/Secondary/Tertiary preference model) also remains entirely Proposed and unaffected by this closure, consistent with the native-ID/task-table distinction established throughout this document. This "Complete" status therefore describes the Phase 0–2 chain specifically, not the full Workstream 3 scope defined in Section 6.3. **A third, independent sub-thread — the `search_geo_places()` Destination Search Performance & Reliability investigation — is now also Closed** under `EBC-R1.2-WS3-TIGER-01` (see "Workstream 3 — Destination Search Performance & Reliability (Closed)" below). This sub-thread is a database-function engineering/architecture/QA investigation unrelated to the Destination Intelligence Model narrative above; its closure does not complete, and is not to be read as completing, Phase 3, Phase 4, or the Section 6.3 task table. |
| Dependencies | Benefits from Workstream 2's taxonomy outcome (which concept the deep link should target); depends on Workstream 6 for destination-level data quality if mapping references autocomplete-validated place names; R1.2-03.11 (Journey Director recommendation-ordering review) requires Archie's architecture review before implementation |
| Owner | Arjun (destination/journey mapping), Rad (implementation), Archie (fallback/analytics architecture, weighted-model architecture review) |
| Risks | Mapping table can become stale as destinations are added/removed; fallback behaviour must be robust or broken links will damage trust; the weighted preference model changing Journey Director's recommendation output without adequate review — see RISK-R1.2-011 |
| Acceptance Criteria | Destination-to-journey mapping defined; suggested-journey mapping defined; CTA reviewed; fallback behaviour defined and tested for unmapped destinations; analytics considerations documented; regression testing complete; weighted Primary/Secondary/Tertiary Journey and Memory preference model documented and implemented; Journey Director recommendation ordering reviewed against weighted preferences; recommendation consistency validated across all supported destinations; Wildlife Experiences destination card replaced by Gir; Kaziranga added as a new Featured Destination card; rotational ordering implemented for equally-weighted Wildlife destinations |

Tasks: R1.2-03.01 through R1.2-03.15 (Section 6.3).

**Architecture note (Archie must confirm before implementation):** the weighted Primary/Secondary/Tertiary Journey and Memory preference model materially affects Journey Director's recommendation-scoring structure and therefore requires Archie's assessment and explicit approval per Project Instructions Section 5 before implementation (R1.2-03.07 through R1.2-03.12) begins. This model does not change, and must not be implemented in a way that changes, the served-destination guardrail already established under DEC-R1.2-004 (R1.1 Decision Log DEC-010) — Journey Director remains solely responsible for validating whether a destination is served by SMV.

**Governing architecture:** `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (Status: **Accepted**, ratified 17 August 2026) is the governing architecture document for Destination Intelligence source-of-truth, synchronisation, controlled-vocabulary and lifecycle governance, formalising the findings of `R1.2-03.01`–`03.04`. Implementation tasks in this workstream (`R1.2-03.07` onward) should treat it as their primary architectural prerequisite alongside the Architecture note above.

**Destination Intelligence Model (Tiger's guidance):** the destination mapping spreadsheet is the starting point of a broader Destination Intelligence Model, not merely a configuration table. `Journey 1/2/3` and `Memory 1/2/3` represent Primary/Secondary/Tertiary Journey and Memory preferences respectively — business concepts that guide Journey Director recommendations. This tracker deliberately avoids prescribing fixed numerical weights; the relative priority (Primary/Secondary/Tertiary) is the documented product specification, and the underlying implementation/weighting approach may evolve across future releases without requiring a change to this specification.

### Workstream 3 Planning Dashboard

| Phase | Status |
|---|---|
| Discovery | ✅ Complete |
| Validation | ✅ Complete |
| Architecture | ✅ Complete |
| Governance | ✅ Complete |
| Implementation Planning | ✅ Complete |
| Implementation | ✅ Complete for Phase 0–2 (WP-4 and WP-5, R1.2-024) — Phase 3/4 Not Started, deferred |

This dashboard tracks the WS3 governance/planning chain (Arjun's Product Analysis; Sophie's UX/Traveller Experience Validation; Rad's Knowledge Base Synchronisation Audit and Source Comparison & Runtime Trace Analysis; Archie's Governance Architecture and `ADR-R1.2-WS3-001`; and Rad's Implementation Planning, `docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`). It is distinct from the Section 6.3 task table below, whose `R1.2-03.01`–`03.15` statuses remain Proposed — none of that specific task-table work has started as of this update. Actual implementation has since begun via a separate native-ID track; see the Workstream 3 Implementation Phase Dashboard below.

### WS3 Implementation Readiness

- [x] ADR Accepted
- [x] Governance Complete
- [x] Implementation Plan Approved
- [x] Technical Investigation Complete
- [x] Architecture Complete
- [x] Ready to commence implementation

This is a status checklist reflecting the completed governance/planning chain above, not an implementation checklist — it does not itself track or imply progress on any Section 6.3 task.

**Workstream 3 narrative:** governance for Destination Intelligence is complete and implementation is now under way. Phase 0 (Governance Foundations) closed out the repository's ownership and cross-reference housekeeping against the Accepted ADR; the ADR's Outstanding Decision 1 was then closed by appointing Rad as Destination Operational Steward, which unblocked the Operational Layer; and Phase 1B (Operational Layer Alignment) has since resolved the Assam structural misalignment specifically, closing five long-open Review Register items. Amritsar, Darjeeling and Corbett were deliberately left open rather than resolved in the same pass — see the Deferred Items Register below. Phase 2 (Generation & Vocabulary Alignment) has begun: **WP-4 (KB → Operational Reconciliation) is now complete** — implemented under `R1.2-WS3-IMP-01A-EBC-RAD` against the Warn Mode operating model ratified by `DEC-R1.2-015`; a pre-existing workbook cached-formula-value and Assam-reference-cell inconsistency was found and remediated under `R1.2-WS3-IMP-01B-EBC-RAD`; Rad's engineering validation and Keerthi's independent functional validation (`R1.2-WS3-IMP-01C-EBC-KEERTHI`, **Passed**, all 6 acceptance criteria met) both confirm WP-4 behaves as specified, with the only script failures encountered proven pre-existing and unrelated, now tracked as `OBS-R1.2-007`/`008`/`009` (Section 13). **WP-5 (Controlled Vocabulary Synchronisation) is now also complete**: implemented under `R1.2-WS3-IMP-02-EBC-RAD` (generated `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` from the operational layer via a new `generateLabelMappings.ts`/`labelMappingSource.ts` pair, replacing three hand-authored constant tables in `release1Candidates.ts` with generator-sourced equivalents; handled `TRAVELLER_BY_LABEL` in a governance-compliant way that reports, rather than resolves, the still-open OD-4 vocabulary-scope gap; produced comparison and reachability reporting, 0 comparison findings, Emotion 58.8%/Theme 44.4%/TravellerType 100% reachable); confirmed committed and pushed as `6c15cfe973a99315e962e9670577081171fe1f9f`, on top of WP-4's `a183e18`. Rad's engineering validation (12 of 15 verification scripts pass; the 3 that fail reproduce byte-identically, unrelated) and Keerthi's independent functional validation (`R1.2-WS3-IMP-02A-EBC-KEERTHI`, **Passed**, all 14 acceptance criteria met, independently re-executed rather than accepted from Rad's report) both confirm WP-5 behaves as specified with zero regression to the six destination/candidate runtime artefacts. **This completes Phase 2 (Generation & Vocabulary Alignment) and, with it, Workstream 3's Phase 0–2 native-ID implementation chain — closed under R1.2-024.** Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) were not started and remain explicitly deferred, per R1.2-024's own scope; so does Open Decision OD-4. Detailed implementation notes live in each phase's own report (Section 5's Implementation Milestones); this narrative is not repeating them.

### Workstream 3 Implementation Phase Dashboard

| Phase | Status |
|---|---|
| Phase 0 — Governance Foundations | ✅ Complete |
| Destination Operational Steward Appointment | ✅ Complete |
| Phase 1B — Operational Layer Alignment | ✅ Complete for Assam specifically — not Amritsar, Darjeeling or Corbett (see Deferred Items Register) |
| Phase 2 — Generation & Vocabulary Alignment | ✅ Complete — WP-4 (KB → Operational Reconciliation) ✅ Complete; WP-5 (Controlled Vocabulary Synchronisation) ✅ Complete (R1.2-024) |
| Phase 3 — Runtime Alignment | Not started — deferred, no status change (R1.2-024 Out of Scope) |
| Phase 4 — Recommendation Behaviour | Not started — deferred, no status change (R1.2-024 Out of Scope) |
| Phase 5 — Validation, QA & Documentation | Not started (Work Package 9, Content Readiness Support, may run in parallel from Phase 1 onward per the approved plan) |

This dashboard tracks WS3's native-ID implementation track (below) and is distinct from both the Planning Dashboard above and the Section 6.3 task table, whose `R1.2-03.01`–`03.15` statuses remain Proposed, consistent with the ID-collision handling established at `R1.2-015`/`018`.

### Workstream 3 Implementation Milestones

| Commit | EBC | Milestone | Purpose |
|---|---|---|---|
| `9e38d00` | `R1.2-03.07-EBC-RAD` | Phase 0 — Governance Foundations | Added governing-architecture cross-references and ownership notes to `DESTINATION-KNOWLEDGE-BASE.md` §15.1 and `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §13, and governance-boundary header comments to 5 generation-pipeline code files, all pointing to `ADR-R1.2-WS3-001` as the single place ownership is now governed. Documentation/comments only — no logic changed. |
| `749e421` | `R1.2-019` / `R1.2-03.08A-EBC-ARCHIE` | Destination Operational Steward Appointment | Closed the ADR's Outstanding Decision 1; appointed Rad as Destination Operational Steward (`DEC-R1.2-014`), unblocking Operational Layer edits. |
| `7022917` | `R1.2-03.08B-EBC-RAD` | Phase 1B — Operational Layer Alignment | Resolved the Assam structural misalignment in the operational workbook (2 rows relocated/renamed under a single canonical `india-assam` destination), closing 5 Review Register items (`review-0135`, `0206`, `0285`, `0286`, `0291`). `Journey Base Status` deliberately left unchanged on both rows, so `web/generated/*.json` and recommendation eligibility are unaffected — the workbook and the generated runtime artefacts are intentionally out of sync until a future, separately-scoped Phase 2 generation run. |
| `a183e18` | `R1.2-WS3-IMP-01A-EBC-RAD` | Phase 2 WP-4 — Implementation | Implemented the KB → Operational Reconciliation Check (additive-only generator enhancement) against the Warn Mode operating model ratified by `DEC-R1.2-015`. No file other than the generation pipeline's own scripts (`index.ts`, `writeGenerationReport.ts`, plus new `kbApprovedPortfolio.ts`, `validateKbReconciliation.ts`) was touched; `generateJourneyDNA.ts`'s inclusion filter, the engine, the adapter, the operational workbook and every controlled-vocabulary type were left unmodified, per this EBC's explicit Out of Scope list. Discovered and escalated one pre-existing, unrelated repository regression (the stale workbook cached-formula-value issue) rather than working around it silently — see the next row. Committed under `a183e18` ("R1.2-023: Complete WS3 Phase 2 WP-4 implementation and validation," authored directly by Vivek, confirmed pushed). |
| `a183e18` | `R1.2-WS3-IMP-01B-EBC-RAD` | Phase 2 WP-4 — Workbook Consistency Remediation | Remediated the canonical workbook (`outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx`): restored cached formula values (LibreOffice headless recalculation) and corrected 6 static Assam-reference cells (2 Compatibility Matrix, 4 Review Register), exhaustively diff-verified as the only changes across all 8 sheets. Regenerated all 8 runtime artefacts against the remediated workbook (determinism-verified, 2 executions identical). Also constitutes Rad's Engineering Validation for WP-4 — 12 of 15 verification scripts pass cleanly; the 3 that fail are proven, not merely asserted, pre-existing and unrelated (now `OBS-R1.2-007`/`008`/`009`, Section 13). Committed under `a183e18`. |
| `a183e18` | `R1.2-WS3-IMP-01C-EBC-KEERTHI` | Phase 2 WP-4 — Functional Validation | Keerthi independently re-ran the generator (including one fully clean end-to-end execution isolating a device-bridge-only cleanup limitation) and 5 adjacent `verify:journey-*` scripts, rather than relying on Rad's reports alone. **Result: Passed.** All 6 acceptance criteria met (Warn Mode behaves as approved; reconciliation never blocks generation; the reconciliation section and Promotion Review Checklist are always present; existing functionality and all 8 runtime artefacts are intact; no regressions). The only failures reproduced are the same two pre-existing, already-logged issues Rad identified, byte-identical and unchanged — see `OBS-R1.2-008`/`009`. Filed into the repository under this consolidation (`R1.2-023`); previously existed only as Claude Project knowledge. Committed under `a183e18`. |
| `6c15cfe` | `R1.2-WS3-IMP-02-EBC-RAD` | Phase 2 WP-5 — Implementation | Implemented Controlled Vocabulary Synchronisation: new `generateLabelMappings.ts`/`labelMappingSource.ts` generate `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`/`TRAVELLER_BY_LABEL` from the operational layer at generation time, replacing the three hand-authored constant tables previously declared in `release1Candidates.ts` (8 files modified: generator pipeline types/metadata/artefacts/index/report-writer, intelligence `index.ts`/`types.ts`, `release1Candidates.ts`, plus `JOURNEY-INTELLIGENCE-GENERATOR.md`). Comparison report: 0 findings (today's tables match the operational layer exactly). Reachability report: Emotion 58.8% (10/17), Theme 44.4% (16/36), TravellerType 100% (5/5 runtime; KB approves 9 — the gap is reported, not resolved, per Open Decision OD-4). Direct regression proof: the six destination/candidate runtime artefacts are byte-identical before/after; only `metadata.json`/`intelligence-manifest.json` changed (to carry the new `labelMappings` object). Engineering validation: 12 of 15 verification scripts pass; the 3 that fail reproduce the same pre-existing, unrelated issues byte-identically (`OBS-R1.2-007`/`008`/`009`). Committed and pushed under `6c15cfe973a99315e962e9670577081171fe1f9f` ("R1.2-024: Complete WS3 Phase 2 WP-5 generator label mapping alignment") on top of `a183e18` — independently confirmed via `git rev-parse HEAD` == `git rev-parse origin/feature/ebcr1.2-003-trust-strip-visual-refresh`. |
| `6c15cfe` | `R1.2-WS3-IMP-02A-EBC-KEERTHI` | Phase 2 WP-5 — Functional Validation | Keerthi independently re-executed the generator (in-place run reproducing the same pre-existing device-bridge FUSE cleanup limitation as WP-4, plus a fully clean isolated run with no failure) and the full adjacent `verify:journey-*` suite, cross-checking generated mapping values byte-for-byte against the removed hand-authored constants and the runtime-ID unions against the live `engine.types.ts` (exact match, no drift). **Result: Passed.** All 14 acceptance criteria met — generator execution, label-mapping generation, comparison and reachability reporting, metadata/manifest generation, governance-compliant `TRAVELLER_BY_LABEL` handling (OD-4 correctly left unresolved), no manual mapping regression, runtime artefacts and candidate counts unchanged, deterministic output, no unexpected runtime behaviour. Zero functional findings; all regression findings are the same pre-existing, already-registered observations reproduced byte-identically. Filed into the repository under this consolidation (`R1.2-024`); previously existed only as Claude Project knowledge. |

**Validation status:** Rad Engineering Validation — **Completed** for both WP-4 (`R1.2-WS3-IMP-01B-EBC-RAD`) and WP-5 (`R1.2-WS3-IMP-02-EBC-RAD`). Keerthi Functional Validation — **Passed** for both WP-4 (`R1.2-WS3-IMP-01C-EBC-KEERTHI`, 6/6 acceptance criteria) and WP-5 (`R1.2-WS3-IMP-02A-EBC-KEERTHI`, 14/14 acceptance criteria). Governance basis: `DEC-R1.2-015` (Warn Mode First, ratified 19 August 2026), applied to both WP-4 and WP-5. Registered observations: `OBS-R1.2-007`/`008`/`009` (Section 13) — none block this consolidation. This closes Phase 2 (Generation & Vocabulary Alignment) in full.

### Workstream 3 Deferred Items Register

Follow-up items surfaced during Phase 1B, explicitly **not** completed and not to be read as part of the "✅ Complete" status above:

| Item | Status | Notes |
|---|---|---|
| Amritsar operational review | Deferred | Still 3 `Attraction` records with `Journey Base Status: No`; unlike Assam, no pre-existing Review Register item recommends a structural change. Needs Arjun/Tiger to confirm whether this is a deliberate business call or an inherited seed-workbook gap before any restructuring is attempted. |
| Darjeeling operational authoring | Deferred | Zero operational-layer rows despite a fully-authored KB record (§10.11). Requires authoring a new ~122-column operational record — content creation, not structural relabeling — recommended as a dedicated, appropriately-scoped follow-up with Arjun's/Sophie's input on narrative quality. |
| Corbett operational authoring | Deferred | Same as Darjeeling; the workbook's own `review-0292` already names this as an open "Potential addition." |
| Runtime regeneration | Resolved | Sequenced deliberately as part of Phase 2 WP-4, as this register anticipated: `web/generated/*.json` has been regenerated against the remediated workbook (checksum `868271e5...`), determinism-verified, and independently confirmed correct by both Rad (`R1.2-WS3-IMP-01B`) and Keerthi (`R1.2-WS3-IMP-01C`). Committed and pushed under `a183e18`, confirmed via `git rev-parse HEAD`/`git rev-parse origin/...` — no longer uncommitted. |
| Review Register "Resolved" status documentation | Deferred | Phase 1B introduced `Resolved` as a new status value in the workbook's Review Register (previously only `Open` was used). Recommend this becomes the documented convention for future review closures. |

**R1.2-024 deferred-items confirmation (no status change made to any of the following):** Amritsar operational review, Darjeeling operational authoring, and Corbett operational authoring above remain exactly as recorded — untouched by WP-5 or by this consolidation. `OBS-R1.2-007` (shared generated-artefact ownership), `OBS-R1.2-008` (Goa/mountain-intent steering defect) and `OBS-R1.2-009` (`verify:journey-engine` `moodValues` fixture) — registered in Section 13 — remain open, cross-referenced above without duplication or resolution. Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour), per the Implementation Phase Dashboard above, remain Not Started. Open Decision OD-4 (Traveller Type vocabulary scope, `EBC-R1.2-03.05` §12) remains unresolved. None of these items were investigated, resolved, or reprioritised by R1.2-024, per its explicit Out of Scope and Deferred Items sections.

### Workstream 3 — Destination Search Performance & Reliability (Closed)

**Scope note:** this sub-thread is entirely independent of the Destination Intelligence Model narrative above (native-ID chain, Phase 0–5, Section 6.3 weighted-preference tasks). It is a database-function engineering investigation into `public.search_geo_places()` — the PostgreSQL function underlying destination search — filed under Workstream 3's document series (`R1.2-WS3-IMP-*`, `ARCHIE-R1.2-WS3-AR-*`, `EBC-R1.2-WS3-QA-01`) because that is where the investigation was opened and tracked throughout. It shares no code, data model, or task-table item with the Destination Intelligence Model track and its closure has no effect on that track's status (recorded above).

**Closed under:** `EBC-R1.2-WS3-TIGER-01` (Workstream 3 Closure & Release 1.2 Tracker Synchronisation), this consolidation.

**Background and root cause.** The investigation began from a `search_geo_places()` performance issue and progressed through nine architecture reviews (`ARCHIE-R1.2-WS3-AR-03` through `AR-11`) and five engineering reports (`R1.2-WS3-IMP-09` through `IMP-13`). Root cause, confirmed by `AR-07` through `AR-10` and accepted by `AR-11`: the function was declared `LANGUAGE SQL`, which PostgreSQL plans once with an opaque parameter placeholder, producing a single fixed generic execution plan regardless of the actual search term's selectivity — not an indexing or dataset defect. `IMP-13` resolved this by rewriting the function to `LANGUAGE PLPGSQL`, executing the query via dynamic SQL (`EXECUTE`, built with `format()`, `%L` for safely-quoted literals and `%s` only for the already-typed-integer `LIMIT` value), which forces PostgreSQL to plan fresh against the real parameter on every call. All existing business behaviour (matching, ranking, fallback) was preserved unchanged.

**Architecture review (`AR-03`–`AR-11`).** Final Decision: **Approved with Observations**. `AR-11` independently verified the dynamic-planning rewrite against the root cause identified in `AR-07`–`AR-10`, confirmed no architectural regression, and recommended progression to QA.

**Quality assurance (`EBC-R1.2-WS3-QA-01`, v2 FINAL).** Final Decision: **Passed with Observations**. Keerthi's validation covered code audit, runtime validation, representative regression comparison, and operational verification; no release-blocking defects were found. Observations were explicitly classified separately from defects and carried forward to Release 1.3 (below) rather than expanding this closure's scope.

**Benchmark results** (`EXPLAIN ANALYZE, BUFFERS`, before → after the dynamic-planning rewrite):

| Search term | Latency before | Latency after | Buffers before | Buffers after |
|---|---|---|---|---|
| Kotagiri | ~3722 ms | 736 ms | ~14,315 | 2,342 |
| Goa | ~3673 ms | 1649 ms | ~14,315 | 3,894 |
| Bangalore | ~4029 ms | 1332 ms | ~14,707 | 5,466 |

**Sub-thread status:** `IMP-13` — Closed. `AR-11` — Closed. `QA-01` — Closed. **Workstream 3 Destination Search Performance & Reliability sub-thread — Closure Complete.**

**Documentation governance (verified by this closure).** The agreed evidence structure is `docs/09-Development/Release-1.2/WS3/`. Verified against the actual repository:

| Artefact | Location found | Action taken |
|---|---|---|
| `IMP-11`, `IMP-12`, `IMP-13` | `docs/09-Development/Release-1.2/WS3/` | Already correctly placed. No action. |
| `IMP-10` | Found at `docs/30-Engineering/Release-1.2/WS3/` — outside the agreed structure. `IMP-11`'s own report had already flagged this exact relocation as deferred to this closure card. | **Relocated** to `docs/09-Development/Release-1.2/WS3/` by this closure (file moved only, no content changed); the cross-reference inside `IMP-11` recording the deferral was updated in place to record the relocation. |
| `ADR-R1.2-WS3-001` | `docs/20-Architecture/` | Correct location for an ADR (architecture decision records are filed under `20-Architecture`, not the workstream evidence subfolder). No action. |
| `ARCHIE-R1.2-WS3-AR-03` through `AR-11`, `EBC-R1.2-WS3-QA-01` (and its Interim/FINAL/Addendum variants) | **Not present anywhere in the repository.** These exist only as Claude Project records. | **Flagged, not resolved by this closure** — committing this evidence to the repository (or making an explicit governance decision that Claude-Project-only storage is acceptable for this evidence class) is recommended as a separate, small Tiger/Rad action before Release 1.2 is formally closed, per this card's own instruction that outstanding structural items be resolved "before Release 1.2 is formally closed," not necessarily before WS3 itself closes. |
| `R1.2-WS3-IMP-01` through `IMP-02A` (the earlier Phase 2 WP-4/WP-5 native-ID reports, `R1.2-023`/`R1.2-024`) | `docs/09-Development/` directly, not under `Release-1.2/WS3/` | **Flagged as a separate, lower-priority housekeeping item**, unrelated to this card's Background (which concerns only the search-performance investigation). Not relocated by this closure — doing so was outside this card's explicit Scope and risked disturbing the already-verified, committed native-ID chain's own cross-references for no governance benefit. |

**Cross-workstream inconsistency (flagged, not resolved — see Project Instructions §17).** This sub-thread's own evidence (`AR-11`, `QA-01`) demonstrates `search_geo_places()` running against live, populated data with real benchmark results (place names, aliases, and populations resolving correctly). Workstream 6's currently-recorded "Known Limitations" and "Operational Release Gate" text states the `geo_places`/`geo_aliases` migration is "not yet applied" and GeoNames data "not imported," and that "100% of destination searches in any currently available environment resolve to the search unavailable graceful-fallback state" (most recently reaffirmed by Sri, `EBC-R1.2-WS6-12`). These two positions cannot both be true of the same environment as currently written, and this card's own constraint ("Modify only the Workstream 3 section — no other workstream shall be edited") prohibits resolving this within Workstream 6's section here. **Recommendation:** a dedicated, WS6-scoped Tiger governance card should reconcile which environment(s) each finding actually describes (e.g., a QA/architecture-review environment with the migration applied and seed data loaded, versus the shared development/staging environment Sri and Keerthi tested against for Workstream 6) and correct whichever record is stale, before Release 1.2 is formally closed. This is recorded here as a Risk (see the closure deliverable) rather than silently left unreconciled.

**Release 1.3 carry-forward observations.** Two observations were classified during QA as outside this closure's scope and are carried forward as Release 1.3 candidates. Neither has yet been added to `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (confirmed by inspection — no existing entry); per this card's explicit instruction, that file is not edited by this closure, so the two items are recorded here for cross-reference and should be transcribed into `RELEASE-1.3-BACKLOG.md` by a future Tiger backlog update:

| ID | Title | Description | Priority |
|---|---|---|---|
| `OBS-R1.3-WS3-01` | Destination Ranking Refinement | Bengaluru/Chennai and similar globally-ambiguous or administrative-name searches surface ranking behaviour QA flagged as an observation, not a defect. Investigate ranking refinement in Release 1.3 while preserving the function's existing global search capability. | Release 1.3 |
| `OBS-R1.3-WS3-02` | Country-Level Search Behaviour | A search for "India" returns textual place-name matches before the country-level result itself. Root cause not confirmed — possibly a ranking factor, possibly dataset-completeness. Investigate during Release 1.3. | Release 1.3 |

**Lessons learned (recorded verbatim, per this closure card):**

1. Architectural investigations should isolate one hypothesis at a time and validate with measurable evidence.
2. Database performance optimisation should distinguish planner behaviour from indexing behaviour before introducing structural changes.
3. Independent Architecture and QA reviews significantly improve confidence in production readiness.
4. Observations should be clearly separated from release-blocking defects to avoid unnecessary scope expansion.
5. Evidence-driven governance provides stronger release confidence than assumption-driven optimisation.

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
| Status | 🟢 Engineering Complete – Pending Functional QA (Principal Entity **Approved**; PE–TM Chain **Approved and Activated**; Sender Header **SMVTRV Verified**; DLT Template **Validated**; live end-to-end OTP send/verify **confirmed** by the Product Owner, 27-Aug-2026 — see `EBC-R1.2-WS5-GOV-07-TIGER-Journey-Passport-OTP-Completion-Governance-Synchronization-and-Release-Readiness-Update`) |
| Progress | **Completed:** engineering implementation prepared on `feature/ebc-r1.2-ws5-03-otp-verification` (commit `77d3a91`); reviewed for production-configuration readiness (`EBC-R1.2-WS5-04A`, `-04B`); ten-task engineering review closed, Approved (`EBC-R1.2-WS5-REV1-01`–`10`, `GOV-01`–`06`); external DLT/MSG91 chain completed — Principal Entity approved, PE–TM Chain approved and activated, Sender Header `SMVTRV` verified, DLT Template validated; two Supabase RPC defects found during production integration testing (`IMP-02` — ambiguous `resend_count` in `send_journey_passport_otp`; `IMP-03` — ambiguous `verification_token` in `verify_journey_passport_otp`) were fixed via additive migrations and deployed; **a live, end-to-end OTP send → SMS received on a physical handset → verification → Journey Passport completion → Journey Director transition was confirmed successfully by the Product Owner on 27-Aug-2026**. **Pending:** removal of temporary `[SMV-DBG]` diagnostics, a final build/diff review (Rad), Keerthi's full functional QA pass, resolution of the OTP-expiry wording mismatch (Section below), and Product Acceptance. OTP feature and MSG91 integration are **engineering-complete and operationally validated by the Product Owner's own live test; formal functional QA and product acceptance remain outstanding** — see Engineering Readiness below |
| Engineering Readiness | Per `EBC-R1.2-WS5-04A`/`04B` and confirmed by `EBC-R1.2-WS5-05-RAD`'s production integration investigation: production enablement of the OTP send/verify flow was configuration-driven, as anticipated, once two issues were resolved. First, `SMS_PROVIDER_TEMPLATE_ID` carried a one-character transcription error (a stray hyphen) that caused MSG91 to reject every application-originated send with `400 — Template ID Missing or Invalid Template`; corrected. Second, two Supabase RPCs (`send_journey_passport_otp`, `verify_journey_passport_otp`) each contained a PL/pgSQL ambiguous-column defect (`RETURNING ... INTO` referencing a bare identifier that collided with a `RETURNS TABLE` output column) — invisible to nine tasks of static/read-only engineering review because it only manifests on live execution against a real Postgres instance; both fixed via additive `CREATE OR REPLACE FUNCTION` migrations (`IMP-02`, `IMP-03`) and deployed. The previously open question of whether MSG91's SendOTP v5 API requires an explicit Principal Entity parameter is now resolved in practice: the Product Owner's confirmed live send succeeded using the existing request shape (no PE parameter), closing that question without a code change. `EBC-R1.2-WS5-04B`'s non-blocking `JOURNEY_PASSPORT_OTP_RATE_LIMIT_*` finding remains unchanged and deferred to Release 1.3 (`TD-R1.3-007`). **Governance note:** `EBC-R1.2-WS5-04A`/`04B`/`05` and `IMP-02`/`IMP-03` are recorded in Team Satvi's governance record but have not yet been committed to this repository's `docs/09-Development/` folder — until they are, they exist as project-level governance record only, not as canonical repository documentation |
| Dependencies | Touches Journey Passport (coordinate with Workstream 4 regression), Contact, Callback Request, Plan My Experience. OTP verification specifically depends on the country-aware phone capture and E.164 normalization (R1.2-05.01–05.17) being complete, since the OTP is sent to the validated number |
| Owner | Archie (data format / storage approach, OTP provider evaluation and verification architecture), Sophie (country selector and OTP entry UX), Rad (implementation), Keerthi (regression and OTP QA strategy) |
| Risks | Existing stored phone numbers (Release 1.0/1.1 leads) are in a 10-digit India-only format — resolved via the dual-field strategy (`DEC-R1.2-019`) rather than an in-place migration; incomplete audit of "future forms" could leave a capture point non-compliant; introducing OTP verification adds a dependency on a third-party delivery provider — see RISK-R1.2-010; the traveller-facing SMS template text promises a 10-minute OTP validity while the application's own expiry is configured at 5 minutes — a genuine mismatch identified during production testing (`EBC-R1.2-WS5-05-RAD` §6), not yet resolved, requiring a Product Owner decision (shorten the DLT-approved template text, or raise `JOURNEY_PASSPORT_OTP_EXPIRY_SECONDS` to 600) before production release. *Retired, no longer valid:* the Principal Entity approval risk, the DLT registration-fee/payment-window risk, the Sender Header/Template approval-pending risks, and the MSG91-Principal-Entity-parameter open question previously recorded here — all resolved per the Progress row above |
| Next Action | Rad: remove `[SMV-DBG]` diagnostics, confirm production-safe logging, run a final build verification and diff review. Keerthi: execute the full Journey Passport OTP functional QA pass (send, verify, incorrect OTP, expired OTP, resend, duplicate prevention, Passport completion, Journey Director transition, Passport stamp validation). Product Owner: decide the OTP-expiry wording resolution before production release. See the Resume Checklist below for the full sequence |
| Acceptance Criteria | Every phone-capture location audited; country selector (with search, flags, calling codes, India default) implemented; country-aware validation replaces hardcoded 10-digit assumption; invalid combinations handled gracefully; pasted/free-form numbers normalized into canonical E.164 format; numbers stored in E.164 format (e.g. `+919876543210`); existing flows regression tested; Journey Passport cannot be submitted without successful OTP verification; OTP verification applies only to Journey Passport; existing Callback Request flow remains unchanged; existing Contact flow remains unchanged |

Tasks: R1.2-05.01 through R1.2-05.35 (Section 6.5).

**Architecture note (Archie must confirm before implementation):** changing the stored phone number format is a data-model-adjacent change and requires Archie's assessment per Project Instructions Section 5 before Rad begins implementation, specifically regarding backward compatibility with existing Supabase lead records. OTP verification architecture — provider selection, verification-state management, secret handling and backend implications (R1.2-05.19) — likewise requires Archie's assessment and explicit approval before any OTP implementation task (R1.2-05.21 onward) begins. Selecting an OTP provider and implementing OTP verification are both explicitly out of scope for this planning update (R1.2-002); they require a separate, future implementation EBC. **Status: satisfied** — Archie's assessment is `EBC-R1.2-WS5-01` (Approved); the separate implementation EBC is `EBC-R1.2-WS5-03`, prepared in the repository per the Progress row above and pending production validation.

**Product guardrail (Tiger):** OTP verification is a lead-quality control applied at the point of Journey Passport submission — it is not an authentication, login or account-management feature. Implementation must preserve the existing low-friction Journey Passport experience, introducing verification only immediately before final submission rather than earlier in the flow. Future EBCs must not expand OTP into a broader identity or login system without a separate, explicitly approved decision.

### Workstream 5 — DLT Registration Milestone Log

| Date | Milestone | Detail |
|---|---|---|
| 23-Aug-2026 | Principal Entity registration request submitted | Submitted via Jio TrueConnect (`trueconnect.jio.com`); Registration Request Number **96220832** |
| 23-Aug-2026 | Confirmation email received | From `support.truconnect@jio.com` to `vivek@searchmyvacation.com`, confirming receipt of the Principal Entity registration request under Request Number 96220832; a further confirmation will follow on completion of registration |
| 23-Aug-2026 | Letter of Authority executed and submitted | Executed at Chennai, authorising Mr. Vivek T Renganathan (Partner) as Authorised Representative to act on behalf of SearchMyVacation before telecom operators, DLT platforms, Jio TrueConnect and MSG91 for Principal Entity registration, Sender ID/Header management, DLT Chain Binding, Content Template registration and related telecom-resource activities. Document held outside the repository per `EBC-R1.2-WS5-04`'s evidence-handling instruction — referenced here, not committed |
| 24-Aug-2026 | Principal Entity approved | DLT registration complete. Confirmed by the Product Owner during this session (`EBC-R1.2-WS5-05`). Registration Request Number 96220832 |
| 24-Aug-2026 | DLT subscription payment completed | Confirmed by the Product Owner during this session. Operational account activated, pending the remaining approvals below |
| 24-Aug-2026 | Sender Header submitted | Sender Header **SMVTRV** submitted; Current Status: Submitted; Approval: **Pending Jio Review**. Confirmed by the Product Owner during this session — this also closes the verification gap `EBC-R1.2-WS5-04B` flagged (it could not corroborate "SMVTRV" from repository evidence alone) |
| 27-Aug-2026 | PE–TM Chain approved and activated | Principal Entity–Telemarketer chain (`ADR-R1.2-WS5-001`, `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §2 steps 5–6) completed. Confirmed by the Product Owner |
| 27-Aug-2026 | Sender Header verified | Sender Header **SMVTRV** — status advances from Pending Jio Review to **Verified**. Confirmed by the Product Owner |
| 27-Aug-2026 | DLT Template validated | MSG91 template `Search_My_Vacation_OTP` (internal template ID `6a8ed5442eb953fe9d0ea2e4`, DLT registration `1277178766919479769`) confirmed **Verified by DLT** and correctly linked to Sender ID `SMVTRV` (`EBC-R1.2-WS5-05-RAD` §5) |
| 27-Aug-2026 | Live MSG91 credentials configured; `SMS_PROVIDER_TEMPLATE_ID` transcription error corrected | A stray hyphen in the configured template ID (`6a8ed5442e-b953fe9d0ea2e4` vs. the correct `6a8ed5442eb953fe9d0ea2e4`) was causing every application-originated send to fail with MSG91 `400 — Template ID Missing or Invalid Template` (`EBC-R1.2-WS5-05-RAD` §3, §10). Corrected by the Product Owner |
| 27-Aug-2026 | End-to-end production verification confirmed | Product Owner confirmed a real OTP send → SMS delivered to a physical handset → correct-OTP verification → Journey Passport completion → Journey Director transition, with no remaining runtime errors in the flow. This is the first confirmed application-originated (not MSG91-dashboard-test-tool) successful send-to-verification cycle |

### Workstream 5 — Resume Checklist (remaining production activities)

1. ✅ Verify Principal Entity approval — done, 24-Aug-2026 (Ref. No. 96220832).
2. ✅ Complete DLT payment/activation (if applicable) — done, 24-Aug-2026.
3. ✅ Configure live MSG91 credentials — done, 27-Aug-2026 (includes correcting the `SMS_PROVIDER_TEMPLATE_ID` transcription error).
4. ✅ Register Sender Header(s) — `SMVTRV`, Verified.
5. ✅ Register SMS Templates — `Search_My_Vacation_OTP`, Verified by DLT.
6. ✅ Complete DLT Chain Binding (PE–TM Chain) — approved and activated, 27-Aug-2026.
7. ✅ Execute live OTP testing — confirmed successfully by the Product Owner, 27-Aug-2026 (send, SMS delivery, verification, Journey Passport completion, Journey Director transition).
8. Execute Keerthi QA — **pending** (full functional QA pass per `EBC-R1.2-WS5-GOV-07-TIGER-...`'s Activity list: OTP send, OTP verify, incorrect OTP, expired OTP, resend, duplicate prevention, Passport completion, Journey Director transition, Passport stamp validation).
9. Update Release documentation — in progress (this update, `EBC-R1.2-WS5-GOV-07-TIGER-Journey-Passport-OTP-Completion-Governance-Synchronization-and-Release-Readiness-Update`).
10. Close Workstream 5 — pending Keerthi's functional QA and Product Acceptance.

Steps 1–7 are now complete. Step 8 (Keerthi's functional QA) is the sole remaining gate before Workstream 5 can close — it is independent of engineering completion and must be executed and recorded per Project Instructions §29 (Functional Validation Standard) rather than inferred from the Product Owner's own confirmatory test, which — while a genuine, evidence-based signal — is not a substitute for Keerthi's structured, reproducible QA pass.

### Workstream 5 — Governance Note (Tiger)

Release Governance distinguishes between three separate things for Workstream 5: **repository implementation** (prepared, per the Progress row above; per `EBC-R1.2-WS5-04A`/`04B`, expected to be configuration-driven with one open production-validation item, not an engineering defect), **production readiness** (pending — MSG91 integration and the OTP feature are not complete until production SMS functionality is operational and validated), and **external dependency completion** (**Principal Entity approved and DLT subscription payment completed** as of 24-Aug-2026; **Sender Header `SMVTRV` submitted, Pending Jio Review**; Template creation and approval still to come). Engineering work remains partially blocked by the remaining external DLT dependency; functional QA and end-to-end OTP validation will begin only after Sender Header approval, Template approval, and live SMS delivery become available. Release 1.2 execution continues with subsequent workstreams in the meantime. Workstream 5 shall remain in the Release Tracker as **🟡 Partially Implemented – Waiting for External DLT Dependency** and shall not be marked Complete until production SMS functionality and end-to-end validation have been successfully completed.

### Workstream 5 — Engineering Review 1 Governance Note (Tasks 1–3)

Review 1 of the WS5 Engineering Review — Task 1 (Understand the Flow), Task 2 (Identify All Components), Task 3 (Validate Journey Passport Entry); `EBC-R1.2-WS5-REV1-01/02/03-RAD` — is **complete**. **No blockers were identified** (Task 3's severity assessment found zero Blocker-severity findings across all nine activities in its scope). Three Minor Observations were **accepted** (`OBS-3-01`, `OBS-3-02`, `OBS-3-03` — closure-screen name re-validation consistency, duplicated mobile-normalisation logic, and a generic message for a specific coded OTP-send failure). Two engineering technical debt items were **deferred to Release 1.3** (`TD-R1.3-001`/`OBS-3-04` — Journey Passport component modularisation; `TD-R1.3-002`/`OBS-3-05` — automated regression coverage for the OTP module and entry-stage validators), per `DEC-R1.2-020` above and the full Engineering Observation Register and Technical Debt Register in `EBC-R1.2-WS5-GOV-01-TIGER-Engineering-Review-Governance-Synchronization` and `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9. **Production readiness is unaffected** by these findings — they concern engineering maintainability and test coverage, not the DLT external-dependency gate this Governance Note above governs. **Workstream 5's Release 1.2 completion status is unchanged by this review** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Task 5.16/5.21–5.30/5.32–5.35 "Ready for QA" statuses recorded in the Section 6.5 task table are likewise unchanged. Remaining engineering review activities (Task 4 onward) may proceed against this same baseline without re-litigating Tasks 1–3.

### Workstream 5 — Engineering Review 1 Governance Update (OBS-4-01 Closed)

Review 1 Task 4 (Validate Mobile Number Processing, `EBC-R1.2-WS5-REV1-04-RAD`) identified `OBS-4-01`, a **Blocker**: `POST /leads` consumed the OTP verification token using the bare-digit mobile-number field instead of the E.164 field the challenge table is exclusively keyed on, causing every legitimate, correctly-verified Journey Passport submission to fail unconditionally once MSG91 became operational — masked until now only by MSG91 being unconfigured. A dedicated, narrowly-scoped implementation EBC (`EBC-R1.2-WS5-IMP-01-RAD`) was created and completed: a single-line fix in `web/app/api/journey-passport/leads/route.ts` (`parsed.value.mobileNumber` → `parsed.value.mobileE164`), with root cause traced, `tsc`/`eslint`/`npm run verify:journey-leads` all passing, and regression impact assessed as confined to the one call site (confirmed the only caller of `consumeVerificationToken` in the repository). **This implementation has been independently reviewed by Tiger** (`EBC-R1.2-WS5-GOV-02-TIGER-Close-OBS-4-01-Governance-Synchronization`) and **the blocker is closed**, per `DEC-R1.2-021` below. **Review 1 may now continue with Task 5 (Validate OTP Generation).** Two related observations Task 4 also raised — `OBS-4-02` (Major: no bare-digit/India pre-gate on the OTP send/verify endpoints if called directly, bypassing the UI) and `OBS-4-03` (Minor: ambiguous `mobileNumber` field naming across two modules, a root-cause factor behind OBS-4-01) — **remain open and are not reclassified or actioned by this update**; they are retained for future disposition, per the full register in `EBC-R1.2-WS5-GOV-02-TIGER-Close-OBS-4-01-Governance-Synchronization`. **Workstream 5's Release 1.2 completion status is unchanged** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Section 6.5 task table is not modified by this update.

### Workstream 5 — Engineering Review 1 Governance Update (Task 5 Complete)

Review 1 Task 5 (Validate OTP Generation, `EBC-R1.2-WS5-REV1-05-RAD`) is **complete**, with a result of Pass with Observations (0 Blocker; 1 Major; 3 Minor). **No production blockers were identified** — OTP code generation (`crypto.randomInt`, CSPRNG), salted SHA-256 hash storage, database-generated challenge IDs, server-side expiry bounds, and in-place resend handling were all independently reviewed and **accepted as functionally correct**. One architectural hardening recommendation is **deferred to Release 1.3**: `OBS-5-01` (Major) found that OTP-specific rate limiting is configured (`JOURNEY_PASSPORT_OTP_RATE_LIMIT_WINDOW_SECONDS`/`_MAX`) but never wired to enforcement, leaving OTP send/verify protected only by the shared, in-memory, IP-only `journey-leads` rate limiter — with no per-mobile-number dimension, contrary to `EBC-R1.2-WS5-01` §6.5's architecture requirement — captured as `TD-R1.3-007` in `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9. Three Minor Observations were **accepted**: `OBS-5-02` (MSG91 `sender`/`template_id` co-occurrence unconfirmed against live provider behaviour), `OBS-5-03` (OTP crypto utilities located in `repository.ts` rather than `service.ts` or a dedicated module), and `OBS-5-04` (a low-likelihood, low-impact concurrent-first-request race on `send_journey_passport_otp`, with no correctness break since verification is keyed by `challenge_id`). Full detail is recorded in the consolidated Engineering Observation Register in `EBC-R1.2-WS5-GOV-03-TIGER-Task5-Governance-Synchronization`, per `DEC-R1.2-022` below. **Engineering review is cleared to proceed with Task 6.** **Workstream 5's Release 1.2 completion status is unchanged** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Section 6.5 task table is not modified by this update.

### Workstream 5 — Engineering Review 1 Governance Update (Task 6 Complete)

Review 1 Task 6 (Validate OTP Verification, `EBC-R1.2-WS5-REV1-06-RAD`) is **complete**, with a result of Pass with Observations (0 Blocker; 1 Major; 2 Minor). **No production blockers were identified** — OTP verification's challenge validation, plaintext-never-persisted hash comparison, atomic race-safe attempt handling, deterministic expiry enforcement, replay protection, and verification token issuance were all independently reviewed and **accepted as functionally correct**. One architectural hardening observation, `OBS-6-01` (Major), was raised: `send_journey_passport_otp`'s existing-challenge lookup filters on `status = 'pending'` only, so an `exhausted` or `expired` challenge is never found by a subsequent send — a fresh row is inserted instead, silently discarding the resend cap's memory once a challenge reaches a terminal state and permitting an unbounded send→exhaust→resend cycle bounded only by the shared IP rate limiter. This extends the same underlying abuse-protection gap `OBS-5-01` (Task 5) already identified and is **consolidated into the existing `TD-R1.3-007`** rather than raised as a separate backlog item. Two Minor Observations were **accepted**: `OBS-6-02` (OTP hash comparison uses plain SQL text equality rather than an explicit constant-time comparison; low practical risk given SHA-256's avalanche property and the existing attempt cap) and `OBS-6-03` (the verification token itself has no independent, time-based expiry — bounded only by single-use, not by time). Full detail is recorded in the consolidated Engineering Observation Register in `EBC-R1.2-WS5-GOV-04-TIGER-Task6-Governance-Synchronization`, per `DEC-R1.2-023` below. **Engineering review is cleared to proceed with Task 7 (Validate Lead Creation).** **Workstream 5's Release 1.2 completion status is unchanged** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Section 6.5 task table is not modified by this update.

### Workstream 5 — Engineering Review 1 Governance Update (Tasks 7 & 8 Complete)

Review 1 Task 7 (Validate Lead Creation, `EBC-R1.2-WS5-REV1-07-RAD`) and Task 8 (Validate Journey Director Integration, `EBC-R1.2-WS5-REV1-08-RAD`) are both **complete**. Task 7 returned Pass with Observation (0 Blocker; 1 Major; 0 Minor); Task 8 returned Pass with Observations (0 Blocker; 1 Major; 1 Minor). **No production blockers were identified in either task** — lead creation was confirmed to enforce a single-use, correctly-consumed verification token before any write, to persist a complete and internally-consistent Journey Passport record, and to prevent duplicate leads through defense-in-depth (single-use token consumption plus a schema-enforced upsert); Journey Director integration was confirmed to trigger only after a lead is durably persisted, to receive the exact data object that was stored with no re-derivation drift, to be unable to corrupt or duplicate the already-created lead under any traced failure mode, and to sit behind a clean, correctly-directed architectural boundary. One Major observation from each task was accepted: `OBS-7-01` (a traveller who has already verified OTP successfully can, on a narrow post-verification submission failure, be funnelled by the interface's own most obvious action into a closed retry loop with no working recovery path) and `OBS-8-02` (the Journey Director recommendation-engine failure path's only diagnostic log is gated to non-production, so this failure mode is currently invisible in production) — **`OBS-8-02` is captured as `TD-R1.3-008`** in `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §9. One Minor observation, `OBS-8-01` (a narrow handoff-persistence window can show a traveller a more confusing recovery message than intended if the recommendation engine fails and the page is then reloaded), is recorded as a UX improvement note rather than engineering technical debt, per `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §10. Full detail is recorded in the consolidated Engineering Observation Register in `EBC-R1.2-WS5-GOV-05-TIGER-Tasks7-8-Governance-Synchronization`, per `DEC-R1.2-024` below. **Engineering review is cleared to proceed with Task 9 (Validate Failure Scenarios).** **Workstream 5's Release 1.2 completion status is unchanged** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Section 6.5 task table is not modified by this update.

### Workstream 5 — Engineering Review 1 Closure (Tasks 9 & 10 Complete)

Review 1 Task 9 (Validate Failure Scenarios & Recovery, `EBC-R1.2-WS5-REV1-09-RAD`) and Task 10 (Overall Engineering Assessment & Production Readiness, `EBC-R1.2-WS5-REV1-10-RAD`) are both **complete**, and with them **WS5 Engineering Review 1 is formally closed.** Task 9 found no data-integrity, orphaned-record, or replay risk across any traced failure scenario — every state-changing operation is atomic and the RPC layer explicitly supports safe idempotent retry — and raised two new Major observations: `OBS-9-01` (all three OTP/lead API routes discard the causal error object in a bare `catch {}`, in every environment, leaving production failures effectively undiagnosable) and `OBS-9-02` (a lost response to the very first OTP send can leave the traveller on the code-entry screen with no usable challenge ID, with the one working recovery control — "Change number" — not surfaced at the point of failure). Task 10 independently reviewed the complete body of evidence from all nine prior tasks and issued the review's final verdict: **Engineering Review 1 is approved**, no Blocker exists across the full 25-item Observation Register (the review's only Blocker, `OBS-4-01`, remains resolved and unregressed, independently re-verified three separate times), and the implementation is engineered to a standard suitable for Release 1.2 production once the already-identified external DLT/MSG91 operational dependencies are met. `OBS-9-01` is consolidated into the existing `TD-R1.3-008` (retitled "Improve WS5 Production Observability"), alongside its original `OBS-8-02` scope; `OBS-9-02` is recorded as a UX improvement ("OTP Response Recovery," owned by Sophie/Rad) in `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` §10, the same pattern already established for `OBS-7-01`/`OBS-8-01`; and, per Task 10's own recommendation, `OBS-4-02` (previously open with no backlog representation) now has its own entry, `TD-R1.3-009`. Full detail is recorded in the consolidated Engineering Observation Register in `EBC-R1.2-WS5-GOV-06-TIGER-Engineering-Review1-Closure-and-Governance-Synchronization`, per `DEC-R1.2-025` below.

**Engineering Review 1 — Final Status.**

| | |
|---|---|
| Status | **Closed** |
| Result | **Approved** |
| Tasks completed | 10 of 10 |
| Blockers identified | 1 (`OBS-4-01`) |
| Blockers resolved | 1 |
| Remaining blockers | 0 |
| Recommendation | Proceed to Keerthi (Functional QA), Operational Enablement, Production Smoke Testing (gated on DLT/MSG91), Sri (Traveller Validation), and Product Acceptance |

**Engineering is complete; operational enablement remains dependent on external DLT/MSG91 approvals** — this closure does not assert live production readiness, only that no further engineering work is required before Release 1.2's remaining engineering-independent activities (functional QA, operational enablement, traveller validation, and eventual production smoke testing) can proceed. **Workstream 5's Release 1.2 completion status is unchanged** — it remains **🟡 Partially Implemented – Waiting for External DLT Dependency**, per the Governance Note above; the Section 6.5 task table is not modified by this update.

### Workstream 5 — Engineering Complete, Pending Functional QA (GOV-07)

Following Engineering Review 1's closure, production integration testing of the deployed OTP feature surfaced and resolved the remaining gap between "engineering complete" and "operationally working end-to-end." `EBC-R1.2-WS5-05-RAD`'s investigation found the application's `SMS_PROVIDER_TEMPLATE_ID` contained a one-character transcription error causing every application-originated MSG91 send to fail (`400 — Template ID Missing or Invalid Template`); separately, `EBC-R1.2-WS5-IMP-02-RAD` and `EBC-R1.2-WS5-IMP-03-RAD` each independently identified and fixed a PL/pgSQL ambiguous-column defect (`RETURNING ... INTO` referencing a bare identifier colliding with a `RETURNS TABLE` output column) in `send_journey_passport_otp` and `verify_journey_passport_otp` respectively — both invisible to nine tasks of read-only engineering review because they manifest only on live execution against a real Postgres instance. Both migrations (`20260826120000`, `20260827150000`) were authored, diff-isolated to the single corrected line each, and confirmed as requiring no calling-code changes.

**Product Owner confirmation, 27-Aug-2026:** the Product Owner deployed both migrations, corrected the `SMS_PROVIDER_TEMPLATE_ID` value, and personally executed and confirmed a complete, real, end-to-end cycle: Journey Passport created → OTP challenge created in Supabase → OTP sent through MSG91 → SMS received on a physical handset → correct OTP verified → verification completed → traveller transitioned to Journey Director → no remaining runtime errors observed. This is the first confirmed application-originated (as opposed to MSG91's own manual dashboard test tool) successful send-through-verification cycle for this feature.

**This confirmation is recorded as the Product Owner's own evidence, distinct from — and not a substitute for — Rad's independent post-deployment engineering confirmation or Keerthi's structured functional QA pass**, per Project Instructions §28 ("Rad's technical completion does not equal Keerthi's functional approval... or project-owner release approval") applied in the direction relevant here: a Product Owner's own successful manual test is real, valuable evidence, but Keerthi's independent, reproducible, evidence-captured QA pass (Project Instructions §29) remains a separate, required gate before Workstream 5 can close.

**Remaining before Release 1.2 closure:**
- Engineering: remove the temporary `EBC-R1.2-WS5-DBG-01` `[SMV-DBG]` diagnostics (still present in `sms.ts`, `journey-passport-otp/repository.ts`, `otp/send/route.ts` as of this update), confirm production-safe logging, run a final build verification and diff review.
- Functional QA: Keerthi to execute the complete Journey Passport OTP validation — send, verify, incorrect OTP, expired OTP, resend, duplicate prevention, Passport completion, Journey Director transition, Passport stamp validation.
- Product Owner decision: resolve the OTP-expiry wording mismatch — the DLT-approved SMS template text promises "valid for 10 minutes" while the application's configured expiry is 5 minutes (`EBC-R1.2-WS5-05-RAD` §6) — before production release.
- Release: Product Acceptance, then Release 1.2 closure.

**Workstream 5's Release 1.2 status changes with this update** — from 🟡 Partially Implemented – Waiting for External DLT Dependency to **🟢 Engineering Complete – Pending Functional QA**, per `DEC-R1.2-026` below. This is *not* a closure of Workstream 5 — functional QA and Product Acceptance remain outstanding gates, per the Release Assessment table in `EBC-R1.2-WS5-GOV-07-TIGER-Journey-Passport-OTP-Completion-Governance-Synchronization-and-Release-Readiness-Update`. **A numbering correction for the record:** that card's Executive Summary refers to the `resend_count` fix as "IMP-01" — the repository's actual EBC numbering is `EBC-R1.2-WS5-IMP-02-RAD` for that fix; `EBC-R1.2-WS5-IMP-01-RAD` is the earlier, unrelated `OBS-4-01` fix (`mobileNumber` → `mobileE164` in `/leads`, closed under `DEC-R1.2-021`). This tracker uses the correct `IMP-02`/`IMP-03` references throughout, per Project Instructions §17's precedence for repository evidence over a card's own text where the two differ on a verifiable fact.

---

## Workstream 6 — Journey Passport Destination Autocomplete & Validation

| Field | Value |
|---|---|
| Goal | Replace the free-text destination field with a searchable, multi-select autocomplete that validates a destination is a real place — without taking over Journey Director's responsibility for served-destination validation |
| Business Value | Higher-quality destination data (fewer fictional/misspelled entries); better traveller experience when naming multiple places of interest |
| Priority | P1 (approved R1.2 workstream) |
| Status | 🟢 Ready for Product Owner Acceptance |
| Progress | Product Discovery, Delivery Planning, Architecture, UX and Engineering Readiness (`EBC-R1.2-WS6-01`/`-02`/`-03`+Addendum/`-05`+Addendum/`-06`/`-07`) are complete; Governance Consolidation (`EBC-R1.2-WS6-08` + Addendum 01, `-10`) is complete. **Engineering implementation is complete** across all 8 phases of `EBC-R1.2-WS6-09` (Rad). **Functional QA is complete** (`EBC-R1.2-WS6-11`; two defects found, both corrected and confirmed resolved by `EBC-R1.2-WS6-11A`). **Traveller Experience Validation is complete** (`EBC-R1.2-WS6-12`; ⚠️ Approved with Minor Observations, accepted by the Product Owner). Final closure consolidation recorded in `EBC-R1.2-WS6-13` (this update). No commits or pushes have been made at any point — all implementation work exists as uncommitted working-tree changes on `feature/ebc-r1.2-ws5-03-otp-verification` |
| Dependencies | Dataset investigation complete (`EBC-R1.2-WS6-03`); UX specification complete and implemented (`EBC-R1.2-WS6-05`); implementation, functional QA, and traveller validation all complete; **production deployment depends on the operational release gate below** (Supabase migration application and GeoNames import) — see Operational Release Gate; Workstream 4 regression should include the destination field; Workstream 3 mapping may reference validated destination names |
| Owner | Archie (architecture — complete), Sophie (UX — complete), Rad (implementation — complete, `EBC-R1.2-WS6-09`), Keerthi (functional QA — **complete**, `EBC-R1.2-WS6-11`/`-11A`), Sri (traveller experience validation — **complete**, `EBC-R1.2-WS6-12`, Approved with Minor Observations) |
| Risks | Free geographic datasets vary in coverage for Indian place names — mitigated by the hand-reviewed alias overrides in `web/scripts/geo-validation/importGeoNames.ts`, not yet exercised against live data (migration/import both still pending — see Operational Release Gate); must not accidentally start validating "does SMV serve it" — confirmed structurally impossible: `verifyNoGeoValidationCoupling.ts` passes with zero cross-imports between `lib/geo-validation/**` and `lib/journey-director/**`; no live-browser or screen-reader validation has been performed on the implemented combobox at any point — see Known Limitations |
| Implementation Effort | Actuals: 23 modified files + 15 new files/directories (38 total working-tree entries, zero deletions, zero commits) across `EBC-R1.2-WS6-09` Phases 1–8, consistent with the corrected 17-file/19-site `destinationMode` surface `EBC-R1.2-WS6-07` identified and `EBC-R1.2-WS6-08` recorded — the earlier 2–4 day estimate (`EBC-R1.2-WS6-02` §9) is superseded by this actual, evidence-based inventory |
| Acceptance Criteria | Existing free-text behaviour and data-quality problems documented; searchable autocomplete with multi-selection implemented, including removing an individual destination and preserving selection order; validation confirms the location is real but does **not** check SMV service coverage; free-dataset investigation complete with an explicit decision (paid APIs excluded for R1.2 unless separately approved); fuzzy matching, alternate spellings, abbreviations, landmarks, regions, cities and countries supported; edge cases (Vizag, Bangalore/Bengaluru, Madras/Chennai, Kotagiri, Coorg/Kodagu) validated; fictional locations (e.g. Wakanda, Winterfell) rejected without a jarring UX; Journey Director's unsupported-destination behaviour unchanged |

Tasks: R1.2-06.01 through R1.2-06.13 (Section 6.6). Task-level status is unchanged by this update — task statuses will be revised by Rad's implementation EBC, not by this governance consolidation.

### Workstream 6 — Implementation Assumptions (approved, carried forward from `EBC-R1.2-WS6-05`/`-06`/`-07`)

1. **Preferred Destinations** is a validated, structured, multi-select field backed by geo-validation (`geo_places`/`geo_aliases`); each selection carries a non-nullable `geoPlaceId`.
2. **Describe your ideal getaway** is an optional free-text field, entirely separate from geo-validation, that never touches the destination-validation path.
3. The free-text field's placeholder copy is **instructional only** — it is guidance text, not a default value.
4. The placeholder is **never persisted** — an unchanged placeholder must never be saved as if the traveller had typed it.
5. The placeholder is **ignored if unchanged** — submission logic must distinguish "traveller typed nothing" from "traveller typed the placeholder text."
6. Retirement of the `state.destination` / `destinationMode` ("" | "known" | "discovery") model, in favour of `destinations: SelectedDestination[]` + `getawayDescription: string`, is **approved**.

### Workstream 6 — Engineering Notes (from `EBC-R1.2-WS6-06`/`-07`)

1. `destinationMode` removal is a **multi-file change** — 19 reference sites across 17 files per `EBC-R1.2-WS6-07`'s direct repository inspection, not the two-location estimate carried in `EBC-R1.2-WS6-06`.
2. Search-outage handling must **distinguish "no results" from "search unavailable"** — a failed or unreachable search must never be presented to the traveller as "no matches," per `EBC-R1.2-WS6-06`'s `results`/`unavailable`/`idle` state design.
3. The static `destinationSuggestions` list is approved for **removal**, not deprecation.
4. Geo-validation (is this a real place) remains **architecturally separate** from Journey Director serviceability (does SMV serve this place) — the new `web/lib/geo-validation/` module carries zero cross-imports to or from `web/lib/journey-director/**`, enforced by a new guardrail script.
5. **No mandatory schema migration is required** for Release 1.2 — the existing `journey_passport_leads` schema already tolerates the new data shape via its nullable `destination_mode`/`destination_free_text` columns and catch-all `passport_summary jsonb`. An additive migration (new nullable columns) is recommended but not blocking; `destination_mode`/`destination_free_text` must be retained, not dropped, for historical-record readability.
6. **Manual accessibility validation is required** for the combobox implementation — the WAI-ARIA 1.2 combobox-with-listbox pattern has no existing precedent in this codebase (the only other structured-choice UI, `SelectionCard.tsx`, is a radiogroup/radio pattern, not combobox/listbox).

### Workstream 6 — Documentation Housekeeping (Deferred, not actioned by this update)

The following are recorded as deferred housekeeping items. Consistent with this project's "mark superseded, do not rewrite" convention, no historical document is modified to record them:

1. **`EBC-002` §8.3 wording** ("no network search dependency") should be clarified after Release 1.2 closes — `EBC-R1.2-WS6-06` found this was written against the old static `destinationSuggestions` list and is a scope-understanding gap, not a genuine conflict with the new first-party API route (`/api/journey-passport/destinations/search`).
2. **`RELEASE-1.2.md` / `RELEASE-1.2-BACKLOG.md` naming** should be standardized after Release 1.2 closes, per the deferral already recorded in `RELEASE-1.3-BACKLOG.md` §9.1.

### Workstream 6 — Product Owner Decisions (UX Review Cycle — Final)

Recorded 23-Aug-2026, per Tiger's final WS6 governance consolidation (`EBC-R1.2-WS6-08` Addendum 01). These finalise, as approved Product Owner decisions, the items the Implementation Authorization note below previously listed as pending sign-off.

1. **Destination Discovery Gate — retired.** The prior two-option routing interaction ("I already know where I want to go" / "Help me discover somewhere special") is formally retired. With Preferred Destinations and Describe your ideal getaway both now independently optional, no initial routing decision is required; the Journey Passport displays both fields together. This reduces unnecessary traveller decisions and supports the approved conversational design philosophy.
2. **Preferred Destinations — finalised.** Optional; multiple selection; validated geographic autocomplete; **maximum 5 selections**; validation confirms geographic reality only — serviceability remains Journey Director's responsibility.
3. **Describe your ideal getaway — finalised.** Optional; free text; **maximum 500 characters**; placeholder copy is instructional only, never persisted, and ignored unless the traveller edits it.
4. **Search Unavailable Behaviour — approved.** A destination-search failure is treated independently from a genuine no-match result. If search is temporarily unavailable, the traveller receives a graceful message encouraging them to continue completing the Journey Passport. The Passport must never become blocked by temporary search unavailability.
5. **Placeholder Examples — approved.** Static placeholder examples only; no rotating placeholder text. The final placeholder uses a curated subset of approximately four inspirational examples (drawn from the candidate set in `EBC-R1.2-WS6-05-ADDENDUM-01`); the remaining approved examples stay available for future UX refinement.

### Workstream 6 — Implementation Authorization (Tiger)

Product Discovery is complete and approved (`EBC-R1.2-WS6-01`). Architecture is complete and approved (`EBC-R1.2-WS6-03` + Addendum 01, `EBC-R1.2-WS6-06`). UX is complete and approved (`EBC-R1.2-WS6-05` + Addendum 01), and the Product Owner's final UX-review-cycle decisions above have now resolved every item previously open. Engineering Readiness is complete (`EBC-R1.2-WS6-07`, verdict: ready to proceed to Rad's implementation EBC). **Workstream 6 was authorized to proceed into engineering implementation**, subject only to the implementation EBC explicitly carrying forward the corrected 17-file/19-site `destinationMode` inventory into its task breakdown and effort estimate. Full detail is recorded in `EBC-R1.2-WS6-08` and its Addendum 01. **Implementation is now complete** — see the subsections below, recorded per `EBC-R1.2-WS6-10` (Post-Implementation Governance Consolidation & QA Readiness).

### Workstream 6 — Engineering Implementation (`EBC-R1.2-WS6-09`, Phases 1–8, complete)

Rad delivered the full destination-search and getaway-description capability across 8 stop-and-approve phases, entirely as uncommitted working-tree changes on `feature/ebc-r1.2-ws5-03-otp-verification` (no commits, no pushes, no branch change at any point): Phase 1 Foundation (geo-validation module, search API, coupling guardrail); Phase 2 Preferred Destinations (combobox component); Phase 3 Describe Your Ideal Getaway (free-text field); Phase 4 Journey Passport Integration (full `destinationMode` retirement, end-to-end wiring); Phase 5 Search Failure Handling (timeout/retry architecture); Phase 6 Cleanup (swept for retired artifacts — none remained to remove); Phase 7 Accessibility & Interaction Validation (three corrections applied); Phase 8 Final Verification & Handover (full regression re-run, this documentation handover). Final footprint: 23 modified files, 15 new files/directories, 0 deletions, 0 commits.

### Workstream 6 — Final Product Decisions (as implemented)

**Destination Discovery Gate.** The previous destination choice gate ("I already know where I want to go" / "Help me discover somewhere special") has been retired in the implementation. The Journey Passport now presents Preferred Destinations (Optional) and Describe your ideal getaway (Optional) together, with no routing decision beforehand — confirmed built in `EBC-R1.2-WS6-09` Phase 4 (`DestinationMoment` fully rewritten) and swept for leftover gate artifacts in Phase 6 (none found).

**Preferred Destinations.** Implemented as: maximum 5 selections (enforced in `lib/geo-validation/selection.ts`'s `addSelection()`); validated autocomplete against the geo-validation search API; deduplication (a re-selected place is a no-op, surfaced to the traveller as a pulse on the existing chip rather than a duplicate entry); selection order preserved on add and on individual removal.

**Describe your ideal getaway.** Implemented as: optional; 500-character limit (`GETAWAY_DESCRIPTION_MAX_LENGTH` in `lib/journey-passport/getaway-description.ts`, with a defence-in-depth clamp); placeholder ignored unless edited (`isGetawayDescriptionEmpty()` distinguishes an untouched field from genuine content); static placeholder (no rotation — see below).

**Placeholder Copy — finalised, 24-Aug-2026.** The Product Owner has approved the final Release 1.2 placeholder, closing the item this tracker previously carried as open. Approved copy:

> An island that feels forgotten by time • Mountains that vanish into morning cloud • Snow settling quietly over lantern-lit streets • A place where the sea meets the mountains

Approved decisions, recorded as final: static placeholder approved; no rotating placeholder; placeholder is instructional only; placeholder is never persisted; placeholder is ignored unless edited by the traveller. `PLACEHOLDER_TEXT` in `GetawayDescriptionField.tsx` should be updated to this approved copy as a one-line implementation change (the field's data model, character limit, and ignore-unless-edited behaviour are unaffected). This item no longer appears under Known Limitations or open questions.

### Workstream 6 — Accessibility Decisions (as implemented)

Corrected in `EBC-R1.2-WS6-09` Phase 7, against `EBC-R1.2-WS6-05` §§3–9 and the WAI-ARIA 1.2 combobox pattern: chip remove-button touch target enlarged to the codebase's standard **44×44** CSS-pixel convention (`min-h-11 min-w-11`, previously 20×20); the suggestion **popup now closes on focus loss** (an `onBlur` handler added, per the WAI-ARIA APG requirement that a combobox popup close when the combobox no longer has focus); **mobile textarea sizing** corrected so `GetawayDescriptionField` renders 3 rows / `min-h-24` on mobile and the original 4 rows / `min-h-28` from the `sm:` breakpoint up, matching §5.3/§9's mobile-vs-desktop specification. All ARIA wiring (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"`/`"option"`, `aria-live="polite"`) was already correct from Phase 2 and required no correction. **Manual browser accessibility validation is deferred to QA** — no live-browser or screen-reader pass was possible in this implementation environment (see Known Limitations); every correction above was derived from static code review against the WAI-ARIA APG, not from live assistive-technology testing.

### Workstream 6 — Search Behaviour (as implemented)

"No results" and "search unavailable" are implemented as **distinct states** (`DestinationSearchStatus`: `idle` / `loading` / `results` / `unavailable`), never conflated — a genuine empty-results array is a different state from a failed request, per `EBC-R1.2-WS6-06`'s design. On search unavailability: **one silent automatic retry** is attempted (invisible to the traveller — both the original attempt and the retry report `loading`); on the retry's failure the state becomes `unavailable` with a **graceful fallback message** encouraging the traveller to describe the destination in the free-text field instead; and the **traveller is never blocked** — both destination fields are independently optional and moment validation is unconditional, so a search outage cannot prevent Journey Passport completion.

### Workstream 6 — Timeout Strategy (as implemented)

| Layer | Behaviour | Location |
|---|---|---|
| Client — request bound | 3000 ms | `web/hooks/useDestinationSearch.ts` (`REQUEST_TIMEOUT_MS`) |
| Client — retry delay | 400 ms | `web/hooks/useDestinationSearch.ts` (`RETRY_DELAY_MS`), one silent retry |
| Server — Supabase REST call | 4000 ms | `web/lib/geo-validation/repository.ts` |
| Database — query execution | 2000 ms | `supabase/migrations/20260823150000_geo_places_geo_aliases.sql` (`search_geo_places` function's `statement_timeout`; **migration not yet applied** — see Known Limitations) |

Ordering is deliberately tightest-to-loosest from database to client (2000 → 3000 → 4000 ms) so the database always gives up first and no layer is left waiting on one that has already abandoned the request.

### Workstream 6 — Engineering Outcomes

- **`destinationMode` fully retired** from Journey Passport state. One nuance recorded for accuracy: a differently-scoped, coincidentally-named `destinationMode` field remains on an internal Journey Director engine diagnostic/trace type (`engine.types.ts`), populated from the resolved intent for trace-output purposes only — this is not the retired Passport-state field and was confirmed, by reading every call site, to be legitimate, unrelated, in-use code, not a leftover artifact. Ten remaining textual occurrences of "destinationMode" in the codebase are explanatory code comments describing the migration for future maintainers, deliberately left in place.
- **`destinationSuggestions` (the static list) removed**, not deprecated, confirmed by a dedicated Phase 6 sweep.
- **No compatibility layer introduced** — the Product Owner's explicit condition ("no compatibility shims or duplicate fields") was honoured; the migration is a faithful, behaviour-preserving replacement, not a dual-path shim.
- **`DestinationIntent` contract preserved** — the `{mode, rawText}` shape Journey Director's scoring/eligibility/contradiction logic consumes is byte-for-byte unchanged; only what feeds it (`deriveDestinationRawText()`) was added.
- **Geo-validation remains isolated** — `verifyNoGeoValidationCoupling.ts` (the structural guardrail built in Phase 1) passes with 46 checks and zero cross-imports between `lib/geo-validation/**` and `lib/journey-director/**`, self-caught and corrected once mid-implementation (Phase 4) when a first-pass wiring attempt briefly violated it.

### Workstream 6 — Known Limitations (not implementation defects — outside Workstream 6 implementation scope)

1. **Migration not yet applied.** `supabase/migrations/20260823150000_geo_places_geo_aliases.sql` (the `geo_places`/`geo_aliases` schema and `search_geo_places` function) has not been run against any Supabase environment. Destination search cannot function end-to-end until it is applied.
2. **GeoNames not imported.** The import script is written and compiles cleanly but has not been executed — outbound access to `download.geonames.org` returned `403` from both available environments' egress proxy.
3. **Browser accessibility still requires manual QA.** No live-browser or screen-reader validation was possible in this implementation environment across any of the 8 phases (the dev server does not persist between separate device-bridge shell calls); all accessibility corrections were derived from static review. A manual keyboard-and-screen-reader pass remains required before release.
4. **Three pre-existing verification failures, unrelated to Workstream 6.** Confirmed pre-existing against pristine baseline `HEAD` (`77d3a91`) via an isolated `git worktree` diagnostic: `verify:journey-engine` ("escape resolves to its editable mood preselection"), `verify:journey-intelligence:steering` ("mountain intent keeps Goa eligible for scoring rather than hard-excluding it"), and `verify:journey-intelligence` (generated-artifact count check). None were introduced by, or touch code paths belonging to, this workstream.

These four are explicitly **outside Workstream 6 implementation scope** and do not represent unfinished WS6 work. One smaller handover item is also carried forward, not hidden: a diagnostic `git worktree` at `/tmp/smv-baseline-check` (used only to confirm item 4 above) could not be removed by this session (no delete permission) and should be cleaned up separately — it is outside the tracked repository and affects nothing. (The placeholder-copy selection previously listed here as open has been finalised — see Final Product Decisions above.)

### Workstream 6 — QA Readiness (superseded — see Workstream Closure below)

*This section recorded, at the time of `EBC-R1.2-WS6-10`, that engineering implementation was complete and that functional QA and traveller validation were still required. Both have since been performed and are recorded below; this note is left in place rather than deleted, per this project's practice of not silently rewriting a prior status.* `EBC-R1.2-WS6-09` Phase 8's report supplied the QA checklist Keerthi used as a starting point for `EBC-R1.2-WS6-11`.

### Workstream 6 — Traveller Validation Status

Sri completed independent Traveller Experience Validation (`EBC-R1.2-WS6-12`), reviewing the implemented Journey Passport destination experience live, end-to-end, against a real running instance of the current code. **Outcome: ⚠️ Approved with Minor Observations.** The Product Owner has accepted this overall traveller recommendation. Confirmed strengths: the retirement of the destination discovery gate (Continue is enabled with both fields empty — no forced self-declaration of uncertainty); the search-unavailable copy and tone; and the getaway-description placeholder copy, each recorded by Sri as a Delight to retain as-is. Two findings from this validation are carried into the sections below rather than left inline: the carried-forward-destination observation (Accepted Release 1.2 Design Limitation, below) and live confirmation that the destination-search infrastructure gap is a deployment prerequisite, not a design defect (Operational Release Gate, below).

### Workstream 6 — Accepted Release 1.2 Design Limitation: Carried-Forward Destination

Sri's validation (`EBC-R1.2-WS6-12` §5, Major observation) confirmed live that a destination carried forward from an entry route (e.g., a traveller arriving via a Goa destination page) lands as plain text inside the Describe your ideal getaway field, directly beneath a connective line that frames that field as being for "a feeling than a place yet." **This is an intentional Release 1.2 simplification, not a defect.** Sophie's full `EBC-R1.2-WS6-05` §4.4 design — a lighter-treatment, async-resolved "pending suggestion chip" inside Preferred Destinations itself, with inline "Keep"/"Not quite" actions — was deliberately deferred during Phase 4 of `EBC-R1.2-WS6-09`'s implementation and remains recorded above as a named Release 1.3 candidate (Deferred Items / Release 1.3 Cross-Reference, item 1). The Product Owner has accepted this behaviour as-is for Release 1.2. **No Release 1.2 behaviour is being changed as a result of this observation.**

### Workstream 6 — Operational Release Gate (Deployment Prerequisite, Not a Workstream 6 Defect)

Destination autocomplete requires two operational actions before it can function against real data in any environment: (1) applying the `geo_places`/`geo_aliases` Supabase migration (`supabase/migrations/20260823150000_geo_places_geo_aliases.sql`), and (2) importing the GeoNames dataset (`web/scripts/geo-validation/importGeoNames.ts`). Both were confirmed still outstanding by every validation cycle in this workstream, most recently live-confirmed by Sri (`EBC-R1.2-WS6-12`): with neither yet in place, 100% of destination searches in any currently available environment resolve to the "search unavailable" graceful-fallback state. **This is recorded explicitly as an operational deployment prerequisite. It is not an engineering defect. It is not a Product or UX issue.** The interaction design, copy, and failure-handling for this exact condition are already approved and correctly implemented — what is missing is data and infrastructure enablement, not product or engineering work. **Production deployment of Workstream 6 shall not proceed until this operational enablement is complete.**

### Workstream 6 — Workstream Closure

All lifecycle stages for Workstream 6 are complete: **Product Discovery** (`EBC-R1.2-WS6-01`); **Architecture** (`EBC-R1.2-WS6-03` + Addendum 01, `-06`); **UX** (`EBC-R1.2-WS6-05` + Addendum 01); **Engineering** (`EBC-R1.2-WS6-09`, Phases 1–8); **Governance** (`EBC-R1.2-WS6-08` + Addendum 01, `-10`, `-13`); **Functional QA** (`EBC-R1.2-WS6-11` — initially ❌ Fail on two defects [DEF-01 Major: retired-gate wording still rendering; DEF-02 Minor: ISO country codes shown instead of names] — both corrected by Rad and confirmed resolved by `EBC-R1.2-WS6-11A`; QA is complete and approved); **Traveller Validation** (`EBC-R1.2-WS6-12` — ⚠️ Approved with Minor Observations, accepted by the Product Owner).

**Workstream 6 is now: Ready for Product Owner Acceptance.**

The remaining items are explicitly not blockers to that transition, each already classified above: the Operational Release Gate (migration application and GeoNames import); the Accepted Release 1.2 Design Limitation (carried-forward destination); and the Blocked/Not-Tested live-environment items already named in Known Limitations (manual accessibility pass, the five India-specific edge cases, live mobile/keyboard validation) — each is an accepted limitation or an operational prerequisite, not open governance work.

### Workstream 6 — Deferred Items / Release 1.3 Cross-Reference

No new Release 1.3 candidate emerged **during** implementation. Three Journey Passport UX refinements were already known and deliberately deferred before implementation began (each named explicitly, not referenced collectively) and were confirmed still deferred as of `EBC-R1.2-WS6-09` Phase 7:

1. **Pending-chip experience for carried-forward destinations.** Sophie's `EBC-R1.2-WS6-05` §4.4 designs a lighter-treatment "pending suggestion chip" with inline "Keep"/"Not quite" actions for a destination carried forward from an earlier page (e.g. from the homepage). The implementation instead lands a carried-forward destination as plain free text in Describe your ideal getaway (a documented Phase 4 simplification) — the full async-resolved pending-chip design was never built.
2. **Auto-growing textarea for Describe your ideal getaway.** `EBC-R1.2-WS6-05` §5.3 recommends the field's textarea expand with typed content (to roughly 8 rows before scrolling) rather than stay fixed-height. Not built — the field ships with a fixed row count (Phase 3, adjusted for mobile in Phase 7).
3. **Near-limit character counter for Describe your ideal getaway.** `EBC-R1.2-WS6-05` §5.3 recommends a character counter that appears only once the traveller is within roughly 20% of the 500-character limit. Not built — the field enforces the limit silently, with no visible counter at any point.

None of these three is named as an explicit candidate item in `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (checked, not edited, by this update) — **recommended for Tiger to add to a future Release 1.3 Backlog update**, not actioned in this consolidation. The already-recorded `EBC-002` §8.3 documentation-housekeeping item remains unchanged and still deferred to after Release 1.2 closes.

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
| R1.2-05.12 | Implement country-aware phone validation | P1 | In Progress | Rad | 05.06 | |
| R1.2-05.13 | Remove hardcoded 10-digit assumption | P1 | Proposed | Rad | 05.12 | |
| R1.2-05.14 | Handle invalid country/number combinations | P1 | Proposed | Rad | 05.12 | |
| R1.2-05.15 | Store phone numbers in E.164 format | P1 | Ready for QA | Archie / Rad | 05.12–05.14 | Requires Archie's data-model assessment; consider existing lead-record compatibility |
| R1.2-05.16 | Regression test existing phone-dependent flows | P1 | Ready for QA | Keerthi | 05.01–05.15 | Lead capture, callback, notification emails |
| R1.2-05.17 | Normalize pasted phone numbers into canonical E.164 format while preserving valid user input | P1 | Ready for QA | Rad | 05.12–05.15 | Support formats such as `+91 98765 43210`, `+91-9876543210`, `98765-43210`, `9876543210` |
| R1.2-05.18 | Evaluate OTP providers | P1 | Complete | Archie | 05.17 | Compare provider options, delivery reliability, India coverage, international capability, expected operating cost. Evaluation only — no provider is selected under R1.2-002 |
| R1.2-05.19 | Architecture review for OTP verification | P1 | Complete | Archie | 05.18 | Document provider selection, verification architecture, secret management, verification state, backend implications. Requires Archie approval |
| R1.2-05.20 | Define Journey Passport OTP flow | P1 | Complete | Arjun / Sophie | 05.19 | Phone Number → Send OTP → Enter OTP → Verify → Journey Passport Submission. Flow definition only |
| R1.2-05.21 | Implement Send OTP interaction | P1 | Ready for QA | Rad | 05.20 | |
| R1.2-05.22 | Implement OTP entry screen | P1 | Ready for QA | Sophie / Rad | 05.20 | |
| R1.2-05.23 | Implement OTP verification | P1 | Ready for QA | Rad | 05.21, 05.22 | |
| R1.2-05.24 | OTP expiry handling | P1 | Ready for QA | Rad | 05.23 | |
| R1.2-05.25 | Resend OTP rules | P1 | Ready for QA | Rad | 05.21 | Include cooldown and resend limits |
| R1.2-05.26 | Invalid OTP handling | P1 | Ready for QA | Rad | 05.23 | Include retry limits, expired OTP, incorrect OTP |
| R1.2-05.27 | Mask mobile number on verification screen | P2 | Ready for QA | Sophie / Rad | 05.22 | |
| R1.2-05.28 | Changing phone number invalidates previous verification | P1 | Ready for QA | Rad | 05.23 | |
| R1.2-05.29 | Prevent Journey Passport submission until verification succeeds | P1 | Ready for QA | Rad | 05.23 | Core guardrail behind DEC-R1.2-006. Governed by EBC-R1.2-WS5-01 (Architecture — Approved 22-Aug-2026), EBC-R1.2-WS5-02 (UX — Approved 22-Aug-2026), EBC-R1.2-WS5-03 (Implementation Brief — Approved 22-Aug-2026). The three Product Owner decisions this chain previously depended on are now Approved (`DEC-R1.2-016` SMS provider, `DEC-R1.2-017` `libphonenumber-js`, `DEC-R1.2-018` legacy `+91` backfill, all 22-Aug-2026) |
| R1.2-05.30 | OTP abuse protection | P1 | Ready for QA | Archie / Rad | 05.19, 05.25 | Include rate limiting, spam prevention, repeated OTP protection |
| R1.2-05.31 | Development and QA strategy for OTP | P1 | Proposed | Keerthi / Rad | 05.19 | Support test numbers, sandbox verification, non-production validation |
| R1.2-05.32 | Regression testing — India phone numbers | P1 | Ready for QA | Keerthi | 05.21–05.30 | |
| R1.2-05.33 | Regression testing — international phone numbers | P1 | Ready for QA | Keerthi | 05.21–05.30 | |
| R1.2-05.34 | Journey Passport resume behaviour — verified state handling | P1 | Ready for QA | Keerthi | 05.23 | |
| R1.2-05.35 | Production OTP smoke test | P1 | Ready for QA | Keerthi | 05.31–05.34 | Post-deployment |

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
| DEC-R1.2-014 | 18-Aug-2026 | **Destination Operational Steward assigned: Rad.** Closes `ADR-R1.2-WS3-001`'s Outstanding Decision 1 — the Operational Layer (seed/operational workbook) had no assigned owner, blocking `R1.2-03.08` Phase 1's WP-1.2/1.3/1.4. Rad is appointed Destination Operational Steward for Release 1.2, with ownership and change authority over the Operational Layer artefact as defined in the ADR (Sections 8, 9, 12). | `R1.2-03.08` Phase 1 implementation surfaced and escalated this gap per Project Instructions Section 35 rather than editing the workbook without assigned authority; resolving it was the single most consequential open item the governance architecture identified (ADR §15, Decision 1). | ADR updated (Artefact Ownership Matrix, Outstanding Product Decisions, new Governance Roles subsection 8.1, Decision History) under `R1.2-03.08A-EBC-ARCHIE`. Unblocks a future, separately-scoped `R1.2-03.08` Phase 1b to complete WP-1.2/1.3/1.4. Does not change any architectural principle, layer boundary or source-of-truth assignment. | Approved |
| DEC-R1.2-015 | 19-Aug-2026 | **Warn Mode First ratified for Release 1.2 Phase 2.** Closes `ADR-R1.2-WS3-001`'s Outstanding Decision 2 (Warn Mode vs. Block Mode) — the ADR already recommended Warn Mode and Phase 2 planning already assumed it, but no formal governance decision had recorded that recommendation as approved. Warn Mode is now the ratified operating model for all reconciliation and validation activities introduced under Release 1.2 Phase 2 (WP-4/WP-5): findings are reported but do not block generator execution. Block Mode is not approved for Release 1.2 Phase 2. | Archie's Architecture & Governance Compliance Review of the Phase 2 implementation EBC identified the gap between the ADR's recommendation and a formally ratified decision; closing it removes governance ambiguity before WP-4 begins, at zero architectural or runtime risk. | ADR updated (Outstanding Product Decisions §15 Decision 2, Decision History §17) under `DEC-R1.2-015` (`docs/09-Development/DEC-R1.2-015-Ratification-Warn-Mode-First.md`). Unblocks unambiguous commencement of WP-4. Does not change any architectural principle, layer boundary, source-of-truth assignment, generator logic, or runtime behaviour. | Approved |
| DEC-R1.2-016 | 22-Aug-2026 | **SMS Provider Selection.** MSG91 is approved as the SMS provider for Release 1.2 Journey Passport OTP verification. Implementation Constraint: the implementation must abstract the SMS provider behind an internal service interface so future providers may be introduced without changing Journey Passport business logic. | India-first customer base; competitive OTP pricing; mature API; DLT compliant; suitable for current business scale (per `EBC-R1.2-WS5-01` §4.3 provider evaluation) | Workstream 5 OTP-send implementation (R1.2-05.18–05.21) unblocked to proceed with MSG91 behind the required abstraction interface; India DLT template registration should begin immediately given its multi-day lead time (`EBC-R1.2-WS5-01` §11) — see `EBC-R1.2-WS5-03` §3. Approved by Product Owner (Vivek) and Delivery Lead (Tiger). | Approved |
| DEC-R1.2-017 | 22-Aug-2026 | **International Phone Number Validation.** `libphonenumber-js` is approved as the standard international phone number validation library for Release 1.2. | Industry-standard library; supports E.164; avoids custom validation logic; lower maintenance cost; supports future international expansion (per `EBC-R1.2-WS5-01` §3 evaluation) | Workstream 5 E.164 validation work (R1.2-05.12–05.17) unblocked to add `libphonenumber-js` as a new runtime dependency, per Project Instructions §21 — see `EBC-R1.2-WS5-03` §3. Approved by Product Owner (Vivek) and Delivery Lead (Tiger). | Approved |
| DEC-R1.2-018 | 22-Aug-2026 | **Historical Journey Passport Phone Migration.** Existing Journey Passport phone numbers shall be migrated by prepending `+91` only where the stored value does not already begin with "+". Migration Requirements: existing "+" values remain unchanged; migration must be idempotent; new Journey Passport submissions must always use international format. | Every existing `mobile_normalized` value is a bare 10-digit Indian number with no country code, since the application has only ever accepted India — a mechanical, low-risk inference over live records, not a new business judgement (per `EBC-R1.2-WS5-01` §3) | Workstream 5 E.164 migration (R1.2-05.15) unblocked to execute this backfill, timed to that implementation step, not run speculatively ahead of it — see `EBC-R1.2-WS5-03` §3. Approved by Product Owner (Vivek) and Delivery Lead (Tiger). **Superseded by `DEC-R1.2-019`** — retained here, not deleted, per this log's superseding convention; see `EBC-R1.2-WS5-03` §13.1 for the implementation-time finding that required the change. | Superseded |
| DEC-R1.2-019 | 22-Aug-2026 | **Dual-Field Mobile Number Strategy for Journey Passport (supersedes `DEC-R1.2-018`).** The existing `mobile_number`/`mobile_normalized` columns and the Callback Request RPC contract keep their original bare-national-number format, completely unchanged. A new, independent `mobile_e164` column (additive migration `20260822090500_journey_passport_leads_e164_backfill.sql`) carries the E.164 form used for OTP verification and SMS delivery. Historical rows are intentionally left with `mobile_e164 = null`; a backfill of historical rows is a separate, explicit follow-up decision, not executed under this EBC. | Implementing the originally-approved in-place `+91` backfill (`DEC-R1.2-018`) was found, empirically via `npm run verify:journey-leads`, to silently break the already-shipped Callback Request feature (EBC-013): `claim_journey_passport_callback`'s strict equality match against `mobile_normalized` fails once that column carries a country code, since Callback Request was correctly left out of OTP/E.164 scope and still submits a bare national number | Workstream 5 OTP implementation (`EBC-R1.2-WS5-03` §13.1) proceeded on this corrected basis; no automatic production migration of `mobile_number`/`mobile_normalized` was performed for Release 1.2. Recorded retroactively to close the gap between the Product Owner's implementation-time approval and a formal Decision Log entry, consistent with the `DEC-R1.2-014`/`DEC-R1.2-015` precedent. A future, separate decision is still required before any historical-row `mobile_e164` backfill runs. Approved by Product Owner (Vivek) and Delivery Lead (Tiger). | Approved |
| DEC-R1.2-020 | 25-Aug-2026 | **Proceed with WS5 Engineering Review without implementing accepted technical debt items now.** Following Review 1 (Tasks 1–3) of the WS5 Engineering Review (`EBC-R1.2-WS5-REV1-01/02/03-RAD`), five engineering observations were raised (`OBS-3-01`–`OBS-3-05`). The Product Owner and Delivery Lead approve proceeding with the remaining engineering review activities (Task 4 onward) without implementing any of the five now; each is captured as a Release 1.3 technical debt item instead. | The five observations affect engineering maintainability, testability and diagnostic quality, not current production readiness or functional correctness — Task 3's own severity assessment found zero Blocker-severity findings and confirmed every reviewed behaviour passed against the approved baseline. | Technical debt items `TD-R1.3-001`–`TD-R1.3-005` added to `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (new "Engineering Technical Debt" section, §9). Workstream 5's Release 1.2 completion status is unchanged — see the Workstream 5 Engineering Review governance note below. No engineering implementation performed under this decision. Recorded in full in `EBC-R1.2-WS5-GOV-01-TIGER-Engineering-Review-Governance-Synchronization`. | Approved |
| DEC-R1.2-021 | 25-Aug-2026 | **Proceed with the remaining WS5 Engineering Review after successful implementation and independent verification of OBS-4-01.** Review 1 Task 4 (`EBC-R1.2-WS5-REV1-04-RAD`) identified `OBS-4-01`, a Blocker: `POST /leads` consumed the OTP verification token using the bare-digit mobile field instead of the E.164 field the OTP challenge table is exclusively keyed on, causing every legitimate submission to fail once MSG91 is configured. `EBC-R1.2-WS5-IMP-01-RAD` implemented and verified the single-line fix (`leads/route.ts`: `parsed.value.mobileNumber` → `parsed.value.mobileE164`). | The only functional blocker identified during Review 1 has been resolved and independently verified. Remaining observations (`OBS-4-02`, `OBS-4-03`) do not prevent continuation of the engineering review. | `OBS-4-01` closed. Review 1 resumed. Remaining observations (`OBS-4-02` Major, `OBS-4-03` Minor) retained for future disposition, not reclassified. Recorded in full in `EBC-R1.2-WS5-GOV-02-TIGER-Close-OBS-4-01-Governance-Synchronization`. No engineering implementation performed under this decision (the fix was performed and verified under `EBC-R1.2-WS5-IMP-01-RAD`, a separate, already-completed EBC; this decision ratifies proceeding with governance/review continuation, it does not itself authorise new code changes). | Approved |
| DEC-R1.2-022 | 25-Aug-2026 | **Proceed to Task 6 following successful completion of Task 5.** | OTP generation has been independently reviewed and determined to be functionally correct. Remaining observations relate to architecture hardening and engineering quality rather than production readiness. | Task 5 accepted. Review continues. TD-R1.3-007 created. | Approved |
| DEC-R1.2-023 | 25-Aug-2026 | **Proceed to Task 7 following successful completion of Task 6.** | OTP verification implementation satisfies production engineering requirements. Remaining observations concern future architecture hardening and engineering quality improvements. | Task 6 accepted. Review continues. TD-R1.3-007 expanded to include the complete OTP abuse protection initiative. | Approved |
| DEC-R1.2-024 | 25-Aug-2026 | **Proceed to Task 9 following successful completion of Tasks 7 and 8.** | Engineering review confirms the complete traveller journey through lead creation and Journey Director integration is functionally sound. Remaining observations relate to UX recovery and production observability. | Tasks 7 and 8 accepted. TD-R1.3-008 created. Review continues. | Approved |
| DEC-R1.2-025 | 26-Aug-2026 | **Engineering Review 1 approved. Proceed to Functional QA.** | Engineering review confirms that the WS5 implementation satisfies Release 1.2 engineering expectations. Remaining work consists of operational enablement, functional validation, traveller validation, and deferred Release 1.3 improvements. | Engineering Review 1 closed. Functional QA authorized. Release 1.3 backlog synchronized. | Approved |
| DEC-R1.2-026 | 27-Aug-2026 | **Workstream 5 status changes from "Partially Implemented – Waiting for External DLT Dependency" to "Engineering Complete – Pending Functional QA."** External DLT/MSG91 chain completed (PE–TM Chain approved and activated, Sender Header verified, DLT Template validated); two Supabase RPC defects (`IMP-02`, `IMP-03`) fixed and deployed; a live, end-to-end OTP send/verify/completion cycle confirmed successfully by the Product Owner. | All external and engineering blockers to a live OTP flow are resolved, confirmed by direct Product Owner testing. Keerthi's structured functional QA and Product Acceptance remain independent, outstanding gates before Workstream 5 can close. | Workstream 5 tracker status updated. Keerthi's functional QA authorized to proceed against a confirmed-working build. Release 1.2 closure remains gated on functional QA, the OTP-expiry wording decision, and Product Acceptance. | Approved |

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
- [x] All EBCs raised under Release 1.2 through R1.2-020 are completed
- [ ] No known functional release blocker remains open

## Documentation

- [x] This document (`RELEASE-1.2.md`) is current at Version 1.12
- [ ] `PROJECT-HISTORY.md` updated with the Release 1.2 entry
- [ ] Release notes prepared
- [x] Decision log (Section 7) reflects all approved material decisions through DEC-R1.2-014
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

## Workstream 3 – Destination Intelligence (WP-4 / Workbook Consistency Remediation)

**Status:** Registered — Backlog Only, Not Actioned

**Source:** `R1.2-WS3-OBS-01-EBC-TIGER` (Tiger — Engineering Observations & Backlog Registration), consolidating three engineering findings Rad identified and independently verified as pre-existing and outside approved implementation scope while executing WP-4 (`R1.2-WS3-IMP-01A-EBC-RAD`) and Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`, Findings 2–4). No implementation is authorised by this entry.

### OBS-R1.2-007
**Title:** Shared Generated Artifact Ownership

**Source:** Rad – Engineering (`R1.2-WS3-IMP-01B-EBC-RAD`, Finding 2)

**Observation:**

`verify:journey-intelligence`'s standalone artifact-package check expects exactly the eight artefacts the journey-intelligence generator itself produces. A separate, independently-scoped generator (`generate:journey-itineraries`) also writes into the same `web/generated/` directory (a `journey-itineraries/` subdirectory), and the journey-intelligence generator's atomic directory swap does not account for that coexisting output. This is a pre-existing architectural gap — two generators unsafely sharing one output directory — not caused by WP-4 or the workbook remediation.

**Impact:** Engineering verification; generator maintenance; future scalability.

**Priority:** Medium

**Decision:**

Registered. No generator or verification-script changes are authorised under this entry. Recommend a future engineering review of generated-artefact ownership and verification strategy (candidate owners: Archie/Rad). Does not block Workstream 3 or Release 1.2.

---

### OBS-R1.2-008
**Title:** Goa Steering Verification

**Source:** Rad – Engineering (`R1.2-WS3-IMP-01B-EBC-RAD`, Finding 3)

**Observation:**

`verify:journey-intelligence:steering` reports a mountain-intent/Goa-eligibility failure ("mountain intent keeps Goa eligible for scoring rather than hard-excluding it"). Rad's exhaustive artefact diff confirmed Goa's own compatibility, journey-DNA and constraint data are byte-identical before and after the Assam workbook remediation, and that no mountain-candidate destination's data changed at all — the underlying scoring-logic defect is real but proven unrelated to WP-4 or the remediation.

**Impact:** Recommendation verification; test confidence.

**Priority:** Medium

**Decision:**

Registered. No scoring-logic or runtime changes are authorised under this entry. Recommend future business and engineering investigation into the mountain-intent steering logic (candidate owners: Arjun for business intent, Rad/Archie for the scoring defect). Does not block Workstream 3 or Release 1.2.

---

### OBS-R1.2-009
**Title:** Journey Engine Verification Fixture

**Source:** Rad – Engineering (`R1.2-WS3-IMP-01B-EBC-RAD`, Finding 4)

**Observation:**

`verify:journey-engine` continues to fail on a known, previously-documented issue: a hard-coded `moodValues` test fixture with only 5 entries against 6 `JOURNEY_FEELINGS`, causing an index-misalignment assertion failure on one feeling per run. This predates the current implementation and is unrelated to destination or workbook data.

**Impact:** Engineering validation; test infrastructure.

**Priority:** Low

**Decision:**

Registered. No test-fixture or engine changes are authorised under this entry. Recommend future maintenance of engineering verification fixtures (candidate owner: Rad). Does not block Workstream 3 or Release 1.2.

---

### Technical Debt Register — Workstream 3

| Item | Description | Priority | Disposition |
|---|---|---|---|
| OBS-R1.2-007 — Shared Generated Artifact Ownership | Two generators (`generate:journey-intelligence`, `generate:journey-itineraries`) unsafely share `web/generated/`; `verify:journey-intelligence`'s "exactly eight artefacts" check does not allow for the coexistence. | Medium | Pre-existing, not a WP-4/remediation regression. Recommend future engineering review of generated-artefact ownership and verification strategy. Not actioned under `R1.2-WS3-OBS-01-EBC-TIGER`. |
| OBS-R1.2-008 — Goa Steering Verification | `verify:journey-intelligence:steering` fails on a mountain-intent/Goa-eligibility scoring defect, proven unrelated to WP-4 or the Assam workbook remediation (Goa's own data is byte-identical before/after). | Medium | Pre-existing, unresolved scoring-logic defect. Recommend future business and engineering investigation. Not actioned under `R1.2-WS3-OBS-01-EBC-TIGER`. |
| OBS-R1.2-009 — Journey Engine Verification Fixture | `verify:journey-engine` fails on a known, pre-existing `moodValues` fixture with 5 entries against 6 `JOURNEY_FEELINGS`. | Low | Pre-existing test-infrastructure issue, predates current implementation. Recommend future fixture maintenance. Not actioned under `R1.2-WS3-OBS-01-EBC-TIGER`. |

---

## Summary

All three engineering observations above were identified by Rad during execution of WP-4 (`R1.2-WS3-IMP-01A-EBC-RAD`) and Workbook Consistency Remediation (`R1.2-WS3-IMP-01B-EBC-RAD`), independently verified to be pre-existing and unrelated to either piece of work, and registered here for future prioritisation per `R1.2-WS3-OBS-01-EBC-TIGER`.

No Critical or High severity defect is recorded. No implementation, generator, runtime, or verification-script change is authorised by this registration. Workstream 3 implementation progress and status are unaffected by this entry — see Section 5 for the Workstream 3 Implementation Phase Dashboard, which this EBC does not update (see the Document Change History note against `R1.2-022` on the pending WP-4/remediation consolidation).

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
