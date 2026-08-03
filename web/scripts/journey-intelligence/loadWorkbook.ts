import { execFileSync } from "node:child_process";
import { access } from "node:fs/promises";
import { basename } from "node:path";

import {
  JourneyIntelligenceError,
  REQUIRED_SHEETS,
  type CellValue,
  type CompatibilityMatrixRow,
  type DestinationCatalogueRow,
  type DestinationIntelligenceRow,
  type EmotionalGoal,
  type JourneyBaseStatus,
  type RawSheet,
  type RecordType,
  type RequiredSheetName,
  type TravelScope,
  type TravellerType,
  type DesiredExperience,
  type WorkbookCompatibility,
  type WorkbookFileMetadata,
  type WorkbookModel,
} from "./types.js";
import {
  asInteger,
  asScore,
  asString,
  optionalString,
  reasonCodeFrom,
  reasonDescriptionFrom,
  sha256File,
  slug,
} from "./utils.js";

const MAX_WORKBOOK_BYTES = 64 * 1024 * 1024;

const DESTINATION_INTELLIGENCE_HEADERS = [
  "Source Row",
  "Destination ID",
  "Region ID",
  "Destination",
  "Region",
  "Travel Scope",
  "Record Type",
  "Journey Base Status",
  "Parent Region",
  "Journey Identity",
  "Primary Experiences",
  "Secondary Experiences",
  "Signature Experiences",
  "Best For",
  "Emotional Outcomes",
  "Strengths",
  "Avoid When",
  "Comfort Range",
  "Journey Pace",
  "Suggested Minimum Duration",
  "Suggested Ideal Duration",
  "Best Season",
  "Shoulder Season",
  "Seasonal Cautions",
  "Operational Confidence",
  "Confidence Explanation",
  "Airport or Arrival Gateway",
  "Typical Transfer Complexity",
  "Family Friendliness",
  "Senior Friendliness",
  "Accessibility Considerations",
  "Business Travel Suitability",
  "Connectivity Reliability",
  "Food Variety",
  "Vegetarian Friendliness",
  "Shopping Strength",
  "Nightlife Strength",
  "Wellness Strength",
  "Adventure Intensity",
  "Physical Activity Level",
  "Arrival",
  "First Impression",
  "Shared Moment",
  "Signature Experience Seed",
  "Relaxation Moment",
  "Local Discovery",
  "Food or Cultural Moment",
  "Journey High Point",
  "Journey Ending",
  "Why This Region",
  "Worth Considering",
  "Potential Trade-off",
  "Suggested Duration",
  "Journey Rhythm",
  "Arrival Phase",
  "Discovery Phase",
  "Signature Day",
  "Slow or Recovery Phase",
  "Optional Extension",
  "Departure Phase",
] as const;

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
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

function unzipEntry(
  workbookPath: string,
  entry: string,
  required = true,
): string | null {
  try {
    return execFileSync("unzip", ["-p", workbookPath, entry], {
      encoding: "utf8",
      maxBuffer: MAX_WORKBOOK_BYTES,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (!required) return null;
    throw new JourneyIntelligenceError({
      component: "WorkbookLoader",
      message: `Unable to read ${entry} from ${basename(workbookPath)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
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
  const letters = reference.match(/^[A-Z]+/)?.[0];
  if (!letters) {
    throw new JourneyIntelligenceError({
      component: "WorkbookLoader",
      message: `Malformed cell reference ${reference}`,
    });
  }
  return [...letters].reduce(
    (value, letter) => value * 26 + letter.charCodeAt(0) - 64,
    0,
  ) - 1;
}

function cellValue(
  attributes: string,
  body: string,
  strings: readonly string[],
): CellValue {
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
    if (!Number.isInteger(index) || strings[index] === undefined) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        message: `Invalid shared-string index ${decoded}`,
      });
    }
    return strings[index];
  }
  if (type === "b") return decoded === "1";
  if (type === "str" || type === "e") return decoded;
  const numeric = Number(decoded);
  return Number.isFinite(numeric) ? numeric : decoded;
}

function parseSheet(
  name: RequiredSheetName,
  xml: string,
  strings: readonly string[],
): RawSheet {
  const rows: CellValue[][] = [];
  for (const match of xml.matchAll(/<(?:[A-Za-z0-9_]+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?c>)/g)) {
    const reference = attribute(match[1], "r");
    if (!reference) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName: name,
        message: "Cell is missing an A1 reference",
      });
    }
    const rowNumber = Number(reference.match(/\d+$/)?.[0]);
    if (!Number.isInteger(rowNumber) || rowNumber < 1) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName: name,
        message: `Malformed cell row in ${reference}`,
      });
    }
    const rowIndex = rowNumber - 1;
    const colIndex = columnIndex(reference);
    rows[rowIndex] ??= [];
    rows[rowIndex][colIndex] = cellValue(match[1], match[2] ?? "", strings);
  }
  return {
    name,
    rows: rows.map((row) => row ?? []),
  };
}

function relationshipTargets(xml: string): Map<string, string> {
  const targets = new Map<string, string>();
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const id = attribute(match[1], "Id");
    const target = attribute(match[1], "Target");
    if (!id || !target) continue;
    const normalized = target.startsWith("/")
      ? target.slice(1)
      : `xl/${target.replace(/^\.\//, "")}`;
    targets.set(id, normalized);
  }
  return targets;
}

function workbookSheetEntries(xml: string): Array<{
  name: string;
  relationshipId: string;
}> {
  return [...xml.matchAll(/<(?:[A-Za-z0-9_]+:)?sheet\b([^>]*)\/?>/g)].map((match) => {
    const name = attribute(match[1], "name");
    const relationshipId = attribute(match[1], "r:id");
    if (!name || !relationshipId) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        message: "Workbook contains a sheet without a name or relationship",
      });
    }
    return { name, relationshipId };
  });
}

function xmlTag(xml: string | null, tag: string): string | null {
  if (!xml) return null;
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const value = xml.match(
    new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`),
  )?.[1];
  return value === undefined ? null : decodeXml(value.trim()) || null;
}

function workbookMetadata(
  workbookPath: string,
  coreProperties: string | null,
): WorkbookFileMetadata {
  return {
    filename: basename(workbookPath),
    version: null,
    createdAt: xmlTag(coreProperties, "dcterms:created"),
    modifiedAt: xmlTag(coreProperties, "dcterms:modified"),
  };
}

function lastNonEmptyRow(rows: readonly CellValue[][]): number {
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if ((rows[index] ?? []).some((value) => value !== null && value !== "")) {
      return index;
    }
  }
  return -1;
}

function table(
  sheet: RawSheet,
  headerRow: number,
  requiredHeaders: readonly string[],
): {
  headers: string[];
  rows: Array<{ workbookRow: number; values: CellValue[] }>;
  index: Map<string, number>;
} {
  const headerValues = sheet.rows[headerRow - 1] ?? [];
  const headers = headerValues.map((value) =>
    value === null || value === undefined ? "" : String(value).trim(),
  );
  const index = new Map(headers.map((header, column) => [header, column]));

  for (const required of requiredHeaders) {
    if (!index.has(required)) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName: sheet.name,
        message: `Missing mandatory header "${required}"`,
      });
    }
  }

  const finalRow = lastNonEmptyRow(sheet.rows);
  const rows: Array<{ workbookRow: number; values: CellValue[] }> = [];
  for (let rowIndex = headerRow; rowIndex <= finalRow; rowIndex += 1) {
    const values = sheet.rows[rowIndex] ?? [];
    if (!values.some((value) => value !== null && value !== "")) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName: sheet.name,
        message: `Blank row ${rowIndex + 1} inside the populated table`,
      });
    }
    rows.push({ workbookRow: rowIndex + 1, values });
  }
  return { headers, rows, index };
}

function valueAt(
  values: CellValue[],
  index: Map<string, number>,
  header: string,
): CellValue | undefined {
  const column = index.get(header);
  return column === undefined ? undefined : values[column];
}

function requiredValue(
  values: CellValue[],
  index: Map<string, number>,
  header: string,
  sheetName: RequiredSheetName,
  recordId?: string,
): string {
  return asString(valueAt(values, index, header), {
    component: "WorkbookLoader",
    sheetName,
    field: header,
    recordId,
  });
}

function loadTaxonomies(sheets: Map<RequiredSheetName, RawSheet>): {
  travellerTypes: TravellerType[];
  emotionalGoals: EmotionalGoal[];
  desiredExperiences: DesiredExperience[];
} {
  const travellerTable = table(
    sheets.get("Traveller Types")!,
    1,
    ["Traveller", "Characteristics"],
  );
  const travellerTypes = travellerTable.rows.map(({ values }) => {
    const name = requiredValue(
      values,
      travellerTable.index,
      "Traveller",
      "Traveller Types",
    );
    return {
      id: slug(name),
      name,
      characteristics: requiredValue(
        values,
        travellerTable.index,
        "Characteristics",
        "Traveller Types",
        name,
      ),
    };
  });

  const emotionalTable = table(
    sheets.get("Emotional Goals")!,
    1,
    ["Emotional Goal"],
  );
  const emotionalGoals = emotionalTable.rows.map(({ values }) => {
    const name = requiredValue(
      values,
      emotionalTable.index,
      "Emotional Goal",
      "Emotional Goals",
    );
    return { id: slug(name), name };
  });

  const experienceTable = table(
    sheets.get("Desired Experiences")!,
    1,
    ["Desired Experience"],
  );
  const desiredExperiences = experienceTable.rows.map(({ values }) => {
    const name = requiredValue(
      values,
      experienceTable.index,
      "Desired Experience",
      "Desired Experiences",
    );
    return { id: slug(name), name };
  });

  return { travellerTypes, emotionalGoals, desiredExperiences };
}

function compatibilityHeaders(
  travellerTypes: readonly TravellerType[],
  emotionalGoals: readonly EmotionalGoal[],
  desiredExperiences: readonly DesiredExperience[],
): string[] {
  return [
    ...travellerTypes.flatMap(({ name }) => [
      `Traveller — ${name} Score`,
      `Traveller — ${name} Reason`,
    ]),
    ...emotionalGoals.flatMap(({ name }) => [
      `Emotion — ${name} Score`,
      `Emotion — ${name} Reason`,
    ]),
    ...desiredExperiences.flatMap(({ name }) => [
      `Experience — ${name} Score`,
      `Experience — ${name} Reason`,
    ]),
  ];
}

function rowCompatibility(
  values: CellValue[],
  index: Map<string, number>,
  regionId: string,
  travellerTypes: readonly TravellerType[],
  emotionalGoals: readonly EmotionalGoal[],
  desiredExperiences: readonly DesiredExperience[],
): WorkbookCompatibility[] {
  const categories = [
    {
      prefix: "Traveller",
      category: "TravellerType" as const,
      values: travellerTypes,
    },
    {
      prefix: "Emotion",
      category: "EmotionalGoal" as const,
      values: emotionalGoals,
    },
    {
      prefix: "Experience",
      category: "DesiredExperience" as const,
      values: desiredExperiences,
    },
  ];

  return categories.flatMap(({ prefix, category, values: taxonomy }) =>
    taxonomy.map(({ name }) => {
      const scoreColumn = `${prefix} — ${name} Score`;
      const reasonColumn = `${prefix} — ${name} Reason`;
      const reason = requiredValue(
        values,
        index,
        reasonColumn,
        "Destination Intelligence",
        regionId,
      );
      return {
        category,
        key: name,
        score: asScore(valueAt(values, index, scoreColumn), {
          sheetName: "Destination Intelligence",
          field: scoreColumn,
          recordId: regionId,
        }),
        reasonCode: reasonCodeFrom(reason),
        reasonDescription: reasonDescriptionFrom(reason),
        scoreColumn,
        reasonColumn,
      };
    }),
  );
}

function loadDestinationIntelligence(
  sheet: RawSheet,
  travellerTypes: readonly TravellerType[],
  emotionalGoals: readonly EmotionalGoal[],
  desiredExperiences: readonly DesiredExperience[],
): DestinationIntelligenceRow[] {
  const parsed = table(sheet, 1, [
    ...DESTINATION_INTELLIGENCE_HEADERS,
    ...compatibilityHeaders(travellerTypes, emotionalGoals, desiredExperiences),
  ]);

  return parsed.rows.map(({ workbookRow, values }) => {
    const regionId = requiredValue(
      values,
      parsed.index,
      "Region ID",
      "Destination Intelligence",
    );
    const get = (header: string) =>
      requiredValue(
        values,
        parsed.index,
        header,
        "Destination Intelligence",
        regionId,
      );
    return {
      workbookRow,
      sourceRow: asInteger(valueAt(values, parsed.index, "Source Row"), {
        component: "WorkbookLoader",
        sheetName: "Destination Intelligence",
        field: "Source Row",
        recordId: regionId,
      }),
      destinationId: get("Destination ID"),
      regionId,
      destination: get("Destination"),
      region: get("Region"),
      travelScope: get("Travel Scope") as TravelScope,
      recordType: get("Record Type") as RecordType,
      journeyBaseStatus: get("Journey Base Status") as JourneyBaseStatus,
      parentRegion: optionalString(valueAt(values, parsed.index, "Parent Region")),
      journeyIdentity: get("Journey Identity"),
      primaryExperiences: get("Primary Experiences"),
      secondaryExperiences: optionalString(
        valueAt(values, parsed.index, "Secondary Experiences"),
      ),
      signatureExperiences: get("Signature Experiences"),
      bestFor: get("Best For"),
      emotionalOutcomes: get("Emotional Outcomes"),
      strengths: get("Strengths"),
      avoidWhen: get("Avoid When"),
      comfortRange: get("Comfort Range"),
      journeyPace: get("Journey Pace"),
      suggestedMinimumDuration: get("Suggested Minimum Duration"),
      suggestedIdealDuration: get("Suggested Ideal Duration"),
      bestSeason: get("Best Season"),
      shoulderSeason: get("Shoulder Season"),
      seasonalCautions: get("Seasonal Cautions"),
      operationalConfidence: get("Operational Confidence"),
      confidenceExplanation: get("Confidence Explanation"),
      airportOrArrivalGateway: get("Airport or Arrival Gateway"),
      typicalTransferComplexity: get("Typical Transfer Complexity"),
      familyFriendliness: get("Family Friendliness"),
      seniorFriendliness: get("Senior Friendliness"),
      accessibilityConsiderations: get("Accessibility Considerations"),
      businessTravelSuitability: get("Business Travel Suitability"),
      connectivityReliability: get("Connectivity Reliability"),
      foodVariety: get("Food Variety"),
      vegetarianFriendliness: get("Vegetarian Friendliness"),
      shoppingStrength: get("Shopping Strength"),
      nightlifeStrength: get("Nightlife Strength"),
      wellnessStrength: get("Wellness Strength"),
      adventureIntensity: get("Adventure Intensity"),
      physicalActivityLevel: get("Physical Activity Level"),
      arrival: get("Arrival"),
      firstImpression: get("First Impression"),
      sharedMoment: get("Shared Moment"),
      signatureExperienceSeed: get("Signature Experience Seed"),
      relaxationMoment: get("Relaxation Moment"),
      localDiscovery: get("Local Discovery"),
      foodOrCulturalMoment: get("Food or Cultural Moment"),
      journeyHighPoint: get("Journey High Point"),
      journeyEnding: get("Journey Ending"),
      whyThisRegion: get("Why This Region"),
      worthConsidering: get("Worth Considering"),
      potentialTradeOff: get("Potential Trade-off"),
      suggestedDuration: get("Suggested Duration"),
      journeyRhythm: get("Journey Rhythm"),
      arrivalPhase: get("Arrival Phase"),
      discoveryPhase: get("Discovery Phase"),
      signatureDay: get("Signature Day"),
      slowOrRecoveryPhase: get("Slow or Recovery Phase"),
      optionalExtension: get("Optional Extension"),
      departurePhase: get("Departure Phase"),
      compatibility: rowCompatibility(
        values,
        parsed.index,
        regionId,
        travellerTypes,
        emotionalGoals,
        desiredExperiences,
      ),
    };
  });
}

function loadCompatibilityMatrix(
  sheet: RawSheet,
  travellerTypes: readonly TravellerType[],
  emotionalGoals: readonly EmotionalGoal[],
  desiredExperiences: readonly DesiredExperience[],
): CompatibilityMatrixRow[] {
  const scoreHeaders = [
    ...travellerTypes.map(({ name }) => `Traveller — ${name}`),
    ...emotionalGoals.map(({ name }) => `Emotion — ${name}`),
    ...desiredExperiences.map(({ name }) => `Experience — ${name}`),
  ];
  const parsed = table(sheet, 7, [
    "Destination ID",
    "Region ID",
    ...scoreHeaders,
    "Operational Confidence",
    "Reason Reference",
  ]);
  return parsed.rows.map(({ workbookRow, values }) => {
    const regionId = requiredValue(
      values,
      parsed.index,
      "Region ID",
      "Compatibility Matrix",
    );
    return {
      workbookRow,
      destinationId: requiredValue(
        values,
        parsed.index,
        "Destination ID",
        "Compatibility Matrix",
        regionId,
      ),
      regionId,
      scores: new Map(
        scoreHeaders.map((header) => [
          header,
          asScore(valueAt(values, parsed.index, header), {
            sheetName: "Compatibility Matrix",
            field: header,
            recordId: regionId,
          }),
        ]),
      ),
      operationalConfidence: requiredValue(
        values,
        parsed.index,
        "Operational Confidence",
        "Compatibility Matrix",
        regionId,
      ),
      reasonReference: requiredValue(
        values,
        parsed.index,
        "Reason Reference",
        "Compatibility Matrix",
        regionId,
      ),
    };
  });
}

export async function loadWorkbook(workbookPath: string): Promise<WorkbookModel> {
  try {
    await access(workbookPath);
  } catch {
    throw new JourneyIntelligenceError({
      component: "WorkbookLoader",
      message: `Workbook not found: ${workbookPath}`,
    });
  }

  const workbookXml = unzipEntry(workbookPath, "xl/workbook.xml")!;
  const relationshipsXml = unzipEntry(
    workbookPath,
    "xl/_rels/workbook.xml.rels",
  )!;
  const strings = sharedStrings(
    unzipEntry(workbookPath, "xl/sharedStrings.xml", false),
  );
  const relationships = relationshipTargets(relationshipsXml);
  const entries = workbookSheetEntries(workbookXml);
  const entryByName = new Map(entries.map((entry) => [entry.name, entry]));
  const sheets = new Map<RequiredSheetName, RawSheet>();

  for (const sheetName of REQUIRED_SHEETS) {
    const entry = entryByName.get(sheetName);
    if (!entry) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName,
        message: "Required sheet is missing",
      });
    }
    const target = relationships.get(entry.relationshipId);
    if (!target) {
      throw new JourneyIntelligenceError({
        component: "WorkbookLoader",
        sheetName,
        message: "Sheet relationship target is missing",
      });
    }
    sheets.set(
      sheetName,
      parseSheet(sheetName, unzipEntry(workbookPath, target)!, strings),
    );
  }

  const { travellerTypes, emotionalGoals, desiredExperiences } =
    loadTaxonomies(sheets);

  const catalogueTable = table(
    sheets.get("Destination Catalogue")!,
    1,
    ["Destination", "Region"],
  );
  const destinationCatalogue: DestinationCatalogueRow[] =
    catalogueTable.rows.map(({ workbookRow, values }) => ({
      workbookRow,
      destination: requiredValue(
        values,
        catalogueTable.index,
        "Destination",
        "Destination Catalogue",
      ),
      region: requiredValue(
        values,
        catalogueTable.index,
        "Region",
        "Destination Catalogue",
      ),
    }));

  const destinationIntelligence = loadDestinationIntelligence(
    sheets.get("Destination Intelligence")!,
    travellerTypes,
    emotionalGoals,
    desiredExperiences,
  );
  const compatibilityMatrix = loadCompatibilityMatrix(
    sheets.get("Compatibility Matrix")!,
    travellerTypes,
    emotionalGoals,
    desiredExperiences,
  );

  const sourceTable = table(sheets.get("Source Register")!, 1, ["Region ID"]);
  const sourceRegisterRegionIds = sourceTable.rows.map(({ values }) =>
    requiredValue(
      values,
      sourceTable.index,
      "Region ID",
      "Source Register",
    ),
  );
  const reviewTable = table(sheets.get("Review Register")!, 1, ["Region ID"]);
  const reviewRegisterRegionIds = reviewTable.rows.map(({ values }) =>
    requiredValue(
      values,
      reviewTable.index,
      "Region ID",
      "Review Register",
    ),
  );

  return {
    workbookPath,
    workbookChecksum: await sha256File(workbookPath),
    workbookMetadata: workbookMetadata(
      workbookPath,
      unzipEntry(workbookPath, "docProps/core.xml", false),
    ),
    sheetCount: entries.length,
    travellerTypes,
    emotionalGoals,
    desiredExperiences,
    destinationCatalogue,
    destinationIntelligence,
    compatibilityMatrix,
    sourceRegisterRegionIds,
    reviewRegisterRegionIds,
  };
}
