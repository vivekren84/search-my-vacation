export { evaluateCandidateEligibility } from "./evaluateEligibility";
export { generateJourneyRecommendations } from "./generateRecommendations";
export { normalizeJourneyPassport } from "./normalizePassport";
export { compareRankedCandidates, rankCandidates } from "./rankCandidates";
export { scoreEligibleCandidate } from "./scoreCandidate";
export { selectJourneyPossibilities } from "./selectPossibilities";
export {
  DECISION_ENGINE_VERSION,
  DECISION_RULES_VERSION,
  JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
} from "./engine.types";
export type {
  CandidateEligibility,
  DecisionTrace,
  EngineExecutionContext,
  EnginePossibility,
  EngineResult,
  EngineStatus,
  JourneyCandidate,
  NormalizedJourneyPassport,
  PassportNormalizationResult,
  RankedCandidate,
  RecommendationPersonality,
  RegionCandidate,
  ScoreFactor,
} from "./engine.types";
