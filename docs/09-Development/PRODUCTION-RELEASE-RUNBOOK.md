# Production Release Runbook — manual, staged, Product Owner only

**Status:** Active from 2026-11-15
**Authority:** Only Vivek (Product Owner) may start a Production build or promote a deployment to Production. Team Satvi personas, Claude/Liger, CI, bots, deploy hooks and other automations must never run any step in Part B or Part C.

## Part A — Safeguards that are in place

| Safeguard | Where | Effect |
|---|---|---|
| `git.deploymentEnabled.main = false` | `web/vercel.json` (committed on `main`) | A Git push or merge to `main` (the Vercel Production branch) does **not** create a deployment. Every other branch still gets an automatic Preview deployment. |
| No deploy hooks, webhooks, GitHub Actions, `vercel.json` deploy commands or deploy scripts | Vercel project settings and repository (checked 2026-11-15) | No automatic Production build or promotion path exists. |
| Preview environment isolated | Vercel environment variables | Preview uses Pre-Prod Supabase only and has no SMS (MSG91) or Resend credentials. OTP and lead-notification email therefore cannot send from Preview. |

**Keep `web/vercel.json` intact.** The setting is read from the commit being deployed, so a commit to `main` that removes or changes it would re-enable Git-triggered Production builds. Treat any change to that file as a Production-release decision for Vivek.

## Part B — Staged Production build (Vivek only)

1. Confirm the release scope: the reviewed commit on `main`, release notes, Archie/Keerthi/Sri sign-offs, and any required Production database migrations (applied separately, by Vivek, after their own review).
2. On your own machine, in a clean checkout of `main` at the approved commit, with the Vercel CLI logged in as you and the project linked (`vercel link`, choosing `search-my-vacation`), run from the project's linked directory:

   ```bash
   vercel deploy --prod --skip-domain
   ```

   This builds a **Production-environment** deployment using Production environment variables. `--skip-domain` stops `www.searchmyvacation.com`, `searchmyvacation.com` and `search-my-vacation-preprod.vercel.app` from moving to it, so the live site is unchanged.
3. Note the deployment URL the CLI prints. Review it privately: smoke pages, Journey Passport, destination search and runtime logs. It is still behind Vercel Authentication.

## Part C — Promote (Vivek only)

4. When satisfied, promote that exact deployment:

   ```bash
   vercel promote <deployment-url>
   ```

   Promoting a staged Production deployment assigns the Production domains without rebuilding.
5. Verify the live domains and Production runtime logs.
6. If needed, roll back to the previous Production deployment:

   ```bash
   vercel rollback <previous-deployment-url-or-id>
   ```

**Do not** promote a *Preview* deployment directly. Vercel rebuilds a promoted Preview with Production variables, which skips the staged review in Part B.

## Records

Record each release (commit SHA, deployment ID, who promoted it, when) in the release notes.
