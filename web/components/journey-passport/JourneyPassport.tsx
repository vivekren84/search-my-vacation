"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { budgetOptions, comfortOptions, journeyChapters } from "@/config/journey-passport.config";
import { useJourneyPassport } from "@/hooks/useJourneyPassport";
import type { JourneyFieldErrors } from "@/types/journey-passport.types";

import { JourneyChapterProgress } from "./JourneyChapterProgress";
import { JourneyPassportNavigation } from "./JourneyPassportNavigation";
import { PassportStamp } from "./PassportStamp";
import { SelectionCard } from "./SelectionCard";

const preferenceFields = [
  ["Dietary Needs", "For example, vegetarian, vegan or allergies"],
  ["Accessibility", "Anything that will help us plan more comfortably"],
  ["Celebrations", "An occasion you would like us to make special"],
  ["Room Preferences", "A view, bedding or room setup that matters"],
  ["Interests", "Anything you would especially love to experience"],
  ["Other Special Requests", "Anything else you would like us to know"],
] as const;

const contactErrorCopy = {
  name: "Please share the name you would like us to use.",
  phone: "Please share a phone number so a Journey Director can reach you.",
  email: "Please enter a valid email address.",
  city: "Please share the city you are travelling from.",
} satisfies JourneyFieldErrors;

export default function JourneyPassport() {
  const searchParams = useSearchParams();
  const feeling = searchParams.get("feeling") ?? undefined;
  const passport = useJourneyPassport(feeling);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [contactErrors, setContactErrors] = useState<JourneyFieldErrors>({});
  const chapter = passport.chapter;

  useEffect(() => { headingRef.current?.focus(); }, [passport.currentIndex]);

  const validateContact = () => {
    const errors: JourneyFieldErrors = {};
    const { contact } = passport.state;
    if (contact.name.trim().length < 2) errors.name = contactErrorCopy.name;
    if (!/^[+()\d\s-]{7,}$/.test(contact.phone.trim())) errors.phone = contactErrorCopy.phone;
    if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) errors.email = contactErrorCopy.email;
    if (contact.city.trim().length < 2) errors.city = contactErrorCopy.city;
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (chapter.id === "contact" && !validateContact()) return;
    if (chapter.id === "contact") {
      // Future integration point: send a validated, consent-aware payload to the CRM/API here.
      // This release intentionally keeps the completed Journey Passport only in client-side state.
    }
    passport.next();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf7ef] text-[#2d2117]">
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a86f29]">
          <Image src="/logos/smv-logo.png" alt="Search My Vacation" width={66} height={60} className="h-12 w-auto object-contain" priority />
          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-[#765535] sm:block">Search My Vacation</span>
        </Link>
        <p className="hidden text-sm font-medium text-[#775f48] md:block">More Than a Trip. It’s an Experience.</p>
        <Link href="/" className="rounded-full border border-[#ddc8aa] bg-white/70 px-4 py-2 text-sm font-semibold text-[#61452d] transition hover:border-[#b47a2d] hover:bg-[#fff7ea] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a86f29]">Back to home</Link>
      </header>

      <section className="relative mx-auto max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-20">
        <div className="absolute inset-x-0 top-[-6rem] -z-10 h-[38rem] bg-[radial-gradient(circle_at_18%_18%,rgba(244,211,153,.55),transparent_38%),radial-gradient(circle_at_85%_4%,rgba(240,183,102,.28),transparent_32%)]" aria-hidden="true" />
        {chapter.type !== "welcome" && chapter.type !== "complete" ? <JourneyChapterProgress currentIndex={passport.currentIndex} completed={passport.completedChapters} onGoTo={passport.goTo} /> : null}

        <div className={`mx-auto ${chapter.type === "welcome" || chapter.type === "complete" ? "max-w-6xl" : "max-w-7xl"}`}>
          {chapter.type === "welcome" ? <WelcomeChapter onNext={handleNext} /> : null}
          {chapter.type === "name" ? <NameChapter headingRef={headingRef} name={passport.state.name} onChange={(name) => { passport.update({ name }); if (!passport.state.contact.name) passport.updateContact("name", name); }} /> : null}
          {chapter.id === "companions" ? <SingleChoiceChapter headingRef={headingRef} chapter={chapter} value={passport.state.companion} onChange={(companion) => passport.update({ companion })} /> : null}
          {chapter.id === "dream-journey" ? <SingleChoiceChapter headingRef={headingRef} chapter={chapter} value={passport.state.dreamJourney} onChange={(dreamJourney) => passport.update({ dreamJourney })} /> : null}
          {chapter.type === "multi-select" ? <MultiChoiceChapter headingRef={headingRef} chapter={chapter} values={passport.state.travelStyles} onToggle={passport.toggleTravelStyle} /> : null}
          {chapter.type === "timing" ? <TimingChapter headingRef={headingRef} chapter={chapter} timing={passport.state.timing} startDate={passport.state.startDate} endDate={passport.state.endDate} onChange={(partial) => passport.update(partial)} /> : null}
          {chapter.type === "comfort" ? <ComfortChapter headingRef={headingRef} comfort={passport.state.comfort} budget={passport.state.budget} preferences={passport.state.preferences} onComfort={(comfort) => passport.update({ comfort })} onBudget={(budget) => passport.update({ budget })} onPreference={passport.updatePreference} /> : null}
          {chapter.type === "summary" ? <ProfileChapter headingRef={headingRef} state={passport.state} /> : null}
          {chapter.type === "contact" ? <ContactChapter headingRef={headingRef} contact={passport.state.contact} errors={contactErrors} onChange={passport.updateContact} /> : null}
          {chapter.type === "complete" ? <CompleteChapter /> : null}
        </div>

        {chapter.type !== "welcome" && chapter.type !== "complete" ? <JourneyPassportNavigation showBack onBack={passport.previous} onNext={handleNext} disabled={!passport.isValid} label={chapter.nextLabel} /> : null}
      </section>
    </main>
  );
}

function ChapterHeading({ headingRef, eyebrow, title, description }: { headingRef: React.RefObject<HTMLHeadingElement | null>; eyebrow: string; title: string; description?: string }) {
  return <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#96652b]">{eyebrow}</p><h1 ref={headingRef} tabIndex={-1} className="mt-4 font-serif text-4xl font-normal tracking-[-0.045em] text-[#2b1d12] outline-none sm:text-5xl lg:text-6xl">{title}</h1>{description ? <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#705c47] sm:text-lg">{description}</p> : null}</div>;
}

function WelcomeChapter({ onNext }: { onNext: () => void }) {
  return <section className="relative min-h-[42rem] overflow-hidden rounded-[2.5rem] bg-[#27190f] shadow-[0_30px_90px_rgba(69,39,15,0.22)]"><Image src="/images/golden-hour.png" alt="Golden hour travel landscape" fill priority sizes="(max-width: 1440px) 100vw, 88rem" className="object-cover" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,15,8,0.82),rgba(24,15,8,0.43)_55%,rgba(24,15,8,0.16)),linear-gradient(0deg,rgba(24,15,8,0.7),transparent_62%)]" aria-hidden="true" /><div className="relative flex min-h-[42rem] max-w-3xl flex-col justify-end p-8 sm:p-14 lg:p-20"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2c77d]">A thoughtfully designed beginning</p><h1 className="mt-5 font-serif text-5xl font-normal leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">Welcome to Your Journey Passport</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/90">Every memorable journey begins with understanding the traveller behind it.</p><p className="mt-4 max-w-2xl text-base leading-7 text-white/78">We take the time to understand what matters to you, so we can craft an experience that feels truly yours.</p><button type="button" onClick={onNext} className="mt-10 w-fit rounded-full bg-[#f2c77d] px-8 py-4 text-sm font-bold text-[#2b1b0f] shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ffe1a5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2c77d] motion-reduce:transition-none motion-reduce:hover:translate-y-0">Begin My Journey <span aria-hidden="true">→</span></button></div></section>;
}

function NameChapter({ headingRef, name, onChange }: { headingRef: React.RefObject<HTMLHeadingElement | null>; name: string; onChange: (value: string) => void }) {
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 2 · About You" title="First, tell us about you." description="This helps us personalise your Journey Passport and every recommendation that follows." /><div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-[#e6d5bb] bg-white/80 p-8 shadow-[0_16px_40px_rgba(93,59,21,0.08)] sm:p-10"><label htmlFor="passport-name" className="block text-lg font-semibold text-[#352619]">What should we call you?</label><input id="passport-name" name="name" type="text" value={name} onChange={(event) => onChange(event.target.value)} autoComplete="name" className="mt-5 min-h-14 w-full rounded-2xl border border-[#d8c4a7] bg-[#fffdf9] px-5 text-lg text-[#2d2117] outline-none transition placeholder:text-[#ae9b84] focus:border-[#a86f29] focus:ring-4 focus:ring-[#f3dfba]" placeholder="Your full name" /><p className="mt-4 text-sm leading-6 text-[#796653]">We will use this only to make the journey feel more personal.</p></div></section>;
}

function SingleChoiceChapter({ headingRef, chapter, value, onChange }: { headingRef: React.RefObject<HTMLHeadingElement | null>; chapter: (typeof journeyChapters)[number]; value: string; onChange: (value: string) => void }) {
  const options = chapter.options ?? [];
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow={`Chapter ${chapter.number} · ${chapter.navigationLabel}`} title={chapter.title} description={chapter.description} /><div role="radiogroup" aria-label={chapter.title} className={`mx-auto mt-12 grid max-w-6xl gap-5 ${chapter.id === "dream-journey" ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>{options.map((option) => <SelectionCard key={option.value} option={option} selected={value === option.value} onSelect={() => onChange(option.value)} />)}</div></section>;
}

function MultiChoiceChapter({ headingRef, chapter, values, onToggle }: { headingRef: React.RefObject<HTMLHeadingElement | null>; chapter: (typeof journeyChapters)[number]; values: string[]; onToggle: (value: string) => void }) {
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 5 · Travel Style" title={chapter.title} description={chapter.description} /><div role="group" aria-label={chapter.title} className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{(chapter.options ?? []).map((option) => <SelectionCard key={option.value} option={option} compact multi selected={values.includes(option.value)} onSelect={() => onToggle(option.value)} />)}</div></section>;
}

function TimingChapter({ headingRef, chapter, timing, startDate, endDate, onChange }: { headingRef: React.RefObject<HTMLHeadingElement | null>; chapter: (typeof journeyChapters)[number]; timing: string; startDate: string; endDate: string; onChange: (partial: { timing?: string; startDate?: string; endDate?: string }) => void }) {
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 6 · Timing" title={chapter.title} /><div role="radiogroup" aria-label="Travel timing" className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{(chapter.options ?? []).map((option) => <SelectionCard key={option.value} option={option} compact selected={timing === option.value} onSelect={() => onChange({ timing: option.value })} />)}</div>{timing === "Specific Dates" ? <div className="mx-auto mt-7 grid max-w-3xl gap-5 rounded-[1.5rem] border border-[#e1ceb0] bg-[#fff9ee] p-6 sm:grid-cols-2"><label className="text-sm font-semibold text-[#4c3825]">Departure date<input aria-label="Departure date" type="date" value={startDate} onChange={(event) => onChange({ startDate: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-3 text-[#2d2117] focus:outline-2 focus:outline-offset-2 focus:outline-[#a86f29]" /></label><label className="text-sm font-semibold text-[#4c3825]">Return date<input aria-label="Return date" type="date" min={startDate || undefined} value={endDate} onChange={(event) => onChange({ endDate: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-3 text-[#2d2117] focus:outline-2 focus:outline-offset-2 focus:outline-[#a86f29]" /></label></div> : null}</section>;
}

function ComfortChapter({ headingRef, comfort, budget, preferences, onComfort, onBudget, onPreference }: { headingRef: React.RefObject<HTMLHeadingElement | null>; comfort: string; budget: string; preferences: Record<string, string>; onComfort: (value: string) => void; onBudget: (value: string) => void; onPreference: (key: string, value: string) => void }) {
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 7 · Comfort" title="Tell us about your comfort and preferences." description="This helps us shape an experience that feels right for you." /><div className="mx-auto mt-12 max-w-5xl"><fieldset><legend className="text-base font-semibold text-[#3c2a1a]">Your preferred comfort level</legend><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{comfortOptions.map((option) => <SelectionCard key={option.value} option={option} compact selected={comfort === option.value} onSelect={() => onComfort(option.value)} />)}</div></fieldset><fieldset className="mt-10 rounded-[2rem] border border-[#e4d1b2] bg-white/80 p-7 sm:p-9"><legend className="sr-only">Budget preference</legend><p className="text-xl font-semibold text-[#312216]">What investment range feels comfortable for this journey?</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[#705c47]">This helps us recommend experiences that genuinely match your expectations.</p><div role="radiogroup" aria-label="Budget preference" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{budgetOptions.map((option) => <SelectionCard key={option.value} option={option} compact selected={budget === option.value} onSelect={() => onBudget(option.value)} />)}</div></fieldset><div className="mt-10 grid gap-4 sm:grid-cols-2">{preferenceFields.map(([label, hint]) => <label key={label} className="rounded-2xl border border-[#eadbc5] bg-white/65 p-5 text-sm font-semibold text-[#493424]">{label}<textarea value={preferences[label] ?? ""} onChange={(event) => onPreference(label, event.target.value)} placeholder={hint} rows={2} className="mt-3 w-full resize-y rounded-xl border border-[#dfcdb5] bg-[#fffdf9] p-3 text-sm font-normal text-[#2d2117] outline-none placeholder:text-[#a28d76] focus:border-[#a86f29] focus:ring-2 focus:ring-[#f1dbb5]" /></label>)}</div></div></section>;
}

function ProfileChapter({ headingRef, state }: { headingRef: React.RefObject<HTMLHeadingElement | null>; state: ReturnType<typeof useJourneyPassport>["state"] }) {
  const profileItems = [ state.companion ? `Travelling with ${state.companion.toLowerCase()}` : "", state.dreamJourney ? `Dreaming of a ${state.dreamJourney.toLowerCase()}` : "", state.travelStyles.length ? `Drawn to ${state.travelStyles.join(" and ").toLowerCase()}` : "", state.timing ? `${state.timing === "Flexible" ? "Flexible" : `Hoping to travel ${state.timing.toLowerCase()}`} with travel dates` : "", state.comfort ? `Prefers ${state.comfort.toLowerCase()} comfort` : "", state.preferences.Celebrations ? `Celebrating ${state.preferences.Celebrations}` : "" ].filter(Boolean);
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 8 · Your Profile" title="Here’s what we understand about your journey so far." /><div className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-[#e7d6bd] bg-[linear-gradient(135deg,#fffdf8,#f5ead8)] p-8 shadow-[0_20px_44px_rgba(97,61,22,0.1)] sm:p-12"><p className="text-sm leading-7 text-[#745d45]">{state.name ? `${state.name}, here is the beginning of a journey designed around you.` : "Here is the beginning of a journey designed around you."}</p><ul className="mt-7 grid gap-4 sm:grid-cols-2">{profileItems.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-white/80 bg-white/70 p-4 text-[#3c2a1a]"><span aria-hidden="true" className="text-[#a86f29]">✦</span><span>{item}</span></li>)}</ul><p className="mt-8 font-serif text-3xl tracking-[-0.03em] text-[#392719]">We already have a wonderful starting point.</p></div></section>;
}

function ContactChapter({ headingRef, contact, errors, onChange }: { headingRef: React.RefObject<HTMLHeadingElement | null>; contact: ReturnType<typeof useJourneyPassport>["state"]["contact"]; errors: JourneyFieldErrors; onChange: (field: keyof ReturnType<typeof useJourneyPassport>["state"]["contact"], value: string) => void }) {
  const fields: Array<{ field: keyof typeof contact; label: string; type: string; autoComplete: string }> = [{ field: "name", label: "Full Name", type: "text", autoComplete: "name" }, { field: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" }, { field: "email", label: "Email Address", type: "email", autoComplete: "email" }, { field: "city", label: "City", type: "text", autoComplete: "address-level2" }];
  return <section className="pt-10"><ChapterHeading headingRef={headingRef} eyebrow="Chapter 9 · Let’s Connect" title="We’ve got a wonderful starting point." /><p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-[#6e5945]">Share your contact details, and one of our Journey Directors will personally begin crafting your experience.</p><form noValidate className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-[#e4d1b2] bg-white/85 p-8 shadow-[0_18px_42px_rgba(93,59,21,0.09)] sm:p-10"><div className="grid gap-5 sm:grid-cols-2">{fields.map(({ field, label, type, autoComplete }) => <label key={field} className="text-sm font-semibold text-[#493424]">{label}<input type={type} name={field} autoComplete={autoComplete} value={contact[field]} onChange={(event) => onChange(field, event.target.value)} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} className={`mt-2 min-h-13 w-full rounded-xl border bg-[#fffdf9] px-4 text-base font-normal text-[#2d2117] outline-none transition placeholder:text-[#ad9780] focus:ring-4 ${errors[field] ? "border-[#b85d4d] focus:border-[#b85d4d] focus:ring-[#f5d7d1]" : "border-[#d8c4a7] focus:border-[#a86f29] focus:ring-[#f1dbb5]"}`} placeholder={label} />{errors[field] ? <span id={`${field}-error`} className="mt-2 block font-normal text-[#a1463c]">{errors[field]}</span> : null}</label>)}</div><p className="mt-7 rounded-xl bg-[#f7eddd] px-4 py-3 text-sm leading-6 text-[#70583d]">Your details are safe with us. We respect your privacy.</p></form></section>;
}

function CompleteChapter() {
  return <section className="mx-auto grid min-h-[43rem] max-w-5xl place-items-center rounded-[2.5rem] border border-[#e0c69b] bg-[radial-gradient(circle_at_50%_10%,#fff8e9,transparent_45%),linear-gradient(135deg,#f5ead8,#fffdf8)] p-8 text-center shadow-[0_26px_70px_rgba(97,61,22,0.12)] sm:p-14"><div className="flex max-w-2xl flex-col items-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#946129]">More Than a Trip. It’s an Experience.</p><h1 className="mt-5 font-serif text-5xl font-normal tracking-[-0.05em] text-[#2d2117] sm:text-6xl">Your Journey Begins Here.</h1><p className="mt-5 text-lg text-[#6c5640]">Your Journey Passport has been officially stamped.</p><div className="my-10"><PassportStamp /></div><p className="font-serif text-3xl tracking-[-0.035em] text-[#372719]">Now let us search for the vacation that’s truly yours.</p><p className="mt-4 max-w-xl text-sm leading-7 text-[#745f49]">One of our Journey Directors will personally review your Journey Passport and begin shaping your experience.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/journey" className="rounded-full bg-[#a86f29] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#83521a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a86f29]">Explore Destinations</Link><button type="button" disabled title="Traveller Stories are coming soon" className="cursor-not-allowed rounded-full border border-[#d9c6a7] bg-white/60 px-6 py-3 text-sm font-semibold text-[#9c876d]">Read Traveller Stories · Coming soon</button><Link href="/" className="rounded-full border border-[#caa26a] bg-[#fff8eb] px-6 py-3 text-sm font-semibold text-[#674521] transition hover:bg-[#f5e5c7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a86f29]">Back to Home</Link></div></div></section>;
}
