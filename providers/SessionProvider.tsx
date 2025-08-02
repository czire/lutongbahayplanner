"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { GuestSessionProvider } from "./GuestSessionProvider";
import { UserProvider } from "@/lib/contexts/UserContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <GuestSessionProvider>
        <UserProvider>{children}</UserProvider>
      </GuestSessionProvider>
    </SessionProvider>
  );
}
