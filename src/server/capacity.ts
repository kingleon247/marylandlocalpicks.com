/**
 * Capacity transaction service.
 *
 * Available capacity is DERIVED from capacity-consuming reservation rows; it is
 * never stored as a mutable counter. All capacity-mutating writes funnel through
 * here so they take the edition row lock first.
 *
 * Capacity math (integer half-units, no floats):
 *   available = edition.physical_capacity_half_units
 *               - SUM(half_units_consumed over consuming statuses)
 * The internal Maryland Local Picks allocation is just one consuming row, so it
 * is deducted exactly once (never via a separate ceiling).
 */
import { and, eq, inArray, sql } from "drizzle-orm";

import type { Database } from "@/db/client";
import {
  activityEvents,
  CONSUMING_RESERVATION_STATUSES,
  RELEASING_RESERVATION_STATUSES,
  mailingEditions,
  reservations,
  reservationStatusHistory,
  type ActivityActorTypeValue,
  type BusinessSourceValue,
  type PackageKeyValue,
  type Reservation,
  type ReservationKindValue,
  type ReservationStatusValue,
} from "@/db/schema";

/** Transaction handle type (structurally compatible with `Database`). */
type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/** A read/write executor: either the root db or an open transaction. */
export type DbExecutor = Database | Tx;

export class CapacityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CapacityError";
  }
}

const CONSUMING_STATUSES = [...CONSUMING_RESERVATION_STATUSES];

function isConsumingStatus(status: ReservationStatusValue): boolean {
  return (CONSUMING_RESERVATION_STATUSES as readonly string[]).includes(status);
}

function isReleasingStatus(status: ReservationStatusValue): boolean {
  return (RELEASING_RESERVATION_STATUSES as readonly string[]).includes(status);
}

/** Sum of half-units consumed by active (capacity-consuming) reservations. */
export async function getConsumedHalfUnits(
  exec: DbExecutor,
  editionId: string,
): Promise<number> {
  const [row] = await exec
    .select({
      consumed: sql<number>`COALESCE(SUM(${reservations.halfUnitsConsumed}), 0)::int`,
    })
    .from(reservations)
    .where(
      and(
        eq(reservations.editionId, editionId),
        inArray(reservations.status, CONSUMING_STATUSES),
      ),
    );
  return row?.consumed ?? 0;
}

export interface EditionCapacity {
  editionId: string;
  physicalHalfUnits: number;
  consumedHalfUnits: number;
  availableHalfUnits: number;
}

/** Derived capacity snapshot for an edition (read-only). */
export async function getEditionCapacity(
  exec: DbExecutor,
  editionId: string,
): Promise<EditionCapacity> {
  const [edition] = await exec
    .select({ physical: mailingEditions.physicalCapacityHalfUnits })
    .from(mailingEditions)
    .where(eq(mailingEditions.id, editionId));
  if (!edition) {
    throw new CapacityError(`Edition ${editionId} not found`);
  }
  const consumed = await getConsumedHalfUnits(exec, editionId);
  return {
    editionId,
    physicalHalfUnits: edition.physical,
    consumedHalfUnits: consumed,
    availableHalfUnits: edition.physical - consumed,
  };
}

export interface CreateReservationInput {
  editionId: string;
  kind: ReservationKindValue;
  /** Defaults to 'held'. */
  status?: ReservationStatusValue;
  halfUnitsConsumed: number;
  source: BusinessSourceValue;
  packageKey?: PackageKeyValue | null;
  priceCents?: number | null;
  businessId?: string | null;
  buyerEmail?: string | null;
  buyerName?: string | null;
  holdExpiresAt?: Date | null;
  sourceReference?: string | null;
  reason?: string | null;
  actorType?: ActivityActorTypeValue;
  actorId?: string | null;
  actorLabel?: string | null;
  requestId?: string | null;
}

/**
 * Create a capacity-consuming reservation (hold, paid reservation, staff hold,
 * or internal allocation) under the edition row lock. Rejects when a consuming
 * insert would exceed physical capacity. Writes status history + an activity
 * event in the same transaction.
 */
export async function createReservation(
  db: Database,
  input: CreateReservationInput,
): Promise<Reservation> {
  const status = input.status ?? "held";

  if (input.halfUnitsConsumed <= 0) {
    throw new CapacityError("half_units_consumed must be a positive integer");
  }

  return db.transaction(async (tx) => {
    // Lock the edition row: serializes all concurrent capacity checks for this
    // edition. A second concurrent createReservation blocks here until the
    // first transaction commits, then sees the first row in its SUM.
    const [edition] = await tx
      .select()
      .from(mailingEditions)
      .where(eq(mailingEditions.id, input.editionId))
      .for("update");
    if (!edition) {
      throw new CapacityError(`Edition ${input.editionId} not found`);
    }

    if (isConsumingStatus(status)) {
      const consumed = await getConsumedHalfUnits(tx, input.editionId);
      const available = edition.physicalCapacityHalfUnits - consumed;
      if (input.halfUnitsConsumed > available) {
        throw new CapacityError(
          `Sold out: requested ${input.halfUnitsConsumed} half-units but only ${available} available`,
        );
      }
    }

    const [reservation] = await tx
      .insert(reservations)
      .values({
        editionId: input.editionId,
        kind: input.kind,
        status,
        halfUnitsConsumed: input.halfUnitsConsumed,
        source: input.source,
        packageKey: input.packageKey ?? null,
        priceCents: input.priceCents ?? null,
        businessId: input.businessId ?? null,
        buyerEmail: input.buyerEmail ?? null,
        buyerName: input.buyerName ?? null,
        holdExpiresAt: input.holdExpiresAt ?? null,
        sourceReference: input.sourceReference ?? null,
      })
      .returning();

    await tx.insert(reservationStatusHistory).values({
      reservationId: reservation.id,
      fromStatus: null,
      toStatus: status,
      reason: input.reason ?? "reservation_created",
      actorType: input.actorType ?? "system",
      actorId: input.actorId ?? null,
    });

    await tx.insert(activityEvents).values({
      actorType: input.actorType ?? "system",
      actorId: input.actorId ?? null,
      actorLabel: input.actorLabel ?? null,
      action: "reservation.created",
      entityType: "reservation",
      entityId: reservation.id,
      reservationId: reservation.id,
      newValue: {
        kind: input.kind,
        status,
        halfUnitsConsumed: input.halfUnitsConsumed,
        packageKey: input.packageKey ?? null,
      },
      requestId: input.requestId ?? null,
    });

    return reservation;
  });
}

export interface TransitionInput {
  reservationId: string;
  toStatus: ReservationStatusValue;
  reason?: string | null;
  actorType?: ActivityActorTypeValue;
  actorId?: string | null;
}

/**
 * Transition a reservation to a new status, writing history + activity. When
 * the target status releases capacity (cancelled/expired) the row is stamped
 * with released_at/release_reason; capacity reopens automatically because the
 * row leaves the consuming set. Refunds are NOT modeled here (Phase 2).
 */
export async function transitionReservationStatus(
  db: Database,
  input: TransitionInput,
): Promise<Reservation> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(reservations)
      .where(eq(reservations.id, input.reservationId))
      .for("update");
    if (!current) {
      throw new CapacityError(`Reservation ${input.reservationId} not found`);
    }

    const releasing = isReleasingStatus(input.toStatus);
    const [updated] = await tx
      .update(reservations)
      .set({
        status: input.toStatus,
        releasedAt: releasing ? new Date() : current.releasedAt,
        releaseReason: releasing
          ? input.reason ?? "released"
          : current.releaseReason,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, input.reservationId))
      .returning();

    await tx.insert(reservationStatusHistory).values({
      reservationId: input.reservationId,
      fromStatus: current.status,
      toStatus: input.toStatus,
      reason: input.reason ?? null,
      actorType: input.actorType ?? "system",
      actorId: input.actorId ?? null,
    });

    await tx.insert(activityEvents).values({
      actorType: input.actorType ?? "system",
      actorId: input.actorId ?? null,
      action: "reservation.status_changed",
      entityType: "reservation",
      entityId: input.reservationId,
      reservationId: input.reservationId,
      previousValue: { status: current.status },
      newValue: { status: input.toStatus },
    });

    return updated;
  });
}
