"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { MealType } from "@prisma/client";
import type { UserMealPlan, UserMeal } from "@/lib/types/user";
import {
  addGuestMeal,
  updateGuestMeal,
  deleteGuestMeal,
  getGuestSession,
} from "@/lib/utils/guest-session";

/**
 * Add a new meal to a meal plan
 */
export async function addMealToMealPlan(
  mealPlanId: string,
  mealData: {
    recipeId: string;
    type: MealType;
    date: Date;
  },
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    // Handle guest meal addition
    const result = addGuestMeal(mealPlanId, {
      recipeId: mealData.recipeId,
      type: mealData.type,
      date: mealData.date.toISOString(),
    });

    if (!result) {
      throw new Error("Failed to add meal to guest session");
    }

    // Return the updated meal plan
    const updatedMealPlan = result.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any; // Cast to UserMealPlan for consistency
  }

  // Handle authenticated user meal addition
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the meal plan belongs to the current user
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { meals: true },
    });

    if (!mealPlan || mealPlan.userId !== session.user.id) {
      throw new Error("Meal plan not found or access denied");
    }

    // Add the new meal
    await prisma.meal.create({
      data: {
        mealPlanId: mealPlanId,
        recipeId: mealData.recipeId,
        type: mealData.type,
        date: mealData.date,
      },
    });

    // Get the updated meal plan with all meals and recipes
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
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

    revalidatePath("/meal-planner");
    revalidatePath(`/meal-planner/${mealPlanId}`);

    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    throw new Error(
      `Failed to add meal: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Remove a meal from a meal plan
 */
export async function removeMealFromMealPlan(
  mealPlanId: string,
  mealId: string,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    // Handle guest meal removal
    const result = deleteGuestMeal(mealPlanId, mealId);

    if (!result) {
      throw new Error("Failed to remove meal from guest session");
    }

    // Return the updated meal plan
    const updatedMealPlan = result.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any; // Cast to UserMealPlan for consistency
  }

  // Handle authenticated user meal removal
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the meal belongs to a meal plan owned by the current user
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        mealPlan: true,
      },
    });

    if (!meal || meal.mealPlan.userId !== session.user.id) {
      throw new Error("Meal not found or access denied");
    }

    // Remove the meal
    await prisma.meal.delete({
      where: { id: mealId },
    });

    // Get the updated meal plan
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
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

    revalidatePath("/meal-planner");
    revalidatePath(`/meal-planner/${mealPlanId}`);

    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    throw new Error(
      `Failed to remove meal: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Swap meals between two positions in a meal plan
 */
export async function swapMealsInMealPlan(
  mealPlanId: string,
  mealId1: string,
  mealId2: string,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    // Handle guest meal swapping
    const session = getGuestSession();
    if (!session) {
      throw new Error("Guest session not found");
    }

    const mealPlan = session.mealPlans.find((plan) => plan.id === mealPlanId);
    if (!mealPlan) {
      throw new Error("Meal plan not found in guest session");
    }

    const meal1Index = mealPlan.meals.findIndex((meal) => meal.id === mealId1);
    const meal2Index = mealPlan.meals.findIndex((meal) => meal.id === mealId2);

    if (meal1Index === -1 || meal2Index === -1) {
      throw new Error("One or both meals not found");
    }

    // Swap the meals
    const meal1 = mealPlan.meals[meal1Index];
    const meal2 = mealPlan.meals[meal2Index];

    // Swap their properties (keeping IDs but swapping everything else)
    const tempMeal = {
      recipeId: meal1.recipeId,
      type: meal1.type,
      date: meal1.date,
      recipe: meal1.recipe,
    };

    // Update meal 1 with meal 2's data
    const result1 = updateGuestMeal(mealPlanId, mealId1, {
      recipeId: meal2.recipeId,
      type: meal2.type,
      date: meal2.date,
      recipe: meal2.recipe,
    });

    if (!result1) {
      throw new Error("Failed to update first meal");
    }

    // Update meal 2 with meal 1's data
    const result2 = updateGuestMeal(mealPlanId, mealId2, tempMeal);

    if (!result2) {
      throw new Error("Failed to update second meal");
    }

    // Return the updated meal plan
    const updatedMealPlan = result2.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any; // Cast to UserMealPlan for consistency
  }

  // Handle authenticated user meal swapping
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify both meals belong to meal plans owned by the current user
    const [meal1, meal2] = await Promise.all([
      prisma.meal.findUnique({
        where: { id: mealId1 },
        include: { mealPlan: true, recipe: true },
      }),
      prisma.meal.findUnique({
        where: { id: mealId2 },
        include: { mealPlan: true, recipe: true },
      }),
    ]);

    if (!meal1 || !meal2) {
      throw new Error("One or both meals not found");
    }

    if (
      meal1.mealPlan.userId !== session.user.id ||
      meal2.mealPlan.userId !== session.user.id
    ) {
      throw new Error("Access denied to one or both meals");
    }

    // Swap the meals using a transaction
    await prisma.$transaction(async (tx) => {
      // Store meal1 data
      const meal1Data = {
        recipeId: meal1.recipeId,
        type: meal1.type,
        date: meal1.date,
      };

      // Store meal2 data
      const meal2Data = {
        recipeId: meal2.recipeId,
        type: meal2.type,
        date: meal2.date,
      };

      // Update meal1 with meal2's data
      await tx.meal.update({
        where: { id: mealId1 },
        data: meal2Data,
      });

      // Update meal2 with meal1's data
      await tx.meal.update({
        where: { id: mealId2 },
        data: meal1Data,
      });
    });

    // Get the updated meal plan
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
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

    revalidatePath("/meal-planner");
    revalidatePath(`/meal-planner/${mealPlanId}`);

    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to swap meals in meal plan:", error);
    throw new Error(
      `Failed to swap meals: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Update a meal in a meal plan (change recipe, type, or date)
 */
export async function updateMealInMealPlan(
  mealPlanId: string,
  mealId: string,
  updates: Partial<{
    recipeId: string;
    type: MealType;
    date: Date;
  }>,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    // Handle guest meal update
    const guestUpdates: any = { ...updates };
    if (guestUpdates.date) {
      guestUpdates.date = guestUpdates.date.toISOString();
    }

    const result = updateGuestMeal(mealPlanId, mealId, guestUpdates);

    if (!result) {
      throw new Error("Failed to update meal in guest session");
    }

    // Return the updated meal plan
    const updatedMealPlan = result.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any; // Cast to UserMealPlan for consistency
  }

  // Handle authenticated user meal update
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the meal belongs to a meal plan owned by the current user
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        mealPlan: true,
      },
    });

    if (!meal || meal.mealPlan.userId !== session.user.id) {
      throw new Error("Meal not found or access denied");
    }

    // Update the meal
    await prisma.meal.update({
      where: { id: mealId },
      data: updates,
    });

    // Get the updated meal plan
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
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

    revalidatePath("/meal-planner");
    revalidatePath(`/meal-planner/${mealPlanId}`);

    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to update meal in meal plan:", error);
    throw new Error(
      `Failed to update meal: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get all available recipes for meal selection
 */
export async function getAvailableRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return recipes;
  } catch (error) {
    console.error("Failed to get available recipes:", error);
    throw new Error(
      `Failed to get recipes: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
