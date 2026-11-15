# Destination Intelligence Generator — Port to the R1.2 line

**Date:** 2026-11-15
**Branch:** `feature/r12-destination-intelligence-generator` (from `fix/supabase-environment-routing-r12` @ `9179050`)
**Source:** R1.3 commit `64fae42` — "feat(r1.3): implement Bootstrap Generator and Destination Intelligence engineering foundation"
**Archive of the full R1.3 line:** `archive/r1.3/ws13-milestone-b-4fbea68` (GitHub and local) and the local bundle `~/SMV-backups/r13-rebaseline-20261115/smv-all-refs-20261115.bundle`.

## Scope (Arjun)

| Item | Decision |
|---|---|
| Bootstrap Workbook / Generator tooling (offline, operator-run) | **Carried forward** |
| Knowledge-base region and geo-scope data (`kbApprovedRegions.ts`, `kbRegionGeoScope.ts`) | **Carried forward** (generator inputs) |
| Generator verification code and build configuration | **Carried forward** |
| Destination Ranking Refinement (`OBS-R1.3-WS3-01`, `FEAT-R1.3-009`) | **Not included.** Separate planned item. The generator does not change traveller-facing search ranking. |
| Traveller Stories, SMV Workspace (WS11/WS13) product, UX and engineering | **Remain archived** in R1.3 |
| Broader region content, AI enrichment, seasonal recommendations, later recommendation phases | **Remain separate future work** |

### Open decisions recorded for Destination Ranking Refinement (not decided here)

From the R1.3 workstream plan (Task 8.1): an architecture proposal exists (`ARCHIE-R1.3-WS3-01`, three-tier composite scoring). Before it can become an approved implementation card, two questions need Arjun/Tiger sign-off and Product Owner approval:

1. The place-type weight ladder.
2. Whether alias-exact and name-exact matches merge into one tier.

Any change to `search_geo_places` scoring is a traveller-facing ranking change and requires its own EBC.

## Files carried forward from `64fae42`

The 15 source files are byte-identical at `64fae42` and at the R1.3 tip `4fbea68`. Later R1.3 commits touched only `web/package.json`, and none of those later lines are carried.

- `web/lib/geo-validation/bootstrapRepository.ts` (modified for safety, see below)
- `web/scripts/bootstrap-workbook/{buildPlaces,buildTravelRegions,generateBootstrapWorkbook,readExistingWorkbook,types,writeReports,writeWorkbook,xlsxWriter}.ts` (`generateBootstrapWorkbook.ts` modified to read `SUPABASE_PROJECT_REF`)
- `web/scripts/bootstrap-workbook/verify/{createFixtureFetcher,fixtureGeoPlaces,verifyBootstrapGenerator}.ts` (verify modified, see below)
- `web/scripts/journey-intelligence/{kbApprovedRegions,kbRegionGeoScope}.ts`
- `web/tsconfig.bootstrap-workbook.json` (adds `lib/supabase/project.ts`)
- `web/package.json`: the two `64fae42` scripts (`build:bootstrap-workbook-generator`, `generate:bootstrap-workbook`), plus a new `verify:bootstrap-workbook` script.

## Environment-safety changes (Archie)

1. The hard-coded Production URL (`EXPECTED_SUPABASE_URL`) is removed.
2. The generator fails closed unless `SUPABASE_PROJECT_REF` is the Pre-Prod ref `pkfdunyeaqdvvklutgon` (`BOOTSTRAP_ALLOWED_PROJECT_REF`) **and** `NEXT_PUBLIC_SUPABASE_URL` matches it, using the shared `resolveSupabaseProjectUrl()`. The secret key stays server-only and is read from the environment only.
3. Read-only access is enforced in code, not only by convention. `get()` accepts only `/rest/v1/geo_places?…` and `post()` accepts only `/rest/v1/rpc/search_geo_places`. Any other path throws before a request is sent. `search_geo_places` is declared `STABLE` in its migrations, so Postgres rejects any write inside it.
4. `verifyBootstrapGenerator.ts` uses Pre-Prod fixtures and adds Check D. Check D covers: Production ref refused; Production URL with Pre-Prod ref refused; missing ref refused; missing key refused; every recorded request is a read-only call to the Pre-Prod origin.

## Operating rules

- Run only against Pre-Prod, with Development-scoped values in `web/.env.local`.
- The generator writes a local workbook and reports. It does **not** import workbook data into any database, and this port adds no import path.
- `npm run verify:bootstrap-workbook` runs fully offline against fixtures.
