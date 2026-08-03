export const DEFAULT_JOURNEY_PRESENTATION = {
  heroImage: "/images/golden-hour.png",
  heroImageAlt: "A warm landscape representing a future journey",
  heroImagePosition: "center",
  ctaLabel: "Explore This Journey",
} as const;

export type JourneyCanonicalImage = {
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition: string;
  status: "approved-active" | "documented-fallback";
  fallbackReason?: string;
};

function approvedImage(
  filename: string,
  heroImageAlt: string,
  heroImagePosition = "center",
): JourneyCanonicalImage {
  return {
    heroImage: `/images/journey-director/${filename}`,
    heroImageAlt,
    heroImagePosition,
    status: "approved-active",
  };
}

/**
 * Canonical presentation imagery for public destination cards and every
 * Release 1 runtime candidate. Presentation data cannot affect eligibility,
 * scoring, personality assignment, or recommendation order.
 */
export const journeyCanonicalImages: Readonly<Record<string, JourneyCanonicalImage>> = Object.freeze({
  agra: approvedImage("agra.webp", "The Taj Mahal and its reflection gardens in warm Agra light"),
  amritsar: approvedImage("amritsar.webp", "The Golden Temple reflected in the Amrit Sarovar at Amritsar"),
  andaman: approvedImage("andaman-v2.webp", "The Cellular Jail and palms creating a distinctive Andaman island scene"),
  bali: approvedImage("bali.webp", "A Balinese temple gate and rice terraces in warm tropical light"),
  bandipur: approvedImage("bandipur-v2.webp", "A Bengal tiger moving through the dry deciduous forest of Bandipur"),
  corbett: approvedImage("corbett.webp", "A tiger in the forest and river landscape of Corbett"),
  dubai: approvedImage("dubai.webp", "The Burj Khalifa and Downtown Dubai skyline at golden hour"),
  goa: approvedImage("goa.webp", "A Goan coast and Portuguese church setting in warm evening light"),
  gujarat: approvedImage("gujarat.webp", "The Great Rann of Kutch with restrained Gujarati cultural details"),
  "himachal-pradesh": approvedImage("himachal-pradesh.webp", "Paragliding above Solang Valley and the Himachal mountains"),
  hyderabad: approvedImage("hyderabad.webp", "Charminar and its historic Hyderabad bazaar in golden light"),
  kabini: approvedImage("kabini-v2.webp", "A wildlife-viewing boat crossing the misty Kabini backwaters beside the forest"),
  karnataka: approvedImage("karnataka.webp", "Hampi temple architecture, boulders, and river landscape in Karnataka"),
  kashmir: approvedImage("kashmir.webp", "A shikara on Dal Lake beneath the mountains of Kashmir"),
  kerala: approvedImage("kerala.webp", "A kettuvallam moving through palm-lined Kerala backwaters"),
  malaysia: approvedImage("malaysia.webp", "The Petronas Twin Towers rising above Kuala Lumpur park"),
  masinagudi: approvedImage("masinagudi.webp", "Elephants in the foothill forest landscape around Masinagudi"),
  northeast: approvedImage("meghalaya.webp", "The Double-Decker Living Root Bridge in Meghalaya rainforest"),
  pondicherry: approvedImage("pondicherry.webp", "White Town facades and the Rock Beach promenade in Pondicherry"),
  assam: approvedImage("assam.webp", "A one-horned rhinoceros in the Kaziranga grasslands of Assam"),
  rajasthan: approvedImage("rajasthan.webp", "A sandstone courtyard and hill fort expressing Rajasthan heritage"),
  singapore: approvedImage("singapore.webp", "Supertree Grove and Marina Bay Sands in Singapore"),
  "sri-lanka": approvedImage("sri-lanka.webp", "Sigiriya Rock Fortress above the Sri Lankan forest"),
  "tamil-nadu": approvedImage("tamil-nadu.webp", "The Shore Temple at Mahabalipuram beside the Bay of Bengal in Tamil Nadu"),
  thailand: approvedImage("thailand.webp", "A longtail boat among the limestone karsts of Phang Nga Bay, Thailand"),
  vietnam: approvedImage("vietnam.webp", "A wooden junk boat among the limestone karsts of Ha Long Bay, Vietnam"),
  vizag: approvedImage("vizag.webp", "The Visakhapatnam coast, beach, and Eastern Ghats at golden hour"),
  wildlife: approvedImage("wildlife-experience-v2.webp", "A safari jeep observing deer and birdlife across a broad forest-edge ecosystem at sunrise"),
});

export const retainedJourneyImageAlternatives = Object.freeze([
  "/images/journey-director/andaman.webp",
  "/images/journey-director/andaman-v3.webp",
  "/images/journey-director/bali-ubud-golden-hour.jpg",
  "/images/journey-director/darjeeling.webp",
  "/images/journey-director/darjeeling-v2.webp",
  "/images/journey-director/dubai-v3.webp",
  "/images/journey-director/gujarat-v2.webp",
  "/images/journey-director/himachal-pradesh-v2.webp",
  "/images/journey-director/himachal-pradesh-v3.webp",
  "/images/journey-director/kabini-final.webp",
  "/images/journey-director/kerala-alleppey-golden-hour.jpg",
  "/images/journey-director/kodaikanal.webp",
  "/images/journey-director/kodaikanal-v2.webp",
  "/images/journey-director/kodaikanal-v3.webp",
  "/images/journey-director/kotagiri.webp",
  "/images/journey-director/meghalaya-v2.webp",
  "/images/journey-director/ooty.webp",
  "/images/journey-director/sikkim.webp",
  "/images/journey-director/sikkim-v2.webp",
  "/images/journey-director/sri-lanka-galle-golden-hour.jpg",
] as const);

export function journeyCanonicalImage(candidateId: string): JourneyCanonicalImage {
  return journeyCanonicalImages[candidateId] ?? {
    heroImage: DEFAULT_JOURNEY_PRESENTATION.heroImage,
    heroImageAlt: DEFAULT_JOURNEY_PRESENTATION.heroImageAlt,
    heroImagePosition: DEFAULT_JOURNEY_PRESENTATION.heroImagePosition,
    status: "documented-fallback",
    fallbackReason: `No canonical destination image is configured for ${candidateId}.`,
  };
}
