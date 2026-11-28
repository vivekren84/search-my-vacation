"use client";

import Link from "next/link";
import JourneyMoodIllustration, {
  type JourneyMoodIllustrationName,
} from "./JourneyMoodIllustration";

const FEELING_CARDS = [
  {
    key: "relax",
    title: "Relax",
    desc: "Slow down & unwind",
    artwork: "relax",
    href: "/journey-passport?mood=relax",
  },
  {
    key: "explore",
    title: "Explore",
    desc: "Discover & adventure",
    artwork: "explore",
    href: "/journey-passport?mood=explore",
  },
  {
    key: "celebrate",
    title: "Celebrate",
    desc: "Make it unforgettable",
    artwork: "celebrate",
    href: "/journey-passport?mood=celebrate",
  },
  {
    key: "romance",
    title: "Romance",
    desc: "Moments that connect",
    artwork: "romance",
    href: "/journey-passport?mood=romance",
  },
  {
    key: "memory_makers",
    title: "Memory Makers",
    desc: "Make moments together",
    artwork: "memory",
    href: "/journey-passport?mood=memory_makers",
  },
] as const satisfies ReadonlyArray<{
  key: string;
  title: string;
  desc: string;
  artwork: JourneyMoodIllustrationName;
  href: string;
}>;

export default function HeroJourney() {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden">
      {/* Background Photograph */}
      <img
        src="/images/hero-coastal-family.webp"
        alt="Family overlooking a golden-hour coastal horizon"
        className="absolute inset-0 h-full w-full object-cover object-[78%_65%] lg:object-[right_bottom]"
      />

      {/* Readability Scrim (preserves sunset horizon & bottom-right family silhouette) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 38% 45%, rgba(20, 17, 14, 0.52) 0%, rgba(20, 17, 14, 0.25) 55%, rgba(20, 17, 14, 0.05) 100%)",
        }}
      />

      {/* Foreground Content (shifted left-of-center on desktop so right 22% remains unobstructed) */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16 lg:ml-[7%] lg:mr-auto lg:py-20">
        {/* Eyebrow Pill */}
        <p className="inline-flex items-center rounded-full border border-[#F5C26B]/45 bg-[#1C1814]/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#FAF6F0] backdrop-blur-md shadow-sm">
          YOUR JOURNEY, YOUR FEELING
        </p>

        {/* Primary Headline */}
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-[#FAF6F0] sm:text-5xl md:text-6xl lg:text-[4rem]">
          How do you want to{" "}
          <span className="relative inline-block">
            feel?
            <svg
              aria-hidden="true"
              viewBox="0 0 180 14"
              fill="none"
              className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-[#F5C26B]"
              preserveAspectRatio="none"
            >
              <path
                d="M3 10.5C45 3.5 125 2.5 177 8.5"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#FAF6F0]/90 sm:text-base md:text-lg">
          Every journey begins with a feeling. Tell us yours, and we’ll create an experience around it.
        </p>

        {/* Interactive 5-Card Staggered Grid (3 Top + 2 Bottom Centered on Desktop; Stacked on Mobile) */}
        <div className="mt-8 flex w-full flex-wrap justify-center gap-3.5 sm:gap-4">
          {FEELING_CARDS.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              aria-label={`${card.title} — ${card.desc}`}
              className="group flex w-full basis-full items-center gap-3 rounded-2xl border border-[#F5C26B]/35 bg-[#1C1814]/[0.62] px-3.5 py-3 text-left text-[#FAF6F0] backdrop-blur-md shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5C26B]/80 hover:shadow-[0_14px_30px_rgba(0,0,0,0.36),0_0_20px_rgba(245,194,107,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5C26B] sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.75rem)]"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-18 sm:w-20">
                <JourneyMoodIllustration name={card.artwork} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-serif text-base font-bold leading-tight text-[#FAF6F0] sm:text-lg">
                  {card.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-[#FAF6F0]/80">
                  {card.desc}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F5C26B]/45 bg-[#F5C26B]/15 text-sm font-bold text-[#F5C26B] transition-all duration-300 group-hover:bg-[#F5C26B] group-hover:text-[#1C1814]"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Hero Footer Tagline */}
        <div className="mt-8 w-full max-w-md space-y-1.5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-[#F5C26B]/45" />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#F5C26B]">
              YOUR NEXT CHAPTER STARTS HERE
            </p>
            <span className="h-px flex-1 bg-[#F5C26B]/45" />
          </div>
          <p className="font-serif text-sm italic text-[#FAF6F0]/85 sm:text-base">
            Thoughtfully curated. Entirely yours.
          </p>
        </div>
      </div>
    </section>
  );
}
