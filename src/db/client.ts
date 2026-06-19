/**
 * postgres.js + Drizzle client.
 *
 * - `createDbClient` builds an explicit, owned client (used by scripts, the
 *   migration runner, and the test harness so they control lifecycle and which
 *   database URL is targeted).
 * - `getDb` returns a process-wide singleton for app/server usage, cached on
 *   `globalThis` so Next.js dev-mode module reloads do not exhaust connections.
 */
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import { requireDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

export interface DbClient {
  sql: Sql;
  db: Database;
  close: () => Promise<void>;
}

/** Derive a postgres.js ssl option from the connection string's sslmode. */
function sslOption(
  connectionString: string,
): boolean | "verify-full" | { rejectUnauthorized: boolean } {
  const mode = new URL(connectionString).searchParams.get("sslmode");
  switch (mode) {
    case "disable":
      return false;
    case "verify-ca":
    case "verify-full":
      return "verify-full";
    case "require":
    case "prefer":
    case "allow":
    default:
      // Encrypt the connection without CA verification. DigitalOcean managed
      // Postgres uses its own CA which is not loaded here; this still provides
      // transport encryption. Switch to verify-full + the DO CA for stricter
      // verification later.
      return { rejectUnauthorized: false };
  }
}

export function createDbClient(
  connectionString: string,
  opts: { max?: number; applicationName?: string } = {},
): DbClient {
  const sql = postgres(connectionString, {
    ssl: sslOption(connectionString),
    max: opts.max ?? 5,
    onnotice: () => {},
    ...(opts.applicationName
      ? { connection: { application_name: opts.applicationName } }
      : {}),
  });
  const db = drizzle(sql, { schema });
  return {
    sql,
    db,
    close: () => sql.end({ timeout: 5 }),
  };
}

const globalForDb = globalThis as unknown as {
  __mlpDbClient?: DbClient;
};

export function getDbClient(): DbClient {
  if (!globalForDb.__mlpDbClient) {
    globalForDb.__mlpDbClient = createDbClient(requireDatabaseUrl(), {
      max: 5,
    });
  }
  return globalForDb.__mlpDbClient;
}

export function getDb(): Database {
  return getDbClient().db;
}
