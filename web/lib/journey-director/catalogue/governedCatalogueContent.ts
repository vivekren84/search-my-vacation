/**
 * Governed Destination Content Standards (SMV Release 1.3 - N-03).
 *
 * Resolves deferred operational authoring and editorial review for:
 * 1. Amritsar (KB §10.3)
 * 2. Darjeeling (KB §10.11 - Northeast Collection Member)
 * 3. Corbett (KB §10.18 - Wildlife Collection Member)
 *
 * Source: docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md
 * Invariants: Complete DNA, seasonal guidance, emotional profiles,
 *             signature experiences, hero images, and itinerary linkage.
 */

export interface GovernedDestinationContent {
  readonly id: string;
  readonly name: string;
  readonly kbSection: string;
  readonly category: "DOMESTIC";
  readonly status: "ACTIVE";
  readonly identity: string;
  readonly primaryEmotion: string;
  readonly supportingEmotions: readonly string[];
  readonly coreThemes: readonly string[];
  readonly bestFor: readonly string[];
  readonly paces: readonly string[];
  readonly comforts: readonly string[];
  readonly seasons: {
    readonly peakMonths: readonly number[]; // 1-12
    readonly shoulderMonths: readonly number[];
    readonly cautionMonths: readonly number[];
    readonly seasonalNotes: string;
  };
  readonly regions: readonly {
    readonly id: string;
    readonly name: string;
    readonly emotionalFit: readonly string[];
    readonly recommendedStay: string;
    readonly directorNote: string;
  }[];
  readonly signatureExperiences: readonly string[];
  readonly tradeOffs: string;
  readonly heroImage: string;
  readonly heroImageAlt: string;
  readonly itineraryId: string;
}

export const GOVERNED_DESTINATIONS_COMPLETION: Readonly<Record<"amritsar" | "darjeeling" | "corbett", GovernedDestinationContent>> = Object.freeze({
  amritsar: {
    id: "amritsar",
    name: "Amritsar",
    kbSection: "10.3",
    category: "DOMESTIC",
    status: "ACTIVE",
    identity: "A deeply felt journey of faith, history, hospitality, and food.",
    primaryEmotion: "gratitude",
    supportingEmotions: ["spirituality", "discovery", "reconnection"],
    coreThemes: ["spiritual", "heritage", "food", "culture", "slow-travel"],
    bestFor: ["family", "couple", "solo-traveller", "senior-traveller", "multi-generation-family"],
    paces: ["relaxed", "balanced"],
    comforts: ["simple", "balanced", "premium"],
    seasons: {
      peakMonths: [10, 11, 12, 1, 2, 3], // Oct–Mar: pleasant cool weather, Diwali & Gurpurab illuminations
      shoulderMonths: [7, 8, 9],        // Jul–Sep: monsoon brings occasional rain, lower crowds
      cautionMonths: [4, 5, 6],          // Apr–Jun: intense summer heat; requires hydration and early mornings
      seasonalNotes: "Cooler months are most comfortable; religious observances, langar timings, and heat require review.",
    },
    regions: [
      {
        id: "amritsar--golden-temple-precinct",
        name: "Golden Temple precinct",
        emotionalFit: ["gratitude", "spirituality"],
        recommendedStay: "2–3 nights in Amritsar",
        directorNote: "The emotional heart of the recommendation. Encourage unhurried, respectful time.",
      },
      {
        id: "amritsar--old-city",
        name: "Old City",
        emotionalFit: ["discovery", "joy"],
        recommendedStay: "Included within stay",
        directorNote: "Use for living culture and food, with mobility and crowd considerations.",
      },
      {
        id: "amritsar--attari-wagah-corridor",
        name: "Attari–Wagah corridor",
        emotionalFit: ["celebration", "wonder"],
        recommendedStay: "Half-day",
        directorNote: "Offer as an optional high-energy contrast, not an automatic inclusion.",
      },
    ],
    signatureExperiences: [
      "Golden Temple at a quiet hour",
      "Community kitchen (langar) context and seva",
      "Partition Museum exploration",
      "Heritage food and culinary walking trail",
    ],
    tradeOffs: "Sacred experiences require respectful framing; border ceremony crowds and sensory intensity may not suit every traveller.",
    heroImage: "/images/journey-director/amritsar.webp",
    heroImageAlt: "The Golden Temple reflected in the Amrit Sarovar at Amritsar",
    itineraryId: "punjab-amritsar",
  },

  darjeeling: {
    id: "darjeeling",
    name: "Darjeeling",
    kbSection: "10.11",
    category: "DOMESTIC",
    status: "ACTIVE",
    identity: "A classic Himalayan hill journey shaped by tea heritage, mountain vistas, and colonial calm.",
    primaryEmotion: "wonder",
    supportingEmotions: ["discovery", "serenity", "freedom"],
    coreThemes: ["mountains", "hills", "heritage", "nature", "slow-travel"],
    bestFor: ["family", "couple", "solo-traveller", "senior-traveller"],
    paces: ["relaxed", "balanced", "explorer"],
    comforts: ["balanced", "premium"],
    seasons: {
      peakMonths: [3, 4, 5, 10, 11],     // Mar–May & Oct–Nov: clear skies, panoramic Kanchenjunga sunrises
      shoulderMonths: [12, 1, 2],        // Dec–Feb: crisp winter chill, mist, scenic quietude
      cautionMonths: [6, 7, 8, 9],        // Jun–Sep: heavy monsoon showers, road slippages; require active validation
      seasonalNotes: "Monsoon fog and road conditions require monitoring; spring and autumn offer pristine views.",
    },
    regions: [
      {
        id: "northeast--darjeeling",
        name: "Darjeeling Hills & Tea Country",
        emotionalFit: ["wonder", "serenity", "discovery"],
        recommendedStay: "3–4 nights",
        directorNote: "Use for tea heritage, Himalayan character, and classic hill-station atmosphere.",
      },
    ],
    signatureExperiences: [
      "Tiger Hill sunrise over Mount Kanchenjunga",
      "Historic Darjeeling Himalayan Railway (Toy Train) ride",
      "Heritage tea garden walk and tasting at Makaibari / Happy Valley",
      "Tibetan Buddhist monasteries and Himalayan Mountaineering Institute",
    ],
    tradeOffs: "Mountain roads can be steep and winding; monsoon rain can cause cloud cover obscuring peaks.",
    heroImage: "/images/journey-director/darjeeling.webp",
    heroImageAlt: "Tea gardens and the Himalayan peaks above Darjeeling",
    itineraryId: "west-bengal-darjeeling",
  },

  corbett: {
    id: "corbett",
    name: "Corbett",
    kbSection: "10.18",
    category: "DOMESTIC",
    status: "ACTIVE",
    identity: "A pristine forest and river wilderness journey where anticipation and quiet observation create adventure.",
    primaryEmotion: "adventure",
    supportingEmotions: ["wonder", "discovery", "serenity", "reconnection"],
    coreThemes: ["wildlife", "safari", "forests", "rivers", "nature"],
    bestFor: ["family", "couple", "friends"],
    paces: ["relaxed", "balanced", "explorer"],
    comforts: ["balanced", "premium"],
    seasons: {
      peakMonths: [11, 12, 1, 2, 3, 4, 5, 6], // Nov 15–Jun 15: Dhikala and Bijrani zones open; prime safari window
      shoulderMonths: [10],                   // Oct: park reopening preparations; Jhirna/Dhela zones open
      cautionMonths: [7, 8, 9],                // Jul–Sep: monsoon closure for core zones; river levels rise
      seasonalNotes: "Core Dhikala zone operates strictly Nov 15 to Jun 15; buffer zones operate year-round.",
    },
    regions: [
      {
        id: "wildlife--corbett",
        name: "Corbett National Park (Ramnagar / Dhikala / Jhirna)",
        emotionalFit: ["adventure", "discovery", "nature"],
        recommendedStay: "2–3 nights",
        directorNote: "Match safari zone and stay location carefully; avoid generic bookings without access clarity.",
      },
    ],
    signatureExperiences: [
      "Open jeep safari in Dhikala / Bijrani / Jhirna zones",
      "Early morning birding and naturalist-guided nature trail along the Kosi River",
      "Jim Corbett heritage trail & Corbett Museum at Choti Haldwani",
      "Forest lodge stay with evening wilderness interpretation",
    ],
    tradeOffs: "Wildlife sightings are never guaranteed; zone permits must be secured well in advance.",
    heroImage: "/images/journey-director/corbett.webp",
    heroImageAlt: "A tiger in the forest and river landscape of Corbett",
    itineraryId: "uttarakhand-corbett-national-park",
  },
});
