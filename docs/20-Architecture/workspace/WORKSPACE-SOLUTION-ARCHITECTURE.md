# SMV Workspace — Solution Architecture

| Document Information | |
|---|---|
| Document Name | SMV Workspace Solution Architecture |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| Feature | FEAT-R1.3-013 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 |
| Last Updated | 14 September 2026 |
| Predecessor | `WORKSPACE-ARCHITECTURE-DISCOVERY.md` v1.0 |
| Related Documents | `WORKSPACE-DOMAIN-MODEL.md`, `WORKSPACE-DATA-ARCHITECTURE.md`, `WORKSPACE-INTEGRATION-ARCHITECTURE.md`, `WORKSPACE-ARCHITECTURAL-DECISIONS.md` (companion deliverables); Product Specification v2.0; UX Architecture package |

---

## 1. Purpose

This document defines the overall solution architecture for SMV Workspace: how it is deployed relative to the existing application, its architectural layers, module boundaries and responsibilities, dependency rules, cross-module communication, and the server/client boundary. It builds directly on the understanding established in the Architecture Discovery and on the Product Specification's own Cross-Module Governance Principles (§8) rather than inventing a new structural model.

With this Discovery complete, the architectural problem space is considered sufficiently understood to proceed into detailed Solution Architecture. Any future architectural changes should be evaluated against the constraints, assumptions and risks documented here.

## 2. Overall Architecture

SMV Workspace is delivered as a **new, protected route segment within the existing `web/` Next.js application** — not a separate application, not a separate repository, not a separate deployment.

```
                         Vercel (single project, unchanged)
                                     │
                    ┌────────────────────────────────┐
                    │      web/  (Next.js 16 App)      │
                    │                                  │
        ┌───────────┴───────────┐        ┌─────────────┴────────────┐
        │   Public Surface       │        │   SMV Workspace Surface   │
        │   (existing, unchanged)│        │   (new, this EBC)         │
        │                        │        │                           │
        │  web/app/(public routes)│       │  web/app/workspace/**     │
        │  destinations, journey, │       │  protected by middleware  │
        │  journey-passport, etc. │       │  (session + role check)   │
        └───────────┬─────────────┘       └─────────────┬─────────────┘
                    │                                    │
        ┌───────────┴──────────────┐        ┌────────────┴─────────────┐
        │ web/lib/journey-*, geo-* │        │ web/lib/workspace/**      │
        │ (existing, unchanged)     │        │ (new, per module)         │
        └───────────┬───────────────┘        └────────────┬────────────┘
                    │                                      │
                    └─────────────────┬────────────────────┘
                                       │
                          Supabase Postgres (single project)
              existing tables (service-role only)  |  new workspace_ tables (RLS + Auth)
```

**Rationale (Project Instructions §21 — preserve the existing stack; prefer existing patterns over unnecessary new abstractions):**

- A single Next.js application avoids duplicating deployment configuration, brand/design tokens, CI, and environment-variable management across two apps — there is no functional requirement (public traffic scale, independent release cadence, separate team ownership) that would justify the operational cost of a second application, and none was named in the Product Specification or UX package.
- The empty `apps/` directory is not used as a precedent for a second app; nothing in the repository indicates it was intended for SMV Workspace, and creating a second Next.js app is a materially larger architectural change than this EBC's scope justifies without an explicit Product Owner decision to do so.
- Route-level isolation (`web/app/workspace/**`, gated by middleware) gives SMV Workspace a clean authentication boundary without the cost of a second deployable. This mirrors how the existing public site already isolates distinct experiences (`journey-passport`, `journey-director`) as route subtrees of one application.

This architectural approach maximises reuse of the existing platform while introducing the minimum additional infrastructure necessary to support the approved Workspace capabilities.

This is proposed as **AD-WS11-001** in the Architectural Decisions document, with the alternative (a separate application under `apps/`) recorded as considered and rejected there.

## 3. Architectural Layers

The solution follows the layered architectural approach already established within the existing Search My Vacation platform, extending proven implementation patterns rather than introducing new architectural styles.

| Layer | Existing precedent | SMV Workspace treatment |
|---|---|---|
| **Presentation** | `web/app/**` — Server Components for data display, Client Components for interactivity, no state-management library | `web/app/workspace/**` — same convention; queue boards and record detail views are Server Components fetching through the service layer; claim/assign/reassign controls, tab navigation and form inputs are Client Components |
| **Application / Service** | `web/lib/<feature>/service.ts` — orchestrates validation, repository calls, and side effects (e.g. `journey-leads/service.ts` orchestrating lead validation, repository writes and email notification) | `web/lib/workspace/<module>/service.ts` per module (§5) — orchestrates business-rule enforcement (e.g. BR-012's one-way conversion), repository calls, ownership/notification side effects |
| **Data Access** | `web/lib/<feature>/repository.ts` — direct PostgREST `fetch` calls and `SECURITY DEFINER` RPC invocations against Supabase, no ORM | `web/lib/workspace/<module>/repository.ts` per module — same pattern, against the new `workspace_*` tables (Data Architecture document) |
| **Data** | Supabase Postgres, `public` schema, RLS enabled, existing tables `service_role`-only | Supabase Postgres, same project and schema, new `workspace_*` tables with RLS policies keyed on the authenticated Workspace User's identity and role (Data Architecture document, AD-WS11-002) |
| **Integration** | `web/lib/journey-leads/email.ts` (Resend via direct REST call) | Reused, not reinvented, for any Workspace outbound notification email (Integration Architecture document) |

No new architectural layer (message queue, cache tier, separate API gateway, microservice) is introduced. Project Instructions §21 requires justifying any new dependency; none of the above needed one.

## 4. Module Boundaries

Module boundaries mirror the Product Specification's own module list (§5) and its two governance patterns (§8.4–§8.5), not a UX-invented or Archie-invented grouping:

Module boundaries are derived directly from the approved Product Specification and Information Architecture. They represent business ownership boundaries rather than technical implementation convenience.

```
web/lib/workspace/
├── shared/                    Cross-cutting: ownership (Claim/Assign/Reassign),
│                               notifications engine, RBAC/authorisation, audit logging
├── dashboard/                  Read-only aggregator — no owned tables
├── journey-planning/           Operational
├── journey-workspace/          Operational
├── notifications/              Operational (attention layer, cross-cutting emitter + own log)
├── traveller-hub/               Knowledge
├── itinerary-studio/            Knowledge
├── vendor-management/           Knowledge
├── destination-intelligence/    Knowledge (thin — see Integration Architecture, OQ-019)
└── settings/                    Administration — serves all eight other modules
```

Each module directory (other than `shared/` and `dashboard/`) follows the established five-file convention: `types.ts`, `validation.ts`, `repository.ts`, `service.ts`, and, where a module has any client-callable surface distinct from a Server Component, `client.ts` — exactly the shape already used by `journey-leads`, `journey-passport-otp`, `geo-validation` and `journey-director`.

### 4.1 Module Responsibilities

| Module | Responsibility | Owns tables |
|---|---|---|
| `shared/ownership` | Claim/Assign/Reassign mechanism, reusable across any table that opts in (OQ-022) | `workspace_ownership_log` (audit trail only — see Data Architecture) |
| `shared/notifications` | Generate, classify (Informational/Action Required) and resolve Notifications; called by every other module's service, never called directly by presentation code | `workspace_notifications` |
| `shared/rbac` | Centralised Administrator/Privilege User authorisation checks, one place to change when OQ-001 is confirmed | none (policy logic only) |
| `shared/audit` | Generic stage-transition/reassignment audit log (NFR-WS-004) | `workspace_audit_log` |
| `dashboard` | Read-only cross-module aggregation for Dashboard cards; performs no writes | none |
| `journey-planning` | Journey Planning Record lifecycle (PD-JP-005), Proposal Versions, Vendor Quotations (as Journey Planning's own commercial artefact, BR-011), Discovery Notes | `workspace_journey_planning_records`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes` |
| `journey-workspace` | Journey lifecycle (Phase 2 only, PD-JW-002–006), Vendor Confirmations, Operational Readiness | `workspace_journeys`, `workspace_vendor_confirmations`, `workspace_operational_readiness_items` |
| `traveller-hub` | Traveller record, Timeline, Operational Flags | `workspace_travellers`, `workspace_traveller_flags` (references, not duplicates, `journey_passport_leads`/existing Traveller data where applicable — Integration Architecture) |
| `itinerary-studio` | Master Itinerary, Traveller Itinerary, Version History, Learning Repository, Promotion | `workspace_master_itineraries`, `workspace_traveller_itineraries`, `workspace_itinerary_versions`, `workspace_itinerary_learnings` |
| `destination-intelligence` | Destination Profile authoring/governance surface only — see Integration Architecture for its boundary with `geo_places` | `workspace_destination_profiles` |
| `vendor-management` | Vendor master record, lifecycle, Preferred Partner, performance history | `workspace_vendors`, `workspace_vendor_performance_notes` |
| `settings` | Workspace Configuration (Administrator-scoped), Personal Preferences (per-user) | `workspace_configuration`, `workspace_personal_preferences`, `workspace_users` |
| Cross-cutting Task/Follow-up/Document | Shared object types referenced by Journey Planning and Journey Workspace (Specification §7.9–§7.13) | `workspace_tasks`, `workspace_follow_ups`, `workspace_documents` (owned by `shared/`, referenced by both operational modules) |

### 4.2 Dependency Rules

- A module's `service.ts` may call another module's `service.ts` (never another module's `repository.ts` directly) — this preserves each module's own business-rule enforcement and mirrors the Specification's own "references, does not own" language (e.g. Journey Planning references Traveller; it does not create or own it, PD-JP-004).
- `shared/*` has no dependency on any operational or knowledge module — every module depends on `shared/`, never the reverse.
- `dashboard` depends on every other module's `service.ts` for read access and owns no tables of its own — this directly implements the Specification's own framing of Dashboard as reading, not owning, business data (UX Information Architecture §4, Dashboard row: "Owns no business data and performs no business transactions").
- No module imports another module's `types.ts` internals beyond its published cross-module reference shape (e.g. `journey-workspace` imports `journey-planning`'s `JourneyPlanningRecordReference` type, not its full internal record shape) — this keeps the Operational/Knowledge boundary real in code, not just in documentation.
- `web/lib/workspace/**` does not import from or export to `web/lib/journey-leads`, `web/lib/journey-passport-otp`, `web/lib/journey-director`, or `web/lib/geo-validation` directly. Where SMV Workspace needs data those modules own (Lead ingestion, geo-place identity), it goes through an explicit, narrow adapter (Integration Architecture document) — never a direct cross-import — so the public-site modules remain unaware that SMV Workspace exists and cannot be broken by its evolution.
- Dependencies should always flow inward toward shared capabilities and never create circular module relationships, preserving long-term maintainability and independent module evolution.

## 5. Cross-Module Communication

Synchronous, in-process function calls only — one Next.js deployable, one Node.js runtime, no network hop between modules. This is consistent with every existing feature in this repository and is justified by SMV Workspace's scale (an internal team tool, not a system requiring independent scaling of its parts).

Notification generation is the one pattern worth naming explicitly: rather than a separate event bus, each module's `service.ts` calls `shared/notifications`' `emit()` function synchronously, within the same request/transaction as the state change that triggered it (e.g. `journey-planning/service.ts`'s "advance stage" function calls `notifications.emit({ type: "action_required", ... })` directly after the stage-transition write succeeds). This keeps Notification generation reliable (no dropped events from an unacknowledged queue message) at the cost of coupling notification-emission timing to the triggering request — an acceptable trade-off at this scale, revisited only if a future release introduces genuinely asynchronous, cross-system event needs.

Threshold-based Notifications that are not triggered by a user action (FR-WS-032, "Lead unclaimed longer than an Administrator-configured threshold") cannot be emitted this way, since no request occurs when a threshold is merely crossed by the passage of time — see the Integration Architecture document for the proposed scheduled-check mechanism.

This approach deliberately favours simplicity, predictability and transactional consistency over architectural complexity, remaining appropriate for the scale of Release 1.3.

## 6. Server/Client Boundary

- **Reads** (queue views, record detail, Dashboard cards) are performed in **Server Components**, calling the relevant module's `service.ts` directly — no API Route Handler hop is needed for a read that only the SMV Workspace UI itself consumes, consistent with idiomatic Next.js App Router usage and avoiding an unnecessary network round-trip.
- **Writes** (claim, advance stage, create Proposal Version, record a Vendor Confirmation, etc.) are performed through **Next.js API Route Handlers under `web/app/api/workspace/**`**, mirroring the existing, established pattern in this repository (`web/app/api/journey-passport/leads/route.ts` and its siblings), rather than Server Actions. This is a deliberate choice to extend an existing, proven pattern (Project Instructions §18/§21) rather than introduce Server Actions as a second, parallel mutation mechanism with no precedent in this codebase — Rad's implementation can follow the exact request-validation/response-shape conventions already established by the `journey-passport` API routes.
- **No `service_role` Supabase key is ever sent to, or used by, client-side code.** Every write and every RLS-sensitive read is performed server-side; the authenticated Workspace User's session is validated server-side (by the new authentication mechanism, Data Architecture document) before any database call is made. This preserves, rather than weakens, the existing "no client-side database credential" security posture (Architecture Discovery §9) even though SMV Workspace introduces authenticated users for the first time.
- Client Components are used only for genuinely interactive elements: claim/assign buttons, the contextual tab bar, in-place stage-progression controls, and form inputs — consistent with the UX Navigation Model's own description of these as lightweight, non-navigating actions (UX Information Architecture §9).

This boundary also preserves the existing repository security model by ensuring all privileged operations remain server-side regardless of future UI evolution.

## 7. Architectural Principles Applied

| Decision | Principle satisfied (Project Instructions §21) |
|---|---|
| Single Next.js app, new route segment | Preserve the existing stack; avoid unnecessary new abstractions |
| Extend `web/lib/<feature>/` five-file module pattern | Reuse shared components/patterns; avoid unjustified duplication |
| API Route Handlers for writes, Server Components for reads | Prefer existing patterns over unnecessary new abstractions |
| No message queue/event bus | Minimise dependencies |
| Module boundaries mirror the Specification's own Operational/Knowledge split | Do not invent scope or structure beyond what is Approved |
| `service_role` key never exposed client-side | Protect secret and environment boundaries |

## 8. Items Carried to Other Deliverables

- The precise RLS/authentication mechanism (Supabase Auth vs. an alternative) — **Data Architecture document**.
- Full entity list, relationships and lifecycle states — **Domain Model document**.
- The Destination Intelligence/WS1 Bootstrap Generator boundary (OQ-019) and the Lead/`journey_passport_leads` boundary (OQ-012) — **Integration Architecture document**.
- Every decision summarised above, with alternatives considered and trade-offs — **Architectural Decisions document**.
- Detailed implementation sequencing and engineering considerations — Engineering Planning (Rad) following approval of the complete Architecture baseline.

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*
*This document defines structure and boundaries only; it does not define the domain model, persistence strategy, or integration boundaries in detail — see the companion deliverables named in §8.*
