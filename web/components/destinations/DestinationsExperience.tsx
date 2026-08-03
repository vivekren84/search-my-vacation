"use client";

import { Fragment, useCallback, useState } from "react";

import { EditorialCardGrid, type EditorialCardItem } from "@/components/discovery/EditorialCards";
import Container from "@/components/layout/Container";
import { journeyCanonicalImage } from "@/config/destination-images.config";
import { publicDestinationGroups, type PublicDestinationCard } from "@/config/public-destinations.config";

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

export default function DestinationsExperience() {
  const [modalState, setModalState] = useState<{ destinationId: string; triggerElement: HTMLButtonElement }>();
  const selectedDestinationId = modalState?.destinationId;
  const selectedCard = publicDestinationGroups.flatMap((group) => group.cards).find((card) => card.destinationId === selectedDestinationId);

  function openDestination(item: EditorialCardItem, trigger: HTMLButtonElement) {
    if (!item.destinationId) return;
    setModalState({ destinationId: item.destinationId, triggerElement: trigger });
  }

  const closeModal = useCallback(() => setModalState(undefined), []);

  return (
    <Fragment>
      {publicDestinationGroups.map((group, index) => (
        <section key={group.id} aria-labelledby={`${group.id}-destinations-heading`} className={index === 0 ? "pb-24" : "pb-24 pt-8"}>
          <Container>
            <div className="layout-section-heading mb-12">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#96652b]">{group.eyebrow}</p>
              <h2 id={`${group.id}-destinations-heading`} className="mt-4 text-balance font-serif text-4xl leading-[1.08] tracking-[-.04em] sm:text-5xl">{group.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#705c47]">{group.copy}</p>
            </div>
            <EditorialCardGrid items={group.cards.map(editorialCard)} selectedId={selectedDestinationId} onSelect={openDestination} detailId="destination-itinerary-modal" />
          </Container>
        </section>
      ))}
      {selectedCard && modalState ? <DestinationItineraryModal key={selectedCard.destinationId} destination={selectedCard} triggerElement={modalState.triggerElement} onClose={closeModal} /> : null}
    </Fragment>
  );
}
