import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres"

import { UsersTable } from "@/db/schema/user"
import {
  AccountsTable,
  SessionsTable,
  VerificationTokensTable,
} from "@/db/schema/auth"
import { and, eq } from "drizzle-orm"
import { Adapter } from "next-auth/adapters"

export function PostgresJsDrizzleAdapter(db: VercelPgDatabase): Adapter {
  return {
    createUser: async (data) => {
      return db
        .insert(UsersTable)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .then((res) => res[0])
    },
    getUser: async (data) => {
      return (
        db
          .select()
          .from(UsersTable)
          .where(eq(UsersTable.id, data))
          .then((res) => res[0]) ?? null
      )
    },
    getUserByEmail: async (data) => {
      return (
        db
          .select()
          .from(UsersTable)
          .where(eq(UsersTable.email, data))
          .then((res) => res[0]) ?? null
      )
    },
    createSession: async (data) => {
      return db
        .insert(SessionsTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    getSessionAndUser: async (data) => {
      return (
        db
          .select({
            session: SessionsTable,
            user: UsersTable,
          })
          .from(SessionsTable)
          .where(eq(SessionsTable.sessionToken, data))
          .innerJoin(UsersTable, eq(UsersTable.id, SessionsTable.userId))
          .then((res) => res[0]) ?? null
      )
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.")
      }

      return db
        .update(UsersTable)
        .set(data)
        .where(eq(UsersTable.id, data.id))
        .returning()
        .then((res) => res[0])
    },
    updateSession: async (data) => {
      return db
        .update(SessionsTable)
        .set(data)
        .where(eq(SessionsTable.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    linkAccount: async (account) => {
      await db
        .insert(AccountsTable)
        .values(account)
        .returning()
        .then((res) => res[0])
    },
    getUserByAccount: async (account) => {
      const dbAccount = await db
        .select()
        .from(AccountsTable)
        .where(
          and(
            eq(AccountsTable.providerAccountId, account.providerAccountId),
            eq(AccountsTable.provider, account.provider)
          )
        )
        .leftJoin(UsersTable, eq(AccountsTable.userId, UsersTable.id))
        .then((res) => res[0])

      return dbAccount.users
    },
    deleteSession: async (sessionToken) => {
      await db
        .delete(SessionsTable)
        .where(eq(SessionsTable.sessionToken, sessionToken))
    },
    createVerificationToken: async (token) => {
      return db
        .insert(VerificationTokensTable)
        .values(token)
        .returning()
        .then((res) => res[0])
    },
    useVerificationToken: async (token) => {
      try {
        return (
          db
            .delete(VerificationTokensTable)
            .where(
              and(
                eq(VerificationTokensTable.identifier, token.identifier),
                eq(VerificationTokensTable.token, token.token)
              )
            )
            .returning()
            .then((res) => res[0]) ?? null
        )
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: async (id) => {
      await db
        .delete(UsersTable)
        .where(eq(UsersTable.id, id))
        .returning()
        .then((res) => res[0])
    },
    unlinkAccount: async (account) => {
      await db
        .delete(AccountsTable)
        .where(
          and(
            eq(AccountsTable.providerAccountId, account.providerAccountId),
            eq(AccountsTable.provider, account.provider)
          )
        )

      return undefined
    },
  }
}
