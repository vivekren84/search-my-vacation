# EBC-R1.2-GOV-002-TIGER — Provider Dependency Register & External Service Governance Baseline

```text
Document Type : Governance Execution Record (documentation only — no code, infrastructure,
                configuration, credentials, deployments, or provider settings modified)
EBC ID        : EBC-R1.2-GOV-002
Persona       : Tiger — Programme and Delivery Lead
Reviewers     : Vivek (Product Owner), Archie (Architecture)
Priority      : Medium
Release       : Release 1.2
Status        : Complete — Documentation Delivered
Date          : 26 August 2026
```

---

## 0. Workspace Readiness Check

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation`, remote `origin` → `https://github.com/vivekren84/search-my-vacation.git`.
- Branch: `feature/ebc-r1.2-ws5-03-otp-verification` (unchanged before and after this EBC).
- HEAD: `77d3a91` (unchanged before and after this EBC — no commit was made).
- Working tree carried pre-existing, unrelated changes (Workstream 5/6 engineering work, prior governance documents from `EBC-R1.2-GOV-001`) — none touched by this EBC.
- No branch created or switched. No commits, pushes, installs, or migrations executed.

## 0.1 Documents Reviewed

- `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5 section, DLT Registration Milestone Log) — MSG91/Jio TrueConnect DLT current status.
- `docs/09-Development/EBC-R1.2-WS5-04-TIGER-DLT-Registration-External-Dependency-Transition.md` — DLT registration fee/timeline detail.
- `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`, `docs/50-Operations/SMS-OTP-Operations-Runbook.md`, `docs/40-Retrospectives/Release-1.2-Lessons-Learned.md`, `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` (all produced under `EBC-R1.2-GOV-001`) — cross-referenced, not duplicated.
- `docs/15-AI-Operating-Model/CLAUDE.md` — technology/architecture principles table (Supabase, Vercel, notifications rows).
- `web/.env.example` — environment variable names only, confirming which providers are actually code-integrated (Supabase, Resend, MSG91). No secret values read, per Project Instructions §25.
- Repository-wide search (`docs/`) for "GoDaddy," "Zoho," "Resend," "Vercel," "Supabase" — confirmed GoDaddy and Zoho (Mail, CRM, Books) have **no prior mention anywhere** in this repository's documentation.

---

## 1. Purpose

This record documents execution of `EBC-R1.2-GOV-002`, which produced `docs/30-Governance/Provider-Dependency-Register.md` — a single consolidated operational inventory of every external provider supporting Search My Vacation, standardising ownership, criticality, dependency, and escalation information that previously existed only individually, unevenly, or (for several providers) not at all.

---

## 2. Activity Execution Summary

**Activity 1 — Create Provider Dependency Register.** Complete: `docs/30-Governance/Provider-Dependency-Register.md` created.

**Activity 2 — Document Current Providers.** Complete for all nine providers named in the EBC (GoDaddy, Vercel, GitHub, Supabase, MSG91, Jio TrueConnect DLT, Zoho Mail, Zoho CRM, Zoho Books). One additional provider, **Resend**, was added under Communications: it is not on the EBC's named list, but repository evidence (`RESEND_API_KEY` in `web/.env.example`; the "Notifications" row in `CLAUDE.md`'s technology table) confirms it is an actual, code-integrated communications dependency, and omitting a verified provider would work against the EBC's own stated objective ("inventories every external provider currently used by Search My Vacation"). This is flagged explicitly in the register itself (Section 4.2) as an addition beyond the card's minimum list, not a silent scope expansion.

**Activity 3 — Standardize Provider Information.** Complete: all eleven required fields (Purpose, Category, Operational Owner, Engineering Owner, Current Status, Business Criticality, External Dependencies, Renewal Responsibility, Supporting Documentation, Known Operational Risks, Recovery/Escalation Contact) are present for every provider entry. No credentials, API keys, passwords, secrets, or confidential information were recorded — environment variable **names** are referenced where relevant (permitted per Project Instructions §25), never values.

**Activity 4 — Business Criticality Classification.** Complete: the four-level model (Critical/High/Medium/Low) from the EBC is reproduced verbatim in the register's Section 3, and every current provider is classified against it. Per Project Instructions §10, business criticality is Product Owner authority — every classification in the register is explicitly marked as Tiger's **proposed** classification pending Vivek's confirmation, not asserted as final. For the four providers with no prior documentation (GoDaddy's specifics, Zoho Mail, Zoho CRM, Zoho Books), the register states plainly where a classification is a recommendation made without confirmed operational detail, rather than presenting it as verified.

**Activity 5 — External Approval Register.** Complete: register Section 5 documents DLT Registration, PE–TM Chain Approval, Sender Header Approval, Template Approval, and Billing Activation status, cross-referencing `docs/50-Operations/SMS-OTP-Operations-Runbook.md` for procedure rather than duplicating it. Domain Verification and OAuth Verification are recorded as not-yet-applicable/not-yet-confirmed, consistent with the evidence available.

**Activity 6 — Operational Risk Register.** Complete: register Section 6 records four cross-provider risks that are visible only when the inventory is viewed as a whole (the register's specific reason for existing) — the undocumented DNS dependency chain, the absence of Operations Runbooks for most providers, the total absence of prior documentation for the three Zoho systems, and single-person operational ownership concentration — each with existing mitigation (where any exists) and a future improvement opportunity, cross-referencing `ADR-R1.2-WS5-001` and the Release 1.3 Governance Backlog rather than duplicating them.

**Activity 7 — Future Provider Roadmap.** Complete: register Section 7 lists all seven named candidate providers (Razorpay, Stripe, Google Maps Platform, WhatsApp Business, Google OAuth, Apple Sign-In, Microsoft Authentication) as informational planning items only, cross-referenced to the corresponding playbook recommendations already recorded in `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2. No implementation, architecture work, or provider selection is authorised by this section.

---

## 3. Acceptance Criteria Confirmation

- ✅ All currently active external providers documented (nine named providers, plus Resend, flagged as an addition).
- ✅ Provider ownership identified for every entry — explicitly marked "to be confirmed" where repository evidence does not exist (GoDaddy specifics, all three Zoho systems), rather than fabricated.
- ✅ Business criticality assigned consistently, using the four-level model, for every provider — as Tiger's proposed classification pending Product Owner confirmation.
- ✅ Operational dependencies documented, including cross-provider dependencies not visible from any single existing document (Section 6).
- ✅ External approval requirements identified (Section 5), cross-referenced to the existing Operations Runbook rather than duplicated.
- ✅ Recovery considerations documented — role-based only, no personal contact details.
- ✅ References added to `ADR-R1.2-WS5-001`, `SMS-OTP-Operations-Runbook.md`, `Release-1.2-Lessons-Learned.md`, and `RELEASE-1.3-GOVERNANCE-BACKLOG.md` throughout.
- ✅ No duplication of existing documentation — provider-specific procedural detail already recorded elsewhere is cross-referenced, not restated.
- ✅ No confidential information recorded — no credentials, secrets, account numbers, or personal contact details anywhere in the register.
- ✅ Documentation reviewed for consistency with the Release 1.2 governance baseline established under `EBC-R1.2-GOV-001` (matching document header format, ADR/runbook cross-reference style, and the "flag rather than fabricate" evidence discipline).

---

## 4. Constraints Observed

- Documentation only — no application code, infrastructure configuration, credentials, deployments, or provider settings were modified.
- No Release tracker (`RELEASE-1.2.md`) updates were made.
- No Decision Log entry was added.
- No Technical Debt item was created.
- No implementation changes were made.
- No operational configuration changes were made.
- No credentials or secrets were documented at any point.

---

## 5. Known Limitations

- Four providers (GoDaddy's account specifics, Zoho Mail, Zoho CRM, Zoho Books) have no prior documentation anywhere in this repository or Claude Project; the register records this honestly as "not recorded" rather than inferring or fabricating account-level detail. Section 8 of the register consolidates the specific confirmations needed from the Product Owner to close this gap.
- Business criticality and ownership assignments throughout the register are Tiger's drafted recommendation, not a ratified Product Owner decision — per Project Instructions §10, this EBC does not have the authority to finalise them unilaterally.

---

## 6. Success Criteria

- ✅ A single, consolidated Provider Dependency Register exists at `docs/30-Governance/Provider-Dependency-Register.md`.
- ✅ Every provider entry follows the same standardized structure, enabling fast lookup during a future incident or onboarding.
- ✅ The register complements, and does not duplicate, the ADR/Runbook/Lessons-Learned/Governance-Backlog documents produced under `EBC-R1.2-GOV-001`.
- ✅ Gaps in prior documentation (GoDaddy, Zoho systems) are surfaced explicitly as open items rather than silently glossed over.
- ✅ No implementation scope was expanded; Release 1.2 tracker, Decision Log, and Technical Debt register are all unchanged by this EBC.

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only governance execution record, per `EBC-R1.2-GOV-002`. No application code, infrastructure configuration, credentials, deployments, or provider settings were created, modified, or deleted in producing this document or the Provider Dependency Register it records.*
