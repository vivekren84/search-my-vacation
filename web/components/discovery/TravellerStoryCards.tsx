import Image from "next/image";
import Link from "next/link";

import type { TravellerJourneyCard } from "@/lib/traveller-stories/getTravellerJourneys";

export function initialsFor(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean);

  if (letters.length === 0) return "";
  if (letters.length === 1) return letters[0];
  return `${letters[0]}${letters[letters.length - 1]}`;
}

export function TravellerStoryCard({
  journey,
  priority = false,
}: {
  journey: TravellerJourneyCard;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/traveller-stories/${journey.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-[#e4d2b5] bg-white shadow-[0_14px_34px_rgba(91,55,18,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(91,55,18,.14)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5e4c5]">
        {journey.heroImage ? (
          <Image
            src={journey.heroImage.src}
            alt={journey.heroImage.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <span className="grid size-16 place-items-center rounded-full bg-white/70 text-lg font-bold text-[#986328]">
              {initialsFor(journey.travellerName)}
            </span>
          </div>
        )}

        {journey.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#F5951C] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[.12em] text-[#2A211C] shadow-sm">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[.14em] text-[#F5951C]">
          {journey.experienceType}
        </p>

        <h3 className="mt-3 font-serif text-2xl leading-[1.15] tracking-[-.03em] text-[#2A211C]">
          {journey.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#80664d]">
          {journey.destination} · {journey.duration}
        </p>

        <footer className="mt-5 flex items-center justify-between gap-3 border-t border-[#eadcc8] pt-4">
          <cite className="not-italic text-sm font-semibold text-[#2A211C]">
            {journey.travellerName}
          </cite>
          <p className="text-right text-xs leading-5 text-[#2A211C]/70">
            {journey.travellerType}
            <br />
            {journey.travelMonth} {journey.travelYear}
          </p>
        </footer>
      </div>
    </Link>
  );
}

export function TravellerStoryGrid({ journeys }: { journeys: TravellerJourneyCard[] }) {
  if (journeys.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[1.75rem] border border-[#e4d2b5] bg-white px-8 py-14 text-center shadow-[0_14px_34px_rgba(91,55,18,.07)]">
        <p className="font-serif text-2xl leading-tight text-[#2A211C]">
          New stories are on their way.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#80664d]">
          We&apos;re preparing more traveller stories for this page. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[76rem] items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {journeys.map((journey, index) => (
        <TravellerStoryCard key={journey.journeyId} journey={journey} priority={index < 3} />
      ))}
    </div>
  );
}
