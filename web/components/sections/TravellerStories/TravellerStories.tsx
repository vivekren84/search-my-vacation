import Image from "next/image";
import { travellerStories, type TravellerStory } from "@/config/travellerStories.data";

function initialsFor(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean);

  if (letters.length === 0) return "";
  if (letters.length === 1) return letters[0];
  return `${letters[0]}${letters[letters.length - 1]}`;
}

function StoryCard({ story }: { story: TravellerStory }) {
  const hasImage = Boolean(story.image && story.alt);

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#e4d2b5] bg-white shadow-[0_14px_34px_rgba(91,55,18,.07)]">
      {hasImage ? (
        <div className="relative aspect-[4/3]">
          <Image
            src={story.image as string}
            alt={story.alt as string}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-8 pb-8 pt-8">
        <p className="text-[0.68rem] font-bold uppercase tracking-[.14em] text-[#F5951C]">
          {story.experience}
        </p>

        <blockquote className="mt-4 flex-1">
          <p className="text-[0.95rem] leading-7 text-[#2A211C]">
            &ldquo;{story.quote}&rdquo;
          </p>
        </blockquote>

        {story.route && story.route.length > 0 ? (
          <p className="mt-5 text-xs leading-6 text-[#80664d]">
            {story.route.join(" · ")}
          </p>
        ) : null}

        <footer className="mt-6 flex items-center gap-4 border-t border-[#eadcc8] pt-6">
          {!hasImage ? (
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f5e4c5] text-sm font-bold text-[#986328]"
            >
              {initialsFor(story.name)}
            </span>
          ) : null}
          <div>
            <cite className="not-italic text-sm font-semibold text-[#2A211C]">
              {story.name}
            </cite>
            <p className="mt-0.5 text-sm text-[#2A211C]/70">
              {story.destination} · {story.travelMonth} {story.travelYear}
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function TravellerStories() {
  const orderedStories = [...travellerStories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <section className="bg-[#FFFDFC] layout-section" aria-labelledby="traveller-stories-heading">
      <div className="layout-container">
        <div className="layout-section-heading">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A211C]">
            Told by our travellers
          </p>
          <h2
            id="traveller-stories-heading"
            className="mt-4 text-balance font-serif text-4xl leading-[1.06] tracking-[-0.045em] sm:text-5xl"
          >
            Every journey leaves a story worth telling.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2A211C]">
            These are not reviews. They are moments shared by the people who
            lived them, lightly edited only for clarity.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[72rem] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orderedStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
