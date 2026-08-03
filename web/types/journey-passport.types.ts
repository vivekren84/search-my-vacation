export const JOURNEY_PASSPORT_SCHEMA_VERSION = 1 as const;
export const JOURNEY_FEELINGS = ["relax", "explore", "celebrate", "romance", "escape"] as const;

export type JourneyFeeling = (typeof JOURNEY_FEELINGS)[number];

export function isJourneyFeeling(value: unknown): value is JourneyFeeling {
  return typeof value === "string" && JOURNEY_FEELINGS.some((feeling) => feeling === value);
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
  destination?: string;
  source?: "homepage" | "direct";
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
