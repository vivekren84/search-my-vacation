import Image from "next/image";

import type { JourneyOption } from "@/types/journey-passport.types";

type SelectionCardProps = { option: JourneyOption; selected: boolean; onSelect: () => void; compact?: boolean; multi?: boolean };

export function SelectionCard({ option, selected, onSelect, compact = false, multi = false }: SelectionCardProps) {
  return (
    <button type="button" role={multi ? "checkbox" : "radio"} aria-checked={selected} onClick={onSelect} className={`group relative overflow-hidden rounded-[1.5rem] border text-left transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad762d] ${compact ? "min-h-32 p-5" : "min-h-56"} ${selected ? "border-[#c28c42] bg-[#fff9ed] shadow-[0_18px_38px_rgba(111,71,24,0.18)] ring-2 ring-[#e8c890]" : "border-[#e6d5bb] bg-white hover:-translate-y-1 hover:border-[#cda15b] hover:shadow-[0_14px_30px_rgba(80,47,16,0.12)]"}`}>
      {option.imageSrc ? <><Image src={option.imageSrc} alt="" fill sizes="(max-width: 1024px) 50vw, 26vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" /><span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,15,10,0.86),rgba(20,15,10,0.08)_78%)]" /></> : null}
      <span className={`relative block ${option.imageSrc ? "absolute inset-x-0 bottom-0 p-6" : ""}`}>
        <span className={`block font-semibold ${option.imageSrc ? "text-2xl text-white" : "text-[#2c2117]"}`}>{option.label}</span>
        {option.description ? <span className={`mt-2 block text-sm leading-6 ${option.imageSrc ? "text-white/85" : "text-[#6e5a46]"}`}>{option.description}</span> : null}
      </span>
      <span aria-hidden="true" className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center border text-sm font-bold ${multi ? "rounded-lg" : "rounded-full"} ${selected ? "border-[#a86f29] bg-[#a86f29] text-white" : option.imageSrc ? "border-white/75 bg-white/15 text-white" : "border-[#d6c2a5] bg-white text-transparent"}`}>{selected ? "✓" : "•"}</span>
    </button>
  );
}
