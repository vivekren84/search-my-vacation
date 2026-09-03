> **Filing note (added under EBC R1.2-015, 17-Aug-2026):** This review was originally authored and filed as `EBC-R1.2-WS3-EBC-ARJUN-Homepage-Product-IA-Review.md`. As the author (Arjun) identifies explicitly in Section 0.1(a) below, that "WS3" label conflicts with `docs/10-Backlog/RELEASE-1.2.md` Section 6.3's actual Workstream 3 (Destination Intelligence) — an unrelated, still-Proposed workstream. Per Arjun's own recommendation in that section, this review is filed under the tracker's next sequential EBC number, **R1.2-014**, instead. No content below has been altered from the original review. See `RELEASE-1.2.md` v1.7 (DEC-R1.2-013, OPEN-R1.2-007–009, Section 13 Technical Debt Register) for how this review's findings were carried into the tracker.
>
> ---

# EBC R1.2-WS3-EBC-ARJUN — Product, Business & Information Architecture Review (Homepage)

**Persona:** Arjun — Product & Business Analyst
**Type:** Product Analysis & Impact Assessment (analysis only — no code, no documentation, no configuration was changed)
**Date:** 16 August 2026
**Reviewer (per EBC):** Tiger | **Business Owner:** Vivek

---

## 0. Session & Repository Confirmation

- Repository root confirmed: `/Users/viveksophu/Documents/Projects/SearchMyVacation` (local access connected via device bridge and used as source of truth, per Project Instructions Section 14).
- Current branch: `feature/ebcr1.2-003-trust-strip-visual-refresh`.
- Git working-tree status: clean except two pre-existing, unrelated items — an untracked `_to_delete/` folder and an untracked `docs/09-Development/EBCR1.2-009-EXPERIENCES-RETIREMENT-IMPLEMENTATION.md`. Neither was touched by this review.
- No files were created, modified or deleted in the repository. This card is analysis-only, matching its own stated Constraints.
- Primary sources: the live repository (`web/app/page.tsx`, `web/components/sections/**`, `web/components/layout/**`, `web/config/site.config.ts`), `docs/10-Backlog/RELEASE-1.2.md` (authoritative tracker, decision log, Workstream definitions), the prior WS2 EBC chain (R1.2-007, R1.2-009, R1.2-010, R1.2-011, R1.2-012, R1.2-013), `docs/04-UX/HOMEPAGE-INFORMATION-ARCHITECTURE.md`, `docs/07-Design/BLUEPRINTS/HOMEPAGE-BLUEPRINT.md`, `docs/02-Product/INFORMATION-ARCHITECTURE.md`, and `docs/04-UX/JOURNEY-INVITATIONS-DESIGN-LANGUAGE.md`.

---

## 0.1 Critical Scope Note — read before the rest of this review

Two things in this EBC's own framing do not match the current state of the repository. Per Project Instructions Section 35, I am not resolving either silently; both are named here and carried into Section 11 (Open Questions) for Tiger/Vivek.

**(a) The "Workstream 3" label conflicts with the tracker.** This card is titled `R1.2-WS3-EBC-ARJUN` and its header table calls it "Workstream 3 – Homepage Experience Architecture Review." But `docs/10-Backlog/RELEASE-1.2.md` Section 6.3 defines the *actual* Workstream 3 as **Destination Intelligence** (tasks R1.2-03.01–03.15: destination mapping, weighted Journey/Memory preference ranking, Journey Director recommendation ordering) — a different piece of work entirely, currently the tracker's "next active implementation stream" per WS2's closure (R1.2-013). This review is not that Workstream 3. It reads, in scope and content, like a revisit/extension of the *already-closed* Workstream 2 (Experiences vs Journey Mood Rationalisation — R1.2-007 through R1.2-013). I have proceeded with the analysis as instructed, because the content itself is legitimate and useful, but the numbering should not be read as this card sitting inside the tracker's real Workstream 3, and I'd recommend Tiger assign it a proper sequential EBC number (the tracker's own convention was at R1.2-013 as of the last closure) before this is filed alongside the other WS2/WS3 records.

**(b) "Experiences" is not currently a homepage section.** The EBC's Scope of Review lists, in visitor order: *"1. Hero 2. Journey Mood Cards 3. Featured Destinations 4. Experiences 5. Traveller Stories 6. Trust Strip 7. Travel Inspiration 8. Footer & Final CTA."* That was the homepage's composition **before** Workstream 2. As of `R1.2-009` (Sophie's implementation), `R1.2-010` (Rad's engineering), `R1.2-011` (Keerthi's functional QA — 24/25 passed), `R1.2-012` (Sri's traveller-experience validation — approved), and `R1.2-013` (Tiger's tracker closure marking Workstream 2 **Complete**), the "Experiences" section (internally, the "Journey Invitations" block, `JourneyInvitations.tsx`) has been removed from the live homepage, the header and the footer. I confirmed this directly in the current `web/app/page.tsx` → `HomepageExperience.tsx` render tree: no `Experiences`/`JourneyInvitations` import exists there today. The component itself is preserved, unimported, for future reuse (see Section 4).

Given (b), I have treated this EBC's "Special Focus: Experiences" instructions as **two possible readings** and answered both rather than guessing which was intended:
1. *Re-validate the already-approved retirement decision* with fresh eyes, independent of the WS2 chain — Section 4.
2. *Evaluate the preserved, unimported `JourneyInvitations.tsx` component* as a forward-looking reuse candidate, since that is the only "Experiences" artifact still relevant to a live-homepage discussion — also Section 4.

I did **not** treat this as licence to recommend reversing DEC-R1.2-009/012 by default; that would silently reopen a Product Owner-approved, Sri-validated, Tiger-closed decision without new evidence to justify it. Section 4 states plainly whether new evidence of that kind exists.

The rest of this review covers the homepage **as it is actually implemented today**, in true visitor order, including three sections the EBC's own list omits (Trust Points, About/Promise Preview, Contact Preview) — flagged in Section 11 as a gap in the EBC's own scope list, addressed anyway per the EBC's Acceptance Criteria ("Every homepage section reviewed").

---

## 1. Executive Summary

The current homepage (`web/app/page.tsx`) renders, in order: **Header → Hero + Journey Mood Cards → Featured Destinations → Trust Points → Traveller Stories → Trust Strip → Travel Inspiration → About/Promise Preview → Contact Preview → Footer**. Ten sections, not eight, and no "Experiences" section — that removal is already implemented, QA'd and closed under Workstream 2.

Read as a first-time visitor and as a product analyst together, the homepage now tells one coherent story with no orphaned or duplicated "pick a feeling" moment: *how do you want to feel → where could that take you → why trust us (stated) → real people who did this → why trust us (proven, with numbers) → a few more ideas → our promise → let's talk*. This matches the project's own "Traveller Decision Journey" philosophy reasonably well, though two of the project's own historical IA documents (`HOMEPAGE-INFORMATION-ARCHITECTURE.md`, `docs/02-Product/INFORMATION-ARCHITECTURE.md`) describe an earlier, larger homepage concept (Smart Trip Search, Travel Collections, Blogs, Newsletter, an Announcement Bar) that was never built this way and should not be read as current — see Section 11.

Two real structural findings, both new (not carried over from prior EBCs):

1. **The homepage has two separately-labelled "trust" moments** — "Trust Points" (qualitative, 4 text/icon cards, sits between Destinations and Traveller Stories) and "Trust Strip" (quantitative, Google Reviews + 3 stats, sits between Traveller Stories and Travel Inspiration). They do not duplicate each other's *content* (reasons-to-trust vs proof-of-trust), but they do duplicate the *job* of the section immediately before Traveller Stories and immediately after it — see Section 5.
2. **The homepage's own final CTA section ("Contact Preview") never links to `/contact`.** It gives WhatsApp, phone and email directly, and its button CTA goes to `/journey-passport`, not `/contact`. `/contact` is reachable only via Header nav and the Footer's "About" group. This is a minor but real CTA-routing gap — see Section 3.9 and Section 8.

No architecture, brand, Journey Director or data risk was identified in this pass. Overall recommendation: **🟢 Homepage is coherent and release-ready as implemented**, with the two findings above logged as Improve-tier, non-blocking items, and one open question each for the two scope conflicts in Section 0.1.

---

## 2. Homepage Purpose Map

| Section (visitor order) | Traveller Decision Journey question answered | Stage (per `HOMEPAGE-BLUEPRINT.md`'s Dream→Discover→Trust→Explore→Plan→Experience→Remember model) |
|---|---|---|
| Header | "Can I get around this site?" | (persistent, not a stage) |
| Hero + Journey Mood Cards | "What kind of holiday suits me?" | Dream |
| Featured Destinations | "Where can I go?" | Discover |
| Trust Points | "Why should I trust Search My Vacation?" (stated) | Trust |
| Traveller Stories | "Have other travellers enjoyed their experience?" | Trust (social proof) |
| Trust Strip | "Why should I trust Search My Vacation?" (proven, quantified) | Trust (reinforced) |
| Travel Inspiration | "What else might I not have considered?" | Explore |
| About/Promise Preview | "Who are these people, really?" | Trust → Plan bridge |
| Contact Preview | "How do I start planning my trip?" | Plan |
| Footer | "Where's everything else / how do I reach you another way?" | (persistent) |

Observation: the map above is my own reconstruction from the live code, not a pre-existing document — none of the three IA/blueprint documents in the repository (`HOMEPAGE-INFORMATION-ARCHITECTURE.md`, `HOMEPAGE-BLUEPRINT.md`, `docs/02-Product/INFORMATION-ARCHITECTURE.md`) describe the homepage exactly as it is built today. All three are earlier-stage concept documents (see Section 11, OPEN-Q-3) and should be treated as historical context, not current-state specification.

---

## 3. Section-by-Section Findings

### 3.1 Header

- **Primary business purpose:** Persistent navigation + brand presence; carries the one global CTA ("Plan My Experience" → `/journey-passport`).
- **Traveller problem solved:** "Can I get where I need to go from anywhere on the site?"
- **Conversion objective:** Secondary — a standing, low-friction path to Journey Passport at every scroll depth (sticky header).
- **Relationship to next section:** Directly frames the Hero; its 5 nav items (Destinations, Traveller Stories, Travel Inspiration, About Us, Contact) now map 1:1 to five of the ten homepage sections below, with no unmapped or orphaned item.
- **Duplicate messaging:** None. Confirmed via `site.config.ts`: exactly 5 items, matching Section 4's WS2 finding that removing "Experiences" left no remaining nav overlap.
- **Information hierarchy:** Clear — brand mark, nav, one CTA button, mobile menu fallback.
- **Business value:** High (structural necessity).
- **SEO value:** Indirect — internal links from every page reinforce site structure; no metadata concern.
- **CTA effectiveness:** Single, unambiguous CTA ("Plan My Experience"), consistently placed. Effective.
- **Recommendation: Keep.**

### 3.2 Hero + Journey Mood Cards

- **Primary business purpose:** Establish emotional tone in the first seconds; capture the traveller's *mood* as the single homepage-level entry signal into Journey Passport.
- **Traveller problem solved:** "I don't know exactly where I want to go, but I know how I want to feel."
- **Conversion objective:** Primary — every card routes to `/journey-passport?mood=<key>`, pre-populating the funnel's very first step.
- **Relationship to previous section:** First thing seen; sets the tone Trust Points and Trust Strip later reinforce.
- **Relationship to next section:** Feeds directly into Featured Destinations with no intermediate section — this transition is the one Sri specifically validated in R1.2-012 and rated as "a more direct cause-and-effect" than the previous three-step version.
- **Duplicate messaging:** None remaining on the homepage (previously duplicated by the since-removed Journey Invitations block — see Section 4). Worth naming precisely for the record: `HeroJourney.tsx`'s five cards (Relax, Explore, Celebrate, Romance, Memory Makers) are a *different, disjoint* concept set from the six retained-but-unlinked `/experiences` invitations (Memory Makers, Celebration Moments, Family Time, Global Escapes, Nature & Serenity, Weekend Getaways) except for the one shared title, "Memory Makers" — which is an intentional, approved overlap per `DEC-R1.2-008` (the mood card was renamed specifically to align with the Experience tile of the same name), not an accidental duplication.
- **Information hierarchy:** Strong — one headline question ("How do you want to feel?"), one supporting line, five equally-weighted cards, one CTA that only activates once a card is selected.
- **Business value:** High — this is the funnel's actual entry mechanism.
- **SEO value:** Low-to-none directly (client-rendered `"use client"` interaction; no unique crawlable copy beyond the headline/cards, which are short). Not a concern for a hero pattern like this.
- **CTA effectiveness:** Deliberately two-stage (select a card, then a single "Start My Journey" button activates) — this is a considered UX choice already validated by Sri (R1.2-006/012) as "an unhurried nudge rather than a hard CTA," not a defect.
- **Recommendation: Keep.** (Two carried-forward, non-blocking polish items already on record from Sri's reviews — Memory Makers card legibility, mobile above-the-fold visibility of all 5 cards — are UX-tier, not product-tier; not re-litigated here.)

### 3.3 Featured Destinations ("Places with possibility")

- **Primary business purpose:** Convert the Hero's emotional entry into concrete, real, explorable destinations.
- **Traveller problem solved:** "Now that I know how I want to feel, where could that actually happen?"
- **Conversion objective:** Secondary — each of the 8 cards links to `/destinations#<slug>`; a further CTA links to the full `/destinations` page.
- **Relationship to previous section:** Direct, validated-natural transition from Mood Cards (Section 3.2; Sri R1.2-012 Phase 4).
- **Relationship to next section:** Leads into Trust Points — a reasonable "you've seen where you could go, here's why to trust us with it" sequence, though see Section 5 on the two-trust-moments question.
- **Duplicate messaging:** None found against any other homepage section. (It does functionally overlap with the retained-but-unlinked `/experiences` page's destination-agnostic framing, but that page is not itself linked from the homepage, so this is not a live duplication.)
- **Information hierarchy:** Clear card grid (image, region label, name, one line of copy, CTA) — consistent with Traveller Stories' and Travel Inspiration's card patterns elsewhere on the page, which is a real design-system strength (see Section 6).
- **Business value:** High — this is the first concrete, bookable-adjacent content a visitor sees.
- **SEO value:** Meaningful — 8 named destinations (Kashmir, Kerala, Rajasthan, Andaman, Bali, Dubai, Singapore, Vietnam) with unique descriptive copy and image alt text (`Travel inspiration for ${destination.name}`) give the homepage real topical/geographic keyword coverage it would otherwise lack.
- **CTA effectiveness:** Good — per-card CTA plus one "Explore All Destinations" CTA; no ambiguity.
- **Recommendation: Keep.**

### 3.4 Trust Points ("A journey begins with being understood")

*(Not named in this EBC's own Scope of Review list — included per the Acceptance Criteria's "every homepage section reviewed.")*

- **Primary business purpose:** State, in the company's own words, the specific reasons a traveller should trust Search My Vacation's process (not its results).
- **Traveller problem solved:** "What actually makes this company different from a generic travel site?"
- **Conversion objective:** None directly — no CTA in this section; it is a pure trust-building/differentiation block.
- **Relationship to previous section:** Follows Destinations; reads as "before you go further, here's how we operate."
- **Relationship to next section:** Precedes Traveller Stories, which is where those stated claims get external corroboration.
- **Duplicate messaging:** Partial overlap in *theme* (not content) with Trust Strip — see Section 5's Duplicate Content Matrix for the detailed comparison; this section is qualitative/stated, Trust Strip is quantitative/proven.
- **Information hierarchy:** Clean two-column layout (headline/intro left, 4 icon-card grid right); no CTA to compete with the surrounding sections' CTAs.
- **Business value:** Medium-High — directly encodes brand principles ("we listen before recommending," "honest advice over quick sales") from Project Instructions Section 1 into on-page copy; a meaningful trust-differentiation asset.
- **SEO value:** Low — short, generic-sounding headline text (each point's copy is 1 sentence); unlikely to carry unique search-ranking value, though it doesn't hurt anything either.
- **CTA effectiveness:** N/A by design (no CTA) — appropriate for a stated-principles section.
- **Recommendation: Keep**, with one Improve-tier observation: this section and Trust Strip are two different trust mechanisms sharing very similar thematic real estate 3 sections apart. Not a duplication that needs removing (see Section 5), but worth Sophie/Tiger being aware the page asks "trust us" twice by name before Travel Inspiration even starts.

### 3.5 Traveller Stories

- **Primary business purpose:** Provide first-person social proof from real completed journeys.
- **Traveller problem solved:** "Have people like me actually done this and been happy?"
- **Conversion objective:** Secondary — CTA to `/traveller-stories` for the full catalogue.
- **Relationship to previous section:** Follows Trust Points — moves from the company's stated claims to travellers' own words, a logical escalation of proof.
- **Relationship to next section:** Precedes Trust Strip, which adds quantified numbers (including the Google Reviews rating) right after individual stories — also a logical escalation (anecdote → aggregate).
- **Duplicate messaging:** None. This section is explicitly capped at 3 curated cards (`HOMEPAGE_STORY_LIMIT`) specifically because, per the component's own code comment, the homepage "had become excessively long" when it rendered all 15 stories from the legacy dataset — a Release 1.1 fix, still correctly enforced today (`.slice(0, HOMEPAGE_STORY_LIMIT)`, defence-in-depth even against a longer upstream list).
- **Information hierarchy:** Strong — eyebrow, headline, one clarifying line ("These are not reviews..."), 3 real cards with photo/quote/traveller name/destination/date, one CTA.
- **Business value:** High — real, specific, dated stories with named destinations carry more credibility than generic testimonials.
- **SEO value:** Meaningful — each story card has unique quote text and a named destination/date; the full `/traveller-stories` page (linked from here) is a legitimate content-depth asset.
- **CTA effectiveness:** Good — single clear "Explore All Traveller Stories" CTA.
- **Recommendation: Keep.**

### 3.6 Trust Strip

- **Primary business purpose:** Quantified, numbers-based credibility — the one section on the page with an external, independently-verifiable link (Google Reviews).
- **Traveller problem solved:** "Is this a real, established, reasonably-sized business, not a one-person operation?"
- **Conversion objective:** Tertiary — the Google Reviews item is the only interactive element (opens Google in a new tab); the other three are informational-only by explicit design (per the component's own governing comment: "never a link").
- **Relationship to previous section:** Directly follows Traveller Stories — reads as "you just read individual stories; here's the aggregate picture."
- **Relationship to next section:** Precedes Travel Inspiration — a slight tonal shift from "trust us" back to "here's more to imagine," which works because Trust Strip is compact (not a full `layout-section`, uses a smaller `py-8 sm:py-12` wrapper) and doesn't overstay its welcome.
- **Duplicate messaging:** See Section 5 — thematic-only overlap with Trust Points, not content duplication.
- **Information hierarchy:** Clean single-row (desktop) / stacked (mobile) 4-column strip; recently refreshed under R1.2-003 (photographic cut-outs replacing flat medallions) — already validated by the project owner per that EBC's "Approval status" section.
- **Business value:** High — the 4.9/5 Google rating, tied to a real clickable profile, is the single most externally-verifiable trust signal on the entire homepage.
- **SEO value:** Low direct value (mostly numerals + short labels) but the aggregateRating-adjacent content (if ever wired to schema.org markup) would be a natural candidate — currently there is no `AggregateRating` structured data anywhere in the codebase (only the site-wide `TravelAgency` schema in `layout.tsx`); flagged as a Future Recommendation in Section 8, not a defect.
- **CTA effectiveness:** Appropriately restrained — only 1 of 4 items is a link, matching the section's "informational, not promotional" intent as documented in the component's own comments.
- **Recommendation: Keep.**

### 3.7 Travel Inspiration

- **Primary business purpose:** Educate/inspire before selling — the homepage's explicit "give value before asking for anything" moment.
- **Traveller problem solved:** "What haven't I thought of yet?"
- **Conversion objective:** Tertiary — 3 of 4 available inspiration items previewed, CTA to the full `/travel-inspiration` page (8 items).
- **Relationship to previous section:** Follows Trust Strip — a considered pacing choice (numbers, then imagination) rather than stacking two trust/proof sections back to back.
- **Relationship to next section:** Precedes About/Promise Preview — reads as "here's more to imagine" → "here's who we are," a reasonable bridge into the closing third of the page.
- **Duplicate messaging:** None against other homepage sections. Worth noting for completeness (not a homepage-level finding): the *dedicated* `/travel-inspiration` page and the retained-but-unlinked `/experiences` page share the same underlying `EditorialCardGrid`/`EditorialCardItem` component and a structurally similar "feeling, not itinerary" framing — this was already identified and assessed as an acceptable, non-blocking near-duplication by Arjun's R1.2-007 review (concept-close but distinct: "a concrete moment to create" vs "a broader possibility to notice"). Not re-litigated here since `/experiences` isn't part of the live homepage.
- **Information hierarchy:** Strong — same editorial card pattern as Destinations, reinforcing the page's consistent visual language (Section 6).
- **Business value:** Medium-High — directly serves the brand principle "Offer honest guidance rather than pressure" (Project Instructions Section 1) by giving away ideas with no immediate ask.
- **SEO value:** Meaningful — 4 defined inspiration items with unique copy on the homepage, 8 on the full page; genuine content-depth asset, same as Traveller Stories.
- **CTA effectiveness:** Good — per-card link plus one "Explore All Inspiration" CTA.
- **Recommendation: Keep.**

### 3.8 About/Promise Preview ("Our promise to you")

*(Not named in this EBC's own Scope of Review list — included per Acceptance Criteria.)*

- **Primary business purpose:** Humanise the brand and restate its core promise ("More than a trip, it's an Experience") directly, in the company's own voice, before the closing contact CTA.
- **Traveller problem solved:** "Who is actually behind this, and do their values match what I've seen so far?"
- **Conversion objective:** Secondary — one CTA, "Learn more about us" → `/about`.
- **Relationship to previous section:** Follows Travel Inspiration — a natural close-out of the "inspire and inform" portion of the page before the final "plan" section.
- **Relationship to next section:** Directly precedes Contact Preview, forming a clear two-part closing (who we are → let's talk).
- **Duplicate messaging:** The headline text ("More than a trip, it's an Experience") is the project's own stated tagline (Project Instructions Section 1: *"More Than a Trip. It's an Experience."*) — intentional brand reinforcement, not an accidental repeat of on-page copy found elsewhere.
- **Information hierarchy:** Clear — eyebrow, headline, one paragraph, one CTA, one supporting photo.
- **Business value:** Medium — reinforces brand promise at exactly the point a visitor is deciding whether to continue toward contact.
- **SEO value:** Low (short, brand-tagline-driven copy) but the linked `/about` page is a legitimate deeper-content asset.
- **CTA effectiveness:** Single, clear CTA; appropriately restrained (this section's job is trust, not conversion — the conversion ask comes next).
- **Recommendation: Keep.**

### 3.9 Contact Preview ("When you are ready, we are here")

*(Not named in this EBC's own Scope of Review list — included per Acceptance Criteria. This is the homepage's actual final CTA, functionally distinct from the Footer that follows it.)*

- **Primary business purpose:** Convert — the homepage's true closing ask.
- **Traveller problem solved:** "I'm ready (or nearly ready) — how do I actually start?"
- **Conversion objective:** Primary (for this section) — "Start planning your journey" → `/journey-passport`, plus direct WhatsApp/Phone/Email contact channels.
- **Relationship to previous section:** Direct continuation of About/Promise Preview — together they form one visual "closing" card pairing (both `layout-section`, the second styled as a white card on the same cream background).
- **Relationship to next section:** Precedes Footer, which repeats WhatsApp/Phone/Email in the "Connect" group — see Section 5 for whether this is a problematic duplication (it is not — it's a standard, expected closing/footer pattern).
- **Duplicate messaging:** WhatsApp/Phone/Email appear here **and** in the Footer's "Connect" group immediately below. This is conventional (most sites repeat contact details in a closing CTA and again in the footer) and not flagged as a defect — see Section 5.
- **Information hierarchy:** Two-column — CTA + heading on the left, direct contact channels on the right (`<address>`/`<dl>` semantic markup, a nice accessibility touch).
- **Business value:** High — this is the section actually designed to generate an enquiry.
- **SEO value:** Low direct value, though the `<address>` element with real phone/email is a minor structured-data-friendly touch.
- **CTA effectiveness: this is the one real gap found in this review.** The section's single button CTA routes to `/journey-passport`, not `/contact` — meaning a visitor who has scrolled the entire homepage and reached its dedicated closing "let's talk" section is never offered a direct link to the `/contact` page itself from that section. `/contact` remains reachable only via the Header nav and the Footer's "About" group (`["Contact Us", "/contact"]`), both one extra deliberate action away from where the visitor's attention already is. This isn't necessarily wrong — routing the primary CTA to Journey Passport (the actual lead-capture flow) rather than a static Contact page may be the intended design, since Journey Passport is described elsewhere in this project as the canonical entry into personalised planning — but it is worth Product confirming this is deliberate rather than an oversight, since the section's own heading ("When you are ready, we are here") reads, to a first-time visitor, as an invitation to *talk to someone*, and the direct channels (WhatsApp/Phone/Email) partially cover that gap but the CTA *button* itself does not.
- **Recommendation: Improve.** Specifically: confirm with Product whether the CTA routing to Journey Passport-only (bypassing `/contact`) is intentional; if not, consider a secondary/text-level link to `/contact` alongside the existing WhatsApp/Phone/Email channels. This is a product/routing question for Vivek, not a design change Arjun is proposing unilaterally.

### 3.10 Footer

- **Primary business purpose:** Complete, site-wide navigational and legal safety net; final trust reinforcement (brand tagline restated once more).
- **Traveller problem solved:** "I've reached the bottom of the page — is there anything else here, and can I trust this is a real, compliant business?"
- **Conversion objective:** Low-to-none directly; supports conversion indirectly by removing "dead end" anxiety (Project Instructions' own navigation principle from `INFORMATION-ARCHITECTURE.md`: "Visitors should never reach a dead end").
- **Relationship to previous section:** Direct continuation of Contact Preview.
- **Relationship to next section:** N/A — final section.
- **Duplicate messaging:** WhatsApp/Phone/Email repeated from Contact Preview (expected, not a defect — see Section 5). "Destinations" and "Travel Inspiration" links repeat Header nav items (also expected — footers conventionally mirror primary nav plus additional links). "Plan My Experience" appears a third time as a footer link (Header has it as the CTA button; Contact Preview has "Start planning your journey" to the same destination; Footer's "Discover" group repeats it as a plain text link) — three separate paths to the exact same URL (`/journey-passport`) is a lot of repetition for one destination, though each instance is contextually reasonable (persistent CTA, closing CTA, footer link) rather than accidental.
- **Information hierarchy:** Standard 4-column footer (Brand, Discover, About, Support, Connect — actually 5 groups across a `[1.5fr, 1fr, 1fr, 1fr]` grid); complete legal coverage (Privacy Policy, Terms and Conditions).
- **Business value:** Medium — structural necessity, legal compliance, secondary navigation safety net.
- **SEO value:** Meaningful — every internal page is one click from the footer on every page of the site (not just the homepage), which is good general crawlability practice, and directly relevant to the `/experiences` orphan-page risk Arjun's R1.2-007 review already flagged (RISK-E) as still open.
- **CTA effectiveness:** N/A by design — footer's job is completeness, not conversion.
- **Recommendation: Keep.** One observation carried from R1.2-007, still true and still open, not new to this review: `/experiences` no longer appears in the Footer's "Discover" group (removed under R1.2-009 per DEC-R1.2-012's "every intentional discovery path" wording), which means the retained page now has **zero internal inlinks anywhere on the live site** — this was already flagged as RISK-E in R1.2-007 (Low severity, SEO/crawlability) and remains open in the tracker (not something this review needs to re-flag as new, but worth noting it is still unresolved as of this pass).

---

## 4. Special Focus — The "Experiences" Section

### 4.1 Is the section still required (on the homepage)?

**No — and this is not a new finding.** This exact question was already asked and answered by Arjun's R1.2-007 review, approved by the Product Owner as DEC-R1.2-009 (refined by DEC-R1.2-012), implemented by Sophie (R1.2-009), engineered by Rad (R1.2-010), functionally validated by Keerthi (R1.2-011, 24/25 passed), and independently traveller-validated by Sri (R1.2-012, "Approve for Workstream 2 Closure"). Tiger's R1.2-013 tracker update confirms Workstream 2 as **Complete**.

I re-verified this independently for this review rather than taking the prior chain's word for it: `web/app/page.tsx` renders only `Header`, `HeroJourney`, `HomepageExperience`, `PublicFooter` — no `JourneyInvitations` import anywhere in that tree, and `HomepageExperience.tsx` contains an explicit, detailed code comment documenting the removal and pointing to the preserved component. This matches what R1.2-009 through R1.2-013 describe. I found no new evidence in this pass that would justify reopening DEC-R1.2-009.

### 4.2 Does it overlap with Journey Mood Cards?

Yes — this was the entire basis for the original removal, and it remains true of the *preserved* component. Reading `JourneyInvitations.tsx` directly: its heading ("Begin with what matters" / "What kind of time are you hoping to make?") and its three homepage-teaser cards (Memory Makers, Celebration Moments, Family Time) are, functionally, a second "pick a feeling to start" mechanism, positioned (when it was live) directly after the Mood Cards and before Destinations — i.e., structurally back-to-back with the mechanism it duplicates. One card title ("Memory Makers") is still verbatim-identical to one of the five Mood Cards. This is unchanged from R1.2-007's finding; I am not aware of any code change since that would alter this conclusion.

### 4.3 What unique purpose does it serve?

Two things the Mood Cards alone do not currently cover, worth stating plainly since they are the actual cost of the retirement (as R1.2-007 also named, and Sri's R1.2-012 review implicitly accepted as a reasonable trade-off):

1. It was the only homepage-level path to two of the six "invitation" concepts that have no Mood Card equivalent at all — **Global Escapes** and **Nature & Serenity** (the other four either map to a Mood Card — Memory Makers — or remain reachable via the retained `/experiences` page, just not from the homepage).
2. Its card copy is more scenario-specific than the Mood Cards' single-word/short-phrase framing (e.g. "For milestones that deserve more than an ordinary backdrop" vs. "Make it unforgettable") — a different register that some travellers might respond to better, though this is a stylistic hypothesis, not something this review can validate without traveller research (already correctly logged as Sri's domain, and Sri's traveller-facing pass found no evidence travellers actually miss this).

### 4.4 If removed, what business value is lost?

Already answered directly by R1.2-007 (Section 3, "Does anything important disappear?") and re-confirmed by this review: a first-time visitor who does not use the Header nav (no longer has an Experiences item) or the Footer (no longer has one either — see Section 3.10) has **no homepage-originated path at all** to Celebration Moments, Global Escapes, Nature & Serenity or Weekend Getaways. This is the deliberate, approved cost of DEC-R1.2-009, not a new discovery. Sri's R1.2-012 review found no evidence this reads as "missing" to a first-time visitor with no prior context.

### 4.5 If retained (i.e., reintroduced in a future release), how should it evolve?

This is the one genuinely forward-looking question in this Special Focus, and it's the right frame given the component is deliberately preserved for exactly this purpose. Product-level (not implementation-level) observations only, per this EBC's constraints:

- **The preservation mechanism itself is sound from a product-continuity standpoint.** `JourneyInvitations.tsx` is a real, working, unimported component — not a comment block or deleted history — so a future reintroduction is a product/placement decision, not a rebuild. This materially lowers the cost of revisiting this decision in R1.3+, which is already correctly logged in `RELEASE-1.2.md`'s Future Release Candidates ("Experience collections / dynamic experience recommendations," R1.3+, P2).
- **Any future reintroduction should not simply restore the old placement.** Restoring it directly after the Mood Cards would recreate the exact duplication this workstream removed. If Product wants to bring "Experiences" back, the open product question is *where it adds a job the rest of the (now ten-section) homepage doesn't already do* — for example, as a way to resurface Global Escapes/Nature & Serenity specifically (the two concepts with zero other homepage-adjacent coverage today), rather than as a second general "pick a feeling" entry point.
- **This is a Product Owner decision to schedule, not one to make now.** I am not recommending reintroduction — there is no new evidence in this review suggesting the current, approved retirement is wrong. I am only confirming, since the EBC explicitly asked, that *if* Vivek wants to revisit this in a future release, the groundwork (preserved code, documented rationale, a specific two-concept gap) already exists and does not need to be rediscovered.

### 4.6 Summary answer to this Special Focus

**No change recommended.** The retirement is sound, already fully validated end-to-end by four independent Team Satvi personas plus the Product Owner, and this review found no new evidence to reopen it. The only actionable output from this Special Focus is the forward-looking reuse framing in 4.5, filed as a Future Recommendation (Section 8), not an immediate action.

---

## 5. Duplicate Content Matrix

| Pair | Nature of overlap | Severity | Verdict |
|---|---|---|---|
| Journey Mood Cards ↔ *(retired)* Journey Invitations | Two "pick a feeling to start" mechanisms, shared card title, same Journey Passport resolution path | Was High | **Resolved** (WS2) — no longer live; see Section 4 |
| Trust Points ↔ Trust Strip | Both thematically "trust," different content types (stated qualitative reasons vs. proven quantitative stats), separated by an entire Traveller Stories section | Low | **Not a duplication requiring action** — different jobs, different evidence types, reasonable pacing. Logged as an Improve-tier awareness item in 3.4/3.6, not a Merge/Remove candidate. |
| Contact Preview channels ↔ Footer "Connect" group | WhatsApp/Phone/Email repeated verbatim | None (by convention) | **Expected, not a defect** — standard closing-CTA-then-footer pattern |
| "Plan My Experience" / "Start planning your journey" (Header CTA, Contact Preview CTA, Footer "Discover" link) | Three separate UI elements, one destination (`/journey-passport`) | None | **Expected** — a primary conversion path is supposed to be reachable from multiple points; not a content duplication |
| `/experiences` page ↔ `/travel-inspiration` page | Same `EditorialCardGrid` component, similar "feeling, not itinerary" framing, different query namespaces | Low-Medium | **Already assessed and accepted by R1.2-007** — not a homepage-level issue since `/experiences` isn't linked from the homepage today |
| Destinations, Traveller Stories, Travel Inspiration card sections | Same visual card pattern (image, eyebrow/region, heading, copy, link) reused across three sections | None — this is a strength | **Design-system consistency, not duplication** — see Section 6 |

---

## 6. Homepage Narrative Flow

**Hero + Mood Cards → Featured Destinations → Trust Points → Traveller Stories → Trust Strip → Travel Inspiration → About/Promise Preview → Contact Preview → Footer.**

Read start to finish as a first-time visitor, the sequence resolves cleanly against the project's own "Traveller Decision Journey" framing (Section 2's purpose map): *feel → where → why-trust-stated → who-else-did-this → why-trust-proven → what-else-to-imagine → who-we-are → let's-talk → everything-else*. Every transition either has direct evidence of working well (Sri's two independent validations, R1.2-006 and R1.2-012, both rated Homepage Flow 9/10) or is a low-risk, logically-ordered pairing this review did not find reason to challenge.

The one structural repetition worth naming plainly (not a defect, a pacing observation for Sophie/Tiger's awareness): the page asks the visitor to trust it **twice by explicit section** (Trust Points, then Trust Strip) before it asks them to imagine anything else (Travel Inspiration) or hear who's behind it (About/Promise Preview). This is defensible — the two sections do genuinely different jobs, and Sri's traveller-facing reviews never flagged pacing as an issue — but it is the one place in the page's rhythm where a Product Owner might reasonably ask whether the story needs two separate "trust" beats this close together, or whether one could eventually be tightened. This is filed as an Improve-tier, non-blocking observation (Section 8), not a Merge recommendation — merging Trust Points and Trust Strip would combine a qualitative statement section and a quantitative stats strip that currently work well as their own distinct visual patterns, and this review found no evidence that combining them would improve anything rather than just shorten the page.

The homepage's reused card pattern (image + eyebrow + heading + short copy + link) across Destinations, Traveller Stories and Travel Inspiration is a genuine strength: it means a returning visitor's eye already knows how to read a new section by the third time they see the pattern, which supports the brand's "warm, clear, reassuring" principle without needing three different visual languages.

---

## 7. Business Impact Assessment

- **Simplification delivered by Workstream 2 holds up under this independent re-review.** The homepage is measurably more focused than its pre-WS2 state (no duplicated "pick a feeling" ask), and this review's own independent code inspection corroborates every material claim in the WS2 chain rather than merely repeating it.
- **No revenue-relevant or conversion-relevant defect was found.** The one CTA-routing gap (Section 3.9 — Contact Preview never linking to `/contact`) is real but low-impact, since the section already provides three direct contact channels (WhatsApp/Phone/Email) and the primary CTA routes to the actual lead-capture flow (Journey Passport), which is arguably the more valuable destination anyway.
- **SEO posture is currently carried almost entirely by content-rich sections** (Destinations' 8 named places, Traveller Stories' dated/named quotes, Travel Inspiration's themed copy) rather than by any sitemap/schema infrastructure, which — as R1.2-007 already found and this review reconfirms — does not exist in this codebase today (no `sitemap.ts`, `robots.ts`, and no `AggregateRating` schema despite a strong Trust Strip candidate for one). This is a pre-existing, cross-cutting gap, not something Workstream 2 or this review caused.
- **The `/experiences` orphan-page risk (R1.2-007's RISK-E) remains open** and is now slightly more evidenced by this review: zero internal inlinks confirmed directly (Header, Homepage, Footer all checked and confirmed clear of `/experiences` links), same conclusion R1.2-007 reached, now independently re-verified rather than assumed.

---

## 8. Prioritized Recommendations

1. **(P1 — Product decision, not implementation) Confirm Contact Preview's CTA routing is intentional.** Vivek/Tiger to confirm whether the homepage's closing CTA section should route to `/contact` in addition to, or instead of, `/journey-passport`-only. See Section 3.9.
2. **(P2 — Tiger/Vivek, documentation) Resolve this EBC's own numbering conflict with the tracker's real Workstream 3.** See Section 0.1(a). Recommend assigning this card a proper sequential EBC number consistent with the tracker's convention (last closed at R1.2-013) before it is filed as a permanent project record.
3. **(P2 — awareness only, no action recommended) Note the Trust Points / Trust Strip pacing observation** (Section 6) for Sophie's awareness during any future homepage visual-hierarchy pass; not a standalone action item.
4. **(P3 — Future Recommendation, out of this EBC's scope) Consider `AggregateRating` schema.org markup for the Trust Strip's Google Reviews data**, once/if sitemap and structured-data infrastructure is scoped as a future release item (this gap already exists independent of this review, per R1.2-007).
5. **(P3 — Future Recommendation, tracked already) If Product revisits Experiences in a future release**, treat it as covering the two concepts (Global Escapes, Nature & Serenity) with no other homepage-adjacent path today, rather than restoring the old placement verbatim. See Section 4.5. This is not a recommendation to act now.
6. **(P3 — carried forward, unresolved, not new) `/experiences` remains an internally orphaned page.** Still open from R1.2-007's RISK-E; independently reconfirmed by this review, not a new finding.

None of these are release-blocking. Items 1 and 2 are the only ones this review considers worth a specific decision from Vivek/Tiger before this card is closed out.

---

## 9. Risks

| ID | Category | Description | Severity |
|---|---|---|---|
| RISK-WS3A | Documentation/Process | This EBC's "Workstream 3" label conflicts with the tracker's actual Workstream 3 (Destination Intelligence), risking future confusion if filed without correction | Low-Medium |
| RISK-WS3B | Product/Scope | The EBC's own Scope of Review list describes a pre-WS2 homepage (includes "Experiences" as a live section); anyone reading only the EBC card without this review could be misled about current state | Low (mitigated by this review) |
| RISK-WS3C | Conversion | Contact Preview's CTA does not route to `/contact`; low-severity but real gap between the section's framing ("we are here") and its actual link target | Low |
| RISK-WS3D | SEO (carried forward, not new) | `/experiences` remains internally orphaned; no sitemap/robots infrastructure exists site-wide | Low |
| RISK-WS3E | Product | No new risk identified regarding the Experiences retirement itself — re-confirms R1.2-007/012's prior risk assessment holds | None (informational) |

---

## 10. Assumptions

- **Assumption:** The device-bridge snapshot of the repository (branch `feature/ebcr1.2-003-trust-strip-visual-refresh`, confirmed clean except two pre-existing untracked items) reflects the actual current state of Release 1.2's homepage work; no newer, uncommitted local changes were hidden from this review's read access.
- **Assumption:** "Footer & Final CTA," as worded in this EBC's Scope of Review, was intended to cover both the Contact Preview section and the Footer itself, since the EBC's list has no separate line item for Contact Preview. This review addressed both explicitly rather than guessing which one was meant.
- **Assumption:** This EBC's Special Focus questions on Experiences were intended to be answered against the *current, already-retired* state, not as an instruction to treat Experiences as if it were still live. Section 0.1(b) states the reasoning; Section 4 answers accordingly.
- **Inferred, not confirmed:** that Tiger/Vivek want this analysis even though it substantially overlaps with the already-closed Workstream 2 chain — proceeded on the basis that the EBC was explicitly issued and marked "Ready for Analysis," and that independent re-verification (rather than simply trusting the prior chain) has its own value, which this review tried to demonstrate by re-deriving every claim from the live code rather than citing the prior EBCs alone.

---

## 11. Open Questions for Business Review

1. **(Tiger/Vivek)** Should this EBC be renumbered to avoid conflicting with the tracker's real Workstream 3 (Destination Intelligence)? See Section 0.1(a) and RISK-WS3A.
2. **(Vivek)** Is Contact Preview's CTA-to-`/journey-passport`-only (not `/contact`) an intentional design decision? See Section 3.9 and Recommendation 1.
3. **(Tiger, documentation housekeeping, not urgent)** `docs/04-UX/HOMEPAGE-INFORMATION-ARCHITECTURE.md`, `docs/07-Design/BLUEPRINTS/HOMEPAGE-BLUEPRINT.md` and `docs/02-Product/INFORMATION-ARCHITECTURE.md` all describe an earlier-stage homepage/IA concept (Smart Trip Search, Travel Collections, Blogs, Newsletter, an Announcement Bar, a different primary nav) that does not match the implemented product. None of this blocked this review — I treated all three as historical context, not current-state fact — but they could mislead a future reader (human or AI) who opens them without also checking the live code. Worth a documentation-currency pass at some point; not proposed as part of this EBC's scope.
4. **(Vivek, forward-looking only, no action needed now)** If Experiences is ever revisited in a future release, should it specifically target the Global Escapes / Nature & Serenity gap (Section 4.5) rather than a general reintroduction? Filed for whenever that future release is scoped, not for this EBC.

---

## 12. Acceptance Criteria Mapping

- ✔ Every homepage section reviewed — 10 sections covered (Header, Hero+Mood Cards, Destinations, Trust Points, Traveller Stories, Trust Strip, Travel Inspiration, About/Promise Preview, Contact Preview, Footer), including 3 the EBC's own list omitted (Section 0.1).
- ✔ Every recommendation supported with rationale — Section 8, each item traceable to its originating section.
- ✔ Clear recommendation for the future of the Experiences section — Section 4.6: no change recommended; retirement re-confirmed sound; forward-reuse framing provided for if/when Product revisits it.
- ✔ Actionable inputs for WS3 implementation planning — with the caveat in Section 0.1(a) that this review does not itself constitute the tracker's Workstream 3 (Destination Intelligence); its actionable inputs (Section 8) are homepage-IA-specific, not destination-mapping-specific, and should be sequenced by Tiger accordingly.
- ✔ Ready for Tiger-led review with Vivek — this document is complete and analysis-only; no code, design or configuration was changed.
