# UI Components

**Version:** 0.1
**Status:** In Progress
**Last Updated:** July 2026

---

# Purpose

This document defines the reusable UI components that form the Search My Vacation Design System.

Each component is designed to be:

- Reusable
- Accessible
- Responsive
- Modular
- Consistent with the SMV Design Language

The goal is to ensure that every new page is assembled from reusable building blocks rather than custom-designed sections.

---

# Design Principles

Every component should:

- Follow the Search My Vacation brand guidelines.
- Be mobile-first.
- Support accessibility (WCAG AA).
- Be reusable across multiple pages.
- Be implemented using React + Next.js + TypeScript.
- Minimize duplicate code.
- Prioritize readability and maintainability.

---

# Component Lifecycle

Every component progresses through the following stages:

Draft
↓

UX Approved
↓

Engineering Approved
↓

Implemented

↓

Tested

↓

Production Ready

---

# Component Inventory

| Component | Status | Owner |
|------------|--------|-------|
| SectionHeader | Draft | Archie + Sophie |
| JourneyCard | Draft | Archie + Sophie |
| JourneyExplorer | Draft | Archie + Sophie |

---

# Component Specification Template

Every component should follow the structure below.

---

## Component Name

Purpose

Description

Inputs (Props)

Behaviour

Responsive Behaviour

Accessibility

Future Enhancements

---

# Component Specifications

---

## SectionHeader

### Purpose

Provides a consistent heading for all homepage and landing page sections.

### Description

Displays:

- Section Title
- Section Subtitle

### Inputs

- title
- subtitle

### Behaviour

- Static component
- Consistent spacing
- Responsive typography

### Responsive Behaviour

Desktop
Tablet
Mobile

Typography scales automatically.

### Accessibility

Uses semantic heading elements.

---

## JourneyCard

### Purpose

Represents a single travel experience category.

### Displays

- Hero Image
- Category Name
- Emotional Tagline
- Explore CTA

### Inputs

- title
- tagline
- image
- destination examples
- url

### Behaviour

Hover

- Slight elevation
- Image zoom
- CTA emphasis

Touch

- Tap interaction

### Responsive Behaviour

Adapts to available card width.

### Accessibility

Keyboard accessible.

Screen-reader friendly.

---

## JourneyExplorer

### Purpose

Displays JourneyCards inside a horizontal scrolling experience.

### Displays

- SectionHeader
- Journey Cards
- Navigation Controls

### Behaviour

Desktop

- 3 cards
- Peek of next card
- Arrow navigation

Tablet

- 2 cards

Mobile

- Swipe navigation
- Peek of next card

### Accessibility

Keyboard navigation.

Screen-reader labels.

### Future Enhancements

Optional auto-scroll.

Analytics tracking.

Personalized ordering.

---

# Future Components

Hero

HeroContent

HeroCTA

DestinationCard

SignatureJourneyCard

TestimonialCard

PartnerLogo

Footer

NavigationBar

SearchBar

FAQAccordion

NewsletterSignup

ContactForm

ReviewCard

TrustBadge

Breadcrumb

PageBanner

FloatingWhatsApp

DestinationGallery

BookingTimeline

TripHighlights

PackagePricing

---