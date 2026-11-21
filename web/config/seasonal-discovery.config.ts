/**
 * Traveller Inspiration & Seasonal Discovery Configuration (Release 1.4 — V-06)
 *
 * Governs the 'Travel by Month / Seasonal Window' exploration matrix,
 * seasonal destination affinities, and international visa lead-time cues.
 */

export type SeasonalWindowName = "Winter" | "Spring" | "Summer" | "Monsoon" | "Autumn";

export interface MonthSeasonalDiscovery {
  month: number;
  name: string;
  season: SeasonalWindowName;
  themeTitle: string;
  domesticDestinations: readonly string[];
  internationalDestinations: readonly string[];
  editorialHeadline: string;
  editorialHighlight: string;
}

export interface VisaLeadTimeMetadata {
  destinationId: string;
  destinationName: string;
  visaCategory: "Visa-Free" | "Visa on Arrival" | "Quick eVisa" | "Consulate Visa (3–4 Weeks)";
  leadTimeDays: number;
  advisoryNote: string;
}

export const MONTH_DISCOVERY_CATALOG: readonly MonthSeasonalDiscovery[] = [
  {
    month: 1,
    name: "January",
    season: "Winter",
    themeTitle: "Royal Deserts & Sunlit Shores",
    domesticDestinations: ["rajasthan", "goa", "kerala", "andaman", "gujarat"],
    internationalDestinations: ["dubai", "thailand", "sri-lanka", "singapore"],
    editorialHeadline: "Crisp clear skies across Rajasthan's sandstone forts and golden coastlines.",
    editorialHighlight: "Peak desert festival season in Jaisalmer; balmy calm waters in the Andaman Islands.",
  },
  {
    month: 2,
    name: "February",
    season: "Winter",
    themeTitle: "Misty Highlands & Cultural Celebrations",
    domesticDestinations: ["kerala", "tamil-nadu", "agra", "amritsar", "corbett"],
    internationalDestinations: ["sri-lanka", "dubai", "singapore", "malaysia"],
    editorialHeadline: "Temperate winter warmth and prime tiger tracking in the sub-Himalayan sal forests.",
    editorialHighlight: "Pleasant days at the Taj Mahal; tea harvest walks in Munnar without heat.",
  },
  {
    month: 3,
    name: "March",
    season: "Spring",
    themeTitle: "Spring Blossoms & High Tea Corridors",
    domesticDestinations: ["himachal-pradesh", "kashmir", "corbett", "karnataka"],
    internationalDestinations: ["bali", "vietnam", "thailand"],
    editorialHeadline: "Apple orchards in bloom across Himachal and melting snows in the mid-Himalayas.",
    editorialHighlight: "Tulip garden awakenings in Srinagar; comfortable wildlife drives before summer heat.",
  },
  {
    month: 4,
    name: "April",
    season: "Spring",
    themeTitle: "Alpine Meadows & Island Calm",
    domesticDestinations: ["kashmir", "himachal-pradesh", "andaman", "northeast"],
    internationalDestinations: ["bali", "singapore", "vietnam"],
    editorialHeadline: "Vibrant rhododendrons veiling high valleys and mirror-still mountain lakes.",
    editorialHighlight: "Pristine clear water visibility for scuba diving in the Andaman archipelago.",
  },
  {
    month: 5,
    name: "May",
    season: "Summer",
    themeTitle: "Cedar Sanctuaries & High Mountain Escapes",
    domesticDestinations: ["himachal-pradesh", "kashmir", "tamil-nadu", "karnataka"],
    internationalDestinations: ["bali", "singapore"],
    editorialHeadline: "Cool pine breezes and mountain toy trains escaping the sultry plains.",
    editorialHighlight: "Heritage bungalow stays in Ooty and Coonoor; cedar ridge walks in Shimla.",
  },
  {
    month: 6,
    name: "June",
    season: "Summer",
    themeTitle: "High Passes & Southern Highland Havens",
    domesticDestinations: ["himachal-pradesh", "kashmir", "tamil-nadu"],
    internationalDestinations: ["bali", "malaysia"],
    editorialHeadline: "Open snow passes and long daylight walks along glacier-fed streams.",
    editorialHighlight: "Crisp dry season in Bali; quiet tea gardens in Kotagiri and Nilgiris.",
  },
  {
    month: 7,
    name: "July",
    season: "Monsoon",
    themeTitle: "Rainforest Rejuvenation & Emerald Valleys",
    domesticDestinations: ["kerala", "goa", "karnataka"],
    internationalDestinations: ["bali", "singapore"],
    editorialHeadline: "Lush tropical downpours and traditional Ayurvedic rejuvenation in God's Own Country.",
    editorialHighlight: "Romantic cloud-covered spice plantations in Wayanad; dramatic waterfalls in Goa.",
  },
  {
    month: 8,
    name: "August",
    season: "Monsoon",
    themeTitle: "Cascading Waterfalls & Ayurvedic Serenity",
    domesticDestinations: ["kerala", "karnataka", "tamil-nadu"],
    internationalDestinations: ["bali", "singapore", "malaysia"],
    editorialHeadline: "Verdant green hills, overflowing lakes, and unhurried backwater houseboats.",
    editorialHighlight: "World-class surf and temple tranquility in southern Bali; coffee estate mist in Coorg.",
  },
  {
    month: 9,
    name: "September",
    season: "Autumn",
    themeTitle: "Post-Monsoon Awakening & Golden Light",
    domesticDestinations: ["kerala", "himachal-pradesh", "kashmir", "rajasthan"],
    internationalDestinations: ["bali", "singapore", "dubai"],
    editorialHeadline: "Freshly washed pine forests and gentle river breezes across North and South.",
    editorialHighlight: "Clear autumn horizons in Dharamshala; unhurried early season drift in Alleppey.",
  },
  {
    month: 10,
    name: "October",
    season: "Autumn",
    themeTitle: "Festive Grandeur & Wilderness Reopenings",
    domesticDestinations: ["rajasthan", "corbett", "kerala", "andaman", "himachal-pradesh"],
    internationalDestinations: ["dubai", "vietnam", "thailand", "sri-lanka"],
    editorialHeadline: "The great season opening: national park gates reopen and royal palaces light up.",
    editorialHighlight: "First open safari drives in Corbett; pleasant autumn weather returning to Jaipur.",
  },
  {
    month: 11,
    name: "November",
    season: "Winter",
    themeTitle: "Dunes, Camels & Sacred Riverbanks",
    domesticDestinations: ["rajasthan", "corbett", "andaman", "goa", "agra", "amritsar"],
    internationalDestinations: ["dubai", "thailand", "vietnam", "sri-lanka"],
    editorialHeadline: "Pleasant golden days and cool evening campfires beneath starry desert skies.",
    editorialHighlight: "Pushkar and desert cultural gatherings; peak sal forest birding in Kumaon.",
  },
  {
    month: 12,
    name: "December",
    season: "Winter",
    themeTitle: "Winter Wonderlands & Coastal Celebrations",
    domesticDestinations: ["kashmir", "himachal-pradesh", "goa", "kerala", "andaman", "rajasthan"],
    internationalDestinations: ["dubai", "thailand", "singapore", "malaysia"],
    editorialHeadline: "White snows in the pir panjal peaks alongside joyful warm beach celebrations.",
    editorialHighlight: "Snowfall in Gulmarg and Manali; festive beachfront luxury in Goa and Kovalam.",
  },
];

export const VISA_LEAD_TIME_CATALOG: Readonly<Record<string, VisaLeadTimeMetadata>> = {
  bali: {
    destinationId: "bali",
    destinationName: "Bali (Indonesia)",
    visaCategory: "Visa on Arrival",
    leadTimeDays: 0,
    advisoryNote: "30-day Visa on Arrival granted at Denpasar Airport or applied online (e-VoA) 48 hours prior.",
  },
  thailand: {
    destinationId: "thailand",
    destinationName: "Thailand",
    visaCategory: "Visa-Free",
    leadTimeDays: 0,
    advisoryNote: "Visa exemption active for Indian passport holders for tourism stays up to 30 days.",
  },
  malaysia: {
    destinationId: "malaysia",
    destinationName: "Malaysia",
    visaCategory: "Visa-Free",
    leadTimeDays: 0,
    advisoryNote: "Visa-free entry policy for Indian citizens. Digital Arrival Card (MDAC) required within 3 days.",
  },
  "sri-lanka": {
    destinationId: "sri-lanka",
    destinationName: "Sri Lanka",
    visaCategory: "Quick eVisa",
    leadTimeDays: 1,
    advisoryNote: "Online Electronic Travel Authorization (ETA) approved within 24 hours of submission.",
  },
  singapore: {
    destinationId: "singapore",
    destinationName: "Singapore",
    visaCategory: "Quick eVisa",
    leadTimeDays: 4,
    advisoryNote: "Pre-arranged tourist e-visa required through authorized partners with 3–5 working days lead time.",
  },
  dubai: {
    destinationId: "dubai",
    destinationName: "Dubai (UAE)",
    visaCategory: "Quick eVisa",
    leadTimeDays: 3,
    advisoryNote: "Online tourist e-visa processed within 48–72 hours with valid passport copy and photograph.",
  },
  vietnam: {
    destinationId: "vietnam",
    destinationName: "Vietnam",
    visaCategory: "Quick eVisa",
    leadTimeDays: 4,
    advisoryNote: "Official government e-visa issued in 3–4 business days directly via immigration portal.",
  },
};

export function getMonthDiscovery(month: number): MonthSeasonalDiscovery | undefined {
  return MONTH_DISCOVERY_CATALOG.find((entry) => entry.month === month);
}

export function getDestinationsForMonth(month: number): {
  domestic: readonly string[];
  international: readonly string[];
} {
  const entry = getMonthDiscovery(month);
  if (!entry) return { domestic: [], international: [] };
  return {
    domestic: entry.domesticDestinations,
    international: entry.internationalDestinations,
  };
}

export function getVisaLeadTime(destinationId: string): VisaLeadTimeMetadata | undefined {
  return VISA_LEAD_TIME_CATALOG[destinationId.toLowerCase()];
}
