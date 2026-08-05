"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

import { EditorialCardGrid, type EditorialCardItem } from "@/components/discovery/EditorialCards";
import Container from "@/components/layout/Container";
import { journeyCanonicalImage } from "@/config/destination-images.config";
import { publicDestinationGroups, type PublicDestinationCard, type PublicDestinationGroup } from "@/config/public-destinations.config";

import DestinationItineraryModal from "./DestinationItineraryModal";

function editorialCard(card: PublicDestinationCard): EditorialCardItem {
  const presentation = journeyCanonicalImage(card.imageKey);
  return {
    destinationId: card.destinationId,
    title: card.title,
    label: card.label,
    copy: card.copy,
    image: presentation.heroImage,
    alt: presentation.heroImageAlt,
  };
}

// Mirrors EditorialCardGrid's internal anchorFor() so hash lookups always match the ids actually rendered on each card.
function anchorFor(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const destinationCategories: { id: PublicDestinationGroup["id"]; label: string }[] = [
  { id: "india", label: "India" },
  { id: "international", label: "International" },
  { id: "wildlife", label: "Wildlife" },
];

const groupIdByAnchor = new Map<string, PublicDestinationGroup["id"]>(
  publicDestinationGroups.flatMap((group) => group.cards.map((card) => [anchorFor(card.title), group.id] as const)),
);

export default function DestinationsExperience() {
  const [modalState, setModalState] = useState<{ destinationId: string; triggerElement: HTMLButtonElement }>();
  const [activeGroupId, setActiveGroupId] = useState<PublicDestinationGroup["id"]>("india");
  const [pendingScrollAnchor, setPendingScrollAnchor] = useState<string | null>(null);
  const selectedDestinationId = modalState?.destinationId;
  const selectedCard = publicDestinationGroups.flatMap((group) => group.cards).find((card) => card.destinationId === selectedDestinationId);

  function openDestination(item: EditorialCardItem, trigger: HTMLButtonElement) {
    if (!item.destinationId) return;
    setModalState({ destinationId: item.destinationId, triggerElement: trigger });
  }

  const closeModal = useCallback(() => setModalState(undefined), []);

  // On landing via an existing #destination-slug link, activate the category that owns it before scrolling.
  // State must start as "india" to match server-rendered output, then sync once from the browser-only
  // location.hash after mount to avoid a hydration mismatch.
  useEffect(() => {
    const anchor = decodeURIComponent(window.location.hash.slice(1));
    if (!anchor) return;
    const ownerGroupId = groupIdByAnchor.get(anchor);
    if (!ownerGroupId) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from location.hash after mount, see comment above */
    setActiveGroupId(ownerGroupId);
    setPendingScrollAnchor(anchor);
  }, []);

  useEffect(() => {
    if (!pendingScrollAnchor) return;
    document.getElementById(pendingScrollAnchor)?.scrollIntoView({ block: "start" });
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- clears the one-time pending scroll flag once handled */
    setPendingScrollAnchor(null);
  }, [activeGroupId, pendingScrollAnchor]);

  return (
    <Fragment>
      <Container>
        <div className="mb-12 flex justify-center">
          <div role="group" aria-label="Filter destinations by category" className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#e4d2b5] bg-white/70 p-1.5">
            {destinationCategories.map((category) => {
              const isActive = activeGroupId === category.id;
              return (
                <button key={category.id} type="button" aria-pressed={isActive} onClick={() => setActiveGroupId(category.id)} className={`rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#280336] ${isActive ? "bg-[#280336] text-white shadow-[0_10px_22px_rgba(40,3,54,.18)]" : "text-[#4A2062] hover:bg-[#280336]/10"}`}>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </Container>
      {publicDestinationGroups.map((group, index) => (
        <section key={group.id} aria-labelledby={`${group.id}-destinations-heading`} hidden={activeGroupId !== group.id} className={index === 0 ? "pb-24" : "pb-24 pt-8"}>
          <Container>
            <div className="layout-section-heading mb-12">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#B72027]">{group.eyebrow}</p>
              <h2 id={`${group.id}-destinations-heading`} className="mt-4 text-balance font-serif text-4xl leading-[1.08] tracking-[-.04em] sm:text-5xl">{group.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#2A211C]">{group.copy}</p>
            </div>
            <EditorialCardGrid items={group.cards.map(editorialCard)} selectedId={selectedDestinationId} onSelect={openDestination} detailId="destination-itinerary-modal" />
          </Container>
        </section>
      ))}
      {selectedCard && modalState ? <DestinationItineraryModal key={selectedCard.destinationId} destination={selectedCard} triggerElement={modalState.triggerElement} onClose={closeModal} /> : null}
    </Fragment>
  );
}
