/**
 * Journey Synopsis Teaser Logic (Release 1.4 — PO-01)
 *
 * Authored for Vivek (Product Owner) & Tiger (CTO)
 * Pure derivation logic for mood archetypes, top regions, and comfort signals.
 * Strictly enforces BOUND-01 lead-capture guardrail downstream.
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

export function deriveTeaserData(state?: Partial<JourneyPassportState>): DerivedTeaserData {
  const dream = (state?.dreamJourney || "").toLowerCase();
  const companion = (state?.companion || "").toLowerCase();
  const travelStyles = state?.travelStyles || [];
  const getawayText = (state?.getawayDescription || "").toLowerCase();

  // 1. Mood Archetype
  let archetype = {
    title: "The Mindful Explorer",
    subtitle: "Unhurried journeys steeped in mountain stillness, local culture, and thoughtful boutique comfort.",
    badge: "Serene & Cultural",
  };

  if (companion.includes("couple") || dream.includes("tropical") || dream.includes("beach") || getawayText.includes("romantic")) {
    archetype = {
      title: "The Romantic Wanderer",
      subtitle: "Intimate coastal hideaways, private plantation villas, and sunset vistas curated for two.",
      badge: "Romance & Solitude",
    };
  } else if (companion.includes("family") || getawayText.includes("family") || getawayText.includes("kids") || getawayText.includes("parents")) {
    archetype = {
      title: "The Multi-Gen Voyager",
      subtitle: "Gentle pacing, intergenerational comfort, and seamless private transfers for the entire family.",
      badge: "Family & Senior Friendly",
    };
  } else if (companion.includes("friends") || dream.includes("wildlife") || dream.includes("adventure") || travelStyles.includes("active")) {
    archetype = {
      title: "The Spirited Adventurer",
      subtitle: "Immersive trails, wildlife corridor safaris, and high-altitude scenic drives.",
      badge: "Active Discovery",
    };
  } else if (dream.includes("heritage") || travelStyles.includes("heritage")) {
    archetype = {
      title: "The Heritage Connoisseur",
      subtitle: "Living temples, royal ancestral homes, and culinary traditions untouched by time.",
      badge: "Timeless Heritage",
    };
  }

  // 2. Top Recommended Pilot Regions (Release 1.4 — V-01 & V-05)
  const isSouthPreferred =
    dream.includes("tropical") ||
    dream.includes("beach") ||
    dream.includes("wellness") ||
    state?.preferredDestinations?.some((d) =>
      /kerala|tamil|cochin|munnar|wayanad|ooty|marari/i.test(d.canonicalName),
    );

  const topRegions = isSouthPreferred
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
          name: "Shimla & Kullu-Manali Alpine Corridor",
          stateOrCountry: "Himachal Pradesh",
          duration: "6–8 Days",
          badge: "Cedar pine ridges & high Himalayan passes",
        },
      ];

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
