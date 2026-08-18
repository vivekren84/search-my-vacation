# EBC R1.2-03.04-EBC-ARCHIE — Destination Knowledge Governance Architecture

**Persona:** Archie — Technical Architect
**Type:** Solution Architecture & Governance Design (architecture only — no source code, runtime configuration, generators, workbooks, documentation, datasets, or application logic modified)
**Workstream:** WS3 — Destination Intelligence | **Task:** R1.2-03.04
**Date:** 17 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session, Repository and Input Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`. Working tree unchanged by this exercise — confirmed clean except the same pre-existing untracked items every recent Workstream 3 EBC on this branch has noted (`_to_delete/`, an untracked WS2 doc, and the two prior WS3 Rad reports). None of these were touched.
- No repository files, code, configuration, workbooks, or documentation were created, modified, or deleted by this exercise. This document is the sole deliverable, matching this EBC's Explicit Constraints.
- **Mandatory inputs read in full:** `EBC-R1.2-03.01-ARJUN-Destination-Intelligence-Analysis.md`, `EBC-R1.2-03.01-EBC-SOPHIE-Traveller-Experience-Validation-Destination-Intelligence.md`, `EBC-R1.2-03.02-RAD-Destination-Knowledge-Base-Synchronisation-Audit.md`, `EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md`. All four are treated as settled evidence, not re-derived.
- **Primary repository sources inspected directly for this exercise:** `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` (v1.0.1, Sections 3–8, 12, 13, 15 read in full); `docs/09-Development/JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` (v1.1.0, read in full); `docs/09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md` and `docs/09-Development/EBC-003C-B-JOURNEY-INTELLIGENCE-GENERATOR.md` (generator design and governance); `docs/09-Development/JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md` (engine/presentation boundary); `docs/10-Backlog/RELEASE-1.2.md` (Workstream 3 task table, DEC-R1.2-004/010, RISK-R1.2-011); `docs/00-Project-Compass/COMPASS.md`; `web/lib/journey-director/catalogue/*.ts`, `web/lib/journey-director/intelligence/*.ts`, `web/config/journey-director.config.ts`, `web/config/public-destinations.config.ts`, `web/scripts/journey-intelligence/loadWorkbook.ts`, `web/scripts/journey-intelligence/validateWorkbook.ts`, `web/generated/intelligence-manifest.json` — cross-checked against, not re-tracing, the two Rad audits' file/line evidence.

## 0.1 Framing note — task-number mismatch, named per Project Instructions Section 35

`RELEASE-1.2.md` (v1.7) defines task `R1.2-03.04` as *"Define fallback behaviour for unmapped destinations"* (Owner: Archie, depends on 03.01, constraint: "must not produce a broken/dead link"). This EBC's actual brief — a full Destination Knowledge Governance Architecture — is materially broader than that tracker description, though it is Archie-owned in both cases and the fallback-behaviour question is, in fact, a direct subset of what this document addresses (see Section 9, Consumption Layer). This is the same pattern both prior WS3 Rad EBCs already named and escalated for `R1.2-03.02`/`R1.2-03.03`; this document repeats their recommendation that Tiger reconcile the `R1.2-03.0x` task numbering, scope and descriptions against what Workstream 3 has actually produced the next time `RELEASE-1.2.md` is updated, rather than have it silently resolved here.

---

## 1. Executive Summary

Three prior investigations — Arjun's product review, Sophie's traveller-experience review, and two Rad engineering audits — converge on one finding: the Destination Knowledge Base (`DESTINATION-KNOWLEDGE-BASE.md`, v1.0.1) is sound, approved, and well-governed **as a document**, but it is not, in practice, the runtime's source of truth. Today, three independently maintained systems each hold a different, partially overlapping slice of "what destinations Search My Vacation can talk about": the Knowledge Base itself (business-approved, but read by no code path); an un-versioned seed workbook and its derived, explicitly-not-production-approved "Enriched" copy (which the generator nonetheless treats as canonical); and a set of hand-authored TypeScript constants (label-mapping tables, a confidence allowlist, public destination cards) maintained by hand with no mechanical link back to either. The consequence is concrete and already live: four KB-approved, publicly marketed destinations (Amritsar, Assam, Corbett, Darjeeling) cannot be recommended under any traveller profile, and roughly half of the KB's approved Emotion/Theme vocabulary and four of its nine Traveller Types can never reach a generated candidate, despite the underlying type system matching the Knowledge Base almost exactly.

This architecture does not ask "which artefact is right." Each of the three existing systems is doing a legitimate, distinct job — business authority, generation input, and runtime/presentation encoding — and the engine, adapter and UI layers built on top of them (`web/lib/journey-director/engine/`, the Recommendation Adapter, the Journey Director UI) are genuinely well-designed: deterministic, checksummed, versioned, atomically generated, and cleanly separated from presentation. The governance gap sits entirely upstream of that boundary, in how destination *inclusion* and *vocabulary* travel — or fail to travel — from the Knowledge Base into the operational authoring layer that feeds generation.

This document defines a five-layer target-state architecture (Business, Operational, Generation, Runtime, Consumption), a source-of-truth model that assigns exactly one owning artefact to every governed concern, a synchronisation model that makes every transition between layers an explicit, validated, owned event rather than a manual hope, a controlled-vocabulary governance model that closes the reachability gap the two Rad audits measured precisely, and a destination lifecycle model that gives Amritsar/Corbett/Darjeeling's actual condition — *KB-approved but never operationally authored* — a named, visible stage instead of an undocumented absence. It assesses the proposed model against the planned Release 1.3 destination-granularity expansion and finds no structural redesign is required; if anything, the current ungoverned state would compound faster at higher region counts, making this the right time to close the gap rather than defer it.

No implementation, migration script, or workbook edit is proposed or authorised by this document. Tiger and Vivek have, per Section 13 below, sufficient evidence to make every governance decision this architecture surfaces without further technical discovery.

---

## 2. Current-State Architecture

### 2.1 The three unsynchronised systems

```text
                    ┌─────────────────────────────────────────┐
                    │   DESTINATION-KNOWLEDGE-BASE.md v1.0.1   │
                    │   (Business Layer — approved 22-Jul-26)  │
                    │   24 ACTIVE destinations, 9/17/36        │
                    │   controlled vocabulary, recommendation  │
                    │   rules, governance (§15)                │
                    └───────────────────┬───────────────────────┘
                                        │
                              NO CODE PATH READS THIS FILE
                          (influence happens only through a human
                           remembering to keep the two systems below
                           aligned with it — evidenced to have failed)
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                                                                │
        ▼                                                                ▼
┌───────────────────────────┐                        ┌──────────────────────────────────┐
│ Seed workbook              │                        │ Hand-authored TypeScript          │
│ Input-2.xlsx                │                        │ constants                         │
│ NOT in this repository      │                        │ (release1Candidates.ts,           │
│ (single point of failure,   │                        │  catalogue.mappings.ts,           │
│  one author's Downloads     │                        │  journey-director.config.ts,      │
│  folder, per Source         │                        │  destination-images.config.ts,    │
│  Register)                  │                        │  public-destinations.config.ts)   │
└──────────────┬──────────────┘                        │                                    │
               │ manual enrichment                      │ EMOTION_BY_LABEL, THEMES_BY_LABEL,│
               ▼                                        │ TRAVELLER_BY_LABEL,               │
┌───────────────────────────────┐                        │ CONFIDENT_APPROVAL_CANDIDATE_IDS, │
│ Enriched workbook              │                        │ 28 public destination cards        │
│ outputs/ebc-003c-a/            │                        │ (fully independent of KB/workbook) │
│ *.xlsx (tracked binary)         │                        └───────────────┬────────────────────┘
│ Its own governing report        │                                        │
│ says "should not be integrated │                                        │
│ into production" — generated    │                                        │
│ anyway, 8 days after KB          │                                        │
│ approval                        │                                        │
└──────────────┬──────────────────┘                                        │
               │ generateJourneyDNA.ts:112-113                              │
               │ filter: journeyBaseStatus === "Yes"                        │
               ▼                                                            │
┌───────────────────────────────┐                                          │
│ web/generated/*.json (8 files) │                                          │
│ Deterministic, checksummed,     │                                         │
│ versioned, atomically written   │                                         │
│ — well-engineered               │                                         │
└──────────────┬──────────────────┘                                        │
               │ loadRuntimeIntelligence.ts (build-time, fail-closed)       │
               ▼                                                            │
┌───────────────────────────────┐            ◄───────────────────────────────┘
│ release1Candidates.ts           │            label-mapping tables narrow
│ (runtime catalogue, 22          │            vocabulary further; 5-destination
│ candidates)                     │            confidence allowlist hand-set
└──────────────┬──────────────────┘
               ▼
┌───────────────────────────────┐
│ Deterministic Engine            │  well-designed, deterministic,
│ → Recommendation Adapter        │  evidence-preserving (Architecture
│ → Journey Director UI            │  Checkpoint, EBC-003C) — preserve as-is
└───────────────────────────────┘
```

### 2.2 What this produces, in evidence

Both Rad audits independently traced this to the same measured outcomes:

- **22 of 24** KB `ACTIVE` destinations have any runtime candidate presence; **Amritsar, Assam, Corbett and Darjeeling do not**, under any traveller profile, permanently. Three of the four already carry live, warmly-written public destination cards and approved hero imagery.
- **5 of 9** KB-approved Traveller Types are representable in the engine's type system (`engine.types.ts`) and in the generated data. Honeymoon, Multi-generation Family, Senior Travellers and Educational Group — all four named in KB destination-level "Best for" guidance — have no code path.
- **10 of 17** approved Emotions and **17 of 36** approved Themes match the engine's type system exactly, but only that many can ever be *assigned* to a generated candidate, because the operational workbook's own taxonomy sheets define only 11/15 labels and two small hand-authored constant tables (`EMOTION_BY_LABEL`, `THEMES_BY_LABEL`) can only translate what the workbook supplies.
- `public-destinations.config.ts` (28 public cards) has **zero code-level awareness** of runtime candidate availability — it is presentation content that predates and is fully decoupled from recommendation capability.
- The generation pipeline itself — `web/scripts/journey-intelligence/*`, `web/generated/*.json`, `loadRuntimeIntelligence.ts` — is deterministic, checksummed, versioned, atomically replaced with rollback-on-failure, and validated by a comprehensive verification suite (`verify:journey-*`). **No finding in either Rad audit classified any part of this mechanism as a bug** — every gap traces to unreconciled *inputs* to an otherwise correctly functioning pipeline, not to defective engineering.
- The engine/adapter/UI boundary above the catalogue (per `JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md`, EBC-003C) is a clean, typed, deterministic, evidence-preserving boundary that explicitly forbids demo fallbacks, rescoring at the presentation layer, and fabricated recommendations. This is sound architecture and is not implicated in any drift finding.

### 2.3 Root cause, precisely located

Both audits trace the divergence to two specific, narrow mechanisms, not a systemic defect across the codebase:

1. **Inclusion**: a single filter, `web/scripts/journey-intelligence/generateJourneyDNA.ts:112-113`, `.filter((record) => record.journeyBaseStatus === "Yes")`. Everything downstream sees only what survives this one line. The filter itself is sound engineering; the problem is that *what feeds it* (the seed/enriched workbook's row set) was authored independently of, and has never been reconciled against, the KB's approved destination/region list.
2. **Vocabulary**: two small hand-authored label-mapping tables, `EMOTION_BY_LABEL`/`THEMES_BY_LABEL` (`release1Candidates.ts:58-88`), plus the `TravellerType` union itself (`engine.types.ts:65-70`), each scoped to whatever the workbook happened to define when they were written, never extended as the KB's fuller vocabulary was separately approved.

Both mechanisms sit downstream of the same un-versioned seed workbook, and neither has ever been checked against `DESTINATION-KNOWLEDGE-BASE.md` by any process this repository contains.

---

## 3. Target-State Architecture

The target state does not replace any of the three existing systems. It gives each an explicit, bounded responsibility, closes the two root-cause gaps above with named validation gates, and leaves the well-engineered generation and runtime mechanics untouched.

```text
┌──────────────────────────────────────────────────────────────────┐
│ 1. BUSINESS LAYER                                                  │
│ DESTINATION-KNOWLEDGE-BASE.md — unchanged, remains sole authority  │
│ for destination existence/status, controlled vocabulary,           │
│ recommendation rules, narrative standards. Owner: Product &        │
│ Experience with Operations approval (already governed, KB §15.1).  │
└───────────────────────────────┬────────────────────────────────────┘
                                 │  KB-to-Operational Reconciliation Check (NEW)
                                 │  — every KB §10/§11 ACTIVE destination/region
                                 │    must have a corresponding operational-layer
                                 │    row, or a recorded, owned exception
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. OPERATIONAL LAYER                                                │
│ Seed + Enriched workbook (or its structured successor) — the       │
│ generation-ready authoring surface. Row set and taxonomy sheets    │
│ MUST be KB-derived, not independently authored. Version-controlled.│
│ Owner: new "Destination Operational Steward" role (Section 6.1).   │
└───────────────────────────────┬────────────────────────────────────┘
                                 │  existing validateWorkbook.ts +
                                 │  KB-reconciliation + vocabulary-coverage checks
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. GENERATION LAYER                                                 │
│ web/scripts/journey-intelligence/* → web/generated/*.json          │
│ UNCHANGED mechanics (deterministic, checksummed, atomic, versioned)│
│ ADD: default path to a KB-reconciled canonical source; per-region  │
│ freshness field; named promotion-review step. Owner: Engineering.  │
└───────────────────────────────┬────────────────────────────────────┘
                                 │  loadRuntimeIntelligence.ts (unchanged,
                                 │  fail-closed integrity verification)
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. RUNTIME LAYER                                                     │
│ release1Candidates.ts + deterministic engine + Recommendation      │
│ Adapter + Journey Director UI — UNCHANGED boundary and contracts.  │
│ ADD: generated (not hand-capped) vocabulary mapping; dataQuality   │
│ reflecting actual KB-region coverage; confidence allowlist sourced │
│ from a recorded Operations decision, not a bare constant.          │
└───────────────────────────────┬────────────────────────────────────┘
                                 │  NEW: lightweight, non-blocking
                                 │  public/runtime cross-reference check
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. CONSUMPTION LAYER                                                │
│ public-destinations.config.ts, destination-images.config.ts,       │
│ journey-director.config.ts presentation catalogue, Journey         │
│ Director UI. Public card publication requires a recorded lifecycle │
│ stage (Section 8); recommendation eligibility and browse-content   │
│ readiness remain two independently visible states.                 │
└──────────────────────────────────────────────────────────────────┘
```

Layer responsibilities, stated as boundary rules (in the style already established by `JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md` Section 3.2, which this document extends upstream rather than duplicates):

| Layer | Owns | Must not own |
| --- | --- | --- |
| Business | Destination/region existence, status, controlled vocabulary, recommendation rules, narrative standards | Generation mechanics, runtime data structures, presentation assets |
| Operational | A KB-derived, generation-ready authoring surface: which KB-approved destinations/regions are ready to generate, and the taxonomy labels generation will use | Business approval authority, runtime consumption, presentation content |
| Generation | Deterministic, checksummed, versioned transformation of the operational layer into runtime JSON | Business decisions about inclusion; vocabulary invention beyond what the operational layer supplies |
| Runtime | Candidate pool construction, deterministic eligibility/scoring/ranking, presentation adaptation | Re-deciding destination inclusion; overriding KB status |
| Consumption | Public browse content, imagery, presentation "moments", UI rendering | Recommendation eligibility, scoring, or any claim that browse availability implies recommend-ability |

---

## 4. Governance Principles

1. **Single Business Source of Truth.** The Knowledge Base is canonical for what SMV is prepared to promise a traveller. No downstream artefact introduces a destination, region, or vocabulary value the KB has not approved; none silently narrows what the KB approves without a recorded, owned exception.
2. **Generated, Not Duplicated.** Every runtime artefact should be mechanically derivable from the KB plus the operational layer. Hand-authored TypeScript constants that encode business knowledge in parallel with a generated equivalent (destination lists, vocabulary mappings, confidence allowlists) are a standing governance liability and should shrink over time, not grow.
3. **Explicit Over Silent.** Every divergence from the KB — a destination excluded, a vocabulary term unreachable, a status downgraded — must be visible, owned and dated. A `REVIEW_REQUIRED` log line that nobody is asked to act on is not governance; it is an audit trail waiting for the next Rad-style investigation to read it.
4. **Preserve What Works.** The deterministic engine, the Recommendation Adapter boundary, the atomic/checksummed generation pipeline, and the build-time fail-closed runtime verification are sound and explicitly out of scope for redesign. Governance changes attach at the boundaries between layers, never inside an already-verified one.
5. **Owner-Traceable Change.** Every artefact has exactly one accountable owner (Section 6). Where an owner already exists (KB §15.1, Runtime Catalogue §13), this document consolidates rather than replaces it; where none exists (the operational layer), this document names the gap rather than silently assigning it.
6. **Existing Business Guardrails Are Preserved Unchanged.** This architecture governs destination *knowledge* — what SMV can credibly talk about and recommend. It does not touch, and must not be read as touching, the separate served-destination guardrail already established under `DEC-R1.2-004` (R1.1 `DEC-010`): Journey Director remains solely responsible for validating whether a specific enquiry is actually serviceable, independent of any recommendation this governance model produces.

---

## 5. Source-of-Truth Model

| Governed concern | Single source of truth (target) | Explicitly not a source of truth |
| --- | --- | --- |
| Destination/region existence and status (`ACTIVE`/`COMING_SOON`/`INACTIVE`) | `DESTINATION-KNOWLEDGE-BASE.md` §10/§11, per its own §7.2/§15.1 | Workbook `Journey Base Status`; `public-destinations.config.ts` |
| Controlled vocabulary definitions (Emotions, Themes, Comfort, Pace, Traveller Types) | `DESTINATION-KNOWLEDGE-BASE.md` §8 | Workbook taxonomy sheets; `engine.types.ts`; hand-authored label maps |
| Recommendation rules, narrative standards | `DESTINATION-KNOWLEDGE-BASE.md` §13/§14 | — (already the sole source; no drift found here by any prior review) |
| Which KB-approved destinations/regions are generation-ready | Operational layer, **seeded from** the KB list (target) | Independently authored seed-workbook rows (current, unreconciled state) |
| Generated matching facts (per-candidate emotion/theme/pace/compatibility) | `web/generated/*.json`, produced only from the operational layer | Hand-maintained duplicates of the same facts anywhere else |
| Runtime candidate pool | `release1Candidates.ts`, built exclusively from `journey-dna.json` (unchanged — this is already correct and should stay this way) | Any other file that lists destinations for recommendation purposes |
| `COMING_SOON` exclusions | `release1ExcludedPortfolio` (unchanged — already correctly matches the KB's four-item Coming Soon list) | — |
| `CONFIDENT` vs `SUPPORTED` operational confidence | An Operations-owned, dated decision record (target); currently an unlabelled TS constant (`CONFIDENT_APPROVAL_CANDIDATE_IDS`) with no visible approval trail | The constant itself, once a decision record exists to generate it from |
| Public browse content | `public-destinations.config.ts`, but referencing the destination's lifecycle stage (Section 8) rather than existing in isolation | Nothing today references or is referenced by it — this is the gap being closed |
| Presentation "moments", imagery, CTA copy | `journey-director.config.ts` presentation catalogue, `destination-images.config.ts` (unchanged — already correctly separated from eligibility per `JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md` §9) | — |

---

## 6. Artefact Ownership Matrix

This consolidates the ownership already defined in `DESTINATION-KNOWLEDGE-BASE.md` §15.1 and `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §13 (neither is duplicated below, both are referenced), and adds the artefacts neither document currently covers.

| Artefact | Owner | Purpose | Authority | Update process | Consumers |
| --- | --- | --- | --- | --- | --- |
| `DESTINATION-KNOWLEDGE-BASE.md` | Product & Experience, with Operations approval (KB §15.1, unchanged) | Business source of truth for destination knowledge | Product & Experience | KB §15.3 change control (already defined) | Everything downstream, in principle; today, nothing directly (the gap this architecture closes) |
| Seed/operational workbook (or successor) | **New role required: Destination Operational Steward** (Section 6.1) — no current Team Satvi persona owns this today | Generation-ready authoring surface, KB-derived | Destination Operational Steward, subordinate to KB approval | New: must be seeded from KB §10/§11 on every KB change; version-controlled | Generation Layer only |
| Generator (`web/scripts/journey-intelligence/*`) | Engineering (Rad), per `JOURNEY-INTELLIGENCE-GENERATOR.md` (unchanged) | Deterministic transformation to runtime JSON | Engineering | Existing regeneration procedure (unchanged), plus new KB-reconciliation gate | `web/generated/*.json` |
| `web/generated/*.json` | Engineering, generated artefact (unchanged) | Runtime matching facts | Generator output only — never hand-edited (existing rule, unchanged) | Regeneration only | `loadRuntimeIntelligence.ts` |
| Runtime catalogue (`release1Candidates.ts`, `catalogue.mappings.ts`) | Engineering, per `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` §13 (unchanged) | Typed candidate pool | Engineering, with Operations approval for confidence tier (existing) | Existing catalogue update process (§13 of that document) | Deterministic engine |
| Deterministic engine, Recommendation Adapter | Engineering, per `JOURNEY-DIRECTOR-ARCHITECTURE-CHECKPOINT.md` (unchanged) | Eligibility, scoring, ranking, presentation translation | Engineering | Existing verification suite (unchanged) | Journey Director UI |
| `public-destinations.config.ts`, `destination-images.config.ts` | Content & Experience (aligning with KB §15.1's "Guest-facing narrative quality" row) | Public browse content | Content & Experience, informed by lifecycle stage (Section 8) | **New**: must reference destination lifecycle stage; recommend cross-reference check (Section 7) at PR time | `/destinations` page only (unchanged — never the engine) |
| `journey-director.config.ts` presentation catalogue | Content & Experience / Engineering jointly (existing split per Architecture Checkpoint §9.1/§9.3) | Presentation-only "moments", CTA | Content & Experience for copy; Engineering for the typed contract | Existing (unchanged) | Recommendation Adapter, presentation only |

### 6.1 The one new role: Destination Operational Steward

No persona in Team Satvi's permanent roster today owns "keep the operational layer's destination/region row set aligned with what the Knowledge Base approves." This is the single most consequential ownership gap this architecture identifies — it is the direct, named cause of RC-1, RC-3, RC-4, and RC-10 in Rad's Root Cause Register (Amritsar, Corbett, Darjeeling exclusion; the un-versioned seed workbook). This document does not assign the role to a specific existing persona — that is a project-owner decision (Section 13, Open Question 1) — but notes that its responsibilities (translate approved KB content into generation-ready operational records, keep the seed layer version-controlled and reproducible, respond to KB-reconciliation gate failures) sit closest to Rad/Engineering's existing generation ownership, with Arjun or Product & Experience as the natural approver of *what* gets added.

---

## 7. Synchronisation Architecture

| Transition | Trigger | Validation | Ownership | Failure handling | Review gate |
| --- | --- | --- | --- | --- | --- |
| KB → Operational layer | KB destination/region/vocabulary change, approved per KB §15.3 change control | **New:** KB-to-Operational Reconciliation Check — every KB §10/§11 `ACTIVE` destination/region has an operational-layer row (any `journeyBaseStatus`, not necessarily `Yes`), or a dated, owned exception record | Destination Operational Steward (Section 6.1) | Recommend **warn-mode initially** (see Section 12, Risk 1) — surface as a named, non-suppressible generation-report finding distinct from today's `REVIEW_REQUIRED` warnings, which this audit found nobody is currently tasked with acting on | Before the next generation run is treated as promotable |
| Operational layer → Generated JSON | Explicit generator invocation against a named, checksummed workbook version | Existing `validateWorkbook.ts` (unchanged) **plus new** KB-reconciliation check **plus new** vocabulary-coverage check (Section 8) | Engineering | Existing atomic rollback-on-failure (unchanged, already excellent — preserve exactly as implemented) | Generation report reviewed before promotion (new named checklist step — today's reports are produced but this audit found no evidence of a required review step before `web/generated/` is treated as production-ready) |
| Generated JSON → Runtime catalogue | Build | Existing `loadRuntimeIntelligence.ts` fail-closed integrity verification (unchanged — checksums, schema/generator version, manifest, record counts) | Engineering | Existing `RuntimeIntelligenceIntegrityError` (unchanged) | Existing `verify:journey-catalogue` suite, extended with the KB-reconciliation assertion already proposed in Rad's `R1.2-03.02` audit (Open Question 6) |
| Runtime catalogue → Consumption layer | Any change to `public-destinations.config.ts` or the runtime candidate pool | **New:** lightweight, non-blocking cross-reference check flagging (not blocking) any public destination card whose destination has zero runtime candidate presence | Content & Experience raises; Engineering implements the check | Non-blocking — flag only, since a deliberate "browse-only, not yet recommendable" state is a legitimate product choice (Section 8), just one that must be visible | CI/PR-time lint, or equivalent low-cost automated check |

None of these transitions requires slowing down routine, non-structural content refresh (correcting a typo, refreshing seasonal guidance for an already-included destination). The new gates activate specifically when a change would add, remove, or restructure a destination's *inclusion* or the *vocabulary* it can draw on — the two mechanisms Section 2.3 identified as the actual points of drift.

---

## 8. Destination Lifecycle Model

This formalises the three-tier reality Rad's `R1.2-03.02` audit already measured (Ready / Partial / Placeholder, Section 7 of that report) into a governed sequence with explicit transition ownership, extending the KB's own existing Activation Checklist discipline (KB §12.2, which already governs `COMING_SOON` → `ACTIVE`) one stage further downstream, to where today's actual gap lives.

| Stage | Definition | Owner to advance | Current examples |
| --- | --- | --- | --- |
| **Proposed** | A destination or region is suggested for the portfolio | Product & Experience | (not tracked by this exercise — pre-KB) |
| **Approved (KB Active)** | KB §10/§11 lists it `ACTIVE`, with a full destination/region record | Product & Experience, with Operations approval (KB §12.2, unchanged) | All 24 KB records — **including Amritsar, Assam, Corbett, Darjeeling** |
| **Operationally Authored** | Operational layer has a corresponding row with `journeyBaseStatus` set (any value) — i.e. the KB-reconciliation gate (Section 7) passes | Destination Operational Steward | 22 of 24 — **Amritsar, Assam, Corbett, Darjeeling are the four missing this stage today** |
| **Runtime Ready** | Row survives generation (`journeyBaseStatus === "Yes"`), has a generated candidate | Engineering (mechanical outcome of the above) | 22 of 24, same set |
| **Presentation Ready** | Curated "moments" content + confidence-approved imagery beyond the generic fallback (today's 5-destination allowlist) | Content & Experience, Operations (confidence) | Bali, Goa, Kerala, Sri Lanka, Vizag only |
| **Released** | Public card + Runtime Ready + (optionally) Presentation Ready, all consistent | Tiger consolidates; Vivek releases | Matches Rad's "Ready"/"Partial" classification |
| **Deprecated** | KB status moves to `INACTIVE` (KB §7.2, unchanged) | Product & Experience | None currently |

**The governance value of this model is the "Operationally Authored" stage** — it is the exact, missing intermediate state that explains Amritsar/Assam/Corbett/Darjeeling precisely, and gives Tiger/Vivek a place to make a visible, recorded decision (advance them, or explicitly hold them at "Approved" with a stated reason and review date) instead of the current silent gap a traveller can stumble into by reading a public card. This directly answers Open Question 3 from Rad's `R1.2-03.02` audit and Open Question 6 from `R1.2-03.03` (should public cards for unrecommendable destinations carry an interim signal): under this model, a card for a destination that has not reached "Operationally Authored" would need an explicit product decision to publish ahead of that stage, made visible through the lifecycle stage itself rather than discovered by audit.

---

## 9. Runtime Generation Governance

The existing generation pipeline (`web/scripts/journey-intelligence/`, documented in `JOURNEY-INTELLIGENCE-GENERATOR.md` and `EBC-003C-B`) already satisfies, almost entirely, what this section of the EBC brief asks for:

- **Inputs**: workbook, explicitly named and checksummed — sound.
- **Validation**: `validateWorkbook.ts` enforces sheet/header/ID/cross-reference structure — sound, extend rather than replace (Section 7's two new checks).
- **Versioning**: `catalogueVersion = generator-version + workbook-checksum-prefix` (Runtime Catalogue §4) — sound.
- **Reproducibility**: two-execution determinism comparison built into the standard generation workflow — sound.
- **Auditability**: `intelligence-manifest.json`, generation report, per-artefact SHA-256 — sound.
- **Rollback**: atomic swap with restore-on-failure (`JOURNEY-INTELLIGENCE-GENERATOR.md`, "Regeneration procedure") — sound.

The one governance gap is **promotion approval**, not generation mechanics. Today, a successful generation run is, by construction, immediately promotable — there is no step that asks a business owner to look at the generation report's warning/`REVIEW_REQUIRED` delta before the resulting package is committed and deployed. `JOURNEY-INTELLIGENCE-GENERATOR.md`'s own "Canonical workbook" field currently names the Enriched review workbook directly — which is itself a documentation drift worth Tiger noting: the generator's own governance document asserts canonicity for a workbook whose separate governing report (`JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md`) explicitly withholds production approval. Target state: the generator's default workbook path points at a KB-reconciled canonical source (once one exists, per Section 7's first transition), and any generation whose report shows a *change* in destination inclusion or vocabulary reach — not routine content refresh — requires a named Product & Experience sign-off before promotion, consistent with the ownership KB §15.1 already assigns to "Destination status."

---

## 10. Controlled Vocabulary Governance

| Vocabulary | Origin | Owner | How additions occur | How runtime stays synchronised (target) |
| --- | --- | --- | --- | --- |
| Emotions (17), Themes (36), Comfort (3), Pace (4) | KB §8.1–8.4 | Product & Experience; "new values require a definition, a clear distinction from existing values, and product-owner approval" (KB §8, unchanged) | KB change-control process (§15.3, unchanged) | **New**: operational-layer taxonomy sheets validated at generation time against the KB list — either matching exactly, or explicitly recorded as one of two states: **Approved Release Scope Reduction** (a recorded product decision to launch with a named subset) or **Pending Extension** (an open, owned backlog item) |
| Traveller Types (9) | KB §8.5 | Product & Experience | Same as above | Same as above — this is the vocabulary with the widest current gap (5 of 9 representable) and should be the first candidate for either path |
| Runtime reachability (a value existing in the type system but never producible by any generated candidate) | Not currently tracked anywhere | **New**: proposed as a generation-time report, not a new governance body | N/A | Add a "vocabulary reachability" section to the existing generation report — this is the mechanical fix for RC-6 (Rad's `R1.2-03.03`, §7): today `EmotionId`/`ThemeId` match the KB exactly in the type system while 41%/53% of values can never be assigned, and nothing currently makes that visible without a manual audit like the two already performed |

The two hand-authored label-mapping tables (`EMOTION_BY_LABEL`, `THEMES_BY_LABEL`, and the implied `TRAVELLER_BY_LABEL`) should, in the target state, be generated from the operational layer's taxonomy sheets once those sheets are validated against the KB (above), rather than remaining a hand-maintained TypeScript artefact whose scope silently reflects whatever the workbook happened to define when the table was last edited. This does not require replacing the underlying mapping *mechanism* — mapping free-text workbook labels onto controlled `EmotionId`/`ThemeId` values is legitimate, necessary translation work — only moving its *source of scope* from "whatever the workbook currently has" to "the KB's approved list, with gaps made explicit."

---

## 11. Release Governance Model

This attaches directly to the existing EBC lifecycle (Project Instructions Section 12) rather than introducing a parallel process:

- **Feature development** (Rad, per an approved EBC) — unchanged.
- **Business approval** (Arjun/Vivek confirm KB alignment) — for any future destination-portfolio change, this now explicitly includes confirming the KB-to-Operational Reconciliation Check (Section 7) passes for the affected destinations, not only that the KB document itself is internally consistent.
- **QA** (Keerthi) — this workstream's QA has so far been analysis-only (per the three prior reviews' own scope notes); once implementation begins, functional QA for destination intelligence should explicitly include "can this KB-approved destination actually be recommended end-to-end," not only KB-document consistency, since that is precisely the class of gap two engineering audits found undetected by any existing test.
- **Release readiness** (Tiger consolidates) — recommend the KB-reconciliation check's pass/fail state become a standing input to Tiger's Workstream 3 status reporting, the same way `RELEASE-1.2.md` already tracks other gating dependencies (e.g., RISK-R1.2-011's gate on `R1.2-03.11`/`03.12`).
- **Documentation alignment** — unchanged; this workstream already has an established pattern for this (R1.2-015).

**Direct operational consequence for Workstream 3's next tasks**: both Rad audits independently recommended resolving the synchronisation gap before `R1.2-03.07` onward (the weighted Primary/Secondary/Tertiary preference model, `DEC-R1.2-010`) begins, since that work builds directly on `release1JourneyCandidates` and would otherwise silently inherit every gap this document and the two audits describe. This architecture concurs with that sequencing recommendation on evidence grounds — a weighting model computed over a 22-of-24 candidate pool, with fixed rather than KB-derived vocabulary reach, would encode today's gaps into the *scoring logic* itself, which is materially harder to unwind later than closing the gap upstream first. The final sequencing decision belongs to Tiger.

---

## 12. Future Readiness Assessment — Release 1.3 Destination Granularity Expansion

Assessed against the planned expansion (Karnataka → Coorg, Mysore, Chikmagalur, Bengaluru; Kerala → Munnar, Kochi, Kumarakom, Thekkady; Rajasthan → Jaipur, Udaipur, Jaisalmer, etc.), per this EBC's explicit instruction to evaluate feasibility only, not design R1.3:

**No structural redesign is required.** Three independent pieces of evidence support this:

1. The KB's own region record schema (§7.4) already models exactly this shape — Munnar, Kochi, Kumarakom, etc. already exist today as governed *region* records under the Kerala *destination* record. Adding more, or finer-grained, regions to an existing destination is the same operation the KB and the generator already perform for every multi-region destination in the current 24-record portfolio.
2. The generator's structural model already treats a `destinationId` as a container for multiple `regionId`s (89 region records currently sit under 22 destination IDs) — this is native to the current pipeline, not an extension of it.
3. The engine and candidate builder are already region-aware (`buildRegion()`, `journeyDNAByDestinationId`) — no engine change is implied by a destination gaining more regions.

**What R1.3 does need, as explicit go-forward decisions rather than architecture blockers:**

- Whether a newly-granular place (e.g., "Coorg") becomes its own top-level `destinationId` (splitting from "Karnataka") or remains a region within the existing destination — a product/KB decision the existing Destination-vs-Collection vocabulary (KB §7.3) already supports; it simply needs to be made per case.
- **The governance model proposed in this document becomes more valuable, not less, at higher region counts.** Manual KB-to-runtime reconciliation is already imperfect at 89 regions (as both audits demonstrate); it will not scale by manual diligence alone to a materially larger R1.3 catalogue. Every region added on the current ungoverned model compounds Rad's own RISK-SYNC-E ("Maintainability... a standing risk for every future destination-portfolio change... compounds over time"). This is, if anything, an argument for closing the gap identified in this document *before* R1.3 begins, not a reason to defer it.

**Conclusion:** the target architecture in this document does not constrain R1.3; it directly reduces its execution risk.

---

## 13. Risks, Trade-offs, Assumptions and Open Questions

### 13.1 Risks and trade-offs, by recommendation

| Recommendation | Benefit | Risk | Trade-off | Assumption |
| --- | --- | --- | --- | --- |
| KB-to-Operational Reconciliation Check (Section 7) | Closes the RC-1/RC-3/RC-4 class of gap permanently and mechanically | Could block all generation immediately if enabled in fail-closed mode against today's already-known gaps | Recommend **warn-mode first**, escalating to block-on-*new*-gaps once the existing four-destination register is explicitly resolved or deferred | Someone is named to own resolving reconciliation failures — currently no such role exists (Open Question 1 below) |
| Generate vocabulary mappings from a KB-validated operational layer, rather than hand-maintained TS tables | Removes the RC-6 silent-capping pattern | Requires the operational layer's taxonomy sheets to actually grow toward the KB's full 17/36/9 first — a content/authoring effort, not only engineering | Some vocabulary values may remain genuinely unreachable for a given destination absent real source content (e.g. "Wonder" needs an actual authored basis) — the architecture makes the gap visible, it cannot manufacture missing content | The operational layer's ownership question (Section 6.1) is resolved first |
| Public/runtime cross-reference check (non-blocking) | Cheap, catches the Amritsar-class gap automatically on every future change | Minimal — low-cost, low-risk | None material | A lightweight CI/lint mechanism is an acceptable place for this, consistent with how this repository already runs its `verify:journey-*` suite |
| Version-control the seed/operational layer | Removes RC-10's single-point-of-failure | If the original `Input-2.xlsx` is genuinely unrecoverable (Open Question, both Rad audits and this document), reconstruction itself is effort | None material | The file (or a recoverable equivalent) still exists somewhere accessible |
| Preserve engine/adapter/UI boundary unchanged | Avoids destabilising an already-verified, deterministic boundary | None — deliberate scope constraint | The governance fixes are necessarily upstream-only; any future symptom whose root cause is inside the engine itself (not found by either prior audit or this review) would need separate handling | Neither Rad audit found engine-level defects, and this review's own reading of `evaluateEligibility.ts`/`scoreCandidate.ts` found nothing to add to that conclusion |

### 13.2 Explicit architectural judgement calls (not settled facts)

Per Tiger's brief to distinguish architectural judgement from observed fact:

- **Operational layer's long-term form.** This document recommends the workbook remain the near-term authoring surface (Option A: keep Excel, but make its row set and taxonomy sheets KB-derived rather than independently authored) rather than an immediate replacement with a structured, version-controlled data format (Option B: e.g., YAML/JSON per destination, authored directly against the KB schema). Option A minimises near-term disruption to the existing, well-engineered generator investment; Option B would more fully close the "two authoring surfaces" pattern but is a larger undertaking. This document recommends Option A now and flags Option B as worth evaluating at the KB's own Release 2 "Operational depth" milestone (KB §15.7) — **this is a recommendation for Vivek/Tiger to weigh, not a decision already made.**
- **Promotion-review threshold.** This document recommends gating promotion review on "does this generation change destination inclusion or vocabulary reach" rather than on every generation run. A more conservative alternative (review every regeneration, including routine content refresh) is available and would be a legitimate, more cautious choice at the cost of ongoing manual review overhead.

### 13.3 Open questions for Tiger/Vivek

This document does not re-litigate the open questions already raised, with evidence, by the two Rad audits (workbook source-of-truth resolution timing for Amritsar/Assam/Corbett/Darjeeling; the 5-vs-9 Traveller Type scope decision; interim public-card treatment; Gir/Ranthambore approval; seed-workbook location; `EmotionalGoal`/`DesiredExperience` category retirement) — those remain open and are inherited by this architecture, not restated in full. New, architecture-specific questions:

1. **Who is the Destination Operational Steward** (Section 6.1)? No current Team Satvi persona owns this today, and it is the single most consequential ownership gap this document identifies.
2. **Warn-mode vs. block-mode** for the KB-to-Operational Reconciliation Check at launch — this document recommends warn-mode first (Section 13.1); confirm or override.
3. **Should `R1.2-03.07` onward (the weighted preference model, `DEC-R1.2-010`) be sequenced to start only after the reconciliation gate exists and today's four-destination gap is resolved or explicitly deferred?** This document concurs with both Rad audits' recommendation that it should; the sequencing decision itself belongs to Tiger.
4. **Option A vs. Option B for the operational layer's long-term form** (Section 13.2), and on what release timeline.
5. **This EBC's own task-number framing** (Section 0.1) — reconcile at the next `RELEASE-1.2.md` update, consistent with how `R1.2-014`/`R1.2-015` and the two prior WS3 Rad EBCs handled the same pattern.

---

## 14. Architecture Recommendations (prioritised)

Per this EBC's explicit constraints, these are prioritisation recommendations only — no implementation sequencing, migration plan, or code change is proposed or authorised.

1. **(P1)** Establish the KB-to-Operational Reconciliation Check (Section 7) as a named governance gate, warn-mode first, before Workstream 3's weighted-preference tasks (`R1.2-03.07`+) begin.
2. **(P1)** Resolve or explicitly, visibly defer Amritsar, Assam, Corbett and Darjeeling via the Destination Lifecycle Model's "Operationally Authored" stage (Section 8) — the mechanism matters less to this architecture than the resolution being visible, dated and owned rather than silent.
3. **(P1)** Name the Destination Operational Steward (Section 6.1).
4. **(P2)** Extend generation-time validation with the controlled-vocabulary coverage and reachability checks (Section 10).
5. **(P2)** Add the public/runtime cross-reference check (Section 7, final row) as a low-cost, non-blocking safeguard against future recurrence of the Amritsar-class gap.
6. **(P2)** Replace the hardcoded `dataQuality: "COMPLETE"` with a value reflecting actual KB-region coverage per candidate (RC-9), so partially-represented destinations are distinguishable from fully-represented ones — flagged by Rad as "a data-modelling question for Archie," addressed here as a target-state principle (Section 3, Runtime Layer) rather than a specific implementation.
7. **(P3)** Bring the seed/operational workbook into version control, independent of any decision on its long-term form (Option A/B).
8. **(P3)** Decide the fate of `compatibility-matrix.json`'s unused `EmotionalGoal`/`DesiredExperience` categories (RC-7) — retire or document an intended future consumer.
9. **(P3)** Evaluate Option B (structured, KB-derived operational authoring, replacing Excel) as a candidate for the KB's own Release 2 "Operational depth" milestone.

---

## 15. Acceptance Criteria Mapping

- ✔ Current-state architecture fully documented — Section 2, including a full trace diagram and the precise two-mechanism root cause, grounded in both Rad audits' file/line evidence.
- ✔ Target-state governance architecture defined — Section 3, five layers with explicit "owns / must not own" boundaries.
- ✔ Every major artefact has clear ownership — Section 6, consolidating KB §15.1 and Runtime Catalogue §13 and naming the one artefact (operational layer) with no current owner.
- ✔ Synchronisation model documented — Section 7, every layer transition with trigger/validation/ownership/failure-handling/review-gate.
- ✔ Governance responsibilities clearly assigned — Sections 4, 6, 9, 10, 11.
- ✔ Design supports future destination expansion — Section 12, R1.3 assessed as requiring no structural redesign.
- ✔ Risks, assumptions and open questions identified — Section 13, with architectural judgement explicitly distinguished from observed fact per Tiger's brief.
- ✔ Tiger and Vivek can make implementation decisions without further architectural discovery — every recommendation in Section 14 traces to a specific section above, and every open question in Section 13.3 is stated as a decision, not a research gap.

**Explicit constraints confirmed observed:** no repository code, runtime configuration, generator, workbook, documentation, dataset, or application logic was modified, regenerated, or redesigned in the production of this document. No migration script or implementation sequencing is proposed. Recommendation scoring was not redesigned; `DEC-R1.2-004`'s served-destination guardrail is explicitly preserved (Section 4, Principle 6) and unaffected.

---

**End of document**
