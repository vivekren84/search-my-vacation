import {
  DEFAULT_JOURNEY_PRESENTATION,
  journeyCanonicalImage,
  journeyPresentationCatalogue,
  journeyPresentationKey,
} from "../../config/journey-director.config";
import type {
  JourneyEvidenceReference,
  JourneyPassportSnapshot,
  JourneyPossibility,
  JourneyPresentationCatalogue,
  JourneyReason,
  JourneyRecommendationSet,
  JourneyRecommendationState,
  TravellerReflection,
  TravellerSummary,
} from "../../types/journey-director";
import type {
  EnginePossibility,
  EngineResult,
} from "./engine";
import {
  buildMatchingQualities,
  buildTravellerInsights,
  buildTravellerReflection,
  buildTravellerSummary,
} from "./traveller-reflection";

type CandidateEvidence = EnginePossibility["fitEvidence"][number];
type ScoreFactor = EnginePossibility["scoreBreakdown"][number];

export type RecommendationAdapterInput = {
  passport: JourneyPassportSnapshot;
  engineResult: EngineResult;
  presentation?: JourneyPresentationCatalogue;
};

const personalityDescriptions = {
  "perfect-match": "Closest to the strongest signals in your Journey Passport.",
  "different-rhythm": "A strong fit with a thoughtful contrast, trade-off, or unexpected dimension.",
  "pleasant-surprise": "A less obvious, well-supported journey that still aligns meaningfully.",
} as const;

function stateFor(result: EngineResult): JourneyRecommendationState {
  switch (result.status) {
    case "success":
      return "success";
    case "partial":
      return "partial";
    case "insufficient-input":
      return "insufficient";
    case "insufficient-candidates":
    case "invalid-input":
      return "unavailable";
  }
}

function evidenceReference(evidence: CandidateEvidence): JourneyEvidenceReference {
  return {
    source: "engine-evidence",
    id: evidence.id,
    explanation: evidence.explanation,
  };
}

function factorReference(factor: ScoreFactor): JourneyEvidenceReference {
  return {
    source: "score-factor",
    id: factor.factorId,
    explanation: factor.label,
  };
}

function reasonTitle(evidence: CandidateEvidence) {
  if (evidence.companions?.length) return "Designed for who is travelling";
  if (evidence.memoryGoals?.length) return "Memories that matter";
  if (evidence.emotions?.length) return "The feeling behind the journey";
  if (evidence.themes?.length) return "Experiences aligned with you";
  return "A considered fit";
}

function mapReasons(possibility: EnginePossibility): JourneyReason[] {
  const evidenceReasons = possibility.fitEvidence.slice(0, 4).map((evidence, index) => ({
    id: evidence.id,
    cue: String(index + 1).padStart(2, "0"),
    title: reasonTitle(evidence),
    description: evidence.explanation,
    evidence: [evidenceReference(evidence)],
  }));

  if (evidenceReasons.length > 0) return evidenceReasons;

  return possibility.scoreBreakdown
    .filter((factor) => factor.finalContribution > 0)
    .slice(0, 3)
    .map((factor, index) => ({
      id: factor.factorId,
      cue: String(index + 1).padStart(2, "0"),
      title: factor.label,
      description: `This possibility carries forward the matching ${factor.label.toLowerCase()} evidence.`,
      evidence: [factorReference(factor)],
    }));
}

function metadataIsSupported(
  supportedBy: readonly string[],
  evidenceIds: ReadonlySet<string>,
) {
  return supportedBy.length > 0 && supportedBy.every((id) => evidenceIds.has(id));
}

function mapPossibility(
  possibility: EnginePossibility,
  order: number,
  presentation: JourneyPresentationCatalogue,
): JourneyPossibility {
  const metadata =
    presentation[journeyPresentationKey(possibility.candidateId, possibility.regionId)];
  const evidenceIds = new Set(possibility.fitEvidence.map((evidence) => evidence.id));
  const supportingEvidence = possibility.fitEvidence.map(evidenceReference);
  const canonicalImage = journeyCanonicalImage(possibility.candidateId);
  const canUseMetadata =
    metadata &&
    metadata.candidateId === possibility.candidateId &&
    metadata.regionId === possibility.regionId &&
    metadataIsSupported(metadata.supportingEvidenceIds, evidenceIds);
  const summary =
    (canUseMetadata ? metadata.summary : undefined) ??
    possibility.fitEvidence[0]?.explanation ??
    `${possibility.destinationName} and ${possibility.regionName} met the governed recommendation threshold.`;
  const moments = canUseMetadata
    ? metadata.moments
        .filter((moment) =>
          metadataIsSupported(moment.supportingEvidenceIds, evidenceIds),
        )
        .map((moment) => ({
          ...moment,
          supportingEvidenceIds: [...moment.supportingEvidenceIds],
        }))
    : [];

  return {
    id: possibility.possibilityId,
    candidateId: possibility.candidateId,
    regionId: possibility.regionId,
    personality: possibility.personality,
    personalityLabel: possibility.personalityLabel,
    personalityDescription: personalityDescriptions[possibility.personality],
    recommendationOrder: order,
    destination: possibility.destinationName,
    region: possibility.regionName,
    summary,
    heroImage: canUseMetadata
      ? metadata.heroImage
      : canonicalImage.heroImage,
    heroImageAlt: canUseMetadata
      ? metadata.heroImageAlt
      : canonicalImage.heroImageAlt,
    heroImagePosition:
      (canUseMetadata ? metadata.heroImagePosition : canonicalImage.heroImagePosition) ??
      DEFAULT_JOURNEY_PRESENTATION.heroImagePosition,
    reasons: mapReasons(possibility),
    moments,
    supportingEvidence,
    confidence: possibility.confidence,
    matchStrength: possibility.totalScore,
    cautions: [...possibility.cautions],
    ctaLabel:
      (canUseMetadata ? metadata.ctaLabel : undefined) ??
      DEFAULT_JOURNEY_PRESENTATION.ctaLabel,
    handoffHeadline:
      (canUseMetadata ? metadata.handoffHeadline : undefined) ??
      `Let’s shape your ${possibility.destinationName} story together.`,
    handoffMessage:
      (canUseMetadata ? metadata.handoffMessage : undefined) ??
      `A Journey Director can refine ${possibility.regionName} around the priorities preserved in your Journey Passport.`,
  };
}

function recoveryMessage(state: JourneyRecommendationState, result: EngineResult) {
  switch (state) {
    case "success":
      return "";
    case "partial":
      return "We found fewer than three possibilities that met the automatic recommendation standard. A Journey Director can refine the shortlist with you.";
    case "insufficient":
      return "A little more traveller context is needed before we can recommend responsibly.";
    case "unavailable":
      return result.status === "invalid-input"
        ? "This Journey Passport needs review before recommendations can be prepared."
        : "The current destination collection did not produce a confident automatic match. A Journey Director can help with the next step.";
  }
}

export function adaptJourneyRecommendations({
  passport,
  engineResult,
  presentation = journeyPresentationCatalogue,
}: RecommendationAdapterInput): JourneyRecommendationSet {
  const excludedCandidateIds = engineResult.exclusions.map(
    (candidate) => candidate.candidateId,
  );
  const excluded = new Set(excludedCandidateIds);

  if (
    engineResult.possibilities.some((possibility) =>
      excluded.has(possibility.candidateId),
    )
  ) {
    throw new Error(
      "Engine contract violation: an excluded candidate was returned as a possibility.",
    );
  }

  const state = stateFor(engineResult);
  const reflectionModel = buildTravellerReflection(passport, engineResult);
  const possibilities = engineResult.possibilities.map((possibility, index) =>
    mapPossibility(possibility, index + 1, presentation),
  );

  return {
    state,
    traveller: passport,
    travellerSummary: buildTravellerSummary(passport, engineResult),
    reflectionModel,
    reflection: [
      reflectionModel.openingRecognition,
      reflectionModel.travelCharacter,
      reflectionModel.recommendationTransition,
    ].join(" "),
    qualities: buildMatchingQualities(passport),
    insights: buildTravellerInsights(passport),
    possibilities,
    excludedCandidateIds,
    recoveryMessage: recoveryMessage(state, engineResult),
    versions: {
      engine: engineResult.versions.engineVersion,
      rules: engineResult.versions.rulesVersion,
      knowledgeBase: engineResult.versions.knowledgeBaseVersion,
      operationalSnapshot: engineResult.versions.operationalSnapshotId,
    },
    isFallback: false,
  };
}

const unavailableReflection: TravellerReflection = {
  openingRecognition: "Your completed Journey Passport is ready.",
  travelCharacter:
    "Its answers remain available for the recommendation process.",
  recommendationTransition:
    "A governed engine result is required before journey possibilities can be presented.",
  outcomeMessage: "Recommendations are not available in this preview state.",
};

const unavailableSummary: TravellerSummary = {
  themes: [],
  memoryPreferences: [],
  comfort: [],
  pace: [],
  restrictions: [],
  preferences: [],
};

/**
 * Compatibility boundary for the current unconnected UI. It deliberately
 * returns no demo recommendations. Production integration should call
 * adaptJourneyRecommendations with a governed EngineResult.
 */
export function getJourneyRecommendations(
  passport: JourneyPassportSnapshot | null,
): JourneyRecommendationSet {
  return {
    state: "unavailable",
    traveller: passport,
    travellerSummary: {
      ...unavailableSummary,
      ...(passport?.name.trim() ? { name: passport.name.trim() } : {}),
      ...(passport?.companion ? { companion: passport.companion } : {}),
      ...(passport?.timing ? { timing: passport.timing } : {}),
    },
    reflectionModel: unavailableReflection,
    reflection: [
      unavailableReflection.openingRecognition,
      unavailableReflection.travelCharacter,
      unavailableReflection.recommendationTransition,
    ].join(" "),
    qualities: [],
    insights: [],
    possibilities: [],
    excludedCandidateIds: [],
    recoveryMessage:
      "The recommendation engine has not yet been connected to this presentation route.",
    isFallback: passport === null,
  };
}
