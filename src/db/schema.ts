import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const adSize = pgEnum("ad_size", [
  "digital_only",
  "half",
  "single",
  "double",
  "quad",
]);

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

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  tagline: varchar("tagline", { length: 240 }),
  description: text("description"),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 180 }),
  website: text("website"),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const businessPlacements = pgTable("business_placements", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  cityId: uuid("city_id")
    .references(() => cities.id)
    .notNull(),
  size: adSize("size").default("digital_only").notNull(),
  qrCodeKey: varchar("qr_code_key", { length: 180 }),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
});

export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  details: text("details"),
  code: varchar("code", { length: 80 }),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
});

export const picksOfTheWeek = pgTable("picks_of_the_week", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  cityId: uuid("city_id")
    .references(() => cities.id)
    .notNull(),
  headline: varchar("headline", { length: 180 }).notNull(),
  story: text("story"),
  weekOf: timestamp("week_of", { withTimezone: true }).notNull(),
  isSponsored: boolean("is_sponsored").default(false).notNull(),
});
