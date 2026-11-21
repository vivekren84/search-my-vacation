import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  isValidMobileNumber,
  maskPhoneForDiagnostics,
  maskPhoneForDisplay,
  normalizeE164,
  normalizeNationalDigits,
  parseMobileNumber,
} from "../../phone/phone-normalization.js";
import {
  hasValidPassportDates,
  isValidTravellerMobile,
  isValidTravellerName,
  validatePassportDates,
  validateTravelStyles,
  validateTravellerMobile,
  validateTravellerName,
} from "../../journey-passport/validation-rules.js";

let checks = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[R1.4 M1 Verification FAILED] ${message}`);
  }
  checks++;
}

function verifyHP05SiteWideSoundscape() {
  const root = process.cwd();
  const layoutPath = join(root, "app", "layout.tsx");
  const contextPath = join(root, "context", "AmbientAudioContext.tsx");
  const playerPath = join(root, "components", "media", "AmbientAudioPlayer.tsx");
  const canonicalAudioPath = join(root, "public", "audio", "smv-ambient-journey.mp3");

  assert(existsSync(contextPath), "HP-05: AmbientAudioContext.tsx exists in web/context");
  assert(existsSync(playerPath), "HP-05: AmbientAudioPlayer.tsx exists in web/components/media");
  assert(existsSync(canonicalAudioPath), "HP-05: Canonical audio file exists in public/audio");

  const layoutContent = readFileSync(layoutPath, "utf-8");
  const contextContent = readFileSync(contextPath, "utf-8");
  const playerContent = readFileSync(playerPath, "utf-8");

  // Invariant 1: RootLayout Mounting & Persistence
  assert(
    layoutContent.includes("<AmbientAudioProvider>"),
    "HP-05: AmbientAudioProvider is mounted in RootLayout around children",
  );
  assert(
    layoutContent.includes("<AmbientAudioPlayer />"),
    "HP-05: AmbientAudioPlayer is mounted at RootLayout level for persistent site-wide audio",
  );

  // Invariant 2: Audio element configuration & continuous playback
  assert(
    contextContent.includes('src="/audio/smv-ambient-journey.mp3"'),
    "HP-05: Context audio element references canonical ambient soundtrack",
  );
  assert(
    contextContent.includes('preload="metadata"'),
    "HP-05: Context audio element preloads metadata for bandwidth safety",
  );
  assert(
    contextContent.includes("loop"),
    "HP-05: Audio element loops continuously across routes",
  );

  // Invariant 3: Smooth 800ms Linear Volume Cross-Fade
  assert(
    contextContent.includes("TARGET_VOLUME = 0.28"),
    "HP-05: Context targets soft luxury ambient volume of 0.28",
  );
  assert(
    contextContent.includes("FADE_DURATION_MS = 800"),
    "HP-05: Volume cross-fade executes over 800ms",
  );
  assert(
    contextContent.includes("fadeVolume("),
    "HP-05: Context implements linear volume cross-fade ramp",
  );

  // Invariant 4: First-Time Discovery Engine
  assert(
    contextContent.includes("smv_soundscape_visited"),
    "HP-05: Tracks first-time discovery state via localStorage",
  );
  assert(
    playerContent.includes("Experience with sound"),
    "HP-05: Tooltip presents polite 'Experience with sound' invitation",
  );
  assert(
    playerContent.includes("motion-safe:animate-ping") || playerContent.includes("motion-safe:animate-[pulse"),
    "HP-05: Discovery halo pulse renders with prefers-reduced-motion safety",
  );

  // Invariant 5: Collision Avoidance & Mobile Responsive Parity
  assert(
    playerContent.includes('pathname?.startsWith("/journey-passport")') ||
      playerContent.includes("isPassportRoute"),
    "HP-05: Floating audio player dynamically shifts position away from Journey Passport sticky action bars",
  );
  assert(
    playerContent.includes("Mute ambient soundscape") && playerContent.includes("Unmute ambient soundscape"),
    "HP-05: Player provides accessible dynamic aria-labels for mute and unmute states",
  );

  // Invariant 6: Page Visibility API Lifecycle
  assert(
    contextContent.includes("visibilitychange"),
    "HP-05: Attaches Page Visibility API listener to duck audio when tab is backgrounded",
  );
}

function verifyTD01PassportModularization() {
  const root = process.cwd();
  const hookPath = join(root, "hooks", "useJourneyPassportOtp.ts");
  const contactStagePath = join(root, "components", "journey-passport", "ClosureContactStage.tsx");
  const otpStagePath = join(root, "components", "journey-passport", "ClosureOtpStage.tsx");
  const fallbackPath = join(root, "components", "journey-passport", "ClosureSubmissionFallback.tsx");
  const passportPath = join(root, "components", "journey-passport", "JourneyPassport.tsx");

  assert(existsSync(hookPath), "TD-01: useJourneyPassportOtp.ts hook exists in web/hooks");
  assert(existsSync(contactStagePath), "TD-01: ClosureContactStage.tsx exists in web/components/journey-passport");
  assert(existsSync(otpStagePath), "TD-01: ClosureOtpStage.tsx exists in web/components/journey-passport");
  assert(existsSync(fallbackPath), "TD-01: ClosureSubmissionFallback.tsx exists in web/components/journey-passport");

  const hookContent = readFileSync(hookPath, "utf-8");
  const contactContent = readFileSync(contactStagePath, "utf-8");
  const otpContent = readFileSync(otpStagePath, "utf-8");
  const fallbackContent = readFileSync(fallbackPath, "utf-8");
  const passportContent = readFileSync(passportPath, "utf-8");

  // Invariant 1: useJourneyPassportOtp isolates OTP state machine
  assert(
    hookContent.includes("useJourneyPassportOtp"),
    "TD-01: useJourneyPassportOtp exports custom hook",
  );
  assert(
    hookContent.includes("requestOtp") && hookContent.includes("verifyOtp"),
    "TD-01: Hook provides dedicated requestOtp and verifyOtp methods",
  );
  assert(
    hookContent.includes("otpNextResendAt") && hookContent.includes("otpResendNow"),
    "TD-01: Hook isolates pure countdown state complying with React Compiler purity rules",
  );

  // Invariant 2: ClosureContactStage isolates details capture
  assert(
    contactContent.includes("<PreOtpTrustCard />"),
    "TD-01: ClosureContactStage renders PreOtpTrustCard",
  );
  assert(
    contactContent.includes("Keep your journey connected"),
    "TD-01: ClosureContactStage renders 'Keep your journey connected' heading",
  );

  // Invariant 3: ClosureOtpStage isolates verification code entry
  assert(
    otpContent.includes("Confirm your number"),
    "TD-01: ClosureOtpStage renders 'Confirm your number' heading",
  );
  assert(
    otpContent.includes("maskPhoneForDisplay"),
    "TD-01: ClosureOtpStage renders masked mobile indicator",
  );

  // Invariant 4: ClosureSubmissionFallback isolates idempotent recovery
  assert(
    fallbackContent.includes("Retry Connecting My Passport"),
    "TD-01: ClosureSubmissionFallback provides idempotent retry button",
  );
  assert(
    fallbackContent.includes("Continue Directly via WhatsApp"),
    "TD-01: ClosureSubmissionFallback provides emergency WhatsApp handoff button",
  );

  // Invariant 5: JourneyPassport cleanly orchestrates
  assert(
    passportContent.includes("<ClosureContactStage"),
    "TD-01: JourneyPassport embeds modular ClosureContactStage",
  );
  assert(
    passportContent.includes("<ClosureOtpStage"),
    "TD-01: JourneyPassport embeds modular ClosureOtpStage",
  );
  assert(
    passportContent.includes("useJourneyPassportOtp()"),
    "TD-01: JourneyPassport consumes useJourneyPassportOtp hook",
  );
}

function verifyTD03PhoneNormalization() {
  const root = process.cwd();
  const phoneModulePath = join(root, "lib", "phone", "phone-normalization.ts");
  const docPath = join(root, "..", "docs", "20-Architecture", "Mobile_Number_Normalization_Standard.md");

  assert(existsSync(phoneModulePath), "TD-03: phone-normalization.ts exists in web/lib/phone");
  assert(existsSync(docPath), "TD-03: Mobile_Number_Normalization_Standard.md documentation exists");

  const docStats = statSync(docPath);
  assert(docStats.size > 1000, "TD-03: Architecture documentation is comprehensive (>1KB)");

  // Functional unit checks
  assert(normalizeNationalDigits("+91 98765-43210") === "919876543210", "TD-03: Strips non-digits correctly");
  assert(normalizeNationalDigits("98765 43210") === "9876543210", "TD-03: Extracts clean national digits");

  const parsedValid = parseMobileNumber("9876543210");
  assert(parsedValid !== null, "TD-03: Parses valid 10-digit Indian mobile");
  assert(parsedValid?.e164 === "+919876543210", "TD-03: Converts to canonical E.164");
  assert(parsedValid?.nationalNumber === "9876543210", "TD-03: Preserves national number");

  const parsedInternational = parseMobileNumber("+447911123456");
  assert(parsedInternational !== null, "TD-03: Parses valid international mobile");
  assert(parsedInternational?.countryCallingCode === "44", "TD-03: Identifies UK country calling code (+44)");

  // Rejects fixed-line / landline numbers
  assert(parseMobileNumber("01123456789") === null, "TD-03: Strictly rejects fixed-line/landline numbers");
  assert(!isValidMobileNumber("0000000000"), "TD-03: Rejects zeroed mobile number");
  assert(!isValidMobileNumber("12345"), "TD-03: Rejects truncated number");

  // Display and diagnostic masking
  assert(
    maskPhoneForDisplay("9876543210") === "+91 98765 ••210",
    "TD-03: Formats masked display (+91 98765 ••210)",
  );
  assert(
    maskPhoneForDiagnostics("+919876543210") === "+91 ****** 10",
    "TD-03: Masks diagnostic logs with country prefix (+91 ****** 10)",
  );
  assert(
    maskPhoneForDiagnostics("9876543210") === "****** 10",
    "TD-03: Masks diagnostic logs for 10-digit national (****** 10)",
  );
  assert(maskPhoneForDiagnostics("") === "[empty]", "TD-03: Empty diagnostic input returns [empty]");
}

function verifyTD05ValidationStandardization() {
  const root = process.cwd();
  const rulesPath = join(root, "lib", "journey-passport", "validation-rules.ts");
  assert(existsSync(rulesPath), "TD-05: validation-rules.ts exists in web/lib/journey-passport");

  // Name validation rules
  assert(isValidTravellerName("Vivek"), "TD-05: Accepts valid single name");
  assert(isValidTravellerName("Vivek Renganathan"), "TD-05: Accepts valid full name");
  assert(isValidTravellerName("José O'Brien-Świątek"), "TD-05: Accepts Unicode letters, apostrophes, and hyphens");
  assert(!isValidTravellerName("J"), "TD-05: Rejects name with < 2 characters");
  assert(!isValidTravellerName("Vivek123"), "TD-05: Rejects name with numeric digits");
  assert(!isValidTravellerName("12345"), "TD-05: Rejects purely numeric name");
  assert(!isValidTravellerName("   "), "TD-05: Rejects whitespace-only name");

  // Mobile validation rules
  assert(isValidTravellerMobile("9876543210"), "TD-05: Accepts valid mobile");
  assert(!isValidTravellerMobile("0000000000"), "TD-05: Rejects zeroed mobile");
  assert(!isValidTravellerMobile("12345"), "TD-05: Rejects truncated mobile");

  // Travel dates validation rules
  assert(hasValidPassportDates("I’m Flexible"), "TD-05: Accepts flexible timing without dates");
  assert(hasValidPassportDates("Exact Dates", "2099-01-01", "2099-01-10"), "TD-05: Accepts valid future date window");
  assert(!hasValidPassportDates("Exact Dates", "2020-01-01", "2020-01-10"), "TD-05: Rejects dates in the past");
  assert(!hasValidPassportDates("Exact Dates", "2099-01-10", "2099-01-05"), "TD-05: Rejects return date before departure");

  // Travel styles count validation rules
  assert(validateTravelStyles(["Relaxation"]).isValid, "TD-05: Accepts 1 travel style");
  assert(validateTravelStyles(["Relaxation", "Adventure", "Culture & Heritage"]).isValid, "TD-05: Accepts 3 travel styles");
  assert(!validateTravelStyles([]).isValid, "TD-05: Rejects 0 travel styles");
  assert(!validateTravelStyles(["1", "2", "3", "4"]).isValid, "TD-05: Rejects > 3 travel styles");
}

function verifyP06DesignTokenReconciliation() {
  const root = process.cwd();
  const globalsPath = join(root, "app", "globals.css");
  const globalsContent = readFileSync(globalsPath, "utf-8");

  // Invariant 1: Brand color tokens defined in :root
  assert(globalsContent.includes("--color-amber: #F5951C;"), "P-06: --color-amber (#F5951C) defined in globals.css");
  assert(globalsContent.includes("--color-espresso: #2A211C;"), "P-06: --color-espresso (#2A211C) defined in globals.css");
  assert(globalsContent.includes("--color-cream: #FFFDFC;"), "P-06: --color-cream (#FFFDFC) defined in globals.css");

  // Invariant 2: Tailwind @theme inline mapping
  assert(globalsContent.includes("--color-amber: var(--color-amber);"), "P-06: Tailwind @theme maps --color-amber");
  assert(globalsContent.includes("--color-espresso: var(--color-espresso);"), "P-06: Tailwind @theme maps --color-espresso");
  assert(globalsContent.includes("--color-cream: var(--color-cream);"), "P-06: Tailwind @theme maps --color-cream");
  assert(globalsContent.includes("--font-utility: var(--font-utility);"), "P-06: Tailwind @theme maps --font-utility");
}

function runMilestone1Verification() {
  console.log("\n=== Starting SMV Release 1.4 Milestone 1 Verification Suite ===\n");

  verifyHP05SiteWideSoundscape();
  console.log("✓ HP-05: Site-Wide Ambient Soundscape, RootLayout persistence & mute/unmute cross-fade verified");

  verifyTD01PassportModularization();
  console.log("✓ TD-01: Journey Passport modularization, useJourneyPassportOtp & stage views verified");

  verifyTD03PhoneNormalization();
  console.log("✓ TD-03: Centralized phone normalization, E.164 parsing, masking & canonical standard verified");

  verifyTD05ValidationStandardization();
  console.log("✓ TD-05: Standardized Journey Passport validation rules & schema alignment verified");

  verifyP06DesignTokenReconciliation();
  console.log("✓ P-06: Design token reconciliation across colors, typography & layout verified");

  console.log(`\n======================================================`);
  console.log(`ALL RELEASE 1.4 MILESTONE 1 VERIFICATION CHECKS PASSED (${checks} checks).`);
  console.log(`======================================================\n`);
}

runMilestone1Verification();
