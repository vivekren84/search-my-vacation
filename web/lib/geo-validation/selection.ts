// EBC-R1.2-WS6-09 (Rad, Phase 2). Framework-free selection logic for the
// Preferred Destinations field — deliberately kept separate from any React
// component so it can be verified with a plain verify*.ts script (this
// repository has no unit-test framework; see
// web/lib/geo-validation/validation/verifySelectionLogic.ts) and reused
// unchanged if the UI layer ever changes.
//
// Business rules encoded here, all traced to approved WS6 documents:
//   - Order is preserved exactly as selected, never re-sorted
//     (EBC-R1.2-WS6-01 AC-06 / DEC-R1.2-005; EBC-R1.2-WS6-05 §4.3).
//   - Re-selecting an already-selected destination is a silent no-op, not
//     an error (EBC-R1.2-WS6-01 §6 "Duplicate selections"; confirmed by
//     Arjun's recommendation and EBC-R1.2-WS6-05 §7.2).
//   - A maximum of 5 selections, framed as sufficiency rather than a hard
//     block (EBC-R1.2-WS6-08 Addendum 01 §A2.2 — Product Owner decision,
//     finalising Sophie's §4.3 "soft cap" recommendation at 5).
//   - Individual removal never disturbs any other selection's order
//     (EBC-R1.2-WS6-01 AC-05 / DEC-R1.2-005).

import type { GeoPlaceType, GeoSearchResult, SelectedDestination } from "./types";

export const MAX_PREFERRED_DESTINATIONS = 5;

export type SelectionOutcome = "added" | "duplicate" | "cap-reached";

function toSelectedDestination(candidate: GeoSearchResult): SelectedDestination {
  return {
    geoPlaceId: candidate.geoPlaceId,
    canonicalName: candidate.canonicalName,
    placeType: candidate.placeType,
  };
}

export function addSelection(
  current: readonly SelectedDestination[],
  candidate: GeoSearchResult,
  maxSelections: number = MAX_PREFERRED_DESTINATIONS,
): { next: SelectedDestination[]; outcome: SelectionOutcome } {
  const alreadySelected = current.some((entry) => entry.geoPlaceId === candidate.geoPlaceId);
  if (alreadySelected) {
    return { next: [...current], outcome: "duplicate" };
  }
  if (current.length >= maxSelections) {
    return { next: [...current], outcome: "cap-reached" };
  }
  return { next: [...current, toSelectedDestination(candidate)], outcome: "added" };
}

export function removeSelection(
  current: readonly SelectedDestination[],
  geoPlaceId: string,
): SelectedDestination[] {
  return current.filter((entry) => entry.geoPlaceId !== geoPlaceId);
}

// EBC-R1.2-WS6-11 (Keerthi, DEF-02 — Minor). A country-level result with
// no admin1/admin2 context previously fell back to the raw ISO 3166-1
// alpha-2 code (e.g. "IN") instead of a readable name — contradicting
// this function's own documented example below ("Bali — Indonesia").
// Intl.DisplayNames resolves the code to its English display name; if a
// code is unrecognised, or the runtime lacks Intl.DisplayNames, the raw
// code is returned unchanged rather than throwing or showing nothing.
const countryDisplayNames =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(countryCode: string): string {
  if (!countryDisplayNames) return countryCode;
  try {
    return countryDisplayNames.of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
}

// EBC-R1.2-WS6-IMP-03 (Rad). Plain-language label for each GEO_PLACE_TYPES
// value (../types.ts) — a direct capitalisation of the existing backend
// value, not new terminology, per Sophie's EBC-R1.2-WS6-UX-01 §6 Option A
// recommendation.
const PLACE_TYPE_LABELS: Record<GeoPlaceType, string> = {
  country: "Country",
  state: "State",
  district: "District",
  region: "Region",
  city: "City",
  town: "Town",
  landmark: "Landmark",
  island: "Island",
};

// Sophie's §4.2 disambiguation line: place type plus admin hierarchy for a
// city/district, place type plus country for a well-known international
// destination — e.g. "City, Kodagu District, Karnataka" or "City, Indonesia".
// The leading place-type label (EBC-R1.2-WS6-IMP-03) is what lets a
// traveller tell apart two results that otherwise share an identical name
// and administrative hierarchy — e.g. a city and its same-named containing
// district (EBC-R1.2-WS6-QA-01 D2 / EBC-R1.2-WS6-UX-01 §2.1) — since the
// colliding records always carry different placeType values.
export function formatDisambiguation(result: GeoSearchResult): string {
  const label = PLACE_TYPE_LABELS[result.placeType];
  const hierarchyParts = [result.admin2Name, result.admin1Name].filter((part): part is string => Boolean(part));
  if (hierarchyParts.length > 0) return [label, ...hierarchyParts].join(", ");
  if (result.countryCode) return [label, countryName(result.countryCode)].join(", ");
  return label;
}
