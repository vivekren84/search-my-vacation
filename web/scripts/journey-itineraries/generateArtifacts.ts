import type {
  ItineraryAliasesArtifact,
  ItineraryCatalogueArtifact,
  ItineraryIndexArtifact,
  ItineraryManifestArtifact,
  ItineraryStatus,
  SuggestedItinerary,
} from "../../lib/journey-itineraries/types.js";
import { ITINERARY_MAPPING_BY_CODE, KNOWN_JOURNEY_DIRECTOR_CANDIDATE_IDS } from "./mappingConfig.js";
import { compareStrings, json, normalizedKey, sha256 } from "./normalise.js";
import type {
  GeneratedItineraryArtifacts,
  MappingAuditArtifact,
  ParsedItinerary,
  ValidationArtifact,
  ValidationIssue,
  WorkbookSource,
} from "./types.js";

export const SCHEMA_VERSION = 1 as const;
export const GENERATOR_VERSION = "1.0.0";
export const GENERATED_NOTICE = "Generated from the business-maintained itinerary workbook. Do not edit manually.";

function add(map: Map<string, Set<string>>, key: string, id: string): void {
  const normalized = normalizedKey(key);
  if (!normalized) return;
  const values = map.get(normalized) ?? new Set<string>();
  values.add(id);
  map.set(normalized, values);
}

function addExact(map: Map<string, Set<string>>, key: string, id: string): void {
  const exact = key.trim();
  if (!exact) return;
  const values = map.get(exact) ?? new Set<string>();
  values.add(id);
  map.set(exact, values);
}

function objectFromSets(map: Map<string, Set<string>>): Record<string, string[]> {
  return Object.fromEntries(
    [...map.entries()].sort(([left], [right]) => compareStrings(left, right)).map(([key, values]) => [key, [...values].sort(compareStrings)]),
  );
}

function aliasesArtifact(records: ParsedItinerary[], workbook: WorkbookSource): ItineraryAliasesArtifact {
  const aliases = new Map<string, Set<string>>();
  const candidates = new Map<string, Set<string>>();
  const regions = new Map<string, Set<string>>();
  const destinationCodes: Record<string, string> = {};
  const parentDefaults: Record<string, string> = {};
  records.forEach((record) => {
    const mapping = ITINERARY_MAPPING_BY_CODE[record.destinationCode];
    destinationCodes[record.destinationCode] = record.id;
    [record.id, record.destinationCode, record.destination.displayName, record.destination.regionDisplayName, record.destination.parentDestination ?? "", record.source.worksheet, ...(mapping?.aliases ?? [])].forEach((value) => add(aliases, value, record.id));
    record.matching.journeyDirectorCandidateIds.forEach((value) => addExact(candidates, value, record.id));
    record.matching.journeyDirectorRegionIds.forEach((value) => addExact(regions, value, record.id));
    if (record.destination.parentDestination && (mapping?.parentDefault || !parentDefaults[normalizedKey(record.destination.parentDestination)])) parentDefaults[normalizedKey(record.destination.parentDestination)] = record.id;
  });
  return {
    generated: true,
    doNotEdit: GENERATED_NOTICE,
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    sourceWorkbookSha256: workbook.sha256,
    aliases: objectFromSets(aliases),
    destinationCodes: Object.fromEntries(Object.entries(destinationCodes).sort(([left], [right]) => compareStrings(left, right))),
    journeyDirectorCandidateIds: objectFromSets(candidates),
    journeyDirectorRegionIds: objectFromSets(regions),
    parentDefaults: Object.fromEntries(Object.entries(parentDefaults).sort(([left], [right]) => compareStrings(left, right))),
  };
}

function severityFor(issues: ValidationIssue[]): "ERROR" | "REVIEW_REQUIRED" | "WARNING" | "PASS" {
  if (issues.some((item) => item.severity === "ERROR")) return "ERROR";
  if (issues.some((item) => item.severity === "REVIEW_REQUIRED")) return "REVIEW_REQUIRED";
  if (issues.some((item) => item.severity === "WARNING")) return "WARNING";
  return "PASS";
}

function validationArtifact(workbook: WorkbookSource, issues: ValidationIssue[]): ValidationArtifact {
  const summary: Record<ValidationIssue["severity"], number> = { ERROR: 0, REVIEW_REQUIRED: 0, WARNING: 0, INFO: 0 };
  issues.forEach((item) => { summary[item.severity] += 1; });
  return { generated: true, schemaVersion: SCHEMA_VERSION, sourceWorkbook: workbook.filename, sourceWorkbookSha256: workbook.sha256, summary, issues };
}

function mappingAudit(records: ParsedItinerary[], workbook: WorkbookSource, issues: ValidationIssue[]): MappingAuditArtifact {
  const mappedCandidates = new Set(records.flatMap((record) => record.matching.journeyDirectorCandidateIds));
  return {
    generated: true,
    schemaVersion: SCHEMA_VERSION,
    sourceWorkbook: workbook.filename,
    sourceWorkbookSha256: workbook.sha256,
    mappings: records.map((record) => ({
      worksheet: record.source.worksheet,
      indexDestination: record.index.destination,
      indexRegion: record.index.region,
      runtimeId: record.id,
      destinationCode: record.destinationCode,
      regionCode: record.regionCode,
      parentDestination: record.destination.parentDestination ?? null,
      journeyBases: record.destination.journeyBases,
      journeyDirectorCandidateIds: record.matching.journeyDirectorCandidateIds,
      journeyDirectorRegionIds: record.matching.journeyDirectorRegionIds,
      status: record.source.status,
      validationResult: severityFor(issues.filter((item) => item.runtimeId === record.id || item.worksheet === record.source.worksheet)),
    })),
    unmatchedWorkbookRecords: records.filter((record) => record.matching.journeyDirectorCandidateIds.length === 0).map((record) => record.id),
    unmatchedJourneyDirectorCandidateIds: KNOWN_JOURNEY_DIRECTOR_CANDIDATE_IDS.filter((id) => !mappedCandidates.has(id)),
  };
}

function statusDistribution(records: ParsedItinerary[], archivedCount: number): Record<ItineraryStatus, number> {
  const distribution = { draft: 0, review: 0, approved: 0, archived: archivedCount };
  records.forEach((record) => { distribution[record.source.status] += 1; });
  return distribution;
}

export function generateArtifacts(input: {
  workbook: WorkbookSource;
  records: ParsedItinerary[];
  issues: ValidationIssue[];
  indexRows: number;
  archivedCount: number;
  approvedOnly?: boolean;
}): GeneratedItineraryArtifacts {
  const records = [...input.records].sort((left, right) => compareStrings(left.id, right.id));
  const publicRecords = records.map((record) => {
    const publicRecord: Partial<ParsedItinerary> = { ...record };
    delete publicRecord.index;
    return publicRecord as SuggestedItinerary;
  });
  const catalogue: ItineraryCatalogueArtifact = { generated: true, doNotEdit: GENERATED_NOTICE, schemaVersion: SCHEMA_VERSION, generatorVersion: GENERATOR_VERSION, sourceWorkbookSha256: input.workbook.sha256, records: publicRecords };
  const index: ItineraryIndexArtifact = {
    generated: true,
    doNotEdit: GENERATED_NOTICE,
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    sourceWorkbookSha256: input.workbook.sha256,
    records: publicRecords.map((record) => ({ id: record.id, destinationCode: record.destinationCode, regionCode: record.regionCode, destination: record.destination.displayName, region: record.destination.regionDisplayName, duration: record.summary.suggestedDuration.display, journeyBases: record.destination.journeyBases, emotions: record.matching.primaryEmotionTags, experiences: record.matching.experienceTags, companions: record.matching.companionTypes, months: record.matching.suggestedMonths, status: record.source.status })),
  };
  const aliases = aliasesArtifact(records, input.workbook);
  const validation = validationArtifact(input.workbook, input.issues);
  const audit = mappingAudit(records, input.workbook, input.issues);
  const artifactBodies = {
    catalogue: json(catalogue),
    index: json(index),
    aliases: json(aliases),
  };
  const latest = records.map((record) => record.source.lastUpdated).filter(Boolean).sort(compareStrings).at(-1) ?? "1970-01-01";
  const manifest: ItineraryManifestArtifact = {
    generated: true,
    doNotEdit: GENERATED_NOTICE,
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    generatedAt: `${latest}T00:00:00.000Z`,
    sourceWorkbook: input.workbook.filename,
    sourceWorkbookSha256: input.workbook.sha256,
    totalWorkbookSheets: input.workbook.sheets.length,
    totalControlSheets: 3,
    totalItinerarySheets: input.workbook.sheets.length - 3,
    indexRows: input.indexRows,
    includedRecords: records.length,
    excludedArchivedRecords: input.archivedCount,
    statusDistribution: statusDistribution(records, input.archivedCount),
    errors: validation.summary.ERROR,
    reviewRequired: validation.summary.REVIEW_REQUIRED,
    warnings: validation.summary.WARNING,
    inclusionPolicy: input.approvedOnly
      ? { mode: "approved-only", includedStatuses: ["approved"], excludedStatuses: ["draft", "review", "archived"], note: "Strict production policy includes only Approved records." }
      : { mode: "release-1", includedStatuses: ["draft", "review", "approved"], excludedStatuses: ["archived"], note: "Draft records are temporarily included for Release 1 and retained as internal status; strict Approved-only generation is available but not active." },
    artifacts: {
      "itinerary-catalogue.json": { path: "web/generated/journey-itineraries/itinerary-catalogue.json", sha256: sha256(artifactBodies.catalogue), bytes: Buffer.byteLength(artifactBodies.catalogue) },
      "itinerary-index.json": { path: "web/generated/journey-itineraries/itinerary-index.json", sha256: sha256(artifactBodies.index), bytes: Buffer.byteLength(artifactBodies.index) },
      "itinerary-aliases.json": { path: "web/generated/journey-itineraries/itinerary-aliases.json", sha256: sha256(artifactBodies.aliases), bytes: Buffer.byteLength(artifactBodies.aliases) },
    },
  };
  return { catalogue, index, aliases, manifest, validation, mappingAudit: audit };
}
