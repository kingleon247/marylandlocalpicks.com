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
  it("FOR UPDATE lock: pg_stat_activity confirms B is blocked before A commits", async () => {
    // Leave exactly 2 half-units (one standard spot) available: 30 - 28 = 2.
    await createReservation(db, {
      editionId,
      kind: "staff_hold",
      status: "held",
      halfUnitsConsumed: 28,
      source: "staff_created",
    });
    expect((await getEditionCapacity(db, editionId)).availableHalfUnits).toBe(2);

    const testUrl = requireTestDatabaseUrl();

    // Three independent single-connection clients:
    //   A        — holds the FOR UPDATE lock with explicit lifecycle control
    //   B        — calls createReservation(); identified in pg_stat_activity by
    //              a unique application_name so the observer can confirm it blocks
    //   Observer — queries pg_stat_activity to confirm B is genuinely blocked at
    //              the PostgreSQL server before releasing A
    const clientA = createDbClient(testUrl, { max: 1 });
    const clientB = createDbClient(testUrl, { max: 1, applicationName: "mlp_test_txb" });
    const observer = createDbClient(testUrl, { max: 1 });

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
      // acquires), signals, holds the transaction open, then inserts the last 2
      // half-units and auto-commits when the callback resolves.
      const txAPromise = clientA.sql.begin(async (txA) => {
        await txA`
          SELECT id FROM mailing_editions WHERE id = ${editionId} FOR UPDATE
        `;
        resolveLockAcquired(); // A holds the lock; B can now try to acquire it.
        await allowCommit;     // Hold open until the observer confirms B is blocked.
        // Consume the last 2 half-units (capacity = 32/32 after COMMIT).
        await txA`
          INSERT INTO reservations (edition_id, kind, status, half_units_consumed, source)
          VALUES (${editionId}, 'advertiser_hold', 'held', 2, 'web_intake')
        `;
      });

      // Wait until A definitively holds the lock, then start B.
      await lockAcquired;

      // --- Transaction B (createReservation — the service under test) ---
      // Issues its own SELECT ... FOR UPDATE on the same edition row and blocks
      // at the PostgreSQL server until A commits and releases the lock. After
      // unblocking it recomputes consumed capacity (32/32) and throws CapacityError.
      const txBPromise = createReservation(clientB.db, {
        editionId,
        kind: "advertiser_hold",
        status: "held",
        halfUnitsConsumed: 2,
        source: "web_intake",
        packageKey: "standard_spot",
      });

      // Positively confirm B is blocked on A's lock at the PostgreSQL server
      // level before releasing A. Uses B's unique application_name to find its
      // backend in pg_stat_activity and waits for wait_event_type = 'Lock'.
      // Short 50 ms poll intervals; fails hard with a 10 s bounded timeout.
      const POLL_MS = 50;
      const TIMEOUT_MS = 10_000;
      const deadline = Date.now() + TIMEOUT_MS;
      let confirmed = false;
      while (Date.now() < deadline) {
        const rows = await observer.sql`
          SELECT COUNT(*)::int AS cnt
          FROM pg_stat_activity
          WHERE application_name = ${"mlp_test_txb"}
            AND wait_event_type = ${"Lock"}
            AND datname = current_database()
        `;
        const cnt = (rows[0] as { cnt: number } | undefined)?.cnt ?? 0;
        if (cnt > 0) {
          confirmed = true;
          break;
        }
        await new Promise<void>((r) => setTimeout(r, POLL_MS));
      }
      if (!confirmed) {
        throw new Error(
          `Timed out after ${TIMEOUT_MS / 1000}s: pg_stat_activity never showed ` +
            `application_name='mlp_test_txb' in a Lock wait state. ` +
            `Transaction overlap cannot be proven.`,
        );
      }

      // B is confirmed blocked on A's row lock at the PostgreSQL server level.
      // Release A: it inserts the last 2 half-units and commits. B unblocks,
      // finds consumed = 32, finds 0 available, throws CapacityError, rolls back.
      resolveAllowCommit();

      const [aResult, bResult] = await Promise.allSettled([txAPromise, txBPromise]);

      expect(aResult.status).toBe("fulfilled");
      expect(bResult.status).toBe("rejected");
      if (bResult.status === "rejected") {
        expect(bResult.reason).toBeInstanceOf(CapacityError);
      }

      // Total: 2 (internal) + 28 (staff) + 2 (A) = 32. B rolled back — stays 32.
      const cap = await getEditionCapacity(db, editionId);
      expect(cap.availableHalfUnits).toBe(0);
      expect(cap.consumedHalfUnits).toBe(32);
      expect(cap.consumedHalfUnits).toBeLessThanOrEqual(cap.physicalHalfUnits);
    } finally {
      // Resolve allowCommit so A's transaction can finish even if the test
      // failed before the normal resolveAllowCommit() call above (prevents
      // clientA.close() from hanging on an open transaction).
      resolveAllowCommit();
      await Promise.allSettled([clientA.close(), clientB.close(), observer.close()]);
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
