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
    price?: number; // Optional until migration is run
    pricePerUnit?: number | null; // Optional until migration is run
    notes?: string | null; // Optional until migration is run
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
        price: ingredient.price ?? 0, // Default to 0 if price not set
        pricePerUnit: ingredient.pricePerUnit,
        notes: ingredient.notes,
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

/**
 * Calculate total cost of ingredients for a recipe
 */
export const calculateRecipeTotalCost = (recipe: DatabaseRecipe): number => {
  return (
    recipe.ingredients?.reduce(
      (sum, ingredient) => sum + (ingredient.price || 0),
      0
    ) || 0
  );
};

/**
 * Select recipes that fit within the budget (each meal individually)
 */
export const selectRecipesWithinBudget = (
  recipes: DatabaseRecipe[],
  budget: number
): {
  breakfastRecipe: DatabaseRecipe | undefined;
  lunchRecipe: DatabaseRecipe | undefined;
  dinnerRecipe: DatabaseRecipe | undefined;
} => {
  // If no recipes, return undefined for all meals
  if (recipes.length === 0) {
    return {
      breakfastRecipe: undefined,
      lunchRecipe: undefined,
      dinnerRecipe: undefined,
    };
  }

  // Filter recipes that fit within the individual meal budget
  const recipesWithinBudget = recipes.filter((recipe) => {
    const recipeCost = calculateRecipeTotalCost(recipe);
    return recipeCost <= budget;
  });

  if (recipesWithinBudget.length === 0) {
    console.log(`No recipes found within budget of ₱${budget.toFixed(2)}`);
    return {
      breakfastRecipe: undefined,
      lunchRecipe: undefined,
      dinnerRecipe: undefined,
    };
  }

  // Select random unique recipes for each meal type
  const breakfastRecipe =
    recipesWithinBudget.length > 0
      ? recipesWithinBudget[
          generateRandomNumber(0, recipesWithinBudget.length - 1)
        ]
      : undefined;

  // Filter out breakfast recipe from lunch options
  const availableLunchRecipes = recipesWithinBudget.filter(
    (recipe) => recipe.id !== breakfastRecipe?.id
  );
  const lunchRecipe =
    availableLunchRecipes.length > 0
      ? availableLunchRecipes[
          generateRandomNumber(0, availableLunchRecipes.length - 1)
        ]
      : recipesWithinBudget.length > 0
      ? recipesWithinBudget[0]
      : undefined;

  // Filter out both breakfast and lunch from dinner options
  const availableDinnerRecipes = recipesWithinBudget.filter(
    (recipe) =>
      recipe.id !== breakfastRecipe?.id && recipe.id !== lunchRecipe?.id
  );
  const dinnerRecipe =
    availableDinnerRecipes.length > 0
      ? availableDinnerRecipes[
          generateRandomNumber(0, availableDinnerRecipes.length - 1)
        ]
      : recipesWithinBudget.length > 0
      ? recipesWithinBudget[0]
      : undefined;

  console.log("Selected recipes within individual budget:", {
    breakfast: `${breakfastRecipe?.name} - ₱${
      breakfastRecipe
        ? calculateRecipeTotalCost(breakfastRecipe).toFixed(2)
        : "0"
    }`,
    lunch: `${lunchRecipe?.name} - ₱${
      lunchRecipe ? calculateRecipeTotalCost(lunchRecipe).toFixed(2) : "0"
    }`,
    dinner: `${dinnerRecipe?.name} - ₱${
      dinnerRecipe ? calculateRecipeTotalCost(dinnerRecipe).toFixed(2) : "0"
    }`,
    budget: `₱${budget.toFixed(2)} per meal`,
  });

  return {
    breakfastRecipe,
    lunchRecipe,
    dinnerRecipe,
  };
};
