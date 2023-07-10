import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./user";

export const session = pgTable("session", {
  sessionToken: varchar("session_token", { length: 255 })
    .notNull()
    .primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
