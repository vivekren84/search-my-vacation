import { journeyMoments, journeyProgressForMoment } from "@/config/journey-passport.config";
import type { JourneyMomentId } from "@/types/journey-passport.types";

type Props = { currentIndex: number; completed: JourneyMomentId[]; onGoTo: (id: JourneyMomentId) => void };

export function JourneyChapterProgress({ currentIndex, completed, onGoTo }: Props) {
  const visibleMoments = journeyMoments.slice(1);
  const currentMoment = journeyMoments[currentIndex];
  const progress = journeyProgressForMoment(currentMoment.id);
  return <nav aria-label="Your Passport Journey" className="pt-5 sm:pt-7">
    <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80633f]">Your Passport Journey</p><p className="text-sm font-bold tabular-nums text-[#6d471c]">{progress}% complete</p></div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfce]" role="progressbar" aria-label="Journey Passport completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="block h-full rounded-full bg-[linear-gradient(90deg,#F5951C,#c9791a)] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
    <ol className="mt-3 grid grid-cols-6 gap-1.5">{visibleMoments.map((moment) => { const index = journeyMoments.findIndex((candidate) => candidate.id === moment.id); const current = currentIndex === index; const done = completed.includes(moment.id); return <li key={moment.id} className="min-w-0"><button type="button" disabled={!done && !current} onClick={() => onGoTo(moment.id)} aria-current={current ? "step" : undefined} aria-label={`${moment.navigationLabel}${done ? ", completed" : current ? ", current step" : ", upcoming"}`} className={`group flex min-h-11 w-full flex-col items-center justify-start gap-1 rounded-xl px-0.5 py-1 text-[0.58rem] font-semibold leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2A211C] disabled:cursor-default sm:text-[0.68rem] ${current ? "text-[#6d471c]" : done ? "text-[#73512b]" : "text-[#958473]"}`}><span aria-hidden="true" className={`grid size-7 place-items-center rounded-full border-2 text-xs ${current ? "border-[#F5951C] bg-[#F5951C] text-[#2A211C] shadow-[0_0_0_3px_#FFFDFC]" : done ? "border-[#b97c30] bg-[#FFFDFC] text-[#7a4d1c]" : "border-[#ddd0bd] bg-[#FFFDFC] text-[#8b7965]"}`}>{done ? "✓" : moment.number - 1}</span><span className="hidden max-w-full truncate sm:block">{moment.navigationLabel}</span></button></li>; })}</ol>
  </nav>;
}
