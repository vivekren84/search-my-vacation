import type { MetadataRoute } from "next";

import { siteBrand } from "@/config/brand.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteBrand.name,
    short_name: siteBrand.shortName,
    description: siteBrand.tagline,
    start_url: "/",
    display: "standalone",
    background_color: siteBrand.colours.cream,
    theme_color: siteBrand.colours.espresso,
    icons: [
      { src: siteBrand.assets.appIcon192, sizes: "192x192", type: "image/png" },
      { src: siteBrand.assets.appIcon512, sizes: "512x512", type: "image/png" },
    ],
  };
}
