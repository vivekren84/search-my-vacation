/**
 * Minimal, dependency-free OOXML (.xlsx) writer.
 *
 * EBC-R1.3-WS1-007 (Rad). This project deliberately parses .xlsx files
 * without a dedicated xlsx library (`web/scripts/journey-intelligence/loadWorkbook.ts`
 * shells out to the system `unzip` binary and hand-parses the OOXML part
 * XML with small regex helpers) rather than adding `xlsx`/`exceljs` as a
 * dependency — consistent with Project Instructions Section 21 ("minimise
 * dependencies... the strongest possible justification for a new
 * dependency is not needing one", per `EBC-R1.2-WS6-03`'s own reasoning
 * for a different dependency decision). This writer follows the same
 * established pattern in reverse: hand-built OOXML part XML, zipped via
 * the system `zip` binary (the write-side counterpart to `unzip`), with no
 * new npm dependency. `EBC-R1.3-WS1-004` Section 6's requirement that
 * Category A ownership be carried as "actual Excel cell protection/
 * formatting metadata (locked cells, distinct fill colour), not only as
 * prose" is implemented here via real OOXML `<sheetProtection>` and
 * `cellXfs`/`protection` styling — not a cosmetic approximation.
 *
 * This is a genuinely new implementation decision (no prior write-side
 * OOXML precedent existed in this repository before this card), made
 * under Rad's ordinary engineering discretion per Project Instructions
 * Section 21 ("prefer existing patterns over unnecessary new
 * abstractions") rather than escalated as an architecture question,
 * because it adds no dependency and changes no existing behaviour. Noted
 * here, not silently, so Archie/Tiger can revisit the choice if a future
 * card needs OOXML features (rich formatting, formulas, comments) this
 * minimal writer does not support.
 *
 * Deliberately unsupported (would need a real library, which this
 * decision otherwise avoids): formulas, cell comments, conditional
 * formatting, merged cells, column auto-width. Sufficient for the
 * Bootstrap Workbook's own specification (plain data rows, per-cell
 * lock/fill styling, sheet protection) and nothing more is attempted.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, unlinkSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type CellStyleName =
  | "default"
  | "header"
  | "locked-generated"
  | "unlocked-editable"
  | "reserved";

export interface WorkbookCell {
  readonly value: string | number | null;
  readonly style?: CellStyleName;
}

export type WorkbookRow = readonly WorkbookCell[];

export interface WorkbookSheet {
  readonly name: string;
  readonly rows: readonly WorkbookRow[];
  /** Enables OOXML sheet protection so `locked`/`unlocked` cell styles actually take effect (Excel ignores cell-level locking on an unprotected sheet). Default true — every Bootstrap Workbook sheet is protected, per EBC-R1.3-WS1-004 Section 6. */
  readonly protectSheet?: boolean;
}

export interface WorkbookSpec {
  readonly sheets: readonly WorkbookSheet[];
}

const STYLE_INDEX: Readonly<Record<CellStyleName, number>> = {
  default: 0,
  header: 1,
  "locked-generated": 2,
  "unlocked-editable": 3,
  reserved: 4,
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function columnLetter(zeroBasedIndex: number): string {
  let index = zeroBasedIndex;
  let letters = "";
  do {
    letters = String.fromCharCode(65 + (index % 26)) + letters;
    index = Math.floor(index / 26) - 1;
  } while (index >= 0);
  return letters;
}

function contentTypesXml(sheetCount: number): string {
  const overrides = Array.from({ length: sheetCount }, (_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
${overrides}
</Types>`;
}

const ROOT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

function coreXml(createdIso: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:creator>Search My Vacation Bootstrap Generator</dc:creator>
<dcterms:created xsi:type="dcterms:W3CDTF">${createdIso}</dcterms:created>
<dcterms:modified xsi:type="dcterms:W3CDTF">${createdIso}</dcterms:modified>
</cp:coreProperties>`;
}

function appXml(sheetNames: readonly string[]): string {
  const titles = sheetNames.map((name) => `<vt:lpstr>${escapeXml(name)}</vt:lpstr>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
<Application>Search My Vacation Bootstrap Generator</Application>
<TitlesOfParts><vt:vector size="${sheetNames.length}" baseType="lpstr">${titles}</vt:vector></TitlesOfParts>
</Properties>`;
}

function workbookXml(sheets: readonly WorkbookSheet[]): string {
  const entries = sheets
    .map((sheet, index) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${entries}</sheets>
</workbook>`;
}

function workbookRelsXml(sheetCount: number): string {
  const sheetRels = Array.from(
    { length: sheetCount },
    (_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
  ).join("");
  const stylesRid = sheetCount + 1;
  const sharedStringsRid = sheetCount + 2;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheetRels}
<Relationship Id="rId${stylesRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId${sharedStringsRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;
}

// Fixed style palette. Index order must match STYLE_INDEX above exactly —
// cellXfs[STYLE_INDEX[name]] is the style referenced by every cell tagged
// with that name.
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="3">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
<font><i/><sz val="10"/><color rgb="FF808080"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE8E8E8"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyProtection="1"><protection locked="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyProtection="1"><protection locked="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="1" borderId="0" xfId="0" applyFill="1" applyProtection="1"><protection locked="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyProtection="1"><protection locked="0"/></xf>
<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFill="1" applyProtection="1"><protection locked="1"/></xf>
</cellXfs>
</styleSheet>`;

function sheetXml(sheet: WorkbookSheet, sharedStringIndex: Map<string, number>): string {
  let maxCol = 0;
  const rowsXml = sheet.rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      maxCol = Math.max(maxCol, row.length);
      const cellsXml = row
        .map((cell, colIndex) => {
          const ref = `${columnLetter(colIndex)}${rowNumber}`;
          const styleIndex = STYLE_INDEX[cell.style ?? "default"];
          // EBC-R1.3-WS1-009 (QA-2/QA-3 remediation): a blank cell must
          // still carry an explicit `<c>` element with its intended style
          // index. Excel applies a cell's *own* `s=` attribute only when a
          // `<c>` element exists for that reference; a genuinely absent
          // `<c>` (the previous behaviour here — this branch used to
          // `return ""` for null/empty values) falls back to the sheet's
          // default formatting, which is cellXfs index 0 ("default") —
          // itself `protection locked="1"`. Every Category B/C cell that
          // happened to be blank on a given run (i.e. every one of them,
          // before Product has curated anything) was silently inheriting
          // that locked default instead of its own column's unlocked
          // style, and every Reserved cell — always blank by design — was
          // silently losing its distinct fill for the same reason. A
          // self-closing `<c r="ref" s="styleIndex"/>` (no `<v>` child)
          // is valid OOXML for an empty-but-styled cell and fixes both.
          if (cell.value === null || cell.value === "") {
            return `<c r="${ref}" s="${styleIndex}"/>`;
          }
          if (typeof cell.value === "number") {
            return `<c r="${ref}" s="${styleIndex}"><v>${cell.value}</v></c>`;
          }
          const stringIndex = sharedStringIndex.get(cell.value);
          return `<c r="${ref}" t="s" s="${styleIndex}"><v>${stringIndex}</v></c>`;
        })
        .join("");
      return `<row r="${rowNumber}">${cellsXml}</row>`;
    })
    .join("");
  const dimensionRef = sheet.rows.length > 0 ? `A1:${columnLetter(Math.max(maxCol - 1, 0))}${sheet.rows.length}` : "A1";
  const protection = sheet.protectSheet === false ? "" : `<sheetProtection sheet="1" objects="1" scenarios="1" formatCells="0" formatColumns="0" formatRows="0" selectLockedCells="0" selectUnlockedCells="0"/>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="${dimensionRef}"/>
<sheetData>${rowsXml}</sheetData>
${protection}
</worksheet>`;
}

function sharedStringsXml(strings: readonly string[]): string {
  const items = strings.map((value) => `<si><t xml:space="preserve">${escapeXml(value)}</t></si>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
}

function collectSharedStrings(sheets: readonly WorkbookSheet[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const sheet of sheets) {
    for (const row of sheet.rows) {
      for (const cell of row) {
        if (typeof cell.value === "string" && cell.value !== "" && !index.has(cell.value)) {
          index.set(cell.value, index.size);
        }
      }
    }
  }
  return index;
}

/**
 * Writes `spec` to a real, Excel-openable .xlsx file at `outputPath`.
 * Builds the OOXML part tree in a scratch temp directory, then zips it
 * with the system `zip` binary (mirroring `loadWorkbook.ts`'s own use of
 * the system `unzip` binary for the read side) and moves the result into
 * place — an atomic replace (write-to-temp-then-rename), so a failed or
 * interrupted run never leaves a half-written workbook at `outputPath`.
 */
export function writeXlsxWorkbook(spec: WorkbookSpec, outputPath: string): void {
  if (spec.sheets.length === 0) {
    throw new Error("writeXlsxWorkbook: at least one sheet is required");
  }
  const sharedStringIndexMap = collectSharedStrings(spec.sheets);
  const sharedStrings = [...sharedStringIndexMap.keys()];
  const createdIso = new Date().toISOString();

  const scratchDir = mkdtempSync(join(tmpdir(), "smv-bootstrap-xlsx-"));
  try {
    mkdirSync(join(scratchDir, "_rels"));
    mkdirSync(join(scratchDir, "docProps"));
    mkdirSync(join(scratchDir, "xl", "_rels"), { recursive: true });
    mkdirSync(join(scratchDir, "xl", "worksheets"), { recursive: true });

    writeFileSync(join(scratchDir, "[Content_Types].xml"), contentTypesXml(spec.sheets.length));
    writeFileSync(join(scratchDir, "_rels", ".rels"), ROOT_RELS_XML);
    writeFileSync(join(scratchDir, "docProps", "core.xml"), coreXml(createdIso));
    writeFileSync(join(scratchDir, "docProps", "app.xml"), appXml(spec.sheets.map((sheet) => sheet.name)));
    writeFileSync(join(scratchDir, "xl", "workbook.xml"), workbookXml(spec.sheets));
    writeFileSync(join(scratchDir, "xl", "_rels", "workbook.xml.rels"), workbookRelsXml(spec.sheets.length));
    writeFileSync(join(scratchDir, "xl", "styles.xml"), STYLES_XML);
    writeFileSync(join(scratchDir, "xl", "sharedStrings.xml"), sharedStringsXml(sharedStrings));
    spec.sheets.forEach((sheet, index) => {
      writeFileSync(join(scratchDir, "xl", "worksheets", `sheet${index + 1}.xml`), sheetXml(sheet, sharedStringIndexMap));
    });

    const tempOutput = `${outputPath}.tmp-${process.pid}`;
    if (existsSync(tempOutput)) unlinkSync(tempOutput);
    // -X: no extra file attributes (deterministic-ish output); zip must run
    // with the scratch directory as cwd so archive paths are relative
    // ("[Content_Types].xml", not an absolute path).
    execFileSync("zip", ["-X", "-r", tempOutput, "."], { cwd: scratchDir, stdio: "pipe" });
    renameSync(tempOutput, outputPath);
  } finally {
    rmSync(scratchDir, { recursive: true, force: true });
  }
}
