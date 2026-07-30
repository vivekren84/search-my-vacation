import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  JourneyPassportSnapshot,
  JourneyRecommendationSet,
  JourneyRecommendationState,
} from "../../../types/journey-director";
import {
  RELEASE1_CATALOGUE_METADATA,
  release1JourneyCandidates,
} from "../catalogue";
import { createJourneyRecommendationSet } from "../createJourneyRecommendationSet";
import {
  generateJourneyRecommendations,
  type EngineExecutionContext,
  type EngineResult,
  type JourneyCandidate,
} from "../engine";
import { adaptJourneyRecommendations } from "../recommendation-adapter";
import { representativeProfiles } from "./representativeProfiles";

const executionTimestamp = "2026-07-23T09:00:00.000Z";

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) {
    throw new Error(`Journey recommendation orchestration verification failed: ${message}`);
  }
}

function assertThrows(
  action: () => unknown,
  expectedMessage: string,
  message: string,
) {
  let thrown: unknown;

  try {
    action();
  } catch (error) {
    thrown = error;
  }

  assert(
    thrown instanceof Error && thrown.message.includes(expectedMessage),
    message,
  );
}

function context(timestamp: string): EngineExecutionContext {
  return {
    knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
    operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
    generatedAt: timestamp,
    evaluationDate: timestamp.slice(0, 10),
  };
}

function expectedRecommendationSet(
  passport: JourneyPassportSnapshot,
  timestamp: string,
) {
  const engineResult = generateJourneyRecommendations(
    passport,
    release1JourneyCandidates,
    context(timestamp),
  );

  return {
    engineResult,
    recommendationSet: adaptJourneyRecommendations({
      passport,
      engineResult,
    }),
  };
}

function candidateWithReviewWindow(
  candidate: JourneyCandidate,
  reviewValidUntil: string,
  omitOptionalRegionCapabilities = false,
): JourneyCandidate {
  return {
    ...candidate,
    reviewValidUntil,
    regions: candidate.regions.map((region) => {
      const reviewedRegion = {
        ...region,
        reviewValidUntil,
      };

      if (omitOptionalRegionCapabilities) {
        delete reviewedRegion.capabilities;
      }

      return reviewedRegion;
    }),
  };
}

function presentationState(result: EngineResult): JourneyRecommendationState {
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

function verifyProductionDependencyBoundary() {
  const source = readFileSync(
    join(
      process.cwd(),
      "lib",
      "journey-director",
      "createJourneyRecommendationSet.ts",
    ),
    "utf8",
  );

  [
    "release1JourneyCandidates",
    "RELEASE1_CATALOGUE_METADATA",
    "generateJourneyRecommendations",
    "adaptJourneyRecommendations",
  ].forEach((dependency) => {
    assert(source.includes(dependency), `production orchestration uses ${dependency}`);
  });

  const prohibited = [
    { pattern: /verificationCandidates/, label: "verification candidate fixture" },
    { pattern: /representativeProfiles/, label: "representative profile fixture" },
    { pattern: /from ["']react["']/, label: "React import" },
    { pattern: /from ["']next(?:\/[^"']*)?["']/, label: "Next.js import" },
    { pattern: /components\/journey-director|app\/journey-director/, label: "Journey Director UI import" },
    { pattern: /sessionStorage|localStorage|window\.|document\./, label: "browser API" },
    { pattern: /Date\.now\(\)|new Date\(\s*\)/, label: "implicit current time" },
    { pattern: /rankCandidates|scoreEligibleCandidate|selectJourneyPossibilities/, label: "engine decision implementation" },
  ];

  prohibited.forEach(({ pattern, label }) => {
    assert(!pattern.test(source), `production orchestration contains no ${label}`);
  });
}

function verifyDeterministicEngineAdapterFlow() {
  const passport = representativeProfiles.relaxedFamily;
  const first = createJourneyRecommendationSet(passport, executionTimestamp);
  const second = createJourneyRecommendationSet(passport, executionTimestamp);
  const expected = expectedRecommendationSet(passport, executionTimestamp);

  assert(
    JSON.stringify(first) === JSON.stringify(second),
    "identical Passport input and execution time produce identical output",
  );
  assert(
    JSON.stringify(first) === JSON.stringify(expected.recommendationSet),
    "the complete governed engine result is passed through the approved adapter",
  );
  assert(
    first.state === presentationState(expected.engineResult),
    "the adapter preserves the engine result state",
  );
  assert(
    first.possibilities.map((possibility) => possibility.candidateId).join("|") ===
      expected.engineResult.possibilities
        .map((possibility) => possibility.candidateId)
        .join("|"),
    "the adapter preserves engine candidate order",
  );
  assert(
    first.possibilities.map((possibility) => possibility.personality).join("|") ===
      expected.engineResult.possibilities
        .map((possibility) => possibility.personality)
        .join("|"),
    "the adapter preserves engine personality order",
  );
  assert(
    first.excludedCandidateIds.join("|") ===
      expected.engineResult.exclusions
        .map((candidate) => candidate.candidateId)
        .join("|"),
    "the adapter preserves engine exclusions",
  );
  assert(
    first.versions?.knowledgeBase === RELEASE1_CATALOGUE_METADATA.catalogueVersion &&
      first.versions.operationalSnapshot ===
        RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
    "output versions use governed catalogue identity",
  );
  assert(first.isFallback === false, "production orchestration never marks output as a demo fallback");

  const reviewExpiry = new Date(
    `${RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil}T09:00:00.000Z`,
  );
  reviewExpiry.setUTCDate(reviewExpiry.getUTCDate() + 1);
  const afterReviewTimestamp = reviewExpiry.toISOString();
  const afterReview = createJourneyRecommendationSet(passport, afterReviewTimestamp);
  const expectedAfterReview = expectedRecommendationSet(passport, afterReviewTimestamp);

  assert(
    JSON.stringify(afterReview) ===
      JSON.stringify(expectedAfterReview.recommendationSet),
    "the explicit execution date is passed to governed engine evaluation",
  );
  assert(
    afterReview.state === "unavailable" &&
      afterReview.possibilities.length === 0,
    "expired catalogue review metadata suppresses stale recommendations",
  );
  assert(
    expectedAfterReview.engineResult.trace.eligibilityEvaluations.length ===
      release1JourneyCandidates.length &&
      expectedAfterReview.engineResult.trace.eligibilityEvaluations.every(
        (candidate) =>
          !candidate.passed &&
          candidate.failedReasons.some(
            (reason) => reason.code === "DESTINATION_DATA_STALE",
          ),
      ),
    "expired review metadata is recorded as an eligibility failure for every stale destination",
  );
  assert(
    expectedAfterReview.engineResult.trace.rejectedBeforeScoring.length ===
      release1JourneyCandidates.length &&
      expectedAfterReview.engineResult.trace.rejectedBeforeScoring.every(
        (candidate) =>
          candidate.stage === "ELIGIBILITY_FAILURE" &&
          candidate.reasonCodes.includes("DESTINATION_DATA_STALE"),
      ),
    "the internal trace records stale destinations as rejected before scoring",
  );
  assert(
    expectedAfterReview.engineResult.trace.rankedCandidates.length === 0 &&
      expectedAfterReview.engineResult.trace.shortlistDecisions.length === 0,
    "stale destinations never reach ranking or shortlist decisions",
  );
}

function verifyReviewFreshnessAndOptionalMetadata() {
  const staleCandidate = release1JourneyCandidates.find(
    (candidate) => candidate.id === "kerala",
  );
  const reviewedAlternative = release1JourneyCandidates.find(
    (candidate) => candidate.id === "bali",
  );

  assert(staleCandidate !== undefined, "stale-review fixture includes Kerala");
  assert(reviewedAlternative !== undefined, "reviewed-alternative fixture includes Bali");

  const staleCandidateId = staleCandidate.id;
  const reviewedAlternativeId = reviewedAlternative.id;
  const reviewedAlternativeWithoutCapabilities = candidateWithReviewWindow(
    reviewedAlternative,
    "2026-09-30",
    true,
  );
  const controlledResult = generateJourneyRecommendations(
    representativeProfiles.relaxedFamily,
    [
      candidateWithReviewWindow(staleCandidate, "2026-08-22"),
      reviewedAlternativeWithoutCapabilities,
    ],
    context("2026-08-23T09:00:00.000Z"),
  );
  const controlledPresentation = adaptJourneyRecommendations({
    passport: representativeProfiles.relaxedFamily,
    engineResult: controlledResult,
  });
  const staleEligibility = controlledResult.trace.eligibilityEvaluations.find(
    (candidate) => candidate.candidateId === staleCandidateId,
  );
  const activeEligibility = controlledResult.trace.eligibilityEvaluations.find(
    (candidate) => candidate.candidateId === reviewedAlternativeId,
  );

  assert(
    staleEligibility?.passed === false &&
      staleEligibility.failedReasons.some(
        (reason) => reason.code === "DESTINATION_DATA_STALE",
      ),
    "an expired destination is rejected by the freshness eligibility gate",
  );
  assert(
    controlledResult.trace.rejectedBeforeScoring.some(
      (candidate) =>
        candidate.candidateId === staleCandidateId &&
        candidate.stage === "ELIGIBILITY_FAILURE" &&
        candidate.reasonCodes.includes("DESTINATION_DATA_STALE"),
    ),
    "the controlled trace explains the stale destination rejection",
  );
  assert(
    !controlledResult.trace.rankedCandidates.some(
      (candidate) => candidate.candidate.id === staleCandidateId,
    ) &&
      !controlledResult.trace.shortlistDecisions.some(
        (candidate) => candidate.candidateId === staleCandidateId,
    ),
    "the stale destination is neither scored nor considered for the shortlist",
  );
  assert(
    controlledPresentation.excludedCandidateIds.includes(staleCandidateId) &&
      controlledPresentation.possibilities.every(
        (candidate) => candidate.candidateId !== staleCandidateId,
      ),
    "presentation mapping preserves the stale exclusion without reintroducing the rejected destination",
  );
  assert(
    activeEligibility?.passed === true &&
      controlledResult.trace.rankedCandidates.some(
        (candidate) => candidate.candidate.id === reviewedAlternativeId,
      ) &&
      controlledResult.possibilities.some(
        (candidate) => candidate.candidateId === reviewedAlternativeId,
      ),
    "an active sufficiently reviewed alternative remains eligible, ranked, and presentable",
  );
  assert(
    reviewedAlternativeWithoutCapabilities.regions.every(
      (region) => region.capabilities === undefined,
    ) &&
      activeEligibility?.regions.every((region) => region.passed) === true,
    "omitting optional non-critical region capability metadata does not automatically reject an otherwise valid alternative",
  );
}

function verifyStateSafetyAndPresentationGaps() {
  const validProfiles = [
    representativeProfiles.relaxedFamily,
    representativeProfiles.cultureCouple,
    representativeProfiles.activeFriends,
    representativeProfiles.knownServedDestination,
    representativeProfiles.knownUnsupportedDestination,
  ];
  const results = validProfiles.map((passport) => ({
    passport,
    engineResult: expectedRecommendationSet(passport, executionTimestamp).engineResult,
    recommendationSet: createJourneyRecommendationSet(passport, executionTimestamp),
  }));

  results.forEach(({ engineResult, recommendationSet }) => {
    assert(
      recommendationSet.state === presentationState(engineResult),
      "every governed result retains its engine-derived presentation state",
    );
    assert(
      recommendationSet.possibilities.length === engineResult.possibilities.length,
      "orchestration never fabricates a successful or additional possibility",
    );
  });

  const relaxedFamily = results[0]?.recommendationSet;
  assert(
    relaxedFamily?.state === "success" && relaxedFamily.possibilities.length === 3,
    "the governed production catalogue produces three qualified relaxed-family possibilities",
  );
  assert(
    relaxedFamily?.possibilities.every(
      (possibility) =>
        possibility.supportingEvidence.length >= 2 &&
        Boolean(possibility.summary) &&
        Boolean(possibility.heroImage),
    ),
    "generated runtime recommendations retain explainability and approved image fallbacks",
  );

  const insufficient = createJourneyRecommendationSet(
    representativeProfiles.incomplete,
    executionTimestamp,
  );
  assert(
    insufficient.state === "insufficient" &&
      insufficient.possibilities.length === 0,
    "insufficient Passport input remains a zero-result state",
  );

  const unsupportedDestination = createJourneyRecommendationSet(
    representativeProfiles.knownUnsupportedDestination,
    executionTimestamp,
  );
  const expectedUnsupportedDestination = expectedRecommendationSet(
    representativeProfiles.knownUnsupportedDestination,
    executionTimestamp,
  );
  assert(
    unsupportedDestination.state ===
      presentationState(expectedUnsupportedDestination.engineResult) &&
      unsupportedDestination.possibilities.every(
        (possibility) => possibility.candidateId !== "japan",
      ),
    "an unsupported named destination cannot enter the governed recommendation output",
  );

  const invalidProductionSource: JourneyPassportSnapshot = {
    ...representativeProfiles.relaxedFamily,
    source: "demo",
  };
  const invalid = createJourneyRecommendationSet(
    invalidProductionSource,
    executionTimestamp,
  );
  assert(
    invalid.state === "unavailable" && invalid.possibilities.length === 0,
    "engine-rejected input cannot activate a production recommendation",
  );

}

function verifyOutputBoundary() {
  const result = createJourneyRecommendationSet(
    representativeProfiles.relaxedFamily,
    executionTimestamp,
  );
  const allowedRootKeys = [
    "excludedCandidateIds",
    "destinationResolution",
    "insights",
    "isFallback",
    "possibilities",
    "qualities",
    "recoveryMessage",
    "reflection",
    "reflectionModel",
    "state",
    "traveller",
    "travellerSummary",
    "versions",
  ].sort();

  assert(
    Object.keys(result).sort().join("|") === allowedRootKeys.join("|"),
    "orchestration returns only JourneyRecommendationSet root fields",
  );

  const serialized = JSON.stringify(result);
  [
    "\"trace\"",
    "\"rankedCandidates\"",
    "\"scoreBreakdown\"",
    "\"selectionValue\"",
    "\"fitEvidence\"",
    "\"catalogue\"",
  ].forEach((engineInternal) => {
    assert(
      !serialized.includes(engineInternal),
      `output excludes internal engine field ${engineInternal}`,
    );
  });

  const roundTrip: JourneyRecommendationSet = JSON.parse(serialized);
  assert(
    JSON.stringify(roundTrip) === serialized,
    "presentation output remains JSON serializable",
  );
}

function verifyInvalidExecutionTime() {
  const passport = representativeProfiles.relaxedFamily;
  const expectedMessage = "expected a canonical ISO 8601 UTC timestamp";

  assertThrows(
    () => createJourneyRecommendationSet(passport, "not-a-timestamp"),
    expectedMessage,
    "malformed execution timestamps fail clearly",
  );
  assertThrows(
    () =>
      createJourneyRecommendationSet(
        passport,
        "2026-02-30T09:00:00.000Z",
      ),
    expectedMessage,
    "impossible calendar dates fail clearly",
  );
  assertThrows(
    () => createJourneyRecommendationSet(passport, "2026-07-23"),
    expectedMessage,
    "date-only inputs cannot silently become execution timestamps",
  );
}

function runVerification() {
  verifyProductionDependencyBoundary();
  verifyDeterministicEngineAdapterFlow();
  verifyReviewFreshnessAndOptionalMetadata();
  verifyStateSafetyAndPresentationGaps();
  verifyOutputBoundary();
  verifyInvalidExecutionTime();

  console.log(
    `Journey recommendation orchestration verification passed (${checks} checks).`,
  );
  console.log(
    "Flow: governed catalogue → deterministic engine → recommendation adapter → JourneyRecommendationSet.",
  );
}

runVerification();
