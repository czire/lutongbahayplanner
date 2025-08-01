"use client";

import { Card } from "@/components/ui/card";
import { GuestRecipe } from "@/lib/types/guest";
import { Download } from "lucide-react";
import { generateRecipeIngredientsPDF } from "@/lib/utils/pdf-export";

interface RecipeCardProps {
  recipe: GuestRecipe;
  recipeCost: number;
  calculateRecipeCost: (recipe: GuestRecipe) => number;
}

export const RecipeCard = ({
  recipe,
  recipeCost,
  calculateRecipeCost,
}: RecipeCardProps) => {
  // PDF export handler for individual recipe
  const handleExportIngredientsPDF = () => {
    try {
      generateRecipeIngredientsPDF(recipe, calculateRecipeCost);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-orange-100 mb-3">{recipe.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                👥 {recipe.servings} servings
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                ⏰ {recipe.cookingTime} mins
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                💰 ₱{recipe.costPerServing.toFixed(2)}/serving
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-orange-100">Total Cost</div>
            <div className="text-3xl font-bold">₱{recipeCost.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            🥬 Ingredients ({recipe.ingredients?.length || 0})
          </h3>
          <button
            onClick={handleExportIngredientsPDF}
            className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm shadow-sm"
          >
            <Download size={14} />
            Save Ingredients PDF
          </button>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <div className="grid gap-3">
            {recipe.ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {ingredient.name}
                      </h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>

                    {ingredient.notes && (
                      <p className="text-gray-600 text-sm italic mb-2">
                        📝 {ingredient.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {ingredient.pricePerUnit && (
                        <span>
                          💱 ₱{ingredient.pricePerUnit.toFixed(2)} per{" "}
                          {ingredient.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Cost</div>
                    <div className="text-xl font-bold text-green-600">
                      ₱{(ingredient.price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🤷‍♂️</div>
            <p>No ingredients listed for this recipe</p>
          </div>
        )}
      </div>
    </Card>
  );
};
