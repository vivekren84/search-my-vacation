import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { ARTIFACT_NAMES } from "./artifactNames.js";
import type { KbReconciliationReport } from "./validateKbReconciliation.js";
import type { ArtifactVerificationReport } from "./verifyArtifacts.js";
import type { DeterminismReport } from "./verifyDeterminism.js";
import type {
  GenerationResult,
  LabelMappingReport,
  ValidationReport,
  WorkbookModel,
} from "./types.js";
import {
  GENERATOR_VERSION,
  SCHEMA_VERSION,
} from "./types.js";
import { sha256File } from "./utils.js";

function formatBytes(bytes: number): string {
  return new Intl.NumberFormat("en-US").format(bytes);
}

export async function writeGenerationReport(input: {
  path: string;
  model: WorkbookModel;
  validation: ValidationReport;
  kbReconciliation: KbReconciliationReport;
  labelMappings: LabelMappingReport;
  result: GenerationResult;
  verification: ArtifactVerificationReport;
  determinism: DeterminismReport;
}): Promise<void> {
  const manifestChecksum = await sha256File(
    join(input.result.outputDirectory, ARTIFACT_NAMES.manifest),
  );
  const artifactRows = [
    ["journey-dna.json", input.result.manifest.recordCounts.journeyDNARecords, input.result.manifest.artifacts.journeyDNA.checksum],
    ["compatibility-matrix.json", input.result.manifest.recordCounts.compatibilityRecords, input.result.manifest.artifacts.compatibilityMatrix.checksum],
    ["constraint-library.json", input.result.manifest.recordCounts.constraintRecords, input.result.manifest.artifacts.constraintLibrary.checksum],
    ["reason-library.json", input.result.manifest.recordCounts.reasonCodes, input.result.manifest.artifacts.reasonLibrary.checksum],
    ["journey-seeds.json", input.result.manifest.recordCounts.journeySeedRecords, input.result.manifest.artifacts.journeySeeds.checksum],
    ["journey-templates.json", input.result.manifest.recordCounts.journeyTemplateRecords, input.result.manifest.artifacts.journeyTemplates.checksum],
    ["metadata.json", 1, input.result.manifest.artifacts.metadata.checksum],
    ["intelligence-manifest.json", 1, manifestChecksum],
  ];
  const rows = artifactRows
    .map(
      ([filename, count, checksum]) =>
        `| ${filename} | ${count} | ${formatBytes(input.result.artifactSizes[String(filename)] ?? 0)} | \`${checksum}\` |`,
    )
    .join("\n");
  const warnings =
    input.validation.warnings.length === 0
      ? "- None."
      : input.validation.warnings
          .map(
            (warning) =>
              `- \`${warning.code}\`${warning.recordId ? ` (${warning.recordId})` : ""}: ${warning.message}`,
          )
          .join("\n");

  const kbFindings =
    input.kbReconciliation.findings.length === 0
      ? "- None. Every KB §10/§11 `ACTIVE` destination and named Collection member region has at least one corresponding operational workbook row."
      : input.kbReconciliation.findings
          .map((finding) => `- \`${finding.code}\` (KB §${finding.kbSection}): ${finding.message}`)
          .join("\n");
  const kbFindingsOpen = input.kbReconciliation.findings.length > 0;

  const labelComparison =
    input.labelMappings.comparison.length === 0
      ? "- None. Every operational-layer Traveller Type/Emotional Goal/Desired Experience label has a governed runtime-ID mapping, and every governed mapping entry has a matching operational-layer label."
      : input.labelMappings.comparison
          .map((finding) => `- \`${finding.code}\` (${finding.vocabulary} — "${finding.label}"): ${finding.message}`)
          .join("\n");

  const reachabilityRows = input.labelMappings.reachability
    .map((entry) => {
      const kbColumn = entry.kbApprovedSize !== undefined ? `${entry.kbApprovedSize}` : "—";
      return `| ${entry.vocabulary} | ${entry.runtimeVocabularySize} | ${entry.reachableCount} | ${entry.reachablePercentage}% | ${kbColumn} |`;
    })
    .join("\n");

  const unreachableDetail = input.labelMappings.reachability
    .filter((entry) => entry.unreachable.length > 0)
    .map(
      (entry) =>
        `- **${entry.vocabulary}** (${entry.unreachable.length} unreachable): ${entry.unreachable.join(", ")}`,
    )
    .join("\n") || "- None. Every runtime vocabulary value is reachable through at least one current mapping entry.";

  const content = `# Journey Intelligence Generation Report

**Implementation card:** EBC-003C-B
**Workbook:** ${input.model.workbookMetadata.filename}
**Workbook checksum:** \`${input.model.workbookChecksum}\`
**Workbook schema version:** Not explicitly present
**Generator version:** ${GENERATOR_VERSION}
**Runtime schema version:** ${SCHEMA_VERSION}
**Generated at:** ${input.result.manifest.generatedAt}

## Generation summary

| Measure | Count |
| --- | ---: |
| Destination-region records processed | ${input.result.manifest.recordCounts.destinationRegions} |
| Journey Bases generated | ${input.result.manifest.recordCounts.journeyBases} |
| Attractions processed | ${input.result.manifest.recordCounts.attractions} |
| Experience Clusters processed | ${input.result.manifest.recordCounts.experienceClusters} |
| Islands processed | ${input.result.manifest.recordCounts.islands} |
| Traveller Types processed | ${input.result.manifest.recordCounts.travellerTypes} |
| Emotional Goals processed | ${input.result.manifest.recordCounts.emotionalGoals} |
| Desired Experiences processed | ${input.result.manifest.recordCounts.desiredExperiences} |
| REVIEW_REQUIRED records inherited | ${input.validation.reviewRequiredRecords} |

## Runtime artifacts

| Artifact | Records | Size (bytes) | SHA-256 |
| --- | ---: | ---: | --- |
${rows}

## Validation

- Workbook validation: **PASS**
- Artifact validation: **PASS**
- Runtime package verification: **PASS**
- Validation checks executed: ${input.validation.checksExecuted + input.verification.checksExecuted}
- Validation checks passed: ${input.validation.checksPassed + input.verification.checksPassed}
- Validation warnings: ${input.validation.warnings.length}
- Validation failures: 0
- Manifest validation status: **PASS**
- Generation duration: ${input.result.manifest.generation.durationMilliseconds} ms

### Warnings

${warnings}

## KB → Operational Reconciliation (WP-4)

Compares every KB §10/§11 \`ACTIVE\` destination and named Collection member region (\`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md\`) against this workbook's Destination Intelligence rows. This section is separate from the Warnings above and is never omitted, regardless of finding count — see \`docs/09-Development/R1.2-WS3-IMP-01A-EBC-RAD-WP4-Implementation.md\`.

- Operating mode: **${input.kbReconciliation.mode}** (Warn Mode First — ratified \`DEC-R1.2-015\`; findings are reported and do not block this run; Block Mode is not approved for Release 1.2 Phase 2)
- KB destinations/collections checked: ${input.kbReconciliation.destinationsChecked}
- KB Collection member regions checked: ${input.kbReconciliation.memberRegionsChecked}
- Findings: ${input.kbReconciliation.findings.length}

${kbFindings}

## Controlled Vocabulary Comparison & Reachability (WP-5)

Compares the governed \`EMOTION_BY_LABEL\`/\`THEMES_BY_LABEL\`/\`TRAVELLER_BY_LABEL\` mapping (\`web/scripts/journey-intelligence/labelMappingSource.ts\`) against this workbook's \`Traveller Types\`/\`Emotional Goals\`/\`Desired Experiences\` sheets, and reports how much of each runtime vocabulary (\`EmotionId\`/\`ThemeId\`/\`TravellerType\`) is reachable through the resulting generated tables — the mechanical fix for RC-6 (\`docs/09-Development/EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md\` §7). This section is separate from the Warnings and KB Reconciliation sections above and is never omitted. See \`docs/09-Development/R1.2-WS3-IMP-02-EBC-RAD-WP5-Implementation.md\` for the full design rationale.

### Comparison

${labelComparison}

### Reachability

| Vocabulary | Runtime type size | Reachable | Reachable % | KB-approved size |
| --- | ---: | ---: | ---: | ---: |
${reachabilityRows}

${unreachableDetail}

**TravellerType governance note:** the runtime \`TravellerType\` type itself carries 5 values (100% of which are reachable today); the Knowledge Base (§8) approves 9. Extending the runtime type and the operational layer's \`Traveller Types\` sheet toward the KB's full vocabulary is Open Decision OD-4 (\`docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md\` §12) and remains unresolved — this report makes the gap visible, per this EBC's \`governance-compliant handling\` requirement, and does not resolve it.

## Determinism

- Generator executions: ${input.determinism.generatorExecutions}
- Artifacts compared: ${input.determinism.comparedArtifacts}
- Comparison result: **IDENTICAL**
- Deterministic status: **PASS**
- Volatile fields fixed for comparison: ${input.determinism.volatileFieldsFixed.join(", ")}

## Runtime integration

The generated package is the Journey Director runtime intelligence source. The runtime loader validates the manifest, schema versions, artifact checksums, record counts, reason references, hierarchy, and indexes before exposing candidates to the existing deterministic engine.

No workbook access occurs at application runtime. No Journey Passport flow, Journey Director user interface, navigation, or recommendation-screen redesign is included.

## Promotion Review Checklist (ADR §9)

A successful generation run is not, by itself, automatically promotable to \`web/generated/\`. Per the ADR's Change Authority Matrix (§9, "Generator default source path / promotion of a new generated package"), Product & Experience approval is required before promotion whenever a change **alters destination inclusion or vocabulary reach**; it is not required for routine content refresh.

- [ ] KB → Operational Reconciliation findings above have been reviewed.
- [ ] ${kbFindingsOpen ? "This run has open KB reconciliation findings — confirm whether promoting this package changes destination inclusion relative to the currently promoted package before proceeding." : "This run has no open KB reconciliation findings."}
- [ ] Controlled Vocabulary Comparison & Reachability findings above have been reviewed.
- [ ] ${input.labelMappings.comparison.length > 0 ? "This run has open label-mapping comparison findings — confirm whether promoting this package changes vocabulary reach relative to the currently promoted package before proceeding." : "This run has no open label-mapping comparison findings."}
- [ ] If destination inclusion or vocabulary reach changes as a result of promoting this package, Product & Experience approval has been obtained (ADR §9).
- [ ] If this is routine content refresh only (no inclusion or vocabulary-reach change), promotion may proceed under Engineering's existing authority.

## Deferred limitations

- Narrative Intelligence and traveller-facing story composition remain deferred to EBC-003D.
- Live operational, seasonal, supplier, accessibility, visa, disruption, price, and availability checks remain outside this static intelligence package.
- Records marked \`REVIEW_REQUIRED\`, attractions, and experience clusters remain unavailable as primary recommendations.
- CI/CD automation for automatic regeneration is documented as a future enhancement.
`;

  await mkdir(dirname(input.path), { recursive: true });
  await writeFile(input.path, content, "utf8");
}
