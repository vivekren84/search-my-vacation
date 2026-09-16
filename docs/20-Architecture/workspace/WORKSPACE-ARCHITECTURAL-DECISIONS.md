# SMV Workspace — Architectural Decisions

| Document Information | |
|---|---|
| Document Name | SMV Workspace Architectural Decisions |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 |
| Last Updated | 14 September 2026 |
| Predecessor | `WORKSPACE-INTEGRATION-ARCHITECTURE.md` v1.0 (this document consolidates decisions introduced across all five preceding deliverables) |
| Format precedent | `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`, `ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md` |

---

## 1. Purpose

This document consolidates every significant architectural decision proposed across the Architecture Discovery, Solution Architecture, Domain Model, Data Architecture and Integration Architecture documents into a single decision register, with alternatives considered, trade-offs, and explicit approval status. Per this EBC's own instruction, decisions here are **proposed for Product Owner and Archie sign-off**, not unilaterally enacted — Archie does not approve architecture on the Product Owner's behalf (Project Instructions §5), and implementation (Rad) should not begin against any decision below marked "Proposed" until it is confirmed.

This document is the architectural governance baseline for WS11. It records every significant architectural decision made during the Architecture phase, distinguishes decisions already confirmed through Product governance from those still requiring Product Owner approval, and provides the decision context that governs all subsequent engineering and QA activities for this Feature Workstream.

## 2. Architectural Principles

The decisions in this document were guided by the following architectural principles:
- Preserve the approved Product and UX baselines without introducing unintended scope.
- Prefer extension of existing platform capabilities over introducing new infrastructure.
- Reuse established repository conventions wherever practical.
- Introduce new architectural capabilities only where justified by approved business requirements.
- Keep implementation details separate from Product decisions.
- Ensure architectural decisions remain traceable to approved Product Specifications, RTM and Business Rules.
- Optimise for long-term maintainability over short-term implementation convenience.

## 3. Decision Register

### AD-WS11-001 — SMV Workspace is a new route segment within the existing `web/` Next.js application, not a separate application

- **Status:** Proposed.
- **Decision:** `web/app/workspace/**`, protected by new middleware, within the existing single Next.js deployable.
- **Alternatives considered:** (a) a separate Next.js application under the existing (currently empty) `apps/` directory; (b) a separate repository entirely.
- **Why rejected:** neither the Product Specification nor the UX package names any requirement (independent scaling, separate release cadence, separate team ownership, a genuinely different technology need) that would justify the operational cost of a second deployable — duplicated CI, environment-variable management, brand/design-token distribution, and deployment configuration — for an internal tool of this scale. Project Instructions §21 requires justifying new architecture; none was found.
- **Trade-off accepted:** SMV Workspace's build and deploy are coupled to the public site's — a public-site incident could, in principle, affect a concurrent Workspace deploy. Assessed as acceptable given Vercel's per-deployment isolation and the absence of any stated requirement for independent release cadence.
- **Full reasoning:** Solution Architecture §2.

### AD-WS11-002 — Introduce Supabase Auth and table-scoped Row Level Security for `workspace_*` tables

- **Status:** Approved by Product Owner.

The Product Owner approves the introduction of Supabase Authentication and Row Level Security (RLS) for all `workspace_*` tables as the security foundation for SMV Workspace.

The Product Owner further clarifies that SMV Workspace is a collaborative operational platform. Unless an Approved Business Requirement explicitly states otherwise, authenticated Workspace Users may view shared operational information.

Row Level Security is therefore adopted primarily to enforce:

- authentication
- role-based access control
- ownership-sensitive operations
- administrative capabilities
- user-specific information
- future confidential business data

rather than restricting general operational visibility across Workspace Users.
- **Decision:** Staff accounts via Supabase Auth; `workspace_users` profile table with a `role` column; RLS policies on every `workspace_*` table keyed on the authenticated identity via a `SECURITY DEFINER` helper function. Existing tables' `service_role`-only posture is unaffected.
Product Owner approval is required because this decision introduces a new platform capability that affects authentication, authorisation, operational administration and future engineering patterns across SMV Workspace.
- **Alternatives considered:** (a) continue the existing service-role-only pattern, with authorisation enforced entirely in application code (no RLS); (b) a bespoke session/credential table mirroring the existing OTP-challenge pattern rather than Supabase Auth.
- **Why (a) was rejected:** application-code-only authorisation across sixteen-plus object types and two roles is a materially higher risk of a missed check silently exposing cross-user data than Postgres-native RLS, and does not use Supabase's own built-in identity primitive the platform already provides.
- **Why (b) was rejected:** a bespoke credential/session mechanism would need to reimplement password handling, session expiry, and (eventually) password reset — capability Supabase Auth already provides — for no advantage over using it, and would be a larger new dependency (custom cryptographic/session code) than adopting the platform's own auth service.
- **Trade-off accepted:** Introducing Supabase Authentication establishes the first authenticated internal application within the Search My Vacation platform and therefore introduces operational responsibilities such as Workspace User onboarding, account lifecycle management, password management and role administration. The Product Owner considers these responsibilities an intentional consequence of evolving from a public website into an internal operational platform.
- **Product Owner clarification:** Workspace Users shall manage their own credentials after onboarding. Administrators may create users, initiate invitations or perform administrative password resets when required. Workspace Users may change or reset their own passwords through the approved authentication workflow. This capability forms part of Workspace operations rather than business functionality.
- **Full reasoning:** Architecture Discovery §9; Data Architecture §4.

### AD-WS11-003 — `workspace_` table-name prefix

- **Status:** Proposed, low-risk.
- **Decision:** every new table prefixed `workspace_`.
- **Alternatives considered:** a separate Postgres schema instead of a naming prefix.
- **Why rejected:** no existing table in this repository uses a non-`public` schema; introducing one would be a new pattern requiring its own justification this EBC does not find necessary at this table count (~20).
- **Full reasoning:** Data Architecture §2.

### AD-WS11-004 — Module boundary mirrors the Specification's nine modules and two governance patterns, using the existing `web/lib/<feature>/` five-file convention

- **Status:** Proposed.
- **Decision:** `web/lib/workspace/<module>/{types,validation,repository,service,client}.ts`, plus a `shared/` module for ownership, notifications, RBAC and audit.
- **Alternatives considered:** a single, undifferentiated `web/lib/workspace/` module; a domain-driven "bounded context per aggregate" structure finer-grained than the Specification's own nine modules.
- **Why rejected:** an undifferentiated module would not reflect the Specification's own approved Operational/Knowledge distinction and would grow unmanageably large; a finer-grained structure than the Specification's own module list would invent boundaries the Product Owner Review never approved.
- **Full reasoning:** Solution Architecture §4.

### AD-WS11-005 — No message queue or event bus; synchronous in-process notification generation; Vercel Cron for threshold-based checks

- **Status:** Proposed.
- **Decision:** Notification emission happens synchronously within the triggering request; threshold-based Notifications are checked by a scheduled Vercel Cron job calling the same service-layer functions.
- **Alternatives considered:** a dedicated background-job/queue system (e.g. a third-party job runner).
- **Why rejected:** no existing precedent in this repository, and no stated scale requirement (SMV Workspace is an internal team tool) justifies the added operational complexity and new dependency.
- **Full reasoning:** Solution Architecture §5; Integration Architecture §5.

### AD-WS11-006 — Destination Profile and `geo_places` remain two distinct, related concerns; `geo_places` stays canonical for geographic identity

- **Status:** Approved by Product Owner.
- **Decision:** `workspace_destination_profiles` owns operational/knowledge content and its own governance lifecycle; an optional, read-only `geo_place_id` reference links it to `geo_places` where applicable; the WS1 Bootstrap Generator pipeline is unchanged.
- **Product Owner clarification:** A Destination Profile represents a Search My Vacation operational destination — the unit of planning, knowledge, governance and sale — while `geo_places` represents canonical geographic identity. A Destination Profile may reference one or more geographic places where required to model destination regions, multi-place travel experiences or commercially-defined destinations. The separation of these concepts preserves independent ownership of geographic identity (WS1) and operational destination knowledge (WS11).
- **Alternatives considered:** merging Destination Profile into an extended `geo_places` schema, with governance-workflow columns added to that table.
- **Why rejected:** would retrofit a governance workflow (Draft/Under Review/Approved, multi-author) onto a table whose defining architectural property — deterministic regeneration from an externally-curated Bootstrap Workbook (`EBC-R1.3-WS1-002`) — depends on it *not* accumulating independent, Workspace-authored mutations between regenerations. Merging the two would put that already-shipped, QA-signed-off pipeline's core guarantee at risk.
- **Trade-off accepted:** a Destination Profile referencing a not-yet-existing `geo_places` row (PD-DI-003's pre-launch authoring case) is a nullable reference rather than a guaranteed join — slightly more defensive coding required wherever the two are displayed together.
This decision also preserves the architectural independence of Destination Intelligence (WS1) and SMV Workspace (WS11), ensuring future evolution of either feature does not require structural redesign of the other.
- **Full reasoning:** Integration Architecture §2.2.

### AD-WS11-007 — Lead is a reference relationship to `journey_passport_leads`, not the same table

- **Status:** Proposed — architecture's working assumption pending OQ-012's actual Product confirmation.
- **Decision:** `workspace_leads.journey_passport_lead_id`, nullable, populated only for site-originated Leads; a read-only ingestion adapter, no shared table.
- **Alternatives considered:** treating `journey_passport_leads` and Workspace's Lead as the same table (i.e., extending `journey_passport_leads` with Workspace columns).
- **Why rejected:** roughly half of the Lead sources the Business Lifecycle names (WhatsApp, telephone, email, walk-in, returning traveller, manual entry, vendor referral) have no `journey_passport_leads` counterpart at all; forcing every Workspace Lead through that table would require populating public-site-shaped columns for leads that never touched the public site.
- **Full reasoning:** Integration Architecture §2.1.

### AD-WS11-008 — Proposal Version and Vendor Quotation remain two distinct tables; no "Quotation" table is created

- **Status:** Confirmed by BR-011 (already Approved); implementation detail only.
- **Decision:** `workspace_proposal_versions` and `workspace_vendor_quotations`, no shared table, no reuse of the legacy "Quotation" name.
- **Note:** OQ-020 (whether the Specification's legacy "Quotation" object, §7.8, is the same concept as Proposal Version) remains open and is **not** resolved by this schema choice — this decision only confirms which two Approved entities the schema implements, per the Product Owner's explicit instruction not to merge or redesign ahead of that review.
- **Full reasoning:** Domain Model §2.5–§2.6.

### AD-WS11-009 — Master Itinerary → Traveller Itinerary modelled as an explicit foreign key plus copy-provenance metadata, not new generic notation

- **Status:** Proposed — this EBC's answer to OQ-021, offered for Product Owner/Sophie confirmation.
- **Decision:** `traveller_itineraries.source_master_itinerary_id`, not-null, plus a `copy_provenance` field recording the source version at copy time.
- **Alternatives considered:** a generic "parent/derived object" pattern applicable to any future object pair, not just this one.
- **Why rejected:** this is the first instance of this pattern in the domain model (Specification, RTM and UX package all say so explicitly); inventing a generic mechanism for a single current use case would be speculative abstraction ahead of a demonstrated second need, and the UX package's own "based on [Master Itinerary]" plain-language treatment (A-UX-04) already signals a plain reference is the intended user-facing shape.
- **Full reasoning:** Domain Model §2.7.

### AD-WS11-010 — Generic Ownership Model implemented as a reusable, opt-in column set

- **Status:** Proposed.
- **Decision:** `owner_id`/`claimed_at`/`assigned_at` columns, applied now to Journey Planning Record, Journey and Task; available to be added to any other table without a structural redesign once OQ-022 is confirmed.
- **Alternatives considered:** a single, table-agnostic "ownership" table referencing arbitrary rows by `entity_type`/`entity_id` (a fully generic/polymorphic ownership store).
- **Why rejected:** a fully polymorphic ownership table trades away foreign-key integrity and straightforward indexing for a generality OQ-022 does not yet require confirmed; per-table columns keep referential integrity and are simple to add to further tables later.
- **Full reasoning:** Domain Model §4.1.

### AD-WS11-011 — Archive-only, no permanent delete, for the six BR-007 object types; delete capability isolated to administrative/configuration data

- **Status:** Confirmed by BR-007 (already Approved and rewritten by Tiger's 13-Sep-2026 decision); implementation detail only.
- **Decision:** no `DELETE` grant, no `delete()` repository function, for Journey Planning Record, Journey, Traveller History, Proposal History, Vendor History, Destination Profile. A separate, narrowly-scoped RPC exists for permanent deletion of Workspace Configuration entries only.
- **Full reasoning:** Domain Model §4.3; Data Architecture §7.

### AD-WS11-012 — Vocabulary: the Product Specification/RTM is authoritative for all code, schema and data-model artefacts

- **Status:** Working default for this EBC's deliverables only — does **not** resolve the underlying documentation-governance question.
- **Decision:** every entity, table and field name in this document set uses the Specification/RTM's terms (Lead, Journey Planning Record, Journey; BR-001–BR-019). `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`'s "Inquiry" and its own separately-numbered BR-001–BR-006 are treated as business narrative, not implemented as separate code entities or rules.
- **Why:** per the Product Owner's explicit instruction for this EBC, Archie does not attempt to reconcile the two documents; the Specification/RTM is the more granular, Product-Owner-Review-approved model and is adopted as the implementation vocabulary so schema/code work is not blocked. The underlying terminology conflict — already flagged once by Sophie (A-UX-01/A-UX-02) without resolution — remains open and is restated here, not silently dropped, consistent with this project's disclose-rather-than-resolve convention (the WS3/WS4 naming-collision precedent in `RELEASE-1.3.md`).
- **Recommendation:** Tiger and Arjun should initiate a future documentation-governance activity to reconcile or formally retire one of the two terminology models. Until then, the Product Specification and RTM remain the implementation authority for engineering artefacts.
- **Full reasoning:** Architecture Discovery §11 (R-ARCH-04), §12 (A-ARCH-04); Domain Model §1.

### AD-WS11-013 — This document set uses "SMV Workspace," not "Journey Workspace," as the initiative name

- **Status:** Confirmed by explicit Product Owner instruction for this EBC.
- **Decision:** every document in this set refers to the whole nine-module initiative as **SMV Workspace** (`FEAT-R1.3-013`, WS11), matching `RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, the Product Specification and the UX Architecture package. "Journey Workspace" is used only to refer to the specific module of that name (Specification §6.4/§7.4).
- **Note:** this EBC's own title ("Journey Workspace Solution Architecture & Technical Design") and its labelling of `FEAT-R1.3-013` as "Journey Workspace" are not corrected by this decision — that is not within Archie's authority — but the mismatch is disclosed here and in the Architecture Discovery (§1) so a future reader is not misled about this document set's actual scope (all nine modules, not one).
- **Full reasoning:** Architecture Discovery §1.

## 4. Deferred Decisions

The following decisions have been intentionally deferred because they require additional Product direction, Business Analysis or future Feature implementation. Their deferral does not block completion of the Release 1.3 Architecture baseline.

| Item | Reason | Dependency |
|---|---|---|

| Notification external delivery channel (OQ-008) | Product decision | Notification model is channel-agnostic (Integration Architecture §3); Resend integration is additive when confirmed |
| Document file storage (OQ-014) | No confirmed requirement yet | Metadata-only for Release 1.3; Supabase Storage introduction deferred until confirmed |
| Detailed FR wording for ~185 approved-but-undrafted requirements (OQ-018) | Separate, unscheduled Business Analysis activity (Tiger's own 13-Sep-2026 decision) | Blocks field-level precision in a future revision of these documents, not this EBC's completion — this document set is built to the level of detail that is Approved (Vision, Business Purpose, Business Objects, Business Rules) |
| Low-Fidelity Wireframes / UX Standards (`FCR-022`) | Explicitly deferred by Sophie's own UX package to a future wireframing stage | This Solution Architecture is a named dependency for that future stage to begin (`FUTURE-CONSIDERATIONS.md` FCR-022's own "Dependencies" field) |

### Product Owner Ratifications

The following architectural proposals have now received explicit Product Owner approval following completion of the Architecture Baseline review:

- AD-WS11-002 — Supabase Authentication and Row Level Security for SMV Workspace.
- AD-WS11-006 — Separation of Destination Profile from `geo_places`.
- OQ-001 — Administrator and Privilege User operating model, including platform governance responsibilities, self-service credential management and role-based operational access.

These decisions are no longer considered proposed architecture and now form part of the approved WS11 Architecture baseline.

## 5. Open Implementation Considerations

- Exact RLS policy expressions and session-handling implementation detail (AD-WS11-002) — engineering-planning-level detail, not architecture.
- Vercel Cron schedule and retry behaviour (AD-WS11-005/Integration Architecture §5).
- The `geo_place_id` matching/linking workflow when a Destination Profile is created for a destination that *does* already exist in `geo_places` (AD-WS11-006) — a UX/engineering detail within the architectural boundary this document establishes.

## 6. Acceptance Criteria Mapping

- [x] Architecture Discovery complete — `WORKSPACE-ARCHITECTURE-DISCOVERY.md`.
- [x] Solution Architecture documented — `WORKSPACE-SOLUTION-ARCHITECTURE.md`.
- [x] Domain Model documented — `WORKSPACE-DOMAIN-MODEL.md`.
- [x] Data Architecture documented — `WORKSPACE-DATA-ARCHITECTURE.md`.
- [x] Integration Architecture documented — `WORKSPACE-INTEGRATION-ARCHITECTURE.md`.
- [x] Architectural Decisions documented — this document.
- [x] Product and UX baselines unchanged — no file under `docs/02-Product/` or `docs/04-UX/` was modified by this EBC.
- [x] Architectural assumptions explicitly documented — Architecture Discovery §12; restated per-decision above.
- [x] Repository conventions respected — `docs/20-Architecture/workspace/` created only after Product Owner approval (Architecture Discovery §2); no other repository structure changed; no Product/UX document touched; no destructive Git operation performed; nothing committed or pushed without authorisation (Project Instructions §26 — this EBC leaves the working tree for the Product Owner's own commit, consistent with this project's established practice).

## 7. Expected Outcome

SMV Workspace now has a complete, implementation-ready Solution Architecture: an overall structure (new route segment, existing application), a domain model tracing to every Approved Business Object, a data architecture with an explicit, sign-off-pending authentication/RLS proposal, an integration architecture with a concrete, non-blocking proposal for the WS11/WS1 Destination Intelligence reconciliation, and a consolidated decision register separating what is Proposed from what is already Confirmed by existing Product decisions. This provides a stable foundation for Rad's engineering planning and Keerthi's future test design, while preserving the approved Product and UX baselines exactly as this EBC required.

Following Product Owner approval of the proposed architectural decisions recorded in this document, this Architecture package becomes the implementation baseline for Engineering (Rad) and the verification baseline for QA (Keerthi).

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*
*Every decision marked "Proposed" above requires Product Owner and Archie sign-off before Rad begins implementation. Decisions marked "Confirmed" restate an already-Approved Product decision at the implementation level and carry no independent approval requirement of their own.*
