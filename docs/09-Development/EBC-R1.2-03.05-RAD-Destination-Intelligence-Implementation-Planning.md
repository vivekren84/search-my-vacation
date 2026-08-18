# EBC R1.2-03.05-EBC-RAD — Destination Intelligence Implementation Planning

**Persona:** Rad — Engineering and Implementation Specialist
**Type:** Technical Implementation Planning (planning only — no application code, configuration, generators, workbooks, runtime data, or recommendation logic modified; this document is the sole deliverable)
**Workstream:** WS3 — Destination Intelligence
**Date:** 17 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session, Repository and Input Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`. Working tree confirmed clean except the pre-existing untracked items every recent Workstream 3 EBC on this branch has noted (`_to_delete/`, an untracked WS2 doc, and the two prior WS3 Rad audit reports now filed under `docs/09-Development/`). None were touched by this planning exercise.
- No repository files, application code, configuration, generators, workbooks, runtime data, or recommendation logic were created, modified, or deleted. This document is the sole deliverable, matching this EBC's Explicit Constraints.
- **Mandatory architectural inputs read in full:** `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (Status: **Accepted**, ratified 17 August 2026); `docs/09-Development/EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md`; `claude/EBC-R1.2-03.01-ARJUN-Destination-Intelligence-Analysis.md`; `claude/EBC-R1.2-03.01-EBC-SOPHIE-Traveller-Experience-Validation-Destination-Intelligence.md`; `docs/09-Development/EBC-R1.2-03.02-RAD-Destination-Knowledge-Base-Synchronisation-Audit.md`; `docs/09-Development/EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md`. All six are treated as settled evidence and are not re-derived, re-audited, or second-guessed here — this document translates their agreed conclusions into an executable plan, per this EBC's own instruction.
- `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` and `docs/10-Backlog/RELEASE-1.2.md` (v1.7) re-read for this exercise: the existing Workstream 3 task table (`R1.2-03.01`–`03.15`), `DEC-R1.2-010` (weighted Primary/Secondary/Tertiary preference model), and `RISK-R1.2-011` (its recommendation-output risk) all inform the phasing and dependency work below.
- Additional repository facts checked directly for this exercise: `web/package.json` already defines 14 `verify:journey-*` / `generate:journey-*` npm scripts covering the engine, presentation adapter, runtime catalogue, orchestration, scenarios, and the intelligence generator itself (determinism, artifacts, runtime, steering) — a substantial existing test/verification surface this plan builds on rather than replaces. **No `.github/` directory exists in this repository** — there is currently no CI pipeline; every `verify:journey-*` check today runs manually/locally. This is a material fact for the Testing Strategy (Section 8) and is carried into the Technical Change Inventory and Open Decisions below rather than assumed away.

## 0.1 Framing — this EBC's task label and its relationship to the tracker

`RELEASE-1.2.md` (v1.7) defines task `R1.2-03.05` as *"Define analytics considerations"* (Owner: Archie, depends on 03.02) — a narrower, differently-owned task than this EBC's actual brief (a full implementation roadmap, owned by Rad). This is the same pattern already named and escalated in every prior Workstream 3 EBC on this branch (`R1.2-03.02`, `R1.2-03.03`, and `R1.2-03.04` itself, per that document's own Section 0.1). As with those, it carries no risk of corrupting tracker content: this EBC produces a planning document only, with no instruction to edit `RELEASE-1.2.md`. This document repeats the now-standing recommendation that Tiger reconcile the `R1.2-03.0x` task numbering, ownership, and descriptions against what Workstream 3 has actually produced — and proposes, in Section 12 (Open Decisions), that this reconciliation itself become the first item of Work Package 12 (Documentation Updates) below, rather than being deferred indefinitely.

One related, evidence-based observation carried forward from Archie's `R1.2-03.04` review (§0): Arjun's and Sophie's `R1.2-03.01` reports are cited throughout the ADR's Appendix B as living at `docs/09-Development/EBC-R1.2-03.01-...`, but **no such files exist in the repository** — both are currently reachable only via the Claude Project (`claude/` namespace). This is named here, not resolved, since filing them is outside this EBC's planning-only scope; it is carried into Work Package 12 as a documentation-completeness item.

---

## 1. Executive Summary

This plan translates `ADR-R1.2-WS3-001` (Accepted) and its authoring architecture document (`R1.2-03.04-EBC-ARCHIE`) into an executable roadmap. It does not revisit any architectural or product decision already made in those documents, and it does not resolve any of the open decisions both documents deliberately left for Tiger and Vivek (Section 12 consolidates all of them).

The plan is organised into **12 work packages** across **6 phases**, sequenced on one governing constraint that every prior Workstream 3 document has independently converged on: *the KB-to-Operational Reconciliation Check, the four excluded destinations' resolution, and the controlled-vocabulary synchronisation should all be substantially in place before `R1.2-03.07` onward (the weighted Primary/Secondary/Tertiary preference model, `DEC-R1.2-010`) begins* — because that work builds directly on `release1JourneyCandidates` and would otherwise encode today's measured gaps into the scoring logic itself, which is materially harder to unwind later than closing the gap upstream first. This plan therefore treats the existing, already-tracked `R1.2-03.07`–`03.12` tasks as **Phase 4** of this roadmap (Work Package 8), gated behind Phases 1–3, rather than re-planning them from scratch.

A second governing tension, surfaced but **not resolved** here per Tiger's instruction to plan rather than solve: Arjun's `R1.2-03.01` review recommended sequencing content-readiness work (closing the 19-of-24 destination content gap) to *follow* the weighted-preference decisions, so effort isn't spent enriching destinations that turn out lower-priority. Sophie's `R1.2-03.01` review and the ADR both lean toward treating the content gap as urgent *because* Perfect Match and Beautiful Puzzle selection are structurally blind to it (0% weight; Hidden Gem only 10%). This plan surfaces both positions against the same phase timeline (Section 4, Section 6) and lists the sequencing choice as Open Decision OD-3 rather than picking a side.

Twelve work packages, one net-new governance role (the Destination Operational Steward, unassigned in Team Satvi's current roster), and roughly 70–110 engineering hours (Section 9) across governance tooling, generator enhancement, and runtime changes — excluding the pre-existing, separately-scoped `R1.2-03.07`–`03.12` weighted-model tasks and the content-authoring effort for 19 destinations, neither of which this EBC is positioned to estimate with confidence (Section 9 states why). The plan explicitly preserves every "unchanged" boundary both the ADR and Archie's architecture document named: the deterministic engine, the Recommendation Adapter, the atomic/checksummed generation pipeline, and the served-destination guardrail (`DEC-R1.2-004`) are not touched by any work package below.

**Readiness verdict (Section 13): implementation can begin on Phase 0 (Work Package 1) immediately.** Phases 1–3 require the Open Decisions in Section 12 — most consequentially, who becomes Destination Operational Steward, and whether the KB-to-Operational Reconciliation Check launches in warn-mode — to be made first; this plan identifies exactly which decisions block which work package, so no further technical discovery is needed to unblock them once made.

---

## 2. Implementation Roadmap (overview)

```text
Phase 0: Governance Foundations           WP-1
        │  (role assignment, gate-mode decision — no code)
        ▼
Phase 1: Business & Operational Alignment  WP-2, WP-3
        │  (resolve/defer the 4 excluded destinations; workbook edits)
        ▼
Phase 2: Generation & Vocabulary Alignment WP-4, WP-5
        │  (reconciliation check; generated vocabulary mappings)
        ▼
Phase 3: Runtime Alignment                 WP-6, WP-7
        │  (computed dataQuality; public/runtime cross-reference check)
        ▼
Phase 4: Recommendation Behaviour          WP-8
        │  (existing R1.2-03.07–03.12, now explicitly unblocked)
        ▼
Phase 5: Validation, QA & Documentation    WP-9 (parallel from Phase 1), WP-10, WP-11, WP-12
```

Work Package 9 (Content Readiness Support) is drawn as parallel-capable from Phase 1 onward, not sequential — see Section 4's dependency notes and Open Decision OD-3.

---

## 3. Work Package Breakdown

### WP-1 — Governance Foundations & Role Assignment
**Objective:** Establish the organisational prerequisites the ADR's technical mechanisms depend on, before any of them are built.
**Scope:** Name the Destination Operational Steward (ADR §6.1 / §15 Decision 1 — the single most consequential ownership gap either architecture document identifies); confirm warn-mode vs. block-mode for the KB-to-Operational Reconciliation Check at launch (ADR §15 Decision 2, recommended: warn-mode first); confirm the Operational Layer's near-term form (ADR §13.2 / Archie Rec #9 — recommended: Option A, keep the workbook, make it KB-derived). No code changes; this is a decision-and-assignment work package.
**Out of scope:** Any code, workbook, or documentation change — this work package produces decisions only, recorded by Tiger.

### WP-2 — Business Knowledge Alignment
**Objective:** Convert the ADR's Destination Lifecycle Model (§12/§8) from a documented framework into recorded, dated decisions for the four destinations currently stuck at "Approved (KB Active)" without reaching "Operationally Authored."
**Scope:** For Amritsar, Assam, Corbett, and Darjeeling — individually, not as a batch, since their root causes differ (`R1.2-03.03` §7, RC-1 through RC-4) — record a decision: advance toward Operationally Authored, or explicitly hold at Approved with a stated reason and review date (ADR §8). Confirm the Traveller Type vocabulary scope decision (formalise at 5, matching current runtime state, or extend toward the KB's approved 9 — ADR §15 Decision 4). Confirm interim public-card treatment for any destination held below Runtime Ready (ADR §15 Decision 5; directly answers Open Question 6 from `R1.2-03.03`).
**Out of scope:** Editing the workbook itself (WP-3); editing `public-destinations.config.ts` (downstream of this work package's decision, executed under WP-3/WP-9 as applicable).

### WP-3 — Operational Workbook Alignment
**Objective:** Execute WP-2's decisions in the operational layer, and address the workbook's own standing structural risks.
**Scope:** Locate, recover, or reconstruct `Journey Director Intelligence Input-2.xlsx` (ADR §15 Decision 8 — currently a single point of failure on one author's local machine, evidenced only via a `Source Register` checksum and local path per `R1.2-03.03` §2.1); bring the seed/operational workbook into version control (Archie Rec #7); for any destination WP-2 decided to advance, add or restructure its operational-layer rows to carry `Journey Base Status: Yes` (Amritsar's Attraction-record restructure; Assam's Northeast-vs-Wildlife-Tours duplicate-ownership resolution, `review-0285`/`review-0286`; Corbett and Darjeeling's net-new rows, `review-0292` and the unflagged Darjeeling gap respectively); resolve or explicitly re-flag the 15 other open `REVIEW_REQUIRED` rows already in the Review Register (`R1.2-03.03` §5) as part of the same pass, since they use the identical mechanism; extend the workbook's `Traveller Types`/`Emotional Goals`/`Desired Experiences` taxonomy sheets toward the KB's 9/17/36 if WP-2's vocabulary-scope decision calls for extension rather than formalising at 5/11/15.
**Out of scope:** Generator code changes (WP-4); this work package edits workbook content only.

### WP-4 — KB-to-Operational Reconciliation Check (Generator Enhancement)
**Objective:** Build the ADR's one named, mechanical governance gate (§7, first row) — the control that would have caught the Amritsar/Assam/Corbett/Darjeeling gap automatically instead of requiring two manual engineering audits to find it.
**Scope:** A new validation step in the generation pipeline (natural home: alongside `web/scripts/journey-intelligence/validateWorkbook.ts`, extending rather than replacing its existing sheet/header/cross-reference checks) that compares every KB §10/§11 `ACTIVE` destination/region against the operational layer's row set and reports any KB-approved item with no corresponding row, in warn-mode initially per WP-1's decision. Extend `writeGenerationReport.ts` with a named, non-suppressible finding section distinct from today's `REVIEW_REQUIRED` warnings (which this workstream's evidence shows nobody is currently tasked with acting on). Add a named promotion-review checklist step (ADR §9) — today a successful generation run is, by construction, immediately promotable; this closes that gap without changing the underlying atomic/checksummed/rollback-safe generation mechanics, which both audits and the ADR agree are sound and out of scope for redesign.
**Out of scope:** Changing `generateJourneyDNA.ts`'s core `journeyBaseStatus === "Yes"` inclusion filter itself — that mechanism is confirmed sound engineering by both Rad audits; this work package adds a check *around* it, not a change *to* it.

### WP-5 — Controlled Vocabulary Synchronisation
**Objective:** Close RC-6 (`R1.2-03.03` §7) — the 41%/53% Emotion/Theme reachability gap that exists despite the runtime type system matching the KB exactly.
**Scope:** Add a "vocabulary reachability" section to the generation report (ADR §10 — ties directly into WP-4's report extension); replace the currently hand-authored `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`/`TRAVELLER_BY_LABEL` constant tables in `release1Candidates.ts:58-96` with tables generated from the operational layer's KB-validated taxonomy sheets, once WP-3 has grown those sheets toward the KB's fuller vocabulary (if WP-2/WP-1 decided on extension rather than formalising the current scope). If the scope decision instead formalises the current 5/11/15 subset as an **Approved Release Scope Reduction** (ADR §11), this work package's scope shrinks to recording that decision plus the reachability report only, with no table regeneration required.
**Out of scope:** Any change to `engine.types.ts`'s `EmotionId`/`ThemeId` unions, which already match the KB exactly and require no change under either scope-decision branch; only `TravellerType` (5 vs. 9) is a candidate for a type-level change, and only if WP-2 decides to extend it.

### WP-6 — Runtime Model Updates
**Objective:** Close RC-9 (`R1.2-03.03` §7) and formalise the confidence-tier sourcing gap the ADR names in its Source-of-Truth Model (§7).
**Scope:** Replace the hardcoded `dataQuality: "COMPLETE"` in `buildCandidate()`/`buildRegion()` (`release1Candidates.ts:251,338`) with a value computed from actual KB-region coverage per candidate, so a destination missing 3 of 7 KB-approved regions (e.g. today's Kerala — Thekkady/Periyar, Kumarakom, Varkala/Kovalam absent, `R1.2-03.03` §3.1) is distinguishable at the eligibility/scoring stage from a fully-represented one. Source `CONFIDENT_APPROVAL_CANDIDATE_IDS` from a recorded, dated Operations decision rather than an unlabelled TS constant with no visible approval trail (ADR §7).
**Out of scope:** Any change to `evaluateEligibility.ts`, `scoreCandidate.ts`, or `selectPossibilities.ts`'s selection weighting logic itself — both Rad audits and Archie's review confirm the engine/adapter boundary is sound; this work package changes only the *inputs* candidates carry into that boundary, consistent with the ADR's Principle 4 ("governance attaches at layer boundaries, never inside an already-verified one").

### WP-7 — Public/Runtime Cross-Reference Check (Consumption Layer Safeguard)
**Objective:** Build the ADR's low-cost, non-blocking safeguard (§7, final row) against future recurrence of the Amritsar-class gap — a public destination card published for a destination with zero runtime candidate presence.
**Scope:** A lightweight check comparing `public-destinations.config.ts` entries against `release1JourneyCandidates`' destination IDs, flagging (not blocking) any mismatch. Since this repository has no `.github/` CI directory today (Section 0), this work package's scope explicitly includes a decision point, not an assumption: whether this check runs as a new local `verify:*` npm script only (consistent with the existing 14-script pattern, lowest effort), or whether it is the occasion to stand up CI infrastructure for the first time (larger effort, broader benefit, and a decision this plan does not make — see Open Decision OD-6).
**Out of scope:** Any change to how `public-destinations.config.ts` cards are authored or published — WP-7 checks the relationship between two artefacts; it does not change either one.

### WP-8 — Recommendation Pipeline Changes (existing `R1.2-03.07`–`03.12`)
**Objective:** Not a new work package — this is the tracker's own, already-scoped weighted Primary/Secondary/Tertiary Journey and Memory preference model (`DEC-R1.2-010`), included here only to make its sequencing dependency on Phases 1–3 explicit, per every Workstream 3 document's converging recommendation (Section 1).
**Scope:** As already defined in `RELEASE-1.2.md` (`R1.2-03.07` weighted Journey ranking, `R1.2-03.08` weighted Memory ranking, `R1.2-03.09` mapping validation, `R1.2-03.10` weighting-convention documentation, `R1.2-03.11` recommendation-ordering review requiring Archie's explicit architecture approval, `R1.2-03.12` recommendation-consistency validation, referenced by `RISK-R1.2-011`). This plan does not re-scope, re-estimate, or re-sequence these six tasks internally — that remains Tiger's and Archie's existing responsibility under their own task ownership. This plan's sole contribution is the phase-gate: **Phase 4 should not begin until Phases 1–3 (WP-1 through WP-7) are substantially complete**, so the weighting model computes over a reconciled candidate pool and a KB-derived vocabulary reach rather than encoding today's gaps into the scoring logic itself.

### WP-9 — Content Readiness Support
**Objective:** Close the content-readiness gap both Arjun's and Sophie's `R1.2-03.01` reviews identified as the workstream's most consequential traveller-facing finding — 19 of 24 destinations lack the curated "moments" content, approved imagery, and qualified region content that the 5 `CONFIDENT_APPROVAL_CANDIDATE_IDS` destinations already have.
**Scope:** Author `journeyPresentationCatalogue` entries (`journey-director.config.ts`) and confidence-approved imagery for destinations beyond the current 5, prioritised per Open Decision OD-3's outcome; extend `evidenceReadiness` computation once WP-6's `dataQuality` change lands, so content-readiness and data-quality reflect the same underlying reality rather than two independently-maintained signals.
**Out of scope:** Redesigning the `ImagineYourJourney` component, the three-tier Perfect Match/Beautiful Puzzle/Hidden Gem selection logic, or the `confidenceNote`/content-readiness copy relationship Sophie's review flagged as an *opportunity*, not a request — any of those would require a separate Sophie-owned UX work package and EBC, out of this plan's engineering-implementation scope.

### WP-10 — QA & Validation
**Objective:** Extend Keerthi's functional QA discipline to cover the exact class of gap neither prior QA pass (Workstream 2's, or any Workstream 3 review to date) was scoped to catch: "can this KB-approved destination actually be recommended end-to-end," not only "is the KB document internally consistent" (ADR §11, Archie's explicit instruction).
**Scope:** A destination-intelligence functional QA pass, run after Phase 3, verifying: every destination WP-2 decided to advance is recommendable under a representative traveller profile; the KB-to-Operational Reconciliation Check (WP-4) correctly reports both the "no gap" and "gap present" cases; the public/runtime cross-reference check (WP-7) correctly flags a deliberately-introduced mismatch in a test scenario. A second pass after Phase 4, aligned with the existing `R1.2-03.12` recommendation-consistency validation task.
**Out of scope:** Traveller Experience Validation (Sri) — listed separately in Section 8 (Testing Strategy), since it requires visible, live content changes (WP-9) to be meaningful, not just engineering correctness.

### WP-11 — Regression Testing
**Objective:** Confirm none of WP-3 through WP-8's changes destabilise Journey Passport, Journey Director, or any adjacent feature — matching the existing tracker task `R1.2-03.06` and Project Instructions Section 28's Definition of Done.
**Scope:** Full execution of the existing 14 `verify:journey-*`/`generate:journey-*` npm scripts (Section 0) after each phase that touches generated artefacts or runtime code (Phases 2, 3, 4); `npm run lint`, TypeScript validation, and production build after every code-touching phase; determinism re-verification (`verify:journey-intelligence:determinism`) specifically after any workbook regeneration (WP-3/WP-4), since determinism is the one guarantee both audits found already excellent and worth explicitly protecting.
**Out of scope:** Writing new automated regression tests beyond what WP-4/WP-7 themselves require to be verifiable — broader test-suite expansion is not called for by any of the six prerequisite documents and would be scope expansion beyond this EBC's planning brief.

### WP-12 — Documentation Updates
**Objective:** Keep `RELEASE-1.2.md`, the ADR, and adjacent documentation current as implementation proceeds, following the established pattern (`R1.2-015`) rather than introducing a new one.
**Scope:** Reconcile the `R1.2-03.0x` task-numbering mismatch this document and every prior WS3 EBC has named (Section 0.1); file Arjun's and Sophie's `R1.2-03.01` reports into `docs/09-Development/` to match the ADR's own Appendix B citations (Section 0.1); correct `JOURNEY-INTELLIGENCE-GENERATOR.md`'s "Canonical workbook" field, which Archie's `R1.2-03.04` review (§9) found asserts canonicity for a workbook its own separate governing report withholds production approval from — a documentation-drift finding distinct from, but related to, this workstream's core gap; record each phase's decisions in the ADR's Decision History (§17) and `RELEASE-1.2.md`'s Decision Log as they are made, rather than batching them into a single end-of-workstream update.
**Out of scope:** Any change to the ADR's architectural content itself (Sections 1–16) — per the ADR's own closing instruction (§17), material changes require a new or superseding ADR, not an edit to this one.

---

## 4. Dependency Matrix

| Work Package | Predecessors | Successors | Blocking? | Parallel-capable with |
| --- | --- | --- | --- | --- |
| WP-1 Governance Foundations | — | WP-2, WP-3, WP-4 | Yes — blocks all subsequent work packages except WP-9/WP-12's earliest items | — (must complete first) |
| WP-2 Business Knowledge Alignment | WP-1 | WP-3, WP-5 (vocabulary-scope branch) | Yes — blocks WP-3's row-level edits | WP-12 (documentation prep) |
| WP-3 Operational Workbook Alignment | WP-1, WP-2 | WP-4 (meaningful validation target), WP-5 (taxonomy growth), WP-9 (imagery/content targets) | Yes — WP-4's check has nothing to validate against until WP-3 lands at least the WP-2-decided rows | WP-9 (content authoring can start against KB targets before workbook rows land) |
| WP-4 KB-to-Operational Reconciliation Check | WP-1 (gate-mode decision); soft dependency on WP-3 for meaningful first run | WP-8 (Phase 4 gate), WP-10 | No — the check itself can be built in parallel with WP-3, only its first meaningful *run* depends on WP-3 | WP-3 (build in parallel), WP-5, WP-6 |
| WP-5 Controlled Vocabulary Synchronisation | WP-2 (scope decision), WP-3 (taxonomy sheet growth, if extension chosen) | WP-8 | Partial — blocks WP-8 only if the vocabulary-scope decision is "extend"; if "formalise at current scope," WP-5 is a documentation-only task and does not block WP-8 | WP-4, WP-6 |
| WP-6 Runtime Model Updates | WP-1 (confidence-sourcing decision); soft dependency on WP-3 for meaningful `dataQuality` computation | WP-7, WP-9 (evidenceReadiness alignment), WP-8 | No hard block — can be implemented against today's data and re-verified once WP-3 lands | WP-4, WP-5 |
| WP-7 Public/Runtime Cross-Reference Check | WP-6 (for a meaningful signal); Open Decision OD-6 (CI scope) | WP-10 | No — low-cost, can slot in anywhere in Phase 3 | WP-4, WP-5, WP-6 |
| WP-8 Recommendation Pipeline (existing 03.07–03.12) | WP-1 through WP-7 substantially complete (this plan's central sequencing recommendation) | WP-10 (final QA pass), WP-11 | **Yes — this is the one hard, workstream-wide gate this plan adds** | Its own internal 03.07–03.12 dependency chain, already defined in the tracker |
| WP-9 Content Readiness Support | Soft dependency on WP-2 (destination priority) and, per Open Decision OD-3, possibly on WP-8 | — | No hard block on any other work package; only its own internal sequencing is contested (OD-3) | WP-1 through WP-7 (content authoring is independent of engineering governance work) |
| WP-10 QA & Validation | WP-4, WP-7 (first pass, post-Phase 3); WP-8 (second pass, post-Phase 4) | Release readiness | Yes — release cannot proceed without this | — |
| WP-11 Regression Testing | Any phase touching generated artefacts or runtime code | Release readiness | Yes | Runs after each qualifying phase, not only once at the end |
| WP-12 Documentation Updates | Ongoing from WP-1; final consolidation after WP-8 | Release readiness (documentation checkpoint) | Partial — final consolidation blocks release sign-off, not earlier work | Runs continuously alongside every other work package |

**Mandatory sequencing (no exceptions identified by this plan):** WP-1 → WP-2 → WP-3 → (WP-4, WP-5, WP-6 in parallel) → WP-7 → WP-8 → WP-10 (second pass) → release. **Parallel opportunities:** WP-4/WP-5/WP-6/WP-7 can be built concurrently by different engineers once WP-3 has landed the decided workbook changes, since they touch different files (`validateWorkbook.ts`/`writeGenerationReport.ts`; `release1Candidates.ts`'s label maps; `release1Candidates.ts`'s `buildCandidate`/`buildRegion`; a new standalone check respectively) with no shared-file conflict identified. WP-9 and WP-12 run continuously across the whole timeline.

---

## 5. Technical Change Inventory

Inventory only — file/folder-level, not an editing plan, per this EBC's explicit instruction.

| Work Package | Repositories / folders | Likely files or modules | Configuration areas | Runtime assets | Documentation likely affected |
| --- | --- | --- | --- | --- | --- |
| WP-1 | — | — | Team Satvi persona roster (Project Instructions, if the Steward role is formalised there) | — | `RELEASE-1.2.md` (decision log), ADR §17 |
| WP-2 | — | — | — | — | `RELEASE-1.2.md` (decision log, open decisions), ADR §17, KB §10/§11 (status notes only if a hold-with-review-date is recorded) |
| WP-3 | `outputs/`, workbook location TBD by WP-1's version-control decision | `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` (or successor); recovered/reconstructed `Journey Director Intelligence Input-2.xlsx` | Workbook sheets: `Destination Catalogue`, `Destination Intelligence` (`Journey Base Status`, `Operational Confidence` columns), `Traveller Types`/`Emotional Goals`/`Desired Experiences` if extending | `web/generated/*.json` (all 8, on next regeneration) | `JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md` (Review Register resolution), `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` (regenerated) |
| WP-4 | `web/scripts/journey-intelligence/` | `validateWorkbook.ts` (extend), `writeGenerationReport.ts` (extend), possibly a new `validateKbReconciliation.ts` module | `web/package.json` (possible new `verify:*` script) | Generation report output format | `JOURNEY-INTELLIGENCE-GENERATOR.md`, `EBC-003C-B-JOURNEY-INTELLIGENCE-GENERATOR.md` |
| WP-5 | `web/lib/journey-director/catalogue/`, `web/scripts/journey-intelligence/` | `release1Candidates.ts:58-96` (label-mapping tables — replace hand-authored with generated, or document as scope-reduction), possibly a new generator step producing these tables | — | `web/generated/*.json` (if taxonomy sheets grow) | `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` |
| WP-6 | `web/lib/journey-director/catalogue/` | `release1Candidates.ts:238-287` (`buildRegion`), `:309-381` (`buildCandidate`) — `dataQuality`, `CONFIDENT_APPROVAL_CANDIDATE_IDS` sourcing | — | — | `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §13 |
| WP-7 | `web/lib/journey-director/` or a new `web/scripts/` check; possibly `.github/workflows/` (net new, per OD-6) | New check module comparing `public-destinations.config.ts` against `release1JourneyCandidates` | `web/package.json` (new `verify:*` script); `.github/workflows/*.yml` if CI is stood up (net-new infrastructure, not an edit) | — | — |
| WP-8 | `web/lib/journey-director/engine/` | Per existing `R1.2-03.07`–`03.12` scope, not re-inventoried here — that inventory belongs to whoever plans those tasks' own implementation detail | — | `web/generated/*.json` (consumed, not regenerated by this work) | `RELEASE-1.2.md` §6.3, `JOURNEY-DIRECTOR-DECISION-ENGINE.md` |
| WP-9 | `web/config/`, `web/public/images/journey-director/` | `journey-director.config.ts` (`journeyPresentationCatalogue`), `destination-images.config.ts` | — | New/promoted imagery assets | — |
| WP-10 | — | Test scenarios in `web/lib/journey-director/validation/` (existing files, exercised not necessarily modified) | — | — | QA report(s), following the established `EBCR1.2-011`-style format |
| WP-11 | Repository-wide | — | `web/package.json` (existing scripts, run not changed) | — | — |
| WP-12 | `docs/` | `RELEASE-1.2.md`, `docs/20-Architecture/ADR-R1.2-WS3-001-...`, `docs/09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md`, new filings of the `R1.2-03.01` Arjun/Sophie reports | — | — | Self-referential |

---

## 6. Implementation Phasing

```text
Phase 0 — Governance Foundations           WP-1
        ↓  (Open Decisions OD-1, OD-2, OD-4 resolved)
Phase 1 — Business & Operational Alignment WP-2, WP-3
        ↓  (4-destination resolution recorded; workbook aligned)
Phase 2 — Generation & Vocabulary Alignment WP-4, WP-5   [can run parallel internally]
        ↓  (reconciliation gate live in warn-mode; vocabulary reachability visible)
Phase 3 — Runtime Alignment                WP-6, WP-7   [can run parallel internally]
        ↓  (dataQuality reflects real coverage; consumption-layer safeguard live)
Phase 4 — Recommendation Behaviour         WP-8 (existing R1.2-03.07–03.12)
        ↓  (weighted model implemented over a reconciled foundation)
Phase 5 — Validation, QA & Release         WP-10 (2nd pass), WP-11, WP-12 (final consolidation)
```

WP-9 (Content Readiness Support) and the earlier passes of WP-10/WP-11/WP-12 run continuously from Phase 1 onward, not as a discrete phase — shown separately in Sections 3–4 to avoid implying they block or are blocked by the numbered phases above, per Open Decision OD-3.

This phasing directly mirrors the EBC brief's own example structure (Business Alignment → Generator Alignment → Runtime Alignment → Recommendation Behaviour → Validation & QA), refined only by splitting "Generator Alignment" into a Phase 2 (reconciliation + vocabulary) and folding runtime-layer changes into Phase 3, since the repository evidence (both Rad audits, Archie's architecture) locates the actual mechanisms at exactly those two boundaries — not because the EBC's suggested structure needed correcting.

---

## 7. Risk Assessment

| Phase | Risk | Category | Severity | Mitigation | Rollback consideration |
| --- | --- | --- | --- | --- | --- |
| Phase 0 | No one accepts the Destination Operational Steward role, or it is assigned without capacity to act on it | Implementation | **High** | Tiger names the role explicitly with capacity confirmed, not just a title assigned; this is a precondition this plan flags, not one it can mitigate by design | N/A — a staffing decision, not a technical rollback |
| Phase 0 | Warn-mode is chosen but no process exists to act on warnings, repeating the exact pattern that let today's `REVIEW_REQUIRED` warnings go unacted-on for 297 items | Governance / regression of intent | **Medium-High** | WP-4's report section must be paired with an explicit, named review step (already scoped in WP-4), not just a louder log line | N/A |
| Phase 1 | `Journey Director Intelligence Input-2.xlsx` is genuinely unrecoverable | Data migration | **Medium** | Reconstruction from the Enriched workbook's `Source Register` row-level citations plus the KB is possible in principle (evidenced structure exists) but is itself effort; confirm recoverability early in WP-3, not late | If unrecoverable, the Enriched workbook becomes the de facto seed going forward — a scope note for WP-3, not a blocker to the phase |
| Phase 1 | Restructuring Amritsar from 3 Attraction rows to a Journey Base row, or resolving Assam's dual Northeast/Wildlife-Tours ownership, changes downstream `regionId`s in ways `release1Candidates.ts`'s `legacyCandidateId`/`CANDIDATE_ALIASES` logic does not anticipate | Regression | **Medium** | Treat as a new destination addition (matching how Corbett/Darjeeling will be added) rather than an in-place ID rename, to avoid touching any existing candidate's identity; verify via WP-11's determinism/runtime-catalogue checks immediately after regeneration | Workbook version control (WP-3) makes this reversible; keep the pre-change workbook version tagged |
| Phase 1/2 | Regenerating `web/generated/*.json` after WP-3/WP-4 changes surfaces new `REVIEW_REQUIRED`/reconciliation findings for destinations *not* in today's known four-item gap, expanding scope mid-implementation | Scope / regression | **Medium** | WP-4's reconciliation check is designed to surface exactly this — treat any new finding as an Open Decision for Tiger/Vivek, not a silent fix, consistent with ADR Principle 3 | N/A — this is the check working as intended, not a failure |
| Phase 2 | Generating `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` from a KB-validated operational layer (WP-5) changes which emotions/themes existing working candidates (Kerala, Bali, and 20 others) receive, altering live recommendation behaviour without an explicit decision to do so | Regression | **Medium-High** | Diff the generated candidate set against today's pre-change output as an explicit WP-11 regression step before promotion; any change to an *existing* candidate's emotion/theme set (as opposed to a *new* candidate like Corbett gaining one) should be flagged for Product review, not auto-promoted | Keep the hand-authored tables available for direct comparison during the transition; this is exactly the kind of "generation report shows a *change*... requires sign-off before promotion" case Archie's §9 describes |
| Phase 3 | Computing `dataQuality` from real KB-region coverage changes `serviceConfidence`/eligibility outcomes for existing candidates in ways `evaluateEligibility.ts` was not written expecting (even though this plan does not touch that file) | Regression | **Medium** | Confirm via code reading (not assumed) that `evaluateEligibility.ts`'s gates key off `dataQuality === "INCOMPLETE"`/`"STALE"` specifically, not `"COMPLETE"` vs. some new intermediate value this work package might introduce — a design constraint for whoever implements WP-6, not a decision this plan makes | Feature-flag or stage the `dataQuality` computation change separately from any accompanying eligibility-gate change, if one turns out to be needed |
| Phase 3 | Standing up CI for the first time (WP-7, if OD-6 chooses that path) surfaces unrelated pre-existing failures in the 14 existing `verify:journey-*` scripts that have been passing locally but were never run in a clean, cache-free environment | Implementation / discovery | **Low-Medium** | Run the full existing verify suite in a clean environment as a WP-7 pre-check, independent of the new cross-reference check itself, before treating CI stand-up as complete | N/A — discovery, not a regression this plan causes |
| Phase 4 | The weighted preference model (WP-8/`R1.2-03.07`-`03.12`) begins before Phases 1–3 are complete, re-encoding today's gaps into scoring logic (the exact risk this plan's central sequencing recommendation exists to prevent) | Regression / rework | **High** | This plan's Phase 4 gate (Section 4, Section 6) — Tiger enforces the sequencing; no technical mitigation substitutes for the sequencing decision itself | Difficult — unwinding a weighting model already built on an unreconciled foundation is explicitly named by the ADR as harder than avoiding it upfront |
| Phase 5 | Content-readiness work (WP-9) and the weighted model (WP-8) are sequenced in the wrong order relative to each other (Open Decision OD-3), wasting content-authoring effort on destinations the weighting model later deprioritises, or leaving the model's top-weighted destinations thin on content | Operational / effort | **Medium** | This plan explicitly surfaces rather than resolves OD-3; whichever order Tiger chooses, re-confirm destination priority immediately before committing content-authoring effort, not once at the start of Phase 1 | N/A — a sequencing choice, not a technical rollback |

---

## 8. Testing Strategy

| Test type | Scope | When | Personas involved |
| --- | --- | --- | --- |
| Unit testing | New WP-4/WP-5/WP-6/WP-7 logic (reconciliation check, generated vocabulary tables, `dataQuality` computation, cross-reference check) tested in isolation | Within each work package, before integration | Rad |
| Integration testing | Full generation pipeline run (workbook → `web/generated/*.json`) after every WP-3/WP-4/WP-5 change, using the existing `generate:journey-intelligence` / `verify:journey-intelligence*` scripts | End of Phase 1, Phase 2 | Rad |
| Runtime validation | `loadRuntimeIntelligence.ts`'s existing fail-closed integrity verification, plus `verify:journey-catalogue`/`verify:journey-runtime`, after every regeneration | End of Phase 2, Phase 3 | Rad |
| Recommendation verification | Representative traveller profiles (reusing `web/lib/journey-director/validation/representativeProfiles.ts`) run against the updated candidate pool to confirm Amritsar/Assam/Corbett/Darjeeling (whichever WP-2 advanced) now appear where eligible, and that no previously-working destination's output changed unintentionally | End of Phase 2/3 (WP-10 first pass); again end of Phase 4 aligned with `R1.2-03.12` | Rad, Keerthi |
| Regression testing | Full 14-script `verify:journey-*`/`generate:journey-*` suite, `npm run lint`, TypeScript validation, `npm run build`, determinism re-verification | After every phase touching generated artefacts or runtime code (Phases 2, 3, 4) | Rad |
| Traveller experience validation | Live review of the traveller-facing recommendation flow for any newly-recommendable destination (WP-2/WP-3 outcomes) and any newly-enriched content (WP-9), against the KB's tone/structure standard Sophie's `R1.2-03.01` review already validated the *existing* five destinations meet | After WP-9 content lands for a given destination; not meaningful before then | Sri |
| Functional QA | Destination-intelligence-specific QA per WP-10's scope (Section 3) — "can this destination actually be recommended end-to-end," reconciliation-check behaviour, cross-reference-check behaviour | Post-Phase 3 (first pass), post-Phase 4 (second pass, aligned with `R1.2-03.12`) | Keerthi |
| Release regression | Adjacent-feature regression (Journey Passport, homepage, navigation) per Project Instructions Section 28, to confirm Destination Intelligence changes did not affect unrelated flows | Immediately before any release candidate | Keerthi |

---

## 9. Effort Estimation

**Assumptions stated up front, per this EBC's instruction:** (1) estimates are Rad's engineering-effort judgement only, not a committed schedule; (2) they exclude WP-8 (the existing `R1.2-03.07`–`03.12` tasks), which this plan does not re-scope and therefore cannot responsibly re-estimate; (3) they exclude WP-9's content-authoring effort, which is substantially non-engineering (copywriting, imagery sourcing/approval) and better estimated by Content & Experience than by Rad; (4) all estimates assume a single engineer working sequentially within a work package, with the parallel opportunities noted in Section 4 available to compress calendar time, not effort-hours; (5) estimates assume WP-1's decisions land without extended debate — a protracted Open Decision resolution process would extend calendar time without changing these effort figures.

| Work Package | Complexity | Implementation effort | Review effort | QA effort | Task-level total |
| --- | --- | --- | --- | --- | --- |
| WP-1 Governance Foundations | Low | 2–4h (coordination, documentation) | 1–2h (Tiger) | — | 3–6h |
| WP-2 Business Knowledge Alignment | Low-Medium | 3–6h (decision recording, per-destination) | 2–3h (Tiger, Vivek) | — | 5–9h |
| WP-3 Operational Workbook Alignment | Medium-High | 12–24h (recovery risk drives the range; row authoring itself is the smaller portion) | 3–4h (Archie, data review) | 2–3h (Keerthi, spot-check) | 17–31h |
| WP-4 KB-to-Operational Reconciliation Check | Medium | 8–14h | 2–3h (Archie) | 2–3h | 12–20h |
| WP-5 Controlled Vocabulary Synchronisation | Medium-High | 10–18h (higher if extension chosen over scope-reduction) | 2–3h (Archie) | 2–3h | 14–24h |
| WP-6 Runtime Model Updates | Low-Medium | 6–10h | 2–3h (Archie) | 2–3h | 10–16h |
| WP-7 Public/Runtime Cross-Reference Check | Low-Medium (Medium-High if CI stood up, per OD-6) | 4–8h (check only) / 12–20h (with CI) | 2–3h | 2–3h | 8–14h / 16–26h |
| WP-10 QA & Validation | Medium | — | — | 8–14h (across both passes) | 8–14h |
| WP-11 Regression Testing | Low-Medium | — | — | 4–8h per qualifying phase (×3 phases) | 12–24h |
| WP-12 Documentation Updates | Low | 4–8h (distributed) | 2–3h (Tiger) | — | 6–11h |
| **Total (excluding WP-8, WP-9)** | | | | | **~93–169h**, or **~70–110h** using each row's midpoint rather than its upper bound |

**Phase-level rollup (midpoint estimates):** Phase 0 ≈ 4h · Phase 1 ≈ 26h · Phase 2 ≈ 35h · Phase 3 ≈ 20h · Phase 5 (WP-10/11/12 only) ≈ 26h. Phase 4 (WP-8) and the continuous WP-9 track are excluded from this rollup for the reasons stated above.

---

## 10. Release Execution Plan

| Step | Content | Gate |
| --- | --- | --- |
| Milestone 1 | Phase 0 complete: Steward named, gate-mode decided, operational-layer form decided | Tiger/Vivek sign-off on Open Decisions OD-1, OD-2, OD-4 |
| Milestone 2 | Phase 1 complete: 4-destination resolution recorded and (where advanced) authored in the operational layer; workbook version-controlled | Archie spot-check of workbook structure; Keerthi spot-check |
| Review gate | Generation report reviewed for any *new* reconciliation/vocabulary finding beyond today's known four-destination gap | Tiger, per WP-4's promotion-review step |
| Milestone 3 | Phase 2 complete: reconciliation check live (warn-mode), vocabulary reachability visible in generation report | Rad self-verification + Archie review |
| Milestone 4 | Phase 3 complete: `dataQuality` reflects real coverage, cross-reference check live | Archie review (per Change Authority Matrix, ADR §9 — engine/adapter-adjacent changes) |
| Documentation checkpoint | `RELEASE-1.2.md` Workstream 3 section and Decision Log updated to reflect Phases 0–3, following the `R1.2-015` pattern | Tiger |
| Review gate | Explicit go/no-go on Phase 4 start, confirming Phases 1–3 are "substantially complete" per this plan's central recommendation | Tiger, informed by this document |
| Milestone 5 | Phase 4 complete: `R1.2-03.07`–`03.12` delivered under their own existing acceptance criteria | Archie's required architecture approval (`R1.2-03.11`), Keerthi's `R1.2-03.12` validation |
| Milestone 6 | Phase 5 complete: full regression pass, destination-intelligence QA (both passes), Sri's traveller-experience validation for any newly-recommendable/enriched destination | Keerthi, Sri |
| Documentation checkpoint | ADR Decision History and `RELEASE-1.2.md` fully reconciled (WP-12 final consolidation, including the standing task-numbering fix from Section 0.1) | Tiger |
| Release decision | Project Owner decision: accept, rework, defer, or accept known residual risk | Vivek |

This sequence aligns with, and does not duplicate, the existing Project Instructions Section 12 Standard Delivery Lifecycle — each milestone above maps to that lifecycle's existing Stage 5 (Approved EBC) through Stage 11 (Project Owner Decision) for each phase's constituent work.

---

## 11. Deferred Scope Register

| Item | Rationale for deferral |
| --- | --- |
| Release 1.3 destination-granularity expansion (Karnataka → Coorg/Mysore/Chikmagalur/Bengaluru; Kerala → finer regions; Rajasthan → finer regions) | Explicitly out of scope for this EBC and for Release 1.2 generally; both the ADR (§14) and Archie's architecture document (§12) already assessed this and found no structural redesign required — the governance model this plan implements is a *precondition* for R1.3, not part of it |
| Option B — replacing the operational-layer workbook with a structured, version-controlled data format authored directly against the KB schema | Both architecture documents recommend evaluating this at the Knowledge Base's own Release 2 "Operational depth" milestone (KB §15.7), not now; WP-1/WP-3 implement Option A (KB-derived workbook) in the interim |
| Full CI/CD pipeline build-out beyond the single WP-7 check | This repository has no CI today (Section 0); building a complete pipeline is a larger undertaking than this workstream's scope calls for — WP-7 explicitly scopes only the one new check, with the larger question left as Open Decision OD-6 |
| Retirement of `compatibility-matrix.json`'s unused `EmotionalGoal`/`DesiredExperience` categories (RC-7) | Named by both audits and the ADR (§15 Decision 9) as low-priority (P3) and orthogonal to the four-destination gap and vocabulary-reachability work this plan prioritises; safe to defer to a future, smaller EBC without blocking anything in Phases 0–5 |
| Accessibility as a governed destination attribute | The Knowledge Base itself already defers this to a future release (KB §7.5, "Future operational fields") — this plan does not pull it forward, consistent with Arjun's `R1.2-03.01` review's own finding that this is a deliberate KB deferral, not an oversight |
| Reconciling the Traveller Intent Framework's homepage vocabulary against the KB's Emotional Library | Arjun's review (§6.5/§8) frames this as documentation housekeeping tied to whether the Traveller Intent Framework is ever implemented on the live homepage — not currently scheduled, and independent of the runtime governance work this plan covers |
| A `confidenceNote` copy variant aware of `hasMaterialContentGap` (Sophie's Opportunity 3) | Sophie's own review frames this explicitly as an opportunity, not a recommendation to build now, and it is a Sophie-owned UX/copy work package requiring its own EBC, not an engineering-implementation item this Rad-owned plan should absorb |
| Northeast collection member-level public exposure to match Wildlife's (Arjun §6.2 / Open Question 3) | A Product/Sophie IA decision, not an engineering implementation item; unrelated to this plan's governance/reconciliation scope and can proceed independently on its own timeline |

---

## 12. Open Decisions

Consolidated from all six mandatory inputs; grouped by primary decision-owner. **This plan does not resolve any of these.**

### Decisions for Vivek (Business Owner)
- **OD-1.** Resolution of Amritsar, Assam, Corbett, and Darjeeling specifically — advance each toward Operationally Authored, or explicitly hold at Approved with a stated reason and review date (ADR §15 Decision 3; WP-2's direct input).
- **OD-2.** Interim public-card treatment for any destination held below Runtime Ready — withdraw, annotate, or accept as a deliberate "browse-only" state (ADR §15 Decision 5; directly answers `R1.2-03.03` Open Question 6).
- **OD-4.** Traveller Type vocabulary scope — formalise at 5 (current runtime state) or extend toward the KB's approved 9 (ADR §15 Decision 4; WP-5's central input).

### Decisions for Tiger (Programme & Delivery Lead)
- **OD-5.** Sequencing of Phase 4 (`R1.2-03.07` onward) relative to Phases 0–3's completion — this plan recommends "substantially complete," consistent with every prior WS3 document; Tiger makes the final call on what "substantially complete" means in practice (ADR §15 Decision 6).
- **OD-3.** Whether Work Package 9 (content-readiness enrichment) should follow Phase 4's weighting decisions (Arjun's original recommendation, avoiding wasted effort on later-deprioritised destinations) or proceed in parallel from Phase 1 (Sophie's/the ADR's leaning, given content-readiness has 0–10% weight in candidate selection today and the gap is already live). This plan surfaces both positions without resolving them.
- **OD-7.** The standing `R1.2-03.0x` task-numbering reconciliation (Section 0.1), and whether Arjun's/Sophie's `R1.2-03.01` reports should be filed into `docs/09-Development/` to match the ADR's own citations — proposed as WP-12's first item, pending Tiger's confirmation.

### Decisions for Archie (Technical Architect)
- **OD-6.** Whether WP-7's public/runtime cross-reference check is delivered as a local `verify:*` script only, or is the occasion to stand up this repository's first CI pipeline — a materially larger decision than the check itself, given no `.github/` directory exists today (Section 0).
- **OD-8.** Confirmation that `evaluateEligibility.ts`'s existing gates key off `dataQuality === "INCOMPLETE"`/`"STALE"` specifically (not an implicit assumption about `"COMPLETE"`), before WP-6 introduces any new intermediate `dataQuality` value — flagged in Section 7's risk register as a design constraint requiring Archie's confirmation before WP-6 implementation begins.

### Decisions requiring joint input (Archie + Tiger + Vivek)
- **OD-9.** Warn-mode vs. block-mode for the KB-to-Operational Reconciliation Check at launch (ADR §15 Decision 2) — this plan and every architecture document recommend warn-mode first; formal confirmation still required.
- **OD-10.** Operational layer's near-term form — Option A (KB-derived workbook, this plan's assumption throughout Phase 1) vs. accelerating directly to Option B (structured format) — ADR §13.2/§15 Decision 7 frames this as a recommendation, not a settled decision.

### Decisions for Arjun (Product & Business Analyst)
- **OD-11.** Whether the traveller-facing `confidenceNote` should ever acknowledge a content-readiness gap, or remain a purely internal, selection-only concern (Sophie's `R1.2-03.01` review, Open Question 2) — relevant to WP-9's eventual scope but not blocking any work package in this plan.

### Decisions for Keerthi (Functional Validation Specialist)
- **OD-12.** Confirm the destination-intelligence QA test-scenario set proposed in WP-10 (Section 3) is sufficient, or identify additional scenarios, before Phase 3's QA pass begins — a scope-confirmation input, not a blocking decision for earlier phases.

---

## 13. Implementation Readiness Assessment

- **Work packages fully decomposed:** Yes — 12 work packages (Section 3), each with a stated objective, scope, and explicit out-of-scope boundary, traceable to a specific ADR section, Archie recommendation, or Rad audit finding.
- **Dependencies and sequencing identified:** Yes — Section 4's matrix states predecessor/successor/blocking status and parallel opportunities for every work package; Section 6 restates this as a phase diagram; the one hard, workstream-wide gate (Phase 4 behind Phases 1–3) is stated once and referenced consistently rather than repeated with variation.
- **Risks and mitigation strategies documented:** Yes — Section 7, phase-tagged, with severity and rollback considerations for each; risks are drawn from evidence already gathered (both Rad audits, the ADR's own Risks & Trade-offs section) rather than newly speculated.
- **Testing and validation approaches defined:** Yes — Section 8, covering all six categories this EBC's brief requested, with persona participation stated per stage per Project Instructions Section 31's reporting model.
- **Effort estimates provided:** Yes, with assumptions and exclusions explicitly stated (Section 9) rather than silently omitted — WP-8 and WP-9's content-authoring effort are named as out of this plan's estimation competence, not glossed over.
- **Deferred scope explicitly identified:** Yes — Section 11, each item with a stated rationale traceable to an existing document (the ADR, Archie's review, or the KB's own roadmap) rather than an unexplained exclusion.
- **Plan enables implementation to begin without further planning activities:** **Substantially yes, with one qualification.** Phase 0 (WP-1) can begin immediately — it requires no further technical discovery, only the decisions this section and Section 12 name. Phases 1 onward require Open Decisions OD-1, OD-2, OD-4, OD-9, and OD-10 to be made first; this plan's contribution is that every one of those decisions is now stated precisely enough, with the work package it unblocks named explicitly, that no further investigation is needed to make them — consistent with every one of the six prerequisite documents' own closing claim that Tiger and Vivek already have what they need to decide.

**Overall verdict: 🟢 Ready for Tiger/Vivek to authorise Phase 0, and to resolve the Section 12 Open Decisions that gate Phases 1 onward.** No additional technical investigation is recommended before that authorisation — the two Rad audits, Arjun's and Sophie's reviews, and Archie's architecture document already constitute the evidence base this plan was built from, and this document has not identified any gap in that evidence base requiring a further investigative EBC.

---

## Acceptance Criteria Mapping

| Acceptance Criterion | Status | Evidence |
| --- | --- | --- |
| All implementation work is decomposed into logical work packages | Met | Section 3 — 12 work packages |
| Dependencies and sequencing are clearly identified | Met | Section 4 (matrix), Section 6 (phase diagram) |
| Risks and mitigation strategies are documented | Met | Section 7 — phase-tagged, severity-rated |
| Testing and validation approaches are defined | Met | Section 8 — all six requested categories, persona participation stated |
| Effort estimates are provided | Met | Section 9 — task- and phase-level, assumptions and exclusions stated |
| Deferred scope is explicitly identified | Met | Section 11 — 8 items, each with rationale |
| The plan enables implementation to begin without requiring further planning activities | Believed met, with the qualification stated in Section 13 — Phase 0 is immediately actionable; later phases are blocked only by named business/architecture decisions (Section 12), not by any missing technical analysis |
