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
  assert(first.state === "success", "success maps to the presentation success state");
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

  const partialCandidateId = engineResult.possibilities[0]?.candidateId;
  assert(Boolean(partialCandidateId), "success fixture exposes a qualified candidate");
  const partialEngineResult = generateJourneyRecommendations(
    passport,
    verificationCandidates.filter(
      (candidate) => candidate.id === partialCandidateId,
    ),
    executionContext,
  );
  const partial = adapt(passport, partialEngineResult);
  assert(
    partial.state === "partial" && partial.possibilities.length === 1,
    "partial results remain partial without fabricated possibilities",
  );

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
