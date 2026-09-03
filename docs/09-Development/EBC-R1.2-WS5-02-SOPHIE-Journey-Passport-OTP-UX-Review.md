# EBC-R1.2-WS5-02 — Journey Passport OTP Verification: UX Review & Experience Integration

```text
Document Type : UX Review (evidence-based, non-redesign)
EBC ID        : EBC-R1.2-WS5-02
Persona       : Sophie — UX, UI and Frontend Experience Specialist
Workstream    : WS5 — International Phone Number & OTP Verification
Tracker Task  : R1.2-05.20 (Define Journey Passport OTP flow — Arjun/Sophie share); informs R1.2-05.22
                (Implement OTP entry screen), R1.2-05.24–05.27
Reviewer      : Tiger | Business Owner: Vivek
Status        : Approved
Approved By   : Product Owner — Vivek; Delivery Lead — Tiger
Approval Date : 22 Aug 2026
Approval Note : This approval covers the UX structure, interaction design, accessibility and
                mobile guidance in Sections 2–3 and 5–8. The draft traveller-facing copy in
                Section 4 remains pending separate Arjun/Vivek copy approval before production
                use, consistent with this document's own Section 9 readiness note.
Implementation: NOT authorised by this document (UX review only)
Code Changes  : NONE — review only
```

---

## 0. Session, Repository and Input Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access via the device bridge, source of truth per Project Instructions Section 14).
- Current branch: `feature/ewp-r1.2-ws4-003-visual-card-consistency`. Working tree at session start: clean, one untracked file (`docs/09-Development/EBC-R1.2-WS5-01-ARCHIE-Journey-Passport-OTP-Verification-Architecture-Review.md`, added by the prior Archie session, not by this review). This document is the only file this session adds. No source code, configuration, database, or dependency changes were made.
- **Mandatory reading completed in full:** `docs/00-Project-Compass/COMPASS.md`, `docs/09-Development/EBC-R1.2-WS5-01-ARCHIE-Journey-Passport-OTP-Verification-Architecture-Review.md` (the approved architecture this review builds on and does not contradict), `docs/10-Backlog/RELEASE-1.2.md` §"Workstream 5" and §6.5 task table, `docs/04-UX/JOURNEY-PASSPORT-PREMIUM-EXPERIENCE-REVIEW-v1.0.md` (the canonical UX reference for Journey Passport). `docs/00-Project-Compass/PROJECT-STANDARDS.md` and `web/CLAUDE.md` were opened and found to be empty (0 and 11 bytes respectively) — nothing to draw from there; noted rather than silently skipped. `docs/15-AI-Operating-Model/CLAUDE.md` (Team Satvi operating model) is already active as this session's Project Instructions.
- **Repository source inspected directly (full files):** `web/components/journey-passport/JourneyPassport.tsx`, `PassportStamp.tsx`, `JourneyChapterProgress.tsx`, `JourneyPassportNavigation.tsx`, `JourneyPassportMoments.tsx`, `web/hooks/useJourneyPassport.ts`, `web/config/journey-passport.config.ts`, `web/types/journey-passport.types.ts`, `web/app/journey-passport/page.tsx`, `web/app/api/journey-passport/leads/route.ts`, `web/components/destinations/DestinationItineraryModal.tsx` + `.module.css` (the codebase's only true `<dialog>`-based modal, reviewed as the nearest precedent for "OTP Verification Dialog"), `web/lib/journey-passport/entry-context.ts`, and the relevant sections of `web/app/globals.css` (`.journey-passport-closure*`, `.passport-closure-*`, `--color-amber`/`--color-espresso`/`--font-editorial` tokens).
- **Related report consulted:** the Team Satvi project record `EWP-R1.2-WS4-002-Accessibility-Implementation-Report.md` (Rad, 20 Aug 2026) — the most recent verified accessibility audit of exactly this component tree. Its findings are treated as current fact, not re-derived from scratch, per Project Instructions §13.
- **Filed at:** `docs/09-Development/EBC-R1.2-WS5-02-SOPHIE-Journey-Passport-OTP-UX-Review.md`.

---

## 1. Executive Summary

Archie's architecture review (`EBC-R1.2-WS5-01`) already fixed the two hardest UX questions by placing them inside the constraint set Rad must build against: OTP sits **inside the existing closure screen**, not as a redirect or a separate route, and the Passport Stamp must not fire until **after** verified submission. This review does not revisit either decision. Its job is to say how the OTP sub-flow should look, sound, and behave inside that constraint, using the closure screen's own established visual language rather than inventing a new one.

Direct inspection of `JourneyPassport.tsx` and `web/app/globals.css` (`.journey-passport-closure.is-stamping`, lines 248–251) confirms Archie's finding independently: today the Passport Stamp animates onto the page 720ms after the traveller presses "Stamp My Journey Passport" — visibly, with its own `passport-approved-stamp` keyframe — and is already fully opaque by the time the contact form appears at 1220ms. A traveller today watches their Passport get stamped, then is asked for their name and phone number. This is not a small timing detail; it is the exact scenario Vivek's approved decision ("Passport Stamp only after successful submission") was written to prevent, and OTP verification will sit for even longer in front of a stamp the traveller has already seen. Resequencing is out of this review's authority to mandate (that is Rad's implementation, Tiger's sequencing) but is flagged here at Sophie-review severity because no UX polish on the OTP screen itself can fix a promise the ceremony breaks before the OTP screen even appears.

The central UX recommendation of this review: **do not build the OTP entry as a stacked dialog/modal.** The codebase has exactly one true modal (`DestinationItineraryModal`, a native `<dialog>`) and one hand-rolled modal (`JourneyPassport.tsx`'s exit-confirmation overlay) — two different focus-trap implementations already coexist for two different reasons. A third pattern, layered on top of the closure card specifically to hold OTP, would fragment the codebase's dialog conventions further and would interrupt the "one conversation, gradually becoming specific" feeling the Premium Experience Review names as the Passport's defining quality. Archie's own architecture (§2.9, §8) already points the same way: OTP is "a new sub-state ... shown in place of (not instead of) the current form," living in local `useState`, not routed, not modal. Every recommendation below builds the OTP entry as a continuation of the same glass card the contact form already renders in — reusing its type scale, its input styling, its `role="alert"`/`role="status"` conventions, its ghost-button pattern, and the `journey-passport-reveal` transition class already used elsewhere in the flow (Exact Dates) for exactly this kind of progressive, in-place reveal.

No new visual language is proposed anywhere in this document. Every treatment recommended below is an existing pattern from this same component, cited by file and line.

---

## 2. Traveller Journey Assessment

**Approved flow (Archie §2.9, §10; Release 1.2 tracker R1.2-05.20):**

```
Journey Passport (7-step wizard, unchanged)
        ↓
Closure screen: name + phone entered
        ↓
Send OTP → SMS delivered
        ↓
Traveller enters code → Verify
        ↓
Journey Passport Submission (server-validated, token-gated)
        ↓
Passport Stamp  ← must fire here, not earlier
        ↓
Journey Landing
```

**Continuity.** The traveller has just spent six chapters being asked open, emotionally framed questions ("Who will be sharing this journey with you?", "What kind of journey has been living in your heart lately?"). The closure screen's contact form already downshifts tone appropriately — "Keep your journey connected" reads as an invitation, not a transaction. OTP must inherit that same downshift, not re-elevate the stakes. The two SMS-specific words a traveller will see for the first time in this entire flow — "code" and "verify" — are the only moment in the whole Passport where the interface sounds like a system rather than a travel designer. That is acceptable (Vivek's decision requires it), but it means the surrounding copy carries more weight than usual to keep the moment feeling like continued hospitality rather than a checkpoint. Section 4 gives specific copy.

**Perceived friction.** OTP is, unavoidably, the single highest-friction moment in the entire Passport — it is the only step that leaves the browser (SMS) and requires the traveller to context-switch to their messaging app and back. Two design decisions materially reduce that friction and are recommended as non-negotiable for the entry experience (both are technical/UX calls this review is positioned to make, per Archie §9's note that "masked-number display... is Sophie/Rad's call"):

1. **A single text input for the 6-digit code, not six segmented boxes.** No segmented-input precedent exists anywhere in this codebase (every field in the Passport, including the 10-digit mobile field at `JourneyPassport.tsx:167`, is one `<input>`). A single input is simpler to build, consistent with the codebase's own conventions, and — critically — is what makes `autocomplete="one-time-code"` work reliably for OS-level SMS autofill (Section 6). Segmented inputs need custom focus-advance-on-keystroke logic that six-box implementations frequently get wrong for screen readers and slow typers; a single input needs none of it.
2. **Masked number confirmation, not full redisplay.** Show the traveller enough of the number they entered to confirm the code was sent to the right place, without redisplaying it in full on screen a second time. Recommended format: `Code sent to +91 98765 ••210` — country code and enough leading digits to be recognisable, last 3 digits visible, middle masked. This is a small trust signal ("they sent it to the right number") without turning the confirmation screen into a second display of the traveller's full PII.

**Emotional flow.** The premium review's own scoring pattern (Section 15 of the Premium Experience Review) rates "Journey Director Transition" — the moment right after this one — as the Passport's best-scoring chapter, precisely because it makes the human handoff visible. OTP verification sits directly upstream of that payoff. If OTP feels bureaucratic, it is the last thing the traveller experiences before the moment the whole Passport has been building toward, and that ordering is exactly why the resequencing flagged in Section 1 is not cosmetic: today's flow lets the traveller see the reward (the stamp) and then makes them do the least emotionally rewarding task (SMS verification) — backwards from what Sri's "memory test" methodology in the Premium Experience Review would call a strong ending.

---

## 3. OTP Interaction Assessment

### 3.1 Container: extend the card, do not stack a dialog

Recommended DOM/visual shape: the existing `<form className="journey-passport-reveal mx-auto mt-7 max-w-md text-left">` block (`JourneyPassport.tsx:163`) gains a second internal stage. On "Send code," the name/mobile fields are replaced in place — not layered under a modal — by the OTP sub-state, using the same `journey-passport-reveal` entrance treatment already applied to the Exact Dates reveal in `JourneyPassportMoments.tsx:63` (`TimingMoment`/`PaceAndTimingMoment`). This keeps the traveller's eye anchored to the same card position they've been reading for the last several seconds — no new overlay, no backdrop, no re-centering.

Do not use `role="dialog"`/`aria-modal="true"` for this sub-state. It is not a dialog in any sense the codebase's two existing dialog patterns use (both are things layered *on top of* other content the traveller might want to return to); OTP entry is the content itself, just as the Exact Dates reveal is not a dialog either.

### 3.2 Layout and hierarchy (desktop and mobile — one layout, not two)

The existing closure form is already `max-w-md`, single-column, and centered — this is inherently mobile-appropriate and requires no separate desktop/mobile layout branch, consistent with every other Passport moment in this codebase (no component in `JourneyPassportMoments.tsx` branches its JSX by breakpoint; all use fluid Tailwind utilities). Recommended structure, top to bottom, matching the existing form's heading/label/input/help-text/button rhythm:

1. Heading, reusing the existing `<h2 className="text-center text-xl font-semibold text-[#2A211C]">` pattern: **"Confirm your number"** — not "Enter OTP," not "Verification," language a traveller does not use about themselves.
2. One line of masked-number confirmation with a **"Change number"** ghost-style link inline (reusing the existing `!bg-transparent !text-[#2A211C] !shadow-none` treatment from the "Review my Passport" button at `JourneyPassport.tsx:172`) — this is the "edit phone number mid-flow" affordance Archie's §7 requires the client to support.
3. The single 6-digit code input, styled identically to the existing mobile-number input (`mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]`, `JourneyPassport.tsx:167`) — same border colour, same radius, same focus ring, same 48px min-height touch target.
4. Inline error/status region directly below the input, reusing the exact `role="alert"`/`role="status"` split already established (`JourneyPassport.tsx:168–169`) — see Section 4 for exact copy per state.
5. Primary button: **"Verify code"**, exact same visual treatment as the existing "Move to Journey Director" button (`w-full`, `bg-[#F5951C]` via the shared button styling, `disabled`/`aria-busy` pattern already present).
6. A secondary, low-emphasis resend affordance beneath the primary button, using the same ghost-button treatment as "Review my Passport" — see Section 5 for its exact states.

### 3.3 Readability

All copy in this sub-state should hold to the same line length and reading level as the rest of the closure screen (short sentences, second person, no field-name vocabulary — the Premium Experience Review's §16 "Storytelling Consistency" explicitly bans words like "payload," "algorithm," "profile"; the same discipline extends to "OTP," "token," and "challenge," none of which should ever reach traveller-facing copy even though they are the correct internal/architecture terms). "Code" is the one technical-adjacent word that is acceptable and necessary.

### 3.4 Accessibility, keyboard, screen reader — see Section 5 in full (kept as its own top-level section per the EBC's deliverable list); summarised here as it bears on interaction design: the sub-state transition must move programmatic focus to the new heading, exactly as every other moment change in this flow already does (`headingRef.current?.focus()` pattern, `JourneyPassport.tsx:52`; `acknowledgementRef.current?.focus()`, line 68). Nothing new needs to be invented — the convention already exists and should simply be extended to this one more state change.

---

## 4. Traveller Messaging Recommendations

All copy below matches the existing voice register in this exact component (warm, second person, short) and is offered as a starting point for Arjun/Sophie's joint R1.2-05.20 flow-definition pass, not as final approved copy — copy approval sits with Arjun/Vivek per the persona routing, not Sophie alone.

| State | Recommended copy | Rationale / pattern reused |
|---|---|---|
| OTP sent | "Code sent to +91 98765 ••210. It should arrive within a minute." | Matches the reassuring, specific tone of "We've carefully captured what matters most to you." Avoids "OTP" as a standalone label. |
| Incorrect OTP | "That code doesn't match — please check and try again." | Mirrors the existing mobile-field error tone ("Please enter a valid 10-digit mobile number") — corrective, not accusatory. Must render via `role="alert"`, matching `id="issued-passport-error"` pattern. |
| Expired OTP | "This code has expired. Send a new one to continue." | Names the fix in the same sentence, consistent with every other validation message in this component. |
| Resend available | "Resend code" as a plain ghost-button label once the cooldown ends — no extra copy needed beyond the button itself, matching how "Review my Passport" needs no surrounding explanation. |
| Resend counting down | "Resend available in 0:24" — muted, non-interactive text in place of the button (see Section 5). |
| Resend exhausted | "You've reached the resend limit for this number. Please check the number below, or try again in a few minutes." | Gives the traveller the one action that actually helps (check/change the number) rather than a dead end — matches Archie §7's requirement that this state directs the traveller to re-enter/change the number. |
| Verification success | "Number confirmed." — brief, then the existing "Your Passport is connected. Preparing your possibilities…" status message continues exactly as today (`JourneyPassport.tsx:169`), since verification success flows straight into the existing submission-success message rather than needing its own separate celebration. |
| Verification failure (network/provider) | Reuse the existing `JOURNEY_LEAD_FAILURE_MESSAGE` pattern and tone exactly (`client.ts`) — a calm, generic retry message, never exposing provider or technical detail, per Archie §7. |

General rule carried from the Premium Experience Review (§16, "Emotional Consistency"): *"A disabled control should communicate guidance, not rejection."* Every disabled/blocked state above names the next helpful action in the same sentence as the limitation — none of them are a dead-end "error" with no path forward.

---

## 5. Accessibility Assessment

This section extends, rather than repeats, the verified findings of `EWP-R1.2-WS4-002` (Rad, 20 Aug 2026), the most recent audit of this exact component tree. That audit confirmed as **already compliant**: heading focus management on every moment transition, consistent `role="alert"`/`role="status"` usage for validation and status messages, full form labelling with correct `autoComplete`/`inputMode`/`aria-describedby`, reduced-motion handling on every timed transition, and native `<button>` semantics throughout (no custom keyboard handling needed for ordinary controls). That audit also recorded one **unresolved, disclosed gap**: colour contrast has never been measured with a dedicated tool in this codebase, only reviewed by visual inspection. This matters directly for OTP: any new muted/secondary text (a countdown, a masked-number line) must not reuse the lightest existing tones (e.g. `#958473`, used for "upcoming" chapter-stepper labels in `JourneyChapterProgress.tsx:13`) without that measurement finally being done — recommend Keerthi run an actual contrast check on the specific hex values chosen at implementation time, rather than carrying the assumption forward a second time.

**Focus order.** On "Send code," focus moves to the new "Confirm your number" heading — extending the existing `acknowledgementRef`/`headingRef` convention, not inventing a new one. On "Verify code" success, focus should move to the existing success status message (already `role="status"`), matching how the flow already works today. On error, focus should remain on the code input (do not move focus to the error message itself — this matches how the existing name/mobile error at `JourneyPassport.tsx:168` behaves: it appears near the field the traveller is already focused on, and `aria-describedby` — not a focus jump — is what connects them for screen-reader users).

**Keyboard.** Tab order: masked-number line → "Change number" link → code input → "Verify code" button → resend affordance. No custom trap is needed anywhere in this sub-state (Section 3.1 — it is not a modal). This is a meaningfully simpler accessibility surface than a dialog would require, and is one more reason to keep it as an in-card state rather than a stacked overlay.

**Screen reader behaviour.** Reuse the two-role convention already established and audited: `role="alert"` for anything that blocks progress (incorrect code, expired code, resend exhausted, network failure) so it is announced immediately and interrupts; `role="status"` for anything informational that shouldn't interrupt (code sent, verifying, verified). Do not introduce a generic always-live "announcer" region — none exists in this codebase, and per-message roles is the established, already-audited pattern.

**Dialog accessibility.** Not applicable — see Section 3.1. This absence of a modal is itself the accessibility recommendation: it means Rad does not need to build or QA a third focus-trap implementation, and Keerthi does not need to write a third dialog-specific test pass.

**Live error announcements.** Covered above; the pattern is identical to what `EWP-R1.2-WS4-002` already verified for the rest of this component, applied to two new states (incorrect/expired code) rather than requiring new infrastructure.

---

## 6. Mobile Experience Assessment

**Numeric keyboard.** The code input must use `inputMode="numeric"` — exact match to the existing mobile-number field (`JourneyPassport.tsx:167`) — so mobile browsers surface a numeric keypad rather than the full keyboard.

**OTP autofill.** This is the one genuinely new mobile-specific technical recommendation this review makes, not present anywhere else in the codebase to model from: the code input should carry `autoComplete="one-time-code"`. On iOS Safari and most Android browsers, this lets the OS read an incoming SMS matching the expected pattern and offer (or automatically insert) the code above the keyboard — removing the app-switch entirely for a large share of travellers. This has a direct dependency on the SMS copy itself: the message template registered with the SMS provider (MSG91/Twilio, per Archie §4.3, pending Vivek's approval) should include the code as a standalone number near the start of the message and, ideally, the site's domain, since both iOS and Android autofill heuristics key off message shape — this is a detail for Rad and whoever drafts the DLT-registered SMS template, flagged here because it is invisible to a UX review of the web UI alone but directly determines whether the mobile experience feels instant or requires a manual app-switch.

**One-handed interaction.** The single-input approach (Section 2) keeps the entire interaction — read the heading, read the masked number, tap the field, type six digits, tap Verify — reachable within the same thumb-reach zone as the existing mobile-number entry immediately above it in the flow. A six-box segmented input would not change this materially for typing, but would add six discrete tap targets where miss-taps are more consequential (landing in the wrong box) — another reason to prefer one input.

**Responsive layout / dialog sizing.** Since this is not a dialog (Section 3.1), there is no dialog sizing question to solve — it inherits the existing closure card's already-responsive `max-w-md` container, which the Premium Experience Review already rates well for its current contents (dimension scores in Section 6–11 of that review consistently mark "Premium craft" and "Trust" at 4–5/5 for comparable in-card reveals like Exact Dates).

---

## 7. Error Recovery Assessment

| Scenario | Recommended recovery | Basis |
|---|---|---|
| Invalid phone number | Client-side check before "Send code" is even enabled, identical in spirit to the existing 10-digit check at `JourneyPassport.tsx:99`; server independently re-validates per Archie §7 — no UX change needed beyond extending the existing inline error pattern to the (E.164-aware) phone field itself, which is a Workstream 5 phone-capture concern, not this EBC's. |
| SMS delivery delay | Do not show an error for delay alone — Archie §7 is explicit that a pending challenge stays `pending`. UX should show the "Code sent…" status message and let the resend cooldown (Section 4/5) be the traveller's own signal that enough time has passed, rather than a separate "still waiting?" message that risks sounding anxious. |
| Network failure (send or verify request) | Generic retry message, reusing `JOURNEY_LEAD_FAILURE_MESSAGE`'s tone exactly — see Section 4. |
| Expired OTP | See Section 4 copy; recovery action is "send a new one," surfaced as the same resend affordance already on screen — no separate error state UI needed. |
| Incorrect OTP | See Section 4 copy; traveller remains on the same screen, code input clears or stays (Rad's call — either is acceptable UX, but the field should not be pre-filled with the wrong code once cleared, to avoid a stale-input feel), focus stays on the input. |
| Resend limit reached | See Section 4 copy; the "Change number" affordance (already on screen per Section 3.2, item 2) becomes the primary recovery path, exactly as Archie §7 specifies. |
| Traveller abandons/refreshes mid-OTP | Per Archie §8, the traveller returns to the initial contact form, not a resumed OTP screen. From a UX standpoint this must be silent and ordinary — no "your session expired" message, since nothing was actually lost from the traveller's point of view (they still have their name/number to re-enter, which the existing draft-restore mechanics may already preserve since `mobile`/`name` are part of `JourneyPassportState`). No new "resume OTP" affordance should be built — that would contradict Archie §8's explicit security rationale (a persisted "verified" flag would be spoofable). |

---

## 8. Implementation Recommendations

For Rad, consolidating this review's UX-specific input to Archie's already-approved component-impact table (`EBC-R1.2-WS5-01` §9):

1. Build the OTP sub-state as a second internal stage of the existing closure `<form>` (Section 3.1) — no new dialog component, no new focus-trap utility.
2. Single `<input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}>` for the code — not a segmented 6-box input (Section 2, 6).
3. Reuse existing input styling verbatim (border, radius, focus ring, min-height) from the mobile-number field.
4. Reuse existing `role="alert"`/`role="status"` split and the `id`+`aria-describedby` wiring pattern already present in this file — do not introduce a new alerting mechanism.
5. Extend the existing `headingRef.current?.focus()` convention to the new "Confirm your number" heading on transition into the OTP sub-state.
6. Use the `journey-passport-reveal` class for the transition into the OTP sub-state, matching the Exact Dates precedent.
7. Reuse the existing ghost-button treatment (`!bg-transparent !text-[#2A211C] !shadow-none`) for both "Change number" and "Resend code."
8. Masked-number display format: country code + leading digits + last 3 digits visible, middle masked (Section 2) — implement as a small, pure display-formatting helper, not a new dependency.
9. **Flag to Tiger/Rad, not a UX instruction:** the stamp-resequencing already mandated by Archie's approved architecture (§8) should be treated as a hard prerequisite for this EBC's "done," not a nice-to-have — an OTP screen built beautifully in front of a stamp the traveller has already seen does not fix the trust problem Section 1 describes. This review does not have authority to mandate sequencing (Tiger's role) but records the observation at the severity a UX reviewer would give it.
10. Get an actual colour-contrast measurement (Section 5) on whatever final hex values are used for the new countdown/masked-number text — do not carry the unmeasured-contrast assumption forward a third time.

---

## 9. UX Readiness Assessment

| Success criterion (from this EBC) | Status |
|---|---|
| Traveller journey reviewed for continuity/emotional flow | Complete — Section 2 |
| OTP dialog/interaction layout, hierarchy, readability, mobile/desktop reviewed | Complete — Section 3 (with the recommendation that it not be a dialog at all, justified from architecture and codebase precedent) |
| Traveller messaging reviewed for all required states | Complete — Section 4 (draft copy offered; final approval sits with Arjun/Vivek per persona routing) |
| Resend experience reviewed | Complete — Section 3.2/4/5 |
| Error recovery reviewed for all required scenarios | Complete — Section 7 |
| Accessibility reviewed against Release 1.2 standard | Complete — Section 5, explicitly building on `EWP-R1.2-WS4-002`'s verified findings rather than re-deriving them |
| Mobile experience reviewed | Complete — Section 6, including one new technical recommendation (SMS autofill / `autocomplete="one-time-code"`) not present elsewhere in the codebase |
| Emotional experience confirmed as continuation of Journey Passport | Reviewed — Section 1/2; conditional on the stamp-resequencing already required by the approved architecture actually being implemented as part of this EBC, not deferred |
| No architecture decisions contradicted | Confirmed — every recommendation here operates inside Archie's approved integration point (§2.9) and state model (§8) |
| No product decisions revisited | Confirmed — Passport Stamp meaning, OTP scope-to-Journey-Passport-only, resend limits, and "not an authentication feature" are all treated as final, per the EBC's own "Approved Product Decisions" |
| Out-of-scope items avoided | Confirmed — no recommendation here touches CAPTCHA, email verification, login/account creation, additional traveller information, budget capture, or Release 2 items |
| No source code modified | Confirmed |
| No temporary/desktop files created | Confirmed — this document was authored directly for repository placement |
| Documentation stored inside the repository | Confirmed — filed at `docs/09-Development/EBC-R1.2-WS5-02-SOPHIE-Journey-Passport-OTP-UX-Review.md` |

**Overall assessment: UX-ready for Rad's implementation planning and for Arjun's joint flow-definition pass (R1.2-05.20), contingent on the stamp-resequencing already required by the approved architecture being scoped into the same implementation window, and on Arjun/Vivek approving or amending the draft copy in Section 4 before it reaches production.**
