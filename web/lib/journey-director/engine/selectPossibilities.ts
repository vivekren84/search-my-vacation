import { PERSONALITY_THRESHOLDS } from "./engine.rules";
import type {
  ConfidenceBand,
  DiversityAxis,
  EnginePossibility,
  NormalizedJourneyPassport,
  RankedCandidate,
  RecommendationPersonality,
  ServiceConfidence,
} from "./engine.types";

const PERSONALITY_LABELS = {
  "perfect-match": "The Perfect Match",
  "different-rhythm": "A Different Rhythm",
  "pleasant-surprise": "A Pleasant Surprise",
} as const;

function compareIds(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function normalizedScore(score: number) {
  return score / 100;
}

function hasMaterialConflict(candidate: RankedCandidate) {
  return candidate.penalties.some((penalty) => penalty.severity === "material");
}

function evidenceReadiness(candidate: RankedCandidate) {
  const readiness = candidate.candidate.evidenceReadiness;
  return candidate.fitEvidence.length >= 2 &&
    readiness.approvedImageryReferenceCount >= 1 &&
    readiness.journeyMomentCount >= 1 &&
    readiness.hasQualifiedRegionContent &&
    !readiness.hasMaterialContentGap
    ? 1
    : 0;
}

function confidenceFor(candidate: RankedCandidate): ConfidenceBand {
  if (
    candidate.totalScore >= PERSONALITY_THRESHOLDS.perfectMatch.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.perfectMatch.region &&
    candidate.primaryEmotionMatch >= 0.8 &&
    candidate.fitEvidence.length >= 2 &&
    !hasMaterialConflict(candidate) &&
    candidate.candidate.serviceConfidence === "CONFIDENT"
  ) {
    return "high";
  }

  if (
    candidate.totalScore >= PERSONALITY_THRESHOLDS.humanReview.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.humanReview.region &&
    candidate.fitEvidence.length >= 2 &&
    !hasMaterialConflict(candidate)
  ) {
    return "moderate";
  }

  if (candidate.totalScore >= PERSONALITY_THRESHOLDS.humanReview.destination) return "low";
  return "insufficient";
}

function axisDifference(left: readonly string[], right: readonly string[]) {
  const leftValues = new Set(left);
  const rightValues = new Set(right);
  const intersection = [...leftValues].filter((value) => rightValues.has(value)).length;
  if (intersection === 0) return 1;
  if (intersection === leftValues.size && intersection === rightValues.size) return 0;
  return 0.5;
}

function diversityScore(left: RankedCandidate, right: RankedCandidate) {
  const axes: readonly DiversityAxis[] = [
    "setting-geography",
    "journey-rhythm",
    "dominant-theme",
    "signature-experience-style",
    "cultural-expression",
  ];

  return axes.reduce(
    (sum, axis) => sum + axisDifference(left.candidate.diversity[axis], right.candidate.diversity[axis]),
    0,
  ) / axes.length;
}

function differentiatorsFrom(reference: RankedCandidate, candidate: RankedCandidate) {
  const axes: readonly DiversityAxis[] = [
    "setting-geography",
    "journey-rhythm",
    "dominant-theme",
    "signature-experience-style",
    "cultural-expression",
  ];

  return axes
    .filter((axis) => axisDifference(reference.candidate.diversity[axis], candidate.candidate.diversity[axis]) >= 0.5)
    .map((axis) => axis);
}

function noveltyScore(
  passport: NormalizedJourneyPassport,
  candidate: RankedCandidate,
  selected: readonly RankedCandidate[],
) {
  const requested = passport.destinationIntent.rawText.trim().toLocaleLowerCase("en-US");
  const names = [candidate.candidate.name, candidate.candidate.id, ...candidate.candidate.aliases]
    .map((value) => value.toLocaleLowerCase("en-US"));
  const wasExplicitlyNamed = requested.length > 0 && names.some((name) => requested.includes(name));
  const settingOrCultureDiffers = selected.every(
    (item) =>
      axisDifference(item.candidate.diversity["setting-geography"], candidate.candidate.diversity["setting-geography"]) >= 0.5 ||
      axisDifference(item.candidate.diversity["cultural-expression"], candidate.candidate.diversity["cultural-expression"]) >= 0.5,
  );
  const signatureDiffers = selected.every(
    (item) =>
      axisDifference(
        item.candidate.diversity["signature-experience-style"],
        candidate.candidate.diversity["signature-experience-style"],
      ) >= 0.5,
  );

  return Math.min(1, (wasExplicitlyNamed ? 0 : 0.5) + (settingOrCultureDiffers ? 0.25 : 0) + (signatureDiffers ? 0.25 : 0));
}

function operationalRank(value: ServiceConfidence) {
  return value === "CONFIDENT" ? 1 : value === "SUPPORTED" ? 0.75 : 0;
}

type SelectionCandidate = {
  ranked: RankedCandidate;
  selectionValue: number;
  differentiators: readonly string[];
};

function personalityComparator(left: SelectionCandidate, right: SelectionCandidate) {
  const selectionDifference = right.selectionValue - left.selectionValue;
  if (Math.abs(selectionDifference) > 0.005) return selectionDifference;

  const emotionDifference = right.ranked.primaryEmotionMatch - left.ranked.primaryEmotionMatch;
  if (emotionDifference !== 0) return emotionDifference;

  const regionDifference = right.ranked.selectedRegion.score - left.ranked.selectedRegion.score;
  if (regionDifference !== 0) return regionDifference;

  const readinessDifference = evidenceReadiness(right.ranked) - evidenceReadiness(left.ranked);
  if (readinessDifference !== 0) return readinessDifference;

  const operationalDifference =
    operationalRank(right.ranked.candidate.serviceConfidence) -
    operationalRank(left.ranked.candidate.serviceConfidence);
  if (operationalDifference !== 0) return operationalDifference;

  return compareIds(left.ranked.candidate.id, right.ranked.candidate.id);
}

function qualifiesForPerfectMatch(candidate: RankedCandidate) {
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.perfectMatch.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.perfectMatch.region &&
    candidate.primaryEmotionMatch >= 0.8 &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    (confidenceFor(candidate) === "high" || confidenceFor(candidate) === "moderate");
}

function qualifiesForDifferentRhythm(candidate: RankedCandidate) {
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.differentRhythm.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.differentRhythm.region &&
    candidate.primaryEmotionMatch >= 0.8 &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    confidenceFor(candidate) !== "low" &&
    confidenceFor(candidate) !== "insufficient";
}

function qualifiesForPleasantSurprise(candidate: RankedCandidate) {
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.pleasantSurprise.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.pleasantSurprise.region &&
    candidate.primaryEmotionMatch >= 0.8 &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    candidate.candidate.serviceConfidence === "CONFIDENT" &&
    confidenceFor(candidate) !== "low" &&
    confidenceFor(candidate) !== "insufficient";
}

function createPossibility(
  personality: RecommendationPersonality,
  selection: SelectionCandidate,
): EnginePossibility {
  const candidate = selection.ranked;
  return {
    possibilityId: `${personality}:${candidate.candidate.id}:${candidate.selectedRegion.region.id}`,
    personality,
    personalityLabel: PERSONALITY_LABELS[personality],
    candidateId: candidate.candidate.id,
    destinationName: candidate.candidate.name,
    regionId: candidate.selectedRegion.region.id,
    regionName: candidate.selectedRegion.region.name,
    rank: candidate.rank,
    totalScore: candidate.totalScore,
    scoreBreakdown: candidate.breakdown,
    fitEvidence: candidate.fitEvidence,
    differentiators: selection.differentiators,
    cautions: candidate.cautions,
    confidence: confidenceFor(candidate),
    selectionValue: Math.round(selection.selectionValue * 10_000) / 10_000,
  };
}

export function selectJourneyPossibilities(
  rankedCandidates: readonly RankedCandidate[],
  passport: NormalizedJourneyPassport,
): readonly EnginePossibility[] {
  const perfectMatch = rankedCandidates.find(qualifiesForPerfectMatch);
  if (!perfectMatch) return [];

  const selected: RankedCandidate[] = [perfectMatch];
  const possibilities: EnginePossibility[] = [
    createPossibility("perfect-match", {
      ranked: perfectMatch,
      selectionValue: normalizedScore(perfectMatch.totalScore),
      differentiators: [],
    }),
  ];

  const rhythmCandidates = rankedCandidates
    .filter((candidate) => candidate.candidate.id !== perfectMatch.candidate.id)
    .filter(qualifiesForDifferentRhythm)
    .map((candidate) => {
      const diversity = diversityScore(perfectMatch, candidate);
      return {
        ranked: candidate,
        selectionValue: normalizedScore(candidate.totalScore) * 0.75 + diversity * 0.25,
        differentiators: differentiatorsFrom(perfectMatch, candidate),
      };
    })
    .filter((candidate) => candidate.differentiators.length > 0)
    .sort(personalityComparator);
  const differentRhythm = rhythmCandidates[0];

  if (differentRhythm) {
    selected.push(differentRhythm.ranked);
    possibilities.push(createPossibility("different-rhythm", differentRhythm));
  }

  const surpriseCandidates = rankedCandidates
    .filter((candidate) => !selected.some((selectedCandidate) => selectedCandidate.candidate.id === candidate.candidate.id))
    .filter(qualifiesForPleasantSurprise)
    .map((candidate) => {
      const novelty = noveltyScore(passport, candidate, selected);
      const readiness = evidenceReadiness(candidate);
      return {
        ranked: candidate,
        selectionValue: normalizedScore(candidate.totalScore) * 0.7 + novelty * 0.2 + readiness * 0.1,
        differentiators: selected.flatMap((item) => differentiatorsFrom(item, candidate)).filter((value, index, values) => values.indexOf(value) === index),
      };
    })
    .sort(personalityComparator);
  const pleasantSurprise = surpriseCandidates[0];

  if (pleasantSurprise) possibilities.push(createPossibility("pleasant-surprise", pleasantSurprise));

  return possibilities;
}
