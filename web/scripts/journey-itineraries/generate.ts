import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { generateArtifacts } from "./generateArtifacts.js";
import { json } from "./normalise.js";
import { parseItinerarySheet } from "./parseItinerarySheet.js";
import { readWorkbook } from "./readWorkbook.js";
import type { GeneratedItineraryArtifacts, ParsedItinerary, ValidationIssue } from "./types.js";
import {
  CONTROL_SHEETS,
  parseIndex,
  validateItinerary,
  validateUniqueness,
  validateWorkbookCatalogue,
} from "./validateItinerary.js";
import { writeArtifacts } from "./writeArtifacts.js";

export type GenerationOptions = {
  workbookPath: string;
  outputDirectory: string;
  reportDirectory: string;
  approvedOnly: boolean;
};

export type GenerationResult = {
  artifacts: GeneratedItineraryArtifacts;
  deterministic: true;
};

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasOption(name: string): boolean {
  return process.argv.includes(name);
}

export function defaultOptions(): GenerationOptions {
  return {
    workbookPath: resolve(option("--workbook") ?? "../outputs/ebc-010a/SMV-Journey-Itinerary-Knowledge-Base-v1.xlsx"),
    outputDirectory: resolve(option("--output") ?? "generated/journey-itineraries"),
    reportDirectory: resolve(option("--reports") ?? "../outputs/ebc-011"),
    approvedOnly: hasOption("--approved-only"),
  };
}

export async function buildGeneration(options: GenerationOptions): Promise<GenerationResult> {
  const workbook = await readWorkbook(options.workbookPath);
  const { entries, issues: indexIssues } = parseIndex(workbook);
  const issues: ValidationIssue[] = [...indexIssues, ...validateWorkbookCatalogue(workbook, entries)];
  const archivedCount = entries.filter((entry) => entry.status === "archived").length;
  const included = entries.filter((entry) => options.approvedOnly ? entry.status === "approved" : entry.status !== "archived");
  const records: ParsedItinerary[] = [];
  for (const entry of included) {
    if (!entry.status) continue;
    const sheet = workbook.sheets.find((candidate) => candidate.name === entry.sheetName);
    if (!sheet || CONTROL_SHEETS.includes(sheet.name as typeof CONTROL_SHEETS[number])) continue;
    const parsed = parseItinerarySheet(workbook.filename, sheet, entry);
    records.push(parsed.itinerary);
    issues.push(...parsed.issues, ...validateItinerary(parsed.itinerary, parsed.unknownMonths));
  }
  issues.push(...validateUniqueness(records));
  const artifacts = generateArtifacts({ workbook, records, issues, indexRows: entries.length, archivedCount, approvedOnly: options.approvedOnly });
  const duplicate = generateArtifacts({ workbook, records, issues, indexRows: entries.length, archivedCount, approvedOnly: options.approvedOnly });
  if (json(artifacts) !== json(duplicate)) throw new Error("Deterministic artifact construction failed");
  return { artifacts, deterministic: true };
}

export async function runGeneration(options: GenerationOptions): Promise<GenerationResult> {
  const checksumBefore = (await readFile(options.workbookPath)).toString("base64");
  const result = await buildGeneration(options);
  if (result.artifacts.validation.summary.ERROR > 0) {
    const messages = result.artifacts.validation.issues.filter((issue) => issue.severity === "ERROR").map((issue) => `${issue.code}: ${issue.message}`).join("; ");
    throw new Error(`Itinerary generation blocked by validation errors: ${messages}`);
  }
  await writeArtifacts(result.artifacts, options.outputDirectory, options.reportDirectory);
  const checksumAfter = (await readFile(options.workbookPath)).toString("base64");
  if (checksumAfter !== checksumBefore) throw new Error("Source workbook changed during generation");
  return result;
}

async function main(): Promise<void> {
  const result = await runGeneration(defaultOptions());
  console.log(JSON.stringify({
    status: "PASS",
    workbookSha256: result.artifacts.manifest.sourceWorkbookSha256,
    includedRecords: result.artifacts.manifest.includedRecords,
    errors: result.artifacts.manifest.errors,
    reviewRequired: result.artifacts.manifest.reviewRequired,
    warnings: result.artifacts.manifest.warnings,
    deterministic: result.deterministic,
  }));
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(JSON.stringify({
      status: "FAILED",
      component: "JourneyItineraryGenerator",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }));
    process.exitCode = 1;
  });
}
