import { TravellerStoryCard } from "@/components/discovery/TravellerStoryCards";
import type { TravellerJourneyCard } from "@/lib/traveller-stories/getTravellerJourneys";

export default function RelatedStories({ journeys }: { journeys: TravellerJourneyCard[] }) {
  if (journeys.length === 0) return null;

  return (
    <section className="layout-section pt-0">
      <div className="layout-container">
        <div className="mx-auto max-w-2xl border-t border-[#eadcc8] pt-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#F5951C]">More Traveller Stories</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-[#2A211C]">You might also enjoy</h2>
        </div>

        <div className="mx-auto mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((journey) => (
            <TravellerStoryCard key={journey.journeyId} journey={journey} />
          ))}
        </div>
      </div>
    </section>
  );
}
