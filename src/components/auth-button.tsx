"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";

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
        <Button onClick={() => signIn()}>Sign in</Button>
      ) : null}
      {status === "authenticated" ? (
        <>
          <Button onClick={() => signOut()}>Sign out</Button>
          {data.user?.name}
        </>
      ) : null}
    </>
  );
};
