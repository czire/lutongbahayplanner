"use client";

import Header from "@/components/Header";
import { GuestBanner } from "@/components/ui/GuestBanner";
import { type BudgetFormData } from "@/lib/schemas/budget";
import { useGuestOrUser } from "@/lib/hooks/useGuestOrUser";
import { generateGuestMealPlan } from "@/lib/actions/guest-actions";
import { useGuestMealPlans } from "@/providers/GuestSessionProvider";
import { BudgetForm } from "@/components/meal-planner/BudgetForm";
import { MealPlanDisplay } from "@/components/meal-planner/MealPlanDisplay";
import { useGuestLimitations } from "@/lib/hooks/useGuestLimitations";
import { GuestLimitationWarning } from "@/components/meal-planner/GuestLimitationWarning";
import { Loader } from "lucide-react";

const Page = () => {
  const { isGuest, user, isLoading } = useGuestOrUser();
  const {
    mealPlans: guestMealPlans,
    createMealPlan,
    deleteMealPlan,
  } = useGuestMealPlans();
  const { canCreateMealPlan } = useGuestLimitations();

  const handleSubmit = async (data: BudgetFormData) => {
    if (isGuest && !canCreateMealPlan) return;

    const newGuestMealPlan = await generateGuestMealPlan(data.budget);

    // Guests are limited to one meal plan - always replace
    if (guestMealPlans.length > 0) {
      // Clear all existing plans and create new one
      for (const plan of guestMealPlans) {
        await deleteMealPlan(plan.id);
      }
    }

    // Create the new meal plan
    await createMealPlan({
      startDate: newGuestMealPlan.startDate,
      endDate: newGuestMealPlan.endDate,
      budget: newGuestMealPlan.budget,
      meals: newGuestMealPlan.meals,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <MealPlanDisplay mealPlans={guestMealPlans} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
