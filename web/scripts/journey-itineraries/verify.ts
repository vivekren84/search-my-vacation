import assert from "node:assert/strict";
import { readFile, readdir, mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { normalizeMonths, parseBoolean, parseDuration, splitSemicolon } from "./normalise.js";
import { buildGeneration, defaultOptions, runGeneration } from "./generate.js";
import { readWorkbook } from "./readWorkbook.js";
import { parseIndex, validateItinerary, validateUniqueness, validateWorkbookCatalogue } from "./validateItinerary.js";
import { RUNTIME_FILENAMES } from "./writeArtifacts.js";

async function files(path: string): Promise<string[]> {
  return (await readdir(path)).sort();
}

async function compareDirectories(left: string, right: string): Promise<void> {
  const names = await files(left);
  assert.deepEqual(names, await files(right));
  for (const name of names) assert.deepEqual(await readFile(join(left, name)), await readFile(join(right, name)), `${name} must be byte-identical`);
}

async function main(): Promise<void> {
  assert.deepEqual(parseDuration("5 Days / 4 Nights"), { display: "5 Days / 4 Nights", days: 5, nights: 4 });
  assert.deepEqual(parseDuration("5D/4N"), { display: "5D/4N", days: 5, nights: 4 });
  assert.equal(parseDuration("unknown"), undefined);
  assert.equal(parseBoolean("Yes"), true);
  assert.equal(parseBoolean("No"), false);
  assert.equal(parseBoolean("Y"), undefined);
  assert.deepEqual(splitSemicolon("Serenity; Wonder; serenity; Renewal"), ["Serenity", "Wonder", "Renewal"]);
  assert.deepEqual(normalizeMonths(["January", "february", "Monsoon"]), { months: ["January", "February"], unknown: ["Monsoon"] });

  const options = defaultOptions();
  const workbook = await readWorkbook(options.workbookPath);
  assert.equal(workbook.sheets.length, 52);
  const parsedIndex = parseIndex(workbook);
  assert.equal(parsedIndex.entries.length, 49);
  assert.equal(validateWorkbookCatalogue(workbook, parsedIndex.entries).length, 0);
  assert.equal(parsedIndex.entries.every((entry) => workbook.sheets.some((sheet) => sheet.name === entry.sheetName)), true);
  const duplicateEntries = [...parsedIndex.entries, { ...parsedIndex.entries[0], rowNumber: 999 }];
  assert.equal(validateWorkbookCatalogue(workbook, duplicateEntries).some((issue) => issue.code === "DUPLICATE_WORKSHEET_REFERENCE"), true);

  const built = await buildGeneration(options);
  assert.equal(built.artifacts.catalogue.records.length, 49);
  assert.equal(built.artifacts.manifest.totalWorkbookSheets, 52);
  assert.equal(built.artifacts.manifest.totalControlSheets, 3);
  assert.equal(built.artifacts.manifest.totalItinerarySheets, 49);
  assert.equal(built.artifacts.manifest.indexRows, 49);
  assert.equal(built.artifacts.validation.summary.ERROR, 0);
  const records = built.artifacts.catalogue.records;
  const candidateRecords = records.map((record) => ({ ...record, index: parsedIndex.entries.find((entry) => entry.sheetName === record.source.worksheet)! }));
  assert.equal(validateUniqueness([...candidateRecords, { ...candidateRecords[0], id: candidateRecords[1].id }]).some((issue) => issue.code === "DUPLICATE_RUNTIME_ID"), true);
  assert.equal(validateUniqueness([...candidateRecords, { ...candidateRecords[0], destinationCode: candidateRecords[1].destinationCode }]).some((issue) => issue.code === "DUPLICATE_DESTINATION_CODE"), true);
  const nonSequential = { ...candidateRecords[0], days: candidateRecords[0].days.map((day, index) => index === 1 ? { ...day, day: 3 } : day) };
  assert.equal(validateItinerary(nonSequential, []).some((issue) => issue.code === "NON_SEQUENTIAL_DAYS"), true);
  const durationConflict = { ...candidateRecords[0], index: { ...candidateRecords[0].index, duration: "7D/6N" } };
  assert.equal(validateItinerary(durationConflict, []).some((issue) => issue.code === "DURATION_CONFLICT"), true);
  const internalLeak = { ...candidateRecords[0], importantNotes: ["Internal use only"] };
  assert.equal(validateItinerary(internalLeak, []).some((issue) => issue.code === "INTERNAL_NOTE_IN_PUBLIC_CONTENT"), true);
  const strict = await buildGeneration({ ...options, approvedOnly: true });
  assert.equal(strict.artifacts.catalogue.records.length, 1);
  assert.equal(strict.artifacts.manifest.inclusionPolicy.mode, "approved-only");

  const root = await mkdtemp(join(tmpdir(), "smv-itinerary-determinism-"));
  try {
    const firstOutput = join(root, "first", "generated");
    const firstReports = join(root, "first", "reports");
    const secondOutput = join(root, "second", "generated");
    const secondReports = join(root, "second", "reports");
    await Promise.all([mkdir(firstOutput, { recursive: true }), mkdir(firstReports, { recursive: true }), mkdir(secondOutput, { recursive: true }), mkdir(secondReports, { recursive: true })]);
    await runGeneration({ ...options, outputDirectory: firstOutput, reportDirectory: firstReports });
    await runGeneration({ ...options, outputDirectory: secondOutput, reportDirectory: secondReports });
    await compareDirectories(firstOutput, secondOutput);
    await compareDirectories(firstReports, secondReports);
    assert.deepEqual(await files(firstOutput), [...RUNTIME_FILENAMES]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }

  const runtimeFiles = [
    resolve("lib/journey-itineraries/loader.ts"),
    resolve("lib/journey-itineraries/matcher.ts"),
    resolve("lib/journey-itineraries/index.ts"),
  ];
  for (const path of runtimeFiles) {
    const source = await readFile(path, "utf8");
    assert.equal(/fast-xml-parser|fflate|\.xlsx|readWorkbook/i.test(source), false, `${path} must not parse Excel at runtime`);
  }
  console.log(JSON.stringify({ status: "PASS", checks: 29, workbookSheets: 52, itinerarySheets: 49, deterministicExecutions: 2 }));
}

main().catch((error: unknown) => {
  console.error(JSON.stringify({ status: "FAILED", component: "JourneyItineraryVerification", message: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
});
