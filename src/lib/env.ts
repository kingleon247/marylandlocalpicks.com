/**
 * Environment validation for Maryland Local Picks (Phase 1).
 *
 * This module is intentionally framework-agnostic: it only reads `process.env`
 * and contains the fail-closed safety guards for database access. Standalone
 * scripts and the test harness load their dotenv file *before* importing the
 * helpers here.
 */
import { z } from "zod";

const envSchema = z.object({
  // Dev/app database. Optional at module load so importing this file never
  // throws; callers that actually need a URL use the require* helpers below.
  DATABASE_URL: z.string().url().optional(),
  // Dedicated test database. Never used by app/dev code paths.
  DATABASE_TEST_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/** Database names that clearly identify a test database. */
const TEST_DB_NAME_PATTERN = /(^test_|_test$)/;

/** Names that must never be a Maryland Local Picks target (CommissionGPS). */
const FORBIDDEN_DB_NAME_PATTERN = /commission[_-]?gps|commission_gps/i;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}

/** Extract the database name from a postgres connection URL. */
export function databaseNameOf(url: string): string {
  return new URL(url).pathname.replace(/^\//, "");
}

/**
 * Print-safe representation of a connection URL: host + database only, never
 * the user or password.
 */
export function sanitizeDbUrl(url: string): string {
  const u = new URL(url);
  return `${u.hostname}:${u.port || "5432"}/${databaseNameOf(url)}`;
}

/** The dev/app database URL. Throws (does not fall back) if missing. */
export function requireDatabaseUrl(): string {
  const { DATABASE_URL } = parseEnv();
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Refusing to continue without an explicit database target.",
    );
  }
  if (FORBIDDEN_DB_NAME_PATTERN.test(databaseNameOf(DATABASE_URL))) {
    throw new Error(
      "DATABASE_URL points at a CommissionGPS database. Refusing to connect.",
    );
  }
  return DATABASE_URL;
}

/**
 * Resolve the test database URL with fail-closed safety (Correction 2).
 *
 * Aborts BEFORE any caller can run a migration, truncation, reset, seed, or
 * cleanup unless every safety condition holds. Never falls back to
 * DATABASE_URL.
 */
export function requireTestDatabaseUrl(): string {
  const testUrl = process.env.DATABASE_TEST_URL;
  const devUrl = process.env.DATABASE_URL;

  if (!testUrl) {
    throw new Error(
      "DATABASE_TEST_URL is required to run tests. Refusing to run destructive " +
        "test setup with it unset (will NOT fall back to DATABASE_URL).",
    );
  }
  // Validate it is a well-formed URL before inspecting it further.
  const parsed = envSchema.shape.DATABASE_TEST_URL.safeParse(testUrl);
  if (!parsed.success) {
    throw new Error("DATABASE_TEST_URL is not a valid URL. Refusing to run tests.");
  }
  if (devUrl && testUrl === devUrl) {
    throw new Error(
      "DATABASE_TEST_URL equals DATABASE_URL. Refusing to run destructive test " +
        "setup against the development database.",
    );
  }
  const name = databaseNameOf(testUrl);
  if (!TEST_DB_NAME_PATTERN.test(name)) {
    throw new Error(
      `DATABASE_TEST_URL database '${name}' is not clearly a test database ` +
        "(expected a name with a 'test_' prefix or '_test' suffix). Refusing to run tests.",
    );
  }
  if (devUrl && name === databaseNameOf(devUrl)) {
    throw new Error(
      "DATABASE_TEST_URL and DATABASE_URL point at the same database name. " +
        "Refusing to run destructive test setup.",
    );
  }
  if (FORBIDDEN_DB_NAME_PATTERN.test(name)) {
    throw new Error(
      `DATABASE_TEST_URL database '${name}' looks like a CommissionGPS database. Refusing.`,
    );
  }
  return testUrl;
}
