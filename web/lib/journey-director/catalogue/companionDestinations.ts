/**
 * Companion Destinations Editorial Graph (Release 1.4 — V-03)
 *
 * Suggests 2–3 complementary destinations that pair naturally with a traveller's
 * primary destination interest, providing high-trust pairing rationales,
 * realistic travel transfers, and soulful experiential contrasts.
 */

export interface CompanionDestination {
  destinationId: string;
  title: string;
  relationship: string;
  rationale: string;
}

export const COMPANION_DESTINATIONS_GRAPH: Readonly<Record<string, readonly CompanionDestination[]>> = {
  "himachal-pradesh": [
    {
      destinationId: "kashmir",
      title: "Kashmir",
      relationship: "Alpine Valley & River Contrast",
      rationale:
        "A natural sequel for alpine travellers, contrasting Himachal's pine-clad ridges with the still mirror waters of Dal Lake and saffron fields.",
    },
    {
      destinationId: "amritsar",
      title: "Amritsar",
      relationship: "Living Culture & Heritage Extension",
      rationale:
        "Just a scenic 4-hour descent from the Kangra Valley brings you into the golden warmth, sacred devotion, and generous kitchens of the Golden Temple.",
    },
    {
      destinationId: "corbett",
      title: "Corbett",
      relationship: "Mountain to Wilderness Corridor",
      rationale:
        "Descend from the high colonial ridges of Shimla into the dense sal canopies and tiger sanctuaries of the Kumaon riverbanks.",
    },
  ],

  kerala: [
    {
      destinationId: "tamil-nadu",
      title: "Tamil Nadu",
      relationship: "Tea Trails to Temple Architecture",
      rationale:
        "A scenic 4-hour mountain drive across Munnar's tea estates descends directly into the living Dravidian temple heritage and culinary richness of Madurai.",
    },
    {
      destinationId: "karnataka",
      title: "Karnataka",
      relationship: "Spices to Coffee Highlands",
      rationale:
        "Wayanad flows seamlessly across the border into the ancient coffee estates of Coorg and the quiet riverfront wildlife lodges of Kabini.",
    },
    {
      destinationId: "pondicherry",
      title: "Pondicherry",
      relationship: "Backwaters to French Promenade",
      rationale:
        "A tranquil transition from lush interior backwater lagoons to the breezy, yellow-walled French colonial promenades of the Coromandel coast.",
    },
  ],

  rajasthan: [
    {
      destinationId: "agra",
      title: "Agra",
      relationship: "The Imperial Heritage Route",
      rationale:
        "An effortless 4-hour expressway connection from Jaipur completes the timeless Golden Triangle with sunset over the Taj Mahal.",
    },
    {
      destinationId: "gujarat",
      title: "Gujarat",
      relationship: "Desert Craft & Textile Corridor",
      rationale:
        "Connects southern Rajasthan's lakes and hill palaces with the stark white desert and intricate mirror-work textiles of the Rann of Kutch.",
    },
    {
      destinationId: "amritsar",
      title: "Amritsar",
      relationship: "Royal Forts to Sacred Heartlands",
      rationale:
        "A purposeful cultural contrast linking the desert bastions of Bikaner and Jaipur with the spiritual community of the Punjab plains.",
    },
  ],

  "tamil-nadu": [
    {
      destinationId: "kerala",
      title: "Kerala",
      relationship: "Western Ghats to Backwater Lagoons",
      rationale:
        "Cross through the Nilgiri tea hills straight into the misty high ranges of Munnar and the slow-drifting backwaters of Alleppey.",
    },
    {
      destinationId: "pondicherry",
      title: "Pondicherry",
      relationship: "Living Temples to Coastal Serenity",
      rationale:
        "A scenic 2-hour coastal drive along the East Coast Road brings you into quiet seaside French boulevards and artisan studios.",
    },
    {
      destinationId: "karnataka",
      title: "Karnataka",
      relationship: "Dravidian Heritage to Coffee Hills",
      rationale:
        "Connects the stone gopurams and silk weavers of the plains with the cool eucalyptus heights of Ooty and Mysore royal palaces.",
    },
  ],

  goa: [
    {
      destinationId: "karnataka",
      title: "Karnataka",
      relationship: "Coastline to Coffee Plantations",
      rationale:
        "Just a 5-hour scenic climb into the Western Ghats transitions from coastal sunset rhythms into misty estate bungalows in Coorg.",
    },
    {
      destinationId: "pondicherry",
      title: "Pondicherry",
      relationship: "West Coast to East Coast Rhythms",
      rationale:
        "Pairs the golden sands and Portuguese heritage of the Arabian Sea with the contemplative French colonial promenades of the Bay of Bengal.",
    },
  ],

  andaman: [
    {
      destinationId: "vizag",
      title: "Vizag",
      relationship: "Island Horizon to Valley Escapes",
      rationale:
        "Pairs pristine coral island beaches with the coffee-scented valleys and scenic hill-rail journeys of the Eastern Ghats.",
    },
    {
      destinationId: "kerala",
      title: "Kerala",
      relationship: "Island Solitude to Lagoon Calm",
      rationale:
        "Connects open ocean horizons with the slow, unhurried cadence of palm-shaded freshwater canal journeys.",
    },
  ],

  kashmir: [
    {
      destinationId: "himachal-pradesh",
      title: "Himachal Pradesh",
      relationship: "The Grand Himalayan Traverse",
      rationale:
        "Connects the sweeping pine valleys of Gulmarg and Pahalgam with the deodar-fringed ridges and Tibetan monasteries of Dharamshala.",
    },
    {
      destinationId: "amritsar",
      title: "Amritsar",
      relationship: "High Valley to Sacred Heritage",
      rationale:
        "Direct air and road links bridge alpine snow peaks with the spiritual devotion and world-renowned food culture of the Punjab heartland.",
    },
  ],

  corbett: [
    {
      destinationId: "himachal-pradesh",
      title: "Himachal Pradesh",
      relationship: "Foothill Jungle to Alpine Heights",
      rationale:
        "Ascend smoothly from sal tiger forests along the Kosi River into the temperate apple orchards and cedar breezes of the mid-Himalayas.",
    },
    {
      destinationId: "agra",
      title: "Agra",
      relationship: "Wild Nature to Architectural Wonder",
      rationale:
        "Pairs the raw, patient thrill of wildlife safaris with the world’s most celebrated monument to love.",
    },
  ],

  bali: [
    {
      destinationId: "singapore",
      title: "Singapore",
      relationship: "Island Spirituality to Futuristic Greenery",
      rationale:
        "A quick 2.5-hour direct flight bridges Bali’s volcanic temple terraces with Singapore’s botanic garden design and Michelin dining.",
    },
    {
      destinationId: "thailand",
      title: "Thailand",
      relationship: "Island Hopping & Culinary Variety",
      rationale:
        "Compares the peaceful rice terraces and Hindu ritual of Ubud with the limestone karsts and vibrant street energy of southern Thailand.",
    },
  ],

  "sri-lanka": [
    {
      destinationId: "kerala",
      title: "Kerala",
      relationship: "Tea Valleys to Tropical Backwaters",
      rationale:
        "A short 1-hour international flight across the Gulf of Mannar links Ceylon hill bungalows with Kerala’s serene waterways.",
    },
    {
      destinationId: "tamil-nadu",
      title: "Tamil Nadu",
      relationship: "Historic Ocean Links & Heritage",
      rationale:
        "Unpacks the deep historical, architectural and maritime ties between the Coromandel coast and northern Sri Lankan culture.",
    },
  ],

  singapore: [
    {
      destinationId: "malaysia",
      title: "Malaysia",
      relationship: "Causeway Gateway to Heritage & Coast",
      rationale:
        "An effortless land or quick air connection leads straight into the food markets of Penang and the rainforest coast of Langkawi.",
    },
    {
      destinationId: "bali",
      title: "Bali",
      relationship: "Urban Design to Island Reset",
      rationale:
        "The quintessential Southeast Asian pairing: world-class shopping and gardens followed by barefoot luxury among the palms.",
    },
  ],

  dubai: [
    {
      destinationId: "rajasthan",
      title: "Rajasthan",
      relationship: "Desert Modernity to Royal Fortresses",
      rationale:
        "A captivating contrast comparing contemporary desert skyscrapers with centuries-old sandstone palaces and camel desert trails.",
    },
    {
      destinationId: "singapore",
      title: "Singapore",
      relationship: "Global Crossroads Comparison",
      rationale:
        "Contrasts the bold, sunlit luxury of the Arabian Gulf with the lush equatorial green corridors of Southeast Asia.",
    },
  ],
};

const DEFAULT_COMPANIONS: readonly CompanionDestination[] = [
  {
    destinationId: "kerala",
    title: "Kerala",
    relationship: "Unhurried Waterways",
    rationale: "A soothing change of pace shaped by backwaters, spice gardens, and gentle coastal comfort.",
  },
  {
    destinationId: "himachal-pradesh",
    title: "Himachal Pradesh",
    relationship: "Mountain Retreat",
    rationale: "Fresh cedar-scented air, wide mountain vistas, and room to pause.",
  },
];

export function getCompanionDestinations(destinationId?: string): readonly CompanionDestination[] {
  if (!destinationId) return DEFAULT_COMPANIONS;
  return COMPANION_DESTINATIONS_GRAPH[destinationId.toLowerCase()] ?? DEFAULT_COMPANIONS;
}
