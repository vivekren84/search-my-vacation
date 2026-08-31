# Architecture Decisions — Register

**Status:** This register is currently unpopulated. It is not stale or abandoned — see the note below.

## Current Approach (Release 1.2)

Release 1.2 introduced `docs/20-Architecture/` as the location for its Architecture Decision Records:

- `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`
- `docs/20-Architecture/ADR-R1.2-WS5-001-DLT-External-Provider-Onboarding.md`

This is intentional for Release 1.2, not an oversight: Release-scoped ADRs are filed under a release-numbered folder (`20-Architecture`) alongside the release's other governance documentation (`30-Governance`, `40-Retrospectives`, `50-Operations`), rather than in this pre-existing, release-agnostic register. `docs/03-ADR/ADR-000.md` (the ADR template) remains a valid structural reference for authoring an ADR regardless of where it is ultimately filed.

## Recommendation

Whether future releases continue filing ADRs under a release-numbered folder, or this register becomes the single cross-release index (with release-scoped ADRs listed here and their content living under `20-Architecture`), is a documentation-convention decision for Tiger/Archie to make once Release 1.2 closes — not decided by this note. Until that decision is made, `docs/20-Architecture/` is the authoritative location for Release 1.2's ADRs; this register is not the place to look for them.

*Recorded as part of Release 1.2 Workstream 7's documentation-housekeeping work. Correction, `EBC-R1.2-WS7-08`, 31-Aug-2026: this line previously cited `EBC-R1.2-WS7-IMP-04`, `EBC-R1.2-WS7-AUD-01` and `EBC-R1.2-WS7-GOV-01`; independently reconfirmed that none of the three exist as repository documents or commits (see `docs/10-Backlog/RELEASE-1.2.md`, `RISK-R1.2-014`). No ADR was created, moved, or migrated by this note, and that fact is unaffected by the citation correction.*
