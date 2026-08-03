"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const emotions = [
  {
    key: "relax",
    title: "Relax",
    desc: "Slow down & unwind",
    emoji: "🌿",
  },
  {
    key: "explore",
    title: "Explore",
    desc: "Discover & adventure",
    emoji: "🗺️",
  },
  {
    key: "celebrate",
    title: "Celebrate",
    desc: "Make it unforgettable",
    emoji: "🎉",
  },
  {
    key: "romance",
    title: "Romance",
    desc: "Moments that connect",
    emoji: "💑",
  },
  {
    key: "escape",
    title: "Escape",
    desc: "Get away & recharge",
    emoji: "🧘",
  },
];

export default function HeroJourney() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,13,8,.45),rgba(20,13,8,.22)_42%,rgba(20,13,8,.82))]" />

      {/* Content */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-6 px-6 pt-20">

        <p className="text-xs tracking-[0.3em] text-white/70 uppercase">
          Your Journey, Your Feeling
        </p>

        <h1 className="max-w-3xl font-serif text-5xl leading-[.96] tracking-[-.05em] text-white sm:text-6xl md:text-7xl">
          How do you want to feel?
        </h1>

        <p className="max-w-xl text-base leading-7 text-white/80 md:text-lg">
          Tell us your mood. We’ll design the journey.
        </p>

        {/* Emotion Cards */}
        <div className="flex flex-wrap justify-center gap-5 mt-8">
          {emotions.map((emotion) => {
            const isActive = selected === emotion.key;

            return (
              <button
                key={emotion.key}
                type="button"
                onClick={() => setSelected(emotion.key)}
                aria-pressed={isActive}
                className={`flex min-w-[220px] items-center gap-4 rounded-2xl border px-6 py-5 text-left backdrop-blur-md transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white
                  ${
                    isActive
                      ? "bg-white text-black border-white scale-105 shadow-2xl"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-lg"
                  }
                `}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-xl shrink-0">
                  <span className="leading-none">{emotion.emoji}</span>
                </div>

                <div>
                  <p className="font-semibold text-base">{emotion.title}</p>
                  <p className="text-sm opacity-70 mt-0.5">
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
          onClick={() => selected && router.push(`/journey-passport?feeling=${encodeURIComponent(selected)}`)}
          disabled={!selected}
          className={`mt-10 rounded-full px-12 py-4 text-base font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed
            ${
              selected
                ? "bg-[#E6B980] text-black hover:scale-105 shadow-xl"
                : "bg-white/20 text-white/60 cursor-not-allowed"
            }
          `}
        >
          {selected ? "Start My Journey →" : "Select your mood to begin"}
        </button>

        {selected && (
          <p className="text-xs text-white/60 mt-2">
            Takes less than a minute
          </p>
        )}
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#f8f5f0]" />

    </section>
  );
}
