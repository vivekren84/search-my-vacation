import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { JourneyPresentationCatalogue } from "../../../types/journey-director";
import {
  CONCERN_CLASSIFICATION_RULES,
  RELEASE1_CATALOGUE_METADATA,
  THEME_MEMORY_GOAL_MAP,
  release1ExcludedPortfolio,
  release1JourneyCandidates,
  validateRuntimeCatalogue,
} from "../catalogue";
import {
  generateJourneyRecommendations,
  type EngineExecutionContext,
  type EngineResult,
} from "../engine";
import type { ThemeId } from "../engine/engine.types";
import { adaptJourneyRecommendations } from "../recommendation-adapter";
import { representativeProfiles } from "./representativeProfiles";

const executionContext: EngineExecutionContext = {
  knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
  operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
  generatedAt: "2026-07-23T09:00:00.000Z",
  evaluationDate: "2026-07-23",
};

const ENGINE_THEME_IDS: readonly ThemeId[] = [
  "adventure", "architecture", "backwaters", "beaches", "city-break",
  "coffee-estates", "cruises", "culture", "desert", "family-attractions",
  "festivals", "food", "forests", "heritage", "hills", "islands", "lakes",
  "local-communities", "luxury", "mountains", "nature", "nightlife",
  "photography", "rivers", "road-trips", "safari", "scenic-drives", "shopping",
  "slow-travel", "snow-experiences", "spiritual", "tea-estates", "villages",
  "water-sports", "wellness", "wildlife",
];

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Catalogue verification failed: ${message}`);
}

function stableResult(result: EngineResult) {
  return {
    status: result.status,
    versions: result.versions,
    normalizedInputSummary: result.normalizedInputSummary,
    possibilities: result.possibilities,
    exclusions: result.exclusions,
    recovery: result.recovery,
    trace: result.trace,
  };
}

function verifyRuntimeBoundary() {
  const catalogueDirectory = join(process.cwd(), "lib", "journey-director", "catalogue");
  const prohibited = [
    { pattern: /verificationCandidates/, label: "verification-fixture import" },
    { pattern: /journey-director\.config/, label: "presentation-catalogue import" },
    { pattern: /from ["']react["']/, label: "React import" },
    { pattern: /from ["']next(?:\/[^"']*)?["']/, label: "Next.js import" },
    { pattern: /sessionStorage|localStorage|window\.|document\./, label: "browser API" },
  ];

  readdirSync(catalogueDirectory)
    .filter((name) => name.endsWith(".ts"))
    .forEach((name) => {
      const source = readFileSync(join(catalogueDirectory, name), "utf8");
      prohibited.forEach(({ pattern, label }) => {
        assert(!pattern.test(source), `${name} contains no ${label}`);
      });
    });
}

function verifyGovernanceMappings() {
  const validation = validateRuntimeCatalogue(
    release1JourneyCandidates,
    release1ExcludedPortfolio,
    RELEASE1_CATALOGUE_METADATA,
  );

  assert(validation.candidateCount === 24, "all active portfolio candidates validate");
  assert(validation.excludedPortfolioCount === 4, "all coming-soon exclusions validate");
  assert(
    release1JourneyCandidates.every((candidate) => candidate.serviceConfidence === "SUPPORTED"),
    "ACTIVE maps to SUPPORTED and never implicitly to CONFIDENT",
  );
  assert(
    release1JourneyCandidates.every((candidate) =>
      !RELEASE1_CATALOGUE_METADATA.confidentApprovalCandidateIds.includes(candidate.id),
    ),
    "no candidate has CONFIDENT approval provenance",
  );
  assert(
    release1JourneyCandidates.every((candidate) =>
      candidate.regions.every(
        (region) => region.logisticalFit === RELEASE1_CATALOGUE_METADATA.neutralLogisticalFit,
      ),
    ),
    "neutral logistical values are identical and cannot differentiate candidates",
  );
  assert(
    release1JourneyCandidates.every((candidate) =>
      candidate.seasonality.every((entry) => entry.guidance === "UNKNOWN") &&
      candidate.regions.every((region) =>
        region.seasonality.every((entry) => entry.guidance === "UNKNOWN"),
      ),
    ),
    "all monthly seasonality remains UNKNOWN",
  );
  assert(
    ENGINE_THEME_IDS.every((theme) => Object.prototype.hasOwnProperty.call(THEME_MEMORY_GOAL_MAP, theme)),
    "the memory-goal taxonomy covers every engine theme",
  );
  assert(
    new Set(Object.keys(THEME_MEMORY_GOAL_MAP)).size === ENGINE_THEME_IDS.length,
    "the memory-goal taxonomy contains no ungoverned theme keys",
  );
  assert(CONCERN_CLASSIFICATION_RULES.length === 2, "only the approved concern classifications are active");
  assert(
    RELEASE1_CATALOGUE_METADATA.catalogueEffectiveFrom <=
      RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil,
    "catalogue metadata carries a bounded review-validity window",
  );
}

function verifyEngineConsumption() {
  const passport = representativeProfiles.relaxedFamily;
  const first = generateJourneyRecommendations(passport, release1JourneyCandidates, executionContext);
  const second = generateJourneyRecommendations(passport, release1JourneyCandidates, executionContext);
  const reversed = generateJourneyRecommendations(
    passport,
    [...release1JourneyCandidates].reverse(),
    executionContext,
  );

  assert(
    JSON.stringify(stableResult(first)) === JSON.stringify(stableResult(second)),
    "identical Passport input and catalogue version produce identical results",
  );
  assert(
    first.possibilities.map((possibility) => possibility.possibilityId).join("|") ===
      reversed.possibilities.map((possibility) => possibility.possibilityId).join("|"),
    "recommendation order is independent of catalogue insertion order",
  );
  assert(
    first.status === "partial" || first.status === "insufficient-candidates",
    "governed evidence produces an honest Release 1 partial or insufficient result",
  );
  assert(
    first.possibilities.every((possibility) => possibility.personality !== "pleasant-surprise"),
    "Pleasant Surprise remains suppressed without CONFIDENT Operations evidence",
  );
  assert(
    first.possibilities.every((possibility) => possibility.fitEvidence.length >= 2),
    "every surfaced possibility remains explainable",
  );

  const insufficient = generateJourneyRecommendations(
    representativeProfiles.incomplete,
    release1JourneyCandidates,
    executionContext,
  );
  assert(insufficient.status === "insufficient-input", "incomplete Passport input remains insufficient");

  const noEligible = generateJourneyRecommendations(
    passport,
    [],
    executionContext,
  );
  assert(
    noEligible.status === "insufficient-candidates" &&
      noEligible.recovery.code === "NO_ELIGIBLE_CANDIDATES",
    "an empty governed candidate set produces an explainable no-result outcome",
  );

  const beforePresentation = JSON.stringify(stableResult(first));
  const emptyPresentation: JourneyPresentationCatalogue = {};
  const adapted = adaptJourneyRecommendations({
    passport,
    engineResult: first,
    presentation: emptyPresentation,
  });
  assert(
    JSON.stringify(stableResult(first)) === beforePresentation,
    "presentation adaptation cannot mutate engine decisions",
  );
  assert(
    adapted.possibilities.map((possibility) => possibility.candidateId).join("|") ===
      first.possibilities.map((possibility) => possibility.candidateId).join("|"),
    "presentation metadata cannot change eligibility or ranking",
  );

  assert(
    release1ExcludedPortfolio.every((excluded) =>
      !first.possibilities.some((possibility) => possibility.candidateId === excluded.id),
    ),
    "coming-soon destinations never enter recommendation output",
  );
  assert(
    release1ExcludedPortfolio.every((excluded) => excluded.sourceReason.length > 0),
    "every portfolio suppression has a governed explanation",
  );
}

function runVerification() {
  verifyRuntimeBoundary();
  verifyGovernanceMappings();
  verifyEngineConsumption();

  console.log(`Journey Director runtime catalogue verification passed (${checks} checks).`);
  console.log(
    `Catalogue ${RELEASE1_CATALOGUE_METADATA.catalogueVersion}: ${release1JourneyCandidates.length} active candidates; ${release1ExcludedPortfolio.length} governed exclusions.`,
  );
  console.log("No candidate is CONFIDENT; confidence-dependent personalities remain correctly suppressible.");
}

runVerification();
