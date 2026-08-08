# EBC-022 — Final Brand Alignment (Release 1 Finish)

## Scope

Brand-alignment-only pass bringing the live application in line with the Search My Vacation Brand Identity Manual, Edition Two, and its companion asset package. No functionality, routing, business logic, Journey Director logic, Journey Passport logic, or Supabase/email delivery flow changed. Covers: logo usage/placement/sizing, header/footer, all major pages, typography, colour palette, icons, passport/Journey-Director branding, email branding, favicon, social metadata/OG, manifest icons, and identification (not deletion) of superseded legacy assets.

## Asset swap

Header, OG image, and email signature assets replaced with the approved "rule-orange" variants supplied in the brand asset package. Superseded originals were **retained, not deleted**, moved into `backup-pre-brand-refresh/` subfolders alongside their replacements:

- `web/public/brand/official/web/backup-pre-brand-refresh/` — `web-header-light-bg-transparent.png`, `web-header-dark-bg-transparent.png`, `social-share-og-image-1200x630.png`
- `web/public/brand/official/email/backup-pre-brand-refresh/` — `email-signature-logo-transparent.png`

New assets in place: `web-header-light-bg-transparent-rule-orange.png`, `web-header-dark-bg-transparent-rule-orange.png`, `social-share-og-image-rule-orange.png`, `email-signature-ondark-rule-white.png`, plus the two no-tagline horizontal lockups (`logo-horizontal-black-NO-tagline-transparent.png`, `logo-horizontal-white-NO-tagline-transparent.png`), which landed in `web/public/brand/official/web/` rather than `official/logo/` — confirmed acceptable by product owner; not moved for folder-convention reasons alone before Release 1.

## Typography

Self-hosted `--font-editorial` family added via `next/font/local` in `web/app/layout.tsx`: GFS Baskerville (regular only) + TeX Gyre Pagella (true bold/italic/bold-italic cuts), matching the existing `--font-body`/`--font-utility` token pattern. Font files under `web/public/fonts/editorial/`. Approved serif fallback chain: Georgia, Times New Roman, serif.

## Tagline

Set to the approved exact text: "More than a trip, it's an Experience" (`web/config/brand.config.ts`).

## Colour palette — contrast correction (Amber → Espresso on light surfaces)

Amber (`#F5951C`) measures ~2.3:1 on cream/white — below WCAG AA for both text (4.5:1) and non-text UI (3:1). Corrected semantically, not via blanket replacement: Amber replaced with Espresso (`#2A211C`) for text, eyebrow/kicker labels, and required focus indicators **on light surfaces only**. Amber retained wherever it's decorative (rules, spinner accents, bullet glyphs), a fill paired with Espresso text, or on a genuine dark Espresso surface (still ~9.2:1, passes AA).

| Surface type | Treatment |
| --- | --- |
| Light/cream — text, eyebrows, required focus rings | Espresso `#2A211C` |
| Light/cream — decorative rules, fills paired with Espresso text | Amber `#F5951C` (unchanged) |
| Dark Espresso surfaces — eyebrows, focus rings, accents, CTA fills | Amber `#F5951C` (unchanged) |

Files touched: `app/globals.css`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/experiences/page.tsx`, `app/travel-inspiration/page.tsx`, `components/contact/CallbackRequest.tsx`, `components/destinations/DestinationItineraryModal.module.css`, `components/destinations/DestinationItinerarySection.module.css`, `components/destinations/DestinationsExperience.tsx`, `components/discovery/EditorialCards.tsx` (also fixed a pre-existing bug where the light-surface branch incorrectly used Amber), `components/journey-director/JourneyDirectorExperience.module.css` (added a dark-surface-only override for `.completion`/`.handoff` focus rings, since the shared `.page` catch-all was flipped to Espresso), `components/journey-passport/JourneyChapterProgress.tsx`, `components/journey-passport/JourneyPassport.tsx`, `components/journey-passport/JourneyPassportMoments.tsx`, `components/journey-passport/JourneyPassportNavigation.tsx`, `components/journey-passport/SelectionCard.tsx`, `components/layout/PublicPage.tsx`, `components/sections/HomepageExperience/HomepageExperience.tsx`, `components/sections/TravellerStories/TravellerStories.tsx`, `lib/journey-leads/email.ts`.

Confirmed dark-surface Amber usage left unchanged and correct: `PublicFooter.tsx`, `not-found.tsx`, the "How we design every journey" section of `about/page.tsx`, the dark cards in `HomepageExperience.tsx`, and `EditorialCards.tsx`'s dark branch/`EditorialContinuation`.

## Legacy documentation

`web/docs/SMV-BRAND-IDENTITY-V1.md` (the prior SVG-reconstruction-based brand spec) marked with a deprecation notice; retained for historical reference, superseded by the Brand Identity Manual, Edition Two.

## Hydration warning investigation (Chrome on iPad)

Observed only in Chrome on iPad during local development. Investigation confirmed the mismatched attribute (`__gcrremoteframetoken`) is browser-injected and not emitted by the application. No application code changes required.

Supporting detail: a repo-wide search (source, config, `node_modules`, full git history) found zero occurrences of `__gcrremoteframetoken` / `gcrremoteframetoken` / `remoteframetoken` outside of a local dev server log capturing the browser's own hydration diff. The root `<html>` element in `app/layout.tsx` and the EBC-022 font-loading change (`next/font/local` for `--font-editorial`) are fully static and build-time deterministic — no `typeof window` branching, no `Date.now()`/`Math.random()`, no locale-dependent formatting. Not reproducible in Safari on the same physical device. No `suppressHydrationWarning` added.

## Validation

- `npm run lint` — PASS
- `npx tsc --noEmit` — PASS
- `npm run build` (clean rebuild, `.next` deleted first) — PASS
- Static page generation — PASS (17/17)
- CSS optimization warnings (stale `min-h-[calc(100vh-var(--public-header-height))]` chunk, traced to a corrupted/stale `.next` build artifact with no live source reference) — cleared after clean rebuild
- Desktop/tablet/mobile visual review — completed by product owner, covering header/footer branding, the orange horizon rule, editorial font rendering, heading wrapping, tagline wording, all major pages, the destination itinerary modal, Journey Passport, Journey Director, and focus states on light and dark surfaces

## Status

**READY FOR STAGING**
