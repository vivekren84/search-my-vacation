import type {
  CandidateContradictionEvaluation,
  CandidateEligibility,
  ContradictionReason,
  NormalizedJourneyPassport,
  RegionEligibility,
  CandidateCapabilities,
  CoreIntent,
  ThemeId,
} from "./engine.types";

const CAPABILITY_FOR_INTENT: Readonly<Record<CoreIntent, keyof CandidateCapabilities>> = {
  MOUNTAIN: "mountain", BEACH: "beach", WILDLIFE: "wildlife", CITY: "city",
  HERITAGE: "heritage", WELLNESS: "wellness", NATURE: "nature", ADVENTURE: "adventure",
};

const capabilityThemes: Readonly<Record<keyof CandidateCapabilities, readonly ThemeId[]>> = {
  mountain: ["mountains", "hills", "snow-experiences"],
  beach: ["beaches", "islands"],
  wildlife: ["wildlife", "safari"],
  city: ["city-break", "architecture"],
  heritage: ["heritage", "culture", "spiritual"],
  wellness: ["wellness", "slow-travel"],
  nature: ["nature", "forests", "hills", "mountains", "backwaters", "lakes", "rivers", "islands"],
  adventure: ["adventure", "water-sports", "safari", "road-trips", "snow-experiences"],
};

function hasCapability(region: RegionEligibility, capability: keyof CandidateCapabilities) {
  return region.region.capabilities?.[capability] ?? capabilityThemes[capability].some((theme) => region.region.themes.includes(theme));
}

function travelScopeContradiction(
  eligibility: CandidateEligibility,
  passport: NormalizedJourneyPassport,
): ContradictionReason | undefined {
  const candidate = eligibility.candidate;

  if (
    passport.travelScope === "DOMESTIC" &&
    candidate.category !== "DOMESTIC"
  ) {
    return {
      code: "TRAVEL_SCOPE_DOMESTIC_REQUIRED",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} is international while the traveller requested domestic journeys only.`,
      relevantInput: passport.travelScope,
    };
  }

  if (
    passport.travelScope === "INTERNATIONAL" &&
    candidate.category !== "INTERNATIONAL"
  ) {
    return {
      code: "TRAVEL_SCOPE_INTERNATIONAL_REQUIRED",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} is domestic while the traveller requested international journeys only.`,
      relevantInput: passport.travelScope,
    };
  }

  return undefined;
}

export function evaluateCandidateContradictions(
  eligibility: CandidateEligibility,
  passport: NormalizedJourneyPassport,
  requestedRegionId?: string,
): CandidateContradictionEvaluation {
  const contradictions: ContradictionReason[] = [];
  const evaluatedRules = ["TRAVEL_SCOPE"];
  const scopeFailure = travelScopeContradiction(eligibility, passport);
  if (scopeFailure) contradictions.push(scopeFailure);

  let consideredRegions = eligibility.regions.filter((region) => region.eligible);

  if (requestedRegionId) {
    evaluatedRules.push("REQUESTED_REGION");
    const requestedRegion = consideredRegions.find(
      (region) => region.region.id === requestedRegionId,
    );

    if (!requestedRegion) {
      contradictions.push({
        code: "REQUESTED_REGION_UNAVAILABLE",
        scope: "region",
        candidateId: requestedRegionId,
        explanation: `The requested region ${requestedRegionId} is not eligible for this recommendation.`,
        relevantInput: passport.destinationIntent.rawText,
      });
      consideredRegions = [];
    } else {
      consideredRegions = [requestedRegion];
    }
  }

  if (passport.coreIntent.strength === "STRONG" && passport.coreIntent.intent) {
    evaluatedRules.push("CORE_INTENT_CAPABILITY");
    const requiredCapability = CAPABILITY_FOR_INTENT[passport.coreIntent.intent];
    const capabilityRegions = consideredRegions.filter((region) => hasCapability(region, requiredCapability));
    if (capabilityRegions.length === 0) {
      contradictions.push({
        code: "CORE_INTENT_CAPABILITY_MISSING",
        scope: requestedRegionId ? "region" : "destination",
        candidateId: requestedRegionId ?? eligibility.candidate.id,
        explanation: `${requestedRegionId ? "The requested region" : eligibility.candidate.name} does not support the traveller’s primary ${passport.coreIntent.intent.toLowerCase()} experience.`,
        relevantInput: passport.coreIntent.evidence.join(", "),
        requiredCapability,
      });
      consideredRegions = [];
    } else {
      consideredRegions = capabilityRegions;
    }
  }

  const passed = contradictions.length === 0 && consideredRegions.length > 0;

  return {
    eligibility,
    passed,
    evaluatedRules,
    contradictions,
    compatibleRegions: passed
      ? consideredRegions
      : ([] satisfies RegionEligibility[]),
    ...(requestedRegionId ? { requestedRegionId } : {}),
  };
}
