import { GuestMeal } from "@/lib/types/guest";

interface MealCardProps {
  meal: GuestMeal;
}

export function MealCard({ meal }: MealCardProps) {
  const recipe = meal.recipe;
  const mealEmoji =
    meal.type === "BREAKFAST" ? "🌅" : meal.type === "LUNCH" ? "☀️" : "🌙";
  const mealColor =
    meal.type === "BREAKFAST"
      ? "from-yellow-400 to-orange-400"
      : meal.type === "LUNCH"
      ? "from-orange-400 to-red-400"
      : "from-purple-400 to-blue-400";

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-orange-300 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium mb-4 bg-gradient-to-r ${mealColor}`}
      >
        <span>{mealEmoji}</span>
        <span>{meal.type}</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          {recipe?.name || "Recipe Loading..."}
        </h3>

        {recipe && (
          <>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {recipe.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {recipe.cookingTime}
                </div>
                <div className="text-xs text-gray-600 font-medium">minutes</div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  ₱{recipe.costPerServing}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  per serving
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                👥 Serves {recipe.servings}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
