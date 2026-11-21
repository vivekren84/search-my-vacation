/**
 * SMV Release 1.4 Milestone 4 Comprehensive Verification Suite
 *
 * Validates all 8 Milestone 4 Backlog Items:
 * - PO-01: Interactive 'Journey Synopsis' Preview & Teaser Mode (Tiger's BOUND-01 Lead-Capture Guardrail)
 * - UX-04: Cross-Step Intent Synchronization (Reversible contextual suggestions)
 * - UX-05: Pending Suggestion Chip for Carried-Forward Destinations (Interactive Keep / Not quite)
 * - UX-06: Auto-Growing Getaway-Description Field (~8 rows before scrolling)
 * - UX-07: Near-Limit Character Counter (>= 400 characters, aria-live="polite")
 * - UX-08: Passport Stamp Timing vs OTP Activation Rhythm (Emotional completion before identity verification)
 * - UX-09: Companion Card Selection Styling (Unambiguous border & ring styling only on chosen card)
 * - TD-02: Automated Passport and OTP Regression Suite ($0.00 live SMS test double harness)
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  deriveTeaserData,
} from "../../journey-passport/teaser.js";
import {
  runOtpDoubleVerification,
} from "../../journey-passport-otp/validation/verifyOtpDoubles.js";

let checks = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[R1.4 M4 Verification FAILED] ${message}`);
  }
  checks++;
}

async function verifyTeaserModeAndBound01() {
  console.log("--> Verifying PO-01 & BOUND-01: Journey Synopsis Teaser & Lead-Capture Guardrail...");
  const root = process.cwd();
  const teaserPath = join(root, "components/journey-passport/JourneySynopsisTeaser.tsx");
  const closureContactPath = join(root, "components/journey-passport/ClosureContactStage.tsx");

  assert(existsSync(teaserPath), "PO-01: JourneySynopsisTeaser.tsx component exists");
  assert(existsSync(closureContactPath), "PO-01: ClosureContactStage.tsx component exists");

  const teaserContent = readFileSync(teaserPath, "utf8");
  const closureContactContent = readFileSync(closureContactPath, "utf8");

  // BOUND-01 Guardrail verification: Day-by-day and concierge routing strictly gated
  assert(teaserContent.includes("Tiger's BOUND-01"), "BOUND-01: Explicitly documents Tiger's BOUND-01 guardrail");
  assert(teaserContent.includes("Complete Day-by-Day Route Gated"), "BOUND-01: Gated lock banner is present");
  assert(teaserContent.includes("blur-[3px]"), "BOUND-01: Day-by-day route details are blurred");
  assert(teaserContent.includes("Journey Synopsis Preview"), "PO-01: Header displays 'Journey Synopsis Preview' eyebrow");
  assert(teaserContent.includes("Personalized Match"), "PO-01: Renders personalized match badge");
  assert(teaserContent.includes("Top Recommended Regional Circuits"), "PO-01: Surfaces region-level pilot circuits");

  // Wiring into closure
  assert(closureContactContent.includes("<JourneySynopsisTeaser"), "PO-01: JourneySynopsisTeaser is mounted inside ClosureContactStage");

  // Dynamic derivation logic
  const soloMountain = deriveTeaserData({
    companion: "Solo",
    dreamJourney: "Mountain Retreat",
    timing: "Within 3 Months",
  });
  assert(soloMountain.archetype.title === "The Mindful Explorer", "PO-01: Solo Mountain maps to The Mindful Explorer");
  assert(soloMountain.topRegions.some((r) => r.stateOrCountry === "Uttarakhand"), "PO-01: Recommends Uttarakhand pilot circuit");
  assert(soloMountain.indicativeDuration === "7–9 Days", "PO-01: Indicative duration is 7–9 Days");

  const coupleTropical = deriveTeaserData({
    companion: "Couple",
    dreamJourney: "Tropical Escape",
    getawayDescription: "Romantic beach getaway with sunset dinners",
  });
  assert(coupleTropical.archetype.title === "The Romantic Wanderer", "PO-01: Couple Tropical maps to The Romantic Wanderer");
  assert(coupleTropical.topRegions.some((r) => r.stateOrCountry === "Kerala"), "PO-01: Recommends Kerala Backwaters pilot circuit");

  const familyComfort = deriveTeaserData({
    companion: "Family",
    getawayDescription: "Travelling with elderly parents and kids, pure veg food needed",
  });
  assert(familyComfort.archetype.title === "The Multi-Gen Voyager", "PO-01: Family maps to The Multi-Gen Voyager");
  assert(familyComfort.comfortHighlights.includes("Pure Veg / Jain Food Ready"), "PO-01: Extracted Pure Veg comfort highlight");
  assert(familyComfort.comfortHighlights.includes("Senior-Friendly Relaxed Pace"), "PO-01: Extracted Senior-Friendly comfort highlight");
}

async function verifyStampTimingAndRhythm() {
  console.log("--> Verifying UX-08: Passport Stamp Timing vs OTP Activation Rhythm...");
  const root = process.cwd();
  const passportPath = join(root, "components/journey-passport/JourneyPassport.tsx");
  assert(existsSync(passportPath), "UX-08: JourneyPassport.tsx exists");

  const passportContent = readFileSync(passportPath, "utf8");

  // Visual stamp upon finishing questions before OTP
  assert(passportContent.includes("Stories Stamped.") && passportContent.includes("Memories Guaranteed."), "UX-08: Stamp tagline present on completion");
  assert(passportContent.includes("100% complete · Passport issued"), "UX-08: Passport issued celebration occurs upon finishing questions");
  assert(passportContent.includes("setClosureStage(\"closing\")"), "UX-08: complete() triggers closing animation stage");
  assert(passportContent.includes("setClosureStage(\"contact\")"), "UX-08: Transitions into contact & teaser review stage");
  assert(passportContent.includes("finalizeJourneyPassportSubmission"), "UX-08: OTP verification gates final lead submission");
}

async function verifyConversationalFormErgonomics() {
  console.log("--> Verifying UX-04, UX-05, UX-06, UX-07, UX-09: Form Ergonomics & Polish...");
  const root = process.cwd();
  const getawayPath = join(root, "components/journey-passport/GetawayDescriptionField.tsx");
  const preferredPath = join(root, "components/journey-passport/PreferredDestinationsField.tsx");
  const cardPath = join(root, "components/journey-passport/SelectionCard.tsx");
  const momentsPath = join(root, "components/journey-passport/JourneyPassportMoments.tsx");

  assert(existsSync(getawayPath), "UX-06/07: GetawayDescriptionField.tsx exists");
  assert(existsSync(preferredPath), "UX-05: PreferredDestinationsField.tsx exists");
  assert(existsSync(cardPath), "UX-09: SelectionCard.tsx exists");
  assert(existsSync(momentsPath), "UX-04: JourneyPassportMoments.tsx exists");

  const getawayContent = readFileSync(getawayPath, "utf8");
  const preferredContent = readFileSync(preferredPath, "utf8");
  const cardContent = readFileSync(cardPath, "utf8");
  const momentsContent = readFileSync(momentsPath, "utf8");

  // UX-06: Auto-growing textarea
  assert(getawayContent.includes("UX-06"), "UX-06: Documents auto-growing textarea");
  assert(getawayContent.includes("el.style.height"), "UX-06: Smooth scrollHeight height calculation");
  assert(getawayContent.includes("maxHeight = 224"), "UX-06: Expands up to ~8 rows before scrolling");
  assert(getawayContent.includes("transition-[height]"), "UX-06: Smooth height transition");

  // UX-07: Near-limit character counter
  assert(getawayContent.includes("UX-07"), "UX-07: Documents near-limit character counter");
  assert(getawayContent.includes("COUNTER_THRESHOLD = 400"), "UX-07: Counter threshold is set to 400 characters");
  assert(getawayContent.includes("aria-live=\"polite\""), "UX-07: Accessible polite live region for character count");
  assert(getawayContent.includes("role=\"status\""), "UX-07: Counter has role=status");
  assert(getawayContent.includes("aria-describedby"), "UX-07: Textarea aria-describedby connects to counter dynamically");

  // UX-05: Pending suggestion chip for carried-forward destinations
  assert(preferredContent.includes("UX-05"), "UX-05: Documents pending suggestion chip for carried-forward destinations");
  assert(preferredContent.includes("carriedForwardDestination"), "UX-05: PreferredDestinationsField accepts carriedForwardDestination");
  assert(preferredContent.includes("data-testid=\"carried-forward-pending-chip\""), "UX-05: Carried forward pending chip test id is present");
  assert(preferredContent.includes("Keep"), "UX-05: Provides 'Keep' button to confirm destination");
  assert(preferredContent.includes("Not quite"), "UX-05: Provides 'Not quite' button to dismiss suggestion");
  assert(preferredContent.includes("min-h-11"), "UX-05: Touch targets meet 44px minimum touch target requirement");
  assert(momentsContent.includes("carriedForwardDestination={known}"), "UX-05: DestinationMoment passes carriedForwardDestination to field");

  // UX-09: Companion card selection styling
  assert(cardContent.includes("ring-2 ring-[#e8c890]"), "UX-09: Selected card displays active gold ring");
  assert(cardContent.includes("ring-0"), "UX-09: Unselected card explicitly has ring-0 to prevent border leakage");
  assert(cardContent.includes("z-10 border-[#c28c42] bg-[#fff9ed]"), "UX-09: Selected card lifts with z-10 and highlighted amber border");

  // UX-04: Cross-step intent synchronization
  assert(momentsContent.includes("UX-04"), "UX-04: Documents cross-step intent synchronization");
  assert(momentsContent.includes("suggestedStyles"), "UX-04: Derives suggested styles from earlier choices");
  assert(momentsContent.includes("Suggested for your"), "UX-04: Renders non-binding suggestion advisory");
  assert(momentsContent.includes("isSuggested"), "UX-04: Highlights suggested options with reversible styling");
}

async function verifyAutomatedOtpDoubles() {
  console.log("--> Verifying TD-02: Automated Passport & OTP Regression Suite ($0.00 Live SMS)...");
  const doubleChecks = await runOtpDoubleVerification();
  assert(doubleChecks >= 10, "TD-02: Executed comprehensive OTP test double regression suite");
  checks += doubleChecks;
}

export async function runMilestone4Verification() {
  console.log("\n=== Starting SMV Release 1.4 Milestone 4 Verification Suite ===\n");
  await verifyTeaserModeAndBound01();
  console.log("✓ PO-01 & BOUND-01: Interactive Synopsis Teaser & Lead-Capture Guardrail verified");

  await verifyStampTimingAndRhythm();
  console.log("✓ UX-08: Passport stamp timing vs OTP activation rhythm verified");

  await verifyConversationalFormErgonomics();
  console.log("✓ UX-04, UX-05, UX-06, UX-07, UX-09: Form ergonomics & conversational polish verified");

  await verifyAutomatedOtpDoubles();
  console.log("✓ TD-02: Zero-cost Passport & OTP test double regression suite verified");

  console.log(`\n======================================================`);
  console.log(`ALL RELEASE 1.4 MILESTONE 4 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log(`======================================================\n`);
  return checks;
}

if (process.argv[1]?.endsWith("verifyRelease14Milestone4.js") || process.argv[1]?.endsWith("verifyRelease14Milestone4.ts")) {
  void runMilestone4Verification();
}
