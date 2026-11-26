# Search My Vacation (SMV) — Release 1.5.4 Requirements Specification
## End-to-End Journey Creation, Lifecycle Maintenance & Stage Governance

- **Document Version:** 1.0 (Frozen Release Baseline)
- **Target Git Branch:** `feature/release-1.5.4-journey-lifecycle` (branched from `release/r1.5.4` / verified `R1.5.3`)
- **Primary Stakeholder:** Vivek Renganathan (`super_admin` — `vivek@searchmyvacation.com`)
- **Brand Tone Mandate:** Strictly **ZERO** occurrences of the prohibited term across all code, UI labels, database objects, documentation, and client-facing outputs. Use *bespoke, high-touch, slow-travel, artisanal, premier, curated*.
- **Architectural Boundary (`BOUND-01`):** Public customer conversion flows (`/journey-passport`, `/journey-director`) must remain 100% passwordless and completely decoupled from internal staff authentication.

---

## 1. Executive Summary & Architectural Goals
While Releases `1.5.1`–`1.5.3` established the Customer Master (`CUST-XXXXX`), Deal ID sequencing (`DDSMV-YY-XXX` / `VDSMV-YY-XXX`), Financial Approval Queue (`US-153-04`), and Itinerary Builder (`US-153-07`), operations require a dedicated **Journey Creation & Lifecycle Management Engine**. Release `1.5.4` decouples **Customer Onboarding** from **Journey Initiation**, introduces structured stage-gate controls, multi-tranche payment tracking, white-labeled supplier allocations, and an immutable operational audit trail.

---

## 2. Phased Release Plan Overview

| Story ID | Phase | User Story Title | Priority | Primary Layer |
| :--- | :--- | :--- | :--- | :--- |
| **US-154-01** | Phase 1: Creation & Navigation | Dedicated `+ New Journey` Modal (Existing Customer + Inline Quick-Create) | High | Next.js UI + Supabase RPC |
| **US-154-02** | Phase 1: Creation & Navigation | Unified Journey Detail Drawer, Clone Journey & Folder Slug Copy | High | Next.js Drawer + DB |
| **US-154-10** | Phase 1: Creation & Navigation | Operational Quick-Filters (`Departing 14d`, `Balance Due`) & Omni-Search | Medium | CRM Trips & Kanban UI |
| **US-154-03** | Phase 2: Lifecycle & Commercials | Guided Stage Progression, Kanban Gates, Hold Reminders & Re-Open | High | Kanban + Concierge Radar |
| **US-154-04** | Phase 2: Lifecycle & Commercials | Post-Booking Scope Amendments & Cancellation / Refund Workflow | High | Commercials + `US-153-04` |
| **US-154-05** | Phase 2: Lifecycle & Commercials | Multi-Tranche Payment Receipt Ledger & Auto-Balance Sync | High | `workspace_trip_payments` |
| **US-154-06** | Phase 3: Operations & Governance | Structured Stay, Cab & Supplier Allocation Ledger (White-Labeled) | High | `workspace_trip_bookings` |
| **US-154-07** | Phase 3: Operations & Governance | Co-Traveller Roster & Private Journey Document Vault | Medium | Storage + Companions |
| **US-154-08** | Phase 3: Operations & Governance | 6-Point Pre-Departure Readiness Checklist & Voucher Publisher | Medium | Vouchers Hub Integration |
| **US-154-09** | Phase 3: Operations & Governance | Immutable Journey Activity Timeline & Pinned Handoff Notes | Medium | `workspace_trip_events` |

---

## 3. Detailed User Stories & Acceptance Criteria

### Phase 1: Journey Creation, Discovery & Pipeline Navigation

#### `US-154-01`: Dedicated `+ New Journey` Modal with Inline Customer Lookup & Quick-Create
* **User Story:** As an **Advisor or Desk User**, I want a dedicated **`+ New Journey`** action across the CRM Header, 5-Column Kanban Board, and Customer Master rows so I can initiate a new journey (`DDSMV-YY-XXX` or `VDSMV-YY-XXX`) for an existing customer in under 30 seconds or quick-create a new lead without abandoning the modal.
* **Functional & Technical Scope:**
  * **3 Entry Points:**
    1. *Customer Master Row / Drawer:* Pre-selects and locks `customer_id` (`CUST-XXXXX` + Name + Mobile).
    2. *CRM Trips Tab & 5-Column Kanban Header:* Opens a searchable Customer Typeahead (`Name`, `Mobile`, or `CUST-XXXXX`) with a collapsible **`+ New Customer`** section.
    3. *Itinerary & Margin Engine (`US-153-07`):* Allows spinning up a journey shell directly from a bespoke itinerary draft.
  * **Intake Fields:** Deal Channel (`Direct Deal` vs. `Vendor / Event Partner`), Trip Scope (`Domestic` vs. `International`), Destination(s), Travel Window (Exact `Start/End Dates` OR `Tentative Month + Year` + `Nights/Days`), Party Type (`Solo / Family / Group`), Pax Split (`Adults` + `Children` + optional child ages), Lead Source (`Referral`, `Instagram`, `Repeat Client`, `Website`, `Partner`), Lead Owner (defaults to logged-in staff), and Intake Notes.
  * **Backend:** Atomic RPC `create_journey_with_optional_customer` computes `DDSMV-YY-XXX` / `VDSMV-YY-XXX` via `deal_id_sequences` (`SELECT ... FOR UPDATE`) and writes a `JOURNEY_CREATED` audit event.
* **Acceptance Criteria:**
  * [ ] Creating a journey from an existing customer links to their `CUST-XXXXX` master record without creating duplicate customer rows.
  * [ ] Inline `+ New Customer` normalizes mobile numbers to E.164 and surfaces an inline duplicate prompt (`HTTP 409`) if the mobile number already exists.
  * [ ] `deal_reference_id` and `customer_code` are never manually entered in the UI and are rejected if passed in client payloads.
  * [ ] Zero occurrences of the prohibited term across modal copy, placeholders, and database enums.

#### `US-154-02`: Unified Journey Detail Drawer, Clone Journey & Folder Slug Copy
* **User Story:** As an **Advisor**, I want a slide-over **Journey Workspace Drawer** when clicking any `DDSMV`/`VDSMV` badge so I can inspect and maintain itinerary versions, vendor allocations, payments, companions, and audit logs in one view.
* **Functional & Technical Scope:**
  * **Sticky Drawer Header:** Immutable `DDSMV-YY-XXX` & `CUST-XXXXX` badges, one-click WhatsApp/Call link, **Copy Folder Slug** button (`DDSMV-26-083 | Vietnam | Senthu Chandran`), Lead Owner selector, and interactive **Stage Stepper**.
  * **6 Tabbed Panes:** (1) Overview & Commercials, (2) Itinerary & Proposals (`US-153-07` bridge), (3) Stays, Transport & Bookings (`US-154-06`), (4) Payments & Tranches (`US-154-05`), (5) Travellers & Documents (`US-154-07`), (6) Activity & Audit Log (`US-154-09`).
  * **Quick Maintenance Actions:** **Clone Journey** (duplicates destination, pax, and itinerary structure into a fresh `DDSMV-YY-XXX` for multi-quote comparisons or repeat travel), **Reassign Lead Owner** (with mandatory handoff note), and **Archive/Void Entry** (`super_admin` / `administrator` only).
* **Acceptance Criteria:**
  * [ ] Drawer opens smoothly from CRM, Kanban, Customer Master, or Vouchers Hub without losing background table filters or scroll state.
  * [ ] **Copy Folder Slug** copies standardized `DDSMV-YY-XXX | Destination | Client Name` to clipboard with toast feedback.
  * [ ] **Clone Journey** creates a sequential Deal ID, sets `cloned_from_trip_id`, and resets pipeline stages to `In Progress` / `To Start`.

#### `US-154-10`: Operational Quick-Filters & Omni-Search
* **User Story:** As an **Advisor or Operations Lead**, I want one-click operational filter pills and instant omni-search across CRM Trips and Kanban so I can prioritize urgent departures, overdue balances, and pending follow-ups.
* **Acceptance Criteria:**
  * [ ] Quick-filter pills include: **My Journeys**, **Departing Next 14 Days**, **Payment Due**, **On Hold (Follow-Up Due)**, **Domestic vs. International**, and **Year (`2025 / 2026 / 2027`)**.
  * [ ] Omni-search matches `DDSMV-YY-XXX`, `VDSMV-YY-XXX`, `CUST-XXXXX`, Customer Name, Mobile, or Destination in `< 300ms`.

---

### Phase 2: Stage Progression, Commercials & Cancellation Governance

#### `US-154-03`: Guided Stage Progression, Kanban Drag-and-Drop & Stage Gate Validations
* **User Story:** As an **Advisor or Operations Lead**, I want stage transitions across the Kanban board and Journey Stepper to enforce essential commercial and date validations while capturing structured Hold/Loss reasons.
* **Functional & Technical Scope:**
  * **Pipeline States:** `In Progress` $\leftrightarrow$ `On Hold` $\rightarrow$ `Booked/Won` $\rightarrow$ `Complete` | Terminal exits: `Lost` (pre-booking) or `Cancelled` (post-booking).
  * **Stage-Gate Rules:**
    * $\rightarrow$ **`Booked/Won`**: Validates `quote_price > 0` and confirmed `travel_start_date` / `duration`; prompts for initial advance payment (`US-154-05`) and auto-initializes the 6-Point Readiness Checklist (`US-154-08`) + Active Voucher shell.
    * $\rightarrow$ **`On Hold`**: Requires **Hold Reason** (`Awaiting Dates`, `Budget Review`, `Visa/Flight Check`, `Deferred Season`) + optional **Follow-Up Reminder Date** (surfaced in Concierge Radar).
    * $\rightarrow$ **`Lost`**: Requires **Loss Reason** (`Budget Mismatch`, `Chose Competitor`, `Plan Dropped`, `Unresponsive`, `Chose Alternate SMV Quote`) + note; cascades `payment_status = Lost` and `trip_status = Lost`.
    * $\rightarrow$ **`Complete`**: Checks `trip_end_date` and warns if `balance_due > 0`.
  * **Re-Open Deal:** Allows `privilege_user`+ to re-open `Lost` or `On Hold` deals to `In Progress` with a logged reason, preserving original `DDSMV-YY-XXX`.
* **Acceptance Criteria:**
  * [ ] Incomplete deals cannot move to `Booked/Won` without satisfying commercial and date gates.
  * [ ] `On Hold` follow-up dates surface in the **Concierge Radar** dock on or before due date.
  * [ ] Re-opening a `Lost` deal logs a `STAGE_REOPENED` event in `workspace_trip_events`.

#### `US-154-04`: Post-Booking Scope Amendments & Cancellation / Refund Workflow
* **User Story:** As an **Advisor or Administrator**, I want structured workflows for post-booking scope changes (extra nights, pax additions) and post-booking trip cancellations so baseline financial audit trails remain intact.
* **Acceptance Criteria:**
  * [ ] **Log Amendment (`Booked/Won` trips):** Captures scope delta (`+Quote`, `+Actual Cost`), recalculates Formula 1 GST & Net Profit (`US-153-03`), routes through `US-153-04` approval queue if submitted by a `desk_user`, and logs before/after snapshots.
  * [ ] **Cancel Confirmed Trip (`Booked/Won` $\rightarrow$ `Cancelled`):** Captures **Cancellation Date**, **Reason** (`Medical/Emergency`, `Visa Rejection`, `Force Majeure`, `Client Change of Mind`), **Retained Supplier/Service Fee**, and **Refund Due / Refunded Amount**.
  * [ ] `Cancelled` is cleanly separated from pre-booking `Lost` in CRM filters and revenue analytics.

#### `US-154-05`: Multi-Tranche Payment Receipt Ledger & Auto-Balance Sync
* **User Story:** As an **Advisor or Finance Reviewer**, I want to record multiple payment tranches (Token Advance, 2nd Installment, Final Balance) per journey so `amount_received`, `balance_due`, and `payment_status` stay synchronized automatically.
* **Functional & Technical Scope:**
  * New table `public.workspace_trip_payments`: `id`, `trip_id`, `tranche_label`, `amount_inr`, `payment_mode` (`UPI`, `NEFT/IMPS`, `Card`, `Payment Gateway`, `Cash`), `transaction_ref`, `payment_date`, `due_date`, `verification_status` (`Verified` | `Pending Verification`), `recorded_by`, `verified_by`.
  * RBAC: `desk_user` entries default to `Pending Verification` until approved by `privilege_user`+ (`US-153-04` governance).
* **Acceptance Criteria:**
  * [ ] Recording a verified partial advance automatically sets `workspace_trips.payment_status = 'In Progress'` and displays `₹X Due` on CRM/Kanban cards.
  * [ ] Reaching `balance_due <= 0` automatically flips `payment_status = 'Won'`.

---

### Phase 3: Fulfillment, Vouchers, Companions & Audit Governance

#### `US-154-06`: Structured Stay, Cab & Supplier Allocation Ledger (White-Labeled)
* **User Story:** As an **Operations Lead**, I want structured booking line items for stays, cabs, activities, flights, and visas per journey—with internal DMC/vendor names masked from client-facing vouchers (`US-010`).
* **Functional & Technical Scope:**
  * New table `public.workspace_trip_bookings`: `id`, `trip_id`, `booking_type` (`Stay`, `Transport/Cab`, `Activity/Experience`, `Flight/Rail`, `Visa/Insurance`), `client_facing_title`, `internal_vendor_dmc`, `confirmation_ref`, `start_date`, `end_date`, `booking_status` (`Pending`, `Requested`, `Confirmed`, `Cancelled`), `operational_notes`.
  * Syncs summary strings back to `workspace_trips.booked_properties` and `booked_transport` for backward compatibility.
* **Acceptance Criteria:**
  * [ ] Multiple stays, cabs, and activities can be tracked per journey with individual confirmation numbers.
  * [ ] `internal_vendor_dmc` and `operational_notes` are strictly excluded from client voucher exports.

#### `US-154-07`: Co-Traveller Roster & Private Journey Document Vault
* **User Story:** As an **Advisor**, I want to attach co-travellers (with ages and dietary/accessibility notes) and securely store booking vouchers, tickets, and IDs directly on each journey.
* **Acceptance Criteria:**
  * [ ] Co-travellers from `workspace_client_companions` can be linked to any trip with a single click, including `Lead Traveller` flag and special meal/mobility tags.
  * [ ] Private Supabase Storage bucket (`trip-documents`, staff-only RLS) supports PDF/JPG/PNG uploads categorized by `Hotel Voucher`, `Cab/Transfer`, `Tickets`, `Visa/Insurance`, and `Client ID`, downloadable via signed URLs.

#### `US-154-08`: 6-Point Pre-Departure Readiness Checklist & One-Click Voucher Publisher
* **User Story:** As an **Operations Lead**, I want a standardized 6-point Pre-Departure Checklist on every `Booked/Won` trip and one-click publishing into the Active Vouchers Hub.
* **Acceptance Criteria:**
  * [ ] Auto-initializes 6 items upon `Booked/Won`: (1) Stays Confirmed, (2) Transport/Cab Assigned, (3) Traveller Roster Verified, (4) White-Label Itinerary Exported (`US-153-07`), (5) Payment Settled (`Balance Due == 0`), (6) Voucher Published.
  * [ ] Displays readiness badge (`X/6 Ready`) on CRM and Kanban views; **Publish / Refresh Active Voucher** compiles client-safe bookings and itinerary into the Active Vouchers Hub.

#### `US-154-09`: Immutable Journey Activity Timeline & Pinned Handoff Notes
* **User Story:** As an **Internal Team Member**, I want a chronological, immutable audit log of every stage change, financial amendment, payment, and reassignment on each journey, plus the ability to pin critical handoff alerts.
* **Acceptance Criteria:**
  * [ ] Append-only `public.workspace_trip_events` logs `JOURNEY_CREATED`, `STAGE_CHANGED`, `STAGE_REOPENED`, `AMENDMENT_LOGGED`, `PAYMENT_LOGGED`, `BOOKING_UPDATED`, `LEAD_REASSIGNED`, `CLONED`, `CANCELLED`, and `NOTE_ADDED`.
  * [ ] Advisors can pin up to 2 critical operational notes to the top banner of the Journey Drawer.

---

## 4. Supabase Schema Additions Summary
1. **`public.workspace_trip_payments`** (New): Multi-tranche receipt ledger with verification workflow.
2. **`public.workspace_trip_bookings`** (New): White-labeled stay, cab, activity, flight, and visa confirmation ledger.
3. **`public.workspace_trip_events`** (New): Append-only operational audit timeline.
4. **`public.workspace_trips` (Additive Columns)**: `trip_scope` (`Domestic`/`International`), `lead_source`, `hold_reason`, `loss_reason`, `cancellation_reason`, `cancellation_fee`, `refund_amount`, `follow_up_date`, `cloned_from_trip_id`, `readiness_checklist` (`jsonb`), `pinned_notes` (`jsonb`).
5. **Storage Bucket `trip-documents`**: Private bucket with staff-role RLS and signed-URL downloads.
