import { runtimeJourneyIntelligence } from "../intelligence";
import type {
  CandidateCapabilities,
  CandidateEvidence,
  ComfortLevel,
  EmotionId,
  JourneyCandidate,
  RegionCandidate,
  SignatureExperience,
  ThemeId,
  TravelPace,
  TravellerSuitability,
  TravellerType,
} from "../engine/engine.types";
import type { JourneyDNARecord } from "../intelligence";
import type {
  ExcludedPortfolioDestination,
  RuntimeCatalogueMetadata,
} from "./catalogue.types";
import {
  UNKNOWN_SEASONALITY,
  PREFERRED_SEASONALITY,
  classifyConcerns,
  deriveDiversityProfile,
  deriveMemoryGoals,
} from "./catalogue.mappings";

const LEGACY_CANDIDATE_IDS: Readonly<Record<string, string>> = {
  "india-andhra-pradesh": "vizag",
  "india-tamilnadu": "tamil-nadu",
  "india-telangana": "hyderabad",
  "india-wildlife-tours": "wildlife",
  "indonesia-bali": "bali",
  "united-arab-emirates": "dubai",
};

const CANDIDATE_NAMES: Readonly<Record<string, string>> = {
  "india-andhra-pradesh": "Vizag",
  "india-tamilnadu": "Tamil Nadu",
  "india-telangana": "Hyderabad",
  "india-wildlife-tours": "Wildlife",
  "united-arab-emirates": "Dubai",
};

const CANDIDATE_ALIASES: Readonly<Record<string, readonly string[]>> = {
  kerala: ["Kerala", "Cochin", "Thekkady", "Alleppey", "Alappuzha", "Kovalam", "Kumarakom"],
  bali: ["Bali", "Ubud", "Nusa Dua", "Seminyak", "Uluwatu"],
};

const CONFIDENT_APPROVAL_CANDIDATE_IDS = [
  "bali",
  "goa",
  "kerala",
  "sri-lanka",
  "vizag",
] as const;

const EMOTION_BY_LABEL: Readonly<Record<string, EmotionId>> = {
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

const THEMES_BY_LABEL: Readonly<Record<string, readonly ThemeId[]>> = {
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

const TRAVELLER_BY_LABEL: Readonly<Record<string, TravellerType>> = {
  Business: "corporate-group",
  Couple: "couple",
  Family: "family",
  Friends: "friends",
  Solo: "solo-traveller",
};

const PACE_BY_LABEL: Readonly<Record<string, TravelPace>> = {
  Balanced: "balanced",
  Explorer: "explorer",
  "Fast-paced": "fast-paced",
  Relaxed: "relaxed",
};

const COMFORT_BY_LABEL: Readonly<Record<string, ComfortLevel>> = {
  Balanced: "balanced",
  Premium: "premium",
  Simple: "simple",
};

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function legacyCandidateId(destinationId: string): string {
  return LEGACY_CANDIDATE_IDS[destinationId] ?? destinationId.replace(/^india-/, "");
}

function plusDays(date: string, days: number): string {
  const instant = new Date(`${date}T00:00:00.000Z`);
  instant.setUTCDate(instant.getUTCDate() + days);
  return instant.toISOString().slice(0, 10);
}

const catalogueEffectiveFrom = runtimeJourneyIntelligence.manifest.generatedAt.slice(0, 10);
const generatedCandidateCount =
  runtimeJourneyIntelligence.indexes.journeyDNAByDestinationId.size;

export const RELEASE1_CATALOGUE_METADATA: RuntimeCatalogueMetadata = Object.freeze({
  catalogueVersion: `journey-intelligence-${runtimeJourneyIntelligence.manifest.generatorVersion}-${runtimeJourneyIntelligence.manifest.workbookChecksum.slice(0, 12)}`,
  catalogueEffectiveFrom,
  catalogueReviewValidUntil: plusDays(catalogueEffectiveFrom, 30),
  sourceDocument: "web/generated/intelligence-manifest.json",
  sourceDocumentVersion: runtimeJourneyIntelligence.manifest.generatorVersion,
  sourceDocumentLastUpdated: catalogueEffectiveFrom,
  operationalSnapshotId: `journey-intelligence-${runtimeJourneyIntelligence.manifest.workbookChecksum.slice(0, 16)}`,
  neutralLogisticalFit: 0.5,
  confidentApprovalCandidateIds: CONFIDENT_APPROVAL_CANDIDATE_IDS,
  generatedCandidateCount,
  generatedRegionCount:
    runtimeJourneyIntelligence.manifest.recordCounts.journeyDNARecords,
});

function themesFor(record: JourneyDNARecord): readonly ThemeId[] {
  const recordTypeThemes: ThemeId[] = [];
  if (record.recordType === "City") recordTypeThemes.push("city-break");
  if (record.recordType === "Island") recordTypeThemes.push("islands", "beaches");

  return unique([
    ...record.primaryExperiences.flatMap((value) => THEMES_BY_LABEL[value] ?? []),
    ...record.secondaryExperiences.flatMap((value) => THEMES_BY_LABEL[value] ?? []),
    ...recordTypeThemes,
  ]);
}

function emotionsFor(record: JourneyDNARecord): readonly EmotionId[] {
  const mapped = unique(
    record.emotionalOutcomes.flatMap((value) => {
      const emotion = EMOTION_BY_LABEL[value];
      return emotion ? [emotion] : [];
    }),
  );
  return mapped.length > 0 ? mapped : ["discovery"];
}

function capabilitiesForThemes(themes: readonly ThemeId[]): CandidateCapabilities {
  const has = (...values: readonly ThemeId[]) =>
    values.some((value) => themes.includes(value));

  return {
    mountain: has("mountains", "hills", "snow-experiences"),
    beach: has("beaches", "islands"),
    wildlife: has("wildlife", "safari"),
    city: has("city-break"),
    heritage: has("heritage", "culture", "spiritual"),
    wellness: has("wellness", "slow-travel"),
    nature: has(
      "nature",
      "forests",
      "hills",
      "mountains",
      "backwaters",
      "lakes",
      "rivers",
      "islands",
    ),
    adventure: has(
      "adventure",
      "water-sports",
      "safari",
      "road-trips",
      "snow-experiences",
    ),
  };
}

function bestFor(record: JourneyDNARecord): readonly TravellerSuitability[] {
  const compatibility =
    runtimeJourneyIntelligence.indexes.compatibilityByRegionId.get(record.regionId) ?? [];
  return compatibility.flatMap((item) => {
    if (item.category !== "TravellerType" || item.score < 2) return [];
    const travellerType = TRAVELLER_BY_LABEL[item.key];
    if (!travellerType) return [];
    return [{
      travellerType,
      level:
        item.score >= 4
          ? "BEST_FOR"
          : item.score === 3
            ? "SUITABLE"
            : "ADJUSTMENT_REQUIRED",
    } satisfies TravellerSuitability];
  });
}

function signatureExperience(
  candidateId: string,
  record: JourneyDNARecord,
  themes: readonly ThemeId[],
  emotions: readonly EmotionId[],
): SignatureExperience {
  return {
    id: `${candidateId}-${record.regionId}-generated-experience`,
    themes,
    emotions,
    memoryGoals: deriveMemoryGoals(themes),
  };
}

function evidence(
  id: string,
  explanation: string,
  values: Omit<CandidateEvidence, "id" | "explanation">,
): CandidateEvidence {
  return { id, explanation, ...values };
}

function buildRegion(candidateId: string, record: JourneyDNARecord): RegionCandidate {
  const themes = themesFor(record);
  const emotions = emotionsFor(record);
  const memoryGoals = deriveMemoryGoals(themes);
  const seed = runtimeJourneyIntelligence.indexes.journeySeedByRegionId.get(record.regionId);
  const isConfident = RELEASE1_CATALOGUE_METADATA.confidentApprovalCandidateIds.includes(
    candidateId,
  );

  return {
    id: record.regionId,
    name: record.region,
    status: "ACTIVE",
    dataQuality: "COMPLETE",
    reviewValidUntil: RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil,
    primaryEmotion: emotions[0],
    supportingEmotions: emotions.slice(1),
    themes,
    capabilities: capabilitiesForThemes(themes),
    bestFor: bestFor(record),
    paces: unique(record.journeyPace.flatMap((value) => {
      const pace = PACE_BY_LABEL[value];
      return pace ? [pace] : [];
    })),
    comforts: unique(record.comfortRange.flatMap((value) => {
      const comfort = COMFORT_BY_LABEL[value];
      return comfort ? [comfort] : [];
    })),
    seasonality: isConfident ? PREFERRED_SEASONALITY : UNKNOWN_SEASONALITY,
    memoryGoals,
    signatureExperiences: [
      signatureExperience(candidateId, record, themes, emotions),
    ],
    logisticalFit: isConfident ? 0.9 : RELEASE1_CATALOGUE_METADATA.neutralLogisticalFit,
    concerns: classifyConcerns(
      record.regionId,
      unique([record.avoidWhen, record.seasonalCautions, seed?.potentialTradeOff ?? ""])
        .filter(Boolean),
    ),
    evidence: [
      evidence(`${record.regionId}-identity`, record.journeyIdentity, {
        emotions,
      }),
      evidence(`${record.regionId}-strengths`, record.strengths, {
        themes,
        memoryGoals,
      }),
    ],
  };
}

const SUITABILITY_PRIORITY: Readonly<Record<TravellerSuitability["level"], number>> = {
  BEST_FOR: 3,
  SUITABLE: 2,
  ADJUSTMENT_REQUIRED: 1,
  UNSUITABLE: 0,
};

function mergeBestFor(regions: readonly RegionCandidate[]): readonly TravellerSuitability[] {
  const strongest = new Map<TravellerType, TravellerSuitability>();
  regions.flatMap((region) => region.bestFor).forEach((suitability) => {
    const current = strongest.get(suitability.travellerType);
    if (!current || SUITABILITY_PRIORITY[suitability.level] > SUITABILITY_PRIORITY[current.level]) {
      strongest.set(suitability.travellerType, suitability);
    }
  });
  return [...strongest.values()].sort((left, right) =>
    left.travellerType.localeCompare(right.travellerType, "en-US"),
  );
}

function buildCandidate(
  destinationId: string,
  records: readonly JourneyDNARecord[],
): JourneyCandidate {
  const candidateId = legacyCandidateId(destinationId);
  const regions = records.map((record) => buildRegion(candidateId, record));
  const themes = unique(regions.flatMap((region) => region.themes));
  const emotions = unique([
    ...regions.map((region) => region.primaryEmotion),
    ...regions.flatMap((region) => region.supportingEmotions),
  ]);
  const memoryGoals = deriveMemoryGoals(themes);
  const isConfident = RELEASE1_CATALOGUE_METADATA.confidentApprovalCandidateIds.includes(
    candidateId,
  );
  const first = records[0];

  return {
    id: candidateId,
    name: CANDIDATE_NAMES[destinationId] ?? first.destination,
    aliases: unique([
      first.destination,
      destinationId,
      ...records.map((record) => record.region),
      ...(CANDIDATE_ALIASES[candidateId] ?? []),
    ]),
    category: first.travelScope === "Domestic" ? "DOMESTIC" : "INTERNATIONAL",
    status: "ACTIVE",
    serviceConfidence: isConfident ? "CONFIDENT" : "SUPPORTED",
    dataQuality: "COMPLETE",
    reviewValidUntil: RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil,
    primaryEmotion: emotions[0] ?? "discovery",
    supportingEmotions: emotions.slice(1),
    themes,
    capabilities: capabilitiesForThemes(themes),
    bestFor: mergeBestFor(regions),
    paces: unique(regions.flatMap((region) => region.paces)),
    comforts: unique(regions.flatMap((region) => region.comforts)),
    seasonality: isConfident ? PREFERRED_SEASONALITY : UNKNOWN_SEASONALITY,
    memoryGoals,
    signatureExperiences: regions.flatMap((region) => region.signatureExperiences),
    regions,
    concerns: regions.flatMap((region) => region.concerns),
    evidence: [
      evidence(`${candidateId}-generated-identity`, first.journeyIdentity, {
        emotions,
      }),
      evidence(`${candidateId}-generated-themes`, first.strengths, {
        themes,
        memoryGoals,
      }),
    ],
    diversity: deriveDiversityProfile({
      category: first.travelScope === "Domestic" ? "DOMESTIC" : "INTERNATIONAL",
      themes,
      regionThemes: regions.flatMap((region) => region.themes),
      paces: unique(regions.flatMap((region) => region.paces)),
    }),
    evidenceReadiness: isConfident
      ? {
          approvedImageryReferenceCount: 1,
          journeyMomentCount: 3,
          hasQualifiedRegionContent: true,
          hasMaterialContentGap: false,
        }
      : {
          approvedImageryReferenceCount: 0,
          journeyMomentCount: 0,
          hasQualifiedRegionContent: false,
          hasMaterialContentGap: true,
        },
  };
}

export const release1JourneyCandidates: readonly JourneyCandidate[] = [
  ...runtimeJourneyIntelligence.indexes.journeyDNAByDestinationId.entries(),
]
  .map(([destinationId, records]) => buildCandidate(destinationId, records))
  .sort((left, right) => left.id.localeCompare(right.id, "en-US"));

export const release1ExcludedPortfolio: readonly ExcludedPortfolioDestination[] = [
  {
    id: "australia-new-zealand",
    name: "Australia & New Zealand",
    status: "COMING_SOON",
    serviceConfidence: "LIMITED",
    sourceReason:
      "DMC relationships exist, but operations and country-level route approval are incomplete.",
  },
  {
    id: "china",
    name: "China",
    status: "COMING_SOON",
    serviceConfidence: "LIMITED",
    sourceReason:
      "A DMC relationship exists, but no SMV-operated trip or explicit product approval is recorded.",
  },
  {
    id: "east-africa",
    name: "East Africa",
    status: "COMING_SOON",
    serviceConfidence: "LIMITED",
    sourceReason:
      "Country and safari scope, partners, safety standards, and operations require approval.",
  },
  {
    id: "japan",
    name: "Japan",
    status: "COMING_SOON",
    serviceConfidence: "LIMITED",
    sourceReason:
      "A DMC relationship exists, but no SMV-operated trip or explicit product approval is recorded.",
  },
];
