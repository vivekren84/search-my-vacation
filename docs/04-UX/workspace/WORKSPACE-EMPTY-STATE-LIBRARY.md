# Workspace Empty State Library

| Document Information | |
|---|---|
| Document Name | Workspace Empty State Library |
| Persona | Sophie — UX, UI and Frontend Experience Specialist |
| Status | Draft — for Archie / Tiger / Product Owner review |
| Version | 1.0 |
| Release | 1.3 |
| Workstream | WS11 — SMV Workspace |
| EBC | EBC-R1.3-WS11-011A |
| Last Updated | 17 September 2026 |

---

## 1. Purpose

This EBC's Areas Requiring Refinement instruct: *"Avoid generic placeholder text. Provide meaningful product guidance."* This document is the concrete answer — one reusable visual pattern, and specific, product-aware copy for every place the Workspace currently has (or will soon have) nothing to show.

This is copy and presentation guidance only. It does not alter what triggers an empty state, what data would replace it, or any business rule about when a queue is considered "empty" — all of that remains exactly as the Product Specification and PO Reviews already define.

## 2. The Shared Pattern

Every empty state is a single visual unit: an icon chip (Design Language §7), a short bold title (what's true right now), a one- or two-sentence description (what will happen / what to do), and — only where a real action already exists elsewhere in the Workspace — an optional call-to-action. This is implemented as an enhancement to the existing shared `EmptyState.tsx` component (add an optional `icon` prop and an optional `action` prop), not a new component — preserving Rad's existing reuse structure exactly.

## 3. Copy Library

### 3.1 Dashboard — Recent Activity (in scope, implemented today)

- **Current (generic):** "No recent activity yet."
- **Refined title:** "Nothing has happened here yet."
- **Refined description:** "As your team claims Inquiries, builds proposals and confirms Journeys, their activity will appear here — so you always know what's moved since you last looked."
- **Icon:** a simple clock/pulse glyph.
- **Action:** none (there is no single action that "creates" activity).

### 3.2 Dashboard — Upcoming Tasks (in scope, implemented today)

- **Current (generic):** "No pending tasks."
- **Refined title:** "You're all caught up."
- **Refined description:** "Follow-ups and reminders tied to your Inquiries and Journeys will surface here as soon as they're scheduled."
- **Icon:** a crescent-moon/checkmark glyph.
- **Action:** none.

### 3.3 Coming Soon — any of the six unbuilt modules (in scope, implemented today)

- **Current (generic, one sentence reused for all six):** "`{module}` isn't built yet. We'll let you know as soon as it's ready."
- **Refined pattern (still one shared template — the six module names are already data, not six separate copy decisions, so this remains a template, not new per-module business content):** title **"Coming Soon."**, description **"`{module}` isn't built yet. We'll let you know the moment it's ready."** — same information, tightened for tone, plus a "Back to Dashboard" secondary action (already-existing route, `/workspace`), so a Workspace User who lands here mid-exploration is never left without a next step.
- **Icon:** a small sparkle/star glyph, distinct from the "nothing here yet" glyphs above, so "not built yet" reads differently from "built, but empty."

### 3.4 Forward-looking — not implemented today, documented for the modules' own future EBCs (Optional; explicitly not to be built under this card)

> **WS13 revision (EBC-R1.3-WS13-002, 24-Sep-2026):** Journey Workspace empty states are now specified. See *WS13 Revision*.


These illustrate the *pattern's* reach so Rad's future module EBCs have a ready-made tone reference — they are not new scope for this card, and are marked Optional/reference-only in the Review Notes:

- **Journey Planning — unclaimed Inquiry pool, empty:** "No new Inquiries waiting." / "New Leads from Journey Passport, WhatsApp, phone or email will appear here the moment they arrive."
- **Traveller Hub — no travellers yet (unlikely in practice, but a legitimate first-run state):** "No travellers on record yet." / "Every Traveller you work with — new or returning — will build a history here automatically."
- **Vendor Management — Vendor Confirmations queue, empty:** "No outstanding vendor confirmations." / "When a Journey needs a supplier booking confirmed, it will appear here until it's resolved."

## 4. Tone Rules (for any future empty state written outside this document)

- State what's true plainly, then say what will happen — never apologise, never use technical terms ("no records found", "null", "0 results").
- Prefer "will appear here" / "will surface here" over passive or system-sounding phrasing.
- Only add a call-to-action when a real, already-existing route or action can be offered (as in Coming Soon's "Back to Dashboard") — never invent a button that goes nowhere.
- Keep to two sentences maximum. This is a calm, confident surface, not a moment to explain the whole product.

## 5. Visual Reference

`docs/04-UX/workspace/mockups/WORKSPACE-EMPTY-STATE-LIBRARY-MOCKUP.png` shows all four in-scope-today variants side by side, in the refined visual treatment.

---

*Prepared by Sophie, UX, UI and Frontend Experience Specialist, on behalf of Team Satvi, per EBC-R1.3-WS11-011A.*

---

## WS13 Revision — EBC-R1.3-WS13-002 (24 September 2026)

*Additive revision by Sophie (UX). The original text above is kept unchanged, following the project's supersede-not-delete convention. Where this section differs, it governs for Journey Workspace. Source: `docs/09-Development/EBC-R1.3-WS13-002-SOPHIE-Journey-Workspace-UX-Design-and-Experience-Specification.md`, built on the frozen product baseline `EBC-R1.3-WS13-001` Revision 2 (D-01 to D-13).*

### Journey Workspace empty states

No empty state offers to create a Journey (D-09).

| Context | Title | Description | Action |
|---|---|---|---|
| Active Journeys, none | No active Journeys right now. | Journeys appear here automatically when a Journey Planning record is confirmed. | Go to Journey Planning |
| Active Journeys, no filter matches | Nothing matches these filters. | Try widening your search or clearing a filter. | Clear filters |
| Closed & Archived, none | No closed or archived Journeys yet. | Completed, cancelled and replaced Journeys will be kept here. | — |
| Vendor Bookings, none | No vendor bookings yet. | Add each service you need to book. It starts as a draft until you request it. | Add booking |
| Documents, none | No documents to track. | Documents stay where they're stored — record what's needed and its reference or link here. | Add document |
| Tasks & Follow-ups, none | Nothing to do on this Journey. | Tasks, traveller follow-ups and payment reminders you add will appear here. | — |
| Activity & Changes, none | Nothing logged yet. | Calls, messages, notes and operational changes will build up here. | Log activity |
| Readiness, Journey Confirmed | Choose a readiness template to begin. | It sets the checklist this Journey needs before departure. | Start preparation |
| Dashboard, Payments Due | No payment follow-ups due. | Payment reminders you schedule on a Journey will appear here. | — |
| Dashboard, Needs Attention | Nothing needs your attention right now. | — | — |

**Relabel (§3.4 Vendor Management example):** "No outstanding vendor confirmations." reads "No vendor bookings waiting." / "Bookings waiting on a vendor will appear here until they're confirmed." (D-07).

### Revision 4 update (27-Sep-2026, WS13 UX synchronisation UXA-01 to UXA-06)

*Alignment with WS13-001 Rev 3 (POD-01–08, PD-A–E, O-A2–O-A5) and WS13-004A. Detail: `EBC-R1.3-WS13-002` §36. No workflow redesign.*

| Context | Copy |
|---|---|
| JP Vendor Quotations on a replacement record with no baseline | "No quotation baseline was carried from JRN-… (no Booked vendors). See its bookings ↗" |
| Replacement Journey Documents, all reviewed | Banner disappears; no empty state needed |
