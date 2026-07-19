/**
 * Hero
 *
 * Purpose:
 * Creates the immersive first impression of Search My Vacation.
 * The Hero owns the first viewport and layers the content over
 * the Golden Hour background image.
 */

import Link from "next/link";

import { Container, Header } from "@/components";

import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100svh+7.5rem)] overflow-hidden" aria-labelledby="hero-heading">
      <HeroImage />

      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(27,17,12,0.78)_0%,rgba(27,17,12,0.49)_43%,rgba(27,17,12,0.13)_100%),linear-gradient(0deg,rgba(27,17,12,0.55)_0%,transparent_42%)]"
        aria-hidden="true"
      />

      <Header />

      <div className="relative z-10 flex min-h-[calc(100svh+7.5rem)] items-center">
        <Container>
          <div className="max-w-2xl py-36 sm:py-40 lg:py-44 lg:pl-8 xl:pl-14">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f3c681] sm:text-sm">
              More Than a Trip. It&apos;s an Experience.
            </p>

            <h1 id="hero-heading" className="mt-5 max-w-[39rem] text-balance font-serif text-5xl font-normal leading-[0.98] tracking-[-0.045em] text-white md:text-6xl lg:text-7xl">
              Every great journey begins with understanding you.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/90 sm:text-lg lg:text-xl">
              Share what matters to you, and our travel experts will thoughtfully
              curate a journey that feels personal, effortless, and confidently yours.
            </p>

            <Link
              href="#experiences"
              className="mt-12 inline-flex min-h-16 items-center justify-center rounded-full bg-[#f3c681] px-9 text-base font-bold text-[#25180f] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ffe1ab] hover:shadow-lg hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c681] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Plan My Experience <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </Container>
      </div>

      <a
        href="#experiences"
        className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 transition hover:text-white sm:inline-flex lg:bottom-10 lg:right-10"
      >
        Discover what inspires you
        <span aria-hidden="true" className="h-px w-10 bg-current" />
      </a>
    </section>
  );
}
