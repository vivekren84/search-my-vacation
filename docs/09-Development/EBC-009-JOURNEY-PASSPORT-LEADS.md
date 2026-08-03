# EBC-009 — Journey Passport Lead Capture

## Architecture

Journey Passport lead creation is a server-only Next.js App Router workflow:

1. The issued Passport form posts to `POST /api/journey-passport/leads`.
2. The route validates and normalises the request before using the server-only Supabase secret.
3. The lead is upserted by `passport_reference`; retrying the same Passport does not create another lead.
4. Operational events are recorded without mobile numbers or the Passport snapshot.
5. The server claims a single notification attempt and calls the configured provider.
6. A database failure keeps the guest on the form. Email failure is recorded but does not block Journey Director.
7. Later Director-entry and WhatsApp events use `POST /api/journey-passport/events`; WhatsApp tracking never blocks navigation.

No browser Supabase client, Auth middleware, session refresh, Storage, Realtime, or direct public table write is required.
The implementation uses Supabase and Resend REST APIs directly, so no dependency was added.

## Environment setup

Copy the variable names from `web/.env.example` into the ignored `web/.env.local`. Never commit `.env.local`, paste secrets into issue threads, or prefix a server secret with `NEXT_PUBLIC_`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Exact URL for the `SearchMyVacation_WebsiteUpgrade` project. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Current `sb_publishable_...` key. Reserved for browser-compatible Supabase use; this feature does not need it in the browser. |
| `SUPABASE_SECRET_KEY` | Server only | Current `sb_secret_...` key used by the route handlers. |
| `JOURNEY_LEAD_NOTIFICATION_EMAILS` | Server only | Comma-separated internal recipient list. Values are trimmed, validated, deduplicated, and never returned to the browser. |
| `JOURNEY_LEAD_FROM_EMAIL` | Server only | Verified transactional sender address. |
| `RESEND_API_KEY` | Server only | Resend API key. Leave blank until a production sending domain is verified. |

The checked-in example must contain placeholders only. Add the same six variables to Development, Preview, and Production in Vercel. Redeploy after changing any `NEXT_PUBLIC_` value because Next.js embeds public variables at build time.

Rotate Supabase and Resend keys immediately if a value is exposed. Update local and Vercel environments after rotation; do not retain old keys in Git history, documentation, logs, or screenshots.

## Database migration

Migration: `supabase/migrations/20260802130000_journey_passport_leads.sql`

The additive migration creates:

- `journey_passport_leads`, uniquely keyed by `passport_reference`;
- `journey_passport_events`, with one idempotent record per Passport/event type;
- indexes for lead creation time and event reference/type/time;
- a narrowly granted notification-claim function that prevents concurrent duplicate sends;
- RLS on both tables, no public policies, revoked `anon`/`authenticated` privileges, and server-role-only read/write access.

It creates no public read, update, delete, or insert policy and drops no existing object.

Apply it only after securely linking the Supabase CLI to project reference `jbsefolhlfkplawiuvlu` and reviewing the dry-run output. A safe operator sequence from the repository root is:

```sh
npx supabase link --project-ref jbsefolhlfkplawiuvlu
npx supabase db push --dry-run
npx supabase db push
```

Do not run the final command until the linked project and additive SQL have been confirmed. Supabase access tokens and database passwords belong in the CLI credential store or private prompt, never in source files.

## Notification behaviour

Release 1 uses a mockable provider interface with a Resend implementation. The message includes the Passport reference, guest-entered contact details, selected Passport answers, status, source, and India-localised submission time. HTML values are escaped and a plain-text alternative is included.

- Successful delivery records `sent` and `notification_sent`.
- Provider failure records a safe failure category and `notification_failed`, then continues the guest.
- Missing key, sender, or valid recipients records `not-configured`, then continues the guest.
- Provider response bodies, recipient lists, full mobile numbers, request payloads, and keys are never logged.

The preferred sender must be verified in Resend before real delivery can be validated. Domain verification and API-key creation are external configuration steps.

## Local verification

After applying the migration to a development project and filling the ignored environment file:

```sh
cd web
npm run verify:journey-leads
npm run lint
npm run build
npm run verify:journey-runtime
npm run verify:journey-scenarios
```

Use a synthetic name, a 10–15 digit test number, and one stable Passport ID. Confirm one retry remains one lead, events use the same reference, RLS blocks public reads, and notification status matches the configured provider outcome. Mask the test mobile number in screenshots.
