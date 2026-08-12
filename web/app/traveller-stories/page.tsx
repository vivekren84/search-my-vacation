import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";
import { EditorialContinuation } from "@/components/discovery/EditorialCards";
import { TravellerStoryGrid } from "@/components/discovery/TravellerStoryCards";
import { getApprovedTravellerJourneys } from "@/lib/traveller-stories/getTravellerJourneys";
import { siteBrand } from "@/config/brand.config";

const PAGE_TITLE = "Traveller Stories";
const PAGE_DESCRIPTION =
  "Every journey we've helped shape, told by the travellers who lived it. Explore real stories from Search My Vacation travellers.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/traveller-stories",
  },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteBrand.name}`,
    description: PAGE_DESCRIPTION,
    url: "/traveller-stories",
    type: "website",
    images: [{ url: siteBrand.assets.openGraphImage, width: 1200, height: 630, alt: siteBrand.accessibleLabel }],
  },
};

export default async function TravellerStoriesPage() {
  const journeys = await getApprovedTravellerJourneys();

  return (
    <PublicPage
      eyebrow="Traveller Stories"
      title="Every journey leaves a story worth telling."
      intro="These are not reviews. They are moments shared by the people who lived them, lightly edited only for clarity."
    >
      <section className="layout-section pt-0" aria-labelledby="traveller-stories-listing-heading">
        <div className="layout-container">
          <h2 id="traveller-stories-listing-heading" className="sr-only">
            All traveller stories
          </h2>

          <TravellerStoryGrid journeys={journeys} />
        </div>
      </section>

      <EditorialContinuation
        eyebrow="Your story, waiting to begin"
        title="The next journey worth telling could be yours."
        copy="Share what you're hoping to feel, and let's shape a journey worth remembering."
        label="Plan My Experience"
      />
    </PublicPage>
  );
}
