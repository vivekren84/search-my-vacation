# PO-REVIEW-09-Settings.md

**Search My Vacation**

**Release:** 1.3

**Workstream:** WS3 – Workspace Product Specification

**Module:** 09 – Settings

**Document Type:** Product Owner Review Notes

**Prepared By:** Tiger – Delivery Manager

**Reviewed With:** Vivek – Product Owner

**Status:** Product Owner Approved

**Version:** 1.0

---

# 1. Purpose

This document records the Product Owner Review conducted for the Settings module as part of Release 1.3.

The review established Settings as the Workspace capability responsible for administration, system configuration and personal Workspace preferences. It also clarified the separation between organisation-wide configuration and individual user preferences.

These notes preserve the Product Owner decisions, governance principles and approved Functional Requirement scope for subsequent Product Specification consolidation.

---

# 2. Module Vision

## Approved Vision

Settings provides the administrative and configuration capabilities required to operate the Search My Vacation Workspace.

The module enables authorised administrators to manage organisational configuration while allowing individual Workspace Users to manage their own personal preferences without affecting the wider Workspace.

Settings ensures that configurable business concepts remain configurable rather than requiring application changes.

---

# 3. Business Purpose

The Product Owner approved the following business purpose.

Settings exists to:

- administer the Workspace,
- manage Workspace Users,
- maintain configurable business concepts,
- manage organisational preferences,
- support individual user preferences,
- provide controlled administration of the Workspace.

The module balances organisational governance with personal user experience.

---

# 4. Primary Business Object

## Workspace Configuration

The primary business object is the Workspace Configuration.

Workspace Configuration represents the organisational settings and configurable concepts governing the operation of the Workspace.

Personal User Preferences are maintained separately from organisational configuration while remaining part of the Settings module.

---

# 5. Product Owner Decisions

## PD-ST-001 – Configuration Over Code

**Approved**

Business concepts expected to evolve over time shall be managed through configuration wherever practical.

The Product Owner specifically approved this principle to reduce future development effort and improve Workspace adaptability.

---

## PD-ST-002 – Workspace Administration

**Approved**

Authorised administrators may manage organisational configuration including:

- Workspace Users
- Roles and permissions
- Business configuration
- Organisational preferences

Administrative activities remain controlled through appropriate access permissions.

---

## PD-ST-003 – Personal User Preferences

**Approved**

Individual Workspace Users shall be able to manage their own personal Workspace preferences.

Examples include:

- changing password,
- updating profile photograph,
- selecting appearance preferences (Light Mode / Dark Mode),
- managing personal account settings.

These preferences affect only the individual user and do not alter organisational configuration.

---

## PD-ST-004 – Separation of Administration and Personal Preferences

**Approved**

The Product Owner approved a clear separation between:

Workspace Administration

↓

Organisation-wide configuration

Personal Preferences

↓

Individual Workspace User configuration

The Workspace shall maintain these responsibilities independently.

---

## PD-ST-005 – Administrator Managed Concepts

**Approved**

Configurable business concepts shall be maintained through administrator-managed configuration.

Examples include business reference data and operational configuration values that may evolve over time.

The Product Owner specifically confirmed that such concepts should be configurable rather than hard-coded.

---

# 6. Business Object Structure

## Organisational Configuration

Workspace Configuration includes:

- Organisation settings
- Business configuration
- Configurable reference data
- Operational preferences
- System defaults

---

## User Administration

Administrative capabilities include:

- Workspace User management
- Role assignment
- Permission management
- User activation
- User deactivation

---

## Personal User Preferences

Each Workspace User may maintain:

- Profile information
- Password
- Profile photograph
- Appearance preferences
- Personal Workspace preferences

These settings are independent of organisational administration.

---

## Audit Information

Administrative configuration changes shall be recorded for governance and traceability.

Personal preference updates remain associated with the individual Workspace User.

---

# 7. Governance Decisions

## Controlled Administration

Organisation-wide configuration shall be performed only by authorised administrators.

Administrative authority remains independent of operational ownership.

---

## Separation of Concerns

Workspace Settings distinguish between:

Organisation

↓

Shared configuration

User

↓

Personal preferences

This separation improves usability while preserving governance.

---

## Configurable Workspace

Where practical, Workspace behaviour shall be driven through configuration rather than application code.

This principle supports long-term maintainability and future product evolution.

---

# 8. Cross Module Relationships

Settings interacts with all Workspace modules.

**Dashboard**

Controls Workspace-level preferences where applicable.

---

**Traveller Hub**

Supports user preferences for viewing and interaction.

---

**Journey Planning**

Provides configurable planning reference data where appropriate.

---

**Journey Workspace**

Supports operational configuration.

---

**Itinerary Studio**

Supports configuration of itinerary-related business concepts.

---

**Vendor Management**

Supports supplier reference configuration.

---

**Destination Intelligence**

Supports configurable destination governance settings.

---

**Notifications**

Controls notification preferences and Workspace notification behaviour where appropriate.

---

# 9. Functional Requirement Summary

The Product Owner reviewed and approved the complete Settings Functional Requirement set.

Outcome:

- **21 Functional Requirements**
- **21 classified as Must Have for Release 1.3**

The approved Functional Requirements include:

- Workspace administration
- User management
- Role management
- Permission management
- Personal user preferences
- Password management
- Profile management
- Configuration management
- Audit history
- Governance

The Product Owner specifically approved extending the module beyond administrator-only functions to include personal Workspace User profile and preference management.

The detailed Functional Requirements will be incorporated into the Product Specification and Requirements Traceability Matrix during the consolidation phase.

---

# 10. Product Owner Outcome

The Product Owner approved:

- Module Vision
- Business Purpose
- Workspace Configuration as the primary business object
- Business Object structure
- Governance model
- Product decisions
- Complete Functional Requirement set

No outstanding Product Owner questions remain for this module.

Module Status:

**Approved**

---

# 11. Impact on Workspace Architecture

Settings establishes the governance foundation for the Search My Vacation Workspace.

By separating organisational configuration from individual user preferences, the Workspace provides a consistent administrative model while allowing Workspace Users to personalise their own experience.

The Product Owner's approval of configuration-driven business concepts also establishes an architectural principle that supports future scalability and reduces dependency on application code for operational changes.

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