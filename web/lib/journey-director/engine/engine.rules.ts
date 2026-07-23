import type { JourneyFeeling } from "../../../types/journey-passport.types";

import type {
  ComfortLevel,
  DestinationScoreDimension,
  EmotionId,
  MemoryGoalId,
  PenaltySeverity,
  RegionScoreDimension,
  ThemeId,
  TravelPace,
  TravellerType,
} from "./engine.types";

export const DESTINATION_SCORE_WEIGHTS: Readonly<Record<DestinationScoreDimension, number>> = {
  "emotional-alignment": 24,
  "theme-experience-alignment": 16,
  "traveller-companion-suitability": 12,
  "travel-pace-alignment": 10,
  "comfort-alignment": 10,
  "season-timing-suitability": 10,
  "region-match-quality": 8,
  "memory-goal-alignment": 6,
  "operational-confidence": 4,
};

export const REGION_SCORE_WEIGHTS: Readonly<Record<RegionScoreDimension, number>> = {
  "emotional-fit": 30,
  "theme-signature-experience-fit": 20,
  "pace-fit": 15,
  "companion-suitability": 10,
  "memory-goal-fit": 10,
  "logistical-fit": 10,
  "comfort-fit": 5,
};

export const PENALTY_POINTS: Readonly<Record<PenaltySeverity, number>> = {
  minor: 3,
  moderate: 7,
  material: 12,
};

export const PERSONALITY_THRESHOLDS = {
  perfectMatch: { destination: 78, region: 75 },
  differentRhythm: { destination: 70, region: 68 },
  pleasantSurprise: { destination: 68, region: 68 },
  humanReview: { destination: 60, region: 60 },
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
