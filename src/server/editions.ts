/**
 * Read-side data layer for mailing editions + their package catalog.
 */
import { and, eq, inArray } from "drizzle-orm";

import {
  CONSUMING_RESERVATION_STATUSES,
  editionPackages,
  mailingEditions,
  reservations,
  type EditionPackage,
  type MailingEdition,
  type Reservation,
} from "@/db/schema";
import type { DbExecutor } from "@/server/capacity";

export async function getEditionBySlug(
  exec: DbExecutor,
  slug: string,
): Promise<MailingEdition | undefined> {
  const [edition] = await exec
    .select()
    .from(mailingEditions)
    .where(eq(mailingEditions.slug, slug));
  return edition;
}

export async function getEditionById(
  exec: DbExecutor,
  id: string,
): Promise<MailingEdition | undefined> {
  const [edition] = await exec
    .select()
    .from(mailingEditions)
    .where(eq(mailingEditions.id, id));
  return edition;
}

export async function listEditionPackages(
  exec: DbExecutor,
  editionId: string,
): Promise<EditionPackage[]> {
  return exec
    .select()
    .from(editionPackages)
    .where(eq(editionPackages.editionId, editionId));
}

/** The single active internal allocation for an edition, if present. */
export async function getActiveInternalAllocation(
  exec: DbExecutor,
  editionId: string,
): Promise<Reservation | undefined> {
  const [row] = await exec
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.editionId, editionId),
        eq(reservations.kind, "internal_allocation"),
        inArray(reservations.status, [...CONSUMING_RESERVATION_STATUSES]),
      ),
    );
  return row;
}
