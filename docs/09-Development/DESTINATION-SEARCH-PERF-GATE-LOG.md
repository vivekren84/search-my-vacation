# Destination Search Performance — Gate Log (2026-11-15)

**Coordinator:** Tiger · **Design:** Archie · **Implementation:** Rad · **Validation:** Keerthi
**Database target (only):** Pre-Prod `pkfdunyeaqdvvklutgon` (SMV-preprod). Production `jbsefolhlfkplawiuvlu` was not accessed.

## G1 — Starting state (Tiger)

| Item | Value |
|---|---|
| Candidate | `release/r12-clean-main-candidate` @ `f9f0e383724479f31a174c21860c1cb381f9942d` |
| Candidate Preview | `dpl_DpfaWD7bMx3HJwo2881AWQ5Uu7QW` (Ready, Preview) |
| Pre-Prod function before | `search_geo_places` md5 `cbf7ddcf364b594056ed56c6af4c77ac` (= `20260830013000`), `statement_timeout=2000` |
| GitHub `main` | `63b6ddc`, unchanged throughout |
| Feature branch | `perf/compact-destination-search-r12` from `f9f0e38`; commits `9e94e23` (migration, rollback, design) and this log |
| Local repositories | Not touched; the routing worktree's uncommitted work is preserved |

## G2 — Design (Archie)

See `DESTINATION-SEARCH-PROJECTION-DESIGN.md`.

- **Finding:** `unaccent` costs about 7 µs per row, so most of the cost is per-candidate heap work across the wide `geo_places` rows plus the second `geo_aliases` scan.
- **Decision:** a compact projection `geo_search_terms` storing the normalised text, synced by statement-level triggers and FK cascades, with an unchanged RPC contract.
- **Prototype:** an A/B test in a rolled-back transaction confirmed the benefit before any code was written.

## G3 — Implementation (Rad)

| Item | Detail |
|---|---|
| Migration | `supabase/migrations/20261115120000_geo_search_terms_projection.sql` (sha256 `9a1eb32f…336a`, md5 `a71b6c15…1b85`) |
| Rollback | `supabase/rollbacks/20261115120000_geo_search_terms_projection.rollback.sql`. Restores the function body byte-for-byte (md5 `cbf7ddcf…`), drops triggers, trigger functions and the projection, and deletes the history row. |
| Existing migrations | Not edited |
| Existing indexes | Not dropped. All four `geo_places` / `geo_aliases` trigram indexes are retained. |
| Importer | No change needed. Its PostgREST upserts fire the sync triggers. |

**Defect caught before apply.** The first rolled-back dry run showed that `service_role` could write the projection, because Supabase's default privileges grant ALL on new tables. The fix revokes from `service_role` too and grants SELECT only. The trigger functions also have EXECUTE revoked from all API roles.

## G4 — Pre-apply evidence (Keerthi)

- **Prototype parity:** identical place IDs, order, scores and counts for goa, dubai, bali, bombay (alias) and banglore (typo). In the prototype's exact-row comparison, `matched_alias` differed only on exact-score ties. The original `DISTINCT ON` has no tie-breaker, so the tied choice is unspecified in both versions. `matchedAlias` is not shown in the UI.
- **Migration dry run:** the exact committed file executed in **121.6 s** inside a forced-rollback transaction. The resulting function md5 was `19f5c87f9122d7d055c02422fa93ff69`.
- **Clean-up check:** after every rolled-back run, Pre-Prod showed no projection, the original function md5, no triggers and no synthetic rows.

## G5 — Apply and verification (Pre-Prod only)

**Target verified from the tool output** before applying: SQL editor URL `/project/pkfdunyeaqdvvklutgon/`, title "SMV-preprod". The applied text was byte-identical to the committed file (sha256 checked).

**Applied** in a single transaction, with the history row `20261115120000 geo_search_terms_projection` recorded (statement md5 = file md5 `a71b6c15…`).

| Check | Result |
|---|---|
| Function | md5 `19f5c87f…`; `plpgsql`, `STABLE`, `SECURITY INVOKER`, `statement_timeout=2000`; ACL `postgres=X, service_role=X`; signature and result columns unchanged |
| Projection | 718,091 rows = 594,542 places + 123,549 aliases; 0 mismatched name rows, 0 mismatched alias rows; RLS on; ACL `service_role=r` |
| Triggers | 4 statement-level triggers; 4 `SECURITY DEFINER` functions with `search_path=""` |
| Storage | 40 MB heap, 121 MB with indexes; database 222 MB → 343 MB (Free plan limit 500 MB) |
| T1, sync and permissions (rolled back) | 9/9 pass: place insert; upsert rename; alias insert with accent removal; alias update; alias delete cascade; place delete cascade; `service_role` can execute the search; `service_role` cannot write the projection; `anon` cannot execute the search |
| T2, tie-aware parity (rolled back) | All 5 terms: 8/8 rows; IDs and order equal; scores equal; each returned alias is within the original's deterministic tied best set |
| T3, rollback rehearsal (itself rolled back) | Function md5 back to `cbf7ddcf…` with the same ACL; projection, triggers, sync functions and history row all removed; search still returns 8 rows |

### Query plans: old function query → applied projection query (EXPLAIN ANALYZE, BUFFERS)

| Term | Heap blocks | Rows removed by recheck | Heap scan time | Execution |
|---|---|---|---|---|
| goa | 2,493 + 327 → **2,012** | 5,806 → 5,806 | 64 + 12 → **18 ms** | 78 → **19 ms** |
| dubai | 3,312 + 476 → **2,519** | 8,260 → 8,260 | 95 + 16 → **31 ms** | 112 → **32 ms** |
| bali | 7,096 + 829 → **4,011** | 30,570 → 30,570 | 356 + 50 → **96 ms** | 412 → **105 ms** |
| bombay | 732 + 84 → **682** | 1,103 → 1,103 | 18 + 4 → **9 ms** | 23 → **10 ms** |
| banglore | 3,054 + 285 → **2,033** | 8,798 → 8,798 (prototype) | 109 + 17 → **41 ms** | 128 → **42 ms** |

The recheck counts are identical: the candidate set is unchanged, so matching semantics are unchanged. Heap blocks fell 16–49%, and heap-scan time fell 59–76%.

### Database timings (real function, Pre-Prod), first call → warm

| Term | Old query, first call | New function |
|---|---|---|
| goa | 2,227 ms | 28 → 20 → 20 ms |
| dubai | 2,241 ms | 949 → 32 → 32 ms |
| bali | 4,666 ms | 2,461 → 321 → 105 ms |
| bombay | 631 ms | 66 → 12 → 10 ms |
| banglore | 4,104 ms | 1,418 → 61 → 45 ms |

The new-function first calls ran immediately after the 122 s migration, which had evicted cache. Bali's 2,461 ms first call is a cold-cache cost on the Free instance.

### Preview route timings (browser → Vercel route → Pre-Prod)

**Before:** candidate Preview `dpl_DpfaWD7…` with the old function. The database was warm from testing; earlier the same day, cold runs returned **503** (Supabase `57014`) for Goa, Dubai, Manali, Bali and Paris.

| Term | Call 1 | Call 2 | Call 3 |
|---|---|---|---|
| Goa | 2,546 | 1,351 | 1,229 ms |
| Dubai | 1,271 | 1,211 | 1,228 ms |
| Bali | 1,530 | 1,967 | 1,837 ms |
| Bombay | 1,058 | 1,681 | 1,916 ms |
| Banglore | 1,669 | 1,272 | 1,458 ms |

Warm p95 before: about 1,967 ms.

**After:** feature Preview `dpl_GoS1cdEtk7htf75PbPDB4sf4Z2Jr`. Ready, Preview target, built from commit `9e94e23`.

| Measurement | Result |
|---|---|
| First calls (new deployment, cold function start) | Goa 4,361 · Dubai 2,810 · Bali 2,827 · Bombay 1,177 · Banglore 775 ms; all 200 |
| Never-searched terms (cold path) | Shimla 1,396 · Pondicherry 1,153 · Kyoto 640 · Lisbon 1,291 · Zanzibar 1,115 ms; all 200 |
| Warm, 15 calls | all 200; **p50 1,075 ms, p95 1,245 ms**, max 1,245 ms |
| Route overhead (no-database control query "G") | about 278 ms |
| 503 / `57014` on this deployment | **0** (runtime logs: no error entries) |

**Database ref proven** for the new Preview: Pre-Prod's `pg_stat_statements` counter for the PostgREST `search_geo_places` call went 75 → 79 after exactly 4 Preview calls.

## Rollback instructions

1. Open the Supabase SQL editor for **`pkfdunyeaqdvvklutgon`** and confirm the URL and project name (SMV-preprod).
2. Run `supabase/rollbacks/20261115120000_geo_search_terms_projection.rollback.sql`. It is one transaction and takes a few seconds.
3. Verify: `select md5(prosrc) from pg_proc where proname = 'search_geo_places'` returns `cbf7ddcf364b594056ed56c6af4c77ac`, and `select to_regclass('public.geo_search_terms')` returns null.

The rollback was rehearsed in T3.

## Untouched

- Production Supabase `jbsefolhlfkplawiuvlu`: never accessed.
- GitHub `main`: still `63b6ddc`.
- Vercel Production deployment `dpl_3T1uif…`, domains and aliases unchanged; no promotion, alias or Production build.
- No OTP send or verify, lead submission, SMS or email.
- No customer, Auth, lead or business data touched. Synthetic geo rows existed only inside rolled-back test transactions.

## Notes for later decisions

- **Shared database:** Pre-Prod is shared by every Preview and by Development, so the candidate Preview also now uses the new function. Results are equivalent.
- **Production migration runtime:** about 2 minutes on this Free instance. It takes no long lock on `geo_places` / `geo_aliases` beyond reads and brief trigger creation. Production application is a separate decision for Vivek.
- **Remaining route time:** this is now mostly outside the database. Warm database calls take 10–320 ms, while the route takes about 0.6–1.2 s.
- **Index clean-up (separate decision):** the old expression trigram indexes (about 34 MB) and the zero-scan raw-text trigram indexes are no longer used by search. They are kept for the rollback.
