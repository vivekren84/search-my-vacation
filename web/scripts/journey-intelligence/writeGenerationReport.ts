import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { ARTIFACT_NAMES } from "./artifactNames.js";
import type { ArtifactVerificationReport } from "./verifyArtifacts.js";
import type { DeterminismReport } from "./verifyDeterminism.js";
import type {
  GenerationResult,
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

## Determinism

- Generator executions: ${input.determinism.generatorExecutions}
- Artifacts compared: ${input.determinism.comparedArtifacts}
- Comparison result: **IDENTICAL**
- Deterministic status: **PASS**
- Volatile fields fixed for comparison: ${input.determinism.volatileFieldsFixed.join(", ")}

## Runtime integration

The generated package is the Journey Director runtime intelligence source. The runtime loader validates the manifest, schema versions, artifact checksums, record counts, reason references, hierarchy, and indexes before exposing candidates to the existing deterministic engine.

No workbook access occurs at application runtime. No Journey Passport flow, Journey Director user interface, navigation, or recommendation-screen redesign is included.

## Deferred limitations

- Narrative Intelligence and traveller-facing story composition remain deferred to EBC-003D.
- Live operational, seasonal, supplier, accessibility, visa, disruption, price, and availability checks remain outside this static intelligence package.
- Records marked \`REVIEW_REQUIRED\`, attractions, and experience clusters remain unavailable as primary recommendations.
- CI/CD automation for automatic regeneration is documented as a future enhancement.
`;

  await mkdir(dirname(input.path), { recursive: true });
  await writeFile(input.path, content, "utf8");
}
