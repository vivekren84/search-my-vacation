import type {
  CandidateConcern,
  ComfortLevel,
  DiversityProfile,
  EmotionId,
  MemoryGoalId,
  SeasonalWindow,
  ThemeId,
  TravelPace,
  TravellerSuitability,
  TravellerType,
} from "../engine/engine.types";

export const UNKNOWN_SEASONALITY: readonly SeasonalWindow[] = Object.freeze(
  Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    guidance: "UNKNOWN" as const,
  })),
);

export const PREFERRED_SEASONALITY: readonly SeasonalWindow[] = Object.freeze(
  Array.from({ length: 12 }, (_, index) => ({ month: index + 1, guidance: "PREFERRED" as const })),
);

export const THEME_MEMORY_GOAL_MAP: Readonly<Record<ThemeId, readonly MemoryGoalId[]>> = {
  adventure: ["active-discovery"],
  architecture: ["cultural-discovery", "photographic-memories"],
  backwaters: ["nature-connection", "restorative-calm", "shared-time"],
  beaches: ["island-escape", "restorative-calm"],
  "city-break": ["urban-discovery"],
  "coffee-estates": ["nature-connection", "cultural-discovery"],
  cruises: ["shared-time", "restorative-calm"],
  culture: ["cultural-discovery"],
  desert: ["active-discovery", "photographic-memories"],
  "family-attractions": ["shared-time", "celebration-moments"],
  festivals: ["celebration-moments", "cultural-discovery"],
  food: ["food-discovery"],
  forests: ["nature-connection", "restorative-calm"],
  heritage: ["cultural-discovery"],
  hills: ["nature-connection"],
  islands: ["island-escape", "nature-connection"],
  lakes: ["nature-connection", "restorative-calm"],
  "local-communities": ["cultural-discovery", "shared-time"],
  luxury: ["restorative-calm", "celebration-moments"],
  mountains: ["nature-connection", "active-discovery"],
  nature: ["nature-connection"],
  nightlife: ["celebration-moments"],
  photography: ["photographic-memories"],
  rivers: ["nature-connection"],
  "road-trips": ["active-discovery"],
  safari: ["wildlife-encounters", "active-discovery"],
  "scenic-drives": ["nature-connection", "photographic-memories"],
  shopping: ["urban-discovery", "celebration-moments"],
  "slow-travel": ["restorative-calm", "shared-time"],
  "snow-experiences": ["winter-wonder"],
  spiritual: ["cultural-discovery", "restorative-calm"],
  "tea-estates": ["nature-connection", "cultural-discovery"],
  villages: ["cultural-discovery", "shared-time"],
  "water-sports": ["active-discovery", "island-escape"],
  wellness: ["restorative-calm"],
  wildlife: ["wildlife-encounters", "nature-connection"],
};

const LANDSCAPE_THEMES: readonly ThemeId[] = [
  "backwaters", "beaches", "desert", "forests", "hills", "islands", "lakes",
  "mountains", "nature", "rivers", "scenic-drives",
];
const EXPERIENCE_STYLE_THEMES: readonly ThemeId[] = [
  "adventure", "cruises", "family-attractions", "festivals", "food", "luxury",
  "nightlife", "photography", "road-trips", "safari", "shopping", "slow-travel",
  "snow-experiences", "water-sports", "wellness", "wildlife",
];
const CULTURAL_THEMES: readonly ThemeId[] = [
  "architecture", "culture", "festivals", "heritage", "local-communities",
  "spiritual", "villages",
];

export function deriveMemoryGoals(themes: readonly ThemeId[]): readonly MemoryGoalId[] {
  return [...new Set(themes.flatMap((theme) => THEME_MEMORY_GOAL_MAP[theme]))].sort();
}

export function bestFor(types: readonly TravellerType[]): readonly TravellerSuitability[] {
  return types.map((travellerType) => ({ travellerType, level: "BEST_FOR" as const }));
}

export function deriveDiversityProfile(values: {
  category: "DOMESTIC" | "INTERNATIONAL";
  themes: readonly ThemeId[];
  regionThemes: readonly ThemeId[];
  paces: readonly TravelPace[];
}): DiversityProfile {
  const combinedThemes = [...new Set([...values.themes, ...values.regionThemes])];
  const select = (approved: readonly ThemeId[]) =>
    combinedThemes.filter((theme) => approved.includes(theme)).slice(0, 4);

  return {
    "setting-geography": [
      values.category.toLocaleLowerCase("en-US"),
      ...select(LANDSCAPE_THEMES),
    ],
    "journey-rhythm": [...values.paces],
    "dominant-theme": combinedThemes.slice(0, 4),
    "signature-experience-style": select(EXPERIENCE_STYLE_THEMES).length > 0
      ? select(EXPERIENCE_STYLE_THEMES)
      : ["not-specified"],
    "cultural-expression": select(CULTURAL_THEMES).length > 0
      ? select(CULTURAL_THEMES)
      : ["not-specified"],
  };
}

type ConcernRule = {
  category: CandidateConcern["category"];
  terms: readonly string[];
  severity: CandidateConcern["severity"];
  explanation: string;
  when: CandidateConcern["when"];
};

export const CONCERN_CLASSIFICATION_RULES: readonly ConcernRule[] = [
  {
    category: "transfer-or-pace-friction",
    terms: ["transfer", "road", "distance", "movement", "city-hopping", "one-night", "inter-island"],
    severity: "moderate",
    explanation: "The source notes movement or pacing friction for travellers seeking a relaxed rhythm.",
    when: { paces: ["relaxed"] },
  },
  {
    category: "soft-preference-conflict",
    terms: ["crowd", "noise", "nightlife", "high-energy", "party"],
    severity: "minor",
    explanation: "The source notes an intensity or crowd trade-off for calm-led journeys.",
    when: { emotions: ["relaxation", "serenity", "reconnection"] },
  },
] as const;

export function classifyConcerns(
  candidateId: string,
  sourceStatements: readonly string[],
): readonly CandidateConcern[] {
  return sourceStatements.flatMap((statement, statementIndex) => {
    const normalized = statement.toLocaleLowerCase("en-US");
    return CONCERN_CLASSIFICATION_RULES.filter((rule) =>
      rule.terms.some((term) => normalized.includes(term)),
    ).map((rule) => ({
      id: `${candidateId}-${rule.category}-${statementIndex + 1}`,
      category: rule.category,
      severity: rule.severity,
      explanation: rule.explanation,
      when: rule.when,
    }));
  });
}

export type CatalogueRegionSource = {
  id: string;
  name: string;
  primaryEmotion: EmotionId;
  supportingEmotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  bestFor: readonly TravellerType[];
  paces: readonly TravelPace[];
  comforts: readonly ComfortLevel[];
  sourceNote: string;
  tradeOffs?: readonly string[];
  logisticalFit?: number;
  seasonality?: readonly SeasonalWindow[];
};
