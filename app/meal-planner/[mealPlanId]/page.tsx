"use client";

import { Card } from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { GuestRecipe } from "@/lib/types/guest";
import {
  useGuestGeneratedRecipes,
  useGuestMealPlans,
} from "@/providers/GuestSessionProvider";
import { ArrowRight, MoveLeft } from "lucide-react";

const Page = () => {
  const { generatedRecipes: generatedGuestRecipes } =
    useGuestGeneratedRecipes();
  const { mealPlans } = useGuestMealPlans();

  const something = generatedGuestRecipes.map((recipe: GuestRecipe) => {
    const hey = recipe.ingredients;
  });

  return (
    <div className="min-h-screen bg-secondary p-5">
      <DebouncedLink href="/meal-planner" hoverStyle="brand">
        <MoveLeft />
        Back to Meal Planner
      </DebouncedLink>
      <div className="p-10">
        <div>
          <h2>🛍️ Grocery List Summary</h2>
          <p>Budget: {mealPlans[0]?.budget}</p>
        </div>
        {generatedGuestRecipes.length > 0 ? (
          generatedGuestRecipes.map((recipe: GuestRecipe) => (
            <div key={recipe.id} className="mb-6">
              <div>
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
              </div>
              <div>
                {recipe.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center">
                    <span className="mr-2">{ingredient.name}</span>
                    <span className="text-sm text-gray-500">
                      {ingredient.quantity}
                    </span>
                    <span className="text-sm text-gray-500">
                      {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No generated recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
