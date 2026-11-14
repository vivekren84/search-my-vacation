# Supabase Environment Routing

**Status checked:** 2026-11-14

## Authoritative mapping

| Application environment | Supabase project | Project ref | Supabase URL |
|---|---|---|---|
| Vercel Production | `SearchMyVacation_WebsiteUpgrade` | `jbsefolhlfkplawiuvlu` | `https://jbsefolhlfkplawiuvlu.supabase.co` |
| Vercel Preview | `SMV-preprod` | `pkfdunyeaqdvvklutgon` | `https://pkfdunyeaqdvvklutgon.supabase.co` |
| Vercel Development | `SMV-preprod` | `pkfdunyeaqdvvklutgon` | `https://pkfdunyeaqdvvklutgon.supabase.co` |
| Local development | `SMV-preprod` | `pkfdunyeaqdvvklutgon` | `https://pkfdunyeaqdvvklutgon.supabase.co` |

Vercel Production has Production-only values for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_REF`, and `SUPABASE_SECRET_KEY`. Preview and Development have separate Pre-Prod values for those same variables. The application checks that `SUPABASE_PROJECT_REF` matches the Supabase URL hostname. No project URL is embedded in application code.

## Local setup

`web/.env.local` is git-ignored. From the linked `web/` project directory, populate it with the Development-scoped values using `vercel env pull .env.local --environment=development`. Confirm the URL's project ref matches `SUPABASE_PROJECT_REF` and is `pkfdunyeaqdvvklutgon`. If the local link points at another Vercel project, stop and link the intended project first. Do not commit `.env.local` or paste its contents into chat.

## Database CLI safety

Before any CLI migration, import, seed, or write:

1. Check the exact project ref and environment.
2. Use Pre-Prod for development and testing.
3. Review the planned changes before applying them.
4. Use Production only for an explicitly approved Production operation.

Do not trust a remembered `--linked` target. Verify the current link, or specify the intended project ref explicitly. Never run customer-data tests against Production.

## R1.3 branch rule

R1.3 work is paused pending product analysis and reassessment. When it resumes, start from the R1.2 `main` baseline and merge R1.3 work only on top of that baseline. Verify the `main` tip is the approved R1.2 code before branching. If `main` contains R1.3 commits, stop and resolve the branch baseline; do not force-reset `main` or merge the legacy R1.3 branches into it.

The current repository refs were not aligned with a pure R1.2 `main` at the time of this update: the observed `origin/main` already contains R1.3 commits. The environment-routing cleanup branch is based on R1.2 commit `622343d`; it does not change `main`.
