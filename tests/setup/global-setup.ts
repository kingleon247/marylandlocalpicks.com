/**
 * Vitest global setup. Runs ONCE before any test.
 *
 * Correction 2 (fail-closed): resolves the test database URL through
 * `requireTestDatabaseUrl`, which aborts unless DATABASE_TEST_URL is present,
 * differs from DATABASE_URL, and clearly names a test database. Migrations are
 * applied ONLY to that database; this never falls back to DATABASE_URL.
 */
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { createDbClient } from "@/db/client";
import { requireTestDatabaseUrl, sanitizeDbUrl } from "@/lib/env";
import { loadEnv } from "@/lib/load-env";

export default async function globalSetup(): Promise<void> {
  loadEnv();
  // Fail-closed: throws before any destructive work if the target is unsafe.
  const testUrl = requireTestDatabaseUrl();
  console.log(`[test] applying migrations to ${sanitizeDbUrl(testUrl)}`);

  const client = createDbClient(testUrl, { max: 1 });
  try {
    await migrate(client.db, { migrationsFolder: "./drizzle" });
  } finally {
    await client.close();
  }
}
