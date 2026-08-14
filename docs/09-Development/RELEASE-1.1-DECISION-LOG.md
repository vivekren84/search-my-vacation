# Search My Vacation Website

# Release 1.1 Decision Log

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.1 Decision Log |
| Version | 1.0 |
| Status | Final |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Record significant product, UX, architecture and release decisions made during Release 1.1 |

---

# Overview

This document captures the key decisions that shaped Release 1.1.

It explains **why** specific implementation and product choices were made, providing historical context for future releases and reducing reliance on chat history or implementation discussions.

---

## Scope

Only decisions that materially influenced product behaviour, architecture, user experience or release management are recorded here.

Routine engineering choices, implementation details and bug fixes are intentionally excluded.

---

# Decision Format

| Field | Description |
|---|---|
| Decision ID | Unique identifier |
| Category | Product / UX / Architecture / Engineering / Release |
| Decision | Final approved decision |
| Status | Active / Superseded / Deferred |
| Rationale | Why the decision was made |
| Impact | Resulting behaviour in Release 1.1 |

---

# Homepage

## DEC-001 — Homepage Traveller Stories

**Category**

Product

**Decision**

Display a maximum of three Traveller Stories on the homepage.

Only stories containing direct traveller testimonials are eligible.

Provide an "Explore Traveller Stories" CTA linking to the dedicated Traveller Stories experience.

**Rationale**

The homepage should inspire without overwhelming visitors while encouraging deeper exploration.

**Impact**

Dedicated Traveller Stories page becomes the canonical discovery experience.

**Status**

Active

---

## DEC-002 — Homepage Trust Strip

**Category**

Product / UX

**Decision**

Introduce a Trust Strip directly below Traveller Stories.

Approved order:

1. Google Reviews
2. 45+ Destinations Served
3. 300+ Trips Completed
4. 800+ Happy Travellers

Only Google Reviews is interactive.

**Rationale**

Increase trust while keeping interaction focused.

**Impact**

Homepage credibility significantly improved.

**Status**

Active

---

## DEC-003 — Premium Trust Medallions

**Decision**

Replace generic line icons with premium bronze medallions.

Approved for Release 1.1.

**Rationale**

Improve perceived quality and better align with Search My Vacation branding.

**Status**

Active

---

## DEC-004 — Hero CTA Position

**Decision**

Increase spacing below the Hero CTA rather than repositioning individual elements.

**Rationale**

Correct the visual balance while preserving responsive layouts.

**Status**

Active

---

# Journey Passport

## DEC-005 — Travel Inspiration Mapping

Travel Inspiration should only pre-populate explicit traveller intent.

Never infer:

- destination
- Dream Journey
- departure timing

**Status**

Active

---

## DEC-006 — Nature Mapping

Nature-led journeys map to:

Travel Style → Nature

Never Wildlife Adventure.

**Status**

Active

---

## DEC-007 — Food & Culture

Food, Culture and Local Connection pre-populates:

- Food & Dining
- Culture & Heritage

Both remain independently editable.

**Status**

Active

---

## DEC-008 — Family Mapping

Meaningful Family Time pre-populates:

Companion → Family

No other companion assumptions are permitted.

**Status**

Active

---

## DEC-009 — Zero-Answer Entries

Feeling-led journeys and First International Journey retain source context while intentionally pre-populating nothing.

**Status**

Active

---

# Journey Director

## DEC-010 — Recommendation Philosophy

Journey Director recommends only destinations actively served by Search My Vacation.

No unsupported destinations are suggested.

**Status**

Active

---

## DEC-011 — Recommendation Categories

Maintain three recommendation tiers:

- Perfect Match
- Beautiful Puzzle
- Hidden Gem

**Status**

Active

---

# Traveller Stories

## DEC-012 — Homepage vs Dedicated Experience

Homepage provides curated previews.

Dedicated Traveller Stories page remains the primary storytelling experience.

**Status**

Active

---

## DEC-013 — Canonical Metadata

Traveller Stories are governed through structured metadata.

Presentation should not rely on file naming or directory structure.

**Status**

Active

---

# Contact & Footer

## DEC-014 — Social Links

Footer contains:

- Instagram
- Facebook
- YouTube

Icon-only treatment approved.

**Status**

Active

---

## DEC-015 — WhatsApp

WhatsApp opens in a new browser tab.

**Status**

Active

---

# Branding

## DEC-016 — Trust Strip Artwork

Premium medallion artwork approved for Release 1.1.

**Status**

Active

---

## DEC-017 — Terminology

Use:

"Trips"

"Experiences"

"Traveller"

Avoid legacy package-oriented language wherever appropriate.

**Status**

Active

---

# Release Management

## DEC-018 — Scope Freeze

After Release Candidate:

Only

- defects

- regressions

- release blockers

may enter Release 1.1.

Everything else moves to Release 1.2.

**Status**

Active

---

## DEC-019 — Validation Philosophy

Release readiness is based on:

- Functional quality
- Traveller experience
- Production readiness

not simply implementation completion.

**Status**

Active

---

## DEC-020 — AI Collaboration Model

Release 1.1 established the preferred collaboration model:

- ChatGPT for product strategy, UX, architecture, planning and release management.
- Claude for implementation, validation and engineering execution.

This workflow becomes the recommended operating model for subsequent releases unless explicitly revised.

**Status**

Active

---

# Final Assessment

Release 1.1 decisions consistently favoured:

- Traveller-first design
- Honest recommendations
- Explicit user control
- Simplicity over unnecessary automation
- Premium presentation
- Long-term maintainability

---

# Decision Governance

This Decision Log is a living document.

Future releases should:

- preserve historical decisions,
- supersede rather than delete previous decisions,
- reference earlier Decision IDs where appropriate,
- maintain a complete record of significant Product, UX, Architecture and Release decisions.

This ensures that future implementation work continues to reflect deliberate Product intent rather than relying on historical chat discussions.