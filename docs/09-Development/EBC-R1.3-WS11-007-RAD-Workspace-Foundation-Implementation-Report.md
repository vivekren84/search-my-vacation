# EBC-R1.3-WS11-007 — Workspace Foundation Implementation Report

| Document Information | |
|---|---|
| Document Name | SMV Workspace Foundation Implementation Report |
| Persona | Rad — Engineering and Implementation Specialist |
| Status | Complete — final verification passed; two manual follow-ups remain (Section 7) |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| Engineering Phase | WS-Eng-0 |
| EBC | EBC-R1.3-WS11-007 |
| Predecessor | `EBC-R1.3-WS11-006-RAD-Engineering-Planning-and-Implementation-Strategy.md` (v1.2, approved) |
| Last Updated | 16 September 2026 |

---

## 1. Summary

This EBC's full approved scope (Section 8, items 8.1–8.9) is now implemented, including Route Protection / Middleware, following the Product Owner's approval (16 September 2026) to use `web/proxy.ts` rather than `web/middleware.ts` — see Sections 4 and 6. Everything is type-checked and lint-clean. No business functionality was added, per this EBC's Section 9 exclusions. Two manual, environment-external follow-ups remain before this EBC's Section 19 completion criteria are fully evidenced (Section 7): applying the migration to a live Supabase project, and a `next build` run outside this environment's network restrictions.

## 2. Files Created

**`web/lib/workspace/shared/`** (Approved Folder 1):
- `types.ts`, `constants.ts` — shared Workspace types (`WorkspaceRole`, `WorkspaceUser`, `WorkspaceSession`) and route constants (Section 8.9)
- `supabase/errors.ts`, `supabase/server.ts`, `supabase/browser.ts` — Supabase SSR client factories for Server Components/Actions/Route Handlers and for Client Components respectively (Section 8.4)
- `supabase/session.ts` — the session-refresh + route-protection mechanism (`updateWorkspaceSession`), written independently of the proxy/middleware entry point's exact file name (Section 8.5)
- `auth/validation.ts`, `auth/repository.ts`, `auth/service.ts`, `auth/client.ts` — sign-in credential validation, an RLS-scoped `workspace_users` role lookup, `getCurrentWorkspaceUser()` / `signOutCurrentWorkspaceUser()`, and the Client Component sign-in action (Section 8.4)
- `rbac/roles.ts`, `rbac/permissions.ts`, `rbac/guard.ts` — the role model, a capability-check framework (Administrator-only conservative default per OQ-001, no business permissions), and `requireWorkspaceUser()` (Section 8.7)

**`web/proxy.ts`** — the Route Protection / Middleware entry point (Section 4).

**`web/app/workspace/`** (Approved Folder 2):
- `layout.tsx` — a structural pass-through wrapper only; no navigation chrome is invented, since Sophie has not yet delivered the Primary Navigation Rail / Header Bar wireframes (FCR-022)
- `page.tsx` — a temporary, explicitly-labelled foundation-verification placeholder (not an approved screen) that calls `requireWorkspaceUser()`, displays the signed-in user's email and role, and exposes a Server Action to sign out
- `sign-in/page.tsx` — a temporary, unstyled verification form (not an approved Sophie screen) that calls the password sign-in action

**`supabase/migrations/20260916090000_workspace_users_and_roles.sql`**:
- `public.workspace_users` (`user_id uuid primary key references auth.users`, `role text check (role in ('administrator','privilege_user'))`, timestamps + `updated_at` trigger)
- `public.workspace_current_user_role()` — `security definer` helper, exactly the function named in the approved Engineering Planning document
- RLS enabled; policies: a user may read their own row, an Administrator may read every row; no insert/update policy yet (Administrator-initiated user provisioning is WS-Eng-1 scope, not this EBC — rows are written via the service-role key only, e.g. directly in the Supabase dashboard, for now)

**`web/app/api/workspace/`** — **deliberately not created.** Section 8.3 scopes this to "infrastructure endpoints if required" and password sign-in/sign-out needs none (handled directly through the Supabase SSR SDK against the session cookie). This is a minimal-scope engineering decision, not an oversight; the folder will be created the moment a Route Handler is actually needed (e.g., WS-Eng-1's invite-accept flow).

## 3. Files Modified

- `web/package.json` / `web/package-lock.json` — added `@supabase/ssr` and its required `@supabase/supabase-js` dependency, exactly as approved in `EBC-R1.3-WS11-006` v1.2 Section 12. No other dependency changed.

## 4. Route Protection / Middleware — `web/proxy.ts`

**`web/proxy.ts`** created, per Product Owner approval on review of this report's Section 5 (as originally written): Next.js deprecated and renamed the `middleware` file convention to `proxy` as of v16.0.0, and this repository runs 16.2.10. The Product Owner's stated reasoning: "Our repository is using Next.js 16.2.10. `proxy.ts` is the current recommended convention. This is an implementation alignment with the framework and does not alter the approved architecture or Workspace design." No other architectural or product decision was changed by this approval.

`proxy.ts` is a thin entry point only — a five-line wrapper around `updateWorkspaceSession()` (`lib/workspace/shared/supabase/session.ts`, already built and unchanged). `tsc --noEmit` and `eslint` both pass with this file included (Section 6).

**Matcher corrected after Product Owner's final-verification request (Section 11).** The matcher originally shipped in this file's first version excluded only static assets (`_next/static`, `_next/image`, `favicon.ico`, common image extensions) — meaning it still ran on every public page and every existing API route, invoking a Supabase Auth network call on each one even though only `/workspace/**` ever needed it. This was found and fixed while verifying the Product Owner's request that "Workspace route protection does not affect any non-workspace routes": the matcher is now `["/workspace/:path*"]`, so `proxy` executes only for `/workspace` and its subpaths. Verified live (Section 11) rather than assumed from the regex alone.

## 5. One Deliberate Divergence From an Existing Pattern (flagged, not hidden)

`lib/workspace/shared/auth/repository.ts` reads `workspace_users` through the caller's own session-scoped Supabase client rather than this repository's established raw-fetch/secret-key pattern (e.g. `web/lib/journey-leads/repository.ts`). That existing pattern authenticates as the service role and bypasses RLS by design — correct for public-site writes, but wrong here: AD-WS11-002's whole premise is that Row Level Security, evaluated against the signed-in user's own JWT, is what enforces the Workspace access boundary. Using the secret-key pattern for this table would have silently defeated the RLS policies in the same migration.

## 6. Architecture Escalation — Resolved

Repository-first review of the actual installed framework (`next@16.2.10`, confirmed in `web/package.json`; bundled docs at `web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`) found: as of Next.js v16.0.0, the `middleware.ts` file convention this EBC's Section 6/8.6/17/18/19 name is deprecated and renamed to `proxy.ts`. This was escalated rather than decided independently, consistent with the precedent set on `EBC-R1.3-WS11-006` v1.2. **Resolved by Product Owner approval (16 September 2026): use `web/proxy.ts`.** See Section 4.

Defence in depth is unchanged either way: every protected entry point (`app/workspace/page.tsx`) also calls `requireWorkspaceUser()` directly, independent of the proxy layer, consistent with Next's own guidance not to rely on proxy/middleware alone.

## 7. Checks Run

- **`npx tsc --noEmit -p tsconfig.json`** (full project, including `proxy.ts`) — **Passed**, no errors.
- **`npx eslint proxy.ts lib/workspace app/workspace`** — **Passed**, no errors.
- **`npm run build`** — **Still could not complete in this environment, for the same pre-existing reason, re-confirmed after adding `proxy.ts`.** Turbopack fails fetching Google Fonts (`Inter`, `Poppins`) used by the pre-existing root `app/layout.tsx` (untouched by this EBC). Confirmed independently with `curl`: this environment's network proxy returns `403` for `fonts.googleapis.com`. Re-running the build after adding `proxy.ts` hit the identical font-fetch error with no new or different failure, which is good evidence `proxy.ts` itself introduces no build-breaking issue. **Manual follow-up required:** run `npm run build` from a normal terminal with unrestricted network access to obtain a real production-build confirmation.
- **Migration** — written to match this repository's existing SQL conventions and reviewed manually; **not executed against a live database** from this environment (no direct database credentials/access here). **Manual follow-up required:** apply via `supabase db push` (or the dashboard SQL editor) against the project's Supabase instance, then provision one test `workspace_users` row (via the dashboard, service-role key) to functionally verify sign-in end-to-end.

## 8. Environment Note (not a code defect)

This session's bridge to your local machine hit filesystem quirks while working in this repository (the `.next` build cache getting into an un-deletable state after each interrupted build, and a transient `.git/index.lock`), all environment-level and not caused by the Workspace changes. None of these blocked the actual implementation work — only `git add`/`git commit` and a from-this-environment production build.

**Standing convention (per Product Owner direction, 16 September 2026):** Engineering shall not request broad, folder-wide delete permission for a repository-maintenance cleanup where a documented, minimal manual command achieves the same result. Applied here: when `.next` locked up a second time after re-running the build with `proxy.ts` added, I did not request delete permission again — I renamed it (`web/.next-locked-artifact-2/`) exactly as before, without asking, since renaming needs no elevated permission. You've already cleared the `.git/index.lock` from the first round. Two harmless, git-ignored leftover folders remain for you to remove at your convenience, each with an exact, minimal command and nothing broader:

```
rm -rf "web/.next-locked-artifact"
rm -rf "web/.next-locked-artifact-2"
```

## 9. Completion Criteria (EBC-R1.3-WS11-007 §19) — Status

Workspace structure: `web/lib/workspace/` and `web/app/workspace/` exist; `web/app/api/workspace/` deliberately deferred (Section 2 above). Authentication foundation: built, not yet live-tested (needs the manual steps in Section 7). RBAC foundation: implemented (mechanism only, no business permissions). Middleware: **done** — `web/proxy.ts` (Section 4/6). Supabase SSR: integrated. Migration: written, not yet applied. Build: TypeScript and lint clean; full `next build` unverified in this environment for a pre-existing, unrelated reason (Section 7). Repository: clean, no unrelated changes. Dependencies: only the one already-approved `@supabase/ssr` (+ its required `@supabase/supabase-js`). No business functionality exists.

## 10. Git Status

Nothing staged or committed. `git status --short` shows exactly: `web/package.json` and `web/package-lock.json` modified; `web/proxy.ts`, `supabase/migrations/20260916090000_workspace_users_and_roles.sql`, `web/app/workspace/`, `web/lib/workspace/`, and this report itself untracked; plus the two harmless leftover `.next-locked-artifact*` folders (git-ignored) and the pre-existing, unrelated untracked "Claude outputs/*.md" files. No commit or push has been made, per standing project convention — this EBC's implementation is complete and ready for staging/commit whenever you instruct it.

## 11. Final Verification — Public Site and Non-Workspace Routes Unaffected

Per the Product Owner's request before formal closure, this was verified **live**, not by code inspection alone: `npm run dev` was started locally and the following requests were made and confirmed, then the dev server was stopped and confirmed fully terminated (no orphaned process).

| Route | Result | Notes |
|---|---|---|
| `/` | `200` | Public homepage, unaffected |
| `/about` | `200` | Unaffected |
| `/destinations` | `200` | Unaffected |
| `/journey` | `200` | Unaffected |
| `/api/journey-passport/leads` (GET) | `405` | Identical to this route's pre-existing behaviour (POST-only) — not redirected, not touched by Workspace logic |
| `/workspace` (no session) | `307` → `/workspace/sign-in?redirectTo=%2Fworkspace` | Correct: unauthenticated Workspace access redirects to sign-in |
| `/workspace/sign-in` | `200` | Correct: reachable without a session, no redirect loop |

This testing is what actually found and fixed the issue described in Section 4: the matcher first shipped with this EBC ran `updateWorkspaceSession()` (and its Supabase network call) on every route site-wide, including all public pages and the existing `journey-passport` API. It never *redirected* a non-Workspace route — the redirect conditions in `session.ts` only ever fire for `/workspace/**` — but it did unnecessarily execute on every request. The matcher is now scoped to `["/workspace/:path*"]`, confirmed by the table above: every non-Workspace route returns exactly its pre-existing status code, with `proxy` not invoked for any of them.

One related observation, not a defect in this EBC's scope: `updateWorkspaceSession()` has no explicit error handling around the Supabase `getUser()` call. In this environment specifically, this repository's Supabase project domain is also network-blocked (confirmed via `curl`, `403` from the proxy, same restriction pattern as the Google Fonts block in Section 7) — yet `/workspace` still redirected cleanly to sign-in rather than throwing a 500, indicating the Supabase client itself degrades a failed `getUser()` call to "no user" rather than throwing. This has not been independently confirmed against Supabase's own documented guarantees, so it is recorded here as an observation for Keerthi's functional validation once a live Supabase connection is available, not asserted as a tested guarantee.

**Confirmation: the public website continues to function exactly as before, and Workspace route protection does not affect any non-workspace route.**

---

*Prepared by Rad (Engineering and Implementation Specialist) on behalf of Team Satvi, per `EBC-R1.3-WS11-007`.*
