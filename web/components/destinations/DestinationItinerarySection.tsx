"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SuggestedItineraryContent, SuggestedItineraryFallback } from "@/components/journey-director/SuggestedItinerarySection";
import { getItinerariesForDestination, publicItineraryLabel, resolveDestinationItinerarySelection } from "@/lib/journey-itineraries";

import styles from "./DestinationItinerarySection.module.css";

const MULTI_COPY = "Choose a starting journey below. Every Search My Vacation experience can be shaped around your pace, dates, interests, companions, and comfort preferences.";
const SINGLE_COPY = "This is one thoughtful way to experience this destination. Every Search My Vacation journey can be adapted around your dates, pace, companions, interests, and comfort preferences.";

export default function DestinationItinerarySection({ destinationId, destinationName, onItineraryChange }: { destinationId: string; destinationName: string; onItineraryChange?: () => void }) {
  const lookup = useMemo(() => ({ destinationId, destinationName }), [destinationId, destinationName]);
  const itineraries = useMemo(() => getItinerariesForDestination(lookup), [lookup]);
  const [selection, setSelection] = useState(() => resolveDestinationItinerarySelection({ previous: undefined, destinationId, lookup, itineraries }));
  const selected = itineraries.find((itinerary) => itinerary.id === selection.itineraryId) ?? itineraries[0];
  const multiple = itineraries.length > 1;

  useEffect(() => {
    if (!selected && process.env.NODE_ENV !== "production") console.warn("No governed public destination itinerary mapping was found.", { destinationId, destinationName });
  }, [destinationId, destinationName, selected]);

  function selectItinerary(itineraryId: string) {
    setSelection((previous) => resolveDestinationItinerarySelection({ previous, destinationId, requestedItineraryId: itineraryId, lookup, itineraries }));
    onItineraryChange?.();
  }

  if (!selected) {
    return (
      <div className={styles.shell}>
        <SuggestedItineraryFallback mode="destination" id={destinationId} heading="A journey many travellers love" firstParagraph="A personalised day-by-day journey will be shaped around this destination." secondParagraph="Our team will adapt the experience to your dates, pace, interests, companions, and comfort preferences." />
        <PlanningCta />
      </div>
    );
  }

  return (
    <div className={styles.shell} data-destination-itinerary-count={itineraries.length}>
      {multiple ? (
        <div className={styles.selectorHeader}>
          <p className={styles.eyebrow}>Thoughtful ways to begin</p>
          <h2>Explore journeys in {destinationName}</h2>
          <p>{MULTI_COPY}</p>
          <div className={styles.chips} aria-label={`Suggested journeys in ${destinationName}`}>
            {itineraries.map((itinerary) => <button key={itinerary.id} type="button" aria-pressed={selected.id === itinerary.id} onClick={() => selectItinerary(itinerary.id)}>{publicItineraryLabel(itinerary)}</button>)}
          </div>
          <div className={styles.mobileSelect}>
            <label htmlFor={`destination-itinerary-choice-${destinationId}`}>Choose a suggested journey</label>
            <select id={`destination-itinerary-choice-${destinationId}`} value={selected.id} onChange={(event) => selectItinerary(event.target.value)}>
              {itineraries.map((itinerary) => <option key={itinerary.id} value={itinerary.id}>{publicItineraryLabel(itinerary)}</option>)}
            </select>
          </div>
          <p className={styles.announcement} aria-live="polite">Showing {publicItineraryLabel(selected)}</p>
        </div>
      ) : null}
      <SuggestedItineraryContent key={selected.id} mode="destination" itinerary={selected} heading={multiple ? publicItineraryLabel(selected) : "A journey many travellers love"} eyebrow={multiple ? "Your selected starting journey" : destinationName} startingPointCopy={multiple ? undefined : SINGLE_COPY} routeTitle={publicItineraryLabel(selected)} />
      <PlanningCta />
    </div>
  );
}

function PlanningCta() {
  return <div className={styles.ctaRow}><Link href="/journey-passport" className={styles.cta}>Shape This Journey Around Me <span aria-hidden="true">→</span></Link></div>;
}
