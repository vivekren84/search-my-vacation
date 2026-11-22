/**
 * Search My Vacation — Journey Designer Specialist Profiles (Release 1.5 — PO-05)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Showcases human specialist profiles with authentic biographical storytelling,
 * verified trip galleries, and 1-click Passport pre-fill CTAs.
 */

export interface SpecialistProfile {
  id: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  avatarUrl: string;
  assignedRegions: string[];
  signatureQuote: string;
  verifiedGalleries: Array<{
    title: string;
    location: string;
    imageUrl: string;
    caption: string;
  }>;
  passportPreFillConfig: {
    archetypeTitle: string;
    pilotRegion: string;
    indicativeDuration: string;
    comfortSignal: string;
  };
}

export const journeySpecialists: readonly SpecialistProfile[] = [
  {
    id: "spec_keerthi",
    name: "Keerthi Renganathan",
    role: "Founding Journey Curator",
    specialization: "Royal Rajasthan Heritage & Living Traditions",
    bio: "Curating bespoke journeys across the desert citadels and royal sanctuaries of Rajasthan for over a decade. Keerthi works directly with aristocratic heritage custodians and local master artisans to reveal unhurried cultural moments.",
    avatarUrl: "/images/designers/keerthi_specialist.jpg",
    assignedRegions: ["Rajasthan Regal Circuit", "Golden Triangle"],
    signatureQuote: "A true journey is not measured by destinations visited, but by the quiet intimacy of moments shared with living heritage.",
    verifiedGalleries: [
      {
        title: "Sunset over Lake Pichola",
        location: "Udaipur, Rajasthan",
        imageUrl: "/images/stories/udaipur_sunset.jpg",
        caption: "Private royal barge cruise at twilight with master Mewari flute musicians.",
      },
      {
        title: "Artisan Miniature Atelier",
        location: "Jaipur, Rajasthan",
        imageUrl: "/images/stories/jaipur_atelier.jpg",
        caption: "Exclusive hands-on natural pigment painting workshop for visiting families.",
      },
    ],
    passportPreFillConfig: {
      archetypeTitle: "Heritage Splendour & Royal Sanctuaries",
      pilotRegion: "Rajasthan Regal Circuit",
      indicativeDuration: "10-12 Days",
      comfortSignal: "Connecting Palace Suites",
    },
  },
  {
    id: "spec_sri",
    name: "Sri",
    role: "Senior Journey Designer & Naturalist",
    specialization: "Wildlife Sanctuaries & Conservation Safaris",
    bio: "Passionate conservationist and safari planner with extensive field knowledge in Corbett, Ranthambore, and Central Indian tiger habitats. Focused on ethical wildlife tracking and serene private forest lodges.",
    avatarUrl: "/images/designers/sri_specialist.jpg",
    assignedRegions: ["Corbett Wildlife Reserve", "Central Highlands"],
    signatureQuote: "In the wilderness, silence is the greatest conversation. We build journeys that give nature the respect and space it commands.",
    verifiedGalleries: [
      {
        title: "Morning Mist on the Ramganga River",
        location: "Jim Corbett, Uttarakhand",
        imageUrl: "/images/stories/corbett_ramganga.jpg",
        caption: "Silent dawn safari tracking wild Asian elephants and endangered gharials.",
      },
    ],
    passportPreFillConfig: {
      archetypeTitle: "Wilderness Sanctuaries & Highland Retreats",
      pilotRegion: "Corbett Wildlife Reserve",
      indicativeDuration: "7-9 Days",
      comfortSignal: "Senior-Accessible Ground Villa",
    },
  },
];

export function getSpecialistById(id: string): SpecialistProfile | undefined {
  return journeySpecialists.find((s) => s.id === id);
}

export function getSpecialistForRegion(region: string): SpecialistProfile | undefined {
  return journeySpecialists.find((s) =>
    s.assignedRegions.some((r) => r.toLowerCase().includes(region.toLowerCase())),
  );
}
