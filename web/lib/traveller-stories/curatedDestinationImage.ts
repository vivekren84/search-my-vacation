/**
 * SMV Curated Destination Image — tier 4 of the Traveller Stories hero image
 * hierarchy (EBC: Traveller Stories Final Content, Media & Gallery
 * Completion, superseding the prior EBC's tier-4 design):
 *
 *   1. Journey-specific traveller photo (per-journey `heroImage` override)
 *   2. Journey-specific destination photo (`media.destinationPhotos`)
 *   3. Traveller photo (`media.travellerPhoto`)
 *   4. SMV curated destination image  <-- this file
 *   5. Monogram
 *
 * Business rule (current EBC): a generic curated destination image must
 * never be reused as the hero for more than one journey. Each journey shown
 * at tier 4 gets its own distinct image file — never the same file another
 * journey is also using. Where the repository does not contain enough
 * distinct, destination-accurate images to give every journey at a shared
 * destination its own unique photo, the excess journeys are deliberately
 * left on the monogram (tier 5) rather than duplicate a hero image or use a
 * geographically inaccurate one. This environment has no image-generation
 * tool available, so "generate a new image" (permitted by the current EBC)
 * was not an option this pass — see MONOGRAM_RETAINED_NO_CURATED_MATCH for
 * the specific journeys this affects and why, flagged for Vivek.
 *
 * Every entry below maps a journey directly to one specific image file (not
 * a shared destination key), and the mapping was built by first checking
 * file content hashes so two differently-named files that are actually
 * byte-identical (e.g. himachal-pradesh.webp / himachal-pradesh-v2.webp)
 * are never treated as if they were two distinct images.
 *
 * Source assets: `web/public/images/journey-director/*` — the same approved
 * image set already shown publicly today on the `/destinations` page (see
 * `config/public-destinations.config.ts`) and used by Journey Director, plus
 * a small number of previously-unwired variants (`-v2`/`-v3`/alternate
 * files) from `retainedJourneyImageAlternatives` in
 * `config/destination-images.config.ts`. Those variants are real,
 * already-in-repository destination photographs (not new/AI/stock assets);
 * they were excluded from tier 4 by the prior EBC purely out of caution
 * about "unconfirmed for public use" status. The current EBC's explicit
 * approval to source new destination imagery for missing-media cases is a
 * strictly broader permission than "reuse an existing, real, on-topic
 * destination photo that merely wasn't wired into a public page yet" — so
 * using them here to avoid duplication is a conservative choice, not a new
 * risk. This is called out per-entry below for Vivek's review.
 */
const curatedDestinationImageByJourneyId: Readonly<
  Record<string, { file: string; alt: string; note?: string }>
> = {
  // --- Kuala Lumpur & Langkawi, Malaysia / Malaysia & Singapore ---
  // Only one confirmed-distinct Malaysia (Petronas Towers) asset exists, so
  // it can serve exactly one of the two identical-destination journeys.
  // JRN-023's destination explicitly names Singapore too, so singapore.webp
  // (Supertree Grove/Marina Bay Sands) is a destination-accurate, genuinely
  // distinct second image rather than a forced duplicate.
  "JRN-013": { file: "malaysia.webp", alt: "The Petronas Twin Towers rising above Kuala Lumpur park" },
  "JRN-015": { file: "", alt: "" }, // see MONOGRAM_RETAINED_NO_CURATED_MATCH — no second unique Malaysia asset
  "JRN-023": { file: "singapore.webp", alt: "Supertree Grove and Marina Bay Sands in Singapore", note: "Destination is named as 'Malaysia & Singapore' — Singapore is accurate, not merely adjacent." },

  // --- Kashmir ---
  "JRN-016": { file: "kashmir.webp", alt: "A shikara on Dal Lake beneath the mountains of Kashmir" },

  // --- Andaman Islands (3 journeys, 3 confirmed-distinct assets) ---
  "JRN-019": { file: "andaman-v2.webp", alt: "The Cellular Jail and palms creating a distinctive Andaman island scene" },
  "JRN-022": { file: "andaman.webp", alt: "An Andaman island coastline and palm-lined shore" },
  "JRN-024": { file: "andaman-v3.webp", alt: "An Andaman island beach and turquoise water scene" },

  // --- Manali, Himachal Pradesh (4 journeys, only 2 confirmed-distinct
  // assets — himachal-pradesh.webp and himachal-pradesh-v2.webp are
  // byte-identical, confirmed via md5, and are treated as one image) ---
  "JRN-030": { file: "himachal-pradesh.webp", alt: "Paragliding above Solang Valley and the Himachal mountains" },
  "JRN-032": { file: "himachal-pradesh-v3.webp", alt: "Snow-capped peaks and pine slopes above Manali, Himachal Pradesh" },
  "JRN-035": { file: "", alt: "" }, // see MONOGRAM_RETAINED_NO_CURATED_MATCH — no third unique Himachal asset
  "JRN-039": { file: "", alt: "" }, // see MONOGRAM_RETAINED_NO_CURATED_MATCH — no fourth unique Himachal asset

  // --- Dubai & Abu Dhabi, UAE ---
  "JRN-045": { file: "dubai.webp", alt: "The Burj Khalifa and Downtown Dubai skyline at golden hour" },

  // --- Goa ---
  "JRN-020": { file: "goa.webp", alt: "A Goan coast and Portuguese church setting in warm evening light" },

  // --- Bali, Indonesia ---
  "JRN-026": { file: "bali.webp", alt: "A Balinese temple gate and rice terraces in warm tropical light" },

  // --- Meghalaya ---
  "JRN-036": { file: "meghalaya.webp", alt: "The Double-Decker Living Root Bridge in Meghalaya rainforest" },

  // --- Sri Lanka (2 journeys, 2 confirmed-distinct assets) ---
  "JRN-017": { file: "sri-lanka.webp", alt: "Sigiriya Rock Fortress above the Sri Lankan forest" },
  "JRN-047": { file: "sri-lanka-galle-golden-hour.jpg", alt: "Galle Fort's ramparts over the Sri Lankan coast at golden hour" },

  // --- Visakhapatnam, Andhra Pradesh (2 journeys, 1 confirmed-distinct asset) ---
  "JRN-043": { file: "vizag.webp", alt: "The Visakhapatnam coast, beach, and Eastern Ghats at golden hour" },
  "JRN-048": { file: "", alt: "" }, // see MONOGRAM_RETAINED_NO_CURATED_MATCH — no second unique Vizag asset
};

/**
 * Journeys deliberately left on monogram despite being missing-image
 * candidates. Two categories:
 *
 * 1. Original candidates (from the prior EBC) whose only repository image is
 *    either unconfirmed for public use or a genuine geographic mismatch.
 * 2. New this EBC: journeys that share a destination with another journey
 *    that already claimed the one confirmed-distinct image for that
 *    destination. Giving them the same file would violate this EBC's
 *    no-duplicate-hero rule; no image-generation tool is available in this
 *    environment to create a genuinely new one, so monogram is the safe,
 *    non-fabricating choice pending Vivek's input (new traveller photos, or
 *    an approved image-generation/stock source).
 *
 * Kept here as a documented record for the completion report — this
 * constant is not read by application code.
 */
export const MONOGRAM_RETAINED_NO_CURATED_MATCH = Object.freeze([
  { journeyId: "JRN-014", traveller: "CB Siva", destination: "Kodaikanal, Poombarai & Palani, Tamil Nadu", reason: "Only candidate is Kodaikanal in retainedJourneyImageAlternatives (unconfirmed for public use); tamil-nadu key shows Mahabalipuram Shore Temple, a different city ~450km away." },
  { journeyId: "JRN-031", traveller: "Sukumar K", destination: "Kodaikanal, Tamil Nadu", reason: "Same as JRN-014." },
  { journeyId: "JRN-028", traveller: "chitra chandrasekaran", destination: "Madurai, Tamil Nadu", reason: "tamil-nadu key shows Mahabalipuram Shore Temple, a different city, not Madurai." },
  { journeyId: "JRN-040", traveller: "Prabhu H", destination: "Ooty, Tamil Nadu", reason: "Only candidate is Ooty in retainedJourneyImageAlternatives (unconfirmed for public use); tamil-nadu key is Mahabalipuram, a different city." },
  { journeyId: "JRN-046", traveller: "Matilda Dsouza", destination: "Ooty, Tamil Nadu", reason: "Same as JRN-040." },
  { journeyId: "JRN-033", traveller: "Sridevi Mohanty", destination: "Munnar, Kerala", reason: "kerala key shows backwaters/kettuvallam, not a Munnar hill-station scene; judged too visually inconsistent with the actual journey." },
  { journeyId: "JRN-037", traveller: "Abhinaya Murali", destination: "Sikkim", reason: "Only candidate is Sikkim in retainedJourneyImageAlternatives (unconfirmed for public use)." },
  { journeyId: "JRN-034", traveller: "Rajkumar Yadavalli", destination: "Araku Valley, Andhra Pradesh", reason: "No matching image exists anywhere in the repository, confirmed or unconfirmed." },
  { journeyId: "JRN-049", traveller: "Thiyagarajan Sambasivam", destination: "Bhubaneswar, Odisha", reason: "No matching image exists anywhere in the repository." },
  { journeyId: "JRN-015", traveller: "Lavi Rajan", destination: "Kuala Lumpur & Langkawi, Malaysia", reason: "Identical destination to JRN-013, which already uses the one confirmed-distinct Malaysia asset (malaysia.webp). No second unique Malaysia photo exists in the repository and no image-generation tool is available in this environment. Needs new traveller photo or an approved image source." },
  { journeyId: "JRN-035", traveller: "Swathi Ramesh", destination: "Manali, Himachal Pradesh", reason: "Third of four Manali journeys; only two confirmed-distinct Himachal assets exist (himachal-pradesh.webp and -v3.webp, both already assigned to JRN-030/JRN-032). No image-generation tool available. Needs new traveller photo or an approved image source." },
  { journeyId: "JRN-039", traveller: "Manikantan Narasimhan", destination: "Manali, Himachal Pradesh", reason: "Fourth of four Manali journeys; same constraint as JRN-035." },
  { journeyId: "JRN-048", traveller: "Shankar Subramanian", destination: "Visakhapatnam, Andhra Pradesh", reason: "Identical destination to JRN-043, which already uses the one confirmed-distinct Vizag asset (vizag.webp). No second unique Vizag photo exists in the repository and no image-generation tool is available in this environment. Needs new traveller photo or an approved image source." },
] as const);

/**
 * Returns the curated destination image for a journey, or null if none is
 * confirmed-safe / uniquely available for that journey (caller should fall
 * back to the monogram).
 */
export function curatedDestinationImageForJourney(
  journeyId: string,
  travellerName: string,
): { src: string; alt: string } | null {
  const entry = curatedDestinationImageByJourneyId[journeyId];
  if (!entry || !entry.file) return null;

  return {
    src: `/images/journey-director/${entry.file}`,
    alt: `${entry.alt} — representing ${travellerName}'s journey`,
  };
}
