# Current Repo State

This file describes what currently exists in the repo. It is not the full long-term plan.

## Current Phase

Phase 1 public MVP.

No database connection, authentication, API layer, Stripe, SignalWire, dashboard, or payment integration should be assumed yet.

## Current Stack

- Next.js App Router
- React
- TypeScript
- Server Components by default
- Small Client Components only where needed for form confirmation states
- Plain global CSS
- Static typed mock data
- Node/server runtime
- Drizzle ORM table definitions prepared for future PostgreSQL

## Current Routes

The current business detail route is:

`/catonsville/[slug]`

This is acceptable for Phase 1.

The future canonical business route may become:

`/b/[business-slug]`

Do not refactor to `/b/[slug]` unless specifically asked.

## Current Data Approach

Phase 1 uses static typed mock data.

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