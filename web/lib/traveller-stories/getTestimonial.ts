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
 * - "andaman-sathya-krithivasan" → JRN-025 (Sathya Krithivasan, "The Andaman
 *   break the family needed most") — exact name and destination match. The
 *   traveller was renamed from "Sathya Karthik" to "Sathya Krithivasan" (a
 *   Product-approved correction, R1.3-WS2-T2); the curated testimonial `id`
 *   in travellerStories.data.ts was updated to match, and this mapping key
 *   is updated to the new id so the lookup does not throw.
 *
 * JRN-042 (Hari Haran Ravichandran's other journey, Mangalore & Murudeshwar)
 * deliberately has no entry here — no authentic testimonial text for it has
 * ever been supplied. It correctly uses the metadata-only ("Journey
 * Snapshot") fallback. Adding another journey's testimonial must never
 * overwrite or affect a different journey belonging to the same traveller.
 *
 * Traveller Testimonial Migration (R1.3-WS2-IMP-03): the 37 mappings below
 * this comment (JRN-014 through JRN-053, excluding ids already listed
 * above) were added in one migration, per Product's approval that this
 * formally supersedes the original Authentic Story Rule's treatment of
 * Journey Snapshot as permanent for these journeys (EBC-R1.3-WS2-04
 * Decision 1). Each entry's traveller name and destination were
 * cross-verified programmatically against
 * `PRW-R1.3-001-Traveller-Stories.xlsx` before migration — 37/37 matched
 * with zero discrepancies; none needed the kind of manual disambiguation
 * the entries above required. Quote text is verbatim from the workbook;
 * the only transformation applied was normalising the workbook's
 * single-newline paragraph breaks to this file's existing `\n\n`
 * convention (see `travellerStories.data.ts`) — no words were changed,
 * added, or removed.
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
  "JRN-025": testimonialById("andaman-sathya-krithivasan"),
  "JRN-014": testimonialById("cb-siva"),
  "JRN-015": testimonialById("lavi-rajan"),
  "JRN-016": testimonialById("anirudh-s"),
  "JRN-017": testimonialById("karthik-ramanathan"),
  "JRN-018": testimonialById("sonia-negi"),
  "JRN-019": testimonialById("balaji-hariharan"),
  "JRN-020": testimonialById("palwinder-singh"),
  "JRN-021": testimonialById("rami-reddy"),
  "JRN-022": testimonialById("padma-priya-govindaraju"),
  "JRN-023": testimonialById("dinesh-chandrasekaran"),
  "JRN-024": testimonialById("aru-k"),
  "JRN-026": testimonialById("srividhya-subramanian"),
  "JRN-027": testimonialById("sunoj-s-m"),
  "JRN-028": testimonialById("chitra-chandrasekaran"),
  "JRN-029": testimonialById("vaidyanath-balasubramanian"),
  "JRN-030": testimonialById("lina-mahurkar"),
  "JRN-031": testimonialById("sukumar-k"),
  "JRN-032": testimonialById("sridevi-vadhirajan"),
  "JRN-033": testimonialById("sridevi-mohanty"),
  "JRN-034": testimonialById("rajkumar-yadavalli"),
  "JRN-035": testimonialById("swathi-ramesh"),
  "JRN-036": testimonialById("ashika-hema"),
  "JRN-037": testimonialById("abhinaya-murali"),
  "JRN-039": testimonialById("manikantan-narasimhan"),
  "JRN-040": testimonialById("prabhu-h"),
  "JRN-041": testimonialById("charuvasine"),
  "JRN-042": testimonialById("hari-haran-ravichandran"),
  "JRN-043": testimonialById("harishankar-kuppusamy"),
  "JRN-044": testimonialById("kohila-dev-arun-kumar"),
  "JRN-045": testimonialById("malleswari"),
  "JRN-046": testimonialById("matilda-dsouza"),
  "JRN-047": testimonialById("praveen-kumar"),
  "JRN-048": testimonialById("shankar-subramanian"),
  "JRN-049": testimonialById("thiagarajan-s"),
  "JRN-050": testimonialById("vidhya"),
  "JRN-051": testimonialById("vidhya-lakshmi"),
  "JRN-053": testimonialById("ahilandeswari-v"),
};

export function getTestimonialForJourney(journeyId: string): TravellerStory | null {
  return testimonialByJourneyId[journeyId] ?? null;
}
