// lib/hooks/useGuestOrUser.ts - Migration compatibility hook
"use client";

import { useUser } from "@/lib/contexts/UserContext";

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

/**
 * Legacy compatibility hook for useGuestOrUser
 * This allows existing components to work without changes during migration
 * Now powered by the unified UserContext
 */
export const useGuestOrUser = (): UseGuestOrUserReturnType => {
  const { user, guestSession, isAuthenticated, isGuest, isLoading } = useUser();

  return {
    // User data
    user,

    // Guest data
    guestSession,

    // Status checks
    isAuthenticated,
    isGuest,
    isLoading,

    // Combined user identification
    userId: user?.id || guestSession?.id || null,
    userType: isAuthenticated
      ? "authenticated"
      : isGuest
      ? "guest"
      : "anonymous",

    // Legacy compatibility
    status: isLoading
      ? "loading"
      : isAuthenticated
      ? "authenticated"
      : "unauthenticated",
  };
};
