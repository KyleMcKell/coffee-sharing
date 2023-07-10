"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

export const AuthButton = () => {
  return (
    <SessionProvider>
      <AuthButtonLogic />
    </SessionProvider>
  );
};

const AuthButtonLogic = () => {
  const { status, data } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <button className="text-black" onClick={() => signIn("discord")}>
          Sign in
        </button>
      ) : null}
      {status === "authenticated" ? (
        <>
          <button className="text-black" onClick={() => signOut()}>
            Sign out
          </button>
          {data.user.name}
        </>
      ) : null}
    </>
  );
};
