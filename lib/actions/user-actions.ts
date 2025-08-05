"use server";

import { revalidatePath } from "next/cache";
import { selectRecipesWithinBudget } from "../utils/meal-plan-helpers";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { MealType } from "@prisma/client";
import type {
  UserMealPlan,
  CreateUserMealPlanData,
  CreateUserIngredientData,
  UserIngredient,
} from "../types/user";
import { clearGeneratedMealPlanFromLocalStorage } from "../utils/meal-plan-storage";

/**
 * Generate weekly meal plan for authenticated users (does not save to DB)
 * Returns generated meal plan data that can be previewed before saving
 */
export async function createUserMealPlan(
  data: CreateUserMealPlanData
): Promise<UserMealPlan> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Get all available recipes with ingredients (match DatabaseRecipe interface)
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        meals: true, // Include meals to match DatabaseRecipe interface
      },
    });

    if (recipes.length === 0) {
      throw new Error("No recipes available in the database");
    }

    // Use the inputted budget as daily budget and calculate total budget
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const daysInPlan =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) || 7;
    const dailyBudget = data.budget; // Input is already daily budget
    const totalBudget = dailyBudget * daysInPlan;

    // Generate meals for each day
    const mealsData = [];

    for (let day = 0; day < daysInPlan; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      // Select recipes for each meal of the day within daily budget
      const { breakfastRecipe, lunchRecipe, dinnerRecipe } =
        selectRecipesWithinBudget(recipes, dailyBudget);

      if (!breakfastRecipe || !lunchRecipe || !dinnerRecipe) {
        throw new Error(
          `Unable to find recipes within daily budget of ₱${dailyBudget.toFixed(
            2
          )} for day ${day + 1}`
        );
      }

      // Add meals for this day (with full recipe data for preview)
      mealsData.push(
        {
          recipeId: breakfastRecipe.id,
          type: "BREAKFAST" as MealType,
          date: currentDate,
          recipe: breakfastRecipe,
        },
        {
          recipeId: lunchRecipe.id,
          type: "LUNCH" as MealType,
          date: currentDate,
          recipe: lunchRecipe,
        },
        {
          recipeId: dinnerRecipe.id,
          type: "DINNER" as MealType,
          date: currentDate,
          recipe: dinnerRecipe,
        }
      );
    }

    // Return generated meal plan data (NOT saved to DB yet)
    const generatedMealPlan = {
      id: `temp-${Date.now()}`, // Temporary ID for preview
      userId: session.user.id,
      budget: totalBudget,
      startDate: startDate,
      endDate: endDate,
      meals: mealsData.map((meal) => ({
        id: `temp-meal-${Date.now()}-${Math.random()}`, // Temporary meal ID
        mealPlanId: `temp-${Date.now()}`, // Temporary meal plan ID
        recipeId: meal.recipeId,
        type: meal.type,
        date: meal.date,
        recipe: meal.recipe,
      })),
      createdAt: new Date(),
    };

    return generatedMealPlan as UserMealPlan;
  } catch (error) {
    throw new Error(
      `Failed to generate meal plan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function addUserMealPlan(
  mealPlan: UserMealPlan
): Promise<UserMealPlan> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the meal plan belongs to the current user
    if (mealPlan.userId !== session.user.id) {
      throw new Error(
        "Unauthorized: Meal plan does not belong to current user"
      );
    }

    // Prepare meals data for database insertion (exclude recipe data, only keep references)
    const mealsToCreate = mealPlan.meals.map((meal) => ({
      recipeId: meal.recipeId,
      type: meal.type,
      date: new Date(meal.date),
    }));

    // Create the meal plan in the database
    const savedMealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        budget: mealPlan.budget,
        startDate: new Date(mealPlan.startDate),
        endDate: new Date(mealPlan.endDate),
        meals: {
          create: mealsToCreate,
        },
      },
      include: {
        meals: {
          include: {
            recipe: {
              include: {
                ingredients: true,
              },
            },
          },
          orderBy: [{ date: "asc" }, { type: "asc" }],
        },
      },
    });

    clearGeneratedMealPlanFromLocalStorage(session.user.id);

    revalidatePath("/meal-planner");
    return savedMealPlan as UserMealPlan;
  } catch (error) {
    throw new Error(
      `Failed to save meal plan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getUserMealPlans(): Promise<UserMealPlan[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return await prisma.mealPlan.findMany({
    where: { userId: session.user.id },
    include: {
      meals: {
        include: {
          recipe: {
            include: {
              ingredients: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUserMealPlan(mealPlanId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Verify ownership
  const mealPlan = await prisma.mealPlan.findFirst({
    where: {
      id: mealPlanId,
      userId: session.user.id,
    },
  });

  if (!mealPlan) {
    throw new Error("Meal plan not found or access denied");
  }

  await prisma.mealPlan.delete({
    where: { id: mealPlanId },
  });

  revalidatePath("/meal-planner");
}

// User ingredients
export async function addUserIngredient(
  ingredient: CreateUserIngredientData
): Promise<UserIngredient> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return await prisma.userIngredient.create({
    data: {
      userId: session.user.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    },
  });
}

export async function getUserIngredients(): Promise<UserIngredient[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return await prisma.userIngredient.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUserIngredient(ingredientId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Verify ownership
  const ingredient = await prisma.userIngredient.findFirst({
    where: {
      id: ingredientId,
      userId: session.user.id,
    },
  });

  if (!ingredient) {
    throw new Error("Ingredient not found or access denied");
  }

  await prisma.userIngredient.delete({
    where: { id: ingredientId },
  });

  revalidatePath("/ingredients");
}

/**
 * Save selected days from generated meal plans to user's saved meal plans
 * This is used when user clicks "Add Selected to Plans"
 */
export async function saveSelectedDaysToUserMealPlan(
  selectedMealsData: {
    planId: string;
    dayIndex: number;
    meals: any[];
  }[]
): Promise<UserMealPlan> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    if (selectedMealsData.length === 0) {
      throw new Error("No meals selected to save");
    }

    // Flatten all selected meals
    const allSelectedMeals = selectedMealsData.flatMap(
      (dayData) => dayData.meals
    );

    if (allSelectedMeals.length === 0) {
      throw new Error("No meals found in selected data");
    }

    // Calculate date range based on selected meals (start from today)
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (selectedMealsData.length - 1) * 24 * 60 * 60 * 1000
    );

    // Calculate budget (sum of all selected meal costs)
    const totalBudget = allSelectedMeals.reduce((sum, meal) => {
      return sum + (meal.recipe?.costPerServing || 0);
    }, 0);

    // Prepare meals data for database insertion
    const mealsToCreate = allSelectedMeals.map((meal, index) => ({
      recipeId: meal.recipeId,
      type: meal.type,
      date: new Date(
        startDate.getTime() + Math.floor(index / 3) * 24 * 60 * 60 * 1000
      ),
    }));

    // Create the meal plan in the database
    const savedMealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        budget: totalBudget,
        startDate: startDate,
        endDate: endDate,
        meals: {
          create: mealsToCreate,
        },
      },
      include: {
        meals: {
          include: {
            recipe: {
              include: {
                ingredients: true,
              },
            },
          },
          orderBy: [{ date: "asc" }, { type: "asc" }],
        },
      },
    });

    // Don't clear localStorage here - this is a server action
    // The client will handle clearing localStorage after successful save

    revalidatePath("/meal-planner");
    return savedMealPlan as UserMealPlan;
  } catch (error) {
    throw new Error(
      `Failed to save selected meals: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
