/**
 * Shared types for the Bootstrap Generator (EBC-R1.3-WS1-007). Field
 * shapes follow the Consolidated Ownership Matrix and Generator Contract
 * in `EBC-R1.3-WS1-004` Sections 4-6 (deltas over `EBC-R1.3-WS3-001`
 * Sections 4, 7.1), with the `country` field addition from
 * `EBC-R1.3-WS1-003` Section 2.1 and the Sheet 2 `status` Category B/C
 * split from `EBC-R1.3-WS1-004` Section 4.2.
 */

import type { GeoScopeRule } from "../journey-intelligence/kbRegionGeoScope.js";

/** A — Generated every run, never hand-edited. B — Generated once (seed), Product-owned thereafter; the generator never overwrites an already-seeded value. C — Pure Product content, the generator never writes it at all. Reserved — header present, deliberately unpopulated (KB Section 7.5 future operational fields). */
export type OwnershipCategory = "A" | "B" | "C" | "reserved";

export interface GeoIdentityFields {
  readonly geoPlaceId: string | null;
  readonly matchScore: number | null;
  readonly placeType: string | null; // EBC-R1.3-WS1-009 (QA-1): the matched geo_places.place_type — Sheet 2 only (EBC-R1.3-WS3-001 Section 4.2); carried on the shared type for symmetry with the other identity fields, simply unused by Sheet 1's column list.
  readonly admin1Name: string | null;
  readonly admin2Name: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly population: number | null;
}

export const EMPTY_GEO_IDENTITY: GeoIdentityFields = {
  geoPlaceId: null,
  matchScore: null,
  placeType: null,
  admin1Name: null,
  admin2Name: null,
  latitude: null,
  longitude: null,
  population: null,
};

/** Sheet 1 — Travel Regions. Category A/B fields only; Category C (business content) fields are carried as opaque preserved strings — the generator never computes or interprets them (see mergeProductOwnedFields.ts). */
export interface TravelRegionRow extends GeoIdentityFields {
  readonly travelRegionId: string; // Category A
  readonly name: string; // Category A
  readonly category: "Domestic" | "International"; // Category A
  readonly country: string; // Category A (EBC-R1.3-WS1-003 Section 2.1)
  readonly recordType: "Destination" | "Collection"; // Category A
  readonly kbSectionRef: string; // Category A
  readonly existsInKB: "Yes"; // Category A — always Yes for Sheet 1 by construction (EBC-R1.3-WS3-001 Section 4.1)
  readonly extractedAt: string; // Category A
  readonly kbStatus: string; // Category B — seeded once from kbApprovedPortfolio-derived default, then Product-owned
  readonly productOwnedFields: Readonly<Record<string, string>>; // Category C — carried forward verbatim from any prior workbook; never generated
  readonly geoScopeResolution: GeoScopeResolutionSummary | null; // not a workbook column — carried into the Validation Report only
}

export interface PlaceRow extends GeoIdentityFields {
  readonly placeId: string; // Category A — `${travelRegionId}--${slug(name)}`
  readonly travelRegionId: string; // Category A
  readonly name: string; // Category A
  readonly kbSectionRef: string | null; // Category A — set only for existsInKB = Yes rows
  readonly existsInKB: "Yes" | "No"; // Category A
  readonly extractedAt: string; // Category A
  readonly status: string; // Category B (existsInKB = No, generator seeds "Proposed") or Category C (existsInKB = Yes, pure Product ownership — generator never seeds a value)
  readonly productOwnedFields: Readonly<Record<string, string>>; // Category C
}

/** Recorded once per resolved (or unresolved) GeoScopeRule, for the Validation Report — never persisted as a workbook column. */
export interface GeoScopeResolutionSummary {
  readonly travelRegionId: string;
  readonly outcome: "resolved" | "no-match" | "ambiguous" | "pending-approval" | "not-declared";
  readonly detail: string;
  readonly candidatesDiscovered: number;
}

export interface ValidationFinding {
  readonly code: string;
  readonly severity: "error" | "warning";
  readonly travelRegionId?: string;
  readonly message: string;
}

export interface BootstrapGenerationResult {
  readonly travelRegions: readonly TravelRegionRow[];
  readonly places: readonly PlaceRow[];
  readonly geoScopeResolutions: readonly GeoScopeResolutionSummary[];
  readonly findings: readonly ValidationFinding[];
  readonly generatedAt: string;
}

export const SHEET1_CATEGORY_C_COLUMNS = [
  "primaryEmotion",
  "supportingEmotions",
  "personality",
  "themes",
  "bestFor",
  "pace",
  "comfort",
  "idealDuration",
  "seasonGuidance",
  "signatureExperiences",
  "tradeOffs",
  "operationsOwner",
  "lastReviewed",
] as const;

export const SHEET1_RESERVED_COLUMNS = [
  "serviceConfidenceScore",
  "preferredDMC",
  "backupDMC",
  "contractingStatus",
  "hotelDepthByComfort",
  "transferReliability",
  "visaComplexity",
  "accessibilityNotes",
  "permitsRequired",
  "seasonalClosureRisk",
  "flightAccessGateway",
  "emergencyContacts",
] as const;

export const SHEET2_CATEGORY_C_COLUMNS = [
  "primaryEmotion",
  "supportingEmotions",
  "themes",
  "bestFor",
  "pace",
  "comfort",
  "recommendedStay",
  "signatureExperiences",
  "directorNote",
  "tradeOffs",
] as const;

export type { GeoScopeRule };

// --- Column layout, shared by readExistingWorkbook.ts and writeWorkbook.ts ---
// Single source of truth for header order/names so the reader (which must
// recognise every Category A header to know what NOT to preserve) and the
// writer (which must emit the same headers, in the same order, every run —
// EBC-R1.3-WS1-004 Section 6, deterministic layout) can never drift apart.

/** Category A headers, Sheet 1 — regenerated fresh every run, never read forward from a prior workbook. */
export const SHEET1_GENERATED_COLUMNS = [
  "travelRegionId",
  "name",
  "category",
  "country",
  "recordType",
  "kbSectionRef",
  "geoPlaceId",
  "matchScore",
  "admin1Name",
  "admin2Name",
  "latitude",
  "longitude",
  "population",
  "existsInKB",
  "extractedAt",
] as const;

/** Full Sheet 1 column order: Category A, then kbStatus (B), then Category C, then Reserved. */
export const SHEET1_COLUMNS = [
  ...SHEET1_GENERATED_COLUMNS,
  "kbStatus",
  ...SHEET1_CATEGORY_C_COLUMNS,
  ...SHEET1_RESERVED_COLUMNS,
] as const;

/** Category A headers, Sheet 2 — regenerated fresh every run, never read forward from a prior workbook. */
export const SHEET2_GENERATED_COLUMNS = [
  "placeId",
  "travelRegionId",
  "name",
  "kbSectionRef",
  "geoPlaceId",
  "matchScore",
  "placeType", // EBC-R1.3-WS1-009 (QA-1 remediation) — restores the Category A column EBC-R1.3-WS3-001 Section 4.2 specifies for Sheet 2 (was omitted in WS1-007; the data was already available from every repository lookup, just not plumbed through to the row).
  "admin1Name",
  "admin2Name",
  "latitude",
  "longitude",
  "population",
  "existsInKB",
  "extractedAt",
] as const;

/**
 * Full Sheet 2 column order: Category A, then status (B for existsInKB=No /
 * C for existsInKB=Yes — EBC-R1.3-WS1-004 Section 4.2), then Category C,
 * then Reserved. Reserved columns are the *same set* as Sheet 1's, "at
 * region granularity" (EBC-R1.3-WS3-001 Section 4.2) — not a separate list.
 *
 * Two open deviations from the literal `EBC-R1.3-WS3-001` Section 4.2 table,
 * both surfaced by `EBC-R1.3-WS1-008` (QA-1) and reviewed under
 * `EBC-R1.3-WS1-009`:
 *
 * 1. `aliases` (spec: "geo_aliases rows for a matched geo_place_id, rolled
 *    up, semicolon-separated") is still NOT implemented here. Doing so
 *    correctly requires a new `geo_aliases` read function in
 *    `bootstrapRepository.ts` — a repository-access-layer change that
 *    `EBC-R1.3-WS1-009`'s own Out-of-Scope section (Section 10: "Repository
 *    access layer", "Supabase integration") places outside this
 *    remediation, even though `EBC-R1.3-WS1-005` Section 4 already
 *    pre-approved `aliases` as an in-scope Category A field for exactly
 *    this access layer. Recommend a small, explicitly-scoped follow-on
 *    card (repository-layer change, not a "workbook generation" fix) to
 *    close this rather than pulling it into WS1-009.
 * 2. `kbSectionRef` is present on Sheet 2 despite not appearing in
 *    `EBC-R1.3-WS3-001` Section 4.2's table. This was a deliberate WS1-007
 *    addition (traceability for existsInKB=Yes rows, mirroring Sheet 1's
 *    own `kbSectionRef`), not an accidental one — but it was never put to
 *    Arjun/Tiger for ratification against the literal spec. Left in place
 *    for WS1-009 (removing a working traceability field was judged a
 *    larger, less reversible change than keeping it pending a decision);
 *    flagged here for Tiger to either ratify as a Sheet 2 spec addition or
 *    direct its removal in a future card.
 */
export const SHEET2_COLUMNS = [
  ...SHEET2_GENERATED_COLUMNS,
  "status",
  ...SHEET2_CATEGORY_C_COLUMNS,
  ...SHEET1_RESERVED_COLUMNS,
] as const;

/** Sheet 3 — Curated Journeys (EBC-R1.3-WS3-001 Section 4.3). Entirely Product-authored; header-only at bootstrap (Decision D4, closed). */
export const SHEET3_COLUMNS = [
  "curatedJourneyId",
  "name",
  "primaryTravelRegionIds",
  "placeIds",
  "theme",
  "narrative",
  "status",
  "notes",
] as const;
