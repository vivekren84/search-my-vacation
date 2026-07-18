# Design Tokens

---

## Document Information

| Field | Value |
|--------|-------|
| Product | Search My Vacation |
| Internal Project | Project Compass |
| Document | Design Tokens |
| Version | 1.0 |
| Status | Draft |
| Business Owner | Search My Vacation |
| Product Owner | Vicky |
| Technical Lead | Archie |
| Created | 16 Jul 2026 |
| Last Updated | 16 Jul 2026 |

---

# Purpose

The Design Tokens document defines the implementation-ready visual values used throughout Search My Vacation.

While documents such as COLOR-SYSTEM.md and TYPOGRAPHY.md describe design philosophy and user experience principles, this document provides the concrete values that developers implement within the application.

Design Tokens ensure visual consistency, simplify maintenance and establish a single source of truth for the design system.

---

# Related Documents

## Upstream

- BRAND-IDENTITY.md
- DESIGN-PRINCIPLES.md
- COLOR-SYSTEM.md
- TYPOGRAPHY.md

## Downstream

- COMPONENT-LIBRARY.md
- Tailwind Configuration
- CSS Variables
- Figma Design Files

---

# Token Philosophy

Design Tokens separate design decisions from implementation.

Developers should never hard-code colours, spacing, typography or other visual values directly into components.

Instead, all visual styling should reference reusable tokens defined within this document.

This approach improves consistency, scalability and future maintainability.

---

# Brand Colour Tokens

| Token | Value | Usage |
|--------|--------|-------|
| Color Primary | #0F4C81 | Brand, navigation, primary actions |
| Color Primary Hover | #0C3E68 | Hover state |
| Color Primary Active | #09304F | Active state |
| Color Accent | #F28C28 | Primary CTA, highlights |
| Color Accent Hover | #D97706 | Hover state |
| Color Accent Active | #B45309 | Active state |

---

# Neutral Colour Tokens

| Token | Value |
|--------|--------|
| White | #FFFFFF |
| Warm White | #FCFBF8 |
| Grey 50 | #F9FAFB |
| Grey 100 | #F3F4F6 |
| Grey 200 | #E5E7EB |
| Grey 400 | #9CA3AF |
| Grey 600 | #4B5563 |
| Grey 800 | #1F2937 |
| Grey 900 | #111827 |

---

# Semantic Tokens

| Token | Value |
|--------|--------|
| Success | #16A34A |
| Warning | #F59E0B |
| Error | #DC2626 |
| Information | #2563EB |

---

# Typography

## Primary Font

Plus Jakarta Sans

Fallback:

```
"Plus Jakarta Sans", system-ui, sans-serif
```

---

## Font Weight Tokens

| Token | Value |
|--------|--------|
| Regular | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |

---

## Typography Scale

| Token | Size |
|--------|------|
| Display XL | 64px |
| Display Large | 56px |
| Hero Heading | 48px |
| Page Heading | 40px |
| Section Heading | 32px |
| Card Heading | 24px |
| Body Large | 18px |
| Body | 16px |
| Body Small | 14px |
| Caption | 12px |

---

# Spacing Scale

| Token | Value |
|--------|--------|
| Space 1 | 4px |
| Space 2 | 8px |
| Space 3 | 12px |
| Space 4 | 16px |
| Space 5 | 20px |
| Space 6 | 24px |
| Space 8 | 32px |
| Space 10 | 40px |
| Space 12 | 48px |
| Space 16 | 64px |

---

# Border Radius

| Token | Value |
|--------|--------|
| Small | 4px |
| Medium | 8px |
| Large | 12px |
| Extra Large | 20px |
| Pill | 9999px |

---

# Shadows

| Token | Value |
|--------|--------|
| Small | 0 1px 3px rgba(0,0,0,0.08) |
| Medium | 0 4px 12px rgba(0,0,0,0.10) |
| Large | 0 12px 32px rgba(0,0,0,0.12) |

---

# Layout Breakpoints

| Token | Value |
|--------|--------|
| Mobile | 640px |
| Tablet | 768px |
| Laptop | 1024px |
| Desktop | 1280px |
| Wide | 1536px |

---

# Z-Index Scale

| Token | Value |
|--------|--------|
| Base | 0 |
| Dropdown | 100 |
| Sticky Header | 500 |
| Overlay | 900 |
| Modal | 1000 |
| Toast | 1100 |

---

# Motion Tokens

| Token | Value |
|--------|--------|
| Fast | 150ms |
| Normal | 250ms |
| Slow | 400ms |

---

# Animation Principles

- Motion should support usability.
- Animations should feel smooth and unobtrusive.
- Decorative animation should never delay user interaction.
- Motion should respect accessibility preferences where supported.

---

# Implementation Guidelines

Developers shall:

- Reference tokens instead of hard-coded values.
- Prefer CSS variables for reusable styling.
- Keep Tailwind configuration aligned with this document.
- Avoid introducing duplicate token names.

Any new visual value should first be added to this document before being used within production code.

---

# Future Evolution

As Search My Vacation evolves, new tokens may be introduced to support additional themes, components or platforms.

Existing tokens should remain stable wherever possible to preserve visual consistency and minimise implementation changes.