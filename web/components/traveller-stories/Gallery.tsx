"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

/**
 * Traveller Stories — interactive gallery / lightbox.
 *
 * A small, dependency-free client component (EBC: Traveller Stories Final
 * Content, Media & Gallery Completion, Section 10 — "avoid introducing a
 * large dependency solely for this feature if a small native component is
 * sufficient"). Renders a thumbnail grid; clicking/tapping any thumbnail
 * opens a full-screen overlay with the enlarged image, previous/next
 * controls, a close control, Escape-to-close, and left/right arrow-key
 * navigation. Touch-friendly tap targets throughout for mobile.
 */
export default function Gallery({
  images,
  travellerName,
}: {
  images: { src: string; alt: string }[];
  travellerName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? null : (current + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [openIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  const activeImage = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`View larger image ${index + 1} of ${images.length}: ${image.alt}`}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e4d2b5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${travellerName}'s photo gallery, image ${openIndex! + 1} of ${images.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
          >
            <span aria-hidden="true">×</span>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          ) : null}

          <div
            className="relative h-full w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-semibold text-white/80 sm:bottom-6">
              {openIndex! + 1} / {images.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
