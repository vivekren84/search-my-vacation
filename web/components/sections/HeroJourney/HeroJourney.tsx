"use client";

import Link from "next/link";
import { siteContact } from "@/config/contact.config";
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
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-5 py-8 text-center sm:px-8 sm:py-16 lg:ml-[7%] lg:mr-auto lg:py-20">
        {/* Eyebrow Pill */}
        <p className="inline-flex items-center rounded-full border border-[#F5C26B]/45 bg-[#1C1814]/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#FAF6F0] backdrop-blur-md shadow-sm">
          YOUR JOURNEY, YOUR FEELING
        </p>

        {/* Primary Headline */}
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-[#FAF6F0] sm:mt-5 sm:text-5xl md:text-6xl lg:text-[4rem]">
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
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#FAF6F0]/90 sm:mt-5 sm:text-base md:text-lg">
          Every journey begins with a feeling. Tell us yours, and we’ll create an experience around it.
        </p>

        {/* Mobile Above-the-Fold Conversion CTAs (< 768px) */}
        <div className="mt-5 flex w-full flex-col gap-3 md:hidden">
          <Link
            href="/journey-passport"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#E5A93C] px-6 py-3 text-sm font-bold text-[#181410] shadow-lg transition hover:bg-[#E5A93C]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5C26B]"
          >
            Start planning your journey <span aria-hidden="true" className="ml-2">→</span>
          </Link>
          <a
            href={`${siteContact.whatsappHref}?text=${encodeURIComponent("Hello Search My Vacation, I would like to start planning a thoughtful journey.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Search My Vacation on WhatsApp — opens in a new tab"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white/95 px-6 py-3 text-sm font-bold text-[#181410] shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 fill-[#25D366]">
              <path d="M12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.77.46 3.5 1.34 5.02L2 22l5.09-1.33a9.98 9.98 0 0 0 4.95 1.3h.01c5.53 0 10.02-4.49 10.02-10.02C22.07 6.49 17.57 2 12.04 2Zm5.83 14.23c-.25.7-1.45 1.34-2.01 1.42-.52.08-1.18.11-1.91-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.37-5.16-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41.01.59.01.19 0 .44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.16 1.36 2.46 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.41-.25.69-.15.28.1 1.78.84 2.09.99.3.15.51.23.58.36.08.13.08.76-.17 1.46Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Interactive 5-Card Staggered Grid (3 Top + 2 Bottom Centered on Desktop; Stacked on Mobile) */}
        <div className="mt-6 flex w-full flex-wrap justify-center gap-3 md:mt-8 md:gap-4">
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
