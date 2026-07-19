"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site.config";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Search My Vacation home" className="flex shrink-0 items-center rounded-2xl bg-black/10 p-1 backdrop-blur-[2px]">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={78}
            height={70}
            priority
            className="h-[3.75rem] w-auto object-contain"
          />
        </Link>

        <nav className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-12">
            {siteConfig.navigation.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:text-white/75"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative lg:hidden">
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
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
