import { RecipeCard } from "./RecipeCard";
import { calculateRecipeCost } from "@/lib/utils/meal-plan-utils";

interface MealSectionProps {
  meal: any;
  title: string;
  bgColor: string;
  emoji: string;
}

export function MealSection({ meal, title, bgColor, emoji }: MealSectionProps) {
  return (
    <div className="space-y-4">
      <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {emoji} {title}
        </h2>
        {meal && meal.recipe ? (
          <p className="text-gray-600 text-sm">
            {meal.recipe.description ||
              "Delicious Filipino dish prepared just for you"}
          </p>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No meal planned for this time
          </p>
        )}
      </div>

      {meal && meal.recipe && (
        <RecipeCard
          recipe={meal.recipe}
          recipeCost={calculateRecipeCost(meal.recipe)}
          calculateRecipeCost={calculateRecipeCost}
        />
      )}
    </div>
  );
}
