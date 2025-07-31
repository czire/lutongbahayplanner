"use client";

import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { RecipeCard } from "@/components/meal-planner/RecipeCard";
import { CostSummary } from "@/components/meal-planner/CostSummary";
import { GuestMeal, GuestRecipe, GuestMealPlan } from "@/lib/types/guest";
import {
  useGuestGeneratedRecipes,
  useGuestMealPlans,
} from "@/providers/GuestSessionProvider";
import { ArrowRight, MoveLeft } from "lucide-react";

/**
 * Extracts and filters recipes from the first meal plan
 */
const extractRecipesFromMealPlan = (
  mealPlans: GuestMealPlan[]
): GuestRecipe[] => {
  if (!mealPlans || mealPlans.length === 0) return [];

  return (
    mealPlans[0]?.meals
      ?.map((meal: GuestMeal) => meal.recipe)
      .filter((recipe): recipe is GuestRecipe => recipe !== undefined) || []
  );
};

/**
 * Calculates total cost for a recipe based on ingredient prices
 */
const calculateRecipeCost = (recipe: GuestRecipe): number => {
  return (
    recipe.ingredients?.reduce(
      (sum, ingredient) => sum + (ingredient.price || 0),
      0
    ) || 0
  );
};

const Page = () => {
  const { generatedRecipes: generatedGuestRecipes } =
    useGuestGeneratedRecipes();
  const { mealPlans } = useGuestMealPlans();

  // Extract recipes using the helper function
  const guestRecipes = extractRecipesFromMealPlan(mealPlans);
  const currentMealPlan = mealPlans[0];

  console.log("Guest Generated Recipes:", generatedGuestRecipes);
  console.log("Meal Plans:", mealPlans);
  console.log("Guest Recipes:", guestRecipes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <DebouncedLink
            href="/meal-planner"
            hoverStyle="brand"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <MoveLeft size={20} />
            Back to Meal Planner
          </DebouncedLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛍️ Grocery List & Meal Details
          </h1>
          <div className="flex items-center gap-4">
            {currentMealPlan ? (
              <>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                  Budget: ₱{currentMealPlan.budget.toFixed(2)}
                </div>
                <div className="text-gray-600">
                  {new Date(currentMealPlan.startDate).toLocaleDateString()} -{" "}
                  {new Date(currentMealPlan.endDate).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No meal plan found</div>
            )}
          </div>
        </div>

        {guestRecipes.length > 0 ? (
          <div className="space-y-8">
            {/* Recipes Grid */}
            <div className="grid gap-6">
              {guestRecipes.map((recipe: GuestRecipe) => {
                const recipeCost = calculateRecipeCost(recipe);
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    recipeCost={recipeCost}
                  />
                );
              })}
            </div>

            {/* Cost Summary */}
            <CostSummary
              recipes={guestRecipes}
              currentMealPlan={currentMealPlan}
              calculateRecipeCost={calculateRecipeCost}
            />
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-500 mb-6">
              Your meal plan doesn't have any recipes yet.
            </p>
            <DebouncedLink
              href="/meal-planner"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <ArrowRight size={20} />
              Generate Meal Plan
            </DebouncedLink>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
