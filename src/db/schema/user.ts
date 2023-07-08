import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { InferModel } from "drizzle-orm"

export const UsersTable = pgTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (users) => {
    return {
      uniqueEmailIdx: uniqueIndex("unique_email_idx").on(users.email),
    }
  }
)

export type User = InferModel<typeof UsersTable>
export type NewUser = InferModel<typeof UsersTable, "insert">
