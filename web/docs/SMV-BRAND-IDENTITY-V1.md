# Search My Vacation Brand Identity System v1.0

> **OBSOLETE / DEPRECATED (EBC-022, Release 1).** This document describes an SVG vector-reconstruction of the logo (Poppins + Great Vibes wordmark, an 8-layer traceable arch palette) that was never taken to production and directly conflicts with the approved Search My Vacation Brand Identity Manual, Edition Two ("no element of the mark is ever redrawn, recoloured, vectorised, or reconstructed"). The Edition Two Brand Book and its supplied asset package are the current single source of truth for logo, colour, and typography. This file is retained for historical context only and must not be used to guide implementation.

Status: Review candidate (superseded)  
Asset root: `web/public/brand/`  
Motto: **More Than a Trip. It’s an Experience.**

## Identity principles

Search My Vacation uses two principal formats. The icon-only identity is the traveller viewed from behind beneath a tall, layered rainbow arch. It is reserved for small square and circular spaces. The primary horizontal lockup combines that icon with the outlined brand name and the motto. It is the default for communication, documents, and future website placement.

The supplied preferred icon proportions are preserved: the arch is tall rather than flattened, the traveller remains centered, and the hat and backpack form the recognition anchors. The artwork is built from native SVG paths and shapes. It has no raster image, external image, runtime font, or base64 dependency.

### Colour-layer fidelity

The tracked pre-vector source `web/public/logos/smv-logo.png` is the visual reference for arch depth. Every production SVG contains seven separately identified, centred arch paths in this fixed outside-to-inside order: outer magenta, golden orange, bright orange, deep crimson, medium purple, deep aubergine, and the near-black purple inner tunnel. The dark-brown ground is an eighth, separate path and must never be merged into the tunnel.

### Signature swoosh lock

The owner-supplied approved wordmark in `preview/smv-wordmark-swoosh-reference.png` is the sole authority for the orange underline beneath “Vacation.” The canonical swoosh is a native, editable, closed cubic path stored as `signature-swoosh` inside the existing outlined `Vacation` group. It starts beneath the left side of the V, follows a shallow rising curve, retains a substantial mid-stroke weight, and tapers at both ends just beyond the final n. Its vertical fit is constrained to the existing wordmark-to-tagline gap so no typography, spacing, or lockup proportions move.

Every production asset that displays the `Vacation` script must include this exact path in the script’s existing coordinate system. The path inherits the existing script colour: orange-red in the primary logos and warm orange in the approved watermark variants. Do not detach it, straighten it, thicken it, extend it independently, replace it with a stroked line, or publish a wordmark variant without it. Icon-only and favicon assets contain no wordmark and remain unchanged.

No editable passport-stamp production artwork exists under `web/public/brand/`. The supplied passport image is retained in `preview/` as a visual reference only. Do not fabricate a new production stamp by embedding, tracing, or approximating that raster; add the canonical swoosh when an approved editable passport master is supplied.

### Approved traveller construction

The traveller is governed by the owner-approved 98×148 visual-guideline crop, `preview/smv-traveller-reference.png`. It is the sole silhouette and internal-detail authority. The tracked 500×500 original repository logo, `web/public/logos/smv-logo.png`, contains the same mascot at higher resolution and may be used only as a tracing aid for curves, colour boundaries, and lower-leg continuity. Previous generated SVG travellers and the superseded `preview/smv-traveller-authoritative-final.png` must not be used as geometry sources. The canonical editable construction is `master/smv-traveller-master.svg`; its identical native-vector group is propagated into every production SVG.

The traveller must remain rear-facing and visually centred on the tunnel axis. Preserve the exact approved head/hat mass, the broad cream brim and crown, the warm red band, the hand resting at the upper-right of the hat, and the raised forearm’s continuous outer curve. The opposite arm must descend diagonally away from the backpack before returning to the relaxed wrist and hand. Preserve the triangular negative space between arm and pack, the soft orange shoulders, cream trousers, narrow leg split, and the source’s asymmetry. Do not “correct” the mascot into a straighter, more symmetrical, or more anatomical pose.

The warm-tan backpack must read as a substantial layered travel object, not a flat rectangle. Preserve its upper flap, central main panel, tonal side depth, irregular outer contour, two vertical straps, attachment points, buckles, lower pocket, and cream lower-roll structure. Keep the head, shoulders, pack, arms, and legs in the approved measured proportions and retain the warm hand-drawn character and subtle asymmetry.

The traveller is protected mascot artwork. Do not substitute it, redraw it casually, independently alter it in one lockup, or derive it from an unrelated explorer image. **Every future refinement must begin from the locked master and must retain the approved outer silhouette. The hat, both arms, shoulders, backpack outline, trouser width, leg split, negative spaces, and stance may not be straightened, compressed, modernised, simplified, symmetrised, or replaced.** The seven approved arch layers and separate ground are independent locked elements and were not changed by the traveller correction.

### Explorer silhouette lock measurements

Measurements are taken on the approved 98×148 working crop. The visible silhouette occupies x=9–90 and y=12–134. Alignment is locked by feet, body centre, and hat centre before comparison.

| Parameter | Approved measurement | Locked intent |
| --- | ---: | --- |
| Total visible traveller | 82×123 px | 100% comparison height |
| Hat/brim envelope | approximately 40×56 px | Broad left-weighted hat mass; do not flatten |
| Shoulder envelope | approximately 61 px wide | Soft, rounded orange sleeves |
| Backpack outer envelope | approximately 52×70 px | Tall layered pack including side depth |
| Backpack top | approximately y=56 | Begins directly below the hat/shoulder junction |
| Hanging-arm negative space | approximately 9 px at y=110 | Clearly separated arm and pack |
| Raised elbow extreme | approximately x=90, y=40 | Preserves the high right-hand gesture |
| Trouser envelope | x=32–69, 38 px wide | Do not widen or shorten |
| Lower leg split | approximately 1–2 px | Narrow centred crease/opening |

The locked SVG records a 127×193 px high-resolution source silhouette before placement. At the 98×148 approval scale, the rendered SVG achieves 97.65% silhouette intersection-over-union, 98.81% F1 overlap, 1.00 px 95th-percentile boundary deviation, and 1.41 px maximum boundary deviation. The red difference mask and black silhouette overlap are maintained in `preview/` as the approval gate.

## Logo variants

| Asset | Purpose |
| --- | --- |
| `master/smv-logo-horizontal-master.svg` | Canonical horizontal construction on transparent/light backgrounds. Preserve as the vector source of truth. |
| `master/smv-icon-master.svg` | Canonical icon construction. Preserve as the icon vector source of truth. |
| `master/smv-traveller-master.svg` | Canonical traveller construction. Propagate this exact group; do not redraw variants independently. |
| `logos/smv-logo-horizontal-dark.svg` | Dark-brown lettering for white, cream, and other light backgrounds. |
| `logos/smv-logo-horizontal-light.svg` | White lettering and cream motto for brown, black, and dark photographic backgrounds. |
| `icons/smv-icon-master.svg` | Transparent icon for square exports, app work, and flexible placement. |
| `icons/smv-icon-circle.svg` | Cream-backed circular, profile-safe icon with crop breathing room. |
| `social/smv-watermark-horizontal.svg` | Icon, name, and legible motto for larger post and thumbnail corners. |
| `social/smv-watermark-compact.svg` | Icon and name without the motto for reels and smaller overlays. |
| `logos/smv-logo-stacked.svg` | Spacious stacked alternative for covers and portrait documents; never force it into a tight circle. |
| `favicon/favicon.svg` | Full approved traveller and locked portal, retained at tiny favicon sizes. |

## Usage mapping

| Touchpoint | Approved asset |
| --- | --- |
| Instagram, Facebook, and YouTube profile | `smv-icon-circle.svg` or a `smv-profile-*` export |
| WhatsApp Business display picture | `smv-icon-circle.svg` or `smv-profile-512x512` |
| Website header on light background | Future use: `smv-logo-horizontal-dark.svg` |
| Website footer / dark hero | Future use: `smv-logo-horizontal-light.svg` |
| Instagram post or carousel | Horizontal or compact watermark; use the stacked logo only as a deliberate cover mark |
| Reel cover | `smv-watermark-compact.svg` |
| Facebook and YouTube content | Horizontal watermark; light lettering over dark imagery |
| YouTube thumbnail | `smv-watermark-horizontal.svg` or the named 480px export |
| Posters and brochures | Horizontal dark on light stock; light on a dark field; stacked for portrait covers |
| Email signatures | Horizontal dark without reducing below the minimum size |
| Quotations, itineraries, presentations | Horizontal dark on light pages; horizontal light on dark cover pages |
| Favicon | `favicon.svg`, `favicon-16x16.png`, or `favicon-32x32.png` |
| Future mobile app | `app-icon-192.png` and `app-icon-512.png`; regenerate platform-specific masks from the vector icon |

The new assets are review-only in v1.0. Do not replace the live website header, footer, metadata, or active favicon until approval.

## Colour palette

CMYK values are practical process-print approximations; request a calibrated proof for critical print work.

| Name | HEX | RGB | CMYK approx. | Guidance |
| --- | --- | --- | --- | --- |
| Dark brown | `#2B1A12` | 43, 26, 18 | 0, 40, 58, 83 | Separate ground, wordmark, outlines, premium neutral |
| Inner tunnel | `#230334` | 35, 3, 52 | 33, 94, 0, 80 | Seventh and innermost arch; never merge with the ground |
| Deep aubergine | `#401856` | 64, 24, 86 | 26, 72, 0, 66 | Sixth arch layer |
| Medium purple | `#472063` | 71, 32, 99 | 28, 68, 0, 61 | Fifth arch layer |
| Tagline purple | `#2D0B47` | 45, 11, 71 | 37, 85, 0, 72 | Motto on light backgrounds; not an arch layer |
| Outer magenta | `#B7268F` | 183, 38, 143 | 0, 79, 22, 28 | First and outermost arch layer |
| Deep crimson | `#C22224` | 194, 34, 36 | 0, 82, 81, 24 | Fourth arch layer |
| Bright orange | `#FA6918` | 250, 105, 24 | 0, 58, 90, 2 | Third arch layer |
| Golden orange | `#FE9717` | 254, 151, 23 | 0, 41, 91, 0 | Second arch layer |
| Warm orange accent | `#FF9718` | 255, 151, 24 | 0, 41, 91, 0 | Traveller details and dark-background watermark script; not an arch layer |
| Orange-red accent | `#F05A24` | 240, 90, 36 | 0, 63, 85, 6 | Script wordmark and traveller hat accent |
| Cream | `#F7E6C4` | 247, 230, 196 | 0, 7, 21, 3 | Profile field, traveller clothing, dark-background motto |
| White | `#FFFDFC` | 255, 253, 252 | 0, 1, 1, 0 | Light wordmark and calm negative space |

The current website footer reference is `#20150F`. Use the horizontal light logo there; do not substitute pure black lettering or recolour the rainbow.

## Typography

- **SEARCH MY:** Poppins Bold, uppercase, outlined into paths with confident spacing. Poppins is licensed under the SIL Open Font License.
- **Vacation:** Great Vibes Regular, outlined into paths and set in orange-red or warm orange. Great Vibes is licensed under the SIL Open Font License. Its sweep is allowed generous width and vertical breathing room.
- **Signature swoosh:** The locked editable path is an inseparable part of the Vacation wordmark. It is not punctuation, a text underline, or an optional decoration.
- **Motto:** Poppins Medium, outlined into paths, sentence case, compact natural spacing, and visibly subordinate to the name.

No font files are distributed and the final SVGs do not depend on local or web fonts. Editors should retain the existing outlined masters. If lettering is recreated, use the named typefaces and compare against the approved master before exporting.

## Proportions and clear space

Define **x** as the rendered width of the traveller’s hat brim inside the icon.

- Keep at least **1x** clear space on every side of the horizontal, stacked, icon, and profile-safe marks.
- Compact watermarks may use **0.5x**, provided they remain inside a platform-safe margin.
- Keep the traveller centered on the rainbow axis. Never compress the arch vertically or expand it horizontally.
- In circular crops, keep the complete profile-safe circle visible during placement; let the platform apply the final crop.

## Minimum sizes

| Variant | Digital minimum | Print minimum |
| --- | --- | --- |
| Detailed icon | 32px; prefer 64px or larger | 12mm wide |
| Circular profile icon | 128px supplied image | 18mm wide |
| Horizontal with motto | 420px wide | 40mm wide |
| Compact watermark without motto | 180px wide | 25mm wide |
| Horizontal watermark with motto | 320px wide | 35mm wide |
| Stacked logo | 240px wide | 35mm wide |

At 16px and 32px the favicon uses the same full approved traveller geometry as the larger marks. Fine pack details naturally resolve more quietly at those sizes, but no alternate mannequin or replacement character is used. Preserve the hat silhouette, raised-arm gesture, hanging arm, pack block, orange shoulder clothing, and cream trousers. At 64px and above these elements must be clearly recognisable. If the motto is not comfortably readable, use the compact watermark or icon-only identity.

## Background guidance

- **White and cream:** use the horizontal dark logo. Preserve transparency; do not add a white box.
- **Brown, black, or dark fields:** use the horizontal light logo. The underlying rainbow identity remains unchanged.
- **Photography:** choose the version with stronger contrast and place it over a calm region. A subtle solid colour panel is acceptable; unapproved shadows, glows, and outlines are not.
- **Busy images:** move the logo to a quieter corner or add an approved cream/brown field rather than compromising legibility.
- **Profile spaces:** use only the circle-safe icon. Do not place the company name or motto inside the avatar.

## Prohibited usage

Do not stretch, flatten, skew, rotate, crop, or change proportions. Do not change rainbow colours or recolour traveller elements inconsistently. Do not replace the approved traveller with a generic explorer, simplified mannequin, alternative backpacker, or AI-generated reinterpretation. Do not put the full logo inside a cramped circle. Do not make the motto unreadably small. Do not place the mark too close to edges. Do not use screenshots or low-resolution social downloads as final assets. Do not add shadows, outlines, gradients, bevels, or effects without approval. Do not alter the outlined lettering or independently rescale only one word. Do not remove, straighten, restyle, or independently reposition the signature swoosh beneath “Vacation.”

## Export workflow

From `web/`, run:

```sh
npm run brand:export
```

The script reads the checked-in SVG masters, validates that each required master exists, creates the export folders, preserves transparency, and writes deterministic lossless PNG and WebP assets. PNG/WebP outputs are derivatives; edit SVG masters, never the raster exports.

## Fidelity and refinement notes

The final v1.0 traveller is a source-traced, maintainable vector reconstruction of the approved mascot, not an artistic reinterpretation. The outer contour was locked before colour or pack detail was added. It retains the precise hat/raised-arm relationship, separated hanging arm, soft shoulders, tall layered pack, bottom roll, cream trousers, leg split, negative spaces, proportions, and stance of the approved visual-guideline crop. The 500×500 original repository logo was used only to recover higher-resolution curve and colour information already present in that approved traveller. Any future production refinement requires owner approval, must pass the same silhouette overlay and red-difference gate, and must begin from `master/smv-traveller-master.svg` before consistent propagation without changing the locked arch, ground, asset names, or export workflow.
