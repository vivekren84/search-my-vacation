# EBC-016 — Release 1 Engineering Validation Report

## Scope and method

Independent, validation-only pass of the Release 1 experience against branch `main`, local server `http://localhost:3000`, using a single connected desktop Chrome browser (Claude in Chrome extension). No code was modified, staged, or committed at any point. Keerthi's and Sri's findings were not reviewed; observations below were recorded independently.

Areas covered: Homepage, Header, Destinations (India/International/Wildlife tabs), Experiences (card → Passport → pre-selection → editable flow), Travel Inspiration, Journey Passport (all steps, validation, progress, persistence), Journey Director (recommendations, reasoning, images, "This Feels Right" confirmation, WhatsApp CTA, callback form), Contact page ("Request a Callback" form), Forms validation, Branding consistency, Responsive layout, and the pre-flagged HeroJourney hydration warning.

---

## Executive Summary

The core traveller journey — Homepage mood selection → Journey Passport → Journey Director → WhatsApp/callback handoff — works correctly end to end, preserves state accurately (including a "Continue where you left off?" resumed-session feature), and reflects the approved brand system consistently across every page tested. One confirmed **Defect** was found in a secondary form (Contact page callback), plus several Engineering Observations, none of which block the core flow.

**Release Recommendation: Release Ready with Minor Observations.**

---

## Engineering Observations

1. **HeroJourney CTA hydration warning — Low severity, not reproduced live.** Per the pre-task investigation, the reported mismatch (`disabled={null}` server vs `disabled={true}` client, involving "Select your mood to begin") was not reproduced in the current browser profile after a hard reload, and no hydration warning appeared in the console. Static review of `HeroJourney.tsx` shows `useState<string | null>(null)` with `disabled={!selected}`, which should render `disabled={false}` (not `disabled={null}`) on both server and client — no genuine literal SSR/CSR mismatch is evident in the code as written. Incognito-window testing (requested as part of the investigation protocol) could not be completed: the Claude in Chrome extension's tab tools do not expose Incognito windows, which is a tooling limitation, not a code finding. No confirmed user-visible impact. Recommend: if the warning recurs, capture the exact console stack trace and browser/extension list at the time it appears.

2. **Console noise from browser-extension content scripts.** ~50 `"A listener indicated an asynchronous response by returning true, but the message channel closed..."` exceptions were logged, all attributed to the journey-passport page context. This is a well-known Chrome-extension artifact (not attributable to Search My Vacation application code) and was not counted as a defect.

3. **Recommendation imagery thematic fit.** For a traveller who described a "wildlife adventure," the top-ranked Karnataka ("The Perfect Match") recommendation card surfaces a Hampi/temple-style hero image rather than a wildlife-themed one, while the second-ranked Bandipur/Wildlife card ("The Beautiful Puzzle") is well-matched. The region-serving/ranking logic is correct; only the representative photo choice for the top card feels slightly off-theme. Cosmetic, not functional.

4. **Experiences pre-selection operates at the travel-style-tag level, not the Dream Journey level.** Arriving at Journey Passport via an Experience card (e.g., "Memory Makers") correctly pre-selects a matching travel-style tag ("Photography") at step 4, with the "We've pre-selected this based on how you started your journey" banner and full editability confirmed working. However, step 3 (Dream Journey type) has no pre-selection in this flow, unlike the Destinations flow, which pre-fills both Dream Journey type and destination from a `?destination=` param. This may be intentional (an Experience represents a feeling rather than a place), but is flagged for product confirmation since it's a real behavioural difference between the two entry points.

5. **Native date-picker inputs resisted automated keyboard testing.** Both the Journey Director callback form and the Contact page callback form use native `<input type="date">` fields. Automated keyboard entry produced inconsistent, partially-filled values (e.g., day segment not registering) across repeated attempts. This is assessed as a testing-tool limitation rather than a confirmed product defect — recommend a manual spot-check of the date picker on a real device before sign-off.

6. **Responsive breakpoint validation could not be completed live.** The connected browser's `resize_window` tool reported success at 1440×900 (desktop), 768×1024 (tablet), and 390×844 (mobile), but the captured screenshot remained fixed at the original ~1400×841 rendering in all three cases — a tooling limitation of this browser connection, not a confirmed site defect. Static review of the code shows deliberate responsive patterns throughout (Tailwind `sm:`/`md:` breakpoints, `clamp()`-based fluid header logo sizing rather than fixed breakpoint jumps), but this has not been visually confirmed live in this session. Recommend a manual DevTools/device pass before final sign-off.

Two initially suspicious observations were investigated and ruled out as non-issues: a dimmer "Destinations" nav link on `/destinations` (confirmed to be a lingering `:hover` state from the click point, not an active/inactive style defect), and a blank area below the "Pace & Timing" tag selector during a scroll capture (confirmed to be a transient scroll-reflow artifact, not a layout bug).

---

## Defects

### 1. Contact page callback form does not validate phone number format — **Medium severity**

**Location:** `/contact` → "Request a Callback" form.

**Steps:** Entered Name "Rad Tester", Phone number `12345` (5 digits, clearly invalid), a valid future date, default preferred time, and checked the consent box.

**Result:** The "Continue on WhatsApp" button enabled normally with no inline validation error shown at any point. Clicking it generated and opened a WhatsApp deep link with the invalid number embedded directly in the prefilled message text: `...Phone: 12345...`.

**Why this matters:** The Journey Passport and Journey Director flows both enforce 10-digit mobile validation with inline error messaging elsewhere in the product, so travellers reasonably expect the same protection here. Without it, the team could receive callback requests with unusable phone numbers and no way to reach the traveller.

**Recommendation:** Apply the same phone-format validation pattern already used on the Journey Passport/Director mobile fields to this Contact-page form. Not a blocker for the primary Journey Passport → Journey Director flow, but should be fixed promptly since it affects a live lead-capture channel.

No other defects were found.

---

## Release Recommendation

**Release Ready with Minor Observations.**

The primary product journey — mood selection, Journey Passport, Journey Director recommendations and reasoning, "This Feels Right" confirmation, session persistence, and the WhatsApp/callback handoff — is functionally sound and consistently on-brand. The one confirmed Defect is narrow in scope (a single secondary form) and does not block release, but should be scheduled for a quick fix. The Engineering Observations are either already Low-severity/non-reproducing, cosmetic, or testing-tool limitations that should be closed out with a manual pass (responsive breakpoints, date pickers) rather than blocking sign-off.
