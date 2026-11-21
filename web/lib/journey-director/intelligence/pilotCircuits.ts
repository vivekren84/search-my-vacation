/**
 * Region-Level Destination Intelligence & Pilot Circuits (Release 1.4 — V-01)
 *
 * Governs the region-level circuit entities for top priority pilot geographies:
 * 1. Northern Himalayan Circuit: Himachal Pradesh & Uttarakhand
 * 2. Southern Peninsular Circuit: Kerala & Tamil Nadu
 */

export interface PilotRegion {
  id: string;
  name: string;
  destinationId: string;
  stateOrCountry: string;
  stops: readonly string[];
  indicativeDuration: string;
  bestMonths: string;
  pace: "Unhurried" | "Balanced" | "Active";
  comfortTier: "Boutique Stays" | "Curated Luxury" | "Experiential Retreats";
  highlights: readonly string[];
  transferNotes: string;
}

export interface PilotCircuit {
  id: string;
  title: string;
  pilotGeography: "himachal-uttarakhand" | "kerala-tamil-nadu";
  destinationIds: readonly string[];
  primaryRegions: readonly string[];
  overview: string;
  typicalDays: string;
  bestSeason: string;
  pace: "Unhurried" | "Balanced" | "Active";
  comfortTier: "Boutique Stays" | "Curated Luxury" | "Experiential Retreats";
  moodAffinities: readonly string[];
}

export const PILOT_REGIONS: readonly PilotRegion[] = [
  // --- Himachal & Uttarakhand Pilot Geography ---
  {
    id: "himachal-shimla-manali",
    name: "Shimla & Kullu-Manali Alpine Corridor",
    destinationId: "himachal-pradesh",
    stateOrCountry: "Himachal Pradesh",
    stops: ["Shimla", "Kullu", "Manali", "Solang Valley"],
    indicativeDuration: "6–8 Days",
    bestMonths: "Mar – Jun & Oct – Dec",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
    highlights: [
      "Cedar-shaded heritage walks along the historic Shimla Ridge",
      "Scenic drives following the tumbling Beas River through apple orchards",
      "Alpine log-cottage stays overlooking snow-capped Pir Panjal peaks",
    ],
    transferNotes: "4–5 hours scenic mountain drive between Shimla and Manali via Mandi bypass.",
  },
  {
    id: "himachal-dharamshala-dalhousie",
    name: "Kangra Valley & Dhauladhar Sanctuary",
    destinationId: "himachal-pradesh",
    stateOrCountry: "Himachal Pradesh",
    stops: ["Dharamshala", "McLeod Ganj", "Dalhousie", "Khajjiar"],
    indicativeDuration: "6–8 Days",
    bestMonths: "Sep – Jun",
    pace: "Unhurried",
    comfortTier: "Boutique Stays",
    highlights: [
      "Monastery bells and quiet contemplation in pine-fragrant McLeod Ganj",
      "Sweeping views of the sheer granite walls of the Dhauladhar range",
      "Gentle strolls across the emerald alpine meadow of Khajjiar",
    ],
    transferNotes: "Scenic 4-hour drive skirting Kangra tea gardens and pine forests into Dalhousie.",
  },
  {
    id: "uttarakhand-corbett-foothills",
    name: "Kumaon Foothills & Corbett Wilderness",
    destinationId: "corbett",
    stateOrCountry: "Uttarakhand",
    stops: ["Jim Corbett National Park", "Ramnagar Riverfront", "Pangot Hills"],
    indicativeDuration: "5–7 Days",
    bestMonths: "Nov – May",
    pace: "Active",
    comfortTier: "Experiential Retreats",
    highlights: [
      "Open-canopy game drives tracking the Royal Bengal tiger through dense sal forests",
      "Quiet sunset walks along the pebble banks of the Kosi River",
      "World-class birding trails in the mist-veiled Pangot valley",
    ],
    transferNotes: "5-hour smooth highway drive from Delhi or comfortable train to Ramnagar station.",
  },

  // --- Kerala & Tamil Nadu Pilot Geography ---
  {
    id: "kerala-munnar-alleppey",
    name: "High Range Tea Trails & Backwater Sanctuary",
    destinationId: "kerala",
    stateOrCountry: "Kerala",
    stops: ["Kochi", "Munnar", "Thekkady", "Alleppey"],
    indicativeDuration: "6–8 Days",
    bestMonths: "Sep – Mar",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
    highlights: [
      "Colonial spice warehouse cafes and sunset walks in historic Fort Kochi",
      "Private veranda breakfasts over endless emerald waves of Munnar tea estates",
      "Unhurried overnight drift aboard a traditional teakwood kettuvallam on Vembanad Lake",
    ],
    transferNotes: "Scenic 3.5-hour climb from coastal plains to 1,600m high Munnar hills.",
  },
  {
    id: "kerala-wayanad-hills",
    name: "Wayanad Rainforest & Spice Highlands",
    destinationId: "kerala",
    stateOrCountry: "Kerala",
    stops: ["Calicut", "Wayanad", "Kabini Foothills"],
    indicativeDuration: "4–6 Days",
    bestMonths: "Oct – May",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
    highlights: [
      "Private treehouse and plantation stays surrounded by wild cardamom",
      "Mysterious stone-age petroglyphs at Edakkal Caves",
      "Mist-shrouded morning walks through ancient Western Ghats rainforests",
    ],
    transferNotes: "2.5-hour drive via the famous Thamarassery Churam 9-hairpin mountain pass.",
  },
  {
    id: "tamil-nadu-nilgiris-ooty",
    name: "Nilgiri Mountain & Living Temple Circuit",
    destinationId: "tamil-nadu",
    stateOrCountry: "Tamil Nadu",
    stops: ["Ooty", "Coonoor", "Kotagiri", "Madurai"],
    indicativeDuration: "7–10 Days",
    bestMonths: "Oct – Apr",
    pace: "Balanced",
    comfortTier: "Curated Luxury",
    highlights: [
      "Vintage blue-and-cream Nilgiri Mountain Toy Train journey through eucalyptus valleys",
      "Heritage tea tastings at private heritage bungalows in quiet Coonoor",
      "Evening prayer ceremonies amidst soaring stone gopurams at Meenakshi Temple",
    ],
    transferNotes: "Mountain rail link or scenic winding descent to the Coimbatore/Madurai highway.",
  },
];

export const PILOT_CIRCUITS: readonly PilotCircuit[] = [
  {
    id: "circuit-himalayan-sanctuary",
    title: "Himalayan Sanctuary & Alpine Valleys",
    pilotGeography: "himachal-uttarakhand",
    destinationIds: ["himachal-pradesh", "corbett"],
    primaryRegions: ["himachal-shimla-manali", "himachal-dharamshala-dalhousie", "uttarakhand-corbett-foothills"],
    overview:
      "A soulful traverse through pine forests, apple valleys and riverbanks, moving from high British colonial ridges down into tiger country.",
    typicalDays: "7–10 Days",
    bestSeason: "Oct – May",
    pace: "Balanced",
    comfortTier: "Boutique Stays",
    moodAffinities: ["Mountain Retreat", "Nature", "Relaxation", "Adventure"],
  },
  {
    id: "circuit-western-ghats-backwaters",
    title: "Western Ghats, Tea Trails & Emerald Waters",
    pilotGeography: "kerala-tamil-nadu",
    destinationIds: ["kerala", "tamil-nadu"],
    primaryRegions: ["kerala-munnar-alleppey", "kerala-wayanad-hills", "tamil-nadu-nilgiris-ooty"],
    overview:
      "From cool eucalyptus peaks and manicured tea gardens in the Nilgiris down through cardamom forests to mirror-calm lagoon waters.",
    typicalDays: "7–9 Days",
    bestSeason: "Sep – Mar",
    pace: "Unhurried",
    comfortTier: "Curated Luxury",
    moodAffinities: ["Tropical Escape", "Relaxation", "Culture & Heritage", "Nature"],
  },
];

const circuitsByDestinationId = new Map<string, PilotCircuit[]>();
for (const circuit of PILOT_CIRCUITS) {
  for (const destId of circuit.destinationIds) {
    const list = circuitsByDestinationId.get(destId) ?? [];
    list.push(circuit);
    circuitsByDestinationId.set(destId, list);
  }
}

const regionsById = new Map<string, PilotRegion>(PILOT_REGIONS.map((region) => [region.id, region]));

export function getPilotCircuitsForDestination(destinationId: string): readonly PilotCircuit[] {
  return circuitsByDestinationId.get(destinationId) ?? [];
}

export function getPilotRegionById(regionId: string): PilotRegion | undefined {
  return regionsById.get(regionId);
}

export function isPilotDestination(destinationId: string): boolean {
  return circuitsByDestinationId.has(destinationId);
}
