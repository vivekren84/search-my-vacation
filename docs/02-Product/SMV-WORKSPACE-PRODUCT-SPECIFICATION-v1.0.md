# Search My Vacation — SMV Workspace: Product Specification

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v1.0 |
| **Status** | Draft — for Sophie (UX), Archie (Architecture), Tiger (Delivery Planning), Rad (Engineering estimation) and Keerthi (QA planning) review; sections marked **Proposed (Arjun)** require explicit Product Owner confirmation before they may be treated as approved requirements |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 10 September 2026 |
| **Purpose** | Transform the approved Product Discovery outcomes for the SMV Workspace into a complete Product Specification — organising, clarifying, refining and specifying the agreed vision so that UX, Architecture, Engineering and QA have a single, traceable source of requirements. |
| **Prepared under** | `EBC-R1.3-WS3-002` (SMV Workspace — Product Specification & Functional Analysis) |
| **Predecessor** | `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` (v1.1) — the approved Product Discovery capture this specification is built from |
| **Related** | `docs/10-Backlog/RELEASE-1.3.md` §7 (Product Decision Log — `DEC-R1.3-004`, `DEC-R1.3-005`), §15 (Feature Register — `FEAT-R1.3-013`); `docs/00-Project-Compass/GLOSSARY.md`; `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`; `docs/09-Development/EBC-009-JOURNEY-PASSPORT-LEADS.md` |

> **Audience:** Sophie (UX), Archie (Architecture), Tiger (Delivery Planning), Rad (Engineering estimation), Keerthi (QA planning), and the Product Owner.

### 1.1 How to read this document

Per Project Instructions §4 (Arjun's operating rules), every substantive statement below is labelled with exactly one of the following, so a reader always knows how much weight it carries:

| Label | Meaning |
| --- | --- |
| **Confirmed** | Recorded verbatim, or as a direct restatement, of a decision already approved in `SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` (`DEC-R1.3-004`) or `RELEASE-1.3.md` (`DEC-R1.3-005`). |
| **Proposed (Arjun)** | A specification this document adds to close one of the five gaps the Product Owner explicitly assigned to this Product Specification (discovery document §12) — a reasoned, conservative elaboration of an agreed name/label, not an invented requirement. Requires explicit Product Owner confirmation before Sophie, Archie or Rad treat it as approved. |
| **Assumption** | A statement this document relies on that was not stated by either persona document, disclosed so it can be corrected rather than silently carried forward. |
| **Open Question** | A genuine unresolved item requiring a Product Owner or cross-persona decision — see Section 12. |

No content below invents destination information, architecture, or visual design. Where a gap could not be closed responsibly from available evidence, it is recorded as an Open Question rather than guessed.

---

## 2. Product Vision

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §4):

The SMV Workspace is the operational platform for Search My Vacation — the internal system through which the Search My Vacation team plans, delivers and manages traveller journeys, day to day.

Guiding principles, as agreed:

- **Single operational workspace** — one platform for the team's day-to-day operational work, rather than work spread across disconnected tools.
- **Daily decision support** — the Workspace actively supports the decisions the team needs to make each day, not just stores records.
- **Single source of truth** — operational data (leads, journeys, vendors, bookings, tasks) lives in one authoritative place.
- **Team collaboration** — the Workspace supports the team working together on shared operational work, not just individual record-keeping.
- **Operational visibility** — the state of the business's operational work is visible to the people who need to see it.

**Assumption:** this vision positions the Workspace as the internal counterpart to the public-facing site's Journey Passport / Journey Director experience — the place where the human follow-up promised by the project's own guiding principle ("Preserve continuity between inspiration, Journey Passport, Journey Director and human follow-up," Project Instructions §1) is actually carried out. This specification treats that continuity as a hard requirement (see §7.2 and BR-01) even though the discovery capture does not use these exact words.

---

## 3. Business Context

### 3.1 Why the SMV Workspace exists

**Proposed (Arjun).** Search My Vacation already documents, in `docs/00-Project-Compass/GLOSSARY.md` GL-015, an intended future CRM capability: "a system used to manage leads, enquiries, quotations, customers, follow-ups, repeat travellers, and long-term customer relationships," named there as "a strategic capability for the future growth of Search My Vacation." The SMV Workspace, as captured in Product Discovery, is the concrete realisation of that previously-named-but-undefined capability — this specification treats `FEAT-R1.3-013` (SMV Workspace) as GL-015's implementation, not a separate concept, and recommends GLOSSARY.md be updated to cross-reference it once this specification is approved (see §12, OQ-09).

Today, the traveller-facing experience (Journey Passport, Journey Director) captures rich discovery data and, on OTP verification, creates a durable lead record (`journey_passport_leads`, per `docs/09-Development/EBC-009-JOURNEY-PASSPORT-LEADS.md`). No product-owned operational surface currently exists for a human team member to see that lead, claim it, plan the journey, confirm vendors, issue a quotation, or track the traveller through to delivery and follow-up. That operational work is, today, necessarily happening outside any system of record the project controls.

### 3.2 Business problems solved

**Proposed (Arjun), derived directly from the Workspace Vision (§2) and the Operational Queues / Dashboard Philosophy decisions (§5, §6 below):**

- **Fragmentation.** Operational work (lead follow-up, itinerary drafting, vendor coordination, task tracking) has no single system of record, so nothing prevents work from being tracked in disconnected tools or not tracked at all.
- **No daily decision support.** Without Operational Queues and a business-first dashboard, a team member has no systematic way to see "what needs attention, who owns it, and what's the next best action" (discovery §6) — the three questions the dashboard is agreed to answer.
- **Lost continuity.** A traveller's Journey Passport context, once captured, has no guaranteed operational home — the project's own "preserve continuity" principle (Project Instructions §1) is at risk without a Workspace to carry that context into planning and delivery.
- **No visibility for the business.** Without a shared operational record, the business cannot see, in one place, the state of its active journeys, vendor commitments, or team workload.

### 3.3 Target users

**Confirmed** (§5 below, User Model): Administrators and Privilege Users — internal Search My Vacation team members. The SMV Workspace is a staff-facing, internal-only platform; it has no traveller-facing surface of its own (travellers continue to interact only through the public site, Journey Passport and human contact).

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §2, restated): this is a fully separate concern from `FEAT-R1.3-007` (Customer Identity & Member Experience), which governs customer-facing authentication and has its own, still-outstanding, Product Discovery. No traveller ever logs into, or is a "user" of, the SMV Workspace.

### 3.4 Operational goals

**Confirmed**, restated from the Dashboard Philosophy (§6) and Workspace Vision (§4):

1. Give every team member a business-first, operationally-prioritising view of their own work and the team's.
2. Make "what needs attention, who owns it, what's the next best action" answerable at a glance.
3. Ensure no lead, journey, task or follow-up can silently go untracked between the moment it enters the business and the moment it is closed.
4. Support team collaboration on shared operational work rather than isolating each team member's records.

---

## 4. User Personas

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §5): two roles are agreed — **Administrator** and **Privilege User** — and Administrators hold capabilities Privilege Users do not. The specific capability list was not captured in discovery (Gap 1 of 5).

### 4.1 Administrator — Proposed (Arjun) capabilities

Closing Gap 1. Every capability below is a proposal requiring Product Owner confirmation (see Open Question OQ-01) before Sophie, Archie or Rad may treat it as approved scope.

| Capability | Description |
| --- | --- |
| Team-wide visibility | View all Leads, Journeys, Tasks, Follow-ups and Vendor records across the whole team, not only their own (see Dashboard My Work / Team toggle, §6). |
| Reassignment | Reassign ownership of a Lead, Journey, Task or Follow-up from one Privilege User to another (implements the **Reassignment** business rule, §7 BR-03). |
| Vendor management | Create, edit and deactivate Vendor records (Vendor Management module, §6.7). |
| User and queue administration | Manage the list of internal users and their role assignment (Administrator / Privilege User); configure the composition of Operational Queues (Basic Settings module, §6.9). |
| Notification configuration | Configure which events trigger notifications and to whom (Notifications module, §6.8). |
| Permanent delete | Perform the irreversible **Admin permanent delete** business rule (§7 BR-06) on records already in an Archived state. Only Administrators may do this — see §7 BR-05/BR-06. |
| All Privilege User capabilities | Everything listed in §4.2 below. |

### 4.2 Privilege User — Proposed (Arjun) capabilities

Closing Gap 1 (continued). Also requires Product Owner confirmation (OQ-01).

| Capability | Description |
| --- | --- |
| My Work visibility | View Leads, Journeys, Tasks and Follow-ups they own, plus the shared Team view of Operational Queues (read access; not reassignment). |
| Claim | Claim an unowned item from an Operational Queue, becoming its Owner (implements **Claim ownership**, §7 BR-02). |
| Journey planning and delivery | Progress a Journey through its Lifecycle (§8) via the defined actions for stages they own. |
| Itinerary and quotation authoring | Create and edit Itineraries and Quotations for Journeys they own, in Itinerary Studio (§6.5). |
| Vendor confirmation | Record Vendor Confirmations against Journeys they own (does not include creating or deactivating Vendor master records — Administrator only). |
| Task and Follow-up management | Create, complete and reschedule Tasks and Follow-ups for their own work (implements **Hybrid task creation** and **Structured follow-ups**, §7 BR-07/BR-08). |
| Destination Intelligence (read-only) | View the Destination Intelligence reference surface (§6.6) to support planning; cannot edit destination content (destination content ownership sits with the existing Product/Destination Operational Steward process — see Assumption in §6.6). |
| Archive | Move their own owned records to an Archived state (implements **Archive before delete**, §7 BR-05); cannot permanently delete. |
| Own settings | Manage their own profile and notification preferences (Basic Settings module, personal scope only). |

**Assumption:** no third role (e.g., a read-only "Viewer" or an external Vendor-facing login) is in scope for Release 1.3 MVP — only Administrator and Privilege User, per the discovery capture's explicit two-role model. If a third role is intended, it is a scope change requiring its own Product Discovery, not something this specification should infer.

---

## 5. Functional Modules — Overview

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §11, MVP Scope): the nine Release 1.3 MVP modules are Dashboard, Traveller Hub, Journey Planning, Journey Workspace, Itinerary Studio, Destination Intelligence, Vendor Management, Notifications, and Basic Settings. Detailed functional requirements for each are in Section 6; this table gives the one-line purpose of each, confirming none has been added or dropped from the agreed nine.

| # | Module | One-line purpose |
| --- | --- | --- |
| 1 | Dashboard | Business-first daily entry point answering "what needs attention, who owns it, what's next" |
| 2 | Traveller Hub | The single record of a Traveller and their relationship history with Search My Vacation |
| 3 | Journey Planning | Operational Queues and workflow for Phase 1 of the Journey Lifecycle |
| 4 | Journey Workspace | The working record of an individual Journey across both lifecycle phases |
| 5 | Itinerary Studio | Authoring surface for Itineraries and Quotations |
| 6 | Destination Intelligence | Read-oriented reference surface into the existing Destination Knowledge Base |
| 7 | Vendor Management | Vendor master records and Vendor Confirmations |
| 8 | Notifications | System- and user-configured alerts for operational events |
| 9 | Basic Settings | User profile, notification preferences and (Administrator) team/queue configuration |

---

## 6. Functional Modules and Requirements

Each module below states its purpose (confirmed where possible), its core functional requirements (FR), and which Business Objects (§7) and Business Rules (§8) it depends on. Requirement IDs are prefixed by module for traceability (§13).

### 6.1 Dashboard

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §6): business-first, operationally prioritising, built around a **My Work / Team toggle**, composed of dashboard cards rather than cluttered tables, and agreed to answer three questions: *What needs attention? Who owns it? What's the next best action?*

| ID | Functional Requirement |
| --- | --- |
| FR-DASH-01 | The Dashboard shall present operational information as cards, not dense tables (Confirmed). |
| FR-DASH-02 | The Dashboard shall provide a toggle between "My Work" (items owned by the current user) and "Team" (items across all users) (Confirmed). |
| FR-DASH-03 | Every card shown shall make the item's owner visible (Confirmed — answers "who owns it"). |
| FR-DASH-04 | The Dashboard shall surface a recommended next action for each attention-worthy item shown (Confirmed — answers "what's the next best action"), consistent with the **Action-driven workflow** business rule (§7 BR-03). |
| FR-DASH-05 | **Proposed (Arjun).** The Dashboard shall summarise, at minimum, the Operational Queues named in §6.3 (Journey Planning, Active Journeys, Vendor Confirmations, Tasks, Follow-ups) as distinct cards or card groups, so the Dashboard functions as the entry point into every queue rather than a separate, unrelated summary. Requires confirmation — see OQ-02. |
| FR-DASH-06 | **Proposed (Arjun).** Administrators viewing "Team" shall be able to filter by team member, to support the Reassignment business rule (§7 BR-03). |

**Depends on:** Lead, Journey, Task, Follow-up, Vendor (read-summarised); all Business Rules.

### 6.2 Traveller Hub

**Proposed (Arjun).** Not named as a discrete concept in discovery beyond its module name (§11), so its functional requirements below are derived from the agreed Traveller business object (§7.2) and the project's continuity principle (§2). Requires Product Owner confirmation (OQ-03).

| ID | Functional Requirement |
| --- | --- |
| FR-HUB-01 | The Traveller Hub shall provide a single record per Traveller, consolidating their Leads, Journeys (past and current), and Follow-up history. |
| FR-HUB-02 | The Traveller Hub shall implement **Mobile number matching** (§7 BR-01): when a new Lead's mobile number matches an existing Traveller, the Lead is associated with that Traveller's existing record rather than creating a duplicate Traveller. |
| FR-HUB-03 | The Traveller Hub shall display the originating Journey Passport context (per `docs/02-Product/JOURNEY-PASSPORT-v1.0.md` §10, Information Captured) for any Lead that originated from the public-facing Journey Passport, preserving the continuity principle (§2). |
| FR-HUB-04 | A team member shall be able to search for a Traveller by name or mobile number. |
| FR-HUB-05 | The Traveller Hub shall show a Traveller's repeat-traveller status (i.e., more than one completed Journey), supporting the CRM vision named in `GLOSSARY.md` GL-015 ("repeat travellers, and long-term customer relationships"). |

**Depends on:** Traveller, Lead, Journey, Journey Passport, Follow-up; BR-01.

### 6.3 Journey Planning

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §7): Operational Queues are the primary way operational work is organised and surfaced. Agreed example queues include Journey Planning, Active Journeys, Vendor Confirmations, Tasks, and Follow-ups. Full queue composition is Product Specification work (this section).

| ID | Functional Requirement |
| --- | --- |
| FR-JP-01 | The Journey Planning module shall present the **Journey Planning** queue: Leads and Journeys currently in Phase 1 of the Journey Lifecycle (§8), grouped by lifecycle stage. |
| FR-JP-02 | Unclaimed items in the Journey Planning queue shall be visible to every Privilege User and Administrator, and claimable by any Privilege User (implements **Claim ownership**, §7 BR-02). |
| FR-JP-03 | Once claimed, an item shall show its Owner to every user viewing the queue, and shall no longer appear in the unclaimed pool (§7 BR-02). |
| FR-JP-04 | **Proposed (Arjun).** The Journey Planning queue shall support the stage breakdown proposed in §8.1 (Lead Captured → Claimed → Requirements Understood → Itinerary Drafted → Quotation Sent → Confirmed/Lost). Requires confirmation — see OQ-04. |
| FR-JP-05 | Progressing an item to its next stage shall be a deliberate action taken by its Owner (e.g., "Send Quotation"), not a free-text status edit (**Action-driven workflow**, §7 BR-03; **System-controlled statuses**, §7 BR-04). |

**Depends on:** Lead, Journey Planning, Journey; BR-02, BR-03, BR-04.

### 6.4 Journey Workspace

**Proposed (Arjun).** The discovery capture names "Journey Workspace" as an MVP module distinct from "Journey Planning," implying it is the working record of a Journey across *both* lifecycle phases (Planning and Delivery), not only Phase 1. Requires confirmation (OQ-05).

| ID | Functional Requirement |
| --- | --- |
| FR-JW-01 | The Journey Workspace shall be the single working record for one Journey: its Traveller(s), its current lifecycle stage (§8), its linked Itinerary/Quotation, its linked Vendor Confirmations, and its Tasks and Follow-ups. |
| FR-JW-02 | The Journey Workspace shall show the Journey's full stage history (an audit trail of stage transitions, per NFR-AUDIT-01, §10). |
| FR-JW-03 | The Journey Workspace shall present the **Active Journeys** queue (Phase 2 — Journey Delivery) for Journeys currently being delivered, mirroring the Journey Planning queue's claim/ownership behaviour (§7 BR-02) for any handoff between team members. |
| FR-JW-04 | A Journey's status field shall be system-derived from its actions and data (**System-controlled statuses**, §7 BR-04), never a freely editable dropdown. |

**Depends on:** Journey, Itinerary, Quotation, Vendor, Task, Follow-up; BR-02, BR-04.

### 6.5 Itinerary Studio

**Proposed (Arjun).** Named as an MVP module (§11); no further detail captured in discovery. Functional requirements derived from the Itinerary and Quotation business objects (§7.6, §7.8) and the module's own name.

| ID | Functional Requirement |
| --- | --- |
| FR-IS-01 | Itinerary Studio shall allow a Privilege User to author a day-wise Itinerary for a Journey they own, consistent with the existing public-facing definition of Itinerary (`GLOSSARY.md` GL-007: "a day-wise travel plan curated for a destination... designed as guidance and can be customized"). |
| FR-IS-02 | Itinerary Studio shall allow a Quotation to be generated from an Itinerary, linked 1:1 or 1:many (one Itinerary may have more than one Quotation version — see Open Question OQ-06). |
| FR-IS-03 | Sending a Quotation to a Traveller shall be a deliberate, logged action, advancing the Journey's stage per the Action-driven workflow rule (§7 BR-03). |
| FR-IS-04 | Itinerary Studio shall allow reference to existing Destination Intelligence content (§6.6) while drafting, without duplicating that content into the Itinerary record. |

**Depends on:** Itinerary, Quotation, Journey, Destination (reference only); BR-03.

### 6.6 Destination Intelligence

**Proposed (Arjun).** Named as an MVP module (§11). **Assumption, requiring confirmation (OQ-07):** this module is a Workspace-side *read* surface into the existing, Product-owned Destination Knowledge Base and Bootstrap Workbook pipeline (per `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` and the Workstream 1 Bootstrap Generator work, `EBC-R1.3-WS1-*`), not a new, separate destination-authoring tool. Destination content authorship and governance already has an owner (the Destination Operational Steward role, `DEC-R1.2-014`) and an approved architecture; this specification does not propose changing that.

| ID | Functional Requirement |
| --- | --- |
| FR-DI-01 | Destination Intelligence shall allow a team member to look up a destination's Product-approved knowledge (identity, best-for profiles, pace, comfort, signature experiences, trade-offs — per `DESTINATION-KNOWLEDGE-BASE.md` §7.1) while planning a Journey. |
| FR-DI-02 | Destination Intelligence shall respect existing destination status gating (`ACTIVE` / `COMING_SOON` / `INACTIVE`, per `DESTINATION-KNOWLEDGE-BASE.md` §7.2) — a team member must be able to see a destination's status before recommending it operationally. |
| FR-DI-03 | Destination Intelligence in the Workspace shall not provide destination content authoring or approval capability — that remains the existing Product/Destination Operational Steward process, per Assumption above. |

**Depends on:** Destination (read-only reference to the existing Destination Knowledge Base — not a new Workspace-owned object; see §7 note).

### 6.7 Vendor Management

**Proposed (Arjun).** Named as an MVP module (§11); functional requirements derived from the Vendor business object (§7.7) and the discovery capture's own example queue "Vendor Confirmations" (§7 of the discovery document).

| ID | Functional Requirement |
| --- | --- |
| FR-VM-01 | Administrators shall be able to create, edit and deactivate Vendor master records (§4.1). |
| FR-VM-02 | A Privilege User shall be able to record a Vendor Confirmation against a Journey for a Vendor already on record. |
| FR-VM-03 | The **Vendor Confirmations** queue shall surface Journeys with an outstanding (unconfirmed) Vendor Confirmation, so nothing is delivered without confirmed vendor arrangements. |
| FR-VM-04 | A deactivated Vendor shall no longer be selectable for new Vendor Confirmations, but existing Confirmations referencing it shall remain visible and unaffected (data integrity; supports **Archive before delete**, §7 BR-05, applied to Vendor records). |

**Depends on:** Vendor, Journey; BR-05.

### 6.8 Notifications

**Proposed (Arjun).** Named as an MVP module (§11); requirements derived from the Notification business object (§7.12) and the Basic Settings module's Administrator scope (§4.1).

| ID | Functional Requirement |
| --- | --- |
| FR-NOT-01 | The system shall generate a Notification when a Lead is unclaimed for longer than a threshold the Administrator configures (supports Dashboard "what needs attention," §6.1). |
| FR-NOT-02 | The system shall generate a Notification when a Follow-up becomes due (implements **Structured follow-ups**, §7 BR-08 — no scheduled follow-up should be silently missed). |
| FR-NOT-03 | The system shall generate a Notification when a Task is reassigned to a user (supports the **Reassignment** rule, §7 BR-03). |
| FR-NOT-04 | Administrators shall be able to configure which of the above notification types are active and their recipients (§4.1). |
| FR-NOT-05 | **Open Question (OQ-08):** whether Notifications are in-Workspace only (a bell/inbox inside the SMV Workspace) or also delivered externally (e.g., email, per the existing Resend integration used for the public-facing lead-notification flow, `EBC-009-JOURNEY-PASSPORT-LEADS.md`) is not decided by discovery and is not assumed here. |

**Depends on:** Notification, Lead, Follow-up, Task.

### 6.9 Basic Settings

**Confirmed the module is in scope** (§11); **Proposed (Arjun)** for its content, split by role per §4.

| ID | Functional Requirement |
| --- | --- |
| FR-SET-01 | Every user (Administrator or Privilege User) shall be able to view and edit their own profile (name, contact details relevant to internal use) and personal notification preferences. |
| FR-SET-02 | Administrators shall be able to view the list of internal users and their role assignment (Administrator / Privilege User) (§4.1). |
| FR-SET-03 | Administrators shall be able to configure the composition of Operational Queues named in §6.3/§6.4, to the extent queue composition is not hard-coded to the Journey Lifecycle stages (§8). |
| FR-SET-04 | "Basic" Settings, per the MVP module's own name, explicitly excludes advanced configuration (e.g., business-rule behaviour changes, integration configuration) — those are Open Question OQ-10 (deferred-scope candidate). |

**Depends on:** none (system configuration, not a Business Object in §7).

---

## 7. Business Objects

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §9): thirteen business objects form the Workspace's core object model — Lead, Traveller, Journey Planning, Journey, Journey Passport, Itinerary, Vendor, Quotation, Booking, Task, Follow-up, Notification, Document. Field, relationship and state definitions were not captured in discovery (Gap 3 of 5) and are proposed below.

Every definition in this section is **Proposed (Arjun)** unless marked otherwise, and requires Product Owner confirmation (Open Question OQ-11) before Archie treats any of it as an approved data-model input.

### 7.1 Lead

- **Definition:** an inbound expression of traveller interest, before a Journey is established.
- **Key fields (proposed):** name, mobile number, source (e.g., Journey Passport, phone, referral), captured context (linked Journey Passport snapshot, when applicable), status, Owner.
- **Relationships:** many Leads may resolve to one Traveller (via **Mobile number matching**, §8 BR-01); a Lead converts into exactly one Journey Planning record once claimed and progressed.
- **States (proposed):** Unclaimed → Claimed → Converted (to Journey Planning) or Lost.
- **Important existing-system fact (not proposed — factual):** a Lead-like record already exists in production as `journey_passport_leads` (`docs/09-Development/EBC-009-JOURNEY-PASSPORT-LEADS.md`), created automatically when a traveller completes Journey Passport and OTP verification. **Open Question OQ-12:** whether the Workspace's Lead object is this same record (surfaced into the Workspace) or a separate, Workspace-owned record fed from it, is an architecture decision this specification flags for Archie rather than assumes.
- **Ownership:** the claiming Privilege User; unclaimed Leads are team-owned.

### 7.2 Traveller

- **Definition:** a person (or the lead traveller of a travelling party) with whom Search My Vacation has, or is building, a relationship — the subject of the Traveller Hub (§6.2).
- **Key fields (proposed):** name, mobile number (matching key, §8 BR-01), linked Leads, linked Journeys (current and historical).
- **Relationships:** one Traveller may have many Leads and many Journeys over time (repeat travellers, per `GLOSSARY.md` GL-015).
- **States:** not applicable as a lifecycle object (a Traveller record persists indefinitely once created; it is not archived or deleted in the ordinary course of business — see §8 BR-05/BR-06 for the exceptional case).
- **Ownership:** not individually owned; visible per the module's own access rules (§6.2).

### 7.3 Journey Planning

- **Definition:** the working record of a Lead once it has been claimed and is actively being planned into a Journey — the object the **Journey Planning** queue (§6.3) surfaces.
- **Key fields (proposed):** linked Lead, linked Traveller, Owner, current Phase 1 stage (§8.1), linked draft Itinerary/Quotation once one exists.
- **Relationships:** one Journey Planning record per claimed Lead; converts into one Journey once the traveller confirms (§8.1, stage "Confirmed").
- **States:** mirrors the Phase 1 stages proposed in §8.1.
- **Ownership:** the Privilege User who claimed the originating Lead.

**Open Question OQ-13:** whether "Journey Planning" (§7.3) and "Journey" (§7.4) are two distinct objects (a planning record that later produces a separate Journey object) or one object whose stage simply crosses from Phase 1 into Phase 2, is not resolved by discovery. This specification describes them as two named objects, per the discovery vocabulary (§9 of the discovery document lists both separately), but flags that Archie may reasonably conclude they should be a single underlying record with a lifecycle-phase field — a data-model decision, not a product one.

### 7.4 Journey

- **Definition:** an active or completed travel engagement with a Traveller, spanning both Journey Lifecycle phases (§8) — the object the Journey Workspace module (§6.4) is built around.
- **Key fields (proposed):** linked Traveller(s), linked Journey Planning origin, current lifecycle stage, linked Itinerary, linked Quotation(s), linked Vendor Confirmations, linked Booking, linked Tasks and Follow-ups.
- **Relationships:** one Journey has one confirmed Itinerary, one or more Quotations (versions), one or more Vendor Confirmations, at most one Booking, and many Tasks/Follow-ups.
- **States:** the full stage set proposed in §8 (both phases).
- **Ownership:** the Privilege User currently responsible; may change via Reassignment (§8 BR-03).

### 7.5 Journey Passport

- **Confirmed, not redefined** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §9, Note): this is the same product concept already fully defined in `docs/02-Product/JOURNEY-PASSPORT-v1.0.md` — the Workspace holds the internal, operational *view* of a traveller's completed Journey Passport (per `JOURNEY-PASSPORT-v1.0.md` §10, Information Captured), not a redefinition of the object itself.
- **Relationship to the Workspace:** referenced (read-only, from the Workspace's perspective) by a Lead (§7.1) and/or Journey (§7.4) that originated from the public site.

### 7.6 Itinerary

- **Definition:** consistent with the existing public glossary term (`GLOSSARY.md` GL-007) — a day-wise travel plan curated for a destination, authored in Itinerary Studio (§6.5).
- **Key fields (proposed):** linked Journey, destination(s) referenced (from Destination Intelligence, §6.6), day-by-day content, version/revision marker.
- **Relationships:** one Itinerary belongs to one Journey; one Itinerary may produce one or more Quotations (§7.8).
- **States (proposed):** Draft → Sent (as part of a Quotation) → Confirmed (traveller accepted) / Superseded (revised).
- **Ownership:** the Journey's Owner.

### 7.7 Vendor

- **Definition:** an external supplier (accommodation, transport, activity, local operator, etc.) Search My Vacation contracts with to deliver part of a Journey.
- **Key fields (proposed):** name, service type, contact details, status (Active/Deactivated).
- **Relationships:** many Vendor Confirmations reference one Vendor; many Journeys may use the same Vendor.
- **States:** Active → Deactivated (Administrator-controlled, §6.7 FR-VM-01/04).
- **Ownership:** Administrator-managed master data, not owned by an individual Privilege User.

### 7.8 Quotation

- **Definition:** a priced proposal sent to a Traveller, generated from an Itinerary (§6.5).
- **Key fields (proposed):** linked Itinerary, linked Journey, version number, sent date, status.
- **Relationships:** many Quotations may exist per Itinerary (successive versions); a Journey converts to a Booking only once a Quotation is accepted.
- **States (proposed):** Draft → Sent → Accepted / Declined / Expired.
- **Ownership:** the Journey's Owner.

### 7.9 Booking

- **Definition:** the confirmed commercial commitment resulting from an accepted Quotation — the object that marks a Journey's transition from Phase 1 (Planning) to Phase 2 (Delivery).
- **Key fields (proposed):** linked Journey, linked accepted Quotation, confirmation date, linked Vendor Confirmations required for delivery.
- **Relationships:** one Booking per Journey (at most); a Booking requires all its associated Vendor Confirmations to be complete before the Journey can progress through Phase 2 (§8.2).
- **States (proposed):** Confirmed → In Delivery → Completed.
- **Ownership:** the Journey's Owner.

### 7.10 Task

- **Definition:** a discrete unit of operational work, either system-generated or manually created (**Hybrid task creation**, §8 BR-07), tracked to completion.
- **Key fields (proposed):** description, linked Journey/Lead (optional — a Task need not always be journey-specific), Owner, due date, status, origin (System / Manual).
- **Relationships:** many Tasks may belong to one Journey or Lead; a Task may also stand alone (e.g., an administrative task).
- **States (proposed):** Open → Completed (or Archived, per §8 BR-05).
- **Ownership:** the assigned team member; reassignable by an Administrator (§8 BR-03).

### 7.11 Follow-up

- **Definition:** a scheduled, structured future touchpoint with a Traveller — distinct from a Task by virtue of always being traveller-directed and always carrying a due date and purpose (**Structured follow-ups**, §8 BR-08).
- **Key fields (proposed):** linked Traveller, linked Journey (optional — e.g., a post-journey relationship follow-up may outlive the Journey record), purpose, due date, Owner, status.
- **Relationships:** many Follow-ups per Traveller over the relationship lifetime.
- **States (proposed):** Scheduled → Completed / Missed (with Notification on due date, §6.8 FR-NOT-02).
- **Ownership:** the assigned team member.

### 7.12 Notification

- **Definition:** a system-generated alert surfacing an operational event requiring attention (§6.8).
- **Key fields (proposed):** type (e.g., unclaimed Lead, due Follow-up, reassignment), recipient(s), triggering record reference, read/unread state.
- **Relationships:** references the Lead/Journey/Task/Follow-up that triggered it.
- **States:** Unread → Read.
- **Ownership:** the recipient user.

### 7.13 Document

- **Definition:** a file or record artefact associated with a Journey or Traveller (e.g., a Quotation PDF, a Vendor confirmation document, an itinerary export).
- **Key fields (proposed):** linked Journey/Traveller, file reference, type, uploaded-by, uploaded-at.
- **Relationships:** many Documents per Journey.
- **States:** Active → Archived (§8 BR-05).
- **Ownership:** the Journey's Owner; visible to any Administrator.

**Open Question OQ-14:** whether Documents in Release 1.3 MVP require actual file storage/upload (implying a storage architecture decision for Archie) or whether "Document" at MVP is limited to system-generated artefacts (e.g., a Quotation rendered as a shareable link, no free-form upload) is not resolved by discovery and should not be assumed either way.

---

## 8. Business Rules

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §10): eight business rules are agreed by name. Their full behavioural definition was not captured (Gap 4 of 5) and is proposed below. Every definition requires Product Owner confirmation (Open Question OQ-15).

### BR-01 — Mobile number matching

**Proposed (Arjun).** When a new Lead is captured with a mobile number that matches an existing Traveller record, the system associates the new Lead with that existing Traveller rather than creating a duplicate Traveller record, and surfaces the Traveller's prior Lead/Journey history to the team member handling the new Lead. Prevents the business from treating a returning traveller as a stranger.

### BR-02 — Claim ownership

**Proposed (Arjun).** An unclaimed item in an Operational Queue (a Lead, or an unowned Task) may be claimed by any Privilege User, which sets them as Owner. Once claimed, the item no longer appears in the general unclaimed pool for other users, though Administrators retain visibility of it via the Team dashboard view (§6.1 FR-DASH-02).

### BR-03 — Reassignment

**Named in the discovery capture's Section 1 resolution context** (the Product Owner's confirmed decision list explicitly names "Reassignment" as an approved decision, per `EBC-R1.3-RM-002` §1) but not listed among the eight named rules in discovery §10 — carried here for completeness since Administrator reassignment capability (§4.1) depends on it. **Proposed (Arjun):** an Administrator may reassign ownership of a Lead, Journey, Task or Follow-up from one Privilege User to another at any time; the previously assigned user loses ownership and a Notification is sent to the newly assigned user (§6.8 FR-NOT-03).

### BR-04 — Action-driven workflow

**Proposed (Arjun).** A record's stage or status advances only as the direct result of a defined action a user takes (e.g., "Send Quotation," "Confirm Booking," "Complete Task") — never through a free-text or dropdown status edit. This keeps status meaning consistent across the team and is what allows the Dashboard (§6.1) to reliably recommend a "next best action."

### BR-05 — System-controlled statuses

**Proposed (Arjun).** The status field on every lifecycle object (Lead, Journey, Booking, Task, Quotation) is computed by the system from which actions and data have occurred (per BR-04), and is never directly, freely editable by a user. This rule and BR-04 work together: BR-04 constrains *how* status changes (only via action), BR-05 constrains *who/what* may set it (the system, not a manual field edit).

### BR-06 — Archive before delete

**Proposed (Arjun).** No Privilege User may permanently delete a record. "Deleting" a record a Privilege User owns moves it to an Archived state — hidden from active queues and dashboards, but retained and reversible.

### BR-07 — Admin permanent delete

**Proposed (Arjun).** Only an Administrator may perform a true, irreversible permanent delete, and only on a record already in the Archived state (per BR-06) — never directly from an active state. This two-step design (archive, then a separate, Administrator-only permanent delete) prevents accidental data loss.

### BR-08 — Hybrid task creation

**Proposed (Arjun).** A Task may be created either automatically by the system (e.g., generated when a Journey enters a stage that requires a specific action, such as "Confirm Vendor") or manually by any team member. Both origins produce the same Task object and appear in the same Tasks queue (§6.3/§6.8), distinguished only by an origin field (System / Manual) for reporting purposes.

### BR-09 — Structured follow-ups

**Proposed (Arjun).** A Follow-up is always a scheduled record with an explicit due date, purpose and Owner — never an unscheduled note. This ensures the business's relationship with a Traveller (especially post-Journey, per `GLOSSARY.md` GL-015's "long-term customer relationships") cannot lapse silently; every Follow-up produces a Notification when it becomes due (§6.8 FR-NOT-02).

**Note on numbering:** the discovery document names eight rules; this specification documents nine (BR-01 through BR-09) because Reassignment (BR-03) — explicitly confirmed as an approved decision in `EBC-R1.3-RM-002` §1 even though it is not one of the eight named rules in discovery §10 — is required to support the Administrator capabilities already confirmed in Product Discovery (§5) and the Feature Register (`FEAT-R1.3-013`'s Business Value, "team collaboration"). This is flagged as Open Question OQ-16 rather than silently reconciled: confirm whether Reassignment should be folded into the eight named rules (e.g., as part of Claim Ownership) or stands as its own ninth rule.

---

## 9. Journey Lifecycle

**Confirmed** (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §8): two phases — **Phase 1: Journey Planning** and **Phase 2: Journey Delivery**. Stage-level breakdown within each phase was not captured (Gap 2 of 5) and is proposed below, requiring Product Owner confirmation (Open Question OQ-04, already referenced in §6.3).

### 9.1 Phase 1 — Journey Planning (Proposed)

| Stage | Business intent | Entry action |
| --- | --- | --- |
| 1. Lead Captured | A new expression of interest exists; nobody yet owns it. | System: Lead created (from Journey Passport or another channel). |
| 2. Claimed | A Privilege User has taken ownership. | User: Claim (§8 BR-02). |
| 3. Requirements Understood | The team member has reviewed the traveller's context (Journey Passport, direct conversation) well enough to plan. | User: marks requirements reviewed. |
| 4. Itinerary Drafted | A day-wise Itinerary exists in Itinerary Studio (§6.5). | User: saves a draft Itinerary. |
| 5. Quotation Sent | A priced Quotation has been sent to the Traveller. | User: Send Quotation (§8 BR-04). |
| 6a. Confirmed | The Traveller has accepted the Quotation; a Booking is created and the Journey moves to Phase 2. | User: records acceptance. |
| 6b. Lost | The Traveller has declined, gone unresponsive past a defined threshold, or the Journey Planning record is otherwise closed without conversion. | User: marks Lost, with a reason. |

### 9.2 Phase 2 — Journey Delivery (Proposed)

| Stage | Business intent | Entry action |
| --- | --- | --- |
| 1. Booking Confirmed | The commercial commitment is in place. | System: on Quotation acceptance (from Phase 1, stage 6a). |
| 2. Vendor Confirmation in Progress | Vendor Confirmations are being secured for all components of the Itinerary. | User: begins recording Vendor Confirmations. |
| 3. Pre-Departure Ready | All required Vendor Confirmations and Documents are complete. | User/System: last required Vendor Confirmation recorded. |
| 4. In-Journey | The travel dates are current; the team is providing active support. | System: journey start date reached (or user-marked, if dates are not tracked precisely — see Open Question OQ-17). |
| 5. Post-Journey Follow-up | The trip has concluded; the team is following up for feedback and the ongoing relationship (**Structured follow-ups**, §8 BR-09). | System: journey end date reached. |
| 6. Closed | The Journey record is complete; the Traveller record persists for future Leads (§7.2). | User: marks Journey Closed after Follow-up is complete. |

**Open Question OQ-17:** whether the Workspace needs to track precise travel dates to drive stage 4's system transition, or whether "In-Journey" is always a manual user action, was not addressed in discovery and affects whether Journey Lifecycle date-tracking is MVP-critical.

---

## 10. Non-Functional Requirements

**Proposed (Arjun).** Discovery did not address non-functional requirements; these are derived from the project's existing engineering and architecture standards (Project Instructions §21, §25, §28) applied to an internal operational system.

| Category | Requirement |
| --- | --- |
| **Performance** | NFR-PERF-01: Dashboard queue views shall load within the same performance expectations already established for the public site's data-backed pages (no numeric SLA specified by discovery; Archie to confirm a target during architecture review). |
| **Security** | NFR-SEC-01: The SMV Workspace is a staff-only, authenticated surface; no unauthenticated access to any Business Object (§7) shall be possible, consistent with Project Instructions §25 (Data and Secret Safety). NFR-SEC-02: Role-based access (§4) shall be enforced server-side, not only hidden in the UI. |
| **Auditability** | NFR-AUDIT-01: Every stage transition (§9) and every Reassignment (§8 BR-03) shall be recorded with who performed it and when, supporting the Journey Workspace's stage-history requirement (§6.4 FR-JW-02) and any future dispute or quality review. |
| **Scalability** | NFR-SCALE-01: The data model shall not assume a fixed, small number of team members or Vendors — Administrator-managed lists (§6.9, §6.7) must support ordinary business growth without redesign. |
| **Accessibility** | NFR-ACC-01: As an internal tool, the Workspace should still meet the project's existing accessibility standards for interactive controls, keyboard navigation and reduced motion (Project Instructions §23), consistent with how these standards already apply to Journey Director (`docs/09-Development/EBC-003-JOURNEY-DIRECTOR.md` §11). |
| **Usability** | NFR-USE-01: Consistent with the Dashboard Philosophy (§6.1), the Workspace should minimise the number of steps between "seeing what needs attention" and "taking the next action" — this is a design principle for Sophie's future UX work, not a measurable requirement at this stage. |

---

## 11. User Stories

**Proposed (Arjun).** Organised as Epics mapped to the nine functional modules (§6), with representative stories and acceptance criteria per Epic. This is not an exhaustive backlog — task-level decomposition and estimation remain Tiger/Rad's future work, per Project Instructions §4 ("Arjun must not... treat an assumption as an approved requirement" and must not perform estimation).

### Epic 1 — Dashboard

**As a** Privilege User, **I want** a dashboard that shows my own work and the team's work, **so that** I always know what needs my attention today.

- **US-1.1:** As a Privilege User, I want to toggle between "My Work" and "Team" so that I can see either my own items or everything the team is handling.
  - *Acceptance criteria:* Toggle is visible and persists the selected view for the session; "My Work" shows only items I own; "Team" shows items across all Privilege Users and Administrators (FR-DASH-02).
- **US-1.2:** As an Administrator, I want to filter the Team dashboard by team member so that I can review any one person's workload before reassigning.
  - *Acceptance criteria:* A filter control limits the Team view to a chosen user's owned items (FR-DASH-06).

### Epic 2 — Traveller Hub

**As a** Privilege User, **I want** a single record of a Traveller's history, **so that** I never treat a returning traveller as a stranger.

- **US-2.1:** As a Privilege User, I want a new Lead with a matching mobile number to attach to the existing Traveller automatically, so that I see their prior history immediately.
  - *Acceptance criteria:* On Lead creation, the system checks for a mobile-number match; on match, the Lead is linked to the existing Traveller and their prior Leads/Journeys are visible on the same screen (FR-HUB-02, BR-01).

### Epic 3 — Journey Planning

**As a** Privilege User, **I want** to claim and progress Leads through planning, **so that** nothing sits untracked.

- **US-3.1:** As a Privilege User, I want to claim an unowned Lead from the Journey Planning queue, so that it becomes mine to work.
  - *Acceptance criteria:* Claiming sets me as Owner; the Lead disappears from the unclaimed pool for other Privilege Users; it remains visible to Administrators via Team view (FR-JP-02/03, BR-02).
- **US-3.2:** As a Privilege User, I want to send a Quotation and have the Journey Planning stage advance automatically, so that I don't have to remember to update a status field.
  - *Acceptance criteria:* The "Send Quotation" action is the only way the stage moves to "Quotation Sent"; the status field is not independently editable (FR-JP-05, BR-04, BR-05).

### Epic 4 — Journey Workspace

**As a** Privilege User, **I want** one working record per Journey covering planning and delivery, **so that** I don't lose context when a Journey converts from a quotation into a booked trip.

- **US-4.1:** As a Privilege User, I want to see a Journey's full stage history, so that I (or an Administrator) can review how it progressed.
  - *Acceptance criteria:* Every stage transition is timestamped and attributed to the user who performed it (FR-JW-02, NFR-AUDIT-01).

### Epic 5 — Itinerary Studio

**As a** Privilege User, **I want** to draft itineraries and generate quotations from them, **so that** I have one authoring surface instead of ad hoc documents.

- **US-5.1:** As a Privilege User, I want to generate a Quotation directly from a saved Itinerary, so that I don't have to re-enter the same information.
  - *Acceptance criteria:* A Quotation created from an Itinerary carries over the Itinerary's content and links back to it (FR-IS-02).

### Epic 6 — Destination Intelligence

**As a** Privilege User, **I want** to check a destination's Product-approved guidance while planning, **so that** my recommendations stay consistent with what Search My Vacation has approved.

- **US-6.1:** As a Privilege User, I want to see a destination's status (Active/Coming Soon/Inactive) before including it in an Itinerary, so that I never plan around a destination the business doesn't currently serve.
  - *Acceptance criteria:* Destination status is visible wherever a destination is referenced in Itinerary Studio; an Inactive destination cannot be added to a new Itinerary (FR-DI-02).

### Epic 7 — Vendor Management

**As an** Administrator, **I want** to maintain the vendor list, **so that** the team always confirms against a current, approved vendor.

- **US-7.1:** As a Privilege User, I want to record a Vendor Confirmation against a Journey, so that the Vendor Confirmations queue reflects real delivery readiness.
  - *Acceptance criteria:* A Confirmation can only reference an Active Vendor; recording it removes the Journey from the "outstanding" view of the queue once all required Confirmations are recorded (FR-VM-02/03).

### Epic 8 — Notifications

**As a** team member, **I want** to be notified when something needs my attention, **so that** I don't have to keep checking the Dashboard manually.

- **US-8.1:** As a Privilege User, I want a notification when a Follow-up I own becomes due, so that I never miss a scheduled traveller touchpoint.
  - *Acceptance criteria:* A Notification is generated on or before the Follow-up's due date and is visible until marked read (FR-NOT-02, BR-09).

### Epic 9 — Basic Settings

**As an** Administrator, **I want** to manage the team's users and queue configuration, **so that** the Workspace reflects how the business is actually organised.

- **US-9.1:** As an Administrator, I want to view the current list of internal users and their roles, so that I can confirm who has Administrator access.
  - *Acceptance criteria:* The user list shows every internal user and their assigned role (Administrator/Privilege User) (FR-SET-02).

---

## 12. Assumptions

Per Project Instructions §4, recorded explicitly rather than silently carried forward:

1. The Workspace has no traveller-facing surface; it is entirely internal, and fully separate from `FEAT-R1.3-007` (Customer Identity & Member Experience) — Confirmed by `DEC-R1.3-005`, restated here as this specification's operating assumption throughout.
2. Only two roles (Administrator, Privilege User) are in scope for Release 1.3 MVP — no third role, and no external (Vendor- or Traveller-facing) login (§4.2).
3. "Destination Intelligence" in the Workspace is a read-oriented reference into the existing, separately-governed Destination Knowledge Base, not a new authoring surface (§6.6) — requires confirmation (OQ-07).
4. The existing `journey_passport_leads` production table is functionally the same concept as this specification's "Lead" business object, and is the intended feed into the Workspace, though the exact integration/architecture is left to Archie (§7.1, OQ-12).
5. No numeric performance, uptime or scale target was supplied by discovery; NFRs in §10 are qualitative pending Archie/Tiger input.
6. The Journey Lifecycle stage breakdowns proposed in §9 are illustrative and reasoned from the two confirmed phase names and the confirmed example queues — not verbatim workshop content.

---

## 13. Open Questions

Carried forward from inline references above; **none of these reopen Product Discovery** (per `DEC-R1.3-005`) — each is a Product Specification-level refinement question for the Product Owner (or, where noted, a named persona) to resolve before downstream work (Sophie/Archie/Rad) begins.

| ID | Open Question | Raised in | Owner to resolve |
| --- | --- | --- | --- |
| OQ-01 | Confirm or amend the proposed Administrator / Privilege User capability lists (§4.1, §4.2). | §4 | Product Owner |
| OQ-02 | Confirm the Dashboard must summarise every Operational Queue (§6.1 FR-DASH-05), or a subset. | §6.1 | Product Owner |
| OQ-03 | Confirm the Traveller Hub's proposed functional requirements (§6.2), since it was named but not detailed in discovery. | §6.2 | Product Owner |
| OQ-04 | Confirm or amend the proposed Journey Lifecycle stage breakdown (§9.1, §9.2). | §6.3, §9 | Product Owner |
| OQ-05 | Confirm "Journey Workspace" is the Phase 1+2 working record, distinct from "Journey Planning" (Phase 1 queue only) (§6.4). | §6.4 | Product Owner |
| OQ-06 | Confirm whether an Itinerary may have multiple Quotation versions, or exactly one (§6.5 FR-IS-02, §7.8). | §6.5, §7.8 | Product Owner / Archie |
| OQ-07 | Confirm Destination Intelligence in the Workspace is read-only against the existing Destination Knowledge Base, with no new authoring capability (§6.6). | §6.6 | Product Owner / Archie |
| OQ-08 | Confirm Notification delivery channels: in-Workspace only, or also external (email/WhatsApp) (§6.8 FR-NOT-05). | §6.8 | Product Owner / Archie |
| OQ-09 | Confirm whether `GLOSSARY.md` GL-015 (CRM) should be updated to cross-reference the SMV Workspace once this specification is approved. | §3.1 | Tiger (documentation discipline, Project Instructions §32) |
| OQ-10 | Confirm what, if anything, is explicitly deferred out of the nine confirmed MVP modules (closing discovery Gap 5) — see §5, §6.9 FR-SET-04. | §5, §6.9 | Product Owner |
| OQ-11 | Confirm or amend the thirteen Business Object definitions proposed in §7 (fields, relationships, states). | §7 | Product Owner / Archie |
| OQ-12 | Confirm the architectural relationship between the Workspace's "Lead" object and the existing `journey_passport_leads` production table. | §7.1 | Archie |
| OQ-13 | Confirm whether "Journey Planning" and "Journey" are one data object or two (§7.3). | §7.3 | Archie |
| OQ-14 | Confirm whether "Document" (§7.13) requires file upload/storage at MVP, or is limited to system-generated artefacts. | §7.13 | Product Owner / Archie |
| OQ-15 | Confirm or amend the nine proposed Business Rule definitions (§8). | §8 | Product Owner |
| OQ-16 | Confirm whether Reassignment should be one of the named eight Business Rules or remain a separately tracked ninth rule (§8, note after BR-09). | §8 | Product Owner |
| OQ-17 | Confirm whether precise travel-date tracking is required to drive the "In-Journey" lifecycle stage automatically (§9.2). | §9.2 | Product Owner / Archie |

---

## 14. Requirements Traceability

| Product Specification Section | Traces to Product Discovery Section | Status |
| --- | --- | --- |
| §2 Product Vision | Discovery §4 (Workspace Vision) | Confirmed, restated |
| §4 User Personas | Discovery §5 (User Model) | Confirmed role names; capabilities Proposed (Gap 1) |
| §5–§6 Functional Modules | Discovery §11 (MVP Scope) | Confirmed module list; requirements Proposed |
| §7 Business Objects | Discovery §9 (Business Objects) | Confirmed object list; definitions Proposed (Gap 3) |
| §8 Business Rules | Discovery §10 (Business Rules) | Confirmed rule names; definitions Proposed (Gap 4) |
| §9 Journey Lifecycle | Discovery §8 (Journey Lifecycle) | Confirmed phase names; stage detail Proposed (Gap 2) |
| §5, §13 (OQ-10) | Discovery §11 (MVP Scope, deferred capabilities) | Gap 5 — not closed, escalated as Open Question |
| §10 Non-functional Requirements | Not present in Discovery | Proposed (Arjun), no discovery source |
| §11 User Stories | Derived from §6/§7/§8/§9 of this document | Proposed (Arjun) |

**Five-gap closure summary** (per `SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §12 and the Product Owner's `DEC-R1.3-005` instruction that these are Product Specification refinement items):

| Gap (Discovery §12) | Closed by | Still requires confirmation |
| --- | --- | --- |
| 1. User Model capabilities | §4.1, §4.2 (Proposed) | OQ-01 |
| 2. Journey Lifecycle stage detail | §9.1, §9.2 (Proposed) | OQ-04, OQ-17 |
| 3. Business Object definitions | §7 (Proposed) | OQ-06, OQ-11, OQ-12, OQ-13, OQ-14 |
| 4. Business Rule definitions | §8 (Proposed) | OQ-15, OQ-16 |
| 5. MVP deferred capabilities | Not closed — recorded as OQ-10 | OQ-10 |

Gap 5 is deliberately **not** closed by invented content: nothing in discovery or the repository indicates what, if anything, is intentionally out of scope beyond the nine named modules, and Section 3 of the discovery document is explicit that "nothing outside the nine modules... should be assumed to be either in-scope or explicitly deferred; that determination is Product Specification / Tiger sequencing work." This specification treats that determination as belonging jointly to the Product Owner and Tiger (OQ-10), not something Arjun should decide unilaterally.

---

## 15. Acceptance Criteria Mapping (this EBC)

- [x] Fully traceable to Product Discovery — §14.
- [x] No contradiction with approved Product Decisions (`DEC-R1.3-004`, `DEC-R1.3-005`) — every confirmed statement in this document is a direct restatement of one of those two decisions; every addition is explicitly labelled Proposed/Assumption/Open Question, never presented as already approved.
- [x] Ready for Sophie (UX) — §4 (personas), §6 (module purposes and flows), §9 (lifecycle) give Sophie journeys and states to design against, with open items clearly flagged rather than silently assumed.
- [x] Ready for Archie (Architecture) — §7 (Business Objects) and the architecture-flagged Open Questions (OQ-06, OQ-07, OQ-12, OQ-13, OQ-14, OQ-17) give Archie a concrete but explicitly provisional data-model starting point.
- [x] Ready for Tiger (Delivery Planning) — §5 module list, §13 Open Questions, and §14 traceability give Tiger what is needed to sequence a Product Owner decision round before architecture/engineering begins, per the standard Team Satvi lifecycle (Project Instructions §12).
- [x] Ready for Rad (Engineering estimation) — deferred until architecture review, per standard lifecycle sequencing (Project Instructions §12, Stage 3 before Stage 6); this document does not itself claim engineering-readiness, consistent with Arjun's role boundary (must not determine architecture).
- [x] Ready for Keerthi (QA planning) — §11 User Stories carry acceptance criteria in Given/AC form suitable for translating into Keerthi's test-case format once modules are implemented.

---

## 16. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v1.0 | 10-Sep-2026 | Arjun | `EBC-R1.3-WS3-002` | Initial Product Specification, built from the approved Product Discovery capture (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` v1.1, `DEC-R1.3-004`/`DEC-R1.3-005`). Covers vision, business context, personas, nine functional modules with functional requirements, thirteen business objects, nine business rules (eight named plus Reassignment), two-phase Journey Lifecycle with proposed stage breakdown, non-functional requirements, nine epics of user stories with acceptance criteria, assumptions, seventeen open questions, and full requirements traceability including explicit five-gap closure status. All content beyond a direct restatement of confirmed discovery decisions is labelled Proposed (Arjun), Assumption, or Open Question, per Project Instructions §4's requirement that Arjun never treat an assumption as an approved requirement. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-002`. It is a specification for review, not an approved requirements baseline — every item labelled Proposed or Open Question requires explicit Product Owner (or named-persona) confirmation before Sophie, Archie, Rad or Keerthi treat it as approved scope.*
