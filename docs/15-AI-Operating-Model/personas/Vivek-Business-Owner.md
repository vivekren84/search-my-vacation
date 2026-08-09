# Vivek — Business Owner and Product Manager

| Metadata | Value |
| --- | --- |
| **Document ID** | AIOM-017 |
| **Document Title** | Vivek — Business Owner and Product Manager Persona Manual |
| **Version** | 1.0 |
| **Status** | Approved |
| **Owner** | Search My Vacation |
| **Operational Custodian** | Team Satvi |
| **Approved By** | Vivek — Business Owner and Product Manager |
| **Effective Date** | 2026-08-09 |
| **Last Updated** | 2026-08-09 |
| **Classification** | Internal |
| **Purpose** | Define Vivek's final decision authority, product ownership, risk-acceptance responsibility, and release authority within Team Satvi. |
| **Related Documents** | [AI Operating Model Overview](../README.md); [SMV Engineering Handbook](../CLAUDE.md); [Team Satvi Operating Model](../TEAM-SATVI.md); [Tiger — Programme and Delivery Lead](./Tiger.md) |

## Revision history

| Version | Date | Summary |
| --- | --- | --- |
| 1.0 | 2026-08-09 | Initial approved release. |

---

## 1. Role definition

Vivek is Search My Vacation's Business Owner and Product Manager. He is accountable for product direction, business value, priority, material scope, accepted product and delivery risk, and final release decisions. Within Team Satvi, Vivek is the final authority when specialist recommendations cannot or should not resolve a business, product, priority, risk, or release trade-off.

Vivek's authority does not replace specialist accountability. Arjun, Archie, Sophie, Rad, Keerthi, and Sri provide domain judgement and evidence; Tiger makes that evidence decision-ready. Vivek decides with explicit awareness of their recommendations, uncertainty, and dissent.

This manual should be used with the [Team Satvi Operating Model](../TEAM-SATVI.md), the delivery coordination rules in the [Tiger persona manual](./Tiger.md), and the engineering baseline in the [SMV Engineering Handbook](../CLAUDE.md).

## 2. Product ownership mandate

Vivek owns the continuing integrity of SMV's product direction. His mandate is to:

- define and protect the traveller and business outcomes SMV pursues;
- establish product principles, priorities, success measures, and acceptable trade-offs;
- approve material scope and changes to it;
- decide which opportunities, defects, risks, and debt receive investment;
- resolve conflicts between value, experience, time, cost, technical sustainability, and risk;
- accept, reject, mitigate, or defer material residual risk;
- approve material exceptions to product or governance expectations;
- determine whether a release should proceed, proceed conditionally, be deferred, be rejected, or be rolled back; and
- ensure material decisions are recorded in the appropriate canonical source.

Product ownership is stewardship, not merely feature selection. Decisions should protect traveller trust, the SMV promise, long-term product coherence, and the organisation's ability to operate and learn.

## 3. Reserved decision authority

The following decisions are reserved for Vivek unless he explicitly records a narrower delegation:

| Decision area | Reserved authority |
| --- | --- |
| Product direction | Approve or change product vision, intended outcome, target traveller value, and strategic product principles |
| Priority | Set or materially change priority across outcomes, releases, risks, and investment areas |
| Material scope | Approve additions, removals, deferrals, or substitutions that materially affect the promised outcome or release |
| Business trade-offs | Decide among value, cost, timing, experience, operational, and strategic consequences |
| Risk acceptance | Accept material known residual risk after reviewing likelihood, impact, mitigation, contingency, and specialist advice |
| Exceptions | Approve material deviations from product or governance expectations, with conditions and review dates where needed |
| Release | Approve, conditionally approve, defer, reject, pause, roll back, or otherwise change the release state |
| Governance | Approve material changes to Team Satvi's authority, role boundaries, or operating model |

No AI persona, specialist, status label, checklist, or automated result may exercise these reserved decisions on Vivek's behalf.

## 4. Authority that remains with specialists

Vivek should not substitute personal preference for specialist analysis where the decision remains within approved product direction and risk boundaries. The following accountabilities remain with the relevant roles:

- Tiger owns delivery orchestration, routing, sequencing, dependencies, and readiness consolidation.
- Arjun owns the quality of product analysis, requirements, acceptance criteria, and traceability recommendations.
- Archie owns architecture and technical-design recommendations.
- Sophie owns UX, UI, accessibility, and frontend-experience recommendations.
- Rad owns implementation quality and technical evidence within approved constraints.
- Keerthi owns independent functional findings and the functional-readiness recommendation.
- Sri owns independent end-to-end traveller-experience findings and recommendation.

Vivek may decide to accept a material risk or product trade-off identified by a specialist, but the record must not imply that the specialist changed their finding. The decision and the specialist assessment remain distinct.

## 5. Delegation model

Vivek may delegate bounded decisions when the outcome, constraints, decision type, risk ceiling, time period, and escalation threshold are explicit. A valid delegation records:

- the delegate and decision class;
- the approved outcome and scope;
- financial, experience, technical, operational, or risk boundaries;
- evidence required before deciding;
- situations that must return to Vivek;
- the delegation's effective and review or expiry dates; and
- where decisions will be recorded.

Delegation does not transfer final accountability for product direction or release. Silence, absence, prior practice, or conversational convenience is not delegation.

## 6. Inputs required for a material decision

Vivek expects Tiger and the relevant specialists to provide the smallest complete decision package:

1. the exact decision and why it is required now;
2. the intended traveller and business outcome;
3. current approved scope and the proposed change, if any;
4. applicable canonical sources and prior decisions;
5. feasible options, including defer or do nothing where credible;
6. traveller, business, experience, technical, delivery, operational, legal, and reputational consequences as applicable;
7. evidence, assumptions, uncertainties, and confidence limits;
8. dependencies, reversibility, recovery, and time sensitivity;
9. specialist recommendations and unresolved dissent;
10. residual risk, mitigation, contingency, and proposed owner; and
11. Tiger's consolidated recommendation and follow-through for each option.

Urgency may reduce the amount of evidence available, but it must not be disguised as certainty. In urgent situations, the decision record should state what remains unknown and how it will be monitored or corrected.

## 7. Product decision method

When making a material product decision, Vivek:

1. confirms the decision falls within his authority and is framed at the right level;
2. restates the intended traveller and business outcome;
3. checks alignment with SMV's canonical vision, specifications, commitments, and prior decisions;
4. tests whether options preserve traveller trust and end-to-end product coherence;
5. reviews specialist evidence, uncertainty, dissent, and reversibility;
6. considers near-term benefit alongside long-term maintenance and operational consequences;
7. selects an option or requests the smallest additional evidence needed;
8. records the decision, rationale, accepted consequences, conditions, and owners; and
9. asks Tiger to propagate the decision into scope, plans, acceptance criteria, validation, documentation, and release state.

A decision should be made at the last responsible moment when additional evidence has value, but before delay destroys useful options or causes uncontrolled work.

## 8. Priority and portfolio ownership

Vivek sets priority by comparing outcomes, not by comparing the loudness or recency of requests. Priority decisions should consider:

- traveller value and trust;
- strategic and revenue contribution;
- contractual, legal, security, privacy, and operational urgency;
- learning value and reduction of critical uncertainty;
- dependencies and opportunity cost;
- effort, time, reversibility, and cost of delay;
- regression and release risk;
- maintenance burden and architectural health; and
- the impact of deferral or doing nothing.

Tiger may sequence work within an approved priority and dependency structure. Tiger must return to Vivek when new evidence materially changes value, cost, timing, risk, or the viability of the committed outcome.

## 9. Scope authority

Vivek approves the product outcome and material scope. A change is material when it could alter the promise to the traveller, acceptance criteria, release value, journey behaviour, business commitment, cost posture, deadline feasibility, risk exposure, or validation strategy.

For a material scope change, Vivek expects:

- baseline scope and proposed difference;
- reason and evidence for the change;
- effect on outcome and success measures;
- delivery, architecture, experience, validation, and release impact;
- alternatives such as sequencing, feature control, deferral, or reduced ambition;
- consequences for already completed work; and
- an updated recommendation from affected specialists.

Clarifications that do not change the outcome or material obligations may remain with Arjun and Tiger, provided the distinction is documented and no reserved trade-off is implied.

## 10. Risk-acceptance authority

Vivek is the final business authority for accepting material residual risk, but acceptance must be informed. The risk record should state:

- the event or condition and affected outcome;
- likelihood, impact, exposure window, and uncertainty;
- affected travellers, data, systems, operations, commitments, or reputation;
- preventative mitigation already completed;
- detection, monitoring, contingency, recovery, or rollback capability;
- specialist recommendation and dissent;
- alternatives and the consequence of not accepting the risk;
- named risk and mitigation owners; and
- review date, expiry, or closure condition.

Vivek must not accept a risk that law, regulation, contract, platform policy, or non-delegable safety obligation prohibits. Such concerns require the appropriate legal, security, privacy, or compliance authority in addition to product governance.

Risk acceptance is not evidence that a defect is resolved. The finding remains visible until corrected, superseded, or formally closed.

## 11. Release authority

Vivek alone makes the final SMV release decision. Tiger prepares the readiness package; specialists provide current domain recommendations. A release decision applies only to the exact scope, revision, environment, evidence, and conditions reviewed.

### 11.1 Required release view

Before a normal release decision, Vivek expects, as applicable:

- final included and excluded scope;
- outcome and acceptance-criteria status;
- architecture and implementation readiness;
- functional validation and regression status;
- traveller experience, accessibility, responsive, and brand readiness;
- security, privacy, data, integration, operational, and support readiness;
- documentation, migration, configuration, monitoring, recovery, and rollback status;
- failed or skipped checks and why;
- open findings, residual risks, mitigations, and owners;
- specialist recommendations and dissent; and
- Tiger's consolidated recommendation.

The [SMV Engineering Handbook](../CLAUDE.md) defines the repository-wide engineering and definition-of-done baseline. Release approval must not be inferred solely from a build, test suite, status summary, or specialist recommendation.

### 11.2 Release decisions

Vivek records one of the following:

- **Approved** — the release may proceed within the reviewed scope and standard controls.
- **Conditionally approved** — the release may proceed only when named conditions are completed or actively controlled as specified.
- **Deferred** — the decision is postponed pending named evidence, remediation, dependency, or timing.
- **Rejected** — the release must not proceed in its current form; the reason and required change are explicit.
- **Paused / rollback authorised** — deployment or operation must stop or revert according to the approved recovery action.

Conditional approval includes each condition's owner, deadline or trigger, verification method, consequence of failure, and whether it is pre-release or post-release. Conditions cannot be used to hide a known blocker.

### 11.3 Post-decision control

Tiger records and communicates the decision, updates the delivery state, and tracks conditions. If scope, revision, environment, evidence, or material risk changes after approval, Tiger returns the release to Vivek or the recorded delegate for reassessment.

## 12. Urgent incident and rollback decisions

During an urgent incident, traveller protection and containment take precedence over normal ceremony. Tiger coordinates the response; Rad and Archie provide technical and recovery options; Keerthi verifies observed behaviour and recovery; Sophie and Sri assess experience impact where relevant.

Vivek decides material product restriction, rollback, service pause, risk acceptance, or public product response based on the best current evidence. The initial record may be concise, but must capture the decision, time, available evidence, uncertainty, owner, monitoring, and next review point. A complete record and retrospective follow after stability returns.

## 13. Collaboration with Team Satvi

| Collaborator | Vivek expects | Vivek provides |
| --- | --- | --- |
| **Tiger** | Honest delivery view, decision framing, dependencies, readiness, risk, and specialist dissent | Direction, priority, reserved decisions, accepted risk, and release authority |
| **Arjun** | Evidence-backed problem framing, scope options, acceptance criteria, and outcome traceability | Product intent, value judgement, success measures, and scope decisions |
| **Archie** | Architecture options and implications for security, data, scalability, operations, and sustainability | Business constraints and decisions on material cost, product, timing, or risk trade-offs |
| **Sophie** | Experience intent, interaction consequences, accessibility, responsive and design recommendations | Product principles, target outcome, and decisions on material experience trade-offs |
| **Rad** | Feasibility, implementation truth, technical evidence, limitations, and recovery needs | Approved scope, priority, constraints, and decisions on material trade-offs |
| **Keerthi** | Independent functional evidence, regression assessment, reproducible findings, and readiness recommendation | Accepted product behaviour and decisions on disposition or material risk |
| **Sri** | Independent end-to-end traveller evidence, trust and friction findings, and experience recommendation | Traveller and business priorities and decisions on material experience risk |

Vivek encourages constructive challenge. A specialist is expected to state an evidence-backed concern even when it complicates schedule or conflicts with the preferred option.

## 14. Decision records and communication

A material decision record includes:

- decision ID or durable location;
- date and decision owner;
- context and exact question;
- options considered;
- evidence, assumptions, and uncertainty;
- specialist recommendations and dissent;
- decision and rationale;
- accepted consequences and residual risks;
- conditions, owners, and review points;
- affected scope, plans, specifications, and release state; and
- superseded decisions or documents.

Vivek communicates decisions in direct, unambiguous language. Approval, recommendation, acknowledgement, and permission to investigate are different states and must not be conflated.

## 15. Anti-patterns to avoid

- deciding before the actual question and options are clear;
- treating urgency as proof or confidence as evidence;
- asking specialists to manufacture consensus after a preferred answer is chosen;
- accepting material risk without an owner, mitigation, contingency, and review point;
- allowing informal scope growth to bypass product ownership;
- approving a release without tying evidence to the final scope and revision;
- making conditional approval indistinguishable from unconditional approval;
- overriding a specialist finding without recording the product or risk decision;
- using release approval to imply all known issues are fixed; and
- leaving decisions in chat when canonical sources, plans, or logs must change.

## 16. Vivek decision checklist

- [ ] The exact decision and its urgency are clear.
- [ ] The intended traveller and business outcome is explicit.
- [ ] Current scope, proposed change, and exclusions are understood.
- [ ] Canonical sources and prior decisions have been considered.
- [ ] Credible options and the consequence of doing nothing are visible.
- [ ] Relevant specialists have provided evidence and recommendations.
- [ ] Assumptions, uncertainty, dissent, dependencies, and reversibility are explicit.
- [ ] Material residual risk has mitigation, contingency, ownership, and a review point.
- [ ] The decision, rationale, conditions, and follow-through are recorded.
- [ ] Tiger has clear authority to propagate the decision, or a bounded delegation is documented.
- [ ] For release, the approval applies to the exact reviewed scope, revision, environment, and evidence.
