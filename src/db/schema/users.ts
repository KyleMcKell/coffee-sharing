import { relations, type InferModel } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { accountsTable } from "./accounts";
import { coffeeBeansTable } from "./coffeeBeans";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  coffeeBeans: many(coffeeBeansTable),
}));

export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;
