# EBCR1.2-004 — Sophie Visual Treatment Exploration Addendum

**Title:** Homepage Mood Card Contrast & Glassmorphism Design Refinement
**Owner:** Sophie — UX/UI / Frontend Design
**Parent EBC:** R1.2-004 — Implement Homepage Mood Card Experience Refinement (Workstream 1, `docs/10-Backlog/RELEASE-1.2.md` §6.1)
**Status:** Round 4 delivered (Option B container approved and frozen; illustrations refined) — pending live visual review of the illustration pass before final sign-off. **No default behaviour has changed.**

---

## 1. Delivery approach taken

Per the EBC's Preferred option, all three treatments were implemented directly in `web/components/sections/HeroJourney/HeroJourney.tsx` as a code-level `CARD_TREATMENTS` map, selectable at runtime for review, with the shipped/default treatment reproduced byte-for-byte as the `default` key. A visitor loading the homepage with no query string sees **exactly** the pre-addendum styling — nothing about the shipped experience changed.

Two review mechanisms were added, both gated behind an explicit query parameter read client-side after mount (so they cannot affect server rendering, static generation, or any normal visitor):

- `?moodTreatment=A` / `=B` / `=C` — loads the homepage with a single treatment applied, for direct link-sharing or screenshots.
- `?moodReview=1` — shows a small floating switcher panel (Default / A / B / C) in the top-right of the hero so all four can be flipped through live, including while positioned over the sun/water reflection area, without reloading the page.

This mechanism (and the `CARD_TREATMENTS` map itself) is scaffolding for this review only — once a treatment is approved, Rad should fold the winning treatment's classes directly into the card's `className` as the new single implementation and delete the `default`/other options, the switcher panel, and the review `useEffect`.

## 2. Option A — Ultra-Light Frosted Glass

- `backdrop-blur-2xl` (40px) + `backdrop-saturate-100`, fill `rgba(255,248,232,.05→.02)`, border `#FFF8E8/18`, restrained shadow.
- Active: fill lifts slightly to `.11→.04`, border shifts to champagne `#E3C48C/70`, a soft champagne glow ring replaces the default's heavier glow.
- Title/description get a strengthened single drop-shadow (`rgba(10,6,4,.55)` / `.45`) since the fill itself provides almost no contrast floor — legibility here depends almost entirely on the blur plus text shadow.

**Advantages:** Strongest blur of the three, so it softens busy image detail (the sun/reflection) directly behind the text most effectively without darkening or tinting the photo underneath. Best matches "hero photography remains clearly visible" and the "Golden Hour → Mood Illustrations → Mood Card Content" hierarchy the EBC describes, since the card barely asserts itself as an object.
**Trade-offs:** With almost no fill, legibility is carried entirely by blur + text-shadow. If a card sits directly over the brightest point of the sun disc, blur softens the *pattern* behind the text but the underlying luminance is still high — this is the treatment most dependent on the live Sun Reflection Test to confirm it holds up in that worst case.

## 3. Option B — Neutral Smoke Glass

- `backdrop-blur-md` (12px) + `backdrop-saturate-50` (desaturates the image behind the card), fill a neutral charcoal `rgba(24,24,26,.34→.26)`, champagne border accent `#E3C48C/22`.
- Active: fill deepens modestly to `.40→.34`, border strengthens to `#E3C48C/70` with a matching glow.
- Title/description keep the default's original (lighter) drop-shadow — the dark neutral fill already supplies a contrast floor on its own.

**Advantages:** Most reliable pass of the mandatory Sun Reflection Test — a dark neutral fill sitting against bright amber/white highlights guarantees legibility regardless of exactly which part of the photo is behind the card, and desaturating the backdrop further prevents the sun's colour from bleeding through as glare. Doesn't introduce a new hue family (still reads warm-neutral, not blue/green).
**Trade-offs:** Of the three, this sits closest to the "heavy opaque rectangle" failure mode the EBC explicitly warns against, even though 26–40% alpha is still meaningfully transparent. It's the treatment most likely to read as "a dark card floating on the hero" rather than "glass" if the desaturated fill is judged too assertive against the review panel's designer/first-time-traveller/repeat-traveller framework.

## 4. Option C — Border-First Glass

- `backdrop-blur-[6px]` + `backdrop-saturate-100`, fill barely present (`rgba(255,248,232,.035→.015)`), thin ivory border `#EADFC4/32`, slightly stronger ambient shadow (`0_14px_28px`) to imply depth without fill.
- Active: border brightens to champagne `#E3C48C/90` plus a `ring-2 ring-[#E3C48C]/30` for a distinctly stronger edge — deliberately using outline emphasis rather than more opaque fill for the selected state, per the EBC's Selected State guidance.
- Title/description use the same strengthened drop-shadow as Option A, for the same reason (minimal fill).

**Advantages:** Preserves the most hero-image visibility of the three, as the EBC predicts — the card reads almost entirely as an outline + shadow, which is the most "restrained" of the three and leans hardest into "the card container should support the content, not become the dominant visual object."
**Trade-offs:** Blur is the shallowest of the three (6px, chosen "primarily for text legibility" per the EBC's brief for this option), so it does the least to disrupt a bright, busy region directly behind the text. Combined with near-zero fill, this is the option most likely to need the illustration/typography contrast fallback the EBC allows ("if minor illustration contrast adjustments are necessary... keep extremely restrained") if it's placed over the brightest part of the reflection.

## 5. Sophie's recommendation

**Primary recommendation: Option A (Ultra-Light Frosted Glass).** It best satisfies the EBC's stated hierarchy (hero → illustration → content) and "premium, restrained, calm" brief, and its blur-first approach to contrast — rather than a tint or a fill — is the most faithful reading of "contrast should come from transparency, neutralisation, blur, border, shadow, and typography contrast... not from changing the hero or introducing a competing palette."

**Recommended fallback: Option B (Neutral Smoke Glass)**, specifically if live testing against the actual `golden-hour.png` shows Option A's near-zero fill can't hold legibility over the brightest point of the sun/reflection even with blur and a strengthened text shadow. Option B trades a small amount of "airiness" for a guaranteed contrast floor and is the safest choice if the mandatory Sun Reflection Test is the deciding factor.

Option C is a strong third choice if the review leans toward maximum photography visibility over legibility margin — worth keeping in the comparison, but I'd expect it to need the most iteration if the sun reflection area proves difficult.

**Important limitation:** this recommendation is based on the CSS values and the described photograph (amber sunset, bright sun, water reflection, dark hills, foreground people), not on a rendered screenshot — I did not have a running dev server or browser session against the live `/images/golden-hour.png` in this pass. The mandatory Sun Reflection Test should be run visually (via `npm run dev` and `?moodReview=1`, or I can drive a browser check if you'd like me to) before this recommendation is finalised.

## 6. Exact token changes (all three options — already implemented, none active by default)

See `web/components/sections/HeroJourney/HeroJourney.tsx`, the `CARD_TREATMENTS` constant. Each entry carries `inactive`, `active`, `titleShadow` and `descClass` Tailwind class strings; the `default` entry is the pre-addendum implementation, reproduced without modification. No hero image, headline, layout, illustration files, mood ordering, routing, or Journey Passport mapping were touched.

---

## How to review

1. `cd web && npm run dev`
2. Visit `http://localhost:3000/?moodReview=1` and use the floating switcher (top-right of the hero) to flip between Default / A / B / C live, including while scrolled/positioned so a card sits over the sun and water-reflection area.
3. Or visit `http://localhost:3000/?moodTreatment=A` (or `B` / `C`) directly for a single-treatment view suitable for a screenshot or shared link.
4. Test at desktop, tablet and mobile widths per the EBC's Responsive Review requirement.

## Acceptance criteria mapping

| Criterion | Status |
|---|---|
| Golden Hour hero remains unchanged | ✅ Not touched |
| Five-card 3+2 layout remains | ✅ Not touched (only fill/border/blur/shadow/text-shadow vary) |
| Hover and selected states remain clear | ✅ Defined per option; selected state uses border/ring/shadow emphasis, not heavy opacity, per the EBC's Selected State guidance |
| No unrelated homepage or functional changes | ✅ Single file touched; Journey Passport mapping, Experiences, Trust Strip, navigation, header untouched |
| Cards do not become heavy opaque rectangles / bright sun area stays legible | ⏳ Pending live Sun Reflection Test — see Section 5 limitation above |
| Mood illustrations remain crisp | ⏳ Pending live visual check — `JourneyMoodIllustration.tsx` was not modified |
| Desktop/tablet/mobile visually balanced | ⏳ Pending live responsive check — card dimensions/breakpoints unchanged from shipped implementation |

## Checks run

- `npx tsc --noEmit` — clean, no errors.
- `npx eslint components/sections/HeroJourney/HeroJourney.tsx` — clean, no errors or warnings (one `react-hooks/set-state-in-effect` finding was resolved using the repo's existing suppression pattern from `components/destinations/DestinationsExperience.tsx`).
- `npm run build` — **not completed.** The device-bridge shell used for this session cannot reliably keep a long-running background process alive across tool calls, so the production build could not be run to completion here. Recommend running `npm run build` locally (or via CI) before this addendum is merged.
- Visual/manual QA (Sun Reflection Test, illustration crispness, responsive balance) — **not yet performed**, see Section 5 and the review instructions above.

## Files changed

- Modified: `web/components/sections/HeroJourney/HeroJourney.tsx` only.
- Not modified: `JourneyMoodIllustration.tsx`, `entry-context.ts`, `RELEASE-1.2.md`, navigation, Trust Strip, Experiences, Journey Passport/Director.

---

## Round 2 — response to product-owner review feedback

**Feedback received:** Round 1 (Options A/B/C) was reviewed on localhost. Verdict: an improvement, but not approved — the cards still visually compete with the hero rather than complementing it, most visibly on the Explore card, which sits directly over the brightest part of the sun/water reflection. Direction given: stop iterating on global opacity; solve for **local contrast** instead. Keep the hero, layout and all previously approved product decisions untouched; keep high transparency; move toward a neutral premium frosted glass (not gold-tinted); let the hero own the golden tones; champagne only as an accent where necessary; the container should "almost disappear."

**Diagnosis:** Options A, B and C were all still *global*-opacity treatments — every one of them applies a single fill/blur/border to the entire card rectangle. Over most of the hero that's fine, but directly over the sun disc and its water reflection, *any* uniform full-card tint is stuck picking one trade-off across the whole card: enough opacity to protect the text over the brightest patch makes the whole card heavier everywhere else; light enough to stay airy everywhere else, and the brightest patch loses legibility. There is no single global-opacity value that is simultaneously right for a 9.5rem-wide card spanning both a bright reflection and calmer sky. That's the wrong lever, exactly as flagged.

### Option D — Local Contrast / Ghost Container (new, replaces the global-opacity approach)

Structural change, not a colour/opacity tweak: the outer card container carries **no fill and no blur at rest** — border-transparent, background-transparent, shadow-none. It is not a visible object until you hover or select it (then a hairline champagne border and a whisper of fill appear — the one place champagne shows up at all). Contrast is delegated to two small, independently-scoped layers instead of one big panel:

1. **Illustration halo** — a soft-edged, neutral white/ivory glow sized to just the illustration (`inset-[8%]` of its box, `rounded-full`, `blur-2xl`). The strong blur on a circular shape feathers its own edge, so there's never a hard rectangle — just a soft pool of neutral light that lifts the artwork off whatever's behind it, without tinting it gold.
2. **Text scrim** — a small neutral warm-dark panel cropped tightly to just the title + description (`-inset-x-2 -inset-y-1.5` around the text block, not the card), using `backdrop-blur-xl` + `backdrop-saturate-50`. This is the piece that actually answers the Explore/sun-reflection problem: because it only has to cover a ~2-line text block instead of the whole card, it can carry much stronger local blur and desaturation than any global treatment could without reading as heavy — it's shaped to the content, not to the card.

Net effect: at a glance the "card" is close to invisible — illustration and text each float on their own minimal support, the hero is visible everywhere else on the card including its full corners and background, and the local text scrim gives Explore's title/description a guaranteed contrast floor exactly where the sun/reflection previously broke legibility. Selected state is still communicated by outline/glow (hairline border + soft shadow), not by making anything more opaque, matching the EBC's original Selected State guidance and this round's "don't make it heavier" instruction.

**This is my recommendation.** Options A, B and C remain in the switcher for comparison (`?moodReview=1` still shows all five: Default, A, B, C, D) since the review mechanism is being kept through this iteration, but I'd treat Option D as the live candidate now, with A/B/C mainly useful as a reference for why the local approach was necessary.

**Explore-specific note:** the diagnosis above is card-shape-agnostic — the fix applies uniformly to all five cards (Option D doesn't special-case Explore), but Explore over the sun reflection is exactly the scenario the text-scrim's local blur/desaturation is designed to hold up under, and it's the one I'd check first in live review.

**Still pending — same limitation as Round 1:** I have not been able to render this against the live `/images/golden-hour.png` in this session (see "Checks run" below — the build also failed in this sandbox for an unrelated environment reason). The claim that "Explore remains perfectly legible even over the brightest part of the sun reflection" needs to be confirmed by you (or Keerthi) via `npm run dev` and `?moodReview=1`, scrolled/positioned so Explore sits over the reflection, before this can move to sign-off.

**Checks run (Round 2):** `npx tsc --noEmit` clean, `npx eslint components/sections/HeroJourney/HeroJourney.tsx` clean. `npm run build` still could not be completed in this session — this time with a specific, reproducible cause: `Error: EPERM: operation not permitted, unlink '.../web/.next/BUILD_ID'`, thrown by the device-bridge mount used to reach the local repo from this session, not by the code change. This is an environment/tooling limitation of this session, not a defect — please run `npm run build` locally (or via CI) before merge.

---

## Round 3 — response to product-owner review feedback

**Feedback received:** Option D was judged technically clever but visually wrong — the illustration and text felt detached, "hanging over the hero" rather than belonging to one composed card. Direction: prefer Option B, which keeps the card as a single interactive unit while giving better contrast against the Golden Hour background. Refine Option B specifically (not a new treatment): increase transparency slightly, increase backdrop blur enough to soften the bright sun reflection behind Explore, keep the tint strictly neutral (not brown/gold), reserve champagne/gold for border and hover/selected accents only, keep the 3+2 layout and all approved product behaviour, and leave A/C/D in the switcher for comparison until sign-off.

**What changed in Option B (`CARD_TREATMENTS.B`), all within the single container panel — no split layers, no structural change to the card:**

| Property | Round 1 (B) | Round 3 (B, refined) |
|---|---|---|
| Fill opacity, inactive | `.34 → .26` | `.24 → .17` (more transparent) |
| Fill opacity, active | `.40 → .34` | `.32 → .25` (more transparent) |
| Backdrop blur | `backdrop-blur-md` (12px) | `backdrop-blur-xl` (24px) — doubled, specifically to soften the sun/reflection behind Explore |
| Backdrop saturation | `backdrop-saturate-50` | unchanged — already neutralising the busy hero detail behind the fill |
| Fill hue | `rgba(24,24,26,…)` — near-neutral with a hair of warmth | `rgba(20,20,22,…)` — pushed to strictly equal-ish R/G/B, no brown/gold warmth in the base tint |
| Champagne usage | border only | unchanged and made explicit in the comment: border + hover/selected accents only, never the fill |

Everything else about Option B — the fact that it's a single panel (not split halo/scrim layers), the border-first accenting on hover/select, the card's footprint and layout — is untouched, which is what should restore the "single composed unit" read the product owner is asking for while still doubling down on blur specifically where Round 1 fell short (Explore over the reflection).

**Still pending:** as with Rounds 1 and 2, I have not been able to render this against the live `/images/golden-hour.png` in this session (see Round 2's Checks run note — `npm run build` fails here on an environment-specific `EPERM`, unrelated to the code). Please confirm via `npm run dev` and `?moodReview=1` (Option B is still reachable directly at `?moodTreatment=B`) that Explore holds up over the brightest part of the reflection with the doubled blur before treating this as ready to sign off. A, C and D remain in the switcher for comparison as requested.

**Checks run (Round 3):** `npx tsc --noEmit` clean, `npx eslint components/sections/HeroJourney/HeroJourney.tsx` clean. `npm run build` not attempted again this round — same environment-level `EPERM` blocker as Round 2 applies; no code-related reason to expect a different result.

---

## Round 4 — response to product-owner sign-off feedback

**Feedback received:** Option B approved as the preferred card treatment — container (background, transparency, layout, typography) is now frozen and must not change further. One remaining note before final sign-off: the illustrations had become slightly too subdued relative to the original implementation. Requested: more illustration contrast and edge definition, illustrations as the card's primary visual focus, a little more visual presence, keep the existing premium illustration style, no card/layout/typography changes, and no gold-fill reintroduction — ivory/champagne highlights only, if any.

**What changed:** only `JourneyMoodIllustration.tsx`, via a new optional `enhanced` prop (defaults to `false`, so nothing changes unless explicitly turned on). `HeroJourney.tsx` now carries an `illustrationEnhanced` flag on each treatment and passes it straight through — it's `true` for Option B only, `false` for `default`/A/C/D, so every other view (including the shipped default) renders the illustration exactly as before.

When `enhanced` is true:

- `contrast-[1.14] brightness-[1.03]` on the artwork itself — sharpens edge definition without touching hue or saturation, so it cannot amplify any gold already present in the illustration art.
- `drop-shadow-[0_3px_10px_rgba(10,6,4,.38)]` — a restrained dark contact shadow that gives the illustration presence/lift against Option B's now-lighter, more transparent card, without adding any fill.
- A small `rounded-full`, `blur-2xl` backlight at `bg-[#FFF8E8]/[0.09]` (9% opacity ivory, not gold) sized to just the illustration (`inset-[10%]` of its box) — a soft neutral glow, not a coloured fill, giving the artwork a touch more visual weight so it reads as the card's primary focus.

No artwork files were touched (per the original EBC's illustration guardrail — assets are never replaced/redesigned), no gold saturation was increased anywhere, and the card container, layout, transparency and typography from the approved Option B are byte-for-byte unchanged.

**Still pending — same limitation as every prior round:** I haven't been able to render this against the live hero photo in this session. Please confirm via `npm run dev` and `?moodTreatment=B` (or the review panel) that the illustrations now read with enough presence and that Explore in particular still holds up, before this goes to final sign-off. Once approved, the next step is a follow-up Rad task to fold Option B + the illustration enhancement into the single shipped implementation and remove the A/C/D/review scaffolding — flagging that now so it's tracked, not doing it yet since sign-off isn't final.

**Checks run (Round 4):** `npx tsc --noEmit` clean, `npx eslint` clean on both changed files. `npm run build` not attempted — same environment-level `EPERM` blocker on this session's device-bridge mount as Rounds 2–3; unrelated to the code.
