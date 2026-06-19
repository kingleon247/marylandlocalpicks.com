/**
 * CLI seed entry point (`npm run db:seed`). Seeds the DATABASE_URL (dev)
 * database. Idempotent: safe to run repeatedly.
 */
import { createDbClient } from "@/db/client";
import { databaseNameOf, sanitizeDbUrl } from "@/lib/env";
import { loadEnv } from "@/lib/load-env";
import { seedInitialEdition } from "@/server/seed";

const FORBIDDEN_NAME = /commission[_-]?gps/i;
const PRODUCTION_NAME = /prod|production/i;

async function main(): Promise<void> {
  loadEnv();

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Refusing to seed.");
  }
  const name = databaseNameOf(url);
  if (FORBIDDEN_NAME.test(name)) {
    throw new Error(`Refusing to seed a CommissionGPS database ('${name}').`);
  }
  if (PRODUCTION_NAME.test(name)) {
    throw new Error(
      `Refusing to seed a production-looking database ('${name}').`,
    );
  }

  console.log(`Seeding ${sanitizeDbUrl(url)} ...`);
  const client = createDbClient(url, { max: 1 });
  try {
    const result = await seedInitialEdition(client.db);
    console.log(
      `Done. internalAllocationCreated=${result.internalAllocationCreated} ` +
        `physical=${result.capacity.physicalHalfUnits} ` +
        `consumed=${result.capacity.consumedHalfUnits} ` +
        `available=${result.capacity.availableHalfUnits}`,
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
