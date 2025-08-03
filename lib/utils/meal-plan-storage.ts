// lib/utils/meal-plan-storage.ts
"use client";

import { UserMealPlan } from "@/lib/types/user";

const MEAL_PLAN_STORAGE_KEY = "generatedMealPlan";

/**
 * Save generated meal plan to localStorage
 */
export function saveGeneratedMealPlanToLocalStorage(
  mealPlan: UserMealPlan
): void {
  try {
    if (typeof window !== "undefined") {
      const storageKey = `${MEAL_PLAN_STORAGE_KEY}-${mealPlan.userId}`;
      localStorage.setItem(storageKey, JSON.stringify(mealPlan));
      console.log(
        `Saved generated meal plan to localStorage for user ${mealPlan.userId}`
      );
    }
  } catch (error) {
    console.error("Failed to save meal plan to localStorage:", error);
  }
}

/**
 * Get generated meal plan from localStorage
 */
export function getGeneratedMealPlanFromLocalStorage(
  userId: string
): UserMealPlan | null {
  try {
    if (typeof window !== "undefined") {
      const storageKey = `${MEAL_PLAN_STORAGE_KEY}-${userId}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const mealPlan = JSON.parse(stored) as UserMealPlan;
        console.log(
          `Retrieved generated meal plan from localStorage for user ${userId}`
        );
        return mealPlan;
      }
    }
  } catch (error) {
    console.error("Failed to retrieve meal plan from localStorage:", error);
  }

  return null;
}

/**
 * Clear generated meal plan from localStorage (called after saving to DB)
 */
export function clearGeneratedMealPlanFromLocalStorage(userId: string): void {
  try {
    if (typeof window !== "undefined") {
      const storageKey = `${MEAL_PLAN_STORAGE_KEY}-${userId}`;
      localStorage.removeItem(storageKey);
      console.log(
        `Cleared generated meal plan from localStorage for user ${userId}`
      );
    }
  } catch (error) {
    console.error("Failed to clear meal plan from localStorage:", error);
  }
}

/**
 * Check if there's a generated meal plan in storage
 */
export function hasGeneratedMealPlanInLocalStorage(userId: string): boolean {
  try {
    if (typeof window !== "undefined") {
      const storageKey = `${MEAL_PLAN_STORAGE_KEY}-${userId}`;
      return localStorage.getItem(storageKey) !== null;
    }
  } catch (error) {
    console.error("Failed to check meal plan in localStorage:", error);
  }

  return false;
}
