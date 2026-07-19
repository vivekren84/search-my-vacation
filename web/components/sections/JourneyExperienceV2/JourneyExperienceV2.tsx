"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./JourneyExperienceV2.module.css";

type JourneyExperienceV2Props = {
  isOpen: boolean;
  onClose: () => void;
  emotion?: string;
};

type SceneOption = {
  title: string;
  caption: string;
  imageSrc: string;
  imagePosition?: string;
};

const companions: SceneOption[] = [
  { title: "Solo", caption: "Just you, and the world slowing down", imageSrc: "/images/journey-experience/solo-golden-hour.png" },
  { title: "Couple", caption: "Moments meant only for two", imageSrc: "/images/journey-experience/couple-golden-hour.png" },
  { title: "Family", caption: "Memories that stay for a lifetime", imageSrc: "/images/journey-experience/family-golden-hour.png" },
  { title: "Friends", caption: "Stories you’ll talk about forever", imageSrc: "/images/journey-experience/friends-golden-hour.png" },
];

const timing: SceneOption[] = [
  { title: "Now", caption: "I need a break. Now.", imageSrc: "/images/journey-experience/now.png" },
  { title: "Soon", caption: "Something special is coming up", imageSrc: "/images/journey-experience/soon.png" },
  { title: "Later", caption: "Planning something meaningful", imageSrc: "/images/journey-experience/later.png" },
  { title: "Exploring", caption: "Just seeing what's possible", imageSrc: "/images/journey-experience/exploring.png" },
];

const stylesOfTravel: SceneOption[] = [
  { title: "Comfortable", caption: "Thoughtful, relaxed, well-crafted", imageSrc: "/images/journey-experience/comfortable.png" },
  { title: "Elevated", caption: "Special moments, curated experiences", imageSrc: "/images/journey-experience/elevated.png" },
  { title: "Luxury", caption: "Indulgent, private, unforgettable", imageSrc: "/images/journey-experience/luxury.png" },
];

const destinations: SceneOption[] = [
  { title: "Bali", caption: "Sunsets, silence, and slow mornings", imageSrc: "/images/journey-experience/bali-preview.png" },
  { title: "Switzerland", caption: "Where every view feels unreal", imageSrc: "/images/journey-experience/switzerland-preview.png" },
  { title: "Maldives", caption: "Nothing between you and the ocean", imageSrc: "/images/journey-experience/maldives-preview.png" },
];

export default function JourneyExperienceV2({ isOpen, onClose, emotion }: JourneyExperienceV2Props) {
  const [scene, setScene] = useState(1);
  const [selections, setSelections] = useState({ companion: "", timing: "", style: "" });
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setScene(1);
    setSelections({ companion: "", timing: "", style: "" });
    setPreviewIndex(0);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedValue = scene === 1 ? selections.companion : scene === 2 ? selections.timing : selections.style;
  const setSelectedValue = (value: string) => {
    if (scene === 1) setSelections((current) => ({ ...current, companion: value }));
    if (scene === 2) setSelections((current) => ({ ...current, timing: value }));
    if (scene === 3) setSelections((current) => ({ ...current, style: value }));
  };

  const nextScene = () => setScene((current) => Math.min(current + 1, 4));
  const previousScene = () => setScene((current) => Math.max(current - 1, 1));
  const activeDestination = destinations[previewIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#2a1a10]/45 p-3 backdrop-blur-xl sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-experience-v2-heading"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94svh] w-full max-w-7xl overflow-y-auto rounded-[2rem] border border-white/60 bg-[#fffaf3]/95 shadow-[0_32px_120px_rgba(35,20,10,0.35)] backdrop-blur-2xl sm:rounded-[2.75rem]">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">A journey shaped around you{emotion ? ` · ${emotion}` : ""}</p>
          <button type="button" onClick={onClose} aria-label="Close journey experience" className="rounded-full p-2 text-[#725137] transition hover:bg-[#f4e3ce] hover:text-[#2b1c13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a642e]">
            <span aria-hidden="true" className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="flex gap-2" aria-label={`Scene ${scene} of 4`}>
            {[1, 2, 3, 4].map((index) => <span key={index} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${index <= scene ? "bg-[#c7843d]" : "bg-[#ead8c0]"}`} />)}
          </div>

          <div key={scene} className={`${styles.scene} pt-8 sm:pt-10`}>
            {scene === 1 ? <ChoiceScene title="Who’s joining you?" options={companions} selected={selectedValue} onSelect={setSelectedValue} /> : null}
            {scene === 2 ? <ChoiceScene title="When does this happen?" options={timing} selected={selectedValue} onSelect={setSelectedValue} /> : null}
            {scene === 3 ? <ChoiceScene title="What kind of experience feels right?" options={stylesOfTravel} selected={selectedValue} onSelect={setSelectedValue} compact /> : null}
            {scene === 4 ? <DestinationScene destination={activeDestination} index={previewIndex} onPrevious={() => setPreviewIndex((current) => (current + destinations.length - 1) % destinations.length)} onNext={() => setPreviewIndex((current) => (current + 1) % destinations.length)} onExplore={onClose} /> : null}
          </div>

          <div className="mt-8 flex items-center justify-between gap-5">
            <button type="button" onClick={scene === 1 ? onClose : previousScene} className="text-sm font-semibold text-[#725137] transition hover:text-[#2b1c13] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e]">
              ← {scene === 1 ? "Back to journey" : "Back"}
            </button>
            {scene < 4 ? (
              <button type="button" disabled={!selectedValue} onClick={nextScene} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#9a642e] px-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4f23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e] disabled:cursor-not-allowed disabled:bg-[#cbb9a7] disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                Continue <span aria-hidden="true" className="ml-2">→</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceScene({ title, options, selected, onSelect, compact = false }: { title: string; options: SceneOption[]; selected: string; onSelect: (value: string) => void; compact?: boolean }) {
  return (
    <section aria-labelledby="journey-experience-v2-heading">
      <h2 id="journey-experience-v2-heading" className="mx-auto max-w-3xl text-center font-serif text-4xl font-normal tracking-[-0.04em] text-[#2b1c13] sm:text-5xl">{title}</h2>
      <div className={`mt-8 grid gap-5 ${compact ? "lg:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((option) => {
          const isSelected = selected === option.title;
          const hasSelection = Boolean(selected);

          return (
            <button key={option.title} type="button" aria-pressed={isSelected} onClick={() => onSelect(option.title)} className={`group relative min-h-64 overflow-hidden rounded-[1.75rem] border text-left shadow-[0_14px_40px_rgba(76,45,20,0.16)] transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e] sm:min-h-72 ${isSelected ? "-translate-y-1 border-[#f2c680] ring-4 ring-[#f2c680]/45" : "border-white/70"} ${hasSelection && !isSelected ? "opacity-55" : "opacity-100"}`}>
              <Image src={option.imageSrc} alt="" fill sizes={compact ? "(max-width: 1024px) 100vw, 30vw" : "(max-width: 640px) 100vw, 46vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(25,14,9,0.86)_0%,rgba(25,14,9,0.12)_78%)]" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 block p-6 sm:p-7">
                <span className="block font-serif text-4xl font-normal tracking-[-0.035em] text-white">{option.title}</span>
                <span className="mt-2 block max-w-md text-sm leading-6 text-white/85 sm:text-base">{option.caption}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DestinationScene({ destination, index, onPrevious, onNext, onExplore }: { destination: SceneOption; index: number; onPrevious: () => void; onNext: () => void; onExplore: () => void }) {
  return (
    <section aria-labelledby="journey-experience-v2-heading">
      <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#2b1c13] shadow-[0_20px_55px_rgba(76,45,20,0.22)] sm:min-h-[34rem]">
        <Image src={destination.imageSrc} alt={`Travel inspiration for ${destination.title}`} fill priority sizes="(max-width: 1280px) 100vw, 72rem" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,14,9,0.8)_0%,rgba(23,14,9,0.28)_55%,rgba(23,14,9,0.05)_100%),linear-gradient(0deg,rgba(23,14,9,0.72)_0%,transparent_55%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f3c681]">Destination preview · {index + 1} of {destinations.length}</p>
          <h2 id="journey-experience-v2-heading" className="mt-3 font-serif text-5xl font-normal tracking-[-0.045em] text-white sm:text-6xl">{destination.title}</h2>
          <p className="mt-3 text-lg text-white/90 sm:text-xl">{destination.caption}</p>
          <p className="mt-8 text-sm font-medium text-white/75">This is just the beginning…</p>
          <button type="button" onClick={onExplore} className="mt-4 inline-flex min-h-14 items-center justify-center rounded-full bg-[#f3c681] px-8 text-base font-bold text-[#25180f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffe1ab] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c681] motion-reduce:transition-none motion-reduce:hover:translate-y-0">Explore Your Journey <span aria-hidden="true" className="ml-2">→</span></button>
        </div>
        <div className="absolute right-5 top-5 flex gap-2 sm:right-7 sm:top-7">
          <button type="button" onClick={onPrevious} aria-label="Show previous destination" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[#2b1c13]/35 text-xl text-white backdrop-blur-md transition hover:bg-[#2b1c13]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">←</button>
          <button type="button" onClick={onNext} aria-label="Show next destination" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[#2b1c13]/35 text-xl text-white backdrop-blur-md transition hover:bg-[#2b1c13]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">→</button>
        </div>
      </div>
    </section>
  );
}
