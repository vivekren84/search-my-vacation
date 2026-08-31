# Release 1.2 Lessons Learned — External Provider Integration & DLT Operational Readiness

```text
Document Type : Retrospective
Persona       : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-001
Scope         : Institutional knowledge from Release 1.2 Workstream 5's MSG91/DLT
                integration; not a general Release 1.2 retrospective
Status        : Active — first edition
Effective Date: 26 August 2026
```

## Document Information

| Field | Value |
| --- | --- |
| Owner | Tiger (Programme and Delivery Lead) |
| Originating EBC | `EBC-R1.2-GOV-001` |
| Amended by | `EBC-R1.2-WS5-GOV-07-TIGER` (27-Aug-2026) — see Section 6 |
| Related documents | `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`; `docs/50-Operations/SMS-OTP-Operations-Runbook.md`; `docs/30-Governance/External-Integration-Definition-of-Done.md`; `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`; `docs/09-Development/EBC-R1.2-WS5-04-TIGER-DLT-Registration-External-Dependency-Transition.md`; `EBC-R1.2-WS5-REV1-10-RAD`; `EBC-R1.2-WS5-05-RAD`; `EBC-R1.2-WS5-IMP-02-RAD`; `EBC-R1.2-WS5-IMP-03-RAD` |

---

## 1. Purpose

This retrospective captures what Search My Vacation learned, specifically, from taking the Journey Passport OTP feature through implementation while its external SMS provider dependency (MSG91, gated by India's DLT regulatory regime) was still working through approval. It is scoped narrowly to that experience — it is not a general Release 1.2 retrospective — because the goal, per `EBC-R1.2-GOV-001`, is to convert a one-time investigation into reusable institutional knowledge, not to re-litigate the whole release.

---

## 2. Timeline of Record

| Date | Event |
| --- | --- |
| 22-Aug-2026 | `DEC-R1.2-016` approves MSG91 as SMS provider, with an explicit abstraction-interface requirement |
| 22-Aug-2026 | Commit `77d3a91` implements the OTP feature end-to-end (migration, library, API routes, UI) on `feature/ebc-r1.2-ws5-03-otp-verification`, with MSG91 integrated behind the required abstraction |
| 23-Aug-2026 | Principal Entity registration submitted via Jio TrueConnect (Registration Request Number `96220832`); Letter of Authority executed naming Vivek as Authorised Representative |
| 24-Aug-2026 | `EBC-R1.2-WS5-04A-RAD` and `-04B-RAD` independently review the configuration layer and conclude production enablement is expected to be configuration-driven, with one open validation question (Principal Entity parameter on MSG91's SendOTP API) |
| 24-Aug-2026 | Principal Entity approved; DLT subscription payment completed; Sender Header `SMVTRV` submitted |
| 25–26-Aug-2026 | A ten-task engineering review (`EBC-R1.2-WS5-REV1-01` through `-10-RAD`) independently validates the entire OTP flow end-to-end, closes one Blocker (`OBS-4-01`), and reaches a formal "Engineering Review 1 Approved" verdict — explicitly separating "engineering complete" from "operationally deployable" |
| 26-Aug-2026 | `EBC-R1.2-GOV-001` raised specifically to capture the PE–TM (Principal Entity–Telemarketer) chain requirement and related operational knowledge, not previously documented anywhere in project governance |

---

## 3. Institutional Knowledge Captured

### 3.1 DLT Approval ≠ Production Ready

Principal Entity approval — the first and, at the time, most visible milestone in the DLT chain — was reached on 24-Aug-2026, but this did not mean SMS could be sent. Sender Header approval, Template registration and approval, and PE–TM Chain Binding all remained (and, as of this document, remain) outstanding. Any future integration under a similar regulatory regime should assume the first approval milestone is a fraction of the total chain, not a proxy for completion, and should track the full chain explicitly (Section 2 of `docs/50-Operations/SMS-OTP-Operations-Runbook.md`) rather than treating "registered" as "ready."

### 3.2 Template Approval ≠ Template Verification

Registering and even provisionally approving a Content Template on the DLT platform is not the same as that template being correctly and identically configured on the provider's own side (MSG91). The Resume Checklist's "Template Re-verification" step exists specifically because a DLT-approved template and an MSG91-dashboard template can drift — in wording, variable count, or variable format — and that drift is a distinct, separately-diagnosable failure mode from either registration step failing outright (`docs/50-Operations/SMS-OTP-Operations-Runbook.md` §3.3).

### 3.3 The PE–TM Chain Is Mandatory

Until `EBC-R1.2-GOV-001`, no project document — not `EBC-R1.2-WS5-04-TIGER`, not the engineering reviews, not the Release 1.2 tracker — named the Principal Entity–Telemarketer (PE–TM) chain as a distinct, mandatory registration step. The existing "DLT Chain Binding" checklist item referred to it only implicitly. This is exactly the kind of institutional knowledge this EBC exists to prevent from being lost: a step that is easy to miss because it isn't obviously implied by "Principal Entity" and "Sender Header" alone, but that gates whether either can actually be used for live sending. Every future DLT-gated integration must treat PE–TM Chain creation and Telemarketer approval as an explicit, tracked step, not an assumed sub-step of Sender Header or Template registration.

### 3.4 External Provider Approvals May Block Production Despite Correct Implementation

`EBC-R1.2-WS5-REV1-10-RAD`'s Task 10 verdict is the clearest statement of this: nine tasks of engineering review found the OTP implementation correct, safe under failure, and ready for functional QA — and none of that mattered for whether a real SMS could be sent, because that was gated entirely by a regulatory chain outside engineering's control. A team that conflates these two facts risks two opposite failure modes: pressuring engineering to "fix" a delay that isn't an engineering problem, or wrongly reassuring the Product Owner that a feature is production-ready because its code is. `ADR-R1.2-WS5-001` §3.5 and §6 formalise the separation this release learned to make explicitly.

### 3.5 Infrastructure Dependencies Should Be Validated Before Application Debugging

Because the OTP provider fails closed (`{status: "not-configured"}`) when credentials are absent, engineering was able to build, review, and functionally validate the entire feature without ever needing live MSG91 access — and without risking a confusing debugging session where a genuinely correct implementation appears broken only because an external dependency isn't configured yet. Any future integration should adopt this same fail-closed pattern from the start specifically so that "is this a code bug or a missing external dependency" is never an open question during development (`ADR-R1.2-WS5-001` §3.3).

### 3.6 The Importance of Provider Operational Documentation

Before `EBC-R1.2-GOV-001`, everything known about the DLT/MSG91 onboarding sequence existed only as scattered facts across several engineering-review documents (`EBC-R1.2-WS5-04`, `-04A`, `-04B`) and the Product Owner's own direct experience with Jio TrueConnect, none of it organized as a reusable reference. The cost of this was not visible until the PE–TM chain requirement needed to be captured — at which point it became clear that a person picking up SMV's next external integration cold would have had to reconstruct this from first principles. `docs/50-Operations/SMS-OTP-Operations-Runbook.md` exists to make sure that cost is paid once, not once per integration.

---

## 4. What This Retrospective Deliberately Does Not Claim

This document does not assert that the DLT/MSG91 integration is complete, that all six troubleshooting categories in the Operations Runbook have actually been encountered by Search My Vacation (several are recorded as anticipated issue categories, not observed incidents — see the Runbook's Evidence Register), or that the PE–TM chain terminology used here has been independently verified against MSG91's or Jio's own official documentation beyond what the Product Owner has directly reported. These are flagged rather than smoothed over, consistent with the project's standing instruction not to fabricate production content or overstate validation that has not occurred.

---

## 5. Forward Reference

The generalised recommendations arising from this retrospective — reusable playbooks for future provider categories — are recorded separately in `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`, per `EBC-R1.2-GOV-001`'s explicit instruction that no implementation or scope expansion occur under Release 1.2 as a result of this work.

---

## 6. Amendment 1 — 27-Aug-2026 (`EBC-R1.2-WS5-GOV-07-TIGER`)

This amendment appends institutional knowledge from Workstream 5's production-validation milestone. Per Project Instructions §32, the original Sections 1–5 above are preserved unchanged as a historical record of what was known and learned as of 26-Aug-2026; this section adds what changed the following day, and explicitly updates the boundary drawn in Section 4.

### 6.1 Timeline Addendum

| Date | Event |
| --- | --- |
| 27-Aug-2026 | `EBC-R1.2-WS5-IMP-02-RAD` identifies and authors a fix for an ambiguous-column PL/pgSQL defect (`resend_count`) in `send_journey_passport_otp`; migration authored but not yet deployed at time of writing |
| 27-Aug-2026 | `EBC-R1.2-WS5-IMP-03-RAD` identifies and authors a fix for a second, structurally identical ambiguous-column defect (`verification_token`) in `verify_journey_passport_otp`; migration authored but not yet deployed at time of writing |
| 27-Aug-2026 | `EBC-R1.2-WS5-05-RAD` independently investigates production SMS delivery and identifies that every application-originated MSG91 send had been failing with `400 — Template ID Missing or Invalid Template`, traced to a single stray hyphen in `.env.local`'s `SMS_PROVIDER_TEMPLATE_ID`; also flags an unresolved OTP-expiry wording mismatch (application: 5 minutes; DLT-approved template text: "valid for 10 minutes") |
| 27-Aug-2026 | Product Owner deploys both IMP-02 and IMP-03 migrations, corrects the `.env.local` template ID typo, restarts the development server, and personally performs a live end-to-end test: Journey Passport created → OTP challenge created → OTP sent via MSG91 → SMS received on physical handset → OTP verified → Journey Passport completed → transitioned to Journey Director, with no runtime errors. This is the first confirmed instance of an application-originated OTP reaching a real handset. Reported directly to Tiger under `EBC-R1.2-WS5-GOV-07-TIGER` |

### 6.2 Two Structurally Identical Defects Survived Nine Tasks of Read-Only Engineering Review

`EBC-R1.2-WS5-REV1-01` through `-10-RAD` reviewed the OTP implementation across ten tasks and reached a formal "Engineering Review 1 Approved" verdict — and neither ambiguous-column defect (`resend_count`, then `verification_token`) was caught, because both are a PL/pgSQL variable-shadowing failure mode (a `RETURNS TABLE(col_name ...)` clause implicitly declares a variable that collides with a same-named real table column inside a bare, unqualified `RETURNING ... INTO` reference) that only raises Postgres error `42702` on live execution against the actual schema — it is invisible to code review, type-checking, and static analysis alike. The same failure pattern recurring twice, in two different RPCs, in the same feature, is itself the lesson: any future PL/pgSQL function using `RETURNS TABLE` with a `RETURNING ... INTO` clause should have its output-column identifiers fully qualified with the table name as a matter of course, not only after a defect is found once.

### 6.3 A Configuration Typo Can Masquerade as an Unresolved External Approval

For several days, the working assumption was that MSG91 sending was blocked on DLT chain completion (Principal Entity, PE–TM Chain, Sender Header, Template) — a regulatory dependency outside engineering's control, consistent with the pattern captured in Section 3.4 above. `EBC-R1.2-WS5-05-RAD` found that once the DLT chain did complete, a separate and unrelated defect — a single stray hyphen in a locally-held environment variable — was the actual, sole cause of every remaining send failure. The lesson generalises the one in Section 3.4: "blocked by an external approval" and "blocked by a local configuration error" can present identically (both as request failures against the same provider), and a team should verify configuration values directly against provider documentation before attributing a persistent failure entirely to the external dependency, even when an external dependency is also genuinely still in progress.

### 6.4 A Product Owner's Manual Live Test Confirms Function, Not Release Readiness

The Product Owner's own confirmed end-to-end test on 27-Aug-2026 is real, first-hand evidence that the OTP flow functions correctly in a live production configuration. It is not, and is not represented here as, a substitute for Rad's own post-fix technical validation (diff review, build/lint/type checks against the two new migrations) or for Keerthi's independent, reproducible functional QA per Project Instructions §28–§29 — both of which remained outstanding as of this amendment, alongside a still-open Product Owner decision on the OTP-expiry wording mismatch identified in `EBC-R1.2-WS5-05-RAD` §6. Future workstreams should continue to treat a single successful manual test, however credible its source, as confirmation that a defect is fixed rather than as a release-readiness gate in itself.

### 6.5 Update to Section 4's Boundary

Section 4 above states that this document "does not assert that the DLT/MSG91 integration is complete." As of this amendment, the DLT chain is complete and a live, application-originated OTP send-to-verification cycle has been confirmed by the Product Owner (Section 6.1) — that specific caveat is superseded. The remainder of Section 4's boundary is unchanged and still applies: this document does not assert that all six troubleshooting categories in the Operations Runbook have been observed as incidents (two now have, per `EBC-R1.2-WS5-05-RAD`; the rest remain anticipated only), that PE–TM chain terminology has been independently verified against MSG91's or Jio's own official documentation beyond what the Product Owner has reported, or that formal functional QA (Keerthi) or Product Acceptance (Vivek) has occurred.

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only retrospective, per `EBC-R1.2-GOV-001`, amended per `EBC-R1.2-WS5-GOV-07-TIGER`. No application code, configuration, or implementation files were created, modified, or deleted in producing this document.*
