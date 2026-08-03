"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import SiteBrand from "@/components/brand/SiteBrand";
import { siteConfig } from "@/config/site.config";
import Container from "./Container";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky inset-x-0 top-0 z-50 border-b border-white/15 bg-[#20150f]/95 shadow-[0_4px_18px_rgba(32,21,15,.12)] backdrop-blur-md"
    >
      <Container className="flex min-h-[5.5rem] items-center justify-between gap-4 py-3 xl:min-h-32 xl:py-2">
        <SiteBrand
          variant="header"
          surface="dark"
          preload
          className="w-[clamp(11rem,48vw,14rem)] shrink-0 text-white xl:w-[clamp(19rem,24vw,21rem)]"
        />

        <nav aria-label="Primary navigation" className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-6 2xl:gap-8">
            {siteConfig.navigation.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:text-white/75"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/journey-passport" className="hidden shrink-0 rounded-full bg-[#f3c681] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#20150f] transition hover:bg-[#ffe0a5] xl:inline-flex">
          Plan My Experience
        </Link>

        <div className="relative ml-auto xl:hidden">
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Menu
            <span aria-hidden="true" className="h-3 w-4 border-y border-current" />
          </button>

          {isMenuOpen ? (
            <nav
              id="mobile-primary-navigation"
              aria-label="Mobile primary navigation"
              className="absolute right-0 top-[calc(100%+0.75rem)] w-60 rounded-2xl border border-white/15 bg-[#20150f]/95 p-2 shadow-xl shadow-black/25 backdrop-blur-md"
            >
              <ul>
                {siteConfig.navigation.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li><Link href="/journey-passport" onClick={() => setIsMenuOpen(false)} className="mt-1 block rounded-xl bg-[#f3c681] px-4 py-3 text-sm font-bold text-[#20150f]">Plan My Experience</Link></li>
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
