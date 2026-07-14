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


# Decision-003

## Title

Brand Identity and Design Philosophy

---

## Date

13 Jul 2026

---

## Context

As Project Compass transitions from product planning into user experience design, a consistent visual and brand foundation is required to ensure every future milestone delivers a cohesive customer experience.

Without documented design standards, future development risks inconsistent branding, user interfaces and messaging.

---

## Decision

Search My Vacation will establish an official Brand Identity, Design Principles and Design System.

The company will position itself as a premium personalised travel planning company rather than a traditional Online Travel Agency (OTA).

The website will follow a storytelling approach that emphasizes trust, personalization and memorable travel experiences before promotional content.

---

## Rationale

This approach:

- Differentiates Search My Vacation from price-led OTAs.
- Reinforces the company's USP of handcrafted itineraries.
- Creates a consistent visual language across future releases.
- Simplifies future UX and UI decisions.
- Supports the long-term vision of becoming a Travel Experience Platform.

---

## Alternatives Considered

### Option A

Continue designing pages individually without documented standards.

**Rejected**

Reason:

Would lead to inconsistent branding and increased design rework.

---

### Option B

Establish a formal Brand Identity and Design System before UI implementation.

**Selected**

Reason:

Provides a reusable design foundation that supports long-term product evolution.

---

## Impact

Positive

- Stronger brand consistency.
- Improved customer trust.
- Faster UI development.
- Reduced future redesign effort.
- Better onboarding for future contributors.

---

## Related Documents

- BRAND-IDENTITY.md
- DESIGN-PRINCIPLES.md
- DESIGN-SYSTEM.md
- PRODUCT-ROADMAP.md
- SRS.md

---

## Status

Approved

---

## DECISION-004

**Title:** Homepage Experience Direction & Navigation Simplification

**Date:** 14 July 2026

**Status:** Approved

### Context

During the Homepage Design Workshop, multiple homepage concepts were explored to determine the optimal balance between storytelling, inspiration and simplicity for SearchMyVacation Version 1.0.

The objective was to create a homepage that feels premium and experience-first while avoiding unnecessary visual clutter and decision fatigue.

Several navigation and hero alternatives were also evaluated.

---

### Options Considered

#### Option A – Storyteller Homepage

A richer homepage containing multiple storytelling sections including traveller stories, travel inspiration and featured experiences.

**Pros**

- Rich storytelling
- More inspirational content
- Greater opportunity for engagement

**Cons**

- Longer scrolling experience
- Increased cognitive load
- Slightly cluttered first impression

---

#### Option C – Experience Portal

A cleaner homepage focused on progressive discovery.

Sections are intentionally reduced while preserving trust and inspiration.

**Pros**

- Cleaner visual hierarchy
- Better whitespace
- Faster understanding
- Stronger focus on the primary CTA
- Premium first impression

**Cons**

- Less supporting content on the homepage
- Inspiration content moves deeper into the website

---

### Decision

The project will adopt **Concept C** as the homepage direction for Version 1.0.

Additional decisions approved:

- Hero will use a single cinematic image (no carousel).
- Search will remain integrated within the Hero section.
- "Contact Us" will be removed from the primary navigation.
- Primary CTA remains **Plan My Journey**.
- Traveller Stories will be redesigned as story-led content rather than traditional testimonials.
- "Featured Experiences" naming will be revisited to improve clarity.

---

### Rationale

Concept C best represents SearchMyVacation's vision of becoming an Experience Portal rather than a traditional travel website.

The simplified layout improves usability, reduces visual clutter and creates a calmer, more premium experience while maintaining trust-building elements.

---

### Impact

This decision establishes the visual direction for:

- Homepage UI
- Design System
- React implementation
- Responsive layouts
- Future design consistency

---

### Follow-up Actions

- Create high-fidelity Homepage Hero.
- Design the final navigation.
- Validate hero imagery.
- Finalise naming for the curated journeys section.

---

### Decision Owners

- Vivek
- Archie 

---
# Future Decisions

| ID | Title | Status |
|----|-------|--------|
| Decision-005 | TBD | Pending |
| Decision-006 | TBD | Pending |