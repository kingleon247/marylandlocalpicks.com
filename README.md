# Maryland Local Picks

Maryland Local Picks is a print-and-digital local advertising platform built around curated city editions.

The Phase 1 MVP presents a statewide brand page, the first Catonsville edition, advertiser information, and conversion-focused business landing page templates.

Tagline:

**Local businesses, offers, and places worth knowing.**

## Current Phase

This repository is currently in **Phase 1.5: Sales Operations**.

Phase 1 public MVP is complete. Phase 1.5 adds reservation and intake flows needed to start selling and fulfilling Catonsville placements without building the full future platform.

## Phase 1 Scope

This repository intentionally contains a public marketing and directory MVP, not the full operating platform.

Included:

* responsive Maryland Local Picks brand homepage
* Catonsville city edition page
* advertiser information page
* `/reserve` packages and payment-policy page
* `/advertiser-intake` operational intake form with server-side submission
* local/serverful intake storage in `storage/advertiser-intakes/` (gitignored)
* Stripe Payment Link config placeholder (`src/data/payment-links.ts`, values null until links are created)
* front-end inquiry form placeholder
* static business landing pages with direct contact actions
* typed mock data for cities, categories, businesses, offers, and weekly picks
* Drizzle/PostgreSQL schema preparation with no live database requirement
* internal planning documents in `_docs/`

Not included:

* authentication or user accounts
* admin dashboard
* advertiser dashboard
* database-backed CRUD
* Stripe checkout or subscriptions
* SignalWire call tracking
* QR scan analytics
* AI answering services
* full reporting system

## Core Build Rule

Do not overbuild Phase 1.

The first job is to help sell and demonstrate the first Catonsville edition.

Do not add Phase 2+ features unless specifically requested.

Specifically, do not add these yet:

* database-backed CRUD
* admin dashboard
* advertiser dashboard
* Stripe checkout or subscriptions
* SignalWire call tracking
* auth/login
* AI answering
* full analytics/reporting

Working principle:

**Design for the full platform. Build only what is needed for the current phase.**

## Routes

| Route                          | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `/`                            | Maryland Local Picks brand and city edition overview      |
| `/catonsville`                 | First city directory, offers, weekly pick, and opt-in     |
| `/advertise`                   | Print-and-digital advertiser proposition and inquiry form |
| `/reserve`                     | Catonsville placement packages, prepay options, and payment policy |
| `/advertiser-intake`           | Operational advertiser intake form (no login required)    |
| `/advertiser-intake/thank-you` | Post-submission confirmation page                         |
| `/catonsville/[slug]`          | Static business conversion landing page template          |
| `/preview-exit`                | Clears private preview cookie and returns to the gate     |

Example business route:

```text
/catonsville/frederick-road-coffee
```

The current Phase 1 business detail route is:

```text
/catonsville/[slug]
```

A future canonical business route may be introduced later:

```text
/b/[business-slug]
```

Do not refactor to `/b/[slug]` unless specifically requested.

## Local Setup

Requirements:

* Node.js 20 or newer
* npm

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Private preview gate (optional)

Before public launch, the site can be hidden behind a coming-soon page. Reviewers enter a passcode to browse the full site.

Add to `.env.local` (not committed):

```bash
SITE_GATE_ENABLED=true
SITE_GATE_PASSCODE=change-me
```

Behavior:

* `SITE_GATE_ENABLED=true` — visitors see the coming-soon gate unless they have review access via cookie
* `SITE_GATE_ENABLED=false` — the full site is public (default for local development)
* `SITE_GATE_PASSCODE` is read server-side only; do not use `NEXT_PUBLIC_` for the passcode
* Correct passcode sets an httpOnly cookie (`mlp_review_access`) for about 7 days
* Reviewers can clear access via `/preview-exit` or `POST /api/site-gate/logout`
* When the gate is active, gated views use `noindex, nofollow`

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Data and Database Preparation

The Phase 1 public MVP reads from static typed mock data.

Expected mock data location:

```text
src/data/mock-data.ts
```

Prepared Drizzle table definitions may live in:

```text
src/db/schema.ts
```

The project may include:

```text
drizzle.config.ts
```

No database or `DATABASE_URL` is required to develop, typecheck, lint, build, or browse Phase 1 unless a later phase explicitly adds database-backed functionality.

The schema is preparation for future PostgreSQL use and should not force Phase 1 routes to require a live database.

## Advertiser Intake Storage (Phase 1.5)

Intake submissions are saved locally on the server filesystem:

```text
storage/advertiser-intakes/{submissionId}/submission.json
storage/advertiser-intakes/{submissionId}/assets/
```

* `storage/` is gitignored and not public.
* Uploaded files are stored privately and are not served through public routes.
* SVG uploads are stored only; they are not rendered directly without review.
* This storage is intended for local/serverful operation, not Vercel-style serverless file persistence.
* If deployed later, hosting and storage behavior must be reviewed.
* Intake submissions do not send email alerts yet. The operator must manually check the storage folder until email or CRM integration is added.
* Stripe Payment Links are not integrated yet. Payment link config exists in `src/data/payment-links.ts` with null values until real links are created.
* Online payment is not active on the site yet. `/reserve` explains packages and payment policy; CTAs route to intake or request a payment link.

## Project Structure

Expected structure:

```text
src/
  app/                    Next.js App Router pages
  components/             Shared server and focused client components
  data/mock-data.ts       Static Phase 1 content
  db/schema.ts            Prepared Drizzle/PostgreSQL schema

_docs/                    Canonical internal business, product, technical, sales, and operations plans

public/                   Static assets
```

If a legacy `docs/` folder exists, it is not the canonical plan.

Use `_docs/` as the source of truth.

## Documentation

Canonical internal planning documents live in:

```text
_docs/
```

Start with:

* `_docs/README.md`
* `_docs/00_CURRENT_REPO_STATE.md`
* `_docs/01_BUSINESS_PLAN.md`
* `_docs/02_PRODUCT_WEBSITE_SPEC.md`
* `_docs/05_TECHNICAL_ARCHITECTURE.md`

Full recommended reading order:

1. `_docs/00_CURRENT_REPO_STATE.md`
2. `_docs/01_BUSINESS_PLAN.md`
3. `_docs/02_PRODUCT_WEBSITE_SPEC.md`
4. `_docs/05_TECHNICAL_ARCHITECTURE.md`
5. `_docs/06_FIRST_EDITION_LAUNCH_CHECKLIST.md`
6. `_docs/03_OPERATIONS_PLAYBOOK.md`
7. `_docs/04_SALES_OFFER_MENU.md`
8. `_docs/07_SALES_SCRIPTS_OBJECTIONS.md`
9. `_docs/08_FINANCIAL_MODEL_NOTES.md`

The old `docs/` folder, if present, should be treated as legacy summary material only.

If anything in `docs/` conflicts with `_docs/`, follow `_docs/`.

## Business Concept

Maryland Local Picks combines:

* local print advertising
* city-specific digital guide pages
* business landing pages
* local offers and coupons
* Pick of the Week promotions
* email/newsletter opt-ins
* future advertiser reporting
* future call tracking
* future AI answering and marketing services

The first city edition is:

```text
Catonsville Local Picks
```

The initial public positioning:

```text
A printed card and digital guide featuring selected local businesses, offers, and places worth knowing.
```

## Phase Plan

### Phase 1: Public MVP

Goal:

Sell and demonstrate the first Catonsville edition with static content and working page templates.

Build:

* homepage
* Catonsville edition page
* advertise page
* mock business landing pages
* mock/static data
* basic email opt-in placeholder
* clean mobile-first design
* internal documentation

Do not build:

* database CRUD
* admin dashboard
* advertiser dashboard
* Stripe
* SignalWire
* auth
* AI answering
* full analytics

### Phase 2: Data-Backed Operations

Goal:

Make real card operations manageable without hardcoding everything.

Future build:

* PostgreSQL records
* Drizzle migrations
* cities
* editions
* businesses
* placements
* offers
* picks
* subscribers
* advertiser leads
* QR short codes
* basic tracking API

### Phase 3: Advertiser Value Layer

Goal:

Turn print advertisers into ongoing digital advertisers.

Future build:

* event tracking
* QR reports
* digital-only listings
* Pick of the Week scheduling
* renewal workflows
* internal admin surface
* simple advertiser reporting

### Phase 4: Recurring Revenue

Goal:

Create predictable recurring revenue.

Future build:

* Stripe subscriptions
* prepaid mailing packages
* advertiser billing views
* placement inventory
* recurring digital-only listings
* recurring print reservations
* self-service profile updates

### Phase 5: Call and Service Layer

Goal:

Turn Maryland Local Picks into a broader local marketing services platform.

Future build:

* SignalWire tracking numbers
* call forwarding
* compliant call reporting
* missed-call follow-up
* future AI answering
* website upsells
* reputation/review services
* digital advertising services

## Current Development Guidance

When using Cursor, Claude, Codex, or any other AI-assisted development tool:

1. Read `_docs/` first.
2. Treat `_docs/` as the source of truth.
3. Keep Phase 1 simple.
4. Do not build future phases unless asked.
5. Do not create duplicate documentation sources.
6. Do not assume a live database exists.
7. Do not refactor current routes unless instructed.
8. Keep the app serverful and Node-based.
9. Run typecheck, lint, and build before committing.
10. Commit working checkpoints.

## Important Notes

All businesses, offers, testimonials, addresses, and contact details currently shown in the product are fictional placeholder content unless explicitly replaced with real advertiser information.

Before any real print drop, verify current USPS EDDM requirements, print specifications, route counts, pricing, bundling, facing slips, and drop-off instructions.

Before using any call recording or AI answering feature, perform a legal and consent review.
