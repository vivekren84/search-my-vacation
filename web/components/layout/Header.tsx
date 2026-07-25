"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site.config";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 24);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/15 bg-[#20150f]/90 shadow-lg shadow-black/15 backdrop-blur-md"
          : "bg-[#20150f]/90 md:bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-28 max-w-7xl flex-wrap items-center justify-between gap-x-4 px-5 py-3 sm:px-6 md:h-24 md:min-h-0 md:flex-nowrap md:py-0 lg:px-10">
        <Link href="/" aria-label="Search My Vacation home" className="flex shrink-0 items-center">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={78}
            height={70}
            priority
            className="h-[3.75rem] w-auto object-contain"
          />
        </Link>

        <div className="order-3 flex w-full min-w-0 flex-col border-t border-white/25 pt-2 text-left md:order-none md:w-auto md:shrink-0 md:border-l md:border-t-0 md:py-0 md:pl-4">
          <p className="whitespace-nowrap text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white min-[360px]:text-[0.74rem] min-[360px]:tracking-[0.17em] md:text-[0.8rem]">
            {siteConfig.name}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[0.62rem] font-medium tracking-[0.02em] text-[#f3c681] min-[360px]:text-[0.67rem] min-[360px]:tracking-[0.035em]">
            {siteConfig.tagline}
          </p>
        </div>

        <nav aria-label="Primary navigation" className="hidden flex-1 justify-end lg:flex xl:justify-center">
          <ul className="flex items-center gap-8 md:gap-12">
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

        <Link href="/journey-passport" className="hidden rounded-full bg-[#f3c681] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#20150f] transition hover:bg-[#ffe0a5] lg:inline-flex">
          Plan My Experience
        </Link>

        <div className="relative ml-auto lg:hidden">
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
              className="absolute right-0 top-[calc(100%+3.25rem)] w-60 rounded-2xl border border-white/15 bg-[#20150f]/95 p-2 shadow-xl shadow-black/25 backdrop-blur-md md:top-[calc(100%+0.75rem)]"
            >
              <ul>
                {siteConfig.navigation.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
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
      </div>
    </header>
  );
}
