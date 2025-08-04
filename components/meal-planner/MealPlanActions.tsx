"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { MealType } from "@prisma/client";
import { AddMealDialog } from "./AddMealDialog";

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  cookingTime: number;
  costPerServing: number;
  image: string | null;
}

interface DateOption {
  value: string;
  label: string;
}

interface MealPlanActionsProps {
  isAddDialogOpen: boolean;
  onAddDialogChange: (open: boolean) => void;
  selectedRecipeId: string;
  setSelectedRecipeId: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedMealType: MealType | "";
  setSelectedMealType: (type: MealType | "") => void;
  availableRecipes: Recipe[];
  dateOptions: DateOption[];
  isLoading: boolean;
  onAddMeal: () => void;
  onCancel: () => void;
  isSwapMode: boolean;
  onToggleSwapMode: () => void;
}

export const MealPlanActions = ({
  isAddDialogOpen,
  onAddDialogChange,
  selectedRecipeId,
  setSelectedRecipeId,
  selectedDate,
  setSelectedDate,
  selectedMealType,
  setSelectedMealType,
  availableRecipes,
  dateOptions,
  isLoading,
  onAddMeal,
  onCancel,
  isSwapMode,
  onToggleSwapMode,
}: MealPlanActionsProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <AddMealDialog
        isOpen={isAddDialogOpen}
        onOpenChange={onAddDialogChange}
        selectedRecipeId={selectedRecipeId}
        setSelectedRecipeId={setSelectedRecipeId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        availableRecipes={availableRecipes}
        dateOptions={dateOptions}
        isLoading={isLoading}
        onAddMeal={onAddMeal}
        onCancel={onCancel}
      />

      <Button
        variant={isSwapMode ? "destructive" : "outline"}
        onClick={onToggleSwapMode}
      >
        <ArrowUpDown className="mr-2" size={16} />
        {isSwapMode ? "Cancel Swap" : "Swap Meals"}
      </Button>
    </div>
  );
};
