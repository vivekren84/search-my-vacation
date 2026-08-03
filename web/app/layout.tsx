import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { siteBrand } from "@/config/brand.config";
import { siteContact } from "@/config/contact.config";
import { JourneySessionProvider } from "@/context/JourneySessionContext";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

export const metadata: Metadata = {
  title: {
    default: siteBrand.name,
    template: `%s | ${siteBrand.name}`,
  },
  description: siteBrand.tagline,
  applicationName: siteBrand.name,
  openGraph: {
    title: siteBrand.name,
    description: siteBrand.tagline,
    siteName: siteBrand.name,
    type: "website",
  },
  icons: {
    icon: [
      { url: siteBrand.assets.favicon, type: "image/svg+xml" },
      { url: "/brand/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: siteBrand.assets.favicon,
    apple: siteBrand.assets.appleTouchIcon,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteBrand.name,
  description: siteBrand.tagline,
  email: siteContact.email,
  telephone: "+91 89258 38541",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteContact.address.streetAddress,
    addressLocality: siteContact.address.locality,
    addressRegion: siteContact.address.region,
    postalCode: siteContact.address.postalCode,
    addressCountry: siteContact.address.countryCode,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <JourneySessionProvider>{children}</JourneySessionProvider>
      </body>
    </html>
  );
}
