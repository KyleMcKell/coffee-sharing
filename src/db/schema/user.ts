import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core"
import { InferModel } from "drizzle-orm"
import { relations } from "drizzle-orm"

import { accountsTable } from "./auth"

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
}))

export type User = InferModel<typeof usersTable>
export type NewUser = InferModel<typeof usersTable, "insert">
