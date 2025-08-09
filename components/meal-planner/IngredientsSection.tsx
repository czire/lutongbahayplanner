"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { GuestRecipe } from "@/lib/types/guest";
import { IngredientCard } from "./IngredientCard";

interface IngredientsSectionProps {
  recipe: GuestRecipe;
  onIngredientUpdate?: (
    ingredientId: string,
    updatedIngredient: GuestRecipe["ingredients"][number]
  ) => void;
  onIngredientDelete?: (ingredientId: string) => void;
  onExportPDF: () => void;
  isLoading?: boolean;
}

export const IngredientsSection = ({
  recipe,
  onIngredientUpdate,
  onIngredientDelete,
  onExportPDF,
  isLoading = false,
}: IngredientsSectionProps) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          🥬 Ingredients ({recipe.ingredients?.length || 0})
        </h3>
        <Button
          onClick={onExportPDF}
          className="bg-green-500 hover:bg-green-600 text-white"
          size="sm"
          disabled={isLoading}
        >
          <Download className="mr-2" size={14} />
          Save Ingredients PDF
        </Button>
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <div className="grid gap-3">
          {recipe.ingredients.map((ingredient) =>
            onIngredientUpdate && onIngredientDelete ? (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onUpdate={(updatedIngredient) =>
                  onIngredientUpdate(ingredient.id, updatedIngredient)
                }
                onDelete={onIngredientDelete}
                isLoading={isLoading}
              />
            ) : (
              <div
                key={ingredient.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between flex-wrap">
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
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🤷‍♂️</div>
          <p>No ingredients listed for this recipe</p>
        </div>
      )}
    </div>
  );
};
