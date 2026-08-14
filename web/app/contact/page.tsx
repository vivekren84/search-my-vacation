import type { Metadata } from "next";

import CallbackRequest from "@/components/contact/CallbackRequest";
import SiteAddress from "@/components/contact/SiteAddress";
import WhatsAppLink from "@/components/contact/WhatsAppLink";
import PublicPage from "@/components/layout/PublicPage";
import { siteContact } from "@/config/contact.config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Tell us where you are in your travel planning, and we will help you take the next step.",
};

export default function ContactPage() {
  const whatsappHref = `${siteContact.whatsappHref}?text=Hello%20Search%20My%20Vacation%2C%20I%E2%80%99d%20like%20to%20talk%20about%20a%20journey.`;

  return (
    <PublicPage
      eyebrow="Contact Search My Vacation"
      title="Tell us where you are in your travel planning."
      intro="Whether you are ready to shape a journey or simply want to talk through an idea, we will help you take the next step."
    >
      <div className="layout-container layout-section">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="rounded-[2rem] bg-[#FFFDFC] p-[clamp(2rem,5vw,3.25rem)] text-center">
            <WhatsAppLink href={whatsappHref} className="mx-auto" />
            <div className="mt-10 space-y-8 text-[#2A211C]">
              <div>
                <h2 className="font-semibold text-[#2A211C]">Phone</h2>
                <a className="mt-2 inline-flex min-h-11 items-center font-semibold text-[#2A211C] underline decoration-[#F5951C] underline-offset-4" href={siteContact.primaryPhoneHref}>{siteContact.phoneDisplay}</a>
              </div>
              <div>
                <h2 className="font-semibold text-[#2A211C]">Email</h2>
                <a className="mt-2 inline-flex min-h-11 items-center underline" href={siteContact.emailHref}>{siteContact.email}</a>
              </div>
              <div>
                <h2 className="font-semibold text-[#2A211C]">Visit us</h2>
                <SiteAddress className="mt-2 leading-7" />
              </div>
              <div>
                <h2 className="font-semibold text-[#2A211C]">Office visits</h2>
                <p className="mt-2 leading-7">By prior appointment only<br/>Monday–Saturday • 10:00 AM–7:00 PM IST</p>
                <p className="mt-3 leading-7">We usually respond within four business hours.</p>
              </div>
            </div>
          </section>
          <CallbackRequest/>
        </div>
      </div>
    </PublicPage>
  );
}
