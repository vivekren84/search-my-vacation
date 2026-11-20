# Search My Vacation (SMV) — Release 1.3 Production Deployment & Sign-Off Report

**Version:** `v1.3.0`  
**Git Commit:** `67a5f04` (`main` branch)  
**Vercel Deployment ID:** `dpl_DnLFaXv84ksYfJkVUEDZE6fA8jac`  
**Production Domains:**  
- `https://searchmyvacation.com`  
- `https://www.searchmyvacation.com`  
**Production Database:** `SearchMyVacation_WebsiteUpgrade` (`jbsefolhlfkplawiuvlu`)  
**Deployment Date:** 2026-11-20  
**Product Owner Sign-Off:** Vivek  
**Release Status:** **SUCCESSFULLY DEPLOYED TO PRODUCTION & VERIFIED**

---

## 1. Executive Summary

Release 1.3 delivers the full scope of user conversion hardening, search ranking intelligence, traveller social proof quality enforcement, bespoke brand iconography, dual-path contact routing, and the signature homepage ambient audio experience across **17 backlog deliverables** (Milestones 1 through 4).

All 4 milestones were developed, validated across 223 automated checks, approved by Product Owner Vivek, merged into `main`, tagged `v1.3.0`, and successfully deployed to live production.

---

## 2. Release Scope & Deliverables Matrix

| Milestone | Code | Deliverable | Production Status |
| :--- | :--- | :--- | :---: |
| **Milestone 1** | `TD-07` | Database-backed OTP rate limits (1-hr cap: 5, 24-hr cap: 10, 15-min lockout) | **LIVE** |
| | `TD-08` | Diagnostic observability & structured telemetry (PII-safe) | **LIVE** |
| | `TD-09` | Endpoint abuse protection & rate limit headers | **LIVE** |
| | `P-07` | Passport Reference Partitioning (`passport_reference`) | **LIVE** |
| | `GAP-02` | Pre-OTP Trust Card ("Option C" 2-4 hr SLA, Privacy reassurance) | **LIVE** |
| | `UX-01` | Idempotent Lead Recovery (10-minute retry window without token exhaustion) | **LIVE** |
| | `UX-03` | Lost Challenge Recovery (`resend_too_soon` returns active challenge ID) | **LIVE** |
| **Milestone 2** | `UX-02` | Client-Side Session Continuity (`localStorage` auto-hydration across reloads) | **LIVE** |
| | `P-03` | Dual WhatsApp Continuation (Emergency floating card & direct itinerary handoff) | **LIVE** |
| | `P-01` | Google Ads Conversion Tracking (Account `138-128-2761`, deduplicated, PII-stripped) | **LIVE** |
| **Milestone 3** | `S-01` | Ambiguous Hub Query Ranking (Bengaluru, Chennai, Mumbai primary cities rank #1) | **LIVE** |
| | `S-02` | Country-Level Search Behavior (India entity ranks at #1 ahead of foreign prefix matches) | **LIVE** |
| | `P-02` | Traveller Stories Quality Gate (Zero empty cards, verified typography quote cards) | **LIVE** |
| | `N-03` | Catalogue Readiness (Amritsar, Darjeeling, Corbett complete DNA & itinerary linking) | **LIVE** |
| **Milestone 4** | `HP-01` | Tablet Header CTA Breakpoint (`lg:inline-flex` at 1024px, drawer on mobile) | **LIVE** |
| | `HP-02` | Trust Points Visual Treatment (Bespoke SVGs replacing raw Unicode glyphs) | **LIVE** |
| | `HP-03` | Dual-Path Contact Routing (Passport vs `/contact` routing with direct channels) | **LIVE** |
| | `HP-04` | Homepage Ambient Audio Experience (*Sanctuary of Silence* floating player) | **LIVE** |

---

## 3. Production Database Migrations (`jbsefolhlfkplawiuvlu`)

The following database migrations were executed and verified against the live production instance:

1. **`20261115120000_geo_search_terms_projection.sql`**:
   - Created `public.geo_search_terms` projection table and statement-level sync triggers.
   - Successfully backfilled all **594,542** geographic places and **123,549** aliases (**718,091 total rows**).
   - Built GIN trigram index `geo_search_terms_search_text_trgm_idx` and executed `ANALYZE`.
2. **`20261119000000_journey_passport_otp_rate_limiting.sql`**:
   - Extended `public.journey_passport_otp_challenges` with `passport_reference` column.
   - Deployed database-level rate limiting (5 per hour, 10 per 24 hours, 15-minute lockout on exhaustion).
   - Updated `consume_journey_passport_otp_token` with 10-minute idempotent recovery window.
3. **`20261119100000_search_geo_places_ranking_refinement.sql`**:
   - Replaced `search_geo_places` function with exact-match scoring tiers (`4.0` canonical / `3.8` alias) and place-type hierarchy (`country` 100 > `city` 80 > `district` 30).
   - Seeded canonical short alias `'India'` (`short`, `en`) for GeoNames country entity `1269750`.
   - Recorded all 3 migrations in `supabase_migrations.schema_migrations`.
   - Re-linked Supabase CLI safely back to Pre-Prod (`pkfdunyeaqdvvklutgon`).

---

## 4. Live Production Verification Evidence

The live production deployment on `https://searchmyvacation.com` was verified end-to-end:

### A. HP-04: Ambient Audio Player
- **Observation:** Floating luxury player pill anchored at bottom-left labeled `"Sanctuary Ambience ▶ Play"`.
- **Playback Interaction:** Clicking the widget transitions to `"Sanctuary of Silence (Playing)"`, smoothly playing the 48 kHz Suno.ai track *Sanctuary of Silence* (`/audio/smv-ambient-journey.mp3`) at 35% ambient volume.
- **Visual Animation:** 4 animated frequency soundwave bars pulse dynamically in SMV brand amber gold (`#F5951C`).
- **Pause Interaction:** Second click pauses audio, rests the soundwave bars, and updates label back to paused state.
- **Status:** **PASS**

### B. HP-01: Tablet Header CTA Breakpoint
- **Tablet (1024px):** Gold CTA `"Plan My Experience"` is directly visible and interactive in the header navigation row.
- **Mobile (< 1024px):** Header CTA cleanly collapses; opens inside the slide-out navigation menu drawer.
- **Status:** **PASS**

### C. HP-02: Trust Points Bespoke SVGs
- **Observation:** In the section *"A journey begins with being understood"*, all 4 cards render bespoke vector brand icons inside gold circular badges:
  1. `ListenFirstIcon` (Acoustic resonance wave)
  2. `ThoughtfulDesignIcon` (4-point navigation compass)
  3. `HonestAdviceIcon` (Integrity shield checkmark)
  4. `PersonalSupportIcon` (Designer connection badge)
- **Quality Gate:** Zero raw Unicode characters (`◌`, `✦`, `↗`, `◎`) found.
- **Status:** **PASS**

### D. HP-03: Dual-Path Contact Routing
- **Observation:** Section *"When you are ready, we are here."* renders both primary and secondary pathways side-by-side:
  1. `"Start planning your journey →"` (routes to `/journey-passport`)
  2. `"Contact our team →"` (routes to `/contact`)
- **Direct Channels:** Direct links for WhatsApp (`wa.me`), Phone (`tel:+918925838541`), and Email (`bookings@searchmyvacation.com`) verified active.
- **Contact Route:** Navigating to `https://searchmyvacation.com/contact` loads with `HTTP 200 OK`, rendering callback form and studio hours.
- **Status:** **PASS**

### E. S-01 / S-02: Live Destination Search Autocomplete
- **Query "india":** Autocomplete returns **Rank #1: India (Republic of India)** with disambiguation badge `Country, India`. Foreign prefix matches (Indianapolis, Indiana) are demoted.
- **Query "bangalore":** Autocomplete returns **Rank #1: Bengaluru** with disambiguation badge `City, Bangalore Urban, Karnataka`. Administrative sub-districts and peripheral regions are demoted.
- **Status:** **PASS**

---

## 5. Deployment Metadata & Runbook Records

- **Release Trunk:** `release/r1.3`
- **Target Branch:** `main` (fast-forward merged, commit `67a5f04`)
- **Release Tag:** `v1.3.0`
- **Vercel Build Target:** `production` (`dpl_DnLFaXv84ksYfJkVUEDZE6fA8jac`)
- **Promotion Target:** `search-my-vacation.vercel.app`, `searchmyvacation.com`, `www.searchmyvacation.com`
- **Automated Regression Baseline:** 223 / 223 checks passing across all milestone suites
- **TypeScript & ESLint:** 0 errors, 0 warnings

---

## 6. Sign-Off & Release Closure

With all 17 backlog items delivered, verified on both Pre-Prod and Production, and smoke tested on the live domain, **Search My Vacation Release 1.3 is formally complete and closed.**
