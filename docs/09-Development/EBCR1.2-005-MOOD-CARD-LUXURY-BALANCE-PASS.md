# EBC R1.2-005 — Homepage Mood Cards: Luxury Balance Pass

**Owner:** Sophie (design direction) / Rad (implementation) | **Type:** Visual Refinement (final WS1 colour-grading pass, no layout/structure change) | **Status:** Implemented

## What this is (and isn't)

R1.2-004 fixed a real problem: the original all-gold mood card treatment merged visually with the Golden Hour hero, and readability suffered badly over the sun/water reflection behind the Explore card. That fix worked — Round 4 sign-off approved the neutral-glass "Option B" treatment as frozen.

Business review of the shipped result then surfaced a secondary observation: the neutral glass, in solving the merge/readability problem, had also lost some of the warmth and emotional richness the original gold treatment had. This EBC is the answer to that — not a redesign, and not a partial reversion. It's the equivalent of a colour-grading pass a photographer would apply after the composition is already locked: shift the *light*, not the *content*.

## The core technique: hue rotation, not brightness

The R1.2-004 card background is a translucent dark glass tint — two rgba stops in a diagonal `linear-gradient`, at fairly low alpha (.17–.32), sitting over the hero photo. Read closely, those rgba triplets (e.g. `rgba(20,20,22,.24)` → `rgba(13,13,15,.17)`) have R ≈ G ≈ B, with B occasionally the largest channel — a neutral-to-faintly-cool charcoal.

The single highest-leverage, lowest-risk move available was to **rotate that same dark tint's hue toward warm** (R > G > B — a dark champagne/bronze cast instead of a neutral charcoal) while **keeping the alpha values in the same range**. Net luminance and opacity — the two things doing the legibility work over the hero's brightest area — are essentially unchanged. Only the colour cast shifts. This is why the result reads as "the cards suddenly feel warmer" rather than "the cards got lighter" — which is exactly the brief (*"the gradient should be almost invisible; the user should perceive richness rather than notice a gradient"*).

Concretely, per card state:

| State | Before (R1.2-004) | After (R1.2-005) |
|---|---|---|
| Inactive | `rgba(20,20,22,.24)` → `rgba(13,13,15,.17)` | `rgba(34,27,17,.27)` → `rgba(20,15,9,.19)` |
| Inactive (hover) | `rgba(24,24,26,.28)` → `rgba(16,16,18,.20)` | `rgba(38,30,19,.31)` → `rgba(23,17,10,.22)` |
| Active (selected) | `rgba(24,23,21,.32)` → `rgba(16,15,14,.25)` | `rgba(42,33,20,.35)` → `rgba(24,18,11,.27)` |

## A second, separate layer: the highlight

On top of that warm base tint, each card now carries a second background layer — a very low-opacity (`.09`–`.13`) warm-ivory **radial** highlight anchored near the top-left corner, fading to transparent by ~55% of the card. This is the "premium frosted glass catching light" cue: a believable light source hitting one corner of a curved glass surface, rather than a flat wash across the whole panel. Because it's additive and low-opacity, it doesn't touch the base tint's legibility contribution — it's a highlight, not a repaint.

Two small supporting moves round out the glass itself, per the EBC's "Glass Treatment" section:
- `backdrop-blur-xl` → `backdrop-blur-2xl` (a touch richer blur)
- `backdrop-saturate-50` → `backdrop-saturate-[.7]` (lets more of the hero's own warm golden-hour colour bleed through the glass, rather than desaturating it)
- The inset highlight in each card's `box-shadow` moved from pure white (`rgba(255,255,255,…)`) to warm ivory (`rgba(255,248,232,…)`), with a very small opacity bump on the active state's outer glow — "delicate edge lighting" rather than a redesign of the shadow system.

Border colours (`#E3C48C` champagne-gold, at the existing /24, /40, /75 opacities) are untouched — they were already doing the "10% warm gold" accent job the EBC asks for, and didn't need to move.

## Illustration lighting (not redrawing)

Per the EBC's explicit instruction — *do not redraw any illustrations, restore warmth through lighting* — two changes, both in `JourneyMoodIllustration.tsx`, neither touching the artwork files:

1. The soft blurred glow sitting behind each illustration shifts from neutral ivory (`#FFF8E8` at 9% opacity) to a warmer pale-gold ivory (`#FFE7BE` at 12% opacity) — read as a warm horizon glow behind the artwork.
2. The artwork's CSS filter stack gains `sepia-[.12] saturate-[1.08]` alongside the existing `contrast-[1.14] brightness-[1.03]`. At 12%, sepia nudges the image's colour temperature warm without desaturating it into a literal gold/brown wash — the saturate compensates so the result reads as "warmer light," not "muddy" or "washed out." This is the mechanism behind the champagne-mountain/amber-highlight/golden-sunrise-reflection language in the EBC — it's a lighting filter over the existing artwork, not new artwork.

## Readability

The Explore-card-over-sun-glare problem stays solved because the base tint's alpha/luminance didn't move — only its hue did. As a small extra insurance margin (since the overall card now reads slightly warmer/lighter to the eye even though the numbers are similar), the card title's text-shadow opacity was nudged from `.30` to `.34`. This is the only text-legibility change in the pass.

## What did not change

Layout, spacing, card sizing, grid/flex structure, typography, illustration artwork files, interactions (hover/active/focus states remain the same set, just re-coloured), responsive breakpoints, and animation timing are all untouched — this pass only edited class values inside the existing `className` strings in `HeroJourney.tsx` and `JourneyMoodIllustration.tsx`.

## Validation

- ESLint (full repo): pass
- TypeScript (`tsc --noEmit`): pass
- Production build: could not be run to completion in this session (see repository status note in the closure report — a persistent device-bridge mount limitation on `.next`, unrelated to this change); `npm run build` should be run locally or in CI to confirm.
