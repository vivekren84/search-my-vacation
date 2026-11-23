# Release 1.5 — High-Touch Travel Staff Portal & Advisor Workspace

**Release Theme:** Empower internal Journey Designers, operations desk, and administrators with authenticated access, single-channel Smart OTP, decoupled master client profiles, visual trip lifecycle pipeline, bespoke itinerary/quote builder, and authentic brand storytelling on the site.  
**Total Backlog Items:** 22 (18 Travel Staff Portal User Stories + 4 Public Brand, Growth & Governance Deliverables)  
**Status:** **SIGNED OFF & PRODUCTION VERIFIED (100% COMPLETE)**  
**Sign-Off Stakeholder:** Vivek Renganathan (`super_admin` / Owner) — November 23, 2026  
**Document Reference:** Agile Product Backlog v1.1 & SMV Master Release Charter  

---

## 1. Release Summary & Priority Breakdown

- **Total Scope:** 22 Chartered Items
- **Priority Mix:** High (P0/P1): 12 | Medium (P1): 8 | Low (P2): 2
- **Structure:**
  - **Epic 1: Authentication & Role-Based Access Control (RBAC):** 3 Items (`US-001`, `US-002`, `US-003`) — *absorbs `V-08`, `AUTH-01`, `AUTH-04`*
  - **Epic 2: CRM-Ready Client Profiles:** 3 Items (`US-004`, `US-005`, `US-006`) — *enriches `GAP-04`*
  - **Epic 3: Bespoke Itinerary & Quote Builder:** 4 Items (`US-007`, `US-008`, `US-009`, `US-010`) — *absorbs `GAP-03`*
  - **Epic 4: Operations & Booking Command Center:** 3 Items (`US-011`, `US-012`, `US-013`)
  - **Epic 5: Vendor, Financial & Security Governance:** 4 Items (`US-014`, `US-015`, `US-016`, `US-017`) — *absorbs `AUTH-05`*
  - **Public Brand, Growth & Governance:** 4 Items (`PO-05`, `GAP-05`, `G-02`, `HP-04`)

---

## 2. Traceability & Cross-Reference Mapping

| Original Baseline ID | Area / Phase | New Staff Portal Requirement | Disposition | Mapping Rationale |
| :--- | :--- | :--- | :---: | :--- |
| **`V-08`** | Authentication | **`US-001` / `US-002`** | Absorbed | Internal staff auth strictly separated from future customer accounts (`BOUND-01`). |
| **`AUTH-01`** | Internal Team | **`US-002`** | Absorbed | Company email + password login enhanced with single-channel Smart OTP (Email OR Mobile). |
| **`AUTH-04`** | Access Control | **`US-001` / `US-003` / `US-017`** | Absorbed | Role-based permissions (`Administrator`, `Privileged User`, `Desk User`), step-up PII OTP, and immutable audit logs. |
| **`AUTH-05`** | Administration | **`US-001` / `US-014` / `US-015`** | Absorbed | Staff account onboarding/deactivation, vendor directory, and financial dashboard. |
| **`GAP-04`** | Operations | **`US-004` / `US-005` / `US-011`** | Absorbed | Structured Advisor Lead Briefing View connected to Master Client Profiles and Trip Pipeline. |
| **`GAP-03`** | Utility | **`US-010`** | Absorbed | Non-PII shareable web link and luxury white-label proposal/synopsis export with version tracking. |
| **`PO-05`** | Brand / Trust | **`PO-05`** | Retained | Human Journey Designer profiles on live site with real photo galleries and 1-click Passport pre-fill CTAs. |
| **`GAP-05`** | Growth / SEO | **`GAP-05`** | Retained | Schema.org structured metadata and rich WhatsApp Open Graph preview cards for destination routes. |
| **`G-02`** | Governance | **`G-02`** | Retained | Resend email provider operational playbook (SPF/DKIM/DMARC, sender reputation, triage). |
| **`HP-04`** | Homepage | **`HP-04`** | Retained | Clean removal of unused legacy Experiences/ExperienceCard files while preserving active journeys. |

---

## 3. Release Backlog Matrix

| ID | Area / Epic | Requirement Title | Priority | Target Persona | Scope Summary |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **US-001** | Epic 1: RBAC | Staff Account Provisioning & Role Assignment | P0 (High) | Administrator | Admin creates staff accounts with company email, mobile, and role (`Administrator`, `Privileged User`, `Desk User`); immediate deactivation. |
| **US-002** | Epic 1: Auth | Login with Single-Channel OTP Preference (Email OR Mobile) | P0 (High) | All Staff | Email + password login with step-up verification prompting mutually exclusive single-select (Email OR Mobile); 10m validity, 60s cooldown, 14-day trusted device. |
| **US-003** | Epic 1: Security | Step-Up Single-Channel OTP for Sensitive PII Access | P1 (High) | Privileged / Admin | Re-verify via preferred OTP channel before viewing unmasked client passport/ID details; 5-minute auto-mask window; audit logged. |
| **US-004** | Epic 2: Client CRM | Decoupled Master Client Profiles | P0 (High) | Desk User | Master Client Profile independent of a specific trip; linked household members; duplicate email/phone warning. |
| **US-005** | Epic 2: Client CRM | Structured Client Preference Tags & Lead Attribution | P0 (High) | Desk User | Standardized preference tags (dietary, room, pace); mandatory `Lead Source` on new inquiries; filterable in client directory. |
| **US-006** | Epic 2: Client CRM | Chronological Client & Trip Activity Feed | P1 (Med) | All Staff | Timestamped rich-text interaction notes (calls, WhatsApp summaries, emails) and attachments; system vs manual distinction. |
| **US-007** | Epic 3: Itinerary | Modular Day-by-Day Itinerary Builder | P0 (High) | Desk User | Day-by-day proposal builder with reusable experience blocks (Hotels, Transfers, Activities, Guides, Dining); save/reuse vendor templates. |
| **US-008** | Epic 3: Pricing | Automated Net Cost & Margin Engine | P0 (High) | Desk User | Auto-calculate selling prices from vendor net rates + markups; margin status visibility; multi-currency exchange rates. |
| **US-009** | Epic 3: Governance | Margin Override & Custom Discount Approval Workflow | P1 (Med) | Privileged User | Desk User requests margin override; Privileged User/Admin approves or rejects in-app; client export locked until approved. |
| **US-010** | Epic 3: Export | White-Label Proposal Export & Version Tracking | P0 (High) | Desk User | Branded luxury PDF and shareable web link stripping internal net rates; auto-increment versions (`v1`, `v2`); Sent/Approved tracking. |
| **US-011** | Epic 4: Operations | Visual Trip Lifecycle Pipeline | P0 (High) | All Staff | Kanban-style pipeline board (`Inquiry`, `Proposal Sent`, `Deposit Paid`, `Vendors Confirmed`, `In-Transit`, `Post-Trip`); filters & value rollup. |
| **US-012** | Epic 4: Operations | Segment-Level Voucher & Confirmation Vault | P0 (High) | Desk User | Supplier confirmation codes, vouchers, and 24/7 emergency contacts attached to itinerary segments; voucher/ticket file uploads. |
| **US-013** | Epic 4: Operations | Automated Operational Risk & SLA Alerts | P1 (Med) | All Staff | Dashboard alerts for overdue deposits, unconfirmed bookings within 72h of departure, and missing documents within 14d. |
| **US-018** | Epic 4: Operations | Concierge Intelligence Radar (Weather, Flight Status & Ground Advisories) | P1 (High) | All Staff | Persistent floating dock showing live weather, flight delays, monument closures, and emergency contacts for active/upcoming trips + destination picker. |
| **US-014** | Epic 5: Vendors | Vetted Vendor & Contracted Rate Directory | P1 (Med) | Privileged User | Curated vendor directory categorized by destination, type, and tier; net rates, payment schedules; Desk read-only, Admin/Privileged edit. |
| **US-015** | Epic 5: Finance | Executive Financial & Margin Summary Dashboard | P1 (Med) | Administrator | Metrics for gross bookings, vendor payables, realized margins; client deposits vs vendor payouts; one-click CSV export. |
| **US-016** | Epic 5: Security | Encrypted Client Document Upload & Auto-Masking | P0 (High) | Desk User | Encrypted upload of passports/visas; auto-mask all but last 4 digits (`XXXX-1234`); viewing raw files requires escalation. |
| **US-017** | Epic 5: Audit | Immutable Security & Governance Audit Log | P2 (Low) | Administrator | Read-only audit log tracking PII unmasks, OTP channel used, role changes, and financial exports; filterable by date, staff, event. |
| **PO-05** | Brand & Trust | Journey Designer Profiles & Authentic Media Storytelling | Medium | PO / Keerthi | Human specialist profiles on the site with real trip photo galleries and one-click 'Design a journey like this' Passport pre-fill CTAs. |
| **GAP-05** | Growth / SEO | SEO & Rich Open Graph Previews for Regional Pages | Medium | PO / Keerthi | Structured Schema.org metadata and dynamic Open Graph social preview cards for rich WhatsApp sharing of destination routes. |
| **G-02** | Governance | Email Provider Operational Playbook (Resend) | Medium | Archie / Sri | Complete runbook for Resend domain authentication (SPF/DKIM/DMARC), template versioning, sender reputation, and delivery triage. |
| **HP-04** | Homepage | Remove or Resolve Unused Legacy Experiences Components | Low | Arjun / Archie | Clean up dead legacy `Experiences.tsx` and `ExperienceCard.tsx` files while safely preserving active `JourneyInvitations`. |

---

## 4. Detailed Requirement Specifications

### Epic 1: Authentication & Role-Based Access Control (RBAC)

#### US-001 — Staff Account Provisioning & Role Assignment
- **Priority:** `P0 - Must Have` | **Target Persona:** `Administrator`
- **Scope & Functional Intent:** Admin creates staff accounts with mandatory company email, mandatory registered mobile number, auto-generated temporary default password, and role assignment (`Administrator`, `Privileged User`, `Desk User`).
- **Dependencies & Guardrails:** Preserves `BOUND-01` public conversion isolation. Zero public self-registration. Staff cannot edit own registered verification channels.
- **Acceptance Criteria:**
  1. Admin can invite/create users with mandatory company domain email AND mandatory registered mobile number (both fields strictly required).
  2. System generates a secure temporary default password dispatched via welcome invitation (dual-channel email & SMS notification) with an account state flag `must_change_password = true`.
  3. Role assignment enforces module access immediately.
  4. Staff cannot self-edit registered OTP email or mobile; requires Admin approval.
  5. Admin can deactivate a user and immediately invalidate all active sessions.

#### US-002 — Login with Single-Channel OTP Preference (Email OR Mobile) & Password Governance
- **Priority:** `P0 - Must Have` | **Target Persona:** `All Staff`
- **Scope & Functional Intent:** Authenticate via company email and password. On first-time login with temporary default password, system enforces mandatory forced password change before granting workspace access. When challenge verification triggers, user chooses either registered Email OR registered Mobile to receive a 6-digit OTP via a mutually exclusive selector. Includes seamless forgot password reset flow.
- **Dependencies & Guardrails:** Zero-cost test doubles for automated verification. Mutually exclusive selection prevents dual sending.
- **Acceptance Criteria:**
  1. Primary login validates company email + password.
  2. **Mandatory First-Time Password Change:** If `must_change_password === true`, user is immediately redirected to a forced password change screen requiring temporary default password, new strong password (12+ chars, entropy rules), and confirmation. Navigation to CRM, itineraries, or operational tools is strictly locked until password update succeeds.
  3. **Seamless Forgot Password Reset:** User can trigger self-service password reset via `/portal/forgot-password` by entering registered email or mobile, verifying via single-channel OTP, and establishing a new password.
  4. When challenge triggers, user sees mutually exclusive radio selection: **Company Email** OR **Registered Mobile** (displaying masked values like `j***@company.com` and `•••• ••89`).
  5. Selecting one channel strictly prevents dispatching to the other.
  6. OTP is 6 digits, valid for 10 minutes, with a 60-second cooldown before resending or switching channels.
  7. Verified devices remain trusted for 14 days (configurable by Admin).

#### US-003 — Step-Up Single-Channel OTP for Sensitive PII Access
- **Priority:** `P1 - Should Have` | **Target Persona:** `Privileged User` / `Administrator`
- **Scope & Functional Intent:** Require step-up identity verification via preferred OTP channel before displaying unmasked client passport or identity details.
- **Dependencies & Guardrails:** Depends on US-002 OTP engine and US-016 masking.
- **Acceptance Criteria:**
  1. Clicking "Unmask PII" prompts user to choose Email OR Mobile for verification OTP.
  2. Valid 6-digit OTP reveals unmasked ID details for 5 minutes before auto-masking again.
  3. Every unmask event, including the OTP channel used, is recorded in the audit log.

---

### Epic 2: CRM-Ready Client Profiles

#### US-004 — Decoupled Master Client Profiles
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Create master client records independent of specific travel inquiries, linking household members and past inquiries.
- **Dependencies & Guardrails:** Duplicate detection on email and E.164 phone number.
- **Acceptance Criteria:**
  1. Stores contact info, DOB, nationality, and linked travel companions.
  2. Multiple inquiries/trips link to one master Client Profile.
  3. Warns user if email or phone matches an existing client record.

#### US-005 — Structured Client Preference Tags & Lead Attribution
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Standardize customer preference tags (dietary, room type, travel pace) and enforce lead attribution sources.
- **Dependencies & Guardrails:** Ingests `PO-03` comfort signals and `P-05` free-text themes from Passport submissions.
- **Acceptance Criteria:**
  1. Standardized multi-select preference tags available on Client Profiles.
  2. Mandatory `Lead Source` field (`Founder Network`, `Client Referral`, `Instagram`, `Website`, `Partner`) on new inquiries.
  3. Tags are filterable and searchable in client directory.

#### US-006 — Chronological Client & Trip Activity Feed
- **Priority:** `P1 - Should Have` | **Target Persona:** `All Staff`
- **Scope & Functional Intent:** Provide a timeline of manual interaction notes (phone calls, WhatsApp summaries, email context) and attachments.
- **Dependencies & Guardrails:** Distinguish between automated system events and staff notes.
- **Acceptance Criteria:**
  1. Chronological activity stream visible on Client Profile and Trip record.
  2. Supports timestamped rich-text notes and file attachments.
  3. Clearly distinguishes between automated system updates and manual staff entries.

---

### Epic 3: Bespoke Itinerary & Quote Builder

#### US-007 — Modular Day-by-Day Itinerary Builder
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Build bespoke itineraries using reusable modular experience blocks for hotels, transfers, activities, guides, and dining.
- **Dependencies & Guardrails:** Integrates with destination intelligence and vetted vendor components.
- **Acceptance Criteria:**
  1. Ordered day-by-day builder supporting Hotels, Transfers, Activities, Guides, Dining.
  2. Save and reuse vetted experience templates.
  3. Supports editorial descriptions and high-resolution imagery per block.

#### US-008 — Automated Net Cost & Margin Engine
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Automatically calculate total selling prices from vendor net costs and default markups with multi-currency support.
- **Dependencies & Guardrails:** Prevent net cost visibility on client-facing outputs.
- **Acceptance Criteria:**
  1. Each component stores Vendor Net Cost and Markup %.
  2. Desk Users view calculated Selling Price and margin health status.
  3. Multi-currency support with configurable exchange rates.

#### US-009 — Margin Override & Custom Discount Approval Workflow
- **Priority:** `P1 - Should Have` | **Target Persona:** `Privileged User` / `Administrator`
- **Scope & Functional Intent:** Enable Desk Users to request custom discounts below margin thresholds, requiring Privileged User approval.
- **Dependencies & Guardrails:** Locks client export until approved.
- **Acceptance Criteria:**
  1. Desk User submits override request with justification note.
  2. Privileged Users and Admins receive in-app alert to approve/reject.
  3. Proposal export remains locked until approved.

#### US-010 — White-Label Proposal Export & Version Tracking
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Generate branded white-label PDF and read-only shareable web proposals, stripping all internal net rates and margins.
- **Dependencies & Guardrails:** Version auto-incrementing; print-optimized CSS layout.
- **Acceptance Criteria:**
  1. Branded luxury PDF and web proposal export stripping all net rates and margins.
  2. Auto-increments version numbers (`v1`, `v2`, `v3`) upon edits after export.
  3. Tracks versions marked "Sent to Client" and "Approved".

---

### Epic 4: Operations & Booking Command Center

#### US-011 — Visual Trip Lifecycle Pipeline
- **Priority:** `P0 - Must Have` | **Target Persona:** `All Staff`
- **Scope & Functional Intent:** Kanban board displaying trips across operational lifecycle stages with filtering and aggregate value rollups.
- **Dependencies & Guardrails:** Seamlessly links with incoming leads from `journey_passport_leads`.
- **Acceptance Criteria:**
  1. Pipeline stages: `Inquiry`, `Proposal Sent`, `Deposit Paid`, `Vendors Confirmed`, `In-Transit`, `Post-Trip`.
  2. Filterable by staff owner, departure window, and client tier.
  3. Displays aggregate financial value per pipeline column.

#### US-012 — Segment-Level Voucher & Confirmation Vault
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Attach vendor confirmation codes, vouchers, and 24/7 emergency contacts to itinerary segments.
- **Dependencies & Guardrails:** Secure storage for voucher documents.
- **Acceptance Criteria:**
  1. Dedicated fields for Booking Ref #, Vendor Contact Name, 24/7 Phone.
  2. File upload support for supplier vouchers, tickets, and charter manifests.

#### US-013 — Automated Operational Risk & SLA Alerts
- **Priority:** `P1 - Should Have` | **Target Persona:** `All Staff`
- **Scope & Functional Intent:** Automated dashboard alerts for overdue client deposits, unconfirmed bookings within 72 hours of departure, and missing documents within 14 days.
- **Dependencies & Guardrails:** Timezone-aware calculation (`Asia/Kolkata`).
- **Acceptance Criteria:**
  1. Dashboard flags overdue client deposit milestones.
  2. Red alert for departures within 72 hours with unconfirmed vendor segments.
  3. Warning alert for missing passport/visa uploads within 14 days of departure.

---

### Epic 5: Vendor, Financial & Security Governance

#### US-018 — Concierge Intelligence Radar (Weather, Flight Status & Ground Advisories)
- **Priority:** `P1 - High` | **Target Persona:** `All Staff`
- **Scope & Functional Intent:** Persistent, non-dismissible floating dock mounted across portal screens providing live situational awareness: real-time destination weather & 7-day outlook, live flight tracking (delays, gate, terminal), monument/sightseeing closures (e.g. weekly Taj Mahal Friday closure), and seasonal route advisories for currently active (`In-Transit`) and upcoming trips. Includes an exploratory dropdown to view details for any served SMV destination.
- **Dependencies & Guardrails:** Consumes trip dates/destinations from `US-011` and flight segment vouchers from `US-012`. Internal users cannot permanently disable or unmount the widget (only minimize/expand). $0.00 in-memory test doubles (`TD-02`).
- **Acceptance Criteria:**
  1. Floating dock mounted at portal layout level with persistent minimized pill and expanded drawer states.
  2. Auto-filters to destinations and flight segments of currently active (`In-Transit`) and upcoming trips.
  3. Interactive dropdown allows exploring weather and local conditions for all served SMV destinations.
  4. Real-time flight tracking updates (departure, arrival, gate, delay warnings) for attached flight segments.
  5. Surfaces scheduled monument closures (e.g. Friday closures) and seasonal weather/road hazards.
  6. Non-dismissible: cannot be disabled or hidden via settings; close action minimizes to floating status pill.


#### US-014 — Vetted Vendor & Contracted Rate Directory
- **Priority:** `P1 - Should Have` | **Target Persona:** `Privileged User`
- **Scope & Functional Intent:** Curated directory of luxury vendors, contracted rates, payment schedules, and cancellation terms.
- **Dependencies & Guardrails:** Desk Users have read-only access; Admin and Privileged Users edit.
- **Acceptance Criteria:**
  1. Directory categorized by destination, category (Hospitality, Aviation, Yachts, Guides), and tier.
  2. Stores contracted net rates and terms.
  3. Read-only for Desk Users; Privileged Users/Admins can add and edit.

#### US-015 — Executive Financial & Margin Summary Dashboard
- **Priority:** `P1 - Should Have` | **Target Persona:** `Administrator`
- **Scope & Functional Intent:** Executive dashboard displaying gross bookings, vendor payables, and realized margins with CSV export.
- **Dependencies & Guardrails:** Accessible exclusively to `Administrator` role.
- **Acceptance Criteria:**
  1. Summary metrics filterable by month, quarter, and completion date.
  2. Tracks deposits collected vs pending balances and upcoming vendor payouts.
  3. One-click CSV export for accounting reconciliation.

#### US-016 — Encrypted Client Document Upload & Auto-Masking
- **Priority:** `P0 - Must Have` | **Target Persona:** `Desk User`
- **Scope & Functional Intent:** Secure client passport/visa upload with automatic text masking of ID numbers (`XXXX-1234`).
- **Dependencies & Guardrails:** Raw downloads require step-up verification (`US-003`).
- **Acceptance Criteria:**
  1. Encrypted file upload on Client Profile for passports and visas.
  2. ID numbers auto-masked to last 4 digits (`XXXX-1234`) immediately upon saving.
  3. Desk Users cannot view or download raw files without Privileged/Admin escalation.

#### US-017 — Immutable Security & Governance Audit Log
- **Priority:** `P2 - Nice to Have` | **Target Persona:** `Administrator`
- **Scope & Functional Intent:** Read-only immutable audit log tracking PII unmask events, OTP channel selections, role changes, and financial exports.
- **Dependencies & Guardrails:** Append-only database table; accessible only to Administrators.
- **Acceptance Criteria:**
  1. Logs User ID, Action Type, Target Record, OTP Channel, IP Address, Timestamp.
  2. Read-only interface for Administrators.
  3. Filterable by date range, staff member, and event type.

---

### Public Brand, Growth & Governance Deliverables

#### PO-05 — Journey Designer Profiles & Authentic Media Storytelling
- **Priority:** `Medium` | **Target Persona:** `PO / Keerthi`
- **Scope & Functional Intent:** Showcase human specialist profiles on destination and story pages, complete with verified trip photo galleries and a one-click 'Design a journey like this' CTA that pre-fills the Journey Passport.
- **Acceptance Criteria:** Real specialist bios, photos, and 1-click inspiration pre-fill into Passport.

#### GAP-05 — SEO & Rich Open Graph Previews for Regional Pages
- **Priority:** `Medium` | **Target Persona:** `PO / Keerthi`
- **Scope & Functional Intent:** Structured Schema.org (`TouristDestination` / `TravelAgency`) metadata and dynamic Open Graph social preview cards optimized for rich link rendering on WhatsApp.
- **Acceptance Criteria:** Destination and Synopsis URLs share richly on WhatsApp with preview image, title, and description.

#### G-02 — Email Provider Operational Playbook (Resend)
- **Priority:** `Medium` | **Target Persona:** `Sri / Archie`
- **Scope & Functional Intent:** Document Resend domain authentication (SPF/DKIM/DMARC), deliverability monitoring, template versioning, and operational troubleshooting runbook.
- **Acceptance Criteria:** Comprehensive operational playbook committed in governance docs.

#### HP-04 — Remove or Resolve Unused Legacy Experiences Components
- **Priority:** `Low` | **Target Persona:** `Arjun / Archie`
- **Scope & Functional Intent:** Clean up dead legacy `Experiences.tsx` and `ExperienceCard.tsx` files while preserving active `JourneyInvitations.tsx` and `/experiences` public route.
- **Acceptance Criteria:** Dead legacy component files cleanly removed with zero broken imports.
