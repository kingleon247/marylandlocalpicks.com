/**
 * Reference data carried over from the original (unused) directory schema.
 * Phase 1 keeps cities + categories as reference tables. The old directory
 * `business_placements`, `offers`, and `picks_of_the_week` tables are NOT
 * recreated in Phase 1 — they are deferred public-guide content and can be
 * reintroduced additively later.
 */
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  state: varchar("state", { length: 2 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  sortOrder: integer("sort_order").default(0).notNull(),
});
