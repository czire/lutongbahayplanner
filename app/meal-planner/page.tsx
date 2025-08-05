"use client";

import { GuestBanner } from "@/components/ui/GuestBanner";
import { type BudgetFormData } from "@/lib/schemas/budget";
import { useUser } from "@/lib/contexts/UserContext";
import { BudgetForm } from "@/components/meal-planner/BudgetForm";
import { MealPlanDisplay } from "@/components/meal-planner/MealPlanDisplay";
import { GuestLimitationWarning } from "@/components/meal-planner/GuestLimitationWarning";
import { Loader } from "lucide-react";

const Page = () => {
  const {
    isGuest,
    user,
    isLoading,
    generatedMealPlans,
    createMealPlan,
    canCreateMealPlan,
  } = useUser();

  const handleSubmit = async (data: BudgetFormData) => {
    if (isGuest && !canCreateMealPlan) return;

    try {
      await createMealPlan({ budget: data.budget });
    } catch (error) {
      console.error("Failed to create meal plan:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-primary h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Guest Banner */}
          {isGuest && (
            <GuestBanner
              className="mb-6"
              showLimits={true}
              dismissible={true}
            />
          )}

          {/* Guest Limitation Warning - ONLY for generations */}
          {isGuest && <GuestLimitationWarning />}

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Meal Planner
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isGuest
                ? "Discover delicious Filipino recipes that fit your budget. Set your daily budget to get started!"
                : `Welcome back, ${user?.name}! Plan your perfect meals within your budget.`}
            </p>
          </div>

          {/* Budget Form */}
          <BudgetForm onSubmit={handleSubmit} />

          {/* Meal Plan Display */}
          {isGuest ? (
            // For guests, show their meal plans as normal (not preview)
            generatedMealPlans.length > 0 && (
              <MealPlanDisplay
                mealPlans={generatedMealPlans}
                isPreview={false}
              />
            )
          ) : (
            // For authenticated users, show generated plans as preview and saved plans separately
            <>
              {/* Show generated plans first (if any) as preview */}
              {generatedMealPlans.length > 0 && (
                <MealPlanDisplay
                  mealPlans={generatedMealPlans}
                  isPreview={true}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
