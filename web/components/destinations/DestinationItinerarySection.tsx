"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SuggestedItineraryContent, SuggestedItineraryFallback } from "@/components/journey-director/SuggestedItinerarySection";
import { getItinerariesForDestination, publicItineraryLabel, resolveDestinationItinerarySelection } from "@/lib/journey-itineraries";
import { getTripAnchorForDestination } from "@/config/trip-anchors.config";
import { getPilotCircuitsForDestination } from "@/lib/journey-director/intelligence/pilotCircuits";
import { getCompanionDestinations } from "@/lib/journey-director/catalogue/companionDestinations";

import styles from "./DestinationItinerarySection.module.css";

const MULTI_COPY = "Choose a starting journey below. Every Search My Vacation experience can be shaped around your pace, dates, interests, companions, and comfort preferences.";
const SINGLE_COPY = "This is one thoughtful way to experience this destination. Every Search My Vacation journey can be adapted around your dates, pace, companions, interests, and comfort preferences.";

export default function DestinationItinerarySection({ destinationId, destinationName, onItineraryChange }: { destinationId: string; destinationName: string; onItineraryChange?: () => void }) {
  const lookup = useMemo(() => ({ destinationId, destinationName }), [destinationId, destinationName]);
  const itineraries = useMemo(() => getItinerariesForDestination(lookup), [lookup]);
  const [selection, setSelection] = useState(() => resolveDestinationItinerarySelection({ previous: undefined, destinationId, lookup, itineraries }));
  const selected = itineraries.find((itinerary) => itinerary.id === selection.itineraryId) ?? itineraries[0];
  const multiple = itineraries.length > 1;

  const tripAnchor = useMemo(() => getTripAnchorForDestination(destinationId), [destinationId]);
  const pilotCircuits = useMemo(() => getPilotCircuitsForDestination(destinationId), [destinationId]);
  const companionDestinations = useMemo(() => getCompanionDestinations(destinationId), [destinationId]);

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
        <PlanningCta destinationId={destinationId} />
      </div>
    );
  }

  return (
    <div className={styles.shell} data-destination-itinerary-count={itineraries.length}>
      {/* Consultative Trip Anchors Banner (PO-02) */}
      <div className={styles.anchorBanner} data-testid="destination-trip-anchors">
        <div className={styles.anchorItem}>
          <span className={styles.anchorLabel}>Typical Duration</span>
          <span className={styles.anchorValue}>{tripAnchor.duration}</span>
        </div>
        <div className={styles.anchorItem}>
          <span className={styles.anchorLabel}>Best Season</span>
          <span className={styles.anchorValue}>{tripAnchor.bestMonths}</span>
        </div>
        <div className={styles.anchorItem}>
          <span className={styles.anchorLabel}>Journey Pace</span>
          <span className={styles.anchorValue}>{tripAnchor.pace}</span>
        </div>
        <div className={styles.anchorItem}>
          <span className={styles.anchorLabel}>Comfort Tier</span>
          <span className={styles.anchorValue}>{tripAnchor.comfortTier}</span>
        </div>
      </div>

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

      {/* Pilot Region Circuits (V-01, V-05) */}
      {pilotCircuits.length > 0 ? (
        <div className={styles.circuitsSection} data-testid="destination-pilot-circuits">
          <p className={styles.eyebrow}>Regional Intelligence & Circuit</p>
          <h3 className={styles.circuitTitle}>{pilotCircuits[0].title}</h3>
          <p className={styles.circuitOverview}>{pilotCircuits[0].overview}</p>
          <div className={styles.circuitMeta}>
            <span><strong>Typical Journey:</strong> {pilotCircuits[0].typicalDays}</span>
            <span><strong>Best Window:</strong> {pilotCircuits[0].bestSeason}</span>
            <span><strong>Rhythm:</strong> {pilotCircuits[0].pace}</span>
          </div>
        </div>
      ) : null}

      {/* Companion Destinations (V-03) */}
      {companionDestinations.length > 0 ? (
        <div className={styles.companionsSection} data-testid="destination-companion-pairings">
          <p className={styles.eyebrow}>Natural Journey Pairings</p>
          <h3 className={styles.companionsHeading}>Complementary Destinations to Pair with {destinationName}</h3>
          <div className={styles.companionsGrid}>
            {companionDestinations.map((comp) => (
              <div key={comp.destinationId} className={styles.companionCard}>
                <div className={styles.companionHeader}>
                  <h4 className={styles.companionTitle}>{comp.title}</h4>
                  <span className={styles.companionRelationship}>{comp.relationship}</span>
                </div>
                <p className={styles.companionRationale}>{comp.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <PlanningCta destinationId={destinationId} />
    </div>
  );
}

function PlanningCta({ destinationId }: { destinationId: string }) {
  return <div className={styles.ctaRow}><Link href={`/journey-passport?destination=${encodeURIComponent(destinationId)}`} className={styles.cta}>Shape This Journey Around Me <span aria-hidden="true">→</span></Link></div>;
}
