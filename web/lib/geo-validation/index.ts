// EBC-R1.2-WS6-09 (Rad, Phase 1/2). Public surface of the geo-validation
// module — the only files outside this directory should ever need are
// these exports (plus the API route at
// web/app/api/journey-passport/destinations/search/route.ts, which is
// itself the module's HTTP boundary for the client).

export {
  GEO_PLACE_TYPES,
  isGeoPlaceType,
  isSelectedDestination,
  type GeoPlaceType,
  type GeoSearchResult,
  type SelectedDestination,
} from "./types";

export {
  createSupabaseGeoValidationRepository,
  GeoValidationRepositoryError,
  type GeoValidationRepository,
} from "./repository";

export {
  addSelection,
  formatDisambiguation,
  MAX_PREFERRED_DESTINATIONS,
  removeSelection,
  type SelectionOutcome,
} from "./selection";
