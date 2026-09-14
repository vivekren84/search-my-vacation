# Search My Vacation — SMV Workspace: Requirements Traceability Matrix (Baseline)

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v1.0 (Baseline) |
| **Status** | Baseline established — for Sophie (UX & Information Architecture) to extend next; open items require Product Owner / cross-persona resolution before being treated as settled |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 10 September 2026 |
| **Purpose** | Establish the authoritative, uniquely-identified baseline Requirements Traceability Matrix (RTM) for the SMV Workspace, so every approved requirement, non-functional requirement and business rule can be traced through UX, Architecture, Engineering, QA and future releases. This EBC establishes the baseline only — future personas extend this matrix rather than creating new ones. |
| **Prepared under** | `EBC-R1.3-WS3-003` (Requirements Traceability Matrix — Baseline) |
| **Predecessor** | `EBC-R1.3-WS3-002` — SMV Workspace Product Specification (`docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md`) |
| **Successor** | Sophie — UX Architecture & Information Architecture |
| **Related** | `docs/02-Product/SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`; `docs/10-Backlog/RELEASE-1.3.md` §7, §15 |

### 1.1 Note on document location — flagged, not silently applied

**EBC-R1.3-WS3-003 names the deliverable path as `docs/05-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md`.** The repository's own established folder taxonomy (`docs/09-Development/README.md` §"Relationship with Other Documentation") assigns `02-Product` to Product requirements and `05-Architecture` to System architecture — there is no `05-Product` folder anywhere in the existing structure, and creating one would both collide in spirit with the numbered `05-Architecture` folder and fragment product documentation that otherwise lives entirely under `docs/02-Product/` (`PRODUCT-VISION.md`, `JOURNEY-PASSPORT-v1.0.md`, `SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md`, `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v1.0.md`). Per Project Instructions §18 (prefer existing patterns, avoid unnecessary duplication of structure) and §32 (do not create duplicate or competing document homes), this RTM is filed at **`docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md`** instead — alongside its own predecessor document — rather than at the literal path the card names. Flagged here explicitly, consistent with this project's own precedent for disclosing rather than silently resolving a naming/path inconsistency (e.g. `EBC-R1.3-RM-001` §1). If `docs/05-Product/` was intended deliberately (for example, as the start of a restructuring), say so and this document can be moved.

### 1.2 How to read this document

Every row carries a **Status** value with the same meaning used throughout `EBC-R1.3-WS3-002`:

| Status | Meaning |
| --- | --- |
| **Approved** | Traces to a decision already approved by the Product Owner (`DEC-R1.3-004`/`DEC-R1.3-005`) — a Confirmed statement in the Product Specification. |
| **Proposed** | Traces to a Product-Specification item labelled **Proposed (Arjun)** — a reasoned elaboration requiring Product Owner confirmation before Sophie, Archie or Rad treat it as settled scope. |
| **Deferred** | Not currently assigned in this release (no rows carry this status yet — Gap 5 / OQ-010 below remains the open question that would eventually produce Deferred rows). |

**Priority** (Must / Should / Could) is a new classification this RTM adds — the Product Specification did not assign priority to any requirement. Every Priority value below is **Arjun's proposed classification**, disclosed as such, and requires Product Owner confirmation (see §8, additional finding AF-01) before Tiger uses it for sequencing.

The four right-most columns in each matrix — **UX Reference, Architecture Reference, Engineering Reference, QA Reference** — are intentionally blank in this baseline, per Tiger's delivery note on this card. They exist so Sophie, Archie, Rad and Keerthi populate this same matrix as their own work proceeds, rather than each persona producing a competing traceability structure. Populating them is explicitly Out of Scope for this EBC (§9).

---

## 2. Identifier Convention

Per this card's instruction, every requirement below receives a new, stable identifier, distinct from the working IDs used inside `EBC-R1.3-WS3-002` itself. Once assigned, an ID is never renumbered or reused, even if the requirement is later retired — a retired requirement's row is marked Deferred/Retired in place, not deleted.

| Type | Prefix | Range in this baseline |
| --- | --- | --- |
| Functional Requirement | `FR-WS-0xx` | FR-WS-001 – FR-WS-038 |
| Non-Functional Requirement | `NFR-WS-0xx` | NFR-WS-001 – NFR-WS-007 |
| Business Rule | `BR-0xx` | BR-001 – BR-009 |
| Open Question | `OQ-0xx` | OQ-001 – OQ-017 |

**Legacy ID column:** because `EBC-R1.3-WS3-002` is already circulating under its own working IDs (e.g. `FR-DASH-01`, `BR-04`, `OQ-08`), every row below also carries its Legacy ID, so a reader moving between the two documents can cross-reference without ambiguity. The Product Specification document itself is not being renumbered — per Project Instructions §32 ("do not rewrite history"), its own IDs stand as originally published; this RTM is the layer that assigns the stable, RTM-governed identifiers going forward.

---

## 3. Requirement Count and the 75-Item Threshold

This card instructs that a companion `.xlsx` be created only when the requirement count "typically" exceeds 75. This baseline contains **54 core requirement rows** (38 Functional + 7 Non-Functional + 9 Business Rules) plus a separately-tracked 17-item Open Questions register (not itself a requirement type). At 54 (or 71 including Open Questions), this baseline is below the stated threshold — the Markdown document below is therefore the sole canonical deliverable for this baseline. A companion spreadsheet is not created now; Tiger/the Product Owner may request one at any time as an operational aid without this document ceasing to be canonical (per the card's own framing: "The Markdown document remains the canonical version for governance, with the spreadsheet serving as an operational aid if needed").

---

## 4. Module Coverage Check

All nine SMV Workspace MVP modules (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §11) are represented with at least one Functional Requirement below. No module is uncovered.

| Module | FR Count | FR ID Range |
| --- | --- | --- |
| Dashboard | 6 | FR-WS-001 – FR-WS-006 |
| Traveller Hub | 5 | FR-WS-007 – FR-WS-011 |
| Journey Planning | 5 | FR-WS-012 – FR-WS-016 |
| Journey Workspace | 4 | FR-WS-017 – FR-WS-020 |
| Itinerary Studio | 4 | FR-WS-021 – FR-WS-024 |
| Destination Intelligence | 3 | FR-WS-025 – FR-WS-027 |
| Vendor Management | 4 | FR-WS-028 – FR-WS-031 |
| Notifications | 4 | FR-WS-032 – FR-WS-035 |
| Basic Settings | 3 | FR-WS-036 – FR-WS-038 |
| **Total** | **38** | |

**Two items from the Product Specification's functional-requirement tables were deliberately excluded from FR numbering**, because on inspection they are restated Open Questions, not testable requirements: the Product Specification's `FR-NOT-05` ("Open Question OQ-08... not decided... not assumed here") and `FR-SET-04` ("excludes advanced configuration... Open Question OQ-10"). Both are carried correctly in the Open Questions register (§7) as `OQ-008` and `OQ-010` respectively, and are not double-counted as requirements — assigning them an FR ID would have misrepresented an open question as settled scope.

---

## 5. Functional Requirements Matrix

| RTM ID | Legacy ID | Module | Requirement Summary | Priority | Status | Lifecycle | Dependencies | UX Ref | Arch Ref | Eng Ref | QA Ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-WS-001 | FR-DASH-01 | Dashboard | Present operational information as cards, not dense tables | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-002 | FR-DASH-02 | Dashboard | Provide a "My Work" / "Team" toggle | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-003 | FR-DASH-03 | Dashboard | Every card shows its item's owner | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-004 | FR-DASH-04 | Dashboard | Surface a recommended next action for each attention-worthy item | Must | Approved | Cross-Lifecycle | BR-004 | | | | |
| FR-WS-005 | FR-DASH-05 | Dashboard | Summarise each Operational Queue (Journey Planning, Active Journeys, Vendor Confirmations, Tasks, Follow-ups) as its own card/group | Should | Proposed | Cross-Lifecycle | FR-WS-012, FR-WS-019, FR-WS-030 | | | | |
| FR-WS-006 | FR-DASH-06 | Dashboard | Administrators can filter the Team view by team member | Could | Proposed | Cross-Lifecycle | BR-003 | | | | |
| FR-WS-007 | FR-HUB-01 | Traveller Hub | Single record per Traveller consolidating Leads, Journeys and Follow-up history | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-008 | FR-HUB-02 | Traveller Hub | Implement Mobile number matching so a new Lead attaches to an existing Traveller | Must | Proposed | Journey Planning | BR-001 | | | | |
| FR-WS-009 | FR-HUB-03 | Traveller Hub | Display originating Journey Passport context for site-originated Leads | Should | Proposed | Journey Planning | — | | | | |
| FR-WS-010 | FR-HUB-04 | Traveller Hub | Search for a Traveller by name or mobile number | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-011 | FR-HUB-05 | Traveller Hub | Show a Traveller's repeat-traveller status | Could | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-012 | FR-JP-01 | Journey Planning | Present the Journey Planning queue, grouped by lifecycle stage | Must | Proposed | Journey Planning | — | | | | |
| FR-WS-013 | FR-JP-02 | Journey Planning | Unclaimed queue items are visible to all and claimable by any Privilege User | Must | Proposed | Journey Planning | BR-002 | | | | |
| FR-WS-014 | FR-JP-03 | Journey Planning | A claimed item shows its Owner and leaves the unclaimed pool | Must | Proposed | Journey Planning | BR-002 | | | | |
| FR-WS-015 | FR-JP-04 | Journey Planning | Queue supports the proposed six-stage Phase 1 breakdown | Should | Proposed | Journey Planning | OQ-004 | | | | |
| FR-WS-016 | FR-JP-05 | Journey Planning | Stage progression occurs only via a deliberate owner action, never a free-text status edit | Must | Proposed | Journey Planning | BR-004, BR-005 | | | | |
| FR-WS-017 | FR-JW-01 | Journey Workspace | Single working record per Journey (Traveller, stage, Itinerary/Quotation, Vendor Confirmations, Tasks, Follow-ups) | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-018 | FR-JW-02 | Journey Workspace | Show a Journey's full stage-transition history | Should | Proposed | Cross-Lifecycle | NFR-WS-004 | | | | |
| FR-WS-019 | FR-JW-03 | Journey Workspace | Present the Active Journeys queue for Phase 2 delivery, with the same claim/ownership behaviour | Must | Proposed | Journey Delivery | BR-002 | | | | |
| FR-WS-020 | FR-JW-04 | Journey Workspace | A Journey's status is system-derived, never a freely editable dropdown | Must | Proposed | Cross-Lifecycle | BR-005 | | | | |
| FR-WS-021 | FR-IS-01 | Itinerary Studio | Author a day-wise Itinerary for an owned Journey | Must | Proposed | Journey Planning | — | | | | |
| FR-WS-022 | FR-IS-02 | Itinerary Studio | Generate a Quotation from an Itinerary (one Itinerary may produce more than one Quotation version) | Must | Proposed | Journey Planning | OQ-006 | | | | |
| FR-WS-023 | FR-IS-03 | Itinerary Studio | Sending a Quotation is a deliberate, logged action that advances the Journey's stage | Must | Proposed | Journey Planning | BR-004 | | | | |
| FR-WS-024 | FR-IS-04 | Itinerary Studio | Reference Destination Intelligence content while drafting, without duplicating it into the Itinerary | Should | Proposed | Journey Planning | FR-WS-025 | | | | |
| FR-WS-025 | FR-DI-01 | Destination Intelligence | Look up a destination's Product-approved knowledge while planning | Must | Proposed | Journey Planning | — | | | | |
| FR-WS-026 | FR-DI-02 | Destination Intelligence | Respect existing destination status gating (Active/Coming Soon/Inactive) | Must | Proposed | Journey Planning | — | | | | |
| FR-WS-027 | FR-DI-03 | Destination Intelligence | No destination content authoring or approval capability inside the Workspace | Should | Proposed | Journey Planning | OQ-007 | | | | |
| FR-WS-028 | FR-VM-01 | Vendor Management | Administrators can create, edit and deactivate Vendor master records | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-029 | FR-VM-02 | Vendor Management | A Privilege User can record a Vendor Confirmation against a Journey for an on-record Vendor | Must | Proposed | Journey Delivery | FR-WS-028 | | | | |
| FR-WS-030 | FR-VM-03 | Vendor Management | The Vendor Confirmations queue surfaces Journeys with an outstanding confirmation | Must | Proposed | Journey Delivery | FR-WS-029 | | | | |
| FR-WS-031 | FR-VM-04 | Vendor Management | A deactivated Vendor cannot be selected for new Confirmations; existing Confirmations remain unaffected | Should | Proposed | Journey Delivery | BR-006 | | | | |
| FR-WS-032 | FR-NOT-01 | Notifications | Notify when a Lead is unclaimed past an Administrator-configured threshold | Should | Proposed | Journey Planning | FR-WS-035 | | | | |
| FR-WS-033 | FR-NOT-02 | Notifications | Notify when a Follow-up becomes due | Must | Proposed | Cross-Lifecycle | BR-009 | | | | |
| FR-WS-034 | FR-NOT-03 | Notifications | Notify a user when a Task/item is reassigned to them | Should | Proposed | Cross-Lifecycle | BR-003 | | | | |
| FR-WS-035 | FR-NOT-04 | Notifications | Administrators can configure which notification types are active and their recipients | Should | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-036 | FR-SET-01 | Basic Settings | Every user can view/edit their own profile and notification preferences | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-037 | FR-SET-02 | Basic Settings | Administrators can view the internal user list and role assignment | Must | Proposed | Cross-Lifecycle | — | | | | |
| FR-WS-038 | FR-SET-03 | Basic Settings | Administrators can configure Operational Queue composition | Could | Proposed | Cross-Lifecycle | FR-WS-012, FR-WS-019 | | | | |

---

## 6. Non-Functional Requirements Matrix

| RTM ID | Legacy ID | Category | Requirement Summary | Priority | Status | Lifecycle | Dependencies | UX Ref | Arch Ref | Eng Ref | QA Ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NFR-WS-001 | NFR-PERF-01 | Performance | Queue views load within a target Archie confirms during architecture review (no numeric SLA supplied by discovery) | Should | Proposed | Cross-Lifecycle | — | | | | |
| NFR-WS-002 | NFR-SEC-01 | Security | No unauthenticated access to any Business Object | Must | Proposed | Cross-Lifecycle | — | | | | |
| NFR-WS-003 | NFR-SEC-02 | Security | Role-based access (§4 of the Product Specification) enforced server-side, not only hidden in the UI | Must | Proposed | Cross-Lifecycle | — | | | | |
| NFR-WS-004 | NFR-AUDIT-01 | Auditability | Every stage transition and Reassignment is recorded with who/when | Must | Proposed | Cross-Lifecycle | BR-003 | | | | |
| NFR-WS-005 | NFR-SCALE-01 | Scalability | Data model does not assume a fixed, small number of team members or Vendors | Should | Proposed | Cross-Lifecycle | — | | | | |
| NFR-WS-006 | NFR-ACC-01 | Accessibility | Meets the project's existing interactive-control, keyboard-navigation and reduced-motion standards | Must | Proposed | Cross-Lifecycle | — | | | | |
| NFR-WS-007 | NFR-USE-01 | Usability | Minimise steps between "seeing what needs attention" and "taking the next action" | Should | Proposed | Cross-Lifecycle | FR-WS-004 | | | | |

---

## 7. Business Rules Matrix and Traceability

| RTM ID | Legacy ID | Business Rule | Status | Lifecycle | Related Requirements (FR/NFR) |
| --- | --- | --- | --- | --- | --- |
| BR-001 | BR-01 | Mobile number matching | Approved (name) / Proposed (behaviour) | Journey Planning | FR-WS-008 |
| BR-002 | BR-02 | Claim ownership | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-013, FR-WS-014, FR-WS-019 |
| BR-003 | BR-03 | Reassignment | Approved (per `EBC-R1.3-RM-002` §1) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-006, FR-WS-034, NFR-WS-004 |
| BR-004 | BR-04 | Action-driven workflow | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-004, FR-WS-016, FR-WS-023 |
| BR-005 | BR-05 | System-controlled statuses | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-016, FR-WS-020 |
| BR-006 | BR-06 | Archive before delete | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-031 |
| BR-007 | BR-07 | Admin permanent delete | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | *(none — see AF-02 below)* |
| BR-008 | BR-08 | Hybrid task creation | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-005 *(indirect, via the Tasks queue reference only — see AF-02)* |
| BR-009 | BR-09 | Structured follow-ups | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-033 |

**Status convention for Business Rules:** every rule's *name* was agreed by the Product Owner in Product Discovery (`SMV-WORKSPACE-PRODUCT-DISCOVERY-v1.0.md` §10; BR-003/Reassignment via `EBC-R1.3-RM-002` §1) — hence "Approved (name)". Its *behavioural definition*, as elaborated in the Product Specification §8, is Arjun's proposal and requires confirmation — hence "Proposed (behaviour)". No Business Rule is fully Approved end-to-end yet.

---

## 8. Additional Findings — Traceability Gaps Identified While Building This Matrix

Building the Business Rule Traceability table (§7) surfaced coverage gaps that pre-date this EBC — they exist in `EBC-R1.3-WS3-002` itself, not something introduced here. Recording them is itself part of this RTM's job (Project Instructions §4: Arjun must "identify requirement gaps and contradictions"). None of these are resolved here — resolving them is explicitly Out of Scope for this baseline (§9) — they are logged so they are not silently lost.

- **AF-01 — Priority is new to this document.** The Product Specification assigned no priority to any requirement. Every Priority value in §5/§6 above is Arjun's own classification, proposed for this baseline and not yet Product Owner-confirmed. Recommend Tiger route this alongside the seventeen Open Questions (§7 of `EBC-R1.3-WS3-002`) for a single confirmation pass, rather than as a separate round.
- **AF-02 — Four Business Rules have no directly implementing Functional Requirement.** BR-003 (Reassignment), BR-006 (Archive before delete), BR-007 (Admin permanent delete) and BR-008 (Hybrid task creation) are each named as an Administrator/Privilege User *capability* in the Product Specification §4, and BR-006/BR-008 each have one *adjacent* FR that references them in passing (FR-WS-031 for Vendor deactivation; FR-WS-005 for the general Tasks queue) — but no module's functional-requirements table states the core action itself ("an Administrator can reassign a Journey," "a user can archive a record they own," "an Administrator can permanently delete an archived record," "a Task can be created manually or automatically") as its own testable requirement. This is a genuine specification gap, not a traceability-tooling artefact: Keerthi would have no acceptance-criterion-bearing requirement to test these four rules against as written today. **Recommended action:** a short addendum to `EBC-R1.3-WS3-002` (or a dedicated Journey Workspace / Basic Settings functional-requirement addition) adding one explicit FR per gap. This RTM does not add those FRs itself, since doing so would mean this EBC silently expanding the Product Specification's approved requirement set rather than tracing it — a determination the Product Owner/Tiger should make.
- **AF-03 — BR-002 (Claim ownership) as named in discovery concerns Leads; this Product Specification also applies it to Tasks (§4.2) and to Journey Workspace hand-offs (FR-WS-019).** Confirm whether "claim" is intended as one uniform mechanism across Leads, Tasks and Journeys, or three separate (even if similarly-behaved) mechanisms — relevant to Archie's eventual data-model decision, flagged here rather than assumed uniform.

---

## 9. Lifecycle Traceability Summary

Grouping every requirement and rule from §5–§7 by the Journey Lifecycle phase it primarily supports (per `EBC-R1.3-WS3-002` §9):

| Lifecycle Phase | Functional Requirements | Non-Functional Requirements | Business Rules |
| --- | --- | --- | --- |
| **Journey Planning** | FR-WS-008, 009, 012–016, 021–027, 032 | — | BR-001 |
| **Journey Delivery** | FR-WS-019, 029–031 | — | — |
| **Cross-Lifecycle** | FR-WS-001–007, 010, 011, 017, 018, 020, 028, 033–038 | NFR-WS-001–007 | BR-002–BR-009 |

**Observation (not a decision):** no Functional Requirement in this baseline is exclusively a "Journey Delivery" concern apart from the four Vendor Confirmation/Active Journeys items — the large majority of Phase 2 behaviour (Booking, Document, post-journey Follow-up) is specified at the Business Object level (`EBC-R1.3-WS3-002` §7.9, §7.11, §7.13) but has not yet been translated into its own module-level Functional Requirements the way Phase 1 has. This is consistent with, and reinforces, Open Question OQ-005 (confirm Journey Workspace's Phase 2 functional depth) already on record — not a new finding requiring its own AF entry.

---

## 10. Open Questions Register

Carried forward verbatim in substance from `EBC-R1.3-WS3-002` §13, renumbered to this RTM's stable identifier scheme. Resolution status for all seventeen remains **Open** — none are resolved by this EBC.

| RTM ID | Legacy ID | Open Question | Recommended Owner | Resolution Status |
| --- | --- | --- | --- | --- |
| OQ-001 | OQ-01 | Confirm or amend the proposed Administrator / Privilege User capability lists | Product Owner | Open |
| OQ-002 | OQ-02 | Confirm the Dashboard must summarise every Operational Queue, or a subset | Product Owner | Open |
| OQ-003 | OQ-03 | Confirm the Traveller Hub's proposed functional requirements | Product Owner | Open |
| OQ-004 | OQ-04 | Confirm or amend the proposed Journey Lifecycle stage breakdown | Product Owner | Open |
| OQ-005 | OQ-05 | Confirm "Journey Workspace" is the Phase 1+2 working record, distinct from "Journey Planning" | Product Owner | Open |
| OQ-006 | OQ-06 | Confirm whether an Itinerary may have multiple Quotation versions, or exactly one | Product Owner / Architecture | Open |
| OQ-007 | OQ-07 | Confirm Destination Intelligence in the Workspace is read-only against the existing Destination Knowledge Base | Product Owner / Architecture | Open |
| OQ-008 | OQ-08 | Confirm Notification delivery channels: in-Workspace only, or also external | Product Owner / Architecture | Open |
| OQ-009 | OQ-09 | Confirm whether `GLOSSARY.md` GL-015 should be updated to cross-reference the SMV Workspace | Programme/Delivery (Tiger) | Open |
| OQ-010 | OQ-10 | Confirm what, if anything, is explicitly deferred out of the nine confirmed MVP modules | Product Owner | Open |
| OQ-011 | OQ-11 | Confirm or amend the thirteen Business Object definitions | Product Owner / Architecture | Open |
| OQ-012 | OQ-12 | Confirm the architectural relationship between the Workspace's Lead object and the existing `journey_passport_leads` table | Architecture | Open |
| OQ-013 | OQ-13 | Confirm whether "Journey Planning" and "Journey" are one data object or two | Architecture | Open |
| OQ-014 | OQ-14 | Confirm whether "Document" requires file upload/storage at MVP | Product Owner / Architecture | Open |
| OQ-015 | OQ-15 | Confirm or amend the nine proposed Business Rule definitions | Product Owner | Open |
| OQ-016 | OQ-16 | Confirm whether Reassignment should be one of the named eight Business Rules or a separately tracked ninth | Product Owner | Open |
| OQ-017 | OQ-17 | Confirm whether precise travel-date tracking is required to drive the "In-Journey" lifecycle stage automatically | Product Owner / Architecture | Open |

**New findings from this EBC** (AF-01, AF-02, AF-03, §8) are recorded there rather than added to this table, since they are traceability observations this RTM itself produced, not open questions the Product Specification already carried — keeping the two registers honest about their separate origins, per this document's own numbering-stability principle (§2).

---

## 11. Quality Checklist

- [x] Every Functional Requirement has a unique ID — FR-WS-001 through FR-WS-038, no gaps or duplicates.
- [x] Every Non-Functional Requirement has a unique ID — NFR-WS-001 through NFR-WS-007.
- [x] Every Business Rule is referenced — §7; four rules (BR-003, BR-006, BR-007, BR-008) reference only adjacent/indirect requirements, disclosed as AF-02 rather than hidden.
- [x] Every Workspace module has requirement coverage — §4, all nine modules represented, none flagged as lacking.
- [x] No duplicate identifiers exist — verified by construction (single sequential pass per type, no ID reused across §5–§7).
- [x] Requirement numbering is stable — IDs assigned once; this baseline is the first and only assignment, so no renumbering has occurred yet, and none should occur going forward per §2.
- [x] Terminology matches the approved Product Specification — every Requirement Summary is a direct compression of its Legacy-ID source text in `EBC-R1.3-WS3-002`, not a rephrasing that introduces new terms.
- [x] All open questions are included and assigned an owner — §10, all seventeen, each with a Recommended Owner.
- [x] The RTM is ready to be extended by UX, Architecture, Engineering and QA — §5/§6 carry the four blank reference columns per Tiger's delivery note; no structural change should be needed for those personas to populate them.

---

## 12. Out of Scope — Respected

Per this card's explicit instruction, this baseline does not: create UX mappings (the UX Reference column is left blank for Sophie); assign architecture components (the Architecture Reference column is left blank for Archie); define APIs or database entities (Open Questions OQ-011/012/013/014 are raised, not answered); create engineering tasks (the Engineering Reference column is left blank for Rad); write test cases (the QA Reference column is left blank for Keerthi); or resolve any open question (§10 — all seventeen remain Open; the three new findings in §8 are also left open, not resolved).

## 13. Files Changed

- `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md` — created (this document), at the path explained in §1.1 rather than the card's literally-stated `docs/05-Product/` path.

No other repository file created, modified, or deleted. No `.xlsx` companion created, per §3.

---

## 14. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v1.0 | 10-Sep-2026 | Arjun | `EBC-R1.3-WS3-003` | Baseline Requirements Traceability Matrix established from `EBC-R1.3-WS3-002`'s Product Specification: 38 Functional Requirements, 7 Non-Functional Requirements and 9 Business Rules assigned stable `FR-WS-`/`NFR-WS-`/`BR-` identifiers with full legacy-ID cross-reference; 17 Open Questions carried forward with owners; three new traceability gaps identified and disclosed (priority was previously unassigned; four Business Rules lack a directly implementing requirement; the Claim-ownership rule's scope across Leads/Tasks/Journeys is unconfirmed). Module coverage confirmed complete across all nine MVP modules. Filed at `docs/02-Product/` rather than the card's stated `docs/05-Product/`, flagged in §1.1. Four forward-reference columns (UX/Architecture/Engineering/QA) added per Tiger's delivery note, left blank for those personas to populate. No `.xlsx` companion created — total requirement count (54) is below the card's stated 75-item threshold. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-003`. It is the baseline governance artifact for SMV Workspace requirements traceability — Sophie, Archie, Rad and Keerthi extend it in place as their own work proceeds; it should not be superseded by a competing matrix.*
