// lib/actions/user-actions.ts
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
} from "@/lib/types/user";

/**
 * Generate weekly meal plan for authenticated users
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

    // Calculate daily budget (weekly budget / 7 days)
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const daysInPlan =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) || 7;
    const dailyBudget = data.budget / daysInPlan;

    console.log(
      `Creating ${daysInPlan}-day meal plan with daily budget: ₱${dailyBudget.toFixed(
        2
      )}`
    );

    // Generate meals for each day
    const mealsToCreate: Array<{
      recipeId: string;
      type: MealType;
      date: Date;
    }> = [];

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

      // Add meals for this day
      mealsToCreate.push(
        {
          recipeId: breakfastRecipe.id,
          type: "BREAKFAST" as MealType,
          date: currentDate,
        },
        {
          recipeId: lunchRecipe.id,
          type: "LUNCH" as MealType,
          date: currentDate,
        },
        {
          recipeId: dinnerRecipe.id,
          type: "DINNER" as MealType,
          date: currentDate,
        }
      );
    }

    // Create meal plan with all meals
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        budget: data.budget,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
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

    console.log(
      `Created weekly meal plan with ${mealPlan.meals.length} meals for user ${session.user.id}`
    );

    revalidatePath("/meal-planner");
    return mealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to create user meal plan:", error);
    throw new Error(
      `Failed to create meal plan: ${
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
