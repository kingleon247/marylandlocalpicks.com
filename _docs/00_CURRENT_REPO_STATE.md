# Current Repo State

This file describes what currently exists in the repo. It is not the full long-term plan.

## Current Phase

Phase 1.5 sales operations.

Phase 1 public MVP is complete. Phase 1.5 adds reservation and intake flows for selling and fulfilling Catonsville placements without building the full future platform.

No database connection, authentication, admin dashboard, Stripe API integration, SignalWire, or email alerts should be assumed yet.

## Current Stack

- Next.js App Router
- React
- TypeScript
- Server Components by default
- Small Client Components only where needed for form submission states
- Plain global CSS
- Static typed mock data
- Node/server runtime
- Local/serverful filesystem intake storage (no database)
- Drizzle ORM table definitions prepared for future PostgreSQL

## Current Routes

Public routes:

- `/`
- `/catonsville`
- `/advertise`
- `/reserve` — static reservation/packages page
- `/advertiser-intake` — Phase 1.5 operational intake form
- `/advertiser-intake/thank-you` — post-submission confirmation
- `/catonsville/[slug]` — static business landing page template

The current business detail route is:

`/catonsville/[slug]`

This is acceptable for Phase 1.

The future canonical business route may become:

`/b/[business-slug]`

Do not refactor to `/b/[slug]` unless specifically asked.

## Advertiser Intake (Phase 1.5)

- Submissions POST to `/api/advertiser-intake`
- Saved to `storage/advertiser-intakes/{submissionId}/submission.json`
- Uploaded files saved to `storage/advertiser-intakes/{submissionId}/assets/`
- `storage/` is gitignored and not publicly served
- Intended for local/serverful operation, not Vercel-style serverless file persistence
- If deployed later, hosting/storage behavior must be reviewed
- No email alerts yet — operator must manually check storage until email/CRM integration is added
- Honeypot anti-spam field; no CAPTCHA
- Stripe Payment Links are not integrated yet
- Payment link config exists at `src/data/payment-links.ts` with null values until links are created
- Online payment is not active on the site yet

## Current Data Approach

Phase 1 uses static typed mock data.

Package and payment-link config:

- `src/data/advertiser-packages.ts`
- `src/data/payment-links.ts`

Prepared/future schema areas include:

- cities
- categories
- businesses
- business placements
- offers
- picks of the week

Future Phase 2+ data areas include:

- editions
- placements
- events
- subscribers
- leads
- calls
- commitments

## Development Rule

Use `_docs/` as the source of truth.

Do not build Phase 2+ features unless specifically requested.
