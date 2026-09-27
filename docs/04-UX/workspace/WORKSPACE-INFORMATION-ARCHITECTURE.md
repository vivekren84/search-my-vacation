# Workspace Information Architecture

| Document Information | |
|---|---|
| Document Name | Workspace Information Architecture |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Product Owner / Tiger review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS4-001 |
| Last Updated | 14 September 2026 |
| Predecessor | Workspace UX Discovery v1.0 |
| Related Documents | Journey Workspace Business Lifecycle v1.0; Journey Workspace UX Design Brief v1.0; SMV Workspace Product Specification v2.0 |

---

## 1. Purpose

This document defines the Workspace's Information Architecture: how its nine approved MVP modules are grouped, how a Workspace User moves between them, and why. It builds directly on the Cross-Module Governance Principles the Product Specification already establishes (§8) rather than inventing a new grouping model.

This document does not define screen-level layout (see Workspace Screen Inventory) or step-by-step interaction (see Workspace Interaction Flows). It defines structure and relationships only.

## 2. IA Rationale — Why This Structure

The Product Specification names two cross-module patterns that already describe how the nine modules relate to one another (§8.4–§8.5):

- **Operational Architecture** — the day-to-day working loop: Journey Planning (pre-confirmation) → Journey Workspace (post-confirmation) → Notifications (attention layer across both) → Dashboard (shared entry point).
- **Knowledge Architecture** — the organisational memory the operational loop draws on: Traveller Hub (who), Destination Intelligence (where), Vendor Management (who-through), Itinerary Studio (what's been planned and learned).

Rather than introducing a third, UX-invented grouping, this Information Architecture makes these two approved patterns the primary navigation grouping. This directly satisfies the UX Design Brief's **Journey First**, **Inquiry First** and **Consistency** principles: the modules a Workspace User touches most (to act) are grouped together and placed first; the modules that support those actions with reference knowledge are grouped together and placed second; Settings, which serves both groups without belonging to either, sits apart.

## 3. Top-Level Structure

```
                           SMV Workspace

                                │

                      Dashboard (Landing)

                                │

         ┌──────────────────────┴──────────────────────┐

         │                                             │

 Operational Architecture                 Knowledge Architecture

         │                                             │

  Journey Planning                         Traveller Hub

  Journey Workspace                        Itinerary Studio

                                           Vendor Management

                                           Destination Intelligence

         └──────────────────────┬──────────────────────┘

                                │

                    Global Workspace Services

                  • Notifications
                  • Global Search
                  • Settings
```

Every module in the diagram corresponds one-to-one with an Approved module in the Product Specification (§5); no module is split, merged or renamed for navigation purposes.

## 4. Module Descriptions and Relationships

| Module | IA Group | One-line role | Primary relationships |
|---|---|---|---|
| Dashboard | Entry point | Business-first daily summary: what needs attention, who owns it, what's next | Reads operational status, actionable work and organisational context from every other module.
Owns no business data and performs no business transactions. |
| Journey Planning | Operational | Manage Inquiries from claim through proposal to traveller decision | Receives qualified work entering the Workspace as Inquiries from all approved external channels.
Progresses the Inquiry through traveller discovery, itinerary planning and proposal management until a traveller decision is reached.
Draws on Traveller Hub, Itinerary Studio, Vendor Management and Destination Intelligence.
Creates a Journey only after traveller acceptance. |
| Journey Workspace | Operational | Manage confirmed Journeys from commercial confirmation to operational closure | Receives accepted proposals through Journey creation following traveller confirmation.
Owns all operational activities from Journey creation through Journey completion.
Draws on Traveller Hub, Itinerary Studio and Vendor Management throughout the operational lifecycle. |
| Traveller Hub | Knowledge | Single record of a Traveller and their relationship history | Referenced (not owned) by Journey Planning and Journey Workspace. Traveller Hub provides relationship context to operational modules but does not own operational workflows. |
| Itinerary Studio | Knowledge | Author and govern Master Itineraries; personalise Traveller Itineraries | Consumed by Journey Planning (proposals) and Journey Workspace (operational itinerary); consumes Destination Intelligence |
| Vendor Management | Knowledge | Maintain the supplier ecosystem and Preferred Partner designations | Consumed by Journey Planning (quotations) and Journey Workspace (confirmations); consumed by Itinerary Studio (recommendations) |
| Destination Intelligence | Knowledge | Govern destination knowledge through Draft → Under Review → Approved | Consumed by Journey Planning, Itinerary Studio, Vendor Management, Journey Workspace |
| Notifications | Attention layer | Surface conditions from every module needing awareness or action | Generated by every other module; consumed by Dashboard and by the user directly |
| Settings | Administration | Organisational configuration (Administrator) and Personal Preferences (every user) | Configures Operational Queues, notification behaviour, users/roles, personal profile — touches all eight other modules |

## 4.1. Information Architecture Principles

The Workspace Information Architecture is guided by the following principles.

- Operational work takes precedence over organisational reference information.
- The Journey becomes the primary operational business object after traveller commitment.
- Organisational knowledge exists to support operational decision-making.
- Global Workspace Services remain consistently accessible regardless of the active module.
- Routine activities should rarely require navigation deeper than one contextual level.
- Information should be grouped according to business purpose rather than organisational ownership.

## 5. Global Navigation

Persistent across every screen (per the UX Design Brief's Consistency principle, §6):

1. **Primary navigation rail/sidebar** — Dashboard, then the Operational group (Journey Planning, Journey Workspace), then the Knowledge group (Traveller Hub, Itinerary Studio, Vendor Management, Destination Intelligence). Grouped visually with a section label ("Operational" / "Knowledge"), not flattened into one undifferentiated list, so the two governance patterns stay legible to the user, not just to the Specification.
2. **Notifications** — a persistent header element (bell icon with an Action-Required count, since Informational notifications do not need to interrupt), with a full Notifications log reachable from it. Not placed inside the primary rail, because Notifications is a cross-cutting attention layer, not a destination module a Workspace User "works within" the way they work within Journey Planning.
3. **Global search** — reachable from the header, searching Traveller (by name or mobile — FR-WS-010), Journey Planning Record, and Journey, per Traveller Hub's approved search requirement (FR-WS-010) generalised to the objects a Workspace User most often looks up mid-task.
4. **Settings and personal profile** — a persistent header element (typically a user-menu affordance), separate from the primary rail, since Settings is administrative/personal rather than operational-daily-work. Administrator-only Workspace Configuration and every user's own Personal Preferences (PD-ST-004) both live here but are visually separated (Section 8).
5. **My Work / Team toggle** — a Dashboard-level control (FR-DASH-02), not a global one; it governs how Dashboard cards are scoped and does not affect the other modules' own queues, which already carry their own claim/ownership treatment (Section 6).

## 6. Contextual Navigation

> **WS13 revision (EBC-R1.3-WS13-002, 24-Sep-2026):** The Journey tab set is revised for Journey Workspace. See *WS13 Revision* at the end of this document.


Within a single Journey Planning Record or Journey, a consistent contextual tab set applies (exact tab set finalised in the Screen Inventory), reflecting the object's own composition in the Specification:

**Journey Planning Record (§7.3):** Overview · Requirements · Proposal Versions · Vendor Quotations · Discovery Notes/Activities · Tasks & Follow-ups · History

**Journey (§7.4):** Overview · Itinerary (Traveller Itinerary in use) · Vendor Confirmations · Operational Readiness · Tasks & Follow-ups · Documents · History

Both objects share the same **History** tab pattern (full stage-transition history, FR-WS-018, and the workspace-wide historical-preservation principle, §8.7), so a Workspace User learns the pattern once and reuses it everywhere.

**Master Itinerary / Traveller Itinerary, Vendor, Destination Profile** each carry a lighter contextual pattern: Overview · [object-specific content] · Version History · (where applicable) Governance/Approval — reflecting the shared Knowledge Architecture governance shape (§8.4 of the Specification: organisationally owned, recommend → review → approve, history preserved).

## 7. Entry Points

| Entry point | Leads to |
|---|---|
| Login | Dashboard (always the landing screen — UX Design Brief §4, "I know exactly what is happening today") |
| Notification click | The specific Journey Planning Record, Journey, Vendor, Destination Profile or Task the notification references |
| Global search result | The specific Traveller, Journey Planning Record or Journey |
| Dashboard card click | The specific queue item (a Journey Planning Record, Journey, Vendor Confirmation, Task or Follow-up) |
| Unclaimed queue item (any module using the Generic Ownership Model) | Claim action available directly from the queue, without a separate navigation step |
| Traveller Hub record | Any of that Traveller's Journey Planning Records or Journeys (past and current) |

There is no traveller-facing entry point: the Workspace has no public surface (Specification §13, Assumption 1, Confirmed).

## 8. Exit Points and Cross-Navigation

> **WS13 revision (EBC-R1.3-WS13-002, 24-Sep-2026):** Journey outcomes are now Journey Closed, Cancelled and **Superseded**; Archived is an administrative state, not an outcome (D-01, D-08, D-13). See *WS13 Revision* at the end.


- **Journey Planning Record → Journey.** The single most important cross-navigation event in the Workspace: on traveller acceptance, a Journey Planning Record converts one-way into a Journey (BR-012/PD-JW-001). This is not a navigation link a user follows; it is a state transition the Workspace performs, after which the record's home moves from Journey Planning's queue to Journey Workspace's Active Journeys queue. The Interaction Flows document specifies this transition's user-facing moment in full.
- **Journey Planning Record → Closed (Lost/Archived), without a Journey.** Exits the active Journey Planning queue but remains reachable from Traveller Hub and search — never deleted (BR-007/PD-JP-007).
- **Journey → Successfully Completed / Cancelled / Archived.** Exits the Active Journeys queue; remains reachable from Traveller Hub, search, and (for Cancelled/Archived) supports the "Future Traveller Relationship" loop the Business Lifecycle names (§5) — a completed Journey is where a Workspace User would start a *new* Journey Planning Record for the same Traveller.
- Completed Journeys become part of the Traveller's long-term relationship history and provide the foundation for future Journey Planning rather than representing the end of the traveller relationship.
- **Any Knowledge Architecture object → Draft/recommend.** A Workspace User may originate a change (a Destination Profile recommendation, a Master Itinerary learning, a new Vendor) from within an operational context (e.g., "no Master Itinerary exists for this destination yet" inside Journey Planning) without leaving their current task, consistent with PD-IS-004 and PD-DI-003. This is a cross-navigation affordance the Interaction Flows document will specify, not a top-level navigation change.
- **Settings → any module.** Configuration changes (Operational Queue composition, notification types/recipients) take effect in the module they configure without requiring the Workspace User to separately visit that module.

## 9. Cross-Navigation Patterns Summary

| Pattern | Where it appears | Why |
|---|---|---|
| Claim from queue, no intermediate screen | Journey Planning, Journey Workspace, Task queues | Ownership (BR-002/Generic Ownership Model, §8.1) is a lightweight action, not a workflow |
| "Based on [Master Itinerary]" back-reference | Traveller Itinerary screens | Preserves the parent/derived relationship (§7.6a) without inventing new notation (Discovery A-UX-04/R-UX-04) |
| Inline reference chips (Traveller, Vendor, Destination Profile) | Journey Planning Record, Journey | Lets a Workspace User jump to Knowledge Architecture context without losing their place in Operational Architecture work |
| Persistent History tab | Journey Planning Record, Journey | One learned pattern for the workspace-wide historical-preservation principle (§8.7) |
| Notification → source record | Every module | Notifications never resolve by viewing alone (BR-017/PD-NO-004); the click target is always the record whose condition must be resolved |

## 10. What This IA Deliberately Does Not Do

- It does not assign specific screens, wireframes or component layouts (Screen Inventory).
- It does not specify field-level content for any screen.
- It does not resolve the Administrator/Privilege User capability split (OQ-001); navigation items available to each role are addressed in the Screen Inventory and Navigation Model as **Role TBC** where unconfirmed.
- It does not decide the Destination Intelligence/WS1 Bootstrap Generator technical reconciliation (OQ-019); this IA describes the Workspace-facing Destination Intelligence module only.

---

*Prepared by Sophie (UX, UI and Frontend Experience Specialist) on behalf of Team Satvi.*
*Reviewed by the Product Owner as part of the Release 1.3 UX Architecture Review.*
*This document establishes the Information Architecture baseline for Journey Workspace and forms the foundation for the Navigation Model, User Journeys, Interaction Flows and Screen Inventory.*
*Status: Approved with Product Owner refinements.*

---

## WS13 Revision — EBC-R1.3-WS13-002 (24 September 2026)

*Additive revision by Sophie (UX). The original text above is kept unchanged, following the project's supersede-not-delete convention. Where this section differs, it governs for Journey Workspace. Source: `docs/09-Development/EBC-R1.3-WS13-002-SOPHIE-Journey-Workspace-UX-Design-and-Experience-Specification.md`, built on the frozen product baseline `EBC-R1.3-WS13-001` Revision 2 (D-01 to D-13).*

### §6 Contextual Navigation — Journey tab set (revised)

**Journey:** Overview · Itinerary · **Vendor Bookings** · **Readiness** · Documents · Tasks & Follow-ups · **Activity & Changes** · History

"Vendor Confirmations" becomes Vendor Bookings (D-07). "Operational Readiness" becomes Readiness. Activity & Changes is added for communications, Operational Notes and Change Records (FR-JW-13, 19, 20). The Journey Header (identity, Journey Owner, Primary Operational Contact, Travellers, lifecycle, primary action, alerts) sits above the tabs on every tab.

### §8 Exit Points — Journey (revised)

- **Journey → Journey Closed / Cancelled / Superseded.** Leaves Active Journeys; stays reachable from Closed & Archived Journeys (JW-11), search and Traveller Hub.
- **Superseded** (D-13): the original Journey links forward to its replacement and the replacement links back. It is never presented as Cancelled.
- **Archived** (D-08) is an administrative state applied by an Administrator at any time, with a reason. It hides the Journey from active views and never changes its stage or outcome.
- **Material change** is a new cross-navigation: Journey (placed On Hold) → new, pre-filled Journey Planning record → on its confirmation, a replacement Journey.

### Revision 2 update (26-Sep-2026, Product Owner review of WS13-002)

- UX-04: the terminal state **Journey Closed** is presented to Workspace Users with the label **Completed**. Lifecycle, business rules and product terminology are unchanged; references above to Journey Closed name the state.

### Revision 4 update (27-Sep-2026, WS13 UX synchronisation UXA-01 to UXA-06)

*Alignment with WS13-001 Rev 3 (POD-01–08, PD-A–E, O-A2–O-A5) and WS13-004A. Detail: `EBC-R1.3-WS13-002` §36. No workflow redesign.*

- **Archived** Journeys are read-only and cannot be restored in Release 1.3 (POD-08). The earlier note that archiving is reversible no longer applies to Journeys.
- The Journey header carries the **Service Category** (POD-02/07) as identity context.
