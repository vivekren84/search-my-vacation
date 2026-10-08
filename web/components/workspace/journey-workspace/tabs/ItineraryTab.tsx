"use client";

// EBC-R1.3-WS13-025 Phase 1 Milestone B (WP-1.7): JW-03 Itinerary, a
// read-only render of the accepted Proposal Version's snapshot (UX Rev 4a
// §8.3; DEC-R1.3-014; FR-JW-06). The snapshot is stored as JSON and
// validated by Journey Planning, so it is read defensively here.
// Phase 1 (020B "no dead ends"): the Rev 4a note's sentence about Activity
// & Changes and the "Record an operational change" / "Material change…"
// routes are not shown — those arrive in Phases 2 and 4.

import Link from "next/link";
import { useEffect, useState } from "react";

import EmptyState from "@/components/workspace/shared/EmptyState";
import type { JourneyDetail, JourneyItinerary } from "@/lib/workspace/journey-workspace/types";

import { callJourneyApi } from "../journeyApi";
import { formatDate, formatDateRange, pluralise } from "../journeyWorkspaceLabels";
import { CARD, SECTION_TITLE, Skeleton } from "../primitives";

interface Stop {
  name: string;
  nights: number | null;
  notes: string | null;
}

interface ParsedSnapshot {
  stops: Stop[];
  startDate: string | null;
  endDate: string | null;
  travellerCount: number | null;
  price: { amount: number; currency: string } | null;
  inclusions: string[];
  notes: string | null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parseSnapshot(snapshot: Record<string, unknown>): ParsedSnapshot {
  const destinations = Array.isArray(snapshot.destinations) ? snapshot.destinations : [];
  const stops = destinations
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      name: text(item.name) ?? "Unnamed stop",
      nights: typeof item.nights === "number" ? item.nights : null,
      notes: text(item.notes),
    }));
  const price = snapshot.priceEstimate as Record<string, unknown> | null | undefined;
  return {
    stops,
    startDate: text(snapshot.startDate),
    endDate: text(snapshot.endDate),
    travellerCount: typeof snapshot.travellerCount === "number" ? snapshot.travellerCount : null,
    price:
      price && typeof price.amount === "number" && text(price.currency)
        ? { amount: price.amount, currency: text(price.currency) as string }
        : null,
    inclusions: Array.isArray(snapshot.inclusions) ? snapshot.inclusions.map(text).filter((v): v is string => v !== null) : [],
    notes: text(snapshot.notes),
  };
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

type State = { status: "loading" } | { status: "error" } | { status: "ready"; itinerary: JourneyItinerary | null };

export default function ItineraryTab({ detail, planningRecordHref }: { detail: JourneyDetail; planningRecordHref: string | null }) {
  const [retry, setRetry] = useState(0);
  const journeyId = detail.journey.id;
  // Keyed by Journey and retry: a new key shows the loading state without a
  // synchronous setState in the effect (react-hooks/set-state-in-effect).
  const loadKey = `${journeyId}:${retry}`;
  const [loaded, setLoaded] = useState<{ key: string; state: State } | null>(null);
  const state: State = loaded?.key === loadKey ? loaded.state : { status: "loading" };

  useEffect(() => {
    let cancelled = false;
    void callJourneyApi<{ itinerary: JourneyItinerary | null }>(`/api/workspace/journey-workspace/${journeyId}/itinerary`).then((result) => {
      if (!cancelled) setLoaded({ key: loadKey, state: result.ok ? { status: "ready", itinerary: result.data.itinerary } : { status: "error" } });
    });
    return () => {
      cancelled = true;
    };
  }, [journeyId, loadKey]);

  const planningLink = planningRecordHref ? (
    <Link href={planningRecordHref} className="text-sm font-semibold text-[var(--color-espresso)] underline underline-offset-2">
      View planning history ↗
    </Link>
  ) : null;

  if (state.status === "loading") {
    return (
      <div className={`${CARD} flex flex-col gap-3 px-5 py-5`} aria-busy="true">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <p className={`${CARD} px-5 py-4 text-sm text-[var(--color-espresso)]`}>
        Couldn&apos;t load the itinerary.{" "}
        <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setRetry((n) => n + 1)}>
          Try again
        </button>
      </p>
    );
  }
  if (!state.itinerary) {
    return (
      <EmptyState
        title="No accepted itinerary on record."
        description="This Journey has no accepted proposal version, so there is no itinerary to show here."
        action={planningRecordHref ? { label: "View planning history", href: planningRecordHref } : undefined}
      />
    );
  }

  const parsed = parseSnapshot(state.itinerary.snapshot);
  const snapshotDates = formatDateRange(parsed.startDate, parsed.endDate);
  const totalNights = parsed.stops.reduce((sum, stop) => sum + (stop.nights ?? 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className={`${CARD} flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-sm text-[var(--color-espresso)]/80">This is the itinerary the traveller accepted. It never changes.</p>
        {planningLink}
      </div>

      <section className={`${CARD} px-5 py-5`} aria-labelledby="itinerary-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="itinerary-heading" className="font-[var(--font-editorial)] text-lg text-[var(--color-espresso)]">
            Proposal version {state.itinerary.versionNumber}
          </h2>
          <p className="text-xs text-[var(--color-espresso)]/60">Saved {formatDate(state.itinerary.createdAt)}</p>
        </div>
        <p className="mt-1 text-xs text-[var(--color-espresso)]/65">
          {[
            parsed.stops.length > 0 ? pluralise(parsed.stops.length, "stop") : null,
            totalNights > 0 ? pluralise(totalNights, "night") : null,
            parsed.travellerCount !== null ? pluralise(parsed.travellerCount, "traveller") : null,
            snapshotDates,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {parsed.stops.length > 0 ? (
          <ol className="mt-5 flex flex-col" aria-label="Itinerary stops">
            {parsed.stops.map((stop, index) => (
              <li key={`${stop.name}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
                {index < parsed.stops.length - 1 ? (
                  <span aria-hidden="true" className="absolute left-[0.6875rem] top-6 h-[calc(100%-1.25rem)] w-px bg-[var(--color-amber)]/45" />
                ) : null}
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[var(--color-amber)] bg-white text-[0.65rem] font-bold text-[var(--color-espresso)]"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-espresso)]">
                    <span className="sr-only">Stop {index + 1}: </span>
                    {stop.name}
                    {stop.nights !== null ? <span className="font-normal text-[var(--color-espresso)]/65"> · {pluralise(stop.nights, "night")}</span> : null}
                  </p>
                  {stop.notes ? <p className="text-sm text-[var(--color-espresso)]/75">{stop.notes}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-[var(--color-espresso)]/65">No stops were recorded in this version.</p>
        )}
      </section>

      {parsed.inclusions.length > 0 || parsed.price || parsed.notes ? (
        <section className={`${CARD} grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2`} aria-label="Itinerary details">
          {parsed.inclusions.length > 0 ? (
            <div>
              <h3 className={SECTION_TITLE}>Inclusions</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-[var(--color-espresso)]">
                {parsed.inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {parsed.price ? (
            <div>
              <h3 className={SECTION_TITLE}>Price estimate at acceptance</h3>
              <p className="mt-2 text-sm text-[var(--color-espresso)]">{formatMoney(parsed.price.amount, parsed.price.currency)}</p>
            </div>
          ) : null}
          {parsed.notes ? (
            <div className="sm:col-span-2">
              <h3 className={SECTION_TITLE}>Notes</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-[var(--color-espresso)]">{parsed.notes}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
