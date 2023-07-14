import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users";
import { coffeeBeansTastingNotes } from "./coffeeBeansTastingNotes";

export const tastingNotes = pgTable("tasting_notes", {
  id: uuid("id").notNull().primaryKey(),
  note: varchar("name", { length: 255 }).notNull(),
  baristaId: varchar("barista_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tastingNoteRelations = relations(
  tastingNotes,
  ({ one, many }) => ({
    barista: one(users, {
      fields: [tastingNotes.baristaId],
      references: [users.id],
    }),
    coffeeBeansToTastingNotes: many(coffeeBeansTastingNotes),
  })
);
