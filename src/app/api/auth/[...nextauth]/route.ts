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
import { accounts, insertAccountSchema } from "~/db/schema/accounts";
import { sessions } from "~/db/schema/sessions";
import { users } from "~/db/schema/users";
import { verificationTokens } from "~/db/schema/verificationTokens";
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

      await db.insert(users).values({ ...data, id });

      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0]);
      return dbUser!;
    },
    getUser: async (data) => {
      const dbUser = await db.select().from(users).where(eq(users.id, data));
      return dbUser[0] ?? null;
    },
    getUserByEmail: async (data) => {
      const dbUser = await db.select().from(users).where(eq(users.email, data));
      return dbUser[0] ?? null;
    },
    createSession: async (data) => {
      await db.insert(sessions).values(data);

      const dbSession = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken));
      return dbSession[0]!;
    },
    getSessionAndUser: async (data) => {
      const sessionAndUser = await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId));

      return sessionAndUser[0] ?? null;
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.");
      }

      await db.update(users).set(data).where(eq(users.id, data.id));

      const dbUser = await db.select().from(users).where(eq(users.id, data.id));
      return dbUser[0]!;
    },
    updateSession: async (data) => {
      await db
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken));

      return db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
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
        .insert(accounts)
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
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, a.providerAccountId),
            eq(accounts.provider, a.provider),
          ),
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0]);

      return dbAccount?.users ?? null;
    },
    deleteSession: async (sessionToken) => {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    createVerificationToken: async (token) => {
      await db.insert(verificationTokens).values(token);

      return db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.identifier, token.identifier))
        .then((res) => res[0]);
    },
    useVerificationToken: async (token) => {
      try {
        const deletedToken =
          (await db
            .select()
            .from(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token),
              ),
            )
            .then((res) => res[0])) ?? null;

        await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: async (id) => {
      await Promise.all([
        db.delete(users).where(eq(users.id, id)),
        db.delete(sessions).where(eq(sessions.userId, id)),
        db.delete(accounts).where(eq(accounts.userId, id)),
      ]);

      return null;
    },
    unlinkAccount: async (a) => {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, a.providerAccountId),
            eq(accounts.provider, a.provider),
          ),
        );

      return undefined;
    },
  };
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
