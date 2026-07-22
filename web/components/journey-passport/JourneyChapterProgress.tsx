import { journeyMoments } from "@/config/journey-passport.config";
import type { JourneyMomentId } from "@/types/journey-passport.types";

type Props = { currentIndex: number; completed: JourneyMomentId[]; onGoTo: (id: JourneyMomentId) => void };

export function JourneyChapterProgress({ currentIndex, completed, onGoTo }: Props) {
  const visibleMoments = journeyMoments.slice(1);
  return <nav aria-label="Your Journey Chapters" className="overflow-x-auto pb-2"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#80633f]">Your Journey Chapters</p><ol className="flex min-w-max gap-2">{visibleMoments.map((moment) => { const index = journeyMoments.findIndex((candidate) => candidate.id === moment.id); const current = currentIndex === index; const done = completed.includes(moment.id); return <li key={moment.id}><button type="button" disabled={!done && !current} onClick={() => onGoTo(moment.id)} aria-current={current ? "step" : undefined} className={`min-h-11 rounded-full border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f29] disabled:cursor-default ${current ? "border-[#a86f29] bg-[#a86f29] text-white" : done ? "border-[#d8b270] bg-[#fff7e7] text-[#6d471c]" : "border-[#e7dbc8] bg-white text-[#8b7965]"}`}><span className="mr-1.5" aria-hidden="true">{done ? "✓" : moment.number - 1}</span>{moment.navigationLabel}</button></li>; })}</ol></nav>;
}
