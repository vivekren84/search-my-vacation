import {
  GENERATOR_VERSION,
  SCHEMA_VERSION,
  type ArtifactChecksum,
  type IntelligenceManifest,
  type RecordCounts,
  type ValidationReport,
  type WorkbookModel,
} from "./types.js";
import { workbookFilename } from "./utils.js";

export interface ManifestChecksums {
  journeyDNA: ArtifactChecksum;
  compatibilityMatrix: ArtifactChecksum;
  constraintLibrary: ArtifactChecksum;
  reasonLibrary: ArtifactChecksum;
  journeySeeds: ArtifactChecksum;
  journeyTemplates: ArtifactChecksum;
  metadata: ArtifactChecksum;
}

export function generateManifest(
  model: WorkbookModel,
  counts: RecordCounts,
  validation: ValidationReport,
  checksums: ManifestChecksums,
  generatedAt: string,
  durationMilliseconds: number,
  contradictionsGenerated: number,
): IntelligenceManifest {
  return {
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    generatedAt,
    generatedFromWorkbook: workbookFilename(model.workbookPath),
    workbookChecksum: model.workbookChecksum,
    workbookMetadata: model.workbookMetadata,
    recordCounts: counts,
    artifacts: checksums,
    generation: {
      recordsProcessed: model.destinationIntelligence.length,
      compatibilityRulesGenerated: counts.compatibilityRecords,
      contradictionsGenerated,
      validationRulesExecuted: validation.checksExecuted,
      durationMilliseconds,
    },
    validation: {
      status: "PASS",
      checksExecuted: validation.checksExecuted,
      checksPassed: validation.checksPassed,
      checksFailed: 0,
      warnings: validation.warnings.length,
      reviewRequiredRecords: validation.reviewRequiredRecords,
    },
  };
}
