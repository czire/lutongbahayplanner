import { useUser } from "@/lib/contexts/UserContext";

export function useMealPlanAccess(mealPlanId: string | string[]) {
  const {
    savedMealPlans,
    generatedMealPlans,
    generatedRecipes,
    isGuest,
    isLoading,
    isAuthenticated,
    isLoadingMealPlans,
  } = useUser();

  // Overall loading state - if user context or meal plans are still loading
  const isOverallLoading = isLoading || isLoadingMealPlans;

  // Combine all meal plans to search in both saved and generated
  const allMealPlans = [
    ...(savedMealPlans || []),
    ...(generatedMealPlans || []),
  ];

  // Find the specific meal plan by ID
  const currentMealPlan = allMealPlans.find((plan) => plan.id === mealPlanId);

  // Security: Enhanced validation with proper loading states
  const isValidAccess = (() => {
    // Still loading - don't determine access yet
    if (isOverallLoading) {
      return true; // Assume valid while loading
    }

    // Guests: Check if meal plan exists in their session
    if (isGuest) {
      return currentMealPlan && allMealPlans.includes(currentMealPlan);
    }

    // Authenticated users: Check if meal plan exists and user is authenticated
    if (isAuthenticated) {
      return !!currentMealPlan;
    }

    // Not authenticated and not guest - invalid
    return false;
  })();

  // Extract recipes for the specific meal plan
  const filteredRecipes = generatedRecipes.filter((recipe) =>
    currentMealPlan?.meals?.some((meal) => meal.recipe?.id === recipe.id)
  );

  return {
    currentMealPlan,
    filteredRecipes,
    isValidAccess,
    isGuest,
    isLoading: isOverallLoading, // Return overall loading state
    isAuthenticated,
    mealPlans: allMealPlans, // For backward compatibility
    savedMealPlans,
    generatedMealPlans,
  };
}
