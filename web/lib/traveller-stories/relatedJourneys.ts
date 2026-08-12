import type { TravellerJourneyCard } from "./getTravellerJourneys";

export type DestinationCategory =
  | "Mountains"
  | "Coast & Islands"
  | "Wildlife"
  | "International"
  | "Heritage & Culture";

/**
 * Best-effort destination categoriser for Traveller Stories' "Related
 * Stories" ranking (Task 7). This is a soft ranking signal, not a business
 * rule, so a keyword-based heuristic over the free-text `destination` string
 * is an intentionally simple, auditable approach — every keyword list is
 * short enough to review at a glance. A destination can only match one
 * category (first match wins, checked in the order below).
 */
const CATEGORY_KEYWORDS: ReadonlyArray<{ category: DestinationCategory; keywords: readonly string[] }> = [
  {
    category: "International",
    keywords: ["uae", "dubai", "abu dhabi", "malaysia", "singapore", "sri lanka", "bali", "indonesia", "thailand", "vietnam", "langkawi", "kuala lumpur"],
  },
  {
    category: "Wildlife",
    keywords: ["ranthambore", "kabini", "bandipur", "corbett", "masinagudi", "andaman"],
  },
  {
    category: "Mountains",
    keywords: ["himachal", "manali", "shimla", "kullu", "kasol", "kashmir", "sikkim", "meghalaya", "ooty", "kodaikanal", "munnar", "dalhousie", "dharamshala", "araku"],
  },
  {
    category: "Coast & Islands",
    keywords: ["goa", "varkala", "munroe island", "visakhapatnam", "vizag", "pondicherry", "havelock"],
  },
  {
    category: "Heritage & Culture",
    keywords: ["rajasthan", "gujarat", "hyderabad", "madurai", "amritsar", "agra", "karnataka", "mangalore", "murudeshwar", "odisha", "bhubaneswar", "guruvayur", "kerala"],
  },
];

export function destinationCategory(destination: string): DestinationCategory | null {
  const normalized = destination.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return null;
}

/**
 * Selects up to `count` related journeys for the given journey, per the EBC
 * priority order: same traveller type, then same destination category, then
 * same experience type. Each tier is walked in listing order (already
 * chronological) and never repeats a journey already selected. Never
 * includes the current journey. If the three tiers together don't produce
 * enough matches, remaining slots are filled with the next most recent
 * journeys so the section reliably has content.
 */
export function getRelatedJourneys(
  current: TravellerJourneyCard,
  allJourneys: readonly TravellerJourneyCard[],
  count = 3,
): TravellerJourneyCard[] {
  const pool = allJourneys.filter((journey) => journey.journeyId !== current.journeyId);
  const currentCategory = destinationCategory(current.destination);

  const selected: TravellerJourneyCard[] = [];
  const selectedIds = new Set<string>();

  const addFrom = (candidates: TravellerJourneyCard[]) => {
    for (const candidate of candidates) {
      if (selected.length >= count) return;
      if (selectedIds.has(candidate.journeyId)) continue;
      selected.push(candidate);
      selectedIds.add(candidate.journeyId);
    }
  };

  addFrom(pool.filter((journey) => journey.travellerType === current.travellerType));
  if (selected.length < count && currentCategory) {
    addFrom(pool.filter((journey) => destinationCategory(journey.destination) === currentCategory));
  }
  if (selected.length < count) {
    addFrom(pool.filter((journey) => journey.experienceType === current.experienceType));
  }
  if (selected.length < count) {
    addFrom(pool);
  }

  return selected.slice(0, count);
}
