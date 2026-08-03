export { evaluateCandidateEligibility } from "./evaluateEligibility";
export { evaluateCandidateContradictions } from "./evaluateContradictions";
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
  CandidateCapabilities,
  CandidateContradictionEvaluation,
  CandidateEligibility,
  ContradictionReason,
  ContradictionReasonCode,
  CoreIntent,
  CoreIntentDetection,
  DecisionTrace,
  EngineExecutionContext,
  EngineDestinationResolution,
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
  TravelScope,
} from "./engine.types";
