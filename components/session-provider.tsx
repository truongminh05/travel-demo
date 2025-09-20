// File: components/session-provider.tsx

"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type React from "react";

interface Props {
  children: React.ReactNode;
  session?: Session;
}

export default function NextAuthSessionProvider({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
