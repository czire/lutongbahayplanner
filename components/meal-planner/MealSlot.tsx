"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Clock } from "lucide-react";
import type { MealType } from "@prisma/client";
import type { UserMeal } from "@/lib/types/user";
import type { GuestMeal } from "@/lib/types/guest";

interface MealSlotProps {
  mealType: MealType;
  meal: UserMeal | GuestMeal | null;
  date: string;
  isSelected: boolean;
  isSwapMode: boolean;
  isLoading: boolean;
  onMealClick: (mealId: string) => void;
  onRemoveMeal: (mealId: string) => void;
  onAddMeal: (date: string, mealType: MealType) => void;
}

export const MealSlot = ({
  mealType,
  meal,
  date,
  isSelected,
  isSwapMode,
  isLoading,
  onMealClick,
  onRemoveMeal,
  onAddMeal,
}: MealSlotProps) => {
  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        meal
          ? `bg-white hover:shadow-md cursor-pointer ${
              isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
            } ${isSwapMode ? "hover:bg-blue-50" : ""}`
          : "bg-gray-50 border-dashed border-2 hover:bg-gray-100 hover:border-gray-300"
      }`}
      onClick={() => meal && onMealClick(meal.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium capitalize">{mealType.toLowerCase()}</h4>
        {meal && !isSwapMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveMeal(meal.id);
            }}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {meal ? (
        <div>
          <p className="font-semibold text-sm">
            {meal.recipe?.name || "Recipe"}
          </p>
          {meal.recipe && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {meal.recipe.cookingTime} min
              </div>
              <div>₱{meal.recipe.costPerServing.toFixed(2)} per serving</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">No meal planned</p>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onAddMeal(date, mealType);
            }}
            disabled={isLoading}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add {mealType.toLowerCase()}
          </Button>
        </div>
      )}
    </div>
  );
};
