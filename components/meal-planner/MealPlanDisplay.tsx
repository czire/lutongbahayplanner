import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { GuestMealPlan } from "@/lib/types/guest";
import { MealCard } from "./MealCard";

interface MealPlanDisplayProps {
  mealPlans: GuestMealPlan[];
}

export function MealPlanDisplay({ mealPlans }: MealPlanDisplayProps) {
  if (mealPlans.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Meal Plan Yet
          </h3>
          <p className="text-gray-600">
            Generate your first meal plan by setting a budget above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🍜 Your Meal Plan for Today
        </h2>
        <p className="text-gray-600">
          Delicious Filipino dishes curated just for your budget
        </p>
      </div>

      <div className="grid gap-6">
        {mealPlans.map((guestMealPlan) => (
          <Card
            key={guestMealPlan.id}
            className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100 border-b pt-5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Today's Menu
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-1">
                    Total Budget:{" "}
                    <span className="font-semibold text-green-600">
                      ₱{guestMealPlan.budget}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                    {guestMealPlan.meals.length} meals planned
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                {guestMealPlan.meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <DebouncedLink
                className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                href={`/meal-planner/${guestMealPlan.id}`}
                variant="default"
              >
                🍽️ View Full Recipe Details
              </DebouncedLink>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
