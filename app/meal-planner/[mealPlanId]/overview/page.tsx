"use client";

import { useParams } from "next/navigation";
import { Calendar, ArrowRight, MoveRight } from "lucide-react";
import { EmptyState } from "@/components/meal-planner/EmptyState";

// Components
import { MealPlanLayout } from "@/components/meal-planner/MealPlanLayout";
import { MealPlanHeader } from "@/components/meal-planner/MealPlanHeader";
import { MealPlanLoading } from "@/components/meal-planner/MealPlanLoading";
import { MealPlanError } from "@/components/meal-planner/MealPlanError";
import { MealPlanStats } from "@/components/meal-planner/MealPlanStats";
import { DayCard } from "@/components/meal-planner/DayCard";

// Hooks and utilities
import { useMealPlanAccess } from "@/lib/hooks/useMealPlanAccess";
import { groupMealsByDays } from "@/lib/utils/meal-plan-utils";

const MealPlanOverviewPage = () => {
  const { mealPlanId } = useParams();
  const { currentMealPlan, isValidAccess, isGuest, isLoading } =
    useMealPlanAccess(mealPlanId as string);

  // Show loading while data is being fetched
  if (isLoading) {
    return (
      <MealPlanLoading
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        loadingText="Loading your meal plan overview..."
      />
    );
  }

  // Show error only after loading is complete and access is invalid
  if (!isLoading && !isValidAccess) {
    const errorMessage = !currentMealPlan
      ? "The meal plan you're looking for doesn't exist or has been removed."
      : "You don't have permission to view this meal plan.";

    return (
      <MealPlanError
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        title="Meal Plan Not Found"
        message={errorMessage}
      />
    );
  }

  // Show loading if meal plan is not yet available (additional safety check)
  if (!currentMealPlan) {
    return (
      <MealPlanLoading
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        loadingText="Loading meal plan data..."
      />
    );
  }

  const dayMeals = groupMealsByDays(currentMealPlan!);

  return (
    <>
      <MealPlanHeader
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        actions={[
          {
            href: `/meal-planner/${mealPlanId}`,
            text: "View Full Recipe Details",
            icon: <MoveRight size={16} />,
          },
        ]}
      />

      <MealPlanLayout isGuest={isGuest}>
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Calendar className="inline mr-3" size={32} />
            Meal Plan Overview
          </h1>
          <MealPlanStats
            budget={currentMealPlan?.budget || 0}
            startDate={currentMealPlan?.startDate || ""}
            endDate={currentMealPlan?.endDate || ""}
            daysPlanned={dayMeals.length}
            totalMeals={currentMealPlan?.meals.length || 0}
          />
        </div>

        {dayMeals.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Your meal plan organized by day. Click "View Day Details" to see
                full recipes and shopping list for each day.
              </p>
            </div>

            {/* Days Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {dayMeals.map((day) => (
                <DayCard
                  key={day.dayNumber}
                  day={day}
                  mealPlanId={mealPlanId as string}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            emoji="🍽️"
            title="No meals found in this plan"
            description="This meal plan doesn't contain any meals yet."
            actionHref="/meal-planner"
            actionText="Generate New Meal Plan"
            actionIcon={<ArrowRight size={20} />}
          />
        )}
      </MealPlanLayout>
    </>
  );
};

export default MealPlanOverviewPage;
