# PO-REVIEW-03-Journey-Planning.md

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 – Workspace Product Specification

**Module:** 03 – Journey Planning

**Document Type:** Product Owner Review Notes

**Prepared By:** Tiger – Delivery Manager

**Reviewed With:** Vivek – Product Owner

**Status:** Product Owner Approved

**Version:** 1.0

---

# 1. Purpose

This document records the Product Owner Review conducted for the Journey Planning module as part of Release 1.3.

The purpose of the review was to validate the business model, refine the operational workflow, establish governance principles and approve the functional scope prior to updating the Workspace Product Specification and Requirements Traceability Matrix.

These notes form part of the Product Owner Review evidence and preserve the reasoning behind approved decisions.

---

# 2. Module Vision

## Approved Vision

Journey Planning is the Workspace capability responsible for discovering, qualifying, designing and commercialising a traveller's proposed journey before any operational commitments are made.

The module supports the complete pre-confirmation planning lifecycle from the initial enquiry through proposal preparation, revisions and commercial decision.

Journey Planning is an iterative planning workspace rather than a booking management tool.

---

# 3. Business Purpose

The Product Owner approved the following business purpose.

Journey Planning exists to:

- understand traveller requirements,
- coordinate planning activities,
- manage proposal iterations,
- coordinate vendor quotations,
- guide commercial discussions,
- and ultimately convert a qualified proposal into a confirmed Journey.

The module supports collaborative planning while preserving the complete planning history.

---

# 4. Primary Business Object

## Journey Planning Record

The Journey Planning Record represents a single planning effort for one Traveller for one destination or destination region.

The Product Owner confirmed that this is the primary business object for the module.

---

# 5. Product Owner Decisions

## PD-JP-001 – One Planning Record Per Destination

**Approved**

A Journey Planning Record represents one Traveller planning one destination or destination region.

Examples:

Accepted:

Traveller → Bali

Traveller → Kerala

Traveller → Japan

Not Accepted:

One Journey Planning Record containing:

- Bali
- Singapore
- Malaysia

If the traveller decides to plan another destination, a new Journey Planning Record shall be created.

---

## PD-JP-002 – Proposal Versions

**Approved**

Multiple proposal versions may exist within the same Journey Planning Record.

Proposal versions represent the evolution of discussions with the traveller.

Only one proposal version shall be considered the current active proposal.

Previous proposal versions shall remain available for historical reference.

---

## PD-JP-003 – Vendor Quotations

**Approved**

Vendor Quotations are distinct from Proposal Versions.

Vendor Quotations represent commercial information received from vendors.

Proposal Versions represent traveller-facing proposals created by Search My Vacation.

These two concepts shall remain separate throughout the Workspace.

---

## PD-JP-004 – Traveller Relationship

**Approved**

Journey Planning references the Traveller.

It does not create or own the Traveller.

Traveller information continues to be maintained within Traveller Hub.

---

## PD-JP-005 – Planning Lifecycle

The approved planning lifecycle is:

1. Lead Created
2. Discovery
3. Planning
4. Proposal Shared
5. Revision
6. Decision
7. Closed

Closure may result in:

- Confirmed
- Lost
- Archived

---

## PD-JP-006 – Planning Scope

Journey Planning captures traveller requirements including:

- destination,
- travel dates,
- flexibility,
- duration,
- budget,
- traveller companions,
- special requests,
- flight preferences.

The Product Owner specifically approved the inclusion of flight preferences, recognising that travellers may express preferences such as non-stop flights or preferred transit locations.

The Product Owner did not consider "purpose of travel" to be essential for Release 1.3.

---

## PD-JP-007 – Archive Behaviour

Planning Records shall never be deleted as part of normal operations.

Closed planning records remain available for historical and analytical purposes.

---

# 6. Business Object Structure

The Journey Planning Record contains:

## Identity

- Planning ID
- Traveller
- Destination / Region
- Owner
- Created Date
- Current Status

---

## Traveller Requirements

- Travel Dates
- Date Flexibility
- Duration
- Budget
- Companions
- Special Requests
- Flight Preferences

---

## Planning Activities

- Discovery Notes
- Activities
- Proposal Versions
- Vendor Quotations
- Follow-ups
- Tasks

---

## Documents

Journey-related supporting documentation may be associated where applicable.

Examples include:

- Passport copies (International)
- Visa documentation
- Traveller documents

The Product Owner clarified that these requirements vary by journey type and should not be considered mandatory for domestic travel.

---

# 7. Ownership Model

The Product Owner approved the generic Workspace ownership model.

Journey Planning supports:

- Claim
- Assign
- Reassign

Definitions:

**Claim**

A Workspace User voluntarily assumes responsibility for an unowned planning record.

**Assign**

An authorised Workspace User allocates responsibility to another Workspace User.

**Reassign**

Responsibility transfers from one Workspace User to another.

Ownership represents operational responsibility and remains independent from lifecycle status.

---

# 8. Governance Decisions

The following governance decisions were approved.

## Separation of Business Concepts

The Workspace shall maintain separate concepts for:

- Planning Status
- Ownership
- Proposal Versions
- Vendor Quotations

These concepts shall not be combined into a single status field.

---

## Historical Integrity

Proposal history shall be preserved.

Vendor quotation history shall be preserved.

Planning history shall remain available even after confirmation or closure.

---

## Relationship Integrity

Journey Planning creates confirmed Journeys.

Traveller Hub maintains traveller relationships.

Journey Workspace manages confirmed journeys.

Each module owns its own business responsibility.

---

# 9. Cross Module Relationships

Journey Planning interacts with:

**Traveller Hub**

Provides traveller identity and relationship information.

**Journey Workspace**

Receives confirmed planning records upon successful conversion.

**Vendor Management**

Provides vendor quotations and commercial inputs.

**Itinerary Studio**

Provides reusable itinerary assets that may be customised during planning.

**Notifications**

Generates operational notifications for planning activities where appropriate.

**Dashboard**

Provides operational visibility into planning workload and outstanding actions.

---

# 10. Functional Requirement Summary

The Product Owner reviewed and approved the complete Journey Planning Functional Requirement set.

Outcome:

- **30 Functional Requirements**
- **30 classified as Must Have for Release 1.3**

An additional governance-related requirement proposed during review was also approved as mandatory, bringing the final approved total to **30 Functional Requirements**.

The approved Functional Requirements cover:

- Planning creation
- Traveller association
- Requirement capture
- Proposal management
- Vendor quotation management
- Ownership
- Follow-ups
- Tasks
- Status management
- Search
- Audit history
- Governance

The detailed Functional Requirement wording will be incorporated into the Product Specification and Requirements Traceability Matrix during the consolidation phase.

---

# 11. Product Owner Outcome

The Product Owner approved:

- Module Vision
- Business Purpose
- Journey Planning Record as the primary business object
- Business Object structure
- Ownership model
- Governance principles
- Planning lifecycle
- Product decisions
- Complete Functional Requirement set

No outstanding Product Owner questions remain for this module.

Module Status:

**Approved**

---

# 12. Impact on Workspace Architecture

Journey Planning establishes the operational bridge between Traveller Hub and Journey Workspace.

It is responsible for commercial planning but deliberately avoids managing confirmed journeys.

This separation creates a clear distinction between planning activities and operational journey execution, reducing complexity and improving long-term maintainability of the Workspace.

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