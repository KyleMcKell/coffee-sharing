import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { InferModel } from "drizzle-orm"

export const UsersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    externalId: text("externalId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_external_id_idx").on(users.externalId),
    }
  }
)

export type User = InferModel<typeof UsersTable>
export type NewUser = InferModel<typeof UsersTable, "insert">
