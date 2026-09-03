# EBC R1.2-03.02-EBC-RAD — Destination Knowledge Base Synchronisation Audit

**Persona:** Rad — Engineering and Implementation Specialist
**Type:** Technical Analysis & Audit (strictly read-only — no repository files created, modified, or deleted)
**Workstream:** WS3 — Destination Intelligence
**Date:** 17 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session & Repository Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`. Working tree unchanged by this audit — confirmed clean except the same two pre-existing untracked items every recent EBC on this branch has noted (`_to_delete/`, an untracked WS2 doc), plus the `docs/09-Development/EBC-R1.2-014A/B-...` files added under the prior documentation-alignment EBC (R1.2-015). None of these were touched by this audit.
- No repository files were created, modified, or deleted. Strictly read-only, per this EBC's Explicit Constraints.
- Every path this EBC's Repository Prerequisites listed was checked directly: `web/content/` and `web/data/` do **not exist** in this repository (confirmed by direct listing — not a blocker, nothing this audit needed lived there); `web/lib/`, `web/config/`, `web/public/`, `web/components/`, `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, and `docs/10-Backlog/RELEASE-1.2.md` all exist and were inspected.

## 0.1 Framing — this EBC's task label and its relationship to the tracker

This EBC self-identifies as task `R1.2-03.02`. In the current `RELEASE-1.2.md` (v1.7), task `R1.2-03.02` is defined as *"Define suggested-journey mapping per destination"* (Owner: Arjun, Status: Proposed) — a product-definition task, not an engineering audit. This audit's actual content — a read-only technical reconciliation between the approved Knowledge Base and the runtime implementation — does not literally match that task-table description or ownership. Per Project Instructions Section 35, this is named rather than silently resolved.

Unlike the earlier `R1.2-WS3-EBC-RAD-001` situation (where an EBC's instructions would have required rewriting an unrelated, already-defined workstream), this EBC carries **no risk of corrupting tracker content** — it is strictly read-only and produces a report only; it does not ask Rad to edit `RELEASE-1.2.md`. It is also a natural, well-motivated next step: Arjun's `R1.2-03.01-EBC-ARJUN` review explicitly recommended exactly this kind of audit (Open Question 2: *"who owns reconciling the Enrichment Report's 297 open Review Register items... and can the current state of that reconciliation be confirmed?"*) and Sophie's `R1.2-03.01-EBC-SOPHIE` review independently traced part of the same question from the traveller-experience side. Tiger most plausibly issued this card as the direct answer to that open question, reusing the `03.02` slot with revised content and ownership rather than in error. This audit therefore proceeds on its merits, with the recommendation (Section 13) that Tiger reconcile the task-table description and ownership for `R1.2-03.02` — and decide whether Arjun's original "suggested-journey mapping" content becomes a new, separately-numbered task — the next time `RELEASE-1.2.md` is updated.

---

## 1. Executive Summary

The Destination Knowledge Base (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, v1.0.1, approved 22 July 2026) is well-governed, internally consistent, and — as Arjun's and Sophie's prior reviews both found — a sound single source of truth at the *document* level. This audit traced that document through to the **actual generated runtime artifacts** that power Journey Director today, at a level of engineering detail neither prior review attempted, and found a **materially more severe synchronisation problem than either prior review identified**: it is not only that 19 of 24 destinations lack rich presentation content (Arjun's finding) or that content-readiness barely influences ranking (Sophie's finding) — it is that **four KB-approved, publicly-marketed ACTIVE destinations or collection members have zero recommendation presence in the live Journey Director runtime at all**: **Amritsar**, **Assam**, **Corbett**, and **Darjeeling**. Each already has an approved, production-ready hero image sitting unused in `web/public/images/journey-director/`; three of the four (Amritsar, Assam, Corbett) have live, warmly-written public destination cards inviting a traveller to imagine visiting; none of the four can ever be produced as a Journey Director recommendation, under any traveller profile, today.

The root cause is a **broken source-of-truth chain, not a content-authoring gap**. The script that generates all Journey Director runtime intelligence (`web/scripts/journey-intelligence/index.ts`) defaults to reading `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` — a **derived review workbook** whose own governing document (`docs/02-Product/JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md`) explicitly states *"it should not be integrated into production until the open Review Register items are resolved or formally accepted"* and separately recommends *"production integration should remain a separate work item."* The runtime's own `metadata.json` and the generation report in `outputs/ebc-003c-b/` confirm, in the project's own words, that this is exactly what happened: production was generated from the review-only workbook, not from a KB-reconciled canonical source, and the canonical business-source workbook (`Journey Director Intelligence Input-2.xlsx`) is not present anywhere in this repository — only its unresolved derivative is. The Knowledge Base and the runtime are, today, two unsynchronised systems maintained through entirely separate pipelines, and nothing currently checks one against the other.

A second, independently significant finding: the KB's Controlled Vocabulary (Section 8.5) defines **9** approved Traveller Types, but the generated compatibility data and the runtime `TravellerType` code type both carry only **5** — Business, Couple, Family, Friends, Solo. Honeymoon, Multi-generation Family, Senior Travellers, and Educational Group — all four explicitly named in the KB and used throughout its destination-level "Best for" guidance (e.g. Amritsar's own KB entry names three of the four missing types) — cannot be represented anywhere in Journey Director's actual scoring today.

**Overall audit verdict:** 🔴 The Knowledge Base is not, in practice, the runtime's source of truth, despite being formally approved as such. This is evidence-based, reproducible, and — per this audit's Drift Classification Register (Section 8) — affects real, currently-live traveller-facing behaviour, not only a documentation gap. Recommend Tiger treat this as the priority item ahead of any further Workstream 3 ranking or weighting work (R1.2-03.07 onward), since weighting logic built on top of an unreconciled candidate pool will inherit and compound these gaps.

---

## 2. Repository Inspection Summary

| Area | Path(s) inspected | Finding |
|---|---|---|
| Canonical Knowledge Base | `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` | Exists, v1.0.1, Approved for Release 1 implementation, 22 July 2026. 1,700+ lines, 17 sections, read in full for Sections 7, 8, 10–13, 15, 17. |
| Business-analysis and UX precedent | `docs/09-Development/EBC-R1.2-03.01-ARJUN-Destination-Intelligence-Analysis.md`, `docs/09-Development/EBC-R1.2-03.01-EBC-SOPHIE-Traveller-Experience-Validation-Destination-Intelligence.md` | Both exist (filed in the Claude project, referenced here), both analysis-only, both confirmed the KB is sound at the document level and flagged content-readiness/traveller-experience concerns. Read in full and treated as the starting point for this audit's deeper engineering trace, not re-derived from scratch. |
| Runtime candidate configuration | `web/lib/journey-director/catalogue/release1Candidates.ts`, `catalogue.mappings.ts`, `catalogue.types.ts` | Builds `release1JourneyCandidates` directly and exclusively from `runtimeJourneyIntelligence.indexes.journeyDNAByDestinationId` — i.e. from the generated JSON artifacts, not from the KB markdown. |
| Generated runtime intelligence | `web/generated/*.json` (`journey-dna.json`, `compatibility-matrix.json`, `constraint-library.json`, `journey-seeds.json`, `journey-templates.json`, `reason-library.json`, `metadata.json`, `intelligence-manifest.json`) | Statically imported at build time by `web/lib/journey-director/intelligence/loadRuntimeIntelligence.ts`. Inspected directly with `jq`; record counts and destination/region coverage extracted and cross-checked against the KB (Sections 3–8 below). |
| Generation pipeline | `web/scripts/journey-intelligence/index.ts`, `generateArtifacts.ts`, `loadWorkbook.ts`, `generateManifest.ts`, `generateMetadata.ts` | Confirmed the default (unflagged) source workbook path is hardcoded to the derived "Enriched" review workbook, not the canonical business source (Section 9). |
| Generation governance documents | `docs/02-Product/JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md`, `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` | Both read in full. The Enrichment Report explicitly withholds production-readiness approval; the Generation Report confirms production was generated anyway, from the withheld workbook. |
| Public destination presentation | `web/config/public-destinations.config.ts`, `web/config/destination-images.config.ts`, `web/config/journey-director.config.ts` | 28 public destination cards confirmed (matches Arjun's count exactly); 29 approved canonical hero images confirmed in `journeyCanonicalImages`, of which several (`amritsar`, `assam`, `corbett`, plus `darjeeling`/`darjeeling-v2` in the separate `retainedJourneyImageAlternatives` list) are never referenced by any live runtime candidate. |
| Recommendation engine | `web/lib/journey-director/engine/*.ts` (`evaluateEligibility.ts`, `scoreCandidate.ts`, `selectPossibilities.ts`, `generateRecommendations.ts`, `rankCandidates.ts`, `evaluateContradictions.ts`, `normalizePassport.ts`, `engine.rules.ts`, `engine.types.ts`) | Inspected for eligibility-gate logic (`DESTINATION_NOT_ACTIVE`, `NO_ELIGIBLE_REGION`, etc.) and controlled-vocabulary type definitions (`EmotionId`, `ThemeId`, `TravellerType`). Cross-checked field-for-field against KB Section 8 (Section 5 below). |
| Validation/verification suite | `web/lib/journey-director/validation/*.ts` | Confirmed these scripts validate internal consistency (checksums, schema versions, record counts, determinism) but do **not** cross-check generated candidates against the KB's approved ACTIVE destination list — see Section 12 (Future Automation Feasibility). |
| Non-existent prerequisite paths | `web/content/`, `web/data/` | Confirmed absent by direct listing. No destination-related artefacts live there; not a blocker. |

---

## 3. Destination Inventory Matrix

The KB's Section 10.1 and 11.1 portfolio-overview tables define **24 ACTIVE records** (17 domestic, 7 international) plus 2 collections whose members are separately enumerated (Northeast: 3: Meghalaya, Sikkim, Darjeeling; Wildlife: 4: Kabini, Corbett, Bandipur, Masinagudi). The public site (`public-destinations.config.ts`) exposes **28 cards**. This audit traced every one of the 24 records, plus every named collection member, through to the generated `journey-dna.json` (the definitive list of what Journey Director can actually recommend, since `release1JourneyCandidates` is built exclusively from it).

**Legend:** KB = documented ACTIVE in the Knowledge Base. Public = has a live browsable card on `/destinations`. Runtime = has at least one region record in `web/generated/journey-dna.json`, i.e. can appear as (or within) a Journey Director recommendation.

### Domestic (17 KB records)

| Destination | KB | Public card | Runtime candidate | Notes |
|---|---|---|---|---|
| Agra | ✅ | ✅ | ✅ (1 region) | Consistent |
| **Amritsar** | ✅ | ✅ | ❌ | **Zero regions anywhere in `journey-dna.json`. Cannot be recommended under any traveller profile.** |
| Andaman | ✅ | ✅ | ✅ (6 regions) | Consistent |
| Goa | ✅ | ✅ | ✅ (5 regions) | Consistent — includes the one `REVIEW_REQUIRED` region (Panjim), correctly excluded from *primary* recommendation only |
| Gujarat | ✅ | ✅ | ✅ (5 regions) | Consistent — includes 2 `REVIEW_REQUIRED` regions (Dwaraka, Byet Dwaraka, Nishkal Mahadev), correctly excluded from *primary* recommendation only |
| Himachal Pradesh | ✅ | ✅ | ✅ (7 regions) | Consistent — includes 2 `REVIEW_REQUIRED` regions (Leh, Ladakh) |
| Karnataka | ✅ | ✅ | ✅ (8 regions) | Consistent, but see Section 8.4 (Bandipur/Kabini also duplicated under Wildlife) |
| Kashmir | ✅ | ✅ | ✅ (4 regions) | Consistent |
| Kerala | ✅ | ✅ | ✅ (4 regions) | Consistent — includes 2 `REVIEW_REQUIRED` regions (Allappey, Houseboats) |
| Northeast *(collection, KB: 3 members)* | ✅ | ✅ | ⚠️ (2 of 3 regions) | **Darjeeling is entirely absent.** Only Meghalaya and Sikkim exist in `journey-dna.json`. |
| Pondicherry | ✅ | ✅ | ✅ (1 region) | Consistent |
| **Assam** | ✅ | ✅ | ❌ | **No standalone destination candidate.** Only exists as 2 *region* entries — `india-northeast-assam` and `india-wildlife-tours-assam` — both flagged `REVIEW_REQUIRED` and excluded from primary recommendation. This directly contradicts the KB's own Section 15.4 quality check, which explicitly requires *"Assam is not incorrectly absorbed into the Northeast collection."* |
| Rajasthan | ✅ | ✅ | ✅ (7 regions) | Consistent — includes 1 `REVIEW_REQUIRED` region (Kumbalgarh) |
| Tamil Nadu | ✅ | ✅ | ✅ (8 regions) | Consistent — includes 2 `REVIEW_REQUIRED` regions (Chennai, Temple Tour) |
| Hyderabad | ✅ | ✅ | ✅ (1 region) | Consistent |
| Vizag | ✅ | ✅ | ✅ (1 region) | Consistent — one of the 5 "confident approval" destinations |
| Wildlife *(collection, KB: 4 members)* | ✅ | ✅ | ⚠️ (2 of 4 + 2 ungoverned) | **Corbett is entirely absent.** `india-wildlife-tours` regions are: Bandipur, Kabini, Masinagudi, plus **Gir National Park** and **Ranthambore** — neither of which is a KB-documented Wildlife member. See Section 8.5. |

### International (7 KB records)

| Destination | KB | Public card | Runtime candidate | Notes |
|---|---|---|---|---|
| Dubai | ✅ | ✅ | ✅ (1 region) | Consistent — includes 1 `REVIEW_REQUIRED` region (Abu Dabhi) |
| Bali | ✅ | ✅ | ✅ (4 regions) | Consistent — one of the 5 "confident approval" destinations |
| Malaysia | ✅ | ✅ | ✅ (3 regions) | Consistent |
| Singapore | ✅ | ✅ | ✅ (1 region) | Consistent |
| Sri Lanka | ✅ | ✅ | ✅ (6 regions) | Consistent — one of the 5 "confident approval" destinations; includes 1 `REVIEW_REQUIRED` region (Trinconmalee) |
| Thailand | ✅ | ✅ | ✅ (5 regions) | Consistent |
| Vietnam | ✅ | ✅ | ✅ (4 regions) | Consistent |

### Coming Soon (KB Section 12 — correctly excluded)

China, Japan, East Africa, Australia & New Zealand — confirmed excluded identically from both the KB and `release1ExcludedPortfolio` in `release1Candidates.ts` (exact 4-item match, both by count and identity). No drift found here — this is the one part of the inventory reconciliation Arjun's review already verified and this audit independently reconfirms as still correct.

### Reconciliation summary

- **24 of 24** KB ACTIVE records are represented as public destination cards (28 cards after Wildlife's member-level breakout — matches Arjun's prior count exactly).
- **20 of 24** KB ACTIVE records have at least one working runtime region. **4 do not or are functionally incomplete: Amritsar (0 regions), Assam (0 standalone regions, 2 suppressed), Northeast (missing Darjeeling), Wildlife (missing Corbett, plus 2 ungoverned regions present).**
- Total standalone runtime `destinationId` values: **22** (24 minus Amritsar and Assam, which have no destinationId of their own at all).

---

## 4. Attribute Reconciliation Matrix

Building on — not repeating — Arjun's Section 3 mapping (which confirmed the KB's attribute *schema* covers this EBC's requested categories field-for-field), this audit checked whether the **generated data actually populates** those fields for the destinations that do have runtime candidates.

| KB attribute (Section 7.1/7.4) | Generated equivalent (`journey-dna.json` field) | Population check |
|---|---|---|
| `primaryEmotion` / `supportingEmotions` | `emotionalOutcomes` (mapped through `EMOTION_BY_LABEL`) | Present for all 89 generated region records. Falls back to `["discovery"]` if a record's raw emotional-outcome labels don't map to a known `EmotionId` — this fallback path exists in code (`emotionsFor()`) but this audit did not find any record that actually triggers it. |
| `themes` | `primaryExperiences` + `secondaryExperiences` (mapped through `THEMES_BY_LABEL`) | Present for all 89 records. |
| `bestFor` | Derived from `compatibilityByRegionId` (`TravellerType` category, score ≥ 2) | Present, but see Section 5 — structurally limited to 5 of the KB's 9 traveller types regardless of source data. |
| `pace` / `comfort` | `journeyPace` / `comfortRange` (mapped through `PACE_BY_LABEL` / `COMFORT_BY_LABEL`) | Present for all 89 records. |
| `idealDuration` | `suggestedDuration` | Present for all 89 records (not consumed by the candidate builder today, but present in the source data). |
| `signatureExperiences` | Generated per-region via `signatureExperience()` (synthesised from themes/emotions, not copied from KB's own hand-written signature-experience prose) | Present, but **derived, not sourced from the KB's own text.** The KB's hand-authored `signatureExperiences` strings (e.g. Amritsar's "Golden Temple at a quiet hour, community kitchen context, Partition Museum") are not consumed anywhere in the generation pipeline this audit traced — the runtime's `signatureExperiences` field is algorithmically generated from theme/emotion combinations, not copied from the KB. This is a legitimate design choice, not necessarily a defect, but it means the KB's carefully-written signature-experience prose has no code path into the live recommendation output today. |
| `tradeOffs` | `avoidWhen` + `seasonalCautions` + seed `potentialTradeOff` | Present, passed through `classifyConcerns()`. |
| `lastReviewed` | Not present as a per-record field in `journey-dna.json`; only a single workbook-level `generatedAt`/checksum exists | KB requires `lastReviewed` per destination (Section 7.1: "Yes" required); the runtime has no equivalent per-destination freshness field, only a single global generation timestamp for the entire batch. This means a KB reviewer cannot tell, from the runtime data alone, which specific destinations are more or less current relative to each other. |

**Conclusion:** for the 20 destinations that do have runtime candidates, the populated fields are structurally sound and consistently derived. The two real gaps are (a) the KB's own hand-written narrative content (signature experiences, region director notes) is not the source of the runtime's equivalent fields — they are independently regenerated from raw taxonomy labels — and (b) there is no per-destination freshness/review-date field in the runtime, only a single batch-level timestamp.

---

## 5. Controlled Vocabulary Audit

| KB vocabulary (Section 8) | Count | Code type (`engine.types.ts`) | Count | Match |
|---|---|---|---|---|
| Emotional Library (8.1) | 17 | `EmotionId` | 17 | ✅ **Exact 1:1 match**, verified value-by-value (adventure, awe, celebration, curiosity, discovery, escape, freedom, gratitude, indulgence, joy, majesty, reconnection, relaxation, romance, serenity, spirituality, wonder). |
| Theme Library (8.2), all 5 groups combined | 36 | `ThemeId` | 36 | ✅ **Exact 1:1 match**, verified by group (Landscape 10, Culture 7, Nature/activity 7, Lifestyle 7, Special interest 5 = 36; code list independently counted at 36). |
| Comfort levels (8.3) | 3 | `ComfortLevel` | 3 | ✅ Exact match (simple, balanced, premium). |
| Travel pace (8.4) | 4 | `TravelPace` | 4 | ✅ Exact match (relaxed, balanced, explorer, fast-paced). |
| **Traveller types (8.5)** | **9** | **`TravellerType`** | **5** | 🔴 **Not a match.** Code has only `solo-traveller`, `couple`, `family`, `friends`, `corporate-group`. **Missing: Honeymoon, Multi-generation Family, Senior Travellers, Educational Group.** |

The Traveller Type gap is not a code-only oversight — it traces upstream to the generated data itself. `compatibility-matrix.json` (the artifact the code's `bestFor()` function reads from) contains exactly 5 distinct `TravellerType`-category keys: `Business`, `Couple`, `Family`, `Friends`, `Solo` (confirmed by direct extraction — `jq '[.records[] | select(.category=="TravellerType") | .key] | unique'`). This matches `metadata.json`'s own `recordCounts.travellerTypes: 5`. **The generation pipeline never scored Honeymoon, Multi-generation Family, Senior Travellers, or Educational Group as compatibility dimensions in the first place** — this predates and is independent of the `engine.types.ts` code, which faithfully mirrors what the data actually contains.

This has a concrete, checkable consequence: the KB's own Amritsar entry (Section 10.3) names *"Families, Multi-generation Families, Senior Travellers, Solo Travellers, Educational Groups"* as best-for profiles — three of those five (Multi-generation Families, Senior Travellers, Educational Groups) have no representable code path in Journey Director's scoring today, independent of and in addition to Amritsar's separate, complete absence from the candidate pool (Section 3).

---

## 6. Recommendation Engine Input Map

Every input that contributes to a Journey Director recommendation, traced from source to consumption:

| Input | Type | Generated/authored by | Consumed by | Contributes |
|---|---|---|---|---|
| `Journey Director Intelligence Enriched.xlsx` (`outputs/ebc-003c-a/`) | External workbook (tracked in repo as a binary file) | Manual enrichment of a canonical business workbook (EBC-003C-A), per `JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md` | `web/scripts/journey-intelligence/loadWorkbook.ts` (default source path) | Sole upstream source for all 7 generated JSON artifacts below |
| `web/generated/journey-dna.json` | Generated JSON (89 region records) | `generateJourneyDNA.ts`, run via `npm run generate:journey-intelligence` | `loadRuntimeIntelligence.ts` → `release1Candidates.ts` | Region identity, themes, emotions, pace, comfort, duration, trade-offs — the backbone of every candidate |
| `web/generated/compatibility-matrix.json` | Generated JSON (3,382 scored records) | `generateCompatibility.ts` | `release1Candidates.ts`'s `bestFor()` | Traveller-type suitability scoring per region |
| `web/generated/constraint-library.json` | Generated JSON (1,566 records) | `generateConstraints.ts` | Not directly traced to `release1Candidates.ts` in this audit's read of the candidate builder — appears consumed elsewhere in the engine (`evaluateContradictions.ts` / `engine.rules.ts`); a full trace of this specific artifact's consumption path is flagged as an assumption gap (Section 10), not confirmed line-by-line within this audit's effort budget |
| `web/generated/journey-seeds.json` | Generated JSON (89 records) | `generateJourneySeeds.ts` | `release1Candidates.ts` (`journeySeedByRegionId`, used for `potentialTradeOff`) | Narrative seed content, trade-off phrasing |
| `web/generated/journey-templates.json` | Generated JSON (89 records) | `generateTemplates.ts` | Referenced by `runtimeJourneyIntelligence.indexes` (not traced to a specific candidate-builder consumer in this pass) | Suggested journey rhythm/templates |
| `web/generated/reason-library.json` | Generated JSON (18 records) | `generateReasons.ts` | Reason-code lookups throughout the engine and `recommendation-adapter.ts` (per Sophie's review) | Explanation text for scored matches |
| `web/generated/metadata.json` / `intelligence-manifest.json` | Generated JSON (batch metadata) | `generateMetadata.ts` / `generateManifest.ts` | `loadRuntimeIntelligence.ts` (integrity verification: checksums, schema/generator version, record counts) | Does not contribute matching data itself; gates whether the bundle is trusted at load time |
| `web/config/journey-director.config.ts` (`journeyPresentationCatalogue`) | Hand-authored TypeScript, **not generated** | Directly authored by engineering/content (5 entries: Goa, Kerala, Bali, Sri Lanka, Vizag) | `recommendation-adapter.ts` (`mapPossibility()`) | Presentation-only "moments" narrative and hero imagery for the 5 confident-approval destinations. Explicitly documented in-code as unable to affect eligibility, scoring, or ranking. |
| `web/config/destination-images.config.ts` (`journeyCanonicalImages`) | Hand-authored TypeScript, **not generated** | Directly authored (29 approved images) | `journeyCanonicalImage()` / `journeyCanonicalImageForPossibility()` | Presentation-only imagery fallback chain |
| `web/config/public-destinations.config.ts` | Hand-authored TypeScript, **not generated**, **entirely independent of the KB or the workbook** | Directly authored (28 cards) | `/destinations` browsing page only — **not consumed anywhere in the Journey Director engine or candidate pipeline** | Public marketing copy only. This is the artifact most likely to mislead a reader into thinking a destination is fully live, since it has no dependency on, or awareness of, runtime candidate availability. |
| `CONCERN_CLASSIFICATION_RULES`, `THEME_MEMORY_GOAL_MAP`, `LEGACY_CANDIDATE_IDS`, `CANDIDATE_NAMES`, `CANDIDATE_ALIASES`, `CONFIDENT_APPROVAL_CANDIDATE_IDS` (`catalogue.mappings.ts` / `release1Candidates.ts`) | Hand-authored TypeScript constants, **hardcoded, not generated, not sourced from the KB** | Directly authored | `buildCandidate()` / `buildRegion()` | Naming/aliasing, concern classification, memory-goal derivation, and the 5-destination confident-approval allowlist — **all maintained by hand, independent of both the KB and the generated data, and require manual updates whenever the destination portfolio changes.** |

**Key structural finding:** there are, in effect, **three independently-maintained sources of destination truth** feeding the live site today — the KB (markdown, business-approved), the generated intelligence (JSON, workbook-derived), and a set of hand-authored TypeScript constants (presentation and classification). No code path in this repository reads the KB directly; the KB influences the runtime only insofar as a human remembers to keep the workbook and the hand-authored constants aligned with it.

---

## 7. Content Readiness Matrix

Per this EBC's required classification (Ready / Partial / Limited / Placeholder), applied to all 24 KB ACTIVE records:

| Destination | Runtime candidate? | Curated "moments" content (`journeyPresentationCatalogue`)? | Approved imagery? | Classification |
|---|---|---|---|---|
| Bali, Goa, Kerala, Sri Lanka, Vizag *(5)* | ✅ | ✅ (3 moments each) | ✅ | **Ready** |
| Agra, Andaman, Gujarat, Himachal Pradesh, Karnataka, Kashmir, Northeast, Pondicherry, Rajasthan, Tamil Nadu, Hyderabad, Wildlife, Dubai, Malaysia, Singapore, Thailand, Vietnam *(17)* | ✅ | ❌ (falls back to `DEFAULT_JOURNEY_PRESENTATION`, generic golden-hour stock image) | Yes, own destination-level image exists, but not surfaced by Journey Director's "moments" section | **Partial** — recommendable, has an approved hero image, but no destination-specific narrative "moments" content; presented with a *generic* fallback hero when detailed, not the destination's own image, for the "Imagine your journey" section specifically (per Sophie's review, Section 5.1) |
| Amritsar, Assam, Corbett, Darjeeling *(4)* | ❌ | ❌ | ✅ (all four have approved, unused hero images) | **Placeholder** — cannot appear in a recommendation at all; imagery and (for Amritsar/Assam) full KB narrative content exist but have no live code path to reach a traveller through Journey Director |

No KB ACTIVE destination in this audit's inventory falls into "Limited" as a distinct category from "Partial" — the runtime's content-readiness model is effectively binary (in the 5-destination allowlist, or not), so this audit did not find a meaningful third tier between "Ready" and "Partial" in the current implementation. This itself is worth naming: the KB's own content-readiness concept is more granular than what the code currently distinguishes.

---

## 8. Drift Classification Register

Each finding classified per this EBC's required categories, with supporting evidence.

### 8.1 Amritsar — complete candidate absence
- **Classification:** Runtime Drift (primary) + Configuration Drift (contributing)
- **Evidence:** `jq -r '[.records[].destinationId] | unique'` on `journey-dna.json` returns 22 destinationIds; `india-amritsar` is not among them. KB Section 10.1 lists Amritsar as `Destination`, `ACTIVE`. `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` warning: *"`DESTINATION_WITHOUT_JOURNEY_BASE` (india-amritsar): Amritsar has no approved Journey Base and will not enter primary recommendation ranking"* — confirming this is a known, logged condition from the workbook's own review process, not a silent code bug.
- **Severity:** High — a KB-approved, publicly-marketed destination cannot ever be recommended.

### 8.2 Assam — standalone destination suppressed into two excluded regions
- **Classification:** Runtime Drift + Documentation Drift (the KB's own Section 15.4 quality check exists specifically to prevent this exact outcome)
- **Evidence:** No `india-assam` destinationId exists in `journey-dna.json`. Assam appears only as `india-northeast-assam` and `india-wildlife-tours-assam`, both marked `REVIEW_REQUIRED` per the Generation Report's warnings, both therefore excluded from primary recommendation. KB Section 15.4: *"Assam is not incorrectly absorbed into the Northeast collection"* — the exact failure mode this data exhibits.
- **Severity:** High — same consequence as Amritsar, plus a direct, named contradiction of an existing KB governance safeguard.

### 8.3 Corbett — approved Wildlife-collection member with zero runtime presence
- **Classification:** Runtime Drift (workbook was never updated to include it, per the Enrichment Report's own "potential additions... not part of the canonical 107-row dataset" listing for Corbett)
- **Evidence:** `grep -io "corbett" web/generated/journey-dna.json` returns zero matches. KB Section 10.18 documents Corbett as an active Wildlife member. `corbett.webp` exists as an approved image and a live public card exists.
- **Severity:** Medium-High — same "publicly promised, never deliverable" pattern as Amritsar/Assam, for a collection member rather than a standalone destination.

### 8.4 Darjeeling — approved Northeast-collection member with zero runtime presence
- **Classification:** Runtime Drift
- **Evidence:** `journey-dna.json`'s `india-northeast` regions are only Meghalaya and Sikkim; Darjeeling is absent. `darjeeling.webp`/`darjeeling-v2.webp` exist only in `retainedJourneyImageAlternatives` (explicitly documented as *not* wired to any live candidate).
- **Severity:** Medium — no dedicated public card exists for Darjeeling specifically (it is folded into the general "Northeast" card), so the traveller-facing promise is less direct than for Amritsar/Assam/Corbett, but the KB explicitly names it as one of exactly 3 Northeast members and it is silently 1-of-3-missing from the collection's actual runtime coverage.

### 8.5 Gir National Park and Ranthambore — ungoverned regions present in production data
- **Classification:** Source-of-Truth Ambiguity / Intentional Future Work (see caveat below) — the inverse of 8.1–8.4: extra data present that the KB does not yet document
- **Evidence:** Both appear as `india-wildlife-tours` regions in `journey-dna.json` but neither is one of the KB's 4 named Wildlife members (Kabini, Corbett, Bandipur, Masinagudi).
- **Note on likely intent:** `RELEASE-1.2.md` task `R1.2-03.13` ("Replace Wildlife Experiences destination card with Gir") indicates Gir's presence is very plausibly **intentional pre-staged data** ahead of an already-planned product decision, not an error — flagged as **Intentional Future Work** rather than a defect, but worth Tiger confirming, since Ranthambore has no equivalent tracked task referencing it at all.
- **Severity:** Low (Gir, likely intentional) / Low-Medium (Ranthambore, unexplained).

### 8.6 Bandipur and Kabini — duplicated across two destinationIds
- **Classification:** Configuration Drift / Documentation Drift — this is the exact condition the Enrichment Report's own "potential semantic duplicates" list already names (Kabini, Bandipur, Masinagudi, Assam, Ranthambore, Gir National Park) and explicitly leaves unresolved ("Source rows were not removed or merged").
- **Evidence:** Both region names appear once under `india-karnataka` and again under `india-wildlife-tours`, each generating a distinct, separately-scored region candidate.
- **Severity:** Low-Medium — not necessarily wrong (a place can legitimately be reached via two different journey framings), but unreconciled, and the Enrichment Report already flagged it as needing a business decision on "canonical ownership model" that this audit found no evidence has been made.

### 8.7 Traveller Type vocabulary gap (Honeymoon, Multi-gen Family, Senior Travellers, Educational Group)
- **Classification:** Documentation Drift (KB defines 9, both the generated data and the code only support 5) — see Section 5 for full evidence.
- **Severity:** Medium — affects scoring precision for real, KB-named traveller segments across every destination, not just the four missing candidates above.

### 8.8 Production generated from an explicitly not-yet-production-approved workbook
- **Classification:** Configuration Drift / Governance Process Gap — the root cause underlying 8.1–8.4.
- **Evidence:** See Section 9 (Source-of-Truth Analysis) for the full trace.
- **Severity:** High — this is the systemic cause, not a one-off content gap; any future re-generation without changing the default workbook path will continue producing the same class of gap for any future KB update.

### 8.9 KB narrative content not consumed by the generator
- **Classification:** Content Gap (by design, not defect) — see Section 4.
- **Severity:** Low — a design choice worth Product being aware of, not a bug.

### 8.10 Content-readiness has near-zero influence on which candidate a traveller actually sees first
- **Classification:** Already identified by Sophie's `R1.2-03.01-EBC-SOPHIE` review (Section 5.2 of that review) — restated here only for completeness of this Drift Register, not re-derived. This audit's independent contribution is Sections 3, 5, 8.1–8.7 and 9, which are new.

---

## 9. Source-of-Truth Analysis

Tracing each runtime artefact to its true origin, per this EBC's explicit requirement:

| Runtime artefact | Ultimate source | Evidence |
|---|---|---|
| `web/generated/*.json` (all 8 files) | `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` — a **derived review workbook**, not the canonical business source | `web/scripts/journey-intelligence/index.ts` line 42 hardcodes this exact path as the default (only overridable via an explicit `--workbook` CLI flag, which this audit found no evidence was ever used); `web/generated/metadata.json`'s own `generatedFrom` field states `"Journey Director Intelligence Enriched.xlsx"`; `outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md` line 4 states `**Workbook:** Journey Director Intelligence Enriched.xlsx` in its own header. |
| The **canonical** business workbook, `Journey Director Intelligence Input-2.xlsx` | External business source, referenced by name in `JOURNEY-DIRECTOR-INTELLIGENCE-ENRICHMENT-REPORT.md` line 5 as the "Canonical input" | **Not present anywhere in this repository.** Only its derived, explicitly-not-production-approved "Enriched" review copy is tracked (`outputs/ebc-003c-a/`). This means the repository, on its own, cannot currently regenerate runtime intelligence from the actual canonical source even if someone wanted to — the canonical file simply isn't here. |
| `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` | Hand-authored by Product & Experience, approved 22 July 2026 (v1.0.1) | Independently maintained. **No code path in this repository reads this file.** It informs the runtime only through human effort to keep the hand-authored TypeScript constants (Section 6) and the workbook-derived data in step with it — a process this audit found no automated enforcement of anywhere. |
| `web/config/journey-director.config.ts`, `destination-images.config.ts`, `public-destinations.config.ts`, and the constants in `release1Candidates.ts`/`catalogue.mappings.ts` | **Manual duplication** — hand-authored, hardcoded, independently maintained TypeScript | Confirmed by direct reading (Section 6); none of these files import from or reference the KB or the generated workbook data for their destination lists — they are separately, manually kept in sync (or, as this audit found, not always kept in sync — e.g. `public-destinations.config.ts` includes Amritsar and Assam with no corresponding runtime awareness). |

**Timeline is itself evidence of a process gap, not just a data gap:** the KB was approved 22 July 2026. The runtime intelligence was generated 30 July 2026 — **eight days later**, i.e. *after* the KB's Assam/Corbett/Amritsar positions were already settled — yet the generation still ran against the unresolved "Enriched" workbook rather than a KB-reconciled canonical source, and still produced the same gaps the KB had, by then, already closed on paper. This indicates the generation pipeline and the KB approval process are not currently sequenced to depend on one another at all; a KB update today would have no mechanical effect on the next runtime generation unless a person manually updates the canonical workbook and re-points the generator, and this audit found no process artefact (checklist, CI gate, or generation-report field) that would currently catch the omission if that manual step were skipped again.

---

## 10. Risks

| ID | Category | Description | Severity |
|---|---|---|---|
| RISK-SYNC-A | Traveller trust | A traveller can browse Amritsar, Assam, or Corbett on `/destinations`, read specific, inviting copy, but can never receive either as a Journey Director recommendation — no code path connects the two, and nothing in the traveller-facing experience explains the gap | High |
| RISK-SYNC-B | Process/Governance | Production runtime intelligence is generated from a workbook its own governing report says should not be used for production; nothing currently prevents this from recurring on the next regeneration | High |
| RISK-SYNC-C | Data quality | Bandipur and Kabini exist as duplicated, independently-scored regions under two different destinations, an unresolved condition the source Enrichment Report already flagged | Medium |
| RISK-SYNC-D | Controlled vocabulary | 4 of the KB's 9 approved Traveller Types have no representable path in Journey Director scoring, affecting matching precision for every destination, not only the 4 missing candidates | Medium |
| RISK-SYNC-E | Maintainability | Destination truth is split across 3 independently-maintained sources (KB, generated workbook data, hand-authored TS constants) with no automated cross-check; this is a standing risk for every future destination-portfolio change, not just the ones already found | Medium-High (compounds over time) |
| RISK-SYNC-F | Scope for future weighting work | Workstream 3's planned weighted Primary/Secondary/Tertiary preference model (R1.2-03.07 onward) will be built on top of the current 22-candidate pool; if built before this synchronisation gap is resolved, Amritsar/Assam/Corbett/Darjeeling will be invisible to the new weighting logic by construction, not by explicit decision | Medium-High |

None of these are, by this audit's read, silently catastrophic — the affected destinations degrade to "not recommendable" rather than to an error or a broken page. But RISK-SYNC-A and RISK-SYNC-B are, in this audit's assessment, the two most important findings for Tiger/Vivek to weigh before further Workstream 3 implementation proceeds.

---

## 11. Assumptions

- **Assumption:** the device-bridge snapshot of the repository (branch `feature/ebcr1.2-003-trust-strip-visual-refresh`) reflects the actual current state of the runtime artefacts; no newer, uncommitted local regeneration was hidden from this audit's read access.
- **Assumption:** the `--workbook` CLI flag on `npm run generate:journey-intelligence` has not, in practice, been used to point at a different (e.g. KB-reconciled) source for the artifacts currently in `web/generated/` — inferred from the fact that `metadata.json`'s `generatedFrom` field and the tracked generation report both name the "Enriched" workbook specifically, with no other generation report present in the repository.
- **Assumption:** `constraint-library.json` and `journey-templates.json` do contribute to live recommendation behaviour somewhere in the engine, even though this audit did not trace their exact consumption path to a specific line of `release1Candidates.ts` the way it did for `journey-dna.json`, `compatibility-matrix.json`, and `journey-seeds.json` — flagged as an incomplete trace (Section 6) rather than asserted as unused, since finding the exact consumption point for a 406,742-byte generated artifact was outside this audit's effort budget once the higher-priority Amritsar/Assam/Corbett/Darjeeling finding emerged.
- **Not confirmed, treated as an open question rather than an assumption:** whether the Enrichment Report's 297 open Review Register items have been reconciled *since* 30 July — this audit, like Arjun's, has no way to check the live state of the external `.xlsx` workbook itself, which is not tracked in this repository.
- **Inferred, not confirmed:** that this EBC's `R1.2-03.02` task-number choice (Section 0.1) reflects an intentional Tiger decision to redirect that task slot toward this audit, consistent with Arjun's and Sophie's own open questions from `R1.2-03.01` — not re-litigated further here per this audit's read-only, non-escalating scope for this specific labeling nuance.

---

## 12. Open Questions for Business/Team Review

1. **(Tiger/Vivek, P1)** Given that Amritsar, Assam, Corbett, and Darjeeling are publicly marketed but cannot be recommended, should Journey Director's runtime intelligence be regenerated from a reconciled, KB-aligned canonical source before any further Workstream 3 implementation proceeds? This audit recommends yes, but the business decision (and who owns re-running the workbook enrichment/approval cycle) sits with Tiger/Vivek, not Rad.
2. **(Tiger, P1)** Who owns pointing `web/scripts/journey-intelligence/index.ts`'s default workbook path at a production-approved source, and who owns obtaining and tracking the actual canonical `Journey Director Intelligence Input-2.xlsx` in this repository (or a controlled location) so regeneration is reproducible without relying on an explicitly not-production-ready derivative?
3. **(Vivek, P2)** Should the public destination cards for Amritsar, Assam, and Corbett be temporarily withdrawn or annotated until they can be recommended, or is "browsable but not yet recommendable" an acceptable interim state? This audit found no existing product decision addressing this specific gap.
4. **(Arjun/Vivek, P2)** Should the KB's 9 Traveller Types be reduced to the 5 the data/code actually support (formalising the current state), or should the generation pipeline be extended to score the missing 4 (Honeymoon, Multi-generation Family, Senior Travellers, Educational Group)? Either is a legitimate business decision; this audit is not recommending one over the other.
5. **(Archie/Tiger, P2)** Should Gir National Park and Ranthambore's presence in the Wildlife runtime data be formally approved now (Gir appears aligned with the already-planned `R1.2-03.13`), or held back until each is explicitly scoped, given neither yet has a governing KB entry?
6. **(Archie, P3)** Should an automated check be added — e.g. to `web/lib/journey-director/validation/` — that asserts every KB Section 10/11 ACTIVE destination has at least one corresponding `journeyDNAByDestinationId` entry, so a future KB update or regeneration cannot silently reintroduce this class of gap? See Section 13.

---

## 13. Prioritised Synchronisation Recommendations

Per this EBC's explicit constraint, these are prioritisation recommendations only — no implementation sequencing, migration plan, or code change is proposed.

1. **(P1) Resolve the workbook source-of-truth gap before further Workstream 3 implementation.** This is the single highest-leverage fix: it is the root cause of findings 8.1–8.4 and a contributing factor to 8.5–8.6. Everything else in this register is either downstream of it or independent of it.
2. **(P1) Decide the fate of Amritsar, Assam, Corbett, and Darjeeling specifically** — either by resolving their underlying `REVIEW_REQUIRED`/missing-data status so they can re-enter the candidate pool, or by making a deliberate, documented decision to keep them public-browse-only for now. Either is acceptable; an undocumented gap is the actual problem, not any specific choice.
3. **(P2) Formalise the Traveller Type vocabulary decision** (5 vs. 9) so the KB and the runtime state the same claim.
4. **(P2) Resolve the Bandipur/Kabini duplicate-region question** the Enrichment Report already raised and left open.
5. **(P3) Consider an automated KB-to-runtime reconciliation check** (Open Question 6) as a durable fix, so this class of drift is caught mechanically on every future regeneration rather than requiring another manual audit like this one.
6. **(P3) Reconcile this EBC's own task-number framing** (Section 0.1) the next time `RELEASE-1.2.md` is updated, consistent with how `R1.2-014`/`R1.2-015` handled the equivalent situation for the prior "WS3" homepage reviews.

None of these are release-blocking in the sense of breaking anything currently live — every affected destination degrades gracefully to "not recommended" rather than erroring. But per this audit's Section 1 verdict, RISK-SYNC-A and RISK-SYNC-B (Section 10) make Recommendation 1 worth treating as a genuine sequencing gate before Workstream 3's weighted-preference tasks (R1.2-03.07 onward) build further ranking sophistication on top of a candidate pool this audit found to be measurably smaller than the approved portfolio.

---

## 14. Acceptance Criteria Mapping

- ✔ Every destination-related runtime artefact reviewed — Sections 2, 6 (config, generated JSON, engine, validation suite, generation scripts, all cross-referenced to specific files and, where relevant, exact `jq` query results).
- ✔ Every identified mismatch documented with evidence — Section 8 (10 classified findings, each with a specific file, field, or command-output citation).
- ✔ All drift categorised — Section 8, using this EBC's own required categories (Documentation Drift, Runtime Drift, Configuration Drift, Content Gap, Intentional Future Work, Source-of-Truth Ambiguity where none of the six fit cleanly).
- ✔ The Destination Knowledge Base validated as the canonical reference — reaffirmed at the document level (consistent with Arjun's and Sophie's prior findings), while this audit's central contribution is showing it is not, in practice, the runtime's actual source of truth today (Section 9).
- ✔ A complete reconciliation report produced — this document, covering all 13 requested deliverable sections.
- ✔ Sufficient evidence for Tiger and Vivek to decide without further discovery — Sections 3, 5, 8, and 9 each trace their claims to a specific, reproducible file location or command output rather than an inference, so the findings can be independently re-verified without re-running this audit from scratch.
