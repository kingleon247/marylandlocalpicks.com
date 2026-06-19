import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  // Domain-split schema barrel (Phase 1). `drizzle-kit generate` only diffs the
  // schema against the migration journal and does not connect to a database.
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    // Only used by drizzle-kit push/pull/migrate, which this project does NOT
    // use — migrations are applied by src/db/migrate.ts. The fallback is a
    // non-routable placeholder so an accidental push cannot reach a real host.
    url:
      process.env.DATABASE_URL ??
      "postgres://placeholder:placeholder@127.0.0.1:1/disabled",
  },
  strict: true,
  verbose: true,
});
