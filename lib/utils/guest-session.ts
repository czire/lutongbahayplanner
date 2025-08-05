import Cookies from "js-cookie";
import {
  type GuestSessionData,
  type GuestMealPlan,
  type GuestMeal,
  type GuestUserIngredient,
  GUEST_LIMITATIONS,
} from "@/lib/types/guest";

export const createGuestSession = (): GuestSessionData => {
  const guestId = `guest_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
  const now = new Date().toISOString();

  const sessionData: GuestSessionData = {
    id: guestId,
    role: "guest",
    createdAt: now,
    updatedAt: now,
    mealPlans: [],
    userIngredients: [],
    savedRecipes: [],
    limitations: {
      maxGenerationsPerDay: GUEST_LIMITATIONS.MAX_GENERATIONS_PER_DAY,
      sessionStartTime: now,
      lastGenerationDate: "",
      generationsToday: 0,
    },
    preferences: {},
  };

  Cookies.set("guestSession", JSON.stringify(sessionData), {
    expires: 30,
    path: "/",
    sameSite: "lax",
  });

  return sessionData;
};

export const getGuestSession = (): GuestSessionData | null => {
  try {
    const session = Cookies.get("guestSession");

    if (!session) {
      // Auto-create guest session if none exists
      return createGuestSession();
    }

    const parsed = JSON.parse(session);

    // Load meal plans from localStorage if they exist
    if (parsed.id) {
      const mealPlansData = localStorage.getItem(`guestMealPlans_${parsed.id}`);
      if (mealPlansData) {
        parsed.mealPlans = JSON.parse(mealPlansData);
      }
    }

    return parsed;
  } catch (error) {
    // If parsing fails, create a new session
    return createGuestSession();
  }
};

export const updateGuestSession = (
  updates: Partial<GuestSessionData>,
  currentSession?: GuestSessionData
): GuestSessionData | null => {
  const session = currentSession || getGuestSession();
  if (!session) return null;

  const updatedSession = {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString(),
    // Deep merge for nested objects and arrays
    preferences: { ...session.preferences, ...updates.preferences },
    mealPlans: updates.mealPlans ?? session.mealPlans,
    userIngredients: updates.userIngredients ?? session.userIngredients,
    savedRecipes: updates.savedRecipes ?? session.savedRecipes,
  };

  // Store meal plans separately in localStorage to avoid cookie size limits
  if (updates.mealPlans !== undefined) {
    localStorage.setItem(
      `guestMealPlans_${session.id}`,
      JSON.stringify(updatedSession.mealPlans)
    );
  }

  // Create a lightweight session for cookies (without meal plans)
  const lightweightSession = {
    ...updatedSession,
    mealPlans: [], // Store empty array in cookie
  };

  Cookies.set("guestSession", JSON.stringify(lightweightSession), {
    expires: 30,
    path: "/",
    sameSite: "lax",
  });

  return updatedSession;
};

export const clearGuestSession = () => {
  // Get session ID before clearing to clean up localStorage
  const session = getGuestSession();
  if (session?.id) {
    localStorage.removeItem(`guestMealPlans_${session.id}`);
  }
  Cookies.remove("guestSession");
};

// Helper functions to manage meal plans (mirrors database operations)
export const addGuestMealPlan = (
  mealPlan: Omit<GuestMealPlan, "id" | "createdAt">
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const newMealPlan: GuestMealPlan = {
    ...mealPlan,
    id: `mealplan_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const updatedMealPlans = [...session.mealPlans, newMealPlan];

  // Pass the current session to avoid calling getGuestSession again
  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

export const updateGuestMealPlan = (
  mealPlanId: string,
  updates: Partial<Omit<GuestMealPlan, "id" | "createdAt">>
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedMealPlans = session.mealPlans.map((plan) =>
    plan.id === mealPlanId ? { ...plan, ...updates } : plan
  );

  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

export const deleteGuestMealPlan = (
  mealPlanId: string
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedMealPlans = session.mealPlans.filter(
    (plan) => plan.id !== mealPlanId
  );
  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

// Helper functions to manage meals within meal plans
export const addGuestMeal = (
  mealPlanId: string,
  meal: Omit<GuestMeal, "id" | "mealPlanId">
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const newMeal: GuestMeal = {
    ...meal,
    id: `meal_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
    mealPlanId,
  };

  const updatedMealPlans = session.mealPlans.map((plan) =>
    plan.id === mealPlanId ? { ...plan, meals: [...plan.meals, newMeal] } : plan
  );

  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

export const updateGuestMeal = (
  mealPlanId: string,
  mealId: string,
  updates: Partial<Omit<GuestMeal, "id" | "mealPlanId">>
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedMealPlans = session.mealPlans.map((plan) =>
    plan.id === mealPlanId
      ? {
          ...plan,
          meals: plan.meals.map((meal) =>
            meal.id === mealId ? { ...meal, ...updates } : meal
          ),
        }
      : plan
  );

  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

export const deleteGuestMeal = (
  mealPlanId: string,
  mealId: string
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedMealPlans = session.mealPlans.map((plan) =>
    plan.id === mealPlanId
      ? { ...plan, meals: plan.meals.filter((meal) => meal.id !== mealId) }
      : plan
  );

  return updateGuestSession({ mealPlans: updatedMealPlans }, session);
};

// Helper functions to manage user ingredients
export const addGuestUserIngredient = (
  ingredient: Omit<GuestUserIngredient, "id" | "createdAt">
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const newIngredient: GuestUserIngredient = {
    ...ingredient,
    id: `ingredient_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const updatedIngredients = [...session.userIngredients, newIngredient];
  return updateGuestSession({ userIngredients: updatedIngredients }, session);
};

export const updateGuestUserIngredient = (
  ingredientId: string,
  updates: Partial<Omit<GuestUserIngredient, "id" | "createdAt">>
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedIngredients = session.userIngredients.map((ingredient) =>
    ingredient.id === ingredientId ? { ...ingredient, ...updates } : ingredient
  );

  return updateGuestSession({ userIngredients: updatedIngredients }, session);
};

export const deleteGuestUserIngredient = (
  ingredientId: string
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedIngredients = session.userIngredients.filter(
    (ingredient) => ingredient.id !== ingredientId
  );
  return updateGuestSession({ userIngredients: updatedIngredients }, session);
};

// Helper functions for saved recipes
export const addGuestSavedRecipe = (
  recipeId: string
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  if (!session.savedRecipes.includes(recipeId)) {
    const updatedSavedRecipes = [...session.savedRecipes, recipeId];
    return updateGuestSession({ savedRecipes: updatedSavedRecipes }, session);
  }

  return session;
};

export const removeGuestSavedRecipe = (
  recipeId: string
): GuestSessionData | null => {
  const session = getGuestSession();
  if (!session) return null;

  const updatedSavedRecipes = session.savedRecipes.filter(
    (id) => id !== recipeId
  );
  return updateGuestSession({ savedRecipes: updatedSavedRecipes }, session);
};

export const isGuestRecipeSaved = (recipeId: string): boolean => {
  const session = getGuestSession();
  return session?.savedRecipes.includes(recipeId) || false;
};
