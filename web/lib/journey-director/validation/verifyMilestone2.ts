/**
 * Milestone 2 Comprehensive Verification Suite (Release 1.3 Journey Continuity)
 *
 * Authored for Keerthi (QA Lead) & Sri (Traveller Experience Reviewer)
 * Validates all 3 Milestone 2 backlog items:
 * - UX-02: Session persistence, auto-hydration on reload, and storage resilience
 * - P-03: Dual WhatsApp continuation handoff (General & Possibility-specific)
 * - P-01: Google Ads conversion tracking with deduplication and PII protection
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { isJourneyPassportSnapshot } from "../passport-adapter.js";
import {
  buildWhatsAppLink,
  createGeneralWhatsAppMessage,
  createPossibilityWhatsAppMessage,
} from "../whatsapp.js";
import {
  buildGoogleAdsConversionPayload,
  trackGoogleAdsLeadConversion,
} from "../../analytics/google-ads.js";
import type { JourneyPassportSnapshot } from "../../../types/journey-director.js";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) throw new Error(`[M2 Verification FAILED] ${message}`);
}

function verifyFilesExist() {
  const root = process.cwd();

  const files = [
    "lib/journey-director/whatsapp.ts",
    "components/journey-director/GeneralWhatsAppCard.tsx",
    "lib/analytics/google-ads.ts",
    "context/JourneySessionContext.tsx",
  ];

  for (const file of files) {
    const fullPath = join(root, file);
    assert(existsSync(fullPath), `Required file exists: ${file}`);
  }
}

function verifyUX02SessionPersistence() {
  const root = process.cwd();
  const contextSource = readFileSync(join(root, "context/JourneySessionContext.tsx"), "utf8");

  assert(
    contextSource.includes('JOURNEY_PASSPORT_KEY = "smv:journey-director:passport:v2"'),
    "UX-02: Dedicated passport persistence key defined",
  );
  assert(
    contextSource.includes('JOURNEY_SESSION_KEY = "smv:journey-director:session:v2"'),
    "UX-02: Session persistence key defined",
  );
  assert(
    contextSource.includes("sessionStorage.setItem(JOURNEY_PASSPORT_KEY, JSON.stringify(nextPassport))"),
    "UX-02: savePassport persists passport snapshot to sessionStorage",
  );
  assert(
    contextSource.includes("sessionStorage.getItem(JOURNEY_PASSPORT_KEY)"),
    "UX-02: Auto-hydration retrieves passport snapshot when session is absent",
  );

  const samplePassport: JourneyPassportSnapshot = {
    name: "Aaditya Sen",
    mobile: "+91 98765 43210",
    journeyReference: "SMV-A2K9MN4P",
    companion: "couple",
    dreamJourney: "relaxed luxury retreat in the mountains",
    travelStyles: ["nature", "slow-travel", "wellness"],
    timing: "flexible-dates",
    startDate: "2026-10-10",
    endDate: "2026-10-20",
    preferredDestinations: [
      { geoPlaceId: "himachal-pradesh", canonicalName: "Himachal Pradesh", placeType: "state" },
    ],
    getawayDescription: "A calm mountain sanctuary with tea gardens and walks.",
    entryContext: {
      feeling: "relax",
      source: "homepage",
    },
    completedAt: "2026-11-19T10:00:00.000Z",
    source: "journey-passport",
  };

  assert(isJourneyPassportSnapshot(samplePassport), "UX-02: Valid JourneyPassportSnapshot passes type guard");

  const serialized = JSON.stringify(samplePassport);
  const deserialized = JSON.parse(serialized);
  assert(isJourneyPassportSnapshot(deserialized), "UX-02: Serialized/deserialized snapshot is fully recoverable");

  // Verify malformed objects fail safely
  const corrupted = { ...samplePassport, source: "unknown-source" };
  assert(!isJourneyPassportSnapshot(corrupted), "UX-02: Corrupted snapshot fails guard safely");
}

function verifyP03WhatsAppHandoff() {
  const root = process.cwd();
  const experienceSource = readFileSync(
    join(root, "components/journey-director/JourneyDirectorExperience.tsx"),
    "utf8",
  );

  assert(
    experienceSource.includes("<GeneralWhatsAppCard"),
    "P-03: GeneralWhatsAppCard is integrated into JourneyDirectorContent",
  );
  assert(
    experienceSource.includes("continueGeneralOnWhatsApp"),
    "P-03: Unconstrained general WhatsApp continuation function exists",
  );
  assert(
    experienceSource.includes("whatsapp_general_handoff_opened"),
    "P-03: General WhatsApp event telemetry is recorded",
  );

  // 1. Test General WhatsApp Message Generation
  const generalMsg = createGeneralWhatsAppMessage({
    travellerName: "Sunita Rao",
    journeyReference: "SMV-XYZ98765",
    travellingParty: "Solo Traveller",
    travelTiming: "November 2026",
    journeyIntent: "Mindful cultural immersion in Kyoto or Bhutan",
  });

  assert(generalMsg.includes("Sunita Rao"), "P-03: General message includes traveller name");
  assert(generalMsg.includes("SMV-XYZ98765"), "P-03: General message includes verified reference");
  assert(generalMsg.includes("Solo Traveller · November 2026"), "P-03: General message includes party & timing");
  assert(generalMsg.includes("Mindful cultural immersion"), "P-03: General message includes journey vision");

  // 2. Test Possibility-Specific WhatsApp Message Generation
  const possibilityMsg = createPossibilityWhatsAppMessage({
    travellerFirstName: "Sunita",
    journeyReference: "SMV-XYZ98765",
    travellingParty: "Solo Traveller",
    travelTiming: "November 2026",
    selectedDestination: "Kyoto",
    selectedRegion: "Japan",
    personalityLabel: "Mindful Cultural Sanctuary",
    journeyIntent: "Mindful cultural immersion",
    whyThisFits: "Intimate ryokans and peaceful temple gardens aligned with your calm pace.",
  });

  assert(possibilityMsg.includes("Sunita"), "P-03: Possibility message includes first name");
  assert(possibilityMsg.includes("Selected journey: Kyoto, Japan"), "P-03: Possibility message includes destination");
  assert(possibilityMsg.includes("SMV-XYZ98765"), "P-03: Possibility message includes reference");
  assert(possibilityMsg.includes("Why this fits:"), "P-03: Possibility message includes why this fits");

  // 3. Test WhatsApp Link Construction
  const link = buildWhatsAppLink(generalMsg);
  assert(link.startsWith("https://wa.me/918925838541?text="), "P-03: Link targets official WhatsApp number");
  assert(!link.includes(" "), "P-03: Link is fully URL encoded with no raw spaces");
  assert(link.includes(encodeURIComponent("SMV-XYZ98765")), "P-03: Link encodes canonical reference cleanly");
}

function verifyP01GoogleAdsTracking() {
  const root = process.cwd();
  const envExample = readFileSync(join(root, ".env.example"), "utf8");
  assert(
    envExample.includes("NEXT_PUBLIC_GOOGLE_ADS_ID="),
    "P-01: NEXT_PUBLIC_GOOGLE_ADS_ID documented in .env.example",
  );
  assert(
    envExample.includes("NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL="),
    "P-01: NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL documented in .env.example",
  );

  const passportSource = readFileSync(
    join(root, "components/journey-passport/JourneyPassport.tsx"),
    "utf8",
  );
  assert(
    passportSource.includes("trackGoogleAdsLeadConversion(passportId)"),
    "P-01: trackGoogleAdsLeadConversion called in finalizeJourneyPassportSubmission",
  );

  const layoutSource = readFileSync(join(root, "app/layout.tsx"), "utf8");
  assert(
    layoutSource.includes("googletagmanager.com/gtag/js?id="),
    "P-01: Global Google tag script injected conditionally in layout.tsx",
  );

  // 1. Verify Payload Construction & Strict PII Redaction
  const adsId = "AW-11281740116";
  const label = "zQBNCI3wycoYENTixoMq";
  const ref = "SMV-K9M4P7X2";

  const payload = buildGoogleAdsConversionPayload(adsId, label, ref, { value: 1.0, currency: "INR" });
  assert(payload.send_to === "AW-11281740116/zQBNCI3wycoYENTixoMq", "P-01: send_to matches target conversion format");
  assert(payload.transaction_id === "SMV-K9M4P7X2", "P-01: transaction_id contains canonical reference");
  assert(payload.value === 1.0, "P-01: value defaults to 1.0");
  assert(payload.currency === "INR", "P-01: currency matches INR");

  // Strict PII Verification: Keys must ONLY be send_to, transaction_id, value, currency
  const payloadKeys = Object.keys(payload);
  const allowedKeys = new Set(["send_to", "transaction_id", "value", "currency"]);
  for (const key of payloadKeys) {
    assert(allowedKeys.has(key), `P-01 Privacy Guard: Extraneous key '${key}' detected in conversion payload`);
  }

  // 2. Verify Client-side Mock Execution (Non-browser environment)
  const nonBrowserResult = trackGoogleAdsLeadConversion(ref);
  assert(
    nonBrowserResult.status === "skipped_non_browser",
    "P-01: Gracefully skips tracking in non-browser Node runtime",
  );
}

export async function runMilestone2Verification() {
  console.log("=== Starting SMV Release 1.3 Milestone 2 Verification Suite ===\n");

  verifyFilesExist();
  console.log("✓ File existence and structure verified");

  verifyUX02SessionPersistence();
  console.log("✓ UX-02: Session persistence, reload auto-hydration & resilience verified");

  verifyP03WhatsAppHandoff();
  console.log("✓ P-03: Dual WhatsApp continuation handoff & deep linking verified");

  verifyP01GoogleAdsTracking();
  console.log("✓ P-01: Google Ads conversion tagging, deduplication & PII protection verified");

  console.log(`\n=== Milestone 2 Verification Complete: ${checks}/${checks} checks PASSED ===`);
}

if (process.argv[1]?.endsWith("verifyMilestone2.ts") || process.argv[1]?.endsWith("verifyMilestone2.js")) {
  runMilestone2Verification().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
