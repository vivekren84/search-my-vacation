# DEC-R1.2-015 — Ratification of ADR §15 Decision 2 (Warn Mode First)

## Engineering Briefing Card (EBC)

**Project:** Search My Vacation (SMV) Website Rebuild
**Release:** Release 1.2
**Workstream:** WS3 – Destination Intelligence
**Decision ID:** DEC-R1.2-015
**Decision Type:** Governance Ratification
**Title:** Formal Ratification of ADR §15 Decision 2 – Warn Mode First
**Author:** Tiger (Programme & Delivery Lead)
**Decision Authority:** Vivek (Business Owner / Product Manager)
**Architecture Reviewer:** Archie (Architecture Lead)
**Implementation Owner:** Rad (Engineering Lead)
**Status:** Approved
**Priority:** High (Governance)
**Implementation Impact:** None (Documentation & Governance Only)
**Approved:** 19 August 2026 (Vivek — Business Owner)

---

# Repository Information

**Repository Name**

```text
SearchMyVacation
```

**Repository Root**

```text
/Users/viveksophu/Documents/Projects/SearchMyVacation
```

---

# Document Location

```text
docs/09-Development/
└── DEC-R1.2-015-Ratification-Warn-Mode-First.md
```

---

# Related Documents

### Primary References

- `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`
- `docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`
- `docs/09-Development/R1.2-WS3-IMP-01-EBC-RAD-Phase-2-Generator-Vocabulary-Alignment.md`
- `docs/09-Development/R1.2-WS3-IMP-01-EBC-ARCHIE-Document-Compliance-Review.md`
- `docs/10-Backlog/RELEASE-1.2.md`

---

# Executive Summary

During the Architecture & Governance Compliance Review of the Phase 2 implementation EBC, Archie identified that **ADR §15 – Decision 2 (Warn Mode vs. Block Mode)** remained documented as an architectural recommendation rather than a formally ratified governance decision.

Although the ADR already recommends Warn Mode as the preferred operational strategy, the absence of a formal decision record created an unnecessary governance gap. This decision closes that gap without changing architecture, implementation scope, runtime behaviour, or previously approved work packages.

This EBC formally ratifies **Warn Mode First** as the approved operating model for Release 1.2 Phase 2.

---

# Background

ADR-R1.2-WS3-001 established that validation introduced during Phase 2 should initially operate in **Warn Mode**, allowing reconciliation reports to surface inconsistencies without blocking generation.

The Phase 2 implementation plan and implementation EBC both assume this behaviour.

During the compliance review, Archie confirmed that this assumption is technically correct but observed that Decision 2 had not been recorded in the ADR's Decision History in the same manner as Decision 1 (Steward Appointment).

This EBC provides the formal governance approval required to complete that decision trail.

---

# Problem Statement

Current status:

- ADR recommends Warn Mode.
- Phase 2 implementation assumes Warn Mode.
- Architecture review agrees with Warn Mode.
- Product intent supports Warn Mode.

However, no explicit governance decision currently records that recommendation as formally approved.

This creates a documentation inconsistency rather than an architectural or implementation issue.

---

# Decision

**Decision:** Release 1.2 Phase 2 shall operate using **Warn Mode** for all reconciliation and validation activities introduced under WP-4 and WP-5.

Validation findings shall be reported but shall **not** prevent generator execution.

Blocking behaviour is **not approved** for Release 1.2 Phase 2.

---

# Decision Rationale

Warn Mode is approved because it:

- supports safe adoption of the new reconciliation process;
- allows Product to review findings before enforcement;
- minimises regression risk during generator alignment;
- preserves uninterrupted engineering workflows;
- aligns with the governance-first philosophy established for WS3.

This approach provides visibility into inconsistencies without introducing unnecessary operational disruption.

---

# Scope

## In Scope

- Formal governance approval of Warn Mode.
- ADR Decision History update.
- Release tracker update (if applicable).
- Traceability between ADR and implementation EBC.

## Out of Scope

This decision does **not**:

- change generator behaviour;
- introduce Block Mode;
- modify runtime logic;
- alter implementation scope;
- change controlled vocabularies;
- modify architecture;
- require application code changes.

---

# Implementation Impact

| Area | Impact |
|------|--------|
| Architecture | None |
| Application Code | None |
| Generator Logic | None |
| Runtime | None |
| Documentation | ADR update only |
| Release Scope | None |

---

# Governance Actions

Upon approval:

1. Add a Decision History entry to ADR-R1.2-WS3-001 recording Decision 2 as **Approved**.
2. Cross-reference Decision ID **DEC-R1.2-015** within the ADR.
3. Update `RELEASE-1.2.md` if governance decisions are tracked there.
4. Record completion in the WS3 governance log (if maintained).

No additional engineering work is authorised or required by this decision.

**Completion note (19 August 2026, Tiger):** Actions 1–3 above were completed as part of this ratification — see the ADR's Section 15 (Decision 2) and Section 17 (Decision History), and `RELEASE-1.2.md` Section 7 (`DEC-R1.2-015`) and Document Change History. Action 4 (WS3 governance log) does not apply: no separate WS3 governance log document exists in the repository outside the ADR's own Decision History and this tracker's Decision Log, which together already serve that function.

---

# Risk Assessment

## Current Risk

Without ratification, implementation proceeds on an implied recommendation rather than a formally approved governance decision.

## Residual Risk After Ratification

None identified.

Warn Mode remains the lowest-risk operational approach and preserves the existing implementation safeguards.

---

# Dependencies

Requires:

- Completion of the Archie compliance review.
- Existing ADR-R1.2-WS3-001.

Enables:

- Unambiguous commencement of WP-4.
- Clear governance traceability.
- Consistent decision history within the ADR.

---

# Acceptance Criteria

This decision shall be considered complete when:

- [x] Decision approved by Vivek.
- [x] ADR Decision History updated.
- [x] Decision referenced as **DEC-R1.2-015**.
- [x] Repository documentation updated (where applicable).
- [x] No implementation scope changes introduced.
- [x] No architecture changes introduced.
- [x] No application code changes made.

---

# Success Criteria

This governance action is successful when:

1. ADR §15 Decision 2 is formally recorded as **Approved**.
2. The implementation EBC and ADR are fully aligned.
3. Future reviewers no longer encounter ambiguity regarding Warn Mode.
4. Rad may proceed with Phase 2 implementation without governance uncertainty.

---

# Review & Approval

| Role | Responsibility | Status |
|------|----------------|--------|
| Tiger | Programme & Delivery Review | Completed |
| Archie | Architecture Confirmation | Completed (Recommendation Issued) |
| Vivek | Final Decision Authority | **Approved — 19 August 2026** |

---

# Final Recommendation

Approve **DEC-R1.2-015** as a governance-only decision to formally ratify **Warn Mode First** for Release 1.2 Phase 2.

This decision introduces **no architectural change**, **no implementation change**, and **no code changes**. Its sole purpose is to close the governance observation identified during the independent architecture compliance review and maintain a complete, auditable decision trail for Workstream 3.

**Outcome:** Approved by Vivek on 19 August 2026. Warn Mode First is now the ratified operating model for Release 1.2 Phase 2 reconciliation and validation (WP-4/WP-5). See `ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md` Section 15 (Decision 2) and Section 17 (Decision History), and `RELEASE-1.2.md` Section 7 (`DEC-R1.2-015`).
