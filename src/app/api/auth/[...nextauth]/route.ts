import NextAuth from "next-auth/next"
import type { NextAuthOptions, DefaultSession } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PostgresJsDrizzleAdapter } from "@/lib/drizzle-next-auth-postgres-adapter"
import { db } from "@/db"

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

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: PostgresJsDrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
