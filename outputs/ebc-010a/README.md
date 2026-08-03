# SMV Journey Itinerary Knowledge Base v1

This folder contains the master business-maintained workbook for Search My Vacation destination itinerary knowledge:

- `SMV-Journey-Itinerary-Knowledge-Base-v1.xlsx`

The workbook is designed for non-technical users. It stores suggested destination journeys that can later be consumed by the Journey Director engine.

## Workbook structure

### `README`

Explains the purpose, destination-creation workflow, naming convention, mandatory and optional fields, maintenance practices, workbook controls, print guidance, and Search My Vacation customisation philosophy.

### `INDEX`

The destination register with these columns:

| Destination | Region | Sheet Name | Duration | Status | Last Updated | Notes |
|---|---|---|---|---|---|---|

It contains one example row for Munnar. The `Sheet Name` cell exactly matches the completed sample tab. The `Status` column uses the controlled values `Draft`, `Review`, `Approved`, and `Archived`.

For each future destination, add one row and make `Sheet Name` exactly match the corresponding worksheet tab.

### `TEMPLATE`

The blank, formatted master template. Duplicate it before adding destination content; do not type directly into the original template.

It contains:

- Section A — Journey Summary
- Section B — Highlights (maximum eight)
- Section C — Suggested Day-by-Day Journey
- Section D — Package Normally Includes
- Section E — Normally Excludes
- Section F — Optional Experiences
- Section G — Important Notes
- Section H — Search My Vacation Customisation Ideas
- Section I — Internal Metadata

Orange label cells are mandatory. Blue label cells are optional. Yes/No, Pace, and Difficulty fields use dropdowns. The day-by-day area is an Excel table with filters and alternating rows.

### `Kerala - Munnar`

A fully completed, realistic 5D/4N sample itinerary showing the intended level of detail, formatting, metadata, package conventions, operational notes, optional experiences, and customisation ideas.

## Naming convention

- Worksheet: `State / Area - Destination` when practical, for example `Kerala - Munnar`.
- Keep sheet names unique and within Excel's 31-character limit.
- Do not use `\ / ? * [ ] :` in sheet names.
- Destination Code: uppercase `REGION-DESTINATION` form, for example `KL-MUN`.
- Region Code: stable uppercase code, for example `IN-KL`.

## Mandatory content

- `INDEX`: all fields except `Notes`.
- Destination sheet: all Journey Summary fields.
- Between one and eight Highlights.
- Each journey day must have `Day`, `Overnight Stay`, and `Suggested Experience`.
- Package Normally Includes, Normally Excludes, and Important Notes.
- All Internal Metadata fields except `Related Destinations`.

## Optional content

- `Meals` and `Notes` in the day-by-day table.
- Optional Experiences.
- Search My Vacation Customisation Ideas.
- Related Destinations.
- `INDEX` Notes.

Leave unused optional rows blank instead of entering placeholder text.

## Maintenance workflow

1. Duplicate `TEMPLATE`.
2. Rename the copied sheet using the naming convention.
3. Complete mandatory fields and any useful optional sections.
4. Add one row to `INDEX` and enter the new tab's exact name in `Sheet Name`.
5. Set status to `Draft` while editing, `Review` during validation, and `Approved` after business sign-off.
6. Increase `Revision Number`, update `Last Updated`, and record `Prepared By` whenever published content changes.

## Best practices

- Keep language concise, guest-friendly, and realistic for the stated duration.
- Use no more than eight Highlights.
- Make drive times, seasonal closures, weather sensitivity, accessibility, and operating dependencies explicit.
- Confirm hotel meal plans and inclusions before a journey is offered.
- Keep destination and region codes stable after publication.
- For printing, use landscape orientation and `Fit All Columns on One Page`; allow rows to flow over multiple pages.

## Customisation philosophy

Every itinerary is only a suggested starting point.

Every Search My Vacation journey remains fully customised.
