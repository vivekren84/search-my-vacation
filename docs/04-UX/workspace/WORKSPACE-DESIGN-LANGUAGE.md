# Workspace Design Language

| Document Information | |
|---|---|
| Document Name | Workspace Design Language |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie / Tiger / Product Owner review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |
| Predecessor | Workspace UX Discovery v1.0; Workspace Navigation Model v1.0 |
| Related | `docs/04-UX/workspace/mockups/` (visual reference); `EBC-R1.3-WS11-010-RAD-Workspace-Authentication-UX-Refinement-Implementation-Report.md`; `EBC-R1.3-WS11-011-RAD-Workspace-Dashboard-Foundation-Implementation-Report.md` |

---

## 1. Purpose

This document is the single source of truth for the Workspace's visual language: colour, typography, spacing, radius, elevation, iconography and motion. It exists because the as-shipped Workspace shell (Header, Navigation, Dashboard — `EBC-R1.3-WS11-011`) does not draw on the Search My Vacation brand system at all, while the Workspace's own authentication surfaces (`EBC-R1.3-WS11-009`/`-010`) already do. This document closes that gap by making the already-approved, already-*implemented* auth visual language (not a new invention) the Workspace-wide standard, per this EBC's own instruction: **evolve the existing design language; do not invent a new one.**

## 2. Source of Truth — a Disclosed Correction

Per Project Instructions §17 (existing implementation outranks archived/draft material), and consistent with `EBC-R1.3-WS11-010`'s own disclosed finding:

- `docs/04-UX/DESIGN-TOKENS.md` and `docs/04-UX/COLOR-SYSTEM.md` (Status: Draft, 13–16 Jul 2026) describe a **different, superseded** palette (`#0F4C81` primary blue, Plus Jakarta Sans) and a set of *named but unvalued* tokens ("Color Primary", "Surface Card", etc.) awaiting "Future Colour Validation." Neither document was ever implemented.
- The **actual, live, shipped** design system is `web/app/globals.css`, used consistently across the entire public site and — critically — already restyled into the Workspace's own Sign-In modal (`SignInModal.module.css`, `EBC-R1.3-WS11-010`) and the public-site `DestinationItineraryModal`.

This document therefore treats `app/globals.css` as the Workspace's design-token source of truth, exactly as `EBC-R1.3-WS11-010` already did for the authentication surfaces. **Recommendation (non-blocking, carried from `EBC-R1.3-WS11-010`'s own Section 9 observation and repeated here since it is directly relevant to this EBC's subject matter):** Tiger/Archie should schedule a documentation-reconciliation pass retiring or rewriting `DESIGN-TOKENS.md`/`COLOR-SYSTEM.md` so a future session does not start from the stale draft by mistake. This document does not perform that reconciliation itself — it is out of Sophie's authority to retire another persona's document unilaterally.

## 3. What "Generic SaaS" Actually Means, in Evidence

Direct inspection of the as-shipped Workspace shell (`WorkspaceShell.tsx`, `WorkspaceHeader.tsx`, `WorkspaceUserMenu.tsx`, `WorkspaceNav.tsx`, `KpiCard.tsx`, `RecentActivityCard.tsx`, `UpcomingTasksCard.tsx`, `QuickActions.tsx`, `EmptyState.tsx`, `ComingSoon.tsx`) found that every colour value is a **raw, hard-coded hex** — and, with one exception, none of these hexes exist anywhere in `app/globals.css`:

| Hard-coded value in shipped code | What it actually is | SMV token it should be |
|---|---|---|
| `#F9FAFB` (shell background, disabled search/bell background) | Tailwind's default `gray-50` | `var(--color-cream)` (`#FFFDFC`) |
| `#E5E7EB` (every card/header/nav border) | Tailwind's default `gray-200` | a warm border, matching `SignInModal.module.css`'s `rgb(154 100 46 / 20%)` |
| `#9CA3AF` (labels, placeholder text, disabled icon colour) | Tailwind's default `gray-400` | `var(--color-espresso)` at reduced opacity (e.g. `rgb(42 33 28 / 42%)`) |
| `#4B5563` (secondary text, "Workspace" label) | Tailwind's default `gray-600` | `var(--color-espresso)` at reduced opacity (e.g. `rgb(42 33 28 / 62%)`) |
| `#2A211C` (primary text) | **This one coincidentally already matches `--color-espresso`** — but is hard-coded rather than referencing the token | `var(--color-espresso)` |
| `#280336` at 10% opacity (active nav item, avatar chip) | **This one already matches `--color-primary`** — the only genuine (if incomplete) brand touch in the whole shell | `var(--color-primary)`, kept, but paired with an accent so it doesn't read as flat |

The only other brand touch anywhere in the shell is `font-serif`/`var(--font-editorial)` on `WelcomeSection`'s `<h1>` — applied nowhere else, so it reads as one isolated flourish rather than a system.

**This table is the root cause, in evidence, of the Product Owner's "generic SaaS administration dashboard" observation.** It is not a structural or informational-architecture problem — the shell's actual layout, grouping and content are correct and approved (Sections 5–7 of this EBC forbid changing them). It is, specifically, that the shell was built entirely from Tailwind's default neutral palette instead of the SMV token set already sitting one file away in `app/globals.css`, and already proven out in the very same codebase's Sign-In modal.

## 4. Colour

### 4.1 Core tokens (already defined in `app/globals.css` — reused, not created)

| Token | Value | Workspace usage |
|---|---|---|
| `--color-cream` | `#FFFDFC` | Shell background, card backgrounds, replaces `#F9FAFB` everywhere |
| `--color-espresso` | `#2A211C` | Primary text, replaces `#4B5563`/`#9CA3AF`/hard-coded `#2A211C` |
| `--color-primary` | `#280336` | Active nav state, avatar/brand mark, kept from the one existing correct usage |
| `--color-primary-hover` | `#4A2062` | Hover state for primary-toned elements |
| `--color-amber` | `#F5951C` | Primary CTA fill (Quick Actions' primary action), active-state accent bar, empty-state icon chips |
| `--color-orange` | `#F36523` | Secondary accent (avatar gradient, decorative accents) — used sparingly, per the public site's own "10% accent colour" balance convention |
| `--color-crimson` | `#B72027` | Error states (already used this way in `SignInModal.module.css`) |
| `--color-success` | `#16A34A` | Success states, reused unchanged |

### 4.2 New warm-neutral utility values (not new tokens — the same literal values `SignInModal.module.css` already uses; this document names them for consistent reuse, it does not mint new custom properties without Archie's review)

| Purpose | Value | Precedent |
|---|---|---|
| Warm border (default) | `rgb(154 100 46 / 20%)` | `SignInModal.module.css` `.dialog` border |
| Warm border (soft/subtle) | `rgb(154 100 46 / 12%)` | Derived from the same hue for lighter dividers (header/card borders) |
| Secondary text | `rgb(42 33 28 / 62%)` | Same espresso hue as `--color-espresso`, reduced opacity, matching `SignInModal.module.css`'s `.helperText`/`.forgotLink` |
| Muted text | `rgb(42 33 28 / 42%)` | Same pattern, for the lowest-emphasis labels (KPI captions, timestamps) |

**Recommendation (Recommended, not Mandatory):** if this pattern proves durable, Archie should consider promoting `rgb(154 100 46 / 20%)` and the two espresso-opacity values to named custom properties in `app/globals.css` (e.g. `--border-warm`, `--text-secondary`, `--text-muted`) so future components reference a token instead of repeating the literal `rgb()` value — exactly the improvement `DESIGN-TOKENS.md` originally intended, just grounded in the real, shipped palette instead of the stale draft one. This is a code-organisation suggestion, not a visual change, and is Archie's/Rad's call, not mandated by this UX card.

### 4.3 Colour balance

Preserve the public site's own documented balance principle (`docs/04-UX/COLOR-SYSTEM.md` §"Colour Usage Guidelines" — the one part of that draft document still directionally valid even though its named tokens were never implemented): predominantly neutral/cream, primary purple for structure and active state, amber used sparingly for the single most important action per screen. Concretely for the Dashboard: **one** amber-filled Quick Action ("New Lead" — the Inquiry-First entry point the original UX Discovery names as the Workspace's most important recurring action), not five identically-treated buttons.

## 5. Typography

| Level | Font | Current state | Refinement |
|---|---|---|---|
| Section/page headings (Dashboard `<h1>`, card `<h2>`s) | `var(--font-editorial)` (serif) | Applied only to `WelcomeSection`'s `<h1>` | Extend to every card heading ("Recent Activity", "Upcoming Tasks", "Quick Actions") for one consistent typographic voice across the screen, matching `SignInModal.module.css`'s `.title` treatment |
| Body copy, labels, buttons | `var(--font-utility)` / `var(--font-body)` | Already applied correctly — `:where(button, nav, label, select)` in `globals.css` sets `--font-utility` globally, so `WorkspaceNav`'s `<nav>` and every `<button>` already inherit it without any Workspace-specific code | No change needed; disclosed here so Rad does not duplicate work already done by the global stylesheet |
| KPI values | `var(--font-editorial)` | Currently `font-semibold` sans, no serif | Apply serif to KPI values only (not labels), matching the mockup — reinforces "this number matters" the way the public site uses serif for emphasis, while KPI captions stay in the small-caps utility style already used |

No new font family, weight, or licence is introduced — this section only extends the *reach* of the two font variables already defined in `app/layout.tsx`.

## 6. Spacing, Radius and Elevation

| Attribute | Current (shipped) | Refined |
|---|---|---|
| Card corner radius | Tailwind `rounded-2xl` (1rem/16px, a Tailwind default not tied to any token) | `var(--radius-xl)` (20px) for cards, `var(--radius-lg)` (12px) for nav items/buttons — reuses the two radius tokens already defined in `globals.css` |
| Card shadow | Tailwind arbitrary `shadow-[0_1px_3px_rgba(0,0,0,.08)]` (this literal value is, in fact, already identical to `--shadow-sm` — it was hand-typed instead of referencing the token) | `var(--shadow-sm)` / `var(--shadow-md)` on hover — same visual result, now token-driven so a future palette change propagates automatically |
| Card border | `1px solid #E5E7EB` | `1px solid` warm border (Section 4.2) |
| Pill buttons (Quick Actions) | `rounded-full` (fine, keep) | Add `var(--radius-pill)` explicitly for consistency; no visual change |

## 7. Iconography

The shell currently contains exactly two icons (search glyph, bell glyph), both small inline SVGs — this is the correct approach (Architecture Discovery's own finding: no icon library exists in this repository, and this EBC's Out of Scope excludes adding one). The refinement is not to add a new icon library but to:

- Re-tint existing and new icon glyphs (KPI icon chips, empty-state icon chips) using the warm-neutral/amber palette (Section 4) instead of Tailwind gray, and
- House every icon in a consistent circular "chip" container (`--radius-pill` background, 2–2.4rem square) rather than a bare glyph, matching the pattern already used for the notification bell button and the user-menu avatar.

**Optional, disclosed rather than assumed:** if Rad/Archie later decide a proper icon library is warranted (e.g. Lucide or Heroicons, both MIT-licensed and commonly paired with Tailwind), that is a new dependency decision requiring Archie's assessment per Project Instructions §21 — not something this UX card authorises or requires. The recommendations in this document work equally well with the existing hand-drawn inline-SVG convention.

## 8. Motion

Reuse the exact pattern already shipped in `SignInModal.module.css` — a 220ms `cubic-bezier(0.16, 1, 0.3, 1)` fade+rise for entrances, disabled under `prefers-reduced-motion: reduce` — for:

- The User Menu dropdown's open/close (currently instant show/hide via conditional render).
- Hover-state transitions on nav items and cards (background/border-color transition, ~150ms, matching the global `a, button { transition-timing-function }` rule already defined in `globals.css`).

No new animation vocabulary is introduced; this is the same recipe already approved and shipped for authentication, applied to two additional interaction points.

## 9. What This Document Deliberately Does Not Do

- It does not introduce a new colour, font, or icon dependency.
- It does not touch `app/globals.css`'s token *values* — only proposes (as a non-blocking Recommendation) that Archie consider naming a small number of already-used literal values as new custom properties.
- It does not specify component markup or Tailwind class names — that is Rad's implementation choice; see the Workspace UX Review Notes for the recommendation-by-recommendation engineering handover.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*
