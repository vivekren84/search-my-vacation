# Search My Vacation (SMV) — Release 1.5.3 Master Requirements & Architecture Specification

- **Document Version:** 1.0 (Approved Requirements Baseline)
- **Release Stream:** Release 1.5.3 — Portal Light Mode Contrast, Full CRUD Completeness, Financial Approval Queue & Itinerary Persistence
- **Primary Stakeholder:** Vivek Renganathan (`super_admin` / Owner — `vivek@searchmyvacation.com`)
- **Milestone Structure:**
  - **Milestone 1 (Immediate):** Light Mode Contrast Remediation, Trip/Customer/Staff Edit CRUD, Privilege User Financial Access, Desk User Financial Approval Queue, and 5% Margin-Inclusive GST Auto-Calculation.
  - **Milestone 2 (Follow-Up in R1.5.3):** Bespoke Itinerary Builder DB Persistence (`workspace_itineraries`, days, segments, margin overrides, proposal exports).
- **Non-Negotiable System Guardrails:**
  1. **Brand Tone Mandate:** Strictly **ZERO** occurrences of the prohibited term across all code, UI copy, database metadata, comments, documentation, and data. Permitted terms: *bespoke, high-touch, slow-travel, artisanal, premier, curated*.
  2. **Decoupling Boundary (`BOUND-01`):** Public customer conversion flows (`/journey-passport`, `/journey-director`) must remain 100% passwordless and decoupled from internal staff authentication.

---

## 1. Executive Summary & Architectural Purpose

Release 1.5.3 closes every remaining UI contrast and CRUD/lifecycle gap identified in the post-R1.5.2 internal staff portal audit:

1. **Milestone 1 — Portal Completeness & Financial Governance:**
   - Eliminates all Light Mode contrast defects in `/portal/dashboard` (Itinerary & Margin Engine tab, Team Governance tab, Modals 1–3, and the persistent Concierge Intelligence Radar).
   - Delivers full **Edit** capabilities across **Trips & Deals** (including `DDSMV-26-154` and all journeys), **Operations Kanban & Active Vouchers Hub** (quick-edit), **Customer Master** (`CUST-XXXXX`), and **Team Governance** (staff display name & registered mobile).
   - Implements the PO-approved **5% Margin-Inclusive GST & Net Profit Auto-Calculation** (`Formula 1`) and **Financial RBAC + Single-Concurrence Approval Queue** for future `desk_user` financial proposals.
2. **Milestone 2 — Itinerary Builder Database Persistence:**
   - Replaces the static demo itinerary in the **Itinerary & Margin Engine** tab with live Supabase CRUD wired to `workspace_itineraries`, `workspace_itinerary_days`, `workspace_itinerary_segments`, `workspace_margin_overrides`, and `workspace_proposal_versions`.

---

## 2. Epic & User Story Backlog Matrix

| Story ID | Milestone / Area | Requirement Title | Disposition | Priority | Architectural Layer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US-153-01** | M1: Light Mode Contrast | Dashboard Light Mode Contrast Remediation (Itinerary, Governance, Modals 1–3, Radar) | New (PO) | High | Next.js / Tailwind CSS |
| **US-153-02** | M1: CRM Trip & Voucher CRUD | Edit Trip Deal Modal & `PATCH /api/portal/crm/trips` (incl. Kanban & Voucher Quick-Edit) | New (PO) | High | Next.js Client + API |
| **US-153-03** | M1: Financial Governance | 5% Margin-Inclusive GST & Net Profit Auto-Calculation Engine (Formula 1) | New (PO) | High | Next.js Client + API |
| **US-153-04** | M1: Financial RBAC & Queue | Privilege User Financial Access + Desk User Financial Proposal & Single-Approval Queue | New (PO) | High | PostgreSQL + Next.js |
| **US-153-05** | M1: Customer Master CRUD | Edit Customer Master Modal & `PATCH /api/portal/crm/customers` | New (PO) | High | Next.js Client + API |
| **US-153-06** | M1: Team Governance CRUD | Edit Staff Member Details (`display_name` & `registered_mobile`) | New (PO) | Medium | Next.js Client + Auth API |
| **US-153-07** | M2: Itinerary Builder Persistence | Bespoke Itinerary Builder, Day/Segment Pricing, Margin Overrides & Proposal Export DB Wiring | New (PO) | Medium | PostgreSQL + Next.js |

---

## 3. Detailed Specifications & Acceptance Criteria

### Milestone 1 — Portal Completeness, Light Mode & Financial Governance

#### `US-153-01`: Dashboard Light Mode Contrast Remediation
- **Scope & Functional Intent:** Replace all unprefixed dark-only classes (`text-white`, `text-white/40..80`, `bg-white/5`, `bg-black/30`, `border-white/20`, `placeholder-white/*`) on light surfaces in `web/app/portal/dashboard/page.tsx` with proper Slate/Obsidian Light & Dark pairs (`text-[#0F172A] dark:text-white`, `text-[#475569] dark:text-zinc-400`, `border-[#CBD5E1] dark:border-white/10`, `bg-[#F8FAFC] dark:bg-[#09090B]`).
- **Covered Areas:**
  1. Itinerary & Margin Engine tab (`L2384-L2544`)
  2. Team Governance tab (`L2547-L2772`)
  3. Modal 1: Invite Team Member (`L2778-L2943`)
  4. Modal 2: Claude Studio & Sync (`L2945-L3185`)
  5. Modal 3: Add New Client Dossier (`L3186-L3545`)
  6. Persistent Concierge Intelligence Radar — minimized pill & expanded dock (`L3838-L3949`)
- **Acceptance Criteria:** Every label, heading, input, placeholder, badge, and floating dock card is crisp and legible in both Light Mode and Dark Mode.

#### `US-153-02`: Edit Trip Deal Modal & `PATCH /api/portal/crm/trips`
- **Scope & Functional Intent:** Allow authorized staff to edit any existing trip deal (including `DDSMV-26-154` and all imported tracker records) from **CRM → Trips & Deals** as well as quick-edit directly from **Operations & Kanban** cards and **Active Vouchers Hub** cards.
- **Editable Fields:**
  - `destination`, `travel_year`, `travel_month`, `duration_label`, `nights`, `travel_party_type`, `pax_adults`, `pax_children`, `lead_owner_id`
  - `deal_stage` (`Enquiry`, `In Progress`, `Booked/Won`, `Lost`, `On Hold`)
  - `payment_status` (`To Start`, `In Progress`, `Won`, `Lost`, `On Hold`)
  - `trip_status` (`To Start`, `In Progress`, `Complete`, `Lost`, `On Hold`)
  - `booked_properties`, `booked_transport`, `notes`
  - Financials: `quote_price`, `actual_cost`, `pre_tax_amount`, `gst_amount`, `profit`
- **Dependencies & Guardrails:** Immutable `deal_reference_id` and `customer_code`. Enforces Brand Tone Guardrail (prohibited terminology rejected with `400`).
- **Acceptance Criteria:** Saving updates `public.workspace_trips`, refreshes `crmTrips`, and dynamically updates the CRM card, 5-column Kanban stage, and Active Vouchers Hub.

#### `US-153-03`: 5% Margin-Inclusive GST & Net Profit Auto-Calculation (Formula 1)
- **Scope & Functional Intent:** In the Edit Trip modal (with an auto-calculate helper and manual override capability), compute GST and Profit using SMV's margin-inclusive 5% GST model:
  - `Gross Margin (incl. GST)` = `quote_price - actual_cost`
  - `GST (5% inside margin)` = `gross_margin - (gross_margin / 1.05)` (e.g., for ₹20,000 margin → ₹952.38 GST; for ₹40,000 margin → ₹1,904.76 GST)
  - `Net Profit (excl. GST)` = `gross_margin / 1.05` (e.g., ₹19,047.62 on ₹20,000 margin)
  - `Pre-Tax Amount` = `quote_price - gst_amount`
- **Acceptance Criteria:** Entering `quote_price` and `actual_cost` auto-populates `gst_amount`, `profit`, and `pre_tax_amount` per Formula 1, while allowing manual overrides when needed for exact invoice reconciliation.

#### `US-153-04`: Privilege User Financial Access + Desk User Financial Approval Queue
- **Scope & Functional Intent:**
  1. Grant `privilege_user` (Anand, Dinesh, Keerthi) full read & direct write access to trip financials alongside `administrator` and `super_admin` (ensure Anand's account is `privilege_user`).
  2. For future `desk_user` accounts: allow entering/proposing trip financial updates (`quote_price`, `actual_cost`, `pre_tax_amount`, `gst_amount`, `profit`), which are stored in a **Pending Financial Approval Queue** rather than immediately overwriting finalized trip financials.
  3. **Single-Concurrence Approval:** Any **one** `privilege_user`, `administrator`, or `super_admin` can Approve (or Reject with review notes). Upon approval by any single reviewer, the trip's financials are updated live, the request is marked `approved` (with `reviewed_by` & `reviewed_at`), and it **immediately clears from all reviewers' pending queues** to prevent duplicate approvals.
- **Acceptance Criteria:**
  - `privilege_user`, `administrator`, and `super_admin` edits persist immediately to `workspace_trips`.
  - `desk_user` financial edits create a `pending` record; non-financial edits (`booked_properties`, `booked_transport`, `notes`, etc.) save directly.
  - Once one authorized reviewer approves/rejects, the item disappears from the pending queue for all other reviewers.

#### `US-153-05`: Edit Customer Master Modal & `PATCH /api/portal/crm/customers`
- **Scope & Functional Intent:** Add an Edit button and modal on **CRM → Customer Master** cards to update `primary_name`, `primary_mobile`, `secondary_mobile`, `primary_email`, and `needs_contact_enrichment`.
- **Dependencies & Guardrails:** `customer_code` (`CUST-XXXXX`) is immutable. Handles `idx_workspace_customers_primary_mobile` unique index conflicts cleanly (`409` with clear message).
- **Acceptance Criteria:** Staff can enrich or correct customer contact details and see updates immediately across both Customer Master and linked Trips.

#### `US-153-06`: Edit Staff Member Details in Team Governance
- **Scope & Functional Intent:** Allow `super_admin` and `administrator` to edit an existing staff member's `display_name` and `registered_mobile` via an Edit button on Team Governance cards, backed by `PATCH /api/portal/auth/invite` (syncing `workspace_users` and `auth.users`).
- **Acceptance Criteria:** Staff display name and registered E.164 mobile update cleanly without requiring manual SQL migrations.

---

### Milestone 2 — Itinerary Builder Database Persistence

#### `US-153-07`: Bespoke Itinerary Builder & Proposal Export DB Wiring
- **Scope & Functional Intent:** Wire the **Itinerary & Margin Engine** tab to live Supabase persistence using the existing M3 schema (`workspace_itineraries`, `workspace_itinerary_days`, `workspace_itinerary_segments`, `workspace_margin_overrides`, `workspace_proposal_versions`).
- **Acceptance Criteria:**
  - Advisors can create, edit, and save multi-day itineraries linked to a customer/trip.
  - Line-item segments calculate net cost, markup, GST, and gross selling price dynamically.
  - `Export Proposal (v1.0)` generates a persisted `workspace_proposal_versions` snapshot and white-label export stripping supplier vendor names, net costs, and markup percentages (`US-010`).
