/**
 * Home Page
 *
 * Purpose:
 * Serves as the landing page for Search My Vacation.
 * The homepage owns its own composition so that the
 * Hero can provide an immersive first impression.
 */

import { Hero } from "@/components";
import Experiences from "@/components/sections/Experiences";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Experiences />
      </main>
    </>
  );
}
