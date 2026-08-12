import { siteContact } from "@/config/contact.config";

/**
 * Traveller Stories — Google Reviews CTA (EBC-033: Traveller Stories Final
 * Content Polish).
 *
 * Shown only on journeys with no authentic long-form testimonial (see
 * `getTestimonialForJourney`). We never fabricate a testimonial or expand
 * metadata into invented traveller quotes — Google Reviews is the agreed
 * canonical source for additional customer feedback, so a journey without
 * its own quote directs the visitor there instead of ending abruptly after
 * the Journey Snapshot.
 *
 * Styled to match the existing "Plan My Experience" CTA card already used
 * lower on this same page (same rounded card, border, shadow, serif
 * heading, and pill button treatment) — intentionally reusing SMV's
 * existing button and card language rather than introducing a new one.
 */
export default function GoogleReviewsCTA() {
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-[1.75rem] border border-[#e4d2b5] bg-[radial-gradient(circle_at_50%_0%,#f7dfb4,transparent_60%),#FFFDFC] px-8 py-10 text-center shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:px-12">
      <p className="font-serif text-2xl leading-tight text-[#2A211C]">More Traveller Experiences</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#80664d]">
        Every journey is unique, and so is every traveller&apos;s story.
        <br className="hidden sm:block" />
        Read more verified experiences shared by our travellers on Google Reviews.
      </p>
      <a
        href={siteContact.googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Read Search My Vacation's traveller reviews on Google in a new tab"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C]"
      >
        Read Google Reviews
        <span aria-hidden="true">↗</span>
      </a>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#986328]">
        <span aria-hidden="true">★★★★★</span> Rated by our travellers
      </p>
    </div>
  );
}
