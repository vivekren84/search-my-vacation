import Header from "@/components/layout/Header";
import PublicFooter from "@/components/layout/PublicFooter";
import HeroJourney from "@/components/sections/HeroJourney/HeroJourney";
import HomepageExperience from "@/components/sections/HomepageExperience/HomepageExperience";

export default function Home() {
  return (
    <>
      <Header />
      <div aria-hidden="true" className="h-28 md:hidden" />
      <main>
        <HeroJourney />
        <HomepageExperience />
      </main>
      <PublicFooter />
    </>
  );
}
