"use client";

type CompanionOption = {
  value: string;
  label: string;
  subtext: string;
  image: string;
  objectPosition: string;
};

type StepCompanionsProps = {
  value: string;
  onChange: (value: string) => void;
};

const COMPANION_OPTIONS: CompanionOption[] = [
  {
    value: "solo",
    label: "Solo",
    subtext: "Just you, your pace, your journey",
    image: "/images/journey-passport/companions/solo.webp",
    objectPosition: "35% center",
  },
  {
    value: "couple",
    label: "Couple",
    subtext: "Moments shared together",
    image: "/images/journey-passport/companions/couple.webp",
    objectPosition: "50% 25%",
  },
  {
    value: "family",
    label: "Family",
    subtext: "Time with the people who matter most",
    image: "/images/journey-passport/companions/family.webp",
    objectPosition: "center center",
  },
  {
    value: "friends",
    label: "Friends",
    subtext: "Fun, laughter, and stories to bring home",
    image: "/images/journey-passport/companions/friends.webp",
    objectPosition: "45% center",
  },
];

export default function StepCompanions({
  value,
  onChange,
}: StepCompanionsProps) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-7">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Who are you travelling with?
        </h2>

        <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
          This helps us shape an experience that feels right for everyone
          joining you.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {COMPANION_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={[
                "group relative block w-full overflow-hidden rounded-3xl border text-left",
                "min-h-[280px] sm:min-h-[300px] lg:h-[300px]",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black",
                isSelected
                  ? "border-white/90 shadow-2xl ring-2 ring-white"
                  : "border-white/20 hover:-translate-y-1 hover:border-white/50 hover:shadow-2xl",
              ].join(" ")}
            >
              {/* Cinematic card imagery with a per-option focal point. */}
              <img
                src={option.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: option.objectPosition }}
              />

              {/* Contrast treatment for readable copy. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/10"
              />

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 to-transparent"
              />

              {/* Selection indicator */}
              <div
                className={[
                  "absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                  isSelected
                    ? "border-white bg-white text-black"
                    : "border-white/80 bg-black/20 text-transparent group-hover:bg-black/40",
                ].join(" ")}
                aria-hidden="true"
              >
                {isSelected && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5 9.25 17 19 7" />
                  </svg>
                )}
              </div>

              {/* Card copy */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7 lg:p-8">
                <div className="max-w-xl">
                  <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {option.label}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white sm:text-base">
                    {option.subtext}
                  </p>

                  <p
                    className={[
                      "mt-4 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity",
                      isSelected
                        ? "text-white opacity-100"
                        : "text-white/70 opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  >
                    {isSelected ? "Selected" : "Choose this companion"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
