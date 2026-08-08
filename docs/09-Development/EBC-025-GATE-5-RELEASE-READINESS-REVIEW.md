# EBC-025 — Gate 5: Release Readiness Review

**Persona:** Arjun — Release Manager & Operations Lead
**Date:** 08 Aug 2026
**Branch reviewed:** `main` @ `c0e657c` (0 commits ahead/behind `origin/main`)
**Review type:** Operational and business readiness only — read-only, no code modified, staged or committed. Gates 1–4 findings and Product Owner decisions were not reopened.

---

## Executive Summary

Search My Vacation Release 1 is operationally sound. Every business-critical channel — WhatsApp, callback form, Journey Passport lead capture, Journey Director recommendations, email notification, footer/legal — exists and is wired with deliberately durable failure handling: a traveller's lead is written to Supabase before any notification is attempted, so an email-provider outage never loses an enquiry. Git state is clean, fully merged, and in sync with `origin/main`.

The gaps found are operational hygiene, not product defects: four pieces of Gate 2–4 documentation exist only as uncommitted local files, the tip commit hasn't been independently confirmed with a full network-enabled production build, there's no branded error boundary for unexpected crashes, no error-tracking/alerting is wired in, and robots.txt/sitemap.xml are still missing (a gap first flagged in the 24 Jul baseline audit). None of these affect a traveller's ability to complete the core journey or reach a human.

**Release 1 is READY FOR GO/NO-GO REVIEW (Gate 6).**

---

## Section A — Repository & Release State

- **Branch:** `main`. **Remote sync:** 0 ahead / 0 behind `origin/main`.
- **Latest commit:** `c0e657c` — "fix: validate mobile number on Contact page callback form (DEF-G2-02)", 08 Aug 2026.
- **Working tree:** not clean — 4 untracked files, all documentation (`EBC-016-VALIDATION-REPORT.md`, `EBC-017A-JOURNEY-DIRECTOR-DEFECT-REPRODUCTION.md`, `GATE-4-PRODUCT-OWNER-REVIEW.md`, `EBC-024-GATE-4-PRODUCT-OWNER-ACCEPTANCE-REPORT.md`). No uncommitted code changes of any kind.
- **Merge status:** all feature branches (`ebc-003`, `ebc-015`, `ebc-017b`, `ebc-020`, `ebc-022`, `traveller-stories`) are fully merged into `main`; `git branch --no-merged main` returns nothing.
- **Release evidence:** a tag `v1.0-feature-complete` exists but points 15 commits behind the current HEAD — there is no tag marking this exact commit as a release candidate.

**Is this repository in a state suitable for deployment?** Yes, for code. The working tree has no uncommitted or unmerged code — only documentation is unstaged, and that documentation is itself part of what this Gate exists to verify is present.

## Section B — Production Deployment Readiness

- **Deployment target:** Vercel, confirmed by direct code reference (`process.env.VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` in `app/layout.tsx` and the lead/callback API routes). No `vercel.json` — not required for a standard Next.js App Router project on Vercel.
- **Environment variables:** the app requires `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `JOURNEY_LEAD_FROM_EMAIL`, `JOURNEY_LEAD_NOTIFICATION_EMAILS` (per `.env.example` and direct `process.env` usage). `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is declared in `.env.example` but not referenced anywhere in code — likely unused, worth a quick confirmation. **I cannot verify these are actually set in the live Vercel project** — that requires Vercel dashboard access this session doesn't have. Must be confirmed manually before go-live.
- **Build readiness:** `npm run lint` and `npx tsc --noEmit` both pass clean on the current tip commit (verified independently this session). A full `npm run build` could not be completed in this review environment because outbound access to `fonts.googleapis.com` (required by `next/font/google` for Inter and Poppins) is blocked by this sandbox's network policy — a limitation of this review environment, not a confirmed code defect. The most recent **full, network-enabled** clean build evidence on record is EBC-022's (commit `2396fe1`), one commit behind the current tip. The DEF-G2-02 commit on top of it is an 11-line change to a single form component with no new imports, so risk is low, but it has not been independently re-verified with a real build.
- **Domain/SSL:** Vercel provisions SSL automatically for both the default `*.vercel.app` domain and any attached custom domain. No custom-domain configuration is visible in-repo (expected — domain attachment is a Vercel dashboard action). Current DNS/domain-attachment state cannot be confirmed from the repository alone.
- **SEO baseline:** no `robots.txt` or `sitemap.xml` found anywhere in `app/` or `public/`. This gap was explicitly flagged in the 24 Jul baseline Release Readiness Audit and named as a required Day-5 deliverable in the Release Execution Plan; it does not appear to have been closed since.

**Can deployment happen safely?** Yes, with two confirmations outside this repo: production env vars are actually set in Vercel, and a preview deploy of this exact commit builds successfully in an environment with real network access.

## Section C — Business Operations Readiness

All confirmed present and wired:

- **WhatsApp:** `https://wa.me/918925838541` configured in `contact.config.ts`, used by both the Journey Director handoff and the Contact callback form.
- **Callback flow:** Contact page and Journey Director both submit through `processJourneyCallback`, which persists to Supabase and attempts a Resend notification independently.
- **Journey Passport lead capture:** `processJourneyLead` writes the lead to Supabase *before* attempting any notification — an email-provider outage cannot cause a lead to be lost.
- **Journey Director recommendations:** deterministic, config-driven engine; recommendation logic validated across the EBC-003/016/017 series.
- **Email notifications:** Resend-backed, with explicit `sent` / `failed` / `not-configured` status tracking per lead, decoupled from storage.
- **Footer:** phone (`+91 89258 38541 / 42 / 43`), email, full physical address (Chennai), office hours, Privacy Policy and Terms links, copyright line — complete.
- **Privacy Policy** and **Terms & Conditions**: both routes exist and are linked from the footer.

## Section D — Monitoring & Support

- **Graceful failure:** API routes wrap all external calls (Supabase, Resend) in try/catch and return an honest, on-brand fallback message ("We couldn't connect your Passport just yet. Your details are still here—please try once more.") rather than a raw error. Passport references are masked before logging.
- **Lead durability:** because storage happens before notification, a Resend or notification-layer failure degrades gracefully to a `failed`/`not-configured` status rather than losing the enquiry.
- **404 handling:** a custom `not-found.tsx` exists.
- **Gap — no top-level error boundary:** no `error.tsx` or `global-error.tsx` found anywhere in `app/`. An unhandled exception in a Server or Client Component would fall through to Next.js's generic default error screen instead of an on-brand page with a way to reach a human.
- **Gap — no error-tracking/alerting:** `package.json` has no error-monitoring SDK (e.g. Sentry). Production errors are only visible via `console.error` in Vercel's function logs, not proactively surfaced.
- **Rate limiting:** lead/callback endpoints are rate-limited, but the implementation is an in-memory `Map` — effective per warm serverless instance, not shared globally across Vercel's multi-instance model. Adequate for expected launch traffic, not a hardened abuse defence.
- **Support runbook:** none found. The root `README.md` is stale (still describes "Sprint 0 — Discovery & Foundation"); `web/README.md` is unmodified `create-next-app` boilerplate.

## Section E — Release Documentation

| Document | Status |
| --- | --- |
| Release notes | **Missing.** `docs/12-Release-Notes/` exists but is empty. |
| Brand alignment documentation | Present — EBC-022. |
| Engineering validation | Present — EBC-016 (uncommitted). |
| Functional / defect validation | Present — EBC-017A/B/C. |
| Traveller Experience validation | **Not located.** The Release Execution Plan names this as Sri's Workstream A4 deliverable, and EBC-016 explicitly notes Sri's findings were recorded separately — but no standalone document capturing them was found in the repository. |
| Product Owner acceptance | Present — EBC-024 Gate 4 Acceptance Report (uncommitted). |
| Release 1.1 backlog | Present — `docs/10-Backlog/RELEASE-1.1.md`. |

## Section F — Risk Register

**Critical Risks**

None identified. Nothing found would prevent a traveller from completing the core journey or would cause data loss.

**High Risks**

1. **Uncommitted release-record documentation.** Description: the Gate 2, 3 and 4 evidence (EBC-016, EBC-017A, both Gate 4 documents) exists only in the local working tree. Impact: if this working copy is lost or reset before committing, the audit trail for why Release 1 was approved is gone. Mitigation: commit these four files before Gate 6.
2. **Tip commit not independently build-verified.** Description: only lint and typecheck were confirmed on `c0e657c` this session; the last full production build evidence is one commit behind. Impact: small chance an undetected build issue reaches production. Mitigation: run a Vercel preview deploy of this exact commit and confirm it builds and serves before promoting to production.

**Medium Risks**

3. **No branded error boundary.** Impact: a rare unhandled crash shows a generic error screen instead of an on-brand page with a contact path, at the worst possible moment for trust. Mitigation: add a lightweight `error.tsx`.
4. **No error-tracking/alerting.** Impact: production issues are only discoverable by manually checking Vercel logs. Mitigation: add lightweight monitoring, or explicitly assign someone to check logs during the launch window.
5. **No robots.txt/sitemap.xml.** Impact: slower or incomplete search-engine indexing; no effect on direct or WhatsApp-referred traffic. Mitigation: add before or shortly after launch.
6. **No release tag at current HEAD.** Impact: harder to unambiguously identify "what shipped" later. Mitigation: tag the approved commit once Gate 6 clears.

**Low Risks**

7. **In-memory, per-instance rate limiting.** Impact: the 10-attempts/10-minutes limit isn't enforced globally across Vercel's serverless instances. Not a concern at expected launch volume. Mitigation: consider a shared store in Release 1.1 if abuse becomes an issue.
8. **Unused `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** declared in `.env.example`, referenced nowhere in code. Impact: none functionally. Mitigation: confirm intentional or remove.
9. **Stale README files.** Impact: no effect on the live product; affects onboarding clarity for future contributors. Mitigation: update post-launch.

## Section G — Rollback Readiness

- **Application layer:** Vercel keeps every deployment as an immutable, instantly promotable artifact — rolling back a bad deploy is a dashboard/CLI action, not a code change. This is Vercel's default behaviour; I cannot confirm from this repository whether it's been rehearsed on this specific project.
- **Git layer:** `main` is linear and fully merged; reverting to the pre-DEF-G2-02 commit or to `v1.0-feature-complete` is straightforward if ever needed.
- **Database (Supabase):** both migrations are explicitly authored as additive-only (`create table if not exists`, `add column if not exists`, both commented as such). Rolling back the application does not require a matching destructive database rollback — the new tables simply go unused.
- **Journey Director:** fully deterministic and config-driven with no external runtime dependency; a Journey Director issue is resolved the same way as any other app rollback — redeploy the previous build.
- **Email (Resend):** failures are already isolated by design — an outage degrades to a `failed` notification status without blocking lead capture. Not confirmed: whether failed notifications are ever retried/replayed once Resend recovers, or whether that gap is accepted.

**Can we roll back safely?** Yes, in all five scenarios listed in scope. The one open question is operational rather than technical: whether a Vercel rollback has actually been rehearsed by whoever holds deployment access.

## Missing Items (consolidated)

- Formal Release Notes document (`docs/12-Release-Notes/` is empty).
- Documented Traveller Experience (Sri) validation artifact.
- Branded `error.tsx` / `global-error.tsx`.
- Error-tracking/alerting integration.
- `robots.txt` / `sitemap.xml`.
- Release tag at the current HEAD commit.
- Four uncommitted documentation files (see Section A).
- Confirmation of live Vercel production environment variables (cannot be checked from this session).

## Section H — Executive Recommendation

**Release Readiness Score: 82 / 100**

**Overall Status: READY WITH ACCEPTED RISKS**

**Final Recommendation:** Search My Vacation Release 1 is operationally ready for public launch. The traveller-facing journey, lead capture, and human handoff are all durable and gracefully handle upstream failures. Nothing found rises to Critical. Two High items should be closed before Gate 6 — committing the four release-record documents, and confirming a fresh production build of the tip commit — both quick, non-code actions. The Medium and Low items (error boundary, monitoring, robots/sitemap, release tag, rate-limit scope, README hygiene) do not block Release 1 and are recommended for the Release 1.1 operational follow-up rather than delaying launch.

**Release 1 is READY FOR GO/NO-GO REVIEW (Gate 6).**
