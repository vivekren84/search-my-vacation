# Search My Vacation — Release 1 Brand Audit

Canonical sources:

- `SearchMyVacation_BrandManual_Phase1_Edition2.pdf`
- `SearchMyVacation_AssetPackage.zip`
- Supplied official PNG icon mark, horizontal lockups, favicon, app icon, Open Graph image and email signature logo

## Release surface checklist

- ✓ Header — official supplied web-header lockups, shared navigation and responsive sizing
- ✓ Footer — official transparent horizontal lockup and exact approved tagline: `More than a trip. It's an experience.`
- ✓ Logo — all renderable application references use `/brand/official/`; 21 repository assets byte-match the supplied package
- ✓ Favicon — official ICO/PNG set, Apple touch icon and manifest icons
- ✓ Passport — previously approved Passport stamp restored from the preserved 640×640 master; all seven chapters remain in one flow
- ✓ Journey Director — official compact lockup, the same approved Passport stamp, Brand Manual palette/type roles and governed recommendation flow
- ✓ About Us — approved company introduction inserted exactly without a layout redesign
- ✓ Contact — shared header/footer, palette, typography, spacing and CTA treatment
- ✓ Destinations — shared public shell, official brand system, responsive itinerary modal and verified destination-to-Passport context
- ✓ Experiences — experience cards pass a lightweight editable Journey Entry Context
- ✓ Inspiration — eligible cards pass governed context; unmatched ideas start the standard Passport
- ✓ Itinerary watermark — repeated official transparent icon marks span the complete itinerary behind content at 3.2% opacity; no text fragments, cropping, distortion or recolouring
- ✓ Emails — official email signature logo and Espresso/Cream/Crimson styling

## Journey Entry Context

- ✓ `Plan My Experience` starts with no pre-selected answer
- ✓ All six approved experiences map to an existing Passport answer
- ✓ All five moods map to an existing Passport answer
- ✓ Mountains, Beaches, Wildlife, Romance and Relaxation have governed inspiration mappings
- ✓ All 28 public destination cards carry their verified title into the Passport and derive a Journey Theme from the existing destination category label
- ✓ Beaches, Wildlife, Heritage, Islands, Hill Stations, Spiritual and Cities resolve to governed editable Journey Themes
- ✓ Kashmir defaults to `Yes`, carries `Kashmir` into the editable destination field and pre-selects `Mountain Retreat`
- ✓ Unknown destination query values are ignored rather than pre-populated
- ✓ Exact advisory copy appears only on the relevant Passport chapter
- ✓ Pre-selected single-choice, timing and multi-choice answers remain editable and deselectable
- ✓ No chapter is skipped and no answer is locked
- ✓ Entry context survives Passport snapshot, lead validation and Journey Director boundaries

## Sprint A refinements — EBC-014B

- ✓ Restored the approved Passport-style stamp in Passport issuance and Journey Director
- ✓ Removed the remaining logo-based Passport stamp without changing header, footer or itinerary branding
- ✓ Destination modal calls-to-action pass a governed destination ID into the Passport
- ✓ Destination entries begin at Welcome; no Passport page is skipped
- ✓ Destination, Experience, Mood and standard entry paths preserve editable answers
- ✓ Destination `Yes` / `Surprise Me` behaviour and editable destination text are complete

## Production pipeline

Local production-runtime QA reference: `SMV-EBCQA285`.

Validated lifecycle:

1. `passport_issued`
2. `lead_saved`
3. `notification_sent`
4. `journey_director_entered`

RC1 production validation reference: `SMV-RCQA8426`.

The six required Supabase/Resend variables are configured in Vercel Development, Preview and Production. The RC1 deployment is `Ready`; all 17 pages, including both legal pages, built successfully. Supabase stored the synthetic lead and all four lifecycle events, and Resend reported the notification as delivered. EBC-014B remains intentionally local and has not been redeployed.

## Legacy asset controls

- ✓ Application source references official assets plus the explicitly approved `/brand/master/smv-passport-stamp-master.png` exception
- ✓ Historical assets are preserved to avoid deleting existing work
- ✓ Historical logo directories and old favicon URLs permanently redirect to approved supplied assets
- ✓ The approved Passport stamp master is served directly; the legacy horizontal-logo master still redirects to an official supplied lockup
- ✓ No recreated logo, icon, watermark or Passport stamp can render on a public application surface

## Automated validation

- ✓ ESLint
- ✓ TypeScript and Next.js production build (17 static pages/routes generated)
- ✓ 95 Journey Passport lead checks, including destination-context contract validation
- ✓ 360 Journey Director engine and entry-context checks, including all 28 public destinations, Experience/Mood entry sequencing, category mappings and neutral direct entry
- ✓ 37 presentation checks
- ✓ 49 runtime-catalogue checks
- ✓ 59 recommendation-orchestration checks
- ✓ 152 Journey Director runtime checks
- ✓ 16 required journey scenarios / 30 traveller-experience combinations
- ✓ 49 governed itinerary records and 36 matching scenarios
- ✓ 28 public destination cards / 13 broad destinations
- ✓ All 12 public routes return HTTP 200 from the local production server
- ✓ Official logo, icon, favicon, Open Graph and email assets return the correct MIME types
- ✓ 21 copied official assets byte-match the canonical asset package
- ✓ Legacy public logo routes return permanent redirects while the approved Passport stamp returns PNG directly

## Responsive review

- ✓ Responsive CSS and layout breakpoints compile for mobile, tablet and desktop
- ✓ Public pages and assets render successfully from the local production server
- Pending — visual desktop/tablet/mobile sign-off and Chrome/Safari/Firefox screenshots. The controlled browser's mandatory administrator security check did not grant localhost access, and no alternate browser-control surface was used to bypass it.

## Remaining blockers

1. Browser-policy access must be restored before desktop/tablet/mobile and Chrome/Safari/Firefox visual sign-off can be completed.
2. The current Release 1 data contract collects name and phone only. EBC-014A mentions continuing name, email and phone “as today,” but no traveller-email field, API contract or database column currently exists. Adding one requires an explicit owner decision and a scoped schema change.
