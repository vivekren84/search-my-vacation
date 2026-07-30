import type { JourneyPassportSnapshot } from "../../../types/journey-director";

import { PERSONALITY_THRESHOLDS } from "./engine.rules";
import { evaluateCandidateContradictions } from "./evaluateContradictions";
import { evaluateCandidateEligibility } from "./evaluateEligibility";
import {
  DECISION_ENGINE_VERSION,
  DECISION_RULES_VERSION,
  JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
  type CandidateExclusionSummary,
  type CandidateContradictionEvaluation,
  type CandidateEligibility,
  type EngineDestinationResolution,
  type EngineExecutionContext,
  type EngineResult,
  type JourneyCandidate,
  type NormalizedJourneyPassport,
  type RankedCandidate,
} from "./engine.types";
import { normalizeJourneyPassport } from "./normalizePassport";
import { rankCandidates } from "./rankCandidates";
import { scoreEligibleCandidate } from "./scoreCandidate";
import { selectJourneyPossibilities } from "./selectPossibilities";

function versionMetadata(context: EngineExecutionContext) {
  return {
    passportSchemaVersion: JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
    knowledgeBaseVersion: context.knowledgeBaseVersion,
    engineVersion: DECISION_ENGINE_VERSION,
    rulesVersion: DECISION_RULES_VERSION,
    operationalSnapshotId: context.operationalSnapshotId,
    generatedAt: context.generatedAt,
  } as const;
}

function emptyTrace() {
  return {
    normalizedTravelScope: "ANY",
    detectedCoreIntent: { strength: "NONE", evidence: [] },
    eligibilityEvaluations: [],
    contradictionEvaluations: [],
    rejectedBeforeScoring: [],
    exclusions: [],
    rankedCandidates: [],
    knownDestinationHandling: {
      requestedText: "",
      preferenceApplied: false,
      explanation: "No valid normalized destination request was available.",
    },
    internationalPolicy: {
      scope: "ANY",
      decision: "Shortlist policy was not evaluated.",
    },
    shortlistDecisions: [],
    personalityAssignments: [],
    unresolvedTradeOffs: [],
  } as const;
}

function uniqueIssueCodes<T extends string>(values: readonly T[]) {
  return [...new Set(values)];
}

const ELIGIBILITY_GATES = [
  "DESTINATION_STATUS",
  "SERVICE_CONFIDENCE",
  "DESTINATION_DATA_QUALITY",
  "DESTINATION_REVIEW_FRESHNESS",
  "DESTINATION_SEASON",
  "DESTINATION_COMPANION",
  "ELIGIBLE_REGION",
] as const;

function failedEligibilityGates(candidate: CandidateEligibility) {
  const codes = new Set(candidate.reasons.map((reason) => reason.code));
  const regionCodes = new Set(
    candidate.regions.flatMap((region) =>
      region.reasons.map((reason) => reason.code),
    ),
  );

  return new Set([
    ...(codes.has("DESTINATION_NOT_ACTIVE") ? ["DESTINATION_STATUS"] : []),
    ...(codes.has("SERVICE_CONFIDENCE_BELOW_AUTOMATIC_THRESHOLD")
      ? ["SERVICE_CONFIDENCE"]
      : []),
    ...(codes.has("DESTINATION_DATA_INCOMPLETE")
      ? ["DESTINATION_DATA_QUALITY"]
      : []),
    ...(codes.has("DESTINATION_DATA_STALE")
      ? ["DESTINATION_REVIEW_FRESHNESS"]
      : []),
    ...(codes.has("DESTINATION_SEASON_NOT_RECOMMENDED") ||
    codes.has("DESTINATION_SEASON_UNKNOWN_FOR_FIXED_DATES")
      ? ["DESTINATION_SEASON"]
      : []),
    ...(codes.has("COMPANION_CONFIRMED_UNSUITABLE")
      ? ["DESTINATION_COMPANION"]
      : []),
    ...(codes.has("NO_ELIGIBLE_REGION") ||
    regionCodes.has("REGION_NOT_ACTIVE") ||
    regionCodes.has("REGION_DATA_INCOMPLETE") ||
    regionCodes.has("REGION_DATA_STALE") ||
    regionCodes.has("REGION_SEASON_NOT_RECOMMENDED") ||
    regionCodes.has("REGION_SEASON_UNKNOWN_FOR_FIXED_DATES") ||
    regionCodes.has("REGION_COMPANION_CONFIRMED_UNSUITABLE")
      ? ["ELIGIBLE_REGION"]
      : []),
  ]);
}

function normalizeDestinationName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function destinationValueMatches(value: string, requestedText: string) {
  const requested = normalizeDestinationName(requestedText);
  if (!requested) return false;
  const candidateName = normalizeDestinationName(value);
  return (
    candidateName === requested ||
    (candidateName.length >= 3 && requested.includes(candidateName)) ||
    (requested.length >= 3 && candidateName.includes(requested))
  );
}

type DestinationRequestMatch = {
  candidateId: string;
  candidateName: string;
  regionId?: string;
};

function matchDestinationRequest(
  passport: NormalizedJourneyPassport,
  catalogue: readonly JourneyCandidate[],
): DestinationRequestMatch | undefined {
  if (passport.destinationIntent.mode !== "known") return undefined;
  const requestedText = passport.destinationIntent.rawText.trim();

  for (const candidate of catalogue) {
    const region = candidate.regions.find(
      (item) =>
        destinationValueMatches(item.id, requestedText) ||
        destinationValueMatches(item.name, requestedText),
    );
    if (region) {
      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        regionId: region.id,
      };
    }
  }

  const candidate = catalogue.find((item) =>
    [item.id, item.name, ...item.aliases].some((value) =>
      destinationValueMatches(value, requestedText),
    ),
  );

  return candidate
    ? { candidateId: candidate.id, candidateName: candidate.name }
    : undefined;
}

function knownPreferenceQualified(candidate: RankedCandidate) {
  return (
    candidate.totalScore >= PERSONALITY_THRESHOLDS.perfectMatch.destination &&
    candidate.selectedRegion.score >= PERSONALITY_THRESHOLDS.perfectMatch.region &&
    candidate.fitEvidence.length >= 2 &&
    !candidate.penalties.some((penalty) => penalty.severity === "material") &&
    candidate.candidate.serviceConfidence !== "LIMITED" &&
    candidate.candidate.serviceConfidence !== "PAUSED"
  );
}

function applyKnownDestinationPreference(
  passport: NormalizedJourneyPassport,
  requestMatch: DestinationRequestMatch | undefined,
  rankedCandidates: readonly RankedCandidate[],
): {
  resolution: EngineDestinationResolution;
  rankedCandidates: readonly RankedCandidate[];
  trace: {
    requestedText: string;
    matchedCandidateId?: string;
    matchedRegionId?: string;
    preferenceApplied: boolean;
    explanation: string;
  };
} {
  if (passport.destinationIntent.mode === "discovery") {
    return {
      resolution: { status: "discovery", requestedText: "" },
      rankedCandidates,
      trace: {
        requestedText: "",
        preferenceApplied: false,
        explanation: "Discovery mode supplied no known-destination preference.",
      },
    };
  }

  const requestedText = passport.destinationIntent.rawText.trim();
  const matched = requestMatch
    ? rankedCandidates.find(
        (candidate) =>
          candidate.candidate.id === requestMatch.candidateId &&
          (!requestMatch.regionId ||
            candidate.selectedRegion.region.id === requestMatch.regionId),
      )
    : undefined;

  if (!requestMatch || !matched || !knownPreferenceQualified(matched)) {
    return {
      resolution: { status: "unserved", requestedText },
      rankedCandidates,
      trace: {
        requestedText,
        ...(requestMatch
          ? {
              matchedCandidateId: requestMatch.candidateId,
              ...(requestMatch.regionId
                ? { matchedRegionId: requestMatch.regionId }
                : {}),
            }
          : {}),
        preferenceApplied: false,
        explanation: requestMatch
          ? "The known destination did not pass every gate and Perfect Match qualification, so it received no preference."
          : "The known destination was not found in the served catalogue.",
      },
    };
  }

  const currentLeader = rankedCandidates[0];
  const canLead =
    currentLeader?.candidate.id === matched.candidate.id ||
    matched.totalScore + 15 >= (currentLeader?.totalScore ?? matched.totalScore);

  if (!canLead) {
    return {
      resolution: { status: "unserved", requestedText },
      rankedCandidates,
      trace: {
        requestedText,
        matchedCandidateId: matched.candidate.id,
        ...(requestMatch.regionId
          ? { matchedRegionId: requestMatch.regionId }
          : {}),
        preferenceApplied: false,
        explanation:
          "The known destination qualified, but the capped transparent preference was insufficient to override the stronger fit.",
      },
    };
  }

  const prioritised = [
    matched,
    ...rankedCandidates.filter(
      (candidate) => candidate.candidate.id !== matched.candidate.id,
    ),
  ].map((candidate, index) => ({ ...candidate, rank: index + 1 }));

  return {
    resolution: {
      status: "served",
      requestedText,
      matchedCandidateId: matched.candidate.id,
      matchedCandidateName: matched.candidate.name,
    },
    rankedCandidates: prioritised,
    trace: {
      requestedText,
      matchedCandidateId: matched.candidate.id,
      ...(requestMatch.regionId
        ? { matchedRegionId: requestMatch.regionId }
        : {}),
      preferenceApplied: currentLeader?.candidate.id !== matched.candidate.id,
      explanation:
        currentLeader?.candidate.id === matched.candidate.id
          ? "The compatible known destination naturally led the qualified ranking."
          : "A capped fifteen-point-equivalent known-destination preference moved an already qualified close match to the lead.",
    },
  };
}

function unresolvedDestination(snapshot: JourneyPassportSnapshot): EngineDestinationResolution {
  const requestedText = snapshot.destination.trim();
  return snapshot.destinationMode === "known" && requestedText
    ? { status: "unserved", requestedText }
    : { status: "discovery", requestedText: "" };
}

export function generateJourneyRecommendations(
  snapshot: JourneyPassportSnapshot,
  catalogue: readonly JourneyCandidate[],
  context: EngineExecutionContext,
): EngineResult {
  const normalization = normalizeJourneyPassport(snapshot, context.evaluationDate);

  if (normalization.status !== "valid") {
    return {
      status: normalization.status,
      versions: versionMetadata(context),
      possibilities: [],
      destinationResolution: unresolvedDestination(snapshot),
      exclusions: [],
      recovery: {
        code: "CLARIFICATION_REQUIRED",
        issueCodes: normalization.issues.map((issue) => issue.code),
      },
      trace: emptyTrace(),
    };
  }

  const passport = normalization.passport;
  const requestMatch = matchDestinationRequest(passport, catalogue);
  const eligibility: CandidateEligibility[] = catalogue.map((candidate) =>
    evaluateCandidateEligibility(candidate, passport, context.evaluationDate),
  );
  const eligibilityExclusions: CandidateExclusionSummary[] = eligibility
    .filter((candidate) => !candidate.eligible)
    .map((candidate) => ({
      candidateId: candidate.candidate.id,
      candidateName: candidate.candidate.name,
      stage: "ELIGIBILITY_FAILURE",
      reasons: candidate.reasons,
    }));
  const contradictionEvaluations: CandidateContradictionEvaluation[] = eligibility
    .filter((candidate) => candidate.eligible)
    .map((candidate) =>
      evaluateCandidateContradictions(
        candidate,
        passport,
        requestMatch?.candidateId === candidate.candidate.id
          ? requestMatch.regionId
          : undefined,
      ),
    );
  const contradictionExclusions: CandidateExclusionSummary[] =
    contradictionEvaluations
      .filter((candidate) => !candidate.passed)
      .map((candidate) => ({
        candidateId: candidate.eligibility.candidate.id,
        candidateName: candidate.eligibility.candidate.name,
        stage: "CONTRADICTION_FAILURE",
        reasons: candidate.contradictions,
      }));
  const exclusions = [
    ...eligibilityExclusions,
    ...contradictionExclusions,
  ];
  const initiallyRankedCandidates = rankCandidates(
    contradictionEvaluations
      .filter((candidate) => candidate.passed)
      .map((candidate) => scoreEligibleCandidate(candidate, passport)),
  );
  const destination = applyKnownDestinationPreference(
    passport,
    requestMatch,
    initiallyRankedCandidates,
  );
  const rankedCandidates = destination.rankedCandidates;
  const shortlist = selectJourneyPossibilities(rankedCandidates, passport);
  const possibilities = shortlist.possibilities;
  const status = possibilities.length === 3
    ? "success"
    : possibilities.length > 0
      ? "partial"
      : "insufficient-candidates";
  const exclusionIssueCodes = uniqueIssueCodes(
    exclusions.flatMap((candidate) => candidate.reasons.map((reason) => reason.code)),
  );

  return {
    status,
    versions: versionMetadata(context),
    normalizedInputSummary: {
      companionIds: passport.companions.map((signal) => signal.id),
      emotionIds: passport.emotions.map((signal) => signal.id),
      themeIds: passport.themes.map((signal) => signal.id),
      timingKind: passport.timing.kind,
      destinationMode: passport.destinationIntent.mode,
      travelScope: passport.travelScope,
      ...(passport.coreIntent.intent
        ? { coreIntent: passport.coreIntent.intent }
        : {}),
    },
    possibilities,
    destinationResolution: destination.resolution,
    exclusions,
    recovery: possibilities.length === 3
      ? { code: "NONE", issueCodes: [] }
      : possibilities.length > 0
        ? { code: "NOT_ENOUGH_QUALIFIED_CANDIDATES", issueCodes: exclusionIssueCodes }
        : rankedCandidates.length > 0
          ? { code: "NOT_ENOUGH_QUALIFIED_CANDIDATES", issueCodes: exclusionIssueCodes }
          : { code: "NO_ELIGIBLE_CANDIDATES", issueCodes: exclusionIssueCodes },
    trace: {
      normalizedPassport: passport,
      normalizedTravelScope: passport.travelScope,
      detectedCoreIntent: passport.coreIntent,
      eligibilityEvaluations: eligibility.map((candidate) => ({
        candidateId: candidate.candidate.id,
        passed: candidate.eligible,
        evaluatedGates: ELIGIBILITY_GATES,
        passedGates: ELIGIBILITY_GATES.filter(
          (gate) => !failedEligibilityGates(candidate).has(gate),
        ),
        failedReasons: candidate.reasons,
        regions: candidate.regions.map((region) => ({
          regionId: region.region.id,
          passed: region.eligible,
          failedReasons: region.reasons,
        })),
      })),
      contradictionEvaluations: contradictionEvaluations.map((candidate) => ({
        candidateId: candidate.eligibility.candidate.id,
        passed: candidate.passed,
        evaluatedRules: candidate.evaluatedRules,
        contradictions: candidate.contradictions,
        compatibleRegionIds: candidate.compatibleRegions.map(
          (region) => region.region.id,
        ),
      })),
      rejectedBeforeScoring: exclusions.map((candidate) => ({
        candidateId: candidate.candidateId,
        stage: candidate.stage,
        reasonCodes: candidate.reasons.map((reason) => reason.code),
      })),
      exclusions,
      rankedCandidates,
      knownDestinationHandling: destination.trace,
      internationalPolicy: shortlist.internationalPolicy,
      shortlistDecisions: shortlist.decisions,
      personalityAssignments: possibilities.map((possibility) => ({
        possibilityId: possibility.possibilityId,
        personality: possibility.personality,
        personalityLabel: possibility.personalityLabel,
        candidateId: possibility.candidateId,
        explanation: `${possibility.personalityLabel} selected from governed fit, region and personality rules.`,
      })),
      unresolvedTradeOffs: rankedCandidates.flatMap((candidate) => candidate.cautions),
    },
  };
}
