import { CORE_INTENT_CAPABILITY } from "./engine.rules";
import type {
  CandidateCapabilities,
  CandidateContradictionEvaluation,
  CandidateEligibility,
  ContradictionReason,
  NormalizedJourneyPassport,
  RegionCandidate,
  RegionEligibility,
  ThemeId,
} from "./engine.types";

function capabilitiesFromThemes(
  themes: readonly ThemeId[],
): CandidateCapabilities {
  const has = (...values: readonly ThemeId[]) =>
    values.some((value) => themes.includes(value));

  return {
    mountain: has("mountains", "hills", "snow-experiences"),
    beach: has("beaches"),
    wildlife: has("wildlife", "safari"),
    city: has("city-break"),
    heritage: has("heritage"),
    wellness: has("wellness"),
    nature: has(
      "nature",
      "forests",
      "hills",
      "mountains",
      "backwaters",
      "lakes",
      "rivers",
      "islands",
    ),
    adventure: has(
      "adventure",
      "water-sports",
      "safari",
      "road-trips",
      "snow-experiences",
    ),
  };
}

function regionCapabilities(region: RegionCandidate): CandidateCapabilities {
  return region.capabilities ?? capabilitiesFromThemes(region.themes);
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

  const detectedIntent =
    passport.coreIntent.strength === "STRONG"
      ? passport.coreIntent.intent
      : undefined;

  if (detectedIntent) {
    evaluatedRules.push(`CORE_INTENT_${detectedIntent}`);
    const capability = CORE_INTENT_CAPABILITY[detectedIntent];
    const capableRegions = consideredRegions.filter(
      ({ region }) => regionCapabilities(region)[capability],
    );

    if (capableRegions.length === 0) {
      contradictions.push({
        code: "CORE_INTENT_CAPABILITY_MISSING",
        scope: requestedRegionId ? "region" : "destination",
        candidateId: requestedRegionId ?? eligibility.candidate.id,
        explanation: `${eligibility.candidate.name} has no eligible region with the required ${capability} capability.`,
        relevantInput: detectedIntent,
        requiredCapability: capability,
      });
    }

    consideredRegions = capableRegions;
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
