import aliasesJson from "../../generated/journey-itineraries/itinerary-aliases.json";
import catalogueJson from "../../generated/journey-itineraries/itinerary-catalogue.json";
import indexJson from "../../generated/journey-itineraries/itinerary-index.json";

import { normalizeItineraryKey } from "./aliases";
import type {
  DestinationItineraryLookupInput,
  ItineraryAliasesArtifact,
  ItineraryCatalogueArtifact,
  ItineraryIndexArtifact,
  SuggestedItinerary,
} from "./types";

export const itineraryCatalogue = catalogueJson as ItineraryCatalogueArtifact;
export const itineraryIndex = indexJson as ItineraryIndexArtifact;
export const itineraryAliases = aliasesJson as ItineraryAliasesArtifact;

const itineraryById = new Map(itineraryCatalogue.records.map((record) => [record.id, record]));

export function getAllItineraries(): SuggestedItinerary[] {
  return [...itineraryCatalogue.records];
}

export function getItineraryById(itineraryId: string): SuggestedItinerary | undefined {
  return itineraryById.get(itineraryId);
}

const BUSINESS_ROUTE_ORDER = [
  "kerala-munnar", "kerala-munnar-alleppey-kochi", "kerala-wayanad",
  "assam-wildlife-tour", "assam-heritage-city-tour",
  "gujarat-gir-forest", "gujarat-panch-dwarka", "gujarat-rann-of-kutch",
  "himachal-pradesh-shimla-manali", "himachal-pradesh-dharamshala-dalhousie",
  "karnataka-bengaluru", "karnataka-bandipur", "karnataka-coorg", "karnataka-hampi", "karnataka-kabini",
  "northeast-meghalaya", "northeast-sikkim",
  "rajasthan-jaipur-jodhpur-udaipur", "rajasthan-udaipur-kumbhalgarh-mount-abu", "rajasthan-jaipur-jodhpur-jaisalmer",
  "tamil-nadu-chennai", "tamil-nadu-kodaikanal", "tamil-nadu-kotagiri", "tamil-nadu-masinagudi", "tamil-nadu-ooty", "tamil-nadu-temple-tour",
  "malaysia-kuala-lumpur", "malaysia-kuala-lumpur-langkawi",
  "sri-lanka-ramayana-trail", "sri-lanka-southern-circuit", "sri-lanka-north-east-circuit",
  "thailand-bangkok-pattaya", "thailand-phuket-krabi",
  "vietnam-hanoi", "vietnam-phu-quoc", "vietnam-da-nang", "vietnam-ho-chi-minh-city",
] as const;

const businessOrder = new Map<string, number>(BUSINESS_ROUTE_ORDER.map((id, index) => [id, index]));
const statusOrder = { approved: 0, review: 1, draft: 2, archived: 3 } as const;

function records(ids: readonly string[]): SuggestedItinerary[] {
  return [...new Set(ids)].flatMap((id) => {
    const itinerary = itineraryById.get(id);
    return itinerary && itinerary.source.status !== "archived" ? [itinerary] : [];
  });
}

function exactIds(value: string | undefined): string[] {
  if (!value) return [];
  const exact = itineraryById.get(value);
  if (exact) return [exact.id];
  const codeId = itineraryAliases.destinationCodes[value.toUpperCase()];
  if (codeId) return [codeId];
  return itineraryAliases.journeyDirectorRegionIds[value] ?? [];
}

function aliasIds(value: string | undefined): string[] {
  return itineraryAliases.aliases[normalizeItineraryKey(value)] ?? [];
}

function baseMatchRank(itinerary: SuggestedItinerary, input: DestinationItineraryLookupInput): number {
  const signals = [input.destinationName, input.regionName]
    .map(normalizeItineraryKey)
    .filter(Boolean);
  return itinerary.destination.journeyBases.some((base) => signals.includes(normalizeItineraryKey(base))) ? 0 : 1;
}

function sortDestinationItineraries(itineraries: SuggestedItinerary[], input: DestinationItineraryLookupInput): SuggestedItinerary[] {
  return [...itineraries].sort((left, right) =>
    baseMatchRank(left, input) - baseMatchRank(right, input)
    || statusOrder[left.source.status] - statusOrder[right.source.status]
    || (businessOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (businessOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    || left.id.localeCompare(right.id, "en-US"),
  );
}

export function getItinerariesForDestination(input: string | DestinationItineraryLookupInput): SuggestedItinerary[] {
  const lookup = typeof input === "string" ? { destinationId: input } : input;
  const exact = exactIds(lookup.destinationId);
  if (exact.length) return sortDestinationItineraries(records(exact), lookup);

  for (const value of [lookup.destinationName, lookup.regionName]) {
    const aliases = aliasIds(value);
    if (aliases.length) return sortDestinationItineraries(records(aliases), lookup);
  }

  const candidateIds = lookup.destinationId ? itineraryAliases.journeyDirectorCandidateIds[lookup.destinationId] ?? [] : [];
  if (candidateIds.length) return sortDestinationItineraries(records(candidateIds), lookup);

  return sortDestinationItineraries(records(aliasIds(lookup.destinationId)), lookup);
}

export function getDefaultItineraryForDestination(input: string | DestinationItineraryLookupInput, itineraries = getItinerariesForDestination(input)): SuggestedItinerary | undefined {
  if (itineraries.length <= 1) return itineraries[0];
  const lookup = typeof input === "string" ? { destinationId: input } : input;
  const exact = exactIds(lookup.destinationId);
  if (exact.length === 1) return itineraries.find((itinerary) => itinerary.id === exact[0]) ?? itineraries[0];

  const commonParent = itineraries.every((itinerary) => itinerary.destination.parentDestination === itineraries[0].destination.parentDestination)
    ? itineraries[0].destination.parentDestination
    : undefined;
  const defaultId = [lookup.destinationName, lookup.regionName, lookup.destinationId, commonParent]
    .map(normalizeItineraryKey)
    .map((key) => itineraryAliases.parentDefaults[key])
    .find((id) => id && itineraries.some((itinerary) => itinerary.id === id));
  if (defaultId) return itineraries.find((itinerary) => itinerary.id === defaultId);
  return itineraries.find((itinerary) => itinerary.source.status === "approved") ?? itineraries[0];
}
