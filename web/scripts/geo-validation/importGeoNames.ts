/**
 * EBC-R1.2-WS6-09 (Rad, Phase 1) — GeoNames import/filter pipeline.
 *
 * Populates geo_places / geo_aliases (supabase/migrations/
 * 20260823150000_geo_places_geo_aliases.sql) from a locally-downloaded
 * GeoNames extract, per EBC-R1.2-WS6-03 §5-6, §13 (Archie, Dataset
 * Investigation & Solution Architecture).
 *
 * NOT EXECUTED THIS SESSION. This script type-checks
 * (`npm run build:geo-validation-importer`) but has not been run against
 * real GeoNames data or a live database. Both the cloud build environment
 * and the connected local device were confirmed, this session, to have no
 * outbound network route to download.geonames.org (403 from the egress
 * proxy in both cases) — closing Risk R-1 (empirical alias/coverage
 * verification against the five named test cases: Vizag, Bangalore/
 * Bengaluru, Madras/Chennai, Kotagiri, Coorg/Kodagu) requires running this
 * from an environment with that access, which this session does not have.
 * See EBC-R1.2-WS6-09's Phase 1 completion report for the full account.
 *
 * Prerequisites to actually run this (documented here, not automated,
 * since acquiring them needs network access this session doesn't have):
 *   1. Download and unzip https://download.geonames.org/export/dump/allCountries.zip
 *   2. Download and unzip https://download.geonames.org/export/dump/alternateNames.zip
 *   3. Download https://download.geonames.org/export/dump/admin1CodesASCII.txt
 *   4. Download https://download.geonames.org/export/dump/admin2Codes.txt
 *   5. Set GEONAMES_ALLCOUNTRIES_PATH, GEONAMES_ALTERNATENAMES_PATH,
 *      GEONAMES_ADMIN1_PATH, GEONAMES_ADMIN2_PATH to the four files above.
 *   6. Set NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY (already present
 *      in web/.env.local for this project) in the shell that runs this.
 *
 * Filter scope (EBC-R1.2-WS6-03 §5): GeoNames feature classes P
 * (populated places) and A (administrative divisions) only. Landmark and
 * island place types are explicitly NOT populated by this script — per
 * Archie's design they come from "a small, explicit, hand-reviewed seed
 * list" (§5), which is a separate, future, product-content decision, not
 * an automated GeoNames extraction (GeoNames' landmark/terrain coverage
 * lives in other feature classes this script deliberately does not read).
 *
 * This script must never import from, or write anything that resembles,
 * web/lib/journey-director/** — it only ever touches geo_places/
 * geo_aliases. See web/lib/journey-director/validation/
 * verifyNoGeoValidationCoupling.ts.
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

import type { GeoAliasRow, GeoPlaceRow, RawAlternateName, RawGeonamesPlace } from "./types";

const EXPECTED_SUPABASE_URL = "https://jbsefolhlfkplawiuvlu.supabase.co";
const BATCH_SIZE = 500;

// ARCHIE-R1.2-WS3-AR-02 (Architecture Review, 29 Aug 2026), implemented
// under R1.2-WS3-IMP-07. This is an architectural correction, not a new
// implementation choice: EBC-R1.2-WS6-03 §5's original P/A feature-class
// filter specified no population/significance floor. Measured for the
// first time in production (R1.2-WS3-IMP-06 was the first successful bulk
// write into these tables), that unfiltered rule produced 3.7M+
// geo_places rows before geo_aliases even began, exhausting the Supabase
// project's disk allocation. 1,000 matches the "all-the-cities" floor
// Archie's review evaluated (EBC-R1.2-WS6-03 §3.5), which lands almost
// exactly inside the architecture's own original ~150,000-250,000-row
// estimate (138,398 cities worldwide at this floor). Applies to GeoNames
// feature class P (populated places) only, in readPlaces() below.
// Administrative divisions (feature class A) are deliberately NOT
// filtered by this constant — see ARCHIE-R1.2-WS3-AR-02 §4: A is already
// bounded by nature, and a legitimate small destination candidate (a
// district/region) should not be excluded by population.
const MIN_CITY_POPULATION = 1_000;

// Hand-reviewed alias overrides guaranteeing the five named acceptance-
// criteria cases (EBC-R1.2-WS6-01 FR-09 / AC-12) resolve correctly even if
// GeoNames' own alternateNames.txt coverage for a specific short form or
// colloquial name proves thin on inspection (EBC-R1.2-WS6-03 §11, Risk
// R-1). Resolved against the imported canonical name after the primary
// import completes, since GeoNames' own geonameid for each place is not
// known until the dataset is actually read.
const HAND_REVIEWED_ALIAS_OVERRIDES: {
  canonicalName: string;
  countryCode: string;
  aliasText: string;
  aliasType: GeoAliasRow["alias_type"];
}[] = [
  { canonicalName: "Bengaluru", countryCode: "IN", aliasText: "Bangalore", aliasType: "historic" },
  { canonicalName: "Chennai", countryCode: "IN", aliasText: "Madras", aliasType: "historic" },
  { canonicalName: "Visakhapatnam", countryCode: "IN", aliasText: "Vizag", aliasType: "abbreviation" },
  // Coorg/Kodagu: per EBC-R1.2-WS6-03 §9, "Coorg" is recommended as the
  // canonical display name (matching existing traveller-facing content),
  // with "Kodagu" as the alias — this override assumes GeoNames' own
  // canonical name for this district is "Kodagu"; if the actual import
  // finds otherwise, this row (and its canonicalName lookup) needs
  // adjusting by whoever runs the import. Flagged, not silently assumed.
  { canonicalName: "Kodagu", countryCode: "IN", aliasText: "Coorg", aliasType: "local_language" },
];

function readEnvOrExit(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`Missing required environment variable: ${name}`);
    console.error("See the prerequisites list at the top of this file.");
    process.exit(1);
  }
  return value.trim();
}

function mapFeatureToPlaceType(
  featureClass: string,
  featureCode: string,
  population: number,
): GeoPlaceRow["place_type"] | null {
  if (featureClass === "A") {
    if (featureCode === "PCLI" || featureCode === "PCLD" || featureCode === "PCLF" || featureCode === "PCLS") return "country";
    if (featureCode === "ADM1") return "state";
    if (featureCode === "ADM2") return "district";
    if (featureCode === "ADM3" || featureCode === "ADM4") return "region";
    return null;
  }
  if (featureClass === "P") {
    // No authoritative city/town threshold exists in GeoNames itself; this
    // is a documented, deliberate approximation (population >= 50,000 =>
    // "city"), not a GeoNames-provided classification. Rad/Archie should
    // revisit this threshold once the real import's distribution is
    // visible (Risk R-1 follow-up), rather than treating it as final.
    return population >= 50_000 ? "city" : "town";
  }
  return null;
}

async function* readTabSeparated(path: string): AsyncGenerator<string[]> {
  const stream = createReadStream(path, { encoding: "utf8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line || line.startsWith("#")) continue;
    yield line.split("\t");
  }
}

async function loadAdminCodeNames(path: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for await (const columns of readTabSeparated(path)) {
    const [code, name] = columns;
    if (code && name) map.set(code, name);
  }
  return map;
}

async function* readPlaces(
  allCountriesPath: string,
  admin1Names: Map<string, string>,
  admin2Names: Map<string, string>,
  stats: { skippedByPopulationThreshold: number; populatedPlacesImported: number },
): AsyncGenerator<GeoPlaceRow> {
  const nowIso = new Date().toISOString();
  for await (const columns of readTabSeparated(allCountriesPath)) {
    const raw: RawGeonamesPlace = {
      geonameid: columns[0] ?? "",
      name: columns[1] ?? "",
      asciiname: columns[2] ?? "",
      latitude: columns[4] ?? "",
      longitude: columns[5] ?? "",
      featureClass: columns[6] ?? "",
      featureCode: columns[7] ?? "",
      countryCode: columns[8] ?? "",
      admin1Code: columns[10] ?? "",
      admin2Code: columns[11] ?? "",
      population: columns[14] ?? "",
    };
    if (!raw.geonameid || !raw.name) continue;

    const population = Number.parseInt(raw.population, 10) || 0;
    const placeType = mapFeatureToPlaceType(raw.featureClass, raw.featureCode, population);
    if (!placeType) continue;

    // ARCHIE-R1.2-WS3-AR-02 / R1.2-WS3-IMP-07: population/significance
    // floor, feature class P ("populated places") only. Feature class A
    // (administrative divisions) never enters this branch and is
    // completely unaffected — see MIN_CITY_POPULATION's own comment.
    if (raw.featureClass === "P") {
      if (population < MIN_CITY_POPULATION) {
        stats.skippedByPopulationThreshold += 1;
        continue;
      }
      stats.populatedPlacesImported += 1;
    }

    const admin1Key = `${raw.countryCode}.${raw.admin1Code}`;
    const admin2Key = `${raw.countryCode}.${raw.admin1Code}.${raw.admin2Code}`;

    yield {
      id: raw.geonameid,
      name: raw.name,
      ascii_name: raw.asciiname || raw.name,
      place_type: placeType,
      country_code: raw.countryCode || null,
      admin1_name: admin1Names.get(admin1Key) ?? null,
      admin1_code: raw.admin1Code || null,
      admin2_name: admin2Names.get(admin2Key) ?? null,
      admin2_code: raw.admin2Code || null,
      latitude: raw.latitude ? Number.parseFloat(raw.latitude) : null,
      longitude: raw.longitude ? Number.parseFloat(raw.longitude) : null,
      population: population || null,
      feature_class: raw.featureClass,
      feature_code: raw.featureCode,
      source: "geonames",
      source_updated_at: nowIso,
    };
  }
}

async function* readAlternateNames(
  alternateNamesPath: string,
  knownPlaceIds: Set<string>,
): AsyncGenerator<GeoAliasRow> {
  for await (const columns of readTabSeparated(alternateNamesPath)) {
    const raw: RawAlternateName = {
      geonameid: columns[1] ?? "",
      isolanguage: columns[2] ?? "",
      alternateName: columns[3] ?? "",
      isPreferredName: columns[4] === "1",
      isShortName: columns[5] === "1",
      isHistoric: columns[7] === "1",
    };
    if (!raw.geonameid || !raw.alternateName || !knownPlaceIds.has(raw.geonameid)) continue;
    // Only historic and short-form alternate names become alias rows.
    // isPreferredName is deliberately not imported as an alias — per
    // EBC-R1.2-WS6-03 §9, the preferred name governs which form is
    // canonical (geo_places.name itself), not a second alias pointing
    // back at itself.
    if (raw.isHistoric) {
      yield { geo_place_id: raw.geonameid, alias_text: raw.alternateName, alias_type: "historic", locale: raw.isolanguage || null };
    } else if (raw.isShortName) {
      yield { geo_place_id: raw.geonameid, alias_text: raw.alternateName, alias_type: "short", locale: raw.isolanguage || null };
    }
  }
}

async function upsertBatch(
  projectUrl: string,
  secretKey: string,
  table: "geo_places" | "geo_aliases",
  rows: unknown[],
  conflictColumn: string,
) {
  if (rows.length === 0) return;
  // R1.2-WS3-IMP-06: was AbortSignal.timeout(30_000). The first batch POST
  // into a freshly created table (cold Supabase project + two new pg_trgm
  // GIN indexes maintaining on every insert) deterministically exceeded
  // 30s and aborted with DOMException[TimeoutError] before any row count
  // was ever logged. Raised to give real headroom; still bounded, not
  // unlimited, so a genuinely stuck connection is still caught.
  const response = await fetch(`${projectUrl}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Batch upsert into ${table} failed: ${response.status} ${body.slice(0, 500)}`);
  }
}

async function importPlaces(projectUrl: string, secretKey: string, allCountriesPath: string, admin1Names: Map<string, string>, admin2Names: Map<string, string>) {
  let batch: GeoPlaceRow[] = [];
  let total = 0;
  const knownPlaceIds = new Set<string>();
  // ARCHIE-R1.2-WS3-AR-02 / R1.2-WS3-IMP-07 evidence counters — populated
  // places (feature class P) only; see readPlaces().
  const stats = { skippedByPopulationThreshold: 0, populatedPlacesImported: 0 };

  for await (const place of readPlaces(allCountriesPath, admin1Names, admin2Names, stats)) {
    batch.push(place);
    knownPlaceIds.add(place.id);
    if (batch.length >= BATCH_SIZE) {
      await upsertBatch(projectUrl, secretKey, "geo_places", batch, "id");
      total += batch.length;
      batch = [];
    }
  }
  if (batch.length > 0) {
    await upsertBatch(projectUrl, secretKey, "geo_places", batch, "id");
    total += batch.length;
  }
  console.log(`GeoNames populated places skipped by population threshold: ${stats.skippedByPopulationThreshold}`);
  console.log(`GeoNames populated places imported: ${stats.populatedPlacesImported}`);
  console.log(`geo_places: imported ${total} rows.`);
  return knownPlaceIds;
}

async function importAliases(projectUrl: string, secretKey: string, alternateNamesPath: string, knownPlaceIds: Set<string>) {
  let batch: GeoAliasRow[] = [];
  let total = 0;

  for await (const alias of readAlternateNames(alternateNamesPath, knownPlaceIds)) {
    batch.push(alias);
    if (batch.length >= BATCH_SIZE) {
      await upsertBatch(projectUrl, secretKey, "geo_aliases", batch, "id");
      total += batch.length;
      batch = [];
    }
  }
  if (batch.length > 0) {
    await upsertBatch(projectUrl, secretKey, "geo_aliases", batch, "id");
    total += batch.length;
  }
  console.log(`geo_aliases (from GeoNames alternateNames.txt): imported ${total} rows.`);
}

async function applyHandReviewedOverrides(projectUrl: string, secretKey: string) {
  let applied = 0;
  for (const override of HAND_REVIEWED_ALIAS_OVERRIDES) {
    const lookup = await fetch(
      `${projectUrl}/rest/v1/geo_places?name=eq.${encodeURIComponent(override.canonicalName)}&country_code=eq.${override.countryCode}&select=id&limit=1`,
      { headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` }, signal: AbortSignal.timeout(10_000) },
    );
    if (!lookup.ok) continue;
    const rows: unknown = await lookup.json().catch(() => []);
    const geoPlaceId = Array.isArray(rows) && rows[0] && typeof rows[0] === "object" && "id" in rows[0] ? String((rows[0] as { id: unknown }).id) : null;
    if (!geoPlaceId) {
      console.warn(
        `Hand-reviewed alias override skipped — no geo_places row found for "${override.canonicalName}" (${override.countryCode}). ` +
          "Verify this canonical name against the actual imported dataset (EBC-R1.2-WS6-03 §11, Risk R-1).",
      );
      continue;
    }
    await upsertBatch(projectUrl, secretKey, "geo_aliases", [
      { geo_place_id: geoPlaceId, alias_text: override.aliasText, alias_type: override.aliasType, locale: null },
    ], "id");
    applied += 1;
  }
  console.log(`Hand-reviewed alias overrides applied: ${applied} of ${HAND_REVIEWED_ALIAS_OVERRIDES.length}.`);
}

async function main() {
  const allCountriesPath = readEnvOrExit("GEONAMES_ALLCOUNTRIES_PATH");
  const alternateNamesPath = readEnvOrExit("GEONAMES_ALTERNATENAMES_PATH");
  const admin1Path = readEnvOrExit("GEONAMES_ADMIN1_PATH");
  const admin2Path = readEnvOrExit("GEONAMES_ADMIN2_PATH");
  const projectUrl = readEnvOrExit("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const secretKey = readEnvOrExit("SUPABASE_SECRET_KEY");

  if (projectUrl !== EXPECTED_SUPABASE_URL) {
    console.error(`NEXT_PUBLIC_SUPABASE_URL does not match the expected project (${EXPECTED_SUPABASE_URL}). Refusing to import.`);
    process.exit(1);
  }

  console.log("Loading admin1/admin2 code-to-name lookups...");
  const [admin1Names, admin2Names] = await Promise.all([loadAdminCodeNames(admin1Path), loadAdminCodeNames(admin2Path)]);

  console.log("Importing geo_places (feature classes P, A only)...");
  const knownPlaceIds = await importPlaces(projectUrl, secretKey, allCountriesPath, admin1Names, admin2Names);

  console.log("Importing geo_aliases from GeoNames alternateNames.txt (historic/short only)...");
  await importAliases(projectUrl, secretKey, alternateNamesPath, knownPlaceIds);

  console.log("Applying hand-reviewed alias overrides (five named acceptance-criteria cases)...");
  await applyHandReviewedOverrides(projectUrl, secretKey);

  console.log("Import complete. Run `npm run verify:geo-validation-coupling` and spot-check the five named cases manually before treating Risk R-1 as closed.");
}

main().catch((error) => {
  console.error("GeoNames import failed:", error);
  process.exit(1);
});
