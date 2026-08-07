import { existsSync } from "node:fs";
import { join } from "node:path";

import { release1JourneyCandidates } from "../catalogue";
import { journeyPresentationCatalogue, journeyPresentationKey } from "../../../config/journey-director.config";

/**
 * EBC-017C Part D — automated validation for the curated Journey Director
 * presentation catalogue.
 *
 * This catalogue is hand-authored, hard-coded metadata that is matched
 * against the *generated* production catalogue (release1JourneyCandidates)
 * purely by string equality on candidateId/regionId/evidence ids
 * (see recommendation-adapter.ts's canUseMetadata / metadataIsSupported).
 * That equality check fails silently: if the generated data's ids drift
 * (as they did before EBC-017C — see EBC-017B's assessment), the curated
 * entry simply never activates and the traveller silently gets the raw
 * fallback content instead, with no error, no log, nothing. That silent
 * failure is exactly how the mismatch went unnoticed in the first place.
 *
 * This script re-implements the same matching logic the adapter uses, and
 * fails loudly and specifically when a curated entry can never activate,
 * rather than letting it decay silently again.
 */

type CheckResult = {
  label: string;
  passed: boolean;
  detail?: string;
};

type EntryReport = {
  key: string;
  candidateId: string;
  regionId: string;
  status: "active" | "known-deferred" | "unexpected-failure";
  checks: CheckResult[];
};

// Entries explicitly scoped OUT of activation by EBC-017C Part A. Their
// regionId/evidence mismatch is a known, already-documented gap requiring a
// product/content decision (see EBC-017C assessment) — not a new regression.
// Tracking them here, visibly, rather than silently excluding them from
// validation altogether.
const KNOWN_DEFERRED_CANDIDATE_IDS = new Set(["kerala", "sri-lanka", "vizag"]);

// Entries EBC-017C Part A requires to be fully active in production.
const REQUIRED_ACTIVE_CANDIDATE_IDS = new Set(["goa", "bali"]);

let hardFailures = 0;
let deferredWarnings = 0;

function report(entry: EntryReport) {
  const allPassed = entry.checks.every((check) => check.passed);
  const icon = allPassed ? "PASS" : entry.status === "known-deferred" ? "WARN (known, deferred)" : "FAIL";
  console.log(`\n[${icon}] ${entry.key} (candidateId=${entry.candidateId}, regionId=${entry.regionId})`);
  entry.checks.forEach((check) => {
    const mark = check.passed ? "  ok " : "  !! ";
    console.log(`${mark}- ${check.label}${check.detail ? `: ${check.detail}` : ""}`);
  });

  if (!allPassed) {
    if (entry.status === "known-deferred") {
      deferredWarnings += 1;
    } else {
      hardFailures += 1;
    }
  } else if (entry.status === "unexpected-failure") {
    // Should not happen: status is only "unexpected-failure" when a check
    // actually failed. Defensive guard against a logic error in this script.
    hardFailures += 1;
  }
}

function verifyEntry(key: string) {
  const metadata = journeyPresentationCatalogue[key];
  const checks: CheckResult[] = [];
  const isDeferred = KNOWN_DEFERRED_CANDIDATE_IDS.has(metadata.candidateId);
  const isRequiredActive = REQUIRED_ACTIVE_CANDIDATE_IDS.has(metadata.candidateId);

  // ✓ key matches the metadata's own candidateId/regionId (catches copy-paste
  // drift between the map key and the object body).
  checks.push({
    label: "catalogue key matches metadata.candidateId/regionId",
    passed: key === journeyPresentationKey(metadata.candidateId, metadata.regionId),
  });

  // ✓ candidate exists in production data
  const candidate = release1JourneyCandidates.find((c) => c.id === metadata.candidateId);
  checks.push({
    label: "candidate exists in release1JourneyCandidates",
    passed: Boolean(candidate),
    detail: candidate ? undefined : `no candidate with id "${metadata.candidateId}"`,
  });

  // ✓ region exists, and ✓ regionId matches production (same lookup covers
  // both — a mismatched regionId is indistinguishable from a missing one
  // from the adapter's point of view, since it does exact string matching)
  const region = candidate?.regions.find((r) => r.id === metadata.regionId);
  checks.push({
    label: "regionId matches a real generated region for this candidate",
    passed: Boolean(region),
    detail: region
      ? undefined
      : candidate
        ? `"${metadata.regionId}" not found; real region ids are: ${candidate.regions.map((r) => r.id).join(", ")}`
        : "candidate missing, cannot check regions",
  });

  // ✓ supporting evidence exists — every id the curated entry references
  // (top-level and per-moment) must be an id the engine will actually
  // generate for this exact candidate/region, or metadataIsSupported() will
  // never be satisfied.
  const realEvidenceIds = new Set<string>([
    ...(candidate?.evidence.map((e) => e.id) ?? []),
    ...(region?.evidence.map((e) => e.id) ?? []),
  ]);
  const referencedEvidenceIds = new Set<string>([
    ...metadata.supportingEvidenceIds,
    ...metadata.moments.flatMap((moment) => moment.supportingEvidenceIds),
  ]);
  const unknownEvidenceIds = [...referencedEvidenceIds].filter((id) => !realEvidenceIds.has(id));
  checks.push({
    label: "every supportingEvidenceIds reference (entry + moments) is a real evidence id",
    passed: unknownEvidenceIds.length === 0,
    detail: unknownEvidenceIds.length > 0 ? `unknown ids: ${unknownEvidenceIds.join(", ")}` : undefined,
  });
  checks.push({
    label: "top-level supportingEvidenceIds is non-empty (required for activation)",
    passed: metadata.supportingEvidenceIds.length > 0,
  });

  // ✓ hero image exists on disk (top-level and every moment image)
  const imagePaths = [metadata.heroImage, ...metadata.moments.map((m) => m.image)];
  const missingImages = imagePaths.filter(
    (imagePath) => !existsSync(join(process.cwd(), "public", imagePath)),
  );
  checks.push({
    label: "hero image and all moment images exist on disk under public/",
    passed: missingImages.length === 0,
    detail: missingImages.length > 0 ? `missing: ${missingImages.join(", ")}` : undefined,
  });

  // ✓ metadata activates — re-implement recommendation-adapter's exact
  // canUseMetadata condition structurally (candidateId match + regionId
  // match + every supportingEvidenceIds id present in the id set the engine
  // would actually produce), rather than depending on finding a passport
  // that happens to surface this exact candidate/region as a possibility.
  const wouldActivate =
    Boolean(candidate) &&
    Boolean(region) &&
    metadata.supportingEvidenceIds.length > 0 &&
    metadata.supportingEvidenceIds.every((id) => realEvidenceIds.has(id));
  checks.push({
    label: "metadata would activate (canUseMetadata's own condition, re-evaluated against production data)",
    passed: wouldActivate,
  });

  report({
    key,
    candidateId: metadata.candidateId,
    regionId: metadata.regionId,
    status: isDeferred ? "known-deferred" : isRequiredActive ? "active" : "unexpected-failure",
    checks,
  });

  return { candidateId: metadata.candidateId, wouldActivate, isRequiredActive, isDeferred };
}

function runVerification() {
  const keys = Object.keys(journeyPresentationCatalogue);
  console.log(`Curated Journey Director presentation catalogue: ${keys.length} entries.\n`);

  const results = keys.map(verifyEntry);

  const requiredActiveButBroken = results.filter(
    (r) => r.isRequiredActive && !r.wouldActivate,
  );
  const deferredNowUnexpectedlyFixed = results.filter(
    (r) => r.isDeferred && r.wouldActivate,
  );

  console.log(
    `\n${hardFailures === 0 ? "PASS" : "FAIL"}: ${keys.length} entries checked, ` +
      `${hardFailures} hard failure(s), ${deferredWarnings} known-deferred warning(s).`,
  );

  if (requiredActiveButBroken.length > 0) {
    throw new Error(
      `Curated catalogue validation failed: EBC-017C Part A requires these candidates to be active, but they are not: ${requiredActiveButBroken
        .map((r) => r.candidateId)
        .join(", ")}.`,
    );
  }

  if (deferredNowUnexpectedlyFixed.length > 0) {
    // Not a failure — a pleasant surprise. If a deferred candidate's mapping
    // now happens to be correct, flag it so the KNOWN_DEFERRED_CANDIDATE_IDS
    // list (and the Release 1.1 backlog) can be updated deliberately.
    console.log(
      `\nNOTE: previously-deferred candidate(s) now pass activation checks: ${deferredNowUnexpectedlyFixed
        .map((r) => r.candidateId)
        .join(", ")}. Confirm the underlying content is actually approved before promoting them out of KNOWN_DEFERRED_CANDIDATE_IDS.`,
    );
  }

  if (hardFailures > 0) {
    throw new Error(`Curated catalogue validation failed with ${hardFailures} hard failure(s).`);
  }
}

runVerification();
