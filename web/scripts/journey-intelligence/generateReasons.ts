import type {
  CompatibilityArtifact,
  ConstraintArtifact,
  ReasonArtifact,
  ReasonCategory,
  ReasonCode,
  WorkbookModel,
} from "./types.js";
import { artifactHeader, compareStrings } from "./utils.js";

function reasonCategory(reasonCode: string): ReasonCategory {
  if (reasonCode.startsWith("TRAVELLER_")) return "Traveller";
  if (reasonCode.startsWith("EMOTION_")) return "Emotion";
  if (
    reasonCode.startsWith("EXPERIENCE_") ||
    reasonCode.startsWith("CONTRADICTION_EXPERIENCE")
  ) {
    return "Experience";
  }
  if (reasonCode.startsWith("COMFORT_")) return "Comfort";
  if (reasonCode.startsWith("PACE_")) return "Pace";
  if (
    reasonCode.startsWith("OPERATIONAL_") ||
    reasonCode === "PRIMARY_RECOMMENDATION_NOT_ALLOWED"
  ) {
    return "Operational";
  }
  return "Constraint";
}

function summary(reasonCode: string): string {
  return reasonCode
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function description(reasonCode: string, category: ReasonCategory): string {
  if (reasonCode.startsWith("CONTRADICTION_")) {
    return "The workbook identifies an incompatible fit that must be rejected before ranking.";
  }
  if (reasonCode === "TRAVEL_SCOPE_DOMESTIC_REQUIRED") {
    return "International destinations are excluded when the traveller explicitly requests domestic journeys only.";
  }
  if (reasonCode === "TRAVEL_SCOPE_INTERNATIONAL_REQUIRED") {
    return "Domestic destinations are excluded when the traveller explicitly requests international journeys only.";
  }
  if (reasonCode === "OPERATIONAL_REVIEW_REQUIRED") {
    return "The workbook marks this record for business or operational review before primary recommendation use.";
  }
  if (reasonCode === "PRIMARY_RECOMMENDATION_NOT_ALLOWED") {
    return "The record is an attraction or experience cluster and cannot become a primary Journey Director recommendation.";
  }
  if (reasonCode === "COMFORT_SUPPORTED") {
    return "The requested comfort level is explicitly present in the workbook comfort range.";
  }
  if (reasonCode === "COMFORT_LIMITED") {
    return "The requested comfort level is not explicitly present in the workbook comfort range.";
  }
  if (reasonCode === "PACE_SUPPORTED") {
    return "The requested journey pace is explicitly present in the workbook pace range.";
  }
  if (reasonCode === "PACE_LIMITED") {
    return "The requested journey pace is not explicitly present in the workbook pace range.";
  }
  if (reasonCode.includes("WEAK_MATCH")) {
    return `The workbook records a weak ${category.toLowerCase()} fit for this region.`;
  }
  if (reasonCode.includes("LIMITED")) {
    return `The workbook records a limited ${category.toLowerCase()} fit that requires adjustment.`;
  }
  if (
    reasonCode.includes("DIRECT_MATCH") ||
    reasonCode.includes("PRIMARY_MATCH")
  ) {
    return `The workbook records this as a defining ${category.toLowerCase()} fit for the region.`;
  }
  if (
    reasonCode.includes("STRONG_MATCH") ||
    reasonCode.includes("SECONDARY_MATCH")
  ) {
    return `The workbook records a strong supporting ${category.toLowerCase()} fit for the region.`;
  }
  if (
    reasonCode.includes("SUITABLE") ||
    reasonCode.includes("SUPPORTING_MATCH")
  ) {
    return `The workbook records a suitable ${category.toLowerCase()} fit with appropriate journey design.`;
  }
  return `The workbook provides the controlled ${summary(reasonCode).toLowerCase()} reason for this runtime decision.`;
}

export function generateReasons(
  model: WorkbookModel,
  compatibility: CompatibilityArtifact,
  constraints: ConstraintArtifact,
): ReasonArtifact {
  const compatibilityCodes = new Set(
    compatibility.records.map((record) => record.reasonCode),
  );
  const constraintCodes = new Set(
    constraints.records.map((record) => record.reasonCode),
  );
  const allCodes = new Set([...compatibilityCodes, ...constraintCodes]);

  const records: ReasonCode[] = [...allCodes]
    .sort(compareStrings)
    .map((reasonCode) => {
      const category = reasonCategory(reasonCode);
      const context = [
        ...(compatibilityCodes.has(reasonCode) ? ["Compatibility"] : []),
        ...(constraintCodes.has(reasonCode) ? ["Constraint"] : []),
        "Recommendation",
      ];
      return {
        reasonCode,
        category,
        summary: summary(reasonCode),
        description: description(reasonCode, category),
        context,
      };
    });

  return {
    ...artifactHeader(model.workbookChecksum),
    records,
  };
}
