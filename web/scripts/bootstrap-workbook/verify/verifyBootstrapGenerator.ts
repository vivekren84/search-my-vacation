/**
 * Offline verification harness for the Bootstrap Generator
 * (EBC-R1.3-WS1-007). Live Supabase access was not reachable from this
 * implementation session (see the Rad implementation report — no
 * outbound DNS/network route to Supabase from the device shell this card
 * was implemented through), so this harness is the substitute proof that
 * the generator's matching/merge/ownership logic is correct, using a
 * fixture `geo_places` dataset (`fixtureGeoPlaces.ts`) and a
 * dependency-injected fixture `fetch` (`createFixtureFetcher.ts`) in
 * place of a live database. It does NOT replace Keerthi's functional QA
 * against the real Supabase project — that remains required before this
 * card can be treated as fully validated (see acceptance criteria).
 *
 * Three checks, each a concrete, reproducible proof of one acceptance
 * criterion:
 *
 *   A. Reader/Writer round-trip — writeXlsxWorkbook() then
 *      readExistingWorkbook() on the same file recovers exactly the
 *      Category B/C values that were written, and never captures a
 *      Category A (generated) column as if it were Product-owned.
 *
 *   B. Regeneration safety — running buildTravelRegions()/buildPlaces()
 *      twice, with a simulated Product edit fed back in as "existing"
 *      data between the two runs, proves a Category B/C value a Product
 *      reviewer set is preserved on the next run while Category A fields
 *      (extractedAt, geo identity) are still freshly regenerated. This is
 *      the direct proof of this card's core acceptance criterion: "The
 *      generator can be executed repeatedly without loss of Product-owned
 *      data."
 *
 *   C. Full-pipeline smoke test — buildTravelRegions()/buildPlaces() run
 *      against the fixture repository for the real KB_APPROVED_PORTFOLIO/
 *      KB_REGION_GEO_SCOPES data (not a synthetic subset of those two —
 *      only the underlying geo_places fixture is synthetic), the result
 *      written to a real .xlsx via writeWorkbook.ts + xlsxWriter.ts, and
 *      the resulting file checked for structural validity (`zip -T`).
 *      Confirms every rule kind (country, admin1, explicit-seed) resolves
 *      and discovers new-candidate Places correctly end-to-end.
 *
 * Run with: npx tsc -p ../../../tsconfig.bootstrap-workbook.json && \
 *   node ../../../node_modules/.cache/smv-bootstrap-workbook/scripts/bootstrap-workbook/verify/verifyBootstrapGenerator.js
 */

import { execFileSync } from "node:child_process";
import { copyFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createBootstrapGeoRepository } from "../../../lib/geo-validation/bootstrapRepository.js";
import { buildPlaces } from "../buildPlaces.js";
import { buildTravelRegions } from "../buildTravelRegions.js";
import { readExistingWorkbook } from "../readExistingWorkbook.js";
import { buildWorkbookSpec } from "../writeWorkbook.js";
import { writeXlsxWorkbook } from "../xlsxWriter.js";
import { createFixtureFetcher } from "./createFixtureFetcher.js";

const FIXTURE_ENVIRONMENT = {
  NEXT_PUBLIC_SUPABASE_URL: "https://jbsefolhlfkplawiuvlu.supabase.co",
  SUPABASE_SECRET_KEY: "fixture-secret-key-not-real",
};

let failures = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function repository() {
  return createBootstrapGeoRepository(FIXTURE_ENVIRONMENT, createFixtureFetcher());
}

async function checkA_readerWriterRoundTrip(tempDir: string): Promise<void> {
  console.log("\n--- Check A: reader/writer round-trip ---");
  const spec = buildWorkbookSpec(
    [
      {
        travelRegionId: "kerala",
        name: "Kerala",
        category: "Domestic",
        country: "India",
        recordType: "Destination",
        kbSectionRef: "10.10",
        geoPlaceId: "fx-in-kerala",
        matchScore: 2.0,
        placeType: "state",
        admin1Name: "Kerala",
        admin2Name: null,
        latitude: 10.85,
        longitude: 76.27,
        population: 33_400_000,
        existsInKB: "Yes",
        extractedAt: "2026-01-01T00:00:00.000Z",
        kbStatus: "ACTIVE",
        productOwnedFields: { primaryEmotion: "Escape", themes: "Backwaters;Wellness" },
        geoScopeResolution: null,
      },
    ],
    [
      {
        placeId: "kerala--munnar",
        travelRegionId: "kerala",
        name: "Munnar",
        kbSectionRef: "10.10",
        geoPlaceId: "fx-in-kerala-munnar",
        matchScore: 2.0,
        placeType: "town",
        admin1Name: "Kerala",
        admin2Name: "Idukki",
        latitude: 10.09,
        longitude: 77.06,
        population: 68_000,
        existsInKB: "Yes",
        extractedAt: "2026-01-01T00:00:00.000Z",
        status: "ACTIVE",
        productOwnedFields: { primaryEmotion: "Awe", pace: "Relaxed" },
      },
    ],
  );
  const workbookPath = join(tempDir, "round-trip.xlsx");
  writeXlsxWorkbook(spec, workbookPath);

  const existing = await readExistingWorkbook(workbookPath);
  check("kbStatus read back for kerala", existing.kbStatusByTravelRegionId.get("kerala") === "ACTIVE");
  check(
    "Sheet 1 Category C fields read back verbatim",
    existing.productFieldsByTravelRegionId.get("kerala")?.primaryEmotion === "Escape" &&
      existing.productFieldsByTravelRegionId.get("kerala")?.themes === "Backwaters;Wellness",
  );
  check(
    "Sheet 1 generated columns NOT captured as product-owned",
    !("travelRegionId" in (existing.productFieldsByTravelRegionId.get("kerala") ?? {})) &&
      !("geoPlaceId" in (existing.productFieldsByTravelRegionId.get("kerala") ?? {})),
  );
  check("status read back for kerala--munnar", existing.statusByPlaceId.get("kerala--munnar") === "ACTIVE");
  check(
    "Sheet 2 Category C fields read back verbatim",
    existing.productFieldsByPlaceId.get("kerala--munnar")?.primaryEmotion === "Awe" &&
      existing.productFieldsByPlaceId.get("kerala--munnar")?.pace === "Relaxed",
  );

  const missingPath = join(tempDir, "does-not-exist.xlsx");
  const emptyResult = await readExistingWorkbook(missingPath);
  check(
    "missing prior workbook returns empty maps, not an error",
    emptyResult.kbStatusByTravelRegionId.size === 0 && emptyResult.statusByPlaceId.size === 0,
  );
}

async function checkB_regenerationSafety(): Promise<void> {
  console.log("\n--- Check B: regeneration safety (no loss of Product-owned data) ---");
  const repo = repository();

  // Run 1 — no prior data.
  const run1 = await buildTravelRegions(repo, "2026-01-01T00:00:00.000Z", new Map(), new Map());
  const kerala1 = run1.rows.find((row) => row.travelRegionId === "kerala");
  check("Run 1: kerala row produced", kerala1 !== undefined);
  check("Run 1: kbStatus seeded ACTIVE for new row", kerala1?.kbStatus === "ACTIVE");
  check(
    "Run 1: SHEET1_KB_STATUS_SEEDED finding recorded",
    run1.findings.some((finding) => finding.code === "SHEET1_KB_STATUS_SEEDED" && finding.travelRegionId === "kerala"),
  );

  // Simulate a Product reviewer's edit in Excel: corrected kbStatus, plus a
  // Category C business field filled in. Fed back in exactly the shape
  // readExistingWorkbook() would have produced from a real prior file.
  const editedKbStatus = new Map([["kerala", "COMING_SOON"]]);
  const editedProductFields = new Map([["kerala", { primaryEmotion: "Escape", lastReviewed: "2026-02-01" }]]);

  const run2 = await buildTravelRegions(repo, "2026-03-01T00:00:00.000Z", editedKbStatus, editedProductFields);
  const kerala2 = run2.rows.find((row) => row.travelRegionId === "kerala");
  check("Run 2: kerala row produced", kerala2 !== undefined);
  check("Run 2: Product's kbStatus correction preserved, not reset to ACTIVE", kerala2?.kbStatus === "COMING_SOON");
  check(
    "Run 2: Product's Category C fields preserved verbatim",
    kerala2?.productOwnedFields.primaryEmotion === "Escape" && kerala2?.productOwnedFields.lastReviewed === "2026-02-01",
  );
  check(
    "Run 2: Category A field (extractedAt) freshly regenerated, not carried forward",
    kerala2?.extractedAt === "2026-03-01T00:00:00.000Z",
  );
  check(
    "Run 2: no second SHEET1_KB_STATUS_SEEDED finding for an already-seeded row",
    !run2.findings.some((finding) => finding.code === "SHEET1_KB_STATUS_SEEDED" && finding.travelRegionId === "kerala"),
  );

  // Same proof, Sheet 2: a candidate place's Product-assigned status ("ACTIVE",
  // i.e. Product promoted it) must survive a regeneration exactly the same way.
  const placesRun1 = await buildPlaces(repo, "2026-01-01T00:00:00.000Z", new Map(), new Map());
  const newCandidate1 = placesRun1.rows.find((row) => row.travelRegionId === "kerala" && row.existsInKB === "No");
  check("Run 1: at least one new Kerala candidate discovered", newCandidate1 !== undefined);
  check("Run 1: new candidate status seeded Proposed", newCandidate1?.status === "Proposed");

  if (newCandidate1) {
    const editedStatus = new Map([[newCandidate1.placeId, "ACTIVE"]]);
    const editedFields = new Map([[newCandidate1.placeId, { primaryEmotion: "Curiosity" }]]);
    const placesRun2 = await buildPlaces(repo, "2026-03-01T00:00:00.000Z", editedStatus, editedFields);
    const sameCandidate2 = placesRun2.rows.find((row) => row.placeId === newCandidate1.placeId);
    check("Run 2: same candidate row still produced (stable placeId)", sameCandidate2 !== undefined);
    check("Run 2: Product's promotion to ACTIVE preserved, not reset to Proposed", sameCandidate2?.status === "ACTIVE");
    check(
      "Run 2: Product's Category C field on the candidate preserved",
      sameCandidate2?.productOwnedFields.primaryEmotion === "Curiosity",
    );
  }
}

async function checkC_fullPipelineSmokeTest(tempDir: string): Promise<void> {
  console.log("\n--- Check C: full-pipeline smoke test (real portfolio, fixture geo data) ---");
  const repo = repository();

  const travelRegions = await buildTravelRegions(repo, "2026-01-01T00:00:00.000Z", new Map(), new Map());
  const places = await buildPlaces(repo, "2026-01-01T00:00:00.000Z", new Map(), new Map());

  check("Sheet 1 covers all 24 real KB_APPROVED_PORTFOLIO rows", travelRegions.rows.length === 24, `got ${travelRegions.rows.length}`);

  const dubaiResolution = places.geoScopeResolutions.find((resolution) => resolution.travelRegionId === "dubai");
  check("Dubai (admin1 rule) resolved", dubaiResolution?.outcome === "resolved", JSON.stringify(dubaiResolution));

  const malaysiaResolution = places.geoScopeResolutions.find((resolution) => resolution.travelRegionId === "malaysia");
  check("Malaysia (country rule) resolved", malaysiaResolution?.outcome === "resolved", JSON.stringify(malaysiaResolution));
  check(
    "Malaysia candidate discovery found new fixture rows, excluding already-KB-known Langkawi",
    (malaysiaResolution?.candidatesDiscovered ?? 0) >= 2,
    JSON.stringify(malaysiaResolution),
  );

  const wildlifeResolution = places.geoScopeResolutions.find((resolution) => resolution.travelRegionId === "wildlife");
  // All 4 explicit-seed members (Kabini, Corbett, Bandipur, Masinagudi) are
  // ALREADY in KB_APPROVED_REGIONS (Source 1) — correctly excluded from
  // Source 2's "new candidate" count, per the anti-duplication design
  // (buildPlaces.ts's `excludeGeoPlaceIdsByTravelRegionId`). "resolved" with
  // 0 new candidates is the correct outcome here, not a shortfall.
  check(
    "Wildlife (explicit-seed rule) resolved with 0 new candidates (all 4 members already KB-known)",
    wildlifeResolution?.outcome === "resolved" && wildlifeResolution.candidatesDiscovered === 0,
    JSON.stringify(wildlifeResolution),
  );
  const wildlifeKnownRows = places.rows.filter((row) => row.travelRegionId === "wildlife" && row.existsInKB === "Yes");
  check(
    "All 4 Wildlife members present via KB_APPROVED_REGIONS (Source 1), not duplicated as new candidates",
    wildlifeKnownRows.length === 4 &&
      ["Kabini", "Corbett", "Bandipur", "Masinagudi"].every((name) => wildlifeKnownRows.some((row) => row.name === name)),
    JSON.stringify(wildlifeKnownRows.map((row) => row.name)),
  );

  const kashmirResolution = places.geoScopeResolutions.find((resolution) => resolution.travelRegionId === "kashmir");
  check(
    "Kashmir correctly withheld pending Vivek's sign-off (EBC-R1.3-WS1-006 Section 4.3), not silently resolved",
    kashmirResolution?.outcome === "pending-approval",
  );

  const keralaCandidates = places.rows.filter((row) => row.travelRegionId === "kerala" && row.existsInKB === "No");
  check(
    "Kerala new candidates found (Kannur, Kollam) and known KB places excluded from them",
    keralaCandidates.some((row) => row.name === "Kannur") &&
      keralaCandidates.some((row) => row.name === "Kollam") &&
      !keralaCandidates.some((row) => row.name === "Munnar"),
    JSON.stringify(keralaCandidates.map((row) => row.name)),
  );

  const knownMunnarRow = places.rows.find((row) => row.placeId === "kerala--munnar");
  check("Known KB place (Munnar) present via KB_APPROVED_REGIONS with existsInKB = Yes", knownMunnarRow?.existsInKB === "Yes");

  const spec = buildWorkbookSpec(travelRegions.rows, places.rows);
  const workbookPath = join(tempDir, "full-pipeline.xlsx");
  writeXlsxWorkbook(spec, workbookPath);
  try {
    execFileSync("zip", ["-T", workbookPath], { stdio: "pipe" });
    check("Written workbook passes zip integrity test (zip -T)", true);
  } catch (error) {
    check("Written workbook passes zip integrity test (zip -T)", false, error instanceof Error ? error.message : String(error));
  }

  // Copied outside tempDir (which this script deletes in its `finally`) so a
  // separate, independent openpyxl-based structural check (EBC-R1.3-WS1-009
  // QA-2/QA-3 remediation proof — a second tool reading the same file this
  // script's own TypeScript reader validated, so the proof isn't graded only
  // by code written in this same session) can inspect it afterward.
  const protectionCheckCopyPath = join(tmpdir(), "smv-ws1-009-protection-check.xlsx");
  copyFileSync(workbookPath, protectionCheckCopyPath);
  console.log(`\n[protection check copy] ${protectionCheckCopyPath}`);

  const readBack = await readExistingWorkbook(workbookPath);
  check(
    "Full-pipeline workbook is itself readable by readExistingWorkbook (round-trip on real portfolio data)",
    // Munnar's status cell is blank on a first-ever run (existsInKB = Yes rows
    // get no generator-seeded status, per EBC-R1.3-WS1-004 Section 4.2) — a
    // blank Excel cell is written as no cell at all (xlsxWriter.ts), so the
    // correct read-back is "no entry", i.e. undefined, not an empty string.
    readBack.kbStatusByTravelRegionId.get("kerala") === "ACTIVE" && readBack.statusByPlaceId.get("kerala--munnar") === undefined,
  );

  console.log(`\nSheet 1 rows: ${travelRegions.rows.length}, Sheet 2 rows: ${places.rows.length}`);
  console.log(`Findings — errors: ${[...travelRegions.findings, ...places.findings].filter((f) => f.severity === "error").length}, warnings: ${[...travelRegions.findings, ...places.findings].filter((f) => f.severity === "warning").length}`);
}

async function main(): Promise<void> {
  const tempDir = await mkdtemp(join(tmpdir(), "smv-bootstrap-verify-"));
  try {
    await checkA_readerWriterRoundTrip(tempDir);
    await checkB_regenerationSafety();
    await checkC_fullPipelineSmokeTest(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  if (failures > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
