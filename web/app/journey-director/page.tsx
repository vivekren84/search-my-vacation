import type { Metadata } from "next";

import JourneyDirectorExperience from "@/components/journey-director/JourneyDirectorExperience";

export const metadata: Metadata = {
  title: "Your Journey Possibilities",
  description:
    "Personalised journey possibilities and thoughtful guidance from your Journey Director.",
};

export default function JourneyDirectorPage() {
  return <JourneyDirectorExperience />;
}
