// EBC-R1.2-WS6-09 (Rad, Phase 1). Structural guardrail for DEC-R1.2-004 /
// RISK-R1.2-006, recommended by Archie (EBC-R1.2-WS6-03 §8, "add an
// automated guardrail test... that fails the build if either module ever
// imports the other"). This turns the geo-validation ↔ Journey Director
// separation from a reviewed policy into a build-time-enforced one.
//
// This is a static, textual check — it scans source files for import
// statements rather than importing them as TypeScript modules, so it has
// no compile-time dependency on either module's internals and cannot
// itself introduce the coupling it exists to prevent.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Matches every other verify*.ts script's own convention
// (verifyPresentationCatalogue.ts etc.): process.cwd() is web/, since
// every verify:* npm script runs from there.
const GEO_VALIDATION_DIR = join(process.cwd(), "lib", "geo-validation");
const JOURNEY_DIRECTOR_DIR = join(process.cwd(), "lib", "journey-director");

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`Verification failed: ${message}`);
}

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...listSourceFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Matches any import/export/require whose module specifier references the
// forbidden module, however it is reached — a relative path
// ("../geo-validation"), the "@/lib/..." alias, or a bare package-style
// reference — deliberately broad rather than narrowly matching one import
// style, since a narrow pattern is exactly what a future accidental import
// could slip past.
function referencesModule(source: string, moduleNameFragment: string): boolean {
  const pattern = new RegExp(
    `(?:import|export)[^;]*from\\s+["'][^"']*${moduleNameFragment}[^"']*["']|require\\(\\s*["'][^"']*${moduleNameFragment}[^"']*["']\\s*\\)`,
  );
  return pattern.test(source);
}

function runVerification() {
  const geoValidationFiles = listSourceFiles(GEO_VALIDATION_DIR);
  assert(geoValidationFiles.length > 0, "geo-validation module has at least one source file to check");

  for (const file of geoValidationFiles) {
    const source = readFileSync(file, "utf8");
    assert(
      !referencesModule(source, "journey-director"),
      `${file} must not import from web/lib/journey-director/** (DEC-R1.2-004 / RISK-R1.2-006)`,
    );
  }

  const journeyDirectorFiles = listSourceFiles(JOURNEY_DIRECTOR_DIR);
  assert(journeyDirectorFiles.length > 0, "journey-director module has at least one source file to check");

  for (const file of journeyDirectorFiles) {
    // journey-passport/entry-context.ts and other Passport-adjacent files
    // live outside this directory and are intentionally not scanned here —
    // this guardrail's job is the geo-validation ↔ journey-director
    // boundary specifically, not every file that happens to touch
    // destinations. See EBC-R1.2-WS6-03 §2.4 for the three integration
    // points this boundary is scoped to.
    const source = readFileSync(file, "utf8");
    assert(
      !referencesModule(source, "geo-validation"),
      `${file} must not import from web/lib/geo-validation/** (DEC-R1.2-004 / RISK-R1.2-006)`,
    );
  }

  console.log(`No geo-validation <-> journey-director coupling verification passed (${checks} checks).`);
  console.log(`Scanned ${geoValidationFiles.length} geo-validation file(s) and ${journeyDirectorFiles.length} journey-director file(s).`);
}

runVerification();
