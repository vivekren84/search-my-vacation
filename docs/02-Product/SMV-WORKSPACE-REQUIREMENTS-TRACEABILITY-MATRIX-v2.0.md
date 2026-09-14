# Search My Vacation — SMV Workspace: Requirements Traceability Matrix

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v2.0 |
| **Status** | Consolidated Baseline Update — extends the v1.0 baseline with the complete Release 1.3 Product Owner Review. Drafted Functional Requirements (existing 38) are traced and status-updated; the approximately 195 net-new Functional Requirements approved by count/topic-group only are recorded as a Topic Group Register (§6), not as individually numbered rows, per Tiger's explicit instruction not to invent FR wording. |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 13 September 2026 |
| **Purpose** | Extend the SMV Workspace Requirements Traceability Matrix baseline with the Release 1.3 Product Owner Review outcomes, preserving stable identifiers, disclosing exactly what is and is not yet traceable at the individual-requirement level. |
| **Prepared under** | `EBC-R1.3-WS3-004`, Stage 4 (Consolidated Baseline Update) |
| **Predecessor** | `SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v1.0.md` (10 September 2026) |
| **Companion** | `SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` (this update's paired Specification) |
| **Source evidence** | `WS3-PRODUCT-OWNER-REVIEW-BASELINE-HANDOVER.md` v1.0; `WS3-DELIVERY-GOVERNANCE-CONSISTENCY-REVIEW.md` v1.0; `WS3-PRODUCT-SPECIFICATION-RTM-IMPACT-ASSESSMENT.md` v1.0; `docs/02-Product/reviews/PO-REVIEW-03` through `PO-REVIEW-09` |

### 1.1 How to read this document

Unchanged from v1.0 (§1.2): **Approved**, **Proposed**, **Deferred** status values; Priority (Must/Should/Could) remains Arjun's proposed classification pending Product Owner confirmation (AF-01, still open). The four forward-reference columns (UX/Architecture/Engineering/QA) remain blank for Sophie/Archie/Rad/Keerthi to populate.

**New status value for this version — Topic-Group Only:** applies to the ~195 net-new Functional Requirements the Product Owner Review approved by count and topic group, for which no individual requirement wording exists anywhere in the evidence. These are recorded in §6, not §5, and deliberately do not receive individual `FR-WS-0XX` identifiers yet — assigning an ID to a requirement that has no drafted text would misrepresent an approved count as a drafted, testable requirement. IDs will be assigned when the wording is drafted, per Tiger's Stage 3 decision that this is a separate, not-yet-scoped Business Analysis activity.

---

## 2. Identifier Convention

Unchanged from v1.0 — `FR-WS-0xx`, `NFR-WS-0xx`, `BR-0xx`, `OQ-0xx`. IDs already assigned are never renumbered or reused. This version extends the `BR-0xx` range (new: `BR-010`–`BR-019`) and the `OQ-0xx` range (new: `OQ-018`–`OQ-022`). No existing `FR-WS-0xx` or `NFR-WS-0xx` ID is renumbered; §6 introduces a separate, unnumbered Topic Group Register rather than extending the `FR-WS-0xx` range with placeholders.

---

## 3. Requirement Count Update

| Count | v1.0 | v2.0 |
| --- | --- | --- |
| Drafted, individually-numbered Functional Requirements | 38 | 38 (unchanged — see §5; no new individual FRs drafted) |
| Approved Functional Requirement total (count/topic-group level) | 38 | **223** (§6) |
| Non-Functional Requirements | 7 | 7 (unchanged) |
| Business Rules | 9 | **19** (10 new — §7) |
| Open Questions | 17 | **22** (5 new — §9) |

At 38 drafted FRs, 7 NFRs and 19 Business Rules (64 individually-identified items), this baseline remains below the 75-item `.xlsx` threshold established in v1.0 §3. The 223-count Topic Group Register (§6) is explicitly not counted against that threshold, since it does not contain individually testable requirements yet.

---

## 4. Module Coverage Check

| Module | Drafted FR Count (individually numbered) | Approved FR Total (Product Owner Review) | Drafted FR ID Range |
| --- | --- | --- | --- |
| Dashboard | 6 | 6 confirmed + 2 new capabilities pending drafting | FR-WS-001 – FR-WS-006 |
| Traveller Hub | 5 | 5 confirmed + 3 new capabilities pending drafting | FR-WS-007 – FR-WS-011 |
| Journey Planning | 5 | **30** | FR-WS-012 – FR-WS-016 |
| Journey Workspace | 4 | **31** | FR-WS-017 – FR-WS-020 |
| Itinerary Studio | 4 (Legacy — pending rewrite) | **36** | FR-WS-021 – FR-WS-024 |
| Destination Intelligence | 3 (Legacy — pending rewrite) | **35** | FR-WS-025 – FR-WS-027 |
| Vendor Management | 4 | **30** | FR-WS-028 – FR-WS-031 |
| Notifications | 4 | **24** | FR-WS-032 – FR-WS-035 |
| Settings | 3 (partially superseded) | **21** | FR-WS-036 – FR-WS-038 |
| **Total** | **38** | **223** | |

All nine modules remain covered by at least one drafted, individually-numbered Functional Requirement. No module is uncovered at the drafted level; seven modules have a substantial gap between drafted and approved count (§6).

---

## 5. Functional Requirements Matrix (Drafted, Individually-Numbered)

Unchanged row set from v1.0, with Status and wording corrections applied where the Product Owner Review or Tiger's Stage 3 decisions require it. No new individually-numbered FR is added in this version (per Tiger's instruction not to invent detailed FR wording — new approved scope is recorded in §6 instead).

| RTM ID | Legacy ID | Module | Requirement Summary | Priority | Status | Lifecycle | Dependencies | UX Ref | Arch Ref | Eng Ref | QA Ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-WS-001 | FR-DASH-01 | Dashboard | Present operational information as cards, not dense tables | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-002 | FR-DASH-02 | Dashboard | Provide a "My Work" / "Team" toggle | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-003 | FR-DASH-03 | Dashboard | Every card shows its item's owner | Must | Approved | Cross-Lifecycle | — | | | | |
| FR-WS-004 | FR-DASH-04 | Dashboard | Surface a recommended next action for each attention-worthy item | Must | Approved | Cross-Lifecycle | BR-004 | | | | |
| FR-WS-005 | FR-DASH-05 | Dashboard | Summarise each Operational Queue as its own card/group | Must | **Approved** (was Proposed — dependency queues now Approved) | Cross-Lifecycle | FR-WS-012, FR-WS-019, FR-WS-030 | | | | |
| FR-WS-006 | FR-DASH-06 | Dashboard | Administrators can filter the Team view by team member | Could | Proposed (unchanged — not addressed by Product Owner Review) | Cross-Lifecycle | BR-003 | | | | |
| FR-WS-007 | FR-HUB-01 | Traveller Hub | Single record per Traveller consolidating Leads, Journeys and Follow-up history | Must | **Approved** | Cross-Lifecycle | — | | | | |
| FR-WS-008 | FR-HUB-02 | Traveller Hub | Implement Mobile number matching | Must | **Approved** | Journey Planning | BR-001 | | | | |
| FR-WS-009 | FR-HUB-03 | Traveller Hub | Display originating Journey Passport context for site-originated Leads | Should | **Approved** | Journey Planning | — | | | | |
| FR-WS-010 | FR-HUB-04 | Traveller Hub | Search for a Traveller by name or mobile number | Must | **Approved** | Cross-Lifecycle | — | | | | |
| FR-WS-011 | FR-HUB-05 | Traveller Hub | Show a Traveller's repeat-traveller status | Could | **Approved** | Cross-Lifecycle | — | | | | |
| FR-WS-012 | FR-JP-01 | Journey Planning | Present the Journey Planning queue, grouped by lifecycle stage | Must | **Approved** — stage grouping now follows PD-JP-005 (§8 of Specification) | Journey Planning | — | | | | |
| FR-WS-013 | FR-JP-02 | Journey Planning | Unclaimed queue items are visible to all and claimable by any Workspace User | Must | **Approved** | Journey Planning | BR-002 | | | | |
| FR-WS-014 | FR-JP-03 | Journey Planning | A claimed item shows its Owner and leaves the unclaimed pool | Must | **Approved** | Journey Planning | BR-002 | | | | |
| FR-WS-015 | FR-JP-04 | Journey Planning | Queue supports the Product Owner–approved Phase 1 stage breakdown | Must | **Approved** — supersedes the six-stage illustrative breakdown; now traces to PD-JP-005 (was OQ-004, Should) | Journey Planning | — | | | | |
| FR-WS-016 | FR-JP-05 | Journey Planning | Stage progression occurs only via a deliberate owner action | Must | **Approved** | Journey Planning | BR-004, BR-005 | | | | |
| FR-WS-017 | FR-JW-01 | Journey Workspace | Single working record per Journey — **Phase 2 (Delivery) only** | Must | **Approved — corrected to Phase 2-only scope** (was Proposed, assumed Phase 1+2) | Journey Delivery | — | | | | |
| FR-WS-018 | FR-JW-02 | Journey Workspace | Show a Journey's full stage-transition history | Must | **Approved** | Journey Delivery | NFR-WS-004 | | | | |
| FR-WS-019 | FR-JW-03 | Journey Workspace | Present the Active Journeys queue (Phase 2 only), same claim/ownership behaviour | Must | **Approved** | Journey Delivery | BR-002 | | | | |
| FR-WS-020 | FR-JW-04 | Journey Workspace | A Journey's status is system-derived, never a freely editable dropdown | Must | **Approved** | Journey Delivery | BR-005 | | | | |
| FR-WS-021 | FR-IS-01 | Itinerary Studio | Author a day-wise Itinerary for an owned Journey | Must | **Legacy — pending rewrite** (written against the pre-review single-Itinerary model; superseded in spirit by PD-IS-001–003) | Journey Planning | — | | | | |
| FR-WS-022 | FR-IS-02 | Itinerary Studio | Generate a Quotation from an Itinerary | Must | **Legacy — pending rewrite** (also see OQ-020, Quotation/Proposal Version terminology) | Journey Planning | OQ-006 | | | | |
| FR-WS-023 | FR-IS-03 | Itinerary Studio | Sending a Quotation is a deliberate, logged action | Must | **Legacy — pending rewrite** (principle unchanged; object model changed) | Journey Planning | BR-004 | | | | |
| FR-WS-024 | FR-IS-04 | Itinerary Studio | Reference Destination Intelligence content while drafting | Should | **Legacy — pending rewrite** (should reference Destination Profile, §7.14 of Specification) | Journey Planning | FR-WS-025 | | | | |
| FR-WS-025 | FR-DI-01 | Destination Intelligence | Look up a destination's Product-approved knowledge, read-only | Must | **Legacy — pending rewrite; contradicted by PD-DI-001–004** | Journey Planning | — | | | | |
| FR-WS-026 | FR-DI-02 | Destination Intelligence | Respect existing destination status gating (Active/Coming Soon/Inactive) | Must | **Legacy — pending rewrite** (relationship to Draft/Under Review/Approved lifecycle unconfirmed) | Journey Planning | — | | | | |
| FR-WS-027 | FR-DI-03 | Destination Intelligence | No destination content authoring or approval capability inside the Workspace | Should | **Legacy — directly contradicted by PD-DI-002/003/004; retained only to show what is superseded** | Journey Planning | OQ-007 | | | | |
| FR-WS-028 | FR-VM-01 | Vendor Management | Administrators can create, edit and mark Vendor records **Inactive** | Must | **Approved — terminology updated** (was "deactivate") | Cross-Lifecycle | — | | | | |
| FR-WS-029 | FR-VM-02 | Vendor Management | A Workspace User can record a Vendor Confirmation against a Journey for an on-record Vendor | Must | **Approved** | Journey Delivery | FR-WS-028 | | | | |
| FR-WS-030 | FR-VM-03 | Vendor Management | The Vendor Confirmations queue surfaces Journeys with an outstanding confirmation | Must | **Approved** | Journey Delivery | FR-WS-029 | | | | |
| FR-WS-031 | FR-VM-04 | Vendor Management | An **Inactive** Vendor cannot be selected for new Confirmations; existing Confirmations remain unaffected | Should | **Approved — terminology updated** (was "deactivated Vendor") | Journey Delivery | BR-006 | | | | |
| FR-WS-032 | FR-NOT-01 | Notifications | Notify when a Lead is unclaimed past an Administrator-configured threshold | Should | **Approved** | Journey Planning | FR-WS-035 | | | | |
| FR-WS-033 | FR-NOT-02 | Notifications | Notify when a Follow-up becomes due | Must | **Approved** | Cross-Lifecycle | BR-009 | | | | |
| FR-WS-034 | FR-NOT-03 | Notifications | Notify a user when a Task/item is reassigned to them | Should | **Approved** | Cross-Lifecycle | BR-003 | | | | |
| FR-WS-035 | FR-NOT-04 | Notifications | Administrators can configure which notification types are active and their recipients | Should | **Approved** | Cross-Lifecycle | — | | | | |
| FR-WS-036 | FR-SET-01 | Settings | Every user can view/edit their own profile and notification preferences | Must | **Approved — scope extended** to password, photo, appearance (PD-ST-003) | Cross-Lifecycle | — | | | | |
| FR-WS-037 | FR-SET-02 | Settings | Administrators can view the internal user list and role assignment | Must | **Approved — scope extended** to user activation/deactivation (PD-ST-002) | Cross-Lifecycle | — | | | | |
| FR-WS-038 | FR-SET-03 | Settings | Administrators can configure Operational Queue composition | Could | **Approved** | Cross-Lifecycle | FR-WS-012, FR-WS-019 | | | | |

**Note on FR-NOT-05 and FR-SET-04 (unchanged from v1.0 §4):** these remain excluded from FR numbering, since they restate Open Questions (OQ-008, OQ-010) rather than testable requirements. OQ-008 remains explicitly open per the Product Owner Review itself; OQ-010 is narrowed but not closed (§9).

---

## 6. Functional Requirement Topic Group Register (Approved by Count/Topic-Group Only)

**New section for v2.0.** This register records the Product Owner Review's approved Functional Requirement scope for the seven modules where individual requirement wording does not yet exist, without assigning individual `FR-WS-0XX` identifiers to undrafted text. Per Tiger's Stage 3 decision (13 September 2026): *"The Product Owner Review approved capability and governance rather than detailed Functional Requirement wording. Do not invent detailed FRs during the Specification update. This work will be undertaken as a separate Business Analysis activity."*

| Module | Approved Total | Already Drafted (§5) | Remaining (Topic-Group Only) | Approved Topic Groups |
| --- | --- | --- | --- | --- |
| Journey Planning | 30 | 5 (FR-WS-012–016) | ~25 | Planning creation; traveller association; requirement capture; proposal management; vendor quotation management; ownership; follow-ups; tasks; status management; search; audit history; governance |
| Journey Workspace | 31 | 4 (FR-WS-017–020) | ~27 | Journey creation; operational management; booking coordination; traveller servicing; vendor coordination; operational readiness; task management; notifications; search; audit history; governance; operational alerts |
| Itinerary Studio | 36 | 4 (FR-WS-021–024, Legacy) | ~32 (existing 4 need rewriting, not just supplementing) | Master Itinerary management; traveller itinerary creation; personalisation; version management; learning capture; governance; search; approval; organisational knowledge preservation |
| Vendor Management | 30 | 4 (FR-WS-028–031) | ~26 | Vendor creation; maintenance; service category management; geographic coverage; Preferred Partner management; performance recording; search; operational relationships; governance; audit history |
| Destination Intelligence | 35 | 3 (FR-WS-025–027, Legacy) | ~32 (existing 3 need rewriting; pending Archie's architecture decision, OQ-019) | Destination Profile management; knowledge governance; review and approval; destination search; destination relationships; organisational learning; audit history; search; lifecycle management; governance |
| Notifications | 24 | 4 (FR-WS-032–035) | ~20 | Notification generation; classification; Action Required handling; Informational handling; search/filtering; lifecycle; audit history; governance; operational visibility |
| Settings | 21 | 3 (FR-WS-036–038) | ~18 | Workspace administration; user management; role management; permission management; personal preferences; password management; profile management; configuration management; audit history; governance |
| Dashboard (new capabilities only) | 2 (in addition to the 6 drafted) | 6 (FR-WS-001–006) | 2 | Post-login landing page; named KPI set; named Quick Action set |
| Traveller Hub (new capabilities only) | 3 (in addition to the 5 drafted) | 5 (FR-WS-007–011) | 3 | Traveller Timeline; Traveller Snapshot; Operational Flags (including Potential Duplicate) |
| **Total approved** | **223** | **38** | **~185** | |

**This register is not a substitute for individual requirement traceability.** Rad cannot estimate, and Keerthi cannot test, against a topic group — only against a drafted requirement with acceptance criteria. This register exists so the approved scope is not lost or under-represented while the individual wording is drafted as a separate activity (§9, OQ-018), and so this RTM does not silently imply 223 requirements are as traceable as the 38 in §5.

---

## 7. Business Rules Matrix and Traceability

### 7.1 Existing Rules (BR-001–BR-009)

| RTM ID | Legacy ID | Business Rule | Status | Lifecycle | Related Requirements |
| --- | --- | --- | --- | --- | --- |
| BR-001 | BR-01 | Mobile number matching | Approved (name) / Proposed (behaviour) | Journey Planning | FR-WS-008 |
| BR-002 | BR-02 | Claim ownership | **Approved** — reaffirmed and generalised as the Generic Ownership Model | Cross-Lifecycle | FR-WS-013, FR-WS-014, FR-WS-019 |
| BR-003 | BR-03 | Reassignment | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-006, FR-WS-034, NFR-WS-004 |
| BR-004 | BR-04 | Action-driven workflow | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-004, FR-WS-016, FR-WS-023 |
| BR-005 | BR-05 | System-controlled statuses | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-016, FR-WS-020 |
| BR-006 | BR-06 | Archive before delete | **Approved — updated scope**, see BR-007 rewrite | Cross-Lifecycle | FR-WS-031 |
| BR-007 | BR-07 | ~~Admin permanent delete~~ **Permanent deletion restricted to administrative/configuration data** | **Approved — rewritten per Tiger's Stage 3 decision, 13 September 2026** (see Specification §9) | Cross-Lifecycle | Applies to Journey Planning Record, Journey, Traveller History, Proposal History, Vendor History, Destination Profile (archival only, no permanent delete) |
| BR-008 | BR-08 | Hybrid task creation | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-005 (indirect) |
| BR-009 | BR-09 | Structured follow-ups | Approved (name) / Proposed (behaviour) | Cross-Lifecycle | FR-WS-033 |

### 7.2 New Rules from the Release 1.3 Product Owner Review (BR-010–BR-019)

| RTM ID | Business Rule | Status | Source Product Decision(s) | Related Requirements |
| --- | --- | --- | --- | --- |
| BR-010 | One Journey Planning Record per destination/region per Traveller | Approved | PD-JP-001 | (topic-group only, §6) |
| BR-011 | Proposal Versions and Vendor Quotations are distinct record types | Approved | PD-JP-003 | (topic-group only, §6); see OQ-020 |
| BR-012 | A Journey is created only by converting a Journey Planning Record | Approved | PD-JW-001 | FR-WS-017 |
| BR-013 | Commercial activity stays in Journey Planning; Journey Workspace begins only after confirmation | Approved | PD-JW-002, PD-JW-003, PD-JW-004 | FR-WS-017, FR-WS-019 |
| BR-014 | Master Itinerary is organisational knowledge; Traveller Itinerary is a personalised copy | Approved | PD-IS-001, PD-IS-003 | (topic-group only, §6) |
| BR-015 | Knowledge/itinerary updates require review and approval before adoption | Approved | PD-IS-007, PD-DI-002 | (topic-group only, §6) |
| BR-016 | Operational designations (e.g., Preferred Partner) are independent of lifecycle state | Approved | PD-VM-003 | FR-WS-028, FR-WS-031 |
| BR-017 | A Notification remains active until its underlying condition is resolved | Approved | PD-NO-004 | FR-WS-032–035 |
| BR-018 | Evolving business concepts are managed through configuration, not code, where practical | Approved | PD-ST-001, PD-ST-005 | FR-WS-038 |
| BR-019 | Organisational configuration and personal preferences are fully independent | Approved | PD-ST-004 | FR-WS-036 |

---

## 8. Non-Functional Requirements Matrix

Unchanged from v1.0 — the Product Owner Review did not address non-functional requirements.

| RTM ID | Legacy ID | Category | Requirement Summary | Priority | Status | Lifecycle | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NFR-WS-001 | NFR-PERF-01 | Performance | Queue views load within a target Archie confirms | Should | Proposed | Cross-Lifecycle | — |
| NFR-WS-002 | NFR-SEC-01 | Security | No unauthenticated access to any Business Object | Must | Proposed | Cross-Lifecycle | — |
| NFR-WS-003 | NFR-SEC-02 | Security | Role-based access enforced server-side | Must | Proposed | Cross-Lifecycle | — |
| NFR-WS-004 | NFR-AUDIT-01 | Auditability | Every stage transition and Reassignment recorded with who/when | Must | Proposed | Cross-Lifecycle | BR-003 |
| NFR-WS-005 | NFR-SCALE-01 | Scalability | Data model does not assume a fixed, small number of team members or Vendors | Should | Proposed | Cross-Lifecycle | — |
| NFR-WS-006 | NFR-ACC-01 | Accessibility | Meets existing interactive-control/keyboard/reduced-motion standards | Must | Proposed | Cross-Lifecycle | — |
| NFR-WS-007 | NFR-USE-01 | Usability | Minimise steps between "seeing what needs attention" and "taking the next action" | Should | Proposed | Cross-Lifecycle | FR-WS-004 |

---

## 9. Open Questions Register

Updated from v1.0's seventeen; five new items added.

| RTM ID | Legacy ID | Open Question | Status | Recommended Owner |
| --- | --- | --- | --- | --- |
| OQ-001 | OQ-01 | Confirm or amend the Administrator/Privilege User capability lists | Open | Product Owner |
| OQ-002 | OQ-02 | Confirm the Dashboard must summarise every Operational Queue | **Resolved** | — |
| OQ-003 | OQ-03 | Confirm the Traveller Hub's proposed functional requirements | **Resolved** | — |
| OQ-004 | OQ-04 | Confirm the Journey Lifecycle stage breakdown | **Partially resolved** (Phase 1 only) | Product Owner (Phase 2) |
| OQ-005 | OQ-05 | Confirm Journey Workspace's phase scope | **Resolved** (opposite direction from original assumption — Phase 2 only) | — |
| OQ-006 | OQ-06 | Confirm Itinerary/Quotation version cardinality | Open — reshaped by Master/Traveller Itinerary split | Product Owner / Architecture |
| OQ-007 | OQ-07 | Confirm Destination Intelligence read-only status | **Resolved** (opposite direction — Workspace-governed), technical implementation pending | Archie |
| OQ-008 | OQ-08 | Confirm Notification delivery channels | Open — explicitly confirmed unaddressed by the Product Owner Review | Product Owner / Archie |
| OQ-009 | OQ-09 | Confirm GLOSSARY.md GL-015 cross-reference | Open | Tiger |
| OQ-010 | OQ-10 | Confirm deferred-out-of-scope capabilities | Open — narrowed by Settings scope increase | Product Owner |
| OQ-011 | OQ-11 | Confirm Business Object definitions | **Substantially resolved** for objects the review addressed; open for the rest | Product Owner / Architecture |
| OQ-012 | OQ-12 | Confirm Lead / `journey_passport_leads` relationship | Open | Architecture |
| OQ-013 | OQ-13 | Confirm Journey Planning / Journey object cardinality | **Resolved** — two objects, one-way conversion | — |
| OQ-014 | OQ-14 | Confirm Document file upload/storage requirement | Open | Product Owner / Architecture |
| OQ-015 | OQ-15 | Confirm the nine original Business Rule definitions | **Resolved for BR-007**; others still Proposed (behaviour) | — |
| OQ-016 | OQ-16 | Confirm Reassignment's rule-numbering treatment | Open | Product Owner |
| OQ-017 | OQ-17 | Confirm precise travel-date tracking requirement | Open | Product Owner / Architecture |
| **OQ-018** | — | Who drafts the ~185 net-new individual Functional Requirements (§6), and under what review process? | **Open — new** | Tiger |
| **OQ-019** | — | Reconcile Destination Profile governance model with the WS1 Bootstrap Generator architecture | **Open — new** | Archie |
| **OQ-020** | — | Confirm whether "Quotation" (§7.8 of the Specification) is the same concept as "Proposal Version" (PD-JP-002) | **Open — new** | Product Owner / Architecture |
| **OQ-021** | — | Confirm data-model/UX notation for the Master Itinerary → Traveller Itinerary parent/derived relationship | **Open — new** | Architecture / Sophie |
| **OQ-022** | — | Confirm whether the Generic Ownership Model applies uniformly across Journey Workspace, Itinerary Studio, Vendor Management, Destination Intelligence | **Open — new** | Product Owner / Architecture |

---

## 10. Additional Findings Carried Forward

AF-01 (Priority unconfirmed), AF-02 (four Business Rules lacking a directly implementing FR), and AF-03 (Claim-ownership scope across Leads/Tasks/Journeys unconfirmed) from v1.0 §8 remain open and are not resolved by this update. AF-02 is partially addressed: BR-012 and BR-013 now give Journey creation/scope rules a directly-related FR (FR-WS-017, FR-WS-019); BR-003 (Reassignment), BR-006 (Archive), BR-008 (Hybrid task creation) still lack one.

---

## 11. Lifecycle Traceability Summary

Unchanged in structure from v1.0 §9; Journey Workspace rows corrected to Phase 2-only, consistent with §5 above. The Topic Group Register (§6) is not lifecycle-classified, since it has no individual, testable rows yet.

---

## 12. Quality Checklist

- [x] Every drafted Functional Requirement retains its unique ID — no renumbering (§2, §5).
- [x] Every Business Rule (19 total) is traced to at least a name and, for the ten new rules, an explicit source Product Decision.
- [x] Terminology corrected per Tiger's Stage 3 decision: "Deactivated" replaced by "Inactive" everywhere it appeared (FR-WS-028, FR-WS-031).
- [x] BR-007 rewrite reflected consistently in both the Business Rules Matrix (§7.1) and the Specification.
- [x] The ~185 approved-but-undrafted Functional Requirements are recorded (§6) without being assigned individual IDs or invented wording.
- [x] All twenty-two Open Questions are included with current status and an owner (§9).
- [x] No requirement, rule or object status was upgraded to Approved without a specific, cited Product Owner Review source.

---

## 13. Out of Scope — Respected

This update does not: draft individual FR wording for the ~185-item gap (tracked as OQ-018, a separate activity); resolve the Destination Intelligence/WS1 architecture question (OQ-019, Archie's); create UX mappings, architecture components, engineering tasks, or test cases (forward-reference columns remain blank); or resolve any Open Question not explicitly addressed by the Product Owner Review evidence or Tiger's Stage 3 decisions.

## 14. Files Changed

- `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` — created (this document).

No other repository file created, modified, or deleted by this update. No `.xlsx` companion created (§3).

---

## 15. Revision History

| Version | Date | Author | EBC | Summary |
| --- | --- | --- | --- | --- |
| v1.0 | 10-Sep-2026 | Arjun | `EBC-R1.3-WS3-003` | Baseline RTM: 38 FRs, 7 NFRs, 9 Business Rules, 17 Open Questions. |
| v2.0 | 13-Sep-2026 | Arjun | `EBC-R1.3-WS3-004`, Stage 4 | Consolidated Baseline Update: 38 drafted FRs re-statused (most promoted to Approved; Itinerary Studio and Destination Intelligence FRs marked Legacy — pending rewrite; Vendor terminology corrected to Inactive); new Functional Requirement Topic Group Register added (§6) recording 223 total approved FRs without inventing wording for the ~185 not yet drafted; 10 new Business Rules added (BR-010–019), including a full rewrite of BR-007; 5 new Open Questions added (OQ-018–022); 6 existing Open Questions resolved or partially resolved. No `.xlsx` companion created — drafted/individually-traceable item count (64) remains below the 75-item threshold. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004` Stage 4. It is the extended baseline governance artifact for SMV Workspace requirements traceability — Sophie, Archie, Rad and Keerthi extend it in place; the Topic Group Register (§6) is not a substitute for individual requirement drafting and should not be treated as implementation-ready.*
