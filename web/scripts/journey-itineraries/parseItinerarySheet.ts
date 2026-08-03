import type { SuggestedItinerary } from "../../lib/journey-itineraries/types.js";
import { ITINERARY_MAPPING_BY_CODE } from "./mappingConfig.js";
import {
  excelDateToIso,
  normalizeMonths,
  normalizedKey,
  parseBoolean,
  parseDuration,
  slugify,
  splitSemicolon,
  text,
  unique,
} from "./normalise.js";
import type {
  CellValue,
  IndexEntry,
  ParsedItinerary,
  ValidationIssue,
  WorkbookSheet,
} from "./types.js";

const SECTION_PATTERN = /^section\s+([a-i])\b/i;
const SUMMARY_LABELS = [
  "Destination", "Region", "Suggested Duration", "Ideal Traveller Types",
  "Ideal Emotions", "Best Season", "Pace", "Difficulty", "Family Friendly",
  "Couple Friendly", "Senior Friendly", "Child Friendly", "Customisable (Yes/No)",
] as const;
const METADATA_LABELS = [
  "Destination Code", "Region Code", "Primary Emotion Tags", "Experience Tags",
  "Companion Types", "Suggested Months", "Related Destinations", "Revision Number",
  "Last Updated", "Prepared By",
] as const;

function nonEmptyValue(row: CellValue[], start = 1): CellValue | undefined {
  return row.slice(start).find((value) => text(value) !== "");
}

function sectionRows(sheet: WorkbookSheet): Record<string, number> {
  const sections: Record<string, number> = {};
  sheet.rows.forEach((row, index) => {
    const match = text(row[0]).match(SECTION_PATTERN);
    if (match) sections[match[1].toUpperCase()] = index;
  });
  return sections;
}

function labelledValues(sheet: WorkbookSheet, start: number, end: number): Map<string, CellValue> {
  const result = new Map<string, CellValue>();
  sheet.rows.slice(start + 1, end).forEach((row) => {
    const label = text(row[0]);
    if (label) result.set(normalizedKey(label), nonEmptyValue(row) ?? null);
  });
  return result;
}

function valueFor(values: Map<string, CellValue>, label: string): CellValue | undefined {
  return values.get(normalizedKey(label));
}

function listRows(sheet: WorkbookSheet, start: number, end: number, issues: ValidationIssue[]): string[] {
  return sheet.rows.slice(start + 1, end).flatMap((row) => {
    const first = text(row[0]);
    const second = text(nonEmptyValue(row));
    const isMarker = /^[•☐☒□☑✓✔-]$/.test(first);
    if (isMarker && !second) issues.push({ severity: "ERROR", code: "BLANK_BULLET_TEXT", message: "A list marker has no guest-facing text", worksheet: sheet.name });
    const value = isMarker ? second : first || second;
    return value ? [value.trim()] : [];
  });
}

function requiredText(
  values: Map<string, CellValue>,
  label: string,
  worksheet: string,
  issues: ValidationIssue[],
): string {
  const value = text(valueFor(values, label));
  if (!value) issues.push({ severity: "ERROR", code: "MISSING_REQUIRED_FIELD", message: `${label} is required`, worksheet, field: label });
  return value;
}

function requiredBoolean(
  values: Map<string, CellValue>,
  label: string,
  worksheet: string,
  issues: ValidationIssue[],
): boolean {
  const raw = text(valueFor(values, label));
  const value = parseBoolean(raw);
  if (value === undefined) issues.push({ severity: "ERROR", code: "INVALID_BOOLEAN", message: `${label} must be Yes or No; received ${raw || "blank"}`, worksheet, field: label });
  return value ?? false;
}

function canonicalBase(value: string): string {
  const cleaned = value.replace(/\([^)]*\)/g, "").trim();
  const key = normalizedKey(cleaned);
  const replacements: Record<string, string> = {
    cochin: "Kochi",
    alappuzha: "Alleppey",
    bangalore: "Bengaluru",
    udhagamandalam: "Ooty",
    "phu quoc island": "Phu Quoc",
    "jim corbett national park": "Corbett",
  };
  return replacements[key] ?? cleaned;
}

function journeyBases(destination: string): string[] {
  return unique(
    destination
      .replace(/\([^)]*\)/g, "")
      .split(/\s*(?:,|&|\+|\/)\s*/)
      .map(canonicalBase)
      .filter(Boolean),
  );
}

function parseDays(
  sheet: WorkbookSheet,
  start: number,
  end: number,
  issues: ValidationIssue[],
): SuggestedItinerary["days"] {
  const header = sheet.rows.findIndex((row, index) => index > start && index < end && normalizedKey(text(row[0])) === "day");
  if (header < 0) {
    issues.push({ severity: "ERROR", code: "MISSING_DAY_HEADER", message: "Day-by-day header row is missing", worksheet: sheet.name });
    return [];
  }
  return sheet.rows.slice(header + 1, end).flatMap((row) => {
    if (text(row[0]) === "" && row.every((value) => text(value) === "")) return [];
    const day = Number(row[0]);
    if (!Number.isInteger(day)) {
      issues.push({ severity: "ERROR", code: "INVALID_DAY_NUMBER", message: `Day value is not an integer: ${text(row[0])}`, worksheet: sheet.name });
      return [];
    }
    const overnightStay = text(row[1]);
    const suggestedExperience = text(row[2]);
    const meals = text(row[3]);
    const notes = text(row[4]);
    return [{
      day,
      overnightStay,
      suggestedExperience,
      ...(meals && meals !== "—" ? { meals } : {}),
      ...(notes ? { notes } : {}),
    }];
  });
}

function routeTitleFallback(index: IndexEntry): string {
  return `${index.destination} — Suggested ${index.duration} Journey`;
}

export function parseItinerarySheet(
  workbookFilename: string,
  sheet: WorkbookSheet,
  index: IndexEntry,
): { itinerary: ParsedItinerary; issues: ValidationIssue[]; unknownMonths: string[] } {
  const issues: ValidationIssue[] = [];
  const sections = sectionRows(sheet);
  for (const section of "ABCDEFGHI") {
    if (sections[section] === undefined) issues.push({ severity: "ERROR", code: "MISSING_SECTION", message: `Section ${section} is missing`, worksheet: sheet.name });
  }
  const a = sections.A ?? 0;
  const b = sections.B ?? sheet.rows.length;
  const c = sections.C ?? sheet.rows.length;
  const d = sections.D ?? sheet.rows.length;
  const e = sections.E ?? sheet.rows.length;
  const f = sections.F ?? sheet.rows.length;
  const g = sections.G ?? sheet.rows.length;
  const h = sections.H ?? sheet.rows.length;
  const i = sections.I ?? sheet.rows.length;
  const summary = labelledValues(sheet, a, b);
  const metadata = labelledValues(sheet, i, sheet.rows.length);
  SUMMARY_LABELS.forEach((label) => requiredText(summary, label, sheet.name, issues));
  METADATA_LABELS.forEach((label) => requiredText(metadata, label, sheet.name, issues));

  const durationText = requiredText(summary, "Suggested Duration", sheet.name, issues);
  const duration = parseDuration(durationText);
  if (!duration) issues.push({ severity: "ERROR", code: "INVALID_DURATION", message: `Suggested Duration cannot be parsed: ${durationText || "blank"}`, worksheet: sheet.name, field: "Suggested Duration" });
  const destinationCode = requiredText(metadata, "Destination Code", sheet.name, issues);
  const mapping = ITINERARY_MAPPING_BY_CODE[destinationCode];
  if (!mapping) issues.push({ severity: "REVIEW_REQUIRED", code: "UNGOVERNED_RUNTIME_ID", message: `No governed stable ID mapping exists for ${destinationCode}; a deterministic fallback was used`, worksheet: sheet.name });
  const rawMonths = splitSemicolon(requiredText(metadata, "Suggested Months", sheet.name, issues));
  const monthResult = normalizeMonths(rawMonths);
  const revision = Number(valueFor(metadata, "Revision Number"));
  if (!Number.isFinite(revision)) issues.push({ severity: "ERROR", code: "INVALID_REVISION", message: "Revision Number must be numeric", worksheet: sheet.name, field: "Revision Number" });
  const runtimeId = mapping?.id ?? slugify(`${index.region}-${index.destination}`);
  const title = text(sheet.rows[0]?.[0]) || routeTitleFallback(index);
  if (!text(sheet.rows[0]?.[0])) issues.push({ severity: "ERROR", code: "MISSING_WORKSHEET_TITLE", message: "Worksheet title is required", worksheet: sheet.name });
  const introduction = text(sheet.rows[1]?.[0]);

  const itinerary: ParsedItinerary = {
    id: runtimeId,
    destinationCode,
    regionCode: requiredText(metadata, "Region Code", sheet.name, issues),
    source: {
      workbook: workbookFilename,
      worksheet: sheet.name,
      indexRow: index.rowNumber,
      revision: Number.isFinite(revision) ? revision : 0,
      lastUpdated: excelDateToIso(valueFor(metadata, "Last Updated")),
      preparedBy: requiredText(metadata, "Prepared By", sheet.name, issues),
      status: index.status ?? "draft",
    },
    destination: {
      displayName: index.destination,
      regionDisplayName: index.region,
      ...(mapping?.parentDestination ? { parentDestination: mapping.parentDestination } : {}),
      journeyBases: journeyBases(requiredText(summary, "Destination", sheet.name, issues)),
    },
    summary: {
      title,
      ...(introduction ? { introduction } : {}),
      suggestedDuration: duration ?? { display: durationText, days: 0, nights: 0 },
      idealTravellerTypes: splitSemicolon(requiredText(summary, "Ideal Traveller Types", sheet.name, issues)),
      idealEmotions: splitSemicolon(requiredText(summary, "Ideal Emotions", sheet.name, issues)),
      bestSeason: requiredText(summary, "Best Season", sheet.name, issues),
      pace: requiredText(summary, "Pace", sheet.name, issues),
      difficulty: requiredText(summary, "Difficulty", sheet.name, issues),
      familyFriendly: requiredBoolean(summary, "Family Friendly", sheet.name, issues),
      coupleFriendly: requiredBoolean(summary, "Couple Friendly", sheet.name, issues),
      seniorFriendly: requiredBoolean(summary, "Senior Friendly", sheet.name, issues),
      childFriendly: requiredBoolean(summary, "Child Friendly", sheet.name, issues),
      customisable: requiredBoolean(summary, "Customisable (Yes/No)", sheet.name, issues),
    },
    highlights: listRows(sheet, b, c, issues),
    days: parseDays(sheet, c, d, issues),
    normallyIncludes: listRows(sheet, d, e, issues),
    normallyExcludes: listRows(sheet, e, f, issues),
    optionalExperiences: listRows(sheet, f, g, issues),
    importantNotes: listRows(sheet, g, h, issues),
    customisationIdeas: listRows(sheet, h, i, issues),
    matching: {
      primaryEmotionTags: splitSemicolon(requiredText(metadata, "Primary Emotion Tags", sheet.name, issues)),
      experienceTags: splitSemicolon(requiredText(metadata, "Experience Tags", sheet.name, issues)),
      companionTypes: splitSemicolon(requiredText(metadata, "Companion Types", sheet.name, issues)),
      suggestedMonths: monthResult.months,
      relatedDestinations: splitSemicolon(text(valueFor(metadata, "Related Destinations"))),
      journeyDirectorCandidateIds: mapping?.journeyDirectorCandidateIds ?? [],
      journeyDirectorRegionIds: mapping?.journeyDirectorRegionIds ?? [],
    },
    index,
  };
  return { itinerary, issues, unknownMonths: monthResult.unknown };
}
