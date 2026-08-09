# Search My Vacation Engineering Handbook

| Metadata | Value |
| --- | --- |
| **Document ID** | AIOM-002 |
| **Document Title** | SMV Engineering Handbook |
| **Version** | 1.0 |
| **Status** | Approved |
| **Owner** | Search My Vacation |
| **Operational Custodian** | Team Satvi |
| **Approved By** | Vivek — Business Owner and Product Manager |
| **Effective Date** | 2026-08-09 |
| **Last Updated** | 2026-08-09 |
| **Classification** | Internal |
| **Purpose** | Define the repository-wide engineering baseline for building, validating, documenting, and releasing Search My Vacation safely and consistently. |
| **Related Documents** | [AI Operating Model Overview](./README.md); [Team Satvi Operating Model](./TEAM-SATVI.md) |

> **Audience:** Team Satvi, engineers, reviewers, AI coding assistants, product and experience contributors, and future maintainers of Search My Vacation.

## Revision history

| Version | Date | Summary |
| --- | --- | --- |
| 1.0 | 2026-08-09 | Initial approved engineering handbook covering repository context, workflow, implementation standards, product guardrails, verification, and release readiness. |

---

## Table of contents

1. [Purpose](#1-purpose)
2. [Repository overview](#2-repository-overview)
3. [Technology stack](#3-technology-stack)
4. [Repository structure](#4-repository-structure)
5. [Team Satvi engineering model](#5-team-satvi-engineering-model)
6. [Engineering workflow](#6-engineering-workflow)
7. [Git workflow](#7-git-workflow)
8. [Coding standards](#8-coding-standards)
9. [Architecture principles](#9-architecture-principles)
10. [Journey Passport engineering guardrails](#10-journey-passport-engineering-guardrails)
11. [Journey Director engineering guardrails](#11-journey-director-engineering-guardrails)
12. [Brand implementation guardrails](#12-brand-implementation-guardrails)
13. [Testing and validation standards](#13-testing-and-validation-standards)
14. [Documentation standards](#14-documentation-standards)
15. [Definition of done](#15-definition-of-done)
16. [Common commands](#16-common-commands)
17. [Canonical references](#17-canonical-references)
18. [Persona manuals, playbooks, and templates](#18-persona-manuals-playbooks-and-templates)
19. [Handbook governance](#19-handbook-governance)

---

## 1. Purpose

This handbook defines how engineering work is performed in the Search My Vacation repository. It turns the project's approved product, experience, architecture, brand, delivery, and governance sources into a practical engineering baseline.

It exists to help contributors:

- understand the repository before changing it;
- identify the authoritative source for a decision;
- preserve the traveller experience while implementing features;
- build secure, accessible, maintainable software;
- validate changes with evidence proportionate to risk;
- keep code, generated artefacts, database changes, and documentation aligned; and
- present clear readiness information to the people who own the decision.

This handbook complements the Project Instructions and Team Satvi operating model. It does not restate every instruction, persona manual, product rule, design rule, or playbook.

### 1.1 Scope

This handbook applies to:

- application code under `web/`;
- Supabase schema changes under `supabase/`;
- governed generators and generated runtime artefacts;
- repository documentation and Engineering Build Cards (EBCs);
- validation, release-readiness, and operational evidence; and
- human and AI-assisted engineering contributions.

### 1.2 Instruction and source precedence

When guidance overlaps, use the following order:

1. The explicit, current instruction from Vivek for the active work.
2. Applicable repository or directory-specific Project Instructions, including `AGENTS.md` and tool/runtime instructions.
3. Approved product specifications, decision records, legal requirements, and release decisions.
4. This engineering handbook.
5. Team Satvi persona manuals, playbooks, standards, and templates.
6. Local conventions inferred from nearby code.

An instruction with narrower scope governs within that scope. A later approved decision supersedes an earlier conflicting decision. Do not silently choose between conflicting authoritative sources: stop, make the conflict explicit, and obtain or record the resolution.

### 1.3 How to use this handbook

- Start here for repository-wide engineering expectations.
- Follow links to the canonical specification for detailed product or experience behaviour.
- Use persona manuals for specialist reasoning and accountability.
- Use playbooks and templates for repeatable execution and evidence.
- Update the authoritative source when a rule changes; avoid copying the same rule into several files.

---

## 2. Repository overview

Search My Vacation is a traveller-first travel relationship platform. Its promise is to understand the traveller before proposing a journey and to combine governed technology with human travel expertise.

The repository currently contains:

- business, product, experience, design, legal, architecture, and delivery documentation;
- a Next.js web application;
- Journey Passport traveller-discovery experiences;
- deterministic Journey Director recommendation logic;
- governed destination, journey-intelligence, and itinerary data pipelines;
- Journey Passport lead and callback services;
- Supabase/PostgreSQL migrations; and
- verification and release evidence.

Engineering success is not measured only by whether a page renders or a build passes. A change succeeds when it satisfies the agreed outcome, remains true to the product and brand, protects traveller trust, is technically sound, and is supported by reproducible evidence.

---

## 3. Technology stack

The implementation baseline must be confirmed from the repository before work begins. At Version 1.0, the principal stack is:

| Layer | Technology / convention | Engineering expectation |
| --- | --- | --- |
| Web framework | Next.js 16, App Router | Read the installed Next.js guidance under `web/node_modules/next/dist/docs/` before relying on remembered APIs or conventions. |
| UI | React 19 | Prefer server components; add `"use client"` only when browser state, effects, events, or client-only APIs require it. |
| Language | TypeScript 5 with strict mode | Preserve type safety; avoid unvalidated casts and do not use `any` to bypass design problems. |
| Styling | Tailwind CSS 4, CSS Modules, and governed global styles | Reuse approved tokens, layout primitives, and components before introducing new visual values or patterns. |
| Data and persistence | Supabase and PostgreSQL | Use additive, reviewed migrations; apply least privilege and Row Level Security where applicable. |
| Hosting | Vercel | Keep server/client boundaries and environment-variable exposure compatible with the deployment model. |
| Notifications | Server-side email integration | Keep provider keys and recipient configuration on the server; degrade safely when notification configuration is unavailable. |
| Validation | ESLint, TypeScript compilation, production build, and domain-specific verification scripts | Run the smallest sufficient set during development and the full relevant set before readiness is claimed. |
| Package management | npm with `package-lock.json` | Use reproducible installs and commit intentional lockfile changes with dependency changes. |

Versions in this table describe the Version 1.0 repository, not permanent constraints. `web/package.json`, the lockfile, configuration files, and approved architecture decisions are authoritative for the installed implementation.

---

## 4. Repository structure

```text
SearchMyVacation/
├── README.md                         # Repository orientation
├── docs/                             # Canonical product and delivery knowledge
│   ├── 00-Project-Compass/           # Direction, decisions, glossary, index, standards
│   ├── 01-Vision-Business/           # Vision, values, promises, traveller context
│   ├── 02-Product/                   # Requirements and product specifications
│   ├── 03-ADR/                       # Architecture decisions
│   ├── 04-UX/                        # UX specifications and design-system guidance
│   ├── 07-Design/                    # Approved brand and design principles
│   ├── 09-Development/               # EBCs, implementation and validation records
│   ├── 10-Backlog/                   # Deferred and future work
│   ├── 11-Sprints/                   # Sprint records
│   ├── 14-Legal/                     # Approved legal content
│   └── 15-AI-Operating-Model/        # Team Satvi operating model and this handbook
├── outputs/                          # Governed reports and evidence artefacts
├── supabase/
│   └── migrations/                   # Ordered PostgreSQL/Supabase migrations
└── web/
    ├── app/                           # App Router pages, layouts, manifests, and API routes
    ├── components/                    # Reusable UI and feature components
    ├── config/                        # Governed presentation and product configuration
    ├── context/                       # React context for shared client state
    ├── generated/                     # Generated, versioned runtime intelligence artefacts
    ├── hooks/                         # Reusable React hooks
    ├── lib/                           # Domain logic, services, repositories, and validation
    ├── public/                        # Public static assets
    ├── scripts/                       # Deterministic generators and verification utilities
    └── types/                         # Shared domain contracts
```

### 4.1 Placement rules

- Put product intent in `docs/02-Product/`, not in a component comment.
- Put durable architecture decisions in `docs/03-ADR/`.
- Put implementation records and EBC evidence in `docs/09-Development/`.
- Put reusable UI in `web/components/`; organise feature-specific components by domain.
- Put business and domain logic in `web/lib/`, outside visual components where practical.
- Put public configuration in `web/config/`; never place secrets there.
- Treat `web/generated/` as generator-owned. Change its sources or generator and regenerate; do not hand-edit outputs.
- Keep database history additive in `supabase/migrations/`. Do not rewrite an applied migration.
- Do not edit dependency or build output directories such as `node_modules/` or `.next/`.
- Do not commit local secrets, `.env.local`, machine-specific paths, or temporary workspaces.

---

## 5. Team Satvi engineering model

Team Satvi is the multidisciplinary delivery model for SMV. One accountable lead coordinates each work item; specialists contribute where their judgement changes the outcome.

| Role | Engineering accountability |
| --- | --- |
| Tiger — Programme and Delivery Lead | Orchestration, dependencies, sequencing, readiness, risk, and escalation. |
| Arjun — Product and Business Analyst | Problem framing, scope, requirements, acceptance criteria, and traceability. |
| Archie — Technical Architect | Architecture, interfaces, data flow, security boundaries, scalability, and material trade-offs. |
| Sophie — UX, UI and Frontend Experience Specialist | Interaction, hierarchy, responsive behaviour, accessibility, content presentation, and visual consistency. |
| Rad — Engineering and Implementation Specialist | Implementation quality, maintainability, technical tests, observability, and engineering documentation. |
| Keerthi — Functional Validation Specialist | Independent functional verification, edge cases, regression coverage, and reproducible findings. |
| Sri — Traveller Experience Reviewer | End-to-end clarity, usefulness, trust, emotional friction, and journey coherence. |
| Vivek — Business Owner and Product Manager | Product direction, priority, material scope, risk acceptance, release approval, and final authority. |

No specialist or AI assistant may approve a material product trade-off, accept significant residual risk, or authorise a release on Vivek's behalf. Recommendations must state evidence, assumptions, trade-offs, risk, and the decision required.

Use the smallest specialist group that can complete the work safely. Involve Archie for architectural or security changes; Sophie and Sri for traveller-facing changes; Keerthi for functional validation; and Tiger when dependencies, ownership, sequencing, or readiness cross boundaries.

See [Team Satvi operating model](./README.md) and the [persona manuals](#18-persona-manuals-playbooks-and-templates).

---

## 6. Engineering workflow

### 6.1 Intake and baseline

Before changing code:

1. Restate the traveller or business outcome.
2. Identify the acceptance criteria, in-scope and out-of-scope behaviour, affected journeys, and risk.
3. Read applicable Project Instructions and canonical specifications.
4. Inspect the current implementation, configuration, tests, generated artefacts, migrations, and relevant Git state.
5. Record assumptions and unresolved questions; resolve any that could materially change the solution.
6. Select proportionate validation and evidence before implementation begins.

### 6.2 Design and prerequisites

A change is ready for implementation when, in proportion to its risk:

- the problem and intended outcome are clear;
- scope and constraints are explicit;
- acceptance criteria are testable;
- dependencies and data contracts are understood;
- important empty, loading, success, error, recovery, and responsive states are designed;
- privacy, security, accessibility, and operational impacts are assessed;
- architecture or API changes are recorded where required; and
- the validation approach can demonstrate correctness.

Do not use implementation to conceal an unresolved product decision.

### 6.3 Implementation

- Make the smallest coherent change that satisfies the approved outcome.
- Preserve unrelated user work and keep scope boundaries visible.
- Follow existing domain boundaries and naming unless an approved refactor changes them.
- Keep product rules deterministic and traceable where the product specification requires it.
- Add or update validation with the behaviour, not after it.
- Update documentation and generated artefacts in the same change when their source changes.
- Avoid speculative abstractions and opportunistic rewrites unrelated to the work.

### 6.4 Self-review and validation

The implementer must review the final diff and run relevant checks before handoff. Validation must cover the intended outcome, regression surface, important failure paths, accessibility where applicable, and any domain invariants.

Implementation evidence from Rad is not independent validation. Keerthi assesses functional correctness; Sophie and Sri assess experience quality when applicable; Archie assesses material architecture and security decisions.

### 6.5 Readiness and approval

A readiness recommendation must include:

- delivered scope and explicit exclusions;
- changed files or systems;
- commands and scenarios verified, with results;
- screenshots, logs, reports, or other evidence where useful;
- known limitations and residual risks;
- rollback or recovery considerations when material;
- documentation and migration status; and
- the decision required and its owner.

Vivek makes the final release decision. A green build is evidence, not release approval.

---

## 7. Git workflow

The detailed branch and integration process belongs in the planned `playbooks/Git-Workflow.md` playbook. Until that playbook is published, use this baseline:

1. Inspect the working tree before editing and preserve unrelated changes.
2. Start from the approved base branch and use a short-lived branch for scoped work unless Vivek has authorised another workflow.
3. Keep commits intentional, reviewable, and limited to one coherent concern.
4. Use descriptive conventional-style subjects where practical, for example `feat(journey-passport): add callback preference`, `fix(journey-director): preserve selected region`, or `docs(ai-model): add engineering handbook`.
5. Do not commit secrets, local environments, build output, dependency directories, or accidental generated files.
6. Review the staged diff before committing. Confirm generated and lockfile changes are intentional.
7. Do not rewrite shared history, force-push, bypass required checks, or push directly to a protected branch without explicit authority.
8. Use pull-request or review evidence appropriate to risk. Link the EBC, issue, specification, decision, and validation report where they exist.
9. Resolve feedback in the code and source documentation; do not leave contradictory guidance in review comments alone.
10. After integration, ensure the branch, documentation, and deployment evidence identify what actually shipped.

Never discard, overwrite, or reformat unrelated working-tree changes merely to obtain a clean status.

---

## 8. Coding standards

### 8.1 General principles

- Optimise for clarity, correctness, and maintainability before cleverness.
- Use names that express product meaning, not implementation accidents.
- Keep functions and modules focused; make side effects and dependencies explicit.
- Prefer pure, deterministic domain functions for scoring, selection, normalisation, and validation.
- Remove dead code only when ownership and scope are clear.
- Comment why a non-obvious constraint exists; let types and code explain what happens.
- Do not suppress lint or type errors without a documented, narrow reason.

### 8.2 TypeScript and React

- Preserve `strict` TypeScript compatibility.
- Use shared domain types at boundaries and validate untrusted runtime input before treating it as typed.
- Prefer immutable inputs and readonly collections for governed catalogues and rules.
- Prefer server components and server-only services by default.
- Keep client components as small as the interactive boundary permits.
- Never expose server secrets through `NEXT_PUBLIC_` variables or client bundles.
- Use the `@/` alias for stable application imports and nearby relative imports for tightly coupled local modules.
- Keep hook invocation unconditional and effects narrowly scoped with cleanup for timers and event listeners.
- Preserve focus, keyboard, reduced-motion, and announcement behaviour during interaction changes.

### 8.3 Components and styling

- Reuse layout primitives, brand components, and design tokens before creating new variants.
- Keep semantic HTML and accessible names primary; use ARIA to clarify behaviour, not replace native semantics.
- Design mobile-first and verify at meaningful content-driven breakpoints.
- Account for loading, empty, error, disabled, success, long-content, and reduced-motion states.
- Avoid hard-coded brand colours, typography, and spacing when an approved token or existing abstraction applies.
- Place substantial feature styling with the owning component or governed global system; do not create competing style systems.

### 8.4 APIs, services, and data

- Treat every request body, query string, header, generated file, spreadsheet, and external response as untrusted input.
- Validate shape, length, allowed values, and semantic constraints at the boundary.
- Apply request-size limits, rate limits, safe error responses, and no-store behaviour where sensitive data or mutations are involved.
- Keep storage, notification, and other provider concerns behind repository or service interfaces.
- Make retry and idempotency behaviour explicit for writes and notifications.
- Log operationally useful codes and masked identifiers; do not log mobile numbers, secrets, full Passport payloads, or unnecessary personal data.
- Return warm, actionable traveller-facing errors without leaking implementation or provider details.

### 8.5 Database changes

- Use timestamped, additive migrations.
- Preserve applied migration history; correct with a new migration.
- Use constraints to protect invariants close to the data.
- Enable and verify Row Level Security and grants for sensitive tables.
- Follow least privilege; service-role access stays server-side.
- Assess rollback, backfill, compatibility, and existing-data impact before release.
- Never run a destructive production operation without an explicit plan, backup/recovery path, and approval.

### 8.6 Dependencies and generated artefacts

- Add dependencies only when their value exceeds maintenance, security, performance, and bundle costs.
- Prefer the platform, current stack, and existing utilities for small needs.
- Pin and review intentional dependency and lockfile changes.
- Keep generators deterministic. The same governed inputs and generator version must produce the same artefacts.
- Validate manifests, schemas, source versions, checksums, and cross-file references where the pipeline provides them.
- Never hand-edit generator-owned runtime artefacts.

---

## 9. Architecture principles

### 9.1 Traveller outcome before technical convenience

Architecture must protect the intended traveller relationship. Technical shortcuts must not make the experience feel generic, extractive, misleading, or transactional.

### 9.2 One authoritative source per decision

Product rules belong in approved product specifications; architecture decisions in ADRs; runtime configuration in governed configuration or generated artefacts; implementation behaviour in code. Link across sources rather than cloning rules that can drift.

### 9.3 Separate experience, domain, and infrastructure

- UI components render state and gather intent.
- Domain modules normalise, validate, decide, score, rank, and explain.
- Services orchestrate use cases.
- Repositories and adapters isolate storage, notification, and external systems.
- API routes authenticate or rate-limit as appropriate, validate input, invoke services, and translate outcomes into safe responses.

Do not embed core Journey Director ranking rules in JSX or couple product decisions directly to a provider SDK.

### 9.4 Deterministic and explainable by design

Release 1 recommendation behaviour must remain deterministic, versioned, reproducible, and auditable. Preserve the evidence needed to explain eligibility, exclusions, scoring, ranking, personality assignment, uncertainty, and the selected possibility.

### 9.5 Safe evolution

- Prefer backwards-compatible contracts and additive database change.
- Version schemas, rules, knowledge sources, and generated artefacts that affect decisions.
- Fail safely when inputs or governed data are missing, stale, inconsistent, or unsupported.
- Preserve a human review or recovery path for uncertain or high-impact outcomes.

### 9.6 Security and privacy by design

Minimise collected personal data, restrict access, protect secrets, validate boundaries, limit abuse, mask identifiers, and document retention or operational needs. Privacy is part of the product promise, not a deployment afterthought.

### 9.7 Proportionate architecture records

Create or update an ADR when a change introduces or materially alters a system boundary, dependency, persistent data model, security model, integration, deployment model, or hard-to-reverse technical direction. Use the [ADR template](../03-ADR/ADR-000.md) and update the architecture decision register when applicable.

---

## 10. Journey Passport engineering guardrails

The [Journey Passport specification](../02-Product/JOURNEY-PASSPORT-v1.0.md) is authoritative. Engineering must preserve these guardrails:

1. **It is the first conversation, not a booking form.** Do not pull itinerary logistics, price capture, room configuration, or inventory selection into discovery without approved product change.
2. **Understanding precedes recommendation.** Each question must improve traveller understanding and have a clear reason to exist.
3. **The sequence carries meaning.** Preserve the approved progression from welcome and personal context through companions, desired memories, pace and timing, destination intent, and discovery completion.
4. **Language must feel human.** Use warm, calm, reassuring copy; avoid system labels, sales pressure, jargon, and generic form language.
5. **Data collection is minimal and transparent.** Collect only approved fields, explain personal-data use, and keep contact details protected.
6. **Validation supports recovery.** Keep entered information, focus the problem, explain what is needed, and avoid blaming the traveller.
7. **State changes are deliberate.** Draft, resume, completion, Passport reference, contact connection, and Journey Director handoff must remain coherent and testable.
8. **Entry context remains traceable.** Destination, experience, inspiration, mood, and direct-entry context may guide preselection but must not silently override traveller choices.
9. **Accessibility is part of the journey.** Preserve heading focus, keyboard control, labels, error announcements, touch targets, reduced motion, and responsive readability.
10. **Downstream contracts remain compatible.** A Passport schema or normalisation change must be traced through snapshots, recommendation logic, storage, generated intelligence, validation profiles, and migrations.
11. **A human Journey Director remains in the relationship.** Automation supports discovery and continuity; it does not remove the consultation, refinement, itinerary design, or final handoff role.

Any material change to questions, sequence, meaning, data use, completion, or handoff requires product and experience review before implementation is considered ready.

---

## 11. Journey Director engineering guardrails

The [Journey Director Decision Engine](../02-Product/JOURNEY-DIRECTOR-DECISION-ENGINE.md), [Destination Knowledge Base](../02-Product/DESTINATION-KNOWLEDGE-BASE.md), [Journey Synopsis and Reference Contract](../02-Product/JOURNEY-SYNOPSIS-AND-REFERENCE-CONTRACT-v1.0.md), and [Journey Director Experience](../04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md) are authoritative.

1. **The Journey Director is a discovery engine, not a selling engine.** Commercial preference must not silently influence eligibility or ranking.
2. **Release 1 is deterministic.** Governed inputs, catalogue, rules, and versions must reproduce the same decision and trace.
3. **Eligibility precedes scoring.** Inactive, unsupported, stale, unsuitable, or operationally unavailable candidates must not be promoted through a high score.
4. **Recommendations come from deliverable knowledge.** Never invent a destination, region, stay area, claim, experience, or operational capability.
5. **Present a thoughtful set, not a manufactured winner.** Preserve the governed roles of The Perfect Match, The Beautiful Puzzle, and The Hidden Gem.
6. **Reasons must be evidence-backed.** Traveller-facing fit reasons must trace to Passport signals and governed destination intelligence.
7. **The selected possibility is one coherent reference.** Its destination, region, narrative, imagery, fit reasons, experiences, itinerary content, and handoff copy must not drift across screens.
8. **Uncertainty stays visible.** Missing, contradictory, or low-confidence information must trigger governed fallback, trade-off, or review behaviour—not fabricated certainty.
9. **Decision metadata is retained.** Preserve relevant Passport schema, knowledge-base, engine, rules, operational snapshot, generator, and artefact versions.
10. **Generated intelligence is governed.** Validate sources, schemas, compatibility, referential integrity, uniqueness, checksums, and determinism before committing regenerated artefacts.
11. **Human review remains available.** The system may shortlist and explain; a human Journey Director remains responsible for consultation, refinement, itinerary design, and the final traveller handoff.
12. **Future AI remains bounded.** Do not introduce autonomous, unreviewed recommendation behaviour that bypasses deterministic safeguards or invents unsupported facts.

Changes to normalisation, eligibility, contradiction evaluation, scoring, ranking, selection, personality assignment, explanation, catalogue mappings, or generated intelligence require targeted domain verification and representative scenario coverage.

---

## 12. Brand implementation guardrails

The [Brand Identity](../07-Design/BRAND-IDENTITY.md), [Design Principles](../07-Design/DESIGN-PRINCIPLES.md), and UX system documents are authoritative.

- Build a premium, warm, calm, trustworthy, knowledgeable, and approachable experience.
- Preserve the external motto: **“More Than a Trip. It's an Experience.”**
- Preserve the traveller-first principle: every traveller is unique and every journey should feel personal.
- Do not present SMV as a commodity booking engine or imitate an OTA inventory grid without an approved product decision.
- Use approved brand marks, colour roles, typography, spacing, imagery, iconography, and components.
- Prefer editorial, human, experience-led imagery; do not use misleading destination or accommodation imagery.
- Keep content specific and honest. Do not invent testimonials, awards, prices, availability, guarantees, destination expertise, or traveller outcomes.
- Maintain accessible contrast, visible focus, readable text, semantic hierarchy, and meaningful alternatives for imagery.
- Ensure responsive behaviour feels intentionally designed rather than compressed from desktop.
- Keep motion purposeful and provide a reduced-motion experience.
- Validate new visual patterns with Sophie and end-to-end traveller impact with Sri.

Brand alignment is behavioural as well as visual. A page can use the correct colours and still fail the brand if its flow is pressuring, confusing, generic, or impersonal.

---

## 13. Testing and validation standards

### 13.1 Risk-based coverage

Every change requires proportionate validation. Increase depth when work affects personal data, security, persistent data, Journey Passport completion, Journey Director decisions, generated intelligence, critical navigation, accessibility, external services, or release-critical journeys.

### 13.2 Required layers

| Layer | What to establish |
| --- | --- |
| Static quality | TypeScript and lint rules pass for the affected code. |
| Build integrity | The production build succeeds when the change can affect bundling, routing, server/client boundaries, or deployment. |
| Domain verification | Changed rules, catalogues, generators, and adapters pass their dedicated verification scripts. |
| Functional validation | Acceptance criteria, positive paths, invalid input, empty states, error handling, recovery, and regression scenarios behave as expected. |
| Experience validation | Responsive layout, content hierarchy, focus, keyboard use, screen-reader semantics, contrast, motion, long content, and end-to-end coherence are reviewed where applicable. |
| Integration validation | API, persistence, notification, migration, and deployment assumptions are tested without exposing production data or secrets. |
| Operational validation | Logging, monitoring evidence, failure behaviour, rollback/recovery, and configuration are sufficient for the risk. |

### 13.3 Test expectations

- A defect correction should include a reproducible failing case and evidence that the correction passes without unacceptable regression.
- A domain-rule change should include boundary cases, contradictions, ties, unsupported candidates, missing information, and representative traveller profiles.
- A generator change should prove schema validity, cross-file integrity, determinism, and runtime compatibility.
- A UI change should verify keyboard, focus, labels, errors, reduced motion, mobile, desktop, and relevant browser behaviour.
- An API change should verify malformed and oversized input, allowed-value validation, rate limiting where applicable, safe errors, retry/idempotency behaviour, and provider failure.
- A database change should be reviewed for constraints, permissions, RLS, existing-data compatibility, rollback/recovery, and application compatibility.

Do not claim a check passed unless it was run against the final relevant state. Record skipped or blocked checks with the reason, impact, owner, and follow-up decision.

---

## 14. Documentation standards

### 14.1 Required metadata

Governed documents must begin with a clear title and a metadata table containing, as applicable:

- product or project;
- document name or identifier;
- version;
- status;
- owner;
- approval or approver;
- created date;
- last-updated date;
- review date or cadence;
- purpose; and
- audience or scope.

Version 1.0 means the first approved baseline, not the first draft. Use a status that reflects reality; do not label a document approved without the authorised decision. Record that decision in the document or linked evidence.

### 14.2 Revision history

Maintain a revision table for governed documents with version, date, author or owner, approval/status, and a concise change summary. Update `Last updated` and revision history together for material revisions.

Recommended versioning:

- patch (`1.0.1`) for clarification or correction that does not change required behaviour;
- minor (`1.1`) for backwards-compatible additions or material guidance improvements; and
- major (`2.0`) for breaking contracts, changed governance, or materially redefined behaviour.

### 14.3 Canonical-source discipline

- Give each rule or decision one authoritative home.
- Link with repository-relative paths; never publish machine-specific absolute paths in repository documents.
- Update the [Canonical Document Index](../00-Project-Compass/DOCUMENT-INDEX.md) when an approved canonical document is added, moved, renamed, superseded, or retired.
- Mark superseded material explicitly and repair incoming links in the same change.
- Use the [Glossary](../00-Project-Compass/GLOSSARY.md) consistently; avoid introducing synonyms for governed terms.
- Record material product and business decisions in the decision log and material technical direction in an ADR.

### 14.4 Implementation records

Follow the [Development Documentation guide](../09-Development/README.md) and [EBC Execution Standard](../09-Development/EBC-EXECUTION-STANDARD.md). An implementation record should identify objective, background, scope and constraints, design intent, technical implementation, files changed, validation evidence, commit or review reference, known limitations, and deferred improvements.

Documentation must describe the implemented truth. Update it in the same change as the behaviour whenever practical.

---

## 15. Definition of done

A change is done only when every applicable statement is true:

### Outcome and scope

- [ ] The agreed traveller or business outcome is met.
- [ ] Acceptance criteria pass and explicit exclusions remain unchanged.
- [ ] Assumptions, trade-offs, and deferred work are recorded.

### Engineering

- [ ] The implementation is scoped, readable, typed, and consistent with repository boundaries.
- [ ] Inputs and failure paths are validated; secrets and personal data remain protected.
- [ ] Generated artefacts, migrations, dependencies, and lockfiles are intentional and governed.
- [ ] No unrelated user changes were overwritten or included accidentally.

### Product, experience, and brand

- [ ] Applicable Journey Passport and Journey Director guardrails are preserved.
- [ ] Brand, responsive behaviour, accessibility, recovery, and end-to-end traveller experience are verified.
- [ ] Canonical specifications and approved copy remain aligned with the implementation.

### Evidence

- [ ] Relevant lint, type, build, domain, functional, integration, and experience checks pass.
- [ ] Results are reproducible and tied to the final change.
- [ ] Skipped checks and residual risks have an owner and an explicit decision.

### Documentation and release

- [ ] Documentation, ADRs, EBCs, indexes, migrations, and operational guidance are updated where applicable.
- [ ] The final diff and Git status have been reviewed.
- [ ] Readiness evidence and rollback/recovery needs are clear.
- [ ] Required specialist reviews are complete.
- [ ] Vivek has made any required product, risk-acceptance, or release decision.

“Code complete” is not equivalent to “done,” and “done” is not equivalent to “released.”

---

## 16. Common commands

Run web commands from `web/`.

| Purpose | Command |
| --- | --- |
| Reproducible dependency install | `npm ci` |
| Local development | `npm run dev` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Run production build locally | `npm run start` |
| Export governed brand assets | `npm run brand:export` |
| Verify Journey Director engine | `npm run verify:journey-engine` |
| Verify presentation adapter | `npm run verify:journey-presentation` |
| Verify presentation catalogue | `npm run verify:journey-presentation-catalogue` |
| Verify runtime catalogue | `npm run verify:journey-catalogue` |
| Verify recommendation orchestration | `npm run verify:journey-orchestration` |
| Verify Journey Director runtime | `npm run verify:journey-runtime` |
| Verify representative Journey scenarios | `npm run verify:journey-scenarios` |
| Verify Journey Passport leads | `npm run verify:journey-leads` |
| Generate Journey intelligence | `npm run generate:journey-intelligence` |
| Verify Journey intelligence artefacts | `npm run verify:journey-intelligence` |
| Verify Journey intelligence determinism | `npm run verify:journey-intelligence:determinism` |
| Verify runtime intelligence | `npm run verify:journey-intelligence:runtime` |
| Verify intelligence steering | `npm run verify:journey-intelligence:steering` |
| Generate Journey itineraries | `npm run generate:journey-itineraries` |
| Verify Journey itineraries | `npm run verify:journey-itineraries` |
| Verify destination itinerary runtime | `npm run verify:destination-itineraries` |

Command availability is defined by `web/package.json`. Inspect the current scripts before running a remembered command. Generators can intentionally modify `web/generated/` or governed reports; review their diff before accepting it.

Useful repository checks, run from the repository root:

```bash
git status --short --untracked-files=all
git diff --check
git diff --stat
git diff
```

Do not use destructive Git commands to clean a working tree that contains work you do not own.

---

## 17. Canonical references

### Project and governance

- [Repository README](../../README.md)
- [Project Compass](../00-Project-Compass/COMPASS.md)
- [Decision Log](../00-Project-Compass/DECISION-LOG.md)
- [Canonical Document Index](../00-Project-Compass/DOCUMENT-INDEX.md)
- [Glossary](../00-Project-Compass/GLOSSARY.md)
- [Architecture Decision Record template](../03-ADR/ADR-000.md)
- [Architecture decision register](../03-ADR/DECISIONS.md)

### Product and journey

- [Product Vision](../02-Product/PRODUCT-VISION.md)
- [Software Requirements Specification](../02-Product/SRS.md)
- [Journey Passport v1.0](../02-Product/JOURNEY-PASSPORT-v1.0.md)
- [Destination Knowledge Base](../02-Product/DESTINATION-KNOWLEDGE-BASE.md)
- [Journey Director Decision Engine](../02-Product/JOURNEY-DIRECTOR-DECISION-ENGINE.md)
- [Journey Synopsis and Reference Contract](../02-Product/JOURNEY-SYNOPSIS-AND-REFERENCE-CONTRACT-v1.0.md)
- [Journey Director Experience](../04-UX/JOURNEY-DIRECTOR-EXPERIENCE.md)

### Brand and experience

- [Brand Identity](../07-Design/BRAND-IDENTITY.md)
- [Design Principles](../07-Design/DESIGN-PRINCIPLES.md)
- [Design Tokens](../04-UX/DESIGN-TOKENS.md)
- [Colour System](../04-UX/COLOR-SYSTEM.md)
- [Typography](../04-UX/TYPOGRAPHY.md)
- [Imagery Guidelines](../04-UX/IMAGERY-GUIDELINES.md)
- [Iconography](../04-UX/ICONOGRAPHY.md)
- [UI Components](../04-UX/UI-COMPONENTS.md)

### Engineering and release

- [Development Documentation guide](../09-Development/README.md)
- [EBC Execution Standard](../09-Development/EBC-EXECUTION-STANDARD.md)
- [Journey Director Runtime Catalogue](../09-Development/JOURNEY-DIRECTOR-RUNTIME-CATALOGUE.md)
- [Journey Intelligence Generator](../09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md)

---

## 18. Persona manuals, playbooks, and templates

The operating-model structure is intentionally modular. Links in the current-document lists point to files that exist. Future targets are listed separately as a roadmap and are not instructions to invent their contents; until they are published, use this handbook, the [Team Satvi operating model](./README.md), and current canonical sources.

### Current orientation documents

- [AI Operating Model Overview](./README.md)
- [Team Satvi](./TEAM-SATVI.md)

### Current persona manuals

- [Tiger — Programme and Delivery Lead](./personas/Tiger.md)
- [Arjun — Product and Business Analyst](./personas/Arjun.md)
- [Archie — Technical Architect](./personas/Archie.md)
- [Sophie — UX, UI and Frontend Experience Specialist](./personas/Sophie.md)
- [Rad — Engineering and Implementation Specialist](./personas/Rad.md)
- [Keerthi — Functional Validation Specialist](./personas/Keerthi.md)
- [Sri — Traveller Experience Reviewer](./personas/Sri.md)
- [Vivek — Business Owner and Product Manager](./personas/Vivek-Business-Owner.md)

### Planned document roadmap

| Area | Planned documents |
| --- | --- |
| Orientation | `CLAUDE-USAGE.md` |
| Playbooks | `playbooks/Engineering-Prerequisites.md`; `playbooks/Functional-Prerequisites.md`; `playbooks/Experience-Prerequisites.md`; `playbooks/EBC-Execution-Standard.md`; `playbooks/Validation-Report-Template.md`; `playbooks/Release-Readiness.md`; `playbooks/Git-Workflow.md` |
| Standards | `standards/Coding-Standards.md`; `standards/Documentation-Standards.md`; `standards/UX-Principles.md`; `standards/Architecture-Principles.md`; `standards/Brand-Guardrails.md`; `standards/Journey-Director-Guardrails.md` |
| Templates | `templates/EBC-Template.md`; `templates/Engineering-Report.md`; `templates/Functional-Report.md`; `templates/Experience-Report.md`; `templates/Release-Checklist.md` |

Until the planned AIOM EBC playbook is published, use the current [repository EBC standard](../09-Development/EBC-EXECUTION-STANDARD.md).

---

## 19. Handbook governance

- Search My Vacation owns this handbook; Team Satvi is its operational custodian, and Rad is its engineering custodian.
- Tiger coordinates reviews when delivery or role boundaries change.
- Archie reviews material architecture, security, data, or integration changes.
- Sophie, Keerthi, and Sri review changes to their respective experience and validation expectations.
- Vivek approves material governance changes and remains the final authority for product direction, accepted risk, and release.
- Update this handbook when stable engineering practice changes, not for a one-off workaround.
- Record approved material revisions in the metadata and revision history.
- Where a new specialist standard expands this handbook, keep the concise baseline here and link to the detailed source.

The handbook supports judgement; it does not replace evidence, specialist review, or authorised decisions.
