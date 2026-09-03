# Search My Vacation

# Release 1.2 — Release Notes

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.2 Release Notes |
| Version | 1.0 |
| Status | Final |
| Release | 1.2 |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Production Deployment Date | 03-Sep-2026 (merge commit `e1196db` into `main`) |
| Git Tag | `v1.2.0` |
| Audience | Written for both technical (engineering, QA) and non-technical (Product Owner, future onboarding) readers |
| Source Governance | `EBC-R1.2-WS8-05` (Tiger, Release 1.2 Release Notes & Release 1.3 Transition Documentation) |
| Canonical Copy | This document (`docs/09-Development/RELEASE-1.2-RELEASE-NOTES.md`) is the canonical Release 1.2 release notes record. `docs/10-Backlog/RELEASE-1.2.md` remains the canonical release *tracker* (task-level detail, decision log, risk register); this document is the release-level summary derived from it, written for onboarding, future reference and optional use as the GitHub Release description. |

---

## Document Change History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 03-Sep-2026 | Tiger | Initial creation, per `EBC-R1.2-WS8-05`. Consolidates Release 1.2's final closure record (`RELEASE-1.2.md` §18, `EBC-R1.2-WS8-04`), release-wide functional regression (`EBC-R1.2-WS8-QA-01`), release-wide traveller-experience validation (`EBC-R1.2-WS8-SRI-01`) and production smoke validation (`EBC-R1.2-WS8-05-KEERTHI-Production-Smoke-Validation`, a Claude Project working document sharing this card's EBC ID — see the Governance Note in Section 16) into a single standalone release-notes document. Documentation only — no code, configuration or database changed. |

---

## Governance Note: EBC-ID Naming Collision (Disclosed)

This document is produced under `EBC-R1.2-WS8-05` (Tiger, Release Notes & Release 1.3 Transition Documentation). A separate, pre-existing Claude Project working document — `claude/EBC-R1.2-WS8-05-KEERTHI-Production-Smoke-Validation.md` (Keerthi, Production Smoke Validation, 03-Sep-2026) — independently carries the same EBC ID. This is a naming collision, not a duplicate or superseding record: the two documents cover different work by different personas, and Keerthi's smoke-validation report is in fact one of this document's primary evidence sources (Section 14). Consistent with this project's established practice for prior ID collisions (e.g. `EBC-R1.2-WS3-QA-01`, disambiguated as "(v2)"), this is disclosed here transparently rather than silently resolved. No document is renamed or altered by this disclosure; a future Tiger governance pass may wish to assign the smoke-validation report a distinguishing suffix (e.g. `EBC-R1.2-WS8-05-KEERTHI`) for long-term clarity.

---

# 1. Executive Summary

Release 1.2 raised the premium quality and trustworthiness of the Search My Vacation traveller experience while strengthening the data and verification layers beneath it. In plain terms: the homepage looks and feels more premium; the Journey Passport is more reliable and better validated; travellers' phone numbers are now verified by SMS one-time password (OTP) before a travel enquiry is created, protecting the business from fraudulent or low-quality leads; destination entry moved from free-text typing to a fast, validated search grounded in a real global places dataset; and international travellers (not just Indian mobile numbers) can now be reached. Underneath, engineering matured its own delivery discipline — every significant change was independently reviewed by a different specialist before being accepted, and a serious destination-search performance problem was traced to its true root cause rather than patched over.

Release 1.2 was deployed to production on 03-Sep-2026 (`v1.2.0`) and passed a live, real-OTP production smoke test the same day covering the full traveller journey end-to-end: Homepage → Journey Passport → OTP verification → Journey Director → Recommendations → Itinerary → Completion → WhatsApp handoff. No Severity 1 or Severity 2 defects were found anywhere in Release 1.2's validation — functional regression, traveller-experience review, and production smoke testing each independently returned a **Pass**, two of the three with minor, non-blocking observations that are carried forward below (Section 11) rather than left unrecorded.

---

# 2. Major Features

- **International phone number & OTP verification for the Journey Passport.** Every Journey Passport submission now requires a successfully verified SMS one-time password before a lead is created, supporting E.164 international numbers (not India-only). This is the release's single largest trust-and-fraud-prevention improvement.
- **Validated destination search.** Free-text destination entry was replaced with a fast, searchable, multi-select autocomplete validated against a real geographic dataset (GeoNames), while Journey Director remains the sole authority on which destinations Search My Vacation actually serves.
- **Homepage premium visual refinement.** A targeted visual pass — refined mood-card illustration palette, reduced gold saturation, the Hero kept as the dominant element — rather than a full redesign, independently re-confirmed by a dedicated Homepage Architecture Validation Review.
- **Destination Intelligence evolution.** A weighted Primary/Secondary/Tertiary destination-preference model was introduced as the preferred Journey Director recommendation approach, alongside a governed native-ID generation and vocabulary-alignment pipeline with an appointed Destination Operational Steward.
- **Experiences vs Journey Mood rationalisation.** The overlapping "Experiences" section was retired from public navigation and the homepage (implementation and assets deliberately preserved, not deleted, for possible future reuse), removing a source of traveller confusion between two similar product concepts.

---

# 3. UX Improvements

- Homepage mood-card illustrations moved toward ivory/champagne tones with reduced gold saturation, keeping the Hero as the dominant visual element.
- Four Journey Passport entry-context defects were resolved across the Romance, Companion, and Pace & Timing paths, plus traveller-name field validation (rejecting numeric characters while permitting letters, spaces, hyphens and apostrophes).
- Destination search returns fast, correctly disambiguated results (confirmed live in production smoke testing against a "Switzerland" search).
- The Journey Passport Review chapter accurately reflects every prior answer, and a live character counter was confirmed working on the traveller-name field.
- Traveller-experience review (Sri) rated the overall experience "genuinely warm, well-crafted, premium-feeling," with the Journey Director reveal singled out as the standout moment.
- A small number of traveller-facing UX refinements were evaluated but deliberately deferred to Release 1.3 rather than rushed — see Section 12.

---

# 4. Architecture Improvements

- Two Architecture Decision Records were drafted and ratified: `ADR-R1.2-WS3-001` (Destination Knowledge Governance) and `ADR-R1.2-WS5-001` (DLT External Provider Onboarding), each converting a decision already made in practice into a permanent, reusable architecture record.
- A fail-closed OTP provider design was adopted: the SMS provider integration returns a `not-configured` state rather than erroring when credentials are absent, which let engineering build, review and functionally validate the entire OTP flow independently of the external MSG91/DLT regulatory approval timeline.
- Journey Director was preserved as the sole served-destination authority throughout both the destination-autocomplete and destination-intelligence changes — new input surfaces were deliberately not allowed to implicitly expand what the platform claims to serve.
- MSG91 was selected as the SMS provider behind an internal abstraction interface, so the provider can be replaced in future without touching Journey Passport business logic.

---

# 5. Journey Passport Enhancements

- Mandatory OTP verification before a Journey Passport submission completes (scoped to Journey Passport only).
- E.164 international phone number support via `libphonenumber-js` across capture points.
- Four entry-context defects resolved (Romance, Companion, Pace & Timing paths) plus traveller-name validation.
- Destination entry replaced with a validated, searchable autocomplete (GeoNames-backed), delivered across eight implementation phases from foundation through accessibility/interaction validation.
- Confirmed live in production: Passport ID generation (`SMV-8RNH3SLT` in the 03-Sep-2026 smoke test), progress tracking through all six chapters, and an accurate Review chapter summary.

---

# 6. Journey Director Enhancements

- The Journey Director transition immediately following OTP verification — the Product Owner's specific area of concern heading into release — was confirmed in production to complete reliably, with no infinite loading, no blank screen, and no blocking console errors.
- Journey Reflection correctly personalises copy from the traveller's prior answers (name, companion type, destination mood, timing) rather than presenting generic text.
- Recommendation cards render with destination imagery, reasoning text and Journey Match messaging (e.g. "The Perfect Match," "The Beautiful Puzzle," "The Hidden Gem").
- Itinerary detail (Journey Highlights, suggested duration, travel style) loads correctly from a selected recommendation.
- Journey Director's role as the sole served-destination authority was explicitly preserved throughout Release 1.2's destination-related changes (Sections 4, 7).

---

# 7. Destination Intelligence Improvements

- Introduced a weighted Primary/Secondary/Tertiary destination-preference ordering as the preferred Journey Director recommendation model, governed by `ADR-R1.2-WS3-001`.
- Delivered the Phase 0–2 native-ID implementation chain: governance foundations, an appointed Destination Operational Steward, and generation/vocabulary alignment.
- Diagnosed and resolved a significant destination-search performance and reliability problem down to true root cause — PostgreSQL planner and expression-index behaviour on `search_geo_places` — through an eleven-part architecture investigation, closed with a dynamic query-planning rewrite rather than a narrow index tweak.
- Two structurally identical PL/pgSQL variable-shadowing defects, invisible to static analysis, were found only against a live schema and fixed.
- Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour) were explicitly scoped out and deferred to Release 1.3, not implemented in Release 1.2 (Section 12).

---

# 8. Technical Improvements

- A self-hosted GeoNames dataset replaced paid destination APIs for geographic validation.
- A fail-closed OTP architecture cleanly separated "engineering complete" from "operationally deployable" — engineering could validate the full OTP flow before the external regulatory dependency (India's DLT chain) was live.
- Temporary `[SMV-DBG]` OTP debug logging was removed from the codebase before release (commit `45637d6`); a repository-wide `grep` confirmed zero remaining matches.
- Nine Supabase migrations shipped across the release (Section 15).

---

# 9. Operational Improvements

- Production-database cleanup of Release 1.2 validation data (leads, callbacks, events, OTP challenges) completed and independently verified, with zero orphaned records (`EBC-R1.2-WS8-03`).
- A GeoNames import runbook and an SMS/OTP Operations Runbook were produced as reusable institutional knowledge, not one-off notes.
- India's DLT regulatory registration chain (Principal Entity, Sender Header, Template, and a previously-undocumented Principal Entity–Telemarketer chain requirement) was navigated to a confirmed live, end-to-end production OTP send-to-verification cycle.
- **Residual, non-blocking:** the real lead record created during the 03-Sep-2026 production smoke test (Passport ID `SMV-8RNH3SLT`, test traveller "Keerthi Prod Smoke Test") was intentionally created to validate the live flow and, per that test's own explicit scope note, was **not** cleaned up as part of the smoke test itself. This is a small, named follow-up for the same operational-cleanup process used in `EBC-R1.2-WS8-03`, not a defect.

---

# 10. Bug Fixes

- Resolved four Journey Passport entry-context defects across the Romance, Companion, and Pace & Timing paths.
- Added traveller-name field validation rejecting numeric characters while permitting letters, spaces, hyphens and apostrophes.
- Fixed two structurally identical PL/pgSQL variable-shadowing defects in destination-search database functions, found only against a live schema.
- Resolved a `search_geo_places` performance/reliability regression via a dynamic query-planning rewrite, following an eleven-part root-cause investigation.
- Removed temporary `[SMV-DBG]` OTP debug logging before release.

---

# 11. Known Non-Blocking Observations

None of the following is a Severity 1 or Severity 2 defect, and none blocks Release 1.2. Each is disclosed rather than silently dropped, consistent with this project's governance discipline.

**From production smoke testing (`EBC-R1.2-WS8-05-KEERTHI-Production-Smoke-Validation`, 03-Sep-2026):**
- A recurring low-severity console exception (`Error: Could not establish connection. Receiving end does not exist.`) appeared from first page load onward — assessed as a Chrome-extension-messaging artifact unrelated to application code, not confirmed with a clean browser profile.
- A cosmetic border artifact: during Journey Passport Chapter 2 (Companions), an unselected "Friends" card briefly retained a faint orange corner highlight after another card (Solo) was correctly selected — no incorrect selection state or data loss occurred. **This item is carried forward to the Release 1.3 backlog** as "Journey Passport Companion Card Visual Selection Consistency" (Section 12).

**From release-wide functional regression (`EBC-R1.2-WS8-QA-01`):**
- Mobile/responsive behaviour was not exercised in that QA pass (later substantially covered by production smoke testing on desktop Chrome only — a full cross-browser/device sweep remains a named residual item).
- A minor Workstream 5 wording difference was found during regression; it did not affect functional correctness.

**From release-wide traveller-experience validation (`EBC-R1.2-WS8-SRI-01`):**
- A recurring "100% Complete" badge friction point (also observed during Workstream 5's own traveller validation).
- A destination free-text echo risk, assessed as Moderate and worth addressing but not release-blocking.
- A Pace & Timing selection-loss risk, assessed as Minor.

**From release closure (`RELEASE-1.2.md` §18, `EBC-R1.2-WS8-04`):** two low-risk documentation citation issues (`RISK-R1.2-014`/`015`) remain open in `RELEASE-1.3-BACKLOG.md` and one other document — citation-only, no behavioural impact, tracked as a small governance follow-up.

---

# 12. Deferred Items (Carried to Release 1.3)

Confirmed present in `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` at Release 1.2's close (`RELEASE-1.2.md` §18.5):

- Destination regionalisation / region-level Destination Intelligence expansion (Section 4 of the backlog).
- Destination Intelligence Phase 3 (Runtime Alignment) and Phase 4 (Recommendation Behaviour).
- Journey Reflection free-text interpretation and unknown-destination messaging refinements.
- Passport Stamp Ceremony / Journey Passport Completion Experience evaluation.
- Traveller Stories quality gate improvements.
- Homepage custom background music investigation.
- Three Workstream 6 UX refinements: pending-chip experience for carried-forward destinations, auto-growing textarea, and near-limit character counter for "Describe your ideal getaway."
- Nine engineering technical-debt items (`TD-R1.3-001`–`009`), spanning destination-search indexing/testability hardening and OTP abuse-protection and observability improvements.
- **New for this release:** "Journey Passport Companion Card Visual Selection Consistency" (Section 11), added to `RELEASE-1.3-BACKLOG.md` §10 by this same card (`EBC-R1.2-WS8-05`) — see that document for the full entry.

---

# 13. Upgrade Notes

Release 1.2 introduces database and configuration changes that anyone standing up or updating an environment should be aware of:

- **Nine new Supabase migrations** must be applied in order (see Section 15 for the full list and dates) — they add OTP-challenge and lead-related schema, an E.164 backfill for existing leads, GeoNames-backed geo-places/geo-aliases tables, and two `search_geo_places` correctness/performance fixes.
- **New environment-variable names** were introduced for the MSG91 OTP/SMS provider integration; the fail-closed design means a deployment with these unset will not error, it will simply report OTP as `not-configured` rather than send codes — variable names may be inspected per this project's Data and Secret Safety guardrails, but their values are never recorded in this document.
- **No breaking change** to any existing public URL, navigation route, or Journey Director recommendation contract. The "Experiences" section was removed from navigation and the homepage but its code and routes remain in the repository, unused rather than deleted.
- **No customer data migration risk:** the E.164 phone-number backfill migration is additive and was validated as part of Workstream 5's engineering review chain before shipping.

---

# 14. Production Validation Record

This section consolidates Release 1.2's three independent, release-wide validation passes, per this card's Activity 2.

## 14.1 Deployment

Release 1.2 was merged to `main` and deployed to production on **03-Sep-2026** at 11:41:12 +0530, via merge commit `e1196db` ("Merge branch 'feature/ebc-r1.2-ws5-06-remove-otp-debug-logging'"). The `v1.2.0` git tag was created at the same timestamp.

## 14.2 Smoke Test (`EBC-R1.2-WS8-05-KEERTHI-Production-Smoke-Validation`)

Eleven test activities (`SMK-01`–`SMK-11`) executed end-to-end against `https://www.searchmyvacation.com` in Google Chrome (desktop), by Keerthi, using a real mobile number with a live, Product-Owner-relayed OTP. **All eleven Passed.** Two Low-severity, non-blocking observations were logged (Section 11). **Recommendation: Option A — Pass.**

## 14.3 Journey Director Validation

`SMK-05` specifically targeted the Product Owner's stated area of concern — the Journey Director transition immediately after OTP submission. Result: transitioned directly to `/journey-director` with the full "Your story is ready" hero rendered; no stall, no blank screen, no blocking console errors. `SMK-06`/`SMK-07`/`SMK-08` (Journey Reflection, Recommendations, Itinerary) each Passed with correctly personalised, on-brand output.

## 14.4 Production OTP Validation

`SMK-04`: OTP verification succeeded on the first attempt, with a correct "Sending your code…" loading state and a correctly displayed resend-cooldown timer. This is the same live send-to-verification cycle referenced in Section 9's DLT regulatory-chain note, now independently re-confirmed post-deployment.

## 14.5 Callback Validation

`SMK-09`: the Completion screen generated Journey Reference `SMV-8RNH3SLT`, the synopsis-sharing consent checkbox correctly enabled the WhatsApp/callback actions, and a callback preference (09-Oct-2026, 10:00 AM–1:00 PM window) saved correctly with a clear "Saving…" state and confirmation message.

## 14.6 WhatsApp Validation

`SMK-10`: "Continue on WhatsApp" opened a new tab at `api.whatsapp.com` with a valid business number and a pre-filled message correctly containing the Journey Reference, traveller name, selected journey and recommendation label.

## 14.7 Cross-Reference to Prior Release-Wide Validation

This production smoke test followed, and is consistent with, two earlier release wide passes: `EBC-R1.2-WS8-QA-01` (Keerthi, functional regression across Workstreams 1–6, zero functional defects, **Pass with Observations**) and `EBC-R1.2-WS8-SRI-01` (Sri, traveller-experience validation against a pre-production preview, 8/8 acceptance criteria met, **Pass with Observations**). All three independent validation passes reached the same conclusion: Release 1.2 is production-ready, with named, non-blocking observations carried forward rather than silently dropped.

---

# 15. Release Metrics

Recorded for future reference — per this card's own rationale, "this becomes useful six months later."

| Metric | Value |
|---|---|
| Workstreams executed | 8 (WS1–WS8) |
| Workstreams fully Complete | 5 (WS1, WS2, WS4, WS5, WS6) |
| Workstreams Complete for a defined partial scope | 1 (WS3 — Phase 0–2 native-ID chain; Phase 3–5 deferred to Release 1.3) |
| Workstreams Substantially Complete / Validated | 2 (WS7 — Documentation & Governance; WS8 — Release-wide QA & Regression, Pass with Observations) |
| Governance documents on record (Claude Project, all releases) | 128 |
| Governance documents tied to Release 1.2 by naming | 124 |
| Architecture Decision Records ratified | 2 (`ADR-R1.2-WS3-001`, `ADR-R1.2-WS5-001`) |
| Major features delivered | 5 (Section 2) |
| Supabase migrations introduced | 9 — `20260802130000_journey_passport_leads`, `20260803120000_journey_passport_callbacks`, `20260822090000_journey_passport_otp_challenges`, `20260822090500_journey_passport_leads_e164_backfill`, `20260823150000_geo_places_geo_aliases`, `20260826120000_fix_send_journey_passport_otp_ambiguous_resend_count`, `20260827150000_fix_verify_journey_passport_otp_ambiguous_verification_token`, `20260829130000_fix_search_geo_places_trgm_index_usage`, `20260830013000_search_geo_places_dynamic_planning_rewrite` |
| Technical-debt items logged to Release 1.3 | 9 (`TD-R1.3-001`–`009`) |
| Completed tracker tasks at closure | 64 of 128 (`RELEASE-1.2.md` §3, per `EBC-R1.2-WS8-04`) |
| Production deployment date | 03-Sep-2026 |
| Git tag | `v1.2.0` |
| Severity 1 / Severity 2 defects found across all Release 1.2 validation | 0 |

---

# 16. Attribution

*Prepared by Tiger (Programme and Delivery Lead) per `EBC-R1.2-WS8-05`. Documentation only — no code, configuration or database changed. Consolidates evidence from `RELEASE-1.2.md` §18 (`EBC-R1.2-WS8-04`), `EBC-R1.2-WS8-QA-01` (Keerthi), `EBC-R1.2-WS8-SRI-01` (Sri) and `EBC-R1.2-WS8-05-KEERTHI-Production-Smoke-Validation` (Keerthi) — see the Governance Note above regarding this last document's shared EBC ID. No new investigation, audit or validation was performed to produce this document; all figures and findings are drawn from the evidence sources named throughout.*
