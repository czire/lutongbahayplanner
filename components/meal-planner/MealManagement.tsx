"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  ArrowUpDown,
  Edit,
  Calendar,
  Clock,
  DollarSign,
  ChefHat,
} from "lucide-react";
import type { MealType } from "@prisma/client";
import type { UserMealPlan, UserMeal, UserRecipe } from "@/lib/types/user";
import type { GuestRecipe } from "@/lib/types/guest";
import {
  addMealToMealPlan,
  removeMealFromMealPlan,
  swapMealsInMealPlan,
  updateMealInMealPlan,
  getAvailableRecipes,
} from "@/lib/actions/meal-plan-actions";

interface MealManagementProps {
  mealPlan: UserMealPlan;
  isGuest: boolean;
  onMealPlanUpdate: (updatedMealPlan: UserMealPlan) => void;
}

interface AvailableRecipe extends UserRecipe {
  // Add any additional properties if needed
}

export function MealManagement({
  mealPlan,
  isGuest,
  onMealPlanUpdate,
}: MealManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableRecipes, setAvailableRecipes] = useState<AvailableRecipe[]>(
    []
  );
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [showEditMealDialog, setShowEditMealDialog] = useState(false);
  const [selectedMealForEdit, setSelectedMealForEdit] =
    useState<UserMeal | null>(null);
  const [swapMode, setSwapMode] = useState(false);
  const [firstSwapMeal, setFirstSwapMeal] = useState<UserMeal | null>(null);

  // New meal form state
  const [newMealData, setNewMealData] = useState({
    recipeId: "",
    type: "BREAKFAST" as MealType,
    date: new Date().toISOString().split("T")[0],
  });

  // Load available recipes when needed
  const loadAvailableRecipes = async () => {
    if (availableRecipes.length === 0) {
      try {
        const recipes = await getAvailableRecipes();
        setAvailableRecipes(recipes as AvailableRecipe[]);
      } catch (error) {
        console.error("Failed to load recipes:", error);
      }
    }
  };

  // Add new meal
  const handleAddMeal = async () => {
    setIsLoading(true);
    try {
      const updatedMealPlan = await addMealToMealPlan(
        mealPlan.id,
        {
          recipeId: newMealData.recipeId,
          type: newMealData.type,
          date: new Date(newMealData.date),
        },
        isGuest
      );

      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
        setShowAddMealDialog(false);
        setNewMealData({
          recipeId: "",
          type: "BREAKFAST",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Failed to add meal:", error);
      alert("Failed to add meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove meal
  const handleRemoveMeal = async (mealId: string) => {
    setIsLoading(true);
    try {
      const updatedMealPlan = await removeMealFromMealPlan(
        mealPlan.id,
        mealId,
        isGuest
      );

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

  // Start swap process
  const handleStartSwap = (meal: UserMeal) => {
    if (!firstSwapMeal) {
      setFirstSwapMeal(meal);
      setSwapMode(true);
    } else {
      // Complete the swap
      handleSwapMeals(firstSwapMeal.id, meal.id);
    }
  };

  // Swap meals
  const handleSwapMeals = async (mealId1: string, mealId2: string) => {
    setIsLoading(true);
    try {
      const updatedMealPlan = await swapMealsInMealPlan(
        mealPlan.id,
        mealId1,
        mealId2,
        isGuest
      );

      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
        setSwapMode(false);
        setFirstSwapMeal(null);
      }
    } catch (error) {
      console.error("Failed to swap meals:", error);
      alert("Failed to swap meals. Please try again.");
      setSwapMode(false);
      setFirstSwapMeal(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel swap
  const handleCancelSwap = () => {
    setSwapMode(false);
    setFirstSwapMeal(null);
  };

  // Edit meal
  const handleEditMeal = async (
    updates: Partial<{
      recipeId: string;
      type: MealType;
      date: Date;
    }>
  ) => {
    if (!selectedMealForEdit) return;

    setIsLoading(true);
    try {
      const updatedMealPlan = await updateMealInMealPlan(
        mealPlan.id,
        selectedMealForEdit.id,
        updates,
        isGuest
      );

      if (updatedMealPlan) {
        onMealPlanUpdate(updatedMealPlan);
        setShowEditMealDialog(false);
        setSelectedMealForEdit(null);
      }
    } catch (error) {
      console.error("Failed to update meal:", error);
      alert("Failed to update meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMealTypeEmoji = (type: MealType) => {
    switch (type) {
      case "BREAKFAST":
        return "🌅";
      case "LUNCH":
        return "☀️";
      case "DINNER":
        return "🌙";
      default:
        return "🍽️";
    }
  };

  const getMealTypeColor = (type: MealType) => {
    switch (type) {
      case "BREAKFAST":
        return "from-yellow-400 to-orange-400";
      case "LUNCH":
        return "from-orange-400 to-red-400";
      case "DINNER":
        return "from-purple-400 to-blue-400";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manual Meal Adjustments
          </h2>
          <p className="text-gray-600">
            Add, remove, or swap meals in your plan
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add Meal Button */}
          <Dialog open={showAddMealDialog} onOpenChange={setShowAddMealDialog}>
            <DialogTrigger asChild>
              <Button onClick={loadAvailableRecipes} disabled={isLoading}>
                <Plus className="mr-2" size={16} />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Meal</DialogTitle>
                <DialogDescription>
                  Select a recipe and set the meal details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipe-select">Recipe</Label>
                  <Select
                    value={newMealData.recipeId}
                    onValueChange={(value) =>
                      setNewMealData((prev) => ({ ...prev, recipeId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRecipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          <div className="flex items-center gap-2">
                            <span>{recipe.name}</span>
                            <span className="text-sm text-gray-500">
                              ₱{recipe.costPerServing}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select
                    value={newMealData.type}
                    onValueChange={(value) =>
                      setNewMealData((prev) => ({
                        ...prev,
                        type: value as MealType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BREAKFAST">🌅 Breakfast</SelectItem>
                      <SelectItem value="LUNCH">☀️ Lunch</SelectItem>
                      <SelectItem value="DINNER">🌙 Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="meal-date">Date</Label>
                  <Input
                    type="date"
                    value={newMealData.date}
                    onChange={(e) =>
                      setNewMealData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddMealDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMeal}
                  disabled={!newMealData.recipeId || isLoading}
                >
                  {isLoading ? "Adding..." : "Add Meal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Swap Mode Toggle */}
          {swapMode && (
            <Button variant="outline" onClick={handleCancelSwap}>
              Cancel Swap
            </Button>
          )}
        </div>
      </div>

      {/* Swap Mode Notice */}
      {swapMode && firstSwapMeal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-blue-600" size={20} />
            <span className="font-medium text-blue-900">Swap Mode Active</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            First meal selected: {firstSwapMeal.recipe.name} (
            {firstSwapMeal.type}). Click another meal to complete the swap.
          </p>
        </div>
      )}

      {/* Meals List */}
      <div className="grid gap-4">
        {mealPlan.meals.map((meal) => (
          <Card
            key={meal.id}
            className={`transition-all duration-200 ${
              swapMode && firstSwapMeal?.id === meal.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getMealTypeColor(
                      meal.type
                    )}`}
                  >
                    <span>{getMealTypeEmoji(meal.type)}</span>
                    <span>{meal.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(meal.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMealForEdit(meal);
                      setShowEditMealDialog(true);
                      loadAvailableRecipes();
                    }}
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                  </Button>

                  {/* Swap Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartSwap(meal)}
                    disabled={isLoading}
                    className={
                      swapMode && firstSwapMeal?.id === meal.id
                        ? "bg-blue-100"
                        : ""
                    }
                  >
                    <ArrowUpDown size={16} />
                  </Button>

                  {/* Remove Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Meal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{meal.recipe.name}"
                          from your meal plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {meal.recipe.name}
                  </h3>
                  {meal.recipe.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {meal.recipe.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{meal.recipe.cookingTime} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat size={14} />
                      <span>{meal.recipe.servings} servings</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₱{meal.recipe.costPerServing}
                  </div>
                  <div className="text-sm text-gray-500">per serving</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Meal Dialog */}
      {selectedMealForEdit && (
        <Dialog open={showEditMealDialog} onOpenChange={setShowEditMealDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Meal</DialogTitle>
              <DialogDescription>Update the meal details.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Recipe</Label>
                <Select
                  value={selectedMealForEdit.recipeId}
                  onValueChange={(value) => handleEditMeal({ recipeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        <div className="flex items-center gap-2">
                          <span>{recipe.name}</span>
                          <span className="text-sm text-gray-500">
                            ₱{recipe.costPerServing}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Meal Type</Label>
                <Select
                  value={selectedMealForEdit.type}
                  onValueChange={(value) =>
                    handleEditMeal({ type: value as MealType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">🌅 Breakfast</SelectItem>
                    <SelectItem value="LUNCH">☀️ Lunch</SelectItem>
                    <SelectItem value="DINNER">🌙 Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={
                    new Date(selectedMealForEdit.date)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    handleEditMeal({ date: new Date(e.target.value) })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditMealDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
