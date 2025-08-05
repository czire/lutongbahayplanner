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
    }
  } catch (error) {}
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
        return mealPlan;
      }
    }
  } catch (error) {}

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
    }
  } catch (error) {}
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
  } catch (error) {}

  return false;
}
