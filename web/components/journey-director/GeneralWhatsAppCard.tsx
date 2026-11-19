"use client";

import { recordJourneyPassportEvent } from "@/lib/journey-leads/client";
import { buildWhatsAppLink, createGeneralWhatsAppMessage } from "@/lib/journey-director/whatsapp";

interface GeneralWhatsAppCardProps {
  journeyReference: string;
  travellerName: string;
  travellingParty: string;
  travelTiming: string;
  journeyIntent?: string;
  className?: string;
}

/**
 * General WhatsApp Continuation Card (Release 1.3 Milestone 2 — P-03)
 *
 * Provides a direct, unconstrained WhatsApp connection point for travellers
 * who wish to discuss their verified Journey Passport directly with a human
 * Journey Designer without being forced to choose a specific recommendation card.
 */
export function GeneralWhatsAppCard({
  journeyReference,
  travellerName,
  travellingParty,
  travelTiming,
  journeyIntent,
  className = "",
}: GeneralWhatsAppCardProps) {
  const handleOpenWhatsApp = () => {
    const message = createGeneralWhatsAppMessage({
      travellerName,
      journeyReference,
      travellingParty,
      travelTiming,
      journeyIntent,
    });

    void recordJourneyPassportEvent(journeyReference, "whatsapp_handoff_opened");
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      aria-label="Connect with your Journey Designer on WhatsApp"
      className={`mx-auto my-8 max-w-4xl rounded-2xl border border-[#e4d2b5]/90 bg-[#FFFDFC] p-6 shadow-sm sm:p-7 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e4d2b5] bg-[#fffaf5] px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider text-[#80664d] uppercase">
            <span>Verified Passport</span>
            <span className="font-mono text-[#2A211C]">{journeyReference}</span>
          </div>

          <h2 className="font-serif text-xl font-bold tracking-tight text-[#2A211C] sm:text-2xl">
            Connect with your Journey Designer
          </h2>

          <p className="max-w-xl text-xs leading-relaxed text-[#80664d] sm:text-sm">
            Have questions about your possibilities or want to explore custom ideas? Connect directly with
            our travel advisory team on WhatsApp with your verified passport details.
          </p>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366] bg-white px-5 py-3 text-xs font-bold text-[#128C7E] shadow-sm transition hover:bg-[#25D366]/10 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:text-sm"
          >
            <span className="text-[#25D366]" aria-hidden="true">
              ●
            </span>
            <span>Chat on WhatsApp</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
