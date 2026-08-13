import Image from "next/image";
import Link from "next/link";

import type { HomepageTravellerStory } from "@/lib/traveller-stories/getHomepageTravellerStories";

/**
 * Homepage Traveller Stories — curated preview (Release 1.1).
 *
 * Previously this section rendered every entry in the legacy
 * `config/travellerStories.data.ts` array (15 full cards), which is why the
 * homepage had become excessively long. It now renders at most 3 curated
 * cards, selected upstream by `getHomepageTravellerStories` (see that file
 * for the full selection rule), followed by a CTA to the dedicated
 * `/traveller-stories` page — the same "Explore All ___" treatment already
 * used by the homepage's Destinations, Experiences and Travel Inspiration
 * sections. The full catalogue lives only on that dedicated page; this
 * section never paginates, expands, or otherwise reveals more than 3.
 */

const HOMEPAGE_STORY_LIMIT = 3;

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

function StoryCard({ story }: { story: HomepageTravellerStory }) {
  const hasImage = Boolean(story.heroImage);

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#e4d2b5] bg-white shadow-[0_14px_34px_rgba(91,55,18,.07)]">
      {hasImage ? (
        <div className="relative aspect-[4/3]">
          <Image
            src={story.heroImage!.src}
            alt={story.heroImage!.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-8 pb-8 pt-8">
        <p className="text-[0.68rem] font-bold uppercase tracking-[.14em] text-[#F5951C]">
          {story.experienceType}
        </p>

        <h3 className="mt-3 font-serif text-xl leading-snug tracking-[-.02em] text-[#2A211C]">
          {story.title}
        </h3>

        <blockquote className="mt-4 flex-1">
          <p className="text-[0.95rem] leading-7 text-[#2A211C]">
            &ldquo;{story.excerpt}&rdquo;
          </p>
        </blockquote>

        <footer className="mt-6 flex items-center gap-4 border-t border-[#eadcc8] pt-6">
          {!hasImage ? (
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f5e4c5] text-sm font-bold text-[#986328]"
            >
              {initialsFor(story.travellerName)}
            </span>
          ) : null}
          <div>
            <cite className="not-italic text-sm font-semibold text-[#2A211C]">
              {story.travellerName}
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

export default function TravellerStories({ stories }: { stories: HomepageTravellerStory[] }) {
  // Defence in depth: the section must never show more than 3 cards even if
  // a future caller passes a longer list.
  const homepageStories = stories.slice(0, HOMEPAGE_STORY_LIMIT);

  if (homepageStories.length === 0) return null;

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
          {homepageStories.map((story) => (
            <StoryCard key={story.journeyId} story={story} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/traveller-stories"
            className="inline-flex rounded-full border border-[#F5951C] bg-white/55 px-6 py-3 text-sm font-bold text-[#2A211C] transition hover:bg-[#F5951C] hover:text-[#2A211C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C]"
          >
            Explore All Traveller Stories <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
