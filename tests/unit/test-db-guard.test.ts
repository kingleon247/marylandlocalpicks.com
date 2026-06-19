/**
 * Correction 2: the fail-closed test-database guard must reject unsafe
 * configurations BEFORE any destructive work. Pure unit test (no DB).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { requireTestDatabaseUrl } from "@/lib/env";

const HOST = "postgresql://u:p@db.example.com:25060";

describe("requireTestDatabaseUrl (fail-closed)", () => {
  let savedTest: string | undefined;
  let savedDev: string | undefined;

  beforeEach(() => {
    savedTest = process.env.DATABASE_TEST_URL;
    savedDev = process.env.DATABASE_URL;
  });

  afterEach(() => {
    if (savedTest === undefined) delete process.env.DATABASE_TEST_URL;
    else process.env.DATABASE_TEST_URL = savedTest;
    if (savedDev === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = savedDev;
  });

  it("accepts a clearly-named test database distinct from dev", () => {
    process.env.DATABASE_URL = `${HOST}/maryland_local_picks_dev?sslmode=require`;
    process.env.DATABASE_TEST_URL = `${HOST}/maryland_local_picks_test?sslmode=require`;
    expect(requireTestDatabaseUrl()).toBe(
      process.env.DATABASE_TEST_URL,
    );
  });

  it("aborts when DATABASE_TEST_URL is missing (no fall back to DATABASE_URL)", () => {
    delete process.env.DATABASE_TEST_URL;
    process.env.DATABASE_URL = `${HOST}/maryland_local_picks_dev?sslmode=require`;
    expect(() => requireTestDatabaseUrl()).toThrow(/DATABASE_TEST_URL is required/);
  });

  it("aborts when test URL equals dev URL", () => {
    const url = `${HOST}/maryland_local_picks_test?sslmode=require`;
    process.env.DATABASE_URL = url;
    process.env.DATABASE_TEST_URL = url;
    expect(() => requireTestDatabaseUrl()).toThrow(/equals DATABASE_URL/);
  });

  it("aborts when the database name is not clearly a test database", () => {
    process.env.DATABASE_URL = `${HOST}/maryland_local_picks_dev?sslmode=require`;
    process.env.DATABASE_TEST_URL = `${HOST}/maryland_local_picks?sslmode=require`;
    expect(() => requireTestDatabaseUrl()).toThrow(/not clearly a test database/);
  });

  it("aborts when the target looks like a CommissionGPS database", () => {
    process.env.DATABASE_URL = `${HOST}/maryland_local_picks_dev?sslmode=require`;
    process.env.DATABASE_TEST_URL = `${HOST}/commission_gps_test?sslmode=require`;
    expect(() => requireTestDatabaseUrl()).toThrow(/CommissionGPS/);
  });
});
