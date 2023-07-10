import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core"
import { InferModel } from "drizzle-orm"
import { relations } from "drizzle-orm"

import { accounts } from "./auth"

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}))

export type User = InferModel<typeof users>
export type NewUser = InferModel<typeof users, "insert">
