# Release 1.3 — Core Conversion, Trust, Search & OTP Hardening

**Release Theme:** Eliminate live conversion leaks, enforce OTP security/cost guardrails, fix search ranking, and introduce pre-OTP trust transparency.  
**Total Backlog Items:** 17  
**Status:** Approved (Baseline)

---

## 1. Release Summary & Priority Breakdown

- **Priority Mix:** High: 11 | Medium: 6 | Low: 0
- **Source Mix:** Existing Backlog: 16 | New PO / Website Gap Additions: 1

---

## 2. Release Backlog Matrix

| ID | Area / Phase | Requirement Title | Disposition | Priority | PO Approval Status | PO Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P-02** | Content quality | Traveller Stories quality gate | Keep | High | Approved (Baseline) | Existing Backlog |
| **P-03** | Traveller journey | Journey Director completion & WhatsApp CTA (merged with V-10) | Keep | High | Approved (Baseline) | Existing Backlog (Merged P-03 + V-10) |
| **P-01** | Measurement | Google Ads conversion tag on Passport completion | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **GAP-02** | Passport UX / Trust | Pre-OTP expectation setting & designer response SLA copy | New (PO) | High | Approved (Baseline) | New PO / Gap Addition |
| **HP-01** | Homepage | Tablet header CTA breakpoint (1024px) | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **HP-02** | Homepage | Trust Points visual treatment (replace raw Unicode glyphs) | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **HP-03** | Homepage | Contact Preview CTA routing | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **S-01** | Search | Destination ranking for ambiguous names (e.g., Bengaluru, Chennai) | Keep | Medium | Approved (Baseline) | Existing Backlog |
| **S-02** | Search | Country-level search behavior (e.g., India) | Keep | High | Approved (Baseline) | Existing Backlog |
| **P-07** | Journey Passport | Legacy Passport reference cleanup | Keep | Medium | Approved (Baseline) | Existing Backlog |
| **N-03** | Content operations | Amritsar / Darjeeling / Corbett content completion | Keep | Medium | Approved (Baseline) | Existing Backlog (Moved from R1.8) |
| **TD-07** | Security / OTP cost | Persistent OTP rate limiting and resend caps | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **TD-09** | Security / OTP | OTP endpoint validation and abuse protection | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **TD-08** | Operations / observability | Production diagnostics for Journey Director & OTP/lead routes | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.7) |
| **UX-01** | Traveller recovery | Recover after OTP success but lead creation failure | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **UX-02** | Traveller recovery | Journey Director failure/reload messaging | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |
| **UX-03** | Traveller recovery | Recovery when initial OTP response is lost | Keep | High | Approved (Baseline) | Existing Backlog (Moved from R1.6) |

---

## 3. Detailed Requirement Specifications

### P-02 — Traveller Stories quality gate
- **Area / Phase:** Content quality | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Show stories only when meaningful traveller content exists; skip incomplete records and never render empty testimonial cards.
- **Dependencies & Guardrails:** Define 'meaningful content' validation rules and graceful UI omission.
- **Acceptance Criteria:** Verified traveller stories render cleanly; zero empty/broken testimonial cards in production.
- **PO Notes:** Existing Backlog

### P-03 — Journey Director completion & WhatsApp CTA (merged with V-10)
- **Area / Phase:** Traveller journey | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Connect Journey Passport completion to the Journey Director state and a clean WhatsApp click-to-chat handoff pre-filled with Synopsis reference ID.
- **Dependencies & Guardrails:** Finalise click-to-chat deep link format, consent copy, and completion event trigger before build.
- **Acceptance Criteria:** Travellers completing Passport can launch WhatsApp handoff with valid reference context in one tap.
- **PO Notes:** Existing Backlog (Merged P-03 + V-10)

### P-01 — Google Ads conversion tag on Passport completion
- **Area / Phase:** Measurement | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Record a Google Ads conversion on verified Journey Passport completion before external WhatsApp handoff.
- **Dependencies & Guardrails:** Requires P-03 completion event definition, duplicate-firing prevention, and non-paid OTP test mode.
- **Acceptance Criteria:** Google Ads registers accurate, deduplicated conversions without triggering live paid SMS during QA.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### GAP-02 — Pre-OTP expectation setting & designer response SLA copy
- **Area / Phase:** Passport UX / Trust | **Disposition:** `New (PO)` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Add clear micro-copy and trust reassurance before the OTP gate explaining why mobile verification unlocks the Synopsis and when a Journey Designer will respond.
- **Dependencies & Guardrails:** Align response-time SLA copy with operations team.
- **Acceptance Criteria:** Clear pre-OTP value framing and response-time expectation displayed on OTP step; measurable lift in OTP completion.
- **PO Notes:** New PO / Gap Addition

### HP-01 — Tablet header CTA breakpoint (1024px)
- **Area / Phase:** Homepage | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Keep the primary Journey Passport CTA visible from tablet widths (1024px) rather than hiding behind mobile drawer until 1280px.
- **Dependencies & Guardrails:** Verify tablet layout spacing across 1024px–1279px viewports.
- **Acceptance Criteria:** Primary CTA remains one-tap accessible on tablet landscape/portrait screens.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### HP-02 — Trust Points visual treatment (replace raw Unicode glyphs)
- **Area / Phase:** Homepage | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Replace raw Unicode glyphs in Homepage Trust Points with bespoke brand icons or approved photography.
- **Dependencies & Guardrails:** Design sign-off on icon set matching brand typography/palette.
- **Acceptance Criteria:** Trust Points render with cohesive brand iconography across desktop and mobile.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### HP-03 — Contact Preview CTA routing
- **Area / Phase:** Homepage | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Clarify Contact Preview section routing so visitors wanting direct human contact (WhatsApp/phone/email) have an unambiguous path alongside self-serve Passport.
- **Dependencies & Guardrails:** Ensure primary vs. secondary CTA hierarchy avoids competing actions.
- **Acceptance Criteria:** Users can choose between self-serve Passport and direct advisor contact without confusion.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### S-01 — Destination ranking for ambiguous names (e.g., Bengaluru, Chennai)
- **Area / Phase:** Search | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Fix search ranking for ambiguous queries (e.g., Bengaluru, Chennai) while preserving global search behavior.
- **Dependencies & Guardrails:** Document expected ranking rules and test fixtures.
- **Acceptance Criteria:** Top search results for ambiguous city/hub names surface relevant served circuits/destinations first.
- **PO Notes:** Existing Backlog

### S-02 — Country-level search behavior (e.g., India)
- **Area / Phase:** Search | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Ensure country-level queries (e.g., 'India') prioritize the country/overview entity ahead of incidental text matches.
- **Dependencies & Guardrails:** Audit country entity metadata vs. full-text body weighting.
- **Acceptance Criteria:** Searching 'India' or served country names returns the country entity at position #1.
- **PO Notes:** Existing Backlog

### P-07 — Legacy Passport reference cleanup
- **Area / Phase:** Journey Passport | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Clean up legacy Passport-reference format identified during technical discovery while maintaining backwards compatibility.
- **Dependencies & Guardrails:** Confirm stored reference formats in database.
- **Acceptance Criteria:** All newly generated Passport references conform to canonical format; legacy records resolve cleanly.
- **PO Notes:** Existing Backlog

### N-03 — Amritsar / Darjeeling / Corbett content completion
- **Area / Phase:** Content operations | **Disposition:** `Keep` | **Priority:** `Medium` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Complete deferred editorial authoring/review for Amritsar, Darjeeling, and Corbett in the served destination catalogue.
- **Dependencies & Guardrails:** Editorial content sign-off.
- **Acceptance Criteria:** All three destinations meet minimum content completeness standards.
- **PO Notes:** Existing Backlog (Moved from R1.8)

### TD-07 — Persistent OTP rate limiting and resend caps
- **Area / Phase:** Security / OTP cost | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Implement database-backed, mobile-keyed, distributed-safe OTP limits and resend caps across pending, exhausted, and expired states.
- **Dependencies & Guardrails:** Define cooldown thresholds and cost-free test fixtures.
- **Acceptance Criteria:** Abusive OTP retries are blocked server-side across serverless instances; SMS spend is protected.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### TD-09 — OTP endpoint validation and abuse protection
- **Area / Phase:** Security / OTP | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Enforce strict server-side phone-format validation and anti-abuse controls on direct API calls bypassing the UI.
- **Dependencies & Guardrails:** Coordinate validation schema with TD-07.
- **Acceptance Criteria:** Direct malformed or automated requests to OTP endpoints are rejected with 4xx errors.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### TD-08 — Production diagnostics for Journey Director & OTP/lead routes
- **Area / Phase:** Operations / observability | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Preserve actionable error causes and structured production logging for OTP, lead creation, and Journey Director routes while minimising PII.
- **Dependencies & Guardrails:** Define PII-redacted error taxonomy.
- **Acceptance Criteria:** Support can diagnose OTP/lead failures from logs without exposing raw phone numbers or personal data.
- **PO Notes:** Existing Backlog (Moved from R1.7)

### UX-01 — Recover after OTP success but lead creation failure
- **Area / Phase:** Traveller recovery | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Guide travellers cleanly if OTP succeeds but lead persistence fails, avoiding broken replay of a consumed OTP token.
- **Dependencies & Guardrails:** Define idempotent retry/recovery token or fallback handoff.
- **Acceptance Criteria:** Zero dead-end screens when lead creation fails post-OTP; no duplicate paid SMS triggered.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### UX-02 — Journey Director failure/reload messaging
- **Area / Phase:** Traveller recovery | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Maintain accurate recovery guidance and minimum safe state if recommendation setup fails or the user reloads mid-flow.
- **Dependencies & Guardrails:** Define session state persistence boundaries.
- **Acceptance Criteria:** Page reload during recommendation setup preserves safe progress and never falsely claims completion.
- **PO Notes:** Existing Backlog (Moved from R1.6)

### UX-03 — Recovery when initial OTP response is lost
- **Area / Phase:** Traveller recovery | **Disposition:** `Keep` | **Priority:** `High` | **PO Approval Status:** `Approved (Baseline)`
- **Scope & Functional Intent:** Provide clear recovery UI if an OTP SMS was dispatched but the client lost the challenge ID response.
- **Dependencies & Guardrails:** Respect TD-07 cooldown rules.
- **Acceptance Criteria:** Travellers experiencing network drops during OTP send can recover without burning extra SMS credits.
- **PO Notes:** Existing Backlog (Moved from R1.6)
