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
 * Add a meal manually to a specific date and meal type
 */
export async function addMealManually(
  mealPlanId: string,
  recipeId: string,
  date: string,
  mealType: MealType,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    const result = addGuestMeal(mealPlanId, {
      recipeId,
      type: mealType,
      date,
    });

    if (!result) {
      throw new Error("Failed to add meal to guest session");
    }

    const updatedMealPlan = result.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any;
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const updatedMealPlan = await prisma.mealPlan.update({
      where: {
        id: mealPlanId,
        userId: session.user.id,
      },
      data: {
        meals: {
          create: {
            recipeId,
            date: new Date(date),
            type: mealType,
          },
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
        },
      },
    });

    revalidatePath("/meal-planner");
    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to add meal manually:", error);
    throw new Error("Failed to add meal");
  }
}

/**
 * Remove a meal from the meal plan
 */
export async function removeMeal(
  mealPlanId: string,
  mealId: string,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    const result = deleteGuestMeal(mealPlanId, mealId);

    if (!result) {
      throw new Error("Failed to remove meal from guest session");
    }

    const updatedMealPlan = result.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );
    return updatedMealPlan as any;
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // First delete the meal
    await prisma.meal.delete({
      where: {
        id: mealId,
        mealPlan: {
          userId: session.user.id,
        },
      },
    });

    // Then fetch the updated meal plan
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: mealPlanId,
        userId: session.user.id,
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
        },
      },
    });

    revalidatePath("/meal-planner");
    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to remove meal:", error);
    throw new Error("Failed to remove meal");
  }
}

/**
 * Swap two meals in the meal plan
 */
export async function swapMeals(
  mealPlanId: string,
  meal1Id: string,
  meal2Id: string,
  isGuest: boolean = false
): Promise<UserMealPlan | null> {
  if (isGuest) {
    // For guest sessions, we need to manually swap the meals
    const guestSession = getGuestSession();
    if (!guestSession) {
      throw new Error("Guest session not found");
    }

    const mealPlan = guestSession.mealPlans.find(
      (plan) => plan.id === mealPlanId
    );

    if (!mealPlan) {
      throw new Error("Meal plan not found");
    }

    const meal1 = mealPlan.meals.find((meal) => meal.id === meal1Id);
    const meal2 = mealPlan.meals.find((meal) => meal.id === meal2Id);

    if (!meal1 || !meal2) {
      throw new Error("One or both meals not found");
    }

    // Swap the dates and types
    const tempDate = meal1.date;
    const tempType = meal1.type;

    meal1.date = meal2.date;
    meal1.type = meal2.type;
    meal2.date = tempDate;
    meal2.type = tempType;

    // Save back to session
    return mealPlan as any;
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Get both meals
    const [meal1, meal2] = await Promise.all([
      prisma.meal.findUnique({
        where: {
          id: meal1Id,
          mealPlan: { userId: session.user.id },
        },
      }),
      prisma.meal.findUnique({
        where: {
          id: meal2Id,
          mealPlan: { userId: session.user.id },
        },
      }),
    ]);

    if (!meal1 || !meal2) {
      throw new Error("One or both meals not found");
    }

    // Swap the dates and types
    await Promise.all([
      prisma.meal.update({
        where: { id: meal1Id },
        data: {
          date: meal2.date,
          type: meal2.type,
        },
      }),
      prisma.meal.update({
        where: { id: meal2Id },
        data: {
          date: meal1.date,
          type: meal1.type,
        },
      }),
    ]);

    // Fetch the updated meal plan
    const updatedMealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: mealPlanId,
        userId: session.user.id,
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
        },
      },
    });

    revalidatePath("/meal-planner");
    return updatedMealPlan as UserMealPlan;
  } catch (error) {
    console.error("Failed to swap meals:", error);
    throw new Error("Failed to swap meals");
  }
}

/**
 * Get all available recipes for meal selection
 */
export async function getAvailableRecipes(isGuest: boolean = false) {
  if (isGuest) {
    // For guests, return sample recipes from seed data
    try {
      const recipes = await prisma.recipe.findMany({
        include: {
          ingredients: true,
        },
        orderBy: {
          name: "asc",
        },
        take: 20, // Limit to first 20 recipes for guests
      });
      return recipes;
    } catch (error) {
      console.error("Failed to get sample recipes for guest:", error);
      return [];
    }
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

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
    throw new Error("Failed to get recipes");
  }
}
