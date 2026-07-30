import type {
  JourneyTemplate,
  JourneyTemplateArtifact,
  WorkbookModel,
} from "./types.js";
import {
  artifactHeader,
  compareStrings,
  parseDurationDays,
} from "./utils.js";

export function generateTemplates(
  model: WorkbookModel,
): JourneyTemplateArtifact {
  const records: JourneyTemplate[] = model.destinationIntelligence
    .filter((record) => record.journeyBaseStatus === "Yes")
    .map((record) => ({
      sourceRow: record.sourceRow,
      regionId: record.regionId,
      minimumDurationDays: parseDurationDays(record.suggestedMinimumDuration),
      idealDurationDays: parseDurationDays(record.suggestedIdealDuration),
      journeyRhythm: record.journeyRhythm,
      arrivalPhase: record.arrivalPhase,
      discoveryPhase: record.discoveryPhase,
      signaturePhase: record.signatureDay,
      slowOrRecoveryPhase: record.slowOrRecoveryPhase,
      optionalExtension: record.optionalExtension,
      departurePhase: record.departurePhase,
    }))
    .sort((left, right) => compareStrings(left.regionId, right.regionId));

  return {
    ...artifactHeader(model.workbookChecksum),
    records,
  };
}
