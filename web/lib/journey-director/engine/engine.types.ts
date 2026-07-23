import type { JourneyFeeling } from "../../../types/journey-passport.types";
import type { JourneyPassportSnapshot } from "../../../types/journey-director";

export const DECISION_ENGINE_VERSION = "1.0.0" as const;
export const DECISION_RULES_VERSION = "release-1.0" as const;
export const JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION = 1 as const;

export type EmotionId =
  | "adventure"
  | "awe"
  | "celebration"
  | "curiosity"
  | "discovery"
  | "escape"
  | "freedom"
  | "gratitude"
  | "indulgence"
  | "joy"
  | "majesty"
  | "reconnection"
  | "relaxation"
  | "romance"
  | "serenity"
  | "spirituality"
  | "wonder";

export type ThemeId =
  | "adventure"
  | "architecture"
  | "backwaters"
  | "beaches"
  | "city-break"
  | "coffee-estates"
  | "cruises"
  | "culture"
  | "desert"
  | "family-attractions"
  | "festivals"
  | "food"
  | "forests"
  | "heritage"
  | "hills"
  | "islands"
  | "lakes"
  | "local-communities"
  | "luxury"
  | "mountains"
  | "nature"
  | "nightlife"
  | "photography"
  | "rivers"
  | "road-trips"
  | "safari"
  | "scenic-drives"
  | "shopping"
  | "slow-travel"
  | "snow-experiences"
  | "spiritual"
  | "tea-estates"
  | "villages"
  | "water-sports"
  | "wellness"
  | "wildlife";

export type TravellerType =
  | "solo-traveller"
  | "couple"
  | "family"
  | "friends"
  | "corporate-group";

export type TravelPace = "relaxed" | "balanced" | "explorer" | "fast-paced";
export type ComfortLevel = "simple" | "balanced" | "premium";

export type MemoryGoalId =
  | "active-discovery"
  | "celebration-moments"
  | "cultural-discovery"
  | "food-discovery"
  | "island-escape"
  | "nature-connection"
  | "photographic-memories"
  | "restorative-calm"
  | "shared-time"
  | "urban-discovery"
  | "wildlife-encounters"
  | "winter-wonder";

export type SignalSourceField =
  | "companion"
  | "dreamJourney"
  | "travelStyles"
  | "timing"
  | "destination"
  | "entryContext";

export type EvidenceStrength = "explicit" | "derived";

export type SignalEvidence = {
  sourceField: SignalSourceField;
  sourceValue: string;
  strengthKind: EvidenceStrength;
};

export type WeightedSignal<T extends string> = {
  id: T;
  strength: number;
  evidence: readonly SignalEvidence[];
};

export type NormalizedTiming = {
  kind: "relative-window" | "later-year" | "flexible" | "exact-dates";
  sourceValue: string;
  startDate?: string;
  endDate?: string;
  months: readonly number[];
  fixed: boolean;
};

export type DestinationIntent = {
  mode: "known" | "discovery";
  rawText: string;
};

export type NormalizedJourneyPassport = {
  schemaVersion: typeof JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION;
  travellerName?: string;
  entryContext: {
    feeling?: JourneyFeeling;
  };
  companions: readonly WeightedSignal<TravellerType>[];
  emotions: readonly WeightedSignal<EmotionId>[];
  themes: readonly WeightedSignal<ThemeId>[];
  memoryGoals: readonly WeightedSignal<MemoryGoalId>[];
  pacePreferences: readonly WeightedSignal<TravelPace>[];
  comfortPreferences: readonly WeightedSignal<ComfortLevel>[];
  timing: NormalizedTiming;
  destinationIntent: DestinationIntent;
  sourceEvidence: readonly SignalEvidence[];
  completeness: number;
};

export type PassportValidationIssueCode =
  | "PASSPORT_SOURCE_NOT_ALLOWED"
  | "MISSING_NAME"
  | "INVALID_COMPANION"
  | "INVALID_DREAM_JOURNEY"
  | "INVALID_TRAVEL_STYLES"
  | "INVALID_TIMING"
  | "INVALID_EXACT_DATES"
  | "INVALID_DESTINATION_MODE"
  | "MISSING_KNOWN_DESTINATION";

export type PassportValidationIssue = {
  code: PassportValidationIssueCode;
  field: keyof JourneyPassportSnapshot | "passport";
  explanation: string;
};

export type PassportNormalizationResult =
  | { status: "valid"; passport: NormalizedJourneyPassport }
  | { status: "insufficient-input" | "invalid-input"; issues: readonly PassportValidationIssue[] };

export type DestinationStatus = "ACTIVE" | "COMING_SOON" | "INACTIVE";
export type ServiceConfidence = "CONFIDENT" | "SUPPORTED" | "LIMITED" | "PAUSED";
export type SeasonalGuidance = "PREFERRED" | "POSSIBLE_WITH_GUIDANCE" | "NOT_RECOMMENDED" | "UNKNOWN";
export type DataQuality = "COMPLETE" | "INCOMPLETE" | "STALE";
export type SuitabilityLevel = "BEST_FOR" | "SUITABLE" | "ADJUSTMENT_REQUIRED" | "UNSUITABLE";

export type TravellerSuitability = {
  travellerType: TravellerType;
  level: SuitabilityLevel;
};

export type SeasonalWindow = {
  month: number;
  guidance: SeasonalGuidance;
};

export type SignatureExperience = {
  id: string;
  themes: readonly ThemeId[];
  emotions: readonly EmotionId[];
  memoryGoals: readonly MemoryGoalId[];
};

export type ConcernCategory =
  | "soft-preference-conflict"
  | "transfer-or-pace-friction"
  | "incomplete-material-knowledge"
  | "season-trade-off"
  | "weak-regional-expression";

export type PenaltySeverity = "minor" | "moderate" | "material";

export type ConcernCondition = {
  emotions?: readonly EmotionId[];
  themes?: readonly ThemeId[];
  paces?: readonly TravelPace[];
  companions?: readonly TravellerType[];
  always?: boolean;
};

export type CandidateConcern = {
  id: string;
  category: ConcernCategory;
  severity: PenaltySeverity;
  explanation: string;
  when: ConcernCondition;
};

export type CandidateEvidence = {
  id: string;
  explanation: string;
  emotions?: readonly EmotionId[];
  themes?: readonly ThemeId[];
  memoryGoals?: readonly MemoryGoalId[];
  companions?: readonly TravellerType[];
};

export type DiversityAxis =
  | "setting-geography"
  | "journey-rhythm"
  | "dominant-theme"
  | "signature-experience-style"
  | "cultural-expression";

export type DiversityProfile = Record<DiversityAxis, readonly string[]>;

export type EvidenceReadiness = {
  approvedImageryReferenceCount: number;
  journeyMomentCount: number;
  hasQualifiedRegionContent: boolean;
  hasMaterialContentGap: boolean;
};

export type RegionCandidate = {
  id: string;
  name: string;
  status: DestinationStatus;
  dataQuality: DataQuality;
  reviewValidUntil: string;
  primaryEmotion: EmotionId;
  supportingEmotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  bestFor: readonly TravellerSuitability[];
  paces: readonly TravelPace[];
  comforts: readonly ComfortLevel[];
  seasonality: readonly SeasonalWindow[];
  memoryGoals: readonly MemoryGoalId[];
  signatureExperiences: readonly SignatureExperience[];
  logisticalFit: number;
  concerns: readonly CandidateConcern[];
  evidence: readonly CandidateEvidence[];
};

export type JourneyCandidate = {
  id: string;
  name: string;
  aliases: readonly string[];
  category: "DOMESTIC" | "INTERNATIONAL";
  status: DestinationStatus;
  serviceConfidence: ServiceConfidence;
  dataQuality: DataQuality;
  reviewValidUntil: string;
  primaryEmotion: EmotionId;
  supportingEmotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  bestFor: readonly TravellerSuitability[];
  paces: readonly TravelPace[];
  comforts: readonly ComfortLevel[];
  seasonality: readonly SeasonalWindow[];
  memoryGoals: readonly MemoryGoalId[];
  signatureExperiences: readonly SignatureExperience[];
  regions: readonly RegionCandidate[];
  concerns: readonly CandidateConcern[];
  evidence: readonly CandidateEvidence[];
  diversity: DiversityProfile;
  evidenceReadiness: EvidenceReadiness;
};

export type EligibilityReasonCode =
  | "DESTINATION_NOT_ACTIVE"
  | "SERVICE_CONFIDENCE_BELOW_AUTOMATIC_THRESHOLD"
  | "DESTINATION_DATA_INCOMPLETE"
  | "DESTINATION_DATA_STALE"
  | "DESTINATION_SEASON_NOT_RECOMMENDED"
  | "DESTINATION_SEASON_UNKNOWN_FOR_FIXED_DATES"
  | "COMPANION_CONFIRMED_UNSUITABLE"
  | "NO_ELIGIBLE_REGION"
  | "REGION_NOT_ACTIVE"
  | "REGION_DATA_INCOMPLETE"
  | "REGION_DATA_STALE"
  | "REGION_SEASON_NOT_RECOMMENDED"
  | "REGION_SEASON_UNKNOWN_FOR_FIXED_DATES"
  | "REGION_COMPANION_CONFIRMED_UNSUITABLE";

export type EligibilityReason = {
  code: EligibilityReasonCode;
  scope: "destination" | "region";
  candidateId: string;
  explanation: string;
};

export type RegionEligibility = {
  region: RegionCandidate;
  eligible: boolean;
  reasons: readonly EligibilityReason[];
};

export type CandidateEligibility = {
  candidate: JourneyCandidate;
  eligible: boolean;
  reasons: readonly EligibilityReason[];
  regions: readonly RegionEligibility[];
};

export type DestinationScoreDimension =
  | "emotional-alignment"
  | "theme-experience-alignment"
  | "traveller-companion-suitability"
  | "travel-pace-alignment"
  | "comfort-alignment"
  | "season-timing-suitability"
  | "region-match-quality"
  | "memory-goal-alignment"
  | "operational-confidence";

export type RegionScoreDimension =
  | "emotional-fit"
  | "theme-signature-experience-fit"
  | "pace-fit"
  | "companion-suitability"
  | "memory-goal-fit"
  | "logistical-fit"
  | "comfort-fit";

export type ScoreFactor = {
  factorId: DestinationScoreDimension | RegionScoreDimension;
  label: string;
  rawMatch: number;
  weight: number;
  finalContribution: number;
  supportingPassportSignals: readonly string[];
  supportingCandidateSignals: readonly string[];
  caution?: string;
};

export type AppliedPenalty = {
  ruleId: string;
  category: ConcernCategory;
  severity: PenaltySeverity;
  points: number;
  explanation: string;
};

export type RegionScore = {
  region: RegionCandidate;
  score: number;
  breakdown: readonly ScoreFactor[];
  penalties: readonly AppliedPenalty[];
};

export type RankedCandidate = {
  candidate: JourneyCandidate;
  rank: number;
  baseScore: number;
  totalScore: number;
  breakdown: readonly ScoreFactor[];
  penalties: readonly AppliedPenalty[];
  selectedRegion: RegionScore;
  alternateRegion?: RegionScore;
  primaryEmotionMatch: number;
  memoryGoalMatch: number;
  fitEvidence: readonly CandidateEvidence[];
  cautions: readonly string[];
};

export type RecommendationPersonality =
  | "perfect-match"
  | "different-rhythm"
  | "pleasant-surprise";

export type ConfidenceBand = "high" | "moderate" | "low" | "insufficient";

export type EnginePossibility = {
  possibilityId: string;
  personality: RecommendationPersonality;
  personalityLabel: "The Perfect Match" | "A Different Rhythm" | "A Pleasant Surprise";
  candidateId: string;
  destinationName: string;
  regionId: string;
  regionName: string;
  rank: number;
  totalScore: number;
  scoreBreakdown: readonly ScoreFactor[];
  fitEvidence: readonly CandidateEvidence[];
  differentiators: readonly string[];
  cautions: readonly string[];
  confidence: ConfidenceBand;
  selectionValue: number;
};

export type EngineStatus =
  | "success"
  | "partial"
  | "insufficient-input"
  | "insufficient-candidates"
  | "invalid-input";

export type EngineVersionMetadata = {
  passportSchemaVersion: typeof JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION;
  knowledgeBaseVersion: string;
  engineVersion: typeof DECISION_ENGINE_VERSION;
  rulesVersion: typeof DECISION_RULES_VERSION;
  operationalSnapshotId: string;
  generatedAt: string;
};

export type EngineExecutionContext = {
  knowledgeBaseVersion: string;
  operationalSnapshotId: string;
  generatedAt: string;
  evaluationDate: string;
};

export type CandidateExclusionSummary = {
  candidateId: string;
  candidateName: string;
  reasons: readonly EligibilityReason[];
};

export type DecisionTrace = {
  normalizedPassport?: NormalizedJourneyPassport;
  exclusions: readonly CandidateExclusionSummary[];
  rankedCandidates: readonly RankedCandidate[];
  personalityAssignments: readonly {
    possibilityId: string;
    personality: RecommendationPersonality;
    candidateId: string;
    explanation: string;
  }[];
  unresolvedTradeOffs: readonly string[];
};

export type EngineResult = {
  status: EngineStatus;
  versions: EngineVersionMetadata;
  normalizedInputSummary?: {
    companionIds: readonly TravellerType[];
    emotionIds: readonly EmotionId[];
    themeIds: readonly ThemeId[];
    timingKind: NormalizedTiming["kind"];
    destinationMode: DestinationIntent["mode"];
  };
  possibilities: readonly EnginePossibility[];
  exclusions: readonly CandidateExclusionSummary[];
  recovery: {
    code: "NONE" | "CLARIFICATION_REQUIRED" | "NO_ELIGIBLE_CANDIDATES" | "NOT_ENOUGH_QUALIFIED_CANDIDATES";
    issueCodes: readonly (PassportValidationIssueCode | EligibilityReasonCode)[];
  };
  trace: DecisionTrace;
};
