import { type AdapterAccount } from "next-auth/adapters"
import {
  pgTable,
  timestamp,
  primaryKey,
  integer,
  varchar,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { usersTable } from "./users"

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 255 }),
    session_state: varchar("session_state", { length: 255 }),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(usersTable, {
    fields: [accounts.userId],
    references: [usersTable.id],
  }),
}))
