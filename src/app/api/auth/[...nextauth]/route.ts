import { and, eq } from "drizzle-orm";
import { type GetServerSidePropsContext } from "next";
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "~/db";
import { user } from "~/db/schema/user";
import { session } from "~/db/schema/session";
import { account } from "~/db/schema/account";
import { verificationToken } from "~/db/schema/verificationToken";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
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
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  if (ctx) {
    return getServerSession(ctx.req, ctx.res, authOptions);
  }
  return getServerSession(authOptions);
};

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
      console.log("create user");
      const id = crypto.randomUUID();

      await db.insert(user).values({ ...data, id });

      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .then((res) => res[0]);
      return dbUser!;
    },
    getUser: async (data) => {
      console.log("get user");
      const dbUser = await db.select().from(user).where(eq(user.id, data));
      return dbUser[0] ?? null;
    },
    getUserByEmail: async (data) => {
      console.log("get user by email");
      const dbUser = await db.select().from(user).where(eq(user.email, data));
      return dbUser[0] ?? null;
    },
    createSession: async (data) => {
      console.log("create session");
      await db.insert(session).values(data);

      const dbSession = await db
        .select()
        .from(session)
        .where(eq(session.sessionToken, data.sessionToken));
      return dbSession[0]!;
    },
    getSessionAndUser: async (data) => {
      console.log("get session and user");
      const sessionAndUser = await db
        .select({
          session: session,
          user: user,
        })
        .from(session)
        .where(eq(session.sessionToken, data))
        .innerJoin(user, eq(user.id, session.userId));

      return sessionAndUser[0] ?? null;
    },
    updateUser: async (data) => {
      console.log("update user");
      if (!data.id) {
        throw new Error("No user id.");
      }

      await db.update(user).set(data).where(eq(user.id, data.id));

      const dbUser = await db.select().from(user).where(eq(user.id, data.id));
      return dbUser[0]!;
    },
    updateSession: async (data) => {
      console.log("update session");
      await db
        .update(session)
        .set(data)
        .where(eq(session.sessionToken, data.sessionToken));

      return db
        .select()
        .from(session)
        .where(eq(session.sessionToken, data.sessionToken))
        .then((res) => res[0]);
    },
    linkAccount: async (rawAccount) => {
      console.log("link account");
      const updatedAccount = await db
        .insert(account)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]);

      if (!updatedAccount) {
        console.log("no account");
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
      console.log("get user by account");
      const dbAccount = await db
        .select()
        .from(account)
        .where(
          and(
            eq(account.providerAccountId, a.providerAccountId),
            eq(account.provider, a.provider)
          )
        )
        .leftJoin(user, eq(account.userId, user.id))
        .then((res) => res[0]);

      return dbAccount?.user ?? null;
    },
    deleteSession: async (sessionToken) => {
      console.log("delete session");
      await db.delete(session).where(eq(session.sessionToken, sessionToken));
    },
    createVerificationToken: async (token) => {
      console.log("create verification token");
      await db.insert(verificationToken).values(token);

      return db
        .select()
        .from(verificationToken)
        .where(eq(verificationToken.identifier, token.identifier))
        .then((res) => res[0]);
    },
    useVerificationToken: async (token) => {
      console.log("use verification token");
      try {
        const deletedToken =
          (await db
            .select()
            .from(verificationToken)
            .where(
              and(
                eq(verificationToken.identifier, token.identifier),
                eq(verificationToken.token, token.token)
              )
            )
            .then((res) => res[0])) ?? null;

        await db
          .delete(verificationToken)
          .where(
            and(
              eq(verificationToken.identifier, token.identifier),
              eq(verificationToken.token, token.token)
            )
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: async (id) => {
      console.log("delete user");
      await Promise.all([
        db.delete(user).where(eq(user.id, id)),
        db.delete(session).where(eq(session.userId, id)),
        db.delete(account).where(eq(account.userId, id)),
      ]);

      return null;
    },
    unlinkAccount: async (a) => {
      console.log("unlink account");
      await db
        .delete(account)
        .where(
          and(
            eq(account.providerAccountId, a.providerAccountId),
            eq(account.provider, a.provider)
          )
        );

      return undefined;
    },
  };
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
