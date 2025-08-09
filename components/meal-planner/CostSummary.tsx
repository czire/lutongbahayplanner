"use client";

import { Card } from "@/components/ui/card";
import { GuestRecipe, GuestMealPlan } from "@/lib/types/guest";

interface CostSummaryProps {
  recipes: GuestRecipe[];
  currentMealPlan: GuestMealPlan | undefined;
  calculateRecipeCost: (recipe: GuestRecipe) => number;
}

export const CostSummary = ({
  recipes,
  currentMealPlan,
  calculateRecipeCost,
}: CostSummaryProps) => {
  const grandTotal = recipes.reduce(
    (total, recipe) => total + calculateRecipeCost(recipe),
    0
  );

  const budgetPerMeal = currentMealPlan?.budget || 0;
  const totalBudgetAllocation = budgetPerMeal * 3; // 3 meals max
  const averageCostPerMeal =
    recipes.length > 0 ? grandTotal / recipes.length : 0;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
          💰 Cost Breakdown
        </h3>

        {/* Budget Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">
            💡 Budget Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Budget per meal:</span>
              <span className="font-medium">₱{budgetPerMeal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Total allocation (3 meals):</span>
              <span className="font-medium">
                ₱{totalBudgetAllocation.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Average cost per meal:</span>
              <span className="font-medium">
                ₱{averageCostPerMeal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Meals planned:</span>
              <span className="font-medium">
                {recipes.length} meal{recipes.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Individual Recipe Costs */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">
            🍽️ Individual Meal Costs
          </h4>
          {recipes.map((recipe, index) => {
            const recipeCost = calculateRecipeCost(recipe);
            const mealTypes = ["Breakfast", "Lunch", "Dinner"];
            const mealType = mealTypes[index] || `Meal ${index + 1}`;
            const isWithinBudget = recipeCost <= budgetPerMeal;

            return (
              <div
                key={recipe.id}
                className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm font-medium text-gray-500 min-w-[80px]">
                    {mealType}
                  </span>
                  <div className="grid grid-cols-1 place-content-center sm:grid-cols-3 flex-1">
                    <span className="font-medium text-gray-700 text-center sm:text-start">
                      {recipe.name}
                    </span>
                    {isWithinBudget ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full text-center mx-auto items-center">
                        ✓ Within budget
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full text-center m-auto">
                        ⚠️ Over budget
                      </span>
                    )}
                    <div className="text-center sm:text-right">
                      <span
                        className={`font-semibold text-lg ${
                          isWithinBudget ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        ₱{recipeCost.toFixed(2)}
                      </span>
                      <div className="text-xs text-gray-500">
                        / ₱{budgetPerMeal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg p-4 border-2 border-green-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-gray-900">
              Total Cost (All Meals):
            </span>
            <span className="text-3xl font-bold text-green-600">
              ₱{grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Potential savings:</span>
              <span className="font-medium text-green-600">
                ₱{Math.max(0, totalBudgetAllocation - grandTotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Budget efficiency:</span>
              <span className="font-medium">
                {totalBudgetAllocation > 0
                  ? ((grandTotal / totalBudgetAllocation) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
