# Software Requirements Specification (SRS)

**Product:** Search My Vacation

**Internal Project:** Project Compass

**Document Version:** 0.1

**Status:** Draft (Milestone 1 Baseline)

**Business Owner:** Search My Vacation

**Product Owner:** Vicky

**Technical Architect:** Archie

**Created:** 10 Jul 2026

**Last Updated:** 10 Jul 2026

**Related Documents:** - COMPASS.md - PRODUCT-ROADMAP.md -
TRAVEL-JOURNEYS.md - INFORMATION-ARCHITECTURE.md - FEATURE-INVENTORY.md

------------------------------------------------------------------------

# 1. Purpose

This document defines the functional and non-functional requirements for
**Milestone 1** of Search My Vacation.

Milestone 1 focuses on replacing the existing website with a modern,
trustworthy and mobile-first platform that improves customer confidence
and enquiry conversion.

------------------------------------------------------------------------

# 2. Scope

Included:

-   Homepage
-   Destinations
-   Travel Collections
-   Destination Details
-   Blogs
-   About Us
-   Contact Us
-   Interactive "Plan My Trip"
-   Legal Pages

Excluded:

-   Login / Registration
-   Wishlist
-   CRM
-   AI Assistant
-   Online Payments
-   Customer Dashboard
-   Vendor Portal

------------------------------------------------------------------------

# 3. Business Rules

  -----------------------------------------------------------------------
  ID                           Rule
  ---------------------------- ------------------------------------------
  BR-001                       Every page shall have one primary
                               Call-to-Action (CTA).

  BR-002                       Every destination shall contain a sample
                               itinerary.

  BR-003                       Every destination shall display the best
                               time to visit.

  BR-004                       Every enquiry shall capture destination,
                               travel month, number of travellers and
                               approximate budget.

  BR-005                       The website shall provide an equivalent
                               experience across Mobile, Tablet and
                               Desktop devices.

  BR-006                       "Plan My Trip" shall be accessible from
                               every major page.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 4. Functional Requirements

## Module A -- Homepage

**Related Journey:** J1, J2, J4

**Related Features:** M1-001 to M1-007

### Objective

Build trust, inspire exploration and encourage enquiries.

  ID            Requirement
  ------------- -------------------------------------------------
  FR-HOME-001   Display a hero banner with the company tagline.
  FR-HOME-002   Display featured destinations.
  FR-HOME-003   Display Travel Collections preview.
  FR-HOME-004   Display "Why Choose Search My Vacation".
  FR-HOME-005   Display customer testimonials.
  FR-HOME-006   Display latest blog previews.
  FR-HOME-007   Display persistent "Plan My Trip" CTA.

**Acceptance Criteria**

-   Hero banner loads correctly.
-   CTA navigates correctly.
-   Responsive across supported devices.
-   Homepage loads successfully without layout issues.

------------------------------------------------------------------------

## Module B -- Navigation

**Related Features:** M1-008 to M1-011

  ID           Requirement
  ------------ --------------------------------------------
  FR-NAV-001   Display primary navigation.
  FR-NAV-002   Display sticky navigation after scrolling.
  FR-NAV-003   Display footer navigation.
  FR-NAV-004   Display breadcrumbs on internal pages.

------------------------------------------------------------------------

## Module C -- Destinations

**Related Journey:** J2

**Related Features:** M1-012 to M1-017

  ID            Requirement
  ------------- -------------------------------------
  FR-DEST-001   Display Domestic destinations.
  FR-DEST-002   Display International destinations.
  FR-DEST-003   Support destination categories.
  FR-DEST-004   Display destination cards.
  FR-DEST-005   Support destination filters.
  FR-DEST-006   Display related destinations.

------------------------------------------------------------------------

## Module D -- Travel Collections

**Related Journey:** J2

  ID            Requirement
  ------------- ------------------------------------------------------
  FR-COLL-001   Display curated travel collections.
  FR-COLL-002   Each collection shall display relevant destinations.
  FR-COLL-003   Each collection shall include a CTA to Plan My Trip.

------------------------------------------------------------------------

## Module E -- Destination Details

**Related Journey:** J3

  ID           Requirement
  ------------ -------------------------------
  FR-DET-001   Display destination overview.
  FR-DET-002   Display image gallery.
  FR-DET-003   Display highlights.
  FR-DET-004   Display best time to visit.
  FR-DET-005   Display suggested duration.
  FR-DET-006   Display sample itinerary.
  FR-DET-007   Display travel tips.
  FR-DET-008   Display FAQs.
  FR-DET-009   Display Plan My Trip CTA.

------------------------------------------------------------------------

## Module F -- Blogs

  ID            Requirement
  ------------- ----------------------------
  FR-BLOG-001   Display blog listing.
  FR-BLOG-002   Support blog categories.
  FR-BLOG-003   Display blog detail pages.
  FR-BLOG-004   Display related blogs.

------------------------------------------------------------------------

## Module G -- About Us

  ID             Requirement
  -------------- ----------------------------------------
  FR-ABOUT-001   Display company story.
  FR-ABOUT-002   Display vision and values.
  FR-ABOUT-003   Display Why Choose Search My Vacation.

------------------------------------------------------------------------

## Module H -- Contact / Plan My Trip

  ID           Requirement
  ------------ --------------------------------------------
  FR-CON-001   Provide an interactive enquiry experience.
  FR-CON-002   Capture destination.
  FR-CON-003   Capture travel month.
  FR-CON-004   Capture number of travellers.
  FR-CON-005   Capture approximate budget.
  FR-CON-006   Capture additional requirements.
  FR-CON-007   Display contact details.
  FR-CON-008   Provide WhatsApp contact option.

------------------------------------------------------------------------

## Module I -- Legal

  ID           Requirement
  ------------ -----------------------------
  FR-LEG-001   Display Privacy Policy.
  FR-LEG-002   Display Terms & Conditions.

------------------------------------------------------------------------

# 5. Non-Functional Requirements

  ID        Requirement
  --------- ----------------------------------------------------------
  NFR-001   Mobile-first responsive design.
  NFR-002   Support latest Chrome, Edge, Safari and Firefox.
  NFR-003   SEO-friendly pages with metadata.
  NFR-004   Optimized images and performance.
  NFR-005   HTTPS for all pages.
  NFR-006   Accessibility following WCAG principles where practical.
  NFR-007   Clean, maintainable codebase.
  NFR-008   Hosted through Vercel.

------------------------------------------------------------------------

# 6. Acceptance Criteria

Milestone 1 shall be considered complete when:

-   All planned features are implemented.
-   All functional requirements pass testing.
-   Responsive behaviour is verified on Mobile, Tablet and Desktop.
-   Navigation is complete.
-   All CTAs function correctly.
-   No critical defects remain open.

------------------------------------------------------------------------

# 7. Traceability

Business Vision → Traveller Profiles → Travel Journeys → Information
Architecture → Feature Inventory → SRS → UX → Development → Testing

------------------------------------------------------------------------

# 8. Future Scope

The following capabilities are deferred:

-   Login & Registration
-   Wishlist
-   CRM
-   AI Assistant
-   Customer Dashboard
-   Vendor Portal
-   Online Payments
-   Group Tours
-   Merchandise
-   Loyalty Programme

------------------------------------------------------------------------

# Next Document

Wireframes / Information Design
