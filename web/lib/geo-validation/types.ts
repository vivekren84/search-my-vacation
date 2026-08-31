// EBC-R1.2-WS6-09 (Rad, Phase 1). Data model for the geo-validation module,
// per EBC-R1.2-WS6-03 §6 (Archie, Destination Data Model). This module owns
// geographic truth only — realness, not serviceability (DEC-R1.2-004). It
// must never import from, or be imported by, web/lib/journey-director/**
// (enforced by web/lib/journey-director/validation/verifyNoGeoValidationCoupling.ts).

export const GEO_PLACE_TYPES = [
  "country",
  "state",
  "district",
  "region",
  "city",
  "town",
  "landmark",
  "island",
] as const;

export type GeoPlaceType = (typeof GEO_PLACE_TYPES)[number];

export function isGeoPlaceType(value: unknown): value is GeoPlaceType {
  return typeof value === "string" && (GEO_PLACE_TYPES as readonly string[]).includes(value);
}

// One ranked search result, as returned by the search_geo_places() Postgres
// function (supabase/migrations/20260823150000_geo_places_geo_aliases.sql).
// This is the shape the destination-search API route (Phase 1) returns to
// the client, and the shape a traveller's selection resolves to (Phase 2).
export type GeoSearchResult = {
  geoPlaceId: string;
  canonicalName: string;
  placeType: GeoPlaceType;
  countryCode: string | null;
  admin1Name: string | null;
  admin2Name: string | null;
  population: number | null;
  // The alias text that actually matched the traveller's query, when the
  // match came via geo_aliases rather than the canonical name directly
  // (e.g. traveller typed "Bangalore", matchedAlias is "Bangalore" and
  // canonicalName is "Bengaluru"). Null when the canonical name itself
  // matched. Not currently surfaced in the UI (Sophie's §4.2 shows only
  // canonicalName + admin context); retained for logging/debugging.
  matchedAlias: string | null;
};

// A single, previously-selected destination, fully resolved against
// geo_places. Per EBC-R1.2-WS6-03 Addendum 01 §1: because the Preferred
// Destinations field is selection-only (no free-text fallback lives inside
// it — that is Describe Your Ideal Getaway's job), every entry is, by
// construction, a validated place. geoPlaceId is therefore non-nullable —
// there is no "selected but unresolved" state to represent.
export type SelectedDestination = {
  geoPlaceId: string;
  canonicalName: string;
  placeType: GeoPlaceType;
};

export function isSelectedDestination(value: unknown): value is SelectedDestination {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SelectedDestination>;
  return (
    typeof candidate.geoPlaceId === "string" &&
    candidate.geoPlaceId.length > 0 &&
    typeof candidate.canonicalName === "string" &&
    candidate.canonicalName.length > 0 &&
    isGeoPlaceType(candidate.placeType)
  );
}
