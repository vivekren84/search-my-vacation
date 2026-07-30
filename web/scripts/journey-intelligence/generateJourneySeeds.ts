import type {
  JourneySeed,
  JourneySeedArtifact,
  WorkbookModel,
} from "./types.js";
import { artifactHeader, compareStrings } from "./utils.js";

export function generateJourneySeeds(
  model: WorkbookModel,
): JourneySeedArtifact {
  const records: JourneySeed[] = model.destinationIntelligence
    .filter((record) => record.journeyBaseStatus === "Yes")
    .map((record) => ({
      sourceRow: record.sourceRow,
      regionId: record.regionId,
      arrival: record.arrival,
      firstImpression: record.firstImpression,
      sharedMoment: record.sharedMoment,
      signatureExperience: record.signatureExperienceSeed,
      relaxationMoment: record.relaxationMoment,
      localDiscovery: record.localDiscovery,
      foodOrCulturalMoment: record.foodOrCulturalMoment,
      journeyHighPoint: record.journeyHighPoint,
      journeyEnding: record.journeyEnding,
      whyThisRegion: record.whyThisRegion,
      worthConsidering: record.worthConsidering,
      potentialTradeOff: record.potentialTradeOff,
    }))
    .sort((left, right) => compareStrings(left.regionId, right.regionId));

  return {
    ...artifactHeader(model.workbookChecksum),
    records,
  };
}
