"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";

export function AuthButton() {
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
      {status === "loading" ? (
        <>
          <Button>Loading...</Button>
        </>
      ) : null}
    </>
  );
}
