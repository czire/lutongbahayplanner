"use client";

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
import { Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { MealType } from "@prisma/client";

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

interface AddMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  isMealPlanComplete?: boolean;
  // New: Available meal types for each date
  dateMealTypeAvailability?: Record<string, MealType[]>;
}

export const AddMealDialog = ({
  isOpen,
  onOpenChange,
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
  isMealPlanComplete = false,
  dateMealTypeAvailability = {},
}: AddMealDialogProps) => {
  const addDisabled = isMealPlanComplete || isLoading;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className=""
          disabled={isMealPlanComplete}
          title={
            isMealPlanComplete ? "Meal plan is already complete" : undefined
          }
        >
          <Plus className="mr-2" size={16} />
          {isMealPlanComplete ? "Plan Complete" : "Add Meal"}
        </Button>
      </DialogTrigger>
      {!isMealPlanComplete && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Meal</DialogTitle>
            {selectedDate && selectedMealType && (
              <p className="text-sm text-gray-600">
                Adding {selectedMealType.toLowerCase()} for{" "}
                {format(parseISO(selectedDate), "MMMM dd, yyyy")}
              </p>
            )}
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
                  {(
                    dateMealTypeAvailability[selectedDate] ||
                    (["BREAKFAST", "LUNCH", "DINNER"] as MealType[])
                  ).map((mt) => (
                    <SelectItem key={mt} value={mt}>
                      {mt.charAt(0) + mt.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onAddMeal}
              disabled={addDisabled}
              aria-disabled={addDisabled}
            >
              {isLoading ? "Adding..." : "Add Meal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
