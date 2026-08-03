# Engineering Build Card (EBC) Execution Standard

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Active |
| Owner | Team Satvi |
| Applies From | Sprint 3 |
| Last Updated | July 2026 |
| Next Review | Release 1 Completion |

---

# EBC Execution Standard
**Version:** 1.0  
**Owner:** Team Satvi  
**Status:** Active  
**Last Updated:** July 2026

---

# Purpose

This document defines the standard execution process for all Engineering Build Cards (EBCs) within the Search My Vacation project.

Its purpose is to ensure every implementation is delivered with a consistent level of quality, engineering discipline, user experience, and release readiness.

Rather than repeatedly discovering common issues during reviews, every EBC should proactively validate known quality gates before submission.

This document serves as the operating standard for all future development work.

---

# Development Philosophy

The Search My Vacation website is being built as a premium digital experience.

We optimise for:

- Simplicity
- Maintainability
- Traveller Experience
- Engineering Quality
- Release Confidence

We deliberately avoid over-polishing individual features before the overall product reaches release readiness.

---

# Development Workflow

Every feature follows the same lifecycle.

```
Plan
↓

Build

↓

Stabilize

↓

Review

↓

Approve

↓

Release Readiness

↓

Final Polish

↓

Production
```

Our guiding principle is:

> **Build → Stabilize → Build → Stabilize → Release Readiness → Final Polish**

This prevents unnecessary redesign cycles while ensuring the product continuously improves.

---

# Standard EBC Structure

Every Engineering Build Card must contain the following sections.

## 1. Objective

Clearly describe the purpose of the feature.

---

## 2. Background

Provide context explaining why the work exists.

Reference previous EBCs if applicable.

---

## 3. Scope

Clearly define what is included.

Avoid ambiguity.

---

## 4. Constraints

Explicitly define what must NOT be changed.

This prevents scope creep.

Example:

- Do not modify Journey Passport.
- Do not redesign Hero.
- Desktop layout should remain unchanged.

---

## 5. Functional Requirements

List expected behaviour.

Focus on outcomes rather than implementation.

---

## 6. UX Expectations

Include Sophie's design guidance.

Describe the emotional experience expected from the implementation.

---

## 7. Traveller Review

Include Sri's perspective.

Every feature should answer:

> How would a real traveller experience this?

---

## 8. Architecture Review

Include Archie's engineering recommendations.

Focus on:

- maintainability
- reuse
- scalability
- simplicity

---

## 9. Acceptance Criteria

Clearly define what success looks like.

Acceptance criteria should be measurable.

---

# Mandatory Pre-Submission Validation

Before Work Mode marks any EBC complete, all applicable validations must be performed.

---

## Desktop Validation

Confirm:

- No overlapping elements
- No clipped text
- Consistent spacing
- Hero remains visually dominant
- Navigation functions correctly
- Buttons remain usable

---

## Mobile Validation

Confirm:

- No overlapping elements
- No clipped headings
- No clipped buttons
- No horizontal scrolling
- Menu works correctly
- Content remains readable
- Touch targets remain usable

Do NOT optimise for pixel perfection.

Ensure stability and usability.

---

## Tablet Validation

Confirm:

- Balanced spacing
- Responsive layout
- Navigation behaves correctly
- Images scale appropriately

---

## Technical Validation

Run:

- TypeScript
- Lint
- Production Build

All must pass unless pre-existing issues are documented.

---

## Regression Validation

Confirm:

- Existing completed features remain unchanged.
- No unrelated files were modified.
- Existing functionality continues to operate correctly.

---

# Responsive Design Philosophy

Responsive support is mandatory.

However, responsive perfection is intentionally deferred.

During feature implementation we validate:

- Stability
- Readability
- Usability

We do NOT spend engineering time optimising:

- exact spacing
- image cropping
- typography tuning
- animation timing
- micro-interactions

Those belong to the final Responsive Polish sprint.

---

# Deferred Polish

Every EBC should explicitly identify work intentionally postponed.

Example:

- Typography refinement
- Image optimisation
- Animation improvements
- Responsive fine tuning
- Visual consistency adjustments

Listing deferred work prevents unnecessary implementation during active development.

---

# Deliverables

Every completed EBC should provide:

- Summary of work completed
- Root cause analysis (when applicable)
- Files modified
- Validation results
- Build status
- Remaining observations
- Known limitations (if any)

---

# Stop Conditions

Once the acceptance criteria have been satisfied:

STOP.

Do not:

- improve unrelated areas
- redesign adjacent components
- introduce additional enhancements
- optimise future work items

Engineering effort should remain strictly within the approved scope.

---

# Review Process

Every completed EBC follows the same review sequence.

```
Work Mode
↓

Tiger
Engineering Validation

↓

Archie
Architecture Validation

↓

Sophie
UX Validation

↓

Sri
Traveller Experience Validation

↓

Product Owner Approval

↓

Git Commit

↓

Next Sprint
```

No feature progresses until this review sequence is complete.

---

# Engineering Principles

Every implementation should strive to be:

- Simple before clever
- Maintainable before complex
- Consistent before unique
- Scalable before duplicated

When multiple valid solutions exist, choose the one that future developers will understand most easily.

---

# UX Principles

Every interaction should feel:

- Warm
- Premium
- Calm
- Human
- Intentional

Avoid interfaces that feel transactional or form-driven.

Search My Vacation designs journeys—not booking forms.

---

# Quality Gates

A feature is considered "Stable" when:

- No blocking defects remain.
- No overlapping UI exists.
- Navigation works.
- Forms function correctly.
- Responsive layouts remain usable.
- Build succeeds.
- Regression tests pass.

Only stable features move into the next sprint.

---

# Release Readiness

Near the end of MVP development, the project enters Release Readiness.

During this phase we perform:

- Responsive polish
- Typography refinement
- Animation polish
- Image optimisation
- Accessibility review
- Performance tuning
- Cross-browser testing
- Device validation
- Final content review

Only after Release Readiness is complete does the project enter Production.

---

# Team Satvi Commitment

We build thoughtfully.

We stabilise continuously.

We polish intentionally.

We release confidently.

Every decision should improve the traveller's experience without sacrificing engineering quality.

---

*"Great products are not built by perfecting every screen immediately. They are built by consistently delivering stable improvements, learning from each iteration, and polishing at the right time."*

— Team Satvi Engineering Standard