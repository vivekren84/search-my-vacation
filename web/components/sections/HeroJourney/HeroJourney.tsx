"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JourneyMoodIllustration, { type JourneyMoodIllustrationName } from "./JourneyMoodIllustration";

const emotions = [
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
  // DEC-R1.2-007: the Escape mood card is retired from the Homepage Mood
  // Card set — no strong Journey Passport mapping ever existed for it (its
  // Dream Journey "Tropical Escape" mapping had no thematic link to
  // "escape" as a feeling). Tropical Escape itself is untouched and remains
  // independently selectable inside Journey Passport; see the retirement
  // note on `moodPreselections.escape` in `lib/journey-passport/entry-context.ts`.
  {
    key: "memory",
    title: "Memory Makers",
    desc: "Make moments together",
    artwork: "memory",
    // DEC-R1.2-008: "Memory Maker / Family" renamed to "Memory Makers" — now
    // consistent with the separate "Memory Makers" Experience tile on the
    // homepage and /experiences. Routing stays `?mood=memory`, resolving
    // through `moodPreselections.memory` (see entry-context.ts), which
    // pre-selects "Photography" instead of "Culture & Heritage" — see that
    // file for the full rationale.
    href: "/journey-passport?mood=memory",
  },
] as const satisfies ReadonlyArray<{
  key: string;
  title: string;
  desc: string;
  artwork: JourneyMoodIllustrationName;
  href: string;
}>;

export default function HeroJourney() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const selectedEmotion = emotions.find((emotion) => emotion.key === selected);

  return (
    <section className="relative flex min-h-[44rem] w-full items-center justify-center overflow-hidden text-center md:min-h-[48rem]">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center motion-safe:scale-105"
        style={{
          backgroundImage: "url('/images/golden-hour.png')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,13,8,.45),rgba(20,13,8,.22)_42%,rgba(20,13,8,.40))]" />

      {/* Content */}
      {/* EBC — R1.1 Hero CTA Vertical Alignment Polish: this wrapper previously
          had top padding (pt-20) only, with nothing balancing the bottom. The
          section centres this whole block vertically, so that asymmetry read
          as the CTA (the block's last child) sitting flush against the Hero's
          bottom edge — "resting on the section boundary" rather than reading
          as part of the composition, on any viewport tall enough for the
          content to actually be centred within the Hero's min-height. Adding
          responsive bottom padding gives the CTA real breathing room before
          the section ends and, via that same centring, nudges the whole
          composition (and so the CTA) upward — without touching Hero height,
          typography, card sizing, button styling, or section order. Kept
          modest at the smallest breakpoint specifically so mobile — already
          the tallest variant of this section (cards stack to one column) —
          doesn't pick up excess scroll length; sized up at sm/md/lg where
          Desktop and iPad actually showed the issue. */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-20 pb-8 sm:pb-10 md:pb-14 lg:pb-16">

        <p className="inline-flex items-center rounded-md border border-[#D7A84B]/45 bg-[#2F211B]/55 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFF8E8] backdrop-blur-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.22)]">
          Your Journey, Your Feeling
        </p>

        <h1 className="max-w-3xl font-serif text-5xl leading-[.96] tracking-[-.05em] text-white sm:text-6xl md:text-7xl">
          How do you want to feel?
        </h1>

        <p className="max-w-xl text-base leading-7 text-white/80 md:text-lg">
          Tell us your mood. We’ll design the journey.
        </p>

        {/* Emotion Cards */}
        {/* HL-1 (Homepage Layout Rebalance): flex-wrap layout with per-card
            basis widths rather than a 3-column CSS grid. With Escape removed
            there are 5 cards, not a multiple of 3 — a grid would leave the
            final row's 2 cards flush left with an empty gap at the right.
            flex-wrap + justify-center centres that shorter final row
            instead, so the layout reads as intentional at every breakpoint. */}
        <div className="mt-8 flex w-full max-w-[68rem] flex-wrap justify-center gap-4">
          {emotions.map((emotion) => {
            const isActive = selected === emotion.key;

            return (
              <button
                key={emotion.key}
                type="button"
                onClick={() => setSelected(emotion.key)}
                aria-pressed={isActive}
                aria-label={emotion.title}
                // Mood card glass treatment (R1.2-004, colour-graded under
                // R1.2-005 — Luxury Balance Pass): a warm, low-saturation
                // frosted panel with a champagne border accent. Transparency,
                // blur and warm tint are tuned together for legibility
                // against the Golden Hour hero's brightest area (the
                // sun/water reflection behind the Explore card) — keep them
                // as a set; changing one without the others risks losing
                // that legibility. R1.2-005 shifts the glass tint's hue from
                // a neutral charcoal (equal-ish R/G, B slightly dominant —
                // read as faintly cool) to a warm dark champagne/bronze cast
                // (R > G > B) at the same alpha values as before, and layers
                // a very low-opacity warm-ivory radial highlight near the
                // top-left corner to suggest light catching frosted glass —
                // it does not lighten or brighten the panel overall, so the
                // Explore-card legibility fix from R1.2-004 is preserved.
                // Full design rationale for both passes:
                // docs/09-Development/EBCR1.2-004-SOPHIE-VISUAL-TREATMENT-ADDENDUM.md
                // docs/09-Development/EBCR1.2-005-MOOD-CARD-LUXURY-BALANCE-PASS.md
                className={`group grid min-h-36 w-full basis-full grid-cols-[9.5rem_1fr] items-center gap-3 rounded-2xl border px-3 py-3 text-left text-[#FFF8E8] backdrop-blur-2xl backdrop-saturate-[.7] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD58A] motion-reduce:transition-none sm:min-h-40 sm:basis-[calc(50%-0.5rem)] sm:grid-cols-[11rem_1fr] sm:gap-4 sm:px-4 sm:py-4 lg:basis-[calc(33.333%-0.667rem)]
                  ${
                    isActive
                      ? "border-[#E3C48C]/75 bg-[radial-gradient(135%_100%_at_18%_0%,rgba(255,248,232,.13),transparent_55%),linear-gradient(135deg,rgba(42,33,20,.35),rgba(24,18,11,.27))] shadow-[0_0_0_1px_rgba(227,196,140,.26),0_14px_26px_rgba(0,0,0,.26),0_0_18px_rgba(227,196,140,.20),inset_0_1px_0_rgba(255,248,232,.12)] motion-safe:-translate-y-0.5"
                      : "border-[#E3C48C]/24 bg-[radial-gradient(135%_100%_at_18%_0%,rgba(255,248,232,.09),transparent_55%),linear-gradient(135deg,rgba(34,27,17,.27),rgba(20,15,9,.19))] shadow-[0_10px_22px_rgba(0,0,0,.20),inset_0_1px_0_rgba(255,248,232,.07)] hover:border-[#E3C48C]/40 hover:bg-[radial-gradient(135%_100%_at_18%_0%,rgba(255,248,232,.12),transparent_55%),linear-gradient(135deg,rgba(38,30,19,.31),rgba(23,17,10,.22))] hover:shadow-[0_14px_26px_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,248,232,.10)] motion-safe:hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex h-[7.125rem] w-[9.5rem] items-center justify-center transition-transform duration-300 group-hover:scale-[1.015] group-focus-visible:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none sm:h-[7.5rem] sm:w-44">
                  <JourneyMoodIllustration name={emotion.artwork} />
                </div>

                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold leading-tight tracking-[-.02em] text-[#FFF9ED] drop-shadow-[0_1px_2px_rgba(12,7,4,.34)]">{emotion.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#F5E7D0]/85">
                    {emotion.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => selectedEmotion && router.push(selectedEmotion.href)}
          disabled={!selectedEmotion}
          className={`mt-10 rounded-full px-12 py-4 text-base font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed
            ${
              selected
                ? "bg-[#F5951C] text-black hover:scale-105 shadow-xl"
                : "bg-white/20 text-white/60 cursor-not-allowed"
            }
          `}
        >
          {selectedEmotion ? "Start My Journey →" : "Select your mood to begin"}
        </button>

        {selectedEmotion && (
          <p className="text-xs text-white/60 mt-2">
            Takes less than a minute
          </p>
        )}
      </div>

    </section>
  );
}
