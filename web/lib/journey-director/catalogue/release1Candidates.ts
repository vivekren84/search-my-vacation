import type {
  CandidateEvidence,
  ComfortLevel,
  EmotionId,
  JourneyCandidate,
  RegionCandidate,
  SignatureExperience,
  ThemeId,
  TravelPace,
  TravellerType,
} from "../engine/engine.types";
import type { ExcludedPortfolioDestination, RuntimeCatalogueMetadata } from "./catalogue.types";
import {
  UNKNOWN_SEASONALITY,
  PREFERRED_SEASONALITY,
  bestFor,
  classifyConcerns,
  deriveDiversityProfile,
  deriveMemoryGoals,
  type CatalogueRegionSource,
} from "./catalogue.mappings";

export const RELEASE1_CATALOGUE_METADATA: RuntimeCatalogueMetadata = Object.freeze({
  catalogueVersion: "release-1.0.0",
  catalogueEffectiveFrom: "2026-07-23",
  catalogueReviewValidUntil: "2026-08-22",
  sourceDocument: "docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md",
  sourceDocumentVersion: "v1.0.1",
  sourceDocumentLastUpdated: "2026-07-22",
  operationalSnapshotId: "release-1-supported-baseline-2026-07-23",
  neutralLogisticalFit: 0.5,
  confidentApprovalCandidateIds: ["bali", "goa", "kerala", "sri-lanka", "vizag"],
});

type CatalogueCandidateSource = {
  id: string;
  name: string;
  aliases: readonly string[];
  category: "DOMESTIC" | "INTERNATIONAL";
  primaryEmotion: EmotionId;
  supportingEmotions: readonly EmotionId[];
  themes: readonly ThemeId[];
  bestFor: readonly TravellerType[];
  paces: readonly TravelPace[];
  comforts: readonly ComfortLevel[];
  identity: string;
  tradeOffs: readonly string[];
  regions: readonly CatalogueRegionSource[];
  evidenceIds?: readonly [string, string];
  serviceConfidence?: "SUPPORTED" | "CONFIDENT";
  presentationReadiness?: {
    approvedImageryReferenceCount: number;
    journeyMomentCount: number;
    hasQualifiedRegionContent: boolean;
    hasMaterialContentGap: boolean;
  };
  seasonality?: readonly import("../engine/engine.types").SeasonalWindow[];
};

function evidence(
  id: string,
  explanation: string,
  values: Omit<CandidateEvidence, "id" | "explanation">,
): CandidateEvidence {
  return { id, explanation, ...values };
}

function signatureExperience(
  candidateId: string,
  region: CatalogueRegionSource,
): SignatureExperience {
  return {
    id: `${candidateId}-${region.id}-governed-experience`,
    themes: region.themes,
    emotions: [region.primaryEmotion, ...region.supportingEmotions],
    memoryGoals: deriveMemoryGoals(region.themes),
  };
}

function buildRegion(candidateId: string, source: CatalogueRegionSource): RegionCandidate {
  const memoryGoals = deriveMemoryGoals(source.themes);
  const experience = signatureExperience(candidateId, source);

  return {
    id: source.id,
    name: source.name,
    status: "ACTIVE",
    dataQuality: "COMPLETE",
    reviewValidUntil: RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil,
    primaryEmotion: source.primaryEmotion,
    supportingEmotions: source.supportingEmotions,
    themes: source.themes,
    bestFor: bestFor(source.bestFor),
    paces: source.paces,
    comforts: source.comforts,
    seasonality: source.seasonality ?? UNKNOWN_SEASONALITY,
    memoryGoals,
    signatureExperiences: [experience],
    logisticalFit: source.logisticalFit ?? RELEASE1_CATALOGUE_METADATA.neutralLogisticalFit,
    concerns: classifyConcerns(source.id, source.tradeOffs ?? []),
    evidence: [
      evidence(
        `${source.id}-identity`,
        source.sourceNote,
        { emotions: [source.primaryEmotion, ...source.supportingEmotions] },
      ),
      evidence(
        `${source.id}-themes`,
        "The approved region themes support these governed experience and memory classifications.",
        { themes: source.themes, memoryGoals },
      ),
    ],
  };
}

function buildCandidate(source: CatalogueCandidateSource): JourneyCandidate {
  const regions = source.regions.map((region) => buildRegion(source.id, region));
  const memoryGoals = deriveMemoryGoals(source.themes);
  const evidenceIds = source.evidenceIds ?? [`${source.id}-identity`, `${source.id}-themes`];

  return {
    id: source.id,
    name: source.name,
    aliases: source.aliases,
    category: source.category,
    status: "ACTIVE",
    serviceConfidence: source.serviceConfidence ?? "SUPPORTED",
    dataQuality: "COMPLETE",
    reviewValidUntil: RELEASE1_CATALOGUE_METADATA.catalogueReviewValidUntil,
    primaryEmotion: source.primaryEmotion,
    supportingEmotions: source.supportingEmotions,
    themes: source.themes,
    bestFor: bestFor(source.bestFor),
    paces: source.paces,
    comforts: source.comforts,
    seasonality: source.seasonality ?? UNKNOWN_SEASONALITY,
    memoryGoals,
    signatureExperiences: regions.flatMap((region) => region.signatureExperiences),
    regions,
    concerns: classifyConcerns(source.id, source.tradeOffs),
    evidence: [
      evidence(evidenceIds[0], source.identity, {
        emotions: [source.primaryEmotion, ...source.supportingEmotions],
      }),
      evidence(
        evidenceIds[1],
        "The approved destination themes support these governed experience and memory classifications.",
        { themes: source.themes, memoryGoals },
      ),
    ],
    diversity: deriveDiversityProfile({
      category: source.category,
      themes: source.themes,
      regionThemes: regions.flatMap((region) => region.themes),
      paces: source.paces,
    }),
    evidenceReadiness: source.presentationReadiness ?? {
      approvedImageryReferenceCount: 0,
      journeyMomentCount: 0,
      hasQualifiedRegionContent: false,
      hasMaterialContentGap: true,
    },
  };
}

const domestic = (source: Omit<CatalogueCandidateSource, "category">) =>
  buildCandidate({ ...source, category: "DOMESTIC" });
const international = (source: Omit<CatalogueCandidateSource, "category">) =>
  buildCandidate({ ...source, category: "INTERNATIONAL" });

export const release1JourneyCandidates: readonly JourneyCandidate[] = [
  domestic({
    id: "agra", name: "Agra", aliases: ["Tajganj", "Taj Mahal"],
    primaryEmotion: "majesty", supportingEmotions: ["wonder", "romance", "gratitude"],
    themes: ["heritage", "architecture", "culture", "food"], bestFor: ["couple", "family"],
    paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"],
    identity: "Monumental heritage made personal through awe, history, and romance.",
    tradeOffs: ["A rushed day trip and crowd or road conditions can reduce the intended pace."],
    regions: [{ id: "agra-tajganj", name: "Taj East Gate / Tajganj", primaryEmotion: "wonder", supportingEmotions: ["romance"], themes: ["heritage", "architecture", "culture"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "The approved region prioritises proximity and an atmospheric monument experience.", tradeOffs: ["Crowd and road conditions can affect a relaxed pace."] }],
  }),
  domestic({
    id: "amritsar", name: "Amritsar", aliases: ["Golden Temple"],
    primaryEmotion: "gratitude", supportingEmotions: ["spirituality", "discovery", "reconnection"],
    themes: ["spiritual", "heritage", "food", "culture"], bestFor: ["family", "solo-traveller"],
    paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"],
    identity: "A deeply felt journey of faith, history, hospitality, and food.",
    tradeOffs: ["Sacred experiences require respectful framing; border ceremony crowds may not suit every traveller."],
    regions: [{ id: "amritsar-golden-temple", name: "Golden Temple precinct", primaryEmotion: "gratitude", supportingEmotions: ["spirituality", "reconnection"], themes: ["spiritual", "heritage", "culture", "food"], bestFor: ["family", "solo-traveller"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "The Golden Temple precinct is the approved emotional heart of a reflective Amritsar journey." }],
  }),
  domestic({
    id: "andaman", name: "Andaman", aliases: ["Havelock", "Swaraj Dweep", "Neil Island"],
    primaryEmotion: "escape", supportingEmotions: ["relaxation", "romance", "wonder", "adventure"],
    themes: ["islands", "beaches", "water-sports", "nature"], bestFor: ["couple", "family", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "An island escape where sea, nature, and distance from routine create release.",
    tradeOffs: ["Inter-island logistics can create fatigue and weather can disrupt movement."],
    regions: [{ id: "andaman-swaraj-dweep", name: "Swaraj Dweep (Havelock)", primaryEmotion: "escape", supportingEmotions: ["romance", "relaxation"], themes: ["islands", "beaches", "water-sports", "nature"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "Swaraj Dweep is the approved primary region for a polished island-and-beach experience.", tradeOffs: ["Inter-island transfer conditions require live validation."] }],
  }),
  international({
    id: "bali", name: "Bali", aliases: ["Ubud", "Nusa Dua", "Seminyak"],
    primaryEmotion: "reconnection", supportingEmotions: ["serenity", "romance", "discovery", "joy"],
    themes: ["culture", "nature", "wellness", "beaches", "food", "slow-travel"], bestFor: ["couple", "family", "friends", "solo-traveller"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "Reconnection through living culture, nature, wellness, coast, and a restorative or celebratory rhythm.",
    tradeOffs: ["Traffic can make apparently short distances tiring; region choice is decisive."], evidenceIds: ["bali-reconnection", "bali-variety"],
    serviceConfidence: "CONFIDENT",
    presentationReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 3, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
    seasonality: PREFERRED_SEASONALITY,
    regions: [{ id: "bali-ubud", name: "Ubud", primaryEmotion: "reconnection", supportingEmotions: ["serenity", "discovery"], themes: ["culture", "nature", "wellness", "food", "slow-travel"], bestFor: ["couple", "family", "solo-traveller"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "Ubud is the approved primary choice for culture, nature, wellbeing, and a slower emotional centre.", logisticalFit: 0.9, seasonality: PREFERRED_SEASONALITY, tradeOffs: ["Traffic and road movement can affect a relaxed pace."] }],
  }),
  international({
    id: "dubai", name: "Dubai", aliases: ["Downtown Dubai", "Palm Jumeirah"],
    primaryEmotion: "indulgence", supportingEmotions: ["wonder", "celebration", "joy", "majesty"],
    themes: ["city-break", "luxury", "shopping", "desert", "family-attractions", "architecture"], bestFor: ["family", "couple", "friends", "corporate-group"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "Polished urban wonder where landmark experiences, family ease, desert contrast, and premium comfort meet.",
    tradeOffs: ["Travel time between areas and outdoor heat must be planned honestly."],
    regions: [{ id: "dubai-downtown", name: "Downtown Dubai", primaryEmotion: "wonder", supportingEmotions: ["majesty", "indulgence"], themes: ["city-break", "architecture", "shopping", "luxury", "family-attractions"], bestFor: ["family", "couple"], paces: ["balanced", "explorer"], comforts: ["balanced", "premium"], sourceNote: "Downtown Dubai is approved for iconic skyline, landmark access, and polished city energy.", tradeOffs: ["Travel time between city areas can create pace friction."] }],
  }),
  domestic({
    id: "goa", name: "Goa", aliases: ["South Goa", "North Goa", "Panaji"],
    primaryEmotion: "relaxation", supportingEmotions: ["joy", "celebration", "freedom", "reconnection"],
    themes: ["beaches", "food", "nightlife", "wellness", "heritage", "culture"], bestFor: ["couple", "family", "friends", "solo-traveller", "corporate-group"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "Easy coastal joy with multiple personalities, from celebration to quiet restoration.",
    tradeOffs: ["Selecting the wrong coast or a party area can invert the intended journey."],
    serviceConfidence: "CONFIDENT",
    presentationReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 3, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
    regions: [{ id: "goa-south", name: "South Goa", primaryEmotion: "relaxation", supportingEmotions: ["reconnection", "joy"], themes: ["beaches", "wellness", "food", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "South Goa is approved for quieter resort time and a slower beach rhythm.", logisticalFit: 0.8 }],
  }),
  domestic({
    id: "gujarat", name: "Gujarat", aliases: ["Ahmedabad", "Kutch", "Gir"],
    primaryEmotion: "discovery", supportingEmotions: ["majesty", "gratitude", "wonder"],
    themes: ["heritage", "culture", "wildlife", "spiritual", "desert", "architecture"], bestFor: ["family"],
    paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "A varied discovery journey joining living culture, monumental heritage, sacred places, wildlife, and open landscapes.",
    tradeOffs: ["Distances are substantial and require a focused route."],
    regions: [{ id: "gujarat-ahmedabad", name: "Ahmedabad and heritage corridor", primaryEmotion: "discovery", supportingEmotions: ["majesty"], themes: ["heritage", "culture", "architecture", "food"], bestFor: ["family"], paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Ahmedabad is the approved introduction to design, history, and urban culture.", tradeOffs: ["Long road sectors require a focused route."] }],
  }),
  domestic({
    id: "himachal-pradesh", name: "Himachal Pradesh", aliases: ["Shimla", "Manali", "Dharamshala"],
    primaryEmotion: "freedom", supportingEmotions: ["serenity", "adventure", "reconnection", "awe"],
    themes: ["mountains", "nature", "road-trips", "adventure", "forests", "scenic-drives"], bestFor: ["couple", "family", "friends", "solo-traveller"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "Mountain freedom expressed through scenic roads, forest stays, adventure, and restorative air.",
    tradeOffs: ["Transfer time, altitude, and winding roads may not suit every guest."],
    regions: [{ id: "himachal-shimla-mashobra", name: "Shimla / Mashobra", primaryEmotion: "relaxation", supportingEmotions: ["serenity", "reconnection"], themes: ["mountains", "forests", "nature", "scenic-drives"], bestFor: ["family", "couple"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "Shimla and Mashobra are approved for gentler exploration and accessible hill-station character.", tradeOffs: ["Winding road transfers are part of the journey."] }],
  }),
  domestic({
    id: "hyderabad", name: "Hyderabad", aliases: ["Charminar", "Old City"],
    primaryEmotion: "discovery", supportingEmotions: ["joy", "curiosity", "majesty"],
    themes: ["food", "heritage", "architecture", "shopping", "city-break"], bestFor: ["family", "friends", "couple", "corporate-group"],
    paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "A compact city discovery shaped by food, layered history, monumental architecture, and modern energy.",
    tradeOffs: ["Traffic and heat can undermine an overfilled itinerary."],
    regions: [{ id: "hyderabad-old-city", name: "Old City / Charminar", primaryEmotion: "discovery", supportingEmotions: ["curiosity", "joy"], themes: ["food", "heritage", "architecture", "shopping", "city-break"], bestFor: ["family", "friends", "couple"], paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Old City is the approved emotional centre for history, food, and street-level culture.", tradeOffs: ["Traffic and crowds can create pace friction."] }],
  }),
  domestic({
    id: "karnataka", name: "Karnataka", aliases: ["Coorg", "Mysuru", "Hampi"],
    primaryEmotion: "discovery", supportingEmotions: ["wonder", "serenity", "reconnection"],
    themes: ["heritage", "coffee-estates", "nature", "beaches", "culture"], bestFor: ["family", "couple", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "Layered discovery across royal cities, ancient ruins, coffee hills, forests, and coast.",
    tradeOffs: ["The state requires one coherent route rather than a generic recommendation."],
    regions: [{ id: "karnataka-coorg", name: "Coorg", primaryEmotion: "reconnection", supportingEmotions: ["serenity"], themes: ["coffee-estates", "nature", "forests", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "Coorg is approved for coffee landscapes, nature, and a relaxed stay." }],
  }),
  domestic({
    id: "kashmir", name: "Kashmir", aliases: ["Srinagar", "Pahalgam", "Gulmarg"],
    primaryEmotion: "awe", supportingEmotions: ["romance", "serenity", "wonder", "reconnection"],
    themes: ["mountains", "lakes", "nature", "scenic-drives"], bestFor: ["couple", "family"],
    paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"],
    identity: "Landscape-led awe softened by lakes, gardens, valleys, and generous pauses.",
    tradeOffs: ["Seasonal access, road conditions, and external conditions may change quickly."],
    regions: [{ id: "kashmir-pahalgam", name: "Pahalgam", primaryEmotion: "reconnection", supportingEmotions: ["serenity", "awe"], themes: ["mountains", "nature", "scenic-drives", "slow-travel"], bestFor: ["family", "couple"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "Pahalgam is approved for valley calm and slower nature-led time.", tradeOffs: ["Road access requires current validation."] }],
  }),
  domestic({
    id: "kerala", name: "Kerala", aliases: ["Alappuzha", "Alleppey", "Munnar", "Kumarakom"],
    primaryEmotion: "relaxation", supportingEmotions: ["reconnection", "serenity", "escape", "discovery"],
    themes: ["backwaters", "hills", "wellness", "nature", "culture", "food", "slow-travel", "local-communities"], bestFor: ["couple", "family", "solo-traveller"],
    paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"],
    identity: "Reconnection through water, green landscapes, wellness, culture, and an unhurried rhythm.",
    tradeOffs: ["A rushed multi-stop route can undermine Kerala's strongest emotional promise."], evidenceIds: ["kerala-calm", "kerala-memory"],
    serviceConfidence: "CONFIDENT",
    presentationReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 3, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
    seasonality: PREFERRED_SEASONALITY,
    regions: [{ id: "kerala-alappuzha", name: "Alappuzha", primaryEmotion: "relaxation", supportingEmotions: ["reconnection", "serenity", "discovery"], themes: ["backwaters", "nature", "slow-travel", "food", "local-communities"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "Alappuzha is approved for an iconic moving backwater experience with realistic route and vessel expectations.", logisticalFit: 0.95, seasonality: PREFERRED_SEASONALITY, tradeOffs: ["An unhurried Kerala route needs enough time between stays."] }],
  }),
  international({
    id: "malaysia", name: "Malaysia", aliases: ["Penang", "George Town", "Langkawi", "Kuala Lumpur"],
    primaryEmotion: "discovery", supportingEmotions: ["curiosity", "joy", "escape", "wonder"],
    themes: ["city-break", "food", "islands", "nature", "culture", "heritage"], bestFor: ["family", "couple", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "Approachable discovery through multicultural cities, food, heritage streets, islands, and rainforest contrasts.",
    tradeOffs: ["A clear city, heritage, or island route is required; coast conditions differ."],
    regions: [{ id: "malaysia-penang", name: "Penang / George Town", primaryEmotion: "discovery", supportingEmotions: ["joy", "curiosity"], themes: ["food", "culture", "heritage", "architecture", "city-break"], bestFor: ["couple", "friends"], paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Penang is approved for layered heritage, street food, and neighbourhood exploration." }],
  }),
  domestic({
    id: "northeast", name: "Northeast", aliases: ["Meghalaya", "Sikkim", "Darjeeling"],
    primaryEmotion: "wonder", supportingEmotions: ["discovery", "serenity", "freedom", "adventure"],
    themes: ["hills", "nature", "culture", "road-trips", "scenic-drives", "villages"], bestFor: ["couple", "family", "friends", "solo-traveller"],
    paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "Distinct Himalayan and hill journeys united by wonder, living culture, and scenic discovery.",
    tradeOffs: ["Road journeys can be long and the collection must not be presented as one homogeneous place."],
    regions: [{ id: "northeast-meghalaya-shillong-sohra", name: "Meghalaya — Shillong / Sohra", primaryEmotion: "wonder", supportingEmotions: ["discovery", "adventure"], themes: ["hills", "nature", "road-trips", "scenic-drives", "villages", "culture"], bestFor: ["family", "friends"], paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Shillong and Sohra are approved for waterfalls, living landscapes, music, and road-led exploration.", tradeOffs: ["Road journeys can be long."] }],
  }),
  domestic({
    id: "pondicherry", name: "Pondicherry", aliases: ["Puducherry", "White Town"],
    primaryEmotion: "serenity", supportingEmotions: ["romance", "discovery", "reconnection"],
    themes: ["heritage", "food", "beaches", "slow-travel", "architecture", "culture"], bestFor: ["couple", "solo-traveller", "friends", "family"],
    paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"],
    identity: "A small-scale coastal pause shaped by heritage streets, cafes, reflection, and slow days.",
    tradeOffs: ["The shoreline is not interchangeable with a resort beach holiday."],
    regions: [{ id: "pondicherry-white-town", name: "French Quarter / White Town", primaryEmotion: "romance", supportingEmotions: ["discovery", "serenity"], themes: ["heritage", "architecture", "food", "slow-travel", "culture"], bestFor: ["couple", "solo-traveller"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "White Town is the approved primary region for walkable heritage character." }],
  }),
  domestic({
    id: "assam", name: "Assam", aliases: ["Kaziranga", "Majuli", "Guwahati"],
    primaryEmotion: "discovery", supportingEmotions: ["wonder", "adventure", "gratitude"],
    themes: ["rivers", "tea-estates", "wildlife", "culture", "nature"], bestFor: ["family", "couple"],
    paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "A river-and-land journey of tea, wildlife, culture, and broad landscapes.",
    tradeOffs: ["Distances and seasonal conditions require a focused route; wildlife sightings are not guaranteed."],
    regions: [{ id: "assam-kaziranga", name: "Kaziranga", primaryEmotion: "adventure", supportingEmotions: ["wonder", "discovery"], themes: ["wildlife", "safari", "nature", "photography"], bestFor: ["family", "couple"], paces: ["balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Kaziranga is approved for responsible wildlife discovery during confirmed operating periods.", tradeOffs: ["Road distances require a focused route."] }],
  }),
  domestic({
    id: "rajasthan", name: "Rajasthan", aliases: ["Udaipur", "Jaipur", "Jodhpur", "Jaisalmer"],
    primaryEmotion: "majesty", supportingEmotions: ["celebration", "romance", "discovery", "wonder"],
    themes: ["heritage", "architecture", "desert", "culture", "food", "shopping", "luxury"], bestFor: ["couple", "family", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "Majesty expressed through forts, palaces, desert horizons, colour, craft, and living culture.",
    tradeOffs: ["Excessive city-hopping creates fatigue; the route needs emotional coherence."],
    regions: [{ id: "rajasthan-udaipur", name: "Udaipur", primaryEmotion: "romance", supportingEmotions: ["serenity", "majesty"], themes: ["lakes", "heritage", "architecture", "luxury", "food"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["balanced", "premium"], sourceNote: "Udaipur is approved for lake-led beauty, slower luxury, and shared celebration.", tradeOffs: ["City-hopping can create transfer fatigue."] }],
  }),
  international({
    id: "singapore", name: "Singapore", aliases: ["Marina Bay", "Sentosa", "Singapore River"],
    primaryEmotion: "curiosity", supportingEmotions: ["wonder", "joy", "discovery", "indulgence"],
    themes: ["family-attractions", "city-break", "food", "shopping", "architecture", "culture"], bestFor: ["family", "couple"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "Effortless curiosity in a compact city where design, neighbourhood culture, food, nature, and family attractions coexist.",
    tradeOffs: ["Attraction-heavy schedules can become exhausting and transactional."],
    regions: [{ id: "singapore-civic-district", name: "Civic District / Singapore River", primaryEmotion: "discovery", supportingEmotions: ["majesty", "curiosity"], themes: ["heritage", "architecture", "culture", "food", "city-break"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"], sourceNote: "The Civic District is approved for heritage, museums, and walkable city context." }],
  }),
  international({
    id: "sri-lanka", name: "Sri Lanka", aliases: ["Galle", "Bentota", "Ella", "Kandy"],
    primaryEmotion: "discovery", supportingEmotions: ["serenity", "wonder", "reconnection", "adventure"],
    themes: ["culture", "wildlife", "hills", "beaches", "scenic-drives", "heritage", "food", "nature"], bestFor: ["couple", "family", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "A varied discovery journey through heritage, hills, wildlife, coast, and warm local character.",
    tradeOffs: ["Short map distances can involve slow roads and excessive coverage weakens the journey."], evidenceIds: ["sri-lanka-coast", "sri-lanka-culture"],
    serviceConfidence: "CONFIDENT",
    presentationReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 3, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
    seasonality: PREFERRED_SEASONALITY,
    regions: [{ id: "sri-lanka-bentota-galle", name: "Bentota and Galle", primaryEmotion: "discovery", supportingEmotions: ["relaxation", "escape", "serenity"], themes: ["beaches", "culture", "heritage", "nature", "food", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "The approved combination pairs a straightforward coastal finish with Galle's heritage-and-coast contrast.", logisticalFit: 0.85, seasonality: PREFERRED_SEASONALITY, tradeOffs: ["Slow roads need a contained route."] }],
  }),
  domestic({
    id: "tamil-nadu", name: "Tamil Nadu", aliases: ["Ooty", "Kotagiri", "Kodaikanal", "Madurai"],
    primaryEmotion: "spirituality", supportingEmotions: ["discovery", "gratitude", "serenity", "wonder"],
    themes: ["spiritual", "heritage", "hills", "beaches", "food", "architecture"], bestFor: ["family", "couple"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"],
    identity: "A culturally rooted journey joining sacred architecture, living heritage, food, coast, and restorative hills.",
    tradeOffs: ["Sacred routes and hill retreats serve different intents and need a clear journey story."],
    regions: [{ id: "tamil-nadu-madurai", name: "Madurai", primaryEmotion: "spirituality", supportingEmotions: ["discovery", "gratitude"], themes: ["spiritual", "heritage", "architecture", "food", "culture"], bestFor: ["family", "couple"], paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Madurai is approved for living temple culture and food with appropriate preparation for sensory intensity." }],
  }),
  international({
    id: "thailand", name: "Thailand", aliases: ["Krabi", "Bangkok", "Phuket", "Chiang Mai"],
    primaryEmotion: "freedom", supportingEmotions: ["joy", "relaxation", "celebration", "discovery"],
    themes: ["beaches", "islands", "food", "culture", "nightlife", "wellness", "city-break"], bestFor: ["couple", "family", "friends", "solo-traveller"],
    paces: ["relaxed", "balanced", "explorer", "fast-paced"], comforts: ["simple", "balanced", "premium"],
    identity: "Freedom to combine city energy, food culture, islands, beaches, wellness, nightlife, and northern discovery.",
    tradeOffs: ["The wrong beach base can conflict with the desired emotion; avoid overloading island transfers."],
    regions: [{ id: "thailand-krabi", name: "Krabi / Ao Nang / Railay access", primaryEmotion: "escape", supportingEmotions: ["wonder", "relaxation"], themes: ["beaches", "islands", "nature", "water-sports", "scenic-drives"], bestFor: ["couple", "family", "friends"], paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Krabi is approved for limestone scenery, island experiences, and a landscape-led beach journey.", tradeOffs: ["Island transfers require current validation."] }],
  }),
  international({
    id: "vietnam", name: "Vietnam", aliases: ["Hoi An", "Hanoi", "Da Nang", "Ho Chi Minh City"],
    primaryEmotion: "discovery", supportingEmotions: ["curiosity", "wonder", "freedom", "joy"],
    themes: ["culture", "food", "heritage", "nature", "city-break", "photography"], bestFor: ["couple", "friends", "family", "solo-traveller"],
    paces: ["balanced", "explorer", "fast-paced"], comforts: ["simple", "balanced", "premium"],
    identity: "Layered discovery through food, history, energetic cities, heritage towns, dramatic landscapes, and a strong sense of place.",
    tradeOffs: ["Domestic movement can consume the journey; a focused regional route may outperform national coverage."],
    regions: [{ id: "vietnam-hoi-an", name: "Hoi An", primaryEmotion: "romance", supportingEmotions: ["discovery", "joy"], themes: ["heritage", "culture", "food", "photography", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced", "explorer"], comforts: ["simple", "balanced", "premium"], sourceNote: "Hoi An is approved for heritage, food, craft, and a slower central-Vietnam base." }],
  }),
  domestic({
    id: "vizag", name: "Vizag", aliases: ["Visakhapatnam", "Rushikonda", "Araku"],
    primaryEmotion: "relaxation", supportingEmotions: ["joy", "discovery", "reconnection"],
    themes: ["beaches", "hills", "city-break", "scenic-drives", "nature"], bestFor: ["family", "couple", "friends"],
    paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"],
    identity: "An easy coastal break where beaches, hills, city comforts, and scenic drives coexist.",
    tradeOffs: ["The recommendation must distinguish a city beach break from a secluded resort escape."],
    serviceConfidence: "CONFIDENT",
    presentationReadiness: { approvedImageryReferenceCount: 1, journeyMomentCount: 3, hasQualifiedRegionContent: true, hasMaterialContentGap: false },
    regions: [{ id: "vizag-rushikonda", name: "Rushikonda / northern coast", primaryEmotion: "relaxation", supportingEmotions: ["freedom", "joy"], themes: ["beaches", "nature", "scenic-drives", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced"], comforts: ["simple", "balanced", "premium"], sourceNote: "Rushikonda is approved for a more leisure-led coastal base, subject to live beach conditions." }],
  }),
  domestic({
    id: "wildlife", name: "Wildlife", aliases: ["Kabini", "Corbett", "Bandipur", "Masinagudi"],
    primaryEmotion: "adventure", supportingEmotions: ["wonder", "discovery", "gratitude", "reconnection"],
    themes: ["safari", "wildlife", "forests", "photography", "nature"], bestFor: ["family", "couple", "friends"],
    paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"],
    identity: "Forest journeys where anticipation, observation, and respect for the natural world create adventure.",
    tradeOffs: ["Sightings are never guaranteed; rough tracks and permit constraints must be explained."],
    regions: [{ id: "wildlife-kabini", name: "Kabini", primaryEmotion: "wonder", supportingEmotions: ["reconnection", "adventure"], themes: ["wildlife", "safari", "forests", "nature", "photography", "slow-travel"], bestFor: ["couple", "family"], paces: ["relaxed", "balanced", "explorer"], comforts: ["balanced", "premium"], sourceNote: "Kabini is approved for a lodge-led, nature-immersive stay with balanced comfort where available." }],
  }),
].sort((left, right) => left.id.localeCompare(right.id, "en-US"));

export const release1ExcludedPortfolio: readonly ExcludedPortfolioDestination[] = [
  { id: "australia-new-zealand", name: "Australia & New Zealand", status: "COMING_SOON", serviceConfidence: "LIMITED", sourceReason: "DMC relationships exist, but operations and country-level route approval are incomplete." },
  { id: "china", name: "China", status: "COMING_SOON", serviceConfidence: "LIMITED", sourceReason: "A DMC relationship exists, but no SMV-operated trip or explicit product approval is recorded." },
  { id: "east-africa", name: "East Africa", status: "COMING_SOON", serviceConfidence: "LIMITED", sourceReason: "Country and safari scope, partners, safety standards, and operations require approval." },
  { id: "japan", name: "Japan", status: "COMING_SOON", serviceConfidence: "LIMITED", sourceReason: "A DMC relationship exists, but no SMV-operated trip or explicit product approval is recorded." },
];
