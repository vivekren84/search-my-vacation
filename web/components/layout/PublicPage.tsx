import type { ReactNode } from "react";
import Header from "./Header";
import PublicFooter from "./PublicFooter";
import Container from "./Container";

export default function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><Header/><main className="bg-[#FFFDFC] text-[#2A211C]"><section className="border-b border-[#e8d7bd] bg-[radial-gradient(circle_at_50%_0%,#f7dfb4,transparent_48%),#FFFDFC]"><Container className="py-16 sm:py-20 lg:py-24"><div className="layout-intro"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2A211C]">{eyebrow}</p><h1 className="mt-5 text-balance font-serif text-[clamp(2.75rem,6vw,4.5rem)] font-normal leading-[1.03] tracking-[-.05em]">{title}</h1><p className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.6vw,1.125rem)] leading-8 text-[#2A211C]">{intro}</p></div></Container></section>{children}</main><PublicFooter/></>;
}
