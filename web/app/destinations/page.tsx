import type { Metadata } from "next";
import PublicPage from "@/components/layout/PublicPage";
import { EditorialContinuation } from "@/components/discovery/EditorialCards";
import DestinationsExperience from "@/components/destinations/DestinationsExperience";

export const metadata: Metadata = { title: "Destinations", description: "Discover Release 1 destinations through the experience you hope to create." };

export default function DestinationsPage() { return <PublicPage eyebrow="Destinations" title="Where could this journey take you?" intro="Begin with the feeling you hope to find. Your Journey Director will help identify the destination that best supports it."><section className="layout-section pb-0"><DestinationsExperience /></section><EditorialContinuation eyebrow="A more personal beginning" title="Let the right destination follow the right conversation." copy="Share what matters to you, and your Journey Director will help find the possibility that fits." label="Find the journey that fits me"/></PublicPage>; }
