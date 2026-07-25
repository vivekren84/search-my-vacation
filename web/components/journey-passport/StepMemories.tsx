"use client";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const OPTIONS = [
  {
    value: "food-dining",
    label: "Flavours & Food",
    subtext: "Moments you’ll taste again and again",
    image: "/images/journey-passport/travel-styles/food-dining.webp",
  },
  {
    value: "culture-heritage",
    label: "Culture & Stories",
    subtext: "Stories that stay with you",
    image: "/images/journey-passport/travel-styles/culture-heritage.webp",
  },
  {
    value: "nature",
    label: "Nature Moments",
    subtext: "Calm, beauty, and fresh air",
    image: "/images/journey-passport/travel-styles/nature.webp",
  },
  {
    value: "relaxation",
    label: "Slow & Peaceful",
    subtext: "Time to truly unwind",
    image: "/images/journey-passport/travel-styles/relaxation.webp",
  },
  {
    value: "wildlife",
    label: "Wild Encounters",
    subtext: "Up close with nature",
    image: "/images/journey-passport/travel-styles/wildlife.webp",
  },
  {
    value: "photography",
    label: "Captured Memories",
    subtext: "Moments worth framing",
    image: "/images/journey-passport/travel-styles/photography.webp",
  },
  {
    value: "adventure",
    label: "Thrill & Adventure",
    subtext: "Stories worth telling",
    image: "/images/journey-passport/travel-styles/adventure.webp",
  },
  {
    value: "celebrations",
    label: "Celebration Moments",
    subtext: "Joyful experiences together",
    image: "/images/journey-passport/travel-styles/celebrations.webp",
  },
];

const MAX_SELECTION = 3;

export default function StepMemories({ value, onChange }: Props) {
  const toggleSelection = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else if (value.length < MAX_SELECTION) {
      onChange([...value, val]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          What kind of memories would you like to bring back?
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Choose up to 3 that resonate most with you
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {OPTIONS.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled =
            value.length >= MAX_SELECTION && !isSelected;

          return (
            <div
              key={option.value}
              onClick={() => !isDisabled && toggleSelection(option.value)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group active:scale-95 ${
                isSelected
                  ? "ring-2 ring-white scale-105 shadow-xl"
                  : "opacity-90 hover:opacity-100 hover:scale-[1.02]"
              } ${isDisabled ? "opacity-40 pointer-events-none" : ""}`}
            >
              {/* Image */}
              <img
                src={option.image}
                alt={option.label}
                className="w-full h-40 object-cover rounded-2xl"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-sm font-semibold leading-tight">
                  {option.label}
                </h3>
                <p className="text-white/90 text-xs leading-tight">
                  {option.subtext}
                </p>
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-white text-black text-xs px-2 py-1 rounded-full">
                  Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Limit Message */}
      {value.length === MAX_SELECTION && (
        <p className="text-xs text-neutral-400">
          You’ve picked your top 3 — feel free to change anytime
        </p>
      )}
    </div>
  );
}