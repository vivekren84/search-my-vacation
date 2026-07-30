import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  GENERATOR_VERSION,
  JourneyIntelligenceError,
  SCHEMA_VERSION,
  type ArtifactHeader,
  type CompatibilityArtifact,
  type ConstraintArtifact,
  type IntelligenceManifest,
  type JourneyDNAArtifact,
  type JourneySeedArtifact,
  type JourneyTemplateArtifact,
  type MetadataArtifact,
  type ReasonArtifact,
} from "./types.js";
import {
  ARTIFACT_NAMES,
  EXPECTED_ARTIFACT_FILENAMES,
} from "./artifactNames.js";
import { compareStrings, sha256File } from "./utils.js";

export interface ArtifactVerificationReport {
  status: "PASS";
  checksExecuted: number;
  checksPassed: number;
  artifactCount: number;
}

interface VerificationCounter {
  executed: number;
  passed: number;
}

function verify(
  counter: VerificationCounter,
  condition: unknown,
  message: string,
  recordId?: string,
): asserts condition {
  counter.executed += 1;
  if (!condition) {
    throw new JourneyIntelligenceError({
      component: "ArtifactVerification",
      message,
      recordId,
    });
  }
  counter.passed += 1;
}

async function readJson<T>(path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    throw new JourneyIntelligenceError({
      component: "ArtifactVerification",
      message: `Invalid JSON at ${path}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}

function verifyHeader(
  counter: VerificationCounter,
  value: ArtifactHeader,
  manifest: IntelligenceManifest,
  filename: string,
): void {
  verify(
    counter,
    value.schemaVersion === SCHEMA_VERSION,
    `${filename} uses supported schema ${SCHEMA_VERSION}`,
  );
  verify(
    counter,
    value.generatorVersion === GENERATOR_VERSION,
    `${filename} uses supported generator ${GENERATOR_VERSION}`,
  );
  verify(
    counter,
    value.workbookChecksum === manifest.workbookChecksum,
    `${filename} references the manifest workbook checksum`,
  );
}

function unique(
  counter: VerificationCounter,
  values: readonly string[],
  label: string,
): void {
  verify(
    counter,
    new Set(values).size === values.length,
    `${label} must be unique`,
  );
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  return (
    [...left].sort(compareStrings).join("|") ===
    [...right].sort(compareStrings).join("|")
  );
}

function verifyHierarchy(
  counter: VerificationCounter,
  journeyDNA: JourneyDNAArtifact,
): void {
  const nodeIds = new Set(journeyDNA.hierarchy.map((node) => node.nodeId));
  unique(
    counter,
    journeyDNA.hierarchy.map((node) => node.nodeId),
    "Hierarchy node IDs",
  );
  journeyDNA.hierarchy.forEach((node) => {
    verify(
      counter,
      node.parentId === null || nodeIds.has(node.parentId),
      "Hierarchy parent must exist",
      node.nodeId,
    );
    const seen = new Set<string>();
    let current = node;
    while (current.parentId !== null) {
      verify(
        counter,
        !seen.has(current.nodeId),
        "Hierarchy must not contain cycles",
        node.nodeId,
      );
      seen.add(current.nodeId);
      const parent = journeyDNA.hierarchy.find(
        (candidate) => candidate.nodeId === current.parentId,
      );
      verify(counter, parent, "Hierarchy parent lookup must resolve", node.nodeId);
      current = parent;
    }
  });
  journeyDNA.records.forEach((record) => {
    const hierarchy = journeyDNA.hierarchy.find(
      (node) => node.nodeId === record.regionId,
    );
    verify(
      counter,
      hierarchy?.recommendationEligible === true,
      "Journey DNA must reference a recommendation-eligible hierarchy node",
      record.regionId,
    );
  });
}

export async function verifyArtifactPackage(
  generatedDirectory: string,
  workbookPath?: string,
): Promise<ArtifactVerificationReport> {
  const counter: VerificationCounter = { executed: 0, passed: 0 };
  const files = (await readdir(generatedDirectory)).sort(compareStrings);
  verify(
    counter,
    files.join("|") === EXPECTED_ARTIFACT_FILENAMES.join("|"),
    "Generated directory must contain exactly the eight documented artifacts",
  );

  const manifestPath = join(
    generatedDirectory,
    ARTIFACT_NAMES.manifest,
  );
  const manifest = await readJson<IntelligenceManifest>(manifestPath);
  verify(
    counter,
    manifest.schemaVersion === SCHEMA_VERSION,
    `Manifest schema must be ${SCHEMA_VERSION}`,
  );
  verify(
    counter,
    manifest.generatorVersion === GENERATOR_VERSION,
    `Manifest generator must be ${GENERATOR_VERSION}`,
  );
  verify(
    counter,
    manifest.validation.status === "PASS",
    "Manifest validation status must be PASS",
  );
  verify(
    counter,
    Number.isFinite(Date.parse(manifest.generatedAt)),
    "Manifest generatedAt must be ISO-8601 compatible",
  );
  verify(
    counter,
    !Object.values(manifest.artifacts).some(
      (artifact) => artifact.path === `generated/${ARTIFACT_NAMES.manifest}`,
    ),
    "Manifest must not contain its own checksum",
  );
  if (workbookPath) {
    verify(
      counter,
      (await sha256File(workbookPath)) === manifest.workbookChecksum,
      "Manifest workbook checksum must match the canonical workbook",
    );
  }

  const expectedPaths = {
    journeyDNA: `generated/${ARTIFACT_NAMES.journeyDNA}`,
    compatibilityMatrix: `generated/${ARTIFACT_NAMES.compatibilityMatrix}`,
    constraintLibrary: `generated/${ARTIFACT_NAMES.constraintLibrary}`,
    reasonLibrary: `generated/${ARTIFACT_NAMES.reasonLibrary}`,
    journeySeeds: `generated/${ARTIFACT_NAMES.journeySeeds}`,
    journeyTemplates: `generated/${ARTIFACT_NAMES.journeyTemplates}`,
    metadata: `generated/${ARTIFACT_NAMES.metadata}`,
  } as const;
  for (const [key, expectedPath] of Object.entries(expectedPaths)) {
    const artifact = manifest.artifacts[
      key as keyof typeof manifest.artifacts
    ];
    verify(counter, artifact.path === expectedPath, `${key} path must match`);
    const filename = expectedPath.replace(/^generated\//, "");
    verify(
      counter,
      (await sha256File(join(generatedDirectory, filename))) ===
        artifact.checksum,
      `${filename} checksum must match the manifest`,
    );
  }

  const journeyDNA = await readJson<JourneyDNAArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.journeyDNA),
  );
  const compatibility = await readJson<CompatibilityArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.compatibilityMatrix),
  );
  const constraints = await readJson<ConstraintArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.constraintLibrary),
  );
  const reasons = await readJson<ReasonArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.reasonLibrary),
  );
  const seeds = await readJson<JourneySeedArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.journeySeeds),
  );
  const templates = await readJson<JourneyTemplateArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.journeyTemplates),
  );
  const metadata = await readJson<MetadataArtifact>(
    join(generatedDirectory, ARTIFACT_NAMES.metadata),
  );

  [
    [ARTIFACT_NAMES.journeyDNA, journeyDNA],
    [ARTIFACT_NAMES.compatibilityMatrix, compatibility],
    [ARTIFACT_NAMES.constraintLibrary, constraints],
    [ARTIFACT_NAMES.reasonLibrary, reasons],
    [ARTIFACT_NAMES.journeySeeds, seeds],
    [ARTIFACT_NAMES.journeyTemplates, templates],
    [ARTIFACT_NAMES.metadata, metadata],
  ].forEach(([filename, artifact]) =>
    verifyHeader(
      counter,
      artifact as ArtifactHeader,
      manifest,
      filename as string,
    ),
  );

  unique(
    counter,
    journeyDNA.records.map((record) => record.regionId),
    "Journey DNA region IDs",
  );
  verifyHierarchy(counter, journeyDNA);
  const journeyRegionIds = new Set(
    journeyDNA.records.map((record) => record.regionId),
  );
  compatibility.records.forEach((record) => {
    verify(
      counter,
      journeyRegionIds.has(record.regionId),
      "Compatibility must reference Journey DNA",
      record.regionId,
    );
    verify(
      counter,
      Number.isInteger(record.score) && record.score >= 0 && record.score <= 5,
      "Compatibility score must be an integer from 0 to 5",
      record.regionId,
    );
    verify(
      counter,
      /^[A-Z][A-Z0-9_]*$/.test(record.reasonCode),
      "Compatibility reason code must be valid",
      record.regionId,
    );
  });
  unique(
    counter,
    compatibility.records.map(
      (record) => `${record.regionId}|${record.category}|${record.key}`,
    ),
    "Compatibility lookup keys",
  );

  const hierarchyIds = new Set(
    journeyDNA.hierarchy.map((node) => node.nodeId),
  );
  const reasonCodes = new Set(reasons.records.map((reason) => reason.reasonCode));
  unique(
    counter,
    constraints.records.map((record) => record.constraintId),
    "Constraint IDs",
  );
  unique(
    counter,
    reasons.records.map((record) => record.reasonCode),
    "Reason codes",
  );
  constraints.records.forEach((record) => {
    const targetValid =
      record.type === "DestinationScope"
        ? record.target === "Domestic" || record.target === "International"
        : hierarchyIds.has(record.target);
    verify(counter, targetValid, "Constraint target must resolve", record.constraintId);
    verify(
      counter,
      reasonCodes.has(record.reasonCode),
      "Constraint reason code must resolve",
      record.constraintId,
    );
  });
  compatibility.records.forEach((record) =>
    verify(
      counter,
      reasonCodes.has(record.reasonCode),
      "Compatibility reason code must resolve",
      record.regionId,
    ),
  );
  const usedReasonCodes = new Set([
    ...compatibility.records.map((record) => record.reasonCode),
    ...constraints.records.map((record) => record.reasonCode),
  ]);
  reasons.records.forEach((reason) => {
    verify(
      counter,
      usedReasonCodes.has(reason.reasonCode),
      "Reason codes must not be orphaned",
      reason.reasonCode,
    );
    verify(
      counter,
      reason.summary.length > 0 &&
        reason.description.length > 0 &&
        reason.context.length > 0,
      "Reason records must be complete",
      reason.reasonCode,
    );
  });

  unique(
    counter,
    seeds.records.map((record) => record.regionId),
    "Journey Seed region IDs",
  );
  unique(
    counter,
    templates.records.map((record) => record.regionId),
    "Journey Template region IDs",
  );
  verify(
    counter,
    sameIds(
      journeyDNA.records.map((record) => record.regionId),
      seeds.records.map((record) => record.regionId),
    ),
    "Every Journey DNA record must have exactly one Journey Seed",
  );
  verify(
    counter,
    sameIds(
      journeyDNA.records.map((record) => record.regionId),
      templates.records.map((record) => record.regionId),
    ),
    "Every Journey DNA record must have exactly one Journey Template",
  );

  verify(
    counter,
    metadata.validation.status === "PASS" &&
      manifest.validation.status === metadata.validation.status,
    "Metadata validation status must reconcile to the manifest",
  );
  verify(
    counter,
    JSON.stringify(metadata.recordCounts) ===
      JSON.stringify(manifest.recordCounts),
    "Metadata and manifest record counts must match",
  );
  verify(
    counter,
    manifest.recordCounts.destinationRegions > 0 &&
      manifest.recordCounts.journeyBases > 0 &&
      manifest.recordCounts.compatibilityRecords > 0 &&
      manifest.recordCounts.constraintRecords > 0 &&
      manifest.recordCounts.reasonCodes > 0,
    "Required manifest record counts must be non-zero",
  );
  verify(
    counter,
    manifest.recordCounts.journeyDNARecords === journeyDNA.records.length &&
      manifest.recordCounts.compatibilityRecords ===
        compatibility.records.length &&
      manifest.recordCounts.constraintRecords === constraints.records.length &&
      manifest.recordCounts.reasonCodes === reasons.records.length &&
      manifest.recordCounts.journeySeedRecords === seeds.records.length &&
      manifest.recordCounts.journeyTemplateRecords === templates.records.length,
    "Manifest record counts must match artifact contents",
  );

  return {
    status: "PASS",
    checksExecuted: counter.executed,
    checksPassed: counter.passed,
    artifactCount: files.length,
  };
}

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const generatedDirectory = resolve(option("--generated") ?? "generated");
  const workbookPath = option("--workbook");
  const result = await verifyArtifactPackage(
    generatedDirectory,
    workbookPath ? resolve(workbookPath) : undefined,
  );
  console.log(JSON.stringify(result));
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        component: "ArtifactVerification",
        status: "FAILED",
        message,
      }),
    );
    process.exitCode = 1;
  });
}
