"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualMealManager } from "./ManualMealManager";
import { RecipeCard } from "./RecipeCard";
import { CostSummary } from "./CostSummary";
import { EmptyState } from "./EmptyState";
import { calculateRecipeCost } from "@/lib/utils/meal-plan-utils";
import { GuestRecipe } from "@/lib/types/guest";
import { UserMealPlan } from "@/lib/types/user";
import { GuestMealPlan } from "@/lib/types/guest";
import { ArrowRight, Settings, List } from "lucide-react";

interface MealPlanTabsProps {
  currentMealPlan: UserMealPlan | GuestMealPlan;
  filteredRecipes: GuestRecipe[];
  isGuest: boolean;
  onMealPlanUpdate: (updatedMealPlan: UserMealPlan | GuestMealPlan) => void;
}

export const MealPlanTabs = ({
  currentMealPlan,
  filteredRecipes,
  isGuest,
  onMealPlanUpdate,
}: MealPlanTabsProps) => {
  const [activeTab, setActiveTab] = useState("recipes");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {!isGuest && (
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <List size={16} />
            Recipes & Shopping List
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings size={16} />
            Manage Meals
          </TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="recipes" className="space-y-8 mt-6">
        {filteredRecipes.length > 0 ? (
          <div className="space-y-8">
            {/* Recipes Grid */}
            <div className="grid gap-6">
              {filteredRecipes.map((recipe: GuestRecipe) => {
                const recipeCost = calculateRecipeCost(recipe);
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    recipeCost={recipeCost}
                    calculateRecipeCost={calculateRecipeCost}
                  />
                );
              })}
            </div>

            {/* Cost Summary */}
            <CostSummary
              recipes={filteredRecipes}
              currentMealPlan={currentMealPlan as any}
              calculateRecipeCost={calculateRecipeCost}
            />
          </div>
        ) : (
          <EmptyState
            emoji="🍽️"
            title="No recipes found"
            description="Your meal plan doesn't have any recipes yet."
            actionHref="/meal-planner"
            actionText="Generate Meal Plan"
            actionIcon={<ArrowRight size={20} />}
          />
        )}
      </TabsContent>

      <TabsContent value="manage" className="mt-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Manual Meal Adjustments
            </h2>
            <p className="text-gray-600">
              Add, remove, or swap meals in your meal plan to customize it to
              your liking.
            </p>
          </div>

          <ManualMealManager
            mealPlan={currentMealPlan}
            isGuest={isGuest}
            onMealPlanUpdate={onMealPlanUpdate}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
