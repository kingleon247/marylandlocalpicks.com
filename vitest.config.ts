import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // Load .env.local (which carries DATABASE_TEST_URL) into each worker.
    setupFiles: ["tests/setup/load-test-env.ts"],
    // Migrate the test database once, after the fail-closed safety check.
    globalSetup: ["tests/setup/global-setup.ts"],
    // Test files share a single test database and TRUNCATE between tests, so
    // they must not run in parallel with each other. Concurrency *within* a
    // test (the oversell race) uses its own parallel transactions.
    fileParallelism: false,
    pool: "forks",
    hookTimeout: 60_000,
    testTimeout: 60_000,
  },
});
