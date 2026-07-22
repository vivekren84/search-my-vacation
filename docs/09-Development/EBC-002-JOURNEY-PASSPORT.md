# EBC-002 — Journey Passport v1.0

| Field | Value |
| --- | --- |
| **Card type** | Experience Build Card |
| **Status** | Ready for implementation |
| **Priority** | P0 — Release 1 discovery experience |
| **Owner** | Team Satvi |
| **Product authority** | `docs/02-Product/JOURNEY-PASSPORT-v1.0.md` |
| **Last updated** | 20 July 2026 |
| **Build boundary** | Homepage “Plan My Experience” through **✨ Discover My Possibilities**, then exit |

> This card is an implementation blueprint. It translates approved product and UX intent into build requirements. It does not redefine the Journey Passport experience.

---

## Reference Authority

The following documents are mandatory sources of truth:

1. `docs/02-Product/PRODUCT-VISION.md`
2. `docs/07-Design/BRAND-IDENTITY.md`
3. `docs/07-Design/DESIGN-PRINCIPLES.md`
4. `docs/04-UX/COLOR-SYSTEM.md`
5. `docs/04-UX/TYPOGRAPHY.md`
6. `docs/07-Design/BLUEPRINTS/HOMEPAGE-BLUEPRINT.md`
7. `docs/02-Product/JOURNEY-PASSPORT-v1.0.md`

If this card appears to conflict with the Journey Passport product specification, the specification governs product behaviour and copy. If visual implementation is unclear, approved brand, colour, typography and design principles govern. No implementation convenience may introduce a new question, remove an approved interaction, change the final CTA, collect deferred logistics or turn discovery into planning.

---

## 1. Overview

### 1.1 Purpose

Implement Journey Passport v1.0 as Search My Vacation’s focused discovery experience. It begins when a traveller chooses **Plan My Experience** on the homepage and ends immediately after the traveller chooses **✨ Discover My Possibilities**.

The build must feel like the first conversation with a trusted Journey Director, not a generic form. Its function is to gather the minimum approved discovery context, preserve what the traveller has already shared, guide choices without hard system feedback and create a complete local handoff payload for a future consumer.

### 1.2 Build scope

The implementation includes:

- homepage entry from **Plan My Experience**;
- preservation of eligible homepage context;
- a dedicated Journey Passport route or experience boundary;
- Welcome;
- About You;
- Travel Companions;
- Dream Journey;
- Travel Style;
- Perfect Timing;
- Destination;
- Discover My Possibilities completion;
- journey-oriented progress indication;
- consistent forward and backward navigation;
- conversational validation;
- adaptive interactions defined in the product specification;
- responsive mobile, tablet and desktop layouts;
- keyboard, screen-reader, touch and reduced-motion support;
- a typed, central state model;
- temporary session persistence across refresh;
- completion and exit handling;
- extension points that do not activate future capabilities.

The eight Journey Passport moments in this card are Welcome through Discover My Possibilities. Destination is the final question; Discover My Possibilities is the review and completion moment.

### 1.3 Dependencies

- Existing homepage and **Plan My Experience** entry action.
- Existing Search My Vacation route structure and application shell.
- Existing semantic colour and typography tokens.
- Existing approved Golden Hour visual language where used by the website.
- Existing image optimisation and asset conventions.
- Existing lint, type-check and production-build commands.
- Approved microcopy in `JOURNEY-PASSPORT-v1.0.md`.

No backend, account, AI or recommendation dependency is permitted for this card.

### 1.4 Deliverables

1. Complete production-quality Journey Passport flow.
2. Homepage entry wired to the Welcome moment.
3. All eight moments implemented in the approved order.
4. Reusable component set and typed configuration.
5. Central state and validation model.
6. Temporary, versioned session persistence.
7. Responsive layouts for mobile, tablet and desktop.
8. Accessible interactions and focus management.
9. Reduced-motion-safe transitions.
10. Completion payload and configurable exit callback without recommendation generation.
11. Automated tests where supported by the repository and documented manual checks.
12. Final file list, validation results, assumptions and deferred items.

### 1.5 Out of scope

Do not build or simulate:

- recommendation generation;
- destination ranking;
- AI or conversational AI;
- Journey Director interfaces or workflows;
- authentication or user accounts;
- saved Passports beyond temporary browser-session continuity;
- persistent databases or backend submission;
- CRM integration;
- Journey Builder;
- itinerary creation or editing;
- pricing or availability;
- booking, payment or quotation;
- traveller memory across sessions or devices;
- analytics dashboards;
- A/B-test administration;
- logistical questions including budget, airports, hotels, flights, visa, passport, children’s ages, rooms, meals, insurance or special-request details.

### 1.6 Constraints

- Do not change approved Journey Passport copy except to correct an obvious typographical error with Product approval.
- Do not add questions or contact forms absent from the eight-moment flow.
- Do not make Destination an earlier question.
- Do not permit more than three Travel Style choices.
- Do not use hard-error banners for ordinary discovery constraints.
- Do not automatically advance after a card selection.
- Do not claim recommendations were generated or a Journey Director was notified.
- Do not modify unrelated homepage sections.
- Do not redesign the global header or Golden Hour Hero.
- Do not add a dependency when existing platform or CSS capability is sufficient.
- Follow the EBC Execution Standard and stop when this card’s acceptance criteria are met.

---

## 2. User Flow

```text
Homepage
  ↓
Plan My Experience
  ↓
Welcome
  ↓
About You
  ↓
Travel Companions
  ↓
Dream Journey
  ↓
Travel Style
  ↓
Perfect Timing
  ↓
Destination
  ↓
Discover My Possibilities
  ↓
Exit Journey Passport
```

### 2.1 Entry flow

1. Traveller selects **Plan My Experience**.
2. Any approved homepage selection is serialised into the Journey Passport entry context.
3. Journey Passport opens at Welcome unless a valid temporary session draft exists.
4. If a valid draft exists, present a lightweight resume choice: “Continue where I left off” or “Start again.” Do not silently drop the traveller into a later moment.
5. Starting again replaces only the temporary Journey Passport draft after explicit selection.

### 2.2 Core progression

- Welcome contains no progress indicator and has one primary action.
- From About You onward, progress identifies the current Journey Chapter without form-wizard language.
- Each selection changes state but does not navigate automatically.
- The primary continuation control becomes available only when the current moment is complete.
- Back preserves all answers.
- Edits to earlier moments immediately affect dependent states, summaries and completion readiness.

### 2.3 Completion and exit

On **✨ Discover My Possibilities**:

1. Revalidate all required discovery state.
2. Build the versioned completion payload from explicit traveller answers and eligible entry context.
3. Mark local completion to prevent accidental duplicate activation.
4. Clear the temporary in-progress draft only after the completion handler succeeds locally.
5. Invoke the supplied completion callback or approved exit route.
6. Exit Journey Passport without rendering recommendations, an itinerary or a simulated Journey Director response.

The default no-backend integration must be honest. It may acknowledge that the discovery experience is complete, but it must not claim data was transmitted externally. The host application should own the final exit destination; where none is configured, return to the homepage through an explicit completion state.

### 2.4 Flow invariants

- Moment order is fixed for v1.0.
- Destination is always the final question.
- Discover My Possibilities is always the final Passport action.
- No answer is lost through ordinary navigation.
- No selection auto-advances.
- No future capability appears as if active.

---

## 3. Screen Specifications

### 3.1 Screen One — Welcome

#### Purpose

Orient the traveller, establish the Passport promise and create a calm beginning before asking a question.

#### UI components

- Journey Passport shell
- brand identity treatment
- immersive approved travel image or visual surface
- eyebrow/supporting label
- page title
- supporting copy
- primary action
- optional resume-draft choice when a valid draft exists

#### Layout

- One dominant content region with a controlled reading width.
- Brand, title, supporting message and action form a clear vertical hierarchy.
- Primary action remains visible without competing actions.
- Progress and Back are hidden.

#### Responsive behaviour

- Mobile: content flows naturally; image crop preserves a meaningful focal point; action spans an appropriate touch-friendly width without becoming edge-to-edge by default.
- Tablet: retain generous whitespace and readable line length.
- Desktop: use space for atmosphere, not additional content.
- Short landscape: allow vertical scrolling; never clip the action.

#### Copy

- Eyebrow: **A thoughtfully designed beginning**
- Title: **Welcome to Your Journey Passport**
- Supporting statement: **Every memorable journey begins with understanding the traveller behind it.**
- Additional context: **We take the time to understand what matters to you, so we can discover experiences that feel truly yours.**
- Primary action: **Begin My Journey**

#### Validation

None.

#### Interactions

- Begin My Journey advances to About You.
- Resume choice appears only when a valid temporary draft is detected.
- Starting again requires an explicit action; it must not occur on incidental navigation.

#### Animations

- Initial content may fade and rise subtly.
- Avoid theatrical passport-opening animation in v1.0 unless already approved and performance-safe.
- Reduced-motion mode displays content immediately or with a simple opacity change.

#### Accessibility

- One page-level heading.
- Meaningful imagery has descriptive alternative text; decorative overlays do not enter the accessibility tree.
- Primary action receives visible keyboard focus.
- Resume controls use clear accessible names.

#### Edge cases

- Corrupt or incompatible session draft: discard safely and show normal Welcome without an error.
- Missing image: preserve readable contrast and complete functionality.
- Long translated copy in future: layout wraps without clipping.

#### Completion rules

Welcome is complete when the traveller deliberately activates Begin My Journey or resumes a valid draft.

### 3.2 Screen Two — About You

#### Purpose

Capture the traveller’s preferred name and establish permission for progressive personalisation.

#### UI components

- progress indicator
- chapter heading and description
- labelled text input
- supporting microcopy
- Back and Continue controls
- conversational validation message region

#### Layout

- One primary input in a calm, narrow reading column.
- Input, reason and navigation remain visually connected.
- Navigation occupies the shared Passport navigation location.

#### Responsive behaviour

- Input uses the available mobile width and a minimum comfortable touch height.
- Desktop must not stretch the input across the full shell.
- On-screen keyboard must not hide validation or Continue; scrolling remains available.

#### Copy

- Title: **First, tell us about you.**
- Question: **What should we call you?**
- Supporting copy: **We’ll use your name to make every conversation feel personal.**
- Guidance when incomplete: **Please share the name you’d like us to use.**
- Optional positive transition after completion: **Lovely to meet you, {name}.**

#### Validation

- Required after trimming leading and trailing whitespace.
- Accept names containing international characters, spaces, apostrophes and hyphens.
- Minimum: 2 visible characters after trimming.
- Maximum: 80 characters.
- Do not require first name and surname separately.
- Do not reject a culturally valid single-word name.

#### Interactions

- Input updates the canonical traveller name.
- Continue remains disabled until valid.
- Enter may continue only when the field is valid and must not bypass validation.
- Editing the name updates all later uses.

#### Animations

- Validation guidance appears through a restrained fade.
- Do not animate individual keystrokes or repeatedly celebrate validity.

#### Accessibility

- Visible label remains present.
- Validation is associated with the input and announced when relevant.
- Do not rely on placeholder text as a label.
- Autofill uses the correct name hint without introducing a second state value.

#### Edge cases

- Paste containing line breaks: normalise line breaks to spaces.
- Only whitespace: invalid.
- Emoji-only entry: invalid as a preferred name unless Product later approves otherwise.
- Browser autofill: must update canonical state.

#### Completion rules

Complete when the canonical name passes validation.

### 3.3 Screen Three — Travel Companions

#### Purpose

Capture the principal social context of the journey.

#### UI components

- progress indicator
- title and subtitle
- single-select Journey Cards
- selected-state indicator
- Back and Continue controls

#### Layout

- Cards form one coherent radio group.
- Use a balanced grid at wider widths and a readable single or two-column arrangement at smaller widths.
- Card imagery and copy preserve equal visual priority across options.

#### Responsive behaviour

- Mobile: one or two columns only where labels remain readable; prefer one column at 320px if imagery and description require it.
- Tablet: two or three columns based on available width.
- Desktop: up to three columns with controlled maximum width.
- No horizontal carousel for required choices.

#### Copy

- Title: **Who will be sharing this journey with you?**
- Subtitle: **Every journey feels different depending on who is beside you.**
- Options: Solo, Couple, Family, Friends, Business.
- Use the approved option descriptions from `JOURNEY-PASSPORT-v1.0.md` exactly.

#### Validation

- Exactly one value required.
- Continue disabled before selection.
- No error banner.

#### Interactions

- Selecting a card updates the radio group.
- Selecting a different card replaces the first selection.
- Selection does not auto-advance.

#### Animations

- Selected card receives a restrained border, elevation or check transition.
- Hover elevation is desktop-pointer enhancement only.
- Touch has immediate pressed feedback.

#### Accessibility

- Implement as a labelled radio group or equivalent fully conformant pattern.
- Each card communicates label, description and selected state.
- Arrow-key behaviour follows the selected radio pattern where native radios are used.
- Images are decorative when label and description fully convey meaning.

#### Edge cases

- Image load failure leaves label, description and selection fully usable.
- Long text does not change selection target size unpredictably.
- Business must not imply a detailed corporate-travel workflow.

#### Completion rules

Complete when one companion context is selected.

### 3.4 Screen Four — Dream Journey

#### Purpose

Capture the broad journey character that most excites the traveller.

#### UI components

- progress indicator
- title and guidance
- six single-select visual Journey Cards
- Back and Continue controls

#### Layout

- Visually cohesive card collection.
- Image, title and one evocative description per card.
- Avoid a dense collage or competing decorative content.

#### Responsive behaviour

- Mobile: one column at narrow widths; two only when imagery and text remain legible.
- Tablet: two columns.
- Desktop: three columns.
- Maintain consistent card aspect and readable overlays without fixed heights that clip text.

#### Copy

- Title: **What kind of journey has been living in your heart lately?**
- Guidance: **Choose the one that excites you most right now.**
- Options: Tropical Escape, Mountain Retreat, City Discovery, Cruise Voyage, Winter Wonderland, Wildlife Adventure.
- Descriptions must match the approved product specification exactly.

#### Validation

- Exactly one selection required.
- Continue disabled before selection.
- No automatic navigation.

#### Interactions

- Same single-select pattern as Travel Companions.
- Maintain selection on Back/Next cycles and refresh.

#### Animations

- Image may scale subtly on pointer hover.
- Selection treatment is quick and quiet.
- Disable decorative image motion under reduced-motion preference.

#### Accessibility

- Labelled radio group.
- Text contrast over imagery must meet WCAG AA; use a stable overlay rather than relying on the image.
- Meaning is never communicated by photography alone.

#### Edge cases

- Incorrect image semantics are a release blocker; each card image must clearly represent its label.
- Slow image networks must not block selection.
- Cards must not reflow dramatically after image load.

#### Completion rules

Complete when one journey character is selected.

### 3.5 Screen Five — Travel Style

#### Purpose

Capture one to three experience priorities and encourage meaningful focus.

#### UI components

- progress indicator
- title and limit guidance
- Selection Counter
- multi-select Journey Cards
- success message state
- Back and Continue controls

#### Layout

- Counter remains close to the question and visible while selecting.
- Cards form one labelled checkbox group.
- Selected cards remain prominent; muted cards remain readable.

#### Responsive behaviour

- Mobile: one or two columns based on minimum card width; no horizontal scrolling.
- Tablet and desktop: increase columns without reducing touch target or copy size.
- Counter wraps naturally and never competes with navigation.

#### Copy

- Title: **What kind of memories would you love to bring back?**
- Guidance: **Choose up to three. We’ll use them to keep your possibilities beautifully focused.**
- Options: Relaxation; Adventure; Food & Dining; Culture & Heritage; Photography; Nature; Wildlife; Beaches & Islands; Celebrations.
- Counter and success copy must use the approved Conversation Library.

#### Validation

- Minimum one selection.
- Maximum three selections.
- Continue disabled at zero.
- Attempting a fourth must not mutate state and must not display a hard error.

#### Interactions

- First selection shows “1 of 3 — a lovely start.”
- Second shows “2 of 3 — your journey is taking shape.”
- Third changes the counter to the success state.
- At three, unselected cards become muted and non-selectable.
- Selected cards remain selectable for removal.
- Removing one restores all remaining cards.
- Selection does not auto-advance.

#### Animations

- Counter text transitions without layout jump.
- Muting uses a short opacity/elevation transition.
- Success state may include a restrained icon or check; no confetti.

#### Accessibility

- Cards use checkbox semantics.
- Counter status is announced politely after selection.
- Muted cards expose their unavailable state but remain readable.
- Do not remove muted cards from the accessibility tree.
- Success message is not announced repeatedly during unrelated focus movement.

#### Edge cases

- Rapid multi-touch must never create four selections.
- Session state containing more than three values is sanitised to the first three recognised values and logged only in development without personal data.
- Removed or renamed option values from an older draft are ignored safely.

#### Completion rules

Complete with one, two or three recognised styles.

### 3.6 Screen Six — Perfect Timing

#### Purpose

Capture timing precision without forcing exact dates.

#### UI components

- progress indicator
- title and reassurance
- single-select timing options
- conditional Calendar Picker/date-range controls
- conversational date guidance
- Back and Continue controls

#### Layout

- Timing choices appear first.
- Calendar appears directly beneath the Exact Dates choice region.
- Navigation remains after all revealed controls in reading order.

#### Responsive behaviour

- Mobile calendar controls stack vertically.
- Tablet and desktop may use paired departure/return fields.
- Native date interfaces may be used where they provide better device accessibility.
- Landscape layouts scroll instead of compressing calendar controls.

#### Copy

- Title: **When would you love this journey to begin?**
- Reassurance: **An exact date is wonderful. A general idea is enough too.**
- Timing choices: **Within the Next Month**, **In the Next 2–3 Months**, **Later This Year**, **I’m Flexible**, **Exact Dates**.
- Exact-date reveal: **Wonderful. Share the dates you already have in mind.**
- Flexible acknowledgement and range guidance follow the approved specification.

#### Validation

- One timing mode required.
- Exact Dates requires departure and return.
- Return must be the same as or after departure only if same-day journeys are allowed by Product; default v1.0 requires return after departure.
- Dates must be valid calendar values.
- Past departure dates are invalid.
- Broad or Flexible modes do not require dates.

#### Interactions

- Calendar appears only when Exact Dates is selected.
- Switching away hides it and makes dates inactive.
- Previously entered dates may remain in temporary state for easy reversal but must not enter completion payload unless Exact Dates remains selected.
- Changing departure updates the minimum permitted return date.

#### Animations

- Calendar reveal uses a short height/opacity transition without trapping focus.
- Reduced-motion uses immediate reveal.

#### Accessibility

- Timing choices form a labelled radio group.
- Date fields have visible labels and accessible format guidance.
- Reveal is announced when Exact Dates is selected.
- Validation is associated with the relevant date field.

#### Edge cases

- Locale date display differs from stored representation; user-facing dates must remain unambiguous.
- Daylight-saving changes must not shift calendar dates.
- Switching modes repeatedly must not corrupt the range.

#### Completion rules

Complete when a broad/flexible mode is selected, or when Exact Dates has a valid range.

### 3.7 Screen Seven — Destination

#### Purpose

Ask the final discovery question: whether the traveller has a destination in mind or wants Search My Vacation to inspire them.

#### UI components

- progress indicator
- title and supporting copy
- two destination-mode choices
- conditional Destination Search/text input
- carried-forward destination confirmation when applicable
- Back and Continue controls

#### Layout

- Known and discovery paths receive equal visual status.
- Conditional search/input appears beneath the known-destination choice.
- The open-discovery choice must not look secondary.

#### Responsive behaviour

- Mobile choices stack.
- Destination suggestions, if enabled from local approved data, fit within the viewport and do not create horizontal overflow.
- Keyboard appearance must not obscure suggestions or Continue.

#### Copy

- Title: **Is there somewhere already calling you?**
- Supporting copy: **Tell us what you have in mind, or invite us to help you discover somewhere special.**
- Known choice: **I already have somewhere in mind.**
- Discovery choice: **Help me discover somewhere special.**
- Carried-forward confirmation and widening copy follow the product specification.

#### Validation

- Destination mode required.
- Discovery mode requires no destination text.
- Known mode requires 2–100 meaningful characters after trimming.
- Accept informal phrases such as “somewhere warm in Europe.”
- Do not require a match to a fixed destination database.

#### Interactions

- Known mode reveals input or local search.
- Discovery mode hides input and clears its active validation, while raw text may remain temporarily for reversal.
- Homepage destination context is shown as a confirmation, not silently locked.
- Traveller can keep, edit or widen the earlier choice.

#### Animations

- Conditional input uses the same reveal pattern as the calendar.
- Suggestion list, if present, uses a restrained fade and no artificial loading delay.

#### Accessibility

- Mode choices use radio semantics.
- Search suggestions, if implemented, follow the combobox/listbox pattern completely; otherwise use a plain text input rather than an incomplete custom combobox.
- Status text explains retained homepage context.

#### Edge cases

- No network dependency is allowed for destination search in this card.
- Unknown place names remain valid traveller wording.
- Input containing only punctuation is invalid.
- Discovery mode must be equally completable without a destination.

#### Completion rules

Complete when Discovery mode is selected, or Known mode has meaningful destination text.

### 3.8 Screen Eight — Discover My Possibilities

#### Purpose

Reflect the traveller’s discovery choices, allow correction and complete the Passport through one approved action.

#### UI components

- progress indicator in final active state
- completion heading and subtitle
- concise conversational summary
- edit/back affordance
- final Primary Button
- non-blocking local completion status
- Completion Footer/exit handling

#### Layout

- Summary emphasises understanding, not raw field labels.
- One dominant final CTA.
- Avoid promotional destinations, secondary recommendations or unrelated links.

#### Responsive behaviour

- Summary cards or lines stack on mobile.
- Final CTA is easy to reach and tap.
- Desktop retains a controlled reading width rather than a dashboard layout.

#### Copy

- Title: **Wonderful. We have everything we need to begin crafting your journey.**
- Subtitle: **We’ll bring together possibilities shaped around what matters most to you.**
- Journey Director context may read: **Your Journey Director will begin with the choices that matter most to you.** This is contextual copy only; do not claim a Journey Director has received data.
- Final CTA must read exactly: **✨ Discover My Possibilities**

#### Validation

- Revalidate all required state before enabling completion.
- If a prior answer becomes invalid, route focus to the first affected moment with conversational guidance.
- Prevent duplicate activation while local completion is in progress.

#### Interactions

- Back returns to Destination with all state intact.
- Summary provides a clear route to edit previous moments, using Back or chapter navigation only if approved.
- Final activation creates the local completion payload and invokes the configured exit.
- No recommendation view follows in this card.

#### Animations

- Summary may enter with a restrained stagger.
- Final button provides pressed/loading feedback only for actual local completion work.
- Do not create fake multi-second loading.
- Exit transition is brief and reduced-motion safe.

#### Accessibility

- Summary uses semantic lists or sections.
- The final action has an unambiguous accessible name including the visible sparkle character only if it does not impair pronunciation.
- Completion status is announced once.
- Focus moves to the host exit confirmation or destination after completion.

#### Edge cases

- Completion handler failure: preserve draft, re-enable action and say, “We couldn’t complete that just now. Your choices are still here.” Do not claim submission.
- Double click/tap: produce one completion event.
- Missing homepage context does not affect completion.

#### Completion rules

Complete when every required moment is valid and the configured local completion/exit handler resolves successfully.

---

## 4. Component Inventory

| Component | Responsibility | Key reuse/behaviour |
| --- | --- | --- |
| `JourneyPassportContainer` | Own the overall experience boundary | Connect configuration, state, persistence, focus and exit |
| `JourneyPassportShell` | Shared visual frame | Responsive width, surface, background and content region |
| `JourneyChapterHeader` | Render eyebrow, title and description | Consistent hierarchy across moments |
| `ProgressIndicator` / `ProgressStepper` | Communicate chapter progress | Hidden on Welcome; current/completed/future states |
| `JourneyNavigation` | Shared Back/Continue placement | Disabled rules, labels and mobile-safe positioning |
| `PrimaryButton` | Primary moment action | Loading, disabled, focus and touch states |
| `SecondaryButton` | Non-primary safe action | Resume/start-again or contextual alternative |
| `BackButton` | Return one moment | Preserves state; accessible label |
| `JourneyCard` | Visual selection surface | Image/text variants; selection state |
| `JourneyOption` | Semantic radio/checkbox wrapper | Single and multi-select behaviour |
| `SelectionCounter` | Travel Style guidance and success | 0–3 states, polite announcement |
| `TextInput` | Name and plain destination entry | Label, hint, error association and character boundary |
| `DestinationSearch` | Optional local suggestion enhancement | Must fall back to text input; no network dependency |
| `CalendarPicker` | Exact Dates range | Conditional reveal and accessible date validation |
| `SuccessMessage` | Human completion feedback | No hard-error styling; status semantics |
| `AnimatedTransition` | Chapter/reveal transitions | Direction-aware and reduced-motion safe |
| `JourneySummary` | Conversational final review | Derives readable phrases from explicit answers |
| `CompletionFooter` | Final action and honest next-step context | No recommendations or false submission |
| `ResumeDraftPrompt` | Explicit temporary-session resume | Appears only for valid draft |
| `LiveRegion` | Announce counter/reveal/completion updates | Polite, concise, non-duplicative |

Components may be combined when doing so improves simplicity, but common interaction logic must not be duplicated across eight screen files. Visual specialisation is allowed; navigation, selection semantics, validation and persistence remain shared.

---

## 5. State Model

### 5.1 Canonical Journey Passport state

The Passport has one typed source of truth. Screen-local state may hold ephemeral presentation details, but no traveller answer may be duplicated in a second canonical location.

| State | Type/shape | Default | Notes |
| --- | --- | --- | --- |
| Schema version | version identifier | current v1 key | Supports safe temporary-draft migration/discard |
| Current moment | approved moment identifier | Welcome | Never rely only on numeric indexes |
| Traveller name | string | empty | Canonical preferred name |
| Homepage context | typed optional object | absent | Feeling/invitation/destination plus source |
| Companion | approved option or empty | empty | Single value |
| Journey invitation / dream journey | approved option or empty | empty | Single value; one canonical field for the Dream Journey answer |
| Travel styles | ordered unique array | empty | One to three recognised values |
| Timing mode | approved option or empty | empty | Includes Flexible and Exact Dates |
| Departure date | date-only value or empty | empty | Active only in Exact Dates mode |
| Return date | date-only value or empty | empty | Active only in Exact Dates mode |
| Destination mode | known/discovery/empty | empty | Required final question state |
| Destination text | string | empty | Required only for known mode |
| Validation | derived map | derived | Do not persist transient error visibility |
| Completion | idle/completing/complete/failed | idle | Guards duplicate completion |
| Navigation direction | forward/backward/none | none | Presentation only |
| Visited moments | set/list of IDs | Welcome | Used for progress, not validity |
| Temporary session metadata | timestamps and source | generated | No cross-device identity |

### 5.2 Derived state

Derive rather than duplicate:

- current moment validity;
- overall completion readiness;
- Travel Style counter copy;
- muted-card state;
- active date range;
- human-readable summary;
- completed progress moments;
- whether Destination input is required;
- whether a resume prompt is eligible.

### 5.3 Temporary session persistence

- Use session-scoped browser storage, not permanent account storage.
- Store a versioned, minimal draft after meaningful answer or navigation changes.
- Do not store derived validation messages or UI animation state.
- Validate and sanitise restored data against recognised values and limits.
- Expire stale drafts according to a documented short-lived policy; recommended maximum is 24 hours, while recognising that browser session storage may end earlier.
- Clear the draft after confirmed local completion or explicit Start Again.
- If storage is unavailable, continue in memory without blocking the experience.
- Never log traveller answers or destination text to the console.

### 5.4 State updates

- Use dedicated update actions for nested or constrained values.
- The Travel Style update must enforce uniqueness and the three-item maximum atomically.
- Timing-mode changes control whether date values are active.
- Destination-mode changes control whether destination text is required.
- State transitions must be deterministic and testable independently from screen rendering.

---

## 6. Navigation Rules

### 6.1 Next/Continue

- Present on every question moment and Discover screen.
- Disabled until current completion rules pass.
- Does not respond to selection alone.
- On activation, validate, mark the moment visited, persist draft, update direction and move focus to the next moment heading.
- Button labels use approved copy; default intermediate label is **Continue**.

### 6.2 Previous/Back

- Hidden on Welcome.
- Returns exactly one moment in the approved sequence.
- Never clears answers.
- Updates animation direction and focus.
- Back from About You returns to Welcome without discarding the draft.

### 6.3 Skip behaviour

No required discovery moment is skippable. There is no generic Skip action in v1.0. Conditional controls, such as dates in Flexible mode or destination text in Discovery mode, are not skipped fields; they are intentionally irrelevant to that path.

### 6.4 Disabled states

- Disabled controls remain readable and retain sufficient contrast.
- A disabled Continue should be accompanied by visible guidance in the moment, not a tooltip.
- Muted Travel Style cards remain legible and identify that three choices are already selected.

### 6.5 Keyboard navigation

- Tab order follows visual and reading order.
- Enter activates focused buttons.
- Space activates radio/checkbox card controls as appropriate.
- Radio groups follow standard arrow-key behaviour when implemented as roving radio controls.
- Escape does not discard the Passport. If an exit dialogue is open, Escape closes only that dialogue.

### 6.6 Browser refresh

- Refresh restores a valid temporary draft and current moment.
- Welcome provides explicit resume/start-over choice when restoration occurs at a new entry.
- In-session refresh during active completion returns safely to Discover unless completion was already confirmed.
- Invalid versioned data is ignored without exposing a technical error.

### 6.7 Browser Back button

Use one documented behaviour consistently:

- Within the Passport, browser Back should move to the previous Journey moment when history entries exist.
- At Welcome, browser Back exits to the originating page.
- State remains in temporary session storage.
- Browser Forward restores the next moment only when its state remains valid.
- Prevent history loops caused by pushing duplicate entries for the same moment.

### 6.8 Exit confirmation

- Do not interrupt ordinary browser navigation before any meaningful answer exists.
- After at least one traveller answer, explicit Exit may show a lightweight confirmation: continue Passport or leave with the temporary draft available.
- Do not use a native before-unload warning for routine navigation unless unsaved state cannot be retained.
- Copy must not imply a permanent Saved Passport or account.

---

## 7. Validation Rules

### 7.1 Validation philosophy

Validation prevents incoherent state while preserving conversation. It should be proactive, local and calm. Use no global error summary unless accessibility testing proves it necessary for final completion recovery.

### 7.2 Field and moment rules

| Moment | Rule | Human response |
| --- | --- | --- |
| Welcome | Always valid | None |
| About You | Trimmed name, 2–80 visible characters | “Please share the name you’d like us to use.” |
| Companions | One recognised option | Guidance remains visible; Continue disabled |
| Dream Journey | One recognised option | Guidance remains visible; Continue disabled |
| Travel Style | 1–3 unique recognised values | Counter guides; no fourth-selection error |
| Timing | One recognised mode | Continue disabled until selected |
| Exact Dates | Valid future departure and return after departure | “Your return should come after your departure.” |
| Destination | Known or Discovery selected | Continue disabled until selected |
| Known destination | 2–100 meaningful characters after trim | “Tell us the place—or even the kind of place—you have in mind.” |
| Discovery destination | Destination text not required | Valid through mode selection |
| Completion | Every required moment valid | Route to first invalid moment with context |

### 7.3 Character handling

- Trim leading and trailing whitespace at validation/completion boundaries.
- Preserve meaningful interior spacing.
- Collapse line breaks in single-line values.
- Prevent only inputs that are meaningless or unsafe for the current field; do not impose English-only patterns.
- Display character limits before the limit becomes surprising when a field approaches its maximum.

### 7.4 Invalid-state behaviour

- Do not erase invalid input.
- Do not show alarming red panels for ordinary incompleteness.
- Use semantic error colour only where a direct correction is required, accompanied by text.
- Focus the relevant field only after the traveller attempts an invalid action; do not steal focus during typing.
- On restored invalid session data, sanitise quietly and return to the earliest incomplete moment.

---

## 8. Adaptive Behaviour

### 8.1 Homepage invitation or feeling

- Carry forward approved homepage context.
- Acknowledge it once in relevant language.
- Preselection is allowed only where mapping is explicit and editable.
- Never lock a homepage answer.

### 8.2 Homepage destination

- Preserve the raw destination wording and source.
- At the final Destination moment, display contextual confirmation.
- Allow Keep, Edit or Open to other possibilities.
- Do not skip Destination silently.

### 8.3 Destination search

- Known mode may use a local, approved destination list to offer suggestions.
- Free text remains valid and is preserved.
- Do not introduce a network search dependency.
- If a complete accessible combobox cannot be implemented, use a labelled text input.

### 8.4 Discovery mode

- Selecting **Help me discover somewhere special** satisfies Destination without text.
- Discovery mode receives equal visual priority.
- Completion payload records the mode clearly and does not invent a destination.

### 8.5 Travel Style limit

- Atomically enforce maximum three.
- Update 0/1/2/success counter state.
- Mute remaining cards at three.
- Preserve selected-card interactivity for deselection.
- Restore cards when count falls below three.

### 8.6 Calendar reveal

- Reveal only for Exact Dates.
- Make dates inactive for other timing modes.
- Retain temporary values for reversal without including them in completion.

### 8.7 Progress updates

- Welcome hides progress.
- About You begins visible progress.
- Current moment is clearly identified.
- Completed means visited and valid, not merely visited.
- Future moments remain visible or represented but subdued.
- Use journey/chapter language, never “form step.”

### 8.8 No new adaptations

Do not add adaptive questions, AI follow-up, dynamic option replacement or inferred preference scoring in this card.

---

## 9. Motion Design

### 9.1 Motion principles

Motion must clarify change, reinforce selection and preserve continuity. It must not turn the Passport into a presentation that the traveller must wait through. Use the minimum motion required to communicate hierarchy and progression.

### 9.2 Chapter transitions

- Forward: current content fades/slides a short distance out; next content enters from the forward direction.
- Backward: reverse the directional cue.
- Duration target: approximately 220–320 ms for the full transition.
- Easing: calm deceleration; avoid elastic, bounce or playful spring behaviour.
- Do not animate the entire page over large distances.
- Lock repeated navigation only for the minimum interval required to prevent duplicate transitions.

### 9.3 Fade and reveal

- Conditional calendar and destination input: 160–240 ms opacity plus small vertical/height reveal.
- Validation guidance: short opacity transition.
- Summary items: optional subtle stagger, no more than 40–60 ms between items and no prolonged sequence.
- Missing or delayed imagery must not delay text or controls.

### 9.4 Button feedback

- Hover: restrained colour/elevation adjustment for fine pointers.
- Press: immediate small scale or elevation response.
- Focus: visible focus ring, never an animated glow that reduces clarity.
- Disabled: no hover movement.
- Completing: replace or accompany the label with a concise progress state without changing button width dramatically.

### 9.5 Card hover and selection

- Hover is enhancement only; core state must work without it.
- Optional image scale should remain subtle and contained.
- Selection uses a short border/elevation/check transition.
- Multi-select muting occurs as a coordinated state change, not nine independent theatrical animations.

### 9.6 Progress transitions

- Current and completed state changes use restrained colour, weight and indicator motion.
- Avoid travelling-airplane animations, looping paths or movement that competes with the question.
- Progress updates only after a successful navigation transition.

### 9.7 Loading behaviour

- No artificial loading between local moments.
- Image placeholders may use static colour or a non-distracting shimmer only if the existing design system already supports it.
- Final completion shows loading only while real local completion work is unresolved.
- Never simulate recommendation generation.

### 9.8 Micro-animations

Allowed examples:

- selection check appearing;
- counter changing to success;
- calendar/input reveal;
- progress completion indicator;
- button pressed state.

Deferred examples:

- passport stamping;
- elaborate page turns;
- adaptive illustrations;
- sound;
- confetti;
- destination preview choreography.

### 9.9 Reduced motion

When reduced motion is requested:

- remove directional slide and scale effects;
- use immediate state replacement or a brief opacity change;
- prevent image zoom;
- preserve focus movement and status announcements;
- do not make the traveller wait for a transition duration that no longer has a visual purpose.

---

## 10. Accessibility

### 10.1 Standard

Target WCAG 2.2 AA for all Journey Passport moments. Accessibility is a release requirement, not deferred polish.

### 10.2 Keyboard navigation

- Every interactive element is reachable without a pointer.
- Focus order follows the visible reading order.
- All card groups support their expected radio or checkbox keyboard pattern.
- Continue, Back, resume, exit and final actions operate from the keyboard.
- No keyboard trap in calendar, destination suggestions, exit confirmation or transition container.
- Focus is never placed on disabled elements.

### 10.3 Screen readers

- One primary heading per moment.
- Progress exposes current position, completed state and total question moments in accessible language while avoiding “form step” in visible copy.
- Card groups have programmatic names from their question.
- Selected, checked, unavailable and invalid states are communicated programmatically.
- Conditional reveals are announced once.
- Counter and completion updates use a polite live region.
- Decorative image treatments, gradients and icons are hidden from assistive technology.

### 10.4 Focus management

- On moment change, move focus to the new moment heading or a dedicated focus target preceding it.
- On invalid attempted progression, move focus to the first actionable invalid control.
- After closing an exit confirmation, return focus to the control that opened it.
- After final completion, move focus to the exit confirmation/destination heading.
- Do not move focus simply because a card was selected.

### 10.5 ARIA and semantics

- Prefer native `button`, `input`, `fieldset`, `legend`, radio and checkbox semantics.
- Use ARIA only to complete a pattern, not to repair arbitrary non-semantic containers.
- Progress may use an ordered list with `aria-current="step"` or an equivalent appropriate pattern.
- Errors use `aria-describedby` and, when appropriate, `aria-invalid`.
- If Destination Search is a combobox, implement the full authoring pattern; otherwise do not claim combobox semantics.

### 10.6 Contrast and non-colour cues

- All text and controls meet approved AA contrast against actual rendered surfaces and imagery.
- Use overlays behind text on photography.
- Selection includes a check, border, label or semantic state in addition to colour.
- Muted cards remain legible.
- Focus indication remains visible against every card/image variation.

### 10.7 Touch targets

- Primary controls and card selection targets must be at least 44 × 44 CSS pixels.
- Maintain spacing that prevents accidental adjacent activation.
- Do not place tiny checkboxes inside larger clickable cards as the only touch target.

### 10.8 Zoom, text resize and orientation

- Flow remains usable at 200% zoom.
- Text resizing does not clip titles, counter, navigation or final CTA.
- Portrait and landscape are supported without orientation lock.
- Content scrolls vertically instead of being hidden behind fixed controls.

### 10.9 Accessibility validation

Perform:

- full keyboard walkthrough;
- screen-reader smoke test on at least one desktop and one mobile platform where available;
- automated accessibility scan;
- contrast verification on image and selected/muted states;
- reduced-motion walkthrough;
- 200% zoom review;
- touch target review.

Document unavailable testing environments honestly.

---

## 11. Responsive Design

### 11.1 Mobile-first rule

Begin with narrow-screen structure and progressively enhance. Do not create a desktop canvas and compress it. CSS breakpoints and fluid sizing should handle layout; JavaScript viewport detection is not permitted for presentation.

### 11.2 Mobile

Validate at minimum 320, 375, 390 and 430 CSS pixels.

- One clear content column.
- No horizontal page scrolling.
- Cards use one or two columns only when minimum readable width is maintained.
- Headings wrap naturally and remain subordinate to comprehension.
- Navigation buttons remain reachable after content; do not cover fields or cards.
- On-screen keyboard does not make completion impossible.
- Progress may use compact labels, horizontal scrolling within its own controlled region or a simplified accessible representation; it must not overflow the viewport.
- Full company/Passport identity remains readable without dominating the question.

### 11.3 Tablet

Validate representative portrait and landscape widths.

- Increase card columns only when content remains balanced.
- Keep reading widths controlled.
- Avoid a sparse desktop layout stretched across tablet.
- Calendar fields may sit side by side where comfortable.
- Progress remains visible and does not compete with the chapter title.

### 11.4 Desktop

Validate at minimum 1366×768, 1440×900, 1512×982, 1728×1117 and 1920×1080.

- Use a centred maximum-width shell.
- Card grids may expand to two or three columns according to the screen specification.
- Do not force all content into a single viewport height; vertical scrolling is acceptable.
- Keep heading line lengths controlled.
- Avoid excessive empty space on wide monitors.
- Pointer hover states must not shift surrounding layout.

### 11.5 Short and landscape viewports

- Use content-driven minimum heights, not rigid full-screen clipping.
- Allow page scrolling.
- Do not pin navigation over content unless safe-area and content padding are proven at all target heights.
- Welcome action, date fields and final CTA must remain reachable.

### 11.6 Spacing

- Use the existing spacing scale.
- Reduce outer gutters progressively on mobile, never below safe readable margins.
- Maintain larger separation between conceptual groups than within a group.
- Keep navigation separated from the last field/card.
- Avoid one-device pixel overrides unless a continuous layout rule cannot solve the defect.

### 11.7 Button sizing

- Mobile primary action may use full available content width when that improves reach and clarity.
- Desktop actions use content-driven width unless the shared design system specifies otherwise.
- Preserve at least 44px target height.
- Back and Continue remain visually distinct, with one clear primary action.

### 11.8 Typography scaling

- Use Plus Jakarta Sans and the approved hierarchy.
- Apply fluid, bounded scaling for large titles where the existing system supports it.
- Body text never requires zoom.
- Do not reduce copy below accessible sizes to make a fixed-height layout fit.

### 11.9 Safe areas

- Respect mobile browser and device safe-area insets where fixed or edge-aligned controls exist.
- Verify that final actions are not obscured by browser chrome.

---

## 12. Technical Notes

### 12.1 Recommended component hierarchy

```text
JourneyPassportContainer
├── JourneyPassportShell
│   ├── JourneyBrandHeader
│   ├── ProgressIndicator
│   ├── AnimatedTransition
│   │   └── ActiveMomentRenderer
│   │       ├── WelcomeMoment
│   │       ├── AboutYouMoment
│   │       ├── CompanionsMoment
│   │       ├── DreamJourneyMoment
│   │       ├── TravelStyleMoment
│   │       ├── TimingMoment
│   │       ├── DestinationMoment
│   │       └── DiscoverMoment
│   ├── JourneyNavigation
│   └── LiveRegion
└── ResumeDraftPrompt / ExitConfirmation
```

### 12.2 Suggested folder structure

Adapt to repository conventions rather than creating parallel architecture unnecessarily.

```text
components/
  journey-passport/
    JourneyPassportContainer.tsx
    JourneyPassportShell.tsx
    JourneyChapterHeader.tsx
    ProgressIndicator.tsx
    JourneyNavigation.tsx
    JourneyCard.tsx
    SelectionCounter.tsx
    CalendarPicker.tsx
    DestinationSearch.tsx
    JourneySummary.tsx
    AnimatedTransition.tsx
    moments/
      WelcomeMoment.tsx
      AboutYouMoment.tsx
      CompanionsMoment.tsx
      DreamJourneyMoment.tsx
      TravelStyleMoment.tsx
      TimingMoment.tsx
      DestinationMoment.tsx
      DiscoverMoment.tsx
config/
  journey-passport.config.ts
hooks/
  useJourneyPassport.ts
  useJourneyPassportSession.ts
types/
  journey-passport.types.ts
utils/
  journey-passport.validation.ts
  journey-passport.summary.ts
```

### 12.3 Configuration

Moment order, IDs, navigation labels, visible copy, option values, required status and completion rules should come from typed configuration where practical. Specialised layouts may remain separate components.

Do not turn all UI into an opaque generic renderer. Configuration supports ordering, copy consistency and future controlled extension; components preserve appropriate semantics for names, cards, dates and destination mode.

### 12.4 Props and boundaries

Moment components should receive:

- the relevant slice of canonical state;
- typed update callbacks;
- derived validity/muted/status values;
- heading focus reference or focus contract;
- no direct persistence or routing responsibility.

Shared components should not know product-wide state when a narrow prop contract is sufficient.

### 12.5 Context usage

A focused Journey Passport provider/reducer is acceptable when it prevents deep prop drilling and centralises transitions. Do not introduce a global state library solely for this feature. Keep state scoped to the Passport route/experience boundary.

### 12.6 State-management recommendation

Use a reducer or equally explicit typed state machine for:

- answer updates;
- constrained Travel Style toggles;
- moment navigation;
- restored-draft sanitisation;
- completion state;
- start-again/reset.

Validation and summary remain pure derived functions. This makes back/forward, persistence and edge cases testable without rendering the complete UI.

### 12.7 Performance

- Optimise and size responsive imagery.
- Prioritise Welcome imagery; lazy-load later card imagery where appropriate without layout shift.
- Avoid mounting every image-heavy moment visibly at once.
- Keep state updates local enough to avoid re-rendering the full shell on input keystrokes where unnecessary.
- Memoisation should follow measured need, not habit.
- Session persistence should be debounced modestly and flushed on meaningful navigation.
- Do not block interaction on storage writes.

### 12.8 Lazy loading

- Later moment media may load as the traveller approaches or enters the moment.
- Core interaction components and next moment structure should be ready without visible delay.
- Do not lazy-load small controls merely to create architectural complexity.
- Loading fallback preserves dimensions and accessible text.

### 12.9 Animation library

- Prefer CSS transitions for simple hover, selection, fade and reveal.
- Use the repository’s existing animation library only if already present and if it materially simplifies directional transitions and reduced-motion support.
- Do not add an animation dependency solely for card hover or opacity.
- Document any dependency change explicitly.

### 12.10 Routing and history

- Use an approved dedicated Journey Passport route.
- Moment state may be reflected in history without exposing traveller answers in the URL.
- Do not place name, destination or preferences in query parameters.
- Homepage entry context in a query parameter is acceptable only for non-sensitive approved enumerations; otherwise use navigation state/session context.

### 12.11 Security and privacy

- Treat all text as untrusted display input and escape appropriately.
- Do not write personal values to logs, analytics or URLs.
- Session data is temporary and local; copy must not imply durable secure storage.
- Do not collect deferred sensitive or logistical information.

### 12.12 Testing strategy

Where project tooling permits, include:

- reducer/state transition tests;
- validation boundary tests;
- Travel Style limit tests;
- restored-draft sanitisation tests;
- timing mode/date tests;
- destination mode tests;
- summary formatting tests;
- keyboard interaction tests for card groups;
- route/entry and completion tests.

Manual end-to-end testing remains required across target viewports.

---

## 13. Design Tokens

### 13.1 Token authority

Use existing application tokens aligned with `COLOR-SYSTEM.md`, `TYPOGRAPHY.md` and approved current brand implementation. The colour document defines semantic roles and intentionally does not finalise new hex values. This card therefore does not authorise a new palette.

### 13.2 Colours

Use semantic roles:

- primary brand/trust;
- accent/adventure and primary actions;
- default and secondary neutral backgrounds;
- card and elevated surfaces;
- primary, secondary, muted and inverse text;
- default/light/strong borders;
- success, warning, error and information;
- focus ring, disabled and divider.

Requirements:

- approximately calm neutral dominance with restrained accent use;
- AA contrast on actual rendered combinations;
- no colour-only state;
- semantic error colours used only for correction, not ordinary incompleteness;
- Golden Hour warmth may support imagery/surfaces but must stay within the approved site language.

### 13.3 Typography

- Primary family: **Plus Jakarta Sans**.
- Fallback: `system-ui, sans-serif` according to the typography specification.
- Use existing tokens for display, page heading, section heading, card heading, body large, body, small body, caption and label.
- Use readable weights; avoid excessively thin text.
- Maintain comfortable line length and line height.
- Do not add a decorative font for “passport” styling.

If the current approved implementation uses a restrained editorial display treatment, reuse it only where it is already part of the shared system and does not contradict the official typography decision.

### 13.4 Spacing

- Use the existing spacing scale.
- Base spacing should create clear group relationships rather than arbitrary per-screen values.
- Minimum mobile gutter follows the current site shell.
- Maintain consistent title-to-description, description-to-control, control-to-navigation and card-grid gaps across moments.

### 13.5 Border radius

- Reuse existing small, medium, large and pill radius tokens.
- Cards share one approved large radius.
- Inputs use the approved input radius.
- Buttons use the existing primary/secondary shape.
- Avoid making every nested surface rounded.

### 13.6 Elevation

- Default cards use subtle or no elevation.
- Hover and selected elevation must be restrained.
- Modal/resume confirmation uses the approved elevated surface.
- Shadows must not reduce contrast or create a generic SaaS aesthetic.

### 13.7 Icon sizing

- Inline/supporting icon: existing small token.
- Card identity icon: existing medium token.
- Selection check: visible but secondary to label.
- Icons never replace text labels for core actions.
- Use the existing icon system; do not mix emoji and unrelated icon styles unless the approved copy explicitly includes the final sparkle.

### 13.8 Animation timing

- Immediate feedback: approximately 100–160 ms.
- Selection/reveal: approximately 160–240 ms.
- Moment transition: approximately 220–320 ms.
- No routine interaction should wait longer than necessary.
- Use existing easing tokens or a restrained ease-out curve.

---

## 14. Definition of Done

Implementation is complete only when all conditions below are satisfied:

1. Homepage **Plan My Experience** enters Journey Passport reliably.
2. Welcome plus all seven subsequent moments are implemented in the approved order.
3. Destination is the final question.
4. Final CTA reads exactly **✨ Discover My Possibilities**.
5. Recommendation generation and Journey Director functionality are absent.
6. All visible microcopy matches the approved specification.
7. Central typed state has no duplicate traveller-answer sources.
8. Back, Continue, browser history and refresh preserve valid state correctly.
9. Temporary session resume/start-over behaviour is honest and reliable.
10. Travel Style enforces one to three choices with counter success and muted remaining cards.
11. Exact Dates alone reveals the calendar and validates a proper range.
12. Destination adapts to carried-forward homepage context and supports open discovery.
13. No ordinary discovery constraint produces a hard system error.
14. Mobile, tablet, desktop and short-landscape layouts are stable and usable.
15. Keyboard-only completion is possible.
16. Screen-reader semantics and focus transitions are validated.
17. WCAG AA contrast, touch targets and reduced-motion behaviour are validated.
18. No horizontal scrolling, clipped required content or navigation overlap exists at target widths.
19. No console errors or personal-data logging occurs.
20. Lint, TypeScript and production build pass, or unrelated pre-existing failures are documented separately with feature-targeted checks passing.
21. Completion produces one local payload/event and exits without false claims.
22. No out-of-scope files or features are changed unnecessarily.
23. Final delivery lists created/modified files, tests, assumptions, known limitations and deferred work.

Stop when these conditions are met. Do not continue into recommendation, Journey Director, Journey Builder or visual experimentation.

---

## 15. Acceptance Criteria

### 15.1 Entry and Welcome

- [ ] Homepage **Plan My Experience** opens Journey Passport.
- [ ] Approved homepage context is carried forward without personal data in the URL.
- [ ] Welcome title and supporting copy match the product specification.
- [ ] **Begin My Journey** is the sole dominant action.
- [ ] Progress is hidden on Welcome.
- [ ] Back is hidden on Welcome.
- [ ] A valid temporary draft offers explicit resume/start-again choices.
- [ ] Invalid draft data does not block entry.
- [ ] Welcome remains readable with imagery unavailable.

### 15.2 Progress and shared navigation

- [ ] Progress appears from About You onward.
- [ ] Progress uses Journey/Chapter language rather than form language.
- [ ] Current, completed and future states are visually and programmatically distinct.
- [ ] Completed state means valid completion, not merely visitation.
- [ ] Back returns one moment and preserves answers.
- [ ] Continue never auto-activates after card selection.
- [ ] Focus moves to the next moment heading after navigation.
- [ ] Browser Back/Forward does not create loops or discard state.

### 15.3 About You

- [ ] Title, question and reason copy match the specification.
- [ ] Preferred name is required.
- [ ] Names are trimmed at validation boundaries.
- [ ] International characters, apostrophes, hyphens and single-word names are supported.
- [ ] Name length is constrained to 2–80 visible characters.
- [ ] Continue remains disabled for blank or whitespace-only input.
- [ ] Name has one canonical state value.
- [ ] Restored/autofilled name updates canonical state.

### 15.4 Travel Companions

- [ ] Solo, Couple, Family, Friends and Business are present.
- [ ] Option descriptions match approved copy.
- [ ] Cards form an accessible single-select group.
- [ ] Exactly one option may be selected.
- [ ] Selection is visible without relying only on colour.
- [ ] Selection does not auto-advance.
- [ ] Card meaning remains available if images fail.

### 15.5 Dream Journey

- [ ] All six approved journey characters are present.
- [ ] Every image clearly represents its option.
- [ ] Approved title, guidance and descriptions are used.
- [ ] Exactly one option may be selected.
- [ ] Grid does not clip text at target widths.
- [ ] Image overlays maintain AA text contrast.
- [ ] Selection survives Back/Continue and refresh.

### 15.6 Travel Style

- [ ] All nine approved styles are present.
- [ ] At least one and no more than three may be selected.
- [ ] Counter displays approved one- and two-selection copy.
- [ ] Third selection changes the counter to the approved success state.
- [ ] Remaining cards become muted at three.
- [ ] Muted cards remain readable and programmatically unavailable.
- [ ] Selected cards can be deselected.
- [ ] Removing a selection restores remaining cards.
- [ ] Rapid interaction cannot create a fourth selection.
- [ ] No hard error appears at the limit.

### 15.7 Perfect Timing

- [ ] Title and reassurance match approved copy.
- [ ] One timing mode is required.
- [ ] Calendar is absent for non-Exact modes.
- [ ] Calendar appears only for Exact Dates.
- [ ] Departure and return are required in Exact mode.
- [ ] Past departure and invalid return ranges are prevented conversationally.
- [ ] Dates remain date-only values without timezone shifting.
- [ ] Hidden dates are inactive outside Exact mode.
- [ ] Mobile date controls remain visible above the on-screen keyboard.

### 15.8 Destination

- [ ] Destination is the final question.
- [ ] Known and Discovery choices have equal visual weight.
- [ ] **Help me discover somewhere special** appears exactly.
- [ ] Discovery mode requires no destination text.
- [ ] Known mode reveals a labelled destination input/search.
- [ ] Informal destination wording is accepted.
- [ ] Homepage destination is acknowledged and editable.
- [ ] Traveller can keep, edit or widen a carried-forward destination.
- [ ] Destination search has no network dependency.
- [ ] Any suggestion UI follows complete accessible combobox behaviour.

### 15.9 Discover My Possibilities

- [ ] Completion title and subtitle match approved copy.
- [ ] Summary reflects actual answers in conversational language.
- [ ] Summary does not invent preferences or destinations.
- [ ] Traveller can return and edit answers.
- [ ] Final CTA reads exactly **✨ Discover My Possibilities**.
- [ ] Final action is disabled until all required state is valid.
- [ ] Duplicate clicks create one completion event.
- [ ] Completion does not render recommendations.
- [ ] Completion does not claim AI or Journey Director action occurred.
- [ ] Failure preserves draft and presents honest recoverable feedback.
- [ ] Successful completion clears the temporary draft and exits.

### 15.10 Session and resilience

- [ ] Valid draft survives refresh in the same browser session.
- [ ] Draft has a schema version.
- [ ] Unsupported option values are sanitised.
- [ ] Storage failure does not block the Passport.
- [ ] Start Again clears only the Journey Passport draft.
- [ ] No traveller answer is written to logs or URLs.
- [ ] Completion state cannot become permanently stuck after recoverable failure.

### 15.11 Accessibility

- [ ] Entire flow is completable by keyboard.
- [ ] Radio and checkbox cards expose correct states.
- [ ] Conditional controls are announced.
- [ ] Focus order is logical on every moment.
- [ ] Focus moves correctly after navigation and errors.
- [ ] Contrast meets WCAG AA.
- [ ] Touch targets meet 44 × 44 CSS pixels.
- [ ] Flow works at 200% zoom.
- [ ] Reduced-motion mode removes non-essential movement.
- [ ] Automated scan has no critical Journey Passport violations.

### 15.12 Responsive and regression

- [ ] No horizontal page scrolling at 320, 375, 390 or 430px.
- [ ] Mobile content and navigation do not overlap.
- [ ] Tablet portrait and landscape are balanced.
- [ ] Desktop layouts are stable at approved validation sizes.
- [ ] Short landscape allows scrolling without clipping actions.
- [ ] Homepage Hero and unrelated sections remain unchanged except required entry wiring.
- [ ] Global navigation remains functional.
- [ ] No unrelated Journey Passport future capability appears.

### 15.13 Engineering validation

- [ ] Feature-targeted lint passes.
- [ ] TypeScript passes.
- [ ] Production build passes.
- [ ] No Journey Passport console errors occur.
- [ ] State/validation boundary tests pass where tooling exists.
- [ ] Manual start-to-exit walkthrough passes on mobile, tablet and desktop.
- [ ] Modified-file list contains no unexplained unrelated files.

---

## 16. Future Hooks

Future hooks are dormant architectural seams. They must not create visible future functionality, network calls or speculative abstractions in v1.0.

### 16.1 Journey Director

- Completion payload has a stable version and separates explicit answers from derived summary.
- A future adapter may deliver the payload to Journey Director operations.
- Current UI must not claim delivery.

### 16.2 AI

- Option IDs and raw traveller wording remain interpretable.
- Summary generation is isolated so a future reviewed AI summary can replace or augment deterministic copy.
- No AI SDK, prompt or inference call is included now.

### 16.3 Authentication

- State ownership remains scoped so a future authenticated persistence adapter can replace session storage.
- Do not introduce account IDs or sign-in gates.

### 16.4 Journey Builder

- Completion payload may become the starting context for Journey Builder after recommendations and login.
- Do not include itinerary, daily planning, drag-and-drop or pricing state in the Passport model.

### 16.5 Saved Passports

- Versioned serialisation supports a future durable storage adapter.
- Current copy says temporary draft/resume, never Saved Passport.

### 16.6 Traveller Memory

- Explicit source metadata can distinguish homepage context, direct answers and future remembered preferences.
- No cross-session memory is activated.

### 16.7 Recommendation Engine

- Completion event exposes approved discovery fields through a typed interface.
- Recommendation outputs are not represented in current state or UI.

### 16.8 Analytics

- Provide event seams for moment viewed, moment completed, Back, resume, validation recovery and final completion.
- Do not include free-text name or destination in analytics.
- Analytics activation requires separate privacy and measurement approval.

### 16.9 A/B testing

- Typed moment configuration can support future approved copy or ordering experiments.
- Destination-last, final CTA, Travel Style maximum and other locked decisions are not experimentable without Product approval.
- No experiment framework is added in this card.

---

## Required Final Delivery Report

When implementation is complete, Work Mode must report:

1. implementation summary;
2. files created;
3. files modified;
4. component and state architecture;
5. session persistence behaviour;
6. accessibility validation;
7. responsive validation by tested viewport/device;
8. lint, TypeScript, build and test results;
9. assumptions;
10. deferred items and known limitations;
11. confirmation that no recommendations, AI, Journey Director, authentication, Journey Builder or backend persistence were added;
12. safe Git commands to review and stage only EBC-002 work, without automatically committing or pushing.

---

## Stop Condition

Once the traveller can move reliably and accessibly from **Plan My Experience** through **✨ Discover My Possibilities**, temporary session behaviour is correct, completion exits honestly, and all acceptance criteria pass, stop.

Do not continue into recommendations or planning.
