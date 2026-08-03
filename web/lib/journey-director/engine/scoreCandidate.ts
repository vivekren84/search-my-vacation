import {
  COMFORT_ORDER,
  CORE_INTENT_CAPABILITY,
  DESTINATION_SCORE_WEIGHTS,
  PACE_ORDER,
  PENALTY_POINTS,
  REGION_SCORE_WEIGHTS,
} from "./engine.rules";
import type {
  AppliedPenalty,
  CandidateConcern,
  CandidateContradictionEvaluation,
  CandidateEvidence,
  ComfortLevel,
  DestinationScoreDimension,
  EmotionId,
  MemoryGoalId,
  NormalizedJourneyPassport,
  RankedCandidate,
  RegionCandidate,
  RegionEligibility,
  RegionScore,
  RegionScoreDimension,
  ScoreFactor,
  SeasonalGuidance,
  ServiceConfidence,
  SuitabilityLevel,
  ThemeId,
  TravellerSuitability,
  WeightedSignal,
} from "./engine.types";

const SCORE_LABELS: Record<DestinationScoreDimension | RegionScoreDimension, string> = {
  "core-intent-alignment": "Core journey intent alignment",
  "emotional-alignment": "Emotional alignment",
  "theme-experience-alignment": "Theme and experience alignment",
  "traveller-companion-suitability": "Traveller and companion suitability",
  "travel-pace-alignment": "Travel pace alignment",
  "comfort-alignment": "Comfort alignment",
  "season-timing-suitability": "Season and timing suitability",
  "region-match-quality": "Region match quality",
  "memory-goal-alignment": "Memory goal alignment",
  "operational-confidence": "Operational confidence",
  "core-intent-fit": "Regional core journey intent fit",
  "emotional-fit": "Regional emotional fit",
  "theme-signature-experience-fit": "Regional theme and signature experience fit",
  "pace-fit": "Regional pace fit",
  "companion-suitability": "Regional companion suitability",
  "memory-goal-fit": "Regional memory goal fit",
  "logistical-fit": "Regional logistical fit",
  "comfort-fit": "Regional comfort fit",
};

const suitabilityCoefficients: Record<SuitabilityLevel, number> = {
  BEST_FOR: 1,
  SUITABLE: 0.8,
  ADJUSTMENT_REQUIRED: 0.5,
  UNSUITABLE: 0,
};

const seasonalCoefficients: Record<Exclude<SeasonalGuidance, "NOT_RECOMMENDED">, number> = {
  PREFERRED: 1,
  POSSIBLE_WITH_GUIDANCE: 0.6,
  UNKNOWN: 0,
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, places = 4) {
  const multiplier = 10 ** places;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function idCompare(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function signalIds<T extends string>(signals: readonly WeightedSignal<T>[]) {
  return signals.map((signal) => signal.id);
}

function weightedCoverage<T extends string>(
  signals: readonly WeightedSignal<T>[],
  compatibility: (id: T) => number,
  neutralWhenEmpty = 0,
) {
  if (signals.length === 0) return neutralWhenEmpty;
  const strength = signals.reduce((sum, signal) => sum + signal.strength, 0);
  if (strength === 0) return neutralWhenEmpty;

  return clamp(
    signals.reduce((sum, signal) => sum + signal.strength * compatibility(signal.id), 0) / strength,
  );
}

function emotionalMatch(
  signals: readonly WeightedSignal<EmotionId>[],
  primaryEmotion: EmotionId,
  supportingEmotions: readonly EmotionId[],
) {
  if (signals.length === 0) return { match: 0, primaryTravellerMatch: 0 };
  const primaryTravellerSignal = signals[0];
  const compatibility = (id: EmotionId) => {
    if (id === primaryEmotion) return 1;
    if (supportingEmotions.includes(id)) return 0.8;
    return 0;
  };
  const primaryTravellerMatch = compatibility(primaryTravellerSignal.id);
  const supportingCoverage = weightedCoverage(signals, compatibility);

  return {
    match: clamp(primaryTravellerMatch * 0.6 + supportingCoverage * 0.4),
    primaryTravellerMatch,
  };
}

function themeMatch(
  signals: readonly WeightedSignal<ThemeId>[],
  directThemes: readonly ThemeId[],
  experiences: readonly { themes: readonly ThemeId[] }[],
) {
  const experienceThemes = new Set(experiences.flatMap((experience) => experience.themes));
  return weightedCoverage(signals, (id) => {
    if (directThemes.includes(id)) return experienceThemes.has(id) ? 1 : 0.8;
    if (experienceThemes.has(id)) return 0.8;
    return 0;
  });
}

function companionMatch(
  signals: NormalizedJourneyPassport["companions"],
  suitability: readonly TravellerSuitability[],
) {
  return weightedCoverage(signals, (id) => {
    const record = suitability.find((entry) => entry.travellerType === id);
    return record ? suitabilityCoefficients[record.level] : 0;
  });
}

function orderedMatch<T extends string>(
  signals: readonly WeightedSignal<T>[],
  supported: readonly T[],
  order: readonly T[],
  neutralWhenEmpty: number,
) {
  return weightedCoverage(
    signals,
    (id) => {
      const preferredIndex = order.indexOf(id);
      const distances = supported
        .map((value) => Math.abs(preferredIndex - order.indexOf(value)))
        .filter((distance) => distance >= 0);
      const distance = distances.length > 0 ? Math.min(...distances) : -1;

      if (distance === 0) return 1;
      if (distance === 1) return 0.7;
      if (distance === 2) return 0.35;
      if (distance >= 3) return 0.1;
      return 0;
    },
    neutralWhenEmpty,
  );
}

function comfortMatch(signals: readonly WeightedSignal<ComfortLevel>[], supported: readonly ComfortLevel[]) {
  if (signals.length === 0) return 0.5;

  return weightedCoverage(signals, (id) => {
    const preferredIndex = COMFORT_ORDER.indexOf(id);
    const distances = supported.map((value) => Math.abs(preferredIndex - COMFORT_ORDER.indexOf(value)));
    const distance = distances.length > 0 ? Math.min(...distances) : -1;
    if (distance === 0) return 1;
    if (distance === 1) return 0.6;
    if (distance >= 2) return 0.2;
    return 0;
  });
}

function seasonMatch(
  passport: NormalizedJourneyPassport,
  seasonality: readonly { month: number; guidance: SeasonalGuidance }[],
) {
  if (passport.timing.months.length === 0) return 0.5;

  const values = passport.timing.months.map((month) => {
    const guidance = seasonality.find((entry) => entry.month === month)?.guidance ?? "UNKNOWN";
    if (guidance === "NOT_RECOMMENDED") return 0;
    if (guidance === "UNKNOWN" && !passport.timing.fixed) return 0.5;
    return seasonalCoefficients[guidance];
  });

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function memoryMatch(
  signals: readonly WeightedSignal<MemoryGoalId>[],
  memoryGoals: readonly MemoryGoalId[],
  experiences: readonly { memoryGoals: readonly MemoryGoalId[] }[],
) {
  const supported = new Set([...memoryGoals, ...experiences.flatMap((experience) => experience.memoryGoals)]);
  return weightedCoverage(signals, (id) => (supported.has(id) ? 1 : 0));
}

function operationalMatch(serviceConfidence: ServiceConfidence) {
  if (serviceConfidence === "CONFIDENT") return 1;
  if (serviceConfidence === "SUPPORTED") return 0.75;
  return 0;
}

function coreIntentMatch(
  passport: NormalizedJourneyPassport,
  region: RegionCandidate,
) {
  if (passport.coreIntent.strength !== "STRONG" || !passport.coreIntent.intent) {
    return 0.5;
  }

  const capability = CORE_INTENT_CAPABILITY[passport.coreIntent.intent];
  return region.capabilities?.[capability] ? 1 : 0;
}

function createFactor(
  factorId: DestinationScoreDimension | RegionScoreDimension,
  rawMatch: number,
  weight: number,
  passportSignals: readonly string[],
  candidateSignals: readonly string[],
  caution?: string,
): ScoreFactor {
  return {
    factorId,
    label: SCORE_LABELS[factorId],
    rawMatch: round(rawMatch),
    weight,
    finalContribution: round(rawMatch * weight),
    supportingPassportSignals: passportSignals,
    supportingCandidateSignals: candidateSignals,
    ...(caution ? { caution } : {}),
  };
}

function concernMatches(concern: CandidateConcern, passport: NormalizedJourneyPassport) {
  if (concern.when.always) return true;
  const travellerEmotions = signalIds(passport.emotions);
  const travellerThemes = signalIds(passport.themes);
  const travellerPaces = signalIds(passport.pacePreferences);
  const companions = signalIds(passport.companions);

  return Boolean(
    concern.when.emotions?.some((value) => travellerEmotions.includes(value)) ||
      concern.when.themes?.some((value) => travellerThemes.includes(value)) ||
      concern.when.paces?.some((value) => travellerPaces.includes(value)) ||
      concern.when.companions?.some((value) => companions.includes(value)),
  );
}

function applyPenalties(
  concerns: readonly CandidateConcern[],
  passport: NormalizedJourneyPassport,
): readonly AppliedPenalty[] {
  const byCategory = new Map<CandidateConcern["category"], CandidateConcern>();

  concerns.filter((concern) => concernMatches(concern, passport)).forEach((concern) => {
    const current = byCategory.get(concern.category);
    if (!current || PENALTY_POINTS[concern.severity] > PENALTY_POINTS[current.severity]) {
      byCategory.set(concern.category, concern);
    }
  });

  return [...byCategory.values()]
    .map((concern) => ({
      ruleId: concern.id,
      category: concern.category,
      severity: concern.severity,
      points: PENALTY_POINTS[concern.severity],
      explanation: concern.explanation,
    }))
    .sort((left, right) => idCompare(left.category, right.category));
}

function matchedEvidence(
  evidence: readonly CandidateEvidence[],
  passport: NormalizedJourneyPassport,
) {
  const emotions = signalIds(passport.emotions);
  const themes = signalIds(passport.themes);
  const memoryGoals = signalIds(passport.memoryGoals);
  const companions = signalIds(passport.companions);

  return evidence.filter((item) =>
    Boolean(
      item.emotions?.some((value) => emotions.includes(value)) ||
        item.themes?.some((value) => themes.includes(value)) ||
        item.memoryGoals?.some((value) => memoryGoals.includes(value)) ||
        item.companions?.some((value) => companions.includes(value)),
    ),
  );
}

function scoreRegion(
  eligibility: RegionEligibility,
  passport: NormalizedJourneyPassport,
): RegionScore {
  const region = eligibility.region;
  const dominantIntent = coreIntentMatch(passport, region);
  const coreIntentCapability = passport.coreIntent.intent
    ? CORE_INTENT_CAPABILITY[passport.coreIntent.intent]
    : undefined;
  const emotional = emotionalMatch(passport.emotions, region.primaryEmotion, region.supportingEmotions);
  const theme = themeMatch(passport.themes, region.themes, region.signatureExperiences);
  const pace = orderedMatch(passport.pacePreferences, region.paces, PACE_ORDER, 0);
  const companion = companionMatch(passport.companions, region.bestFor);
  const memory = memoryMatch(passport.memoryGoals, region.memoryGoals, region.signatureExperiences);
  const comfort = comfortMatch(passport.comfortPreferences, region.comforts);

  const breakdown: ScoreFactor[] = [
    createFactor(
      "core-intent-fit",
      dominantIntent,
      REGION_SCORE_WEIGHTS["core-intent-fit"],
      passport.coreIntent.evidence,
      coreIntentCapability
        ? [`${region.id}:${coreIntentCapability}:${dominantIntent === 1 ? "supported" : "not-supported"}`]
        : ["no-strong-core-intent"],
      coreIntentCapability
        ? undefined
        : "No strong physical core intent was detected; neutral credit applied.",
    ),
    createFactor(
      "emotional-fit",
      emotional.match,
      REGION_SCORE_WEIGHTS["emotional-fit"],
      signalIds(passport.emotions),
      [region.primaryEmotion, ...region.supportingEmotions],
    ),
    createFactor(
      "theme-signature-experience-fit",
      theme,
      REGION_SCORE_WEIGHTS["theme-signature-experience-fit"],
      signalIds(passport.themes),
      region.themes,
    ),
    createFactor(
      "pace-fit",
      pace,
      REGION_SCORE_WEIGHTS["pace-fit"],
      signalIds(passport.pacePreferences),
      region.paces,
      passport.pacePreferences.length === 0 ? "Journey Passport v1.0 did not provide a usable pace signal." : undefined,
    ),
    createFactor(
      "companion-suitability",
      companion,
      REGION_SCORE_WEIGHTS["companion-suitability"],
      signalIds(passport.companions),
      region.bestFor.map((entry) => `${entry.travellerType}:${entry.level}`),
    ),
    createFactor(
      "memory-goal-fit",
      memory,
      REGION_SCORE_WEIGHTS["memory-goal-fit"],
      signalIds(passport.memoryGoals),
      region.memoryGoals,
    ),
    createFactor(
      "logistical-fit",
      clamp(region.logisticalFit),
      REGION_SCORE_WEIGHTS["logistical-fit"],
      [passport.timing.kind],
      [`logistical-fit:${region.logisticalFit}`],
    ),
    createFactor(
      "comfort-fit",
      comfort,
      REGION_SCORE_WEIGHTS["comfort-fit"],
      signalIds(passport.comfortPreferences),
      region.comforts,
      passport.comfortPreferences.length === 0 ? "Comfort is unknown in Journey Passport v1.0; neutral credit applied." : undefined,
    ),
  ];
  const penalties = applyPenalties(region.concerns, passport);
  const baseScore = breakdown.reduce((sum, factor) => sum + factor.finalContribution, 0);
  const penaltyTotal = penalties.reduce((sum, penalty) => sum + penalty.points, 0);

  return {
    region,
    score: round(clamp(baseScore - penaltyTotal, 0, 100), 2),
    breakdown,
    penalties,
  };
}

function scoreRegionComparator(left: RegionScore, right: RegionScore) {
  const scoreDifference = right.score - left.score;
  if (scoreDifference !== 0) return scoreDifference;
  return idCompare(left.region.id, right.region.id);
}

function intentAreaPriority(passport: NormalizedJourneyPassport, region: RegionScore) {
  if (passport.coreIntent.strength !== "STRONG") return 0;
  const name = `${region.region.id} ${region.region.name}`.toLocaleLowerCase("en-US");
  if (passport.coreIntent.intent === "WELLNESS" && name.includes("ubud")) return 10;
  if (passport.coreIntent.intent === "BEACH" && name.includes("nusa dua")) return 10;
  if (passport.coreIntent.intent === "BEACH" && name.includes("uluwatu")) return 9;
  if (passport.coreIntent.intent === "BEACH" && name.includes("seminyak")) return 8;
  return 0;
}

export function scoreEligibleCandidate(
  evaluation: CandidateContradictionEvaluation,
  passport: NormalizedJourneyPassport,
): RankedCandidate {
  if (!evaluation.passed) {
    throw new Error(
      `Candidate ${evaluation.eligibility.candidate.id} reached scoring after a contradiction failure.`,
    );
  }

  const eligibility = evaluation.eligibility;
  const candidate = eligibility.candidate;
  const regionScores = evaluation.compatibleRegions
    .map((region) => scoreRegion(region, passport))
    .sort((left, right) => intentAreaPriority(passport, right) - intentAreaPriority(passport, left) || scoreRegionComparator(left, right));
  const selectedRegion = regionScores[0];

  if (!selectedRegion) {
    throw new Error(`Candidate ${candidate.id} reached scoring without an eligible region.`);
  }

  const emotional = emotionalMatch(passport.emotions, candidate.primaryEmotion, candidate.supportingEmotions);
  const theme = themeMatch(passport.themes, candidate.themes, candidate.signatureExperiences);
  const companion = companionMatch(passport.companions, candidate.bestFor);
  const pace = orderedMatch(passport.pacePreferences, candidate.paces, PACE_ORDER, 0);
  const comfort = comfortMatch(passport.comfortPreferences, candidate.comforts);
  const season = seasonMatch(passport, candidate.seasonality);
  const region = selectedRegion.score / 100;
  const memory = memoryMatch(passport.memoryGoals, candidate.memoryGoals, candidate.signatureExperiences);
  const operational = operationalMatch(candidate.serviceConfidence);
  const coreIntentCapability = passport.coreIntent.intent
    ? CORE_INTENT_CAPABILITY[passport.coreIntent.intent]
    : undefined;
  const dominantIntent = coreIntentMatch(passport, selectedRegion.region);

  const breakdown: ScoreFactor[] = [
    createFactor(
      "core-intent-alignment",
      dominantIntent,
      DESTINATION_SCORE_WEIGHTS["core-intent-alignment"],
      passport.coreIntent.evidence,
      coreIntentCapability
        ? [
            `${selectedRegion.region.id}:${coreIntentCapability}:${dominantIntent === 1 ? "supported" : "not-supported"}`,
          ]
        : ["no-strong-core-intent"],
      coreIntentCapability
        ? undefined
        : "No strong physical core intent was detected; neutral credit applied.",
    ),
    createFactor(
      "emotional-alignment",
      emotional.match,
      DESTINATION_SCORE_WEIGHTS["emotional-alignment"],
      signalIds(passport.emotions),
      [candidate.primaryEmotion, ...candidate.supportingEmotions],
    ),
    createFactor(
      "theme-experience-alignment",
      theme,
      DESTINATION_SCORE_WEIGHTS["theme-experience-alignment"],
      signalIds(passport.themes),
      candidate.themes,
    ),
    createFactor(
      "traveller-companion-suitability",
      companion,
      DESTINATION_SCORE_WEIGHTS["traveller-companion-suitability"],
      signalIds(passport.companions),
      candidate.bestFor.map((entry) => `${entry.travellerType}:${entry.level}`),
    ),
    createFactor(
      "travel-pace-alignment",
      pace,
      DESTINATION_SCORE_WEIGHTS["travel-pace-alignment"],
      signalIds(passport.pacePreferences),
      candidate.paces,
    ),
    createFactor(
      "comfort-alignment",
      comfort,
      DESTINATION_SCORE_WEIGHTS["comfort-alignment"],
      signalIds(passport.comfortPreferences),
      candidate.comforts,
      passport.comfortPreferences.length === 0 ? "Comfort is unknown in Journey Passport v1.0; neutral credit applied." : undefined,
    ),
    createFactor(
      "season-timing-suitability",
      season,
      DESTINATION_SCORE_WEIGHTS["season-timing-suitability"],
      [passport.timing.sourceValue],
      candidate.seasonality.map((entry) => `${entry.month}:${entry.guidance}`),
    ),
    createFactor(
      "region-match-quality",
      region,
      DESTINATION_SCORE_WEIGHTS["region-match-quality"],
      [...signalIds(passport.emotions), ...signalIds(passport.themes)],
      [selectedRegion.region.id],
    ),
    createFactor(
      "memory-goal-alignment",
      memory,
      DESTINATION_SCORE_WEIGHTS["memory-goal-alignment"],
      signalIds(passport.memoryGoals),
      candidate.memoryGoals,
    ),
    createFactor(
      "operational-confidence",
      operational,
      DESTINATION_SCORE_WEIGHTS["operational-confidence"],
      [],
      [candidate.serviceConfidence],
    ),
  ];

  const penalties = applyPenalties([...candidate.concerns, ...selectedRegion.region.concerns], passport);
  const baseScore = breakdown.reduce((sum, factor) => sum + factor.finalContribution, 0);
  const totalScore = clamp(baseScore - penalties.reduce((sum, penalty) => sum + penalty.points, 0), 0, 100);
  const fitEvidence = matchedEvidence([...candidate.evidence, ...selectedRegion.region.evidence], passport);

  return {
    candidate,
    rank: 0,
    baseScore: round(baseScore, 2),
    totalScore: round(totalScore, 2),
    breakdown,
    penalties,
    selectedRegion,
    ...(regionScores[1] && selectedRegion.score - regionScores[1].score <= 3
      ? { alternateRegion: regionScores[1] }
      : {}),
    primaryEmotionMatch: emotional.primaryTravellerMatch,
    memoryGoalMatch: memory,
    fitEvidence,
    cautions: penalties.map((penalty) => penalty.explanation),
  };
}
