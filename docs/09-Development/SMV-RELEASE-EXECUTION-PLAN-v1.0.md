# SMV Release Execution Plan v1.0

| Field | Value |
| --- | --- |
| **Release** | Search My Vacation Release 1 |
| **Status** | Active launch-sprint execution plan |
| **Launch target** | 31 July 2026 |
| **Baseline readiness** | 45% (Release Readiness Audit, 24 July 2026) |
| **Release candidate gate** | 30 July 2026 |
| **Owners** | Team Satvi — Tiger, Archie, Sophie and Sri |

## 1. Purpose

This plan converts the approved Release 1 documents and release-readiness audit into a controlled launch sprint. It does not reopen product, UX, architecture or destination decisions already governed by the canonical documentation.

The launch objective is an honest, complete first-time visitor journey:

```text
Homepage → Journey Passport → Journey Session → Journey Director → Human handoff
```

Public launch is approved only when this journey, the minimum public trust surface and the technical release checks have all passed.

## 2. Workstreams

### Workstream A — Traveller Experience

**Outcome:** A traveller can complete the approved canonical Journey Passport, retain their context, receive deterministic Journey Director possibilities and reach an honest handoff state.

| Priority | Deliverable | Owner | Acceptance gate |
| --- | --- | --- | --- |
| A1 | Canonical eight-moment Passport is the live route. | Archie / Sophie | Approved fields, validation and back/forward navigation work. |
| A2 | Homepage intent and completed Passport snapshot persist in Journey Session. | Archie | Refresh and route changes retain a validated session. |
| A3 | Passport completion opens Journey Director. | Archie / Sophie | No demo fallback; valid, partial, insufficient and unavailable states are honest. |
| A4 | End-to-end traveller acceptance. | Sri | Desktop and mobile paths pass the agreed script. |

### Workstream B — Public Website

**Outcome:** A first-time visitor can understand Search My Vacation, navigate every visible link, contact a real person and access the required legal information.

| Priority | Deliverable | Owner | Acceptance gate |
| --- | --- | --- | --- |
| B1 | Navigation, homepage structure and footer. | Sophie / Tiger | No visible dead links or experimental duplicate routes. |
| B2 | About, destination and contact surfaces. | Tiger / Sri | Approved public copy and a verified handoff channel. |
| B3 | Privacy and Terms pages. | Tiger / Business owner | Reviewed, published and linked. |
| B4 | Inspiration disposition and launch content review. | Sri / Sophie | Published or intentionally deferred without broken navigation. |

## 3. Day-by-Day Gates

| Date | Required outcome | Gate |
| --- | --- | --- |
| **25 Jul** | Execution control and Passport → Session → Director path. | End-to-end traveller path works with real inputs. |
| **26 Jul** | Contact/handoff, About, footer, navigation and legal minimum. | Every primary link has an honest destination. |
| **27 Jul** | Destination surface, content completion and public-route cleanup. | Minimum public content is approved and reachable. |
| **28 Jul** | Responsive, accessibility and recovery-state QA. | No critical traveller defects remain. |
| **29 Jul** | SEO, performance baseline, robots, sitemap and release candidate preparation. | Release candidate is buildable and testable. |
| **30 Jul** | Production-like deployment, smoke tests and formal go/no-go. | Every critical launch checklist item passes. |
| **31 Jul** | Public launch. | Launch owner records approval. |

## 4. Non-Negotiable Launch Gates

1. The canonical Passport saves a valid snapshot and routes to Journey Director.
2. Journey Director never substitutes sample data for a missing traveller session.
3. A verified human handoff channel exists, with honest acknowledgement and consent language.
4. Header and footer contain no dead or placeholder public links.
5. About, Contact, Privacy and Terms are published and linked.
6. TypeScript, lint policy and production build pass; the full path is verified on desktop, tablet and mobile.
7. The 30 July go/no-go review approves the exact production commit.

## 5. Delivery Controls

- Preserve and review pre-existing uncommitted work; do not overwrite unrelated changes.
- Keep product decisions within the canonical documents.
- Treat a failed critical gate as a private-preview decision, not a reason to conceal an incomplete public flow.
- Record verification evidence with each completed launch item.

## 6. Immediate Day 1 Assignment

1. Inventory and preserve the current working tree.
2. Restore the existing canonical Passport integration as the live route.
3. Connect completion to snapshot creation, Journey Session persistence and Journey Director navigation.
4. Verify successful, partial, insufficient, unavailable and missing-session states.
5. Lock the approved human handoff channel and legal-content owner for Workstream B.
