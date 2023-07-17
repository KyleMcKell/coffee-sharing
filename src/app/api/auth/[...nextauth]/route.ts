import NextAuth, { type DefaultSession } from "next-auth";

import { authOptions } from "~/lib/next-auth";

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
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
