import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { coffeeBeansTastingNotes } from "./coffeeBeansTastingNotes";
import { users } from "./users";

export const coffeeBeans = pgTable(
  "coffee_beans",
  {
    id: uuid("id").notNull().primaryKey(),
    baristaId: varchar("barista_id", { length: 255 })
      .notNull()
      .references(() => users.id),
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

export const coffeeBeansRelations = relations(coffeeBeans, ({ one, many }) => ({
  barista: one(users, {
    fields: [coffeeBeans.baristaId],
    references: [users.id],
  }),
  coffeeBeansToTastingNotes: many(coffeeBeansTastingNotes),
}));
