import {
  RuntimeIntelligenceIntegrityError,
  loadJourneyIntelligencePackage,
  runtimeJourneyIntelligence,
  type RuntimeIntelligenceSource,
} from "../intelligence";
import {
  RELEASE1_CATALOGUE_METADATA,
  release1JourneyCandidates,
} from "../catalogue";
import { createJourneyRecommendationSet } from "../createJourneyRecommendationSet";
import { representativeProfiles } from "./representativeProfiles";

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) {
    throw new Error(`Runtime intelligence integration verification failed: ${message}`);
  }
}

function runtimeSource(): RuntimeIntelligenceSource {
  return {
    manifest: runtimeJourneyIntelligence.manifest,
    journeyDNA: runtimeJourneyIntelligence.journeyDNA,
    compatibilityMatrix: runtimeJourneyIntelligence.compatibilityMatrix,
    constraintLibrary: runtimeJourneyIntelligence.constraintLibrary,
    reasonLibrary: runtimeJourneyIntelligence.reasonLibrary,
    journeySeeds: runtimeJourneyIntelligence.journeySeeds,
    journeyTemplates: runtimeJourneyIntelligence.journeyTemplates,
    metadata: runtimeJourneyIntelligence.metadata,
  };
}

function verifyManifestAndIndexes(): void {
  const runtime = runtimeJourneyIntelligence;
  assert(runtime.verification.status === "PASS", "manifest verification passes");
  assert(runtime.verification.artifactsVerified === 7, "all seven manifest artifacts verify");
  assert(
    runtime.verification.checksExecuted === runtime.verification.checksPassed,
    "every runtime integrity check passes",
  );
  assert(
    Object.entries(runtime.verification.artifactChecksums).every(
      ([key, checksum]) =>
        runtime.manifest.artifacts[
          key as keyof typeof runtime.manifest.artifacts
        ].checksum === checksum,
    ),
    "runtime SHA-256 values match the Intelligence Manifest",
  );
  assert(
    runtime.indexes.journeyDNAByRegionId.size ===
      runtime.manifest.recordCounts.journeyDNARecords,
    "JourneyDNAByRegionId is complete",
  );
  assert(
    [...runtime.indexes.compatibilityByRegionId.values()].flat().length ===
      runtime.manifest.recordCounts.compatibilityRecords,
    "CompatibilityByRegionId is complete",
  );
  assert(
    [...runtime.indexes.constraintBySource.values()].flat().length ===
      runtime.manifest.recordCounts.constraintRecords,
    "ConstraintBySource is complete",
  );
  assert(
    [...runtime.indexes.constraintByTarget.values()].flat().length ===
      runtime.manifest.recordCounts.constraintRecords,
    "ConstraintByTarget is complete",
  );
  assert(
    runtime.indexes.reasonByCode.size === runtime.manifest.recordCounts.reasonCodes,
    "ReasonByCode is complete",
  );
  assert(
    runtime.indexes.journeySeedByRegionId.size ===
      runtime.manifest.recordCounts.journeySeedRecords,
    "JourneySeedByRegionId is complete",
  );
  assert(
    runtime.indexes.journeyTemplateByRegionId.size ===
      runtime.manifest.recordCounts.journeyTemplateRecords,
    "JourneyTemplateByRegionId is complete",
  );
  assert(
    [...runtime.indexes.journeyDNAByDestinationId.values()].flat().length ===
      runtime.manifest.recordCounts.journeyDNARecords,
    "destination grouping contains every generated Journey Base once",
  );
}

function verifyFailureBehaviour(): void {
  const tampered = structuredClone(runtimeSource());
  tampered.journeyDNA.records[0].region = "Tampered runtime record";
  let checksumFailure: unknown;
  try {
    loadJourneyIntelligencePackage(tampered);
  } catch (error) {
    checksumFailure = error;
  }
  assert(
    checksumFailure instanceof RuntimeIntelligenceIntegrityError &&
      checksumFailure.artifact === "generated/journey-dna.json" &&
      checksumFailure.message.includes("checksum mismatch"),
    "tampered artifacts fail closed with an artifact-specific checksum diagnostic",
  );

  const unsupported = structuredClone(runtimeSource());
  unsupported.manifest.schemaVersion = "99.0";
  let schemaFailure: unknown;
  try {
    loadJourneyIntelligencePackage(unsupported);
  } catch (error) {
    schemaFailure = error;
  }
  assert(
    schemaFailure instanceof RuntimeIntelligenceIntegrityError &&
      schemaFailure.artifact === "intelligence-manifest.json" &&
      schemaFailure.message.includes("unsupported schema"),
    "unsupported manifest schemas fail closed before catalogue use",
  );
}

function verifyCatalogueIntegration(): void {
  const generatedRegionIds = new Set(
    runtimeJourneyIntelligence.journeyDNA.records.map((record) => record.regionId),
  );
  const catalogueRegionIds = release1JourneyCandidates.flatMap((candidate) =>
    candidate.regions.map((region) => region.id),
  );
  assert(
    release1JourneyCandidates.length ===
      runtimeJourneyIntelligence.indexes.journeyDNAByDestinationId.size,
    "the runtime catalogue contains one candidate per generated destination with a Journey Base",
  );
  assert(
    catalogueRegionIds.length === generatedRegionIds.size &&
      catalogueRegionIds.every((regionId) => generatedRegionIds.has(regionId)),
    "the runtime catalogue consumes every generated Journey DNA record exactly once",
  );
  assert(
    RELEASE1_CATALOGUE_METADATA.sourceDocument ===
      "web/generated/intelligence-manifest.json",
    "catalogue provenance points to the Intelligence Manifest",
  );

  const timestamp = "2026-07-30T09:00:00.000Z";
  [
    representativeProfiles.relaxedFamily,
    representativeProfiles.cultureCouple,
    representativeProfiles.activeFriends,
    representativeProfiles.knownServedDestination,
  ].forEach((passport) => {
    const first = createJourneyRecommendationSet(passport, timestamp);
    const second = createJourneyRecommendationSet(passport, timestamp);
    assert(
      JSON.stringify(first) === JSON.stringify(second),
      `${passport.name} receives byte-stable repeated recommendations`,
    );
    assert(
      first.state === "success" && first.possibilities.length === 3,
      `${passport.name} retains the three deterministic recommendation personalities`,
    );
  });
}

verifyManifestAndIndexes();
verifyFailureBehaviour();
verifyCatalogueIntegration();

console.log(`Runtime intelligence integration verification passed (${checks} checks).`);
console.log(
  `Manifest ${runtimeJourneyIntelligence.manifest.generatorVersion}: ${runtimeJourneyIntelligence.verification.artifactsVerified} artifacts; ${runtimeJourneyIntelligence.manifest.recordCounts.journeyDNARecords} Journey DNA records; ${release1JourneyCandidates.length} runtime candidates.`,
);
