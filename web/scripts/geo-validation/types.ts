// EBC-R1.2-WS6-09 (Rad, Phase 1). Row shapes for the GeoNames import
// pipeline. These mirror the raw GeoNames extract formats
// (https://download.geonames.org/export/dump/) and the transformed shape
// that lands in geo_places/geo_aliases
// (supabase/migrations/20260823150000_geo_places_geo_aliases.sql).

export type RawGeonamesPlace = {
  geonameid: string;
  name: string;
  asciiname: string;
  latitude: string;
  longitude: string;
  featureClass: string;
  featureCode: string;
  countryCode: string;
  admin1Code: string;
  admin2Code: string;
  population: string;
};

export type RawAlternateName = {
  geonameid: string;
  isolanguage: string;
  alternateName: string;
  isPreferredName: boolean;
  isShortName: boolean;
  isHistoric: boolean;
};

export type GeoPlaceRow = {
  id: string;
  name: string;
  ascii_name: string;
  place_type: "country" | "state" | "district" | "region" | "city" | "town" | "landmark" | "island";
  country_code: string | null;
  admin1_name: string | null;
  admin1_code: string | null;
  admin2_name: string | null;
  admin2_code: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  feature_class: string;
  feature_code: string;
  source: "geonames";
  source_updated_at: string;
};

export type GeoAliasRow = {
  geo_place_id: string;
  alias_text: string;
  alias_type: "historic" | "preferred" | "short" | "abbreviation" | "local_language" | "common_misspelling";
  locale: string | null;
};
