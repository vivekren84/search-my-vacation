import type {
  CandidateEligibility,
  EligibilityReason,
  JourneyCandidate,
  NormalizedJourneyPassport,
  RegionCandidate,
  RegionEligibility,
  SeasonalGuidance,
} from "./engine.types";

function guidanceForMonths(
  seasonality: readonly { month: number; guidance: SeasonalGuidance }[],
  months: readonly number[],
) {
  return months.map(
    (month) =>
      seasonality.find((entry) => entry.month === month)?.guidance ?? "UNKNOWN",
  );
}

function isReviewExpired(reviewValidUntil: string, evaluationDate: string) {
  return reviewValidUntil < evaluationDate;
}

function companionIsUnsuitable(
  bestFor: readonly { travellerType: string; level: string }[],
  passport: NormalizedJourneyPassport,
) {
  return passport.companions.some((companion) =>
    bestFor.some(
      (suitability) =>
        suitability.travellerType === companion.id &&
        suitability.level === "UNSUITABLE",
    ),
  );
}

function destinationReasons(
  candidate: JourneyCandidate,
  passport: NormalizedJourneyPassport,
  evaluationDate: string,
): EligibilityReason[] {
  const reasons: EligibilityReason[] = [];

  if (candidate.status !== "ACTIVE") {
    reasons.push({
      code: "DESTINATION_NOT_ACTIVE",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} is ${candidate.status} and cannot enter automatic recommendation.`,
    });
  }

  if (
    candidate.serviceConfidence === "LIMITED" ||
    candidate.serviceConfidence === "PAUSED"
  ) {
    reasons.push({
      code: "SERVICE_CONFIDENCE_BELOW_AUTOMATIC_THRESHOLD",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} does not meet the automatic service-confidence gate.`,
    });
  }

  if (candidate.dataQuality === "INCOMPLETE") {
    reasons.push({
      code: "DESTINATION_DATA_INCOMPLETE",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} is missing critical governed matching data.`,
    });
  }

  if (
    candidate.dataQuality === "STALE" ||
    isReviewExpired(candidate.reviewValidUntil, evaluationDate)
  ) {
    reasons.push({
      code: "DESTINATION_DATA_STALE",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} requires operational data review before automatic recommendation.`,
    });
  }

  if (
    passport.timing.months.length > 0 &&
    guidanceForMonths(candidate.seasonality, passport.timing.months).includes(
      "NOT_RECOMMENDED",
    )
  ) {
    reasons.push({
      code: "DESTINATION_SEASON_NOT_RECOMMENDED",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} is not recommended for at least one supplied travel month.`,
    });
  }

  if (
    passport.timing.fixed &&
    guidanceForMonths(candidate.seasonality, passport.timing.months).includes(
      "UNKNOWN",
    )
  ) {
    reasons.push({
      code: "DESTINATION_SEASON_UNKNOWN_FOR_FIXED_DATES",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} requires seasonal review for the supplied fixed dates.`,
    });
  }

  if (companionIsUnsuitable(candidate.bestFor, passport)) {
    reasons.push({
      code: "COMPANION_CONFIRMED_UNSUITABLE",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} has a governed confirmed conflict with the selected companion profile.`,
    });
  }

  return reasons;
}

function regionReasons(
  region: RegionCandidate,
  passport: NormalizedJourneyPassport,
  evaluationDate: string,
): EligibilityReason[] {
  const reasons: EligibilityReason[] = [];

  if (region.status !== "ACTIVE") {
    reasons.push({
      code: "REGION_NOT_ACTIVE",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} is not active for Journey Director presentation.`,
    });
  }

  if (region.dataQuality === "INCOMPLETE") {
    reasons.push({
      code: "REGION_DATA_INCOMPLETE",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} is missing critical governed region data.`,
    });
  }

  if (
    region.dataQuality === "STALE" ||
    isReviewExpired(region.reviewValidUntil, evaluationDate)
  ) {
    reasons.push({
      code: "REGION_DATA_STALE",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} requires region-data review before automatic recommendation.`,
    });
  }

  if (
    passport.timing.months.length > 0 &&
    guidanceForMonths(region.seasonality, passport.timing.months).includes(
      "NOT_RECOMMENDED",
    )
  ) {
    reasons.push({
      code: "REGION_SEASON_NOT_RECOMMENDED",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} is not recommended for at least one supplied travel month.`,
    });
  }

  if (
    passport.timing.fixed &&
    guidanceForMonths(region.seasonality, passport.timing.months).includes(
      "UNKNOWN",
    )
  ) {
    reasons.push({
      code: "REGION_SEASON_UNKNOWN_FOR_FIXED_DATES",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} requires seasonal review for the supplied fixed dates.`,
    });
  }

  if (companionIsUnsuitable(region.bestFor, passport)) {
    reasons.push({
      code: "REGION_COMPANION_CONFIRMED_UNSUITABLE",
      scope: "region",
      candidateId: region.id,
      explanation: `${region.name} has a governed confirmed conflict with the selected companion profile.`,
    });
  }

  return reasons;
}

export function evaluateCandidateEligibility(
  candidate: JourneyCandidate,
  passport: NormalizedJourneyPassport,
  evaluationDate: string,
): CandidateEligibility {
  const reasons = destinationReasons(candidate, passport, evaluationDate);
  const regions: RegionEligibility[] = candidate.regions.map((region) => {
    const reasonsForRegion = regionReasons(region, passport, evaluationDate);
    return { region, eligible: reasonsForRegion.length === 0, reasons: reasonsForRegion };
  });

  if (reasons.length === 0 && !regions.some((region) => region.eligible)) {
    reasons.push({
      code: "NO_ELIGIBLE_REGION",
      scope: "destination",
      candidateId: candidate.id,
      explanation: `${candidate.name} has no eligible region with sufficient governed data.`,
    });
  }

  return { candidate, eligible: reasons.length === 0, reasons, regions };
}
