# EBC-R1.3-WS13-029 — WP-1.9 Engineering Completion and Validation Report

| Field | Value |
|---|---|
| Card | EBC-R1.3-WS13-028 — Phase 1 WP-1.9 Carry-Forward Implementation Authorisation (Tiger) |
| Execution authorisation | Product Owner handoff "EBC-R1.3-WS13-028 — WP-1.9 Engineering Execution Authorization", 9 October 2026; DEC-R1.3-033 |
| Persona | Rad — Engineering & Implementation Specialist |
| Release / Workstream | Release 1.3 / WS13 Journey Workspace — Phase 1 (Journey Core) |
| Submitted for | Tiger (delivery evidence and scope review) and Vivek (local-commit decision). This report does not accept WP-1.9 or pass Checkpoint 4. |
| Working state | Mac repository, branch `ws13-milestone-b`, HEAD `1b1fd4d`. **All WP-1.9 changes are uncommitted.** |
| Date | Original: 9 October 2026. **Revision 1:** prepared 16 October 2026 under EBC-R1.3-WS13-032; **issued 16 October 2026** after Tiger's final review. Revision history at the end. |
| Revision status | **ISSUED — Rev 1, 16 October 2026.** Tiger's final review is complete (EBC-R1.3-WS13-031 §12 pre-commit verification record, 16-Oct-2026, item D-1). The content is draft b.1 (sha256 `eef26583…5427`) unchanged, except for this issue metadata and the revision history.<br>**Supersedes** the original report (Rev 0, 9 October 2026, sha256 `d8de2c72…5fa5`), which is kept unchanged as a historical record named `EBC-R1.3-WS13-029-RAD-WP-1.9-Engineering-Completion-and-Validation-Report-Rev0-original.md`, in Project Knowledge and in `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9-review/`.<br>Issuing this report does not authorise the local commit; that still needs Tiger's verification (EBC-031 §12) and the Product Owner's explicit authorisation. |
| Status | **WP-1.9 engineering implementation and validation: complete.** Accepted at engineering level by the Product Owner (DEC-R1.3-034, WP-D1, recorded in EBC-R1.3-WS13-031 §11). Q-1 and Q-2 retained as built (WP-D3). The single local commit remains conditional on Tiger's verification (EBC-031 §12) and the Product Owner's final authorisation; it is **not** authorised by this report. |

Rad's technical completion does not equal Keerthi's functional approval, Sri's experience approval or Product Owner acceptance.

**Governance confirmations (full list in §5).** M11 and every other migration are unchanged. No shared database was accessed. Nothing was pushed or deployed. Nothing was committed. OBS-B1 to OBS-B9 were not implemented. No Product, UX or Architecture baseline was changed. No credentials were typed or read.

---

## 1. Execution Summary

| Item | Value |
|---|---|
| Starting branch | `ws13-milestone-b` |
| Baseline (verified before any change) | HEAD `1b1fd4d` (governance commit) on `7291f46` (Milestone B and EBC-026 Rev 1). The working tree was clean. `git log --oneline -6`: `1b1fd4d`, `7291f46`, `1f73a4b`, `1034056`, `4171107`, `3101590`. |
| Scope completed | The eight items in EBC-028 §3: TL-01, TL-02, TL-05, C-11, C-12, WS13-P1-I, TD-WS13-005 and TD-WS13-003. TD-WS13-004 was verified only. |
| Final branch / commit | `ws13-milestone-b` / `1b1fd4d`, unchanged. The work is uncommitted, waiting for review. |
| Where the work was done | **Mac repository (authoritative).** Every source edit was made directly on the Mac. tsc and eslint were run on the Mac. |
| Use of the cloud workspace | Only for checks that cannot run on the Mac: the production build, the `verify:*` scripts, the API suite and the Playwright suites, all against a local throwaway database. The cloud copy was first proven identical to Mac HEAD: the git blob digests of all 798 tracked files under `web/` and `supabase/` match (combined digest `b74296c9…59e1` on both sides). The nine changed files were then copied **from** the Mac, and their sha256 values match the Mac files (§4). The implementation exists on the Mac (the authoritative copy), and this report is saved on the Mac. |
| **Correction (Rev 1)** | The original version of the row above ended: "No implementation or evidence exists only in the cloud." That was **inaccurate for the test evidence**: when the report was submitted, the suites, fixture, logs and screenshots existed only in the cloud workspace (EBC-031 finding R-2). The implementation statement was correct. |
| Where the test evidence is kept (Rev 1) | On the Mac, **outside the Git repository**: `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9`. Transferred 9-Oct-2026 and integrity-checked; a mobile-navigation log was added on 16-Oct-2026. Details in §8. |

---

## 2. Requirement-by-Requirement Results

Test IDs refer to the local Playwright suites in §3: `wp19` (targeted, 76 checks), `reg` (WS11/WS12 regression, 37 checks in one run on 9-Oct-2026) and `mobnav` (WS11 mobile navigation, 3 checks, separate run on 16-Oct-2026). *Rev 1: the original wording here was "37 + 3 checks", which merged the two runs.*

### 2.1 Item 1 — TL-01: Journey Owner in the Confirm dialog

| | |
|---|---|
| Requirement | EBC-028 §3 item 1; `020` §11 (M01 user directory); 020B C-13. AC-1.1, AC-1.2, AC-1.3. |
| Implementation | The Journey Planning record view loads the existing Workspace User directory (`GET /api/workspace/users/directory`, which reads `workspace_user_directory()`). It reuses the Milestone B `useDirectory()` hook rather than adding a second loader. The dialog's Journey Owner row now shows:<br>• the owner's `displayName`, for the current user too (previously "You");<br>• "Unassigned" when there is no owner (unchanged);<br>• while the directory loads, "…", and if the owner is missing or the directory fails, "Unknown user". These are the same labels the Journey page already uses, so no new copy was introduced.<br>A deactivated owner keeps the name, with the C-13 owner-card marker "Account deactivated" in muted text beneath it. To render the marker, `ConfirmJourneyDialog` gained one optional prop, `ownerDeactivated`. |
| Files | `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx`, `web/components/workspace/journey-planning/ConfirmJourneyDialog.tsx` |
| Validation | `wp19` 1.1-self ("QA Owner", not "You"), 1.1-another user ("QA Other"), 1.1-deactivated owner, 1.3 ("QA Deactivated" + "Account deactivated"), 1.1-unassigned, and 1.2-* (no UUID anywhere in the dialog in any case, including a forced directory failure, 1.2-fallback). |
| Result | **PASS** (AC-1.1, AC-1.2, AC-1.3). Evidence: screenshots `wp19-confirm-dialog-owner.png` and `wp19-confirm-dialog-deactivated.png`. |

### 2.2 Item 2 — TL-02: Replacement banner reference

| | |
|---|---|
| Requirement | EBC-028 §3 item 2; 020B S-3: "Replacement planning for JRN-···· · The original Journey is on hold until this is confirmed. [Open JRN-····]"; Rev 4a §36.3. AC-2.1, AC-2.2. |
| Implementation | The existing sentence is kept character for character, followed by the S-3 action link "Open JRN-····". The link goes to `/workspace/journey-workspace/[journeyId]` of the original (On Hold) Journey. The banner's `role="status"` and styling are unchanged. |
| Files | `JourneyPlanningRecordDetailView.tsx` |
| Validation | • `wp19` 2.2: the rendered text equals the S-3 string exactly ("Replacement planning for JRN-1007 · The original Journey is on hold until this is confirmed. Open JRN-1007").<br>• `wp19` 2.1a: the link's `href` is `/workspace/journey-workspace/<J_HOLD id>`.<br>• `wp19` 2.1b: clicking it opens the original Journey.<br>• `wp19` 2.3-mobile: at 390 px the banner stays inside the viewport.<br>• `reg` W12-10. |
| Result | **PASS**. Interpretation for confirmation: §6 Q-1. Evidence: `wp19-replacement-banner.png`, `wp19-replacement-banner-mobile.png`. |

### 2.3 Item 3 — TL-05: Header, user menu and welcome use `workspace_users.display_name`

| | |
|---|---|
| Requirement | EBC-028 §3 item 3; `020` §11. AC-3.1, AC-3.2. |
| Implementation | • `fetchWorkspaceUserAccess` now also returns `displayName` (`workspace_users.display_name`, `null` when unset). It still selects `*`, as in Phase 0, so the read keeps working before M01 is applied.<br>• A new `resolveWorkspaceDisplayName(stored, user)` in `auth/displayName.ts` prefers the trimmed stored name; otherwise it calls the existing `deriveWorkspaceDisplayName` unchanged.<br>• Both name paths use it:<br>&nbsp;&nbsp;– `getWorkspaceAuthState()`, which feeds the Workspace header, user menu and Dashboard "Welcome back";<br>&nbsp;&nbsp;– `useWorkspaceAuthUser()`, which feeds the public-site header account menu.<br>• Sharing one helper means the two paths cannot drift. |
| **Fallback used (AC-3.2)** | When `display_name` is empty or absent, the name is exactly the current behaviour: `user_metadata.full_name`, then `user_metadata.name`, then the email's local part, then "Workspace User". |
| Files | `web/lib/workspace/shared/auth/repository.ts`, `auth/displayName.ts`, `auth/service.ts`, `web/hooks/useWorkspaceAuthUser.ts` |
| Validation | `wp19` 3.1-ws / 3.1-welcome / 3.1-pub for:<br>• OWNER ("QA Owner") and ADMIN ("QA Admin"): the stored name in the Workspace header, the welcome and the public header;<br>• NONAME (no stored name): the fallback, "qa.noname" from the email on the server path and "noname" from the session email on the public header. The two names differ only because the local test session carries a different email; both are the unchanged derivation. |
| Result | **PASS** (AC-3.1, AC-3.2). Evidence: `wp19-header-owner.png`. |

### 2.4 Item 4 — C-11: Conversion toast with "Open Journey"

| | |
|---|---|
| Requirement | EBC-028 §3 item 4; 020B C-11 (WS13-P1-G, WS13-P1-C, ED-03). AC-4.1 to AC-4.4. |
| Implementation | The conversion success toast keeps its message ("Journey JRN-xxxx created.") and adds `action: { label: "Open Journey", href: /workspace/journey-workspace/<journeyId> }`, using the `journeyId` the Decision API already returns. The Milestone B `Toast.tsx` already:<br>• skips the 6-second auto-dismiss for action toasts;<br>• renders them with a separate close button;<br>• announces every toast through its polite live region.<br>The toast belongs to the record screen, so navigating away removes it. `Toast.tsx` is unchanged. |
| Files | `JourneyPlanningRecordDetailView.tsx` |
| Validation | • `wp19` 4.1a: the reference is shown.<br>• `wp19` 4.1b: the link's `href` is the new Journey.<br>• `wp19` 4.1c: pressing Enter on the focused action opens the Journey.<br>• `wp19` 4.2a: still present after 8 s.<br>• `wp19` 4.2b: gone after navigating away.<br>• `wp19` 4.4: inside `role="status"` / `aria-live="polite"`.<br>• `wp19` 4.3a/4.3b: "Trip Basics saved." stays a no-action toast and still auto-dismisses.<br>• `wp19` A-1: the action is reachable with Tab. |
| Result | **PASS** (AC-4.1 to AC-4.4). Evidence: `wp19-conversion-toast.png`. |

### 2.5 Item 5 — C-12: "Converted to Journey JRN-xxxx →"

| | |
|---|---|
| Requirement | EBC-028 §3 item 5; 020B C-12. AC-5.1 to AC-5.3. |
| Implementation | Under the stage pill, a closed record with outcome Confirmed shows the link "Converted to Journey JRN-xxxx →" to its Journey. **Source:** the record's own `record_converted` History event, which the page already loads. No API or contract change is involved.<br>• Conversion v2 events (Phase 0, `20260928100900`) carry `journey_id` and `journey_reference`.<br>• Conversion v1 events (`20260921070600`) carry only `journey_id`. For those, the reference is read once from the existing Journey detail API.<br>The line shows only when stage is `closed`, outcome is `confirmed` and the event exists. A Lost record, an open record, or a Confirmed record without a conversion event shows nothing new. |
| Files | `JourneyPlanningRecordDetailView.tsx` |
| Validation | • `wp19` 5.1/5.2 with a v2 event: the line is present, links to the Journey, sits below the pill (5.1-pos), and opens the Journey (5.2-nav).<br>• `wp19` 5.1/5.2 with a v1 event: the reference is resolved from the Journey.<br>• `wp19` 5.1-live: the line appears right after a UI conversion.<br>• `wp19` 5.3: no line on a Confirmed record with no event, on a Lost record, on an open record, or on a Decision record.<br>• `wp19` 5.4-mobile.<br>• `reg` W12-17 and W12-19. |
| Result | **PASS** (AC-5.1 to AC-5.3). Limitation: §6 L-1. Evidence: `wp19-converted-line-desktop.png`, `wp19-converted-line-mobile.png`. |

### 2.6 Item 6 — WS13-P1-I: one neutral refusal message

| | |
|---|---|
| Requirement | EBC-028 §3 item 6; DEC-R1.3-026. AC-6.1, AC-6.2. |
| Implementation | New constant `WORKSPACE_ACCESS_REFUSED_MESSAGE` = "You don't have access to the SMV Workspace. If you think this is a mistake, please contact an Administrator." It is used by:<br>• the sign-in page for `reason=unauthorized`, replacing "This account isn't authorised for Workspace access. Contact an Administrator.";<br>• `authenticateWorkspaceApiRequest()` for the 403 body, replacing "Not provisioned as Workspace staff.".<br>The API uses the same sentence because no different API wording was specified before implementation. The 401 "Not signed in." and the expired-session banner are unchanged. |
| Files | `web/lib/workspace/shared/constants.ts`, `web/lib/workspace/shared/api/respond.ts`, `web/app/workspace/sign-in/page.tsx` |
| Validation | • `wp19` 6.1-DEACT / 6.1-STRANGER: the exact message for both cases.<br>• 6.1b: the old wording is gone.<br>• 6.2a/6.2b: the 403 body is `{"ok":false,"message":"<sentence>"}` for both.<br>• 6.2c: byte-identical bodies on a Journey Workspace route.<br>• 6.2d: 401 unchanged.<br>• 6.3: the expired banner is unchanged.<br>• 6.4: no banner on a plain sign-in. |
| Result | **PASS** (AC-6.1, AC-6.2). Evidence: `wp19-refusal-desktop.png`. |

### 2.7 Item 7 — TD-WS13-005: sign out on refusal

| | |
|---|---|
| Requirement | EBC-028 §3 item 7; TECH-DEBT.md; plan §10. AC-7.1, AC-7.2. |
| Implementation | Refused accounts already reach `/workspace/sign-in?reason=unauthorized`, from both the server guard and the homepage sign-in modal. On that page, an effect now:<br>1. calls the existing `signOutCurrentWorkspaceUserFromClient()`;<br>2. shows the item 6 message only once the sign-out has settled.<br>If the sign-out request itself fails, the message is still shown, so the page never goes blank. The proxy, the server guard and the sign-in panel are unchanged. A server-side sign-out was not used: Server Components cannot write cookies, and a proxy change was outside the smallest change. |
| Files | `web/app/workspace/sign-in/page.tsx` |
| Validation | • `wp19` 7.1-DEACT / 7.1-STRANGER: one `/auth/v1/logout` call, then no `sb-…-auth-token` cookie remains, and the message is shown.<br>• `wp19` 7.2-*: a later visit to `/workspace` is treated as signed out: redirect to sign-in with `redirectTo`, no `reason=unauthorized`, and the API returns 401, not 403. |
| Result | **PASS** (AC-7.1, AC-7.2). One Milestone B check changes as a consequence; see §3.3, DE-02. |

### 2.8 Item 8 — TD-WS13-003: remove `fetchWorkspaceUserRole`

| | |
|---|---|
| Requirement | EBC-028 §3 item 8; TECH-DEBT.md. AC-8.1 to AC-8.3. |
| Implementation | `useWorkspaceAuthUser` now uses `fetchWorkspaceUserAccess`. `fetchWorkspaceUserRole` is deleted. `git grep fetchWorkspaceUserRole` outside `docs/` returns nothing; historical EBCs and TECH-DEBT.md still mention it as history. **Behaviour unchanged (AC-8.3):** the hook still decides "signed in" by role alone, exactly as before. A never-provisioned user shows as signed out. A deactivated user is not newly treated as signed out, because the old role-only lookup never checked deactivation. |
| Files | `web/hooks/useWorkspaceAuthUser.ts`, `web/lib/workspace/shared/auth/repository.ts` |
| Validation | • `wp19` 3.1-pub-*: signed-in users render in the public header.<br>• `wp19` 8.3a: a never-provisioned user is signed out.<br>• `wp19` 8.3b: a deactivated user is still shown signed in, as before.<br>• tsc 0 errors. |
| Result | **PASS** (AC-8.1 to AC-8.3). Observation: §6 OBS-WP19-03. |

### 2.9 Verify only — TD-WS13-004: Toast live region

`Toast.tsx` is not in the WP-1.9 diff. `wp19` 4.4 confirms the conversion toast is announced through the existing `role="status"` / `aria-live="polite"` region. **Verified; not re-implemented.**

---

## 3. Test Results

### 3.1 Static checks and build

| Check | Where | Result |
|---|---|---|
| TypeScript (`tsc --noEmit`) | Mac and cloud copy | **0 errors** |
| ESLint (`eslint .`) | Mac and cloud copy | **0 errors, 4 warnings.** All four warnings are pre-existing, in `lib/geo-validation/bootstrapRepository.ts` and `scripts/bootstrap-workbook/writeWorkbook.ts`, which WP-1.9 did not touch. The same count was recorded at Gate 2. **No new warnings.** |
| Production build (`next build`, Next.js 16.2.10 Turbopack) | Cloud copy | **PASS**: compiled successfully and TypeScript finished; every route was generated, including `/workspace/journey-planning/[recordId]`, `/workspace/journey-workspace/[journeyId]` and `/workspace/sign-in`. **Limitations:** a local build, not Vercel. `NEXT_PUBLIC_SUPABASE_*` pointed at the local stand-in. Google fonts were served from the existing local mock. No Preview was produced. |

### 3.2 `verify:*` scripts (cloud copy)

| Result | Scripts |
|---|---|
| **PASS (20)** | journey-presentation, journey-presentation-catalogue, journey-catalogue, journey-orchestration, journey-runtime, journey-scenarios, journey-leads, geo-validation-coupling, geo-validation-selection, getaway-description, journey-intelligence:runtime, journey-itineraries, destination-itineraries, and all 7 Journey Workspace scripts: transitions 118, derivations 24, dates 22, config 17, actions 92, errors 203, list 44 checks. |
| **Known Release 1.2 failures (4), unchanged** | journey-engine, journey-intelligence, journey-intelligence:determinism, journey-intelligence:steering. Their failure lines are identical to the Gate 2 logs (compared line by line). Outside WS13. |

### 3.3 Functional and regression suites (local database, production build)

| Suite | Result | Notes |
|---|---|---|
| **WP-1.9 targeted** (`wp19`, all 8 items) | **76/76** | **Evidence:** `logs/out-wp19.js.log`, `logs/wp19-results.json` (final retained run, 9-Oct-2026 ~02:57 UTC, build `s8_0w0WIzv8KKF6Fqjxaa`). The initial run (9-Oct-2026 02:41 UTC, on the earlier, pre-fix build) showed 68/76; **its output file was not retained** (§8.6). From the engineering-session record (§8.7), the eight initial failures were:<br>• **2 implementation-defect failures, C-12:** `5.1-v1` and `5.2-v1`. The C-12 path for v1 conversion events read the wrong field of the Journey detail response, so the line was not shown. Code fixed on the Mac, re-synced, rebuilt and re-run.<br>• **2 harness failures:** `E-DEACT`, `E-STRANGER`. The local auth stand-in lacked the CORS headers that hosted Supabase sends for browser `signOut()`; harness fixed.<br>• **1 test-expectation error:** `3.1-pub-NONAME`. Wrong expected fallback name; the test session's email differs.<br>• **1 test-selector error:** `4.3a`. It also matched the replacement banner's `role="status"`.<br>• **2 test assertions** caught the pre-existing header width (OBS-WP19-02): `5.4-mobile`, `2.3-mobile`. Replaced by element-level checks.<br>*Rev 1 correction:* the original text said "All eight failures were test or harness issues" and separately "One real defect was found". The session record shows that two of the eight were that real defect (C-12). This breakdown comes from the session record, not from a retained log, and is not independently verified (§8.7). |
| **WS12 focused regression** (`reg` W12-*) — *corrected in Rev 1* | **23/23** | 19 functional checks (W12-01 to W12-19) plus 4 page-error checks (W12-E1 to W12-E4). **Evidence:** `logs/out-reg1112.js.log`, `logs/reg-results.json` (9-Oct run). Covers:<br>• Journey Planning list.<br>• Conversion blocks: no dates; dates/nights mismatch; end before start; no Service Category; no owner; Cancel returns focus.<br>• Deactivated-owner conversion (baseline behaviour, OBS-WP19-04).<br>• Replacement pre-fill and TL-02 link.<br>• Claim; ownership gate; stage change to Discovery; Trip Basics gate; Trip Basics save.<br>• History labels (claim, stage, "Converted to Journey").<br>• C-12 on an open record. |
| **WS11 regression** (`reg` W11-*) — *corrected in Rev 1* | **14/14** | 11 functional checks (W11-01 to W11-11) plus 3 page-error checks (W11-E1 to W11-E3), from the **same** 9-Oct run as WS12. **Evidence:** `logs/out-reg1112.js.log`, `logs/reg-results.json`. Covers: sign-in form; unauthenticated deep link (redirectTo); signed-in user redirected off sign-in; Dashboard welcome and Quick Actions; desktop navigation rail and links; user menu; user-menu Sign out; mobile Dashboard. Header name and the refusal-plus-sign-out cases are under items 3, 6 and 7. |
| **WS11 mobile navigation** (`mobnav.js`) — *separate execution, added in Rev 1* | **3/3** | W11-12 navigation opens with the Journey Planning link visible; W11-13 selecting Journey Planning opens the page; W11-E4 no page errors. **Executed 16-Oct-2026**, not 9-Oct. **Evidence:** `logs/out-mobnav.js.log`. Execution details in §8.4. |
| **Combined regression evidence** — *Rev 1* | **40/40** | 37/37 from the single 9-Oct `reg` run (23 WS12 + 14 WS11) plus 3/3 from the separate 16-Oct `mobnav` run. The two runs are kept distinct. |
| **Milestone B Journey page suite** (`journey.js`) | **66/67** | **DE-02 is an expected change, not a regression.** The check opens a Journey as the deactivated user and then calls the API with the same browser session, expecting 403. WP-1.9 item 7 now signs that session out on the refusal page, so the follow-up call is correctly 401. The 403 for a live refused session is proven separately by `wp19` 6.2a/6.2c. The suite was not edited. **Evidence:** `logs/out-journey.js.log`. |
| **Gate 1 — original result, 8-Oct-2026** | **70/70** (67 + 3) | As accepted at Gate 1 (EBC-026; DEC-R1.3-030). Not re-stated from new evidence; the 8-Oct logs belong to EBC-026. |
| **Gate 1 — as-run re-run, 9-Oct-2026** (`gate1.js` + `gate1kb.js`, unmodified) | **65/67** + **3/3** | LC-02 and LC-04 compare against date strings hard-coded when Gate 1 ran on 8 October ("18 Oct", "14 Oct"). Fixture dates are relative to the business date, which was 9 October, so the screens correctly showed "19 Oct" and "15 Oct". No product code relates to these two checks. **Evidence:** `logs/out-gate1.js.log`, `logs/out-gate1kb.js.log`. |
| **Gate 1 — date-adjusted re-run, 9-Oct-2026** (`gate1-d.js` + `gate1kb.js`) | **67/67** + **3/3** = 70/70 | `gate1-d.js` is a copy of `gate1.js` with only those two literals updated ("19 Oct", "15 Oct"). **Evidence:** `logs/out-gate1-d.js.log`, `suites/gate1-d.js`. |
| Milestone B list/S-5 render scripts (`list.js`, `s5.js`) | Ran clean | Render dumps; no console errors. |
| API integration (service level) | **121/121** | Unchanged Milestone A service layer. |
| M11 SQL suite | Not run | No SQL, migration or RPC changed. |

### 3.4 Accessibility

| Check | Result |
|---|---|
| "Open Journey" reachable by keyboard (Tab) and activated with Enter | PASS (`wp19` A-1, 4.1c) |
| Conversion toast announced politely (`role="status"`, `aria-live="polite"`) | PASS (`wp19` 4.4) |
| Action toast does not auto-dismiss (WCAG 2.2.1) | PASS (`wp19` 4.2a) |
| New links (banner, Converted line) are native `<a>` elements with descriptive text | PASS (`wp19` 2.1a, 5.2) |
| Confirm dialog focus return after Cancel | PASS (`reg` W12-05) |

### 3.5 Not executed

• Keerthi's independent functional QA and Sri's experience review (separate personas).
• Sign-in and sign-out against the hosted Supabase project; the Product Owner performs real sign-ins, at Preview stage only, which is not authorised now.
• Browsers other than Chromium (Playwright).
• Physical devices.

---

## 4. Change Inventory

Nine modified files. No files added or deleted in source. This report is the only new file. `git diff --stat`: **9 files changed, 188 insertions(+), 41 deletions(−).**

| File | Δ | Items | sha256 (Mac = cloud copy) |
|---|---|---|---|
| `web/app/workspace/sign-in/page.tsx` | +32 −3 | 6, 7 | `c106f647…1ef8` |
| `web/components/workspace/journey-planning/ConfirmJourneyDialog.tsx` | +5 | 1 | `7d1305e0…6010` |
| `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` | +100 −9 | 1, 2, 4, 5 | `302b0d0f…86e7` |
| `web/hooks/useWorkspaceAuthUser.ts` | +15 −9 | 3, 8 | `fa4d6e02…7937` |
| `web/lib/workspace/shared/api/respond.ts` | +4 −1 | 6 | `74fca6e6…bfe5` |
| `web/lib/workspace/shared/auth/displayName.ts` | +15 | 3 | `f80b9c9c…f038` |
| `web/lib/workspace/shared/auth/repository.ts` | +7 −17 | 3, 8 | `dc697447…c0c2` |
| `web/lib/workspace/shared/auth/service.ts` | +3 −2 | 3 | `97ca5faa…d7ae` |
| `web/lib/workspace/shared/constants.ts` | +7 | 6 | `7389e745…a473` |
| `docs/09-Development/EBC-R1.3-WS13-029-RAD-WP-1.9-Engineering-Completion-and-Validation-Report.md` | new | report | — |

**Scope confirmation.** Every change traces to an item above. No change was made to:
• the Decision, History, Directory or Journey APIs, or their contracts; the only API change is the item 6 refusal message;
• migrations, schema, RLS or RPCs;
• dependencies, `package.json` or the lock file;
• environment variables;
• `Toast.tsx`, the proxy, the server guard or the sign-in panel;
• the Journey Workspace screens;
• Journey Planning business rules.

**File mode (Rev 1, R-1).** The original diff also carried an unreported mode change on `web/lib/workspace/shared/auth/repository.ts` (100755 → 100644), caused by an in-place `sed -i` used to reword one comment. It was restored with `chmod 755` on 9-Oct-2026; the content was not changed. Verification records are in §8.1.

**Test assets (Rev 1).** The original text here read: "Local-only test assets outside the repository were not transferred". They have since been transferred to the Mac, outside the repository, at `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9` (§8.2). Nothing from the evidence package is in the repository.

---

## 5. Governance and Safety Confirmation

| Control | Confirmation |
|---|---|
| M11 / any migration | Not modified. `supabase/` is unchanged. |
| Shared Supabase database | Not accessed (no read, no write). All runtime tests used a throwaway local Postgres database (`m11ui`), PostgREST and a local auth stand-in. |
| Push | None. |
| Deployment | No Vercel Preview or Production. |
| Commit | None. The work waits for review and explicit authorisation. |
| Branches | Only `ws13-milestone-b`. No branch was created, switched, reset or deleted. `7291f46` and `1b1fd4d` are intact. |
| OBS-B1 to OBS-B9 | Not implemented. |
| Baselines | No Product, UX or Architecture baseline changed. No governance register was edited. |
| Credentials and secrets | None typed, read or entered. Environment-variable names only. |
| Test data | Local `QA-WS13-P1-*` records only. |
| Git hygiene | Read-only git commands used `GIT_OPTIONAL_LOCKS=0`. No lock files were created or deleted. |
| File mode (Rev 1) | `repository.ts` restored to `100755` (R-1); `git diff --summary` empty (§8.1). |
| Evidence (Rev 1) | Held outside Git at `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9` (§8.2). The 16-Oct mobile-navigation run used the existing build and a local database only; no implementation, test-script, Git, deployment or M11 activity. |

---

## 6. Outstanding Items

**Interpretations (resolved).** Q-1 (TL-02: S-3 wording with the "Open JRN-····" action link) and Q-2 (TL-01: owner's display name shown for the current user too) were confirmed and retained as built by the Product Owner (DEC-R1.3-034, WP-D3; reasoning in EBC-031 §3–§4). *The original text asked Tiger/Vivek to confirm both; the original wording is preserved in the historical baseline.*

**Observations (none implemented).** Routing approved by the Product Owner (DEC-R1.3-034, WP-D4; EBC-031 §7). Text unchanged from the original:

- **OBS-WP19-01.** The record header's "Owner:" line on the Journey Planning record still shows "You" or a raw user id for another owner (visible behind the Confirm dialog). TL-01 covers the dialog only, so this was left alone. A separate item could reuse the same directory lookup.
- **OBS-WP19-02 (pre-existing).** At 390 px, the Workspace header overflows the viewport by about 100 px; the account button and role pill are cut off. The same overflow occurs with the pre-WP-1.9 derived name (493 px against 495 px). TL-05 can make this worse if Administrators set long display names.
- **OBS-WP19-03.** The public-site header still shows a deactivated user as signed in, because the hook decides by role only (kept per AC-8.3). Workspace pages and APIs still refuse them, and the refusal page now signs them out.
- **OBS-WP19-04 (baseline business rule).** Converting a planning record whose owner is deactivated succeeds and creates a Journey owned by that deactivated user. Conversion v2 refuses a deactivated actor, not a deactivated owner. The Confirm dialog now makes this visible ("Account deactivated"). Whether it should be blocked is for Arjun/Tiger.
- **OBS-WP19-05.** Item 7 runs in the browser, which is the only way the client-rendered sign-in page shows any message. Without JavaScript, a refused session is not signed out. Low risk.

**Limitations:**

- **L-1 (C-12).** For a pre-Phase-0 (v1) conversion, if the Journey detail request fails, the Converted line is not shown, rather than showing a line without a reference. v2 conversions, which cover all conversions since Phase 0, need no extra request.

**Evidence limitations (Rev 1; details in §8):**

- **E-1.** The output of the initial 9-Oct `wp19` run (68/76) was not retained. Only the final 76/76 run is evidenced.
- **E-2.** The 9-Oct mobile-navigation output was never written to a file. The 3/3 result is evidenced by a separate execution on 16-Oct-2026 against the same build, not by a recovered copy.

**Defects:** none open. One defect found during validation (C-12 v1 response field) was fixed and re-verified (§3.3).

---

## 7. Engineering Recommendation

**WP-1.9 is complete and validated at engineering level.** All eight authorised items are implemented as the smallest change on the existing patterns, and every acceptance criterion (AC-1.1 to AC-8.3) has passing runtime evidence. Static checks, the production build, the Journey Workspace `verify:*` scripts, the API suite, the WS11 and WS12 regressions and the Milestone B / Gate 1 re-runs pass. Each deviation from a previous result is explained: DE-02 is a direct, intended consequence of item 7, and LC-02/LC-04 fail only on hard-coded dates.

No condition prevents completion. Q-1 and Q-2 were retained as built (DEC-R1.3-034, WP-D3). *Rev 1:* the regression figures are corrected (§3.3), the test evidence is now held on the Mac outside Git (§8), and two evidence-retention limitations are disclosed (E-1, E-2). None of these changes a result or a conclusion.

**Recommendation:** WP-1.9 is ready for Tiger's review and for the Product Owner's decision on authorising one local WP-1.9 commit on `ws13-milestone-b`. Checkpoint 4, push, deployment and M11 remain blocked until their own gates.

*Rev 1 status:* engineering acceptance was given by the Product Owner (DEC-R1.3-034, WP-D1). The local commit remains conditional on Tiger's verification (EBC-031 §12) and the Product Owner's final authorisation. This revision does not authorise it.

---

## 8. Evidence and Reconciliation (added in Rev 1, under EBC-R1.3-WS13-032)

### 8.1 R-1 — File mode of `web/lib/workspace/shared/auth/repository.ts`

| Item | Value |
|---|---|
| Finding | EBC-031 §9 R-1: unreported mode change 100755 → 100644 in the original diff |
| Cause | An in-place `sed -i` used to reword one comment rewrote the file without the executable bit |
| Fix | `chmod 755 web/lib/workspace/shared/auth/repository.ts`, 9-Oct-2026. File content not changed (sha256 `dc697447…c0c2`). |
| Expected Git mode | `100755`, as at HEAD `1b1fd4d` (`git ls-tree HEAD`) |
| **Supplied verification record** (reported to Tiger on 16-Oct-2026, before EBC-032) | `git diff --raw` → `:100755 100755 02497c9 0000000 M	web/lib/workspace/shared/auth/repository.ts`, i.e. a content modification with no mode change. `git diff --summary` empty. Executable bit present. `core.fileMode=true`. |
| **Independent re-check during EBC-032** (16-Oct-2026 14:30:13 UTC, read-only, `GIT_OPTIONAL_LOCKS=0`) | `git ls-tree HEAD` → `100755`. `git diff --raw` → the same `:100755 100755 … M` line. `git diff --summary` empty for all files. Executable bit present. |
| Caveat | The checks ran through the Mac mount, which displays permissions as `700` (owner bits only). Git's comparison is the criterion (EBC-031 V-2). A native check on the Mac: `stat -f '%Sp' web/lib/workspace/shared/auth/repository.ts`. |

### 8.2 R-2 — Evidence package

| Item | Value |
|---|---|
| Location | `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9` on the Mac, **outside the Git repository** |
| Original package | 69 files extracted from `wp19-evidence.tar.gz`: `README.md`, `MANIFEST.sha256`, `suites/` (6), `harness/` (3), `logs/` (20), `logs/verify/` (25) and `screenshots/` (13). 2,539,412 bytes. |
| Original manifest | `MANIFEST.sha256` lists 68 files (all files except itself) |
| Transfer (9-Oct-2026) | Archive sha256 `6a1473b2…afe53b`, identical at source and destination. A single archive was used because the cloud output folder adds a provenance chunk (`caBX`) to standalone PNG files; the archive carries the original bytes. |
| Manifest verification | `sha256sum -c MANIFEST.sha256`: **68 OK, 0 failed, 0 missing.** Run on 9-Oct and 16-Oct (reported), and re-run during EBC-032 on 16-Oct-2026 at 14:30 UTC with the same result. |
| Sensitive material | None found: no credentials, `.env` values or JWT secret; no `.env`, secret, `.pem` or `.key` files. The suites reference only the path of a throwaway local secret file, which is not included. |

### 8.3 Addendum (16-Oct-2026)

The separate mobile-navigation execution (§8.4) added three files. The original `MANIFEST.sha256` was **not** rewritten; the addendum is a separate integrity record.

| File | Purpose |
|---|---|
| `logs/out-mobnav.js.log` | Full output with an execution-context header (sha256 `946f9612…37fc`) |
| `MANIFEST-ADDENDUM-2026-10-16.sha256` | Integrity record for the new log. `sha256sum -c` → `./logs/out-mobnav.js.log: OK` (re-checked during EBC-032) |
| `wp19-evidence-addendum-2026-10-16.tar.gz` | Transfer archive (sha256 `bd34d590…d9f8`, identical at source and destination) |

**Current inventory, observed during EBC-032: 73 files** = the original 69, the new log, the addendum manifest, and the two transfer archives (`wp19-evidence.tar.gz`, `wp19-evidence-addendum-2026-10-16.tar.gz`). That is 2,541,287 bytes excluding the archives. This matches the reported inventory.

**Review copies placed in the evidence folder, and how they were resolved** (draft b.1, 16-Oct-2026). The evidence folder temporarily held a 74th file: a review copy of this Rev 1 draft, `EBC-R1.3-WS13-029-RAD-WP-1.9-Engineering-Completion-and-Validation-Report.Rev1-DRAFT.md`. It was never evidence and was not covered by either manifest. Two successive versions were observed; neither was created or edited by Rad.

| Version | Size | sha256 | Placed (UTC) | Nature |
|---|---|---|---|---|
| First | 36,920 bytes | `c77ec0f6…440d` | 16-Oct-2026 14:55 | Plain-text rendering of draft a (Markdown formatting removed) |
| Second (replaced the first) | **41,579 bytes** | **`941e2941…`** (`941e2941da28a45b11279eb10ab45e78781f08f326bff3eeca2ebe51e533fffb`) | **16-Oct-2026 15:12** | Plain-text rendering of draft b (Markdown formatting removed) |

**Resolution (Tiger's Option 1).** The second rendering was moved, not deleted, to a separate review folder alongside the evidence package: `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9-review/plain-text-rendering/`, keeping its file name and modification time.
- The copy was checked byte-identical (`cmp`; sha256 `941e2941…` on both sides) before the original was removed from the evidence folder. Removal used a one-time delete permission approved by the Product Owner; that file was the only one removed.
- The first rendering (`c77ec0f6…`) had already been replaced at 15:12 UTC before Rad's involvement and is not available.
- The Markdown draft b (sha256 `8659e0ec…94f5`, 44,741 bytes) was placed in the review folder and verified on the Mac.

**Evidence folder after resolution: 73 files**, the inventory stated above. The original manifest verifies 68 OK, 0 failed, 0 missing; the 16-Oct addendum verifies `./logs/out-mobnav.js.log: OK`. The only files covered by neither manifest are the two transfer archives. Neither manifest was modified.

### 8.4 Mobile-navigation execution (16-Oct-2026)

This is a **new execution, not a recovered copy** of the 9-Oct output, which was never written to a file (§8.6).

| Item | Value |
|---|---|
| Authorisation | Product Owner, 16-Oct-2026, separately scoped run |
| Script | `mobnav.js`, unchanged (sha256 `5615693a…985a`, matches `suites/mobnav.js` in the original manifest) |
| Helper | `lib.js`, unchanged (sha256 `f93a2dc4…a9f1`, matches the original manifest) |
| Build | `s8_0w0WIzv8KKF6Fqjxaa`, the existing production build used for the WP-1.9 validation (built 9-Oct-2026 02:43 UTC). Not rebuilt. The nine WP-1.9 source files in that build have the same sha256 prefixes as §4. |
| Database | Fresh local test database (same setup scripts plus `wp19_fixture.py`); no shared database |
| Runtime | Chromium (Playwright 1.56.1, Node 22.22.0), viewport 390 × 844 |
| User | QA Owner test account |
| Time | 16-Oct-2026, 14:15:20 – 14:15:26 UTC |
| Result | **3 passed, 0 failed; exit code 0.** W11-12 navigation opens and the Journey Planning link is visible; W11-13 selecting Journey Planning opens the Journey Planning page; W11-E4 no page errors. |
| Log | `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9/logs/out-mobnav.js.log` |
| Visual corroboration | The screenshot produced during this run was **byte-identical** to the existing `screenshots/reg-mobile-nav-open.png` (sha256 `5cf5a496…422d`) from 9-Oct. It is recorded as corroborating visual evidence; **no new screenshot was added**. |
| Context difference | On 9-Oct the script ran against a database already used by the `wp19` suite; on 16-Oct against a fresh one. The test needs only the test user and the Dashboard, so this does not affect the result. |

### 8.5 Reconciliation

| Topic | Original statement | Reconciled position (source of truth: retained evidence) |
|---|---|---|
| WS12 regression | 19/19 | **23/23**: 19 functional + 4 page-error checks (`logs/out-reg1112.js.log`) |
| WS11 regression | 21/21 (18 + 3) | **14/14** functional and page-error checks (11 + 3) in the 9-Oct run, **plus 3/3** mobile navigation in a separate 16-Oct run (`logs/out-mobnav.js.log`). The original split counted only WS12's functional checks and assigned the remaining 18 of the 37 to WS11. |
| Regression total | 37 + 3 | **40/40** = 37/37 (one 9-Oct run) + 3/3 (separate 16-Oct run) |
| Screenshot count | This report named 9 `wp19-*.png`; EBC-031 R-2/§12 V-5 refers to eleven | **9** WP-1.9 screenshots (`wp19-*.png`) and **4** regression screenshots (`reg-*.png`) = **13** in total. `wp19.js` contains exactly nine screenshot calls and all nine files are present. "Eleven" has no source in the suites or in this report. No screenshot was duplicated or altered. The correction of EBC-031 V-5 is for Tiger. |
| Evidence location | "No implementation or evidence exists only in the cloud" (§1) | Inaccurate for the evidence at the time. Now held outside Git at `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9` (§8.2). |
| Package size | "About 2.7 MB" (reported on 9-Oct, before the transfer) | 2,539,412 bytes for the original 69 files. The 2.7 MB figure was measured on the cloud copy whose PNGs carried the added provenance chunk, rounded up by the disk-usage tool. |

### 8.6 Historical evidence-retention limitations

- **E-1: initial `wp19` run.** The initial 9-Oct execution scored 68/76. Its output file was overwritten by later runs and **is not available**; it has not been recreated. The failure breakdown in §3.3 and §8.7 comes from the engineering-session record. The final 76/76 result and its evidence (`logs/out-wp19.js.log`, `logs/wp19-results.json`) are preserved. The explanation of the initial failures and fixes (§3.3) comes from the engineering record, not from a retained log, and is not presented as original execution evidence. The full suite was **not** re-run to recreate the missing log.
- **E-2: 9-Oct mobile-navigation output.** It was shown only in the session and never written to a file. The 3/3 result is evidenced by the separate 16-Oct execution (§8.4), corroborated by the byte-identical 9-Oct screenshot.

### 8.7 C-12 in the initial WP-1.9 run (clarification for Tiger's review)

**Question.** Was C-12 one of the eight failures in the initial 68/76 run?

**Answer.** Yes, according to the engineering-session record. Two of the eight failed checks were C-12 checks: `5.1-v1` and `5.2-v1`, the v1-conversion path (reference read from the Journey).

**Evidence used:**

| # | Evidence | What it shows | Status |
|---|---|---|---|
| 1 | **Engineering-session record** (the session transcript held in Rad's cloud workspace). The initial run's tool output was captured there at 9-Oct-2026 02:41:29 UTC. | The run ended "WP-1.9 targeted: 68/76 passed". The eight FAIL lines were: `E-DEACT`, `E-STRANGER`, `3.1-pub-NONAME`, `5.1-v1 event (reference read from the Journey)`, `5.2-v1 event (reference read from the Journey)`, `5.4-mobile`, `2.3-mobile`, `4.3a`. | Contemporaneous session record. **Not** a retained log file. Not in the evidence package, and not independently reviewed. |
| 2 | Code record in the same session: inspection of `GET /api/workspace/journey-workspace/[journeyId]`, which returns `{ ok, journey: JourneyDetail }`, where `JourneyDetail` has a nested `journey` | The C-12 v1 path read `result.data.journey.journeyReference` (undefined) instead of `result.data.journey.journey.journeyReference`, so the reference stayed unknown and the line was not rendered. This matches the two failures. | Session record plus current code. The fixed code is in the reviewed diff of `JourneyPlanningRecordDetailView.tsx` (sha256 `302b0d0f…`). |
| 3 | Fix timing | Fix written on the Mac at 02:41:51 UTC; production build `s8_0w0WIzv8KKF6Fqjxaa` completed 02:43 UTC; final runs after that. | File modification time and build time in the session record. |
| 4 | **Retained final evidence** | `logs/out-wp19.js.log` and `logs/wp19-results.json` show `5.1-v1` and `5.2-v1` PASS, together with the other C-12 checks (`5.1-v2`, `5.2-v2`, `5.1-pos`, `5.2-nav`, `5.1-live`, four `5.3` negatives, `5.4-mobile`). | Retained and manifest-verified (§8.2). |
| 5 | Local fixture `harness/wp19_fixture.py` | Creates a v1-style `record_converted` event (`journey_id` only) for the `5.x-v1` checks. | Retained and manifest-verified. |

**Limitations, stated explicitly:**

- The initial run's **output file is not available**. The failure list above comes from the session record, not from a recovered log. It has not been recreated and is not presented as original execution evidence.
- The **pre-fix build** and the **initial version of `wp19.js`** were not retained. Between the two runs, four assertions changed as test fixes (`3.1-pub`, `4.3a`, `5.4-mobile`, `2.3-mobile`), and the harness gained the CORS headers. The C-12 checks `5.1-v1` and `5.2-v1` were not changed.
- The defect was **not independently reproduced** against the pre-fix code after the fix. The causal link rests on (1) the failure lines in the session record, (2) the code inspection, and (4) the same unchanged checks passing after the code fix.
- So the conclusion that C-12 accounted for two of the eight initial failures is **supported by the engineering-session record, not independently verified** by retained evidence. Only the final 76/76 result is independently verifiable from the evidence package.

---

— Rad, Engineering & Implementation Specialist, 9 October 2026  
*Revision 1 prepared by Rad and issued on 16 October 2026, after Tiger's final review.*

---

## Revision History

| Revision | Date | Author | Change |
|---|---|---|---|
| Original | 9-Oct-2026 | Rad | Submitted to Tiger and the Product Owner. sha256 `d8de2c724cc097a9624fa0c57a856e7e283685218770a4bee4d9d48746715fa5`. Preserved unchanged as the historical baseline. |
| Rev 1 (draft a) | 16-Oct-2026 | Rad | Under EBC-R1.3-WS13-032, following EBC-031 findings R-1 and R-2 and DEC-R1.3-034:<br>• **Header:** revision status; status updated with DEC-R1.3-034.<br>• **§1:** inaccurate evidence statement corrected; evidence location added.<br>• **§2 intro:** test-suite references separated by run.<br>• **§3.3:** WS12 23/23 and WS11 14/14 (were 19/19 and 21/21); mobile navigation 3/3 as a separate 16-Oct execution; combined 40/40; Gate 1 shown as three separate results (8-Oct 70/70; 9-Oct as-run 65/67 + 3/3; 9-Oct date-adjusted 67/67 + 3/3); evidence log references; initial-run limitation.<br>• **§4:** R-1 file-mode fix recorded; test-asset location.<br>• **§5:** file-mode and evidence rows.<br>• **§6:** Q-1/Q-2 marked resolved (WP-D3); observation routing referenced (WP-D4); evidence limitations E-1 and E-2.<br>• **§7:** Rev 1 status note.<br>• **New §8:** R-1 records (supplied and independent); R-2 package, original manifest and separate 16-Oct addendum; mobile-navigation execution; reconciliation of regression totals, screenshots, evidence location and size; retention limitations.<br>No change to the implementation, test scripts, results or conclusions. **Pending Tiger's review.** |
| Rev 1 (draft b) | 16-Oct-2026 | Rad | Following Tiger's review query (R-1, C-12 in the initial run):<br>• §3.3 WP-1.9 row now gives the session-record breakdown of the eight initial failures, including the two C-12 failures (`5.1-v1`, `5.2-v1`). It corrects the original "All eight failures were test or harness issues".<br>• New §8.7 records the C-12 clarification, its evidence and its limitations.<br>• §8.6 E-1 wording clarified.<br>• §8.3 records the 74th file (the review copy of this draft) observed in the evidence folder.<br>No other change. **Pending Tiger's review.** |
| Rev 1 (draft b.1) | 16-Oct-2026 | Rad | Following Tiger's evidence-folder decision (Option 1). §8.3 records both plain-text renderings, the second in full (41,579 bytes, sha256 `941e2941…`, placed 15:12 UTC on 16-Oct-2026); its verified move to `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9-review/plain-text-rendering/`; the restored 73-file inventory; and the unchanged integrity checks. No other change. **Pending Tiger's review.** |
| Rev 1 (issued) | 16-Oct-2026 | Rad | **Issued** from draft b.1 (sha256 `eef265832ed3114e2c3a6d226558dee292e302ebbf5032242be0b24953c45427`) after Tiger's final review (EBC-R1.3-WS13-031 §12 pre-commit verification record, D-1).<br>**Status-only change.** Only the header Date and Revision status rows, the closing sign-off line and this row changed. Technical content, results, evidence references, the evidence-retention limitations (E-1, E-2) and the C-12 clarification (§8.7) are unchanged from draft b.1.<br>**Original preserved:** the original report (Rev 0, sha256 `d8de2c724cc097a9624fa0c57a856e7e283685218770a4bee4d9d48746715fa5`) is kept unchanged as `…-Rev0-original.md` in Project Knowledge and in `/Users/viveksophu/SMV-evidence/R1.3-WS13-WP-1.9-review/`.<br>**Placement:** issued at `docs/09-Development/EBC-R1.3-WS13-029-RAD-WP-1.9-Engineering-Completion-and-Validation-Report.md` and in Project Knowledge, byte-identical. Not committed. |
