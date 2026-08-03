"use client";

import { useEffect, useMemo, useState } from "react";

import { findBestItineraryForRecommendation } from "@/lib/journey-itineraries";
import type { SuggestedItinerary } from "@/lib/journey-itineraries";
import type { JourneyPossibility } from "@/types/journey-director";

import styles from "./JourneyDirectorExperience.module.css";

const STARTING_POINT_COPY = "This is a thoughtful starting point based on the journey you described. Every Search My Vacation experience can be adapted around your pace, dates, interests, companions, and comfort preferences.";

export default function SuggestedItinerarySection({ possibility }: { possibility: JourneyPossibility }) {
  const match = useMemo(() => findBestItineraryForRecommendation({
    destinationId: possibility.candidateId,
    regionId: possibility.regionId,
    destinationName: possibility.destination,
    regionName: possibility.region,
    primaryDream: possibility.summary,
    styles: [...possibility.experiences, possibility.recommendedTravelStyle],
    timing: possibility.recommendedSeason,
  }), [possibility]);
  const itinerary = match.itinerary;

  useEffect(() => {
    if (!itinerary && process.env.NODE_ENV !== "production") {
      console.warn("No governed suggested itinerary mapping was found.", { candidateId: possibility.candidateId, regionId: possibility.regionId });
    }
  }, [itinerary, possibility.candidateId, possibility.regionId]);

  if (!itinerary) {
    return <SuggestedItineraryFallback mode="journey-director" id={possibility.id} heading="One way your journey could unfold" firstParagraph="A personalised day-by-day journey will be shaped around this possibility." secondParagraph="Your Journey Director recommendation is ready, and our team will adapt the experience to your dates, pace, companions, and comfort preferences." />;
  }

  return <SuggestedItineraryContent mode="journey-director" itinerary={itinerary} heading="One way your journey could unfold" eyebrow="A starting point, shaped with you" startingPointCopy={STARTING_POINT_COPY} />;
}

export function SuggestedItineraryContent({ mode, itinerary, heading, eyebrow, startingPointCopy, routeTitle = itinerary.summary.title }: { mode: "journey-director" | "destination"; itinerary: SuggestedItinerary; heading: string; eyebrow: string; startingPointCopy?: string; routeTitle?: string }) {
  const [expanded, setExpanded] = useState(false);
  const headingId = `${mode}-suggested-itinerary-${itinerary.id}`;
  const expandableId = `${mode}-complete-itinerary-${itinerary.id}`;
  const visibleDays = itinerary.days.slice(0, 3);
  const remainingDays = itinerary.days.slice(3);

  return (
    <section className={`${styles.itinerarySection} ${mode === "destination" ? styles.itinerarySectionDestination : ""}`} aria-labelledby={headingId} data-itinerary-mode={mode}>
      <div className={styles.itineraryIntro}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId}>{heading}</h2>
          <p className={styles.itineraryRoute}>{routeTitle}</p>
        </div>
        <div className={styles.itineraryDuration} aria-label={`Suggested duration: ${itinerary.summary.suggestedDuration.display}`}>
          <span>Suggested duration</span>
          <strong>{itinerary.summary.suggestedDuration.display}</strong>
        </div>
      </div>

      {startingPointCopy ? <p className={styles.itineraryStartingPoint}>{startingPointCopy}</p> : null}
      {itinerary.summary.introduction ? <p className={styles.itinerarySummary}>{itinerary.summary.introduction}</p> : null}

      <div className={styles.itineraryHighlights}>
        <h3>Journey highlights</h3>
        <ul>{itinerary.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      </div>

      <div className={styles.itineraryDays}>
        <div className={styles.itinerarySubheading}>
          <p className={styles.eyebrow}>Day by day</p>
          <h3>A gentle outline for the journey</h3>
        </div>
        <div className={styles.dayGrid}>
          {visibleDays.map((day) => <ItineraryDay key={day.day} day={day} />)}
        </div>
      </div>

      <div id={expandableId} className={expanded ? styles.itineraryExpanded : styles.itineraryCollapsed} aria-hidden={!expanded}>
        {remainingDays.length ? <div className={styles.dayGrid}>{remainingDays.map((day) => <ItineraryDay key={day.day} day={day} />)}</div> : null}
        <div className={styles.itineraryDetailGrid}>
          <ItineraryList title="Optional experiences" items={itinerary.optionalExperiences} />
          <ItineraryList title="Ways to make it yours" items={itinerary.customisationIdeas} />
          <ItineraryList title="Important notes" items={itinerary.importantNotes} important />
          <ItineraryList title="Typically included in this starting plan" items={itinerary.normallyIncludes} />
          <ItineraryList title="Usually planned separately" items={itinerary.normallyExcludes} />
        </div>
        <p className={styles.inclusionNote}>Final inclusions depend on your chosen hotels, transport, dates, and personalised quotation.</p>
      </div>

      <button
        type="button"
        className={styles.itineraryToggle}
        aria-expanded={expanded}
        aria-controls={expandableId}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Show the shorter view" : "View the complete suggested journey"}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
    </section>
  );
}

export function SuggestedItineraryFallback({ mode, id, heading, firstParagraph, secondParagraph }: { mode: "journey-director" | "destination"; id: string; heading: string; firstParagraph: string; secondParagraph: string }) {
  const headingId = `${mode}-suggested-itinerary-${id}`;
  return (
    <section className={`${styles.itineraryFallback} ${mode === "destination" ? styles.itineraryFallbackDestination : ""}`} aria-labelledby={headingId} data-itinerary-mode={mode}>
      <p className={styles.eyebrow}>A starting point, shaped with you</p>
      <h2 id={headingId}>{heading}</h2>
      <p>{firstParagraph}</p>
      <p>{secondParagraph}</p>
    </section>
  );
}

function ItineraryDay({ day }: { day: SuggestedItinerary["days"][number] }) {
  return (
    <article className={styles.dayCard}>
      <p>Day {day.day}</p>
      <h4>Day {day.day}: {day.overnightStay}</h4>
      <p>{day.suggestedExperience}</p>
      {day.meals ? <p className={styles.dayMeta}><strong>Meals:</strong> {day.meals}</p> : null}
      {day.notes ? <p className={styles.dayNote}><strong>Good to know:</strong> {day.notes}</p> : null}
    </article>
  );
}

function ItineraryList({ title, items, important = false }: { title: string; items: string[]; important?: boolean }) {
  if (!items.length) return null;
  return (
    <section className={important ? styles.itineraryImportant : styles.itineraryList}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
