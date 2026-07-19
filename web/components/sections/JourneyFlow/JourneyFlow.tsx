import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";

type JourneyFeeling = "relax" | "explore" | "celebrate" | "romance" | "escape";

type Experience = {
  destination: string;
  hook: string;
};

type JourneyContent = {
  acknowledgement: string;
  label: string;
  experiences: Experience[];
};

const journeyContent: Record<JourneyFeeling, JourneyContent> = {
  relax: {
    acknowledgement: "Let’s slow things down.",
    label: "Relax",
    experiences: [
      { destination: "Kerala Backwaters", hook: "Let quiet waters and unhurried mornings set the pace." },
      { destination: "Maldives", hook: "Trade the everyday for clear horizons and effortless calm." },
      { destination: "Bali Ubud", hook: "Find stillness among rice terraces, rituals, and soft green hills." },
    ],
  },
  explore: {
    acknowledgement: "Let’s discover something new.",
    label: "Explore",
    experiences: [
      { destination: "Vietnam", hook: "Follow vibrant streets, quiet bays, and stories waiting around every corner." },
      { destination: "Rajasthan", hook: "Step into colour, heritage, and days that feel wonderfully unfamiliar." },
      { destination: "Europe", hook: "Let every city, café, and crossing become part of the story." },
    ],
  },
  celebrate: {
    acknowledgement: "Let’s make this unforgettable.",
    label: "Celebrate",
    experiences: [
      { destination: "Dubai", hook: "Mark the moment with skyline views, golden evenings, and a little wonder." },
      { destination: "Thailand", hook: "Turn a special occasion into sunlit memories shared long after the journey." },
      { destination: "Cruise", hook: "Celebrate between horizons, with every day bringing a new place to toast." },
    ],
  },
  romance: {
    acknowledgement: "Let’s craft something special.",
    label: "Romance",
    experiences: [
      { destination: "Santorini", hook: "Linger over slow sunsets and whitewashed lanes made for two." },
      { destination: "Paris", hook: "Make room for candlelit evenings, hidden corners, and your own pace." },
      { destination: "Maldives", hook: "Let the world fall quiet while you focus on each other." },
    ],
  },
  escape: {
    acknowledgement: "Let’s get you away.",
    label: "Escape",
    experiences: [
      { destination: "Bhutan", hook: "Breathe deeper among quiet valleys, monasteries, and open skies." },
      { destination: "Coorg", hook: "Leave the noise behind for misty mornings and unplanned afternoons." },
      { destination: "Bali", hook: "Press pause beside warm shores, gentle rituals, and a slower rhythm." },
    ],
  },
};

const defaultFeeling: JourneyFeeling = "relax";

function isJourneyFeeling(value: string | undefined): value is JourneyFeeling {
  return value === "relax" || value === "explore" || value === "celebrate" || value === "romance" || value === "escape";
}

type JourneyFlowProps = {
  feeling?: string;
};

export default function JourneyFlow({ feeling }: JourneyFlowProps) {
  const selectedFeeling = isJourneyFeeling(feeling) ? feeling : defaultFeeling;
  const content = journeyContent[selectedFeeling];

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#2b1c13]">
      <section className="relative isolate min-h-[58svh] overflow-hidden" aria-labelledby="journey-heading">
        <Image
          src="/images/hero/golden-hour1.png"
          alt="A family sharing a Golden Hour travel moment by the coast"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(27,17,12,0.8)_0%,rgba(27,17,12,0.48)_48%,rgba(27,17,12,0.2)_100%),linear-gradient(0deg,rgba(27,17,12,0.58)_0%,transparent_55%)]" aria-hidden="true" />
        <Header />

        <div className="mx-auto flex min-h-[58svh] max-w-7xl items-end px-6 pb-20 pt-36 sm:px-8 sm:pb-24 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f3c681] sm:text-sm">
              Your feeling: {content.label}
            </p>
            <h1 id="journey-heading" className="mt-4 font-serif text-5xl font-normal leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              {content.acknowledgement}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90 sm:text-xl">
              Here are experiences designed just for this feeling.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8dfb0_0%,#fff7ea_42%,#fffaf3_100%)] px-6 py-20 sm:px-8 lg:px-16 lg:py-28" aria-labelledby="curated-experiences-heading">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">Curated for your mood</p>
            <h2 id="curated-experiences-heading" className="mt-3 font-serif text-4xl font-normal tracking-[-0.035em] sm:text-5xl">
              A few beautiful ways to begin.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {content.experiences.map((experience, index) => (
              <article
                key={experience.destination}
                className={`group relative overflow-hidden rounded-[2rem] bg-[#2b1c13] shadow-[0_16px_45px_rgba(76,45,20,0.16)] ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className={`relative ${index === 0 ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                  <Image
                    src="/images/hero/golden-hour1.png"
                    alt={`Golden Hour travel inspiration for ${experience.destination}`}
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 80vw" : "(max-width: 1024px) 100vw, 40vw"}
                    className="object-cover object-[62%_center] transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(24,14,9,0.82)_0%,rgba(24,14,9,0.08)_75%)]" aria-hidden="true" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-serif text-3xl font-normal tracking-[-0.03em] text-white sm:text-4xl">{experience.destination}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/85 sm:text-base">{experience.hook}</p>
                  <Link href="#design-my-trip" className="mt-5 inline-flex items-center text-sm font-bold text-[#f3c681] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c681]">
                    Explore More <span aria-hidden="true" className="ml-2">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="design-my-trip" className="bg-[#fffaf3] px-6 pb-20 sm:px-8 lg:px-16 lg:pb-28">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#ecd7bc] bg-white p-8 text-center shadow-[0_14px_40px_rgba(76,45,20,0.08)] sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a642e]">A little more personal</p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-0.035em]">Want us to tailor this further?</h2>
          <button type="button" disabled className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#cbb9a7] px-8 text-base font-bold text-white" title="Trip design will be available in a future release">
            Design My Trip
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-[#725137]">
            <Link href="/#journey-selector" className="transition hover:text-[#9a642e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e]">Change emotion</Link>
            <Link href="/" className="transition hover:text-[#9a642e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a642e]">Back to homepage</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
