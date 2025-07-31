"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getGuestSession,
  updateGuestSession,
  clearGuestSession,
  addGuestMealPlan,
  updateGuestMealPlan,
  deleteGuestMealPlan,
  addGuestMeal,
  updateGuestMeal,
  deleteGuestMeal,
  addGuestUserIngredient,
  updateGuestUserIngredient,
  deleteGuestUserIngredient,
  addGuestSavedRecipe,
  removeGuestSavedRecipe,
  isGuestRecipeSaved,
} from "@/lib/utils/guest-session";
import type {
  GuestSessionData,
  GuestMealPlan,
  GuestMeal,
  GuestUserIngredient,
} from "@/lib/types/guest";

interface GuestSessionContextType {
  guestSession: GuestSessionData | null;
  isLoading: boolean;
  updateGuest: (data: Partial<GuestSessionData>) => Promise<void>;
  clearGuest: () => Promise<void>;
  refreshSession: () => Promise<GuestSessionData | null>;
}

const GuestSessionContext = createContext<GuestSessionContextType | null>(null);

interface GuestSessionProviderProps {
  children: ReactNode;
}

export function GuestSessionProvider({ children }: GuestSessionProviderProps) {
  const [guestSession, setGuestSession] = useState<GuestSessionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load guest session on mount
  useEffect(() => {
    const loadGuestSession = async () => {
      try {
        const session = await getGuestSession();
        setGuestSession(session);
      } catch (error) {
        console.error("Failed to load guest session:", error);
        setGuestSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuestSession();
  }, []);

  const updateGuest = async (data: Partial<GuestSessionData>) => {
    try {
      if (!guestSession) {
        // If no guest session exists, create one first
        const newSession = await getGuestSession();
        const updatedSession = await updateGuestSession({
          ...newSession,
          ...data,
        });
        setGuestSession(updatedSession);
      } else {
        // Update existing session
        const updatedSession = await updateGuestSession({
          ...guestSession,
          ...data,
        });
        setGuestSession(updatedSession);
      }
    } catch (error) {
      console.error("Failed to update guest session:", error);
      throw error;
    }
  };

  const clearGuest = async () => {
    try {
      await clearGuestSession();
      setGuestSession(null);
    } catch (error) {
      console.error("Failed to clear guest session:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const session = await getGuestSession();
      setGuestSession(session);
      return session;
    } catch (error) {
      console.error("Failed to refresh guest session:", error);
      setGuestSession(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value: GuestSessionContextType = {
    guestSession,
    isLoading,
    updateGuest,
    clearGuest,
    refreshSession,
  };

  return (
    <GuestSessionContext.Provider value={value}>
      {children}
    </GuestSessionContext.Provider>
  );
}

export function useGuestSession() {
  const context = useContext(GuestSessionContext);
  if (!context) {
    throw new Error(
      "useGuestSession must be used within a GuestSessionProvider"
    );
  }
  return context;
}

// Helper hooks for specific operations
export function useGuestPreferences() {
  const { guestSession, updateGuest } = useGuestSession();

  const updatePreferences = async (
    preferences: Partial<GuestSessionData["preferences"]>
  ) => {
    await updateGuest({
      preferences: {
        ...guestSession?.preferences,
        ...preferences,
      },
    });
  };

  return {
    preferences: guestSession?.preferences,
    updatePreferences,
  };
}

export function useGuestMealPlans() {
  const { guestSession, refreshSession } = useGuestSession();

  const createMealPlan = async (
    mealPlan: Omit<GuestMealPlan, "id" | "createdAt">
  ) => {
    const result = addGuestMealPlan(mealPlan);
    const refreshedSession = await refreshSession();
  };

  const updateMealPlan = async (
    mealPlanId: string,
    updates: Partial<Omit<GuestMealPlan, "id" | "createdAt">>
  ) => {
    updateGuestMealPlan(mealPlanId, updates);
    await refreshSession();
  };

  const deleteMealPlan = async (mealPlanId: string) => {
    deleteGuestMealPlan(mealPlanId);
    await refreshSession();
  };

  const addMeal = async (
    mealPlanId: string,
    meal: Omit<GuestMeal, "id" | "mealPlanId">
  ) => {
    addGuestMeal(mealPlanId, meal);
    await refreshSession();
  };

  const updateMeal = async (
    mealPlanId: string,
    mealId: string,
    updates: Partial<Omit<GuestMeal, "id" | "mealPlanId">>
  ) => {
    updateGuestMeal(mealPlanId, mealId, updates);
    await refreshSession();
  };

  const deleteMeal = async (mealPlanId: string, mealId: string) => {
    deleteGuestMeal(mealPlanId, mealId);
    await refreshSession();
  };

  const mealPlans = guestSession?.mealPlans || [];

  return {
    mealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    addMeal,
    updateMeal,
    deleteMeal,
  };
}

export function useGuestGeneratedRecipes() {
  const { guestSession, refreshSession } = useGuestSession();

  const recipes =
    guestSession?.mealPlans.flatMap(
      (plan) =>
        plan.meals
          .filter((meal: any) => meal.recipe) // Filter meals that have recipe data
          .map((meal: any) => meal.recipe) // Get the recipe data
    ) || [];

  console.log("Guest Generated Recipes:", recipes);

  return {
    generatedRecipes: recipes,
  };
}

export function useGuestUserIngredients() {
  const { guestSession, refreshSession } = useGuestSession();

  const addIngredient = async (
    ingredient: Omit<GuestUserIngredient, "id" | "createdAt">
  ) => {
    addGuestUserIngredient(ingredient);
    await refreshSession();
  };

  const updateIngredient = async (
    ingredientId: string,
    updates: Partial<Omit<GuestUserIngredient, "id" | "createdAt">>
  ) => {
    updateGuestUserIngredient(ingredientId, updates);
    await refreshSession();
  };

  const deleteIngredient = async (ingredientId: string) => {
    deleteGuestUserIngredient(ingredientId);
    await refreshSession();
  };

  return {
    userIngredients: guestSession?.userIngredients || [],
    addIngredient,
    updateIngredient,
    deleteIngredient,
  };
}
