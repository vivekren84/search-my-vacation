# SMV Workspace — Data Architecture

| Document Information | |
|---|---|
| Document Name | SMV Workspace Data Architecture |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 |
| Last Updated | 14 September 2026 |
| Predecessor | `WORKSPACE-DOMAIN-MODEL.md` v1.0 |

---

## 1. Purpose

This document defines the persistence strategy, data ownership, cross-module reference conventions, audit strategy, versioning strategy, and historical-preservation implementation for SMV Workspace — translating the Domain Model into concrete Postgres/Supabase decisions, at the level of migration and RLS design rather than individual column DDL (which is Rad's implementation task against this document).

This document defines how the approved business domain is persisted within the existing Search My Vacation platform. It establishes the persistence principles that every engineering implementation must follow while deliberately leaving detailed SQL implementation and migration sequencing to Engineering.

## 2. Persistence Strategy

- **Platform:** the existing Supabase Postgres project — no new database technology. This is unchanged from every other feature in the repository.
- **Schema:** the `public` schema, matching existing convention (all current tables — `journey_passport_leads`, `geo_places`, etc. — live in `public`; there is no precedent in this repository for a separate schema per feature, and introducing one would be a new pattern requiring its own justification this EBC does not find necessary).
- **Table naming:** every new table is prefixed `workspace_` (e.g. `workspace_journey_planning_records`), consistent with this repository's existing convention of a descriptive prefix per feature area (`journey_passport_*`, `geo_*`). This namespaces SMV Workspace's ~20 tables clearly, avoids any collision with existing or future public-site tables, and makes ownership immediately legible from the table name alone (Project Instructions §33 — exact, unambiguous naming).
- **No ORM.** Consistent with every existing module, data access is hand-written PostgREST `fetch` calls and `SECURITY DEFINER` RPC functions for anything requiring atomicity beyond a single-row insert/update. This avoids introducing a new dependency (Project Instructions §21) and keeps SMV Workspace's data-access code reviewable in exactly the same idiom as `journey-leads/repository.ts`.
- **Migrations:** additive, timestamp-prefixed SQL files under `supabase/migrations/`, one logical unit per file, matching the existing migration history exactly (e.g. `20260830013000_search_geo_places_dynamic_planning_rewrite.sql`). This document does not prescribe exact filenames or ordering — that is Rad's engineering-planning task — but establishes that migrations must be additive (no `DROP`/destructive rewrite of any existing table) per Project Instructions §26.

Collectively, these persistence decisions preserve consistency with the existing repository while providing a scalable foundation for the new Workspace capabilities.

## 3. Data Ownership

Table ownership mirrors the Domain Model's aggregate boundaries exactly (Domain Model §3) — restated here as the authoritative table list:

Table ownership follows the aggregate ownership established in the Domain Model. Each module remains responsible only for the persistence of the business objects it owns, preserving clear architectural boundaries across the Workspace.

| Module | Tables |
|---|---|
| `shared` | `workspace_users`, `workspace_notifications`, `workspace_audit_log`, `workspace_tasks`, `workspace_follow_ups`, `workspace_documents` |
| `journey-planning` | `workspace_journey_planning_records`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes` |
| `journey-workspace` | `workspace_journeys`, `workspace_vendor_confirmations`, `workspace_operational_readiness_items` |
| `traveller-hub` | `workspace_travellers`, `workspace_traveller_flags` |
| `itinerary-studio` | `workspace_master_itineraries`, `workspace_traveller_itineraries`, `workspace_itinerary_versions`, `workspace_itinerary_learnings` |
| `destination-intelligence` | `workspace_destination_profiles` |
| `vendor-management` | `workspace_vendors`, `workspace_vendor_performance_notes` |
| `settings` | `workspace_configuration`, `workspace_personal_preferences` |

No table is written to by more than one module's `repository.ts` — this is enforced by convention and code review, not a database-level mechanism, consistent with how the existing modules already self-police their own table ownership.

## 4. The Central Decision: Authentication and Row Level Security

This is the most material data-architecture decision in this document, flagged at Discovery (§9 there) as requiring explicit sign-off.

### Product Owner Ratification

The Product Owner has approved the introduction of Supabase Authentication and Row Level Security (RLS) as the security foundation for SMV Workspace.

The Workspace is confirmed as a collaborative operational platform. Unless an Approved Business Requirement explicitly requires otherwise, authenticated Workspace Users may view shared operational information.

Row Level Security is therefore adopted primarily to enforce:

- authentication
- role-based authorisation
- ownership-sensitive operations
- administrative capabilities
- user-specific information
- future confidential business data

rather than restricting general operational visibility across Workspace Users.

### 4.1 Current Pattern (Unchanged for Existing Tables)

Every existing table: RLS enabled, `REVOKE ALL ... FROM anon, authenticated`, `GRANT ... TO service_role` only. All access is server-side, using a secret key. There are no authenticated end-users anywhere in the current system — the public site is fully anonymous.

### 4.2 Approved Pattern for `workspace_*` Tables

- **Introduce Supabase Auth** for Workspace User accounts. `auth.users` (Supabase-managed) holds credentials; `workspace_users` (application-owned, §Domain Model §2.12) holds the profile — role (`administrator` | `privilege_user`), display name, activation state — linked one-to-one via `workspace_users.auth_user_id → auth.users.id`.
- **RLS is enabled on every `workspace_*` table**, with policies keyed on `auth.uid()` (Supabase's built-in function returning the current authenticated user's ID) joined through `workspace_users`, via a `SECURITY DEFINER` helper function (`workspace_current_user_role()`) that returns the caller's role — the same pattern this repository already uses for `SECURITY DEFINER` functions (§5.2), applied to authorisation rather than business logic.
- **Grants:** `authenticated` role is granted `SELECT`/`INSERT`/`UPDATE` on `workspace_*` tables (subject to RLS policy), a genuine change from the existing "authenticated gets nothing" posture — but scoped **only** to the new `workspace_*` tables. No grant is added to any existing table. `service_role` retains full access for server-side administrative operations (e.g. the Journey conversion RPC, §6) that must bypass row-level ownership checks by design.
Read access is collaborative by default across Workspace Users unless a specific business capability explicitly requires user-level isolation.

Authorisation policies should therefore primarily govern modification, approval, reassignment, administrative functions and other ownership-sensitive operations rather than general operational visibility.

- **No permanent-delete grant exists for `authenticated` on any of the six BR-007 object types** (§Domain Model §4.3) — this is enforced at the grant level (no `DELETE` privilege at all on those tables for any role except `service_role`, and `service_role` is never invoked from a code path that issues a raw `DELETE` against them), not merely by omitting a UI button.

### 4.3 Why This Diverges From Existing Precedent, Deliberately

The existing "service-role-only, no authenticated identity" pattern is correct for an anonymous public site — there is no user to distinguish. SMV Workspace's entire value proposition (owner visibility, role-scoped access, audit trails naming who acted) requires knowing which staff member is acting. Postgres-native RLS is the more robust place to enforce "an Administrator sees everything; a Privilege User sees unclaimed items and their own claimed items" than re-implementing the same check in every Server Component and API route — a single missed application-layer check would otherwise expose cross-user data. This trade-off (two data-access postures coexisting in one database, clearly separated by table prefix and by which Supabase role is granted access) is recorded as **AD-WS11-002** in the Architectural Decisions document, offered for explicit Product Owner/Archie approval before Rad implements it (Project Instructions §5, §21, §25).

This architecture has been approved by the Product Owner as the security foundation for SMV Workspace.

The approved approach introduces two security models within the same platform:

- the existing service-role model for the anonymous public website
- authenticated Workspace Users with Row Level Security for internal operations

These models coexist intentionally and independently, allowing Search My Vacation to evolve from a public-facing website into an internal operational platform without impacting existing public functionality.

### 4.4 What Is Not Decided Here

- The exact RLS policy expressions per table (Rad's implementation detail against this document's stated pattern).
The detailed implementation of Administrator and Privilege User permissions within individual RLS policies remains an Engineering responsibility.

The Product Owner has approved the overall operating model, including:

- Administrator platform governance
- Privilege User operational responsibilities
- self-service password management
- administrative password reset capability

Engineering is responsible only for implementing these approved business rules.
- Session mechanism specifics (cookie-based Supabase session vs. another approach) — an implementation detail within the "use Supabase Auth" decision, not a data-architecture concern.

### Authentication Lifecycle

Workspace User onboarding follows the approved operational model:

- Administrators create Workspace Users.
- Users receive an invitation or initial credential through the approved authentication mechanism.
- Workspace Users establish and manage their own credentials thereafter.
- Administrators may perform password resets where operationally required but do not manage users' ongoing credentials.

This model separates platform administration from user credential ownership while supporting secure day-to-day Workspace operations.

## 5. Audit Strategy

- **Every `workspace_*` table** carries `created_at`, `updated_at`, `created_by → workspace_users.id`, `updated_by → workspace_users.id` — the minimum needed to answer "who touched this and when" without a separate log lookup for simple cases.
- **`workspace_audit_log`** (append-only, `shared`-owned) captures every stage transition and every Reassignment specifically, satisfying NFR-WS-004 ("every stage transition and Reassignment recorded with who/when") at a level of detail the four generic timestamp columns alone cannot provide (a full history, not just the most recent change). Row shape: `entity_type`, `entity_id`, `event_type` (`stage_transition` | `reassignment` | `claim`), `previous_value`, `new_value`, `actor_id`, `occurred_at`. This is the same "generic, entity-agnostic audit table" pattern already implicitly used by `journey_passport_events` in the existing schema (an events table keyed by a reference plus an event type) — extended, not reinvented.
- Every module's `service.ts` writes to `workspace_audit_log` as part of the same transaction as the state change it is recording (never a best-effort, fire-and-forget write for this table specifically, since audit completeness is a named requirement, unlike Notification delivery which the existing `journey-leads/service.ts` precedent already treats as best-effort/non-blocking).

The audit strategy is designed to preserve operational accountability without requiring individual business modules to implement their own audit mechanisms.

## 6. Versioning Strategy

Append-only child tables, current-flag pattern, no in-place overwrite — applied identically to every object the Specification names as versioned:

| Object | Versioning table | Current-version marker |
|---|---|---|
| Proposal Version | `workspace_proposal_versions` itself is the version chain (one row per version) | `is_current` boolean, exactly one `true` per Journey Planning Record, enforced by a partial unique index |
| Master/Traveller Itinerary | `workspace_itinerary_versions` | `itinerary_id` + `version_number`, latest by `version_number desc` |
| Destination Profile | No separate version table — its Draft→Under Review→Approved status *is* its Release 1.3 change-history mechanism (Domain Model §3) | N/A |

The Journey Planning Record → Journey conversion (BR-012) is the one operation in this data model that must be genuinely atomic across two aggregate roots simultaneously (closing the Journey Planning Record, creating the Journey, carrying forward the accepted Traveller Itinerary reference, writing the audit-log entries for both). This is implemented as a single `SECURITY DEFINER` RPC function (mirroring the existing `send_journey_passport_otp`/`claim_journey_passport_callback` precedent's use of a transactional PL/pgSQL function for exactly this kind of multi-row, must-not-partially-succeed operation), not as two sequential application-level writes — preventing a Journey from ever existing without its originating record correctly closed, or vice versa.

This ensures transactional consistency across aggregate boundaries while preserving the business invariants defined in the Domain Model.

## 7. Historical Preservation (BR-006/BR-007) — Implementation

Restated from the Domain Model (§4.3) at the data-architecture level:
Historical preservation is implemented as a platform-wide persistence principle rather than an individual module behaviour.

- Journey Planning Record, Journey, Traveller (history), Proposal (history — the version chain itself), Vendor (history — retained regardless of lifecycle state, PD-VM-004), Destination Profile: **archival only**. Each carries a lifecycle/status column reaching a terminal "archived"-shaped state (`closed_lost`, `closed_archived`, `successfully_completed`, `cancelled`, `inactive`, etc., per object); none of these tables has a `DELETE` grant for any role except `service_role`, and no application code path issues one.
- Permanent deletion is available **only** for `workspace_configuration` entries and equivalent administrative data — implemented as a genuinely separate, narrowly-scoped RPC (`delete_workspace_configuration_entry`) requiring the Administrator role, distinct from every other table's repository interface, so the capability cannot accidentally be reused against an operational or knowledge table.

## 8. Cross-Module References

Standard relational foreign keys — this is a relational database, and cross-aggregate references are modelled as such, not as embedded/duplicated JSON:

- `workspace_journeys.journey_planning_record_id → workspace_journey_planning_records.id` (BR-012, one-way, set once at conversion, never repointed).
- `workspace_traveller_itineraries.source_master_itinerary_id → workspace_master_itineraries.id` (OQ-021 proposal, Domain Model §2.7).
- `workspace_destination_profiles.geo_place_id → geo_places.id`, **nullable**, cross-schema-boundary reference into the existing (non-`workspace_`) table (OQ-019, Integration Architecture document — read-only reference, never written to by any `workspace_*` service).
- `workspace_leads.journey_passport_lead_id → journey_passport_leads.id`, **nullable**, populated only for site-originated Leads (OQ-012 proposal).

Every cross-module foreign key that reaches outside the `workspace_*` namespace (the last two above) is read-only from SMV Workspace's side — no `workspace_*` service ever writes to `geo_places` or `journey_passport_leads`, preserving the Solution Architecture's dependency rule that the public-site modules remain unaware of and unaffected by SMV Workspace (§4.2 of that document).

These reference rules preserve module independence by allowing Workspace to consume approved external data without assuming ownership of that data.

## 9. What This Document Does Not Do

- It does not write or propose exact SQL DDL, migration file contents, or RLS policy expressions — Rad's implementation task, executed against this document's stated patterns.
- It does not decide OQ-001 (role capability matrix), OQ-012 (Lead/`journey_passport_leads` final relationship), OQ-019 (Destination Profile/`geo_places` reconciliation — proposed, not confirmed), OQ-020 (Quotation terminology), or OQ-021 (Itinerary notation) — each is implemented in a way that does not block on the Product Owner's eventual confirmation.
- It does not introduce Supabase Storage or any file-handling infrastructure for Document (§Domain Model §2.11) — deferred pending OQ-014, per the Integration Architecture document.

With these persistence principles established, the remaining Integration Architecture document can focus exclusively on system boundaries, data exchange and interaction with existing platform capabilities without redefining the underlying persistence model.

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*
*The authentication/RLS approach in §4 is the single most material proposal in this document and is carried into the Architectural Decisions document (AD-WS11-002) for explicit Product Owner sign-off before implementation begins.*
