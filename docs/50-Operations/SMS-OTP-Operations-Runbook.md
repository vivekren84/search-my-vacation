# SMS OTP Operations Runbook — Journey Passport (MSG91 / India DLT)

```text
Document Type : Operations Runbook
Persona       : Tiger (Programme and Delivery Lead), per EBC-R1.2-GOV-001
Workstream    : WS5 – International Phone Number & OTP Verification
Applies to    : Journey Passport OTP send/verify feature, MSG91 provider, India DLT chain
Status        : Active — validated in production (27 August 2026)
Effective Date: 26 August 2026
```

## Document Information

| Field | Value |
| --- | --- |
| Owner | Tiger (Programme and Delivery Lead), with operational execution by Vivek (Product Owner / Authorised Representative) and engineering support by Rad |
| Applies to | The MSG91 SMS provider integration behind Journey Passport OTP verification (`web/lib/journey-passport-otp/`) |
| Related documents | `ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`; `docs/30-Governance/External-Integration-Definition-of-Done.md`; `docs/09-Development/EBC-R1.2-WS5-04-TIGER-DLT-Registration-External-Dependency-Transition.md`; `docs/10-Backlog/RELEASE-1.2.md` (Workstream 5); `EBC-R1.2-WS5-05-RAD`; `EBC-R1.2-WS5-IMP-02-RAD`; `EBC-R1.2-WS5-IMP-03-RAD`; `EBC-R1.2-WS5-GOV-07-TIGER` |
| Production validation | The full onboarding sequence in Section 2 was confirmed complete, and a live, application-originated OTP send → handset delivery → verification → Journey Passport completion cycle was confirmed by the Product Owner on 27-Aug-2026 (`EBC-R1.2-WS5-GOV-07-TIGER`). This confirms the sequence functions in production; it does not by itself constitute Rad's technical validation of the fix commits or Keerthi's formal functional QA, both of which remained outstanding as of this update. |
| Evidence status | Screenshots for the DLT approval steps in Section 2 remain **not attached to this repository** — see the Evidence Register (Section 5). Representative error evidence for two of the six troubleshooting categories in Section 3 (3.2, 3.3) is now available, per `EBC-R1.2-WS5-05-RAD`; the remainder are still recorded as anticipated categories only, not fabricated incidents. |

---

## 1. Purpose

This runbook is the reusable operational reference for setting up, and troubleshooting, an SMS OTP provider under India's DLT (Distributed Ledger Technology) regulatory regime — captured from Search My Vacation's first such integration (MSG91, Release 1.2 Workstream 5) so that this investigation does not need to be repeated for a future provider, a Sender Header renewal, or a new Template registration.

It is written for whoever is executing the operational (non-engineering) side of an OTP provider setup — most likely Vivek as the registered Authorised Representative, or a future operations owner acting on Vivek's behalf.

---

## 2. Initial Setup — the DLT/MSG91 Onboarding Sequence

This sequence reflects the actual order Search My Vacation's Principal Entity registration followed, cross-referenced against `docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 "DLT Registration Milestone Log" and Resume Checklist. Steps are numbered for tracking; several have no committed provider/regulator SLA and must be tracked as open operational dependencies, not engineering tasks (`ADR-R1.2-WS5-001` §3.4).

| # | Step | Description | Owner | SMV Status as of 27-Aug-2026 |
| --- | --- | --- | --- | --- |
| 1 | Provider account creation | Register a business account with the SMS provider (MSG91) and, in parallel, with the DLT registration platform for your telecom operator (Jio TrueConnect, for a Jio-routed sender) | Vivek | Complete |
| 2 | Principal Entity (PE) registration | Register the business as a Principal Entity on the DLT platform. Requires a Letter of Authority naming an Authorised Representative. Attracts a registration fee (₹5,900/year for SMV's registration), payable within a short window (~6 hours) after submission by the Primary User only — non-payment cancels the registration and invalidates submitted documents | Vivek (Authorised Representative) | **Complete** — Jio TrueConnect Registration Request Number `96220832`, submitted 23-Aug-2026, approved 24-Aug-2026 |
| 3 | Sender Header registration | Register a 6-character alphanumeric Sender Header under the approved Principal Entity | Vivek | **Complete** — `SMVTRV` Verified, 27-Aug-2026 |
| 4 | Content Template registration | Register the exact SMS message template(s) that will be sent, matching DLT's approved template-variable format | Vivek | **Complete** — `Search_My_Vacation_OTP` registered |
| 5 | **PE–TM Chain creation** | Create the Principal Entity–Telemarketer (PE–TM) chain: bind the approved Principal Entity to a Telemarketer entity on the DLT platform. This is a distinct registration step from Sender Header or Template registration and is a mandatory prerequisite for a Sender Header/Template to be usable for live sending — it is the specific mechanism underlying the "DLT Chain Binding" step already named in the Resume Checklist below | Vivek | **Complete** — Approved and Activated, 27-Aug-2026 |
| 6 | Telemarketer approval | The Telemarketer entity in the PE–TM chain must itself be approved before the chain is considered complete | Vivek / Jio / MSG91 | **Complete** — approved as part of PE–TM Chain activation, 27-Aug-2026 |
| 7 | MSG91 Template Registration | Register the corresponding template inside the MSG91 dashboard, bound to the approved Sender Header, yielding the `template_id` used by the codebase | Vivek | **Complete** |
| 8 | DLT Chain Registration | Confirm the full chain — Principal Entity, Telemarketer, Sender Header, Template — is registered and linked end-to-end on the DLT platform | Vivek | **Complete** — full chain confirmed 27-Aug-2026 |
| 9 | Template Re-verification | Re-verify the MSG91-side template exactly matches the DLT-approved template text/variable structure — a mismatch here is one of the more common late-stage rejection causes in DLT integrations generally | Vivek | **Complete** — Verified by DLT, 27-Aug-2026 |
| 10 | DLT Test Validation | Execute the provider's own test/validation tooling (where offered) ahead of a live send, to catch chain-binding or template mismatches before they reach a real traveller | Vivek / Rad | **Complete** — a manual "Test DLT" dashboard send was confirmed delivered prior to the application-originated test (`EBC-R1.2-WS5-05-RAD`) |
| 11 | Configure live MSG91 credentials | Once Sender Header, Template, and PE–TM Chain are all approved, obtain live `SMS_PROVIDER_API_KEY`, confirm `SMS_PROVIDER_SENDER_ID` and `SMS_PROVIDER_TEMPLATE_ID`, and set them in the production environment | Vivek → Rad | **Complete** — credentials configured; a malformed `SMS_PROVIDER_TEMPLATE_ID` (stray hyphen) was found and corrected on 27-Aug-2026 (`EBC-R1.2-WS5-05-RAD`) |
| 12 | End-to-End Production Verification | Execute one live OTP send/verify smoke test against real MSG91 credentials in production, closing the open Principal-Entity-parameter validation question (`ADR-R1.2-WS5-001` §5) | Rad, then Keerthi | **Complete (Product Owner manual test, 27-Aug-2026)** — Journey Passport created → OTP sent via MSG91 → SMS received on handset → OTP verified → Journey Passport completed → transitioned to Journey Director, no runtime errors; this closes the Principal-Entity-parameter question in practice (no explicit parameter was required for the successful send). Rad's own technical validation (diff/build/lint review of the two fix commits) and Keerthi's independent functional QA remain outstanding and are tracked separately in `docs/10-Backlog/RELEASE-1.2.md` |

Steps 1–2 map to the repository's existing Resume Checklist items 1–2; steps 3–11 map to and expand items 3–6; step 12 maps to items 7–8. This runbook's numbering is intentionally more granular than the Resume Checklist's, to give operational tracking finer resolution — the Resume Checklist in `RELEASE-1.2.md` remains the canonical, higher-level tracker and should be updated to reference this runbook rather than duplicated.

---

## 3. Troubleshooting

The six issue categories below are recorded per `EBC-R1.2-GOV-001`'s explicit instruction to capture "known issues" from Release 1.2. Where this session has no independently verified error text, screenshot, or timestamp for an issue, that is stated plainly rather than invented (Project Instructions §19, "Do not fabricate production content"). Each entry should be updated with real evidence (Section 5) as it becomes available, rather than left as a template.

### 3.1 PE–TM Chain Error on DLT

- **Symptoms:** The DLT platform (or MSG91, reflecting a DLT-side rejection) reports an error when attempting to bind, use, or verify the Principal Entity–Telemarketer chain — for example, a Sender Header or Template that cannot be activated because its associated PE–TM chain is missing, incomplete, or itself unapproved.
- **Root Cause:** A Sender Header or Template registered before, or without, a completed PE–TM chain; or a chain created against the wrong Telemarketer entity; or a chain still pending Telemarketer-side approval.
- **Diagnostic Steps:** (1) Confirm Principal Entity approval status on the DLT platform. (2) Confirm whether a PE–TM chain exists for this Principal Entity, and its own approval status, independent of Sender Header/Template status. (3) Confirm the Telemarketer entity referenced by the chain is the correct, approved one. (4) Cross-check the chain's status directly on the DLT platform rather than inferring it from MSG91's dashboard alone, since the two systems can be out of sync during the approval window.
- **Resolution:** Complete or correct the PE–TM chain (Section 2, step 5) before re-attempting Sender Header/Template activation. If the chain exists but is stuck pending, escalate per below rather than re-submitting a duplicate chain request.
- **Escalation Path:** Jio TrueConnect support (`support.truconnect@jio.com`, the channel already used for Principal Entity registration) for chain/registration-platform issues; MSG91 support for template-binding-side issues once the chain itself is confirmed approved.
- **Evidence on file:** None yet attached to this repository — see Section 5.

### 3.2 Template Missing

- **Symptoms:** An OTP send attempt (or MSG91 dashboard action) reports that no template is associated with the request, or `SMS_PROVIDER_TEMPLATE_ID` has no matching MSG91-side registration.
- **Root Cause:** Either the environment variable is unset/blank (the codebase's fail-closed design returns `not-configured` in this case, per `EBC-R1.2-WS5-04A-RAD` §6), or a template ID was set that does not correspond to an actually-registered MSG91 template (e.g. copied from documentation, a different provider account, or a since-deleted template).
- **Diagnostic Steps:** (1) Confirm `SMS_PROVIDER_TEMPLATE_ID` is set in the target environment (variable name only — see Project Instructions §25 on secret handling). (2) Confirm, in the MSG91 dashboard, that a template with exactly that ID exists and is in an approved (not draft/pending) state.
- **Resolution:** Complete Template registration and DLT approval (Section 2, steps 4/7–9) before configuring the variable; if already configured with an incorrect value, correct it to the live, approved template's ID.
- **Escalation Path:** MSG91 support/dashboard for template existence and status; Rad if the fail-closed behaviour itself appears not to be triggering correctly (an engineering question, not an operational one).
- **Evidence on file (confirmed incident, 27-Aug-2026):** `EBC-R1.2-WS5-05-RAD` documents seven confirmed MSG91 `400` responses (`"Template ID Missing or Invalid Template"`) traced to `.env.local`'s `SMS_PROVIDER_TEMPLATE_ID` holding `6a8ed5442e-b953fe9d0ea2e4` (a malformed value with a stray hyphen) instead of the correct `6a8ed5442eb953fe9d0ea2e4`. This was the sole cause of every application-originated send failure — the DLT/MSG91-side template registration itself was already correctly approved. Corrected the same day; confirmed resolved by a subsequent successful live send (Section 2, step 12).

### 3.3 Invalid Template

- **Symptoms:** MSG91 or the DLT platform rejects a template as invalid — typically a mismatch between the DLT-registered template text/variable placeholders and what is actually configured in the MSG91 dashboard, or a template that does not conform to DLT's variable-formatting rules (e.g. unbracketed or mismatched variable count).
- **Root Cause:** Drift between the DLT-approved template wording and the MSG91-side template configuration (Section 2, step 9 — Template Re-verification exists specifically to catch this); or a template drafted without following DLT's variable-placeholder conventions.
- **Diagnostic Steps:** (1) Compare the DLT-registered template text character-for-character against the MSG91 dashboard entry. (2) Confirm variable placeholders match in count, order, and bracket format. (3) Confirm the template category (OTP/Transactional/Promotional) matches what was registered on DLT — a category mismatch is a separate common rejection cause.
- **Resolution:** Correct the MSG91-side template to exactly match the DLT-approved text and resubmit for re-verification; do not attempt to "approximate" a DLT-approved template's wording.
- **Escalation Path:** MSG91 support for dashboard-side correction; Jio TrueConnect support if the DLT-side registration itself needs correction or resubmission.
- **Evidence on file:** No template-content mismatch was actually observed for SMV — the same `400` responses recorded under 3.2 carried the combined MSG91 error text `"Template ID Missing or Invalid Template"`, and root-cause analysis (`EBC-R1.2-WS5-05-RAD`) attributed them entirely to the malformed template ID (3.2), not to a text/variable mismatch. This category remains an anticipated failure mode for SMV, not an observed one, and should still be revised if a genuine template-content mismatch is encountered in future. One open item remains unresolved and is not a "Template" issue but is tracked here for visibility: the DLT-approved template text promises OTP validity "for 10 minutes," while the application is configured for a 5-minute expiry (`EBC-R1.2-WS5-05-RAD` §6) — a Product Owner decision, not yet made.

### 3.4 Sender ID Issues

- **Symptoms:** An OTP send fails or is rejected with a Sender ID / Sender Header mismatch or unrecognised-sender error; or the `sender` field's effect on delivery is unclear once a template is bound (a known open question — `EBC-R1.2-WS5-04A-RAD` §5).
- **Root Cause:** `SMS_PROVIDER_SENDER_ID` not approved; a value that does not match the DLT-registered Sender Header exactly (case and length matter); or uncertainty over whether MSG91's template-bound SendOTP endpoint still requires/validates a per-request `sender` field once a `template_id` is supplied.
- **Diagnostic Steps:** (1) Confirm Sender Header approval status directly with Jio/MSG91, not only by checking whether the environment variable is set. (2) Confirm the exact registered Sender Header string matches `SMS_PROVIDER_SENDER_ID` byte-for-byte. (3) If both check out and a delivery failure persists, treat the per-request `sender` field's exact behaviour as an open question to resolve via the live smoke test (Section 2, step 12), not as a configuration bug to keep re-attempting blind.
- **Resolution:** Wait for Sender Header approval before expecting live sends to succeed; once approved, set the exact approved string as `SMS_PROVIDER_SENDER_ID`.
- **Escalation Path:** Jio/MSG91 support for approval status and exact registered value; Rad only if the approved value is confirmed correct and a send still fails with a sender-related error.
- **Evidence on file:** SMV's own Sender Header (`SMVTRV`) was **Verified** on 27-Aug-2026 (`docs/10-Backlog/RELEASE-1.2.md`'s DLT Registration Milestone Log). No Sender ID error was actually encountered against SMV's own account — the confirmed live send (Section 2, step 12) succeeded without a sender-related rejection, and the open question of whether a per-request `sender` field is required alongside `template_id` is resolved in practice: it was not required for the successful send. This category remains otherwise an anticipated, not observed, failure mode.

### 3.5 Delivery Failures

- **Symptoms:** MSG91 accepts a send request (API call succeeds) but the SMS is not delivered to the traveller's handset, or is delivered with significant delay.
- **Root Cause (general, not yet observed against SMV's own live traffic):** Carrier-side filtering of unregistered or newly-registered senders; DND (Do Not Disturb) registry conflicts for promotional-category sends (not expected to apply to SMV's Transactional/OTP category, but worth ruling out); handset-level SMS blocking; or a genuinely delayed carrier queue during high SMS volume periods.
- **Diagnostic Steps:** (1) Confirm the MSG91 API response itself (not just the HTTP status) for a provider-side delivery receipt or failure code. (2) Confirm the template's DLT category is Transactional/OTP, not Promotional, since Promotional messages are subject to DND filtering that Transactional/OTP messages are not. (3) Test against multiple carriers/handsets before concluding a systemic issue rather than a single-handset anomaly.
- **Resolution:** Provider- and carrier-side; typically resolved by MSG91/Jio support once the delivery receipt data is provided to them. No code-level resolution is expected — this is why the codebase is designed to distinguish provider-side failure causes at all (`TD-R1.3-008`, WS5 Engineering Review 1).
- **Escalation Path:** MSG91 support, with the specific delivery/message ID from the failed send.
- **Evidence on file:** None — SMV has not yet reached live sending. This entry is written from general DLT/SMS-delivery domain knowledge, not from an SMV-specific incident, and should be revised once real delivery data exists.

### 3.6 DLT Verification Failures

- **Symptoms:** Any step in Section 2 (Principal Entity, Sender Header, Template, PE–TM Chain) is rejected or returned for correction by the DLT platform or Jio TrueConnect during its own verification process.
- **Root Cause (general pattern):** Incomplete or mismatched business documentation (GST/PAN/business registration details not matching across the Principal Entity record and supporting documents); a Letter of Authority naming a representative whose details don't match the submitting account; or a template/Sender Header submitted before its prerequisite step (e.g. Template submitted before PE–TM chain completion) was actually approved.
- **Diagnostic Steps:** (1) Read the specific rejection reason provided by the DLT platform — these are typically explicit about the failing field. (2) Cross-check the rejected submission's business details against the Principal Entity's approved registration record. (3) Confirm no prerequisite step (Section 2) was skipped or attempted out of order.
- **Resolution:** Correct the specific rejected field and resubmit; do not resubmit unchanged, since DLT verification failures are typically specific and reproducible until the underlying mismatch is fixed.
- **Escalation Path:** Jio TrueConnect support for registration-platform-side rejections; the Authorised Representative (Vivek) is the only party who can action a correction, per the Letter of Authority's scope.
- **Evidence on file:** None yet attached to this repository — see Section 5.

---

## 4. Vendor Documentation References

- MSG91 — "Check your SMS API and DLT Parameters": <https://msg91.com/help/dlt-registration-in-india/check-your-sms-api-and-dlt-parameters> (referenced in `EBC-R1.2-WS5-04A-RAD` §4 as the closest authoritative source for MSG91's SendOTP v5 request parameters; MSG91's own primary API reference pages returned empty/404 content on fetch attempts during two separate engineering sessions and could not be independently verified here).
- Jio TrueConnect DLT registration platform (`trueconnect.jio.com`) — used for SMV's own Principal Entity registration (Registration Request Number `96220832`) and Sender Header submission (`SMVTRV`); no public documentation link has been recorded in project governance to date.
- A representative third-party integration walkthrough (general DLT/MSG91 pattern, not authoritative): <https://abhishekjoshi-dev.medium.com/from-dlt-registration-to-sms-delivery-building-a-fully-compliance-indian-sms-gateway-e89e87fe5b86> (cited in `EBC-R1.2-WS5-04A-RAD` §4; describes MSG91's older `/api/v2/sendsms` endpoint, not the `/api/v5/otp` endpoint this codebase calls — included for general DLT-chain context only, not as a confirmed reference for SMV's exact integration).

---

## 5. Evidence Register

Per `EBC-R1.2-GOV-001`'s Evidence Required section, this runbook should be supplemented with the following as they become available. None are fabricated or assumed present in this edition:

| Evidence item | Status |
| --- | --- |
| DLT approval screenshots (Principal Entity, Sender Header, Template) | Still not attached — Principal Entity, PE–TM Chain, Sender Header, and Template are all recorded as text milestones in `RELEASE-1.2.md`'s DLT Registration Milestone Log (all confirmed Approved/Verified as of 27-Aug-2026), but no screenshot has been added to the repository or the Claude Project |
| PE–TM chain creation and approval evidence | Still not attached — chain is recorded as Approved and Activated (27-Aug-2026) as a text milestone only; no screenshot or platform export has been added |
| MSG91 template verification screenshots | Still not attached — template is recorded as Verified by DLT (27-Aug-2026) as a text milestone only |
| Representative error logs (Template Missing/Invalid) | **Attached, in substance** — `EBC-R1.2-WS5-05-RAD` (Claude Project) documents seven confirmed MSG91 `400` responses with the exact error text `"Template ID Missing or Invalid Template"`, correlated to the malformed `SMS_PROVIDER_TEMPLATE_ID` root cause. Not a screenshot, but a first-party investigation record with reproducible detail. |
| Representative error logs (PE–TM Chain Error, Sender ID, Delivery Failures, DLT Verification Failures) | Not attached — these four categories were not actually encountered against SMV's own account; Section 3's corresponding entries remain written from the issue categories named in `EBC-R1.2-GOV-001` and general DLT-domain knowledge, not from a captured SMV incident |
| Troubleshooting timeline (investigation → root cause → resolution) | **Attached, in substance** — `EBC-R1.2-WS5-05-RAD` records the Template ID investigation end-to-end (symptom → correlated failures → root cause → fix); the Product Owner's 27-Aug-2026 confirmation of the corrected, successful live send closes the loop |
| Vendor documentation links | Partially recorded — see Section 4; MSG91's own authoritative API reference could not be reached during any engineering session that attempted it |

This register should be updated in place as evidence is supplied, rather than superseded by a new document, consistent with Project Instructions §32 (prefer updating canonical documentation over creating competing versions).

---

*Prepared by Tiger (Programme and Delivery Lead) as a documentation-only Operations Runbook, per `EBC-R1.2-GOV-001`, updated per `EBC-R1.2-WS5-GOV-07-TIGER` to mark the onboarding sequence validated in production (27-Aug-2026). No application code, configuration, or implementation files were created, modified, or deleted in producing this document. No production data, secrets, or unverified evidence was fabricated.*
