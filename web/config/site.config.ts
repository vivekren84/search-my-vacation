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

  navigation: [
    { label: "Destinations", href: "/destinations" },
    { label: "Experiences", href: "/experiences" },
    { label: "Travel Inspiration", href: "/travel-inspiration" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
