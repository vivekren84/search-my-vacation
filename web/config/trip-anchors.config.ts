/**
 * Consultative Trip Anchors Configuration (Release 1.4 — PO-02)
 *
 * Governs indicative 'Typical Journey Shape' metadata across destination and
 * inspiration cards, establishing clear expectations around duration, season,
 * rhythm, and stay style without rigid package pricing.
 */

export interface TripAnchorMetadata {
  duration: string;
  bestMonths: string;
  pace: "Unhurried" | "Balanced" | "Active";
  comfortTier: "Boutique Stays" | "Curated Luxury" | "Experiential Retreats";
}

export const TRIP_ANCHORS_BY_DESTINATION: Readonly<Record<string, TripAnchorMetadata>> = {
  // India Core Destinations
  agra: {
    duration: "2–3 Days",
    bestMonths: "Oct – Mar",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  amritsar: {
    duration: "3–4 Days",
    bestMonths: "Oct – Mar",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  andaman: {
    duration: "6–8 Days",
    bestMonths: "Oct – May",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  assam: {
    duration: "5–7 Days",
    bestMonths: "Nov – Apr",
    pace: "Balanced",
    comfortTier: "Experiential Retreats",
  },
  goa: {
    duration: "4–6 Days",
    bestMonths: "Oct – Apr",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  gujarat: {
    duration: "6–9 Days",
    bestMonths: "Nov – Mar",
    pace: "Balanced",
    comfortTier: "Experiential Retreats",
  },
  "himachal-pradesh": {
    duration: "7–10 Days",
    bestMonths: "Mar – Jun & Oct – Dec",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
  },
  hyderabad: {
    duration: "3–4 Days",
    bestMonths: "Oct – Mar",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  karnataka: {
    duration: "6–8 Days",
    bestMonths: "Oct – Mar",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
  },
  kashmir: {
    duration: "6–8 Days",
    bestMonths: "Apr – Oct",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  kerala: {
    duration: "7–9 Days",
    bestMonths: "Sep – Mar",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  northeast: {
    duration: "7–10 Days",
    bestMonths: "Oct – Apr",
    pace: "Active",
    comfortTier: "Experiential Retreats",
  },
  pondicherry: {
    duration: "3–5 Days",
    bestMonths: "Oct – Mar",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  rajasthan: {
    duration: "8–11 Days",
    bestMonths: "Oct – Mar",
    pace: "Balanced",
    comfortTier: "Curated Luxury",
  },
  "tamil-nadu": {
    duration: "7–10 Days",
    bestMonths: "Oct – Mar",
    pace: "Balanced",
    comfortTier: "Curated Luxury",
  },
  vizag: {
    duration: "3–5 Days",
    bestMonths: "Oct – Mar",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },

  // International Destinations
  bali: {
    duration: "7–10 Days",
    bestMonths: "Apr – Oct",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  dubai: {
    duration: "4–6 Days",
    bestMonths: "Nov – Mar",
    pace: "Balanced",
    comfortTier: "Curated Luxury",
  },
  malaysia: {
    duration: "6–8 Days",
    bestMonths: "Year-round",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
  },
  singapore: {
    duration: "4–5 Days",
    bestMonths: "Year-round",
    pace: "Balanced",
    comfortTier: "Curated Luxury",
  },
  "sri-lanka": {
    duration: "8–11 Days",
    bestMonths: "Dec – Apr",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  thailand: {
    duration: "6–9 Days",
    bestMonths: "Nov – Apr",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
  },
  vietnam: {
    duration: "9–12 Days",
    bestMonths: "Oct – Apr",
    pace: "Active",
    comfortTier: "Boutique Stays",
  },

  // Nature & Wildlife Destinations
  bandipur: {
    duration: "3–4 Days",
    bestMonths: "Oct – May",
    pace: "Unhurried",
    comfortTier: "Experiential Retreats",
  },
  corbett: {
    duration: "4–6 Days",
    bestMonths: "Nov – May",
    pace: "Active",
    comfortTier: "Experiential Retreats",
  },
  kabini: {
    duration: "3–4 Days",
    bestMonths: "Oct – May",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
  },
  masinagudi: {
    duration: "3–4 Days",
    bestMonths: "Oct – May",
    pace: "Unhurried",
    comfortTier: "Experiential Retreats",
  },
  wildlife: {
    duration: "5–7 Days",
    bestMonths: "Oct – May",
    pace: "Active",
    comfortTier: "Experiential Retreats",
  },
};

const DEFAULT_TRIP_ANCHOR: TripAnchorMetadata = {
  duration: "5–7 Days",
  bestMonths: "Oct – Mar",
  pace: "Balanced",
  comfortTier: "Boutique Stays",
};

export function getTripAnchorForDestination(destinationId?: string): TripAnchorMetadata {
  if (!destinationId) return DEFAULT_TRIP_ANCHOR;
  return TRIP_ANCHORS_BY_DESTINATION[destinationId.toLowerCase()] ?? DEFAULT_TRIP_ANCHOR;
}
