/**
 * SMV Release 1.4 Milestone 2 Comprehensive Verification Suite
 *
 * Validates all 5 Milestone 2 Backlog Items:
 * - V-01: Region-Level Destination Intelligence (Pilot Circuits: Himachal/Uttarakhand & Kerala/Tamil Nadu)
 * - PO-02: Consultative 'Trip Anchors' on Destination & Inspiration Cards (Duration, Season, Pace, Comfort Tier)
 * - P-08: Weighted Destination Model Runtime & Recommendation Phases (50% Primary, 30% Secondary, 20% Tertiary)
 * - V-03: Companion Destinations Editorial Graph (2–3 High-Trust Pairings & Rationales)
 * - V-05: Regional Recommendations & Circuit Linking in EnginePossibility
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { JourneyPassportSnapshot } from "../../../types/journey-director.js";
import { RELEASE1_CATALOGUE_METADATA, release1JourneyCandidates } from "../catalogue/index.js";
import { generateJourneyRecommendations } from "../engine/index.js";
import {
  PILOT_REGIONS,
  PILOT_CIRCUITS,
  getPilotCircuitsForDestination,
  getPilotRegionById,
  isPilotDestination,
} from "../intelligence/pilotCircuits.js";
import {
  TRIP_ANCHORS_BY_DESTINATION,
  getTripAnchorForDestination,
} from "../../../config/trip-anchors.config.js";
import {
  COMPANION_DESTINATIONS_GRAPH,
  getCompanionDestinations,
} from "../catalogue/companionDestinations.js";
import {
  PREFERENCE_TIER_WEIGHTS,
  calculatePreferenceTierScore,
} from "../engine/engine.rules.js";

let checks = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[R1.4 M2 Verification FAILED] ${message}`);
  }
  checks++;
}

// =========================================================================
// 1. V-01: Region-Level Destination Intelligence & Pilot Circuits
// =========================================================================
function verifyV01PilotCircuits() {
  const root = process.cwd();
  const circuitsModulePath = join(root, "lib", "journey-director", "intelligence", "pilotCircuits.ts");
  assert(existsSync(circuitsModulePath), "V-01: pilotCircuits.ts module exists in intelligence directory");

  // Verify Pilot Geographies
  assert(PILOT_CIRCUITS.length === 2, "V-01: Exactly 2 launch pilot circuits defined");

  const himachalUttarakhand = PILOT_CIRCUITS.find(
    (circuit) => circuit.pilotGeography === "himachal-uttarakhand",
  );
  assert(Boolean(himachalUttarakhand), "V-01: Northern Himalayan circuit defined");
  assert(
    himachalUttarakhand!.destinationIds.includes("himachal-pradesh") &&
      himachalUttarakhand!.destinationIds.includes("corbett"),
    "V-01: Northern circuit links Himachal Pradesh and Corbett/Uttarakhand",
  );
  assert(
    himachalUttarakhand!.primaryRegions.length >= 2,
    "V-01: Northern circuit references at least 2 structured pilot regions",
  );

  const keralaTamilNadu = PILOT_CIRCUITS.find(
    (circuit) => circuit.pilotGeography === "kerala-tamil-nadu",
  );
  assert(Boolean(keralaTamilNadu), "V-01: Southern Peninsular circuit defined");
  assert(
    keralaTamilNadu!.destinationIds.includes("kerala") &&
      keralaTamilNadu!.destinationIds.includes("tamil-nadu"),
    "V-01: Southern circuit links Kerala and Tamil Nadu",
  );
  assert(
    keralaTamilNadu!.primaryRegions.length >= 2,
    "V-01: Southern circuit references at least 2 structured pilot regions",
  );

  // Verify Pilot Regions
  assert(PILOT_REGIONS.length >= 6, "V-01: At least 6 distinct pilot regions authored");
  for (const region of PILOT_REGIONS) {
    assert(Boolean(region.id && region.name), `V-01: Pilot region ${region.id} has valid id and name`);
    assert(region.stops.length >= 2, `V-01: Region ${region.id} has at least 2 stops`);
    assert(Boolean(region.indicativeDuration), `V-01: Region ${region.id} has indicativeDuration`);
    assert(Boolean(region.bestMonths), `V-01: Region ${region.id} has bestMonths`);
    assert(["Unhurried", "Balanced", "Active"].includes(region.pace), `V-01: Region ${region.id} has valid pace`);
    assert(
      ["Boutique Stays", "Curated Luxury", "Experiential Retreats"].includes(region.comfortTier),
      `V-01: Region ${region.id} has valid comfortTier`,
    );
    assert(region.highlights.length >= 2, `V-01: Region ${region.id} has at least 2 highlights`);
    assert(Boolean(region.transferNotes), `V-01: Region ${region.id} has transfer notes`);
  }

  // Lookup helpers
  const hpCircuits = getPilotCircuitsForDestination("himachal-pradesh");
  assert(hpCircuits.length >= 1, "V-01: getPilotCircuitsForDestination returns circuit for himachal-pradesh");
  assert(isPilotDestination("himachal-pradesh"), "V-01: isPilotDestination returns true for himachal-pradesh");
  assert(isPilotDestination("kerala"), "V-01: isPilotDestination returns true for kerala");
  assert(!isPilotDestination("bali"), "V-01: isPilotDestination returns false for non-pilot destination (bali)");

  const shimlaRegion = getPilotRegionById("himachal-shimla-manali");
  assert(Boolean(shimlaRegion), "V-01: getPilotRegionById finds himachal-shimla-manali");
  assert(
    Boolean(shimlaRegion?.stops.includes("Shimla") && shimlaRegion?.stops.includes("Manali")),
    "V-01: Shimla & Manali stops present in region",
  );
}

// =========================================================================
// 2. PO-02: Consultative 'Trip Anchors' on Destination & Inspiration Cards
// =========================================================================
function verifyPO02TripAnchors() {
  const root = process.cwd();
  const tripAnchorsConfigPath = join(root, "config", "trip-anchors.config.ts");
  assert(existsSync(tripAnchorsConfigPath), "PO-02: trip-anchors.config.ts exists");

  const editorialCardsPath = join(root, "components", "discovery", "EditorialCards.tsx");
  const itinerarySectionPath = join(root, "components", "destinations", "DestinationItinerarySection.tsx");

  assert(existsSync(editorialCardsPath), "PO-02: EditorialCards.tsx exists");
  assert(existsSync(itinerarySectionPath), "PO-02: DestinationItinerarySection.tsx exists");

  // Verify Anchors Catalog
  const anchorEntries = Object.entries(TRIP_ANCHORS_BY_DESTINATION);
  assert(anchorEntries.length >= 25, "PO-02: At least 25 destinations configured with consultative trip anchors");

  const coreDestinations = ["himachal-pradesh", "kerala", "rajasthan", "goa", "andaman", "bali", "dubai", "corbett"];
  for (const destId of coreDestinations) {
    const anchor = TRIP_ANCHORS_BY_DESTINATION[destId];
    assert(Boolean(anchor), `PO-02: Anchor metadata exists for ${destId}`);
    assert(Boolean(anchor.duration), `PO-02: Duration present for ${destId}`);
    assert(Boolean(anchor.bestMonths), `PO-02: Best months present for ${destId}`);
    assert(["Unhurried", "Balanced", "Active"].includes(anchor.pace), `PO-02: Pace valid for ${destId}`);
    assert(
      ["Boutique Stays", "Curated Luxury", "Experiential Retreats"].includes(anchor.comfortTier),
      `PO-02: Comfort tier valid for ${destId}`,
    );
  }

  // Safe fallback
  const defaultAnchor = getTripAnchorForDestination("unknown-custom-place");
  assert(Boolean(defaultAnchor.duration && defaultAnchor.bestMonths), "PO-02: Safe default anchor returned for unknown destination");

  // UI Integration Assertions
  const editorialCardsContent = readFileSync(editorialCardsPath, "utf-8");
  assert(
    editorialCardsContent.includes("getTripAnchorForDestination"),
    "PO-02: EditorialCards imports and calls getTripAnchorForDestination",
  );
  assert(
    editorialCardsContent.includes('data-testid="trip-anchor-badges"'),
    "PO-02: EditorialCards renders trip-anchor-badges test identifier",
  );
  assert(
    editorialCardsContent.includes("anchor.duration") &&
      editorialCardsContent.includes("anchor.bestMonths") &&
      editorialCardsContent.includes("anchor.pace") &&
      editorialCardsContent.includes("anchor.comfortTier"),
    "PO-02: EditorialCards displays all four consultative anchor attributes",
  );

  const itinerarySectionContent = readFileSync(itinerarySectionPath, "utf-8");
  assert(
    itinerarySectionContent.includes('data-testid="destination-trip-anchors"'),
    "PO-02: DestinationItinerarySection renders destination-trip-anchors banner",
  );
}

// =========================================================================
// 3. P-08: Weighted Destination Model Runtime & Recommendation Phases
// =========================================================================
function verifyP08PreferenceTierWeights() {
  assert(
    PREFERENCE_TIER_WEIGHTS.primaryDreamJourney === 0.5,
    "P-08: Primary Dream Journey weight is exactly 0.50 (50%)",
  );
  assert(
    PREFERENCE_TIER_WEIGHTS.secondaryTravelStyles === 0.3,
    "P-08: Secondary Travel Styles weight is exactly 0.30 (30%)",
  );
  assert(
    PREFERENCE_TIER_WEIGHTS.tertiaryMemoryGoals === 0.2,
    "P-08: Tertiary Memory Goals weight is exactly 0.20 (20%)",
  );

  const sum =
    PREFERENCE_TIER_WEIGHTS.primaryDreamJourney +
    PREFERENCE_TIER_WEIGHTS.secondaryTravelStyles +
    PREFERENCE_TIER_WEIGHTS.tertiaryMemoryGoals;
  assert(Math.abs(sum - 1.0) < 1e-9, "P-08: Preference tier weights sum exactly to 1.00 (100%)");

  // Verify calculation helper determinism
  const test1 = calculatePreferenceTierScore(100, 100, 100);
  assert(test1 === 100, "P-08: 100 on all tiers yields 100");

  const test2 = calculatePreferenceTierScore(80, 60, 40);
  // 80*0.5 + 60*0.3 + 40*0.2 = 40 + 18 + 8 = 66
  assert(test2 === 66, "P-08: Weighted combination 80, 60, 40 yields exactly 66");

  const test3 = calculatePreferenceTierScore(90, 50, 70);
  // 90*0.5 + 50*0.3 + 70*0.2 = 45 + 15 + 14 = 74
  assert(test3 === 74, "P-08: Weighted combination 90, 50, 70 yields exactly 74");
}

// =========================================================================
// 4. V-03: Companion Destinations Editorial Graph
// =========================================================================
function verifyV03CompanionDestinations() {
  const root = process.cwd();
  const companionModulePath = join(root, "lib", "journey-director", "catalogue", "companionDestinations.ts");
  assert(existsSync(companionModulePath), "V-03: companionDestinations.ts exists");

  const graphEntries = Object.entries(COMPANION_DESTINATIONS_GRAPH);
  assert(graphEntries.length >= 10, "V-03: At least 10 destinations configured with companion pairings");

  for (const [destId, companions] of graphEntries) {
    assert(
      companions.length >= 2 && companions.length <= 3,
      `V-03: Destination ${destId} has between 2 and 3 companion pairings (found ${companions.length})`,
    );

    for (const companion of companions) {
      assert(Boolean(companion.destinationId), `V-03: Companion in ${destId} has valid destinationId`);
      assert(Boolean(companion.title), `V-03: Companion in ${destId} has title`);
      assert(Boolean(companion.relationship), `V-03: Companion in ${destId} has relationship title`);
      assert(
        companion.rationale.length >= 30,
        `V-03: Companion ${companion.destinationId} for ${destId} has high-trust editorial rationale`,
      );
      assert(
        !companion.rationale.toLowerCase().includes("book now") &&
          !companion.rationale.toLowerCase().includes("package discount"),
        `V-03: Companion rationale maintains consultative luxury tone without hard-sell CTA`,
      );
    }
  }

  // Lookup helper check
  const hpCompanions = getCompanionDestinations("himachal-pradesh");
  assert(hpCompanions.length >= 2, "V-03: Himachal Pradesh returns at least 2 companion destinations");
  assert(
    hpCompanions.some((comp) => comp.destinationId === "kashmir"),
    "V-03: Himachal Pradesh pairs with Kashmir",
  );

  const fallback = getCompanionDestinations("unknown-dest");
  assert(fallback.length >= 2, "V-03: Fallback companions returned for uncatalogued destination");

  // Verify UI integration in DestinationItinerarySection
  const itinerarySectionPath = join(root, "components", "destinations", "DestinationItinerarySection.tsx");
  const itinerarySectionContent = readFileSync(itinerarySectionPath, "utf-8");
  assert(
    itinerarySectionContent.includes('data-testid="destination-companion-pairings"'),
    "V-03: DestinationItinerarySection renders destination-companion-pairings section",
  );
}

// =========================================================================
// 5. V-05: Regional Recommendations & Circuit Linking in EnginePossibility
// =========================================================================
function verifyV05RegionalRecommendations() {
  const root = process.cwd();
  const selectPossibilitiesPath = join(root, "lib", "journey-director", "engine", "selectPossibilities.ts");
  const selectContent = readFileSync(selectPossibilitiesPath, "utf-8");

  assert(
    selectContent.includes("getPilotCircuitsForDestination"),
    "V-05: selectPossibilities imports and uses getPilotCircuitsForDestination",
  );
  assert(
    selectContent.includes("getCompanionDestinations"),
    "V-05: selectPossibilities imports and uses getCompanionDestinations",
  );
  assert(
    selectContent.includes("getTripAnchorForDestination"),
    "V-05: selectPossibilities imports and uses getTripAnchorForDestination",
  );
  assert(
    selectContent.includes("tripAnchor"),
    "V-05: createPossibility attaches tripAnchor to EnginePossibility",
  );
  assert(
    selectContent.includes("pilotCircuits"),
    "V-05: createPossibility attaches pilotCircuits to EnginePossibility",
  );
  assert(
    selectContent.includes("companionDestinations"),
    "V-05: createPossibility attaches companionDestinations to EnginePossibility",
  );

  // Runtime test with real engine execution on governed catalogue
  const executionTimestamp = "2026-08-02T00:00:00.000Z";
  const context = {
    knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
    operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
    generatedAt: executionTimestamp,
    evaluationDate: executionTimestamp.slice(0, 10),
  };

  const passportInput: JourneyPassportSnapshot = {
    name: "Dr. Ananya Roy",
    companion: "Couple",
    dreamJourney: "Mountain Retreat",
    travelStyles: ["Nature", "Photography"],
    timing: "I’m Flexible",
    startDate: "",
    endDate: "",
    preferredDestinations: [
      { geoPlaceId: "himachal-pradesh", canonicalName: "Himachal Pradesh", placeType: "state" },
    ],
    getawayDescription: "A tranquil mountain sanctuary with cedar walks and riverfront views.",
    completedAt: executionTimestamp,
    source: "journey-passport",
  };

  const engineResult = generateJourneyRecommendations(passportInput, release1JourneyCandidates, context);
  assert(engineResult.possibilities.length >= 1, "V-05: Engine returned qualified possibilities");

  const hpPossibility = engineResult.possibilities.find(
    (possibility) => possibility.candidateId === "himachal-pradesh",
  );
  assert(Boolean(hpPossibility), "V-05: Himachal Pradesh was selected as a possibility");

  assert(Boolean(hpPossibility!.tripAnchor), "V-05: Possibility has tripAnchor attached");
  assert(
    hpPossibility!.tripAnchor?.duration === "7–10 Days",
    "V-05: Possibility tripAnchor has 7–10 Days duration",
  );
  assert(
    Boolean(hpPossibility!.pilotCircuits && hpPossibility!.pilotCircuits.length > 0),
    "V-05: Possibility has pilotCircuits attached for Himachal Pradesh",
  );
  assert(
    hpPossibility!.pilotCircuits![0].title === "Himalayan Sanctuary & Alpine Valleys",
    "V-05: Correct pilot circuit attached to Himachal Pradesh possibility",
  );
  assert(
    Boolean(hpPossibility!.companionDestinations && hpPossibility!.companionDestinations.length >= 2),
    "V-05: Possibility has companionDestinations attached",
  );

  // Check Southern Peninsular pilot destination
  const keralaPassport: JourneyPassportSnapshot = {
    name: "Vikram & Deepa",
    companion: "Couple",
    dreamJourney: "Mountain Retreat",
    travelStyles: ["Relaxation", "Nature"],
    timing: "I’m Flexible",
    startDate: "",
    endDate: "",
    preferredDestinations: [
      { geoPlaceId: "kerala", canonicalName: "Kerala", placeType: "state" },
    ],
    getawayDescription: "Unhurried backwater drifts and tea estate mornings in the Western Ghats.",
    completedAt: executionTimestamp,
    source: "journey-passport",
  };

  const keralaResult = generateJourneyRecommendations(keralaPassport, release1JourneyCandidates, context);
  const keralaPossibility = keralaResult.possibilities.find(
    (possibility) => possibility.candidateId === "kerala",
  );
  assert(Boolean(keralaPossibility), "V-05: Kerala possibility generated");
  assert(
    Boolean(keralaPossibility!.pilotCircuits && keralaPossibility!.pilotCircuits.length > 0),
    "V-05: Kerala possibility has Southern Peninsular pilot circuits attached",
  );
  assert(
    keralaPossibility!.pilotCircuits![0].title === "Western Ghats, Tea Trails & Emerald Waters",
    "V-05: Correct Western Ghats & Backwaters circuit attached to Kerala",
  );
}

// =========================================================================
// Main Test Runner
// =========================================================================
function runRelease14Milestone2Verification() {
  console.log("\n=== Starting SMV Release 1.4 Milestone 2 Verification Suite ===\n");

  verifyV01PilotCircuits();
  console.log("✓ V-01: Region-level destination intelligence & pilot circuits verified");

  verifyPO02TripAnchors();
  console.log("✓ PO-02: Consultative 'Trip Anchors' on cards (Duration, Season, Pace, Comfort Tier) verified");

  verifyP08PreferenceTierWeights();
  console.log("✓ P-08: Weighted destination model runtime (50% Primary, 30% Secondary, 20% Tertiary) verified");

  verifyV03CompanionDestinations();
  console.log("✓ V-03: Companion destinations editorial graph (2–3 high-trust pairings & rationales) verified");

  verifyV05RegionalRecommendations();
  console.log("✓ V-05: Regional recommendations & circuit linking in EnginePossibility verified");

  console.log(`\n======================================================`);
  console.log(`ALL RELEASE 1.4 MILESTONE 2 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log(`======================================================\n`);
}

runRelease14Milestone2Verification();
