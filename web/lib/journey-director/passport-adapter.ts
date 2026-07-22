import {
  isJourneyFeeling,
  type JourneyPassportEntryContext,
  type JourneyPassportState,
} from "../../types/journey-passport.types";
import type { JourneyPassportSnapshot } from "../../types/journey-director";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isJourneyPassportEntryContext(value: unknown): value is JourneyPassportEntryContext {
  if (!isRecord(value)) return false;

  return (
    (value.feeling === undefined || isJourneyFeeling(value.feeling)) &&
    (value.destination === undefined || typeof value.destination === "string") &&
    (value.source === undefined || value.source === "homepage" || value.source === "direct")
  );
}

export function isJourneyPassportSnapshot(value: unknown): value is JourneyPassportSnapshot {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.companion === "string" &&
    typeof value.dreamJourney === "string" &&
    Array.isArray(value.travelStyles) &&
    value.travelStyles.every((style) => typeof style === "string") &&
    typeof value.timing === "string" &&
    typeof value.startDate === "string" &&
    typeof value.endDate === "string" &&
    (value.destinationMode === "known" || value.destinationMode === "discovery") &&
    typeof value.destination === "string" &&
    (value.entryContext === undefined || isJourneyPassportEntryContext(value.entryContext)) &&
    typeof value.completedAt === "string" &&
    value.source === "journey-passport"
  );
}

export function createJourneyPassportSnapshot(
  state: JourneyPassportState,
): JourneyPassportSnapshot {
  return {
    name: state.name.trim(),
    companion: state.companion,
    dreamJourney: state.dreamJourney,
    travelStyles: [...state.travelStyles],
    timing: state.timing,
    startDate: state.startDate,
    endDate: state.endDate,
    destinationMode: state.destinationMode === "known" ? "known" : "discovery",
    destination: state.destination.trim(),
    entryContext: {
      ...(isJourneyFeeling(state.entryContext.feeling)
        ? { feeling: state.entryContext.feeling }
        : {}),
      ...(state.entryContext.destination
        ? { destination: state.entryContext.destination }
        : {}),
      ...(state.entryContext.source ? { source: state.entryContext.source } : {}),
    },
    completedAt: new Date().toISOString(),
    source: "journey-passport",
  };
}
