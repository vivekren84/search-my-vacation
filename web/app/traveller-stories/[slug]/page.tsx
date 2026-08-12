import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import PublicFooter from "@/components/layout/PublicFooter";
import JourneySummary from "@/components/traveller-stories/JourneySummary";
import RelatedStories from "@/components/traveller-stories/RelatedStories";
import Gallery from "@/components/traveller-stories/Gallery";
import GoogleReviewsCTA from "@/components/traveller-stories/GoogleReviewsCTA";
import { initialsFor } from "@/components/discovery/TravellerStoryCards";
import { getApprovedTravellerJourneys, getTravellerJourneyBySlug } from "@/lib/traveller-stories/getTravellerJourneys";
import { getTestimonialForJourney } from "@/lib/traveller-stories/getTestimonial";
import { getRelatedJourneys } from "@/lib/traveller-stories/relatedJourneys";

/**
 * Traveller Stories — journey detail page
 *
 * Resolves the journey by slug against the same canonical metadata used by
 * the listing page, then renders the full story in the hierarchy required by
 * the "Traveller Stories Final Content, Media & Gallery Completion" EBC:
 *
 *   1. Hero
 *   2. Journey title
 *   3. Traveller name
 *   4. Journey Summary
 *   5. Traveller's Story / What They Said (authentic testimonial) or, when
 *      no authentic testimonial exists, a Journey Snapshot — a complete,
 *      polished factual summary. This is a legitimate, permanent
 *      presentation, not a placeholder, and never uses "coming soon"
 *      language or an invented quote.
 *   6. Gallery (interactive — click/tap to enlarge, with a lightbox)
 *   7. Related Stories
 *   8. Plan My Experience CTA
 *
 * This page intentionally does not use the shared `PublicPage` banner
 * layout, because that layout always renders its title above any page
 * content — this EBC requires the hero photo to render first instead.
 * `Header` and `PublicFooter` are reused directly so the rest of the site's
 * chrome stays identical.
 */

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getTravellerJourneyBySlug(slug);

  if (!journey) {
    return { title: "Traveller Story" };
  }

  return {
    title: journey.title,
    description: `${journey.travellerName}'s ${journey.destination} journey with Search My Vacation.`,
    alternates: { canonical: `/traveller-stories/${journey.slug}` },
  };
}

function PremiumCta() {
  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-[#e4d2b5] bg-[radial-gradient(circle_at_50%_0%,#f7dfb4,transparent_60%),#FFFDFC] px-8 py-12 text-center shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:px-12">
      <p className="font-serif text-2xl leading-tight text-[#2A211C]">Inspired by this journey?</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#80664d]">
        Every traveller is unique. We&apos;d love to create a personalised version of this experience for you.
      </p>
      <Link
        href="/journey-passport"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F5951C] px-6 py-3 text-sm font-bold text-[#2A211C] transition hover:bg-[#F5951C]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C]"
      >
        Plan My Experience
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function BackToListingLink() {
  return (
    <Link
      href="/traveller-stories"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#986328] transition hover:text-[#2A211C]"
    >
      <span aria-hidden="true">←</span>
      Back to Traveller Stories
    </Link>
  );
}

export default async function TravellerStoryDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const [journey, allJourneys] = await Promise.all([
    getTravellerJourneyBySlug(slug),
    getApprovedTravellerJourneys(),
  ]);

  if (!journey) {
    notFound();
  }

  const testimonial = getTestimonialForJourney(journey.journeyId);
  const relatedJourneys = getRelatedJourneys(journey, allJourneys);
  const testimonialParagraphs = testimonial ? testimonial.quote.split("\n\n").filter(Boolean) : [];

  // Hero presentation (Traveller Stories Final Hero Quality & Turbopack
  // Source Repair EBC): the previous treatment forced every hero into a
  // full-bleed, viewport-width 16:9–21:9 crop regardless of the source
  // photo's real dimensions, which visibly pixelated/blurred lower-resolution
  // traveller photos and badly cropped portrait ones. The hero now sits
  // inside the same constrained content column as the rest of the page and
  // picks its treatment from the image's real dimensions (captured by
  // `resolveHeroImage` in getTravellerJourneys.ts): a wide `object-cover`
  // frame for genuinely landscape, reasonably high-resolution photos, and a
  // contained, non-upscaled treatment — centred over a soft blurred backdrop
  // made from the same photo — for portrait or low-resolution sources, so a
  // smaller image reads as an intentional editorial choice rather than a
  // stretched, undersized one. Width/height are unknown (`null`) only if the
  // file couldn't be read; that also falls back to the safe "contained"
  // treatment rather than risking a bad crop.
  const heroWidth = journey.heroImage?.width ?? null;
  const heroHeight = journey.heroImage?.height ?? null;
  const heroAspectRatio = heroWidth && heroHeight ? heroWidth / heroHeight : null;
  const heroIsLowResolution = heroWidth !== null && heroWidth < 900;
  const heroIsLandscapeEnough = heroAspectRatio !== null && heroAspectRatio >= 1.2;
  const heroShouldContain = !heroAspectRatio || heroIsLowResolution || !heroIsLandscapeEnough;

  return (
    <>
      <Header />
      <main className="bg-[#FFFDFC] text-[#2A211C]">
        {/* 1. Hero — constrained to the content column, never full-bleed. */}
        <section className="layout-section pb-0 pt-8 sm:pt-10">
          <div className="layout-container layout-container--reading">
            <div className="relative isolate mx-auto flex h-[19rem] max-w-2xl items-center justify-center overflow-hidden rounded-[1.75rem] border border-[#e4d2b5] bg-[#f5e4c5] shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:h-[24rem] lg:h-[28rem]">
              {journey.heroImage ? (
                <>
                  {heroShouldContain ? (
                    <Image
                      src={journey.heroImage.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 640px) 100vw, 42rem"
                      className="scale-110 object-cover opacity-40 blur-2xl"
                    />
                  ) : null}
                  <Image
                    src={journey.heroImage.src}
                    alt={journey.heroImage.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 42rem"
                    className={heroShouldContain ? "relative object-contain p-6 sm:p-10" : "object-cover"}
                    priority
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                  <span className="grid size-24 place-items-center rounded-full bg-white/70 text-2xl font-bold text-[#986328]">
                    {initialsFor(journey.travellerName)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="layout-section pt-10">
          <div className="layout-container layout-container--reading">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A211C]">
                {journey.experienceType}
              </p>

              {/* 2. Journey title */}
              <h1 className="mt-5 text-balance font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-normal leading-[1.05] tracking-[-.04em]">
                {journey.title}
              </h1>

              {/* 3. Traveller name */}
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#986328]">
                A story by {journey.travellerName}
              </p>
            </div>

            {/* 4. Journey Summary */}
            <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-[#e4d2b5] bg-white px-8 py-8 shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:px-12">
              <JourneySummary
                facts={{
                  destination: journey.destination,
                  duration: journey.duration,
                  travellerType: journey.travellerType,
                  experienceType: journey.experienceType,
                  travelMonth: journey.travelMonth,
                  travelYear: journey.travelYear,
                }}
              />
            </div>

            {/* 5. Traveller's Story / What They Said, or Journey Snapshot */}
            {testimonial ? (
              <div className="mx-auto mt-8 max-w-2xl rounded-[1.75rem] border border-[#e4d2b5] bg-white px-8 py-12 shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:px-12">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#F5951C]">
                  In {testimonial.name.split(" ")[0]}&apos;s own words
                </p>
                <blockquote className="mt-4 space-y-4 font-serif text-xl leading-relaxed text-[#2A211C] sm:text-2xl">
                  {testimonialParagraphs.map((paragraph, index) => (
                    <p key={index}>
                      {index === 0 ? "“" : ""}
                      {paragraph}
                      {index === testimonialParagraphs.length - 1 ? "”" : ""}
                    </p>
                  ))}
                </blockquote>
                <cite className="mt-6 block not-italic text-sm font-semibold text-[#80664d]">
                  — {testimonial.name}, {testimonial.destination}
                </cite>
              </div>
            ) : (
              <>
                <div className="mx-auto mt-8 max-w-2xl rounded-[1.75rem] border border-[#e4d2b5] bg-white px-8 py-10 shadow-[0_14px_34px_rgba(91,55,18,.07)] sm:px-12">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-[#F5951C]">Journey Snapshot</p>
                  <p className="mt-3 font-serif text-2xl leading-tight text-[#2A211C]">
                    {journey.travellerName}&apos;s {journey.destination} journey
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#80664d]">
                    A {journey.duration.toLowerCase()} {journey.experienceType.toLowerCase()} experience, crafted around
                    what {journey.travellerName} was hoping to feel — see the facts above, and browse the moments from
                    the journey below.
                  </p>
                </div>

                {/* No authentic testimonial exists for this journey — direct
                    visitors to Google Reviews (the agreed canonical source for
                    additional traveller feedback) instead of ending the page
                    abruptly after the Journey Snapshot. Never a fabricated quote. */}
                <GoogleReviewsCTA />
              </>
            )}

            {/* 6. Gallery */}
            <Gallery images={journey.galleryImages} travellerName={journey.travellerName} />
          </div>
        </section>

        {/* 7. Related Stories */}
        <RelatedStories journeys={relatedJourneys} />

        {/* 8. Plan My Experience CTA */}
        <section className="layout-section pt-0">
          <div className="layout-container layout-container--reading">
            <PremiumCta />

            <div className="mx-auto mt-8 flex max-w-2xl justify-center">
              <BackToListingLink />
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
