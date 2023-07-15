import { and, eq } from "drizzle-orm";
import { type GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/db";
import { accountsTable } from "~/db/schema/accounts";
import { sessionsTable } from "~/db/schema/sessions";
import { usersTable } from "~/db/schema/users";
import { verificationTokensTable } from "~/db/schema/verificationTokens";
import { env } from "~/utils/env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      createdAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    createdAt: Date;
  }
}

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
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = (ctx?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  if (ctx) {
    return getServerSession(ctx.req, ctx.res, authOptions);
  }
  return getServerSession(authOptions);
};

export function DrizzleAdapter(): Adapter {
  return {
    createUser: async (data) => {
      const id = crypto.randomUUID();

      await db.insert(usersTable).values({ ...data, id });

      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .then((res) => res[0]);
      return dbUser!;
    },
    getUser: async (data) => {
      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data));
      return dbUser[0] ?? null;
    },
    getUserByEmail: async (data) => {
      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, data));
      return dbUser[0] ?? null;
    },
    createSession: async (data) => {
      await db.insert(sessionsTable).values(data);

      const dbSession = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken));
      return dbSession[0]!;
    },
    getSessionAndUser: async (data) => {
      const sessionAndUser = await db
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId));

      return sessionAndUser[0] ?? null;
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.");
      }

      await db.update(usersTable).set(data).where(eq(usersTable.id, data.id));

      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data.id));
      return dbUser[0]!;
    },
    updateSession: async (data) => {
      await db
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken));

      return db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .then((res) => res[0]);
    },
    linkAccount: async (rawAccount) => {
      const {
        token_type,
        access_token,
        expires_at,
        refresh_token,
        session_state,
        id_token,
        ...rest
      } = rawAccount;

      const accountToInsert = {
        ...rest,
        tokenType: token_type,
        accessToken: access_token,
        expiresAt: expires_at,
        refreshToken: refresh_token,
        idToken: id_token,
        sessionState: session_state,
      };

      const updatedAccount = await db
        .insert(accountsTable)
        .values(accountToInsert)
        .returning()
        .then((res) => res[0]);

      if (!updatedAccount) {
        return;
      }

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const fixedAccount = {
        ...updatedAccount,
        access_token: updatedAccount.accessToken ?? undefined,
        token_type: updatedAccount.tokenType ?? undefined,
        id_token: updatedAccount.idToken ?? undefined,
        refresh_token: updatedAccount.refreshToken ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expiresAt ?? undefined,
        session_state: updatedAccount.sessionState ?? undefined,
      };

      return fixedAccount;
    },
    getUserByAccount: async (a) => {
      const dbAccount = await db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.providerAccountId, a.providerAccountId),
            eq(accountsTable.provider, a.provider),
          ),
        )
        .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .then((res) => res[0]);

      return dbAccount?.users ?? null;
    },
    deleteSession: async (sessionToken) => {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken));
    },
    createVerificationToken: async (token) => {
      await db.insert(verificationTokensTable).values(token);

      return db
        .select()
        .from(verificationTokensTable)
        .where(eq(verificationTokensTable.identifier, token.identifier))
        .then((res) => res[0]);
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
                eq(verificationTokensTable.token, token.token),
              ),
            )
            .then((res) => res[0])) ?? null;

        await db
          .delete(verificationTokensTable)
          .where(
            and(
              eq(verificationTokensTable.identifier, token.identifier),
              eq(verificationTokensTable.token, token.token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: async (id) => {
      await Promise.all([
        db.delete(usersTable).where(eq(usersTable.id, id)),
        db.delete(sessionsTable).where(eq(sessionsTable.userId, id)),
        db.delete(accountsTable).where(eq(accountsTable.userId, id)),
      ]);

      return null;
    },
    unlinkAccount: async (a) => {
      await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.providerAccountId, a.providerAccountId),
            eq(accountsTable.provider, a.provider),
          ),
        );

      return undefined;
    },
  };
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
