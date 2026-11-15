/**
 * Fixture `geo_places` dataset for `verifyBootstrapGenerator.ts`. Not real
 * GeoNames data — a small, hand-built, internally-consistent subset
 * covering every `GeoScopeRule` kind the real `KB_REGION_GEO_SCOPES`
 * declares (`country`, `admin1`, `explicit-seed`; `admin2` is exercised
 * indirectly via the same resolution code path — see verification notes),
 * so the fixture-backed run below exercises the generator's actual
 * matching/candidate-discovery logic end-to-end without a live Supabase
 * connection (unavailable in this session — see the Rad implementation
 * report). Deliberately covers only 4 of the 24 real
 * `KB_APPROVED_PORTFOLIO` Travel Regions (Kerala, Wildlife, Dubai,
 * Malaysia) — full 24/23/109-entry fixture coverage would duplicate a
 * meaningful slice of GeoNames data for no additional proof of the
 * mechanism; the other ~20 Travel Regions legitimately resolve to
 * "no-match" against this fixture, which is the expected, correctly-
 * reported outcome for a name absent from the dataset, not a defect.
 */

export interface FixtureGeoPlace {
  readonly id: string;
  readonly name: string;
  readonly place_type: string;
  readonly country_code: string;
  readonly admin1_name: string | null;
  readonly admin1_code: string | null;
  readonly admin2_name: string | null;
  readonly admin2_code: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly population: number | null;
}

export const FIXTURE_GEO_PLACES: readonly FixtureGeoPlace[] = [
  // --- Kerala (admin1 rule) ---
  { id: "fx-in-kerala", name: "Kerala", place_type: "state", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: null, admin2_code: null, latitude: 10.85, longitude: 76.27, population: 33_400_000 },
  // Two names already in KB_APPROVED_REGIONS for Kerala (kbApprovedRegions.ts) — must be EXCLUDED from candidate discovery.
  { id: "fx-in-kerala-munnar", name: "Munnar", place_type: "town", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: "Idukki", admin2_code: "IN.32.ID", latitude: 10.09, longitude: 77.06, population: 68_000 },
  { id: "fx-in-kerala-wayanad", name: "Wayanad", place_type: "district", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: "Wayanad", admin2_code: "IN.32.WY", latitude: 11.61, longitude: 76.08, population: 817_000 },
  // Two names NOT in KB_APPROVED_REGIONS for Kerala — must surface as NEW candidates (existsInKB = No, status = Proposed).
  { id: "fx-in-kerala-kannur", name: "Kannur", place_type: "district", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: "Kannur", admin2_code: "IN.32.KN", latitude: 11.87, longitude: 75.37, population: 2_523_000 },
  { id: "fx-in-kerala-kollam", name: "Kollam", place_type: "city", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: "Kollam", admin2_code: "IN.32.KL", latitude: 8.89, longitude: 76.61, population: 397_000 },
  // A state-level row inside Kerala's admin1 — must NOT be discovered as a candidate (state is not in CANDIDATE_PLACE_TYPES).
  { id: "fx-in-kerala-not-a-candidate", name: "Kerala Legislative Region", place_type: "state", country_code: "IN", admin1_name: "Kerala", admin1_code: "IN.32", admin2_name: null, admin2_code: null, latitude: null, longitude: null, population: null },

  // --- Wildlife (explicit-seed rule) — all 4 named members ---
  { id: "fx-in-kabini", name: "Kabini", place_type: "landmark", country_code: "IN", admin1_name: "Karnataka", admin1_code: "IN.16", admin2_name: "Mysuru", admin2_code: "IN.16.MY", latitude: 11.95, longitude: 76.32, population: null },
  { id: "fx-in-corbett", name: "Corbett", place_type: "landmark", country_code: "IN", admin1_name: "Uttarakhand", admin1_code: "IN.34", admin2_name: "Nainital", admin2_code: "IN.34.NT", latitude: 29.53, longitude: 78.77, population: null },
  { id: "fx-in-bandipur", name: "Bandipur", place_type: "landmark", country_code: "IN", admin1_name: "Karnataka", admin1_code: "IN.16", admin2_name: "Chamarajanagar", admin2_code: "IN.16.CH", latitude: 11.65, longitude: 76.63, population: null },
  { id: "fx-in-masinagudi", name: "Masinagudi", place_type: "town", country_code: "IN", admin1_name: "Tamil Nadu", admin1_code: "IN.31", admin2_name: "Nilgiris", admin2_code: "IN.31.NG", latitude: 11.56, longitude: 76.65, population: 12_000 },

  // --- Dubai (admin1 rule) ---
  { id: "fx-ae-dubai", name: "Dubai", place_type: "state", country_code: "AE", admin1_name: "Dubai", admin1_code: "AE.DU", admin2_name: null, admin2_code: null, latitude: 25.2, longitude: 55.27, population: 3_400_000 },
  { id: "fx-ae-dubai-marina", name: "Dubai Marina", place_type: "landmark", country_code: "AE", admin1_name: "Dubai", admin1_code: "AE.DU", admin2_name: null, admin2_code: null, latitude: 25.08, longitude: 55.14, population: null },
  { id: "fx-ae-jumeirah", name: "Jumeirah", place_type: "city", country_code: "AE", admin1_name: "Dubai", admin1_code: "AE.DU", admin2_name: null, admin2_code: null, latitude: 25.23, longitude: 55.26, population: null },

  // --- Malaysia (country rule — no admin1/admin2 filter, straight country_code) ---
  { id: "fx-my-country", name: "Malaysia", place_type: "country", country_code: "MY", admin1_name: null, admin1_code: null, admin2_name: null, admin2_code: null, latitude: 4.21, longitude: 101.98, population: 33_600_000 },
  { id: "fx-my-penang", name: "Penang", place_type: "region", country_code: "MY", admin1_name: "Penang", admin1_code: "MY.07", admin2_name: null, admin2_code: null, latitude: 5.41, longitude: 100.33, population: 1_770_000 },
  { id: "fx-my-langkawi", name: "Langkawi", place_type: "island", country_code: "MY", admin1_name: "Kedah", admin1_code: "MY.02", admin2_name: null, admin2_code: null, latitude: 6.35, longitude: 99.8, population: 65_000 },
  { id: "fx-my-malacca", name: "Malacca", place_type: "city", country_code: "MY", admin1_name: "Malacca", admin1_code: "MY.04", admin2_name: null, admin2_code: null, latitude: 2.19, longitude: 102.25, population: 484_000 },
];
