import { pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { coffeeBean } from "./coffeeBean";
import { tastingNote } from "./tastingNote";

export const coffeeBeanTastingNote = pgTable("coffee_bean_tasting_note", {
  id: uuid("id").notNull().primaryKey(),
  coffeeBeanId: uuid("id")
    .notNull()
    .references(() => coffeeBean.id),
  tastingNoteId: uuid("id")
    .notNull()
    .references(() => tastingNote.id),
});

export const coffeeBeansToTastingNotesRelations = relations(
  coffeeBeanTastingNote,
  ({ one }) => ({
    coffeeBean: one(coffeeBean, {
      fields: [coffeeBeanTastingNote.coffeeBeanId],
      references: [coffeeBean.id],
    }),
    tastingNotes: one(tastingNote, {
      fields: [coffeeBeanTastingNote.tastingNoteId],
      references: [tastingNote.id],
    }),
  })
);
