"use client";

import { useSession } from "next-auth/react";
import { useGuestSession } from "@/providers/GuestSessionProvider";

type UseGuestOrUserReturnType = {
  user: any; // Replace 'any' with your user type
  guestSession: any; // Guest session data
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  userId: string | null;
  userType: "authenticated" | "guest" | "anonymous";
  status: "loading" | "authenticated" | "unauthenticated";
};

export const useGuestOrUser = (): UseGuestOrUserReturnType => {
  const { data: session, status } = useSession();
  const { guestSession, isLoading: guestLoading } = useGuestSession();

  const isAuthenticated = !!session?.user;
  const isGuest = !isAuthenticated && !!guestSession;
  const isLoading = status === "loading" || guestLoading;

  return {
    // User data
    user: session?.user || null,

    // Guest data
    guestSession,

    // Status checks
    isAuthenticated,
    isGuest,
    isLoading,

    // Combined user identification
    userId: session?.user?.id || guestSession?.id || null,
    userType: isAuthenticated
      ? "authenticated"
      : isGuest
      ? "guest"
      : "anonymous",

    // Legacy compatibility
    status,
  };
};
