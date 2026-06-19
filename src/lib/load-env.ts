/**
 * Loads `.env.local` (then `.env`) for standalone entry points — the migration
 * runner, seed script, and the test harness. Next.js loads these automatically
 * for the app, but `tsx`/`vitest` processes do not.
 *
 * Import this ONLY from entry points (scripts/tests), never from app/server
 * modules, so dotenv never ends up in a bundled runtime.
 */
import { config } from "dotenv";

let loaded = false;

export function loadEnv(): void {
  if (loaded) return;
  // `.env.local` first; dotenv does not override already-set vars, so real
  // process env (e.g. CI) still wins.
  config({ path: ".env.local" });
  config();
  loaded = true;
}
