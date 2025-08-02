"use client";

import { useParams } from "next/navigation";
import { RecipeCard } from "@/components/meal-planner/RecipeCard";
import { CostSummary } from "@/components/meal-planner/CostSummary";
import { MealPlanLayout } from "@/components/meal-planner/MealPlanLayout";
import { MealPlanHeader } from "@/components/meal-planner/MealPlanHeader";
import { MealPlanLoading } from "@/components/meal-planner/MealPlanLoading";
import { MealPlanError } from "@/components/meal-planner/MealPlanError";
import { EmptyState } from "@/components/meal-planner/EmptyState";
import { useMealPlanAccess } from "@/lib/hooks/useMealPlanAccess";
import { calculateRecipeCost } from "@/lib/utils/meal-plan-utils";
import { GuestRecipe } from "@/lib/types/guest";
import { ArrowRight, ChefHat } from "lucide-react";

const Page = () => {
  const { mealPlanId } = useParams();
  const {
    currentMealPlan,
    filteredRecipes,
    isValidAccess,
    isLoading,
    isGuest,
  } = useMealPlanAccess(mealPlanId as string);

  if (isLoading) {
    return (
      <MealPlanLoading
        backHref="/meal-planner"
        backText="Back to Meal Planner"
      />
    );
  }

  if (!isValidAccess || !currentMealPlan) {
    return (
      <MealPlanError
        title="Meal Plan Not Found"
        message={
          !currentMealPlan
            ? "The meal plan you're looking for doesn't exist or has been removed."
            : "You don't have permission to view this meal plan."
        }
        backHref="/meal-planner"
        backText="Back to Meal Planner"
      />
    );
  }

  return (
    <MealPlanLayout isGuest={isGuest}>
      <MealPlanHeader
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        actions={
          !isGuest
            ? [
                {
                  href: `/meal-planner/${mealPlanId}/overview`,
                  text: "📅 Day-by-Day View",
                  icon: <ChefHat size={16} />,
                  className:
                    "bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors font-medium",
                },
              ]
            : []
        }
      />

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Grocery List & Meal Details
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
            Budget: ₱{currentMealPlan.budget.toFixed(2)}
          </div>
          <div className="text-gray-600">
            {new Date(currentMealPlan.startDate).toLocaleDateString()} -{" "}
            {new Date(currentMealPlan.endDate).toLocaleDateString()}
          </div>
          {isGuest && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Guest Mode
            </div>
          )}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="space-y-8">
          {/* Recipes Grid */}
          <div className="grid gap-6">
            {filteredRecipes.map((recipe: GuestRecipe) => {
              const recipeCost = calculateRecipeCost(recipe);
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  recipeCost={recipeCost}
                  calculateRecipeCost={calculateRecipeCost}
                />
              );
            })}
          </div>

          {/* Cost Summary */}
          <CostSummary
            recipes={filteredRecipes}
            currentMealPlan={currentMealPlan as any}
            calculateRecipeCost={calculateRecipeCost}
          />
        </div>
      ) : (
        <EmptyState
          emoji="🍽️"
          title="No recipes found"
          description="Your meal plan doesn't have any recipes yet."
          actionHref="/meal-planner"
          actionText="Generate Meal Plan"
          actionIcon={<ArrowRight size={20} />}
        />
      )}
    </MealPlanLayout>
  );
};

export default Page;
