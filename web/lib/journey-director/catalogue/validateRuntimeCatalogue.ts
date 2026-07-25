import type { JourneyCandidate } from "../engine/engine.types";
import type {
  ExcludedPortfolioDestination,
  RuntimeCatalogueMetadata,
  RuntimeCatalogueValidation,
} from "./catalogue.types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Runtime catalogue validation failed: ${message}`);
}

export function validateRuntimeCatalogue(
  candidates: readonly JourneyCandidate[],
  excluded: readonly ExcludedPortfolioDestination[],
  metadata: RuntimeCatalogueMetadata,
): RuntimeCatalogueValidation {
  assert(metadata.catalogueVersion.length > 0, "catalogue version is required");
  assert(metadata.catalogueEffectiveFrom <= metadata.catalogueReviewValidUntil, "review window is valid");
  assert(metadata.sourceDocument.length > 0 && metadata.sourceDocumentVersion.length > 0, "source provenance is required");
  const ids = candidates.map((candidate) => candidate.id);
  assert(new Set(ids).size === ids.length, "candidate identifiers are unique");
  assert(ids.join("|") === [...ids].sort((left, right) => left.localeCompare(right, "en-US")).join("|"), "candidate order is deterministic");
  assert(candidates.length === 24, "all 24 approved active destinations are represented");
  assert(
    metadata.confidentApprovalCandidateIds.every((id) => ids.includes(id)),
    "every Operations-approved CONFIDENT candidate is in the active runtime catalogue",
  );

  candidates.forEach((candidate) => {
    assert(candidate.status === "ACTIVE", `${candidate.id} is active`);
    const hasApprovedPresentation = metadata.confidentApprovalCandidateIds.includes(candidate.id);
    assert(candidate.serviceConfidence === (hasApprovedPresentation ? "CONFIDENT" : "SUPPORTED"), `${candidate.id} uses its governed operational confidence`);
    assert(candidate.reviewValidUntil === metadata.catalogueReviewValidUntil, `${candidate.id} references the catalogue review window`);
    assert(candidate.dataQuality === "COMPLETE", `${candidate.id} has structurally complete governed matching data`);
    assert(candidate.regions.length > 0, `${candidate.id} has an approved configured region`);
    assert(candidate.seasonality.length === 12, `${candidate.id} has twelve seasonality entries`);
    assert(candidate.seasonality.every((entry, index) => entry.month === index + 1), `${candidate.id} has ordered monthly seasonality`);
    assert(candidate.evidence.length >= 2, `${candidate.id} has explainable matching evidence`);
    if (hasApprovedPresentation) {
      assert(candidate.evidenceReadiness.approvedImageryReferenceCount >= 1 && candidate.evidenceReadiness.journeyMomentCount >= 1, `${candidate.id} has approved imagery and journey moments`);
      assert(candidate.evidenceReadiness.hasQualifiedRegionContent && !candidate.evidenceReadiness.hasMaterialContentGap, `${candidate.id} has complete qualified presentation content`);
    } else {
      assert(candidate.seasonality.every((entry) => entry.guidance === "UNKNOWN"), `${candidate.id} preserves unknown monthly seasonality until approved evidence is available`);
      assert(candidate.evidenceReadiness.approvedImageryReferenceCount === 0 && candidate.evidenceReadiness.journeyMomentCount === 0, `${candidate.id} does not infer presentation readiness`);
      assert(candidate.evidenceReadiness.hasQualifiedRegionContent === false && candidate.evidenceReadiness.hasMaterialContentGap === true, `${candidate.id} preserves the content-readiness gap`);
    }

    candidate.regions.forEach((region) => {
      assert(region.status === "ACTIVE", `${region.id} follows the temporary region-status mapping`);
      assert(region.reviewValidUntil === metadata.catalogueReviewValidUntil, `${region.id} references the catalogue review window`);
      assert(region.seasonality.length === 12 && region.seasonality.every((entry, index) => entry.month === index + 1), `${region.id} has ordered monthly seasonality`);
      if (!hasApprovedPresentation) {
        assert(region.logisticalFit === metadata.neutralLogisticalFit, `${region.id} uses the common neutral logistical baseline`);
        assert(region.seasonality.every((entry) => entry.guidance === "UNKNOWN"), `${region.id} preserves unknown monthly seasonality until approved evidence is available`);
      }
    });
  });

  const excludedIds = excluded.map((candidate) => candidate.id);
  assert(new Set(excludedIds).size === excludedIds.length, "excluded portfolio identifiers are unique");
  assert(excluded.length === 4, "all four coming-soon portfolio entries are governed");
  assert(excluded.every((candidate) => candidate.status === "COMING_SOON" && candidate.serviceConfidence === "LIMITED"), "coming-soon entries remain LIMITED and outside runtime scoring");
  assert(excluded.every((candidate) => !ids.includes(candidate.id)), "excluded portfolio entries cannot enter the engine catalogue");
  assert(JSON.stringify(JSON.parse(JSON.stringify(candidates))) === JSON.stringify(candidates), "candidate catalogue is JSON serializable");

  return {
    candidateCount: candidates.length,
    excludedPortfolioCount: excluded.length,
    catalogueVersion: metadata.catalogueVersion,
  };
}
