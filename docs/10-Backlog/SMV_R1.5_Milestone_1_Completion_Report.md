# Search My Vacation (SMV) — Release 1.5 Milestone 1 Completion Report

**Release Theme:** Luxury Travel Staff Portal & Advisor Workspace  
**Milestone 1:** Authentication, Smart Single-Channel OTP & RBAC Foundation  
**Target Branch:** `feature/r1.5-milestone-1-auth-rbac-foundation` (based on `release/r1.5`)  
**Status:** Completed & Pre-Prod Stage 1 Verified (100% Green)  
**Governance Reference:** `docs/10-Backlog/SMV_Release_Lifecycle_and_Execution_SOP.md`  
**Execution Authority:** Vivek Renganathan (Product Owner) & Tiger (CTO)  

---

## 1. Executive Summary

Milestone 1 establishes the complete identity, single-channel OTP authentication, role-based access control (RBAC), and governance audit infrastructure for the Search My Vacation Staff Portal. All work preserves `BOUND-01` (isolating internal staff routes under `/portal/*` while maintaining zero customer friction and no password gates on `/journey-passport`).

Automated regression coverage across the entire platform expanded from **974 checks to 1,005 automated checks**, with **31 dedicated checks** in the new `verify:r1.5-milestone-1` suite passing 100% green. Zero live SMS costs ($0.00) were incurred across all test executions via `TD-02` test doubles.

---

## 2. Deliverables & Acceptance Criteria Fulfillment

| Requirement ID | Requirement Title | Persona | Acceptance Status | Verification Summary |
| :--- | :--- | :--- | :---: | :--- |
| **`US-001`** | Staff Account Provisioning & Role Assignment | Administrator | **PASSED** | Admin can invite/provision users with company email, mandatory registered mobile (E.164), and role (`administrator`, `privilege_user`, `desk_user`). Non-admin provisioning attempts are rejected (403). Instant deactivation terminates active sessions immediately. |
| **`US-002`** | Login with Single-Channel OTP Preference | All Staff | **PASSED** | Two-step authentication: credential validation followed by single-channel radio selection (`Email` OR `Mobile`). Single-channel mutual exclusivity verified (dispatching one strictly prevents dispatching to the other). 60s cooldown, 10m validity, and 14-day trusted device cookie enforced. |
| **`US-003`** | Step-Up Single-Channel OTP for Sensitive PII | Privileged / Admin | **PASSED** | Desk Users cannot unmask PII. Privileged Users and Admins can trigger Step-Up OTP via their preferred channel. Valid OTP unlocks a 5-minute temporary viewing window before auto-masking again. |
| **`US-017`** | Immutable Security & Governance Audit Log | Administrator | **PASSED** | Append-only database audit log capturing login dispatches, login outcomes, user provisioning, deactivations, and PII unmask events. Immutability enforced: attempted `UPDATE` or `DELETE` queries throw errors at the database and application levels. |

---

## 3. Database Architecture & Pre-Prod Migrations

The following migrations were created, verified, and applied to Pre-Prod database `SMV-preprod` (`pkfdunyeaqdvvklutgon`):

1. **Migration Script:** `supabase/migrations/20261122000000_staff_auth_rbac_m1.sql`
   * `public.workspace_users`:
     * Added columns: `registered_mobile text`, `last_login_at timestamptz`, `last_otp_channel text`.
     * Updated `workspace_users_role_check` constraint to support `'desk_user'` alongside `'administrator'` and `'privilege_user'`.
   * `public.staff_otp_challenges`:
     * Created dedicated table with `id`, `user_id`, `channel` (`email` | `sms`), `code_hash`, `expires_at`, `attempts`, `cooldown_until`, `verified_at`, `purpose`.
     * Applied RLS: Revoked public/anon/authenticated access; granted exclusively to `service_role`.
   * `public.workspace_audit_log`:
     * Updated `workspace_audit_log_event_type_check` to include staff security events (`staff_login_otp_dispatched`, `staff_login_succeeded`, `staff_login_failed`, `staff_session_invalidated`, `pii_unmask_requested`, `pii_unmask_succeeded`, `user_provisioned`, `user_deactivated`, `role_changed`).
     * Revoked `UPDATE` and `DELETE` permissions to enforce immutable append-only compliance.
2. **Rollback Script:** `supabase/migrations/20261122000000_staff_auth_rbac_m1.rollback.sql`
   * Cleanly reverts all table modifications, constraints, and drops `staff_otp_challenges`.

---

## 4. Test Harness & Regression Suite Results

```
> web@0.1.0 verify:r1.5-milestone-1
> tsc -p tsconfig.r15-m1-verification.json && node node_modules/.cache/smv-r15-m1-verification/lib/staff-portal/validation/verifyRelease15Milestone1.js

================================================================================
=== STARTING SMV RELEASE 1.5 MILESTONE 1 VERIFICATION SUITE ===
================================================================================

--> Verifying US-001: Staff Account Provisioning & Role Assignment...
--> Verifying US-001: Instant Deactivation & Session Invalidation Kill-Switch...
--> Verifying US-002: Single-Channel Smart OTP Dispatch & Mutual Exclusivity...
--> Verifying US-002: 60-Second Cooldown & Channel-Switch Lock...
--> Verifying US-002: 10-Minute Validity & Code Verification...
--> Verifying US-003: Step-Up Single-Channel OTP & 5-Minute Auto-Mask Window...
--> Verifying US-017: Immutable Security & Governance Audit Log...
--> Verifying BOUND-01 & TD-02: Zero-Cost Test Doubles & Public Conversion Isolation...

================================================================================
ALL RELEASE 1.5 MILESTONE 1 VERIFICATION CHECKS PASSED (31 checks).
================================================================================
```

### Full Platform Test Summary (9 Suites — 1005 Checks Passing)
* **Release 1.3:** M1 (80), M2 (38), M3 (64), M4 (41) = **223 checks**
* **Release 1.4:** M1 (76), M2 (293), M3 (305), M4 (77) = **751 checks**
* **Release 1.5:** M1 (31) = **31 checks**
* **Total Automated Regression Baseline:** **1,005 / 1,005 checks passing (100% green)**
* **TypeScript Compiler (`tsc -p tsconfig.json --noEmit`):** **0 errors**

---

## 5. Invariants Maintained

1. **`BOUND-01` Lead Gate Guardrail:** Public visitor conversion flow on `/journey-passport` and `/journey-director` remains 100% decoupled, passwordless, and unaffected.
2. **`TD-02` Zero-Cost Test Doubles:** $0.00 live SMS/email charges across all automated test runs.
3. **No Explicit "Luxury" Keyword Leakage:** All internal portal copy, mockups, and components communicate elegance and high-touch curation through bespoke design tokens and typography without using the word "luxury".
4. **Option B Rollback Invariant:** Zero breaking changes to existing production schemas; pre-prod migration verified with an instant rollback script.
