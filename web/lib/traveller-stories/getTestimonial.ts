import { travellerStories, type TravellerStory } from "@/config/travellerStories.data";

/**
 * Authentic Story Rule (Traveller Stories Listing Finalisation & Repair EBC):
 * detail pages must only show testimonial prose that genuinely exists in a
 * canonical source. The only canonical testimonial source in this repository
 * is `config/travellerStories.data.ts` (sourced from Client Testimonials.xlsx).
 *
 * This file maps each of those curated testimonials to the specific
 * `journeyId` it belongs to in each traveller directory's metadata.json
 * under web/public/traveller-stories, verified by traveller name and
 * destination/route match. Journeys with no
 * entry here fall back to the metadata-only detail treatment — that is
 * expected and safe, not an error.
 *
 * Do not add an entry unless the quote is verifiably about that exact
 * journey. Do not paraphrase, invent, or extend a quote to cover a journey
 * it wasn't written about.
 *
 * Verified mappings:
 * - "family-munnar" → JRN-010 (Vinothkumar Vishwanathan, Munnar) — exact name
 *   and destination match.
 * - "honeymoon-shimla-manali" → JRN-007 (Ramakrishnan Appadorai,
 *   Shimla–Manali) — exact name and destination match.
 * - "solo-kodaikanal" → JRN-003 (Nathan, Kodaikanal) — exact name and
 *   destination match.
 * - "weekend-kabini" → JRN-004 (Kannama Rubesh, Kabini) — exact name and
 *   destination match.
 * - "spiritual-guruvayur" → JRN-006 (Ahilandeshwari V, Guruvayur) — exact
 *   name and destination match.
 * - "heritage-rajasthan" → JRN-009 (Karthik Ramanathan, "Five cities across
 *   Rajasthan"). The testimonial's `name` field ("Karthik R") is a shortened
 *   form, not an exact string match — but the five-city route (Jaipur,
 *   Udaipur, Mount Abu, Jaisalmer, Jodhpur) is an exact, unique match against
 *   JRN-009's destination photos and title, and there is only one Rajasthan
 *   journey and only one Karthik Ramanathan in the dataset. Treated as
 *   verified, not inferred.
 * - "family-adventure-amritsar-dalhousie-dharamshala" → JRN-052 (Hari Haran
 *   Ravichandran, "Mountains, Snowfall and Our First Family Adventure
 *   Together"). Testimonial text explicitly supplied and approved for use by
 *   the "Traveller Stories Final Content, Media & Gallery Completion" EBC —
 *   exact name and destination match (Amritsar, Dalhousie & Dharamshala).
 * - "family-holiday-manali-satvender" → JRN-001 (Satvender Sikarwar, Manali).
 *   Vivek's supplied text introduced the traveller as "Satvendar" — this is
 *   the same person as the repository's canonical traveller Satvender
 *   Sikarwar (only one Manali-solo-family journey, only one matching
 *   traveller); associated with the existing traveller, not a new one.
 * - "karnataka-multigenerational-vignesh" → JRN-002 (Vignesh Vishwanathan,
 *   "Three Generations, One Incredible Karnataka Journey") — exact
 *   destination and multi-generational-family match.
 * - "kullu-manali-sathish" → JRN-005 (Sathish, "Making Mountain Memories in
 *   Kullu and Manali") — exact name and destination match.
 * - "gujarat-krishnan" → JRN-008 (Krishnan R V, "Faith, Family and the
 *   Colors of Gujarat") — exact name and destination match (Ahmedabad and
 *   Dwaraka, both in Gujarat).
 * - "shimla-manali-bharat" → JRN-011 (Bharat Varathan, "A Mountain Holiday
 *   the Whole Family Loved") — exact name and destination match.
 * - "sri-lanka-madhangi" → JRN-012 (Madhangi, "Three generations, one
 *   unforgettable Sri Lanka journey") — exact name, destination, and
 *   multi-generational-family match.
 * - "kl-langkawi-ishwarya" → JRN-013 (Ishwarya Raja, "A first girls-only
 *   international adventure") — exact name and destination match (Kuala
 *   Lumpur & Langkawi).
 * - "andaman-sathya-karthik" → JRN-025 (Sathya Karthik, "The Andaman break
 *   the family needed most") — exact name and destination match.
 *
 * JRN-042 (Hari Haran Ravichandran's other journey, Mangalore & Murudeshwar)
 * deliberately has no entry here — no authentic testimonial text for it has
 * ever been supplied. It correctly uses the metadata-only ("Journey
 * Snapshot") fallback. Adding another journey's testimonial must never
 * overwrite or affect a different journey belonging to the same traveller.
 */
const testimonialById = (id: string): TravellerStory => {
  const found = travellerStories.find((story) => story.id === id);
  if (!found) {
    throw new Error(`getTestimonial: expected curated testimonial "${id}" not found`);
  }
  return found;
};

export const testimonialByJourneyId: Readonly<Record<string, TravellerStory>> = {
  "JRN-010": testimonialById("family-munnar"),
  "JRN-007": testimonialById("honeymoon-shimla-manali"),
  "JRN-003": testimonialById("solo-kodaikanal"),
  "JRN-004": testimonialById("weekend-kabini"),
  "JRN-006": testimonialById("spiritual-guruvayur"),
  "JRN-009": testimonialById("heritage-rajasthan"),
  "JRN-052": testimonialById("family-adventure-amritsar-dalhousie-dharamshala"),
  "JRN-001": testimonialById("family-holiday-manali-satvender"),
  "JRN-002": testimonialById("karnataka-multigenerational-vignesh"),
  "JRN-005": testimonialById("kullu-manali-sathish"),
  "JRN-008": testimonialById("gujarat-krishnan"),
  "JRN-011": testimonialById("shimla-manali-bharat"),
  "JRN-012": testimonialById("sri-lanka-madhangi"),
  "JRN-013": testimonialById("kl-langkawi-ishwarya"),
  "JRN-025": testimonialById("andaman-sathya-karthik"),
};

export function getTestimonialForJourney(journeyId: string): TravellerStory | null {
  return testimonialByJourneyId[journeyId] ?? null;
}
