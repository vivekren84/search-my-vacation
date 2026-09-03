/**
 * GOVERNANCE BOUNDARY — Generation Layer → Runtime Layer.
 *
 * This module is the fail-closed integrity boundary between the Generation
 * Layer's output (`web/generated/*.json`) and the Runtime Layer. It performs
 * build-time static imports and checksum/version verification only; it must
 * not re-derive or override any Generation Layer decision. See
 * `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`
 * Section 6 (Layered Architecture) and Section 10 (Synchronisation Principles).
 *
 * Documentation-only addition (EBC R1.2-03.07) — verification logic unchanged.
 */

import compatibilityMatrixJson from "../../../generated/compatibility-matrix.json";
import constraintLibraryJson from "../../../generated/constraint-library.json";
import manifestJson from "../../../generated/intelligence-manifest.json";
import journeyDNAJson from "../../../generated/journey-dna.json";
import journeySeedsJson from "../../../generated/journey-seeds.json";
import journeyTemplatesJson from "../../../generated/journey-templates.json";
import metadataJson from "../../../generated/metadata.json";
import reasonLibraryJson from "../../../generated/reason-library.json";

import { sha256 } from "./sha256";
import {
  RUNTIME_ARTIFACT_KEYS,
  type CompatibilityRecord,
  type ConstraintRecord,
  type IntelligenceManifest,
  type JourneyDNARecord,
  type RuntimeArtifactHeader,
  type RuntimeArtifactKey,
  type RuntimeArtifactValues,
  type RuntimeIntelligenceIndexes,
  type RuntimeIntelligencePackage,
  type RuntimeIntelligenceSource,
  type RuntimeVerificationReport,
} from "./types";

const SUPPORTED_SCHEMA_VERSION = "1.0";
const SUPPORTED_GENERATOR_VERSION = "1.0.0";

const EXPECTED_ARTIFACT_PATHS: Readonly<Record<RuntimeArtifactKey, string>> = {
  journeyDNA: "generated/journey-dna.json",
  compatibilityMatrix: "generated/compatibility-matrix.json",
  constraintLibrary: "generated/constraint-library.json",
  reasonLibrary: "generated/reason-library.json",
  journeySeeds: "generated/journey-seeds.json",
  journeyTemplates: "generated/journey-templates.json",
  metadata: "generated/metadata.json",
};

const bundledSource: RuntimeIntelligenceSource = {
  manifest: manifestJson as unknown as RuntimeIntelligenceSource["manifest"],
  journeyDNA: journeyDNAJson as unknown as RuntimeIntelligenceSource["journeyDNA"],
  compatibilityMatrix:
    compatibilityMatrixJson as unknown as RuntimeIntelligenceSource["compatibilityMatrix"],
  constraintLibrary:
    constraintLibraryJson as unknown as RuntimeIntelligenceSource["constraintLibrary"],
  reasonLibrary: reasonLibraryJson as unknown as RuntimeIntelligenceSource["reasonLibrary"],
  journeySeeds: journeySeedsJson as unknown as RuntimeIntelligenceSource["journeySeeds"],
  journeyTemplates:
    journeyTemplatesJson as unknown as RuntimeIntelligenceSource["journeyTemplates"],
  metadata: metadataJson as unknown as RuntimeIntelligenceSource["metadata"],
};

export class RuntimeIntelligenceIntegrityError extends Error {
  readonly artifact?: string;

  constructor(message: string, artifact?: string) {
    super(`Journey intelligence integrity verification failed: ${message}`);
    this.name = "RuntimeIntelligenceIntegrityError";
    this.artifact = artifact;
  }
}

type VerificationCounter = {
  executed: number;
  passed: number;
};

function verify(
  counter: VerificationCounter,
  condition: unknown,
  message: string,
  artifact?: string,
): asserts condition {
  counter.executed += 1;
  if (!condition) throw new RuntimeIntelligenceIntegrityError(message, artifact);
  counter.passed += 1;
}

function sortedJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedJsonValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en-US"))
        .map(([key, nested]) => [key, sortedJsonValue(nested)]),
    );
  }
  return value;
}

export function serializeRuntimeArtifact(value: unknown): string {
  return `${JSON.stringify(sortedJsonValue(value), null, 2)}\n`;
}

function unique(
  counter: VerificationCounter,
  values: readonly string[],
  label: string,
): void {
  verify(counter, new Set(values).size === values.length, `${label} must be unique`);
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  const sort = (values: readonly string[]) =>
    [...values].sort((a, b) => a.localeCompare(b, "en-US")).join("|");
  return sort(left) === sort(right);
}

function verifyHeader(
  counter: VerificationCounter,
  artifact: RuntimeArtifactHeader,
  manifest: IntelligenceManifest,
  artifactName: string,
): void {
  verify(
    counter,
    artifact.schemaVersion === SUPPORTED_SCHEMA_VERSION,
    `${artifactName} uses unsupported schema ${artifact.schemaVersion}`,
    artifactName,
  );
  verify(
    counter,
    artifact.generatorVersion === SUPPORTED_GENERATOR_VERSION,
    `${artifactName} uses unsupported generator ${artifact.generatorVersion}`,
    artifactName,
  );
  verify(
    counter,
    artifact.workbookChecksum === manifest.workbookChecksum,
    `${artifactName} workbook checksum does not match the manifest`,
    artifactName,
  );
}

function appendToIndex<T>(
  index: Map<string, T[]>,
  key: string,
  value: T,
): void {
  const current = index.get(key);
  if (current) current.push(value);
  else index.set(key, [value]);
}

function readonlyGroupedIndex<T>(index: Map<string, T[]>): ReadonlyMap<string, readonly T[]> {
  return new Map(
    [...index.entries()].map(([key, values]) => [key, Object.freeze([...values])]),
  );
}

function buildIndexes(source: RuntimeArtifactValues): RuntimeIntelligenceIndexes {
  const journeyDNAByDestinationId = new Map<string, JourneyDNARecord[]>();
  const compatibilityByRegionId = new Map<string, CompatibilityRecord[]>();
  const constraintBySource = new Map<string, ConstraintRecord[]>();
  const constraintByTarget = new Map<string, ConstraintRecord[]>();

  source.journeyDNA.records.forEach((record) =>
    appendToIndex(journeyDNAByDestinationId, record.destinationId, record),
  );
  source.compatibilityMatrix.records.forEach((record) =>
    appendToIndex(compatibilityByRegionId, record.regionId, record),
  );
  source.constraintLibrary.records.forEach((record) => {
    appendToIndex(constraintBySource, record.source, record);
    appendToIndex(constraintByTarget, record.target, record);
  });

  return {
    journeyDNAByRegionId: new Map(
      source.journeyDNA.records.map((record) => [record.regionId, record]),
    ),
    journeyDNAByDestinationId: readonlyGroupedIndex(journeyDNAByDestinationId),
    compatibilityByRegionId: readonlyGroupedIndex(compatibilityByRegionId),
    constraintBySource: readonlyGroupedIndex(constraintBySource),
    constraintByTarget: readonlyGroupedIndex(constraintByTarget),
    reasonByCode: new Map(
      source.reasonLibrary.records.map((record) => [record.reasonCode, record]),
    ),
    journeySeedByRegionId: new Map(
      source.journeySeeds.records.map((record) => [record.regionId, record]),
    ),
    journeyTemplateByRegionId: new Map(
      source.journeyTemplates.records.map((record) => [record.regionId, record]),
    ),
    hierarchyByNodeId: new Map(
      source.journeyDNA.hierarchy.map((node) => [node.nodeId, node]),
    ),
  };
}

function verifySource(source: RuntimeIntelligenceSource): RuntimeVerificationReport {
  const counter: VerificationCounter = { executed: 0, passed: 0 };
  const { manifest } = source;

  verify(
    counter,
    manifest.schemaVersion === SUPPORTED_SCHEMA_VERSION,
    `manifest uses unsupported schema ${manifest.schemaVersion}`,
    "intelligence-manifest.json",
  );
  verify(
    counter,
    manifest.generatorVersion === SUPPORTED_GENERATOR_VERSION,
    `manifest uses unsupported generator ${manifest.generatorVersion}`,
    "intelligence-manifest.json",
  );
  verify(
    counter,
    manifest.validation.status === "PASS" && manifest.validation.checksFailed === 0,
    "manifest validation status is not PASS",
    "intelligence-manifest.json",
  );
  verify(
    counter,
    new Date(manifest.generatedAt).toISOString() === manifest.generatedAt,
    "manifest generatedAt is not a canonical ISO-8601 UTC timestamp",
    "intelligence-manifest.json",
  );
  verify(
    counter,
    Object.keys(manifest.artifacts).sort().join("|") ===
      [...RUNTIME_ARTIFACT_KEYS].sort().join("|"),
    "manifest does not list exactly the seven runtime artifacts",
    "intelligence-manifest.json",
  );

  const artifactChecksums = {} as Record<RuntimeArtifactKey, string>;
  RUNTIME_ARTIFACT_KEYS.forEach((key) => {
    const manifestArtifact = manifest.artifacts[key];
    const expectedPath = EXPECTED_ARTIFACT_PATHS[key];
    const artifact = source[key];
    const actualChecksum = sha256(serializeRuntimeArtifact(artifact));
    artifactChecksums[key] = actualChecksum;
    verify(
      counter,
      manifestArtifact.path === expectedPath,
      `${key} path mismatch: expected ${expectedPath}, received ${manifestArtifact.path}`,
      expectedPath,
    );
    verify(
      counter,
      actualChecksum === manifestArtifact.checksum,
      `${key} checksum mismatch: expected ${manifestArtifact.checksum}, received ${actualChecksum}. Regenerate the Journey Intelligence package.`,
      expectedPath,
    );
    verifyHeader(counter, artifact, manifest, expectedPath);
  });

  const countValues = Object.values(manifest.recordCounts);
  verify(
    counter,
    countValues.every((count) => Number.isInteger(count) && count > 0),
    "manifest record counts must all be non-zero positive integers",
    "intelligence-manifest.json",
  );
  verify(
    counter,
    JSON.stringify(source.metadata.recordCounts) === JSON.stringify(manifest.recordCounts),
    "metadata record counts do not match the manifest",
    "generated/metadata.json",
  );
  verify(
    counter,
    source.metadata.validation.status === "PASS" &&
      source.metadata.validation.reviewRequiredRecords ===
        manifest.validation.reviewRequiredRecords,
    "metadata validation summary does not match the manifest",
    "generated/metadata.json",
  );

  const recordCountChecks: Array<[number, number, string]> = [
    [source.journeyDNA.records.length, manifest.recordCounts.journeyDNARecords, "journey DNA"],
    [
      source.compatibilityMatrix.records.length,
      manifest.recordCounts.compatibilityRecords,
      "compatibility",
    ],
    [source.constraintLibrary.records.length, manifest.recordCounts.constraintRecords, "constraint"],
    [source.reasonLibrary.records.length, manifest.recordCounts.reasonCodes, "reason"],
    [source.journeySeeds.records.length, manifest.recordCounts.journeySeedRecords, "journey seed"],
    [
      source.journeyTemplates.records.length,
      manifest.recordCounts.journeyTemplateRecords,
      "journey template",
    ],
  ];
  recordCountChecks.forEach(([actual, expected, label]) =>
    verify(counter, actual === expected, `${label} record count mismatch`),
  );

  const regionIds = source.journeyDNA.records.map((record) => record.regionId);
  const regionIdSet = new Set(regionIds);
  unique(counter, regionIds, "Journey DNA region IDs");
  unique(
    counter,
    source.journeyDNA.hierarchy.map((node) => node.nodeId),
    "hierarchy node IDs",
  );
  unique(
    counter,
    source.constraintLibrary.records.map((record) => record.constraintId),
    "constraint IDs",
  );
  unique(
    counter,
    source.reasonLibrary.records.map((record) => record.reasonCode),
    "reason codes",
  );

  const hierarchyByNodeId = new Map(
    source.journeyDNA.hierarchy.map((node) => [node.nodeId, node]),
  );
  source.journeyDNA.hierarchy.forEach((node) => {
    verify(
      counter,
      node.parentId === null || hierarchyByNodeId.has(node.parentId),
      `hierarchy parent does not exist for ${node.nodeId}`,
      "generated/journey-dna.json",
    );
    const visited = new Set<string>();
    let current = node;
    while (current.parentId !== null) {
      verify(
        counter,
        !visited.has(current.nodeId),
        `hierarchy cycle detected at ${node.nodeId}`,
        "generated/journey-dna.json",
      );
      visited.add(current.nodeId);
      current = hierarchyByNodeId.get(current.parentId)!;
    }
  });
  source.journeyDNA.records.forEach((record) =>
    verify(
      counter,
      hierarchyByNodeId.get(record.regionId)?.recommendationEligible === true,
      `Journey DNA region ${record.regionId} is not recommendation eligible`,
      "generated/journey-dna.json",
    ),
  );

  const reasonCodes = new Set(source.reasonLibrary.records.map((record) => record.reasonCode));
  source.compatibilityMatrix.records.forEach((record) => {
    verify(
      counter,
      regionIdSet.has(record.regionId),
      `compatibility record references unknown region ${record.regionId}`,
      "generated/compatibility-matrix.json",
    );
    verify(
      counter,
      Number.isInteger(record.score) && record.score >= 0 && record.score <= 5,
      `compatibility score is invalid for ${record.regionId}`,
      "generated/compatibility-matrix.json",
    );
    verify(
      counter,
      reasonCodes.has(record.reasonCode),
      `compatibility record references unknown reason ${record.reasonCode}`,
      "generated/compatibility-matrix.json",
    );
  });
  source.constraintLibrary.records.forEach((record) => {
    verify(
      counter,
      reasonCodes.has(record.reasonCode),
      `constraint references unknown reason ${record.reasonCode}`,
      "generated/constraint-library.json",
    );
    verify(
      counter,
      hierarchyByNodeId.has(record.target) ||
        regionIdSet.has(record.target) ||
        record.target === "Domestic" ||
        record.target === "International",
      `constraint references unknown target ${record.target}`,
      "generated/constraint-library.json",
    );
  });
  verify(
    counter,
    sameIds(
      source.journeySeeds.records.map((record) => record.regionId),
      regionIds,
    ),
    "journey seed region IDs do not match Journey DNA",
    "generated/journey-seeds.json",
  );
  verify(
    counter,
    sameIds(
      source.journeyTemplates.records.map((record) => record.regionId),
      regionIds,
    ),
    "journey template region IDs do not match Journey DNA",
    "generated/journey-templates.json",
  );

  return {
    status: "PASS",
    checksExecuted: counter.executed,
    checksPassed: counter.passed,
    artifactsVerified: RUNTIME_ARTIFACT_KEYS.length,
    artifactChecksums: Object.freeze(artifactChecksums),
  };
}

export function loadJourneyIntelligencePackage(
  source: RuntimeIntelligenceSource = bundledSource,
): RuntimeIntelligencePackage {
  const verification = verifySource(source);
  const artifacts: RuntimeArtifactValues = {
    journeyDNA: source.journeyDNA,
    compatibilityMatrix: source.compatibilityMatrix,
    constraintLibrary: source.constraintLibrary,
    reasonLibrary: source.reasonLibrary,
    journeySeeds: source.journeySeeds,
    journeyTemplates: source.journeyTemplates,
    metadata: source.metadata,
  };
  const indexes = buildIndexes(artifacts);

  verify(
    { executed: 0, passed: 0 },
    indexes.journeyDNAByRegionId.size === source.manifest.recordCounts.journeyDNARecords &&
      indexes.reasonByCode.size === source.manifest.recordCounts.reasonCodes &&
      indexes.journeySeedByRegionId.size === source.manifest.recordCounts.journeySeedRecords &&
      indexes.journeyTemplateByRegionId.size ===
        source.manifest.recordCounts.journeyTemplateRecords,
    "runtime lookup indexes are incomplete",
  );

  return {
    manifest: source.manifest,
    ...artifacts,
    indexes,
    verification,
  };
}

function loadBundledPackage(): RuntimeIntelligencePackage {
  try {
    return loadJourneyIntelligencePackage();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "Journey Director intelligence package failed integrity verification and was not loaded.",
      );
    }
    throw error;
  }
}

export const runtimeJourneyIntelligence = loadBundledPackage();
