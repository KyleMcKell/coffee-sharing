import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { coffeeBeansTastingNotesTable } from "~/db/schema/coffeeBeansTastingNotes";
import { usersTable } from "~/db/schema/users";

export const coffeeBeansTable = pgTable(
  "coffee_beans",
  {
    id: uuid("id").notNull().primaryKey(),
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
