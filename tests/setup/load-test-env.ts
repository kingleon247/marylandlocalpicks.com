/**
 * Per-worker setup: load .env.local so DATABASE_TEST_URL is available to the
 * fail-closed guard and the test database client.
 */
import { loadEnv } from "@/lib/load-env";

loadEnv();
