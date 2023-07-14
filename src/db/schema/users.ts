import { pgTable, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

import { accounts } from "./accounts";
import { coffeeBeans } from "./coffeeBeans";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  coffeeBeans: many(coffeeBeans),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
