/**
 * Pure assertions on the locked package + capacity constants (no DB).
 */
import { describe, expect, it } from "vitest";

import {
  INTERNAL_ALLOCATION_HALF_UNITS,
  SEED_PACKAGES,
} from "@/server/seed";

describe("seed package + capacity constants", () => {
  it("maps half/standard/double to 1/2/4 half-units", () => {
    const byKey = Object.fromEntries(
      SEED_PACKAGES.map((p) => [p.packageKey, p.halfUnitsConsumed]),
    );
    expect(byKey.half_spot).toBe(1);
    expect(byKey.standard_spot).toBe(2);
    expect(byKey.double_spot).toBe(4);
  });

  it("uses integer cent prices ($350 / $600 / $1,100)", () => {
    const byKey = Object.fromEntries(
      SEED_PACKAGES.map((p) => [p.packageKey, p.priceCents]),
    );
    expect(byKey.half_spot).toBe(35_000);
    expect(byKey.standard_spot).toBe(60_000);
    expect(byKey.double_spot).toBe(110_000);
    for (const p of SEED_PACKAGES) {
      expect(Number.isInteger(p.priceCents)).toBe(true);
      expect(Number.isInteger(p.halfUnitsConsumed)).toBe(true);
    }
  });

  it("fixes the internal allocation at exactly 2 half-units", () => {
    expect(INTERNAL_ALLOCATION_HALF_UNITS).toBe(2);
  });
});
