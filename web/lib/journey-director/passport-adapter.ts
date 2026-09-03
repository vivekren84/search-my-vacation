import {
  isJourneyEntryDestinationTheme,
  isJourneyEntryExperience,
  isJourneyEntryInspiration,
  isJourneyFeeling,
  type JourneyPassportEntryContext,
  type JourneyPassportState,
} from "../../types/journey-passport.types";
import type { JourneyPassportDestination, JourneyPassportSnapshot } from "../../types/journey-director";

// EBC-R1.2-WS6-09 (Rad, Phase 4). Deliberately NOT importing from
// lib/geo-validation (DEC-R1.2-004/RISK-R1.2-006, enforced by
// verifyNoGeoValidationCoupling.ts — this file lives under
// lib/journey-director/**). preferredDestinations arrives here as
// state.preferredDestinations: SelectedDestination[] from the Passport's own
// live state, but this module only ever needs its plain structural shape
// (geoPlaceId/canonicalName/placeType), so it is validated and copied via a
// local, self-owned check/mapper instead of importing geo-validation's type
// guard or type.

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isJourneyPassportDestinationShape(value: unknown): value is JourneyPassportDestination {
  if (!isRecord(value)) return false;

  return (
    typeof value.geoPlaceId === "string" &&
    value.geoPlaceId.length > 0 &&
    typeof value.canonicalName === "string" &&
    value.canonicalName.length > 0 &&
    typeof value.placeType === "string" &&
    value.placeType.length > 0
  );
}

function isJourneyPassportEntryContext(value: unknown): value is JourneyPassportEntryContext {
  if (!isRecord(value)) return false;

  return (
    (value.feeling === undefined || isJourneyFeeling(value.feeling)) &&
    (value.experience === undefined || isJourneyEntryExperience(value.experience)) &&
    (value.inspiration === undefined || isJourneyEntryInspiration(value.inspiration)) &&
    (value.destination === undefined || typeof value.destination === "string") &&
    (value.destinationTheme === undefined || isJourneyEntryDestinationTheme(value.destinationTheme)) &&
    (value.source === undefined || value.source === "homepage" || value.source === "direct" || value.source === "experience" || value.source === "mood" || value.source === "inspiration" || value.source === "destination")
  );
}

export function isJourneyPassportSnapshot(value: unknown): value is JourneyPassportSnapshot {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    (value.mobile === undefined || typeof value.mobile === "string") &&
    (value.journeyReference === undefined || typeof value.journeyReference === "string") &&
    typeof value.companion === "string" &&
    typeof value.dreamJourney === "string" &&
    Array.isArray(value.travelStyles) &&
    value.travelStyles.every((style) => typeof style === "string") &&
    typeof value.timing === "string" &&
    typeof value.startDate === "string" &&
    typeof value.endDate === "string" &&
    Array.isArray(value.preferredDestinations) &&
    value.preferredDestinations.every((item) => isJourneyPassportDestinationShape(item)) &&
    typeof value.getawayDescription === "string" &&
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
    ...(state.mobile.trim() ? { mobile: state.mobile.trim() } : {}),
    ...(state.journeyReference ? { journeyReference: state.journeyReference } : {}),
    companion: state.companion,
    dreamJourney: state.dreamJourney,
    travelStyles: [...state.travelStyles],
    timing: state.timing,
    startDate: state.startDate,
    endDate: state.endDate,
    preferredDestinations: state.preferredDestinations.map((destination) => ({
      geoPlaceId: destination.geoPlaceId,
      canonicalName: destination.canonicalName,
      placeType: destination.placeType,
    })),
    getawayDescription: state.getawayDescription.trim(),
    entryContext: {
      ...(isJourneyFeeling(state.entryContext.feeling)
        ? { feeling: state.entryContext.feeling }
        : {}),
      ...(isJourneyEntryExperience(state.entryContext.experience)
        ? { experience: state.entryContext.experience }
        : {}),
      ...(isJourneyEntryInspiration(state.entryContext.inspiration)
        ? { inspiration: state.entryContext.inspiration }
        : {}),
      ...(state.entryContext.destination
        ? { destination: state.entryContext.destination }
        : {}),
      ...(isJourneyEntryDestinationTheme(state.entryContext.destinationTheme)
        ? { destinationTheme: state.entryContext.destinationTheme }
        : {}),
      ...(state.entryContext.source ? { source: state.entryContext.source } : {}),
    },
    completedAt: new Date().toISOString(),
    source: "journey-passport",
  };
}
