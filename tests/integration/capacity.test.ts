/**
 * Real-PostgreSQL integration tests for the Phase 1 capacity model.
 *
 * Runs against DATABASE_TEST_URL only (enforced by the fail-closed guard in the
 * shared test client). Each test starts from a freshly truncated + re-seeded
 * database.
 */
import { and, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  activityEvents,
  reservationStatusHistory,
  reservations,
} from "@/db/schema";
import {
  CapacityError,
  createReservation,
  getEditionCapacity,
  transitionReservationStatus,
} from "@/server/capacity";
import { seedInitialEdition } from "@/server/seed";
import {
  closeTestClient,
  getTestClient,
  resetAndSeed,
} from "../setup/test-db";

const { db } = getTestClient();
let editionId: string;

beforeEach(async () => {
  const seeded = await resetAndSeed(db);
  editionId = seeded.editionId;
});

afterAll(async () => {
  await closeTestClient();
});

describe("internal allocation + derived availability", () => {
  it("deducts the internal allocation exactly once (available = 30, not 28)", async () => {
    const cap = await getEditionCapacity(db, editionId);
    expect(cap.physicalHalfUnits).toBe(32);
    expect(cap.consumedHalfUnits).toBe(2);
    expect(cap.availableHalfUnits).toBe(30);
  });

  it("is idempotent: re-running the seed creates no second allocation", async () => {
    const again = await seedInitialEdition(db);
    expect(again.internalAllocationCreated).toBe(false);

    const allocations = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.editionId, editionId),
          eq(reservations.kind, "internal_allocation"),
        ),
      );
    expect(allocations).toHaveLength(1);

    const cap = await getEditionCapacity(db, editionId);
    expect(cap.availableHalfUnits).toBe(30); // never 28
  });
});

describe("package consumption", () => {
  it("consumes 1 / 2 / 4 half-units for half / standard / double", async () => {
    await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 1,
      source: "web_intake",
      packageKey: "half_spot",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(29);

    await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 2,
      source: "web_intake",
      packageKey: "standard_spot",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(27);

    await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 4,
      source: "web_intake",
      packageKey: "double_spot",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(23);
  });
});

describe("invariants enforced by the database", () => {
  it("rejects a non-positive half-units reservation (service guard)", async () => {
    await expect(
      createReservation(db, {
        editionId,
        kind: "advertiser_hold",
        status: "held",
        halfUnitsConsumed: 0,
        source: "web_intake",
      }),
    ).rejects.toThrow();
  });

  it("rejects negative half-units at the DB check constraint", async () => {
    await expect(
      db.insert(reservations).values({
        editionId,
        kind: "advertiser_hold",
        status: "held",
        halfUnitsConsumed: -1,
        source: "web_intake",
      }),
    ).rejects.toThrow();
  });

  it("rejects an internal allocation that is not exactly 2 half-units", async () => {
    // status 'cancelled' so the active-allocation partial unique index does not
    // fire — this isolates the exactly-two CHECK constraint.
    await expect(
      db.insert(reservations).values({
        editionId,
        kind: "internal_allocation",
        status: "cancelled",
        halfUnitsConsumed: 3,
        source: "seeded",
      }),
    ).rejects.toThrow();
  });

  it("rejects a second active internal allocation (partial unique index)", async () => {
    await expect(
      db.insert(reservations).values({
        editionId,
        kind: "internal_allocation",
        status: "completed",
        halfUnitsConsumed: 2,
        source: "seeded",
      }),
    ).rejects.toThrow();
  });

  it("never lets active consuming half-units exceed physical capacity", async () => {
    // Only 30 are available; a 31 half-unit hold must be rejected.
    await expect(
      createReservation(db, {
        editionId,
        kind: "staff_hold",
        status: "held",
        halfUnitsConsumed: 31,
        source: "staff_created",
      }),
    ).rejects.toBeInstanceOf(CapacityError);
  });
});

describe("capacity release", () => {
  it("releases capacity when a reservation is cancelled or expired", async () => {
    const hold = await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 4,
      source: "web_intake",
      packageKey: "double_spot",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(26);

    await transitionReservationStatus(db, {
      reservationId: hold.id,
      toStatus: "cancelled",
      reason: "test_cancel",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(30);

    const hold2 = await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 2,
      source: "web_intake",
      packageKey: "standard_spot",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(28);

    await transitionReservationStatus(db, {
      reservationId: hold2.id,
      toStatus: "expired",
      reason: "hold_expired",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(30);
  });
});

describe("concurrency", () => {
  it("prevents overselling when two holds race for the last standard slot", async () => {
    // Leave exactly 2 half-units (one standard spot) available: 30 - 28 = 2.
    await createReservation(db, {
      editionId,
      kind: "staff_hold",
      status: "held",
      halfUnitsConsumed: 28,
      source: "staff_created",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(2);

    const attempt = () =>
      createReservation(db, {
        editionId,
        kind: "advertiser_hold",
        status: "held",
        halfUnitsConsumed: 2,
        source: "web_intake",
        packageKey: "standard_spot",
      })
        .then(() => "ok" as const)
        .catch((err) => {
          if (err instanceof CapacityError) return "rejected" as const;
          throw err;
        });

    // Genuinely overlapping transactions on separate pooled connections.
    const results = (await Promise.all([attempt(), attempt()])).sort();
    expect(results).toEqual(["ok", "rejected"]);

    const cap = await getEditionCapacity(db, editionId);
    expect(cap.availableHalfUnits).toBe(0);
    expect(cap.consumedHalfUnits).toBeLessThanOrEqual(cap.physicalHalfUnits);
    expect(cap.consumedHalfUnits).toBe(32);
  });
});

describe("audit trail", () => {
  it("writes status history and activity events for create + transition", async () => {
    const hold = await createReservation(db, {
      editionId,
      kind: "advertiser_hold",
      status: "held",
      halfUnitsConsumed: 2,
      source: "web_intake",
      packageKey: "standard_spot",
    });

    await transitionReservationStatus(db, {
      reservationId: hold.id,
      toStatus: "cancelled",
      reason: "test_cancel",
    });

    const history = await db
      .select()
      .from(reservationStatusHistory)
      .where(eq(reservationStatusHistory.reservationId, hold.id));
    // null -> held (create) and held -> cancelled (transition)
    expect(history.length).toBeGreaterThanOrEqual(2);
    expect(history.some((h) => h.fromStatus === null && h.toStatus === "held")).toBe(true);
    expect(
      history.some((h) => h.fromStatus === "held" && h.toStatus === "cancelled"),
    ).toBe(true);

    const events = await db
      .select()
      .from(activityEvents)
      .where(eq(activityEvents.reservationId, hold.id));
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events.some((e) => e.action === "reservation.created")).toBe(true);
    expect(events.some((e) => e.action === "reservation.status_changed")).toBe(true);
  });
});
