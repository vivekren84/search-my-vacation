import {
  JourneyIntelligenceError,
  type DestinationIntelligenceRow,
  type RequiredSheetName,
  type ValidationReport,
  type ValidationWarning,
  type WorkbookModel,
} from "./types.js";

const RECORD_TYPES = new Set([
  "Attraction",
  "City",
  "Experience Cluster",
  "Island",
  "Journey Base",
  "Region",
]);
const BASE_STATUSES = new Set(["Yes", "No", "Review Required"]);
const TRAVEL_SCOPES = new Set(["Domestic", "International"]);

interface CheckCounter {
  executed: number;
  passed: number;
  duplicateChecks: number;
  schemaChecks: number;
}

function check(
  counter: CheckCounter,
  condition: unknown,
  message: string,
  context: {
    recordId?: string;
    sheetName?: RequiredSheetName;
    kind?: "duplicate" | "schema";
  } = {},
): asserts condition {
  counter.executed += 1;
  if (context.kind === "duplicate") counter.duplicateChecks += 1;
  if (context.kind === "schema") counter.schemaChecks += 1;
  if (!condition) {
    throw new JourneyIntelligenceError({
      component: "WorkbookValidation",
      message,
      recordId: context.recordId,
      sheetName: context.sheetName,
    });
  }
  counter.passed += 1;
}

function unique(
  counter: CheckCounter,
  values: readonly string[],
  label: string,
  sheetName: RequiredSheetName,
): void {
  check(
    counter,
    new Set(values).size === values.length,
    `${label} must be unique`,
    { sheetName, kind: "duplicate" },
  );
}

function validateRequiredJourneyFields(
  counter: CheckCounter,
  record: DestinationIntelligenceRow,
): void {
  const required = [
    ["Journey Identity", record.journeyIdentity],
    ["Primary Experiences", record.primaryExperiences],
    ["Signature Experiences", record.signatureExperiences],
    ["Emotional Outcomes", record.emotionalOutcomes],
    ["Strengths", record.strengths],
    ["Avoid When", record.avoidWhen],
    ["Comfort Range", record.comfortRange],
    ["Journey Pace", record.journeyPace],
    ["Suggested Minimum Duration", record.suggestedMinimumDuration],
    ["Suggested Ideal Duration", record.suggestedIdealDuration],
    ["Best Season", record.bestSeason],
    ["Operational Confidence", record.operationalConfidence],
  ] as const;

  for (const [field, value] of required) {
    check(counter, value.trim().length > 0, `${field} must not be blank`, {
      recordId: record.regionId,
      sheetName: "Destination Intelligence",
      kind: "schema",
    });
  }
}

export function validateWorkbook(model: WorkbookModel): ValidationReport {
  const counter: CheckCounter = {
    executed: 0,
    passed: 0,
    duplicateChecks: 0,
    schemaChecks: 0,
  };
  const warnings: ValidationWarning[] = [];

  check(counter, model.sheetCount >= 8, "Workbook must contain all eight sheets", {
    kind: "schema",
  });
  check(
    counter,
    model.travellerTypes.length > 0,
    "Traveller Types must contain records",
    { sheetName: "Traveller Types", kind: "schema" },
  );
  unique(
    counter,
    model.travellerTypes.map((item) => item.id),
    "Traveller IDs",
    "Traveller Types",
  );
  unique(
    counter,
    model.travellerTypes.map((item) => item.name),
    "Traveller names",
    "Traveller Types",
  );
  check(
    counter,
    model.travellerTypes.every(
      (item) => item.id.length > 0 && item.name.length > 0 && item.characteristics.length > 0,
    ),
    "Traveller records must not contain blanks",
    { sheetName: "Traveller Types", kind: "schema" },
  );

  unique(
    counter,
    model.emotionalGoals.map((item) => item.id),
    "Emotional Goal IDs",
    "Emotional Goals",
  );
  unique(
    counter,
    model.emotionalGoals.map((item) => item.name),
    "Emotional Goal values",
    "Emotional Goals",
  );
  check(
    counter,
    model.emotionalGoals.every((item) => item.id && item.name),
    "Emotional Goal records must not contain blanks",
    { sheetName: "Emotional Goals", kind: "schema" },
  );

  unique(
    counter,
    model.desiredExperiences.map((item) => item.id),
    "Desired Experience IDs",
    "Desired Experiences",
  );
  unique(
    counter,
    model.desiredExperiences.map((item) => item.name),
    "Desired Experience values",
    "Desired Experiences",
  );
  check(
    counter,
    model.desiredExperiences.every((item) => item.id && item.name),
    "Desired Experience records must not contain blanks",
    { sheetName: "Desired Experiences", kind: "schema" },
  );

  check(
    counter,
    model.destinationCatalogue.length === model.destinationIntelligence.length,
    "Destination Catalogue and Destination Intelligence row counts must match",
    { sheetName: "Destination Catalogue", kind: "schema" },
  );
  check(
    counter,
    model.compatibilityMatrix.length === model.destinationIntelligence.length,
    "Compatibility Matrix and Destination Intelligence row counts must match",
    { sheetName: "Compatibility Matrix", kind: "schema" },
  );

  unique(
    counter,
    model.destinationIntelligence.map((record) => record.regionId),
    "Region IDs",
    "Destination Intelligence",
  );
  unique(
    counter,
    model.compatibilityMatrix.map((record) => record.regionId),
    "Compatibility Matrix region IDs",
    "Compatibility Matrix",
  );

  const destinationIdToName = new Map<string, string>();
  const destinationNameToId = new Map<string, string>();
  const matrixByRegion = new Map(
    model.compatibilityMatrix.map((record) => [record.regionId, record]),
  );
  const sourceRegionIds = new Set(model.sourceRegisterRegionIds);
  const reviewRegionIds = new Set(model.reviewRegisterRegionIds);
  const destinationBaseCount = new Map<string, number>();

  model.destinationIntelligence.forEach((record, index) => {
    const catalogue = model.destinationCatalogue[index];
    check(
      counter,
      record.sourceRow === catalogue.workbookRow,
      "Source Row must reference the matching Destination Catalogue row",
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    check(
      counter,
      record.destination === catalogue.destination &&
        record.region === catalogue.region,
      "Destination and region must match the canonical catalogue row",
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    check(
      counter,
      RECORD_TYPES.has(record.recordType),
      `Invalid Record Type "${record.recordType}"`,
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    check(
      counter,
      BASE_STATUSES.has(record.journeyBaseStatus),
      `Invalid Journey Base Status "${record.journeyBaseStatus}"`,
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    check(
      counter,
      TRAVEL_SCOPES.has(record.travelScope),
      `Invalid Travel Scope "${record.travelScope}"`,
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    check(
      counter,
      record.destinationId.length > 0 &&
        record.regionId.length > 0 &&
        record.destination.length > 0 &&
        record.region.length > 0,
      "Destination identity fields must not be blank",
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );

    const knownName = destinationIdToName.get(record.destinationId);
    check(
      counter,
      knownName === undefined || knownName === record.destination,
      "A Destination ID cannot map to multiple destination names",
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "duplicate",
      },
    );
    destinationIdToName.set(record.destinationId, record.destination);
    const knownId = destinationNameToId.get(record.destination);
    check(
      counter,
      knownId === undefined || knownId === record.destinationId,
      "A destination name cannot map to multiple Destination IDs",
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "duplicate",
      },
    );
    destinationNameToId.set(record.destination, record.destinationId);

    validateRequiredJourneyFields(counter, record);
    const expectedCompatibilityCount =
      model.travellerTypes.length +
      model.emotionalGoals.length +
      model.desiredExperiences.length;
    check(
      counter,
      record.compatibility.length === expectedCompatibilityCount,
      `Expected ${expectedCompatibilityCount} compatibility values`,
      {
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
        kind: "schema",
      },
    );
    unique(
      counter,
      record.compatibility.map((entry) => `${entry.category}:${entry.key}`),
      `Compatibility keys for ${record.regionId}`,
      "Destination Intelligence",
    );
    record.compatibility.forEach((entry) => {
      check(
        counter,
        Number.isInteger(entry.score) && entry.score >= 0 && entry.score <= 5,
        `${entry.category}:${entry.key} score must be 0–5`,
        {
          recordId: record.regionId,
          sheetName: "Destination Intelligence",
          kind: "schema",
        },
      );
      check(
        counter,
        /^[A-Z][A-Z0-9_]*$/.test(entry.reasonCode) &&
          entry.reasonDescription.length > 0,
        `${entry.category}:${entry.key} must have exactly one valid reason code`,
        {
          recordId: record.regionId,
          sheetName: "Destination Intelligence",
          kind: "schema",
        },
      );
      if (entry.score === 0) {
        check(
          counter,
          entry.reasonCode.startsWith("CONTRADICTION_"),
          "Score 0 must use an explicit contradiction reason",
          {
            recordId: record.regionId,
            sheetName: "Destination Intelligence",
            kind: "schema",
          },
        );
      }
    });

    const matrix = matrixByRegion.get(record.regionId);
    check(counter, matrix, "Compatibility Matrix row is missing", {
      recordId: record.regionId,
      sheetName: "Compatibility Matrix",
      kind: "schema",
    });
    check(
      counter,
      matrix.destinationId === record.destinationId &&
        matrix.reasonReference === record.regionId &&
        matrix.operationalConfidence === record.operationalConfidence,
      "Compatibility Matrix identity and confidence must match Destination Intelligence",
      {
        recordId: record.regionId,
        sheetName: "Compatibility Matrix",
        kind: "schema",
      },
    );
    record.compatibility.forEach((entry) => {
      const prefix =
        entry.category === "TravellerType"
          ? "Traveller"
          : entry.category === "EmotionalGoal"
            ? "Emotion"
            : "Experience";
      check(
        counter,
        matrix.scores.get(`${prefix} — ${entry.key}`) === entry.score,
        `${prefix} — ${entry.key} must reconcile to Destination Intelligence`,
        {
          recordId: record.regionId,
          sheetName: "Compatibility Matrix",
          kind: "schema",
        },
      );
    });

    check(
      counter,
      sourceRegionIds.has(record.regionId),
      "Every region must have a Source Register entry",
      {
        recordId: record.regionId,
        sheetName: "Source Register",
        kind: "schema",
      },
    );

    if (record.journeyBaseStatus === "Yes") {
      destinationBaseCount.set(
        record.destinationId,
        (destinationBaseCount.get(record.destinationId) ?? 0) + 1,
      );
    }
    if (record.operationalConfidence === "REVIEW_REQUIRED") {
      check(
        counter,
        reviewRegionIds.has(record.regionId),
        "Review-required records must appear in the Review Register",
        {
          recordId: record.regionId,
          sheetName: "Review Register",
          kind: "schema",
        },
      );
      warnings.push({
        code: "REVIEW_REQUIRED_RECORD",
        message: `${record.destination} — ${record.region} retains REVIEW_REQUIRED operational confidence and remains excluded from primary recommendation.`,
        recordId: record.regionId,
        sheetName: "Destination Intelligence",
      });
    }
  });

  for (const [destinationId, destinationName] of destinationIdToName) {
    if ((destinationBaseCount.get(destinationId) ?? 0) === 0) {
      warnings.push({
        code: "DESTINATION_WITHOUT_JOURNEY_BASE",
        message: `${destinationName} has no approved Journey Base and will not enter primary recommendation ranking.`,
        recordId: destinationId,
        sheetName: "Destination Intelligence",
      });
    }
  }

  const reviewRequiredRecords = model.destinationIntelligence.filter(
    (record) => record.operationalConfidence === "REVIEW_REQUIRED",
  ).length;

  return {
    status: "PASS",
    workbookLoaded: true,
    sheetCount: model.sheetCount,
    rowCounts: {
      "Traveller Types": model.travellerTypes.length,
      "Emotional Goals": model.emotionalGoals.length,
      "Desired Experiences": model.desiredExperiences.length,
      "Destination Catalogue": model.destinationCatalogue.length,
      "Destination Intelligence": model.destinationIntelligence.length,
      "Compatibility Matrix": model.compatibilityMatrix.length,
      "Source Register": model.sourceRegisterRegionIds.length,
      "Review Register": model.reviewRegisterRegionIds.length,
    },
    duplicateChecks: counter.duplicateChecks,
    schemaChecks: counter.schemaChecks,
    checksExecuted: counter.executed,
    checksPassed: counter.passed,
    warnings,
    failures: [],
    reviewRequiredRecords,
  };
}
