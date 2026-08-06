import type {
  JourneyPresentationCatalogue,
  JourneyPresentationMetadata,
} from "../types/journey-director";
import { journeyCanonicalImages } from "./destination-images.config";

export {
  DEFAULT_JOURNEY_PRESENTATION,
  journeyCanonicalImage,
  journeyCanonicalImageForPossibility,
  journeyCanonicalImages,
  retainedJourneyImageAlternatives,
} from "./destination-images.config";
export type { JourneyCanonicalImage } from "./destination-images.config";

const keralaImage = journeyCanonicalImages.kerala.heroImage;
const baliImage = journeyCanonicalImages.bali.heroImage;
const sriLankaImage = journeyCanonicalImages["sri-lanka"].heroImage;
const goaImage = journeyCanonicalImages.goa.heroImage;
const vizagImage = journeyCanonicalImages.vizag.heroImage;

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
  "goa:goa-south": metadata({
    candidateId: "goa", regionId: "goa-south",
    summary: "A calmer coastal expression of Goa, with room for slow mornings, local flavour, and time together.",
    heroImage: goaImage, heroImageAlt: "A warm coastal scene representing a quieter South Goa stay", heroImagePosition: "center",
    supportingEvidenceIds: ["goa-identity", "goa-themes"],
    moments: [
      { id: "goa-morning", title: "Let the coast set the pace", description: "Begin with an unhurried morning close to the water.", image: goaImage, imageAlt: "A quiet golden-hour coastal moment in Goa", supportingEvidenceIds: ["goa-identity"] },
      { id: "goa-table", title: "Stay for local flavour", description: "Make room for a long table and the stories that arrive with it.", image: goaImage, imageAlt: "A relaxed coastal dining moment in Goa", supportingEvidenceIds: ["goa-themes"] },
      { id: "goa-evening", title: "Keep the evening simple", description: "A gentle end to the day, shaped around the people travelling with you.", image: goaImage, imageAlt: "A calm evening by the Goan coast", supportingEvidenceIds: ["goa-identity"] },
    ],
    handoffHeadline: "Let’s shape a calmer Goa story together.", handoffMessage: "A Journey Director can help choose the coast and pace that best fit the journey you described.", ctaLabel: "Explore This Journey",
  }),
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
  "vizag:vizag-rushikonda": metadata({
    candidateId: "vizag", regionId: "vizag-rushikonda",
    summary: "A relaxed coastal break where beach time, green hills, and easy shared moments can sit comfortably together.",
    heroImage: vizagImage, heroImageAlt: "A warm coastal landscape representing the Rushikonda coast near Vizag", heroImagePosition: "center",
    supportingEvidenceIds: ["vizag-identity", "vizag-themes"],
    moments: [
      { id: "vizag-coast", title: "Begin beside the coast", description: "Let the sea create a softer rhythm for the first days of the journey.", image: vizagImage, imageAlt: "A peaceful coastal moment near Rushikonda", supportingEvidenceIds: ["vizag-identity"] },
      { id: "vizag-drive", title: "Follow the scenic edges", description: "Make space for a hill-and-coast drive without turning the day into a checklist.", image: vizagImage, imageAlt: "A scenic coastal road near Vizag", supportingEvidenceIds: ["vizag-themes"] },
      { id: "vizag-together", title: "Leave room for togetherness", description: "A simple, family-friendly pause shaped around time rather than urgency.", image: vizagImage, imageAlt: "A family sharing an easy coastal travel moment", supportingEvidenceIds: ["vizag-identity"] },
    ],
    handoffHeadline: "Let’s make this Vizag coast journey feel considered.", handoffMessage: "A Journey Director can refine the coastal base, hills, and shared pace around your family’s time together.", ctaLabel: "Explore This Journey",
  }),
};

export function journeyPresentationKey(candidateId: string, regionId: string) {
  return `${candidateId}:${regionId}`;
}
