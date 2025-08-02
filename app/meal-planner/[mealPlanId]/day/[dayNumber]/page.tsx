"use client";

import { useParams } from "next/navigation";
import { MealPlanLayout } from "@/components/meal-planner/MealPlanLayout";
import { MealPlanHeader } from "@/components/meal-planner/MealPlanHeader";
import { MealPlanLoading } from "@/components/meal-planner/MealPlanLoading";
import { MealPlanError } from "@/components/meal-planner/MealPlanError";
import { MealSection } from "@/components/meal-planner/MealSection";
import { DaySummaryCard } from "@/components/meal-planner/DaySummaryCard";
import { EmptyState } from "@/components/meal-planner/EmptyState";
import { DayNavigation } from "@/components/meal-planner/DayNavigation";
import { useMealPlanAccess } from "@/lib/hooks/useMealPlanAccess";
import { getDayMeals, calculateRecipeCost } from "@/lib/utils/meal-plan-utils";
import { Calendar, Clock, ChefHat } from "lucide-react";

const DayDetailsPage = () => {
  const { mealPlanId, dayNumber } = useParams();
  const { currentMealPlan, isValidAccess, isLoading, isGuest } =
    useMealPlanAccess(mealPlanId as string);

  const dayNum = parseInt(dayNumber as string);

  if (isLoading) {
    return (
      <MealPlanLoading
        backHref={`/meal-planner/${mealPlanId}/overview`}
        backText="Back to Overview"
        loadingText="Loading day details..."
      />
    );
  }

  if (!isValidAccess || !currentMealPlan) {
    return (
      <MealPlanError
        title="Day Not Found"
        message="The day you're looking for doesn't exist in this meal plan."
        backHref="/meal-planner"
        backText="Back to Meal Planner"
      />
    );
  }

  // Check if day number is valid
  const maxDays = Math.ceil(currentMealPlan.meals.length / 3);
  if (dayNum < 1 || dayNum > maxDays) {
    return (
      <MealPlanError
        title="Invalid Day Number"
        message={`Day ${dayNum} doesn't exist in this meal plan. Available days: 1-${maxDays}`}
        backHref={`/meal-planner/${mealPlanId}/overview`}
        backText="Back to Overview"
      />
    );
  }

  const dayData = getDayMeals(currentMealPlan, dayNum);

  // Extract recipes for this day
  const dayRecipes = dayData.allMeals
    .map((meal) => meal.recipe)
    .filter((recipe) => recipe && recipe.id);

  // Calculate total cost for the day
  const totalDayCost = dayRecipes.reduce(
    (sum, recipe) => sum + calculateRecipeCost(recipe),
    0
  );

  // Create navigation actions
  const navigationActions = [
    {
      href: `/meal-planner/${mealPlanId}`,
      text: "All Recipes",
      icon: <ChefHat size={16} />,
      className:
        "bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-medium",
    },
  ];

  return (
    <>
      <MealPlanHeader
        backHref={`/meal-planner/${mealPlanId}/overview`}
        backText="Back to Overview"
        actions={navigationActions}
      />

      <DayNavigation
        mealPlanId={mealPlanId as string}
        currentDay={dayNum}
        maxDays={maxDays}
      />

      <MealPlanLayout isGuest={isGuest}>
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Calendar className="inline mr-3" size={32} />
            Day {dayNum} Meal Details
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-gray-600 flex items-center gap-2">
              <Clock size={16} />
              {dayData.date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              Day Cost: ₱{totalDayCost.toFixed(2)}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {dayRecipes.length} Recipes
            </div>
          </div>
        </div>

        {dayRecipes.length > 0 ? (
          <div className="space-y-8">
            {/* Meal Sections */}
            <MealSection
              meal={dayData.breakfast}
              title="Breakfast"
              bgColor="bg-orange-50"
              emoji="🌅"
            />

            <MealSection
              meal={dayData.lunch}
              title="Lunch"
              bgColor="bg-yellow-50"
              emoji="🌞"
            />

            <MealSection
              meal={dayData.dinner}
              title="Dinner"
              bgColor="bg-orange-50"
              emoji="🌆"
            />

            {/* Day Summary */}
            <DaySummaryCard
              dayNumber={dayNum}
              totalCost={totalDayCost}
              recipeCount={dayRecipes.length}
              totalIngredients={dayRecipes.reduce(
                (sum, recipe) => sum + (recipe.ingredients?.length || 0),
                0
              )}
            />
          </div>
        ) : (
          <EmptyState
            emoji="🍽️"
            title={`No recipes for Day ${dayNum}`}
            description="This day doesn't have any meal recipes yet."
            actionHref={`/meal-planner/${mealPlanId}/overview`}
            actionText="Back to Overview"
            actionIcon={<Calendar size={20} />}
          />
        )}
      </MealPlanLayout>
    </>
  );
};

export default DayDetailsPage;
