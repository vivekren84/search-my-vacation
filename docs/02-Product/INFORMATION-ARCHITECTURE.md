# Information Architecture

**Product:** Search My Vacation

**Internal Project:** Project Compass

**Document Version:** 0.1

**Status:** Draft (Milestone 1)

**Business Owner:** Search My Vacation

**Product Owner:** Vicky

**Technical Architect:** Archie

**Created:** 10 Jul 2026

**Last Updated:** 10 Jul 2026

---

# Purpose

This document defines the information architecture for Milestone 1 of Search My Vacation.

It identifies the website structure, navigation hierarchy, page catalogue and relationships between different sections of the platform.

This document acts as the blueprint for the Product Requirements (SRS), UX Design, Wireframes and Development.

---

# Scope

This Information Architecture covers **Milestone 1 – Website Replacement** only.

Future capabilities such as Login, Wishlist, CRM, AI Assistant, Customer Dashboard, Vendor Portal and Customer Community are intentionally excluded.

---

# Design Philosophy

Every visitor should experience the website in the following order:

**Inspire → Educate → Build Confidence → Convert**

Search My Vacation follows three guiding principles.

1. Inspire before Selling
2. Educate before Convincing
3. Build Confidence before Conversion

The website should never pressure visitors into making an enquiry.

Instead, it should gradually build trust and confidence before inviting them to start planning their journey.

---

# Website Structure

```
Home
│
├── Destinations
│     ├── Domestic
│     │      ├── South India
│     │      ├── North India
│     │      ├── East India
│     │      └── West India
│     │
│     └── International
│            ├── Asia
│            ├── Europe
│            ├── Middle East
│            ├── Africa
│            └── Oceania
│
├── Travel Collections
│     ├── Weekend Getaways
│     ├── Family Holidays
│     ├── Romantic Escapes
│     ├── Adventure Holidays
│     ├── Senior Friendly
│     ├── Nature & Wildlife
│     ├── Heritage & Culture
│     └── International Holidays
│
├── Blogs
│
├── About Us
│
├── Contact Us
│
├── Privacy Policy
│
└── Terms & Conditions
```

---

# Page Catalogue

| Page | Purpose | Primary Audience | Primary CTA | Priority |
|------|----------|-----------------|-------------|----------|
| Home | Build trust and inspire exploration | All Visitors | Explore Destinations | High |
| Destinations | Help visitors discover destinations by geography and interests | All Visitors | View Destination | High |
| Travel Collections | Inspire visitors through curated travel experiences | Visitors seeking ideas | Explore Collection | High |
| Destination Details | Build confidence through destination-specific information | Interested Travellers | Plan My Trip | High |
| Blogs | Educate and inspire travellers | Explorers | Read More | Medium |
| About Us | Build credibility and reinforce trust | All Visitors | Contact Us | Medium |
| Contact Us | Convert visitors into enquiries | Interested Visitors | Submit Enquiry | High |
| Privacy Policy | Legal Compliance | All Visitors | None | Mandatory |
| Terms & Conditions | Legal Compliance | All Visitors | None | Mandatory |

---

# Primary Navigation

The primary navigation should remain simple and familiar.

- Home
- Destinations
- Travel Collections
- Blogs
- About Us
- Contact Us

The **Plan My Trip** button should remain permanently visible in the navigation bar as the primary Call-to-Action.

---

# Navigation Philosophy

Most travellers already have one of two mindsets.

### Type 1

"I already know where I want to go."

Example:

- Bali
- Kashmir
- Dubai

These visitors should naturally choose **Destinations**.

---

### Type 2

"I know I want a holiday, but I don't know where."

These visitors should naturally choose **Travel Collections**.

---

The website should support both discovery patterns equally.

Rather than forcing customers into one navigation style, Search My Vacation should guide them naturally based on their planning stage.

This approach balances familiarity with innovation and aligns with our philosophy of helping customers make confident travel decisions.

---

# Secondary Navigation

Secondary navigation includes:

- Privacy Policy
- Terms & Conditions
- Contact Information
- Social Media Links
- Copyright
- Quick Links

These items should appear within the website footer.

---

# Page Definitions

---

## Home

### Purpose

Create trust and encourage exploration.

### Primary Goal

Help visitors understand Search My Vacation within the first few seconds.

### Key Sections

- Hero Banner
- Search My Vacation Introduction
- Travel Collections
- Featured Destinations
- Why Choose Search My Vacation
- Customer Testimonials
- Latest Blogs
- Plan My Trip CTA

---

## Destinations

### Purpose

Help travellers browse destinations based on regions while also introducing curated travel experiences.

### Key Sections

- Domestic Destinations
- International Destinations
- Featured Destinations
- Popular Destinations
- Trending Destinations
- Travel Collection Highlights
- Destination Filters

---

## Travel Collections

### Purpose

Help travellers discover destinations based on the type of holiday they want rather than geography.

### Example Collections

- Weekend Getaways
- Family Holidays
- Romantic Escapes
- Adventure Holidays
- Senior Friendly
- Nature & Wildlife
- Heritage & Culture
- International Holidays

### Key Sections

- Collection Banner
- Collection Description
- Destination Cards
- Suggested Duration
- Featured Blogs
- Plan My Trip CTA

---

## Destination Details

### Purpose

Build confidence before travellers contact Search My Vacation.

### Key Sections

- Destination Overview
- Image Gallery
- Destination Highlights
- Best Time to Visit
- Suggested Duration
- Sample Itinerary
- Travel Tips
- Frequently Asked Questions
- Related Destinations
- Plan My Trip CTA

> **Note:** Travel Confidence and Trip Scorecard will be introduced in a future milestone.

---

## Blogs

### Purpose

Educate and inspire travellers.

### Categories

- Destination Guides
- Travel Tips
- Family Travel
- Budget Travel
- International Travel
- Seasonal Travel

---

## About Us

### Purpose

Build trust through transparency and authenticity.

### Key Sections

- Our Story
- Vision
- Values
- Why Choose Search My Vacation
- Our Promise

---

## Contact Us

### Purpose

Provide visitors with multiple convenient ways to connect with Search My Vacation.

### Contact Methods

- Interactive Enquiry
- WhatsApp
- Email
- Phone
- Office Location
- Business Hours

---

# Global Components

The following reusable components may appear across multiple pages.

- Header
- Navigation Menu
- Footer
- Plan My Trip Button
- WhatsApp Floating Button
- Breadcrumb Navigation
- Destination Cards
- Collection Cards
- Testimonials
- Blog Cards
- Related Destinations
- Newsletter Signup (Future)

---

# Navigation Principles

Every page should provide a clear next step.

Visitors should never reach a dead end.

Every page should encourage one primary action.

Possible next actions include:

- Explore Destinations
- Explore Travel Collections
- Read Related Blog
- View Similar Destinations
- Plan My Trip
- Contact Us

---

# Out of Scope (Milestone 1)

The following capabilities are intentionally excluded.

- Login
- Registration
- Wishlist
- Customer Dashboard
- CRM
- AI Assistant
- Vendor Portal
- Group Tours
- Loyalty Programme
- Travel Confidence
- Trip Scorecard
- Online Payments
- Customer Reviews
- Community Features

These will be introduced in future milestones as defined in the Product Roadmap.

---

# Traceability

This document supports:

- Product Roadmap
- Travel Journeys
- SRS
- Wireframes
- UX Design
- Development

---

# Next Document

SRS.md