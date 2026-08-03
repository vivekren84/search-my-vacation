import { PERSONALITY_THRESHOLDS } from "./engine.rules";
import type {
  ConfidenceBand,
  DiversityAxis,
  EnginePossibility,
  NormalizedJourneyPassport,
  RankedCandidate,
  RecommendationPersonality,
} from "./engine.types";

const PERSONALITY_LABELS = {
  "perfect-match": "The Perfect Match",
  "different-rhythm": "The Beautiful Puzzle",
  "pleasant-surprise": "The Hidden Gem",
} as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

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
    (sum, axis) =>
      sum +
      axisDifference(
        left.candidate.diversity[axis],
        right.candidate.diversity[axis],
      ),
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
    .filter(
      (axis) =>
        axisDifference(
          reference.candidate.diversity[axis],
          candidate.candidate.diversity[axis],
        ) >= 0.5,
    )
    .map((axis) => axis);
}

function noveltyScore(
  passport: NormalizedJourneyPassport,
  candidate: RankedCandidate,
  selected: readonly RankedCandidate[],
) {
  const requested = passport.destinationIntent.rawText.trim().toLocaleLowerCase("en-US");
  const names = [
    candidate.candidate.name,
    candidate.candidate.id,
    ...candidate.candidate.aliases,
  ].map((value) => value.toLocaleLowerCase("en-US"));
  const wasExplicitlyNamed =
    requested.length > 0 && names.some((name) => requested.includes(name));
  const settingOrCultureDiffers = selected.every(
    (item) =>
      axisDifference(
        item.candidate.diversity["setting-geography"],
        candidate.candidate.diversity["setting-geography"],
      ) >= 0.5 ||
      axisDifference(
        item.candidate.diversity["cultural-expression"],
        candidate.candidate.diversity["cultural-expression"],
      ) >= 0.5,
  );
  const signatureDiffers = selected.every(
    (item) =>
      axisDifference(
        item.candidate.diversity["signature-experience-style"],
        candidate.candidate.diversity["signature-experience-style"],
      ) >= 0.5,
  );

  return Math.min(
    1,
    (wasExplicitlyNamed ? 0 : 0.5) +
      (settingOrCultureDiffers ? 0.25 : 0) +
      (signatureDiffers ? 0.25 : 0),
  );
}

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function travelStyle(candidate: RankedCandidate) {
  const pace = candidate.selectedRegion.region.paces[0] ?? candidate.candidate.paces[0];
  const styles = {
    relaxed: "Relaxed and unhurried",
    balanced: "Balanced, with time to pause",
    explorer: "Curious and discovery-led",
    "fast-paced": "Energetic and full",
  } as const;
  return pace ? styles[pace] : "Thoughtfully paced around you";
}

function recommendedSeason(candidate: RankedCandidate) {
  const seasonality = candidate.selectedRegion.region.seasonality;
  const preferred = seasonality
    .filter((entry) => entry.guidance === "PREFERRED")
    .map((entry) => MONTHS[entry.month - 1]);
  const possible = seasonality
    .filter((entry) => entry.guidance === "POSSIBLE_WITH_GUIDANCE")
    .map((entry) => MONTHS[entry.month - 1]);
  const months = preferred.length > 0 ? preferred : possible;
  if (months.length === 0) return undefined;
  if (months.length === 12) return "Year-round";
  if (months.length <= 3) return months.join(", ");
  return `${months[0]} to ${months[months.length - 1]}`;
}

type SelectionCandidate = {
  ranked: RankedCandidate;
  selectionValue: number;
  differentiators: readonly string[];
};

function selectionComparator(left: SelectionCandidate, right: SelectionCandidate) {
  const selectionDifference = right.selectionValue - left.selectionValue;
  if (Math.abs(selectionDifference) > 0.005) return selectionDifference;
  if (right.ranked.totalScore !== left.ranked.totalScore) {
    return right.ranked.totalScore - left.ranked.totalScore;
  }
  return left.ranked.candidate.id.localeCompare(right.ranked.candidate.id);
}

function qualifiesForPerfectMatch(candidate: RankedCandidate) {
  const confidence = confidenceFor(candidate);
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.perfectMatch.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.perfectMatch.region &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    (confidence === "high" || confidence === "moderate") &&
    candidate.candidate.serviceConfidence !== "LIMITED" &&
    candidate.candidate.serviceConfidence !== "PAUSED";
}

function qualifiesForDifferentRhythm(candidate: RankedCandidate) {
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.differentRhythm.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.differentRhythm.region &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    confidenceFor(candidate) !== "insufficient";
}

function qualifiesForPleasantSurprise(candidate: RankedCandidate) {
  return candidate.totalScore >= PERSONALITY_THRESHOLDS.pleasantSurprise.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.pleasantSurprise.region &&
    !hasMaterialConflict(candidate) &&
    candidate.fitEvidence.length >= 2 &&
    candidate.candidate.serviceConfidence !== "LIMITED" &&
    candidate.candidate.serviceConfidence !== "PAUSED" &&
    confidenceFor(candidate) !== "insufficient";
}

function createPossibility(
  personality: RecommendationPersonality,
  selection: SelectionCandidate,
): EnginePossibility {
  const candidate = selection.ranked;
  const experiences = candidate.selectedRegion.region.themes
    .slice(0, 3)
    .map(titleCase);

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
    experienceHighlights:
      experiences.length > 0 ? experiences : ["A journey shaped around your story"],
    recommendedTravelStyle: travelStyle(candidate),
    recommendedSeason: recommendedSeason(candidate),
  };
}

export function selectJourneyPossibilities(
  rankedCandidates: readonly RankedCandidate[],
  passport: NormalizedJourneyPassport,
): {
  possibilities: readonly EnginePossibility[];
  decisions: readonly {
    candidateId: string;
    qualified: boolean;
    eligiblePersonalities: readonly RecommendationPersonality[];
    selectedPersonality?: RecommendationPersonality;
    explanation: string;
  }[];
  internationalPolicy: {
    scope: NormalizedJourneyPassport["travelScope"];
    decision: string;
    internationalCandidateId?: string;
  };
} {
  const qualificationRoles = (candidate: RankedCandidate) => {
    const roles: RecommendationPersonality[] = [];
    if (qualifiesForPerfectMatch(candidate)) roles.push("perfect-match");
    if (qualifiesForDifferentRhythm(candidate)) roles.push("different-rhythm");
    if (qualifiesForPleasantSurprise(candidate)) roles.push("pleasant-surprise");
    return roles;
  };
  const qualifiedPerfectMatch = rankedCandidates.find(qualifiesForPerfectMatch);
  const perfectMatch = qualifiedPerfectMatch ?? rankedCandidates[0];

  if (!perfectMatch) {
    return {
      possibilities: [],
      decisions: rankedCandidates.map((candidate) => ({
        candidateId: candidate.candidate.id,
        qualified: false,
        eligiblePersonalities: qualificationRoles(candidate),
        explanation: "No contradiction-free candidate was available for a responsible shortlist.",
      })),
      internationalPolicy: {
        scope: passport.travelScope,
        decision: "No contradiction-free candidate was available.",
      },
    };
  }

  const selected: RankedCandidate[] = [perfectMatch];
  const possibilities: EnginePossibility[] = [
    createPossibility("perfect-match", {
      ranked: perfectMatch,
      selectionValue: normalizedScore(perfectMatch.totalScore),
      differentiators: [],
    }),
  ];

  const rhythmPool = rankedCandidates.filter((candidate) => candidate.candidate.id !== perfectMatch.candidate.id);
  const qualifiedRhythmPool = rhythmPool.filter(qualifiesForDifferentRhythm);
  const rhythmCandidates = passport.coreIntent.strength === "STRONG"
    ? rhythmPool
    : qualifiedRhythmPool.length > 0 ? qualifiedRhythmPool : rhythmPool;
  const rhythm = rhythmCandidates
    .map((candidate) => {
      const diversity = diversityScore(perfectMatch, candidate);
      return {
        ranked: candidate,
        selectionValue: passport.coreIntent.strength === "STRONG"
          ? 1 - candidate.rank / 100
          : normalizedScore(candidate.totalScore) * 0.75 + diversity * 0.25,
        differentiators: differentiatorsFrom(perfectMatch, candidate),
      };
    })
    .sort(selectionComparator)[0];

  if (rhythm) {
    selected.push(rhythm.ranked);
    possibilities.push(createPossibility("different-rhythm", rhythm));
  }

  const surprisePool = rankedCandidates.filter(
      (candidate) =>
        !selected.some(
          (selectedCandidate) =>
            selectedCandidate.candidate.id === candidate.candidate.id,
        ),
    );
  const qualifiedSurprisePool = surprisePool.filter(qualifiesForPleasantSurprise);
  const surpriseCandidates = passport.coreIntent.strength === "STRONG"
    ? surprisePool
    : qualifiedSurprisePool.length > 0 ? qualifiedSurprisePool : surprisePool;
  const surprise = surpriseCandidates
    .map((candidate) => ({
      ranked: candidate,
      selectionValue: passport.coreIntent.strength === "STRONG"
        ? 1 - candidate.rank / 100
        : normalizedScore(candidate.totalScore) * 0.7 +
          noveltyScore(passport, candidate, selected) * 0.2 +
          evidenceReadiness(candidate) * 0.1,
      differentiators: selected
        .flatMap((item) => differentiatorsFrom(item, candidate))
        .filter((value, index, values) => values.indexOf(value) === index),
    }))
    .sort(selectionComparator)[0];

  if (surprise) {
    selected.push(surprise.ranked);
    possibilities.push(createPossibility("pleasant-surprise", surprise));
  }

  let internationalPolicy: {
    scope: NormalizedJourneyPassport["travelScope"];
    decision: string;
    internationalCandidateId?: string;
  } = {
    scope: passport.travelScope,
    decision:
      passport.travelScope === "ANY"
        ? "The qualified shortlist was selected by fit before geographic diversity."
        : `The explicit ${passport.travelScope.toLowerCase()} scope was preserved.`,
  };
  const internationalCandidateIds = new Set(
    rankedCandidates
      .filter((candidate) => candidate.candidate.category === "INTERNATIONAL")
      .map((candidate) => candidate.candidate.id),
  );
  const shortlistedInternational = possibilities.find((item) =>
    internationalCandidateIds.has(item.candidateId),
  );

  if (
    passport.travelScope === "ANY" &&
    !shortlistedInternational
  ) {
    const international = rankedCandidates
      .filter((candidate) => candidate.candidate.category === "INTERNATIONAL")
      .filter((candidate) =>
        !selected.some((item) => item.candidate.id === candidate.candidate.id))
      .filter(qualifiesForPleasantSurprise)
      .filter((candidate) => candidate.totalScore >= perfectMatch.totalScore - 10)
      .map((candidate) => ({
        ranked: candidate,
        selectionValue:
          normalizedScore(candidate.totalScore) * 0.7 +
          noveltyScore(passport, candidate, selected) * 0.2 +
          evidenceReadiness(candidate) * 0.1,
        differentiators: selected
          .flatMap((item) => differentiatorsFrom(item, candidate))
          .filter((value, index, values) => values.indexOf(value) === index),
      }))
      .sort(selectionComparator)[0];

    if (international) {
      const existingHiddenGemIndex = possibilities.findIndex(
        (item) => item.personality === "pleasant-surprise",
      );
      if (existingHiddenGemIndex >= 0) {
        possibilities.splice(
          existingHiddenGemIndex,
          1,
          createPossibility("pleasant-surprise", international),
        );
      } else if (possibilities.length < 3) {
        possibilities.push(createPossibility("pleasant-surprise", international));
      }
      internationalPolicy = {
        scope: passport.travelScope,
        decision:
          "A qualified international Hidden Gem was included without relaxing compatibility or quality thresholds.",
        internationalCandidateId: international.ranked.candidate.id,
      };
    } else {
      internationalPolicy = {
        scope: passport.travelScope,
        decision:
          "No international candidate was forced because none met the same compatibility and qualification safeguards.",
      };
    }
  } else if (
    passport.travelScope === "ANY" &&
    shortlistedInternational
  ) {
    internationalPolicy = {
      scope: passport.travelScope,
      decision:
        "The fit-led shortlist already contained a qualified international candidate.",
      internationalCandidateId: shortlistedInternational.candidateId,
    };
  }

  const selectedByCandidate = new Map(
    possibilities.map((possibility) => [
      possibility.candidateId,
      possibility.personality,
    ]),
  );

  return {
    possibilities,
    decisions: rankedCandidates.map((candidate) => {
      const eligiblePersonalities = qualificationRoles(candidate);
      const selectedPersonality = selectedByCandidate.get(candidate.candidate.id);
      return {
        candidateId: candidate.candidate.id,
        qualified: eligiblePersonalities.length > 0 || Boolean(selectedPersonality),
        eligiblePersonalities,
        ...(selectedPersonality ? { selectedPersonality } : {}),
        explanation: selectedPersonality
          ? eligiblePersonalities.includes(selectedPersonality)
            ? `${PERSONALITY_LABELS[selectedPersonality]} assigned after all gates and minimum qualification checks passed.`
            : `${PERSONALITY_LABELS[selectedPersonality]} assigned as the closest contradiction-free option with a lower confidence band.`
          : eligiblePersonalities.length > 0
            ? "Qualified but not selected by the fit-led shortlist and diversity policy."
            : "Did not meet any personality's minimum score, evidence, region, or operational safeguards.",
      };
    }),
    internationalPolicy,
  };
}
