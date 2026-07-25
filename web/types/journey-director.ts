import type { JourneyPassportEntryContext } from "./journey-passport.types";

/**
 * Presentation-facing personality. The deterministic engine owns selection;
 * this contract only preserves that selection for presentation consumers.
 */
export type JourneyPossibilityPersonality =
  | "perfect-match"
  | "different-rhythm"
  | "pleasant-surprise";

export type JourneyPassportSnapshot = {
  name: string;
  companion: string;
  dreamJourney: string;
  travelStyles: string[];
  timing: string;
  startDate: string;
  endDate: string;
  destinationMode: "known" | "discovery";
  destination: string;
  entryContext?: JourneyPassportEntryContext;
  completedAt: string;
  source: "journey-passport" | "demo";
};

export type TravellerInsight = {
  id: string;
  eyebrow: string;
  statement: string;
  evidence: JourneyEvidenceReference[];
};

export type JourneyEvidenceReference = {
  source: "passport" | "engine-evidence" | "score-factor";
  id: string;
  explanation: string;
};

export type JourneyReason = {
  id: string;
  title: string;
  description: string;
  cue: string;
  evidence: JourneyEvidenceReference[];
};

export type JourneyMoment = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  supportingEvidenceIds: string[];
};

export type JourneyPossibility = {
  id: string;
  candidateId: string;
  regionId: string;
  personality: JourneyPossibilityPersonality;
  personalityLabel: string;
  personalityDescription: string;
  recommendationOrder: number;
  destination: string;
  region: string;
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  reasons: JourneyReason[];
  moments: JourneyMoment[];
  supportingEvidence: JourneyEvidenceReference[];
  confidence: "high" | "moderate" | "low" | "insufficient";
  matchStrength: number;
  cautions: string[];
  ctaLabel: string;
  handoffHeadline: string;
  handoffMessage: string;
};

export type JourneyRecommendationState =
  | "success"
  | "partial"
  | "insufficient"
  | "unavailable";

export type TravellerSummary = {
  name?: string;
  companion?: string;
  themes: string[];
  memoryPreferences: string[];
  timing?: string;
  comfort: string[];
  pace: string[];
  restrictions: string[];
  preferences: string[];
};

export type TravellerReflection = {
  openingRecognition: string;
  travelCharacter: string;
  recommendationTransition: string;
  outcomeMessage: string;
};

export type JourneyRecommendationSet = {
  state: JourneyRecommendationState;
  traveller: JourneyPassportSnapshot | null;
  travellerSummary: TravellerSummary;
  reflectionModel: TravellerReflection;
  reflection: string;
  qualities: string[];
  insights: TravellerInsight[];
  possibilities: JourneyPossibility[];
  excludedCandidateIds: string[];
  recoveryMessage: string;
  versions?: {
    engine: string;
    rules: string;
    knowledgeBase: string;
    operationalSnapshot: string;
  };
  /**
   * Retained only for compatibility with the current preview UI. Production
   * adapters never synthesize a demo recommendation.
   */
  isFallback: boolean;
};

export type JourneySynopsis = {
  travellerFirstName: string;
  travellingParty: string;
  approximatePartySize: "to-be-confirmed";
  travelTiming: string;
  journeyIntent: string;
  preferredComfort: "to-be-discussed";
  preferredPace: "to-be-discussed";
  knownDestination?: string;
  recommendedPossibility: {
    id: string;
    destination: string;
    region: string;
    personality: JourneyPossibilityPersonality;
    personalityLabel: string;
    whyThisFits: string[];
    planningConsiderations: string[];
  };
  createdAt: string;
};

export type JourneySessionSnapshot = {
  version: 2;
  passport: JourneyPassportSnapshot;
  journeyReference: string;
  journeySynopsis: JourneySynopsis;
  activePossibilityId: string;
  activeRecommendationPersonality: JourneyPossibilityPersonality;
  preferredPossibilityId: string | null;
  selectedRecommendationPersonality: JourneyPossibilityPersonality | null;
  visitedPossibilityIds: string[];
  handoffConsent: boolean;
  callbackPreference: {
    preferredDate: string;
    preferredTimeWindow: string;
  } | null;
};

export type JourneyMomentMetadata = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  supportingEvidenceIds: string[];
};

export type JourneyPresentationMetadata = {
  candidateId: string;
  regionId: string;
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  supportingEvidenceIds: string[];
  moments: JourneyMomentMetadata[];
  handoffHeadline: string;
  handoffMessage: string;
  ctaLabel: string;
};

export type JourneyPresentationCatalogue = Readonly<
  Record<string, JourneyPresentationMetadata>
>;
