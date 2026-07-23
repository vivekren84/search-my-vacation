"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { useJourneySession } from "@/context/JourneySessionContext";
import { createJourneyRecommendationSet } from "@/lib/journey-director";
import type {
  JourneyPassportSnapshot,
  JourneyPossibility,
  JourneyRecommendationSet,
} from "@/types/journey-director";

import styles from "./JourneyDirectorExperience.module.css";

export default function JourneyDirectorExperience() {
  const { passport, isHydrated } = useJourneySession();

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

  return <JourneyRecommendationBoundary passport={passport} />;
}

type RecommendationCreation =
  | { status: "ready"; recommendationSet: JourneyRecommendationSet }
  | { status: "failed" };

function JourneyRecommendationBoundary({ passport }: { passport: JourneyPassportSnapshot }) {
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
      return <JourneyDirectorContent recommendationSet={creation.recommendationSet} />;
    case "partial":
      return <JourneyDirectorContent recommendationSet={creation.recommendationSet} />;
    case "insufficient":
      return (
        <InsufficientJourneyDirector
          message={creation.recommendationSet.recoveryMessage}
        />
      );
    case "unavailable":
      return (
        <UnavailableJourneyDirector
          heading="Your Journey Director needs another way forward."
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
}: {
  recommendationSet: JourneyRecommendationSet;
}) {
  const [activeId, setActiveId] = useState(recommendationSet.possibilities[0]?.id ?? "");
  const [preferredId, setPreferredId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState(() => new Set<string>());
  const [handoffNotice, setHandoffNotice] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState("");
  const possibilitiesRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsHeadingRef = useRef<HTMLHeadingElement>(null);

  const activePossibility =
    recommendationSet.possibilities.find((possibility) => possibility.id === activeId) ??
    recommendationSet.possibilities[0];

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
    setVisitedIds((current) => new Set(current).add(id));
    setHandoffNotice(false);

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
            <span>Story received</span>
          </div>
          <p className={styles.eyebrowLight}>Your Journey Director</p>
          <h1 id="journey-complete-heading">Your story has been received.</h1>
          <p className={styles.completionCopy}>
            We have taken a moment to understand what matters most to you—and to look for
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
        <JourneyDirectorHandoff
          possibility={activePossibility}
          canExploreAnother={recommendationSet.possibilities.length > 1}
          isPreferred={preferredId === activePossibility.id}
          preferredPossibility={recommendationSet.possibilities.find(
            (possibility) => possibility.id === preferredId,
          )}
          handoffNotice={handoffNotice}
          onTogglePreference={() =>
            setPreferredId((current) =>
              current === activePossibility.id ? null : activePossibility.id,
            )
          }
          onExploreAnother={showPossibilities}
          onHandoff={() => setHandoffNotice(true)}
        />
      </div>
    </main>
  );
}

function JourneyDirectorHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Search My Vacation home" className={styles.logoLink}>
        <Image
          src="/logos/smv-logo.png"
          alt="Search My Vacation"
          width={78}
          height={70}
          priority
        />
      </Link>
      <p>Journey Director</p>
      <Link href="/journey-passport">Back to Journey Passport</Link>
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
            We are showing only the {possibilities.length === 1 ? "possibility" : "possibilities"}{" "}
            that met our confidence standard. A human Journey Director can help refine the
            shortlist with you.
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
  return possibility.personality === "perfect-match"
    ? "First to explore"
    : possibility.personalityLabel;
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
  handoffNotice,
  onTogglePreference,
  onExploreAnother,
  onHandoff,
}: {
  possibility: JourneyPossibility;
  canExploreAnother: boolean;
  isPreferred: boolean;
  preferredPossibility?: JourneyPossibility;
  handoffNotice: boolean;
  onTogglePreference: () => void;
  onExploreAnother: () => void;
  onHandoff: () => void;
}) {
  return (
    <section className={styles.handoff} aria-labelledby="handoff-heading">
      <div className={styles.handoffGlow} aria-hidden="true" />
      <div className={styles.handoffInner}>
        <p className={styles.eyebrowLight}>The human part begins here</p>
        <h2 id="handoff-heading">{possibility.handoffHeadline}</h2>
        <p>{possibility.handoffMessage}</p>

        {preferredPossibility && !isPreferred ? (
          <p className={styles.preferredReminder}>
            <strong>{preferredPossibility.destination}</strong> is still marked as the journey that
            feels right. You can keep exploring without losing that choice.
          </p>
        ) : null}

        <div className={styles.handoffActions}>
          <button type="button" onClick={onHandoff} className={styles.primaryAction}>
            How a Journey Director can help <span aria-hidden="true">→</span>
          </button>
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

        <p id="preference-note" className={styles.preferenceNote}>
          Your preference stays on this page and is not sent anywhere automatically.
        </p>

        {handoffNotice ? (
          <p className={styles.honestNotice} role="status">
            A human Journey Director can refine the region, pace, stays, and experiences with you.
            Nothing has been sent yet—this is simply guidance for your next conversation.
          </p>
        ) : null}

        <Link href="/" className={styles.homeLink}>
          Return home
        </Link>
      </div>
    </section>
  );
}
