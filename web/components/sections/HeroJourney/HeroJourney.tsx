"use client";

import { useState } from "react";
import JourneyExperienceV2 from "@/components/sections/JourneyExperienceV2";

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
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  // ✅ FIX: Reset everything when passport closes
  const handleClosePassport = () => {
    setIsPassportOpen(false);
    setSelected(null); // <-- THIS is the key fix
  };

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center text-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/golden-hour.png')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 flex flex-col items-center gap-6">

        <p className="text-xs tracking-[0.3em] text-white/70 uppercase">
          Your Journey, Your Feeling
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
          How do you want to feel?
        </h1>

        <p className="text-white/80 text-base md:text-lg">
          Tell us your mood. We’ll design the journey.
        </p>

        {/* Emotion Cards */}
        <div className="flex flex-wrap justify-center gap-5 mt-8">
          {emotions.map((emotion) => {
            const isActive = selected === emotion.key;

            return (
              <button
                key={emotion.key}
                onClick={() => setSelected(emotion.key)}
                className={`flex items-center gap-4 text-left px-6 py-5 rounded-2xl backdrop-blur-md border transition-all duration-300 min-w-[220px]
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
          onClick={() => selected && setIsPassportOpen(true)}
          className={`mt-10 px-12 py-4 rounded-full text-base font-semibold transition-all duration-300
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

      <JourneyExperienceV2
        isOpen={isPassportOpen}
        onClose={handleClosePassport}
        emotion={selected ?? undefined}
      />
    </section>
  );
}
