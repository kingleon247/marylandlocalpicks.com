# Technical Plan

## Phase 1 Architecture

- Next.js App Router, React, and TypeScript
- Server Components by default
- Focused Client Components for form confirmation states
- Plain global CSS
- Static typed mock data
- Node/server runtime
- Drizzle ORM definitions prepared for PostgreSQL

Phase 1 has no database connection, auth, API layer, or payment integration.

## Routes

Current routes:

```text
/
/catonsville
/advertise
/catonsville/[slug]
```

The business records are separate from cities in the data model. A future
canonical `/b/[business-slug]` route can be added when multi-city placements
are implemented without duplicating business records.

Potential later routes:

```text
/{city}/offers
/{city}/picks
/b/[business-slug]
/q/[short-code]
/admin
/dashboard
```

## Data Model

Prepared Drizzle tables:

- `cities`
- `categories`
- `businesses`
- `business_placements`
- `offers`
- `picks_of_the_week`

Phase 2 may add editions, detailed placements, events, subscribers, advertiser
leads, calls, and recurring placement commitments.

## Tracking and Services

Basic tracking must distinguish a `call_tap` from a confirmed phone call.
Future QR short codes should record city, edition, placement, business, and
source before redirecting.

Use manual invoices or Stripe Payment Links before custom checkout. SignalWire
and AI answering remain later service layers. Any call-recording feature needs
an explicit legal and consent review.

Keep the deployment serverful. Database and service integrations should live in
server-only modules and never expose credentials to Client Components.
