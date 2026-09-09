/**
 * Sheet 1 (Travel Regions) builder. Reads `KB_APPROVED_PORTFOLIO`
 * (identity/hierarchy source, `EBC-R1.3-WS3-001` Section 4.1) and attaches
 * `geoPlaceId`/admin/coordinate facts via a best-match live lookup
 * (`EBC-R1.3-WS3-001` Section 5.2) — best match only, never guessed;
 * below-threshold or absent matches are left `null`.
 */

import { KB_APPROVED_PORTFOLIO, type KbApprovedDestination } from "../journey-intelligence/kbApprovedPortfolio.js";
import { slug } from "../journey-intelligence/utils.js";
import type { BootstrapGeoRepository } from "../../lib/geo-validation/bootstrapRepository.js";
import { EMPTY_GEO_IDENTITY, type TravelRegionRow, type ValidationFinding } from "./types.js";

function countryFor(entry: KbApprovedDestination): string {
  // EBC-R1.3-WS1-003 Section 2.1: `country` is the actual country name,
  // distinct from `category` (Domestic/International). kbApprovedPortfolio.ts
  // does not carry a country field directly (it predates this requirement
  // — WP-4's original scope), so it is derived here from the KB's own
  // named entries. India is the only domestic country in the approved
  // portfolio (KB Sections 10.1/11.1); every international entry maps
  // 1:1 to a distinct country by name.
  if (entry.scope === "Domestic") return "India";
  const INTERNATIONAL_COUNTRY_BY_NAME: Readonly<Record<string, string>> = {
    Dubai: "United Arab Emirates",
    Bali: "Indonesia",
    Malaysia: "Malaysia",
    Singapore: "Singapore",
    "Sri Lanka": "Sri Lanka",
    Thailand: "Thailand",
    Vietnam: "Vietnam",
  };
  return INTERNATIONAL_COUNTRY_BY_NAME[entry.name] ?? entry.name;
}

const COUNTRY_CODE_BY_COUNTRY: Readonly<Record<string, string>> = {
  India: "IN",
  "United Arab Emirates": "AE",
  Indonesia: "ID",
  Malaysia: "MY",
  Singapore: "SG",
  "Sri Lanka": "LK",
  Thailand: "TH",
  Vietnam: "VN",
};

export async function buildTravelRegions(
  repository: BootstrapGeoRepository,
  generatedAt: string,
  existingKbStatusByTravelRegionId: ReadonlyMap<string, string>,
  existingProductFieldsByTravelRegionId: ReadonlyMap<string, Readonly<Record<string, string>>>,
): Promise<{ readonly rows: readonly TravelRegionRow[]; readonly findings: readonly ValidationFinding[] }> {
  const findings: ValidationFinding[] = [];
  const rows: TravelRegionRow[] = [];

  for (const entry of KB_APPROVED_PORTFOLIO) {
    const travelRegionId = slug(entry.name);
    const country = countryFor(entry);
    const countryCode = COUNTRY_CODE_BY_COUNTRY[country];

    let geoIdentity = EMPTY_GEO_IDENTITY;
    try {
      const match = await repository.findBestMatch(entry.name, countryCode ? { countryCode } : undefined);
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
      } else {
        findings.push({
          code: "SHEET1_GEO_IDENTITY_NO_MATCH",
          severity: "warning",
          travelRegionId,
          message: `No confident geo_places match found for Travel Region "${entry.name}" — geoPlaceId and related identity fields left null. Not a blocker (this field is optional, per EBC-R1.3-WS3-001 Section 4.1) but worth Product/Rad review if unexpected.`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      findings.push({
        code: "SHEET1_GEO_IDENTITY_LOOKUP_FAILED",
        severity: "warning",
        travelRegionId,
        message: `geo_places lookup failed for Travel Region "${entry.name}": ${message}. geoPlaceId and related identity fields left null for this run.`,
      });
    }

    const existingKbStatus = existingKbStatusByTravelRegionId.get(travelRegionId);
    const kbStatus = existingKbStatus ?? "ACTIVE"; // KB Sections 10-11 header: "all destinations in this section are ACTIVE for Release 1" — the correct seed default; Product owns and corrects it thereafter (Category B).
    if (existingKbStatus === undefined) {
      findings.push({
        code: "SHEET1_KB_STATUS_SEEDED",
        severity: "warning",
        travelRegionId,
        message: `kbStatus seeded as "ACTIVE" for new Travel Region "${entry.name}" (first generation run for this row). Product owns this value from here on — the generator will never overwrite it again.`,
      });
    }

    rows.push({
      ...geoIdentity,
      travelRegionId,
      name: entry.name,
      category: entry.scope,
      country,
      recordType: entry.recordType,
      kbSectionRef: entry.kbSection,
      existsInKB: "Yes",
      extractedAt: generatedAt,
      kbStatus,
      productOwnedFields: existingProductFieldsByTravelRegionId.get(travelRegionId) ?? {},
      geoScopeResolution: null, // filled in by the orchestrator once geoScope resolution (a Sheet 2 concern) runs — kept on the row only for the Validation Report, never written to Sheet 1 itself.
    });
  }

  return { rows, findings };
}
