# Release 1.6 — Customer Accounts, Family Trip Board & Advanced Intelligence

**Release Theme:** Enable optional traveller accounts, collaborative family trip shortlists, and deeper multi-destination & seasonal intelligence.  
**Total Backlog Items:** 12  
**Status:** Approved (Baseline)

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 4 | Medium: 6 | Low: 2
- **Source Mix:** Existing Backlog: 11 | New PO / Website Gap Additions: 1

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-02** | Customer | Optional customer registration | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **AUTH-03** | Customer | Customer login | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **ACCT-01** | Customer | Customer profile & family preferences | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **ACCT-02** | Customer | Wishlist / Saved Destinations | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **PO-04** | Collaboration / Growth | Collaborative 'Family Decision Board' (Shareable Shortlist) | New (PO) | High | Approved (Baseline) | World-Class PO Enhancement |
| **ACCT-03** | Customer | Saved enquiries & Journey Synopses | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **ACCT-04** | Customer | Returning visitor recognition | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **ACCT-06** | Customer | Seasonal travel notes / Newsletter subscription | Keep | Low | Approved (Baseline) | Existing Backlog (Moved from R1.4) |
| **V-02** | Destination intelligence | Journey Clusters (internal recommendation grouping) | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **V-04** | Destination intelligence | Journey feasibility intelligence | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **AI-04** | Recommendations / AI | Consented traveller preference learning | Keep | Low | Approved (Baseline) | Existing Backlog |
| **G-04** | Governance | OAuth / Third-party sign-in operational playbook | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.8) |

---

## 3. Detailed Requirement Specifications

### AUTH-02 — Optional customer registration
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Allow travellers to optionally create an account (without forcing registration before Passport completion) with clear consent and verification.
- **Dependencies & Guardrails:** Maintain strict separation from Passport OTP (BOUND-01).
- **PO Mandate (Nov 2026):** **Both Mobile (E.164) and Email are strictly mandatory fields** for customer registration (no email-only or phone-only accounts). This guarantees high-trust dual-channel communication and seamless reconciliation with inbound Journey Passport submissions.
- **Acceptance Criteria:** Travellers can register voluntarily to save trips and enquiries across devices, providing mandatory verified mobile and mandatory email.
- **PO Notes:** Existing Backlog (Moved from R1.4). PO Mandate recorded: Mandatory Email & Mobile.

### AUTH-03 — Customer login & seamless password reset
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide seamless customer sign-in to access saved shortlists, Journey Synopses, and past enquiries. Includes seamless self-service "Forgot Password" workflow shared with the platform authentication engine.
- **Dependencies & Guardrails:** Include secure session management, passwordless/OAuth options, and single-channel OTP reset.
- **Acceptance Criteria:** 
  1. Returning travellers can log in and retrieve their saved journey history.
  2. **Seamless Forgot Password:** Travellers can reset forgotten passwords via `/auth/forgot-password` using single-channel OTP verification dispatched to their verified mobile or email.
- **PO Notes:** Existing Backlog (Moved from R1.4). Unified password reset architecture.

### ACCT-01 — Customer profile & family preferences
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Allow logged-in travellers to maintain core profile details and default family comfort/dietary preferences (PO-03).
- **Dependencies & Guardrails:** Define minimal PII retention and self-service edit/delete controls.
- **Acceptance Criteria:** Travellers can update profile and default travel preferences once and reuse them.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### ACCT-02 — Wishlist / Saved Destinations
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Enable travellers to bookmark/heart destinations and inspiration ideas (persisting pre-login via local session and syncing upon login).
- **Dependencies & Guardrails:** Support guest-to-authenticated merge.
- **Acceptance Criteria:** Users can save destinations while browsing and access them across sessions.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### PO-04 — Collaborative 'Family Decision Board' (Shareable Shortlist)
- **Area / Phase:** Collaboration / Growth | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Allow travellers to bundle 2–3 shortlisted regions into a mobile-first shareable board where family members can view and vote/react via WhatsApp link.
- **Dependencies & Guardrails:** Builds on ACCT-02 wishlist data model.
- **Acceptance Criteria:** A user can share a 3-destination shortlist link where family members can upvote favorites.
- **PO Notes:** World-Class PO Enhancement

### ACCT-03 — Saved enquiries & Journey Synopses
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Display a traveller's past submitted Journey Passports and generated Synopses inside their account.
- **Dependencies & Guardrails:** Link verified phone/account identity safely with explicit consent.
- **Acceptance Criteria:** Logged-in travellers can view all their previous Synopses and enquiry statuses.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### ACCT-04 — Returning visitor recognition
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Recognize returning logged-in travellers (and consented local sessions) to personalize greetings and resume unfinished Passport drafts.
- **Dependencies & Guardrails:** Comply with cookie/storage consent rules.
- **Acceptance Criteria:** Returning visitors see relevant welcome-back context and can resume saved progress.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### ACCT-06 — Seasonal travel notes / Newsletter subscription
- **Area / Phase:** Customer | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide opt-in subscription for curated seasonal travel dispatches with granular preferences and one-click unsubscribe.
- **Dependencies & Guardrails:** Integrate with Resend (G-02).
- **Acceptance Criteria:** Visitors can subscribe/unsubscribe cleanly with recorded opt-in consent.
- **PO Notes:** Existing Backlog (Moved from R1.4)

### V-02 — Journey Clusters (internal recommendation grouping)
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Group destinations internally by theme, contrast, and pacing to improve multi-stop circuit recommendations without exposing internal cluster names.
- **Dependencies & Guardrails:** Enforce UI guardrail hiding internal taxonomy labels.
- **Acceptance Criteria:** Recommendation engine uses internal clusters to propose cohesive multi-region trips.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### V-04 — Journey feasibility intelligence
- **Area / Phase:** Destination intelligence | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide honest operational guidance on route pacing, transfer times, and seasonal accessibility for multi-destination combinations.
- **Dependencies & Guardrails:** Present as advisory guidance rather than rigid guarantees.
- **Acceptance Criteria:** Synopsis warns travellers when selected regions/durations have tight transfers or off-season constraints.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### AI-04 — Consented traveller preference learning
- **Area / Phase:** Recommendations / AI | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Use explicitly consented historical preferences from logged-in travellers to refine future destination suggestions.
- **Dependencies & Guardrails:** Requires ACCT-01/ACCT-03 and opt-in consent controls.
- **Acceptance Criteria:** Repeat travellers receive tailored recommendations reflecting opted-in preferences.
- **PO Notes:** Existing Backlog

### G-04 — OAuth / Third-party sign-in operational playbook
- **Area / Phase:** Governance | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Document OAuth provider registration, redirect URIs, secret rotation, and token revocation if Google/Apple sign-in is enabled for AUTH-02/03.
- **Dependencies & Guardrails:** Write prior to production launch of OAuth sign-in.
- **Acceptance Criteria:** OAuth security and operations runbook approved before release.
- **PO Notes:** Existing Backlog (Moved from R1.8)
