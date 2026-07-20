import { journeyChapters } from "@/config/journey-passport.config";

type JourneyChapterProgressProps = { currentIndex: number; completed: number[]; onGoTo: (index: number) => void };

export function JourneyChapterProgress({ currentIndex, completed, onGoTo }: JourneyChapterProgressProps) {
  return <nav aria-label="Your Journey Chapters" className="overflow-x-auto pb-2"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#80633f]">Your Journey Chapters</p><ol className="flex min-w-max gap-2">{journeyChapters.map((chapter, index) => { const current = currentIndex === index; const done = completed.includes(index); const available = index <= currentIndex || completed.includes(index - 1); return <li key={chapter.id}><button type="button" disabled={!available} onClick={() => onGoTo(index)} aria-current={current ? "step" : undefined} className={`rounded-full border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f29] disabled:cursor-default ${current ? "border-[#a86f29] bg-[#a86f29] text-white" : done ? "border-[#d8b270] bg-[#fff7e7] text-[#6d471c]" : "border-[#e7dbc8] bg-white text-[#a59078]"}`}><span className="mr-1.5" aria-hidden="true">{done ? "✓" : chapter.number}</span>{chapter.navigationLabel}</button></li>; })}</ol></nav>;
}
