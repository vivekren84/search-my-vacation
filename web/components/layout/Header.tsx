"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import SiteBrand from "@/components/brand/SiteBrand";
import { siteConfig } from "@/config/site.config";
import Container from "./Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [staffSession, setStaffSession] = useState<{ fullName: string; role: string; email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("smv_staff_session");
      if (raw) {
        setStaffSession(JSON.parse(raw));
      }
    } catch {}
  }, []);

  function handleStaffSignOut() {
    try {
      localStorage.removeItem("smv_staff_session");
      setStaffSession(null);
      window.location.reload();
    } catch {}
  }

  return (
    <header
      className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0E0D0C]/95 dark:bg-[#09090B]/95 shadow-[0_4px_18px_rgba(0,0,0,.2)] backdrop-blur-md transition-colors duration-200"
    >
      <Container variant="wide" className="flex min-h-[5.5rem] items-center justify-between gap-4 py-3 xl:min-h-32 xl:py-2">
        <Link href="/" className="inline-block">
          <SiteBrand
            variant="header"
            surface="dark"
            preload
            className="w-[clamp(11rem,48vw,14rem)] shrink-0 text-white xl:w-[clamp(14rem,20vw,21rem)]"
          />
        </Link>

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
          {staffSession ? (
            <div className="flex items-center gap-2">
              <Link
                href="/portal/dashboard"
                className="flex items-center gap-2 rounded-full border border-[#F5951C]/60 bg-[#F5951C]/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#F5951C]/20 transition shadow"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-[#F5951C]">
                  {staffSession.fullName.split(" ")[0]} ({staffSession.role === "super_admin" ? "Super Admin" : staffSession.role.replace("_", " ")})
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70 hidden sm:inline">
                  • Advisor Dashboard ➔
                </span>
              </Link>
              <button
                onClick={handleStaffSignOut}
                className="hidden md:inline-flex text-[11px] text-white/50 hover:text-[#F5951C] px-2 py-1 rounded transition"
                title="Sign Out of Advisor Workspace"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
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
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0E0D0C] dark:bg-[#09090B] px-2 py-1 text-[10px] font-medium text-[#F5951C] border border-white/10 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-50">
                  Coming Soon
                </span>
              </div>
            </>
          )}

          <ThemeToggle variant="compact" />

          <Link
            href="/journey-passport"
            className="hidden shrink-0 whitespace-nowrap rounded-full bg-[#F5951C] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#0E0D0C] transition hover:bg-[#F5951C]/90 lg:inline-flex"
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
                className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-2xl border border-white/15 bg-[#0E0D0C]/98 dark:bg-[#09090B]/98 p-2 shadow-xl shadow-black/25 backdrop-blur-md"
              >
                <ul>
                  {staffSession && (
                    <li className="p-2.5 mb-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <p className="text-[10px] uppercase tracking-wider text-[#F5951C] font-semibold">Active Advisor Session</p>
                      <p className="font-bold text-white mt-0.5">{staffSession.fullName}</p>
                      <Link
                        href="/portal/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2 block text-center rounded-lg bg-[#F5951C] py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0E0D0C]"
                      >
                        Open Advisor Portal
                      </Link>
                    </li>
                  )}
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
                  {!staffSession && (
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
                  )}
                  {staffSession && (
                    <li className="pt-2 border-t border-white/10 mt-2">
                      <button
                        onClick={handleStaffSignOut}
                        className="w-full text-left rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-[#F5951C] transition"
                      >
                        Sign Out
                      </button>
                    </li>
                  )}
                  <li className="lg:hidden mt-2">
                    <Link
                      href="/journey-passport"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-1 block rounded-xl bg-[#F5951C] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-[#0E0D0C]"
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
