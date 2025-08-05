// components/meal-planner/SaveMealPlanButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/contexts/UserContext";
import { addUserMealPlan } from "@/lib/actions/user-actions";
import { clearGeneratedMealPlanFromLocalStorage } from "@/lib/utils/meal-plan-storage";
import type { UserMealPlan } from "@/lib/types/user";

interface SaveMealPlanButtonProps {
  mealPlan: UserMealPlan;
  onSaved?: () => void;
}

export function SaveMealPlanButton({
  mealPlan,
  onSaved,
}: SaveMealPlanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshMealPlans } = useUser();

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Save to database
      await addUserMealPlan(mealPlan);

      // Clear from localStorage after successful save
      clearGeneratedMealPlanFromLocalStorage(user.id);

      // Refresh the meal plans list
      await refreshMealPlans();

      // Call the onSaved callback
      onSaved?.();
    } catch (error) {
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isLoading || !user}
      className="w-full"
    >
      {isLoading ? "Saving..." : "Save Meal Plan"}
    </Button>
  );
}
