import type {
  CandidateEvidence,
  EmotionId,
  JourneyCandidate,
  MemoryGoalId,
  RegionCandidate,
  SignatureExperience,
  ThemeId,
  TravellerSuitability,
} from "../engine/engine.types";

const reviewValidUntil = "2027-12-31";

const preferredYear = () =>
  Array.from({ length: 12 }, (_, index) => ({ month: index + 1, guidance: "PREFERRED" as const }));

const suitableFor = (
  best: readonly TravellerSuitability["travellerType"][],
): readonly TravellerSuitability[] =>
  (["solo-traveller", "couple", "family", "friends", "corporate-group"] as const).map(
    (travellerType) => ({
      travellerType,
      level: best.includes(travellerType) ? "BEST_FOR" as const : "SUITABLE" as const,
    }),
  );

function experience(
  id: string,
  themes: readonly ThemeId[],
  emotions: readonly EmotionId[],
  memoryGoals: readonly MemoryGoalId[],
): SignatureExperience {
  return { id, themes, emotions, memoryGoals };
}

function evidence(
  id: string,
  explanation: string,
  values: Omit<CandidateEvidence, "id" | "explanation">,
): CandidateEvidence {
  return { id, explanation, ...values };
}

function region(
  values: Omit<RegionCandidate, "status" | "dataQuality" | "reviewValidUntil" | "seasonality" | "concerns">,
): RegionCandidate {
  return {
    ...values,
    status: "ACTIVE",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    seasonality: preferredYear(),
    concerns: [],
  };
}

const keralaExperiences = [
  experience("backwater-houseboat", ["backwaters", "slow-travel", "nature"], ["relaxation", "reconnection"], ["restorative-calm", "shared-time", "nature-connection"]),
  experience("kerala-table", ["food", "local-communities"], ["discovery", "joy"], ["food-discovery", "shared-time"]),
];

const baliExperiences = [
  experience("ubud-wellness", ["wellness", "nature", "culture"], ["reconnection", "serenity"], ["restorative-calm", "nature-connection", "cultural-discovery"]),
  experience("balinese-table", ["food", "culture"], ["discovery", "joy"], ["food-discovery", "cultural-discovery"]),
];

const sriLankaExperiences = [
  experience("galle-heritage", ["heritage", "culture", "photography"], ["discovery", "wonder"], ["cultural-discovery", "photographic-memories"]),
  experience("bentota-coast", ["beaches", "slow-travel", "nature"], ["relaxation", "escape"], ["island-escape", "restorative-calm", "nature-connection"]),
];

const dubaiExperiences = [
  experience("dubai-city", ["city-break", "shopping", "architecture"], ["wonder", "indulgence"], ["urban-discovery", "celebration-moments"]),
  experience("dubai-table", ["food", "luxury"], ["celebration", "joy"], ["food-discovery", "shared-time"]),
];

const wildlifeExperiences = [
  experience("kabini-safari", ["wildlife", "safari", "nature", "photography"], ["adventure", "awe"], ["wildlife-encounters", "photographic-memories", "active-discovery"]),
  experience("forest-lodge", ["forests", "slow-travel"], ["serenity", "reconnection"], ["nature-connection", "shared-time"]),
];

export const verificationCandidates: readonly JourneyCandidate[] = [
  {
    id: "kerala",
    name: "Kerala",
    aliases: ["Alappuzha", "Alleppey", "Kumarakom"],
    category: "DOMESTIC",
    status: "ACTIVE",
    serviceConfidence: "CONFIDENT",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "relaxation",
    supportingEmotions: ["reconnection", "serenity", "escape", "discovery"],
    themes: ["backwaters", "nature", "slow-travel", "food", "local-communities"],
    bestFor: suitableFor(["family", "couple"]),
    paces: ["relaxed", "balanced"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["restorative-calm", "shared-time", "nature-connection", "food-discovery"],
    signatureExperiences: keralaExperiences,
    regions: [
      region({
        id: "kerala-alappuzha",
        name: "Alappuzha",
        primaryEmotion: "relaxation",
        supportingEmotions: ["reconnection", "serenity", "discovery"],
        themes: ["backwaters", "nature", "slow-travel", "food"],
        bestFor: suitableFor(["family", "couple"]),
        paces: ["relaxed", "balanced"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["restorative-calm", "shared-time", "nature-connection", "food-discovery"],
        signatureExperiences: keralaExperiences,
        logisticalFit: 0.95,
        evidence: [
          evidence("kerala-region-calm", "Backwater pacing supports restorative shared time.", { emotions: ["relaxation", "reconnection"], memoryGoals: ["restorative-calm", "shared-time"] }),
          evidence("kerala-region-nature", "Waterways and village landscapes support nature-led discovery.", { themes: ["nature", "food"], memoryGoals: ["nature-connection", "food-discovery"] }),
        ],
      }),
    ],
    concerns: [],
    evidence: [
      evidence("kerala-calm", "Kerala's maintained backwater profile supports relaxation and reconnection.", { emotions: ["relaxation", "reconnection", "serenity"] }),
      evidence("kerala-memory", "Governed experiences support nature, food and shared time.", { themes: ["nature", "food"], memoryGoals: ["shared-time", "nature-connection", "food-discovery"] }),
    ],
    diversity: {
      "setting-geography": ["domestic", "backwaters"],
      "journey-rhythm": ["slow", "contained"],
      "dominant-theme": ["backwaters", "nature"],
      "signature-experience-style": ["houseboat", "village-life"],
      "cultural-expression": ["kerala-local-life"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 4, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
  },
  {
    id: "bali",
    name: "Bali",
    aliases: ["Ubud", "Nusa Dua", "Seminyak"],
    category: "INTERNATIONAL",
    status: "ACTIVE",
    serviceConfidence: "CONFIDENT",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "reconnection",
    supportingEmotions: ["relaxation", "serenity", "escape", "discovery"],
    themes: ["nature", "culture", "wellness", "food", "beaches", "islands", "slow-travel"],
    bestFor: suitableFor(["couple", "family"]),
    paces: ["relaxed", "balanced"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["restorative-calm", "shared-time", "nature-connection", "food-discovery", "cultural-discovery", "island-escape"],
    signatureExperiences: baliExperiences,
    regions: [
      region({
        id: "bali-ubud",
        name: "Ubud",
        primaryEmotion: "reconnection",
        supportingEmotions: ["relaxation", "serenity", "discovery"],
        themes: ["nature", "culture", "wellness", "food", "slow-travel"],
        bestFor: suitableFor(["couple", "family"]),
        paces: ["relaxed", "balanced"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["restorative-calm", "shared-time", "nature-connection", "food-discovery", "cultural-discovery"],
        signatureExperiences: baliExperiences,
        logisticalFit: 0.9,
        evidence: [
          evidence("ubud-reconnection", "Ubud's governed profile supports reconnection through culture and wellness.", { emotions: ["reconnection", "relaxation"], themes: ["culture", "wellness"] }),
          evidence("ubud-nature", "Maintained Ubud experiences support nature and food discovery.", { themes: ["nature", "food"], memoryGoals: ["nature-connection", "food-discovery"] }),
        ],
      }),
    ],
    concerns: [],
    evidence: [
      evidence("bali-reconnection", "Bali supports a calm, culturally grounded expression of reconnection.", { emotions: ["reconnection", "relaxation", "serenity"] }),
      evidence("bali-variety", "Ubud grounds nature, food and cultural memories in approved experiences.", { themes: ["nature", "food", "culture"], memoryGoals: ["nature-connection", "food-discovery", "cultural-discovery"] }),
    ],
    diversity: {
      "setting-geography": ["international", "tropical-island", "inland-greenery"],
      "journey-rhythm": ["slow", "immersive"],
      "dominant-theme": ["culture", "wellness", "nature"],
      "signature-experience-style": ["wellness", "temple-culture", "rice-landscapes"],
      "cultural-expression": ["balinese-living-culture"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 4, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    aliases: ["Bentota", "Galle"],
    category: "INTERNATIONAL",
    status: "ACTIVE",
    serviceConfidence: "CONFIDENT",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "discovery",
    supportingEmotions: ["relaxation", "escape", "serenity", "wonder"],
    themes: ["beaches", "culture", "heritage", "nature", "food", "photography", "slow-travel"],
    bestFor: suitableFor(["family", "couple"]),
    paces: ["relaxed", "balanced", "explorer"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["island-escape", "restorative-calm", "nature-connection", "food-discovery", "cultural-discovery", "photographic-memories"],
    signatureExperiences: sriLankaExperiences,
    regions: [
      region({
        id: "sri-lanka-bentota-galle",
        name: "Bentota and Galle",
        primaryEmotion: "discovery",
        supportingEmotions: ["relaxation", "escape", "serenity"],
        themes: ["beaches", "culture", "heritage", "nature", "food", "photography", "slow-travel"],
        bestFor: suitableFor(["family", "couple"]),
        paces: ["relaxed", "balanced"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["island-escape", "restorative-calm", "nature-connection", "food-discovery", "cultural-discovery", "photographic-memories"],
        signatureExperiences: sriLankaExperiences,
        logisticalFit: 0.85,
        evidence: [
          evidence("sri-lanka-coast", "Bentota provides a maintained relaxed coastal expression.", { emotions: ["relaxation", "escape"], themes: ["beaches", "nature"] }),
          evidence("sri-lanka-culture", "Galle provides governed heritage, food and photography evidence.", { themes: ["heritage", "food", "photography"], memoryGoals: ["cultural-discovery", "food-discovery", "photographic-memories"] }),
        ],
      }),
    ],
    concerns: [],
    evidence: [
      evidence("sri-lanka-balance", "Sri Lanka balances coast and culture at a manageable rhythm.", { emotions: ["relaxation", "discovery"], themes: ["beaches", "culture"] }),
      evidence("sri-lanka-memories", "Approved coastal and heritage experiences support varied memories.", { memoryGoals: ["restorative-calm", "nature-connection", "food-discovery", "cultural-discovery"] }),
    ],
    diversity: {
      "setting-geography": ["international", "coast", "heritage-town"],
      "journey-rhythm": ["balanced", "two-part"],
      "dominant-theme": ["coast", "heritage"],
      "signature-experience-style": ["coastal-stay", "fort-walk"],
      "cultural-expression": ["island-heritage"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 4, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
  },
  {
    id: "dubai",
    name: "Dubai",
    aliases: ["Downtown Dubai", "Palm Jumeirah"],
    category: "INTERNATIONAL",
    status: "ACTIVE",
    serviceConfidence: "SUPPORTED",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "indulgence",
    supportingEmotions: ["celebration", "wonder", "joy", "discovery"],
    themes: ["city-break", "shopping", "architecture", "food", "luxury", "family-attractions"],
    bestFor: suitableFor(["family", "couple", "friends", "corporate-group"]),
    paces: ["balanced", "explorer", "fast-paced"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["urban-discovery", "celebration-moments", "food-discovery", "shared-time"],
    signatureExperiences: dubaiExperiences,
    regions: [
      region({
        id: "dubai-downtown",
        name: "Downtown Dubai",
        primaryEmotion: "wonder",
        supportingEmotions: ["indulgence", "celebration", "discovery"],
        themes: ["city-break", "shopping", "architecture", "food", "luxury", "family-attractions"],
        bestFor: suitableFor(["family", "couple", "friends", "corporate-group"]),
        paces: ["balanced", "explorer"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["urban-discovery", "celebration-moments", "food-discovery", "shared-time"],
        signatureExperiences: dubaiExperiences,
        logisticalFit: 0.95,
        evidence: [
          evidence("dubai-city-evidence", "Downtown supports compact city discovery and architecture.", { themes: ["city-break", "architecture"], memoryGoals: ["urban-discovery"] }),
          evidence("dubai-celebration", "Maintained city experiences support celebration and food-led memories.", { emotions: ["celebration", "joy"], themes: ["food"], memoryGoals: ["celebration-moments", "food-discovery"] }),
        ],
      }),
    ],
    concerns: [],
    evidence: [
      evidence("dubai-wonder", "Dubai supports city-scale wonder and celebration.", { emotions: ["wonder", "celebration"], themes: ["architecture", "shopping"] }),
      evidence("dubai-food", "Approved experiences support food and urban discovery.", { themes: ["food", "city-break"], memoryGoals: ["food-discovery", "urban-discovery"] }),
    ],
    diversity: {
      "setting-geography": ["international", "modern-city", "desert-gateway"],
      "journey-rhythm": ["balanced", "high-choice"],
      "dominant-theme": ["city", "architecture", "shopping"],
      "signature-experience-style": ["urban-attractions", "city-dining"],
      "cultural-expression": ["contemporary-gulf-city"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 4, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
  },
  {
    id: "wildlife",
    name: "Wildlife",
    aliases: ["Kabini", "Corbett", "Bandipur", "Masinagudi"],
    category: "DOMESTIC",
    status: "ACTIVE",
    serviceConfidence: "CONFIDENT",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "adventure",
    supportingEmotions: ["awe", "discovery", "serenity", "reconnection"],
    themes: ["wildlife", "safari", "nature", "photography", "forests", "slow-travel"],
    bestFor: suitableFor(["family", "couple", "friends"]),
    paces: ["balanced", "explorer"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["wildlife-encounters", "photographic-memories", "active-discovery", "nature-connection", "shared-time"],
    signatureExperiences: wildlifeExperiences,
    regions: [
      region({
        id: "wildlife-kabini",
        name: "Kabini",
        primaryEmotion: "adventure",
        supportingEmotions: ["awe", "discovery", "serenity"],
        themes: ["wildlife", "safari", "nature", "photography", "forests", "slow-travel"],
        bestFor: suitableFor(["family", "couple", "friends"]),
        paces: ["balanced", "explorer"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["wildlife-encounters", "photographic-memories", "active-discovery", "nature-connection", "shared-time"],
        signatureExperiences: wildlifeExperiences,
        logisticalFit: 0.85,
        evidence: [
          evidence("kabini-wildlife", "Kabini's maintained safari profile supports wildlife and photography.", { emotions: ["adventure", "awe"], themes: ["wildlife", "safari", "photography"] }),
          evidence("kabini-lodge", "A contained lodge-led stay supports nature and shared time.", { themes: ["nature", "forests"], memoryGoals: ["nature-connection", "shared-time"] }),
        ],
      }),
    ],
    concerns: [],
    evidence: [
      evidence("wildlife-encounter", "The governed collection supports credible wildlife encounters.", { themes: ["wildlife", "safari"], memoryGoals: ["wildlife-encounters"] }),
      evidence("wildlife-nature", "Kabini supports nature, photography and active discovery.", { emotions: ["adventure", "discovery"], themes: ["nature", "photography"], memoryGoals: ["photographic-memories", "active-discovery"] }),
    ],
    diversity: {
      "setting-geography": ["domestic", "forest", "reserve"],
      "journey-rhythm": ["balanced", "activity-windows"],
      "dominant-theme": ["wildlife", "nature"],
      "signature-experience-style": ["safari", "lodge-stay"],
      "cultural-expression": ["nature-conservation"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 4, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
  },
  {
    id: "japan",
    name: "Japan",
    aliases: ["Tokyo", "Kyoto"],
    category: "INTERNATIONAL",
    status: "COMING_SOON",
    serviceConfidence: "LIMITED",
    dataQuality: "COMPLETE",
    reviewValidUntil,
    primaryEmotion: "wonder",
    supportingEmotions: ["discovery", "curiosity"],
    themes: ["culture", "heritage", "food", "city-break"],
    bestFor: suitableFor(["couple", "family", "solo-traveller"]),
    paces: ["balanced", "explorer"],
    comforts: ["balanced", "premium"],
    seasonality: preferredYear(),
    memoryGoals: ["cultural-discovery", "food-discovery", "urban-discovery"],
    signatureExperiences: [],
    regions: [
      region({
        id: "japan-kyoto",
        name: "Kyoto",
        primaryEmotion: "wonder",
        supportingEmotions: ["discovery"],
        themes: ["culture", "heritage", "food"],
        bestFor: suitableFor(["couple", "family", "solo-traveller"]),
        paces: ["balanced", "explorer"],
        comforts: ["balanced", "premium"],
        memoryGoals: ["cultural-discovery", "food-discovery"],
        signatureExperiences: [],
        logisticalFit: 0.8,
        evidence: [],
      }),
    ],
    concerns: [],
    evidence: [],
    diversity: {
      "setting-geography": ["international", "east-asian-city"],
      "journey-rhythm": ["balanced"],
      "dominant-theme": ["culture", "heritage"],
      "signature-experience-style": ["temple-city"],
      "cultural-expression": ["japanese-culture"],
    },
    evidenceReadiness: { approvedImageryReferenceCount: 0, journeyMomentCount: 0, hasQualifiedRegionContent: false, hasMaterialContentGap: true },
  },
];
