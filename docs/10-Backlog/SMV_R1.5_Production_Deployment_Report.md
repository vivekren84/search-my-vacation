# Search My Vacation (SMV) — Release 1.5 Production Deployment, Smoke Test & Rollback Plan

**Version:** `v1.5.0`  
**Git Tag:** `v1.5.0`  
**Base Trunk:** `release/r1.5` merged into `main` (Commit `dcec726`)  
**Production Domains:**  
- `https://searchmyvacation.com`  
- `https://www.searchmyvacation.com`  
**Production Database:** `SearchMyVacation_WebsiteUpgrade` (`jbsefolhlfkplawiuvlu`)  
**Pre-Prod Database:** `SMV-preprod` (`pkfdunyeaqdvvklutgon`)  
**Product Owner:** Vivek Renganathan  
**Technical Lead:** Tiger (CTO)  
**Date:** November 22, 2026  
**Status:** **PROMOTED TO PRODUCTION (LIVE — V1.5.0 ACTIVE)**  

---

## 1. Executive Summary

Release 1.5 (**"High-Touch Travel Staff Portal & Advisor Workspace"**) has been successfully merged into `main` at commit `dcec726` and tagged `v1.5.0`.

All **22 chartered backlog deliverables** across Milestones 1 through 4 have passed 100% stage 1 pre-prod verification and consolidated smoke testing across **1,179 automated platform checks** (12 suites passing 100% green), with 0 open backlog items.

Zero live external API or telecom costs ($0.00) were incurred via `TD-02` test doubles, and zero occurrences of the prohibited term "luxury" exist across codebase, types, templates, and documentation.

---

## 2. Release Scope & Deliverables Matrix (22 Items)

| Milestone | ID | Requirement Title | Production Deliverable |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | `US-001` | Staff Account Provisioning & RBAC | Multi-role access control (`super_admin`, `administrator`, `privilege_user`, `desk_user`) with mandatory email & mobile, and instant session deactivation kill-switch |
| | `US-002` | Smart Single-Channel OTP | SMS vs Email mutual exclusivity, 60s cooldown, 10-minute validity, and provider failure fallback |
| | `US-003` | Step-Up OTP Authorization | Re-authentication gate with 5-minute auto-expiry window for privileged operations and sensitive PII unmasking |
| | `US-017` | Immutable Security Audit Log | Append-only ledger recording all staff auth, role modifications, margin overrides, and PII unmasking |
| **Milestone 2** | `US-004` | Decoupled Client CRM & Companions | Master client profiles with companion linking, duplicate detection on normalized phone and email |
| | `US-005` | Structured Preference Tagging | Tagging taxonomy (Family Comfort, Slow Travel, Heritage, Dietary) with mandatory lead source attribution |
| | `US-006` | Chronological Activity Feed | Timestamped communication timeline tracking phone calls, WhatsApp notes, meetings, and client updates |
| | `GAP-04` | Journey Designer Lead Briefing | Structured briefing summary aggregating client context, companion headcounts, and priority tags |
| **Milestone 3** | `US-007` | Modular Day-by-Day Itinerary Builder | Ordered schedule editor supporting hotels, transfers, aviation, curated activities, guides, and dining |
| | `US-008` | Automated Net Cost & Margin Engine | Automated financial modeling: Vendor Net Rate + Markup % + GST = Gross Selling Price, with real-time margin health flags |
| | `US-009` | Margin Override Approval Workflow | Commercial governance gate hard-locking export when margin $< 12.00\%$; privileged review & audit trail |
| | `US-010` | White-Label Proposal Export | Sanitized client presentation stripping internal supplier names, net rates, and markups; immutable versioning (`v1.0`) |
| **Milestone 4** | `US-011` | Visual Trip Lifecycle Pipeline | 5-stage visual Kanban pipeline (`proposal_sent` $\rightarrow$ `deposit_received` $\rightarrow$ `booked_confirmed` $\rightarrow$ `in_travel` $\rightarrow$ `returned_closed`) |
| | `US-012` | Segment Voucher Vault & Emergency Hub | Digital voucher retrieval with 24x7 local duty manager contacts and E.164 emergency phone numbers |
| | `US-013` | Operational Risk & SLA Alerts Engine | Automated risk detector evaluating 72h departures, overdue deposits, and missing travel documentation |
| | `US-018` | Concierge Intelligence Radar | Persistent desktop dock with live destination weather, flight tracking, and ground advisories; draggable pill with 16px clamp; 30-min inactivity watchdog auto-resetting dock to Bottom-Right |
| | `US-014` | Vetted Vendor & Rate Directory (RBAC) | Contracted supplier directory with strict RBAC (Desk Users read-only; Admin/Privileged full edit) |
| | `US-015` | Executive Financial Summary Dashboard | Aggregated Gross Bookings, Net Payables, Realized Margin %, and GST Liability with audit-grade CSV export |
| | `US-016` | Encrypted Client Document Vault | Secure identity document storage with default masking (`XXXX-1234`) and Step-Up OTP unmasking |
| | `PO-05` | Human Journey Specialist Profiles | Keerthi Renganathan & Sri consultative profiles with 1-click Passport pre-fill config |
| | `GAP-05` | Social Open Graph & Rich Snippet Infrastructure | Schema.org `TouristDestination` structured data and WhatsApp Open Graph preview cards |
| | `G-02` | Resend Email Operations Playbook | Operational standard for transactional email DNS, SPF, DKIM, DMARC, bounce triage, and template lifecycle |
| | `HP-04` | Dead Code Cleanup | Clean removal of unused legacy `web/components/sections/Experiences/` directory |

---

## 3. Database Migration Runbook

All 4 database migrations must be applied to the Production Supabase instance (`jbsefolhlfkplawiuvlu`):

### Migration Execution Sequence
```bash
# Apply Release 1.5 migrations in chronological order
supabase migration up --project-ref jbsefolhlfkplawiuvlu
```

### Verified Migration Artifacts
1. `supabase/migrations/20261122000000_staff_auth_rbac_m1.sql`:
   * Alters `workspace_users` (adds `registered_mobile`, `last_login_at`, `last_otp_channel`).
   * Creates `staff_otp_challenges` (single-channel OTP state).
   * Enhances `workspace_audit_log` with staff security event types.
2. `supabase/migrations/20261123000000_client_crm_m2.sql`:
   * Alters `workspace_travellers` (adds `phone_e164`, `lead_source`, `is_vip`).
   * Creates `workspace_client_companions` (co-travellers and family members).
   * Creates `workspace_client_tags` (preference tagging).
   * Creates `workspace_client_activities` (chronological timeline).
3. `supabase/migrations/20261124000000_itinerary_pricing_m3.sql`:
   * Creates `workspace_itineraries`, `workspace_itinerary_days`, `workspace_itinerary_segments`.
   * Creates `workspace_margin_overrides` (commercial governance state machine).
   * Creates `workspace_proposal_versions` (immutable white-label proposal snapshots).
4. `supabase/migrations/20261125000000_operations_radar_governance_m4.sql`:
   * Creates `workspace_trip_pipeline` (visual Kanban lifecycle).
   * Creates `workspace_segment_vouchers` (digital vouchers with 24x7 emergency contacts).
   * Creates `workspace_operational_alerts` (SLA risk monitoring).
   * Creates `workspace_vendors` (vetted supplier directory).
   * Creates `workspace_client_documents` (encrypted document vault).

* **Row Level Security (RLS):** Enabled across all 14 created tables and 3 enhanced core tables. Anon access strictly revoked.

---

## 4. Production Smoke Test Matrix

| Category | Touchpoint / Feature | Expected Live Observation | Test Method |
| :--- | :--- | :--- | :--- |
| **Public Flow** | Decoupling (`BOUND-01`) | `/journey-passport` and `/journey-director` load without authentication; no `workspace_*` dependency. | Navigate to live public URLs |
| **Public Flow** | Ambient Soundscape (`HP-05`) | Continuous audio playback (*Sanctuary of Silence*) persists across routes. | Browser audio check |
| **Staff Auth** | Staff Portal Login (`US-001`, `US-002`) | `/portal/login` accepts company email or registered mobile; sends single-channel OTP. | Live OTP verification |
| **Staff Auth** | Forced Password Change | Invitee signing in with default password is intercepted by mandatory password change screen. | Login with temporary password |
| **Staff Auth** | Inactivity Watchdog (`US-018`) | Inactive portal session logs out after 30 minutes; Concierge Radar resets to Bottom-Right. | Session idle test |
| **Concierge Radar** | Persistent Dock (`US-018`) | Radar is accessible on all portal pages (no close button); minimized pill drags freely with 16px screen clamp. | UI interaction |
| **Client CRM** | Master Profile (`US-004`) | Create client profile with family companions; duplicate phone/email detection triggers warning. | Create client profile |
| **Pricing Engine** | Margin Hard-Lock (`US-009`) | Proposal export is blocked when margin $< 12.00\%$; unlocks only after approved override. | Test discount override |
| **Commercial** | White-Label Proposal (`US-010`) | Exported client proposal displays gross rates only; vendor names and net costs stripped. | Inspect proposal export |
| **Operations** | Kanban Pipeline (`US-011`) | Trips advance through visual lifecycle stages with updated balance due. | Drag/transition pipeline card |
| **Operations** | Segment Voucher (`US-012`) | Confirmed segment voucher renders emergency contact phone and duty manager info. | View voucher |
| **Governance** | Vendor RBAC (`US-014`) | Desk user has read-only view; edit/save buttons disabled or reject with 403. | Desk vs Admin login |
| **Governance** | Financial Dashboard (`US-015`) | Executive financial summary calculates Gross, Net, Margin %, and GST with CSV download. | Generate CSV export |
| **Governance** | Document Vault (`US-016`) | Identity numbers masked (`XXXX-1234`); unmasking requires active Step-Up OTP. | Request Step-Up unmask |

---

## 5. Live Production Verification Evidence (Post-Deployment Smoke Test)

Executed and verified live across production domains (`searchmyvacation.com` / `www.searchmyvacation.com`):

### A. Navigation & Entry Point Verification
* **Header Sign In & Sign Up:** Verified live in desktop navigation, mobile hamburger drawer, and public footer.
* **Disabled Sign Up Button:** Rendered with `opacity-50 cursor-not-allowed` and hover tooltip `"Coming Soon"`.
* **Primary Conversion CTA:** `"Plan My Experience"` persists prominently and links to `/journey-passport`.

### B. Route Health & Decoupling (200 OK)
* `https://www.searchmyvacation.com/` — **200 OK** (HTML includes `Sign In`, `Sign Up`, `Coming Soon`)
* `https://www.searchmyvacation.com/portal/login` — **200 OK** (Interactive Sign In page rendered)
* `https://www.searchmyvacation.com/portal/dashboard` — **200 OK** (Staff Workspace & Concierge Radar)
* `https://www.searchmyvacation.com/journey-passport` — **200 OK** (Customer flow 100% decoupled)
* `https://www.searchmyvacation.com/destinations` — **200 OK**
* `https://www.searchmyvacation.com/travel-inspiration` — **200 OK**
* `https://www.searchmyvacation.com/contact` — **200 OK**

### C. Public Customer Gate Guardrail
* Any non-staff identifier entered into `/portal/login` triggers the exact approved customer message:
  **`"Account not recognized. Traveller accounts opening soon"`** with a direct link to submit preferences without an account via `/journey-passport`.

---

## 6. Instant Rollback Contingency Procedure

If an unforeseen critical defect is detected post-deployment:

### 1. Application Rollback
```bash
# Instantly revert main to previous release tag v1.4.1
git checkout main
git revert -m 1 dcec726 -m "revert: rollback Release 1.5 to v1.4.1"
git push origin main
```
* Vercel will automatically redeploy the previous stable build within ~2 minutes.

### 2. Database Rollback
If database rollback is necessary, execute the reverse-dependency rollback cascade:
```bash
# Reverse-dependency cascade
psql -f supabase/migrations/20261125000000_operations_radar_governance_m4.rollback.sql
psql -f supabase/migrations/20261124000000_itinerary_pricing_m3.rollback.sql
psql -f supabase/migrations/20261123000000_client_crm_m2.rollback.sql
psql -f supabase/migrations/20261122000000_staff_auth_rbac_m1.rollback.sql
```
* **Data Safety Note:** Because Release 1.5 tables are strictly internal `workspace_*` tables and the public customer database was completely decoupled (`BOUND-01`), rolling back Release 1.5 schemas has **zero impact** on public customer leads, passport submissions, or traveller callbacks.

---

## 7. Stakeholder Sign-Off & Release Closure

* **Sign-Off Date:** November 23, 2026
* **Signed Off By:** Vivek Renganathan (`super_admin` / Owner)
* **Status:** **R1.5 OFFICIALLY SIGNED OFF & CLOSED (100% PRODUCTION READY)**
* **Production Status:** Verified Live across `https://www.searchmyvacation.com` and `https://searchmyvacation.com`
* **Verified Key Capabilities:**
  1. Internal Staff Directory & Multi-Role Governance (`super_admin`, `administrator`, `privilege_user`, `desk_user`) with immediate database synchronization.
  2. Single-Channel Smart OTP and Password Authentication with temporary password forced first-login rotation.
  3. Master Client CRM with duplicate detection and family companion linking.
  4. Day-by-Day Itinerary & Margin Engine with 1-click Claude Project Pop-Up Artifact Launcher ($0.00 headless API cost).
  5. Operations & Booking Command Center with visual Kanban pipeline and Concierge Radar dock.
* **Next Release Scope:** Transitioning to **Release 1.5.1** (`feature/release-1.5.1-team-profile-crm`) covering Client Intake Identifier assignment (`DDSMV-YY-XXX` / `VDSMV-YY-XXX`), Google Sheets historical data ingestion & test data purge, Internal Team Profile page, and Golden Sunset portal aesthetic refresh.
