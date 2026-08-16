import Image from "next/image";
import Link from "next/link";

/**
 * Journey Invitations ("the Experiences section")
 *
 * R1.2-009 (Workstream 2 — Experiences vs Journey Mood Rationalisation):
 * this component is the "Begin with what matters" homepage block that
 * previously rendered between the Hero and Destinations sections in
 * `HomepageExperience.tsx`. Per DEC-R1.2-009 / DEC-R1.2-012, it has been
 * removed from the live homepage — Arjun's analysis (see
 * docs/09-Development/EBCR1.2-007 in the project's EBC record, and
 * `docs/10-Backlog/RELEASE-1.2.md` Workstream 2) found it duplicated the
 * Journey Mood Cards as a second, competing "pick a feeling to start"
 * entry point, sharing an identical card title ("Memory Makers") and
 * Journey Passport resolution with one of the five Mood Cards.
 *
 * This file is a deliberate extraction, not deleted code: the component,
 * its data and its styling are preserved byte-for-byte from the original
 * `HomepageExperience.tsx` implementation (only the import paths changed,
 * since this now lives as its own module) so it can be reused — on the
 * homepage, on `/experiences`, or elsewhere — without needing to be
 * rebuilt from scratch. It is not imported or rendered anywhere in the
 * live app today; that is intentional per R1.2-009's scope.
 *
 * The retained `/experiences` page (`web/app/experiences/page.tsx`) is a
 * separate implementation using `EditorialCardGrid`/`EditorialCardItem`
 * with all 6 invitation concepts — it does not import this component and
 * was not touched by R1.2-009. This file specifically preserves the
 * *homepage teaser* version (3-of-6 preview + "Explore All Experiences"
 * CTA), which has no other home in the codebase.
 */

export const invitations = [
  { title: "Memory Makers", copy: "For the moments you will revisit long after you return home.", image: "/images/journey-passport/travel-styles/photography.webp", alt: "Traveller capturing a meaningful travel memory" },
  { title: "Celebration Moments", copy: "For milestones that deserve more than an ordinary backdrop.", image: "/images/journey-passport/travel-styles/celebrations.webp", alt: "Travellers sharing a celebration" },
  { title: "Family Time", copy: "For making room for the people who matter most.", image: "/images/journey-passport/companions/family.webp", alt: "Family spending time together while travelling" },
  { title: "Global Escapes", copy: "For the joy of stepping into a world that feels wonderfully new.", image: "/images/journey-passport/dream-journeys/city-discovery.webp", alt: "Traveller discovering a new city" },
  { title: "Nature & Serenity", copy: "For slower mornings, open views and a little room to breathe.", image: "/images/journey-passport/travel-styles/nature.webp", alt: "Quiet natural landscape for a slower journey" },
  { title: "Weekend Getaways", copy: "For a thoughtful pause when a few days can change your rhythm.", image: "/images/journey-passport/timing/within-next-month.webp", alt: "Traveller preparing for a short escape" },
] as const;

const homepageInvitations = invitations.slice(0, 3);

export default function JourneyInvitations() {
  return (
    <section className="layout-section" aria-labelledby="journey-invitations-heading">
      <div className="layout-container">
        <div className="layout-section-heading"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A211C]">Begin with what matters</p><h2 id="journey-invitations-heading" className="mt-4 text-balance font-serif text-4xl leading-[1.06] tracking-[-0.045em] sm:text-5xl">What kind of time are you hoping to make?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#2A211C]">You do not need every detail yet. Begin with the feeling, the people or the moment that is calling you.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {homepageInvitations.map((invitation, index) => <article key={invitation.title} className={`group relative min-h-[27rem] overflow-hidden rounded-[2rem] bg-[#2A211C] shadow-[0_18px_45px_rgba(86,55,22,0.14)] ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}><Image src={invitation.image} alt={invitation.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"/><div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,17,9,.92),rgba(28,17,9,.12)_76%)]" aria-hidden="true"/><div className="absolute inset-x-0 bottom-0 px-8 pb-9 pt-16 text-white"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F5951C]">A journey invitation</p><h3 className="mt-4 font-serif text-3xl leading-[1.1] tracking-[-0.04em]">{invitation.title}</h3><p className="mt-4 max-w-sm text-sm leading-7 text-white/85">{invitation.copy}</p><Link href={`/journey-passport?experience=${encodeURIComponent(invitation.title)}`} className="mt-6 inline-flex text-sm font-bold text-[#F5951C] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]">Explore this experience <span aria-hidden="true">→</span></Link></div></article>)}
        </div>
        <div className="mt-10 text-center"><Link href="/experiences" className="inline-flex rounded-full border border-[#F5951C] bg-white/55 px-6 py-3 text-sm font-bold text-[#2A211C] transition hover:bg-[#F5951C] hover:text-[#2A211C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A211C]">Explore All Experiences <span aria-hidden="true" className="ml-2">→</span></Link></div>
      </div>
    </section>
  );
}
