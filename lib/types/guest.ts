// Types that mirror the database schema for consistency

export interface GuestMealPlan {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  budget: number;
  meals: GuestMeal[];
  createdAt: string;
}

export interface GuestMeal {
  id: string;
  mealPlanId: string;
  recipeId: string;
  date: string; // ISO date string
  type: "BREAKFAST" | "LUNCH" | "DINNER"; // Match MealType enum
  recipe?: GuestRecipe; // Optional, for guest meal plans
}

export interface GuestRecipe {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  cookingTime: number;
  ingredients: GuestRecipeIngredient[];
  costPerServing: number;
  image: string | null;
  createdAt: Date;
}

export interface GuestRecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: number; // Required for calculations
  pricePerUnit?: number | null;
  notes?: string | null;
  recipeId: string;
}

export interface GuestIngredient {
  id: string;
  name: string; // Global ingredient reference
  pricePerUnit?: number; // Price per unit for this ingredient
  unit?: string; // e.g., grams, liters, etc.
  createdAt: string; // ISO date string
}

export interface GuestUserIngredient {
  id: string;
  name: string;
  quantity?: string; // e.g., "1 cup", for leftovers tracking
  unit?: string; // e.g., grams, tsp, etc.
  createdAt: string;
}

export interface GuestSessionData {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  // Meal planning data (mirrors User -> MealPlan relationship)
  mealPlans: GuestMealPlan[];

  // User ingredients (mirrors User -> UserIngredient relationship)
  userIngredients: GuestUserIngredient[];

  // Saved/favorited recipes (recipe IDs)
  savedRecipes: string[];

  // Guest limitations tracking
  limitations: {
    generationsToday: number;
    lastGenerationDate: string;
    maxGenerationsPerDay: number;
    sessionStartTime: string;
  };

  // Additional guest-specific data for enhanced UX
  preferences?: {
    dietaryRestrictions?: string[];
    favoriteIngredients?: string[];
    cookingSkillLevel?: "beginner" | "intermediate" | "advanced";
    defaultBudget?: number;
  };
}

export const GUEST_LIMITATIONS = {
  MAX_GENERATIONS_PER_DAY: 3,
  SESSION_DURATION_HOURS: 24, // Session duration in hours
} as const;
