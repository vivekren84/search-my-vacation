# Search My Vacation (SMV) — Release 1.5.5 Requirements Specification
## Operations Automation, Concierge Radar Overhaul, CRM Hygiene, Passport Intelligence & Brand Copy Sweep

- **Document Version:** 1.1 (Updated with EPIC 7 & EPIC 8)
- **Target Git Branch:** `feature/release-1.5.5-ops-radar-crm-hygiene` (branched from `main` @ `db9b018`)
- **Primary Stakeholder:** Vivek Renganathan (`super_admin` — `vivek@searchmyvacation.com`)
- **Roles Governed:** `super_admin`, `administrator`, `privilege_user`, `desk_user`
- **Brand Tone Mandate:** Strictly **ZERO** occurrences of the prohibited term (`l***ry`) across all code, UI labels, database objects, documentation, and client-facing outputs. Use *bespoke, curated, high-touch, artisanal, slow-travel, premier*.
- **Architectural Boundary (`BOUND-01`):** Public customer conversion flows (`/journey-passport`, `/journey-director`) must remain 100% passwordless and completely decoupled from internal staff authentication.

---

## 1. Executive Summary & Milestone Roadmap

| Milestone | Branch | Epics Included | Status |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | `feature/r1.5.5-m1-db-hygiene` | EPIC 1.2 (Backend/IST Yearly Trip ID), EPIC 6.1 (Multi-Contact JSONB), EPIC 6.2 (`destinations` Master & Normalization), EPIC 6.3 (Vendor GST Columns) | **Done & Merged to `R1.5.5`** |
| **Milestone 2** | `feature/r1.5.5-m2-ops-automation` | EPIC 1.1 (Auto-Promotion `Booked/Won` → `In Travel` via `pg_cron` + Hydration Sync + Controlled Rollback) | Pending |
| **Milestone 3** | `feature/r1.5.5-m3-radar-clock` | EPIC 2 (Concierge Radar Viewport Clamp, Drag/Reset, 14d Live Feed, Destination Search) + EPIC 3 (Live Destination Clock) | Pending |
| **Milestone 4** | `feature/r1.5.5-m4-crm-export-gst` | EPIC 1.2 UI (Trip ID Preview), EPIC 4 (Excel `.xlsx` Export), EPIC 6 UI (Destination Autocomplete, Multi-Contact Editors, Zoho GST CSV Sync) | Pending |
| **Milestone 5** | `feature/r1.5.5-m5-login-qa` | EPIC 5 (Split-Layout Sign-In), **EPIC 7 (Passport Journey Destination-First Intelligence & `regional_circuits`)**, **EPIC 8 (Brand Copy Hygiene: `Atelier` / `Bespoke`)**, Multi-Viewport QA | Pending |

---

## 2. Detailed Epics & Requirements

### EPIC 1: Operations Pipeline Automation & Trip ID Governance
* **1.1 Automated Stage Transition (`Booked/Won` → `In Travel`) & Controlled Rollback:**
  * Dual-layer execution: `pg_cron` daily at `00:05 IST` (`35 18 * * *` UTC) + `/portal/dashboard` hydration sync calling `promote_due_trips_to_in_travel()`, logging `'System Automation'` to `workspace_trip_events`.
  * Controlled rollback (`In Travel` → `Booked/Won`) restricted to `lead_owner_id` or `super_admin`, requiring confirmation modal with optional `Revised Start Date` and mandatory `Postponement Reason`.
* **1.2 Auto-Incrementing Yearly Trip ID Generator (`DDSMV-YY-XXX` / `VDSMV-YY-XXX`):**
  * `YY` derived from `Asia/Kolkata` creation year (resets `001` each Jan 1 IST); expands cleanly to 4+ digits if `>999`; historical trips untouched; live non-authoritative preview in `+ New Journey`.

### EPIC 2: Concierge Radar Overhaul
* **2.1–2.2:** Persist `{ right, bottom }` in `localStorage` (`smv_radar_pos_r155`), enforce viewport boundary clamp on mount/`resize`/`expand()`, pointer-event header drag, and `Reset Position` button.
* **2.3:** Live Active & Departing `<= 14` Days feed (`In Travel` + `Booked/Won` within 14d IST) with Trip ID, client, destination, status pill, readiness badge, and owner initials.
* **2.4:** Instant destination search + `Search "{query}" in Radar` dynamic lookup across `destinations`, `workspace_vendors`, and `workspace_trips`.

### EPIC 3: Trip Detail Header — Live Destination Clock
* **3.1:** `useDestinationClock(destinationName)` using `destinations.iana_timezone` + frontend fallback map, refreshing every 30s inline in `JourneyDetailDrawer` header (gracefully omitted if unmapped).

### EPIC 4: Trip Data Export Engine (`.xlsx`)
* **4.1:** `Export Excel` button strictly for `privilege_user`, `administrator`, and `super_admin` (`desk_user` excluded). Supports status multi-select (`Select All`), `Travel Start Date` vs `Enquiry Created Date`, Custom range `<= 365` days validation, Month / Quarter / FY or CY Year, generating `SMV_Trips_Export_<Tenure>_<YYYYMMDD>.xlsx`.

### EPIC 5: Sign-In Page Redesign (Split Layout)
* **5.1:** 12-column desktop split (`col-span-7/8` Left Editorial Showcase backed by `portal_login_banners` + `col-span-5/4` Right Auth Card with Dusk Light/Dark parity and zero prohibited vocabulary).

### EPIC 6: CRM & Vendor Data Hygiene, Multi-Contact Schema & Zoho Books GST Sync
* **6.1:** Multi-contact JSONB (`0–5` vendor contacts, `0–2` customer contacts, all optional) with clickable `mailto:`, `tel:`, WhatsApp, and copy-to-clipboard actions.
* **6.2:** `public.destinations` canonical master (`Vizag`, `Mangaluru`, `Mysuru`, `Bengaluru`, `Sri Lanka`, `Dharamshala`, etc.), historical normalization, and client + advisor validation before DB writes.
* **6.3:** `gst_number`, `gst_treatment`, `zoho_contact_id` on `workspace_vendors` + `Import GST from Zoho CSV` (`super_admin` & `administrator`) with 3-tier matching and Dry-Run Preview Modal.

### EPIC 7: Passport Journey — Destination-First Intelligence & Regional Circuit Engine *(Added in M5)*
* **7.1 Root Cause:** Explicit destination inputs (e.g., `Dalhousie`, `Kumbhalgarh`) were previously overridden by traveler persona/archetype defaults (returning Rishikesh/Manali).
* **7.2 Strict Destination-First Hierarchy:**
  * **Rule 1 (Explicit Destination Lock):** 100% of `TOP RECOMMENDED REGIONAL CIRCUITS` must anchor around the selected destination or its immediate parent state/region; persona only shapes pacing, stay curation, and activity tags.
  * **Rule 2 (`regional_circuits` Master Table):** Linked to canonical `destinations` with `circuit_title`, `state_or_country`, `subtitle`, `indicative_days`, `anchor_destinations TEXT[]`, `compatible_personas TEXT[]`, `is_active`. Mandatory seeds for Himachal Pradesh (`Dharamshala, Dalhousie & Kangra Valley Circuit`, `Shimla, Kinnaur & Spiti / Kullu-Manali Alpine Corridor`), Rajasthan (`Udaipur, Kumbhalgarh & Aravalli Sanctuary Circuit`, `Jaipur, Jodhpur & Thar Heritage Trail`), and active domestic/international destinations.
  * **Rule 3 (3-Tier Matching & Safe Fallback Cascade):** Tier 1 exact/alias `anchor_destinations` match sorted by persona affinity → Tier 2 same `state_or_country` fill → Tier 3 dynamic synthesis (`"{User_Destination} & Surrounding Bespoke Circuit"`), never unrelated global defaults.
* **7.3 Acceptance Criteria:** `Dalhousie` → Western Himachal first; `Kumbhalgarh` → Aravalli/Rajasthan first with zero Himalayan circuits; "Surprise Me / Open to Suggestions" continues persona/mood-based recommendations; zero prohibited vocabulary.

### EPIC 8: Brand Copy & Vocabulary Hygiene Sweep *(Added in M5)*
* **8.1 Scope:** Fix prior rewrite artifacts across public pages, Passport Journey, portal UI, and DB seed/dynamic content:
  * `Aetelier` / `aetelier` / `AETELIER` → **`Atelier`** / **`atelier`** / **`ATELIER`**
  * `Bespoken` / `bespoken` / `BESPOKEN` → **`Bespoke`** / **`bespoke`** / **`BESPOKE`**
* **8.2 Editorial Refinement:** Vary repetitive `Atelier`/`Bespoke` phrasing naturally (`Curation Studio`, `Journey Design Desk`, `Tailored`, `Custom-Crafted`, `Made-to-Measure`, `Handpicked`, `Signature`, `Heritage`, `Boutique`, `Intimate`, `High-Touch`).
* **8.3 Acceptance Criteria:** Case-insensitive repo & DB audit returns `0` matches for `aetelier`, `bespoken`, and the prohibited term in user-facing UI and seed data.
