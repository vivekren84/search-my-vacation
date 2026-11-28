# Search My Vacation (SMV) — Mobile UX Polish, Brand Asset & Copy Requirements (Release 1.5.6)

**Document Version:** 1.0  
**Target Release:** R1.5.6 (`feature/release-1.5.6-mobile-ux-brand-polish`)  
**Prerequisite:** Release 1.5.5 (Epics 1–9)  
**Tech Stack:** Next.js / React, Tailwind CSS  

---

## Global Architectural & Brand Guardrails

1. **Strict Brand Vocabulary:** Do **not** use the word *"luxury"* anywhere in UI copy, `aria-label` attributes, `alt` tags, or comments. Use approved SMV terms: *bespoke, curated, high-touch, artisanal, slow-travel, signature*.
2. **Theme Continuity:** Maintain full parity across **Dusk Light** and **Dark Mode** tokens.
3. **Viewport Verification:** All mobile layouts must be verified at `375px` (iPhone SE/Mini) and `390px` (iPhone 14/15) widths with zero horizontal overflow or clipped interactive targets.

---

## EPIC 1: Brand Asset Consistency & Homepage Editorial Copy (`brand.config.ts`, `SiteBrand.tsx`, `HomepageExperience.tsx`)

### 1.1 Unified Orange-Swoosh Logo Across All Dark Surfaces
* **Problem:** Four dark-surface components currently render `logo-horizontal-white-NO-tagline-transparent.png` (white swoosh) instead of the canonical orange-swoosh asset used across `Header.tsx` and the Staff Portal.
* **Technical Specification:**
  1. In `brand.config.ts`, update both `fullDarkSurface` and `compactDarkSurface` to point to:
     `/brand/official/web/web-header-dark-bg-transparent-rule-orange.png`
  2. In `SiteBrand.tsx`, align `full`, `compact`, and `footer` aspect ratios to **`1384 × 310`** (`aspect-[1384/310]`) so no width/height distortion occurs.
  3. Verify consistent orange-swoosh rendering across:
     * `JourneyPassport.tsx` (`variant="compact" surface="dark"`)
     * `JourneyDirectorExperience.tsx` (`variant="compact" surface="dark"`)
     * `PublicFooter.tsx` (`variant="footer" surface="dark"`)
     * `not-found.tsx` (`variant="compact" surface="dark"`)

### 1.2 Homepage Section Editorial Copy Update
* **File:** `HomepageExperience.tsx`
* **Requirement:** Update the Destinations section introductory copy verbatim to:
  > *"Every destination has a different way of making you feel. These are a few places we love to begin with—each one can be shaped around your time, interests and way of travelling."*

---

## EPIC 2: Mobile Header Decluttering & Tap Target Optimization (`Header.tsx`)

### 2.1 Simplified Mobile Top Bar (`< 768px`)
* **Problem:** Inline user/profile badges (e.g., `Sathyakeerthi`), theme toggles, and text `MENU` buttons crowd the mobile header, shrinking the brand logo and clipping the right edge of the menu trigger.
* **Technical Specification:**
  * On mobile viewports (`< 768px`), render **only two top-level header elements** inside a `px-4 h-16` flex container (`justify-between items-center`):
    1. **Left:** Prominent SMV Logo (`SiteBrand` with `min-h-[34px]` / `max-w-[195px]`, never shrunk below readable scale).
    2. **Right:** Clean hamburger menu icon button (`44×44px` minimum accessible tap area, `aria-label="Open navigation menu"`, `shrink-0` so it never clips off-screen).
  * **Relocate Secondary Controls to Mobile Drawer:** Move the **Dusk Light / Dark Mode toggle**, **Sign In / Sign Up buttons** (or authenticated Staff Profile badge + Portal link), and navigation links (`Destinations`, `Traveller Stories`, `Travel Inspiration`, `About Us`, `Contact`, `Plan My Experience`) inside the slide-over mobile navigation drawer.

---

## EPIC 3: Mobile Hero Conversion CTAs (`HomepageExperience.tsx` / `HeroJourney.tsx`)

### 3.1 Above-the-Fold Primary & WhatsApp CTAs on Mobile (`< 768px`)
* **Problem:** On mobile viewports, visitors see the feeling cards first and must scroll down to find a direct planning CTA or WhatsApp contact action.
* **Technical Specification:**
  * On mobile (`< 768px`), render a stacked two-button CTA group directly beneath the hero subheadline (`Every journey begins with a feeling. Tell us yours, and we’ll create an experience around it.`) and immediately above the 5 feeling cards:
    1. **Primary CTA:** Full-width (`w-full`) warm-gold pill button (`#E5A93C` background, `#181410` dark text): **`Start planning your journey →`** (routes directly to `/journey-passport` / Passport Journey).
    2. **Secondary CTA:** Full-width (`w-full`) crisp high-contrast pill button (`bg-white/95 text-[#181410]` with official `#25D366` green WhatsApp icon): **`Chat on WhatsApp`** (opens pre-filled SMV WhatsApp concierge link `https://wa.me/...` in a new tab).
  * **Preserve Feeling Cards on Mobile:** Keep the 5 interactive feeling cards (`Relax`, `Explore`, `Celebrate`, `Romance`, `Memory Makers`) cleanly stacked right below the two CTA buttons so mobile visitors can either convert immediately or select a mood card.
  * **Desktop Preservation (`>= 768px`):** Preserve the Release 1.5.5 Epic 9 hero layout (top nav `PLAN MY EXPERIENCE` CTA + unobstructed family silhouette + 3+2 feeling card grid).

---

## EPIC 4: Mobile Card Proportions & Vertical Rhythm Optimization

### 4.1 Compact Mobile Card Media & Tighter Section Spacing (`< 768px`)
* **Problem:** Tall portrait card images and excessive vertical section margins on mobile force users to scroll mid-card just to see the title and `Discover destination →` CTA.
* **Technical Specification:**
  * **Destination & Experience Cards:** Reduce mobile card image height by **15–20%** (`aspect-[4/3]` or `h-48` max on `< 768px`, while keeping desktop aspect ratios unchanged).
  * Ensure that on a standard `390×844px` mobile viewport, a destination card displays its **image, region tag, destination title, 2-line description, and `Discover destination →` link** simultaneously without requiring mid-card scrolling.
  * **Vertical Section Rhythm:** Tighten mobile section padding from `py-20` to `py-10` / `py-12` and inter-card gaps from `gap-8` to `gap-4` / `gap-5` on `< 768px`.

---

## EPIC 5: Floating Audio Toggle Refinement (`AmbientAudioPlayer.tsx`)

### 5.1 Compact Non-Obstructive Mobile Audio Control
* **Problem:** The wide floating `Sanctuary Ambience Unmute` pill overlaps card text, photography, and bottom CTAs across mobile screens.
* **Technical Specification:**
  * **Mobile (`< 768px`):**
    * Render as a compact **`36×36px` circular icon-only button** (`rounded-full`) showing only the muted/unmuted speaker icon (`aria-label="Toggle sanctuary ambience audio"`), hiding the text label on mobile.
    * Position at **`bottom-4 right-4`** (`fixed bottom-4 right-4 z-30`) with subtle translucent dark styling (`bg-black/45 backdrop-blur-md border border-white/15 text-white/80 hover:opacity-100`) so it stays unobtrusive and never overlaps left-aligned card copy or primary CTAs.
    * Add bottom padding (`pb-16`) to `PublicFooter.tsx` on mobile so the floating button never covers footer links or copyright text when scrolled to the bottom.
  * **Desktop (`>= 768px`):** Keep a compact pill or icon toggle pinned cleanly in the bottom corner (`bottom-5 right-5`) outside main content containers.

---

## Release 1.5.6 Acceptance Criteria

1. All 4 previously mismatched dark-surface screens (`JourneyPassport`, `JourneyDirectorExperience`, `PublicFooter`, `404`) render the orange-swoosh logo with zero aspect-ratio stretching.
2. `HomepageExperience.tsx` displays the updated editorial intro copy verbatim.
3. At `375px` and `390px` viewport widths, the mobile header displays only the SMV logo and a fully visible, unclipped `44×44px` hamburger menu button, with theme toggle and profile/auth actions cleanly accessible inside the mobile drawer.
4. Mobile hero displays **`Start planning your journey →`** and **`Chat on WhatsApp`** clearly above the fold before scrolling, followed immediately by the 5 feeling cards.
5. Destination cards on mobile show the image, title, description, and `Discover destination →` CTA together in one viewport without excessive scrolling.
6. On mobile, the floating audio control renders as a subtle `36×36px` circular icon in the bottom-right corner without overlapping card content, buttons, or footer links.
