/**
 * GOVERNANCE BOUNDARY — Controlled Vocabulary Mapping Generation (WP-5).
 *
 * Implements WP-5 of
 * `EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`:
 * "replace the currently hand-authored `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`/
 * `TRAVELLER_BY_LABEL` constant tables in `release1Candidates.ts` with
 * tables generated from the operational layer's KB-validated taxonomy
 * sheets" and "Add a 'vocabulary reachability' section to the generation
 * report" (closing RC-6, `R1.2-03.03` §7).
 *
 * This module validates the governed label→runtime-ID mapping
 * (`labelMappingSource.ts`) against the operational layer's current
 * `Traveller Types`/`Emotional Goals`/`Desired Experiences` sheets and
 * produces:
 *   - the generated `EMOTION_BY_LABEL`/`THEMES_BY_LABEL`/`TRAVELLER_BY_LABEL`
 *     tables themselves, restricted to labels the operational layer
 *     actually carries today (so a future workbook change that drops a
 *     label is reflected here automatically, not silently preserved);
 *   - comparison findings: an operational-layer label with no governed
 *     mapping entry (`LABEL_WITHOUT_MAPPING`), or a governed mapping entry
 *     whose label no longer appears in the operational layer
 *     (`MAPPING_WITHOUT_OPERATIONAL_LABEL`);
 *   - reachability findings: for each of `EmotionId`/`ThemeId`/
 *     `TravellerType`, how many of the full runtime vocabulary's values are
 *     reachable through at least one current mapping entry.
 *
 * This module does not, and per this EBC's explicit scope must not, extend
 * any vocabulary beyond what `labelMappingSource.ts` already governs — see
 * that file's header for why the label→runtime-ID values themselves are a
 * curated input, not something this module derives. Extending the
 * Traveller Type vocabulary toward the KB's approved 9 (Open Decision OD-4)
 * remains an explicit, separate, unresolved business decision; this module
 * only makes the current 5-of-9 gap visible (`governance-compliant
 * handling`, per this EBC's own wording), it does not resolve it.
 *
 * Added under `R1.2-WS3-IMP-02-EBC-RAD` (WP-5). No prior generator
 * behaviour changed — this module is additive only, mirroring the pattern
 * `validateKbReconciliation.ts` (WP-4) already established.
 */

import {
  GOVERNED_EMOTION_BY_LABEL,
  GOVERNED_THEMES_BY_LABEL,
  GOVERNED_TRAVELLER_BY_LABEL,
  KB_APPROVED_TRAVELLER_TYPE_COUNT,
  RUNTIME_EMOTION_IDS,
  RUNTIME_THEME_IDS,
  RUNTIME_TRAVELLER_TYPE_IDS,
} from "./labelMappingSource.js";
import type { WorkbookModel } from "./types.js";

export type VocabularyName = "Emotion" | "Theme" | "TravellerType";

export interface LabelMappingComparisonFinding {
  code: "LABEL_WITHOUT_MAPPING" | "MAPPING_WITHOUT_OPERATIONAL_LABEL";
  vocabulary: VocabularyName;
  label: string;
  message: string;
}

export interface VocabularyReachability {
  vocabulary: VocabularyName;
  runtimeVocabularySize: number;
  reachableCount: number;
  reachablePercentage: number;
  unreachable: readonly string[];
  /** Only set for TravellerType — the KB (§8) approves more values than the runtime type carries. See OD-4. */
  kbApprovedSize?: number;
}

export interface LabelMappingReport {
  emotionByLabel: Readonly<Record<string, string>>;
  themesByLabel: Readonly<Record<string, readonly string[]>>;
  travellerByLabel: Readonly<Record<string, string>>;
  comparison: LabelMappingComparisonFinding[];
  reachability: VocabularyReachability[];
}

function operationalLabelSet(names: readonly string[]): Set<string> {
  return new Set(names);
}

function generateAndCompare<TargetId extends string>(
  vocabulary: VocabularyName,
  operationalLabels: readonly string[],
  governedMapping: Readonly<Record<string, TargetId | readonly TargetId[]>>,
): {
  generated: Record<string, TargetId | readonly TargetId[]>;
  comparison: LabelMappingComparisonFinding[];
  reachedIds: Set<TargetId>;
} {
  const operational = operationalLabelSet(operationalLabels);
  const governedLabels = new Set(Object.keys(governedMapping));
  const comparison: LabelMappingComparisonFinding[] = [];
  const generated: Record<string, TargetId | readonly TargetId[]> = {};
  const reachedIds = new Set<TargetId>();

  for (const label of operationalLabels) {
    if (!governedLabels.has(label)) {
      comparison.push({
        code: "LABEL_WITHOUT_MAPPING",
        vocabulary,
        label,
        message: `${vocabulary} operational-layer label "${label}" has no governed runtime-ID mapping and will not be assignable to any generated candidate.`,
      });
      continue;
    }
    const target = governedMapping[label];
    generated[label] = target;
    (Array.isArray(target) ? target : [target]).forEach((id) => reachedIds.add(id as TargetId));
  }

  for (const label of governedLabels) {
    if (!operational.has(label)) {
      comparison.push({
        code: "MAPPING_WITHOUT_OPERATIONAL_LABEL",
        vocabulary,
        label,
        message: `${vocabulary} governed mapping entry "${label}" no longer has a matching label in the operational layer and was excluded from the generated table.`,
      });
    }
  }

  return { generated, comparison, reachedIds };
}

function reachability(
  vocabulary: VocabularyName,
  runtimeIds: readonly string[],
  reachedIds: ReadonlySet<string>,
  kbApprovedSize?: number,
): VocabularyReachability {
  const unreachable = runtimeIds.filter((id) => !reachedIds.has(id));
  const reachableCount = runtimeIds.length - unreachable.length;
  return {
    vocabulary,
    runtimeVocabularySize: runtimeIds.length,
    reachableCount,
    reachablePercentage: Math.round((reachableCount / runtimeIds.length) * 1000) / 10,
    unreachable,
    ...(kbApprovedSize !== undefined ? { kbApprovedSize } : {}),
  };
}

export function generateLabelMappings(model: WorkbookModel): LabelMappingReport {
  const emotion = generateAndCompare(
    "Emotion",
    model.emotionalGoals.map((item) => item.name),
    GOVERNED_EMOTION_BY_LABEL,
  );
  const theme = generateAndCompare(
    "Theme",
    model.desiredExperiences.map((item) => item.name),
    GOVERNED_THEMES_BY_LABEL,
  );
  const traveller = generateAndCompare(
    "TravellerType",
    model.travellerTypes.map((item) => item.name),
    GOVERNED_TRAVELLER_BY_LABEL,
  );

  return {
    emotionByLabel: emotion.generated as Record<string, string>,
    themesByLabel: theme.generated as Record<string, readonly string[]>,
    travellerByLabel: traveller.generated as Record<string, string>,
    comparison: [...emotion.comparison, ...theme.comparison, ...traveller.comparison],
    reachability: [
      reachability("Emotion", RUNTIME_EMOTION_IDS, emotion.reachedIds),
      reachability("Theme", RUNTIME_THEME_IDS, theme.reachedIds),
      reachability(
        "TravellerType",
        RUNTIME_TRAVELLER_TYPE_IDS,
        traveller.reachedIds,
        KB_APPROVED_TRAVELLER_TYPE_COUNT,
      ),
    ],
  };
}
