import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { usersTable } from "./users"

export const coffeeBeans = pgTable("coffeeBeans", {
  id: uuid("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  baristaId: varchar("id", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})

export const coffeeBeansRelations = relations(coffeeBeans, ({ one }) => ({
  barista: one(usersTable, {
    fields: [coffeeBeans.baristaId],
    references: [usersTable.id],
  }),
}))
