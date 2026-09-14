# Journey Workspace Business Lifecycle

| Document Information | |
|----------------------|------------------------------------------------|
| Document Name | Journey Workspace Business Lifecycle |
| Owner | Product Owner |
| Contributors | Arjun (Business Analysis), Tiger (Delivery Governance) |
| Status | Approved |
| Version | 1.0 |
| Last Updated | September 2026 |
| Related Documents | Product Specification v2.0, Requirements Traceability Matrix v2.0, Journey Workspace UX Design Brief |

---

# 1. Purpose

Journey Workspace is the operational heart of Search My Vacation.

This document defines the business lifecycle governing how work enters, progresses through, and is managed within the Journey Workspace.

It establishes the business concepts, lifecycle stages, core business objects and governing business rules that shall be used consistently across Product, UX, Architecture, Engineering and QA.

This document intentionally focuses on business behaviour and lifecycle. It does not prescribe user interface design, technical implementation or software architecture.

---

# 2. Business Vision

Journey Workspace provides a single, unified environment where Workspace Users manage every traveller relationship from the first enquiry through planning, journey execution and future travel opportunities.

Rather than functioning as a traditional CRM or travel operations application, Journey Workspace serves as the operational centre of Search My Vacation, bringing together all information required to create exceptional travel experiences.

Every capability within the Workspace exists to help Workspace Users confidently manage traveller relationships while ensuring nothing important is overlooked.

---

# 3. Product Philosophy

The Journey Workspace is built around the following principles.

## Journey-Centric

The Journey is the primary operational business object within Search My Vacation.

Every significant activity performed after a traveller commits to travelling belongs to a Journey.

---

## Traveller Relationship First

Search My Vacation is built around long-term traveller relationships rather than one-time transactions.

Every Journey contributes towards building an ongoing relationship with the traveller.

---

## Organised Workspace

The Workspace should help every Workspace User feel organised from the moment they log in.

Information should be presented clearly, allowing users to immediately understand what requires attention.

---

## Calm Confidence

Journey Workspace should behave like a calm, experienced coworker.

It should proactively present relevant information, reduce cognitive load and help Workspace Users make confident decisions without overwhelming them.

---

## Nothing Important Missed

At the end of each working day, Workspace Users should feel confident that:

- their travellers are in good hands
- their priorities were managed
- nothing important has been missed

---

# 4. Core Business Objects

The Journey Workspace revolves around two primary business objects.

## Inquiry

The Inquiry represents potential business entering Search My Vacation.

Every external interaction enters the Workspace as an Inquiry irrespective of its source.

Examples include:

- Journey Passport submissions
- Website enquiries
- WhatsApp conversations
- Telephone enquiries
- Email enquiries
- Walk-in customers
- Returning traveller requests
- Manual entries
- Vendor referrals

An Inquiry owns all pre-sales interactions with the traveller.

---

## Journey

A Journey represents confirmed traveller business.

A Journey is created only after the traveller accepts the proposed quotation.

Once created, the Journey becomes the primary operational object through which planning, execution and post-travel activities are managed.

---

# 5. Business Lifecycle

The high-level business lifecycle within Journey Workspace is illustrated below.

```
External Interaction
        │
        ▼
     Inquiry
        │
        ▼
Qualification
        │
        ▼
Proposal Creation
        │
        ▼
Traveller Decision
      ┌───────┴────────┐
      │                │
Accepted         Not Accepted
      │                │
      ▼                ▼
 Journey          Inquiry Closed /
 Created          Lost / On Hold
      │
      ▼
Planning
      │
      ▼
Operations
      │
      ▼
Travel
      │
      ▼
Journey Completion
      │
      ▼
Future Traveller Relationship
```

---

# 6. Business Rules

## BR-001 — Entry Point

All external traveller interactions shall be created as Inquiries.

---

## BR-002 — Inquiry Ownership

All pre-sales discussions, traveller interactions and proposal iterations remain part of the Inquiry.

---

## BR-003 — Proposal Ownership

Every proposal version belongs to the Inquiry.

Only the traveller-accepted proposal becomes associated with the Journey.

Historical proposal versions remain part of the Inquiry for traceability and business reference.

---

## BR-004 — Journey Creation

A Journey shall only be created after the traveller accepts the proposed quotation.

Creating an itinerary or sending a quotation does not create a Journey.

Traveller acceptance is the business event that creates a Journey.

---

## BR-005 — Inquiry Outcomes

Not every Inquiry becomes a Journey.

Possible Inquiry outcomes include:

- Journey Created
- Lost
- On Hold
- Cancelled
- Future Follow-up

---

## BR-006 — Journey Ownership

Once created, every operational activity belongs to the Journey.

Examples include:

- Vendor Management
- Confirmations
- Operational Planning
- Traveller Documentation
- Journey Execution
- Traveller Support
- Journey Completion

---

# 7. Workspace Experience

Journey Workspace exists to support Workspace Users throughout their working day.

The desired experience is:

When logging in:

- organised
- informed
- inspired

During the day:

- focused
- confident
- proactive

When logging out:

- satisfied
- relaxed
- confident that travellers are in good hands
- confident that nothing important has been missed

---

# 8. Relationship to UX

This document defines the business truth of Journey Workspace.

The Journey Workspace UX Design Brief shall translate these business principles into:

- Information Architecture
- Navigation
- User Journeys
- Interaction Flows
- Screen Hierarchy
- Wireframes
- UX Standards

The UX Design Brief shall not alter the business rules defined within this document.

---

# 9. Future Considerations

This document intentionally focuses on Release 1.3.

Future releases may expand the Journey Workspace with additional business capabilities, lifecycle stages and operational features while preserving the business principles defined within this document.