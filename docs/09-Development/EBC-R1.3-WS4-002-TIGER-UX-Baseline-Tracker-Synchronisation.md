# EBC-R1.3-WS4-002 — Release 1.3 UX Baseline & Tracker Synchronisation

| Document Information | |
|---|---|
| Document Name | Release 1.3 UX Baseline & Tracker Synchronisation |
| Persona | Tiger (Programme and Delivery Lead) |
| Card | `EBC-R1.3-WS4-002` |
| Status | Complete |
| Date | 14 September 2026 |
| Related Documents | `docs/10-Backlog/RELEASE-1.3.md` (v1.10), `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` (v1.1), `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` (v1.6), `docs/02-Product/workspace/JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md`, `docs/02-Product/workspace/JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md`, `docs/04-UX/workspace/*.md` (six files), `docs/09-Development/EBC-R1.3-WS3-006-TIGER-Delivery-Readiness-Review.md` |

---

## 1. Scope

This is a governance synchronisation activity, executed as Tiger. It formally baselines the Journey Workspace UX Architecture phase — completed by Sophie, refined with Product Owner feedback, and already committed to the repository — within Release 1.3 governance artefacts. Per the card's own instruction, this EBC did not modify any UX deliverable, Product Specification, Business Lifecycle, or UX Design Brief; it performed governance validation and made additive updates to the Release Tracker, Feature Register and Future Considerations Register only.

## 2. Repository Review

Per the Repository First Principle, every named artefact was located and read in full before any governance update was made. Nothing was requested from the Product Owner that already existed in the repository.

| Artefact | Path | Found | Status |
|---|---|---|---|
| Product Specification v2.0 | `docs/02-Product/SMV-WORKSPACE-PRODUCT-SPECIFICATION-v2.0.md` | ✅ | Read in full during `EBC-R1.3-WS3-006` (prior card in this sequence); not re-read this card — Out of Scope to modify, and its content is stable (unchanged mtime/size) |
| Requirements Traceability Matrix v2.0 | `docs/02-Product/SMV-WORKSPACE-REQUIREMENTS-TRACEABILITY-MATRIX-v2.0.md` | ✅ | As above |
| Release 1.3 Product Baseline | `docs/02-Product/RELEASE-1.3-PRODUCT-BASELINE.md` | ✅ | As above |
| Journey Workspace Business Lifecycle | `docs/02-Product/workspace/JOURNEY-WORKSPACE-BUSINESS-LIFECYCLE.md` | ✅ | Read in full this card. Status: Approved, v1.0 |
| Journey Workspace UX Design Brief | `docs/02-Product/workspace/JOURNEY-WORKSPACE-UX-DESIGN-BRIEF.md` | ✅ | Read in full this card. Status: Approved, v1.0 |
| Workspace UX Discovery | `docs/04-UX/workspace/WORKSPACE-UX-DISCOVERY.md` | ✅ | Read in full this card |
| Workspace Information Architecture | `docs/04-UX/workspace/WORKSPACE-INFORMATION-ARCHITECTURE.md` | ✅ | Read in full this card |
| Workspace Navigation Model | `docs/04-UX/workspace/WORKSPACE-NAVIGATION-MODEL.md` | ✅ | Read in full this card |
| Workspace User Journeys | `docs/04-UX/workspace/WORKSPACE-USER-JOURNEYS.md` | ✅ | Read in full this card |
| Workspace Interaction Flows | `docs/04-UX/workspace/WORKSPACE-INTERACTION-FLOWS.md` | ✅ | Read in full this card |
| Workspace Screen Inventory | `docs/04-UX/workspace/WORKSPACE-SCREEN-INVENTORY.md` | ✅ | Read in full this card |
| Release 1.3 Release Tracker | `docs/10-Backlog/RELEASE-1.3.md` | ✅ | Read in full (relevant sections); Version 1.9 confirmed as starting state |
| Release 1.3 Feature Register | `docs/10-Backlog/RELEASE-1.3-FEATURE-REGISTER.md` | ✅ | Read in full (relevant sections); Version 1.0 confirmed as starting state |
| Future Considerations Register | `docs/10-Backlog/FUTURE-CONSIDERATIONS.md` | ✅ | Read in full (relevant sections); Version 1.5, FCR-001–021 confirmed |

No referenced artefact was missing. No document was requested from the Product Owner.

**Repository state confirmed independently before any edit:** `git log` on the connected repository confirmed commit `d0d8960` ("docs(r1.3): baseline Journey Workspace UX architecture") present on `main`, containing exactly the `docs/02-Product/workspace/` and `docs/04-UX/workspace/` files this card names. `git status` showed a clean working tree (no unrelated uncommitted changes). `main` was 1 commit ahead of `origin/main` (the UX baseline commit, not yet pushed) — this is a pre-existing repository state this card did not need to resolve, since pushing is a Git-safety action requiring explicit Product Owner authorisation, not a governance-synchronisation activity.

## 3. Validation Performed — UX Completion

**All six UX deliverables exist**, at the exact repository paths this card names, each carrying a consistent Document Information header (Persona: Sophie; Release: 1.3; Workstream: **WS11 — SMV Workspace**; EBC: `EBC-R1.3-WS4-001`; Last Updated: 14 September 2026).

**Repository paths are correct** — confirmed by direct read, not assumed from the card's own listing.

**Product Owner review feedback incorporated — partially evidenced, disclosed rather than assumed.** Each of the six documents' own Document Information table carries `Status: Draft — for Product Owner / Tiger review`, and this field was not updated to Approved in any of the six files. However, three of the six carry an explicit approval statement in their own closing attribution line:
- `WORKSPACE-UX-DISCOVERY.md`: *"Status: Approved with Product Owner Review Comments."*
- `WORKSPACE-INFORMATION-ARCHITECTURE.md`: *"Reviewed by the Product Owner as part of the Release 1.3 UX Architecture Review... Status: Approved with Product Owner refinements."*
- `WORKSPACE-SCREEN-INVENTORY.md`: *"Reviewed by the Product Owner as part of the Release 1.3 UX Architecture Review... Status: Approved."*

The other three — `WORKSPACE-NAVIGATION-MODEL.md`, `WORKSPACE-USER-JOURNEYS.md`, `WORKSPACE-INTERACTION-FLOWS.md` — carry only a plain attribution line ("Prepared by Sophie... on behalf of Team Satvi, per EBC-R1.3-WS4-001") with no explicit approval or review-status statement at all.

This is disclosed as a genuine documentation-consistency gap, not smoothed over: the card's premise ("reviewed by the Product Owner, refined with approved Product Owner feedback") is well-evidenced for three of the six documents and asserted but not independently evidenced within the documents themselves for the other three. It does not block this closure — the six documents form one coherent, internally cross-referenced package produced under a single EBC, and the Product Owner's approval of the overall package (evidenced by this card's own instruction to baseline it) is treated as covering all six — but it is recommended (Section 9) that Sophie correct the Document Information "Status" field across all six files in a future documentation-hygiene pass.

**No UX deliverables remain outstanding relative to this card's own scope** (the six named files). **Relative to the Journey Workspace UX Design Brief's own §8 "Expected Deliverables" list (8 items), 3 were not produced within `EBC-R1.3-WS4-001`'s actual scope** — Low-Fidelity Wireframes, UX Standards, and a standalone UX Review Document. This is not an oversight: `WORKSPACE-SCREEN-INVENTORY.md` itself explicitly states *"No wireframe, layout or visual design is included, per this EBC's Out of Scope instruction; this inventory is the structural handoff to that future stage"* and describes itself as *"the final input Sophie's future low-fidelity wireframing stage will consume."* This is a disclosed, EBC-level scope decision, logged as `FCR-022` (Section 6 below) rather than treated as blocking this closure.

## 4. UX Completion Summary

| Design Brief §8 Expected Deliverable | Produced As | Status |
|---|---|---|
| 1. Workspace Information Architecture | `WORKSPACE-INFORMATION-ARCHITECTURE.md` | ✅ Complete |
| 2. Navigation Model | `WORKSPACE-NAVIGATION-MODEL.md` | ✅ Complete |
| 3. User Journey Maps | `WORKSPACE-USER-JOURNEYS.md` | ✅ Complete |
| 4. Screen Inventory | `WORKSPACE-SCREEN-INVENTORY.md` | ✅ Complete |
| 5. Interaction Flow Diagrams | `WORKSPACE-INTERACTION-FLOWS.md` | ✅ Complete |
| 6. Low-Fidelity Wireframes | — | Explicitly deferred (`FCR-022`) |
| 7. UX Standards | — | Explicitly deferred (`FCR-022`) |
| 8. UX Review Document | *(partially: `WORKSPACE-UX-DISCOVERY.md` serves an adjacent, not identical, purpose)* | Not produced as a standalone document |

The UX Architecture package additionally produced `WORKSPACE-UX-DISCOVERY.md`, a document not named in the Design Brief's original list but functioning as its required foundation-understanding step (Project Instructions §16.4 prerequisites).

**43 logical screens** are enumerated across the nine Workspace modules (Screen Inventory §11), each traced to an Approved Functional Requirement, Product Decision, or Business Rule (§12) — no invented scope.

**Five Open Questions now carry forward into Architecture**, one newly surfaced this phase:
- OQ-001 (Administrator/Privilege User role-capability split) — marked **Role TBC** throughout the package
- OQ-018 (detailed FR wording, ~185 of 223 requirements) — carried from the Product Baseline
- OQ-019 (Destination Intelligence vs. WS1 Bootstrap Generator architecture) — carried from the Product Baseline; Discovery's Risk R-UX-02 confirms the UX package designed around it without assuming a technical resolution
- OQ-020 (Quotation vs. Proposal Version terminology) — carried from the Product Baseline; UX package confirms adherence to the Product-Owner-approved terminology
- OQ-021 (Master/Traveller Itinerary relationship notation) — carried from the Product Baseline; UX package introduces a plain-language "based on [Master Itinerary]" treatment pending Archie's decision
- **OQ-022 (new — Generic Ownership Model scope)** — Discovery's Assumption A-UX-04 assumes Claim/Assign/Reassign applies uniformly across Journey Planning, Journey Workspace, Itinerary Studio, Vendor Management and Destination Intelligence, pending Archie/Product Owner confirmation

None of these block UX closure — each is disclosed as a UX-level assumption or an already-tracked Product Open Question, not a new business decision made under this card's authority.

## 5. Disambiguation — "WS4" vs. Workstream 11

Disclosed transparently, following the same practice already established for the WS3/WS11 collision (`EBC-R1.3-WS3-006`/`DEC-R1.3-006`):

This card, and all six UX deliverables' own Document Information tables, self-identify their EBC as `EBC-R1.3-WS4-001`/`WS4-002` and label "WS4" as the relevant workstream. **This is not this tracker's Workstream 4.** `RELEASE-1.3.md` §5 records WS4 as **Journey Passport Evolution** (Owner: Sophie/Rad/Archie, Status: Not Started) — an entirely separate, unrelated initiative, untouched by this card and unaffected by anything in this review.

The initiative this card actually closes out is **WS11 — SMV Workspace**, assigned 13-Sep-2026 under `EBC-R1.3-WS3-006`/`DEC-R1.3-006`. "WS4" in this card's own and the UX deliverables' self-identification is read as this card family's own EBC-series stage label (WS3-series = Product Definition, now WS4-series = UX Architecture) rather than a Master Workstream Tracker reference — consistent with how the prior WS3-series cards self-identified as "Workstream 3" while actually describing what the tracker now tracks as WS11. No renaming has been applied to the historical EBC IDs; this disambiguation is recorded, not silently resolved, exactly as the WS3/WS11 precedent was handled.

## 6. Future Considerations Review

The six UX deliverables were reviewed against the Future Considerations Register's own inclusion bar (§5: "explicitly names something as deferred... never speculatively"). One qualifying item was found:

**`FCR-022` (new, §3.3 UX) — Low-Fidelity Wireframes, UX Standards and a standalone UX Review Document not yet produced for Journey Workspace.** Sourced from `WORKSPACE-SCREEN-INVENTORY.md`'s own explicit deferral language (§1, §12), cross-checked against the UX Design Brief's §8 Expected Deliverables list. Logged with full description, reasoning and suggested review timing (before Journey Workspace Engineering implementation begins) in `FUTURE-CONSIDERATIONS.md` §3.3.

No other item met the inclusion bar. The five Open Questions carried into Architecture (Section 4 above) are correctly excluded from the FCR — they are Product Open Questions tracked in the Specification/RTM's own register, which `FUTURE-CONSIDERATIONS.md` §1 names as their correct home, not FCR candidates.

A new §5.1 Workstream Closure Review Log entry was added: **"Workstream 11 — SMV Workspace (UX Architecture Phase Closure)"**, Reviewed By Tiger, 14-Sep-2026, Outcome: **Addition made — FCR-022**. This mandatory assessment was recorded contemporaneously with this closure, per the FCR's own governance rule that no workstream closure may pass without a logged assessment.

## 7. Release Tracker Updates (`RELEASE-1.3.md`, v1.9 → v1.10)

All updates were additive; no existing content was removed, rewritten or restructured.

1. **Document Information** — Version 1.9 → 1.10; Related field extended with cross-references to this Delivery Review and to `docs/04-UX/workspace/`.
2. **Document Change History** — new row `1.10`, recording the full scope of this synchronisation including the WS4/WS11 disambiguation and the validation findings above.
3. **Section 3 (Release Status Dashboard)** — Overall Progress note updated: WS11 now records the UX Architecture phase complete and accepted (14-Sep-2026), Solution Architecture next.
4. **Section 5 (Master Workstream Tracker), WS11 row** — Owner column updated (Sophie: UX Architecture — complete; Archie: Solution Architecture — next); Notes extended with the UX completion summary, the new OQ-022, and a cross-reference to this Delivery Review. Status remains 🟡 In Progress (correct — the workstream overall is not yet complete; only its UX phase is).
5. **Section 7 (Product Decision Log)** — new decision `DEC-R1.3-007`, accepting the UX Architecture package as the Release 1.3 UX Baseline and certifying Ready for Solution Architecture, directly mirroring `DEC-R1.3-006`'s precedent for the preceding Product Definition phase.

Section 15 (superseded Feature Register) was **not** touched — it remains superseded per `EBC-R1.3-GOV-002`'s banner, and this card's scope does not call for further edits there.

## 8. Feature Register Validation (`RELEASE-1.3-FEATURE-REGISTER.md`, v1.0 → v1.1)

`FEAT-R1.3-013` (SMV Workspace) required updating — its Current Lifecycle Stage and Current Status were stale ("UX not yet begun" / "Ready for UX Architecture"), now that UX Architecture is complete:

- **Current Lifecycle Stage**: extended to record the completed UX Architecture step (`EBC-R1.3-WS4-001`, six deliverables) and Tiger's baseline synchronisation (`EBC-R1.3-WS4-002`), now reading **Ready for Solution Architecture**.
- **Current Status**: **Approved – UX Baseline Complete (Ready for Solution Architecture)**.
- **Primary Owner**: changed from Sophie (UX, next) to **Archie (Solution Architecture, next)**.
- **Source Backlog Reference**: extended with `DEC-R1.3-007`.
- **Notes**: extended with the WS4/WS11 disambiguation, the five carried-forward Open Questions (including new OQ-022), and the `FCR-022` cross-reference.

A corresponding Document Change History row (`1.1`) was added. No other Feature Register entry was touched; no feature added, removed or reprioritised.

## 9. Governance Outcome

The Journey Workspace UX Architecture phase is formally validated as complete against this card's own scope (six deliverables, all present, repository paths correct) and disclosed as substantially — but not uniformly — evidenced as Product-Owner-reviewed at the individual-document level (three of six carry explicit approval language; three carry none). This gap does not block closure but is recorded as a residual item for Sophie (Section 11).

Three governance artefacts now consistently reflect UX-phase completion: `RELEASE-1.3.md` (v1.10), `RELEASE-1.3-FEATURE-REGISTER.md` (v1.1), and `FUTURE-CONSIDERATIONS.md` (v1.6). The WS4/WS11 naming collision is disclosed, not silently resolved, consistent with this project's established practice. One new Future Consideration (`FCR-022`) was logged from evidence explicitly present in the reviewed documents, not invented.

No UX deliverable, Product Specification, Business Lifecycle document, or UX Design Brief was modified. No new Product decision, business rule, or UX redesign was introduced. No Architecture work was performed.

## 10. Readiness Assessment

There are now three internally consistent baselines for the Journey Workspace initiative, each traceable to its own governance chain:

- **Product Baseline** — Specification/RTM v2.0, certified Ready for UX Architecture by `EBC-R1.3-WS3-006`/`DEC-R1.3-006` (13-Sep-2026).
- **UX Baseline** — six-document UX Architecture package, certified Ready for Solution Architecture by this card/`DEC-R1.3-007` (14-Sep-2026).
- **Release Governance Baseline** — `RELEASE-1.3.md`, `RELEASE-1.3-FEATURE-REGISTER.md` and `FUTURE-CONSIDERATIONS.md`, now synchronised with both of the above.

The Workspace feature (`FEAT-R1.3-013`, WS11) is ready for Archie to begin Solution Architecture, with five scoped Open Questions (OQ-001, OQ-018–022) and one Future Consideration (`FCR-022`) explicitly carried forward rather than silently dropped.

## 11. Recommendations

1. **Documentation hygiene (Sophie, non-blocking):** correct the Document Information "Status" field across all six UX deliverables from "Draft — for Product Owner / Tiger review" to "Approved," for consistency with the two Workspace Foundation documents (which correctly show "Status: Approved") and with the three UX documents' own closing-attribution approval lines. Also consider adding an explicit approval line to `WORKSPACE-NAVIGATION-MODEL.md`, `WORKSPACE-USER-JOURNEYS.md` and `WORKSPACE-INTERACTION-FLOWS.md`, which currently carry none.
2. **Architecture (Archie, next):** OQ-019 (Destination Intelligence/WS1 Bootstrap Generator reconciliation), OQ-020 (Quotation/Proposal Version domain modelling), OQ-021 (Master/Traveller Itinerary notation) and the new OQ-022 (Generic Ownership Model scope) are all explicitly routed to Archie by the UX package itself; recommend Solution Architecture begin by resolving or scoping these rather than treating them as pre-resolved.
3. **Future wireframing stage:** `FCR-022` should be revisited before Engineering implementation begins, per its own suggested review timing — Low-Fidelity Wireframes and UX Standards are natural prerequisites for Rad's estimation and build once Solution Architecture has established technical/component constraints.
4. **Unrelated, pre-existing item (not part of this card's scope):** `RELEASE-1.3.md` carries a stale "Last Updated: 08 September 2026 / Document Version: 1.3" block within Section 1 (Release Overview), inconsistent with the Document Information table at the top of the same file (now Version 1.10). This predates this card and several prior versions; flagged for a future documentation-hygiene pass rather than corrected here, consistent with this card's instruction to make only the specific governance updates it names.

## 12. Formal Workstream Closure

The Journey Workspace **UX Architecture phase** of Workstream WS11 (SMV Workspace) is formally closed. This closure covers `EBC-R1.3-WS4-001` (UX Architecture & Experience Discovery) and is synchronised into governance by this card, `EBC-R1.3-WS4-002`.

This closure does **not** close Workstream WS11 as a whole — Solution Architecture, Engineering, QA and Traveller Experience Validation remain outstanding for this initiative. The baton passes from Sophie to **Archie** for Solution Architecture.

---

*Prepared by Tiger (Programme and Delivery Lead) on behalf of Team Satvi.*
*Acceptance Criteria confirmed: WS11's UX phase formally marked Complete (§7); Release Tracker synchronised (§7); Feature Register validated and updated (§8); Future Considerations reviewed with one new entry logged (§6); this Delivery Review created; repository traceability intact throughout — no UX deliverable, Product artefact, or historical record was modified or removed.*
