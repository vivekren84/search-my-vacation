import type { DestinationItineraryLookupInput, SuggestedItinerary } from "./types";
import { getDefaultItineraryForDestination } from "./loader";

const PUBLIC_LABELS: Readonly<Record<string, string>> = {
  "kerala-munnar": "Munnar",
  "kerala-munnar-alleppey-kochi": "Munnar, Alleppey & Kochi",
  "kerala-wayanad": "Wayanad",
  "assam-wildlife-tour": "Wildlife Tour",
  "assam-heritage-city-tour": "Heritage & City Tour",
  "gujarat-gir-forest": "Gir Forest",
  "gujarat-panch-dwarka": "Panch Dwarka",
  "gujarat-rann-of-kutch": "Rann of Kutch",
  "himachal-pradesh-shimla-manali": "Shimla & Manali",
  "himachal-pradesh-dharamshala-dalhousie": "Dharamshala & Dalhousie",
  "northeast-meghalaya": "Meghalaya",
  "northeast-sikkim": "Sikkim",
  "rajasthan-jaipur-jodhpur-udaipur": "Jaipur, Jodhpur & Udaipur",
  "rajasthan-udaipur-kumbhalgarh-mount-abu": "Udaipur, Kumbhalgarh & Mount Abu",
  "rajasthan-jaipur-jodhpur-jaisalmer": "Jaipur, Jodhpur & Jaisalmer",
  "tamil-nadu-chennai": "Chennai City",
  "tamil-nadu-kodaikanal": "Kodaikanal",
  "tamil-nadu-kotagiri": "Kotagiri",
  "tamil-nadu-masinagudi": "Masinagudi",
  "tamil-nadu-ooty": "Ooty",
  "tamil-nadu-temple-tour": "Temple Tour",
  "malaysia-kuala-lumpur": "Kuala Lumpur",
  "malaysia-kuala-lumpur-langkawi": "Kuala Lumpur & Langkawi",
  "sri-lanka-ramayana-trail": "Ramayana Trail",
  "sri-lanka-southern-circuit": "Southern Circuit",
  "sri-lanka-north-east-circuit": "North-East Circuit",
  "thailand-bangkok-pattaya": "Bangkok & Pattaya",
  "thailand-phuket-krabi": "Phuket & Krabi",
  "vietnam-hanoi": "Hanoi",
  "vietnam-phu-quoc": "Phu Quoc",
  "vietnam-da-nang": "Da Nang & Hoi An",
  "vietnam-ho-chi-minh-city": "Ho Chi Minh City",
};

export function publicItineraryLabel(itinerary: SuggestedItinerary): string {
  return PUBLIC_LABELS[itinerary.id] ?? itinerary.destination.displayName;
}

export type DestinationItinerarySelection = {
  destinationId: string;
  itineraryId: string | undefined;
};

export function resolveDestinationItinerarySelection(input: {
  previous: DestinationItinerarySelection | undefined;
  destinationId: string;
  requestedItineraryId?: string;
  lookup: DestinationItineraryLookupInput;
  itineraries: SuggestedItinerary[];
}): DestinationItinerarySelection {
  const validIds = new Set(input.itineraries.map((itinerary) => itinerary.id));
  if (input.requestedItineraryId && validIds.has(input.requestedItineraryId)) {
    return { destinationId: input.destinationId, itineraryId: input.requestedItineraryId };
  }
  if (input.previous?.destinationId === input.destinationId && input.previous.itineraryId && validIds.has(input.previous.itineraryId)) {
    return input.previous;
  }
  return {
    destinationId: input.destinationId,
    itineraryId: getDefaultItineraryForDestination(input.lookup, input.itineraries)?.id,
  };
}
