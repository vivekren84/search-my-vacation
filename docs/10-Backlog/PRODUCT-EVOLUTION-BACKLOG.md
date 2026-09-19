# Search My Vacation

# Product Evolution Backlog

```text
Document Type : Governance Register (documentation only — no code, no configuration, no schema change)
Release       : Established during Release 1.3 (`EBC-R1.3-GOV-004`); intended to remain live and release-independent across future releases
Persona       : Tiger — Programme and Delivery Lead
Status        : ESTABLISHED — governance framework defined; initial candidate list recorded as recommendations only, none ratified
Owner         : Tiger (Programme and Delivery Lead)
Related documents : docs/10-Backlog/RELEASE-1.3-BACKLOG.md; docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md; docs/10-Backlog/FUTURE-CONSIDERATIONS.md; docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md; docs/10-Backlog/RELEASE-1.3.md; docs/02-Product/PRODUCT-ROADMAP.md; docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md
Distinct from : RELEASE-1.3-BACKLOG.md (decisions/vision items already accepted for evaluation within a specific, named release's own pre-execution planning), FUTURE-CONSIDERATIONS.md (tactical items surfaced and explicitly deferred during already-completed workstream execution), RELEASE-1.3-GOVERNANCE-BACKLOG.md (governance/operational-playbook recommendations), and RELEASE-1.3-FEATURE-REGISTER.md (feature-level delivery tracking within an open release). The Product Evolution Backlog (PEB) sits upstream of all four: it holds Product Owner-approved future business capabilities, expected to become entire future workstreams, that have not yet been evaluated for inclusion in any specific release. See Section 6 for the full relationship analysis.
```

## Document Information

| Field | Value |
|---|---|
| Origin EBC | `EBC-R1.3-GOV-004` — Product Evolution Backlog Establishment & Governance Framework |
| Explicitly out of scope | Release planning, prioritisation, implementation, architecture, engineering, UX, QA, estimation, workstream creation. No entry below carries a target release, a priority, an effort estimate, or workstream authorisation. |

## Document Change History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 19-Sep-2026 | Tiger | Initial establishment, per `EBC-R1.3-GOV-004`. Defines the Product Evolution Backlog (PEB) governance framework (purpose, definition, inclusion/exclusion criteria, lifecycle, relationship to existing registers, governance rules) and records an Initial Candidate List of eight items named in the originating EBC, reviewed against the current repository record. Seven are recorded as genuine candidates (none ratified); one (Traveller Timeline) is disclosed as already-approved Workspace Business Module scope and explicitly not added — see Section 8.2. `PEB-001` (Journey Amendment) additionally records a Product Owner decision issued directly within the originating EBC's own text. |

---

## 0. Workspace Readiness Check (Project Instructions §14)

| Check | Result |
|---|---|
| Local repository connection this session | Connected — folder access granted for `/Users/viveksophu/Documents/Projects/SearchMyVacation` |
| Repository root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed |
| Branch | `main` |
| Working tree before this task | Not clean, but not created by this task: two pre-existing modified files (`docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md`, `docs/10-Backlog/RELEASE-1.3.md`) and a substantial set of pre-existing untracked files — the `Claude outputs/` evidence folder, and three `docs/09-Development/` governance documents (`EBC-R1.3-GOV-003`, `EBC-R1.3-WS12-001`, and the WS12-002 Arjun card) apparently copied into the repository by a prior session or by the Product Owner directly, ahead of this card. None of this pre-existing state was touched by this activity. |
| Repository structure | Confirmed — `docs/10-Backlog/` and `docs/09-Development/` both exist; no folder created |
| Existing governance documents reviewed | `docs/10-Backlog/FUTURE-CONSIDERATIONS.md`, `RELEASE-1.3-BACKLOG.md`, `RELEASE-1.3-GOVERNANCE-BACKLOG.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, `RELEASE-1.3.md` (dashboard, WS12 row, Decision Log); `docs/00-Project-Compass/GOVERNANCE-MAP.md`, `DOCUMENT-INDEX.md`; `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`; `docs/02-Product/PRODUCT-ROADMAP.md`; `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md`; the WS12-001 and WS12-002 cards |
| Unauthorised folder creation | None — this document is placed in the existing `docs/10-Backlog/` folder |
| Canonical source | This repository document, once committed, is the canonical Product Evolution Backlog. A Claude Project copy is maintained for governance traceability but does not govern in the event of any difference — consistent with this repository's established convention (`RELEASE-1.3-BACKLOG.md` Document Information; `FUTURE-CONSIDERATIONS.md` §7). |

---

## 1. Purpose

Release-level governance documents — the Release Backlog, the Feature Register, the Release Tracker — exist to manage what is already inside, or being actively evaluated for, an open release. None of them has a designed place for a Product Owner-approved future business capability that is not yet destined for any specific release at all: a whole future workstream-scale idea, ratified in principle but with no target release, no priority, and no workstream number.

Without a governed home, such an idea either (a) gets folded prematurely into a release document as a "vision item," diluting that document's own release-scoping purpose, or (b) exists only in conversation and is lost. The Product Evolution Backlog (PEB) is that governed home: the canonical register of Product Owner-approved future capabilities that are intentionally deferred beyond the current release and are expected to become entire future product workstreams — module-scale, not feature-scale.

The PEB sits between Product Vision and the Release Backlog (Section 6). It is not itself a release plan, a priority list, or an authorisation to build anything.

---

## 2. Definition — What Is a Product Evolution Item?

**A Product Evolution Item is a Product Owner-approved future capability that has been intentionally deferred and is expected to become a future product workstream** (the same grain of unit as WS12–WS17, the currently-reserved Workspace Business Modules) — not a feature, task, or improvement that fits inside an already-scoped workstream.

### 2.1 Explicitly Distinguished From

| Not a Product Evolution Item | Where it belongs instead |
|---|---|
| **Release Backlog items** — Product Owner-approved decisions or vision items already accepted for evaluation within a specific, named release's own pre-execution planning (e.g. `RELEASE-1.3-BACKLOG.md`'s Journey Intelligence Engine, Traveller Inspiration) | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (or the equivalent for a future release) |
| **Engineering improvements** — code-level refactoring, performance, or hardening work | `RELEASE-1.3-BACKLOG.md` §9 (Technical Debt) or a future release's equivalent |
| **Architecture evolution** — a technical-design idea not tied to a specific new business capability | `FUTURE-CONSIDERATIONS.md` (Architecture category) or an ADR |
| **UX improvements** — interaction, layout or visual-hierarchy refinements to an existing, already-scoped feature | `FUTURE-CONSIDERATIONS.md` (UX category) or `RELEASE-1.3-BACKLOG.md` (Section 10, UX Improvements) |
| **Governance recommendations** — playbooks, process, or operating-model improvements | `RELEASE-1.3-GOVERNANCE-BACKLOG.md` |
| **Technical debt** | `RELEASE-1.3-BACKLOG.md` §9 |
| **Future Considerations** — tactical items a completed workstream's own review explicitly named as deferred, tied to a specific already-completed EBC/ADR | `FUTURE-CONSIDERATIONS.md` |

The distinguishing test is grain and origin, not subject matter: a Product Evolution Item is (a) module/workstream-scale, not feature-scale, and (b) a **Product Owner decision or ratified business capability**, not a deferred technical, architectural, UX, governance, or engineering finding surfaced during already-completed execution work.

---

## 3. Inclusion and Exclusion Criteria

### 3.1 Include Only

- Product Owner decisions naming a future business capability.
- Ratified business capabilities not yet scoped into any release.
- Future modules (workstream-scale, in the sense WS12–WS17 already are).
- Future workflows spanning multiple existing or future modules.
- Major business-object evolution (a new business object, or a fundamental change to how an existing one — Lead, Traveller, Journey, Proposal, etc. — behaves).
- Product policy decisions with workstream-scale consequences (e.g. "a Journey Amendment shall never reopen a booked Journey").

### 3.2 Do Not Include

- Engineering refactoring.
- Architecture ideas not tied to an approved future business capability.
- Documentation improvements.
- QA recommendations.
- Coding standards.
- Infrastructure work.
- Anything already committed to an active release (i.e. already carrying a `FEAT-R1.3-0##` entry, a `RELEASE-1.3-BACKLOG.md` decision, or a workstream number).

---

## 4. Product Evolution Lifecycle

```
Identified
    ↓
Ratified
    ↓
Product Evolution Backlog
    ↓
Candidate Release
    ↓
Approved Workstream
    ↓
Completed
```

- **Identified** — a future capability is named, by the Product Owner or surfaced through Team Satvi's work and brought to the Product Owner, but not yet formally approved.
- **Ratified** — the Product Owner explicitly approves it as a genuine future direction (not yet scoped to any release).
- **Product Evolution Backlog** — the item is recorded here (Section 8), carrying a `PEB-0##` identifier, with no target release, priority, or estimate.
- **Candidate Release** — a future release's delivery-planning workstream (the Release 1.4+ equivalent of `EBC-R1.3-001`) evaluates the item for inclusion, exactly as `FUTURE-CONSIDERATIONS.md` §5 already defines for its own promotion path.
- **Approved Workstream** — the Product Owner commits the item to a specific release and it receives a workstream number (the same allocation mechanism `EBC-R1.3-GOV-003` used for WS12–WS17).
- **Completed** — the resulting workstream reaches its own governance closure, per Project Instructions §12.

No item in this register may skip from **Product Evolution Backlog** directly to **Approved Workstream** — it must pass through a release's own delivery-planning evaluation, mirroring the equivalent rule already established for the Future Considerations Register (`FUTURE-CONSIDERATIONS.md` §5, "An FCR entry never moves directly into a release plan").

---

## 5. Relationship Diagram

```
Product Vision
(docs/02-Product/PRODUCT-ROADMAP.md and equivalent vision documents)
    ↓
Product Evolution Backlog
(this document — Product Owner-approved future capabilities,
 no target release, workstream-scale)
    ↓
Release Backlog
(RELEASE-1.3-BACKLOG.md or a future release's equivalent —
 items accepted for evaluation within a specific release)
    ↓
Release Workstreams
(RELEASE-1.3.md §5 Master Workstream Tracker — numbered,
 sequenced, in delivery)
    ↓
Completed Features
(RELEASE-1.3-FEATURE-REGISTER.md — evidence-based delivery record)
```

**Future Considerations Register** (`FUTURE-CONSIDERATIONS.md`) is a separate, independent governance input at the Release Workstreams / Completed Features level — items it captures are tactical findings surfaced *during* execution of an already-scoped workstream, not future-vision items descending from Product Evolution. It feeds forward into future release planning independently of this backlog, per its own §5 governance rules.

---

## 6. Relationship With Existing Registers (Overlap Analysis)

This section exists to satisfy this EBC's own validation requirement — "no overlap with FCR," "no overlap with Release Backlog" — with the reasoning shown explicitly, not merely asserted.

### 6.1 vs. `RELEASE-1.3-BACKLOG.md`

`RELEASE-1.3-BACKLOG.md`'s own Purpose section states it is "a capture and categorisation record" for items already "accepted in principle" for evaluation within Release 1.3 specifically — several of its Section 1 Decisions (Journey Intelligence Engine, Traveller Inspiration, Authentication Roadmap) are, in substance, exactly the scale of idea the PEB is meant to hold. **The distinction is temporal and procedural, not conceptual:** an item lands in `RELEASE-1.3-BACKLOG.md` once it has been accepted for evaluation within a specific, named release's own pre-execution planning. An item lands in the PEB when it has been Product-Owner-ratified as a genuine future direction but has **not yet** been brought into any specific release's planning at all. The PEB is what should have existed one step earlier in the pipeline for those very Release 1.3 Backlog items — this register does not retroactively reclassify them, since they are already correctly placed one stage further along.

### 6.2 vs. `FUTURE-CONSIDERATIONS.md`

No overlap in practice: every existing FCR entry (reviewed in full, Section 0 above) traces to a specific, already-completed governance card and is Architecture/Product/UX/Engineering-category tactical detail (e.g. a missing UI component library, a taxonomy inconsistency) — none is a Product Owner-approved, workstream-scale future capability. The FCR's own §1 explicitly disclaims being "a mechanism for creating new ideas" — it only records what a completed review already named as deferred. The PEB is the opposite shape: entries originate from Product Owner decisions, not from execution-time findings.

### 6.3 vs. `RELEASE-1.3-FEATURE-REGISTER.md`

No overlap: the Feature Register tracks features already inside Release 1.3's own scope (`FEAT-R1.3-001`–`014`), each traceable to a Release Backlog decision. No Feature Register entry corresponds to any item in this register's Initial Candidate List (Section 8) — confirmed by direct review of the current register (v1.6) during this card.

### 6.4 vs. the Approved Workspace Product Specification

One material finding from this review: **`SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §6.2 already names "Traveller Timeline" as an approved Traveller Hub (WS14) capability** — "approved but not yet drafted as FRs" (per Product Owner Review Baseline Handover §5.2, cross-referenced there as Open Question OQ-018). This is not a Product Evolution candidate; it is already-ratified, workstream-scoped content awaiting Business Analysis under its own reserved workstream. It was named as an example in this EBC's own text, and this discrepancy is disclosed rather than silently resolved either way — see Section 8.2.

---

## 7. Governance Rules

**Who may propose a Product Evolution item.** Any Team Satvi persona may bring a candidate to Tiger, but a candidate is only recorded in Section 8 once the Product Owner has ratified it as a genuine future direction (Section 4, "Ratified" stage) — mirroring the Future Considerations Register's own "who may add entries" rule (`FUTURE-CONSIDERATIONS.md` §5) but with ratification, not persona proposal alone, as the entry gate, since this register's inclusion criteria (Section 3.1) are explicitly Product Owner-decision-level, not persona-finding-level.

**Who may approve them.** The Product Owner alone, per Project Instructions §10 (final authority for feature scope, priorities, and EBC approval). Team Satvi may analyse and recommend; it may not ratify an item into this register on its own authority.

**How they enter future releases.** An entry never moves directly from this register into a release plan. It is raised for evaluation at the start of a future release's own delivery-planning workstream (the Release 1.4+ equivalent of `EBC-R1.3-001`), alongside the existing Release Backlog, Governance Backlog and Future Considerations Register, per Project Instructions §13/§17. Only the Product Owner's release-inclusion decision at that point promotes it into that release's own Backlog document.

**How they transition into workstreams.** Once promoted into a release's Backlog and subsequently committed, the item receives a workstream number through the same allocation mechanism already used for WS12–WS17 (`EBC-R1.3-GOV-003`) — a Tiger governance card, not an automatic consequence of appearing in this register.

**How rejected items are handled.** The Product Owner may explicitly decline a candidate. Its `Status` changes to **Rejected**, with who declined it and why recorded in one line. The entry is never deleted — this register is a historical record as much as a live one, following the same convention `FUTURE-CONSIDERATIONS.md` §5 already established.

**How superseded items are managed.** If a later decision makes an item moot (e.g. it is absorbed into a broader capability, or an architecture change removes the need for it), `Status` changes to **Superseded**, recording what superseded it.

**Status vocabulary** (mirrors `FUTURE-CONSIDERATIONS.md` §5 for consistency across this project's registers):

- **Identified** — named, not yet Product-Owner-ratified. Not yet eligible for a `PEB-0##` entry.
- **Recommended** — a Tiger-recommended candidate, named in this register, awaiting explicit Product Owner ratification. (The initial state for every entry in Section 8 below, except where noted.)
- **Ratified** — the Product Owner has explicitly approved the item as a genuine future direction.
- **Promoted** — accepted into a specific future release's Backlog; record which release and cross-reference the accepting document.
- **Actioned** — implemented as an approved workstream; record the resulting workstream number.
- **Rejected** — explicitly declined; record who declined it and why.
- **Superseded** — record what superseded it.

**Cross-reference requirement.** Any document that promotes, rejects, or supersedes a PEB entry must cross-reference this register by its `PEB-0##` identifier, and this register must be updated to reflect the new status — the same two-way traceability discipline `RELEASE-1.3-FEATURE-REGISTER.md` §6 already requires between its own tiers.

---

## 8. Initial Candidate List

Per this card's own instruction, the items below are **not** migrated automatically from any source — each is reviewed individually with its own rationale. None below is committed; all require explicit Product Owner ratification before their `Status` can move beyond **Recommended**.

### 8.1 Candidates Recommended (Status: Recommended — Pending Product Owner Ratification)

**PEB-002 — Corporate Journey Planning**
*Rationale:* Named in this EBC's own text as a candidate future capability. No existing repository document (Product Specification, Backlog, Feature Register, or Roadmap) currently names or scopes this capability — confirmed by repository-wide review during this card. Genuinely new: recommended for capture, not yet ratified.
*Relationship:* Would extend Journey Planning's (WS12) enquiry-to-journey model to a corporate/B2B traveller context, which the current Journey Planning scope (per `EBC-R1.3-WS12-001`) does not address.

**PEB-003 — Vendor Negotiation Workspace**
*Rationale:* Named in this EBC's own text. No existing repository document scopes this. Genuinely new.
*Relationship:* Conceptually adjacent to the already-reserved WS16 — Vendor Management workstream. Recommend that whichever future card next scopes WS16 explicitly determine whether this is a sub-capability of WS16 or a distinct future workstream in its own right — an open question, not resolved by this card.

**PEB-004 — Advanced Proposal Versioning**
*Rationale:* Named in this EBC's own text. No existing repository document scopes this specifically (the "Versioning" references found elsewhere in the repository concern unrelated content/architecture versioning, not proposals).
*Relationship:* "Proposal" is already named as a candidate business object for Journey Planning (WS12) itself, per `EBC-R1.3-WS12-001` §7.2. Recommend this be considered during WS12's own Product Discovery as a possible in-scope depth question before being treated as a separate future workstream — flagged as an open question, not resolved here.

**PEB-005 — Journey Collaboration**
*Rationale:* Named in this EBC's own text. The only "Collaboration" references found elsewhere in the repository concern Team Satvi's own internal operating model (persona collaboration), not a traveller- or Workspace-facing product capability. Genuinely new.

**PEB-006 — Document Management**
*Rationale:* Named in this EBC's own text. No repository reference of any kind found. Genuinely new.

**PEB-007 — AI Journey Assistant**
*Rationale:* Named in this EBC's own text. Notably, `docs/02-Product/PRODUCT-ROADMAP.md` already names a generic "AI Assistant" as a longer-horizon roadmap item (alongside CRM Integration, Customer Dashboard, Quote Tracking), with no further detail. This candidate is recommended as the concrete, Journey-Planning-scale articulation of that existing vision-level roadmap bullet — a good illustration of this register's intended Product Vision → Product Evolution Backlog relationship (Section 5) rather than a conflicting or duplicate idea.

### 8.2 Reviewed and Not Added

**Traveller Timeline — reviewed, not recorded as a Product Evolution candidate.**
Named as an example in this EBC's own text, but `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §6.2 already records it as an **approved** Traveller Hub (WS14) capability — "approved but not yet drafted as FRs," tracked as Open Question OQ-018 in the Requirements Traceability Matrix. It is already-ratified, workstream-scoped Product content, not an unratified future-evolution idea, and including it here would misrepresent already-approved scope as merely "recommended." Not added to Section 8.1. This exclusion is disclosed here, per this register's own convention (Section 7) that a reviewed item's disposition is always recorded, never silently dropped — the same discipline `FUTURE-CONSIDERATIONS.md` §5.1 applies to its own closure reviews.

---

## 9. PEB-001 — Journey Amendment

*Status:* **Recommended — Pending Product Owner Ratification**

**Description.** A future capability allowing a traveller's approved Journey to be amended after creation.

**Product Owner decision recorded today (19-Sep-2026), per `EBC-R1.3-GOV-004`'s own text:**

- A Journey Amendment shall **not** create a second Journey.
- Journey Planning shall **never** reopen a booked Journey.
- Journey Amendments belong to the **Journey Workspace** (WS13), not to Journey Planning (WS12).
- Journey Amendments represent a future Product Evolution capability — not current Release 1.3 scope, and not yet a scoped, sequenced, or resourced workstream.

**Why this matters now, while Journey Planning (WS12) is only at governance initiation.** This decision draws a hard boundary between two adjacent workstreams before either is built: Journey Planning (WS12) owns the enquiry-to-approved-journey lifecycle and must never be designed to reopen an already-booked Journey; Journey Workspace (WS13) is where any future amendment capability would live. Recording this now, at the governance layer, prevents a future Journey Planning EBC from inadvertently designing an "amendment" path into WS12's own scope.

**Rationale for `PEB-001` numbering.** This EBC explicitly recommends Journey Amendment become `PEB-001` — the first entry in this newly-established register — pending Product Owner ratification.

**Relationship.** Depends on Journey Workspace (WS13, currently reserved, not started) existing as a workstream before Journey Amendment could itself be scoped as a workstream. No dependency on Journey Planning (WS12) beyond the boundary constraint recorded above.

*Status:* Recommended — Pending Product Owner Ratification.

---

## 10. Cross-Reference Recommendations (Not Applied by This Card)

Per this card's own instruction — "Update only if necessary... Otherwise record recommendations only. No unnecessary edits" — no existing repository document was modified to reference this new register. The following are recorded as recommendations for a future, separate governance card, once the Product Owner has reviewed and ratified this framework:

1. `docs/00-Project-Compass/GOVERNANCE-MAP.md` — add a row for "What's proposed beyond any specific release" pointing to this document, consistent with that map's own stated maintenance rule ("update this map only when a new governance document type is introduced").
2. `docs/00-Project-Compass/DOCUMENT-INDEX.md` — add an index entry under its Governance and Operations section.
3. `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` — no content change needed (Section 6.2 above confirms no overlap), but a future version could add a one-line cross-reference to this register in its own "Related documents" field for discoverability.
4. `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` and `RELEASE-1.3.md` — no change recommended at this time; neither document has any entry corresponding to a PEB candidate, so there is nothing to reconcile yet. This should be revisited only if and when a PEB entry is promoted into a future release.

None of the above was actioned by this card.

---

## 11. Explicitly Out of Scope (Confirmed)

Per this register's own establishing EBC: release planning, prioritisation, implementation, architecture, engineering, UX, QA, estimation, and workstream creation. None of these was performed. No entry in Section 8 has been assigned a target release, a priority, or an effort estimate, and no workstream was opened or renumbered.

---

## 12. Acceptance Criteria Mapping

- [x] Product Evolution Backlog governance framework defined — purpose, scope, ownership, lifecycle, governance, promotion rules (Sections 1, 4, 7).
- [x] Relationship with Release Backlog, Future Considerations Register, Feature Register and Release Tracker defined, with reasoning shown, not merely asserted (Sections 5, 6).
- [x] Product Evolution defined and explicitly distinguished from adjacent categories (Section 2).
- [x] Inclusion/exclusion criteria are objective (Section 3).
- [x] Initial Candidate List produced, with individual rationale per item, none migrated automatically (Section 8).
- [x] `PEB-001` (Journey Amendment) recorded, including today's Product Owner decision (Section 9).
- [x] No overlap with `FUTURE-CONSIDERATIONS.md` — confirmed by direct comparison (Section 6.2).
- [x] No overlap with `RELEASE-1.3-BACKLOG.md` — the temporal/procedural distinction is stated explicitly, not merely asserted (Section 6.1).
- [x] One material scope-boundary finding disclosed rather than silently resolved either way (Traveller Timeline, Section 8.2).
- [x] No repository artefact other than this document and the originating EBC's own record was modified.

---

## 13. Confirmations

- Only this governance register and its originating EBC record were produced.
- No application code, configuration, schema, or Supabase object was created, modified, or removed.
- No Product Discovery, Business Analysis, UX, Architecture, Engineering or QA activity was performed.
- No repository folder was created; this document was placed in the existing `docs/10-Backlog/` folder.
- `RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md`, and `FUTURE-CONSIDERATIONS.md` were reviewed in full or in relevant part but **not edited** — Section 10 records the resulting recommendations instead, per this card's own minimal-edit instruction.

---

*Prepared by Tiger, Programme and Delivery Lead, on behalf of Team Satvi, per `EBC-R1.3-GOV-004`. This register is submitted for Product Owner review and ratification. No entry above is approved, scoped, or authorised for build by virtue of appearing in this document.*
