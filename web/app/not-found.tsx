import Link from "next/link";
import SiteBrand from "@/components/brand/SiteBrand";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid min-h-screen place-items-center overflow-hidden bg-[#2A211C] px-6 py-16 text-center text-white">
        <section className="relative max-w-2xl rounded-[2rem] border border-white/15 bg-white/[.06] px-7 py-12 shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-14">
          <SiteBrand variant="compact" surface="dark" linked={false} preload className="mx-auto max-w-56" />
          <p className="mt-9 text-xs font-bold uppercase tracking-[.2em] text-[#F5951C]">A small detour</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight tracking-[-.045em] sm:text-5xl">Looks like this journey took an unexpected turn.</h1>
          <p className="mx-auto mt-5 max-w-lg leading-8 text-white/70">The page you were looking for is not here, but a thoughtful journey can always begin again.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="rounded-full border border-white/45 px-6 py-3 text-sm font-bold transition hover:bg-white/10">Return home</Link>
            <Link href="/journey-passport" className="rounded-full bg-[#F5951C] px-6 py-3 text-sm font-bold text-[#2A211C] transition hover:bg-[#F5951C]">Begin your Journey Passport</Link>
          </div>
        </section>
      </main>
    </>
  );
}
