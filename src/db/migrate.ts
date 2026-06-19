/**
 * Migration runner (CLI: `npm run db:migrate`).
 *
 * Applies the reviewed migration files in ./drizzle to the DATABASE_URL target.
 * Correction 4: refuses to run against a CommissionGPS or production-looking
 * database. The test database is migrated by the test harness, never here.
 */
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { createDbClient } from "@/db/client";
import { requireDatabaseUrl, databaseNameOf, sanitizeDbUrl } from "@/lib/env";
import { loadEnv } from "@/lib/load-env";

const PRODUCTION_NAME = /prod|production/i;

async function main(): Promise<void> {
  loadEnv();

  // requireDatabaseUrl: ensures DATABASE_URL is present and not CommissionGPS.
  const url = requireDatabaseUrl();

  const name = databaseNameOf(url);
  if (PRODUCTION_NAME.test(name)) {
    throw new Error(
      `Refusing to migrate a production-looking database ('${name}'). ` +
        "Phase 1 migrations target development/test databases only.",
    );
  }

  console.log(`Applying migrations to ${sanitizeDbUrl(url)} ...`);
  const client = createDbClient(url, { max: 1 });
  try {
    await migrate(client.db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
