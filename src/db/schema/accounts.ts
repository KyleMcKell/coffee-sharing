import { InferModel, relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import z from "zod";

import { users } from "./users";

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (account) => {
    return {
      compoundKey: primaryKey(account.provider, account.providerAccountId),
      userIdx: index("user_idx").on(account.userId),
    };
  },
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const insertAccountSchema = createInsertSchema(accounts, {
  type: z.enum(["oauth", "email", "credentials"]),
});

export type Account = InferModel<typeof accounts>;
export type NewAccount = InferModel<typeof accounts, "insert">;
