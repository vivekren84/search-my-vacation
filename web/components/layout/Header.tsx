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
      className="sticky inset-x-0 top-0 z-50 border-b border-white/15 bg-[#2A211C]/95 shadow-[0_4px_18px_rgba(32,21,15,.12)] backdrop-blur-md"
    >
      <Container variant="wide" className="flex min-h-[5.5rem] items-center justify-between gap-4 py-3 xl:min-h-32 xl:py-2">
        <SiteBrand
          variant="header"
          surface="dark"
          preload
          className="w-[clamp(11rem,48vw,14rem)] shrink-0 text-white xl:w-[clamp(14rem,20vw,21rem)]"
        />

        <nav aria-label="Primary navigation" className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-5 2xl:gap-8">
            {siteConfig.navigation.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="whitespace-nowrap text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:text-white/75"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5 xl:ml-0">
          <Link
            href="/portal/login"
            className="hidden shrink-0 whitespace-nowrap rounded-full border border-white/30 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:border-[#F5951C] hover:text-[#F5951C] md:inline-flex"
          >
            Sign In
          </Link>

          <div className="relative group hidden md:inline-flex">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="cursor-not-allowed opacity-50 shrink-0 whitespace-nowrap rounded-full border border-white/15 px-3.5 py-2 text-xs font-medium uppercase tracking-[0.1em] text-white/60"
            >
              Sign Up
            </button>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#2A211C] px-2 py-1 text-[10px] font-medium text-[#F5951C] border border-white/10 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-50">
              Coming Soon
            </span>
          </div>

          <Link
            href="/journey-passport"
            className="hidden shrink-0 whitespace-nowrap rounded-full bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#2A211C] transition hover:bg-[#F5951C] lg:inline-flex"
          >
            Plan My Experience
          </Link>

          <div className="relative xl:hidden">
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
                className="absolute right-0 top-[calc(100%+0.75rem)] w-60 rounded-2xl border border-white/15 bg-[#2A211C]/95 p-2 shadow-xl shadow-black/25 backdrop-blur-md"
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
                  <li className="mt-2 border-t border-white/10 pt-2 flex flex-col gap-2 md:hidden">
                    <Link
                      href="/portal/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-xl border border-white/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.1em] text-white hover:border-[#F5951C] hover:text-[#F5951C]"
                    >
                      Sign In
                    </Link>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="w-full cursor-not-allowed opacity-50 rounded-xl border border-white/15 px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.1em] text-white/60"
                    >
                      Sign Up (Coming Soon)
                    </button>
                  </li>
                  <li className="lg:hidden">
                    <Link
                      href="/journey-passport"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-1 block rounded-xl bg-[#F5951C] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-[#2A211C]"
                    >
                      Plan My Experience
                    </Link>
                  </li>
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
