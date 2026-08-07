import {
  DEFAULT_JOURNEY_PRESENTATION,
  journeyCanonicalImageForPossibility,
  journeyPresentationCatalogue,
  journeyPresentationKey,
} from "../../config/journey-director.config";
import {
  closingMessage,
  experienceTags,
  memoriesText,
  regionScopedEvidence,
  travelStyleLabel,
  travellerLinkClause,
} from "./card-copy";
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
  "different-rhythm": "A thoughtful contrast that answers your story from another angle.",
  "pleasant-surprise": "A less obvious journey that reveals another side of what you shared.",
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
    explanation: travellerFriendlyCopy(evidence.explanation),
  };
}

function factorReference(factor: ScoreFactor): JourneyEvidenceReference {
  return {
    source: "score-factor",
    id: factor.factorId,
    explanation: factor.label,
  };
}

function travellerFriendlyCopy(value: string) {
  return value
    .replace(
      /The approved region themes support these governed experience and memory classifications\./gi,
      "This area brings together experiences and memories that reflect what matters to you.",
    )
    .replace(
      /The approved destination themes support these governed experience and memory classifications\./gi,
      "This destination brings together experiences and memories that reflect what matters to you.",
    )
    .replace(/\bis approved for\b/gi, "is especially well suited to")
    .replace(/\bThe approved combination\b/gi, "This combination")
    .replace(/\bapproved\b/gi, "considered")
    .replace(/\bgoverned\b/gi, "carefully reviewed")
    .replace(/\bautomatic\b/gi, "initial")
    .replace(/\bthreshold\b/gi, "standard");
}

function reasonCategory(evidence: CandidateEvidence) {
  if (evidence.companions?.length) return "companion";
  if (evidence.memoryGoals?.length) return "memory";
  if (evidence.emotions?.length) return "emotion";
  if (evidence.themes?.length) return "themes";
  return "fit";
}

const reasonTitles = {
  companion: ["Made for who is travelling", "Room for everyone to enjoy"],
  memory: ["The memories you want to make", "What could stay with you"],
  emotion: ["The feeling you want", "A rhythm that supports it"],
  themes: ["Experiences that belong here", "How the place comes alive"],
  fit: ["A detail that supports the match", "Another reason it feels right"],
} as const;

function confidenceNote(confidence: EnginePossibility["confidence"]) {
  switch (confidence) {
    case "high":
      return "This is a particularly strong reading of the story in your Journey Passport.";
    case "moderate":
      return "This is a thoughtful fit; a Journey Designer can refine the details with you.";
    case "low":
      return "This journey shares meaningful qualities with your story, with room to shape the finer details.";
    case "insufficient":
      return "This is the closest fit from the journeys we currently serve, ready for a more personal conversation.";
  }
}

function mapReasons(possibility: EnginePossibility): JourneyReason[] {
  const categoryCount: Record<keyof typeof reasonTitles, number> = {
    companion: 0,
    memory: 0,
    emotion: 0,
    themes: 0,
    fit: 0,
  };
  const usedTitles = new Set<string>();
  const evidenceReasons = regionScopedEvidence(possibility).slice(0, 4).map((evidence, index) => {
    const category = reasonCategory(evidence);
    const titles = reasonTitles[category];
    const categoryIndex = categoryCount[category]++;
    const preferredTitle = titles[Math.min(categoryIndex, titles.length - 1)];
    const title = usedTitles.has(preferredTitle)
      ? `Another detail for ${possibility.destinationName}`
      : preferredTitle;
    usedTitles.add(title);

    // "The memories you want to make" previously echoed the raw generated
    // evidence text verbatim — a formulaic "X, Y, Z; pace rhythm; region
    // context." string repeated near-identically across many cards (EBC-017C
    // Part B). Route that category through a natural-language generator
    // built from the same underlying signals instead.
    const description =
      category === "memory"
        ? memoriesText(evidence, possibility)
        : travellerFriendlyCopy(evidence.explanation);

    return {
      id: evidence.id,
      cue: String(index + 1).padStart(2, "0"),
      title,
      description,
      evidence: [evidenceReference(evidence)],
    };
  });

  if (evidenceReasons.length > 0) return evidenceReasons;

  return possibility.scoreBreakdown
    .filter((factor) => factor.finalContribution > 0)
    .slice(0, 3)
    .map((factor, index) => ({
      id: factor.factorId,
      cue: String(index + 1).padStart(2, "0"),
      title: factor.label,
      description: `This possibility reflects the ${factor.label.toLowerCase()} you shared.`,
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
  passport: JourneyPassportSnapshot,
): JourneyPossibility {
  const metadata =
    presentation[journeyPresentationKey(possibility.candidateId, possibility.regionId)];
  const evidenceIds = new Set(possibility.fitEvidence.map((evidence) => evidence.id));
  const supportingEvidence = possibility.fitEvidence.map(evidenceReference);
  const canonicalImage = journeyCanonicalImageForPossibility(
    possibility.regionName,
    possibility.candidateId,
  );
  const canUseMetadata =
    metadata &&
    metadata.candidateId === possibility.candidateId &&
    metadata.regionId === possibility.regionId &&
    metadataIsSupported(metadata.supportingEvidenceIds, evidenceIds);
  // Curated summaries (Goa, Bali) already reflect the destination and its
  // emotional tone; the traveller-link clause is only appended to the
  // generated fallback summary, which otherwise names only the destination
  // and its themes, never the traveller's own selections (EBC-017C Part B).
  const summary = travellerFriendlyCopy(
    (canUseMetadata
      ? metadata.summary
      : undefined) ??
    (regionScopedEvidence(possibility)[0]?.explanation
      ? `${regionScopedEvidence(possibility)[0].explanation}${travellerLinkClause(passport)}`
      : undefined) ??
    `${possibility.destinationName} and ${possibility.regionName} bring together several qualities from your Journey Passport.${travellerLinkClause(passport)}`,
  );
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
    experiences: [...experienceTags(possibility)],
    recommendedTravelStyle: travelStyleLabel(possibility),
    recommendedSeason: possibility.recommendedSeason,
    confidenceNote: confidenceNote(possibility.confidence),
    ctaLabel:
      (canUseMetadata ? metadata.ctaLabel : undefined) ??
      DEFAULT_JOURNEY_PRESENTATION.ctaLabel,
    handoffHeadline:
      (canUseMetadata ? metadata.handoffHeadline : undefined) ??
      `Let’s shape your ${possibility.destinationName} story together.`,
    handoffMessage:
      (canUseMetadata ? metadata.handoffMessage : undefined) ??
      closingMessage(possibility),
  };
}

function recoveryMessage(state: JourneyRecommendationState, result: EngineResult) {
  switch (state) {
    case "success":
      return "";
    case "partial":
      return "This collection currently contains fewer than three served possibilities. A Journey Director can still help you continue.";
    case "insufficient":
      return "A little more traveller context is needed before we can recommend responsibly.";
    case "unavailable":
      return result.status === "invalid-input"
        ? "This Journey Passport needs review before recommendations can be prepared."
        : "The current destination collection is not ready to present. A Journey Director can help with the next step.";
  }
}

function destinationResolution(result: EngineResult) {
  const usedInternationalMountainFallback =
    result.trace.normalizedTravelScope === "INTERNATIONAL" &&
    result.trace.detectedCoreIntent.intent === "MOUNTAIN" &&
    result.trace.internationalPolicy.decision.includes("transparent fallback");

  switch (result.destinationResolution.status) {
    case "discovery":
      return {
        status: "discovery" as const,
        message: usedInternationalMountainFallback
          ? "You asked to keep this journey international. None of the served international options currently supports the mountain-retreat experience strongly enough, so we have explicitly widened this shortlist to the strongest genuine domestic mountain alternatives instead of inserting a weaker international match."
          : "You left the map open, so these possibilities are shaped entirely around the story in your Journey Passport.",
      };
    case "served":
      return {
        status: "served" as const,
        requestedText: result.destinationResolution.requestedText,
        matchedDestination: result.destinationResolution.matchedCandidateName,
        recommended: result.destinationResolution.recommended,
        message: result.destinationResolution.recommended
          ? `You mentioned ${result.destinationResolution.requestedText}. We serve it, and ${result.destinationResolution.matchedCandidateName} fits your primary experience strongly enough to lead this shortlist.`
          : `You mentioned ${result.destinationResolution.requestedText}. We do serve it, but it is not the strongest match for the primary experience in your Passport. The possibilities below protect that priority; we can still curate ${result.destinationResolution.matchedCandidateName} with clear trade-offs if you prefer it.`,
      };
    case "unserved":
      return {
        status: "unserved" as const,
        requestedText: result.destinationResolution.requestedText,
        message: `We do not currently serve ${result.destinationResolution.requestedText}, but your journey does not stop here. These are the three closest served possibilities based on what you told us.`,
      };
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
    mapPossibility(possibility, index + 1, presentation, passport),
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
    destinationResolution: destinationResolution(engineResult),
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
    "A complete recommendation result is required before journey possibilities can be presented.",
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
    destinationResolution: {
      status: "discovery",
      message: "Complete your Journey Passport to begin exploring possibilities.",
    },
    excludedCandidateIds: [],
    recoveryMessage:
      "The recommendation engine has not yet been connected to this presentation route.",
    isFallback: passport === null,
  };
}
