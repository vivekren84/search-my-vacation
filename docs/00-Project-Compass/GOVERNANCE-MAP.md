# Search My Vacation — Release Governance Map

**Status:** Living index
**Owner:** Tiger (Programme and Delivery Lead)
**Created:** 31 Aug 2026
**Recorded under:** `EBC-R1.2-WS7-IMP-02`, per the findings of `EBC-R1.2-WS7-AUD-01` (Documentation Completeness Audit) and `EBC-R1.2-WS7-GOV-01` (Governance Reference Reconciliation)

## Purpose

Release 1.2 introduced several governance document types alongside the pre-existing Project Compass. A reader arriving at this repository for the first time has no single place that explains how they relate, or which one is authoritative for a given question. This document is that place. It does not duplicate any of the documents it describes — it points to them.

## Where Release Governance Information Lives

| If you're looking for... | Go to | Notes |
| --- | --- | --- |
| **What was decided, for Release 1.2, and why** | `docs/10-Backlog/RELEASE-1.2.md` §7 ("Product Decision Log") | Authoritative and live for the current release. Not duplicated in `DECISION-LOG.md` — see below. |
| **What was decided, before Release 1.2** | `docs/00-Project-Compass/DECISION-LOG.md` | Legacy `Decision-001`–`Decision-005`. Resumes as canonical once Release 1.2 closes — see its own governance note. |
| **Release-wide delivery status, scope, sequencing** | `docs/10-Backlog/RELEASE-1.2.md` | The Release Tracker — the single source of truth for what each workstream includes, its status, and its task table. |
| **Why a technical or system-design choice was made, in a form meant to outlive one EBC** | `docs/20-Architecture/` (Release 1.2 ADRs) | Currently `ADR-R1.2-WS3-001` (Destination Knowledge Governance) and `ADR-R1.2-WS5-001` (DLT External Provider Onboarding). Ratified by Archie, drafted from decisions already made in the tracker/EBCs. |
| **Institutional knowledge from a specific delivery experience, meant to generalise to future work** | `docs/40-Retrospectives/` | Currently scoped to Workstream 5's MSG91/DLT onboarding experience — not a general Release 1.2 retrospective. |
| **How to operate a live system once it's in production** | `docs/50-Operations/` | Currently the SMS/OTP Operations Runbook. |
| **Standing operational definitions and provider inventories** | `docs/30-Governance/` | Provider Dependency Register; External Integration Definition of Done. |
| **What's proposed for the next release** | `docs/10-Backlog/RELEASE-1.3-BACKLOG.md` (product/technical debt) and `RELEASE-1.3-GOVERNANCE-BACKLOG.md` (governance/operational playbooks) | Two deliberately separate documents — see the distinction stated in the Governance Backlog's own header. |
| **A specific EBC's own record of what it did** | `docs/09-Development/` | Individual implementation, review, QA and governance-synchronization cards, named by EBC ID. |
| **Where any of the above should canonically live** | `docs/00-Project-Compass/DOCUMENT-INDEX.md` | The repository-wide document index; this map is one of its entries. |

## Why the Decision Log and the Release Tracker Aren't Merged

`docs/00-Project-Compass/DECISION-LOG.md` was Release 1.2's originally-intended decision register, but in practice every Release 1.2 decision was recorded directly in the Release Tracker (`RELEASE-1.2.md` §7) instead — with more context, explicit supersession handling, and closer proximity to the workstream it affects. Backfilling all 26 decisions into `DECISION-LOG.md` now would only create a second copy that can drift from the first; the tracker's version is treated as authoritative, and `DECISION-LOG.md` carries a short pointer to it rather than a duplicate. This is a deliberate governance choice, not an oversight — see `DECISION-LOG.md`'s own "Release 1.2 Decisions — Governance Note" section for the full explanation.

## Why `EBC-R1.2-GOV-001` Doesn't Appear as a Document

Several documents above (the WS5 ADR, the Operations Runbook, the Retrospective, and the Governance Backlog) cite `EBC-R1.2-GOV-001` as their originating authority. That card was executed — its four deliverables are real, complete and current — but no standalone document matching that ID exists. This has been investigated and formally reconciled; see `docs/09-Development/EBC-R1.2-GOV-001-STATUS-RECONCILIATION.md` for the evidence and determination. Cite the deliverables directly going forward, not the card ID.

## Maintaining This Map

Update this map only when a new governance document *type* is introduced (a new top-level `docs/` governance folder, a new class of record), not for every individual document added within an existing type. It is not a substitute for `DOCUMENT-INDEX.md` — it explains relationships and precedence; the index lists canonical paths.
