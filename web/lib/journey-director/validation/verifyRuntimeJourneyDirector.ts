import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  journeyCanonicalImages,
  journeyPresentationCatalogue,
  journeyPresentationKey,
  retainedJourneyImageAlternatives,
} from "../../../config/journey-director.config";
import { RELEASE1_CATALOGUE_METADATA, release1JourneyCandidates } from "../catalogue";
import { createJourneyRecommendationSet } from "../createJourneyRecommendationSet";
import { representativeProfiles } from "./representativeProfiles";

const executionTimestamp = "2026-07-25T09:00:00.000Z";
const approvedPersonalityLabels = [
  "The Perfect Match",
  "The Beautiful Puzzle",
  "The Hidden Gem",
] as const;
const documentedFallbackCandidateIds = ["tamil-nadu"] as const;
let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Runtime Journey Director verification failed: ${message}`);
}

function verifyPresentationContent(candidateId: string, regionId: string) {
  const metadata = journeyPresentationCatalogue[journeyPresentationKey(candidateId, regionId)];
  if (!metadata) {
    assert(
      Boolean(journeyCanonicalImages[candidateId]),
      `${candidateId}:${regionId} has the approved canonical presentation fallback`,
    );
    return;
  }
  assert(Boolean(metadata?.summary.trim()), `${candidateId}:${regionId} has a traveller-facing summary`);
  assert(Boolean(metadata?.heroImage) && Boolean(metadata?.heroImageAlt), `${candidateId}:${regionId} has approved imagery`);
  assert((metadata?.moments.length ?? 0) >= 1, `${candidateId}:${regionId} has traveller-facing journey moments`);
}

function verifyQualifiedRuntimeProfile() {
  const first = createJourneyRecommendationSet(representativeProfiles.relaxedFamily, executionTimestamp);
  const second = createJourneyRecommendationSet(representativeProfiles.relaxedFamily, executionTimestamp);
  assert(JSON.stringify(first) === JSON.stringify(second), "runtime catalogue output is deterministic");
  assert(first.state === "success" && first.possibilities.length === 3, "relaxed family receives three qualified runtime recommendations");
  assert(new Set(first.possibilities.map((possibility) => possibility.candidateId)).size === 3, "runtime recommendations use unique destinations");
  assert(first.possibilities.map((possibility) => possibility.personality).join("|") === "perfect-match|different-rhythm|pleasant-surprise", "runtime recommendations preserve approved personalities");
  assert(
    first.possibilities.map((possibility) => possibility.personalityLabel).join("|") ===
      approvedPersonalityLabels.join("|"),
    "runtime recommendations use the three approved user-visible personality names exactly",
  );
  assert(
    new Set(first.possibilities.map((possibility) => possibility.personality)).size === 3,
    "the shortlist contains three distinct personality assignments",
  );
  assert(first.possibilities.every((possibility) => possibility.candidateId !== "japan"), "unsupported Japan is excluded from runtime recommendations");
  assert(
    release1JourneyCandidates.some((candidate) =>
      candidate.regions.some((region) => region.concerns.length >= 1),
    ),
    "generated runtime intelligence retains classified planning considerations",
  );
  assert(
    new Set(first.possibilities.map((possibility) => possibility.heroImage)).size ===
      first.possibilities.length,
    "switching shortlist options changes the destination image",
  );
  assert(
    new Set(first.possibilities.map((possibility) => possibility.summary)).size ===
      first.possibilities.length,
    "switching shortlist options changes the destination narrative",
  );
  first.possibilities.forEach((possibility) => {
    assert(possibility.reasons.length >= 2, `${possibility.destination} has traveller-facing fit explanations`);
    assert(possibility.experiences.length >= 1, `${possibility.destination} has experience highlights`);
    assert(Boolean(possibility.recommendedTravelStyle), `${possibility.destination} has a recommended travel style`);
    assert(
      new Set(possibility.reasons.map((reason) => reason.title)).size === possibility.reasons.length,
      `${possibility.destination} has unique section headings`,
    );
    verifyPresentationContent(possibility.candidateId, possibility.regionId);
  });
  return first;
}

function verifyCanonicalImageCoverage() {
  const candidateIds = release1JourneyCandidates.map((candidate) => candidate.id).sort();
  const mappedIds = Object.keys(journeyCanonicalImages).sort();
  assert(
    candidateIds.every((candidateId) => mappedIds.includes(candidateId)),
    "canonical image mapping covers every generated runtime candidate",
  );

  const retainedAlternatives = new Set(retainedJourneyImageAlternatives);
  release1JourneyCandidates.forEach((candidate) => {
    const mapping = journeyCanonicalImages[candidate.id];
    assert(Boolean(mapping), `${candidate.name} has a canonical image record`);
    assert(
      !retainedAlternatives.has(
        mapping.heroImage as (typeof retainedJourneyImageAlternatives)[number],
      ),
      `${candidate.name} does not select a retained editorial alternative`,
    );

    if (mapping.status === "approved-active") {
      assert(
        /^\/images\/journey-director\/[^/]+\.webp$/.test(mapping.heroImage),
        `${candidate.name} uses an approved Journey Director WebP path`,
      );
      assert(
        existsSync(join(process.cwd(), "public", mapping.heroImage.replace(/^\//, ""))),
        `${candidate.name} canonical image resolves on disk`,
      );
      return;
    }

    assert(
      documentedFallbackCandidateIds.includes(
        candidate.id as (typeof documentedFallbackCandidateIds)[number],
      ) && Boolean(mapping.fallbackReason?.trim()),
      `${candidate.name} uses only an explicitly documented fallback`,
    );
  });

  retainedJourneyImageAlternatives.forEach((image) => {
    assert(
      existsSync(join(process.cwd(), "public", image.replace(/^\//, ""))),
      `${image} remains retained on disk`,
    );
  });
}

function verifyAdditionalRuntimeProfiles() {
  [
    representativeProfiles.cultureCouple,
    representativeProfiles.activeFriends,
    representativeProfiles.knownServedDestination,
    representativeProfiles.knownUnsupportedDestination,
  ].forEach((passport) => {
    const result = createJourneyRecommendationSet(passport, executionTimestamp);
    const repeat = createJourneyRecommendationSet(passport, executionTimestamp);
    assert(JSON.stringify(result) === JSON.stringify(repeat), `${passport.name} receives deterministic runtime output`);
    assert(result.state === "success" && result.possibilities.length === 3, `${passport.name} receives all three recommendation roles`);
    assert(result.possibilities.every((possibility) => possibility.candidateId !== "japan"), `${passport.name} never receives unsupported Japan`);
  });
}

function verifyReadinessGovernance() {
  const confident = release1JourneyCandidates.filter((candidate) => candidate.serviceConfidence === "CONFIDENT");
  assert(confident.map((candidate) => candidate.id).join("|") === RELEASE1_CATALOGUE_METADATA.confidentApprovalCandidateIds.join("|"), "only the governed presentation-ready destinations are CONFIDENT");
  confident.forEach((candidate) => {
    assert(candidate.evidenceReadiness.hasQualifiedRegionContent && !candidate.evidenceReadiness.hasMaterialContentGap, `${candidate.name} has complete runtime presentation readiness`);
  });
}

const qualified = verifyQualifiedRuntimeProfile();
verifyCanonicalImageCoverage();
verifyAdditionalRuntimeProfiles();
verifyReadinessGovernance();
console.log(`Runtime Journey Director verification passed (${checks} checks).`);
console.log(`Qualified runtime shortlist: ${qualified.possibilities.map((item) => `${item.personality}:${item.destination}`).join(", ")}.`);
