import { containsPhrase, normalizeItineraryKey } from "./aliases";
import { getItineraryById, itineraryAliases } from "./loader";
import type { ItineraryMatchInput, ItineraryMatchResult, SuggestedItinerary } from "./types";

type MatchType = Exclude<ItineraryMatchResult["matchType"], "none">;

function records(ids: readonly string[]): SuggestedItinerary[] {
  return [...new Set(ids)].flatMap((id) => {
    const record = getItineraryById(id);
    return record ? [record] : [];
  });
}

function signals(input: ItineraryMatchInput): string[] {
  return [input.destinationName, input.regionName, input.primaryDream, ...(input.styles ?? []), ...(input.companions ?? []), input.timing]
    .map(normalizeItineraryKey)
    .filter(Boolean);
}

function terms(itinerary: SuggestedItinerary): string[] {
  return [
    ...itinerary.destination.journeyBases,
    ...itinerary.matching.experienceTags,
    ...itinerary.matching.primaryEmotionTags,
    ...itinerary.matching.companionTypes,
    ...itinerary.matching.relatedDestinations,
  ].map(normalizeItineraryKey).filter(Boolean);
}

function score(itinerary: SuggestedItinerary, inputSignals: string[]): number {
  const bases = itinerary.destination.journeyBases.map(normalizeItineraryKey);
  const allTerms = terms(itinerary);
  const baseMatches = bases.filter((base) => inputSignals.some((signal) => containsPhrase(signal, base))).length;
  const tagMatches = allTerms.filter((term) => inputSignals.some((signal) => containsPhrase(signal, term))).length;
  const unmatchedBases = bases.length - baseMatches;
  return baseMatches * 100 - unmatchedBases * 10 + tagMatches;
}

function select(candidates: SuggestedItinerary[], input: ItineraryMatchInput): SuggestedItinerary | undefined {
  const inputSignals = signals(input);
  return [...candidates].sort((left, right) => score(right, inputSignals) - score(left, inputSignals) || left.id.localeCompare(right.id, "en-US"))[0];
}

function result(candidates: SuggestedItinerary[], selected: SuggestedItinerary | undefined, matchType: MatchType, matchedOn: string): ItineraryMatchResult | undefined {
  return selected ? { itinerary: selected, matchType, matchedOn, consideredItineraryIds: candidates.map((item) => item.id).sort() } : undefined;
}

function explicitAliasIds(input: ItineraryMatchInput): { key: string; ids: string[] } | undefined {
  const destinationIdIsCandidate = Boolean(itineraryAliases.journeyDirectorCandidateIds[input.destinationId]);
  for (const value of [input.destinationName, input.regionName, ...(destinationIdIsCandidate ? [] : [input.destinationId])]) {
    const key = normalizeItineraryKey(value);
    const ids = itineraryAliases.aliases[key];
    if (ids?.length) return { key, ids };
  }
  return undefined;
}

export function findBestItineraryForRecommendation(input: ItineraryMatchInput): ItineraryMatchResult {
  if (input.regionId) {
    const candidates = records(itineraryAliases.journeyDirectorRegionIds[input.regionId] ?? []);
    const match = result(candidates, select(candidates, input), "exact-region", `journey-director-region:${input.regionId}`);
    if (match) return match;
  }

  const exact = getItineraryById(input.destinationId);
  if (exact) return { itinerary: exact, matchType: "exact-destination", matchedOn: `runtime-id:${input.destinationId}`, consideredItineraryIds: [exact.id] };

  const codeId = itineraryAliases.destinationCodes[input.destinationId.toUpperCase()];
  const code = codeId ? getItineraryById(codeId) : undefined;
  if (code) return { itinerary: code, matchType: "destination-code", matchedOn: `destination-code:${input.destinationId.toUpperCase()}`, consideredItineraryIds: [code.id] };

  const alias = explicitAliasIds(input);
  if (alias) {
    const candidates = records(alias.ids);
    const match = result(candidates, select(candidates, input), "alias", `canonical-alias:${alias.key}`);
    if (match) return match;
  }

  const parentCandidates = records(itineraryAliases.journeyDirectorCandidateIds[input.destinationId] ?? []);
  const inputSignals = signals(input);
  const baseCandidates = parentCandidates.filter((candidate) => candidate.destination.journeyBases.some((base) => inputSignals.some((signal) => containsPhrase(signal, normalizeItineraryKey(base)))));
  if (baseCandidates.length) {
    const match = result(baseCandidates, select(baseCandidates, input), "parent-destination", `candidate-and-base:${input.destinationId}`);
    if (match) return match;
  }

  const fitted = parentCandidates.filter((candidate) => score(candidate, inputSignals) > 0);
  if (fitted.length) {
    const match = result(fitted, select(fitted, input), "tag-fit", `candidate-and-governed-tags:${input.destinationId}`);
    if (match) return match;
  }

  const defaultId = itineraryAliases.parentDefaults[normalizeItineraryKey(input.destinationName)]
    ?? itineraryAliases.parentDefaults[normalizeItineraryKey(input.regionName)]
    ?? select(parentCandidates, input)?.id;
  const fallback = defaultId ? getItineraryById(defaultId) : undefined;
  if (fallback) return { itinerary: fallback, matchType: "default", matchedOn: `parent-default:${input.destinationId}`, consideredItineraryIds: parentCandidates.map((item) => item.id).sort() };

  return { itinerary: undefined, matchType: "none", matchedOn: "no-governed-mapping", consideredItineraryIds: [] };
}
