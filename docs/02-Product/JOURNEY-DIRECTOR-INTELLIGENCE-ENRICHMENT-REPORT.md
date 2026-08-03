# Journey Director Intelligence Enrichment Report

**Work item:** EBC-003C-A  
**Generated:** 30 July 2026  
**Canonical input:** `Journey Director Intelligence Input-2.xlsx`  
**Derived review workbook:** `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx`

## Executive summary

The Release 1 Journey Director workbook has been enriched as a separate, derived review artifact. The source workbook remains the editable business source of truth and was not modified.

The enriched workbook contains all 107 source destination-region rows, stable identifiers, region-level Journey DNA, explainable compatibility scores, contradiction metadata, narrative seeds, suggested journey rhythms, source traceability, and an explicit review register.

No Journey Director runtime, user interface, production JSON, or recommendation-engine file was changed by this enrichment task. The workbook is ready for business review, but it should not be integrated into production until the open Review Register items are resolved or formally accepted.

## Coverage

| Measure | Result |
| --- | ---: |
| Destination-region records | 107 |
| Journey bases | 89 |
| Attraction or experience-cluster records | 6 |
| Island records | 8 |
| Records with `REVIEW_REQUIRED` operational confidence | 15 |
| Review Register items | 297 |
| Source Register entries | 247 |

`Journey Base Status` is recorded separately from record type so that islands and other region types can still be identified as suitable bases without losing their more precise classification.

## Workbook structure

The derived workbook contains the required eight sheets:

1. **Traveller Types** — preserves the canonical traveller taxonomy.
2. **Emotional Goals** — adds a stable header to the canonical values.
3. **Desired Experiences** — adds a stable header to the canonical values.
4. **Destination Catalogue** — preserves all 107 canonical destination-region rows.
5. **Destination Intelligence** — contains stable IDs, Journey DNA, explainable compatibility scores and reasons, constraints, operational notes, story seeds, and suggested journey templates.
6. **Compatibility Matrix** — exposes formula-linked 0–5 scores for review, with a human-readable legend and contradiction guidance.
7. **Source Register** — traces each destination-region record to the canonical workbook, the trusted repository knowledge base, and selected official corroboration where used.
8. **Review Register** — contains corrections, evidence gaps, potential semantic duplicates, and candidate additions; no unresolved item is silently treated as approved fact.

## Methodology

The enrichment was produced deterministically from:

- the canonical workbook identity and taxonomy;
- the existing repository destination knowledge base;
- concise corroboration from selected official tourism sources recorded in the Source Register; and
- rule-based classification, scoring, and reason-code generation.

The generation process:

1. preserved each source destination-region row;
2. normalised stable identifiers without overwriting source labels;
3. classified each record as a journey base, attraction, experience cluster, island, city, or region;
4. generated region-preferred Journey DNA with destination-level fallback;
5. scored every traveller, emotion, and experience dimension from 0 to 5;
6. attached a reusable reason code and explanation to every score;
7. represented deterministic incompatibilities as score `0` with a contradiction reason;
8. generated structured story seeds and journey rhythm rather than fixed itineraries; and
9. routed unsupported operational assertions and catalogue ambiguities to the Review Register.

No randomness, hidden model calls, or untraceable free-text enrichment is required to regenerate the workbook.

## Corrections requiring approval

The source catalogue was preserved verbatim. The following likely spelling or structural corrections are recorded for review rather than silently applied:

- Panjim → Panaji
- Dwaraka → Dwarka
- Byet Dwaraka → Bet Dwarka
- Kumbalgarh → Kumbhalgarh
- Allappey → Alappuzha
- TamilNadu → Tamil Nadu
- Abu Dabhi → Abu Dhabi
- Trinconmalee → Trincomalee
- Nishkal Mahadev → confirm the intended Nishkalank Mahadev reference
- Leh / Ladakh → confirm placement outside Himachal Pradesh
- Houseboats and Temple Tour → confirm whether these remain experience clusters rather than regions
- Northeast / Assam and Wildlife Tours / Assam → confirm the intended destination-region ownership model

Repeated region names under multiple catalogue destinations, including Kabini, Bandipur, Masinagudi, Assam, Ranthambore, and Gir National Park, are flagged as potential semantic duplicates. Source rows were not removed or merged.

## Potential additions for business review

The Review Register proposes, but does not add, the following coverage:

- Assam as a distinct destination
- Corbett in the wildlife portfolio
- Kumarakom, Thekkady / Periyar, and Varkala / Kovalam for Kerala
- Mamallapuram, Rameswaram, and Thanjavur / Chettinad for Tamil Nadu
- Penang / George Town and Cameron Highlands for Malaysia
- Marina Bay, Sentosa, and Civic District for Singapore
- Nuwara Eliya / Ella and Yala / Udawalawe for Sri Lanka

These are review candidates only and are not part of the canonical 107-row dataset.

## Validation results

| Validation | Result |
| --- | --- |
| Canonical source checksum before generation | `04fe08e23eca2c9d66a14a4b2a08a4d824efba1e8f193fb8e143f5512dbb6208` |
| Canonical source checksum after generation | Identical |
| Required sheets present | Pass |
| Source catalogue rows represented | Pass — 107 of 107 |
| Stable destination-region IDs unique | Pass |
| Journey DNA present for every record | Pass |
| Primary experience present for every record | Pass |
| `Avoid When` present for every record | Pass |
| Compatibility scores within 0–5 | Pass |
| Reason present for every compatibility score | Pass |
| Score-0 contradictions use explicit contradiction reasons | Pass |
| Source trace present for every record | Pass |
| Formula-error scan | Pass — no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` |
| Visual review of all eight sheets | Pass |
| Canonical workbook modified | No |
| Production or UI files changed by this task | No |

## Limitations

- The workbook is a review artifact, not an operational booking guarantee.
- Accessibility, transport, supplier, property, seasonal, and live availability details require current operational evidence.
- `REVIEW_REQUIRED` deliberately replaces unsupported certainty.
- Compatibility scores express deterministic portfolio fit; they do not represent real-time price, availability, visa, weather, safety, or disruption conditions.
- Official corroboration is selective rather than an exhaustive destination research dossier.
- Proposed corrections and additions require business-owner approval before the canonical workbook is edited and regenerated.

## Recommendation

Approve the workbook first as a governed intelligence review baseline. Then:

1. resolve or formally accept the high-priority catalogue and operational-confidence items;
2. decide the canonical ownership model for repeated regions and experience clusters;
3. approve or reject the proposed portfolio additions;
4. update only the canonical workbook with accepted business changes; and
5. regenerate and revalidate before any production integration.

Production integration should remain a separate work item with explicit schema versioning, runtime compatibility tests, and Journey Director regression tests.
