/**
 * Journey Synopsis Teaser Logic (Release 1.4 PO-01 + Release 1.5.5 EPIC 7)
 *
 * Destination-First Intelligence & Regional Circuit Engine:
 * - Rule 1: Explicit destination input locks 100% of Top Recommended Regional Circuits
 *   around that destination or its parent state/country.
 * - Rule 2: Persona shapes archetype, pacing, and stay highlights—never overrides destination.
 * - Rule 3: 3-Tier cascade (exact/alias anchor -> same state/country -> dynamic bespoke circuit).
 * - Strictly enforces BOUND-01 and ZERO prohibited vocabulary.
 */

import type { JourneyPassportState } from "../../types/journey-passport.types.js";

export interface DerivedTeaserData {
  archetype: {
    title: string;
    subtitle: string;
    badge: string;
  };
  indicativeDuration: string;
  pace: string;
  topRegions: readonly {
    name: string;
    stateOrCountry: string;
    duration: string;
    badge: string;
  }[];
  comfortHighlights: readonly string[];
}

interface RegionalCircuitSeed {
  name: string;
  stateOrCountry: string;
  duration: string;
  badge: string;
  anchors: string[];
  compatiblePersonas: string[];
}

const REGIONAL_CIRCUITS: RegionalCircuitSeed[] = [
  {
    name: "Dharamshala, Dalhousie & Kangra Valley Circuit",
    stateOrCountry: "Himachal Pradesh",
    duration: "6–8 Days",
    badge: "Deodar forest trails, colonial hill retreats & Dhauladhar views",
    anchors: ["dalhousie", "khajjiar", "chamba", "dharamshala", "mcleod ganj", "palampur", "kangra", "himachal pradesh"],
    compatiblePersonas: ["spirited_adventurer", "mindful_explorer", "multi_gen_voyager", "heritage_connoisseur"],
  },
  {
    name: "Shimla, Kinnaur & Spiti / Kullu-Manali Alpine Corridor",
    stateOrCountry: "Himachal Pradesh",
    duration: "6–8 Days",
    badge: "Cedar pine ridges, apple orchards & high Himalayan passes",
    anchors: ["shimla", "manali", "kullu", "kasol", "jibhi", "spiti", "kinnaur", "himachal pradesh"],
    compatiblePersonas: ["spirited_adventurer", "mindful_explorer", "romantic_wanderer"],
  },
  {
    name: "Udaipur, Kumbhalgarh & Aravalli Sanctuary Circuit",
    stateOrCountry: "Rajasthan",
    duration: "5–7 Days",
    badge: "Lakeside heritage palaces, Aravalli hill forts & leopard country",
    anchors: ["kumbhalgarh", "udaipur", "ranakpur", "jawai", "mount abu", "rajasthan"],
    compatiblePersonas: ["heritage_connoisseur", "romantic_wanderer", "spirited_adventurer", "multi_gen_voyager"],
  },
  {
    name: "Jaipur, Jodhpur & Thar Heritage Trail",
    stateOrCountry: "Rajasthan",
    duration: "6–8 Days",
    badge: "Living royal forts, desert dune camps & craft ateliers",
    anchors: ["jaipur", "jodhpur", "jaisalmer", "pushkar", "bikaner", "ranthambore", "rajasthan"],
    compatiblePersonas: ["heritage_connoisseur", "multi_gen_voyager", "spirited_adventurer"],
  },
  {
    name: "Central Backwaters & Marari Coast",
    stateOrCountry: "Kerala",
    duration: "5–7 Days",
    badge: "Palm-fringed tranquil waterways, heritage homesteads & sea air",
    anchors: ["kerala", "alleppey", "kumarakom", "marari", "kochi", "cochin", "munnar", "thekkady", "kovalam", "varkala", "wayanad"],
    compatiblePersonas: ["romantic_wanderer", "mindful_explorer", "multi_gen_voyager"],
  },
  {
    name: "Nilgiri Highlands & Foothills Corridor",
    stateOrCountry: "Tamil Nadu",
    duration: "4–6 Days",
    badge: "Colonial tea hills, biosphere trails & coastal heritage towns",
    anchors: ["tamil nadu", "ooty", "kotagiri", "masinagudi", "kodaikanal", "yercaud", "pondicherry", "madurai", "chennai"],
    compatiblePersonas: ["mindful_explorer", "multi_gen_voyager", "heritage_connoisseur"],
  },
  {
    name: "Garhwal Highlands & Rishikesh Gateway",
    stateOrCountry: "Uttarakhand",
    duration: "6–8 Days",
    badge: "Forest river valleys, alpine sanctuaries & quiet mountain retreats",
    anchors: ["uttarakhand", "rishikesh", "mussoorie", "dehradun", "auli", "pauri garhwal", "corbett"],
    compatiblePersonas: ["mindful_explorer", "spirited_adventurer", "multi_gen_voyager"],
  },
  {
    name: "Coorg Coffee Estates & Kabini Wildlife Trail",
    stateOrCountry: "Karnataka",
    duration: "5–7 Days",
    badge: "Misty plantation bungalows, river safaris & heritage temples",
    anchors: ["karnataka", "coorg", "kabini", "bandipur", "chikmagalur", "mysuru", "mysore", "bengaluru", "bangalore", "sakleshpur"],
    compatiblePersonas: ["spirited_adventurer", "romantic_wanderer", "multi_gen_voyager"],
  },
  {
    name: "Srinagar, Gulmarg & Pahalgam Alpine Valley Circuit",
    stateOrCountry: "Kashmir",
    duration: "6–8 Days",
    badge: "Dal Lake houseboats, chinar meadows & high-altitude gondolas",
    anchors: ["kashmir", "srinagar", "gulmarg", "pahalgam", "leh ladakh", "ladakh"],
    compatiblePersonas: ["romantic_wanderer", "mindful_explorer", "multi_gen_voyager", "spirited_adventurer"],
  },
  {
    name: "Port Blair, Havelock & Neil Island Archipelago",
    stateOrCountry: "Andaman",
    duration: "5–7 Days",
    badge: "Bioluminescent lagoons, coral reefs & unhurried island beaches",
    anchors: ["andaman", "havelock", "port blair", "neil"],
    compatiblePersonas: ["romantic_wanderer", "multi_gen_voyager", "mindful_explorer"],
  },
  {
    name: "Sri Lanka Cultural Triangle, Tea Hills & Galle Coast",
    stateOrCountry: "Sri Lanka",
    duration: "7–9 Days",
    badge: "Sigiriya rock fortresses, Ella tea estates & Dutch-era coast",
    anchors: ["sri lanka", "srilanka", "colombo", "nuwara eliya", "bentota", "kandy", "galle"],
    compatiblePersonas: ["heritage_connoisseur", "multi_gen_voyager", "romantic_wanderer"],
  },
  {
    name: "Hanoi, Halong Bay & Hoi An Heritage Trail",
    stateOrCountry: "Vietnam",
    duration: "7–9 Days",
    badge: "Limestone karsts, lantern-lit river towns & culinary walks",
    anchors: ["vietnam", "hanoi", "hoi an", "halong"],
    compatiblePersonas: ["heritage_connoisseur", "spirited_adventurer", "romantic_wanderer"],
  },
  {
    name: "Ubud Rainforest Sanctuaries & Uluwatu Coast",
    stateOrCountry: "Bali",
    duration: "6–8 Days",
    badge: "Terraced rice paddies, temple rituals & cliffside ocean sunsets",
    anchors: ["bali", "ubud", "uluwatu", "indonesia"],
    compatiblePersonas: ["romantic_wanderer", "mindful_explorer"],
  },
];

function formatPlaceName(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function selectDestinationFirstCircuits(
  state: Partial<JourneyPassportState> | undefined,
  personaKey: string,
  isSouthPreferred: boolean
) {
  const preferredNames = (state?.preferredDestinations || [])
    .map((d) => d.canonicalName?.trim())
    .filter((v): v is string => Boolean(v));

  const rawGetaway = (state?.getawayDescription || "").trim();
  const explicitTokens: string[] = [...preferredNames];

  // Also detect any known anchor destination mentioned in getawayDescription
  if (rawGetaway) {
    const lowerGetaway = rawGetaway.toLowerCase();
    for (const circuit of REGIONAL_CIRCUITS) {
      for (const anchor of circuit.anchors) {
        if (lowerGetaway.includes(anchor) && !explicitTokens.some((t) => t.toLowerCase() === anchor)) {
          explicitTokens.push(anchor);
        }
      }
    }
    // If getawayDescription itself is a short place name (<= 35 chars, no sentence punctuation)
    if (explicitTokens.length === 0 && rawGetaway.length <= 35 && !/[.!?]/.test(rawGetaway)) {
      explicitTokens.push(rawGetaway);
    }
  }

  // No explicit destination ("Surprise Me / Open to Suggestions") -> mood/persona defaults
  if (explicitTokens.length === 0) {
    return isSouthPreferred
      ? [
          {
            name: "Central Backwaters & Marari Coast",
            stateOrCountry: "Kerala",
            duration: "5–7 Days",
            badge: "Palm-fringed tranquil waterways",
          },
          {
            name: "Nilgiri Highlands & Foothills Corridor",
            stateOrCountry: "Tamil Nadu",
            duration: "4–6 Days",
            badge: "Colonial tea hills & biosphere trails",
          },
        ]
      : [
          {
            name: "Garhwal Highlands & Rishikesh Gateway",
            stateOrCountry: "Uttarakhand",
            duration: "6–8 Days",
            badge: "Forest river valleys & alpine sanctuaries",
          },
          {
            name: "Shimla, Kinnaur & Spiti / Kullu-Manali Alpine Corridor",
            stateOrCountry: "Himachal Pradesh",
            duration: "6–8 Days",
            badge: "Cedar pine ridges & high Himalayan passes",
          },
        ];
  }

  // Tier 1: Exact / alias match in anchor_destinations, sorted by persona affinity
  const tier1 = REGIONAL_CIRCUITS.filter((c) =>
    explicitTokens.some((tok) => {
      const lt = tok.toLowerCase();
      return (
        c.anchors.some((a) => a === lt || lt.includes(a) || a.includes(lt)) ||
        c.stateOrCountry.toLowerCase() === lt
      );
    })
  ).sort((a, b) => {
    const aScore = a.compatiblePersonas.includes(personaKey) ? 1 : 0;
    const bScore = b.compatiblePersonas.includes(personaKey) ? 1 : 0;
    return bScore - aScore;
  });

  if (tier1.length >= 2) {
    return tier1.slice(0, 2).map(({ name, stateOrCountry, duration, badge }) => ({
      name,
      stateOrCountry,
      duration,
      badge,
    }));
  }

  // Tier 2: Only 1 sub-regional circuit matched -> fill Slot 2 from same state_or_country
  if (tier1.length === 1) {
    const primary = tier1[0];
    const sameRegion = REGIONAL_CIRCUITS.find(
      (c) => c.stateOrCountry === primary.stateOrCountry && c.name !== primary.name
    );
    const secondary = sameRegion || {
      name: `${primary.stateOrCountry} Signature Extended Trail`,
      stateOrCountry: primary.stateOrCountry,
      duration: "6–8 Days",
      badge: `Curated regional extension across ${primary.stateOrCountry}`,
    };
    return [
      {
        name: primary.name,
        stateOrCountry: primary.stateOrCountry,
        duration: primary.duration,
        badge: primary.badge,
      },
      {
        name: secondary.name,
        stateOrCountry: secondary.stateOrCountry,
        duration: secondary.duration,
        badge: secondary.badge,
      },
    ];
  }

  // Tier 3: Unmapped destination dynamic synthesis (never fall back to unrelated regions)
  const anchorLabel = formatPlaceName(explicitTokens[0]);
  return [
    {
      name: `${anchorLabel} & Surrounding Bespoke Circuit`,
      stateOrCountry: anchorLabel,
      duration: "5–7 Days",
      badge: `Tailored stays & private slow-travel routing around ${anchorLabel}`,
    },
  ];
}

export function deriveTeaserData(state?: Partial<JourneyPassportState>): DerivedTeaserData {
  const dream = (state?.dreamJourney || "").toLowerCase();
  const companion = (state?.companion || "").toLowerCase();
  const travelStyles = state?.travelStyles || [];
  const getawayText = (state?.getawayDescription || "").toLowerCase();

  // 1. Mood Archetype & Persona Key
  let personaKey = "mindful_explorer";
  let archetype = {
    title: "The Mindful Explorer",
    subtitle: "Unhurried journeys steeped in mountain stillness, local culture, and thoughtful boutique comfort.",
    badge: "Serene & Cultural",
  };

  if (companion.includes("couple") || dream.includes("tropical") || dream.includes("beach") || getawayText.includes("romantic")) {
    personaKey = "romantic_wanderer";
    archetype = {
      title: "The Romantic Wanderer",
      subtitle: "Intimate coastal hideaways, private plantation villas, and sunset vistas curated for two.",
      badge: "Romance & Solitude",
    };
  } else if (companion.includes("family") || getawayText.includes("family") || getawayText.includes("kids") || getawayText.includes("parents")) {
    personaKey = "multi_gen_voyager";
    archetype = {
      title: "The Multi-Gen Voyager",
      subtitle: "Gentle pacing, intergenerational comfort, and seamless private transfers for the entire family.",
      badge: "Family & Senior Friendly",
    };
  } else if (companion.includes("friends") || dream.includes("wildlife") || dream.includes("adventure") || travelStyles.includes("active")) {
    personaKey = "spirited_adventurer";
    archetype = {
      title: "The Spirited Adventurer",
      subtitle: "Immersive trails, wildlife corridor safaris, and high-altitude scenic drives.",
      badge: "Active Discovery",
    };
  } else if (dream.includes("heritage") || travelStyles.includes("heritage")) {
    personaKey = "heritage_connoisseur";
    archetype = {
      title: "The Heritage Connoisseur",
      subtitle: "Living temples, royal ancestral homes, and culinary traditions untouched by time.",
      badge: "Timeless Heritage",
    };
  }

  // 2. Destination-First Regional Circuits (R1.5.5 EPIC 7)
  const isSouthPreferred =
    dream.includes("tropical") ||
    dream.includes("beach") ||
    dream.includes("wellness") ||
    Boolean(
      state?.preferredDestinations?.some((d) =>
        /kerala|tamil|cochin|munnar|wayanad|ooty|marari/i.test(d.canonicalName)
      )
    );

  const topRegions = selectDestinationFirstCircuits(state, personaKey, isSouthPreferred);

  // 3. Comfort & Dietary Signals (Release 1.4 — PO-03)
  const comfortHighlights: string[] = [];
  if (getawayText.includes("veg") || getawayText.includes("jain")) {
    comfortHighlights.push("Pure Veg / Jain Food Ready");
  }
  if (companion.includes("family") || getawayText.includes("senior") || getawayText.includes("wheelchair")) {
    comfortHighlights.push("Senior-Friendly Relaxed Pace");
  }
  if (comfortHighlights.length === 0) {
    comfortHighlights.push("Boutique Heritage Stays", "Verified Chauffeur Transfers");
  }

  return {
    archetype,
    indicativeDuration: state?.timing?.includes("2") || state?.timing?.includes("two") ? "10–14 Days" : "7–9 Days",
    pace: travelStyles.includes("slow") ? "Unhurried & Immersive" : "Balanced & Thoughtful",
    topRegions,
    comfortHighlights,
  };
}
