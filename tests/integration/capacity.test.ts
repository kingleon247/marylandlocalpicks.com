/**
 * Real-PostgreSQL integration tests for the Phase 1 capacity model.
 *
 * Runs against DATABASE_TEST_URL only (enforced by the fail-closed guard in the
 * shared test client). Each test starts from a freshly truncated + re-seeded
 * database.
 */
import { and, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { createDbClient } from "@/db/client";
import {
  activityEvents,
  reservationStatusHistory,
  reservations,
} from "@/db/schema";
import { requireTestDatabaseUrl } from "@/lib/env";
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
  it("FOR UPDATE lock: client B blocks until client A commits, then rejects on sold-out capacity", async () => {
    // Leave exactly 2 half-units (one standard spot) available: 30 - 28 = 2.
    await createReservation(db, {
      editionId,
      kind: "staff_hold",
      status: "held",
      halfUnitsConsumed: 28,
      source: "staff_created",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(2);

    // Two independent clients, each capped at one connection, so their
    // transactions are on separate TCP connections and provably overlap.
    const clientA = createDbClient(requireTestDatabaseUrl(), { max: 1 });
    const clientB = createDbClient(requireTestDatabaseUrl(), { max: 1 });

    // Barrier 1: A signals the moment it holds the FOR UPDATE lock.
    let resolveLockAcquired!: () => void;
    // Barrier 2: the test harness tells A when it may commit.
    let resolveAllowCommit!: () => void;
    const lockAcquired = new Promise<void>((r) => {
      resolveLockAcquired = r;
    });
    const allowCommit = new Promise<void>((r) => {
      resolveAllowCommit = r;
    });

    try {
      // --- Transaction A (raw postgres.js for explicit lifecycle control) ---
      // Acquires the edition-row FOR UPDATE lock (the same lock createReservation
      // acquires), signals that it holds it, waits for the harness to say
      // "commit now", inserts the last 2 half-units, then commits.
      // postgres.js auto-commits when the callback resolves.
      const txAPromise = clientA.sql.begin(async (txA) => {
        await txA`
          SELECT id FROM mailing_editions WHERE id = ${editionId} FOR UPDATE
        `;
        resolveLockAcquired(); // A holds the lock; start B now.
        await allowCommit;     // Hold the transaction open until told to commit.
        // Consume the last 2 half-units (capacity will be 32/32 after COMMIT).
        await txA`
          INSERT INTO reservations (edition_id, kind, status, half_units_consumed, source)
          VALUES (${editionId}, 'advertiser_hold', 'held', 2, 'web_intake')
        `;
      });

      // Wait until A definitively holds the lock before launching B.
      await lockAcquired;

      // --- Transaction B (createReservation — the service under test) ---
      // Will issue its own SELECT ... FOR UPDATE on the same edition row and
      // block at the Postgres server until A commits and releases the lock.
      // After unblocking it recomputes consumed capacity, finds 32/32, and
      // throws CapacityError (transaction rolls back automatically).
      const txBPromise = createReservation(clientB.db, {
        editionId,
        kind: "advertiser_hold",
        status: "held",
        halfUnitsConsumed: 2,
        source: "web_intake",
        packageKey: "standard_spot",
      });

      // Yield the event loop so B's BEGIN + SELECT FOR UPDATE reach the Postgres
      // server and genuinely block before we allow A to commit.
      await new Promise<void>((r) => setTimeout(r, 150));

      // Allow A to commit: it inserts the reservation and releases the lock.
      // B unblocks, recomputes consumed (2 internal + 28 staff + 2 from A = 32),
      // finds 0 available, and throws CapacityError.
      resolveAllowCommit();

      const [aResult, bResult] = await Promise.allSettled([txAPromise, txBPromise]);

      expect(aResult.status).toBe("fulfilled");
      expect(bResult.status).toBe("rejected");
      if (bResult.status === "rejected") {
        expect(bResult.reason).toBeInstanceOf(CapacityError);
      }

      // Total consumed: 2 (internal) + 28 (staff) + 2 (A) = 32. B rolled back.
      const cap = await getEditionCapacity(db, editionId);
      expect(cap.availableHalfUnits).toBe(0);
      expect(cap.consumedHalfUnits).toBe(32);
      expect(cap.consumedHalfUnits).toBeLessThanOrEqual(cap.physicalHalfUnits);
    } finally {
      await Promise.allSettled([clientA.close(), clientB.close()]);
    }
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
