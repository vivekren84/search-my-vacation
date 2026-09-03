# ADR-R1.2-WS5-001 — DLT & External SMS Provider Onboarding

```text
Document Type : Architecture Decision Record
Decision ID   : ADR-R1.2-WS5-001
Title         : DLT & External SMS Provider Onboarding
Status        : Proposed — Pending Archie Review
Release       : Release 1.2
Workstream    : WS5 – International Phone Number & OTP Verification
Drafted By    : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-001
Owner         : Archie — Technical Architect (review outstanding)
Business Owner: Vivek
Effective Date: Pending Archie's review and ratification
Supersedes    : None
Superseded By : —
```

## Document Information

| Field | Value |
| --- | --- |
| ADR ID | ADR-R1.2-WS5-001 |
| Title | DLT & External SMS Provider Onboarding |
| Status | **Proposed — Pending Archie Review.** This ADR was drafted by Tiger under `EBC-R1.2-GOV-001` to consolidate architecture already implemented and decided (`DEC-R1.2-016`) into a permanent record. Per Project Instructions §5 and §3 ("Tiger must not... approve architecture on Archie's behalf"), it does not become Accepted until Archie has independently reviewed and ratified it. |
| Type | Architecture Decision Record (permanent, repository-level) |
| Drafted by | Tiger — Programme and Delivery Lead |
| Owner (pending ratification) | Archie — Technical Architect |
| Business Approver | Vivek — Product Owner |
| Originating EBC | `EBC-R1.2-GOV-001` (External Provider Integration Governance & DLT Operational Readiness) |
| Related decisions | `DEC-R1.2-016` (MSG91 provider selection and abstraction-interface constraint) |
| Applies to | The Journey Passport OTP verification feature's SMS delivery layer, and — as a reusable pattern — any future Search My Vacation integration with a regulated or approval-gated external communications provider (payment, email, WhatsApp, OAuth, maps) |
| Supersedes | None — first ADR for external provider onboarding |
| Superseded by | None |
| Location | `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md` |
| Date created | 26 August 2026 |

---

## 1. Purpose

This ADR is the permanent, repository-level architecture record for how Search My Vacation onboards an external, regulation-gated communications provider — using the Journey Passport OTP/MSG91/India DLT integration as the founding case. It exists so that:

- the architectural pattern already implemented for MSG91 (provider abstraction, configuration-driven credentials, fail-closed behaviour) is documented once, rather than re-derived by inspection each time a future integration is reviewed;
- the distinction between **engineering-owned** work (code, configuration surface, abstraction boundaries) and **operationally-owned** work (regulatory approvals, provider account administration, carrier relationships) is drawn explicitly and is available to every future provider onboarding;
- the production-readiness criteria this integration was actually held to — engineering-complete is not the same claim as operationally-deployable — are captured as a reusable standard rather than a one-off finding.

This ADR formalises architecture and operational ownership already reflected in the repository (`web/lib/journey-passport-otp/sms.ts`, `DEC-R1.2-016`, `docs/10-Backlog/RELEASE-1.2.md` Workstream 5) and in prior engineering review (`EBC-R1.2-WS5-04A-RAD`, `EBC-R1.2-WS5-04B-RAD`, `EBC-R1.2-WS5-REV1-10-RAD`). It does not introduce a new architectural decision for the OTP feature itself; it generalises the decisions already made into a standard other integrations can follow.

---

## 2. Context

Release 1.2 Workstream 5 added mobile OTP verification to the Journey Passport, requiring an external SMS delivery provider. Search My Vacation's traveller base is India-first, which brings the integration under India's Distributed Ledger Technology (DLT) regulatory regime for commercial SMS — a chain of telecom-operator- and TRAI-mandated registrations that sits entirely outside the application and outside Search My Vacation's engineering control, yet directly gates whether the already-implemented feature can send a real SMS in production.

`DEC-R1.2-016` selected MSG91 as the provider and imposed an architectural constraint: the provider must sit behind an internal abstraction interface so that a future provider swap does not require changing Journey Passport business logic. Engineering implemented this (`EBC-R1.2-WS5-03-RAD`), and two independent engineering reviews (`EBC-R1.2-WS5-04A-RAD`, `EBC-R1.2-WS5-04B-RAD`) confirmed that the resulting integration is entirely configuration-driven for production enablement, with one open validation question (Section 5).

Independently, the Product Owner's operational engagement with the DLT chain (Jio TrueConnect Principal Entity registration, Sender Header submission) surfaced a further regulatory dependency not previously captured anywhere in project documentation: the creation and approval of a **Principal Entity – Telemarketer (PE–TM) chain**, binding the registered Principal Entity to a Telemarketer entity before a Sender Header or Template can be considered fully bound for live sending. This is the specific mechanism behind the "DLT Chain Binding" step already named (but not previously explained) in the Workstream 5 Resume Checklist (`docs/10-Backlog/RELEASE-1.2.md`, Resume Checklist step 6). `EBC-R1.2-GOV-001` was raised specifically to capture this and related institutional knowledge before it is lost to informal channels.

---

## 3. Decision

**3.1 — Provider abstraction is architecturally mandatory for every external communications integration.** No Search My Vacation business logic (Journey Passport, Journey Director, lead capture, or any future flow) may call a third-party communications API directly. Every such integration is implemented behind an internal service interface, following the pattern already established in `web/lib/journey-passport-otp/sms.ts`: a narrow, typed function contract that business logic calls, with the provider-specific request shape, authentication, and error vocabulary confined entirely inside the interface's implementation. This is what allowed MSG91 to be introduced, and would allow it to be replaced, without touching OTP business logic, Journey Passport UI, or the Supabase schema.

**3.2 — Provider credentials and identifiers are configuration, never code.** Every value a provider issues at onboarding time — API keys, sender identifiers, template identifiers, and equivalents for future providers (a payment gateway's merchant ID, an OAuth provider's client secret, a maps API key) — is read exclusively from environment variables, with no hardcoded provider values anywhere in the codebase. This is fully implemented for MSG91 (`SMS_PROVIDER_API_KEY`, `SMS_PROVIDER_SENDER_ID`, `SMS_PROVIDER_TEMPLATE_ID`) and is the standard for every future provider.

**3.3 — Fail-closed, not fail-open, when provider configuration is incomplete.** An integration whose required credentials are not yet configured must refuse to attempt the operation and return a clear, typed unavailability status, rather than attempting a call that will fail unpredictably or silently degrade. The OTP provider's `{status: "not-configured"}` return path is the reference implementation: it allowed engineering to complete, review, and ship the entire OTP feature months ahead of DLT approval, with zero risk of a traveller being admitted to a broken flow.

**3.4 — Regulatory and provider-account approval is an operational dependency, not an engineering task, and must be tracked as such.** Registrations, approvals, and account activations conducted directly with a regulator, telecom operator, or provider dashboard (DLT Principal Entity, Sender Header, Template, PE–TM Chain Binding, and their equivalents for other providers) have no code representation and no committed SLA. They are owned by the Product Owner (or their designated Authorised Representative) operationally, tracked in the Release tracker's own dependency log, and must never be represented in the Release tracker as an engineering task, an engineering blocker, or a defect. `docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 status (`🟡 Partially Implemented – Waiting for External DLT Dependency`) and its "DLT Registration Milestone Log" are the reference implementation of this separation.

**3.5 — "Engineering-complete" and "operationally-deployable" are two different claims and must be reported separately.** `EBC-R1.2-WS5-REV1-10-RAD`'s Task 10 assessment established the standard this ADR now generalises: a nine-task, code-level engineering review can and should reach a confident "engineering complete" verdict entirely independent of whether the external regulatory chain has finished, and that verdict must say so explicitly rather than being withheld or qualified by an unrelated operational dependency. Every future integration's readiness reporting follows this same two-axis structure (see the External Integration Definition of Done, Section 6).

**3.6 — One open production-validation question does not block engineering sign-off.** Where a provider's request-parameter contract cannot be confirmed from public documentation with full confidence (Section 5, the MSG91 Principal-Entity-parameter question), the review records the uncertainty honestly, names the exact validation step that will resolve it (a live smoke test), and proceeds — it does not block engineering closure on a question only a live call can answer.

---

## 4. Component & Ownership Boundaries

| Layer | Component (this integration) | Owned by | Engineering or Operational |
| --- | --- | --- | --- |
| Business logic | Journey Passport OTP send/verify flow, `/leads` token gate | Rad (implementation), Archie (architecture) | Engineering |
| Abstraction interface | `web/lib/journey-passport-otp/sms.ts` | Rad (implementation), Archie (architecture) | Engineering |
| Provider credentials | `SMS_PROVIDER_API_KEY`, `SMS_PROVIDER_SENDER_ID`, `SMS_PROVIDER_TEMPLATE_ID` (env vars) | Rad (wiring), Vivek/Tiger (values, once issued) | Engineering (wiring) / Operational (values) |
| DLT Principal Entity registration | Jio TrueConnect Principal Entity record | Vivek (Authorised Representative) | Operational |
| DLT Sender Header registration/approval | Jio TrueConnect / MSG91 Sender Header record | Vivek (Authorised Representative) | Operational |
| DLT Template registration/approval | MSG91 Template / DLT Content Template record | Vivek (Authorised Representative) | Operational |
| PE–TM Chain Binding | Principal Entity–Telemarketer chain on the DLT platform | Vivek (Authorised Representative), in coordination with MSG91 | Operational |
| Live credential issuance | MSG91 live account activation | Vivek, then handed to Rad for environment configuration | Operational → Engineering handoff |
| Production validation (live smoke test) | First live OTP send/verify against real MSG91 credentials | Rad (execution), Keerthi (functional QA) | Engineering/QA, gated on Operational completion |

This table is the pattern to be reproduced, component-by-component, for each future external integration named in the Release 1.3 Governance Backlog (Section 7 of `EBC-R1.2-GOV-001`; `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`).

---

## 5. Open Technical Question (Carried Forward, Not Resolved by This ADR)

Whether MSG91's SendOTP v5 API (`/api/v5/otp`, the endpoint this codebase calls) requires an explicit Principal Entity parameter on the request body has not been confirmed against a live account — public documentation and community references were inconclusive and, in places, contradictory (`EBC-R1.2-WS5-04A-RAD` §4). The current request payload (`{ mobile, sender, template_id, otp, otp_expiry }`) sends no such parameter. This is classified, consistently with `EBC-R1.2-WS5-04A`/`04B` and the Release 1.2 tracker, as a **production validation item**, to be closed by the first live send once Sender Header and Template are approved — not an engineering defect, and not a blocker to this ADR's ratification. If that live test reveals a missing required parameter, the fix is a small, well-scoped, same-pattern addition to `sms.ts` (a new `SMS_PROVIDER_PE_ID`-equivalent environment variable plumbed alongside `template_id`), not a redesign of the abstraction this ADR describes.

---

## 6. Production Readiness Criteria (Reusable Standard)

An external provider integration is **engineering-complete** when:

1. All business logic sits behind an internal abstraction interface (§3.1).
2. All provider credentials/identifiers are environment-variable-driven, with no hardcoded values (§3.2).
3. The integration fails closed, with a typed, traceable unavailability status, when configuration is incomplete (§3.3).
4. Engineering validation (lint, type checks, build, targeted tests) has passed against the abstraction and its call sites.
5. Any open provider-contract question that cannot be resolved from documentation alone is named explicitly, with the exact validation step that will close it identified.

An external provider integration is **operationally deployable** only when, in addition to the above:

6. Every regulatory/provider-account approval in the chain (Section 4) has been obtained.
7. Live production credentials have been issued and configured.
8. A live, end-to-end smoke test has been executed successfully against the real provider.
9. Keerthi's functional QA has passed against live provider behaviour.
10. Any provider-contract question left open at engineering sign-off (Section 5) has been resolved by that live test.

A Release tracker entry for an external-provider-dependent workstream must report both states separately and must never collapse them into a single "Complete"/"Not Complete" status. This is the formal generalisation of the External Integration Definition of Done (`docs/30-Governance/External-Integration-Definition-of-Done.md`, produced alongside this ADR under the same EBC).

---

## 7. Consequences

**Positive:**

- Future providers (payment gateway, email, WhatsApp, OAuth, maps — see `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`) can be onboarded against a named, reusable architectural pattern rather than each requiring its own investigation.
- Engineering and operational timelines are no longer conflated in Release tracker reporting, reducing the risk of an engineering-complete feature being mistaken for production-ready, or a regulatory delay being mistaken for an engineering defect.
- Institutional knowledge about DLT-class regulatory chains (PE–TM chain, Sender Header, Template) is preserved outside any one person's memory.

**Trade-offs / risks accepted:**

- The abstraction-interface requirement (§3.1) adds a small amount of indirection versus calling a provider SDK directly; this is accepted as the cost of the provider-swap flexibility `DEC-R1.2-016` required.
- Operationally-owned steps (Section 4) remain outside engineering's ability to accelerate; this ADR does not and cannot shorten a regulator's or provider's approval timeline — it only ensures that dependency is visible and correctly attributed rather than absorbed silently into engineering's schedule.

---

## 8. Decision History

| Date | Event | Reference |
| --- | --- | --- |
| 22-Aug-2026 | MSG91 selected as SMS provider; abstraction-interface constraint imposed | `DEC-R1.2-016` |
| 22-Aug-2026 | Provider abstraction implemented (`web/lib/journey-passport-otp/sms.ts`) | `EBC-R1.2-WS5-03-RAD` |
| 24-Aug-2026 | Configuration-layer review confirmed the integration is configuration-driven, with one open validation question | `EBC-R1.2-WS5-04A-RAD`, `EBC-R1.2-WS5-04B-RAD` |
| 26-Aug-2026 | Task 10 engineering review formally separated "engineering-complete" from "operationally-deployable" for WS5 | `EBC-R1.2-WS5-REV1-10-RAD` |
| 26-Aug-2026 | This ADR drafted, generalising the above into a permanent, reusable architecture record | `EBC-R1.2-GOV-001` |

---

## 9. Approval Status

This ADR is **Proposed**, not Accepted. Per Project Instructions §5, architecture approval authority belongs to Archie, not Tiger. Tiger has drafted this record, grounded entirely in already-implemented architecture and already-approved decisions (`DEC-R1.2-016`), for Archie's independent review. This ADR should be re-issued with Status: **Accepted** and Archie recorded as ratifying reviewer once that review is complete; until then, it should be treated as a documented proposal, not a ratified constraint.

---

*Drafted by Tiger (Programme and Delivery Lead) as a documentation-only architecture record, per `EBC-R1.2-GOV-001`. No application code, configuration, or implementation files were created, modified, or deleted in producing this document. Architecture ratification remains with Archie.*
