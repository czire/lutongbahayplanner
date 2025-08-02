import { useUser } from "@/lib/contexts/UserContext";

export function useMealPlanAccess(mealPlanId: string | string[]) {
  const { mealPlans, generatedRecipes, isGuest, isLoading, isAuthenticated } =
    useUser();

  // Find the specific meal plan by ID
  const currentMealPlan = mealPlans.find((plan) => plan.id === mealPlanId);

  // Security: For guests, additional validation that the meal plan belongs to current session
  const isValidAccess = isGuest
    ? currentMealPlan && mealPlans.includes(currentMealPlan)
    : isAuthenticated && currentMealPlan;

  // Extract recipes for the specific meal plan
  const filteredRecipes = generatedRecipes.filter((recipe) =>
    currentMealPlan?.meals?.some((meal) => meal.recipe?.id === recipe.id)
  );

  return {
    currentMealPlan,
    filteredRecipes,
    isValidAccess,
    isGuest,
    isLoading,
    isAuthenticated,
    mealPlans,
  };
}
