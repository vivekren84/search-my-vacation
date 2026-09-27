# Search My Vacation — SMV Workspace: Requirements Traceability Matrix

## 1. Document Header

| Document field | Value |
| --- | --- |
| **Version** | v2.1 — v2.0 baseline plus the additive WS13 Journey Workspace addendum (§16, `EBC-R1.3-WS13-001`, synchronised by `EBC-R1.3-WS13-001B` and `EBC-R1.3-WS13-003A`) |
| **Status** | Consolidated Baseline Update — extends the v1.0 baseline with the complete Release 1.3 Product Owner Review. Drafted Functional Requirements (existing 38) are traced and status-updated; the approximately 195 net-new Functional Requirements approved by count/topic-group only are recorded as a Topic Group Register (§6), not as individually numbered rows, per Tiger's explicit instruction not to invent FR wording. |
| **Owner** | Arjun, Product and Business Analyst, on behalf of Team Satvi |
| **Persona** | Arjun — Product and Business Analyst |
| **Last updated** | 27 September 2026 (§16 addendum, final WS13 sync); v2.0 body 13 September 2026 |
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
| Journey Workspace | 4 (v2.0) → 31 + 3 (D-11) drafted and Approved in §16 (v2.1) | **31** | FR-WS-017 – FR-WS-020; FR-JW-05 – FR-JW-34 (§16, Approved) |
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
| Journey Workspace | 31 | 4 (FR-WS-017–020); **v2.1: all 31 drafted, §16** | 0 (all drafted and Approved, §16) | Journey creation; operational management; booking coordination; traveller servicing; vendor coordination; operational readiness; task management; notifications; search; audit history; governance; operational alerts |
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
| v2.1 | 24-Sep-2026 | Arjun | `EBC-R1.3-WS13-001` | Additive WS13 Journey Workspace addendum (§16): FR-JW-05–31 drafted within the approved 31, FR-JW-32–34 proposed additions, BR-025–036, OQ-023–030. No existing row renumbered or removed. Pending Product Owner ratification. |
| v2.1 (sync) | 24-Sep-2026 | Arjun | `EBC-R1.3-WS13-001B` | §16 synchronised with Product Owner decisions D-01–D-13: all 34 FR-JW rows Approved (baseline synchronised); BR-025–036 revised where decided and BR-037–042 added; OQ-023–030 resolved or reclassified; OQ-004/OQ-017 closed. No identifier renumbered. |
| v2.1 (003A) | 26-Sep-2026 | Arjun | `EBC-R1.3-WS13-003A` | §16 synchronised with Product Owner decisions POD-01–POD-08: eleven FR-JW rows amended (summary, decisions, rules); BR-026/027/028/038/039/041 amended; BR-043–045 added. No FR added; no identifier renumbered; no screen mapping changed. |
| v2.1 (final sync) | 27-Sep-2026 | Arjun | `EBC-R1.3-WS13-004A` decisions | §16 synchronised with PD-A to PD-E and O-A2 to O-A5: FR-JW-06 and FR-JW-12 refreshed; BR-027/036/039/043 amended; BR-046 (Replacement Journey inheritance) and BR-047 (proposal review guidance) added. No FR added; no identifier renumbered; no screen mapping changed. Product Owner clarification O-13 reflected in BR-036 and BR-043 (Service Category assigned by the Journey Owner at legacy adoption); O-12 (Vendor Code format) is canonical in Spec v2.0 §20. |

---

*This document is prepared by Arjun, Product and Business Analyst, on behalf of Team Satvi, per `EBC-R1.3-WS3-004` Stage 4. It is the extended baseline governance artifact for SMV Workspace requirements traceability — Sophie, Archie, Rad and Keerthi extend it in place; the Topic Group Register (§6) is not a substitute for individual requirement drafting and should not be treated as implementation-ready.*

---

## 16. Addendum v2.1 — WS13 Journey Workspace (`EBC-R1.3-WS13-001`, synchronised by `EBC-R1.3-WS13-001B` and `EBC-R1.3-WS13-003A`)

**Added 24 September 2026 by Arjun. Synchronised the same day with the Product Owner Review decisions D-01 to D-13.** This section only adds to the RTM; no existing row, identifier or count above is altered. Source: `docs/09-Development/EBC-R1.3-WS13-001-ARJUN-Journey-Workspace-Product-Discovery-and-Business-Analysis.md`, **Revision 3** (Sections 11.2, 12, 14, 23, 26, 27). **Synchronised again on 26 September 2026** with the Product Owner decisions POD-01 to POD-08 (`EBC-R1.3-WS13-003A`) and, on 27 September 2026, PD-A to PD-E and O-A2 to O-A5 (`EBC-R1.3-WS13-004A`). The Journey Workspace row of the Topic Group Register (§6) is fully drafted: 31 of 31 approved FRs, plus `FR-JW-32`–`34` approved by D-11 as completing, not expanding, scope.

**Status note:** all 34 rows below are **Approved — baseline synchronised (001B)**, pending Tiger's Product Baseline Verification (`EBC-R1.3-WS13-001C`). Eleven rows (`FR-JW-01`, `06`, `09`, `12`, `13`, `15`, `21`, `22`, `23`, `30`, `31`) were amended by `003A` (Revision 3); no FR was added. Module identifiers `FR-JW-nn` are the RTM keys for this module; no new `FR-WS-0nn` numbers are assigned (§16.5). No Revision 1 identifier is renumbered.

### 16.1 Functional Requirements — Journey Workspace

| ID | Requirement (summary) | Priority | Status | Lifecycle | Product Decision(s) | Business Rules / Depends | UX Screen | Architecture | Engineering | QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-JW-01 | The Journey Workspace shall be the single working record for one Journey: its party and **Primary Operational Contact**, current stage, linked itinerary, linked Vendor Bookings, and Tasks/Follow-ups. | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | Spec §6.4; D-12; POD-02; POD-07 | BR-005, BR-040, BR-043 | JW-02 | | | |
| FR-JW-02 | The Journey Workspace shall show the Journey's full stage history. | Must | Approved — baseline synchronised (001B) | Journey Delivery | PD-JW-006 | NFR-WS-004 | JW-08 | | | |
| FR-JW-03 | The Journey Workspace shall present the Active Journeys queue (Phase 2 only) with the Generic Ownership Model's assign and reassign behaviour. **Because every Journey is created owned, there is no… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | Spec §6.4; D-03 | BR-026, BR-035 | JW-01 | | | |
| FR-JW-04 | A Journey's status field shall be system-derived, never a freely editable dropdown. | Must | Approved — baseline synchronised (001B) | Journey Delivery | Spec §6.4 | BR-005 | JW-02 | | | |
| FR-JW-05 | A Journey shall be created only by the Confirmed closure of a Journey Planning Record. The Workspace, including the Journey Workspace Dashboard, shall provide **no capability to create a… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-JW-001; D-09 | BR-012 | JW-01; DASH-01 | | | |
| FR-JW-06 | On creation the Journey shall carry from the originating record: party (Traveller or Corporate Point of Contact); Destination/Region; **Confirmed Travel Start and End Dates**; trip parameters; the… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PD-JW-001; D-02; D-12; DEC-R1.3-014; POD-06; POD-07; PD-A; PD-B | BR-012, BR-026, BR-027, BR-034, BR-040, BR-043, BR-046 | JW-02, JW-03 | | | |
| FR-JW-07 | A newly created Journey shall enter **Confirmed**, owned by **the Journey Planning Record's current owner**, and shall raise an Informational "Journey confirmed" notification to that owner. | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-JW-001; D-03 | BR-025, BR-026 | JW-01 | | | |
| FR-JW-08 | The Journey shall follow the approved lifecycle (Section 10): Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed, with On Hold, Cancelled… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-JW-005; D-01; D-13 | BR-025 | JW-02, JW-08 | | | |
| FR-JW-09 | Advancing a Journey shall be a deliberate action by its owner or an Administrator, subject to these gates: Readiness Template assigned before leaving Confirmed; all **Mandatory applicable** readiness… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | D-01; D-04; POD-01 | BR-004, BR-028, BR-041 | JW-02, JW-05 | | | |
| FR-JW-10 | Place On Hold (from Confirmed, In Preparation or Ready to Travel) with a reason; resume to the held-from stage. | Must | Approved — baseline synchronised (001B) | Journey Delivery | PD-JW-004 | BR-029 | JW-02 | | | |
| FR-JW-11 | Closing shall use exactly one terminal outcome valid for the current stage: **Journey Closed** (from Post Travel) or **Cancelled** (reason required). **Superseded** is set only through `FR-JW-12`.… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-JW-005; D-01; D-08 | BR-030 | JW-02 | | | |
| FR-JW-12 | For a **material change** (Section 10.6), the Workspace shall support: placing the Journey On Hold; creating a linked, pre-filled Journey Planning Record; and, when that record converts, marking the… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PD-JW-004; D-06; D-13; POD-06; PD-B; O-A2–O-A4 | BR-031, BR-039, BR-012, BR-046 | JW-02 → JP-02 | | | |
| FR-JW-13 | **Operational changes**, meaning those not affecting commercial agreements, pricing, vendor commitments, traveller composition or travel schedule, shall be recorded as Change Records on the same… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PD-JW-003; D-06; POD-04 | BR-032, BR-037, BR-045 | JW-02 | | | |
| FR-JW-14 | The Journey shall display its Confirmed Travel Start and End Dates, set at creation. They are **not editable** in Journey Workspace, and a date change is a material change (`FR-JW-12`). | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | D-02; D-06 | BR-027, BR-031 | JW-02 | | | |
| FR-JW-15 | The owner shall create one or more Vendor Bookings for the Journey: Vendor (Active only), **service type**, service date(s) and notes. Each starts in **Draft**. | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PO-REVIEW-04 §6; D-07; POD-05 | BR-033, BR-037 | JW-04 | | | |
| FR-JW-16 | Vendor Booking status shall change only by deliberate, logged actions following Section 11.1. Booked requires a booking reference; Pending Information and Cancelled require a reason; re-entry to… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-JW-006; D-07 | BR-033, BR-037 | JW-04 | | | |
| FR-JW-17 | The Journey shall show its booking status summary (counts by status), and bookings in Requested or Pending Information shall feed the Pending Vendor Confirmations KPI and the Workspace-wide Vendor… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | FR-VM-03; FR-DASH-05; D-07 | BR-037 | JW-02, JW-04, VM-04 | | | |
| FR-JW-18 | Log vendor coordination activity against a Vendor Booking. | Must | Approved — baseline synchronised (001B) | Journey Delivery | PO-REVIEW-04 §3 | — | JW-04 | | | |
| FR-JW-19 | Log communications and servicing activity with the Traveller(s) or the Primary Operational Contact, before, during and after travel. | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PO-REVIEW-04 §3; D-12 | BR-040 | JW-02 | | | |
| FR-JW-20 | Operational Notes are append-only; corrections are made as new notes. | Must | Approved — baseline synchronised (001B) | Journey Delivery | PD-JW-006 | BR-007 | JW-02 | | | |
| FR-JW-21 | The owner shall manage **Document Readiness**: **Journey Documents** per Journey or per traveller, each referencing a configured **Document Type** and carrying document status (Outstanding / Received… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PO-REVIEW-04 §6; D-10; POD-03 | BR-044 | JW-07 | | | |
| FR-JW-22 | The Journey shall present readiness across the four categories, derived from its **single active Readiness Template**, with an overall state of Not Ready, At Risk or Ready. | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PO-REVIEW-04 §6; D-04; POD-01 | BR-028, BR-041 | JW-05 | | | |
| FR-JW-23 | Readiness Templates shall be configuration-driven, with Domestic and International defaults, extensible without code changes. Each template item is **Mandatory** or **Optional**. The owner assigns… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | D-04; POD-01; POD-03; POD-08 | BR-018, BR-041, BR-044 | JW-05 | | | |
| FR-JW-24 | The owner shall create Tasks and Follow-ups on a Journey, assign them to any Workspace User, and complete or cancel them. Each carries a configurable category (at minimum Operational, Traveller… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | BR-008/009; D-05 | BR-042 | JW-06 | | | |
| FR-JW-25 | Journey task overview; Journey tasks included in Tasks Due Today and Upcoming Tasks. | Must | Approved — baseline synchronised (001B) | Journey Delivery | FR-DASH-05 | — | JW-06, DASH-01 | | | |
| FR-JW-26 | The Workspace shall raise **configurable** Action Required alerts covering journey milestones, payment reminders, traveller follow-ups, operational tasks, vendor bookings, document readiness, On… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-NO-003/004; D-05; D-08 | BR-017, BR-042 | NOT-01, JW-02 | | | |
| FR-JW-27 | Informational notifications: Journey confirmed; assigned or reassigned to you; placed On Hold or resumed; Journey Closed or Cancelled; **Journey Superseded**; archived. | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PD-NO-003; D-13 | BR-017 | NOT-01 | | | |
| FR-JW-28 | Alert banner on the Journey and an at-risk indicator in the list. | Must | Approved — baseline synchronised (001B) | Journey Delivery | PO-REVIEW-04 §9 | BR-017 | JW-01, JW-02 | | | |
| FR-JW-29 | Search by Journey reference, traveller name or mobile, Corporate Point of Contact, **Primary Operational Contact**, and destination. Filter by stage, owner (Mine / named user), On Hold, readiness,… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | Topic "search"; D-01; D-08; D-12; D-13 | BR-001 | JW-01, global search | | | |
| FR-JW-30 | Journey Timeline covering all events, as in Revision 1, plus Primary Operational Contact changes, **Service Category changes**, Vendor Booking lifecycle transitions, Readiness Template assignment and… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | PD-JW-006; D-08; POD-07; POD-08 | NFR-WS-004, BR-043 | JW-08 | | | |
| FR-JW-31 | No permanent deletion of any Journey data. Ownership may be reassigned at any time **before a terminal outcome**, with every change audited. **Archive** is an administrative action by authorised… | Must | Approved — baseline synchronised (001B); amended by 003A (Rev 3) | Journey Delivery | BR-007; D-03; D-08; POD-08 | BR-007, BR-026, BR-035, BR-038 | all JW | | | |
| FR-JW-32 | The **Journey Workspace Dashboard** is an operational management view (D-09) summarising **Active Leads, Journey Planning, Active Journeys, Tasks, Payments, Vendor Bookings, Alerts and Recent… | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | PO-REVIEW-04 §8; D-09; D-11 | — | DASH-01/02 | | | |
| FR-JW-33 | Journey events (confirmed, reassigned, stage change, On Hold or resume, booking Booked, Superseded, closure, archive) appear in Dashboard Recent Activity. | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | D-11 | — | DASH-01/02 | | | |
| FR-JW-34 | The Active Journeys list opens with a summary strip showing counts per D-01 stage, At Risk, Departing within the configured window, and On Hold. Each count is a one-click filter. | Must | Approved — baseline synchronised (001B) (Rev 2) | Journey Delivery | D-01; D-11 | — | JW-01 | | | |

Traceability for every row: Feature `FEAT-R1.3-013` → Workstream WS13 → Product Vision (Spec §2).

### 16.2 Business Rules — WS13 (`BR-025`–`BR-047`)

| ID | Business Rule | Status | Source |
| --- | --- | --- | --- |
| BR-025 | Journey lifecycle. Confirmed → In Preparation → Ready to Travel → Travelling → Travel Complete → Post Travel → Journey Closed. Supporting states: On Hold (pause), Cancelled (terminal) and Superseded (terminal). Archived is an administrative state outside the lifecycle. Only Section 10.2 transitions are allowed. | Approved — synchronised (001B); Revised | D-01, D-08, D-13 |
| BR-026 | No unassigned Journey. Every Journey has an owner from creation: the Journey Planning owner at conversion. Conversion of a Journey Planning Record that has no assigned Journey Owner is rejected, and the user receives a validation message. Ownership may be reassigned at any time before a terminal outcome. Every ownership change is audited. | Approved — synchronised (001B); Revised (was the "Ownership Gate"); amended by 003A (Rev 3) | D-03; POD-06 Policy 1 |
| BR-027 | Confirmed Travel Dates at confirmation. A Journey may not be created without a Confirmed Travel Start Date and End Date (End ≥ Start). The dates are captured in Journey Planning before the record closes as Confirmed. At conversion the Number of Nights must be present (a missing value blocks conversion), and the Confirmed Travel Dates are validated against it; if they are inconsistent, conversion is blocked and the user must resolve the mismatch. Neither value is corrected automatically. | Approved — synchronised (001B); Revised (gate moved from leaving Confirmed to conversion); amended by 003A (Rev 3) | D-02; POD-06 Policy 2; PD-A |
| BR-028 | Readiness gate. A Journey cannot enter Ready to Travel while any Mandatory applicable item of its active Readiness Template is Outstanding. Optional items never block readiness. Not Applicable with a reason, available on the items the template permits, counts as resolved. Readiness is calculated dynamically from the template and item statuses and is never stored. | Approved — synchronised (001B); Unchanged in substance; amended by 003A (Rev 3) | `PO-REVIEW-04` §6; D-04; POD-01 |
| BR-029 | On Hold. A temporary pause, allowed from Confirmed, In Preparation or Ready to Travel, with a reason. The Journey resumes to its held-from stage, or ends as Cancelled or Superseded. | Approved — synchronised (001B); Revised (adds Superseded as an exit) | `PD-JW-004`; D-01 |
| BR-030 | Terminal outcomes. Journey Closed (only from Post Travel), Cancelled (reason; allowed from Confirmed through Travelling, or On Hold) and Superseded (`BR-039`) are final and irreversible. Archived is not a terminal outcome (`BR-038`). A traveller returning after cancellation starts a new Journey Planning Record. | Approved — synchronised (001B); Revised | D-01, D-08 |
| BR-031 | Material elements immutable. A Journey's destination, confirmed travel dates, number of nights and traveller count cannot be changed on the Journey. Any material change follows `BR-039`. | Approved — synchronised (001B); Revised (extended from destination only) | `PD-JW-004`; D-06 |
| BR-032 | Operational versus material change. Changes that do not affect commercial agreements, pricing, vendor commitments, traveller composition or travel schedule are Change Records on the same Journey. Material changes (meal plan, hotel room type, destination, nights, travel dates, traveller count, hotel category, flight class, major itinerary changes) are never Change Records. They follow `BR-039` in Release 1.3; the in-place amendment capability is `PEB-001`. | Approved — synchronised (001B); Revised | D-06 |
| BR-033 | Booking history preservation. Vendor Bookings are never deleted or overwritten. Booked requires a booking reference. | Approved — synchronised (001B); Unchanged in substance | `PD-JW-006`; D-07 |
| BR-034 | Journey party. A Journey carries exactly one of Traveller or Corporate Point of Contact, inherited at conversion and never changed. This is distinct from the Primary Operational Contact (`BR-040`). | Approved — synchronised (001B); Clarified | WS12 Decision 2; D-12 |
| BR-035 | Collaborative visibility, owner-scoped change. Every Workspace User can view every Journey. Changes are limited to the owner and Administrators. There is no "claim" action on Journeys (`BR-026`). | Approved — synchronised (001B); Revised | Data Architecture §5; D-03 |
| BR-036 | Legacy Journey adoption. Journeys created before WS13's release are adopted as part of release: owner = the originating planning record's owner (an Administrator assigns one if absent), confirmed dates recorded, Readiness Template assigned, stage = Confirmed, and Primary Operational Contact initialised from the party. Until adopted, a legacy Journey is flagged "Incomplete legacy record" and cannot progress. No historical data is lost. A legacy Journey may remain without a Service Category until it enters the Journey Workspace through adoption. During adoption, the Journey Owner must explicitly assign the Service Category. No automatic classification or backfilling occurs (PD-C, clarified by O-13). | Approved — synchronised (001B); Revised; amended by 003A (Rev 3) | F-02; D-02, D-03; PD-C; O-13 |
| BR-037 | Vendor Booking lifecycle. Draft → Requested → Pending Information → Confirmed → Booked, with Cancelled terminal (Section 11.1). There is no "Amended" status: a change to a Confirmed or Booked booking returns it to Requested until reconfirmed. | Approved — synchronised (001B); New | D-07 |
| BR-038 | Archive is administrative. Archived is outside the lifecycle and never changes stage or outcome. Authorised users may archive at any time, with a reason; user, timestamp and audit entry are recorded. A Journey becomes Archive Eligible when it has been Journey Closed for longer than the configured retention period (Release 1.3 default 60 days), and authorised users are then reminded. An Archived Journey remains viewable, searchable and available for reporting and audit, and is read-only. Restoration is outside Release 1.3; any future restoration is an administrative operation. | Approved — synchronised (001B); New; amended by 003A (Rev 3) | D-08; POD-08 Decision 2 |
| BR-039 | Material replacement and supersession. When a material change requires a replacement Journey: the original is placed On Hold; a linked Journey Planning Record is created and follows standard planning; its conversion creates the replacement Journey (preserving `BR-012`); the original is marked Superseded (not Cancelled) with reason "Material Amendment"; the two Journeys are linked both ways; and the replacement continues the operational lifecycle. The replacement Journey Planning Record defaults to Origin Channel = Existing Traveller and stage = Lead Created, inherits the Journey Owner, and receives an auto-generated title that references the original Journey. Traceability is through the replacement relationship; no new lifecycle stage is introduced. The replacement inherits the original Journey's approved operational context (`BR-046`). | Approved — synchronised (001B); New; amended by 003A (Rev 3) | D-13, `PD-JW-004`; POD-06 Policy 3; PD-B |
| BR-040 | Primary Operational Contact. Each Journey has exactly one Primary Operational Contact in Release 1.3, of type Individual traveller, Corporate organisation, B2B travel partner or Other authorised coordinating entity. It is distinct from the Journey Owner and the Traveller(s). Changes are audited. | Approved — synchronised (001B); New | D-12 |
| BR-041 | One active Readiness Template. Each Journey uses exactly one active Readiness Template, assigned before it leaves Confirmed. Templates are configuration (Domestic and International defaults) and extensible without code. Each template defines Mandatory Items and Optional Items and marks which items permit Not Applicable. The framework supports further templates in future without change to these rules. When a Journey's template changes, template-generated items are recalculated according to the new template; manually created items are retained and are never removed automatically. | Approved — synchronised (001B); New; amended by 003A (Rev 3) | D-04; POD-01; POD-08 Decision 1 |
| BR-042 | Configurable, low-overhead alerts. Alert conditions, thresholds, windows and the archive retention period are configuration with Release 1.3 business defaults, never hard-coded. Reminders exist to reduce operational effort, so no alert may duplicate another for the same condition. | Approved — synchronised (001B); New | D-05, D-08 |
| BR-043 | Primary Service Category. Each Journey has exactly one primary Service Category from the configured Service Category list (§11.2). Exception: a legacy Journey may remain unclassified until adoption, when the Journey Owner must explicitly assign it (`BR-036`, PD-C, O-13). Service Category is optional during Journey Planning and mandatory before Journey conversion. After creation it may be changed by an authorised Workspace user (the owner or an Administrator), and every change is recorded in the Journey History. A change of Service Category is a business classification, not a structural change, so it never requires a Replacement Journey. The Service Category classifies the traveller experience only; destination geography is recorded independently and is never derived from, or constrained by, the Service Category. The Service Category does not select the Readiness Template. | Approved — synchronised (003A); New (Rev 3) | POD-02; POD-07; PD-C; O-13 |
| BR-044 | Document Types and Journey Documents. Document Types are configurable master reference data, grouped by the categories in §11.2. Every Journey Document references exactly one Document Type, and one Document Type may be referenced by many Journey Documents on the same Journey. The Journey's Readiness Template determines whether a Document Type is Mandatory, Optional or Not Applicable for that Journey. No document content is stored in Release 1.3. | Approved — synchronised (003A); New (Rev 3) | POD-03, D-10 |
| BR-045 | Change Category is classification only. Every Change Record carries one Change Category from the configured list (§11.2). The category describes the nature of the change. It never determines whether a change is operational or material (`BR-032` does), and it never triggers a Replacement Journey, an Operational Update or a Readiness Update. | Approved — synchronised (003A); New (Rev 3) | POD-04 |
| BR-046 | Replacement Journey inheritance. A Replacement Journey Planning Record, and the Replacement Journey it converts into, inherit the approved operational context of the original Journey, so that planning restarts from what was agreed rather than from nothing. The inherited context is: the travel dates and trip parameters as editable defaults; the party, destination and Service Category; the accepted itinerary as the starting proposal (Version 1); the Operational Notes; a vendor quotation baseline; and, at conversion, the Primary Operational Contact and the Journey Documents. Vendor quotations: only vendor bookings in Booked status generate replacement quotations (Confirmed-but-not-Booked bookings are not converted), and only for vendors whose lifecycle is Active (inactive vendors generate none). Journey Documents: on replacement conversion, a Verified document becomes Received and a Not Applicable document becomes Outstanding, so every Replacement Journey goes through an operational document review after a material change. Historical records of the original Journey are never altered. The technical mapping is defined in `EBC-R1.3-WS13-004A` §4 and is not repeated here. | Approved — synchronised (003A final sync); New (Rev 3) | PD-B; O-A2; O-A3; O-A4 |
| BR-047 | Review the carried proposal before sharing. The proposal copied into a Replacement Journey Planning Record is the planner's starting point. Workspace users are expected to review and update it before sharing it with the traveller. This is an operational expectation, not a system-enforced workflow: Release 1.3 adds no rule requiring Version 1 to be revised before sharing. Any future enforcement will be considered in a later release. | Approved — synchronised (003A final sync); New (Rev 3) | O-A5 |

Revision 3 (`EBC-R1.3-WS13-003A`): `BR-026`, `027`, `028`, `036`, `038`, `039` and `041` amended and `BR-043`–`047` added to reflect Product Owner decisions POD-01 to POD-08, PD-A to PD-E and O-A2 to O-A5 (`EBC-R1.3-WS13-004A`). The Vendor Code policy (PD-D) is canonical in Product Specification v2.0 §20. The Vendor baseline (POD-05) has no WS13 rule; it is canonical in Product Specification v2.0 §20 and traces to `FR-JW-15`.

Refined existing rules: `BR-024` (WS12 Travel Date Deferral) is refined by D-02 / `BR-027`. The confirmation point is now Journey Planning → Journey conversion (see `EBC-R1.3-WS12-003` Revision 3).

### 16.3 Open Questions

| ID | Open Question | Status | Owner |
| --- | --- | --- | --- |
| OQ-023 | Legacy "Booking" vs Vendor Booking | **Resolved:** D-07, one object | — |
| OQ-024 | Human-readable Journey reference format | **Reclassified to Architecture:** not a product ambiguity | Archie |
| OQ-025 | Journey copy vs reference of trip parameters | **Reclassified to Architecture:** business rule fixed (planning record never changes) | Archie |
| OQ-026 | Meaning of "Verified" document | **Resolved:** D-10 synchronisation | — |
| OQ-027 | Per-traveller documents without companion records | **Resolved:** D-10 | — |
| OQ-028 | Open tasks before Journey Closed | **Resolved:** D-01, no such gate | — |
| OQ-029 | Vendor cancellation costs | **Resolved:** out of R1.3 scope (no payment object; I-01) | — |
| OQ-030 | Upcoming Departures window | **Resolved:** D-05, configurable (default = readiness window) | — |

Existing items: **OQ-004 closed** (D-01); **OQ-017 closed** (D-02); **OQ-022 answered for Journey Workspace** (D-03).

### 16.4 Declared interpretation awaiting confirmation

**I-01 — Payments.** In Release 1.3, "Payments" (D-09) and "payment reminders" (D-05) are represented as Payment-category Tasks and Follow-ups; no payment object is introduced. This needs a one-line Product Owner confirmation at `001C`. I-02 to I-04 are recorded in the source document §26.2.

### 16.5 Finding carried to Tiger (F-06)

This RTM was not updated when WS12 drafted `FR-JP-06`–`36` and `BR-020`–`024`. A separate housekeeping pass should back-fill WS12 and confirm whether module IDs (`FR-JP-nn`, `FR-JW-nn`) are the long-term RTM keys.
