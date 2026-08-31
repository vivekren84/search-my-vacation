# External Integration Definition of Done

```text
Document Type : Governance Standard
Persona       : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-001
Applies to    : Every Search My Vacation integration with an external, third-party
                communications, payment, identity, or data provider
Status        : Active — first edition
Effective Date: 26 August 2026
```

## Document Information

| Field | Value |
| --- | --- |
| Owner | Tiger (Programme and Delivery Lead) |
| Ratifying architecture reference | `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md` |
| Originating EBC | `EBC-R1.2-GOV-001` |
| Founding case | Release 1.2 Workstream 5 — Journey Passport OTP / MSG91 / India DLT |
| Applies to (examples, not exhaustive) | SMS providers, payment gateways, email providers, WhatsApp Business providers, OAuth/identity providers, maps/geocoding APIs, and any other third-party service an EBC proposes integrating |

---

## 1. Purpose

Release 1.2 Workstream 5 revealed that "the code is done" and "the feature works in production" can be separated by weeks or months when an integration depends on an external party's own approval process (India's DLT regime, in that case). Prior to `EBC-R1.2-GOV-001`, Search My Vacation had no standard definition of what "done" means for this class of work, which risked a future integration's regulatory or provider-account lag being mistaken for an engineering delay, or — the opposite failure — an engineering-complete integration being reported as fully done when it could not yet send a single real message.

This document is that standard. It applies to every future EBC that proposes integrating an external provider, and should be referenced explicitly in that EBC's Acceptance Criteria rather than restated.

---

## 2. The Two-Axis Model

Every external integration is assessed on two independent axes, per `ADR-R1.2-WS5-001` §6. **Neither axis substitutes for the other, and a Release tracker entry must report both separately.**

### Axis 1 — Engineering Complete

- [ ] **Development complete.** The integration's business logic, abstraction interface, and error handling are implemented, following the established pattern: no direct provider calls from business logic, all provider-specific behaviour confined inside a narrow internal interface.
- [ ] **Integration verified.** Lint, type checks, build, and any targeted automated tests for the integration's call sites and abstraction layer all pass.
- [ ] **Fail-closed behaviour confirmed.** The integration returns a clear, typed unavailable/not-configured state — and the application handles that state gracefully — whenever required provider configuration is absent, rather than attempting a call that will fail unpredictably.
- [ ] **Provider-contract uncertainty named, not hidden.** Any aspect of the provider's request/response contract that could not be confirmed from official documentation is stated explicitly, along with the exact validation step (typically a live smoke test) that will resolve it.

### Axis 2 — Operationally Deployable

- [ ] **Provider configured.** All environment-variable-driven credentials and identifiers the provider issues are populated in the target environment (values only — variable names, never values, may appear in documentation, per Project Instructions §25).
- [ ] **Regulatory approvals completed.** Every registration, license, or compliance approval the provider or a regulator requires (for SMS in India: Principal Entity, Sender Header, Template, and PE–TM Chain Binding — see `docs/50-Operations/SMS-OTP-Operations-Runbook.md` for the reusable pattern) has been obtained, not merely submitted.
- [ ] **Production verification completed.** A live, end-to-end test against the real provider, in the production (or production-equivalent) environment, has succeeded — closing out any provider-contract uncertainty flagged under Axis 1.
- [ ] **Operational documentation updated.** A runbook covering initial setup and known troubleshooting categories exists for the integration (Section 3 below), whether reusing the pattern in `SMS-OTP-Operations-Runbook.md` or authoring an equivalent for a different provider category.
- [ ] **Recovery procedures documented.** What happens, and what the traveller/internal user sees, when this specific provider fails at runtime (timeout, rejection, outage) is defined and, where user-facing, has been reviewed by Sophie/Sri as appropriate to the surface it affects.

---

## 3. Required Deliverables Per External Integration

Following the Release 1.2 Workstream 5 precedent, a new external integration's governance package should produce:

1. An Architecture Decision Record (or an explicit amendment to `ADR-R1.2-WS5-001` if the pattern is unchanged and only the provider differs), in `docs/20-Architecture/`.
2. An Operations Runbook covering initial setup and known troubleshooting categories, in `docs/50-Operations/`.
3. A Release tracker entry that reports Axis 1 and Axis 2 status separately, never collapsed into one status field.
4. A Lessons Learned addendum (or new retrospective entry) once the integration reaches production, capturing anything the standard pattern in this document did not anticipate.

---

## 4. What This Definition of Done Explicitly Does Not Cover

This standard governs external **provider** integrations — third parties whose approval or account-activation timeline sits outside Search My Vacation's control. It does not apply to, and should not be stretched to cover, internal architectural changes, first-party feature work, or providers already fully operational and configured (for those, the general Testing and Definition of Done in the Project Instructions §28 continues to apply unchanged).

---

## 5. Relationship to Existing Governance

This document supplements, and does not replace, Project Instructions §28 (Testing and Definition of Done) and §35 (Decision and Escalation Behaviour). Where this document and those sections could be read as conflicting, the Project Instructions take precedence per the Source of Truth ordering in §17; this document exists to add the external-integration-specific detail those general sections do not spell out.

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only governance standard, per `EBC-R1.2-GOV-001`. No application code, configuration, or implementation files were created, modified, or deleted in producing this document.*
