"use client";

import Image from "next/image";
import Link from "next/link";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";

import SiteBrand from "@/components/brand/SiteBrand";
import { siteContact } from "@/config/contact.config";
import { useJourneySession } from "@/context/JourneySessionContext";
import { createJourneyRecommendationSet } from "@/lib/journey-director";
import { createJourneyReference, createJourneySynopsis } from "@/lib/journey-director/journey-synopsis";
import { callbackDateValidationMessage, callbackTimeWindows, currentLocalDate, isCallbackTimeWindow, isValidCallbackDate } from "@/lib/callback-preferences";
import { recordJourneyPassportEvent, submitJourneyCallbackPreference } from "@/lib/journey-leads/client";
import type {
  JourneyPassportSnapshot,
  JourneyPossibility,
  JourneyRecommendationSet,
  JourneySessionSnapshot,
} from "@/types/journey-director";

import styles from "./JourneyDirectorExperience.module.css";

const SuggestedItinerarySection = lazy(() => import("./SuggestedItinerarySection"));

export default function JourneyDirectorExperience() {
  const { passport, journeySession, isHydrated, saveJourneySession } = useJourneySession();

  if (!isHydrated) {
    return <JourneyDirectorLoading />;
  }

  if (!passport) {
    return (
      <UnavailableJourneyDirector
        heading="Let’s begin with your Journey Passport."
        message="We could not find a completed travel story for this visit. Share what matters to you, and your Journey Director can prepare possibilities with confidence."
      />
    );
  }

  return <JourneyRecommendationBoundary passport={passport} journeySession={journeySession} saveJourneySession={saveJourneySession} />;
}

type RecommendationCreation =
  | { status: "ready"; recommendationSet: JourneyRecommendationSet }
  | { status: "failed" };

function JourneyRecommendationBoundary({ passport, journeySession, saveJourneySession }: { passport: JourneyPassportSnapshot; journeySession: JourneySessionSnapshot | null; saveJourneySession: (session: JourneySessionSnapshot) => void }) {
  const [executionTimestamp] = useState(() => new Date().toISOString());
  const creation = useMemo<RecommendationCreation>(() => {
    try {
      return {
        status: "ready",
        recommendationSet: createJourneyRecommendationSet(passport, executionTimestamp),
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Journey Director recommendation creation failed.", error);
      }

      return { status: "failed" };
    }
  }, [executionTimestamp, passport]);

  if (creation.status === "failed") {
    return (
      <UnavailableJourneyDirector
        heading="Your possibilities need a little more care."
        message="We could not prepare your considered shortlist just now. Your Journey Passport is still ready, and a human Journey Director can help you take the next step."
      />
    );
  }

  switch (creation.recommendationSet.state) {
    case "success":
      return <JourneyDirectorContent recommendationSet={creation.recommendationSet} journeySession={journeySession} saveJourneySession={saveJourneySession} />;
    case "partial":
      return <JourneyDirectorContent recommendationSet={creation.recommendationSet} journeySession={journeySession} saveJourneySession={saveJourneySession} />;
    case "insufficient":
      return (
        <InsufficientJourneyDirector
          message={creation.recommendationSet.recoveryMessage}
        />
      );
    case "unavailable":
      return (
        <UnavailableJourneyDirector
          heading="Let’s review your Journey Passport."
          message={creation.recommendationSet.recoveryMessage}
        />
      );
  }
}

function JourneyDirectorLoading() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Preparing your Journey Director">
      <JourneyDirectorHeader />
      <section className={styles.completion} role="status">
        <div className={styles.completionGlow} aria-hidden="true" />
        <div className={styles.completionInner}>
          <p className={styles.eyebrowLight}>Your Journey Director</p>
          <h1>Preparing your possibilities…</h1>
          <p className={styles.completionCopy}>Restoring the journey story you shared.</p>
        </div>
      </section>
    </main>
  );
}

function InsufficientJourneyDirector({ message }: { message: string }) {
  return (
    <JourneyDirectorRecovery
      eyebrow="A little more of your story"
      heading="Let’s understand your journey more clearly."
      message={
        message ||
        "Your Journey Passport does not yet provide enough alignment for a confident recommendation."
      }
      primaryLabel="Review my Journey Passport"
      primaryHref="/journey-passport"
    />
  );
}

function UnavailableJourneyDirector({
  heading,
  message,
}: {
  heading: string;
  message: string;
}) {
  return (
    <JourneyDirectorRecovery
      eyebrow="Your Journey Director"
      heading={heading}
      message={message}
      primaryLabel="Return to Journey Passport"
      primaryHref="/journey-passport"
    />
  );
}

function JourneyDirectorRecovery({
  eyebrow,
  heading,
  message,
  primaryLabel,
  primaryHref,
}: {
  eyebrow: string;
  heading: string;
  message: string;
  primaryLabel: string;
  primaryHref: string;
}) {
  return (
    <main className={styles.page}>
      <JourneyDirectorHeader />
      <section className={styles.completion} aria-labelledby="journey-recovery-heading">
        <div className={styles.completionGlow} aria-hidden="true" />
        <div className={styles.completionInner}>
          <p className={styles.eyebrowLight}>{eyebrow}</p>
          <h1 id="journey-recovery-heading">{heading}</h1>
          <p className={styles.completionCopy}>{message}</p>
          <div className={styles.recoveryActions}>
            <Link className={styles.recoveryPrimary} href={primaryHref}>
              {primaryLabel} <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.recoverySecondary} href="/">
              Return home
            </Link>
          </div>
          <p className={styles.recoveryNote}>
            Prefer a conversation? A human Journey Director can review your Passport with you.
            Nothing has been sent yet.
          </p>
        </div>
      </section>
    </main>
  );
}

function JourneyDirectorContent({
  recommendationSet,
  journeySession,
  saveJourneySession,
}: {
  recommendationSet: JourneyRecommendationSet;
  journeySession: JourneySessionSnapshot | null;
  saveJourneySession: (session: JourneySessionSnapshot) => void;
}) {
  const validIds = new Set(recommendationSet.possibilities.map((possibility) => possibility.id));
  const restored = journeySession &&
    journeySession.passport.completedAt === recommendationSet.traveller?.completedAt &&
    validIds.has(journeySession.activePossibilityId) &&
    validIds.has(journeySession.journeySynopsis.recommendedPossibility.id)
    ? journeySession
    : null;
  const initialActiveId = restored && validIds.has(restored.activePossibilityId) ? restored.activePossibilityId : recommendationSet.possibilities[0]?.id ?? "";
  const [activeId, setActiveId] = useState(initialActiveId);
  const [preferredId, setPreferredId] = useState<string | null>(restored?.preferredPossibilityId && validIds.has(restored.preferredPossibilityId) ? restored.preferredPossibilityId : null);
  const [visitedIds, setVisitedIds] = useState(() => new Set(restored?.visitedPossibilityIds.filter((id) => validIds.has(id)) ?? []));
  const [handoffConsent, setHandoffConsent] = useState(restored?.handoffConsent ?? false);
  const [callbackPreference, setCallbackPreference] = useState(() => {
    const candidate = restored?.callbackPreference;
    return candidate && isValidCallbackDate(candidate.preferredDate) && isCallbackTimeWindow(candidate.preferredTimeWindow) ? candidate : null;
  });
  const callbackPreferenceRequiresReselection = Boolean(
    restored?.callbackPreference &&
      (!isValidCallbackDate(restored.callbackPreference.preferredDate) ||
        !isCallbackTimeWindow(restored.callbackPreference.preferredTimeWindow)),
  );
  const [activeAnnouncement, setActiveAnnouncement] = useState("");
  const possibilitiesRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsHeadingRef = useRef<HTMLHeadingElement>(null);

  const activePossibility =
    recommendationSet.possibilities.find((possibility) => possibility.id === activeId) ??
    recommendationSet.possibilities[0];

  useEffect(() => {
    if (!recommendationSet.traveller || !activeId) return;
    if (restored && restored.activePossibilityId === activeId && restored.preferredPossibilityId === preferredId && restored.visitedPossibilityIds.join("|") === [...visitedIds].join("|") && restored.handoffConsent === handoffConsent && JSON.stringify(restored.callbackPreference) === JSON.stringify(callbackPreference)) return;
    const synopsis = restored?.journeySynopsis ?? createJourneySynopsis(recommendationSet, activeId);
    if (!synopsis) return;
    const active = recommendationSet.possibilities.find((possibility) => possibility.id === activeId);
    const preferred = recommendationSet.possibilities.find((possibility) => possibility.id === preferredId);
    if (!active) return;
    saveJourneySession({ version: 2, passport: recommendationSet.traveller, journeyReference: restored?.journeyReference ?? journeySession?.journeyReference ?? recommendationSet.traveller.journeyReference ?? createJourneyReference(), journeySynopsis: synopsis, activePossibilityId: activeId, activeRecommendationPersonality: active.personality, preferredPossibilityId: preferredId, selectedRecommendationPersonality: preferred?.personality ?? null, visitedPossibilityIds: [...visitedIds], handoffConsent, callbackPreference });
  }, [activeId, callbackPreference, handoffConsent, journeySession?.journeyReference, preferredId, recommendationSet, restored, saveJourneySession, visitedIds]);

  if (!activePossibility) {
    return (
      <UnavailableJourneyDirector
        heading="Your shortlist needs another look."
        message="No journey possibility could be presented safely. A human Journey Director can review your Passport and help you continue."
      />
    );
  }

  function scrollTo(element: HTMLElement | null) {
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function explorePossibility(id: string, moveToStory = true) {
    const nextPossibility = recommendationSet.possibilities.find(
      (possibility) => possibility.id === id,
    );

    setActiveId(id);
    const nextVisited = new Set(visitedIds).add(id);
    setVisitedIds(nextVisited);

    if (nextPossibility && id !== activeId) {
      setActiveAnnouncement(
        `Now exploring ${nextPossibility.destination}, ${nextPossibility.region}. Recommendation details updated.`,
      );
    }

    if (moveToStory) {
      window.requestAnimationFrame(() => {
        detailsHeadingRef.current?.focus({ preventScroll: true });
        scrollTo(detailsRef.current);
      });
    }
  }

  function showPossibilities() {
    possibilitiesRef.current?.focus({ preventScroll: true });
    scrollTo(possibilitiesRef.current);
  }

  return (
    <main className={styles.page}>
      <JourneyDirectorHeader />
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {activeAnnouncement}
      </p>

      <section className={styles.completion} aria-labelledby="journey-complete-heading">
        <div className={styles.completionGlow} aria-hidden="true" />
        <div className={styles.completionInner}>
          <div className={styles.passportStamp} aria-hidden="true">
            <span className={styles.stampCompass}>✦</span>
            <span>Next chapter</span>
          </div>
          <p className={styles.eyebrowLight}>Your Journey Director</p>
          <h1 id="journey-complete-heading">Your story is ready.</h1>
          <p className={styles.completionCopy}>
            Your Journey Passport has carried what matters forward. Now we can look for
            journeys that feel considered, not simply available.
          </p>
          <a className={styles.continueCue} href="#we-heard-you">
            See what we heard <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="we-heard-you" className={styles.reflection} aria-labelledby="reflection-heading">
        <div className={styles.reflectionIntro}>
          <p className={styles.eyebrowLight}>A thoughtful pause</p>
          <h2 id="reflection-heading">We heard more than your answers.</h2>
          <p>{recommendationSet.reflection}</p>
        </div>

        <div className={styles.insightGrid}>
          {recommendationSet.insights.map((insight, index) => (
            <article key={insight.id} className={styles.insightCard}>
              <span aria-hidden="true">0{index + 1}</span>
              <p>{insight.eyebrow}</p>
              <h3>{insight.statement}</h3>
            </article>
          ))}
        </div>

        <div className={styles.confirmationRow}>
          <p>
            <strong>Sounds right?</strong> These are the qualities we carried forward.
          </p>
          <Link href="/journey-passport">Start again with my answers</Link>
        </div>
      </section>

      <section
        className={`${styles.destinationNotice} ${
          recommendationSet.destinationResolution.status === "unserved"
            ? styles.destinationNoticeAlternative
            : ""
        }`}
        aria-labelledby="destination-response-heading"
      >
        <p className={styles.eyebrow}>
          {recommendationSet.destinationResolution.status === "served"
            ? "Your chosen destination"
            : recommendationSet.destinationResolution.status === "unserved"
              ? "A thoughtful alternative"
              : "An open map"}
        </p>
        <h2 id="destination-response-heading">
          {recommendationSet.destinationResolution.status === "served"
            ? `${recommendationSet.destinationResolution.matchedDestination} is part of your story.`
            : recommendationSet.destinationResolution.status === "unserved"
              ? "Your journey still has somewhere beautiful to go."
              : "We followed the feeling, not a pin on the map."}
        </h2>
        <p>{recommendationSet.destinationResolution.message}</p>
      </section>

      {recommendationSet.qualities.length > 0 ? (
        <section className={styles.qualities} aria-labelledby="qualities-heading">
          <div>
            <p className={styles.eyebrow}>What we looked for</p>
            <h2 id="qualities-heading">A journey with the right emotional shape.</h2>
          </div>
          <ul aria-label="Journey matching qualities">
            {recommendationSet.qualities.map((quality) => (
              <li key={quality}>
                <span aria-hidden="true">✓</span>
                {quality}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <JourneyPossibilities
        sectionRef={possibilitiesRef}
        possibilities={recommendationSet.possibilities}
        isPartial={recommendationSet.state === "partial"}
        activeId={activeId}
        preferredId={preferredId}
        visitedIds={visitedIds}
        onExplore={explorePossibility}
      />

      <div ref={detailsRef} className={styles.dynamicStory}>
        {recommendationSet.possibilities.length > 1 ? (
          <PossibilitySwitcher
            possibilities={recommendationSet.possibilities}
            activeId={activeId}
            preferredId={preferredId}
            onSelect={explorePossibility}
          />
        ) : null}

        <WhyThisFits
          headingRef={detailsHeadingRef}
          possibility={activePossibility}
          onBack={showPossibilities}
        />
        {activePossibility.moments.length > 0 ? (
          <ImagineYourJourney possibility={activePossibility} />
        ) : null}
        {visitedIds.has(activePossibility.id) ? (
          <Suspense fallback={<div className={styles.itineraryLoading} role="status">Preparing a suggested journey…</div>}>
            <SuggestedItinerarySection key={activePossibility.id} possibility={activePossibility} />
          </Suspense>
        ) : null}
        <JourneyDirectorHandoff
          possibility={activePossibility}
          canExploreAnother={recommendationSet.possibilities.length > 1}
          isPreferred={preferredId === activePossibility.id}
          preferredPossibility={recommendationSet.possibilities.find(
            (possibility) => possibility.id === preferredId,
          )}
          journeyReference={restored?.journeyReference ?? journeySession?.journeyReference ?? recommendationSet.traveller?.journeyReference}
          journeySynopsis={restored?.journeySynopsis ?? journeySession?.journeySynopsis}
          travellerName={recommendationSet.traveller?.name}
          travellerMobile={recommendationSet.traveller?.mobile}
          handoffConsent={handoffConsent}
          callbackPreference={callbackPreference}
          callbackPreferenceRequiresReselection={callbackPreferenceRequiresReselection}
          onTogglePreference={() => { const nextPreferred = preferredId === activePossibility.id ? null : activePossibility.id; setPreferredId(nextPreferred); }}
          onExploreAnother={showPossibilities}
          onConsentChange={setHandoffConsent}
          onCallbackPreferenceChange={setCallbackPreference}
        />
      </div>
    </main>
  );
}

function JourneyDirectorHeader() {
  return (
    <header className={styles.header}>
      <SiteBrand variant="compact" surface="dark" preload className={styles.logoLink} />
      <p>Journey Director</p>
      <Link href="/">Back to Home</Link>
    </header>
  );
}

type JourneyPossibilitiesProps = {
  sectionRef: React.Ref<HTMLElement>;
  possibilities: JourneyPossibility[];
  isPartial: boolean;
  activeId: string;
  preferredId: string | null;
  visitedIds: Set<string>;
  onExplore: (id: string) => void;
};

function JourneyPossibilities({
  sectionRef,
  possibilities,
  isPartial,
  activeId,
  preferredId,
  visitedIds,
  onExplore,
}: JourneyPossibilitiesProps) {
  const countLabel =
    possibilities.length === 1
      ? "One journey stands out with real clarity."
      : possibilities.length === 2
        ? "Two possibilities feel especially aligned."
        : possibilities.length === 3
          ? "Three journeys stood out from your Passport."
          : `${possibilities.length} considered journeys stood out.`;
  const gridClass =
    possibilities.length === 1
      ? styles.possibilityGridOne
      : possibilities.length === 2
        ? styles.possibilityGridTwo
        : styles.possibilityGridThree;

  return (
    <section
      ref={sectionRef}
      id="journey-possibilities"
      className={styles.possibilities}
      aria-labelledby="possibilities-heading"
      tabIndex={-1}
    >
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Your considered shortlist</p>
        <h2 id="possibilities-heading">{countLabel}</h2>
        {isPartial ? (
          <p>
            This served collection currently contains only the{" "}
            {possibilities.length === 1 ? "possibility" : "possibilities"} shown here. A human
            Journey Director can help broaden the conversation with you.
          </p>
        ) : (
          <p>
            Each one answers the feeling you described in a different way. There is no second-best
            choice here—only the story that speaks most clearly to you.
          </p>
        )}
      </div>

      <div className={`${styles.possibilityGrid} ${gridClass}`}>
        {possibilities.map((possibility, index) => {
          const isActive = possibility.id === activeId;
          const isPreferred = possibility.id === preferredId;
          const isVisited = visitedIds.has(possibility.id);

          return (
            <article
              key={possibility.id}
              className={`${styles.possibilityCard} ${
                index === 0 ? styles.leadingCard : styles.supportingCard
              } ${isActive ? styles.activeCard : ""}`}
            >
              <Image
                src={possibility.heroImage}
                alt={possibility.heroImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className={styles.cardImage}
                style={{ objectPosition: possibility.heroImagePosition }}
                priority={index === 0}
              />
              <div className={styles.cardOverlay} aria-hidden="true" />
              <div className={styles.cardTopline}>
                <span>{possibilityEditorialLabel(possibility)}</span>
                {isPreferred ? <strong>Your choice</strong> : isVisited ? <em>Explored</em> : null}
              </div>
              <div className={styles.cardContent}>
                <p>{possibility.personalityDescription}</p>
                <h3>{possibility.destination}</h3>
                <h4>{possibility.region}</h4>
                <p>{possibility.summary}</p>
                <button
                  type="button"
                  aria-label={`Explore ${possibility.destination}, ${possibility.region}`}
                  aria-pressed={isActive}
                  onClick={() => onExplore(possibility.id)}
                >
                  {isActive && isVisited ? "Return to This Journey" : "Explore This Journey"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PossibilitySwitcher({
  possibilities,
  activeId,
  preferredId,
  onSelect,
}: {
  possibilities: JourneyPossibility[];
  activeId: string;
  preferredId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className={styles.switcher} aria-label="Explore journey possibilities">
      <p>Now exploring</p>
      <div>
        {possibilities.map((possibility) => (
          <button
            key={possibility.id}
            type="button"
            aria-pressed={activeId === possibility.id}
            onClick={() => onSelect(possibility.id)}
          >
            <span>{possibility.destination}</span>
            <small>{possibility.region}</small>
            {preferredId === possibility.id ? <strong>Feels right</strong> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

function possibilityEditorialLabel(possibility: JourneyPossibility) {
  return possibility.personalityLabel;
}

function WhyThisFits({
  headingRef,
  possibility,
  onBack,
}: {
  headingRef: React.Ref<HTMLHeadingElement>;
  possibility: JourneyPossibility;
  onBack: () => void;
}) {
  return (
    <section className={styles.whySection} aria-labelledby="why-this-fits-heading">
      <div className={styles.whyHero}>
        <Image
          key={possibility.heroImage}
          src={possibility.heroImage}
          alt={possibility.heroImageAlt}
          fill
          loading="eager"
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.whyImage}
          style={{ objectPosition: possibility.heroImagePosition }}
        />
        <div className={styles.whyImageOverlay} aria-hidden="true" />
        <div className={styles.whyDestination}>
          <p>{possibilityEditorialLabel(possibility)}</p>
          <p className={styles.whyDestinationTitle}>{possibility.destination}</p>
          <span>{possibility.region}</span>
        </div>
      </div>

      <div className={styles.whyContent}>
        <button type="button" onClick={onBack} className={styles.textButton}>
          ← Back to journey possibilities
        </button>
        <p className={styles.eyebrow}>Why this fits you</p>
        <h2
          ref={headingRef}
          id="why-this-fits-heading"
          className={styles.detailHeading}
          tabIndex={-1}
        >
          {possibility.destination} reflects the feeling behind your journey.
        </h2>
        <p className={styles.whyLead}>{possibility.summary}</p>

        {possibility.reasons.length > 0 ? (
          <div className={styles.reasonGrid}>
            {possibility.reasons.map((reason) => (
              <article key={reason.id}>
                <span aria-hidden="true">{reason.cue}</span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className={styles.journeyProfile}>
          <div className={styles.profileHeading}>
            <p className={styles.eyebrow}>How this journey could unfold</p>
            <h3>A practical shape for the story.</h3>
          </div>
          <div className={styles.profileItem}>
            <h4>Experiences you’ll enjoy</h4>
            <ul className={styles.experienceList}>
              {possibility.experiences.map((experience) => (
                <li key={experience}>{experience}</li>
              ))}
            </ul>
          </div>
          <div className={styles.profileItem}>
            <h4>Recommended travel style</h4>
            <p>{possibility.recommendedTravelStyle}</p>
          </div>
          {possibility.recommendedSeason ? (
            <div className={styles.profileItem}>
              <h4>Recommended season</h4>
              <p>{possibility.recommendedSeason}</p>
            </div>
          ) : null}
          <p className={styles.confidenceNote}>{possibility.confidenceNote}</p>
        </div>

        {possibility.cautions.length > 0 ? (
          <aside className={styles.cautionList} aria-label="Planning considerations">
            <p className={styles.eyebrow}>Worth considering</p>
            <ul>
              {possibility.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function ImagineYourJourney({ possibility }: { possibility: JourneyPossibility }) {
  const momentClass =
    possibility.moments.length === 1
      ? styles.momentGridOne
      : possibility.moments.length === 2
        ? styles.momentGridTwo
        : possibility.moments.length === 3
          ? styles.momentGridThree
          : styles.momentGridMany;

  return (
    <section className={styles.imagineSection} aria-labelledby="imagine-heading">
      <div className={styles.sectionHeadingLeft}>
        <p className={styles.eyebrow}>Imagine your journey</p>
        <h2 id="imagine-heading">Not an itinerary. A glimpse of what it could feel like.</h2>
        <p>
          These are not promises or a fixed plan. They are moments your Journey Director could
          thoughtfully shape around you in {possibility.region}.
        </p>
      </div>

      <div className={`${styles.momentGrid} ${momentClass}`}>
        {possibility.moments.map((moment, index) => (
          <article key={moment.id} className={index === 0 ? styles.featuredMoment : ""}>
            <Image
              key={`${possibility.id}-${moment.id}`}
              src={moment.image}
              alt={moment.imageAlt}
              fill
              sizes={
                index === 0
                  ? "(max-width: 768px) 100vw, 58vw"
                  : "(max-width: 768px) 100vw, 28vw"
              }
              className={styles.momentImage}
              style={{ objectPosition: moment.imagePosition }}
            />
            <div className={styles.momentOverlay} aria-hidden="true" />
            <div>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function JourneyDirectorHandoff({
  possibility,
  canExploreAnother,
  isPreferred,
  preferredPossibility,
  journeyReference,
  journeySynopsis,
  travellerName,
  travellerMobile,
  handoffConsent,
  callbackPreference,
  callbackPreferenceRequiresReselection,
  onTogglePreference,
  onExploreAnother,
  onConsentChange,
  onCallbackPreferenceChange,
}: {
  possibility: JourneyPossibility;
  canExploreAnother: boolean;
  isPreferred: boolean;
  preferredPossibility?: JourneyPossibility;
  journeyReference?: string;
  journeySynopsis?: JourneySessionSnapshot["journeySynopsis"];
  travellerName?: string;
  travellerMobile?: string;
  handoffConsent: boolean;
  callbackPreference: JourneySessionSnapshot["callbackPreference"];
  callbackPreferenceRequiresReselection: boolean;
  onTogglePreference: () => void;
  onExploreAnother: () => void;
  onConsentChange: (consent: boolean) => void;
  onCallbackPreferenceChange: (preference: JourneySessionSnapshot["callbackPreference"]) => void;
}) {
  const selectedPossibility = isPreferred ? possibility : preferredPossibility;
  const canContinue = Boolean(selectedPossibility && journeyReference && journeySynopsis && handoffConsent);
  const today = currentLocalDate();
  const [callbackDateError, setCallbackDateError] = useState(() => {
    if (callbackPreferenceRequiresReselection) {
      return "Your previously saved callback preference is no longer available. Please choose a new date and time.";
    }
    return callbackPreference ? callbackDateValidationMessage(callbackPreference.preferredDate, today) : "";
  });
  const callbackReady = Boolean(callbackPreference?.preferredDate && callbackPreference?.preferredTimeWindow && !callbackDateError);
  const [callbackNotice, setCallbackNotice] = useState<"idle" | "saving" | "notified" | "notification-failed" | "storage-failed">("idle");

  function updateCallbackDate(preferredDate: string) {
    const error = callbackDateValidationMessage(preferredDate, today);
    if (error) {
      setCallbackDateError(error);
      setCallbackNotice("idle");
      return;
    }
    setCallbackDateError("");
    onCallbackPreferenceChange({ preferredDate, preferredTimeWindow: callbackPreference?.preferredTimeWindow ?? "" });
    setCallbackNotice("idle");
  }

  async function saveCallbackPreference() {
    if (!journeyReference || !travellerName || !travellerMobile || !callbackPreference || !callbackReady || !canContinue) return;
    setCallbackNotice("saving");
    try {
      const status = await submitJourneyCallbackPreference({
        passportReference: journeyReference,
        guestName: travellerName,
        mobileNumber: travellerMobile,
        preferredDate: callbackPreference.preferredDate,
        preferredTimeWindow: callbackPreference.preferredTimeWindow,
        additionalComments: "",
      });
      setCallbackNotice(status === "sent" || status === "duplicate" ? "notified" : "notification-failed");
    } catch {
      setCallbackNotice("storage-failed");
    }
  }

  function continueOnWhatsApp() {
    if (!selectedPossibility || !journeyReference || !journeySynopsis || !handoffConsent) return;
    const message = [
      "Hello Search My Vacation,",
      "",
      `I’m ${journeySynopsis.travellerFirstName}, and I’m ready to continue planning my journey.`,
      `Journey Reference: ${journeyReference}`,
      `Travelling: ${journeySynopsis.travellingParty} · ${journeySynopsis.travelTiming}`,
      ...(journeySynopsis.knownDestination ? [`Starting point shared: ${journeySynopsis.knownDestination}`] : []),
      `Selected journey: ${selectedPossibility.destination}, ${selectedPossibility.region}`,
      `Recommendation: ${selectedPossibility.personalityLabel}`,
      `What matters to me: ${journeySynopsis.journeyIntent}`,
      ...(journeySynopsis.preferredPace !== "to-be-discussed" ? [`Preferred pace: ${journeySynopsis.preferredPace}`] : []),
      ...(journeySynopsis.preferredComfort !== "to-be-discussed" ? [`Preferred comfort: ${journeySynopsis.preferredComfort}`] : []),
      ...(journeySynopsis.recommendedPossibility.whyThisFits[0] ? [`Why this fits: ${journeySynopsis.recommendedPossibility.whyThisFits[0]}`] : []),
      "",
      "Please help me continue the conversation with my Journey Designer.",
    ].join("\n");
    void recordJourneyPassportEvent(journeyReference, "whatsapp_handoff_opened");
    window.location.assign(`${siteContact.whatsappHref}?text=${encodeURIComponent(message)}`);
  }

  return (
    <section className={styles.handoff} aria-labelledby="handoff-heading">
      <div className={styles.handoffGlow} aria-hidden="true" />
      <div className={styles.handoffInner}>
        <p className={styles.eyebrowLight}>The human part begins here</p>
        <h2 id="handoff-heading">{selectedPossibility ? "Your journey can continue from here." : possibility.handoffHeadline}</h2>
        <p>{selectedPossibility ? "Your Journey Designer will begin with the story and choice you have already made, then shape the details with you." : possibility.handoffMessage}</p>

        {preferredPossibility && !isPreferred ? (
          <p className={styles.preferredReminder}>
            <strong>{preferredPossibility.destination}</strong> is still marked as the journey that
            feels right. You can keep exploring without losing that choice.
          </p>
        ) : null}

        <div className={styles.handoffActions}>
          <button
            type="button"
            onClick={onTogglePreference}
            className={styles.secondaryAction}
            aria-pressed={isPreferred}
            aria-describedby="preference-note"
          >
            {isPreferred ? "Remove Preference" : "This Feels Right"}
          </button>
          {canExploreAnother ? (
            <button type="button" onClick={onExploreAnother} className={styles.tertiaryAction}>
              Explore Another Journey
            </button>
          ) : null}
        </div>

        {!selectedPossibility ? <p id="preference-note" className={styles.preferenceNote}>Choose the journey that feels right before continuing with a Journey Designer. Nothing is sent automatically.</p> : null}

        {selectedPossibility && journeyReference && journeySynopsis ? (
          <div className={styles.continuationPanel}>
            <div className={styles.summaryGrid}>
              <div><span>Journey Reference</span><strong>{journeyReference}</strong></div>
              <div><span>Selected journey</span><strong>{selectedPossibility.destination}, {selectedPossibility.region}</strong><small>{selectedPossibility.personalityLabel}</small></div>
            </div>
            <div className={styles.synopsis}><p className={styles.eyebrowLight}>Your Journey Synopsis</p><p className={styles.synopsisLead}>A small keepsake of what matters for this journey.</p><p>{journeySynopsis.travellerFirstName}, your Journey Designer will continue with the preferences, timing and possibility captured here.</p><p>{journeySynopsis.journeyIntent}</p><p className={styles.synopsisMeta}>{journeySynopsis.travellingParty} · {journeySynopsis.travelTiming}</p></div>
            <label className={styles.consent}><input type="checkbox" checked={handoffConsent} onChange={(event) => onConsentChange(event.target.checked)} /><span>I agree to share my Journey Synopsis with my Journey Designer so they can continue planning my journey.</span></label>
            <div className={styles.continuationActions}>
              <button type="button" className={styles.primaryAction} onClick={continueOnWhatsApp} disabled={!canContinue}>Continue on WhatsApp <span aria-hidden="true">→</span></button>
              <div className={styles.callbackPanel}>
                <p>Prefer a callback?</p>
                <div className={styles.callbackFields}>
                  <label>Preferred date<input type="date" min={today} value={callbackPreference?.preferredDate ?? ""} aria-invalid={Boolean(callbackDateError)} aria-describedby={callbackDateError ? "journey-callback-date-error" : undefined} onChange={(event) => updateCallbackDate(event.target.value)} />{callbackDateError ? <span id="journey-callback-date-error" className={styles.callbackError}>{callbackDateError}</span> : null}</label>
                  <label>Preferred time window<select value={callbackPreference?.preferredTimeWindow ?? ""} onChange={(event) => { onCallbackPreferenceChange({ preferredDate: callbackPreference?.preferredDate ?? "", preferredTimeWindow: event.target.value }); setCallbackNotice("idle"); }}><option value="">Choose a time</option>{callbackTimeWindows.map((window) => <option key={window} value={window}>{window}</option>)}</select></label>
                </div>
                <button type="button" className={styles.secondaryAction} disabled={!canContinue || !callbackReady || !travellerName || !travellerMobile || callbackNotice === "saving"} onClick={saveCallbackPreference}>{callbackNotice === "saving" ? "Saving Callback Preference…" : "Save Callback Preference"}</button>
                {callbackNotice === "notified" ? <p className={styles.honestNotice} role="status">Your callback preference has been saved. Our travel team has been notified and will try to contact you during your preferred time whenever possible.</p> : callbackNotice === "notification-failed" ? <p className={styles.honestNotice} role="status">Your callback preference has been saved successfully. We couldn&apos;t notify our team just now, but your request has been securely recorded and will be processed shortly.</p> : callbackNotice === "storage-failed" ? <p className={styles.honestNotice} role="status">We couldn&apos;t securely record your callback preference just now. Your journey is still here—please try saving it again.</p> : <p className={styles.preferenceNote}>{callbackNotice === "saving" ? "Securely adding this request to your existing Journey Passport…" : "Your callback preference can be sent after you agree to share your Journey Synopsis."}</p>}
              </div>
            </div>
          </div>
        ) : null}

        <Link href="/" className={styles.homeLink}>
          Return home
        </Link>
      </div>
    </section>
  );
}
