/**
 * Journey Summary — reusable fact block for a Traveller Stories journey.
 *
 * Shows Duration, Destination(s), Traveller Type, Experience Type and Travel
 * Date. Used on the journey detail page for both the authentic-testimonial
 * layout and the metadata-only "Journey Snapshot" layout, so the two
 * treatments share one visual language. Deliberately has no dependency on
 * where it's rendered (no Link, no CTA) so it can be reused anywhere a
 * journey's facts need to be shown — e.g. a future summary card or preview.
 */
export interface JourneySummaryFacts {
  destination: string;
  duration: string;
  travellerType: string;
  experienceType: string;
  travelMonth: string;
  travelYear: number;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#eadcc8] py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#986328]">{label}</dt>
      <dd className="text-sm font-semibold text-[#2A211C] sm:text-right">{value}</dd>
    </div>
  );
}

export default function JourneySummary({ facts, className = "" }: { facts: JourneySummaryFacts; className?: string }) {
  return (
    <dl className={className}>
      <SummaryRow label="Destination" value={facts.destination} />
      <SummaryRow label="Duration" value={facts.duration} />
      <SummaryRow label="Traveller type" value={facts.travellerType} />
      <SummaryRow label="Experience type" value={facts.experienceType} />
      <SummaryRow label="Travelled" value={`${facts.travelMonth} ${facts.travelYear}`} />
    </dl>
  );
}
