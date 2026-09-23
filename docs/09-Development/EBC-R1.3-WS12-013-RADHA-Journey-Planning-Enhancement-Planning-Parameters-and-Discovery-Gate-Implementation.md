# EBC-R1.3-WS12-013 — RADHA — Journey Planning Enhancement: Planning Parameters & Discovery Gate Implementation

**Persona:** Radha (Rad), Engineering and Implementation Specialist
**Workstream:** WS12 — Journey Planning
**Canonical inputs:** `EBC-R1.3-WS12-003` (Revision 2), `EBC-R1.3-WS12-011B`, `EBC-R1.3-WS12-012` (including its Section 15 wireframe addendum). `EBC-R1.3-WS12-011A` was **not** used directly, per Tiger's explicit instruction — it is already synchronized into the canonical baseline via WS12-003 Revision 2 and WS12-011B.
**Repository:** `/Users/viveksophu/Documents/Projects/SearchMyVacation`, branch `main`
**Date:** 22 September 2026
**Status:** Implementation complete, build-verified by type-check and lint; **not yet functionally verified against a running application** (see Section 5/6) — ready for Keerthi.

No Product or UX interpretation was performed. Every field, label, tag, gate condition and helper text below traces directly to a specific `FR-JP-3x`/`BR-02x` requirement or to WS12-012's own written specification (not only its wireframe, which the wireframe's own text confirms illustrates rather than supersedes).

---

## 1. Engineering Summary

Implemented the six ratified Planning Parameters ("Trip Basics") — Number of Adults, Number of Children, Number of Infants, Intended Travel Month, Number of Nights, Preferred Departure City — and the Discovery→Planning lifecycle gate, across the database, repository, validation, service, API and UI layers of the existing Journey Planning module, reusing its established five-file convention (`types.ts` / `validation.ts` / `repository.ts` / `service.ts` / API routes) and RBAC (`canEditRecord`) throughout. No new Functional Requirement, Business Rule, architecture, or Product/UX decision was introduced. No Budget field and no Exact Travel Date field or prompt were added anywhere, per the card's explicit constraints.

Number of Adults is enforced as mandatory at record creation (`FR-JP-31`) at the **application** layer, not by a database `NOT NULL` — see Section 2's Nullability Decision. The other five parameters are optional at creation (Progressive Enrichment, `BR-020`) and become required only at the Discovery→Planning transition (`FR-JP-34`/`BR-021`), where an explicit zero satisfies the gate for Children/Infants/Nights but an unanswered field does not (`BR-023`). A single function, `getMissingPlanningParameters` (`validation.ts`), is the one place this rule is expressed — it backs both the gate's enforcement in `advanceJourneyPlanningStage` and the Detail screen's "Trip Basics — X of 5 needed before Planning" completion indicator, so the two can never drift apart.

## 2. Database Migration Summary

Two new migration files, applied to the repository only (**not yet applied to the development database** — see Section 6, Known Limitations; the established pattern in this project has the Product Owner apply migrations from their own terminal/Studio, per the WS12-010/WS12-010V precedent):

- `supabase/migrations/20260922090000_workspace_journey_planning_trip_basics.sql` — adds `adults`, `children`, `infants`, `intended_travel_month`, `nights`, `preferred_departure_city` to `workspace_journey_planning_records`.
- `supabase/migrations/20260922090100_workspace_audit_log_trip_basics_event.sql` — extends the `workspace_audit_log` event-type `CHECK` constraint with `trip_basics_updated`, following the existing extend-never-replace convention.

**Nullability decision (engineering judgement, disclosed per Project Instructions §35 — a safe, non-material assumption, not a request for re-approval):** all six new columns are nullable, with **no backfill and no `NOT NULL` constraint on any of them, including Adults**. This departs from the nullable→backfill→`NOT NULL` pattern used for `origin_channel` (`20260922080000_...sql`), for a reason specific to this column set: the development database already carries two real rows with no Adults value (the records created during `EBC-R1.3-WS12-010V`'s live verification), and fabricating a plausible Adults count for them would violate Project Instructions §19 ("do not fabricate production content"). Leaving pre-existing rows genuinely `NULL` is the factually honest state — their Adults count was never captured — and `FR-JP-31`'s creation-mandatory requirement is enforced instead at the application layer (`validation.ts`), exactly like `FR-JP-06`'s origin-channel-required check was before WS12-010 additionally hardened it at the database layer for that already-backfillable column. `BR-023`'s tri-state requirement (unanswered / explicit zero / explicit positive count) is satisfied natively by `NULL` / `0` / positive integer — no sentinel value needed.

`intended_travel_month` is stored as `'YYYY-MM'` text, validated by both an application regex and a mirroring database `CHECK`, deliberately **not** a `date` column — a date would need an arbitrary day-of-month that would blur the boundary against the permanently-excluded Exact Travel Date (`FR-JP-36`/`BR-024`).

Every gated column also carries a range/format `CHECK` (Adults ≥ 1; Children/Infants/Nights ≥ 0; month pattern; departure city non-blank-when-set) enforced at the database layer in addition to `validation.ts`, consistent with this module's existing double-enforcement pattern (origin channel, stage/outcome).

## 3. Files Modified

**New files:**
- `supabase/migrations/20260922090000_workspace_journey_planning_trip_basics.sql`
- `supabase/migrations/20260922090100_workspace_audit_log_trip_basics_event.sql`
- `web/app/api/workspace/journey-planning/[recordId]/trip-basics/route.ts`
- `web/components/workspace/journey-planning/TripBasicsPanel.tsx`

**Modified files:**
- `web/lib/workspace/journey-planning/types.ts` — six new `JourneyPlanningRecord` fields; `JourneyPlanningGatedParameterField` type and `JOURNEY_PLANNING_GATED_PARAMETER_FIELDS` constant; extended `CreateJourneyPlanningRecordInput`; new `UpdateJourneyPlanningTripBasicsInput`.
- `web/lib/workspace/journey-planning/validation.ts` — Adults-required check; shared Trip Basics field-value validation; `validateUpdateJourneyPlanningTripBasicsInput`; `getMissingPlanningParameters`; the Discovery→Planning gate wired into `validateStageTransition` via a new optional third parameter (fully backward-compatible — every other transition ignores it).
- `web/lib/workspace/journey-planning/repository.ts` — `mapRecordRow`/`insertJourneyPlanningRecord` extended; new `updateJourneyPlanningTripBasics` (partial update — only supplied fields are written).
- `web/lib/workspace/journey-planning/service.ts` — new `updateJourneyPlanningTripBasics` (RBAC via `canEditRecord`, validation, audit event); `advanceJourneyPlanningStage` now threads the record's Planning Parameters into the gate check; `getJourneyPlanningRecordDetail` now returns a server-computed `tripBasics` completion summary.
- `web/lib/workspace/shared/audit/types.ts` — adds `trip_basics_updated` to `WorkspaceAuditEventType`.
- `web/app/api/workspace/journey-planning/route.ts` — `POST` now accepts the six Trip Basics fields.
- `web/components/workspace/journey-planning/NewJourneyPlanningRecordForm.tsx` — adds the Trip Basics panel (WS12-012 §4.1: after Destination Region, before Submit).
- `web/components/workspace/journey-planning/JourneyPlanningRecordDetailView.tsx` — adds an editable Trip Basics section, the completion indicator, and a disabled-with-inline-note treatment of "Move to Planning" specifically, while leaving every other stage-transition button unchanged.
- `web/components/workspace/journey-planning/journeyPlanningLabels.ts` — `PLANNING_PARAMETER_LABELS`/`PLANNING_PARAMETER_HELPER_TEXT`; `trip_basics_updated` audit label.

No other file was created, modified, or deleted. No product documentation was updated, per the card's explicit constraint — this report and the code's own inline commentary are the only documentation this card produces.

## 4. API Changes

- `POST /api/workspace/journey-planning` — request body accepts six new optional-at-the-HTTP-layer fields (`adults`, `children`, `infants`, `intendedTravelMonth`, `nights`, `preferredDepartureCity`); `adults` is enforced as required by `validateCreateJourneyPlanningRecordInput` (`400 adults_required` if missing/invalid). Existing consumers that omit all six fields now receive `400 adults_required` instead of `201` — this is the one, deliberate, requirement-driven behaviour change (`FR-JP-31`); every other existing field and code path is unaffected.
- `GET /api/workspace/journey-planning/[recordId]` — response `record` now includes the six new fields; the response now also carries a top-level `tripBasics: { completed, total, missing }`. Purely additive — no existing field removed or renamed.
- `POST /api/workspace/journey-planning/[recordId]/advance-stage` — unchanged request/response shape. Behaviour change: a Discovery→Planning transition now returns `400 discovery_to_planning_requires_trip_basics` if any of the five gated fields is unanswered (`FR-JP-34`/`BR-021`). Every other transition is unaffected.
- **New:** `POST /api/workspace/journey-planning/[recordId]/trip-basics` — partial update of Trip Basics fields, following the same shape as the existing `reassign`/`claim` action routes. `403` if the caller cannot edit the record (`canEditRecord`), `400` on invalid field values, `404` if the record does not exist.

## 5. Test Results

- **`npx tsc --noEmit -p tsconfig.json`** — **passed, zero errors**, run against the full repository (not just the changed files).
- **`npx eslint` against every changed `journey-planning`/audit/API path** — **passed, zero warnings or errors**.
- **`npm run build`** — **could not be completed** in this environment. The Turbopack build fails at the `next/font` Google Fonts fetch step (`fonts.googleapis.com`), which this sandboxed environment's network egress does not allow — this is an environment network restriction, not a defect in this card's changes; it reproduces on `app/layout.tsx`'s existing font imports, unrelated to any file this card touched. **Disclosed, not silently worked around** — the production build itself has not been confirmed to succeed end-to-end by this card. Recommend a build run from the Product Owner's own machine (which the WS12-010V precedent confirms has working network access) before release.
- **Live functional verification (create record, edit Trip Basics, attempt a gated Planning transition, confirm History event, confirm regression areas):** **not performed by this card.** The local dev server could not be reached from this session's browser tooling this pass (attempted; the session's Linux VM and the browser used for live testing are on separate network namespaces, and no dev server was already running on the Product Owner's own machine this time — unlike `WS12-010V`, where one already was). This is disclosed as a gap, not skipped silently.
- **Automated unit/repository/validation/service tests (this card's own Activity 12):** **not added.** Confirmed (again, as WS12-007 itself first disclosed) that this repository has no Jest/Vitest test runner or any test scaffolding for the `journey-planning` module — only feature-specific `npm run verify:*` scripts for unrelated modules (Journey Director, geo-validation, journey leads, journey passport), none of which this module has ever used or extended. Adding a first test runner for this module is a meaningfully larger, separate engineering decision (tooling choice, CI wiring) than this card's own scope, and doing so silently, without Tiger/Archie's sign-off, risks exactly the kind of scope creep Project Instructions §20 prohibits. **Explicitly flagged as a gap**, not claimed as done — see Known Limitations and Recommended QA Focus Areas below.

## 6. Known Limitations

- **Migrations not yet applied to any database.** Written and reviewed against the existing schema/RLS pattern, but not run. The Product Owner will need to apply both new migration files (in order) before any of this card's functionality is reachable — matching the established WS12-010/WS12-010V handoff pattern for this project.
- **No automated tests were added** for this module (Section 5) — this repository has no test runner for `journey-planning` to extend. This is a pre-existing gap this card did not create but also did not close; flagged to Tiger as a candidate backlog item (introducing Jest/Vitest for this module) rather than something Rad should decide unilaterally mid-EBC.
- **Production build not confirmed** in this environment (Section 5) — an environment network restriction (Google Fonts), not a code defect, but genuinely unverified by this card; `next build` should be re-run somewhere with normal network access before release.
- **Live functional behaviour not verified by Rad this pass** (Section 5) — type-checked and lint-clean, but the gate's actual runtime behaviour, the explicit-zero UI (unset em-dash / "Set to 0"), and the completion indicator have not been exercised against a running app by this card. This is the primary reason this card is handed to Keerthi rather than declared QA-complete.
- **Preferred Departure City is a plain text field**, not the "existing-value typeahead" WS12-012 §4.2 describes reusing — no typeahead component exists anywhere in this codebase yet (Destination/Region, the field WS12-012 names as the pattern to reuse, is itself a plain text input today). Matching the actual current pattern was judged closer to "reuse existing patterns" than inventing a new typeahead component; flagged for Sophie/Sri if this reads as a meaningful UX gap.
- **"Save Trip Basics" is a button-triggered save**, not field-level autosave-on-blur. WS12-012 §5.2 references "the existing in-place edit pattern already used for requirement fields... no new editing paradigm," but no autosave component exists anywhere in this codebase's actual implementation to reuse (every existing Detail-screen section — Discovery Notes, Proposal Versions, Tasks — uses an explicit Add/Save button). The button pattern was used for consistency with every other section on this same screen, rather than introducing the first autosave interaction in the codebase unreviewed. The gate's own mechanism (Decision Log #4 — visible-but-disabled plus an always-visible indicator) is unaffected either way; only the save trigger differs from the spec's literal wording.
- **No `Number of Days` field** — intentionally not implemented; `WS12-011A §OQ-011A-1` records this as derived-from-Nights and out of scope, consistent with the ratified baseline.

**Explicitly not implemented, by design (this card's own constraints, not gaps):** Budget field (`FR-JP-32`/`BR-020`); Exact Travel Date field or prompt anywhere in Journey Planning (`FR-JP-36`/`BR-024`); any additional stage-transition gate beyond Discovery→Planning; any Product documentation update.

**Nothing in this card was deferred to WS13** beyond what the canonical documents themselves already forward-allocate there (Exact Travel Date's own future mandatory point) — this card did not need to defer any of its own in-scope work.

**No technical debt was knowingly introduced** beyond the two items above (no test runner exists to extend; the save-button-vs-autosave gap), both of which are pre-existing or spec-interpretation disclosures rather than new debt created by shortcuts in this card's own code.

## 7. Recommended QA Focus Areas (Keerthi)

1. **Creation:** Adults required (blocking, clear error) for both Individual and Corporate records; the other five fields save correctly when supplied and correctly left `NULL` when omitted.
2. **Explicit-zero handling (`BR-023`):** for Children, Infants and Nights — confirm the field visually starts unset (not "0"), confirm "Set to 0" produces a real, gate-satisfying `0` distinct from leaving it blank, and confirm the Detail screen's completion indicator correctly counts an explicit `0` as answered.
3. **Discovery→Planning gate (`FR-JP-34`/`BR-021`):** "Move to Planning" stays visible but disabled while any of the five fields is unanswered, with the inline note present; becomes enabled the moment all five hold explicit values (including zeros); confirm the API itself also rejects the transition directly (not only the UI), by attempting the same transition via a raw API call with fields still missing.
4. **Progressive Enrichment:** confirm a record can be created, claimed, and worked through ordinary Discovery activity (notes, tasks) with only Adults answered, with no forced prompt to complete the other five before doing anything else.
5. **Trip Basics editing:** partial saves — changing only one field leaves the others untouched; RBAC — a non-owner Workspace User cannot save Trip Basics on a record they don't own (Administrator can).
6. **Audit Trail:** a Trip Basics save produces a `trip_basics_updated` History entry; a Discovery→Planning transition still produces its existing `stage_transition` entry once the gate is satisfied.
7. **Full regression pass** per this card's own Activity 10 list — Queue, Filters, Ownership/Claim/Reassign, Discovery Notes, Proposal Versions, Tasks, History, Corporate workflow, Individual workflow, other stage transitions, Archive — none of which this card intended to change; Rad's own static/type-level review found no code path affecting them, but this has not been runtime-confirmed (Section 5).
8. **Migration application:** confirm both new migration files apply cleanly to the development database before any of the above is testable at all.

---

Prepared by Radha, Engineering and Implementation Specialist, Team Satvi, per EBC-R1.3-WS12-013.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01L6KYAiNwVu86RMW3fEXWsh
