import { getServerSession } from "next-auth";

import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { AuthButton } from "~/components/auth-button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <p>hi there</p>
      <AuthButton />
    </main>
  );
}
