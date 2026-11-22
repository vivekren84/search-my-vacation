# Search My Vacation (SMV) — Release 1.5 Milestone 2 Completion Report

**Release Theme:** High-Touch Travel Staff Portal & Advisor Workspace  
**Milestone 2:** Client CRM, Structured Preference Tagging, Chronological Activity Feed & Lead Briefing  
**Target Branch:** `feature/r1.5-milestone-2-client-crm-lead-briefing` (based on `release/r1.5`)  
**Status:** Completed & Pre-Prod Stage 1 Verified (100% Green)  
**Governance Reference:** `docs/10-Backlog/SMV_Release_Lifecycle_and_Execution_SOP.md`  
**Execution Authority:** Vivek Renganathan (Product Owner) & Tiger (CTO)  

---

## 1. Executive Summary

Milestone 2 establishes the core Client Relationship Management (CRM), structured preference taxonomy, chronological timeline feed, and journey designer handoff briefing capabilities for the Search My Vacation Staff Portal. All work preserves `BOUND-01` (isolating internal staff workspace tables under `workspace_*` while keeping customer-facing `/journey-passport` and public routes completely decoupled and frictionless).

Automated regression coverage across the platform expanded from **1,005 checks to 1,061 automated checks**, with **56 dedicated checks** in the new `verify:r1.5-milestone-2` suite passing 100% green. Zero external API or SMS/telecom costs ($0.00) were incurred via `TD-02` zero-cost in-memory test doubles.

---

## 2. Deliverables & Acceptance Criteria Fulfillment

| Requirement ID | Requirement Title | Persona | Acceptance Status | Verification Summary |
| :--- | :--- | :--- | :---: | :--- |
| **`US-004`** | Decoupled Master Client Profiles | Desk User | **PASSED** | Client records can be created independently without requiring an active journey ID. Stores full name, E.164 normalized mobile (`TD-03`), email, nationality, DOB, and VIP status. Real-time duplicate detection alerts advisors on matching phone or email. Supports linking household companions (spouse, children ages/DOBs, co-travellers). |
| **`US-005`** | Structured Client Preference Tags & Lead Attribution | Desk User | **PASSED** | Fast multi-select taxonomy cloud across Dietary (`Pure Veg / Jain`, `Halal`, `Gluten-Free`), Pace (`Relaxed`, `High-Energy`), Accommodation (`Heritage Palaces`, `Boutique Villas`, `Private Sanctuaries`), and Comfort. Idempotent tag additions and tag-based directory search. Mandatory `leadSource` attribution strictly enforced on inquiry intake (`founder_network`, `client_referral`, `instagram`, `website`, `concierge_partner`, `other`). |
| **`US-006`** | Chronological Client & Trip Activity Feed | All Staff | **PASSED** | Unified timeline feed combining manual advisor interaction notes (`call`, `whatsapp`, `meeting`, `note`) with author attribution and automated `system` events. Supports file attachment metadata (PDF itineraries, preference briefs, visa copies). Strictly sorted reverse-chronologically (newest first). |
| **`GAP-04`** | Structured Journey Designer Handoff Briefing View | All Staff | **PASSED** | Transforms raw public Journey Passport submissions into an enriched briefing view for the journey designer. Extracts guest identity, normalized E.164 mobile, mood archetype badge, weighted pilot regions (primary 50%), comfort signals, and unvarnished narrative intent themes without loss. |

---

## 3. Database Architecture & Pre-Prod Migrations

The database migration was verified and applied to Pre-Prod database `SMV-preprod` (`pkfdunyeaqdvvklutgon`):

1. **Migration Script:** `supabase/migrations/20261123000000_client_crm_m2.sql`
   * `public.workspace_travellers`:
     * Added columns: `phone_e164 text`, `nationality text`, `dob date`, `lead_source text`, `is_vip boolean default false`, `metadata jsonb default '{}'::jsonb`.
     * Added check constraint `workspace_travellers_lead_source_check` (`founder_network`, `client_referral`, `instagram`, `website`, `concierge_partner`, `other`).
     * Added indexes: `idx_workspace_travellers_phone_e164`, `idx_workspace_travellers_email`, `idx_workspace_travellers_lead_source`.
   * `public.workspace_client_companions`:
     * Created table with `id`, `client_id`, `full_name`, `relationship`, `dob`, `notes`, `created_at`.
     * RLS enabled; internal workspace access granted to authenticated staff and `service_role`.
   * `public.workspace_client_tags`:
     * Created table with `id`, `client_id`, `category` (`dietary`, `pace`, `accommodation`, `comfort`, `general`), `tag_value`, `created_at`.
     * Unique constraint `uq_client_tag` on `(client_id, category, tag_value)` ensuring idempotency.
   * `public.workspace_client_activities`:
     * Created table with `id`, `client_id`, `journey_id`, `author_id`, `activity_type` (`system`, `call`, `whatsapp`, `meeting`, `note`), `body`, `attachments` (jsonb), `created_at`.
     * Chronological index on `(client_id, created_at desc)`.
2. **Rollback Script:** `supabase/migrations/20261123000000_client_crm_m2.rollback.sql`
   * Drops `workspace_client_activities`, `workspace_client_tags`, `workspace_client_companions`, and reverts `workspace_travellers` modifications cleanly.

---

## 4. Test Harness & Regression Suite Results

```
> web@0.1.0 verify:r1.5-milestone-2
> tsc -p tsconfig.r15-m2-verification.json && node node_modules/.cache/smv-r15-m2-verification/lib/staff-portal/validation/verifyRelease15Milestone2.js

================================================================================
=== STARTING SMV RELEASE 1.5 MILESTONE 2 VERIFICATION SUITE ===
================================================================================

--> Verifying US-004: Decoupled Master Client Profile Creation & Companions...
--> Verifying US-004: Real-Time Duplicate Detection...
--> Verifying US-005: Structured Client Preference Tagging...
--> Verifying US-005: Mandatory Lead Source Attribution Enforcement...
--> Verifying US-006: Chronological Activity Feed...
--> Verifying GAP-04: Structured Journey Designer Lead Briefing...
--> Verifying BOUND-01, TD-02 & Brand Tone Invariants...

================================================================================
=== SMV RELEASE 1.5 MILESTONE 2 VERIFICATION COMPLETE: ALL 56 CHECKS PASSED ===
================================================================================
```

### Full Platform Test Summary (10 Suites — 1,061 Checks Passing)
* **Release 1.3:** M1 (80), M2 (38), M3 (64), M4 (41) = **223 checks**
* **Release 1.4:** M1 (76), M2 (293), M3 (305), M4 (77) = **751 checks**
* **Release 1.5:** M1 (31), M2 (56) = **87 checks**
* **Total Automated Regression Baseline:** **1,061 / 1,061 checks passing (100% green)**
* **TypeScript Compiler (`tsc -p tsconfig.json --noEmit`):** **0 errors**

---

## 5. Governance & Architecture Invariants Maintained

1. **`BOUND-01` Lead Gate Guardrail:** Internal CRM entities and advisor briefing logic reside strictly in `workspace_*` structures and `/portal/*`. The public visitor experience on `/journey-passport` and `/journey-director` remains 100% decoupled, passwordless, and unchanged.
2. **`TD-02` Zero-Cost Test Doubles:** All duplicate detection, profile creation, tagging, timeline feeds, and briefing transformations execute in-memory with $0.00 external provider cost.
3. **Brand Tone Invariant:** Explicit keyword check verified: the word "luxury" does not appear anywhere in client profiles, preference tags, activity feeds, or designer briefings.
4. **Option B Rollback Invariant:** Zero breaking changes to existing production schemas; pre-prod migration verified with an instant rollback script.
