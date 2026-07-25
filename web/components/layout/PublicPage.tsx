import type { ReactNode } from "react";
import Header from "./Header";
import PublicFooter from "./PublicFooter";

export default function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><Header/><main className="bg-[#fbf7ef] pt-28 text-[#2d2117]"><section className="border-b border-[#e8d7bd] bg-[radial-gradient(circle_at_top_left,#f7dfb4,transparent_46%),#fbf7ef]"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#96652b]">{eyebrow}</p><h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#705c47]">{intro}</p></div></section>{children}</main><PublicFooter/></>;
}
