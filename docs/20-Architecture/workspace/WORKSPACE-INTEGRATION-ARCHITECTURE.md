# SMV Workspace — Integration Architecture

| Document Information | |
|---|---|
| Document Name | SMV Workspace Integration Architecture |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 |
| Last Updated | 14 September 2026 |
| Predecessor | `WORKSPACE-DATA-ARCHITECTURE.md` v1.0 |

---

## 1. Purpose

This document defines every point where SMV Workspace touches something outside its own `workspace_*` / `web/lib/workspace/**` boundary: internal integrations with existing repository modules, external service integrations, the API boundary, event flow and the integration principles that govern all of them.

The Product Owner has approved the integration model described in this document, including the reconciliation between Destination Intelligence and the WS1 Bootstrap Generator, establishing these integration boundaries as part of the approved WS11 Architecture baseline.

## 2. Internal Integrations

Internal integrations are intentionally designed to preserve Feature ownership. SMV Workspace consumes existing platform capabilities through clearly defined boundaries without assuming ownership of data or behaviour belonging to other Workstreams.

### 2.1 Lead Ingestion — Journey Passport Boundary (OQ-012)

The existing public Journey Passport flow writes to `journey_passport_leads` via `web/lib/journey-leads` and `web/app/api/journey-passport/leads/route.ts`. SMV Workspace's Lead (Domain Model §2.1) must ingest **both** these site-originated Leads and Leads with no such counterpart at all (phone, WhatsApp, email, walk-in, returning-traveller, manual entry, vendor referral — Business Lifecycle §4's own list).

**Proposed integration shape:** a narrow, read-only adapter (`web/lib/workspace/journey-planning/leadIngestion.ts`) that:

- Reads new/unclaimed `journey_passport_leads` rows (via the existing `service_role` PostgREST access — SMV Workspace's server-side code already runs with equivalent privilege for its own tables, so no new credential is needed) and surfaces them into the Journey Planning unclaimed queue as `workspace_leads` rows referencing the source row (`journey_passport_lead_id`, Data Architecture §8).
- Never writes to `journey_passport_leads` — that table's write path remains exclusively `web/lib/journey-leads`, preserving the Solution Architecture's rule that public-site modules are unaffected by SMV Workspace's existence.
- Provides the one remaining piece of BR-001 (mobile-number matching) that spans both surfaces: when a `workspace_leads` row is created (from either source), a lookup against `workspace_travellers` by normalised mobile number runs, consistent with the existing mobile-normalisation logic already implemented in `journey-leads/validation.ts` (reused, not reimplemented — Project Instructions §18, prefer extension over parallel implementation).

This is the working architectural answer to OQ-012's *mechanism*; OQ-012's actual question (does SMV Workspace's Lead have the *same identity* as `journey_passport_leads`, or merely a *reference* to it) remains open and does not block this adapter's implementation either way — a reference relationship works whichever way the Product Owner ultimately confirms the conceptual question.

### 2.2 Destination Intelligence — WS1 Bootstrap Generator Boundary (OQ-019)

**This is the most architecturally material integration decision in this EBC.**

**Current state (confirmed by repository inspection):** the WS1 Bootstrap Generator (`web/scripts/bootstrap-workbook/`) produces `geo_places`/`geo_aliases` — Postgres tables holding canonical geographic identity, existence, naming and hierarchy, sourced from an externally-curated Bootstrap Workbook, `service_role`-only, no authoring interface. This pipeline is fully implemented and QA-signed-off (`EBC-R1.3-WS1-010`, Final QA PASS) as of this EBC.

**What the Product Owner Review approved (PD-DI-001–006, Specification §6.6/§7.14):** a **Destination Profile** object, authored and progressed **inside the Workspace** through a Draft → Under Review → Approved governance lifecycle — a fundamentally different content-ownership model (Workspace-authored operational/knowledge content) from `geo_places`' externally-curated geographic identity.

**These are not the same concern, and this Integration Architecture proposes they should not become one table or one pipeline:**

| Concern | Owner (proposed) | Content |
|---|---|---|
| Geographic identity — does this place exist, what is it canonically called, where does it sit in the region hierarchy | `geo_places`/`geo_aliases`, WS1 Bootstrap Generator pipeline (**unchanged by this EBC**) | Place existence, canonical name, aliases, region/hierarchy |
| Destination operational/knowledge content — best travel periods, seasonal guidance, traveller suitability, operational recommendations, governance status | `workspace_destination_profiles`, SMV Workspace (**new, this EBC**) | The content PD-DI-001–006 actually approved |

A `workspace_destination_profiles` row carries an **optional** (`nullable`) `geo_place_id` reference into the existing `geo_places` table (Data Architecture §8) — optional specifically because PD-DI-003 explicitly permits creating a Destination Profile *before* Search My Vacation has commercially launched a destination, which may precede that place existing in `geo_places` at all. Where a `geo_place_id` is present, it is read-only from SMV Workspace's side: Destination Profile never writes to, overrides, or bypasses the Bootstrap Generator's ownership of geographic identity.

### Product Owner Ratification

The Product Owner approves this integration model as the architectural baseline for Release 1.3.

`geo_places` and `workspace_destination_profiles` remain distinct business concepts with independent ownership responsibilities.

- `geo_places` remains the authoritative source for canonical geographic identity, including place existence, canonical naming, aliases and geographic hierarchy.
- `workspace_destination_profiles` represents Search My Vacation's operational destination knowledge, including traveller suitability, operational recommendations, governance workflow and commercial readiness.

A Destination Profile may reference one or more geographic places where appropriate, allowing the Workspace to represent:

- an individual destination
- a destination region
- a commercially-defined travel experience spanning multiple geographic places

while preserving independent ownership between WS1 and WS11.

This integration model now forms part of the approved WS11 Architecture baseline.

This separation also ensures that future evolution of either WS1 or WS11 can occur independently while maintaining a stable integration contract between the two features.

### 2.3 Traveller Hub — No Direct Integration Needed

Traveller Hub's data is entirely new (`workspace_travellers`) — there is no existing "Traveller" table anywhere in the repository to integrate with or migrate from. The only cross-boundary touch is the Lead-ingestion mobile-matching described in §2.1.

## 3. External Integrations

External integrations are limited to capabilities already present within the approved platform or explicitly justified by approved Product requirements. No speculative platform dependencies are introduced.

| Integration | Status | Treatment |
|---|---|---|
| Supabase Postgres | Existing platform, extended | New `workspace_*` schema (Data Architecture document) |
| Supabase Auth | Approved platform capability | Security in accordance with the approved Administrator and Privilege User operating model. |
| Resend (email) | Existing, reused | For any Workspace outbound notification email, using the exact same direct-REST-API pattern already implemented in `web/lib/journey-leads/email.ts` (`api.resend.com`, no SDK) — **conditional on OQ-008** (Notification delivery channel) being confirmed as including external delivery; the Notification *generation* and *state* model (Data Architecture §5) is channel-agnostic and does not need to change if email delivery is added later |
| Vercel | Existing platform, unchanged | Single deployment, no change |
| Supabase Storage | **Not introduced by this EBC** | Document (Domain Model §2.11) is metadata-only for Release 1.3; file storage is deferred pending OQ-014 confirmation, avoiding a new dependency (Project Instructions §21) ahead of a confirmed requirement |
| WS1 Bootstrap Generator (`geo_places`) | Existing, read-only reference | §2.2 above |
| `journey_passport_leads` | Existing, read-only reference | §2.1 above |

No integration with any tool outside this repository (a CRM, an email marketing platform, a calendar system) is in scope — none was named in the Product Specification, RTM, or UX package, and none is introduced speculatively (Project Instructions §20, do not silently implement out-of-scope capability).

## 4. API Boundary

- New route namespace: `web/app/api/workspace/**`, mirroring the existing `web/app/api/journey-passport/**` structure and conventions exactly — one Route Handler per mutation-shaped operation (e.g. `web/app/api/workspace/journey-planning/[id]/claim/route.ts`, `.../advance-stage/route.ts`), request validation and typed error response following the same pattern as `web/app/api/journey-passport/leads/route.ts`.
- Reads that only the SMV Workspace UI itself consumes do not need an API route at all — Server Components call `service.ts` functions directly (Solution Architecture §6). An API route is created only where a genuine external caller exists (see §5, scheduled checks) or where a stable, independently-testable boundary is useful for Keerthi's future QA.
- No public API surface is exposed for SMV Workspace — every route under `/api/workspace/**` requires an authenticated session (enforced by middleware, Solution Architecture §2), consistent with SMV Workspace having no traveller-facing surface at all.

The API boundary exists to support secure mutation operations and clearly defined integration points without unnecessarily expanding the public API surface of the platform.

## 5. Event Flow

- **User-triggered events** (a stage advance, a claim, a Vendor Confirmation recorded): synchronous, in-process, within the same request that performed the triggering write (Solution Architecture §5) — no queue.
- **Threshold-triggered Notifications** (FR-WS-032, "Lead unclaimed longer than an Administrator-configured threshold") have no triggering request to hook into — the condition becomes true purely through the passage of time. This document proposes a **Vercel Cron job** (Vercel's native scheduled-invocation feature, no new third-party dependency) hitting a protected `web/app/api/workspace/cron/check-thresholds/route.ts` endpoint on a schedule (e.g. hourly), which calls the same `journey-planning/service.ts` and `shared/notifications` functions any other code path would call — **not** a bespoke worker process or external scheduler. This is a new integration surface (a cron-invoked, non-user-session endpoint, authenticated by a Vercel Cron secret rather than a Workspace User session) and is flagged explicitly, not silently assumed, in the Architectural Decisions document.

This event strategy intentionally favours operational simplicity and deterministic behaviour over asynchronous architectural complexity, remaining appropriate for the scale and operational characteristics of Release 1.3.

- No other asynchronous event flow is proposed. Project Instructions §21 (minimise dependencies) and the Architecture Discovery's own assumption (A-ARCH-05, no message queue is justified at this scale) both apply.

## 6. Integration Principles

- **Server-side secrets only.** Every integration listed in §3 is called with a server-side credential (`service_role` key, Supabase Auth session validated server-side, Resend API key, Vercel Cron secret) — none is ever sent to or usable from the browser, preserving the existing security posture (Data Architecture §4.2) even as SMV Workspace introduces genuinely new integration surfaces.
- **Typed, wrapped external calls.** Every external call (to `geo_places`, `journey_passport_leads`, Resend, or a future Supabase Storage call) is wrapped with an explicit timeout and a typed error (mirroring `JourneyLeadRepositoryError`'s existing pattern) — no bare, unguarded `fetch` call is introduced.
- **Read-only across module/feature boundaries by default.** SMV Workspace reads from `geo_places` and `journey_passport_leads`; it never writes to either. Any future requirement to write back (e.g. marking a `journey_passport_leads` row as "converted into a Journey Planning Record") is a new, explicitly-scoped integration decision, not assumed by this document.
- **No speculative integration.** Supabase Storage, an external CRM, an SMS provider beyond the existing `journey-passport-otp/sms.ts` precedent, or any other capability not named by an Approved Functional Requirement or Product Decision is not introduced — consistent with Project Instructions §20 (do not silently implement out-of-scope capability).
- Feature ownership remains explicit. Every integration preserves the principle that the originating Feature continues to own its business logic and data, while consuming Features interact only through approved interfaces and read-only references where appropriate.

## 7. What This Document Does Not Do

- It does not resolve OQ-008 (Notification delivery channel), OQ-012 (Lead identity/reference) or OQ-014 (Document storage requirement). Each has a proposed architectural treatment that allows Engineering to proceed without blocking Release 1.3 implementation.
- OQ-019 (Destination Profile / `geo_places` reconciliation) has been approved by the Product Owner and is no longer considered an outstanding architectural question.
- It does not specify the Vercel Cron schedule, retry behaviour, or exact endpoint contract — Rad's implementation detail against the pattern established in §5.
- It does not introduce any integration not already named by an Approved Product capability.

With the completion of this Integration Architecture, the Architecture baseline for WS11 is considered complete. Subsequent Engineering and QA activities should implement and validate the Workspace strictly against the approved Product, UX and Architecture baselines established during Release 1.3.

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*

*The integration model described in this document has been reviewed and ratified by the Product Owner as part of the WS11 Architecture baseline. In particular, the separation of `geo_places` and `workspace_destination_profiles` is now an approved architectural decision (AD-WS11-006).*

---

## 8. WS13 Revision Note (`EBC-R1.3-WS13-003`, 26 September 2026)

*Additive note. Sections above are unchanged.*

- **Journey Planning ↔ Journey Workspace contract:** the conversion RPC v2 is the only Journey INSERT path (BR-012). It carries confirmed dates (CM-01), owner, destination, trip parameters and the accepted Proposal Version, and performs supersession for replacement planning records (CM-02) in the same transaction (AD-WS13-003).
- **Scheduled checks:** the first implementation of §5's Vercel Cron pattern is a daily `journey-alerts` sweep (`app/api/workspace/cron/journey-alerts`, `CRON_SECRET` bearer, server-side `SUPABASE_SECRET_KEY`) (AD-WS13-005).
- **Bootstrap read modules:** `lib/workspace/vendor-management` (active vendors, read-only) and `lib/workspace/settings` (configuration, read-only) are introduced under the Bootstrap Ownership Principle (`DEC-R1.3-013`), so `journey-workspace` never reads another module's tables directly (AD-WS11-004).
- No new external service is introduced. Supabase Storage remains out of scope (D-10).

### 8.1 Replacement contract (`EBC-R1.3-WS13-004A`, 27 September 2026)

*Additive.*
- **At material-change start** (`workspace_journey_start_material_change`, one transaction), Journey Workspace → Journey Planning:
  - planning record with POD-06 defaults, pre-filled trip parameters, destination and Service Category;
  - proposal Version 1 = the original's accepted snapshot;
  - Operational Notes copied as `internal_comment`;
  - one `requested` vendor quotation per Booked booking (no amount).
- **At conversion** (conversion v2, replacement branch), Journey Planning → Journey Workspace: new Journey; Primary Operational Contact copied from the original; Journey Documents copied (Verified→Received, N/A→Outstanding); original marked Superseded.
- The Decision dialog pre-fills the original's dates through `replaces_journey_id`. No exact-date field is added to Journey Planning.
