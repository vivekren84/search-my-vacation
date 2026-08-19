# Journey Intelligence Generation Report

**Implementation card:** EBC-003C-B
**Workbook:** Journey Director Intelligence Enriched.xlsx
**Workbook checksum:** `868271e5d094d0c0915f8963da57cce6b57a37d432b0c14869867791c0bc1047`
**Workbook schema version:** Not explicitly present
**Generator version:** 1.0.0
**Runtime schema version:** 1.0
**Generated at:** 2026-08-19T13:34:04.023Z

## Generation summary

| Measure | Count |
| --- | ---: |
| Destination-region records processed | 107 |
| Journey Bases generated | 89 |
| Attractions processed | 4 |
| Experience Clusters processed | 2 |
| Islands processed | 8 |
| Traveller Types processed | 5 |
| Emotional Goals processed | 11 |
| Desired Experiences processed | 15 |
| REVIEW_REQUIRED records inherited | 15 |

## Runtime artifacts

| Artifact | Records | Size (bytes) | SHA-256 |
| --- | ---: | ---: | --- |
| journey-dna.json | 89 | 195,594 | `3194d80e324ae7908e11e2fc78eaa470c8fe68ca045dd6029eea507e3911ced6` |
| compatibility-matrix.json | 3382 | 690,502 | `64390bc22016f889381c4a56a83bbf1d2ee80405f999bf092b3ae98ae39ae7c9` |
| constraint-library.json | 1566 | 406,733 | `727a434e1dc93dd088d7fddbb6837ae9e4ad14338a0910c094339f61f99c2f2b` |
| reason-library.json | 18 | 5,963 | `afb1b0432f8ee5ec2765da59804eacdb70239054aaba314e4b1d7e280a5e3d15` |
| journey-seeds.json | 89 | 130,216 | `f41260fdd9eb57fbac0a8c5ad15b4d97b351fb0210c571aa731ccd51e67174a3` |
| journey-templates.json | 89 | 55,395 | `4fe806f2bf760d8354f01f374e9c2434e38c9027c1baa32d3f073afeb824a446` |
| metadata.json | 1 | 768 | `cc518bf7d7b1dc4dc6a570aa5e43d4c0ef3333daae53fdd0ebed266c79aac2a0` |
| intelligence-manifest.json | 1 | 2,411 | `3658bf07e92ba3ec7e07449ba266499346e76cfe158039f5a7849556e6a4d322` |

## Validation

- Workbook validation: **PASS**
- Artifact validation: **PASS**
- Runtime package verification: **PASS**
- Validation checks executed: 30380
- Validation checks passed: 30380
- Validation warnings: 17
- Validation failures: 0
- Manifest validation status: **PASS**
- Generation duration: 112 ms

### Warnings

- `REVIEW_REQUIRED_RECORD` (india-goa-panjim): Goa — Panjim retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-dwaraka): Gujarat — Dwaraka retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-nishkal-mahadev): Gujarat — Nishkal Mahadev retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-byet-dwaraka): Gujarat — Byet Dwaraka retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-himachal-pradesh-leh): Himachal Pradesh — Leh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-himachal-pradesh-ladakh): Himachal Pradesh — Ladakh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-kerala-allappey): Kerala — Allappey retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-kerala-houseboats): Kerala — Houseboats retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-assam-assam): Assam — Assam retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-rajasthan-kumbalgarh): Rajasthan — Kumbalgarh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-tamilnadu-chennai): TamilNadu — Chennai retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-tamilnadu-temple-tour): TamilNadu — Temple Tour retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-assam-kaziranga): Assam — Kaziranga retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (united-arab-emirates-abu-dabhi): UAE — Abu Dabhi retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (sri-lanka-trinconmalee): Sri Lanka — Trinconmalee retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `DESTINATION_WITHOUT_JOURNEY_BASE` (india-amritsar): Amritsar has no approved Journey Base and will not enter primary recommendation ranking.
- `DESTINATION_WITHOUT_JOURNEY_BASE` (india-assam): Assam has no approved Journey Base and will not enter primary recommendation ranking.

## KB → Operational Reconciliation (WP-4)

Compares every KB §10/§11 `ACTIVE` destination and named Collection member region (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`) against this workbook's Destination Intelligence rows. This section is separate from the Warnings above and is never omitted, regardless of finding count — see `docs/09-Development/R1.2-WS3-IMP-01A-EBC-RAD-WP4-Implementation.md`.

- Operating mode: **WARN** (Warn Mode First — ratified `DEC-R1.2-015`; findings are reported and do not block this run; Block Mode is not approved for Release 1.2 Phase 2)
- KB destinations/collections checked: 24
- KB Collection member regions checked: 7
- Findings: 9

- `KB_MEMBER_REGION_ABSENT` (KB §10.11): Northeast — Darjeeling (KB §10.11) is a named member region of the "Northeast" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "Northeast" destination.
- `KB_DESTINATION_ABSENT` (KB §10.16): Hyderabad (KB §10.16, Domestic, Destination) is ACTIVE in the Destination Knowledge Base but has no corresponding row in the operational workbook's Destination Intelligence sheet.
- `KB_DESTINATION_ABSENT` (KB §10.17): Vizag (KB §10.17, Domestic, Destination) is ACTIVE in the Destination Knowledge Base but has no corresponding row in the operational workbook's Destination Intelligence sheet.
- `KB_DESTINATION_ABSENT` (KB §10.18): Wildlife (KB §10.18, Domestic, Collection) is ACTIVE in the Destination Knowledge Base but has no corresponding row in the operational workbook's Destination Intelligence sheet.
- `KB_MEMBER_REGION_ABSENT` (KB §10.18): Wildlife — Kabini (KB §10.18) is a named member region of the "Wildlife" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "Wildlife" destination.
- `KB_MEMBER_REGION_ABSENT` (KB §10.18): Wildlife — Corbett (KB §10.18) is a named member region of the "Wildlife" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "Wildlife" destination.
- `KB_MEMBER_REGION_ABSENT` (KB §10.18): Wildlife — Bandipur (KB §10.18) is a named member region of the "Wildlife" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "Wildlife" destination.
- `KB_MEMBER_REGION_ABSENT` (KB §10.18): Wildlife — Masinagudi (KB §10.18) is a named member region of the "Wildlife" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "Wildlife" destination.
- `KB_DESTINATION_ABSENT` (KB §11.2): Dubai (KB §11.2, International, Destination) is ACTIVE in the Destination Knowledge Base but has no corresponding row in the operational workbook's Destination Intelligence sheet.

## Determinism

- Generator executions: 2
- Artifacts compared: 8
- Comparison result: **IDENTICAL**
- Deterministic status: **PASS**
- Volatile fields fixed for comparison: generatedAt, durationMilliseconds

## Runtime integration

The generated package is the Journey Director runtime intelligence source. The runtime loader validates the manifest, schema versions, artifact checksums, record counts, reason references, hierarchy, and indexes before exposing candidates to the existing deterministic engine.

No workbook access occurs at application runtime. No Journey Passport flow, Journey Director user interface, navigation, or recommendation-screen redesign is included.

## Promotion Review Checklist (ADR §9)

A successful generation run is not, by itself, automatically promotable to `web/generated/`. Per the ADR's Change Authority Matrix (§9, "Generator default source path / promotion of a new generated package"), Product & Experience approval is required before promotion whenever a change **alters destination inclusion or vocabulary reach**; it is not required for routine content refresh.

- [ ] KB → Operational Reconciliation findings above have been reviewed.
- [ ] This run has open KB reconciliation findings — confirm whether promoting this package changes destination inclusion relative to the currently promoted package before proceeding.
- [ ] If destination inclusion or vocabulary reach changes as a result of promoting this package, Product & Experience approval has been obtained (ADR §9).
- [ ] If this is routine content refresh only (no inclusion or vocabulary-reach change), promotion may proceed under Engineering's existing authority.

## Deferred limitations

- Narrative Intelligence and traveller-facing story composition remain deferred to EBC-003D.
- Live operational, seasonal, supplier, accessibility, visa, disruption, price, and availability checks remain outside this static intelligence package.
- Records marked `REVIEW_REQUIRED`, attractions, and experience clusters remain unavailable as primary recommendations.
- CI/CD automation for automatic regeneration is documented as a future enhancement.
