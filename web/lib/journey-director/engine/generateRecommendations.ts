import type { JourneyPassportSnapshot } from "../../../types/journey-director";

import { evaluateCandidateEligibility } from "./evaluateEligibility";
import {
  DECISION_ENGINE_VERSION,
  DECISION_RULES_VERSION,
  JOURNEY_PASSPORT_ENGINE_SCHEMA_VERSION,
  type CandidateExclusionSummary,
  type EngineExecutionContext,
  type EngineResult,
  type JourneyCandidate,
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
    exclusions: [],
    rankedCandidates: [],
    personalityAssignments: [],
    unresolvedTradeOffs: [],
  } as const;
}

function uniqueIssueCodes<T extends string>(values: readonly T[]) {
  return [...new Set(values)];
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
      exclusions: [],
      recovery: {
        code: "CLARIFICATION_REQUIRED",
        issueCodes: normalization.issues.map((issue) => issue.code),
      },
      trace: emptyTrace(),
    };
  }

  const passport = normalization.passport;
  const eligibility = catalogue.map((candidate) =>
    evaluateCandidateEligibility(candidate, passport, context.evaluationDate),
  );
  const exclusions: CandidateExclusionSummary[] = eligibility
    .filter((candidate) => !candidate.eligible)
    .map((candidate) => ({
      candidateId: candidate.candidate.id,
      candidateName: candidate.candidate.name,
      reasons: candidate.reasons,
    }));
  const rankedCandidates = rankCandidates(
    eligibility
      .filter((candidate) => candidate.eligible)
      .map((candidate) => scoreEligibleCandidate(candidate, passport)),
  );
  const possibilities = selectJourneyPossibilities(rankedCandidates, passport);
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
    },
    possibilities,
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
      exclusions,
      rankedCandidates,
      personalityAssignments: possibilities.map((possibility) => ({
        possibilityId: possibility.possibilityId,
        personality: possibility.personality,
        candidateId: possibility.candidateId,
        explanation: `${possibility.personalityLabel} selected from governed fit, region and personality rules.`,
      })),
      unresolvedTradeOffs: rankedCandidates.flatMap((candidate) => candidate.cautions),
    },
  };
}
