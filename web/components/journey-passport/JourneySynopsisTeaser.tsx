"use client";

/**
 * Interactive 'Journey Synopsis' Preview & Teaser Mode (Release 1.4 — PO-01 & UX-08)
 *
 * Authored for Vivek (Product Owner) & Tiger (CTO)
 * Strictly enforces Tiger's BOUND-01 Lead-Capture Guardrail:
 * - Exposes high-trust teaser elements: Mood Archetype, Indicative Duration, Top Pilot Regions, Trip Anchors.
 * - GATES sensitive conversion assets behind verified OTP: Full day-by-day itinerary sequence,
 *   boutique hotel assignments, and direct Journey Director WhatsApp / concierge routing.
 */

import { useMemo } from "react";
import type { JourneyPassportState } from "@/types/journey-passport.types";
import { deriveTeaserData, type DerivedTeaserData } from "@/lib/journey-passport/teaser";

export { deriveTeaserData, type DerivedTeaserData };

export interface JourneySynopsisTeaserProps {
  state?: Partial<JourneyPassportState>;
  mode?: "passport-teaser" | "sample-preview";
  className?: string;
}

export function JourneySynopsisTeaser({
  state,
  mode = "passport-teaser",
  className = "",
}: JourneySynopsisTeaserProps) {
  const data = useMemo(() => deriveTeaserData(state), [state]);

  return (
    <div
      className={`journey-synopsis-teaser rounded-2xl border border-[#d8c4a7] bg-[#FFFDFC] p-5 text-left shadow-sm md:p-6 ${className}`}
      data-testid="journey-synopsis-teaser"
    >
      {/* Header Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebdcc7] pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fcedd7] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ad762d]">
          <span aria-hidden="true">✦</span> Journey Synopsis Preview
        </span>
        <span className="text-xs font-semibold text-[#8a7258]">
          Indicative Shape: <strong className="text-[#2A211C]">{data.indicativeDuration}</strong> · {data.pace}
        </span>
      </div>

      {/* Mood Archetype Highlight */}
      <div className="mt-4 rounded-xl border border-[#ebdcc7] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#ad762d]">{data.archetype.badge}</p>
          <span className="rounded-full bg-[#f4ebe1] px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#6e5a46]">
            Personalized Match
          </span>
        </div>
        <h3 className="mt-1 text-lg font-bold text-[#2A211C]">{data.archetype.title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#6e5a46]">{data.archetype.subtitle}</p>
      </div>

      {/* Top Matching Regional Circuits */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8a7258]">
          Top Recommended Regional Circuits
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {data.topRegions.map((region) => (
            <div
              key={region.name}
              className="rounded-xl border border-[#e8d8c2] bg-white p-3.5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[0.7rem] font-bold uppercase text-[#ad762d]">{region.stateOrCountry}</span>
                <span className="text-[0.7rem] text-[#6e5a46]">{region.duration}</span>
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[#2A211C]">{region.name}</h4>
              <p className="mt-1 text-xs text-[#6e5a46]">{region.badge}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comfort & Dietary Tags */}
      {data.comfortHighlights.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.comfortHighlights.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-[#e1ceb0] bg-[#fff9ed] px-2.5 py-1 text-[0.75rem] font-medium text-[#7a4c16]"
            >
              <span aria-hidden="true">✓</span> {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* Tiger's BOUND-01 Lead-Capture Guardrail: Gated Itinerary Preview */}
      <div className="relative mt-4 overflow-hidden rounded-xl border border-[#e1ceb0] bg-white/70 p-4">
        <div className="select-none blur-[3px]" aria-hidden="true">
          <p className="text-xs font-semibold text-[#8a7258]">Day 1–2: Arrival & Private Riverside Forest Sanctuary</p>
          <p className="mt-1 text-xs text-[#2A211C]">
            Private chauffeur greeting, heritage villa check-in, guided tea plantation sunset trail.
          </p>
          <p className="mt-2 text-xs font-semibold text-[#8a7258]">Day 3–5: Mountain Mist & Hidden Valley Trails</p>
          <p className="mt-1 text-xs text-[#2A211C]">
            Curated village artisan workshop, alpine picnic, quiet lakeside stay.
          </p>
        </div>

        {/* Lock Overlay Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2A211C]/10 px-4 text-center backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2A211C] px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
            <span aria-hidden="true">🔒</span> Complete Day-by-Day Route Gated
          </span>
          <p className="mt-1.5 max-w-xs text-[0.75rem] font-medium text-[#2A211C]">
            {mode === "sample-preview"
              ? "Verified travellers unlock their full custom itinerary and private boutique stays."
              : "Confirm your mobile number below to unlock your complete itinerary and direct WhatsApp advisor."}
          </p>
        </div>
      </div>
    </div>
  );
}
