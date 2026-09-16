# SMV Workspace — Architecture Discovery

| Document Information | |
|---|---|
| Document Name | SMV Workspace Architecture Discovery |
| Persona | Archie — Technical Architect |
| Status | Complete — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| Feature | FEAT-R1.3-013 — SMV Workspace |
| EBC | EBC-R1.3-WS11-003 — Journey Workspace Solution Architecture & Technical Design |
| Last Updated | 14 September 2026 |
| Predecessor | `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` (UX Baseline, `EBC-R1.3-WS4-002`, `DEC-R1.3-007`) |
| Related Documents | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`; `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md`; `RELEASE-1.3-PRODUCT-BASELINE.md`; `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`; `JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md`; all six `docs/04-UX/workspace/` documents; `RELEASE-1.3.md`; `RELEASE-1.3-FEATURE-REGISTER.md`; `FUTURE-CONSIDERATIONS.md` |

---

## 1. Purpose

This document is the first deliverable of `EBC-R1.3-WS11-003`. Per the card's own instruction, it demonstrates architectural understanding of the SMV Workspace before any solution design, domain modelling or data architecture work begins. It does not introduce or resolve product or UX decisions; where it must make an architectural judgement call, that call is disclosed as an assumption (§12) or an architecturally-scoped Open Question (§13), never applied silently.

**Naming note, disclosed per this project's established convention of flagging rather than silently resolving naming collisions (`RELEASE-1.3.md` §5's WS3/WS4 disambiguation notes are the precedent):** the EBC that authorised this work titles itself "Journey Workspace Solution Architecture & Technical Design" and labels `FEAT-R1.3-013` as "Journey Workspace." Every repository governance document — `RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, the Product Specification, and the UX Architecture package — consistently names this initiative **SMV Workspace** (`FEAT-R1.3-013`, Workstream WS11), with **Journey Workspace** being the name of one specific module within it (Specification §6.4, the Phase 2/Delivery module). Per the Product Owner's explicit instruction during this EBC's readiness discussion, this document set uses **SMV Workspace** as the canonical name throughout and treats "Journey Workspace" as referring only to that one module, consistent with repository convention. The EBC's own title is not corrected — that is not this document's authority — but the mismatch is recorded here so a future reader is not misled into thinking this Solution Architecture covers only the Journey Workspace module rather than all nine approved modules.

This document establishes the architectural context for WS11 before solution design begins. It captures the business drivers, repository understanding, architectural constraints, assumptions and risks that govern all subsequent architecture deliverables while preserving the approved Product and UX baselines.

## 2. Repository Readiness Check

Performed before any repository review, per this EBC's own Repository Readiness Check and Project Instructions §14/§15.

| Check | Result |
|---|---|
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed, folder connected this session |
| Branch | `main` |
| Working tree before this task | Not clean — five pre-existing untracked files under `Claude outputs/` (EBC-R1.3-WS1-007/008/009/010 reports, `EBC-R1.3-WS3-006`), none created or touched by this activity |
| Remote sync | `main` up to date with `origin/main` |
| Recent history | Most recent commit `63b6ddc` — "docs(r1.3): baseline workspace UX and synchronise release governance" |
| `docs/20-Architecture/` | Exists, contains two flat Release 1.2 ADRs (`ADR-R1.2-WS3-001`, `ADR-R1.2-WS5-001`) |
| `docs/20-Architecture/workspace/` | **Did not exist at task start.** Per this EBC's Repository Structure Governance, this was reported to the Product Owner rather than created silently. **Resolved:** the Product Owner approved creating this folder, to keep this initiative's six architecture deliverables together, consistent with the existing `docs/02-Product/workspace/` and `docs/04-UX/workspace/` pattern. This document and its five companions are filed there. |
| Application code root | `web/` — a single Next.js App Router application (Next.js 16.2.10, React 19.2.4, TypeScript 5, strict mode, Tailwind CSS 4). No separate app exists under the sibling `apps/` directory, which is empty (contains only a `.DS_Store`). |
| Database | Supabase Postgres, migrations under `supabase/migrations/` (9 files, hand-written SQL, no ORM) |
| `web/CLAUDE.md` | Points to `web/AGENTS.md`: a caution that this Next.js version has breaking changes from training-data assumptions and that `node_modules/next/dist/docs/` should be consulted before writing code — noted for Rad's future implementation, not actioned by this Discovery |
| `docs/03-ADR/DECISIONS.md` | Confirms `docs/20-Architecture/` (not `docs/03-ADR/`) is the authoritative location for release-scoped ADRs, per a Release 1.2 Workstream 7 decision — consistent with this EBC's own instructed deliverable location |

Repository readiness is considered complete for this Feature Workstream. No additional repository investigation is required unless new Product scope is introduced.

## 3. Mandatory Repository Review — Completed

Every artefact named in this EBC's Mandatory Repository Review section was located and read in full (Product Foundation, Product Owner Reviews, Workspace Foundation, UX Baseline) or in the sections relevant to Journey Workspace/Release 1.3 (Release Governance, per that section's own instruction). No document was requested from the Product Owner that already existed in the repository. In addition, the following were reviewed to ground this Discovery in the actual codebase, consistent with Archie's obligation to inspect the repository before recommending architecture changes:

- `web/package.json` (dependency and script inventory)
- `web/lib/journey-leads/`, `web/lib/journey-passport-otp/`, `web/lib/geo-validation/`, `web/lib/journey-director/` (existing module structure and conventions)
- `supabase/migrations/*.sql` (schema, RLS and RPC conventions)
- `web/next.config.ts`, `web/tsconfig.json` (application configuration)
- `web/app/api/journey-passport/**` (existing API boundary pattern)
- `docs/03-ADR/ADR-000.md` and `DECISIONS.md`; the two existing `docs/20-Architecture/` ADRs (documentation conventions and precedent)

No architecture, engineering or implementation documentation beyond this list was required to demonstrate readiness; nothing in this list was found missing.

## 4. Architectural Understanding of SMV Workspace

SMV Workspace is the internal, staff-facing operational platform through which the Search My Vacation team manages every traveller relationship from first enquiry through planning, journey delivery and future travel opportunities. It has **no public or traveller-facing surface** (Specification §13, Assumption 1, Confirmed) and is architecturally unrelated to the existing public marketing/booking site's routes, beyond the two integration points named in §9 below.

The Product Specification and the UX Architecture both organise the nine approved MVP modules into two governance patterns (Specification §8.4–§8.5, adopted unchanged as the Information Architecture's primary grouping):

- **Operational Architecture** — Dashboard, Journey Planning, Journey Workspace, Notifications: the day-to-day working loop, where Journey Planning owns pre-confirmation commercial work and Journey Workspace owns post-confirmation delivery work, cleanly split by a one-way, system-triggered conversion event.
- **Knowledge Architecture** — Traveller Hub, Destination Intelligence, Vendor Management, Itinerary Studio: the organisational memory the operational loop draws on, sharing a recommend → review → approve governance shape with preserved history.
- **Settings** sits outside both as the administrative/configuration layer serving all eight other modules.

This shape is architecturally significant: it is not an arbitrary UX grouping but a genuine bounded-context signal — the two patterns have different data-lifecycle characteristics (transactional/workflow-driven vs. governed/versioned knowledge) and should be reflected in module and, where practical, schema boundaries (§6, Solution Architecture document).

## 5. Business Capabilities

Directly from the Specification (§2, §6) and the Business Lifecycle document (§2–§3), translated to their architectural implication:

The following business capabilities have been approved through the Product Specification and Business Lifecycle documentation. Their architectural implications define the scope of the Solution Architecture that follows.

| Business capability | Architectural implication |
|---|---|
| Single operational workspace, single source of truth | One application, one database of record for operational data — no parallel spreadsheet or external-tool integration is in scope for Release 1.3 |
| Daily decision support, not just record storage | Read-optimised aggregation (Dashboard) sitting over the same tables the operational modules write to — no separate reporting/analytics data store is justified at this scale |
| Team collaboration on shared operational work | Genuine multi-user, concurrent access with per-record ownership state — the first multi-user, authenticated surface in this repository (§9) |
| Operational visibility | Notification and audit-history capabilities are first-class, not bolted on |
| Nine modules, two governance shapes | Module boundaries in code should mirror the Operational/Knowledge split, not a flat nine-module list |

## 6. Architectural Drivers

1. **A genuinely new capability class: authenticated, role-based, multi-user access.** Every existing feature in this repository (Journey Passport, Journey Director, geo/destination search, traveller stories) is public-facing, anonymous, and writes to Postgres exclusively through a server-side `service_role` key with Row Level Security revoking all access from `anon`/`authenticated` (§9 below). SMV Workspace requires named staff accounts (Administrator, Privilege User), session management and role-scoped access to sixteen-plus business objects. This is the single largest new architectural surface this EBC must design, and it did not exist anywhere in the repository to extend from.
2. **A two-tier reusable-knowledge model with no existing precedent.** Master Itinerary → Traveller Itinerary (PD-IS-001–003) is the first parent/derived object pair in the Specification's object model (flagged by both Arjun, OQ-021, and Sophie, R-UX-04/A-UX-04). No existing data-model notation in this repository covers it.
3. **A governance workflow shape (Draft → Under Review → Approved) applied consistently across Destination Profile and, more loosely, Master Itinerary/Learning Repository content** — a recommend/review/approve pattern this repository has not previously implemented in its data layer.
4. **A one-way, system-triggered state-machine conversion** (Journey Planning Record → Journey, BR-012/PD-JW-001) that must be atomic and must never be reachable by any other write path.
5. **~185 of 223 approved Functional Requirements exist only as approved topic groups, not drafted wording (OQ-018).** This Discovery, and the Solution Architecture that follows it, therefore design to the Specification's Vision, Business Purpose, Business Objects and Business Rules — the level of detail that is Approved — and flag, rather than invent, the field- and validation-level precision that individual FR wording would otherwise supply.

These architectural drivers collectively explain why SMV Workspace cannot be implemented by simply extending existing public-site patterns and instead requires a dedicated architectural baseline.

## 7. Quality Attributes

| Attribute | Assessment |
|---|---|
| Security | Elevated priority — first authenticated, role-scoped surface in the repository; must not weaken the existing "no client-side database credential" posture |
| Scalability | Moderate — an internal team tool with a bounded, non-viral user count, but NFR-WS-005 explicitly requires the data model not assume a fixed, small number of team members or Vendors |
| Maintainability | High priority — nine modules, ~223 approved Functional Requirements, and an explicit Project Instructions §21 preference for reusing established patterns over new abstractions |
| Auditability | First-class requirement — NFR-WS-004 (every stage transition and Reassignment recorded with who/when) and the workspace-wide historical-preservation principle (Specification §8.7) |
| Usability/Performance | NFR-WS-001 (queue views load within a target Archie confirms) and NFR-WS-007 (minimise steps from "seeing what needs attention" to "taking the next action") — both still Proposed, not Approved; addressed as design targets, not hard SLAs, until confirmed |
| Accessibility | NFR-WS-006 — meet the existing interactive-control/keyboard/reduced-motion standard already established for the public site |

## 8. Scalability Considerations

- The data model must not hard-code a small, fixed roster of Workspace Users or Vendors (NFR-WS-005) — role and ownership fields reference a `workspace_users` table, not an enum.
- Postgres/Supabase, already the platform of record, scales adequately for an internal-team workload of this shape; no new database technology is justified.
- Queue views (Journey Planning, Journey Workspace, Vendor Confirmations) are the highest-cardinality read paths and should be indexed for stage/owner/date filtering from the first migration, rather than retrofitted.

## 9. Security Considerations

This is the Discovery's most material finding.

- **Every existing Supabase-backed feature in this repository (`journey_passport_leads`, `journey_passport_otp_challenges`, `geo_places`/`geo_aliases`) follows one consistent pattern: Row Level Security is enabled, all privileges are revoked from `anon` and `authenticated`, and only `service_role` is granted access.** All reads and writes happen server-side, through Next.js API Route Handlers, using a secret key that is never exposed to the browser. No Supabase Auth account exists anywhere in this repository today (confirmed by repository search — no `auth.*` schema usage, no `middleware.ts`, no session-handling code of any kind).
- SMV Workspace cannot use this pattern unmodified: it requires distinguishing *which* staff member is acting, enforcing *their* role's permissions, and supporting genuine concurrent multi-user access — none of which "one shared secret key, no identity" can express.
- This Discovery's assumption (§12, A-ARCH-01) is that SMV Workspace will be the first consumer of **Supabase Auth**, with Postgres-native Row Level Security policies keyed on the authenticated user's identity and role, replacing the "service-role-only" pattern *for Workspace tables only* — the existing public-facing tables and their service-role-only posture are unaffected. This is flagged as a material architecture decision requiring explicit Product Owner and Archie sign-off (Project Instructions §5: "authentication or authorisation" is named as an architecture-approval trigger) and is carried into the Architectural Decisions document (§14) as a proposal, not a fait accompli.
- Environment-variable and secret-handling discipline (Project Instructions §25) applies unchanged: no Supabase Auth secret, service-role key, or session-signing secret is fabricated, committed, or exposed in documentation.

Because authentication and authorisation represent new platform capabilities for this repository, no implementation should proceed until the corresponding architectural decision receives explicit Product Owner approval.

## 10. Maintainability Considerations

- The repository already has a consistent, well-established module pattern for a Supabase-backed feature: `web/lib/<feature>/{types,validation,repository,service,client}.ts`, each file narrowly responsible, no ORM, hand-written PostgREST calls and `SECURITY DEFINER` RPC functions for atomic multi-step operations. This Discovery recommends extending — not replacing — this pattern for every SMV Workspace module (elaborated in the Solution Architecture document), consistent with Project Instructions §18/§21 (prefer existing patterns; avoid unnecessary new abstractions).
- Configuration is already centralised under `web/config/*.config.ts` (Project Instructions §21, "centralise configuration") — Workspace Configuration (Specification §7.15) should follow this same convention for anything that is genuinely static/deploy-time, while anything the Product Specification intends as *runtime*, database-backed configuration (BR-018, "Configuration Over Code") belongs in the database, not a config file — this distinction is elaborated in the Solution Architecture and Data Architecture documents.
- No existing dependency in `web/package.json` provides authentication, RBAC, or a UI component/data-grid library suited to a dense internal operational tool (the current dependency list — `next`, `react`, `react-dom`, `libphonenumber-js` — is entirely public-site-oriented). Any such addition requires Archie's assessment and Product Owner approval per Project Instructions §21 and is flagged, not silently assumed, in the Architectural Decisions document.

These conventions minimise architectural divergence across the repository and reduce long-term maintenance effort by extending proven implementation patterns rather than introducing new frameworks or organisational models.

## 11. Technical Risks

| ID | Risk | Assessment |
|---|---|---|
| R-ARCH-01 | No authentication/authorisation precedent exists in this repository; SMV Workspace must introduce this capability from a standing start, correctly, for a system handling sixteen-plus operational business objects. | High impact if under-designed. Addressed as the central concern of the Solution Architecture and Data Architecture documents. |
| R-ARCH-02 | Destination Profile's Workspace-governed authoring model (PD-DI-001–006) is explicitly unreconciled with the already-implemented WS1 Bootstrap Generator/`geo_places` pipeline (OQ-019). | Architecturally material — addressed with a proposed reconciliation in §13 and the Integration Architecture document, offered for Product Owner ratification, not assumed resolved. |
| R-ARCH-03 | ~185 of 223 approved Functional Requirements are undrafted (OQ-018); several Business Rules (BR-001, BR-003–005, BR-008, BR-009) are "Approved (name) / Proposed (behaviour)" only. | Limits how precisely field-level validation and acceptance criteria can be specified in the Domain Model and Data Architecture documents; addressed by designing to Approved Vision/Business Purpose/Business Objects/Business Rules and flagging where FR-level precision is still pending, not inventing it. |
| R-ARCH-04 | A genuine, unreconciled terminology and rule-numbering conflict exists between `JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md` (Inquiry, BR-001–BR-006 as its own registry) and the Product Specification/RTM (Lead → Journey Planning Record → Journey, BR-001–BR-019). Sophie's UX Discovery already flagged this once (A-UX-01/A-UX-02) without resolving it. | Per the Product Owner's explicit instruction for this EBC, this Discovery does **not** attempt to resolve it. The architectural stance (adopted here and carried through every subsequent document) is: the Product Specification/RTM's vocabulary and BR-0XX numbering is authoritative for all code, schema and data-model artefacts, because it is the more granular, Product-Owner-Review-approved model; the Business Lifecycle document's "Inquiry" and its own BR-001–BR-006 remain valid as business narrative and are not implemented as separate code entities or rules. This is a scoping default for implementation, not a documentation-governance resolution — that remains Tiger/Arjun's to make. |
| R-ARCH-05 | This EBC's own title and `FEAT-R1.3-013` label ("Journey Workspace") do not match the repository's actual name for this initiative ("SMV Workspace," §1 above). | Low risk once disclosed; addressed by using "SMV Workspace" consistently throughout this document set per the Product Owner's explicit instruction. |
| R-ARCH-06 | No UI component library, data-grid, or design pattern exists yet for a dense, internal, multi-record operational interface — the existing brand system and component library (`web/components/`) is built for a public marketing/booking experience. | Moderate — a Sophie/Archie sequencing item for the future wireframing stage (`FCR-022`), not an architecture blocker, but noted so Solution Architecture does not silently assume a component library that does not exist. |

## 12. Architectural Assumptions

Disclosed explicitly, consistent with the Product Specification's own "Assumption" labelling convention (§13): 

The following assumptions are documented to ensure transparency during architectural design. They are not Product decisions and should not be interpreted as approved implementation scope unless subsequently ratified through Product governance.

- **A-ARCH-01** — SMV Workspace will introduce Supabase Auth for staff accounts, with Row Level Security policies for Workspace tables keyed on the authenticated user's identity and role. This does not affect the existing public-facing tables' service-role-only posture. Proposed, not yet Product-Owner-approved (§9, §14).
- **A-ARCH-02** — SMV Workspace is a new, protected route segment within the existing `web/` Next.js application (e.g. `web/app/(workspace)/...`), not a separate application. Rationale and alternatives are in the Solution Architecture document (§AD-WS11-001).
- **A-ARCH-03** — New database tables use a `workspace_` naming prefix to namespace them from the existing `journey_passport_*`/`geo_*` tables, following this repository's existing convention of descriptive table-name prefixes per feature area.
- **A-ARCH-04** — The Product Specification/RTM's vocabulary (Lead, Journey Planning Record, Journey; BR-001–BR-019) is authoritative for all architecture, schema and code artefacts, per R-ARCH-04 above and the Product Owner's explicit instruction not to attempt reconciliation with the Business Lifecycle document within this EBC.
- **A-ARCH-05** — No message queue, event bus, or separate microservice is justified at SMV Workspace's scale; cross-module communication is synchronous, in-process function calls within a single Next.js deployable, consistent with every existing feature in this repository.
- **A-ARCH-06** — Destination Profile (Workspace-governed) and the existing `geo_places`/Travel Region records (Bootstrap Generator-governed) are two distinct, related concerns: Destination Profile owns operational/knowledge content for a place; `geo_places` continues to own geographic identity and existence. This is Archie's proposed reconciliation of OQ-019, offered for Product Owner ratification (§13, Integration Architecture document), not an assumed-resolved fact.

## 13. Open Questions Affecting Architecture

Every Product Open Question the Specification/RTM/Baseline Index routes to Archie, with this Discovery's assessment of architectural impact and — where useful — a recommended architectural approach. **None of these are resolved here**; each is carried into the Architectural Decisions document as a proposal for Product Owner confirmation, per this EBC's own instruction ("identify architectural impact, recommend architectural approaches, document dependencies — do not resolve Product decisions").

| ID | Open Question | Architectural Impact | Recommended Approach |
|---|---|---|---|
| OQ-001 | Administrator/Privilege User capability split | Directly determines the RBAC policy matrix (roles, per-action permissions) — cannot be finalised without it | Architecture introduces a two-role RBAC model now (Administrator, Privilege User) with role-checks centralised in one shared authorisation module, so the *mechanism* is ready before the *capability matrix* is confirmed; screens/actions marked "Role TBC" in the UX package are implemented behind the same mechanism with a conservative (Administrator-only) default until confirmed |
| OQ-006 | Itinerary/Quotation version cardinality | Reshaped by the Master/Traveller Itinerary split; affects whether a Traveller Itinerary has one or many linked Proposal Versions | Model as one-to-many (a Traveller Itinerary may be referenced by multiple Proposal Versions over its revision history, consistent with PD-JP-002's "multiple Proposal Versions, one current") pending Product Owner confirmation |
| OQ-008 | Notification delivery channel (in-Workspace only vs. also external) | Determines whether an email/SMS integration (Resend, already integrated elsewhere in this repository) is in scope for Release 1.3 Notifications | Architecture designs the Notification *generation* and *state* model channel-agnostically now; external delivery (reusing the existing Resend integration pattern) is an additive, deferred capability, not a blocking dependency |
| OQ-012 | Lead / `journey_passport_leads` relationship | Determines whether SMV Workspace's Lead object is the same database table as the existing public-facing `journey_passport_leads`, or a related-but-distinct object | Architecture's working assumption (A-ARCH-06 note: this is distinct from OQ-019) is a **reference relationship**, not identity — a new `workspace_leads` row may originate from and link to a `journey_passport_leads` row (for site-originated Leads) or be created directly (for phone/WhatsApp/walk-in/manual entries, which have no `journey_passport_leads` counterpart at all) — proposed in the Data Architecture and Domain Model documents, pending Product Owner confirmation |
| OQ-014 | Document file upload/storage requirement | Determines whether Supabase Storage (unused elsewhere in this repository) is a new dependency | Addressed in the Integration Architecture document as a scoped, deferred capability — the Domain Model includes a Document entity with metadata only; actual file storage is out of this EBC's Data Architecture until confirmed |
| OQ-019 | Destination Profile / WS1 Bootstrap Generator reconciliation | The most architecturally material open item this EBC must address — directly determines Destination Intelligence's schema and integration boundary | Addressed in full in the Integration Architecture document; summarised at A-ARCH-06 above |
| OQ-020 | "Quotation" vs. "Proposal Version"/"Vendor Quotation" | Determines whether one or two database entities/tables are needed for Journey Planning's commercial-document model | Architecture keeps Proposal Version and Vendor Quotation as two distinct tables per BR-011's explicit "never merged" instruction, and does not create or reuse a "Quotation" table — addressed in the Domain Model document |
| OQ-021 | Master Itinerary → Traveller Itinerary notation | The first parent/derived object relationship in this domain model | Architecture proposes a standard foreign-key reference plus an explicit copy-provenance field, deliberately not inventing new generic modelling notation — addressed in the Domain Model document (§AD-WS11-009) |
| OQ-022 | Generic Ownership Model uniformity | Determines which tables need `owner_id`/claim-state columns | Architecture makes the ownership pattern a reusable, opt-in column set available to any table (Domain Model document), so the *mechanism* does not block on the Product Owner's scope decision; which tables actually use it is confirmed later without a schema redesign |

## 14. Architectural Opportunities

The following opportunities arise naturally from the approved Product and UX baselines and may improve maintainability, consistency and future extensibility without altering Release 1.3 scope.

- **Row Level Security is a natural fit for the Generic Ownership Model and the Administrator/Privilege User split.** Rather than enforcing ownership and role checks only in application code, Postgres-native RLS policies can enforce "an Administrator can see everything; a Privilege User can see unclaimed items and their own claimed items" directly at the data layer — reducing the risk of an application-layer authorisation bug exposing data across the whole team.
- **The Specification's own two-pattern grouping (Operational/Knowledge Architecture, §8.4–§8.5) gives module boundaries a business-approved basis**, rather than requiring Archie to invent bounded contexts from scratch — directly reducing the risk of an over- or under-fragmented module structure.
- **The existing `web/lib/<feature>/` pattern is mature enough (five precedents: `journey-leads`, `journey-passport-otp`, `geo-validation`, `journey-director`, `traveller-stories`) to extend with high confidence** rather than requiring a new architectural pattern to be invented and separately justified.
- **The consistent Informational/Action-Required Notification model and the consistent Claim/Assign/Reassign ownership model (both already UX-approved) mean one shared, well-tested implementation of each can serve all nine modules**, rather than nine bespoke implementations — directly reducing both build effort and long-term maintenance surface.

## 15. Readiness Assessment

This Discovery confirms the Archie Prerequisites in Project Instructions §16.3 are met: repository/system context (§2–§3), current architecture (§9–§10, and the existing `web/lib/` precedent), relevant components (§4–§5), current integrations (§9, Resend/Supabase), data flow (elaborated in the Data/Integration Architecture documents that follow), environment constraints (§9, no Supabase Auth precedent), deployment model (unchanged — single Next.js app on Vercel), security considerations (§9, the Discovery's central finding), performance expectations (§7–§8, NFRs still Proposed, treated as design targets), and approved requirements (the Release 1.3 Product Baseline and UX Baseline, both certified Ready for Solution Architecture per `DEC-R1.3-006`/`DEC-R1.3-007`).

Solution Architecture, Domain Model, Data Architecture, Integration Architecture and Architectural Decisions (Sections 2 onward of this EBC's deliverable set) may proceed.

With this Discovery complete, the architectural problem space is considered sufficiently understood to proceed into detailed Solution Architecture. Any future architectural changes should be evaluated against the constraints, assumptions and risks documented here.

---

*Prepared by Archie (Technical Architect) on behalf of Team Satvi, per `EBC-R1.3-WS11-003`.*
*This document establishes the architectural understanding required before Solution Design begins, per this EBC's own instruction. It introduces no Product or UX decision and modifies no Product Specification, RTM, Business Lifecycle, UX Design Brief, or UX Architecture deliverable.*
