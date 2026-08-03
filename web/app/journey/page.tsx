import Header from "@/components/layout/Header";
import PublicFooter from "@/components/layout/PublicFooter";
import HeroJourney from "@/components/sections/HeroJourney/HeroJourney";

export default function Home() {
  return (
    <>
      <Header />
      <main><HeroJourney /></main>
      <PublicFooter />
    </>
  );
}
