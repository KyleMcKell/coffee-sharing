import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

import { account } from "./account";
import { coffeeBean } from "./coffeeBean";

export const user = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  coffeeBeans: many(coffeeBean),
}));

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;
