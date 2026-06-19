/**
 * Canonical `businesses` table (identity + public listing content).
 *
 * This is the single representation of a business, whether seeded/unclaimed or
 * later claimed. It replaces the original directory `businesses` table and the
 * proposed `business_listings` / `advertiser_profiles` tables — listing content
 * lives here and is edited in place.
 *
 * Correction 1 (deferred FKs): `claimed_by_org_id` is a plain nullable UUID in
 * Phase 1 with NO foreign key. The FK to `advertiser_organizations` is added by
 * an additive Phase 3 migration.
 */
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { businessSource, claimStatus, listingStatus, placementLevel } from "./enums";
import { categories } from "./reference";

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 180 }).notNull(),
    // categories exists in Phase 1, so this is a real (nullable) FK.
    categoryId: uuid("category_id").references(() => categories.id),
    citySlug: varchar("city_slug", { length: 120 }),
    googlePlaceId: varchar("google_place_id", { length: 180 }),

    // Listing content (preserved from the directory schema).
    description: text("description"),
    tagline: varchar("tagline", { length: 240 }),
    publicPhone: varchar("public_phone", { length: 40 }),
    publicEmail: varchar("public_email", { length: 180 }),
    website: text("website"),
    address: text("address"),
    serviceArea: text("service_area"),
    hours: jsonb("hours"),
    socialUrls: jsonb("social_urls"),

    // Claim/ownership.
    claimStatus: claimStatus("claim_status").default("unclaimed").notNull(),
    // Correction 1: plain nullable UUID, NO FK in Phase 1 (FK added Phase 3).
    claimedByOrgId: uuid("claimed_by_org_id"),

    // Listing lifecycle columns ship in Phase 1; entitlement-driven behavior
    // is exercised in Phase 4. Defaults only in Phase 1.
    listingStatus: listingStatus("listing_status").default("draft").notNull(),
    currentPlacementLevel: placementLevel("current_placement_level")
      .default("standard")
      .notNull(),

    // Provenance + external linkage (linkage written when known, no FK).
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
    // Dedup of seeded vs later-claimed businesses; only enforced when present.
    uniqueIndex("uniq_businesses_google_place_id")
      .on(table.googlePlaceId)
      .where(sql`${table.googlePlaceId} IS NOT NULL`),
    index("idx_businesses_city_listing").on(
      table.citySlug,
      table.listingStatus,
    ),
    index("idx_businesses_claim_status").on(table.claimStatus),
    index("idx_businesses_claimed_by_org").on(table.claimedByOrgId),
  ],
);

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
