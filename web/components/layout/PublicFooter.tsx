import Link from "next/link";

import SiteBrand from "@/components/brand/SiteBrand";
import SocialLinks from "@/components/contact/SocialLinks";
import WhatsAppLink from "@/components/contact/WhatsAppLink";
import { siteBrand } from "@/config/brand.config";
import { siteContact } from "@/config/contact.config";

import Container from "./Container";

// R1.2-009 (Workstream 2 — Experiences vs Journey Mood Rationalisation): the
// "Experiences" entry is removed from the "Discover" group per DEC-R1.2-009 /
// DEC-R1.2-012 — Experiences is retired from every intentional site-wide
// discovery path (Header, Homepage, Footer), not only the Homepage and
// Header. The /experiences route and its page implementation are untouched
// and preserved for future reuse; only this footer link is removed. See
// docs/09-Development/EBCR1.2-009-EXPERIENCES-RETIREMENT-IMPLEMENTATION.md.
const links = [
  { title: "Discover", items: [["Destinations", "/destinations"], ["Travel Inspiration", "/travel-inspiration"], ["Plan My Experience", "/journey-passport"]] },
  { title: "About", items: [["About Us", "/about"], ["Our Promise", "/about#our-promise"], ["Contact Us", "/contact"]] },
  { title: "Support", items: [["Privacy Policy", "/privacy-policy"], ["Terms and Conditions", "/terms-and-conditions"]] },
] as const;

export default function PublicFooter() {
  return (
    <footer className="bg-[#2A211C] text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <SiteBrand variant="footer" surface="dark" className="max-w-[21rem] text-[#F5951C]" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">Thoughtful travel planning begins with understanding the person taking the journey.</p>
        </div>
        {links.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#F5951C]">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.items.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-white/75 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]">{label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#F5951C]">Connect</h2>
          <div className="mt-4 space-y-4 text-sm text-white/75">
            <WhatsAppLink compact/>
            <a href={siteContact.primaryPhoneHref} className="flex min-h-11 items-center leading-6 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]">Phone: {siteContact.phoneDisplay}</a>
            <a href={siteContact.emailHref} className="flex min-h-11 items-center hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]">{siteContact.email}</a>
            <p>{siteContact.officeHours}</p>
            <SocialLinks className="pt-1" />
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10"><Container className="py-5 text-center text-xs text-white/55">© 2026 {siteBrand.name}. All rights reserved.</Container></div>
    </footer>
  );
}
