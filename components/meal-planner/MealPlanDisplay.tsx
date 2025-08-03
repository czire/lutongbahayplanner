import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { MealCard } from "./MealCard";
import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { UserMealPlan } from "@/lib/types/user";
import { Button } from "../ui/button";
import { addUserMealPlan } from "@/lib/actions/user-actions";

// Unified meal plan type that works with both guest and user meal plans
interface UnifiedMealPlan {
  id: string;
  budget: number;
  startDate: string | Date;
  endDate: string | Date;
  meals: any[];
  createdAt: Date | string;
  userId?: string;
}

interface MealPlanDisplayProps {
  mealPlans: UnifiedMealPlan[];
}

// Helper function to check if a meal plan is complete
const isMealPlanComplete = (
  mealPlan: UnifiedMealPlan,
  isGuest: boolean
): boolean => {
  if (!mealPlan.meals || mealPlan.meals.length === 0) return false;

  if (isGuest) {
    // Guest plans should have 3 meals (breakfast, lunch, dinner)
    return mealPlan.meals.length === 3;
  } else {
    // User plans should have meals divisible by 3 (complete days)
    return mealPlan.meals.length % 3 === 0 && mealPlan.meals.length > 0;
  }
};

// Helper function to get meal plan status message
const getMealPlanStatusMessage = (
  mealPlan: UnifiedMealPlan,
  isGuest: boolean
): string | null => {
  if (!mealPlan.meals || mealPlan.meals.length === 0) {
    return "No meals were generated";
  }

  if (isGuest && mealPlan.meals.length < 3) {
    return `Only ${mealPlan.meals.length} of 3 meals generated`;
  }

  if (!isGuest && mealPlan.meals.length % 3 !== 0) {
    const completeDays = Math.floor(mealPlan.meals.length / 3);
    const incompleteMeals = mealPlan.meals.length % 3;
    return `${completeDays} complete days, ${incompleteMeals} additional meals`;
  }

  return null;
};

export function MealPlanDisplay({ mealPlans }: MealPlanDisplayProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Store day identifiers instead
  const { isGuest, isAuthenticated } = useGuestOrUser();

  // Helper function to get selected meals data
  const getSelectedMealsData = () => {
    const selectedMealsData: any[] = [];

    mealPlans.forEach((plan) => {
      const daysCount = Math.ceil(plan.meals.length / 3);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const dayId = `${plan.id}-day-${dayIndex}`;

        if (selectedDays.includes(dayId)) {
          const dayMeals = plan.meals.slice(dayIndex * 3, (dayIndex + 1) * 3);
          selectedMealsData.push({
            planId: plan.id,
            dayIndex,
            meals: dayMeals,
          });
        }
      }
    });

    return selectedMealsData;
  };

  // Helper function to create a UserMealPlan from selected meals
  const createMealPlanFromSelected = (): UserMealPlan | null => {
    const selectedMealsData = getSelectedMealsData();

    if (selectedMealsData.length === 0) {
      return null;
    }

    // Flatten all selected meals
    const allSelectedMeals = selectedMealsData.flatMap(
      (dayData) => dayData.meals
    );

    if (allSelectedMeals.length === 0) {
      return null;
    }

    // Get the source meal plan to extract basic info
    const sourcePlan = mealPlans[0];
    if (!sourcePlan) return null;

    // Generate new ID for the meal plan
    const newPlanId = `selected_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    // Calculate date range based on selected meals
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (selectedMealsData.length - 1) * 24 * 60 * 60 * 1000
    );

    // Create the meal plan structure
    const newMealPlan: UserMealPlan = {
      id: newPlanId,
      userId: sourcePlan.userId || "", // Will be set properly on the server
      budget: sourcePlan.budget,
      startDate,
      endDate,
      meals: allSelectedMeals.map((meal, index) => ({
        ...meal,
        id: `meal_${newPlanId}_${index}`,
        mealPlanId: newPlanId,
        date: new Date(
          startDate.getTime() + Math.floor(index / 3) * 24 * 60 * 60 * 1000
        ),
      })),
      createdAt: new Date(),
    };

    return newMealPlan;
  };

  // Filter out meal plans that have no meals or are invalid
  const validMealPlans = mealPlans.filter(
    (plan) => plan && plan.meals && plan.meals.length > 0
  );

  // Handle cases where no meal plans exist
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

  // Handle cases where meal plans exist but have no meals (generation failed)
  if (validMealPlans.length === 0) {
    return (
      <div className="mt-12 text-center">
        <div className="bg-red-50 rounded-lg p-8 border border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Meal Plan Generation Failed
          </h3>
          <p className="text-red-600 mb-4">
            {isGuest
              ? "We couldn't generate meals within your daily budget. This might happen if your budget is too low or our recipe database is temporarily unavailable."
              : "We couldn't generate your weekly meal plan. This might happen if your budget is too low or our recipe database is temporarily unavailable."}
          </p>
          <div className="bg-red-100 rounded-lg p-4 text-sm text-red-700">
            <h4 className="font-semibold mb-2">Suggestions:</h4>
            <ul className="text-left space-y-1">
              <li>
                • Try increasing your {isGuest ? "daily" : "weekly"} budget
              </li>
              <li>• Check your internet connection</li>
              <li>• Try generating again in a few minutes</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
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
        {validMealPlans.map((guestMealPlan) => {
          // Additional safety check for individual meal plan
          if (!guestMealPlan.meals || guestMealPlan.meals.length === 0) {
            return (
              <Card
                key={guestMealPlan.id}
                className="shadow-xl border-0 bg-red-50/90 backdrop-blur-sm overflow-hidden border-red-200"
              >
                <CardHeader className="bg-gradient-to-r from-red-100 to-orange-100 border-b pt-5">
                  <CardTitle className="text-xl font-bold text-red-800">
                    ⚠️ Empty Meal Plan
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    This meal plan was created but contains no meals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-red-700 text-center mb-4">
                    The meal generation process didn't complete successfully.
                    This could be due to:
                  </p>
                  <ul className="text-red-600 text-sm space-y-1 text-left">
                    <li>• Budget too low for available recipes</li>
                    <li>• Network connectivity issues</li>
                    <li>• Temporary service unavailability</li>
                  </ul>
                  <div className="mt-4 text-center">
                    <p className="text-red-700 text-sm">
                      Please try generating a new meal plan with a higher
                      budget.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }

          const isComplete = isMealPlanComplete(guestMealPlan, isGuest);
          const statusMessage = getMealPlanStatusMessage(
            guestMealPlan,
            isGuest
          );

          return (
            <Card
              key={guestMealPlan.id}
              className={`shadow-xl border-0 backdrop-blur-sm overflow-hidden ${
                isComplete ? "bg-white/90" : "bg-yellow-50/90 border-yellow-200"
              }`}
            >
              <CardHeader
                className={`border-b pt-5 ${
                  isComplete
                    ? "bg-gradient-to-r from-orange-100 to-yellow-100"
                    : "bg-gradient-to-r from-yellow-100 to-orange-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {isGuest ? "Today's Menu" : "Weekly Menu Plan"}
                      {!isComplete && (
                        <span className="ml-2 text-sm font-normal text-yellow-700">
                          (Incomplete)
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-1">
                      {isGuest ? "Daily" : "Weekly"} Budget:{" "}
                      <span className="font-semibold text-green-600">
                        ₱{guestMealPlan.budget}
                      </span>
                    </CardDescription>

                    {/* Status message for incomplete plans */}
                    {statusMessage && (
                      <div className="mt-2 text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                        ⚠️ {statusMessage}
                      </div>
                    )}

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
                          {new Date(
                            guestMealPlan.startDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(guestMealPlan.endDate).toLocaleDateString()}
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
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      {Array.from({ length: 3 }, (_, index) => {
                        const meal = guestMealPlan.meals[index];
                        const mealType =
                          index === 0
                            ? "🌅 Breakfast"
                            : index === 1
                            ? "🌞 Lunch"
                            : "🌆 Dinner";

                        return (
                          <div key={`meal-${index}`} className="space-y-2">
                            <div className="text-center text-sm font-medium text-gray-600 mb-2">
                              {mealType}
                            </div>
                            {meal ? (
                              <MealCard meal={meal} />
                            ) : (
                              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <div className="text-gray-400 text-2xl mb-2">
                                  🍽️
                                </div>
                                <p className="text-gray-500 text-sm">
                                  No meal generated
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Try increasing your budget
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                              <div className="text-center mb-4 relative">
                                <h4 className="font-semibold text-gray-800">
                                  Day {dayIndex + 1} -{" "}
                                  {dayDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </h4>
                                <Checkbox
                                  className="absolute right-0 top-0 w-5 h-5 border border-gray-500"
                                  checked={selectedDays.includes(
                                    `${guestMealPlan.id}-day-${dayIndex}`
                                  )}
                                  onCheckedChange={(checked) => {
                                    const dayId = `${guestMealPlan.id}-day-${dayIndex}`;
                                    if (checked) {
                                      setSelectedDays([...selectedDays, dayId]);
                                    } else {
                                      setSelectedDays(
                                        selectedDays.filter(
                                          (id) => id !== dayId
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>

                              <div className="grid gap-4 md:grid-cols-3">
                                {Array.from({ length: 3 }, (_, mealIndex) => {
                                  const meal = dayMeals[mealIndex];
                                  const mealType =
                                    mealIndex === 0
                                      ? "🌅 Breakfast"
                                      : mealIndex === 1
                                      ? "🌞 Lunch"
                                      : "🌆 Dinner";

                                  return (
                                    <div
                                      key={`day-${dayIndex}-meal-${mealIndex}`}
                                      className="space-y-2"
                                    >
                                      <div className="text-center text-sm font-medium text-gray-600">
                                        {mealType}
                                      </div>
                                      {meal ? (
                                        <MealCard meal={meal} />
                                      ) : (
                                        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                                          <div className="text-gray-400 text-xl mb-1">
                                            🍽️
                                          </div>
                                          <p className="text-gray-500 text-xs">
                                            No meal planned
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
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
                {isGuest ? (
                  // Guest users get direct access to recipe details
                  <DebouncedLink
                    className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                    href={`/meal-planner/${guestMealPlan.id}`}
                    variant="default"
                  >
                    {guestMealPlan.meals.length === 0
                      ? "View Plan Details"
                      : `View ${
                          guestMealPlan.meals.length === 3
                            ? "Today's"
                            : "Available"
                        } Recipe Details`}
                  </DebouncedLink>
                ) : (
                  // Authenticated users get multiple navigation options
                  <div className="space-y-3">
                    <Button
                      className={`w-full justify-center shadow-lg transform transition-all duration-200 hover:scale-[1.02] ${
                        selectedDays.length === 0
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      }`}
                      onClick={async () => {
                        const selectedMealPlan = createMealPlanFromSelected();
                        if (selectedMealPlan) {
                          try {
                            await addUserMealPlan(selectedMealPlan);
                            // Clear selections after successful save
                            setSelectedDays([]);
                            // You could add a success message here
                            console.log("Selected meals saved successfully!");
                          } catch (error) {
                            console.error(
                              "Failed to save selected meals:",
                              error
                            );
                            // You could add an error message here
                          }
                        } else {
                          console.warn("No meals selected");
                          // You could add a warning message here
                        }
                      }}
                      disabled={selectedDays.length === 0}
                    >
                      {selectedDays.length === 0
                        ? "Select Days to Add to Plan"
                        : `Add ${selectedDays.length} Selected Day${
                            selectedDays.length > 1 ? "s" : ""
                          } to Plan`}
                    </Button>
                    <DebouncedLink
                      className="w-full justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                      href={`/meal-planner/${guestMealPlan.id}/overview`}
                      variant="default"
                    >
                      📅 View Day-by-Day Overview
                    </DebouncedLink>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
