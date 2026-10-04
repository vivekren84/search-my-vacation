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

### 2.0 Status summary (added 30-Sep-2026, `EBC-R1.3-WS13-006`)

| Item | Title | Status | Due |
|---|---|---|---|
| §2.1–§2.6 | Provider playbooks and third-party standards (from `EBC-R1.2-GOV-001`) | Not started — each waits for its provider to be selected | When scoped |
| §2.7 | Align Project Instructions with the Engineering Governance Principles | Open — deferred by decision (`DEC-R1.3-018` D-5) | Before Release 1.4 planning |
| §2.8 | Engineering phase approval lifecycle and report sections | Open — in use as working practice (Phase A, Phase 0) | Post–Release 1.3 Governance Documentation Review |
| §2.9 | Release 1.4 review: Preview/Production environment isolation | Open | Release 1.4 planning |
| §2.10 | Phase / Release Deployment Runbook | Open — not yet written | **Gate:** approved before WS13 Phase 1 migration M11 is applied (`DEC-R1.3-025` C-6; `DEC-R1.3-026` C-1, Checkpoint 3). Drafting starts in parallel with Milestone A (Tiger, Rad). |
| §2.11 | QA Execution Playbook | **New — Open** (added 1-Oct-2026) | **Gate:** approved before the WS13 Phase 1 QA handover (`DEC-R1.3-025` C-6; `DEC-R1.3-026` C-3, before Checkpoint 5) |

No item is complete yet. Phase 0 exercised §2.8, §2.10 and §2.11 as working practice; none is closed until written into the canonical documents. *Updated 1-Oct-2026 (`EBC-R1.3-WS13-016`). §2.10 and §2.11 made Phase 1 gates 3-Oct-2026 (`EBC-R1.3-WS13-019`, `DEC-R1.3-025`).*

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

### 2.7 Align Project Instructions with the Engineering Governance Principles

*Added 27-Sep-2026 by `EBC-R1.3-GOV-005`, at the Product Owner's direction (`DEC-R1.3-018`, decision D-5). Unlike §2.1–§2.6, this item does not arise from `EBC-R1.2-GOV-001`.*

**Recommendation:** Update the Claude Project Instructions so they match the Engineering Governance Principles in `docs/15-AI-Operating-Model/CLAUDE.md` §7. At minimum, §26 (Git and Branch Safety) currently recommends `feature/<ebc-number>-<short-description>` and `fix/<short-description>` branches; it should instead point to the release branch (`release/rX.Y`, EP-001), hotfix branches (EP-002) and the merge criteria (EP-004). Also review §12 (Standard Delivery Lifecycle) and §14–§15 (workspace and session checks) for a reference to the Engineering Ready Baseline and the frozen-baseline change process (EP-003, EP-005, EP-007). Because Project Instructions rank above the Handbook, the Handbook stays the single detailed source and the Instructions should link to it rather than restate it.

**Constraint:** Do not modify the Project Instructions during Release 1.3.

**Due:** Before Release 1.4 planning begins.

**Priority (recommended, not authorised):** High — until aligned, the two sources give different branch guidance.

**Owner (proposed):** Tiger (draft), Vivek (approval — the Project Instructions are maintained by the Product Owner).

**Status (30-Sep-2026):** Open — deferred to before Release 1.4 planning.

### 2.8 Engineering phase approval lifecycle and report sections

*Added 28-Sep-2026 by `EBC-R1.3-WS13-005` (Phase A Delivery Closure). Does not arise from `EBC-R1.2-GOV-001`.*

**Recommendation:** During the post–Release 1.3 Governance Documentation Review, propose adding to the Engineering Handbook (`docs/15-AI-Operating-Model/CLAUDE.md` §7) the phase approval lifecycle validated in WS13 Phase A: **Engineering Completion → QA Validation → Product Owner Acceptance → Delivery Closure → Next Phase Authorisation**. Include the report sections adopted in Phase A: Engineering Completion Report — Engineering Deviations, Phase Readiness, Deployment Considerations; QA Completion Report — Baseline Conformance, QA Coverage Summary; Product Owner Acceptance recorded as a governance decision without a separate EBC; Delivery Closure as the final gate before the next phase. Consider combining with §2.7 so the Project Instructions and Handbook are updated together.

**Constraint:** Applies within Release 1.3 as working practice; the Handbook is changed only through the review (EP-005, Handbook §19).

**Due:** Post–Release 1.3 Governance Documentation Review, before Release 1.4 planning.

**Priority (recommended, not authorised):** Medium.

**Owner (proposed):** Tiger (draft), Vivek (approval).

**Status (30-Sep-2026):** Open — used as working practice in Phase A and Phase 0.

### 2.9 Release 1.4 architectural review — Preview and Production environment isolation

*Added 28-Sep-2026 by `EBC-R1.3-WS13-005`, at the Product Owner's direction (`DEC-R1.3-020`, C4). Does not arise from `EBC-R1.2-GOV-001`.*

**Context:** In Release 1.3, Preview and Production intentionally share one Supabase project and database. Every migration applied for Preview therefore also changes Production, and QA data created on Preview lives in the Production database.

**Recommendation:** As part of Release 1.4 planning, Archie evaluates whether Preview and Production should move to separate Supabase projects for proper environment isolation. The review should cover migration workflow and parity, data seeding and test identities, environment-variable contracts in Vercel (Production vs Preview), authentication settings, cost, and the migration path from the shared database.

**Nature:** A planned architectural review, **not** a committed implementation decision. Any resulting change needs an ADR and Product Owner approval.

**Due:** Release 1.4 planning.

**Priority (recommended, not authorised):** High — the shared database is the main environment risk carried by Release 1.3.

**Owner (proposed):** Archie (review), Tiger (scheduling), Vivek (decision).

**Status (30-Sep-2026):** Open. RISK-R1.3-001 in the tracker records the accepted Release 1.3 risk. Note: a separate environment built from migrations first needs TD-WS13-002 fixed.

**Scope extended (1-Oct-2026, `EBC-R1.3-WS13-016`):** the review also covers a dedicated non-production QA database and the Preview/QA environment strategy. Phase 0 QA wrote test records into the shared (Production) database, which must now be removed before release (`DEC-R1.3-022` (5)).

### 2.10 Phase / Release Deployment Runbook

*Added 30-Sep-2026 by `EBC-R1.3-WS13-006`, from the WS13 Phase 0 deployment (`DEC-R1.3-021`). Does not arise from `EBC-R1.2-GOV-001`.*

**Context:** The Phase 0 deployment sequence lives only inside Rad's Phase 0 report (`EBC-R1.3-WS13-005-P0` §5). Phases 1–4 will need the same steps, and no execution log of the Phase 0 run is kept in the repository.

**Recommendation:** Write one reusable runbook, owned by Tiger with Rad, covering:

1. **Maintenance announcement:** who is told, how far ahead, and the wording for the Workspace team.
2. **Phase deployment checklist:** freeze before backup; Docker running (needed by `supabase db dump`); logical backup (schema, data, roles) and **verification** (files present, non-empty, recorded); baseline `migration list`; live dependency checks for anything being dropped; `db push --dry-run`, then apply as one unit; Preview on the matching code; smoke test script; parity `migration list`; resume.
3. **Stop rules:** what to do if a step fails or `db push` stops part-way (record output, run `migration list`, decide between completing and rolling back).
4. **Rollback:** the difference between a forward-fix migration and a backup restore, and who decides.
5. **Backup handling:** location outside the repository, never committed (personal data), retention period and deletion.
6. **Deployment record template:** date and time, operator, backup location and verification, baseline and parity counts, dry-run output summary, dependency-check result, Preview deployment id, smoke-test result, issues. Filed with the phase's closure record.

Canonical home: an Operations runbook under `docs/50-Operations/`, linked from Engineering Handbook §7 (EP-008). Until published, `EBC-R1.3-WS13-005-P0` §5 remains the procedure.

**Priority (recommended, not authorised):** High — Phase 1 is expected to include further migrations on the shared database (RISK-R1.3-001).

**Owner (proposed):** Tiger (draft), Rad (technical steps), Vivek (approval and operator).

### 2.11 QA Execution Playbook

*Added 1-Oct-2026 by `EBC-R1.3-WS13-016`, from WS13 Phase 0 QA (`DEC-R1.3-022`). Does not arise from `EBC-R1.2-GOV-001`.*

**Context:** The Phase 0 QA rules were agreed in the handover card and decisions D1–D3. They are not yet written down in one reusable place.

**Recommendation:** One QA playbook (Keerthi, with Tiger) covering:

1. Authentication procedure — the Product Owner signs in; QA never handles credentials.
2. Handover card contents — environment, Preview deployment id, identities, test data, scope, Not Executed rules.
3. Preview as the authoritative environment; localhost only to reproduce.
4. QA data naming (`QA-WS13-P<phase>-…`) and the removal step before release.
5. When "Passed (by reference)" to an engineering test is allowed.
6. Evidence retention — where screenshots are stored (Phase 0 evidence folder `QA-WS13-P0-evidence/` is not in the repository, and Administrator-run screenshots were not kept).
7. Device coverage below 500 px — Chrome cannot render it; use a real phone or device emulation (noted as a limit in Phase A and Phase 0).

Canonical home: the planned `playbooks/Validation-Report-Template.md` / QA playbook in the AI Operating Model (Handbook §18 roadmap), linked from §7.

**Priority (recommended, not authorised):** Medium.

**Owner (proposed):** Keerthi (draft), Tiger (review), Vivek (approval).

**Status (1-Oct-2026):** Open.

---

## 3. How to Use This Backlog

When the Product Owner is ready to scope Release 1.3, each item above should be evaluated for inclusion using the same discipline `EBC-R1.2-WS6-01` established for Workstream 6 product discovery: confirm whether the underlying feature (a payment flow, a WhatsApp channel, a new sign-in method, a maps feature) is actually planned for Release 1.3 before committing effort to its playbook. A playbook with no corresponding feature is premature work; a feature introduced without its playbook risks repeating Release 1.2's DLT discovery process under time pressure.

---

## 4. Explicit Non-Scope Statement

No implementation, architecture change, code, configuration, or content authoring is authorised by this document. This is a governance backlog of documentation recommendations only, per the explicit constraint in `EBC-R1.2-GOV-001`: "No implementation shall occur under Release 1.2. Recommendations shall be recorded for Release 1.3 planning."

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only governance backlog, per `EBC-R1.2-GOV-001`. No application code, configuration, or implementation files were created, modified, or deleted in producing this document.*
