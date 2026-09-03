# Provider Dependency Register

```text
Document Type : Governance Baseline — Operational Index
Persona       : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-002
Status        : Active — first edition. Ownership and Business Criticality fields
                are Tiger's drafted recommendation, pending Vivek's confirmation
                (business criticality and ownership are Product Owner authority,
                Project Instructions §10)
Effective Date: 26 August 2026
```

## Document Information

| Field | Value |
| --- | --- |
| Owner | Tiger (Programme and Delivery Lead) — maintenance; Vivek (Product Owner) — ratification of ownership/criticality assignments |
| Originating EBC | `EBC-R1.2-GOV-002` |
| Related documents | `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`; `docs/50-Operations/SMS-OTP-Operations-Runbook.md`; `docs/30-Governance/External-Integration-Definition-of-Done.md`; `docs/40-Retrospectives/Release-1.2-Lessons-Learned.md`; `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` |
| No confidential information | This register contains no credentials, API keys, passwords, secrets, account numbers, or personal contact details. Escalation contacts are role-based only. Environment-variable **names** may be referenced (Project Instructions §25 permits this); values never are. |

---

## 1. Purpose

Release 1.2 integrated or relied on at least nine external providers, documented individually and unevenly across engineering reviews, governance records, and the Product Owner's own operational knowledge — but never as a single consolidated inventory. `EBC-R1.2-GOV-001`'s work on the MSG91/DLT chain made this gap concrete: institutional knowledge about one provider's operational chain had to be reconstructed from three separate documents. This register is the single source of truth going forward, so that question never needs answering by re-reading the whole project history again.

This document indexes and cross-references existing documentation; it does not duplicate procedural detail already recorded elsewhere (Operations Runbooks, ADRs, Lessons Learned). Where such a document exists, this register links to it rather than restating its content.

---

## 2. How to Read This Register

Each provider entry uses the eleven standardized fields the originating EBC requires: Purpose, Category, Operational Owner, Engineering Owner, Current Status, Business Criticality, External Dependencies, Renewal Responsibility, Supporting Documentation, Known Operational Risks, and Recovery/Escalation Contact.

**A note on evidence quality.** Providers integrated at the code or infrastructure level (Supabase, Vercel, GitHub, MSG91, Resend) are documented here from verified repository evidence — environment variable names, `CLAUDE.md`'s technology table, prior governance records. Providers that are purely business/operational (GoDaddy, Zoho Mail, Zoho CRM, Zoho Books) have **no prior mention anywhere in this repository or its governance documentation** — confirmed by a repository-wide search during this EBC. For these, this register records only what can be stated without fabrication (their known purpose in an SMV context, a proposed category and criticality) and marks account-specific detail — plan tier, renewal dates, domain names, mailbox counts — as **"Not recorded — to be confirmed by Product Owner"** rather than inventing it. This is the same evidence discipline `EBC-R1.2-GOV-001`'s Operations Runbook applied to unobserved troubleshooting scenarios, applied here to unobserved provider accounts.

---

## 3. Business Criticality Classification Model

| Level | Meaning |
| --- | --- |
| **Critical** | Service unavailable prevents normal business operation. |
| **High** | Major feature unavailable but core platform remains operational. |
| **Medium** | Reduced capability with acceptable workarounds. |
| **Low** | Administrative or convenience service. |

Every classification below is Tiger's drafted recommendation, grounded in the provider's actual role as evidenced in the repository. None is self-ratifying — per Project Instructions §10, business criticality and risk acceptance are Product Owner authority; this register should be treated as a proposal for Vivek's confirmation, not a settled classification, until he has reviewed it.

---

## 4. Provider Inventory

### 4.1 Infrastructure

#### GoDaddy

| Field | Value |
| --- | --- |
| Purpose | Domain registration (and, presumptively, DNS hosting) for Search My Vacation's public domain |
| Category | Infrastructure |
| Operational Owner | Vivek (Product Owner) |
| Engineering Owner | None identified — no code or configuration in this repository references GoDaddy directly |
| Current Status | Active (inferred — the production site is live and reachable under a registered domain). Account tier, specific domain name(s), and renewal date are **not recorded** in any repository or governance document reviewed for this register |
| Business Criticality | **Critical** (proposed) — domain expiry or DNS misconfiguration would make the entire site unreachable regardless of Vercel/Supabase health |
| External Dependencies | None upstream. Downstream: DNS records here likely gate Vercel's custom-domain routing and may also gate Zoho Mail's MX/SPF configuration (unconfirmed — flagged in Section 6) |
| Renewal Responsibility | Vivek — **domain renewal date not recorded in this repository; recommend confirming and adding to this register** rather than relying on GoDaddy's own renewal-reminder emails alone |
| Supporting Documentation | None exists yet. This is a gap this register surfaces, not fills — see Section 7 recommendation |
| Known Operational Risks | Domain expiry (total outage); DNS misconfiguration (partial or total outage); no documented secondary/backup DNS provider |
| Recovery / Escalation Contact | Product Owner (domain account holder) → GoDaddy support |

#### Vercel

| Field | Value |
| --- | --- |
| Purpose | Hosting and deployment platform for the Next.js application |
| Category | Infrastructure |
| Operational Owner | Vivek (Product Owner / account holder) |
| Engineering Owner | Rad (Engineering and Implementation Specialist) |
| Current Status | Active — confirmed in `docs/15-AI-Operating-Model/CLAUDE.md`'s technology table ("Hosting \| Vercel \| Keep server/client boundaries and environment-variable exposure compatible with the deployment model"). Specific project name, plan tier, and team configuration are **not recorded** in documentation reviewed for this register |
| Business Criticality | **Critical** (proposed) — hosting outage or misconfiguration takes the entire public site offline |
| External Dependencies | GitHub (deployment is git-triggered); environment variables configured in Vercel gate every other provider integration (Supabase, MSG91, Resend) at runtime |
| Renewal Responsibility | Vivek (billing/plan); no renewal date recorded in this repository |
| Supporting Documentation | `docs/15-AI-Operating-Model/CLAUDE.md` (architecture principles table); no dedicated Vercel operations runbook exists yet |
| Known Operational Risks | Environment-variable misconfiguration across environments (production vs. preview) — the exact failure class the OTP provider's fail-closed design was built to survive gracefully (`ADR-R1.2-WS5-001` §3.3); deployment-protection settings and team access are not documented anywhere in this repository |
| Recovery / Escalation Contact | Engineering (Rad) for deployment/build issues; Product Owner for account/billing issues; Vercel support |

#### GitHub

| Field | Value |
| --- | --- |
| Purpose | Source control and the trigger for Vercel deployments |
| Category | Infrastructure |
| Operational Owner | Vivek (account holder, `vivekren84`) |
| Engineering Owner | Rad |
| Current Status | Active — confirmed via `git remote -v` (`https://github.com/vivekren84/search-my-vacation.git`), and as this session's own Claude Project sync source |
| Business Criticality | **High** (proposed) — an outage or access loss would halt further deployments and governance-doc synchronisation, but the already-deployed production site on Vercel would continue serving traffic independently in the short term |
| External Dependencies | None upstream. Downstream: Vercel (deployment trigger), the Claude Project's GitHub sync source (`docs/04-UX/`, `docs/03-ADR/`, and other filtered paths) |
| Renewal Responsibility | Vivek (account/organisation billing, if any paid tier is in use — not confirmed in documentation reviewed) |
| Supporting Documentation | None dedicated; referenced implicitly throughout every EBC's Workspace Readiness Check (Project Instructions §14, §26) |
| Known Operational Risks | Branch protection / access-control configuration not documented anywhere in this repository; repository visibility (public/private) not confirmed in documentation reviewed for this register |
| Recovery / Escalation Contact | Engineering (Rad) for repository/CI issues; Product Owner for account access; GitHub support |

#### Supabase

| Field | Value |
| --- | --- |
| Purpose | Primary application database (PostgreSQL) and backend-as-a-service layer — Journey Passport leads, OTP challenge state, and all other persisted application data |
| Category | Infrastructure |
| Operational Owner | Vivek (account holder) |
| Engineering Owner | Rad (Archie holds architecture authority over schema/migration decisions, per Project Instructions §5) |
| Current Status | Active — confirmed via `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` in `web/.env.example`, and via `docs/15-AI-Operating-Model/CLAUDE.md`'s technology table ("Data and persistence \| Supabase and PostgreSQL \| Use additive, reviewed migrations; apply least privilege and Row Level Security where applicable") |
| Business Criticality | **Critical** (proposed) — an outage or misconfiguration prevents all lead capture, OTP verification, and any other database-backed feature; this is the single largest concentration of business data risk of any provider in this register |
| External Dependencies | None upstream (foundational data layer). Every application feature depends on it downstream |
| Renewal Responsibility | Vivek (billing/plan tier — not confirmed in documentation reviewed) |
| Supporting Documentation | `docs/15-AI-Operating-Model/CLAUDE.md` (architecture principles); individual migration files under `supabase/migrations/`; no dedicated Supabase operations runbook exists yet |
| Known Operational Risks | A hardcoded `EXPECTED_SUPABASE_URL` guard exists in the repository specifically to prevent ever pointing at the wrong Supabase project (`EBC-R1.2-WS5-04A-RAD` §9) — a deliberate, already-implemented mitigation, not an open risk; migration discipline (additive-only, per `CLAUDE.md`) is a standing principle, not yet backed by an automated enforcement check as far as this review found; Row Level Security posture across all tables has not been comprehensively audited in any document reviewed for this register |
| Recovery / Escalation Contact | Engineering (Rad) for schema/query issues; Archie for architecture-level data concerns; Product Owner for account/billing; Supabase support |

### 4.2 Communications

#### MSG91

| Field | Value |
| --- | --- |
| Purpose | SMS delivery provider for Journey Passport OTP verification |
| Category | Communications |
| Operational Owner | Vivek (account holder, DLT-registration Authorised Representative) |
| Engineering Owner | Rad |
| Current Status | **Production-validated** (27-Aug-2026) — Principal Entity approved, PE–TM Chain approved and activated, Sender Header `SMVTRV` verified, DLT Template validated, and a real, application-originated end-to-end OTP send → handset delivery → verification → Journey Passport completion cycle confirmed successfully by the Product Owner (`EBC-R1.2-WS5-GOV-07-TIGER-...`). Formal Keerthi functional QA remains outstanding. See `docs/10-Backlog/RELEASE-1.2.md` Workstream 5 for the live status and `docs/50-Operations/SMS-OTP-Operations-Runbook.md` for the full onboarding sequence |
| Business Criticality | **High → recommend escalating to Critical** (proposed) — OTP verification is now the confirmed, functioning gate for Journey Passport lead capture; the wider site and other lead-capture paths (e.g. the pre-existing Callback Request feature, `EBC-013`) remain operational independently, which is why this is not classified outright Critical, but the condition this register previously named for escalation ("once OTP becomes the sole or primary Journey Passport lead-capture gate in production") has now effectively been reached pending Keerthi's QA and Product Acceptance — recommend Vivek confirm the final classification |
| External Dependencies | Jio TrueConnect DLT chain (Principal Entity, Sender Header, Template, PE–TM Chain — see the External Approval Register, Section 5) — chain now complete |
| Renewal Responsibility | Vivek — DLT Sender Header/Template renewal cadence not yet established; to be added once known |
| Supporting Documentation | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` (full setup/troubleshooting, marked validated in production); `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md` (architecture); `EBC-R1.2-WS5-04A-RAD`, `-04B-RAD`, `-05-RAD`, `IMP-02-RAD`, `IMP-03-RAD` (configuration review and production integration investigation, Claude Project only) |
| Known Operational Risks | See `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §3 in full — the Template Missing/Invalid and Sender ID risk categories are no longer hypothetical: `EBC-R1.2-WS5-05-RAD` confirmed a real occurrence (a malformed `SMS_PROVIDER_TEMPLATE_ID`, now corrected) and its resolution is recorded there. The previously open question of whether MSG91's SendOTP API requires an explicit Principal Entity parameter is resolved in practice — the confirmed live send succeeded without one. Remaining, unresolved: the OTP-expiry wording mismatch between the DLT-approved template text ("valid for 10 minutes") and the application's configured 5-minute expiry (`EBC-R1.2-WS5-05-RAD` §6) — a Product Owner decision, not yet made |
| Recovery / Escalation Contact | Engineering (Rad) for integration/code issues; Product Owner (Authorised Representative) for DLT/account-level issues; MSG91 support; Jio TrueConnect support for DLT-platform-side issues |

#### Jio TrueConnect DLT

| Field | Value |
| --- | --- |
| Purpose | India's Distributed Ledger Technology (DLT) regulatory registration platform, mandatory for sending commercial SMS to Indian mobile numbers. Not itself a messaging provider — it is the regulatory chain MSG91's SMS delivery depends on |
| Category | Communications (regulatory/registration dependency, not a runtime service) |
| Operational Owner | Vivek (registered Authorised Representative, per the executed Letter of Authority) |
| Engineering Owner | None — this is entirely an operational/regulatory dependency with no code representation |
| Current Status | Chain **complete** — Principal Entity Approved (24-Aug-2026, Registration Request Number `96220832`); PE–TM Chain Approved and Activated; Sender Header `SMVTRV` Verified; DLT Template `Search_My_Vacation_OTP` Verified by DLT (27-Aug-2026). See `docs/10-Backlog/RELEASE-1.2.md` Workstream 5, "DLT Registration Milestone Log" |
| Business Criticality | **High** (proposed) — same tier as MSG91; see MSG91's entry above for the recommended escalation-to-Critical discussion, since this chain is what makes MSG91's production capability possible at all |
| External Dependencies | TRAI (Telecom Regulatory Authority of India) regulatory framework; no committed SLA from Jio/TRAI for any approval step |
| Renewal Responsibility | Vivek — DLT registration fee (₹5,900/year, per `docs/09-Development/EBC-R1.2-WS5-04-TIGER-DLT-Registration-External-Dependency-Transition.md`) payable annually; exact renewal date not yet recorded in this register — recommend adding once the first payment's anniversary is confirmed |
| Supporting Documentation | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` (full onboarding sequence); `docs/09-Development/EBC-R1.2-WS5-04-TIGER-DLT-Registration-External-Dependency-Transition.md`; `docs/40-Retrospectives/Release-1.2-Lessons-Learned.md` |
| Known Operational Risks | No committed approval SLA at any chain step; PE–TM Chain requirement was, until `EBC-R1.2-GOV-001`, undocumented anywhere in project governance (now closed as a gap, see Lessons Learned §3.3); registration fee non-payment within the payment window (~6 hours) cancels the registration and invalidates submitted documents |
| Recovery / Escalation Contact | Product Owner (Authorised Representative — the only party who can act on this registration, per its Letter of Authority) → Jio TrueConnect support |

#### Zoho Mail

| Field | Value |
| --- | --- |
| Purpose | Business email hosting (presumed — no repository or governance document reviewed for this register mentions Zoho Mail; included here solely because `EBC-R1.2-GOV-002` names it explicitly) |
| Category | Communications |
| Operational Owner | Vivek (Product Owner) — **to be confirmed** |
| Engineering Owner | None identified — no code in this repository integrates Zoho Mail directly. Note: the application's own transactional/notification email is sent via **Resend** (`RESEND_API_KEY`, `web/.env.example`; `docs/15-AI-Operating-Model/CLAUDE.md`'s "Notifications" row) — a separate provider from Zoho Mail, added to this register in Section 4.2 below since it is an actual, code-integrated communications dependency this register's stated purpose ("inventories every external provider currently used") would otherwise miss |
| Current Status | **Not recorded** — no confirmation of active use, mailbox count, or plan tier exists in any document reviewed |
| Business Criticality | **Not classified — recommend High pending confirmation** (business email is typically a primary customer-facing and internal communication channel) |
| External Dependencies | Likely DNS (MX/SPF/DKIM records), plausibly hosted at GoDaddy — **unconfirmed**, flagged as a verification item in Section 6 |
| Renewal Responsibility | Not recorded — to be confirmed by Product Owner |
| Supporting Documentation | None exists |
| Known Operational Risks | Cannot be assessed without confirmed operational detail — recorded as an open item in Section 6 rather than speculated upon |
| Recovery / Escalation Contact | Product Owner → Zoho support |

#### Resend *(added — see note above; not on the EBC's minimum list, but a verified, code-integrated provider)*

| Field | Value |
| --- | --- |
| Purpose | Transactional/server-side email delivery (e.g. lead notification emails), per `RESEND_API_KEY` in `web/.env.example` and `docs/15-AI-Operating-Model/CLAUDE.md`'s "Notifications \| Server-side email integration \| Keep provider keys and recipient configuration on the server; degrade safely when notification configuration is unavailable" |
| Category | Communications |
| Operational Owner | Vivek (account holder) |
| Engineering Owner | Rad |
| Current Status | Active (environment variable present; exact usage sites not audited as part of this documentation-only EBC) |
| Business Criticality | **Medium** (proposed) — CLAUDE.md's own principle ("degrade safely when notification configuration is unavailable") indicates lead/data capture does not depend on this provider; an outage delays team awareness of new leads, it does not lose them, since Supabase remains the system of record |
| External Dependencies | Domain verification (SPF/DKIM/DMARC) — standard for transactional email providers; specific verification status not confirmed in documentation reviewed |
| Renewal Responsibility | Vivek (billing/plan) — not confirmed in documentation reviewed |
| Supporting Documentation | `docs/15-AI-Operating-Model/CLAUDE.md`; no dedicated runbook exists yet — recommended in `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.2 (Email Provider Playbook) |
| Known Operational Risks | No dedicated deliverability/reputation monitoring documented; no dedicated runbook exists (see Section 7 recommendation) |
| Recovery / Escalation Contact | Engineering (Rad) for integration issues; Product Owner for account/billing; Resend support |

### 4.3 Business Systems

#### Zoho CRM

| Field | Value |
| --- | --- |
| Purpose | Presumed lead/customer relationship management (no repository or governance document reviewed for this register confirms actual usage or integration) |
| Category | Business Systems |
| Operational Owner | Vivek (Product Owner) — **to be confirmed** |
| Engineering Owner | None identified — no code in this repository integrates Zoho CRM |
| Current Status | **Not recorded** |
| Business Criticality | **Not classified — recommend Medium pending confirmation** (per the criticality model, a business system with workarounds — e.g. working directly from Supabase lead data — would be Medium rather than Critical, absent evidence of tighter dependency) |
| External Dependencies | Possibly Supabase lead data, if any sync/export process exists — **unconfirmed**, no such integration found in this codebase |
| Renewal Responsibility | Not recorded — to be confirmed by Product Owner |
| Supporting Documentation | None exists |
| Known Operational Risks | Cannot be assessed without confirmed operational detail |
| Recovery / Escalation Contact | Product Owner → Zoho support |

#### Zoho Books

| Field | Value |
| --- | --- |
| Purpose | Presumed accounting/invoicing (no repository or governance document reviewed for this register confirms actual usage) |
| Category | Business Systems |
| Operational Owner | Vivek (Product Owner) — **to be confirmed** |
| Engineering Owner | None identified — no code in this repository integrates Zoho Books |
| Current Status | **Not recorded** |
| Business Criticality | **Not classified — recommend Low** per the criticality model's own example ("Administrative or convenience service"), pending confirmation this isn't tied to a regulatory filing obligation that would raise it |
| External Dependencies | None identified |
| Renewal Responsibility | Not recorded — to be confirmed by Product Owner |
| Supporting Documentation | None exists |
| Known Operational Risks | Cannot be assessed without confirmed operational detail |
| Recovery / Escalation Contact | Product Owner → Zoho support |

---

## 5. External Approval Register

Cross-referencing rather than duplicating the procedures in `docs/50-Operations/SMS-OTP-Operations-Runbook.md` and `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`.

| Approval | Provider | Status (as of 26-Aug-2026) | Procedure documented in |
| --- | --- | --- | --- |
| DLT Registration (Principal Entity) | Jio TrueConnect | Approved (24-Aug-2026, Ref. `96220832`) | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §2, step 2 |
| PE–TM Chain Approval | Jio TrueConnect / MSG91 | **Approved and Activated** (27-Aug-2026) | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §2, steps 5–6; §3.1 |
| Sender Header Approval | Jio TrueConnect / MSG91 | **Verified** (`SMVTRV`, 27-Aug-2026) | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §2, step 3; §3.4 |
| Template Approval | Jio TrueConnect / MSG91 | **Verified by DLT** (`Search_My_Vacation_OTP`, 27-Aug-2026) | `docs/50-Operations/SMS-OTP-Operations-Runbook.md` §2, steps 4, 7–9; §3.2–3.3 |
| Billing Activation (DLT subscription) | Jio TrueConnect | Complete (24-Aug-2026) | `docs/10-Backlog/RELEASE-1.2.md`, DLT Registration Milestone Log |
| Domain Verification | GoDaddy (registrar) / Resend (transactional email) | Domain: presumed active (site is live); Resend: not confirmed | Not documented in a dedicated runbook — gap noted in Section 7 |
| OAuth Verification | None currently — no OAuth provider is integrated in this repository | Not applicable | Forward reference only: `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.4 (OAuth Provider Playbook) |

---

## 6. Operational Risk Register

Per-provider risk detail already recorded in Section 4 is not repeated here; this section captures cross-provider risks that are only visible when the inventory is viewed as a whole — the specific reason this register exists.

| Risk | Providers Affected | Expected Failure Impact | Existing Mitigation | Future Improvement Opportunity |
| --- | --- | --- | --- | --- |
| Undocumented DNS dependency chain — GoDaddy (registrar) likely underlies both Vercel's custom domain and any Zoho Mail MX/SPF configuration, but this chain has never been mapped in any document | GoDaddy, Vercel, Zoho Mail | A DNS misconfiguration at GoDaddy could silently degrade or break site availability, email deliverability, or both, with no existing document to diagnose against | None documented | Produce a DNS dependency map as part of a future Infrastructure Operations Runbook (candidate for `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`) |
| No dedicated Operations Runbook exists for Vercel, Supabase, GitHub, Zoho Mail, Zoho CRM, or Zoho Books | All except MSG91/Jio TrueConnect DLT | An incident on any of these providers has no documented diagnostic/escalation procedure to follow, unlike the MSG91/DLT chain (which now has one, per `EBC-R1.2-GOV-001`) | None beyond this register's ownership/contact fields | Extend the Operations Runbook pattern established in `EBC-R1.2-GOV-001` to the remaining Critical/High providers, starting with Supabase and Vercel given their Critical classification |
| Business-system providers (Zoho Mail, Zoho CRM, Zoho Books) have zero prior documentation anywhere in this project | Zoho Mail, Zoho CRM, Zoho Books | Operational knowledge about these systems exists, if at all, only informally with the Product Owner — the exact failure mode `EBC-R1.2-GOV-001` was raised to prevent for the DLT chain | This register itself, as a first documentation step | Product Owner to supply confirmed operational detail (account tier, ownership, renewal dates) so these entries can move from "not recorded" to fully documented |
| Single-person operational ownership | GoDaddy, Vercel (billing), Supabase (billing), all DLT/MSG91 registration steps, all three Zoho systems | Vivek is the sole named Operational Owner or Authorised Representative across nearly every provider in this register; his unavailability during an incident has no documented backup/delegate | The Letter of Authority for DLT names Vivek specifically, by design (regulatory requirement) | Consider whether a delegate Authorised Representative or secondary account admin is warranted for non-regulatory providers (Vercel, Supabase, GitHub), as a Release 1.3 governance recommendation |

---

## 7. Future Provider Roadmap (Informational Only)

The following are anticipated future integrations named in `EBC-R1.2-GOV-002`. This section is planning information only and does not authorise implementation, architecture work, or provider selection — that authority remains with the Product Owner and, for architecture, Archie, per the standard EBC process.

| Provider | Likely Category | Notes |
| --- | --- | --- |
| Razorpay | Business Systems / Payments | Candidate India-first payment gateway; see `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.1 (Payment Gateway Playbook) |
| Stripe | Business Systems / Payments | Candidate international payment gateway; same playbook applies |
| Google Maps Platform | Infrastructure / Communications | Candidate for destination visualisation or itinerary mapping; see `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.5 (Maps API Playbook) |
| WhatsApp Business | Communications | Candidate traveller-communication channel; see `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.3 (WhatsApp Provider Playbook) |
| Google OAuth | Infrastructure / Identity | Candidate sign-in method; see `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.4 (OAuth Provider Playbook) |
| Apple Sign-In | Infrastructure / Identity | Candidate sign-in method; same playbook applies |
| Microsoft Authentication | Infrastructure / Identity | Candidate sign-in method; same playbook applies |

None of the above has an approved EBC, architecture review, or Product Owner commitment as of this register's effective date. They are listed for planning visibility only, per `EBC-R1.2-GOV-002`'s explicit instruction.

---

## 8. Open Items for Product Owner Confirmation

Consolidated from Sections 4–6, for ease of follow-up:

1. GoDaddy: confirm registered domain name(s), plan tier, and renewal date.
2. Vercel: confirm project name, plan tier, and team/access configuration.
3. GitHub: confirm repository visibility (public/private) and any paid-tier features in use.
4. Zoho Mail: confirm whether actually in use, its purpose (business email hosting is assumed), mailbox count, plan tier, and renewal date; confirm DNS dependency on GoDaddy.
5. Zoho CRM: confirm whether actually in use, its purpose, and whether any integration with Supabase lead data exists.
6. Zoho Books: confirm whether actually in use and its purpose.
7. Resend: confirm domain verification status (SPF/DKIM/DMARC) and plan tier.
8. Consider whether a secondary/delegate operational owner is warranted given Vivek's sole ownership across nearly every provider (Section 6).

---

## 9. Maintenance

This register should be updated whenever a provider is added, removed, or changes status — following Project Instructions §32 (update canonical documentation in place; do not create competing versions). Business criticality and ownership changes should be confirmed with the Product Owner before being recorded as settled rather than proposed.

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only governance baseline, per `EBC-R1.2-GOV-002`. No application code, infrastructure configuration, credentials, deployments, or provider settings were modified in producing this document. No confidential information, credentials, or personal contact details are recorded.*
