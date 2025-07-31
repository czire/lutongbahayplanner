import type { GuestMeal, GuestRecipe } from "@/lib/types/guest";
import { generateRandomNumber } from "./generateRandomNumber";

interface DatabaseRecipe {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  cookingTime: number;
  costPerServing: number;
  image: string | null;
  createdAt: Date;
  meals: Array<{
    id: string;
    type: "BREAKFAST" | "LUNCH" | "DINNER";
    mealPlanId: string;
    recipeId: string;
    date: Date;
  }>;
  ingredients: Array<{
    id: string;
    name: string;
    quantity: string;
    unit: string;
    recipeId: string;
  }>;
}

/**
 * Filter recipes by meal type
 */
export const filterRecipesByMealType = (
  recipes: DatabaseRecipe[],
  mealType: "BREAKFAST" | "LUNCH" | "DINNER"
) => {
  return recipes.filter((recipe) =>
    recipe.meals.some((meal) => meal.type === mealType)
  );
};

/**
 * Select random unique recipes for each meal type
 */
export const selectUniqueRecipes = (
  breakfastRecipes: DatabaseRecipe[],
  lunchRecipes: DatabaseRecipe[],
  dinnerRecipes: DatabaseRecipe[]
): {
  breakfastRecipe: DatabaseRecipe | undefined;
  lunchRecipe: DatabaseRecipe | undefined;
  dinnerRecipe: DatabaseRecipe | undefined;
} => {
  // Pick breakfast recipe
  const breakfastRecipe =
    breakfastRecipes.length > 0
      ? breakfastRecipes[generateRandomNumber(0, breakfastRecipes.length - 1)]
      : undefined;

  // Filter out breakfast recipe from lunch options
  const availableLunchRecipes = lunchRecipes.filter(
    (recipe) => recipe.id !== breakfastRecipe?.id
  );
  const lunchRecipe =
    availableLunchRecipes.length > 0
      ? availableLunchRecipes[
          generateRandomNumber(0, availableLunchRecipes.length - 1)
        ]
      : lunchRecipes.length > 0
      ? lunchRecipes[0]
      : undefined;

  // Filter out both breakfast and lunch from dinner options
  const availableDinnerRecipes = dinnerRecipes.filter(
    (recipe) =>
      recipe.id !== breakfastRecipe?.id && recipe.id !== lunchRecipe?.id
  );
  const dinnerRecipe =
    availableDinnerRecipes.length > 0
      ? availableDinnerRecipes[
          generateRandomNumber(0, availableDinnerRecipes.length - 1)
        ]
      : dinnerRecipes.length > 0
      ? dinnerRecipes[0]
      : undefined;

  return { breakfastRecipe, lunchRecipe, dinnerRecipe };
};

/**
 * Transform database recipe to guest recipe format
 */
export const transformToGuestRecipe = (recipe: DatabaseRecipe): GuestRecipe => {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    servings: recipe.servings,
    cookingTime: recipe.cookingTime,
    costPerServing: recipe.costPerServing,
    image: recipe.image,
    createdAt: recipe.createdAt,
    ingredients:
      recipe.ingredients?.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        recipeId: ingredient.recipeId,
      })) || [],
  };
};

/**
 * Generate guest meals for a single day
 */
export const generateGuestMeals = (
  breakfastRecipe: DatabaseRecipe | undefined,
  lunchRecipe: DatabaseRecipe | undefined,
  dinnerRecipe: DatabaseRecipe | undefined,
  mealPlanId: string,
  date: Date
): GuestMeal[] => {
  const guestMeals: GuestMeal[] = [];
  const mealTypes: Array<{
    type: "BREAKFAST" | "LUNCH" | "DINNER";
    recipe: DatabaseRecipe | undefined;
  }> = [
    { type: "BREAKFAST", recipe: breakfastRecipe },
    { type: "LUNCH", recipe: lunchRecipe },
    { type: "DINNER", recipe: dinnerRecipe },
  ];

  for (const { type, recipe } of mealTypes) {
    if (recipe) {
      guestMeals.push({
        id: `meal_${Date.now()}_${type}_guest`,
        mealPlanId: mealPlanId,
        recipeId: recipe.id,
        date: date.toISOString(),
        type: type,
        recipe: transformToGuestRecipe(recipe),
      });
    }
  }

  return guestMeals;
};

/**
 * Create empty meal plan for when no recipes are found
 */
export const createEmptyMealPlan = (budget: number) => {
  return {
    id: `mealplan_${Date.now()}_guest`,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    budget: budget,
    meals: [],
    createdAt: new Date().toISOString(),
  };
};

/**
 * Create error meal plan for catch blocks
 */
export const createErrorMealPlan = (budget: number) => {
  return {
    id: `mealplan_${Date.now()}_guest_error`,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    budget: budget,
    meals: [],
    createdAt: new Date().toISOString(),
  };
};
