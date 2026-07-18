/**
 * Hero
 *
 * Purpose:
 * Creates the immersive first impression of Search My Vacation.
 * The Hero owns the first viewport and layers the content over
 * the Golden Hour background image.
 */

import { Button, Container } from "@/components";
import { siteConfig } from "@/config/site.config";

import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <HeroImage />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <Container>
          <div className="max-w-2xl pt-24 lg:pt-28">

            {/* Heading */}

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.02em] text-white md:text-6xl lg:text-7xl">
              More Than a Trip.
              <br />
              <span className="text-white/95">
                It's an Experience.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-10 max-w-xl text-lg leading-8 text-white/85 lg:text-xl">
              {siteConfig.description}
            </p>

            {/* Actions */}

            <div className="mt-14 flex flex-wrap items-center gap-5">
              <Button size="lg">
                Plan My Journey
              </Button>

              <Button
                variant="secondary"
                size="lg"
              >
                Explore Destinations
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}