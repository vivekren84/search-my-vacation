import { readFile } from "node:fs/promises";
import { basename } from "node:path";

import { XMLParser } from "fast-xml-parser";
import { strFromU8, unzipSync } from "fflate";

import { sha256 } from "./normalise.js";
import type { CellValue, SheetRows, WorkbookSheet, WorkbookSource } from "./types.js";

type XmlValue = string | number | Record<string, unknown> | Array<unknown> | undefined;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  trimValues: false,
  removeNSPrefix: true,
});

function array<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function xmlText(value: XmlValue): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((item) => xmlText(item as XmlValue)).join("");
  if (typeof value === "object") {
    if ("#text" in value) return xmlText(value["#text"] as XmlValue);
    if ("t" in value) return xmlText(value.t as XmlValue);
    if ("r" in value) return xmlText(value.r as XmlValue);
  }
  return "";
}

function requiredEntry(zip: Record<string, Uint8Array>, path: string): Uint8Array {
  const entry = zip[path];
  if (!entry) throw new Error(`Workbook entry is missing: ${path}`);
  return entry;
}

function parseEntry(zip: Record<string, Uint8Array>, path: string): Record<string, unknown> {
  return parser.parse(strFromU8(requiredEntry(zip, path))) as Record<string, unknown>;
}

function sharedStrings(zip: Record<string, Uint8Array>): string[] {
  if (!zip["xl/sharedStrings.xml"]) return [];
  const parsed = parseEntry(zip, "xl/sharedStrings.xml") as {
    sst?: { si?: Array<Record<string, unknown>> | Record<string, unknown> };
  };
  return array(parsed.sst?.si).map((item) => xmlText(item));
}

function columnIndex(reference: string): number {
  const letters = reference.match(/^[A-Z]+/i)?.[0].toUpperCase() ?? "A";
  return [...letters].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function cellValue(cell: Record<string, unknown>, strings: string[]): CellValue {
  const type = String(cell["@_t"] ?? "n");
  const raw = cell.v;
  if (type === "inlineStr") return xmlText(cell.is as XmlValue);
  if (type === "s") return strings[Number(xmlText(raw as XmlValue))] ?? "";
  if (type === "str") return xmlText(raw as XmlValue);
  if (type === "b") return xmlText(raw as XmlValue) === "1";
  if (type === "e") return xmlText(raw as XmlValue);
  const value = xmlText(raw as XmlValue);
  if (value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
}

function worksheetRows(document: Record<string, unknown>, strings: string[]): SheetRows {
  const worksheet = document.worksheet as { sheetData?: { row?: unknown } } | undefined;
  const rows: SheetRows = [];
  for (const row of array(worksheet?.sheetData?.row as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    const rowNumber = Number(row["@_r"] ?? rows.length + 1);
    const values: CellValue[] = [];
    for (const cell of array(row.c as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
      const index = columnIndex(String(cell["@_r"] ?? "A1"));
      values[index] = cellValue(cell, strings);
    }
    while (values.length > 0 && (values.at(-1) === null || values.at(-1) === undefined)) values.pop();
    rows[rowNumber - 1] = values;
  }
  return Array.from({ length: rows.length }, (_, index) => rows[index] ?? []);
}

function resolveSheetPath(target: string): string {
  const normalized = target.replace(/^\//, "").replace(/^\.\.\//, "");
  return normalized.startsWith("xl/") ? normalized : `xl/${normalized}`;
}

export async function readWorkbook(path: string): Promise<WorkbookSource> {
  const bytes = await readFile(path);
  const zip = unzipSync(new Uint8Array(bytes));
  const workbook = parseEntry(zip, "xl/workbook.xml") as {
    workbook?: { sheets?: { sheet?: unknown } };
  };
  const relationships = parseEntry(zip, "xl/_rels/workbook.xml.rels") as {
    Relationships?: { Relationship?: unknown };
  };
  const targets = new Map(
    array(relationships.Relationships?.Relationship as Record<string, unknown> | Record<string, unknown>[] | undefined)
      .map((relationship) => [String(relationship["@_Id"]), resolveSheetPath(String(relationship["@_Target"]))] as const),
  );
  const strings = sharedStrings(zip);
  const sheets: WorkbookSheet[] = array(
    workbook.workbook?.sheets?.sheet as Record<string, unknown> | Record<string, unknown>[] | undefined,
  ).map((sheet) => {
    const name = String(sheet["@_name"] ?? "");
    const relationshipId = String(sheet["@_id"] ?? "");
    const target = targets.get(relationshipId);
    if (!name || !target) throw new Error(`Workbook sheet relationship could not be resolved: ${name || relationshipId}`);
    return { name, rows: worksheetRows(parseEntry(zip, target), strings) };
  });
  return { filename: basename(path), sha256: sha256(bytes), sheets };
}
