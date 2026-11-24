# SMV Dedicated CRM Phased Roadmap (Separated Stream — Phases 1 to 3)

**Release Theme:** Decouple CRM complexity from website releases. Validate existing Zoho/Supabase setup first, then build lead continuity, quote tracking, and repeat-traveller intelligence.  
**Total Backlog Items:** 11  
**Status:** In Active Execution (Phase 1 & Phase 2 Core Accelerated via Release 1.5.1)

---

## 0. Release 1.5.1 Delivery Acceleration Notice
*As approved by Vivek Renganathan on November 23, 2026, core deliverables from Phase 1 and Phase 2 are implemented in **Release 1.5.1 (`feature/release-1.5.1-team-profile-crm`)**:*
- **`CRM-01` & `CRM-04`:** Normalized two-tier Customer Master (`CUST-XXXXX`) $\rightarrow$ Many Trips (`DDSMV-YY-XXX`/`VDSMV-YY-XXX`) relational schema.
- **`CRM-06`:** Repeat-traveller deduplication and multi-year journey history linking.
- **`CRM-03`:** Direct Deal and Vendor Deal commercial quotation tracking with RLS financial controls.
- **`CRM-02`:** Smart returning-customer lookup in the staff portal intake flow.

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 5 | Medium: 5 | Low: 1
- **Source Mix:** Existing Backlog: 11 | New PO / Website Gap Additions: 0

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CRM-10** | Phase 1: Discovery & Audit | Zoho CRM & Supabase lead integration audit | Keep | High | Approved (Baseline) | Existing CRM Backlog |
| **CRM-11** | Phase 1: Discovery & Audit | Consent & internal data access boundaries | Reshape | High | Approved (Baseline) | Existing CRM Backlog |
| **CRM-01** | Phase 1: Discovery & Audit | CRM capability architecture & system-of-record decision | Keep | High | Approved (Baseline) | Existing CRM Backlog |
| **CRM-02** | Phase 2: Lead Pipeline | Automated lead & enquiry handoff | Keep | High | Approved (Baseline) | Existing CRM Backlog |
| **CRM-08** | Phase 2: Lead Pipeline | Manual handoff effort reduction & SLA alerts | Keep | Medium | Approved (Baseline) | Existing CRM Backlog |
| **CRM-05** | Phase 2: Lead Pipeline | Structured follow-up workflow & reminders | Keep | High | Approved (Baseline) | Existing CRM Backlog |
| **CRM-03** | Phase 3: Quotes & Retention | Quotes & quotation version tracking | Keep | Medium | Approved (Baseline) | Existing CRM Backlog |
| **CRM-04** | Phase 3: Quotes & Retention | Unified customer & family relationship records | Keep | Medium | Approved (Baseline) | Existing CRM Backlog |
| **CRM-06** | Phase 3: Quotes & Retention | Repeat traveller & past journey history | Keep | Medium | Approved (Baseline) | Existing CRM Backlog |
| **CRM-07** | Phase 3: Quotes & Retention | Customer-facing trip & quote dashboard (CRM sync) | Keep | Low | Approved (Baseline) | Existing CRM Backlog |
| **CRM-09** | Phase 3: Quotes & Retention | CRM conversion & repeat-business analytics | Keep | Medium | Approved (Baseline) | Existing CRM Backlog |

---

## 3. Detailed Requirement Specifications

### CRM-10 — Zoho CRM & Supabase lead integration audit
- **Area / Phase:** Phase 1: Discovery & Audit | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Confirm whether Zoho CRM is actively used by Journey Designers today and map current Supabase lead storage vs. manual workflows.
- **Dependencies & Guardrails:** Product Owner & Operations confirmation required before any build.
- **Acceptance Criteria:** Written audit confirming current system of record and integration approach.
- **PO Notes:** Existing CRM Backlog

### CRM-11 — Consent & internal data access boundaries
- **Area / Phase:** Phase 1: Discovery & Audit | **Disposition:** `Reshape` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Define data access permissions, PII retention rules, and separation between non-personal Journey Reference IDs and personal contact records.
- **Dependencies & Guardrails:** Align with R1.5 staff RBAC (AUTH-04) and Journey Synopsis contract.
- **Acceptance Criteria:** Approved data-governance and consent matrix governing CRM lead records.
- **PO Notes:** Existing CRM Backlog

### CRM-01 — CRM capability architecture & system-of-record decision
- **Area / Phase:** Phase 1: Discovery & Audit | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Define target CRM operating model (Zoho CRM integration vs. lightweight internal pipeline) covering leads, quotes, follow-ups, and repeat travellers.
- **Dependencies & Guardrails:** Depends on CRM-10 and CRM-11.
- **Acceptance Criteria:** Signed-off CRM architecture blueprint with zero ambiguity on system of record.
- **PO Notes:** Existing CRM Backlog

### CRM-02 — Automated lead & enquiry handoff
- **Area / Phase:** Phase 2: Lead Pipeline | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Sync verified Journey Passport leads, Synopsis reference IDs, and comfort signals reliably into the CRM pipeline with duplicate detection and owner assignment.
- **Dependencies & Guardrails:** Must not claim CRM sync succeeded unless confirmed by backend/webhook.
- **Acceptance Criteria:** 100% of verified Passport submissions appear in CRM within 60 seconds with full Synopsis context.
- **PO Notes:** Existing CRM Backlog

### CRM-08 — Manual handoff effort reduction & SLA alerts
- **Area / Phase:** Phase 2: Lead Pipeline | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Eliminate manual copy-pasting of Passport summaries into WhatsApp/spreadsheets and notify assigned Journey Designers of new high-intent leads.
- **Dependencies & Guardrails:** Baseline current manual handling time first.
- **Acceptance Criteria:** Advisors receive instant structured lead briefs with zero manual transcription.
- **PO Notes:** Existing CRM Backlog

### CRM-05 — Structured follow-up workflow & reminders
- **Area / Phase:** Phase 2: Lead Pipeline | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Implement stage-based follow-up tasks, due-time reminders, and escalation rules so no warm traveller enquiry goes uncontacted.
- **Dependencies & Guardrails:** Define follow-up stages and SLA thresholds with sales/advisor team.
- **Acceptance Criteria:** Every active lead has a tracked next-action owner and due date.
- **PO Notes:** Existing CRM Backlog

### CRM-03 — Quotes & quotation version tracking
- **Area / Phase:** Phase 3: Quotes & Retention | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Track custom trip quotations sent to travellers, including version history, validity windows (per T&Cs), and approval status.
- **Dependencies & Guardrails:** Map current quotation creation format (PDF/doc/email).
- **Acceptance Criteria:** Advisors and managers can view quote status, validity, and conversion rate per lead.
- **PO Notes:** Existing CRM Backlog

### CRM-04 — Unified customer & family relationship records
- **Area / Phase:** Phase 3: Quotes & Retention | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Maintain longitudinal household/traveller profiles linking multiple enquiries, family member preferences, and past consultations.
- **Dependencies & Guardrails:** Enforce duplicate resolution and consent rules (CRM-11).
- **Acceptance Criteria:** Advisors see full past interaction history when a previous traveller returns.
- **PO Notes:** Existing CRM Backlog

### CRM-06 — Repeat traveller & past journey history
- **Area / Phase:** Phase 3: Quotes & Retention | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Record completed SMV trips, preferred pacing, and feedback to power proactive anniversary/seasonal outreach.
- **Dependencies & Guardrails:** Respect retention limits and opt-out boundaries.
- **Acceptance Criteria:** Completed trips are logged against customer records and inform future consultations.
- **PO Notes:** Existing CRM Backlog

### CRM-07 — Customer-facing trip & quote dashboard (CRM sync)
- **Area / Phase:** Phase 3: Quotes & Retention | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Surface active quote status and confirmed trip summaries inside the Customer Account portal (R1.6) via controlled read-only CRM sync.
- **Dependencies & Guardrails:** Depends on R1.6 customer login (AUTH-03) and CRM-03.
- **Acceptance Criteria:** Logged-in customers can view their active quotation/trip status cleanly.
- **PO Notes:** Existing CRM Backlog

### CRM-09 — CRM conversion & repeat-business analytics
- **Area / Phase:** Phase 3: Quotes & Retention | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Track lead-to-first-response time, quote-to-booking conversion rate, and repeat traveller share.
- **Dependencies & Guardrails:** Requires baseline metrics from CRM Phase 2.
- **Acceptance Criteria:** Leadership dashboard reporting response SLA, conversion funnel, and repeat rate.
- **PO Notes:** Existing CRM Backlog
