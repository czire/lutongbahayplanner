"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { MealType } from "@prisma/client";

interface MissingMeal {
  date: string;
  mealType: MealType;
  dateLabel: string;
}

interface MealPlanCompletionCardProps {
  totalPossibleMeals: number;
  currentMealCount: number;
  missingMeals: MissingMeal[];
  totalMissingCount: number;
  isLoading: boolean;
  onQuickAdd: (date: string, mealType: MealType) => void;
}

export const MealPlanCompletionCard = ({
  totalPossibleMeals,
  currentMealCount,
  missingMeals,
  totalMissingCount,
  isLoading,
  onQuickAdd,
}: MealPlanCompletionCardProps) => {
  const completionPercentage = Math.round(
    (currentMealCount / totalPossibleMeals) * 100
  );

  return (
    <Card
      className={`${
        completionPercentage === 100
          ? "bg-green-50 border-green-200"
          : "bg-orange-50 border-orange-200"
      }`}
    >
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Meal Plan Completion</h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              completionPercentage === 100
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {completionPercentage}% Complete
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="text-sm text-gray-600">
            <strong>{currentMealCount}</strong> of{" "}
            <strong>{totalPossibleMeals}</strong> meals planned
          </div>
          {totalMissingCount > 0 && (
            <div className="text-sm text-orange-600">
              <strong>{totalMissingCount}</strong> meals missing
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              completionPercentage === 100 ? "bg-green-500" : "bg-orange-500"
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* Missing Meals Quick Add */}
        {missingMeals.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">
              Quick add missing meals:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingMeals.map((missing, index) => (
                <Button
                  key={`${missing.date}-${missing.mealType}`}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => onQuickAdd(missing.date, missing.mealType)}
                  disabled={isLoading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {missing.dateLabel} {missing.mealType.toLowerCase()}
                </Button>
              ))}
              {totalMissingCount > 6 && (
                <span className="text-xs text-gray-500 self-center">
                  +{totalMissingCount - 6} more...
                </span>
              )}
            </div>
          </div>
        )}

        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <span className="text-lg">🎉</span>
            <span>Your meal plan is complete! All meals are planned.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
