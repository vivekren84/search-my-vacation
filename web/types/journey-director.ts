import type { JourneyPassportEntryContext } from "./journey-passport.types";

export type JourneyPassportSnapshot = {
  name: string;
  companion: string;
  dreamJourney: string;
  travelStyles: string[];
  timing: string;
  startDate: string;
  endDate: string;
  destinationMode: "known" | "discovery";
  destination: string;
  entryContext?: JourneyPassportEntryContext;
  completedAt: string;
  source: "journey-passport" | "demo";
};
