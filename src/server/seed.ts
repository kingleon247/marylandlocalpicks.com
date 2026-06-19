/**
 * Idempotent Phase 1 seed (Catonsville Edition 1).
 *
 * Safe to run repeatedly: every insert is guarded by a unique key / existence
 * check, and the single internal allocation is created only when absent (with
 * the partial unique index as a database-level backstop). Running the seed
 * twice must NOT create a second internal allocation, so available capacity
 * stays at 30, never 28.
 *
 * Exported as a function so both the CLI (`npm run db:seed`, dev) and the test
 * harness (test database) can seed without duplicating logic.
 */
import { eq } from "drizzle-orm";

import type { Database } from "@/db/client";
import {
  businesses,
  categories,
  cities,
  editionPackages,
  mailingEditions,
  type PackageKeyValue,
} from "@/db/schema";
import {
  getEditionCapacity,
  createReservation,
  type EditionCapacity,
} from "@/server/capacity";
import { getActiveInternalAllocation } from "@/server/editions";

export const CATONSVILLE_CITY_SLUG = "catonsville";
export const CATONSVILLE_EDITION_SLUG = "catonsville-edition-1";
export const INTERNAL_ALLOCATION_HALF_UNITS = 2;

interface SeedPackage {
  packageKey: PackageKeyValue;
  displayName: string;
  halfUnitsConsumed: number;
  priceCents: number;
}

export const SEED_PACKAGES: readonly SeedPackage[] = [
  { packageKey: "half_spot", displayName: "Half Spot", halfUnitsConsumed: 1, priceCents: 35_000 },
  { packageKey: "standard_spot", displayName: "Standard Spot", halfUnitsConsumed: 2, priceCents: 60_000 },
  { packageKey: "double_spot", displayName: "Double Spot", halfUnitsConsumed: 4, priceCents: 110_000 },
];

const SEED_CATEGORIES: readonly { name: string; slug: string; sortOrder: number }[] = [
  { name: "Home Services", slug: "home-services", sortOrder: 10 },
  { name: "Restaurants", slug: "restaurants", sortOrder: 20 },
];

const SEED_BUSINESSES: readonly {
  slug: string;
  name: string;
  categorySlug: string;
  publicPhone: string;
}[] = [
  { slug: "catonsville-handyman-co", name: "Catonsville Handyman Co.", categorySlug: "home-services", publicPhone: "443-555-0101" },
  { slug: "frederick-road-pizza", name: "Frederick Road Pizza", categorySlug: "restaurants", publicPhone: "443-555-0102" },
  { slug: "patapsco-lawn-care", name: "Patapsco Lawn Care", categorySlug: "home-services", publicPhone: "443-555-0103" },
];

export interface SeedResult {
  editionId: string;
  capacity: EditionCapacity;
  internalAllocationCreated: boolean;
}

export async function seedInitialEdition(db: Database): Promise<SeedResult> {
  // 1. Reference data (cities + categories), idempotent on slug.
  await db
    .insert(cities)
    .values({ name: "Catonsville", slug: CATONSVILLE_CITY_SLUG, state: "MD", isActive: true })
    .onConflictDoNothing({ target: cities.slug });

  await db
    .insert(categories)
    .values(SEED_CATEGORIES.map((c) => ({ name: c.name, slug: c.slug, sortOrder: c.sortOrder })))
    .onConflictDoNothing({ target: categories.slug });

  const categoryIdBySlug = new Map<string, string>();
  for (const row of await db.select({ id: categories.id, slug: categories.slug }).from(categories)) {
    categoryIdBySlug.set(row.slug, row.id);
  }

  // 2. Mailing edition (32 half-units), idempotent on slug.
  await db
    .insert(mailingEditions)
    .values({
      citySlug: CATONSVILLE_CITY_SLUG,
      name: "Catonsville Edition 1",
      slug: CATONSVILLE_EDITION_SLUG,
      dropNumber: 1,
      physicalCapacityHalfUnits: 32,
      status: "selling",
    })
    .onConflictDoNothing({ target: mailingEditions.slug });

  const [edition] = await db
    .select()
    .from(mailingEditions)
    .where(eq(mailingEditions.slug, CATONSVILLE_EDITION_SLUG));
  if (!edition) {
    throw new Error("Failed to seed Catonsville Edition 1");
  }

  // 3. Package catalog, idempotent on (edition_id, package_key).
  await db
    .insert(editionPackages)
    .values(
      SEED_PACKAGES.map((p) => ({
        editionId: edition.id,
        packageKey: p.packageKey,
        displayName: p.displayName,
        halfUnitsConsumed: p.halfUnitsConsumed,
        priceCents: p.priceCents,
      })),
    )
    .onConflictDoNothing({
      target: [editionPackages.editionId, editionPackages.packageKey],
    });

  // 4. Seeded (unclaimed) businesses, idempotent on slug.
  await db
    .insert(businesses)
    .values(
      SEED_BUSINESSES.map((b) => ({
        slug: b.slug,
        name: b.name,
        citySlug: CATONSVILLE_CITY_SLUG,
        categoryId: categoryIdBySlug.get(b.categorySlug) ?? null,
        publicPhone: b.publicPhone,
        claimStatus: "unclaimed" as const,
        listingStatus: "draft" as const,
        currentPlacementLevel: "standard" as const,
        source: "seeded" as const,
      })),
    )
    .onConflictDoNothing({ target: businesses.slug });

  // 5. The ONE internal Maryland Local Picks allocation (2 half-units).
  //    Created only when no active allocation exists — re-running the seed
  //    must never produce a second one (would drop available 30 -> 28).
  const existing = await getActiveInternalAllocation(db, edition.id);
  let internalAllocationCreated = false;
  if (!existing) {
    await createReservation(db, {
      editionId: edition.id,
      kind: "internal_allocation",
      status: "completed",
      halfUnitsConsumed: INTERNAL_ALLOCATION_HALF_UNITS,
      source: "seeded",
      reason: "internal_allocation_seed",
      actorType: "import_script",
      actorLabel: "seed:initial-edition",
    });
    internalAllocationCreated = true;
  }

  const capacity = await getEditionCapacity(db, edition.id);
  return { editionId: edition.id, capacity, internalAllocationCreated };
}
