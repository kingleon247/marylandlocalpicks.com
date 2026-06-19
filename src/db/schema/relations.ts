/**
 * Drizzle relations for the Phase 1 tables. Only relationships whose target
 * tables exist in Phase 1 are declared (deferred org/user relationships arrive
 * with their phases).
 */
import { relations } from "drizzle-orm";

import { activityEvents } from "./activity";
import { businesses } from "./businesses";
import { editionPackages, mailingEditions } from "./editions";
import { categories } from "./reference";
import { reservations, reservationStatusHistory } from "./reservations";

export const categoriesRelations = relations(categories, ({ many }) => ({
  businesses: many(businesses),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  category: one(categories, {
    fields: [businesses.categoryId],
    references: [categories.id],
  }),
  reservations: many(reservations),
}));

export const mailingEditionsRelations = relations(
  mailingEditions,
  ({ many }) => ({
    packages: many(editionPackages),
    reservations: many(reservations),
  }),
);

export const editionPackagesRelations = relations(
  editionPackages,
  ({ one }) => ({
    edition: one(mailingEditions, {
      fields: [editionPackages.editionId],
      references: [mailingEditions.id],
    }),
  }),
);

export const reservationsRelations = relations(
  reservations,
  ({ one, many }) => ({
    edition: one(mailingEditions, {
      fields: [reservations.editionId],
      references: [mailingEditions.id],
    }),
    business: one(businesses, {
      fields: [reservations.businessId],
      references: [businesses.id],
    }),
    statusHistory: many(reservationStatusHistory),
    activityEvents: many(activityEvents),
  }),
);

export const reservationStatusHistoryRelations = relations(
  reservationStatusHistory,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [reservationStatusHistory.reservationId],
      references: [reservations.id],
    }),
  }),
);

export const activityEventsRelations = relations(activityEvents, ({ one }) => ({
  reservation: one(reservations, {
    fields: [activityEvents.reservationId],
    references: [reservations.id],
  }),
}));
