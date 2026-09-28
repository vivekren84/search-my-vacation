# EBC-R1.3-GOV-005 — Engineering Governance Principles v1.0

| Document Information | |
|---|---|
| Document | Engineering Governance Principles v1.0 — Delivery Governance Standardisation for Future Releases |
| EBC | `EBC-R1.3-GOV-005` (issued as `EBC-R1.3-GOV-001` — see §1) |
| Persona | Tiger — Programme and Delivery Lead (Release Governance) |
| Reviewers | Vivek (Product Owner) · Archie (not required — no architectural governance affected) · Rad (implementation practicality) · Keerthi (release-validation impact) |
| Classification | Governance process improvement — non-functional / organisational |
| Release | 1.3 |
| Status | **Closed — Approved by the Product Owner, 27-Sep-2026 (`DEC-R1.3-018`)** |
| Revision | 2 — Product Owner decisions and closure recorded (§9). Revision 1 (same date) was the proposal. |
| Date | 27 September 2026 |
| Code / Product / UX / Architecture changes | **None** |

---

## 0. Workspace Readiness Check

| Check | Result |
|---|---|
| Repository root | `SearchMyVacation` (local repository, connected via device bridge) |
| Branch | `feature/r1.3-ws13-journey-workspace` |
| HEAD | `61b06e6` — "chore(governance): establish Release 1.3 Engineering Ready Baseline for WS13" |
| Working tree at start | Clean |
| `main` (local) | `61b06e6` — same commit as HEAD; **12 commits ahead of `origin/main` (`63b6ddc`), unpushed** (see F-02) |
| Remote WS13 branch | `origin/feature/r1.3-ws13-journey-workspace` = `61b06e6` (pushed) |

---

## 1. Identifier Disclosure

The card was issued as `EBC-R1.3-GOV-001`. That identifier is already used by `docs/09-Development/EBC-R1.3-GOV-001-TIGER-Feature-Register-Workstream-Alignment-Audit.md` (14-Sep-2026), which the Release 1.3 tracker and Feature Register cite. `GOV-002`–`GOV-004` are also taken. Reusing the ID would repeat the citation-ambiguity defect class recorded as `RISK-R1.2-014`, so this card is recorded as **`EBC-R1.3-GOV-005`**, the next free governance identifier. **Decision D-1** asked the Product Owner to confirm — **confirmed 27-Sep-2026**.

---

## 2. Canonical Home Assessment (Deliverables 1–3)

| Candidate | Finding | Verdict |
|---|---|---|
| `docs/15-AI-Operating-Model/CLAUDE.md` — **SMV Engineering Handbook (AIOM-002)** | Repository-wide engineering baseline. Already owns §7 Git workflow, §6.5 readiness, §15 Definition of Done. §19 says "keep the concise baseline here and link to the detailed source". | **Selected — canonical home** |
| `docs/15-AI-Operating-Model/README.md` (AIOM-001) | Owns the general Team Satvi delivery lifecycle and governance principles, not branching or baselines. | Link only — no change |
| `docs/15-AI-Operating-Model/TEAM-SATVI.md` (AIOM-003) | Owns team structure and decision classes; §9 release interaction is consistent with EP-004. | No change |
| `docs/00-Project-Compass/PROJECT-STANDARDS.md` | Indexed as "Repository and documentation standards" but the file is **empty (0 bytes)** since commit `3cdb8a7`. Filling it would create a second, competing engineering standard. | Not used — observation O-01 |
| `docs/00-Project-Compass/GOVERNANCE-MAP.md` | Index of where governance information lives. | Pointer row added |
| `playbooks/Git-Workflow.md` (planned, AIOM roadmap) | Does not exist. Creating it now would duplicate the Handbook baseline. | Not created — detailed procedure stays on its roadmap |
| Claude Project Instructions §26 | Outside the repository; not editable by Tiger. Recommends `feature/<ebc-number>-…` branches. | Conflict disclosed — Decision D-5 |

No new governance document was created (AC-03). The principles have exactly one home: Handbook §7.

---

## 3. What Changed

| File | Change |
|---|---|
| `docs/15-AI-Operating-Model/CLAUDE.md` | v1.0 → **v1.1 (Proposed)**. §7 renamed "Git workflow and engineering governance" and expanded: 7.1 Principles EP-001–EP-009 · 7.2 Branch strategy · 7.3 Engineering Ready Baseline · 7.4 Release governance lifecycle · 7.5 Merge criteria · 7.6 Change governance · 7.7 Persona ownership · 7.8 Git hygiene baseline (the previous 10-item list, with items 2, 4 and 7 aligned to EP-001/EP-002) · 7.9 Adoption record. Metadata, table of contents and revision history updated. |
| `docs/00-Project-Compass/GOVERNANCE-MAP.md` | One pointer row added. |
| `docs/00-Project-Compass/DOCUMENT-INDEX.md` | AIOM-002 purpose text extended; last-updated date. |
| `docs/10-Backlog/RELEASE-1.3.md` | v1.17 → v1.18. Section 2 pointer recording Release 1.3 as the first release under the principles; Change History row; version and date fields. No `DEC-R1.3` entry added until approval. |
| `docs/09-Development/EBC-R1.3-GOV-005-…` | This record (new). |

No other files changed. No commit or push performed.

---

## 4. Acceptance Criteria

| AC | Requirement | Evidence | Result |
|---|---|---|---|
| AC-01 | Principles documented | Handbook §7.1 (EP-001–EP-009, wording faithful to the card) | Met |
| AC-02 | Canonical document updated | Handbook AIOM-002 v1.1 | Met |
| AC-03 | No unjustified duplicates | §2 above; tracker and Governance Map point to §7, do not restate it | Met |
| AC-04 | Branch strategy | §7.2 | Met |
| AC-05 | Engineering Ready Baseline defined | §7.3 (five baselines, owners, governance commit) | Met |
| AC-06 | Merge governance | §7.5 | Met |
| AC-07 | Persona ownership | §7.7 | Met |
| AC-08 | No Silent Changes | EP-007, §7.6 | Met |
| AC-09 | Preview workflow | EP-008, §7.2, lifecycle stages 8 and 13 | Met |
| AC-10 | Release Governance Lifecycle | §7.4 (14 stages) | Met |

---

## 5. Tiger Validation

### 5.1 Do the principles accurately reflect Release 1.3?

Partly — and this record says so rather than overstating adoption.

| Principle | Release 1.3 evidence | Assessment |
|---|---|---|
| EP-003 / EP-005 / EP-009 | Commit `61b06e6` freezes the WS13 Product, UX, Architecture and Engineering Planning baselines, contains no implementation code, and states it establishes the Engineering Ready Baseline. | **Reflected** |
| EP-006 / EP-007 | WS13-004 (Rad) routed engineering defaults to owners (ENG-OBS-01…05) instead of deciding them; WS13-004A (Archie) clarification before implementation. | **Reflected** |
| EP-001 | A dedicated branch exists, but it is **workstream-scoped** (`feature/r1.3-ws13-journey-workspace`), not a release branch (`release/r1.3`). | **Approved exception** — this branch serves as Release 1.3's release branch; `release/rX.Y` from Release 1.4 (D-2) |
| EP-002 | WS1–WS12 engineering (for example `f29bc0d`, `20cc249`) was committed directly on local `main`. | **Not reflected before WS13** — F-02, Decision D-4 |
| EP-003 granularity | Release 1.3's baseline commit is labelled for WS13. | **Resolved** — one Engineering Ready Baseline per release (D-3); Release 1.3's is `61b06e6` |
| EP-008 | Deployment mapping **verified**: `main` → Production; `feature/r1.3-ws13-journey-workspace` → Preview. Source: Product Owner confirmation, 27-Sep-2026. | **Reflected** |
| EP-004 | Release-branch merge into `main` not yet exercised (WS13 implementation not started). Local `main` held unpushed until Release Approval (D-4). | Controlled; exercised at Release 1.3 closure |

The adoption record (Handbook §7.9) therefore states: Release 1.3 is the first release under these principles **from the WS13 Engineering Ready Baseline onward**.

### 5.2 Contradictions with existing governance

| Source | Issue | Handling |
|---|---|---|
| Handbook §7 item 2 (v1.0) — "short-lived branch for scoped work" | Conflicts with EP-001 ("only within the release branch") | Aligned in §7.8 item 2 |
| Project Instructions §26 — recommends `feature/<ebc-number>-…` branches | Conflicts with EP-001; Handbook §1.2 ranks Project Instructions **above** the Handbook, so §26 would prevail until changed | Not editable here — Decision D-5 |
| Past practice — Tiger synchronised Product Owner-ratified decisions into Arjun's baseline (`EBC-R1.3-WS12-011B`) | Would breach EP-006 as written | §7.6 step 3: owning persona edits its own baseline. Noted, no retroactive change |
| README delivery lifecycle; TEAM-SATVI §9 | Consistent; §7.4 specialises and links, does not replace | None needed |

### 5.3 Duplication

None. Handbook §7 is the only place the principles are written; three documents link to it.

### 5.4 Can future releases adopt them without modification?

Yes for Release 1.4 onward, starting at lifecycle stage 1 with `release/r1.4`, **now that D-3 is decided**; Project Instructions alignment (D-5) is tracked in `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.7, due before Release 1.4 planning. Hotfix procedure detail is deferred to the planned `playbooks/Git-Workflow.md` (EP-002 permits hotfix branches; the card does not define the procedure, so none was invented).

---

## 6. Findings and Risks

| ID | Finding | Impact | Recommendation |
|---|---|---|---|
| **F-01** | Release 1.3 has no `release/r1.3` branch; WS13 runs on a workstream branch. | EP-001 naming and "one branch per release" not yet true for Release 1.3. | **Closed** — approved exception (D-2) |
| **F-02 / R-01** | Local `main` holds 12 unpushed commits, including WS11/WS12 engineering and the WS13 governance commit. Under EP-001/EP-008, `main` = Production. | **High:** pushing local `main` would put WS11/WS12 (and later any WS13) changes into Production without an EP-004 release approval. | **Controlled** — local `main` stays unpushed until Release 1.3 Product Acceptance and Release Approval (D-4) |
| **O-01** | `PROJECT-STANDARDS.md` is empty but indexed as canonical. | Readers may think standards are missing. | Backlog: retire the index entry, or point it at Handbook AIOM-002. Not changed here (outside this card's scope). |

---

## 7. Product Owner Decisions (resolved 27-Sep-2026)

| ID | Decision | Options | Tiger recommendation | Product Owner decision |
|---|---|---|---|---|
| **D-0** | Approve Handbook v1.1 §7 (Engineering Governance Principles v1.0) | Approve · Amend · Reject | Approve; then record as a `DEC-R1.3` entry and set Handbook status to Approved | Approved |
| **D-1** | EBC identifier | Keep `GOV-005` · Other | Keep `EBC-R1.3-GOV-005` | Approved — `EBC-R1.3-GOV-005` |
| **D-2** | Release 1.3 branch identity | (a) Treat `feature/r1.3-ws13-journey-workspace` as Release 1.3's release branch (recorded exception to naming) · (b) Create `release/r1.3` from `61b06e6` and continue WS13 there | (b) — cheap now (no implementation yet) and makes Release 1.3 match EP-001 exactly | Do not introduce `release/r1.3`; continue on `feature/r1.3-ws13-journey-workspace`. `release/rX.Y` from Release 1.4 |
| **D-3** | Baseline granularity for multi-workstream releases | One Engineering Ready Baseline per release · One per workstream, each with its own governance commit on the release branch | Per workstream on the release branch (matches how Release 1.3 actually works) — then amend §7.3 wording | One Engineering Ready Baseline per release, not per workstream (Handbook §7.3 worded accordingly) |
| **D-4** | Handling of the 12 unpushed commits on local `main` | Hold until Release 1.3 approval, then push · Reset local `main` to `origin/main` after moving the work to the release branch (needs explicit authority — history-changing) | Hold; do not push `main` until the Release 1.3 Release Approval (EP-004) | Approved — hold until Product Acceptance and Release Approval |
| **D-5** | Project Instructions §26 branch guidance | Update §26 to reference Handbook §7 · Keep §26 and add an exception | Update §26 to: "Use the release branch per Engineering Handbook §7 (EP-001/EP-002)" | Do not modify Project Instructions during Release 1.3; governance backlog item raised (§2.7) |

---

## 8. Repository Status

- Branch: `feature/r1.3-ws13-journey-workspace`.
- Modified (unstaged): `docs/15-AI-Operating-Model/CLAUDE.md`, `docs/00-Project-Compass/GOVERNANCE-MAP.md`, `docs/00-Project-Compass/DOCUMENT-INDEX.md`, `docs/10-Backlog/RELEASE-1.3.md`, `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md`.
- Untracked: this document.
- No commit or push performed (Project Instructions §26). These are governance documentation changes and belong on the Release 1.3 branch, not `main`.

---

## 9. Product Owner Decision and Closure (Revision 2)

The Product Owner approved `EBC-R1.3-GOV-005` on 27-Sep-2026 and authorised formal closure, recorded as **`DEC-R1.3-018`** in `docs/10-Backlog/RELEASE-1.3.md` §7.

| Governance update | Where recorded |
|---|---|
| Handbook v1.1 §7 and EP-001–EP-009 approved; status set to Approved | `docs/15-AI-Operating-Model/CLAUDE.md` metadata and revision history |
| One Engineering Ready Baseline per release (D-3) | Handbook §7.3 |
| Release 1.3 exceptions and conditions (D-2, D-4), deployment mapping, Project Instructions position (D-5) | Handbook §7.9 |
| Decision record | `RELEASE-1.3.md` `DEC-R1.3-018`, Change History v1.19, Section 2 pointer set to Approved |
| Governance backlog item: align Project Instructions before Release 1.4 planning | `docs/10-Backlog/RELEASE-1.3-GOVERNANCE-BACKLOG.md` §2.7 |
| Deployment verification (`main` → Production; WS13 branch → Preview) | §5.1 above; source is Product Owner confirmation |

**Remaining open items (not blocking closure):** O-01 (empty `PROJECT-STANDARDS.md`) stays an observation for a future housekeeping card; governance backlog §2.7 is due before Release 1.4 planning; the local `main` hold (D-4) lifts at Release 1.3 Release Approval.

**Status: Closed.**

---

*Prepared by Tiger, Programme and Delivery Lead. Documentation only; no product, UX, architecture, engineering, schema or code change. Findings are separated from recommendations; approval rests with the Product Owner.*
