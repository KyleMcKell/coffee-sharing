import { pgTable, varchar, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./user";
import { coffeeBeanTastingNote } from "./coffeeBeanTastingNote";

export const tastingNote = pgTable("tasting_note", {
  id: uuid("id").notNull().primaryKey(),
  note: varchar("name", { length: 255 }).notNull(),
  baristaId: varchar("barista_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coffeeBeansRelations = relations(tastingNote, ({ one, many }) => ({
  barista: one(user, {
    fields: [tastingNote.baristaId],
    references: [user.id],
  }),
  coffeeBeansToTastingNotes: many(coffeeBeanTastingNote),
}));
