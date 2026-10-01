# EBC-R1.3-WS13-015-QA · Phase 0: QA Completion Report

**Persona:** Keerthi (He), Functional Validation Specialist
**Handover:** `EBC-R1.3-WS13-015` Engineering → QA Handover (Tiger), as clarified by decisions D1–D3 (Tiger / Product Owner, 1 Oct 2026)
**Engineering input:** `EBC-R1.3-WS13-005-P0` Rad, Phase 0 Engineering Completion Report Rev 3 (§9 hand-over list)
**Release / Workstream / Phase:** 1.3 / WS13 Journey Workspace / Phase 0 (Foundation and Journey Planning conversion v2)
**Date:** 1 October 2026
**Recommendation:** ✅ **PASS**: no defects; observations and one approved Not Executed scenario are recorded for Phase 1

---

## 1. Summary

Phase 0 behaves as specified on the authoritative Preview. QA covered:

- authentication;
- authorisation for owner, non-owner, deactivated user and Administrator;
- the full Journey Planning → Journey conversion v2 flow (Service Category, Confirm dialog, every reachable blocking rule, the dates/nights rule, success, and repeat refusal);
- WS12 / WS11 / Phase A regression, PRA-01 / PRA-02, dialog keyboard accessibility, responsive layout and console.

No defect was found. The SEC-01 fix (only the owner or an Administrator may convert) is confirmed at runtime, both in the screens and at the API.

| Area | Result |
|---|---|
| Signed-out route and API protection | Passed |
| Authentication: sign-in, session persistence, logout | Passed |
| Authorisation: owner, non-owner (SEC-01), deactivated user, Administrator | Passed |
| Service Category (CM-07) | Passed |
| Conversion v2 (CM-01, CM-02, CM-05, PD-A) | Passed |
| Replacement conversion (BR-046, WS13-004A AC-01..07) | **Not Executed**: test data not available (approved, §6) |
| History labels | Passed |
| WS12 regression incl. Lost / Archive, PRA-01, PRA-02 | Passed |
| Phase A CM-03 regression | Passed |
| Dialog keyboard accessibility | Passed |
| Responsive | Passed (pre-existing header item only) |
| Console | Passed (no errors) |
| Defects | 0 Critical · 0 High · 0 Medium · 0 Low |

## 2. Environment

| Item | Value |
|---|---|
| Authoritative environment (D2) | Vercel Preview `dpl_5831fDobpqs6WNSpjdcLNVM9Cr2j`, `search-my-vacation-lnszgkgdb-search-my-vacation.vercel.app`, READY |
| Code baseline | Branch `feature/r1.3-ws13-journey-workspace`, built from `cfd623e` (contains Phase 0 code `84c8904`). Repository HEAD `021bb55`, documentation only after `84c8904`, working tree clean |
| Database | Shared Supabase project with M01–M10 applied (DEC-R1.3-021) |
| Localhost | Not used (D2: optional, for reproduction only; nothing needed reproducing) |
| Browser | Google Chrome (desktop) via Claude in Chrome; window widths 1440, 820, 500 px (Chrome minimum) |
| Identities | Tiger, Archie, Sneaky (Privilege User accounts) and Administrator. **The Product Owner performed every sign-in**; Keerthi never handled credentials (agreed procedure) |
| Test data (D3) | `QA-WS13-P0-Conversion-01`, `-NonOwner-01`, `-Regression-Lost`, `-Regression-Archived`, `-Regression-PRA`; Journeys **JRN-1005** and **JRN-1006**. To be removed during Release 1.3 readiness (PO decision) |

## 3. Baseline Conformance

| Baseline | Revision | Result | Supporting evidence |
|---|---|---|---|
| Product: `EBC-R1.3-WS13-001` Journey Workspace Product Baseline (incl. D-09, FR-JW-05, BR-046, CM-01/02/05/07, PD-A) | Rev 3 | **Conformant** | P0-CONV-01..10, P0-SC-01..05; replacement (BR-046) Not Executed per PO decision |
| UX: `EBC-R1.3-WS13-002` UX Specification §36.2 / §36.3 (Service Category tag and helper, Confirm dialog, messages, toast) | Rev 4a | **Conformant** | E-02, E-03; exact copy verified (§5); deviations ED-02/ED-03/ED-04 already declared by Rad |
| Architecture: `EBC-R1.3-WS13-003` + `004A`; AD-WS13-001..007 (ratified DEC-R1.3-020) | As ratified | **Conformant** | Server-side enforcement of every conversion rule (API rejects independently of UI); owner-or-Administrator authorisation; deactivated-user refusal (AD-WS13-007); audit `record_converted` carries `journey_reference` and confirmed dates |
| Engineering: `EBC-R1.3-WS13-004` plan (WP-0.1..0.14) and `EBC-R1.3-WS13-005-P0` Completion Report | Rev 3 | **Conformant** | Runtime behaviour matches every §9 hand-over item; temporary limitations TL-01..09 behave as declared |
| Engineering Handbook (`docs/15-AI-Operating-Model/CLAUDE.md`) §7 | v1.1 | **Conformant** | QA was read-only on code; test data followed D3 naming |

## 4. QA Coverage Summary

| Dimension | Status | Notes |
|---|---|---|
| Desktop | **Passed** | 1440 px, all flows |
| Tablet | **Passed** | 820 px, Dashboard and Confirm dialog |
| Mobile | **Passed** | 500 px (Chrome minimum width): dialog fits (16–484 px), list table scrolls inside its own container, mobile navigation present. Below 500 px **Not Tested** (browser limit). Pre-existing 4 px header overflow only (Phase A OBS-QA-PA-01, backlog) |
| Keyboard | **Passed** | Dialog focus on open, Tab / Shift+Tab trap, aria-disabled Confirm focusable and inert, Esc and Cancel return focus, "Set in Trip Basics" moves focus to the field |
| Console | **Passed** | No errors or exceptions observed (Tiger and Administrator sessions) |
| Preview | **Passed** | All execution on the authoritative Preview |
| Regression | **Passed** | WS11 sign-in, Dashboard, navigation, logout; WS12 create, claim, stages, Lost, Archive, PRA-01, PRA-02; Phase A Quick Actions |

## 5. Functional Test Results

### 5.1 Signed-out protection

| ID | Requirement | Steps | Expected | Actual | Status |
|---|---|---|---|---|---|
| P0-SEC-01 | Route protection | Signed out, open each of 9 Workspace pages | Redirect to sign-in with `redirectTo` | All 9 redirect, `redirectTo` preserved | Passed |
| P0-SEC-02 | API protection | Signed out, call 9 Workspace APIs incl. decision and reference-data | 401 | All 401 "Not signed in." | Passed |

### 5.2 Authentication

| ID | Requirement | Expected | Actual | Status |
|---|---|---|---|---|
| P0-AUTH-01 | Sign-in (Tiger) | Dashboard loads | Loaded, role shown "Workspace User" | Passed |
| P0-AUTH-02 | Session persistence | New tab stays signed in | Signed in | Passed |
| P0-AUTH-03 | Logout | Sign-in page; other tabs and APIs lose access; Back does not restore | All as expected (API 401 after logout) | Passed |
| P0-AUTH-04 | Second user (Archie), Administrator | Sign-in and Dashboard | Both pass | Passed |

### 5.3 Authorisation

| ID | Requirement | Expected | Actual | Status |
|---|---|---|---|---|
| P0-AUTHZ-01 | Non-owner cannot convert via UI (SEC-01) | Refused, record unchanged | "You cannot record a decision on this record."; stays Decision | Passed (E-08) |
| P0-AUTHZ-02 | Non-owner blocked at API | 403 for convert, Lost, Trip Basics, stage change | All 403 | Passed |
| P0-AUTHZ-03 | Record unchanged after attempts | No change | Decision, adults 2, no outcome | Passed |
| P0-INACT-01 | Deactivated user refused at sign-in | Refusal message | "This account isn't authorised for Workspace access. Contact an Administrator." | Passed (E-09) |
| P0-INACT-02 | Deactivated user, direct page access | Redirect | All pages → sign-in `reason=unauthorized` | Passed |
| P0-INACT-03 | Deactivated user, APIs | 403, nothing created | All 403; `QA-WS13-P0-Inactive-ShouldFail` not created | Passed |
| P0-ADMIN-01 | Administrator may convert a record owned by another user | Conversion succeeds; owner unchanged; actor = Administrator | JRN-1006 created; owner remains Tiger; audit actor = Administrator | Passed |

### 5.4 Service Category (CM-07)

| ID | Expected | Actual | Status |
|---|---|---|---|
| P0-SC-01 | Field on New Record and Trip Basics, tag "Needed to confirm", helper "Optional while planning. You'll need it to confirm the Journey." | As specified; 7 options | Passed |
| P0-SC-02 | Optional while planning | Record created and progressed to Decision with no category | Passed |
| P0-SC-03 | Set at creation | NonOwner-01 created with International, persisted | Passed |
| P0-SC-04 | Set later in Trip Basics | Saved Domestic; persisted | Passed |
| P0-SC-05 | Invalid value rejected | 400 `service_category_invalid` "Choose a Service Category from the list." | Passed |

### 5.5 Conversion v2

| ID | Requirement | Expected | Actual | Status |
|---|---|---|---|---|
| P0-CONV-01 | Dialog opens with prerequisites | Dates, nights, Service Category, owner shown; focus on start date | As expected | Passed (E-02) |
| P0-CONV-02 | All blocking issues shown together | Dates + Service Category messages together | "Add the confirmed start and end dates." and "Choose a Service Category before confirming." | Passed |
| P0-CONV-03 | Confirm disabled while blocked | aria-disabled, focusable, Enter inert | As expected | Passed |
| P0-CONV-04 | Dates/nights mismatch (UI) | Specified copy; button disabled | "These dates cover 2 nights, but Trip Basics says 4. Change the dates or the nights so they match." | Passed (E-03) |
| P0-CONV-05 | Server enforces each rule | 400 with issues | No category, no dates, end before start, mismatch: all 400 with the specified messages | Passed |
| P0-CONV-06 | Owner required | n/a via UI | Not reachable through the UI (ownership is required before Discovery). **Covered by Rad's database tests** per Tiger decision | Passed (by reference) |
| P0-CONV-07 | Successful conversion (owner) | Closed · Confirmed; JRN created with dates | JRN-1005, 10–14 Dec 2026 | Passed (E-05) |
| P0-CONV-08 | Success toast | "Journey JRN-xxxx created." | "Journey JRN-1006 created." (Administrator run) | Passed |
| P0-CONV-09 | No second conversion | Refused | 403 `record_not_in_decision_stage` | Passed |
| P0-CONV-10 | History labels | New events labelled | "Converted to Journey", "Record closed" | Passed |
| P0-REPL-01 | Replacement conversion | — | **Not Executed**: see §6 | Not Executed |

### 5.6 Regression

| ID | Requirement | Actual | Status |
|---|---|---|---|
| P0-REG-01 | WS12 create / claim / stage progression | Claim → Discovery → Planning → Proposal Shared → Decision | Passed |
| P0-REG-02 | Lost outcome unchanged | Closed, outcome lost, no Journey, no category needed | Passed |
| P0-REG-03 | Archive outcome unchanged | Closed, outcome archived, no Journey | Passed |
| P0-REG-04 | PRA-01 field-specific validation | All failing fields returned together; `adults_required` vs `adults_must_be_positive`; Planning gate lists each missing field (code unchanged) | Passed |
| P0-REG-05 | PRA-02 ownership gate | Unowned → Discovery refused "This record must be claimed before it can move to Discovery." | Passed |
| P0-REG-06 | Service Category not added to the Planning gate | Gate lists only the five Trip Basics fields | Passed |
| P0-REG-07 | Phase A CM-03 | Exactly New Lead, Add Traveller, New Vendor for all three roles; no Create Journey / My Work | Passed |
| P0-REG-08 | Navigation | All 7 links present (Tiger, Archie, Administrator) | Passed |

## 6. Not Executed

| ID | Scenario | Reason | Reference | Carry-forward |
|---|---|---|---|---|
| P0-REPL-01 | Replacement record conversion (supersession, contact carry, document status reset, IN-01/IN-05, "original not on hold" message) | **Test data not available during Phase 0 QA.** Phase 0 has no screen to put a Journey on hold or create a replacement record; PO decision: no database-prepared data | Rad, `EBC-R1.3-WS13-005-P0` §7 local test group "replacement conversion" | Phase 1 QA (expanded testing once Journey screens exist) |

## 7. Defect Register

No defects were raised.

## 8. Observations (accepted by Tiger; no defect records)

| ID | Observation | Classification / disposition |
|---|---|---|
| OBS-P0-QA-01 | Conversion success toast has no live region (not announced by screen readers) and disappears after 6 s; afterwards the JRN reference is not shown anywhere in Phase 0 | Minor UX / Accessibility Observation; review when Journey screens arrive (Phase 1) |
| OBS-P0-QA-02 | Response times (informational baseline) | See §9 |
| OBS-P0-QA-03 | Owner-required rule not reachable via UI | Covered by engineering verification |
| OBS-P0-QA-04 | Journey Planning record screen shows decision buttons and editable Trip Basics to a non-owner; the server refuses on save | Existing WS12 behaviour; Phase 1 carry-forward |
| OBS-P0-QA-05 | Owner shown as raw user id on record, list and Confirm dialog | Known ED-04 / TL-01; Phase 1 |
| OBS-P0-QA-06 | Deactivated user's sign-in session remains in the browser after refusal (access still blocked) | Informational; future enhancement |
| OBS-P0-QA-07 | API refusal for a deactivated user reads "Not provisioned as Workspace staff." (same as never-provisioned) | Informational; future enhancement |
| (known) | Welcome name derived from email (handover §10) | Known TL-05 / ED-07; Phase 1 |
| (known) | 4 px header overflow at 500 px | Phase A OBS-QA-PA-01, already in backlog |

## 9. Response-Time Baseline (informational)

| Action | Observed |
|---|---|
| Journey Planning list API | 1.5–3.2 s |
| Create record (UI, submit → detail page) | ~9 s |
| Claim / stage change (UI) | ~5–10 s each |
| Conversion (Administrator, click → toast) | 6.8 s |
| Refused actions (non-owner) | 1.7–2.7 s |

## 10. Evidence

Screenshots in `QA-WS13-P0-evidence/`:

- E-01: Tiger Dashboard (Phase A Quick Actions);
- E-02: Confirm dialog with combined blocking messages;
- E-03: dates/nights mismatch;
- E-04: conversion in progress;
- E-05: Conversion-01 Closed · Confirmed;
- E-06: Archie viewing Tiger's record;
- E-07: Archie's Confirm dialog (raw owner id);
- E-08: Archie refused;
- E-09: Sneaky refused.

API request/response results and audit events are quoted in §5. Administrator-run screenshots were viewed during execution but were not retained as files; the results are recorded in §5.3 and §5.5.

## 11. Exit Criteria (`EBC-R1.3-WS13-015` §13)

| Criterion | Status |
|---|---|
| All planned test cases executed | Met, except P0-REPL-01 Not Executed by PO decision |
| Critical defects resolved | Met (none) |
| High defects resolved or accepted | Met (none) |
| Regression testing completed | Met |
| QA recommendation issued | Met (§12) |

## 12. QA Recommendation

**PASS.** Phase 0 conforms to the approved Product, UX, Architecture and Engineering baselines on the authoritative Preview, with no defects. The authorisation controls, including SEC-01 and deactivated-user refusal, hold at runtime in both the screens and the API.

Carry forward to Phase 1:

- the replacement-conversion scenario (P0-REPL-01);
- the observations in §8.

**Keerthi recommends Phase 0 for Product Owner Acceptance.**

This is functional validation only; it is not Sri's traveller-experience review or the Product Owner's acceptance decision. No code or repository file was modified during QA.

---

*Prepared by Keerthi, Functional Validation Specialist, on behalf of Team Satvi.*
