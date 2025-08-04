"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { MealType } from "@prisma/client";
import type { UserMeal } from "@/lib/types/user";
import type { GuestMeal } from "@/lib/types/guest";
import { MealSlot } from "./MealSlot";

interface MealDayCardProps {
  date: string;
  meals: Record<MealType, UserMeal | GuestMeal | null>;
  selectedMealForSwap: string | null;
  isSwapMode: boolean;
  isLoading: boolean;
  onMealClick: (mealId: string) => void;
  onRemoveMeal: (mealId: string) => void;
  onAddMeal: (date: string, mealType: MealType) => void;
}

export const MealDayCard = ({
  date,
  meals,
  selectedMealForSwap,
  isSwapMode,
  isLoading,
  onMealClick,
  onRemoveMeal,
  onAddMeal,
}: MealDayCardProps) => {
  const mealCount = Object.values(meals).filter(Boolean).length;
  const isComplete = mealCount === 3;
  const isEmpty = mealCount === 0;

  return (
    <Card
      className={`${
        isComplete
          ? "border-green-200 bg-green-50/30"
          : isEmpty
          ? "border-orange-200 bg-orange-50/30"
          : "border-yellow-200 bg-yellow-50/30"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(parseISO(date), "EEEE, MMMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isComplete
                  ? "bg-green-100 text-green-800"
                  : isEmpty
                  ? "bg-orange-100 text-orange-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {mealCount}/3 meals
            </span>
            {isComplete && <span className="text-green-600">✓</span>}
            {isEmpty && <span className="text-orange-600">!</span>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((mealType) => {
            const meal = meals[mealType];
            const isSelected = selectedMealForSwap === meal?.id;

            return (
              <MealSlot
                key={mealType}
                mealType={mealType}
                meal={meal}
                date={date}
                isSelected={isSelected}
                isSwapMode={isSwapMode}
                isLoading={isLoading}
                onMealClick={onMealClick}
                onRemoveMeal={onRemoveMeal}
                onAddMeal={onAddMeal}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
