import { generateCompatibility } from "./generateCompatibility.js";
import { generateConstraints } from "./generateConstraints.js";
import { generateJourneyDNA } from "./generateJourneyDNA.js";
import { generateJourneySeeds } from "./generateJourneySeeds.js";
import { generateMetadata, recordCounts } from "./generateMetadata.js";
import { generateReasons } from "./generateReasons.js";
import { generateTemplates } from "./generateTemplates.js";
import type {
  GeneratedArtifacts,
  ValidationReport,
  WorkbookModel,
} from "./types.js";

export function generateArtifactObjects(
  model: WorkbookModel,
  validation: ValidationReport,
  generatedAt: string,
): GeneratedArtifacts {
  const journeyDNA = generateJourneyDNA(model);
  const compatibilityMatrix = generateCompatibility(model);
  const constraintLibrary = generateConstraints(model, compatibilityMatrix);
  const reasonLibrary = generateReasons(
    model,
    compatibilityMatrix,
    constraintLibrary,
  );
  const journeySeeds = generateJourneySeeds(model);
  const journeyTemplates = generateTemplates(model);
  const counts = recordCounts(
    model,
    journeyDNA,
    compatibilityMatrix,
    constraintLibrary,
    reasonLibrary,
    journeySeeds,
    journeyTemplates,
  );
  const metadata = generateMetadata(model, counts, validation, generatedAt);

  return {
    journeyDNA,
    compatibilityMatrix,
    constraintLibrary,
    reasonLibrary,
    journeySeeds,
    journeyTemplates,
    metadata,
  };
}
