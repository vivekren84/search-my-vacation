import type { DestinationStatus, ServiceConfidence } from "../engine/engine.types";

export type RuntimeCatalogueMetadata = {
  catalogueVersion: string;
  catalogueEffectiveFrom: string;
  catalogueReviewValidUntil: string;
  sourceDocument: string;
  sourceDocumentVersion: string;
  sourceDocumentLastUpdated: string;
  operationalSnapshotId: string;
  neutralLogisticalFit: number;
  confidentApprovalCandidateIds: readonly string[];
  generatedCandidateCount: number;
  generatedRegionCount: number;
};

export type ExcludedPortfolioDestination = {
  id: string;
  name: string;
  status: Extract<DestinationStatus, "COMING_SOON" | "INACTIVE">;
  serviceConfidence: Extract<ServiceConfidence, "LIMITED" | "PAUSED">;
  sourceReason: string;
};

export type RuntimeCatalogueValidation = {
  candidateCount: number;
  excludedPortfolioCount: number;
  catalogueVersion: string;
};
