"use client";

import { type BuiltInProviderType } from "next-auth/providers";
import {
  signIn,
  signOut,
  useSession,
  type LiteralUnion,
  type SignInOptions,
  type SignOutParams,
} from "next-auth/react";

import { Button } from "~/components/ui/button";

type Props = {
  provider?: LiteralUnion<BuiltInProviderType>;
  signInOptions?: SignInOptions;
  signOutOptions?: SignOutParams;
};

export function AuthButton({
  provider,
  signInOptions = { callbackUrl: "/", redirect: true },
  signOutOptions = { callbackUrl: "/", redirect: true },
}: Props) {
  const { status } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <Button onClick={() => void signIn(provider, signInOptions)}>
          Sign in
        </Button>
      ) : null}
      {status === "authenticated" ? (
        <>
          <Button onClick={() => void signOut(signOutOptions)}>Sign out</Button>
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
