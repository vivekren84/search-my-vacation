"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useJourneyPassport } from "@/hooks/useJourneyPassport";
import { useJourneySession } from "@/context/JourneySessionContext";
import { createJourneyPassportSnapshot } from "@/lib/journey-director/passport-adapter";
import { isJourneyFeeling, type JourneyPassportState } from "@/types/journey-passport.types";

import { JourneyChapterProgress } from "./JourneyChapterProgress";
import { JourneyPassportNavigation } from "./JourneyPassportNavigation";
import { AboutYouMoment, DestinationMoment, DiscoverMoment, SingleChoiceMoment, TimingMoment, TravelStyleMoment, WelcomeMoment } from "./JourneyPassportMoments";

export default function JourneyPassport() {
  const params = useSearchParams();
  const router = useRouter();
  const { savePassport } = useJourneySession();
  const feelingParam = params.get("feeling");
  const homepageFeeling = isJourneyFeeling(feelingParam) ? feelingParam : undefined;
  const passport = useJourneyPassport({ feeling: homepageFeeling, source: homepageFeeling ? "homepage" : "direct" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => { if (passport.moment.id !== "welcome") headingRef.current?.focus(); }, [passport.moment.id]);
  useEffect(() => {
    if (!showExit) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setShowExit(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showExit]);

  const update = (value: Partial<Pick<JourneyPassportState, "name" | "companion" | "dreamJourney" | "timing" | "startDate" | "endDate" | "destination">>) => passport.dispatch({ type: "update", value });
  const complete = () => {
    if (!passport.isValid || passport.state.completion === "completing") return;
    passport.dispatch({ type: "set-completion", value: "completing" });
    savePassport(createJourneyPassportSnapshot(passport.state));
    passport.clearDraft();
    router.push("/journey-director");
  };
  const next = () => passport.moment.id === "discover" ? complete() : passport.next();

  return <main className="min-h-screen overflow-x-hidden bg-[#fbf7ef] text-[#2d2117]">
    <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-10">
      <Link href="/" aria-label="Search My Vacation home" className="inline-flex min-h-11 items-center gap-3 rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a86f29]"><Image src="/logos/smv-logo.png" alt="" width={66} height={60} className="h-12 w-auto object-contain" priority /><span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-[#765535] sm:block">Search My Vacation</span></Link>
      <p className="hidden text-sm font-medium text-[#775f48] md:block">More Than a Trip. It’s an Experience.</p>
      <button type="button" onClick={() => passport.state.currentMoment === "welcome" ? window.location.assign("/") : setShowExit(true)} className="inline-flex min-h-11 items-center rounded-full border border-[#ddc8aa] bg-white/70 px-4 py-2 text-sm font-semibold text-[#61452d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a86f29]">Back to home</button>
    </header>
    <section className="relative mx-auto max-w-[1440px] px-5 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-10 lg:pb-20">
      <div className="absolute inset-x-0 top-[-6rem] -z-10 h-[38rem] bg-[radial-gradient(circle_at_18%_18%,rgba(244,211,153,.55),transparent_38%),radial-gradient(circle_at_85%_4%,rgba(240,183,102,.28),transparent_32%)]" aria-hidden="true" />
      {passport.moment.id !== "welcome" ? <JourneyChapterProgress currentIndex={passport.currentIndex} completed={passport.completedMoments} onGoTo={passport.goTo} /> : null}
      <div key={passport.moment.id} className={`journey-passport-enter mx-auto ${passport.moment.id === "welcome" ? "max-w-6xl" : "max-w-7xl"}`}>
        {passport.moment.id === "welcome" ? <div><WelcomeMoment onBegin={passport.next} />{passport.resumeDraft ? <div role="dialog" aria-labelledby="resume-title" className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#dfcaa9] bg-white p-5 text-center shadow-md"><h2 id="resume-title" className="text-lg font-semibold text-[#392719]">Continue where you left off?</h2><p className="mt-2 text-sm text-[#705c47]">A temporary Journey Passport from this browser session is available.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={passport.resume} className="min-h-11 rounded-full bg-[#a86f29] px-5 py-2 text-sm font-bold text-white">Continue where I left off</button><button type="button" onClick={passport.startAgain} className="min-h-11 rounded-full border border-[#d8c4a7] px-5 py-2 text-sm font-semibold text-[#61452d]">Start again</button></div></div> : null}</div> : null}
        {passport.moment.id === "about-you" ? <AboutYouMoment headingRef={headingRef} moment={passport.moment} name={passport.state.name} onChange={(name) => update({ name })} /> : null}
        {passport.moment.id === "companions" ? <SingleChoiceMoment headingRef={headingRef} moment={passport.moment} value={passport.state.companion} onChange={(companion) => update({ companion })} /> : null}
        {passport.moment.id === "dream-journey" ? <SingleChoiceMoment headingRef={headingRef} moment={passport.moment} value={passport.state.dreamJourney} onChange={(dreamJourney) => update({ dreamJourney })} /> : null}
        {passport.moment.id === "travel-style" ? <TravelStyleMoment headingRef={headingRef} moment={passport.moment} values={passport.state.travelStyles} onToggle={(value) => passport.dispatch({ type: "toggle-style", value })} /> : null}
        {passport.moment.id === "timing" ? <TimingMoment headingRef={headingRef} moment={passport.moment} state={passport.state} onUpdate={update} /> : null}
        {passport.moment.id === "destination" ? <DestinationMoment headingRef={headingRef} moment={passport.moment} state={passport.state} onMode={(value) => passport.dispatch({ type: "set-destination-mode", value })} onDestination={(destination) => update({ destination })} /> : null}
        {passport.moment.id === "discover" ? <DiscoverMoment headingRef={headingRef} moment={passport.moment} state={passport.state} /> : null}
      </div>
      {passport.moment.id !== "welcome" ? <JourneyPassportNavigation showBack onBack={passport.previous} onNext={next} disabled={!passport.isValid || passport.state.completion === "completing"} label={passport.moment.nextLabel} /> : null}
      <p className="sr-only" aria-live="polite">{passport.moment.id === "travel-style" ? `${passport.state.travelStyles.length} of 3 travel styles selected.` : ""}</p>
    </section>
    {showExit ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="exit-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="exit-title" className="text-xl font-semibold text-[#392719]">Leave your Journey Passport?</h2><p className="mt-3 text-sm leading-6 text-[#705c47]">Your temporary progress will remain available in this browser session.</p><div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" autoFocus onClick={() => setShowExit(false)} className="min-h-11 rounded-full border border-[#d8c4a7] px-5 py-2 text-sm font-semibold text-[#61452d]">Keep exploring</button><Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[#a86f29] px-5 py-2 text-sm font-bold text-white">Leave Passport</Link></div></div></div> : null}
  </main>;
}
