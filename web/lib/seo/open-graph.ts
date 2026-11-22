/**
 * Search My Vacation — Schema.org & Open Graph SEO Metadata Engine (Release 1.5 — GAP-05)
 *
 * Authored for Vivek Renganathan (Product Owner) & Tiger (CTO)
 * Generates structured Schema.org TouristDestination / TravelAgency metadata
 * and rich Open Graph social cards optimized for WhatsApp sharing.
 */

export interface OpenGraphRegionalConfig {
  slug: string;
  destinationName: string;
  regionalTitle: string;
  description: string;
  coverImageUrl: string;
  currency?: string;
}

export function generateRegionalOpenGraphMetadata(config: OpenGraphRegionalConfig) {
  const canonicalUrl = `https://searchmyvacation.com/destinations/${config.slug}`;
  const absoluteImageUrl = config.coverImageUrl.startsWith("http")
    ? config.coverImageUrl
    : `https://searchmyvacation.com${config.coverImageUrl}`;

  return {
    title: `${config.regionalTitle} | Search My Vacation`,
    description: config.description,
    canonical: canonicalUrl,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${config.destinationName} — Curated Itineraries | Search My Vacation`,
      description: config.description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `Bespoke travel experience in ${config.destinationName}`,
        },
      ],
      siteName: "Search My Vacation",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.destinationName} | Search My Vacation`,
      description: config.description,
      images: [absoluteImageUrl],
    },
  };
}

export function generateSchemaOrgTouristDestination(config: OpenGraphRegionalConfig): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: config.destinationName,
    description: config.description,
    image: config.coverImageUrl,
    url: `https://searchmyvacation.com/destinations/${config.slug}`,
    provider: {
      "@type": "TravelAgency",
      name: "Search My Vacation",
      url: "https://searchmyvacation.com",
      telephone: "+91-98201-44821",
      email: "bookings@searchmyvacation.com",
      priceRange: "$$$$",
    },
    touristType: ["Heritage Travellers", "Multi-Generational Families", "Bespoke Explorers"],
  };
}
