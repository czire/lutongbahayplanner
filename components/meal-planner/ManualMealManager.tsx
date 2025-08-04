"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowUpDown, Calendar, Clock } from "lucide-react";
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
    } catch (error) {
      console.error("Failed to add meal:", error);
      alert("Failed to add meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a meal
  const handleRemoveMeal = async (mealId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this meal?"
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const updatedMealPlan = await removeMeal(mealPlan.id, mealId, isGuest);
      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
      }
    } catch (error) {
      console.error("Failed to remove meal:", error);
      alert("Failed to remove meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        }

        // Reset swap mode
        setIsSwapMode(false);
        setSelectedMealForSwap(null);
      } catch (error) {
        console.error("Failed to swap meals:", error);
        alert("Failed to swap meals. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const mealsByDate = getMealsByDate();
  const dateOptions = getDateOptions();

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipe</label>
                <Select
                  value={selectedRecipeId}
                  onValueChange={setSelectedRecipeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date.value} value={date.value}>
                        {date.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Meal Type</label>
                <Select
                  value={selectedMealType}
                  onValueChange={(value) =>
                    setSelectedMealType(value as MealType | "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                    <SelectItem value="LUNCH">Lunch</SelectItem>
                    <SelectItem value="DINNER">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddMeal} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Meal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant={isSwapMode ? "destructive" : "outline"}
          onClick={() => {
            setIsSwapMode(!isSwapMode);
            setSelectedMealForSwap(null);
          }}
        >
          <ArrowUpDown className="mr-2" size={16} />
          {isSwapMode ? "Cancel Swap" : "Swap Meals"}
        </Button>
      </div>

      {/* Swap Mode Instructions */}
      {isSwapMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-800">
              <strong>Swap Mode Active:</strong> Click on two meals to swap
              their positions.
              {selectedMealForSwap &&
                " Click on another meal to complete the swap."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Meal Plan Grid */}
      <div className="space-y-4">
        {Object.entries(mealsByDate).map(([date, meals]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {format(parseISO(date), "EEEE, MMMM dd, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map(
                  (mealType) => {
                    const meal = meals[mealType];
                    const isSelected = selectedMealForSwap === meal?.id;

                    return (
                      <div
                        key={mealType}
                        className={`p-4 border rounded-lg transition-all ${
                          meal
                            ? `bg-white hover:shadow-md cursor-pointer ${
                                isSelected
                                  ? "ring-2 ring-blue-500 bg-blue-50"
                                  : ""
                              } ${isSwapMode ? "hover:bg-blue-50" : ""}`
                            : "bg-gray-50 border-dashed"
                        }`}
                        onClick={() => meal && handleMealClick(meal.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">
                            {mealType.toLowerCase()}
                          </h4>
                          {meal && !isSwapMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMeal(meal.id);
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
                                <div>
                                  ₱{meal.recipe.costPerServing.toFixed(2)} per
                                  serving
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">
                            No meal planned
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
