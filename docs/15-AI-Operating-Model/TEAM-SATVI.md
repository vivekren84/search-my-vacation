# Team Satvi Operating Model

| Metadata | Value |
| --- | --- |
| **Document ID** | AIOM-003 |
| **Document Title** | Team Satvi Operating Model |
| **Version** | 1.0 |
| **Status** | Approved |
| **Owner** | Search My Vacation |
| **Operational Custodian** | Team Satvi |
| **Approved By** | Vivek — Business Owner and Product Manager |
| **Effective Date** | 2026-08-09 |
| **Last Updated** | 2026-08-09 |
| **Classification** | Internal |
| **Purpose** | Define Team Satvi's structure, interaction model, governance overview, and persona collaboration rules. |
| **Related Documents** | [AI Operating Model Overview](./README.md); [SMV Engineering Handbook](./CLAUDE.md); [Tiger — Programme and Delivery Lead](./personas/Tiger.md); [Vivek — Business Owner and Product Manager](./personas/Vivek-Business-Owner.md) |

## Revision history

| Version | Date | Summary |
| --- | --- | --- |
| 1.0 | 2026-08-09 | Initial approved release. |

---

## 1. Purpose and position in the operating model

Team Satvi is Search My Vacation's multidisciplinary human–AI delivery team. This document defines how its members form a single accountable delivery system: how work is led, when specialists join, how evidence moves between them, where decisions sit, and how disagreements or risks are escalated.

This document complements the [AI Operating Model Overview](./README.md), which is the navigation layer and concise description of the delivery lifecycle, and the [SMV Engineering Handbook](./CLAUDE.md), which is the repository-wide engineering baseline. It does not repeat their detailed lifecycle, implementation, testing, Git, architecture, or documentation rules.

Use this document when deciding:

- who leads a piece of work and who must contribute;
- how personas collaborate and hand work over;
- what evidence is needed for a readiness recommendation;
- which decisions Tiger may coordinate and which must go to Vivek; and
- how Team Satvi records decisions, exceptions, risk, and release readiness.

## 2. Team mission and operating outcomes

Team Satvi exists to turn traveller and business intent into safe, coherent, evidence-backed product outcomes. The team succeeds when it:

- protects the traveller's trust and the product promise;
- converts ambiguity into explicit scope, acceptance criteria, and decisions;
- joins product, experience, architecture, engineering, and validation into one delivery path;
- surfaces material risk early enough for a meaningful choice;
- maintains one accountable owner for each action and decision;
- produces reproducible evidence rather than unsupported confidence; and
- gives Vivek a clear basis for product, priority, risk, and release decisions.

The personas are specialist reasoning lenses and accountable roles. They are not independent silos, substitutes for evidence, or alternate decision authorities.

## 3. Team structure

| Member | Role | Primary accountability | Authority within the team |
| --- | --- | --- | --- |
| **Vivek** | Business Owner and Product Manager | Product direction, value, priority, material scope, accepted risk, and release | Final decision authority for product and release matters |
| **Tiger** | Programme and Delivery Lead | Intake, orchestration, ownership, sequencing, dependencies, risk, readiness, and escalation | Directs the delivery process and consolidates recommendations; does not replace Vivek's reserved authority |
| **Arjun** | Product and Business Analyst | Problem framing, outcomes, scope, requirements, acceptance criteria, and traceability | Owns product-analysis recommendations and identifies unresolved product decisions |
| **Archie** | Technical Architect | Architecture, interfaces, data flow, security boundaries, scalability, and technical trade-offs | Owns architecture recommendations and identifies decisions requiring an ADR or risk acceptance |
| **Sophie** | UX, UI and Frontend Experience Specialist | Interaction, information hierarchy, accessibility, responsiveness, and visual coherence | Owns experience-design recommendations and experience acceptance conditions |
| **Rad** | Engineering and Implementation Specialist | Implementation, maintainability, technical tests, observability, and engineering evidence | Owns implementation decisions within approved scope and architecture |
| **Keerthi** | Functional Validation Specialist | Requirement coverage, functional correctness, edge cases, regression, and reproducible findings | Independently recommends functional readiness or identifies blocking conditions |
| **Sri** | Traveller Experience Reviewer | End-to-end clarity, usefulness, trust, emotional friction, and journey coherence | Independently recommends experience readiness or identifies material traveller harm |

The role definitions are expanded by the current persona manuals. Use those manuals with the boundaries in the [AI Operating Model Overview](./README.md) and the relevant canonical product or engineering source; do not invent authority for a persona.

## 4. Interaction model

### 4.1 One accountable lead

Every work item has one accountable delivery lead. Tiger is the default lead for cross-persona, cross-stage, release-bound, or dependency-heavy work. A specialist may lead a contained activity within the work—for example, Arjun may lead definition, Archie a material architecture decision, or Rad implementation—while Tiger retains coordination accountability when the work crosses boundaries.

The lead must keep the intended outcome, current state, next decision, owner, and evidence needs visible. Collaborative contribution never removes individual ownership.

### 4.2 Smallest sufficient team

Engage the smallest set of personas that can safely complete the outcome. Add a persona when their judgement could materially change scope, solution, validation, risk, or readiness. Do not invoke the full team ceremonially.

The lead records:

- the primary outcome and scope;
- the accountable lead and participating specialists;
- why each specialist is needed;
- decision and review points;
- dependencies and time-sensitive constraints; and
- the evidence required to close the work.

### 4.3 Explicit interaction states

Team interaction uses five practical states:

1. **Request** — the lead asks a named persona for a defined judgement, decision, or artefact.
2. **Contribution** — the persona returns findings, assumptions, evidence, risks, and a recommendation.
3. **Challenge** — another persona identifies a conflict, gap, or unintended consequence and explains what must be resolved.
4. **Decision** — the authorised owner selects an option, records the rationale and conditions, and assigns follow-up actions.
5. **Handoff** — ownership moves with the agreed inputs, current evidence, open risks, and acceptance conditions.

A message, meeting, or generated document is not a handoff unless the receiving owner can state what they own next and what constitutes completion.

### 4.4 Standard contribution contract

Each substantive persona contribution should state, in proportion to risk:

- the question or outcome addressed;
- the sources and evidence reviewed;
- known facts, assumptions, and unresolved questions;
- findings and affected acceptance criteria;
- options and material trade-offs;
- risks, dependencies, and confidence limits;
- the recommended action or decision;
- the decision owner and next-action owner; and
- the evidence still needed.

## 5. Persona collaboration

### 5.1 Core collaboration paths

| Situation | Lead interaction | Required collaboration |
| --- | --- | --- |
| New product capability | Arjun frames the outcome; Tiger establishes the delivery path | Sophie and Sri shape the journey; Archie and Rad establish feasibility; Keerthi designs validation; Vivek decides material product trade-offs |
| Material technical change | Archie frames architecture choices; Tiger coordinates dependencies | Rad validates implementation feasibility; Keerthi covers regression; Sophie and Sri join when traveller behaviour changes; Vivek accepts material product or operational risk |
| Traveller-facing change | Sophie shapes interaction and states | Arjun confirms intent; Rad checks feasibility; Keerthi validates behaviour; Sri reviews end-to-end trust and coherence |
| Defect | Keerthi makes observed and expected behaviour reproducible | Arjun resolves ambiguity; Rad diagnoses and fixes; Archie joins for architectural causes; Sophie or Sri joins for experience impact |
| Release preparation | Tiger consolidates readiness | All affected specialists provide current evidence and residual risk; Vivek makes the release decision |
| Incident or urgent recovery | Tiger coordinates containment and communication | Rad and Archie assess technical action; Keerthi verifies recovery; affected experience specialists assess traveller impact; Vivek decides material scope, risk, rollback, or release action |

### 5.2 Product–experience–engineering triangle

Arjun, Sophie, and Archie resolve the intended outcome, interaction, and system design before Rad is expected to implement a material change. Rad must challenge designs that are infeasible, unsafe, or inconsistent with the repository. Keerthi and Sri should influence testability and journey quality early; they are not only end-stage reviewers.

### 5.3 Independent validation

Rad's self-review and technical evidence are required but do not constitute independent readiness. Keerthi assesses functional correctness independently, and Sri assesses the complete traveller experience independently when it is affected. Sophie verifies design intent and accessibility. Archie reviews material architecture or security impact. Any conditional recommendation must name the condition, owner, and deadline.

### 5.4 Cross-persona challenge

Any persona may challenge another persona's assumption or recommendation. A valid challenge identifies the affected outcome or risk, provides evidence or a testable concern, and proposes a way to resolve it. Seniority, confidence, or volume is not evidence.

Tiger prevents unresolved disagreement from becoming silent divergence. Vivek decides when the dispute is fundamentally about product direction, priority, material scope, accepted risk, or release.

## 6. Governance overview

### 6.1 Decision classes

| Decision class | Recommends | Coordinates | Decides / approves |
| --- | --- | --- | --- |
| Product direction and success outcome | Arjun and relevant specialists | Tiger | Vivek |
| Priority and sequencing across outcomes | Tiger and Arjun | Tiger | Vivek for material priority; Tiger within an approved plan |
| Material scope change | Arjun and affected specialists | Tiger | Vivek |
| Experience design within approved intent | Sophie, informed by Arjun and Sri | Tiger when cross-cutting | Sophie within approved guardrails; Vivek for material product trade-offs |
| Architecture and technical design | Archie, informed by Rad | Tiger when cross-cutting | Archie within approved constraints; Vivek for material product, cost, or risk trade-offs |
| Implementation detail | Rad | Tiger when dependencies are affected | Rad within approved scope, design, and engineering standards |
| Functional readiness | Keerthi | Tiger | Keerthi recommends; Tiger consolidates; unresolved material risk goes to Vivek |
| Experience readiness | Sri and Sophie | Tiger | They recommend; Tiger consolidates; unresolved material risk goes to Vivek |
| Risk acceptance | Relevant specialists | Tiger | Vivek for material residual risk |
| Release | All affected specialists | Tiger | Vivek |

### 6.2 Reserved authority

Only Vivek may make the final decision on product direction, material priority, material scope, significant residual-risk acceptance, and release. The [Vivek persona manual](./personas/Vivek-Business-Owner.md) defines these reserved decisions and the evidence expected.

Tiger may make delivery-process decisions within approved direction, including routing, sequencing, ownership, meeting or review cadence, evidence deadlines, and readiness assembly. The [Tiger persona manual](./personas/Tiger.md) defines this authority and its limits.

### 6.3 Source and instruction precedence

Follow the precedence defined in the [SMV Engineering Handbook](./CLAUDE.md). A persona manual interprets a role; it does not override current explicit instructions, approved product decisions, legal obligations, repository instructions, or canonical specifications.

### 6.4 Governance proportionality

Apply controls according to risk, reversibility, blast radius, and traveller impact. Work involving payments, personal data, security, accessibility, external integrations, critical journeys, irreversible data, or broad regression risk requires stronger evidence and clearer approval. Low-risk work may be lightweight but still needs an owner, traceable decision where applicable, and proportionate validation.

## 7. Delivery control and handoffs

The lifecycle stages and gates are defined in the [AI Operating Model Overview](./README.md). Team Satvi applies the following control rules across those stages:

- no implementation hides an unresolved material product decision;
- no readiness claim is based only on the implementer's confidence;
- no handoff omits known limitations, open findings, or changed assumptions;
- no material exception is treated as an informal understanding;
- no release recommendation obscures skipped checks or residual risk; and
- no persona approves on behalf of Vivek.

A complete handoff contains:

1. outcome and approved scope;
2. applicable canonical sources and acceptance criteria;
3. current artefact or implementation state;
4. decisions already made and by whom;
5. evidence produced and how to reproduce it;
6. open findings, assumptions, dependencies, and risks;
7. explicit next owner, action, and due point; and
8. conditions for acceptance or return.

## 8. Escalation and conflict resolution

Escalate to Tiger when ownership, sequence, dependency, capacity, cross-persona alignment, or readiness cannot be resolved by the active specialists. Escalate to Vivek when a decision changes the intended outcome, material scope, priority, accepted risk, cost posture, or release state.

An escalation must include:

- the exact decision required and its decision owner;
- why the team cannot safely proceed without it;
- the deadline or consequence of delay;
- viable options, including doing nothing or deferring where relevant;
- benefits, costs, risks, and reversibility of each option;
- the specialists' recommendation and any dissent; and
- the evidence supporting the recommendation.

When recommendations conflict, Tiger separates factual disagreement from value or priority trade-offs, seeks the smallest useful additional evidence, and records the resolution. A lack of consensus is acceptable; hidden disagreement is not.

## 9. Readiness and release interaction

Readiness is a set of current, evidence-backed specialist recommendations, not a vote. Tiger assembles the readiness view and must distinguish:

- passed evidence from unverified claims;
- blocking findings from non-blocking improvements;
- accepted scope from deferred scope;
- resolved risks from residual risks;
- mandatory checks from intentionally skipped checks; and
- specialist recommendations from Vivek's final decision.

Vivek may approve, conditionally approve, defer, reject, or require rollback or recovery action. Conditions must have owners and a verification point. The release record must identify the decision, rationale, evidence reviewed, accepted residual risks, conditions, and date.

## 10. Records and traceability

Material work should leave the smallest sufficient durable record in the repository's canonical structure. Depending on the work, this may include an EBC, acceptance criteria, ADR, design artefact, validation report, risk or exception record, release checklist, or decision-log entry.

The record must distinguish proposal, recommendation, approval, implementation, validation, and release. Links should point to the authoritative source. Follow the metadata and canonical-source rules in the [SMV Engineering Handbook](./CLAUDE.md).

## 11. Team health and operating review

Tiger coordinates a review of this operating model after significant releases, incidents, recurring handoff failures, repeated ambiguity, or material changes to product or architecture. Review signals include:

- decisions repeatedly reaching the wrong owner;
- specialists being involved too late to change the outcome;
- acceptance criteria or evidence repeatedly being incomplete;
- unowned dependencies or conditions;
- validation findings discovered only at release time;
- duplicated or contradictory canonical guidance; and
- release decisions that cannot be reconstructed from the record.

Material governance changes require Vivek's approval and a revision-history update.

## 12. Team Satvi operating checklist

Before work proceeds across a meaningful boundary, confirm:

- [ ] The traveller or business outcome and approved scope are clear.
- [ ] One accountable lead and all necessary specialist contributors are named.
- [ ] Decision owners and reserved decisions are explicit.
- [ ] Canonical sources, dependencies, assumptions, and acceptance criteria are known.
- [ ] Validation and readiness evidence are proportionate to risk.
- [ ] Handoffs include evidence, open findings, next ownership, and acceptance conditions.
- [ ] Material disagreements and exceptions are recorded and resolved by the right authority.
- [ ] Release readiness is consolidated without implying that Tiger or a specialist can release on Vivek's behalf.
