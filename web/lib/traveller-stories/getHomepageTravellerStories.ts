import { getApprovedTravellerJourneys, type TravellerJourneyCard } from "./getTravellerJourneys";
import { getTestimonialForJourney } from "./getTestimonial";

/**
 * Homepage Traveller Stories Curated Preview (Release 1.1).
 *
 * The homepage previously rendered every entry in the legacy
 * `config/travellerStories.data.ts` array directly (15 full-length cards),
 * which is why the homepage had become excessively long. This is the single
 * place that decides which (at most 3) journeys the homepage preview shows —
 * do not duplicate this selection logic elsewhere, and do not hardcode a
 * separate homepage-only story list.
 *
 * Selection rule, in order:
 * 1. Reuse the exact canonical journey list the dedicated `/traveller-stories`
 *    page already uses (`getApprovedTravellerJourneys`), sorted newest first
 *    — the same source of truth, not a competing dataset.
 * 2. Eligibility: only journeys with a genuine direct traveller
 *    testimonial/story qualify (`getTestimonialForJourney` returns non-null).
 *    `getTestimonialForJourney` is backed solely by
 *    `config/travellerStories.data.ts`, sourced from Client Testimonials.xlsx
 *    — by construction it never contains Google Review text, so this
 *    automatically satisfies "no Google Reviews-only entry on the homepage"
 *    without needing a separate check.
 * 3. Respect the existing `featured` flag already present on each journey in
 *    the canonical metadata (`journey.featured`) — this is the project's own
 *    existing prioritisation mechanism, not a new one invented for this EBC.
 * 4. Take the first 3 of the filtered (still newest-first) list. No
 *    additional re-sorting — the canonical sort order is preserved as-is.
 *
 * If fewer than 3 journeys are both featured and eligible, this returns
 * fewer than 3 rather than backfilling with an ineligible or unfeatured
 * story — the homepage must never show more than 3, but it also must never
 * show a story that doesn't meet the eligibility rule just to reach 3.
 */

const HOMEPAGE_STORY_COUNT = 3;
const EXCERPT_MAX_LENGTH = 220;

export interface HomepageTravellerStory {
  journeyId: string;
  slug: string;
  title: string;
  travellerName: string;
  destination: string;
  experienceType: string;
  travelMonth: string;
  travelYear: number;
  excerpt: string;
  heroImage: TravellerJourneyCard["heroImage"];
}

/**
 * Truncates a (possibly multi-paragraph) testimonial to a short, single-line
 * homepage excerpt. Cuts at the nearest preceding word boundary so the
 * excerpt never ends mid-word, and always ends with an ellipsis when
 * truncated. This only affects what the homepage card displays — the
 * canonical testimonial text in `travellerStories.data.ts` is never modified.
 */
function toExcerpt(quote: string, maxLength: number = EXCERPT_MAX_LENGTH): string {
  const singleLine = quote.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;

  const truncated = singleLine.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const clean = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${clean}…`;
}

export async function getHomepageTravellerStories(): Promise<HomepageTravellerStory[]> {
  const journeys = await getApprovedTravellerJourneys();

  const eligible = journeys.filter((journey) => {
    if (!journey.featured) return false;
    return getTestimonialForJourney(journey.journeyId) !== null;
  });

  return eligible.slice(0, HOMEPAGE_STORY_COUNT).map((journey) => {
    const testimonial = getTestimonialForJourney(journey.journeyId);

    return {
      journeyId: journey.journeyId,
      slug: journey.slug,
      title: journey.title,
      travellerName: journey.travellerName,
      destination: journey.destination,
      experienceType: journey.experienceType,
      travelMonth: journey.travelMonth,
      travelYear: journey.travelYear,
      // Non-null by construction — every journey reaching this point already
      // passed the `getTestimonialForJourney(...) !== null` filter above.
      excerpt: toExcerpt(testimonial!.quote),
      heroImage: journey.heroImage,
    };
  });
}
