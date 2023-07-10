import { and, eq } from "drizzle-orm"
import { type GetServerSidePropsContext } from "next"
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth"
import { type Adapter } from "next-auth/adapters"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "~/db"
import { usersTable } from "~/db/schema/user"
import {
  sessionsTable,
  accountsTable,
  verificationTokensTable,
} from "~/db/schema/auth"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx?: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  if (ctx) {
    return getServerSession(ctx.req, ctx.res, authOptions)
  }
  return getServerSession(authOptions)
}

/**
 * Adapter for Drizzle ORM. This is not yet available in NextAuth directly, so we inhouse our own.
 * When the official one is out, we will switch to that.
 *
 * @see
 * https://github.com/nextauthjs/next-auth/pull/7165/files#diff-142e7d6584eed63a73316fbc041fb93a0564a1cbb0da71200b92628ca66024b5
 */

export function DrizzleAdapter(): Adapter {
  return {
    createUser: async (data) => {
      const id = crypto.randomUUID()

      await db.insert(usersTable).values({ ...data, id })

      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .then((res) => res[0])
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return user!
    },
    getUser: async (data) => {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data))
      return user[0] ?? null
    },
    getUserByEmail: async (data) => {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, data))
      return user[0] ?? null
    },
    createSession: async (data) => {
      await db.insert(sessionsTable).values(data)

      const session = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return session[0]!
    },
    getSessionAndUser: async (data) => {
      const sessionAndUser = await db
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))

      return sessionAndUser[0] ?? null
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.")
      }

      await db.update(usersTable).set(data).where(eq(usersTable.id, data.id))

      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data.id))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return user[0]!
    },
    updateSession: async (data) => {
      await db
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))

      return db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .then((res) => res[0])
    },
    linkAccount: async (rawAccount) => {
      await db
        .insert(accountsTable)
        .values(rawAccount)
        .then((res) => res.rows[0])
    },
    getUserByAccount: async (account) => {
      const dbAccount = await db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.providerAccountId, account.providerAccountId),
            eq(accountsTable.provider, account.provider)
          )
        )
        .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .then((res) => res[0])

      return dbAccount?.users ?? null
    },
    deleteSession: async (sessionToken) => {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
    },
    createVerificationToken: async (token) => {
      await db.insert(verificationTokensTable).values(token)

      return db
        .select()
        .from(verificationTokensTable)
        .where(eq(verificationTokensTable.identifier, token.identifier))
        .then((res) => res[0])
    },
    useVerificationToken: async (token) => {
      try {
        const deletedToken =
          (await db
            .select()
            .from(verificationTokensTable)
            .where(
              and(
                eq(verificationTokensTable.identifier, token.identifier),
                eq(verificationTokensTable.token, token.token)
              )
            )
            .then((res) => res[0])) ?? null

        await db
          .delete(verificationTokensTable)
          .where(
            and(
              eq(verificationTokensTable.identifier, token.identifier),
              eq(verificationTokensTable.token, token.token)
            )
          )

        return deletedToken
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: async (id) => {
      await Promise.all([
        db.delete(usersTable).where(eq(usersTable.id, id)),
        db.delete(sessionsTable).where(eq(sessionsTable.userId, id)),
        db.delete(accountsTable).where(eq(accountsTable.userId, id)),
      ])

      return null
    },
    unlinkAccount: async (account) => {
      await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.providerAccountId, account.providerAccountId),
            eq(accountsTable.provider, account.provider)
          )
        )

      return undefined
    },
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
