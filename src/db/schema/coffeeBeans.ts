import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { coffeeBeansTastingNotesTable } from "./coffeeBeansTastingNotes";
import { usersTable } from "./users";

export const coffeeBeansTable = pgTable(
  "coffee_beans",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    baristaId: varchar("barista_id", { length: 255 })
      .notNull()
      .references(() => usersTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    brand: varchar("brand", { length: 255 }),
    tastingNotes: json("taste_notes").$type<string[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (coffeeBean) => {
    return {
      baristaIdx: index("barista_idx").on(coffeeBean.baristaId),
    };
  },
);

export const coffeeBeansRelations = relations(
  coffeeBeansTable,
  ({ one, many }) => ({
    barista: one(usersTable, {
      fields: [coffeeBeansTable.baristaId],
      references: [usersTable.id],
    }),
    coffeeBeansToTastingNotes: many(coffeeBeansTastingNotesTable),
  }),
);

export const insertCoffeeBeanSchema = createInsertSchema(coffeeBeansTable, {
  name: z.string().min(1),
  tastingNotes: z.array(z.string()),
  baristaId: z.string().uuid().optional(),
});
