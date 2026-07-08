# Decision Log

**Product:** Search My Vacation

**Internal Project:** Project Compass

**Document Version:** 0.1

**Status:** Living Document

**Business Owner:** Search My Vacation

**Product Owner:** Vicky

**Technical Architect:** Archie

**Created:** 09 Jul 2026

**Last Updated:** 09 Jul 2026

---

# Purpose

This document records important business, product and technical decisions made during Project Compass.

Every significant decision should include:

- Context
- Decision
- Rationale
- Impact
- Alternatives Considered

The objective is to ensure future team members understand *why* decisions were made, not just *what* was built.

---

# Decision-001

## Title

Milestone-Based Product Delivery

---

## Date

09 Jul 2026

---

## Context

Project Compass aims to build a long-term Travel Relationship Platform.

However, the existing WordPress website is outdated and no longer represents the quality of Search My Vacation. Waiting to build the complete platform before launching would delay business value and increase project risk.

---

## Decision

The product will be developed and released through incremental milestones.

Each milestone will solve a specific business problem while contributing to the long-term product vision.

All planning, design and development activities will initially focus only on the current milestone.

Future functionality will be documented but intentionally excluded from the active milestone scope.

---

## Rationale

This approach:

- Delivers business value sooner.
- Replaces the outdated website quickly.
- Reduces project risk.
- Prevents scope creep.
- Allows customer feedback after each milestone.
- Supports continuous improvement.

---

## Alternatives Considered

### Option A

Build the complete platform before launch.

**Rejected**

Reason:

High delivery time and increased project complexity.

---

### Option B

Replace the website first and continuously evolve it.

**Selected**

Reason:

Provides faster business value while preserving long-term scalability.

---

## Impact

Positive

- Faster launch.
- Better prioritization.
- Easier planning.
- Smaller releases.
- Lower implementation risk.

---

## Related Documents

- COMPASS.md
- PRODUCT-ROADMAP.md
- TRAVEL-JOURNEYS.md
- SRS.md

---

## Status

Approved

---

---

# Decision-002

## Title

Mobile-First, Device-Agnostic Product Strategy

---

## Date

10 Jul 2026

---

## Context

The majority of travellers are expected to discover Search My Vacation through mobile devices via search engines, social media and messaging platforms.

However, customers often continue their travel planning on tablets and desktops while discussing itineraries with family members.

The platform must therefore provide a consistent and high-quality experience across all supported devices.

---

## Decision

Project Compass will adopt a **Mobile-First Design Strategy**.

Every feature introduced into the platform will first be designed and validated for mobile devices before being progressively enhanced for tablets and desktops.

Responsive behaviour alone is not considered sufficient.

Each feature must provide an equally intuitive and trustworthy experience regardless of the device being used.

---

## Rationale

This approach:

- Prioritizes the primary device used by travellers.
- Improves enquiry conversion.
- Simplifies responsive design decisions.
- Creates a consistent customer experience.
- Supports future mobile application development.
- Reduces usability issues across different screen sizes.

---

## Alternatives Considered

### Option A

Desktop-first design.

**Rejected**

Reason:

Does not reflect how most travellers discover and browse travel experiences today.

---

### Option B

Mobile-first with progressive enhancement.

**Selected**

Reason:

Aligns with customer behaviour while ensuring a high-quality experience across Mobile, Tablet and Desktop devices.

---

## Impact

Positive

- Better customer experience.
- Improved usability.
- Future-ready architecture.
- Consistent design standards.
- Reduced rework during development.

---

## Related Documents

- COMPASS.md
- INFORMATION-ARCHITECTURE.md
- FEATURE-INVENTORY.md
- SRS.md

---

## Status

Approved

---

# Future Decisions

| ID | Title | Status |
|----|-------|--------|
| Decision-003 | TBD | Pending |
| Decision-004 | TBD | Pending |