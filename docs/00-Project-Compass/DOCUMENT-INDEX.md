# Search My Vacation — Canonical Document Index

**Status:** Living index

**Owner:** Search My Vacation — Product & Experience

**Last updated:** 22 July 2026

This index identifies the canonical repository location for the specifications that govern the current Search My Vacation product and EBC delivery workflow. Files outside these paths are not authoritative unless a later approved decision explicitly replaces them.

## Project Compass

| Document | Canonical path | Purpose |
| --- | --- | --- |
| Project Compass | `docs/00-Project-Compass/COMPASS.md` | Project direction and operating context |
| Decision Log | `docs/00-Project-Compass/DECISION-LOG.md` | Approved product, design and architecture decisions |
| Glossary | `docs/00-Project-Compass/GLOSSARY.md` | Shared terminology |
| Project Standards | `docs/00-Project-Compass/PROJECT-STANDARDS.md` | Repository and documentation standards |

## Vision and Business

| Document | Canonical path | Purpose |
| --- | --- | --- |
| Vision | `docs/01-Vision-Business/VISION.md` | Business vision |
| Values | `docs/01-Vision-Business/VALUES.md` | Brand and organisational values |
| Traveller Profiles | `docs/01-Vision-Business/TRAVELLER-PROFILES.md` | Audience context |

## Product

| Document | Canonical path | Purpose |
| --- | --- | --- |
| Product Vision | `docs/02-Product/PRODUCT-VISION.md` | Traveller-first product promise |
| Product Roadmap | `docs/02-Product/PRODUCT-ROADMAP.md` | Product sequencing and milestones |
| Feature Inventory | `docs/02-Product/FEATURE-INVENTORY.md` | Feature scope and status inventory |
| Software Requirements Specification | `docs/02-Product/SRS.md` | System-level product requirements |
| Information Architecture | `docs/02-Product/INFORMATION-ARCHITECTURE.md` | Product content and navigation structure |
| Traveller Intent Framework | `docs/02-Product/TRAVELLER-INTENT-FRAMEWORK.md` | Traveller intent foundations |
| Travel Journeys | `docs/02-Product/TRAVEL-JOURNEYS.md` | End-to-end journey model |
| Journey Passport v1.0 | `docs/02-Product/JOURNEY-PASSPORT-v1.0.md` | Traveller discovery inputs and experience boundaries |
| Destination Knowledge Base | `docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md` | Active portfolio, controlled vocabulary and region intelligence |
| Journey Director Decision Engine | `docs/02-Product/JOURNEY-DIRECTOR-DECISION-ENGINE.md` | Deterministic Release 1 matching and recommendation rules |

## UX and Design

| Document | Canonical path | Purpose |
| --- | --- | --- |
| Homepage Information Architecture | `docs/04-UX/HOMEPAGE-INFORMATION-ARCHITECTURE.md` | Homepage experience architecture |
| Homepage Blueprint | `docs/07-Design/BLUEPRINTS/HOMEPAGE-BLUEPRINT.md` | Homepage layout blueprint |
| Journey Invitations Design Language | `docs/04-UX/JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md` | Invitation language and interaction model |
| Journey Director Experience | `docs/04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md` | Post-Passport recommendation UX |
| Brand Identity | `docs/07-Design/BRAND-IDENTITY.md` | Brand expression |
| Design Principles | `docs/07-Design/DESIGN-PRINCIPLES.md` | Experience-wide design standards |
| Design Tokens | `docs/04-UX/DESIGN-TOKENS.md` | Shared design values |
| Colour System | `docs/04-UX/COLOR-SYSTEM.md` | Approved colour usage |
| Typography | `docs/04-UX/TYPOGRAPHY.md` | Type hierarchy and responsive typography |
| Imagery Guidelines | `docs/04-UX/IMAGERY-GUIDELINES.md` | Image selection and treatment |
| Iconography | `docs/04-UX/ICONOGRAPHY.md` | Icon usage |
| UI Components | `docs/04-UX/UI-COMPONENTS.md` | Shared component guidance |

## Architecture and Delivery

| Document | Canonical path | Purpose |
| --- | --- | --- |
| Architecture Decision Record Template | `docs/03-ADR/ADR-000.md` | ADR structure |
| Architecture Decisions | `docs/03-ADR/DECISIONS.md` | Architecture decision register |
| EBC Execution Standard | `docs/09-Development/EBC-EXECUTION-STANDARD.md` | Mandatory build-card execution and validation standard |
| EBC-002 — Journey Passport | `docs/09-Development/EBC-002-JOURNEY-PASSPORT.md` | Journey Passport implementation contract |
| Development Guide | `docs/09-Development/README.md` | Engineering documentation conventions |

## Journey Director Release 1 Architecture

```text
Journey Passport
        ↓
Destination Knowledge Base
        ↓
Journey Director Decision Engine
        ↓
Journey Director Experience
        ↓
Human Journey Director consultation, refinement,
itinerary design and final traveller handoff
```

Release 1 uses deterministic recommendation logic to generate **The Perfect Match**, **A Different Rhythm** and **A Pleasant Surprise**. The same selected possibility must drive the downstream narrative, imagery, fit reasons, journey experiences and handoff copy while the reusable layout remains unchanged.

## Index Governance

- Add a document when it becomes an approved or active canonical specification.
- Update a path in the same change that moves or renames its document.
- Record superseded documents explicitly rather than allowing multiple files to appear authoritative.
- Do not reference generated workspaces, temporary worktrees or machine-specific absolute paths.
- EBC-003 should be added only when its implementation card is approved and committed to `docs/09-Development/`.
