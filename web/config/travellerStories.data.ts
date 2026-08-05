/**
 * Release 1 — "Stories from Our Travellers"
 *
 * Canonical data for the Phase 3 TravellerStories implementation.
 * This file contains content and types only; it does not contain React or
 * rendering logic.
 *
 * Source: Client Testimonials.xlsx.
 * Google Reviews were used only for duplicate/reference checks; no Google
 * Review text is included here.
 *
 * Images are intentionally optional. No asset path should be added until the
 * corresponding file exists in the repository. The component must render a
 * complete, accessible card when `image` and `alt` are absent.
 */

export type ExperienceType =
  | "Family Holiday"
  | "Honeymoon"
  | "Solo"
  | "Weekend Getaway"
  | "Spiritual / Heritage"
  | "Heritage & Luxury";

export interface TravellerStory {
  /** Stable React key and future CMS slug. */
  id: string;
  /** Recommended homepage order, starting at 1. */
  displayOrder: number;
  name: string;
  destination: string;
  experience: ExperienceType;
  travelMonth: string;
  travelYear: number;
  quote: string;
  /** Optional detail for multi-stop journeys; not required on the card. */
  route?: readonly string[];
  /** Whether corresponding source assets are known to be available. */
  travellerPhotoAvailable: boolean;
  destinationPhotoAvailable: boolean;
  /** Repository-relative public asset path, added only when verified. */
  image?: string;
  /** Required whenever `image` is supplied. */
  alt?: string;
}

export const travellerStories: readonly TravellerStory[] = [
  {
    id: "family-munnar",
    displayOrder: 1,
    name: "Vinothkumar Vishwanathan",
    destination: "Munnar, Kerala",
    experience: "Family Holiday",
    travelMonth: "May",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "Munnar had been our dream destination for years, and we finally made it there for a three-day trip in May. Our resort sat surrounded by lush greenery, with light rain and mist following us most days, giving the hills a calm, quiet feel. Our driver knew the area well and took us to Mattupetty Dam, the Kannan Devan Tea Museum, Eravikulam National Park, Kundala Dam, Echo Point, and the Rose Garden, staying patient and kind throughout. It was an unhurried trip — no rushing between stops, just time to take in the scenery. A memorable, well-planned family holiday, exactly as we'd imagined it.",
  },
  {
    id: "honeymoon-shimla-manali",
    displayOrder: 2,
    name: "Ramakrishnan Appadorai",
    destination: "Shimla–Manali, Himachal Pradesh",
    experience: "Honeymoon",
    travelMonth: "April",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: false,
    quote:
      "Shimla-Manali was such a special trip for the two of us. Over seven days, we barely had to think about logistics — the stays, meals, restaurants, and car were all sorted, so we could just relax and enjoy each other's company. The camp stay in Kasol and the stay near the apple orchard stood out as the best of the trip, each with its own quiet charm. Our driver, Channi bhai, was patient and friendly, and made sure we saw everything we'd hoped to. It was a genuinely hassle-free honeymoon, and one we'll remember for a long time.",
  },
  {
    id: "solo-kodaikanal",
    displayOrder: 3,
    name: "Nathan",
    destination: "Kodaikanal, Tamil Nadu",
    experience: "Solo",
    travelMonth: "September",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "I set off on a solo motorbike ride from Chennai to Kodaikanal, and it turned into one of the best trips of my life. The road wound through quiet villages and mist-covered hills, each turn opening onto a new view. The climb into Kodaikanal was tough but rewarding — valleys unfolding below, the air turning cool and green. I stayed in a small hotel overlooking the hills and spent my days exploring Kodaikanal Lake, walking Coaker's Walk, and wandering the local markets. It was equal parts adventure, rest, and discovery — a trip I'll keep returning to in my memory.",
  },
  {
    id: "weekend-kabini",
    displayOrder: 4,
    name: "Kannama Rubesh",
    destination: "Kabini, Karnataka",
    experience: "Weekend Getaway",
    travelMonth: "August",
    travelYear: 2023,
    travellerPhotoAvailable: false,
    destinationPhotoAvailable: true,
    quote:
      "Kabini had been on my list for a long time, but planning always felt daunting — safari details and accommodation options were hard to pin down on my own. A college friend's mention of Search My Vacation nudged me to reach out, even though I was unsure about costs, timings, and dates. They gave us a few stay options and talked us through each one patiently. We ended up close to the JLR Resorts, right by the river, which made the whole stay feel special despite the long-weekend crowds. It turned out to be a genuinely relaxing escape — simple, well-organized, and worth the trip.",
  },
  {
    id: "spiritual-guruvayur",
    displayOrder: 5,
    name: "Ahilandeshwari V",
    destination: "Guruvayur, Kerala",
    experience: "Spiritual / Heritage",
    travelMonth: "March",
    travelYear: 2024,
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "Our trip to Guruvayur turned out to be a beautiful mix of spiritual reflection and cultural discovery. The highlight was the Guruvayur Temple itself — we were able to join the early morning rituals, and the whole experience felt deeply peaceful. Our stay was close to the temple, which made the days easy and unhurried, and we got to try authentic Kerala meals that added another layer to the trip. A visit to Punnathur Kotta, the elephant sanctuary, was unexpected and moving — seeing the elephants up close and learning about the conservation work there stayed with us. A quiet, meaningful journey.",
  },
  {
    id: "heritage-rajasthan",
    displayOrder: 6,
    name: "Karthik R",
    destination: "Rajasthan",
    experience: "Heritage & Luxury",
    travelMonth: "January",
    travelYear: 2024,
    route: ["Jaipur", "Udaipur", "Mount Abu", "Jaisalmer", "Jodhpur"],
    travellerPhotoAvailable: true,
    destinationPhotoAvailable: true,
    quote:
      "We set out to see five of Rajasthan's most iconic cities — Jaipur, Udaipur, Mount Abu, Jaisalmer, and Jodhpur — and each one left its own impression. Jaipur's City Palace, Hawa Mahal, and Amber Fort were striking, and the bazaars were full of color and craft. Udaipur's boat ride on Lake Pichola, with the City Palace as a backdrop, was a quiet highlight. Mount Abu brought cooler air and the marble craftsmanship of the Dilwara Temples. In Jaisalmer, a camel safari and a night under the stars in the Thar Desert stood out, followed by the imposing Mehrangarh Fort in Jodhpur. A trip layered with history at every turn.",
  },
] as const;
