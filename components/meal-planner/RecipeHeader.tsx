"use client";

import { GuestRecipe } from "@/lib/types/guest";

interface RecipeHeaderProps {
  recipe: GuestRecipe;
  recipeCost: number;
}

export const RecipeHeader = ({ recipe, recipeCost }: RecipeHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
      <div className="flex justify-between items-start flex-wrap">
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
  );
};
