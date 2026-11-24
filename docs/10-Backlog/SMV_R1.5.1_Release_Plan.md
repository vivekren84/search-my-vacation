# Search My Vacation (SMV) — Release 1.5.1 Master Requirements & Architecture Specification

- **Document Version:** 1.0 (Approved Baseline)
- **Release Stream:** Release 1.5.1 — High-Touch Team Profile, Customer CRM & Horizon Theme Refresh
- **Target Git Branch:** `feature/release-1.5.1-team-profile-crm`
- **Primary Stakeholder:** Vivek Renganathan (`super_admin` / Owner — `vivek@searchmyvacation.com`)
- **Non-Negotiable System Guardrails:**
  1. **Brand Tone Mandate:** Strictly **ZERO** occurrences of the prohibited term across all code, UI copy, database metadata, comments, documentation, and migrated data. Permitted terms: *bespoke, high-touch, slow-travel, artisanal, premier, curated*.
  2. **Decoupling Boundary (`BOUND-01`):** Public customer conversion flows (`/journey-passport`, `/journey-director`) must remain 100% passwordless and decoupled from internal staff authentication.

---

## 1. Executive Summary & Architectural Purpose

Release 1.5.1 builds directly upon the completed Release 1.5 baseline (Internal Staff Portal, Role-Based Access Control, single-channel OTP, and first-login password rotation). It bridges internal operations and the dedicated CRM stream (`CRM-01`, `CRM-03`, `CRM-04`, `CRM-06`) by delivering three tightly integrated architectural pillars:

1. **Pillar A: Normalized Two-Tier Relational Customer & Deal Architecture (`workspace_customers` + `workspace_trips`)**
   - Replaces the flat traveller model with a relational **1 Customer (`CUST-XXXXX`) $\rightarrow$ Many Trips (`DDSMV-YY-XXX` / `VDSMV-YY-XXX`)** hierarchy.
   - Database-enforced atomic sequence generation via row-level locking (`SELECT ... FOR UPDATE`).
   - Deduplicated ingestion and sanitization of the historic Google Sheets database (`SMV - One Tracker.xlsx`).
   - Smart returning-customer lookup in the intake flow.
2. **Pillar B: Internal Team Workspace Profile (`/portal/profile`)**
   - Rich atelier profile management for all internal staff tiers.
   - Database-enforced governance locks on security columns (`company_email`, `registered_mobile`, `role`).
   - Custom studio portrait upload (`400×400` WebP, EXIF stripped, `staff-avatars` storage bucket) and a suite of 4 curated executive SVG avatars.
   - In-place permanent password change and session refresh.
3. **Pillar C: Dusk Horizon Editorial Split & Global Theme Switcher**
   - Eliminates legacy muddy brown tones across portal and public pages.
   - Delivers the approved **Dusk Horizon Editorial Split** (Light Mode) and **Sunset Horizon Obsidian** (Dark Mode) design systems.
   - Provides an accessible theme switcher (`Light / Dark / System`) across public navbar, portal header, and advisor profile, backed by a blocking `<head>` hydration script to eliminate FOUC.

---

## 2. Epic & User Story Backlog Matrix

| Story ID | Pillar / Epic | Title | Target Persona | Priority | Architectural Layer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US-151-01** | Pillar A: Customer & Deal CRM | Two-Tier Customer Master (`CUST-XXXXX`) & Atomic Deal ID (`DDSMV`/`VDSMV`) Trigger Engine | Desk User / Admin | P0 (Blocker) | PostgreSQL / Supabase |
| **US-151-02** | Pillar A: Customer & Deal CRM | Smart Mobile Lookup & Existing Customer Linking in `+ Add Client` Modal | Desk User | P0 (Blocker) | Next.js Client / API |
| **US-151-03** | Pillar A: Customer & Deal CRM | Production QA Data Purge & Clean Sequence Initialization | Super Admin | P0 (Blocker) | SQL Migration |
| **US-151-04** | Pillar A: Customer & Deal CRM | Google Sheets Tracker Historical Data Ingestion (`Archive` + `2026` Tabs) | Super Admin | P0 (Blocker) | Node.js Migration CLI |
| **US-151-05** | Pillar B: Team Workspace Profile | Advisor Atelier Profile Schema & Database-Enforced Governance Locks | Internal Staff | P1 (High) | PostgreSQL + Next.js |
| **US-151-06** | Pillar B: Team Workspace Profile | Studio Portrait Upload (`400×400` WebP) & 4 Curated Executive SVG Avatars | Internal Staff | P1 (High) | Supabase Storage + UI |
| **US-151-07** | Pillar B: Team Workspace Profile | In-Place Permanent Password Rotation & Session Refresh | Internal Staff | P1 (High) | Supabase Auth + UI |
| **US-151-08** | Pillar C: Design System Refresh | Dusk Horizon Editorial Split & Sunset Horizon Obsidian Color Tokens | All Users | P1 (High) | Tailwind CSS Tokens |
| **US-151-09** | Pillar C: Design System Refresh | Global Accessible Theme Switcher (`Light / Dark / System`) & FOUC Prevention | All Users | P1 (High) | Layout / Storage |

---

## 3. Detailed Specifications & Acceptance Criteria

### Pillar A: Relational Customer & Deal Architecture

#### `US-151-01`: Two-Tier Customer Master (`CUST-XXXXX`) & Atomic Deal ID Trigger Engine
- **Functional Description:** Decouple customer identity from individual travel engagements. A customer represents an enduring human/household profile. A trip represents an enquiry, quoted itinerary, or booked vacation linked via `customer_id`.
- **Database Architecture:**
  - `public.workspace_customers`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `customer_code TEXT UNIQUE NOT NULL`: formatted as `CUST-00100` onward. Generated via dedicated sequence `public.customer_code_seq` starting at `100`.
    - `primary_name TEXT NOT NULL`
    - `primary_mobile TEXT`: normalized E.164. Protected by a **partial unique index** (`WHERE primary_mobile IS NOT NULL`) so historical rows without mobile contact do not collide.
    - `secondary_mobile TEXT`: secondary contact number.
    - `primary_email TEXT`: nullable (email is optional for slow-travel mobile/WhatsApp enquiries).
    - `zoho_synced BOOLEAN NOT NULL DEFAULT false`
    - `needs_contact_enrichment BOOLEAN NOT NULL DEFAULT false`
    - `created_by_user_id UUID REFERENCES public.workspace_users(user_id)`
    - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
    - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
    - `metadata JSONB NOT NULL DEFAULT '{}'::jsonb`
  - `public.deal_id_sequences`:
    - `deal_channel TEXT NOT NULL CHECK (deal_channel IN ('DIRECT', 'VENDOR'))`
    - `year INTEGER NOT NULL`
    - `last_val INTEGER NOT NULL DEFAULT 0`
    - `PRIMARY KEY (deal_channel, year)`
  - `public.workspace_trips`:
    - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
    - `customer_id UUID NOT NULL REFERENCES public.workspace_customers(id) ON DELETE CASCADE`
    - `deal_reference_id TEXT UNIQUE NOT NULL`: auto-generated format `DDSMV-YY-XXX` (Direct) or `VDSMV-YY-XXX` (Vendor). E.g. `DDSMV-26-162`.
    - `deal_channel TEXT NOT NULL CHECK (deal_channel IN ('DIRECT', 'VENDOR'))`
    - `lead_owner_id UUID REFERENCES public.workspace_users(user_id)`
    - `destination TEXT NOT NULL`
    - `travel_year INTEGER`
    - `travel_month TEXT`
    - `duration_label TEXT` (e.g. `5N/6D`)
    - `nights INTEGER`
    - `start_date DATE`
    - `end_date DATE`
    - `booking_date DATE`
    - `travel_party_type TEXT CHECK (travel_party_type IN ('Solo', 'Family', 'Group', 'Corporate', 'Other'))`
    - `pax_adults INTEGER NOT NULL DEFAULT 1`
    - `pax_children INTEGER NOT NULL DEFAULT 0`
    - `deal_stage TEXT NOT NULL DEFAULT 'Enquiry'`
    - `payment_status TEXT NOT NULL DEFAULT 'To Start'`
    - `trip_status TEXT NOT NULL DEFAULT 'To Start'`
    - `booked_properties TEXT`
    - `booked_transport TEXT`
    - `notes TEXT` (sanitized against brand tone rules)
    - Financial columns (`NUMERIC(12,2)` restricted via RLS):
      - `actual_cost NUMERIC(12,2) DEFAULT 0.00`
      - `quote_price NUMERIC(12,2) DEFAULT 0.00`
      - `pre_tax_amount NUMERIC(12,2) DEFAULT 0.00`
      - `gst_amount NUMERIC(12,2) DEFAULT 0.00`
      - `profit NUMERIC(12,2) DEFAULT 0.00`
    - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
    - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- **Atomic Concurrency Trigger:**
  - `BEFORE INSERT` trigger on `workspace_trips` locks the sequence counter with `SELECT last_val FROM public.deal_id_sequences WHERE deal_channel = NEW.deal_channel AND year = v_year FOR UPDATE`.
  - Increments atomically, computes `deal_reference_id`, and guarantees zero collisions even under parallel API calls.

#### `US-151-02`: Smart Mobile Lookup & Existing Customer Linking
- **Functional Description:** In the portal `+ Add Client` intake modal, entering a mobile number triggers a debounced lookup against `workspace_customers.primary_mobile` and `secondary_mobile`.
- **Acceptance Criteria:**
  - When an existing mobile is detected, an amber callout shows: `Returning Customer: [Name] ([customer_code]) — [N] prior trips`.
  - Staff can choose **"Link New Trip to Existing Customer"** (pre-fills customer ID) or create an entirely new customer.
  - `customer_code` and `deal_reference_id` are never input fields in the modal.
  - Submitting a brand-new customer atomically inserts into both `workspace_customers` and `workspace_trips`.

#### `US-151-03`: Production QA Data Purge & Sequence Initialization
- **Acceptance Criteria:**
  - Purges all 17 QA test travellers (`QA Test Traveller`, `Test User`, `@example.com`) and associated child rows.
  - Does NOT delete active staff accounts in `workspace_users` or `auth.users`.
  - Resets `customer_code_seq` to start at `100` (`CUST-00100`).
  - Initializes `deal_id_sequences` cleanly.

#### `US-151-04`: Google Sheets Historical Data Ingestion
- **Acceptance Criteria:**
  - Ingestion CLI supporting `--dry-run` and `--execute`.
  - Deduplicates overlapping records between `Archive` and `2026` tabs (`DDSMV - 069` through `089` and `VDSMV-012`), favoring `2026` tab data.
  - Cleans Unicode directional marks (`\u202c`, `\u202a`) and splits dual phone numbers.
  - Normalizes Pax (e.g. `"4+2"` $\rightarrow$ adults: 4, children: 2).
  - Sanitizes all text fields against the brand tone mandate (zero occurrences of the forbidden word).
  - Syncs `deal_id_sequences` to `MAX(sequence)` so subsequent additions increment seamlessly.

---

### Pillar B: Internal Team Workspace Profile (`/portal/profile`)

#### `US-151-05`: Advisor Atelier Schema & Database-Enforced Governance Locks
- **Editable Advisor Atelier Fields:**
  - First Name, Last Name, Advisor Professional Title, Department/Desk, Regional Destination Specializations (tags), Spoken Languages (tags), Signature Journey Archetype, Client-Facing Bio/Quote, Timezone & Working Hours, Emergency Standby Contact.
- **Locked Governance Fields:**
  - Company Email, Registered Mobile Number (OTP challenge target), Role/Permission Tier.
  - Render with lock icons and governance tooltips directing users to contact `super_admin`.
  - Backed by a PostgreSQL `BEFORE UPDATE` trigger preventing non-`super_admin` modification of these 3 columns.

#### `US-151-06`: Studio Portrait Upload & Curated Executive SVG Avatars
- **Custom Photo Upload:**
  - Client-side crop to `1:1` square, EXIF stripped, compressed to `400×400` WebP (`≤ 500 KB`).
  - Stored in Supabase Storage bucket `staff-avatars` with owner RLS (`auth.uid() = owner_id`).
- **Executive SVG Avatar Suite (4 Presets):**
  1. *Monogram Crest*: Dynamic initials with artisanal gold/amber styling.
  2. *Compass Rose*: Navigational compass motif for journey directors.
  3. *Chinar Leaf*: Slow-travel autumnal flora motif.
  4. *Horizon Contour*: Minimalist topographic slow-travel contour.

#### `US-151-07`: In-Place Permanent Password Rotation
- **Acceptance Criteria:**
  - Verifies existing password, validates new password strength (min 12 chars, upper, lower, number, symbol).
  - Updates password via Supabase Auth and updates `requires_password_change = false`.
  - Refreshes session tokens without breaking `BOUND-01`.

---

### Pillar C: Portal Look & Feel Refresh + Global Theme Switcher

#### `US-151-08`: Dusk Horizon Editorial Split & Sunset Horizon Obsidian Dual-Mode Tokens
- **Legacy Brown Purge:** Zero occurrences of `#2A211C` or `#362B25` in portal styles.
- **Light Mode (`Dusk Horizon Editorial Split`):**
  - Top header: Anchored Sunset Horizon Dark (`#0E0D0C`) with Amber `#F5951C` indicators.
  - Canvas: Warm Alabaster (`#FAF8F5`).
  - Cards: Pure Crisp Ivory (`#FFFFFF`) with Stone hairline borders (`#E6E1D8`).
  - Typography: Deep Charcoal Ink (`#181614`).
- **Dark Mode (`Sunset Horizon Obsidian`):**
  - Top header: Deep Obsidian (`#09090B`).
  - Canvas: Carbon Obsidian (`#0D0C0B`) with subtle radial sunset glow.
  - Cards: Frosted Charcoal (`rgba(22, 21, 20, 0.82)`) with subtle amber borders (`rgba(255, 250, 240, 0.09)`).
  - Typography: Warm Ivory (`#F5F2EB`).
- **Accessibility:** All UI components achieve WCAG AA contrast (`≥ 4.5:1`).

#### `US-151-09`: Global Theme Switcher
- **Acceptance Criteria:**
  - Tri-state toggle (`Light / Dark / System`) in Public Navbar, Portal Header, and `/portal/profile`.
  - Persisted in `localStorage` under `smv_theme_preference`.
  - Zero FOUC guaranteed by blocking inline script in root layout `<head>`.
  - 100% decoupled from user auth (`BOUND-01`).

---

## 4. Google Sheets (`SMV - One Tracker.xlsx`) Ingestion Matrix

| Source Tracker Column | Target Supabase Table | Target Column | Transformation Rule |
| :--- | :--- | :--- | :--- |
| *(Auto-Generated)* | `workspace_customers` | `customer_code` | Auto-sequenced `CUST-00100` onward. |
| `SMV Number` | `workspace_trips` | `deal_reference_id` | Normalized format `DDSMV-YY-XXX` / `VDSMV-YY-XXX`. |
| `Direct Deal / Vendor Deal` | `workspace_trips` | `deal_channel` | `'Direct Deal'` $\rightarrow$ `'DIRECT'`, `'Vendor Deal'` $\rightarrow$ `'VENDOR'`. |
| `Name` | `workspace_customers` | `primary_name` | Trimmed; placeholder names flagged. |
| `Mobile` | `workspace_customers` | `primary_mobile` / `secondary_mobile` | Cleaned of Unicode & spaces; E.164 normalized; dual numbers split. |
| `Email ID` | `workspace_customers` | `primary_email` | Trimmed, lowercase, nullable. |
| `Email in Zoho` | `workspace_customers` | `zoho_synced` | Boolean (`true`/`false`). |
| `Leads through` | `workspace_trips` | `lead_owner_id` | Mapped to staff user UUIDs (`Vivek`, `Dinesh`, `Anand`, `Keerthi`). |
| `Solo / Family / Group` | `workspace_trips` | `travel_party_type` | Mapped to enum (`'Solo'`, `'Family'`, `'Group'`, `'Corporate'`, `'Other'`). |
| `Pax` | `workspace_trips` | `pax_adults`, `pax_children` | `"4+2"` parsed to `4` adults, `2` children; `"2"` to `2` adults. |
| `Destination` | `workspace_trips` | `destination` | Cleaned destination string. |
| `Year`, `Month`, `Duration` | `workspace_trips` | `travel_year`, `travel_month`, `duration_label`, `nights` | Parsed into year, month, and integer nights. |
| `Status`, `Status of Payment`, `Trip Status` | `workspace_trips` | `deal_stage`, `payment_status`, `trip_status` | Mapped to 3-track operational status enums. |
| `Booked Place`, `Booked Cab` | `workspace_trips` | `booked_properties`, `booked_transport` | Stored as logistics metadata. |
| `Actual PriceTotal`, `Our Price Total`, `Price before Tax`, `GST`, `Profit` | `workspace_trips` | `actual_cost`, `quote_price`, `pre_tax_amount`, `gst_amount`, `profit` | Cleaned floats as `NUMERIC(12,2)`. RLS restricted. |
| `Comments` | `workspace_trips` | `notes` | Sanitized to remove prohibited terms. |
