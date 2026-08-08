import Image from "next/image";

import type { JourneyOption } from "@/types/journey-passport.types";

type Props = { option: JourneyOption; selected: boolean; onSelect: () => void; compact?: boolean; multi?: boolean; unavailable?: boolean; className?: string };

export function SelectionCard({ option, selected, onSelect, compact = false, multi = false, unavailable = false, className = "" }: Props) {
  const compactImageCard = compact && Boolean(option.imageSrc);

  return <button type="button" role={multi ? "checkbox" : "radio"} aria-checked={selected} aria-disabled={unavailable || undefined} disabled={unavailable} onClick={onSelect} className={`group relative flex min-h-11 min-w-0 flex-col justify-end overflow-hidden rounded-[1.75rem] border text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad762d] motion-reduce:transition-none ${compactImageCard ? "min-h-48 sm:min-h-52" : compact ? "min-h-32 p-6 sm:p-7" : "min-h-56 lg:min-h-60"} ${unavailable ? "cursor-not-allowed border-[#e6ddcf] bg-[#FFFDFC] opacity-55" : selected ? "border-[#c28c42] bg-[#fff9ed] shadow-[0_18px_38px_rgba(111,71,24,0.18)] ring-2 ring-[#e8c890]" : "border-[#e6d5bb] bg-white hover:-translate-y-1 hover:border-[#F5951C] hover:shadow-[0_14px_30px_rgba(80,47,16,0.12)] motion-reduce:hover:translate-y-0"} ${className}`}>
    {option.imageSrc ? <><Image src={option.imageSrc} alt={option.imageAlt ?? ""} fill sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 30vw" className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" /><span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,15,10,0.9),rgba(20,15,10,0.1)_80%)]" /></> : null}
    <span className={`relative block w-full ${option.imageSrc ? "px-7 pb-8 pt-12 sm:px-9 sm:pb-10" : ""}`}><span className={`block font-semibold ${option.imageSrc ? "text-xl leading-[1.18] text-white sm:text-2xl" : "text-[#2A211C]"}`}>{option.label}</span>{option.description ? <span className={`mt-3 block text-sm leading-7 ${option.imageSrc ? "text-white/90" : "text-[#6e5a46]"}`}>{option.description}</span> : null}</span>
    <span aria-hidden="true" className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center border text-sm font-bold ${multi ? "rounded-lg" : "rounded-full"} ${selected ? "border-[#F5951C] bg-[#F5951C] text-[#2A211C]" : option.imageSrc ? "border-white/80 bg-black/15 text-transparent" : "border-[#d6c2a5] bg-white text-transparent"}`}>{selected ? "✓" : "•"}</span>
  </button>;
}
