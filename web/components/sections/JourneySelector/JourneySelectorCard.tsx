"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const emotions = [
  { label: "Relax", icon: "🌿" },
  { label: "Explore", icon: "🗺️" },
  { label: "Celebrate", icon: "🎉" },
  { label: "Romance", icon: "💑" },
  { label: "Escape", icon: "🧘" },
];

export default function JourneySelectorCard() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const router = useRouter();

  const beginJourney = () => {
    if (selectedEmotion) {
      router.push(`/journey?feeling=${selectedEmotion.toLowerCase()}`);
    }
  };

  return (
    <section
      id="journey-selector"
      aria-labelledby="journey-selector-heading"
      className="relative z-20 -mt-20 bg-[linear-gradient(180deg,#f6d398_0%,#fff5e4_45%,#ffffff_100%)] px-5 pb-24 pt-20 sm:-mt-24 sm:px-6 sm:pb-28 sm:pt-24"
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/75 bg-white/75 p-7 text-center shadow-[0_20px_70px_rgba(100,61,24,0.16)] backdrop-blur-md sm:p-10 lg:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">
          Your journey, your feeling
        </p>
        <h2 id="journey-selector-heading" className="mt-3 font-serif text-4xl font-normal tracking-[-0.035em] text-[#2b1c13] sm:text-5xl">
          How do you want to feel?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#684d3a] sm:text-lg">
          Tell us your mood. We&apos;ll design the journey.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3" aria-label="Choose a travel feeling">
          {emotions.map((emotion) => {
            const isSelected = selectedEmotion === emotion.label;

            return (
              <button
                key={emotion.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedEmotion(emotion.label)}
                className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a642e] motion-reduce:transition-none ${
                  isSelected
                    ? "border-[#9a642e] bg-[#9a642e] text-white shadow-md shadow-[#9a642e]/25"
                    : "border-[#dcbf9e] bg-white/80 text-[#4a3020] hover:-translate-y-0.5 hover:border-[#9a642e] hover:bg-[#fff8ed]"
                }`}
              >
                <span aria-hidden="true">{emotion.icon}</span>
                {emotion.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selectedEmotion}
          onClick={beginJourney}
          className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-[#9a642e] px-8 text-base font-bold text-white shadow-md shadow-[#9a642e]/25 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#7d4f23] hover:shadow-lg hover:shadow-[#9a642e]/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e] disabled:cursor-not-allowed disabled:bg-[#cbb9a7] disabled:shadow-none disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Start My Journey <span aria-hidden="true" className="ml-2">→</span>
        </button>
      </div>
    </section>
  );
}
