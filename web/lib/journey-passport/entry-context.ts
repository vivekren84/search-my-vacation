import { JOURNEY_PASSPORT_SCHEMA_VERSION, type JourneyMomentId, type JourneyPassportEntryContext, type JourneyPassportState } from "../../types/journey-passport.types";

export type JourneyEntryPreselection = {
  moment: JourneyMomentId;
  field: "companion" | "dreamJourney" | "travelStyles" | "timing";
  value: string;
};

const experiencePreselections = {
  "Memory Makers": { moment: "pace-and-timing", field: "travelStyles", value: "Photography" },
  "Celebration Moments": { moment: "pace-and-timing", field: "travelStyles", value: "Celebrations" },
  "Family Time": { moment: "companions", field: "companion", value: "Family" },
  "Weekend Getaways": { moment: "pace-and-timing", field: "timing", value: "Within the Next Month" },
  "Global Escapes": { moment: "dream-journey", field: "dreamJourney", value: "City Discovery" },
  "Nature & Serenity": { moment: "pace-and-timing", field: "travelStyles", value: "Nature" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["experience"]>, JourneyEntryPreselection>;

const moodPreselections = {
  relax: { moment: "pace-and-timing", field: "travelStyles", value: "Relaxation" },
  explore: { moment: "pace-and-timing", field: "travelStyles", value: "Adventure" },
  celebrate: { moment: "pace-and-timing", field: "travelStyles", value: "Celebrations" },
  romance: { moment: "companions", field: "companion", value: "Couple" },
  escape: { moment: "dream-journey", field: "dreamJourney", value: "Tropical Escape" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["feeling"]>, JourneyEntryPreselection>;

const inspirationPreselections = {
  Mountains: { moment: "dream-journey", field: "dreamJourney", value: "Mountain Retreat" },
  Beaches: { moment: "pace-and-timing", field: "travelStyles", value: "Beaches & Islands" },
  Wildlife: { moment: "dream-journey", field: "dreamJourney", value: "Wildlife Adventure" },
  Romance: { moment: "companions", field: "companion", value: "Couple" },
  Relaxation: { moment: "pace-and-timing", field: "travelStyles", value: "Relaxation" },
} as const satisfies Record<NonNullable<JourneyPassportEntryContext["inspiration"]>, JourneyEntryPreselection>;

export const JOURNEY_ENTRY_ADVISORY = "We've pre-selected this based on how you started your journey. Feel free to change it anytime.";

export function resolveJourneyEntryPreselection(entryContext: JourneyPassportEntryContext): JourneyEntryPreselection | undefined {
  if (entryContext.destinationTheme) return { moment: "dream-journey", field: "dreamJourney", value: entryContext.destinationTheme };
  if (entryContext.experience) return experiencePreselections[entryContext.experience];
  if (entryContext.inspiration) return inspirationPreselections[entryContext.inspiration];
  if (entryContext.feeling) return moodPreselections[entryContext.feeling];
  return undefined;
}

export function createInitialJourneyPassportState(entryContext: JourneyPassportEntryContext = {}): JourneyPassportState {
  const preselection = resolveJourneyEntryPreselection(entryContext);
  return {
    schemaVersion: JOURNEY_PASSPORT_SCHEMA_VERSION,
    currentMoment: "welcome",
    name: "",
    companion: preselection?.field === "companion" ? preselection.value : "",
    dreamJourney: preselection?.field === "dreamJourney" ? preselection.value : "",
    travelStyles: preselection?.field === "travelStyles" ? [preselection.value] : [],
    timing: preselection?.field === "timing" ? preselection.value : "",
    startDate: "",
    endDate: "",
    destinationMode: entryContext.destination ? "known" : "",
    destination: entryContext.destination ?? "",
    mobile: "",
    journeyReference: "",
    entryContext,
    visitedMoments: ["welcome"],
    completion: "idle",
    navigationDirection: "none",
    updatedAt: Date.now(),
  };
}
