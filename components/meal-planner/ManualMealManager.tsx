"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { MealType } from "@prisma/client";
import type { UserMealPlan, UserMeal } from "@/lib/types/user";
import type { GuestMealPlan, GuestMeal } from "@/lib/types/guest";
import {
  addMealManually,
  removeMeal,
  swapMeals,
  getAvailableRecipes,
} from "@/lib/actions/manual-meal-actions";
import { MealPlanCompletionCard } from "./MealPlanCompletionCard";
import { AddMealDialog } from "./AddMealDialog";
import { MealDayCard } from "./MealDayCard";
import { SwapModeCard } from "./SwapModeCard";
import { MealPlanActions } from "./MealPlanActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ManualMealManagerProps {
  mealPlan: UserMealPlan | GuestMealPlan;
  isGuest?: boolean;
  onMealPlanUpdate: (updatedMealPlan: UserMealPlan | GuestMealPlan) => void;
}

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  cookingTime: number;
  costPerServing: number;
  image: string | null;
}

export const ManualMealManager = ({
  mealPlan,
  isGuest = false,
  onMealPlanUpdate,
}: ManualMealManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSwapMode, setIsSwapMode] = useState(false);
  const [selectedMealForSwap, setSelectedMealForSwap] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [mealIdPendingRemoval, setMealIdPendingRemoval] = useState<
    string | null
  >(null);

  // Add meal form state
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<MealType | "">("");

  // Load available recipes on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipes = await getAvailableRecipes(isGuest);
        setAvailableRecipes(recipes);
      } catch (error) {
        console.error("Failed to load recipes:", error);
      }
    };

    loadRecipes();
  }, [isGuest]);

  // Generate date options for the meal plan duration
  const getDateOptions = () => {
    const startDate =
      typeof mealPlan.startDate === "string"
        ? parseISO(mealPlan.startDate)
        : mealPlan.startDate;
    const endDate =
      typeof mealPlan.endDate === "string"
        ? parseISO(mealPlan.endDate)
        : mealPlan.endDate;
    const dates = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push({
        value: currentDate.toISOString().split("T")[0],
        label: format(currentDate, "MMM dd, yyyy"),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Get meals grouped by date and type
  const getMealsByDate = () => {
    const mealsByDate: Record<
      string,
      Record<MealType, UserMeal | GuestMeal | null>
    > = {};

    getDateOptions().forEach(({ value }) => {
      mealsByDate[value] = {
        BREAKFAST: null,
        LUNCH: null,
        DINNER: null,
      };
    });

    mealPlan.meals.forEach((meal) => {
      const mealDate =
        typeof meal.date === "string"
          ? meal.date.split("T")[0]
          : meal.date.toISOString().split("T")[0];

      if (mealsByDate[mealDate]) {
        mealsByDate[mealDate][meal.type] = meal;
      }
    });

    return mealsByDate;
  };

  // Handle adding a new meal
  const handleAddMeal = async () => {
    if (!selectedRecipeId || !selectedDate || !selectedMealType) {
      alert("Please select a recipe, date, and meal type");
      return;
    }

    setIsLoading(true);
    try {
      const updatedMealPlan = await addMealManually(
        mealPlan.id,
        selectedRecipeId,
        selectedDate,
        selectedMealType as MealType,
        isGuest
      );

      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
      }

      // Reset form
      setSelectedRecipeId("");
      setSelectedDate("");
      setSelectedMealType("");
      setIsAddDialogOpen(false);
      toast.success("Meal added successfully!");
    } catch (error) {
      console.error("Failed to add meal:", error);
      toast.error("Failed to add meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog close - reset form
  const handleDialogClose = () => {
    setSelectedRecipeId("");
    setSelectedDate("");
    setSelectedMealType("");
    setIsAddDialogOpen(false);
  };

  // Handle removing a meal (open dialog)
  const handleRemoveMeal = (mealId: string) => {
    setMealIdPendingRemoval(mealId);
    setIsRemoveDialogOpen(true);
  };

  // Confirm removal
  const confirmRemoveMeal = async () => {
    if (!mealIdPendingRemoval) return;
    setIsLoading(true);
    try {
      const updatedMealPlan = await removeMeal(
        mealPlan.id,
        mealIdPendingRemoval,
        isGuest
      );
      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
        toast.success("Meal removed successfully!");
      }
    } catch (error) {
      console.error("Failed to remove meal:", error);
      toast.error("Failed to remove meal. Please try again.");
    } finally {
      setIsLoading(false);
      setMealIdPendingRemoval(null);
      setIsRemoveDialogOpen(false);
    }
  };

  const cancelRemoveMeal = () => {
    setMealIdPendingRemoval(null);
    setIsRemoveDialogOpen(false);
  };

  // Handle meal swapping
  const handleMealClick = async (mealId: string) => {
    if (!isSwapMode) return;

    if (!selectedMealForSwap) {
      setSelectedMealForSwap(mealId);
    } else if (selectedMealForSwap === mealId) {
      // Clicking the same meal cancels selection
      setSelectedMealForSwap(null);
    } else {
      // Swap meals
      setIsLoading(true);
      try {
        const updatedMealPlan = await swapMeals(
          mealPlan.id,
          selectedMealForSwap,
          mealId,
          isGuest
        );

        if (updatedMealPlan) {
          onMealPlanUpdate(updatedMealPlan);
          toast.success("Meals swapped successfully!");
        }

        // Reset swap mode
        setIsSwapMode(false);
        setSelectedMealForSwap(null);
      } catch (error) {
        console.error("Failed to swap meals:", error);
        toast.error("Failed to swap meals. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const mealsByDate = getMealsByDate();
  const dateOptions = getDateOptions();

  // Build availability of meal types per date (which meal types are still empty)
  const dateMealTypeAvailability: Record<string, MealType[]> = {};
  Object.entries(mealsByDate).forEach(([date, meals]) => {
    const available: MealType[] = [];
    (["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).forEach((mt) => {
      if (!meals[mt]) available.push(mt);
    });
    dateMealTypeAvailability[date] = available;
  });

  // Date options that still have at least one empty meal slot
  const dateOptionsWithAvailability = dateOptions.filter(
    (d) => dateMealTypeAvailability[d.value]?.length > 0
  );

  // Calculate meal plan completion statistics
  const getMealPlanStats = () => {
    const totalPossibleMeals = dateOptions.length * 3; // 3 meals per day
    const currentMealCount = mealPlan.meals.length;

    // Find missing meals
    const missingMeals: Array<{
      date: string;
      mealType: MealType;
      dateLabel: string;
    }> = [];
    Object.entries(mealsByDate).forEach(([date, meals]) => {
      (["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).forEach((mealType) => {
        if (!meals[mealType]) {
          const dateLabel = format(parseISO(date), "MMM dd");
          missingMeals.push({ date, mealType, dateLabel });
        }
      });
    });

    return {
      totalPossibleMeals,
      currentMealCount,
      missingMeals: missingMeals.slice(0, 6), // Show only first 6 missing meals
      totalMissingCount: missingMeals.length,
    };
  };

  const stats = getMealPlanStats();
  const isMealPlanCompleteFlag =
    stats.currentMealCount >= stats.totalPossibleMeals;

  // Handle quick add from completion card
  const handleQuickAdd = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsAddDialogOpen(true);
  };

  // Handle add meal from slot
  const handleAddMealFromSlot = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsAddDialogOpen(true);
  };

  // Handle toggle swap mode
  const handleToggleSwapMode = () => {
    setIsSwapMode(!isSwapMode);
    setSelectedMealForSwap(null);
  };

  return (
    <div className="space-y-6">
      {/* Meal Plan Completion Status */}
      <MealPlanCompletionCard
        totalPossibleMeals={stats.totalPossibleMeals}
        currentMealCount={stats.currentMealCount}
        missingMeals={stats.missingMeals}
        totalMissingCount={stats.totalMissingCount}
        isLoading={isLoading}
        onQuickAdd={handleQuickAdd}
      />

      {/* Action Buttons */}
      <MealPlanActions
        isAddDialogOpen={isAddDialogOpen}
        onAddDialogChange={(open) => {
          if (!open) handleDialogClose();
          else setIsAddDialogOpen(true);
        }}
        selectedRecipeId={selectedRecipeId}
        setSelectedRecipeId={setSelectedRecipeId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        availableRecipes={availableRecipes}
        dateOptions={dateOptionsWithAvailability}
        isLoading={isLoading}
        onAddMeal={handleAddMeal}
        onCancel={handleDialogClose}
        isSwapMode={isSwapMode}
        onToggleSwapMode={handleToggleSwapMode}
        isMealPlanComplete={isMealPlanCompleteFlag}
        dateMealTypeAvailability={dateMealTypeAvailability}
      />

      {/* Swap Mode Instructions */}
      {isSwapMode && <SwapModeCard selectedMealForSwap={selectedMealForSwap} />}

      {/* Meal Plan Grid */}
      <div className="space-y-4">
        {Object.entries(mealsByDate).map(([date, meals]) => (
          <MealDayCard
            key={date}
            date={date}
            meals={meals}
            selectedMealForSwap={selectedMealForSwap}
            isSwapMode={isSwapMode}
            isLoading={isLoading}
            onMealClick={handleMealClick}
            onRemoveMeal={handleRemoveMeal}
            onAddMeal={handleAddMealFromSlot}
          />
        ))}
      </div>

      <Dialog open={isRemoveDialogOpen} onOpenChange={cancelRemoveMeal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Meal</DialogTitle>
            <DialogDescription>
              This action will permanently remove the selected meal from this
              meal plan. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={cancelRemoveMeal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveMeal}
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove Meal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
