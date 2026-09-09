/**
 * GOVERNANCE BOUNDARY — Business Layer reference data (read-only).
 *
 * A mechanical transcription of every named Region/Place row in the
 * Destination Knowledge Base's approved portfolio
 * (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, Sections 10-11's
 * per-destination "Region or area" / "Member region" tables), scoped to
 * each row's parent Travel Region via `travelRegionId` (the same
 * `slug()`-derived identifier the Bootstrap Generator assigns to every
 * `KB_APPROVED_PORTFOLIO` entry — see `./kbApprovedPortfolio.js`).
 *
 * This is the structured Sheet 2 ("Places") source `EBC-R1.3-WS1-003`
 * Section 8.3 identified as missing (consolidated as OD-3 in
 * `EBC-R1.3-WS1-004` Section 7, resolution option (a)), and which
 * `EBC-R1.3-WS1-006` Section 1.1 / Section 3.3 confirmed is the *only*
 * mechanism that can ever correctly mark one of these rows
 * `existsInKB = Yes`: several KB Place names are curated bundles of more
 * than one real-world place (e.g. "North Goa - Candolim / Sinquerim"), at
 * a granularity `geo_places` name-matching cannot, even in principle,
 * reproduce. For every row below, `travelRegionId` is given directly by
 * this transcription, not derived by geographic matching at generation
 * time — the Place -> Travel Region assignment problem that
 * `EBC-R1.3-WS1-006`'s `geoScope` mechanism (`./kbRegionGeoScope.js`)
 * solves for *new*, not-yet-KB-documented candidates does not apply here.
 *
 * This module does not decide business scope — it restates a decision the
 * Knowledge Base has already made. Any change to a Region's name, or to
 * which Travel Region it belongs, must happen in the Knowledge Base first
 * (KB Section 12.2 Activation Checklist), with this file then updated to
 * match, as a documentation-alignment change, not a business decision.
 *
 * Count disclosure: this direct transcription of KB Sections 10-11 yields
 * 109 Region/Place rows across 24 Travel Regions (72 domestic, 37
 * international) - a higher count than the "~89 Places under 22
 * destination IDs" estimate `EBC-R1.2-03.04` Section 12 originally cited
 * and `EBC-R1.3-WS1-003` Section 8.3 repeated. That estimate is superseded
 * by this direct count, not silently reconciled; Tiger/Arjun should note
 * the discrepancy at the next governance review, consistent with Project
 * Instructions Section 32 (documentation currency) - it does not change
 * this transcription's own correctness, since every row here is read
 * directly from the KB's own current region tables.
 *
 * Governance boundary added under `EBC-R1.3-WS1-007-RAD` (Bootstrap
 * Generator Engineering Implementation), per the Sheet 2 structured-source
 * resolution `EBC-R1.3-WS1-004` Section 7 (OD-3) and `EBC-R1.3-WS1-006`
 * Section 3.3 left for this implementation card to action.
 */

export interface KbApprovedRegion {
  /**
   * Stable identifier, scoped to its parent Travel Region:
   * `${slug(parentName)}--${slug(name)}`. Computed once, at transcription
   * time, from the exact strings below - never re-slugified at generation
   * time from potentially-edited data, so a KB prose rewording that keeps
   * the same guest-facing name never silently changes this id.
   */
  readonly id: string;
  /** Exact guest-facing region/place name, as it appears in the KB's own "Region or area" / "Member region" table. */
  readonly name: string;
  /** Foreign key into `KB_APPROVED_PORTFOLIO` - must equal `slug(parentEntry.name)` for exactly one entry there. */
  readonly travelRegionId: string;
  /** The KB section this row was transcribed from (its parent destination's section - the table itself carries no per-row section number). */
  readonly kbSection: string;
}

/**
 * 109 entries, transcribed directly from KB Sections 10.2-10.18
 * (domestic, 72 rows across 17 Travel Regions) and 11.2-11.8
 * (international, 37 rows across 7 Travel Regions). Every one of the 24
 * `KB_APPROVED_PORTFOLIO` Travel Regions has at least one row here -
 * validated by `validateKbApprovedRegionsCoverage()` below, not merely
 * asserted in this comment.
 */
export const KB_APPROVED_REGIONS: readonly KbApprovedRegion[] = [
  // Agra (10.2)
  { id: "agra--taj-east-gate-tajganj", name: "Taj East Gate / Tajganj", travelRegionId: "agra", kbSection: "10.2" },
  { id: "agra--agra-fort-and-old-city-heritage", name: "Agra Fort and old-city heritage", travelRegionId: "agra", kbSection: "10.2" },

  // Amritsar (10.3)
  { id: "amritsar--golden-temple-precinct", name: "Golden Temple precinct", travelRegionId: "amritsar", kbSection: "10.3" },
  { id: "amritsar--old-city", name: "Old City", travelRegionId: "amritsar", kbSection: "10.3" },
  { id: "amritsar--attari-wagah-corridor", name: "Attari–Wagah corridor", travelRegionId: "amritsar", kbSection: "10.3" },

  // Andaman (10.4)
  { id: "andaman--port-blair", name: "Port Blair", travelRegionId: "andaman", kbSection: "10.4" },
  { id: "andaman--swaraj-dweep-havelock", name: "Swaraj Dweep (Havelock)", travelRegionId: "andaman", kbSection: "10.4" },
  { id: "andaman--shaheed-dweep-neil", name: "Shaheed Dweep (Neil)", travelRegionId: "andaman", kbSection: "10.4" },

  // Goa (10.5)
  { id: "goa--north-goa-candolim-sinquerim", name: "North Goa — Candolim / Sinquerim", travelRegionId: "goa", kbSection: "10.5" },
  { id: "goa--north-goa-anjuna-vagator", name: "North Goa — Anjuna / Vagator", travelRegionId: "goa", kbSection: "10.5" },
  { id: "goa--panaji-fontainhas", name: "Panaji / Fontainhas", travelRegionId: "goa", kbSection: "10.5" },
  { id: "goa--south-goa", name: "South Goa", travelRegionId: "goa", kbSection: "10.5" },

  // Gujarat (10.6)
  { id: "gujarat--ahmedabad-and-heritage-corridor", name: "Ahmedabad and heritage corridor", travelRegionId: "gujarat", kbSection: "10.6" },
  { id: "gujarat--kutch", name: "Kutch", travelRegionId: "gujarat", kbSection: "10.6" },
  { id: "gujarat--gir-and-junagadh", name: "Gir and Junagadh", travelRegionId: "gujarat", kbSection: "10.6" },
  { id: "gujarat--dwarka-somnath", name: "Dwarka–Somnath", travelRegionId: "gujarat", kbSection: "10.6" },

  // Himachal Pradesh (10.7)
  { id: "himachal-pradesh--shimla-mashobra", name: "Shimla / Mashobra", travelRegionId: "himachal-pradesh", kbSection: "10.7" },
  { id: "himachal-pradesh--manali-naggar", name: "Manali / Naggar", travelRegionId: "himachal-pradesh", kbSection: "10.7" },
  { id: "himachal-pradesh--dharamshala-mcleod-ganj", name: "Dharamshala / McLeod Ganj", travelRegionId: "himachal-pradesh", kbSection: "10.7" },
  { id: "himachal-pradesh--spiti-valley", name: "Spiti Valley", travelRegionId: "himachal-pradesh", kbSection: "10.7" },

  // Karnataka (10.8)
  { id: "karnataka--bengaluru", name: "Bengaluru", travelRegionId: "karnataka", kbSection: "10.8" },
  { id: "karnataka--mysuru", name: "Mysuru", travelRegionId: "karnataka", kbSection: "10.8" },
  { id: "karnataka--coorg", name: "Coorg", travelRegionId: "karnataka", kbSection: "10.8" },
  { id: "karnataka--hampi", name: "Hampi", travelRegionId: "karnataka", kbSection: "10.8" },
  { id: "karnataka--gokarna-coastal-karnataka", name: "Gokarna / coastal Karnataka", travelRegionId: "karnataka", kbSection: "10.8" },

  // Kashmir (10.9)
  { id: "kashmir--srinagar", name: "Srinagar", travelRegionId: "kashmir", kbSection: "10.9" },
  { id: "kashmir--gulmarg", name: "Gulmarg", travelRegionId: "kashmir", kbSection: "10.9" },
  { id: "kashmir--pahalgam", name: "Pahalgam", travelRegionId: "kashmir", kbSection: "10.9" },
  { id: "kashmir--sonamarg", name: "Sonamarg", travelRegionId: "kashmir", kbSection: "10.9" },

  // Kerala (10.10)
  { id: "kerala--kochi-fort-kochi", name: "Kochi / Fort Kochi", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--munnar", name: "Munnar", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--thekkady-periyar", name: "Thekkady / Periyar", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--alappuzha", name: "Alappuzha", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--kumarakom", name: "Kumarakom", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--varkala-kovalam", name: "Varkala / Kovalam", travelRegionId: "kerala", kbSection: "10.10" },
  { id: "kerala--wayanad", name: "Wayanad", travelRegionId: "kerala", kbSection: "10.10" },

  // Northeast (10.11) - Collection; members per KB_APPROVED_PORTFOLIO's own `members` array
  { id: "northeast--meghalaya-shillong-sohra", name: "Meghalaya — Shillong / Sohra", travelRegionId: "northeast", kbSection: "10.11" },
  { id: "northeast--meghalaya-dawki-mawlynnong-belt", name: "Meghalaya — Dawki / Mawlynnong belt", travelRegionId: "northeast", kbSection: "10.11" },
  { id: "northeast--sikkim-gangtok", name: "Sikkim — Gangtok", travelRegionId: "northeast", kbSection: "10.11" },
  { id: "northeast--sikkim-pelling", name: "Sikkim — Pelling", travelRegionId: "northeast", kbSection: "10.11" },
  { id: "northeast--darjeeling", name: "Darjeeling", travelRegionId: "northeast", kbSection: "10.11" },

  // Pondicherry (10.12)
  { id: "pondicherry--french-quarter-white-town", name: "French Quarter / White Town", travelRegionId: "pondicherry", kbSection: "10.12" },
  { id: "pondicherry--tamil-quarter", name: "Tamil Quarter", travelRegionId: "pondicherry", kbSection: "10.12" },
  { id: "pondicherry--auroville-corridor", name: "Auroville corridor", travelRegionId: "pondicherry", kbSection: "10.12" },

  // Assam (10.13)
  { id: "assam--guwahati", name: "Guwahati", travelRegionId: "assam", kbSection: "10.13" },
  { id: "assam--kaziranga", name: "Kaziranga", travelRegionId: "assam", kbSection: "10.13" },
  { id: "assam--majuli-jorhat", name: "Majuli / Jorhat", travelRegionId: "assam", kbSection: "10.13" },
  { id: "assam--dibrugarh-tea-country", name: "Dibrugarh tea country", travelRegionId: "assam", kbSection: "10.13" },

  // Rajasthan (10.14)
  { id: "rajasthan--jaipur", name: "Jaipur", travelRegionId: "rajasthan", kbSection: "10.14" },
  { id: "rajasthan--udaipur", name: "Udaipur", travelRegionId: "rajasthan", kbSection: "10.14" },
  { id: "rajasthan--jodhpur", name: "Jodhpur", travelRegionId: "rajasthan", kbSection: "10.14" },
  { id: "rajasthan--jaisalmer", name: "Jaisalmer", travelRegionId: "rajasthan", kbSection: "10.14" },
  { id: "rajasthan--ranthambore", name: "Ranthambore", travelRegionId: "rajasthan", kbSection: "10.14" },
  { id: "rajasthan--bikaner-rural-rajasthan", name: "Bikaner / rural Rajasthan", travelRegionId: "rajasthan", kbSection: "10.14" },

  // Tamil Nadu (10.15)
  { id: "tamil-nadu--chennai", name: "Chennai", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--mamallapuram", name: "Mamallapuram", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--madurai", name: "Madurai", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--thanjavur-chettinad-corridor", name: "Thanjavur / Chettinad corridor", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--rameswaram", name: "Rameswaram", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--ooty", name: "Ooty", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--kotagiri", name: "Kotagiri", travelRegionId: "tamil-nadu", kbSection: "10.15" },
  { id: "tamil-nadu--kodaikanal", name: "Kodaikanal", travelRegionId: "tamil-nadu", kbSection: "10.15" },

  // Hyderabad (10.16)
  { id: "hyderabad--old-city-charminar", name: "Old City / Charminar", travelRegionId: "hyderabad", kbSection: "10.16" },
  { id: "hyderabad--golconda-qutb-shahi-belt", name: "Golconda / Qutb Shahi belt", travelRegionId: "hyderabad", kbSection: "10.16" },
  { id: "hyderabad--banjara-hills-hitec-city", name: "Banjara Hills / HITEC City", travelRegionId: "hyderabad", kbSection: "10.16" },

  // Vizag (10.17)
  { id: "vizag--rk-beach-city-coast", name: "RK Beach / city coast", travelRegionId: "vizag", kbSection: "10.17" },
  { id: "vizag--rushikonda-northern-coast", name: "Rushikonda / northern coast", travelRegionId: "vizag", kbSection: "10.17" },
  { id: "vizag--araku-valley-extension", name: "Araku Valley extension", travelRegionId: "vizag", kbSection: "10.17" },

  // Wildlife (10.18) - Collection; members per KB_APPROVED_PORTFOLIO's own `members` array
  { id: "wildlife--kabini", name: "Kabini", travelRegionId: "wildlife", kbSection: "10.18" },
  { id: "wildlife--corbett", name: "Corbett", travelRegionId: "wildlife", kbSection: "10.18" },
  { id: "wildlife--bandipur", name: "Bandipur", travelRegionId: "wildlife", kbSection: "10.18" },
  { id: "wildlife--masinagudi", name: "Masinagudi", travelRegionId: "wildlife", kbSection: "10.18" },

  // Dubai (11.2)
  { id: "dubai--downtown-dubai", name: "Downtown Dubai", travelRegionId: "dubai", kbSection: "11.2" },
  { id: "dubai--palm-jumeirah", name: "Palm Jumeirah", travelRegionId: "dubai", kbSection: "11.2" },
  { id: "dubai--dubai-marina-jbr", name: "Dubai Marina / JBR", travelRegionId: "dubai", kbSection: "11.2" },
  { id: "dubai--old-dubai-al-seef", name: "Old Dubai / Al Seef", travelRegionId: "dubai", kbSection: "11.2" },
  { id: "dubai--desert-conservation-area", name: "Desert conservation area", travelRegionId: "dubai", kbSection: "11.2" },

  // Bali (11.3)
  { id: "bali--ubud", name: "Ubud", travelRegionId: "bali", kbSection: "11.3" },
  { id: "bali--seminyak", name: "Seminyak", travelRegionId: "bali", kbSection: "11.3" },
  { id: "bali--nusa-dua", name: "Nusa Dua", travelRegionId: "bali", kbSection: "11.3" },
  { id: "bali--uluwatu-jimbaran", name: "Uluwatu / Jimbaran", travelRegionId: "bali", kbSection: "11.3" },
  { id: "bali--sanur", name: "Sanur", travelRegionId: "bali", kbSection: "11.3" },
  { id: "bali--kuta", name: "Kuta", travelRegionId: "bali", kbSection: "11.3" },

  // Malaysia (11.4)
  { id: "malaysia--kuala-lumpur", name: "Kuala Lumpur", travelRegionId: "malaysia", kbSection: "11.4" },
  { id: "malaysia--penang-george-town", name: "Penang / George Town", travelRegionId: "malaysia", kbSection: "11.4" },
  { id: "malaysia--langkawi", name: "Langkawi", travelRegionId: "malaysia", kbSection: "11.4" },
  { id: "malaysia--cameron-highlands", name: "Cameron Highlands", travelRegionId: "malaysia", kbSection: "11.4" },

  // Singapore (11.5)
  { id: "singapore--marina-bay", name: "Marina Bay", travelRegionId: "singapore", kbSection: "11.5" },
  { id: "singapore--sentosa", name: "Sentosa", travelRegionId: "singapore", kbSection: "11.5" },
  { id: "singapore--civic-district-singapore-river", name: "Civic District / Singapore River", travelRegionId: "singapore", kbSection: "11.5" },
  { id: "singapore--chinatown-little-india-kampong-gelam", name: "Chinatown / Little India / Kampong Gelam", travelRegionId: "singapore", kbSection: "11.5" },

  // Sri Lanka (11.6)
  { id: "sri-lanka--cultural-triangle-sigiriya-dambulla", name: "Cultural Triangle — Sigiriya / Dambulla", travelRegionId: "sri-lanka", kbSection: "11.6" },
  { id: "sri-lanka--kandy", name: "Kandy", travelRegionId: "sri-lanka", kbSection: "11.6" },
  { id: "sri-lanka--nuwara-eliya-ella", name: "Nuwara Eliya / Ella", travelRegionId: "sri-lanka", kbSection: "11.6" },
  { id: "sri-lanka--yala-udawalawe", name: "Yala / Udawalawe", travelRegionId: "sri-lanka", kbSection: "11.6" },
  { id: "sri-lanka--galle-and-the-south-coast", name: "Galle and the south coast", travelRegionId: "sri-lanka", kbSection: "11.6" },
  { id: "sri-lanka--bentota-west-coast-resort-belt", name: "Bentota / west-coast resort belt", travelRegionId: "sri-lanka", kbSection: "11.6" },

  // Thailand (11.7)
  { id: "thailand--bangkok", name: "Bangkok", travelRegionId: "thailand", kbSection: "11.7" },
  { id: "thailand--chiang-mai", name: "Chiang Mai", travelRegionId: "thailand", kbSection: "11.7" },
  { id: "thailand--phuket-quieter-beach-zones", name: "Phuket — quieter beach zones", travelRegionId: "thailand", kbSection: "11.7" },
  { id: "thailand--patong", name: "Patong", travelRegionId: "thailand", kbSection: "11.7" },
  { id: "thailand--krabi-ao-nang-railay-access", name: "Krabi / Ao Nang / Railay access", travelRegionId: "thailand", kbSection: "11.7" },
  { id: "thailand--koh-samui", name: "Koh Samui", travelRegionId: "thailand", kbSection: "11.7" },

  // Vietnam (11.8)
  { id: "vietnam--hanoi", name: "Hanoi", travelRegionId: "vietnam", kbSection: "11.8" },
  { id: "vietnam--ha-long-lan-ha-area", name: "Ha Long / Lan Ha area", travelRegionId: "vietnam", kbSection: "11.8" },
  { id: "vietnam--hoi-an", name: "Hoi An", travelRegionId: "vietnam", kbSection: "11.8" },
  { id: "vietnam--da-nang", name: "Da Nang", travelRegionId: "vietnam", kbSection: "11.8" },
  { id: "vietnam--ho-chi-minh-city", name: "Ho Chi Minh City", travelRegionId: "vietnam", kbSection: "11.8" },
  { id: "vietnam--phu-quoc", name: "Phu Quoc", travelRegionId: "vietnam", kbSection: "11.8" },
];

/**
 * Fail-closed coverage check: every `KB_APPROVED_PORTFOLIO` Travel Region
 * must have at least one `KB_APPROVED_REGIONS` row, and every
 * `KB_APPROVED_REGIONS.travelRegionId` must resolve to exactly one
 * `KB_APPROVED_PORTFOLIO` entry. Called by the Bootstrap Generator's own
 * validation pass (`web/scripts/bootstrap-workbook/validateSources.ts`) -
 * exported here so it can also run as a standalone guard against silent
 * drift if either file is edited independently.
 */
export function validateKbApprovedRegionsCoverage(
  portfolioTravelRegionIds: ReadonlySet<string>,
): { readonly orphanedRegionIds: readonly string[]; readonly uncoveredTravelRegionIds: readonly string[] } {
  const orphanedRegionIds = KB_APPROVED_REGIONS.filter(
    (region) => !portfolioTravelRegionIds.has(region.travelRegionId),
  ).map((region) => region.id);
  const coveredTravelRegionIds = new Set(KB_APPROVED_REGIONS.map((region) => region.travelRegionId));
  const uncoveredTravelRegionIds = [...portfolioTravelRegionIds].filter(
    (travelRegionId) => !coveredTravelRegionIds.has(travelRegionId),
  );
  return { orphanedRegionIds, uncoveredTravelRegionIds };
}
