/**
 * Phase 1 Postgres enums.
 *
 * Only enums whose columns exist on a Phase 1 table are declared here. Enums
 * for later phases ship with the migration that introduces their table.
 *
 * `listing_status` and `placement_level` ship in Phase 1 because the canonical
 * `businesses` table declares those columns; their entitlement-driven behavior
 * is deferred to Phase 4.
 */
import { pgEnum } from "drizzle-orm/pg-core";

export const editionStatus = pgEnum("edition_status", [
  "draft",
  "selling",
  "locked",
  "in_production",
  "mailed",
  "completed",
  "cancelled",
]);

export const reservationKind = pgEnum("reservation_kind", [
  "advertiser_hold",
  "advertiser_reservation",
  "staff_hold",
  "internal_allocation",
]);

export const reservationStatus = pgEnum("reservation_status", [
  "held",
  "awaiting_payment",
  "paid",
  "in_production",
  "completed",
  "cancelled",
  "expired",
]);

export const packageKey = pgEnum("package_key", [
  "half_spot",
  "standard_spot",
  "double_spot",
]);

export const businessSource = pgEnum("business_source", [
  "seeded",
  "web_intake",
  "vapi_call",
  "staff_created",
  "import",
]);

export const claimStatus = pgEnum("claim_status", [
  "unclaimed",
  "claim_pending",
  "claimed",
]);

export const listingStatus = pgEnum("listing_status", [
  "draft",
  "published",
  "free_claimed",
  "unpublished",
]);

export const placementLevel = pgEnum("placement_level", [
  "standard",
  "featured",
  "featured_premium",
]);

export const activityActorType = pgEnum("activity_actor_type", [
  "user",
  "system",
  "stripe_webhook",
  "ai_agent",
  "import_script",
  "commissiongps",
]);

/**
 * Reservation statuses that consume physical capacity. Capacity is always
 * DERIVED as `physical_capacity_half_units - SUM(half_units_consumed over
 * these statuses)` — never a stored counter.
 */
export const CONSUMING_RESERVATION_STATUSES = [
  "held",
  "awaiting_payment",
  "paid",
  "in_production",
  "completed",
] as const;

/** Statuses that release capacity. */
export const RELEASING_RESERVATION_STATUSES = ["cancelled", "expired"] as const;

export type ReservationStatusValue =
  (typeof reservationStatus.enumValues)[number];
export type ReservationKindValue = (typeof reservationKind.enumValues)[number];
export type PackageKeyValue = (typeof packageKey.enumValues)[number];
export type BusinessSourceValue = (typeof businessSource.enumValues)[number];
export type ActivityActorTypeValue =
  (typeof activityActorType.enumValues)[number];
