import Header from "@/components/layout/Header";
import PublicFooter from "@/components/layout/PublicFooter";
import HeroJourney from "@/components/sections/HeroJourney/HeroJourney";
import HomepageExperience from "@/components/sections/HomepageExperience/HomepageExperience";
import { getHomepageTravellerStories } from "@/lib/traveller-stories/getHomepageTravellerStories";

export default async function Home() {
  // Homepage Traveller Stories Curated Preview (Release 1.1): fetched here,
  // server-side, from the same canonical journey data the dedicated
  // /traveller-stories page uses — never a separate homepage-only dataset —
  // then passed down as a plain serialisable prop into the client-rendered
  // HomepageExperience tree below.
  const homepageTravellerStories = await getHomepageTravellerStories();

  return (
    <>
      <Header />
      <main>
        <HeroJourney />
        <HomepageExperience travellerStories={homepageTravellerStories} />
      </main>
      <PublicFooter />
    </>
  );
}
