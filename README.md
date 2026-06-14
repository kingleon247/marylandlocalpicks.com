# Maryland Local Picks

Maryland Local Picks is a print-and-digital local advertising concept built
around curated city editions. The Phase 1 MVP presents a statewide brand page,
the first Catonsville edition, advertiser information, and conversion-focused
business landing page templates.

Tagline: **Local businesses, offers, and places worth knowing.**

## Phase 1 Scope

This repository intentionally contains a public marketing and directory MVP,
not the full operating platform.

Included:

- Responsive Maryland Local Picks brand homepage
- Catonsville city edition with categories, offers, and Pick of the Week
- Advertiser information and a front-end inquiry form placeholder
- Static business landing pages with direct contact actions
- Typed mock data for cities, categories, businesses, offers, and weekly picks
- Drizzle/PostgreSQL schema preparation with no live database requirement
- Business, technical, and print operations notes

Not included:

- Authentication or user accounts
- Admin or advertiser dashboards
- Database-backed CRUD
- Stripe or payment processing
- SignalWire or real call tracking
- QR scan analytics
- AI answering services

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Maryland Local Picks brand and city edition overview |
| `/catonsville` | First city directory, offers, weekly pick, and opt-in |
| `/advertise` | Print-and-digital advertiser proposition and inquiry form |
| `/catonsville/[slug]` | Static business conversion landing page template |

Example business route:
`/catonsville/frederick-road-coffee`

## Local Setup

Requirements:

- Node.js 20 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Data and Database Preparation

The public MVP reads from [`src/data/mock-data.ts`](src/data/mock-data.ts).
Drizzle table definitions live in [`src/db/schema.ts`](src/db/schema.ts), and
the project includes a [`drizzle.config.ts`](drizzle.config.ts) configuration
for future PostgreSQL migrations.

No database or `DATABASE_URL` is required to develop, typecheck, lint, build,
or browse Phase 1. The schema is not connected to application routes.

## Project Structure

```text
src/
  app/                    Next.js App Router pages
  components/             Shared server and focused client components
  data/mock-data.ts       Static Phase 1 content
  db/schema.ts            Prepared Drizzle/PostgreSQL schema
docs/                     Concise project planning documents
_docs/                    Supplemental internal business and operations plans
```

## Phase Plan

### Phase 1: Public MVP

Sell and demonstrate the first Catonsville edition with static content and
working page templates.

### Phase 2: Data-Backed Operations

Add PostgreSQL records for cities, editions, businesses, placements, offers,
picks, subscribers, advertiser leads, and QR short codes.

### Phase 3: Advertiser Value

Add event tracking, QR reports, digital-only listings, Pick of the Week
scheduling, renewal workflows, and an internal admin surface.

### Phase 4: Recurring Revenue

Add Stripe subscriptions and prepaid packages, advertiser billing views,
placement inventory, and self-service profile updates.

### Phase 5: Call and Service Layer

Add SignalWire tracking numbers, compliant call reporting, and later AI
answering and missed-call follow-up products.

## Documentation

- [`docs/BUSINESS_PLAN.md`](docs/BUSINESS_PLAN.md)
- [`docs/TECHNICAL_PLAN.md`](docs/TECHNICAL_PLAN.md)
- [`docs/OPERATIONS_NOTES.md`](docs/OPERATIONS_NOTES.md)

All businesses, offers, testimonials, addresses, and contact details currently
shown in the product are fictional placeholder content.
