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
    href: "/journey-passport?experience=Memory%20Makers",
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
      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-6 px-6 pt-20">

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
                className={`group grid min-h-32 w-full grid-cols-[10rem_1fr] items-center gap-4 rounded-2xl border px-4 py-4 text-left text-[#280336] backdrop-blur-md transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none
                  ${
                    isActive
                      ? "border-[#F5951C]/80 bg-[#FFFDFC] shadow-[0_16px_34px_rgba(31,14,37,.22)] ring-1 ring-[#F5951C]/35 motion-safe:-translate-y-0.5"
                      : "border-white/45 bg-[#FFFDFC]/90 shadow-[0_10px_28px_rgba(31,14,37,.15)] hover:border-[#F5951C]/60 hover:bg-[#FFFDFC] hover:shadow-[0_16px_34px_rgba(31,14,37,.22)] motion-safe:hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex h-24 w-40 items-center justify-center transition-transform duration-300 group-hover:scale-[1.015] group-focus-visible:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none">
                  <JourneyMoodIllustration name={emotion.artwork} />
                </div>

                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold leading-tight tracking-[-.02em]">{emotion.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#2A211C]/72">
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
