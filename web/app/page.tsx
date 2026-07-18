/**
 * Home Page
 *
 * Purpose:
 * Serves as the landing page for Search My Vacation.
 * The homepage owns its own composition so that the
 * Hero can provide an immersive first impression.
 */

import { Header, Hero } from "@/components";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}