"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  MONTH_DISCOVERY_CATALOG,
  getMonthDiscovery,
  getVisaLeadTime,
} from "@/config/seasonal-discovery.config";
import { getTripAnchorForDestination } from "@/config/trip-anchors.config";
import { getComfortSignalsForDestination } from "@/config/comfort-signals.config";

import styles from "./SeasonalDiscoverySection.module.css";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDestinationName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function SeasonalDiscoverySection() {
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    // Default to current month or October (peak travel)
    const current = new Date().getMonth() + 1;
    return current >= 1 && current <= 12 ? current : 10;
  });

  const discovery = useMemo(() => getMonthDiscovery(selectedMonth) ?? MONTH_DISCOVERY_CATALOG[9], [selectedMonth]);

  return (
    <section className={styles.section} data-testid="seasonal-discovery-section" aria-label="Travel by Month and Season">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Travel by Window & Season</p>
          <h2 className={styles.title}>When are you thinking of pausing?</h2>
          <p className={styles.subtitle}>
            Explore destinations in their most thoughtful season. Pick a calendar month to discover recommended rhythms, weather highlights, and visa timelines.
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className={styles.monthScroller} role="tablist" aria-label="Choose a travel month">
          {MONTH_NAMES.map((name, index) => {
            const monthNum = index + 1;
            const isSelected = selectedMonth === monthNum;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`seasonal-panel-${monthNum}`}
                id={`seasonal-tab-${monthNum}`}
                onClick={() => setSelectedMonth(monthNum)}
                className={`${styles.monthButton} ${isSelected ? styles.monthButtonActive : ""}`}
              >
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Seasonal Spotlight Panel */}
        <div
          id={`seasonal-panel-${selectedMonth}`}
          role="tabpanel"
          aria-labelledby={`seasonal-tab-${selectedMonth}`}
          className={styles.spotlightCard}
          data-testid="seasonal-spotlight-panel"
        >
          <div className={styles.spotlightHeader}>
            <div className={styles.badgeRow}>
              <span className={styles.seasonBadge}>{discovery.season}</span>
              <span className={styles.monthBadge}>{discovery.name}</span>
            </div>
            <h3 className={styles.spotlightHeadline}>{discovery.themeTitle}</h3>
            <p className={styles.editorialLead}>{discovery.editorialHeadline}</p>
            <p className={styles.editorialNote}>{discovery.editorialHighlight}</p>
          </div>

          <div className={styles.columnsGrid}>
            {/* Domestic Recommendations */}
            <div className={styles.destinationColumn}>
              <h4 className={styles.columnHeading}>Domestic Sanctuaries ({discovery.name})</h4>
              <div className={styles.cardsList}>
                {discovery.domesticDestinations.map((destId) => {
                  const anchor = getTripAnchorForDestination(destId);
                  const comfort = getComfortSignalsForDestination(destId);
                  const name = formatDestinationName(destId);

                  return (
                    <div key={destId} className={styles.destinationCard} data-testid={`seasonal-dest-${destId}`}>
                      <div className={styles.cardHeader}>
                        <h5 className={styles.destName}>{name}</h5>
                        <span className={styles.destDuration}>{anchor.duration}</span>
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.metaPill}>Pace: {anchor.pace}</span>
                        <span className={styles.metaPill}>Tier: {anchor.comfortTier}</span>
                      </div>
                      {comfort.length > 0 ? (
                        <div className={styles.comfortSignalsRow}>
                          {comfort.slice(0, 2).map((c) => (
                            <span key={c.id} className={styles.signalPill} title={c.description}>
                              <span aria-hidden="true">{c.icon}</span> {c.shortTag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <Link
                        href={`/journey-passport?destination=${encodeURIComponent(destId)}&timing=${encodeURIComponent(discovery.name)}`}
                        className={styles.planLink}
                      >
                        Shape a {discovery.name} journey to {name} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* International Recommendations with Visa Lead-Time Cues */}
            <div className={styles.destinationColumn}>
              <h4 className={styles.columnHeading}>International Horizons & Visa Readiness</h4>
              <div className={styles.cardsList}>
                {discovery.internationalDestinations.map((destId) => {
                  const anchor = getTripAnchorForDestination(destId);
                  const visa = getVisaLeadTime(destId);
                  const name = formatDestinationName(destId);

                  return (
                    <div key={destId} className={styles.destinationCard} data-testid={`seasonal-dest-${destId}`}>
                      <div className={styles.cardHeader}>
                        <h5 className={styles.destName}>{name}</h5>
                        <span className={styles.destDuration}>{anchor.duration}</span>
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.metaPill}>Pace: {anchor.pace}</span>
                        {visa ? (
                          <span className={styles.visaPill} title={visa.advisoryNote}>
                            <span aria-hidden="true">🛂</span> {visa.visaCategory}
                          </span>
                        ) : null}
                      </div>
                      {visa ? (
                        <p className={styles.visaNote}>
                          {visa.leadTimeDays === 0
                            ? "No advance visa needed for Indian passports."
                            : `${visa.leadTimeDays} days recommended visa application buffer.`}
                        </p>
                      ) : null}
                      <Link
                        href={`/journey-passport?destination=${encodeURIComponent(destId)}&timing=${encodeURIComponent(discovery.name)}`}
                        className={styles.planLink}
                      >
                        Shape a {discovery.name} journey to {name} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
