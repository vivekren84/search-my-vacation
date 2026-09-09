/**
 * Assembles the full Bootstrap Workbook — Sheet 1 (Travel Regions),
 * Sheet 2 (Places), Sheet 3 (Curated Journeys, header-only per
 * EBC-R1.3-WS3-001 Section 4.3 Decision D4), and a Business Rules sheet
 * — into the `WorkbookSpec` shape `xlsxWriter.ts` consumes, applying the
 * Consolidated Ownership Matrix's cell styling (locked/generated,
 * unlocked/Product-owned, reserved) per EBC-R1.3-WS1-004 Section 6.
 */

import {
  SHEET1_CATEGORY_C_COLUMNS,
  SHEET1_COLUMNS,
  SHEET1_GENERATED_COLUMNS,
  SHEET1_RESERVED_COLUMNS,
  SHEET2_CATEGORY_C_COLUMNS,
  SHEET2_COLUMNS,
  SHEET2_GENERATED_COLUMNS,
  SHEET3_COLUMNS,
  type PlaceRow,
  type TravelRegionRow,
} from "./types.js";
import type { CellStyleName, WorkbookCell, WorkbookRow, WorkbookSheet, WorkbookSpec } from "./xlsxWriter.js";

const RESERVED_COLUMN_SET = new Set<string>(SHEET1_RESERVED_COLUMNS);

function styleForColumn(
  column: string,
  generatedColumns: ReadonlySet<string>,
  ownedStatusColumn: string,
): CellStyleName {
  if (RESERVED_COLUMN_SET.has(column)) return "reserved";
  if (generatedColumns.has(column)) return "locked-generated";
  if (column === ownedStatusColumn) return "unlocked-editable";
  return "unlocked-editable"; // Category C — Product-authored business content
}

function headerRow(columns: readonly string[]): WorkbookRow {
  return columns.map((column): WorkbookCell => ({ value: column, style: "header" }));
}

function cellFor(value: string | number | null, style: CellStyleName): WorkbookCell {
  return { value, style };
}

function travelRegionValue(row: TravelRegionRow, column: string): string | number | null {
  switch (column) {
    case "travelRegionId":
      return row.travelRegionId;
    case "name":
      return row.name;
    case "category":
      return row.category;
    case "country":
      return row.country;
    case "recordType":
      return row.recordType;
    case "kbSectionRef":
      return row.kbSectionRef;
    case "geoPlaceId":
      return row.geoPlaceId;
    case "matchScore":
      return row.matchScore;
    case "admin1Name":
      return row.admin1Name;
    case "admin2Name":
      return row.admin2Name;
    case "latitude":
      return row.latitude;
    case "longitude":
      return row.longitude;
    case "population":
      return row.population;
    case "existsInKB":
      return row.existsInKB;
    case "extractedAt":
      return row.extractedAt;
    case "kbStatus":
      return row.kbStatus;
    default:
      // Category C or Reserved — opaque, carried forward verbatim (or blank on first generation / never populated for Reserved).
      return row.productOwnedFields[column] ?? null;
  }
}

function placeValue(row: PlaceRow, column: string): string | number | null {
  switch (column) {
    case "placeId":
      return row.placeId;
    case "travelRegionId":
      return row.travelRegionId;
    case "name":
      return row.name;
    case "kbSectionRef":
      return row.kbSectionRef;
    case "geoPlaceId":
      return row.geoPlaceId;
    case "matchScore":
      return row.matchScore;
    case "placeType":
      return row.placeType;
    case "admin1Name":
      return row.admin1Name;
    case "admin2Name":
      return row.admin2Name;
    case "latitude":
      return row.latitude;
    case "longitude":
      return row.longitude;
    case "population":
      return row.population;
    case "existsInKB":
      return row.existsInKB;
    case "extractedAt":
      return row.extractedAt;
    case "status":
      return row.status;
    default:
      return row.productOwnedFields[column] ?? null;
  }
}

function buildTravelRegionsSheet(rows: readonly TravelRegionRow[]): WorkbookSheet {
  const generatedColumns = new Set<string>(SHEET1_GENERATED_COLUMNS);
  const dataRows: WorkbookRow[] = rows.map((row) =>
    SHEET1_COLUMNS.map((column) => cellFor(travelRegionValue(row, column), styleForColumn(column, generatedColumns, "kbStatus"))),
  );
  return { name: "Travel Regions", rows: [headerRow(SHEET1_COLUMNS as unknown as string[]), ...dataRows], protectSheet: true };
}

function buildPlacesSheet(rows: readonly PlaceRow[]): WorkbookSheet {
  const generatedColumns = new Set<string>(SHEET2_GENERATED_COLUMNS);
  const dataRows: WorkbookRow[] = rows.map((row) =>
    SHEET2_COLUMNS.map((column) => cellFor(placeValue(row, column), styleForColumn(column, generatedColumns, "status"))),
  );
  return { name: "Places", rows: [headerRow(SHEET2_COLUMNS as unknown as string[]), ...dataRows], protectSheet: true };
}

/** Header-only at bootstrap (EBC-R1.3-WS3-001 Section 4.3, Decision D4 — closed). Entirely Product-authored; no Category A/locked columns at all, so the sheet is left unprotected. */
function buildCuratedJourneysSheet(): WorkbookSheet {
  return { name: "Curated Journeys", rows: [headerRow(SHEET3_COLUMNS as unknown as string[])], protectSheet: false };
}

const BUSINESS_RULES_LINES: readonly string[] = [
  "Search My Vacation — Bootstrap Workbook — Business Rules",
  "",
  "1. Field ownership categories",
  "   Category A (Generated) — written fresh by the generator on every run. Grey fill, locked. Never hand-edit; any manual edit is overwritten on the next regeneration.",
  "   Category B (Generated-once, then Product-owned) — the generator seeds a starting value only the first time a row appears, then never writes it again. Unlocked. Applies to Sheet 1 kbStatus, and to Sheet 2 status for existsInKB = No rows (seeded \"Proposed\").",
  "   Category C (pure Product content) — the generator never writes these at all, on any run. Unlocked. Applies to every business/experiential column (primaryEmotion, themes, pace, comfort, signatureExperiences, tradeOffs, and the rest), and to Sheet 2 status for existsInKB = Yes rows.",
  "   Reserved (KB Section 7.5 future operational fields) — header present, cells intentionally blank until a future card populates them. Yellow fill, locked, marked distinctly from an in-scope-but-empty Category C field.",
  "",
  "2. Knowledge Base is the single source of truth for status",
  "   kbStatus (Sheet 1) and status (Sheet 2, for existsInKB = Yes rows) must always equal the Knowledge Base's own recorded value (DESTINATION-KNOWLEDGE-BASE.md Section 7.2). Product corrects this workbook to match the Knowledge Base — never the reverse.",
  "   The generator never assigns ACTIVE or COMING_SOON to any row. Both require a prior Knowledge Base decision.",
  "",
  "3. Sheet 2 status split",
  "   existsInKB = No (a newly-discovered candidate place, not yet in the Knowledge Base): status is Category B — the generator seeds \"Proposed\" once; Product owns it thereafter.",
  "   existsInKB = Yes (a place already documented in the Knowledge Base): status is Category C — pure Product ownership; the generator never seeds a value for this subset.",
  "",
  "4. Content completeness / lifecycle",
  "   Approved -> Operationally Authored -> Runtime Ready -> Presentation Ready -> Released. A row's presence in this workbook, even with kbStatus/status = ACTIVE, does not by itself make it runtime-eligible — Journey Director eligibility is governed by the Knowledge Base and the generated runtime artefacts (web/generated/*.json), not by this workbook directly.",
  "",
  "5. \"Travel Region\" terminology",
  "   A Travel Region is a Knowledge Base Destination or Collection (DESTINATION-KNOWLEDGE-BASE.md Section 7.3) — not a new business concept requiring separate governance.",
  "",
  "6. Regeneration safety",
  "   Running the generator again never deletes or overwrites a Category B/C/Reserved value already present in a prior copy of this workbook at the same output path. If a row's Category A identity changes upstream (e.g. a Knowledge Base rename), review the generator's Validation Report before treating the row as unchanged.",
];

function buildBusinessRulesSheet(): WorkbookSheet {
  const rows: WorkbookRow[] = BUSINESS_RULES_LINES.map((line) => [cellFor(line, "default")]);
  return { name: "Business Rules", rows, protectSheet: false };
}

export function buildWorkbookSpec(travelRegions: readonly TravelRegionRow[], places: readonly PlaceRow[]): WorkbookSpec {
  return {
    sheets: [
      buildTravelRegionsSheet(travelRegions),
      buildPlacesSheet(places),
      buildCuratedJourneysSheet(),
      buildBusinessRulesSheet(),
    ],
  };
}
