# EBC-R1.2-WS5-04 — Journey Passport OTP Verification: DLT Registration Milestone & External Dependency Transition

```text
Document Type : Release Governance Consolidation (documentation only — no code, infrastructure,
                configuration or functional behaviour modified)
EBC ID        : EBC-R1.2-WS5-04
Persona       : Tiger — Programme and Delivery Lead
Workstream    : WS5 — International Phone Number & OTP Verification
Tracker Tasks : Cross-cutting governance record; does not itself change any R1.2-05.xx task
Reviewer      : Tiger | Business Owner: Vivek
Status        : Approved — Governance Record
Approved Date : 23 Aug 2026
Numbering Note: The instruction that produced this record was originally labelled
                "EBC-R1.2-WS5-02", which collides with the existing Sophie UX Review document
                of that ID. This record is filed under the next free Workstream 5 number,
                EBC-R1.2-WS5-04, to keep the governance audit trail unambiguous. No content
                in the existing EBC-R1.2-WS5-02 (Sophie, UX Review) is affected or superseded
                by this document.
```

---

## 1. Purpose

This document is the governance record for two related activities: (a) documenting the Jio TrueConnect DLT Principal Entity registration milestone and transitioning Workstream 5 into an accurate "partially implemented, waiting on an external dependency" state, and (b) correcting two Release 1.2 Decision Log entries after an implementation-time finding required a change to the approach `DEC-R1.2-018` had approved. No application code, infrastructure, configuration, or functional behaviour was modified in producing this record. `docs/10-Backlog/RELEASE-1.2.md` is the canonical, updated source of truth for Workstream 5 status; this document explains and cross-references those changes.

---

## 2. Background

Since `EBC-R1.2-WS5-03` was approved as a consolidated implementation brief, two things happened outside this session's direct involvement, discovered during this governance pass via the repository (Project Instructions §17 — repository evidence takes precedence over prior conversation context):

1. **Implementation was prepared.** Commit `77d3a91` ("feat(ws5): complete Journey Passport OTP verification flow", `vivek@searchmyvacation.com`, 22-Aug-2026) on branch `feature/ebc-r1.2-ws5-03-otp-verification` added the OTP database migration, the `journey-passport-otp` library, the send/verify API routes, the `/leads` token gate, the closure-screen UI and Passport Stamp resequencing, and MSG91 integration behind an abstracted interface. `EBC-R1.2-WS5-03` itself gained a new §13 ("Implementation Amendments") recording two Product-Owner-approved deviations from the original brief — see Section 4 below.
2. **DLT Principal Entity registration was submitted.** Via Jio TrueConnect, with a Letter of Authority executed and a confirmation email received. See Section 3.

This record deliberately avoids overstating either fact. Per Product Owner direction, the OTP feature and the MSG91 integration are **prepared in the repository, not production-complete** — completeness requires the full DLT approval chain (Principal Entity, Sender Header, Template, Chain Binding) plus live credential configuration, engineering validation, and Keerthi's functional QA, none of which have yet occurred.

---

## 3. DLT Registration Milestone

Recorded in full in `docs/10-Backlog/RELEASE-1.2.md`, Workstream 5 § "DLT Registration Milestone Log":

- Principal Entity registration request submitted via Jio TrueConnect, 23-Aug-2026, Registration Request Number **96220832**.
- Confirmation email received from `support.truconnect@jio.com` to `vivek@searchmyvacation.com`, same date.
- Letter of Authority executed at Chennai, 23-Aug-2026, authorising Mr. Vivek T Renganathan (Partner) as Authorised Representative for DLT/Jio TrueConnect/MSG91 registration activities. The document itself is held outside the repository — referenced here as evidence of the completed step, not committed, per the instruction that produced this record.
- Principal Entity approval is pending. It is outside Team Satvi's control, with no committed SLA from Jio/TRAI. The registration fee (₹5,900/year) becomes payable roughly six hours after registration, by the Primary User only; incomplete payment cancels the registration and invalidates submitted documents.

---

## 4. Decision Log Corrections

Implementing `DEC-R1.2-018`'s originally-approved in-place `+91` backfill was found, via `npm run verify:journey-leads`, to break the already-shipped Callback Request feature (`EBC-013`), whose RPC does a strict equality match against `mobile_normalized` in its original bare-national-number form. The Product Owner approved a dual-field strategy instead, at implementation time, recorded in `EBC-R1.2-WS5-03` §13.1.

The Release 1.2 Decision Log has been corrected accordingly:

- **`DEC-R1.2-018`** — Status changed from Approved to **Superseded**. Text retained, not deleted, per the Decision Log's own convention.
- **`DEC-R1.2-019`** (new) — retroactively ratifies the dual-field `mobile_e164` strategy, mirroring how `DEC-R1.2-014`/`DEC-R1.2-015` closed similar gaps between an implementation-time Product Owner approval and a formal Decision Log entry.

No other Decision Log entries were changed.

---

## 5. Corrected Governance Status

Per Product Owner direction, superseding this record's own earlier draft framing:

- **Workstream 5 status:** 🟡 Partially Implemented – Waiting for External DLT Dependency. Not "Implementation Complete."
- **OTP feature:** Implementation prepared. Production validation pending.
- **MSG91 integration:** Pending Production Enablement — not complete. Requires Principal Entity approval, Sender Header approval, Template approval, DLT Chain Binding, and live credential configuration.
- **Engineering work:** Remains partially blocked by the external DLT dependency.
- **Functional QA:** Will begin only after Principal Entity approval, Sender Header configuration, Template approval, and live SMS delivery become available — not before, and not on a sandbox/non-production basis ahead of that chain.
- **Release Tracker:** Workstream 5 shall remain 🟡 Partially Implemented – Waiting for External DLT Dependency and shall not be marked Complete until production SMS functionality and end-to-end validation have been successfully completed.

The full corrected text lives in `docs/10-Backlog/RELEASE-1.2.md`'s Workstream 5 section (Field/Value table, DLT Registration Milestone Log, Resume Checklist, and Governance Note).

---

## 6. Resume Checklist

Reproduced from `docs/10-Backlog/RELEASE-1.2.md` for traceability — the tracker is the canonical copy:

1. Verify Principal Entity approval.
2. Complete DLT payment/activation (if applicable).
3. Configure live MSG91 credentials.
4. Register Sender Header(s).
5. Register SMS Templates.
6. Complete DLT Chain Binding.
7. Execute live OTP testing.
8. Execute Keerthi QA.
9. Update Release documentation.
10. Close Workstream 5.

All ten steps depend on the external DLT approval chain; none are to be read as available ahead of it.

---

## 7. Out of Scope / Not Performed

No application code, infrastructure, configuration, or functional behaviour was modified in producing this record. No implementation branch was created (one already existed, created outside this session). No commits or pushes were made. The individual `R1.2-05.18`–`R1.2-05.30` task rows in the Section 6.5 tracker were intentionally left at their existing status — updating them requires Rad's own completion report and engineering validation evidence (Project Instructions §28), which this governance pass does not have, and is recommended as a separate follow-up card.
