import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { usersTable } from "./users"

export const sessions = pgTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessions.userId],
    references: [usersTable.id],
  }),
}))
