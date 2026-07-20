import { Suspense } from "react";

import JourneyPassport from "@/components/journey-passport/JourneyPassport";

export const metadata = {
  title: "Journey Passport",
  description: "Begin a thoughtfully designed journey with Search My Vacation.",
};

export default function JourneyPassportPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#fbf7ef]" aria-label="Loading Journey Passport" />}><JourneyPassport /></Suspense>;
}
