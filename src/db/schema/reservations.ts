/**
 * `reservations` — THE single capacity-consuming table. Advertiser holds, paid
 * reservations, staff holds, and the internal Maryland Local Picks allocation
 * all live here, distinguished by `kind` + `status`.
 *
 * Correction 1 (deferred FKs): `advertiser_org_id` and `assigned_salesperson_id`
 * are plain nullable UUIDs with NO foreign key in Phase 1 (FKs added Phase 3).
 * `edition_id` and `business_id` reference tables that exist in Phase 1, so they
 * are real foreign keys.
 *
 * Correction 3 (internal allocation invariant): a positive-half-units check
 * applies to every reservation; internal allocations must consume exactly 2;
 * and a partial unique index allows at most ONE active internal allocation per
 * edition. Released (cancelled/expired) allocations do not block a new one and
 * do not consume capacity.
 */
import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { businesses } from "./businesses";
import { mailingEditions } from "./editions";
import {
  activityActorType,
  businessSource,
  packageKey,
  reservationKind,
  reservationStatus,
} from "./enums";

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    editionId: uuid("edition_id")
      .references(() => mailingEditions.id)
      .notNull(),
    // Correction 1: plain nullable UUID, NO FK in Phase 1 (FK added Phase 3).
    advertiserOrgId: uuid("advertiser_org_id"),
    // businesses exists in Phase 1, so this is a real (nullable) FK.
    businessId: uuid("business_id").references(() => businesses.id),
    // Contact captured at checkout before an org exists (used from Phase 2).
    buyerEmail: varchar("buyer_email", { length: 180 }),
    buyerName: varchar("buyer_name", { length: 180 }),
    packageKey: packageKey("package_key"),
    kind: reservationKind("kind").notNull(),
    status: reservationStatus("status").notNull(),
    halfUnitsConsumed: integer("half_units_consumed").notNull(),
    // Snapshotted at hold/reservation creation; immutable after payment.
    priceCents: integer("price_cents"),
    currency: varchar("currency", { length: 8 }).default("usd").notNull(),
    // Correction 1: plain nullable UUID, NO FK in Phase 1 (FK added Phase 3).
    assignedSalespersonId: uuid("assigned_salesperson_id"),
    // Stripe columns ship now (nullable, unused until Phase 2) to avoid a later
    // ALTER; no Stripe behavior is implemented in Phase 1.
    stripeCheckoutSessionId: varchar("stripe_checkout_session_id", {
      length: 255,
    }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    releaseReason: varchar("release_reason", { length: 255 }),
    source: businessSource("source").notNull(),
    sourceReference: varchar("source_reference", { length: 255 }),
    commissiongpsLeadId: varchar("commissiongps_lead_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_reservations_edition_status").on(table.editionId, table.status),
    index("idx_reservations_edition_kind_status").on(
      table.editionId,
      table.kind,
      table.status,
    ),
    index("idx_reservations_advertiser_org").on(table.advertiserOrgId),
    index("idx_reservations_business").on(table.businessId),
    uniqueIndex("uniq_reservations_checkout_session")
      .on(table.stripeCheckoutSessionId)
      .where(sql`${table.stripeCheckoutSessionId} IS NOT NULL`),
    // Expiry sweep index (Phase 2 behavior; index ships now, harmless).
    index("idx_reservations_hold_expiry")
      .on(table.holdExpiresAt)
      .where(sql`${table.status} IN ('held', 'awaiting_payment')`),
    // Correction 3: positive half-units for every reservation.
    check(
      "chk_reservations_half_units_positive",
      sql`${table.halfUnitsConsumed} > 0`,
    ),
    // Correction 3: an internal allocation must consume exactly 2 half-units.
    check(
      "chk_internal_allocation_exactly_two",
      sql`${table.kind} <> 'internal_allocation' OR ${table.halfUnitsConsumed} = 2`,
    ),
    // Correction 3: at most ONE active internal allocation per edition.
    // Released (cancelled/expired) allocations are excluded so historical rows
    // neither block a new allocation nor consume capacity.
    uniqueIndex("uniq_active_internal_allocation_per_edition")
      .on(table.editionId)
      .where(
        sql`${table.kind} = 'internal_allocation' AND ${table.status} IN ('held', 'awaiting_payment', 'paid', 'in_production', 'completed')`,
      ),
  ],
);

export const reservationStatusHistory = pgTable(
  "reservation_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reservationId: uuid("reservation_id")
      .references(() => reservations.id)
      .notNull(),
    fromStatus: reservationStatus("from_status"),
    toStatus: reservationStatus("to_status").notNull(),
    reason: varchar("reason", { length: 500 }),
    actorType: activityActorType("actor_type").notNull(),
    // Plain nullable UUID (actor may be a user added in Phase 3); no FK.
    actorId: uuid("actor_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_reservation_status_history_reservation").on(
      table.reservationId,
      table.createdAt,
    ),
  ],
);

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type ReservationStatusHistoryRow =
  typeof reservationStatusHistory.$inferSelect;
export type NewReservationStatusHistoryRow =
  typeof reservationStatusHistory.$inferInsert;
