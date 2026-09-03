"use client";
/* Debounced search-as-you-type intentionally sets local state directly within the effect that drives it (idle reset, loading, and the async result/failure branches). */
/* eslint-disable react-hooks/set-state-in-effect */

// EBC-R1.2-WS6-09 (Rad, Phase 2). Debounced client-side search against the
// Phase 1 API route, following the same hook-file convention as
// web/hooks/useJourneyPassport.ts ("use client" declared here since this
// is the file that first introduces React state/effects for this feature).
//
// Status semantics: "ready" (the request succeeded — an empty results array
// is a legitimate, successful "no match" outcome) is distinguished from
// "unavailable" (the request itself failed), because the Phase 1 API route
// already returns `{ ok: true, results: [] }` for a genuine no-match versus
// `{ ok: false, ... }` for a failure.
//
// EBC-R1.2-WS6-09 (Rad, Phase 5 — "Search Failure Handling"). Adds the
// refinement Archie's EBC-R1.2-WS6-06 §2 specifies on top of Phase 2's
// success/failure distinction: a bounded outer client-side timeout, and one
// silent automatic retry before surfacing "unavailable" to the traveller.
// Both attempts (initial + retry, if needed) report as "loading" — the
// retry is deliberately invisible to the traveller, per Archie's "absorb a
// genuinely transient blip without the traveller ever seeing it."
//
// Two numeric choices here are this phase's own assumptions, since neither
// is pinned to an exact value in EBC-R1.2-WS6-06 §2 or the WS6-08 Addendum:
//   - REQUEST_TIMEOUT_MS = 3000ms, taken directly from Archie's own worked
//     example ("aborting at roughly 3 seconds").
//   - RETRY_DELAY_MS = 400ms, a short pause before the single retry, chosen
//     to be brief enough not to noticeably lengthen a genuine transient
//     failure's recovery, and unrelated to (not layered on top of) the
//     220ms keystroke debounce below.
// Neither is specified elsewhere in the WS6 governance chain; if the
// Product Owner or Archie want different values, they are isolated
// constants, trivial to adjust.

import { useEffect, useRef, useState } from "react";

import type { GeoSearchResult } from "@/lib/geo-validation";

export type DestinationSearchStatus = "idle" | "loading" | "ready" | "unavailable";

const DEBOUNCE_MS = 220;
const MIN_QUERY_LENGTH = 2;
const REQUEST_TIMEOUT_MS = 3000;
const RETRY_DELAY_MS = 400;

function isSearchResponseBody(value: unknown): value is { ok: true; results: GeoSearchResult[] } {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as { ok?: unknown }).ok === true &&
    Array.isArray((value as { results?: unknown }).results)
  );
}

export function useDestinationSearch(query: string) {
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [status, setStatus] = useState<DestinationSearchStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    abortRef.current?.abort();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    setStatus("loading");

    async function attempt(isRetry: boolean) {
      const controller = new AbortController();
      abortRef.current = controller;

      // A bounded outer timeout (Archie, EBC-R1.2-WS6-06 §2), distinct from
      // the AbortController's other abort path (a requery or unmount via
      // this effect's own cleanup, below). `timedOut` distinguishes the two
      // in the catch branch: only a genuine timeout/network/non-2xx failure
      // should retry-or-surface-unavailable; an abort caused by the
      // traveller typing further, or the component unmounting, should
      // silently do nothing.
      let timedOut = false;
      timeoutTimer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(
          `/api/journey-passport/destinations/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        const body: unknown = await response.json().catch(() => null);
        clearTimeout(timeoutTimer);
        if (!response.ok || !isSearchResponseBody(body)) {
          throw new Error("destination_search_failed");
        }
        if (cancelled) return;
        setResults(body.results);
        setStatus("ready");
      } catch (error) {
        clearTimeout(timeoutTimer);
        if (cancelled) return;

        const abortedByRequeryOrUnmount =
          error instanceof DOMException && error.name === "AbortError" && !timedOut;
        if (abortedByRequeryOrUnmount) return;

        if (!isRetry) {
          retryTimer = setTimeout(() => {
            void attempt(true);
          }, RETRY_DELAY_MS);
          return;
        }

        setResults([]);
        setStatus("unavailable");
      }
    }

    const debounceTimer = setTimeout(() => {
      void attempt(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      clearTimeout(timeoutTimer);
      clearTimeout(retryTimer);
      abortRef.current?.abort();
    };
  }, [query]);

  return { results, status };
}
