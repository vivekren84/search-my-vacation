import type { JourneyFeeling } from "../../../types/journey-passport.types";

import type {
  CandidateCapabilities,
  ComfortLevel,
  CoreIntent,
  DestinationScoreDimension,
  EmotionId,
  MemoryGoalId,
  PenaltySeverity,
  RegionScoreDimension,
  ThemeId,
  TravelPace,
  TravellerType,
} from "./engine.types";

export const CORE_INTENT_CAPABILITY: Readonly<
  Record<CoreIntent, keyof CandidateCapabilities>
> = {
  MOUNTAIN: "mountain",
  BEACH: "beach",
  WILDLIFE: "wildlife",
  CITY: "city",
  HERITAGE: "heritage",
  WELLNESS: "wellness",
  NATURE: "nature",
  ADVENTURE: "adventure",
};

export const DREAM_CORE_INTENT_MAP: Readonly<
  Partial<Record<string, CoreIntent>>
> = {
  "Tropical Escape": "BEACH",
  "Mountain Retreat": "MOUNTAIN",
  "City Discovery": "CITY",
  "Winter Wonderland": "MOUNTAIN",
  "Wildlife Adventure": "WILDLIFE",
};

export const TRAVEL_STYLE_CORE_INTENT_MAP: Readonly<
  Partial<Record<string, CoreIntent>>
> = {
  Relaxation: "WELLNESS",
  Adventure: "ADVENTURE",
  "Culture & Heritage": "HERITAGE",
  Nature: "NATURE",
  Wildlife: "WILDLIFE",
  "Beaches & Islands": "BEACH",
};

export const DESTINATION_SCORE_WEIGHTS: Readonly<Record<DestinationScoreDimension, number>> = {
  "core-intent-alignment": 28,
  "emotional-alignment": 16,
  "theme-experience-alignment": 10,
  "traveller-companion-suitability": 9,
  "travel-pace-alignment": 7,
  "comfort-alignment": 7,
  "season-timing-suitability": 8,
  "region-match-quality": 7,
  "memory-goal-alignment": 4,
  "operational-confidence": 4,
};

export const REGION_SCORE_WEIGHTS: Readonly<Record<RegionScoreDimension, number>> = {
  "core-intent-fit": 25,
  "emotional-fit": 22,
  "theme-signature-experience-fit": 16,
  "pace-fit": 11,
  "companion-suitability": 8,
  "memory-goal-fit": 8,
  "logistical-fit": 7,
  "comfort-fit": 3,
};

export const PENALTY_POINTS: Readonly<Record<PenaltySeverity, number>> = {
  minor: 3,
  moderate: 7,
  material: 12,
};

export const PERSONALITY_THRESHOLDS = {
  perfectMatch: { destination: 60, region: 40 },
  differentRhythm: { destination: 56, region: 35 },
  pleasantSurprise: { destination: 54, region: 35 },
  humanReview: { destination: 50, region: 40 },
} as const;

export const PACE_ORDER: readonly TravelPace[] = ["relaxed", "balanced", "explorer", "fast-paced"];
export const COMFORT_ORDER: readonly ComfortLevel[] = ["simple", "balanced", "premium"];

export const COMPANION_MAP: Readonly<Record<string, TravellerType>> = {
  Solo: "solo-traveller",
  Couple: "couple",
  Family: "family",
  Friends: "friends",
  Business: "corporate-group",
};

// Homepage intent is supporting evidence only. Explicit Journey Passport
// answers remain authoritative when the two signals differ.
export const HOMEPAGE_FEELING_MAP: Readonly<Record<JourneyFeeling, EmotionId>> = {
  relax: "relaxation",
  explore: "discovery",
  celebrate: "celebration",
  romance: "romance",
  escape: "escape",
  // EBC-036 (D-08): Memory Maker now enters via the shared `?mood=` mechanism
  // (see entry-context.ts moodPreselections), so it needs a supporting
  // EmotionId here too, otherwise TypeScript's exhaustiveness check on this
  // Record fails and the homepage-intent signal would be silently absent
  // from scoring for Memory Maker journeys. "reconnection" is unused by the
  // other five moods and is the closest existing EmotionId to "moments made
  // together" — no EmotionId literally means "family" or "togetherness".
  // Flagged for Archie/product confirmation: this is a new scoring-signal
  // value, even though it only affects the low-strength homepage-intent
  // signal, not any explicit Journey Passport answer.
  memory: "reconnection",
};

type DerivedJourneyMapping = {
  emotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  memoryGoals: readonly MemoryGoalId[];
  paces: readonly TravelPace[];
};

// Dream Journey values are broad archetypes. Their mappings are deliberately
// derived at 0.60 strength rather than treated as explicit traveller claims.
export const DREAM_JOURNEY_MAP: Readonly<Record<string, DerivedJourneyMapping>> = {
  "Tropical Escape": {
    emotions: ["escape", "relaxation"],
    themes: ["beaches", "islands"],
    memoryGoals: ["island-escape", "restorative-calm"],
    paces: ["relaxed"],
  },
  "Mountain Retreat": {
    emotions: ["serenity", "awe"],
    themes: ["mountains", "nature"],
    memoryGoals: ["nature-connection", "restorative-calm"],
    paces: ["balanced"],
  },
  "City Discovery": {
    emotions: ["discovery", "curiosity"],
    themes: ["city-break", "culture"],
    memoryGoals: ["urban-discovery", "cultural-discovery"],
    paces: ["explorer"],
  },
  "Cruise Voyage": {
    emotions: ["freedom", "discovery"],
    themes: ["cruises"],
    memoryGoals: ["shared-time"],
    paces: ["relaxed"],
  },
  "Winter Wonderland": {
    emotions: ["wonder", "awe"],
    themes: ["snow-experiences", "nature"],
    memoryGoals: ["winter-wonder", "photographic-memories"],
    paces: ["balanced"],
  },
  "Wildlife Adventure": {
    emotions: ["adventure", "discovery"],
    themes: ["wildlife", "safari", "nature"],
    memoryGoals: ["wildlife-encounters", "active-discovery"],
    paces: ["explorer"],
  },
};

type ExplicitStyleMapping = {
  emotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  memoryGoals: readonly MemoryGoalId[];
  derivedPaces?: readonly TravelPace[];
};

export const TRAVEL_STYLE_MAP: Readonly<Record<string, ExplicitStyleMapping>> = {
  Relaxation: {
    emotions: ["relaxation"],
    themes: ["slow-travel", "wellness"],
    memoryGoals: ["restorative-calm"],
    derivedPaces: ["relaxed"],
  },
  Adventure: {
    emotions: ["adventure"],
    themes: ["adventure"],
    memoryGoals: ["active-discovery"],
    derivedPaces: ["explorer"],
  },
  "Food & Dining": {
    emotions: ["discovery"],
    themes: ["food"],
    memoryGoals: ["food-discovery"],
  },
  "Culture & Heritage": {
    emotions: ["discovery"],
    themes: ["culture", "heritage"],
    memoryGoals: ["cultural-discovery"],
  },
  Photography: {
    emotions: ["wonder"],
    themes: ["photography"],
    memoryGoals: ["photographic-memories"],
  },
  Nature: {
    emotions: ["serenity"],
    themes: ["nature"],
    memoryGoals: ["nature-connection"],
  },
  Wildlife: {
    emotions: ["discovery"],
    themes: ["wildlife"],
    memoryGoals: ["wildlife-encounters"],
  },
  "Beaches & Islands": {
    emotions: ["escape"],
    themes: ["beaches", "islands"],
    memoryGoals: ["island-escape"],
  },
  Celebrations: {
    emotions: ["celebration", "joy"],
    themes: ["festivals"],
    memoryGoals: ["celebration-moments", "shared-time"],
  },
};

export const ALLOWED_COMPANIONS = new Set(Object.keys(COMPANION_MAP));
export const ALLOWED_DREAM_JOURNEYS = new Set(Object.keys(DREAM_JOURNEY_MAP));
export const ALLOWED_TRAVEL_STYLES = new Set(Object.keys(TRAVEL_STYLE_MAP));
export const ALLOWED_TIMING = new Set([
  "Within the Next Month",
  "In the Next 2–3 Months",
  "Later This Year",
  "I’m Flexible",
  "Exact Dates",
]);
