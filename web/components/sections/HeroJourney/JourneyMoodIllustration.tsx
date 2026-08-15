import Image from "next/image";

export type JourneyMoodIllustrationName =
  | "relax"
  | "explore"
  | "celebrate"
  | "romance"
  | "memory";

type JourneyMoodIllustrationProps = {
  name: JourneyMoodIllustrationName;
};

// DEC-R1.2-007: the "escape" illustration mapping is retired along with the
// Homepage Escape mood card — see HeroJourney.tsx. The underlying artwork
// file is left in place under /public (assets are never deleted per
// repository convention); only the active code reference to it is removed.
const artworkByMood: Record<JourneyMoodIllustrationName, string> = {
  relax: "/images/journey-moods/relax-luxury.webp",
  explore: "/images/journey-moods/explore-luxury.webp",
  celebrate: "/images/journey-moods/celebrate-luxury.webp",
  romance: "/images/journey-moods/romance-luxury.webp",
  memory: "/images/journey-moods/memory-maker-luxury.webp",
};

// Contrast, a touch of brightness, and a soft ivory backlight give the
// illustration enough presence to remain the card's primary visual focus
// against the neutral glass treatment in HeroJourney.tsx. No hue/saturation
// change is applied, so this can't amplify any gold already in the artwork.
// Full design rationale: docs/09-Development/EBCR1.2-004-SOPHIE-VISUAL-TREATMENT-ADDENDUM.md
export default function JourneyMoodIllustration({ name }: JourneyMoodIllustrationProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10%] rounded-full bg-[#FFF8E8]/[0.09] blur-2xl"
      />
      <Image
        src={artworkByMood[name]}
        alt=""
        aria-hidden="true"
        width={640}
        height={640}
        sizes="(min-width: 640px) 176px, 152px"
        className="relative h-full w-full select-none object-contain contrast-[1.14] brightness-[1.03] drop-shadow-[0_3px_10px_rgba(10,6,4,.38)]"
        draggable={false}
      />
    </div>
  );
}
