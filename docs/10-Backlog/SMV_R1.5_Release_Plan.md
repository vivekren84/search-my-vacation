# Release 1.5 — Internal Team Access, Advisor Workspace & Brand Storytelling

**Release Theme:** Empower internal Journey Designers with authenticated access, a structured Lead Briefing View, and human-centric brand storytelling on the site.  
**Total Backlog Items:** 10  
**Status:** Approved (Baseline)

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 6 | Medium: 3 | Low: 1
- **Source Mix:** Existing Backlog: 6 | New PO / Website Gap Additions: 4

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **V-08** | Authentication / accounts | Authentication roadmap umbrella (Internal Staff Scope) | Keep | High | Approved (Baseline) | Existing Backlog (Scoped to Staff Auth) |
| **AUTH-01** | Internal team | Internal team login | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **AUTH-04** | Both / access control | Role-based permissions (RBAC) | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **AUTH-05** | Internal team | Internal administration tools | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.3) |
| **GAP-04** | Internal operations | Structured Journey Designer Handoff Briefing View | New (PO) | High | Approved (Baseline) | PO Gap Addition |
| **PO-05** | Brand / Trust | Journey Designer Profiles & Authentic Media Storytelling | New (PO) | Medium | Approved (Baseline) | World-Class PO Enhancement |
| **GAP-03** | Traveller utility | Shareable / Exportable Journey Synopsis (Read-Only Link & PDF) | New (PO) | High | Approved (Baseline) | PO Gap Addition |
| **GAP-05** | Growth / SEO | SEO & Rich Open Graph Previews for Regional Pages | New (PO) | Medium | Approved (Baseline) | PO Gap Addition |
| **G-02** | Governance | Email provider operational playbook (Resend) | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.8) |
| **HP-04** | Homepage | Remove or resolve unused legacy Experiences components | Keep | Low | Approved (Baseline) | Existing Backlog (Moved from R1.7) |

---

## 3. Detailed Requirement Specifications

### V-08 — Authentication roadmap umbrella (Internal Staff Scope)
- **Area / Phase:** Authentication / accounts | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Establish architectural boundary separating internal staff authentication from future traveller accounts (preserving BOUND-01).
- **Dependencies & Guardrails:** Define staff identity provider, session lifecycle, and audit logging.
- **Acceptance Criteria:** Approved auth architecture separating internal team login from public OTP flow.
- **PO Notes:** Existing Backlog (Scoped to Staff Auth)

### AUTH-01 — Internal team login
- **Area / Phase:** Internal team | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide secure login for SMV Journey Designers, editors, and operations staff.
- **Dependencies & Guardrails:** Depends on V-08 auth setup.
- **Acceptance Criteria:** Authorized staff can sign in securely to internal SMV workspace.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### AUTH-04 — Role-based permissions (RBAC)
- **Area / Phase:** Both / access control | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Define and enforce least-privilege roles (e.g., Admin, Journey Designer, Content Editor) and data access scopes.
- **Dependencies & Guardrails:** Document role matrix and audit trail requirements.
- **Acceptance Criteria:** Users can only view and modify records permitted by their assigned role.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### AUTH-05 — Internal administration tools
- **Area / Phase:** Internal team | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Build internal admin views for managing team access, destination/content publishing states, and operational settings.
- **Dependencies & Guardrails:** Split user admin vs. catalog operations cleanly.
- **Acceptance Criteria:** Admins can onboard/offboard staff and manage served destination states without code deploys.
- **PO Notes:** Existing Backlog (Moved from R1.3)

### GAP-04 — Structured Journey Designer Handoff Briefing View
- **Area / Phase:** Internal operations | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide Journey Designers with a single internal briefing screen displaying the traveller's Passport inputs, extracted free-text themes (P-05), weighted scores (P-08), comfort signals (PO-03), and Synopsis ID.
- **Dependencies & Guardrails:** Depends on AUTH-01 and AUTH-04.
- **Acceptance Criteria:** Advisors can view the complete traveller brief before initiating WhatsApp/phone consultation.
- **PO Notes:** PO Gap Addition

### PO-05 — Journey Designer Profiles & Authentic Media Storytelling
- **Area / Phase:** Brand / Trust | **Disposition:** `New (PO)` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Introduce human Journey Designer profiles on the site and upgrade Traveller Stories with real trip photo galleries and 'Design a journey like this' Passport pre-fill CTAs.
- **Dependencies & Guardrails:** Collect approved advisor bios/photos and traveller media permissions.
- **Acceptance Criteria:** Destination and story pages showcase real SMV specialists and one-click inspiration pre-fill.
- **PO Notes:** World-Class PO Enhancement

### GAP-03 — Shareable / Exportable Journey Synopsis (Read-Only Link & PDF)
- **Area / Phase:** Traveller utility | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Allow verified travellers to copy a private read-only link or export a clean print/PDF version of their Journey Synopsis to share with family/co-travellers.
- **Dependencies & Guardrails:** Ensure shared links expose non-PII Synopsis content safely.
- **Acceptance Criteria:** Travellers can generate a clean shareable link or PDF of their Synopsis in one click.
- **PO Notes:** PO Gap Addition

### GAP-05 — SEO & Rich Open Graph Previews for Regional Pages
- **Area / Phase:** Growth / SEO | **Disposition:** `New (PO)` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Add structured Schema.org (TouristDestination / TravelAgency) metadata and dynamic Open Graph social preview cards so shared destination and Synopsis links render richly on WhatsApp.
- **Dependencies & Guardrails:** Verify meta tags across pilot regional routes.
- **Acceptance Criteria:** Sharing any destination or Synopsis URL on WhatsApp displays custom title, description, and preview image.
- **PO Notes:** PO Gap Addition

### G-02 — Email provider operational playbook (Resend)
- **Area / Phase:** Governance | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Document Resend domain authentication (SPF/DKIM/DMARC), sender reputation monitoring, template versioning, and delivery troubleshooting.
- **Dependencies & Guardrails:** Audit current Resend production config.
- **Acceptance Criteria:** Complete operational runbook stored in repository governance docs.
- **PO Notes:** Existing Backlog (Moved from R1.8)

### HP-04 — Remove or resolve unused legacy Experiences components
- **Area / Phase:** Homepage | **Disposition:** `Keep` | **Priority:** `Low` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Audit and remove unused legacy Experiences/ExperienceCard files while preserving active Journey Invitations components.
- **Dependencies & Guardrails:** Verify zero active imports.
- **Acceptance Criteria:** Dead legacy component files removed from codebase cleanly.
- **PO Notes:** Existing Backlog (Moved from R1.7)
