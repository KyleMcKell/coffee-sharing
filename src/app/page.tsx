import { AuthButton } from "~/components/AuthButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home = async () => {
  const session = await getServerSession(authOptions);
  console.log("session from home", session);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <p>hi there</p>
      <AuthButton />
    </main>
  );
};

export default Home;
