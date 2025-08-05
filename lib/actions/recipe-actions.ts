"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { GuestRecipe, GuestRecipeIngredient } from "@/lib/types/guest";

/**
 * Update a recipe with new ingredient data
 * This updates the recipe ingredients in the database
 */
export async function updateRecipeIngredients(
  recipeId: string,
  ingredients: Omit<GuestRecipeIngredient, "id">[]
): Promise<GuestRecipe> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // First, get the current recipe to verify it exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: true,
      },
    });

    if (!existingRecipe) {
      throw new Error("Recipe not found");
    }

    // Delete all existing ingredients for this recipe
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: recipeId },
    });

    // Create new ingredients
    const newIngredients = await prisma.recipeIngredient.createMany({
      data: ingredients.map((ingredient) => ({
        recipeId: recipeId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        price: ingredient.price,
        pricePerUnit: ingredient.pricePerUnit,
        notes: ingredient.notes,
      })),
    });

    // Get the updated recipe with new ingredients
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: true,
      },
    });

    if (!updatedRecipe) {
      throw new Error("Failed to retrieve updated recipe");
    }

    // Revalidate relevant paths
    revalidatePath("/meal-planner");
    revalidatePath(`/recipe/${recipeId}`);

    // Convert to GuestRecipe format
    const guestRecipe: GuestRecipe = {
      id: updatedRecipe.id,
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      servings: updatedRecipe.servings,
      cookingTime: updatedRecipe.cookingTime,
      costPerServing: updatedRecipe.costPerServing,
      image: updatedRecipe.image,
      createdAt: updatedRecipe.createdAt,
      ingredients: updatedRecipe.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        price: ing.price || 0,
        pricePerUnit: ing.pricePerUnit,
        notes: ing.notes,
        recipeId: ing.recipeId,
      })),
    };

    return guestRecipe;
  } catch (error) {
    throw new Error(
      `Failed to update recipe ingredients: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete a specific ingredient from a recipe
 */
export async function deleteRecipeIngredient(
  recipeId: string,
  ingredientId: string
): Promise<GuestRecipe> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the ingredient belongs to the recipe
    const ingredient = await prisma.recipeIngredient.findFirst({
      where: {
        id: ingredientId,
        recipeId: recipeId,
      },
    });

    if (!ingredient) {
      throw new Error("Ingredient not found or does not belong to this recipe");
    }

    // Delete the ingredient
    await prisma.recipeIngredient.delete({
      where: { id: ingredientId },
    });

    // Get the updated recipe
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: true,
      },
    });

    if (!updatedRecipe) {
      throw new Error("Recipe not found after ingredient deletion");
    }

    // Revalidate relevant paths
    revalidatePath("/meal-planner");
    revalidatePath(`/recipe/${recipeId}`);

    // Convert to GuestRecipe format
    const guestRecipe: GuestRecipe = {
      id: updatedRecipe.id,
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      servings: updatedRecipe.servings,
      cookingTime: updatedRecipe.cookingTime,
      costPerServing: updatedRecipe.costPerServing,
      image: updatedRecipe.image,
      createdAt: updatedRecipe.createdAt,
      ingredients: updatedRecipe.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        price: ing.price || 0,
        pricePerUnit: ing.pricePerUnit,
        notes: ing.notes,
        recipeId: ing.recipeId,
      })),
    };

    return guestRecipe;
  } catch (error) {
    throw new Error(
      `Failed to delete ingredient: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Update a single recipe ingredient
 */
export async function updateSingleRecipeIngredient(
  recipeId: string,
  ingredientId: string,
  ingredientData: Partial<Omit<GuestRecipeIngredient, "id" | "recipeId">>
): Promise<GuestRecipe> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify the ingredient belongs to the recipe
    const existingIngredient = await prisma.recipeIngredient.findFirst({
      where: {
        id: ingredientId,
        recipeId: recipeId,
      },
    });

    if (!existingIngredient) {
      throw new Error("Ingredient not found or does not belong to this recipe");
    }

    // Update the ingredient
    await prisma.recipeIngredient.update({
      where: { id: ingredientId },
      data: {
        name: ingredientData.name ?? existingIngredient.name,
        quantity: ingredientData.quantity ?? existingIngredient.quantity,
        unit: ingredientData.unit ?? existingIngredient.unit,
        price: ingredientData.price ?? existingIngredient.price,
        pricePerUnit:
          ingredientData.pricePerUnit ?? existingIngredient.pricePerUnit,
        notes: ingredientData.notes ?? existingIngredient.notes,
      },
    });

    // Get the updated recipe
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: true,
      },
    });

    if (!updatedRecipe) {
      throw new Error("Recipe not found after ingredient update");
    }

    // Revalidate relevant paths
    revalidatePath("/meal-planner");
    revalidatePath(`/recipe/${recipeId}`);

    // Convert to GuestRecipe format
    const guestRecipe: GuestRecipe = {
      id: updatedRecipe.id,
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      servings: updatedRecipe.servings,
      cookingTime: updatedRecipe.cookingTime,
      costPerServing: updatedRecipe.costPerServing,
      image: updatedRecipe.image,
      createdAt: updatedRecipe.createdAt,
      ingredients: updatedRecipe.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        price: ing.price || 0,
        pricePerUnit: ing.pricePerUnit,
        notes: ing.notes,
        recipeId: ing.recipeId,
      })),
    };

    return guestRecipe;
  } catch (error) {
    throw new Error(
      `Failed to update ingredient: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
