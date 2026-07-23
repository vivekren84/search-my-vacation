import type {
  JourneyPresentationCatalogue,
  JourneyPresentationMetadata,
} from "../types/journey-director";

const keralaImage = "/images/journey-director/kerala-alleppey-golden-hour.jpg";
const baliImage = "/images/journey-director/bali-ubud-golden-hour.jpg";
const sriLankaImage = "/images/journey-director/sri-lanka-galle-golden-hour.jpg";

export const DEFAULT_JOURNEY_PRESENTATION = {
  heroImage: "/images/golden-hour.png",
  heroImageAlt: "A warm landscape representing a future journey",
  heroImagePosition: "center",
  ctaLabel: "Explore This Journey",
} as const;

function metadata(
  value: JourneyPresentationMetadata,
): JourneyPresentationMetadata {
  return value;
}

/**
 * Presentation-only metadata. These records cannot make a destination
 * eligible, change its score, or alter engine recommendation order.
 */
export const journeyPresentationCatalogue: JourneyPresentationCatalogue = {
  "kerala:kerala-alappuzha": metadata({
    candidateId: "kerala",
    regionId: "kerala-alappuzha",
    summary:
      "Slow backwater mornings, generous time together, and nature that leaves room to reconnect.",
    heroImage: keralaImage,
    heroImageAlt:
      "A family sharing a quiet golden-hour moment aboard an Alappuzha houseboat",
    heroImagePosition: "center",
    supportingEvidenceIds: ["kerala-calm", "kerala-memory"],
    moments: [
      {
        id: "kerala-morning",
        title: "Wake with the backwaters",
        description: "A quiet morning on deck as Alappuzha begins to stir around you.",
        image: keralaImage,
        imageAlt: "Golden morning light across the Alappuzha backwaters",
        imagePosition: "left center",
        supportingEvidenceIds: ["kerala-calm"],
      },
      {
        id: "kerala-table",
        title: "Share Kerala at the table",
        description: "Local flavours enjoyed slowly, with time to stay in the moment.",
        image: keralaImage,
        imageAlt: "A family sharing an unhurried Kerala houseboat moment",
        imagePosition: "82% center",
        supportingEvidenceIds: ["kerala-memory"],
      },
      {
        id: "kerala-village",
        title: "Drift past village life",
        description: "Small glimpses of daily life that keep the journey grounded.",
        image: keralaImage,
        imageAlt: "Palm-lined village life along Kerala backwaters",
        imagePosition: "30% center",
        supportingEvidenceIds: ["kerala-memory"],
      },
    ],
    handoffHeadline: "Let’s shape your Kerala story together.",
    handoffMessage:
      "A Journey Director can refine this Alappuzha possibility around your pace, your people, and the moments you want to keep.",
    ctaLabel: "Explore This Journey",
  }),
  "bali:bali-ubud": metadata({
    candidateId: "bali",
    regionId: "bali-ubud",
    summary:
      "Reconnection through culture, green landscapes, wellness, and days with space to breathe.",
    heroImage: baliImage,
    heroImageAlt: "A couple walking beside Ubud rice terraces in warm morning light",
    heroImagePosition: "center",
    supportingEvidenceIds: ["bali-reconnection", "bali-variety"],
    moments: [
      {
        id: "bali-terraces",
        title: "Walk through living landscapes",
        description: "Follow the contours of Ubud’s green landscapes in the quiet of morning.",
        image: baliImage,
        imageAlt: "A couple walking beside layered green rice terraces in Ubud",
        imagePosition: "70% center",
        supportingEvidenceIds: ["bali-variety"],
      },
      {
        id: "bali-culture",
        title: "Meet Bali through its culture",
        description: "Daily traditions experienced with curiosity and respect.",
        image: baliImage,
        imageAlt: "Balinese cultural details among tropical greenery in Ubud",
        imagePosition: "22% center",
        supportingEvidenceIds: ["bali-variety"],
      },
      {
        id: "bali-wellness",
        title: "Make space for stillness",
        description: "A slower afternoon shaped by wellness, nature, and nothing urgent.",
        image: baliImage,
        imageAlt: "Soft morning mist and tropical greenery surrounding Ubud",
        imagePosition: "85% center",
        supportingEvidenceIds: ["bali-reconnection"],
      },
    ],
    handoffHeadline: "Let’s make this Bali possibility feel entirely yours.",
    handoffMessage:
      "A Journey Director can balance Ubud’s culture, nature, and wellness around the kind of reconnection you described.",
    ctaLabel: "Explore This Journey",
  }),
  "sri-lanka:sri-lanka-bentota-galle": metadata({
    candidateId: "sri-lanka",
    regionId: "sri-lanka-bentota-galle",
    summary:
      "A warm blend of coast, heritage, local flavour, and comfortable discovery at an easy rhythm.",
    heroImage: sriLankaImage,
    heroImageAlt: "A family strolling along Galle Fort coastal walls at golden hour",
    heroImagePosition: "center",
    supportingEvidenceIds: ["sri-lanka-coast", "sri-lanka-culture"],
    moments: [
      {
        id: "sri-lanka-coast",
        title: "Exhale beside the coast",
        description: "Begin with unhurried time near the water and space to simply arrive.",
        image: sriLankaImage,
        imageAlt: "The warm Indian Ocean coastline near Galle in Sri Lanka",
        imagePosition: "88% center",
        supportingEvidenceIds: ["sri-lanka-coast"],
      },
      {
        id: "sri-lanka-galle",
        title: "Wander Galle’s storied streets",
        description: "Heritage architecture and quiet corners discovered without a timetable.",
        image: sriLankaImage,
        imageAlt: "Galle Fort historic architecture glowing in late-afternoon light",
        imagePosition: "18% center",
        supportingEvidenceIds: ["sri-lanka-culture"],
      },
      {
        id: "sri-lanka-flavours",
        title: "Discover the island through flavour",
        description: "Share local dishes and the stories that arrive with them.",
        image: sriLankaImage,
        imageAlt: "A family sharing an easy coastal walk in Galle, Sri Lanka",
        imagePosition: "38% center",
        supportingEvidenceIds: ["sri-lanka-culture"],
      },
    ],
    handoffHeadline: "Let’s explore what Sri Lanka could become for you.",
    handoffMessage:
      "A Journey Director can shape Bentota and Galle into a journey that moves gently between coast, culture, and discovery.",
    ctaLabel: "Explore This Journey",
  }),
};

export function journeyPresentationKey(candidateId: string, regionId: string) {
  return `${candidateId}:${regionId}`;
}
