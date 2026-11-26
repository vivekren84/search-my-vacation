# Search My Vacation (SMV) — Project Standards & UI Governance SOP

## 1. UI Color Parity & Theme Governance (Mandatory)
Every new page, modal, drawer, card, and component across the SMV public site and Staff Portal **must** maintain exact color parity with existing pages and support all three theme modes:

1. **Theme Modes & System Default:**
   - The application defaults to `"system"` (`ThemeContext.tsx` / `smv_theme_preference`) and supports explicit `"light"`, `"dark"`, and `"system"` (OS `prefers-color-scheme`) switching via `ThemeToggle`.
   - Never hardcode a single-mode background or text color without its paired `dark:` variant, and never override `ThemeProvider` or `html.dark` behavior.
2. **Dusk Horizon Palette Tokens:**
   - **Primary Brand Accent:** `#F5951C` (Amber Gold; hover `#e08515`), with high-contrast `#0F172A` text on `#F5951C` buttons.
   - **Light Mode Surfaces & Text:**
     - Page / Recessed Surface: `#F8FAFC`
     - Elevated Card / Modal / Drawer Surface: `#FFFFFF`
     - Primary Text: `#0F172A`
     - Secondary / Muted Text: `#475569` / `#64748B`
     - Borders: `#E2E8F0` (cards/dividers), `#CBD5E1` (inputs/buttons)
   - **Dark Mode Surfaces & Text:**
     - Page / Recessed Surface: `#09090B`
     - Elevated Card / Modal / Drawer Surface: `#121215`
     - Primary Text: `#FFFFFF`
     - Secondary / Muted Text: `zinc-400` / `zinc-500`
     - Borders: `white/10` (cards/dividers), `white/15` (inputs/buttons)
3. **Accessibility & Contrast:**
   - All text, badges, form inputs, placeholders, and interactive controls must remain legible in both Light Mode and Dark Mode.

## 2. Brand Tone & Architectural Guardrails
1. **Brand Tone Mandate:** Strictly **ZERO** occurrences of the word `"luxury"` across all UI copy, placeholders, code, comments, database objects, and client-facing outputs. Use *bespoke, high-touch, slow-travel, artisanal, premier, curated*.
2. **Public Decoupling (`BOUND-01`):** Public customer flows (`/journey-passport`, `/journey-director`) must remain 100% passwordless and completely decoupled from internal staff authentication and portal storage buckets.
3. **White-Label Masking (`US-010`):** Internal DMC/vendor names and operational notes must never appear in client-facing itinerary or voucher outputs.
