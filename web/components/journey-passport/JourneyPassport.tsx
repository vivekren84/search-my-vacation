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
import { sendJourneyPassportOtp, verifyJourneyPassportOtp } from "@/lib/journey-passport-otp/client";
import { isJourneyEntryExperience, isJourneyEntryInspiration, isJourneyFeeling, type JourneyPassportEntryContext, type JourneyPassportState } from "@/types/journey-passport.types";

import { JourneyChapterProgress } from "./JourneyChapterProgress";
import { JourneyPassportNavigation } from "./JourneyPassportNavigation";
import { AboutYouMoment, DestinationMoment, DiscoverMoment, PaceAndTimingMoment, SingleChoiceMoment, WelcomeMoment } from "./JourneyPassportMoments";
import { PassportStamp } from "./PassportStamp";

// EBC-R1.2-WS5-02 §2/§8.8: "+91 98765 ••210" — country code + leading 5
// digits + last 3 digits visible, middle masked. Pure display formatting,
// not a new dependency. Only ever called with the existing 10-digit UI
// field's value; the country-selector UI itself is a separate, out-of-scope
// track (R1.2-05.01–05.14) for this brief.
function maskJourneyPassportMobileForDisplay(rawMobile: string) {
  const digits = rawMobile.replace(/\D/g, "");
  if (digits.length !== 10) return "your number";
  const leading = digits.slice(0, 5);
  const last3 = digits.slice(-3);
  const maskedCount = Math.max(digits.length - leading.length - last3.length, 0);
  return `+91 ${leading} ${"•".repeat(maskedCount)}${last3}`;
}

// EBC-R1.2-WS5-02 §4: "Resend available in 0:24".
function formatJourneyPassportOtpCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

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
  const otpHeadingRef = useRef<HTMLHeadingElement>(null);
  const otpCodeInputRef = useRef<HTMLInputElement>(null);
  const issuedReferenceRef = useRef("");
  const [showExit, setShowExit] = useState(false);
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  // EBC-R1.2-WS5-03 §6 (Stamp resequencing — hard prerequisite): "stamping"
  // now fires only after a verified, successful submission, never before the
  // traveller has entered and verified their mobile number.
  const [closureStage, setClosureStage] = useState<"closing" | "contact" | "stamping" | "departing">("closing");
  const [passportId, setPassportId] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSubmission, setContactSubmission] = useState<"idle" | "submitting" | "success">("idle");
  // EBC-R1.2-WS5-02 §3.1: the OTP entry is a second internal stage of the
  // existing closure <form>, not a new dialog/modal — tracked as local state
  // alongside the existing contact-form fields (WS5-01 §8), not inside the
  // useJourneyPassport reducer.
  const [contactStage, setContactStage] = useState<"details" | "otp">("details");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpStatus, setOtpStatus] = useState<"idle" | "sending" | "verifying">("idle");
  const [otpNextResendAt, setOtpNextResendAt] = useState(0);
  const [otpResendExhausted, setOtpResendExhausted] = useState(false);
  // Live countdown display state (EBC-R1.2-WS5-02 §4's "Resend available in
  // 0:24"). Deliberately NOT computed inline via `Date.now()` at render time —
  // the React Compiler's purity rule forbids calling an impure function
  // (Date.now) directly in a component's render body. Instead, "now" is
  // captured only inside the effect below (an event-like, non-render
  // context) and stored as state; the render body reads that stored value.
  const [otpResendNow, setOtpResendNow] = useState(0);

  useEffect(() => { if (passport.moment.id !== "welcome") headingRef.current?.focus(); }, [passport.moment.id]);
  useEffect(() => {
    if (!showAcknowledgement) return;
    router.prefetch("/journey-director");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const contactTimer = window.setTimeout(() => setClosureStage("contact"), reducedMotion ? 0 : 720);
    return () => window.clearTimeout(contactTimer);
  }, [router, showAcknowledgement]);
  useEffect(() => { if (closureStage === "contact") acknowledgementRef.current?.focus(); }, [closureStage]);
  // EBC-R1.2-WS5-02 §3.4/§8.5: extends the existing headingRef/acknowledgementRef
  // focus-management convention to the new "Confirm your number" heading.
  useEffect(() => { if (contactStage === "otp") otpHeadingRef.current?.focus(); }, [contactStage]);
  useEffect(() => {
    if (closureStage !== "stamping") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setClosureStage("departing"), reducedMotion ? 0 : 560);
    return () => window.clearTimeout(timer);
  }, [closureStage]);
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
  // Live countdown display only (EBC-R1.2-WS5-02 §4's "Resend available in
  // 0:24") — enforcement of the resend cooldown is entirely server-side
  // (verify_journey_passport_otp / send_journey_passport_otp RPCs).
  useEffect(() => {
    if (contactStage !== "otp" || otpNextResendAt <= Date.now()) return;
    const interval = window.setInterval(() => setOtpResendNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [contactStage, otpNextResendAt]);

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

  // EBC-R1.2-WS5-02 §7: changing the phone number mid-flow must invalidate
  // any in-progress or completed verification for the old number. The
  // client simply returns to the details stage and drops all OTP state; the
  // superseded server-side challenge for the old number is left to expire on
  // its own (EBC-R1.2-WS5-01 §7/§8 — no cleanup RPC is required for
  // correctness).
  const editMobileNumber = () => {
    setContactStage("details");
    setOtpChallengeId("");
    setOtpCode("");
    setOtpError("");
    setOtpResendExhausted(false);
    setOtpNextResendAt(0);
  };

  const requestOtp = async () => {
    if (otpStatus === "sending") return;
    const digits = passport.state.mobile.replace(/\D/g, "");
    if (passport.state.name.trim().length < 2) { setContactError("Please share the name you would like us to use."); return; }
    if (digits.length !== 10 || digits === "0000000000") { setContactError("Please enter a valid 10-digit mobile number."); return; }
    setContactError("");
    setOtpStatus("sending");
    try {
      const result = await sendJourneyPassportOtp(passport.state.mobile.trim());
      if (result.outcome === "sent" && result.challengeId) {
        setOtpChallengeId(result.challengeId);
        setOtpCode("");
        setOtpError("");
        setOtpResendExhausted(false);
        setOtpNextResendAt(Date.now() + (result.resendDelaySeconds ?? 30) * 1000);
        setOtpResendNow(Date.now());
        setContactStage("otp");
      } else if (result.outcome === "resend_too_soon") {
        setContactStage("otp");
      } else if (result.outcome === "resend_limit_exceeded") {
        setOtpResendExhausted(true);
        setContactStage("otp");
        setOtpError("You’ve reached the resend limit for this number. Please check the number below, or try again in a few minutes.");
      } else if (result.outcome === "otp_unavailable") {
        setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
      } else {
        setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
      }
    } catch {
      setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
    } finally {
      setOtpStatus("idle");
    }
  };
  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void requestOtp();
  };

  // Runs only after a successful OTP verification — mirrors the previous
  // continueToDirector logic exactly, but now gated on, and carrying, the
  // single-use verification token (EBC-R1.2-WS5-01 §2.9/§10). Only on this
  // call's success does the Stamp become eligible to fire (closureStage ->
  // "stamping"), per §6's resequencing requirement.
  const finalizeJourneyPassportSubmission = async (verificationToken: string) => {
    const completedState = { ...passport.state, name: passport.state.name.trim(), mobile: passport.state.mobile.trim(), journeyReference: passportId };
    const snapshot = createJourneyPassportSnapshot(completedState);
    setContactSubmission("submitting");
    try {
      await submitJourneyPassportLead({
        passportReference: passportId,
        guestName: completedState.name,
        mobileNumber: completedState.mobile,
        verificationToken,
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
      setClosureStage("stamping");
    } catch {
      // Known limitation (disclosed, not silently masked): if the OTP token
      // was already consumed server-side but this submission call itself
      // then fails (e.g. a network drop), the token cannot be reused and the
      // traveller must request a new code. This mirrors the narrow window
      // any two-sequential-server-calls design has and was accepted rather
      // than adding cross-request transactional machinery for this EBC.
      setContactSubmission("idle");
      setOtpError(JOURNEY_LEAD_FAILURE_MESSAGE);
      otpCodeInputRef.current?.focus();
    }
  };

  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otpStatus === "verifying" || contactSubmission !== "idle") return;
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError("That code doesn’t match — please check and try again.");
      otpCodeInputRef.current?.focus();
      return;
    }
    setOtpError("");
    setOtpStatus("verifying");
    try {
      const result = await verifyJourneyPassportOtp(passport.state.mobile.trim(), otpChallengeId, otpCode);
      if (result.outcome === "verified" && result.verificationToken) {
        await finalizeJourneyPassportSubmission(result.verificationToken);
      } else if (result.outcome === "incorrect") {
        setOtpCode("");
        setOtpError("That code doesn’t match — please check and try again.");
        otpCodeInputRef.current?.focus();
      } else if (result.outcome === "expired") {
        setOtpError("This code has expired. Send a new one to continue.");
        otpCodeInputRef.current?.focus();
      } else if (result.outcome === "exhausted") {
        setOtpError("You’ve used all your attempts for this code. Send a new one to continue.");
        otpCodeInputRef.current?.focus();
      } else {
        setOtpError(JOURNEY_LEAD_FAILURE_MESSAGE);
        otpCodeInputRef.current?.focus();
      }
    } catch {
      setOtpError(JOURNEY_LEAD_FAILURE_MESSAGE);
      otpCodeInputRef.current?.focus();
    } finally {
      setOtpStatus((current) => (current === "verifying" ? "idle" : current));
    }
  };

  const reviewPassport = () => {
    setShowAcknowledgement(false);
    setClosureStage("closing");
    setContactStage("details");
    setOtpChallengeId("");
    setOtpCode("");
    setOtpError("");
    setOtpResendExhausted(false);
    setOtpNextResendAt(0);
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
    const issued = closureStage === "contact" || closureStage === "stamping" || closureStage === "departing";
    const otpResendSecondsRemaining = Math.max(0, Math.ceil((otpNextResendAt - otpResendNow) / 1000));
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
          {contactStage === "details" ? <form onSubmit={handleDetailsSubmit} className="journey-passport-reveal mx-auto mt-7 max-w-md text-left" noValidate>
            <h2 className="text-center text-xl font-semibold text-[#2A211C]">Keep your journey connected</h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#2A211C]">Confirm your details so your Journey Director can keep this Passport connected to you.</p>
            <label htmlFor="issued-passport-name" className="mt-5 block text-sm font-semibold text-[#2A211C]">Name<input id="issued-passport-name" type="text" autoComplete="name" maxLength={80} value={passport.state.name} onChange={(event) => update({ name: event.target.value.replace(/[\r\n]+/g, " ") })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]" /></label>
            <label htmlFor="issued-passport-mobile" className="mt-4 block text-sm font-semibold text-[#2A211C]">Mobile number<input id="issued-passport-mobile" type="tel" autoComplete="tel" inputMode="numeric" maxLength={10} value={passport.state.mobile} onChange={(event) => update({ mobile: event.target.value.replace(/\D/g, "") })} aria-describedby="issued-passport-privacy issued-passport-error" className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]" placeholder="e.g. 9876543210" /></label>
            {contactError ? <p id="issued-passport-error" role="alert" className="mt-3 text-sm font-semibold text-[#a1463c]">{contactError}</p> : null}
            <p id="issued-passport-privacy" className="mt-4 text-xs leading-5 text-[#2A211C]">Used only to connect this Passport with your planning conversation. We do not sell your contact details.</p>
            <button type="submit" className="w-full" disabled={otpStatus === "sending"} aria-busy={otpStatus === "sending"}>{otpStatus === "sending" ? "Sending your code…" : "Move to Journey Director"}{otpStatus === "idle" ? <span aria-hidden="true" className="ml-2">→</span> : null}</button>
            <button type="button" onClick={reviewPassport} disabled={otpStatus !== "idle"} className="mx-auto block !mt-3 !bg-transparent !text-[#2A211C] !shadow-none">Review my Passport</button>
          </form> : <form onSubmit={verifyOtp} className="journey-passport-reveal mx-auto mt-7 max-w-md text-left" noValidate>
            <h2 ref={otpHeadingRef} tabIndex={-1} className="text-center text-xl font-semibold text-[#2A211C]">Confirm your number</h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#2A211C]">
              Code sent to {maskJourneyPassportMobileForDisplay(passport.state.mobile)}. It should arrive within a minute.{" "}
              <button type="button" onClick={editMobileNumber} disabled={contactSubmission !== "idle"} className="!inline !bg-transparent !p-0 !text-[#2A211C] !underline !shadow-none">Change number</button>
            </p>
            <label htmlFor="issued-passport-otp-code" className="mt-5 block text-sm font-semibold text-[#2A211C]">
              Code
              <input
                id="issued-passport-otp-code" ref={otpCodeInputRef} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                aria-describedby="issued-passport-otp-status issued-passport-otp-error"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]"
              />
            </label>
            {otpError ? <p id="issued-passport-otp-error" role="alert" className="mt-3 text-sm font-semibold text-[#a1463c]">{otpError}</p> : null}
            {contactSubmission === "success" ? <p id="issued-passport-otp-status" role="status" className="mt-3 text-center text-sm font-semibold text-[#4d6b46]">Number confirmed. Your Passport is connected. Preparing your possibilities…</p> : null}
            <button type="submit" className="w-full" disabled={otpStatus === "verifying" || contactSubmission !== "idle"} aria-busy={otpStatus === "verifying" || contactSubmission === "submitting"}>{otpStatus === "verifying" || contactSubmission === "submitting" ? "Connecting your Journey Passport…" : "Verify code"}</button>
            {otpResendExhausted ? null : otpResendSecondsRemaining > 0
              ? <p className="mx-auto mt-3 text-center text-sm text-[#8a7a6a]">Resend available in {formatJourneyPassportOtpCountdown(otpResendSecondsRemaining)}</p>
              : <button type="button" onClick={() => void requestOtp()} disabled={otpStatus === "sending" || contactSubmission !== "idle"} className="mx-auto block !mt-3 !bg-transparent !text-[#2A211C] !shadow-none">Resend code</button>}
          </form>}
        </div> : <div role="status" aria-live="polite"><p className="passport-closure-transition-copy">Closing your Passport…</p></div>}
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
