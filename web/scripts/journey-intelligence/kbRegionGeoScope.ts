/**
 * GOVERNANCE BOUNDARY — Business/Engineering co-owned reference data
 * (read-only at generation time).
 *
 * Implements the `geoScope` Travel-Region-matching strategy approved by
 * `EBC-R1.3-WS1-006-TIGER-RAD-KB-Region-Matching-Strategy-Engineering-Readiness.md`
 * Section 3: one small, explicit, version-controlled declaration per
 * `KB_APPROVED_PORTFOLIO` Travel Region (`./kbApprovedPortfolio.js`),
 * stating the geographic footprint the Bootstrap Generator is authorised
 * to search for *new*, not-yet-KB-documented candidate Places belonging to
 * that Travel Region.
 *
 * DESIGN NOTE — resolution recipes, not raw admin codes (an implementation
 * refinement made under this card, `EBC-R1.3-WS1-007-RAD`, not a reopening
 * of WS1-006's governance decision): `EBC-R1.3-WS1-006` Section 3.1
 * illustrated `geoScope` as a raw `{ countryCode, admin1Code, admin2Code }`
 * tuple. This file instead declares *which real-world place to resolve, at
 * which administrative level* (a `GeoScopeRule`) - the actual GeoNames
 * `admin1_code`/`admin2_code` values are looked up live, every generation
 * run, from `geo_places` itself (via
 * `web/lib/geo-validation/bootstrapRepository.ts`), using the exact same
 * approved live-query access pattern (`EBC-R1.3-WS1-005`). This avoids
 * hand-transcribing GeoNames' own internal admin-code strings into this
 * file from memory or assumption - which Project Instructions Section 19
 * ("do not fabricate production content") and this project's own
 * established practice (`EBC-R1.3-WS1-005` Section 0, disclosing rather
 * than guessing unverified facts) both counsel against - while still
 * making the *governance* decision (which real-world entity, at which
 * level, constitutes this Travel Region's footprint) explicit,
 * version-controlled, and hand-curated exactly as WS1-006 requires. The
 * resolved codes are recorded in the Bootstrap Generator's Validation
 * Report on every run, so a human reviews what was actually matched.
 *
 * Generator Matching Contract (per `EBC-R1.3-WS1-006` Section 4):
 * - The generator infers automatically: which single `geo_places` row a
 *   rule's `matchName` resolves to (fail-closed on zero or multiple
 *   confident matches - never guessed), and which `geo_places` candidate
 *   rows fall inside the resolved scope.
 * - This file supplies the one fact the generator must never infer: which
 *   entity, at which administrative level, is this Travel Region's
 *   approved footprint.
 * - A `KB_APPROVED_PORTFOLIO` entry with neither a `KB_REGION_GEO_SCOPES`
 *   nor a `PENDING_KB_REGION_GEO_SCOPES` entry is a configuration gap - the
 *   generator must fail that Travel Region's Sheet 2 candidate discovery
 *   loudly (Validation Report), never silently produce zero candidates for
 *   it. A `PENDING_KB_REGION_GEO_SCOPES` entry is the *expected*, disclosed
 *   form of that same gap for Kashmir specifically (see below) - the
 *   generator treats it identically for candidate discovery (skipped, with
 *   a named reason) but does NOT treat it as an unexpected anomaly.
 *
 * Governance boundary added under `EBC-R1.3-WS1-007-RAD` (Bootstrap
 * Generator Engineering Implementation).
 */

export type GeoScopeRule =
  | { readonly kind: "country"; readonly countryCode: string }
  | { readonly kind: "admin1"; readonly countryCode: string; readonly matchName: string }
  | {
      readonly kind: "admin2";
      readonly countryCode: string;
      readonly matchName: string;
      /** Disambiguates a district-name collision across two states (e.g. more than one "Hyderabad" district nationally would need this - not currently known to apply, but declared for correctness). */
      readonly parentAdmin1MatchName?: string;
    }
  | {
      /**
       * A short, explicit list of named places, each resolved individually
       * and used as-is (no containment expansion beyond the named places
       * themselves). Reserved for Travel Regions where no single
       * administrative boundary is the correct - or, for Kashmir, the
       * brand-safe - footprint. See `EBC-R1.3-WS1-006` Section 4.3.
       */
      readonly kind: "explicit-seed";
      readonly countryCode: string;
      readonly matchNames: readonly string[];
    };

export interface KbRegionGeoScope {
  /** Foreign key into `KB_APPROVED_PORTFOLIO` - must equal `slug(entry.name)` for exactly one entry there. */
  readonly travelRegionId: string;
  /**
   * One rule per member for a Collection-type Travel Region (Northeast,
   * Wildlife); exactly one rule for every other Travel Region. Rules
   * within one Travel Region are unioned (a candidate matching any rule
   * belongs to this Travel Region); rules across *different* Travel
   * Regions must never overlap - checked by
   * `web/scripts/bootstrap-workbook/validateGeoScopeCoverage.ts`, not
   * assumed here.
   */
  readonly rules: readonly GeoScopeRule[];
}

/**
 * A Travel Region whose geoScope requires explicit Product/Operations
 * (Vivek) sign-off before it is promoted into `KB_REGION_GEO_SCOPES`, per
 * `EBC-R1.3-WS1-006` Section 4.3 ("Kashmir's declared scope is a business
 * decision... recommend Tiger route this one specific declaration to
 * Vivek for explicit sign-off before it is committed"). `proposedRules` is
 * offered for the reviewer's convenience only - drawn directly from
 * `KB_APPROVED_REGIONS`' own already-approved Kashmir rows (Srinagar,
 * Gulmarg, Pahalgam, Sonamarg), so approval only needs to confirm this is
 * the intended brand-safe footprint, not design one from nothing. The
 * generator MUST NOT use `proposedRules` for candidate discovery - only a
 * promoted `KB_REGION_GEO_SCOPES` entry is live.
 */
export interface PendingKbRegionGeoScope {
  readonly travelRegionId: string;
  readonly pendingApproval: true;
  readonly reason: string;
  readonly proposedRules: readonly GeoScopeRule[];
}

/**
 * 23 of the 24 `KB_APPROVED_PORTFOLIO` Travel Regions. Kashmir is the one
 * deliberate exception - see `PENDING_KB_REGION_GEO_SCOPES` below.
 */
export const KB_REGION_GEO_SCOPES: readonly KbRegionGeoScope[] = [
  { travelRegionId: "agra", rules: [{ kind: "admin2", countryCode: "IN", matchName: "Agra", parentAdmin1MatchName: "Uttar Pradesh" }] },
  { travelRegionId: "amritsar", rules: [{ kind: "admin2", countryCode: "IN", matchName: "Amritsar", parentAdmin1MatchName: "Punjab" }] },
  { travelRegionId: "andaman", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Andaman and Nicobar Islands" }] },
  { travelRegionId: "goa", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Goa" }] },
  { travelRegionId: "gujarat", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Gujarat" }] },
  { travelRegionId: "himachal-pradesh", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Himachal Pradesh" }] },
  { travelRegionId: "karnataka", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Karnataka" }] },
  { travelRegionId: "kerala", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Kerala" }] },
  {
    travelRegionId: "northeast",
    rules: [
      { kind: "admin1", countryCode: "IN", matchName: "Meghalaya" },
      { kind: "admin1", countryCode: "IN", matchName: "Sikkim" },
      { kind: "admin2", countryCode: "IN", matchName: "Darjeeling", parentAdmin1MatchName: "West Bengal" },
    ],
  },
  { travelRegionId: "pondicherry", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Puducherry" }] },
  { travelRegionId: "assam", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Assam" }] },
  { travelRegionId: "rajasthan", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Rajasthan" }] },
  { travelRegionId: "tamil-nadu", rules: [{ kind: "admin1", countryCode: "IN", matchName: "Tamil Nadu" }] },
  { travelRegionId: "hyderabad", rules: [{ kind: "admin2", countryCode: "IN", matchName: "Hyderabad", parentAdmin1MatchName: "Telangana" }] },
  {
    // KB's guest-facing name is "Vizag" (a historic alias, per
    // web/scripts/geo-validation/importGeoNames.ts's own
    // HAND_REVIEWED_ALIAS_OVERRIDES); the real-world/GeoNames canonical
    // city and district name is "Visakhapatnam" - resolving the alias
    // here would fail, since admin2 resolution matches canonical
    // district names, not traveller-facing aliases.
    travelRegionId: "vizag",
    rules: [{ kind: "admin2", countryCode: "IN", matchName: "Visakhapatnam", parentAdmin1MatchName: "Andhra Pradesh" }],
  },
  {
    // Wildlife's own KB_APPROVED_PORTFOLIO `members` are already
    // place-level (Kabini, Corbett, Bandipur, Masinagudi), not
    // state/district-level - none is a clean administrative unit (a
    // wildlife-reserve catchment does not align with a district
    // boundary), so this Collection uses explicit-seed per member,
    // exactly like Kashmir, but with no political sensitivity requiring
    // Vivek's sign-off.
    travelRegionId: "wildlife",
    rules: [{ kind: "explicit-seed", countryCode: "IN", matchNames: ["Kabini", "Corbett", "Bandipur", "Masinagudi"] }],
  },
  { travelRegionId: "dubai", rules: [{ kind: "admin1", countryCode: "AE", matchName: "Dubai" }] },
  { travelRegionId: "bali", rules: [{ kind: "admin1", countryCode: "ID", matchName: "Bali" }] },
  { travelRegionId: "malaysia", rules: [{ kind: "country", countryCode: "MY" }] },
  {
    // Singapore is a city-state; GeoNames may or may not carry a
    // meaningful admin1 subdivision for it. `country` is the correct
    // declared shape regardless - EBC-R1.3-WS1-006 Section 5.3 (point 4)
    // already named this as a first-run empirical check, not a design
    // decision to pre-resolve here.
    travelRegionId: "singapore",
    rules: [{ kind: "country", countryCode: "SG" }],
  },
  { travelRegionId: "sri-lanka", rules: [{ kind: "country", countryCode: "LK" }] },
  { travelRegionId: "thailand", rules: [{ kind: "country", countryCode: "TH" }] },
  { travelRegionId: "vietnam", rules: [{ kind: "country", countryCode: "VN" }] },
];

/**
 * Kashmir - the one Travel Region `EBC-R1.3-WS1-006` Section 4.3 named as
 * requiring explicit Product/Operations sign-off before a `geoScope` is
 * committed, because GeoNames' own administrative boundary for the wider
 * Jammu & Kashmir region is not the KB's deliberately narrower, brand-safe
 * "Kashmir" (the KB's own approved Places - Srinagar, Gulmarg, Pahalgam,
 * Sonamarg, per `KB_APPROVED_REGIONS` - name only the Kashmir Valley).
 * `proposedRules` mirrors those four already-approved KB Places exactly,
 * so Vivek's review is a yes/no confirmation of the existing KB footprint,
 * not a request to design one from nothing. Until promoted, the Bootstrap
 * Generator will not discover any *new* candidate Places for Kashmir - the
 * four already-KB-documented Places above are entirely unaffected, since
 * their `travelRegionId` comes directly from `KB_APPROVED_REGIONS`'
 * transcription, not from geoScope resolution (`EBC-R1.3-WS1-006` Section
 * 3.3).
 */
export const PENDING_KB_REGION_GEO_SCOPES: readonly PendingKbRegionGeoScope[] = [
  {
    travelRegionId: "kashmir",
    pendingApproval: true,
    reason:
      "Kashmir's geographic footprint is a brand/political judgment, not a routine administrative lookup — GeoNames' own admin1 boundary for the wider Jammu & Kashmir region is broader than the KB's approved 'Kashmir' identity (Kashmir Valley only). Requires Vivek's explicit sign-off per EBC-R1.3-WS1-006 Section 4.3 before this Travel Region's Sheet 2 candidate discovery can run.",
    proposedRules: [{ kind: "explicit-seed", countryCode: "IN", matchNames: ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg"] }],
  },
];
