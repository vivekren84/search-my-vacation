# ADR-R1.2-WS3-001 — Destination Knowledge Governance

```text
Document Type : Architecture Decision Record
Decision ID   : ADR-R1.2-WS3-001
Title         : Destination Knowledge Governance
Status        : Accepted
Release       : Release 1.2
Workstream    : WS3 – Destination Intelligence
Owner         : Archie
Reviewer      : Tiger
Business Owner: Vivek
Effective Date: 17-Aug-2026
Supersedes    : None
Superseded By : —
```

## Document Information

| Field | Value |
| --- | --- |
| ADR ID | ADR-R1.2-WS3-001 |
| Title | Destination Knowledge Governance |
| Status | **Accepted** (ratified 17 August 2026 — see Decision History) |
| Type | Architecture Decision Record (permanent, repository-level) |
| Owner | Archie — Technical Architect |
| Reviewer | Tiger — Programme and Delivery Lead |
| Business Approver | Vivek — Product Owner |
| Originating EBC | `ADR-R1.2-WS3-EBC-ARCHIE-001` (this document's authoring EBC); architecture itself originates from `R1.2-03.04-EBC-ARCHIE`; finalised to Accepted status under `ADR-R1.2-WS3-EBC-ARCHIE-002` |
| Applies to | Destination Intelligence: the Destination Knowledge Base, the Journey Intelligence generation pipeline, the Journey Director runtime catalogue, and all public/presentation surfaces that reference destination data |
| Supersedes | None — first ADR for this domain |
| Superseded by | None |
| Location | `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` |
| Effective date | 17 August 2026 |
| Date created | 17 August 2026 |
| Last updated | 17 August 2026 (status finalised to Accepted, `ADR-R1.2-WS3-EBC-ARCHIE-002`) |

---

## 1. Purpose

This ADR is the permanent, repository-level architecture record for how Destination Intelligence is governed at Search My Vacation — how destination knowledge is authored, approved, generated, synchronised, and consumed from the Knowledge Base through to the traveller-facing Journey Director experience.

It exists so that:

- future implementation work on Destination Intelligence (Workstream 3's `R1.2-03.07` onward, and all subsequent releases) has a single architectural prerequisite to build against, rather than needing to reconstruct the reasoning behind it from a chain of investigation reports;
- every artefact involved in destination knowledge has one named owner and one named change-approval authority;
- the reasoning that produced these decisions is preserved and traceable, not re-derived by each future reader.

This document formalises, and does not revise, the architecture reviewed and agreed during Release 1.2 Workstream 3 (`R1.2-03.04-EBC-ARCHIE`, "Destination Knowledge Governance Architecture"). No new architectural decision, principle, or reinterpretation of prior findings is introduced here.

---

## 2. Context

Search My Vacation's Journey Director recommends destinations to travellers based on a deterministic decision engine. The knowledge that engine reasons over — which destinations exist, their emotional and thematic character, and the controlled vocabulary that connects traveller intent to a recommendation — originates in `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` (the Knowledge Base, KB), the approved business source of destination philosophy, portfolio, and recommendation rules.

Between that business document and the traveller-facing recommendation sits a generation pipeline (an Excel workbook, a deterministic generator, and a set of versioned JSON artefacts) and a runtime consumption layer (a typed candidate catalogue, the deterministic engine, a presentation adapter, and the Journey Director UI). Release 1.2 Workstream 3 — Destination Intelligence — was established to strengthen this chain ahead of a planned weighted Primary/Secondary/Tertiary recommendation model (`DEC-R1.2-010`).

Five investigations were completed as part of Workstream 3 before this ADR was written (Section 5). Independently and convergently, they found that the Knowledge Base — while sound and well-governed as a document — is not, in practice, the runtime's source of truth. This ADR is the architectural response to that finding.

---

## 3. Problem Statement

Destination knowledge is currently maintained across **three independently evolving systems**, with no code path or mechanical process connecting them:

1. **The Knowledge Base** (`DESTINATION-KNOWLEDGE-BASE.md`) — business-approved, versioned, internally governed (KB §15), but read by no code in this repository.
2. **A seed/enriched workbook pipeline** — an un-versioned seed workbook (not present in the repository) enriched into a derived workbook that its own governing report states "should not be integrated into production," which nonetheless is the sole input the generator reads, producing the checksummed, deterministic `web/generated/*.json` artefacts.
3. **Hand-authored TypeScript constants** — vocabulary label-mapping tables, a confidence allowlist, and independently maintained public destination cards, none of which reference the Knowledge Base or the generated data.

The measured consequence: four Knowledge-Base-approved, publicly marketed destinations (Amritsar, Assam, Corbett, Darjeeling) cannot be recommended by Journey Director under any traveller profile; four of the KB's nine approved Traveller Types, and roughly half of its approved Emotion and Theme vocabulary, can never reach a generated candidate despite the runtime's type system matching the Knowledge Base almost exactly. None of this is caused by defective engineering — every mechanism inspected during the two engineering audits behaves exactly as its code reads. The gap is upstream: nothing in the repository keeps these three systems reconciled, and nothing makes a divergence between them visible without a manual audit.

This is a governance problem, not an implementation defect, and it is the problem this ADR's architecture addresses.

---

## 4. Evidence Reviewed

All five Workstream 3 deliverables were reviewed in full before this ADR was written; none is re-derived here.

| Report | Author | Contribution |
| --- | --- | --- |
| `EBC-R1.2-03.01-ARJUN-Destination-Intelligence-Analysis.md` | Arjun | Confirmed the Knowledge Base is a mature, approved, sound business framework; identified the content-readiness gap across 19 of 24 destinations |
| `EBC-R1.2-03.01-EBC-SOPHIE-Traveller-Experience-Validation-Destination-Intelligence.md` | Sophie | Confirmed content readiness has near-zero influence on which candidate a traveller actually sees first |
| `EBC-R1.2-03.02-RAD-Destination-Knowledge-Base-Synchronisation-Audit.md` | Rad | First engineering-level trace: identified the three-system drift, the Amritsar/Assam/Corbett/Darjeeling gap, and the 5-of-9 Traveller Type vocabulary gap, with full evidence and a Drift Classification Register |
| `EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md` | Rad | Code-level root-cause trace to two exact mechanisms (`generateJourneyDNA.ts:112-113`'s inclusion filter; `release1Candidates.ts:58-96`'s vocabulary label maps); quantified the Emotion/Theme reachability gap (10/17, 17/36) |
| `EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md` | Archie | The target-state architecture this ADR formalises: five-layer model, source-of-truth model, ownership matrix, synchronisation model, vocabulary governance, destination lifecycle, R1.3 readiness assessment |

Full evidence citations (file paths, line numbers, record counts) live in the two Rad reports and are summarised in Appendix A rather than reproduced here.

---

## 5. Architectural Principles

1. **Single Business Source of Truth.** The Knowledge Base is canonical for what SMV is prepared to promise a traveller. No downstream artefact introduces a destination, region, or vocabulary value the KB has not approved, and none silently narrows what the KB approves without a recorded, owned exception.
2. **Generated, Not Duplicated.** Every runtime artefact should be mechanically derivable from the KB plus the operational layer. Hand-authored constants that encode business knowledge in parallel with a generated equivalent are a governance liability and should shrink over time, not grow.
3. **Explicit Over Silent.** Every divergence from the KB — an excluded destination, an unreachable vocabulary term, a downgraded status — must be visible, owned, and dated.
4. **Preserve What Works.** The deterministic engine, the Recommendation Adapter boundary, and the atomic/checksummed generation pipeline are sound and out of scope for redesign. Governance attaches at layer boundaries, never inside an already-verified one.
5. **Owner-Traceable Change.** Every artefact has exactly one accountable owner and one change-approval authority (Sections 8–9).
6. **Existing Business Guardrails Are Preserved.** This architecture governs destination *knowledge*. It does not alter the served-destination guardrail established under `DEC-R1.2-004` (R1.1 `DEC-010`) — Journey Director remains solely responsible for validating whether a specific enquiry is actually serviceable.

---

## 6. Layered Architecture

```text
1. BUSINESS LAYER            Knowledge Base — destination existence/status,
                              controlled vocabulary, recommendation rules,
                              narrative standards. Unchanged; already governed
                              (KB §15).
        │  KB-to-Operational Reconciliation Check
        ▼
2. OPERATIONAL LAYER         Seed/enriched workbook (or successor) — the
                              generation-ready authoring surface. Row set and
                              taxonomy sheets MUST be KB-derived, not
                              independently authored. Version-controlled.
        │  validateWorkbook.ts + KB-reconciliation + vocabulary-coverage checks
        ▼
3. GENERATION LAYER          web/scripts/journey-intelligence/* →
                              web/generated/*.json. Mechanics unchanged
                              (deterministic, checksummed, atomic, versioned).
        │  loadRuntimeIntelligence.ts (unchanged, fail-closed)
        ▼
4. RUNTIME LAYER             release1Candidates.ts + deterministic engine +
                              Recommendation Adapter + Journey Director UI.
                              Contracts and boundary unchanged.
        │  Public/runtime cross-reference check (non-blocking)
        ▼
5. CONSUMPTION LAYER         Public destination cards, imagery, presentation
                              "moments", Journey Director UI. Publication
                              requires a recorded lifecycle stage (Section 12).
```

| Layer | Owns | Must not own |
| --- | --- | --- |
| Business | Destination/region existence, status, controlled vocabulary, recommendation rules, narrative standards | Generation mechanics, runtime data structures, presentation assets |
| Operational | A KB-derived, generation-ready authoring surface | Business approval authority, runtime consumption, presentation content |
| Generation | Deterministic, checksummed, versioned transformation into runtime JSON | Business decisions about inclusion; vocabulary invention beyond the operational layer |
| Runtime | Candidate pool construction, deterministic eligibility/scoring/ranking, presentation adaptation | Re-deciding destination inclusion; overriding KB status |
| Consumption | Public browse content, imagery, presentation "moments", UI rendering | Recommendation eligibility, scoring, or any implication that browse availability implies recommend-ability |

---

## 7. Source of Truth Model

| Governed concern | Single source of truth | Explicitly not a source of truth |
| --- | --- | --- |
| Destination/region existence and status | Knowledge Base §10/§11, per §7.2/§15.1 | Workbook `Journey Base Status`; `public-destinations.config.ts` |
| Controlled vocabulary definitions | Knowledge Base §8 | Workbook taxonomy sheets; `engine.types.ts`; hand-authored label maps |
| Recommendation rules, narrative standards | Knowledge Base §13/§14 | — (no drift found here by any prior review) |
| Which KB-approved destinations/regions are generation-ready | Operational layer, seeded from the KB list | Independently authored seed-workbook rows |
| Generated matching facts | `web/generated/*.json`, produced only from the operational layer | Hand-maintained duplicates elsewhere |
| Runtime candidate pool | `release1Candidates.ts`, built exclusively from `journey-dna.json` (unchanged, already correct) | Any other file listing destinations for recommendation purposes |
| `COMING_SOON` exclusions | `release1ExcludedPortfolio` (unchanged, already correct) | — |
| `CONFIDENT` vs `SUPPORTED` operational confidence | An Operations-owned, dated decision record | An unlabelled TS constant with no visible approval trail |
| Public browse content | `public-destinations.config.ts`, referencing the destination's lifecycle stage | Standalone, unreferenced existence (today's state) |
| Presentation "moments", imagery, CTA copy | `journey-director.config.ts` presentation catalogue, `destination-images.config.ts` (unchanged, already correctly separated) | — |

---

## 8. Artefact Ownership Matrix

Consolidates ownership already defined in `DESTINATION-KNOWLEDGE-BASE.md` §15.1 and `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §13 (referenced, not duplicated) and names the one artefact neither document currently covers.

| Artefact | Owner | Purpose | Consumers |
| --- | --- | --- | --- |
| `DESTINATION-KNOWLEDGE-BASE.md` | Product & Experience, with Operations approval (KB §15.1) | Business source of truth | Everything downstream, in principle |
| Seed/operational workbook | **Destination Operational Steward** — role not currently assigned to any Team Satvi persona (Section 15, Outstanding Decision 1) | Generation-ready authoring surface, KB-derived | Generation Layer only |
| Generator (`web/scripts/journey-intelligence/*`) | Engineering (Rad) | Deterministic transformation to runtime JSON | `web/generated/*.json` |
| `web/generated/*.json` | Engineering (generated artefact, never hand-edited) | Runtime matching facts | `loadRuntimeIntelligence.ts` |
| Runtime catalogue (`release1Candidates.ts`, `catalogue.mappings.ts`) | Engineering, with Operations approval for confidence tier (Runtime Catalogue §13) | Typed candidate pool | Deterministic engine |
| Deterministic engine, Recommendation Adapter | Engineering (Architecture Checkpoint, EBC-003C) | Eligibility, scoring, ranking, presentation translation | Journey Director UI |
| `public-destinations.config.ts`, `destination-images.config.ts` | Content & Experience | Public browse content | `/destinations` page only |
| `journey-director.config.ts` presentation catalogue | Content & Experience (copy) / Engineering (contract) | Presentation-only "moments", CTA | Recommendation Adapter, presentation only |

---

## 9. Change Authority Matrix

Ownership (Section 8) is who maintains an artefact day to day. Change authority is who must approve a material change to it before it takes effect.

| Change type | Approval required from | Basis |
| --- | --- | --- |
| Destination/region status change (KB) | Product & Experience, with Operations approval | KB §12.2 Activation Checklist, §15.1 (unchanged) |
| Controlled vocabulary addition or change | Product & Experience (product-owner approval) | KB §8 preamble (unchanged) |
| Operational layer row-set change (add/remove a destination's operational record) | Destination Operational Steward, subordinate to an existing KB-approved status | New — Section 6, Operational Layer |
| Generator default source path / promotion of a new generated package | Engineering executes; Product & Experience approval required when the change alters destination inclusion or vocabulary reach (not required for routine content refresh) | New — Section 11 |
| Runtime catalogue confidence tier (`CONFIDENT` vs `SUPPORTED`) | Operations | Runtime Catalogue §13 (unchanged) |
| Engine, adapter, or scoring-logic changes | Archie's architecture review and explicit approval, per Project Instructions Section 5 | Existing project rule — e.g. `DEC-R1.2-010`'s weighted model requires this before `R1.2-03.07`–`03.12` |
| Public destination card published ahead of "Runtime Ready" lifecycle stage | Vivek (explicit, recorded product decision) | New — Section 12 |
| This ADR's own architectural content | Archie proposes; Tiger reviews; Vivek ratifies | Project Instructions Section 10 |

---

## 10. Synchronisation Principles

| Transition | Trigger | Validation | Failure handling | Review gate |
| --- | --- | --- | --- | --- |
| KB → Operational layer | Approved KB change (KB §15.3 change control) | **New:** KB-to-Operational Reconciliation Check — every KB `ACTIVE` destination/region has an operational-layer row, or a dated, owned exception | Warn-mode initially (Section 15) — a named, non-suppressible finding distinct from today's unacted-upon warnings | Before next generation run is treated as promotable |
| Operational layer → Generated JSON | Explicit generator invocation | Existing `validateWorkbook.ts` (unchanged) + new KB-reconciliation + vocabulary-coverage checks | Existing atomic rollback-on-failure (unchanged) | Generation report reviewed before promotion (new named step) |
| Generated JSON → Runtime catalogue | Build | Existing fail-closed integrity verification (unchanged) | Existing `RuntimeIntelligenceIntegrityError` (unchanged) | Existing `verify:journey-catalogue`, extended with KB-reconciliation assertion |
| Runtime catalogue → Consumption layer | Change to public config or candidate pool | **New:** lightweight, non-blocking cross-reference check | Flag only — a deliberate browse-only state is legitimate if visible (Section 12) | CI/PR-time lint or equivalent |

Routine, non-structural content refresh (a typo fix, a seasonal-guidance update for an already-included destination) is not subject to these new gates. They activate specifically when a change would add, remove, or restructure a destination's inclusion, or the vocabulary it can draw on.

---

## 11. Controlled Vocabulary Governance

| Vocabulary | Owner | How additions occur | How runtime stays synchronised |
| --- | --- | --- | --- |
| Emotions (17), Themes (36), Comfort (3), Pace (4), Traveller Types (9) | Product & Experience (KB §8, unchanged) | KB change-control process (§15.3) | Operational-layer taxonomy sheets validated at generation time against the KB list; a gap is recorded as either an **Approved Release Scope Reduction** (a recorded product decision to launch with a named subset) or a **Pending Extension** (an open, owned backlog item) — never a silent cap |
| Runtime reachability (a value in the type system that no generated candidate can ever produce) | Not currently tracked | **New:** a "vocabulary reachability" section added to the existing generation report | Makes visible, mechanically, what previously required a manual audit to find (as both Rad audits had to perform) |

The existing hand-authored label-mapping tables (`EMOTION_BY_LABEL`, `THEMES_BY_LABEL`, the implied `TRAVELLER_BY_LABEL`) should, in the target state, be generated from a KB-validated operational layer rather than remaining hand-maintained TypeScript reflecting whatever the workbook happened to define at the time the table was last edited. The translation task itself — mapping free-text workbook labels onto controlled IDs — remains legitimate; only its *source of scope* changes.

---

## 12. Destination Lifecycle

Extends the Knowledge Base's existing Activation Checklist discipline (KB §12.2, which governs `COMING_SOON` → `ACTIVE`) one stage further downstream, to where the measured gap actually lives.

| Stage | Definition | Owner to advance |
| --- | --- | --- |
| Proposed | A destination or region is suggested for the portfolio | Product & Experience |
| Approved (KB Active) | KB §10/§11 lists it `ACTIVE` with a full record | Product & Experience, with Operations approval (KB §12.2) |
| Operationally Authored | Operational layer has a corresponding row (any `journeyBaseStatus`) — the KB-reconciliation gate passes | Destination Operational Steward |
| Runtime Ready | Row survives generation, has a generated candidate | Engineering (mechanical outcome) |
| Presentation Ready | Curated "moments" + confidence-approved imagery beyond the generic fallback | Content & Experience, Operations |
| Released | Public card + Runtime Ready + (optionally) Presentation Ready, all consistent | Tiger consolidates; Vivek releases |
| Deprecated | KB status moves to `INACTIVE` (KB §7.2, unchanged) | Product & Experience |

The "Operationally Authored" stage is the governance addition of consequence: it is the exact, previously unnamed state that explains Amritsar, Assam, Corbett, and Darjeeling's actual condition today (Approved but never reaching this stage), and gives a place to make that condition a visible, recorded decision rather than a silent gap discoverable only by audit.

---

## 13. Release Governance Workflow

Attaches to the existing EBC lifecycle (Project Instructions Section 12) rather than introducing a parallel process:

1. **Feature development** (Rad, per an approved EBC) — unchanged.
2. **Business approval** (Arjun/Vivek confirm KB alignment) — now explicitly includes confirming the KB-to-Operational Reconciliation Check passes for the affected destinations.
3. **QA** (Keerthi) — destination-intelligence functional QA should verify a KB-approved destination is actually recommendable end-to-end, not only that KB documentation is internally consistent.
4. **Release readiness** (Tiger) — the reconciliation check's pass/fail state is a standing input to Workstream 3 status reporting, alongside existing gating dependencies (e.g. `RISK-R1.2-011`'s gate on `R1.2-03.11`/`03.12`).
5. **Documentation alignment** — unchanged; this workstream has an established pattern for this (`R1.2-015`).

**Sequencing implication for Workstream 3:** both Rad audits recommended resolving the synchronisation gap before `R1.2-03.07` onward (the weighted preference model, `DEC-R1.2-010`) begins, since that work builds directly on `release1JourneyCandidates` and would otherwise encode today's gaps into the scoring logic itself. This ADR concurs on evidence grounds. The final sequencing decision belongs to Tiger.

---

## 14. Future Readiness — Release 1.3 Destination Granularity

Assessed against the planned expansion (Karnataka → Coorg, Mysore, Chikmagalur, Bengaluru; Kerala → Munnar, Kochi, Kumarakom, Thekkady; Rajasthan → Jaipur, Udaipur, Jaisalmer, etc.):

**No structural redesign is required.** The KB's region record schema (§7.4) already models this shape — these places already exist today as governed region records under their parent destinations. The generator already treats a destination as a container of multiple regions (89 regions under 22 destinations today), and the engine and candidate builder are already region-aware.

What R1.3 needs as an explicit go-forward decision, not an architecture blocker: whether a newly-granular place becomes its own top-level destination or remains a region within an existing one — a product/KB decision the existing Destination-vs-Collection vocabulary (KB §7.3) already supports.

**The governance model in this ADR becomes more valuable, not less, at higher region counts.** Manual KB-to-runtime reconciliation is already imperfect at 89 regions; it will not scale by manual diligence alone to a materially larger R1.3 catalogue. This is an argument for adopting this ADR's governance model before R1.3 begins, not for deferring it.

---

## 15. Outstanding Product Decisions

These require Tiger/Vivek decision and are not resolved by this ADR:

1. **Destination Operational Steward** — no current Team Satvi persona owns this role today; it is the single most consequential ownership gap this architecture identifies.
2. **Warn-mode vs. block-mode** for the KB-to-Operational Reconciliation Check at launch — this ADR recommends warn-mode first, escalating to block-on-*new*-gaps once the existing four-destination register is resolved or explicitly deferred.
3. **Resolution of Amritsar, Assam, Corbett, and Darjeeling** specifically — mechanism is a product/operational decision; this ADR requires only that the resolution be visible, dated, and owned (via the lifecycle model, Section 12).
4. **Traveller Type vocabulary scope** — formalise at 5 (current runtime state) or extend toward the KB's approved 9.
5. **Interim public-card treatment** for destinations not yet Runtime Ready — withdraw, annotate, or accept as a deliberate "browse-only" lifecycle state.
6. **Sequencing of `R1.2-03.07` onward** relative to the reconciliation gate's implementation — this ADR recommends the gate exist first; Tiger makes the final call.
7. **Operational layer's long-term form** — retain the workbook as a KB-derived authoring surface (near-term), or replace it with a structured, version-controlled data format authored directly against the KB schema (evaluate at the KB's own Release 2 "Operational depth" milestone, KB §15.7).
8. **Seed workbook recovery** — locate, version, or reconstruct `Journey Director Intelligence Input-2.xlsx`, currently a single point of failure on one author's local machine.
9. **Retirement or repurposing** of `compatibility-matrix.json`'s unused `EmotionalGoal`/`DesiredExperience` categories.
10. **Gir National Park and Ranthambore** — formalise their presence in the Wildlife runtime data as approved (Gir appears aligned with the already-planned `R1.2-03.13`) or hold back pending explicit KB scoping.

---

## 16. Risks & Trade-offs

| Item | Benefit | Risk | Trade-off |
| --- | --- | --- | --- |
| KB-to-Operational Reconciliation Check | Closes the Amritsar/Corbett/Darjeeling class of gap permanently and mechanically | Could block all generation if enabled fail-closed against today's already-known gaps | Warn-mode first, escalate later (Section 15, Decision 2) |
| Generated (not hand-capped) vocabulary mappings | Removes the silent vocabulary-narrowing pattern | Requires the operational layer's taxonomy sheets to actually grow toward the KB's full vocabulary — a content effort, not only engineering | Some values may remain genuinely unreachable absent real source content; the architecture makes the gap visible, it cannot manufacture content |
| Public/runtime cross-reference check | Cheap, catches future recurrence automatically | Minimal | None material |
| Version-controlling the seed/operational layer | Removes a standing single point of failure | Effort if the original file is genuinely unrecoverable | None material |
| Preserving the engine/adapter/UI boundary unchanged | Avoids destabilising an already-verified, deterministic boundary | None — deliberate scope constraint | Any future symptom rooted inside the engine itself (none found by either audit or this review) would need separate handling |

---

## 17. Decision History

| Date | Event | Actor |
| --- | --- | --- |
| 16 Aug 2026 | `R1.2-03.01` — Product analysis and traveller-experience validation confirm the Knowledge Base is sound and approved at the document level | Arjun, Sophie |
| 17 Aug 2026 | `R1.2-03.02` — Synchronisation audit identifies the three-system drift and the Amritsar/Assam/Corbett/Darjeeling gap | Rad |
| 17 Aug 2026 | `R1.2-03.03` — Source comparison and runtime trace locates the exact root-cause mechanisms and quantifies the vocabulary reachability gap | Rad |
| 17 Aug 2026 | `R1.2-03.04-EBC-ARCHIE` — Target-state governance architecture drafted | Archie |
| 17 Aug 2026 | This ADR created, formalising the above as a permanent governance document | Archie |
| 17 Aug 2026 | Workstream 3 Architecture & Product Review completed; this ADR formally approved by the Business Owner and the Architecture Reviewer. Status changed from **Proposed — ready for Product Owner ratification** to **Accepted**. No architectural principle, governance decision, or investigation finding was modified as part of this approval or its documentation finalisation (`ADR-R1.2-WS3-EBC-ARCHIE-002`) | Vivek (Business Owner, ratification), Tiger (Architecture Reviewer), Archie (documentation finalisation) |

This ADR is now **Accepted**, per the ratification recorded above. Future material changes to this architecture must be recorded as new rows in this table, not as silent edits to the sections above, and must be made through a new or explicitly superseding ADR rather than an edit to this one (Tiger's note, `ADR-R1.2-WS3-EBC-ARCHIE-002`) — this ADR should require no further edits unless superseded.

---

## Appendix A — Supporting Evidence

Full evidence lives in the source reports (Appendix B); this is a pointer summary, not a restatement.

- **Destination inventory drift** (`R1.2-03.02` §3, `R1.2-03.03` §2.2): 22 of 24 KB `ACTIVE` destinations have runtime candidate presence; Amritsar and Assam have zero standalone `destinationId`; Corbett and Darjeeling have zero rows in any generated artefact.
- **Root cause** (`R1.2-03.03` §7, Root Cause Register RC-1–RC-10): a single generator filter (`generateJourneyDNA.ts:112-113`, `journeyBaseStatus === "Yes"`) and two hand-authored label-mapping tables (`release1Candidates.ts:58-96`), both downstream of an un-versioned seed workbook never reconciled against the KB.
- **Controlled vocabulary reachability** (`R1.2-03.03` §2.3): Traveller Types 5/9 representable; Emotions 10/17 reachable despite 17/17 type-system match; Themes 17/36 reachable despite 36/36 type-system match.
- **Generation pipeline soundness** (`R1.2-03.02` §2, `R1.2-03.03` §5, `JOURNEY-INTELLIGENCE-GENERATOR.md`): deterministic, checksummed, atomic, versioned, rollback-safe; no defect classification in either audit.
- **Engine/adapter boundary soundness** (`JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md`): deterministic, typed, evidence-preserving, no demo fallback; not implicated in any drift finding.

## Appendix B — Referenced EBCs and Reports

- `docs/09-Development/EBC-R1.2-03.01-ARJUN-Destination-Intelligence-Analysis.md`
- `docs/09-Development/EBC-R1.2-03.01-EBC-SOPHIE-Traveller-Experience-Validation-Destination-Intelligence.md`
- `docs/09-Development/EBC-R1.2-03.02-RAD-Destination-Knowledge-Base-Synchronisation-Audit.md`
- `docs/09-Development/EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md`
- `docs/09-Development/EBC-R1.2-03.04-ARCHIE-Destination-Knowledge-Governance-Architecture.md`
- `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` (v1.0.1)
- `docs/09-Development/JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` (v1.1.0)
- `docs/09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md`, `docs/09-Development/EBC-003C-B-JOURNEY-INTELLIGENCE-GENERATOR.md`
- `docs/09-Development/JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md`
- `docs/10-Backlog/RELEASE-1.2.md` (Workstream 3, `DEC-R1.2-004`, `DEC-R1.2-010`, `RISK-R1.2-011`)

---

**End of document**
