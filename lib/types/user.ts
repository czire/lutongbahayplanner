// lib/types/user.ts

import type { MealType } from "@prisma/client";

export interface UserMealPlan {
  id: string;
  userId: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  meals: UserMeal[];
  createdAt: Date;
}

export interface UserMeal {
  id: string;
  mealPlanId: string;
  recipeId: string;
  date: Date;
  type: MealType;
  recipe: UserRecipe;
}

export interface UserRecipe {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  cookingTime: number;
  costPerServing: number;
  image: string | null;
  ingredients: UserRecipeIngredient[];
}

export interface UserRecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  pricePerUnit: number | null;
  notes: string | null;
}

export interface UserIngredient {
  id: string;
  name: string;
  quantity: string | null;
  unit: string | null;
  userId: string;
  createdAt: Date;
}

export interface CreateUserMealPlanData {
  budget: number;
  startDate: string;
  endDate: string;
}

export interface CreateUserIngredientData {
  name: string;
  quantity: string;
  unit: string;
}
