import type {
  CompatibilityArtifact,
  CompatibilityCategory,
  CompatibilityRecord,
  DestinationIntelligenceRow,
  Score,
  WorkbookModel,
} from "./types.js";
import {
  artifactHeader,
  compareStrings,
  normalizedTokens,
  slug,
} from "./utils.js";

export const COMFORT_KEYS = ["Simple", "Balanced", "Premium"] as const;
export const PACE_KEYS = [
  "Relaxed",
  "Balanced",
  "Explorer",
  "Fast-paced",
] as const;

const CATEGORY_ORDER: Record<CompatibilityCategory, number> = {
  TravellerType: 0,
  EmotionalGoal: 1,
  DesiredExperience: 2,
  JourneyComfort: 3,
  JourneyPace: 4,
};

function derivedCompatibility(
  record: DestinationIntelligenceRow,
  category: Extract<CompatibilityCategory, "JourneyComfort" | "JourneyPace">,
  keys: readonly string[],
  workbookValue: string,
): CompatibilityRecord[] {
  const supported = new Set(normalizedTokens(workbookValue));
  return keys.map((key) => {
    const matches = supported.has(slug(key));
    return {
      regionId: record.regionId,
      category,
      key,
      score: (matches ? 5 : 1) as Score,
      reasonCode:
        category === "JourneyComfort"
          ? matches
            ? "COMFORT_SUPPORTED"
            : "COMFORT_LIMITED"
          : matches
            ? "PACE_SUPPORTED"
            : "PACE_LIMITED",
      sourceRow: record.sourceRow,
    };
  });
}

export function generateCompatibility(
  model: WorkbookModel,
): CompatibilityArtifact {
  const records = model.destinationIntelligence
    .filter((record) => record.journeyBaseStatus === "Yes")
    .flatMap((record) => [
      ...record.compatibility.map<CompatibilityRecord>((entry) => ({
        regionId: record.regionId,
        category: entry.category,
        key: entry.key,
        score: entry.score,
        reasonCode: entry.reasonCode,
        sourceRow: record.sourceRow,
      })),
      ...derivedCompatibility(
        record,
        "JourneyComfort",
        COMFORT_KEYS,
        record.comfortRange,
      ),
      ...derivedCompatibility(
        record,
        "JourneyPace",
        PACE_KEYS,
        record.journeyPace,
      ),
    ])
    .sort(
      (left, right) =>
        compareStrings(left.regionId, right.regionId) ||
        CATEGORY_ORDER[left.category] - CATEGORY_ORDER[right.category] ||
        compareStrings(left.key, right.key),
    );

  return {
    ...artifactHeader(model.workbookChecksum),
    scoreModel: {
      0: "Contradiction",
      1: "Weak Match",
      2: "Limited Match",
      3: "Suitable",
      4: "Strong Match",
      5: "Exceptional Match",
    },
    records,
  };
}
