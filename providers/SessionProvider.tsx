"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { UserProvider } from "@/lib/contexts/UserContext";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
      <Toaster />
    </SessionProvider>
  );
}
