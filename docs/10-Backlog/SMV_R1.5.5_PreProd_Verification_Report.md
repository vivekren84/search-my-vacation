# Search My Vacation (SMV) — Release 1.5.5 Pre-Prod Verification Report

- **Date:** 2026-11-28 (IST)
- **Git Branch:** `main` (merged from `feature/release-1.5.5-ops-radar-crm-hygiene`)
- **Pre-Prod Supabase Project:** `pkfdunyeaqdvvklutgon` (`https://pkfdunyeaqdvvklutgon.supabase.co`)
- **Migrations Applied:**
  1. `20261201000000_r155_m1_db_hygiene.sql` (Destinations master, normalization, multi-contact JSONB, vendor GST columns, IST yearly Trip ID alignment & preview RPC)
  2. `20261202000000_r155_m2_ops_automation.sql` (`In Travel` stage, `promote_due_trips_to_in_travel()`, `pg_cron` `00:05 IST` schedule)
  3. `20261203000000_r155_m5_login_circuits_copy.sql` (`portal_login_banners`, `regional_circuits`, DB copy hygiene)

---

## Automated Build, Smoke & Regression Results (on `main`)

| Suite / Command | Scope | Result |
| :--- | :--- | :--- |
| `supabase db push` | Pre-Prod schema parity (`pkfdunyeaqdvvklutgon`) | **Passed** (`Remote database is up to date.`) |
| `npm --prefix web run build` | Next.js 16.2.10 production build + TypeScript | **Passed** (`49/49` pages generated, `exit 0`) |
| `node web/scripts/smoke-test-r1.5.1.mjs` | Migrations, Profile Governance, Theme Parity, Brand Tone (`0` prohibited term), `BOUND-01` | **Passed** (`46/46` checks) |
| `node web/scripts/verify-r15-governance.mjs` | Super Admin locks, OTP guardrails, Staff Invite, Claude integration, Brand Tone | **Passed** (`19/19` checks) |
| `npm --prefix web run verify:r1.4-milestone-4` | Passport Synopsis Teaser, `BOUND-01`, OTP test-double suite | **Passed** (`77/77` checks) |
| `npm --prefix web run verify:journey-leads` | Client Passport Lead validation & repository contract | **Passed** (`109/109` checks) |
| EPIC 7 Destination-First Unit Check | `Dalhousie` → Western Himachal; `Kumbhalgarh` → Aravalli/Rajasthan; `Zermatt` → Dynamic bespoke circuit | **Passed** (`3/3` checks) |
| EPIC 8 Copy Hygiene Audit | Repo-wide case-insensitive scan for `aetelier` and `bespoken` | **Passed** (`0` matches) |

---

## Next Step
- Awaiting stakeholder approval for **Production** (`jbsefolhlfkplawiuvlu`) migration & Vercel Production promotion.
