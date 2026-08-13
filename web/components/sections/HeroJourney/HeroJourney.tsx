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
  {
    key: "escape",
    title: "Escape",
    desc: "Get away & recharge",
    artwork: "escape",
    href: "/journey-passport?mood=escape",
  },
  {
    key: "memory",
    title: "Memory Maker / Family",
    desc: "Make moments together",
    artwork: "memory",
    // EBC-036 (D-08): previously routed through `?experience=Memory%20Makers`,
    // which resolves via `experiencePreselections` — a mapping built for the
    // separate "Begin with what matters" homepage tiles, not Journey Mood.
    // That accidental reuse produced "Photography" as the Pace & Timing
    // pre-selection. Memory Maker now uses the same `?mood=` routing as every
    // other mood card, resolving through `moodPreselections.memory` instead.
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
        <div className="mt-8 grid w-full max-w-[68rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emotions.map((emotion) => {
            const isActive = selected === emotion.key;

            return (
              <button
                key={emotion.key}
                type="button"
                onClick={() => setSelected(emotion.key)}
                aria-pressed={isActive}
                aria-label={emotion.title}
                className={`group grid min-h-36 w-full grid-cols-[9.5rem_1fr] items-center gap-3 rounded-2xl border px-3 py-3 text-left text-[#FFF8E8] backdrop-blur-[4px] backdrop-saturate-75 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD58A] motion-reduce:transition-none sm:min-h-40 sm:grid-cols-[11rem_1fr] sm:gap-4 sm:px-4 sm:py-4
                  ${
                    isActive
                      ? "border-[#F2B84B]/74 bg-[linear-gradient(135deg,rgba(111,73,40,.17),rgba(39,29,24,.16))] shadow-[0_0_0_1px_rgba(255,219,150,.10),0_14px_30px_rgba(12,7,4,.20),0_0_20px_rgba(242,184,75,.14),inset_0_1px_0_rgba(255,248,232,.12)] motion-safe:-translate-y-0.5"
                      : "border-[#F7E5C4]/25 bg-[linear-gradient(135deg,rgba(75,57,47,.14),rgba(31,25,22,.13))] shadow-[0_10px_24px_rgba(10,6,4,.15),inset_0_1px_0_rgba(255,248,232,.09)] hover:border-[#F0D09A]/44 hover:bg-[linear-gradient(135deg,rgba(91,65,50,.17),rgba(37,28,24,.15))] hover:shadow-[0_14px_30px_rgba(10,6,4,.18),0_0_16px_rgba(239,184,93,.07),inset_0_1px_0_rgba(255,248,232,.11)] motion-safe:hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex h-[7.125rem] w-[9.5rem] items-center justify-center transition-transform duration-300 group-hover:scale-[1.015] group-focus-visible:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none sm:h-[7.5rem] sm:w-44">
                  <JourneyMoodIllustration name={emotion.artwork} />
                </div>

                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold leading-tight tracking-[-.02em] text-[#FFF9ED] drop-shadow-[0_1px_2px_rgba(12,7,4,.28)]">{emotion.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#F5E7D0]/82">
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
