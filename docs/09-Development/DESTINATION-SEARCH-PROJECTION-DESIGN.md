# Destination Search — Compact Search Projection (Archie design record)

**Date:** 2026-11-15 · **Branch:** `perf/compact-destination-search-r12` (from `release/r12-clean-main-candidate` @ `f9f0e38`)
**Migration:** `supabase/migrations/20261115120000_geo_search_terms_projection.sql`
**Rollback:** `supabase/rollbacks/20261115120000_geo_search_terms_projection.rollback.sql`
**Scope:** geographic search data and functions only. No customer, Auth, lead or other business data.

## Problem

`search_geo_places` (migration `20260830013000`) matches the normalised canonical name and aliases with a prefix `LIKE` and the trigram `%` operator. Both run through GIN trigram **expression** indexes on `immutable_unaccent(lower(...))`.

Trigram indexes are lossy. Every candidate tuple must be fetched from the wide `geo_places` heap (about 165 bytes per row, 11,968 pages), and the expression is recomputed to recheck the predicate and again to compute the score. Short or common terms produce thousands of candidates. Goa produced 5,060 candidates (5,009 rejected on recheck) across 2,493 heap blocks of `geo_places` plus 327 blocks of `geo_aliases`. On the Free instance this repeatedly exceeded the function's 2 s `statement_timeout` (Supabase error `57014`).

A measurement on Pre-Prod showed that `unaccent` alone costs about 7 µs per row. So the cost is mostly the per-candidate heap work, which scales with the shared CPU and cache state, not the expression itself.

## Design

A narrow, derived table `public.geo_search_terms`:

| Column | Meaning |
|---|---|
| `geo_place_id text not null` | FK → `geo_places.id`, `on update cascade on delete cascade` |
| `alias_id uuid null` | FK → `geo_aliases.id`, `on delete cascade`; null for the canonical-name row |
| `alias_text text null` | The alias as stored (returned as `matched_alias`); null for the canonical-name row |
| `search_text text not null` | `immutable_unaccent(lower(ascii_name))` or `immutable_unaccent(lower(alias_text))`, the exact expression the old function recomputed |

There is one row per place (594,542) and one per alias (123,549): 718,091 rows. The search function scans this table once with the same predicates and scores. It reads the full `geo_places` row only for matched places, in the same final join as before.

### Indexes

- `geo_search_terms_search_text_trgm_idx`: GIN `gin_trgm_ops` on `search_text`. Serves both `LIKE 'q%'` and `% 'q'`, as the expression indexes did.
- `geo_search_terms_place_name_uidx`: unique `(geo_place_id) where alias_id is null`. One canonical row per place; used as the `ON CONFLICT` target for sync.
- `geo_search_terms_alias_uidx`: unique `(alias_id) where alias_id is not null`. One row per alias; `ON CONFLICT` target.
- `geo_search_terms_geo_place_id_idx`: supports the FK cascades for both row kinds.

The existing raw-text and expression trigram indexes on `geo_places` and `geo_aliases` are **not** dropped. The expression indexes are what the rollback relies on. Dropping them later would save about 34 MB on Pre-Prod; that is a separate decision.

### Synchronisation

- **Inserts:** statement-level `AFTER INSERT` triggers on `geo_places` and `geo_aliases`, using transition tables, insert the projection rows set-based. The GeoNames importer (`web/scripts/geo-validation/importGeoNames.ts`) upserts through PostgREST with `on_conflict=id` and `merge-duplicates`. New rows fire the INSERT trigger.
- **Updates:** statement-level `AFTER UPDATE` triggers recompute `search_text` (and alias fields) for changed rows. Re-imported existing rows fire this path. A place `id` change is propagated by `on update cascade`.
- **Deletes:** handled by the FK cascades. Deleting a place cascades to its aliases (existing FK) and to both kinds of projection row.
- **No importer code change is required.** Writes stay with `service_role`; the trigger functions are `SECURITY DEFINER` with `search_path = ''`, so the projection itself is select-only for `service_role`.

### Security and contract

- `search_geo_places(text, int)` keeps the following unchanged: signature, result columns, `language plpgsql`, `stable`, `statement_timeout = 2000`, `SECURITY INVOKER`, owner and ACL (`create or replace` keeps them; EXECUTE remains `service_role` only).
- Normalisation, prefix and fuzzy predicates, scores (2.0 / 1.9 / `similarity`), `DISTINCT ON` and ordering, the limit, and `%L` literal inlining are all unchanged.
- **Projection permissions:** RLS is enabled with no policies. `revoke all … from public, anon, authenticated, service_role`, then `grant select … to service_role`. Supabase default privileges otherwise grant ALL on new tables; the pre-apply dry run caught this and it is fixed in the migration.
- **Trigger functions:** `SECURITY DEFINER`, `search_path = ''`, EXECUTE revoked from all API roles.

### Storage, cost and migration behaviour

- **Size:** about 38 MB heap plus a 22 MB GIN index (measured in the prototype), plus three B-tree indexes. Expected total is roughly 90–100 MB, taking Pre-Prod from 222 MB to about 320 MB, inside the Free plan's 500 MB.
- **Migration runtime:** about 122 s on Pre-Prod (measured in a dry run that was rolled back). It runs in one transaction and takes no lock on `geo_places` or `geo_aliases` beyond reads, plus trigger creation.
- **Write cost:** each import batch now also writes the projection rows, set-based once per statement. The importer is an offline, operator-run tool.
- **No recurring cost** and no plan change.

### Expected plan change (prototype, Pre-Prod, same CPU conditions)

| Term | Heap blocks old (places + aliases) → new | Heap scan time old → new | Query execution old → new |
|---|---|---|---|
| goa | 2,493 + 327 → 2,003 | 64 + 12 ms → 18 ms | 78 → 19 ms |
| dubai | 3,312 + 476 → 2,467 | 95 + 16 ms → 30 ms | 112 → 31 ms |
| bali | 7,096 + 829 → 3,906 | 356 + 50 ms → 90 ms | 412 → 96 ms |
| bombay (alias) | 732 + 84 → 679 | 18 + 4 ms → 8 ms | 23 → 9 ms |
| banglore (typo) | 3,054 + 285 → 2,003 | 109 + 17 ms → 39 ms | 128 → 41 ms |

**Why:** heap blocks fall 17–51% (narrow rows, one scan instead of two), and per-candidate work falls about 70% (stored text, no recomputation). The number of rows rejected on recheck is essentially the same, as expected, because matching semantics are unchanged.

### Result parity and a pre-existing tie property

Place IDs, order, scores and counts were identical for all five terms. `matched_alias` can differ only where one place has two or more rows (name or aliases) with **exactly equal** best scores. The original `DISTINCT ON (geo_place_id) … ORDER BY geo_place_id, match_score DESC` has no tie-breaker, so its choice is unspecified in SQL and depends on physical row order. It is unspecified in the old version too.

This was observed for Bombay (Mumbai: "Bombay" vs "Bombaya", both 1.9) and Banglore (name vs alias at equal similarity). The query semantics are intentionally left unchanged: adding a tie-breaker would be a behaviour change. `matchedAlias` is not shown in the UI (`web/lib/geo-validation/types.ts`). Validation therefore checks that the returned alias belongs to the old version's deterministic set of tied best matches.

## Alternatives considered

- **Stored generated columns on `geo_places` / `geo_aliases`** with new trigram indexes. Synchronisation would be automatic, but the change rewrites both tables under an exclusive lock and widens `geo_places`. It also does nothing about the wide-row heap work. Rejected.
- **Raising `statement_timeout`, or changing the trigram threshold.** Prohibited by the brief as a fix: one masks the problem, the other changes matching behaviour.
- **Paid compute.** Out of scope (no new cost).
