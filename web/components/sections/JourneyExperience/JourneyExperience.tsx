"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./JourneyExperience.module.css";

type JourneyExperienceProps = {
  isOpen: boolean;
  onClose: () => void;
  emotion?: string;
};

type Selection = {
  title: string;
  caption: string;
  imagePosition: string;
  imageSrc?: string;
};

const companions: Selection[] = [
  { title: "Solo", caption: "Just you, and the world slowing down", imagePosition: "object-[67%_center]", imageSrc: "/images/journey-experience/solo-golden-hour.png" },
  { title: "Couple", caption: "Moments meant only for two", imagePosition: "object-[62%_center]", imageSrc: "/images/journey-experience/couple-golden-hour.png" },
  { title: "Family", caption: "Memories that stay for a lifetime", imagePosition: "object-[72%_center]", imageSrc: "/images/journey-experience/family-golden-hour.png" },
  { title: "Friends", caption: "Stories you’ll talk about forever", imagePosition: "object-[58%_center]", imageSrc: "/images/journey-experience/friends-golden-hour.png" },
];

const timing: Selection[] = [
  { title: "Now", caption: "I need a break. Now.", imagePosition: "object-[68%_center]" },
  { title: "Soon", caption: "Something special is coming up", imagePosition: "object-[60%_center]" },
  { title: "Later", caption: "Planning something meaningful", imagePosition: "object-[64%_center]" },
  { title: "Exploring", caption: "Just seeing what’s possible", imagePosition: "object-[56%_center]" },
];

const experienceTones: Selection[] = [
  { title: "Comfortable", caption: "Thoughtful, relaxed, well-crafted", imagePosition: "object-[59%_center]" },
  { title: "Elevated", caption: "Special moments, curated experiences", imagePosition: "object-[69%_center]" },
  { title: "Luxury", caption: "Indulgent, private, unforgettable", imagePosition: "object-[76%_center]" },
];

const previews = [
  { destination: "Bali", hook: "Sunsets, silence, and slow mornings", imagePosition: "object-[65%_center]" },
  { destination: "Switzerland", hook: "Where every view feels unreal", imagePosition: "object-[53%_center]" },
  { destination: "Maldives", hook: "Nothing between you and the ocean", imagePosition: "object-[74%_center]" },
];

export default function JourneyExperience({ isOpen, onClose, emotion }: JourneyExperienceProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selected, setSelected] = useState({ companion: "", timing: "", tone: "" });

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setDirection("forward");
    setSelected({ companion: "", timing: "", tone: "" });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const advanceAfterSelection = (key: "companion" | "timing" | "tone", value: string) => {
    setSelected((current) => ({ ...current, [key]: value }));
    window.setTimeout(() => {
      setDirection("forward");
      setStep((currentStep) => Math.min(currentStep + 1, 4));
    }, 220);
  };

  const goBack = () => {
    setDirection("back");
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const stepClass = direction === "forward" ? styles.stepForward : styles.stepBack;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#2b1c13]/45 px-3 py-3 backdrop-blur-lg sm:items-center sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-experience-heading"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94svh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/60 bg-[#fffaf3]/95 shadow-[0_28px_100px_rgba(37,24,15,0.32)] backdrop-blur-xl sm:rounded-[2.5rem]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e3a25e,#f7d897,#e3a25e)]" aria-hidden="true" />
        <div className="flex items-center justify-between px-6 pb-2 pt-7 sm:px-10 sm:pt-9">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">Your journey, thoughtfully unfolding</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close journey experience"
            className="rounded-full p-2 text-[#725137] transition hover:bg-[#f3e5d2] hover:text-[#2b1c13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a642e]"
          >
            <span aria-hidden="true" className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="flex gap-2" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((index) => (
              <span key={index} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${index <= step ? "bg-[#c7843d]" : "bg-[#ead8c0]"}`} />
            ))}
          </div>

          <div key={`${step}-${direction}`} className={`${stepClass} pt-8 sm:pt-10`}>
            {step === 1 ? (
              <ChoiceStep
                eyebrow="Step 1 of 4"
                heading="Who’s this journey for?"
                choices={companions}
                selectedValue={selected.companion}
                onSelect={(value) => advanceAfterSelection("companion", value)}
                layout="four"
              />
            ) : null}

            {step === 2 ? (
              <ChoiceStep
                eyebrow="Step 2 of 4"
                heading="When does this journey happen?"
                choices={timing}
                selectedValue={selected.timing}
                onSelect={(value) => advanceAfterSelection("timing", value)}
                layout="four"
              />
            ) : null}

            {step === 3 ? (
              <ChoiceStep
                eyebrow="Step 3 of 4"
                heading="What kind of experience?"
                choices={experienceTones}
                selectedValue={selected.tone}
                onSelect={(value) => advanceAfterSelection("tone", value)}
                layout="three"
              />
            ) : null}

            {step === 4 ? <PreviewStep emotion={emotion} onExplore={onClose} /> : null}
          </div>

          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="mt-7 text-sm font-semibold text-[#725137] transition hover:text-[#2b1c13] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e]"
            >
              ← Back
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ChoiceStepProps = {
  eyebrow: string;
  heading: string;
  choices: Selection[];
  selectedValue: string;
  onSelect: (value: string) => void;
  layout: "three" | "four";
};

function ChoiceStep({ eyebrow, heading, choices, selectedValue, onSelect, layout }: ChoiceStepProps) {
  return (
    <section aria-labelledby="journey-experience-heading">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">{eyebrow}</p>
        <h2 id="journey-experience-heading" className="mt-3 font-serif text-4xl font-normal tracking-[-0.04em] text-[#2b1c13] sm:text-5xl">{heading}</h2>
      </div>

      <div className={`mt-8 grid gap-4 ${layout === "four" ? "sm:grid-cols-2" : "md:grid-cols-3"}`}>
        {choices.map((choice) => {
          const isSelected = selectedValue === choice.title;

          return (
            <button
              key={choice.title}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(choice.title)}
              className={`group relative min-h-48 overflow-hidden rounded-[1.5rem] border text-left shadow-[0_10px_30px_rgba(76,45,20,0.12)] transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e] sm:min-h-56 ${
                isSelected ? "border-[#f2c680] ring-4 ring-[#f2c680]/50" : "border-white/70"
              }`}
            >
              <Image
                src={choice.imageSrc ?? "/images/hero/golden-hour1.png"}
                alt=""
                fill
                sizes={layout === "four" ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 768px) 100vw, 30vw"}
                className={`object-cover ${choice.imagePosition} transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              />
              <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,15,10,0.83)_0%,rgba(26,15,10,0.08)_80%)]" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-6">
                <span className="block font-serif text-3xl font-normal tracking-[-0.03em] text-white">{choice.title}</span>
                <span className="mt-1 block text-sm leading-6 text-white/85">{choice.caption}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PreviewStep({ emotion, onExplore }: { emotion?: string; onExplore: () => void }) {
  return (
    <section aria-labelledby="journey-experience-heading">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">Your first glimpse{emotion ? ` of a ${emotion} journey` : ""}</p>
        <h2 id="journey-experience-heading" className="mt-3 font-serif text-4xl font-normal tracking-[-0.04em] text-[#2b1c13] sm:text-5xl">This could be your story.</h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {previews.map((preview) => (
          <article key={preview.destination} className="group relative min-h-64 overflow-hidden rounded-[1.5rem] shadow-[0_10px_30px_rgba(76,45,20,0.12)]">
            <Image
              src="/images/hero/golden-hour1.png"
              alt={`Golden Hour travel inspiration for ${preview.destination}`}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className={`object-cover ${preview.imagePosition} transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,15,10,0.82)_0%,rgba(26,15,10,0.08)_80%)]" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-serif text-3xl font-normal tracking-[-0.03em] text-white">{preview.destination}</h3>
              <p className="mt-1 text-sm leading-6 text-white/85">{preview.hook}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-9 text-center">
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#9a642e] px-8 text-base font-bold text-white shadow-lg shadow-[#9a642e]/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#7d4f23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Explore Your Journey <span aria-hidden="true" className="ml-2">→</span>
        </button>
      </div>
    </section>
  );
}
