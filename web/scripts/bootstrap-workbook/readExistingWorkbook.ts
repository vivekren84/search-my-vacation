/**
 * Reads a previously-generated Bootstrap Workbook (if one exists at the
 * target output path) and extracts every Category B/C value the next
 * generation run must read forward, never overwrite. This is what makes
 * the generator "repeatable... without loss of Product-owned data"
 * (EBC-R1.3-WS1-007 acceptance criteria) rather than a one-shot tool.
 *
 * Design: rather than hardcoding a fixed allowlist of "Category C column
 * names to preserve", this reader treats every header it does NOT
 * recognise as a Category A (generated) column as opaque, Product-owned
 * data to carry forward verbatim — via `SHEET1_GENERATED_COLUMNS` /
 * `SHEET2_GENERATED_COLUMNS` (types.ts) as the only exclusion list. This
 * covers Category C columns, Reserved columns once a human starts using
 * them, and any future Product column added to the spec without a code
 * change here — a stronger guarantee than an allowlist that could quietly
 * drop a real value it doesn't yet know about.
 *
 * Parsing approach mirrors `../journey-intelligence/loadWorkbook.ts`
 * (shell out to the system `unzip`, hand-parse the OOXML part XML) rather
 * than importing that file directly — this module's input is the
 * Bootstrap Workbook's own shape (Sheet 1/2 headers defined in types.ts),
 * not the Journey Intelligence Enriched workbook's REQUIRED_SHEETS/
 * DESTINATION_INTELLIGENCE_HEADERS contract loadWorkbook.ts is built
 * around; a shared low-level XML reader was judged not worth extracting
 * for ~120 lines of straightforward regex parsing, under Rad's ordinary
 * engineering discretion (Project Instructions Section 21 — prefer
 * existing patterns, but do not force an unrelated contract to fit).
 */

import { execFileSync } from "node:child_process";
import { access } from "node:fs/promises";

import {
  SHEET1_GENERATED_COLUMNS,
  SHEET2_GENERATED_COLUMNS,
} from "./types.js";

export interface ExistingWorkbookData {
  readonly kbStatusByTravelRegionId: ReadonlyMap<string, string>;
  readonly productFieldsByTravelRegionId: ReadonlyMap<string, Readonly<Record<string, string>>>;
  readonly statusByPlaceId: ReadonlyMap<string, string>;
  readonly productFieldsByPlaceId: ReadonlyMap<string, Readonly<Record<string, string>>>;
}

export const EMPTY_EXISTING_WORKBOOK_DATA: ExistingWorkbookData = {
  kbStatusByTravelRegionId: new Map(),
  productFieldsByTravelRegionId: new Map(),
  statusByPlaceId: new Map(),
  productFieldsByPlaceId: new Map(),
};

const MAX_WORKBOOK_BYTES = 64 * 1024 * 1024;

type CellValue = string | number | null;

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function attribute(attributes: string, name: string): string | null {
  const match = attributes.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? decodeXml(match[1]) : null;
}

function unzipEntry(workbookPath: string, entry: string): string | null {
  try {
    return execFileSync("unzip", ["-p", workbookPath, entry], {
      encoding: "utf8",
      maxBuffer: MAX_WORKBOOK_BYTES,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
}

function sharedStrings(xml: string | null): string[] {
  if (!xml) return [];
  return [...xml.matchAll(/<(?:[A-Za-z0-9_]+:)?si\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?si>/g)].map((match) =>
    [...match[1].matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
      .map((text) => decodeXml(text[1]))
      .join(""),
  );
}

function columnIndex(reference: string): number {
  const letters = reference.match(/^[A-Z]+/)?.[0] ?? "";
  return (
    [...letters].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1
  );
}

function cellValue(attributes: string, body: string, strings: readonly string[]): CellValue {
  const type = attribute(attributes, "t");
  if (type === "inlineStr") {
    return [...body.matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
      .map((match) => decodeXml(match[1]))
      .join("");
  }
  const raw = body.match(/<(?:[A-Za-z0-9_]+:)?v\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?v>/)?.[1];
  if (raw === undefined) return null;
  const decoded = decodeXml(raw);
  if (type === "s") {
    const index = Number(decoded);
    return strings[index] ?? null;
  }
  const numeric = Number(decoded);
  return Number.isFinite(numeric) && decoded.trim() !== "" ? numeric : decoded;
}

function parseSheetRows(xml: string, strings: readonly string[]): CellValue[][] {
  const rows: CellValue[][] = [];
  for (const match of xml.matchAll(/<(?:[A-Za-z0-9_]+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?c>)/g)) {
    const reference = attribute(match[1], "r");
    if (!reference) continue;
    const rowNumber = Number(reference.match(/\d+$/)?.[0]);
    if (!Number.isInteger(rowNumber) || rowNumber < 1) continue;
    const rowIndex = rowNumber - 1;
    const colIndex = columnIndex(reference);
    rows[rowIndex] ??= [];
    rows[rowIndex][colIndex] = cellValue(match[1], match[2] ?? "", strings);
  }
  return rows.map((row) => row ?? []);
}

function relationshipTargets(xml: string): Map<string, string> {
  const targets = new Map<string, string>();
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const id = attribute(match[1], "Id");
    const target = attribute(match[1], "Target");
    if (!id || !target) continue;
    targets.set(id, target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\//, "")}`);
  }
  return targets;
}

/** Locates one sheet's row data by its visible name (e.g. "Travel Regions"), or null if the workbook has no such sheet. */
function findSheetRows(workbookPath: string, sheetName: string): CellValue[][] | null {
  const workbookXml = unzipEntry(workbookPath, "xl/workbook.xml");
  const relsXml = unzipEntry(workbookPath, "xl/_rels/workbook.xml.rels");
  if (!workbookXml || !relsXml) return null;
  const targets = relationshipTargets(relsXml);
  const sheetMatch = [...workbookXml.matchAll(/<(?:[A-Za-z0-9_]+:)?sheet\b([^>]*)\/?>/g)].find(
    (match) => attribute(match[1], "name") === sheetName,
  );
  const relationshipId = sheetMatch ? attribute(sheetMatch[1], "r:id") : null;
  const target = relationshipId ? targets.get(relationshipId) : null;
  if (!target) return null;
  const sheetXml = unzipEntry(workbookPath, target);
  if (!sheetXml) return null;
  const strings = sharedStrings(unzipEntry(workbookPath, "xl/sharedStrings.xml"));
  return parseSheetRows(sheetXml, strings);
}

function asHeaderRow(rows: readonly CellValue[][]): string[] {
  return (rows[0] ?? []).map((value) => (value === null ? "" : String(value).trim()));
}

function extractTable(
  rows: readonly CellValue[][],
  primaryKeyColumn: string,
  ownedStatusColumn: string,
  generatedColumns: readonly string[],
): { statusById: Map<string, string>; productFieldsById: Map<string, Record<string, string>> } {
  const headers = asHeaderRow(rows);
  const primaryKeyIndex = headers.indexOf(primaryKeyColumn);
  const statusById = new Map<string, string>();
  const productFieldsById = new Map<string, Record<string, string>>();
  if (primaryKeyIndex === -1) {
    // No recognisable primary-key column — treat as "nothing to read forward"
    // rather than guessing at a column layout from an older/foreign file.
    return { statusById, productFieldsById };
  }
  const generatedSet = new Set<string>(generatedColumns);
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] ?? [];
    const id = row[primaryKeyIndex];
    if (id === null || id === undefined || String(id).trim() === "") continue;
    const idString = String(id).trim();
    const productFields: Record<string, string> = {};
    headers.forEach((header, columnIndexValue) => {
      if (!header || generatedSet.has(header)) return;
      const value = row[columnIndexValue];
      const stringValue = value === null || value === undefined ? "" : String(value);
      if (header === ownedStatusColumn) {
        if (stringValue !== "") statusById.set(idString, stringValue);
        return;
      }
      if (stringValue !== "") productFields[header] = stringValue;
    });
    if (Object.keys(productFields).length > 0) {
      productFieldsById.set(idString, productFields);
    }
  }
  return { statusById, productFieldsById };
}

/**
 * Reads `workbookPath` if it exists and returns every Category B/C value
 * the next generation run must preserve. Returns `EMPTY_EXISTING_WORKBOOK_DATA`
 * — not an error — when there is no prior workbook (first-ever generation
 * run), or when the file exists but has no recognisable "Travel Regions"/
 * "Places" sheet (e.g. a foreign or corrupted file at that path; the
 * caller's generation report should surface this as a warning, not fail
 * the run silently).
 */
export async function readExistingWorkbook(workbookPath: string): Promise<ExistingWorkbookData> {
  try {
    await access(workbookPath);
  } catch {
    return EMPTY_EXISTING_WORKBOOK_DATA;
  }

  const travelRegionRows = findSheetRows(workbookPath, "Travel Regions");
  const placeRows = findSheetRows(workbookPath, "Places");

  const travelRegionTable = travelRegionRows
    ? extractTable(travelRegionRows, "travelRegionId", "kbStatus", SHEET1_GENERATED_COLUMNS)
    : { statusById: new Map<string, string>(), productFieldsById: new Map<string, Record<string, string>>() };
  const placeTable = placeRows
    ? extractTable(placeRows, "placeId", "status", SHEET2_GENERATED_COLUMNS)
    : { statusById: new Map<string, string>(), productFieldsById: new Map<string, Record<string, string>>() };

  return {
    kbStatusByTravelRegionId: travelRegionTable.statusById,
    productFieldsByTravelRegionId: travelRegionTable.productFieldsById,
    statusByPlaceId: placeTable.statusById,
    productFieldsByPlaceId: placeTable.productFieldsById,
  };
}
