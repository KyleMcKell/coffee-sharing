import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { coffeeBeansTastingNotesTable } from "~/db/schema/coffeeBeansTastingNotes";
import { usersTable } from "~/db/schema/users";

export const tastingNotesTable = pgTable("tasting_notes", {
  id: uuid("id").notNull().primaryKey(),
  note: varchar("name", { length: 255 }).notNull(),
  baristaId: varchar("barista_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tastingNoteRelations = relations(
  tastingNotesTable,
  ({ one, many }) => ({
    barista: one(usersTable, {
      fields: [tastingNotesTable.baristaId],
      references: [usersTable.id],
    }),
    coffeeBeansToTastingNotes: many(coffeeBeansTastingNotesTable),
  }),
);
