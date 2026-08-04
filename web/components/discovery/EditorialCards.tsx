import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";

export type EditorialCardItem = {
  destinationId?: string;
  title: string;
  label: string;
  copy: string;
  image: string;
  alt: string;
  prompt?: string;
  passportHref?: string;
  passportLabel?: string;
};

function anchorFor(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function EditorialCardGrid({ items, tone = "light", selectedId, onSelect, detailId }: { items: EditorialCardItem[]; tone?: "light" | "dark"; selectedId?: string; onSelect?: (item: EditorialCardItem, trigger: HTMLButtonElement) => void; detailId?: string }) {
  const dark = tone === "dark";
  return <div className="mx-auto grid max-w-[72rem] items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => { const isSelected = Boolean(item.destinationId && selectedId === item.destinationId); return <article id={anchorFor(item.title)} key={item.title} className={`group flex min-w-0 scroll-mt-32 flex-col overflow-hidden rounded-[1.75rem] border ${dark ? "border-white/15 bg-white/5" : isSelected ? "border-[#280336] bg-white shadow-[0_18px_42px_rgba(91,55,18,.13)]" : "border-[#e4d2b5] bg-white shadow-[0_14px_34px_rgba(91,55,18,.07)]"}`}><div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"/></div><div className="flex flex-1 flex-col px-8 pb-10 pt-8 sm:px-9 sm:pb-11 sm:pt-9"><p className={`text-[0.68rem] font-bold uppercase tracking-[.15em] ${dark ? "text-[#F5951C]" : "text-[#B72027]"}`}>{item.label}</p><h3 className={`mt-4 font-serif text-3xl leading-[1.12] tracking-[-.035em] ${dark ? "text-white" : "text-[#2A211C]"}`}>{item.title}</h3><p className={`mt-4 text-[0.925rem] leading-7 ${dark ? "text-white/72" : "text-[#2A211C]"}`}>{item.copy}</p>{item.prompt ? <p className={`mt-6 border-t pt-5 text-sm italic leading-7 ${dark ? "border-white/15 text-white/62" : "border-[#eadcc8] text-[#80664d]"}`}>{item.prompt}</p> : null}{item.passportHref ? <Link href={item.passportHref} className={`mt-auto inline-flex min-h-12 items-center justify-between border-t pt-6 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 ${dark ? "border-white/15 text-[#F5951C] focus-visible:outline-[#F5951C]" : "border-[#eadcc8] text-[#8a581f] focus-visible:outline-[#280336]"}`}>{item.passportLabel ?? "Begin with this idea"}<span aria-hidden="true">→</span></Link> : null}{onSelect && item.destinationId ? <button type="button" onClick={(event) => onSelect(item, event.currentTarget)} aria-haspopup="dialog" aria-expanded={isSelected} aria-controls={detailId} className={`mt-auto inline-flex min-h-12 items-center justify-between border-t pt-6 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 ${dark ? "border-white/15 text-[#F5951C] focus-visible:outline-[#F5951C]" : "border-[#eadcc8] text-[#8a581f] focus-visible:outline-[#280336]"}`}>{isSelected ? "Journey details open" : "Explore suggested journeys"}<span aria-hidden="true">{isSelected ? "✓" : "→"}</span></button> : null}</div></article>; })}</div>;
}

export function EditorialContinuation({ eyebrow, title, copy, label, closingChapter = false }: { eyebrow: string; title: string; copy: string; label: string; closingChapter?: boolean }) {
  return <section className={closingChapter ? "pt-[clamp(6rem,10vw,9rem)] pb-[clamp(5rem,8vw,7rem)]" : "pb-[var(--layout-section-space)]"}><Container variant="reading"><div className="rounded-[2rem] bg-[#2A211C] p-[clamp(2rem,5vw,3.5rem)] text-center text-white shadow-[0_18px_45px_rgba(55,31,13,.18)]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F5951C]">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-[-.045em] sm:text-5xl">{title}</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/72">{copy}</p><Link href="/journey-passport" className="mt-8 inline-flex rounded-full bg-[#F5951C] px-7 py-3 text-sm font-bold text-[#2A211C] transition hover:bg-[#F5951C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]">{label} <span aria-hidden="true" className="ml-2">→</span></Link></div></Container></section>;
}
