import { siteBrand } from "./brand.config";

/**
 * Global Site Configuration
 *
 * Purpose:
 * Contains application-wide branding and metadata.
 * This file acts as the single source of truth for
 * the Search My Vacation brand.
 */

export const siteConfig = {
  ...siteBrand,

  description:
    "Every traveller is unique. Every journey should be too.",

  // R1.2-009 (Workstream 2 — Experiences vs Journey Mood Rationalisation):
  // "Experiences" removed from Primary Navigation per DEC-R1.2-009. The
  // /experiences route, its page implementation and its Journey Passport
  // wiring are all preserved untouched for future reuse — only this nav
  // entry (consumed by Header.tsx, desktop and mobile) is removed. See
  // docs/09-Development/EBCR1.2-009-EXPERIENCES-RETIREMENT-IMPLEMENTATION.md.
  navigation: [
    { label: "Destinations", href: "/destinations" },
    { label: "Traveller Stories", href: "/traveller-stories" },
    { label: "Travel Inspiration", href: "/travel-inspiration" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
