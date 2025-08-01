"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { GuestSessionProvider } from "./GuestSessionProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <GuestSessionProvider>{children}</GuestSessionProvider>
    </SessionProvider>
  );
}
