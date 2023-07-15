import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { coffeeBeansTastingNotes } from "./coffeeBeansTastingNotes";
import { users } from "./users";

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
  }),
);
