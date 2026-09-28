# EBC-R1.3-WS13-005-QA-PA · Phase A (CM-03): QA Completion Report

**Persona:** Keerthi (He), Functional Validation Specialist
**Parent EBC:** `EBC-R1.3-WS13-005` Engineering Implementation, Journey Workspace
**Release / Workstream / Phase:** 1.3 / WS13 Journey Workspace / Phase A (CM-03)
**QA card:** `EBC-R1.3-WS13-005-QA-PA` (prepared by Tiger)
**Input:** Rad, `EBC-R1.3-WS13-005-PA-RAD-Phase-A-CM-03-Engineering-Completion-Report`
**Date:** 27 September 2026
**Recommendation:** ✅ **PASS WITH OBSERVATIONS** (Phase A is eligible for Product Acceptance)

---

## 1. Summary

Phase A removes "Create Journey" and "My Work" from the Workspace Dashboard Quick Actions. On the authoritative Vercel Preview built from commit `faeb795`, the Dashboard shows exactly three Quick Actions: **New Lead** (primary, amber), **Add Traveller** and **New Vendor**, in that order. The removed labels do not appear anywhere in the rendered Dashboard. No regression, console error or runtime exception was observed. The only code change is the one Rad reported.

| Area | Result |
|---|---|
| Functional QA-01 to QA-05 | 5 / 5 Passed |
| Regression | Passed |
| Responsive | Passed at desktop and tablet; mobile Passed at 500 px (see limitation L-01) |
| Accessibility (keyboard) | Passed |
| Visual | Passed |
| Negative | Passed |
| Browser console | Passed (0 messages) |
| Engineering conformance | Passed |
| Defects | 0 Critical, 0 High, 0 Medium, 0 Low, 1 Informational (pre-existing, outside Phase A) |

## 2. Environment Tested

| Item | Value |
|---|---|
| **Authoritative environment** | Vercel Preview `https://search-my-vacation-k955r4cv4-search-my-vacation.vercel.app` (branch alias `search-my-vacation-git-feature-r13-ws-a81074-search-my-vacation.vercel.app`) |
| Deployment | `dpl_7ksmWyJiKZ7fFycn7ZvBuHxU4TVb`, state **READY**, target Preview |
| Source | Branch `feature/r1.3-ws13-journey-workspace`, commit `faeb795095905f3684c9da0355d62f42231ebd63` (confirmed from Vercel deployment metadata and the GitHub commit status "Vercel: success") |
| Local repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`: branch correct, HEAD `faeb795`, equal to `origin`. Read-only Git commands only. |
| Localhost `http://localhost:3000` | **Not Tested**: the dev server was not running. Localhost is optional for reproduction only (QA card §4), so no Preview result depends on it. |
| Browser | Google Chrome (desktop) through Claude in Chrome |
| Test identity | `vivek`, **Administrator** (signed in by the Product Owner; Keerthi did not handle credentials) |
| Viewports | 1440 × 900 (desktop), 820 wide (tablet), 500 wide (Chrome's minimum window width; see L-01) |

**Build note:** the Preview build for `faeb795` completed successfully on Vercel. This closes Rad's residual risk ENG-A-01, since the production (Turbopack, real fonts) build path has now run.

## 3. Functional Validation

| ID | Requirement | Steps | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|
| QA-01 | Exactly three Quick Actions | Sign in → `/workspace` → inspect the Quick Actions card | New Lead, Add Traveller, New Vendor only | DOM query of the card returns **3** buttons: `New Lead`, `Add Traveller`, `New Vendor` | **Passed** | E-01, E-02 |
| QA-02 | Approved order | As above; read DOM and screen order | 1 New Lead, 2 Add Traveller, 3 New Vendor | DOM order and x positions (293 → 407 → 546 px) match | **Passed** | E-01, E-02 |
| QA-03 | New Lead is primary | Compare computed styles | New Lead amber-filled; others warm-outline | New Lead: bg `rgb(245,149,28)` (`--color-amber`), weight 600. Others: white bg, warm border, weight 500 | **Passed** | E-02 |
| QA-04 | Create Journey absent | Search rendered text and full HTML | 0 occurrences | 0 in `innerText`, 0 in `outerHTML` | **Passed** | E-02 |
| QA-05 | My Work absent | As QA-04 | 0 occurrences | 0 in `innerText`, 0 in `outerHTML` | **Passed** | E-02 |

## 4. Regression Validation

| Check | Result | Status |
|---|---|---|
| Dashboard loads (greeting, 5 KPI tiles, Quick Actions, Recent Activity, Upcoming Tasks) | Renders fully | Passed |
| Left navigation: Dashboard → Journey Planning → Dashboard | Routes change correctly; Journey Planning queue loads records | Passed |
| Mobile navigation overlay (500 px): open via "Open Workspace navigation", close with Esc | Opens with the full nav list, closes, no dialog left open | Passed |
| Quick Action buttons clicked (all three) | No navigation, no error. They stay non-functional placeholders, unchanged from WS11 as Rad documented | Passed |
| Runtime exceptions | None observed | Passed |
| Layout breakage | None | Passed |

## 5. Responsive Validation

| Viewport | Quick Actions | Horizontal overflow of card | Clipping / wrapping | Status |
|---|---|---|---|---|
| Desktop 1440 | One row, inside card | None | None | Passed |
| Tablet 820 | One row (285–658 px) inside card (264–796 px) | None | None | Passed |
| Mobile 500 | One row (37–410 px) inside card (16–484 px), 38 px tall | None in the card | None | Passed |

Button text never overflows its button (`scrollWidth ≤ clientWidth` at every width).

## 6. Accessibility Validation (keyboard)

| Check | Result | Status |
|---|---|---|
| Logical tab order | Account menu → nav links (7) → **New Lead → Add Traveller → New Vendor** → next region | Passed |
| Reachable with the keyboard | All three are native `<button type="button">`, `tabIndex 0`, not disabled | Passed |
| Visible focus | `:focus-visible` matched on each button; 2 px solid espresso (`rgb(42,33,28)`) outline shown | Passed (E-03) |
| New inaccessible controls | None; control count dropped from 5 to 3 | Passed |

## 7. Visual Validation

Button classes, colours, font (Poppins 14 px), padding, pill radius and gaps (12 px) all match the WS11 implementation. The `faeb795` diff touches only the label array and a comment, so the styling code is identical. No unexpected movement: the remaining buttons simply close up the gaps left by the removed ones. **Passed.**

## 8. Negative Validation

- Rendered Dashboard (desktop and mobile, including the mobile nav overlay): no "Create Journey" and no "My Work". **Passed.**
- Repository at `faeb795` (`web/app`, `web/components`, `web/lib`): the only other match is public copy on `/about` ("…create journeys that suit the traveller…"). That is a sentence on a public page, not a Workspace action, so it is **not a finding**.

## 9. Browser Console

Console captured across a Dashboard reload, all three Quick Action clicks, the navigation round-trip, the mobile overlay and a Journey Planning load: **0 messages** (no errors, no warnings). **Passed.**

## 10. Engineering Conformance

| Check | Result |
|---|---|
| Code change set | `git diff 61b06e6 faeb795 -- web/` → **1 file**, `QuickActions.tsx` +6/−2, exactly as reported |
| Commit contents | QuickActions.tsx plus Rad's completion report only; Tiger's uncommitted governance files were correctly left out |
| No added behaviour / unauthorised UI / scope creep | Confirmed |

**Passed.**

## 11. Defect Log

| ID | Severity | Title | Expected | Actual | Steps | Evidence | Recommended action |
|---|---|---|---|---|---|---|---|
| OBS-QA-PA-01 | **Informational** (pre-existing, outside Phase A) | Header account menu overflows the viewport by 4 px at 500 px width | No horizontal page scroll at phone widths | `scrollWidth` 504 vs `clientWidth` 500; the overflowing element is the header account-menu button (288–504 px). Quick Actions are not involved. | Sign in → `/workspace` → set the window to 500 px wide → measure document width | DOM measurement (§5) | Not a Phase A defect: the header is not in the `faeb795` diff. Tiger to decide whether to log it in the Product Evolution / tech-debt backlog after a check at real phone widths (<500 px). |

No Critical, High, Medium or Low defects.

## 12. Limitations of this QA

| ID | Limitation | Impact |
|---|---|---|
| L-01 | Chrome's minimum window width is 500 px, so widths below 500 px (e.g. 390 px phones) were not rendered. At 500 px the Quick Actions use 394 px of a 468 px card, so they are expected to wrap cleanly (`flex-wrap`), but this is **Not Tested**. | Low. A quick check on a real phone or with DevTools device mode is recommended during Product Acceptance. |
| L-02 | Localhost not tested (dev server not running). | None: Preview is authoritative. |
| L-03 | Tested as Administrator only. The Quick Actions component takes no role input, so a Workspace User sees the same set, but that identity was not signed in. | Low. |

## 13. Evidence

| Ref | Description |
|---|---|
| E-01 | Screenshot, Preview Dashboard at 1440 px showing the three Quick Actions (`E-01-dashboard-desktop-1440.jpg`) |
| E-02 | DOM/computed-style capture: 3 buttons, order, colours, 0 matches for the removed labels (§3) |
| E-03 | Keyboard focus captures on New Lead and New Vendor (2 px espresso outline), taken during testing |
| E-04 | Vercel deployment metadata `dpl_7ksmWyJiKZ7fFycn7ZvBuHxU4TVb` (READY, SHA `faeb795`) and GitHub commit status "Vercel: success" |
| E-05 | `git diff --stat 61b06e6 faeb795 -- web/` → 1 file changed, 6 insertions, 2 deletions |

## 14. Recommendation

**PASS WITH OBSERVATIONS.** Phase A (CM-03) matches the approved Product (WS13-001 Rev 3), UX (WS13-002 Rev 4a §6.5, UX-01) and Engineering baselines on the authoritative Preview. It has no Critical, High, Medium or Low defects and no regressions. The single observation is pre-existing and outside Phase A scope. **Keerthi recommends Phase A for Product Acceptance.**

This is functional validation only. It is not Sri's traveller-experience review or the Product Owner's release decision.

---

*Prepared by Keerthi, Functional Validation Specialist, on behalf of Team Satvi. No code or repository files were modified during this QA.*
