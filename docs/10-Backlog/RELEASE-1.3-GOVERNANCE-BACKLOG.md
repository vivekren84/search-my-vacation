# Release 1.3 Governance Backlog

```text
Document Type : Governance Backlog (recommendations only — no implementation authorised)
Persona       : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-001
Status        : Recommendations recorded for Release 1.3 planning; nothing in this
                document is scoped, sequenced, or approved for build
Effective Date: 26 August 2026
```

## Document Information

| Field | Value |
| --- | --- |
| Owner | Tiger (Programme and Delivery Lead) |
| Related documents | `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`; `docs/30-Governance/External-Integration-Definition-of-Done.md`; `docs/50-Operations/SMS-OTP-Operations-Runbook.md`; `docs/40-Retrospectives/Release-1.2-Lessons-Learned.md` |
| Distinct from | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` — the existing product/UX/engineering-technical-debt backlog. This document is specifically for **governance and operational-playbook** recommendations arising from `EBC-R1.2-GOV-001`; it does not duplicate, renumber, or supersede any entry in `RELEASE-1.3-BACKLOG.md` |
| Explicitly out of scope | No implementation, code, configuration, or content authoring shall occur under Release 1.2 as a result of this document. Every item below is a recommendation for Release 1.3 planning, subject to Product Owner prioritisation |

---

## 1. Purpose

`EBC-R1.2-GOV-001` was raised to preserve institutional knowledge from Release 1.2's DLT/MSG91 onboarding before it is lost, and to recommend how that knowledge should generalise to future external integrations. This document is the record of those recommendations. It is intentionally a backlog of **playbooks to be written**, not a scoped or sequenced delivery plan — the same distinction `RELEASE-1.3-BACKLOG.md` already draws between "decision" and "vision item" (`RELEASE-1.3-BACKLOG.md`, "Purpose and How to Read This Document").

---

## 2. Recommended Governance Playbooks

Each recommendation below follows the same rationale: Release 1.2's MSG91/DLT experience showed that a first-time external-provider integration carries real, non-obvious operational risk (regulatory chains, provider-account quirks, approval-timeline uncertainty) that a purely engineering-focused EBC does not surface until implementation is already underway. A short, provider-category-specific playbook — written once a provider is actually selected — prevents each future integration from rediscovering this the hard way.

### 2.1 Payment Gateway Playbook

**Recommendation:** When Search My Vacation selects a payment gateway (for deposits, full payments, or refunds), produce a playbook covering: merchant account onboarding and KYC, PCI-DSS scope boundaries for a Next.js/Vercel/Supabase stack, webhook signature verification, refund/chargeback operational flow, and sandbox-to-production credential transition. This is likely the highest-risk future integration on this list, given the regulatory and fraud-liability surface of payments specifically.

**Priority (recommended, not authorised):** High, once a Release 1.3 payment feature is scoped.

**Owner (proposed):** Archie (architecture), Vivek (merchant account/compliance), Rad (implementation playbook).

### 2.2 Email Provider Playbook

**Recommendation:** Search My Vacation already integrates Resend (per the project's technology stack). Produce a playbook covering: domain verification (SPF/DKIM/DMARC), sender reputation management, deliverability troubleshooting, and template/versioning conventions — generalising whatever operational learning exists from the current Resend integration, which has not yet been consolidated into a standalone runbook.

**Priority (recommended, not authorised):** Medium — the provider is already live, so this is a documentation-consolidation exercise rather than a new-integration risk.

**Owner (proposed):** Rad (technical detail), Tiger (consolidation).

### 2.3 WhatsApp Provider Playbook

**Recommendation:** If Search My Vacation pursues WhatsApp Business API integration (a natural extension of the traveller-communication model), produce a playbook before implementation begins. WhatsApp Business API sits under Meta's own template-approval and business-verification regime — structurally similar in kind to India's DLT regime (pre-approved message templates, a business verification step, provider-account activation lag) even though the specific mechanics differ. `ADR-R1.2-WS5-001`'s ownership-boundary model (Section 4 of that ADR) should be the starting template.

**Priority (recommended, not authorised):** Depends entirely on whether a Release 1.3 (or later) feature actually requires it — no current commitment exists.

**Owner (proposed):** Arjun (business case), Archie (architecture), Vivek (business verification).

### 2.4 OAuth Provider Playbook

**Recommendation:** If Search My Vacation introduces third-party authentication (Google/Apple/Facebook sign-in, or similar), produce a playbook covering: OAuth app registration and review processes (some providers require a manual app-review step with its own approval timeline, structurally similar to a DLT-style gate), redirect URI and secret management across environments, and token refresh/revocation handling.

**Priority (recommended, not authorised):** Low unless a specific Release 1.3 authentication feature is proposed.

**Owner (proposed):** Archie (architecture, authentication boundary is explicitly architecture-approval-gated per Project Instructions §5), Rad (implementation).

### 2.5 Maps API Playbook

**Recommendation:** If Search My Vacation integrates a maps/geocoding provider (for destination visualisation or itinerary mapping), produce a playbook covering: API key restriction and quota management, cost-control safeguards (maps APIs commonly bill per load/request), and attribution/licensing requirements. Lower regulatory complexity than the other items on this list, but real cost-management risk if left unmanaged.

**Priority (recommended, not authorised):** Low unless a specific Release 1.3 feature requires it.

**Owner (proposed):** Archie (architecture), Rad (implementation and cost-safeguard wiring).

### 2.6 Third-Party Service Operational Standards

**Recommendation:** Generalise `docs/30-Governance/External-Integration-Definition-of-Done.md` and `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md` into a standing checklist referenced by every future EBC that proposes a new external dependency — regardless of category — so that the two-axis (engineering-complete vs. operationally-deployable) model and the abstraction-interface requirement are applied consistently, not just to communications providers. This item is largely already delivered by the two documents named above; the remaining recommendation is procedural: add an explicit reference to the External Integration Definition of Done in the standard EBC template used for any new-provider proposal.

**Priority (recommended, not authorised):** Medium — low effort, meaningful consistency benefit.

**Owner (proposed):** Tiger.

---

## 3. How to Use This Backlog

When the Product Owner is ready to scope Release 1.3, each item above should be evaluated for inclusion using the same discipline `EBC-R1.2-WS6-01` established for Workstream 6 product discovery: confirm whether the underlying feature (a payment flow, a WhatsApp channel, a new sign-in method, a maps feature) is actually planned for Release 1.3 before committing effort to its playbook. A playbook with no corresponding feature is premature work; a feature introduced without its playbook risks repeating Release 1.2's DLT discovery process under time pressure.

---

## 4. Explicit Non-Scope Statement

No implementation, architecture change, code, configuration, or content authoring is authorised by this document. This is a governance backlog of documentation recommendations only, per the explicit constraint in `EBC-R1.2-GOV-001`: "No implementation shall occur under Release 1.2. Recommendations shall be recorded for Release 1.3 planning."

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only governance backlog, per `EBC-R1.2-GOV-001`. No application code, configuration, or implementation files were created, modified, or deleted in producing this document.*
