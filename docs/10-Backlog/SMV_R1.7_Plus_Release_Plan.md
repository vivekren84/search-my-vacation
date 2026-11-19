# Release 1.7+ — Interactive Itinerary Builder, AI Co-Pilot & Conditional Playbooks

**Release Theme:** Evolve from Journey Synopsis into rich interactive itinerary presentation, AI-assisted itinerary drafting, and conditional third-party integrations.  
**Total Backlog Items:** 11  
**Status:** Approved (Baseline)

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 0 | Medium: 3 | Low: 8
- **Source Mix:** Existing Backlog: 11 | New PO / Website Gap Additions: 0

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **V-09** | Itinerary planning | Itinerary Builder / Lovable AI investigation & prototype | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **ACCT-05** | Customer | Rich interactive itinerary presentation | Reshape | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **AI-05** | Recommendations / AI | AI-assisted destination & route narrative drafting | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **G-01** | Governance | Payment gateway operational playbook | Defer | Low | Approved (Baseline) | Conditional Playbook (Moved from R1.8) |
| **G-03** | Governance | WhatsApp Business API playbook | Defer | Low | Approved (Baseline) | Conditional Playbook (Moved from R1.8) |
| **G-05** | Governance | Maps API operational playbook | Defer | Low | Approved (Baseline) | Conditional Playbook (Moved from R1.8) |
| **G-06** | Governance | Third-party service operating standard alignment | Keep | Low | Approved (Baseline) | Existing Backlog (Moved from R1.8) |
| **N-01** | Governance / housekeeping | Release tracker naming cleanup | Separate | Low | Approved (Baseline) | Process Hygiene (Separate) |
| **N-02** | Governance / housekeeping | Backlog canonical-copy note | Separate | Low | Approved (Baseline) | Process Hygiene (Separate) |
| **N-04** | Governance | Review Register 'Resolved' status convention | Separate | Low | Approved (Baseline) | Process Hygiene (Separate) |
| **N-05** | Journey Passport interaction | Destination entry mode toggle audit | Separate | Low | Approved (Baseline) | WS6 Follow-up (Separate) |

---

## 3. Detailed Requirement Specifications

### V-09 — Itinerary Builder / Lovable AI investigation & prototype
- **Area / Phase:** Itinerary planning | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Evaluate whether the Lovable AI itinerary builder or a custom interactive builder best supports SMV's consultative itinerary workflow.
- **Dependencies & Guardrails:** Define build-vs-buy criteria and advisor workflow fit before committing architecture.
- **Acceptance Criteria:** Documented architectural decision and validated prototype for interactive itineraries.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### ACCT-05 — Rich interactive itinerary presentation
- **Area / Phase:** Customer | **Disposition:** `Reshape` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Upgrade how proposed journeys and day-by-day narratives are presented to travellers (visual route timeline, stay highlights, pacing notes).
- **Dependencies & Guardrails:** Reshape scope based on V-09 outcome and Vivek's R1.4/R1.7 review.
- **Acceptance Criteria:** Travellers view interactive, mobile-friendly visual itineraries rather than static text blocks.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### AI-05 — AI-assisted destination & route narrative drafting
- **Area / Phase:** Recommendations / AI | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Use AI behind deterministic eligibility guardrails to draft personalized destination rationale and pacing narratives for human advisor review.
- **Dependencies & Guardrails:** Must never bypass served-destination rules or fabricate facts.
- **Acceptance Criteria:** AI generates high-quality draft rationale within deterministic guardrails.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### G-01 — Payment gateway operational playbook
- **Area / Phase:** Governance | **Disposition:** `Defer` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Document merchant KYC, PCI scope, webhook signatures, and refund/chargeback SOPs ONLY when online deposit/payment collection is scoped.
- **Dependencies & Guardrails:** Triggered only if payments enter product scope.
- **Acceptance Criteria:** Playbook authored prior to any payment gateway integration.
- **PO Notes:** Conditional Playbook (Moved from R1.8)

### G-03 — WhatsApp Business API playbook
- **Area / Phase:** Governance | **Disposition:** `Defer` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Document Meta business verification, message template approvals, and webhook ownership ONLY if upgrading from click-to-chat deep links (P-03) to Business API.
- **Dependencies & Guardrails:** Triggered only if automated WhatsApp API messaging is approved.
- **Acceptance Criteria:** Playbook authored prior to WhatsApp Business API provisioning.
- **PO Notes:** Conditional Playbook (Moved from R1.8)

### G-05 — Maps API operational playbook
- **Area / Phase:** Governance | **Disposition:** `Defer` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Document API key restrictions, quota/cost caps, and attribution licensing ONLY if interactive maps are selected for V-09/ACCT-05.
- **Dependencies & Guardrails:** Triggered only if Maps SDK is added.
- **Acceptance Criteria:** Playbook authored prior to Maps API enablement.
- **PO Notes:** Conditional Playbook (Moved from R1.8)

### G-06 — Third-party service operating standard alignment
- **Area / Phase:** Governance | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Ensure EBC templates reference the External Integration Definition of Done whenever a new vendor dependency is introduced.
- **Dependencies & Guardrails:** Lightweight process update.
- **Acceptance Criteria:** Standard EBC checklist updated with external integration gate.
- **PO Notes:** Existing Backlog (Moved from R1.8)

### N-01 — Release tracker naming cleanup
- **Area / Phase:** Governance / housekeeping | **Disposition:** `Separate` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Archive/reconcile historical R1.2 tracker filenames outside product release sprints.
- **Dependencies & Guardrails:** Non-product repo hygiene.
- **Acceptance Criteria:** Repository contains a single unambiguous release tracker structure.
- **PO Notes:** Process Hygiene (Separate)

### N-02 — Backlog canonical-copy note
- **Area / Phase:** Governance / housekeeping | **Disposition:** `Separate` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Establish single canonical backlog location in repo over ad-hoc working copies.
- **Dependencies & Guardrails:** Non-product repo hygiene.
- **Acceptance Criteria:** Team uses one canonical backlog source of truth.
- **PO Notes:** Process Hygiene (Separate)

### N-04 — Review Register 'Resolved' status convention
- **Area / Phase:** Governance | **Disposition:** `Separate` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Adopt standard 'Resolved' status across future review registers.
- **Dependencies & Guardrails:** Non-product repo hygiene.
- **Acceptance Criteria:** Review register template updated with Resolved status.
- **PO Notes:** Process Hygiene (Separate)

### N-05 — Destination entry mode toggle audit
- **Area / Phase:** Journey Passport interaction | **Disposition:** `Separate` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Confirm whether the known/discovery destination toggle question from Workstream 6 is already satisfied by current Passport UX.
- **Dependencies & Guardrails:** Quick UX audit; reopen only if user friction is observed.
- **Acceptance Criteria:** Closed with documented UX decision.
- **PO Notes:** WS6 Follow-up (Separate)
