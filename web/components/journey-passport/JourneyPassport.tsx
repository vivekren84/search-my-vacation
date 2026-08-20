"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import SiteBrand from "@/components/brand/SiteBrand";
import PublicFooter from "@/components/layout/PublicFooter";
import { resolvePublicDestinationPassportContext } from "@/config/public-destinations.config";
import { useJourneyPassport } from "@/hooks/useJourneyPassport";
import { useJourneySession } from "@/context/JourneySessionContext";
import { JOURNEY_LEAD_FAILURE_MESSAGE, recordJourneyPassportEvent, submitJourneyPassportLead } from "@/lib/journey-leads/client";
import { createJourneyPassportSnapshot } from "@/lib/journey-director/passport-adapter";
import { createJourneyReference } from "@/lib/journey-director/journey-synopsis";
import { isJourneyEntryPreselectionActive, resolveJourneyEntryPreselection } from "@/lib/journey-passport/entry-context";
import { isJourneyEntryExperience, isJourneyEntryInspiration, isJourneyFeeling, type JourneyPassportEntryContext, type JourneyPassportState } from "@/types/journey-passport.types";

import { JourneyChapterProgress } from "./JourneyChapterProgress";
import { JourneyPassportNavigation } from "./JourneyPassportNavigation";
import { AboutYouMoment, DestinationMoment, DiscoverMoment, PaceAndTimingMoment, SingleChoiceMoment, WelcomeMoment } from "./JourneyPassportMoments";
import { PassportStamp } from "./PassportStamp";

export default function JourneyPassport() {
  const params = useSearchParams();
  const router = useRouter();
  const { savePassport } = useJourneySession();
  const experienceParam = params.get("experience");
  const moodParam = params.get("mood") ?? params.get("feeling");
  const inspirationParam = params.get("inspiration");
  const destinationParam = params.get("destination");
  const entryContext = useMemo<JourneyPassportEntryContext>(() => {
    if (isJourneyEntryExperience(experienceParam)) return { experience: experienceParam, source: "experience" };
    const destinationContext = resolvePublicDestinationPassportContext(destinationParam);
    if (destinationContext) return destinationContext;
    if (isJourneyEntryInspiration(inspirationParam)) return { inspiration: inspirationParam, source: "inspiration" };
    if (isJourneyFeeling(moodParam)) return { feeling: moodParam, source: "mood" };
    return { source: "direct" };
  }, [destinationParam, experienceParam, inspirationParam, moodParam]);
  const passport = useJourneyPassport(entryContext);
  const entryPreselection = resolveJourneyEntryPreselection(passport.state.entryContext);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const acknowledgementRef = useRef<HTMLHeadingElement>(null);
  const issuedReferenceRef = useRef("");
  const [showExit, setShowExit] = useState(false);
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [closureStage, setClosureStage] = useState<"closing" | "stamping" | "contact" | "departing">("closing");
  const [passportId, setPassportId] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSubmission, setContactSubmission] = useState<"idle" | "submitting" | "success">("idle");

  useEffect(() => { if (passport.moment.id !== "welcome") headingRef.current?.focus(); }, [passport.moment.id]);
  useEffect(() => {
    if (!showAcknowledgement) return;
    router.prefetch("/journey-director");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => setClosureStage("contact"), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    const stampTimer = window.setTimeout(() => setClosureStage("stamping"), 720);
    const issuedTimer = window.setTimeout(() => setClosureStage("contact"), 1220);
    return () => {
      window.clearTimeout(stampTimer);
      window.clearTimeout(issuedTimer);
    };
  }, [router, showAcknowledgement]);
  useEffect(() => { if (closureStage === "contact") acknowledgementRef.current?.focus(); }, [closureStage]);
  useEffect(() => {
    if (closureStage !== "departing") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const directorTimer = window.setTimeout(() => router.push("/journey-director"), reducedMotion ? 250 : 550);
    return () => window.clearTimeout(directorTimer);
  }, [closureStage, router]);
  useEffect(() => {
    if (!showExit) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setShowExit(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showExit]);

  const update = (value: Partial<Pick<JourneyPassportState, "name" | "companion" | "dreamJourney" | "timing" | "startDate" | "endDate" | "destination" | "mobile" | "journeyReference">>) => passport.dispatch({ type: "update", value });
  const complete = () => {
    if (!passport.isValid || passport.state.completion === "completing") return;
    const reference = issuedReferenceRef.current || passport.state.journeyReference || createJourneyReference();
    issuedReferenceRef.current = reference;
    passport.dispatch({ type: "set-completion", value: "completing" });
    update({ journeyReference: reference });
    setPassportId(reference);
    passport.dispatch({ type: "set-completion", value: "complete" });
    setClosureStage("closing");
    setShowAcknowledgement(true);
  };
  const continueToDirector = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactSubmission === "submitting") return;
    const digits = passport.state.mobile.replace(/\D/g, "");
    if (passport.state.name.trim().length < 2) { setContactError("Please share the name you would like us to use."); return; }
    if (digits.length !== 10 || digits === "0000000000") { setContactError("Please enter a valid 10-digit mobile number."); return; }
    const completedState = { ...passport.state, name: passport.state.name.trim(), mobile: passport.state.mobile.trim(), journeyReference: passportId };
    const snapshot = createJourneyPassportSnapshot(completedState);
    setContactError("");
    setContactSubmission("submitting");
    try {
      await submitJourneyPassportLead({
        passportReference: passportId,
        guestName: completedState.name,
        mobileNumber: completedState.mobile,
        passportSummary: {
          ...snapshot,
          name: completedState.name,
          mobile: completedState.mobile,
          journeyReference: passportId,
          source: "journey-passport",
        },
      });
      savePassport(snapshot);
      passport.clearDraft();
      setContactSubmission("success");
      void recordJourneyPassportEvent(passportId, "journey_director_entered");
      setClosureStage("departing");
    } catch {
      setContactSubmission("idle");
      setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
    }
  };
  const reviewPassport = () => {
    setShowAcknowledgement(false);
    setClosureStage("closing");
    passport.dispatch({ type: "set-completion", value: "idle" });
  };
  const next = () => passport.moment.id === "discover" ? complete() : passport.next();
  // EWP-R1.2-WS4-002: the exit-confirmation dialog is a true full-screen
  // modal (aria-modal="true", backdrop) but had no keyboard focus trap —
  // Tab could move focus out of the open dialog into the page behind it.
  // This keeps Tab/Shift+Tab cycling within the dialog's own focusable
  // elements; nothing else about the dialog changes.
  const trapExitDialogFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  if (showAcknowledgement) {
    const issued = closureStage === "contact" || closureStage === "departing";
    return <main className="journey-passport-closure-page">
      <section className={`journey-passport-closure is-${closureStage}`} aria-label="Journey Passport issuance">
        <div className="passport-closure-glow" aria-hidden="true" />
        <div className="passport-closure-mark" aria-hidden="true">
          <div className="passport-closure-book"><span/><span/></div>
          <PassportStamp className="passport-closure-stamp-image" priority />
        </div>
        {issued ? <div className="journey-passport-issued-content">
          <p className="journey-passport-closure-eyebrow">100% complete · Passport issued</p>
          <h1 ref={acknowledgementRef} id="passport-complete-heading" tabIndex={-1}>Your Journey Passport is ready.</h1>
          <div className="passport-closure-id"><span>Passport ID</span><strong>{passportId}</strong></div>
          <p className="passport-closure-tagline"><span>Stories Stamped.</span><span>Memories Guaranteed.</span></p>
          <p>We’ve carefully captured what matters most to you.</p>
          <form onSubmit={continueToDirector} className="journey-passport-reveal mx-auto mt-7 max-w-md text-left" noValidate>
            <h2 className="text-center text-xl font-semibold text-[#2A211C]">Keep your journey connected</h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#2A211C]">Confirm your details so your Journey Director can keep this Passport connected to you.</p>
            <label htmlFor="issued-passport-name" className="mt-5 block text-sm font-semibold text-[#2A211C]">Name<input id="issued-passport-name" type="text" autoComplete="name" maxLength={80} value={passport.state.name} onChange={(event) => update({ name: event.target.value.replace(/[\r\n]+/g, " ") })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]" /></label>
            <label htmlFor="issued-passport-mobile" className="mt-4 block text-sm font-semibold text-[#2A211C]">Mobile number<input id="issued-passport-mobile" type="tel" autoComplete="tel" inputMode="numeric" maxLength={10} value={passport.state.mobile} onChange={(event) => update({ mobile: event.target.value.replace(/\D/g, "") })} aria-describedby="issued-passport-privacy issued-passport-error" className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]" placeholder="e.g. 9876543210" /></label>
            {contactError ? <p id="issued-passport-error" role="alert" className="mt-3 text-sm font-semibold text-[#a1463c]">{contactError}</p> : null}
            {contactSubmission === "success" ? <p role="status" className="mt-3 text-center text-sm font-semibold text-[#4d6b46]">Your Passport is connected. Preparing your possibilities…</p> : null}
            <p id="issued-passport-privacy" className="mt-4 text-xs leading-5 text-[#2A211C]">Used only to connect this Passport with your planning conversation. We do not sell your contact details.</p>
            <button type="submit" className="w-full" disabled={contactSubmission === "submitting" || contactSubmission === "success"} aria-busy={contactSubmission === "submitting"}>{contactSubmission === "submitting" ? "Connecting your Journey Passport…" : "Move to Journey Director"}{contactSubmission === "idle" ? <span aria-hidden="true" className="ml-2">→</span> : null}</button>
            <button type="button" onClick={reviewPassport} disabled={contactSubmission !== "idle"} className="mx-auto block !mt-3 !bg-transparent !text-[#2A211C] !shadow-none">Review my Passport</button>
          </form>
        </div> : <div role="status" aria-live="polite"><p className="passport-closure-transition-copy">{closureStage === "closing" ? "Closing your Passport…" : "Stamping your journey…"}</p></div>}
      </section>
    </main>;
  }

  return <div className="min-h-screen overflow-x-hidden bg-[#FFFDFC] text-[#2A211C]">
    <header className="relative z-20 grid min-h-[5.5rem] grid-cols-[auto_1fr] items-center border-b border-white/20 bg-[#2A211C] px-[var(--layout-gutter)] text-white md:min-h-[6.5rem] md:grid-cols-[1fr_auto_1fr]">
      <SiteBrand variant="compact" surface="dark" preload className="w-[clamp(9.25rem,45vw,12.5rem)] text-white" />
      <p className="justify-self-end text-[0.7rem] font-bold uppercase tracking-[0.2em] md:justify-self-auto">Journey Passport</p>
      <button type="button" onClick={() => passport.state.currentMoment === "welcome" ? window.location.assign("/") : setShowExit(true)} className="hidden justify-self-end border-b border-white/45 text-[0.75rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:inline-flex">Back to Home</button>
    </header>
    <main>
    <section className={`layout-container layout-container--wide relative ${passport.moment.id === "welcome" ? "flex min-h-[calc(100svh-5.5rem)] items-center py-[clamp(1.75rem,5vh,4rem)] md:min-h-[calc(100svh-6.5rem)]" : "pb-[max(4rem,env(safe-area-inset-bottom))] lg:pb-20"}`}>
      <div className="absolute inset-x-0 top-[-6rem] -z-10 h-[38rem] bg-[radial-gradient(circle_at_18%_18%,rgba(244,211,153,.55),transparent_38%),radial-gradient(circle_at_85%_4%,rgba(240,183,102,.28),transparent_32%)]" aria-hidden="true" />
      {passport.moment.id !== "welcome" ? <JourneyChapterProgress currentIndex={passport.currentIndex} completed={passport.completedMoments} onGoTo={passport.goTo} /> : null}
      <div key={passport.moment.id} className={`journey-passport-enter mx-auto w-full ${passport.moment.id === "welcome" ? "max-w-6xl" : "max-w-7xl"}`}>
        {passport.moment.id === "welcome" ? <div><WelcomeMoment onBegin={passport.next} />{passport.resumeDraft ? <div role="dialog" aria-labelledby="resume-title" className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#dfcaa9] bg-white p-5 text-center shadow-md"><h2 id="resume-title" className="text-lg font-semibold text-[#2A211C]">Continue where you left off?</h2><p className="mt-2 text-sm text-[#2A211C]">A temporary Journey Passport from this browser session is available.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={passport.resume} className="min-h-11 rounded-full bg-[#F5951C] px-5 py-2 text-sm font-bold text-[#2A211C]">Continue where I left off</button><button type="button" onClick={passport.startAgain} className="min-h-11 rounded-full border border-[#d8c4a7] px-5 py-2 text-sm font-semibold text-[#2A211C]">Start again</button></div></div> : null}</div> : null}
        {passport.moment.id === "about-you" ? <AboutYouMoment headingRef={headingRef} moment={passport.moment} name={passport.state.name} onChange={(name) => update({ name })} /> : null}
        {passport.moment.id === "companions" ? <SingleChoiceMoment headingRef={headingRef} moment={passport.moment} value={passport.state.companion} showEntryAdvisory={isJourneyEntryPreselectionActive(entryPreselection, "companions", passport.state)} onChange={(companion) => update({ companion: passport.state.companion === companion ? "" : companion })} /> : null}
        {passport.moment.id === "dream-journey" ? <SingleChoiceMoment headingRef={headingRef} moment={passport.moment} value={passport.state.dreamJourney} showEntryAdvisory={isJourneyEntryPreselectionActive(entryPreselection, "dream-journey", passport.state)} onChange={(dreamJourney) => update({ dreamJourney: passport.state.dreamJourney === dreamJourney ? "" : dreamJourney })} /> : null}
        {passport.moment.id === "pace-and-timing" ? <PaceAndTimingMoment headingRef={headingRef} moment={passport.moment} state={passport.state} showEntryAdvisory={isJourneyEntryPreselectionActive(entryPreselection, "pace-and-timing", passport.state)} onUpdate={update} onToggle={(value) => passport.dispatch({ type: "toggle-style", value })} /> : null}
        {passport.moment.id === "destination" ? <DestinationMoment headingRef={headingRef} moment={passport.moment} state={passport.state} onMode={(value) => passport.dispatch({ type: "set-destination-mode", value })} onDestination={(destination) => update({ destination })} /> : null}
        {passport.moment.id === "discover" ? <DiscoverMoment headingRef={headingRef} moment={passport.moment} state={passport.state} /> : null}
      </div>
      {passport.moment.id !== "welcome" ? <JourneyPassportNavigation showBack onBack={passport.previous} onNext={next} disabled={!passport.isValid || passport.state.completion === "completing"} label={passport.moment.nextLabel} /> : null}
      <p className="sr-only" aria-live="polite">{passport.moment.id === "pace-and-timing" ? `${passport.state.travelStyles.length} of 3 travel styles selected.` : ""}</p>
    </section>
    </main>
    {passport.moment.id === "welcome" ? <PublicFooter/> : null}
    {showExit ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="exit-title" onKeyDown={trapExitDialogFocus} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="exit-title" className="text-xl font-semibold text-[#2A211C]">Leave your Journey Passport?</h2><p className="mt-3 text-sm leading-6 text-[#2A211C]">Your temporary progress will remain available in this browser session.</p><div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" autoFocus onClick={() => setShowExit(false)} className="min-h-11 rounded-full border border-[#d8c4a7] px-5 py-2 text-sm font-semibold text-[#2A211C]">Keep exploring</button><Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[#F5951C] px-5 py-2 text-sm font-bold text-[#2A211C]">Leave Passport</Link></div></div></div> : null}
  </div>;
}
