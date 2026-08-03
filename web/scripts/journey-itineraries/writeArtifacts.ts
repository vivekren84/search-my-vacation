import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { compareStrings, json } from "./normalise.js";
import type { GeneratedItineraryArtifacts, ValidationIssue } from "./types.js";

export const RUNTIME_FILENAMES = [
  "itinerary-aliases.json",
  "itinerary-catalogue.json",
  "itinerary-index.json",
  "itinerary-manifest.json",
] as const;

function issueList(issues: ValidationIssue[], severity: ValidationIssue["severity"]): string {
  const selected = issues.filter((issue) => issue.severity === severity);
  if (selected.length === 0) return "- None.";
  return selected.map((issue) => `- ${issue.code}${issue.worksheet ? ` — ${issue.worksheet}` : ""}: ${issue.message}`).join("\n");
}

function report(artifacts: GeneratedItineraryArtifacts): string {
  const { manifest, mappingAudit, validation } = artifacts;
  const mappingRows = mappingAudit.mappings.map((item) =>
    `| ${item.worksheet} | ${item.indexDestination} | ${item.runtimeId} | ${item.destinationCode} | ${item.parentDestination ?? "—"} | ${item.journeyDirectorCandidateIds.join(", ") || "—"} | ${item.status} | ${item.validationResult} |`,
  ).join("\n");
  const hashes = Object.entries(manifest.artifacts).sort(([left], [right]) => compareStrings(left, right)).map(([name, value]) => `- ${name}: \`${value.sha256}\` (${value.bytes.toLocaleString("en-US")} bytes)`).join("\n");
  return `# EBC-011 Journey Itinerary Generation Report

## Result

- Generation: **PASS**
- Deterministic artifact construction: **PASS**
- Source workbook: \`outputs/ebc-010a/${manifest.sourceWorkbook}\`
- Source workbook SHA-256: \`${manifest.sourceWorkbookSha256}\`
- Workbook worksheets: ${manifest.totalWorkbookSheets}
- Control sheets: ${manifest.totalControlSheets}
- Itinerary sheets: ${manifest.totalItinerarySheets}
- INDEX rows: ${manifest.indexRows}
- Included records: ${manifest.includedRecords}
- Excluded archived records: ${manifest.excludedArchivedRecords}
- Inclusion mode: \`${manifest.inclusionPolicy.mode}\`
- Status distribution: ${Object.entries(manifest.statusDistribution).map(([status, count]) => `${status}=${count}`).join(", ")}
- Errors: ${manifest.errors}
- Review required: ${manifest.reviewRequired}
- Warnings: ${manifest.warnings}

Draft records are included temporarily under the explicit Release 1 policy. Workbook status remains in generated source metadata but is never shown to travellers.

## Runtime artifacts

${hashes}

The website consumes generated JSON only. The workbook and generator-time ZIP/XML dependencies are not imported by runtime or client modules.

## Validation errors

${issueList(validation.issues, "ERROR")}

## Review-required items

${issueList(validation.issues, "REVIEW_REQUIRED")}

## Warnings

${issueList(validation.issues, "WARNING")}

## Workbook-to-runtime mapping

| Worksheet | INDEX Destination | Runtime ID | Destination Code | Parent | Journey Director candidates | Status | Validation |
|---|---|---|---|---|---|---|---|
${mappingRows}

## Unmatched workbook records

${mappingAudit.unmatchedWorkbookRecords.length ? mappingAudit.unmatchedWorkbookRecords.map((id) => `- ${id}`).join("\n") : "- None."}

## Unmatched Journey Director candidates

${mappingAudit.unmatchedJourneyDirectorCandidateIds.length ? mappingAudit.unmatchedJourneyDirectorCandidateIds.map((id) => `- ${id}`).join("\n") : "- None."}

## Stable ID and alias governance

- Runtime IDs are explicitly mapped from unique Destination Codes.
- Worksheet names are retained only as source audit metadata.
- Exact Journey Director region IDs, candidate IDs, destination codes, canonical aliases, journey bases, and parent defaults are generated as separate deterministic mappings.
- Rajasthan worksheet abbreviations never appear in traveller-facing destination names.
- New Destination Codes without an explicit stable mapping are marked REVIEW_REQUIRED.

## Normalisation rules

- Durations accept \`5 Days / 4 Nights\`, \`5D/4N\`, and equivalent case-insensitive forms.
- Yes/No fields are converted to booleans; any other token is an ERROR.
- Semicolon metadata is trimmed and deduplicated case-insensitively while preserving first display casing.
- Month names are canonicalised to January–December; unknown tokens require review.
- Excel serial dates are converted deterministically to ISO \`YYYY-MM-DD\` strings.

## Future workbook update workflow

1. Team Satvi updates the Excel workbook.
2. Revision Number and Last Updated are changed.
3. INDEX is reviewed.
4. \`npm run generate:journey-itineraries\` is run.
5. Validation and mapping reports are reviewed.
6. Generated JSON changes are reviewed; generated JSON is never edited manually.
7. Tests pass.
8. Workbook and generated JSON are committed together.
9. The website is deployed.
`;
}

export async function writeArtifacts(
  artifacts: GeneratedItineraryArtifacts,
  outputDirectory: string,
  reportDirectory: string,
): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  await mkdir(reportDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(outputDirectory, "itinerary-catalogue.json"), json(artifacts.catalogue)),
    writeFile(join(outputDirectory, "itinerary-index.json"), json(artifacts.index)),
    writeFile(join(outputDirectory, "itinerary-aliases.json"), json(artifacts.aliases)),
    writeFile(join(outputDirectory, "itinerary-manifest.json"), json(artifacts.manifest)),
    writeFile(join(reportDirectory, "EBC-011-ITINERARY-VALIDATION.json"), json(artifacts.validation)),
    writeFile(join(reportDirectory, "EBC-011-ITINERARY-MAPPING-AUDIT.json"), json(artifacts.mappingAudit)),
    writeFile(join(reportDirectory, "EBC-011-ITINERARY-GENERATION-REPORT.md"), report(artifacts)),
  ]);
}
