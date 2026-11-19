import type { TravellerJourneyCard } from "./getTravellerJourneys";
import { getTestimonialForJourney } from "./getTestimonial";

/**
 * Traveller Stories Quality Gate (SMV Release 1.3 - P-02).
 *
 * Enforces quality standards for public traveller stories:
 * 1. Visual or Editorial Proof: A journey must possess EITHER:
 *    - An authentic hero photo (traveller photo or journey photo on disk), OR
 *    - An approved SMV curated destination photo (Tier 4), OR
 *    - A verified authentic testimonial quote.
 * 2. Incomplete Stubs: Records possessing NEITHER an image NOR a testimonial quote
 *    are suppressed from the public listing to eliminate empty/broken cards.
 *    They remain safely preserved in `metadata.json` for internal tracking.
 */
export function isStoryQualityGated(journey: TravellerJourneyCard): boolean {
  const hasImage = Boolean(journey.heroImage?.src);
  const hasTestimonial = Boolean(getTestimonialForJourney(journey.journeyId));

  // Must have at least an image or a verified testimonial quote
  return hasImage || hasTestimonial;
}
