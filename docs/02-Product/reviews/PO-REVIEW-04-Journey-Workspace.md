# PO-REVIEW-04-Journey-Workspace.md

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 – Workspace Product Specification

**Module:** 04 – Journey Workspace

**Document Type:** Product Owner Review Notes

**Prepared By:** Tiger – Delivery Manager

**Reviewed With:** Vivek – Product Owner

**Status:** Product Owner Approved

**Version:** 1.0

---

# 1. Purpose

This document records the Product Owner Review conducted for the Journey Workspace module as part of Release 1.3.

The review established the operational responsibilities of the Journey Workspace, clarified its relationship with Journey Planning, defined the lifecycle of a confirmed journey, and approved the Functional Requirements governing operational journey execution.

The Journey Workspace is intentionally distinct from Journey Planning and forms the operational centre for confirmed traveller journeys.

---

# 2. Module Vision

## Approved Vision

Journey Workspace is the operational execution module responsible for managing confirmed journeys from the point of commercial confirmation until operational closure.

The module enables Workspace Users to coordinate bookings, manage traveller support, monitor operational readiness, and ensure successful journey delivery.

Unlike Journey Planning, Journey Workspace manages committed operational work rather than commercial planning.

---

# 3. Business Purpose

The Product Owner approved the following business purpose.

Journey Workspace exists to:

- manage confirmed journeys,
- coordinate operational readiness,
- monitor booking progress,
- manage traveller servicing,
- coordinate suppliers,
- support travellers before, during and after travel,
- preserve operational history.

The module represents the execution phase of the traveller lifecycle.

---

# 4. Primary Business Object

## Journey

The Journey is the primary business object within the Journey Workspace.

A Journey represents a commercially confirmed travel commitment.

It is created only after a Journey Planning Record has been successfully confirmed.

---

# 5. Product Owner Decisions

## PD-JW-001 – Journey Creation

**Approved**

A Journey shall only be created through successful conversion of a Journey Planning Record.

Workspace Users shall not create Journeys directly.

This preserves the relationship between planning and operational execution.

---

## PD-JW-002 – Operational Scope

**Approved**

Journey Workspace begins after commercial confirmation.

Operational activities include:

- bookings,
- confirmations,
- traveller servicing,
- vendor coordination,
- journey execution,
- traveller support,
- post-journey completion.

Commercial proposal activities remain within Journey Planning.

---

## PD-JW-003 – Journey Changes

**Approved**

Minor operational changes after confirmation shall remain within the same Journey.

Examples include:

- hotel changes,
- sightseeing adjustments,
- sequence changes,
- operational refinements.

These do not require a new Journey.

---

## PD-JW-004 – Material Scope Changes

**Approved**

If a traveller requests a fundamentally different destination after confirmation, the existing Journey shall not be modified into a different destination.

Instead:

- the confirmed Journey may be placed On Hold where operationally appropriate,
- a new Journey Planning Record shall be created,
- the new destination shall follow the standard planning process.

This preserves commercial and operational integrity.

---

## PD-JW-005 – Journey Completion

**Approved**

A Journey concludes when one of the following outcomes occurs:

- Successfully Completed
- Cancelled
- Archived

Although post-confirmation cancellation is expected to be rare, the Product Owner confirmed that it must be supported to preserve historical accuracy.

---

## PD-JW-006 – Operational History

**Approved**

Journey Workspace shall preserve a complete operational history.

Activities performed after confirmation shall remain permanently associated with the Journey.

Operational history shall not be overwritten.

---

# 6. Business Object Structure

## Identity

The Journey includes:

- Journey ID
- Traveller
- Journey Planning Reference
- Owner
- Destination
- Travel Dates
- Current Status

---

## Operational Information

The Journey records operational information including:

- booking confirmations,
- accommodation,
- transportation,
- activities,
- traveller documents,
- traveller communications,
- operational notes.

---

## Child Business Objects

The Journey maintains relationships with:

- Tasks
- Activities
- Operational Notes
- Vendor Bookings
- Documents
- Notifications

Each child object maintains its own identity while remaining linked to the Journey.

---

## Operational Readiness

Journey Workspace tracks operational readiness prior to departure.

Examples include:

- booking confirmations,
- documentation completion,
- traveller readiness,
- supplier readiness.

The objective is to minimise operational risk before departure.

---

# 7. Governance Decisions

## Separation of Planning and Operations

The Product Owner approved a clear separation between:

Journey Planning

↓

Commercial planning

Journey Workspace

↓

Operational execution

The Workspace shall not combine these responsibilities.

---

## Preservation of History

Operational records remain permanent.

Historical operational decisions shall not be overwritten when journey details evolve.

---

## Journey Integrity

A confirmed Journey represents a committed operational entity.

Operational refinements remain within the Journey.

Fundamental destination changes require a new planning process.

---

# 8. Cross Module Relationships

Journey Workspace interacts with:

**Journey Planning**

Receives confirmed Journey Planning Records.

---

**Traveller Hub**

Provides traveller relationship information and historical context.

---

**Itinerary Studio**

Provides the approved itinerary used for operational delivery.

---

**Vendor Management**

Supports supplier coordination and booking fulfilment.

---

**Notifications**

Generates operational notifications for upcoming departures, pending confirmations and traveller support activities.

---

**Dashboard**

Provides operational visibility into active journeys, upcoming departures and outstanding operational work.

---

# 9. Functional Requirement Summary

The Product Owner reviewed and approved the complete Journey Workspace Functional Requirement set.

Outcome:

- **31 Functional Requirements**
- **31 classified as Must Have for Release 1.3**

The approved Functional Requirements include:

- Journey creation
- Operational management
- Booking coordination
- Traveller servicing
- Vendor coordination
- Operational readiness
- Task management
- Notifications
- Search
- Audit history
- Governance
- Operational alerts

During the review, the Product Owner specifically endorsed operational alerts as a key capability to encourage Workspace Users to use the Workspace as their primary operational dashboard.

The detailed Functional Requirements will be incorporated into the Product Specification and Requirements Traceability Matrix during the consolidation phase.

---

# 10. Product Owner Outcome

The Product Owner approved:

- Module Vision
- Business Purpose
- Journey business object
- Business Object structure
- Operational governance
- Journey lifecycle
- Product decisions
- Complete Functional Requirement set

No outstanding Product Owner questions remain for this module.

Module Status:

**Approved**

---

# 11. Impact on Workspace Architecture

Journey Workspace forms the operational execution layer of the Search My Vacation Workspace.

Together with Traveller Hub and Journey Planning, it creates a complete traveller lifecycle:

Traveller Relationship

↓

Journey Planning

↓

Confirmed Journey

↓

Operational Delivery

↓

Journey Completion

This separation between planning and operational execution provides a scalable foundation for future Workspace capabilities while maintaining clear business ownership.

---

---
Document Classification: Product Owner Review Evidence

Authoritative Source:
Product Owner Review Workshops
(Product Owner – Vivek, Delivery Manager – Tiger)

Consumers:
- Product Specification
- Requirements Traceability Matrix
- UX Architecture
- Technical Architecture
- QA Traceability

This document records approved Product Owner decisions and shall not be treated as a design or implementation specification.

---

**End of Document**