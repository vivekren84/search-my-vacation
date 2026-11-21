/**
 * SMV Release 1.4 Milestone 3 Comprehensive Verification Suite
 *
 * Validates all 4 Milestone 3 Backlog Items:
 * - V-06: Traveller Inspiration & Seasonal Discovery ('Travel by Month / Window' Filter & Visa Cues)
 * - PO-03: Family & Multi-Generational Comfort Signals (Senior-Friendly, Kid-Easy, Pure Veg/Jain Ready, Visa Easy)
 * - P-05: Free-Text Intent & Theme Enrichment (Downstream parsing from getaway description, zero hallucination)
 * - TD-04: OTP Provider Error Classification & Diagnostics (PII-safe diagnostic codes, recovery guidance)
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MONTH_DISCOVERY_CATALOG,
  VISA_LEAD_TIME_CATALOG,
  getMonthDiscovery,
  getDestinationsForMonth,
  getVisaLeadTime,
} from "../../../config/seasonal-discovery.config.js";
import {
  COMFORT_SIGNAL_DEFINITIONS,
  ALL_COMFORT_SIGNALS,
  DESTINATION_COMFORT_SIGNALS,
  getComfortSignalsForDestination,
  getComfortSignalById,
  destinationMatchesComfortSignal,
} from "../../../config/comfort-signals.config.js";
import {
  enrichFreeTextIntent,
} from "../engine/enrichFreeTextIntent.js";
import {
  OTP_DIAGNOSTIC_REGISTRY,
  getOtpDiagnosticDetail,
  classifyOtpOutcome,
  formatPiiSafeDiagnosticLog,
} from "../../journey-passport-otp/diagnostic-codes.js";
import type { JourneyPassportSnapshot } from "../../../types/journey-director.js";
import { RELEASE1_CATALOGUE_METADATA, release1JourneyCandidates } from "../catalogue/index.js";
import { generateJourneyRecommendations } from "../engine/index.js";

let checks = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[R1.4 M3 Verification FAILED] ${message}`);
  }
  checks++;
}

// =========================================================================
// 1. V-06: Traveller Inspiration & Seasonal Discovery ('Travel by Month')
// =========================================================================
function verifyV06SeasonalDiscovery() {
  const root = process.cwd();
  const seasonalConfigPath = join(root, "config", "seasonal-discovery.config.ts");
  const seasonalComponentPath = join(root, "components", "discovery", "SeasonalDiscoverySection.tsx");
  const inspirationPagePath = join(root, "app", "travel-inspiration", "page.tsx");

  assert(existsSync(seasonalConfigPath), "V-06: seasonal-discovery.config.ts exists");
  assert(existsSync(seasonalComponentPath), "V-06: SeasonalDiscoverySection.tsx exists");
  assert(existsSync(inspirationPagePath), "V-06: travel-inspiration/page.tsx exists");

  // Verify 12 Months Catalog Completeness
  assert(MONTH_DISCOVERY_CATALOG.length === 12, "V-06: Catalog contains exactly 12 calendar months");
  const validSeasons = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"];

  for (let m = 1; m <= 12; m++) {
    const monthData = getMonthDiscovery(m);
    assert(Boolean(monthData), `V-06: Month ${m} data exists`);
    assert(monthData!.month === m, `V-06: Month ${m} has correct index`);
    assert(Boolean(monthData!.name), `V-06: Month ${m} has name`);
    assert(validSeasons.includes(monthData!.season), `V-06: Month ${m} has valid season (${monthData!.season})`);
    assert(monthData!.domesticDestinations.length >= 2, `V-06: Month ${m} has at least 2 domestic destinations`);
    assert(monthData!.internationalDestinations.length >= 2, `V-06: Month ${m} has at least 2 international destinations`);
    assert(Boolean(monthData!.themeTitle), `V-06: Month ${m} has themeTitle`);
    assert(Boolean(monthData!.editorialHeadline), `V-06: Month ${m} has editorialHeadline`);
    assert(Boolean(monthData!.editorialHighlight), `V-06: Month ${m} has editorialHighlight`);
  }

  // Lookup helper
  const octDestinations = getDestinationsForMonth(10);
  assert(octDestinations.domestic.includes("rajasthan"), "V-06: October domestic includes Rajasthan");
  assert(octDestinations.international.includes("dubai"), "V-06: October international includes Dubai");

  // Visa Lead-Time Matrix
  const visaEntries = Object.entries(VISA_LEAD_TIME_CATALOG);
  assert(visaEntries.length >= 6, "V-06: At least 6 international destinations have visa lead-time metadata");

  const coreInternational = ["bali", "thailand", "malaysia", "singapore", "dubai", "sri-lanka", "vietnam"];
  for (const destId of coreInternational) {
    const visa = getVisaLeadTime(destId);
    assert(Boolean(visa), `V-06: Visa metadata exists for ${destId}`);
    assert(
      ["Visa-Free", "Visa on Arrival", "Quick eVisa", "Consulate Visa (3–4 Weeks)"].includes(visa!.visaCategory),
      `V-06: Visa category valid for ${destId}`,
    );
    assert(typeof visa!.leadTimeDays === "number" && visa!.leadTimeDays >= 0, `V-06: Lead time days valid for ${destId}`);
    assert(visa!.advisoryNote.length >= 20, `V-06: Visa advisory note comprehensive for ${destId}`);
  }

  // UI Integration Assertions
  const pageContent = readFileSync(inspirationPagePath, "utf-8");
  assert(
    pageContent.includes("<SeasonalDiscoverySection"),
    "V-06: SeasonalDiscoverySection is mounted on Travel Inspiration page",
  );

  const componentContent = readFileSync(seasonalComponentPath, "utf-8");
  assert(
    componentContent.includes('data-testid="seasonal-discovery-section"'),
    "V-06: Component renders seasonal-discovery-section test identifier",
  );
  assert(
    componentContent.includes('data-testid="seasonal-spotlight-panel"'),
    "V-06: Component renders seasonal-spotlight-panel test identifier",
  );
  assert(
    componentContent.includes("setSelectedMonth"),
    "V-06: Component provides interactive month state switching",
  );
}

// =========================================================================
// 2. PO-03: Family & Multi-Generational Comfort Signals
// =========================================================================
function verifyPO03ComfortSignals() {
  const root = process.cwd();
  const comfortConfigPath = join(root, "config", "comfort-signals.config.ts");
  const itinerarySectionPath = join(root, "components", "destinations", "DestinationItinerarySection.tsx");
  const editorialCardsPath = join(root, "components", "discovery", "EditorialCards.tsx");

  assert(existsSync(comfortConfigPath), "PO-03: comfort-signals.config.ts exists");
  assert(existsSync(itinerarySectionPath), "PO-03: DestinationItinerarySection.tsx exists");
  assert(existsSync(editorialCardsPath), "PO-03: EditorialCards.tsx exists");

  // Verify Signal Definitions
  assert(ALL_COMFORT_SIGNALS.length === 5, "PO-03: Exactly 5 core comfort signals defined");

  const expectedSignals = [
    "senior-friendly-pace",
    "kid-friendly",
    "pure-veg-jain-available",
    "first-international-easy",
    "visa-easy",
  ] as const;

  for (const signalId of expectedSignals) {
    const signal = getComfortSignalById(signalId);
    assert(Boolean(signal), `PO-03: Comfort signal ${signalId} exists`);
    assert(Boolean(signal!.label), `PO-03: Signal ${signalId} has human label`);
    assert(Boolean(signal!.shortTag), `PO-03: Signal ${signalId} has short tag`);
    assert(Boolean(signal!.icon), `PO-03: Signal ${signalId} has icon`);
    assert(signal!.description.length >= 20, `PO-03: Signal ${signalId} has descriptive text`);
  }

  // Verify Destination Tagging
  const taggedDestinations = Object.entries(DESTINATION_COMFORT_SIGNALS);
  assert(taggedDestinations.length >= 20, "PO-03: At least 20 destinations tagged with comfort signals");

  // Specific assertions
  assert(
    destinationMatchesComfortSignal("kerala", "senior-friendly-pace"),
    "PO-03: Kerala matches senior-friendly-pace",
  );
  assert(
    destinationMatchesComfortSignal("rajasthan", "pure-veg-jain-available"),
    "PO-03: Rajasthan matches pure-veg-jain-available",
  );
  assert(
    destinationMatchesComfortSignal("singapore", "kid-friendly"),
    "PO-03: Singapore matches kid-friendly",
  );
  assert(
    destinationMatchesComfortSignal("bali", "first-international-easy"),
    "PO-03: Bali matches first-international-easy",
  );
  assert(
    destinationMatchesComfortSignal("thailand", "visa-easy"),
    "PO-03: Thailand matches visa-easy",
  );

  // Helper retrieval
  const keralaSignals = getComfortSignalsForDestination("kerala");
  assert(keralaSignals.length >= 2, "PO-03: Kerala returns at least 2 comfort signal definitions");
  assert(
    keralaSignals.some((s) => s.id === "senior-friendly-pace"),
    "PO-03: Kerala returned senior-friendly-pace definition",
  );

  // Safe fallback
  assert(getComfortSignalsForDestination("unknown-place").length === 0, "PO-03: Unknown place returns empty array");

  // UI Integration Assertions
  const itineraryContent = readFileSync(itinerarySectionPath, "utf-8");
  assert(
    itineraryContent.includes('data-testid="destination-comfort-signals"'),
    "PO-03: DestinationItinerarySection renders destination-comfort-signals container",
  );
  assert(
    itineraryContent.includes("getComfortSignalsForDestination"),
    "PO-03: DestinationItinerarySection imports and calls getComfortSignalsForDestination",
  );

  const editorialCardsContent = readFileSync(editorialCardsPath, "utf-8");
  assert(
    editorialCardsContent.includes('data-testid="card-comfort-signals"'),
    "PO-03: EditorialCards renders card-comfort-signals badges",
  );
}

// =========================================================================
// 3. P-05: Free-Text Intent & Theme Enrichment
// =========================================================================
function verifyP05FreeTextEnrichment() {
  const root = process.cwd();
  const enrichModulePath = join(root, "lib", "journey-director", "engine", "enrichFreeTextIntent.ts");
  assert(existsSync(enrichModulePath), "P-05: enrichFreeTextIntent.ts exists in engine directory");

  // Test 1: Empty input handling
  const emptyResult = enrichFreeTextIntent("");
  assert(!emptyResult.hasEnrichment, "P-05: Empty string produces hasEnrichment: false");
  assert(emptyResult.signals.length === 0, "P-05: Empty string produces zero signals");

  // Test 2: Nuanced stay and dietary extraction
  const sample1 = "We want an unhurried holiday in a private pool villa with pure veg food and quiet mornings.";
  const res1 = enrichFreeTextIntent(sample1);
  assert(res1.hasEnrichment, "P-05: Sample 1 detected enrichment");
  assert(res1.signals.some((s) => s.tag === "private-pool"), "P-05: Detected private-pool signal");
  assert(res1.signals.some((s) => s.tag === "pure-veg"), "P-05: Detected pure-veg dietary signal");
  assert(res1.signals.some((s) => s.tag === "unhurried-quiet"), "P-05: Detected unhurried-quiet atmosphere");
  assert(res1.dietaryNotes.length >= 1, "P-05: Dietary notes extracted");
  assert(res1.stayPreferences.length >= 1, "P-05: Stay preferences extracted");
  assert(res1.advisorBrief.includes("Pure Vegetarian Kitchen Preferred"), "P-05: Advisor brief reflects pure veg intent");

  // Test 3: Wildlife and Plantation activities
  const sample2 = "Looking for tiger safaris and walks through tea plantations.";
  const res2 = enrichFreeTextIntent(sample2);
  assert(res2.signals.some((s) => s.tag === "wildlife-safari"), "P-05: Detected wildlife-safari signal");
  assert(res2.signals.some((s) => s.tag === "tea-estate-walks"), "P-05: Detected tea-estate-walks signal");

  // Test 4: Zero Destination Hallucination Guardrail (Tiger boundary)
  // An unserved destination mentioned in text must NOT create unserved signals or activate candidates
  const unservedText = "I want to visit Switzerland, Paris and London.";
  const resUnserved = enrichFreeTextIntent(unservedText);
  assert(
    !resUnserved.signals.some((s) => s.tag === "switzerland" || s.tag === "paris"),
    "P-05: Unserved destinations are never converted into spurious catalogue tags",
  );

  // Test 5: End-to-end integration into selectPossibilities & EnginePossibility
  const executionTimestamp = "2026-08-02T00:00:00.000Z";
  const context = {
    knowledgeBaseVersion: RELEASE1_CATALOGUE_METADATA.catalogueVersion,
    operationalSnapshotId: RELEASE1_CATALOGUE_METADATA.operationalSnapshotId,
    generatedAt: executionTimestamp,
    evaluationDate: executionTimestamp.slice(0, 10),
  };

  const passportWithNotes: JourneyPassportSnapshot = {
    name: "Vikram Mehta",
    companion: "Couple",
    dreamJourney: "Mountain Retreat",
    travelStyles: ["Nature", "Relaxation"],
    timing: "I’m Flexible",
    startDate: "",
    endDate: "",
    preferredDestinations: [
      { geoPlaceId: "himachal-pradesh", canonicalName: "Himachal Pradesh", placeType: "state" },
    ],
    getawayDescription: "A peaceful private pool villa with quiet tea estate walks and pure veg food.",
    completedAt: executionTimestamp,
    source: "journey-passport",
  };

  const engineResult = generateJourneyRecommendations(passportWithNotes, release1JourneyCandidates, context);
  assert(engineResult.possibilities.length >= 1, "P-05: Possibilities generated with free-text notes");

  const possibility = engineResult.possibilities[0];
  assert(Boolean(possibility.enrichedIntent), "P-05: EnginePossibility has enrichedIntent attached");
  assert(
    Boolean(possibility.enrichedIntent?.hasEnrichment),
    "P-05: Possibility enrichedIntent hasEnrichment is true",
  );
  assert(
    possibility.enrichedIntent!.signals.some((s) => s.tag === "pure-veg"),
    "P-05: Possibility enrichedIntent contains pure-veg tag",
  );
  assert(
    Boolean(possibility.comfortSignals && possibility.comfortSignals.length >= 1),
    "P-05: Possibility has comfortSignals attached",
  );
}

// =========================================================================
// 4. TD-04: OTP Provider Error Classification & Diagnostics
// =========================================================================
function verifyTD04OtpErrorClassification() {
  const root = process.cwd();
  const diagnosticModulePath = join(root, "lib", "journey-passport-otp", "diagnostic-codes.ts");
  assert(existsSync(diagnosticModulePath), "TD-04: diagnostic-codes.ts exists in journey-passport-otp");

  const expectedCodes = [
    "CONFIG_ERROR",
    "GATEWAY_TIMEOUT",
    "RATE_LIMITED",
    "CODE_MISMATCH",
    "CODE_EXPIRED",
    "ATTEMPTS_EXHAUSTED",
    "PROVIDER_REJECTED",
    "SESSION_NOT_FOUND",
    "GENERIC_ERROR",
  ] as const;

  for (const code of expectedCodes) {
    const detail = getOtpDiagnosticDetail(code);
    assert(Boolean(detail), `TD-04: Diagnostic code ${code} exists in registry`);
    assert(detail.code === code, `TD-04: Code matches key for ${code}`);
    assert(Boolean(detail.category), `TD-04: Code ${code} has category`);
    assert(typeof detail.httpStatus === "number" && detail.httpStatus >= 400, `TD-04: Code ${code} has HTTP error status`);
    assert(detail.userMessage.length >= 20, `TD-04: Code ${code} has userMessage`);
    assert(detail.recoveryAction.length >= 10, `TD-04: Code ${code} has actionable recoveryAction`);
    assert(typeof detail.isRetryable === "boolean", `TD-04: Code ${code} has isRetryable boolean`);

    // PII safety check: user message must NOT contain phone placeholders
    assert(!detail.userMessage.includes("+91"), `TD-04: User message for ${code} contains zero unmasked phone numbers`);
    assert(!detail.userMessage.includes("SELECT"), `TD-04: User message for ${code} contains zero SQL or DB fragments`);
  }

  // Outcome classifier tests
  assert(classifyOtpOutcome("resend_too_soon").code === "RATE_LIMITED", "TD-04: resend_too_soon -> RATE_LIMITED");
  assert(classifyOtpOutcome("cooldown_lockout").code === "RATE_LIMITED", "TD-04: cooldown_lockout -> RATE_LIMITED");
  assert(classifyOtpOutcome("incorrect").code === "CODE_MISMATCH", "TD-04: incorrect -> CODE_MISMATCH");
  assert(classifyOtpOutcome("expired").code === "CODE_EXPIRED", "TD-04: expired -> CODE_EXPIRED");
  assert(classifyOtpOutcome("exhausted").code === "ATTEMPTS_EXHAUSTED", "TD-04: exhausted -> ATTEMPTS_EXHAUSTED");
  assert(classifyOtpOutcome("not_found").code === "SESSION_NOT_FOUND", "TD-04: not_found -> SESSION_NOT_FOUND");
  assert(classifyOtpOutcome("provider_rejected").code === "PROVIDER_REJECTED", "TD-04: provider_rejected -> PROVIDER_REJECTED");
  assert(classifyOtpOutcome("timeout").code === "GATEWAY_TIMEOUT", "TD-04: timeout -> GATEWAY_TIMEOUT");
  assert(classifyOtpOutcome("otp_unavailable").code === "CONFIG_ERROR", "TD-04: otp_unavailable -> CONFIG_ERROR");

  // HTTP status fallback classification
  assert(classifyOtpOutcome("unknown", 429).code === "RATE_LIMITED", "TD-04: Status 429 -> RATE_LIMITED");
  assert(classifyOtpOutcome("unknown", 504).code === "GATEWAY_TIMEOUT", "TD-04: Status 504 -> GATEWAY_TIMEOUT");
  assert(classifyOtpOutcome("unknown", 503).code === "CONFIG_ERROR", "TD-04: Status 503 -> CONFIG_ERROR");
  assert(classifyOtpOutcome("unknown", 404).code === "SESSION_NOT_FOUND", "TD-04: Status 404 -> SESSION_NOT_FOUND");

  // PII-Safe Logging Formatter
  const logPayload = formatPiiSafeDiagnosticLog("RATE_LIMITED", "+919876543210", { attempt: 3 });
  assert(logPayload.diagnosticCode === "RATE_LIMITED", "TD-04: Log contains diagnosticCode");
  assert(logPayload.category === "rate_limiting", "TD-04: Log contains category");
  assert(logPayload.maskedMobile === "+91 ****** 10", "TD-04: Log contains maskedMobile (+91 ****** 10)");
  assert(
    JSON.stringify(logPayload).indexOf("9876543210") === -1,
    "TD-04: Log payload contains ZERO raw unmasked phone digits",
  );
}

// =========================================================================
// Main Test Runner
// =========================================================================
function runRelease14Milestone3Verification() {
  console.log("\n=== Starting SMV Release 1.4 Milestone 3 Verification Suite ===\n");

  verifyV06SeasonalDiscovery();
  console.log("✓ V-06: Traveller inspiration & seasonal discovery ('Travel by Month' filter) verified");

  verifyPO03ComfortSignals();
  console.log("✓ PO-03: Family & multi-generational comfort signals verified");

  verifyP05FreeTextEnrichment();
  console.log("✓ P-05: Free-text intent & theme enrichment (zero hallucination guardrail) verified");

  verifyTD04OtpErrorClassification();
  console.log("✓ TD-04: OTP provider error classification & PII-safe diagnostics verified");

  console.log(`\n======================================================`);
  console.log(`ALL RELEASE 1.4 MILESTONE 3 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log(`======================================================\n`);
}

runRelease14Milestone3Verification();
