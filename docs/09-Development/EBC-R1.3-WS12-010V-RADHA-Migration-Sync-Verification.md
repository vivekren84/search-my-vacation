# EBC-R1.3-WS12-010V — RADHA — Migration Sync Verification

**Persona:** Radha (Rad), Senior Software Engineer / Engineering Lead
**Workstream:** WS12 — Journey Planning
**Parent EBCs:** `EBC-R1.3-WS12-010` (defect resolution), `EBC-R1.3-WS12-010R` (Keerthi's post-fix regression — FAIL, NEW-D6/NEW-D7 raised)
**Purpose:** Confirm the two pending WS12-010 migrations were applied to the development database and re-verify NEW-D6 and NEW-D7 at runtime, per the Product Owner's direct instruction. No code changes authorised or made.
**Environment:** Local Next.js dev server on `localhost:3000`, pre-signed-in Workspace Administrator session (vivek), live browser verification via Claude in Chrome.
**Date:** 22 September 2026

---

## 1. Background

Keerthi's `EBC-R1.3-WS12-010R` regression pass found two new, release-blocking defects (NEW-D6: record creation 500; NEW-D7: task status-update 500) and diagnosed — without direct database access — that both were consistent with the two WS12-010 migrations (`20260922080000_workspace_journey_planning_origin_channel.sql`, `20260922080100_workspace_audit_log_task_events.sql`) never having been applied to the development Supabase database, even though they existed in the repository.

The Product Owner independently confirmed this via `supabase migration list` (both migrations `Local ✓ Remote ✗`) and asked Rad to: (1) apply the two migrations, (2) re-run the affected workflows. The Product Owner applied the migrations directly; this EBC covers Rad's re-verification once that was done.

## 2. Attempted CLI Confirmation

`npx supabase migration list --linked` was attempted from this environment to independently confirm remote migration status, but failed with `Access token not provided` — no Supabase CLI session or access token is available in this environment, and per this project's Data and Secret Safety rules, credentials are never entered on the Product Owner's behalf. This is the same constraint disclosed when the migrations were first found pending. Verification therefore proceeded by exercising the actual application behaviour at runtime instead, which is a stronger check than a migration-list read in any case — it confirms the fix works, not just that a migration ran.

## 3. Runtime Verification

Performed live against the local dev server (`localhost:3000`), signed in as the same Administrator session Keerthi used, via Claude in Chrome browser automation. **No repository files were changed during this verification.**

### NEW-D6 — record creation

| Test | Result |
|---|---|
| Create Individual record, Origin Channel = WhatsApp | `POST /api/workspace/journey-planning` → **201**. Record created, detail page loaded, header correctly displays "Individual · WhatsApp" (no "undefined"). |
| Create Corporate record, Origin Channel = Corporate enquiry | Origin Channel dropdown correctly offered "Corporate enquiry" for the Corporate record kind (D3's kind-filtering). `POST /api/workspace/journey-planning` → **201**. Header correctly displays "Corporate · Corporate enquiry". |

**NEW-D6: Resolved.** Both record kinds create successfully with a valid Origin Channel; the previously-reported "undefined" display defect is also gone now that the column is actually populated.

### NEW-D7 — task status update

Using the freshly-created Corporate record:

| Test | Result |
|---|---|
| Create task ("WS12-010R verification task") | `POST .../tasks` → **201**. "Task added" toast shown. `Task created` event appeared in History immediately. |
| Mark Complete | `POST .../tasks/{taskId}/status` → **200** (previously 500). Task list updated in place to "completed" (strikethrough), no error toast. A `Task updated` event appeared in History. |
| Reopen | `POST .../tasks/{taskId}/status` → **200**. Task list updated to "open", no error toast. A second `Task updated` event appeared in History. |

**NEW-D7: Resolved.** Both status transitions now return a clean 200, and both are correctly logged to History — the previous silent audit-log failure (constraint violation on `task_created`/`task_updated`) no longer occurs.

## 4. Root Cause — Confirmed

Both defects were exactly what Keerthi diagnosed: the two WS12-010 migrations had not been applied to the development database, even though the application code (correctly) already assumed the resulting schema. No application code defect existed. This is now fully confirmed by the runtime evidence above, not just by inference.

## 5. Outcome

Per the Product Owner's own instruction, **no further engineering work is required** — both scenarios pass. No functional changes were introduced during this activity, consistent with the instruction.

## 6. Recommendation

Ready for Keerthi to perform the narrow regression she recommended in `EBC-R1.3-WS12-010R` (NEW-D6, NEW-D7, the origin-channel "undefined" display, and a fresh Ownership Claim test using one of the two records created during this verification) to formally close out the WS12-010 QA cycle ahead of Product Owner Acceptance (WS12-011). The two test records created during this verification (`WS12-010R Verify — Individual — WhatsApp`, `WS12-010R Verify — Corporate — Corporate enquiry`) are left in place in the Lead Created stage and can be reused or ignored for that pass.

---

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01L6KYAiNwVu86RMW3fEXWsh
