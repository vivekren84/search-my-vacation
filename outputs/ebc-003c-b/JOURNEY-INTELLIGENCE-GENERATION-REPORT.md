# Journey Intelligence Generation Report

**Implementation card:** EBC-003C-B
**Workbook:** Journey Director Intelligence Enriched.xlsx
**Workbook checksum:** `b90a6af3d661197dcdebe75b941eb060788fbe2cb209b67ae4167560d5a1f8a8`
**Workbook schema version:** Not explicitly present
**Generator version:** 1.0.0
**Runtime schema version:** 1.0
**Generated at:** 2026-07-30T13:55:15.295Z

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
| journey-dna.json | 89 | 195,349 | `62fe9a15eac5e1fcb4a2163fe95fe6a34f620142f901c8ddc2e8bcd54f8d583a` |
| compatibility-matrix.json | 3382 | 690,502 | `9150b2d9f532a98c88b13ce3b8c03f0f31bfe6ad530a8c14f8e107a22d82fa53` |
| constraint-library.json | 1566 | 406,742 | `786f5ac4e30aad09e1bc092d109a204018121001aee7bb84024cb9f35ebc1f8e` |
| reason-library.json | 18 | 5,963 | `48a1452098775f05c889314a26abcd574d7d555d1486575f54b57b92bbcc31b9` |
| journey-seeds.json | 89 | 130,216 | `9b61447b3ddc5ac1866a3484c9b828e7f087b3877f9375379614a1aa59f4da70` |
| journey-templates.json | 89 | 55,395 | `d9b718487562e524cc63e4392123d6ddfbd5dd0c84717c3926340238f8c64281` |
| metadata.json | 1 | 768 | `9fb0505ee9fc1252883531d2da6dfdf9ec0991be7aa479e378baef06b28f594d` |
| intelligence-manifest.json | 1 | 2,374 | `9fee50d2eafe8a33e7150dfa0a2062a3e68f046047af6845fc2c11d4dddb0c7c` |

## Validation

- Workbook validation: **PASS**
- Artifact validation: **PASS**
- Runtime package verification: **PASS**
- Validation checks executed: 30377
- Validation checks passed: 30377
- Validation warnings: 16
- Validation failures: 0
- Manifest validation status: **PASS**
- Generation duration: 98 ms

### Warnings

- `REVIEW_REQUIRED_RECORD` (india-goa-panjim): Goa — Panjim retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-dwaraka): Gujarat — Dwaraka retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-nishkal-mahadev): Gujarat — Nishkal Mahadev retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-gujarat-byet-dwaraka): Gujarat — Byet Dwaraka retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-himachal-pradesh-leh): Himachal Pradesh — Leh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-himachal-pradesh-ladakh): Himachal Pradesh — Ladakh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-kerala-allappey): Kerala — Allappey retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-kerala-houseboats): Kerala — Houseboats retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-northeast-assam): Northeast — Assam retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-rajasthan-kumbalgarh): Rajasthan — Kumbalgarh retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-tamilnadu-chennai): TamilNadu — Chennai retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-tamilnadu-temple-tour): TamilNadu — Temple Tour retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (india-wildlife-tours-assam): Wildlife Tours — Assam retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (united-arab-emirates-abu-dabhi): UAE — Abu Dabhi retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `REVIEW_REQUIRED_RECORD` (sri-lanka-trinconmalee): Sri Lanka — Trinconmalee retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.
- `DESTINATION_WITHOUT_JOURNEY_BASE` (india-amritsar): Amritsar has no approved Journey Base and will not enter primary recommendation ranking.

## Determinism

- Generator executions: 2
- Artifacts compared: 8
- Comparison result: **IDENTICAL**
- Deterministic status: **PASS**
- Volatile fields fixed for comparison: generatedAt, durationMilliseconds

## Runtime integration

The generated package is the Journey Director runtime intelligence source. The runtime loader validates the manifest, schema versions, artifact checksums, record counts, reason references, hierarchy, and indexes before exposing candidates to the existing deterministic engine.

No workbook access occurs at application runtime. No Journey Passport flow, Journey Director user interface, navigation, or recommendation-screen redesign is included.

## Deferred limitations

- Narrative Intelligence and traveller-facing story composition remain deferred to EBC-003D.
- Live operational, seasonal, supplier, accessibility, visa, disruption, price, and availability checks remain outside this static intelligence package.
- Records marked `REVIEW_REQUIRED`, attractions, and experience clusters remain unavailable as primary recommendations.
- CI/CD automation for automatic regeneration is documented as a future enhancement.
