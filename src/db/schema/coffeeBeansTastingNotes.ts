import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { coffeeBeans } from "./coffeeBeans";
import { tastingNotes } from "./tastingNotes";

export const coffeeBeansTastingNotes = pgTable(
  "coffee_beans_tasting_notes",
  {
    id: uuid("id").notNull().primaryKey(),
    coffeeBeanId: uuid("coffee_bean_id")
      .notNull()
      .references(() => coffeeBeans.id),
    tastingNoteId: uuid("tasting_note_id")
      .notNull()
      .references(() => tastingNotes.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (cbtn) => {
    return {
      coffeeBeanIdx: index("coffee_bean_idx").on(cbtn.coffeeBeanId),
      tastingNoteIdx: index("tasting_note_idx").on(cbtn.tastingNoteId),
    };
  },
);

export const coffeeBeansToTastingNotesRelations = relations(
  coffeeBeansTastingNotes,
  ({ one }) => ({
    coffeeBean: one(coffeeBeans, {
      fields: [coffeeBeansTastingNotes.coffeeBeanId],
      references: [coffeeBeans.id],
    }),
    tastingNotes: one(tastingNotes, {
      fields: [coffeeBeansTastingNotes.tastingNoteId],
      references: [tastingNotes.id],
    }),
  }),
);
