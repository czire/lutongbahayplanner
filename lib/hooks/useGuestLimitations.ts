"use client";

import { useGuestSession } from "@/providers/GuestSessionProvider";
import { GUEST_LIMITATIONS } from "@/lib/types/guest";

interface GuestLimitationStatus {
  canCreateMealPlan: boolean;
  dailyGenerationLimitReached: boolean;
  generationsRemaining: number;
  generationsUsedToday: number;
  reasons: string[];
}

export const useGuestLimitations = (): GuestLimitationStatus => {
  const { guestSession } = useGuestSession();

  if (!guestSession) {
    return {
      canCreateMealPlan: false,
      dailyGenerationLimitReached: false,
      generationsRemaining: GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY,
      generationsUsedToday: 0,
      reasons: ["No guest session found"],
    };
  }

  const limitations = guestSession.limitations;
  if (!limitations) {
    return {
      canCreateMealPlan: true,
      dailyGenerationLimitReached: false,
      generationsRemaining: GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY,
      generationsUsedToday: 0,
      reasons: ["No limitations data available"],
    };
  }
  const generationsToday = limitations?.generationsToday || 0;
  const lastGenerationDate = limitations?.lastGenerationDate;

  // Check if it's a new day (reset daily counter)
  const today = new Date().toDateString();
  const lastGenDate = lastGenerationDate
    ? new Date(lastGenerationDate).toDateString()
    : null;
  const isNewDay = !lastGenDate || lastGenDate !== today;

  const effectiveGenerationsToday = isNewDay ? 0 : generationsToday;

  // Check limitations
  const dailyGenerationLimitReached =
    effectiveGenerationsToday >= GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY;

  const reasons: string[] = [];

  if (dailyGenerationLimitReached) {
    reasons.push(
      `Daily limit of ${GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY} meal plans reached.`
    );
  }
  const canCreateMealPlan = !dailyGenerationLimitReached;

  return {
    canCreateMealPlan,
    dailyGenerationLimitReached,
    generationsRemaining: Math.max(
      0,
      GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY - effectiveGenerationsToday
    ),
    generationsUsedToday: effectiveGenerationsToday,
    reasons,
  };
};
