/**
 * `activity_events` — universal append-only audit log for sensitive writes,
 * status changes, and (later) AI-agent actions. Never updated or deleted.
 *
 * Correction 1 (deferred FKs): `advertiser_org_id` is a plain nullable UUID
 * with NO foreign key in Phase 1 (FK added Phase 3). `reservation_id` may
 * reference `reservations`, which exists in Phase 1.
 *
 * This operational/audit log is intentionally separate from future public web
 * engagement events (`listing_events`, Phase 4+).
 */
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { reservations } from "./reservations";
import { activityActorType } from "./enums";

export const activityEvents = pgTable(
  "activity_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorType: activityActorType("actor_type").notNull(),
    // Plain nullable UUID (actor may be a user added in Phase 3); no FK.
    actorId: uuid("actor_id"),
    actorLabel: varchar("actor_label", { length: 255 }),
    action: varchar("action", { length: 120 }).notNull(),
    entityType: varchar("entity_type", { length: 120 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    // reservations exists in Phase 1, so this is a real (nullable) FK.
    reservationId: uuid("reservation_id").references(() => reservations.id),
    // Correction 1: plain nullable UUID, NO FK in Phase 1 (FK added Phase 3).
    advertiserOrgId: uuid("advertiser_org_id"),
    previousValue: jsonb("previous_value"),
    newValue: jsonb("new_value"),
    metadata: jsonb("metadata"),
    requestId: varchar("request_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_activity_events_entity").on(table.entityType, table.entityId),
    index("idx_activity_events_reservation").on(table.reservationId),
    index("idx_activity_events_advertiser_org").on(table.advertiserOrgId),
    index("idx_activity_events_created_at").on(table.createdAt),
  ],
);

export type ActivityEvent = typeof activityEvents.$inferSelect;
export type NewActivityEvent = typeof activityEvents.$inferInsert;
