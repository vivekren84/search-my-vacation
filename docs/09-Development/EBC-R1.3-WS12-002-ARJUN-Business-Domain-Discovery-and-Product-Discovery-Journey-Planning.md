# EBC-R1.3-WS12-002 — Business Domain Discovery & Product Discovery for Journey Planning

**Persona:** Arjun — Product and Business Analyst
**Release:** 1.3
**Workstream:** WS12 — Journey Planning (first Workspace Business Module)
**Phase:** Business Domain Discovery & Product Discovery
**Status:** Discovery Complete — validated against the canonical repository and accepted-ready for Product Owner review
**Date:** 19 September 2026 (original discovery); **updated same day** under the Controlled Re-execution continuation (repository connected, canonical sources validated)

---

## 0. Workspace Readiness Check (Project Instructions §14/§15)

| Check | Result |
|---|---|
| Task type | Business Domain Discovery and Product Discovery (Arjun) — an analysis and documentation activity; the EBC's own Scope explicitly excludes screen design, API design, database design, implementation, UX and Architecture |
| Local repository connection this session | **Connected.** Session bridged to device `viveks-laptop-local`; folder `/Users/viveksophu/Documents/Projects/SearchMyVacation` was granted to this session on request and mounted |
| Repository Root | `/Users/viveksophu/Documents/Projects/SearchMyVacation` — confirmed; `docs/` contains the expected canonical tree (`00-Project-Compass`, `01-Vision-Business`, `02-Product`, `03-ADR`, `04-UX`, `06-Product-Reviews`, `07-Design`, `09-Development`, `10-Backlog`, `11-Sprints`, `14-Legal`, `15-AI-Operating-Model`, `16-Brand-Assets`, `20-Architecture`, `30-Governance`, `40-Retrospectives`, `50-Operations`) |
| **Observation, not a blocker:** the folder names this continuation card's own template listed (`03-Business`, `05-Data`, `06-Engineering`, `07-Testing`, `08-Operations`) do not match the repository's actual top-level folders. This is recorded as an observation for Tiger, not silently reconciled or treated as a defect in either document |
| Branch | `main` |
| Working-tree status | Ahead of `origin/main` by 4 commits (pre-existing, unrelated to this task). Two pre-existing unstaged modifications (`docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md`, `docs/10-Backlog/RELEASE-1.3.md`) and a set of pre-existing untracked files (mostly prior sessions' screenshots and reports under `Claude outputs/`, plus three untracked `docs/09-Development/` files) were present **before** this task began and were not created or modified by this continuation |
| Repository copy of this discovery document | **Found**, already present in the repository as an untracked file: `docs/09-Development/Ebc r1.3 ws12 002 arjun business domain discovery and product discovery journey planning.md` (327 lines). Compared against the version published to the Claude Project — **content matches**, confirming this is the Product Owner's copy of the original discovery output, not a divergent version |
| **Observation, not corrected here:** this repository filename does not follow the Project's established `EBC-R1.3-WS12-002-ARJUN-...` naming convention (lower case, spaces instead of hyphens). Per this continuation's own instruction ("Do not recreate the document. Do not overwrite the document. Continue from the existing repository version."), this file is edited in place at its existing path and name, not renamed — renaming was not requested and is outside this card's authorised scope. Flagged for Tiger to decide whether a rename is warranted |
| Canonical Journey Planning source documents | **Read directly and in full this pass**, closing the single largest gap from the original execution: `docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md` (Product Owner Review Notes, Status: Product Owner Approved — the primary source for this module) and the Journey Planning-relevant sections of `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` (§6.3, §7.3–§7.12, §9, §10.1). Also cross-checked against `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md` (§7.10–§7.11, for Task/Follow-up field-level detail carried forward unchanged) |
| Branch / commit / push this pass | No branch created or switched. The repository file below was edited in place via the connected-device shell. No commit or push was performed — per Project Instructions §26, committing/pushing requires explicit authorisation, which this card does not grant |

**Original material limitation — now resolved.** The prior execution of this EBC could not read `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` or the Journey Planning Module Review in full, because no local repository folder was connected, and relied instead on cross-references found in `EBC-R1.3-WS11-006` (Rad's engineering plan). With the repository now connected and both documents read directly, every fact those cross-references pointed to has been verified against its own primary source, and several previously-Open items are now resolved with direct citations. See Section 20 for the full resolution log.

---

## 1. Mandatory Review — What Was Found in the Governance and Product Record

Per Project Instructions §17 (Source of Truth) and §35 ("do not ask unnecessary questions when evidence exists"), the following was reviewed before drafting anything. Items marked **(read in full this pass)** were not directly accessible during the original execution and are the source of this continuation's updates.

- **`EBC-R1.3-WS12-001`** (Tiger, Journey Planning Workstream Initiation) — the direct predecessor to this card. Its Business Vision, workstream-level scope statement, candidate object list (Lead, Traveller, Journey, Planning Task, Follow-up, Proposal, Activity, Note — explicitly not a data model), and stakeholder table are treated as primary source material, exactly as that card itself instructs.
- **`docs/02-Product/reviews/PO-REVIEW-03-Journey-Planning.md`** **(read in full this pass)** — the Product Owner Review Notes for the Journey Planning module specifically: Status "Product Owner Approved," prepared by Tiger, reviewed with the Product Owner (Vivek). This is the single richest and most authoritative primary source for this module and is used extensively below, always cited by section.
- **`docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`** **(read in full this pass, Journey Planning-relevant sections)** — §6.3 (module narrative and FR summary), §7.3 (Journey Planning Record object definition), §7.4 (Journey object, corrected), §7.10–§7.12 (Task, Follow-up, Notification), §9 (Business Rules, including the newly-formalised BR-010 through BR-019), §10.1 (Phase 1 Journey Lifecycle, PD-JP-005, full seven-stage table). Produced under `EBC-R1.3-WS3-004` Stage 4, dated 13 September 2026, consolidating the genuine `PO-REVIEW-03` through `PO-REVIEW-09` Product Owner Review workshops.
- **`docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md`** **(§7.10–§7.11 read this pass)** — the original nine-module Workspace specification; Task and Follow-up's field-level definitions are stated as "Unchanged from v1.0" in the v2.0 update, so v1.0's own text is the current, still-valid source for those two objects' detail.
- **`EBC-R1.3-WS3-002`/`WS3-003`** (Arjun, SMV Workspace Product Specification & RTM, v1.0) — general Workspace-wide business-object and business-rule vocabulary, superseded for Journey Planning specifically by the v2.0 update above.
- **`EBC-R1.3-WS3-004A`/`WS3-004B`/`WS3-004`** (Arjun, Product Owner Review Baseline Handover → Governance Consistency Review → Impact Assessment → Stage 4 Consolidated Baseline Update) — the chain of cards that produced the v2.0 baseline; confirms `PO-REVIEW-03` through `PO-REVIEW-09` as genuine Product Owner review evidence, distinct from the earlier, correctly-rejected `EBC-R1.3-WS3-004` escalation that had no corroborating source.
- **`EBC-R1.3-WS3-CLOSURE`** (Arjun, Baseline Index and Workstream Closure Recommendation) — confirms the v2.0 baseline was accepted; four Open Questions (OQ-018 through OQ-021) explicitly carried forward.
- **`EBC-R1.3-WS11-006`** (Rad, Engineering Planning and Implementation Strategy) — retained as corroborating evidence of technical-scope naming (`workspace_journey_planning_records`, `workspace_proposal_versions`, `workspace_vendor_quotations`, `workspace_discovery_notes`), now cross-checked against, rather than substituting for, the canonical business sources above.
- **`docs/02-Product/JOURNEY-PASSPORT-v1.0.md`**, **`docs/09-Development/EBC-003-JOURNEY-DIRECTOR.md`**, **`docs/02-Product/JOURNEY-SYNOPSIS-AND-REFERENCE-CONTRACT-v1.0.md`** — the already-approved, already-live public-facing product that generates the enquiry Journey Planning receives.
- **`FCR-R1.3-001`** (Future Considerations Register) — checked; no Journey-Planning-specific deferred item exists.

No fact below is asserted without a source. Every statement is labelled **Confirmed**, **Confirmed indirect**, **Proposed (Arjun)**, **Assumption**, or **Open Question**, per this Project's own established convention.

---

## 2. Executive Summary

Journey Planning did not need to be discovered from a blank page. A substantial, Product-Owner-approved business baseline for it already exists — produced through a genuine Product Owner Module Review workshop (`PO-REVIEW-03-Journey-Planning.md`, Status: Product Owner Approved) and consolidated into `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`. This discovery's job was to surface, organise and present that already-approved business domain in the Discovery format this card specifies — and, in this continuation pass, to verify every part of that presentation directly against the canonical documents themselves, now that repository access is available.

**What is now Confirmed (direct citation, not cross-reference):** Journey Planning is the operational module responsible for discovering, qualifying, designing and commercialising a traveller's proposed journey before any operational commitment is made (`PO-REVIEW-03` §2). It ingests a traveller enquiry (principally from the live public Journey Passport / Journey Director product), lets a Workspace User claim and work it through a **seven-stage, named, owner-driven lifecycle** (Lead Created → Discovery → Planning → Proposal Shared → Revision → Decision → Closed, `PD-JP-005`), capture Discovery Notes and Activities, prepare one or more Proposal Versions (each of which may carry one or more Vendor Quotations, kept permanently distinct — `BR-011`), and — on the traveller's decision — convert the record, exactly once and irreversibly, into a Journey (`BR-012`). A **partial-unique-index business rule is now Confirmed by name and exact text**: one Journey Planning Record per destination or destination region per Traveller (`BR-010`/`PD-JP-001`). Records are archived, never permanently deleted (`PD-JP-007`, `BR-007` as rewritten).

**What remains genuinely open, and is not invented here even now:** whether a Workspace User may create a Journey Planning Record manually, in addition to the confirmed automatic ingestion path (no document reviewed, including the two now read in full, addresses this either way); the exact relationship between the newly-separated Proposal Version/Vendor Quotation pair and the historical "Quotation" business object (`OQ-020`, a genuinely still-open item on the Product Specification's own register, not something this discovery can resolve by inference); and whether the Generic Ownership Model's Claim/Assign/Reassign mechanism, confirmed for Journey Planning, extends identically to other future Workspace Business Modules (`OQ-022`, also still open in the source document itself). Section 20 gives the full, item-by-item resolution log.

---

## 3. Business Domain Overview

Search My Vacation's business divides, by its own stated architecture (`EBC-R1.3-WS12-001` §3, reaffirmed by `PO-REVIEW-03` §2 and §12), into two halves joined by Journey Planning:

```
Traveller Acquisition  →  Journey Planning  →  Journey Execution
```

**Traveller Acquisition** is the already-built, already-live public product: a visitor arrives at the website, completes the Journey Passport (a discovery conversation, not a booking form — `JOURNEY-PASSPORT-v1.0.md` §2), receives deterministic Journey Director recommendations, and — at the point they choose to continue toward a human conversation — becomes a **Lead**, persisted today in the production `journey_passport_leads` table.

**Journey Execution** is everything that happens once a journey is approved: the Journey Workspace (operational execution — confirmed by `PO-REVIEW-03` §11/§12 to begin only after Journey Planning hands off a confirmed record), Itinerary Studio, and Vendor Management. None of this is in scope for this card.

**Journey Planning is the bridge**, and is now Confirmed directly rather than indirectly: `PO-REVIEW-03` §12 states plainly that "Journey Planning establishes the operational bridge between Traveller Hub and Journey Workspace. It is responsible for commercial planning but deliberately avoids managing confirmed journeys. This separation creates a clear distinction between planning activities and operational journey execution, reducing complexity and improving long-term maintainability of the Workspace."

---

## 4. Business Vision

**Confirmed**, and now reinforced by direct citation of the approved Module Vision (`PO-REVIEW-03` §2), which restates and sharpens `EBC-R1.3-WS12-001` §3/§5 rather than contradicting it:

> "Journey Planning is the Workspace capability responsible for discovering, qualifying, designing and commercialising a traveller's proposed journey before any operational commitments are made. The module supports the complete pre-confirmation planning lifecycle from the initial enquiry through proposal preparation, revisions and commercial decision. Journey Planning is an iterative planning workspace rather than a booking management tool." (`PO-REVIEW-03` §2)

The approved Business Purpose (`PO-REVIEW-03` §3) is: understand traveller requirements, coordinate planning activities, manage proposal iterations, coordinate vendor quotations, guide commercial discussions, and ultimately convert a qualified proposal into a confirmed Journey — supporting collaborative planning while preserving the complete planning history.

**Proposed (Arjun) — why this matters commercially, not just operationally:** every one of SMV's stated business principles ("build trust before selling," "recommend what suits the traveller rather than what is easiest to sell," "preserve continuity between inspiration, Journey Passport, Journey Director and human follow-up" — Project Instructions §1) is made or broken at exactly the handoff Journey Planning owns. This reading is offered as Arjun's own synthesis and should be confirmed or corrected by the Product Owner rather than treated as already-approved — it is not itself stated in `PO-REVIEW-03`.

---

## 5. Current vs. Future Operating Model

**Confirmed, by absence of contrary evidence, and unchanged by this continuation:** there is no current Journey Planning operating model to describe inside the Workspace, because the Workspace's first operational business module has not yet been built. Today, a Lead exists only as a `journey_passport_leads` database row with no Workspace-side ownership, qualification, or proposal mechanism.

The Product Owner's own guidance on the original card remains the standing instruction for how to read this section: *"I want Arjun to think like a consultant embedded within SearchMyVacation, observing how the business should operate rather than how software should behave. If the discovery concludes that the ideal business process differs from today's practice, that should be documented as a deliberate future-state operating model."*

**Current-state operating model (Proposed (Arjun), unchanged this pass — no document, including the two now read in full, describes SMV's actual current manual process in its own words):** a Lead is created automatically by the public Journey Passport flow, a best-effort notification email is sent, and everything from that point forward happens outside any system this Project has visibility into.

**Future-state operating model (now Confirmed direct):** every one of those same activities — qualification, communication, follow-up, proposal preparation, vendor quotation gathering, and conversion to an approved Journey — happens inside the Workspace, against a single owned, auditable Journey Planning Record, moving through the seven-stage, owner-driven lifecycle set out in Section 8. This is the Product Owner's approved target state (`PO-REVIEW-03`, Status: Product Owner Approved, "No outstanding Product Owner questions remain for this module").

---

## 6. Stakeholder Analysis

Building on, and specifically not silently overwriting, `EBC-R1.3-WS12-001` §6's table:

| Stakeholder | Role in Journey Planning | Nature of Interest |
|---|---|---|
| **Workspace Administrator** (internal) | Configures and oversees Journey Planning usage; per the Generic Ownership Model, holds Reassign authority over records other users have claimed | Needs the module to fit inside the RBAC/navigation/dashboard shell WS11 already delivered, and needs visibility to intervene when a record is stalled or misassigned |
| **Workspace User** (internal) | Primary operator: claims Journey Planning Records, communicates with travellers, records Discovery Notes and Activities, prepares Proposal Versions (and any associated Vendor Quotations), manages Follow-ups and Tasks, and converts an approved record into a Journey | Needs a low-friction, single-home tool covering the full enquiry-to-journey span named in Section 7 |
| **Traveller** (external) | Subject of the lifecycle; already gave SMV a rich discovery profile via the Journey Passport before ever becoming a Journey Planning Record | Needs continuity — the SMV principle that the Workspace User's first contact should not feel like starting over |
| **Vendors / DMCs / Tour Operators** | **Now Confirmed direct (upgraded from Proposed (Arjun) in the original pass).** `PO-REVIEW-03` §9 ("Cross Module Relationships") states Vendor Management's role toward Journey Planning is to "provide vendor quotations and commercial inputs" — it does not describe, anywhere in the approved review, a vendor-facing interface, portal or account inside Journey Planning. Combined with `PD-JP-003`'s definition (a Vendor Quotation is commercial information *received from* a vendor, i.e. entered by a Workspace User, not submitted by the vendor directly), the original pass's inference is now directly evidenced: **Vendors have no direct interface or touchpoint inside Journey Planning.** This closes `EBC-R1.3-WS12-001` §6.3's original open question | No direct interest in this module; their operational relationship (Active/Inactive status, Preferred Partner designation, PD-VM-003/BR-016) is entirely owned by Vendor Management |
| **Product Owner (Vivek)** | Final decision and release authority; personally conducted the `PO-REVIEW-03` Module Review workshop that produced the approved baseline this discovery draws on | Owns every remaining open item in Section 14/20 |

### 6.1 Persona Stakeholders (Internal to Delivery)

Confirmed, unchanged from `EBC-R1.3-WS12-001` §6.1: Tiger, Arjun (this card), Sophie, Archie, Rad and Keerthi each own a distinct discipline across WS12's lifecycle; none may approve another's work (Project Instructions §2).

---

## 7. Business Capability Map

Combining `EBC-R1.3-WS12-001` §4.3's business-objective-level scope statement with `PO-REVIEW-03`'s module-specific detail, now Confirmed direct throughout:

| Capability | Confirmed by | Notes |
|---|---|---|
| **Lead Intake** | `EBC-R1.3-WS12-001` §4.3; `PO-REVIEW-03` §4 (Journey Planning Record "represents a single planning effort for one Traveller for one destination or destination region") | Automatic ingestion confirmed. Manual creation by a Workspace User is still **not** confirmed either way in any evidence read, including the two canonical documents now read in full — genuinely still Open (Section 20) |
| **Traveller Qualification** | `PO-REVIEW-03` §3, §10.1 stage 2 ("Discovery — the team is understanding traveller requirements") | Now maps cleanly onto the confirmed lifecycle's second stage |
| **Ownership & Assignment** | `PO-REVIEW-03` §7 — Claim / Assign / Reassign, each explicitly defined | Claim: a Workspace User voluntarily assumes responsibility for an unowned record. Assign: an authorised Workspace User allocates responsibility to another. Reassign: responsibility transfers from one Workspace User to another. Ownership is independent of lifecycle status |
| **Traveller Communication** | `EBC-R1.3-WS12-001` §4.3 | Channel (in-Workspace messaging vs. logged external communication) still not confirmed by any source — genuinely Open |
| **Requirement Capture / Discovery** | `PO-REVIEW-03` §6 ("Planning Activities": Discovery Notes, Activities, Proposal Versions, Vendor Quotations, Follow-ups, Tasks); §6 ("Traveller Requirements": Travel Dates, Date Flexibility, Duration, Budget, Companions, Special Requests, Flight Preferences) | The Product Owner specifically approved capturing flight preferences (e.g. non-stop, preferred transit points); explicitly did **not** consider "purpose of travel" essential for Release 1.3 (`PO-REVIEW-03` §5, PD-JP-006) |
| **Follow-up / Task Management** | `PO-REVIEW-03` §6 (Follow-ups and Tasks both listed as Planning Activities); `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §7.10–§7.11 (Task, Follow-up objects, unchanged from v1.0) | **Now resolved** — see Section 10; Task and Follow-up are confirmed, pre-existing Workspace objects that Journey Planning Records use, not a separate "Planning Task" object |
| **Proposal Preparation** | `PO-REVIEW-03` §5 (PD-JP-002); `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` BR-011 | Versioned, not edited in place; exactly one version is current, prior versions retained for historical reference |
| **Vendor Quotation Management** | `PO-REVIEW-03` §5 (PD-JP-003) | Vendor Quotations (received from vendors) and Proposal Versions (created by SMV, traveller-facing) are kept permanently distinct — `BR-011` |
| **Approval & Conversion** | `PO-REVIEW-03` §9, §10.1 stage 7; `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` BR-012 | One-way and atomic; a Journey Planning Record converts to exactly one Journey; Workspace Users cannot create a Journey directly |
| **Record Retention / Archival** | `PO-REVIEW-03` §5 (PD-JP-007); v2.0 spec §9 BR-007 (rewritten) | Planning Records are never deleted as part of normal operations; closed records remain available for historical and analytical purposes |

---

## 8. Business Lifecycle

The Product Owner's original guidance on this card supplied an illustrative nine-step chain and asked it be "validated and refined based on discovery." **This is now done, with the exact approved stage names transcribed verbatim from the canonical source** (`PO-REVIEW-03` §5, PD-JP-005; identical text in `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §10.1):

| Stage | Business Intent (verbatim, `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §10.1) |
|---|---|
| 1. **Lead Created** | A new expression of interest exists. |
| 2. **Discovery** | The team is understanding traveller requirements. |
| 3. **Planning** | Requirements are being translated into a proposal. |
| 4. **Proposal Shared** | A Proposal Version has been sent to the Traveller. |
| 5. **Revision** | The proposal is being iterated based on traveller feedback. |
| 6. **Decision** | The Traveller is deciding whether to proceed. |
| 7. **Closed** (Confirmed / Lost / Archived) | The Journey Planning Record reaches a final outcome: Confirmed (converts to a Journey), Lost, or Archived. |

**Confirmed direct: stage transitions are deliberate, not automatic.** `PO-REVIEW-03`'s own governance decisions (§8) require Planning Status, Ownership, Proposal Versions and Vendor Quotations to remain separate concepts, never combined into a single status field — consistent with the v2.0 Specification's independent statement that progressing a record to its next stage is a deliberate action taken by its Owner, not a free-text status edit (FR-JP-05).

**Mapping the original illustrative nine-step chain onto the seven approved stages (Proposed (Arjun), now possible with the real names in hand):**

| Original illustrative step | Maps to approved stage |
|---|---|
| Traveller Enquiry | *(pre-Journey-Planning — this is the Journey Passport, Section 3)* |
| Lead Created | 1. Lead Created |
| Lead Qualification | 2. Discovery |
| Traveller Consultation | 2. Discovery |
| Requirements Captured | 3. Planning |
| Destination Research | 3. Planning |
| Proposal Preparation | 3. Planning → 4. Proposal Shared |
| Proposal Review | 5. Revision |
| Traveller Approval | 6. Decision |
| Journey Created | 7. Closed (Confirmed) → conversion to Journey |

This mapping is Proposed (Arjun) rather than itself Product-Owner-approved — the original nine-step chain was always illustrative, and the Product Owner approved the seven-stage breakdown directly, not a mapping between the two. It is offered to help WS12-003 reconcile the two documents, not as a new approved artefact.

**"Journey Created" → "Journey Workspace"** remains Confirmed and is further reinforced: `PO-REVIEW-03` §9 states plainly that Journey Workspace "receives confirmed planning records upon successful conversion," and §11/§12 confirm Journey Planning "creates confirmed Journeys" while deliberately avoiding management of confirmed journeys itself.

**"Can a Journey return to planning?"** — **Confirmed: no.** `BR-012` (v2.0 spec §9) states a Journey may be created only by converting a confirmed Journey Planning Record; Workspace Users cannot create a Journey directly, and no reverse transition is described anywhere in the evidence.

---

## 9. Business Process Narrative

**Proposed (Arjun), synthesised from confirmed evidence, updated this pass to reflect the now-Confirmed stage names and requirement fields:**

A traveller completes the Journey Passport on the public website, is shown deterministic Journey Director recommendations, and — at the point of human handoff — SMV already has a rich, structured discovery profile for them, persisted as a Lead. Under the approved Journey Planning design, that Lead becomes a **Journey Planning Record** — one Traveller, one destination or destination region (`PD-JP-001`); a second destination requires a second record, not a second line item on the same one.

The record begins in the **Lead Created** stage, unowned. A Workspace User **claims** it from the planning queue, becoming its owner under the Generic Ownership Model, and the record deliberately advances to **Discovery** as the owner begins understanding the traveller's requirements — destination, travel dates, date flexibility, duration, budget, companions, special requests and flight preferences (`PO-REVIEW-03` §6; "purpose of travel" was explicitly not required for Release 1.3). The owner records **Discovery Notes** and logs **Activities** as the conversation with the traveller continues. As requirements firm up, the record moves to **Planning**, where they are translated into a proposal; the owner prepares a **Proposal Version** — explicitly versioned, so a later revision creates a new, traceable version rather than overwriting the one already shown — and may gather one or more **Vendor Quotations** from vendors already known to the separate Vendor Management module, kept permanently distinct from the Proposal Version itself (`BR-011`). Once shared, the record moves to **Proposal Shared**, then, as the traveller responds, cycles through **Revision** as needed, and finally reaches **Decision**. If, at any point, the owner needs help or is unavailable, an Administrator can **reassign** the record — ownership is a workflow control, not a permanent claim, and is independent of the record's lifecycle stage.

A Decision resolves the record to **Closed**, with one of three outcomes: **Confirmed** (the record converts, in one atomic, irreversible action, into a **Journey** — `BR-012` — handed off entirely to the Journey Workspace module), **Lost**, or **Archived**. In every outcome, the Journey Planning Record itself is never deleted (`PD-JP-007`); it is retained as the permanent record of how that outcome was reached.

---

## 10. Business Object Catalogue

Definitions only, per the EBC's own instruction ("No data model shall be produced"). Confidence levels are updated throughout this section following direct verification against the canonical sources.

| Object | Definition | Confidence |
|---|---|---|
| **Journey Planning Record** | The central operational object of this module — the Workspace-side representation of a single planning effort for one Traveller and one destination or destination region (`PD-JP-001`), from ingestion through qualification, consultation and proposal, until converted into a Journey or Closed as Lost/Archived. Owned by exactly one Workspace User at a time under the Generic Ownership Model; moves through the seven-stage lifecycle in Section 8; never permanently deleted. Identity fields (`PO-REVIEW-03` §6): Planning ID, Traveller, Destination/Region, Owner, Created Date, Current Status | **Confirmed** (`PO-REVIEW-03` §4, §6) |
| **Traveller** | A person SMV has a relationship with, owned by Traveller Hub, not created by Journey Planning; Journey Planning references but does not own the Traveller (`PD-JP-004`) | **Confirmed** (`PO-REVIEW-03` §5) |
| **Proposal Version** | A specific, versioned, traveller-facing proposal prepared by Search My Vacation against a Journey Planning Record. Multiple versions may exist; exactly one is the current active proposal; prior versions remain available for historical reference (`PD-JP-002`) | **Confirmed** (`PO-REVIEW-03` §5) |
| **Vendor Quotation** | Commercial information received *from* a vendor, kept permanently distinct from Proposal Versions and never merged into one record type (`PD-JP-003`, `BR-011`). **`OQ-020` remains genuinely open** (confirmed still-open in `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §14 itself, not merely carried forward by this discovery): whether the historical v1.0 "Quotation" object (§7.8, "a priced proposal sent to a Traveller") is the same concept as Proposal Version rather than Vendor Quotation. This discovery does not resolve `OQ-020` — it is the source document's own open item | **Confirmed** for the object itself; relationship to legacy "Quotation" — **Open (`OQ-020`)** |
| **Discovery Note** | A note capturing what a Workspace User learns during consultation with a traveller against a specific Journey Planning Record, listed as one of six named "Planning Activities" in `PO-REVIEW-03` §6 | **Confirmed** (`PO-REVIEW-03` §6) |
| **Activity** | **Resolved this pass — no longer conflated with Discovery Note.** `PO-REVIEW-03` §6 lists "Activities" as a Planning Activity **distinct from** Discovery Notes ("Discovery Notes, Activities, Proposal Versions, Vendor Quotations, Follow-ups, Tasks" — six separate items, not five). Its existence and distinctness from Discovery Note are now Confirmed; its own field-level definition is not given in either canonical document read and is left to Business Analysis (WS12-003) to define, not invented here | **Confirmed as a distinct, named concept**; field-level definition — Open, deferred to WS12-003 |
| **Task** *(resolves "Planning Task" from `EBC-R1.3-WS12-001` §7.2)* | A discrete unit of operational work, either system-generated or manually created ("Hybrid task creation," `BR-008`), tracked to completion. Key fields (`SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md` §7.10, unchanged in v2.0): description, linked Journey/Lead (optional), Owner, due date, status, origin (System/Manual). States: Open → Completed (or Archived). This is a pre-existing, Workspace-wide business object — not a Journey-Planning-specific one — that Journey Planning Records use as one of their six Planning Activities (`PO-REVIEW-03` §6) | **Confirmed** — resolves the prior Open Question |
| **Follow-up** | A scheduled, structured future touchpoint with a Traveller, distinct from a Task by always being traveller-directed and always carrying a due date and purpose ("Structured follow-ups," `BR-009`). Key fields (v1.0 §7.11, unchanged in v2.0): linked Traveller, linked Journey (optional), purpose, due date, Owner, status. States: Scheduled → Completed/Missed. Also a pre-existing, Workspace-wide object, listed among Journey Planning's six Planning Activities | **Confirmed** — resolves the prior Open Question |
| **Journey** | Created exactly once, atomically and irreversibly, by converting an approved Journey Planning Record (`BR-012`). Owned by the downstream Journey Workspace module from the moment of creation; identity fields include Journey ID, Traveller, Journey Planning Reference, Owner, Destination, Travel Dates, Current Status (v2.0 spec §7.4) — out of this card's scope to define further | **Confirmed** |

**Note on method:** every object above now traces directly to `PO-REVIEW-03` (Product Owner Approved) or `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md`, both read in full this pass. Nothing is invented to fill a gap; where the evidence itself is genuinely silent (Activity's field-level shape; manual creation of a Journey Planning Record), the gap is named as Open rather than closed by assumption, per Project Instructions §4.

---

## 11. Business Rules Catalogue

All rules below are now Confirmed by direct citation of `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` §9 and/or `PO-REVIEW-03` §5/§8, replacing the original pass's indirect sourcing.

| Rule | Statement | Source |
|---|---|---|
| **BR-010 — Planning Record uniqueness** | One Journey Planning Record per destination or destination region per Traveller. A second destination requires a second record | `PD-JP-001`; **now Confirmed direct — resolves the prior Open Question.** The candidate meaning flagged (but not asserted) in the original pass is exactly this rule; it is confirmed here via the genuine `PO-REVIEW-03`/v2.0-spec evidence chain, not via the earlier, correctly-rejected `EBC-R1.3-WS3-004` escalation |
| **BR-011 — Proposal Version / Vendor Quotation separation** | Proposal Versions (traveller-facing, created by Search My Vacation) and Vendor Quotations (commercial information received from vendors) are distinct and never merged into one record type | `PD-JP-003` |
| **BR-012 — One-way, atomic conversion to Journey** | A Journey may be created only by converting a confirmed Journey Planning Record; Workspace Users cannot create a Journey directly. No reverse transition exists | `PD-JW-001` |
| **BR-013 — Phase boundary** | Commercial/proposal activity stays in Journey Planning; a Journey (Journey Workspace) begins only after commercial confirmation. Minor post-confirmation changes stay in the same Journey; a material scope change requires a new Journey Planning Record rather than modifying the existing Journey | `PD-JW-002`, `PD-JW-003`, `PD-JW-004` |
| **Generic Ownership Model** (Claim / Assign / Reassign) | Ownership represents operational responsibility and remains independent of lifecycle status | `PO-REVIEW-03` §7 |
| **Separation of business concepts** | Planning Status, Ownership, Proposal Versions and Vendor Quotations are maintained as separate concepts and shall not be combined into a single status field | `PO-REVIEW-03` §8 |
| **Archival, not deletion** | Journey Planning Records (along with Journeys, Traveller History, Proposal History, Vendor History and Destination Profiles) support archival only; permanent deletion is restricted to administrative/configuration data. Rewrites the original v1.0 BR-007 specifically because it conflicted with `PD-JP-007` | v2.0 spec §9 (BR-007, rewritten); `PD-JP-007` |
| **BR-016 — Designation independent of lifecycle** | An operational designation (e.g., Preferred Partner) is independent of lifecycle state; changing one never changes the other | `PD-VM-003` |
| **Vendor lifecycle terminology** | Vendors use Active/Inactive status terminology, not "Deactivated" | v2.0 spec §7.7 |

---

## 12. Scope Definition

### 12.1 In Scope for Journey Planning (business-objective level)

- Lead intake (automatic, Confirmed; manual, still Open — Section 20)
- Traveller qualification
- Ownership, claiming, assignment and reassignment of records
- Traveller communication (channel not yet confirmed)
- Discovery/requirement capture, including Discovery Notes and Activities
- Proposal preparation, including versioning
- Vendor quotation gathering in support of a proposal
- Follow-up and Task management (via the shared, pre-existing Follow-up and Task objects)
- Approval and one-way conversion into a Journey
- Archival retention of completed/lost records

### 12.2 In Scope for This Discovery Card (WS12-002)

Per this EBC's own instruction: business purpose, entry points, business lifecycle, business capabilities, stakeholders, business objects (definitions only), business rules, and scope boundaries (included/excluded/deferred/future release) — all delivered above.

---

## 13. Out-of-Scope Items

Confirmed directly from this EBC's own Scope section, and respected throughout this document and this continuation:

- No screen design, wireframe, or interaction specification
- No API design
- No database design or data model (Section 10 is definitions only, explicitly not a schema)
- No implementation or code of any kind
- No UX work of any kind
- No Architecture work of any kind (this discovery draws on Archie-adjacent and Rad-adjacent evidence as *sources*, but makes no architecture or engineering decision itself)
- No Business Analysis or Functional Requirement drafting (deferred to WS12-003)
- No repository artefact modified other than this one discovery document

---

## 14. Risks & Assumptions

### 14.1 Risks

| # | Risk | Status this pass |
|---|---|---|
| R-1 | Canonical Journey Planning source documents could not be read in full | **Resolved.** Repository connected; both documents read in full this pass |
| R-2 | `OQ-020` (Proposal Version vs. Vendor Quotation vs. the historical "Quotation" object) is unresolved | **Still open** — confirmed as a genuinely open item in the source document itself (v2.0 spec §14), not something this discovery can close by inference |
| R-3 | Whether Workspace Users may manually create a Journey Planning Record is unconfirmed | **Still open** — no document read, including both canonical sources in full, addresses this either way |
| R-4 | The precise business meaning of `BR-010` was unconfirmed | **Resolved.** `BR-010` = "one Journey Planning Record per destination or destination region per Traveller" (`PD-JP-001`), now Confirmed direct (Section 11) |
| R-5 | The scope of the Generic Ownership Model across other future Workspace Business Modules is unconfirmed (`OQ-022`) | **Still open** — confirmed as open in the v2.0 spec itself (§8.1); Journey Planning's own use of Claim/Assign/Reassign is Confirmed, but its uniformity across other modules is not |
| R-6 | No document describes SMV's actual current (pre-Workspace) manual process for working a Lead | **Still open** — neither canonical document, now read in full, describes current manual practice; this remains a genuine evidence gap, not an oversight of this discovery |

### 14.2 Assumptions

- **A-1.** This discovery is a synthesis and verification of the already-approved Release 1.3 Product Baseline for Journey Planning, presented in the Discovery format this card specifies, rather than a from-zero re-interview of the business — because a substantial, genuinely Product-Owner-approved baseline for this exact module exists and is now directly verified. This is a material framing choice, disclosed here, and should be confirmed by the Product Owner as the intended reading of this card before WS12-003 proceeds on that basis.
- **A-2.** The eight candidate objects named in `EBC-R1.3-WS12-001` §7.2 (Lead, Traveller, Journey, Planning Task, Follow-up, Proposal, Activity, Note) have, in the approved baseline, resolved as follows: Lead → Journey Planning Record; Planning Task → Task (pre-existing, Workspace-wide object); Follow-up → Follow-up (same, pre-existing object); Proposal → Proposal Version; Activity → confirmed as distinct from Discovery Note, but its own field-level shape not yet defined; Note → Discovery Note. Traveller and Journey remain as named. This mapping is now Confirmed for six of the eight candidates and Proposed (Arjun) only for the Note→Discovery Note naming inference specifically (the objects' existence is Confirmed; the exact terminology mapping from the original v0 candidate list is Arjun's own reasonable inference, not itself stated in either canonical document).

---

## 15. Product Discovery Recommendations

1. ~~Close the source-access gap before WS12-003 begins.~~ **Done this pass.**
2. **Resolve `OQ-020`** (Proposal Version vs. Vendor Quotation vs. the historical "Quotation" object) explicitly before Business Analysis drafts any Functional Requirement touching either object. This is a genuinely open item in the source specification itself, not something Discovery can resolve.
3. **Confirm whether manual Journey Planning Record creation is in scope**, alongside the confirmed automatic ingestion path. Neither canonical source addresses this.
4. ~~Confirm the exact business rule `BR-010` enforces.~~ **Done this pass** — see Section 11.
5. ~~Record the vendor-touchpoint resolution formally.~~ **Done this pass** — Section 6 now cites direct evidence ("no direct vendor-facing interface inside Journey Planning"); recommend Tiger/the Product Owner ratify this as a formal scope-definition line item in WS12-003.
6. ~~Confirm the fate of Planning Task, Follow-up and Activity.~~ **Done this pass** — Task and Follow-up resolve to existing, pre-defined Workspace objects; Activity is confirmed distinct and named but not yet field-defined (recommend WS12-003 define its fields alongside the approved Functional Requirements).
7. **Resolve `OQ-022`** (Generic Ownership Model's uniformity across other future Workspace Business Modules) — out of this card's scope to resolve, since it concerns modules beyond Journey Planning, but flagged so WS12-003 does not scope Journey Planning's own ownership requirements more narrowly or broadly than the eventual cross-module answer.
8. **Proceed to drafting the approved-by-count Journey Planning Functional Requirements** (30 Functional Requirements, all Must Have, per `PO-REVIEW-03` §10 and v2.0 spec §6.3) — this discovery deliberately does not draft any FR wording itself.
9. **Consider Tiger's filename observation** (Section 0): the repository copy of this document does not follow the Project's established naming convention. Recommend a deliberate decision (rename or leave as-is) rather than leaving it unaddressed.

---

## 16. Acceptance Criteria — Confirmed

Per this EBC's own Acceptance Criteria list, now fully satisfied:

- [x] Business domain understood (Sections 3–9)
- [x] Business purpose documented (Section 4)
- [x] End-to-end lifecycle documented (Section 8) — **all seven stage names now Confirmed direct, no longer limited**
- [x] Stakeholders identified (Section 6), including direct-evidence resolution of the vendor-touchpoint question
- [x] Business capabilities identified (Section 7)
- [x] Business objects catalogued (Section 10) — Task and Follow-up resolved to Confirmed; Activity resolved as distinct and Confirmed to exist (field-level detail deferred to WS12-003, not invented)
- [x] Business rules documented (Section 11) — `BR-010` now Confirmed direct
- [x] Scope boundaries defined (Section 12)
- [x] No UX performed
- [x] No Architecture performed
- [x] No Engineering performed
- [x] No Business Analysis performed
- [x] Repository verified before work commenced (Section 0)
- [x] Repository copy reviewed and confirmed to match the Claude Project version (Section 0)
- [x] Canonical documents reviewed directly (Section 0, Section 1)
- [x] Open Questions resolved where evidence exists; genuinely unresolved items left open rather than invented (Section 20)

---

## 17. Repository Impact

| Expected by EBC | Actual |
|---|---|
| Create/continue `docs/09-Development/EBC-R1.3-WS12-002-ARJUN-...md` | The repository already held a Product-Owner-placed copy at `docs/09-Development/Ebc r1.3 ws12 002 arjun business domain discovery and product discovery journey planning.md` (non-canonical filename — Section 0 observation). Per this continuation's explicit instruction, that existing file was **edited in place** with this updated content; it was not recreated, renamed, or replaced with a new file |
| No other repository artefact modified | Confirmed — no other file was read for modification, written, or staged. `git status` was inspected read-only; the pre-existing unstaged modifications and untracked files noted in Section 0 were not touched by this continuation |
| Commit / push | Not performed. Per Project Instructions §26, this requires explicit authorisation, which this card does not grant |

---

## 18. Confirmations

- Only this discovery document was updated. No screens, APIs, database schema, or code were designed or written.
- No data model was produced; Section 10 remains a definitions-only Business Object Catalogue.
- No business rule was invented to fill a gap; the two genuinely still-open items (`OQ-020`, manual-creation scope) are recorded as Open Questions, not silently resolved — and are confirmed still-open in the source documents themselves, not merely carried forward by habit.
- Every statement in this document is labelled Confirmed, Proposed (Arjun), Assumption, or Open Question.
- Repository was connected, read, and one file edited in place this pass; no branch was created or switched; no commit or push was performed.
- No Business Analysis, UX, Architecture or Engineering work was performed at any point in this continuation.

---

## 19. Handover

The approved output of this EBC is the mandatory input for **EBC-R1.3-WS12-003 — Business Analysis**. No Business Analysis should commence until this discovery — now validated directly against the canonical repository — has been reviewed and accepted by the Product Owner. Unlike the original pass, there is no longer a source-access gap blocking that review: the two remaining genuinely open items (`OQ-020`, manual-creation scope) are confirmed as open in the canonical documents themselves and are Product Owner/Business Analysis decisions, not missing evidence.

---

## 20. Continuation Execution Record (EBC-R1.3-WS12-002 — Controlled Re-execution)

This section satisfies the specific deliverables required by the Controlled Re-execution continuation card, distinct from (and additional to) the discovery content above.

### 20.1 Repository Readiness Confirmation

- Repository connected: **Yes** — folder `/Users/viveksophu/Documents/Projects/SearchMyVacation` granted and mounted this session.
- Repository validated: **Yes** — root confirmed, canonical `docs/` folder tree confirmed (with the naming discrepancy noted in Section 0 as an observation, not a blocker), branch `main`, working tree inspected read-only.
- Canonical documentation reviewed: **Yes** — `PO-REVIEW-03-Journey-Planning.md` and the Journey Planning sections of `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` (plus v1.0 §7.10–§7.11 for Task/Follow-up) read in full.

### 20.2 Discovery Validation Summary

| Section | Outcome |
|---|---|
| 0 (Readiness), 1 (Review) | Updated — repository status and source list refreshed |
| 2 (Executive Summary) | Updated — reflects resolved items |
| 3 (Domain Overview), 4 (Vision) | Reviewed, still valid; citations upgraded from indirect to direct where the same fact is now directly sourced |
| 5 (Current vs Future) | Reviewed, still valid; no change to substance |
| 6 (Stakeholders) | Updated — vendor-touchpoint resolution upgraded from Proposed to Confirmed |
| 7 (Capability Map) | Updated — citations upgraded to direct; Follow-up/Task capability resolved |
| 8 (Lifecycle) | **Materially updated** — exact seven stage names inserted, replacing the prior "cannot assert" caveat; illustrative-to-approved mapping added |
| 9 (Process Narrative) | Updated — rewritten to use the now-Confirmed stage names and requirement fields |
| 10 (Object Catalogue) | **Materially updated** — Task and Follow-up resolved from Open to Confirmed; Activity resolved as distinct from Discovery Note and Confirmed to exist; all confidence levels upgraded from indirect to direct |
| 11 (Business Rules) | **Materially updated** — BR-010 through BR-013, BR-016 inserted with exact text and source citation |
| 12 (Scope), 13 (Out of Scope) | Reviewed, still valid; minor wording alignment only |
| 14 (Risks) | Updated — R-1 and R-4 marked Resolved; R-2, R-3, R-5, R-6 confirmed still genuinely open (not closed by inference) |
| 15 (Recommendations) | Updated — items 1, 4, 5, 6 marked done; new item 9 (filename observation) added |
| 16 (Acceptance Criteria) | Updated — all items now satisfied without qualification |
| 17–19 (Repository Impact, Confirmations, Handover) | Updated to reflect the actual repository edit performed this pass |

Sections reviewed and left unchanged in substance: 3, 4, 5, 12, 13. Sections materially updated: 0, 1, 2, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19. No section was rewritten from scratch; all updates were targeted insertions or upgrades of existing content, consistent with this continuation's explicit instruction not to redesign the discovery.

### 20.3 Open Question Resolution Log

| Original item | Resolution |
|---|---|
| Exact seven `PD-JP-005` stage names | **Confirmed** — Lead Created, Discovery, Planning, Proposal Shared, Revision, Decision, Closed (Section 8) |
| `BR-010` exact meaning | **Confirmed** — one Journey Planning Record per destination/region per Traveller (`PD-JP-001`) (Section 11) |
| Fate of "Planning Task" | **Confirmed** — resolves to the pre-existing, Workspace-wide **Task** object (Section 10) |
| Fate of "Follow-up" | **Confirmed** — resolves to the pre-existing, Workspace-wide **Follow-up** object (Section 10) |
| Fate of "Activity" | **Confirmed** as a distinct, named Planning Activity (not the same as Discovery Note); field-level definition **Still Open**, deferred to WS12-003 by design, not by gap |
| Vendor touchpoint (`EBC-R1.3-WS12-001` §6.3) | **Confirmed** — no direct vendor-facing interface inside Journey Planning (Section 6) |
| `OQ-020` (Quotation / Proposal Version / Vendor Quotation) | **Still Open** — confirmed genuinely open in the source specification itself; requires Product Owner Decision |
| Manual creation of a Journey Planning Record | **Still Open** — no evidence found in either canonical document; requires Product Owner Decision |
| `OQ-022` (Ownership Model cross-module uniformity) | **Still Open** — confirmed genuinely open in the source specification itself; requires Product Owner Decision, and is out of this module's own scope to resolve |
| Current-state (pre-Workspace) manual process | **Still Open** — no document found describing it; requires Product Owner input if the "deliberate future-state" framing (Section 5) is to be checked against a real baseline |

### 20.4 Repository Update Summary

- **What changed:** the existing repository file `docs/09-Development/Ebc r1.3 ws12 002 arjun business domain discovery and product discovery journey planning.md` was updated in place with the content in Sections 0–19 above (superseding its prior content, which is preserved in the Claude Project's document history and in this Project's own version record).
- **Why:** to resolve the repository-dependent Open Questions identified during the original execution, now that repository access is available, per this continuation's explicit scope.
- **Where:** `docs/09-Development/` (existing path, existing filename — not renamed; see Section 0 observation). The same content was also republished to the Claude Project at `claude/EBC-R1.3-WS12-002-ARJUN-Business-Domain-Discovery-and-Product-Discovery-Journey-Planning.md` so both copies stay in sync.
- **No other repository artefact was created, modified, or deleted.**

### 20.5 Final Discovery Status

**Discovery Complete with Product Owner Decisions Pending.**

Three items remain genuinely open and require a Product Owner decision, not further research (`OQ-020`, manual-creation scope, `OQ-022`) — each confirmed open in the canonical source documents themselves, not merely unresolved by this discovery. Everything else this card asked for is now Confirmed direct against the canonical repository. Per Section 19, WS12-003 (Business Analysis) may proceed once the Product Owner has reviewed this document; the three open items should be flagged to the Product Owner explicitly rather than silently deferred.

---

*Prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per EBC-R1.3-WS12-002 and its Controlled Re-execution continuation. This discovery is submitted for Product Owner review and, on acceptance, sets up EBC-R1.3-WS12-003 — Journey Planning Business Analysis (Arjun).*

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014CQZsVKR51uH4yidUW6nkh
