"use client";

import { type BuiltInProviderType } from "next-auth/providers";
import {
  signIn,
  signOut,
  useSession,
  type LiteralUnion,
  type SignInOptions,
} from "next-auth/react";

import { Button } from "~/components/ui/button";

type Props = {
  provider?: LiteralUnion<BuiltInProviderType>;
  signInOptions?: SignInOptions;
};

export function AuthButton({ provider, signInOptions }: Props) {
  const { status, data } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <Button onClick={() => void signIn(provider, signInOptions)}>
          Sign in
        </Button>
      ) : null}
      {status === "authenticated" ? (
        <>
          <Button onClick={() => void signOut()}>Sign out</Button>
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
