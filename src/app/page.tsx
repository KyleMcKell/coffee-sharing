import { getServerSession } from "next-auth";

import { AuthButton } from "~/components/AuthButton";

import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <p>hi there</p>
      <AuthButton />
    </main>
  );
}
