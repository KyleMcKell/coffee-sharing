import { type AdapterAccount } from "next-auth/adapters";
import {
  pgTable,
  primaryKey,
  integer,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./user";

export const account = pgTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    accessToken: varchar("access_token", { length: 255 }),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: varchar("id_token", { length: 255 }),
    sessionState: varchar("session_state", { length: 255 }),
    refreshTokenExpiresIn: integer("refresh_token_expires_in"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (account) => {
    return {
      compoundKey: primaryKey(account.provider, account.providerAccountId),
      userIdx: index("user_idx").on(account.userId),
    };
  }
);

export const accountsRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
