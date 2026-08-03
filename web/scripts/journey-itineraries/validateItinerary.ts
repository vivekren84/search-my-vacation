import type { ItineraryStatus } from "../../lib/journey-itineraries/types.js";
import { ITINERARY_MAPPING_BY_CODE } from "./mappingConfig.js";
import { normalizedKey, parseDuration } from "./normalise.js";
import type {
  IndexEntry,
  ParsedItinerary,
  ValidationIssue,
  WorkbookSource,
} from "./types.js";

export const CONTROL_SHEETS = ["README", "INDEX", "TEMPLATE"] as const;
export const EXPECTED_WORKSHEET_COUNT = 52;
export const EXPECTED_ITINERARY_COUNT = 49;
export const VALID_STATUSES: ItineraryStatus[] = ["draft", "review", "approved", "archived"];

function issue(severity: ValidationIssue["severity"], code: string, message: string, itinerary?: ParsedItinerary, field?: string): ValidationIssue {
  return { severity, code, message, ...(itinerary ? { worksheet: itinerary.source.worksheet, runtimeId: itinerary.id } : {}), ...(field ? { field } : {}) };
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicate = new Set<string>();
  values.forEach((value) => {
    const key = normalizedKey(value);
    if (seen.has(key)) duplicate.add(value);
    seen.add(key);
  });
  return [...duplicate];
}

export function parseIndex(workbook: WorkbookSource): { entries: IndexEntry[]; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const index = workbook.sheets.find((sheet) => sheet.name === "INDEX");
  if (!index) return { entries: [], issues: [{ severity: "ERROR", code: "MISSING_INDEX", message: "INDEX control sheet is missing" }] };
  const expected = ["destination", "region", "sheet name", "duration", "status", "last updated", "notes"];
  const header = index.rows.findIndex((row) => expected.every((label, column) => normalizedKey(String(row?.[column] ?? "")) === label));
  if (header < 0) return { entries: [], issues: [{ severity: "ERROR", code: "INVALID_INDEX_HEADER", message: "INDEX columns do not match the required schema" }] };
  const entries = index.rows.slice(header + 1).flatMap((row, offset) => {
    if (row.slice(0, 7).every((value) => String(value ?? "").trim() === "")) return [];
    const rawStatus = String(row[4] ?? "").trim();
    const normalizedStatus = normalizedKey(rawStatus) as ItineraryStatus;
    const status = VALID_STATUSES.includes(normalizedStatus) ? normalizedStatus : null;
    const entry: IndexEntry = {
      rowNumber: header + offset + 2,
      destination: String(row[0] ?? "").trim(),
      region: String(row[1] ?? "").trim(),
      sheetName: String(row[2] ?? "").trim(),
      duration: String(row[3] ?? "").trim(),
      status,
      rawStatus,
      lastUpdated: String(row[5] ?? "").trim(),
      notes: String(row[6] ?? "").trim(),
    };
    ["destination", "region", "sheetName", "duration", "rawStatus"].forEach((field) => {
      if (!entry[field as keyof IndexEntry]) issues.push({ severity: "ERROR", code: "MISSING_INDEX_FIELD", message: `INDEX ${field} is required`, worksheet: entry.sheetName || undefined, field });
    });
    if (!status) issues.push({ severity: "ERROR", code: "INVALID_STATUS", message: `INDEX status is not recognised: ${rawStatus || "blank"}`, worksheet: entry.sheetName || undefined, field: "Status" });
    return [entry];
  });
  return { entries, issues };
}

export function validateWorkbookCatalogue(workbook: WorkbookSource, entries: IndexEntry[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sheetNames = new Set(workbook.sheets.map((sheet) => sheet.name));
  if (workbook.sheets.length !== EXPECTED_WORKSHEET_COUNT) issues.push({ severity: "ERROR", code: "UNEXPECTED_WORKSHEET_COUNT", message: `Expected ${EXPECTED_WORKSHEET_COUNT} worksheets, found ${workbook.sheets.length}` });
  CONTROL_SHEETS.forEach((name) => {
    if (!sheetNames.has(name)) issues.push({ severity: "ERROR", code: "MISSING_CONTROL_SHEET", message: `${name} control sheet is missing` });
  });
  const itinerarySheets = workbook.sheets.filter((sheet) => !CONTROL_SHEETS.includes(sheet.name as typeof CONTROL_SHEETS[number]));
  if (itinerarySheets.length !== EXPECTED_ITINERARY_COUNT) issues.push({ severity: "ERROR", code: "UNEXPECTED_ITINERARY_COUNT", message: `Expected ${EXPECTED_ITINERARY_COUNT} itinerary sheets, found ${itinerarySheets.length}` });
  if (entries.length !== EXPECTED_ITINERARY_COUNT) issues.push({ severity: "ERROR", code: "UNEXPECTED_INDEX_COUNT", message: `Expected ${EXPECTED_ITINERARY_COUNT} INDEX rows, found ${entries.length}` });
  entries.forEach((entry) => {
    if (!sheetNames.has(entry.sheetName)) issues.push({ severity: "ERROR", code: "INDEX_WORKSHEET_MISSING", message: `INDEX row ${entry.rowNumber} references missing worksheet ${entry.sheetName}`, worksheet: entry.sheetName });
  });
  duplicates(entries.map((entry) => entry.sheetName)).forEach((name) => issues.push({ severity: "ERROR", code: "DUPLICATE_WORKSHEET_REFERENCE", message: `Worksheet is referenced more than once: ${name}`, worksheet: name }));
  const indexed = new Set(entries.map((entry) => entry.sheetName));
  itinerarySheets.filter((sheet) => !indexed.has(sheet.name)).forEach((sheet) => issues.push({ severity: "ERROR", code: "ITINERARY_NOT_INDEXED", message: `Itinerary worksheet is absent from INDEX: ${sheet.name}`, worksheet: sheet.name }));
  return issues;
}

export function validateItinerary(itinerary: ParsedItinerary, unknownMonths: string[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (itinerary.source.status === "draft") issues.push(issue("REVIEW_REQUIRED", "DRAFT_INCLUDED", "Draft record is included by the active Release 1 policy", itinerary));
  const indexDuration = parseDuration(itinerary.index.duration);
  if (!indexDuration) issues.push(issue("REVIEW_REQUIRED", "INDEX_DURATION_UNPARSEABLE", `INDEX duration cannot be parsed: ${itinerary.index.duration}`, itinerary, "Duration"));
  else if (indexDuration.days !== itinerary.summary.suggestedDuration.days || indexDuration.nights !== itinerary.summary.suggestedDuration.nights) issues.push(issue("REVIEW_REQUIRED", "DURATION_CONFLICT", `INDEX duration ${itinerary.index.duration} conflicts with sheet duration ${itinerary.summary.suggestedDuration.display}`, itinerary, "Suggested Duration"));
  if (itinerary.summary.suggestedDuration.days > 0 && itinerary.summary.suggestedDuration.nights !== itinerary.summary.suggestedDuration.days - 1) issues.push(issue("REVIEW_REQUIRED", "UNUSUAL_DAY_NIGHT_RELATIONSHIP", "Nights are not days minus one", itinerary, "Suggested Duration"));
  const requiredLists: Array<[string, string[]]> = [
    ["highlights", itinerary.highlights], ["days", itinerary.days.map(String)],
    ["normallyIncludes", itinerary.normallyIncludes], ["normallyExcludes", itinerary.normallyExcludes],
    ["importantNotes", itinerary.importantNotes],
  ];
  requiredLists.forEach(([field, values]) => { if (values.length === 0) issues.push(issue("ERROR", "MISSING_REQUIRED_CONTENT", `${field} must contain at least one item`, itinerary, field)); });
  if (itinerary.highlights.length > 8) issues.push(issue("ERROR", "TOO_MANY_HIGHLIGHTS", "Highlights must not exceed eight", itinerary, "highlights"));
  if (itinerary.highlights.length < 3) issues.push(issue("WARNING", "FEW_HIGHLIGHTS", "Fewer than three highlights are present", itinerary, "highlights"));
  if (itinerary.optionalExperiences.length === 0) issues.push(issue("WARNING", "NO_OPTIONAL_EXPERIENCES", "No optional experiences are supplied", itinerary, "optionalExperiences"));
  if (itinerary.customisationIdeas.length === 0) issues.push(issue("REVIEW_REQUIRED", "NO_CUSTOMISATION_IDEAS", "No customisation ideas are supplied", itinerary, "customisationIdeas"));
  if (itinerary.matching.relatedDestinations.length === 0) issues.push(issue("WARNING", "NO_RELATED_DESTINATIONS", "No related destinations are supplied", itinerary, "relatedDestinations"));
  unknownMonths.forEach((month) => issues.push(issue("REVIEW_REQUIRED", "UNKNOWN_MONTH", `Unknown month token: ${month}`, itinerary, "Suggested Months")));
  const dayNumbers = itinerary.days.map((day) => day.day);
  if (dayNumbers.some((day, index) => day !== index + 1)) issues.push(issue("ERROR", "NON_SEQUENTIAL_DAYS", "Day numbers must begin at 1 and be sequential", itinerary, "days"));
  if (new Set(dayNumbers).size !== dayNumbers.length) issues.push(issue("ERROR", "DUPLICATE_DAY", "Day numbers must not repeat", itinerary, "days"));
  itinerary.days.forEach((day) => {
    if (!day.overnightStay) issues.push(issue("ERROR", "MISSING_OVERNIGHT_STAY", `Day ${day.day} has no Overnight Stay`, itinerary, "days"));
    if (!day.suggestedExperience) issues.push(issue("ERROR", "MISSING_DAY_EXPERIENCE", `Day ${day.day} has no Suggested Experience`, itinerary, "days"));
    if (day.suggestedExperience.length > 360) issues.push(issue("WARNING", "LONG_DAY_DESCRIPTION", `Day ${day.day} description exceeds 360 characters`, itinerary, "days"));
  });
  if (itinerary.summary.suggestedDuration.days > 0 && itinerary.days.length !== itinerary.summary.suggestedDuration.days) issues.push(issue("REVIEW_REQUIRED", "DAY_COUNT_MISMATCH", `Itinerary has ${itinerary.days.length} day rows for a ${itinerary.summary.suggestedDuration.days}-day duration`, itinerary, "days"));
  [["highlights", itinerary.highlights], ["optionalExperiences", itinerary.optionalExperiences]].forEach(([field, values]) => {
    duplicates(values as string[]).forEach((value) => issues.push(issue("WARNING", "DUPLICATE_PUBLIC_ITEM", `Duplicate ${field} item: ${value}`, itinerary, field as string)));
  });
  const publicValues = [...itinerary.highlights, ...itinerary.optionalExperiences, ...itinerary.importantNotes, ...itinerary.customisationIdeas, ...itinerary.days.flatMap((day) => [day.suggestedExperience, day.notes ?? ""])];
  publicValues.filter((value) => /[☐☒□☑]/.test(value)).forEach((value) => issues.push(issue("WARNING", "CHECKBOX_IN_PUBLIC_TEXT", `Checkbox symbol leaked into public content: ${value}`, itinerary)));
  publicValues.filter((value) => /\b(?:tbd|todo|placeholder|lorem ipsum)\b/i.test(value)).forEach((value) => issues.push(issue("REVIEW_REQUIRED", "PLACEHOLDER_TEXT", `Placeholder text is present: ${value}`, itinerary)));
  publicValues.filter((value) => /\b(?:internal use only|destination code|region code|revision number|prepared by|workbook status)\b/i.test(value)).forEach((value) => issues.push(issue("REVIEW_REQUIRED", "INTERNAL_NOTE_IN_PUBLIC_CONTENT", `Possible internal metadata is present in guest-facing content: ${value}`, itinerary)));
  if (itinerary.summary.title.length > 180) issues.push(issue("WARNING", "LONG_TITLE", "Traveller-facing title exceeds 180 characters", itinerary, "title"));
  if (!ITINERARY_MAPPING_BY_CODE[itinerary.destinationCode]) issues.push(issue("REVIEW_REQUIRED", "MISSING_STABLE_ID_MAPPING", "Destination code needs an explicit stable runtime ID mapping", itinerary, "Destination Code"));
  return issues;
}

export function validateUniqueness(records: ParsedItinerary[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  duplicates(records.map((record) => record.id)).forEach((id) => issues.push({ severity: "ERROR", code: "DUPLICATE_RUNTIME_ID", message: `Duplicate runtime ID: ${id}`, runtimeId: id }));
  duplicates(records.map((record) => record.destinationCode)).forEach((code) => issues.push({ severity: "ERROR", code: "DUPLICATE_DESTINATION_CODE", message: `Duplicate destination code: ${code}` }));
  return issues;
}
