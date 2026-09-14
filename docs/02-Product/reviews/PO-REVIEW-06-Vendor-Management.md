# PO-REVIEW-06-Vendor-Management.md

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 – Workspace Product Specification

**Module:** 06 – Vendor Management

**Document Type:** Product Owner Review Notes

**Prepared By:** Tiger – Delivery Manager

**Reviewed With:** Vivek – Product Owner

**Status:** Product Owner Approved

**Version:** 1.0

---

# 1. Purpose

This document records the Product Owner Review conducted for the Vendor Management module as part of Release 1.3.

The review established Vendor Management as the organisational capability responsible for managing supplier relationships, preserving supplier intelligence and supporting operational execution across the Workspace.

These notes preserve the Product Owner decisions, governance principles and approved Functional Requirement scope for subsequent Product Specification consolidation.

---

# 2. Module Vision

## Approved Vision

Vendor Management is the Workspace capability responsible for establishing, maintaining and continuously improving Search My Vacation's supplier ecosystem.

The module is intended to become the organisational memory of supplier relationships, enabling Workspace Users to identify trusted partners, preserve supplier performance history and support journey planning and execution through reliable commercial relationships.

Vendor Management is not merely a contact directory; it is the central repository of supplier intelligence.

---

# 3. Business Purpose

The Product Owner approved the following business purpose.

Vendor Management exists to:

- maintain supplier information,
- support commercial planning,
- coordinate supplier relationships,
- preserve supplier performance history,
- identify preferred partners,
- improve operational consistency,
- strengthen long-term supplier relationships.

---

# 4. Primary Business Object

## Vendor

The Vendor is the primary business object of the module.

A Vendor represents an external organisation or service provider that supplies one or more travel-related services to Search My Vacation.

Examples include:

- Destination Management Companies (DMCs)
- Hotels
- Transport Providers
- Visa Partners
- Insurance Partners
- Cruise Operators
- eSIM Providers
- Activity Operators

The Product Owner clarified that Vendor Management must support a wide variety of supplier types rather than assuming all vendors operate as full-service DMCs.

---

# 5. Product Owner Decisions

## PD-VM-001 – Multi-Service Vendors

**Approved**

A Vendor may provide one or more service categories.

Examples:

- Hotel only
- Cab services only
- Visa processing
- Insurance
- Cruise operations
- Destination Management
- Multiple combined services

The Workspace shall not assume every Vendor provides all services.

---

## PD-VM-002 – Geographic Coverage

**Approved**

Each Vendor shall record the destinations or regions it supports.

This enables Journey Planning and Journey Workspace to identify appropriate operational partners.

---

## PD-VM-003 – Preferred Partner

**Approved**

Preferred Partner is **not** a lifecycle status.

Instead, it is an operational designation that identifies suppliers preferred by Search My Vacation.

The designation is independent of the Vendor lifecycle.

---

## PD-VM-004 – Supplier Performance

**Approved**

Vendor Management shall preserve supplier performance information as organisational knowledge.

Examples include:

- reliability,
- responsiveness,
- commercial competitiveness,
- traveller feedback,
- operational quality.

This information is intended for internal Workspace use only.

---

## PD-VM-005 – Organisational Memory

**Approved**

Vendor Management shall become the organisational memory of supplier relationships.

Supplier intelligence belongs to Search My Vacation rather than individual Workspace Users.

---

# 6. Business Object Structure

## Identity

Each Vendor contains:

- Vendor ID
- Organisation Name
- Vendor Type
- Service Categories
- Geographic Coverage
- Contact Information

---

## Relationship Information

Vendor relationship information includes:

- Preferred Partner designation
- Primary contacts
- Commercial relationship notes
- Active engagements

---

## Journey Relationships

Vendors may be associated with:

- Journey Planning Records
- Journeys
- Master Itineraries
- Destination Profiles

This preserves commercial and operational traceability.

---

## Performance Information

Vendor performance records include:

- reliability observations,
- service quality,
- commercial responsiveness,
- traveller experience,
- operational feedback.

These records support informed supplier selection.

---

# 7. Lifecycle

The Product Owner approved the following Vendor lifecycle.

- Prospective
- Active
- Inactive

The Product Owner explicitly rejected "Preferred" as a lifecycle state.

Preferred Partner remains an independent operational designation.

---

# 8. Governance Decisions

## Separation of Lifecycle and Designation

Vendor Lifecycle and Preferred Partner designation are independent concepts.

Examples:

An Active Vendor may or may not be a Preferred Partner.

An Inactive Vendor retains historical operational information.

---

## Historical Preservation

Supplier history shall be preserved.

Operational learnings remain associated with the Vendor regardless of lifecycle status.

---

## Organisational Ownership

Vendor knowledge belongs to the Workspace.

Supplier relationships remain organisational assets.

---

# 9. Cross Module Relationships

Vendor Management interacts with:

**Journey Planning**

Provides supplier quotations and commercial options.

---

**Journey Workspace**

Supports confirmed operational bookings.

---

**Itinerary Studio**

Provides preferred supplier recommendations.

---

**Destination Intelligence**

Contributes trusted destination-specific supplier knowledge.

---

**Notifications**

Generates supplier-related operational notifications.

---

**Dashboard**

Supports visibility of supplier follow-ups and outstanding operational actions.

---

# 10. Functional Requirement Summary

The Product Owner reviewed and approved the complete Vendor Management Functional Requirement set.

Outcome:

- **30 Functional Requirements**
- **30 classified as Must Have for Release 1.3**

The approved Functional Requirements include:

- Vendor creation
- Vendor maintenance
- Service category management
- Geographic coverage
- Preferred Partner management
- Performance recording
- Search
- Operational relationships
- Governance
- Audit history

The detailed Functional Requirements will be incorporated into the Product Specification and Requirements Traceability Matrix during the consolidation phase.

---

# 11. Product Owner Outcome

The Product Owner approved:

- Module Vision
- Business Purpose
- Vendor as the primary business object
- Business Object structure
- Vendor lifecycle
- Preferred Partner governance
- Product decisions
- Complete Functional Requirement set

No outstanding Product Owner questions remain for this module.

Module Status:

**Approved**

---

# 12. Impact on Workspace Architecture

Vendor Management establishes Search My Vacation's supplier intelligence capability.

Rather than storing supplier contact details alone, the Workspace now preserves long-term commercial knowledge that supports Journey Planning, operational delivery and future organisational learning.

This capability enables Search My Vacation to strengthen supplier relationships over time while improving consistency, traveller experience and operational decision-making.

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