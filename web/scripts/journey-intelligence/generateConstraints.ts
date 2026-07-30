import type {
  CompatibilityArtifact,
  CompatibilityCategory,
  ConstraintArtifact,
  ConstraintRule,
  ConstraintSeverity,
  ConstraintType,
  WorkbookModel,
} from "./types.js";
import { artifactHeader, compareStrings, sha256 } from "./utils.js";

const CONSTRAINT_TYPE: Record<CompatibilityCategory, ConstraintType> = {
  TravellerType: "Traveller",
  EmotionalGoal: "Emotion",
  DesiredExperience: "Experience",
  JourneyComfort: "Comfort",
  JourneyPace: "Pace",
};

function severityForScore(score: number): ConstraintSeverity | null {
  if (score === 0) return "Contradiction";
  if (score === 1) return "Strong Penalty";
  if (score === 2) return "Moderate Penalty";
  return null;
}

function constraintId(seed: string): string {
  return `CTR-${sha256(seed).slice(0, 16).toUpperCase()}`;
}

function createConstraint(
  value: Omit<ConstraintRule, "constraintId">,
): ConstraintRule {
  return {
    constraintId: constraintId(
      [
        value.type,
        value.source,
        value.target,
        value.severity,
        value.reasonCode,
      ].join("|"),
    ),
    ...value,
  };
}

export function generateConstraints(
  model: WorkbookModel,
  compatibility: CompatibilityArtifact,
): ConstraintArtifact {
  const scoreConstraints = compatibility.records.flatMap((record) => {
    const severity = severityForScore(record.score);
    if (!severity) return [];
    return [
      createConstraint({
        type: CONSTRAINT_TYPE[record.category],
        source: record.key,
        target: record.regionId,
        severity,
        reasonCode: record.reasonCode,
        sourceRow: record.sourceRow,
      }),
    ];
  });

  const operationalConstraints = model.destinationIntelligence
    .filter((record) => record.journeyBaseStatus !== "Yes")
    .map((record) =>
      createConstraint({
        type: "Operational",
        source:
          record.operationalConfidence === "REVIEW_REQUIRED"
            ? "REVIEW_REQUIRED"
            : record.recordType,
        target: record.regionId,
        severity: "Contradiction",
        reasonCode:
          record.operationalConfidence === "REVIEW_REQUIRED"
            ? "OPERATIONAL_REVIEW_REQUIRED"
            : "PRIMARY_RECOMMENDATION_NOT_ALLOWED",
        sourceRow: record.sourceRow,
      }),
    );

  const scopeConstraints = [
    createConstraint({
      type: "DestinationScope",
      source: "Domestic Only",
      target: "International",
      severity: "Contradiction",
      reasonCode: "TRAVEL_SCOPE_DOMESTIC_REQUIRED",
      sourceRow: null,
    }),
    createConstraint({
      type: "DestinationScope",
      source: "International Only",
      target: "Domestic",
      severity: "Contradiction",
      reasonCode: "TRAVEL_SCOPE_INTERNATIONAL_REQUIRED",
      sourceRow: null,
    }),
  ];

  const records = [
    ...scoreConstraints,
    ...operationalConstraints,
    ...scopeConstraints,
  ].sort(
    (left, right) =>
      compareStrings(left.type, right.type) ||
      compareStrings(left.source, right.source) ||
      compareStrings(left.target, right.target) ||
      compareStrings(left.constraintId, right.constraintId),
  );

  return {
    ...artifactHeader(model.workbookChecksum),
    records,
  };
}
