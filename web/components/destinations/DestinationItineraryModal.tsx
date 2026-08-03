"use client";

import { lazy, Suspense, useCallback, useEffect, useRef } from "react";

import type { PublicDestinationCard } from "@/config/public-destinations.config";

import styles from "./DestinationItineraryModal.module.css";

const DestinationItinerarySection = lazy(() => import("./DestinationItinerarySection"));

type DestinationItineraryModalProps = {
  destination: PublicDestinationCard;
  triggerElement: HTMLButtonElement | null;
  onClose: () => void;
};

export default function DestinationItineraryModal({ destination, triggerElement, onClose }: DestinationItineraryModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingId = `destination-itinerary-modal-heading-${destination.destinationId}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const body = document.body;
    const root = document.documentElement;
    const scrollPosition = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const previousBodyStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;
    dialog.showModal();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      if (dialog.open) dialog.close();
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      root.style.overflow = previousRootOverflow;
      window.requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
        triggerElement?.focus({ preventScroll: true });
      });
    };
  }, [onClose, triggerElement]);

  const returnToItineraryStart = useCallback(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => contentRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id="destination-itinerary-modal"
      className={styles.dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.surface}>
        <header className={styles.header}>
          <div>
            <p>Destination journey</p>
            <h2 id={headingId}>{destination.title}</h2>
          </div>
          <button type="button" autoFocus onClick={onClose} aria-label={`Close ${destination.title} journey`}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div ref={contentRef} className={styles.content}>
          <Suspense fallback={<ModalLoading destinationName={destination.title} />}>
            <DestinationItinerarySection destinationId={destination.destinationId} destinationName={destination.title} onItineraryChange={returnToItineraryStart} />
          </Suspense>
        </div>
      </div>
    </dialog>
  );
}

function ModalLoading({ destinationName }: { destinationName: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span aria-hidden="true" />
      <p>Preparing this journey…</p>
      <small>A thoughtful starting point for {destinationName} is on its way.</small>
    </div>
  );
}
