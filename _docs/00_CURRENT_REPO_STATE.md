# Current Repo State

This file describes what currently exists in the repo. It is not the full long-term plan.

## Current Phase

Phase 1.5 sales operations.

Phase 1 public MVP is complete. Phase 1.5 adds reservation and intake flows for selling and fulfilling Catonsville placements without building the full future platform.

The Phase 1 operational backend foundation now exists on the database side: a dedicated Maryland Local Picks PostgreSQL database (Drizzle + postgres.js), the canonical `businesses` table, mailing editions, package catalog, the `reservations` capacity table, status history, activity events, and a capacity transaction service. See `_docs/09_BACKEND_PHASE_1.md`.

Authentication, advertiser/admin portals, Stripe API integration, payments, digital entitlements/subscriptions, SignalWire, and email alerts should NOT be assumed yet — those are later phases.

## Private Preview Gate

Before public launch, the site can be hidden behind a coming-soon page controlled by environment variables:

```bash
SITE_GATE_ENABLED=true
SITE_GATE_PASSCODE=change-me
```

* `SITE_GATE_ENABLED=true` shows the gate unless the visitor has an httpOnly review cookie
* `SITE_GATE_ENABLED=false` makes the full site public
* `SITE_GATE_PASSCODE` is server-side only — never use `NEXT_PUBLIC_`
* Passcode submission: `POST /api/site-gate`
* Clear access: `GET /preview-exit` or `POST /api/site-gate/logout`
* Gated views set `noindex, nofollow`

Turn the gate off for public launch by setting `SITE_GATE_ENABLED=false`.

## Current Stack

- Next.js App Router
- React
- TypeScript
- Server Components by default
- Small Client Components only where needed for form submission states
- Plain global CSS
- Static typed mock data
- Node/server runtime
- Local/serverful filesystem intake storage (artwork/intake bytes; not the operational DB)
- Operational PostgreSQL (DigitalOcean managed) via Drizzle ORM + postgres.js, with reviewed migrations and real-Postgres integration tests (Phase 1 backend foundation)

## Current Routes

Public routes:

- `/`
- `/catonsville`
- `/advertise`
- `/reserve` — static reservation/packages page (Half Spot $350, Standard Spot $600, Double Spot $1,100; 10,000-home mailing)
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

Operational Phase 1 tables (live, in the MLP database):

- `cities`, `categories` (reference data)
- `businesses` (canonical identity + public listing)
- `mailing_editions`, `edition_packages`
- `reservations` (the single capacity-consuming table), `reservation_status_history`
- `activity_events` (append-only audit log)

Public-guide directory tables (`business_placements`, `offers`, `picks_of_the_week`) from the original prototype schema are deferred — they were never migrated and can be reintroduced additively later.

Future Phase 2+ data areas (NOT built yet):

- payments / refunds / Stripe webhook ledger (Phase 2)
- users / advertiser organizations / claims / checklists (Phase 3)
- assets / proofs / digital entitlements / subscriptions / engagement (Phase 4)
- commissions / mailing status (Phase 5)
- CommissionGPS integration + AI tools (Phase 6)
- telephony (Phase 7)

## Development Rule

Use `_docs/` as the source of truth.

Do not build Phase 2+ features unless specifically requested.
