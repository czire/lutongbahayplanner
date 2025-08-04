"use client";

import { Card } from "@/components/ui/card";
import { GuestRecipe } from "@/lib/types/guest";
import { generateRecipeIngredientsPDF } from "@/lib/utils/pdf-export";
import { RecipeHeader } from "./RecipeHeader";
import { IngredientsSection } from "./IngredientsSection";

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
  // PDF export handler
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
      <RecipeHeader recipe={recipe} recipeCost={recipeCost} />

      {/* Ingredients Section */}
      <IngredientsSection
        recipe={recipe}
        onExportPDF={handleExportIngredientsPDF}
      />
    </Card>
  );
};
