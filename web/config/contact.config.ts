export const siteContact = {
  phoneDisplay: "+91 89258 38541 / 42 / 43",
  primaryPhoneHref: "tel:+918925838541",
  whatsappHref: "https://wa.me/918925838541",
  email: "bookings@searchmyvacation.com",
  emailHref: "mailto:bookings@searchmyvacation.com",
  officeHours: "Monday–Saturday, 10:00 AM–7:00 PM IST",
  googleReviewsUrl: "https://g.page/r/CeizepY2VZZ0EBM/review",
  /**
   * Release 1.1 — Footer Social Icons Finalisation: single canonical source
   * for SMV's official social profile URLs. Referenced only by
   * `components/contact/SocialLinks.tsx` — never hardcode these elsewhere.
   */
  socialLinks: {
    instagram: "https://www.instagram.com/searchmyvacation/",
    facebook: "https://www.facebook.com/searchmyvacation",
    youtube: "https://www.youtube.com/@SearchMyVacation",
  },
  address: {
    line1: "Plot No. 1, First Floor, No. 2",
    line2: "Ponniamman Koil Street",
    line3: "Madipakkam, Chennai – 600091",
    country: "India",
    streetAddress:
      "Plot No. 1, First Floor, No. 2, Ponniamman Koil Street",
    locality: "Madipakkam",
    city: "Chennai",
    region: "Tamil Nadu",
    postalCode: "600091",
    countryCode: "IN",
    displayLines: [
      "Plot No. 1, First Floor, No. 2",
      "Ponniamman Koil Street",
      "Madipakkam, Chennai – 600091",
      "India",
    ],
  },
} as const;
