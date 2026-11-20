# Release 1.4 — Destination Intelligence, Trip Anchors & Passport Experience

**Release Theme:** Launch region-level intelligence, indicative Trip Anchors, family comfort signals, free-text enrichment, a modular polished Journey Passport, and site-wide ambient soundscape.  
**Total Backlog Items:** 22  
**Status:** Approved (Baseline)

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 13 | Medium: 8 | Low: 1
- **Source Mix:** Existing Backlog: 18 | New PO / Website Gap Additions: 4

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HP-05** | Atmospheric design | Site-Wide Ambient Soundscape & Mute/Unmute Architecture | New (PO) | High | Approved (Baseline) | World-Class PO Enhancement (Upgrade from R1.3 HP-04) |
| **P-08** | Destination intelligence | Weighted destination model runtime & recommendation phases | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **V-01** | Destination intelligence | Region-level destination intelligence (Pilot Circuits) | Keep | High | Approved (Baseline) | Existing Backlog (Rescoped Pilot) |
| **V-03** | Destination intelligence | Companion Destinations | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **V-05** | Destination intelligence | Regional journey recommendations | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **P-05** | Recommendations / AI | Free-text intent & theme enrichment (absorbs AI-01 & AI-02) | Keep | Medium | Approved (Baseline) | Existing Backlog (Consolidated P-05 + AI-01 + AI-02) |
| **V-06** | Discovery experience | Traveller Inspiration & Seasonal Discovery (absorbs AI-03) | Keep | Medium | Approved (Baseline) | Existing Backlog (Consolidated V-06 + AI-03) |
| **PO-02** | Discovery / Positioning | Consultative 'Trip Anchors' on Destination & Inspiration Cards | New (PO) | High | Approved (Baseline) | World-Class PO Enhancement |
| **PO-03** | Discovery / Positioning | Family & Multi-Generational 'Traveller Needs & Comfort Signals' | New (PO) | High | Approved (Baseline) | World-Class PO Enhancement |
| **PO-01** | Conversion / Trust | Interactive 'Journey Synopsis' Preview & Teaser Mode | New (PO) | High | Approved (Baseline) | World-Class PO Enhancement |
| **TD-01** | Engineering quality | Journey Passport modularization | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **TD-02** | Engineering quality | Automated Passport and OTP regression suite | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **TD-03** | Engineering quality | Centralize mobile number normalization & canonical docs (absorbs TD-06) | Keep | Medium | Approved (Baseline) | Existing Backlog (Consolidated TD-03 + TD-06) |
| **TD-04** | Operations / OTP | Improve OTP provider error classification | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **TD-05** | Engineering quality | Standardize Journey Passport validation rules | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **UX-04** | Passport experience | Cross-step intent synchronization | Keep | High | Approved (Baseline) | Existing Backlog |
| **UX-05** | Passport experience | Pending suggestion chip for carried-forward destinations | Keep | High | Approved (Baseline) | Existing Backlog |
| **UX-06** | Passport experience | Auto-growing getaway-description field | Keep | High | Approved (Baseline) | Existing Backlog |
| **UX-07** | Passport experience | Near-limit character counter | Keep | High | Approved (Baseline) | Existing Backlog |
| **UX-08** | Passport completion | Passport stamp timing vs OTP activation | Keep | High | Approved (Baseline) | Existing Backlog |
| **UX-09** | Passport experience | Companion card selection styling | Keep | Low | Approved (Baseline) | Existing Backlog |
| **P-06** | Design system | Design token reconciliation | Keep | Medium | Approved (Baseline) | Existing Backlog |

---

## 3. Detailed Requirement Specifications

### HP-05 — Site-Wide Ambient Soundscape & Mute/Unmute Architecture
- **Area / Phase:** Atmospheric design | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:**
  1. Migrate audio engine from `HomepageExperience.tsx` into a root-level `<AmbientAudioProvider>` in `web/app/layout.tsx` so the soundscape plays continuously without interrupting across client-side route transitions (Home → Destinations → Stories → Journey Passport → Contact).
  2. Redesign UI control from Play/Pause to Mute/Unmute with a smooth 800ms linear gain cross-fade (from 0.0 to 0.28 ambient volume).
  3. First-Time Discovery Engine: First-time visitors (`smv_soundscape_visited` is null) see a gentle gold ambient breathing pulse on the floating pill + a polite 7-second auto-dismissing luxury tooltip: *"Experience with sound · Tap to unmute"*. It dissolves cleanly on timeout or scroll, never obstructing content.
  4. Cross-Device Responsive Parity:
     - **Desktop/Laptop (1280px+):** Expanded luxury pill at `bottom-6 left-6` with track metadata (*"Sanctuary of Silence"*), volume state, and gold wave bars.
     - **Tablet (768px–1024px):** Expanded luxury pill with touch-optimized min 44×44px tap targets.
     - **Mobile Phone (< 768px):** Adaptive compact medallion at `bottom-5 left-4` with safe-area padding (`env(safe-area-inset-bottom)`) and dynamic collision avoidance against Journey Passport sticky action bars.
  5. Mobile & Tab Lifecycle Safeguards:
     - iOS Safari silent-switch bypass via direct user media touch authorization on the Unmute tap.
     - Page Visibility API (`document.visibilitychange`) auto-ducks audio when the user switches tabs or locks mobile screen, and smoothly fades back in upon return.
     - Persistent user preference stored in `localStorage` (`smv_soundscape_state: 'muted' | 'unmuted'`).
- **Dependencies & Guardrails:** Next.js RootLayout client persistence, web audio cross-fade gain node or HTML5 volume ramp, mobile safe-area insets.
- **Acceptance Criteria:** Audio plays seamlessly across route transitions without restarting; Mute/Unmute operates smoothly across desktop, tablet, and mobile; first-time visitors discover the soundtrack without intrusive popups.
- **PO Notes:** World-Class PO Enhancement (Upgrade from R1.3 HP-04)

### P-08 — Weighted destination model runtime & recommendation phases
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Complete runtime alignment and scoring behavior for the weighted Primary/Secondary/Tertiary Journey and Memory preference model.
- **Dependencies & Guardrails:** Served-destination guardrail and deterministic scoring tests.
- **Acceptance Criteria:** Recommendations deterministically reflect Primary/Secondary/Tertiary preference weights.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### V-01 — Region-level destination intelligence (Pilot Circuits)
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Expand beyond flat state-level destinations into named regions, hill stations, and circuits for top priority pilot geographies.
- **Dependencies & Guardrails:** Define launch pilot regions (e.g., Himachal/Uttarakhand & Kerala/Tamil Nadu) and editorial schema.
- **Acceptance Criteria:** Pilot regions and circuits appear as structured, recommendable entities distinct from broad states.
- **PO Notes:** Existing Backlog (Rescoped Pilot)

### V-03 — Companion Destinations
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Suggest 2–3 complementary destinations that pair naturally with the traveller's primary region interest.
- **Dependencies & Guardrails:** Requires V-01 region relationships and editorial pairing rules.
- **Acceptance Criteria:** Destination pages and Synopsis output surface relevant, high-trust companion pairings.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### V-05 — Regional journey recommendations
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Enable recommendation engine to output region-level journeys rather than only state-level matches.
- **Dependencies & Guardrails:** Depends on P-08 and V-01.
- **Acceptance Criteria:** Travellers receive specific regional circuit recommendations aligned to their mood.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### P-05 — Free-text intent & theme enrichment (absorbs AI-01 & AI-02)
- **Area / Phase:** Recommendations / AI | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Extract structured themes and travel intent signals from 'Describe your ideal getaway' downstream of deterministic scoring.
- **Dependencies & Guardrails:** Must not invent traveller facts or activate unserved destinations.
- **Acceptance Criteria:** Free-text notes enrich recommendation ranking and advisor context with measurable accuracy.
- **PO Notes:** Existing Backlog (Consolidated P-05 + AI-01 + AI-02)

### V-06 — Traveller Inspiration & Seasonal Discovery (absorbs AI-03)
- **Area / Phase:** Discovery experience | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Upgrade Travel Inspiration with seasonal favourites, 'Travel by Month / Window' entry points, and visa lead-time cues.
- **Dependencies & Guardrails:** Requires seasonal metadata per region (V-01).
- **Acceptance Criteria:** Visitors browsing without a fixed destination can filter/explore by travel month and season.
- **PO Notes:** Existing Backlog (Consolidated V-06 + AI-03)

### PO-02 — Consultative 'Trip Anchors' on Destination & Inspiration Cards
- **Area / Phase:** Discovery / Positioning | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Display consultative 'Typical Journey Shape' badges (Indicative Duration, Best Months, Pace, Comfort/Boutique/Luxury tier) without rigid package pricing.
- **Dependencies & Guardrails:** Editorial calibration of indicative ranges per pilot region.
- **Acceptance Criteria:** Every destination and inspiration card shows clear duration, season, and investment-tier anchors.
- **PO Notes:** World-Class PO Enhancement

### PO-03 — Family & Multi-Generational 'Traveller Needs & Comfort Signals'
- **Area / Phase:** Discovery / Positioning | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Introduce structured comfort signals (Senior-Friendly Pace, Toddler/Kid-Easy, Pure Veg/Jain Food Ready, First International Trip, Visa-Easy).
- **Dependencies & Guardrails:** Tag pilot destinations and add optional selector in Passport.
- **Acceptance Criteria:** Families can filter/signal multi-generational and dietary needs in discovery and Passport.
- **PO Notes:** World-Class PO Enhancement

### PO-01 — Interactive 'Journey Synopsis' Preview & Teaser Mode
- **Area / Phase:** Conversion / Trust | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Show a live sample Synopsis on the homepage AND display a partially unlocked Synopsis teaser (mood archetype + top regions) prior to OTP, gating full route & advisor handoff behind OTP.
- **Dependencies & Guardrails:** Preserve BOUND-01 lead-capture guardrail while exposing non-sensitive preview.
- **Acceptance Criteria:** Visitors see tangible Synopsis value before OTP; Passport-to-OTP conversion rate increases.
- **PO Notes:** World-Class PO Enhancement

### TD-01 — Journey Passport modularization
- **Area / Phase:** Engineering quality | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Refactor Passport wizard, contact details, animations, and OTP flow into focused, testable components/hooks prior to UX additions.
- **Dependencies & Guardrails:** Complete before UX-04 through UX-09.
- **Acceptance Criteria:** Passport codebase is modularized with clean separation of state, validation, and OTP hooks.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### TD-02 — Automated Passport and OTP regression suite
- **Area / Phase:** Engineering quality | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Build automated E2E/integration tests covering Passport steps, mobile validation, mocked OTP verify, lead creation, and Journey Director.
- **Dependencies & Guardrails:** Use cost-free OTP test doubles.
- **Acceptance Criteria:** CI runs full Passport & OTP regression suite with zero live SMS charges.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### TD-03 — Centralize mobile number normalization & canonical docs (absorbs TD-06)
- **Area / Phase:** Engineering quality | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Replace duplicated digit-stripping logic with a shared E.164 normalization utility and document canonical storage vs. provider formats.
- **Dependencies & Guardrails:** Audit all phone input and API call sites.
- **Acceptance Criteria:** Single shared phone utility used across UI and server; E.164 standard documented.
- **PO Notes:** Existing Backlog (Consolidated TD-03 + TD-06)

### TD-04 — Improve OTP provider error classification
- **Area / Phase:** Operations / OTP | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Distinguish configuration, runtime, timeout, and provider rejection outcomes for support diagnostics with PII-safe user messages.
- **Dependencies & Guardrails:** Coordinate with TD-08 logging.
- **Acceptance Criteria:** Provider errors map cleanly to distinct diagnostic codes and user-friendly recovery prompts.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### TD-05 — Standardize Journey Passport validation rules
- **Area / Phase:** Engineering quality | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Align traveller-name and field validation rules across initial entry, editable review, and re-entry screens.
- **Dependencies & Guardrails:** Define single shared validation schema.
- **Acceptance Criteria:** Identical validation rules enforced across all Passport entry and edit points.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### UX-04 — Cross-step intent synchronization
- **Area / Phase:** Passport experience | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Reflect earlier Passport selections as reversible contextual suggestions/defaults in later steps without overriding user choices.
- **Dependencies & Guardrails:** Depends on TD-01 modularization.
- **Acceptance Criteria:** Later Passport steps pre-highlight relevant moods/durations based on earlier choices.
- **PO Notes:** Existing Backlog

### UX-05 — Pending suggestion chip for carried-forward destinations
- **Area / Phase:** Passport experience | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Render incoming destination links as interactive pending chips (Keep / Not quite) in Preferred Destinations rather than raw free text.
- **Dependencies & Guardrails:** Verify mobile accessibility and destination resolution.
- **Acceptance Criteria:** Clicking 'Plan a trip here' from a destination page populates a removable pending chip in Passport.
- **PO Notes:** Existing Backlog

### UX-06 — Auto-growing getaway-description field
- **Area / Phase:** Passport experience | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Allow the free-text getaway description textarea to auto-expand smoothly up to ~8 rows before scrolling.
- **Dependencies & Guardrails:** Test mobile keyboard and screen-reader behavior.
- **Acceptance Criteria:** Textarea expands cleanly as user types without layout jump.
- **PO Notes:** Existing Backlog

### UX-07 — Near-limit character counter
- **Area / Phase:** Passport experience | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Display a subtle, accessible character counter only when the free-text field nears its 500-character limit.
- **Dependencies & Guardrails:** Set threshold (e.g., >=400 chars) and ARIA live announcements.
- **Acceptance Criteria:** Counter stays hidden during normal typing and appears cleanly near 500 chars.
- **PO Notes:** Existing Backlog

### UX-08 — Passport stamp timing vs OTP activation
- **Area / Phase:** Passport completion | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Separate emotional Passport completion (visual stamp upon finishing questions) from verified OTP activation while keeping OTP mandatory for lead/full Synopsis.
- **Dependencies & Guardrails:** Align UX with PO-01 teaser mode.
- **Acceptance Criteria:** Travellers experience a rewarding completion moment before OTP verification.
- **PO Notes:** Existing Backlog

### UX-09 — Companion card selection styling
- **Area / Phase:** Passport experience | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Ensure only the actively selected Companion card displays the highlighted border state.
- **Dependencies & Guardrails:** Verify focus vs. selected CSS states.
- **Acceptance Criteria:** Only the chosen companion card shows active highlight styling.
- **PO Notes:** Existing Backlog

### P-06 — Design token reconciliation
- **Area / Phase:** Design system | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Audit and reconcile spacing, typography, and color design tokens across homepage and Passport components.
- **Dependencies & Guardrails:** Identify governing token file.
- **Acceptance Criteria:** Zero conflicting token overrides across core UI components.
- **PO Notes:** Existing Backlog
