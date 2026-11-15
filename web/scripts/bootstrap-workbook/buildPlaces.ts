/**
 * Sheet 2 (Places) builder. Two row sources, per `EBC-R1.3-WS1-006`
 * Section 3.3:
 *
 * 1. Already-KB-documented Places (`KB_APPROVED_REGIONS`) — `travelRegionId`
 *    is given directly by that transcription, never by geo-containment.
 *    `existsInKB = Yes` always. An optional best-match geo_places lookup
 *    still attaches identity/hierarchy facts (geoPlaceId, admin names,
 *    coordinates), exactly as Sheet 1 does — a separate concern from the
 *    travelRegionId assignment problem this file otherwise solves.
 * 2. Newly-discovered candidates — found by resolving each Travel Region's
 *    declared `geoScope` (`kbRegionGeoScope.ts`) against live `geo_places`
 *    data and querying for every approved-place_type row inside that
 *    resolved scope, excluding any geo_places id already claimed by a
 *    Sheet 2a row for that same Travel Region (so a KB-documented Place
 *    is never also surfaced as a duplicate-looking "new" candidate —
 *    the exact failure mode `EBC-R1.3-WS1-003` Section 8.3 identified).
 *    `existsInKB = No`, `status` seeded "Proposed" (Category B).
 */

import { KB_APPROVED_PORTFOLIO } from "../journey-intelligence/kbApprovedPortfolio.js";
import { KB_APPROVED_REGIONS } from "../journey-intelligence/kbApprovedRegions.js";
import {
  KB_REGION_GEO_SCOPES,
  PENDING_KB_REGION_GEO_SCOPES,
} from "../journey-intelligence/kbRegionGeoScope.js";
import { slug } from "../journey-intelligence/utils.js";
import type { BootstrapGeoRepository } from "../../lib/geo-validation/bootstrapRepository.js";
import {
  EMPTY_GEO_IDENTITY,
  type GeoScopeResolutionSummary,
  type PlaceRow,
  type ValidationFinding,
} from "./types.js";

export async function buildPlaces(
  repository: BootstrapGeoRepository,
  generatedAt: string,
  existingStatusByPlaceId: ReadonlyMap<string, string>,
  existingProductFieldsByPlaceId: ReadonlyMap<string, Readonly<Record<string, string>>>,
): Promise<{
  readonly rows: readonly PlaceRow[];
  readonly findings: readonly ValidationFinding[];
  readonly geoScopeResolutions: readonly GeoScopeResolutionSummary[];
}> {
  const findings: ValidationFinding[] = [];
  const geoScopeResolutions: GeoScopeResolutionSummary[] = [];
  const rows: PlaceRow[] = [];

  const portfolioTravelRegionIds = new Set(KB_APPROVED_PORTFOLIO.map((entry) => slug(entry.name)));
  const scopeByTravelRegionId = new Map(KB_REGION_GEO_SCOPES.map((scope) => [scope.travelRegionId, scope]));
  const pendingByTravelRegionId = new Map(PENDING_KB_REGION_GEO_SCOPES.map((entry) => [entry.travelRegionId, entry]));

  // --- Source 1: already-KB-documented Places -----------------------------
  const excludeGeoPlaceIdsByTravelRegionId = new Map<string, Set<string>>();
  for (const region of KB_APPROVED_REGIONS) {
    if (!portfolioTravelRegionIds.has(region.travelRegionId)) {
      findings.push({
        code: "SHEET2_ORPHANED_KB_REGION",
        severity: "error",
        travelRegionId: region.travelRegionId,
        message: `kbApprovedRegions.ts row "${region.id}" declares travelRegionId "${region.travelRegionId}", which does not match any KB_APPROVED_PORTFOLIO entry. Fix the transcription before this run's Sheet 2 output can be trusted for this row.`,
      });
      continue;
    }

    let geoIdentity = EMPTY_GEO_IDENTITY;
    try {
      const match = await repository.findBestMatch(region.name);
      if (match) {
        geoIdentity = {
          geoPlaceId: match.geoPlaceId,
          matchScore: match.matchScore,
          placeType: match.placeType,
          admin1Name: match.admin1Name,
          admin2Name: match.admin2Name,
          latitude: match.latitude,
          longitude: match.longitude,
          population: match.population,
        };
        const exclusions = excludeGeoPlaceIdsByTravelRegionId.get(region.travelRegionId) ?? new Set<string>();
        exclusions.add(match.geoPlaceId);
        excludeGeoPlaceIdsByTravelRegionId.set(region.travelRegionId, exclusions);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      findings.push({
        code: "SHEET2_KNOWN_PLACE_GEO_IDENTITY_LOOKUP_FAILED",
        severity: "warning",
        travelRegionId: region.travelRegionId,
        message: `geo_places identity lookup failed for known KB Place "${region.name}": ${message}. Identity fields left null for this run; existsInKB/travelRegionId are unaffected (they come from the KB transcription, not this lookup).`,
      });
    }

    rows.push({
      ...geoIdentity,
      placeId: region.id,
      travelRegionId: region.travelRegionId,
      name: region.name,
      kbSectionRef: region.kbSection,
      existsInKB: "Yes",
      extractedAt: generatedAt,
      status: existingStatusByPlaceId.get(region.id) ?? "", // Category C for existsInKB = Yes rows (EBC-R1.3-WS1-004 Section 4.2) — pure Product ownership; the generator never seeds a value.
      productOwnedFields: existingProductFieldsByPlaceId.get(region.id) ?? {},
    });
  }

  // --- Source 2: newly-discovered candidates, via geoScope -----------------
  for (const entry of KB_APPROVED_PORTFOLIO) {
    const travelRegionId = slug(entry.name);
    const pending = pendingByTravelRegionId.get(travelRegionId);
    if (pending) {
      geoScopeResolutions.push({
        travelRegionId,
        outcome: "pending-approval",
        detail: pending.reason,
        candidatesDiscovered: 0,
      });
      continue; // Expected, disclosed gap (Kashmir) — not an anomaly. No candidate discovery runs until promoted.
    }

    const scope = scopeByTravelRegionId.get(travelRegionId);
    if (!scope) {
      findings.push({
        code: "SHEET2_GEOSCOPE_NOT_DECLARED",
        severity: "error",
        travelRegionId,
        message: `Travel Region "${entry.name}" has no KB_REGION_GEO_SCOPES entry and is not listed in PENDING_KB_REGION_GEO_SCOPES. This is a configuration gap, not an empty result — new-candidate Sheet 2 discovery cannot run for this Travel Region until it is fixed.`,
      });
      geoScopeResolutions.push({
        travelRegionId,
        outcome: "not-declared",
        detail: "No geoScope declaration found for this Travel Region.",
        candidatesDiscovered: 0,
      });
      continue;
    }

    const exclusions = excludeGeoPlaceIdsByTravelRegionId.get(travelRegionId) ?? new Set<string>();
    let candidatesDiscovered = 0;

    for (const rule of scope.rules) {
      let resolution;
      try {
        resolution = await repository.resolveScopeRule(rule);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        findings.push({
          code: "SHEET2_GEOSCOPE_RESOLUTION_FAILED",
          severity: "error",
          travelRegionId,
          message: `geoScope rule resolution failed for Travel Region "${entry.name}": ${message}.`,
        });
        geoScopeResolutions.push({ travelRegionId, outcome: "no-match", detail: message, candidatesDiscovered: 0 });
        continue;
      }

      if (resolution.status === "no-match") {
        findings.push({
          code: "SHEET2_GEOSCOPE_NO_MATCH",
          severity: "error",
          travelRegionId,
          message: `Could not resolve geoScope rule for Travel Region "${entry.name}" — attempted name(s): ${resolution.attemptedMatchNames.join(", ")}. No new candidates discovered for this rule this run; existing KB-documented Places for this Travel Region (Source 1 above) are unaffected.`,
        });
        geoScopeResolutions.push({
          travelRegionId,
          outcome: "no-match",
          detail: `Unresolved name(s): ${resolution.attemptedMatchNames.join(", ")}`,
          candidatesDiscovered: 0,
        });
        continue;
      }
      if (resolution.status === "ambiguous") {
        findings.push({
          code: "SHEET2_GEOSCOPE_AMBIGUOUS",
          severity: "error",
          travelRegionId,
          message: `geoScope rule for Travel Region "${entry.name}" (matching "${resolution.attemptedMatchName}") resolved to ${resolution.candidates.length} equally-plausible geo_places rows — refusing to guess. Narrow the rule (e.g. add parentAdmin1MatchName) or resolve manually.`,
        });
        geoScopeResolutions.push({
          travelRegionId,
          outcome: "ambiguous",
          detail: `${resolution.candidates.length} candidates for "${resolution.attemptedMatchName}"`,
          candidatesDiscovered: 0,
        });
        continue;
      }

      // resolved
      if (resolution.scope.kind === "explicit-seed") {
        for (const seed of resolution.scope.seeds) {
          if (exclusions.has(seed.geoPlaceId)) continue; // already a known KB Place — never duplicated as a candidate.
          const placeId = `${travelRegionId}--${slug(seed.canonicalName)}`;
          rows.push({
            geoPlaceId: seed.geoPlaceId,
            matchScore: seed.matchScore,
            placeType: seed.placeType,
            admin1Name: seed.admin1Name,
            admin2Name: seed.admin2Name,
            latitude: seed.latitude,
            longitude: seed.longitude,
            population: seed.population,
            placeId,
            travelRegionId,
            name: seed.canonicalName,
            kbSectionRef: null,
            existsInKB: "No",
            extractedAt: generatedAt,
            status: existingStatusByPlaceId.get(placeId) ?? "Proposed",
            productOwnedFields: existingProductFieldsByPlaceId.get(placeId) ?? {},
          });
          candidatesDiscovered += 1;
        }
        geoScopeResolutions.push({
          travelRegionId,
          outcome: "resolved",
          detail: `explicit-seed: ${resolution.scope.seeds.length} named place(s) resolved`,
          candidatesDiscovered,
        });
        continue;
      }

      let candidates;
      try {
        candidates = await repository.findCandidatesInScope(resolution.scope, exclusions);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        findings.push({
          code: "SHEET2_CANDIDATE_QUERY_FAILED",
          severity: "error",
          travelRegionId,
          message: `Candidate discovery query failed for Travel Region "${entry.name}": ${message}.`,
        });
        geoScopeResolutions.push({ travelRegionId, outcome: "no-match", detail: message, candidatesDiscovered: 0 });
        continue;
      }

      for (const candidate of candidates) {
        const placeId = `${travelRegionId}--${slug(candidate.canonicalName)}`;
        rows.push({
          geoPlaceId: candidate.geoPlaceId,
          matchScore: null, // this row was found by scope containment, not name-similarity — no matchScore applies (EBC-R1.3-WS3-001 Section 5.3: matchScore is "the extraction's confidence score for the geoPlaceId match" — not meaningful for a containment-discovered row).
          placeType: candidate.placeType,
          admin1Name: candidate.admin1Name,
          admin2Name: candidate.admin2Name,
          latitude: candidate.latitude,
          longitude: candidate.longitude,
          population: candidate.population,
          placeId,
          travelRegionId,
          name: candidate.canonicalName,
          kbSectionRef: null,
          existsInKB: "No",
          extractedAt: generatedAt,
          status: existingStatusByPlaceId.get(placeId) ?? "Proposed",
          productOwnedFields: existingProductFieldsByPlaceId.get(placeId) ?? {},
        });
        candidatesDiscovered += 1;
      }
      const scopeKind = resolution.scope.kind === "admin" ? `admin (matched "${resolution.scope.matchedName}")` : "country";
      geoScopeResolutions.push({
        travelRegionId,
        outcome: "resolved",
        detail: `${scopeKind}: ${candidates.length} candidate(s) found`,
        candidatesDiscovered,
      });
    }
  }

  return { rows, findings, geoScopeResolutions };
}
