import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  json,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { coffeeBeanTastingNote } from "./coffeeBeanTastingNote";

export const coffeeBean = pgTable(
  "coffee_bean",
  {
    id: uuid("id").notNull().primaryKey(),
    baristaId: varchar("barista_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    name: varchar("name", { length: 255 }).notNull(),
    brand: varchar("brand", { length: 255 }),
    tastingNotes: json("taste_notes").$type<string[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (coffeeBean) => {
    return {
      baristaIdx: index("barista_idx").on(coffeeBean.baristaId),
    };
  }
);

export const coffeeBeansRelations = relations(coffeeBean, ({ one, many }) => ({
  barista: one(user, {
    fields: [coffeeBean.baristaId],
    references: [user.id],
  }),
  coffeeBeansToTastingNotes: many(coffeeBeanTastingNote),
}));
