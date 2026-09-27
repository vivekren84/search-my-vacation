# EBC-R1.3-WS13-004A — Architecture Clarification Note: Replacement Journey Mapping & Documentation Alignment

**Persona:** Archie (She), Solution Architect
**Prepared by (card):** Tiger
**Release / Workstream:** 1.3 / WS13, Journey Workspace
**Date:** 27 September 2026
**Type:** Clarification and documentation alignment only. **No redesign, no new architecture decision, no Product or UX change.**
**Inputs (fixed):** PD-A to PD-E (this card, §3); `EBC-R1.3-WS13-001` Revision 3 (POD-01 to POD-08); `EBC-R1.3-WS13-003` (AD-WS13-001 to 007); `EBC-R1.3-WS13-003A`; `EBC-R1.3-WS13-004` (Rad's Engineering Plan, §2.4 deltas and condition C2).
**Status:** **Complete. Recommendation: WS13-005 may begin** (§8).

---

## 0. Workspace Readiness Check

| Check | Result |
|---|---|
| Repository | `/Users/viveksophu/Documents/Projects/SearchMyVacation`, connected |
| Branch / last commit | `main` / `20cc249` |
| Working tree | Uncommitted WS13 documentation from Arjun, Sophie, Archie, Rad and Tiger (Rad's GO-01). None was touched by this card except the architecture files listed in §6. |
| Git commands | Read-only, run with `--no-optional-locks` so no `.git/index.lock` can be left behind (the lesson from WS13-003) |
| Code, schema or migration changes | None |
| Commit / push | None |

---

## 1. Summary

All seven clarification items map onto **data structures that already exist, or that are already planned in AD-WS13-001 to 007 and Rad's M01–M14 migration list**. **No new table, column, status value or audit event type is needed.** Every mapping lands in one of two places:

- **At material-change start**, the planned RPC `workspace_journey_start_material_change` (M14) creates the replacement planning record. It pre-fills:
  - the planning fields (AC-07);
  - the proposal as Version 1 (AC-02);
  - internal notes (AC-04);
  - vendor quotation baselines (AC-05).
- **At replacement conversion**, the replacement branch of conversion RPC v2 (M10) copies:
  - the Primary Operational Contact (AC-03);
  - Journey Documents, with a verification reset (AC-06).

  The Decision dialog pre-fills dates from the original Journey (AC-01).

Two findings need Product awareness. Neither blocks WS13-005.

1. **[F] The proposal itinerary snapshot has no structured accommodation, transport or activity fields.** They exist only as free-text `inclusions` and `notes` (`web/lib/workspace/journey-planning/types.ts:192`). AC-02 therefore carries them as they are, as free text. Nothing is remodelled.
2. **PD-B and PD-D are not yet written into the Product documents** (WS13-001 Revision 3). Arjun should record them (§7, O-A1).

---

## 2. Repository Evidence Used

| Fact **[F]** | Source |
|---|---|
| The planning record has no exact-date, contact, preference or document fields. Trip basics are `adults`, `children`, `infants`, `intended_travel_month` (`YYYY-MM`), `nights`, `preferred_departure_city`; plus `destination_region`, `title`, `origin_channel`, `record_kind`, party. | `supabase/migrations/20260921070200_…records.sql`, `20260922090000_…trip_basics.sql`, `20260922080000_…origin_channel.sql` |
| Proposal header (one per planning record) plus immutable versions `(proposal_id, version_number, itinerary_snapshot jsonb, summary, created_by_user_id)`. No proposal status column. | `20260921070400_workspace_proposals_and_versions.sql` |
| `ItinerarySnapshot` = `destinations[{name, nights, notes}]`, `startDate`, `endDate`, `travellerCount`, `priceEstimate{amount,currency}`, `inclusions string[]`, `notes` | `web/lib/workspace/journey-planning/types.ts:181–200` |
| Planning activities: `activity_type` ∈ `discovery_note`, `internal_comment`, `vendor_contact_log`. Append-only. | `20260921070500_workspace_planning_activities.sql` |
| Vendor quotations: `vendor_id` (FK), `quotation_amount` (nullable), `currency`, `notes`, `status` ∈ `requested`/`received`/`accepted`/`rejected`, **default `requested`**. A separate table from bookings. | same migration |
| There is no gate requiring a new proposal version before moving to `proposal_shared` | `journey-planning/validation.ts`, `service.ts:386` |
| Planned Journey objects: `workspace_journey_operational_contacts`, `workspace_journey_documents`, `workspace_journey_activities` (kind `note`), `workspace_journey_vendor_bookings` (`service_type`, `status`), `accepted_proposal_version_id` on the Journey | WS13-003 AD-WS13-001; WS13-004 §6.2 (M07, M08) |

---

## 3. Fixed Inputs (Product Owner decisions)

| ID | Decision | Architectural reading |
|---|---|---|
| PD-A | Conversion requires owner, Service Category, Number of Nights and Confirmed Dates, all present and consistent. Otherwise conversion is blocked. | Conversion v2 checks 6–9 (WS13-004 §6.3). **Null nights blocks** ("nights required"). This settles Rad's ENG-OBS-02. |
| PD-B | Replacement Journeys inherit the approved operational context from the original Journey | Implemented by AC-01 to AC-07 below |
| PD-C | Legacy Journeys without a Service Category stay unclassified until explicitly classified | `workspace_journeys.service_category` stays **nullable for `adoption_status = 'legacy_pending'`**. It is required only for adopted and new Journeys. There is no default value and no backfill. |
| PD-D | Vendor Code `VEN-XXXXX`, system-generated, immutable | Replaces Rad's `VND-0001` default (ENG-OBS-04). See §5.3. |
| PD-E | Journey unarchive is out of Release 1.3 | No unarchive RPC or route. Confirms POD-08. |

---

## 4. Technical Mapping: AC-01 to AC-07

Legend: **Where** = the planned object that performs the mapping. **Schema change** = anything beyond what WS13-003 and WS13-004 already plan.

### AC-01: Travel Dates

| Aspect | Mapping |
|---|---|
| Confirmed | **Retain the current data model.** Journey Planning keeps no exact-date field (FR-JP-36 / BR-024, refined by D-02). Confirmed dates live **only on the Journey**, written by conversion v2 from its parameters (AD-WS13-003). |
| Pre-population | When the planning record has `replaces_journey_id`, the JP detail read (WS13-004 §8.1, `GET …/journey-planning/[recordId]`) also returns the **original Journey's `confirmed_start_date`, `confirmed_end_date` and `nights`**, read through the replacement relationship. The Decision dialog uses them as **editable defaults** labelled "from JRN-…". |
| Also pre-filled at material-change start | `intended_travel_month` = the original start date formatted `YYYY-MM`; `nights` = the original Journey's `nights` (AC-07) |
| Validation | Unchanged. PD-A applies to the values the user submits. If the material change is a change of dates or nights, the pre-filled dates will **correctly** fail the dates–nights check until the user corrects them. There is no auto-correction (POD-06 Policy 2). |
| Where | M10 / WP-0.11 (JP read and Decision dialog); M14 (month and nights pre-fill) |
| Schema change | **None** |

### AC-02: Accommodation, Transport and Activities → Proposal Version 1

| Aspect | Mapping |
|---|---|
| Confirmed | `workspace_journey_start_material_change` creates the replacement planning record's `workspace_proposals` header and **`workspace_proposal_versions` row `version_number = 1`**. Its `itinerary_snapshot` is a **verbatim copy** of the original Journey's accepted snapshot (via `accepted_proposal_version_id`). `current_version_id` points to it. |
| Why this is not duplicate modelling | The snapshot is already the immutable, self-contained itinerary record (`DEC-R1.3-014`). Copying it into a new version row is exactly how every revision is stored today. No itinerary, accommodation, transport or activity entity is introduced. |
| Content reality **[F]** | Accommodation, transport and activities exist **only as free text** in `inclusions[]`, `destinations[].notes` and `notes`. They are carried as they are. Structured modelling belongs to Itinerary Studio (WS15) and is not in scope. |
| Provenance | `summary` = "Baseline carried from JRN-#### (accepted version vN). Revise before sharing." Audit event `proposal_version_created` on the planning record, with `event_data` holding `source_journey_id` and `source_proposal_version_id` (existing event type). |
| Carried values to note | `startDate`/`endDate`, `travellerCount` and `priceEstimate` inside the snapshot are the **original's** values. They are a historical baseline, not the new commercial offer. |
| Original immutability | The original version row is only read. The new row is a copy. |
| Where | M14 (RPC scope grows; see §5.1) |
| Schema change | **None** |

### AC-03: Primary Operational Contact

| Aspect | Mapping |
|---|---|
| Confirmed | **Copied only at replacement conversion.** In the replacement branch of conversion v2 (`replaces_journey_id IS NOT NULL`), the new Journey's primary contact is **copied from the original Journey's current primary contact** (type, name, organisation, phone, email) **instead of** being initialised from the party (I-04). Non-replacement conversions keep I-04. |
| Why at conversion | Journey Planning has no contact object and none is introduced. The original's contact may be edited while it is On Hold, so copying at conversion takes the latest value. |
| Audit | `journey_contact_changed` is not used. Creation is covered by `journey_created`, whose `event_data` records `contact_source: 'original_journey'` (or `'party'`). |
| Where | M10 (conversion v2 replacement branch) |
| Schema change | **None** |

### AC-04: Operational and Internal Notes

| Aspect | Mapping |
|---|---|
| Confirmed | At material-change start, each **Operational Note** on the original Journey (`workspace_journey_activities`, kind `note`, including corrections) is copied as one `workspace_planning_activities` row with `activity_type = 'internal_comment'` on the replacement planning record, in chronological order. `author_user_id` = the acting user (the table requires a Workspace User). The **original author and date are stated in the content header**: "Carried from JRN-#### · note by <name>, <date>: …". The material-change reason is also written as the first `internal_comment`. |
| Immutability | The original's notes are only read. The planning activity table is append-only (no update or delete policy). The carried copies cannot alter the source. |
| Not carried (the context stays on the original, one link away) | Communications log, vendor coordination entries, Change Records, tasks and History. These are the original's operational record and remain readable on the Superseded Journey, which is linked from the replacement record banner. |
| Where | M14 |
| Schema change | **None**. The existing `internal_comment` type is used. |

### AC-05: Vendor Bookings → Quotation Baseline

**Recommended implementation:** create **Vendor Quotation baseline rows**, never bookings, in the replacement planning record, at material-change start.

| Aspect | Recommendation |
|---|---|
| Source | Original Journey Vendor Bookings with `status = 'booked'` (PD wording "booked vendors") |
| Target | One `workspace_vendor_quotations` row **per source booking**: `vendor_id` = the booking's vendor; `status` = **`requested`** (the table's existing default and the normal starting status of every quotation recorded in Journey Planning today); `quotation_amount` / `currency` = **NULL** (bookings hold no commercial amount; no value is invented); `notes` = "Baseline from JRN-#### · <service type> · <service dates> · booking ref <ref> (Booked). Re-quote for the replacement plan." |
| Why this keeps quotations and bookings distinct | They remain **two tables with two lifecycles** (BR-011; D-07). No row is shared, no booking is copied as a booking, and the original bookings stay untouched on the Superseded Journey. The replacement Journey starts with **no bookings**, and new bookings are created in the normal Draft state after conversion. |
| Traceability | Audit `vendor_quotation_recorded` on the planning record, with `event_data` holding `source_journey_id`, `source_booking_id` and `baseline: true` (existing event type) |
| Inactive vendors | **Recommended default:** skip bookings whose vendor is now `inactive` (a quotation should not be sought from an inactive vendor) and list the skipped vendors in the carried `internal_comment`. For Product Owner confirmation (O-A2). |
| Confirmed-but-not-Booked bookings | Not included, following the wording "booked vendors". If the Product Owner also wants bookings in Confirmed status, add them to the status filter. This is a one-value change (O-A3). |
| Alternative considered | A new quotation status such as `baseline`. **Rejected:** it needs a CHECK change and UI handling for no functional gain, since provenance is already captured in the notes and the audit. |
| Where | M14 |
| Schema change | **None** |

### AC-06: Journey Documents

| Aspect | Mapping |
|---|---|
| Confirmed | **Copied only at replacement conversion**, in the conversion v2 replacement branch. Each of the original's `workspace_journey_documents` rows becomes a new row on the replacement Journey: Document Type, traveller(s), external reference, external link and notes, plus a provenance line in notes ("Carried from JRN-####"). Rows are copied, never moved or re-parented, so the original stays intact. |
| **Verification state (recommended)** | Status assertions that were made **for the original Journey** are reset so they are checked again for the new one. **Verified → Received** ("valid for this Journey" must be confirmed again, because the trip may have changed). **Not Applicable → Outstanding**, with the previous N/A reason kept in notes (an N/A such as "no visa needed" may not hold after a destination change, and N/A counts as resolved for the readiness gate). **Received** and **Outstanding** are unchanged. This prevents false readiness. It needs no new status, because Verified and N/A are simply re-set by the owner. **For Product Owner confirmation (O-A4); architecture supports either outcome.** |
| Sensitive data | External references are copied server-side inside the RPC. They are **not** written into audit `event_data` (WS13-003 §4.9). Audit logs `document_added` per row with `carried_from_document_id` only. |
| Interaction with the Readiness Template | The template is assigned later (Start preparation). **Template derivation must not create a duplicate Journey Document** where one of the same Document Type and traveller already exists. It links the existing row instead. This is an engineering rule inside `…_assign_template`, within AD-WS13-002 and 006. |
| Where | M10 (conversion v2); M11 (`…_assign_template` dedupe rule) |
| Schema change | **None** |

### AC-07: "Traveller Preferences"

**Finding [F]:** **no dedicated preference object exists** in Product, Architecture or the repository. Budget and exact travel date are permanently excluded from Journey Planning (FR-JP-32/36; BR-020/024). "Preferences" corresponds to these existing fields.

| Existing field (planning record) | Meaning | Replacement pre-fill source (M14) |
|---|---|---|
| `adults`, `children`, `infants` | Travelling party composition | Original Journey (carried trip parameters) |
| `nights` | Intended duration | Original Journey |
| `intended_travel_month` | Approximate timing | Original `confirmed_start_date` as `YYYY-MM` |
| `preferred_departure_city` | Departure preference | Original Journey `departure_city` |
| `destination_region` | Destination preference | Original Journey |
| `service_category` (POD-07, planned in M10) | Experience classification | Original Journey (PD-B; settles Rad's ENG-OBS-05) |
| Party (`record_kind`, `traveller_id` / `corporate_contact_id`) | Who is travelling / coordinating | Original Journey (BR-034, immutable) |
| Free-text preferences | Captured today as **Discovery Notes** (`workspace_planning_activities`, `discovery_note`) on the original planning record | Not copied. They remain on the original planning record, reachable through the Journey ↔ planning-record link chain. |

The **material field that is changing** (for example, new dates, nights or travellers) is edited by the user in the pre-filled record. POD-06 Policy 3 defaults (Existing Traveller, Lead Created, owner inherited, auto-title) are unchanged. **No new data model is introduced.**

---

## 5. Engineering Impact Assessment

### 5.1 Effect on Rad's plan (WS13-004)

| Item | Change | Size effect |
|---|---|---|
| M14 `workspace_journey_start_material_change` (WP-4.1) | Adds, in the same transaction: proposal header plus Version 1 copy (AC-02), `internal_comment` copies (AC-04), quotation baselines (AC-05), pre-fill of trip parameters, Service Category and month (AC-01, AC-07) | **S → M** |
| M10 conversion v2, replacement branch (WP-0.10) | Adds contact copy (AC-03) and document copy with the verification reset (AC-06). The documents table exists from M08, in the same P0 batch. | Small addition within L |
| WP-0.11 / WP-4.2 (JP read and Decision dialog) | JP detail returns the original Journey's dates and nights. The dialog shows them as editable defaults. | XS |
| M11 `…_assign_template` (WP-1.1) | Dedupe rule for existing Journey Documents | XS |
| M06 vendors (WP-0.6) | Vendor Code format `VEN-XXXXX` (§5.3) | None |
| M07 journeys | `service_category` nullable when `legacy_pending` (PD-C) | None |
| P3 archive | No unarchive (already Rad's delta D-03) | None |
| New tables, columns, statuses, event types | **None** | — |

**Cross-aggregate write, disclosed:** `…_start_material_change` writes Journey Planning tables (planning record, proposal, version, activities, quotations) in one transaction. This mirrors the sanctioned conversion RPC, which writes Journey tables. It is the **second, and last, sanctioned cross-aggregate transactional function** (AD-WS13-002/003 pattern). No application `repository.ts` crosses the module boundary.

### 5.2 Test implications (for Rad and Keerthi)

- Material-change start creates: the record with the POD-06 defaults; the pre-filled fields; Version 1 whose snapshot equals the original's; notes in order with headers; one quotation per Booked booking; inactive vendors skipped and listed.
- The original Journey is unchanged except for the On Hold flag and reason. Row counts and content are compared before and after.
- Replacement conversion: contact equals the original's latest contact; documents are copied with Verified→Received and N/A→Outstanding; no document values appear in audit.
- Pre-filled dates plus an unchanged nights value on a date-change scenario gives a dates–nights block.
- Template assignment after conversion creates no duplicate Journey Documents.

### 5.3 Vendor Code (PD-D)

`vendor_code text not null unique`, default `'VEN-' || lpad(nextval('workspace_vendor_code_seq')::text, 5, '0')`, which produces `VEN-00001`. A trigger rejects updates, so the code is immutable. Internal FKs keep using `id` (POD-05). **[A]** "XXXXX" means five digits. If alphanumeric is intended, only the default expression changes. Beyond 99,999 vendors, `lpad` does not truncate, so codes grow to six digits and uniqueness is kept.

---

## 6. Architecture Documentation Aligned

All changes are additive, following the supersede-not-delete convention. No earlier text was rewritten.

| Document | Alignment added |
|---|---|
| `docs/09-Development/EBC-R1.3-WS13-003-ARCHIE-…-Architecture-Validation-and-Solution-Alignment.md` | New **§15 "Revision Note: alignment with POD-01–08 and PD-A–E (WS13-004A)"**. It states: PD-ARC-02 **superseded by POD-06 Policy 2 (block)** and PD-A (nights required); PD-ARC-01/03/04 settled by POD-06/POD-08; **`…_unarchive` withdrawn** from AD-WS13-002, §8.1 and Phase 3 (POD-08, PD-E); Service Category model (PD-C); Vendor baseline and Vendor Code (POD-05, PD-D); Change Category; Journey Document and Vendor Booking `service_type` naming; the replacement mappings (this note). |
| `docs/20-Architecture/workspace/WORKSPACE-ARCHITECTURAL-DECISIONS.md` | New §8.1: the alignment table against AD-WS13-001–007. **No new AD.** |
| `docs/20-Architecture/workspace/WORKSPACE-DATA-ARCHITECTURE.md` | New §10.1: `service_category` (planning record nullable; Journey required except `legacy_pending`); `workspace_journey_documents` replaces "document requirements"; `change_category` on change records; bookings `service_type`; vendor baseline attributes and `vendor_code`; no unarchive |
| `docs/20-Architecture/workspace/WORKSPACE-DOMAIN-MODEL.md` | New §7.1: Service Category attribute; Journey Document; Archived = read-only with no restoration in Release 1.3; the replacement Journey's inherited context (§4) |
| `docs/20-Architecture/workspace/WORKSPACE-INTEGRATION-ARCHITECTURE.md` | New §8.1: the Journey Planning ↔ Journey Workspace replacement contract (what is carried at start and what at conversion) |

---

## 7. Observations and Dependencies (no decision taken here)

| ID | Observation | Owner | Blocking? |
|---|---|---|---|
| **O-A1** | PD-B (replacement inheritance) and PD-D (Vendor Code `VEN-XXXXX`) are not yet recorded in WS13-001 Revision 3 or Spec v2.0 §20. PD-A's "Number of Nights required" and PD-C are also implicit only. | Arjun (Product sync), Tiger | No |
| **O-A2** | Quotation baseline skips vendors that are now Inactive (recommended default) | Product Owner confirm | No (default applies) |
| **O-A3** | Baseline from **Booked** bookings only; Confirmed bookings excluded | Product Owner confirm | No |
| **O-A4** | Document verification reset on carry: Verified → Received; N/A → Outstanding | Product Owner confirm | No (default applies; P0 build) |
| **O-A5** | The carried Version 1 could be moved to Proposal Shared without revision, because Journey Planning has no revision gate. This would share the original itinerary and price estimate again. | Arjun / Product Owner: a process note or a future rule. Architecture introduces no gate. | No |
| **O-A6** | UX addendum items for Sophie: Decision dialog default dates labelled "from JRN-…"; provenance labels on the carried proposal, notes, quotations and documents; the Documents tab shows "Carried from JRN-…, re-verify" | Sophie (joins UXA-01/UXA-04 in WS13-004 §9.3) | Only for P0 dialog copy and P4 |
| **O-A7** | Rad's ENG-OBS-02 (null nights) and ENG-OBS-05 (replacement pre-fill) are settled by PD-A and PD-B as mapped above. ENG-OBS-04 is settled by PD-D. | Rad (note) | No |

**Closure (27 September 2026).** O-A2 to O-A5 have been resolved by the Product Owner and are recorded in Tiger's governance acceptance of this note. They are to be recorded canonically in the Product baseline (WS13-001) by Arjun, alongside PD-B and PD-D. The architectural defaults in §4 were accepted as written. No architectural redesign, new decision or change to the mappings resulted. O-A1 and O-A6 are handed to Arjun and Sophie respectively. O-A7 is informational. **EBC-R1.3-WS13-004A is Accepted and Closed.**

---

## 8. Confirmations and Recommendation

| Confirmation | Status |
|---|---|
| No architectural redesign required | ✅ Every mapping uses existing or already-planned structures. No new AD, table, column, status value or audit event type. |
| No Product decision changed | ✅ PD-A to PD-E and POD-01 to POD-08 are applied as given. Open defaults are listed as observations (§7). |
| No UX decision changed | ✅ Only labelling needs for Sophie's addendum (O-A6) |
| No code, migration or database change; no commit or push | ✅ |

**Recommendation to Tiger: WS13-005 may begin.** This note satisfies **Rad's condition C2** (architecture aligned with the post-architecture Product decisions). P-A (CM-03) can start at once. P0 still needs Rad's remaining conditions C1 (ratification of AD-WS13-001–007 recorded), C3 (Sophie addenda, now including O-A6), C4 (environment topology), C5 (clean feature branch) and C6 (time zone). The O-A2 to O-A4 defaults may be confirmed during P0 without blocking it.

---

*Prepared by Archie, Solution Architect, on behalf of Team Satvi, per EBC-R1.3-WS13-004A. Clarification only; handed to Tiger for validation; not self-approved.*
