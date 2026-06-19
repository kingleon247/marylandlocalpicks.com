/**
 * Mailing editions + per-edition package catalog.
 *
 * Capacity is integer half-units. There is ONLY `physical_capacity_half_units`
 * (32 for the standard card). There is no stored sellable ceiling and no stored
 * "remaining" counter — available capacity is derived from reservation rows.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { editionStatus, packageKey } from "./enums";

export const mailingEditions = pgTable(
  "mailing_editions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    citySlug: varchar("city_slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    dropNumber: integer("drop_number"),
    physicalCapacityHalfUnits: integer("physical_capacity_half_units")
      .default(32)
      .notNull(),
    mailDate: timestamp("mail_date", { withTimezone: true }),
    salesOpenAt: timestamp("sales_open_at", { withTimezone: true }),
    salesCloseAt: timestamp("sales_close_at", { withTimezone: true }),
    status: editionStatus("status").default("draft").notNull(),
    notes: varchar("notes", { length: 1000 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_mailing_editions_status").on(table.status),
    index("idx_mailing_editions_city").on(table.citySlug),
    check(
      "chk_mailing_editions_capacity_nonneg",
      sql`${table.physicalCapacityHalfUnits} >= 0`,
    ),
  ],
);

export const editionPackages = pgTable(
  "edition_packages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    editionId: uuid("edition_id")
      .references(() => mailingEditions.id)
      .notNull(),
    packageKey: packageKey("package_key").notNull(),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    halfUnitsConsumed: integer("half_units_consumed").notNull(),
    priceCents: integer("price_cents").notNull(),
    // Stripe price ids are unused until Stripe (Phase 2); nullable columns ship
    // now to avoid a later ALTER.
    stripePriceIdTest: varchar("stripe_price_id_test", { length: 255 }),
    stripePriceIdLive: varchar("stripe_price_id_live", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("uniq_edition_packages_edition_key").on(
      table.editionId,
      table.packageKey,
    ),
    check(
      "chk_edition_packages_half_units_positive",
      sql`${table.halfUnitsConsumed} > 0`,
    ),
  ],
);

export type MailingEdition = typeof mailingEditions.$inferSelect;
export type NewMailingEdition = typeof mailingEditions.$inferInsert;
export type EditionPackage = typeof editionPackages.$inferSelect;
export type NewEditionPackage = typeof editionPackages.$inferInsert;
