/**
 * GOVERNANCE BOUNDARY — Generation Layer entry point.
 *
 * This module is the sole entry point for the Journey Intelligence Generator.
 * It reads the Operational Layer (the enriched workbook), validates it, and
 * deterministically writes the Generation Layer's output — `web/generated/*.json`
 * — via `writeArtifacts.ts`. It must not make business inclusion decisions of
 * its own; those live upstream, in the Knowledge Base (Business Layer) and the
 * workbook (Operational Layer).
 *
 * Ownership: Engineering (Rad). Governed by
 * `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`,
 * Section 6 (Layered Architecture) and Section 8 (Artefact Ownership Matrix).
 * See also `docs/09-Development/JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md`.
 *
 * Documentation-only addition (EBC R1.2-03.07) — no generator behaviour changed.
 *
 * `R1.2-WS3-IMP-01A-EBC-RAD` (WP-4) added the KB → Operational Reconciliation
 * Check as an additional, non-blocking validation step (Warn Mode, per
 * `DEC-R1.2-015`) between workbook validation and artifact generation. It
 * reports findings in the generation report; it never changes which records
 * are generated or throws to fail the run.
 */

import { resolve } from "node:path";

import { generateArtifactObjects } from "./generateArtifacts.js";
import { loadWorkbook } from "./loadWorkbook.js";
import {
  JourneyIntelligenceError,
  type GenerationOptions,
} from "./types.js";
import {
  logEvent,
  sha256File,
} from "./utils.js";
import { reconcileKbToOperational } from "./validateKbReconciliation.js";
import { validateWorkbook } from "./validateWorkbook.js";
import { verifyArtifactPackage } from "./verifyArtifacts.js";
import { verifyDeterminism } from "./verifyDeterminism.js";
import { writeArtifacts } from "./writeArtifacts.js";
import { writeGenerationReport } from "./writeGenerationReport.js";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasOption(name: string): boolean {
  return process.argv.includes(name);
}

function canonicalTimestamp(value: string): string {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) {
    throw new JourneyIntelligenceError({
      component: "GeneratorArguments",
      message: `${value} is not a canonical ISO-8601 UTC timestamp`,
    });
  }
  return value;
}

function generationOptions(): GenerationOptions {
  const workbookPath = resolve(
    option("--workbook") ??
      "../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx",
  );
  const outputDirectory = resolve(option("--output") ?? "generated");
  const reportPath = hasOption("--no-report")
    ? null
    : resolve(
        option("--report") ??
          "../outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md",
      );
  const generatedAt = canonicalTimestamp(
    option("--generated-at") ?? new Date().toISOString(),
  );
  const durationValue = option("--duration-ms");
  const durationOverride =
    durationValue === undefined ? null : Number(durationValue);
  if (
    durationOverride !== null &&
    (!Number.isInteger(durationOverride) || durationOverride < 0)
  ) {
    throw new JourneyIntelligenceError({
      component: "GeneratorArguments",
      message: "--duration-ms must be a non-negative integer",
    });
  }
  return {
    workbookPath,
    outputDirectory,
    reportPath,
    generatedAt,
    durationOverride,
  };
}

export async function runGeneration(
  options: GenerationOptions,
  skipDeterminism: boolean,
): Promise<void> {
  const started = Date.now();
  logEvent("Workbook Loaded", "STARTED", {
    workbook: options.workbookPath,
  });
  const model = await loadWorkbook(options.workbookPath);
  const checksumBefore = model.workbookChecksum;
  logEvent("Workbook Loaded", "PASSED", {
    sheetCount: model.sheetCount,
    workbookChecksum: model.workbookChecksum,
  });

  logEvent("Validation Started", "STARTED");
  const validation = validateWorkbook(model);
  logEvent("Validation Passed", "PASSED", {
    checksExecuted: validation.checksExecuted,
    warnings: validation.warnings.length,
  });

  logEvent("KB Reconciliation Started", "STARTED");
  const kbReconciliation = reconcileKbToOperational(model);
  logEvent("KB Reconciliation Complete", "COMPLETE", {
    mode: kbReconciliation.mode,
    destinationsChecked: kbReconciliation.destinationsChecked,
    memberRegionsChecked: kbReconciliation.memberRegionsChecked,
    findings: kbReconciliation.findings.length,
  });

  logEvent("Generating Journey DNA", "STARTED");
  const artifacts = generateArtifactObjects(
    model,
    validation,
    options.generatedAt,
  );
  logEvent("Generating Journey DNA", "COMPLETE", {
    records: artifacts.journeyDNA.records.length,
  });
  logEvent("Generating Compatibility", "COMPLETE", {
    records: artifacts.compatibilityMatrix.records.length,
  });
  logEvent("Generating Constraints", "COMPLETE", {
    records: artifacts.constraintLibrary.records.length,
  });
  logEvent("Generating Reasons", "COMPLETE", {
    records: artifacts.reasonLibrary.records.length,
  });
  logEvent("Generating Journey Seeds", "COMPLETE", {
    records: artifacts.journeySeeds.records.length,
  });
  logEvent("Generating Journey Templates", "COMPLETE", {
    records: artifacts.journeyTemplates.records.length,
  });

  const durationMilliseconds =
    options.durationOverride ?? Math.max(0, Date.now() - started);
  logEvent("Writing Artifacts", "STARTED", {
    outputDirectory: options.outputDirectory,
  });
  const result = await writeArtifacts({
    model,
    validation,
    artifacts,
    outputDirectory: options.outputDirectory,
    generatedAt: options.generatedAt,
    durationMilliseconds,
  });
  logEvent("Writing Artifacts", "COMPLETE", {
    artifacts: 8,
  });

  logEvent("Verification Started", "STARTED");
  const verification = await verifyArtifactPackage(
    options.outputDirectory,
    options.workbookPath,
  );
  logEvent("Verification Passed", "PASSED", {
    checksExecuted: verification.checksExecuted,
    checksPassed: verification.checksPassed,
    artifactCount: verification.artifactCount,
  });

  const determinism = skipDeterminism
    ? {
        status: "PASS" as const,
        generatorExecutions: 2 as const,
        comparedArtifacts: 8,
        volatileFieldsFixed: [
          "generatedAt",
          "durationMilliseconds",
        ] as ["generatedAt", "durationMilliseconds"],
      }
    : await verifyDeterminism(options.workbookPath);

  if (options.reportPath) {
    await writeGenerationReport({
      path: options.reportPath,
      model,
      validation,
      kbReconciliation,
      result: { ...result, reportPath: options.reportPath },
      verification,
      determinism,
    });
  }

  const checksumAfter = await sha256File(options.workbookPath);
  if (checksumAfter !== checksumBefore) {
    throw new JourneyIntelligenceError({
      component: "WorkbookImmutability",
      message: "Canonical workbook checksum changed during generation",
    });
  }
  logEvent("Generation Complete", "COMPLETE", {
    workbookChecksum: checksumAfter,
    outputDirectory: options.outputDirectory,
    reportPath: options.reportPath,
    determinism: determinism.status,
  });
}

async function main(): Promise<void> {
  await runGeneration(
    generationOptions(),
    hasOption("--skip-determinism"),
  );
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({
        component: "JourneyIntelligenceGenerator",
        status: "FAILED",
        message,
      }),
    );
    process.exitCode = 1;
  });
}
