"use client";

// EBC-R1.2-WS6-09 (Rad, Phase 2). The Preferred Destinations combobox +
// chip field, per EBC-R1.2-WS6-05 §4 (Sophie, UX Specification) and its
// architectural counterpart in EBC-R1.2-WS6-03 §7-8 (Archie). This is the
// codebase's first WAI-ARIA combobox-with-listbox pattern — no local
// precedent exists to extend, so it is built directly to the WAI-ARIA 1.2
// combobox pattern per EBC-002 §15.8's existing binding requirement and
// EBC-R1.2-WS6-05 §8.
//
// NOT YET WIRED into JourneyPassportMoments.tsx / JourneyPassportState —
// that integration, including the destinationMode retirement, is Phase 4's
// explicit scope ("Journey Passport Integration"). This component is
// self-contained and controlled entirely by its own props so Phase 4 can
// wire it in without further changes here, per the phase boundary drawn in
// EBC-R1.2-WS6-09.
//
// Chip visual language is reused verbatim from the Travel Style moment's
// chip buttons (PaceAndTimingMoment in JourneyPassportMoments.tsx) per
// EBC-R1.2-WS6-05 §4.3's explicit instruction to reuse that precedent
// rather than invent a new one.
//
// EBC-R1.2-WS6-09 (Rad, Phase 7 — Accessibility & Interaction
// Validation). Two implementation corrections against this same spec's
// §8 (Accessibility Review), found by re-reading the live component
// against the WAI-ARIA 1.2 combobox pattern and the codebase's own
// touch-target convention, neither a new pattern or a redesign:
//   - onBlur now closes the suggestion popup (the WAI-ARIA APG combobox
//     pattern requires the popup close whenever the combobox no longer
//     has focus). The existing onMouseDown preventDefault on each <li>
//     already stops a listbox-option click from blurring the input, so
//     this never fights option selection.
//   - The chip remove button now carries min-h-11 min-w-11 (was h-5 w-5),
//     meeting the same 44x44 CSS-pixel touch target §8 names explicitly
//     ("recommend reusing the codebase's existing min-h-11 (44px) utility
//     convention") — the chip's own container already had it; the
//     clickable control inside it did not.

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { useDestinationSearch } from "@/hooks/useDestinationSearch";
import { addSelection, formatDisambiguation, MAX_PREFERRED_DESTINATIONS, removeSelection, type GeoSearchResult, type SelectedDestination } from "@/lib/geo-validation";

type Props = {
  value: SelectedDestination[];
  onChange: (next: SelectedDestination[]) => void;
  maxSelections?: number;
  className?: string;
};

const NO_MATCH_TEMPLATE = (query: string) =>
  `We couldn’t quite find “${query}” — try a nearby town, region or country, or simply describe it below instead.`;
const UNAVAILABLE_MESSAGE =
  "We’re having trouble checking places right now. You can still describe your destination below, and we’ll pick this back up shortly.";
const CAP_REACHED_MESSAGE = "That’s a wonderful list already — five is plenty for us to start exploring.";

export function PreferredDestinationsField({ value, onChange, maxSelections = MAX_PREFERRED_DESTINATIONS, className = "" }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [justPulsedId, setJustPulsedId] = useState<string | null>(null);
  const [showCapMessage, setShowCapMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputId = useId();
  const listboxId = useId();
  const helpId = useId();
  const liveRegionId = useId();
  const optionIdPrefix = useId();

  const { results, status } = useDestinationSearch(query);
  const trimmedQuery = query.trim();
  const listOpen = isOpen && trimmedQuery.length >= 2;
  const showResults = listOpen && status === "ready" && results.length > 0;
  const activeOptionId = activeIndex >= 0 && activeIndex < results.length ? `${optionIdPrefix}-${results[activeIndex].geoPlaceId}` : undefined;

  const liveMessage = useMemo(() => {
    if (!listOpen) return "";
    if (status === "loading") return "";
    if (status === "unavailable") return UNAVAILABLE_MESSAGE;
    if (status === "ready" && results.length === 0) return NO_MATCH_TEMPLATE(trimmedQuery);
    if (status === "ready") return `${results.length} suggestion${results.length === 1 ? "" : "s"} available.`;
    return "";
  }, [listOpen, status, results, trimmedQuery]);

  function flashDuplicate(geoPlaceId: string) {
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    setJustPulsedId(geoPlaceId);
    pulseTimeoutRef.current = setTimeout(() => setJustPulsedId(null), 900);
  }

  function selectResult(candidate: GeoSearchResult) {
    const outcome = addSelection(value, candidate, maxSelections);
    if (outcome.outcome === "duplicate") {
      flashDuplicate(candidate.geoPlaceId);
    } else if (outcome.outcome === "cap-reached") {
      setShowCapMessage(true);
    } else {
      onChange(outcome.next);
      setShowCapMessage(outcome.next.length >= maxSelections);
    }
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function removeChip(geoPlaceId: string) {
    const next = removeSelection(value, geoPlaceId);
    onChange(next);
    setShowCapMessage(next.length >= maxSelections);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      if (!showResults) return;
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp") {
      if (!showResults) return;
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      if (!showResults) return;
      event.preventDefault();
      const chosen = activeIndex >= 0 ? results[activeIndex] : results[0];
      selectResult(chosen);
      return;
    }
    if (event.key === "Escape") {
      if (!listOpen) return;
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key === "Backspace" && query.length === 0 && value.length > 0) {
      removeChip(value[value.length - 1].geoPlaceId);
    }
  }

  return (
    <div className={className || "mx-auto mt-6 max-w-2xl rounded-[1.5rem] border border-[#e1ceb0] bg-white/85 p-5 sm:p-6"}>
      <label htmlFor={inputId} className="text-lg font-semibold text-[#2A211C]">
        Preferred Destinations <span className="text-sm font-normal text-[#6e5a46]">(Optional)</span>
      </label>
      <p id={helpId} className="mt-2 text-sm leading-6 text-[#6e5a46]">
        Type a place, region or country — we’ll help you find it. Add as many as you’re considering.
      </p>

      <div className="relative mt-3">
        <input
          ref={inputRef}
          id={inputId}
          name="preferred-destinations-search"
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={listOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-describedby={helpId}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value.replace(/[\r\n]+/g, " "));
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setIsOpen(false);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="min-h-14 w-full rounded-xl border border-[#d8c4a7] bg-[#FFFDFC] px-4 text-base text-[#2A211C] focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]"
          placeholder="A place, region or country"
        />

        {showResults ? (
          <ul id={listboxId} role="listbox" aria-label="Destination suggestions" className="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#e1ceb0] bg-white shadow-[0_18px_38px_rgba(111,71,24,0.18)]">
            {results.map((result, index) => {
              const disambiguation = formatDisambiguation(result);
              return (
                <li
                  key={result.geoPlaceId}
                  id={`${optionIdPrefix}-${result.geoPlaceId}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectResult(result)}
                  className={`min-h-11 cursor-pointer px-4 py-2.5 text-sm ${index === activeIndex ? "bg-[#fff9ed]" : "bg-white"}`}
                >
                  <span className="block font-semibold text-[#2A211C]">{result.canonicalName}</span>
                  {disambiguation ? <span className="block text-xs text-[#6e5a46]">{disambiguation}</span> : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {listOpen && status === "ready" && results.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-[#6e5a46]">{NO_MATCH_TEMPLATE(trimmedQuery)}</p>
        ) : null}

        {listOpen && status === "unavailable" ? (
          <p className="mt-3 text-sm leading-6 text-[#6e5a46]">{UNAVAILABLE_MESSAGE}</p>
        ) : null}
      </div>

      <p id={liveRegionId} role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {value.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {value.map((destination) => (
            <span
              key={destination.geoPlaceId}
              className={`flex min-h-11 items-center gap-2 rounded-full border border-[#F5951C] bg-[#F5951C] px-4 py-2 text-sm font-semibold text-[#2A211C] transition motion-reduce:transition-none ${justPulsedId === destination.geoPlaceId ? "ring-2 ring-offset-2 ring-[#2A211C]" : ""}`}
            >
              {destination.canonicalName}
              <button
                type="button"
                onClick={() => removeChip(destination.geoPlaceId)}
                aria-label={`Remove ${destination.canonicalName}`}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#2A211C]/70 hover:text-[#2A211C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A211C]"
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {showCapMessage ? <p role="status" className="mt-3 text-sm leading-6 text-[#6e5a46]">{CAP_REACHED_MESSAGE}</p> : null}
    </div>
  );
}
