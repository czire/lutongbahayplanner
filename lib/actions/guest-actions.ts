"use server";

import { prisma } from "@/prisma";
import type { GuestMealPlan } from "@/lib/types/guest";
import {
  selectRecipesWithinBudget,
  generateGuestMeals,
  createEmptyMealPlan,
  createErrorMealPlan,
} from "@/lib/utils/meal-plan-helpers";

export const generateGuestMealPlan = async (
  budget: number
): Promise<GuestMealPlan> => {
  try {
    // Get all available recipes with ingredients
    const recipes = await prisma.recipe.findMany({
      include: {
        meals: true,
        ingredients: true,
      },
    });

    // Return empty meal plan if no recipes found
    if (recipes.length === 0) {
      return createEmptyMealPlan(budget);
    }

    // Select recipes that fit within the total budget
    const { breakfastRecipe, lunchRecipe, dinnerRecipe } =
      selectRecipesWithinBudget(recipes, budget);

    console.log("Selected Recipes:", {
      breakfast: breakfastRecipe?.name,
      lunch: lunchRecipe?.name,
      dinner: dinnerRecipe?.name,
    });

    // Generate meal plan
    const mealPlanId = `mealplan_${Date.now()}_guest`;
    const startDate = new Date();
    const guestMeals = generateGuestMeals(
      breakfastRecipe,
      lunchRecipe,
      dinnerRecipe,
      mealPlanId,
      startDate
    );

    return {
      id: mealPlanId,
      startDate: startDate.toISOString(),
      endDate: startDate.toISOString(), // Same day for guests
      budget: budget,
      meals: guestMeals,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return createErrorMealPlan(budget);
  }
};
