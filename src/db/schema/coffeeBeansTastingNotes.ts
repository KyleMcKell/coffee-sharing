import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { coffeeBeansTable } from "~/db/schema/coffeeBeans";
import { tastingNotesTable } from "~/db/schema/tastingNotes";

export const coffeeBeansTastingNotesTable = pgTable(
  "coffee_beans_tasting_notes",
  {
    id: uuid("id").notNull().primaryKey(),
    coffeeBeanId: uuid("coffee_bean_id")
      .notNull()
      .references(() => coffeeBeansTable.id),
    tastingNoteId: uuid("tasting_note_id")
      .notNull()
      .references(() => tastingNotesTable.id),
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
  coffeeBeansTastingNotesTable,
  ({ one }) => ({
    coffeeBean: one(coffeeBeansTable, {
      fields: [coffeeBeansTastingNotesTable.coffeeBeanId],
      references: [coffeeBeansTable.id],
    }),
    tastingNotes: one(tastingNotesTable, {
      fields: [coffeeBeansTastingNotesTable.tastingNoteId],
      references: [tastingNotesTable.id],
    }),
  }),
);
