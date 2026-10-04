# EBC-R1.3-WS13-020B — Phase 1 UX Confirmations

| Document Information | |
|---|---|
| Release / Workstream / Phase | Release 1.3 / WS13 Journey Workspace / Phase 1 — Journey Core |
| Document type | UX confirmation (addendum to `EBC-R1.3-WS13-020`) |
| Prepared by | Sophie — UX, UI and Frontend Experience Specialist |
| Requested by | Rad (`WS13-020` Rev 1 §12.2, S-1 … S-6) and the Product Owner (review of 4-Oct-2026: Phase 2 functionality hidden; template selection; remaining Phase 1 UX confirmations) |
| UX baseline | `EBC-R1.3-WS13-002` Revision 4a (unchanged by this document) |
| Product Owner decisions applied | 4-Oct-2026 review: Decision 3 (all Workspace Users may view the team's Journey list), Decision 4 (readiness workflow shown, not enforced in Phase 1), Decision 5 (nights derived at adoption and recorded in History) |
| Date | 4 October 2026 |
| Outcome | **All six requests confirmed**, with refinements C-01 … C-14 (§2). No redesign, no new design language, no Product rule changed. |

Sophie does not approve engineering completion, functional behaviour or release.

---

## 1. Principles applied to Phase 1

1. **No dead ends.** Phase 1 shows only what a user can act on or read today. Later-phase features are **hidden**, not shown as "Coming soon" or disabled placeholders. The Workspace is an internal tool used daily; placeholders become noise, and UX-03 ("one action, one place") already argues against duplicate or empty entry points.
2. **Honest states.** Where Phase 1 data is incomplete (no readiness checklist yet), the screen says so plainly rather than implying a check took place.
3. **Baseline wording first.** Copy comes from UX Rev 4a wherever it exists. New copy follows its tone: short, plain, specific, never blaming.

---

## 2. Confirmations

### S-1 — Phase 2/3/4 surfaces on Phase 1 screens — **Confirmed: hidden**

| # | Surface | Phase 1 treatment |
|---|---|---|
| C-01 | Tab bar | **Overview · Itinerary · History** only. No Vendor Bookings, Readiness, Documents, Tasks & Follow-ups or Activity & Changes tabs, no counts, no greyed tabs. |
| C-02 | Overview main column | Next step card, readiness summary (C-05), recent activity (last 5 History events, link "View history"). Vendor Bookings and Documents summary cards are not shown. |
| C-03 | Overview context rail | Journey facts only (reference, party, Journey Planning reference ↗, Intended Travel Month "for reference only", trip parameters, accepted Proposal Version ↗). The Tasks & Follow-ups block is not shown. |
| C-04 | List row (JW-01) | Leading alert glyph and "n of m Booked" are not shown. Everything else per UX §7.2: reference, party, destination, dates + relative days, stage badge with overlay, readiness chip, "POC: name", owner, next action. |
| C-05 | Readiness under Product Owner Decision 4 | See §3. |
| C-06 | Header | No alert banner (Phase 2). Status banners are rendered from data: On Hold, Cancelled, Completed, Incomplete legacy record; Superseded and Archived are rendered if those states ever exist (they cannot be reached in Phase 1). |
| C-07 | More (⋯) menu | Place on hold · Step back to In Preparation · Cancel Journey · Assign / Reassign · View planning record ↗. **Material change… and Archive are not shown.** For a Travelling Journey the quiet note becomes **"Holding isn't available while travelling."** (the Rev 4a note mentions material changes, which do not exist in Phase 1). |
| C-08 | Filters (JW-10 on JW-01) | Search · Owner · Stage · On Hold · Readiness · Departure. The **Alerts** filter is not shown. No "Closed & Archived →" link (JW-11 is Phase 3). |
| C-09 | Next step for Travelling | Sentence only: "Travelling · day n of m." The "Log activity" button is not shown (Activity is Phase 2). |
| C-10 | Owner filter (Decision 3) | Segmented control **Mine · Team** (default Mine, as UX §7.2), plus a named-owner select when Team is chosen. Same labels as the Dashboard scope toggle (UX §6.3), so Phase 3 introduces nothing new. |

**Terminal Journeys in Phase 1** (Rad's ND-6): without JW-11, a Completed or Cancelled Journey leaves the default list and is reached from its direct link, a notification or the planning record. Acceptable for Phase 1 because Production users do not see Phase 1 until release. I recommend the Product Owner confirms this default at Revision 2.

### S-4 — Start preparation and template selection — **Confirmed: no pre-selection**

There is no data to suggest Domestic or International (destinations are free text), so the dialog must not pretend to suggest.

| Element | Specification |
|---|---|
| Title | "Start preparation" |
| Body | "Choose the readiness template for this Journey." |
| Template choice | Radio list of active templates (Domestic, International), **none selected**. No "Suggested for…" line. |
| Helper (kept from Rev 4a §36.2) | "The readiness template is chosen separately from the Service Category." |
| Phase 1 note (Decision 4) | "This template doesn't have readiness items yet, so nothing will be checked before Ready to Travel." Shown only when the chosen template has no items. |
| Confirm button | "Start preparation", `aria-disabled` with reason "Choose a template" until a template is chosen |
| Adopted legacy Journey (template set at adoption) | The chosen template is shown read-only: "Template: Domestic (set at adoption)". Confirm is enabled. |
| Success toast | "Journey moved to In Preparation." |

The Rev 4a dialog line "You can change it later; items will be re-derived" is **not shown in Phase 1**, because changing a template is Phase 2. It returns with the Phase 2 change-template dialog.

### S-2 — WS13-P1-C copy confirmations (ED-02, ED-03) — **Confirmed, with a record correction**

| Item | Recorded in the Phase 0 report | Actually shipped (`TripBasicsPanel.tsx`, `JourneyPlanningRecordDetailView.tsx`) | Decision |
|---|---|---|---|
| ED-02 Service Category load failure | "Couldn't load Service Categories. You can still save; you'll need one to confirm." | **"Couldn't load Service Categories. Reload the page to try again."** | **Confirm the shipped text.** It is accurate and gives the one action that helps. No code change. Tiger corrects the ED-02 record in the carry-forward register. |
| ED-03 Conversion success toast | "Journey JRN-xxxx created." | Same | Confirmed, with C-11 below (it gains an action now that the Journey page exists). |

### S-3 — WS13-P1-G persistent Journey reference — **Confirmed**

| # | Specification |
|---|---|
| C-11 | Conversion toast: **"Journey JRN-1047 created."** with an action link **"Open Journey"**. A toast that carries an action does **not** auto-dismiss after 6 seconds; it stays until the user closes it or navigates away (time-limited actions fail WCAG 2.2.1). Toasts without an action keep the current behaviour. All toasts are announced through a polite live region (`role="status"`, TD-WS13-004). |
| C-12 | Closed Journey Planning record (outcome Confirmed): a line under the stage pill, **"Converted to Journey JRN-1047 →"**, linking to the Journey. It is permanent, so the reference is never lost after the toast closes. |
| — | Replacement banner (TL-02): "Replacement planning for JRN-···· · The original Journey is on hold until this is confirmed. [Open JRN-····]" — the reference becomes a link to the Journey page (Rev 4a §36.3 wording unchanged). |

### S-5 — Copy for new or changed messages — **Confirmed**

| Code / situation | Copy |
|---|---|
| `stale` | "This Journey changed while you were viewing it. We've refreshed it — check the details and try again." (toast; header reloads) |
| `not_authorised` | "Only the owner or an Administrator can change this Journey." |
| `on_hold` (an action attempted while held) | "This Journey is on hold. Resume it first." |
| `start_date_not_reached` / `end_date_not_reached` | Disabled reasons: "Available from 12 Oct (departure date)" / "Available from 18 Oct (return date)" (Rev 4a §9.3) |
| `readiness_incomplete` | "3 readiness items are still outstanding." (Rev 4a; cannot occur in Phase 1, see §3) |
| `reason_required` | "Add a reason." |
| `new_owner_invalid` | "Choose an active Workspace User." |
| `owner_unchanged` / `service_category_unchanged` | No message: the confirm button stays disabled until the value changes. |
| `dates_nights_mismatch` (adoption) | "These dates cover 7 nights, but the original record says 6. Change the dates so they match." (Rev 4a §36.3 pattern) |
| `contact_invalid` | Field messages: "Enter a name." · "Enter the organisation." · "Add a phone number or an email address." |
| `replacement_open` | "A replacement planning record is open for this Journey. Finish or close it first." (cannot occur in Phase 1) |
| Unexpected error (no code) | "That didn't save. Please try again. If it keeps happening, tell an Administrator." Only for errors with no specific code. |

### S-6 — Deactivated owner, adoption nights, History — **Confirmed**

| # | Surface | Specification |
|---|---|---|
| C-13 | Owner card, owner deactivated (E-06, UX §16) | Name, then muted "Account deactivated". Administrators see **[Reassign…]** on the card. Workspace Users see no action. List rows keep the owner's name with "(deactivated)". Pickers list active users only. |
| C-14 | Adoption panel nights (Decision 5) | Below the date fields. Nights stored: "The original record says 6 nights. The dates must cover 6 nights." Nights missing: "No nights were recorded. They'll be set from these dates: 7 nights." The count updates as dates change. |

**History labels for Phase 1 events (TL-08).** Before → after shown where applicable (Rev 4a §21):

| Event | Label |
|---|---|
| `journey_created` | "Journey created from Journey Planning record [JP ref] ↗" |
| `journey_stage_changed` | "Stage: In Preparation → Ready to Travel" (UI stage labels; `journey_closed` shown as "Completed") |
| `journey_stage_stepped_back` | "Stepped back: Ready to Travel → In Preparation" + note |
| `journey_on_hold` / `journey_resumed` | "Placed on hold · Reason: …" / "Resumed to In Preparation" |
| `journey_cancelled` | "Cancelled · Reason: …" |
| `journey_closed` | "Marked as Completed" |
| `journey_reassigned` | "Owner: Anita Rao → Rahul Iyer" + note |
| `journey_service_category_changed` | "Service Category changed: Family → Honeymoon" (Rev 4a §36.2) |
| `journey_contact_changed` | "Primary Operational Contact: Priya Mehta → Rahul Mehta"; when only phone or email changed: "Primary Operational Contact details updated" (values are not kept in History, Archie AR-F4) |
| `journey_template_assigned` | "Readiness template set: Domestic" |
| `journey_legacy_adopted` | "Legacy Journey adopted by [Admin] · Owner: … · Dates: 12–18 Oct · Service Category: …"; when nights were derived: "· Nights set from the confirmed dates (7)" (Decision 5) |
| `legacy_backfilled` | "Legacy record created by Workspace (automatic)" |
| System actor | "Workspace (automatic)" (PD-ARC-08) |

Filter chips in Phase 1: **All · Stage & status · Ownership · Contact & category**. The other Rev 4a chips (Bookings, Readiness & documents, Tasks, Changes & notes, Archive, Alerts) appear when those events exist (Phases 2–3).

---

## 3. Readiness in Phase 1 (Product Owner Decision 4)

Decision 4: *Phase 1 shows the workflow but does not enforce readiness validation, because readiness content arrives in Phase 2.*

With no template items, the derived readiness state after Start preparation is **Ready** (no mandatory items outstanding). Showing a bare "Ready" chip would imply a check took place. The display is therefore:

| Surface | Phase 1 display (template assigned, no items) |
|---|---|
| Readiness chip (list row, Overview) | **"Ready"** chip (the Product state is unchanged) with the caption **"No checklist items yet"** |
| Overview readiness summary | "This Journey's readiness template doesn't have any items yet. Readiness checks start when templates are filled in." The four category rows are not shown. |
| Next step, In Preparation | "No readiness items to check yet. Mark this Journey ready to travel when preparation is done." Button: **Mark ready to travel**. |
| Mark ready to travel dialog | "This template has no readiness items yet, so nothing was checked." Confirm / Cancel. |
| Confirmed, no template yet | Chip **"Not Ready"** with caption "No template yet" |

These captions appear **only** when the template has zero items, so they disappear automatically when Phase 2 content is loaded. No Product state, label or rule changes.

---

## 4. Items not confirmed here

| Item | Owner |
|---|---|
| WS13-P1-I refusal wording: Arjun recommends one neutral message. Draft for the Product Owner: **"You don't have access to the SMV Workspace. If you think this is a mistake, please contact an Administrator."** | Product Owner decision (Rad's Rev 2 confirmation list) |
| WS13-P1-H Journey Planning screens for non-owners: not specified for Phase 1 (backlog, per Arjun's recommendation) | Product Owner confirmation |
| TL-06 user administration | Out of Phase 1 (Product Owner Decision 2) |

---

## 5. UX Statement

> The Phase 1 screens follow UX Revision 4a with later-phase features hidden, an honest readiness display under Decision 4, a template choice with no false suggestion, and the copy above. Nothing here changes a Product rule, the brand system or the Revision 4a design language. **Confirmed for implementation**, subject to the Product Owner's confirmation of the open items in §4.
>
> — Sophie, UX, UI and Frontend Experience Specialist, 4 October 2026
