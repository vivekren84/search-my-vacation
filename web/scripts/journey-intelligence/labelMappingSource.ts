/**
 * GOVERNANCE BOUNDARY — Controlled Vocabulary governed mapping source (WP-5).
 *
 * This module is a mechanical transcription of two things that cannot be
 * mechanically derived from the operational-layer workbook alone, and are
 * therefore kept as an explicit, reviewed, checked-in source rather than
 * computed:
 *
 * 1. `GOVERNED_EMOTION_BY_LABEL` / `GOVERNED_THEMES_BY_LABEL` /
 *    `GOVERNED_TRAVELLER_BY_LABEL` — the label → runtime-ID mapping
 *    previously hand-authored directly inside
 *    `web/lib/journey-director/catalogue/release1Candidates.ts`
 *    (`EMOTION_BY_LABEL`, `THEMES_BY_LABEL`, `TRAVELLER_BY_LABEL`). The
 *    values below are an unchanged, one-for-one transcription of those
 *    tables — no label, no target ID, and no mapping was added, removed,
 *    or altered by this move. This is a product/business naming decision
 *    (which runtime `EmotionId`/`ThemeId`/`TravellerType` a workbook label
 *    corresponds to), not a fact the workbook itself states, so it cannot
 *    be generated from workbook content the way `kbApprovedPortfolio.ts`
 *    transcribes Knowledge Base content for WP-4.
 * 2. `RUNTIME_EMOTION_IDS` / `RUNTIME_THEME_IDS` / `RUNTIME_TRAVELLER_TYPE_IDS`
 *    — a mechanical transcription of the full `EmotionId`/`ThemeId`/
 *    `TravellerType` unions from
 *    `web/lib/journey-director/engine/engine.types.ts`, needed so the
 *    generator can compute reachability (RC-6,
 *    `docs/09-Development/EBC-R1.2-03.03-RAD-Destination-Intelligence-Source-Comparison-Runtime-Trace.md`
 *    §7) without importing runtime application code into the generator's
 *    separate TypeScript project. If either union changes, this list must
 *    be updated to match — `generateLabelMappings.ts` does not detect drift
 *    between this transcription and the live type, only between this
 *    mapping and the operational-layer workbook.
 *
 * `generateLabelMappings.ts` (WP-5,
 * `docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`
 * WP-5) validates the mapping below against the operational layer's current
 * `Traveller Types`/`Emotional Goals`/`Desired Experiences` sheets and
 * reports, but never silently expands, either vocabulary. Extending any of
 * these tables beyond what is transcribed here — including the currently
 * KB-approved but operationally-unrepresented Traveller Types (Open
 * Decision OD-4, `EBC-R1.2-03.05` §12, still unresolved as of this EBC) —
 * is out of this module's and this EBC's scope.
 *
 * Added under `R1.2-WS3-IMP-02-EBC-RAD` (WP-5). No prior generator or
 * runtime behaviour changed by adding this file.
 */

import type { EmotionalGoal, TravellerType as WorkbookTravellerType } from "./types.js";
import type { DesiredExperience } from "./types.js";

/** Mechanical transcription of `engine.types.ts`'s `EmotionId` union. Keep in sync by hand. */
export const RUNTIME_EMOTION_IDS = [
  "adventure",
  "awe",
  "celebration",
  "curiosity",
  "discovery",
  "escape",
  "freedom",
  "gratitude",
  "indulgence",
  "joy",
  "majesty",
  "reconnection",
  "relaxation",
  "romance",
  "serenity",
  "spirituality",
  "wonder",
] as const;

/** Mechanical transcription of `engine.types.ts`'s `ThemeId` union. Keep in sync by hand. */
export const RUNTIME_THEME_IDS = [
  "adventure",
  "architecture",
  "backwaters",
  "beaches",
  "city-break",
  "coffee-estates",
  "cruises",
  "culture",
  "desert",
  "family-attractions",
  "festivals",
  "food",
  "forests",
  "heritage",
  "hills",
  "islands",
  "lakes",
  "local-communities",
  "luxury",
  "mountains",
  "nature",
  "nightlife",
  "photography",
  "rivers",
  "road-trips",
  "safari",
  "scenic-drives",
  "shopping",
  "slow-travel",
  "snow-experiences",
  "spiritual",
  "tea-estates",
  "villages",
  "water-sports",
  "wellness",
  "wildlife",
] as const;

/** Mechanical transcription of `engine.types.ts`'s `TravellerType` union. Keep in sync by hand. */
export const RUNTIME_TRAVELLER_TYPE_IDS = [
  "solo-traveller",
  "couple",
  "family",
  "friends",
  "corporate-group",
] as const;

/**
 * Mechanical transcription of the KB's approved Traveller Type vocabulary
 * (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` §8), for reachability
 * reporting only. The runtime `TravellerType` union above intentionally
 * still carries only 5 values — extending it is Open Decision OD-4, not
 * this EBC's scope.
 */
export const KB_APPROVED_TRAVELLER_TYPE_COUNT = 9;

/** Unchanged transcription of `release1Candidates.ts`'s former `EMOTION_BY_LABEL`. */
export const GOVERNED_EMOTION_BY_LABEL: Readonly<Record<string, (typeof RUNTIME_EMOTION_IDS)[number]>> = {
  Adventure: "adventure",
  Celebration: "celebration",
  Discovery: "discovery",
  Escape: "escape",
  Explore: "curiosity",
  Freedom: "freedom",
  Healing: "serenity",
  Reconnection: "reconnection",
  Relax: "relaxation",
  Romance: "romance",
  "Slow Living": "serenity",
};

/** Unchanged transcription of `release1Candidates.ts`'s former `THEMES_BY_LABEL`. */
export const GOVERNED_THEMES_BY_LABEL: Readonly<Record<string, readonly (typeof RUNTIME_THEME_IDS)[number][]>> = {
  Adventure: ["adventure"],
  Beach: ["beaches"],
  Celebrations: ["festivals"],
  Culture: ["culture"],
  Food: ["food"],
  Heritage: ["heritage"],
  "Island Hopping": ["islands"],
  Luxury: ["luxury"],
  Mountains: ["mountains"],
  Nature: ["nature"],
  Photography: ["photography"],
  Shopping: ["shopping"],
  Spiritual: ["spiritual"],
  Wellness: ["wellness"],
  Wildlife: ["wildlife", "safari"],
};

/** Unchanged transcription of `release1Candidates.ts`'s former `TRAVELLER_BY_LABEL`. */
export const GOVERNED_TRAVELLER_BY_LABEL: Readonly<Record<string, (typeof RUNTIME_TRAVELLER_TYPE_IDS)[number]>> = {
  Business: "corporate-group",
  Couple: "couple",
  Family: "family",
  Friends: "friends",
  Solo: "solo-traveller",
};

export type OperationalTaxonomyLabels = {
  travellerTypes: readonly WorkbookTravellerType[];
  emotionalGoals: readonly EmotionalGoal[];
  desiredExperiences: readonly DesiredExperience[];
};
