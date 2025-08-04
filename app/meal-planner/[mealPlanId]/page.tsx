"use client";

import { useParams } from "next/navigation";
import { MealPlanLayout } from "@/components/meal-planner/MealPlanLayout";
import { MealPlanHeader } from "@/components/meal-planner/MealPlanHeader";
import { MealPlanLoading } from "@/components/meal-planner/MealPlanLoading";
import { MealPlanError } from "@/components/meal-planner/MealPlanError";
import { MealPlanTabs } from "@/components/meal-planner/MealPlanTabs";
import { useMealPlanAccess } from "@/lib/hooks/useMealPlanAccess";
import { useUser } from "@/lib/contexts/UserContext";
import { ChefHat } from "lucide-react";

const Page = () => {
  const { mealPlanId } = useParams();
  const { refreshMealPlans } = useUser();
  const {
    currentMealPlan,
    filteredRecipes,
    isValidAccess,
    isLoading,
    isGuest,
  } = useMealPlanAccess(mealPlanId as string);

  // Handle meal plan updates
  const handleMealPlanUpdate = async () => {
    await refreshMealPlans();
  };

  if (isLoading) {
    return (
      <MealPlanLoading
        backHref="/meal-planner"
        backText="Back to Meal Planner"
      />
    );
  }

  if (!isValidAccess || !currentMealPlan) {
    return (
      <MealPlanError
        title="Meal Plan Not Found"
        message={
          !currentMealPlan
            ? "The meal plan you're looking for doesn't exist or has been removed."
            : "You don't have permission to view this meal plan."
        }
        backHref="/meal-planner"
        backText="Back to Meal Planner"
      />
    );
  }

  return (
    <MealPlanLayout isGuest={isGuest}>
      <MealPlanHeader
        backHref="/meal-planner"
        backText="Back to Meal Planner"
        actions={
          !isGuest
            ? [
                {
                  href: `/meal-planner/${mealPlanId}/overview`,
                  text: "📅 Day-by-Day View",
                  icon: <ChefHat size={16} />,
                  className:
                    "bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors font-medium",
                },
              ]
            : []
        }
      />

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Meal Plan Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
            Budget: ₱{currentMealPlan.budget.toFixed(2)}
          </div>
          <div className="text-gray-600">
            {new Date(currentMealPlan.startDate).toLocaleDateString()} -{" "}
            {new Date(currentMealPlan.endDate).toLocaleDateString()}
          </div>
          {isGuest && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Guest Mode
            </div>
          )}
        </div>
      </div>

      {/* Tabbed Interface for Recipes and Manual Management */}
      <MealPlanTabs
        currentMealPlan={currentMealPlan as any}
        filteredRecipes={filteredRecipes}
        isGuest={isGuest}
        onMealPlanUpdate={handleMealPlanUpdate}
      />
    </MealPlanLayout>
  );
};

export default Page;
