"use client";

import { useUser } from "@/lib/contexts/UserContext";

interface GuestLimitationStatus {
  canCreateMealPlan: boolean;
  dailyGenerationLimitReached: boolean;
  generationsRemaining: number;
  generationsUsedToday: number;
  reasons: string[];
}

/**
 * Legacy compatibility hook for guest limitations
 * Now powered by the unified UserContext
 */
export const useGuestLimitations = (): GuestLimitationStatus => {
  const {
    canCreateMealPlan,
    generationsRemaining,
    generationsUsedToday,
    dailyGenerationLimitReached,
  } = useUser();

  return {
    canCreateMealPlan,
    dailyGenerationLimitReached,
    generationsRemaining,
    generationsUsedToday,
    reasons: dailyGenerationLimitReached
      ? ["Daily generation limit reached"]
      : [],
  };
};
