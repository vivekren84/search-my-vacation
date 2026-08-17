> **Filing note (added under EBC R1.2-015, 17-Aug-2026):** This review was originally authored and filed as `EBC-R1.2-WS3-EBC-SOPHIE-Homepage-UX-Visual-Hierarchy-Review.md`. As the author (Sophie) identifies explicitly in Section 0.1 below, that "WS3" label conflicts with `docs/10-Backlog/RELEASE-1.2.md` Section 6.3's actual Workstream 3 (Destination Intelligence) — an unrelated, still-Proposed workstream. Per Sophie's own recommendation in that section, this review is filed under the tracker's next sequential EBC number, **R1.2-014**, alongside Arjun's companion Product/IA review. No content below has been altered from the original review. See `RELEASE-1.2.md` v1.7 (DEC-R1.2-013, OPEN-R1.2-007–009, Section 13 Technical Debt Register) for how this review's findings were carried into the tracker.
>
> ---

# EBC R1.2-WS3-EBC-SOPHIE — UX, Visual Hierarchy & Traveller Experience Review (Homepage)

**Persona:** Sophie — UX, UI and Frontend Experience Specialist
**Type:** UX / Visual Hierarchy Analysis (analysis only — no code, no visual implementation, no configuration changed)
**Date:** 16 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session & Repository Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access connected via device bridge for this session and used as source of truth, per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`.
- Git working-tree status: clean except the same two pre-existing, unrelated untracked items Arjun's R1.2-WS3-EBC-ARJUN review already noted (`_to_delete/`, `docs/09-Development/EBCR1.2-009-EXPERIENCES-RETIREMENT-IMPLEMENTATION.md`). Neither was touched by this review. No files were created, modified or deleted in the repository.
- Primary sources: the live repository — `web/app/page.tsx`, `web/components/sections/**` (HeroJourney, HomepageExperience, TravellerStories, TrustStrip, the preserved JourneyInvitations, the orphaned Experiences/ExperienceCard), `web/components/layout/**` (Header, PublicFooter, Container), `web/app/globals.css` (design tokens, `.layout-section`/`.layout-container` spacing system) — plus `docs/07-Design/BRAND-IDENTITY.md`, `docs/07-Design/DESIGN-PRINCIPLES.md`, `docs/07-Design/BLUEPRINTS/HOMEPAGE-BLUEPRINT.md`, `docs/04-UX/HOMEPAGE-INFORMATION-ARCHITECTURE.md`, `docs/04-UX/JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md`, `docs/04-UX/IMAGERY-GUIDELINES.md`, `docs/04-UX/ICONOGRAPHY.md`, `docs/04-UX/UI-COMPONENTS.md`, and Arjun's `claude/EBC-R1.2-WS3-ARJUN-Homepage-Product-IA-Review.md` (read for continuity, not as a substitute for independent verification).

**Methodology note:** No production URL or `vercel.json` was found in the repository, and this session's device-bridge shell does not persist a background `next dev` process across calls (each `device_bash` call is a fresh, non-persistent shell — the dev server I started was torn down the moment the call returned, before it could serve a page for a screenshot). This review is therefore built the same way Arjun's WS3 review was built: direct inspection of the live JSX/TSX, the exact Tailwind utility classes, breakpoints and CSS custom properties, and the design/brand documentation — not live rendered screenshots. Every claim below about spacing, breakpoints, colour or layout is traceable to a specific line of shipped code, cited by file. Where a judgement genuinely requires seeing pixels render (e.g. subtle colour-contrast-in-context), it is flagged as such rather than asserted.

---

## 0.1 Scope Note — the EBC's own section list does not match the live homepage

Per Project Instructions Section 35, I'm not silently resolving this. The EBC's "Scope of Review" lists, in order: *Hero → Journey Mood Cards → Featured Destinations → Experiences → Traveller Stories → Trust Strip → Travel Inspiration → Footer.* Arjun's WS3 review (filed the same day, same EBC batch) already found and documented that this list describes the **pre-Workstream-2** homepage. I independently re-confirmed this directly in `web/app/page.tsx` and `HomepageExperience.tsx`: the live homepage renders **Header → Hero + Journey Mood Cards → Featured Destinations → Trust Points → Traveller Stories → Trust Strip → Travel Inspiration → About/Promise Preview → Contact Preview → Footer** — ten sections, no "Experiences" section, with two sections the EBC's list omits entirely (Trust Points, About/Promise Preview, Contact Preview).

I have reviewed the homepage **as it is actually implemented today**, in true visitor order, per this EBC's own Acceptance Criteria ("Complete homepage UX review documented"). Where the EBC's Special Focus asks about "the Experiences section," I've answered it against the two artefacts that still exist for that concept — the preserved-but-unimported `JourneyInvitations.tsx` and the genuinely orphaned `Experiences.tsx`/`ExperienceCard.tsx` (see Section 4) — since no live homepage "Experiences" section exists to review today.

---

## 1. UX Observations by Section

### 1.1 Header (persistent)

*File: `web/components/layout/Header.tsx`*

- **First impression:** A dark espresso (`#2A211C`) sticky header with a wordmark, five-item nav, and a single amber (`#F5951C`) pill CTA. Clean, restrained, on-brand.
- **Clarity of purpose:** High — one CTA, five destinations, no competing calls to action.
- **Responsive/tablet finding (new — not in Arjun's review):** The full inline nav and the persistent "Plan My Experience" button are both gated behind Tailwind's `xl:` breakpoint (`hidden ... xl:flex` for nav, `hidden ... xl:inline-flex` for the CTA — both 1280px and up). Below 1280px — which includes **every tablet in every orientation** (iPad Mini/Air/Pro portrait at 744–1024px, iPad Pro landscape only clears it at 1366px) — visitors get the mobile hamburger pattern (`xl:hidden` menu button), and the header's persistent CTA disappears from view entirely, reachable only by opening the menu first. Design Principle 05 ("Mobile First... Keep primary actions accessible") and Arjun's own Header finding ("a standing, low-friction path to Journey Passport **at every scroll depth**") both describe a benefit that, on the evidence in the code, only actually holds from 1280px up — not from 1024px (`lg`, the conventional "tablet/small-laptop" cutoff) as the "desktop vs tablet" framing might imply. This isn't necessarily wrong — a hamburger at tablet width is a defensible, common pattern — but it means "persistent CTA at every scroll depth" is a large-desktop-only guarantee today, not a tablet one. See Section 6.
- **Recommendation: Keep the pattern**, but worth a deliberate product/UX decision (not a silent default) on whether the nav breakpoint should move to `lg` (1024px) so tablets in landscape get the inline CTA back. Improve-tier, non-blocking.

### 1.2 Hero + Journey Mood Cards

*File: `web/components/sections/HeroJourney/HeroJourney.tsx`*

- **First impression / emotional impact:** Strong. A single cinematic background image, a warm gradient overlay tuned for text legibility, one eyebrow label ("Your Journey, Your Feeling"), one serif H1 ("How do you want to feel?"), one supporting line. This is textbook "Emotion Before Information" (Design Principle 04) and matches `DECISION-004`'s approved Concept C direction (single cinematic hero image, no carousel).
- **Visual hierarchy:** Excellent single-message hierarchy — eyebrow → headline → subhead → interactive cards → CTA, nothing competes for attention before the visitor has made a choice.
- **Interaction design:** The two-stage CTA (select a mood card, then a separate "Start My Journey" button activates) is a genuinely considered choice, not an accident — it directly embodies `JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md`'s "Pull, Don't Push" and "Respect the Traveller's Pace" principles, and Sri's prior reviews (R1.2-006/012, cited in Arjun's review) independently rated it as "an unhurried nudge." I agree with that read from the composition alone: the disabled-state CTA (`bg-white/20 text-white/60`, "Select your mood to begin") is legible as a *waiting* state rather than a broken one, because its copy explains what to do next.
- **Mobile usability — the one real finding here:** The five mood cards use `flex-wrap` with `basis-full` on mobile (`HeroJourney.tsx`, card button classes) — i.e. **each of the five cards is full-width and stacks vertically** below `sm` (640px). Each card has `min-h-36` (9rem/144px) plus gap-4 spacing. On a typical mobile viewport, a visitor scrolls past the eyebrow, H1, subhead, and then five full-width ~150px+ cards (~750px+ of stacked cards alone) before reaching the CTA and, beyond that, the entire rest of the homepage. The code's own comment on the section wrapper acknowledges this directly: mobile is "already the tallest variant of this section (cards stack to one column)." This is a real, code-confirmed cost: **on mobile, nothing else on the homepage — no destination, no trust signal, no story — is visible until a visitor has scrolled past a very tall, single-purpose decision block.** This is a defensible trade-off (the mood-card decision *is* the funnel's entry point, per Arjun's review), but it is worth naming plainly as a mobile-specific UX cost rather than treating "5 cards, stacked" as free.
- **Recommendation: Keep the mechanism**, but flag mobile card height as an Improve-tier item for a future pass — e.g. a denser mobile card treatment (smaller `min-h`, or 2-per-row instead of full-width) would shorten the pre-scroll commitment without changing the underlying two-stage interaction. Not proposing a specific redesign per this EBC's constraint against implementation-ready designs.

### 1.3 Featured Destinations ("Places with possibility")

*File: `web/components/sections/HomepageExperience/HomepageExperience.tsx`*

- **Visual hierarchy:** Centred eyebrow/H2/intro heading block (`layout-section-heading`, `width: min(100%, 48rem)`, centred) followed by a 4-column (desktop) / 2-column (tablet) grid of dark (`#2A211C`) editorial cards — image top, region label + name + copy + CTA below on the dark ground. Clean, consistent, no competing elements.
- **Scannability:** Strong — image, eyebrow region label, name, one line of copy, one link, repeated 8 times identically. A visitor's eye learns the pattern on card one and reads the rest faster.
- **Transition in/out:** Direct from Hero with no intermediate section (Arjun and Sri both already validated this transition; I have no visual-composition objection to add — the dark hero overlay and the dark (`#2A211C`) destination cards share a value, which gives the transition a coherent "into darker, grounded content" feel rather than a jarring light/dark flip).
- **Recommendation: Keep.**

### 1.4 Trust Points ("A journey begins with being understood")

*File: `web/components/sections/HomepageExperience/HomepageExperience.tsx`*

- **Visual hierarchy:** An asymmetric `.8fr / 1.5fr` two-column grid — left column is eyebrow/H2/intro text, right column is a 2×2 grid of white icon-cards. This is a deliberate, different composition from the centred-heading pattern used everywhere else on the page (Destinations, Traveller Stories, Travel Inspiration) — appropriate, since this section's job (explain, not showcase) is genuinely different.
- **Two findings new to this review, not raised by Arjun (whose lens was product/duplication, not visual):**
  1. **Icon treatment is off-system.** The four "icons" in this section are raw Unicode glyph characters hardcoded as text — `◌`, `✦`, `↗`, `◎` (`HomepageExperience.tsx`, `trustPoints` array) — not SVG icons from any icon library. `docs/04-UX/ICONOGRAPHY.md` (Draft status, but the only iconography direction the project has) specifies outline icons from Lucide/Heroicons, consistent 2px stroke, rounded geometry, and explicitly says to avoid "emoji-style graphics" and mixing styles. A dotted circle, a four-point sparkle, a diagonal arrow and a target-like circle rendered as plain text glyphs read visually thin and slightly placeholder-like next to the section's otherwise premium card treatment (white card, soft shadow, generous padding) — and they sit in the one homepage section explicitly built to establish trust and differentiation. This is Improve-tier, not blocking, but it's the weakest single visual moment on the page relative to everything around it.
  2. **This is the one homepage section with zero photography.** `IMAGERY-GUIDELINES.md` treats photography as "one of the strongest trust signals for a travel brand" and recommends a 70/30 people-to-scenic balance; Design Principle 04 says to "use immersive photography" before presenting information. Trust Points sits directly between Destinations (image-led) and Traveller Stories (image-led), and is the only text-and-glyph-only section in the whole homepage flow. A text-only trust section immediately after a photography-led destinations section is a legitimate pacing *breather* (not everything needs a photo), but combined with finding (1) above, it means the homepage's single "why trust us, in our own words" moment is also its visually plainest — the opposite of where a premium brand would want its plainest moment to land.
- **Recommendation: Improve (non-blocking).** Replace the four Unicode glyphs with a proper outline icon set consistent with `ICONOGRAPHY.md` — smallest, cheapest fix on this list, and the icons are already isolated in a single `trustPoints` data array (`HomepageExperience.tsx`), so the change is contained. Whether to add photography is a bigger question I'm not recommending unilaterally (would need Arjun/Vivek input on whether qualitative trust claims work better with or without imagery) — flagged as an open question in Section 9.

### 1.5 Traveller Stories

*File: `web/components/sections/TravellerStories/TravellerStories.tsx`*

- **Visual hierarchy:** Same centred-heading pattern as Destinations, 3-card grid (image top, editorial content below, on white rather than dark), consistent card shadow/radius language (`rounded-[1.75rem]`, `border-[#e4d2b5]`) that reads as a deliberate lighter sibling of the Destinations card rather than an unrelated pattern.
- **Trust-building effectiveness:** Strong — real named travellers, dated, destination-tagged, quote-led, with an explicit "these are not reviews" framing line that itself builds credibility by disclaiming spin.
- **Recommendation: Keep.**

### 1.6 Trust Strip

*File: `web/components/sections/TrustStrip/TrustStrip.tsx`*

- **Visual hierarchy:** A single unified card (rounded, bordered, divided into 4 columns with thin dividers rather than 4 separate cards) — the component's own code comments are explicit that this "one connected strip" treatment (vs. separate promotional cards) was a deliberate visual-benchmark decision from a prior review pass. It reads that way in the markup: one `border`/`shadow` container, `divide-x`/`divide-y` internally.
- **Compactness:** Uses `py-8 sm:py-12` rather than the shared `.layout-section` token (`padding-block: clamp(4rem, 8vw, 7rem)` — see `globals.css`) that every other content section uses. This is intentional and visually correct — it's the one section on the page explicitly designed to be a quick, low-commitment strip rather than a full narrative beat, and its restraint (only 1 of 4 items is a link) reinforces that.
- **On the Trust Points ↔ Trust Strip pacing question Arjun's review specifically handed to Sophie** ("worth Sophie/Tiger being aware the page asks 'trust us' twice by name... for Sophie's awareness during any future homepage visual-hierarchy pass" — this pass): from a pure visual-composition standpoint, **the two sections do not visually blur together**, even though they're thematically adjacent. Trust Points is an asymmetric two-column layout with white icon-cards on the page's base cream background; Trust Strip is a single horizontal divided strip in its own bordered white card, visually closer in shape to a stat bar than to a card grid; and Traveller Stories (a third, differently-shaped 3-card grid) sits physically between them. A visitor scrolling through sees three distinctly different shapes, not three repeats of one shape. So the *content* repetition Arjun flagged (two "trust" beats) is real, but it is not compounded by a *visual* repetition — the page's shape-language keeps them from reading as duplicated sections at a glance. I'd class this as a genuinely low-severity finding on the UX/visual side specifically (independent of, and slightly more reassuring than, Arjun's content-level framing).
- **Recommendation: Keep.** No visual-hierarchy change recommended for this pairing.

### 1.7 Travel Inspiration

*File: `web/components/sections/HomepageExperience/HomepageExperience.tsx`, wrapped in `InspirationSurface` (`web/components/discovery/InspirationSurface.tsx`)*

- **This is the homepage's one deliberately differentiated background treatment**, and it's a genuine strength worth calling out explicitly. Every other content section sits on a flat `#FFFDFC` (cream) or white background; Travel Inspiration alone uses the `.golden-inspiration-surface` class (`globals.css`) — two soft radial gradients (a gold one top-left, a champagne one bottom-right) plus a very faint horizontal-line texture masked to fade out by 70% of the section's height. It is subtle enough that it will not read as "different" consciously, but it gives this specific section a faint warmth and depth the surrounding flat-cream sections don't have — a small, well-executed "Moment of Delight" in the sense `HOMEPAGE-BLUEPRINT.md` describes ("elegant... transitions... their purpose is to create emotional engagement"), and it lands at a sensible point in the page (right after two consecutive trust beats, before the closing "who we are" section) — a visual breather that matches the content's own tonal shift.
- **Card pattern:** Same large-format editorial card treatment as Destinations/Traveller Stories in spirit (image, gradient-overlay text) but scaled up (`min-h-[27rem]`) and reduced to 3 items — appropriately differentiated as "the biggest, most magazine-like cards on the page" for what is meant to be the most purely inspirational, least transactional section.
- **Recommendation: Keep.**

### 1.8 About/Promise Preview ("Our promise to you")

*File: `web/components/sections/HomepageExperience/HomepageExperience.tsx`*

- **Visual hierarchy:** A single full-bleed rounded card with a soft champagne-to-cream gradient background (`linear-gradient(125deg,#f6e2bd,#FFFDFC_55%,#ead6b1)`) and a photo on one side — the first and only warm-gradient *card* (as opposed to section background) on the page, which gives the closing third of the homepage a visually distinct "arrival" feeling.
- **Pairing with the next section:** This card and the Contact Preview card directly below it are visually differentiated from each other (gradient card here, plain white shadowed card next) rather than repeating the same treatment twice in a row — good rhythm, avoids the two closing sections reading as one over-long block.
- **Recommendation: Keep.**

### 1.9 Contact Preview ("When you are ready, we are here")

*File: `web/components/sections/HomepageExperience/HomepageExperience.tsx`*

- **Visual hierarchy:** Two-column white card — CTA/heading left, three direct contact channels (WhatsApp/Phone/Email) right in a semantic `<address>`/`<dl>`. Compositionally this successfully signals "multiple low-friction ways to reach a real person" at exactly the point in the page a visitor is deciding whether to act — a warm, non-pushy closing moment that matches `JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md`'s "invite, never sell" register even outside the (retired) Experiences section it was originally written for.
- **CTA routing:** Arjun's review already flagged, and correctly scoped to Product (not UX), that the section's single button routes to `/journey-passport` rather than `/contact`. I have nothing to add on the routing decision itself — that's a business/product call for Vivek — but from a pure visual-composition standpoint the section's *heading* ("When you are ready, we are here") and its *contact-channel column* both read as "talk to someone," while its one button reads as "start a self-serve flow." That's a mild internal tension in what the section is visually inviting a visitor to expect, worth Product being aware of when Arjun's routing question (Section 3.9 / Recommendation 1 of the Arjun review) is resolved — if the CTA stays Journey-Passport-only, a small amount of heading/CTA-label alignment (not a routing change) could remove the tension.
- **Recommendation: Keep**, pending Vivek's decision on Arjun's CTA-routing question.

### 1.10 Footer (persistent)

*File: `web/components/layout/PublicFooter.tsx`*

- **Visual hierarchy:** Standard 4-group dark footer, consistent with Header's dark espresso ground — a good bookend (dark header, dark footer, warm-cream body) that gives the page a clear "frame."
- **Recommendation: Keep.**

---

## 2. Visual Hierarchy Assessment

**Strength — a real, working card idiom, even without a literal shared component.** Destinations, Traveller Stories and Travel Inspiration all use functionally the same recipe (rounded corners, image top or full-bleed, eyebrow/heading/copy, one link, consistent shadow language) — a visitor's eye learns to parse a "content card" once and reuses that learning for the rest of the page. `docs/04-UX/UI-COMPONENTS.md` describes an intended `SectionHeader`/`JourneyCard` component pair for exactly this purpose, still listed as "Draft," owned jointly by Archie and Sophie — worth noting that **the pattern this document anticipated has, in practice, already been achieved visually**, just not yet extracted into one literal shared component. That extraction is Rad/Archie's domain, not something I'm recommending here as a UX change, but it's relevant context: the visual consistency that exists today is currently held together by developers copying near-identical Tailwind class strings correctly across `HomepageExperience.tsx`, `TravellerStories.tsx` and `JourneyInvitations.tsx` rather than by one canonical source. Low risk today; a real drift risk the longer it goes un-extracted.

**Strength — typography carries the whole page.** Every section heading uses the same serif display treatment (`font-serif`, tight negative tracking around `-0.045em`, large leading) against sans body copy. This is a strong, consistent "premium editorial" signal end to end, and notably it's the same visual register `JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md` originally specified for the (now-retired) Experiences section alone — in practice it has become the whole homepage's voice, which is a genuine improvement over what that document anticipated (a consistent voice site-wide beats a distinctive voice in one section).

**Finding — the codebase defines a broader colour system that the shipped UI does not use.** `globals.css` defines nine named colour custom properties under "Brand Colors" — `--color-primary` (`#280336`, a deep aubergine/purple), `--color-primary-hover`, `--color-accent` (`#F36523`, a red-orange), `--color-fuchsia`, `--color-crimson`, `--color-aubergine`, `--color-amber` (`#F5951C`), `--color-orange`, `--color-espresso` (`#2A211C`), `--color-cream` (`#FFFDFC`). I checked usage directly: **zero** components reference any Tailwind theme-colour utility built on these tokens (`bg-primary`, `text-accent`, etc. — grep across `web/components` and `web/app` returns no matches). Instead, every component hardcodes literal hex values directly as Tailwind arbitrary-value classes — I counted **193 distinct hex strings** across `.tsx` files in `components/` and `app/`, with `#2A211C` (espresso) and `#F5951C` (amber) each appearing well over 50 times individually. In practice, only two of the nine defined brand colours (espresso and amber, plus cream as a background) are what the homepage — and, by the same pattern, the rest of the site — actually uses; the purple/red-orange/fuchsia/crimson palette defined in the tokens never appears anywhere I found. This is more an Archie/Rad-tier design-token/engineering-hygiene finding than a pure UX one — I'm not proposing a fix, since introducing token usage is an implementation change outside this EBC's constraints — but it's worth flagging clearly: (a) visual consistency across ~193 hardcoded hex occurrences is currently held together entirely by developer discipline, not a single enforced source of truth, and (b) `docs/04-UX/COLOR-SYSTEM.md` and `docs/04-UX/DESIGN-TOKENS.md` describe philosophy and token *names* without committing to final hex values ("exact colour palette... will be finalised during the visual design phase," per `COLOR-SYSTEM.md`'s own closing section), so there is no direct doc-vs-code conflict the way Arjun found for the IA documents — but a future reader of `globals.css` alone, without checking actual component usage, would reasonably but wrongly conclude SMV's palette includes purple and red-orange. Recommend Archie/Rad be made aware for a future design-token consolidation pass; not blocking, not a UX defect in what ships today.

**Finding — the visually plainest homepage moment is also its most trust-critical one.** Covered in Section 1.4: Trust Points is the one section with neither photography nor a proper icon set. Not severe on its own, but worth weighing against the section's outsized importance (it's the homepage's only section stating the company's differentiators in its own words).

---

## 3. Cognitive Load Analysis

The live, ten-section homepage asks a visitor to make exactly **one real decision** before the closing CTA — which mood card to select in the Hero. Every section after that is read-only (browse destinations, read stated trust points, read stories, see stats, browse inspiration, read the promise, then act). This is a low-cognitive-load structure by design, and it matches `DESIGN-PRINCIPLES.md` Principle 11 ("Every Page Has One Primary Purpose... One clear visitor goal") better than the EBC's own pre-WS2 scope list would have, since that list still included the "Experiences" invitations block as a **second** decision point directly after the Mood Cards.

I independently re-derived the same conclusion Arjun reached from the product side, but from pure visual composition: the preserved `JourneyInvitations.tsx` (see Section 4) is, compositionally, a set of three large photographic tiles asking "which moment matters to you?" — a differently-styled but functionally identical decision to the Hero's "which mood?" question the visitor answered one scroll earlier. Two different visual treatments of the same underlying choice, back to back, is a textbook cognitive-load cost even before considering the literal duplicate card title ("Memory Makers") Arjun's review documented. From the UX/visual-hierarchy lens specifically (not the product/business lens), I concur with the WS2 retirement: removing it measurably lowered the number of decisions a first-time visitor must resolve in the first two screens, without removing any *browsing* content.

Everywhere else, cognitive load is well managed: consistent card patterns mean new sections don't require new "how do I read this" effort, and there is exactly one primary CTA style (amber pill, "→" suffix) used consistently for every section-level call to action, so a visitor never has to learn a second button language.

---

## 4. Special Focus — The "Experiences" Section

*(Answered against the two artefacts that still exist for this concept, since no live homepage "Experiences" section exists today — see Section 0.1.)*

### 4.1 Does it feel distinct from Journey Mood Cards?

**Compositionally, yes — visually, JourneyInvitations and the Hero's Mood Cards are quite different treatments.** Mood Cards are small (`min-h-36`/144px), frosted-glass, icon-illustrated horizontal chips laid over a photographic hero background. `JourneyInvitations.tsx` is a set of large (`min-h-[27rem]`/432px) full-bleed photographic tiles with bottom-gradient text overlays, closer in feel to a magazine spread than a chip selector. A visitor would not mistake one for the other visually.

**Functionally and thematically, no — it duplicates the job.** Both are "pick a feeling/moment to begin" mechanisms that resolve into Journey Passport, and one card title ("Memory Makers") is verbatim-identical between the two, which is the strongest single piece of evidence that this was read (correctly) as duplication rather than a coincidence, per `DEC-R1.2-008`'s own rationale (cited in Arjun's review) for renaming the Mood Card to align with it.

### 4.2 Is the user likely to understand the difference?

Not reliably, no — and this is where my answer is more cautious than a pure visual read would suggest. Even though the two components look different, their *position in the page* (originally back-to-back, Hero then Journey Invitations) and their *identical resolution path* (both land in Journey Passport) work against a visitor building a clear mental model of "this one is my mood, that one is my moment" within two scrolls. Visual distinctiveness alone doesn't reliably communicate conceptual distinctiveness when the two mechanisms are adjacent and end in the same place.

### 4.3 Does it create cognitive load?

Yes, in its original (pre-retirement) placement — see Section 3. In its current preserved-but-unimported state, it creates zero live cognitive load, since it isn't rendered.

### 4.4 Does it strengthen or weaken the homepage narrative?

In its original placement, it weakened the narrative's early pacing by introducing a second early decision point before the visitor had seen a single destination, trust signal or story — i.e., before there was much reason yet to commit to a "moment." The current ten-section flow (feel → where → why-trust → who-else → why-trust-proven → what-else → who-we-are → let's-talk) reads more cleanly without it, which matches both Arjun's and Sri's independent conclusions.

### 4.5 Should it evolve into a different experience? What alternatives could better support the brand and traveller journey?

Two forward-looking observations, conceptual only, per this EBC's constraint against implementation-ready designs:

1. **A genuinely new finding for this Special Focus, not raised by Arjun's review:** `JourneyInvitations.tsx`'s card markup (`min-h-[27rem]`, `rounded-[2rem]`, `bg-[#2A211C]`, the exact same `shadow-[0_18px_45px_rgba(86,55,22,0.14)]` value, and the identical gradient-overlay stops `linear-gradient(0deg,rgba(28,17,9,.92),rgba(28,17,9,.12)_76%)`) is, class-for-class, the same visual treatment as the homepage's Travel Inspiration cards in `HomepageExperience.tsx` — not just similar, effectively identical. This makes sense given both trace back to the same original codebase, but it means that **if a future release reintroduces this component as-is, it would not just re-create the conceptual overlap with Mood Cards that WS2 removed — it would also introduce a new *visual* overlap with Travel Inspiration**, a section that already exists elsewhere on the same page using the identical card language. Any future reintroduction should treat the visual treatment as something to reconsider alongside the placement, not just carry it forward unchanged — otherwise a visitor who has already seen this exact card shape once (Travel Inspiration) would see it again for a conceptually unrelated section.
2. Agreeing with Arjun's product-side framing (Section 4.5 of his review): if Product does revisit this in a future release, the two invitation concepts with genuinely no other homepage-adjacent path today (Global Escapes, Nature & Serenity) are the more defensible reason to bring something back — not a general "second decision point" restoration. From a pure visual-hierarchy standpoint, resurfacing just two concepts (rather than three-of-six) would also naturally push toward a smaller, less homepage-dominating treatment than the original three-tile block, which would help avoid re-creating the pacing cost described in Section 4.4.

### 4.6 A separate, unrelated finding surfaced while investigating this Special Focus

There is a **second, genuinely orphaned "Experiences" artefact** in the repository that neither this EBC's framing nor Arjun's review mentions: `web/components/sections/Experiences/Experiences.tsx` and `ExperienceCard.tsx`. I confirmed directly that the live `/experiences` route (`web/app/experiences/page.tsx`) does **not** import this component — it uses `EditorialCardGrid`/`EditorialCardItem` from `components/discovery/EditorialCards`, matching what Arjun's review already documented. `Experiences.tsx`/`ExperienceCard.tsx` is not imported anywhere in the codebase I could find. Beyond being dead code (an engineering-hygiene point for Rad, not mine to flag as a defect), it is worth naming for UX reasons specifically: **its visual language is completely off-brand** — plain `text-gray-900`/`text-gray-600` Tailwind default greys, a generic `rounded-3xl border border-gray-200` card, and a large raw emoji/text icon per card — none of the warm espresso/cream/amber palette, serif headline treatment, or photography-led card language the rest of the live site uses consistently. This looks like an early scaffold from before the current design language was established. It carries a small but real risk: if a future engineer searching the codebase for "an Experiences component to reuse" finds this file before finding the on-brand, actually-current `JourneyInvitations.tsx`, they could resurrect the wrong one. Flagged as an observation for Tiger/Rad's awareness (component/file hygiene), not a UX action item for this EBC.

---

## 5. Homepage Narrative Flow

I have no changes to add to Arjun's purpose-map/flow conclusions (Sections 2 and 6 of his review) from a product-content standpoint — the *feel → where → why-trust-stated → who-else-did-this → why-trust-proven → what-else-to-imagine → who-we-are → let's-talk → everything-else* sequence is sound. My independent contribution is the **visual** layer on top of that sequence: the page alternates its background/card treatment section-to-section in a way that reinforces rather than fights the narrative pacing — dark hero → dark destination cards → light two-column trust text → white story cards → compact bordered trust strip → uniquely-gradient-surfaced inspiration cards → warm-gradient promise card → white contact card → dark footer. No two adjacent sections share an identical visual treatment anywhere in the flow, which is a real, easy-to-overlook strength: it means the page never reads as "the same block repeated," even in the two places (Trust Points/Trust Strip, About/Contact) where the *content* is thematically close.

---

## 6. Traveller Journey Evaluation

Read as a first-time visitor with no prior context: the journey from Hero to Contact Preview asks for exactly one input (a mood) and otherwise only asks for attention, which is well matched to `HOMEPAGE-BLUEPRINT.md`'s "30-30-30" framing (curiosity → confidence → excitement) even though that document's own literal section list (Trust Indicators, Travel Experiences, "How We Design Your Journey," "Why SearchMyVacation" as four separate sections) doesn't match what's actually built — a gap that predates this review and mirrors what Arjun already flagged for the other IA/blueprint documents (Section 11, OPEN-Q-3 of his review). I'd extend that same open question to `HOMEPAGE-BLUEPRINT.md`, `IMAGERY-GUIDELINES.md`'s hero guidance, and `ICONOGRAPHY.md` — all describe an earlier-stage or aspirational target rather than the shipped product, and none of that blocked this review, but a documentation-currency pass covering the Design/UX doc set as a whole (not just the two IA documents Arjun named) would be a reasonable future housekeeping item for Tiger.

Returning-visitor consideration (not explicitly requested by this EBC, but worth one line): nothing in the homepage currently differentiates a returning visitor's experience — no "welcome back," no memory of a prior mood selection. This is consistent with the current release scope, not a defect, and `HOMEPAGE-BLUEPRINT.md`'s own "Future Evolution" section already anticipates this as a later capability.

---

## 7. Desktop vs Mobile Observations

| Aspect | Desktop (≥1280px) | Tablet (640–1279px) | Mobile (<640px) |
|---|---|---|---|
| Header nav | Full inline nav + persistent CTA visible | **Hamburger only** — inline nav and persistent CTA both hidden below 1280px (Section 1.1) | Hamburger only |
| Hero mood cards | 3-per-row (`lg:basis-[calc(33.333%-0.667rem)]`) | 2-per-row from 640px (`sm:basis-[calc(50%-0.5rem)]`) | 1-per-row, full width, tallest layout variant of the section (Section 1.2) |
| Destinations grid | 4 columns | 2 columns (`sm:grid-cols-2`) | 1 column |
| Trust Points | Text left / 2×2 icon grid right (`lg:grid-cols-[.8fr_1.5fr]`) | Stacks to single column below `lg` (1024px) — text block, then icon grid, both full width | Same, single column |
| Traveller Stories / Travel Inspiration cards | 3 columns | 2 columns (Travel Inspiration: `md:grid-cols-2`), 2 columns (Traveller Stories: `sm:grid-cols-2`) | 1 column |
| Trust Strip | Horizontal 4-column strip (`sm:flex-row`) | Horizontal from 640px up | Stacked vertically below 640px (`divide-y` becomes the active divider) |

Two findings worth naming precisely:

1. **The tablet breakpoint is inconsistent across the page.** Trust Points collapses to single-column at `lg` (1024px), while Destinations/Traveller Stories collapse to 2-column at `sm` (640px) and stay 2-column all the way to `lg`/`xl`. This isn't wrong — different content genuinely needs different breakpoints — but it means an iPad in portrait (768–834px typical) sees Destinations as a 2-up grid and Trust Points as a single stacked column simultaneously on the same page, which is a reasonable content-driven choice rather than a system, but worth Sophie/Archie being aware there isn't one unified "tablet layout" concept applied consistently — each section makes its own responsive call. Low severity; flagged for awareness during any future design-token/breakpoint consolidation, not an action item.
2. **The Header tablet gap (Section 1.1)** is the one finding in this table I'd treat as worth a deliberate decision rather than just awareness — losing the persistent CTA for the entire tablet range is a bigger UX cost than a grid column count changing.

---

## 8. Opportunities to Improve Premium Perception

1. Replace the four Unicode-glyph "icons" in Trust Points with a proper outline icon set per `ICONOGRAPHY.md` (Section 1.4) — the cheapest, most contained fix on this list, and the one place the page currently reads a step below its own otherwise-consistent premium bar.
2. Consider whether Trust Points would benefit from a small photographic or illustrative element, given it's the only entirely image-free content section on the page and sits between two image-led sections (Section 1.4) — flagged as a question for Arjun/Vivek, not a Sophie-unilateral recommendation, since it may be a deliberate "text only, let the words carry it" choice worth preserving.
3. The `.golden-inspiration-surface` treatment on Travel Inspiration (Section 1.7) is a genuine premium-perception asset already shipped and working well — noted here as a pattern worth Sophie/Archie considering for selective reuse elsewhere (e.g., the closing About/Promise card already independently arrived at a similar "differentiated warm surface" idea via its gradient background) rather than a gap to fix.
4. Longer-term (Archie/Rad-tier, not a UX action item): consolidating the ~193 hardcoded hex occurrences (Section 2) onto the design tokens already defined in `globals.css` would reduce the risk of small, accidental colour drift as the page is touched over time — not urgent, but the earlier this happens the fewer places there are to update.

---

## 9. Risks and Trade-offs

| ID | Category | Description | Severity |
|---|---|---|---|
| RISK-SOPHIE-A | Documentation/Process | This EBC's own Scope of Review list describes the pre-WS2 homepage (includes "Experiences" as a live section); already independently flagged by Arjun's review for the same EBC batch — re-confirmed here from the UX side, same root cause | Low (mitigated by this review and Arjun's) |
| RISK-SOPHIE-B | Accessibility/Mobile | Header's persistent nav and CTA are gated behind the `xl` (1280px) breakpoint, meaning the entire tablet range loses one-tap access to the primary CTA | Low-Medium |
| RISK-SOPHIE-C | Visual consistency | Design-token colour variables in `globals.css` are fully defined but entirely unused; ~193 hardcoded hex values carry visual consistency today by developer discipline alone | Low (informational, Archie/Rad's domain) |
| RISK-SOPHIE-D | Brand/Premium perception | Trust Points section uses raw Unicode glyphs instead of a proper icon set, inconsistent with `ICONOGRAPHY.md`'s documented direction | Low |
| RISK-SOPHIE-E | Component hygiene | An off-brand, unimported `Experiences.tsx`/`ExperienceCard.tsx` component exists in the same `sections/` directory as the on-brand `JourneyInvitations.tsx`, creating a risk that a future contributor resurrects the wrong one | Low |
| RISK-SOPHIE-F | Documentation currency | `HOMEPAGE-BLUEPRINT.md`, `IMAGERY-GUIDELINES.md` and `ICONOGRAPHY.md` describe an earlier-stage or aspirational design direction not fully matching the shipped homepage (extends Arjun's OPEN-Q-3 finding to the broader Design/UX doc set) | Low |

None of these are release-blocking. RISK-SOPHIE-B and RISK-SOPHIE-D are the two I'd put forward for a specific Tiger/Vivek decision before this card is closed out.

---

## 10. Prioritized UX Recommendations

1. **(P2 — Improve, contained, low-effort) Replace the four Unicode glyph "icons" in Trust Points** (`◌ ✦ ↗ ◎`) with a proper outline icon set consistent with `docs/04-UX/ICONOGRAPHY.md`. See Sections 1.4 and 8.
2. **(P2 — Product/UX decision, not a default) Decide whether the Header's nav/CTA breakpoint should move from `xl` (1280px) to `lg` (1024px)** so tablets in landscape regain the persistent one-tap CTA. See Sections 1.1 and 6.
3. **(P3 — awareness only, Archie/Rad's domain) Flag the unused colour design-token system (~193 hardcoded hex values in active use vs. nine defined-but-unused CSS custom properties) for a future design-token consolidation pass.** See Section 2.
4. **(P3 — awareness only, Rad's domain) Flag the orphaned, off-brand `Experiences.tsx`/`ExperienceCard.tsx` component for cleanup or removal**, to reduce the risk of a future contributor reusing it instead of the on-brand `JourneyInvitations.tsx`. See Section 4.6.
5. **(P3 — Future Recommendation, only if Product revisits Experiences) If `JourneyInvitations.tsx` is ever reintroduced, treat both its placement (per Arjun's Section 4.5) and its card visual treatment as open questions** — its current styling is class-for-class identical to the Travel Inspiration cards already on the page, which would create a new visual duplication alongside whatever conceptual overlap is resolved. See Section 4.5.
6. **(P3 — question for Arjun/Vivek, not a Sophie action item) Consider whether Trust Points should gain a photographic or illustrative element**, since it's the homepage's only fully image-free content section and also its most trust-critical one. See Section 8.
7. **(P3 — documentation housekeeping, not urgent) Extend Arjun's documentation-currency observation (OPEN-Q-3) to `HOMEPAGE-BLUEPRINT.md`, `IMAGERY-GUIDELINES.md` and `ICONOGRAPHY.md`**, all of which describe an earlier-stage or aspirational direction rather than the shipped homepage. See Section 6.

None of these are release-blocking. Items 1 and 2 are the two I'd single out as worth a specific decision from Vivek/Tiger before this card is closed out; the rest are Improve- or awareness-tier.

---

## 11. Assumptions

- **Assumption:** The device-bridge snapshot of the repository (branch `feature/ebcr1.2-003-trust-strip-visual-refresh`, same clean-except-two-untracked-items status Arjun's review found) reflects the actual current state of the homepage; no newer, uncommitted local changes were hidden from this review's read access.
- **Assumption:** In the absence of a reachable production URL or a way to keep a local dev server alive across this session's tool calls, direct source inspection (exact Tailwind classes, breakpoints, and CSS custom properties) is an adequate substitute for rendered screenshots for this review's purposes — consistent with the methodology Arjun's WS3 review already used and that the project's Team Satvi model treats the repository as source of truth (Project Instructions Section 17). Genuinely rendering-dependent judgements (precise in-context colour contrast, real motion/animation feel) are outside what this method can verify and are not asserted here.
- **Assumption:** Per this EBC's own constraints ("No code changes... do not produce implementation-ready designs"), all recommendations above are described conceptually, not as specific class/markup changes, even where I had the exact line-level fix in view while reviewing the code.
- **Inferred, not confirmed:** that Tiger/Vivek want this UX pass even though several of its findings (the colour-token gap, the orphaned Experiences component) sit closer to Archie/Rad's engineering domain than a pure visual-hierarchy review — I've included them because I found them while answering this EBC's explicit questions and Project Instructions Section 35 asks not to silently drop material findings, but I've been careful to route each one to the correct persona rather than recommend action on it myself.

---

## 12. Open Questions for Business/Team Review

1. **(Tiger/Vivek)** Should the Header's nav/CTA breakpoint move from `xl` (1280px) to `lg` (1024px) so tablets regain one-tap CTA access? See Section 1.1, Recommendation 2.
2. **(Arjun/Vivek)** Would Trust Points benefit from a photographic or illustrative element, or is "text only" a deliberate, worth-preserving choice for that section specifically? See Section 8, Recommendation 6.
3. **(Archie/Rad, not urgent)** Should the ~193 hardcoded hex values across components be consolidated onto the design tokens already defined in `globals.css`, and should the unused purple/red-orange tokens be removed if they're not part of any near-term brand plan? See Section 2, Recommendation 3.
4. **(Rad, housekeeping)** Should the orphaned `web/components/sections/Experiences/Experiences.tsx` and `ExperienceCard.tsx` be removed, given the live `/experiences` route doesn't use them and they carry off-brand styling? See Section 4.6, Recommendation 4.
5. **(Tiger, documentation housekeeping)** Should `HOMEPAGE-BLUEPRINT.md`, `IMAGERY-GUIDELINES.md` and `ICONOGRAPHY.md` be refreshed to reflect the shipped product, alongside the IA documents Arjun's review already flagged? See Section 6, Recommendation 7.

---

## 13. Acceptance Criteria Mapping

- ✔ Complete homepage UX review documented — all 10 live sections reviewed (Section 1), including the 3 the EBC's own scope list omits (About/Promise Preview, Contact Preview, Trust Points).
- ✔ Experiences section fully evaluated with supporting rationale — Section 4, covering both the preserved `JourneyInvitations.tsx` and the previously-unflagged orphaned `Experiences.tsx`/`ExperienceCard.tsx`.
- ✔ Clear, prioritized recommendations suitable for joint review with Arjun's findings — Section 10, cross-referenced to Arjun's `EBC-R1.2-WS3-ARJUN-Homepage-Product-IA-Review.md` throughout rather than restating his findings independently.
- ✔ Outputs provide direct input into R1.2-03.02 (Overlap Analysis) and subsequent implementation planning — with the same caveat Arjun's review states in his Section 0.1(a): this card's actual Workstream label conflicts with the tracker's real Workstream 3, its inputs here are homepage-visual-hierarchy-specific, not destination-mapping-specific, and should be sequenced by Tiger accordingly.
- ✔ Ready for Tiger-led review with Vivek — this document is complete and analysis-only; no code, design or configuration was changed.
