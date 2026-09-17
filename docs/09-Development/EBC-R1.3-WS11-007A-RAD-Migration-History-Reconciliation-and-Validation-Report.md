# EBC-R1.3-WS11-007A — Supabase Migration History Reconciliation & Validation

**Persona:** Rad (Engineering and Implementation Specialist)
**Workstream:** WS-Eng-0 Closure Activity
**Status:** **Escalated — cannot be completed from any execution environment available to this session. Product Owner input required before Tasks 2–9 can proceed.**
**Repository root confirmed:** `/Users/viveksophu/Documents/Projects/SearchMyVacation`
**Branch:** `main`
**Date:** 16 September 2026

This report follows Project Instructions §34 (stop, capture the exact error, don't mask) and §28 (when a check cannot run, report the check, the reason, the residual risk, and the manual method). Nothing below is assumed; every claim is either quoted from a repository file or from a command actually run, with its exact output shown.

---

## 1. Repository Review (Mandatory Prerequisite — Completed)

Per the card's own instruction ("Review is mandatory before implementation"), the following were reviewed before any other action:

- `supabase/migrations/` — all 10 files present, listed in full in §4 below.
- `docs/20-Architecture/` — `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`, `ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`, and the `workspace/` subfolder.
- `docs/09-Development/` — including `EBC-009-JOURNEY-PASSPORT-LEADS.md`, the WS3 destination-search implementation series (`Release-1.2/WS3/R1.2-WS3-IMP-10` through `IMP-13`), `EBC-R1.2-WS5-03-RAD-Journey-Passport-OTP-Implementation.md`, and this workstream's own `EBC-R1.3-WS11-006` and `EBC-R1.3-WS11-007-RAD-Workspace-Foundation-Implementation-Report.md`.
- Git state: `git branch --show-current` → `main`; `git status --short` confirmed the working tree still holds exactly the uncommitted EBC-007 output (nothing has been committed — no git operation of any kind was authorised or performed in this task).

## 2. Environment Verification — "Current Evidence" Re-Tested, Not Assumed

The card's own §6 lists five evidence items. Task 2 explicitly requires "No assumptions shall be made… Evidence shall be collected" — so each was independently re-tested rather than taken on faith.

| Card's claim | Independently verified? | Result |
|---|---|---|
| Hosted project linked | Partially re-tested | `supabase/.temp/linked-project.json` confirms a prior `supabase link` was run against `jbsefolhlfkplawiuvlu` ("SearchMyVacation_WebsiteUpgrade"). **New observation:** a second, duplicate link-state directory exists at `supabase/supabase/.temp/` (see §5.1) — both point to the same project, but the duplication itself was not previously documented. |
| Supabase CLI operational | Re-tested | **Not pre-installed** (`supabase --version` → `command not found`). **Confirmed operational on demand**: `npx -y supabase@2.117.0 --version` → `2.117.0`. So the CLI itself works once invoked via `npx`; "operational" is true, but not as a standing binary. |
| `geo_places` / `geo_aliases` exist live | **Not independently re-verified by Rad** | This claim in the card is inherited from prior product/architecture review, not from a query Rad ran — because, as shown in §3, no path from this session can reach the live database at all. This is flagged, not assumed to still hold. |
| Workspace migration exists locally | Confirmed | `supabase/migrations/20260916090000_workspace_users_and_roles.sql` reviewed in full — see §4.6. |
| Migration history incomplete | Not independently re-queryable | Same blocker as above — Rad cannot run `supabase migration list --linked` (see §3) to see the live `schema_migrations` contents directly. |

## 3. Escalation — Live Supabase Connectivity Is Unavailable From Every Environment Available To This Session

This is the central finding of this report and the reason Tasks 2–4 and 6–9 cannot proceed today.

**Both** execution surfaces available to Rad in this session were tested, independently, with direct evidence:

**A. The device-bridge shell (`device_bash`, running on the connected Mac inside its own Linux VM):**

```
$ curl -sS -m 8 -o /dev/null -w "HTTP_STATUS:%{http_code}\n" https://jbsefolhlfkplawiuvlu.supabase.co/rest/v1/
curl: (56) Received HTTP code 403 from proxy after CONNECT

$ curl ... https://api.supabase.com
curl: (56) Received HTTP code 403 from proxy after CONNECT

$ curl ... https://supabase.com
curl: (56) Received HTTP code 403 from proxy after CONNECT

$ timeout 6 bash -c 'echo > /dev/tcp/aws-1-ap-northeast-2.pooler.supabase.com/5432'
bash: aws-1-ap-northeast-2.pooler.supabase.com: Temporary failure in name resolution
```

Every path is blocked: the project's own REST domain, Supabase's Management API (needed by `supabase login` / `supabase link` / `supabase migration list --linked`), the marketing/docs domain, and even a raw TCP/DNS attempt at the Postgres connection pooler (the address cached from a previous, successful `supabase link`, found in `supabase/.temp/pooler-url`). Only `registry.npmjs.org` is reachable from this shell — which is why the CLI binary itself could be fetched via `npx`, but nothing it does afterwards against Supabase can succeed.

Consistent with this, running the CLI itself against the linked project fails exactly as the network evidence predicts:

```
$ npx -y supabase@2.117.0 migration list --linked
Access token not provided. Supply an access token by running `supabase login`
or setting the SUPABASE_ACCESS_TOKEN environment variable.
```

No `SUPABASE_ACCESS_TOKEN` exists in this shell's environment, and `supabase login`'s interactive browser OAuth flow has no browser to open in a headless shell — a second, independent blocker on top of the network restriction.

**B. This session's own cloud sandbox (a separate machine from the connected Mac):**

```
$ curl -sS -m 8 ... https://supabase.com
curl: (56) CONNECT tunnel failed, response 403
[agent-proxy] connect_rejected (the egress proxy denied the CONNECT (organization policy) or could not reach the destination)
```

Identical result for `api.supabase.com` and the project domain. This rules out simply "running it from the other side" — the restriction is present on both machines available to this session, and on the cloud side it is explicitly reported as an **organization policy** decision, not a transient fault.

**What this means for the card's remaining tasks:** Task 2 (validate live DB state), Task 3 (document status per migration from direct evidence), Task 4 (root-cause with evidence), Task 6 (apply the officially-supported reconciliation), Task 8 (apply the Workspace migration) and Task 9 (post-migration validation) all require a live connection to the Supabase project that does not exist in this session, on either available machine. This is an environment/network boundary, not a code defect, and — per the card's own instruction — it is being reported rather than worked around. No workaround was attempted (no credential was requested, no alternate endpoint was tried, no attempt was made to bypass the proxy).

## 4. Task 1 — Migration-by-Migration Review (20260823150000 → 20260916090000)

All six migrations in the card's stated range were read in full. None alters or duplicates any other object; each is additive, matching this repository's own stated convention ("this project's own established convention for a post-hoc correction is a new, additive migration… not editing history" — comment in §4.3 below).

### 4.1 `20260823150000_geo_places_geo_aliases.sql`
Creates `public.geo_places`, `public.geo_aliases`, and `search_geo_places()` (ranked prefix/trigram destination search). Enables `pg_trgm`/`unaccent` extensions, two GIN trigram indexes, RLS on both tables with all privileges revoked from `anon`/`authenticated` and granted only to `service_role`. Purely additive; creates no rows (data population is a separate out-of-band script).

### 4.2 `20260826120000_fix_send_journey_passport_otp_ambiguous_resend_count.sql`
`create or replace function public.send_journey_passport_otp(...)`, fixing Postgres error 42702 by fully qualifying two `RETURNING … INTO` references that were ambiguous between a PL/pgSQL output variable and a real table column of the same name. No signature, return-shape, or business-behaviour change — a two-line syntax disambiguation only.

### 4.3 `20260827150000_fix_verify_journey_passport_otp_ambiguous_verification_token.sql`
Same bug class as 4.2, in the sibling function `verify_journey_passport_otp()`. One `RETURNING` clause qualified. No behavioural change.

### 4.4 `20260829130000_fix_search_geo_places_trgm_index_usage.sql`
Adds an immutable `unaccent` wrapper function plus two new expression-based GIN indexes matching what `search_geo_places()` actually filters on, then `create or replace`s that function so its `WHERE` clauses use the GIN-accelerated `%` operator instead of a bare `similarity(...) > 0.3` call (which could never use an index). Old bare-column indexes are left in place, untouched. One disclosed, narrow behavioural nuance: `%` matches at `similarity ≥ 0.3` versus the old strict `> 0.3` — a boundary-only widening, flagged in the migration's own comments as something to verify, not glossed over.

### 4.5 `20260830013000_search_geo_places_dynamic_planning_rewrite.sql`
Rewrites `search_geo_places()` from `LANGUAGE SQL` to `LANGUAGE PLPGSQL`, executing the query as dynamic SQL (`format(...)`/`%L`) so each call is freshly planned against the real search term instead of an opaque parameter — fixing a generic-plan performance regression. Signature, return columns, ranking formula, and ordering are byte-identical to the prior version; only the planning mechanism changes. SQL-injection safety is explicitly addressed in-file (`%L` literal-quoting for all user-derived values). Includes its own documented rollback path (revert to 4.4's `LANGUAGE SQL` version).

### 4.6 `20260916090000_workspace_users_and_roles.sql`
The new migration from EBC-R1.3-WS11-007. Creates `public.workspace_users` (one row per Auth-linked Workspace staff account, `role` constrained to `administrator`/`privilege_user`), an `updated_at` trigger, RLS enabled with all privileges revoked from `anon`/`authenticated` except a bare `select` grant to `authenticated`, a `security definer` helper `workspace_current_user_role()` (avoids RLS self-recursion), and two `select`-only RLS policies (`_select_own`, `_select_administrator`). No `insert`/`update`/`delete` policy is created — provisioning is deliberately out of scope (WS-Eng-1), matching EBC-007's approved scope. This is the only migration of the six not yet reviewed in a prior EBC — reviewed here for the first time end-to-end and confirmed to still match what EBC-007's report described; **content unchanged since EBC-007**.

None of the six requires any action beyond what is already described in this section — Task 1 is complete.

## 5. Root Cause Analysis (Repository-Evidence-Based)

The card requires this to be evidence-based, "not merely theorised." The following is built entirely from what this repository's own documents say about *how* each migration was historically applied — no live database query was needed to establish the mechanism, only to confirm its final effect (which remains outstanding, per §3).

### 5.1 A secondary, minor observation first (not the root cause)

`supabase/.temp/` and a duplicate, nested `supabase/supabase/.temp/` both exist locally, both linked to the same project (`jbsefolhlfkplawiuvlu`). Both are already correctly git-ignored (`.gitignore` lines 55–57) and hold no committed content — this is local CLI cache only, most likely created by running `supabase link` once from the repository root and once, by mistake, from inside the `supabase/` directory itself. It carries no data-loss risk and does not itself explain the schema_migrations gap; it is recorded here only as a repository-hygiene observation for Archie/Tiger, not acted on.

Separately: **no `supabase/config.toml` has ever existed in this repository's git history** (`git log --all -- "supabase/config.toml" "**/config.toml"` returns nothing). This is unusual for a Supabase CLI project but is not gitignored — it appears the project has always operated via `supabase link`'s cached state rather than a committed `config.toml`. Noted for Archie's awareness; not a cause of the migration-tracking gap.

### 5.2 The actual root cause: a documented mid-project change in how migrations were executed

**`docs/09-Development/EBC-009-JOURNEY-PASSPORT-LEADS.md`** (the implementation document for the *first* migration, `20260802130000_journey_passport_leads.sql`) gives this explicit, CLI-based apply instruction:

> "Apply it only after securely linking the Supabase CLI to project reference `jbsefolhlfkplawiuvlu` and reviewing the dry-run output. A safe operator sequence from the repository root is:
> ```
> npx supabase link --project-ref jbsefolhlfkplawiuvlu
> npx supabase db push --dry-run
> npx supabase db push
> ```"

`supabase db push` is a CLI-mediated apply — it writes to `supabase_migrations.schema_migrations` as part of applying the SQL. This is consistent with that migration (one of the four currently tracked) appearing in the history table.

By contrast, **`docs/09-Development/Release-1.2/WS3/R1.2-WS3-IMP-13-RAD-Destination-Search-Dynamic-Planning-Rewrite.md`** — the implementation document for `20260830013000_search_geo_places_dynamic_planning_rewrite.sql`, one of the six migrations in this card's scope — gives a **different** instruction:

> "**Ready for you to apply**, same standard method already established in this workstream (**paste and run the complete file once in the Supabase SQL Editor**)."

The phrase "same standard method already established in this workstream" indicates this was already the convention before IMP-13, i.e. for the whole WS3 destination-search series — which includes `20260823150000_geo_places_geo_aliases.sql` itself. `20260829130000_fix_search_geo_places_trgm_index_usage.sql` contains a matching in-file comment referencing "this project's own established... execution convention," corroborating the same pattern. `docs/09-Development/EBC-R1.2-WS5-03-RAD-Journey-Passport-OTP-Implementation.md` (covering the two OTP `fix_*` migrations) similarly asks "you (or Vivek) to run the SQL" directly, rather than instructing a CLI push.

**Conclusion:** at some point after the first migration, this project's working convention shifted from CLI-mediated `supabase db push` to pasting each migration file's SQL directly into the Supabase Dashboard's SQL Editor and running it once. Executing SQL through the Dashboard SQL Editor applies it to the live database correctly, but — this is documented, standard Supabase CLI behaviour, not a defect of this project's tooling — it does **not** insert a row into `supabase_migrations.schema_migrations`, because that table is maintained exclusively by the CLI's own apply/push commands. This fully explains, with a documented and consistent evidentiary trail (three independent implementation documents), why exactly the first four migrations are tracked and every migration from `20260823150000` onward is not: it tracks precisely the point where the documented execution method changed. No data loss, corruption, or defect is indicated by this evidence.

This explains the **mechanism**. It does not, by itself, prove that every one of the five untracked migrations was in fact run to completion exactly once with no partial failure — that final confirmation is Task 2/3's job and requires the live query that §3 shows is currently unreachable.

## 6. Migration Status Matrix

Per the card's four allowed statuses (Applied / Partially Applied / Not Applied / Cannot Determine), applied honestly given the blocker in §3:

| Migration | Intended outcome (§4) | Formally confirmed live status |
|---|---|---|
| `20260802130000_journey_passport_leads.sql` | `journey_passport_leads`/`journey_passport_events` tables | Out of this card's stated range (already tracked) — not re-verified |
| `20260803120000_journey_passport_callbacks.sql` | Callback handling | Out of range — not re-verified |
| `20260822090000_journey_passport_otp_challenges.sql` | OTP challenge table | Out of range — not re-verified |
| `20260822090500_journey_passport_leads_e164_backfill.sql` | `mobile_e164` column | Out of range — not re-verified |
| `20260823150000_geo_places_geo_aliases.sql` | `geo_places`/`geo_aliases`/`search_geo_places()` | **Cannot Determine** by Rad in this session (no live query path). Strong documented circumstantial evidence (§5.2) that it was applied via the Dashboard SQL Editor and is live; the card's own §6 already asserts these tables exist, but that assertion pre-dates this task and was not independently re-run by Rad. |
| `20260826120000_fix_send_journey_passport_otp_ambiguous_resend_count.sql` | Qualify ambiguous `resend_count` reference | **Cannot Determine** — same reasoning |
| `20260827150000_fix_verify_journey_passport_otp_ambiguous_verification_token.sql` | Qualify ambiguous `verification_token` reference | **Cannot Determine** — same reasoning |
| `20260829130000_fix_search_geo_places_trgm_index_usage.sql` | Expression indexes + trigram-accelerated search | **Cannot Determine** — same reasoning |
| `20260830013000_search_geo_places_dynamic_planning_rewrite.sql` | PLPGSQL dynamic-planning rewrite | **Cannot Determine** — same reasoning |
| `20260916090000_workspace_users_and_roles.sql` | `workspace_users`, RBAC helper, RLS policies | **Not Applied** — confirmed not yet run against any live database; exists only as a local file, reviewed and ready (§4.6) |

Rad is not willing to upgrade any of the five "Cannot Determine" rows to "Applied" on documentary inference alone — the card explicitly requires evidence collected directly against the live database, and none could be collected in this session. This is a deliberately conservative, honest position, not an oversight.

## 7. Reconciliation Plan — Ready To Execute, Officially-Supported Workflow (Not Yet Run)

Prepared from Supabase's own official CLI reference and deployment guide (sources below), so that whoever can reach the live project can execute it directly with no further research needed. Every step here is CLI-mediated and metadata-only except the final migration apply — nothing hand-edits `supabase_migrations.schema_migrations` directly, satisfying the card's explicit prohibition on that.

1. **Authenticate and link** (from a machine/network that can reach `api.supabase.com` and `supabase.com`):
   ```
   npx supabase login
   npx supabase link --project-ref jbsefolhlfkplawiuvlu
   ```
2. **Get the authoritative current history table state** (this is Task 2's required direct evidence — not yet obtained by anyone in this thread):
   ```
   npx supabase migration list
   ```
   This lists local migration files against what the remote `schema_migrations` table actually contains, side by side.
3. **For each of the five migrations confirmed present in the live schema but missing from the history table**, repair the tracking record only — per Supabase's own documentation, "`migration repair` updates the tracking table only — it does not apply or revert any SQL":
   ```
   npx supabase migration repair --status applied 20260823150000
   npx supabase migration repair --status applied 20260826120000
   npx supabase migration repair --status applied 20260827150000
   npx supabase migration repair --status applied 20260829130000
   npx supabase migration repair --status applied 20260830013000
   ```
   Each of these five should first be confirmed individually present and correct in the live schema (e.g. via the Dashboard's Table Editor / SQL Editor `\d` equivalent, or `supabase db diff`) before it is marked `applied` — do not repair a migration whose live effect has not actually been confirmed.
4. **Re-run `supabase migration list`** to confirm the history table now matches the repository's own migration files exactly, with only `20260916090000_workspace_users_and_roles.sql` remaining unapplied.
5. **Only then**, apply the Workspace migration through the CLI so it is correctly tracked from the start:
   ```
   npx supabase db push --dry-run
   npx supabase db push
   ```
6. **Post-migration validation**: confirm `public.workspace_users` exists with RLS enabled, confirm `workspace_current_user_role()` exists as `security definer`, confirm both `select` policies exist, and provision one test `workspace_users` row (via the dashboard, service-role key) to functionally verify EBC-007's sign-in flow end-to-end — exactly as EBC-007's own report already flagged as an outstanding manual step.
7. **Production build validation**: `npm run build` from a normal local terminal with unrestricted network access (needed regardless of Supabase, to reach `fonts.googleapis.com` — the pre-existing, unrelated restriction already documented in EBC-007 §7/§8).

*Sources consulted: [Supabase CLI reference — `migration repair`](https://supabase.com/docs/reference/cli/supabase-migration-repair), [Supabase Docs — Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations).*

## 8. What Is Needed To Proceed

Rad cannot execute any part of §7 from this session — neither the connected Mac's device shell nor this session's own cloud sandbox can reach `supabase.com`, `api.supabase.com`, or the project's `*.supabase.co` domain (§3), and no interactive login is possible in a headless shell either way. Two options, for the Product Owner to choose between — Rad is not recommending one over the other, both are legitimate:

- **Option A:** Vivek (or another team member with terminal + Supabase CLI access) runs the exact commands in §7 themselves, in order, and shares the output of steps 2 and 4 back with Rad. Rad then documents the confirmed result and can prepare the exact commit/PR for the workspace migration's presence in the repository (the file itself needs no further code change).
- **Option B:** if organisational network/device policy permits, this session's egress allowlist (or the connected Mac's) is extended to include `supabase.com`, `api.supabase.com`, and `*.supabase.co`, and a `SUPABASE_ACCESS_TOKEN` is supplied through a secure mechanism outside chat (never pasted into this conversation, per Project Instructions §25's secret-handling rules), after which Rad can run §7 directly and report the results in the same manner as the rest of this EBC's evidence-based reporting.

No destructive operation, no unsupported operation, and no data-loss risk is presented by either option — this escalation exists purely because of an environment/network boundary, and is raised now rather than guessed around, per the card's own explicit instruction.

## 9. Deliverables Status

| Deliverable | Status |
|---|---|
| Migration Reconciliation Report | This document — plan ready, execution blocked (§3, §8) |
| Root Cause Analysis | **Complete** — §5, fully evidence-based from repository documents |
| Validation Evidence | **Blocked** — requires live DB access not available in this session |
| Migration Status Matrix | **Complete as far as possible** — §6; five rows honestly marked Cannot Determine pending live confirmation |
| Build Validation Summary | **Not yet run** — depends on steps in §7 completing first, per the card's own sequencing |
| Git Status Summary | Unchanged since EBC-007: working tree still holds only the uncommitted EBC-007 output; nothing has been committed or pushed in this task |

## 10. Git Status

```
On branch main
 M web/package-lock.json
 M web/package.json
?? docs/09-Development/EBC-R1.3-WS11-007-RAD-Workspace-Foundation-Implementation-Report.md
?? supabase/migrations/20260916090000_workspace_users_and_roles.sql
?? web/app/workspace/
?? web/lib/workspace/
?? web/proxy.ts
(+ several pre-existing untracked "Claude outputs/" review documents, unrelated to this task)
```

This report itself (`EBC-R1.3-WS11-007A-RAD-Migration-History-Reconciliation-and-Validation-Report.md`) will also appear as untracked once written to the repository. No `git add`, `git commit`, or `git push` has been run — none was authorised for this task.

## 11. Closing Statement

This card is **not closed**. Tasks 1, 4 (root cause), and the repository-side halves of 5 and 7 (planning) are complete and evidence-based. Tasks 2, 3, 6, 8, and 9 are blocked on live Supabase connectivity that does not exist anywhere in this session, confirmed by direct, reproducible evidence rather than assumed. Rad is not proceeding further, is not attempting a workaround, and is not marking any live-database claim as confirmed without having queried it — per the card's own explicit standard. EBC-R1.3-WS11-008 remains gated on this card's closure, which in turn is gated on the Product Owner's choice in §8.
