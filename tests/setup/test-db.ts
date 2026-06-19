/**
 * Shared test-database access for integration tests.
 *
 * The client is created from DATABASE_TEST_URL via the fail-closed guard, so a
 * test run can never reach the dev or production database. `resetAndSeed`
 * TRUNCATEs the Phase 1 tables and re-runs the idempotent seed before each test
 * — we never truncate seeded data and then assume it survived.
 */
import { sql } from "drizzle-orm";

import { createDbClient, type Database, type DbClient } from "@/db/client";
import { requireTestDatabaseUrl } from "@/lib/env";
import { seedInitialEdition, type SeedResult } from "@/server/seed";

let client: DbClient | undefined;

export function getTestClient(): DbClient {
  if (!client) {
    // Fail-closed: aborts unless DATABASE_TEST_URL is a clearly-named test db
    // distinct from DATABASE_URL.
    const url = requireTestDatabaseUrl();
    client = createDbClient(url, { max: 5 });
  }
  return client;
}

export async function resetDatabase(db: Database): Promise<void> {
  await db.execute(sql`TRUNCATE TABLE
    "activity_events",
    "reservation_status_history",
    "reservations",
    "edition_packages",
    "mailing_editions",
    "businesses",
    "categories",
    "cities"
    RESTART IDENTITY CASCADE`);
}

export async function resetAndSeed(db: Database): Promise<SeedResult> {
  await resetDatabase(db);
  return seedInitialEdition(db);
}

export async function closeTestClient(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
  }
}
