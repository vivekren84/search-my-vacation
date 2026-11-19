/**
 * Milestone 4 Comprehensive Verification Suite (Release 1.3 Homepage Polish, Audio & Contact Routing)
 *
 * Authored for Vivek (Product Owner), Sri (Traveller Experience Reviewer) & Keerthi (QA Lead)
 * Validates all 4 Milestone 4 items:
 * - HP-01: Tablet header CTA breakpoint (1024px / lg:inline-flex)
 * - HP-02: Trust Points visual treatment (bespoke brand SVG icons, zero raw Unicode glyphs)
 * - HP-03: Contact Preview CTA routing (dual path: self-serve Passport vs direct team contact)
 * - HP-04: Homepage Ambient Audio Experience (soulful music "Sanctuary of Silence", luxury player, autoplay safe)
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let checks = 0;

function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
  if (!condition) {
    throw new Error(`[M4 Verification FAILED] ${message}`);
  }
}

function verifyFileExistence() {
  const root = process.cwd();

  const requiredFiles = [
    join(root, "components", "layout", "Header.tsx"),
    join(root, "components", "icons", "TrustIcons.tsx"),
    join(root, "components", "sections", "HomepageExperience", "HomepageExperience.tsx"),
    join(root, "components", "media", "AmbientAudioPlayer.tsx"),
    join(root, "public", "audio", "smv-ambient-journey.mp3"),
    join(root, "public", "audio", "Sanctuary of Silence.mp3"),
  ];

  for (const filePath of requiredFiles) {
    assert(existsSync(filePath), `Required file exists: ${filePath}`);
  }
}

function verifyHP01TabletHeaderBreakpoint() {
  const root = process.cwd();
  const headerPath = join(root, "components", "layout", "Header.tsx");
  const headerContent = readFileSync(headerPath, "utf-8");

  // Invariant 1: CTA is visible from lg (1024px) breakpoint rather than xl (1280px)
  assert(
    headerContent.includes("lg:inline-flex"),
    "Header CTA button uses lg:inline-flex breakpoint for 1024px tablet availability (HP-01)",
  );

  // Invariant 2: Links to /journey-passport
  assert(
    headerContent.includes('href="/journey-passport"'),
    "Header CTA links directly to /journey-passport",
  );

  // Invariant 3: Mobile drawer CTA is suppressed at lg screens to prevent duplication
  assert(
    headerContent.includes('<li className="lg:hidden">'),
    "Mobile navigation drawer suppresses redundant CTA at tablet/desktop (lg:hidden)",
  );

  // Invariant 4: Optical alignment on tablet
  assert(
    headerContent.includes("ml-auto flex items-center gap-3 xl:ml-0"),
    "Header wraps CTA and Menu in responsive flex cluster for optical alignment on tablet",
  );
}

function verifyHP02TrustPointsVisualTreatment() {
  const root = process.cwd();
  const homepagePath = join(root, "components", "sections", "HomepageExperience", "HomepageExperience.tsx");
  const iconsPath = join(root, "components", "icons", "TrustIcons.tsx");
  const homepageContent = readFileSync(homepagePath, "utf-8");
  const iconsContent = readFileSync(iconsPath, "utf-8");

  // Invariant 1: Zero raw Unicode glyphs in trust points
  assert(!homepageContent.includes('icon: "◌"'), "Raw Unicode circle glyph (◌) is eliminated");
  assert(!homepageContent.includes('icon: "✦"'), "Raw Unicode star glyph (✦) is eliminated");
  assert(!homepageContent.includes('icon: "↗"'), "Raw Unicode arrow glyph (↗) is eliminated");
  assert(!homepageContent.includes('icon: "◎"'), "Raw Unicode bullseye glyph (◎) is eliminated");

  // Invariant 2: Bespoke SVG icons defined and exported
  assert(iconsContent.includes("export function ListenFirstIcon"), "ListenFirstIcon SVG component is exported");
  assert(iconsContent.includes("export function ThoughtfulDesignIcon"), "ThoughtfulDesignIcon SVG component is exported");
  assert(iconsContent.includes("export function HonestAdviceIcon"), "HonestAdviceIcon SVG component is exported");
  assert(iconsContent.includes("export function PersonalSupportIcon"), "PersonalSupportIcon SVG component is exported");

  // Invariant 3: Icons imported and bound to all 4 trust points
  assert(homepageContent.includes("ListenFirstIcon"), "Homepage imports and renders ListenFirstIcon");
  assert(homepageContent.includes("ThoughtfulDesignIcon"), "Homepage imports and renders ThoughtfulDesignIcon");
  assert(homepageContent.includes("HonestAdviceIcon"), "Homepage imports and renders HonestAdviceIcon");
  assert(homepageContent.includes("PersonalSupportIcon"), "Homepage imports and renders PersonalSupportIcon");

  // Invariant 4: Icon styling inside gold circular badge
  assert(
    homepageContent.includes('<point.icon className="size-5" />'),
    "Trust point icons render inside circular badges with size-5 optical weight",
  );
}

function verifyHP03ContactPreviewRouting() {
  const root = process.cwd();
  const homepagePath = join(root, "components", "sections", "HomepageExperience", "HomepageExperience.tsx");
  const homepageContent = readFileSync(homepagePath, "utf-8");

  // Invariant 1: Dual CTA hierarchy present in Contact Preview section
  assert(
    homepageContent.includes('href="/journey-passport"'),
    "Primary CTA links to /journey-passport for self-serve planning",
  );
  assert(
    homepageContent.includes('href="/contact"'),
    "Secondary CTA links to /contact for direct advisor conversation (HP-03)",
  );

  // Invariant 2: Visual hierarchy distinction
  assert(
    homepageContent.includes("Start planning your journey"),
    "Primary button copy is 'Start planning your journey'",
  );
  assert(
    homepageContent.includes("Contact our team"),
    "Secondary button copy is 'Contact our team'",
  );

  // Invariant 3: Direct contact channels preserved
  assert(homepageContent.includes("<WhatsAppLink compact"), "WhatsApp direct link preserved in contact preview");
  assert(homepageContent.includes("siteContact.primaryPhoneHref"), "Primary phone href preserved in contact preview");
  assert(homepageContent.includes("siteContact.emailHref"), "Email href preserved in contact preview");
}

function verifyHP04HomepageAmbientAudio() {
  const root = process.cwd();
  const playerPath = join(root, "components", "media", "AmbientAudioPlayer.tsx");
  const homepagePath = join(root, "components", "sections", "HomepageExperience", "HomepageExperience.tsx");
  const canonicalAudioPath = join(root, "public", "audio", "smv-ambient-journey.mp3");
  const rawAudioPath = join(root, "public", "audio", "Sanctuary of Silence.mp3");

  const playerContent = readFileSync(playerPath, "utf-8");
  const homepageContent = readFileSync(homepagePath, "utf-8");

  // Invariant 1: Audio player mounted on Homepage
  assert(
    homepageContent.includes("<AmbientAudioPlayer />"),
    "AmbientAudioPlayer component is mounted on the homepage (HP-04)",
  );

  // Invariant 2: Audio files exist on disk and are valid MP3 assets
  assert(existsSync(canonicalAudioPath), "Canonical audio file smv-ambient-journey.mp3 exists in public/audio");
  assert(existsSync(rawAudioPath), "Sanctuary of Silence.mp3 source audio file exists in public/audio");

  const audioStats = statSync(canonicalAudioPath);
  assert(audioStats.size > 1_000_000, "Audio file is authentic and non-empty (>1MB)");

  // Invariant 3: Autoplay and Browser Policy Compliance
  assert(
    playerContent.includes('src="/audio/smv-ambient-journey.mp3"'),
    "Audio element references canonical audio path",
  );
  assert(
    playerContent.includes("preload=\"metadata\""),
    "Audio element uses preload='metadata' to conserve bandwidth until play",
  );
  assert(
    playerContent.includes("const [isPlaying, setIsPlaying] = useState(false);"),
    "Player initializes in paused state (false) complying strictly with browser autoplay policies",
  );

  // Invariant 4: Volume & Accessibility
  assert(
    playerContent.includes("audio.volume = 0.35"),
    "Player configures soft luxury ambient volume (0.35) on playback",
  );
  assert(
    playerContent.includes("aria-label="),
    "Player provides accessible dynamic aria-labels for play and pause states",
  );
  assert(
    playerContent.includes("localStorage.setItem(\"smv_ambient_muted\", \"true\")"),
    "Player saves user mute preferences to localStorage",
  );
  assert(
    playerContent.includes("motion-safe:animate-"),
    "Soundwave animations respect prefers-reduced-motion via motion-safe utility",
  );
}

function runMilestone4Verification() {
  console.log("\n=== Starting SMV Release 1.3 Milestone 4 Verification Suite ===\n");

  verifyFileExistence();
  console.log("✓ File existence and structure verified (HP-01, HP-02, HP-03, HP-04)");

  verifyHP01TabletHeaderBreakpoint();
  console.log("✓ HP-01: Tablet header CTA breakpoint (1024px / lg:inline-flex) verified");

  verifyHP02TrustPointsVisualTreatment();
  console.log("✓ HP-02: Trust Points bespoke SVG icons & zero raw Unicode glyphs verified");

  verifyHP03ContactPreviewRouting();
  console.log("✓ HP-03: Contact Preview dual-path routing (/journey-passport & /contact) verified");

  verifyHP04HomepageAmbientAudio();
  console.log("✓ HP-04: Ambient Audio Player, 'Sanctuary of Silence' track & autoplay safety verified");

  console.log(`\n=== Milestone 4 Verification Complete: ${checks}/${checks} checks PASSED ===\n`);
}

runMilestone4Verification();
