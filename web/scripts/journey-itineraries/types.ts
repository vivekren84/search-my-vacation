import type {
  ItineraryAliasesArtifact,
  ItineraryCatalogueArtifact,
  ItineraryIndexArtifact,
  ItineraryManifestArtifact,
  ItineraryStatus,
  SuggestedItinerary,
} from "../../lib/journey-itineraries/types.js";

export type CellValue = string | number | boolean | null;
export type SheetRows = CellValue[][];

export type WorkbookSheet = {
  name: string;
  rows: SheetRows;
};

export type WorkbookSource = {
  filename: string;
  sha256: string;
  sheets: WorkbookSheet[];
};

export type IndexEntry = {
  rowNumber: number;
  destination: string;
  region: string;
  sheetName: string;
  duration: string;
  status: ItineraryStatus | null;
  rawStatus: string;
  lastUpdated: string;
  notes: string;
};

export type DurationValue = {
  display: string;
  days: number;
  nights: number;
};

export type ParsedItinerary = SuggestedItinerary & {
  index: IndexEntry;
};

export type ValidationSeverity = "ERROR" | "REVIEW_REQUIRED" | "WARNING" | "INFO";

export type ValidationIssue = {
  severity: ValidationSeverity;
  code: string;
  message: string;
  worksheet?: string;
  runtimeId?: string;
  field?: string;
};

export type ItineraryAuditEntry = {
  worksheet: string;
  indexDestination: string;
  indexRegion: string;
  runtimeId: string;
  destinationCode: string;
  regionCode: string;
  parentDestination: string | null;
  journeyBases: string[];
  journeyDirectorCandidateIds: string[];
  journeyDirectorRegionIds: string[];
  status: ItineraryStatus;
  validationResult: "ERROR" | "REVIEW_REQUIRED" | "WARNING" | "PASS";
};

export type ValidationArtifact = {
  generated: true;
  schemaVersion: 1;
  sourceWorkbook: string;
  sourceWorkbookSha256: string;
  summary: Record<ValidationSeverity, number>;
  issues: ValidationIssue[];
};

export type MappingAuditArtifact = {
  generated: true;
  schemaVersion: 1;
  sourceWorkbook: string;
  sourceWorkbookSha256: string;
  mappings: ItineraryAuditEntry[];
  unmatchedWorkbookRecords: string[];
  unmatchedJourneyDirectorCandidateIds: string[];
};

export type GeneratedItineraryArtifacts = {
  catalogue: ItineraryCatalogueArtifact;
  index: ItineraryIndexArtifact;
  aliases: ItineraryAliasesArtifact;
  manifest: ItineraryManifestArtifact;
  validation: ValidationArtifact;
  mappingAudit: MappingAuditArtifact;
};
