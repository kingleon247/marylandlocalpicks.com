# Backend Phase 1 — Database Foundation + Capacity

This documents the Phase 1 operational backend: the PostgreSQL/Drizzle
foundation, the canonical business model, mailing editions, the reservations
capacity table, and the capacity transaction service.

Phase 1 is intentionally narrow. It includes **no** Stripe, payments, auth,
advertiser/admin portals, entitlements, subscriptions, analytics, or telephony.
Those are later phases.

## Database

Maryland Local Picks uses its **own** PostgreSQL database and credentials, fully
isolated from CommissionGPS (no cross-database reads/writes). Launch target is a
dedicated database on the existing DigitalOcean managed cluster.

Two databases:

- `DATABASE_URL` → `maryland_local_picks_dev` (development/app)
- `DATABASE_TEST_URL` → `maryland_local_picks_test` (tests only)

DigitalOcean managed Postgres uses port `25060` and requires SSL
(`?sslmode=require`). Each MLP database has its own least-privilege user that
owns only that database.

### One-time cluster setup (run as `doadmin`)

```sql
-- as doadmin, connected to maryland_local_picks_dev
ALTER DATABASE maryland_local_picks_dev OWNER TO mlp_dev;
ALTER SCHEMA public OWNER TO mlp_dev;
GRANT ALL ON SCHEMA public TO mlp_dev;

-- as doadmin, connected to maryland_local_picks_test
ALTER DATABASE maryland_local_picks_test OWNER TO mlp_test;
ALTER SCHEMA public OWNER TO mlp_test;
GRANT ALL ON SCHEMA public TO mlp_test;
```

## Commands

```bash
npm run db:generate   # regenerate migration SQL from the schema (offline)
npm run db:migrate    # apply ./drizzle migrations to DATABASE_URL (dev)
npm run db:seed       # idempotent seed of Catonsville Edition 1 into dev
npm test              # unit + real-Postgres integration tests (test DB only)
```

Migrations are applied by `src/db/migrate.ts` (postgres.js migrator), never by
`drizzle-kit push`. The runner refuses to target a CommissionGPS or
production-looking database. Do **not** apply migrations to a production
database from local development.

## Schema layout (`src/db/schema/`)

- `enums.ts` — Phase 1 enums + the consuming/releasing status sets
- `reference.ts` — `cities`, `categories`
- `businesses.ts` — canonical identity + public listing
- `editions.ts` — `mailing_editions`, `edition_packages`
- `reservations.ts` — `reservations` (capacity), `reservation_status_history`
- `activity.ts` — `activity_events`
- `relations.ts`, `index.ts` (barrel)

### Deferred foreign keys

These columns are plain nullable `uuid` in Phase 1 with **no** foreign key; their
FKs are added by an additive Phase 3 migration when the referenced tables exist:
`businesses.claimed_by_org_id`, `reservations.advertiser_org_id`,
`reservations.assigned_salesperson_id`, `activity_events.advertiser_org_id`, and
the `actor_id` columns. `activity_events.reservation_id` and
`reservations.business_id` are real FKs because those tables exist in Phase 1.

## Capacity model

Capacity is measured in **integer half-units** (no floats). The standard card is
`physical_capacity_half_units = 32`.

- Half Spot = 1, Standard Spot = 2, Double Spot = 4 half-units.
- The internal Maryland Local Picks allocation is an ordinary capacity-consuming
  reservation row (`kind = internal_allocation`, exactly 2 half-units). It is
  deducted **once** — there is no separate sellable ceiling.

Available capacity is **derived**, never stored as a mutable counter:

```
available = physical_capacity_half_units
            - SUM(half_units_consumed) over consuming statuses
```

Consuming statuses: `held`, `awaiting_payment`, `paid`, `in_production`,
`completed`. Releasing statuses: `cancelled`, `expired`. With only the internal
allocation present, available = `32 - 2 = 30` (never 28).

### Database-enforced invariants

- `chk_reservations_half_units_positive` — every reservation consumes > 0.
- `chk_internal_allocation_exactly_two` — an internal allocation consumes
  exactly 2.
- `uniq_active_internal_allocation_per_edition` — at most one **active**
  internal allocation per edition (released ones are excluded, so they neither
  block a new one nor consume capacity).

### Concurrency

`createReservation` runs in a transaction that locks the edition row
(`SELECT … FOR UPDATE`) before computing consumed capacity and inserting. This
serializes concurrent holds for the same edition so overselling is impossible.
All capacity-mutating writes funnel through `src/server/capacity.ts`.

## Test safety (fail-closed)

The test harness refuses to run destructive setup unless the target is clearly a
test database. Before any migrate/truncate/seed it aborts if `DATABASE_TEST_URL`
is missing, equals `DATABASE_URL`, or does not name a test database (e.g. a
`_test` suffix), and it never falls back to `DATABASE_URL`. Integration tests run
only against `DATABASE_TEST_URL`; each test truncates the Phase 1 tables and
re-runs the idempotent seed.
