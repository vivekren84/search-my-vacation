import Image from "next/image";
import Link from "next/link";

export type EditorialCardItem = {
  title: string;
  label: string;
  copy: string;
  image: string;
  alt: string;
  prompt?: string;
};

export function EditorialCardGrid({ items, tone = "light" }: { items: EditorialCardItem[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.title} className={`group overflow-hidden rounded-[1.5rem] border ${dark ? "border-white/15 bg-white/5" : "border-[#e4d2b5] bg-white shadow-[0_10px_28px_rgba(91,55,18,.06)]"}`}><div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"/></div><div className="p-6"><p className={`text-[0.68rem] font-bold uppercase tracking-[.15em] ${dark ? "text-[#f3c681]" : "text-[#96652b]"}`}>{item.label}</p><h3 className={`mt-3 font-serif text-3xl leading-none tracking-[-.035em] ${dark ? "text-white" : "text-[#2d2117]"}`}>{item.title}</h3><p className={`mt-3 text-sm leading-7 ${dark ? "text-white/72" : "text-[#705c47]"}`}>{item.copy}</p>{item.prompt ? <p className={`mt-5 border-t pt-4 text-sm italic leading-6 ${dark ? "border-white/15 text-white/62" : "border-[#eadcc8] text-[#80664d]"}`}>{item.prompt}</p> : null}</div></article>)}</div>;
}

export function EditorialContinuation({ eyebrow, title, copy, label }: { eyebrow: string; title: string; copy: string; label: string }) {
  return <section className="px-6 pb-20 sm:px-8 lg:px-10 lg:pb-28"><div className="mx-auto max-w-4xl rounded-[2rem] bg-[#2d2117] p-8 text-center text-white shadow-[0_18px_45px_rgba(55,31,13,.18)] sm:p-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f3c681]">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl leading-[1.03] tracking-[-.045em] sm:text-5xl">{title}</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/72">{copy}</p><Link href="/journey-passport" className="mt-8 inline-flex rounded-full bg-[#f3c681] px-7 py-3 text-sm font-bold text-[#2d2117] transition hover:bg-[#ffe1a5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c681]">{label} <span aria-hidden="true" className="ml-2">→</span></Link></div></section>;
}
