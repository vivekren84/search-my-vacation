# Development Documentation

## Purpose

This section contains the technical implementation documentation for the Search My Vacation project.

It records how features are designed, developed, verified and maintained throughout the lifecycle of the application.

Unlike the Project Compass, which explains **why** decisions were made, this section explains **how** they were implemented.

---

# Objectives

The Development Documentation serves to:

- Record implementation decisions.
- Document significant engineering milestones.
- Maintain a history of feature development.
- Provide implementation references for future contributors.
- Complement the project's Git history.

---

# Folder Structure

```text
09-Development/
│
├── README.md
│
├── Homepage/
│   └── Hero-Canvas.md
│
├── Release-1.2/
│   └── WS3/
│       └── (Workstream 3 implementation evidence)
│
└── (individual EBC/DEC/GATE-numbered documents, organised by ID rather than
    a fixed feature subfolder — see "Relationship with Other Documentation"
    below for how this folder relates to release-scoped governance folders
    introduced during Release 1.2, e.g. 20-Architecture, 30-Governance,
    40-Retrospectives, 50-Operations)
```

The structure may evolve as the project grows, but documentation should always remain organised by feature rather than by sprint.

---

# Documentation Standards

Each implementation document should contain the following sections.

## 1. Objective

Describe the purpose of the feature or milestone.

---

## 2. Background

Explain why the implementation was required.

Reference related documentation whenever appropriate.

Examples:

- Product Documentation
- UX Documentation
- Design Mockups
- Architecture Decisions
- ADRs

---

## 3. Design Intent

Describe the intended user experience.

Focus on the traveller's experience rather than only the technical implementation.

---

## 4. Technical Implementation

Document:

- Components created
- Components modified
- Components removed
- Architectural decisions
- Important implementation notes

---

## 5. Files Modified

List every file modified during the implementation.

Example:

```text
app/layout.tsx
app/page.tsx
components/layout/Header.tsx
components/sections/Hero/Hero.tsx
components/sections/Hero/HeroImage.tsx
```

---

## 6. Verification Checklist

Each implementation should include a verification checklist.

Example:

- [ ] Project builds successfully.
- [ ] No TypeScript errors.
- [ ] No ESLint warnings.
- [ ] Responsive layout verified.
- [ ] Accessibility reviewed.
- [ ] Visual validation completed.

---

## 7. Git Commit

Record the Git commit message associated with the implementation.

Example:

```text
feat(hero): implement Hero Canvas
```

---

## 8. Future Improvements

Capture ideas intentionally deferred to future milestones.

This helps preserve ideas without expanding the scope of the current implementation.

---

# Documentation Principles

Development documentation should:

- Explain implementation decisions.
- Remain concise and maintainable.
- Reflect the codebase accurately.
- Stay synchronized with Git history.
- Avoid documenting abandoned experiments.
- Be updated whenever a significant implementation milestone is completed.

---

# Relationship with Other Documentation

| Folder | Purpose |
|---------|---------|
| 00-Project-Compass | Vision, standards and governance |
| 01-Vision-Business | Business strategy |
| 02-Product | Product requirements |
| 03-ADR | Architectural Decision Record register (pre-Release 1.2 baseline — see its own note on the current approach) |
| 04-UX | User experience documentation |
| 07-Design | Visual design and prototypes |
| **09-Development** | Technical implementation documentation |
| 10-Backlog | Release trackers, backlogs and future enhancements |
| 11-Sprints | Sprint planning and execution history |
| 14-Legal | Privacy policy, terms and conditions |
| 15-AI-Operating-Model | Team Satvi persona and delivery-model documentation |
| 16-Brand-Assets | Brand imagery and social-cover assets |
| 20-Architecture | Release-scoped Architecture Decision Records (currently Release 1.2's) |
| 30-Governance | Standing governance and operational definitions (provider register, integration definition of done) |
| 40-Retrospectives | Release retrospectives and lessons learned |
| 50-Operations | Operational runbooks |

This table lists folders that currently exist under `docs/`. Some folder numbers were reserved in an earlier version of this taxonomy (05, 06, 08, 12, 13) but no corresponding folder has been created; they are omitted above rather than left as broken references, and may be introduced later if the corresponding documentation category becomes needed.

---

# Philosophy

Good software is more than well-written code.

It is the combination of thoughtful architecture, consistent engineering practices, clear documentation, and continuous improvement.

This documentation preserves not only the implementation itself, but also the engineering decisions that shaped the evolution of Search My Vacation.
