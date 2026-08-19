# Journey Intelligence Generator and Runtime Package

| Document field | Value |
| --- | --- |
| Work item | EBC-003C-B |
| Status | Implemented |
| Generator version | `1.0.0` |
| Runtime schema | `1.0` |
| Canonical workbook | `outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx` |
| Generated package | `web/generated/` |
| Runtime loader | `web/lib/journey-director/intelligence/` |

## Purpose

The Journey Intelligence Generator converts the approved business-authored workbook into a deterministic, typed JSON package. The Journey Director loads only that generated package at runtime; it never opens or parses the workbook in the application.

The generator and loader provide:

- workbook and cross-reference validation;
- deterministic artifact generation;
- atomic replacement with rollback protection;
- SHA-256 checksums and an Intelligence Manifest;
- fail-closed runtime integrity verification;
- in-memory lookup indexes; and
- a typed adapter into the existing deterministic recommendation engine.

The implementation does not introduce model calls, live web lookups, runtime workbook access, new scoring rules, or UI changes.

## Architecture

```mermaid
flowchart LR
    A["Canonical enriched workbook"] --> B["Typed generator and validation"]
    B --> C["Temporary generated directory"]
    C --> D["Artifact and checksum verification"]
    D --> E["Atomic web/generated package"]
    E --> F["Runtime manifest verifier"]
    F --> G["Lookup indexes"]
    G --> H["Catalogue domain adapter"]
    H --> I["Existing deterministic engine"]
```

Generation is an offline engineering workflow. Runtime loading is synchronous and self-contained so the browser receives a fully verified package or no package at all.

## Folder structure

```text
web/
  scripts/journey-intelligence/
    index.ts
    loadWorkbook.ts
    validateWorkbook.ts
    generate*.ts
    writeArtifacts.ts
    verifyArtifacts.ts
    verifyDeterminism.ts
    writeGenerationReport.ts
  generated/
    journey-dna.json
    compatibility-matrix.json
    constraint-library.json
    reason-library.json
    journey-seeds.json
    journey-templates.json
    metadata.json
    intelligence-manifest.json
  lib/journey-director/intelligence/
    index.ts
    loadRuntimeIntelligence.ts
    sha256.ts
    types.ts
```

`web/generated/` contains generated data only. Handwritten runtime logic stays under `web/lib/journey-director/intelligence/`.

## Workbook requirements

The loader requires the eight approved sheets and their documented headers:

1. Traveller Types
2. Emotional Goals
3. Desired Experiences
4. Destination Catalogue
5. Destination Intelligence
6. Compatibility Matrix
7. Source Register
8. Review Register

Validation rejects missing sheets or headers, duplicate IDs, invalid record types, out-of-range compatibility values, broken catalogue reconciliation, missing source references, invalid Journey Base data, and reason-code inconsistencies.

The workbook is read-only input. Generation calculates its SHA-256 value before work begins and confirms the same value after all artifacts and the report have been written.

## Generation workflow

From `web/`:

```bash
npm run generate:journey-intelligence -- \
  --workbook "../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx"
```

The workbook path may be omitted when using the stable project-relative default. Optional arguments are:

- `--output <directory>` — generated-package destination;
- `--report <path>` — Markdown generation report destination;
- `--no-report` — skip the report;
- `--generated-at <canonical ISO timestamp>` — fixed timestamp for reproducible verification; and
- `--duration-ms <integer>` — fixed duration metadata for controlled comparisons.

The production sequence is:

1. load and checksum the workbook;
2. validate workbook structure and cross-references;
3. run the KB → Operational Reconciliation Check (Warn Mode — see below);
4. create all seven data artifacts in memory;
5. write them to a process-specific temporary directory;
6. calculate artifact SHA-256 checksums;
7. create metadata and the Intelligence Manifest;
8. verify the complete temporary package;
9. atomically swap it into `web/generated/`;
10. verify the active package;
11. run the two-execution determinism comparison;
12. write the generation report; and
13. confirm workbook immutability.

If any step fails, the previous valid generated directory is restored and incomplete temporary output is removed. The KB → Operational Reconciliation Check never fails this sequence — see below.

### KB → Operational Reconciliation Check (WP-4)

Added under `R1.2-WS3-IMP-01A-EBC-RAD`. `validateKbReconciliation.ts` compares every `ACTIVE` destination and named Collection member region in the Destination Knowledge Base (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` §10–§11) against `kbApprovedPortfolio.ts` — a mechanical transcription of that same KB content — and reports any KB-approved item with no corresponding row in the loaded workbook's Destination Intelligence sheet.

This is a **Warn Mode** check only, ratified by `DEC-R1.2-015` (`docs/09-Development/DEC-R1.2-015-Ratification-Warn-Mode-First.md`): findings are written to a dedicated, always-present "KB → Operational Reconciliation" section of the generation report, distinct from the existing `REVIEW_REQUIRED` warnings section, and never block or alter generation. The generation report also carries a Promotion Review Checklist (ADR-R1.2-WS3-001 §9) reminding whoever promotes a new package that a change to destination inclusion or vocabulary reach requires Product & Experience approval before promotion.

Region-level reconciliation currently covers the two KB-defined Collections only (Northeast, Wildlife — KB §7.3); plain `Destination`-type KB entries are reconciled at destination level. See `docs/09-Development/R1.2-WS3-IMP-01A-EBC-RAD-WP4-Implementation.md` for the full design rationale and known follow-ups.

## Artifact responsibilities

| Artifact | Responsibility |
| --- | --- |
| `journey-dna.json` | Eligible Journey Base identity, hierarchy, emotion, experience, pace, comfort, season and operational fields |
| `compatibility-matrix.json` | Region-level 0–5 traveller, emotion, experience, comfort and pace compatibility |
| `constraint-library.json` | Deterministic contradictions and penalties |
| `reason-library.json` | Controlled reason-code definitions referenced by compatibility and constraints |
| `journey-seeds.json` | Governed narrative seeds for later composition work |
| `journey-templates.json` | Duration and journey-rhythm structure |
| `metadata.json` | Package-level provenance, counts and validation summary |
| `intelligence-manifest.json` | Package identity, checksums, counts, validation and generation metadata |

## Intelligence Manifest

The manifest records:

- schema and generator versions;
- generation timestamp;
- workbook filename, SHA-256 checksum and available workbook metadata;
- every runtime artifact path and SHA-256 checksum;
- record counts;
- generation metrics; and
- validation totals, warnings, failures and `REVIEW_REQUIRED` count.

The manifest intentionally does not checksum itself. Its checksum is reported in the Markdown generation report.

All JSON files use stable recursive key ordering, two-space indentation, UTF-8 and a final newline. This canonical representation is also used by the browser-compatible runtime SHA-256 implementation.

## Runtime verification and loading

`runtimeJourneyIntelligence` is created once when the Journey Director catalogue module loads. The loader imports all eight JSON files and verifies the whole package before exposing any record.

Runtime checks include:

- supported schema and generator versions;
- manifest validation status;
- exact artifact paths;
- SHA-256 integrity for all seven data artifacts;
- common workbook checksum headers;
- non-zero manifest counts and exact artifact counts;
- metadata/manifest agreement;
- unique region, hierarchy, constraint and reason IDs;
- acyclic hierarchy and valid parent references;
- Journey DNA eligibility;
- compatibility score ranges and reason references;
- constraint target and reason references; and
- complete seed and template region coverage.

An invalid package throws `RuntimeIntelligenceIntegrityError`. The application does not use a partial package or silently fall back to the removed hard-coded intelligence source.

## Runtime lookup indexes

The verified package constructs these in-memory indexes:

- `JourneyDNAByRegionId`;
- `JourneyDNAByDestinationId`;
- `CompatibilityByRegionId`;
- `ConstraintBySource`;
- `ConstraintByTarget`;
- `ReasonByCode`;
- `JourneySeedByRegionId`;
- `JourneyTemplateByRegionId`; and
- `HierarchyByNodeId`.

The indexes are runtime optimisations and are never serialized. The catalogue adapter groups generated Journey Bases by destination and maps the workbook vocabulary into the existing typed `JourneyCandidate` contract. The recommendation engine, weights, ranking, selection, and recommendation personalities remain separate from the loader.

## Validation commands

Run from `web/`:

```bash
npm run verify:journey-intelligence -- \
  --generated generated \
  --workbook "../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx"

npm run verify:journey-intelligence:determinism -- \
  --workbook "../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx"

npm run verify:journey-intelligence:runtime
npm run verify:journey-intelligence:steering
npm run verify:journey-catalogue
npm run verify:journey-engine
npm run verify:journey-presentation
npm run verify:journey-orchestration
npm run verify:journey-runtime
```

The runtime integration suite also proves that a modified artifact fails checksum verification and that an unsupported manifest schema fails before catalogue use.

## Regeneration procedure

1. Confirm the workbook is the approved canonical input.
2. Record its SHA-256 checksum.
3. Run the generator with the explicit workbook path.
4. Review warnings and the `REVIEW_REQUIRED` count in the report.
5. Run artifact, runtime, catalogue, engine, orchestration, lint and type checks.
6. Run determinism verification.
7. Confirm the workbook SHA-256 is unchanged.
8. Review `git status` and include only intended generated, runtime, test and documentation changes in normal repository review.

Do not hand-edit generated JSON. Correct the workbook or generator, then regenerate the complete atomic package.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Workbook not found | Pass the project-relative workbook path after `--workbook`. |
| Missing sheet/header | Restore the approved workbook schema; do not bypass validation. |
| Duplicate or broken ID | Correct the business source or deterministic ID rule, then regenerate. |
| Artifact checksum mismatch | Regenerate all artifacts; do not edit JSON manually. |
| Runtime reports an unsupported version | Update the loader only through an approved schema/generator migration. |
| Runtime index is incomplete | Run artifact verification and inspect orphan region references. |
| Determinism comparison fails | Remove randomness, locale-dependent ordering, implicit timestamps, or nondeterministic iteration. |
| Generation fails during replacement | The previous package should remain active; inspect the structured failure event and rerun after correction. |
| Workbook checksum changes | Stop immediately and restore the approved workbook through the repository’s normal owner-controlled process. |

## Deferred scope

Narrative composition, traveller-specific story generation, multi-destination composition, live operational data, availability, prices, visa and safety checks, and CI/CD regeneration automation remain outside EBC-003C-B.
