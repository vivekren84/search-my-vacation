/**
 * GOVERNANCE BOUNDARY — Bootstrap Generator entry point.
 *
 * EBC-R1.3-WS1-007 (Rad). Implements the approved Bootstrap Generator
 * (EBC-R1.3-WS1-004 Consolidated Workbook Specification / Generator
 * Contract; EBC-R1.3-WS1-005 live read-only Supabase access pattern;
 * EBC-R1.3-WS1-006 geoScope deterministic matching strategy) and writes
 * `docs/06-Product-Reviews/PBW-R1.3-001-Destination-Intelligence.xlsx`.
 *
 * This is a repeatable Product enablement tool, not a one-time migration
 * utility (the card's own Engineering Design Principle): every run reads
 * a prior copy of the workbook forward first (`readExistingWorkbook.ts`)
 * so Category B/C Product-owned values are never lost, then regenerates
 * only the Category A columns from the repository/live geo_places data.
 *
 * This module makes no Product, Architecture, or Governance decisions of
 * its own — it orchestrates the already-approved builders
 * (`buildTravelRegions.ts`, `buildPlaces.ts`), the geo_places access layer
 * (`../../lib/geo-validation/bootstrapRepository.ts`), and the workbook
 * writer (`xlsxWriter.ts` via `writeWorkbook.ts`).
 */

import { resolve } from "node:path";

import { createBootstrapGeoRepository } from "../../lib/geo-validation/bootstrapRepository.js";
import { buildPlaces } from "./buildPlaces.js";
import { buildTravelRegions } from "./buildTravelRegions.js";
import { readExistingWorkbook } from "./readExistingWorkbook.js";
import type { ValidationFinding } from "./types.js";
import { writeValidationReport, writeSummaryReport } from "./writeReports.js";
import { buildWorkbookSpec } from "./writeWorkbook.js";
import { writeXlsxWorkbook } from "./xlsxWriter.js";

const DEFAULT_WORKBOOK_PATH = "../docs/06-Product-Reviews/PBW-R1.3-001-Destination-Intelligence.xlsx";
const DEFAULT_VALIDATION_REPORT_PATH = "../docs/06-Product-Reviews/PBW-R1.3-001-VALIDATION-REPORT.md";
const DEFAULT_SUMMARY_REPORT_PATH = "../docs/06-Product-Reviews/PBW-R1.3-001-SUMMARY-REPORT.md";

function logEvent(event: string, status: "STARTED" | "PASSED" | "COMPLETE" | "FAILED", details: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ component: "BootstrapGenerator", event, status, ...details }));
}

function readEnvOrExit(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`Missing required environment variable: ${name}`);
    console.error("Set NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY in the shell that runs this generator (see web/.env.local).");
    process.exit(1);
  }
  return value.trim();
}

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasOption(name: string): boolean {
  return process.argv.includes(name);
}

interface GenerationOptions {
  readonly workbookPath: string;
  readonly validationReportPath: string | null;
  readonly summaryReportPath: string | null;
  readonly generatedAt: string;
}

function generationOptions(): GenerationOptions {
  const workbookPath = resolve(option("--workbook") ?? DEFAULT_WORKBOOK_PATH);
  const validationReportPath = hasOption("--no-report") ? null : resolve(option("--validation-report") ?? DEFAULT_VALIDATION_REPORT_PATH);
  const summaryReportPath = hasOption("--no-report") ? null : resolve(option("--summary-report") ?? DEFAULT_SUMMARY_REPORT_PATH);
  const generatedAt = option("--generated-at") ?? new Date().toISOString();
  return { workbookPath, validationReportPath, summaryReportPath, generatedAt };
}

export async function runGeneration(options: GenerationOptions): Promise<{ readonly errorCount: number; readonly warningCount: number }> {
  const projectUrl = readEnvOrExit("NEXT_PUBLIC_SUPABASE_URL");
  const secretKey = readEnvOrExit("SUPABASE_SECRET_KEY");
  const repository = createBootstrapGeoRepository({
    NEXT_PUBLIC_SUPABASE_URL: projectUrl,
    SUPABASE_SECRET_KEY: secretKey,
  });

  logEvent("Reading Existing Workbook", "STARTED", { workbookPath: options.workbookPath });
  const existing = await readExistingWorkbook(options.workbookPath);
  const isFirstGeneration = existing.kbStatusByTravelRegionId.size === 0 && existing.statusByPlaceId.size === 0;
  logEvent("Reading Existing Workbook", "COMPLETE", {
    isFirstGeneration,
    travelRegionsWithProductData: existing.productFieldsByTravelRegionId.size,
    placesWithProductData: existing.productFieldsByPlaceId.size,
  });

  logEvent("Building Travel Regions", "STARTED");
  const travelRegionsResult = await buildTravelRegions(
    repository,
    options.generatedAt,
    existing.kbStatusByTravelRegionId,
    existing.productFieldsByTravelRegionId,
  );
  logEvent("Building Travel Regions", "COMPLETE", {
    rows: travelRegionsResult.rows.length,
    findings: travelRegionsResult.findings.length,
  });

  logEvent("Building Places", "STARTED");
  const placesResult = await buildPlaces(
    repository,
    options.generatedAt,
    existing.statusByPlaceId,
    existing.productFieldsByPlaceId,
  );
  logEvent("Building Places", "COMPLETE", {
    rows: placesResult.rows.length,
    findings: placesResult.findings.length,
    geoScopeResolutions: placesResult.geoScopeResolutions.length,
  });

  const findings: ValidationFinding[] = [...travelRegionsResult.findings, ...placesResult.findings];
  const errorCount = findings.filter((finding) => finding.severity === "error").length;
  const warningCount = findings.filter((finding) => finding.severity === "warning").length;

  logEvent("Writing Workbook", "STARTED", { workbookPath: options.workbookPath });
  const spec = buildWorkbookSpec(travelRegionsResult.rows, placesResult.rows);
  writeXlsxWorkbook(spec, options.workbookPath);
  logEvent("Writing Workbook", "COMPLETE", { sheets: spec.sheets.length });

  if (options.validationReportPath) {
    await writeValidationReport({
      path: options.validationReportPath,
      generatedAt: options.generatedAt,
      findings,
      geoScopeResolutions: placesResult.geoScopeResolutions,
    });
  }
  if (options.summaryReportPath) {
    await writeSummaryReport({
      path: options.summaryReportPath,
      generatedAt: options.generatedAt,
      workbookPath: options.workbookPath,
      travelRegions: travelRegionsResult.rows,
      places: placesResult.rows,
      isFirstGeneration,
    });
  }

  // A finding at error severity (e.g. an unresolved geoScope rule, an
  // orphaned KB region transcription) does not stop the workbook from
  // being written — buildPlaces.ts already reports and skips only the
  // affected row/rule, per EBC-R1.3-WS1-006's own no-guessing design. The
  // non-zero exit code below is purely a CI/QA signal that the Validation
  // Report needs review before the run is treated as clean; it is not a
  // thrown exception and never discards otherwise-good output.
  logEvent("Generation Complete", errorCount > 0 ? "FAILED" : "COMPLETE", {
    errorCount,
    warningCount,
    workbookPath: options.workbookPath,
  });

  return { errorCount, warningCount };
}

async function main(): Promise<void> {
  const { errorCount } = await runGeneration(generationOptions());
  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ component: "BootstrapGenerator", status: "FAILED", message }));
    process.exitCode = 1;
  });
}
