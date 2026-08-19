# EBC R1.2-009 — Experiences Retirement: Sophie's UX Implementation

**Owner:** Sophie (UX/UI implementation) | **Type:** Pure implementation (no remaining product decisions) | **Status:** Implemented, handed to Rad for routing/redirect/regression

## What this implements

Per DEC-R1.2-009 and DEC-R1.2-012 (see `docs/10-Backlog/RELEASE-1.2.md`) and Arjun's R1.2-007 analysis, "Experiences" is retired as an intentional discovery path from the Homepage, Header and Footer, while the `/experiences` page, its implementation and its Journey Passport wiring are all preserved untouched for future reuse.

I independently re-verified Arjun's reference inventory before editing — a repository-wide search for `/experiences` links (excluding the retained page itself) turned up exactly three matches, matching Arjun's Section 8 exactly:

1. `web/config/site.config.ts` — the Primary Navigation entry
2. `web/components/sections/HomepageExperience/HomepageExperience.tsx` — the "Journey Invitations" homepage section (heading, three teaser cards, and the "Explore All Experiences" CTA)
3. `web/components/layout/PublicFooter.tsx` — the Footer's "Discover" group entry

All three are edited below. No other intentional discovery path to `/experiences` exists anywhere in the live app.

## Files changed

| File | Change |
|---|---|
| `web/config/site.config.ts` | Removed the `{ label: "Experiences", href: "/experiences" }` entry from `navigation`. `Header.tsx` maps this array for both desktop and mobile nav, so this one edit covers both. |
| `web/components/layout/PublicFooter.tsx` | Removed the `["Experiences", "/experiences"]` entry from the "Discover" link group. |
| `web/components/sections/HomepageExperience/HomepageExperience.tsx` | Removed the entire "Journey Invitations" `<section>` (heading, three cards, CTA) and the `invitations`/`homepageInvitations` data it alone consumed. Everything else in the file — Destinations, Trust points, Traveller Stories, Trust Strip, Travel Inspiration, About preview, Contact preview — is untouched, in the same order. |
| `web/components/sections/HomepageExperience/JourneyInvitations.tsx` | **New.** The removed section, extracted verbatim (same JSX, same data, same styling) into its own component. Not imported or rendered anywhere — this is the "preserve implementation for future reuse" requirement satisfied as working, reusable code rather than a comment block or deleted history. |

## Preservation approach — why a component, not a comment block

The EBC asks to "preserve implementation for future reuse." Rather than leaving a large commented-out JSX block inline in `HomepageExperience.tsx` (hard to reason about, easy to bit-rot, awkward to re-enable), I extracted the whole section into `JourneyInvitations.tsx` as a real, working, standalone component. Reintroducing it later — on the homepage, on `/experiences`, or anywhere else — is a two-line change: import it, render `<JourneyInvitations />`. This mirrors the project's established "never delete, always retain and clearly mark" convention (same approach already used for the retired Escape mood-card artwork in R1.2-004).

Note on scope: this preserves the *homepage teaser* version of Journey Invitations specifically. The separate `/experiences` page (`web/app/experiences/page.tsx`, using `EditorialCardGrid`) is a different implementation that already covers all 6 invitation concepts — it wasn't touched and didn't need to be, since it was never part of this EBC's removal scope.

## Homepage spacing/rhythm after removal

Checked `.layout-section` in `app/globals.css` (`padding-block: var(--layout-section-space)`, a fixed clamp with no first-child or sibling-dependent rules) before removing anything — every homepage section carries its own uniform vertical padding independent of position, so removing one section doesn't create a doubled or collapsed gap for its neighbours. After removal, "Places with possibility" (Destinations) is simply the first section rendered after the Hero, with the same spacing it already had. No spacing values were changed anywhere; before/after screenshots (below) confirm this visually.

## Redirect note for Rad — flagging a discrepancy, not resolving it

The EBC lists "Redirect `/experiences` appropriately (implemented by Rad after Sophie confirms the UX flow)" as a follow-on item, and the (still-uncommitted, in-progress) `RELEASE-1.2.md` DEC-R1.2-012 draft I found on this branch mentions "redirect guest requests to `/experiences`." Arjun's R1.2-007 analysis — read in full before this implementation — explicitly assessed redirects (R1.2-02.06) and concluded: *"No redirect is needed because nothing is being deleted or moved"* — the page stays live at its existing URL; only inbound *links* to it are being removed. I haven't touched any routing/redirect code (out of Sophie's scope per this EBC), but flagging this for Rad now: worth a quick confirmation with Tiger/Vivek on what "redirect" is actually meant to cover here (a literal HTTP redirect would contradict "no page/URL deletion" and Arjun's own finding) before implementing it, rather than assuming a redirect is needed by default.

## Verification of no remaining intentional discovery paths

Repository-wide search (`grep -rn` across `web/`, excluding `node_modules`/`.next`) for internal links to `/experiences` after this implementation: zero remaining matches outside `web/app/experiences/page.tsx` itself (its own route file, expected). Header, Homepage and Footer are the only three places that ever linked to it, and all three are now edited.

## Validation

- ESLint (full repo): pass
- TypeScript (`tsc --noEmit`): pass
- Production build: could not be completed in this session — same persistent device-bridge `.next` EPERM limitation documented on every prior EBC this session, unrelated to this change. Please confirm with a local/CI build.

## Deliverables

- Before/after homepage screenshots, desktop and mobile (sent alongside this report)
- This design rationale
- Files listed above, written into the repository on `feature/ebcr1.2-003-trust-strip-visual-refresh` (the shared WS1/WS2 branch)
