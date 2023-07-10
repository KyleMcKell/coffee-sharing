import { pgTable, varchar, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./user";
import { coffeeBeanTastingNote } from "./coffeeBeanTastingNote";

export const tastingNote = pgTable("tasting_note", {
  id: uuid("id").notNull().primaryKey(),
  baristaId: varchar("baristaId", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }),
  tasteNotes: jsonb("tasteNotes").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const coffeeBeansRelations = relations(tastingNote, ({ one, many }) => ({
  barista: one(user, {
    fields: [tastingNote.baristaId],
    references: [user.id],
  }),
  coffeeBeansToTastingNotes: many(coffeeBeanTastingNote),
}));
