export const JOURNEY_PASSPORT_SCHEMA_VERSION = 1 as const;
export const JOURNEY_FEELINGS = ["relax", "explore", "celebrate", "romance", "escape", "memory"] as const;
export const JOURNEY_ENTRY_EXPERIENCES = ["Memory Makers", "Celebration Moments", "Family Time", "Weekend Getaways", "Global Escapes", "Nature & Serenity"] as const;
// EBC-030: governed Travel Inspiration stable IDs (replaces the previous
// ad-hoc Mountains/Beaches/Wildlife/Romance/Relaxation set — see the
// Inspiration Mapping Catalogue in lib/journey-passport/entry-context.ts).
export const JOURNEY_ENTRY_INSPIRATIONS = [
  "feeling-led",
  "slow-unhurried",
  "family-time",
  "short-restorative-escape",
  "food-culture-local",
  "nature-led",
  "travel-celebration",
  "first-international",
] as const;
export const JOURNEY_ENTRY_DESTINATION_THEMES = ["Tropical Escape", "Mountain Retreat", "City Discovery", "Wildlife Adventure"] as const;

export type JourneyFeeling = (typeof JOURNEY_FEELINGS)[number];
export type JourneyEntryExperience = (typeof JOURNEY_ENTRY_EXPERIENCES)[number];
export type JourneyEntryInspiration = (typeof JOURNEY_ENTRY_INSPIRATIONS)[number];
export type JourneyEntryDestinationTheme = (typeof JOURNEY_ENTRY_DESTINATION_THEMES)[number];

export function isJourneyFeeling(value: unknown): value is JourneyFeeling {
  return typeof value === "string" && JOURNEY_FEELINGS.some((feeling) => feeling === value);
}

export function isJourneyEntryExperience(value: unknown): value is JourneyEntryExperience {
  return typeof value === "string" && JOURNEY_ENTRY_EXPERIENCES.some((experience) => experience === value);
}

export function isJourneyEntryInspiration(value: unknown): value is JourneyEntryInspiration {
  return typeof value === "string" && JOURNEY_ENTRY_INSPIRATIONS.some((inspiration) => inspiration === value);
}

export function isJourneyEntryDestinationTheme(value: unknown): value is JourneyEntryDestinationTheme {
  return typeof value === "string" && JOURNEY_ENTRY_DESTINATION_THEMES.some((theme) => theme === value);
}

export type JourneyMomentId =
  | "welcome"
  | "about-you"
  | "companions"
  | "dream-journey"
  | "pace-and-timing"
  | "destination"
  | "discover";

export type JourneyMomentType =
  | "welcome"
  | "name"
  | "single-select"
  | "pace-and-timing"
  | "destination"
  | "discover";

export type DestinationMode = "" | "known" | "discovery";
export type CompletionState = "idle" | "completing" | "complete" | "failed";
export type NavigationDirection = "none" | "forward" | "backward";

export type JourneyOption = {
  value: string;
  label: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};
export type JourneyPassportEntryContext = {
  feeling?: JourneyFeeling;
  experience?: JourneyEntryExperience;
  inspiration?: JourneyEntryInspiration;
  destination?: string;
  destinationTheme?: JourneyEntryDestinationTheme;
  source?: "homepage" | "direct" | "experience" | "mood" | "inspiration" | "destination";
};

export type JourneyPassportState = {
  schemaVersion: typeof JOURNEY_PASSPORT_SCHEMA_VERSION;
  currentMoment: JourneyMomentId;
  name: string;
  companion: string;
  dreamJourney: string;
  travelStyles: string[];
  timing: string;
  startDate: string;
  endDate: string;
  destinationMode: DestinationMode;
  destination: string;
  mobile: string;
  journeyReference: string;
  entryContext: JourneyPassportEntryContext;
  visitedMoments: JourneyMomentId[];
  completion: CompletionState;
  navigationDirection: NavigationDirection;
  updatedAt: number;
};

export type JourneyMoment = {
  id: JourneyMomentId;
  number: number;
  navigationLabel: string;
  title: string;
  description?: string;
  type: JourneyMomentType;
  nextLabel: string;
  options?: JourneyOption[];
  validate: (state: JourneyPassportState) => boolean;
};

export type JourneyPassportDraft = {
  schemaVersion: typeof JOURNEY_PASSPORT_SCHEMA_VERSION;
  state: JourneyPassportState;
  savedAt: number;
};
