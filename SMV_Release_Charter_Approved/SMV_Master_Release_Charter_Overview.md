# Search My Vacation (SMV) — Master Release Charter (R1.3 to R1.7+ & Dedicated CRM Stream)

**Status:** Approved (Expanded Baseline)  
**Total Scope:** 114 Items (103 Product & Platform Items across R1.3–R1.7+ and 11 Dedicated CRM Items across Phases 1–3)

This charter consolidates your core product and platform backlog items (re-sequenced to eliminate dependency inversions and duplicate AI/Housekeeping tickets, with CRM separated into its own stream) together with the **Bespoke Slow-Travel Staff Portal (MVP) Backlog (v1.1)** and **Product Owner & Live-Site Gap enhancements** (`GAP-02`, `GAP-03`, `GAP-04`, `GAP-05`, `PO-01`, `PO-02`, `PO-03`, `PO-04`, `PO-05`) identified from `searchmyvacation.com`.

---

## Release Architecture at a Glance

| Document Set | Scope & Theme | Item Count | Files Included |
| :--- | :--- | :---: | :--- |
| **Release 1.3** | Core Conversion, Trust, Search & OTP Hardening | 17 | `SMV_R1.3_Release_Plan.md` / `SMV_R1.3_Release_Plan_APPROVED.xlsx` |
| **Release 1.4** | Destination Intelligence, Trip Anchors & Passport Experience | 22 | `SMV_R1.4_Release_Plan.md` / `SMV_R1.4_Release_Plan_APPROVED.xlsx` |
| **Release 1.5** | High-Touch Travel Staff Portal, Advisor Workspace & Brand Storytelling | 22 | `SMV_R1.5_Release_Plan.md` / `SMV_R1.5_Release_Plan_APPROVED.xlsx` |
| **Release 1.5.1** | High-Touch Team Profile, Customer CRM & Horizon Theme Refresh | 9 | `SMV_R1.5.1_Release_Plan.md` |
| **Release 1.5.3** | Portal Light Mode Contrast, Full CRUD, Financial Approval Queue, Idle Guard & Itinerary Persistence (M1 + M2) | 8 | `SMV_R1.5.3_Release_Plan.md` / `SMV_R1.5.3_Release_Plan_APPROVED.xlsx` |
| **Release 1.5.4** | End-to-End Journey Creation, Lifecycle Maintenance & Stage Governance | 10 | `SMV_R1.5.4_Release_Plan.md` / `SMV_R1.5.4_Release_Plan_APPROVED.xlsx` |
| **Release 1.6** | Customer Accounts, Family Trip Board, Theme Support & Advanced Intelligence | 13 | `SMV_R1.6_Release_Plan.md` / `SMV_R1.6_Release_Plan_APPROVED.xlsx` |
| **Release 1.7+** | Interactive Itinerary Builder, AI Co-Pilot & Conditional Playbooks | 11 | `SMV_R1.7_Plus_Release_Plan.md` / `SMV_R1.7_Plus_Release_Plan_APPROVED.xlsx` |
| **CRM Stream (Phases 1–3)** | Separated CRM Discovery, Lead Pipeline, Quotes & Retention | 11 | `SMV_CRM_Phased_Roadmap.md` / `SMV_CRM_Phased_Roadmap_APPROVED.xlsx` |
| **TOTAL** | **All Chartered Product Releases + Dedicated CRM Stream** | **114** | |

---

## How the Release 1.5 Bespoke Travel Staff Portal & PO Enhancements Are Placed

- **R1.3 (`GAP-02`):** Pre-OTP expectation setting & designer response SLA copy — directly reduces drop-off at the current live OTP gate.
- **R1.4 (`PO-01`, `PO-02`, `PO-03`):** Interactive Journey Synopsis Preview & Teaser Mode, consultative 'Trip Anchors' (duration/season/investment tier), and Family & Multi-Generational Comfort Signals (Senior-Friendly, Toddler-Easy, Pure Veg/Jain, Visa-Easy) — tightly coupled with Region-Level Intelligence (`V-01`) and Passport UX (`UX-04`–`UX-08`).
- **R1.5 (`US-001`–`US-018`, `PO-05`, `GAP-05`, `G-02`, `HP-04`):** Complete Bespoke Travel Staff Portal (MVP):
  - **Epic 1 (RBAC & Auth):** Staff provisioning, Smart single-channel OTP login (Email OR Mobile selector), and step-up PII unmasking (`US-001`–`US-003`).
  - **Epic 2 (Client Profiles):** Decoupled master client profiles, preference tags, lead source attribution, and activity timeline (`US-004`–`US-006`).
  - **Epic 3 (Itinerary & Pricing):** Modular day-by-day proposal builder, net cost/margin engine, margin override workflow, and white-label export (`US-007`–`US-010`).
  - **Epic 4 (Operations):** Visual trip pipeline board, segment voucher vault, operational SLA alerts, and persistent Concierge Intelligence Radar (`US-011`–`US-013`, `US-018`).
  - **Epic 5 (Governance):** Vetted vendor directory, executive margin dashboard, encrypted doc masking, and immutable security audit log (`US-014`–`US-017`).
  - **Public Brand & Growth:** Specialist profiles (`PO-05`), regional WhatsApp SEO cards (`GAP-05`), Resend playbook (`G-02`), and legacy cleanup (`HP-04`).
- **R1.6 (`PO-04`):** Collaborative 'Family Decision Board' (shareable shortlist with family voting) — layered cleanly on top of Customer Wishlist (`ACCT-02`).

---

## Identity Governance & Onboarding Mandates (PO Approved — Nov 2026)

1. **Internal Staff Accounts (Release 1.5):**
   - **Zero Public Self-Registration:** Public sign-up is strictly forbidden on internal staff routes (`/portal/*`). Accounts can only be provisioned by authenticated Administrators (`US-001`).
   - **Mandatory Dual Identifiers:** Both Company Email (`@searchmyvacation.com`) AND Registered Mobile (in E.164 format) are strictly mandatory upon invitation.
   - **Default Password & Forced First-Time Change:** Admin provisioning dispatches an auto-generated temporary default password. Upon first-time login, the system strictly enforces a **mandatory forced password change** before granting access to client CRM, itineraries, or operational tools.
   - **Smart Single-Channel OTP & Device Trust:** After changing the password, staff complete single-channel Smart OTP verification (Email or Mobile) to trust their workstation for 14 days (`US-002`).
   - **Seamless Password Reset:** Self-service "Forgot Password" works seamlessly via single-channel OTP verification.

2. **Customer Accounts (Release 1.6):**
   - **Mandatory Dual Identifiers:** When prospective travellers optionally register an account (`AUTH-02`), **both Mobile (E.164) and Email are strictly mandatory fields** (no single-field sign-ups). This ensures high-trust dual-channel delivery and seamless reconciliation with Journey Passport submissions.
   - **Unified Forgot Password:** External travellers use the shared single-channel OTP password reset mechanism (`AUTH-03`) to seamlessly recover forgotten passwords.
