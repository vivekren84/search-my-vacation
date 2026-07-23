import type {
  JourneyPassportSnapshot,
  JourneyRecommendationSet,
} from "../../types/journey-director";
import {
  RELEASE1_CATALOGUE_METADATA,
  release1JourneyCandidates,
} from "./catalogue";
import {
  generateJourneyRecommendations,
  type EngineExecutionContext,
} from "./engine";
import { adaptJourneyRecommendations } from "./recommendation-adapter";

function executionContext(executionTimestamp: string): EngineExecutionContext {
  const instant = new Date(executionTimestamp);

  if (
    !Number.isFinite(instant.getTime()) ||
    instant.toISOString() !== executionTimestamp
  ) {
    throw new Error(
      "Invalid Journey Director execution timestamp: expected a canonical ISO 8601 UTC timestamp.",
    );
  }

  return {
    knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
    operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
    generatedAt: executionTimestamp,
    evaluationDate: executionTimestamp.slice(0, 10),
  };
}

export function createJourneyRecommendationSet(
  passport: JourneyPassportSnapshot,
  executionTimestamp: string,
): JourneyRecommendationSet {
  const engineResult = generateJourneyRecommendations(
    passport,
    release1JourneyCandidates,
    executionContext(executionTimestamp),
  );

  return adaptJourneyRecommendations({
    passport,
    engineResult,
  });
}
