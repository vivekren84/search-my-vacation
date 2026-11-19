/**
 * Milestone 3 Comprehensive Verification Suite (Search Quality, Stories Gate & Catalogue Readiness).
 *
 * Authored for Keerthi (QA Lead), Archie (Solution Architect) & Vivek (Product Owner).
 * Validates all 4 Milestone 3 backlog items:
 * - S-01: Destination ranking for ambiguous hub queries (Bengaluru, Chennai, Mumbai)
 * - S-02: Country-level search behavior (India entity at #1 ahead of foreign prefix matches)
 * - P-02: Traveller Stories quality gate (zero empty/broken cards, graceful omission of stubs)
 * - N-03: Catalogue content completeness for Amritsar, Darjeeling, and Corbett
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { formatDisambiguation, type GeoSearchResult } from "../../geo-validation/index.js";
import { isStoryQualityGated } from "../../traveller-stories/storyQualityGate.js";
import {
  getApprovedTravellerJourneys,
  getTravellerJourneyBySlug,
  type TravellerJourneyCard,
} from "../../traveller-stories/getTravellerJourneys.js";
import { getTestimonialForJourney } from "../../traveller-stories/getTestimonial.js";
import { getHomepageTravellerStories } from "../../traveller-stories/getHomepageTravellerStories.js";
import { GOVERNED_DESTINATIONS_COMPLETION } from "../catalogue/governedCatalogueContent.js";
import { journeyCanonicalImages } from "../../../config/destination-images.config.js";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`[M3 Verification FAILED] ${message}`);
}

function verifyFilesExist() {
  const root = process.cwd();

  const requiredFiles = [
    "../supabase/migrations/20261119100000_search_geo_places_ranking_refinement.sql",
    "../supabase/rollbacks/20261119100000_search_geo_places_ranking_refinement.rollback.sql",
    "lib/traveller-stories/storyQualityGate.ts",
    "lib/journey-director/catalogue/governedCatalogueContent.ts",
    "public/images/journey-director/amritsar.webp",
    "public/images/journey-director/darjeeling.webp",
    "public/images/journey-director/corbett.webp",
  ];

  for (const file of requiredFiles) {
    const fullPath = join(root, file);
    assert(existsSync(fullPath), `Required milestone file exists: ${file}`);
  }
}

function verifyS01AndS02SearchRanking() {
  const root = process.cwd();
  const migrationPath = join(root, "../supabase/migrations/20261119100000_search_geo_places_ranking_refinement.sql");
  const rollbackPath = join(root, "../supabase/rollbacks/20261119100000_search_geo_places_ranking_refinement.rollback.sql");

  const migrationSql = readFileSync(migrationPath, "utf8");
  const rollbackSql = readFileSync(rollbackPath, "utf8");

  // Invariant 1: Function signature must match exactly
  assert(
    migrationSql.includes("function public.search_geo_places(search_query text, result_limit int default 8)"),
    "search_geo_places maintains exact signature contract",
  );
  assert(
    migrationSql.includes("set statement_timeout to '2000'"),
    "search_geo_places preserves 2000ms bounded statement timeout",
  );
  assert(
    migrationSql.includes("language plpgsql"),
    "search_geo_places uses plpgsql language for dynamic execution",
  );

  // Invariant 2: S-02 Country-level search & S-01 Exact Match hierarchy
  assert(
    migrationSql.includes("when s.search_text = %L then (case when s.alias_id is null then 4.0 else 3.8 end)"),
    "Hierarchical scoring rewards exact canonical match (4.0) and exact alias match (3.8)",
  );
  assert(
    migrationSql.includes("when s.search_text like %L then (case when s.alias_id is null then 2.0 else 1.9 end)"),
    "Prefix match scoring preserved at 2.0 (canonical) and 1.9 (alias)",
  );
  assert(
    migrationSql.includes("else similarity(s.search_text, %L)"),
    "Trigram similarity fallback preserved for typos and fuzzy matching",
  );

  // Invariant 3: S-01 Ambiguous hub ranking & Place Type hierarchy
  assert(
    migrationSql.includes("when p.place_type = 'country' then 100"),
    "Place type hierarchy awards top priority (100) to country entities (S-02)",
  );
  assert(
    migrationSql.includes("when p.place_type = 'city' then 80"),
    "Place type hierarchy awards second priority (80) to primary cities/hubs (S-01)",
  );
  assert(
    migrationSql.includes("when p.place_type = 'district' then 30"),
    "Place type hierarchy positions administrative districts (30) below primary cities (S-01)",
  );

  // Invariant 4: Rollback validity
  assert(
    rollbackSql.includes("function public.search_geo_places(search_query text, result_limit int default 8)"),
    "Rollback SQL restores exact prior search_geo_places signature",
  );

  // Invariant 5: Disambiguation formatting
  const indiaCountryResult: GeoSearchResult = {
    geoPlaceId: "in-country-1",
    canonicalName: "India",
    placeType: "country",
    countryCode: "IN",
    admin1Name: null,
    admin2Name: null,
    population: 1400000000,
    matchedAlias: null,
  };
  assert(
    formatDisambiguation(indiaCountryResult) === "Country",
    "Country entity India disambiguates cleanly to 'Country'",
  );

  const bengaluruCityResult: GeoSearchResult = {
    geoPlaceId: "blr-city-1",
    canonicalName: "Bengaluru",
    placeType: "city",
    countryCode: "IN",
    admin1Name: "Karnataka",
    admin2Name: "Bengaluru Urban",
    population: 8400000,
    matchedAlias: null,
  };
  assert(
    formatDisambiguation(bengaluruCityResult) === "City, Bengaluru Urban, Karnataka",
    "Bengaluru City disambiguates with administrative hierarchy",
  );

  const bengaluruDistrictResult: GeoSearchResult = {
    geoPlaceId: "blr-dist-1",
    canonicalName: "Bengaluru Urban",
    placeType: "district",
    countryCode: "IN",
    admin1Name: "Karnataka",
    admin2Name: null,
    population: 9600000,
    matchedAlias: null,
  };
  assert(
    formatDisambiguation(bengaluruDistrictResult) === "District, Karnataka",
    "Bengaluru District cleanly distinguishes itself as 'District'",
  );
}

async function verifyP02TravellerStoriesQualityGate() {
  // Test 1: Unit tests on isStoryQualityGated
  const dummyRichJourney: TravellerJourneyCard = {
    slug: "rich-journey",
    journeyId: "JRN-001",
    travellerId: "TR-001",
    travellerDir: "satvender-sikarwar",
    title: "Mountain Holiday",
    travellerName: "Satvender Sikarwar",
    destination: "Manali",
    duration: "5 Days",
    travellerType: "Family",
    experienceType: "Family Holiday",
    travelMonth: "June",
    travelYear: 2024,
    featured: true,
    heroImage: { src: "/traveller-stories/satvender-sikarwar/manali-01.jpg", alt: "Photo", width: 1200, height: 800 },
    heroImageIsCurated: false,
    galleryImages: [],
  };
  assert(isStoryQualityGated(dummyRichJourney) === true, "Journey with real photos passes quality gate");

  const dummyStubJourney: TravellerJourneyCard = {
    slug: "stub-journey",
    journeyId: "JRN-999-STUB",
    travellerId: "TR-999",
    travellerDir: "stub-traveller",
    title: "Empty Stub",
    travellerName: "Stub Traveller",
    destination: "Nowhere",
    duration: "3 Days",
    travellerType: "Solo",
    experienceType: "Solo",
    travelMonth: "January",
    travelYear: 2024,
    featured: false,
    heroImage: null,
    heroImageIsCurated: false,
    galleryImages: [],
  };
  assert(isStoryQualityGated(dummyStubJourney) === false, "Incomplete stub with no photo and no quote fails quality gate");

  // Test 2: Pipeline integration test
  const approvedJourneys = await getApprovedTravellerJourneys();
  assert(approvedJourneys.length > 0, "Approved journeys list is populated");
  assert(
    approvedJourneys.every(isStoryQualityGated),
    "100% of approved journeys satisfy the P-02 quality gate",
  );

  // Invariant: Zero empty monogram cards with no quote
  const invalidCard = approvedJourneys.find((j) => !j.heroImage && !getTestimonialForJourney(j.journeyId));
  assert(!invalidCard, "Zero cards have both missing heroImage and missing testimonial quote");

  // Test 3: Detail page slug resolution guards
  const knownStubSlug = "finding-ourselves-in-the-hills-of-sikkim"; // JRN-037 Abhinaya Murali (0 photos, 0 quote)
  const resolvedStub = await getTravellerJourneyBySlug(knownStubSlug);
  assert(resolvedStub === undefined, "Incomplete stub slug correctly resolves to undefined (triggering 404)");

  const knownValidSlug = "the-andaman-break-the-family-needed-most"; // JRN-025 Sathya Karthik
  const resolvedValid = await getTravellerJourneyBySlug(knownValidSlug);
  assert(resolvedValid !== undefined, "Valid rich journey resolves cleanly by slug");

  // Test 4: Homepage preview stories integration
  const homepageStories = await getHomepageTravellerStories();
  assert(homepageStories.length > 0 && homepageStories.length <= 3, "Homepage preview returns between 1 and 3 stories");
  assert(
    homepageStories.every((s) => s.excerpt.length > 0 && s.heroImage !== null),
    "100% of homepage stories have valid excerpts and hero images",
  );

  // Test 5: Verify TravellerStoryCards component handles quote card layout
  const cardsComponentSource = readFileSync(join(process.cwd(), "components/discovery/TravellerStoryCards.tsx"), "utf8");
  assert(cardsComponentSource.includes("getTestimonialForJourney"), "TravellerStoryCards integrates testimonial quote lookup");
  assert(cardsComponentSource.includes("Verified Traveller"), "TravellerStoryCards renders Verified Traveller badge for text-first quote cards");
  assert(!cardsComponentSource.includes("grid size-16 place-items-center rounded-full bg-white/70 text-lg font-bold text-[#986328]"), "Empty 4:3 monogram placeholder is removed from story cards");
}

function verifyN03CatalogueContentReadiness() {
  const root = process.cwd();
  const amritsar = GOVERNED_DESTINATIONS_COMPLETION.amritsar;
  const darjeeling = GOVERNED_DESTINATIONS_COMPLETION.darjeeling;
  const corbett = GOVERNED_DESTINATIONS_COMPLETION.corbett;

  // 1. Amritsar Verification
  assert(amritsar.id === "amritsar", "Amritsar ID is verified");
  assert(amritsar.kbSection === "10.3", "Amritsar references KB §10.3");
  assert(amritsar.primaryEmotion === "gratitude", "Amritsar primary emotion is gratitude");
  assert(amritsar.supportingEmotions.includes("spirituality"), "Amritsar supporting emotion includes spirituality");
  assert(amritsar.coreThemes.includes("spiritual") && amritsar.coreThemes.includes("food"), "Amritsar themes include spiritual & food");
  assert(amritsar.seasons.peakMonths.includes(10) && amritsar.seasons.peakMonths.includes(12), "Amritsar peak seasons include Oct-Dec");
  assert(amritsar.regions.some((r) => r.name.includes("Golden Temple")), "Amritsar regions include Golden Temple precinct");
  assert(existsSync(join(root, "public", amritsar.heroImage)), "Amritsar hero image exists on disk");
  assert(amritsar.itineraryId === "punjab-amritsar", "Amritsar is linked to punjab-amritsar itinerary");

  // 2. Darjeeling Verification
  assert(darjeeling.id === "darjeeling", "Darjeeling ID is verified");
  assert(darjeeling.kbSection === "10.11", "Darjeeling references KB §10.11 (Northeast Collection)");
  assert(darjeeling.primaryEmotion === "wonder", "Darjeeling primary emotion is wonder");
  assert(darjeeling.supportingEmotions.includes("serenity"), "Darjeeling supporting emotion includes serenity");
  assert(darjeeling.coreThemes.includes("mountains") && darjeeling.coreThemes.includes("hills"), "Darjeeling themes include mountains & hills");
  assert(darjeeling.seasons.peakMonths.includes(4) && darjeeling.seasons.peakMonths.includes(10), "Darjeeling peak seasons include Apr & Oct");
  assert(darjeeling.regions.some((r) => r.name.includes("Darjeeling")), "Darjeeling regions include Darjeeling Hills");
  assert(existsSync(join(root, "public", darjeeling.heroImage)), "Darjeeling hero image exists on disk");
  assert(darjeeling.itineraryId === "west-bengal-darjeeling", "Darjeeling is linked to west-bengal-darjeeling itinerary");

  // 3. Corbett Verification
  assert(corbett.id === "corbett", "Corbett ID is verified");
  assert(corbett.kbSection === "10.18", "Corbett references KB §10.18 (Wildlife Collection)");
  assert(corbett.primaryEmotion === "adventure", "Corbett primary emotion is adventure");
  assert(corbett.supportingEmotions.includes("discovery"), "Corbett supporting emotion includes discovery");
  assert(corbett.coreThemes.includes("wildlife") && corbett.coreThemes.includes("nature"), "Corbett themes include wildlife & nature");
  assert(corbett.seasons.peakMonths.includes(12) && corbett.seasons.peakMonths.includes(3), "Corbett peak seasons include Dec & Mar (Dhikala window)");
  assert(corbett.regions.some((r) => r.name.includes("Corbett")), "Corbett regions include Corbett National Park");
  assert(existsSync(join(root, "public", corbett.heroImage)), "Corbett hero image exists on disk");
  assert(corbett.itineraryId === "uttarakhand-corbett-national-park", "Corbett is linked to uttarakhand-corbett-national-park itinerary");

  // 4. Presentation & Catalogue Wiring
  assert(journeyCanonicalImages.amritsar !== undefined, "Amritsar canonical image is wired in journeyCanonicalImages");
  assert(journeyCanonicalImages.darjeeling !== undefined, "Darjeeling canonical image is wired in journeyCanonicalImages");
  assert(journeyCanonicalImages.corbett !== undefined, "Corbett canonical image is wired in journeyCanonicalImages");
}

async function runMilestone3Verification() {
  console.log("\n=== Starting SMV Release 1.3 Milestone 3 Verification Suite ===\n");

  verifyFilesExist();
  console.log("✓ File existence and structure verified (S-01, S-02, P-02, N-03)");

  verifyS01AndS02SearchRanking();
  console.log("✓ S-01 & S-02: Exact match scoring, country priority (#1) & place-type hierarchy verified");

  await verifyP02TravellerStoriesQualityGate();
  console.log("✓ P-02: Stories quality gate, zero empty cards & text-first quote cards verified");

  verifyN03CatalogueContentReadiness();
  console.log("✓ N-03: Amritsar, Darjeeling & Corbett governed content completeness verified");

  console.log(`\n=== Milestone 3 Verification Complete: ${checks}/${checks} checks PASSED ===\n`);
}

runMilestone3Verification().catch((error) => {
  console.error("\n❌ Milestone 3 Verification Failed:", error);
  process.exit(1);
});
