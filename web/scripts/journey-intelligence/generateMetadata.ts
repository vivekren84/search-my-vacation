import type {
  CompatibilityArtifact,
  ConstraintArtifact,
  JourneyDNAArtifact,
  JourneySeedArtifact,
  JourneyTemplateArtifact,
  MetadataArtifact,
  ReasonArtifact,
  RecordCounts,
  ValidationReport,
  WorkbookModel,
} from "./types.js";
import { artifactHeader, workbookFilename } from "./utils.js";

export function recordCounts(
  model: WorkbookModel,
  journeyDNA: JourneyDNAArtifact,
  compatibility: CompatibilityArtifact,
  constraints: ConstraintArtifact,
  reasons: ReasonArtifact,
  seeds: JourneySeedArtifact,
  templates: JourneyTemplateArtifact,
): RecordCounts {
  return {
    destinationRegions: model.destinationIntelligence.length,
    journeyBases: model.destinationIntelligence.filter(
      (record) => record.journeyBaseStatus === "Yes",
    ).length,
    attractions: model.destinationIntelligence.filter(
      (record) => record.recordType === "Attraction",
    ).length,
    experienceClusters: model.destinationIntelligence.filter(
      (record) => record.recordType === "Experience Cluster",
    ).length,
    islands: model.destinationIntelligence.filter(
      (record) => record.recordType === "Island",
    ).length,
    travellerTypes: model.travellerTypes.length,
    emotionalGoals: model.emotionalGoals.length,
    desiredExperiences: model.desiredExperiences.length,
    journeyDNARecords: journeyDNA.records.length,
    compatibilityRecords: compatibility.records.length,
    constraintRecords: constraints.records.length,
    reasonCodes: reasons.records.length,
    journeySeedRecords: seeds.records.length,
    journeyTemplateRecords: templates.records.length,
  };
}

export function generateMetadata(
  model: WorkbookModel,
  counts: RecordCounts,
  validation: ValidationReport,
  generatedAt: string,
): MetadataArtifact {
  return {
    ...artifactHeader(model.workbookChecksum),
    generatedFrom: workbookFilename(model.workbookPath),
    generatedAt,
    recordCounts: counts,
    validation: {
      status: "PASS",
      warnings: validation.warnings.length,
      reviewRequiredRecords: validation.reviewRequiredRecords,
    },
  };
}
