import Image from "next/image";

export type JourneyMoodIllustrationName =
  | "relax"
  | "explore"
  | "celebrate"
  | "romance"
  | "escape"
  | "memory";

type JourneyMoodIllustrationProps = {
  name: JourneyMoodIllustrationName;
};

const artworkByMood: Record<JourneyMoodIllustrationName, string> = {
  relax: "/images/journey-moods/relax-luxury.webp",
  explore: "/images/journey-moods/explore-luxury.webp",
  celebrate: "/images/journey-moods/celebrate-luxury.webp",
  romance: "/images/journey-moods/romance-luxury.webp",
  escape: "/images/journey-moods/escape-luxury.webp",
  memory: "/images/journey-moods/memory-maker-luxury.webp",
};

export default function JourneyMoodIllustration({ name }: JourneyMoodIllustrationProps) {
  return (
    <Image
      src={artworkByMood[name]}
      alt=""
      aria-hidden="true"
      width={640}
      height={640}
      sizes="(min-width: 640px) 176px, 152px"
      className="h-full w-full select-none object-contain"
      draggable={false}
    />
  );
}
