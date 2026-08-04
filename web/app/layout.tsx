import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { siteBrand } from "@/config/brand.config";
import { siteContact } from "@/config/contact.config";
import { JourneySessionProvider } from "@/context/JourneySessionContext";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-utility",
  weight: ["500", "600", "700"],
});

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "localhost:3000";
const metadataBase = new URL(deploymentHost.startsWith("localhost") ? `http://${deploymentHost}` : `https://${deploymentHost}`);

export const metadata: Metadata = {
  metadataBase,
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
    images: [{ url: siteBrand.assets.openGraphImage, width: 1200, height: 630, alt: siteBrand.accessibleLabel }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteBrand.name,
    description: siteBrand.tagline,
    images: [siteBrand.assets.openGraphImage],
  },
  icons: {
    icon: [
      { url: siteBrand.assets.favicon, sizes: "any", type: "image/x-icon" },
      { url: siteBrand.assets.favicon32, sizes: "32x32", type: "image/png" },
      { url: siteBrand.assets.favicon16, sizes: "16x16", type: "image/png" },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <JourneySessionProvider>{children}</JourneySessionProvider>
      </body>
    </html>
  );
}
