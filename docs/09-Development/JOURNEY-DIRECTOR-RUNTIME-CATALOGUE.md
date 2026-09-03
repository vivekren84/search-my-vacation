# Journey Director Runtime Catalogue

> **Search My Vacation — Engineering Governance Note**

| Document field | Value |
| --- | --- |
| **Document** | `JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md` |
| **Version** | v1.1.0 |
| **Status** | Implemented for Release 1 |
| **Owner** | Search My Vacation — Product, Operations, and Engineering |
| **Module** | Journey Director |
| **Last updated** | 30 July 2026 |
| **Purpose** | Define the generated runtime-intelligence boundary, catalogue adapter, validation rules, and known limitations used by the deterministic Journey Director engine. |
| **Governing architecture** | `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` (Status: Accepted) — the layered-architecture and ownership authority for the Operational, Generation, Runtime, and Consumption layers referenced in Section 13 below. |

---

## 1. Purpose

The runtime catalogue is the typed decision-domain representation of the generated Journey Intelligence package.

It supplies the deterministic Journey Director engine with stable candidate identity, eligibility traits, traveller suitability, themes, emotions, pace, comfort, regional intelligence, explainable evidence, and governed exclusions.

It does not score travellers, rank destinations, select recommendation personalities, create guest-facing narratives, or provide presentation assets.

The implementation lives in:

```text
web/lib/journey-director/catalogue/
```

The runtime source is:

```text
web/generated/intelligence-manifest.json
```

The manifest traces every artifact to the canonical enriched workbook and its SHA-256 checksum. The runtime never reads the workbook directly.

---

## 2. Runtime Boundary

```text
Canonical enriched workbook
        │
        ▼
Generated and verified JSON package
        │
        ▼
Governed Runtime Candidate Catalogue
        │
        ▼
Deterministic Journey Director Engine
        │
        ▼
Recommendation Adapter
        │
        ▼
Journey Director UI
```

The runtime catalogue owns decision facts only.

It must not import:

- verification fixtures;
- presentation configuration;
- React or Next.js;
- browser state;
- live APIs;
- pricing, inventory, visa, safety, or availability data.

The engine consumes the catalogue through the existing `JourneyCandidate` contract. No engine eligibility or scoring rule is weakened by this implementation.

---

## 3. Catalogue Composition

The generated Release 1 package currently contains:

- 22 active destination or collection candidates with at least one approved Journey Base;
- 89 generated Journey Base region records;
- four coming-soon portfolio entries held in a separate exclusion registry;
- no verification fixture reused or re-exported at runtime.

The adapter groups Journey DNA records by their generated destination ID. Review-only records, attractions, experience clusters, and destinations without an approved Journey Base do not enter the candidate array.

The following records remain outside the engine candidate array:

- Australia & New Zealand;
- China;
- East Africa;
- Japan.

These records lack the approved destination and region matching fields required by the engine and are explicitly `COMING_SOON`. Keeping them in a separate governed exclusion registry preserves the hard exclusion without inventing unsupported matching data.

---

## 4. Catalogue Metadata and Versioning

| Field | Release 1 value |
| --- | --- |
| Catalogue version | `journey-intelligence-<generator-version>-<workbook-checksum-prefix>` |
| Effective from | Manifest generation date |
| Review valid until | 30 days after the manifest generation date |
| Source document | `web/generated/intelligence-manifest.json` |
| Source version | Manifest generator version |
| Operational snapshot | Stable workbook-checksum-derived identifier |

The 30-day validity window follows the monthly destination-status review cadence in the Knowledge Base. It is a catalogue-level governance window, not evidence that each destination was independently reviewed on a different date.

Changing any governed candidate field requires a new catalogue version or operational snapshot, the appropriate Product or Operations approval, updated documentation, and a passing catalogue verification run.

---

## 5. Source-to-Contract Field Review

| Engine field | Release 1 source treatment |
| --- | --- |
| Identity, name, aliases, and category | Derived directly from approved destination and region records. |
| Portfolio status | Derived directly from `ACTIVE` or `COMING_SOON`. |
| Service confidence | Governed by the temporary mapping in Section 6; never inferred from status beyond that mapping. |
| Primary and supporting emotions | Derived from approved destination and region emotional identity. |
| Themes | Uses the controlled Knowledge Base vocabulary represented by the engine contract. |
| Traveller suitability | Includes only traveller types present in both source and engine contracts. |
| Pace and comfort | Derived directly from approved records. |
| Monthly seasonality | Defaults to `UNKNOWN`; explicitly approved presentation-ready records may carry governed guidance. |
| Memory goals | Derived through the common taxonomy in Section 7. |
| Logistical fit | Defaults to the neutral baseline; explicitly approved records may carry governed values. |
| Concerns | Created only by the deterministic classification in Section 8. |
| Evidence | Paraphrases approved identity and taxonomy, with stable identifiers. |
| Presentation readiness | Defaults to a material gap; five explicitly approved records carry separate readiness provenance. |

`dataQuality: COMPLETE` means that the candidate has the structurally required governed matching fields for this catalogue. It does not assert current weather, route, supplier, safety, visa, inventory, accessibility, or service conditions.

---

## 6. Release 1 Temporary Governance Mappings

### 6.1 Portfolio status and service confidence

Destination portfolio status and operational service confidence are separate governance concepts.

| Portfolio state | Temporary engine service confidence |
| --- | --- |
| `ACTIVE` | `SUPPORTED` by default |
| `ACTIVE` with explicit confidence approval provenance | `CONFIDENT` |
| `LIMITED` | `LIMITED` |
| `PAUSED` or `INACTIVE` | `PAUSED` |

`ACTIVE` means that the destination has at least one generated, recommendation-eligible Journey Base. `SUPPORTED` is the temporary Release 1 operational baseline. It does not mean that Operations has approved the destination at the highest confidence level.

**No destination is classified as CONFIDENT in Release 1 unless it has separate explicit approval provenance.**

The generated catalogue adapter retains explicit confidence approval provenance for:

- Bali;
- Goa;
- Kerala;
- Sri Lanka; and
- Vizag.

All other active candidates remain `SUPPORTED`. Recommendation personalities that require `CONFIDENT`, including The Hidden Gem under the current engine contract, may draw only from the explicit approval list. When no approved candidate satisfies the remaining fit and personality gates, the engine must return fewer possibilities rather than manufacture a result.

### 6.2 Region status

For this catalogue version only:

```text
A destination included in the approved Release 1 portfolio
→ its configured region is considered ACTIVE for this catalogue version
```

This is a release-governance mapping. It is not a claim about live destination conditions, operating dates, inventory, safety, weather, or access.

### 6.3 Catalogue review window

Every active candidate and generated Journey Base references the same manifest-derived 30-day catalogue governance window. No historic destination-specific review date is invented.

### 6.4 Seasonality defaults and approved guidance

The workbook provides broad prose rather than month-by-month operating guarantees. The runtime catalogue therefore defaults all 12 months to `UNKNOWN` outside the five existing confidence-approved candidates. Bali, Goa, Kerala, Sri Lanka, and Vizag retain the existing governed `PREFERRED` compatibility treatment.

Fixed-date Passport inputs remain subject to the engine's existing unknown-seasonality eligibility rule. Flexible timing receives the engine's existing neutral treatment. The catalogue does not translate broad prose into monthly suitability.

### 6.5 Logistical-fit default and approved values

The engine contract requires a number and has no `UNKNOWN` value. Release 1 therefore defaults generated regions to `0.5`. Regions in the five existing confidence-approved destination groups retain the governed `0.9` confident baseline. Candidates outside that approval provenance cannot receive a differentiated value.

### 6.6 Evidence readiness

Destination knowledge does not prove approved imagery, editorial moments, or presentation readiness.

Every Release 1 runtime candidate defaults to:

```text
approvedImageryReferenceCount: 0
journeyMomentCount: 0
hasQualifiedRegionContent: false
hasMaterialContentGap: true
```

Bali, Goa, Kerala, Sri Lanka, and Vizag are explicit exceptions. Each carries one approved imagery reference, three governed journey moments, qualified region content, and no material presentation-content gap. These values provide the evidence-readiness required by the current personality rules; the presentation catalogue itself still cannot alter eligibility, scores, ranking, or selection.

### 6.7 Traveller-type intersection

Only the intersection of the Knowledge Base and engine contracts is mapped:

- Solo Traveller → `solo-traveller`;
- Couple → `couple`;
- Family → `family`;
- Friends → `friends`;
- Corporate Group → `corporate-group`.

The following Knowledge Base profiles are not collapsed into broader engine profiles:

- Honeymoon;
- Multi-generation Family;
- Senior Travellers;
- Educational Group;
- interest-led labels such as culture, wildlife, food, nature, or photography travellers.

These remain Release 1 contract gaps. Their omission is not an assertion of unsuitability.

---

## 7. Memory-Goal Taxonomy

Memory goals are derived identically for every candidate from approved themes. No destination-specific memory goal is added outside this table.

| Approved theme or governed experience category | Supported engine memory goals |
| --- | --- |
| Adventure | Active Discovery |
| Architecture | Cultural Discovery; Photographic Memories |
| Backwaters | Nature Connection; Restorative Calm; Shared Time |
| Beaches | Island Escape; Restorative Calm |
| City Break | Urban Discovery |
| Coffee Estates | Nature Connection; Cultural Discovery |
| Cruises | Shared Time; Restorative Calm |
| Culture | Cultural Discovery |
| Desert | Active Discovery; Photographic Memories |
| Family Attractions | Shared Time; Celebration Moments |
| Festivals | Celebration Moments; Cultural Discovery |
| Food | Food Discovery |
| Forests | Nature Connection; Restorative Calm |
| Heritage | Cultural Discovery |
| Hills | Nature Connection |
| Islands | Island Escape; Nature Connection |
| Lakes | Nature Connection; Restorative Calm |
| Local Communities | Cultural Discovery; Shared Time |
| Luxury | Restorative Calm; Celebration Moments |
| Mountains | Nature Connection; Active Discovery |
| Nature | Nature Connection |
| Nightlife | Celebration Moments |
| Photography | Photographic Memories |
| Rivers | Nature Connection |
| Road Trips | Active Discovery |
| Safari | Wildlife Encounters; Active Discovery |
| Scenic Drives | Nature Connection; Photographic Memories |
| Shopping | Urban Discovery; Celebration Moments |
| Slow Travel | Restorative Calm; Shared Time |
| Snow Experiences | Winter Wonder |
| Spiritual | Cultural Discovery; Restorative Calm |
| Tea Estates | Nature Connection; Cultural Discovery |
| Villages | Cultural Discovery; Shared Time |
| Water Sports | Active Discovery; Island Escape |
| Wellness | Restorative Calm |
| Wildlife | Wildlife Encounters; Nature Connection |

The mapping is implemented once in `THEME_MEMORY_GOAL_MAP` and applied to both destination and region records.

---

## 8. Concern Classification

Only source statements matching the following deterministic rules become engine concerns.

| Concern category | Triggering source terminology | Default severity | Behaviour |
| --- | --- | --- | --- |
| `transfer-or-pace-friction` | transfer, road, distance, movement, city-hopping, one-night, inter-island | Moderate | Cautionary penalty only when the Passport indicates a relaxed pace. |
| `soft-preference-conflict` | crowd, noise, nightlife, high-energy, party | Minor | Informational/cautionary penalty only for relaxation, serenity, or reconnection signals. |

The classifier does not create an excluding concern. Hard exclusions remain governed by portfolio status, service confidence, data quality, region eligibility, and the engine's existing mandatory gates.

Season, weather, wildlife, safety, permit, access, and similar prose are not converted into generic always-on penalties because the current concern condition contract cannot express those live circumstances reliably. They remain source gaps for human Journey Director validation.

---

## 9. Diversity-Axis Mapping

Diversity values are generated from existing governed fields. They are not written to force a Beautiful Puzzle result.

| Engine diversity axis | Deterministic source mapping |
| --- | --- |
| `setting-geography` | Domestic or international category plus approved landscape themes from the destination and configured region. |
| `journey-rhythm` | Approved destination pace values. |
| `dominant-theme` | First four unique approved destination and region themes in governed source order. |
| `signature-experience-style` | Approved activity, lifestyle, nature-activity, and special-interest themes; otherwise the common `not-specified` sentinel. |
| `cultural-expression` | Approved culture-group themes; otherwise the common `not-specified` sentinel. |

The sentinel represents the absence of a governed value; it is not a candidate characteristic. If two candidates remain identical on an axis, the engine preserves that result.

---

## 10. Runtime, Verification, and Presentation Separation

| Layer | Owns | Must not own |
| --- | --- | --- |
| Runtime catalogue | Eligibility and matching facts, governed evidence, exclusions, version metadata | Fixtures, editorial copy, images, UI state, ranking logic |
| Verification fixtures | Synthetic records used to exercise every engine outcome and personality | Production recommendation data |
| Presentation catalogue | Display summary, images, moments, CTA, handoff copy | Eligibility, scores, service confidence, ranking, suppression |

The catalogue verifier scans runtime files for prohibited fixture, presentation, React, Next.js, and browser imports. It also confirms that presentation adaptation leaves the engine result unchanged.

---

## 11. Deterministic Validation

Run:

```bash
npm run verify:journey-catalogue
```

The verification asserts:

1. every generated destination with a Journey Base and all four portfolio exclusions are represented;
2. candidate identifiers are unique and deterministically ordered;
3. no `ACTIVE → CONFIDENT` implicit mapping exists;
4. no candidate is `CONFIDENT` without explicit approval provenance;
5. every candidate and region references the catalogue review window;
6. candidates without explicit guidance retain 12 `UNKNOWN` monthly values;
7. candidates without explicit readiness provenance retain the neutral logistical baseline;
8. the memory-goal mapping covers every engine theme;
9. only documented concern classifications are active;
10. verification fixtures and presentation code are not runtime dependencies;
11. candidates are serializable and engine-consumable;
12. identical inputs and catalogue versions produce identical results;
13. insertion order cannot change recommendation order;
14. incomplete input and no-result recovery remain available;
15. confidence-dependent personalities remain limited to explicitly approved evidence;
16. presentation metadata cannot influence engine decisions.

---

## 12. Known Release 1 Limitations

- Only Bali, Goa, Kerala, Sri Lanka, and Vizag have explicit `CONFIDENT` provenance.
- The Hidden Gem may therefore draw only from that approval list and may be absent when no remaining approved candidate meets its gates.
- Monthly suitability remains unknown outside the explicit Bali, Kerala, and Sri Lanka guidance.
- Logistical fit remains neutral outside the four explicitly approved regional values.
- All 89 generated Journey Bases are represented; hierarchy corrections marked `REVIEW_REQUIRED` remain excluded until business approval.
- Honeymoon, multi-generation, senior, educational, and interest-led traveller profiles are not represented by the engine traveller-type contract.
- Accessibility, visa, safety, budget, duration, inventory, and price are not recommendation inputs.
- Presentation-asset readiness is explicitly approved for only five candidates and is not inferred from destination knowledge.
- Some source trade-offs remain human-review notes because the engine concern contract cannot express their conditions faithfully.

These limitations are intentional. Unknown information remains unknown, weak results remain suppressed, and the human Journey Director remains responsible for consultation, refinement, itinerary design, current-condition validation, and final traveller handoff.

---

## 13. Ownership and Update Process

| Responsibility | Owner |
| --- | --- |
| Destination and region product status | Product & Experience with Operations approval |
| Operational layer (seed/enriched workbook) row set and taxonomy sheets | **Destination Operational Steward** — role not yet assigned to any Team Satvi persona (see governance note below) |
| `CONFIDENT` approval provenance | Operations |
| Source taxonomy and emotional identity | Product & Experience |
| Runtime representation and automated validation | Engineering |
| Live date, safety, access, supplier, and service validation | Human Journey Director and Operations |
| Presentation assets and editorial readiness | Content & Experience |

**Governance note:** the Operational Layer row added above names an artefact this document previously left implicit — the seed/enriched workbook that the generator reads. Its ownership gap (the unassigned Destination Operational Steward role) is tracked as Outstanding Decision 1 in `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` Section 15; it is named here for visibility and is not resolved by this update.

To update the catalogue:

1. approve the source change in the canonical enriched workbook;
2. record any separate Operations confidence approval;
3. run the Journey Intelligence Generator to atomically replace `web/generated/`;
4. verify the manifest and deterministic artifact checksums;
5. run runtime integration, catalogue, engine, presentation, TypeScript, lint, and build validation;
6. record the change through normal repository review.

The runtime catalogue must never become an informal substitute for Product or Operations approval.
