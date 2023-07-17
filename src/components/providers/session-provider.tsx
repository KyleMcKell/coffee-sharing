"use client";

import {
  SessionProvider as NextAuthSessionProvider,
  type SessionProviderProps,
} from "next-auth/react";
import * as React from "react";

export function SessionProvider({ children, ...props }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider {...props}>{children}</NextAuthSessionProvider>
  );
}
