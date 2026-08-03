import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { JourneyPassportSnapshot } from "../../../types/journey-director";
import {
  adaptJourneyRecommendations,
  getJourneyRecommendations,
} from "../recommendation-adapter";
import {
  generateJourneyRecommendations,
  type EngineExecutionContext,
  type EngineResult,
} from "../engine";
import { representativeProfiles } from "./representativeProfiles";
import { verificationCandidates } from "./verificationCandidates";

const executionContext: EngineExecutionContext = {
  knowledgeBaseVersion: "verification-fixture-1.0",
  operationalSnapshotId: "verification-2026-07-22",
  generatedAt: "2026-07-22T10:00:00.000Z",
  evaluationDate: "2026-07-22",
};

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

function adapt(
  passport: JourneyPassportSnapshot,
  result?: EngineResult,
) {
  return adaptJourneyRecommendations({
    passport,
    engineResult:
      result ??
      generateJourneyRecommendations(
        passport,
        verificationCandidates,
        executionContext,
      ),
  });
}

function hasValidPublicPossibilityFields(
  possibility: ReturnType<typeof adaptJourneyRecommendations>["possibilities"][number],
  index: number,
) {
  return (
    possibility.id.length > 0 &&
    possibility.candidateId.length > 0 &&
    possibility.regionId.length > 0 &&
    possibility.destination.length > 0 &&
    possibility.region.length > 0 &&
    possibility.summary.length > 0 &&
    possibility.heroImage.length > 0 &&
    possibility.heroImageAlt.length > 0 &&
    possibility.recommendationOrder === index + 1 &&
    possibility.personalityLabel.length > 0 &&
    possibility.personalityDescription.length > 0 &&
    Number.isFinite(possibility.matchStrength) &&
    possibility.reasons.length > 0 &&
    possibility.supportingEvidence.length > 0 &&
    possibility.experiences.length > 0 &&
    possibility.recommendedTravelStyle.length > 0 &&
    possibility.confidenceNote.length > 0 &&
    possibility.ctaLabel.length > 0 &&
    possibility.handoffHeadline.length > 0 &&
    possibility.handoffMessage.length > 0
  );
}

function verifyPurePresentationBoundary() {
  const files = [
    "recommendation-adapter.ts",
    "traveller-reflection.ts",
  ];
  const prohibited = [
    { pattern: /from ["']react["']/, label: "React import" },
    { pattern: /from ["']next(?:\/[^"']*)?["']/, label: "Next.js import" },
    {
      pattern: /sessionStorage|localStorage|window\.|document\./,
      label: "browser API",
    },
    {
      pattern: /Math\.random\(\)|Date\.now\(\)/,
      label: "hidden nondeterministic input",
    },
  ];

  files.forEach((name) => {
    const source = readFileSync(
      join(process.cwd(), "lib", "journey-director", name),
      "utf8",
    );

    prohibited.forEach(({ pattern, label }) => {
      assert(!pattern.test(source), `${name} contains no ${label}`);
    });
  });
}

function runVerification() {
  const passport = representativeProfiles.relaxedFamily;
  const engineResult = generateJourneyRecommendations(
    passport,
    verificationCandidates,
    executionContext,
  );
  const first = adapt(passport, engineResult);
  const second = adapt(passport, engineResult);

  assert(
    JSON.stringify(first) === JSON.stringify(second),
    "the same Passport and engine result adapt deterministically",
  );
  assert(first.state === (engineResult.status === "success" ? "success" : "partial"), "engine result maps to the corresponding presentation state");
  assert(
    first.possibilities.map((item) => item.candidateId).join("|") ===
      engineResult.possibilities.map((item) => item.candidateId).join("|"),
    "the adapter preserves engine recommendation order",
  );
  assert(
    first.possibilities.every(
      (item, index) =>
        item.matchStrength === engineResult.possibilities[index].totalScore,
    ),
    "the adapter preserves engine scores without recalculation",
  );
  assert(
    first.possibilities.every(
      (item, index) =>
        item.personality === engineResult.possibilities[index].personality,
    ),
    "the adapter preserves engine personality assignments",
  );
  assert(
    first.possibilities.map((item) => item.personalityLabel).join("|") ===
      engineResult.possibilities.map((item) => item.personalityLabel).join("|"),
    "the adapter preserves the approved user-visible personality names",
  );
  assert(
    new Set(first.possibilities.map((item) => item.heroImage)).size ===
      first.possibilities.length &&
      new Set(first.possibilities.map((item) => item.summary)).size ===
        first.possibilities.length,
    "changing the active shortlist option changes both destination imagery and narrative",
  );
  assert(
    first.possibilities.every(
      (item) => !first.excludedCandidateIds.includes(item.candidateId),
    ),
    "excluded candidates never reappear in presentation possibilities",
  );
  assert(
    first.possibilities.every(
      (item) =>
        item.reasons.length > 0 &&
        item.reasons.every((reason) => reason.evidence.length > 0),
    ),
    "presented reasons retain explicit engine evidence references",
  );
  assert(
    first.possibilities.every(
      (item) =>
        item.experiences.length > 0 &&
        Boolean(item.recommendedTravelStyle) &&
        Boolean(item.confidenceNote),
    ),
    "every recommendation includes experiences, travel style and confidence context",
  );
  assert(
    first.possibilities.every(
      (item) => new Set(item.reasons.map((reason) => reason.title)).size === item.reasons.length,
    ),
    "recommendation sections do not repeat reason headings",
  );
  assert(
    !/\b(approved|governed classifications|recommendation threshold)\b/i.test(
      JSON.stringify(first.possibilities),
    ),
    "traveller-facing recommendation copy contains no internal terminology",
  );
  assert(
    first.reflection.includes(passport.name) &&
      first.reflection.toLowerCase().includes("family") &&
      first.reflection.toLowerCase().includes("tropical escape"),
    "traveller reflection uses the completed Passport",
  );
  assert(
    first.travellerSummary.restrictions.length === 0 &&
      first.travellerSummary.preferences.length === 0 &&
      first.travellerSummary.comfort.length === 0,
    "uncollected Release 1 details remain unknown",
  );

  const knownServed = adapt(representativeProfiles.knownServedDestination);
  assert(
    knownServed.destinationResolution.status === "served" &&
      (!knownServed.destinationResolution.recommended || knownServed.possibilities[0]?.destination === "Kerala"),
    "served free-text destination is acknowledged and leads only when recommended",
  );
  const knownUnservedEngineResult = generateJourneyRecommendations(
    representativeProfiles.knownUnsupportedDestination,
    verificationCandidates,
    executionContext,
  );
  const knownUnserved = adapt(
    representativeProfiles.knownUnsupportedDestination,
    knownUnservedEngineResult,
  );
  assert(
    knownUnserved.destinationResolution.status === "unserved" &&
      knownUnserved.possibilities.length ===
        knownUnservedEngineResult.possibilities.length &&
      knownUnserved.possibilities.map((item) => item.candidateId).join("|") ===
        knownUnservedEngineResult.possibilities
          .map((item) => item.candidateId)
          .join("|"),
    "unserved free-text destination preserves only qualified served alternatives",
  );

  const qualifiedCandidateIds = engineResult.possibilities.map(
    (possibility) => possibility.candidateId,
  );
  [...new Set([1, 2, 3].map((count) => Math.min(count, qualifiedCandidateIds.length)))].filter(Boolean).forEach((expectedCount) => {
    const qualifiedIds = new Set(qualifiedCandidateIds.slice(0, expectedCount));
    const qualifiedEngineResult = generateJourneyRecommendations(
      passport,
      verificationCandidates.filter((candidate) =>
        qualifiedIds.has(candidate.id),
      ),
      executionContext,
    );
    const adapted = adapt(passport, qualifiedEngineResult);
    const serializedAdapted = JSON.stringify(adapted);

    assert(
      qualifiedEngineResult.possibilities.length > 0 && qualifiedEngineResult.possibilities.length <= expectedCount,
      `${expectedCount}-candidate fixture contains only contradiction-free engine possibilities`,
    );
    const actualCount = qualifiedEngineResult.possibilities.length;
    assert(
      adapted.state === (actualCount === 3 ? "success" : "partial") &&
        adapted.possibilities.length === actualCount,
      `${expectedCount}-recommendation engine output maps to the correct public state without manufacturing possibilities`,
    );
    assert(
      adapted.possibilities.map((item) => item.candidateId).join("|") ===
        qualifiedEngineResult.possibilities
          .map((item) => item.candidateId)
          .join("|"),
      `${expectedCount}-recommendation output preserves exact engine order`,
    );
    assert(
      adapted.possibilities.every(hasValidPublicPossibilityFields),
      `${expectedCount}-recommendation output contains valid public possibility fields`,
    );
    assert(
      !Object.prototype.hasOwnProperty.call(adapted, "trace") &&
        !serializedAdapted.includes("\"trace\"") &&
        !serializedAdapted.includes("\"rankedCandidates\"") &&
        !serializedAdapted.includes("\"shortlistDecisions\""),
      `${expectedCount}-recommendation output exposes no internal decision trace`,
    );
  });

  const insufficientInputResult = generateJourneyRecommendations(
    representativeProfiles.incomplete,
    verificationCandidates,
    executionContext,
  );
  const insufficientInput = adapt(
    representativeProfiles.incomplete,
    insufficientInputResult,
  );
  assert(
    insufficientInput.state === "insufficient" &&
      insufficientInput.possibilities.length === 0,
    "insufficient Passport input produces a recoverable empty state",
  );

  const unavailableEngineResult = generateJourneyRecommendations(
    passport,
    verificationCandidates.filter((candidate) => candidate.status !== "ACTIVE"),
    executionContext,
  );
  const unavailable = adapt(passport, unavailableEngineResult);
  assert(
    unavailable.state === "unavailable" &&
      unavailable.possibilities.length === 0,
    "no eligible destinations produces an unavailable empty state",
  );

  const invalidPassport = {
    ...passport,
    source: "demo" as const,
  };
  const invalidEngineResult = generateJourneyRecommendations(
    invalidPassport,
    verificationCandidates,
    executionContext,
  );
  const invalid = adapt(invalidPassport, invalidEngineResult);
  assert(
    invalid.state === "unavailable" &&
      invalid.possibilities.length === 0,
    "invalid production input cannot activate a recommendation fallback",
  );

  const conflictPassport: JourneyPassportSnapshot = {
    ...passport,
    travelStyles: ["Adventure"],
    entryContext: {
      feeling: "relax",
      source: "homepage",
    },
  };
  const conflict = adapt(conflictPassport);
  assert(
    conflict.qualities.includes("A sense of adventure"),
    "explicit Passport style shapes the reflection",
  );
  assert(
    !conflict.qualities.includes("A restorative pause"),
    "homepage feeling does not override an explicit Passport style",
  );
  assert(
    conflict.reflectionModel.travelCharacter.includes("active discovery"),
    "reflection language follows explicit traveller evidence",
  );

  const serialized = JSON.parse(JSON.stringify(first));
  assert(
    JSON.stringify(serialized) === JSON.stringify(first),
    "presentation contracts are JSON serializable",
  );

  const compatibility = getJourneyRecommendations(passport);
  assert(
    compatibility.state === "unavailable" &&
      compatibility.possibilities.length === 0 &&
      compatibility.isFallback === false,
    "unconnected UI compatibility never serves demo recommendations",
  );

  verifyPurePresentationBoundary();

  console.log(
    `Journey Director presentation verification passed (${checks} checks).`,
  );
  console.log(
    "States: success, partial, insufficient input, no eligible candidates, invalid input.",
  );
}

runVerification();
