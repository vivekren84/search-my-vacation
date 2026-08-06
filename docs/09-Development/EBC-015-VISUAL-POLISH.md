# EBC-015 — Release 1 Visual Polish

## Scope

Presentation-only polish to the homepage hero, identified during Release 1 review. No routes, data flows, or business logic changed.

1. Hero eyebrow ("Your journey, your feeling") readability.
2. Visual uniformity of the five mood-card icons (Relax / Explore / Celebrate / Romance / Escape).
3. Horizontal brand lockup swoosh alignment.

## Technical note — horizontal brand lockup source of truth

The production header logo (`Header.tsx`, via `SiteBrand` with `variant="header"`) renders from the pre-supplied raster assets under `web/public/brand/official/web/` (`web-header-dark-bg-transparent.png`, `web-header-light-bg-transparent.png`), referenced by `siteBrand.assets.headerLightSurface` / `headerDarkSurface` in `web/config/brand.config.ts`.

The vector assets under `web/public/brand/master/smv-logo-horizontal-master.svg` and `web/public/brand/logos/smv-logo-horizontal-*.svg` are **not** the live source. `web/next.config.ts` permanently (301) redirects both to `/brand/official/logo/original-supplied-lockup-espresso-bg.png`:

```ts
{ source: "/brand/logos/:path*", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
{ source: "/brand/master/smv-logo-horizontal-master.svg", destination: "/brand/official/logo/original-supplied-lockup-espresso-bg.png", permanent: true },
```

These SVGs predate the directly-supplied official PNG lockup and are kept only as historical/reference files. Any future brand lockup fix must be made against the `web/public/brand/official/**` PNGs (or a corrected asset supplied by the brand owner) — editing the master/logo SVGs has no effect on the live site.

`web/scripts/brand/export-brand-assets.mjs` (`npm run brand:export`) reads from `web/public/brand/logos/*.svg` and `web/public/brand/icons/*.svg` to generate the sized PNG/WEBP exports under `web/public/brand/exports/`. Those exports are used for social/watermark assets and favicons — not for the header/footer/Journey Passport/Journey Director lockups, which all resolve through `brand.config.ts` to the `official/` PNGs directly.

## EBC-015 findings (horizontal lockup swoosh audit)

Measured pixel centers of the swoosh graphic against the wordmark text, across every usage of the horizontal lockup:

| Usage | Component | Asset variant | Swoosh present | Result |
| --- | --- | --- | --- | --- |
| Header (all pages) | `Header.tsx` → `SiteBrand variant="header"` | `web-header-{dark,light}-bg-transparent.png` | Yes | Was off-center (~24% of wordmark width, left-shifted). Fixed by translating the swoosh graphic in-place. |
| Footer | `PublicFooter.tsx` → `SiteBrand variant="footer"` | `horizon-wordmark-horizontal-light-text-transparent.png` (full lockup) | Yes | Already centered (offset <0.5% of wordmark width — no change needed). |
| Journey Passport | `JourneyPassport.tsx` → `SiteBrand variant="compact"` | `horizon-wordmark-short-*-text-transparent.png` | No | No swoosh in this lockup variant by design. Nothing to align. |
| Journey Director | `JourneyDirectorExperience.tsx` → `SiteBrand variant="compact"` | same as above | No | Same as Journey Passport. |
| Email signature | `lib/journey-leads/email.ts` | `email-signature-logo-transparent.png` | No | Same compact-style lockup, no swoosh. |

The Header fix was a pixel-level horizontal translation of the existing swoosh graphic (same shape, same color, no redraw) applied directly to `web-header-dark-bg-transparent.png` and `web-header-light-bg-transparent.png`, shifting its center from x=500.5 to x=810.5 to match the wordmark's text center (810.5) in the 1384×310 source image. Because `SiteBrand` renders this asset via `next/image` with a locked aspect ratio (`h-auto w-full`), the corrected alignment holds proportionally at every rendered width, including the header's mobile (`clamp(11rem,48vw,14rem)`) and desktop (`clamp(19rem,24vw,21rem)`) sizes.

## Icon uniformity approach (mood cards)

The five mood-card emoji icons (`HeroJourney.tsx`) already shared an identical container (`h-12 w-12` circle) and font-size (`text-xl`); the visible inconsistency was the differing ink weight/size of the emoji glyphs themselves at that font-size, not the container or layout. A per-icon `visualScale` value (applied via CSS `transform: scale()`) was added to compensate. This is a rendering-engine/platform-dependent visual, so the calibration was done by inspection rather than a pixel measurement tool and should be confirmed on the reviewer's own device. No responsive breakpoints touch this block, so the result is identical on mobile and desktop.
