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
import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";

interface MealPlanDisplayProps {
  mealPlans: GuestMealPlan[];
}

export function MealPlanDisplay({ mealPlans }: MealPlanDisplayProps) {
  const { isGuest, isAuthenticated } = useGuestOrUser();

  if (mealPlans.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Meal Plan Yet
          </h3>
          <p className="text-gray-600">
            {isGuest
              ? "Generate your first daily meal plan by setting a budget above!"
              : "Create your first weekly meal plan by setting a budget above!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isGuest ? "Today's Meal Plan" : "Your Weekly Meal Plan"}
        </h2>
        <p className="text-gray-600">
          {isGuest
            ? "Delicious Filipino dishes for today within your budget"
            : "A week of delicious Filipino meals planned just for you"}
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
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {isGuest ? "Today's Menu" : "Weekly Menu Plan"}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-1">
                    {isGuest ? "Daily" : "Weekly"} Budget:{" "}
                    <span className="font-semibold text-green-600">
                      ₱{guestMealPlan.budget}
                    </span>
                  </CardDescription>

                  {/* Date Range Display */}
                  <div className="mt-2 text-sm text-gray-500">
                    {isGuest ? (
                      <span>
                        📅{" "}
                        {new Date(guestMealPlan.startDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    ) : (
                      <span>
                        📅{" "}
                        {new Date(guestMealPlan.startDate).toLocaleDateString()}{" "}
                        - {new Date(guestMealPlan.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                    {guestMealPlan.meals.length} meals planned
                  </div>
                  {!isGuest && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Math.ceil(guestMealPlan.meals.length / 3)} days covered
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isGuest ? (
                // Daily Plan Layout for Guests (3 meals in a row)
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Your Meals for Today
                    </h3>
                    <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                      <span>🌅 Breakfast</span>
                      <span>•</span>
                      <span>🌞 Lunch</span>
                      <span>•</span>
                      <span>🌆 Dinner</span>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {guestMealPlan.meals.map((meal, index) => (
                      <div key={meal.id} className="space-y-2">
                        <div className="text-center text-sm font-medium text-gray-600 mb-2">
                          {index === 0
                            ? "🌅 Breakfast"
                            : index === 1
                            ? "🌞 Lunch"
                            : "🌆 Dinner"}
                        </div>
                        <MealCard meal={meal} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Weekly Plan Layout for Authenticated Users
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Your Weekly Meal Schedule
                    </h3>
                    <p className="text-sm text-gray-500">
                      Organized by days with breakfast, lunch, and dinner
                      options
                    </p>
                  </div>

                  {/* Group meals by days (assuming 3 meals per day) */}
                  <div className="space-y-8">
                    {Array.from(
                      { length: Math.ceil(guestMealPlan.meals.length / 3) },
                      (_, dayIndex) => {
                        const dayMeals = guestMealPlan.meals.slice(
                          dayIndex * 3,
                          (dayIndex + 1) * 3
                        );
                        const dayDate = new Date(guestMealPlan.startDate);
                        dayDate.setDate(dayDate.getDate() + dayIndex);

                        return (
                          <div
                            key={dayIndex}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="text-center mb-4">
                              <h4 className="font-semibold text-gray-800">
                                Day {dayIndex + 1} -{" "}
                                {dayDate.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </h4>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                              {dayMeals.map((meal, mealIndex) => (
                                <div key={meal.id} className="space-y-2">
                                  <div className="text-center text-sm font-medium text-gray-600">
                                    {mealIndex === 0
                                      ? "🌅 Breakfast"
                                      : mealIndex === 1
                                      ? "🌞 Lunch"
                                      : "🌆 Dinner"}
                                  </div>
                                  <MealCard meal={meal} />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-6 pt-0">
              <DebouncedLink
                className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                href={`/meal-planner/${guestMealPlan.id}`}
                variant="default"
              >
                {isGuest
                  ? "View Today's Recipe Details"
                  : "View Full Weekly Plan"}
              </DebouncedLink>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
