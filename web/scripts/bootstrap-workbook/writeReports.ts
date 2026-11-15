/**
 * Markdown report writers for the Bootstrap Generator. Consolidated into
 * one file (Validation Report + Summary Report as two exported functions)
 * rather than two separate files — both are small, share no state that
 * needs isolating, and the split into `writeValidationReport.ts` /
 * `writeSummaryReport.ts` named during planning added no separation of
 * concern that justified two files. Rad engineering-discretion decision
 * (Project Instructions Section 21); noted here, not silently, in case a
 * future card wants them split for independent versioning.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { GeoScopeResolutionSummary, PlaceRow, TravelRegionRow, ValidationFinding } from "./types.js";

function severityIcon(severity: ValidationFinding["severity"]): string {
  return severity === "error" ? "ERROR" : "WARNING";
}

/**
 * Findings + geoScope resolution outcomes, for Rad/Keerthi to review
 * before treating a run as clean. An `error`-severity finding does not by
 * itself stop the generator (per EBC-R1.3-WS1-006's own no-guessing
 * design, an unresolved geoScope rule is reported, not fatal to the rest
 * of the run) — this report is how it becomes visible rather than silently
 * absorbed into a shorter Sheet 2.
 */
export async function writeValidationReport(input: {
  readonly path: string;
  readonly generatedAt: string;
  readonly findings: readonly ValidationFinding[];
  readonly geoScopeResolutions: readonly GeoScopeResolutionSummary[];
}): Promise<void> {
  const errorCount = input.findings.filter((finding) => finding.severity === "error").length;
  const warningCount = input.findings.filter((finding) => finding.severity === "warning").length;

  const findingsTable = input.findings.length
    ? [
        "| Severity | Code | Travel Region | Message |",
        "|---|---|---|---|",
        ...input.findings.map(
          (finding) =>
            `| ${severityIcon(finding.severity)} | \`${finding.code}\` | ${finding.travelRegionId ?? "-"} | ${finding.message.replace(/\|/g, "\\|")} |`,
        ),
      ].join("\n")
    : "_No findings this run._";

  const geoScopeTable = input.geoScopeResolutions.length
    ? [
        "| Travel Region | Outcome | Candidates Found | Detail |",
        "|---|---|---|---|",
        ...input.geoScopeResolutions.map(
          (resolution) =>
            `| ${resolution.travelRegionId} | ${resolution.outcome} | ${resolution.candidatesDiscovered} | ${resolution.detail.replace(/\|/g, "\\|")} |`,
        ),
      ].join("\n")
    : "_No geoScope resolutions recorded this run._";

  const content = `# Bootstrap Generator — Validation Report

Generated at: ${input.generatedAt}

## Summary

- Errors: ${errorCount}
- Warnings: ${warningCount}
- geoScope rules resolved: ${input.geoScopeResolutions.length}

## Findings

${findingsTable}

## geoScope Resolutions (Sheet 2 candidate discovery)

${geoScopeTable}
`;
  await mkdir(dirname(input.path), { recursive: true });
  await writeFile(input.path, content, "utf8");
}

/** Row counts and Category B seeding activity, for a quick "what changed this run" read without opening the workbook. */
export async function writeSummaryReport(input: {
  readonly path: string;
  readonly generatedAt: string;
  readonly workbookPath: string;
  readonly travelRegions: readonly TravelRegionRow[];
  readonly places: readonly PlaceRow[];
  readonly isFirstGeneration: boolean;
}): Promise<void> {
  const placesKnown = input.places.filter((place) => place.existsInKB === "Yes").length;
  const placesCandidate = input.places.filter((place) => place.existsInKB === "No").length;
  const domestic = input.travelRegions.filter((region) => region.category === "Domestic").length;
  const international = input.travelRegions.filter((region) => region.category === "International").length;
  const geoIdentityMatched = (rows: readonly { geoPlaceId: string | null }[]) =>
    rows.filter((row) => row.geoPlaceId !== null).length;

  const content = `# Bootstrap Generator — Summary Report

Generated at: ${input.generatedAt}
Output workbook: ${input.workbookPath}
Run type: ${input.isFirstGeneration ? "First generation (no prior workbook found at this path)" : "Regeneration (existing Category B/C values read forward)"}

## Sheet 1 — Travel Regions

- Total rows: ${input.travelRegions.length} (Domestic: ${domestic}, International: ${international})
- Rows with a confident geo_places identity match: ${geoIdentityMatched(input.travelRegions)} / ${input.travelRegions.length}

## Sheet 2 — Places

- Total rows: ${input.places.length}
- Already KB-documented (existsInKB = Yes): ${placesKnown}
- Newly-discovered candidates (existsInKB = No, status seeded "Proposed"): ${placesCandidate}
- Rows with a confident geo_places identity match: ${geoIdentityMatched(input.places)} / ${input.places.length}

## Sheet 3 — Curated Journeys

- Header-only at bootstrap, 0 data rows (EBC-R1.3-WS3-001 Section 4.3, Decision D4).
`;
  await mkdir(dirname(input.path), { recursive: true });
  await writeFile(input.path, content, "utf8");
}
